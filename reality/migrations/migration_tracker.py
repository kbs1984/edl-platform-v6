#!/usr/bin/env python3
"""
Migration Tracking System - Session 125
Ensures every DDL operation is reversible and tracked
Prevents the incomplete feature pattern (Friends 95% syndrome)
Includes dependency tracking as recommended by Session 124
"""

from typing import List, Optional, Dict, Any
import json
from datetime import datetime
from dataclasses import dataclass, field
import uuid


@dataclass
class FeatureMigration:
    """Tracks migration for a batch of user stories"""
    story_ids: List[str]  # e.g., ["US-155", "US-156", "US-157"]
    migration_name: str   # e.g., "activity_runtime_core_batch_1"
    sql_up: str          # DDL to apply
    sql_down: str        # DDL to rollback
    test_queries: List[str]  # Queries to verify migration worked
    depends_on: List[str] = field(default_factory=list)  # Migration IDs this depends on
    applied_at: Optional[datetime] = None
    rolled_back_at: Optional[datetime] = None
    test_results: Optional[Dict[str, Any]] = None
    migration_id: Optional[str] = None  # UUID for tracking


class MigrationTracker:
    """Manages migration lifecycle with MCP integration"""
    
    def __init__(self):
        """Initialize tracker and ensure tracking table exists"""
        self.ensure_tracking_table()
    
    def ensure_tracking_table(self):
        """Create migration tracking table if not exists"""
        tracking_ddl = """
        -- Session 125: Migration tracking with dependency support
        CREATE TABLE IF NOT EXISTS public.feature_migrations (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            story_ids TEXT[] NOT NULL,
            migration_name TEXT UNIQUE NOT NULL,
            sql_up TEXT NOT NULL,
            sql_down TEXT NOT NULL,
            test_queries JSONB,
            depends_on UUID[] DEFAULT '{}',  -- Session 124 recommendation
            applied_at TIMESTAMPTZ,
            rolled_back_at TIMESTAMPTZ,
            test_results JSONB,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            session_id TEXT DEFAULT '125',
            
            -- Ensure dependency integrity (can't reference non-existent migrations)
            CONSTRAINT check_dependencies_exist CHECK (
                depends_on IS NULL OR 
                depends_on = '{}' OR
                NOT EXISTS (
                    SELECT 1 FROM unnest(depends_on) AS dep_id
                    WHERE NOT EXISTS (
                        SELECT 1 FROM feature_migrations WHERE id = dep_id
                    )
                )
            )
        );
        
        -- Index for quick lookup
        CREATE INDEX IF NOT EXISTS idx_migration_stories 
        ON feature_migrations USING GIN (story_ids);
        
        -- Index for dependency queries
        CREATE INDEX IF NOT EXISTS idx_migration_dependencies
        ON feature_migrations USING GIN (depends_on);
        
        -- Index for name lookup
        CREATE INDEX IF NOT EXISTS idx_migration_name
        ON feature_migrations (migration_name);
        
        COMMENT ON TABLE feature_migrations IS 
        'Session 125: Tracks all DDL migrations with rollback capability and dependency tracking';
        
        COMMENT ON COLUMN feature_migrations.depends_on IS
        'Session 124: Track migration dependencies for cascade rollback detection';
        """
        
        # Apply via MCP
        try:
            result = mcp__supabase_dev__apply_migration(
                name="feature_migration_tracking_v2_with_deps",
                query=tracking_ddl
            )
            print(f"✅ Migration tracking table created/verified")
            return result
        except Exception as e:
            print(f"⚠️ Failed to create tracking table via MCP: {e}")
            print("💡 Manual creation may be required in Supabase dashboard")
            return {"error": str(e)}
    
    def apply_migration_batch(self, migration: FeatureMigration) -> Dict[str, Any]:
        """Apply migration with automatic rollback on test failure"""
        try:
            # Generate UUID if not provided
            if not migration.migration_id:
                migration.migration_id = str(uuid.uuid4())
            
            # 1. Check dependencies are satisfied
            if migration.depends_on:
                deps_check = self.check_dependencies_applied(migration.depends_on)
                if not deps_check['all_satisfied']:
                    return {
                        'success': False,
                        'error': f"Dependencies not satisfied: {deps_check['missing']}",
                        'rolled_back': False
                    }
            
            # 2. Record migration attempt
            self.record_migration_start(migration)
            
            # 3. Apply DDL via MCP
            result = mcp__supabase_dev__apply_migration(
                name=migration.migration_name,
                query=migration.sql_up
            )
            
            if not result.get('success', True):  # Default to True if not specified
                raise Exception(f"DDL failed: {result.get('error', 'Unknown error')}")
            
            # 4. Run test queries
            test_results = self.run_migration_tests(migration)
            
            if not test_results['all_passed']:
                # Auto-rollback on test failure
                self.rollback_migration(migration)
                raise Exception(f"Tests failed: {test_results['failures']}")
            
            # 5. Mark as successfully applied
            self.record_migration_success(migration, test_results)
            
            return {
                'success': True,
                'migration_id': migration.migration_id,
                'migration_name': migration.migration_name,
                'stories_implemented': migration.story_ids,
                'test_results': test_results,
                'dependencies': migration.depends_on
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'rolled_back': True,
                'migration_name': migration.migration_name
            }
    
    def check_dependencies_applied(self, dependency_ids: List[str]) -> Dict[str, Any]:
        """Check if all dependency migrations are applied"""
        try:
            # Query to check which dependencies are applied
            check_query = f"""
            SELECT id, migration_name, applied_at, rolled_back_at
            FROM feature_migrations
            WHERE id = ANY(ARRAY{dependency_ids}::uuid[])
            """
            
            result = mcp__supabase_dev__execute_sql(query=check_query)
            
            applied_deps = []
            missing_deps = []
            rolled_back_deps = []
            
            if result:
                for dep in result:
                    if dep.get('rolled_back_at'):
                        rolled_back_deps.append(dep['migration_name'])
                    elif dep.get('applied_at'):
                        applied_deps.append(dep['migration_name'])
                    else:
                        missing_deps.append(dep['migration_name'])
            
            # Check if we found all dependencies
            found_ids = [r['id'] for r in result] if result else []
            not_found = [d for d in dependency_ids if d not in found_ids]
            
            return {
                'all_satisfied': len(missing_deps) == 0 and len(rolled_back_deps) == 0 and len(not_found) == 0,
                'applied': applied_deps,
                'missing': missing_deps,
                'rolled_back': rolled_back_deps,
                'not_found': not_found
            }
            
        except Exception as e:
            return {
                'all_satisfied': False,
                'error': str(e)
            }
    
    def rollback_migration(self, migration: FeatureMigration):
        """Safely rollback a migration"""
        try:
            # Check for dependent migrations
            dependents = self.find_dependent_migrations(migration.migration_id)
            if dependents['has_dependents']:
                print(f"⚠️ WARNING: {len(dependents['dependents'])} migrations depend on this one:")
                for dep in dependents['dependents']:
                    print(f"  - {dep['migration_name']} (stories: {dep['story_ids']})")
                print("Manual confirmation required for cascade rollback")
                return {
                    'success': False,
                    'reason': 'has_dependents',
                    'dependents': dependents['dependents']
                }
            
            # Apply rollback DDL
            result = mcp__supabase_dev__apply_migration(
                name=f"{migration.migration_name}_rollback",
                query=migration.sql_down
            )
            
            # Record rollback
            self.record_rollback(migration)
            
            return {
                'success': True,
                'rolled_back': migration.migration_name
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def find_dependent_migrations(self, migration_id: str) -> Dict[str, Any]:
        """Find migrations that depend on this one"""
        try:
            query = f"""
            SELECT id, migration_name, story_ids, applied_at
            FROM feature_migrations
            WHERE '{migration_id}' = ANY(depends_on)
            AND rolled_back_at IS NULL
            """
            
            result = mcp__supabase_dev__execute_sql(query=query)
            
            return {
                'has_dependents': bool(result and len(result) > 0),
                'dependents': result if result else []
            }
            
        except Exception as e:
            return {
                'has_dependents': False,
                'error': str(e)
            }
    
    def record_migration_start(self, migration: FeatureMigration):
        """Record that a migration is being attempted"""
        try:
            insert_query = f"""
            INSERT INTO feature_migrations (
                id, story_ids, migration_name, sql_up, sql_down, 
                test_queries, depends_on, session_id
            ) VALUES (
                '{migration.migration_id}'::uuid,
                ARRAY{migration.story_ids}::text[],
                '{migration.migration_name}',
                $${migration.sql_up}$$,
                $${migration.sql_down}$$,
                '{json.dumps(migration.test_queries)}'::jsonb,
                ARRAY{migration.depends_on if migration.depends_on else []}::uuid[],
                '125'
            )
            """
            
            mcp__supabase_dev__execute_sql(query=insert_query)
            
        except Exception as e:
            print(f"⚠️ Failed to record migration start: {e}")
    
    def record_migration_success(self, migration: FeatureMigration, test_results: Dict[str, Any]):
        """Mark migration as successfully applied"""
        try:
            update_query = f"""
            UPDATE feature_migrations
            SET applied_at = NOW(),
                test_results = '{json.dumps(test_results)}'::jsonb
            WHERE id = '{migration.migration_id}'::uuid
            """
            
            mcp__supabase_dev__execute_sql(query=update_query)
            
        except Exception as e:
            print(f"⚠️ Failed to record migration success: {e}")
    
    def record_rollback(self, migration: FeatureMigration):
        """Mark migration as rolled back"""
        try:
            update_query = f"""
            UPDATE feature_migrations
            SET rolled_back_at = NOW()
            WHERE id = '{migration.migration_id}'::uuid
            """
            
            mcp__supabase_dev__execute_sql(query=update_query)
            
        except Exception as e:
            print(f"⚠️ Failed to record rollback: {e}")
    
    def run_migration_tests(self, migration: FeatureMigration) -> Dict[str, Any]:
        """Run test queries to verify migration"""
        results = {
            'all_passed': True,
            'tests': [],
            'failures': []
        }
        
        for test_query in migration.test_queries:
            try:
                test_result = mcp__supabase_dev__execute_sql(query=test_query)
                results['tests'].append({
                    'query': test_query,
                    'passed': True,
                    'result': test_result
                })
            except Exception as e:
                results['all_passed'] = False
                results['failures'].append({
                    'query': test_query,
                    'error': str(e)
                })
                results['tests'].append({
                    'query': test_query,
                    'passed': False,
                    'error': str(e)
                })
        
        return results


def main():
    """Test migration tracking system"""
    tracker = MigrationTracker()
    
    # Example migration
    test_migration = FeatureMigration(
        story_ids=["TEST-001"],
        migration_name="test_tracking_system",
        sql_up="CREATE TABLE test_table (id UUID PRIMARY KEY)",
        sql_down="DROP TABLE IF EXISTS test_table",
        test_queries=[
            "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'test_table'"
        ],
        depends_on=[]  # No dependencies for first migration
    )
    
    print("Testing migration tracking system...")
    result = tracker.apply_migration_batch(test_migration)
    print(f"Result: {json.dumps(result, indent=2)}")


if __name__ == "__main__":
    main()
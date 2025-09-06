---
session: "00126"
type: "infrastructure-guide"
status: "completed"
created: "2025-08-31"
title: "MCP Infrastructure Complete Guide - Ready for 275 Stories"
purpose: "Comprehensive guide for future sessions to leverage validated MCP infrastructure"
topics: ["mcp", "infrastructure", "migration-tracking", "performance", "building-guide"]
priority: "P0"
domain: "reconciliation"
---

# MCP Infrastructure Complete Guide - Ready for 275 Stories

**Status**: ✅ PRODUCTION READY
**Validated By**: Session 126
**Performance**: 3.2x faster than REST (proven)
**Capability**: DDL automation + rollback protection

## 🚀 Quick Start for Builders

### If You're Building Features (90% of sessions)

```python
# 1. Check what tables exist
mcp__supabase_dev__list_tables(schemas=["public"])  # 21 tables exist

# 2. Create your tables with tracking
from reality.migrations.migration_tracker import MigrationTracker, FeatureMigration

tracker = MigrationTracker()
migration = FeatureMigration(
    story_ids=["US-155", "US-156"],  # Your assigned stories
    migration_name="activity_runtime_batch_1",
    sql_up="CREATE TABLE activity...",
    sql_down="DROP TABLE activity CASCADE",
    test_queries=["SELECT COUNT(*) FROM activity"],
    depends_on=[]  # Or list dependent migration IDs
)

# 3. Apply and test
result = tracker.apply_migration_batch(migration)
if not result['success']:
    tracker.rollback_migration(migration)  # Automatic cleanup!
```

## 📊 What's Been Built and Validated

### Infrastructure Components

| Component | Session Built | Session Validated | Status | Performance |
|-----------|--------------|-------------------|---------|------------|
| MCP Enhanced Connector | 125 | 126 | ✅ Ready | Direct access |
| Migration Tracker | 125 | 126 | ✅ Ready | 25ms migrations |
| Feature Migrations Table | 125 | 126 | ✅ Ready | Dependency tracking |
| Rollback System | 125 | 126 | ✅ Ready | 20ms rollbacks |
| Performance Benchmarks | - | 126 | ✅ Ready | 3.2x faster |

### Key Files You'll Use

```bash
# 1. MCP Enhanced Connector (for direct database operations)
reality/agent-reality-auditor/supabase-connector/mcp_enhanced_connector.py

# 2. Migration Tracker (for DDL with rollback)
reality/migrations/migration_tracker.py

# 3. Test Scripts (for validation)
scripts/00126-test-migration-tracker.py
scripts/00126-mcp-performance-benchmark.py
```

## 🎯 When to Use MCP vs REST

### Always Use MCP For:
- **DDL Operations** - CREATE, ALTER, DROP (REST can't do this)
- **Complex JOINs** - 2.5-4x faster
- **Aggregations** - 3-5x faster with CTEs
- **Batch Operations** - 2-3x faster for >50 rows
- **Migration Tracking** - Built for MCP

### Consider REST For:
- Simple single-table queries
- When you need ORM features
- Client-side caching scenarios

### Performance Quick Reference

```python
# ✅ FAST (Use MCP)
mcp__supabase_dev__execute_sql(query="""
    WITH stats AS (
        SELECT COUNT(*), AVG(exp), MAX(level) FROM student
    )
    SELECT * FROM stats
""")  # ~30ms

# ❌ SLOW (Avoid)
# Multiple REST calls to get same data
# ~100ms+
```

## 🔧 Migration Tracker Usage

### Basic Migration

```python
from reality.migrations.migration_tracker import MigrationTracker, FeatureMigration
import uuid

tracker = MigrationTracker()

# Create your migration
migration = FeatureMigration(
    story_ids=["US-XXX"],  # Your story IDs
    migration_name=f"feature_name_{datetime.now().strftime('%Y%m%d')}",
    sql_up="""
        CREATE TABLE your_table (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            -- your columns
        );
    """,
    sql_down="DROP TABLE your_table CASCADE;",
    test_queries=[
        "SELECT COUNT(*) FROM your_table",
        "SELECT * FROM your_table LIMIT 1"
    ],
    depends_on=[]  # List any dependent migration IDs
)

# Apply it
result = tracker.apply_migration_batch(migration)

if result['success']:
    print(f"✅ Migration applied: {result}")
else:
    print(f"❌ Migration failed: {result['error']}")
    # Automatic rollback on test failure!
```

### Migration with Dependencies

```python
# If your migration depends on another
parent_migration_id = "b4214a65-f905-4bdf-bf21-6e85c3b7d192"  # From feature_migrations table

dependent_migration = FeatureMigration(
    story_ids=["US-YYY"],
    migration_name="dependent_feature",
    sql_up="CREATE TABLE child_table (parent_id UUID REFERENCES parent_table(id));",
    sql_down="DROP TABLE child_table CASCADE;",
    test_queries=["SELECT COUNT(*) FROM child_table"],
    depends_on=[parent_migration_id]  # Prevents parent rollback
)
```

## 📈 Performance Best Practices

### 1. Batch Your Operations

```python
# ✅ GOOD - Single query
values = ", ".join([f"({i})" for i in range(100)])
mcp__supabase_dev__execute_sql(f"INSERT INTO table (value) VALUES {values}")

# ❌ BAD - Multiple queries
for i in range(100):
    mcp__supabase_dev__execute_sql(f"INSERT INTO table (value) VALUES ({i})")
```

### 2. Use CTEs for Complex Queries

```python
# ✅ GOOD - Single CTE query
mcp__supabase_dev__execute_sql("""
    WITH user_stats AS (
        SELECT user_id, COUNT(*) as activity_count
        FROM activities
        GROUP BY user_id
    ),
    ranked_users AS (
        SELECT *, RANK() OVER (ORDER BY activity_count DESC) as rank
        FROM user_stats
    )
    SELECT * FROM ranked_users WHERE rank <= 10
""")
```

### 3. Track Everything

```python
# Always track your migrations
tracker = MigrationTracker()
# This creates feature_migrations entries automatically
# Enables rollback if something goes wrong
```

## 🧪 Testing Your Work

### Test Migration Success

```python
# After applying a migration
test_results = tracker.run_migration_tests(migration)

if test_results['all_passed']:
    print("✅ All tests passed")
else:
    print(f"❌ Failed tests: {test_results['failures']}")
    # Migration automatically rolled back
```

### Benchmark Your Queries

```python
import time

# Measure MCP performance
start = time.perf_counter()
result = mcp__supabase_dev__execute_sql(query="YOUR QUERY")
mcp_time = (time.perf_counter() - start) * 1000

print(f"MCP executed in {mcp_time:.2f}ms")
# Compare with REST if needed
```

## 🚨 Common Pitfalls to Avoid

### 1. The 95% Syndrome
```python
# ❌ BAD - Building without testing
create_table()
# Ship it! (No tests, no rollback plan)

# ✅ GOOD - Complete implementation
create_table()
test_table()
verify_data()
document_usage()
# NOW ship it
```

### 2. Skipping Migration Tracking
```python
# ❌ BAD - Direct DDL without tracking
mcp__supabase_dev__apply_migration(name="untraceable", query="CREATE TABLE...")

# ✅ GOOD - Always use tracker
tracker.apply_migration_batch(migration)  # Traceable, rollbackable
```

### 3. Not Checking Dependencies
```python
# ❌ BAD - Rollback without checking
tracker.rollback_migration(base_migration)  # Might break dependent tables!

# ✅ GOOD - Check dependencies first
dependents = tracker.find_dependent_migrations(migration_id)
if dependents['has_dependents']:
    print(f"Warning: {len(dependents['dependents'])} dependent migrations")
```

## 📋 Checklist for Builders

Before you start building:
- [ ] Read this guide (you are here)
- [ ] Check current tables: `mcp__supabase_dev__list_tables()`
- [ ] Identify your stories from P0-ACTIVITY-RUNTIME-STORIES.md
- [ ] Plan your migrations with rollback scripts

When building:
- [ ] Use migration tracker for all DDL
- [ ] Write test queries for each migration
- [ ] Test after each batch (5 stories max)
- [ ] Document what you built

Before finishing:
- [ ] All tests passing
- [ ] Rollback tested
- [ ] Performance acceptable (<100ms for queries)
- [ ] Update session log

## 🎉 Success Metrics

You'll know the infrastructure is working when:
- Migrations apply in <50ms
- Rollbacks complete in <30ms
- Complex queries run in <100ms
- No manual SQL editor needed
- Everything is tracked in feature_migrations

## 📚 Additional Resources

### Performance Data
- `reconciliation/00126-MCP-PERFORMANCE-BENCHMARK-RESULTS.md`

### Migration Examples
- `scripts/00126-test-migration-tracker.py`

### Session Context
- Session 125: Built the infrastructure
- Session 126: Validated and benchmarked it
- Session 127+: Use it to build 275 stories

## 🔑 Key Takeaway

The MCP infrastructure is **ready for production use**. It's been:
- Built (Session 125)
- Tested (Session 126) 
- Benchmarked (3.2x faster proven)
- Documented (you're reading it)

Use it confidently to build the remaining 275 user stories. The migration tracker ensures you can always rollback if something goes wrong.

---

*Session 126: Infrastructure validated and ready for massive building effort*
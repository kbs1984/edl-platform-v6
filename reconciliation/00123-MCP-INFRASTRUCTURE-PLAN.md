---
session: "00123"
type: "implementation-plan"
status: "ready"
created: "2025-08-31"
modified: "2025-08-31"
title: "MCP-Agent Infrastructure Plan - Enabling 80% Platform Building"
purpose: "Comprehensive plan to integrate MCP servers with Reality Agents for building 275 user stories"
topics: ["mcp", "infrastructure", "reality-agents", "user-stories", "implementation"]
priority: "P0"
domain: "reconciliation"
implements: ["truth-seed-adoption", "v5-integration", "canvas-requirements"]
time_estimate: "4 weeks foundation, ongoing feature building"
---

# MCP-Agent Infrastructure Plan - Enabling 80% Platform Building

## Executive Summary

This plan integrates MCP servers with Reality Agents to create unified development infrastructure supporting both immediate needs (testing existing features) and long-term building (275 user stories, v5 pattern integration). The infrastructure becomes the engine for building the remaining 80% of the EDL platform efficiently.

## 🚨 MANDATORY CONTEXT LOADING 🚨

**EVERY SESSION working on this plan MUST load this context FIRST:**

### Step 1: YAML Queries (Run in Order)
```bash
# 1. Load MCP-related work
python3 scripts/00059-yaml-query.py --topic "mcp" --limit 20
python3 scripts/00059-yaml-query.py --session "00105" # MCP placeholders origin
python3 scripts/00059-yaml-query.py --session "00120" # MCP server installation

# 2. Load user stories and requirements
python3 scripts/00059-yaml-query.py --topic "user-stories"
python3 scripts/00059-yaml-query.py --topic "activity-runtime"
python3 scripts/00059-yaml-query.py --topic "canvas-requirements"

# 3. Load Reality Agent architecture
python3 scripts/00059-yaml-query.py --topic "reality-agents"
python3 scripts/00059-yaml-query.py --topic "integration"

# 4. Load truth-seed context
python3 scripts/00059-yaml-query.py --topic "truth-seed"
python3 scripts/00059-yaml-query.py --topic "migration"
```

### Step 2: Critical Files to Read
```bash
# MCP Implementation Context
cat reality/agent-reality-auditor/supabase-connector/mcp_enhanced_connector.py
grep -n "Would be:" reality/agent-reality-auditor/supabase-connector/mcp_enhanced_connector.py

# Requirements Scope
cat requirements/REQUIREMENTS_INDEX.md
cat requirements/P0-ACTIVITY-RUNTIME-STORIES.md | head -200

# v5 Patterns to Integrate
cat requirements/V5-LESSONS-AND-PATTERNS.md

# Truth-seed Protocol
cat core/00096-TRUTH-SEED-DIRECTORY-PROTOCOL.md
cat reconciliation/00042-TRUTH-SEED-ADOPTION-DECISION.md

# Session Context
cat archive/sessions/SESSION-00123-LOG.md
cat reconciliation/00122-SESSION-105-MCP-COMPLETION-PLAN.md
```

### Step 3: Verify MCP Server Status
```bash
# Check which MCP servers are installed
ls -la /home/b4sho/mcp-servers/
ls -la ~/.npm/_npx/*/node_modules/ | grep mcp

# Verify configuration
cat ~/.claude.json | jq '.mcpServers'
```

---

## Phase 1: Foundation (Week 1) - Enable Core Operations

### 1.1 Complete Session 105 MCP Integration (4-6 hours)

**Priority**: P0 - Blocks all feature building
**File**: `reality/agent-reality-auditor/supabase-connector/mcp_enhanced_connector.py`
**Lines to Fix**: 116, 138, 161

#### Implementation Details:
```python
# Line 116 - Apply Migration (DDL Operations)
def apply_migration_via_mcp(self, name: str, query: str) -> dict:
    """Enable schema evolution for EmCoin, Badges, Activities"""
    try:
        # Replace placeholder with actual MCP call
        result = mcp__supabase-dev__apply_migration(
            name=name,
            query=query
        )
        
        # Log for Reality Agent consumption
        self.log_ddl_operation(name, result, "mcp")
        
        # Update migration manifest
        self.update_migration_manifest(name, result)
        
        return {"success": True, "result": result}
        
    except Exception as e:
        # Fallback to manual with alert
        self.alert_manual_intervention_needed(name, e)
        return self.legacy_migration_fallback(name, query)

# Line 138 - Execute SQL (Query Operations)
def execute_sql_via_mcp(self, query: str) -> dict:
    """Execute SQL for Reality Agent verification"""
    try:
        result = mcp__supabase-dev__execute_sql(
            query=query
        )
        return {"success": True, "data": result}
        
    except Exception as e:
        return self.legacy_sql_fallback(query)

# Line 161 - Get Security Advisors
def get_security_advisors_via_mcp(self) -> list:
    """Check for RLS gaps and security issues"""
    try:
        advisors = mcp__supabase-dev__get_advisors(
            type="security"
        )
        self.process_security_advisors(advisors)
        return advisors
        
    except Exception as e:
        return []
```

**Why Critical**: 
- Every new feature (EmCoin, Badges, Activities) needs schema changes
- Manual SQL editor kills velocity when building 275 stories
- Reality Agents need this for validation

### 1.2 Create MCP-Reality Agent Bridge (8 hours)

**New File**: `reality/agent-reality-orchestrator/mcp_bridge.py`

```python
"""
MCP-Reality Agent Bridge
Orchestrates MCP servers with Reality Agents for unified operations
Session 123 Design - Foundation for 275 story implementation
"""

from typing import Dict, List, Optional
import asyncio
from dataclasses import dataclass

@dataclass
class FeatureValidationReport:
    """Complete validation of a feature implementation"""
    schema_ready: bool
    code_complete: bool
    ui_working: bool
    reality_consensus: float
    test_results: dict
    recommendations: List[str]

class MCPRealityBridge:
    """Orchestrates MCP servers with Reality Agents"""
    
    def __init__(self):
        # MCP Server Connections
        self.mcp_servers = {
            'supabase': self._init_supabase_mcp(),
            'github': self._init_github_mcp(),
            'puppeteer': self._init_puppeteer_mcp(),
            'brave': self._init_brave_mcp(),
            'sequential': self._init_sequential_mcp()
        }
        
        # Reality Agent Connections
        self.reality_agents = {
            'filesystem': FileSystemAgent(),
            'github': GitHubAgent(),
            'supabase': SupabaseAgent(),
            'integration': IntegrationAgent()
        }
    
    async def validate_feature_implementation(self, feature_name: str) -> FeatureValidationReport:
        """End-to-end validation using multiple MCPs and Reality Agents"""
        
        # 1. Database Schema Validation (Supabase MCP)
        schema_ready = await self._validate_schema(feature_name)
        
        # 2. Code Implementation Check (GitHub MCP)
        code_complete = await self._validate_code(feature_name)
        
        # 3. UI Testing (Puppeteer MCP)
        ui_working, test_results = await self._validate_ui(feature_name)
        
        # 4. Reality Agent Consensus
        reality_consensus = await self._get_reality_consensus()
        
        # 5. Generate Recommendations
        recommendations = await self._generate_recommendations(
            schema_ready, code_complete, ui_working, reality_consensus
        )
        
        return FeatureValidationReport(
            schema_ready=schema_ready,
            code_complete=code_complete,
            ui_working=ui_working,
            reality_consensus=reality_consensus,
            test_results=test_results,
            recommendations=recommendations
        )
    
    async def build_feature_from_story(self, story_id: str):
        """Build a complete feature from user story"""
        # Implementation for Phase 3
        pass
```

---

## Phase 2: Testing Infrastructure (Week 1-2)

### 2.1 Automated Test Pipeline with Puppeteer MCP

**New File**: `scripts/00123-automated-test-pipeline.js`

```javascript
/**
 * Automated Test Pipeline using Puppeteer MCP
 * Tests existing features and validates new implementations
 * Session 123 Design - Validates 275 user stories
 */

// Priority Tests for Existing Features
const priorityTests = [
    {
        name: "Chat UI Accessibility",
        storyIds: ["US-CHAT-001", "US-CHAT-002"],
        test: async (page) => {
            // Test Session 119's chat implementation
            await page.goto('http://localhost:3001/chat');
            await page.waitForSelector('.chat-container', {timeout: 5000});
            
            // Verify chat rooms are accessible
            const rooms = await page.$$('.chat-room-item');
            assert(rooms.length > 0, "Chat rooms should be visible");
            
            // Test message sending
            await page.click('.chat-room-item:first-child');
            await page.type('.chat-input', 'Test message from Puppeteer');
            await page.click('.send-button');
            
            // Verify message appears
            await page.waitForSelector('.message-content:last-child');
        }
    },
    {
        name: "Friends System Interaction",
        storyIds: ["US-FRIEND-001", "US-FRIEND-002"],
        test: async (page) => {
            // Test Session 117's friends implementation
            await page.goto('http://localhost:3001/groups/friends');
            await page.waitForSelector('.friend-sidebar');
            
            // Verify friend list loads
            const friends = await page.$$('.friend-card');
            assert(friends.length >= 0, "Friend list should load");
            
            // Test friend chat navigation
            if (friends.length > 0) {
                await page.click('.friend-card:first-child .message-icon');
                await page.waitForNavigation();
                const url = page.url();
                assert(url.includes('/chat/'), "Should navigate to chat");
            }
        }
    },
    {
        name: "Teams Functionality",
        storyIds: ["US-TEAM-001", "US-TEAM-002"],
        test: async (page) => {
            // Test Session 112's teams implementation
            await page.goto('http://localhost:3001/groups/teams');
            await page.waitForSelector('.teams-container');
            
            // Test team creation flow
            await page.click('.create-team-button');
            await page.type('#team-name', 'Test Team');
            await page.type('#team-description', 'Automated test team');
            await page.click('.submit-team');
            
            // Verify team created
            await page.waitForSelector('.success-message');
        }
    }
];

// Test Runner using MCP
async function runTestSuite() {
    const results = await mcp__puppeteer_mcp__launch();
    const page = await mcp__puppeteer_mcp__new_page({pageId: "test-page"});
    
    for (const test of priorityTests) {
        try {
            await test.test(page);
            console.log(`✅ ${test.name} passed`);
        } catch (error) {
            console.error(`❌ ${test.name} failed:`, error);
        }
    }
    
    await mcp__puppeteer_mcp__close_browser();
}
```

### 2.2 Canvas Story Validation Framework

**New File**: `requirements/validation/story-to-test-mapper.py`

```python
"""
Maps 275 user stories to automated tests
Generates Puppeteer tests from Canvas requirements
Session 123 Design
"""

class StoryTestMapper:
    """Maps user stories to automated tests"""
    
    def __init__(self):
        self.stories = self.load_all_stories()
        self.canvas_data = self.load_canvas_wireframes()
        
    def generate_test_from_story(self, story_id: str) -> str:
        """Convert user story to Puppeteer test"""
        story = self.stories.get(story_id)
        if not story:
            raise ValueError(f"Story {story_id} not found")
        
        # Generate test based on story structure
        test_script = f"""
describe('{story.title}', () => {{
    // Story ID: {story_id}
    // Priority: {story.priority}
    // Source: {story.source}
    
    test('should {story.acceptance_criteria[0]}', async () => {{
        // Given: {story.given_context}
        await setupTestContext({{
            user: '{story.user_type}',
            data: {story.test_data}
        }});
        
        // When: {story.action}
        await page.goto('{story.url_pattern}');
        await executeAction('{story.action_type}', {story.action_params});
        
        // Then: {story.expected_outcome}
        await validateOutcome({{
            elements: {story.expected_elements},
            state: '{story.expected_state}',
            data: {story.expected_data}
        }});
    }});
}});
"""
        return test_script
    
    def generate_test_suite_for_priority(self, priority: str) -> List[str]:
        """Generate all tests for a priority level"""
        priority_stories = [s for s in self.stories.values() if s.priority == priority]
        return [self.generate_test_from_story(s.id) for s in priority_stories]
```

---

## Phase 3: Feature Building Workflow (Week 2-3)

### 3.1 Activity Runtime Engine Builder

**Priority**: P0 - 50 stories for core platform functionality
**New File**: `reconciliation/builders/activity_engine_builder.py`

```python
"""
Builds Activity Runtime Engine using MCP infrastructure
Implements 50 P0 stories from Canvas 001-5
Session 123 Design
"""

from typing import List, Dict
import json

class ActivityEngineBuilder:
    """Builds Activity Runtime using MCP infrastructure"""
    
    def __init__(self, mcp_bridge: MCPRealityBridge):
        self.mcp_bridge = mcp_bridge
        self.stories = self.load_activity_stories()
        
    async def build_activity_feature(self, story_ids: List[str]):
        """End-to-end feature building with MCP support"""
        
        # 1. Design schema with Sequential Thinking MCP
        print("🧠 Designing schema with Sequential Thinking MCP...")
        schema_design = await self.design_schema_with_mcp(story_ids)
        
        # 2. Research patterns with Brave Search MCP
        print("🔍 Researching best practices...")
        patterns = await self.research_patterns(
            "education platform activity runtime multi-session"
        )
        
        # 3. Create migration with Supabase MCP
        print("🗄️ Creating database migration...")
        migration_sql = self.generate_migration_sql(schema_design)
        migration_result = await self.apply_migration(migration_sql)
        
        # 4. Generate code from truth-seed patterns
        print("💻 Generating code from patterns...")
        code_files = self.generate_code(schema_design, patterns)
        
        # 5. Commit with GitHub MCP
        print("📦 Committing feature implementation...")
        commit_result = await self.commit_feature(code_files, story_ids)
        
        # 6. Test with Puppeteer MCP
        print("🧪 Testing feature implementation...")
        test_results = await self.test_feature(story_ids)
        
        # 7. Validate with Reality Agents
        print("✅ Validating with Reality Agents...")
        validation = await self.mcp_bridge.validate_feature_implementation(
            "activity_engine"
        )
        
        return {
            "schema": schema_design,
            "migration": migration_result,
            "code": commit_result,
            "tests": test_results,
            "validation": validation
        }
    
    def generate_migration_sql(self, schema_design: dict) -> str:
        """Generate SQL for Activity Engine tables"""
        return f"""
-- Activity Runtime Engine Schema
-- Implements 50 P0 stories from Canvas 001-5
-- Session 123 Design

-- Activity Definition
CREATE TABLE activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    activity_type TEXT NOT NULL,
    total_sessions INTEGER DEFAULT 1,
    created_by UUID REFERENCES profile(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Session (Multi-session support)
CREATE TABLE activity_session (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES activity(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL,
    title TEXT,
    content JSONB,
    objectives JSONB,
    duration_minutes INTEGER,
    UNIQUE(activity_id, session_number)
);

-- Activity Instance (Player participation)
CREATE TABLE activity_instance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES activity(id),
    player_id UUID REFERENCES student(id),
    current_session INTEGER DEFAULT 1,
    state TEXT DEFAULT 'not_started',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    progress JSONB DEFAULT '{}'::jsonb
);

-- Session Progress (Save and resume)
CREATE TABLE session_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instance_id UUID REFERENCES activity_instance(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL,
    state TEXT DEFAULT 'not_started',
    draft_data JSONB,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(instance_id, session_number)
);

-- Assignment Submissions within Activities
CREATE TABLE activity_assignment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES activity_session(id),
    title TEXT NOT NULL,
    instructions TEXT,
    rubric JSONB,
    due_offset_minutes INTEGER
);

CREATE TABLE assignment_submission (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES activity_assignment(id),
    instance_id UUID REFERENCES activity_instance(id),
    student_id UUID REFERENCES student(id),
    content TEXT,
    files JSONB,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    grade NUMERIC(5,2),
    feedback TEXT,
    UNIQUE(assignment_id, instance_id)
);

-- Enable RLS
ALTER TABLE activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_instance ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_assignment ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submission ENABLE ROW LEVEL SECURITY;

-- RLS Policies (simplified for brevity)
CREATE POLICY "Players can view their instances" ON activity_instance
    FOR SELECT USING (player_id = auth.uid());
    
CREATE POLICY "Players can update their progress" ON session_progress
    FOR ALL USING (
        instance_id IN (
            SELECT id FROM activity_instance WHERE player_id = auth.uid()
        )
    );
"""
```

### 3.2 EmCoin Economy Implementation

**Leveraging v5's 46 EmCoin references**
**New File**: `reconciliation/builders/emcoin_builder.py`

```python
"""
Migrates v5 EmCoin patterns to v6
Implements P0 and P2 EmCoin stories
Session 123 Design
"""

class EmCoinBuilder:
    """Builds EmCoin economy using v5 patterns"""
    
    def __init__(self, mcp_bridge: MCPRealityBridge):
        self.mcp_bridge = mcp_bridge
        self.v5_patterns = self.load_v5_patterns()
        
    async def build_emcoin_economy(self):
        """Complete EmCoin implementation"""
        
        # 1. Extract v5 patterns (16,000 lines to mine)
        print("💰 Extracting v5 EmCoin patterns...")
        patterns = self.extract_v5_emcoin_patterns()
        
        # 2. Design schema
        schema = self.design_emcoin_schema()
        
        # 3. Apply migration via MCP
        migration_result = await self.mcp_bridge.mcp_servers['supabase'].apply_migration(
            name="emcoin_economy",
            query=self.generate_emcoin_migration()
        )
        
        # 4. Build components
        components = self.build_emcoin_components(patterns)
        
        # 5. Test transactions
        test_results = await self.test_emcoin_transactions()
        
        return {
            "migration": migration_result,
            "components": components,
            "tests": test_results
        }
```

---

## Phase 4: Integration Patterns (Week 3-4)

### 4.1 Enhanced Reality Agents with MCP

```python
class EnhancedSupabaseAgent(SupabaseAgent):
    """Reality Agent using MCP for efficiency"""
    
    async def check_reality(self):
        """Use MCP for faster reality checks"""
        # Single MCP call instead of multiple queries
        reality_snapshot = await mcp__supabase_dev__execute_sql("""
            WITH stats AS (
                SELECT 
                    (SELECT COUNT(*) FROM student) as students,
                    (SELECT COUNT(*) FROM team) as teams,
                    (SELECT COUNT(*) FROM chat.room) as chat_rooms,
                    (SELECT COUNT(*) FROM activity) as activities,
                    (SELECT COUNT(*) FROM emcoin_transaction) as transactions,
                    (SELECT COUNT(*) FROM badge_earned) as badges
            )
            SELECT to_jsonb(stats.*) as snapshot FROM stats;
        """)
        
        return self.process_snapshot(reality_snapshot)
```

### 4.2 Batch Operations Orchestrator

```python
class BatchOrchestrator:
    """Handles large-scale operations efficiently"""
    
    async def migrate_v5_components(self, component_list: List[str]):
        """Migrate v5's 16,000 lines systematically"""
        
        # Use GitHub MCP for batch operations
        print(f"📦 Processing {len(component_list)} v5 components...")
        
        # Chunk for efficiency (like Session 111's 474 files)
        chunks = self.chunk_list(component_list, size=50)
        
        for i, chunk in enumerate(chunks):
            print(f"Processing chunk {i+1}/{len(chunks)}...")
            
            # Read v5 files
            v5_files = await self.mcp_bridge.mcp_servers['github'].batch_read(chunk)
            
            # Transform to v6
            v6_files = self.transform_to_v6(v5_files)
            
            # Commit chunk
            await self.mcp_bridge.mcp_servers['github'].commit_chunk(
                files=v6_files,
                message=f"feat: Migrate v5 components (chunk {i+1}/{len(chunks)})"
            )
```

---

## Phase 5: Continuous Validation (Ongoing)

### 5.1 Story Progress Dashboard

```python
class StoryProgressDashboard:
    """Tracks implementation progress of 275 stories"""
    
    def generate_progress_report(self) -> dict:
        """Generate comprehensive progress report"""
        return {
            "summary": {
                "total_stories": 275,
                "completed": self.count_completed(),
                "in_progress": self.count_in_progress(),
                "not_started": self.count_not_started(),
                "blocked": self.count_blocked()
            },
            "by_priority": {
                "P0": self.get_priority_stats("P0"),  # 105 stories
                "P1": self.get_priority_stats("P1"),  # 119 stories
                "P2": self.get_priority_stats("P2")   # 51 stories
            },
            "by_category": {
                "activity_runtime": self.get_category_stats("activity"),  # 50 stories
                "emcoin": self.get_category_stats("emcoin"),  # 7+8 stories
                "teams": self.get_category_stats("teams"),  # 12 stories
                "authentication": self.get_category_stats("auth"),  # 15 stories
                "badges": self.get_category_stats("badges"),  # 16 stories
                "guardian": self.get_category_stats("guardian")  # Various
            },
            "velocity": {
                "last_week": self.calculate_velocity(days=7),
                "last_month": self.calculate_velocity(days=30),
                "projected_completion": self.project_completion_date()
            }
        }
```

---

## Implementation Timeline

### Week 1: Foundation
- **Day 1-2**: Complete Session 105 MCP placeholders (4-6 hours)
- **Day 3-4**: Build MCP-Reality Bridge (8 hours)
- **Day 5**: Test existing features with Puppeteer MCP

### Week 2: Testing Infrastructure  
- **Day 1-2**: Create Puppeteer test pipeline
- **Day 3-4**: Build story-to-test mapper
- **Day 5**: Validate all existing P0 features

### Week 3: Feature Building
- **Day 1-3**: Start Activity Engine (first 10 stories)
- **Day 4-5**: Begin EmCoin foundation

### Week 4: Scale & Optimize
- **Day 1-2**: Batch migration tools for v5
- **Day 3-4**: Enhance Reality Agents with MCP
- **Day 5**: Progress dashboard and metrics

---

## Success Metrics

### Immediate (Week 1)
- ✅ DDL operations working via MCP
- ✅ Chat/Friends/Teams validated with Puppeteer
- ✅ 3+ Reality Agents using MCP for efficiency

### Short-term (Month 1)
- 📊 20% of 275 stories implemented (55 stories)
- 🎮 Activity Engine MVP (10+ stories working)
- 💰 EmCoin transactions functional

### Long-term (Quarter)
- 🎯 80% story completion (220 stories)
- 🔄 v5 patterns fully integrated
- 🚀 Platform ready for beta users

---

## Risk Mitigation

### Technical Risks
1. **MCP Server Availability**: Implement fallbacks for all MCP calls
2. **Performance at Scale**: Monitor and optimize as story count grows
3. **Integration Complexity**: Start simple, add complexity gradually

### Process Risks
1. **Scope Creep**: Stick to story priorities (P0 → P1 → P2)
2. **Context Loss**: Document extensively, update logs religiously
3. **Dependency Blocks**: Identify and resolve early

---

## Why This Plan Succeeds

1. **Evidence-Based**: Built on Sessions 1-122 learnings
2. **Immediate Value**: Tests existing work first
3. **Scales Naturally**: From placeholders to platform
4. **Leverages Everything**: MCP, Reality Agents, v5, truth-seed
5. **Measurable Progress**: 275 stories = clear metrics

---

## Appendix: Resource Links

### MCP Documentation
- Session 105: `reality/agent-reality-auditor/supabase-connector/mcp_enhanced_connector.py`
- Session 120: `reconciliation/00120-MCP-ECOSYSTEM-IMPLEMENTATION-GUIDE.md`
- Session 122: `reconciliation/00122-SESSION-105-MCP-COMPLETION-PLAN.md`

### User Story Sources
- P0 Stories: `requirements/P0-*.md` (105 stories)
- P1 Stories: `requirements/P1-*.md` (119 stories)
- P2 Stories: `requirements/P2-*.md` (51 stories)
- Canvas Data: `requirements/canvas-requirements/canvas-analysis/*.json`

### v5 Integration Resources
- Patterns: `requirements/V5-LESSONS-AND-PATTERNS.md`
- Architecture: Sessions 18-19 extraction work

This infrastructure becomes the **engine for building the remaining 80% of the EDL platform efficiently**.

---

*Session 123 - MCP Infrastructure Plan Complete*
*Ready for Session 124 Phase 1 Implementation*
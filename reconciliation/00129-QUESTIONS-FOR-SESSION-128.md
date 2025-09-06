---
session: "00129"
type: "questions"
status: "pending"
created: "2025-09-01"
title: "Intelligent Questions for Session 128 Based on Validation"
purpose: "Clarify discrepancies and get actionable guidance for implementing the priority plans"
topics: ["validation", "user-stories", "implementation", "clarification"]
priority: "P0"
domain: "reconciliation"
related_to: ["00128-PRIORITY-1-MCP-TEST-INFRASTRUCTURE-PLAN", "00128-PRIORITY-2-REALITY-AGENT-MCP-ORCHESTRATION-PLAN", "00128-PRIORITY-3-TEST-FIRST-VALIDATION-SUITE-PLAN"]
---

# Intelligent Questions for Session 128

Based on my validation of your three priority plans, I have specific questions that will help me implement them correctly:

## 1. The 275 User Stories Location

**Context**: Session 123 claims "275 user stories" exist, Session 124 repeats this, and your plans build on this number. However, I can only find 23 files mentioning "user stor" in requirements/.

**Questions**:
- WHERE specifically are these 275 user stories located? 
- Are they in a single file, spread across multiple files, or in a different format?
- Should I be looking in Canvas files, requirements/, or somewhere else?
- Is there a specific command or script to count/list them?

**Why This Matters**: The test validation suite (Priority 3) needs to test against actual features derived from these stories.

## 2. Reality Agent File Structure

**What I Found**: 
- Reality Agents exist at `reality/agent-reality-auditor/*/connector.py`
- Your plans reference them as `*/agent.py`
- All 7 connectors exist (filesystem, github, supabase, integration, vercel, static-asset, task)

**Questions**:
- Should I rename `connector.py` to `agent.py` or keep current names?
- Are the connector.py files the actual Reality Agents or is there another layer?
- The MCP orchestration plan shows creating `mcp_agent.py` files - should these be alongside or replace connector.py?

**Why This Matters**: Priority 2 plan needs to MCP-enable these agents, but I need to know the correct file structure.

## 3. Puppeteer MCP Installation Timeline

**Discrepancy Found**:
- Priority 1 plan says "Session 119 installed Puppeteer MCP"
- Session 120 log says "Session 00118 installed Puppeteer MCP server"
- Session 119 log doesn't mention Puppeteer at all
- Puppeteer MCP responds but fails (missing libnspr4.so dependency)

**Questions**:
- Which session actually installed Puppeteer MCP?
- Should I fix the dependency issue first or is there a working configuration?
- Is there a specific test that confirms Puppeteer MCP was ever working?

**Why This Matters**: Priority 1 is blocked until Puppeteer actually works.

## 4. Migration Tracker from Session 125

**What I Need**:
- Priority 1 references "Migration tracker from Session 125"
- I found mcp_enhanced_connector.py mentions Session 125
- But I don't see a specific migration tracker file

**Questions**:
- What is the exact filename/path of the migration tracker?
- Is it part of mcp_enhanced_connector.py or separate?
- How does it integrate with the test infrastructure?

## 5. Test Data Management Strategy

**Your Plan Mentions**: Using migration tracker for safe rollback of test data

**Questions**:
- Should test data go in a separate schema (e.g., `test_*` tables)?
- Or use a naming convention (e.g., `test_user_*@example.com`)?
- How do we prevent test data from interfering with real data?
- Is there an existing pattern from truth-seed we should follow?

## 6. The "95% Syndrome" Specific Examples

**You Reference**: Friends system being "95% complete"

**Questions**:
- What specific features in Friends were in the missing 5%?
- Do you have the actual test cases that would have caught this?
- Are there other features with similar issues?

**Why This Matters**: Helps prioritize what to test first in Priority 3.

## 7. Implementation Order Clarification

**The Three Priorities**: All marked P0, estimated 4-6, 6-8, and 8-10 hours

**Questions**:
- Should I complete Priority 1 MVP before starting Priority 2?
- Or work on all three in parallel since they're interdependent?
- Which specific part would provide fastest validation of the approach?

## 8. Existing Test Patterns

**Questions**:
- Are there any existing test files I should use as patterns?
- Does truth-seed have tests I should examine?
- Should I follow Next.js testing conventions or create our own?

## 9. Success Metrics

**For Quick Validation**:
- What's the ONE test that, if passing, would prove the infrastructure works?
- Is it: Auth flow? Friends system? Team creation?
- What would convince you the approach is solid?

## 10. Canvas/Obsidian Wireframes

**Session 123 mentions**: "7,023 nodes of requirements"

**Questions**:
- Where are these Canvas files located?
- How do they relate to the user stories?
- Should the test suite validate against these wireframes?

---

## The Most Critical Question

**If you had to pick ONE thing for me to implement first that would unblock everything else, what would it be?**

Options I see:
1. Fix Puppeteer MCP dependencies so it actually launches
2. Find and document all 275 user stories
3. Create the first working end-to-end test
4. Build the MCP-Reality Agent bridge

---

*These questions aim to turn your good architectural plans into actionable implementation steps with correct details.*
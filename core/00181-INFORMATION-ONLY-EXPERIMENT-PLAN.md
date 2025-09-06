---
session: "181"
type: "experiment-plan"
status: "ready-to-test"
created: "2025-09-06T12:00:00.000Z"
title: "Information-Only Approach - No MCP Experiment Plan"
purpose: "Test if excellent documentation and examples alone can prevent architectural mistakes without any enforcement or assistance systems"
topics: ["experiment", "information-architecture", "documentation", "patterns", "no-mcp"]
priority: "P0"
domain: "core"
hypothesis: "If information gaps cause architectural mistakes, then comprehensive documentation should prevent them without MCP intervention"
---

# Information-Only Approach Experiment Plan
## Testing if Documentation Alone Prevents Architectural Disasters

**Session**: 181  
**Hypothesis**: Excellent information architecture eliminates the need for enforcement/empowerment systems  
**Test Sessions**: 182-184  

---

## The Core Assumption

Yes, your assumption is **exactly correct**. The Information-Only approach assumes that if developers have:
1. **Mandatory context files** they must read
2. **Clear examples** they can copy
3. **Discoverable patterns** they can reference
4. **Understanding of WHY** certain patterns matter

Then they will naturally build the right architecture without any MCP intervention.

---

## 📚 The Mandatory Reading List

### Tier 1: MUST READ BEFORE CODING (30 minutes)
*These files contain the critical context that Sessions 167-170 were missing*

#### 1. **START-HERE.md** (Create new - 5 min read)
```markdown
# EDL Platform v6 - START HERE

## The One Rule That Matters
**We use Next.js Server Components with V5 vanilla JS bridges.**
Not React Client Components. Not useState. Not useEffect.

## Why This Matters
Sessions 167-170 built 14,000 lines with React hooks.
It all had to be deleted.
Don't repeat their mistake.

## Quick Check
Before writing ANY component, ask:
1. Is this a Server Component? (It should be)
2. Am I using React hooks? (You shouldn't be)
3. Do I need client interactivity? (Use V5 bridge)

## Your First Stop
Read PATTERNS-QUICKSTART.md for copy-paste examples.
```

#### 2. **PATTERNS-QUICKSTART.md** (Create new - 10 min read)
```markdown
# Pattern Quick Reference - Copy These!

## ❌ NEVER Write This (React Client Component)
\`\`\`typescript
"use client"  // ❌ NO!
import { useState, useEffect } from 'react'  // ❌ NO!

export function Component() {
  const [data, setData] = useState()  // ❌ NO!
  useEffect(() => { }, [])  // ❌ NO!
  return <div onClick={() => setData()}>  // ❌ NO!
}
\`\`\`

## ✅ ALWAYS Write This (Server Component + V5)
\`\`\`typescript
// ✅ YES! Server Component (no "use client")
import { createClient } from '@/lib/supabase'

export async function Component() {
  // ✅ Fetch data on server
  const supabase = createClient()
  const { data } = await supabase.from('table').select()
  
  return (
    <div id="mount-point" data-initial={JSON.stringify(data)}>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}

// Then in public/v5-engine/component.js:
window.v5Engine.enhance('mount-point', (element) => {
  const data = JSON.parse(element.dataset.initial)
  // Add interactivity with vanilla JS
})
\`\`\`

## Common Patterns

### Form Submission
\`\`\`typescript
// ✅ Server Action (not useState)
async function submitForm(formData: FormData) {
  'use server'
  const name = formData.get('name')
  await saveToDatabase(name)
  revalidatePath('/page')
}

<form action={submitForm}>
  <input name="name" />
  <button>Submit</button>
</form>
\`\`\`

### Real-time Updates
\`\`\`typescript
// ✅ V5 Bridge Pattern
<div id="realtime-mount" data-channel="presence">
  {initialData}
</div>

// In V5 engine:
window.v5Engine.subscribeRealtime('presence', (data) => {
  document.getElementById('realtime-mount').innerHTML = renderData(data)
})
\`\`\`
```

#### 3. **WHY-V5-BRIDGES.md** (Create new - 5 min read)
```markdown
# Why V5 Bridges Instead of React?

## The Problem
Next.js App Router uses React Server Components by default.
These run on the server and can't have state or event handlers.

## The Wrong Solution (Sessions 167-170)
They added "use client" and used React hooks.
This broke the entire architecture.

## The Right Solution (V5 Bridge)
1. Server Components render initial HTML
2. V5 vanilla JS adds interactivity after mount
3. No hydration issues, no state conflicts

## Benefits
- Faster initial page loads (no JS bundle)
- Better SEO (server-rendered HTML)
- Simpler mental model (server → client, not mixed)
- Proven pattern (Sessions 135, 137 shipped to production)
```

#### 4. **Session 179 Recovery Report** (10 min read)
`archive/sessions/SESSION-179-PARALLEL-BATCH-RECOVERY-REPORT.md`
- **Why**: See exactly what went wrong and why
- **Key sections**: Lines 15-55 (The failure), Lines 245-265 (The lesson)

---

### Tier 2: REFERENCE WHEN BUILDING (Look up as needed)

#### 5. **Canvas Wireframes** (Visual specs)
```
archive/legacy-canvas-work/
├── 001-1. num.label.Onboarding&Directory.canvas
├── 001-2. label.Communication, messages and Invitations.canvas
└── [9 more files]
```
- **When to read**: When implementing a specific feature
- **How to use**: Find the canvas matching your feature, follow the visual

#### 6. **V5 Reference Implementation** (Working examples)
```
reconciliation/active-work/dashboard/public/v5-engine/
├── addiction-bar.js       # Example: Progress tracking
├── initialize.js          # Example: Setup pattern
└── data-handler.js        # Example: Data management
```
- **When to read**: When you need to add client interactivity
- **How to use**: Copy the pattern, adapt to your needs

#### 7. **Recipe Map** (Feature catalog)
`core/00173-RECIPE-MAP-V1.md`
- **When to read**: Before starting any new feature
- **How to use**: Find your feature, see which patterns to follow

---

## 🎯 The Experiment Structure

### Session 182: Pure Information Test

**Task**: Build a user authentication component with:
- Login form
- Session management  
- Protected routes
- Logout functionality

**Provided Resources**:
1. All files from Tier 1 (mandatory reading)
2. Access to Tier 2 (reference)
3. 30-minute reading period before coding
4. NO MCP assistance
5. NO enforcement tools

**Success Criteria**:
- Uses Server Components ✓/✗
- No React hooks in server ✓/✗
- V5 bridge for interactivity ✓/✗
- Forms use Server Actions ✓/✗
- Time to completion: _____ hours

**Measurement Points**:
```typescript
// Count violations
grep -r "use client" --include="*.tsx" session-182/
grep -r "useState\|useEffect" --include="*.tsx" session-182/
grep -r "window.v5Engine" --include="*.js" session-182/

// Measure understanding
// After building, ask:
// 1. Why did you choose this pattern?
// 2. What would happen if you used React hooks?
// 3. How does V5 bridge solve the problem?
```

---

## 📋 The Information Architecture

### File Organization for Discoverability
```
/
├── START-HERE.md                    # Entry point (symlink to desktop)
├── PATTERNS-QUICKSTART.md          # Copy-paste patterns
├── WHY-V5-BRIDGES.md               # Understanding context
│
├── .claude/
│   └── quick-refs/
│       ├── server-component.md     # Snippet reference
│       ├── v5-bridge.md           # Snippet reference
│       └── server-action.md       # Snippet reference
│
├── examples/
│   ├── auth-component/            # Full working example
│   ├── profile-component/         # Full working example
│   └── realtime-component/        # Full working example
│
└── VS Code Snippets (auto-installed)
    ├── serv-comp    → Server Component template
    ├── v5-bridge    → V5 bridge template
    └── serv-action  → Server Action template
```

### Making Information Unmissable

1. **Terminal MOTD** (on session start)
```bash
echo "
╔════════════════════════════════════════════╗
║  🚨 CRITICAL: Read START-HERE.md first!    ║
║  Server Components ONLY. No React hooks.   ║
║  See PATTERNS-QUICKSTART.md for examples.  ║
╚════════════════════════════════════════════╝
" >> ~/.bashrc
```

2. **VS Code Workspace Settings**
```json
{
  "recommendations": [
    "READ START-HERE.md FIRST"
  ],
  "files.associations": {
    "*.tsx": "typescriptreact-server"  // Visual reminder
  }
}
```

3. **Pre-commit Hook** (Gentle reminder, not enforcement)
```bash
#!/bin/bash
if grep -r "useState\|useEffect" --include="*.tsx"; then
  echo "
  ⚠️  React hooks detected in components
  📖 Did you read PATTERNS-QUICKSTART.md?
  Server Components can't use hooks.
  Continue anyway? (y/n)"
  read -r response
  [ "$response" = "y" ] || exit 1
fi
```

---

## 📊 Success Metrics

### Quantitative Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Correct Architecture | >90% | Automated pattern check |
| Time to First Correct Component | <2 hours | Timer from start |
| Questions Asked | <5 | Count help requests |
| Violations Committed | <3 | Git commit analysis |
| Time Spent Reading | >30 min | Self-reported |

### Qualitative Metrics
- **Confidence Level**: "How confident are you in the patterns?" (1-10)
- **Clarity**: "Was the documentation clear?" (1-10)  
- **Discoverability**: "Could you find what you needed?" (1-10)
- **Understanding**: "Do you understand WHY these patterns?" (Y/N)

---

## 🔬 Experiment Controls

### What We're Testing
**Independent Variable**: Information quality and discoverability
**Dependent Variable**: Architectural correctness
**Control Variables**: 
- Same task complexity
- Same time constraints
- Same starting knowledge
- No external assistance

### Comparison Baseline
Results will be compared against:
- Session 167-170 (no information): 0% correct
- Session 183 (Enforcement MCP): Expected 100% correct
- Session 184 (Empowerment MCP): Expected 95% correct

---

## 🎯 The Critical Question

**Can excellent documentation alone achieve >90% architectural correctness?**

If YES → We don't need an MCP
If NO → We need some form of assistance/enforcement

---

## 📝 Post-Experiment Analysis

### If Information-Only Succeeds (>90% correct):
1. Cancel War Machine MCP development
2. Invest in documentation and examples
3. Create more discoverable patterns
4. Simple tooling only (snippets, hooks)

### If Information-Only Fails (<90% correct):
1. Identify why information wasn't sufficient
2. Test simple interventions (linting, hooks)
3. Consider MCP only if simple solutions fail
4. Use failure data to calibrate MCP approach

---

## The Evidence We'll Gather

1. **Pattern Compliance Rate**: % of components using correct patterns
2. **Time Investment**: Reading time vs coding time
3. **Error Types**: What mistakes still happen despite documentation
4. **Discovery Paths**: How developers find information
5. **Retention**: Do patterns stick after initial learning?

---

*This experiment follows Evidence Imperative Protocol - we test the simplest solution first and only add complexity if evidence shows it's needed.*

**Next Step**: Create the documentation files listed above and run Session 182 with pure information approach.
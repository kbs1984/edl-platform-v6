---
created: '2025-08-28'
domain: core
priority: P0
purpose: Standard template for detailed feature tracking
session: 00097
status: current
title: Feature Breakdown Template
topics:
- template
- tracking
- features
type: template
---

# Feature Breakdown Template

Use this template to create detailed breakdowns for each major feature.

```markdown
---
feature: "FEATURE-NAME"
type: "detailed-breakdown"
status: "partial|complete|pending"
created: "YYYY-MM-DD"
session: "000XX"
title: "FEATURE - Detailed Component Breakdown"
purpose: "Track granular status of each FEATURE sub-component"
topics: ["RELEVANT", "TOPICS"]
priority: "P0|P1|P2"
domain: "requirements|reality|reconciliation"
---

# FEATURE NAME - Detailed Component Breakdown

**Last Updated**: Session 000XX  
**Overall Status**: ⚠️ PARTIAL (X% Complete)

## 📊 Component Status Matrix

### Main Component Group 1

#### ✅|⚠️|❌ Sub-Component Name (X% Complete)
- **Specific Feature 1**: ✅ Working | ❌ Not Working | ❓ Not Tested
- **Specific Feature 2**: ✅ Working | ❌ Not Working | ❓ Not Tested
- **Session**: When was this worked on
- **Test Status**: Manually verified | Needs testing | Not started
- **Notes**: Any specific details

### Main Component Group 2

#### Status Icons:
- ✅ = Verified working
- ❌ = Known broken/not implemented
- ⚠️ = Partially working
- ❓ = Unknown/not tested

## 📈 Actual Completion Metrics

### By Component Group
- **Component Group 1**: X% (details)
- **Component Group 2**: X% (details)

### Overall Feature
- **Verified Working**: X%
- **Partially Working**: X%
- **Untested**: X%
- **Not Implemented**: X%

## 🔴 Critical Gaps

1. **Gap 1**: Description
2. **Gap 2**: Description

## 🎯 Priority Testing Needed

### Immediate (P0)
1. Test X
2. Verify Y

### Soon (P1)
1. Test A
2. Verify B

## 📝 Testing Checklist

### Manual Testing Required
- [ ] Test case 1
- [ ] Test case 2
- [ ] Test case 3

### Automated Testing Available
- [ ] Script/tool to use

## 🔄 Update Protocol

After testing each component:
1. Update status from ❓ to ✅ or ❌
2. Note which session verified it
3. Document any issues found
4. Update percentage calculations

## 📊 Success Criteria

What defines this feature as "complete"?
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

## 🔗 Related Documentation

- Link to relevant files
- Link to session logs
- Link to test results
```

## Usage Instructions

1. **Copy this template** to `progress/features/FEATURE-NAME/FEATURE-BREAKDOWN.md`
2. **Fill in all sections** with actual data
3. **Be honest** about what works vs what doesn't
4. **Update regularly** as testing progresses
5. **Link from** the main PROGRESS-INDEX.md

## Key Principles

1. **Granularity**: Break features into smallest testable units
2. **Honesty**: Mark unknowns as ❓, not ✅
3. **Evidence**: Note which session verified each component
4. **Actionability**: Clear next steps for completion
5. **Measurability**: Specific percentages based on component count

## Examples

See these completed breakdowns:
- [Auth Flow Breakdown](progress/features/auth/AUTH-DETAILED-BREAKDOWN.md)
- School Registration Breakdown (coming soon)
- Dashboard Features Breakdown (coming soon)

---

*Use this template to ensure consistent, honest, granular tracking of feature progress.*
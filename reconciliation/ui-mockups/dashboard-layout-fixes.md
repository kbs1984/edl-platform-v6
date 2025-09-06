---
session: "155"
type: "technical-fixes"
status: "pending"
created: "2025-09-04T05:41:00.000Z"
title: "Dashboard Layout Fixes Required"
purpose: "Document z-index conflicts and UI fixes needed in dashboard"
topics: ["z-index", "ui-fixes", "dashboard-layout", "addiction-bar"]
priority: "P0"
domain: "reconciliation"
---

# Dashboard Layout Fixes Required

## Priority 1: Z-Index Conflicts

### Issue: Addiction Bar Blocking Header
**File**: `reconciliation/active-work/dashboard/src/app/layout.tsx:38`

**Current**:
```tsx
<div id="v5-addiction-bar" className="fixed top-0 left-0 right-0 z-50" />
```

**Fix to**:
```tsx
<div id="v5-addiction-bar" className="fixed top-0 left-0 right-0 z-20" />
```

**Alternative** (Move below header):
```tsx
<div id="v5-addiction-bar" className="fixed top-16 left-0 right-0 z-50" />
```

---

## Priority 2: Missing UI Elements

### Issue: Friend Sidebar Toggle Missing
**File**: `reconciliation/active-work/dashboard/src/app/(user-pages)/layout.tsx`

**Add after line 46** (next to EmCoin balance):
```tsx
<div className="flex items-center gap-2 px-4">
  <EmCoinBalanceCompact />
  <FriendSidebarTrigger /> {/* Add this */}
</div>
```

---

## Priority 3: Dynamic Content Issues

### Issue: Static Breadcrumb Text
**File**: `reconciliation/active-work/dashboard/src/app/(user-pages)/layout.tsx:40`

**Current**:
```tsx
<BreadcrumbPage>Data Fetching</BreadcrumbPage>
```

**Fix to** (use pathname):
```tsx
<BreadcrumbPage>{getCurrentPageName()}</BreadcrumbPage>
```

---

## Component Z-Index Reference

Recommended z-index hierarchy for proper layering:

```css
/* Z-Index Scale */
--z-background: -10;  /* Background images/gradients */
--z-base: 0;          /* Base content */
--z-content: 1;       /* Main content area */
--z-header: 10;       /* Header navigation */
--z-addiction: 20;    /* Addiction bar (reduced from 50) */
--z-sidebar: 30;      /* Friend sidebar */
--z-dropdown: 40;     /* Dropdowns/menus */
--z-modal: 50;        /* Modal dialogs */
--z-toast: 100;       /* Toast notifications */
```

---

## Visual Layout Structure

```
┌─────────────────────────────────────────────┐
│  Addiction Bar (z-20) 👁️🔥🪙🏆              │
├─────────────┬───────────────────────────────┤
│             │  Header (z-10)                 │
│  Student    │  [≡] > EDL > Page   [💰 100]  │
│  Sidebar    ├───────────────────────────────┤
│  (z-30)     │                                │
│             │     Main Content               │
│  - Home     │     (z-1)                      │
│  - Chat     │                                │
│  - Calendar │                                │
│  - Score    │                                │
│  - Settings │                                │
│             │                          Friend│
│             │                         Sidebar│
│             │                         (z-30) │
└─────────────┴───────────────────────────────┘
                            [Toast (z-100)]
```

---

## Testing Checklist

- [ ] Addiction bar doesn't overlap header navigation
- [ ] Friend sidebar can be toggled open/closed
- [ ] Header height transitions work correctly
- [ ] Breadcrumbs show current page name
- [ ] EmCoin balance is visible
- [ ] Toast notifications appear above all content
- [ ] Background gradients render correctly
- [ ] Sidebars maintain proper stacking order
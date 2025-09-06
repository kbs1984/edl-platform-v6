---
session: "00112"
type: "strategy"
status: "current"
created: "2025-08-29"
title: "Tailwind v4 Stability Strategy"
purpose: "Address CSS compilation stability issues moving forward"
topics: ["tailwind", "css", "stability", "build-process"]
priority: "P0"
domain: "core"
---

# Tailwind v4 Stability Strategy

## The Problem
Tailwind CSS v4 (4.1.3) + Next.js 15 have intermittent compilation failures that break the entire UI.

## Strategy Options (In Order of Preference)

### Option 1: Pin and Stabilize Current Setup ✅ RECOMMENDED
**Keep Tailwind v4 but add safeguards**

**Pros:**
- Matches truth-seed exactly
- Latest features available
- No migration work needed

**Implementation:**
```json
// package.json - Pin exact versions
{
  "devDependencies": {
    "@tailwindcss/postcss": "4.1.3",  // Remove ^
    "tailwindcss": "4.1.3"             // Remove ^
  }
}
```

**Add Pre-flight Check:**
```bash
# Add to npm scripts
"dev:safe": "./scripts/00112-fix-css-compilation.sh && next dev"
```

**Create CSS Verification:**
```javascript
// scripts/verify-css.js
const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, '../.next/static/css');
if (!fs.existsSync(cssDir) || fs.readdirSync(cssDir).length === 0) {
  console.error('⚠️  CSS compilation failed! Run: ./scripts/00112-fix-css-compilation.sh');
  process.exit(1);
}
```

### Option 2: Downgrade to Tailwind v3 (Stable Fallback)
**If v4 continues causing issues**

**Steps:**
```bash
# 1. Backup current setup
cp package.json package.json.v4.backup
cp src/app/globals.css src/app/globals.css.v4.backup

# 2. Install Tailwind v3
npm uninstall tailwindcss @tailwindcss/postcss
npm install -D tailwindcss@^3.4.0 postcss autoprefixer

# 3. Create tailwind.config.js
npx tailwindcss init -p

# 4. Update globals.css
# Replace @import 'tailwindcss' with:
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Pros:**
- Rock-solid stability
- Well-documented
- Extensive community support

**Cons:**
- Diverges from truth-seed
- Need to convert @theme directives
- Some v4 features unavailable

### Option 3: Dual Configuration (Development Safety)
**Use v3 for dev, v4 for production**

```json
// package.json
{
  "scripts": {
    "dev": "TAILWIND_VERSION=3 next dev",
    "build": "TAILWIND_VERSION=4 next build"
  }
}
```

**Not recommended** - Too complex to maintain

## Monitoring Strategy

### 1. Add Health Check
```bash
# Add to session startup
echo "Checking CSS compilation..."
if [ ! -d ".next/static/css" ] || [ -z "$(ls -A .next/static/css 2>/dev/null)" ]; then
  echo "⚠️  CSS not compiled - running fix..."
  ./scripts/00112-fix-css-compilation.sh
fi
```

### 2. Document Known Triggers
**CSS compilation fails when:**
- First run after git pull
- After adding new components
- After Node/npm updates
- Random Next.js hot reload issues

### 3. Session Handoff Protocol
Add to all handoffs:
```markdown
## CSS Compilation Check
- [ ] Verify CSS files exist: `ls .next/static/css/app/`
- [ ] If missing, run: `./scripts/00112-fix-css-compilation.sh`
- [ ] Restart dev server after fix
```

## Immediate Action Items

1. **For Session 113+:**
   - Run fix script if CSS issues appear
   - Document any new failure patterns
   - Don't waste time debugging v4 internals

2. **For Production:**
   - Consider v3 for stability
   - Or thoroughly test v4 build process
   - Add CSS verification to CI/CD

3. **For Development:**
   - Always check for 404 on CSS files first
   - Use fix script as first response
   - Only investigate if fix doesn't work

## Decision Matrix

| Scenario | Recommendation |
|----------|---------------|
| Dev work continuing | Keep v4 with fix script |
| Production deployment soon | Downgrade to v3 |
| Persistent failures (>3/day) | Downgrade to v3 |
| Working fine | Keep v4, monitor |

## The Golden Rule

**If you see UI completely broken:**
1. Check console for CSS 404 ✅
2. Run fix script ✅
3. Restart dev server ✅
4. Don't blame the last code change ✅

---

**Bottom Line**: Tailwind v4 is bleeding edge. We can work with it using the fix script, but be ready to downgrade to v3 if it becomes a persistent blocker.
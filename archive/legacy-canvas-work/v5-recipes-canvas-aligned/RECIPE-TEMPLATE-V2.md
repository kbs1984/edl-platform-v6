# UI Recipe Template v2.0
## Canvas-Aligned Frontend Pattern Library with Architectural Compliance

---

# UI Recipe: [Component Name]
**Version:** [1.0.0]
**Quality Score:** [XX/100]
**Session Heritage:** [SESSION-XX.XX where created]

## Canvas Reference
- **Canvas Node ID:** [from .canvas file]
- **Canvas Box Type:** [e.g., PlayerID Profile Box]
- **Canvas Position:** {x, y, width, height}
- **Canvas Color Code:** [hex/name]
- **Canvas File:** [path to .canvas file]

## Component Metadata
- **Category:** [Dashboard/Auth/Activity/etc.]
- **Role Support:** [Player/Supervisor/Enabler/All]
- **State Support:** [Grey/Active/All]
- **Session Origin:** [SESSION-XX.XX where created]
- **Architecture Pattern:** Vanilla JS Class (Session 152 Compliant)

## Recipe Dependencies
### Required Foundation Recipes
- [ ] foundation/color-system.md (for role colors)
- [ ] foundation/animations.md (for timing functions)
- [ ] foundation/grid-system.md (if using grid)

### Required Libraries
- **Supabase Client:** v2.39.0+ (NO React dependencies)
- **Browser Requirements:**
  - CSS Grid support
  - CSS custom properties
  - ES6 class syntax
  - LocalStorage API

### Performance Metrics
- **Bundle Size:** XX KB
- **Initial Render:** XX ms
- **Time to Interactive:** XX ms

## HTML Structure
```html
<!-- Include data-testid attributes for testing -->
<div class="component-name" 
     data-testid="component-root"
     data-role="player" 
     data-state="active"
     data-initial-data='{"key": "value"}'>
    
    <!-- Component HTML with test selectors -->
    <div class="component-part" data-testid="component-part">
        <!-- Content -->
    </div>
</div>
```

## CSS Classes & Variables
```css
/* Component styles with architectural compliance */
/* NO CSS-in-JS, NO styled-components */

.component-name {
    /* Base styles */
}

/* Role variations */
.component-name[data-role="player"] { }
.component-name[data-role="supervisor"] { }
.component-name[data-role="enabler"] { }

/* State variations */
.component-name[data-state="grey"] { }
.component-name[data-state="active"] { }

/* Mobile responsive */
@media (max-width: 640px) { }
```

## JavaScript Behavior (Client-Side)
```javascript
// Vanilla JS Class Pattern - NO React hooks!
class ComponentName {
    constructor(element) {
        this.element = element;
        this.state = {};
        this.updating = false; // Prevent race conditions
        this.lastUpdate = Date.now();
        this.init();
    }

    init() {
        // Parse initial server data
        const initialData = this.element.dataset.initialData;
        if (initialData) {
            this.state = JSON.parse(initialData);
        }
        
        // Check online status
        if (!navigator.onLine) {
            this.handleOfflineMode();
        }
        
        this.loadData();
        this.setupEventListeners();
        this.setupRealtimeSync();
    }

    async loadData() {
        // Prevent race conditions
        if (this.updating) return;
        this.updating = true;

        try {
            // Implementation
        } catch (error) {
            this.handleError(error);
        } finally {
            this.updating = false;
            this.lastUpdate = Date.now();
        }
    }

    handleOfflineMode() {
        this.showOfflineIndicator();
        this.loadFromLocalStorage();
    }

    checkDataFreshness() {
        // If data is stale (>5 minutes)
        if (Date.now() - this.lastUpdate > 300000) {
            this.showStaleDataWarning();
            this.refreshData();
        }
    }

    handleError(error) {
        console.error('Component error:', error);
        // User-friendly error handling
    }
}

// Auto-initialization pattern
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.component-name').forEach(element => {
        new ComponentName(element);
    });
});
```

## Server Component Integration (v6)
```typescript
// app/[component-path]/page.tsx
// Server Component - NO 'use client' directive!

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function ComponentPage() {
    // Server-side data fetching
    const supabase = createServerComponentClient({ cookies });
    
    const { data: initialData } = await supabase
        .from('table_name')
        .select('*')
        .single();

    return (
        <>
            {/* Server-rendered HTML with initial data */}
            <div className="component-name"
                 data-testid="component-root"
                 data-initial-data={JSON.stringify(initialData)}>
                {/* Pre-rendered content */}
            </div>

            {/* Hydration script - loaded after HTML */}
            <script src="/js/component-name.js" defer />
        </>
    );
}
```

## Supabase Integration Points
### Tables Used
- **v5 Tables:**
  - `table_name` (description)
  - `related_table` (description)

### v6 Table Mappings
- `v5_table` → `v6_table`
- `old_column` → `new_column`

### RLS Policies Required
```sql
-- v5 Policy
CREATE POLICY "policy_name_v5" ON table_name
    FOR SELECT USING (auth.uid() = user_id);

-- v6 Policy (if different)
CREATE POLICY "policy_name_v6" ON new_table_name
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM profiles WHERE user_id = auth.uid()
        )
    );
```

### Real-time Channels
- Channel: `channel_name`
- Events: INSERT, UPDATE, DELETE
- Filter: `column=eq.value`

## Migration Guide (v5 to v6)

### Table Migration
```sql
-- Migration script from v5 to v6
-- Map old structure to new
INSERT INTO v6_table (new_columns)
SELECT old_columns FROM v5_table;
```

### Code Migration Checklist
- [ ] Replace `user_metrics` with `profiles + emcoin_transactions`
- [ ] Update RLS policies to v6 structure
- [ ] Add Server Component wrapper
- [ ] Remove any React hooks if present
- [ ] Add data-testid attributes

### Breaking Changes
1. **Table Structure:** v6 uses different schema
2. **Auth Flow:** v6 uses server-side auth
3. **Real-time:** Different channel structure

## Edge Cases & Error States

### Offline Mode
```javascript
if (!navigator.onLine) {
    // Show offline indicator
    this.element.classList.add('offline-mode');
    
    // Load from localStorage
    const cachedData = localStorage.getItem('component_cache');
    if (cachedData) {
        this.state = JSON.parse(cachedData);
        this.render();
    }
}
```

### Stale Data Detection
```javascript
// Check if data hasn't updated in 5 minutes
checkDataFreshness() {
    const staleThreshold = 5 * 60 * 1000; // 5 minutes
    if (Date.now() - this.lastUpdate > staleThreshold) {
        this.element.classList.add('stale-data');
        this.showRefreshPrompt();
    }
}
```

### Race Condition Prevention
```javascript
async updateData(newData) {
    // Prevent concurrent updates
    if (this.updating) {
        console.warn('Update already in progress');
        return;
    }
    
    this.updating = true;
    try {
        await this.saveData(newData);
    } finally {
        this.updating = false;
    }
}
```

### Network Error Recovery
```javascript
async saveWithRetry(data, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await this.saveData(data);
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await this.delay(1000 * Math.pow(2, i)); // Exponential backoff
        }
    }
}
```

## Testing Strategy

### Unit Test Example
```javascript
describe('ComponentName', () => {
    it('should initialize with server data', () => {
        const element = document.createElement('div');
        element.dataset.initialData = JSON.stringify({ test: 'data' });
        
        const component = new ComponentName(element);
        expect(component.state.test).toBe('data');
    });
    
    it('should handle offline mode', () => {
        // Test offline behavior
    });
});
```

### E2E Test Selectors
```javascript
// Cypress example
cy.get('[data-testid="component-root"]').should('be.visible');
cy.get('[data-testid="component-part"]').click();
```

## Performance Optimization

### Lazy Loading
```javascript
// Load component only when visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            new ComponentName(entry.target);
            observer.unobserve(entry.target);
        }
    });
});

document.querySelectorAll('.component-name').forEach(el => {
    observer.observe(el);
});
```

### Debouncing
```javascript
debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
```

## Implementation Notes
- **Mobile-first:** Start with mobile layout, enhance for desktop
- **Accessibility:** ARIA labels, keyboard navigation, screen reader support
- **Progressive Enhancement:** Works without JavaScript, enhanced with it
- **Performance:** Lazy load, debounce, virtual scrolling for lists
- **Security:** Sanitize user input, validate on server

## Usage Example
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Component Example</title>
    <link rel="stylesheet" href="/css/design-system.css">
    <link rel="stylesheet" href="/css/component-name.css">
</head>
<body>
    <!-- Static version for SEO/initial render -->
    <div class="component-name" 
         data-testid="component-root"
         data-role="player" 
         data-state="active">
        <!-- Pre-rendered content -->
    </div>

    <!-- Dynamic version with initial data -->
    <div class="component-name" 
         data-testid="component-root-dynamic"
         data-initial-data='{"loaded": "from-server"}'>
        <!-- Will be hydrated -->
    </div>

    <script src="/js/supabase-client.js"></script>
    <script src="/js/component-name.js" defer></script>
</body>
</html>
```

## Recipe Validation Checklist

### Canvas Alignment
- [ ] Matches canvas node dimensions
- [ ] Follows canvas color scheme  
- [ ] Maintains canvas hierarchy
- [ ] Preserves canvas relationships
- [ ] Visual fidelity verified against mockup

### Architectural Compliance (Session 152)
- [ ] NO React hooks (useState, useEffect, etc.)
- [ ] NO 'use client' directive
- [ ] NO CSS-in-JS or styled-components
- [ ] YES vanilla JS class pattern
- [ ] YES data-* attributes for hydration
- [ ] YES Server Component compatible
- [ ] YES Progressive enhancement

### Testing Compliance
- [ ] All interactive elements have data-testid
- [ ] Unit tests cover core functionality
- [ ] E2E tests validate user flows
- [ ] Accessibility tests pass (WCAG 2.1 AA)

### Performance Compliance  
- [ ] Bundle size < 50KB
- [ ] First paint < 1.5s
- [ ] Time to interactive < 3.5s
- [ ] Lighthouse score > 90

### Migration Readiness
- [ ] v5 to v6 migration path documented
- [ ] Table mappings provided
- [ ] Breaking changes listed
- [ ] Rollback strategy defined

## Quality Score Calculation
```
Canvas Alignment:        /25 points
Architectural Compliance: /25 points  
Testing Coverage:        /20 points
Performance Metrics:     /15 points
Documentation:          /10 points
Migration Path:         /5 points
---
Total:                  /100 points
```

## Version History
- **1.0.0** - Initial recipe creation
- **1.0.1** - Added test selectors
- **1.0.2** - Enhanced error handling

## Related Recipes
- [Link to related component recipes]
- [Link to required foundation recipes]
- [Link to flow recipes using this component]

## Verification Commands
```bash
# Canvas node verification
python3 scripts/verify-canvas-mapping.py \
    --recipe "component-name-recipe.md" \
    --canvas "canvas-file.canvas"

# Architectural compliance check (should return nothing)
grep -E "useState|useEffect|'use client'" component-name-recipe.md

# Table mapping verification
python3 scripts/verify-table-mappings.py \
    --v5-tables "old_table" \
    --v6-tables "new_table"

# Performance testing
lighthouse https://localhost:3000/component --view
```

## Support & Issues
- **Recipe Issues:** [Create issue in ui-recipes repo]
- **Implementation Help:** [Link to Discord/Slack channel]
- **Canvas Updates:** [Link to canvas update process]

---

*This recipe follows the EDL Platform Architecture Guidelines established in Session 152 and prevents the architectural deviations that occurred in Sessions 167-170.*
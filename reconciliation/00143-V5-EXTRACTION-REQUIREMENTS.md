---
session: "00143"
type: "extraction-plan"
status: "ready-for-v5-session"
created: "2025-09-02"
title: "v5 Extraction Requirements - What to Mine from 16,000 Lines of Cyworld Magic"
purpose: "Define exactly what Session 144 needs from v5 codebase analysis to bring the magic to v6"
topics: ["v5", "extraction", "cyworld", "patterns", "magic", "benchmark"]
priority: "P0"
domain: "reconciliation"
---

# v5 Extraction Requirements for Session 144

## The Mission
Extract the Cyworld magic from v5's 16,000+ lines without inheriting its technical debt. v5 had the vision and addiction mechanics but lacked foundation. v6 has foundation but lacks the magic. This extraction bridges that gap.

---

## 1. EmCoin Integration Mapping (CRITICAL)

### The "46 Integration Points" Deep Dive
We need to find and document EVERY place EmCoins touched the UI/UX:

```javascript
// Find patterns like:
- emCoin, EmCoin, EMCOIN
- dotori (Korean reference?)  
- coins, currency, balance
- reward, earn, spend
- wallet, transaction
```

### Specific Extractions Needed:

#### 1.1 Transaction Triggers
- [ ] What user actions earned EmCoins?
- [ ] How much for each action?
- [ ] Were there multipliers or bonuses?
- [ ] Daily/weekly/monthly patterns?

#### 1.2 Spending Opportunities  
- [ ] What could students buy?
- [ ] Price points for each item?
- [ ] Limited time offers?
- [ ] Subscription vs one-time purchases?

#### 1.3 Display Patterns
- [ ] Where was balance shown? (Multiple places?)
- [ ] Animation when earning? (Coins flying?)
- [ ] Sound effects on transactions?
- [ ] Visual feedback for spending?

#### 1.4 Social Economy
- [ ] Could students gift EmCoins?
- [ ] Team pooling mechanics?
- [ ] Public wealth display?
- [ ] Leaderboards based on wealth?

---

## 2. Cyworld UI/UX Patterns (ESSENTIAL)

### 2.1 The Minihompy Equivalent
```javascript
// Look for customization systems:
- profile, dashboard, homepage
- theme, skin, template, customize
- background, wallpaper, decoration
- music, sound, bgm
```

**Extract**:
- [ ] Customization options available
- [ ] How users accessed customization
- [ ] Preview mechanisms
- [ ] Save/apply patterns
- [ ] Social sharing of designs

### 2.2 Today Counter Implementation
```javascript
// Visitor tracking patterns:
- visitor, viewers, views
- today, daily, count
- profile_views, who_viewed
```

**Extract**:
- [ ] Where was "Today" displayed?
- [ ] Reset timing (midnight?)
- [ ] Notification of new visitors?
- [ ] Friend vs stranger distinction?
- [ ] Peak visitor celebrations?

### 2.3 Achievement Celebrations
```javascript
// Achievement/badge patterns:
- achievement, badge, trophy
- unlock, earned, accomplished
- celebration, congratulations
- milestone, level_up
```

**Extract**:
- [ ] Unlock animation sequences
- [ ] Sound effects used
- [ ] Modal/popup designs
- [ ] Social broadcast mechanisms
- [ ] Collection display layouts

---

## 3. Addiction Mechanics Analysis

### 3.1 Daily Hook Metrics
**Time-based patterns to find**:
- [ ] Login bonus implementation
- [ ] Streak tracking systems
- [ ] Daily quest/challenge structure
- [ ] Time-limited events
- [ ] "Come back tomorrow" prompts

### 3.2 Dopamine Timing
**Measure these interactions**:
```yaml
Key Metrics:
- Time from login → first reward
- Time from action → feedback
- Frequency of positive reinforcement
- Variable reward schedules
- Near-miss mechanics
```

### 3.3 FOMO (Fear of Missing Out) Triggers
- [ ] Limited time offers
- [ ] Exclusive items/themes
- [ ] Friend activity notifications
- [ ] "Last chance" warnings
- [ ] Countdown timers

---

## 4. Technical Patterns to Extract

### 4.1 Component Architecture
```javascript
// How v5 structured identity components:
- Component composition patterns
- Props for customization
- State management approach
- Real-time update mechanisms
```

### 4.2 Data Flow Patterns
- [ ] How profile data propagated
- [ ] Caching strategies for performance
- [ ] Optimistic updates implementation
- [ ] WebSocket usage patterns

### 4.3 Performance Tricks
- [ ] Lazy loading strategies
- [ ] Image optimization approaches
- [ ] Animation performance hacks
- [ ] Bundle splitting decisions

---

## 5. Anti-Patterns to Document (What NOT to Copy)

### 5.1 Technical Debt Markers
Look for and document:
- [ ] God components (1000+ lines)
- [ ] Prop drilling hell
- [ ] Mixed concerns (UI + business logic)
- [ ] Hard-coded values that should be config
- [ ] Missing error boundaries

### 5.2 Maintenance Nightmares
- [ ] Deeply nested conditionals
- [ ] Copy-paste code blocks
- [ ] Inconsistent naming conventions
- [ ] Missing TypeScript types
- [ ] No separation of concerns

---

## 6. User Journey Mapping

### 6.1 First-Time User Experience
Document the exact flow:
```
1. Landing → What hook?
2. Signup → How smooth?
3. First customization → How guided?
4. First EmCoin → How celebrated?
5. First friend → How encouraged?
6. First return → What brought them back?
```

### 6.2 Daily Active User Routine
```
1. Login → What's shown first?
2. Check visitors → How prominent?
3. Claim bonus → How rewarding?
4. Check friends → What's new?
5. Customize → What's new to buy?
6. Achieve → What's next goal?
```

### 6.3 Parent Journey
```
1. Child requests → How presented?
2. Value proposition → How explained?
3. Payment → How smooth?
4. Monitoring → What visibility?
5. ROI → How demonstrated?
```

---

## 7. Specific Code Sections to Extract

### 7.1 Complete Files to Copy/Study
Priority files to extract entirely:
- [ ] EmCoin transaction engine
- [ ] Visitor tracking implementation  
- [ ] Achievement system
- [ ] Customization engine
- [ ] Daily bonus logic
- [ ] Friend system with real-time

### 7.2 UI Components to Screenshot
Visual documentation needed:
- [ ] Profile page with all customizations
- [ ] Dashboard with EmCoin display
- [ ] Achievement unlock modal
- [ ] Visitor counter widget
- [ ] Friend activity feed
- [ ] Theme selector interface
- [ ] EmCoin transaction history

### 7.3 Configuration/Constants Files
Extract all:
- [ ] EmCoin reward amounts
- [ ] Achievement requirements
- [ ] Theme/customization options
- [ ] Daily bonus schedules
- [ ] Animation timings
- [ ] Sound effect mappings

---

## 8. Performance Benchmarks

### 8.1 Key Metrics to Measure
```yaml
Load Times:
- Initial page load
- Dashboard render
- Profile page render
- EmCoin balance update
- Visitor count refresh

Interaction Times:
- Click → EmCoin animation
- Unlock → Achievement modal
- Theme change → Apply
- Friend add → Confirmation
- Bonus claim → Reward

Bundle Sizes:
- Main bundle
- Vendor bundle
- Lazy loaded chunks
- Image assets
- Sound files
```

### 8.2 User Perception Metrics
- [ ] Time to first meaningful paint
- [ ] Time to interactive
- [ ] Time to "wow" moment
- [ ] Rage click zones
- [ ] Drop-off points

---

## 9. The Cyworld Magic Formula

### Document the Emotional Journey
For each major feature, extract:
1. **Anticipation** - What creates excitement?
2. **Action** - How smooth is execution?
3. **Reward** - What's the payoff?
4. **Social** - How is it shared?
5. **Progress** - What's next?

### The Addiction Loop
```
Login → Check visitors (validation)
      → Check EmCoins (wealth)
      → Check friends (social)
      → Claim bonus (reward)
      → Customize (expression)
      → Achieve (progress)
      → Share (broadcast)
      → Plan tomorrow (anticipation)
```

---

## 10. Extraction Output Format

### For Session 144, deliver:

#### 10.1 Code Extraction Package
```
v5-extraction/
├── critical-components/
│   ├── EmCoinEngine.js
│   ├── VisitorTracker.js
│   ├── AchievementSystem.js
│   └── CustomizationEngine.js
├── ui-patterns/
│   ├── screenshots/
│   └── component-analysis.md
├── configurations/
│   ├── emcoin-rewards.json
│   ├── achievement-config.json
│   └── theme-options.json
└── magic-formula.md
```

#### 10.2 Magic Formula Document
```markdown
# v5 Cyworld Magic Formula

## The Hook (0-10 seconds)
[What grabbed attention immediately]

## The Loop (Daily cycle)
[Step-by-step daily routine]

## The Investment (Why users stayed)
[Psychological and emotional investments]

## The Social Proof (Viral mechanics)
[How users brought friends]

## The Monetization (Parent buy-in)
[Value proposition that worked]
```

#### 10.3 Implementation Priority List
```markdown
# v5 → v6 Implementation Priority

## Must Have (Week 1)
1. [Feature] - [Why critical] - [Complexity]

## Should Have (Week 2)
1. [Feature] - [Why important] - [Complexity]

## Nice to Have (Week 3+)
1. [Feature] - [Why desired] - [Complexity]

## Don't Copy (Never)
1. [Anti-pattern] - [Why problematic]
```

---

## Success Criteria

The v5 extraction is successful when Session 144 can:

1. **Understand** the complete EmCoin economy
2. **Replicate** the daily engagement loop
3. **Implement** the core Cyworld mechanics
4. **Avoid** the technical debt traps
5. **Measure** the magic with metrics
6. **Prioritize** based on addiction impact
7. **Document** the emotional journey

---

## Questions for v5 Session

### Priority 1: The Magic
1. What made students check EDL like Cyworld?
2. What specific features created daily habits?
3. What celebrations felt most rewarding?
4. What customizations were most popular?
5. What made parents willing to pay?

### Priority 2: The Implementation
1. How was EmCoin balance calculated/displayed?
2. How did visitor tracking work technically?
3. How were achievements triggered/celebrated?
4. How did real-time updates work?
5. How was customization data stored/applied?

### Priority 3: The Lessons
1. What worked better than expected?
2. What failed despite effort?
3. What would you rebuild differently?
4. What was unnecessarily complex?
5. What simple thing had huge impact?

---

## Final Note to v5 Session

You built something with 16,000 lines that captured the Cyworld magic. We have a solid foundation in v6 but lack that magic. Help us understand not just WHAT you built, but WHY it worked and HOW it made users feel.

Focus on:
- **Emotional hooks** over technical implementation
- **User behavior** over code structure  
- **Addiction mechanics** over feature lists
- **The magic formula** over line counts

Your 16,000 lines contain wisdom that transcends code. Help us extract it.

---

*"v5 had magic without foundation. v6 has foundation without magic. Together, they create the future."*
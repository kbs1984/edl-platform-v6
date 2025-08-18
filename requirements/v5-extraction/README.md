# v5 Extraction - Learning from 16,000 Lines

**Created**: Session 00017  
**Purpose**: Extract patterns and lessons from v5 codebase

---

## What to Extract

### Working Patterns
- State management approaches that worked
- Component architecture that scaled
- Data flow patterns
- Event handling strategies

### Failed Patterns (Lessons)
- The `profiles` vs `profile` schema mismatch
- Overly complex state management
- Tight coupling issues
- Performance bottlenecks

### Reusable Components
- Authentication flows
- Team management logic
- Activity tracking systems
- Payment/emCoin implementation

### Technical Decisions
- Why certain libraries were chosen
- Architecture decisions and trade-offs
- Security implementations
- Performance optimizations

---

## Extraction Status

⏳ **Pending**: v5 codebase needs to be analyzed
- Location: [To be determined]
- Size: ~16,000 lines frontend
- Sessions involved: Pre-Session 01

---

## Key Lessons Already Known

1. **Schema Naming**: Use consistent pluralization (`profiles` not `profile`)
2. **State Management**: Simpler is better
3. **Component Design**: Favor composition over inheritance
4. **Data Flow**: Unidirectional flow prevents bugs

---

*This directory will be populated during Sessions 18-19*
# Supabase SQL Protocol
## Session 00012 Established - Critical for All Future Database Work

### Core Principles (From Desktop Guidance)

#### 1. RLS Policy Structure (MANDATORY)
```sql
-- SELECT: Only USING, no WITH CHECK
CREATE POLICY "policy_name" ON table_name
  FOR SELECT
  TO authenticated, anon  -- Always specify roles
  USING (condition);

-- INSERT: Only WITH CHECK, no USING
CREATE POLICY "policy_name" ON table_name
  FOR INSERT
  TO authenticated
  WITH CHECK (condition);

-- UPDATE: Both USING and WITH CHECK
CREATE POLICY "policy_name" ON table_name
  FOR UPDATE
  TO authenticated
  USING (condition)
  WITH CHECK (condition);

-- DELETE: Only USING, no WITH CHECK
CREATE POLICY "policy_name" ON table_name
  FOR DELETE
  TO authenticated
  USING (condition);
```

#### 2. Authentication Helpers
- **ALWAYS USE**: `auth.uid()` not `current_user`
- **AVAILABLE**: `auth.jwt()`, `auth.role()`

#### 3. Role Specifications
- `authenticated` - Logged in users
- `anon` - Public/anonymous access  
- `service_role` - Admin (bypasses RLS)

### Migration File Structure

```sql
-- Session XXXXX: [Purpose]
-- Created: [Date]
-- Attribution: [Why this exists]

-- 1. Create tables with IF NOT EXISTS
CREATE TABLE IF NOT EXISTS table_name (...);

-- 2. Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- 3. Create policies with proper structure
-- [Follow patterns above]

-- 4. Create indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_name ON table(column);

-- 5. Verification message
SELECT '✅ Migration complete' as status;
```

### Pre-flight Checklist (MANDATORY)

Before ANY database work:
- [ ] Read this SUPABASE-SQL-PROTOCOL.md document
- [ ] Run `./scripts/structure-check.sh` to verify system health
- [ ] Check REALITY_INDEX.md for current database state
- [ ] If clean slate needed, use DYNAMIC SQL (not hardcoded tables)
- [ ] Prepare verification script alongside migration

### Testing Protocol

1. **Clean Slate Verification**: Run `00012_002_verify_clean.sql`
2. **Apply Migration**: Use Supabase SQL Editor
3. **Verify Deployment**: Run verification script
4. **Update REALITY_INDEX.md**: Document new database state
5. **Update Session Log**: Record success/failure with verification

### Common Pitfalls to Avoid

1. ❌ Don't insert into `auth.users` directly
2. ❌ Don't use hardcoded DROP statements for cleanup
3. ❌ Don't forget the TO clause in policies
4. ❌ Don't mix USING/WITH CHECK incorrectly

### Reference Implementation
- **Success Story**: `00012_001_teams_first_v2.sql`
- **Verification**: `00012_005_verify_deployment.sql`

---
*Established by Session 00012 after learning from migration failures*
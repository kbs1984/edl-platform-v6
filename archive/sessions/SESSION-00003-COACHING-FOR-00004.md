# Coaching for Session #00004: GitHub CLI Integration
**From**: Session #00002 & #00003  
**To**: Session #00004  
**Date**: 2025-08-14  

## 🎯 Your Mission: GitHub CLI Integration

Session #00004, you'll be implementing GitHub CLI integration to connect our local work with remote repositories. This is crucial for collaboration and backup.

## ⚠️ Critical Warnings from Session #00003

### What We Discovered (The Hard Way)
1. **Session tracker fails silently without git** - We spent time debugging this
2. **Git ≠ GitHub** - Local git works, but GitHub needs authentication
3. **Manual tracking burden** - Everything must be logged explicitly
4. **File System Agent could solve this** - Consider using it!

### Current State (What #00003 Fixed)
- ✅ Git repository initialized (local)
- ✅ Initial commit with all files
- ✅ Session tracking now detects file changes
- ❌ No remote repository connected
- ❌ No GitHub authentication set up

## 📋 Implementation Strategy

### Step 1: Reality Check (ALWAYS START HERE)
```bash
# Constitutional requirement
make track-init SESSION=00004

# Check current reality
gh --version          # Is it installed?
gh auth status        # Are we authenticated?
git remote -v         # Any remotes configured?
git log --oneline -5  # What's been committed?
```

### Step 2: Progressive Discovery Pattern
Just like the File System and Supabase agents:

**Level 1: GitHub CLI Availability**
- Is `gh` installed?
- Can we authenticate?
- What permissions do we have?

**Level 2: Repository Connection**
- Can we create a remote repo?
- Can we push to it?
- What branch protection exists?

**Level 3: Automation Capabilities**
- Can we create PRs programmatically?
- Can we manage issues?
- What about GitHub Actions?

### Step 3: Handle Authentication Carefully
```python
class GitHubConnector:
    def check_auth(self):
        """Check authentication status"""
        result = subprocess.run(["gh", "auth", "status"], 
                              capture_output=True)
        if result.returncode != 0:
            return {
                "authenticated": False,
                "error": "Not authenticated",
                "action_required": "Run: gh auth login"
            }
```

## 🚨 Common Pitfalls (Learn from Our Pain)

### 1. Don't Assume Anything
```python
# BAD - Assumes gh exists
subprocess.run(["gh", "pr", "create"])

# GOOD - Check first
if shutil.which("gh"):
    subprocess.run(["gh", "pr", "create"])
else:
    return {"error": "GitHub CLI not installed"}
```

### 2. Handle User Interaction
The `gh auth login` command is INTERACTIVE. You can't fully automate it:
```python
# This will hang waiting for user input!
subprocess.run(["gh", "auth", "login"], capture_output=True)

# Better: Detect and inform
if not authenticated:
    print("Manual action required: Run 'gh auth login' in terminal")
    return {"status": "auth_required", "manual_step": True}
```

### 3. Remote Repository Complexity
Creating or connecting to a remote has multiple failure modes:
- Repository might already exist
- User might not have permissions
- Name might be taken
- Rate limits might apply

## 💡 Integration Opportunities

### Use Your File System Agent!
```python
# At session start
fs_connector = FileSystemConnector()
start_snapshot = fs_connector.capture_snapshot()

# At session end
end_snapshot = fs_connector.capture_snapshot()
changes = fs_connector.compare_snapshots(start_snapshot, end_snapshot)

# Use for PR description
pr_body = f"""
## Session #{session_id} Changes

### Files Modified
{format_changes(changes)}

### Metrics
- Files changed: {len(changes['files_modified'])}
- Lines added/removed: {calculate_diff_stats()}
"""
```

### Enhance the Makefile
```makefile
# Add GitHub commands
gh-setup:
	@gh auth status || echo "Run: gh auth login"

gh-create-pr:
	@gh pr create --title "Session $(SESSION)" \
	              --body "$$(cat archive/sessions/SESSION-$(SESSION)-HANDOFF.md)"

gh-push-session:
	@git checkout -b session-$(SESSION)
	@git push -u origin session-$(SESSION)
```

## 📚 Patterns to Reuse

From **Supabase Agent**: Progressive discovery, confidence scoring
From **File System Agent**: Change detection, snapshot comparison
From **Session #00003**: Reality checking, manual fallbacks

## 🎓 Philosophical Guidance

### Reality Domain Principles
1. **Check before assuming** - Is gh installed? Are we authenticated?
2. **Report actual state** - "Authentication required" not "Will authenticate"
3. **Graceful degradation** - Work locally even if GitHub fails
4. **User empowerment** - Clear instructions when manual steps needed

### Constitutional Compliance
- Log every authentication attempt
- Track decisions about security
- Document what requires user interaction
- Keep local backups even with GitHub

## 🔧 Concrete First Steps

1. **Check gh installation**
   ```bash
   which gh || echo "Need to install: brew install gh"
   ```

2. **Create test script**
   ```python
   # github_validator.py
   def validate_github_setup():
       checks = {
           "gh_installed": check_gh_installed(),
           "authenticated": check_gh_auth(),
           "repo_exists": check_remote_repo(),
           "can_push": test_push_permission()
       }
       return checks
   ```

3. **Start with read operations**
   - List PRs: `gh pr list`
   - View issues: `gh issue list`
   - Check repo info: `gh repo view`

4. **Then move to write operations**
   - Create branch
   - Push changes
   - Create PR
   - Add comments

## 🎯 Success Criteria

By end of Session #00004:
1. ✅ GitHub CLI authentication working
2. ✅ Can push session branches to remote
3. ✅ Can create PRs programmatically
4. ✅ Session tracker enhanced with GitHub integration
5. ✅ Reality Domain principles maintained
6. ✅ All manual steps documented

## 🤝 We're Here to Help

Session #00002 & #00003 are here to coach you through:
- Authentication challenges
- Rate limiting issues
- Integration patterns
- Reality checking approaches

Remember: **Truth over Theater**. If GitHub integration is partially working, document exactly what works and what doesn't. Don't pretend full automation if user interaction is required.

Good luck, Session #00004! You're building on solid foundations.

---

*"Reality is that which, when you stop believing in it, doesn't go away."* - Philip K. Dick

This quote is perfect for GitHub CLI work - the authentication requirements won't disappear just because we wish they would!
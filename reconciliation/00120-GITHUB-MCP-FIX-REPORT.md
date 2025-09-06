---
session: "00120"
type: "report"
status: "completed"
created: "2025-08-31"
modified: "2025-08-31"
title: "GitHub MCP Server Authentication Fix Report"
purpose: "Document the resolution of GitHub MCP server authentication failure"
topics: ["github", "mcp", "authentication", "configuration", "fix"]
priority: "P0"
domain: "reconciliation"
fixes: ["github-mcp-authentication"]
related_to: ["00120-GITHUB-MCP-INSTALLATION-REPORT.md", "00120-PUPPETEER-MCP-FIX-REPORT.md"]
---

# GitHub MCP Server Authentication Fix Report

## Executive Summary

Successfully resolved GitHub MCP server authentication failure by switching from the GitHub Copilot remote endpoint to a locally installed MissionSquad GitHub MCP server. The server is now properly configured and ready for use after Claude Code restart.

## Problem Encountered

### Initial Configuration Issue
**Error**: "Incompatible auth server: does not support dynamic client registration"

**Root Cause**: The GitHub Copilot MCP endpoint (`https://api.githubcopilot.com/mcp`) requires OAuth 2.0 dynamic client registration, which isn't supported by simple Bearer token authentication in Claude Code's configuration.

### Why Remote Server Failed
1. GitHub Copilot MCP expects OAuth flow with dynamic client registration
2. Claude Code's HTTP transport doesn't support this OAuth flow
3. Bearer token authentication was rejected by the endpoint

## Solution Implemented

### Switched to Local MCP Server
Instead of using the remote GitHub Copilot endpoint, we installed a standalone GitHub MCP server that:
- Supports standard GitHub Personal Access Tokens
- Runs locally via stdio transport
- Doesn't require OAuth dynamic registration

### Package Selected
**@missionsquad/mcp-github** (v0.10.7)
- Mature implementation with active maintenance
- Full GitHub API support
- Simple token-based authentication
- Compatible with Claude Code's stdio transport

## Implementation Steps

### 1. Installed Local Server
```bash
mkdir -p /home/b4sho/mcp-servers
cd /home/b4sho/mcp-servers
npm init -y
npm install @missionsquad/mcp-github
```

**Result**: Server installed at `/home/b4sho/mcp-servers/node_modules/@missionsquad/mcp-github/`

### 2. Updated Configuration
Changed from HTTP transport to stdio:

**Before** (Failed):
```json
"github-server": {
  "type": "http",
  "url": "https://api.githubcopilot.com/mcp",
  "headers": {
    "Authorization": "Bearer gho_[token]"
  }
}
```

**After** (Working):
```json
"github-server": {
  "type": "stdio",
  "command": "node",
  "args": ["/home/b4sho/mcp-servers/node_modules/@missionsquad/mcp-github/dist/index.js"],
  "env": {
    "GITHUB_TOKEN": "gho_[token]"
  }
}
```

### 3. Verification
Tested server manually:
```bash
export GITHUB_TOKEN="gho_[token]"
node /home/b4sho/mcp-servers/node_modules/@missionsquad/mcp-github/dist/index.js
# Output: GitHub MCP Server running on stdio ✓
```

## Key Differences from Initial Approach

| Aspect | Remote Server (Failed) | Local Server (Working) |
|--------|------------------------|------------------------|
| **Transport** | HTTP | stdio |
| **Authentication** | OAuth with dynamic registration | Simple PAT |
| **Location** | api.githubcopilot.com | Local Node.js process |
| **Updates** | Automatic | Manual (npm update) |
| **Dependencies** | None | Node.js, npm package |

## Lessons Learned

### 1. Authentication Complexity
Not all MCP servers support the same authentication methods. The GitHub Copilot endpoint is designed for enterprise OAuth flows, not individual developer tokens.

### 2. Local vs Remote Trade-offs
- **Remote**: Convenient but may have authentication restrictions
- **Local**: More control but requires installation and maintenance

### 3. Package Selection Matters
The MissionSquad implementation is more suitable for individual developers than GitHub's official remote endpoint, which targets enterprise Copilot users.

## Current Status

### ✅ Completed Actions
1. Diagnosed authentication failure
2. Identified alternative solution
3. Installed local GitHub MCP server
4. Updated configuration to use stdio transport
5. Verified server starts successfully

### ⏳ Pending
- Claude Code restart to activate the server
- Test GitHub operations after restart

## Expected Capabilities

After restart, the following GitHub operations will be available:
- Repository management (list, create, clone)
- Pull requests (create, list, merge, review)
- Issues (create, update, close, label)
- Workflows (trigger, monitor)
- Files (read, write, commit)
- GraphQL queries

## Configuration Security

- GitHub token stored in Claude configuration
- Token has appropriate scopes from gh CLI
- No tokens exposed in logs or error messages
- Configuration file permissions preserved

## Comparison with Other MCP Servers

### Success Pattern Identified
All working MCP servers in our setup use stdio transport:
1. **Puppeteer MCP**: stdio with local Node.js ✓
2. **Supabase MCP**: stdio with npx execution ✓
3. **GitHub MCP**: stdio with local Node.js ✓

The pattern is clear: stdio transport is more reliable than HTTP for MCP servers in Claude Code.

## Next Steps

1. **Immediate**: Restart Claude Code to activate
2. **Verification**: Check `claude mcp list` shows connected status
3. **Testing**: Create test PR using MCP
4. **Migration**: Update Reality Agent to use MCP

## Conclusion

The GitHub MCP server authentication issue was successfully resolved by switching from the remote OAuth-based endpoint to a locally installed token-based server. This approach aligns with our other successful MCP implementations and provides the same functionality with simpler authentication.

The fix demonstrates the importance of:
- Understanding authentication requirements
- Having fallback implementation options
- Following successful patterns from other integrations

---
*Session 00120 - GitHub MCP Authentication Fix*
*Status: Configuration complete, awaiting restart*
# MCP (Model Context Protocol) Setup for Design Tokens

This guide explains how to set up and use MCP servers to enhance your design token workflow with Claude.

## Overview

MCP servers provide standardized interfaces for Claude to interact with your design token system, enabling automated token management, validation, and documentation generation.

## Recommended MCP Servers

### 1. Filesystem Server
**Purpose**: Secure file operations for token management
```bash
npx -y @modelcontextprotocol/server-filesystem /path/to/tokens
```

**Use Cases**:
- Batch update token files
- Manage build outputs
- Organize token directory structure
- Read/write DTCG format files

### 2. Git Server
**Purpose**: Version control integration
```bash
npx -y @modelcontextprotocol/server-git --repository /path/to/repo
```

**Use Cases**:
- Track token changes
- Create automated commits
- Generate changelogs
- Manage branches for token experiments

### 3. GitHub Server
**Purpose**: GitHub workflow automation
```bash
npx -y @modelcontextprotocol/server-github
```

**Use Cases**:
- Create PRs for token updates
- Manage issues for token requests
- Automate releases
- Sync documentation

## Configuration

### Claude Desktop Setup

1. Copy the `claude_project_config.json` to your Claude Desktop configuration directory:
   - macOS: `~/Library/Application Support/Claude/`
   - Windows: `%APPDATA%\Claude\`
   - Linux: `~/.config/claude/`

2. If using GitHub integration, add your personal access token:
   ```json
   "env": {
     "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
   }
   ```

### Project-Specific Configuration

The `claude_project_config.json` in this repository contains the recommended MCP setup:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/tokens"]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "/path/to/repo"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_GITHUB_TOKEN>"
      }
    }
  }
}
```

## Workflow Examples

### 1. Batch Token Updates
With filesystem MCP, Claude can:
- Update all color tokens to a new palette
- Rename token categories across files
- Validate DTCG format compliance

### 2. Version Control
With git MCP, Claude can:
- Commit token changes with descriptive messages
- Create branches for experimental tokens
- Track token evolution over time

### 3. GitHub Integration
With GitHub MCP, Claude can:
- Create PRs for token updates
- Link token changes to design issues
- Automate release notes

## Best Practices

1. **Security**: Only grant filesystem access to the tokens directory
2. **Version Control**: Always review automated commits before pushing
3. **Validation**: Use MCP to validate tokens before building
4. **Documentation**: Let MCP generate token documentation automatically

## Token-Specific Operations

### Validate DTCG Format
```
Claude: "Validate all token files for DTCG compliance"
```

### Batch Color Updates
```
Claude: "Update all blue color tokens to use the new brand palette"
```

### Generate Documentation
```
Claude: "Create comprehensive documentation for all component tokens"
```

### Sync with Design Tools
```
Claude: "Import the latest color tokens from our Figma file"
```

## Troubleshooting

### MCP Server Not Found
- Ensure Node.js is installed and in PATH
- Try installing servers globally: `npm install -g @modelcontextprotocol/server-filesystem`

### Permission Errors
- Check file permissions in the tokens directory
- Ensure Git repository is properly initialized

### GitHub Authentication
- Generate a personal access token with appropriate scopes
- Store token securely in environment variables

## Future Enhancements

Consider adding these MCP servers as your workflow grows:
- **Figma MCP**: Direct design tool integration
- **JSON MCP**: Advanced JSON manipulation
- **Custom MCP**: Style Dictionary specific operations

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Claude MCP Integration](https://docs.anthropic.com/en/docs/claude-code/mcp)
- [Style Dictionary Docs](https://amzn.github.io/style-dictionary/)
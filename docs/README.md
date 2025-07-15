# Documentation

This directory contains documentation for the design token system.

## Available Documentation

### For Non-Technical Users
- **[NON_TECHNICAL_GUIDE.md](./NON_TECHNICAL_GUIDE.md)** - Complete guide to design tokens in plain language
- **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)** - Get started viewing tokens in 5 minutes
- **[DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md)** - Understanding our design choices

### For Technical Users
- **[MCP_SETUP.md](./MCP_SETUP.md)** - Setting up MCP servers for Claude integration
- **[BUILD_OPTIONS.md](./BUILD_OPTIONS.md)** - Different build configurations explained
- **[CUSTOM_TOKENS_GUIDE.md](./CUSTOM_TOKENS_GUIDE.md)** - Creating and using custom tokens
- **[MULTIBRAND_THEMING_GUIDE.md](./MULTIBRAND_THEMING_GUIDE.md)** - Implementing multibrand theming
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing design tokens

## Token Documentation

The build process automatically generates token documentation in `build/docs/tokens.md` that includes:
- All design tokens organized by category
- Token values and descriptions
- Usage guidelines

To generate the latest documentation:
```bash
npm run build
```

## Additional Resources

- [Style Dictionary Documentation](https://amzn.github.io/style-dictionary/)
- [DTCG Format Specification](https://design-tokens.github.io/community-group/format/)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
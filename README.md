# Design Token System

A modern design token management system powered by Style Dictionary v4, supporting DTCG format and dynamic prefix configuration. This project includes Tokens Studio graph engine integration for visual token programming.

## 📚 For Non-Technical Users

**New to design tokens?** Start here:
- 🎯 [**Quick Start Guide**](./docs/QUICK_START_GUIDE.md) - View and understand tokens in 5 minutes
- 📖 [**Non-Technical Guide**](./docs/NON_TECHNICAL_GUIDE.md) - Complete guide in plain English
- 👁️ [**Token Viewer Guide**](./docs/TOKEN_VIEWER_GUIDE.md) - Visual tools and examples
- 💡 [**Design Decisions**](./docs/DESIGN_DECISIONS.md) - Why we chose these values

### What This System Does
This system manages all the visual design decisions for our digital products - colors, spacing, typography, and more. Think of it as a "style guide robot" that ensures consistency across everything we build.

**Current Design System**: The tokens use the "mantine" prefix for all generated values.

## 🚀 Features

- **DTCG Format Compliance**: Full support for W3C Design Token Community Group specification
- **Dynamic Prefix System**: Configure token prefix via `_prefix.json` (currently "mantine")
- **Multi-Format Output**: CSS, SCSS, JavaScript, TypeScript, and JSON
- **Theme Support**: Light and dark theme configurations
- **Multibrand System**: Support for multiple brands with unique identities
- **Development Tools**: ESLint, Prettier, Jest testing, and watch mode
- **MCP Integration**: Enhanced Claude AI workflow support
- **Example Demos**: Interactive HTML examples for token usage

## 📋 Prerequisites

- Node.js v18.12.1 (use `.nvmrc` with nvm)
- npm or yarn

## 🛠️ Installation

```bash
# Install Node version
nvm use

# Install dependencies
npm install
```

## 📦 Build Commands

### Standard Build (Works with Node 18+)
```bash
npm run build           # Build all token formats
npm run build:verbose   # Build with detailed logging
npm run clean          # Clean build directory
```

### Development Mode
```bash
npm run dev    # Watch mode for token changes
npm run watch  # Alias for dev mode
```

### Custom Tokens Build
```bash
npm run build:custom         # Build custom tokens with custom prefix
npm run build:custom:verbose # Verbose custom build
npm run dev:custom          # Watch mode for custom tokens
```

### Multibrand Build
```bash
npm run build:brands         # Build all brand tokens
npm run build:brands:verbose # Verbose brand build
npm run dev:brands          # Watch mode for brands
# Build specific brands:
npm run build:brands clearco brand-b
```

### Testing & Quality
```bash
npm test              # Run Jest tests
npm run test:watch    # Test watch mode
npm run test:coverage # Generate coverage report
npm run validate      # Validate token structure
```


## 📁 Project Structure

```
├── tokens/                 # Source design tokens
│   ├── _prefix.json       # Dynamic prefix configuration
│   ├── _custom-prefix.json # Custom tokens prefix
│   ├── primitives/        # Core design tokens (colors, spacing, etc.)
│   ├── semantic/          # Theme-specific tokens
│   ├── components/        # Component-level tokens
│   ├── custom/           # Custom brand-specific tokens
│   └── brands/           # Multibrand token definitions
│       ├── clearco/      # Clearco brand tokens
│       └── brand-b/      # Example second brand
├── graph/                 # Tokens Studio graph definitions
│   ├── examples/          # Example graph configurations
│   ├── resolvers/         # Custom resolver nodes
│   └── utils/            # Graph utility functions
├── build/                 # Generated output (git ignored)
│   ├── css/              # CSS variables and theme files
│   ├── scss/             # SCSS variables
│   ├── js/               # JavaScript tokens
│   ├── ts/               # TypeScript tokens with types
│   ├── json/             # DTCG-compliant JSON
│   ├── docs/             # Generated documentation
│   ├── custom/           # Custom tokens output
│   └── brands/           # Brand-specific outputs
├── docs/                  # Project documentation
├── examples/             # Usage examples
├── __tests__/            # Jest test files
└── scripts/              # Utility scripts
```

## 🎨 Token Categories

### Primitives
- **Colors**: Full palette with shades 50-900
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Consistent spacing scale (0, xs, sm, md, lg, xl, 2xl, 3xl)
- **Shadows**: Elevation system (xs, sm, md, lg, xl)
- **Border Radius**: Radius scale (none, xs, sm, md, lg, xl, full)

### Semantic
- **Themes**: Light and dark theme configurations
- **States**: Primary, success, warning, error, info
- **Surfaces**: Background, surface, border variations

### Components
- Button, Card, Input, Modal, Badge, Alert

## 🔧 Configuration

### Prefix Configuration
Edit `tokens/_prefix.json` to change the token prefix:
```json
{
  "prefix": "mantine"
}
```

This will update all generated tokens to use the new prefix (e.g., `--mantine-color-primary`).

### Multibrand Configuration
The system supports multiple brands with unique visual identities. Each brand can have:
- Custom color palettes
- Light and dark themes
- Brand-specific semantic tokens

See the [Multibrand Theming Guide](./docs/MULTIBRAND_THEMING_GUIDE.md) for detailed setup instructions.

### Adding New Tokens
1. Create a new DTCG-format JSON file in the appropriate directory
2. Follow the DTCG structure:
```json
{
  "tokenGroup": {
    "$description": "Group description",
    "tokenName": {
      "$value": "value",
      "$type": "color|dimension|etc",
      "$description": "Token description"
    }
  }
}
```

## 🤖 MCP Integration

This project supports Model Context Protocol servers for enhanced Claude AI integration:
- Filesystem operations for token management
- Git integration for version control
- GitHub automation for PRs

See `docs/MCP_SETUP.md` for configuration details.

## 📊 Graph Engine

The Tokens Studio graph engine enables visual programming of design tokens:
- Generate color scales from base colors
- Create mathematical spacing systems
- Define complex token relationships

See `docs/GRAPH_ENGINE.md` for usage instructions.

## 📚 Documentation

- [`CLAUDE.md`](./CLAUDE.md) - Claude AI integration guide
- [`docs/MCP_SETUP.md`](./docs/MCP_SETUP.md) - MCP configuration
- [`docs/GRAPH_ENGINE.md`](./docs/GRAPH_ENGINE.md) - Graph engine guide
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) - Contribution guidelines
- `build/docs/tokens.md` - Generated token documentation

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the ISC License.

## 🔗 Resources

- [Style Dictionary Documentation](https://amzn.github.io/style-dictionary/)
- [DTCG Format Specification](https://design-tokens.github.io/community-group/format/)
- [Tokens Studio](https://tokens.studio/)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
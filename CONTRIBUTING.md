# Contributing to Mantine Design Tokens

Thank you for your interest in contributing to this design tokens repository! This guide will help you get started.

## 🚀 Getting Started

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/[your-username]/mantine-tokens.git
   cd mantine-tokens
   ```

2. **Use the correct Node version**
   ```bash
   nvm use  # Uses version specified in .nvmrc
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Build tokens**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
mantine-tokens/
├── tokens/              # Source token files
│   ├── primitives/      # Base design values
│   ├── semantic/        # Theme-specific tokens
│   ├── components/      # Component tokens
│   ├── custom/          # Custom brand tokens
│   └── brands/          # Brand-specific tokens
├── build/               # Generated output (git-ignored)
├── scripts/             # Build and validation scripts
├── build-standard.js    # Main Mantine build
├── build-custom.js      # Custom tokens build
├── build-brands.js      # Brand tokens build
└── build-all.js         # Build all tokens
```

## 🎨 Token Guidelines

### Token Naming

- Use kebab-case for token names
- Follow the pattern: `category-subcategory-variant-state`
- Examples: `color-primary-500`, `spacing-lg`, `button-padding-md`

### DTCG Format

All tokens must follow the Design Token Community Group format:

```json
{
  "token-name": {
    "$value": "token-value",
    "$type": "color|dimension|fontFamily|etc",
    "$description": "Optional description"
  }
}
```

### Token Types

- **Primitive tokens**: Base values (colors, typography, spacing)
- **Semantic tokens**: Theme-aware tokens that reference primitives
- **Component tokens**: Specific to UI components

## 🛠️ Development Workflow

### Adding New Tokens

1. Add tokens to appropriate JSON file in `tokens/`
2. Ensure tokens have `$value` and `$type` properties
3. Add descriptions for clarity
4. Reference other tokens using `{category.token}` syntax
5. Run validation: `npm run validate`
6. Build and verify: `npm run build`

### Modifying Existing Tokens

1. Update token values carefully - consider downstream impact
2. Add deprecation notices if removing tokens
3. Update documentation if changing structure
4. Test all output formats

### Creating Component Tokens

1. Create new file: `tokens/components/[component]-dtcg.json`
2. Follow existing component patterns
3. Reference primitive/semantic tokens
4. Document usage examples

## 🧪 Testing

Before submitting changes:

1. **Validate tokens**
   ```bash
   npm run validate
   ```

2. **Build all formats**
   ```bash
   npm run build
   ```

3. **Check output files**
   - Verify CSS variables are correct
   - Check TypeScript types compile
   - Ensure JSON is valid DTCG format

## 📝 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow token guidelines
   - Add/update tests if applicable
   - Update documentation

3. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new component tokens for alerts"
   ```

   Use conventional commits:
   - `feat:` New features
   - `fix:` Bug fixes
   - `docs:` Documentation changes
   - `refactor:` Code refactoring
   - `test:` Test additions/changes

4. **Push and create PR**
   - Fill out PR template
   - Link related issues
   - Provide examples/screenshots if visual

## 🐛 Reporting Issues

When reporting issues, please include:

1. **Description** of the problem
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Environment** (OS, Node version)
6. **Relevant code/config**

## 💡 Suggesting Enhancements

We welcome suggestions! Please:

1. **Check existing issues** first
2. **Provide use cases** for new tokens
3. **Include examples** of proposed tokens
4. **Explain the benefits**

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive criticism
- Help others learn and grow

## 📚 Resources

- [Style Dictionary Documentation](https://amzn.github.io/style-dictionary/)
- [Design Tokens Community Group](https://design-tokens.org/)
- [Token Naming Best Practices](https://design-tokens.org/naming/)

## ❓ Questions?

- Open a [Discussion](https://github.com/[org]/mantine-tokens/discussions)
- Check existing issues
- Read the documentation

Thank you for contributing! 🎉
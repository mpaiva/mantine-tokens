# Build Options

This project provides several build commands for different use cases:

## Build Commands

### Standard Build (Mantine Tokens)
```bash
npm run build
npm run build:verbose    # With detailed logging
```
- Builds core Mantine design tokens
- Uses prefix from `tokens/_prefix.json` (currently "mantine")
- Outputs to `build/` directory

### Custom Tokens Build
```bash
npm run build:custom
npm run build:custom:verbose    # With detailed logging
```
- Builds custom brand tokens from `tokens/custom/`
- Uses prefix from `tokens/_custom-prefix.json` (default "clearco")
- Outputs to `build/custom/` directory

### Brand Tokens Build
```bash
npm run build:brands
npm run build:brands:verbose    # With detailed logging
```
- Builds all brand-specific tokens from `tokens/brands/`
- Each brand gets its own output directory
- Outputs to `build/brands/{brand-name}/`

### Build All
```bash
npm run build:all
npm run build:all:verbose    # With detailed logging
```
- Builds Mantine tokens AND custom tokens
- Runs both build processes sequentially
- Creates complete token set

## Development Mode (Watch)

```bash
# Watch Mantine tokens
npm run dev
npm run watch    # Alias for dev

# Watch custom tokens
npm run dev:custom

# Watch all tokens
npm run dev:all

# Watch brand tokens
npm run dev:brands
```

Watch mode automatically rebuilds when token files change.

## Output Structure

All builds generate consistent output formats:

### Mantine Tokens Output
```
build/
├── css/
│   ├── variables.css      # CSS custom properties
│   ├── theme-light.css    # Light theme variables
│   └── theme-dark.css     # Dark theme variables
├── scss/
│   └── variables.scss     # SCSS variables
├── js/
│   └── tokens.js          # JavaScript exports
├── ts/
│   └── tokens.ts          # TypeScript with types
├── json/
│   └── mantine.tokens.json # DTCG format JSON
└── docs/
    └── tokens.md          # Documentation
```

### Custom Tokens Output
```
build/custom/
├── variables.css          # CSS custom properties
├── variables.scss         # SCSS variables
├── tokens.js              # JavaScript exports
├── tokens.ts              # TypeScript with types
├── custom.tokens.json     # DTCG format JSON (prefix-based name)
└── tokens.md              # Documentation
```

### Brand Tokens Output
```
build/brands/{brand-name}/
├── colors.css             # Brand colors
├── theme-light.css        # Light theme
├── theme-dark.css         # Dark theme
├── all.css                # All tokens combined
├── tokens.js              # JavaScript exports
└── tokens.ts              # TypeScript exports
```

## Additional Commands

### Validation
```bash
npm run validate           # Validate all token files
```

### Cleaning
```bash
npm run clean              # Remove build directory
```

### Testing
```bash
npm test                   # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
```


## Which Build Should I Use?

- **For Mantine tokens only**: Use `npm run build`
- **For custom brand tokens**: Use `npm run build:custom`
- **For complete token set**: Use `npm run build:all`
- **For multiple brands**: Use `npm run build:brands`
- **For development**: Use the corresponding `dev` command

## Troubleshooting

### Token Collision Warnings
- These warnings are expected when tokens are intentionally grouped
- Use verbose mode to see details: `npm run build:verbose`

### Build Fails
- Run `npm run validate` to check token file syntax
- Ensure all JSON files are valid
- Check that referenced tokens exist

### Missing Output Files
- Ensure the source token files exist
- Check file permissions
- Try running `npm run clean` then rebuild
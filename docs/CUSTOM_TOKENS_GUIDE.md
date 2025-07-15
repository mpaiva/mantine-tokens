# Custom Tokens Guide

This guide explains how to create and use custom design tokens alongside the base Mantine tokens.

## Overview

The token system supports multiple token sets with different prefixes:

- **Mantine tokens**: Core design system tokens with prefix "mantine" 
- **Custom tokens**: Your brand-specific tokens with a custom prefix (default "clearco")

Both sets can be used independently or together in your projects.

## Directory Structure

``` ascii
tokens/
├── _prefix.json              # Mantine prefix configuration
├── _custom-prefix.json       # Custom token prefix configuration
├── primitives/              # Mantine primitive tokens
├── semantic/                # Mantine semantic tokens
├── components/              # Mantine component tokens
└── custom/                  # Your custom tokens
    ├── brand-colors.json
    ├── custom-spacing.json
    └── custom-typography.json
```

## Creating Custom Tokens

### 1. Set Your Custom Prefix

Edit `tokens/_custom-prefix.json`:

```json
{
  "prefix": "yourcompany"
}
```

This will generate CSS variables like `--yourcompany-brand-primary`.

### 2. Create Token Files

Add JSON files to the `tokens/custom/` directory following DTCG format:

```json
{
  "$schema": "https://design-tokens.github.io/format/tokens.schema.json",
  "brand": {
    "$description": "Company brand colors",
    "primary": {
      "$value": "#0066CC",
      "$type": "color",
      "$description": "Primary brand color"
    }
  }
}
```

### 3. Token Types

Supported token types:
- `color` - Color values
- `dimension` - Sizes, spacing, etc.
- `fontFamily` - Font stacks
- `fontWeight` - Font weights
- `number` - Numeric values
- `shadow` - Box shadows

## Building Tokens

### Build Commands

```bash
# Build only custom tokens
npm run build:custom

# Build both Mantine and custom tokens
npm run build:all

# Watch mode for custom tokens
npm run dev:custom

# Watch both token sets
npm run dev:all
```

### Output Structure

Custom tokens are built to `build/custom/`:

```
build/
├── css/               # Mantine CSS variables
├── scss/              # Mantine SCSS variables
├── js/                # Mantine JavaScript
├── ts/                # Mantine TypeScript
├── json/              # Mantine JSON
├── docs/              # Mantine documentation
└── custom/            # All custom token outputs
    ├── variables.css   # Custom CSS variables
    ├── variables.scss  # Custom SCSS variables
    ├── tokens.js       # Custom JavaScript
    ├── tokens.ts       # Custom TypeScript
    ├── *.tokens.json   # Custom JSON
    └── tokens.md       # Custom documentation
```

## Using Custom Tokens

### In CSS

Import both token sets:

```css
/* Import Mantine tokens */
@import 'path/to/build/css/variables.css';

/* Import custom tokens */
@import 'path/to/build/custom/variables.css';

/* Use tokens */
.my-component {
  /* Mantine tokens */
  padding: var(--mantine-spacing-md);
  border-radius: var(--mantine-radius-sm);
  
  /* Custom tokens */
  background-color: var(--yourcompany-brand-primary);
  font-family: var(--yourcompany-typography-fontfamily-brand);
}
```

### In JavaScript/TypeScript

```typescript
// Import Mantine tokens
import { mantineTokens } from './build/ts/tokens';

// Import custom tokens
import { clearcoTokens } from './build/custom/tokens';

// Use tokens
const styles = {
  padding: mantineTokens['spacing.md'],
  backgroundColor: clearcoTokens['brand.primary']
};
```

### In SCSS

```scss
// Import both token sets
@import 'path/to/build/scss/variables';
@import 'path/to/build/custom/variables';

// Use as SCSS variables
.component {
  padding: $mantine-spacing-md;
  background: $custom-brand-primary;
}
```

## Best Practices

### 1. Naming Conventions

Use clear, hierarchical names:
```json
{
  "brand": {
    "color": {
      "primary": { "$value": "#0066CC" },
      "secondary": { "$value": "#FF6B35" }
    }
  }
}
```

### 2. Don't Duplicate

Avoid recreating tokens that exist in Mantine. Instead, reference them:
```json
{
  "custom": {
    "card": {
      "padding": {
        "$value": "{spacing.lg}",
        "$type": "dimension"
      }
    }
  }
}
```

### 3. Document Your Tokens

Always include descriptions:
```json
{
  "brand": {
    "primary": {
      "$value": "#0066CC",
      "$type": "color",
      "$description": "Used for primary CTAs and brand elements"
    }
  }
}
```

### 4. Organize by Category

Group related tokens:
- `brand-colors.json` - Brand-specific colors
- `clearco-spacing.json` - Additional spacing values
- `clearco-typography.json` - Brand fonts and sizes
- `clearco-components.json` - Component-specific tokens

## Example: Complete Brand System

### brand-colors.json
```json
{
  "brand": {
    "primary": {
      "$value": "#0066CC",
      "$type": "color"
    },
    "gradient": {
      "start": {
        "$value": "{brand.primary}",
        "$type": "color"
      },
      "end": {
        "$value": "#0052A3",
        "$type": "color"
      }
    }
  }
}
```

### custom-typography.json
```json
{
  "typography": {
    "fontFamily": {
      "marketing": {
        "$value": "'Bebas Neue', Impact, sans-serif",
        "$type": "fontFamily"
      }
    },
    "fontSize": {
      "hero": {
        "$value": "5rem",
        "$type": "dimension"
      }
    }
  }
}
```

### Usage
```css
.hero-banner {
  /* Mix Mantine and custom tokens */
  padding: var(--mantine-spacing-xl);
  background: linear-gradient(
    to right,
    var(--clearco-brand-gradient-start),
    var(--clearco-brand-gradient-end)
  );
  font-family: var(--clearco-typography-fontfamily-marketing);
  font-size: var(--clearco-typography-fontsize-hero);
}
```

## Troubleshooting

### Tokens not building?
- Check JSON syntax in your token files
- Ensure files are in `tokens/custom/` directory
- Run `npm run validate` to check for errors

### Prefix not applying?
- Verify `tokens/_custom-prefix.json` exists
- Check the prefix value is valid (alphanumeric, no spaces)
- Clear build directory: `npm run clean`

### Can't reference Mantine tokens?
- Token references only work within the same build
- For custom tokens, copy the value instead of referencing

## Next Steps

1. Review example tokens in `tokens/custom/`
2. Set your custom prefix
3. Create your brand tokens
4. Build with `npm run build:custom`
5. Import both token sets in your project

For more help, see the main [README](../README.md) or [Non-Technical Guide](./NON_TECHNICAL_GUIDE.md).
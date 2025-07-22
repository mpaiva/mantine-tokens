# Figma Token Import Guide

This guide explains how to import design tokens into Figma using the @figma-plugin/figma-variables-import plugin with the improvements we've made.

## Overview

The Figma Variables Import plugin has been enhanced to better handle our design token structure. However, due to limitations in Figma's Variables API, some token types and patterns require special handling.

## Improvements Made

### 1. Plugin Enhancements

The following improvements have been made to the Figma Variables Import plugin:

- **Better Type Support**: Added support for `fontFamily` (as STRING) and `fontWeight` (as FLOAT) token types
- **Compound Value Detection**: The plugin now properly detects and skips compound values (like padding with multiple values)
- **Clearer Error Messages**: More descriptive messages when tokens can't be imported

### 2. Figma-Compatible Token Build

A new build script creates tokens optimized for Figma import:

```bash
npm run build:figma:compatible
```

This generates `build/figma/figma-compatible.tokens.json` with:

- All token references resolved to their final values
- Compound values (like "1rem 2rem") converted to single values
- Font weight strings converted to numeric values
- Unsupported token types (shadows, typography) removed

## Import Process

### Step 1: Build Compatible Tokens

```bash
# First build all tokens
npm run build:all

# Then create Figma-compatible version
npm run build:figma:compatible
```

### Step 2: Import in Figma

1. Open Figma and go to Plugins → Development → Variables Import
2. Import the file: `build/figma/figma-compatible.tokens.json`
3. Select collections and modes to import

## Known Limitations

### Unsupported Token Types

The following token types are not supported by Figma Variables API:

- **Shadows**: Complex shadow definitions
- **Typography**: Composite typography styles
- **Gradients**: Gradient definitions
- **Borders**: Composite border styles
- **Transitions**: Animation definitions

### Compound Values

Figma Variables don't support compound values like padding/margin with multiple values:

- Original: `"{spacing.sm} {spacing.lg}"` 
- Converted: `"0.75rem"` (uses first value only)

### Workarounds

For unsupported features, consider:

1. **Use Figma Styles**: Create text styles and effect styles manually for typography and shadows
2. **Use Tokens Studio**: More comprehensive plugin that supports additional token types
3. **Custom Plugin**: Build a custom Figma plugin for your specific needs

## Token Compatibility Matrix

| Token Type | Figma Variable | Compatible Build | Notes |
|------------|----------------|------------------|-------|
| color | ✅ COLOR | ✅ | Full support |
| dimension | ✅ FLOAT | ✅ | Single values only |
| number | ✅ FLOAT | ✅ | Full support |
| string | ✅ STRING | ✅ | Full support |
| boolean | ✅ BOOLEAN | ✅ | Full support |
| fontFamily | ✅ STRING | ✅ | Imported as string |
| fontWeight | ✅ FLOAT | ✅ | Converted to number |
| shadow | ❌ | ❌ | Use Figma Styles |
| typography | ❌ | ❌ | Use Text Styles |
| gradient | ❌ | ❌ | Not supported |
| border | ❌ | ❌ | Create manually |

## Troubleshooting

### "Invalid reference" errors

- Check that all token references exist in the source files
- Use the compatible build which resolves all references

### "Unsupported token type" warnings

- These are expected for shadow, typography, etc.
- Use Figma Styles for these token types

### Compound value issues

- The compatible build automatically converts compound values
- Only the first value is used (e.g., vertical padding/margin)

## Next Steps

1. Import the compatible tokens into Figma
2. Create Figma Styles for unsupported token types
3. Set up a workflow to keep tokens synchronized
4. Consider using Tokens Studio for more advanced features
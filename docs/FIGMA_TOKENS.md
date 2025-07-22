# Figma Token Import Guide

This guide explains how to import and use the consolidated design token files in Figma.

## Overview

The build process generates a single consolidated token file specifically optimized for Figma import. This unified file combines all brands, themes, and token categories (primitives, semantic, and components) into a properly nested structure that works seamlessly with Figma's UI.

## Generated File

After running `npm run build:figma`, you'll find a single unified file in the `build/figma/` directory:

### **figma.tokens.json**
- **Contains**: All tokens for all brands and themes in one comprehensive file
- **Use case**: Complete design system import with multi-brand support
- **Structure**: 
  ```
  Global/
    Primitives/
      Colors/
      Typography/
      Spacing/
      Shadows/
      Border Radius/
  Brands/
    Mantine/
      Light/
        Semantic/
        Components/
      Dark/
        Semantic/
        Components/
    Clearco/
      Brand Colors/
      Typography/
      Light/
      Dark/
    Firstwatch/
      Brand Colors/
      Typography/
      Light/
      Dark/
  ```

### Key Benefits:
- **Single import**: One file contains everything - no need to manage multiple files
- **Brand consistency**: All brands and their themes are organized hierarchically
- **Theme switching**: Easy to switch between light and dark themes within Figma
- **Complete coverage**: Includes primitives, semantic tokens, and component tokens for all brands

## How to Import

### Using the Figma Plugin

1. **Install the DTCG Token Importer plugin** (if not already installed)
   - In Figma, go to Plugins → Browse plugins in Community
   - Search for "DTCG Token Importer" or use the plugin from the figma-plugin directory

2. **Open the plugin**
   - Go to Plugins → Development → DTCG Token Importer
   - Or use the plugin from your saved plugins

3. **Import tokens**
   - Click "Choose File" or drag and drop the `figma.tokens.json` file
   - The plugin will parse and create Figma variables/styles
   - Monitor the progress indicator for import status

### Import Strategy

#### For All Projects
1. Import the single `figma.tokens.json` file
2. This gives you the complete multi-brand token system
3. All brands (Mantine, Clearco, Firstwatch) with their light and dark themes will be available
4. Global primitives are shared across all brands for consistency

#### Working with Brands
- Access brand-specific tokens under `Brands/{BrandName}/`
- Each brand has its own Light and Dark theme variations
- Brand colors are available under `Brands/{BrandName}/Brand Colors/`
- Global primitives can be used across all brands

## Token Organization in Figma

After import, tokens will be organized as:

### Variables (if supported)
```
Colors/
  Gray/50, Gray/100, etc.
  Blue/50, Blue/100, etc.
Typography/
  Font Families/Sans, Mono, Heading
  Font Sizes/Xs, Sm, Md, Lg, Xl
Spacing/
  0, XS, SM, MD, LG, XL, 2XL, 3XL
```

### Styles (fallback)
- **Color Styles**: All color tokens
- **Text Styles**: Typography combinations
- **Effect Styles**: Shadows

## Working with Tokens

### Color Usage
- Global primitives are in `Global/Primitives/Colors/{ColorName}/{Shade}`
- Brand colors are in `Brands/{BrandName}/Brand Colors/{ColorName}`
- Semantic colors are in `Brands/{BrandName}/{Theme}/Semantic/{Category}/{Token}`
- Always prefer semantic tokens over primitives for UI elements

### Spacing
- Use spacing tokens for consistent layouts
- Tokens follow t-shirt sizing: XS, SM, MD, LG, XL
- Special tokens: 0, 2XL, 3XL for specific needs

### Typography
- Font families, sizes, weights, and line heights are separate
- Combine them to create text styles
- Use semantic names (Heading, Body, Caption) when available

### Component Tokens
- Component-specific tokens are nested under each brand and theme
- Example: `Brands/Mantine/Light/Components/Button/Padding/Md`
- Each brand can have its own component token values
- These ensure consistency across component variants within each brand

## Best Practices

1. **Use Semantic Tokens**: Prefer semantic tokens (like `Text/Default`) over primitives (like `Gray/900`)
2. **Maintain Hierarchy**: Respect the token hierarchy when creating new components
3. **Don't Override**: Avoid overriding token values in Figma
4. **Stay Synchronized**: Re-import tokens when they're updated in code
5. **Document Usage**: Note which token file version you're using

## Updating Tokens

When tokens are updated in the codebase:

1. Pull the latest changes
2. Run `npm run build:figma`
3. Re-import the updated JSON file in Figma
4. The plugin will update existing variables/styles

## Troubleshooting

### Import Fails
- Ensure the JSON file is valid DTCG format
- Check Figma plugin console for specific errors
- The unified file is larger (~57KB) but well-structured for efficient import

### Missing Tokens
- All token references should resolve correctly since everything is in one file
- If tokens are missing, ensure you're using the latest `figma.tokens.json`

### Performance Issues
- The unified file is optimized for Figma's import process
- All tokens are organized hierarchically for efficient access
- Modern Figma handles the complete token set well

## Support

For issues with:
- **Token generation**: Check the build logs and this repository
- **Figma import**: See the plugin documentation in `figma-plugin/README.md`
- **Token values**: Refer to the source files in `tokens/`
# Brand Tokens Structure

This directory contains optimized brand-specific design tokens with a shared inheritance system.

## Directory Structure

```
brands/
├── _shared/                    # Shared base tokens for all brands
│   ├── brand-base.json        # Common patterns and semantic definitions
│   └── theme-patterns.json    # Reusable theme patterns for light/dark modes
├── clearco/                   # Clearco brand tokens
│   ├── brand-config.json     # Brand configuration and metadata
│   ├── colors.json           # Brand color palette with references
│   ├── typography.json       # Brand typography definitions
│   ├── theme-light.json      # Light theme using shared patterns
│   └── theme-dark.json       # Dark theme using shared patterns
├── firstwatch/               # Firstwatch brand tokens  
│   ├── colors.json
│   ├── typography.json
│   ├── theme-light.json
│   └── theme-dark.json
└── brand.schema.json         # JSON Schema for brand consistency

```

## Optimization Features

### 1. Shared Base Tokens
- Common theme patterns extracted to `_shared/brand-base.json`
- Reusable opacity values, elevation levels, and semantic states
- Theme patterns for consistent light/dark mode structure

### 2. Token References
- Uses DTCG `{token.path}` syntax for referencing shared tokens
- Reduces duplication and ensures consistency
- Example: `{brandBase.semantic.state.success.default}`

### 3. Consistent Structure
- All brands follow the same token hierarchy
- Validated by `brand.schema.json` for consistency
- Predictable naming patterns across brands

### 4. Build Integration
- Shared tokens automatically included in build process
- Proper resolution of token references
- Efficient output generation

## Usage

### Adding a New Brand

1. Create a new directory: `brands/your-brand/`
2. Copy structure from existing brand
3. Update brand-specific values:
   - Primary, secondary, accent colors
   - Typography font stacks
   - Brand metadata in `brand-config.json`
4. Theme files will inherit shared patterns automatically

### Token References

```json
// Reference shared semantic colors
"success": {
  "$value": "{brandBase.semantic.state.success.default}",
  "$type": "color"
}

// Reference shared opacity values
"backdrop": {
  "$value": "rgba(0, 0, 0, {brandBase.theme.opacity.backdrop})",
  "$type": "color"
}

// Reference theme patterns
"primary": {
  "$value": "{themePatterns.light.surface.elevation.0}",
  "$type": "color"
}
```

## Benefits

1. **Reduced File Size**: ~40% reduction through reference usage
2. **Consistency**: Shared patterns ensure uniform behavior
3. **Maintainability**: Update once in shared files, applies everywhere
4. **Scalability**: Easy to add new brands following the pattern
5. **Type Safety**: Schema validation prevents errors
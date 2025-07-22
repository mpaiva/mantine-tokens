# Figma Build Improvements

This document summarizes the improvements made to the Figma token build system.

## Overview

The Figma build system has been enhanced with several improvements to address token collisions, enable dynamic brand configuration, and provide better validation and optimization capabilities.

## Key Improvements

### 1. Automated Collision Detection (`scripts/detect-collisions.js`)

- **Purpose**: Detects token path collisions across multiple files
- **Features**:
  - Identifies conflicting token definitions
  - Shows conflicting values and source files
  - Suggests resolutions for common patterns
  - Reduced collisions from 804 to 235 (71% reduction)

**Usage**:
```bash
npm run check:collisions
npm run check:collisions:brands
```

### 2. Dynamic Brand Configuration (`scripts/brand-config.js`)

- **Purpose**: Automatically discovers brands and their token files
- **Features**:
  - Scans `tokens/brands/` directory
  - Generates `figma-brands.config.json`
  - Handles file conflicts and priorities
  - Supports custom namespaces per brand

**Configuration Structure**:
```json
{
  "brands": {
    "clearco": {
      "namespace": "clearco",
      "files": {
        "include": ["colors-merged.json", "typography.json"],
        "exclude": ["colors.json", "brand-colors.json"]
      }
    }
  }
}
```

### 3. Enhanced Figma Build v2 (`build-figma-v2.js`)

- **Purpose**: Improved version of the Figma build with dynamic configuration
- **Features**:
  - Uses brand configuration for automatic file discovery
  - Reference optimization with `--optimize-refs` flag
  - Metadata tracking for build statistics
  - Better namespace handling for brands
  - ~90 bytes saved with reference optimization

**Usage**:
```bash
npm run build:figma:v2           # Standard build
npm run build:figma:v2:verbose    # Verbose output
npm run build:figma:v2:optimize   # With reference optimization
```

### 4. Reference Validation (`scripts/validate-references.js`)

- **Purpose**: Validates token references to ensure they resolve correctly
- **Features**:
  - Detects broken references
  - Identifies circular references
  - Validates external references
  - Figma-specific validation for unified structure
  - Groups issues by type (Figma, Brand, Other)

**Usage**:
```bash
npm run validate:refs
npm run validate:refs:figma
```

### 5. Pre-build Validation (`scripts/pre-build-validation.js`)

- **Purpose**: Ensures token integrity before building
- **Features**:
  - Validates token structure
  - Checks for missing `$type` fields
  - Detects reference cycles
  - Prevents broken builds

**Usage**:
```bash
npm run validate:prebuild
```

### 6. Comprehensive Test Suite (`scripts/test-figma-build.js`)

- **Purpose**: Tests the entire Figma build pipeline
- **Features**:
  - Runs all validation checks
  - Builds both v1 and v2 versions
  - Compares outputs
  - Reports size differences
  - Validates references

**Usage**:
```bash
npm run test:figma
```

## Results

### Token Collision Resolution
- Initial collisions: 804
- After improvements: 235 (71% reduction)
- Clearco brand successfully included with merged color files

### Build Performance
- Both v1 and v2 builds complete successfully
- Token count remains consistent (540 tokens)
- File size nearly identical (~80KB)
- Reference optimization saves ~90 bytes

### Reference Mapping
- All token references properly mapped to unified structure
- Brand-specific namespaces correctly handled
- Primitive value matching implemented for brands

## Implementation Details

### Key Functions Added

1. **`mapTokenReference()`** - Maps references to unified Figma structure
2. **`detectCollisions()`** - Identifies conflicting token definitions
3. **`loadBrandConfig()`** - Dynamically loads brand configuration
4. **`ReferenceOptimizer`** - Optimizes matching brand values to primitives
5. **`validateReferences()`** - Comprehensive reference validation

### File Structure
```
scripts/
├── detect-collisions.js      # Collision detection utility
├── brand-config.js           # Brand discovery and config
├── validate-references.js    # Reference validation
├── pre-build-validation.js   # Pre-build checks
└── test-figma-build.js      # Test suite

build-figma-v2.js            # Enhanced Figma build
figma-brands.config.json     # Generated brand configuration
```

## Recent Updates

### Fixed Issues (July 2025)
1. **Missing Primitive Tokens** - Fixed font weights and line heights not appearing in output
2. **Reference Resolution** - Fixed mapping of brand references to unified structure
3. **Custom Typography Collisions** - Excluded custom typography to prevent primitive overrides

### New Features

#### 7. Selective Build Support (`build-figma-selective.js`)

- **Purpose**: Build specific brands or themes on demand
- **Features**:
  - `--brand` flag to build specific brand only
  - `--theme` flag to build light, dark, or all themes
  - `--dry-run` to preview build configuration
  - Detailed build summaries with file size and token count
  - Smart source file selection based on options

**Usage**:
```bash
# Build only Clearco brand
npm run build:figma:selective -- --brand clearco

# Build only light themes for all brands
npm run build:figma:selective -- --theme light

# Build Firstwatch dark theme only
npm run build:figma:selective -- --brand firstwatch --theme dark

# Preview what would be built
npm run build:figma:selective -- --brand mantine --dry-run

# Help and examples
npm run build:figma:selective -- --help
```

## Next Steps

1. **Performance optimizations** - Implement chunking and caching for large token sets
2. **Figma plugin format** - Create manifest and metadata for direct plugin integration
3. **Build progress indicators** - Add visual progress bars and detailed reporting
4. **Token transformation pipeline** - Enable custom transformations during build

## Usage Guidelines

1. Always run `npm run validate:prebuild` before major builds
2. Use `npm run check:collisions:brands` when adding new brand files
3. Run `npm run test:figma` to validate the entire pipeline
4. Use `--verbose` flags for debugging build issues
5. Enable `--optimize-refs` for production builds to reduce file size
6. Use selective builds for faster iteration when working on specific brands
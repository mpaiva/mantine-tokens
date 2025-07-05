# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a design token system for the Mantine UI framework. It uses Style Dictionary to transform design tokens from JSON files into CSS variables and other formats.

## Commands

### Build
```bash
npm run build
```
Processes all token files and generates CSS variables with "mantine-" prefix. Output goes to `build/` directory.

### Development
```bash
npm install  # Install dependencies
npm run build -- --verbose  # Build with detailed logging
```

## Architecture

### Token Structure
- **Source tokens**: `tokens/` directory
- **Base tokens**: Files prefixed with `_` (e.g., `_colors.json`, `_typography.json`)
- **Theme files**: `theme-light.json` and `theme-dark.json` reference base tokens
- **Token references**: Use `{token.path.value}` syntax

### Build System
- **Entry point**: `build.js` - Custom Style Dictionary configuration
- **Key transform**: Adds "mantine-" prefix to all CSS variable names
- **Output formats**: 
  - CSS variables: `build/css/`
  - DTCG JSON: `build/dtcg/`

### Token Categories
- Colors (semantic and palette)
- Typography (font families, sizes, weights, line heights)
- Spacing (consistent spacing scale)
- Shadows (elevation system)
- Radii (border radius values)
- Breakpoints (responsive design)

## Important Notes

- No test framework is configured
- When modifying tokens, ensure references between files remain valid
- The project appears to be transitioning build configurations (check git status)
- All CSS variables will automatically receive the "mantine-" prefix
# DTCG Token Importer - Figma Plugin

A Figma plugin that imports Design Token Community Group (DTCG) format tokens into Figma as variables and styles.

## Overview

This plugin allows designers to import design tokens from JSON files following the DTCG format and automatically create corresponding Figma variables or styles.

## Features

### Phase 1 (Current)
- Import color tokens as Figma paint styles
- Support for DTCG format with `$type` and `$value`
- Basic error handling and validation

### Phase 2 (Planned)
- Import tokens as Figma variables (when available)
- Support for dimensions, typography, and other token types
- Token reference resolution
- Batch import from multiple files

## Development

### Setup
```bash
# No build step required - using vanilla JavaScript
```

### Testing
1. In Figma, go to Plugins → Development → Import plugin from manifest
2. Select the `manifest.json` file
3. Run the plugin from Plugins → Development → DTCG Token Importer

### File Structure
- `manifest.json` - Plugin configuration
- `ui.html` - Plugin UI
- `code.js` - Main plugin logic
- `README.md` - This file

## Token Format

The plugin expects tokens in DTCG format:

```json
{
  "colors": {
    "primary": {
      "$type": "color",
      "$value": "#1890ff"
    }
  }
}
```

## Known Issues

- Variables API requires specific Figma plan/version
- Only works in Figma Design mode (not Dev Mode or FigJam)
- Token references not yet supported

## License

MIT
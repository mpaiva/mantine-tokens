# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Figma plugin that imports Design Token Community Group (DTCG) format tokens into Figma as variables and styles. The plugin aims to bridge the gap between design tokens in code and design assets in Figma, ensuring 100% visual fidelity between Figma components and engineering component libraries.

## Current Status

The plugin is in the planning/documentation phase. Core implementation files (`manifest.json`, `ui.html`, `code.js`) have not been created yet. The project has comprehensive documentation including PRD, technical context, and README.

## Commands

Since the project hasn't been initialized yet, there are no build or test commands. When implementing:

```bash
# Initialize the project (when ready)
npm init -y

# For development in Figma:
# 1. In Figma, go to Plugins → Development → Import plugin from manifest
# 2. Select the manifest.json file
# 3. Run from Plugins → Development → DTCG Token Importer
```

## Architecture

### Plugin Structure (Planned)
- **manifest.json**: Figma plugin configuration (API version, permissions, UI dimensions)
- **ui.html**: Plugin UI with drag-and-drop for JSON files and progress indicators
- **code.js**: Main plugin logic handling:
  - DTCG token parsing and validation
  - Figma API interactions (Variables API with Styles API fallback)
  - Token reference resolution
  - Error handling and user feedback

### Token Import Strategy
1. **Phase 1 (MVP)**: Import color tokens as Figma paint styles
2. **Phase 2**: Use Variables API when available, support all DTCG token types
3. **Phase 3**: Direct GitHub import and bi-directional sync

### DTCG Token Format
The plugin expects tokens following the DTCG specification:
```json
{
  "token-name": {
    "$type": "color|dimension|typography|etc",
    "$value": "token-value",
    "$description": "optional description"
  }
}
```

Token references use `{token.path}` syntax and must be resolved before import.

### Figma API Considerations
- **Variables API**: Preferred for colors, numbers, strings, booleans (requires specific Figma plan)
- **Styles API**: Fallback for paint styles, text styles, effect styles
- **Mode Support**: Must work in Figma Design mode (not Dev Mode or FigJam)
- **Error Handling**: Graceful degradation when APIs unavailable

### Integration with Parent Project
The parent `mantine-tokens` repository provides:
- Source tokens in `tokens/` directory
- Built tokens in `build/` directory  
- Multiple brand configurations with dynamic prefixes
- Comprehensive token categories (primitives, semantic, components)

## Development Requirements

### Phase 1 Implementation Checklist
1. Create `manifest.json` with proper plugin configuration
2. Implement `ui.html` with file input and progress display
3. Write `code.js` with:
   - DTCG JSON parsing
   - Color token import as paint styles
   - Basic error handling
   - Progress reporting to UI

### Key Technical Decisions
- Use vanilla JavaScript (no build step) as indicated in README
- Single-file plugin architecture for simplicity
- Prioritize clear error messages for better UX
- Handle both Variables and Styles APIs for maximum compatibility
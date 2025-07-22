# Figma Plugin Context

## Background

This project aims to create a Figma plugin that imports design tokens in DTCG (Design Token Community Group) format and creates corresponding Figma variables and styles. The ultimate goal is to ensure 100% visual fidelity between Figma components and the engineering component library.

## Problem Statement

Currently, there's a disconnect between design tokens used in code and design assets in Figma. Designers and developers often work with different sources of truth, leading to inconsistencies. This plugin bridges that gap by allowing direct import of DTCG-formatted tokens into Figma.

## Technical Context

### DTCG Format
The Design Token Community Group format uses a specific JSON structure:
- Tokens have `$type` and `$value` properties
- Supports references using `{token.path}` syntax
- Includes metadata like `$description`

### Figma APIs
- **Variables API**: For creating reusable values (colors, numbers, strings, booleans)
- **Styles API**: For creating paint styles, text styles, effect styles
- Both APIs have different availability based on Figma plan and mode

### Current Repository Structure
The parent repository (`mantine-tokens`) contains:
- Token definitions in DTCG format
- Build system using Style Dictionary
- Multiple brand configurations
- Comprehensive token categories (primitives, semantic, components)

## Success Criteria

1. Successfully import color tokens as Figma variables or styles
2. Maintain token naming hierarchy 
3. Support token references
4. Provide clear error messages
5. Work reliably across different Figma environments

## Constraints

- Must work within Figma plugin sandbox
- Limited to Figma API capabilities
- Must handle both Variables API (when available) and fallback to Styles API
- Performance considerations for large token sets
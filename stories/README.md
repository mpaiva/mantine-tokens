# Storybook Structure

This Storybook is organized to match the Figma variables structure for better consistency between design and development.

## Directory Structure

```
stories/
├── Welcome.stories.js              # Landing page
├── global/                         # Global tokens
│   ├── primitives/                 # Primitive tokens
│   │   ├── Colors.stories.js       # Color palette
│   │   ├── Typography.stories.js   # Font families, sizes, weights
│   │   ├── Spacing.stories.js      # Spacing scale
│   │   ├── BorderRadius.stories.js # Border radius tokens
│   │   └── Shadows.stories.js      # Shadow tokens
│   ├── semantic/                   # Semantic tokens
│   │   ├── Overview.stories.js     # What are semantic tokens?
│   │   ├── LightTheme.stories.js   # Light theme mappings
│   │   └── DarkTheme.stories.js    # Dark theme mappings
│   └── custom/                     # Custom tokens
│       ├── Overview.stories.js     # What are custom tokens?
│       ├── Spacing.stories.js      # Extended spacing scale
│       ├── Typography.stories.js   # Display sizes and font weights
│       └── Components.stories.js   # Component-specific tokens
├── brands/                         # Brand-specific tokens and themes
│   ├── mantine/
│   │   ├── Overview.stories.js     # Mantine brand overview
│   │   └── LightTheme.stories.js   # Light theme tokens
│   ├── clearco/
│   │   └── Overview.stories.js     # Clearco brand overview
│   └── firstwatch/
│       └── Overview.stories.js     # Firstwatch brand overview
├── components/                     # Component examples (kept at root)
│   ├── Button.stories.js
│   ├── Card.stories.js
│   └── Input.stories.js
└── documentation/                  # Documentation and tools
    ├── TokenValidation.stories.js  # Automated token tests
    ├── TokenJSON.stories.js        # JSON export viewer
    ├── SemanticAPI.stories.js      # Semantic API reference
    ├── BrandComparison.stories.js  # Brand comparison
    ├── ComponentShowcase.stories.js # Component examples
    └── Debug.stories.js            # Debug tools
```

## Navigation Structure

The Storybook navigation now mirrors the Figma variables panel:

- **Global**
  - Primitives
    - Colors
    - Typography
    - Spacing
    - Border Radius
    - Shadows
  - Semantic
    - Overview
    - Light Theme
    - Dark Theme
  - Custom
    - Overview
    - Spacing
    - Typography
    - Components
- **Brands**
  - Mantine
    - Overview
    - Light Theme
    - Dark Theme (TODO)
  - Clearco
    - Overview
    - Light Theme (TODO)
    - Dark Theme (TODO)
  - Firstwatch
    - Overview
    - Light Theme (TODO)
    - Dark Theme (TODO)
- **Components** (Implementation examples)
- **Documentation** (References and tools)

## Key Features

1. **Matches Figma Structure**: Navigation hierarchy mirrors the Figma variables panel
2. **Brand-First Organization**: Each brand has its own section with themes
3. **Theme Separation**: Light and dark themes are clearly separated per brand
4. **Clear Documentation**: Separated documentation from design tokens
5. **Click to Copy**: Click on any token throughout the documentation to copy its CSS variable

## Usage

- Use the toolbar to switch between brands (paintbrush icon)
- Use the toolbar to switch between light/dark themes (circle icon)
- Click on any token to copy its CSS variable name
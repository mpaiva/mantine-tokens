# Semantic API Tokens

This directory contains the **public API** for the design system. These tokens are the **only** tokens that should be referenced by consumers (designers and developers).

## Why Semantic API?

Traditional design token systems expose their entire hierarchy (primitives → semantic → component), which creates several problems:

1. **Fragility**: When consumers use primitive tokens directly (e.g., `blue-500`), any system changes require manual updates everywhere
2. **Context Blindness**: Simple token references can't adapt to different contexts (dark mode, brands, platforms)
3. **Breaking Changes**: Adding new contexts (mobile spacing, RTL, etc.) breaks existing implementations

## The Solution: Context-Aware Semantic API

Our semantic API tokens (prefixed with `@`) act as a stable contract between the design system and its consumers. They:

- **Hide Complexity**: Implementation details stay private
- **Enable Context**: Automatically resolve to appropriate values based on current context
- **Prevent Breaking Changes**: New contexts can be added without affecting consumers

## Token Categories

### 🎨 Surface (`surface.json`)
Defines backgrounds, cards, and container colors
- `@surface.primary.idle.background` - Main content area background
- `@surface.overlay.backdrop.color` - Modal backdrop color

### ✏️ Content (`content.json`)
Text, icons, and media colors
- `@content.primary.default` - Primary text color
- `@content.link.hover` - Link hover state

### 💬 Feedback (`feedback.json`)
System states and messages
- `@feedback.error.background.default` - Error message background
- `@feedback.success.icon.default` - Success icon color

### 🎯 Interactive (`interactive.json`)
Buttons, inputs, and controls
- `@interactive.primary.idle.background` - Primary button background
- `@interactive.input.focus.border` - Input focus border

### 📐 Structure (`structure.json`)
Layout, spacing, and borders
- `@structure.spacing.stack.md` - Vertical spacing between elements
- `@structure.border.radius.lg` - Large border radius

### 📊 Elevation (`elevation.json`)
Shadows and z-index hierarchy
- `@elevation.shadow.floating` - Dropdown shadow
- `@elevation.zIndex.modal` - Modal stacking order

## Usage Example

### ❌ Wrong Way (Direct Primitive Usage)
```css
.button {
  background: var(--mantine-color-blue-600);  /* Breaks on rebrand */
  padding: var(--mantine-spacing-sm);         /* Breaks on mobile */
}
```

### ✅ Right Way (Semantic API)
```css
.button {
  background: var(--interactive-primary-idle-background);
  padding: var(--structure-spacing-inset-sm);
}
```

## Context Resolution

The build system resolves semantic tokens based on active contexts:

```
@surface.primary.idle.background
  ├─ light mode + mantine brand → #ffffff
  ├─ dark mode + mantine brand → #1a1a1a
  ├─ light mode + clearco brand → #f8f9fa
  └─ dark mode + clearco brand → #0a0a0a
```

## For Component Authors

When creating components, **only** reference semantic API tokens:

```json
{
  "myComponent": {
    "background": {
      "$value": "@surface.secondary.idle.background"
    },
    "text": {
      "$value": "@content.primary.default"
    },
    "spacing": {
      "$value": "@structure.spacing.inset.md"
    }
  }
}
```

## Future Contexts

The semantic API is designed to support future contexts without breaking changes:

- **Platform**: `web`, `ios`, `android`
- **Density**: `compact`, `regular`, `comfortable`
- **Language**: `ltr`, `rtl`
- **Motion**: `full`, `reduced`, `none`
- **Contrast**: `normal`, `high`, `low`

Each new context can be added as a new mapping layer without changing the public API.
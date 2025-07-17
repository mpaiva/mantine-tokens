# Multibrand Theming Guide

This guide explains how to implement and use the multibrand theming system with light and dark theme support.

## Overview

The multibrand theming system allows you to:
- Define unique brand identities with custom color palettes
- Support light and dark themes for each brand
- Maintain consistent semantic token patterns across brands
- Switch brands and themes dynamically at runtime

## Directory Structure

```
tokens/
├── brands/
│   ├── clearco/
│   │   ├── colors.json        # Brand color palette
│   │   ├── theme-light.json   # Light theme mappings
│   │   └── theme-dark.json    # Dark theme mappings
│   └── firstwatch/
│       ├── colors.json
│       ├── theme-light.json
│       └── theme-dark.json
└── semantic/
    └── theme-patterns.json     # Shared semantic patterns
```

## Creating a New Brand

### 1. Create Brand Directory
```bash
mkdir -p tokens/brands/your-brand
```

### 2. Define Brand Colors (`colors.json`)
```json
{
  "$schema": "https://design-tokens.github.io/format/tokens.schema.json",
  "brand": {
    "primary": {
      "50": { "$value": "#e6f0ff", "$type": "color" },
      "100": { "$value": "#b3d1ff", "$type": "color" },
      // ... define all shades
      "500": { "$value": "#0066cc", "$type": "color" },
      // ... up to 900
    },
    "secondary": { /* ... */ },
    "accent": { /* ... */ },
    "neutral": { /* ... */ },
    "semantic": {
      "success": { "$value": "#28a745", "$type": "color" },
      "warning": { "$value": "#ffc107", "$type": "color" },
      "error": { "$value": "#dc3545", "$type": "color" }
    }
  }
}
```

### 3. Create Theme Files

#### Light Theme (`theme-light.json`)
```json
{
  "theme": {
    "surface": {
      "primary": { "$value": "#ffffff", "$type": "color" },
      "secondary": { "$value": "{brand.neutral.50}", "$type": "color" }
    },
    "content": {
      "primary": { "$value": "{brand.neutral.900}", "$type": "color" },
      "secondary": { "$value": "{brand.neutral.700}", "$type": "color" }
    },
    "interactive": {
      "primary": {
        "default": { "$value": "{brand.primary.500}", "$type": "color" },
        "hover": { "$value": "{brand.primary.600}", "$type": "color" }
      }
    }
  }
}
```

#### Dark Theme (`theme-dark.json`)
```json
{
  "theme": {
    "surface": {
      "primary": { "$value": "#0a0a0a", "$type": "color" },
      "secondary": { "$value": "#1a1a1a", "$type": "color" }
    },
    "content": {
      "primary": { "$value": "#f5f5f5", "$type": "color" },
      "secondary": { "$value": "#d4d4d4", "$type": "color" }
    },
    "interactive": {
      "primary": {
        "default": { "$value": "{brand.primary.400}", "$type": "color" },
        "hover": { "$value": "{brand.primary.300}", "$type": "color" }
      }
    }
  }
}
```

## Building Brand Tokens

### Build All Brands
```bash
npm run build:brands
```

### Build Specific Brand
```bash
npm run build:brands clearco
```

### Build with Verbose Output
```bash
npm run build:brands:verbose
```

### Watch Mode
```bash
npm run dev:brands
```

## Generated Output

Each brand generates:
```
build/brands/{brand-name}/
├── colors.css         # Brand colors only
├── theme-light.css    # Light theme variables
├── theme-dark.css     # Dark theme variables
├── all.css           # All tokens combined
├── tokens.js         # JavaScript export
├── tokens.ts         # TypeScript definitions
└── brand-info.json   # Brand metadata
```

## Using in Your Application

### 1. Basic HTML Setup
```html
<!-- Load brand colors -->
<link rel="stylesheet" href="/tokens/clearco/colors.css">

<!-- Load theme-specific styles -->
<link rel="stylesheet" href="/tokens/clearco/theme-light.css">
<link rel="stylesheet" href="/tokens/clearco/theme-dark.css">
```

### 2. Apply Theme Classes
```html
<!-- Light theme -->
<body class="theme-light">

<!-- Dark theme -->
<body class="theme-dark">
```

### 3. Use CSS Variables
```css
.button {
  background-color: var(--clearco-theme-interactive-primary-default);
  color: var(--clearco-theme-content-inverse);
}

.button:hover {
  background-color: var(--clearco-theme-interactive-primary-hover);
}

.card {
  background-color: var(--clearco-theme-surface-secondary);
  border: 1px solid var(--clearco-theme-border-default);
}
```

## Dynamic Brand Switching

### JavaScript Implementation
```javascript
class BrandThemeManager {
  constructor() {
    this.currentBrand = 'clearco';
    this.currentTheme = 'light';
  }

  async loadBrand(brandName) {
    // Remove existing brand stylesheets
    document.querySelectorAll('[data-brand-styles]').forEach(el => el.remove());
    
    // Load new brand stylesheets
    const stylesheets = [
      `${brandName}/colors.css`,
      `${brandName}/theme-light.css`,
      `${brandName}/theme-dark.css`
    ];
    
    for (const stylesheet of stylesheets) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `/tokens/${stylesheet}`;
      link.setAttribute('data-brand-styles', brandName);
      document.head.appendChild(link);
    }
    
    this.currentBrand = brandName;
  }

  setTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    this.currentTheme = theme;
  }
}

// Usage
const themeManager = new BrandThemeManager();
await themeManager.loadBrand('clearco');
themeManager.setTheme('dark');
```

## React Implementation

### Theme Context Provider
```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children, defaultBrand = 'clearco' }) {
  const [brand, setBrand] = useState(defaultBrand);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load brand stylesheets
    const loadBrandStyles = async () => {
      // Implementation similar to vanilla JS above
    };
    loadBrandStyles();
  }, [brand]);

  useEffect(() => {
    // Apply theme class
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ brand, setBrand, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

### Using Theme Tokens
```jsx
function Button({ variant = 'primary', children }) {
  return (
    <button
      style={{
        backgroundColor: `var(--${brand}-theme-interactive-${variant}-default)`,
        color: 'var(--${brand}-theme-content-inverse)',
        padding: 'var(--${brand}-spacing-sm) var(--${brand}-spacing-md)',
        border: 'none',
        borderRadius: '0.375rem',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
}
```

## Best Practices

### 1. Semantic Token Usage
Always use semantic tokens for UI elements instead of raw color values:
```css
/* Good */
.card {
  background-color: var(--brand-theme-surface-secondary);
  color: var(--brand-theme-content-primary);
}

/* Avoid */
.card {
  background-color: var(--brand-neutral-100);
  color: var(--brand-neutral-900);
}
```

### 2. Theme-Aware Components
Design components to automatically adapt to theme changes:
```css
.button-primary {
  background-color: var(--brand-theme-interactive-primary-default);
  transition: background-color 200ms ease;
}

.button-primary:hover {
  background-color: var(--brand-theme-interactive-primary-hover);
}
```

### 3. Consistent Naming
Follow the established token naming pattern:
- `{brand}-{category}-{property}-{variant}`
- Example: `clearco-theme-surface-primary`

### 4. Accessibility
Ensure sufficient contrast ratios in both themes:
- Test color combinations with WCAG guidelines
- Provide focus indicators using focus tokens
- Maintain minimum tap target sizes

## Troubleshooting

### Theme Not Switching
1. Verify theme class is applied to the correct element
2. Check that theme CSS files are loaded
3. Ensure no CSS specificity conflicts

### Brand Styles Not Loading
1. Check network tab for 404 errors
2. Verify build output exists for the brand
3. Ensure correct file paths in stylesheets

### Token References Not Resolving
1. Check that referenced tokens exist
2. Verify correct reference syntax: `{brand.primary.500}`
3. Ensure tokens are built with `outputReferences: true`

## Advanced Topics

### Custom Theme Variants
Create additional theme variants (e.g., high contrast):
```json
{
  "theme": {
    "$description": "High contrast theme",
    "surface": {
      "primary": { "$value": "#000000", "$type": "color" },
      "secondary": { "$value": "#0a0a0a", "$type": "color" }
    }
  }
}
```

### Theme Persistence
Save user preferences:
```javascript
// Save preference
localStorage.setItem('preferred-theme', 'dark');
localStorage.setItem('preferred-brand', 'clearco');

// Restore on load
const savedTheme = localStorage.getItem('preferred-theme') || 'light';
const savedBrand = localStorage.getItem('preferred-brand') || 'clearco';
```

### Performance Optimization
1. Preload critical brand styles
2. Use CSS containment for theme switches
3. Implement lazy loading for non-active brands
4. Consider CSS-in-JS for dynamic brands
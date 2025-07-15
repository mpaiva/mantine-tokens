# Testing Guide for Multibrand Theme System

This guide covers how to test the multibrand theming system effectively.

## Quick Start

### 1. Run the Interactive Demo
```bash
# Build all brand tokens
npm run build:brands

# Open the interactive demo
open examples/interactive-demo.html
```

### 2. Test Theme Switching
- Click between "Clearco" and "Brand B" buttons
- Toggle between light and dark themes
- Observe smooth transitions and proper color updates

### 3. Run Automated Tests
```bash
# Run all tests
npm test

# Run theme validation tests specifically
npm test __tests__/theme-validation.test.js

# Run with coverage
npm run test:coverage
```

## Manual Testing Checklist

### Brand Switching
- [ ] Brands load without errors
- [ ] Colors update immediately when switching brands
- [ ] No flash of unstyled content (FOUC)
- [ ] Previously loaded brands switch instantly
- [ ] Console shows no 404 errors for CSS files

### Theme Switching
- [ ] Light/dark toggle works smoothly
- [ ] Correct colors for each theme:
  - Light: White backgrounds, dark text
  - Dark: Dark backgrounds, light text
- [ ] Transitions are smooth (250ms default)
- [ ] Focus indicators remain visible in both themes
- [ ] No color "flashing" during transitions

### Accessibility
- [ ] Sufficient contrast ratios (WCAG AA minimum)
- [ ] Focus indicators visible in both themes
- [ ] Theme preference persists on reload
- [ ] Respects system theme preference

### Performance
- [ ] Initial load time < 100ms
- [ ] Brand switch time < 50ms (after initial load)
- [ ] Theme switch time < 10ms
- [ ] No janky animations or reflows

## Automated Test Coverage

### Unit Tests
The test suite validates:
- Brand file structure
- Required token presence
- Color format validity
- Theme file completeness
- CSS output correctness
- Variable naming consistency

### Running Tests
```bash
# All tests
npm test

# Specific test file
npm test __tests__/theme-validation.test.js

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure
```
__tests__/
├── theme-validation.test.js  # Theme system tests
├── build.test.js            # Build process tests
├── transforms.test.js       # Style Dictionary transforms
└── validation.test.js       # Token validation
```

## Browser Testing

### Supported Browsers
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+
- Chrome Android 90+

### Test Scenarios

#### 1. Basic Functionality
```javascript
// Test theme switching
themeSwitcher.setTheme('dark');
console.assert(document.body.classList.contains('theme-dark'));

// Test brand loading
await themeSwitcher.loadBrand('clearco');
console.assert(themeSwitcher.getCurrent().brand === 'clearco');
```

#### 2. Edge Cases
- Rapid theme toggling
- Loading non-existent brands
- Network failures during load
- Multiple concurrent brand loads

#### 3. Memory Leaks
```javascript
// Check for detached DOM nodes
const initialNodes = performance.memory.usedJSHeapSize;
// Switch themes 100 times
for (let i = 0; i < 100; i++) {
  themeSwitcher.toggleTheme();
}
const finalNodes = performance.memory.usedJSHeapSize;
console.assert(finalNodes < initialNodes * 1.1); // Max 10% increase
```

## Visual Testing

### Manual Visual Tests
1. **Color Accuracy**
   - Compare generated colors with design specs
   - Verify brand colors match brand guidelines
   - Check color interpolation in gradients

2. **Component States**
   - Hover states
   - Active/pressed states
   - Disabled states
   - Focus states

3. **Layout Consistency**
   - No layout shift during theme changes
   - Consistent spacing across themes
   - Proper text contrast

### Automated Visual Tests
Consider using tools like:
- Percy.io for visual regression
- Chromatic for Storybook integration
- Playwright for screenshot comparison

## Performance Testing

### Metrics to Monitor
- **First Contentful Paint (FCP)**: < 1s
- **Theme Switch Time**: < 50ms
- **Brand Load Time**: < 200ms (network dependent)
- **JavaScript Bundle Size**: < 10KB (minified)

### Performance Test Script
```javascript
// Measure theme switch performance
const measureThemeSwitch = () => {
  const start = performance.now();
  themeSwitcher.toggleTheme();
  const end = performance.now();
  console.log(`Theme switch took ${end - start}ms`);
};

// Measure brand load performance  
const measureBrandLoad = async (brand) => {
  const start = performance.now();
  await themeSwitcher.loadBrand(brand);
  const end = performance.now();
  console.log(`Brand ${brand} loaded in ${end - start}ms`);
};
```

## Debugging

### Common Issues

#### 1. Theme Not Switching
```javascript
// Check if theme class is applied
console.log(document.body.className);

// Verify CSS files are loaded
document.querySelectorAll('link[data-brand]').forEach(link => {
  console.log(link.href, link.disabled);
});
```

#### 2. Colors Not Updating
```javascript
// Check computed styles
const styles = getComputedStyle(document.documentElement);
console.log(styles.getPropertyValue('--clearco-theme-surface-primary'));
```

#### 3. Brand Not Loading
```javascript
// Enable verbose logging
const themeSwitcher = new ThemeSwitcher({
  onBrandChange: (brand) => console.log('Brand changed:', brand),
  onThemeChange: (theme) => console.log('Theme changed:', theme)
});
```

### Browser DevTools
1. **Network Tab**: Monitor CSS file loading
2. **Elements Tab**: Inspect applied styles
3. **Console**: Check for errors
4. **Performance Tab**: Profile theme switches

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Theme Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build:brands
      - run: npm test
      - run: npm run test:coverage
```

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test && npm run lint"
    }
  }
}
```

## Best Practices

1. **Test Early and Often**
   - Run tests before committing
   - Test in multiple browsers
   - Test with real user scenarios

2. **Maintain Test Coverage**
   - Aim for >80% code coverage
   - Test edge cases
   - Update tests when adding features

3. **Performance Budget**
   - Set performance thresholds
   - Monitor bundle sizes
   - Track runtime performance

4. **Accessibility First**
   - Test with screen readers
   - Verify keyboard navigation
   - Check color contrast ratios

## Troubleshooting

### Test Failures
1. Clear build directory: `npm run clean`
2. Rebuild brands: `npm run build:brands`
3. Check for syntax errors in token files
4. Verify all dependencies are installed

### Performance Issues
1. Check for duplicate CSS loads
2. Minimize token file sizes
3. Use CSS containment for theme switches
4. Implement lazy loading for non-critical brands
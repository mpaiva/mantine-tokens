import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

// Base theme configuration
const baseTheme = {
  brandTitle: 'Mantine Design Tokens',
  brandUrl: 'https://mantine.dev',
  
  // UI
  appBg: 'white',
  appContentBg: 'white',
  appPreviewBg: 'white',
  appBorderColor: '#E9ECEF',
  appBorderRadius: 4,
  
  // Text colors
  textColor: '#000000',
  textInverseColor: '#FFFFFF',
  textMutedColor: '#868E96',
  
  // Toolbar default and active colors
  barTextColor: '#495057',
  barSelectedColor: '#228BE6',
  barHoverColor: '#228BE6',
  barBg: '#FFFFFF',
  
  // Form colors
  inputBg: 'white',
  inputBorder: '#DEE2E6',
  inputTextColor: '#000000',
  inputBorderRadius: 4,
  
  // Additional UI elements
  buttonBg: '#F8F9FA',
  buttonBorder: '#DEE2E6',
  booleanBg: '#E9ECEF',
  booleanSelectedBg: '#228BE6'
};

// Create themes for each brand
const themes = {
  mantine: create({
    ...baseTheme,
    base: 'light',
    fontBase: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontCode: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  }),
  
  clearco: create({
    ...baseTheme,
    base: 'light',
    brandTitle: 'Clearco Design System',
    fontBase: '"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontCode: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    
    // Clearco brand colors
    barSelectedColor: '#0F172A',
    barHoverColor: '#0F172A',
    buttonBg: '#E0E7FF',
    booleanSelectedBg: '#0F172A'
  }),
  
  firstwatch: create({
    ...baseTheme,
    base: 'light',
    brandTitle: 'Firstwatch Design System',
    fontBase: '"Roboto Condensed", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontCode: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    
    // Firstwatch brand colors
    barSelectedColor: '#6B46C1',
    barHoverColor: '#6B46C1',
    buttonBg: '#F0E6FF',
    booleanSelectedBg: '#6B46C1'
  })
};

// Set initial theme
addons.setConfig({
  theme: themes.mantine,
});

// Listen for brand changes from the parent window
if (typeof window !== 'undefined') {
  // Create a custom event listener for brand changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'storybook-brand') {
      const brand = e.newValue || 'mantine';
      if (themes[brand]) {
        addons.setConfig({
          theme: themes[brand],
        });
      }
    }
  });
  
  // Check initial brand from localStorage
  const initialBrand = localStorage.getItem('storybook-brand') || 'mantine';
  if (themes[initialBrand]) {
    addons.setConfig({
      theme: themes[initialBrand],
    });
  }
}
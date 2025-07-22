import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import { createBrandTheme, applyDynamicFonts } from './manager-theme-loader.js';
// Temporarily disable hot reload to fix blank page issue
// import './manager-hot-reload.js';

// Base theme configuration - minimal defaults only
const baseTheme = {
  brandTitle: 'Mantine Design Tokens',
  brandUrl: 'https://mantine.dev',
  base: 'light',
  
  // Default fallback values - will be overridden by token values
  fontBase: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

// Dynamic theme cache
const dynamicThemeCache = new Map();

// Function to update theme with dynamic values
async function updateTheme(brand) {
  console.log(`Loading dynamic theme for ${brand}`);
  
  try {
    // Check cache first
    if (dynamicThemeCache.has(brand)) {
      const cachedTheme = dynamicThemeCache.get(brand);
      addons.setConfig({ theme: cachedTheme });
      applyBrandStyles(brand);
      return;
    }
    
    // Create dynamic theme
    const dynamicTheme = await createBrandTheme(brand, baseTheme);
    const theme = create(dynamicTheme);
    
    // Cache the theme
    dynamicThemeCache.set(brand, theme);
    
    // Apply the theme
    addons.setConfig({ theme });
    
    // Apply brand-specific styles
    applyBrandStyles(brand);
    
    // Apply dynamic fonts
    applyDynamicFonts(brand);
    
  } catch (error) {
    console.error(`Failed to load dynamic theme for ${brand}:`, error);
    
    // Use minimal fallback theme
    const fallbackTheme = create({
      ...baseTheme,
      brandTitle: `${brand.charAt(0).toUpperCase() + brand.slice(1)} Design System`,
    });
    
    addons.setConfig({ theme: fallbackTheme });
    applyBrandStyles(brand);
  }
}

// Function to apply brand-specific styles
function applyBrandStyles(brand) {
  // Update data attribute for CSS targeting
  document.documentElement.setAttribute('data-brand', brand);
  
  // Notify manager-head.html to update brand CSS
  window.postMessage({ type: 'brand-change', brand }, '*');
}

// Get initial brand
const getInitialBrand = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('storybook-brand') || 'mantine';
  }
  return 'mantine';
};

// Initialize with minimal theme while loading dynamic theme
const initialBrand = getInitialBrand();
addons.setConfig({
  theme: create({
    ...baseTheme,
    brandTitle: `${initialBrand.charAt(0).toUpperCase() + initialBrand.slice(1)} Design System`,
  }),
});

// Apply initial brand styles
if (typeof window !== 'undefined') {
  document.documentElement.setAttribute('data-brand', initialBrand);
  
  // Load dynamic theme asynchronously
  setTimeout(() => updateTheme(initialBrand), 100);
}

// Listen for brand changes from the parent window
if (typeof window !== 'undefined') {
  // Function to handle brand changes
  const handleBrandChange = async (brand) => {
    // Update theme with dynamic values
    await updateTheme(brand);
  };
  
  // Expose functions for hot reload
  window.__updateManagerTheme = updateTheme;
  window.__applyDynamicFonts = applyDynamicFonts;
  
  // Create a custom event listener for brand changes
  window.addEventListener('storage', async (e) => {
    if (e.key === 'storybook-brand') {
      const brand = e.newValue || 'mantine';
      await handleBrandChange(brand);
    }
  });
  
  // Initial theme is already loaded above
}
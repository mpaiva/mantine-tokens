/**
 * Dynamic theme loader for Storybook manager
 * Loads brand CSS files and extracts token values for theming
 */

// Cache for loaded brand tokens
const brandTokenCache = new Map();

/**
 * Load brand CSS file and extract token values
 */
async function loadBrandTokens(brand) {
  if (brandTokenCache.has(brand)) {
    return brandTokenCache.get(brand);
  }

  try {
    // Wait for document.body to be available
    if (!document.body) {
      await new Promise(resolve => {
        if (document.body) {
          resolve();
        } else {
          document.addEventListener('DOMContentLoaded', resolve);
        }
      });
    }
    
    // Create a temporary element to load and parse CSS
    const tempDiv = document.createElement('div');
    tempDiv.style.display = 'none';
    document.body.appendChild(tempDiv);

    // Load brand CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/brands/${brand}/all.css`;
    
    await new Promise((resolve, reject) => {
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });

    // Wait for styles to be applied
    await new Promise(resolve => setTimeout(resolve, 100));

    // Extract computed styles
    const computed = getComputedStyle(document.documentElement);
    
    const tokens = {
      // Typography
      fontFamilySans: computed.getPropertyValue(`--${brand}-typography-fontfamily-sans`).trim(),
      fontFamilyHeading: computed.getPropertyValue(`--${brand}-typography-fontfamily-heading`).trim(),
      fontFamilyBody: computed.getPropertyValue(`--${brand}-typography-fontfamily-body`).trim(),
      fontFamilyMono: computed.getPropertyValue(`--${brand}-typography-fontfamily-mono`).trim(),
      
      // Brand colors
      primary50: computed.getPropertyValue(`--${brand}-brand-primary-50`).trim(),
      primary100: computed.getPropertyValue(`--${brand}-brand-primary-100`).trim(),
      primary200: computed.getPropertyValue(`--${brand}-brand-primary-200`).trim(),
      primary300: computed.getPropertyValue(`--${brand}-brand-primary-300`).trim(),
      primary400: computed.getPropertyValue(`--${brand}-brand-primary-400`).trim(),
      primary500: computed.getPropertyValue(`--${brand}-brand-primary-500`).trim() || computed.getPropertyValue(`--${brand}-brand-primary`).trim(),
      primary600: computed.getPropertyValue(`--${brand}-brand-primary-600`).trim(),
      primary700: computed.getPropertyValue(`--${brand}-brand-primary-700`).trim(),
      primary800: computed.getPropertyValue(`--${brand}-brand-primary-800`).trim(),
      primary900: computed.getPropertyValue(`--${brand}-brand-primary-900`).trim(),
      
      // Neutral colors
      neutral50: computed.getPropertyValue(`--${brand}-brand-neutral-50`).trim(),
      neutral100: computed.getPropertyValue(`--${brand}-brand-neutral-100`).trim(),
      neutral200: computed.getPropertyValue(`--${brand}-brand-neutral-200`).trim(),
      neutral300: computed.getPropertyValue(`--${brand}-brand-neutral-300`).trim(),
      neutral400: computed.getPropertyValue(`--${brand}-brand-neutral-400`).trim(),
      neutral500: computed.getPropertyValue(`--${brand}-brand-neutral-500`).trim(),
      neutral600: computed.getPropertyValue(`--${brand}-brand-neutral-600`).trim(),
      neutral700: computed.getPropertyValue(`--${brand}-brand-neutral-700`).trim(),
      neutral800: computed.getPropertyValue(`--${brand}-brand-neutral-800`).trim(),
      neutral900: computed.getPropertyValue(`--${brand}-brand-neutral-900`).trim(),
      
      // Semantic colors
      semanticSuccess: computed.getPropertyValue(`--${brand}-brand-semantic-success`).trim(),
      semanticWarning: computed.getPropertyValue(`--${brand}-brand-semantic-warning`).trim(),
      semanticError: computed.getPropertyValue(`--${brand}-brand-semantic-error`).trim(),
      semanticInfo: computed.getPropertyValue(`--${brand}-brand-semantic-info`).trim()
    };

    // Clean up
    document.body.removeChild(tempDiv);
    
    // Cache the result
    brandTokenCache.set(brand, tokens);
    
    return tokens;
  } catch (error) {
    console.error(`Failed to load brand tokens for ${brand}:`, error);
    return null;
  }
}

/**
 * Create Storybook theme from brand tokens
 */
export async function createBrandTheme(brand, baseTheme) {
  // Default values for Mantine brand
  if (brand === 'mantine') {
    return {
      ...baseTheme,
      base: 'light',
      fontBase: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontCode: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    };
  }

  // Load brand tokens
  const tokens = await loadBrandTokens(brand);
  
  if (!tokens) {
    console.warn(`Using fallback theme for ${brand}`);
    return baseTheme;
  }

  // Build theme with actual token values
  const theme = {
    base: 'light',
    
    // Brand info
    brandTitle: `${brand.charAt(0).toUpperCase() + brand.slice(1)} Design System`,
    brandUrl: baseTheme.brandUrl,
    
    // Typography - use actual token values
    fontBase: tokens.fontFamilyBody || tokens.fontFamilySans || baseTheme.fontBase,
    fontCode: tokens.fontFamilyMono || baseTheme.fontCode,
    
    // UI colors - map to actual token values
    appBg: tokens.neutral50 || '#ffffff',
    appContentBg: tokens.neutral50 || '#ffffff',
    appPreviewBg: tokens.neutral50 || '#ffffff',
    appBorderColor: tokens.neutral200 || '#E9ECEF',
    appBorderRadius: 4,
    
    // Text colors
    textColor: tokens.neutral900 || '#000000',
    textInverseColor: tokens.neutral50 || '#FFFFFF',
    textMutedColor: tokens.neutral600 || '#868E96',
    
    // Toolbar colors - use brand primary
    barTextColor: tokens.neutral700 || '#495057',
    barSelectedColor: tokens.primary500 || '#228BE6',
    barHoverColor: tokens.primary500 || '#228BE6',
    barBg: tokens.neutral50 || '#FFFFFF',
    
    // Form colors
    inputBg: tokens.neutral50 || 'white',
    inputBorder: tokens.neutral300 || '#DEE2E6',
    inputTextColor: tokens.neutral900 || '#000000',
    inputBorderRadius: 4,
    
    // Button and UI elements - use brand colors
    buttonBg: tokens.primary50 || tokens.neutral100 || '#F8F9FA',
    buttonBorder: tokens.primary200 || tokens.neutral300 || '#DEE2E6',
    booleanBg: tokens.neutral200 || '#E9ECEF',
    booleanSelectedBg: tokens.primary500 || '#228BE6',
    
    // Additional theme properties
    colorPrimary: tokens.primary500,
    colorSecondary: tokens.primary600,
    
    // Success/Warning/Danger colors from semantic tokens
    colorPositive: tokens.semanticSuccess || '#66BF3C',
    colorWarning: tokens.semanticWarning || '#E3C74F',
    colorNegative: tokens.semanticError || '#FF4785',
    colorNeutral: tokens.neutral500 || '#1EA7FD',
  };

  return theme;
}

/**
 * Apply dynamic font styles to manager UI
 */
export function applyDynamicFonts(brand) {
  // Remove any existing dynamic font styles
  const existingStyle = document.getElementById('dynamic-manager-fonts');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Create new style element
  const styleEl = document.createElement('style');
  styleEl.id = 'dynamic-manager-fonts';
  
  // Use CSS variables for all brands
  styleEl.textContent = `
    /* Dynamic font styles for ${brand} brand */
    
    /* Typography using CSS variables */
    :root {
      --manager-font-heading: var(--${brand}-typography-fontfamily-heading, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
      --manager-font-body: var(--${brand}-typography-fontfamily-body, var(--${brand}-typography-fontfamily-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif));
      --manager-font-mono: var(--${brand}-typography-fontfamily-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
    }
    
    /* Target all possible heading selectors */
    button[title*="Design System"],
    div[role="banner"] h1,
    div[role="banner"] button,
    div[role="banner"] span,
    [class*="css-"] h1,
    .css-1p6h5ss,
    .sidebar-header,
    [role="main"] h1,
    [class*="sidebar-header"],
    .sb-bar__title,
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--manager-font-heading) !important;
    }
    
    /* Target Storybook's navigation heading with high specificity */
    #storybook-explorer-menu ~ div h1,
    #storybook-explorer-menu ~ div button span,
    div[class^="css-"] > h1,
    div[class*=" css-"] > h1 {
      font-family: var(--manager-font-heading) !important;
    }
    
    /* Body text */
    .sidebar-container,
    .sb-bar:not(:has(h1)),
    .sb-main,
    [role="navigation"],
    button:not([title*="Design System"]),
    input,
    select,
    textarea,
    body {
      font-family: var(--manager-font-body) !important;
    }
    
    /* Code blocks */
    code,
    pre,
    .prismjs {
      font-family: var(--manager-font-mono) !important;
    }
    
    /* Brand colors using CSS variables */
    [data-selected="true"],
    button[data-selected="true"],
    a[data-selected="true"] {
      color: var(--${brand}-brand-primary-500, var(--${brand}-brand-primary, #228BE6)) !important;
    }
    
    button:hover,
    a:hover {
      color: var(--${brand}-brand-primary-500, var(--${brand}-brand-primary, #228BE6)) !important;
    }
  `;
  
  document.head.appendChild(styleEl);
}
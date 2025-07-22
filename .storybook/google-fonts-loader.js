/**
 * Google Fonts Dynamic Loader
 * 
 * This script automatically loads Google Fonts that are referenced in the design tokens
 * or explicitly requested, making it easy to experiment with typography.
 */

import { googleFonts, getGoogleFontUrl, getGoogleFontsUrl } from './google-fonts-config.js';
import { mapFontName } from './font-mapper.js';

// Track loaded fonts to avoid duplicates
const loadedFonts = new Set();

// Fonts that should always be loaded (for existing brands)
const alwaysLoadFonts = [
  // Clearco fonts
  'Public Sans',
  'Playfair Display',
  'Montserrat',
  // Firstwatch fonts  
  'Roboto Condensed',
  'Roboto Slab',
  'Atkinson Hyperlegible',
  // Common fallback fonts
  'Roboto',
  'Inter',
  'Open Sans'
];

/**
 * Extract font families from a font-family CSS value
 */
function extractFontFamilies(fontFamilyValue) {
  if (!fontFamilyValue) return [];
  
  // Match font names (with or without quotes)
  const fontRegex = /(?:'([^']+)'|"([^"]+)"|([^,]+))/g;
  const fonts = [];
  let match;
  
  while ((match = fontRegex.exec(fontFamilyValue)) !== null) {
    const fontName = (match[1] || match[2] || match[3]).trim();
    // Map font name to Google Fonts equivalent
    const mappedFontName = mapFontName(fontName);
    // Skip generic font families
    if (!['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 
         '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Arial', 'Helvetica',
         'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 
         'Liberation Mono', 'Courier New', 'Georgia', 'Times New Roman'].includes(mappedFontName)) {
      fonts.push(mappedFontName);
    }
  }
  
  return fonts;
}

/**
 * Load a Google Font dynamically
 */
function loadGoogleFont(fontName, weights = null) {
  // Skip if already loaded
  if (loadedFonts.has(fontName)) {
    return;
  }
  
  // Check if font exists in our config
  if (!googleFonts[fontName]) {
    console.warn(`[Font Loader] Font "${fontName}" not found in Google Fonts config`);
    return;
  }
  
  const url = getGoogleFontUrl(fontName, weights);
  if (!url) return;
  
  // Create link element
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  link.dataset.fontName = fontName;
  document.head.appendChild(link);
  
  loadedFonts.add(fontName);
  console.log(`[Font Loader] Loaded font: ${fontName}`);
}

/**
 * Load multiple Google Fonts at once
 */
function loadGoogleFonts(fontList) {
  const fontsToLoad = fontList.filter(({ name }) => 
    !loadedFonts.has(name) && googleFonts[name]
  );
  
  if (fontsToLoad.length === 0) return;
  
  const url = getGoogleFontsUrl(fontsToLoad);
  if (!url) return;
  
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  link.dataset.fontNames = fontsToLoad.map(f => f.name).join(',');
  document.head.appendChild(link);
  
  fontsToLoad.forEach(({ name }) => {
    loadedFonts.add(name);
    console.log(`[Font Loader] Loaded font: ${name}`);
  });
}

/**
 * Scan CSS variables for font references and load them
 */
function scanAndLoadFonts() {
  const computedStyle = getComputedStyle(document.documentElement);
  const fontProperties = [
    '--mantine-typography-fontfamily-heading',
    '--mantine-typography-fontfamily-body',
    '--mantine-typography-fontfamily-mono',
    '--mantine-typography-fontfamily-sans',
    '--mantine-typography-fontfamily-serif'
  ];
  
  // Also check brand-specific variables
  const currentBrand = document.body.getAttribute('data-brand');
  if (currentBrand && currentBrand !== 'mantine') {
    fontProperties.push(
      `--${currentBrand}-typography-fontfamily-heading`,
      `--${currentBrand}-typography-fontfamily-body`,
      `--${currentBrand}-typography-fontfamily-mono`,
      `--${currentBrand}-typography-fontfamily-sans`,
      `--${currentBrand}-typography-fontfamily-serif`,
      `--${currentBrand}-typography-fontfamily-display`,
      `--${currentBrand}-typography-fontfamily-brand`
    );
  }
  
  const fontsToLoad = new Set();
  
  fontProperties.forEach(prop => {
    const value = computedStyle.getPropertyValue(prop);
    if (value) {
      const fonts = extractFontFamilies(value);
      fonts.forEach(font => fontsToLoad.add(font));
    }
  });
  
  // Load all discovered fonts
  fontsToLoad.forEach(fontName => {
    loadGoogleFont(fontName);
  });
}

/**
 * Initialize font loader
 */
export function initializeFontLoader() {
  console.log('[Font Loader] Initializing Google Fonts loader');
  
  // Load always-required fonts first
  loadGoogleFonts(alwaysLoadFonts.map(name => ({ name })));
  
  // Scan for additional fonts after a short delay
  setTimeout(() => {
    scanAndLoadFonts();
  }, 100);
  
  // Re-scan when brand changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'data-brand' || mutation.attributeName === 'data-theme')) {
        setTimeout(scanAndLoadFonts, 100);
      }
    });
  });
  
  observer.observe(document.body, { 
    attributes: true,
    attributeFilter: ['data-brand', 'data-theme']
  });
}

/**
 * Manually load a font (useful for testing)
 */
export function loadFont(fontName, weights = null) {
  loadGoogleFont(fontName, weights);
}

/**
 * Get list of loaded fonts
 */
export function getLoadedFonts() {
  return Array.from(loadedFonts);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFontLoader);
} else {
  initializeFontLoader();
}
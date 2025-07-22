/**
 * Token Value Reader Utility
 * 
 * Provides functions to dynamically read CSS variable values from computed styles
 * and format them appropriately for display in Storybook stories.
 */

// Cache for computed styles to improve performance
const valueCache = new Map();
let cacheTimeout = null;

/**
 * Clear the value cache after a delay
 */
function scheduleCacheClear() {
  if (cacheTimeout) clearTimeout(cacheTimeout);
  cacheTimeout = setTimeout(() => {
    valueCache.clear();
  }, 1000); // Clear cache after 1 second of inactivity
}

/**
 * Get the computed value of a CSS variable
 * @param {string} varName - CSS variable name (with or without --)
 * @param {Element} element - Element to read from (default: document.documentElement)
 * @returns {string} The computed value or empty string if not found
 */
export function getTokenValue(varName, element = document.documentElement) {
  // Ensure variable name starts with --
  const cssVar = varName.startsWith('--') ? varName : `--${varName}`;
  
  // Check cache first
  const cacheKey = `${cssVar}:${element.tagName}`;
  if (valueCache.has(cacheKey)) {
    return valueCache.get(cacheKey);
  }
  
  // Get computed value
  const computed = getComputedStyle(element);
  const value = computed.getPropertyValue(cssVar).trim();
  
  // Cache the result
  valueCache.set(cacheKey, value);
  scheduleCacheClear();
  
  return value;
}

/**
 * Get token value with brand awareness
 * @param {string} tokenPath - Token path (e.g., 'typography-fontsize-md')
 * @param {string} prefix - Token prefix (default: 'mantine', or current brand)
 * @returns {string} The computed value
 */
export function getBrandAwareTokenValue(tokenPath, prefix = null) {
  // If no prefix provided, check for active brand
  if (!prefix) {
    const currentBrand = document.body.getAttribute('data-brand');
    prefix = currentBrand || 'mantine';
  }
  
  const varName = `--${prefix}-${tokenPath}`;
  return getTokenValue(varName);
}

/**
 * Parse a color value and return formatted versions
 * @param {string} value - Color value (hex, rgb, rgba, etc.)
 * @returns {object} Object with hex, rgb, and original values
 */
export function parseColorValue(value) {
  if (!value) return { original: '', hex: '', rgb: '' };
  
  // Already hex
  if (value.startsWith('#')) {
    return {
      original: value,
      hex: value,
      rgb: hexToRgb(value)
    };
  }
  
  // RGB/RGBA
  if (value.startsWith('rgb')) {
    return {
      original: value,
      hex: rgbToHex(value),
      rgb: value
    };
  }
  
  // Named color or other
  return {
    original: value,
    hex: value,
    rgb: value
  };
}

/**
 * Convert hex to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Convert RGB to hex
 */
function rgbToHex(rgb) {
  const result = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(rgb);
  if (!result) return rgb;
  
  const r = parseInt(result[1]);
  const g = parseInt(result[2]);
  const b = parseInt(result[3]);
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Parse a size value and return formatted versions
 * @param {string} value - Size value (rem, px, etc.)
 * @returns {object} Object with rem, px, and original values
 */
export function parseSizeValue(value) {
  if (!value) return { original: '', rem: '', px: '' };
  
  // Extract number and unit
  const match = value.match(/^([\d.]+)(\w+)$/);
  if (!match) return { original: value, rem: value, px: value };
  
  const [, num, unit] = match;
  const numValue = parseFloat(num);
  
  // Get root font size for conversion
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  
  if (unit === 'rem') {
    return {
      original: value,
      rem: value,
      px: `${numValue * rootFontSize}px`
    };
  }
  
  if (unit === 'px') {
    return {
      original: value,
      rem: `${numValue / rootFontSize}rem`,
      px: value
    };
  }
  
  return { original: value, rem: value, px: value };
}

/**
 * Get all token values matching a pattern
 * @param {string} pattern - Pattern to match (e.g., 'typography-fontsize-')
 * @param {string} prefix - Token prefix (default: 'mantine')
 * @returns {object} Object with token names as keys and values
 */
export function getTokensByPattern(pattern, prefix = 'mantine') {
  const computed = getComputedStyle(document.documentElement);
  const results = {};
  
  // Get all CSS properties
  for (let i = 0; i < computed.length; i++) {
    const prop = computed[i];
    if (prop.startsWith(`--${prefix}-${pattern}`)) {
      const value = computed.getPropertyValue(prop).trim();
      const tokenName = prop.replace(`--${prefix}-`, '');
      results[tokenName] = value;
    }
  }
  
  return results;
}

/**
 * Format token name for display
 * @param {string} tokenName - Raw token name
 * @returns {string} Formatted name
 */
export function formatTokenName(tokenName) {
  // Remove prefix if present
  const withoutPrefix = tokenName.replace(/^--\w+-/, '');
  
  // Split by hyphen and capitalize
  return withoutPrefix
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Create a token value display element
 * @param {string} varName - CSS variable name
 * @param {object} options - Display options
 * @returns {string} HTML string
 */
export function createTokenDisplay(varName, options = {}) {
  const {
    showName = true,
    showValue = true,
    showVariable = false,
    format = 'auto'
  } = options;
  
  const value = getTokenValue(varName);
  
  let formattedValue = value;
  if (format === 'color') {
    const parsed = parseColorValue(value);
    formattedValue = parsed.hex || value;
  } else if (format === 'size') {
    const parsed = parseSizeValue(value);
    formattedValue = `${parsed.rem} (${parsed.px})`;
  }
  
  let html = '<span class="token-display">';
  
  if (showName) {
    html += `<span class="token-name">${formatTokenName(varName)}</span>`;
  }
  
  if (showValue) {
    html += `<span class="token-value">${formattedValue}</span>`;
  }
  
  if (showVariable) {
    html += `<code class="token-variable">${varName}</code>`;
  }
  
  html += '</span>';
  
  return html;
}

/**
 * Watch for token changes and execute callback
 * @param {Function} callback - Function to call when tokens change
 * @returns {Function} Cleanup function
 */
export function watchTokenChanges(callback) {
  let debounceTimer = null;
  
  // Watch for style changes
  const observer = new MutationObserver((mutations) => {
    const hasStyleChange = mutations.some(mutation => 
      mutation.type === 'attributes' && 
      (mutation.attributeName === 'style' || 
       mutation.attributeName === 'class' ||
       mutation.attributeName === 'data-brand' ||
       mutation.attributeName === 'data-theme')
    );
    
    if (hasStyleChange) {
      // Debounce callbacks
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        valueCache.clear(); // Clear cache on change
        callback();
      }, 100);
    }
  });
  
  // Observe changes
  observer.observe(document.documentElement, {
    attributes: true,
    subtree: false
  });
  
  observer.observe(document.body, {
    attributes: true,
    subtree: false
  });
  
  // Also listen for custom token update events
  const handleTokenUpdate = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      valueCache.clear();
      callback();
    }, 100);
  };
  
  window.addEventListener('token-update', handleTokenUpdate);
  
  // Return cleanup function
  return () => {
    observer.disconnect();
    window.removeEventListener('token-update', handleTokenUpdate);
    if (debounceTimer) clearTimeout(debounceTimer);
  };
}

/**
 * Get all available CSS variables for a given prefix
 * @param {string} prefix - Variable prefix (e.g., 'mantine', 'clearco')
 * @returns {Array} Array of variable names
 */
export function getAllTokenVariables(prefix = 'mantine') {
  const computed = getComputedStyle(document.documentElement);
  const variables = [];
  
  for (let i = 0; i < computed.length; i++) {
    const prop = computed[i];
    if (prop.startsWith(`--${prefix}-`)) {
      variables.push(prop);
    }
  }
  
  return variables.sort();
}

/**
 * Refresh all token values (clears cache)
 */
export function refreshTokenValues() {
  valueCache.clear();
  window.dispatchEvent(new CustomEvent('token-update'));
}
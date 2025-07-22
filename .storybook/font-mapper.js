/**
 * Font Mapper
 * Maps font names from tokens to available Google Fonts
 */

// Font name mappings for variants not available on Google Fonts
export const fontMappings = {
  'Atkinson Hyperlegible Next': 'Atkinson Hyperlegible',
  // Add more mappings as needed
};

/**
 * Map a font name to its Google Fonts equivalent
 * @param {string} fontName - The font name from tokens
 * @returns {string} - The mapped font name
 */
export function mapFontName(fontName) {
  // Remove quotes if present
  const cleanName = fontName.replace(/['"]/g, '').trim();
  
  // Check if there's a mapping
  if (fontMappings[cleanName]) {
    return fontMappings[cleanName];
  }
  
  // Return the original name if no mapping exists
  return cleanName;
}

/**
 * Process a font-family CSS value to map font names
 * @param {string} fontFamily - The font-family CSS value
 * @returns {string} - The processed font-family value
 */
export function processFontFamily(fontFamily) {
  if (!fontFamily) return fontFamily;
  
  // Split by comma to handle font stacks
  const fonts = fontFamily.split(',').map(font => {
    const trimmed = font.trim();
    const isQuoted = trimmed.startsWith("'") || trimmed.startsWith('"');
    const fontName = trimmed.replace(/['"]/g, '');
    const mappedName = mapFontName(fontName);
    
    // Re-quote if it was originally quoted and contains spaces
    if (isQuoted || mappedName.includes(' ')) {
      return `'${mappedName}'`;
    }
    return mappedName;
  });
  
  return fonts.join(', ');
}
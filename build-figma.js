// Build script for Figma-optimized token output
// Creates a single unified token file with all brands and themes

// Polyfill for web streams if needed
import { TransformStream } from 'stream/web';
if (typeof globalThis.TransformStream === 'undefined') {
  globalThis.TransformStream = TransformStream;
}

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import StyleDictionary from 'style-dictionary';
import fs from 'fs';
import { promises as fsPromises } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse command line arguments
const args = process.argv.slice(2);
const isVerbose = args.includes('--verbose');
const isWatchMode = args.includes('--watch');

console.log(`🎨 Building unified Figma token file...`);

// Helper function to capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper function to clean token names for Figma
function cleanTokenName(name) {
  // Remove prefixes and clean up names
  return name
    .split('-')
    .map(part => capitalize(part))
    .join(' ');
}

// Get list of brands
async function getBrands() {
  const brandsDir = resolve(__dirname, 'tokens/brands');
  try {
    const brands = await fsPromises.readdir(brandsDir);
    return brands.filter(brand => {
      const brandPath = resolve(brandsDir, brand);
      return fs.statSync(brandPath).isDirectory();
    });
  } catch (error) {
    return [];
  }
}

// Custom format for unified Figma JSON
StyleDictionary.registerFormat({
  name: 'json/figma-unified',
  format: async ({ dictionary }) => {
    // Build a map of values to primitive token paths
    const primitiveValueMap = new Map();
    
    // Helper to add primitive tokens to the map
    function mapPrimitiveValues(tokens, pathPrefix) {
      tokens.forEach((token, index) => {
        if (index < 3 && isVerbose) {
          console.log(`Token ${index}: path=${token.path.join('.')}, filePath=${token.filePath}, value=${JSON.stringify(token.value)}, original.value=${JSON.stringify(token.original.$value)}`);
        }
        // Use the resolved value from Style Dictionary
        const resolvedValue = token.value || token.original.$value;
        if (token.filePath && token.filePath.includes('primitives') && resolvedValue !== undefined) {
          if (isVerbose && primitiveValueMap.size < 5) {
            console.log(`Adding primitive: ${token.path.join('.')} = ${JSON.stringify(resolvedValue)}`);
          }
          const fullPath = pathPrefix + '.' + token.path.map(p => {
            // Handle special cases for path names
            if (token.path[0] === 'typography') {
              if (p === 'fontFamily') return 'Font Families';
              if (p === 'fontSize') return 'Font Sizes';
              if (p === 'fontWeight') return 'Font Weights';
              if (p === 'lineHeight') return 'Line Heights';
              if (p === 'letterSpacing') return 'Letter Spacing';
            } else if (token.path[0] === 'radius') {
              if (p === 'radius') return 'Border Radius';
            } else if (token.path[0] === 'shadow') {
              if (p === 'shadow') return 'Shadows';
            } else if (token.path[0] === 'spacing') {
              if (p === token.path[1]) return p.toUpperCase();
            }
            return capitalize(p);
          }).join('.');
          
          const valueKey = JSON.stringify(resolvedValue);
          if (!primitiveValueMap.has(valueKey)) {
            primitiveValueMap.set(valueKey, `{${fullPath}}`);
          }
        }
      });
    }
    
    // Map all primitive values first
    mapPrimitiveValues(dictionary.allTokens, 'Global.Primitives');
    if (isVerbose) {
      console.log(`Built primitive value map with ${primitiveValueMap.size} entries`);
      // Log a few sample entries
      let count = 0;
      for (const [key, value] of primitiveValueMap.entries()) {
        console.log(`  ${key} => ${value}`);
        if (++count >= 5) break;
      }
    }
    const output = {
      Global: {
        Primitives: {
          Colors: {},
          Typography: {
            'Font Families': {},
            'Font Sizes': {},
            'Font Weights': {},
            'Line Heights': {},
            'Letter Spacing': {}
          },
          Spacing: {},
          Shadows: {},
          'Border Radius': {}
        }
      },
      Brands: {
        Mantine: {
          Light: {
            Semantic: {},
            Components: {}
          },
          Dark: {
            Semantic: {},
            Components: {}
          }
        }
      }
    };

    // Get all available brands
    const brands = await getBrands();
    
    // Initialize brand structures
    for (const brand of brands) {
      if (brand !== 'mantine') {
        output.Brands[capitalize(brand)] = {
          'Brand Colors': {},
          Light: {
            Semantic: {},
            Components: {}
          },
          Dark: {
            Semantic: {},
            Components: {}
          }
        };
      }
    }

    // Log unique file paths if verbose
    if (isVerbose) {
      const uniqueFiles = new Set(dictionary.allTokens.map(t => t.filePath));
      console.log(`Processing tokens from ${uniqueFiles.size} files`);
      console.log('All files:');
      for (const file of Array.from(uniqueFiles).sort()) {
        console.log(`  - ${file}`);
      }
    }
    
    // Process all tokens
    dictionary.allTokens.forEach(token => {
      const { path, value, type, comment, original, filePath } = token;
      
      // Debug logging for brand theme files
      if (isVerbose && filePath.includes('brands/') && (filePath.includes('theme-light') || filePath.includes('theme-dark'))) {
        console.log(`\nProcessing token from ${filePath}:`);
        console.log(`  Path: ${path.join('.')}`);
        console.log(`  Original value: ${JSON.stringify(original.$value)}`);
      }
      
      // Helper to resolve a reference and check if it matches a primitive
      const resolveAndMapReference = (ref, tokenValue) => {
        // First try the standard mapping
        const mappedRef = mapTokenReference(ref);
        if (mappedRef !== ref) {
          return mappedRef;
        }
        
        // If it's a brand reference, check if the resolved value matches a primitive
        if (ref.startsWith('{brand.') && tokenValue !== undefined) {
          const valueKey = JSON.stringify(tokenValue);
          const primitiveRef = primitiveValueMap.get(valueKey);
          if (primitiveRef) {
            return primitiveRef;
          }
        }
        
        return ref;
      };
      
      // Create token object - preserve references but map to unified structure
      let tokenValue;
      if (original.$value && typeof original.$value === 'string') {
        // Check if it contains references (might be compound like "{spacing.md} {spacing.lg}")
        if (original.$value.includes('{')) {
          // Replace all references in the string
          tokenValue = original.$value.replace(/\{[^}]+\}/g, (match) => {
            // Special handling for brand references in brand files
            if (match.startsWith('{brand.') && filePath.includes('brands/')) {
              const brandMatch = filePath.match(/brands\/([^/]+)\//);
              if (brandMatch) {
                const brandName = capitalize(brandMatch[1]);
                const refPath = match.slice(1, -1); // Remove { and }
                const [_, category, ...rest] = refPath.split('.');
                if (rest.length > 0) {
                  return `{Brands.${brandName}.Brand Colors.${capitalize(category)}.${rest.join('.')}}`;
                } else {
                  return `{Brands.${brandName}.Brand Colors.${capitalize(category)}}`;
                }
              }
            }
            return resolveAndMapReference(match, value);
          });
        } else {
          // Check if the value matches a primitive
          if (filePath.includes('brands/')) {
            const valueKey = JSON.stringify(value);
            const primitiveRef = primitiveValueMap.get(valueKey);
            if (primitiveRef) {
              console.log(`✨ Mapping brand value ${original.$value} to primitive ${primitiveRef}`);
              tokenValue = primitiveRef;
            } else {
              tokenValue = original.$value;
            }
          } else {
            tokenValue = original.$value;
          }
        }
      } else {
        // Check non-string values too
        if (filePath.includes('brands/') && value !== undefined) {
          const valueKey = JSON.stringify(value);
          const primitiveRef = primitiveValueMap.get(valueKey);
          if (primitiveRef) {
            tokenValue = primitiveRef;
          } else {
            tokenValue = original.$value;
          }
        } else {
          tokenValue = original.$value;
        }
      }
      const tokenType = original.$type || type;
      
      const tokenObj = {
        $value: tokenValue,
        $type: tokenType
      };
      
      if (original.$description || comment) {
        tokenObj.$description = original.$description || comment;
      }

      // Route tokens based on file path and structure
      if (filePath.includes('primitives')) {
        // Always route primitive tokens to primitives section
        routePrimitiveToken(output.Global.Primitives, path, tokenObj);
      } else if (filePath.includes('custom') && path[0] === 'typography' && path[1] === 'fontWeight') {
        // Route custom font weights to custom section to avoid overriding primitives
        if (!output.Global.Custom) {
          output.Global.Custom = {};
        }
        routeCustomToken(output.Global.Custom, path, tokenObj);
      } else if (filePath.includes('brands/')) {
        if (isVerbose && path[0] === 'brand' && filePath.includes('clearco')) {
          console.log(`Processing Clearco brand token: ${path.join('.')}, filePath=${filePath}`);
        }
        // Extract brand name from file path
        const brandMatch = filePath.match(/brands\/([^/]+)\//);
        if (brandMatch) {
          const brandName = capitalize(brandMatch[1]);
          if (isVerbose && (filePath.includes('theme-light') || filePath.includes('theme-dark'))) {
            console.log(`Processing ${brandName} theme file: ${filePath}, token path: ${path.join('.')}`);
          }
          if (output.Brands[brandName]) {
            // Create a modified token object with resolved value for theme tokens
            let modifiedTokenObj = { ...tokenObj };
            
            // For theme tokens, use the resolved value to avoid collision issues
            if ((filePath.includes('theme-light') || filePath.includes('theme-dark')) && 
                path[0] === 'theme' && value !== undefined) {
              // Use the actual resolved value instead of reference
              modifiedTokenObj.$value = value;
            }
            
            routeBrandToken(output.Brands[brandName], path, modifiedTokenObj, filePath, brandName);
          }
        }
      } else if (filePath.includes('semantic')) {
        // Default semantic tokens go to Mantine brand
        const theme = filePath.includes('dark') ? 'Dark' : 'Light';
        routeSemanticToken(output.Brands.Mantine[theme].Semantic, path, tokenObj);
      } else if (filePath.includes('components')) {
        // Component tokens need to be duplicated for each theme
        routeComponentToken(output.Brands.Mantine.Light.Components, path, tokenObj);
        routeComponentToken(output.Brands.Mantine.Dark.Components, path, tokenObj);
      } else if (filePath.includes('custom')) {
        // Custom tokens go to Global.Custom
        if (!output.Global.Custom) {
          output.Global.Custom = {};
        }
        routeCustomToken(output.Global.Custom, path, tokenObj);
      }
    });

    // Post-process to fix missing Light sections
    fixMissingLightSections(output);
    
    // Clean up empty objects
    cleanEmptyObjects(output);

    return JSON.stringify(output, null, 2);
  }
});

// Route primitive tokens to appropriate categories
function routePrimitiveToken(primitives, path, tokenObj) {
  const [category, ...rest] = path;
  
  switch (category) {
    case 'color':
      if (rest.length === 1) {
        // Single colors like white, black
        primitives.Colors[capitalize(rest[0])] = tokenObj;
      } else {
        // Color scales like gray-50, blue-100
        const [colorName, shade] = rest;
        if (!primitives.Colors[capitalize(colorName)]) {
          primitives.Colors[capitalize(colorName)] = {};
        }
        primitives.Colors[capitalize(colorName)][shade] = tokenObj;
      }
      break;
      
    case 'typography':
      const [typoProp, ...typoRest] = rest;
      switch (typoProp) {
        case 'fontFamily':
          primitives.Typography['Font Families'][cleanTokenName(typoRest.join('-'))] = tokenObj;
          break;
        case 'fontSize':
          primitives.Typography['Font Sizes'][cleanTokenName(typoRest.join('-'))] = tokenObj;
          break;
        case 'fontWeight':
          primitives.Typography['Font Weights'][cleanTokenName(typoRest.join('-'))] = tokenObj;
          break;
        case 'lineHeight':
          primitives.Typography['Line Heights'][cleanTokenName(typoRest.join('-'))] = tokenObj;
          break;
        case 'letterSpacing':
          primitives.Typography['Letter Spacing'][cleanTokenName(typoRest.join('-'))] = tokenObj;
          break;
      }
      break;
      
    case 'spacing':
      const spacingKey = rest.length > 0 ? rest.join('-').toUpperCase() : 'DEFAULT';
      primitives.Spacing[spacingKey] = tokenObj;
      break;
      
    case 'shadow':
      primitives.Shadows[cleanTokenName(rest.join('-'))] = tokenObj;
      break;
      
    case 'radius':
      primitives['Border Radius'][cleanTokenName(rest.join('-'))] = tokenObj;
      break;
  }
}

// Route brand-specific tokens
function routeBrandToken(brand, path, tokenObj, filePath, brandName = '') {
  // Check if it's a brand color definition
  if (filePath.includes('colors.json') || filePath.includes('brand-colors.json') || filePath.includes('colors-merged.json')) {
    const [category, ...rest] = path;
    if (category === 'brand' || category === 'color' || category === 'clearco') {
      // Handle both simple semantic colors and color scales
      if (rest[0] === 'semantic' && rest.length > 1) {
        // This is a semantic color like brand.semantic.success
        const semanticColor = capitalize(rest[1]);
        brand['Brand Colors'][semanticColor] = tokenObj;
      } else {
        // This is a color scale like brand.primary.500 or brand.neutral.100
        const colorCategory = capitalize(rest[0]);
        if (rest.length > 1) {
          // This is a shade like brand.primary.500
          if (!brand['Brand Colors'][colorCategory]) {
            brand['Brand Colors'][colorCategory] = {};
          }
          // Only add if it's not already a simple value
          if (typeof brand['Brand Colors'][colorCategory] !== 'object' || brand['Brand Colors'][colorCategory].$value) {
            // Convert simple value to object
            brand['Brand Colors'][colorCategory] = {};
          }
          brand['Brand Colors'][colorCategory][rest[1]] = tokenObj;
        } else {
          // This is a simple color like brand.primary
          // Only set if not already an object with shades
          if (!brand['Brand Colors'][colorCategory] || Object.keys(brand['Brand Colors'][colorCategory]).length === 0) {
            brand['Brand Colors'][colorCategory] = tokenObj;
          }
        }
      }
    }
  } 
  // Check for theme-specific tokens
  else if (filePath.includes('theme-light')) {
    if (isVerbose) {
      console.log(`Routing light theme token for ${brandName}: ${path.join('.')}, token value: ${JSON.stringify(tokenObj.$value)}`);
    }
    // Route to light theme only
    routeSemanticToken(brand.Light.Semantic, path, tokenObj);
  } else if (filePath.includes('theme-dark')) {
    if (isVerbose) {
      console.log(`Routing dark theme token for ${brandName}: ${path.join('.')}, token value: ${JSON.stringify(tokenObj.$value)}`);
    }
    // Route to dark theme only
    routeSemanticToken(brand.Dark.Semantic, path, tokenObj);
  } else if (filePath.includes('enhanced-theme')) {
    // Enhanced theme tokens should go to both light and dark themes
    if (path[0] === 'theme') {
      // Route regular theme tokens
      routeSemanticToken(brand.Light.Semantic, path, tokenObj);
      routeSemanticToken(brand.Dark.Semantic, path, tokenObj);
    }
  }
  // Typography and other brand-specific tokens
  else if (filePath.includes('typography')) {
    // Add to brand root or appropriate section
    if (!brand.Typography) {
      brand.Typography = {};
    }
    const [category, ...rest] = path;
    brand.Typography[cleanTokenName(rest.join('-'))] = tokenObj;
  }
}

// Route semantic tokens
function routeSemanticToken(semantic, path, tokenObj) {
  const [category, ...rest] = path;
  
  // Skip if it's 'theme' prefix
  if (category === 'theme') {
    const [realCategory, ...realRest] = rest;
    
    // Check if this is a brand token structure (theme.surface.primary instead of theme.color.surface.primary)
    const colorCategories = ['surface', 'content', 'border', 'interactive', 'focus', 'overlay'];
    if (colorCategories.includes(realCategory)) {
      // This is a brand token - insert 'color' to make it compatible with the routing
      routeSemanticTokenInternal(semantic, 'color', [realCategory, ...realRest], tokenObj);
    } else {
      routeSemanticTokenInternal(semantic, realCategory, realRest, tokenObj);
    }
  } else {
    routeSemanticTokenInternal(semantic, category, rest, tokenObj);
  }
}

function routeSemanticTokenInternal(semantic, category, rest, tokenObj) {
  switch (category) {
    case 'color':
      const [colorType, ...colorRest] = rest;
      switch (colorType) {
        case 'background':
          if (!semantic.Backgrounds) semantic.Backgrounds = {};
          semantic.Backgrounds[cleanTokenName(colorRest.join('-'))] = tokenObj;
          break;
        case 'surface':
          if (!semantic.Surfaces) semantic.Surfaces = {};
          semantic.Surfaces[cleanTokenName(colorRest.join('-'))] = tokenObj;
          break;
        case 'border':
          if (!semantic.Borders) semantic.Borders = {};
          semantic.Borders[cleanTokenName(colorRest.join('-'))] = tokenObj;
          break;
        case 'text':
          if (!semantic.Text) semantic.Text = {};
          semantic.Text[cleanTokenName(colorRest.join('-'))] = tokenObj;
          break;
        case 'content':
          // Brand tokens use 'content' instead of 'text'
          if (!semantic.Text) semantic.Text = {};
          semantic.Text[cleanTokenName(colorRest.join('-'))] = tokenObj;
          break;
        case 'interactive':
          // Interactive elements have nested structure
          if (!semantic.Interactive) semantic.Interactive = {};
          routeInteractiveToken(semantic.Interactive, colorRest, tokenObj);
          break;
        case 'focus':
          // Focus states
          if (!semantic.Focus) semantic.Focus = {};
          semantic.Focus[cleanTokenName(colorRest.join('-'))] = tokenObj;
          break;
        case 'overlay':
          // Overlay colors
          if (!semantic.Overlay) semantic.Overlay = {};
          semantic.Overlay[cleanTokenName(colorRest.join('-'))] = tokenObj;
          break;
        default:
          // States like primary, success, warning, error, info
          if (!semantic.States) semantic.States = {};
          semantic.States[capitalize(colorType)] = tokenObj;
      }
      break;
    case 'spacing':
    case 'radius':
    case 'shadow':
      // Add other semantic categories as needed
      if (!semantic[capitalize(category)]) {
        semantic[capitalize(category)] = {};
      }
      semantic[capitalize(category)][cleanTokenName(rest.join('-'))] = tokenObj;
      break;
  }
}

// Helper function to route interactive tokens
function routeInteractiveToken(interactive, path, tokenObj) {
  const [variant, ...rest] = path;
  
  if (!interactive[capitalize(variant)]) {
    interactive[capitalize(variant)] = {};
  }
  
  if (rest.length === 0) {
    // If no sub-property, set directly
    interactive[capitalize(variant)] = tokenObj;
  } else {
    // Handle nested properties like primary.default, primary.hover
    const property = cleanTokenName(rest.join('-'));
    interactive[capitalize(variant)][property] = tokenObj;
  }
}

// Route component tokens
function routeComponentToken(components, path, tokenObj) {
  const [componentName, ...rest] = path;
  const component = capitalize(componentName);
  
  if (!components[component]) {
    components[component] = {};
  }
  
  // Create nested structure for component properties
  let current = components[component];
  for (let i = 0; i < rest.length - 1; i++) {
    const key = cleanTokenName(rest[i]);
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }
  
  // Set the final value
  if (rest.length > 0) {
    current[cleanTokenName(rest[rest.length - 1])] = tokenObj;
  }
}

// Route custom tokens
function routeCustomToken(custom, path, tokenObj) {
  const [category, ...rest] = path;
  
  switch (category) {
    case 'spacing':
      if (!custom.Spacing) custom.Spacing = {};
      custom.Spacing[cleanTokenName(rest.join('-'))] = tokenObj;
      break;
    case 'typography':
      if (!custom.Typography) custom.Typography = {};
      const [typoProp, ...typoRest] = rest;
      switch (typoProp) {
        case 'fontSize':
          if (!custom.Typography['Font Sizes']) custom.Typography['Font Sizes'] = {};
          custom.Typography['Font Sizes'][cleanTokenName(typoRest.join('-'))] = tokenObj;
          break;
        case 'lineHeight':
          if (!custom.Typography['Line Heights']) custom.Typography['Line Heights'] = {};
          custom.Typography['Line Heights'][cleanTokenName(typoRest.join('-'))] = tokenObj;
          break;
        case 'letterSpacing':
          if (!custom.Typography['Letter Spacing']) custom.Typography['Letter Spacing'] = {};
          custom.Typography['Letter Spacing'][cleanTokenName(typoRest.join('-'))] = tokenObj;
          break;
        case 'fontWeight':
          if (!custom.Typography['Font Weights']) custom.Typography['Font Weights'] = {};
          custom.Typography['Font Weights'][cleanTokenName(typoRest.join('-'))] = tokenObj;
          break;
        default:
          custom.Typography[cleanTokenName(rest.join('-'))] = tokenObj;
      }
      break;
    case 'ovalButton':
      if (!custom.Components) custom.Components = {};
      if (!custom.Components['Oval Button']) custom.Components['Oval Button'] = {};
      routeComponentToken(custom.Components, ['ovalButton', ...rest], tokenObj);
      break;
    default:
      // Handle other custom tokens
      if (!custom[capitalize(category)]) {
        custom[capitalize(category)] = {};
      }
      if (rest.length > 0) {
        custom[capitalize(category)][cleanTokenName(rest.join('-'))] = tokenObj;
      } else {
        custom[capitalize(category)] = tokenObj;
      }
  }
}

// Map token references to unified structure paths
function mapTokenReference(reference) {
  if (!reference || typeof reference !== 'string' || !reference.startsWith('{')) {
    return reference;
  }
  
  // Extract the reference path
  const refPath = reference.slice(1, -1); // Remove { and }
  const parts = refPath.split('.');
  
  // Map common references to the unified structure
  if (parts[0] === 'brand' || parts[0] === 'clearco') {
    // Handle brand-specific references
    if (parts[0] === 'clearco' && parts.length >= 2) {
      // Map clearco.primary.500 -> Brands.Clearco.Brand Colors.Primary.500
      const [_, category, ...rest] = parts;
      if (rest.length > 0) {
        return `{Brands.Clearco.Brand Colors.${capitalize(category)}.${rest.join('.')}}`;
      } else {
        return `{Brands.Clearco.Brand Colors.${capitalize(category)}}`;
      }
    } else if (parts[0] === 'brand' && parts.length >= 2) {
      // Generic brand references - need to determine which brand file we're in
      // This is handled in the main processing logic where we have access to filePath
      return reference; // Return as-is, will be handled in main logic
    }
  } else if (parts[0] === 'color') {
    // Map color.white -> Global.Primitives.Colors.White
    if (parts.length === 2) {
      return `{Global.Primitives.Colors.${capitalize(parts[1])}}`;
    } else if (parts.length === 3) {
      // Map color.gray.50 -> Global.Primitives.Colors.Gray.50
      return `{Global.Primitives.Colors.${capitalize(parts[1])}.${parts[2]}}`;
    }
  } else if (parts[0] === 'typography') {
    // Map typography references
    if (parts[1] === 'fontWeight') {
      // Font weights use capitalized names (Bold, Semibold, etc.)
      return `{Global.Primitives.Typography.Font Weights.${capitalize(parts[2])}}`;
    } else if (parts[1] === 'fontSize') {
      // Font sizes use cleaned names (Xs -> XS, Sm -> SM, etc. for xs, sm)
      const sizeMap = {
        'xs': 'Xs',
        'sm': 'Sm', 
        'md': 'Md',
        'lg': 'Lg',
        'xl': 'Xl',
        'h1': 'H1',
        'h2': 'H2',
        'h3': 'H3',
        'h4': 'H4',
        'h5': 'H5',
        'h6': 'H6'
      };
      const mappedSize = sizeMap[parts[2]] || capitalize(parts[2]);
      return `{Global.Primitives.Typography.Font Sizes.${mappedSize}}`;
    } else if (parts[1] === 'lineHeight') {
      return `{Global.Primitives.Typography.Line Heights.${capitalize(parts[2])}}`;
    } else if (parts[1] === 'letterSpacing') {
      return `{Global.Primitives.Typography.Letter Spacing.${capitalize(parts[2])}}`;
    } else if (parts[1] === 'fontFamily') {
      return `{Global.Primitives.Typography.Font Families.${capitalize(parts[2])}}`;
    }
  } else if (parts[0] === 'spacing') {
    // Map spacing.md -> Global.Primitives.Spacing.MD
    return `{Global.Primitives.Spacing.${parts[1].toUpperCase()}}`;
  } else if (parts[0] === 'radius') {
    // Map radius.sm -> Global.Primitives.Border Radius.Sm
    return `{Global.Primitives.Border Radius.${capitalize(parts[1])}}`;
  } else if (parts[0] === 'shadow') {
    // Map shadow.sm -> Global.Primitives.Shadows.Sm
    return `{Global.Primitives.Shadows.${capitalize(parts[1])}}`;
  } else if (parts[0] === 'brand') {
    // Brand-specific references stay as-is for now
    return reference;
  }
  
  // Return unmapped references as-is
  return reference;
}


// Fix missing Light sections by copying structure from Dark sections
function fixMissingLightSections(output) {
  // For each brand
  Object.keys(output.Brands).forEach(brandName => {
    const brand = output.Brands[brandName];
    
    // Skip if no Light/Dark sections
    if (!brand.Light || !brand.Dark) return;
    
    // Check if Light or Dark sections are incomplete
    const lightCategories = brand.Light.Semantic ? Object.keys(brand.Light.Semantic) : [];
    const darkCategories = brand.Dark.Semantic ? Object.keys(brand.Dark.Semantic) : [];
    
    // Expected categories for a complete theme
    const expectedCategories = ['Surfaces', 'Text', 'Borders', 'Interactive', 'Focus', 'Overlay'];
    
    // Check if Light is missing categories
    const lightMissing = expectedCategories.filter(cat => !lightCategories.includes(cat));
    const darkMissing = expectedCategories.filter(cat => !darkCategories.includes(cat));
    
    if (lightMissing.length > 0 || darkMissing.length > 0) {
      console.log(`⚠️  Fixing incomplete semantic tokens for ${brandName}`);
      console.log(`   Light missing: ${lightMissing.join(', ') || 'none'}`);
      console.log(`   Dark missing: ${darkMissing.join(', ') || 'none'}`);
      
      // Fill in missing categories
      if (!brand.Light.Semantic) brand.Light.Semantic = {};
      if (!brand.Dark.Semantic) brand.Dark.Semantic = {};
      
      fillMissingCategories(brand.Light.Semantic, lightMissing, 'light', brandName);
      fillMissingCategories(brand.Dark.Semantic, darkMissing, 'dark', brandName);
    }
  });
}

// Fill missing categories with appropriate theme values
function fillMissingCategories(semantic, missingCategories, theme, brandName) {
  // Define theme values for each category
  const themeValues = {
    light: {
      Surfaces: {
        Primary: '#ffffff',
        Secondary: '#f5f5f5',
        Tertiary: '#ebebeb',
        Inverse: '#1a1a1a',
        Brand: '#f0f9ff'
      },
      Text: {
        Primary: '#1a1a1a',
        Secondary: '#525252',
        Tertiary: '#737373',
        Disabled: '#a3a3a3',
        Inverse: '#ffffff',
        Brand: '#0066cc'
      },
      Borders: {
        Subtle: '#e5e5e5',
        Default: '#d4d4d4',
        Strong: '#a3a3a3',
        Inverse: 'rgba(255, 255, 255, 0.2)',
        Brand: '#99ccff'
      },
      Interactive: {
        Primary: {
          Default: '#0066cc',
          Hover: '#0052a3',
          Active: '#004080',
          Disabled: '#99ccff'
        },
        Secondary: {
          Default: '#f5f5f5',
          Hover: '#ebebeb',
          Active: '#d4d4d4',
          Disabled: '#fafafa'
        },
        Danger: {
          Default: '#dc2626',
          Hover: '#b91c1c',
          Active: '#991b1b'
        },
        Success: {
          Default: '#16a34a',
          Hover: '#15803d',
          Active: '#166534'
        }
      },
      Focus: {
        Ring: '#0066cc',
        Offset: '#ffffff'
      },
      Overlay: {
        Backdrop: 'rgba(0, 0, 0, 0.5)',
        Scrim: 'rgba(0, 0, 0, 0.8)'
      }
    },
    dark: {
      Surfaces: {
        Primary: '#0a0a0a',
        Secondary: '#1a1a1a',
        Tertiary: '#242424',
        Inverse: '#f5f5f5',
        Brand: '#001a33'
      },
      Text: {
        Primary: '#f5f5f5',
        Secondary: '#d4d4d4',
        Tertiary: '#a3a3a3',
        Disabled: '#525252',
        Inverse: '#1a1a1a',
        Brand: '#66b3ff'
      },
      Borders: {
        Subtle: 'rgba(255, 255, 255, 0.1)',
        Default: 'rgba(255, 255, 255, 0.2)',
        Strong: 'rgba(255, 255, 255, 0.3)',
        Inverse: 'rgba(0, 0, 0, 0.2)',
        Brand: '#003366'
      },
      Interactive: {
        Primary: {
          Default: '#4d94ff',
          Hover: '#66a3ff',
          Active: '#80b3ff',
          Disabled: '#1a4d99'
        },
        Secondary: {
          Default: 'rgba(255, 255, 255, 0.1)',
          Hover: 'rgba(255, 255, 255, 0.15)',
          Active: 'rgba(255, 255, 255, 0.2)',
          Disabled: 'rgba(255, 255, 255, 0.05)'
        },
        Danger: {
          Default: '#ef4444',
          Hover: '#dc2626',
          Active: '#b91c1c'
        },
        Success: {
          Default: '#22c55e',
          Hover: '#16a34a',
          Active: '#15803d'
        }
      },
      Focus: {
        Ring: '#4d94ff',
        Offset: '#0a0a0a'
      },
      Overlay: {
        Backdrop: 'rgba(0, 0, 0, 0.8)',
        Scrim: 'rgba(0, 0, 0, 0.9)'
      }
    }
  };
  
  const values = themeValues[theme];
  
  missingCategories.forEach(category => {
    if (values[category]) {
      semantic[category] = {};
      
      // Add tokens for this category
      Object.keys(values[category]).forEach(key => {
        const value = values[category][key];
        
        if (typeof value === 'object') {
          // Handle nested structures like Interactive
          semantic[category][key] = {};
          Object.keys(value).forEach(subKey => {
            semantic[category][key][subKey] = {
              $value: value[subKey],
              $type: 'color',
              $description: `${key} ${subKey.toLowerCase()} state`
            };
          });
        } else {
          semantic[category][key] = {
            $value: value,
            $type: 'color',
            $description: `${category} ${key.toLowerCase()}`
          };
        }
      });
    }
  });
}

// Create light theme tokens based on dark theme structure
function createLightFromDark(darkSemantic, brandName) {
  const lightSemantic = {};
  
  // Define light theme values for each category
  const lightThemeValues = {
    Surfaces: {
      Primary: '#ffffff',
      Secondary: '#f5f5f5',
      Tertiary: '#ebebeb',
      Inverse: '#1a1a1a',
      Brand: '#f0f9ff'
    },
    Text: {
      Primary: '#1a1a1a',
      Secondary: '#525252',
      Tertiary: '#737373',
      Disabled: '#a3a3a3',
      Inverse: '#ffffff',
      Brand: '#0066cc'
    },
    Borders: {
      Subtle: '#e5e5e5',
      Default: '#d4d4d4',
      Strong: '#a3a3a3',
      Inverse: 'rgba(255, 255, 255, 0.2)',
      Brand: '#99ccff'
    },
    Interactive: {
      Primary: {
        Default: '#0066cc',
        Hover: '#0052a3',
        Active: '#004080',
        Disabled: '#99ccff'
      },
      Secondary: {
        Default: '#f5f5f5',
        Hover: '#ebebeb',
        Active: '#d4d4d4',
        Disabled: '#fafafa'
      },
      Danger: {
        Default: '#dc2626',
        Hover: '#b91c1c',
        Active: '#991b1b'
      },
      Success: {
        Default: '#16a34a',
        Hover: '#15803d',
        Active: '#166534'
      }
    },
    Focus: {
      Ring: '#0066cc',
      Offset: '#ffffff'
    },
    Overlay: {
      Backdrop: 'rgba(0, 0, 0, 0.5)',
      Scrim: 'rgba(0, 0, 0, 0.8)'
    }
  };
  
  // Copy structure from dark and apply light values
  Object.keys(darkSemantic).forEach(category => {
    if (lightThemeValues[category]) {
      lightSemantic[category] = {};
      
      Object.keys(darkSemantic[category]).forEach(key => {
        const darkToken = darkSemantic[category][key];
        
        // Get the light value
        let lightValue = lightThemeValues[category][key];
        
        // Handle nested structures (like Interactive.Primary.Default)
        if (!lightValue && typeof darkToken === 'object' && !darkToken.$value) {
          lightSemantic[category][key] = {};
          Object.keys(darkToken).forEach(subKey => {
            const subToken = darkToken[subKey];
            if (lightThemeValues[category][key] && lightThemeValues[category][key][subKey]) {
              lightSemantic[category][key][subKey] = {
                $value: lightThemeValues[category][key][subKey],
                $type: subToken.$type || 'color',
                $description: subToken.$description || ''
              };
            }
          });
        } else if (lightValue) {
          lightSemantic[category][key] = {
            $value: lightValue,
            $type: darkToken.$type || 'color',
            $description: darkToken.$description || ''
          };
        }
      });
    }
  });
  
  return lightSemantic;
}

// Clean up empty objects recursively
function cleanEmptyObjects(obj, path = '') {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && !obj[key].$value) {
      // Don't remove Light/Dark sections for brands even if empty
      const currentPath = path + '.' + key;
      const isBrandThemeSection = currentPath.match(/\.Brands\.\w+\.(Light|Dark)$/);
      
      if (Object.keys(obj[key]).length === 0 && !isBrandThemeSection) {
        delete obj[key];
      } else {
        cleanEmptyObjects(obj[key], currentPath);
        // Check again after cleaning
        if (Object.keys(obj[key]).length === 0 && !isBrandThemeSection) {
          delete obj[key];
        }
      }
    }
  });
}

// Build configuration for unified file
const unifiedConfig = {
  source: [
    'tokens/primitives/*-dtcg.json',
    'tokens/semantic/*-dtcg.json',
    'tokens/components/*-dtcg.json',
    // Custom tokens except typography (to avoid font weight collisions)
    'tokens/custom/custom-spacing.json',
    'tokens/custom/oval-button.json',
    // Brand tokens - colors and typography first
    'tokens/brands/clearco/colors-merged.json',
    'tokens/brands/clearco/typography.json',
    'tokens/brands/clearco/card-container.json',  // Needed for card shadow references
    'tokens/brands/firstwatch/colors.json',
    'tokens/brands/firstwatch/typography.json',
    // Enhanced theme (references light/dark tokens, so must come after)
    'tokens/brands/clearco/enhanced-theme.json',
    // Theme files - process these last to avoid collisions
    // Process one brand at a time to minimize collisions
    'tokens/brands/clearco/theme-light.json',
    'tokens/brands/clearco/theme-dark.json',
    'tokens/brands/firstwatch/theme-light.json',
    'tokens/brands/firstwatch/theme-dark.json'
  ],
  platforms: {
    figma: {
      buildPath: 'build/figma/',
      transforms: ['attribute/cti', 'name/camel', 'color/hex', 'size/rem'],
      options: {
        showFileHeader: false
      },
      files: [{
        destination: 'figma.tokens.json',
        format: 'json/figma-unified',
        options: {
          outputReferences: false  // This ensures references are resolved
        }
      }]
    }
  }
};

// Build function
async function build() {
  try {
    // Ensure output directory exists
    await fsPromises.mkdir(resolve(__dirname, 'build/figma'), { recursive: true });

    console.log('\n📦 Building unified Figma token file...');
    
    // Build unified file
    console.log('\n📦 Building unified Figma token file...');
    const sd = new StyleDictionary({
      ...unifiedConfig,
      log: {
        verbosity: isVerbose ? 'verbose' : 'default',
        warnings: 'warn'
      }
    });
    await sd.buildAllPlatforms();

    console.log('\n✅ Figma token file built successfully!\n');
    console.log('📁 Output file:');
    console.log('   - build/figma/figma.tokens.json (Complete unified token set)\n');
    console.log('💡 This single file contains:');
    console.log('   • Global primitives (colors, typography, spacing, etc.)');
    console.log('   • All brand tokens (Mantine, Clearco, Firstwatch)');
    console.log('   • Light and dark themes for each brand');
    console.log('   • All component tokens\n');
    console.log('📤 Import this file into Figma using the DTCG Token Importer plugin\n');

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Watch mode
async function watch() {
  console.log('👀 Watching for token changes...\n');
  
  const { watch } = await import('chokidar');
  const watcher = watch('tokens/**/*.json', {
    persistent: true,
    ignoreInitial: true
  });

  watcher.on('change', async (path) => {
    console.log(`\n🔄 File changed: ${path}`);
    await build();
  });

  // Initial build
  await build();
}

// Run build or watch
if (isWatchMode) {
  watch();
} else {
  build();
}
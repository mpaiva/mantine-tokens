import StyleDictionary from 'style-dictionary';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import minimist from 'minimist';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CSS color-mix function
function parseColorMix(value) {
  if (typeof value !== 'string' || !value.includes('color-mix')) {
    return value;
  }
  
  // For now, return a fallback color
  // In a real implementation, we'd calculate the actual mixed color
  if (value.includes('#0a0a0a')) {
    return '#1a1a1a'; // Dark surface with brand tint
  }
  if (value.includes('#0a0a0b')) {
    return '#1a1a1b'; // Dark surface with brand tint
  }
  
  return value;
}

// Convert rem to pixels
function remToPx(value) {
  if (typeof value !== 'string' || !value.endsWith('rem')) {
    return value;
  }
  const remValue = parseFloat(value);
  return remValue * 16; // Assuming 16px base font size
}

// Build Figma-compatible tokens
async function buildFigmaVariables(options = {}) {
  console.log('🎨 Building Figma Variables...\n');

  // Helper function to capitalize
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Process tokens recursively, filtering unsupported types
  function processTokensForFigma(obj, path = []) {
    const processed = {};

    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) {
        // Skip metadata at non-token level
        if (path.length === 0 || !value.$value) {
          processed[key] = value;
        }
        continue;
      }

      if (value && typeof value === 'object') {
        if (value.$value !== undefined) {
          // It's a token
          const tokenType = value.$type || 'string';
          
          // Skip unsupported token types
          if (['shadow', 'fontFamily', 'fontWeight', 'letterSpacing'].includes(tokenType)) {
            if (options.verbose) {
              console.log(`Skipping unsupported type: ${tokenType} at ${[...path, key].join('.')}`);
            }
            continue;
          }

          // Process supported types
          let processedValue = value.$value;
          
          // Handle color-mix
          if (tokenType === 'color') {
            processedValue = parseColorMix(processedValue);
          }
          
          // Convert fontSize and lineHeight to numbers
          if (tokenType === 'fontSize' || tokenType === 'lineHeight') {
            processedValue = remToPx(processedValue);
            processed[key] = {
              $value: processedValue,
              $type: 'number'
            };
            if (value.$description) {
              processed[key].$description = value.$description;
            }
          } else {
            processed[key] = {
              $value: processedValue,
              $type: tokenType
            };
            if (value.$description) {
              processed[key].$description = value.$description;
            }
          }
        } else {
          // It's a group
          const subProcessed = processTokensForFigma(value, [...path, key]);
          if (Object.keys(subProcessed).length > 0) {
            processed[key] = subProcessed;
          }
        }
      } else {
        processed[key] = value;
      }
    }

    return processed;
  }

  // Fix reference paths and map to Figma structure
  function fixReferences(value, fromPath = '') {
    if (typeof value !== 'string' || !value.includes('{')) return value;

    return value.replace(/\{([^}]+)\}/g, (match, ref) => {
      // Handle brand references
      if (ref.startsWith('brand.')) {
        // Extract brand from path (e.g., if fromPath contains 'Clearco')
        let brandName = '';
        if (fromPath.includes('Clearco')) brandName = 'Clearco';
        else if (fromPath.includes('Firstwatch')) brandName = 'Firstwatch';
        
        if (brandName) {
          const parts = ref.split('.');
          if (parts[1] === 'neutral') {
            return `{Brands.${brandName}.BrandColors.neutral.${parts.slice(2).join('.')}}`;
          } else if (parts[1] === 'primary' || parts[1] === 'secondary' || parts[1] === 'accent') {
            return `{Brands.${brandName}.BrandColors.${parts[1]}.${parts.slice(2).join('.')}}`;
          } else if (parts[1] === 'semantic') {
            return `{Brands.${brandName}.BrandColors.semantic.${parts.slice(2).join('.')}}`;
          }
        }
      }
      
      // Handle color references
      if (ref.startsWith('color.') || ref.startsWith('colors.')) {
        const parts = ref.split('.');
        if (parts.length === 2) {
          const colorName = parts[1];
          if (colorName === 'white' || colorName === 'black') {
            return `{Primitives.Color.${colorName}}`;
          }
        } else if (parts.length === 3) {
          const [_, colorName, shade] = parts;
          return `{Primitives.Color.${colorName}.${shade}}`;
        }
      }
      
      // Handle spacing references
      if (ref.startsWith('spacing.')) {
        const spacingKey = ref.slice(8);
        return `{Primitives.Spacing.${spacingKey}}`;
      }
      
      // Handle radius references
      if (ref.startsWith('radius.')) {
        const radiusKey = ref.slice(7);
        return `{Primitives.BorderRadius.${radiusKey}}`;
      }
      
      // Handle typography references
      if (ref.startsWith('typography.')) {
        const parts = ref.split('.');
        if (parts.length >= 3) {
          const category = parts[1];
          const subcategory = parts[2];
          
          if (category === 'fontSize' || category === 'fontsize') {
            return `{Primitives.Typography.FontSize.${subcategory}}`;
          }
          
          if (category === 'lineHeight' || category === 'lineheight') {
            return `{Primitives.Typography.LineHeight.${subcategory}}`;
          }
        }
      }

      // Fix any remaining spaces in the reference
      let fixedRef = ref
        .replace(/Border Radius/g, 'BorderRadius')
        .replace(/Font Size/g, 'FontSize')
        .replace(/Line Height/g, 'LineHeight')
        .replace(/Brand Colors/g, 'BrandColors');

      return `{${fixedRef}}`;
    });
  }

  // Process all values to fix references
  function fixAllReferences(obj, path = []) {
    const fixed = {};

    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object') {
        if (value.$value !== undefined) {
          fixed[key] = {
            ...value,
            $value: fixReferences(value.$value, path.join('.'))
          };
        } else {
          fixed[key] = fixAllReferences(value, [...path, key]);
        }
      } else {
        fixed[key] = value;
      }
    }

    return fixed;
  }

  // Load and process tokens
  const tokenFiles = [
    // Primitives
    ...await fs.readdir(path.join(__dirname, 'tokens/primitives')).then(files => 
      files.filter(f => f.endsWith('-dtcg.json')).map(f => path.join('tokens/primitives', f))
    ),
    // Semantic
    ...await fs.readdir(path.join(__dirname, 'tokens/semantic')).then(files => 
      files.filter(f => f.endsWith('-dtcg.json')).map(f => path.join('tokens/semantic', f))
    ),
    // Components
    ...await fs.readdir(path.join(__dirname, 'tokens/components')).then(files => 
      files.filter(f => f.endsWith('-dtcg.json')).map(f => path.join('tokens/components', f))
    ),
    // Custom (excluding typography to avoid collisions)
    'tokens/custom/custom-spacing.json',
    'tokens/custom/oval-button.json',
    // Brands
    'tokens/brands/clearco/colors.json',
    'tokens/brands/clearco/typography.json',
    'tokens/brands/clearco/typography-sizes.json',
    'tokens/brands/clearco/theme-light.json',
    'tokens/brands/clearco/theme-dark.json',
    'tokens/brands/firstwatch/colors.json',
    'tokens/brands/firstwatch/typography.json',
    'tokens/brands/firstwatch/typography-sizes.json',
    'tokens/brands/firstwatch/theme-light.json',
    'tokens/brands/firstwatch/theme-dark.json'
  ];

  console.log('Processing token files...');
  const processedTokens = {};

  for (const file of tokenFiles) {
    const filePath = path.join(__dirname, file);
    const content = await fs.readFile(filePath, 'utf-8');
    const tokens = JSON.parse(content);

    if (file.includes('primitives')) {
      Object.assign(processedTokens, tokens);
    } else if (file.includes('semantic')) {
      Object.assign(processedTokens, tokens);
    } else if (file.includes('components')) {
      Object.assign(processedTokens, tokens);
    } else if (file.includes('custom')) {
      if (!processedTokens.custom) processedTokens.custom = {};
      Object.assign(processedTokens.custom, tokens);
    } else if (file.includes('brands')) {
      const brandMatch = file.match(/brands\/([^/]+)\//);
      if (brandMatch) {
        const brandName = brandMatch[1];
        if (!processedTokens[brandName]) {
          processedTokens[brandName] = {};
        }
        
        if (file.includes('theme-light.json')) {
          processedTokens[brandName]['theme-light'] = tokens.theme || tokens;
        } else if (file.includes('theme-dark.json')) {
          processedTokens[brandName]['theme-dark'] = tokens.theme || tokens;
        } else {
          for (const [key, value] of Object.entries(tokens)) {
            if (!processedTokens[brandName][key]) {
              processedTokens[brandName][key] = {};
            }
            if (typeof value === 'object' && !Array.isArray(value)) {
              Object.assign(processedTokens[brandName][key], value);
            } else {
              processedTokens[brandName][key] = value;
            }
          }
        }
      }
    }
  }

  // Build unified structure with fixed names
  const unified = {
    Primitives: {
      Color: processedTokens.color || {},
      Typography: {
        FontSize: processedTokens.typography?.fontSize || {},
        LineHeight: processedTokens.typography?.lineHeight || {}
        // Excluding FontFamily, FontWeight, LetterSpacing as they're not supported
      },
      Spacing: processedTokens.spacing || {},
      BorderRadius: processedTokens.radius || processedTokens.borderRadius || {}
      // Excluding Shadow as it's not supported
    },
    Semantic: {
      Light: processedTokens.theme || {},
      Dark: {}
    },
    Components: {
      Button: processedTokens.button || {},
      Card: processedTokens.card || {},
      Input: processedTokens.input || {},
      Modal: processedTokens.modal || {},
      Badge: processedTokens.badge || {},
      Alert: processedTokens.alert || {}
    },
    Custom: {
      Spacing: processedTokens.custom?.spacing || {},
      OvalButton: processedTokens.custom?.ovalButton || {}
    },
    Brands: {}
  };

  // Map brands with fixed structure
  for (const [brandName, brandTokens] of Object.entries(processedTokens)) {
    if (['color', 'typography', 'spacing', 'shadow', 'radius', 'theme', 'button', 'card', 'input', 'modal', 'badge', 'alert', 'custom'].includes(brandName)) continue;
    
    unified.Brands[capitalize(brandName)] = {
      BrandColors: brandTokens.brand || {},
      Typography: {
        // Only include supported typography tokens
        FontSize: brandTokens.typography?.fontSize || {},
        LineHeight: brandTokens.typography?.lineHeight || {}
      },
      Theme: {
        Light: brandTokens['theme-light'] || {},
        Dark: brandTokens['theme-dark'] || {}
      }
    };
  }

  // Process for Figma compatibility
  console.log('Filtering unsupported token types...');
  let figmaTokens = processTokensForFigma(unified);
  
  console.log('Fixing token references...');
  figmaTokens = fixAllReferences(figmaTokens);

  // Ensure output directory exists
  await fs.mkdir(path.join(__dirname, 'build/figma'), { recursive: true });

  // Write output
  const outputPath = path.join(__dirname, 'build/figma/variables.json');
  await fs.writeFile(outputPath, JSON.stringify(figmaTokens, null, 2));

  console.log(`\n✅ Figma variables written to ${outputPath}`);
  
  if (options.verbose) {
    // Count tokens by type
    const counts = { color: 0, number: 0, string: 0, boolean: 0 };
    
    function countTokens(obj) {
      for (const value of Object.values(obj)) {
        if (value && typeof value === 'object') {
          if (value.$value !== undefined && value.$type) {
            counts[value.$type] = (counts[value.$type] || 0) + 1;
          } else {
            countTokens(value);
          }
        }
      }
    }
    
    countTokens(figmaTokens);
    
    console.log('\nToken counts by type:');
    console.log(`  Colors: ${counts.color}`);
    console.log(`  Numbers: ${counts.number}`);
    console.log(`  Strings: ${counts.string}`);
    console.log(`  Booleans: ${counts.boolean}`);
  }
}

// CLI
const argv = minimist(process.argv.slice(2), {
  boolean: ['verbose', 'help'],
  alias: {
    v: 'verbose',
    h: 'help'
  }
});

if (argv.help) {
  console.log(`
Figma Variables Build
  
Builds tokens in a format compatible with Figma Variables API.

Usage:
  node build-figma-variables.js [options]

Options:
  -v, --verbose      Show detailed output
  -h, --help         Show this help
`);
  process.exit(0);
}

// Run build
buildFigmaVariables(argv).catch(console.error);
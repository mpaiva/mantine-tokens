// Enhanced Figma build script with dynamic brand configuration
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
import { loadBrandConfig } from './scripts/brand-config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse command line arguments
const args = process.argv.slice(2);
const isVerbose = args.includes('--verbose');
const isWatchMode = args.includes('--watch');
const shouldOptimizeRefs = args.includes('--optimize-refs');

console.log(`🎨 Building unified Figma token file (v2)...`);

// Helper function to capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper function to clean token names for Figma
function cleanTokenName(name) {
  return name
    .split('-')
    .map(part => capitalize(part))
    .join(' ');
}

// Build source configuration from brand config
async function buildSourceConfig(brandConfig) {
  const sources = [
    'tokens/primitives/*-dtcg.json',
    'tokens/semantic/*-dtcg.json',
    'tokens/components/*-dtcg.json',
    'tokens/custom/*.json'
  ];
  
  // Add brand-specific files based on config
  for (const [brandName, config] of Object.entries(brandConfig.brands)) {
    config.files.include.forEach(file => {
      sources.push(`tokens/brands/${brandName}/${file}`);
    });
  }
  
  if (isVerbose) {
    console.log('\n📄 Source files:');
    sources.forEach(s => console.log(`   - ${s}`));
  }
  
  return sources;
}

// Enhanced reference optimizer
class ReferenceOptimizer {
  constructor(primitiveValueMap) {
    this.primitiveValueMap = primitiveValueMap;
    this.optimizationCount = 0;
  }
  
  optimize(value, filePath) {
    if (!shouldOptimizeRefs || !filePath.includes('brands/')) {
      return value;
    }
    
    const valueKey = JSON.stringify(value);
    const primitiveRef = this.primitiveValueMap.get(valueKey);
    
    if (primitiveRef) {
      this.optimizationCount++;
      if (isVerbose) {
        console.log(`✨ Optimized: ${value} → ${primitiveRef}`);
      }
      return primitiveRef;
    }
    
    return value;
  }
  
  getStats() {
    return {
      total: this.optimizationCount,
      saved: this.optimizationCount * 10 // Approximate bytes saved per optimization
    };
  }
}

// Custom format for unified Figma JSON with enhancements
StyleDictionary.registerFormat({
  name: 'json/figma-unified-v2',
  format: async ({ dictionary }) => {
    const brandConfig = await loadBrandConfig();
    const primitiveValueMap = new Map();
    const optimizer = new ReferenceOptimizer(primitiveValueMap);
    
    // Build primitive value map
    function mapPrimitiveValues(tokens, pathPrefix) {
      tokens.forEach(token => {
        const resolvedValue = token.value || token.original.$value;
        if (token.filePath?.includes('primitives') && resolvedValue !== undefined) {
          const fullPath = pathPrefix + '.' + token.path.map(p => {
            // Enhanced path mapping
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
          primitiveValueMap.set(valueKey, `{${fullPath}}`);
        }
      });
    }
    
    // Initialize output structure
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
      Brands: {}
    };
    
    // Initialize brand structures from config
    for (const [brandName, config] of Object.entries(brandConfig.brands)) {
      output.Brands[capitalize(brandName)] = {
        'Brand Colors': {},
        Typography: {},
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
    
    // Always include Mantine
    if (!output.Brands.Mantine) {
      output.Brands.Mantine = {
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
    
    // Build primitive map
    mapPrimitiveValues(dictionary.allTokens, 'Global.Primitives');
    
    if (isVerbose) {
      console.log(`\n🗺️  Built primitive value map with ${primitiveValueMap.size} entries`);
    }
    
    // Process tokens with brand config awareness
    dictionary.allTokens.forEach(token => {
      const { path, value, type, comment, original, filePath } = token;
      
      // Determine brand namespace from config
      let namespace = 'brand';
      if (filePath.includes('brands/')) {
        const brandMatch = filePath.match(/brands\/([^/]+)\//);
        if (brandMatch && brandConfig.brands[brandMatch[1]]) {
          namespace = brandConfig.brands[brandMatch[1]].namespace;
        }
      }
      
      // Map token references
      const mapTokenReference = (reference) => {
        if (!reference?.startsWith('{')) return reference;
        
        const refPath = reference.slice(1, -1);
        const parts = refPath.split('.');
        
        // Handle brand-specific namespaces
        if (parts[0] === 'brand' && namespace !== 'brand') {
          parts[0] = namespace;
        }
        
        // Map to unified structure
        if (parts[0] === 'brand' || parts[0] === 'clearco' || parts[0] === namespace) {
          // Handle brand-specific references
          if ((parts[0] === 'clearco' || parts[0] === namespace) && parts.length >= 2) {
            // Map clearco.primary.500 -> Brands.Clearco.Brand Colors.Primary.500
            const brandName = parts[0] === 'clearco' ? 'Clearco' : capitalize(namespace);
            const [_, category, ...rest] = parts;
            if (rest.length > 0) {
              return `{Brands.${brandName}.Brand Colors.${capitalize(category)}.${rest.join('.')}}`;
            } else {
              return `{Brands.${brandName}.Brand Colors.${capitalize(category)}}`;
            }
          } else if (parts[0] === 'brand' && parts.length >= 2) {
            // Generic brand references - map to current brand context
            if (filePath.includes('brands/')) {
              const brandMatch = filePath.match(/brands\/([^/]+)\//);
              if (brandMatch) {
                const brandName = capitalize(brandMatch[1]);
                const [_, category, ...rest] = parts;
                if (rest.length > 0) {
                  return `{Brands.${brandName}.Brand Colors.${capitalize(category)}.${rest.join('.')}}`;
                } else {
                  return `{Brands.${brandName}.Brand Colors.${capitalize(category)}}`;
                }
              }
            }
          }
        } else if (parts[0] === 'color') {
          if (parts.length === 2) {
            return `{Global.Primitives.Colors.${capitalize(parts[1])}}`;
          } else if (parts.length === 3) {
            return `{Global.Primitives.Colors.${capitalize(parts[1])}.${parts[2]}}`;
          }
        } else if (parts[0] === 'typography') {
          if (parts[1] === 'fontWeight') {
            return `{Global.Primitives.Typography.Font Weights.${capitalize(parts[2])}}`;
          } else if (parts[1] === 'fontSize') {
            // Font sizes use cleaned names
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
          return `{Global.Primitives.Spacing.${parts[1].toUpperCase()}}`;
        } else if (parts[0] === 'radius') {
          return `{Global.Primitives.Border Radius.${capitalize(parts[1])}}`;
        } else if (parts[0] === 'shadow') {
          return `{Global.Primitives.Shadows.${capitalize(parts[1])}}`;
        }
        
        return reference;
      };
      
      // Process token value
      let tokenValue;
      if (original.$value && typeof original.$value === 'string') {
        if (original.$value.includes('{')) {
          tokenValue = original.$value.replace(/\{[^}]+\}/g, (match) => {
            return mapTokenReference(match);
          });
        } else {
          tokenValue = optimizer.optimize(original.$value, filePath);
        }
      } else {
        tokenValue = optimizer.optimize(original.$value, filePath);
      }
      
      const tokenObj = {
        $value: tokenValue,
        $type: original.$type || type
      };
      
      if (original.$description || comment) {
        tokenObj.$description = original.$description || comment;
      }
      
      // Route tokens based on file path and structure
      if (filePath.includes('primitives')) {
        routePrimitiveToken(output.Global.Primitives, path, tokenObj);
      } else if (filePath.includes('brands/')) {
        const brandMatch = filePath.match(/brands\/([^/]+)\//);
        if (brandMatch) {
          const brandName = capitalize(brandMatch[1]);
          if (output.Brands[brandName]) {
            routeBrandToken(output.Brands[brandName], path, tokenObj, filePath, namespace);
          }
        }
      } else if (filePath.includes('semantic')) {
        const theme = filePath.includes('dark') ? 'Dark' : 'Light';
        routeSemanticToken(output.Brands.Mantine[theme].Semantic, path, tokenObj);
      } else if (filePath.includes('components')) {
        routeComponentToken(output.Brands.Mantine.Light.Components, path, tokenObj);
        routeComponentToken(output.Brands.Mantine.Dark.Components, path, tokenObj);
      } else if (filePath.includes('custom')) {
        if (!output.Global.Custom) {
          output.Global.Custom = {};
        }
        routeCustomToken(output.Global.Custom, path, tokenObj);
      }
    });
    
    // Clean up empty objects
    cleanEmptyObjects(output);
    
    // Add metadata
    const metadata = {
      _metadata: {
        version: '2.0',
        generated: new Date().toISOString(),
        tokenCount: dictionary.allTokens.length,
        brands: Object.keys(output.Brands),
        optimizations: optimizer.getStats()
      }
    };
    
    return JSON.stringify({ ...metadata, ...output }, null, 2);
  }
});

// Routing functions (same as before but with namespace support)
function routePrimitiveToken(primitives, path, tokenObj) {
  const [category, ...rest] = path;
  
  switch (category) {
    case 'color':
      if (rest.length === 1) {
        primitives.Colors[capitalize(rest[0])] = tokenObj;
      } else {
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

function routeBrandToken(brand, path, tokenObj, filePath, namespace) {
  if (filePath.includes('colors') || filePath.includes('brand-colors')) {
    const [category, ...rest] = path;
    if (category === 'brand' || category === 'color' || category === namespace) {
      if (rest[0] === 'semantic' && rest.length > 1) {
        const semanticColor = capitalize(rest[1]);
        brand['Brand Colors'][semanticColor] = tokenObj;
      } else {
        const colorCategory = capitalize(rest[0]);
        if (rest.length > 1) {
          if (!brand['Brand Colors'][colorCategory]) {
            brand['Brand Colors'][colorCategory] = {};
          }
          brand['Brand Colors'][colorCategory][rest[1]] = tokenObj;
        } else {
          if (!brand['Brand Colors'][colorCategory] || Object.keys(brand['Brand Colors'][colorCategory]).length === 0) {
            brand['Brand Colors'][colorCategory] = tokenObj;
          }
        }
      }
    }
  } else if (filePath.includes('theme-light') || filePath.includes('light')) {
    routeSemanticToken(brand.Light.Semantic, path, tokenObj);
  } else if (filePath.includes('theme-dark') || filePath.includes('dark')) {
    routeSemanticToken(brand.Dark.Semantic, path, tokenObj);
  } else if (filePath.includes('typography')) {
    if (!brand.Typography) {
      brand.Typography = {};
    }
    const [category, ...rest] = path;
    brand.Typography[cleanTokenName(rest.join('-'))] = tokenObj;
  }
}

function routeSemanticToken(semantic, path, tokenObj) {
  const [category, ...rest] = path;
  
  if (category === 'theme') {
    const [realCategory, ...realRest] = rest;
    routeSemanticTokenInternal(semantic, realCategory, realRest, tokenObj);
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
        default:
          if (!semantic.States) semantic.States = {};
          semantic.States[capitalize(colorType)] = tokenObj;
      }
      break;
    case 'spacing':
    case 'radius':
    case 'shadow':
      if (!semantic[capitalize(category)]) {
        semantic[capitalize(category)] = {};
      }
      semantic[capitalize(category)][cleanTokenName(rest.join('-'))] = tokenObj;
      break;
  }
}

function routeComponentToken(components, path, tokenObj) {
  const [componentName, ...rest] = path;
  const component = capitalize(componentName);
  
  if (!components[component]) {
    components[component] = {};
  }
  
  let current = components[component];
  for (let i = 0; i < rest.length - 1; i++) {
    const key = cleanTokenName(rest[i]);
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }
  
  if (rest.length > 0) {
    current[cleanTokenName(rest[rest.length - 1])] = tokenObj;
  }
}

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

function cleanEmptyObjects(obj) {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && !obj[key].$value) {
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      } else {
        cleanEmptyObjects(obj[key]);
        if (Object.keys(obj[key]).length === 0) {
          delete obj[key];
        }
      }
    }
  });
}

// Build function
async function build() {
  try {
    await fsPromises.mkdir(resolve(__dirname, 'build/figma'), { recursive: true });
    
    const brandConfig = await loadBrandConfig();
    const sources = await buildSourceConfig(brandConfig);
    
    const unifiedConfig = {
      source: sources,
      platforms: {
        figma: {
          buildPath: 'build/figma/',
          transforms: ['attribute/cti', 'name/camel', 'color/hex', 'size/rem'],
          options: {
            showFileHeader: false
          },
          files: [{
            destination: 'figma.tokens.v2.json',
            format: 'json/figma-unified-v2',
            options: {
              outputReferences: false
            }
          }]
        }
      }
    };
    
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
    console.log('   - build/figma/figma.tokens.v2.json (Enhanced unified token set)\n');
    
    if (shouldOptimizeRefs) {
      console.log('✨ Reference optimization enabled');
    }
    
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
  
  await build();
}

// Run
if (isWatchMode) {
  watch();
} else {
  build();
}
#!/usr/bin/env node

// Enhanced Figma build script with selective build options
// Supports --brand and --theme flags for targeted builds

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
import minimist from 'minimist';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse command line arguments
const argv = minimist(process.argv.slice(2), {
  string: ['brand', 'theme'],
  boolean: ['verbose', 'watch', 'help', 'dry-run'],
  alias: {
    b: 'brand',
    t: 'theme',
    v: 'verbose',
    w: 'watch',
    h: 'help',
    n: 'dry-run'
  },
  default: {
    theme: 'all'
  }
});

// Show help
if (argv.help) {
  console.log(`
🎨 Figma Token Builder - Selective Build

Usage: node build-figma-selective.js [options]

Options:
  -b, --brand <name>     Build specific brand only (e.g., mantine, clearco, firstwatch)
  -t, --theme <name>     Build specific theme only (light, dark, or all)
  -v, --verbose          Show detailed logging
  -w, --watch            Watch mode for development
  -n, --dry-run          Show what would be built without building
  -h, --help             Show this help message

Examples:
  # Build only Mantine brand
  node build-figma-selective.js --brand mantine

  # Build only Clearco light theme
  node build-figma-selective.js --brand clearco --theme light

  # Build all brands but only dark themes
  node build-figma-selective.js --theme dark

  # See what would be built for Firstwatch
  node build-figma-selective.js --brand firstwatch --dry-run
`);
  process.exit(0);
}

const isVerbose = argv.verbose;
const isWatchMode = argv.watch;
const isDryRun = argv['dry-run'];
const selectedBrand = argv.brand?.toLowerCase();
const selectedTheme = argv.theme?.toLowerCase();

// Validate theme selection
if (selectedTheme && !['light', 'dark', 'all'].includes(selectedTheme)) {
  console.error(`❌ Invalid theme: ${selectedTheme}. Must be 'light', 'dark', or 'all'`);
  process.exit(1);
}

console.log(`🎨 Building Figma tokens with selective options...`);
if (selectedBrand) console.log(`   Brand: ${selectedBrand}`);
if (selectedTheme !== 'all') console.log(`   Theme: ${selectedTheme}`);
if (isDryRun) console.log(`   Mode: Dry run (no files will be written)`);

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

// Build source configuration based on selections
async function buildSourceConfig(brandConfig) {
  const sources = [
    'tokens/primitives/*-dtcg.json'
  ];
  
  // Add semantic tokens based on theme selection
  if (selectedTheme === 'all' || !selectedTheme) {
    sources.push('tokens/semantic/*-dtcg.json');
  } else if (selectedTheme === 'light') {
    sources.push('tokens/semantic/light-theme-dtcg.json');
  } else if (selectedTheme === 'dark') {
    sources.push('tokens/semantic/dark-theme-dtcg.json');
  }
  
  // Always include components
  sources.push('tokens/components/*-dtcg.json');
  
  // Add custom tokens (except typography to avoid collisions)
  sources.push('tokens/custom/custom-spacing.json');
  sources.push('tokens/custom/oval-button.json');
  
  // Add brand-specific files
  const availableBrands = Object.keys(brandConfig.brands);
  const brandsToInclude = selectedBrand 
    ? (availableBrands.includes(selectedBrand) ? [selectedBrand] : [])
    : availableBrands;
  
  if (selectedBrand && !availableBrands.includes(selectedBrand)) {
    console.error(`❌ Brand '${selectedBrand}' not found. Available brands: ${availableBrands.join(', ')}`);
    process.exit(1);
  }
  
  for (const brandName of brandsToInclude) {
    const config = brandConfig.brands[brandName];
    config.files.include.forEach(file => {
      sources.push(`tokens/brands/${brandName}/${file}`);
    });
    
    // Add theme files if needed
    if (selectedTheme === 'all' || selectedTheme === 'light') {
      const lightThemeFile = `tokens/brands/${brandName}/theme-light.json`;
      if (fs.existsSync(resolve(__dirname, lightThemeFile))) {
        sources.push(lightThemeFile);
      }
    }
    
    if (selectedTheme === 'all' || selectedTheme === 'dark') {
      const darkThemeFile = `tokens/brands/${brandName}/theme-dark.json`;
      if (fs.existsSync(resolve(__dirname, darkThemeFile))) {
        sources.push(darkThemeFile);
      }
    }
  }
  
  // Always include Mantine if not selecting a specific brand
  if (!selectedBrand || selectedBrand === 'mantine') {
    // Mantine tokens are already included in semantic tokens
  }
  
  if (isVerbose || isDryRun) {
    console.log('\n📄 Source files:');
    sources.forEach(s => console.log(`   - ${s}`));
    console.log(`\n🏷️  Brands included: ${brandsToInclude.join(', ')}`);
  }
  
  return { sources, brandsToInclude };
}

// Custom format that filters output based on selections
StyleDictionary.registerFormat({
  name: 'json/figma-selective',
  format: async ({ dictionary }) => {
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
    
    // Add custom section if needed
    const hasCustomTokens = dictionary.allTokens.some(t => t.filePath.includes('custom'));
    if (hasCustomTokens) {
      output.Global.Custom = {};
    }
    
    // Process tokens
    dictionary.allTokens.forEach(token => {
      const { path, original, filePath } = token;
      
      // Skip tokens that don't match our theme selection
      if (selectedTheme && selectedTheme !== 'all') {
        const isLightTheme = filePath.includes('light');
        const isDarkTheme = filePath.includes('dark');
        
        if ((selectedTheme === 'light' && isDarkTheme) || 
            (selectedTheme === 'dark' && isLightTheme)) {
          return; // Skip this token
        }
      }
      
      // Extract brand from file path
      let targetBrand = 'Mantine'; // Default
      if (filePath.includes('brands/')) {
        const brandMatch = filePath.match(/brands\/([^/]+)\//);
        if (brandMatch) {
          targetBrand = capitalize(brandMatch[1]);
        }
      }
      
      // Skip if brand doesn't match selection
      if (selectedBrand && targetBrand.toLowerCase() !== selectedBrand) {
        return;
      }
      
      // Process token value and route to appropriate location
      let tokenValue = original.$value;
      
      // Handle references
      if (tokenValue && typeof tokenValue === 'string' && tokenValue.includes('{')) {
        tokenValue = tokenValue.replace(/\{[^}]+\}/g, (match) => {
          // Map references to unified structure
          const refPath = match.slice(1, -1);
          const parts = refPath.split('.');
          
          // Handle brand references
          if (match.startsWith('{brand.') && filePath.includes('brands/')) {
            const [_, category, ...rest] = parts;
            if (rest.length > 0) {
              return `{Brands.${targetBrand}.Brand Colors.${capitalize(category)}.${rest.join('.')}}`;
            } else {
              return `{Brands.${targetBrand}.Brand Colors.${capitalize(category)}}`;
            }
          }
          
          // Handle color references
          if (parts[0] === 'color') {
            if (parts.length === 2) {
              return `{Global.Primitives.Colors.${capitalize(parts[1])}}`;
            } else if (parts.length === 3) {
              return `{Global.Primitives.Colors.${capitalize(parts[1])}.${parts[2]}}`;
            }
          }
          
          // Handle typography references
          if (parts[0] === 'typography') {
            const [_, prop, ...rest] = parts;
            switch (prop) {
              case 'fontWeight':
                return `{Global.Primitives.Typography.Font Weights.${capitalize(rest[0])}}`;
              case 'fontSize':
                return `{Global.Primitives.Typography.Font Sizes.${capitalize(rest[0])}}`;
              case 'lineHeight':
                return `{Global.Primitives.Typography.Line Heights.${capitalize(rest[0])}}`;
              case 'fontFamily':
                return `{Global.Primitives.Typography.Font Families.${capitalize(rest[0])}}`;
            }
          }
          
          return match;
        });
      }
      
      const tokenObj = {
        $value: tokenValue,
        $type: original.$type
      };
      
      if (original.$description) {
        tokenObj.$description = original.$description;
      }
      
      // Route tokens to appropriate sections
      if (filePath.includes('primitives')) {
        routePrimitiveToken(output.Global.Primitives, path, tokenObj);
      } else if (filePath.includes('custom')) {
        routeCustomToken(output.Global.Custom, path, tokenObj);
      } else if (filePath.includes('brands/')) {
        if (!output.Brands[targetBrand]) {
          output.Brands[targetBrand] = {
            'Brand Colors': {},
            Typography: {}
          };
          
          if (selectedTheme === 'all' || selectedTheme === 'light') {
            output.Brands[targetBrand].Light = { Semantic: {}, Components: {} };
          }
          if (selectedTheme === 'all' || selectedTheme === 'dark') {
            output.Brands[targetBrand].Dark = { Semantic: {}, Components: {} };
          }
        }
        routeBrandToken(output.Brands[targetBrand], path, tokenObj, filePath);
      } else if (filePath.includes('semantic')) {
        if (!output.Brands.Mantine) {
          output.Brands.Mantine = {};
          if (selectedTheme === 'all' || selectedTheme === 'light') {
            output.Brands.Mantine.Light = { Semantic: {}, Components: {} };
          }
          if (selectedTheme === 'all' || selectedTheme === 'dark') {
            output.Brands.Mantine.Dark = { Semantic: {}, Components: {} };
          }
        }
        const theme = filePath.includes('dark') ? 'Dark' : 'Light';
        if (output.Brands.Mantine[theme]) {
          routeSemanticToken(output.Brands.Mantine[theme].Semantic, path, tokenObj);
        }
      } else if (filePath.includes('components')) {
        if (!output.Brands.Mantine) {
          output.Brands.Mantine = {};
        }
        if (selectedTheme === 'all' || selectedTheme === 'light') {
          if (!output.Brands.Mantine.Light) {
            output.Brands.Mantine.Light = { Semantic: {}, Components: {} };
          }
          routeComponentToken(output.Brands.Mantine.Light.Components, path, tokenObj);
        }
        if (selectedTheme === 'all' || selectedTheme === 'dark') {
          if (!output.Brands.Mantine.Dark) {
            output.Brands.Mantine.Dark = { Semantic: {}, Components: {} };
          }
          routeComponentToken(output.Brands.Mantine.Dark.Components, path, tokenObj);
        }
      }
    });
    
    // Clean up empty objects
    cleanEmptyObjects(output);
    
    // Add metadata
    const metadata = {
      _metadata: {
        version: '1.0',
        generated: new Date().toISOString(),
        tokenCount: dictionary.allTokens.length,
        filters: {
          brand: selectedBrand || 'all',
          theme: selectedTheme || 'all'
        }
      }
    };
    
    return JSON.stringify({ ...metadata, ...output }, null, 2);
  }
});

// Routing functions (simplified from build-figma.js)
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
      primitives.Spacing[rest.join('-').toUpperCase()] = tokenObj;
      break;
      
    case 'shadow':
      primitives.Shadows[cleanTokenName(rest.join('-'))] = tokenObj;
      break;
      
    case 'radius':
      primitives['Border Radius'][cleanTokenName(rest.join('-'))] = tokenObj;
      break;
  }
}

function routeBrandToken(brand, path, tokenObj, filePath) {
  if (filePath.includes('colors') || filePath.includes('brand-colors')) {
    const [category, ...rest] = path;
    if (category === 'brand' || category === 'clearco' || category === 'color') {
      const colorCategory = capitalize(rest[0]);
      if (rest.length > 1) {
        if (!brand['Brand Colors'][colorCategory]) {
          brand['Brand Colors'][colorCategory] = {};
        }
        brand['Brand Colors'][colorCategory][rest[1]] = tokenObj;
      } else {
        brand['Brand Colors'][colorCategory] = tokenObj;
      }
    }
  } else if (filePath.includes('typography')) {
    const [_, ...rest] = path;
    brand.Typography[cleanTokenName(rest.join('-'))] = tokenObj;
  }
}

function routeSemanticToken(semantic, path, tokenObj) {
  const [category, ...rest] = path;
  
  switch (category) {
    case 'theme':
      const [realCategory, ...realRest] = rest;
      routeSemanticTokenInternal(semantic, realCategory, realRest, tokenObj);
      break;
    default:
      routeSemanticTokenInternal(semantic, category, rest, tokenObj);
  }
}

function routeSemanticTokenInternal(semantic, category, rest, tokenObj) {
  switch (category) {
    case 'color':
      const [colorType, ...colorRest] = rest;
      const sectionMap = {
        background: 'Backgrounds',
        surface: 'Surfaces',
        border: 'Borders',
        text: 'Text'
      };
      
      if (sectionMap[colorType]) {
        if (!semantic[sectionMap[colorType]]) semantic[sectionMap[colorType]] = {};
        semantic[sectionMap[colorType]][cleanTokenName(colorRest.join('-'))] = tokenObj;
      } else {
        if (!semantic.States) semantic.States = {};
        semantic.States[capitalize(colorType)] = tokenObj;
      }
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
  
  if (category === 'spacing') {
    if (!custom.Spacing) custom.Spacing = {};
    custom.Spacing[cleanTokenName(rest.join('-'))] = tokenObj;
  } else if (category === 'ovalButton') {
    if (!custom.Components) custom.Components = {};
    if (!custom.Components['Oval Button']) custom.Components['Oval Button'] = {};
    routeComponentToken(custom.Components, ['ovalButton', ...rest], tokenObj);
  }
}

// Helper to clean empty objects
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

// Main build function
async function build() {
  try {
    if (isDryRun) {
      console.log('\n🔍 Dry run mode - analyzing build configuration...\n');
    }
    
    const brandConfig = await loadBrandConfig();
    const { sources, brandsToInclude } = await buildSourceConfig(brandConfig);
    
    if (isDryRun) {
      console.log('\n✅ Build configuration is valid!');
      console.log(`\nWould generate: build/figma/figma.tokens.selective.json`);
      console.log(`Estimated tokens: ~${sources.length * 50}`);
      return;
    }
    
    await fsPromises.mkdir(resolve(__dirname, 'build/figma'), { recursive: true });
    
    const config = {
      source: sources,
      platforms: {
        figma: {
          buildPath: 'build/figma/',
          transforms: ['attribute/cti', 'name/camel', 'color/hex', 'size/rem'],
          options: {
            showFileHeader: false
          },
          files: [{
            destination: 'figma.tokens.selective.json',
            format: 'json/figma-selective',
            options: {
              outputReferences: false
            }
          }]
        }
      }
    };
    
    console.log('\n📦 Building selective Figma token file...');
    const sd = new StyleDictionary({
      ...config,
      log: {
        verbosity: isVerbose ? 'verbose' : 'default',
        warnings: 'warn'
      }
    });
    
    await sd.buildAllPlatforms();
    
    console.log('\n✅ Selective Figma token file built successfully!\n');
    console.log('📁 Output file:');
    console.log('   - build/figma/figma.tokens.selective.json\n');
    
    // Show summary
    const outputFile = resolve(__dirname, 'build/figma/figma.tokens.selective.json');
    const stats = await fsPromises.stat(outputFile);
    const content = JSON.parse(await fsPromises.readFile(outputFile, 'utf8'));
    
    console.log('📊 Build Summary:');
    console.log(`   File size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   Token count: ${content._metadata.tokenCount}`);
    console.log(`   Brands: ${brandsToInclude.join(', ')}`);
    console.log(`   Theme: ${selectedTheme || 'all'}\n`);
    
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

// Check if minimist is installed
try {
  await import('minimist');
} catch (error) {
  console.error('❌ Missing dependency: minimist');
  console.error('Please run: npm install minimist');
  process.exit(1);
}

// Run
if (isWatchMode) {
  watch();
} else {
  build();
}
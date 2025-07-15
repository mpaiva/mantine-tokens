// Polyfill for web streams if needed
import { TransformStream } from 'stream/web';
if (typeof globalThis.TransformStream === 'undefined') {
  globalThis.TransformStream = TransformStream;
}

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import StyleDictionary from 'style-dictionary';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse command line arguments
const args = process.argv.slice(2);
const isVerbose = args.includes('--verbose');
const brands = args.filter(arg => !arg.startsWith('--'));

// Get all brands if none specified
const availableBrands = brands.length > 0 ? brands : 
  fs.readdirSync(resolve(__dirname, 'tokens/brands'))
    .filter(file => fs.statSync(resolve(__dirname, 'tokens/brands', file)).isDirectory());

if (availableBrands.length === 0) {
  console.error('❌ No brands found in tokens/brands directory');
  process.exit(1);
}

// Custom transform for brand-specific CSS variables
function createBrandTransform(brandName) {
  return {
    name: `name/${brandName}-css`,
    type: 'name',
    filter: (token) => !!token.$value || !!token.value,
    transform: (token) => {
      const path = token.path.join('-').toLowerCase();
      return `${brandName}-${path}`;
    }
  };
}

// Register custom format for CSS with proper CSS custom properties
function createBrandCSSFormat(brandName) {
  return {
    name: `css/${brandName}-variables`,
    format: ({ dictionary, options }) => {
      const selector = options?.selector || ':root';
      
      let css = `${selector} {\n`;
      
      dictionary.allTokens.forEach(token => {
        let value = token.$value || token.value;
        
        // Handle shadow tokens
        if (token.$type === 'shadow' && Array.isArray(value)) {
          value = value.map(shadow => {
            if (typeof shadow === 'object') {
              return `${shadow.offsetX || '0'} ${shadow.offsetY || '0'} ${shadow.blur || '0'} ${shadow.spread || '0'} ${shadow.color || 'rgba(0,0,0,0.1)'}`;
            }
            return shadow;
          }).join(', ');
        }
        
        // Handle references properly
        if (options?.outputReferences && typeof token.original?.$value === 'string' && token.original.$value.includes('{')) {
          // Extract the reference path and convert to CSS variable
          const refMatch = token.original.$value.match(/\{([^}]+)\}/);
          if (refMatch) {
            const refPath = refMatch[1];
            const refName = refPath.split('.').join('-').toLowerCase();
            value = `var(--${brandName}-${refName})`;
          }
        }
        
        css += `  --${token.name}: ${value};\n`;
      });
      
      css += '}\n';
      return css;
    }
  };
}

// Build configuration for each brand
async function buildBrand(brandName) {
  console.log(`\n🎨 Building ${brandName} brand tokens...`);
  
  const brandPath = resolve(__dirname, 'tokens/brands', brandName);
  if (!fs.existsSync(brandPath)) {
    console.error(`❌ Brand directory not found: ${brandPath}`);
    return;
  }

  // Check if theme files exist
  const hasLightTheme = fs.existsSync(resolve(brandPath, 'theme-light.json'));
  const hasDarkTheme = fs.existsSync(resolve(brandPath, 'theme-dark.json'));
  
  // Register brand-specific transform and format
  StyleDictionary.registerTransform(createBrandTransform(brandName));
  StyleDictionary.registerFormat(createBrandCSSFormat(brandName));
  
  // Build base configuration (colors, typography and semantic patterns)
  const sources = [
    `tokens/brands/${brandName}/colors.json`,
    'tokens/semantic/theme-patterns.json'
  ];
  
  // Include typography if it exists
  const typographyPath = resolve(brandPath, 'typography.json');
  if (fs.existsSync(typographyPath)) {
    sources.push(`tokens/brands/${brandName}/typography.json`);
  }
  
  const baseConfig = {
    source: sources,
    platforms: {
      css: {
        buildPath: `build/brands/${brandName}/`,
        transforms: [`name/${brandName}-css`, 'color/css'],
        files: [{
          destination: 'colors.css',
          format: `css/${brandName}-variables`,
          filter: (token) => token.path[0] !== 'theme',
          options: {
            outputReferences: true
          }
        }]
      },
      js: {
        transformGroup: 'js',
        buildPath: `build/brands/${brandName}/`,
        files: [{
          destination: 'tokens.js',
          format: 'javascript/es6'
        }]
      },
      ts: {
        transformGroup: 'js',
        buildPath: `build/brands/${brandName}/`,
        files: [{
          destination: 'tokens.ts',
          format: 'typescript/es6-declarations'
        }]
      }
    }
  };

  // Build base tokens first
  const baseSd = new StyleDictionary(baseConfig);
  await baseSd.buildAllPlatforms();

  // Build light theme separately if it exists
  if (hasLightTheme) {
    const lightThemeConfig = {
      source: [
        `tokens/brands/${brandName}/colors.json`,
        `tokens/brands/${brandName}/theme-light.json`
      ],
      platforms: {
        css: {
          buildPath: `build/brands/${brandName}/`,
          transforms: [`name/${brandName}-css`, 'color/css'],
          files: [{
            destination: 'theme-light.css',
            format: `css/${brandName}-variables`,
            filter: (token) => token.path[0] === 'theme',
            options: {
              selector: '.theme-light',
              outputReferences: true
            }
          }]
        }
      }
    };
    const lightSd = new StyleDictionary(lightThemeConfig);
    await lightSd.buildAllPlatforms();
  }

  // Build dark theme separately if it exists
  if (hasDarkTheme) {
    const darkThemeConfig = {
      source: [
        `tokens/brands/${brandName}/colors.json`,
        `tokens/brands/${brandName}/theme-dark.json`
      ],
      platforms: {
        css: {
          buildPath: `build/brands/${brandName}/`,
          transforms: [`name/${brandName}-css`, 'color/css'],
          files: [{
            destination: 'theme-dark.css',
            format: `css/${brandName}-variables`,
            filter: (token) => token.path[0] === 'theme',
            options: {
              selector: '.theme-dark',
              outputReferences: true
            }
          }]
        }
      }
    };
    const darkSd = new StyleDictionary(darkThemeConfig);
    await darkSd.buildAllPlatforms();
  }

  // Build combined file with everything
  const allConfig = {
    source: [
      `tokens/brands/${brandName}/colors.json`,
      'tokens/semantic/theme-patterns.json',
      ...(fs.existsSync(typographyPath) ? [`tokens/brands/${brandName}/typography.json`] : []),
      ...(hasLightTheme ? [`tokens/brands/${brandName}/theme-light.json`] : []),
      ...(hasDarkTheme ? [`tokens/brands/${brandName}/theme-dark.json`] : [])
    ],
    platforms: {
      css: {
        buildPath: `build/brands/${brandName}/`,
        transforms: [`name/${brandName}-css`, 'color/css'],
        files: [{
          destination: 'all.css',
          format: `css/${brandName}-variables`,
          options: {
            outputReferences: true
          }
        }]
      }
    }
  };
  const allSd = new StyleDictionary(allConfig);
  
  if (isVerbose) {
    console.log(`📁 Sources: ${baseConfig.source.join(', ')}`);
    console.log(`📁 Output: build/brands/${brandName}/`);
  }

  try {
    await allSd.buildAllPlatforms();
    console.log(`✅ ${brandName} brand tokens built successfully!`);
    
    // Create brand info file
    const brandInfo = {
      name: brandName,
      hasLightTheme,
      hasDarkTheme,
      prefix: brandName,
      generatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
      resolve(__dirname, `build/brands/${brandName}/brand-info.json`),
      JSON.stringify(brandInfo, null, 2)
    );
    
  } catch (error) {
    console.error(`❌ Error building ${brandName} brand:`, error);
    return false; // Return false on error
  }
  
  return true; // Return true on success
}

// Build all brands
console.log('🏭 Building design tokens for multiple brands...');
console.log(`📦 Brands to build: ${availableBrands.join(', ')}`);

const results = [];
for (const brand of availableBrands) {
  const success = await buildBrand(brand);
  results.push({ brand, success });
}

const successCount = results.filter(r => r.success).length;
const failCount = results.filter(r => !r.success).length;

if (failCount === 0) {
  console.log('\n✨ All brand tokens built successfully!');
} else {
  console.log(`\n⚠️  Build completed with ${failCount} error(s):`);
  results.filter(r => !r.success).forEach(r => {
    console.log(`   - ${r.brand} failed to build`);
  });
  console.log(`\n✅ ${successCount} brand(s) built successfully`);
  process.exit(1);
}

// Create index file with all brand information
const brandIndex = availableBrands.map(brand => {
  const infoPath = resolve(__dirname, `build/brands/${brand}/brand-info.json`);
  if (fs.existsSync(infoPath)) {
    return JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
  }
  return { name: brand };
});

fs.mkdirSync(resolve(__dirname, 'build/brands'), { recursive: true });
fs.writeFileSync(
  resolve(__dirname, 'build/brands/index.json'),
  JSON.stringify({ brands: brandIndex }, null, 2)
);
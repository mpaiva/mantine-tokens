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
  
  // Register brand documentation format
  StyleDictionary.registerFormat({
    name: `markdown/${brandName}-docs`,
    format: ({ dictionary }) => {
      let md = `# ${brandName.charAt(0).toUpperCase() + brandName.slice(1)} Brand Token Documentation\n\n`;
      md += `This document contains all design tokens for the ${brandName} brand.\n\n`;
      md += `**Brand Prefix**: \`${brandName}\`\n\n`;
      
      // Add theme information
      if (hasLightTheme || hasDarkTheme) {
        md += '## Available Themes\n\n';
        if (hasLightTheme) md += '- ✅ Light Theme (`theme-light.css`)\n';
        if (hasDarkTheme) md += '- ✅ Dark Theme (`theme-dark.css`)\n';
        md += '\n';
      }
      
      md += '## Table of Contents\n\n';
      
      // Group tokens by category
      const categories = {};
      dictionary.allTokens.forEach(token => {
        const category = token.path[0];
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(token);
      });
      
      // Generate TOC
      Object.keys(categories).sort().forEach(category => {
        md += `- [${category.charAt(0).toUpperCase() + category.slice(1)}](#${category})\n`;
      });
      md += '\n---\n\n';
      
      // Generate sections for each category
      Object.keys(categories).sort().forEach(category => {
        md += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
        md += '| Token | Value | CSS Variable | Description |\n';
        md += '|-------|-------|--------------|-------------|\n';
        
        categories[category].forEach(token => {
          const name = token.path.slice(1).join('.');
          const value = token.$value || token.value;
          const cssVar = `--${brandName}-${token.path.join('-').toLowerCase()}`;
          const description = token.$description || token.comment || '';
          
          // Format value for display
          let displayValue = value;
          if (typeof value === 'object' && !Array.isArray(value)) {
            displayValue = JSON.stringify(value);
          } else if (Array.isArray(value)) {
            displayValue = '[shadow values]';
          }
          
          md += `| ${name} | \`${displayValue}\` | \`${cssVar}\` | ${description} |\n`;
        });
        
        md += '\n';
      });
      
      // Add usage examples
      md += '## Using Brand Tokens in CSS\n\n';
      md += `Brand tokens are available as CSS custom properties with the \`${brandName}\` prefix:\n\n`;
      md += '```css\n';
      md += `/* Using ${brandName} brand colors */\n`;
      md += `.my-element {\n`;
      md += `  color: var(--${brandName}-brand-primary);\n`;
      md += `  background-color: var(--${brandName}-brand-secondary);\n`;
      md += `}\n\n`;
      md += `/* Using ${brandName} theme tokens */\n`;
      md += `.theme-aware {\n`;
      md += `  background: var(--${brandName}-theme-surface-primary);\n`;
      md += `  color: var(--${brandName}-theme-content-primary);\n`;
      md += `  border-color: var(--${brandName}-theme-border-subtle);\n`;
      md += `}\n`;
      md += '```\n\n';
      
      // Add theme switching example
      if (hasLightTheme && hasDarkTheme) {
        md += '## Theme Switching\n\n';
        md += 'To switch between light and dark themes, add the appropriate class to your root element:\n\n';
        md += '```html\n';
        md += '<!-- Light theme -->\n';
        md += '<html class="theme-light">\n\n';
        md += '<!-- Dark theme -->\n';
        md += '<html class="theme-dark">\n';
        md += '```\n';
      }
      
      return md;
    }
  });
  
  // Build base configuration - include all JSON files in the brand folder
  const brandFiles = fs.readdirSync(brandPath)
    .filter(file => file.endsWith('.json') && file !== 'theme-light.json' && file !== 'theme-dark.json')
    .map(file => `tokens/brands/${brandName}/${file}`);
  
  const sources = [
    ...brandFiles,
    'tokens/semantic/theme-patterns.json'
  ];
  
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
      },
      docs: {
        buildPath: `build/brands/${brandName}/`,
        transforms: ['name/human'],
        files: [{
          destination: 'tokens.md',
          format: `markdown/${brandName}-docs`
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
        ...brandFiles,
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
        ...brandFiles,
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
      ...brandFiles,
      'tokens/semantic/theme-patterns.json',
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
    console.log(`📁 Sources: ${sources.join(', ')}`);
    console.log(`📁 Output: build/brands/${brandName}/`);
  }

  try {
    await allSd.buildAllPlatforms();
    
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
    
    console.log(`\n✅ ${brandName} brand tokens built successfully!`);
    console.log(`\n📁 Output files:`);
    console.log(`   - build/brands/${brandName}/colors.css        Brand colors`);
    if (hasLightTheme) {
      console.log(`   - build/brands/${brandName}/theme-light.css   Light theme`);
    }
    if (hasDarkTheme) {
      console.log(`   - build/brands/${brandName}/theme-dark.css    Dark theme`);
    }
    console.log(`   - build/brands/${brandName}/all.css           All tokens combined`);
    console.log(`   - build/brands/${brandName}/tokens.js         JavaScript tokens`);
    console.log(`   - build/brands/${brandName}/tokens.ts         TypeScript tokens`);
    console.log(`   - build/brands/${brandName}/tokens.md         Documentation\n`);
    
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
  console.log('\n📁 Brand outputs created in build/brands/');
  console.log('   Each brand folder contains:');
  console.log('   - CSS files (colors, themes, all combined)');
  console.log('   - JavaScript/TypeScript exports');
  console.log('   - Documentation (tokens.md)');
  console.log('   - Brand metadata (brand-info.json)\n');
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
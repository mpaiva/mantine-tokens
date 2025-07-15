// Standard build script - works with Node 18+
// This is the main build script without graph engine dependencies

// Polyfill for web streams if needed
import { TransformStream } from 'stream/web';
if (typeof globalThis.TransformStream === 'undefined') {
  globalThis.TransformStream = TransformStream;
}

import StyleDictionary from 'style-dictionary';
import { promises as fs, watch } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check for flags
const isVerbose = process.argv.includes('--verbose');
const isWatchMode = process.argv.includes('--watch');

// Read prefix configuration
async function getPrefix() {
  try {
    const prefixPath = path.join(__dirname, 'tokens', '_prefix.json');
    const prefixContent = await fs.readFile(prefixPath, 'utf8');
    const prefixData = JSON.parse(prefixContent);
    return prefixData.prefix || 'mantine';
  } catch (error) {
    console.warn('Warning: Could not read prefix from _prefix.json, using default "mantine"');
    return 'mantine';
  }
}

// Custom logging function
function log(...args) {
  if (isVerbose) {
    console.log(...args);
  }
}

// Store prefix globally for transforms to use
let globalPrefix = 'mantine';

// Register custom transform for CSS variables with dynamic prefix
StyleDictionary.registerTransform({
  name: 'name/prefix-css',
  type: 'name',
  transform: (token) => {
    // Convert token path to CSS variable with dynamic prefix
    const name = token.path.join('-').toLowerCase();
    return `${globalPrefix}-${name}`;
  }
});

// Register custom format for CSS with proper CSS custom properties
StyleDictionary.registerFormat({
  name: 'css/prefix-variables',
  format: ({ dictionary, options }) => {
    const selector = options.selector || ':root';
    
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
      if (options.outputReferences && typeof token.original.$value === 'string' && token.original.$value.includes('{')) {
        // Extract the reference path and convert to CSS variable
        const refMatch = token.original.$value.match(/\{([^}]+)\}/);
        if (refMatch) {
          const refPath = refMatch[1];
          const refName = refPath.split('.').join('-').toLowerCase();
          value = `var(--${globalPrefix}-${refName})`;
        }
      }
      
      css += `  --${token.name}: ${value};\n`;
    });
    
    css += '}\n';
    return css;
  }
});

// Register format for SCSS variables
StyleDictionary.registerFormat({
  name: 'scss/prefix-variables',
  format: ({ dictionary }) => {
    let scss = '';
    
    dictionary.allTokens.forEach(token => {
      scss += `$${token.name}: ${token.$value || token.value};\n`;
    });
    
    return scss;
  }
});

// Register format for TypeScript
StyleDictionary.registerFormat({
  name: 'typescript/prefix-tokens',
  format: ({ dictionary }) => {
    const tokens = {};
    
    dictionary.allTokens.forEach(token => {
      const path = token.path.join('.');
      tokens[path] = token.$value || token.value;
    });
    
    const varName = `${globalPrefix}Tokens`;
    const typeName = `${globalPrefix.charAt(0).toUpperCase() + globalPrefix.slice(1)}Token`;
    
    return `export const ${varName} = ${JSON.stringify(tokens, null, 2)} as const;\n\nexport type ${typeName} = keyof typeof ${varName};\n`;
  }
});

// Register format for documentation
StyleDictionary.registerFormat({
  name: 'markdown/token-docs',
  format: ({ dictionary }) => {
    let md = '# Design Token Documentation\n\n';
    md += '> 📚 **For non-technical users**: See our [Quick Start Guide](../docs/QUICK_START_GUIDE.md) and [Non-Technical Guide](../docs/NON_TECHNICAL_GUIDE.md)\n\n';
    md += 'This document contains all design tokens used in the design system.\n\n';
    md += `**Current Prefix**: \`${globalPrefix}\`\n\n`;
    md += '## Table of Contents\n\n';
    
    // First, organize tokens by category
    const categories = {};
    const categoryOrder = ['color', 'spacing', 'typography', 'shadow', 'radius', 'theme', 'semantic'];
    
    dictionary.allTokens.forEach(token => {
      const category = token.path[0];
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(token);
    });
    
    // Generate table of contents
    categoryOrder.forEach(cat => {
      if (categories[cat]) {
        const displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
        md += `- [${displayName}](#${cat})\n`;
      }
    });
    
    // Add remaining categories not in order
    Object.keys(categories).forEach(cat => {
      if (!categoryOrder.includes(cat)) {
        const displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
        md += `- [${displayName}](#${cat})\n`;
      }
    });
    
    md += '\n---\n\n';
    
    // Process categories in order
    const processedCategories = new Set();
    
    // Colors section with visual representation
    if (categories.color) {
      processedCategories.add('color');
      md += '## Color\n\n';
      md += '### Color Palette\n\n';
      md += 'Our color system includes primary colors, neutrals, and semantic colors for different UI states.\n\n';
      
      // Group colors by type
      const colorGroups = {
        base: [],
        gray: [],
        dark: [],
        primary: [],
        semantic: [],
        other: []
      };
      
      categories.color.forEach(token => {
        const name = token.path.slice(1).join('.');
        if (name === 'white' || name === 'black') {
          colorGroups.base.push(token);
        } else if (name.startsWith('gray.')) {
          colorGroups.gray.push(token);
        } else if (name.startsWith('dark.')) {
          colorGroups.dark.push(token);
        } else if (name.startsWith('blue.') || name.startsWith('primary')) {
          colorGroups.primary.push(token);
        } else if (name.includes('success') || name.includes('error') || name.includes('warning') || name.includes('info')) {
          colorGroups.semantic.push(token);
        } else {
          colorGroups.other.push(token);
        }
      });
      
      // Base colors
      if (colorGroups.base.length > 0) {
        md += '#### Base Colors\n\n';
        md += '| Token | Value | CSS Variable | Visual | Description |\n';
        md += '|-------|-------|--------------|--------|-------------|\n';
        colorGroups.base.forEach(token => {
          const name = token.path.slice(1).join('.');
          const value = token.$value || token.value;
          const cssVar = `--${globalPrefix}-${token.path.join('-').toLowerCase()}`;
          const description = token.$description || token.comment || 'Base color';
          const visual = value.startsWith('#') ? `![${name}](https://via.placeholder.com/60x20/${value.slice(1)}/${value.slice(1)}.png)` : '-';
          md += `| ${name} | \`${value}\` | \`${cssVar}\` | ${visual} | ${description} |\n`;
        });
        md += '\n';
      }
      
      // Gray scale
      if (colorGroups.gray.length > 0) {
        md += '#### Gray Scale\n\n';
        md += 'Neutral colors for text, borders, and backgrounds.\n\n';
        md += '| Token | Value | CSS Variable | Visual | Use Case |\n';
        md += '|-------|-------|--------------|--------|----------|\n';
        colorGroups.gray.sort((a, b) => {
          const aNum = parseInt(a.path[a.path.length - 1]);
          const bNum = parseInt(b.path[b.path.length - 1]);
          return aNum - bNum;
        }).forEach(token => {
          const name = token.path.slice(1).join('.');
          const value = token.$value || token.value;
          const cssVar = `--${globalPrefix}-${token.path.join('-').toLowerCase()}`;
          const shade = token.path[token.path.length - 1];
          const visual = value.startsWith('#') ? `![${name}](https://via.placeholder.com/60x20/${value.slice(1)}/${value.slice(1)}.png)` : '-';
          const useCase = {
            '50': 'Subtle backgrounds',
            '100': 'Light backgrounds',
            '200': 'Dividers',
            '300': 'Borders',
            '400': 'Disabled text',
            '500': 'Placeholder text',
            '600': 'Secondary text',
            '700': 'Primary text',
            '800': 'Headings',
            '900': 'Maximum contrast'
          }[shade] || token.$description || '-';
          md += `| ${name} | \`${value}\` | \`${cssVar}\` | ${visual} | ${useCase} |\n`;
        });
        md += '\n';
      }
      
      // Other color sections similar format...
      md += '\n';
    }
    
    // Spacing section with visual blocks
    if (categories.spacing) {
      processedCategories.add('spacing');
      md += '## Spacing\n\n';
      md += 'Consistent spacing scale for margins, padding, and gaps.\n\n';
      md += '| Token | Value | Visual | Common Usage |\n';
      md += '|-------|-------|--------|---------------|\n';
      
      const spacingOrder = ['0', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
      const sortedSpacing = categories.spacing.sort((a, b) => {
        const aIndex = spacingOrder.indexOf(a.path[1]);
        const bIndex = spacingOrder.indexOf(b.path[1]);
        return aIndex - bIndex;
      });
      
      sortedSpacing.forEach(token => {
        const name = token.path.slice(1).join('.');
        const value = token.$value || token.value;
        const description = token.$description || '';
        const pixels = value.includes('rem') ? `(${parseFloat(value) * 16}px)` : '';
        
        // Create visual representation
        const visualSize = {
          '0': '',
          'xs': '▪',
          'sm': '▪▪',
          'md': '▪▪▪▪',
          'lg': '▪▪▪▪▪▪',
          'xl': '▪▪▪▪▪▪▪▪▪▪',
          '2xl': '▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪',
          '3xl': '▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪'
        }[name] || '▪'.repeat(Math.min(parseFloat(value) || 1, 20));
        
        const usage = {
          '0': 'No spacing',
          'xs': 'Tight elements, icon padding',
          'sm': 'Form inputs, small gaps',
          'md': 'Default spacing between elements',
          'lg': 'Card padding, section spacing',
          'xl': 'Major sections',
          '2xl': 'Large section breaks',
          '3xl': 'Page-level spacing'
        }[name] || description || '-';
        
        md += `| ${name} | \`${value}\` ${pixels} | ${visualSize} | ${usage} |\n`;
      });
      md += '\n';
    }
    
    // Typography section
    if (categories.typography) {
      processedCategories.add('typography');
      md += '## Typography\n\n';
      md += 'Font families, sizes, weights, and other text properties.\n\n';
      
      // Group typography tokens
      const typographyGroups = {
        fontFamily: [],
        fontSize: [],
        fontWeight: [],
        lineHeight: [],
        letterSpacing: []
      };
      
      categories.typography.forEach(token => {
        const subCategory = token.path[1];
        if (typographyGroups[subCategory]) {
          typographyGroups[subCategory].push(token);
        }
      });
      
      // Font families
      if (typographyGroups.fontFamily.length > 0) {
        md += '### Font Families\n\n';
        md += '| Token | Value | Usage |\n';
        md += '|-------|-------|-------|\n';
        typographyGroups.fontFamily.forEach(token => {
          const name = token.path.slice(2).join('.');
          const value = token.$value || token.value;
          const usage = {
            'sans': 'Body text, UI elements',
            'mono': 'Code, data',
            'heading': 'Headings, emphasis'
          }[name] || token.$description || '-';
          md += `| ${name} | \`${value}\` | ${usage} |\n`;
        });
        md += '\n';
      }
      
      // Font sizes
      if (typographyGroups.fontSize.length > 0) {
        md += '### Font Sizes\n\n';
        md += '| Token | Value | Pixels | Usage |\n';
        md += '|-------|-------|--------|-------|\n';
        typographyGroups.fontSize.forEach(token => {
          const name = token.path.slice(2).join('.');
          const value = token.$value || token.value;
          const pixels = value.includes('rem') ? `${parseFloat(value) * 16}px` : value;
          const usage = {
            'xs': 'Captions, labels',
            'sm': 'Secondary text',
            'md': 'Body text',
            'lg': 'Lead paragraphs',
            'xl': 'Small headings',
            'h1': 'Page titles',
            'h2': 'Section headings',
            'h3': 'Subsection headings',
            'h4': 'Card titles',
            'h5': 'Small headings',
            'h6': 'Overlines'
          }[name] || token.$description || '-';
          md += `| ${name} | \`${value}\` | ${pixels} | ${usage} |\n`;
        });
        md += '\n';
      }
    }
    
    // Process remaining categories
    Object.entries(categories).forEach(([category, tokens]) => {
      if (!processedCategories.has(category)) {
        md += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
        md += '| Token | Value | Description |\n';
        md += '|-------|-------|-------------|\n';
        
        tokens.forEach(token => {
          const name = token.path.slice(1).join('.');
          const value = token.$value || token.value;
          const description = token.$description || token.comment || '-';
          md += `| ${name} | \`${value}\` | ${description} |\n`;
        });
        
        md += '\n';
      }
    });
    
    // Add footer
    md += '---\n\n';
    
    // Add CSS usage examples
    md += '## Using Tokens in CSS\n\n';
    md += 'All tokens are available as CSS custom properties (CSS variables) with the prefix `' + globalPrefix + '`:\n\n';
    md += '```css\n';
    md += '/* Using color tokens */\n';
    md += `.my-element {\n`;
    md += `  color: var(--${globalPrefix}-color-gray-700);\n`;
    md += `  background-color: var(--${globalPrefix}-color-gray-50);\n`;
    md += `  border: 1px solid var(--${globalPrefix}-color-gray-300);\n`;
    md += `}\n\n`;
    md += '/* Using spacing tokens */\n';
    md += `.my-component {\n`;
    md += `  padding: var(--${globalPrefix}-spacing-md);\n`;
    md += `  margin-bottom: var(--${globalPrefix}-spacing-lg);\n`;
    md += `  gap: var(--${globalPrefix}-spacing-sm);\n`;
    md += `}\n\n`;
    md += '/* Using typography tokens */\n';
    md += `.my-text {\n`;
    md += `  font-family: var(--${globalPrefix}-typography-fontfamily-sans);\n`;
    md += `  font-size: var(--${globalPrefix}-typography-fontsize-md);\n`;
    md += `  font-weight: var(--${globalPrefix}-typography-fontweight-semibold);\n`;
    md += `  line-height: var(--${globalPrefix}-typography-lineheight-normal);\n`;
    md += `}\n\n`;
    md += '/* Using radius tokens */\n';
    md += `.my-card {\n`;
    md += `  border-radius: var(--${globalPrefix}-radius-md);\n`;
    md += `}\n`;
    md += '```\n\n';
    
    md += '## How to Use This Documentation\n\n';
    md += '1. **Find tokens by category** - Use the table of contents above\n';
    md += '2. **Search for specific values** - Use Ctrl+F (Cmd+F on Mac) to search\n';
    md += '3. **Copy CSS variables** - Use the CSS Variable column for easy copying\n';
    md += '4. **Understand the values** - Check the description and usage columns\n';
    md += '5. **Request changes** - See our [contribution guide](../../CONTRIBUTING.md)\n\n';
    md += '📖 For more help, see our [Non-Technical Guide](../docs/NON_TECHNICAL_GUIDE.md)\n';
    
    return md;
  }
});

// Register DTCG-compliant JSON format
StyleDictionary.registerFormat({
  name: 'json/dtcg',
  format: ({ dictionary, file }) => {
    // Build the token tree structure preserving DTCG format
    const buildTokenTree = (tokens) => {
      const tree = {};
      const groupDescriptions = new Map();
      
      // First pass: collect group descriptions from the original structure
      tokens.forEach(token => {
        if (token.original && token.original.$description) {
          // Store the description for the parent path
          const parentPath = token.path.slice(0, -1).join('.');
          if (parentPath && !groupDescriptions.has(parentPath)) {
            groupDescriptions.set(parentPath, token.original.$description);
          }
        }
      });
      
      // Second pass: build the tree
      tokens.forEach(token => {
        let current = tree;
        
        // Navigate/create the path
        token.path.forEach((segment, index) => {
          if (index === token.path.length - 1) {
            // Last segment - add the token
            current[segment] = {
              $value: token.$value || token.value,
              $type: token.$type || token.type
            };
            
            // Add optional properties if they exist
            if (token.$description || token.comment) {
              current[segment].$description = token.$description || token.comment;
            }
            if (token.$extensions) {
              current[segment].$extensions = token.$extensions;
            }
            if (token.deprecated || token.$deprecated) {
              current[segment].$deprecated = token.deprecated || token.$deprecated;
            }
          } else {
            // Create group if it doesn't exist
            if (!current[segment]) {
              current[segment] = {};
              
              // Add group description if we have one
              const currentPath = token.path.slice(0, index + 1).join('.');
              if (groupDescriptions.has(currentPath)) {
                current[segment].$description = groupDescriptions.get(currentPath);
              }
            }
            current = current[segment];
          }
        });
      });
      
      return tree;
    };
    
    const tokenTree = buildTokenTree(dictionary.allTokens);
    return JSON.stringify(tokenTree, null, 2);
  }
});

async function build() {
  // Get the prefix first
  globalPrefix = await getPrefix();
  console.log(`🎨 Building design tokens with prefix: ${globalPrefix}...\n`);

  try {
    // Ensure build directory exists
    await fs.mkdir(path.join(__dirname, 'build'), { recursive: true });

    // Build configuration for primitives and components
    const baseConfig = {
      source: [
        'tokens/primitives/*-dtcg.json',
        'tokens/components/*-dtcg.json'
      ],
      platforms: {
        css: {
          buildPath: 'build/css/',
          transforms: ['name/prefix-css', 'color/css'],
          files: [{
            destination: 'variables.css',
            format: 'css/prefix-variables',
            options: {
              outputReferences: true
            }
          }]
        },
        scss: {
          buildPath: 'build/scss/',
          transforms: ['name/prefix-css', 'color/css'],
          files: [{
            destination: 'variables.scss',
            format: 'scss/prefix-variables'
          }]
        },
        js: {
          buildPath: 'build/js/',
          transforms: ['name/camel', 'color/hex'],
          files: [{
            destination: 'tokens.js',
            format: 'javascript/es6'
          }]
        },
        ts: {
          buildPath: 'build/ts/',
          transforms: ['name/camel', 'color/hex'],
          files: [{
            destination: 'tokens.ts',
            format: 'typescript/prefix-tokens'
          }]
        },
        json: {
          buildPath: 'build/json/',
          transforms: ['name/camel', 'color/hex'],
          files: [{
            destination: `${globalPrefix}.tokens.json`,
            format: 'json/dtcg'
          }]
        },
        docs: {
          buildPath: 'build/docs/',
          transforms: ['name/human'],
          files: [{
            destination: 'tokens.md',
            format: 'markdown/token-docs'
          }]
        }
      },
      log: {
        verbosity: isVerbose ? 'verbose' : 'default'
      }
    };

    // Build light theme configuration
    const lightThemeConfig = {
      source: [
        'tokens/primitives/*-dtcg.json',
        'tokens/semantic/light-theme-dtcg.json'
      ],
      platforms: {
        css: {
          buildPath: 'build/css/',
          transforms: ['name/prefix-css', 'color/css'],
          files: [{
            destination: 'theme-light.css',
            format: 'css/prefix-variables',
            options: {
              selector: '[data-mantine-color-scheme="light"]',
              outputReferences: true
            },
            filter: (token) => token.filePath.includes('semantic/light-theme')
          }]
        }
      },
      log: {
        verbosity: isVerbose ? 'verbose' : 'default'
      }
    };

    // Build dark theme configuration
    const darkThemeConfig = {
      source: [
        'tokens/primitives/*-dtcg.json',
        'tokens/semantic/dark-theme-dtcg.json'
      ],
      platforms: {
        css: {
          buildPath: 'build/css/',
          transforms: ['name/prefix-css', 'color/css'],
          files: [{
            destination: 'theme-dark.css',
            format: 'css/prefix-variables',
            options: {
              selector: '[data-mantine-color-scheme="dark"]',
              outputReferences: true
            },
            filter: (token) => token.filePath.includes('semantic/dark-theme')
          }]
        }
      },
      log: {
        verbosity: isVerbose ? 'verbose' : 'default'
      }
    };

    // Build base tokens
    console.log('Building base tokens...');
    const sd = new StyleDictionary(baseConfig);
    await sd.buildAllPlatforms();

    // Build light theme
    console.log('Building light theme...');
    const sdLight = new StyleDictionary(lightThemeConfig);
    await sdLight.buildAllPlatforms();

    // Build dark theme
    console.log('Building dark theme...');
    const sdDark = new StyleDictionary(darkThemeConfig);
    await sdDark.buildAllPlatforms();

    console.log('\n✅ Build completed successfully!');
    console.log('\n📁 Output files:');
    console.log('   - build/css/       CSS variables & theme files');
    console.log('   - build/scss/      SCSS variables');
    console.log('   - build/js/        JavaScript tokens');
    console.log('   - build/ts/        TypeScript tokens');
    console.log('   - build/json/      JSON tokens');
    console.log('   - build/docs/      Documentation\n');

  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    if (isVerbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Watch mode functionality
function watchTokens() {
  const tokensDir = path.join(__dirname, 'tokens');
  
  console.log('👀 Watching for token changes...\n');
  
  // Simple debounce to avoid multiple rebuilds
  let timeout;
  const rebuild = async () => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      console.log('🔄 Rebuilding tokens...\n');
      try {
        await build();
      } catch (error) {
        console.error('❌ Build failed:', error.message);
      }
    }, 100);
  };
  
  const watcher = watch(tokensDir, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.json')) {
      console.log(`\n📝 Detected ${eventType} in ${filename}`);
      rebuild();
    }
  });
  
  // Handle exit
  process.on('SIGINT', () => {
    console.log('\n\n👋 Stopping watch mode...');
    watcher.close();
    process.exit(0);
  });
}

// Run build
if (isWatchMode) {
  build().then(() => {
    watchTokens();
  }).catch(error => {
    console.error('Initial build failed:', error);
    process.exit(1);
  });
} else {
  build();
}
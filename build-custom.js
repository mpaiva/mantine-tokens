// Custom build script - builds custom tokens with custom prefix
// This script is based on build-standard.js but reads custom tokens

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

// Read custom prefix configuration
async function getCustomPrefix() {
  try {
    const prefixPath = path.join(__dirname, 'tokens', '_custom-prefix.json');
    const prefixContent = await fs.readFile(prefixPath, 'utf8');
    const prefixData = JSON.parse(prefixContent);
    return prefixData.prefix || 'custom';
  } catch (error) {
    console.warn('Warning: Could not read prefix from _custom-prefix.json, using default "custom"');
    return 'custom';
  }
}

// Custom logging function
function log(...args) {
  if (isVerbose) {
    console.log(...args);
  }
}

// Store prefix globally for transforms to use
let globalPrefix = 'custom';

// Register custom transform for CSS variables with dynamic prefix
StyleDictionary.registerTransform({
  name: 'name/custom-prefix-css',
  type: 'name',
  transform: (token) => {
    // Convert token path to CSS variable with dynamic prefix
    const name = token.path.join('-').toLowerCase();
    return `${globalPrefix}-${name}`;
  }
});

// Register custom format for CSS with proper CSS custom properties
StyleDictionary.registerFormat({
  name: 'css/custom-prefix-variables',
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
  name: 'scss/custom-prefix-variables',
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
  name: 'typescript/custom-prefix-tokens',
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
  name: 'markdown/custom-token-docs',
  format: ({ dictionary }) => {
    let md = '# Custom Design Token Documentation\n\n';
    md += 'This document contains all custom design tokens used in addition to the base Mantine tokens.\n\n';
    md += `**Current Prefix**: \`${globalPrefix}\`\n\n`;
    md += '## Table of Contents\n\n';
    
    // First, organize tokens by category
    const categories = {};
    const categoryOrder = ['brand', 'spacing', 'typography', 'shadow', 'radius'];
    
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
    
    // Process each category
    Object.entries(categories).forEach(([category, tokens]) => {
      md += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
      
      if (category === 'brand') {
        md += 'Custom brand colors that extend the base color palette.\n\n';
        md += '| Token | Value | CSS Variable | Visual | Description |\n';
        md += '|-------|-------|--------------|--------|-------------|\n';
        tokens.forEach(token => {
          const name = token.path.slice(1).join('.');
          const value = token.$value || token.value;
          const cssVar = `--${globalPrefix}-${token.path.join('-').toLowerCase()}`;
          const description = token.$description || token.comment || '-';
          const visual = value.startsWith('#') ? `![${name}](https://via.placeholder.com/60x20/${value.slice(1)}/${value.slice(1)}.png)` : '-';
          md += `| ${name} | \`${value}\` | \`${cssVar}\` | ${visual} | ${description} |\n`;
        });
      } else {
        md += '| Token | Value | CSS Variable | Description |\n';
        md += '|-------|-------|--------------|-------------|\n';
        tokens.forEach(token => {
          const name = token.path.slice(1).join('.');
          const value = token.$value || token.value;
          const cssVar = `--${globalPrefix}-${token.path.join('-').toLowerCase()}`;
          const description = token.$description || token.comment || '-';
          md += `| ${name} | \`${value}\` | \`${cssVar}\` | ${description} |\n`;
        });
      }
      
      md += '\n';
    });
    
    // Add footer
    md += '---\n\n';
    
    // Add CSS usage examples
    md += '## Using Custom Tokens in CSS\n\n';
    md += `Custom tokens are available as CSS custom properties with the prefix \`${globalPrefix}\`:\n\n`;
    md += '```css\n';
    md += '/* Using custom brand colors */\n';
    md += `.my-brand-element {\n`;
    md += `  color: var(--${globalPrefix}-brand-primary);\n`;
    md += `  background-color: var(--${globalPrefix}-brand-secondary);\n`;
    md += `}\n\n`;
    md += '/* Using custom spacing */\n';
    md += `.my-section {\n`;
    md += `  padding: var(--${globalPrefix}-spacing-section);\n`;
    md += `  margin-bottom: var(--${globalPrefix}-spacing-page);\n`;
    md += `}\n\n`;
    md += '/* Using custom typography */\n';
    md += `.my-heading {\n`;
    md += `  font-family: var(--${globalPrefix}-typography-fontfamily-display);\n`;
    md += `  font-size: var(--${globalPrefix}-typography-fontsize-jumbo);\n`;
    md += `  line-height: var(--${globalPrefix}-typography-lineheight-compact);\n`;
    md += `}\n`;
    md += '```\n\n';
    
    md += '## Combining with Mantine Tokens\n\n';
    md += 'You can use both Mantine and custom tokens together:\n\n';
    md += '```css\n';
    md += `.hybrid-component {\n`;
    md += `  /* Mantine tokens */\n`;
    md += `  padding: var(--mantine-spacing-md);\n`;
    md += `  border-radius: var(--mantine-radius-sm);\n`;
    md += `  \n`;
    md += `  /* Custom tokens */\n`;
    md += `  background-color: var(--${globalPrefix}-brand-primary);\n`;
    md += `  font-family: var(--${globalPrefix}-typography-fontfamily-brand);\n`;
    md += `}\n`;
    md += '```\n';
    
    return md;
  }
});

// Register DTCG-compliant JSON format
StyleDictionary.registerFormat({
  name: 'json/custom-dtcg',
  format: ({ dictionary, file }) => {
    // Build the token tree structure preserving DTCG format
    const buildTokenTree = (tokens) => {
      const tree = {};
      const groupDescriptions = new Map();
      
      // First pass: collect group descriptions from the original structure
      tokens.forEach(token => {
        if (token.original && token.original.$description) {
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
  // Get the custom prefix first
  globalPrefix = await getCustomPrefix();
  console.log(`🎨 Building custom design tokens with prefix: ${globalPrefix}...\n`);

  try {
    // Ensure build directory exists
    // Ensure build directories exist
    const buildDir = path.join(__dirname, 'build');
    const customBuildDir = path.join(__dirname, 'build', 'custom');
    
    await fs.mkdir(buildDir, { recursive: true });
    await fs.mkdir(customBuildDir, { recursive: true });
    
    // Double-check directory exists before proceeding
    try {
      await fs.access(customBuildDir);
    } catch {
      console.error('Failed to create build/custom directory');
      throw new Error('Could not create build directory');
    }

    // Build configuration for custom tokens
    const customConfig = {
      source: [
        'tokens/custom/*.json'
      ],
      platforms: {
        css: {
          buildPath: 'build/custom/',
          transforms: ['name/custom-prefix-css', 'color/css'],
          files: [{
            destination: 'variables.css',
            format: 'css/custom-prefix-variables',
            options: {
              outputReferences: true
            }
          }]
        },
        scss: {
          buildPath: 'build/custom/',
          transforms: ['name/custom-prefix-css', 'color/css'],
          files: [{
            destination: 'variables.scss',
            format: 'scss/custom-prefix-variables'
          }]
        },
        js: {
          buildPath: 'build/custom/',
          transforms: ['name/camel', 'color/hex'],
          files: [{
            destination: 'tokens.js',
            format: 'javascript/es6'
          }]
        },
        ts: {
          buildPath: 'build/custom/',
          transforms: ['name/camel', 'color/hex'],
          files: [{
            destination: 'tokens.ts',
            format: 'typescript/custom-prefix-tokens'
          }]
        },
        json: {
          buildPath: 'build/json/',
          transforms: ['name/camel', 'color/hex'],
          files: [{
            destination: `mantine.custom.tokens.json`,
            format: 'json/custom-dtcg'
          }]
        },
        docs: {
          buildPath: 'build/custom/',
          transforms: ['name/human'],
          files: [{
            destination: 'tokens.md',
            format: 'markdown/custom-token-docs'
          }]
        }
      },
      log: {
        verbosity: isVerbose ? 'verbose' : 'default'
      }
    };

    // Build custom tokens
    console.log('Building custom tokens...');
    const sd = new StyleDictionary(customConfig);
    await sd.buildAllPlatforms();

    console.log('\n✅ Custom token build completed successfully!');
    console.log('\n📁 Output files:');
    console.log('   - build/custom/variables.css    CSS variables');
    console.log('   - build/custom/variables.scss   SCSS variables');
    console.log('   - build/custom/tokens.js        JavaScript tokens');
    console.log('   - build/custom/tokens.ts        TypeScript tokens');
    console.log('   - build/custom/*.tokens.json    JSON tokens');
    console.log('   - build/custom/tokens.md        Documentation\n');

  } catch (error) {
    console.error('\n❌ Custom build failed:', error.message);
    if (isVerbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Watch mode functionality
function watchTokens() {
  const tokensDir = path.join(__dirname, 'tokens', 'custom');
  
  console.log('👀 Watching for custom token changes...\n');
  
  // Simple debounce to avoid multiple rebuilds
  let timeout;
  const rebuild = async () => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      console.log('🔄 Rebuilding custom tokens...\n');
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
  
  // Also watch the custom prefix file
  const prefixWatcher = watch(path.join(__dirname, 'tokens', '_custom-prefix.json'), (eventType) => {
    console.log(`\n📝 Detected ${eventType} in _custom-prefix.json`);
    rebuild();
  });
  
  // Handle exit
  process.on('SIGINT', () => {
    console.log('\n\n👋 Stopping watch mode...');
    watcher.close();
    prefixWatcher.close();
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
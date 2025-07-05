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
    let md = '# Mantine Design Tokens\n\n';
    md += 'This document contains all design tokens used in the Mantine theme.\n\n';
    
    const categories = {};
    dictionary.allTokens.forEach(token => {
      const category = token.path[0];
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(token);
    });
    
    Object.entries(categories).forEach(([category, tokens]) => {
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
    });
    
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
      
      // Add top-level descriptions from source files if available
      if (dictionary.tokens?.color?.$description && tree.color) {
        tree.color.$description = dictionary.tokens.color.$description;
      }
      if (dictionary.tokens?.spacing?.$description && tree.spacing) {
        tree.spacing.$description = dictionary.tokens.spacing.$description;
      }
      if (dictionary.tokens?.typography?.$description && tree.typography) {
        tree.typography.$description = dictionary.tokens.typography.$description;
      }
      if (dictionary.tokens?.radius?.$description && tree.radius) {
        tree.radius.$description = dictionary.tokens.radius.$description;
      }
      if (dictionary.tokens?.shadow?.$description && tree.shadow) {
        tree.shadow.$description = dictionary.tokens.shadow.$description;
      }
      if (dictionary.tokens?.button?.$description && tree.button) {
        tree.button.$description = dictionary.tokens.button.$description;
      }
      if (dictionary.tokens?.card?.$description && tree.card) {
        tree.card.$description = dictionary.tokens.card.$description;
      }
      
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
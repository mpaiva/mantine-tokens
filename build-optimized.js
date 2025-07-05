import StyleDictionary from 'style-dictionary';
import { fileHeader, formattedVariables } from 'style-dictionary/utils';

const VERBOSE = process.argv.includes('--verbose');

function log(...args) {
  if (VERBOSE) console.log(...args);
}

// Initialize Style Dictionary with optimized configuration
const sd = new StyleDictionary({
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      prefix: 'mantine',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          filter: (token) => !token.filePath.includes('semantic/dark'),
          options: {
            outputReferences: true,
            selector: ':root',
            formatting: {
              fileHeaderTimestamp: true,
            },
          },
        },
        {
          destination: 'dark-theme.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('semantic/dark'),
          options: {
            outputReferences: true,
            selector: '[data-mantine-color-scheme="dark"]',
          },
        },
      ],
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/scss/',
      prefix: 'mantine',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
          options: { outputReferences: true },
        },
        {
          destination: '_mixins.scss',
          format: 'scss/map-deep',
          options: { 
            mapName: 'mantine-tokens',
            outputReferences: true,
          },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
        {
          destination: 'tokens.mjs',
          format: 'javascript/module-flat',
        },
      ],
    },
    json: {
      transformGroup: 'web',
      buildPath: 'build/json/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/nested',
        },
        {
          destination: 'tokens-flat.json',
          format: 'json/flat',
        },
      ],
    },
  },
});

// Register custom transform for Mantine naming convention
sd.registerTransform({
  name: 'name/mantine/kebab',
  type: 'name',
  filter: (token) => token.path[0] !== 'prefix',
  transform: (token, options) => {
    const prefix = options.prefix || 'mantine';
    
    // Special handling for semantic tokens
    if (token.path[0] === 'semantic') {
      return `${prefix}-${token.path.slice(1).join('-')}`;
    }
    
    // Component tokens
    if (token.path[0] === 'button' || token.path[0] === 'input') {
      return `${prefix}-${token.path.join('-')}`;
    }
    
    // Default naming
    return `${prefix}-${token.path.join('-')}`;
  },
});

// Custom format for TypeScript const assertions
sd.registerFormat({
  name: 'typescript/theme-contract',
  format: async ({ dictionary, file, options }) => {
    const header = await fileHeader({ file });
    const tokens = dictionary.allTokens;
    
    let output = header;
    output += `export const tokens = {\n`;
    
    tokens.forEach((token) => {
      const cssVar = `--${token.name}`;
      output += `  '${token.path.join('.')}': 'var(${cssVar})',\n`;
    });
    
    output += '} as const;\n\n';
    output += 'export type TokenPath = keyof typeof tokens;\n';
    
    return output;
  },
});

// Custom format for documentation
sd.registerFormat({
  name: 'markdown/documentation',
  format: async ({ dictionary }) => {
    let output = '# Design Tokens Reference\n\n';
    
    const tokensByCategory = {};
    dictionary.allTokens.forEach((token) => {
      const category = token.path[0];
      if (!tokensByCategory[category]) {
        tokensByCategory[category] = [];
      }
      tokensByCategory[category].push(token);
    });
    
    Object.entries(tokensByCategory).forEach(([category, tokens]) => {
      output += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
      output += '| Token | Value | Description |\n';
      output += '|-------|--------|-------------|\n';
      
      tokens.forEach((token) => {
        const name = token.path.join('.');
        const value = token.$value || token.value;
        const desc = token.$description || token.description || '';
        output += `| \`${name}\` | \`${value}\` | ${desc} |\n`;
      });
      
      output += '\n';
    });
    
    return output;
  },
});

// Add documentation platform
sd.platforms.docs = {
  transformGroup: 'js',
  buildPath: 'build/docs/',
  files: [
    {
      destination: 'tokens.md',
      format: 'markdown/documentation',
    },
  ],
};

// Override transform groups for better organization
sd.registerTransformGroup({
  name: 'css',
  transforms: [
    'attribute/cti',
    'name/mantine/kebab',
    'time/seconds',
    'color/css',
    'size/rem',
  ],
});

sd.registerTransformGroup({
  name: 'scss',
  transforms: [
    'attribute/cti',
    'name/mantine/kebab',
    'time/seconds',
    'color/css',
    'size/rem',
  ],
});

// Build function with error handling
async function build() {
  console.log('\n🚀 Building Mantine design tokens...\n');
  
  try {
    await sd.buildAllPlatforms();
    
    console.log('✅ Build completed successfully!\n');
    console.log('📁 Output files:');
    console.log('  - build/css/variables.css');
    console.log('  - build/css/dark-theme.css');
    console.log('  - build/scss/_variables.scss');
    console.log('  - build/js/tokens.js');
    console.log('  - build/json/tokens.json');
    console.log('  - build/docs/tokens.md');
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    if (VERBOSE) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Execute build
build();
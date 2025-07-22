import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Token transformation pipeline
class TokenTransformer {
  constructor() {
    this.transforms = new Map();
    this.filters = [];
  }

  // Register a transformation
  addTransform(name, transform) {
    this.transforms.set(name, transform);
    return this;
  }

  // Add a filter
  addFilter(filter) {
    this.filters.push(filter);
    return this;
  }

  // Apply all transformations
  async transform(tokens, context = {}) {
    let result = { ...tokens };

    // Apply filters first
    for (const filter of this.filters) {
      result = await this.applyFilter(result, filter, context);
    }

    // Apply transforms
    for (const [name, transform] of this.transforms) {
      console.log(`Applying transform: ${name}`);
      result = await transform(result, context);
    }

    return result;
  }

  // Apply a filter recursively
  async applyFilter(tokens, filter, context) {
    const filtered = {};

    for (const [key, value] of Object.entries(tokens)) {
      if (key.startsWith('$')) {
        filtered[key] = value;
        continue;
      }

      if (value && typeof value === 'object') {
        if (value.$value !== undefined) {
          // It's a token
          if (await filter(key, value, context)) {
            filtered[key] = value;
          }
        } else {
          // It's a group
          const filteredGroup = await this.applyFilter(value, filter, context);
          if (Object.keys(filteredGroup).length > 0) {
            filtered[key] = filteredGroup;
          }
        }
      }
    }

    return filtered;
  }
}

// Common transformations
const commonTransforms = {
  // Convert hex colors to RGB
  hexToRgb: (tokens) => {
    function hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }

    function transformValue(value) {
      if (typeof value === 'string' && value.startsWith('#')) {
        const rgb = hexToRgb(value);
        return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : value;
      }
      return value;
    }

    function traverse(obj) {
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value === 'object') {
          if (value.$value !== undefined && value.$type === 'color') {
            result[key] = {
              ...value,
              $value: transformValue(value.$value)
            };
          } else {
            result[key] = traverse(value);
          }
        } else {
          result[key] = value;
        }
      }
      return result;
    }

    return traverse(tokens);
  },

  // Convert rem to px
  remToPx: (tokens, { baseFontSize = 16 } = {}) => {
    function remToPx(value) {
      if (typeof value === 'string' && value.endsWith('rem')) {
        const remValue = parseFloat(value);
        return `${remValue * baseFontSize}px`;
      }
      return value;
    }

    function traverse(obj) {
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value === 'object') {
          if (value.$value !== undefined && value.$type === 'dimension') {
            result[key] = {
              ...value,
              $value: remToPx(value.$value)
            };
          } else {
            result[key] = traverse(value);
          }
        } else {
          result[key] = value;
        }
      }
      return result;
    }

    return traverse(tokens);
  },

  // Add prefixes to token names
  addPrefix: (tokens, { prefix = '' } = {}) => {
    if (!prefix) return tokens;

    function traverse(obj, isRoot = true) {
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        const newKey = isRoot && !key.startsWith('$') ? `${prefix}${key}` : key;
        
        if (value && typeof value === 'object') {
          if (value.$value !== undefined) {
            result[newKey] = value;
          } else {
            result[newKey] = traverse(value, false);
          }
        } else {
          result[newKey] = value;
        }
      }
      return result;
    }

    return traverse(tokens);
  },

  // Flatten nested structure
  flatten: (tokens, { separator = '.' } = {}) => {
    const result = {};

    function traverse(obj, path = []) {
      for (const [key, value] of Object.entries(obj)) {
        if (key.startsWith('$')) continue;
        
        const currentPath = [...path, key];
        
        if (value && typeof value === 'object') {
          if (value.$value !== undefined) {
            const flatKey = currentPath.join(separator);
            result[flatKey] = value;
          } else {
            traverse(value, currentPath);
          }
        }
      }
    }

    traverse(tokens);
    return result;
  },

  // Generate CSS custom properties
  toCssVars: (tokens, { prefix = '--' } = {}) => {
    const cssVars = {};

    function kebabCase(str) {
      return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
    }

    function traverse(obj, path = []) {
      for (const [key, value] of Object.entries(obj)) {
        if (key.startsWith('$')) continue;
        
        const currentPath = [...path, key];
        
        if (value && typeof value === 'object') {
          if (value.$value !== undefined) {
            const varName = prefix + currentPath.map(kebabCase).join('-');
            cssVars[varName] = value.$value;
          } else {
            traverse(value, currentPath);
          }
        }
      }
    }

    traverse(tokens);
    return cssVars;
  },

  // Extract tokens by type
  extractByType: (tokens, { types = [] } = {}) => {
    const result = {};

    function traverse(obj, path = []) {
      for (const [key, value] of Object.entries(obj)) {
        if (key.startsWith('$')) continue;
        
        const currentPath = [...path, key];
        
        if (value && typeof value === 'object') {
          if (value.$value !== undefined && types.includes(value.$type)) {
            // Rebuild nested structure
            let current = result;
            for (let i = 0; i < currentPath.length - 1; i++) {
              if (!current[currentPath[i]]) {
                current[currentPath[i]] = {};
              }
              current = current[currentPath[i]];
            }
            current[currentPath[currentPath.length - 1]] = value;
          } else if (value.$value === undefined) {
            traverse(value, currentPath);
          }
        }
      }
    }

    traverse(tokens);
    return result;
  }
};

// Common filters
const commonFilters = {
  // Filter by token type
  byType: (types) => async (key, token) => {
    return types.includes(token.$type);
  },

  // Filter by path pattern
  byPath: (pattern) => async (key, token, context) => {
    const path = context.path || key;
    return new RegExp(pattern).test(path);
  },

  // Filter by value
  byValue: (predicate) => async (key, token) => {
    return predicate(token.$value);
  },

  // Exclude tokens with specific keys
  excludeKeys: (keys) => async (key) => {
    return !keys.includes(key);
  }
};

// Create transformation pipelines
function createPipeline(name) {
  const pipelines = {
    // iOS transformation pipeline
    ios: new TokenTransformer()
      .addFilter(commonFilters.excludeKeys(['$description', '$extensions']))
      .addTransform('flatten', commonTransforms.flatten)
      .addTransform('remToPx', (tokens) => commonTransforms.remToPx(tokens, { baseFontSize: 16 })),

    // Android transformation pipeline
    android: new TokenTransformer()
      .addFilter(commonFilters.excludeKeys(['$description', '$extensions']))
      .addTransform('flatten', (tokens) => commonTransforms.flatten(tokens, { separator: '_' }))
      .addTransform('hexToRgb', commonTransforms.hexToRgb),

    // Web transformation pipeline
    web: new TokenTransformer()
      .addTransform('cssVars', (tokens) => commonTransforms.toCssVars(tokens, { prefix: '--mantine-' })),

    // Flutter transformation pipeline
    flutter: new TokenTransformer()
      .addFilter(commonFilters.byType(['color', 'dimension', 'number']))
      .addTransform('flatten', commonTransforms.flatten)
      .addTransform('prefix', (tokens) => commonTransforms.addPrefix(tokens, { prefix: 'k' })),

    // Documentation pipeline
    docs: new TokenTransformer()
      .addTransform('extractColors', (tokens) => commonTransforms.extractByType(tokens, { types: ['color'] }))
      .addTransform('extractTypography', (tokens) => commonTransforms.extractByType(tokens, { types: ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight'] }))
  };

  return pipelines[name] || new TokenTransformer();
}

// Example usage and CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
Token Transformer - Transform design tokens for different platforms

Usage:
  node token-transformer.js <input-file> <pipeline> [output-file]

Available pipelines:
  - ios: Transform for iOS (Swift)
  - android: Transform for Android (XML)
  - web: Transform to CSS custom properties
  - flutter: Transform for Flutter (Dart)
  - docs: Extract tokens for documentation

Examples:
  node token-transformer.js tokens.json ios tokens-ios.json
  node token-transformer.js tokens.json web tokens.css
  node token-transformer.js tokens.json docs tokens-docs.json
`);
    process.exit(1);
  }

  const [inputFile, pipelineName, outputFile] = args;

  try {
    // Load tokens
    const inputPath = path.resolve(inputFile);
    const tokensContent = await fs.readFile(inputPath, 'utf-8');
    const tokens = JSON.parse(tokensContent);

    // Get pipeline
    const pipeline = createPipeline(pipelineName);

    // Transform tokens
    console.log(`Transforming tokens with '${pipelineName}' pipeline...`);
    const transformed = await pipeline.transform(tokens);

    // Output results
    if (outputFile) {
      const outputPath = path.resolve(outputFile);
      
      if (pipelineName === 'web' && outputFile.endsWith('.css')) {
        // Special handling for CSS output
        const cssContent = Object.entries(transformed)
          .map(([key, value]) => `  ${key}: ${value};`)
          .join('\n');
        
        await fs.writeFile(outputPath, `:root {\n${cssContent}\n}\n`);
      } else {
        await fs.writeFile(outputPath, JSON.stringify(transformed, null, 2));
      }
      
      console.log(`✅ Transformed tokens saved to: ${outputPath}`);
    } else {
      // Output to console
      console.log(JSON.stringify(transformed, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Export for use as a module
export { TokenTransformer, commonTransforms, commonFilters, createPipeline };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
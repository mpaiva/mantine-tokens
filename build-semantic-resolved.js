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
const colorMode = args.includes('--dark') ? 'dark' : 'light';
const brand = args.find(arg => ['mantine', 'clearco', 'firstwatch'].includes(arg)) || 'mantine';

console.log(`🎨 Building Semantic tokens with API resolution...`);
console.log(`   Color Mode: ${colorMode}`);
console.log(`   Brand: ${brand}\n`);

// Load context mappings
function loadContextMappings(colorMode, brand) {
  const mappings = {};
  
  // Load color mode context
  const colorModeFile = resolve(__dirname, `tokens/contexts/color-mode/${colorMode}.json`);
  if (fs.existsSync(colorModeFile)) {
    const data = JSON.parse(fs.readFileSync(colorModeFile, 'utf8'));
    flattenTokens(data, mappings);
  }
  
  // Load brand context (if exists)
  const brandFile = resolve(__dirname, `tokens/contexts/brand/${brand}.json`);
  if (fs.existsSync(brandFile)) {
    const data = JSON.parse(fs.readFileSync(brandFile, 'utf8'));
    flattenTokens(data, mappings, true); // Override with brand values
  }
  
  return mappings;
}

// Flatten nested token structure into dot notation
function flattenTokens(obj, result = {}, override = false, prefix = '') {
  for (const key in obj) {
    if (key.startsWith('$')) continue; // Skip metadata
    
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (obj[key].$value !== undefined) {
      const apiKey = `@${newKey}`;
      if (!result[apiKey] || override) {
        result[apiKey] = obj[key].$value;
      }
    } else if (typeof obj[key] === 'object') {
      flattenTokens(obj[key], result, override, newKey);
    }
  }
  return result;
}

// Load context mappings
const contextMappings = loadContextMappings(colorMode, brand);

if (isVerbose) {
  console.log('Context mappings loaded:');
  const keys = Object.keys(contextMappings);
  console.log(`Total mappings: ${keys.length}`);
  console.log('Sample mappings:');
  keys.slice(0, 5).forEach(key => {
    console.log(`  ${key}: ${contextMappings[key]}`);
  });
  console.log('...\n');
}

// Custom transform to resolve API references
StyleDictionary.registerTransform({
  name: 'api/resolve',
  type: 'value',
  filter: (token) => {
    return typeof token.$value === 'string' && token.$value.startsWith('@');
  },
  transform: (token) => {
    const apiRef = token.$value;
    
    if (isVerbose) {
      console.log(`Resolving API reference: ${apiRef}`);
    }
    
    // Look up the value in context mappings
    let resolvedValue = contextMappings[apiRef];
    
    if (!resolvedValue) {
      console.warn(`Warning: Could not resolve API reference: ${apiRef}`);
      // Keep the original reference for debugging
      return apiRef;
    }
    
    // If the resolved value is a Style Dictionary reference, keep it
    // Style Dictionary will resolve it in the next pass
    if (typeof resolvedValue === 'string' && resolvedValue.startsWith('{')) {
      if (isVerbose) {
        console.log(`  -> Resolved to SD reference: ${resolvedValue}`);
      }
      return resolvedValue;
    }
    
    if (isVerbose) {
      console.log(`  -> Resolved to value: ${resolvedValue}`);
    }
    
    return resolvedValue;
  }
});

// Custom format for resolved tokens
StyleDictionary.registerFormat({
  name: 'json/resolved',
  format: ({ dictionary, file }) => {
    const output = {};
    
    dictionary.allTokens.forEach(token => {
      let current = output;
      const path = [...token.path];
      const lastKey = path.pop();
      
      // Build nested structure
      path.forEach(key => {
        if (!current[key]) current[key] = {};
        current = current[key];
      });
      
      // Set token data
      const tokenData = {
        $value: token.value || token.$value,
        $type: token.$type || token.type
      };
      
      if (token.$description || token.comment) {
        tokenData.$description = token.$description || token.comment;
      }
      
      // Only include if value exists
      if (tokenData.$value !== undefined) {
        current[lastKey] = tokenData;
      }
    });
    
    return JSON.stringify(output, null, 2);
  }
});

// Build configuration
const config = {
  source: [
    'tokens/primitives/*-dtcg.json',
    `tokens/semantic/${colorMode}-theme-api.json`
  ],
  platforms: {
    css: {
      buildPath: `build/semantic/${brand}/${colorMode}/`,
      transformGroup: 'css',
      transforms: ['api/resolve', 'attribute/cti', 'name/kebab', 'time/seconds', 'size/rem', 'color/css'],
      files: [{
        destination: 'theme.css',
        format: 'css/variables',
        options: {
          selector: `.theme-${colorMode}`
        }
      }]
    },
    json: {
      buildPath: 'build/json/',
      transformGroup: 'js',
      transforms: ['api/resolve', 'attribute/cti', 'name/camel', 'color/hex'],
      files: [{
        destination: `mantine.semantic.${colorMode}.resolved.tokens.json`,
        format: 'json/resolved'
      }]
    }
  }
};

// Create Style Dictionary instance
const sd = new StyleDictionary(config);

// Build
async function build() {
  try {
    await sd.buildAllPlatforms();
    console.log('✅ Semantic tokens with API resolution built successfully!\n');
    console.log('📁 Output files:');
    console.log(`   - build/semantic/${brand}/${colorMode}/theme.css`);
    console.log(`   - build/json/mantine.semantic.${colorMode}.resolved.tokens.json\n`);
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
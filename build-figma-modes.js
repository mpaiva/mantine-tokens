// Build script for Figma Variables with proper mode structure
// Creates collections with light/dark modes as Figma expects

import { TransformStream } from 'stream/web';
if (typeof globalThis.TransformStream === 'undefined') {
  globalThis.TransformStream = TransformStream;
}

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import StyleDictionary from 'style-dictionary';
import fs from 'fs';
import { promises as fsPromises } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse command line arguments
const args = process.argv.slice(2);
const isVerbose = args.includes('--verbose');

console.log(`🎨 Building Figma tokens with proper mode structure...`);

// Helper to clean token names
function cleanTokenName(name) {
  return name
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Process token value
function processTokenValue(token) {
  const value = token.$value || token.value;
  
  // Handle references
  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    return value; // Keep references as-is for Figma to resolve
  }
  
  return value;
}

// Create the output structure for Figma Variables
const figmaOutput = {
  // Primitive collections (no modes)
  "Colors": {
    "$description": "Color primitives",
    "modes": {
      "Mode 1": {} // Single mode for primitives
    }
  },
  "Typography": {
    "$description": "Typography tokens",
    "modes": {
      "Mode 1": {} // Single mode for typography
    }
  },
  "Spacing": {
    "$description": "Spacing scale",
    "modes": {
      "Mode 1": {} // Single mode for spacing
    }
  },
  "Effects": {
    "$description": "Shadows and effects",
    "modes": {
      "Mode 1": {} // Single mode for effects
    }
  },
  // Theme collection with light/dark modes
  "Theme": {
    "$description": "Semantic theme tokens",
    "modes": {
      "Light": {},
      "Dark": {}
    }
  },
  // Brand-specific collections with light/dark modes
  "Mantine Theme": {
    "$description": "Mantine semantic tokens",
    "modes": {
      "Light": {},
      "Dark": {}
    }
  },
  "Clearco Theme": {
    "$description": "Clearco brand tokens",
    "modes": {
      "Light": {},
      "Dark": {}
    }
  },
  "Firstwatch Theme": {
    "$description": "Firstwatch brand tokens",
    "modes": {
      "Light": {},
      "Dark": {}
    }
  }
};

// Register custom format
StyleDictionary.registerFormat({
  name: 'figma/modes',
  format: ({ dictionary }) => {
          // Process all tokens
          dictionary.allTokens.forEach(token => {
            const path = token.path;
            const value = processTokenValue(token);
            const tokenData = {
              "$value": value,
              "$type": token.$type || token.type
            };
            
            if (token.$description || token.description) {
              tokenData.$description = token.$description || token.description;
            }
            
            // Route tokens to appropriate collections and modes
            routeToken(path, tokenData, token.filePath);
          });
          
          // Clean up empty modes
          Object.keys(figmaOutput).forEach(collection => {
            const modes = figmaOutput[collection].modes;
            Object.keys(modes).forEach(mode => {
              if (Object.keys(modes[mode]).length === 0) {
                delete modes[mode];
              }
            });
            // Remove collection if no modes have content
            if (Object.keys(modes).length === 0) {
              delete figmaOutput[collection];
            }
          });
          
          return JSON.stringify(figmaOutput, null, 2);
  }
});

// Build configuration
const config = {
  source: [
    'tokens/primitives/*-dtcg.json',
    'tokens/semantic/*-dtcg.json',
    'tokens/components/*-dtcg.json',
    'tokens/custom/custom-spacing.json',
    'tokens/custom/oval-button.json',
    'tokens/brands/*/colors.json',
    'tokens/brands/*/typography.json',
    'tokens/brands/*/theme-light.json',
    'tokens/brands/*/theme-dark.json'
  ],
  platforms: {
    figma: {
      transformGroup: 'js',
      buildPath: 'build/figma/',
      files: [{
        destination: 'figma-modes.tokens.json',
        format: 'figma/modes'
      }]
    }
  }
};

// Route tokens to appropriate collections and modes
function routeToken(path, tokenData, filePath) {
  const [category, ...rest] = path;
  
  // Primitives
  if (category === 'color') {
    addToCollection(figmaOutput["Colors"].modes["Mode 1"], rest, tokenData);
  }
  else if (category === 'typography') {
    addToCollection(figmaOutput["Typography"].modes["Mode 1"], rest, tokenData);
  }
  else if (category === 'spacing') {
    addToCollection(figmaOutput["Spacing"].modes["Mode 1"], rest, tokenData);
  }
  else if (category === 'shadow') {
    addToCollection(figmaOutput["Effects"].modes["Mode 1"], ['shadow', ...rest], tokenData);
  }
  else if (category === 'radius') {
    addToCollection(figmaOutput["Spacing"].modes["Mode 1"], ['radius', ...rest], tokenData);
  }
  // Semantic theme tokens
  else if (filePath.includes('semantic')) {
    const mode = filePath.includes('dark') ? 'Dark' : 'Light';
    if (category === 'theme') {
      addToCollection(figmaOutput["Theme"].modes[mode], rest, tokenData);
    } else {
      addToCollection(figmaOutput["Theme"].modes[mode], path, tokenData);
    }
  }
  // Brand tokens
  else if (filePath.includes('brands')) {
    const brandMatch = filePath.match(/brands\/(\w+)\//);
    if (brandMatch) {
      const brand = brandMatch[1];
      const brandName = brand.charAt(0).toUpperCase() + brand.slice(1);
      const collectionName = `${brandName} Theme`;
      
      if (filePath.includes('theme-')) {
        // Theme files go to appropriate mode
        const mode = filePath.includes('dark') ? 'Dark' : 'Light';
        if (category === 'theme') {
          addToCollection(figmaOutput[collectionName].modes[mode], rest, tokenData);
        } else {
          addToCollection(figmaOutput[collectionName].modes[mode], path, tokenData);
        }
      } else {
        // Non-theme files (colors, typography) go to both modes
        addToCollection(figmaOutput[collectionName].modes['Light'], path, tokenData);
        addToCollection(figmaOutput[collectionName].modes['Dark'], path, tokenData);
      }
    }
  }
  // Component tokens
  else if (category === 'button' || category === 'card' || category === 'input' || 
           category === 'modal' || category === 'badge' || category === 'alert') {
    // Add component tokens to theme collection (both modes)
    addToCollection(figmaOutput["Theme"].modes['Light'], ['component', ...path], tokenData);
    addToCollection(figmaOutput["Theme"].modes['Dark'], ['component', ...path], tokenData);
  }
  // Custom tokens
  else if (filePath.includes('custom')) {
    if (category === 'spacing') {
      addToCollection(figmaOutput["Spacing"].modes["Mode 1"], ['custom', ...rest], tokenData);
    } else {
      // Add to theme collection
      addToCollection(figmaOutput["Theme"].modes['Light'], ['custom', ...path], tokenData);
      addToCollection(figmaOutput["Theme"].modes['Dark'], ['custom', ...path], tokenData);
    }
  }
}

// Add token to collection with proper nesting
function addToCollection(collection, path, tokenData) {
  if (path.length === 0) return;
  
  const [current, ...rest] = path;
  const key = cleanTokenName(current);
  
  if (rest.length === 0) {
    // Leaf node
    collection[key] = tokenData;
  } else {
    // Create nested structure
    if (!collection[key]) {
      collection[key] = {};
    }
    // Only create nested structure if the current level is an object
    if (typeof collection[key] === 'object' && !collection[key].$value) {
      addToCollection(collection[key], rest, tokenData);
    }
  }
}

// Build the tokens
async function build() {
  try {
    // Ensure build directory exists
    await fsPromises.mkdir(resolve(__dirname, 'build/figma'), { recursive: true });
    
    // Build with Style Dictionary
    const sd = new StyleDictionary(config);
    await sd.buildAllPlatforms();
    
    console.log(`✅ Figma token file with modes built successfully!`);
    console.log(`\n📁 Output file:`);
    console.log(`   - build/figma/figma-modes.tokens.json`);
    console.log(`\n📊 Collections created:`);
    Object.keys(figmaOutput).forEach(collection => {
      const modes = Object.keys(figmaOutput[collection].modes);
      console.log(`   - ${collection}: ${modes.join(', ')}`);
    });
    console.log(`\n💡 Import this file into Figma to create variables with proper modes!`);
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run the build
build();
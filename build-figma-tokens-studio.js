// Build script for Tokens Studio compatible format
// Creates proper structure for Figma Tokens Studio plugin

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function buildTokensStudioFormat() {
  console.log('🎨 Building Tokens Studio compatible format...\n');
  
  // Read the figma-modes file
  const modesPath = resolve(__dirname, 'build/figma/figma-modes.tokens.json');
  const modesContent = await fs.readFile(modesPath, 'utf-8');
  const modes = JSON.parse(modesContent);
  
  // Convert to Tokens Studio format
  const tokensStudio = {
    "global": {},
    "light": {
      "$theme": "light"
    },
    "dark": {
      "$theme": "dark"
    },
    "brands": {
      "clearco": {
        "light": {
          "$theme": "light"
        },
        "dark": {
          "$theme": "dark"
        }
      },
      "firstwatch": {
        "light": {
          "$theme": "light"
        },
        "dark": {
          "$theme": "dark"
        }
      }
    }
  };
  
  // Process each collection
  for (const [collectionName, collection] of Object.entries(modes)) {
    if (collection.modes) {
      // Handle single-mode collections (primitives)
      if (collection.modes["Mode 1"]) {
        Object.assign(tokensStudio.global, flattenTokens(collection.modes["Mode 1"]));
      }
      
      // Handle multi-mode collections (themes)
      if (collection.modes.Light && collection.modes.Dark) {
        if (collectionName === "Theme") {
          // Main theme
          Object.assign(tokensStudio.light, flattenTokens(collection.modes.Light));
          Object.assign(tokensStudio.dark, flattenTokens(collection.modes.Dark));
        } else if (collectionName.includes("Theme")) {
          // Brand themes
          const brandName = collectionName.replace(" Theme", "").toLowerCase();
          if (!tokensStudio.brands[brandName]) {
            tokensStudio.brands[brandName] = {
              light: { "$theme": "light" },
              dark: { "$theme": "dark" }
            };
          }
          Object.assign(tokensStudio.brands[brandName].light, flattenTokens(collection.modes.Light));
          Object.assign(tokensStudio.brands[brandName].dark, flattenTokens(collection.modes.Dark));
        }
      }
    }
  }
  
  // Write output
  const outputPath = resolve(__dirname, 'build/figma/tokens-studio.json');
  await fs.writeFile(outputPath, JSON.stringify(tokensStudio, null, 2));
  
  console.log('✅ Tokens Studio format built successfully!');
  console.log(`\n📁 Output file: ${outputPath}`);
  console.log('\n📤 Import this file in Tokens Studio plugin:');
  console.log('   1. Open Tokens Studio plugin in Figma');
  console.log('   2. Click Settings (gear icon) → Sync → Local File');
  console.log('   3. Import tokens-studio.json');
  console.log('   4. Click "Export to Figma" → Variables');
  console.log('\n🎯 Token sets created:');
  console.log('   - global (primitives)');
  console.log('   - light/dark (theme modes)');
  console.log('   - brands/clearco/light+dark');
  console.log('   - brands/firstwatch/light+dark');
}

// Flatten nested token structure for Tokens Studio
function flattenTokens(obj, prefix = '') {
  const flattened = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object') {
      if (value.$value !== undefined) {
        // It's a token
        flattened[newKey] = {
          value: value.$value,
          type: mapTokenType(value.$type)
        };
        if (value.$description) {
          flattened[newKey].description = value.$description;
        }
      } else {
        // Recurse
        Object.assign(flattened, flattenTokens(value, newKey));
      }
    }
  }
  
  return flattened;
}

// Map our token types to Tokens Studio types
function mapTokenType(type) {
  const typeMap = {
    'color': 'color',
    'dimension': 'dimension',
    'number': 'number',
    'fontSize': 'fontSizes',
    'lineHeight': 'lineHeights',
    'fontFamily': 'fontFamilies',
    'fontWeight': 'fontWeights',
    'shadow': 'boxShadow',
    'radius': 'borderRadius'
  };
  
  return typeMap[type] || 'other';
}

// Run the build
buildTokensStudioFormat().catch(console.error);
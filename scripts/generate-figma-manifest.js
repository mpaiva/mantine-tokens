import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Figma plugin manifest generator
async function generateFigmaManifest() {
  const manifest = {
    name: "Mantine Design Tokens",
    id: "mantine-design-tokens",
    version: "1.0.0",
    description: "Complete design token system for Mantine UI with multi-brand support",
    api: "1.0.0",
    main: "tokens.json",
    ui: null,
    capabilities: ["inspect"],
    permissions: [],
    relaunchButtons: [],
    enableProposedApi: false,
    metadata: {
      generated: new Date().toISOString(),
      tokenCount: 0,
      brands: ["Mantine", "Clearco", "Firstwatch"],
      categories: [
        "Primitives",
        "Semantic", 
        "Components",
        "Custom",
        "Brands"
      ],
      features: {
        multiTheme: true,
        darkMode: true,
        customBrands: true,
        tokenReferences: true
      }
    }
  };

  // Count tokens
  try {
    const tokensPath = path.join(__dirname, '../build/figma/tokens.json');
    const tokensContent = await fs.readFile(tokensPath, 'utf-8');
    const tokens = JSON.parse(tokensContent);
    
    function countTokens(obj) {
      let count = 0;
      for (const value of Object.values(obj)) {
        if (value && typeof value === 'object') {
          if (value.$value !== undefined) {
            count++;
          } else {
            count += countTokens(value);
          }
        }
      }
      return count;
    }
    
    manifest.metadata.tokenCount = countTokens(tokens);
  } catch (error) {
    console.warn('Could not count tokens:', error.message);
  }

  // Write manifest
  const outputPath = path.join(__dirname, '../build/figma/manifest.json');
  await fs.writeFile(outputPath, JSON.stringify(manifest, null, 2));
  
  console.log('✅ Figma manifest generated:', outputPath);
  return manifest;
}

// Removed - no longer generating separate Figma format file

// Removed - no longer generating README file

// Main execution
async function main() {
  console.log('🎨 Generating Figma manifest...\n');
  
  try {
    // Ensure build directory exists
    await fs.mkdir(path.join(__dirname, '../build/figma'), { recursive: true });
    
    // Generate only manifest
    await generateFigmaManifest();
    
    console.log('\n✅ Figma manifest generated successfully!');
  } catch (error) {
    console.error('❌ Error generating Figma manifest:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateFigmaManifest };
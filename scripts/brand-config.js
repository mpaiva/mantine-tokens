#!/usr/bin/env node

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import glob from 'fast-glob';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

/**
 * Discover all brands and their token files
 */
export async function discoverBrands() {
  const brandsDir = resolve(rootDir, 'tokens/brands');
  const brands = new Map();
  
  try {
    const brandDirs = await fs.readdir(brandsDir);
    
    for (const brandName of brandDirs) {
      const brandPath = resolve(brandsDir, brandName);
      const stat = await fs.stat(brandPath);
      
      if (stat.isDirectory()) {
        // Find all JSON files in brand directory
        const files = await glob('*.json', { 
          cwd: brandPath, 
          absolute: true 
        });
        
        // Analyze files to determine their purpose
        const fileTypes = await analyzeFiles(files);
        
        brands.set(brandName, {
          name: brandName,
          path: brandPath,
          files: fileTypes
        });
      }
    }
  } catch (error) {
    console.error('Error discovering brands:', error);
  }
  
  return brands;
}

/**
 * Analyze token files to determine their type and purpose
 */
async function analyzeFiles(files) {
  const categorized = {
    colors: [],
    typography: [],
    themes: [],
    components: [],
    motion: [],
    semantic: [],
    other: []
  };
  
  for (const file of files) {
    const basename = file.split('/').pop();
    const content = await fs.readFile(file, 'utf8');
    const tokens = JSON.parse(content);
    
    // Categorize based on filename and content
    if (basename.includes('color')) {
      categorized.colors.push({ file, basename, hasConflicts: false });
    } else if (basename.includes('typography') || basename.includes('font')) {
      categorized.typography.push({ file, basename });
    } else if (basename.includes('theme')) {
      const theme = basename.includes('dark') ? 'dark' : 'light';
      categorized.themes.push({ file, basename, theme });
    } else if (basename.includes('component') || basename.includes('button') || basename.includes('card') || basename.includes('input')) {
      categorized.components.push({ file, basename });
    } else if (basename.includes('motion') || basename.includes('animation')) {
      categorized.motion.push({ file, basename });
    } else if (basename.includes('semantic')) {
      categorized.semantic.push({ file, basename });
    } else {
      categorized.other.push({ file, basename });
    }
  }
  
  return categorized;
}

/**
 * Generate brand configuration based on discovered structure
 */
export async function generateBrandConfig(brands) {
  const config = {
    brands: {}
  };
  
  for (const [brandName, brandData] of brands) {
    const brandConfig = {
      name: brandName,
      namespace: brandName === 'clearco' ? 'clearco' : 'brand',
      files: {
        include: [],
        exclude: []
      },
      priorities: {},
      transforms: []
    };
    
    // Handle color file conflicts
    if (brandData.files.colors.length > 1) {
      // Detect which files have conflicts
      const colorFiles = brandData.files.colors.map(f => f.basename);
      
      if (colorFiles.includes('colors-merged.json')) {
        // Use merged file, exclude others
        brandConfig.files.include.push('colors-merged.json');
        brandConfig.files.exclude.push('colors.json', 'brand-colors.json');
      } else if (colorFiles.includes('colors.json') && colorFiles.includes('brand-colors.json')) {
        // Need to merge these
        brandConfig.files.include.push('colors.json');
        brandConfig.files.exclude.push('brand-colors.json');
        brandConfig.priorities['colors.json'] = 10;
        brandConfig.transforms.push({
          type: 'merge-conflicts',
          files: ['colors.json', 'brand-colors.json']
        });
      }
    }
    
    // Include theme files
    brandData.files.themes.forEach(theme => {
      brandConfig.files.include.push(theme.basename);
    });
    
    // Include other files
    ['typography', 'components', 'motion'].forEach(category => {
      brandData.files[category].forEach(file => {
        brandConfig.files.include.push(file.basename);
      });
    });
    
    // Handle semantic colors carefully
    if (brandData.files.semantic.length > 0) {
      const hasColorScales = brandData.files.colors.some(f => 
        f.basename.includes('colors.json') && !f.basename.includes('brand-')
      );
      
      if (hasColorScales) {
        // Exclude semantic if we have full color scales
        brandData.files.semantic.forEach(file => {
          brandConfig.files.exclude.push(file.basename);
        });
      } else {
        brandData.files.semantic.forEach(file => {
          brandConfig.files.include.push(file.basename);
        });
      }
    }
    
    config.brands[brandName] = brandConfig;
  }
  
  return config;
}

/**
 * Save brand configuration
 */
export async function saveBrandConfig(config) {
  const configPath = resolve(rootDir, 'figma-brands.config.json');
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  console.log(`✅ Brand configuration saved to: figma-brands.config.json`);
  return configPath;
}

/**
 * Load brand configuration
 */
export async function loadBrandConfig() {
  const configPath = resolve(rootDir, 'figma-brands.config.json');
  try {
    const content = await fs.readFile(configPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    // Config doesn't exist, generate it
    console.log('🔄 Generating brand configuration...');
    const brands = await discoverBrands();
    const config = await generateBrandConfig(brands);
    await saveBrandConfig(config);
    return config;
  }
}

/**
 * Main function for CLI usage
 */
async function main() {
  console.log('🔍 Discovering brands and analyzing token structure...\n');
  
  const brands = await discoverBrands();
  
  console.log(`Found ${brands.size} brands:`);
  for (const [name, data] of brands) {
    console.log(`\n📁 ${name}`);
    console.log(`   Colors: ${data.files.colors.length} files`);
    console.log(`   Typography: ${data.files.typography.length} files`);
    console.log(`   Themes: ${data.files.themes.length} files`);
    console.log(`   Components: ${data.files.components.length} files`);
  }
  
  const config = await generateBrandConfig(brands);
  await saveBrandConfig(config);
  
  console.log('\n📋 Configuration summary:');
  for (const [brandName, brandConfig] of Object.entries(config.brands)) {
    console.log(`\n${brandName}:`);
    console.log(`  Include: ${brandConfig.files.include.length} files`);
    console.log(`  Exclude: ${brandConfig.files.exclude.length} files`);
    if (brandConfig.transforms.length > 0) {
      console.log(`  Transforms: ${brandConfig.transforms.map(t => t.type).join(', ')}`);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default { discoverBrands, generateBrandConfig, saveBrandConfig, loadBrandConfig };
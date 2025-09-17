#!/usr/bin/env node

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import glob from 'fast-glob';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// ANSI color codes for terminal output
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

/**
 * Parse a JSON token file and extract all token paths
 */
async function parseTokenFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const tokens = JSON.parse(content);
    const paths = [];
    
    function extractPaths(obj, prefix = '') {
      for (const [key, value] of Object.entries(obj)) {
        if (key.startsWith('$')) continue; // Skip meta properties
        
        const currentPath = prefix ? `${prefix}.${key}` : key;
        
        if (value && typeof value === 'object') {
          if (value.$value !== undefined) {
            // This is a token
            paths.push({
              path: currentPath,
              value: value.$value,
              type: value.$type,
              file: filePath,
              description: value.$description
            });
          } else {
            // Recurse into nested object
            extractPaths(value, currentPath);
          }
        }
      }
    }
    
    extractPaths(tokens);
    return paths;
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Check if files are from different brands
 */
function areDifferentBrands(file1, file2) {
  const brandPattern = /tokens\/brands\/([^/]+)\//;
  const match1 = file1.match(brandPattern);
  const match2 = file2.match(brandPattern);
  
  if (match1 && match2) {
    return match1[1] !== match2[1];
  }
  return false;
}

/**
 * Check if this is an intentional architectural collision
 */
function isArchitecturalCollision(tokens) {
  const hasApiToken = tokens.some(t => t.file.includes('/api/'));
  const hasContextToken = tokens.some(t => t.file.includes('/contexts/'));
  const hasSemanticToken = tokens.some(t => t.file.includes('/semantic/'));
  
  // API tokens with @ references are placeholders
  if (hasApiToken && tokens.some(t => typeof t.value === 'string' && t.value.startsWith('@'))) {
    return true;
  }
  
  // Context-specific values (light/dark, brand-specific) are intentional
  if (hasContextToken || (hasSemanticToken && tokens.some(t => 
    t.file.includes('dark-theme') || t.file.includes('light-theme')
  ))) {
    return true;
  }
  
  // Theme variations (light/dark) within the same brand are intentional
  const themePaths = tokens.map(t => t.file);
  const hasLightTheme = themePaths.some(p => p.includes('theme-light.json'));
  const hasDarkTheme = themePaths.some(p => p.includes('theme-dark.json'));
  if (hasLightTheme && hasDarkTheme) {
    // Check if they're from the same brand
    const brands = new Set();
    themePaths.forEach(path => {
      const brandMatch = path.match(/brands\/([^/]+)\//);  // Fixed regex
      if (brandMatch) brands.add(brandMatch[1]);
    });
    if (brands.size === 1) {
      return true; // Same brand, different themes
    }
  }
  
  return false;
}

/**
 * Detect collisions across multiple token files
 */
async function detectCollisions(patterns) {
  const files = await glob(patterns, { cwd: rootDir, absolute: true });
  console.log(`\n🔍 Analyzing ${files.length} token files...\n`);
  
  const allTokens = new Map();
  const collisions = new Map();
  const brandCollisions = new Map();
  const architecturalCollisions = new Map();
  
  // Parse all files and collect tokens
  for (const file of files) {
    const tokens = await parseTokenFile(file);
    for (const token of tokens) {
      if (allTokens.has(token.path)) {
        const existingToken = allTokens.get(token.path);
        
        // Collect all instances first
        const allInstances = collisions.has(token.path) 
          ? [...collisions.get(token.path), token]
          : [existingToken, token];
        
        // Check if this is a brand-specific collision
        if (areDifferentBrands(existingToken.file, token.file)) {
          // Track brand collisions separately
          if (!brandCollisions.has(token.path)) {
            brandCollisions.set(token.path, [existingToken]);
          }
          brandCollisions.set(token.path, [...brandCollisions.get(token.path), token]);
        } else if (isArchitecturalCollision(allInstances)) {
          // Track architectural collisions separately
          architecturalCollisions.set(token.path, allInstances);
          // Remove from regular collisions if it was there
          collisions.delete(token.path);
        } else {
          // Regular collision within same brand or non-brand files
          collisions.set(token.path, allInstances);
        }
      } else {
        allTokens.set(token.path, token);
      }
    }
  }
  
  return { allTokens, collisions, brandCollisions, architecturalCollisions };
}

/**
 * Generate a collision report
 */
function generateReport(collisions) {
  if (collisions.size === 0) {
    console.log(`${colors.green}✅ No token collisions detected!${colors.reset}\n`);
    return;
  }
  
  console.log(`${colors.red}⚠️  Found ${collisions.size} token path collisions:${colors.reset}\n`);
  
  const sortedCollisions = Array.from(collisions.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  
  for (const [path, tokens] of sortedCollisions) {
    console.log(`${colors.yellow}📍 ${path}${colors.reset}`);
    
    // Group by value to see which files agree
    const valueGroups = new Map();
    for (const token of tokens) {
      const key = JSON.stringify(token.value);
      if (!valueGroups.has(key)) {
        valueGroups.set(key, []);
      }
      valueGroups.get(key).push(token);
    }
    
    if (valueGroups.size === 1) {
      console.log(`   ${colors.green}✓ All files agree on value${colors.reset}`);
    } else {
      console.log(`   ${colors.red}✗ Conflicting values:${colors.reset}`);
    }
    
    for (const [value, group] of valueGroups) {
      console.log(`   Value: ${colors.blue}${value}${colors.reset}`);
      for (const token of group) {
        const relPath = token.file.replace(rootDir + '/', '');
        console.log(`     - ${relPath}`);
        if (token.description) {
          console.log(`       "${token.description}"`);
        }
      }
    }
    console.log();
  }
  
  // Summary
  console.log(`${colors.yellow}📊 Summary:${colors.reset}`);
  console.log(`   Total collisions: ${collisions.size}`);
  
  const valueConflicts = Array.from(collisions.values()).filter(tokens => {
    const values = new Set(tokens.map(t => JSON.stringify(t.value)));
    return values.size > 1;
  });
  
  console.log(`   Value conflicts: ${valueConflicts.length}`);
  console.log(`   Same value (different files): ${collisions.size - valueConflicts.length}\n`);
}

/**
 * Suggest resolutions for collisions
 */
function suggestResolutions(collisions) {
  console.log(`${colors.blue}💡 Suggested resolutions:${colors.reset}\n`);
  
  for (const [path, tokens] of collisions) {
    const values = new Set(tokens.map(t => JSON.stringify(t.value)));
    
    if (values.size > 1) {
      console.log(`${colors.yellow}${path}${colors.reset}`);
      
      // Check if it's a brand token collision
      if (path.startsWith('brand.')) {
        console.log('   → Consider using brand-specific namespaces (e.g., clearco.primary instead of brand.primary)');
      }
      
      // Check if files can be prioritized
      const hasColors = tokens.some(t => t.file.includes('colors.json'));
      const hasBrandColors = tokens.some(t => t.file.includes('brand-colors.json'));
      if (hasColors && hasBrandColors) {
        console.log('   → Merge colors.json and brand-colors.json into a single file');
      }
      
      // Check for semantic vs literal values
      const hasReference = tokens.some(t => typeof t.value === 'string' && t.value.includes('{'));
      const hasLiteral = tokens.some(t => typeof t.value === 'string' && !t.value.includes('{'));
      if (hasReference && hasLiteral) {
        console.log('   → Prefer token references over literal values for consistency');
      }
      
      console.log();
    }
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const showHelp = args.includes('--help') || args.includes('-h');
  const showBrandCollisions = args.includes('--include-brands');
  const showArchitectural = args.includes('--include-architectural');
  const patterns = args.filter(arg => !arg.startsWith('-'));
  
  if (showHelp) {
    console.log(`
Token Collision Detector

Usage: node scripts/detect-collisions.js [patterns...] [options]

Patterns:
  Default: tokens/**/*.json
  Examples:
    tokens/brands/**/*.json     Check only brand tokens
    tokens/primitives/*.json    Check only primitive tokens

Options:
  --help, -h                 Show this help message
  --include-brands           Include brand-specific collisions in report
  --include-architectural    Include architectural collisions (API/context)
  --fix                      Automatically fix collisions (coming soon)

Examples:
  node scripts/detect-collisions.js
  node scripts/detect-collisions.js tokens/brands/**/*.json
  node scripts/detect-collisions.js --include-brands
`);
    return;
  }
  
  const defaultPatterns = ['tokens/**/*.json'];
  const patternsToUse = patterns.length > 0 ? patterns : defaultPatterns;
  
  console.log(`${colors.blue}🔍 Token Collision Detector${colors.reset}`);
  console.log(`Patterns: ${patternsToUse.join(', ')}`);
  
  const { collisions, brandCollisions, architecturalCollisions } = await detectCollisions(patternsToUse);
  
  // Generate report for regular collisions
  generateReport(collisions);
  
  // Optionally show brand collisions
  if (showBrandCollisions && brandCollisions.size > 0) {
    console.log(`\n${colors.blue}🏷️  Brand-specific collisions (intentional):${colors.reset}\n`);
    console.log(`Found ${brandCollisions.size} cross-brand token definitions.`);
    console.log(`This is expected behavior - each brand has its own values.\n`);
  }
  
  // Optionally show architectural collisions
  if (showArchitectural && architecturalCollisions.size > 0) {
    console.log(`\n${colors.blue}🏗️  Architectural collisions (intentional):${colors.reset}\n`);
    console.log(`Found ${architecturalCollisions.size} API/context token definitions.`);
    console.log(`This is expected - API tokens use @ references, contexts provide values.\n`);
  }
  
  if (collisions.size > 0) {
    suggestResolutions(collisions);
    process.exit(1); // Exit with error code if collisions found
  } else {
    const notes = [];
    if (!showBrandCollisions && brandCollisions.size > 0) {
      notes.push(`${brandCollisions.size} brand-specific variations`);
    }
    if (!showArchitectural && architecturalCollisions.size > 0) {
      notes.push(`${architecturalCollisions.size} architectural patterns`);
    }
    if (notes.length > 0) {
      console.log(`\n${colors.green}ℹ️  Note:${colors.reset} Excluded ${notes.join(' and ')} (use flags to see them)\n`);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { detectCollisions, generateReport, areDifferentBrands };
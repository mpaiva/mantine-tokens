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
 * Detect collisions across multiple token files
 */
async function detectCollisions(patterns) {
  const files = await glob(patterns, { cwd: rootDir, absolute: true });
  console.log(`\n🔍 Analyzing ${files.length} token files...\n`);
  
  const allTokens = new Map();
  const collisions = new Map();
  
  // Parse all files and collect tokens
  for (const file of files) {
    const tokens = await parseTokenFile(file);
    for (const token of tokens) {
      if (allTokens.has(token.path)) {
        // Collision detected
        if (!collisions.has(token.path)) {
          collisions.set(token.path, [allTokens.get(token.path)]);
        }
        collisions.set(token.path, [...collisions.get(token.path), token]);
      } else {
        allTokens.set(token.path, token);
      }
    }
  }
  
  return { allTokens, collisions };
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
  --help, -h     Show this help message
  --fix          Automatically fix collisions (coming soon)

Examples:
  node scripts/detect-collisions.js
  node scripts/detect-collisions.js tokens/brands/**/*.json
`);
    return;
  }
  
  const defaultPatterns = ['tokens/**/*.json'];
  const patternsToUse = patterns.length > 0 ? patterns : defaultPatterns;
  
  console.log(`${colors.blue}🔍 Token Collision Detector${colors.reset}`);
  console.log(`Patterns: ${patternsToUse.join(', ')}`);
  
  const { collisions } = await detectCollisions(patternsToUse);
  generateReport(collisions);
  
  if (collisions.size > 0) {
    suggestResolutions(collisions);
    process.exit(1); // Exit with error code if collisions found
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { detectCollisions, generateReport };
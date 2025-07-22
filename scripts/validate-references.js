#!/usr/bin/env node

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// ANSI color codes
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  dim: '\x1b[2m',
  reset: '\x1b[0m'
};

/**
 * Extract all references from a token file
 */
function extractReferences(tokens, currentPath = '') {
  const references = [];
  
  function traverse(obj, path) {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue;
      
      const fullPath = path ? `${path}.${key}` : key;
      
      if (value && typeof value === 'object') {
        if (value.$value && typeof value.$value === 'string') {
          // Extract references from the value
          const refs = value.$value.match(/\{[^}]+\}/g) || [];
          refs.forEach(ref => {
            references.push({
              source: fullPath,
              reference: ref,
              cleanRef: ref.slice(1, -1) // Remove { and }
            });
          });
        }
        traverse(value, fullPath);
      }
    }
  }
  
  traverse(tokens);
  return references;
}

/**
 * Build a map of all available token paths
 */
function buildTokenMap(tokens, currentPath = '') {
  const tokenMap = new Set();
  
  function traverse(obj, path) {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue;
      
      const fullPath = path ? `${path}.${key}` : key;
      
      if (value && typeof value === 'object') {
        if (value.$value !== undefined) {
          tokenMap.add(fullPath);
        } else {
          traverse(value, fullPath);
        }
      }
    }
  }
  
  traverse(tokens);
  return tokenMap;
}

/**
 * Validate references in a single file
 */
async function validateFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const tokens = JSON.parse(content);
  
  const references = extractReferences(tokens);
  const tokenMap = buildTokenMap(tokens);
  
  const issues = {
    broken: [],
    external: [],
    circular: []
  };
  
  // Check each reference
  for (const ref of references) {
    if (!tokenMap.has(ref.cleanRef)) {
      // Could be an external reference to another file
      if (ref.cleanRef.includes('.')) {
        issues.external.push(ref);
      } else {
        issues.broken.push(ref);
      }
    }
    
    // Simple circular reference check
    if (ref.cleanRef === ref.source || ref.cleanRef.startsWith(ref.source + '.')) {
      issues.circular.push(ref);
    }
  }
  
  return {
    file: filePath,
    references: references.length,
    tokens: tokenMap.size,
    issues
  };
}

/**
 * Validate references across multiple files
 */
async function validateAllFiles(pattern = 'build/figma/*.json') {
  const glob = await import('fast-glob');
  const files = await glob.default(pattern, { cwd: rootDir, absolute: true });
  
  console.log(`${colors.blue}🔍 Reference Validator${colors.reset}\n`);
  console.log(`Validating ${files.length} file(s)...\n`);
  
  let totalIssues = 0;
  
  for (const file of files) {
    const relPath = file.replace(rootDir + '/', '');
    const result = await validateFile(file);
    
    console.log(`${colors.blue}📄 ${relPath}${colors.reset}`);
    console.log(`   Tokens: ${result.tokens}`);
    console.log(`   References: ${result.references}`);
    
    const issueCount = result.issues.broken.length + 
                      result.issues.external.length + 
                      result.issues.circular.length;
    
    if (issueCount === 0) {
      console.log(`   ${colors.green}✓ All references valid${colors.reset}`);
    } else {
      totalIssues += issueCount;
      
      if (result.issues.broken.length > 0) {
        console.log(`   ${colors.red}✗ Broken references: ${result.issues.broken.length}${colors.reset}`);
        result.issues.broken.slice(0, 3).forEach(ref => {
          console.log(`     ${colors.dim}${ref.source}${colors.reset} → ${colors.red}${ref.reference}${colors.reset}`);
        });
        if (result.issues.broken.length > 3) {
          console.log(`     ${colors.dim}... and ${result.issues.broken.length - 3} more${colors.reset}`);
        }
      }
      
      if (result.issues.external.length > 0) {
        console.log(`   ${colors.yellow}⚠ External references: ${result.issues.external.length}${colors.reset}`);
        const uniqueRefs = new Set(result.issues.external.map(r => r.cleanRef));
        const sample = Array.from(uniqueRefs).slice(0, 3);
        sample.forEach(ref => {
          console.log(`     ${colors.yellow}{${ref}}${colors.reset}`);
        });
        if (uniqueRefs.size > 3) {
          console.log(`     ${colors.dim}... and ${uniqueRefs.size - 3} more${colors.reset}`);
        }
      }
      
      if (result.issues.circular.length > 0) {
        console.log(`   ${colors.red}✗ Circular references: ${result.issues.circular.length}${colors.reset}`);
        result.issues.circular.forEach(ref => {
          console.log(`     ${colors.red}${ref.source} → ${ref.reference}${colors.reset}`);
        });
      }
    }
    
    console.log();
  }
  
  // Summary
  if (totalIssues === 0) {
    console.log(`${colors.green}✅ All references are valid!${colors.reset}\n`);
  } else {
    console.log(`${colors.red}❌ Found ${totalIssues} reference issue(s)${colors.reset}\n`);
    process.exit(1);
  }
}

/**
 * Validate Figma-specific references
 */
async function validateFigmaReferences(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const tokens = JSON.parse(content);
  
  const figmaRefs = [];
  const allRefs = [];
  
  function findFigmaRefs(obj, path = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$') || key === '_metadata') continue;
      
      const fullPath = path ? `${path}.${key}` : key;
      
      if (value && typeof value === 'object') {
        if (value.$value && typeof value.$value === 'string' && value.$value.includes('{')) {
          const refs = value.$value.match(/\{[^}]+\}/g) || [];
          refs.forEach(ref => {
            const refObj = {
              path: fullPath,
              reference: ref,
              valid: false
            };
            allRefs.push(refObj);
            if (ref.includes('Global.') || ref.includes('Brands.')) {
              figmaRefs.push(refObj);
            }
          });
        }
        findFigmaRefs(value, fullPath);
      }
    }
  }
  
  findFigmaRefs(tokens);
  
  // Build a map of all valid Figma paths
  const validPaths = new Set();
  
  function buildValidPaths(obj, path = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$') || key === '_metadata') continue;
      
      const fullPath = path ? `${path}.${key}` : key;
      
      if (value && typeof value === 'object') {
        if (value.$value !== undefined) {
          validPaths.add(fullPath);
        }
        buildValidPaths(value, fullPath);
      }
    }
  }
  
  buildValidPaths(tokens);
  
  // Validate all references
  allRefs.forEach(ref => {
    const cleanRef = ref.reference.slice(1, -1);
    ref.valid = validPaths.has(cleanRef);
  });
  
  const invalidRefs = allRefs.filter(r => !r.valid);
  const invalidFigmaRefs = figmaRefs.filter(r => !r.valid);
  
  console.log(`\n${colors.blue}🎨 Figma Reference Validation${colors.reset}`);
  console.log(`File: ${filePath.replace(process.cwd() + '/', '')}`);
  console.log(`Total references: ${allRefs.length}`);
  console.log(`  - Figma-style references: ${figmaRefs.length}`);
  console.log(`  - Valid references: ${colors.green}${allRefs.length - invalidRefs.length}${colors.reset}`);
  console.log(`  - Invalid references: ${colors.red}${invalidRefs.length}${colors.reset}`);
  
  if (invalidRefs.length > 0) {
    console.log(`\n${colors.red}Invalid references:${colors.reset}`);
    
    // Group by reference type
    const byType = {};
    invalidRefs.forEach(ref => {
      const type = ref.reference.includes('Global.') ? 'Figma' : 
                   ref.reference.includes('Brands.') ? 'Brand' : 'Other';
      if (!byType[type]) byType[type] = [];
      byType[type].push(ref);
    });
    
    Object.entries(byType).forEach(([type, refs]) => {
      console.log(`\n  ${colors.yellow}${type} References (${refs.length}):${colors.reset}`);
      refs.slice(0, 5).forEach(ref => {
        console.log(`    ${ref.path} → ${colors.red}${ref.reference}${colors.reset}`);
      });
      if (refs.length > 5) {
        console.log(`    ${colors.dim}... and ${refs.length - 5} more${colors.reset}`);
      }
    });
  }
  
  return invalidRefs.length === 0;
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const pattern = args[0] || 'build/figma/*.json';
  
  await validateAllFiles(pattern);
  
  // Additional Figma-specific validation
  const figmaFiles = ['build/figma/figma.tokens.json', 'build/figma/figma.tokens.v2.json'];
  for (const file of figmaFiles) {
    try {
      await validateFigmaReferences(resolve(rootDir, file));
    } catch (error) {
      // File might not exist
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
#!/usr/bin/env node

// Pre-build validation script to ensure token integrity
// Runs validation checks before building to prevent broken references

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
 * Validate token structure
 */
async function validateTokenStructure(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const tokens = JSON.parse(content);
    
    const issues = [];
    
    function validateNode(obj, path = '') {
      for (const [key, value] of Object.entries(obj)) {
        const fullPath = path ? `${path}.${key}` : key;
        
        if (key.startsWith('$')) {
          // Skip metadata keys
          continue;
        }
        
        if (value && typeof value === 'object') {
          // Check if it's a token (has $value)
          if (value.$value !== undefined) {
            // Validate token structure
            if (!value.$type && !path.includes('semantic') && !path.includes('components')) {
              issues.push({
                type: 'warning',
                path: fullPath,
                message: 'Token missing $type'
              });
            }
          } else {
            // Recurse into nested structure
            validateNode(value, fullPath);
          }
        }
      }
    }
    
    validateNode(tokens);
    return issues;
  } catch (error) {
    return [{
      type: 'error',
      path: filePath,
      message: `Failed to parse: ${error.message}`
    }];
  }
}

/**
 * Check for reference cycles
 */
function checkReferenceCycles(tokens) {
  const references = new Map();
  const cycles = [];
  
  function extractReferences(obj, path = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue;
      
      const fullPath = path ? `${path}.${key}` : key;
      
      if (value && typeof value === 'object') {
        if (value.$value && typeof value.$value === 'string') {
          const refs = value.$value.match(/\{[^}]+\}/g) || [];
          if (refs.length > 0) {
            references.set(fullPath, refs.map(r => r.slice(1, -1)));
          }
        } else {
          extractReferences(value, fullPath);
        }
      }
    }
  }
  
  extractReferences(tokens);
  
  // Check for cycles
  function hasCycle(start, current, visited = new Set()) {
    if (visited.has(current)) {
      return current === start;
    }
    
    visited.add(current);
    const refs = references.get(current) || [];
    
    for (const ref of refs) {
      if (hasCycle(start, ref, new Set(visited))) {
        return true;
      }
    }
    
    return false;
  }
  
  for (const [tokenPath] of references) {
    if (hasCycle(tokenPath, tokenPath)) {
      cycles.push(tokenPath);
    }
  }
  
  return cycles;
}

/**
 * Run all pre-build validations
 */
async function runValidations() {
  console.log(`${colors.blue}🔍 Pre-build Validation${colors.reset}\n`);
  
  const glob = await import('fast-glob');
  const tokenFiles = await glob.default('tokens/**/*-dtcg.json', { 
    cwd: rootDir, 
    absolute: true,
    ignore: ['**/node_modules/**']
  });
  
  let hasErrors = false;
  let totalIssues = 0;
  
  // Validate each token file
  for (const file of tokenFiles) {
    const relPath = file.replace(rootDir + '/', '');
    const issues = await validateTokenStructure(file);
    
    if (issues.length > 0) {
      console.log(`${colors.yellow}📄 ${relPath}${colors.reset}`);
      issues.forEach(issue => {
        totalIssues++;
        if (issue.type === 'error') {
          hasErrors = true;
          console.log(`  ${colors.red}✗ ${issue.path}: ${issue.message}${colors.reset}`);
        } else {
          console.log(`  ${colors.yellow}⚠ ${issue.path}: ${issue.message}${colors.reset}`);
        }
      });
      console.log();
    }
  }
  
  // Check for reference cycles
  console.log(`${colors.blue}🔄 Checking for reference cycles...${colors.reset}`);
  
  for (const file of tokenFiles) {
    try {
      const content = await fs.readFile(file, 'utf8');
      const tokens = JSON.parse(content);
      const cycles = checkReferenceCycles(tokens);
      
      if (cycles.length > 0) {
        hasErrors = true;
        const relPath = file.replace(rootDir + '/', '');
        console.log(`${colors.red}✗ Circular references in ${relPath}:${colors.reset}`);
        cycles.forEach(cycle => {
          console.log(`  ${colors.red}${cycle}${colors.reset}`);
        });
        console.log();
      }
    } catch (error) {
      // Skip files that can't be parsed
    }
  }
  
  // Summary
  console.log('\n' + '─'.repeat(50) + '\n');
  
  if (totalIssues === 0 && !hasErrors) {
    console.log(`${colors.green}✅ All validations passed!${colors.reset}\n`);
    return true;
  } else {
    console.log(`${colors.red}❌ Validation failed: ${totalIssues} issue(s) found${colors.reset}\n`);
    return false;
  }
}

// Main
async function main() {
  const success = await runValidations();
  if (!success) {
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
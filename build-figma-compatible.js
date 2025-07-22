import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the generated figma tokens
const figmaTokensPath = path.join(__dirname, 'build/figma/figma.tokens.json');
const figmaTokens = JSON.parse(fs.readFileSync(figmaTokensPath, 'utf8'));

// Function to check if a value contains references
function hasReference(value) {
  return typeof value === 'string' && value.includes('{') && value.includes('}');
}

// Function to check if a value has compound references
function hasCompoundReference(value) {
  if (typeof value !== 'string') return false;
  const referencePattern = /\{[^}]+\}/g;
  const matches = value.match(referencePattern);
  return matches && matches.length > 1;
}

// Function to resolve a single reference
function resolveReference(value, tokens, path = []) {
  if (!hasReference(value)) return value;
  
  // Extract reference path
  const match = value.match(/\{([^}]+)\}/);
  if (!match) return value;
  
  const refPath = match[1].split('.');
  
  // Navigate to the referenced token
  let current = tokens;
  for (const segment of refPath) {
    if (!current[segment]) {
      console.warn(`Reference not found: ${match[1]} from ${path.join('.')}`);
      return value;
    }
    current = current[segment];
  }
  
  // Get the actual value
  if (current.$value !== undefined) {
    // Recursively resolve if the target is also a reference
    return resolveReference(current.$value, tokens, refPath);
  }
  
  return value;
}

// Function to resolve compound references
function resolveCompoundReferences(value, tokens, path = []) {
  if (!hasCompoundReference(value)) {
    return resolveReference(value, tokens, path);
  }
  
  // For compound references, we'll keep them as strings
  // but resolve each individual reference
  let resolved = value;
  const referencePattern = /\{([^}]+)\}/g;
  let match;
  
  while ((match = referencePattern.exec(value)) !== null) {
    const refPath = match[1];
    const resolvedValue = resolveReference(`{${refPath}}`, tokens, path);
    
    // If we couldn't resolve it, skip
    if (resolvedValue === `{${refPath}}`) continue;
    
    // For dimensions, extract the numeric value
    if (typeof resolvedValue === 'string' && resolvedValue.match(/^\d+(\.\d+)?(px|rem|em)?$/)) {
      resolved = resolved.replace(`{${refPath}}`, resolvedValue);
    }
  }
  
  // If it's still a compound value after resolution, convert to a single value
  // For padding/margin, just take the first value as Figma doesn't support compound values
  if (resolved.includes(' ') && !resolved.includes('{')) {
    const parts = resolved.split(' ');
    if (parts.length > 0 && parts[0].match(/^\d+(\.\d+)?(px|rem|em)?$/)) {
      console.log(`Converting compound value "${resolved}" to "${parts[0]}" for Figma compatibility`);
      return parts[0];
    }
  }
  
  return resolved;
}

// Function to process tokens recursively
function processTokens(obj, tokens, path = []) {
  const processed = {};
  
  for (const key in obj) {
    if (key.startsWith('$')) {
      processed[key] = obj[key];
      continue;
    }
    
    const currentPath = [...path, key];
    const value = obj[key];
    
    if (value && typeof value === 'object') {
      if (value.$value !== undefined) {
        // This is a token
        processed[key] = { ...value };
        
        // Skip unsupported types
        if (['shadow', 'typography', 'strokeStyle', 'border', 'transition', 'gradient'].includes(value.$type)) {
          console.log(`Skipping unsupported token type: ${currentPath.join('.')} (${value.$type})`);
          continue;
        }
        
        // Resolve references
        if (hasReference(value.$value)) {
          const resolved = resolveCompoundReferences(value.$value, tokens, currentPath);
          processed[key].$value = resolved;
          
          // Update the description to indicate it was resolved
          if (resolved !== value.$value) {
            processed[key].$description = `${value.$description || ''} [Resolved from: ${value.$value}]`.trim();
          }
        }
        
        // Convert fontWeight strings to numbers
        if (value.$type === 'fontWeight' && typeof value.$value === 'string') {
          const weightMap = {
            'thin': 100,
            'hairline': 100,
            'extra-light': 200,
            'ultra-light': 200,
            'light': 300,
            'normal': 400,
            'regular': 400,
            'medium': 500,
            'semi-bold': 600,
            'demi-bold': 600,
            'bold': 700,
            'extra-bold': 800,
            'ultra-bold': 800,
            'black': 900,
            'heavy': 900,
            'extra-black': 950,
            'ultra-black': 950
          };
          
          const numericValue = weightMap[value.$value.toLowerCase()] || parseInt(value.$value);
          if (!isNaN(numericValue)) {
            processed[key].$value = numericValue;
          }
        }
      } else {
        // This is a group
        processed[key] = processTokens(value, tokens, currentPath);
      }
    } else {
      processed[key] = value;
    }
  }
  
  return processed;
}

// Process the tokens
console.log('Processing tokens for Figma compatibility...');
const processedTokens = processTokens(figmaTokens, figmaTokens);

// Write the processed tokens
const outputPath = path.join(__dirname, 'build/figma/figma-compatible.tokens.json');
fs.writeFileSync(outputPath, JSON.stringify(processedTokens, null, 2));

console.log(`\nFigma-compatible tokens written to: ${outputPath}`);
console.log('\nChanges made:');
console.log('1. Resolved all token references');
console.log('2. Converted compound values to single values (for padding, etc.)');
console.log('3. Converted fontWeight strings to numbers');
console.log('4. Skipped unsupported token types');
console.log('\nYou can now import this file into Figma using the Variables Import plugin.');
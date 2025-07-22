// Script to import tokens to Figma via API
// Requires Figma access token and file ID

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_ACCESS_TOKEN || !FIGMA_FILE_KEY) {
  console.error('Please set FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY environment variables');
  process.exit(1);
}

// Read tokens file
const tokensPath = path.join(__dirname, '../build/figma/figma-modes.tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

// Convert our token structure to Figma Variables API format
function convertToFigmaVariables(tokens) {
  const variableCollections = [];
  
  for (const [collectionName, collection] of Object.entries(tokens)) {
    if (collection.modes) {
      const modes = Object.keys(collection.modes);
      const variables = [];
      
      // Extract all unique variable names across modes
      const variableNames = new Set();
      modes.forEach(mode => {
        extractVariableNames(collection.modes[mode], [], variableNames);
      });
      
      // Create variables
      variableNames.forEach(varName => {
        const variable = {
          name: varName,
          resolvedType: 'COLOR', // You'll need to determine type based on token
          values: {}
        };
        
        // Set value for each mode
        modes.forEach(mode => {
          const value = getValueByPath(collection.modes[mode], varName.split('/'));
          if (value) {
            variable.values[mode] = value;
          }
        });
        
        variables.push(variable);
      });
      
      variableCollections.push({
        name: collectionName,
        modes: modes.map(name => ({ name })),
        variables
      });
    }
  }
  
  return variableCollections;
}

function extractVariableNames(obj, path, names) {
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object') {
      if (value.$value !== undefined) {
        names.add([...path, key].join('/'));
      } else {
        extractVariableNames(value, [...path, key], names);
      }
    }
  }
}

function getValueByPath(obj, path) {
  let current = obj;
  for (const key of path) {
    current = current[key];
    if (!current) return null;
  }
  return current.$value;
}

// Import to Figma
async function importToFigma() {
  console.log('Converting tokens to Figma format...');
  const variableCollections = convertToFigmaVariables(tokens);
  
  console.log(`Creating ${variableCollections.length} variable collections...`);
  
  // Note: As of 2024, Figma's Variables API is still in beta
  // You'll need to use the Figma REST API endpoints when they become available
  // For now, use plugins mentioned above
  
  console.log('Note: Direct API import of variables is not yet publicly available.');
  console.log('Please use one of the Figma plugins mentioned in the documentation.');
  console.log('\nVariable collections prepared:');
  variableCollections.forEach(collection => {
    console.log(`- ${collection.name}: ${collection.modes.map(m => m.name).join(', ')}`);
  });
}

importToFigma().catch(console.error);
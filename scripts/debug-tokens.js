#!/usr/bin/env node

// Debug script to understand token processing

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import StyleDictionary from 'style-dictionary';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Custom format to debug tokens
StyleDictionary.registerFormat({
  name: 'json/debug',
  format: ({ dictionary }) => {
    const fontWeightTokens = dictionary.allTokens.filter(token => 
      token.path.includes('fontWeight') || 
      (token.path[0] === 'typography' && token.path[1] === 'fontWeight')
    );
    
    console.log('\n🔍 Font Weight Tokens Found:');
    console.log('Total tokens:', dictionary.allTokens.length);
    console.log('Font weight tokens:', fontWeightTokens.length);
    
    fontWeightTokens.forEach(token => {
      console.log('\n---');
      console.log('Path:', token.path.join('.'));
      console.log('Value:', token.value);
      console.log('Original value:', token.original.$value);
      console.log('Type:', token.type);
      console.log('File:', token.filePath.replace(/.*tokens\//, 'tokens/'));
      console.log('Is reference:', token.original.$value?.toString().includes('{'));
    });
    
    return JSON.stringify({ debug: true }, null, 2);
  }
});

const config = {
  source: [
    'tokens/primitives/*-dtcg.json',
    'tokens/semantic/*-dtcg.json',
    'tokens/components/*-dtcg.json',
    'tokens/custom/*.json'
  ],
  platforms: {
    debug: {
      transforms: ['attribute/cti', 'name/camel', 'color/hex', 'size/rem'],
      buildPath: 'build/debug/',
      files: [{
        destination: 'debug.json',
        format: 'json/debug'
      }]
    }
  }
};

console.log('🐛 Running token debug...\n');

const sd = new StyleDictionary(config);
await sd.buildAllPlatforms();
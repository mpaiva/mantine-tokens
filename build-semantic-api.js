// Polyfill for web streams if needed
import { TransformStream } from 'stream/web';
if (typeof globalThis.TransformStream === 'undefined') {
  globalThis.TransformStream = TransformStream;
}

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import StyleDictionary from 'style-dictionary';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse command line arguments
const args = process.argv.slice(2);
const isVerbose = args.includes('--verbose');
const isWatch = args.includes('--watch');

// Configuration for semantic API token build
const CONTEXTS = {
  colorMode: ['light', 'dark'],
  brand: ['mantine', 'clearco', 'firstwatch'],
  density: ['regular'], // Future expansion
  platform: ['web'] // Future expansion
};

// Current context (in real implementation, this would be configurable)
const CURRENT_CONTEXT = {
  colorMode: 'light',
  brand: 'mantine',
  density: 'regular',
  platform: 'web'
};

console.log('🎨 Building Semantic API design tokens...\n');

// Custom transform to resolve semantic API references
StyleDictionary.registerTransform({
  name: 'semantic-api/resolve',
  type: 'value',
  filter: (token) => {
    return typeof token.$value === 'string' && token.$value.startsWith('@');
  },
  transform: (token, options) => {
    // This is where the context resolution happens
    // In a real implementation, this would:
    // 1. Parse the semantic reference (e.g., @surface.primary.idle.background)
    // 2. Look up the value in the context mappings
    // 3. Return the resolved value
    
    // For now, we'll just return the reference as-is
    return token.$value;
  }
});

// Custom format for semantic API documentation
StyleDictionary.registerFormat({
  name: 'semantic-api/docs',
  format: ({ dictionary }) => {
    let md = '# Semantic API Token Reference\n\n';
    md += 'This document describes the stable public API for the design system.\n\n';
    md += '## Usage\n\n';
    md += 'These tokens should be the **only** tokens referenced by consumers.\n';
    md += 'They automatically adapt based on context (theme, brand, platform, etc.).\n\n';
    
    const categories = {};
    dictionary.allTokens.forEach(token => {
      const category = token.path[0];
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(token);
    });
    
    Object.keys(categories).sort().forEach(category => {
      md += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
      md += '| Token | Description | Type |\n';
      md += '|-------|-------------|------|\n';
      
      categories[category].forEach(token => {
        const path = token.path.join('.');
        const description = token.$description || '';
        const type = token.$type || 'unknown';
        md += `| ${path} | ${description} | ${type} |\n`;
      });
      
      md += '\n';
    });
    
    return md;
  }
});

// Build configuration
const config = {
  source: [
    'tokens/api/*.json',
    'tokens/primitives/*-dtcg.json',
    'tokens/semantic/theme-patterns.json'
  ],
  platforms: {
    css: {
      buildPath: 'build/api/',
      transformGroup: 'css',
      files: [{
        destination: 'semantic-api.css',
        format: 'css/variables',
        options: {
          selector: ':root'
        }
      }]
    },
    docs: {
      buildPath: 'build/api/',
      files: [{
        destination: 'semantic-api.md',
        format: 'semantic-api/docs'
      }]
    },
    json: {
      buildPath: 'build/api/',
      files: [{
        destination: 'semantic-api.json',
        format: 'json/nested'
      }]
    }
  }
};

// Create Style Dictionary instance
const sd = new StyleDictionary(config);

// Add verbosity if requested
if (isVerbose) {
  sd.log.verbosity = 'verbose';
}

// Build or watch
async function build() {
  try {
    if (isWatch) {
      console.log('👀 Watching for changes...\n');
      // Note: Style Dictionary v4's watch mode implementation
      await sd.buildAllPlatforms();
    } else {
      await sd.buildAllPlatforms();
      console.log('✅ Semantic API tokens built successfully!\n');
      console.log('📁 Output files:');
      console.log('   - build/api/semantic-api.css    CSS variables');
      console.log('   - build/api/semantic-api.json   JSON format');
      console.log('   - build/api/semantic-api.md     Documentation\n');
      console.log('⚠️  Note: This is a demonstration of the semantic API concept.');
      console.log('   Full context resolution would require additional implementation.\n');
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
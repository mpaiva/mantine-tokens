// Build all tokens - both Mantine and custom tokens
// This script runs both build processes sequentially

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check for flags
const isVerbose = process.argv.includes('--verbose');
const isWatchMode = process.argv.includes('--watch');

// Helper function to run a build script
function runBuild(scriptName, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Running ${scriptName}...`);
    
    const child = spawn('node', [scriptName, ...args], {
      cwd: __dirname,
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${scriptName} exited with code ${code}`));
      } else {
        resolve();
      }
    });
    
    child.on('error', (err) => {
      reject(err);
    });
  });
}

async function buildAll() {
  console.log('🎨 Building all design tokens...\n');
  console.log('This will build both Mantine tokens and custom tokens.\n');
  
  try {
    // Build command line arguments
    const args = [];
    if (isVerbose) args.push('--verbose');
    
    // Build Mantine tokens first
    await runBuild('build-standard.js', args);
    
    // Then build custom tokens
    await runBuild('build-custom.js', args);
    
    console.log('\n✅ All tokens built successfully!');
    console.log('\n📁 Output structure:');
    console.log('   build/');
    console.log('   ├── css/          # Mantine CSS variables');
    console.log('   ├── scss/         # Mantine SCSS variables');
    console.log('   ├── js/           # Mantine JavaScript tokens');
    console.log('   ├── ts/           # Mantine TypeScript tokens');
    console.log('   ├── json/         # Mantine JSON tokens');
    console.log('   ├── docs/         # Mantine documentation');
    console.log('   └── custom/       # All custom token outputs');
    console.log('       ├── variables.css');
    console.log('       ├── variables.scss');
    console.log('       ├── tokens.js');
    console.log('       ├── tokens.ts');
    console.log('       ├── *.tokens.json');
    console.log('       └── tokens.md\n');
    
    console.log('💡 Usage tips:');
    console.log('   - Import build/css/variables.css for Mantine tokens');
    console.log('   - Import build/custom/variables.css for custom tokens');
    console.log('   - Or import both for the complete token set\n');
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

async function watchAll() {
  console.log('🎨 Building and watching all design tokens...\n');
  
  try {
    // Build command line arguments
    const args = ['--watch'];
    if (isVerbose) args.push('--verbose');
    
    // Start both watchers in parallel
    console.log('Starting watchers for both Mantine and custom tokens...\n');
    
    // Run Mantine watcher
    const mantineWatcher = spawn('node', ['build-standard.js', ...args], {
      cwd: __dirname,
      stdio: 'inherit'
    });
    
    // Run custom watcher
    const customWatcher = spawn('node', ['build-custom.js', ...args], {
      cwd: __dirname,
      stdio: 'inherit'
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n\n👋 Stopping all watchers...');
      mantineWatcher.kill();
      customWatcher.kill();
      process.exit(0);
    });
    
    // Handle watcher errors
    mantineWatcher.on('error', (err) => {
      console.error('Mantine watcher error:', err);
    });
    
    customWatcher.on('error', (err) => {
      console.error('Custom watcher error:', err);
    });
    
  } catch (error) {
    console.error('\n❌ Watch mode failed:', error.message);
    process.exit(1);
  }
}

// Run the appropriate mode
if (isWatchMode) {
  watchAll();
} else {
  buildAll();
}
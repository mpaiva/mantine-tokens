import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

describe('Custom Token Build Tests', () => {
  const buildDir = path.join(__dirname, '..', 'build', 'custom');
  
  beforeAll(async () => {
    // Clean only custom build directory before tests
    await execAsync('rm -rf build/custom').catch(() => {});
    await execAsync('mkdir -p build/custom');
  }, 30000);
  
  afterAll(async () => {
    // Clean up after tests - restore original state
    await execAsync('npm run build:custom').catch(() => {});
  }, 30000);

  test('should build custom tokens successfully', async () => {
    const { stdout, stderr } = await execAsync('npm run build:custom');
    
    // Check for successful build output
    expect(stdout).toContain('Building custom tokens');
    expect(stderr).toBe('');
  }, 30000);

  test('should generate custom CSS variables with correct prefix', async () => {
    // Build custom tokens first
    await execAsync('npm run build:custom');
    
    // Read the generated CSS file
    const cssPath = path.join(buildDir, 'variables.css');
    const cssContent = await fs.readFile(cssPath, 'utf8');
    
    // Check for custom prefix
    const prefixPath = path.join(__dirname, '..', 'tokens', '_custom-prefix.json');
    const prefixData = JSON.parse(await fs.readFile(prefixPath, 'utf8'));
    const prefix = prefixData.prefix;
    
    // Verify CSS variables use the custom prefix
    expect(cssContent).toContain(`--${prefix}-spacing-xxs`);
    expect(cssContent).toContain(`--${prefix}-spacing-section`);
    expect(cssContent).toContain(`--${prefix}-typography-fontsize-display`);
    expect(cssContent).toContain(`--${prefix}-ovalbutton-height-md`);
  }, 30000);

  test('should generate custom TypeScript definitions', async () => {
    // Build custom tokens first
    await execAsync('npm run build:custom');
    
    // Read the generated TypeScript file
    const tsPath = path.join(buildDir, 'tokens.ts');
    const tsContent = await fs.readFile(tsPath, 'utf8');
    
    // Check for TypeScript structure
    const prefixPath = path.join(__dirname, '..', 'tokens', '_custom-prefix.json');
    const prefixData = JSON.parse(await fs.readFile(prefixPath, 'utf8'));
    const prefix = prefixData.prefix;
    
    expect(tsContent).toContain(`export const ${prefix}Tokens`);
    expect(tsContent).toContain('spacing.xxs');
    expect(tsContent).toContain('ovalButton.height.md');
    expect(tsContent).toContain(`export type ${prefix.charAt(0).toUpperCase() + prefix.slice(1)}Token`);
  }, 30000);

  test('should generate custom SCSS variables', async () => {
    // Build custom tokens first
    await execAsync('npm run build:custom');
    
    // Read the generated SCSS file
    const scssPath = path.join(buildDir, 'variables.scss');
    const scssContent = await fs.readFile(scssPath, 'utf8');
    
    // Check for SCSS variables
    const prefixPath = path.join(__dirname, '..', 'tokens', '_custom-prefix.json');
    const prefixData = JSON.parse(await fs.readFile(prefixPath, 'utf8'));
    const prefix = prefixData.prefix;
    
    expect(scssContent).toContain(`$${prefix}-spacing-xxs`);
    expect(scssContent).toContain(`$${prefix}-spacing-section`);
    expect(scssContent).toContain(`$${prefix}-ovalbutton-radius`);
  }, 30000);

  test('should generate JSON file in build/json directory', async () => {
    // Build custom tokens first
    await execAsync('npm run build:custom');
    
    // Check JSON file in new location
    const jsonPath = path.join(__dirname, '..', 'build', 'json', 'mantine.custom.tokens.json');
    const jsonExists = await fs.access(jsonPath).then(() => true).catch(() => false);
    expect(jsonExists).toBe(true);
    
    const jsonContent = await fs.readFile(jsonPath, 'utf8');
    const tokens = JSON.parse(jsonContent);
    
    // Verify token structure
    expect(tokens.spacing).toBeDefined();
    expect(tokens.typography).toBeDefined();
    expect(tokens.ovalButton).toBeDefined();
  }, 30000);

  test('should generate documentation for custom tokens', async () => {
    // Build custom tokens first
    await execAsync('npm run build:custom');
    
    // Read the generated documentation
    const docsPath = path.join(buildDir, 'tokens.md');
    const docsContent = await fs.readFile(docsPath, 'utf8');
    
    // Check documentation content
    expect(docsContent).toContain('# Custom Design Token Documentation');
    expect(docsContent).toContain('## Spacing');
    expect(docsContent).toContain('## Typography');
    expect(docsContent).toContain('## OvalButton');
  }, 30000);

  test('should handle custom prefix changes', async () => {
    // Save original prefix
    const prefixPath = path.join(__dirname, '..', 'tokens', '_custom-prefix.json');
    const originalPrefix = JSON.parse(await fs.readFile(prefixPath, 'utf8'));
    
    try {
      // Ensure directory exists
      await execAsync('mkdir -p build/custom');
      
      // Change prefix temporarily
      await fs.writeFile(prefixPath, JSON.stringify({ prefix: 'testprefix' }, null, 2));
      
      // Build with new prefix
      await execAsync('npm run build:custom');
      
      // Check CSS uses new prefix
      const cssPath = path.join(buildDir, 'variables.css');
      const cssContent = await fs.readFile(cssPath, 'utf8');
      
      expect(cssContent).toContain('--testprefix-spacing-xxs');
      expect(cssContent).not.toContain(`--${originalPrefix.prefix}-spacing-xxs`);
    } finally {
      // Restore original prefix
      await fs.writeFile(prefixPath, JSON.stringify(originalPrefix, null, 2));
      // Rebuild with original prefix to restore build directory
      await execAsync('npm run build:custom');
    }
  }, 30000);

  test('should build all tokens (Mantine + custom)', async () => {
    const { stdout } = await execAsync('npm run build:all');
    
    // Check both builds ran
    expect(stdout).toContain('Building design tokens with prefix: mantine');
    expect(stdout).toContain('Building custom design tokens with prefix:');
    
    // Check both output directories exist
    const mantineExists = await fs.access(path.join(__dirname, '..', 'build', 'css')).then(() => true).catch(() => false);
    const customExists = await fs.access(buildDir).then(() => true).catch(() => false);
    
    expect(mantineExists).toBe(true);
    expect(customExists).toBe(true);
  }, 180000);
});
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

describe('Multibrand Build Tests', () => {
  const brandsDir = path.join(__dirname, '..', 'build', 'brands');
  
  beforeAll(async () => {
    // Clean build directory before tests
    await execAsync('npm run clean');
  }, 30000);
  
  afterAll(async () => {
    // Clean up after tests
    await execAsync('npm run clean');
  }, 30000);

  test('should build all brands successfully', async () => {
    const { stdout, stderr } = await execAsync('npm run build:brands');
    
    // Check for successful build output
    expect(stdout).toContain('Building design tokens for multiple brands');
    expect(stdout).toContain('Brands to build:');
    expect(stdout).toContain('clearco');
    expect(stdout).toContain('firstwatch');
    expect(stderr).toBe('');
  }, 30000);

  test('should generate brand-specific CSS files', async () => {
    // Build brands first
    await execAsync('npm run build:brands');
    
    // Check Clearco brand files
    const clearcoDir = path.join(brandsDir, 'clearco');
    const clearcoColors = await fs.readFile(path.join(clearcoDir, 'colors.css'), 'utf8');
    const clearcoLightTheme = await fs.readFile(path.join(clearcoDir, 'theme-light.css'), 'utf8');
    const clearcoDarkTheme = await fs.readFile(path.join(clearcoDir, 'theme-dark.css'), 'utf8');
    
    // Verify Clearco CSS variables
    expect(clearcoColors).toContain('--clearco-brand-primary-500');
    expect(clearcoLightTheme).toContain('--clearco-theme-surface-primary');
    expect(clearcoDarkTheme).toContain('--clearco-theme-surface-primary');
    
    // Check Firstwatch files
    const firstwatchDir = path.join(brandsDir, 'firstwatch');
    const firstwatchColors = await fs.readFile(path.join(firstwatchDir, 'colors.css'), 'utf8');
    const firstwatchLightTheme = await fs.readFile(path.join(firstwatchDir, 'theme-light.css'), 'utf8');
    const firstwatchDarkTheme = await fs.readFile(path.join(firstwatchDir, 'theme-dark.css'), 'utf8');
    
    // Verify Firstwatch CSS variables
    expect(firstwatchColors).toContain('--firstwatch-brand-primary-500');
    expect(firstwatchLightTheme).toContain('--firstwatch-theme-surface-primary');
    expect(firstwatchDarkTheme).toContain('--firstwatch-theme-surface-primary');
  }, 30000);

  test('should generate combined CSS file for each brand', async () => {
    // Build brands first
    await execAsync('npm run build:brands');
    
    // Check combined files
    const clearcoAll = await fs.readFile(path.join(brandsDir, 'clearco', 'all.css'), 'utf8');
    const firstwatchAll = await fs.readFile(path.join(brandsDir, 'firstwatch', 'all.css'), 'utf8');
    
    // Verify combined files include all tokens
    expect(clearcoAll).toContain('--clearco-brand-primary-500'); // Colors
    expect(clearcoAll).toContain('--clearco-theme-surface-primary'); // Theme tokens
    
    expect(firstwatchAll).toContain('--firstwatch-brand-primary-500'); // Colors
    expect(firstwatchAll).toContain('--firstwatch-theme-surface-primary'); // Theme tokens
  }, 30000);

  test('should generate TypeScript definitions for brands', async () => {
    // Build brands first
    await execAsync('npm run build:brands');
    
    // Check TypeScript files
    const clearcoTS = await fs.readFile(path.join(brandsDir, 'clearco', 'tokens.ts'), 'utf8');
    const firstwatchTS = await fs.readFile(path.join(brandsDir, 'firstwatch', 'tokens.ts'), 'utf8');
    
    // Verify TypeScript structure
    expect(clearcoTS).toContain('export const BrandPrimary500: string;');
    expect(clearcoTS).toContain('export const SemanticElevation1:');
    
    expect(firstwatchTS).toContain('export const BrandPrimary500: string;');
    expect(firstwatchTS).toContain('export const SemanticMotionDurationNormal: string;');
  }, 30000);

  test('should generate brand info metadata', async () => {
    // Build brands first
    await execAsync('npm run build:brands');
    
    // Check brand info files
    const clearcoInfo = JSON.parse(await fs.readFile(path.join(brandsDir, 'clearco', 'brand-info.json'), 'utf8'));
    const firstwatchInfo = JSON.parse(await fs.readFile(path.join(brandsDir, 'firstwatch', 'brand-info.json'), 'utf8'));
    
    // Verify metadata
    expect(clearcoInfo.name).toBe('clearco');
    expect(clearcoInfo.prefix).toBe('clearco');
    expect(clearcoInfo.hasLightTheme).toBe(true);
    expect(clearcoInfo.hasDarkTheme).toBe(true);
    expect(clearcoInfo.generatedAt).toBeDefined();
    
    expect(firstwatchInfo.name).toBe('firstwatch');
    expect(firstwatchInfo.prefix).toBe('firstwatch');
    expect(firstwatchInfo.hasLightTheme).toBe(true);
    expect(firstwatchInfo.hasDarkTheme).toBe(true);
  }, 30000);

  test('should handle watch mode for brands', async () => {
    // Start watch mode
    const watchProcess = exec('npm run dev:brands');
    
    // Give it time to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Check if process is running
      expect(watchProcess.pid).toBeDefined();
      expect(watchProcess.killed).toBe(false);
    } finally {
      // Clean up - kill the watch process
      watchProcess.kill();
    }
  }, 10000);

  test('should validate brand token structure', async () => {
    // Read brand token files
    const clearcoColors = JSON.parse(
      await fs.readFile(path.join(__dirname, '..', 'tokens', 'brands', 'clearco', 'colors.json'), 'utf8')
    );
    const clearcoLightTheme = JSON.parse(
      await fs.readFile(path.join(__dirname, '..', 'tokens', 'brands', 'clearco', 'theme-light.json'), 'utf8')
    );
    
    // Verify DTCG structure
    expect(clearcoColors.$schema).toBe('https://design-tokens.github.io/format/tokens.schema.json');
    expect(clearcoColors.brand).toBeDefined();
    expect(clearcoColors.brand.primary['500'].$value).toBeDefined();
    expect(clearcoColors.brand.primary['500'].$type).toBe('color');
    
    expect(clearcoLightTheme.theme).toBeDefined();
    expect(clearcoLightTheme.theme.surface).toBeDefined();
    expect(clearcoLightTheme.theme.surface.primary.$value).toBeDefined();
  });

  test('should detect and list all brands correctly', async () => {
    // Get list of brands
    const brandsPath = path.join(__dirname, '..', 'tokens', 'brands');
    const brands = await fs.readdir(brandsPath, { withFileTypes: true });
    const brandDirs = brands
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // Verify expected brands exist
    expect(brandDirs).toContain('clearco');
    expect(brandDirs).toContain('firstwatch');
    expect(brandDirs.length).toBeGreaterThanOrEqual(2);
  });
});
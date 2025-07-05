import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

describe('Build System', () => {
  const buildDir = path.join(__dirname, '..', 'build');

  beforeAll(async () => {
    // Clean build directory before tests
    await execAsync('npm run clean');
  });

  afterAll(async () => {
    // Clean up after tests
    await execAsync('npm run clean');
  });

  test('should successfully build all token formats', async () => {
    const { stdout, stderr } = await execAsync('npm run build');
    
    expect(stderr).toBe('');
    expect(stdout).toContain('Build completed successfully');
  }, 30000);

  test('should generate CSS variables file', async () => {
    await execAsync('npm run build');
    const cssPath = path.join(buildDir, 'css', 'variables.css');
    const exists = await fs.access(cssPath).then(() => true).catch(() => false);
    
    expect(exists).toBe(true);
    
    const content = await fs.readFile(cssPath, 'utf8');
    expect(content).toContain(':root {');
    expect(content).toContain('--clearco-');
  }, 30000);

  test('should generate DTCG-compliant JSON', async () => {
    await execAsync('npm run build');
    const jsonPath = path.join(buildDir, 'json', 'clearco.tokens.json');
    const exists = await fs.access(jsonPath).then(() => true).catch(() => false);
    
    expect(exists).toBe(true);
    
    const content = await fs.readFile(jsonPath, 'utf8');
    const tokens = JSON.parse(content);
    
    // Check DTCG format
    expect(tokens.color.white).toHaveProperty('$value');
    expect(tokens.color.white).toHaveProperty('$type');
  }, 30000);

  test('should generate TypeScript definitions', async () => {
    await execAsync('npm run build');
    const tsPath = path.join(buildDir, 'ts', 'tokens.ts');
    const exists = await fs.access(tsPath).then(() => true).catch(() => false);
    
    expect(exists).toBe(true);
    
    const content = await fs.readFile(tsPath, 'utf8');
    expect(content).toContain('export const clearcoTokens');
    expect(content).toContain('export type ClearcoToken');
  }, 30000);

  test('should generate theme-specific CSS files', async () => {
    await execAsync('npm run build');
    
    const lightPath = path.join(buildDir, 'css', 'theme-light.css');
    const darkPath = path.join(buildDir, 'css', 'theme-dark.css');
    
    const lightExists = await fs.access(lightPath).then(() => true).catch(() => false);
    const darkExists = await fs.access(darkPath).then(() => true).catch(() => false);
    
    expect(lightExists).toBe(true);
    expect(darkExists).toBe(true);
    
    const lightContent = await fs.readFile(lightPath, 'utf8');
    expect(lightContent).toContain('[data-mantine-color-scheme="light"]');
  }, 30000);
});
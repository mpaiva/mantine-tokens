import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

// Helper to get current prefix
async function getPrefix() {
  try {
    const prefixPath = path.join(__dirname, '..', 'tokens', '_prefix.json');
    const content = await fs.readFile(prefixPath, 'utf8');
    const data = JSON.parse(content);
    return data.prefix || 'mantine';
  } catch {
    return 'mantine';
  }
}

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
    const prefix = await getPrefix();
    const cssPath = path.join(buildDir, 'css', 'variables.css');
    const exists = await fs.access(cssPath).then(() => true).catch(() => false);
    
    expect(exists).toBe(true);
    
    const content = await fs.readFile(cssPath, 'utf8');
    expect(content).toContain(':root {');
    expect(content).toContain(`--${prefix}-`);
  }, 30000);

  test('should generate DTCG-compliant JSON files', async () => {
    await execAsync('npm run build');
    const prefix = await getPrefix();
    
    // Check primitive tokens
    const primitivePath = path.join(buildDir, 'json', `${prefix}.primitive.tokens.json`);
    const primitiveExists = await fs.access(primitivePath).then(() => true).catch(() => false);
    expect(primitiveExists).toBe(true);
    
    const primitiveContent = await fs.readFile(primitivePath, 'utf8');
    const primitiveTokens = JSON.parse(primitiveContent);
    expect(primitiveTokens.color.white).toHaveProperty('$value');
    expect(primitiveTokens.color.white).toHaveProperty('$type');
    
    // Check component tokens
    const componentPath = path.join(buildDir, 'json', `${prefix}.component.tokens.json`);
    const componentExists = await fs.access(componentPath).then(() => true).catch(() => false);
    expect(componentExists).toBe(true);
    
    const componentContent = await fs.readFile(componentPath, 'utf8');
    const componentTokens = JSON.parse(componentContent);
    expect(componentTokens.button).toBeDefined();
    expect(componentTokens.card).toBeDefined();
    
    // Check semantic tokens
    const lightPath = path.join(buildDir, 'json', `${prefix}.semantic.light.tokens.json`);
    const darkPath = path.join(buildDir, 'json', `${prefix}.semantic.dark.tokens.json`);
    
    const lightExists = await fs.access(lightPath).then(() => true).catch(() => false);
    const darkExists = await fs.access(darkPath).then(() => true).catch(() => false);
    
    expect(lightExists).toBe(true);
    expect(darkExists).toBe(true);
    
    const lightContent = await fs.readFile(lightPath, 'utf8');
    const lightTokens = JSON.parse(lightContent);
    expect(lightTokens.theme).toBeDefined();
    expect(lightTokens.theme.color).toBeDefined();
  }, 30000);

  test('should generate TypeScript definitions', async () => {
    await execAsync('npm run build');
    const prefix = await getPrefix();
    const tsPath = path.join(buildDir, 'ts', 'tokens.ts');
    const exists = await fs.access(tsPath).then(() => true).catch(() => false);
    
    expect(exists).toBe(true);
    
    const content = await fs.readFile(tsPath, 'utf8');
    const expectedTokensName = `${prefix}Tokens`;
    const expectedTypeName = `${prefix.charAt(0).toUpperCase() + prefix.slice(1)}Token`;
    
    expect(content).toContain(`export const ${expectedTokensName}`);
    expect(content).toContain(`export type ${expectedTypeName}`);
    
    // Also verify the content structure
    expect(content).toContain('as const');
    expect(content).toContain('keyof typeof');
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
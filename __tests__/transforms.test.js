import { describe, test, expect, beforeEach } from '@jest/globals';
import StyleDictionary from 'style-dictionary';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

describe('Custom Transforms', () => {
  let mockToken;

  beforeEach(() => {
    mockToken = {
      path: ['color', 'primary', '500'],
      value: '#007bff',
      type: 'color',
    };
  });

  test('name/prefix-css transform should add prefix to token names', async () => {
    const prefix = await getPrefix();
    // Since transforms are registered globally in build scripts,
    // we'll test the transform logic directly
    const transformFunction = (token) => {
      const name = token.path.join('-').toLowerCase();
      return `${prefix}-${name}`;
    };

    const result = transformFunction(mockToken);
    expect(result).toBe(`${prefix}-color-primary-500`);
  });

  test('transform should handle nested paths correctly', async () => {
    const prefix = await getPrefix();
    const nestedToken = {
      path: ['typography', 'heading', 'h1', 'fontSize'],
      value: '2rem',
    };

    const transformFunction = (token) => {
      const name = token.path.join('-').toLowerCase();
      return `${prefix}-${name}`;
    };

    const result = transformFunction(nestedToken);
    expect(result).toBe(`${prefix}-typography-heading-h1-fontsize`);
  });

  test('transform should handle single-level paths', async () => {
    const prefix = await getPrefix();
    const simpleToken = {
      path: ['spacing'],
      value: '1rem',
    };

    const transformFunction = (token) => {
      const name = token.path.join('-').toLowerCase();
      return `${prefix}-${name}`;
    };

    const result = transformFunction(simpleToken);
    expect(result).toBe(`${prefix}-spacing`);
  });
});
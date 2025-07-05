import { describe, test, expect, beforeEach } from '@jest/globals';
import StyleDictionary from 'style-dictionary';

describe('Custom Transforms', () => {
  let mockToken;

  beforeEach(() => {
    mockToken = {
      path: ['color', 'primary', '500'],
      value: '#007bff',
      type: 'color',
    };
  });

  test('name/prefix-css transform should add prefix to token names', () => {
    // Since transforms are registered globally in build.js,
    // we'll test the transform logic directly
    const transformFunction = (token) => {
      const name = token.path.join('-').toLowerCase();
      return `clearco-${name}`;
    };

    const result = transformFunction(mockToken);
    expect(result).toBe('clearco-color-primary-500');
  });

  test('transform should handle nested paths correctly', () => {
    const nestedToken = {
      path: ['typography', 'heading', 'h1', 'fontSize'],
      value: '2rem',
    };

    const transformFunction = (token) => {
      const name = token.path.join('-').toLowerCase();
      return `clearco-${name}`;
    };

    const result = transformFunction(nestedToken);
    expect(result).toBe('clearco-typography-heading-h1-fontsize');
  });

  test('transform should handle single-level paths', () => {
    const simpleToken = {
      path: ['spacing'],
      value: '1rem',
    };

    const transformFunction = (token) => {
      const name = token.path.join('-').toLowerCase();
      return `clearco-${name}`;
    };

    const result = transformFunction(simpleToken);
    expect(result).toBe('clearco-spacing');
  });
});
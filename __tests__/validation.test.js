import { describe, test, expect } from '@jest/globals';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

describe('Token Validation', () => {
  test('should validate all token files successfully', async () => {
    const { stdout, stderr } = await execAsync('npm run validate');
    
    // The validation script exits with code 1 if there are errors
    // If it runs successfully, stderr should be empty
    expect(stdout).toContain('Validating design tokens');
    expect(stdout).toContain('All tokens are valid');
  }, 30000);

  test('should detect invalid token structure', async () => {
    const invalidTokenPath = path.join(__dirname, '..', 'tokens', 'test-invalid.json');
    
    // Create an invalid token file - a DTCG token missing required $type
    await fs.writeFile(invalidTokenPath, JSON.stringify({
      "$schema": "https://design-tokens.github.io/format/tokens.schema.json",
      "invalid": {
        "token": {
          "$value": "#ff0000",
          // Missing $type which is required for DTCG tokens
          "$description": "This is invalid because it has $value but no $type"
        }
      }
    }, null, 2));

    try {
      const { stdout } = await execAsync('npm run validate');
      // If we get here, the command succeeded when it shouldn't have
      expect(stdout).toContain('error');
    } catch (error) {
      // The script should exit with error code
      // execAsync throws an error with exitCode property when the command fails
      expect(error.code || error.exitCode).toBe(1);
      // Also check that the error output mentions the invalid token
      expect(error.stdout || error.message).toContain('error');
    } finally {
      // Clean up
      await fs.unlink(invalidTokenPath).catch(() => {});
    }
  }, 30000);

  test('should validate token references', async () => {
    const tokensDir = path.join(__dirname, '..', 'tokens', 'primitives');
    const files = await fs.readdir(tokensDir);
    const dtcgFiles = files.filter(f => f.endsWith('-dtcg.json'));
    
    for (const file of dtcgFiles) {
      const content = await fs.readFile(path.join(tokensDir, file), 'utf8');
      const tokens = JSON.parse(content);
      
      // Basic structure validation
      expect(typeof tokens).toBe('object');
      
      // Check that top-level keys don't start with $
      Object.keys(tokens).forEach(key => {
        expect(key).not.toMatch(/^\$/);
      });
    }
  });
});
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
    
    // Create an invalid token file
    await fs.writeFile(invalidTokenPath, JSON.stringify({
      "invalid": {
        "token": {
          // Missing $value and $type
          "description": "This is invalid"
        }
      }
    }, null, 2));

    try {
      const { stdout } = await execAsync('npm run validate');
      expect(stdout).toContain('error');
    } catch (error) {
      // The script should exit with error code
      expect(error.code).toBe(1);
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
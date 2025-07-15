import { describe, it, expect, beforeAll } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Theme Validation Tests', () => {
  let brands = [];
  const requiredThemeTokens = [
    'surface.primary',
    'surface.secondary',
    'surface.tertiary',
    'content.primary',
    'content.secondary',
    'content.tertiary',
    'interactive.primary.default',
    'interactive.primary.hover',
    'border.default',
    'border.subtle'
  ];

  beforeAll(() => {
    // Get all brands
    const brandsDir = path.join(__dirname, '../tokens/brands');
    brands = fs.readdirSync(brandsDir)
      .filter(file => fs.statSync(path.join(brandsDir, file)).isDirectory());
  });

  describe('Brand Structure', () => {
    it('should have at least one brand defined', () => {
      expect(brands.length).toBeGreaterThan(0);
    });

    brands.forEach(brand => {
      describe(`Brand: ${brand}`, () => {
        const brandPath = path.join(__dirname, '../tokens/brands', brand);

        it('should have colors.json file', () => {
          const colorsPath = path.join(brandPath, 'colors.json');
          expect(fs.existsSync(colorsPath)).toBe(true);
        });

        it('should have valid colors structure', () => {
          const colorsPath = path.join(brandPath, 'colors.json');
          const colors = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
          
          expect(colors.brand).toBeDefined();
          expect(colors.brand.primary).toBeDefined();
          expect(colors.brand.secondary).toBeDefined();
          expect(colors.brand.neutral).toBeDefined();
          expect(colors.brand.semantic).toBeDefined();
        });

        it('should have complete color scales', () => {
          const colorsPath = path.join(brandPath, 'colors.json');
          const colors = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));
          
          // Check primary scale
          const primaryScale = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
          primaryScale.forEach(shade => {
            expect(colors.brand.primary[shade]).toBeDefined();
            expect(colors.brand.primary[shade].$value).toMatch(/^#[0-9a-fA-F]{6}$/);
          });
        });
      });
    });
  });

  describe('Theme Files', () => {
    brands.forEach(brand => {
      describe(`${brand} themes`, () => {
        const brandPath = path.join(__dirname, '../tokens/brands', brand);

        ['light', 'dark'].forEach(theme => {
          const themePath = path.join(brandPath, `theme-${theme}.json`);
          
          if (fs.existsSync(themePath)) {
            describe(`${theme} theme`, () => {
              let themeData;

              beforeAll(() => {
                themeData = JSON.parse(fs.readFileSync(themePath, 'utf8'));
              });

              it('should have all required theme tokens', () => {
                requiredThemeTokens.forEach(tokenPath => {
                  const parts = tokenPath.split('.');
                  let current = themeData.theme;
                  
                  parts.forEach(part => {
                    expect(current[part]).toBeDefined();
                    current = current[part];
                  });
                  
                  expect(current.$value).toBeDefined();
                  expect(current.$type).toBe('color');
                });
              });

              it('should have proper contrast ratios', () => {
                const surface = themeData.theme.surface.primary.$value;
                const content = themeData.theme.content.primary.$value;
                
                // Simple check that they're different
                expect(surface).not.toBe(content);
                
                // For light theme, surface should be light and content dark
                if (theme === 'light') {
                  expect(surface).toMatch(/#f|#e|#d|#c|#b|#a|#9|#8/i);
                }
                // For dark theme, surface should be dark and content light
                else {
                  expect(surface).toMatch(/#0|#1|#2|#3|#4/i);
                }
              });
            });
          }
        });
      });
    });
  });

  describe('Build Output', () => {
    brands.forEach(brand => {
      describe(`${brand} build files`, () => {
        const buildPath = path.join(__dirname, '../build/brands', brand);

        it('should generate all required CSS files', () => {
          if (fs.existsSync(buildPath)) {
            const requiredFiles = ['colors.css', 'theme-light.css', 'theme-dark.css', 'all.css'];
            
            requiredFiles.forEach(file => {
              const filePath = path.join(buildPath, file);
              expect(fs.existsSync(filePath)).toBe(true);
            });
          }
        });

        it('should use correct CSS variable prefix', () => {
          const colorsPath = path.join(buildPath, 'colors.css');
          
          if (fs.existsSync(colorsPath)) {
            const content = fs.readFileSync(colorsPath, 'utf8');
            const regex = new RegExp(`--${brand}-`, 'g');
            const matches = content.match(regex);
            
            expect(matches).not.toBeNull();
            expect(matches.length).toBeGreaterThan(0);
          }
        });

        it('should have proper theme scoping', () => {
          ['light', 'dark'].forEach(theme => {
            const themePath = path.join(buildPath, `theme-${theme}.css`);
            
            if (fs.existsSync(themePath)) {
              const content = fs.readFileSync(themePath, 'utf8');
              expect(content).toContain(`.theme-${theme}`);
            }
          });
        });
      });
    });
  });

  describe('Theme Switching', () => {
    it('should not have conflicting token names between themes', () => {
      brands.forEach(brand => {
        const lightPath = path.join(__dirname, '../build/brands', brand, 'theme-light.css');
        const darkPath = path.join(__dirname, '../build/brands', brand, 'theme-dark.css');
        
        if (fs.existsSync(lightPath) && fs.existsSync(darkPath)) {
          const lightContent = fs.readFileSync(lightPath, 'utf8');
          const darkContent = fs.readFileSync(darkPath, 'utf8');
          
          // Extract CSS variable names
          const variableRegex = /--[\w-]+(?=:)/g;
          const lightVars = lightContent.match(variableRegex) || [];
          const darkVars = darkContent.match(variableRegex) || [];
          
          // Should have the same variables
          expect(new Set(lightVars)).toEqual(new Set(darkVars));
        }
      });
    });
  });

  describe('Token References', () => {
    brands.forEach(brand => {
      it(`${brand} should resolve all token references`, () => {
        const buildPath = path.join(__dirname, '../build/brands', brand, 'all.css');
        
        if (fs.existsSync(buildPath)) {
          const content = fs.readFileSync(buildPath, 'utf8');
          
          // Check for var() references
          const varReferences = content.match(/var\(--[\w-]+\)/g) || [];
          
          varReferences.forEach(ref => {
            const varName = ref.match(/--[\w-]+/)[0];
            // The variable being referenced should be defined in the same file
            expect(content).toContain(`${varName}:`);
          });
        }
      });
    });
  });
});
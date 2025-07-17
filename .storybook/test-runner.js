const { injectAxe, checkA11y } = require('axe-playwright');

module.exports = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page) {
    // Add visual regression tests
    await page.waitForTimeout(500); // Wait for animations
    
    // Check accessibility
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
    
    // Custom token validation tests
    const tokenTests = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      // Test critical tokens exist
      const criticalTokens = [
        '--mantine-color-primary',
        '--mantine-color-background',
        '--mantine-color-text-primary',
        '--mantine-spacing-md',
        '--mantine-radius-md',
        '--mantine-typography-fontfamily-sans'
      ];
      
      const results = {};
      criticalTokens.forEach(token => {
        const value = computedStyle.getPropertyValue(token);
        results[token] = {
          exists: !!value,
          value: value || 'NOT FOUND'
        };
      });
      
      return results;
    });
    
    // Verify all critical tokens exist
    Object.entries(tokenTests).forEach(([token, result]) => {
      if (!result.exists) {
        throw new Error(`Critical token ${token} not found!`);
      }
    });
  },
};
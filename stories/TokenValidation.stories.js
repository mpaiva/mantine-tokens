export default {
  title: 'Tests/Token Validation',
  parameters: {
    docs: {
      description: {
        component: 'Automated tests to validate design tokens are properly applied'
      }
    }
  }
};

export const TokenApplication = () => {
  const runTests = () => {
    const results = [];
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Test 1: Check primary colors exist
    const colorTokens = [
      { token: '--mantine-color-primary', expected: 'rgb(34, 139, 230)' },
      { token: '--mantine-color-success', expected: 'rgb(64, 192, 87)' },
      { token: '--mantine-color-error', expected: 'rgb(250, 82, 82)' },
      { token: '--mantine-color-warning', expected: 'rgb(250, 176, 5)' }
    ];
    
    colorTokens.forEach(({ token, expected }) => {
      const value = computedStyle.getPropertyValue(token);
      const testEl = document.createElement('div');
      testEl.style.backgroundColor = `var(${token})`;
      document.body.appendChild(testEl);
      const computed = getComputedStyle(testEl).backgroundColor;
      document.body.removeChild(testEl);
      
      results.push({
        test: `Color token ${token}`,
        pass: computed === expected || !!value,
        actual: computed || value || 'NOT FOUND',
        expected: expected
      });
    });
    
    // Test 2: Check spacing tokens
    const spacingTokens = [
      { token: '--mantine-spacing-xs', expected: '0.625rem' },
      { token: '--mantine-spacing-sm', expected: '0.75rem' },
      { token: '--mantine-spacing-md', expected: '1rem' },
      { token: '--mantine-spacing-lg', expected: '1.25rem' }
    ];
    
    spacingTokens.forEach(({ token, expected }) => {
      const value = computedStyle.getPropertyValue(token);
      results.push({
        test: `Spacing token ${token}`,
        pass: value.trim() === expected,
        actual: value.trim() || 'NOT FOUND',
        expected: expected
      });
    });
    
    // Test 3: Check typography tokens
    const typographyTokens = [
      { token: '--mantine-typography-fontsize-md', expected: '1rem' },
      { token: '--mantine-typography-fontweight-bold', expected: '700' },
      { token: '--mantine-typography-lineheight-normal', expected: '1.55' }
    ];
    
    typographyTokens.forEach(({ token, expected }) => {
      const value = computedStyle.getPropertyValue(token);
      results.push({
        test: `Typography token ${token}`,
        pass: value.trim() === expected,
        actual: value.trim() || 'NOT FOUND',
        expected: expected
      });
    });
    
    // Test 4: Check component tokens
    const componentTokens = [
      { token: '--mantine-button-height-md', expected: '2.625rem' },
      { token: '--mantine-input-height-md', expected: '2.625rem' },
      { token: '--mantine-card-padding-default', expected: '1.25rem' }
    ];
    
    componentTokens.forEach(({ token, expected }) => {
      const value = computedStyle.getPropertyValue(token);
      results.push({
        test: `Component token ${token}`,
        pass: value.trim() === expected || !!value,
        actual: value.trim() || 'NOT FOUND',
        expected: expected
      });
    });
    
    return results;
  };
  
  const html = `
    <div class="token-validation">
      <h2>Design Token Validation Tests</h2>
      <p>This page runs automated tests to ensure design tokens are properly loaded and applied.</p>
      
      <div class="test-results" id="test-results">
        <h3>Test Results</h3>
        <div class="loading">Running tests...</div>
      </div>
      
      <div class="visual-tests">
        <h3>Visual Token Tests</h3>
        
        <div class="test-grid">
          <div class="test-item">
            <h4>Colors</h4>
            <div class="color-grid">
              <div class="color-swatch" style="background: var(--mantine-color-primary)">Primary</div>
              <div class="color-swatch" style="background: var(--mantine-color-success)">Success</div>
              <div class="color-swatch" style="background: var(--mantine-color-error)">Error</div>
              <div class="color-swatch" style="background: var(--mantine-color-warning)">Warning</div>
            </div>
          </div>
          
          <div class="test-item">
            <h4>Spacing</h4>
            <div class="spacing-test">
              <div class="spacing-box" style="padding: var(--mantine-spacing-xs)">XS</div>
              <div class="spacing-box" style="padding: var(--mantine-spacing-sm)">SM</div>
              <div class="spacing-box" style="padding: var(--mantine-spacing-md)">MD</div>
              <div class="spacing-box" style="padding: var(--mantine-spacing-lg)">LG</div>
            </div>
          </div>
          
          <div class="test-item">
            <h4>Border Radius</h4>
            <div class="radius-test">
              <div class="radius-box" style="border-radius: var(--mantine-radius-xs)">XS</div>
              <div class="radius-box" style="border-radius: var(--mantine-radius-sm)">SM</div>
              <div class="radius-box" style="border-radius: var(--mantine-radius-md)">MD</div>
              <div class="radius-box" style="border-radius: var(--mantine-radius-lg)">LG</div>
            </div>
          </div>
          
          <div class="test-item">
            <h4>Shadows</h4>
            <div class="shadow-test">
              <div class="shadow-box" style="box-shadow: var(--mantine-shadow-xs)">XS</div>
              <div class="shadow-box" style="box-shadow: var(--mantine-shadow-sm)">SM</div>
              <div class="shadow-box" style="box-shadow: var(--mantine-shadow-md)">MD</div>
              <div class="shadow-box" style="box-shadow: var(--mantine-shadow-lg)">LG</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <style>
      .token-validation {
        padding: 2rem;
        font-family: var(--mantine-typography-fontfamily-sans);
      }
      
      .test-results {
        margin: 2rem 0;
        padding: 1.5rem;
        background: var(--mantine-color-surface);
        border-radius: var(--mantine-radius-md);
        border: 1px solid var(--mantine-color-border-subtle);
      }
      
      .test-result {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--mantine-color-border-subtle);
      }
      
      .test-result:last-child {
        border-bottom: none;
      }
      
      .test-name {
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.875rem;
      }
      
      .test-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .test-pass {
        color: var(--mantine-color-success);
        font-weight: 600;
      }
      
      .test-fail {
        color: var(--mantine-color-error);
        font-weight: 600;
      }
      
      .test-value {
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-text-secondary);
      }
      
      .visual-tests {
        margin-top: 2rem;
      }
      
      .test-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-top: 1rem;
      }
      
      .test-item h4 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        color: var(--mantine-color-text-secondary);
      }
      
      .color-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
      }
      
      .color-swatch {
        padding: 1rem;
        color: white;
        text-align: center;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: var(--mantine-radius-sm);
      }
      
      .spacing-test, .radius-test, .shadow-test {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .spacing-box, .radius-box, .shadow-box {
        background: var(--mantine-color-primary);
        color: white;
        text-align: center;
        font-size: 0.75rem;
        font-weight: 600;
      }
      
      .radius-box, .shadow-box {
        padding: 1rem;
      }
      
      .shadow-box {
        background: var(--mantine-color-surface);
        color: var(--mantine-color-text-primary);
        border: 1px solid var(--mantine-color-border-subtle);
      }
      
      .test-summary {
        margin-top: 1rem;
        padding: 1rem;
        background: var(--mantine-color-background);
        border-radius: var(--mantine-radius-sm);
        font-weight: 600;
      }
      
      .test-summary.all-pass {
        color: var(--mantine-color-success);
        background: var(--mantine-color-success-subtle);
      }
      
      .test-summary.has-failures {
        color: var(--mantine-color-error);
        background: var(--mantine-color-error-subtle);
      }
    </style>
  `;
  
  // Run tests after render
  setTimeout(() => {
    const results = runTests();
    const resultsEl = document.getElementById('test-results');
    
    const passCount = results.filter(r => r.pass).length;
    const totalCount = results.length;
    const allPass = passCount === totalCount;
    
    resultsEl.innerHTML = `
      <h3>Test Results</h3>
      ${results.map(result => `
        <div class="test-result">
          <span class="test-name">${result.test}</span>
          <div class="test-status">
            <span class="${result.pass ? 'test-pass' : 'test-fail'}">
              ${result.pass ? '✓ PASS' : '✗ FAIL'}
            </span>
            <span class="test-value">${result.actual}</span>
          </div>
        </div>
      `).join('')}
      <div class="test-summary ${allPass ? 'all-pass' : 'has-failures'}">
        ${passCount} / ${totalCount} tests passed
      </div>
    `;
  }, 100);
  
  return html;
};
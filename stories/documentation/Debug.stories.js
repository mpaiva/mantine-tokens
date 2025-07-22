export default {
  title: 'Documentation/Debug Tools',
};

export const CheckTokens = () => {
  const checkTokens = () => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    const tokens = [
      '--mantine-color-primary',
      '--mantine-color-gray-500',
      '--mantine-spacing-md',
      '--mantine-radius-md',
      '--mantine-typography-fontfamily-sans'
    ];
    
    const results = tokens.map(token => {
      const value = computedStyle.getPropertyValue(token);
      return { token, value: value || 'NOT FOUND' };
    });
    
    return results;
  };
  
  const html = `
    <div class="debug-container">
      <h2>CSS Token Check</h2>
      <p>Checking if CSS variables are loaded...</p>
      
      <div class="token-check">
        <h3>Token Values:</h3>
        <ul id="token-list">
          <li>Loading...</li>
        </ul>
      </div>
      
      <div class="visual-check">
        <h3>Visual Tests:</h3>
        <div class="test-box" style="
          padding: var(--mantine-spacing-md, 16px);
          background: var(--mantine-color-primary, #228be6);
          color: white;
          border-radius: var(--mantine-radius-md, 8px);
        ">
          This box should have primary color background
        </div>
        
        <div class="test-box" style="
          margin-top: var(--mantine-spacing-md, 16px);
          padding: var(--mantine-spacing-lg, 20px);
          background: var(--mantine-color-surface, #f8f9fa);
          border: 1px solid var(--mantine-color-border, #dee2e6);
          border-radius: var(--mantine-radius-sm, 4px);
        ">
          This box should have surface background with border
        </div>
      </div>
      
      <div class="css-links">
        <h3>CSS Files Status:</h3>
        <ul>
          <li><a href="/css/variables.css" target="_blank">/css/variables.css</a></li>
          <li><a href="/css/theme-light.css" target="_blank">/css/theme-light.css</a></li>
          <li><a href="/css/theme-dark.css" target="_blank">/css/theme-dark.css</a></li>
        </ul>
      </div>
    </div>
    
    <style>
      .debug-container {
        padding: 2rem;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      }
      
      .token-check, .visual-check, .css-links {
        margin: 2rem 0;
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 8px;
      }
      
      .test-box {
        padding: 1rem;
      }
      
      #token-list {
        font-family: monospace;
        font-size: 0.875rem;
      }
      
      #token-list li {
        margin: 0.5rem 0;
      }
      
      .css-links a {
        color: #228be6;
        text-decoration: none;
      }
      
      .css-links a:hover {
        text-decoration: underline;
      }
    </style>
  `;
  
  // Check tokens after render
  setTimeout(() => {
    const results = checkTokens();
    const listEl = document.getElementById('token-list');
    if (listEl) {
      listEl.innerHTML = results.map(r => 
        `<li><strong>${r.token}:</strong> ${r.value}</li>`
      ).join('');
    }
  }, 100);
  
  return html;
};
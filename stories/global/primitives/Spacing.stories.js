export default {
  title: 'Global/Primitives/Spacing',
  parameters: {
    docs: {
      description: {
        component: 'Spacing scale for consistent layout and component spacing'
      }
    }
  }
};

export const SpacingScale = () => {
  return `
    <div class="spacing-section">
      <h2>Spacing Scale</h2>
      <p class="section-description">Click any spacing to copy the CSS variable</p>
      
      <div class="spacing-list" id="spacing-list">
        <!-- Will be populated by JavaScript -->
      </div>
      
      <button class="refresh-btn" onclick="refreshTokenValues()">
        🔄 Refresh Values
      </button>
    </div>
    
    <style>
      .spacing-section {
        padding: 1rem;
        font-family: var(--mantine-font-family-body);
      }
      
      .spacing-section h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1.5rem;
        font-weight: 600;
      }
      
      .section-description {
        margin: 0 0 2rem 0;
        color: var(--mantine-color-text-secondary);
        font-size: 0.875rem;
      }
      
      .spacing-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .spacing-item {
        display: grid;
        grid-template-columns: 120px 1fr auto;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
        cursor: pointer;
        transition: all 150ms ease;
      }
      
      .spacing-item:hover {
        box-shadow: var(--mantine-shadow-sm);
        border-color: var(--mantine-color-border);
      }
      
      .spacing-item.copied {
        border-color: var(--mantine-color-success);
        background: var(--mantine-color-success-subtle);
      }
      
      .spacing-info {
        display: grid;
        grid-template-columns: 2rem 3rem 3rem;
        gap: 0.5rem;
        align-items: center;
      }
      
      .spacing-name {
        font-weight: 600;
        font-size: 0.875rem;
      }
      
      .spacing-value {
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-text-secondary);
      }
      
      .spacing-pixels {
        font-size: 0.75rem;
        color: var(--mantine-color-text-tertiary);
      }
      
      .spacing-visual {
        flex: 1;
        height: 32px;
        display: flex;
        align-items: center;
      }
      
      .spacing-bar {
        height: 100%;
        background: var(--mantine-color-primary);
        border-radius: var(--mantine-radius-sm);
        min-width: 2px;
        transition: width 300ms ease;
      }
      
      .spacing-var {
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-text-secondary);
        padding: 0.25rem 0.5rem;
        background: var(--mantine-color-background);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-xs);
      }
      
      .refresh-btn {
        margin-top: 1.5rem;
        padding: 0.5rem 1rem;
        background: var(--mantine-color-primary);
        color: white;
        border: none;
        border-radius: var(--mantine-radius-md);
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        transition: opacity 200ms;
      }
      
      .refresh-btn:hover {
        opacity: 0.9;
      }
    </style>
    
    <script type="module">
      import { getTokenValue, parseSizeValue, watchTokenChanges, refreshTokenValues } from '/.storybook/token-value-reader.js';
      
      window.refreshTokenValues = refreshTokenValues;
      
      // Common spacing tokens
      const spacingTokens = ['0', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
      
      function renderSpacings() {
        const container = document.getElementById('spacing-list');
        const currentBrand = document.body.getAttribute('data-brand') || 'mantine';
        
        // Check for custom spacing tokens if not mantine
        const prefix = currentBrand === 'mantine' ? 'mantine' : currentBrand;
        
        container.innerHTML = spacingTokens.map(name => {
          const token = \`\${prefix}-spacing-\${name}\`;
          const value = getTokenValue(token);
          
          if (!value) return ''; // Skip if token doesn't exist
          
          const parsed = parseSizeValue(value);
          
          return \`
            <div class="spacing-item" data-var="--\${token}">
              <div class="spacing-info">
                <span class="spacing-name">\${name}</span>
                <span class="spacing-value">\${parsed.rem}</span>
                <span class="spacing-pixels">\${parsed.px}</span>
              </div>
              <div class="spacing-visual">
                <div class="spacing-bar" style="width: var(--\${token})"></div>
              </div>
              <code class="spacing-var">var(--\${token})</code>
            </div>
          \`;
        }).filter(Boolean).join('');
        
        // Add click handlers
        document.querySelectorAll('.spacing-item').forEach(item => {
          item.addEventListener('click', async () => {
            const cssVar = item.dataset.var;
            try {
              await navigator.clipboard.writeText(cssVar);
              
              // Visual feedback
              item.classList.add('copied');
              const name = item.querySelector('.spacing-name');
              const originalText = name.textContent;
              name.textContent = 'Copied!';
              
              setTimeout(() => {
                name.textContent = originalText;
                item.classList.remove('copied');
              }, 1500);
            } catch (err) {
              console.error('Failed to copy:', err);
            }
          });
        });
      }
      
      // Initial render
      setTimeout(renderSpacings, 100);
      
      // Watch for changes
      const cleanup = watchTokenChanges(renderSpacings);
    </script>
  `;
};

export const SpacingUsage = () => {
  return `
    <div class="spacing-section">
      <h2>Spacing Usage Examples</h2>
      <p class="section-description">Examples of how spacing tokens are used in layouts</p>
      
      <div class="usage-examples">
        <div class="example-section">
          <h3>Component Padding</h3>
          <div class="example-grid">
            <div class="example-item" style="padding: var(--mantine-spacing-xs)">
              <div class="example-content">xs padding</div>
            </div>
            <div class="example-item" style="padding: var(--mantine-spacing-sm)">
              <div class="example-content">sm padding</div>
            </div>
            <div class="example-item" style="padding: var(--mantine-spacing-md)">
              <div class="example-content">md padding</div>
            </div>
            <div class="example-item" style="padding: var(--mantine-spacing-lg)">
              <div class="example-content">lg padding</div>
            </div>
          </div>
        </div>
        
        <div class="example-section">
          <h3>Gap Between Elements</h3>
          <div class="gap-examples">
            <div class="gap-example" style="gap: var(--mantine-spacing-xs)">
              <div class="gap-item">Item</div>
              <div class="gap-item">Item</div>
              <div class="gap-item">Item</div>
              <span class="gap-label">xs gap</span>
            </div>
            <div class="gap-example" style="gap: var(--mantine-spacing-md)">
              <div class="gap-item">Item</div>
              <div class="gap-item">Item</div>
              <div class="gap-item">Item</div>
              <span class="gap-label">md gap</span>
            </div>
            <div class="gap-example" style="gap: var(--mantine-spacing-xl)">
              <div class="gap-item">Item</div>
              <div class="gap-item">Item</div>
              <div class="gap-item">Item</div>
              <span class="gap-label">xl gap</span>
            </div>
          </div>
        </div>
        
        <div class="example-section">
          <h3>Margin Stacking</h3>
          <div class="margin-examples">
            <div class="margin-item" style="margin-bottom: var(--mantine-spacing-xs)">
              Paragraph with xs margin
            </div>
            <div class="margin-item" style="margin-bottom: var(--mantine-spacing-md)">
              Paragraph with md margin
            </div>
            <div class="margin-item" style="margin-bottom: var(--mantine-spacing-lg)">
              Paragraph with lg margin
            </div>
            <div class="margin-item">
              Last paragraph
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <style>
      .usage-examples {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
      }
      
      .example-section h3 {
        margin: 0 0 1rem 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--mantine-color-text-secondary);
      }
      
      .example-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
      }
      
      .example-item {
        background: var(--mantine-color-surface);
        border: 2px solid var(--mantine-color-primary);
        border-radius: var(--mantine-radius-md);
      }
      
      .example-content {
        background: var(--mantine-color-primary-subtle);
        padding: 0.5rem;
        text-align: center;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--mantine-color-primary);
        border-radius: var(--mantine-radius-sm);
      }
      
      .gap-examples {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .gap-example {
        display: flex;
        align-items: center;
        padding: 1rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
      }
      
      .gap-item {
        padding: 0.5rem 1rem;
        background: var(--mantine-color-primary);
        color: white;
        border-radius: var(--mantine-radius-sm);
        font-size: 0.875rem;
        font-weight: 500;
      }
      
      .gap-label {
        margin-left: auto;
        font-size: 0.75rem;
        color: var(--mantine-color-text-tertiary);
        font-family: var(--mantine-typography-fontfamily-mono);
      }
      
      .margin-examples {
        padding: 1.5rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
      }
      
      .margin-item {
        padding: 1rem;
        background: var(--mantine-color-background);
        border: 1px solid var(--mantine-color-border);
        border-radius: var(--mantine-radius-sm);
        font-size: 0.875rem;
      }
    </style>
  `;
};

export const CustomSpacing = () => {
  return `
    <div class="spacing-section">
      <h2>Custom Spacing Tokens</h2>
      <p class="section-description">Additional spacing tokens available in custom/brand configurations</p>
      
      <div id="custom-spacing-list" class="spacing-list">
        <!-- Will be populated by JavaScript -->
      </div>
      
      <div id="no-custom-message" style="display: none;">
        <p class="no-custom-text">No custom spacing tokens found for the current brand.</p>
        <p class="no-custom-hint">Custom spacing tokens are typically found in brand-specific token files.</p>
      </div>
      
      <button class="refresh-btn" onclick="refreshTokenValues()">
        🔄 Refresh Values
      </button>
    </div>
    
    <style>
      .no-custom-text {
        padding: 2rem;
        text-align: center;
        color: var(--mantine-color-text-secondary);
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
        margin: 0 0 1rem 0;
      }
      
      .no-custom-hint {
        text-align: center;
        font-size: 0.875rem;
        color: var(--mantine-color-text-tertiary);
        margin: 0;
      }
    </style>
    
    <script type="module">
      import { getTokenValue, getTokensByPattern, parseSizeValue, watchTokenChanges, refreshTokenValues } from '/.storybook/token-value-reader.js';
      
      window.refreshTokenValues = refreshTokenValues;
      
      // Extended spacing tokens that might exist in custom configurations
      const customSpacingTokens = ['xxs', '4xl', '5xl', '6xl', 'section', 'page'];
      
      function renderCustomSpacings() {
        const container = document.getElementById('custom-spacing-list');
        const messageContainer = document.getElementById('no-custom-message');
        const currentBrand = document.body.getAttribute('data-brand') || 'mantine';
        
        // Try to find custom spacing tokens
        const prefix = currentBrand === 'mantine' ? 'custom' : currentBrand;
        const foundTokens = [];
        
        // Check standard custom tokens
        customSpacingTokens.forEach(name => {
          const token = \`\${prefix}-spacing-\${name}\`;
          const value = getTokenValue(token);
          if (value) {
            foundTokens.push({ name, token, value });
          }
        });
        
        // Also check for any additional spacing tokens using pattern matching
        const allSpacingTokens = getTokensByPattern('spacing-', prefix);
        Object.entries(allSpacingTokens).forEach(([key, value]) => {
          const name = key.replace('spacing-', '');
          if (!customSpacingTokens.includes(name) && !['0', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].includes(name)) {
            foundTokens.push({ name, token: \`\${prefix}-\${key}\`, value });
          }
        });
        
        if (foundTokens.length === 0) {
          container.style.display = 'none';
          messageContainer.style.display = 'block';
          return;
        }
        
        container.style.display = 'flex';
        messageContainer.style.display = 'none';
        
        container.innerHTML = foundTokens.map(({ name, token, value }) => {
          const parsed = parseSizeValue(value);
          
          return \`
            <div class="spacing-item" data-var="--\${token}">
              <div class="spacing-info">
                <span class="spacing-name">\${name}</span>
                <span class="spacing-value">\${parsed.rem}</span>
                <span class="spacing-pixels">\${parsed.px}</span>
              </div>
              <div class="spacing-visual">
                <div class="spacing-bar" style="width: var(--\${token})"></div>
              </div>
              <code class="spacing-var">var(--\${token})</code>
            </div>
          \`;
        }).join('');
        
        // Add click handlers
        container.querySelectorAll('.spacing-item').forEach(item => {
          item.addEventListener('click', async () => {
            const cssVar = item.dataset.var;
            try {
              await navigator.clipboard.writeText(cssVar);
              
              // Visual feedback
              item.classList.add('copied');
              const name = item.querySelector('.spacing-name');
              const originalText = name.textContent;
              name.textContent = 'Copied!';
              
              setTimeout(() => {
                name.textContent = originalText;
                item.classList.remove('copied');
              }, 1500);
            } catch (err) {
              console.error('Failed to copy:', err);
            }
          });
        });
      }
      
      // Initial render
      setTimeout(renderCustomSpacings, 100);
      
      // Watch for changes
      const cleanup = watchTokenChanges(renderCustomSpacings);
    </script>
  `;
};
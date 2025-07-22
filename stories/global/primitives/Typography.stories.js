export default {
  title: 'Global/Primitives/Typography',
  parameters: {
    docs: {
      description: {
        component: 'Typography tokens including font families, sizes, weights, and line heights'
      }
    }
  }
};

export const FontFamilies = () => {
  return `
    <div class="typography-section">
      <h2>Font Families</h2>
      
      <div class="font-family-grid">
        <div class="font-family-item">
          <h3>Sans Serif</h3>
          <p class="font-demo" style="font-family: var(--mantine-typography-fontfamily-sans)">
            The quick brown fox jumps over the lazy dog
          </p>
          <code>var(--mantine-typography-fontfamily-sans)</code>
          <div class="token-value" data-token="mantine-typography-fontfamily-sans"></div>
        </div>
        
        <div class="font-family-item">
          <h3>Monospace</h3>
          <p class="font-demo" style="font-family: var(--mantine-typography-fontfamily-mono)">
            const greeting = "Hello, World!";
          </p>
          <code>var(--mantine-typography-fontfamily-mono)</code>
          <div class="token-value" data-token="mantine-typography-fontfamily-mono"></div>
        </div>
        
        <div class="font-family-item">
          <h3>Heading</h3>
          <p class="font-demo" style="font-family: var(--mantine-typography-fontfamily-heading)">
            Bold Headlines Capture Attention
          </p>
          <code>var(--mantine-typography-fontfamily-heading)</code>
          <div class="token-value" data-token="mantine-typography-fontfamily-heading"></div>
        </div>
        
        <div class="font-family-item">
          <h3>Body</h3>
          <p class="font-demo" style="font-family: var(--mantine-typography-fontfamily-body)">
            Regular body text for reading comfort
          </p>
          <code>var(--mantine-typography-fontfamily-body)</code>
          <div class="token-value" data-token="mantine-typography-fontfamily-body"></div>
        </div>
      </div>
      
      <button class="refresh-btn" onclick="refreshTokenValues()">
        🔄 Refresh Values
      </button>
    </div>
    
    <style>
      .typography-section {
        padding: 1rem;
        font-family: var(--mantine-typography-fontfamily-body);
      }
      
      .typography-section h2 {
        margin: 0 0 1.5rem 0;
        font-size: 1.5rem;
        font-weight: 600;
        font-family: var(--mantine-typography-fontfamily-heading);
      }
      
      .font-family-grid {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }
      
      .font-family-item {
        padding: 1.5rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
      }
      
      .font-family-item h3 {
        margin: 0 0 0.75rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--mantine-color-text-secondary);
        font-family: var(--mantine-typography-fontfamily-heading);
      }
      
      .font-demo {
        margin: 0 0 1rem 0;
        font-size: 1.125rem;
        line-height: 1.5;
      }
      
      .font-family-item code {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        background: var(--mantine-color-background);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-xs);
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-text-secondary);
      }
      
      .token-value {
        margin-top: 0.5rem;
        font-size: 0.75rem;
        color: var(--mantine-color-text-tertiary);
        font-family: var(--mantine-typography-fontfamily-mono);
        word-break: break-word;
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
      import { getTokenValue, getBrandAwareTokenValue, watchTokenChanges, refreshTokenValues } from '/.storybook/token-value-reader.js';
      
      window.refreshTokenValues = refreshTokenValues;
      
      function updateAllTokenValues() {
        document.querySelectorAll('.token-value[data-token]').forEach(el => {
          const token = el.dataset.token;
          const value = getTokenValue(token);
          el.textContent = value || '(not set)';
        });
      }
      
      // Initial update
      setTimeout(updateAllTokenValues, 100);
      
      // Watch for changes
      const cleanup = watchTokenChanges(updateAllTokenValues);
    </script>
  `;
};

export const FontSizes = () => {
  return `
    <div class="typography-section">
      <h2>Font Sizes</h2>
      
      <div class="size-section">
        <h3>Body Text Sizes</h3>
        <div class="size-list" id="body-sizes">
          <!-- Will be populated by JavaScript -->
        </div>
      </div>
      
      <div class="size-section">
        <h3>Heading Sizes</h3>
        <div class="size-list" id="heading-sizes">
          <!-- Will be populated by JavaScript -->
        </div>
      </div>
      
      <button class="refresh-btn" onclick="refreshTokenValues()">
        🔄 Refresh Values
      </button>
    </div>
    
    <style>
      .size-section {
        margin-bottom: 2.5rem;
      }
      
      .size-section h3 {
        margin: 0 0 1rem 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--mantine-color-text-secondary);
        font-family: var(--mantine-typography-fontfamily-heading);
      }
      
      .size-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      .size-item {
        padding: 1rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
      }
      
      .size-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 0.5rem;
      }
      
      .size-label {
        font-size: 0.75rem;
        color: var(--mantine-color-text-secondary);
      }
      
      .size-value {
        font-size: 0.75rem;
        color: var(--mantine-color-text-tertiary);
        font-family: var(--mantine-typography-fontfamily-mono);
      }
      
      .size-item code {
        display: inline-block;
        padding: 0.125rem 0.375rem;
        background: var(--mantine-color-background);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-xs);
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.625rem;
        color: var(--mantine-color-text-secondary);
      }
    </style>
    
    <script type="module">
      import { getTokenValue, getBrandAwareTokenValue, parseSizeValue, watchTokenChanges, refreshTokenValues } from '/.storybook/token-value-reader.js';
      
      window.refreshTokenValues = refreshTokenValues;
      
      const bodySizes = ['xs', 'sm', 'md', 'lg', 'xl'];
      const headingSizes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
      
      function renderFontSizes() {
        // Render body sizes
        const bodyContainer = document.getElementById('body-sizes');
        bodyContainer.innerHTML = bodySizes.map(size => {
          const token = \`mantine-typography-fontsize-\${size}\`;
          const value = getTokenValue(token);
          const parsed = parseSizeValue(value);
          
          return \`
            <div class="size-item">
              <p style="font-size: var(--\${token}); margin: 0;">
                The quick brown fox jumps over the lazy dog
              </p>
              <div class="size-info">
                <span class="size-label">\${size.toUpperCase()}</span>
                <span class="size-value">\${parsed.rem} (\${parsed.px})</span>
                <code>var(--\${token})</code>
              </div>
            </div>
          \`;
        }).join('');
        
        // Render heading sizes
        const headingContainer = document.getElementById('heading-sizes');
        headingContainer.innerHTML = headingSizes.map(size => {
          const token = \`mantine-typography-fontsize-\${size}\`;
          const value = getTokenValue(token);
          const parsed = parseSizeValue(value);
          
          return \`
            <div class="size-item">
              <p style="font-size: var(--\${token}); font-weight: var(--mantine-typography-fontweight-heading); margin: 0;">
                Heading \${size.toUpperCase()} - \${parsed.rem} (\${parsed.px})
              </p>
              <div class="size-info">
                <code>var(--\${token})</code>
              </div>
            </div>
          \`;
        }).join('');
      }
      
      // Initial render
      setTimeout(renderFontSizes, 100);
      
      // Watch for changes
      const cleanup = watchTokenChanges(renderFontSizes);
    </script>
  `;
};

export const FontWeights = () => {
  return `
    <div class="typography-section">
      <h2>Font Weights</h2>
      
      <div class="weight-grid" id="weight-grid">
        <!-- Will be populated by JavaScript -->
      </div>
      
      <button class="refresh-btn" onclick="refreshTokenValues()">
        🔄 Refresh Values
      </button>
    </div>
    
    <style>
      .weight-grid {
        display: grid;
        gap: 1rem;
      }
      
      .weight-item {
        padding: 1.25rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
      }
      
      .weight-value {
        font-size: 0.75rem;
        color: var(--mantine-color-text-tertiary);
        font-family: var(--mantine-typography-fontfamily-mono);
        margin-left: 0.5rem;
      }
      
      .weight-item code {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        background: var(--mantine-color-background);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-xs);
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-text-secondary);
      }
    </style>
    
    <script type="module">
      import { getTokenValue, watchTokenChanges, refreshTokenValues } from '/.storybook/token-value-reader.js';
      
      window.refreshTokenValues = refreshTokenValues;
      
      const weights = [
        { name: 'normal', label: 'Normal' },
        { name: 'medium', label: 'Medium' },
        { name: 'semibold', label: 'Semibold' },
        { name: 'bold', label: 'Bold' },
        { name: 'heading', label: 'Heading' }
      ];
      
      function renderFontWeights() {
        const container = document.getElementById('weight-grid');
        container.innerHTML = weights.map(weight => {
          const token = \`mantine-typography-fontweight-\${weight.name}\`;
          const value = getTokenValue(token);
          
          return \`
            <div class="weight-item">
              <p style="font-weight: var(--\${token}); font-size: 1.25rem; margin: 0 0 0.5rem 0;">
                \${weight.label} <span class="weight-value">(\${value || 'not set'})</span>
              </p>
              <p style="font-weight: var(--\${token}); margin: 0 0 0.75rem 0;">
                The quick brown fox jumps over the lazy dog
              </p>
              <code>var(--\${token})</code>
            </div>
          \`;
        }).join('');
      }
      
      // Initial render
      setTimeout(renderFontWeights, 100);
      
      // Watch for changes
      const cleanup = watchTokenChanges(renderFontWeights);
    </script>
  `;
};

export const LineHeights = () => {
  return `
    <div class="typography-section">
      <h2>Line Heights</h2>
      
      <div class="line-height-grid" id="line-height-grid">
        <!-- Will be populated by JavaScript -->
      </div>
      
      <button class="refresh-btn" onclick="refreshTokenValues()">
        🔄 Refresh Values
      </button>
    </div>
    
    <style>
      .line-height-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }
      
      .line-height-item {
        padding: 1.25rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
      }
      
      .line-height-item h3 {
        margin: 0 0 0.75rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--mantine-color-text-secondary);
        font-family: var(--mantine-typography-fontfamily-heading);
      }
      
      .line-height-value {
        font-size: 0.75rem;
        color: var(--mantine-color-text-tertiary);
        font-family: var(--mantine-typography-fontfamily-mono);
      }
      
      .line-height-item p {
        margin: 0 0 0.75rem 0;
      }
      
      .line-height-item code {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        background: var(--mantine-color-background);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-xs);
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-text-secondary);
      }
    </style>
    
    <script type="module">
      import { getTokenValue, watchTokenChanges, refreshTokenValues } from '/.storybook/token-value-reader.js';
      
      window.refreshTokenValues = refreshTokenValues;
      
      const lineHeights = [
        { name: 'tight', label: 'Tight' },
        { name: 'normal', label: 'Normal' },
        { name: 'relaxed', label: 'Relaxed' },
        { name: 'heading', label: 'Heading' }
      ];
      
      function renderLineHeights() {
        const container = document.getElementById('line-height-grid');
        container.innerHTML = lineHeights.map(lh => {
          const token = \`mantine-typography-lineheight-\${lh.name}\`;
          const value = getTokenValue(token);
          
          return \`
            <div class="line-height-item">
              <h3>\${lh.label} <span class="line-height-value">(\${value || 'not set'})</span></h3>
              <p style="line-height: var(--\${token});">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
              <code>var(--\${token})</code>
            </div>
          \`;
        }).join('');
      }
      
      // Initial render
      setTimeout(renderLineHeights, 100);
      
      // Watch for changes
      const cleanup = watchTokenChanges(renderLineHeights);
    </script>
  `;
};

export const LetterSpacing = () => {
  return `
    <div class="typography-section">
      <h2>Letter Spacing</h2>
      
      <div class="letter-spacing-grid" id="letter-spacing-grid">
        <!-- Will be populated by JavaScript -->
      </div>
      
      <button class="refresh-btn" onclick="refreshTokenValues()">
        🔄 Refresh Values
      </button>
    </div>
    
    <style>
      .letter-spacing-grid {
        display: grid;
        gap: 1rem;
      }
      
      .letter-spacing-item {
        padding: 1.25rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
      }
      
      .letter-spacing-item h3 {
        margin: 0 0 0.75rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--mantine-color-text-secondary);
        font-family: var(--mantine-typography-fontfamily-heading);
      }
      
      .letter-spacing-value {
        font-size: 0.75rem;
        color: var(--mantine-color-text-tertiary);
        font-family: var(--mantine-typography-fontfamily-mono);
      }
      
      .letter-spacing-demo {
        font-size: 1.25rem;
        margin: 0 0 0.75rem 0;
      }
      
      .letter-spacing-item code {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        background: var(--mantine-color-background);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-xs);
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-text-secondary);
      }
    </style>
    
    <script type="module">
      import { getTokenValue, watchTokenChanges, refreshTokenValues } from '/.storybook/token-value-reader.js';
      
      window.refreshTokenValues = refreshTokenValues;
      
      const letterSpacings = [
        { name: 'tight', label: 'Tight' },
        { name: 'normal', label: 'Normal' },
        { name: 'wide', label: 'Wide' },
        { name: 'heading', label: 'Heading' }
      ];
      
      function renderLetterSpacings() {
        const container = document.getElementById('letter-spacing-grid');
        container.innerHTML = letterSpacings.map(ls => {
          const token = \`mantine-typography-letterspacing-\${ls.name}\`;
          const value = getTokenValue(token);
          
          return \`
            <div class="letter-spacing-item">
              <h3>\${ls.label} <span class="letter-spacing-value">(\${value || 'not set'})</span></h3>
              <p class="letter-spacing-demo" style="letter-spacing: var(--\${token});">
                TYPOGRAPHY DEMONSTRATION
              </p>
              <p style="letter-spacing: var(--\${token});">
                The quick brown fox jumps over the lazy dog
              </p>
              <code>var(--\${token})</code>
            </div>
          \`;
        }).join('');
      }
      
      // Initial render
      setTimeout(renderLetterSpacings, 100);
      
      // Watch for changes
      const cleanup = watchTokenChanges(renderLetterSpacings);
    </script>
  `;
};
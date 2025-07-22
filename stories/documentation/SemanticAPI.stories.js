export default {
  title: 'Documentation/Semantic API Reference',
  parameters: {
    docs: {
      description: {
        component: 'Demonstration of the context-aware Semantic API token system'
      }
    }
  }
};

export const Overview = () => {
  return `
    <div class="semantic-api-demo">
      <div class="demo-header">
        <h1>Semantic API Token System</h1>
        <p class="intro">This demo shows how the Semantic API prevents the "3-Tier Trap" by providing a stable, context-aware token interface.</p>
      </div>

      <div class="demo-section">
        <h2>The Problem: Direct Primitive Usage</h2>
        <div class="problem-example">
          <div class="code-block bad">
            <div class="label">❌ Wrong Way (Fragile)</div>
            <pre><code>.button {
  background: var(--mantine-color-blue-600);  /* Breaks on rebrand */
  color: var(--mantine-color-white);         /* Breaks in dark mode */
  padding: var(--mantine-spacing-sm);         /* Breaks on mobile */
}</code></pre>
          </div>
          <div class="explanation">
            <p>Using primitive tokens directly creates fragile code that breaks when:</p>
            <ul>
              <li>Brand colors change</li>
              <li>Dark mode is added</li>
              <li>Mobile spacing differs</li>
              <li>High contrast mode is needed</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h2>The Solution: Semantic API</h2>
        <div class="solution-example">
          <div class="code-block good">
            <div class="label">✅ Right Way (Resilient)</div>
            <pre><code>.button {
  background: var(--interactive-primary-idle-background);
  color: var(--interactive-primary-idle-foreground);
  padding: var(--structure-spacing-inset-sm);
}</code></pre>
          </div>
          <div class="explanation">
            <p>Semantic API tokens automatically adapt to context:</p>
            <ul>
              <li>Resolves to brand colors</li>
              <li>Adapts to color mode</li>
              <li>Adjusts for platform</li>
              <li>Supports accessibility modes</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h2>API Categories</h2>
        <div class="api-grid">
          <div class="api-category">
            <h3>🎨 Surface</h3>
            <p>Backgrounds & containers</p>
            <code>@surface.primary.idle.background</code>
          </div>
          <div class="api-category">
            <h3>✏️ Content</h3>
            <p>Text & icons</p>
            <code>@content.primary.default</code>
          </div>
          <div class="api-category">
            <h3>💬 Feedback</h3>
            <p>States & messages</p>
            <code>@feedback.error.background.default</code>
          </div>
          <div class="api-category">
            <h3>🎯 Interactive</h3>
            <p>Buttons & inputs</p>
            <code>@interactive.primary.idle.background</code>
          </div>
          <div class="api-category">
            <h3>📐 Structure</h3>
            <p>Layout & spacing</p>
            <code>@structure.spacing.stack.md</code>
          </div>
          <div class="api-category">
            <h3>📊 Elevation</h3>
            <p>Shadows & z-index</p>
            <code>@elevation.shadow.floating</code>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h2>Key Benefits</h2>
        <div class="benefits-grid">
          <div class="benefit">
            <div class="icon">🛡️</div>
            <h4>Stable API</h4>
            <p>Token references never change, even as implementation evolves</p>
          </div>
          <div class="benefit">
            <div class="icon">🎭</div>
            <h4>Context Aware</h4>
            <p>Same token resolves differently based on theme, brand, platform</p>
          </div>
          <div class="benefit">
            <div class="icon">🔮</div>
            <h4>Future Proof</h4>
            <p>Add new contexts without breaking existing implementations</p>
          </div>
          <div class="benefit">
            <div class="icon">🚀</div>
            <h4>Type Safe</h4>
            <p>Clear boundaries between public API and private implementation</p>
          </div>
        </div>
      </div>
    </div>

    <style>
      .semantic-api-demo {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        font-family: var(--mantine-font-family-body);
      }

      .demo-header {
        text-align: center;
        margin-bottom: 3rem;
      }

      .demo-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
        color: var(--mantine-color-text-primary);
      }

      .intro {
        font-size: 1.125rem;
        color: var(--mantine-color-text-secondary);
        max-width: 700px;
        margin: 0 auto;
      }

      .demo-section {
        margin: 3rem 0;
      }

      .demo-section h2 {
        font-size: 1.75rem;
        font-weight: 600;
        margin: 0 0 1.5rem 0;
        color: var(--mantine-color-text-primary);
      }

      .problem-example,
      .solution-example {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        align-items: start;
      }

      .code-block {
        position: relative;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
        overflow: hidden;
      }

      .code-block.bad {
        border-color: var(--mantine-color-red-300);
      }

      .code-block.good {
        border-color: var(--mantine-color-green-300);
      }

      .code-block .label {
        padding: 0.5rem 1rem;
        font-weight: 600;
        font-size: 0.875rem;
        border-bottom: 1px solid var(--mantine-color-border-subtle);
      }

      .code-block.bad .label {
        background: var(--mantine-color-red-50);
        color: var(--mantine-color-red-700);
      }

      .code-block.good .label {
        background: var(--mantine-color-green-50);
        color: var(--mantine-color-green-700);
      }

      .code-block pre {
        margin: 0;
        padding: 1rem;
        overflow-x: auto;
      }

      .code-block code {
        font-family: var(--mantine-font-family-mono);
        font-size: 0.875rem;
        line-height: 1.6;
      }

      .explanation {
        padding: 1rem;
      }

      .explanation p {
        margin: 0 0 0.5rem 0;
        color: var(--mantine-color-text-primary);
      }

      .explanation ul {
        margin: 0;
        padding-left: 1.5rem;
      }

      .explanation li {
        margin: 0.25rem 0;
        color: var(--mantine-color-text-secondary);
      }

      .api-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .api-category {
        padding: 1.5rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
      }

      .api-category h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.125rem;
        font-weight: 600;
      }

      .api-category p {
        margin: 0 0 0.75rem 0;
        color: var(--mantine-color-text-secondary);
        font-size: 0.875rem;
      }

      .api-category code {
        display: block;
        padding: 0.5rem;
        background: var(--mantine-color-gray-100);
        border-radius: var(--mantine-radius-sm);
        font-family: var(--mantine-font-family-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-text-primary);
      }

      .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
      }

      .benefit {
        text-align: center;
      }

      .benefit .icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .benefit h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--mantine-color-text-primary);
      }

      .benefit p {
        margin: 0;
        color: var(--mantine-color-text-secondary);
        font-size: 0.875rem;
      }

      /* Dark mode adjustments */
      body[data-theme="dark"] .code-block.bad {
        border-color: var(--mantine-color-red-700);
      }

      body[data-theme="dark"] .code-block.good {
        border-color: var(--mantine-color-green-700);
      }

      body[data-theme="dark"] .code-block.bad .label {
        background: rgba(248, 113, 113, 0.1);
        color: var(--mantine-color-red-400);
      }

      body[data-theme="dark"] .code-block.good .label {
        background: rgba(74, 222, 128, 0.1);
        color: var(--mantine-color-green-400);
      }

      body[data-theme="dark"] .api-category code {
        background: var(--mantine-color-dark-700);
      }

      @media (max-width: 768px) {
        .problem-example,
        .solution-example {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `;
};

export const InteractiveDemo = () => {
  const html = `
    <div class="interactive-demo">
      <div class="demo-header">
        <h2>Token Resolution</h2>
        <p>Current semantic token values based on the active theme:</p>
      </div>

      <div class="context-controls">
        <div class="control-group">
          <label>Brand:</label>
          <select id="brand" onchange="updateDemo()">
            <option value="mantine">Mantine</option>
            <option value="clearco">Clearco</option>
            <option value="firstwatch">Firstwatch</option>
          </select>
        </div>
        <div class="control-group">
          <label>Platform:</label>
          <select id="platform" onchange="updateDemo()">
            <option value="web">Web</option>
            <option value="mobile">Mobile (Future)</option>
          </select>
        </div>
      </div>

      <div class="demo-grid">
        <div class="demo-card">
          <h3>Component Using Semantic API</h3>
          <div class="sample-component">
            <div class="sample-card">
              <h4>Card Title</h4>
              <p>This card uses semantic API tokens that adapt to context.</p>
              <button class="sample-button primary">Primary Action</button>
              <button class="sample-button secondary">Secondary</button>
            </div>
          </div>
          <div class="token-info">
            <h4>Tokens Used:</h4>
            <ul>
              <li><code>@surface.primary.idle.background</code></li>
              <li><code>@content.primary.default</code></li>
              <li><code>@interactive.primary.idle.background</code></li>
              <li><code>@structure.spacing.inset.md</code></li>
            </ul>
          </div>
        </div>

        <div class="demo-card">
          <h3>Token Resolution</h3>
          <div class="resolution-table">
            <table>
              <thead>
                <tr>
                  <th>Semantic Token</th>
                  <th>Resolved Value</th>
                </tr>
              </thead>
              <tbody id="tokenResolution">
                <!-- Will be populated by JavaScript -->
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="comparison-section">
        <h3>Traditional vs Semantic API</h3>
        <div class="comparison-grid">
          <div class="traditional">
            <h4>Traditional Approach</h4>
            <pre><code>/* Light mode styles */
.card {
  background: #ffffff;
  color: #000000;
}

/* Dark mode overrides */
[data-theme="dark"] .card {
  background: #1a1a1a;
  color: #ffffff;
}

/* Brand overrides */
[data-brand="clearco"] .card {
  background: #f8f9fa;
}

/* More overrides... */</code></pre>
            <p class="impact">Impact: Exponential complexity with each context</p>
          </div>
          <div class="semantic">
            <h4>Semantic API Approach</h4>
            <pre><code>/* Single definition */
.card {
  background: var(--surface-primary-idle-background);
  color: var(--content-primary-default);
}

/* That's it! Context handled automatically */</code></pre>
            <p class="impact">Impact: Zero changes needed for new contexts</p>
          </div>
        </div>
      </div>
    </div>

    <style>
      .interactive-demo {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        font-family: var(--mantine-font-family-body);
      }

      .context-controls {
        display: flex;
        gap: 2rem;
        padding: 1rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
        margin-bottom: 2rem;
      }

      .control-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .control-group label {
        font-weight: 500;
        font-size: 0.875rem;
      }

      .control-group select {
        padding: 0.25rem 0.5rem;
        border: 1px solid var(--mantine-color-border);
        border-radius: var(--mantine-radius-sm);
        background: var(--mantine-color-white);
        font-family: inherit;
      }

      .demo-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 3rem;
      }

      .demo-card {
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
        padding: 1.5rem;
      }

      .demo-card h3 {
        margin: 0 0 1rem 0;
        font-size: 1.25rem;
        font-weight: 600;
      }

      .sample-card {
        padding: 1.5rem;
        background: var(--surface-primary-idle-background, var(--mantine-color-white));
        border: 1px solid var(--structure-border-color-default, var(--mantine-color-gray-300));
        border-radius: var(--structure-border-radius-md, var(--mantine-radius-md));
        margin-bottom: 1rem;
      }

      .sample-card h4 {
        margin: 0 0 0.5rem 0;
        color: var(--content-primary-default, var(--mantine-color-black));
      }

      .sample-card p {
        margin: 0 0 1rem 0;
        color: var(--content-secondary-default, var(--mantine-color-gray-700));
      }

      .sample-button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: var(--structure-border-radius-md, var(--mantine-radius-sm));
        font-family: inherit;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 150ms ease;
        margin-right: 0.5rem;
      }

      .sample-button.primary {
        background: var(--interactive-primary-idle-background, var(--mantine-color-blue-600));
        color: var(--interactive-primary-idle-foreground, var(--mantine-color-white));
      }

      .sample-button.primary:hover {
        background: var(--interactive-primary-hover-background, var(--mantine-color-blue-700));
      }

      .sample-button.secondary {
        background: var(--interactive-secondary-idle-background, var(--mantine-color-gray-100));
        color: var(--interactive-secondary-idle-foreground, var(--mantine-color-gray-900));
      }

      .token-info {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--mantine-color-border-subtle);
      }

      .token-info h4 {
        margin: 0 0 0.5rem 0;
        font-size: 0.875rem;
        font-weight: 600;
      }

      .token-info ul {
        margin: 0;
        padding-left: 1.5rem;
      }

      .token-info code {
        font-family: var(--mantine-font-family-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-blue-700);
      }

      .resolution-table {
        overflow-x: auto;
      }

      .resolution-table table {
        width: 100%;
        border-collapse: collapse;
      }

      .resolution-table th,
      .resolution-table td {
        text-align: left;
        padding: 0.5rem;
        border-bottom: 1px solid var(--mantine-color-border-subtle);
      }

      .resolution-table th {
        font-weight: 600;
        font-size: 0.875rem;
      }

      .resolution-table td {
        font-family: var(--mantine-font-family-mono);
        font-size: 0.75rem;
      }

      .resolution-table .token-name {
        color: var(--mantine-color-blue-700);
      }

      .resolution-table .token-value {
        color: var(--mantine-color-text-secondary);
      }

      .comparison-section {
        margin-top: 3rem;
      }

      .comparison-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-top: 1rem;
      }

      .traditional,
      .semantic {
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
        padding: 1.5rem;
      }

      .traditional {
        border-color: var(--mantine-color-red-300);
      }

      .semantic {
        border-color: var(--mantine-color-green-300);
      }

      .traditional h4,
      .semantic h4 {
        margin: 0 0 1rem 0;
        font-size: 1.125rem;
        font-weight: 600;
      }

      .traditional pre,
      .semantic pre {
        margin: 0 0 1rem 0;
        padding: 1rem;
        background: var(--mantine-color-gray-50);
        border-radius: var(--mantine-radius-sm);
        overflow-x: auto;
      }

      .traditional code,
      .semantic code {
        font-family: var(--mantine-font-family-mono);
        font-size: 0.75rem;
        line-height: 1.6;
      }

      .impact {
        margin: 0;
        font-weight: 500;
        font-size: 0.875rem;
      }

      .traditional .impact {
        color: var(--mantine-color-red-700);
      }

      .semantic .impact {
        color: var(--mantine-color-green-700);
      }

      @media (max-width: 768px) {
        .context-controls {
          flex-direction: column;
          gap: 1rem;
        }

        .demo-grid,
        .comparison-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>

    <script>
      // Mock token resolution based on context
      const tokenResolutions = {
        light: {
          mantine: {
            '@surface.primary.idle.background': '#ffffff',
            '@content.primary.default': '#000000',
            '@interactive.primary.idle.background': '#228be6',
            '@structure.spacing.inset.md': '1rem'
          },
          clearco: {
            '@surface.primary.idle.background': '#f8f9fa',
            '@content.primary.default': '#212529',
            '@interactive.primary.idle.background': '#0066cc',
            '@structure.spacing.inset.md': '1rem'
          },
          firstwatch: {
            '@surface.primary.idle.background': '#fffef9',
            '@content.primary.default': '#1a1a1a',
            '@interactive.primary.idle.background': '#ff6b35',
            '@structure.spacing.inset.md': '1rem'
          }
        },
        dark: {
          mantine: {
            '@surface.primary.idle.background': '#1a1a1a',
            '@content.primary.default': '#ffffff',
            '@interactive.primary.idle.background': '#339af0',
            '@structure.spacing.inset.md': '1rem'
          },
          clearco: {
            '@surface.primary.idle.background': '#0a0a0a',
            '@content.primary.default': '#f8f9fa',
            '@interactive.primary.idle.background': '#4d94ff',
            '@structure.spacing.inset.md': '1rem'
          },
          firstwatch: {
            '@surface.primary.idle.background': '#1a0f0a',
            '@content.primary.default': '#fffef9',
            '@interactive.primary.idle.background': '#ff8c5a',
            '@structure.spacing.inset.md': '1rem'
          }
        }
      };

      function updateDemo() {
        // Get current theme from Storybook context
        const isDarkMode = document.documentElement.classList.contains('dark') || 
                          document.body.classList.contains('dark-theme') ||
                          window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const colorMode = isDarkMode ? 'dark' : 'light';
        // Update resolution table
        const tbody = document.getElementById('tokenResolution');
        const resolutions = tokenResolutions[colorMode]['mantine']; // Default to mantine brand
        
        tbody.innerHTML = Object.entries(resolutions).map(([token, value]) => 
          '<tr>' +
            '<td class="token-name">' + token + '</td>' +
            '<td class="token-value">' + value + '</td>' +
          '</tr>'
        ).join('');

        // Theme is already controlled by Storybook
      }

      // Initialize on load
      setTimeout(updateDemo, 100);
      
      // Watch for theme changes
      const observer = new MutationObserver(updateDemo);
      observer.observe(document.documentElement, { 
        attributes: true, 
        attributeFilter: ['class', 'data-theme'] 
      });
      observer.observe(document.body, { 
        attributes: true, 
        attributeFilter: ['class'] 
      });
    </script>
  `;
  
  return html;
};
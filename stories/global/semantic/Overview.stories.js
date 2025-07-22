export default {
  title: 'Global/Semantic/Overview',
  parameters: {
    docs: {
      description: {
        component: 'Semantic tokens provide context-aware values that adapt based on theme (light/dark) and state. These tokens reference primitive tokens and change their values based on the current theme.'
      }
    }
  }
};

export const SemanticOverview = () => {
  return `
    <div class="semantic-overview">
      <h1>Semantic Tokens</h1>
      <p class="description">
        Semantic tokens are the bridge between primitive tokens and your UI. They provide meaningful names 
        that describe the token's purpose rather than its appearance.
      </p>
      
      <section class="concept-section">
        <h2>Why Semantic Tokens?</h2>
        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon">🎨</div>
            <h3>Theme Adaptability</h3>
            <p>Automatically adjust values when switching between light and dark themes</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">🔄</div>
            <h3>Consistency</h3>
            <p>Ensure consistent color usage across components and states</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">📝</div>
            <h3>Meaningful Names</h3>
            <p>Use purpose-driven names like "surface" instead of "gray-100"</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">🚀</div>
            <h3>Easy Maintenance</h3>
            <p>Update themes by changing semantic mappings, not component code</p>
          </div>
        </div>
      </section>
      
      <section class="categories-section">
        <h2>Semantic Categories</h2>
        
        <div class="category-grid">
          <div class="category-card">
            <h3>Surfaces</h3>
            <p>Background colors for different UI layers</p>
            <div class="token-examples">
              <div class="token-example">
                <div class="color-pair">
                  <div class="color-swatch light" style="background: var(--mantine-color-white)"></div>
                  <div class="color-swatch dark" style="background: var(--mantine-color-dark-900)"></div>
                </div>
                <span>Background</span>
              </div>
              <div class="token-example">
                <div class="color-pair">
                  <div class="color-swatch light" style="background: var(--mantine-color-gray-50)"></div>
                  <div class="color-swatch dark" style="background: var(--mantine-color-dark-800)"></div>
                </div>
                <span>Surface</span>
              </div>
            </div>
          </div>
          
          <div class="category-card">
            <h3>Content</h3>
            <p>Text and icon colors with hierarchy</p>
            <div class="token-examples">
              <div class="token-example">
                <div class="color-pair">
                  <div class="color-swatch light" style="background: var(--mantine-color-black)"></div>
                  <div class="color-swatch dark" style="background: var(--mantine-color-dark-50)"></div>
                </div>
                <span>Primary Text</span>
              </div>
              <div class="token-example">
                <div class="color-pair">
                  <div class="color-swatch light" style="background: var(--mantine-color-gray-700)"></div>
                  <div class="color-swatch dark" style="background: var(--mantine-color-dark-100)"></div>
                </div>
                <span>Secondary Text</span>
              </div>
            </div>
          </div>
          
          <div class="category-card">
            <h3>Borders</h3>
            <p>Border colors for containers and dividers</p>
            <div class="token-examples">
              <div class="token-example">
                <div class="color-pair">
                  <div class="color-swatch light border" style="border-color: var(--mantine-color-gray-200)"></div>
                  <div class="color-swatch dark border" style="border-color: var(--mantine-color-dark-600)"></div>
                </div>
                <span>Default Border</span>
              </div>
              <div class="token-example">
                <div class="color-pair">
                  <div class="color-swatch light border" style="border-color: var(--mantine-color-gray-300)"></div>
                  <div class="color-swatch dark border" style="border-color: var(--mantine-color-dark-500)"></div>
                </div>
                <span>Strong Border</span>
              </div>
            </div>
          </div>
          
          <div class="category-card">
            <h3>Interactive</h3>
            <p>Colors for interactive elements and states</p>
            <div class="token-examples">
              <div class="token-example">
                <div class="color-pair">
                  <div class="color-swatch light" style="background: var(--mantine-color-blue-600)"></div>
                  <div class="color-swatch dark" style="background: var(--mantine-color-blue-500)"></div>
                </div>
                <span>Primary Action</span>
              </div>
              <div class="token-example">
                <div class="color-pair">
                  <div class="color-swatch light" style="background: var(--mantine-color-gray-100)"></div>
                  <div class="color-swatch dark" style="background: var(--mantine-color-dark-700)"></div>
                </div>
                <span>Hover State</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section class="usage-section">
        <h2>Usage Example</h2>
        <div class="code-example">
          <h4>Instead of using primitive tokens directly:</h4>
          <pre><code>/* ❌ Don't do this */
.card {
  background: var(--mantine-color-gray-50);  /* Light theme only */
  color: var(--mantine-color-gray-900);      /* Light theme only */
}</code></pre>
          
          <h4>Use semantic tokens that adapt to theme:</h4>
          <pre><code>/* ✅ Do this */
.card {
  background: var(--mantine-color-surface);   /* Adapts to theme */
  color: var(--mantine-color-text-primary);  /* Adapts to theme */
}</code></pre>
        </div>
      </section>
      
      <section class="navigation-section">
        <h2>Explore Semantic Tokens</h2>
        <div class="nav-cards">
          <a href="?path=/story/global-semantic-light-theme--theme-tokens" class="nav-card">
            <h3>☀️ Light Theme</h3>
            <p>View all semantic tokens in light theme</p>
          </a>
          <a href="?path=/story/global-semantic-dark-theme--theme-tokens" class="nav-card">
            <h3>🌙 Dark Theme</h3>
            <p>View all semantic tokens in dark theme</p>
          </a>
        </div>
      </section>
    </div>
    
    <style>
      .semantic-overview {
        padding: 2rem;
        font-family: var(--mantine-typography-fontfamily-sans);
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .description {
        font-size: 1.125rem;
        color: var(--mantine-color-gray-700);
        margin-bottom: 3rem;
        line-height: 1.7;
      }
      
      .concept-section {
        margin-bottom: 4rem;
      }
      
      .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;
      }
      
      .benefit-card {
        padding: 1.5rem;
        background: var(--mantine-color-gray-50);
        border-radius: 0.5rem;
        text-align: center;
      }
      
      .benefit-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }
      
      .benefit-card h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.125rem;
      }
      
      .benefit-card p {
        margin: 0;
        color: var(--mantine-color-gray-600);
        font-size: 0.875rem;
      }
      
      .categories-section {
        margin-bottom: 4rem;
      }
      
      .category-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
      }
      
      .category-card {
        padding: 1.5rem;
        border: 1px solid var(--mantine-color-gray-200);
        border-radius: 0.5rem;
        background: white;
      }
      
      .category-card h3 {
        margin: 0 0 0.5rem 0;
        color: var(--mantine-color-blue-600);
      }
      
      .category-card p {
        margin: 0 0 1rem 0;
        color: var(--mantine-color-gray-600);
        font-size: 0.875rem;
      }
      
      .token-examples {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .token-example {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      
      .color-pair {
        display: flex;
        gap: 0.25rem;
      }
      
      .color-swatch {
        width: 24px;
        height: 24px;
        border-radius: 0.25rem;
        border: 1px solid rgba(0, 0, 0, 0.1);
      }
      
      .color-swatch.border {
        background: white;
        border-width: 2px;
      }
      
      .color-swatch.dark {
        border-color: rgba(255, 255, 255, 0.2);
      }
      
      .token-example span {
        font-size: 0.813rem;
        color: var(--mantine-color-gray-700);
      }
      
      .usage-section {
        margin-bottom: 4rem;
      }
      
      .code-example {
        background: #f6f8fa;
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-top: 1rem;
      }
      
      .code-example h4 {
        margin: 0 0 0.5rem 0;
        font-size: 0.875rem;
        color: var(--mantine-color-gray-700);
      }
      
      .code-example pre {
        margin: 0 0 1.5rem 0;
        padding: 1rem;
        background: white;
        border: 1px solid var(--mantine-color-gray-200);
        border-radius: 0.375rem;
        overflow-x: auto;
      }
      
      .code-example code {
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.875rem;
        line-height: 1.5;
      }
      
      .navigation-section {
        margin-top: 4rem;
      }
      
      .nav-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
      }
      
      .nav-card {
        padding: 2rem;
        background: var(--mantine-color-blue-50);
        border: 1px solid var(--mantine-color-blue-200);
        border-radius: 0.5rem;
        text-decoration: none;
        color: inherit;
        transition: all 0.2s;
        text-align: center;
      }
      
      .nav-card:hover {
        background: var(--mantine-color-blue-100);
        border-color: var(--mantine-color-blue-300);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      
      .nav-card h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
      }
      
      .nav-card p {
        margin: 0;
        color: var(--mantine-color-gray-600);
        font-size: 0.875rem;
      }
      
      @media (max-width: 768px) {
        .benefits-grid,
        .category-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `;
};
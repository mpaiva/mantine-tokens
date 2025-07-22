export default {
  title: 'Brands/Mantine/Light Theme',
  parameters: {
    docs: {
      description: {
        component: 'Light theme semantic tokens for Mantine design system'
      }
    },
    backgrounds: { default: 'light' }
  }
};

export const SemanticTokens = () => {
  return `
    <div class="theme-tokens light-theme">
      <h1>Mantine Light Theme</h1>
      <p class="description">Semantic color tokens optimized for light backgrounds</p>
      
      <section class="token-section">
        <h2>Surfaces</h2>
        <div class="token-grid">
          <div class="token-item">
            <div class="token-swatch" style="background: var(--mantine-color-white)"></div>
            <div class="token-info">
              <h4>Background Default</h4>
              <code>--mantine-color-white</code>
              <span class="value">#ffffff</span>
            </div>
          </div>
          <div class="token-item">
            <div class="token-swatch" style="background: var(--mantine-color-gray-50)"></div>
            <div class="token-info">
              <h4>Surface Subtle</h4>
              <code>--mantine-color-gray-50</code>
              <span class="value">#f8f9fa</span>
            </div>
          </div>
          <div class="token-item">
            <div class="token-swatch" style="background: var(--mantine-color-gray-100)"></div>
            <div class="token-info">
              <h4>Surface Muted</h4>
              <code>--mantine-color-gray-100</code>
              <span class="value">#f1f3f5</span>
            </div>
          </div>
        </div>
      </section>
      
      <section class="token-section">
        <h2>Text Colors</h2>
        <div class="token-grid">
          <div class="token-item">
            <div class="token-swatch" style="background: var(--mantine-color-black)"></div>
            <div class="token-info">
              <h4>Text Default</h4>
              <code>--mantine-color-black</code>
              <span class="value">#000000</span>
            </div>
          </div>
          <div class="token-item">
            <div class="token-swatch" style="background: var(--mantine-color-gray-700)"></div>
            <div class="token-info">
              <h4>Text Secondary</h4>
              <code>--mantine-color-gray-700</code>
              <span class="value">#495057</span>
            </div>
          </div>
          <div class="token-item">
            <div class="token-swatch" style="background: var(--mantine-color-gray-600)"></div>
            <div class="token-info">
              <h4>Text Muted</h4>
              <code>--mantine-color-gray-600</code>
              <span class="value">#868e96</span>
            </div>
          </div>
          <div class="token-item">
            <div class="token-swatch" style="background: var(--mantine-color-gray-400)"></div>
            <div class="token-info">
              <h4>Text Disabled</h4>
              <code>--mantine-color-gray-400</code>
              <span class="value">#ced4da</span>
            </div>
          </div>
        </div>
      </section>
      
      <section class="token-section">
        <h2>Borders</h2>
        <div class="token-grid">
          <div class="token-item">
            <div class="token-swatch border-swatch" style="border-color: var(--mantine-color-gray-200)">
              <span>Border</span>
            </div>
            <div class="token-info">
              <h4>Border Subtle</h4>
              <code>--mantine-color-gray-200</code>
              <span class="value">#e9ecef</span>
            </div>
          </div>
          <div class="token-item">
            <div class="token-swatch border-swatch" style="border-color: var(--mantine-color-gray-300)">
              <span>Border</span>
            </div>
            <div class="token-info">
              <h4>Border Default</h4>
              <code>--mantine-color-gray-300</code>
              <span class="value">#dee2e6</span>
            </div>
          </div>
          <div class="token-item">
            <div class="token-swatch border-swatch" style="border-color: var(--mantine-color-gray-400)">
              <span>Border</span>
            </div>
            <div class="token-info">
              <h4>Border Strong</h4>
              <code>--mantine-color-gray-400</code>
              <span class="value">#ced4da</span>
            </div>
          </div>
        </div>
      </section>
      
      <section class="token-section">
        <h2>Interactive States</h2>
        <div class="state-grid">
          <div class="state-group">
            <h3>Primary</h3>
            <div class="state-colors">
              <div class="state-item">
                <div class="state-swatch" style="background: var(--mantine-color-blue-600)"></div>
                <span>Default</span>
              </div>
              <div class="state-item">
                <div class="state-swatch" style="background: var(--mantine-color-blue-700)"></div>
                <span>Hover</span>
              </div>
              <div class="state-item">
                <div class="state-swatch" style="background: var(--mantine-color-blue-800)"></div>
                <span>Active</span>
              </div>
              <div class="state-item">
                <div class="state-swatch" style="background: var(--mantine-color-blue-50)"></div>
                <span>Subtle</span>
              </div>
            </div>
          </div>
          
          <div class="state-group">
            <h3>Success</h3>
            <div class="state-colors">
              <div class="state-item">
                <div class="state-swatch" style="background: var(--mantine-color-green-600)"></div>
                <span>Default</span>
              </div>
              <div class="state-item">
                <div class="state-swatch" style="background: var(--mantine-color-green-50)"></div>
                <span>Subtle</span>
              </div>
            </div>
          </div>
          
          <div class="state-group">
            <h3>Error</h3>
            <div class="state-colors">
              <div class="state-item">
                <div class="state-swatch" style="background: var(--mantine-color-red-600)"></div>
                <span>Default</span>
              </div>
              <div class="state-item">
                <div class="state-swatch" style="background: var(--mantine-color-red-50)"></div>
                <span>Subtle</span>
              </div>
            </div>
          </div>
          
          <div class="state-group">
            <h3>Warning</h3>
            <div class="state-colors">
              <div class="state-item">
                <div class="state-swatch" style="background: var(--mantine-color-yellow-600)"></div>
                <span>Default</span>
              </div>
              <div class="state-item">
                <div class="state-swatch" style="background: var(--mantine-color-yellow-50)"></div>
                <span>Subtle</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    
    <style>
      .theme-tokens {
        padding: 2rem;
        font-family: var(--mantine-typography-fontfamily-sans);
      }
      
      .token-section {
        margin-top: 3rem;
      }
      
      .token-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-top: 1rem;
      }
      
      .token-item {
        display: flex;
        gap: 1rem;
        align-items: center;
        padding: 1rem;
        background: #fff;
        border: 1px solid var(--mantine-color-gray-200);
        border-radius: 0.5rem;
      }
      
      .token-swatch {
        width: 60px;
        height: 60px;
        border-radius: 0.375rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
      }
      
      .border-swatch {
        background: white;
        border: 3px solid;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        color: #666;
      }
      
      .token-info h4 {
        margin: 0 0 0.25rem 0;
        font-size: 0.875rem;
        font-weight: 600;
      }
      
      .token-info code {
        display: block;
        font-size: 0.75rem;
        color: #666;
        margin-bottom: 0.25rem;
        font-family: var(--mantine-typography-fontfamily-mono);
      }
      
      .token-info .value {
        font-size: 0.75rem;
        color: #999;
      }
      
      .state-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        margin-top: 1rem;
      }
      
      .state-group h3 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
      }
      
      .state-colors {
        display: flex;
        gap: 0.5rem;
      }
      
      .state-item {
        text-align: center;
      }
      
      .state-swatch {
        width: 50px;
        height: 50px;
        border-radius: 0.375rem;
        margin-bottom: 0.5rem;
      }
      
      .state-item span {
        font-size: 0.75rem;
        color: #666;
      }
    </style>
  `;
};
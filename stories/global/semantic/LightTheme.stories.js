export default {
  title: 'Global/Semantic/Light Theme',
  parameters: {
    docs: {
      description: {
        component: 'Semantic tokens mapped for light theme. These tokens reference primitive values and provide consistent, meaningful names for UI elements.'
      }
    },
    backgrounds: { default: 'light' }
  }
};

export const ThemeTokens = () => {
  return `
    <div class="semantic-tokens light-theme">
      <h1>Light Theme Semantic Tokens</h1>
      <p class="description">
        These semantic tokens are mapped to appropriate primitive values for light theme usage. 
        Click any token to copy its CSS variable name.
      </p>
      
      <!-- Surfaces Section -->
      <section class="token-section">
        <h2>Surfaces</h2>
        <p class="section-description">Background colors for different elevation levels and UI containers</p>
        
        <div class="token-grid">
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-background')">
            <div class="token-preview" style="background: var(--mantine-color-white)">
              <span class="preview-label">Aa</span>
            </div>
            <div class="token-info">
              <h4>Background</h4>
              <code>--mantine-color-background</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.white</span>
                <span class="value">#ffffff</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-surface')">
            <div class="token-preview" style="background: var(--mantine-color-gray-50)">
              <span class="preview-label">Aa</span>
            </div>
            <div class="token-info">
              <h4>Surface</h4>
              <code>--mantine-color-surface</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.gray.50</span>
                <span class="value">#f8f9fa</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-surface-hover')">
            <div class="token-preview" style="background: var(--mantine-color-gray-100)">
              <span class="preview-label">Aa</span>
            </div>
            <div class="token-info">
              <h4>Surface Hover</h4>
              <code>--mantine-color-surface-hover</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.gray.100</span>
                <span class="value">#f1f3f5</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Text/Content Section -->
      <section class="token-section">
        <h2>Text & Content</h2>
        <p class="section-description">Text colors with hierarchy for readability and emphasis</p>
        
        <div class="token-grid">
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-text-primary')">
            <div class="token-preview text-preview" style="background: white">
              <span style="color: var(--mantine-color-black)">Aa</span>
            </div>
            <div class="token-info">
              <h4>Text Primary</h4>
              <code>--mantine-color-text-primary</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.black</span>
                <span class="value">#000000</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-text-secondary')">
            <div class="token-preview text-preview" style="background: white">
              <span style="color: var(--mantine-color-gray-700)">Aa</span>
            </div>
            <div class="token-info">
              <h4>Text Secondary</h4>
              <code>--mantine-color-text-secondary</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.gray.700</span>
                <span class="value">#495057</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-text-tertiary')">
            <div class="token-preview text-preview" style="background: white">
              <span style="color: var(--mantine-color-gray-600)">Aa</span>
            </div>
            <div class="token-info">
              <h4>Text Tertiary</h4>
              <code>--mantine-color-text-tertiary</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.gray.600</span>
                <span class="value">#868e96</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-text-disabled')">
            <div class="token-preview text-preview" style="background: white">
              <span style="color: var(--mantine-color-gray-400)">Aa</span>
            </div>
            <div class="token-info">
              <h4>Text Disabled</h4>
              <code>--mantine-color-text-disabled</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.gray.400</span>
                <span class="value">#ced4da</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Borders Section -->
      <section class="token-section">
        <h2>Borders</h2>
        <p class="section-description">Border colors for containers, dividers, and input fields</p>
        
        <div class="token-grid">
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-border-subtle')">
            <div class="token-preview border-preview">
              <div class="border-box" style="border-color: var(--mantine-color-gray-200)"></div>
            </div>
            <div class="token-info">
              <h4>Border Subtle</h4>
              <code>--mantine-color-border-subtle</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.gray.200</span>
                <span class="value">#e9ecef</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-border-default')">
            <div class="token-preview border-preview">
              <div class="border-box" style="border-color: var(--mantine-color-gray-300)"></div>
            </div>
            <div class="token-info">
              <h4>Border Default</h4>
              <code>--mantine-color-border-default</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.gray.300</span>
                <span class="value">#dee2e6</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-border-strong')">
            <div class="token-preview border-preview">
              <div class="border-box" style="border-color: var(--mantine-color-gray-400)"></div>
            </div>
            <div class="token-info">
              <h4>Border Strong</h4>
              <code>--mantine-color-border-strong</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.gray.400</span>
                <span class="value">#ced4da</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Interactive States Section -->
      <section class="token-section">
        <h2>Interactive States</h2>
        <p class="section-description">Colors for buttons, links, and other interactive elements</p>
        
        <div class="state-grid">
          <!-- Primary States -->
          <div class="state-group">
            <h3>Primary</h3>
            <div class="state-tokens">
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-primary-default')">
                <div class="state-swatch" style="background: var(--mantine-color-blue-600)"></div>
                <div class="state-info">
                  <span class="state-name">Default</span>
                  <code>blue.600</code>
                </div>
              </div>
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-primary-hover')">
                <div class="state-swatch" style="background: var(--mantine-color-blue-700)"></div>
                <div class="state-info">
                  <span class="state-name">Hover</span>
                  <code>blue.700</code>
                </div>
              </div>
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-primary-active')">
                <div class="state-swatch" style="background: var(--mantine-color-blue-800)"></div>
                <div class="state-info">
                  <span class="state-name">Active</span>
                  <code>blue.800</code>
                </div>
              </div>
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-primary-subtle')">
                <div class="state-swatch" style="background: var(--mantine-color-blue-50)"></div>
                <div class="state-info">
                  <span class="state-name">Subtle</span>
                  <code>blue.50</code>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Success States -->
          <div class="state-group">
            <h3>Success</h3>
            <div class="state-tokens">
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-success-default')">
                <div class="state-swatch" style="background: var(--mantine-color-green-600)"></div>
                <div class="state-info">
                  <span class="state-name">Default</span>
                  <code>green.600</code>
                </div>
              </div>
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-success-subtle')">
                <div class="state-swatch" style="background: var(--mantine-color-green-50)"></div>
                <div class="state-info">
                  <span class="state-name">Subtle</span>
                  <code>green.50</code>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Error States -->
          <div class="state-group">
            <h3>Error</h3>
            <div class="state-tokens">
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-error-default')">
                <div class="state-swatch" style="background: var(--mantine-color-red-600)"></div>
                <div class="state-info">
                  <span class="state-name">Default</span>
                  <code>red.600</code>
                </div>
              </div>
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-error-subtle')">
                <div class="state-swatch" style="background: var(--mantine-color-red-50)"></div>
                <div class="state-info">
                  <span class="state-name">Subtle</span>
                  <code>red.50</code>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Warning States -->
          <div class="state-group">
            <h3>Warning</h3>
            <div class="state-tokens">
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-warning-default')">
                <div class="state-swatch" style="background: var(--mantine-color-yellow-600)"></div>
                <div class="state-info">
                  <span class="state-name">Default</span>
                  <code>yellow.600</code>
                </div>
              </div>
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-warning-subtle')">
                <div class="state-swatch" style="background: var(--mantine-color-yellow-50)"></div>
                <div class="state-info">
                  <span class="state-name">Subtle</span>
                  <code>yellow.50</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Focus & Overlay Section -->
      <section class="token-section">
        <h2>Focus & Overlay</h2>
        <p class="section-description">Special purpose tokens for focus states and overlays</p>
        
        <div class="token-grid">
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-focus-ring')">
            <div class="token-preview focus-preview">
              <div class="focus-box" style="box-shadow: 0 0 0 3px var(--mantine-color-blue-500)"></div>
            </div>
            <div class="token-info">
              <h4>Focus Ring</h4>
              <code>--mantine-color-focus-ring</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.blue.500</span>
                <span class="value">#339af0</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-overlay-light')">
            <div class="token-preview" style="background: rgba(0, 0, 0, 0.1)">
              <span class="preview-label">Overlay</span>
            </div>
            <div class="token-info">
              <h4>Overlay Light</h4>
              <code>--mantine-color-overlay-light</code>
              <div class="token-meta">
                <span class="primitive-ref">→ rgba(0,0,0,0.1)</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-overlay-dark')">
            <div class="token-preview" style="background: rgba(0, 0, 0, 0.5)">
              <span class="preview-label" style="color: white">Overlay</span>
            </div>
            <div class="token-info">
              <h4>Overlay Dark</h4>
              <code>--mantine-color-overlay-dark</code>
              <div class="token-meta">
                <span class="primitive-ref">→ rgba(0,0,0,0.5)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    
    <style>
      .semantic-tokens {
        padding: 2rem;
        font-family: var(--mantine-typography-fontfamily-sans);
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .description {
        font-size: 1.125rem;
        color: var(--mantine-color-gray-700);
        margin-bottom: 3rem;
      }
      
      .token-section {
        margin-bottom: 3rem;
      }
      
      .section-description {
        color: var(--mantine-color-gray-600);
        margin: 0.5rem 0 1.5rem 0;
      }
      
      .token-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
      }
      
      .token-card {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: white;
        border: 1px solid var(--mantine-color-gray-200);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .token-card:hover {
        border-color: var(--mantine-color-blue-300);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
      }
      
      .token-preview {
        width: 80px;
        height: 80px;
        border-radius: 0.375rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
      }
      
      .preview-label {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--mantine-color-gray-700);
      }
      
      .text-preview {
        background: white;
        border: 1px solid var(--mantine-color-gray-200);
      }
      
      .text-preview span {
        font-size: 1.5rem;
        font-weight: 600;
      }
      
      .border-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
      }
      
      .border-box {
        width: 60px;
        height: 60px;
        border: 2px solid;
        border-radius: 0.375rem;
      }
      
      .focus-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
      }
      
      .focus-box {
        width: 50px;
        height: 50px;
        background: white;
        border: 1px solid var(--mantine-color-gray-300);
        border-radius: 0.375rem;
      }
      
      .token-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      
      .token-info h4 {
        margin: 0 0 0.25rem 0;
        font-size: 1rem;
      }
      
      .token-info code {
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.813rem;
        color: var(--mantine-color-gray-600);
        margin-bottom: 0.5rem;
      }
      
      .token-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.75rem;
      }
      
      .primitive-ref {
        color: var(--mantine-color-blue-600);
      }
      
      .value {
        color: var(--mantine-color-gray-500);
      }
      
      .state-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-top: 1.5rem;
      }
      
      .state-group h3 {
        margin: 0 0 1rem 0;
        font-size: 1.125rem;
        color: var(--mantine-color-gray-800);
      }
      
      .state-tokens {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .state-token {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        background: white;
        border: 1px solid var(--mantine-color-gray-200);
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .state-token:hover {
        border-color: var(--mantine-color-blue-300);
        background: var(--mantine-color-blue-50);
      }
      
      .state-swatch {
        width: 40px;
        height: 40px;
        border-radius: 0.25rem;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
      }
      
      .state-info {
        flex: 1;
      }
      
      .state-name {
        display: block;
        font-weight: 600;
        font-size: 0.875rem;
        margin-bottom: 0.125rem;
      }
      
      .state-info code {
        font-size: 0.75rem;
        color: var(--mantine-color-gray-600);
        font-family: var(--mantine-typography-fontfamily-mono);
      }
      
      /* Copy feedback */
      .token-card:active,
      .state-token:active {
        transform: scale(0.98);
      }
      
      @media (max-width: 768px) {
        .token-grid {
          grid-template-columns: 1fr;
        }
        
        .state-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
    
    <script>
      // Visual feedback when copying
      document.querySelectorAll('.token-card, .state-token').forEach(el => {
        el.addEventListener('click', function() {
          const originalBorder = this.style.borderColor;
          this.style.borderColor = 'var(--mantine-color-green-500)';
          setTimeout(() => {
            this.style.borderColor = originalBorder;
          }, 300);
        });
      });
    </script>
  `;
};
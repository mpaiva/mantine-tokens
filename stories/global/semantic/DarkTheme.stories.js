export default {
  title: 'Global/Semantic/Dark Theme',
  parameters: {
    docs: {
      description: {
        component: 'Semantic tokens mapped for dark theme. These tokens reference primitive values and provide consistent, meaningful names for UI elements in dark mode.'
      }
    },
    backgrounds: { default: 'dark' }
  }
};

export const ThemeTokens = () => {
  return `
    <div class="semantic-tokens dark-theme">
      <h1>Dark Theme Semantic Tokens</h1>
      <p class="description">
        These semantic tokens are mapped to appropriate primitive values for dark theme usage. 
        Click any token to copy its CSS variable name.
      </p>
      
      <!-- Surfaces Section -->
      <section class="token-section">
        <h2>Surfaces</h2>
        <p class="section-description">Background colors for different elevation levels and UI containers</p>
        
        <div class="token-grid">
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-background')">
            <div class="token-preview" style="background: var(--mantine-color-dark-900)">
              <span class="preview-label">Aa</span>
            </div>
            <div class="token-info">
              <h4>Background</h4>
              <code>--mantine-color-background</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.dark.900</span>
                <span class="value">#1a1b1e</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-surface')">
            <div class="token-preview" style="background: var(--mantine-color-dark-800)">
              <span class="preview-label">Aa</span>
            </div>
            <div class="token-info">
              <h4>Surface</h4>
              <code>--mantine-color-surface</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.dark.800</span>
                <span class="value">#25262b</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-surface-hover')">
            <div class="token-preview" style="background: var(--mantine-color-dark-700)">
              <span class="preview-label">Aa</span>
            </div>
            <div class="token-info">
              <h4>Surface Hover</h4>
              <code>--mantine-color-surface-hover</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.dark.700</span>
                <span class="value">#2c2e33</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Text/Content Section -->
      <section class="token-section">
        <h2>Text & Content</h2>
        <p class="section-description">Text colors with hierarchy for readability and emphasis in dark mode</p>
        
        <div class="token-grid">
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-text-primary')">
            <div class="token-preview text-preview" style="background: var(--mantine-color-dark-800)">
              <span style="color: var(--mantine-color-dark-50)">Aa</span>
            </div>
            <div class="token-info">
              <h4>Text Primary</h4>
              <code>--mantine-color-text-primary</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.dark.50</span>
                <span class="value">#c1c2c5</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-text-secondary')">
            <div class="token-preview text-preview" style="background: var(--mantine-color-dark-800)">
              <span style="color: var(--mantine-color-dark-100)">Aa</span>
            </div>
            <div class="token-info">
              <h4>Text Secondary</h4>
              <code>--mantine-color-text-secondary</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.dark.100</span>
                <span class="value">#a6a7ab</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-text-tertiary')">
            <div class="token-preview text-preview" style="background: var(--mantine-color-dark-800)">
              <span style="color: var(--mantine-color-dark-200)">Aa</span>
            </div>
            <div class="token-info">
              <h4>Text Tertiary</h4>
              <code>--mantine-color-text-tertiary</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.dark.200</span>
                <span class="value">#909296</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-text-disabled')">
            <div class="token-preview text-preview" style="background: var(--mantine-color-dark-800)">
              <span style="color: var(--mantine-color-dark-400)">Aa</span>
            </div>
            <div class="token-info">
              <h4>Text Disabled</h4>
              <code>--mantine-color-text-disabled</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.dark.400</span>
                <span class="value">#5c5f66</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Borders Section -->
      <section class="token-section">
        <h2>Borders</h2>
        <p class="section-description">Border colors for containers, dividers, and input fields in dark mode</p>
        
        <div class="token-grid">
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-border-subtle')">
            <div class="token-preview border-preview">
              <div class="border-box" style="border-color: var(--mantine-color-dark-700)"></div>
            </div>
            <div class="token-info">
              <h4>Border Subtle</h4>
              <code>--mantine-color-border-subtle</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.dark.700</span>
                <span class="value">#2c2e33</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-border-default')">
            <div class="token-preview border-preview">
              <div class="border-box" style="border-color: var(--mantine-color-dark-600)"></div>
            </div>
            <div class="token-info">
              <h4>Border Default</h4>
              <code>--mantine-color-border-default</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.dark.600</span>
                <span class="value">#373a40</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-border-strong')">
            <div class="token-preview border-preview">
              <div class="border-box" style="border-color: var(--mantine-color-dark-500)"></div>
            </div>
            <div class="token-info">
              <h4>Border Strong</h4>
              <code>--mantine-color-border-strong</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.dark.500</span>
                <span class="value">#495057</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Interactive States Section -->
      <section class="token-section">
        <h2>Interactive States</h2>
        <p class="section-description">Colors for buttons, links, and other interactive elements in dark mode</p>
        
        <div class="state-grid">
          <!-- Primary States -->
          <div class="state-group">
            <h3>Primary</h3>
            <div class="state-tokens">
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-primary-default')">
                <div class="state-swatch" style="background: var(--mantine-color-blue-500)"></div>
                <div class="state-info">
                  <span class="state-name">Default</span>
                  <code>blue.500</code>
                </div>
              </div>
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-primary-hover')">
                <div class="state-swatch" style="background: var(--mantine-color-blue-400)"></div>
                <div class="state-info">
                  <span class="state-name">Hover</span>
                  <code>blue.400</code>
                </div>
              </div>
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-primary-active')">
                <div class="state-swatch" style="background: var(--mantine-color-blue-600)"></div>
                <div class="state-info">
                  <span class="state-name">Active</span>
                  <code>blue.600</code>
                </div>
              </div>
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-primary-subtle')">
                <div class="state-swatch" style="background: rgba(59, 130, 246, 0.1)"></div>
                <div class="state-info">
                  <span class="state-name">Subtle</span>
                  <code>blue.500/10%</code>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Success States -->
          <div class="state-group">
            <h3>Success</h3>
            <div class="state-tokens">
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-success-default')">
                <div class="state-swatch" style="background: var(--mantine-color-green-500)"></div>
                <div class="state-info">
                  <span class="state-name">Default</span>
                  <code>green.500</code>
                </div>
              </div>
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-success-subtle')">
                <div class="state-swatch" style="background: rgba(34, 197, 94, 0.1)"></div>
                <div class="state-info">
                  <span class="state-name">Subtle</span>
                  <code>green.500/10%</code>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Error States -->
          <div class="state-group">
            <h3>Error</h3>
            <div class="state-tokens">
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-error-default')">
                <div class="state-swatch" style="background: var(--mantine-color-red-500)"></div>
                <div class="state-info">
                  <span class="state-name">Default</span>
                  <code>red.500</code>
                </div>
              </div>
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-error-subtle')">
                <div class="state-swatch" style="background: rgba(239, 68, 68, 0.1)"></div>
                <div class="state-info">
                  <span class="state-name">Subtle</span>
                  <code>red.500/10%</code>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Warning States -->
          <div class="state-group">
            <h3>Warning</h3>
            <div class="state-tokens">
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-warning-default')">
                <div class="state-swatch" style="background: var(--mantine-color-yellow-500)"></div>
                <div class="state-info">
                  <span class="state-name">Default</span>
                  <code>yellow.500</code>
                </div>
              </div>
              <div class="state-token" onclick="navigator.clipboard.writeText('--mantine-color-warning-subtle')">
                <div class="state-swatch" style="background: rgba(250, 176, 5, 0.1)"></div>
                <div class="state-info">
                  <span class="state-name">Subtle</span>
                  <code>yellow.500/10%</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Focus & Overlay Section -->
      <section class="token-section">
        <h2>Focus & Overlay</h2>
        <p class="section-description">Special purpose tokens for focus states and overlays in dark mode</p>
        
        <div class="token-grid">
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-focus-ring')">
            <div class="token-preview focus-preview">
              <div class="focus-box" style="box-shadow: 0 0 0 3px var(--mantine-color-blue-400)"></div>
            </div>
            <div class="token-info">
              <h4>Focus Ring</h4>
              <code>--mantine-color-focus-ring</code>
              <div class="token-meta">
                <span class="primitive-ref">→ color.blue.400</span>
                <span class="value">#4dabf7</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-overlay-light')">
            <div class="token-preview" style="background: rgba(255, 255, 255, 0.05)">
              <span class="preview-label">Overlay</span>
            </div>
            <div class="token-info">
              <h4>Overlay Light</h4>
              <code>--mantine-color-overlay-light</code>
              <div class="token-meta">
                <span class="primitive-ref">→ rgba(255,255,255,0.05)</span>
              </div>
            </div>
          </div>
          
          <div class="token-card" onclick="navigator.clipboard.writeText('--mantine-color-overlay-dark')">
            <div class="token-preview" style="background: rgba(0, 0, 0, 0.6)">
              <span class="preview-label" style="color: white">Overlay</span>
            </div>
            <div class="token-info">
              <h4>Overlay Dark</h4>
              <code>--mantine-color-overlay-dark</code>
              <div class="token-meta">
                <span class="primitive-ref">→ rgba(0,0,0,0.6)</span>
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
        background: var(--mantine-color-dark-900);
        color: var(--mantine-color-dark-50);
        min-height: 100vh;
      }
      
      .description {
        font-size: 1.125rem;
        color: var(--mantine-color-dark-100);
        margin-bottom: 3rem;
      }
      
      .token-section {
        margin-bottom: 3rem;
      }
      
      .section-description {
        color: var(--mantine-color-dark-200);
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
        background: var(--mantine-color-dark-800);
        border: 1px solid var(--mantine-color-dark-700);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .token-card:hover {
        border-color: var(--mantine-color-blue-400);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
      }
      
      .preview-label {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--mantine-color-dark-50);
      }
      
      .text-preview {
        background: var(--mantine-color-dark-800);
        border: 1px solid var(--mantine-color-dark-700);
      }
      
      .text-preview span {
        font-size: 1.5rem;
        font-weight: 600;
      }
      
      .border-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--mantine-color-dark-800);
      }
      
      .border-box {
        width: 60px;
        height: 60px;
        border: 2px solid;
        border-radius: 0.375rem;
        background: var(--mantine-color-dark-900);
      }
      
      .focus-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--mantine-color-dark-800);
      }
      
      .focus-box {
        width: 50px;
        height: 50px;
        background: var(--mantine-color-dark-700);
        border: 1px solid var(--mantine-color-dark-600);
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
        color: var(--mantine-color-dark-50);
      }
      
      .token-info code {
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.813rem;
        color: var(--mantine-color-dark-200);
        margin-bottom: 0.5rem;
      }
      
      .token-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.75rem;
      }
      
      .primitive-ref {
        color: var(--mantine-color-blue-400);
      }
      
      .value {
        color: var(--mantine-color-dark-300);
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
        color: var(--mantine-color-dark-50);
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
        background: var(--mantine-color-dark-800);
        border: 1px solid var(--mantine-color-dark-700);
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .state-token:hover {
        border-color: var(--mantine-color-blue-400);
        background: var(--mantine-color-dark-700);
      }
      
      .state-swatch {
        width: 40px;
        height: 40px;
        border-radius: 0.25rem;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
      }
      
      .state-info {
        flex: 1;
      }
      
      .state-name {
        display: block;
        font-weight: 600;
        font-size: 0.875rem;
        margin-bottom: 0.125rem;
        color: var(--mantine-color-dark-50);
      }
      
      .state-info code {
        font-size: 0.75rem;
        color: var(--mantine-color-dark-300);
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
          this.style.borderColor = 'var(--mantine-color-green-400)';
          setTimeout(() => {
            this.style.borderColor = originalBorder;
          }, 300);
        });
      });
    </script>
  `;
};
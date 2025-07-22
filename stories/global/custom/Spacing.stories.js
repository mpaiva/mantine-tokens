export default {
  title: 'Global/Custom/Spacing',
  parameters: {
    docs: {
      description: {
        component: 'Extended spacing tokens for special layout requirements beyond the standard scale.'
      }
    }
  }
};

export const SpacingTokens = () => {
  return `
    <div class="custom-spacing">
      <h1>Custom Spacing Tokens</h1>
      <p class="description">
        Custom spacing tokens extend the standard spacing scale with additional values for specific use cases 
        like extra-small spacing, extra-large spacing, and semantic spacing for sections and pages.
      </p>
      
      <section class="spacing-section">
        <h2>Extended Spacing Scale</h2>
        <p class="section-description">
          These custom spacing values complement the standard scale (xs, sm, md, lg, xl, 2xl, 3xl) 
          with additional sizes for edge cases.
        </p>
        
        <div class="spacing-list">
          <!-- XXS -->
          <div class="spacing-item" onclick="navigator.clipboard.writeText('--custom-spacing-xxs')">
            <div class="spacing-info">
              <h3>XXS - Extra Extra Small</h3>
              <code>--custom-spacing-xxs</code>
              <span class="value">0.25rem (4px)</span>
              <p>Micro spacing for tight layouts and fine adjustments</p>
            </div>
            <div class="spacing-demo">
              <div class="spacing-bar" style="width: var(--custom-spacing-xxs)"></div>
              <div class="spacing-box" style="width: var(--custom-spacing-xxs); height: var(--custom-spacing-xxs)"></div>
            </div>
          </div>
          
          <!-- 4XL -->
          <div class="spacing-item" onclick="navigator.clipboard.writeText('--custom-spacing-4xl')">
            <div class="spacing-info">
              <h3>4XL - 4x Large</h3>
              <code>--custom-spacing-4xl</code>
              <span class="value">5rem (80px)</span>
              <p>Extra large spacing for major section breaks</p>
            </div>
            <div class="spacing-demo">
              <div class="spacing-bar" style="width: var(--custom-spacing-4xl)"></div>
              <div class="spacing-box" style="width: var(--custom-spacing-4xl); height: var(--custom-spacing-4xl)"></div>
            </div>
          </div>
          
          <!-- 5XL -->
          <div class="spacing-item" onclick="navigator.clipboard.writeText('--custom-spacing-5xl')">
            <div class="spacing-info">
              <h3>5XL - 5x Large</h3>
              <code>--custom-spacing-5xl</code>
              <span class="value">6rem (96px)</span>
              <p>Maximum spacing for hero sections and page breaks</p>
            </div>
            <div class="spacing-demo">
              <div class="spacing-bar" style="width: var(--custom-spacing-5xl)"></div>
              <div class="spacing-box" style="width: var(--custom-spacing-5xl); height: var(--custom-spacing-5xl)"></div>
            </div>
          </div>
          
          <!-- Section -->
          <div class="spacing-item" onclick="navigator.clipboard.writeText('--custom-spacing-section')">
            <div class="spacing-info">
              <h3>Section</h3>
              <code>--custom-spacing-section</code>
              <span class="value">2.5rem (40px)</span>
              <p>Standard spacing between content sections</p>
            </div>
            <div class="spacing-demo">
              <div class="spacing-bar" style="width: var(--custom-spacing-section)"></div>
              <div class="spacing-box" style="width: var(--custom-spacing-section); height: var(--custom-spacing-section)"></div>
            </div>
          </div>
          
          <!-- Page -->
          <div class="spacing-item" onclick="navigator.clipboard.writeText('--custom-spacing-page')">
            <div class="spacing-info">
              <h3>Page</h3>
              <code>--custom-spacing-page</code>
              <span class="value">3.5rem (56px)</span>
              <p>Page-level padding and major content separation</p>
            </div>
            <div class="spacing-demo">
              <div class="spacing-bar" style="width: var(--custom-spacing-page)"></div>
              <div class="spacing-box" style="width: var(--custom-spacing-page); height: var(--custom-spacing-page)"></div>
            </div>
          </div>
        </div>
      </section>
      
      <section class="comparison-section">
        <h2>Complete Spacing Scale</h2>
        <p>Here's how custom spacing tokens fit into the complete scale:</p>
        
        <div class="scale-visual">
          <div class="scale-item">
            <span class="scale-label">0</span>
            <div class="scale-bar" style="width: 0"></div>
          </div>
          <div class="scale-item custom">
            <span class="scale-label">xxs</span>
            <div class="scale-bar" style="width: var(--custom-spacing-xxs)"></div>
          </div>
          <div class="scale-item">
            <span class="scale-label">xs</span>
            <div class="scale-bar" style="width: var(--mantine-spacing-xs)"></div>
          </div>
          <div class="scale-item">
            <span class="scale-label">sm</span>
            <div class="scale-bar" style="width: var(--mantine-spacing-sm)"></div>
          </div>
          <div class="scale-item">
            <span class="scale-label">md</span>
            <div class="scale-bar" style="width: var(--mantine-spacing-md)"></div>
          </div>
          <div class="scale-item">
            <span class="scale-label">lg</span>
            <div class="scale-bar" style="width: var(--mantine-spacing-lg)"></div>
          </div>
          <div class="scale-item">
            <span class="scale-label">xl</span>
            <div class="scale-bar" style="width: var(--mantine-spacing-xl)"></div>
          </div>
          <div class="scale-item custom">
            <span class="scale-label">section</span>
            <div class="scale-bar" style="width: var(--custom-spacing-section)"></div>
          </div>
          <div class="scale-item">
            <span class="scale-label">2xl</span>
            <div class="scale-bar" style="width: var(--mantine-spacing-2xl)"></div>
          </div>
          <div class="scale-item">
            <span class="scale-label">3xl</span>
            <div class="scale-bar" style="width: var(--mantine-spacing-3xl)"></div>
          </div>
          <div class="scale-item custom">
            <span class="scale-label">page</span>
            <div class="scale-bar" style="width: var(--custom-spacing-page)"></div>
          </div>
          <div class="scale-item custom">
            <span class="scale-label">4xl</span>
            <div class="scale-bar" style="width: var(--custom-spacing-4xl)"></div>
          </div>
          <div class="scale-item custom">
            <span class="scale-label">5xl</span>
            <div class="scale-bar" style="width: var(--custom-spacing-5xl)"></div>
          </div>
        </div>
      </section>
      
      <section class="usage-section">
        <h2>Usage Examples</h2>
        
        <div class="example-grid">
          <div class="example-card">
            <h3>Hero Section</h3>
            <pre><code>.hero {
  padding-top: var(--custom-spacing-5xl);
  padding-bottom: var(--custom-spacing-4xl);
  margin-bottom: var(--custom-spacing-section);
}</code></pre>
          </div>
          
          <div class="example-card">
            <h3>Page Layout</h3>
            <pre><code>.page-container {
  padding: var(--custom-spacing-page);
  
  .section + .section {
    margin-top: var(--custom-spacing-section);
  }
}</code></pre>
          </div>
          
          <div class="example-card">
            <h3>Compact Elements</h3>
            <pre><code>.badge {
  padding: var(--custom-spacing-xxs) var(--mantine-spacing-xs);
  gap: var(--custom-spacing-xxs);
}</code></pre>
          </div>
        </div>
      </section>
    </div>
    
    <style>
      .custom-spacing {
        padding: 2rem;
        font-family: var(--mantine-typography-fontfamily-sans);
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .description {
        font-size: 1.125rem;
        color: var(--mantine-color-gray-700);
        margin-bottom: 3rem;
        line-height: 1.6;
      }
      
      .spacing-section,
      .comparison-section,
      .usage-section {
        margin-bottom: 3rem;
      }
      
      .section-description {
        color: var(--mantine-color-gray-600);
        margin: 0.5rem 0 2rem 0;
      }
      
      .spacing-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .spacing-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        background: white;
        border: 1px solid var(--mantine-color-gray-200);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .spacing-item:hover {
        border-color: var(--mantine-color-blue-300);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
      }
      
      .spacing-info {
        flex: 1;
      }
      
      .spacing-info h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.125rem;
        color: var(--mantine-color-gray-800);
      }
      
      .spacing-info code {
        display: inline-block;
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.875rem;
        color: var(--mantine-color-gray-600);
        margin-bottom: 0.25rem;
      }
      
      .spacing-info .value {
        display: inline-block;
        margin-left: 1rem;
        color: var(--mantine-color-gray-500);
        font-size: 0.875rem;
      }
      
      .spacing-info p {
        margin: 0.5rem 0 0 0;
        color: var(--mantine-color-gray-600);
        font-size: 0.875rem;
      }
      
      .spacing-demo {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 1rem;
        margin-left: 2rem;
      }
      
      .spacing-bar {
        height: 4px;
        background: var(--mantine-color-blue-500);
        border-radius: 2px;
      }
      
      .spacing-box {
        background: var(--mantine-color-blue-100);
        border: 1px solid var(--mantine-color-blue-300);
        border-radius: 0.25rem;
      }
      
      .scale-visual {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1.5rem;
        padding: 1.5rem;
        background: var(--mantine-color-gray-50);
        border-radius: 0.5rem;
      }
      
      .scale-item {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      
      .scale-item.custom .scale-label {
        color: var(--mantine-color-blue-600);
        font-weight: 600;
      }
      
      .scale-item.custom .scale-bar {
        background: var(--mantine-color-blue-500);
      }
      
      .scale-label {
        font-size: 0.813rem;
        font-family: var(--mantine-typography-fontfamily-mono);
        color: var(--mantine-color-gray-600);
        width: 60px;
        text-align: right;
      }
      
      .scale-bar {
        height: 8px;
        background: var(--mantine-color-gray-400);
        border-radius: 4px;
      }
      
      .example-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
      }
      
      .example-card {
        padding: 1.5rem;
        background: var(--mantine-color-gray-50);
        border-radius: 0.5rem;
      }
      
      .example-card h3 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        color: var(--mantine-color-gray-800);
      }
      
      .example-card pre {
        margin: 0;
        padding: 1rem;
        background: white;
        border: 1px solid var(--mantine-color-gray-200);
        border-radius: 0.375rem;
        overflow-x: auto;
      }
      
      .example-card code {
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.813rem;
        line-height: 1.5;
      }
      
      /* Copy feedback */
      .spacing-item:active {
        transform: scale(0.98);
      }
      
      @media (max-width: 768px) {
        .spacing-item {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .spacing-demo {
          margin-left: 0;
          margin-top: 1rem;
          align-items: flex-start;
          width: 100%;
        }
        
        .example-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
    
    <script>
      // Visual feedback when copying
      document.querySelectorAll('.spacing-item').forEach(el => {
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
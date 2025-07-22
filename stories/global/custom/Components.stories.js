export default {
  title: 'Global/Custom/Components',
  parameters: {
    docs: {
      description: {
        component: 'Custom tokens designed for specific component patterns like oval buttons.'
      }
    }
  }
};

export const ComponentTokens = () => {
  return `
    <div class="custom-components">
      <h1>Custom Component Tokens</h1>
      <p class="description">
        Component-specific tokens provide a complete design system for custom components. 
        These tokens ensure consistency across all instances of a component while allowing for size variations and states.
      </p>
      
      <!-- Oval Button Section -->
      <section class="component-section">
        <h2>Oval Button Tokens</h2>
        <p class="section-description">
          Complete token set for creating pill-shaped buttons with multiple sizes and states
        </p>
        
        <!-- Size Variants -->
        <div class="subsection">
          <h3>Size Variants</h3>
          <div class="size-grid">
            <div class="size-variant" onclick="navigator.clipboard.writeText('--custom-ovalbutton-height-xs')">
              <div class="button-demo xs">
                <button class="oval-button xs">Extra Small</button>
              </div>
              <div class="size-info">
                <h4>XS</h4>
                <div class="token-list">
                  <div class="token-item">
                    <code>--custom-ovalbutton-height-xs</code>
                    <span>2rem</span>
                  </div>
                  <div class="token-item">
                    <code>--custom-ovalbutton-padding-horizontal-xs</code>
                    <span>1rem</span>
                  </div>
                  <div class="token-item">
                    <code>--custom-ovalbutton-minwidth-xs</code>
                    <span>6rem</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="size-variant" onclick="navigator.clipboard.writeText('--custom-ovalbutton-height-sm')">
              <div class="button-demo sm">
                <button class="oval-button sm">Small</button>
              </div>
              <div class="size-info">
                <h4>SM</h4>
                <div class="token-list">
                  <div class="token-item">
                    <code>--custom-ovalbutton-height-sm</code>
                    <span>2.5rem</span>
                  </div>
                  <div class="token-item">
                    <code>--custom-ovalbutton-padding-horizontal-sm</code>
                    <span>1.5rem</span>
                  </div>
                  <div class="token-item">
                    <code>--custom-ovalbutton-minwidth-sm</code>
                    <span>8rem</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="size-variant" onclick="navigator.clipboard.writeText('--custom-ovalbutton-height-md')">
              <div class="button-demo md">
                <button class="oval-button md">Medium</button>
              </div>
              <div class="size-info">
                <h4>MD</h4>
                <div class="token-list">
                  <div class="token-item">
                    <code>--custom-ovalbutton-height-md</code>
                    <span>3rem</span>
                  </div>
                  <div class="token-item">
                    <code>--custom-ovalbutton-padding-horizontal-md</code>
                    <span>2rem</span>
                  </div>
                  <div class="token-item">
                    <code>--custom-ovalbutton-minwidth-md</code>
                    <span>10rem</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="size-variant" onclick="navigator.clipboard.writeText('--custom-ovalbutton-height-lg')">
              <div class="button-demo lg">
                <button class="oval-button lg">Large</button>
              </div>
              <div class="size-info">
                <h4>LG</h4>
                <div class="token-list">
                  <div class="token-item">
                    <code>--custom-ovalbutton-height-lg</code>
                    <span>3.5rem</span>
                  </div>
                  <div class="token-item">
                    <code>--custom-ovalbutton-padding-horizontal-lg</code>
                    <span>2.5rem</span>
                  </div>
                  <div class="token-item">
                    <code>--custom-ovalbutton-minwidth-lg</code>
                    <span>12rem</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="size-variant" onclick="navigator.clipboard.writeText('--custom-ovalbutton-height-xl')">
              <div class="button-demo xl">
                <button class="oval-button xl">Extra Large</button>
              </div>
              <div class="size-info">
                <h4>XL</h4>
                <div class="token-list">
                  <div class="token-item">
                    <code>--custom-ovalbutton-height-xl</code>
                    <span>4rem</span>
                  </div>
                  <div class="token-item">
                    <code>--custom-ovalbutton-padding-horizontal-xl</code>
                    <span>3rem</span>
                  </div>
                  <div class="token-item">
                    <code>--custom-ovalbutton-minwidth-xl</code>
                    <span>14rem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Visual Properties -->
        <div class="subsection">
          <h3>Visual Properties</h3>
          <div class="property-grid">
            <div class="property-card" onclick="navigator.clipboard.writeText('--custom-ovalbutton-radius')">
              <h4>Border Radius</h4>
              <div class="property-demo">
                <div class="radius-demo"></div>
              </div>
              <code>--custom-ovalbutton-radius</code>
              <span class="value">999px</span>
              <p>Creates perfect pill shape</p>
            </div>
            
            <div class="property-card" onclick="navigator.clipboard.writeText('--custom-ovalbutton-border-width')">
              <h4>Border</h4>
              <div class="property-demo">
                <button class="oval-button outline">Outlined</button>
              </div>
              <code>--custom-ovalbutton-border-width</code>
              <span class="value">2px</span>
              <p>For outlined variants</p>
            </div>
            
            <div class="property-card" onclick="navigator.clipboard.writeText('--custom-ovalbutton-icongap')">
              <h4>Icon Gap</h4>
              <div class="property-demo">
                <button class="oval-button with-icon">
                  <span class="icon">→</span>
                  With Icon
                </button>
              </div>
              <code>--custom-ovalbutton-icongap</code>
              <span class="value">0.75rem</span>
              <p>Space between icon and text</p>
            </div>
          </div>
        </div>
        
        <!-- Interactive States -->
        <div class="subsection">
          <h3>Interactive States</h3>
          <div class="states-grid">
            <div class="state-card">
              <h4>Shadows</h4>
              <div class="shadow-list">
                <div class="shadow-item" onclick="navigator.clipboard.writeText('--custom-ovalbutton-shadow-default')">
                  <button class="oval-button shadow-default">Default Shadow</button>
                  <code>--custom-ovalbutton-shadow-default</code>
                  <span>0 2px 8px rgba(0,0,0,0.1)</span>
                </div>
                <div class="shadow-item" onclick="navigator.clipboard.writeText('--custom-ovalbutton-shadow-hover')">
                  <button class="oval-button shadow-hover">Hover Shadow</button>
                  <code>--custom-ovalbutton-shadow-hover</code>
                  <span>0 4px 12px rgba(0,0,0,0.15)</span>
                </div>
                <div class="shadow-item" onclick="navigator.clipboard.writeText('--custom-ovalbutton-shadow-active')">
                  <button class="oval-button shadow-active">Active Shadow</button>
                  <code>--custom-ovalbutton-shadow-active</code>
                  <span>0 1px 4px rgba(0,0,0,0.2)</span>
                </div>
              </div>
            </div>
            
            <div class="state-card">
              <h4>Transitions</h4>
              <div class="transition-info">
                <div class="transition-item" onclick="navigator.clipboard.writeText('--custom-ovalbutton-transition-duration')">
                  <code>--custom-ovalbutton-transition-duration</code>
                  <span class="value">200ms</span>
                </div>
                <div class="transition-item" onclick="navigator.clipboard.writeText('--custom-ovalbutton-transition-timing')">
                  <code>--custom-ovalbutton-transition-timing</code>
                  <span class="value">cubic-bezier(0.4, 0, 0.2, 1)</span>
                </div>
                <div class="transition-item" onclick="navigator.clipboard.writeText('--custom-ovalbutton-loadingopacity')">
                  <code>--custom-ovalbutton-loadingopacity</code>
                  <span class="value">0.7</span>
                </div>
              </div>
              <button class="oval-button interactive">Hover Me</button>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Usage Example -->
      <section class="usage-section">
        <h2>Implementation Example</h2>
        <p>Here's how to implement an oval button using these custom tokens:</p>
        
        <div class="code-example">
          <pre><code>/* Oval Button Component */
.oval-button {
  /* Size tokens */
  height: var(--custom-ovalbutton-height-md);
  padding: 0 var(--custom-ovalbutton-padding-horizontal-md);
  min-width: var(--custom-ovalbutton-minwidth-md);
  
  /* Visual tokens */
  border-radius: var(--custom-ovalbutton-radius);
  border: var(--custom-ovalbutton-border-width) solid transparent;
  box-shadow: var(--custom-ovalbutton-shadow-default);
  
  /* Interactive tokens */
  transition: all var(--custom-ovalbutton-transition-duration) 
              var(--custom-ovalbutton-transition-timing);
  
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--custom-ovalbutton-icongap);
  
  /* Typography */
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
}

.oval-button:hover {
  box-shadow: var(--custom-ovalbutton-shadow-hover);
  transform: translateY(-1px);
}

.oval-button:active {
  box-shadow: var(--custom-ovalbutton-shadow-active);
  transform: translateY(0);
}

.oval-button:disabled {
  opacity: var(--custom-ovalbutton-loadingopacity);
  cursor: not-allowed;
}</code></pre>
        </div>
      </section>
    </div>
    
    <style>
      .custom-components {
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
      
      .component-section {
        margin-bottom: 3rem;
      }
      
      .section-description {
        color: var(--mantine-color-gray-600);
        margin: 0.5rem 0 2rem 0;
      }
      
      .subsection {
        margin-bottom: 3rem;
      }
      
      .subsection h3 {
        margin: 0 0 1.5rem 0;
        font-size: 1.25rem;
        color: var(--mantine-color-gray-800);
      }
      
      /* Size Variants */
      .size-grid {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .size-variant {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 2rem;
        padding: 1.5rem;
        background: white;
        border: 1px solid var(--mantine-color-gray-200);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .size-variant:hover {
        border-color: var(--mantine-color-blue-300);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .button-demo {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .size-info h4 {
        margin: 0 0 1rem 0;
        font-size: 1.125rem;
        color: var(--mantine-color-gray-800);
      }
      
      .token-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .token-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background: var(--mantine-color-gray-50);
        border-radius: 0.25rem;
      }
      
      .token-item code {
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-gray-600);
      }
      
      .token-item span {
        font-size: 0.813rem;
        color: var(--mantine-color-gray-500);
      }
      
      /* Oval Button Base Styles */
      .oval-button {
        background: var(--mantine-color-blue-600);
        color: white;
        border: var(--custom-ovalbutton-border-width) solid transparent;
        border-radius: var(--custom-ovalbutton-radius);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--custom-ovalbutton-transition-duration) 
                    var(--custom-ovalbutton-transition-timing);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--custom-ovalbutton-icongap);
      }
      
      .oval-button.xs {
        height: var(--custom-ovalbutton-height-xs);
        padding: 0 var(--custom-ovalbutton-padding-horizontal-xs);
        min-width: var(--custom-ovalbutton-minwidth-xs);
        font-size: 0.75rem;
      }
      
      .oval-button.sm {
        height: var(--custom-ovalbutton-height-sm);
        padding: 0 var(--custom-ovalbutton-padding-horizontal-sm);
        min-width: var(--custom-ovalbutton-minwidth-sm);
        font-size: 0.813rem;
      }
      
      .oval-button.md {
        height: var(--custom-ovalbutton-height-md);
        padding: 0 var(--custom-ovalbutton-padding-horizontal-md);
        min-width: var(--custom-ovalbutton-minwidth-md);
        font-size: 0.875rem;
      }
      
      .oval-button.lg {
        height: var(--custom-ovalbutton-height-lg);
        padding: 0 var(--custom-ovalbutton-padding-horizontal-lg);
        min-width: var(--custom-ovalbutton-minwidth-lg);
        font-size: 1rem;
      }
      
      .oval-button.xl {
        height: var(--custom-ovalbutton-height-xl);
        padding: 0 var(--custom-ovalbutton-padding-horizontal-xl);
        min-width: var(--custom-ovalbutton-minwidth-xl);
        font-size: 1.125rem;
      }
      
      .oval-button.outline {
        background: transparent;
        color: var(--mantine-color-blue-600);
        border-color: var(--mantine-color-blue-600);
      }
      
      .oval-button.with-icon .icon {
        font-size: 1.25em;
      }
      
      /* Property Grid */
      .property-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }
      
      .property-card {
        padding: 1.5rem;
        background: white;
        border: 1px solid var(--mantine-color-gray-200);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .property-card:hover {
        border-color: var(--mantine-color-blue-300);
        transform: translateY(-2px);
      }
      
      .property-card h4 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        color: var(--mantine-color-gray-800);
      }
      
      .property-demo {
        margin-bottom: 1rem;
        display: flex;
        justify-content: center;
      }
      
      .radius-demo {
        width: 100px;
        height: 40px;
        background: var(--mantine-color-blue-100);
        border: 2px solid var(--mantine-color-blue-300);
        border-radius: var(--custom-ovalbutton-radius);
      }
      
      .property-card code {
        display: block;
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-gray-600);
        margin-bottom: 0.25rem;
      }
      
      .property-card .value {
        display: block;
        font-size: 0.813rem;
        color: var(--mantine-color-gray-500);
        margin-bottom: 0.5rem;
      }
      
      .property-card p {
        margin: 0;
        font-size: 0.813rem;
        color: var(--mantine-color-gray-600);
      }
      
      /* States Grid */
      .states-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
      }
      
      .state-card {
        padding: 1.5rem;
        background: white;
        border: 1px solid var(--mantine-color-gray-200);
        border-radius: 0.5rem;
      }
      
      .state-card h4 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        color: var(--mantine-color-gray-800);
      }
      
      .shadow-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      .shadow-item {
        text-align: center;
        cursor: pointer;
      }
      
      .shadow-item code {
        display: block;
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-gray-600);
        margin-top: 0.5rem;
      }
      
      .shadow-item span {
        display: block;
        font-size: 0.75rem;
        color: var(--mantine-color-gray-500);
        margin-top: 0.25rem;
      }
      
      .oval-button.shadow-default {
        box-shadow: var(--custom-ovalbutton-shadow-default);
      }
      
      .oval-button.shadow-hover {
        box-shadow: var(--custom-ovalbutton-shadow-hover);
      }
      
      .oval-button.shadow-active {
        box-shadow: var(--custom-ovalbutton-shadow-active);
      }
      
      .transition-info {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
      }
      
      .transition-item {
        padding: 0.5rem;
        background: var(--mantine-color-gray-50);
        border-radius: 0.25rem;
        cursor: pointer;
      }
      
      .transition-item code {
        display: block;
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-gray-600);
        margin-bottom: 0.25rem;
      }
      
      .transition-item .value {
        font-size: 0.813rem;
        color: var(--mantine-color-gray-500);
      }
      
      .oval-button.interactive:hover {
        background: var(--mantine-color-blue-700);
        box-shadow: var(--custom-ovalbutton-shadow-hover);
        transform: translateY(-2px);
      }
      
      .oval-button.interactive:active {
        box-shadow: var(--custom-ovalbutton-shadow-active);
        transform: translateY(0);
      }
      
      /* Usage Section */
      .usage-section {
        margin-top: 3rem;
      }
      
      .code-example {
        background: #f6f8fa;
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-top: 1rem;
      }
      
      .code-example pre {
        margin: 0;
        padding: 1rem;
        background: white;
        border: 1px solid var(--mantine-color-gray-200);
        border-radius: 0.375rem;
        overflow-x: auto;
      }
      
      .code-example code {
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.813rem;
        line-height: 1.5;
        color: var(--mantine-color-gray-900);
      }
      
      /* Copy feedback */
      .size-variant:active,
      .property-card:active,
      .shadow-item:active,
      .transition-item:active {
        transform: scale(0.98);
      }
      
      @media (max-width: 768px) {
        .size-variant {
          grid-template-columns: 1fr;
        }
        
        .states-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
    
    <script>
      // Visual feedback when copying
      document.querySelectorAll('.size-variant, .property-card, .shadow-item, .transition-item').forEach(el => {
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
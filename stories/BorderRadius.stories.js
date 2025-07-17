export default {
  title: 'Design Tokens/Border Radius',
  parameters: {
    docs: {
      description: {
        component: 'Border radius tokens for consistent rounded corners'
      }
    }
  }
};

export const RadiusScale = () => {
  const radii = [
    { name: 'none', value: '0', pixels: '0px', description: 'Sharp corners' },
    { name: 'xs', value: '0.125rem', pixels: '2px', description: 'Extra small radius' },
    { name: 'sm', value: '0.25rem', pixels: '4px', description: 'Small radius' },
    { name: 'md', value: '0.5rem', pixels: '8px', description: 'Medium radius' },
    { name: 'lg', value: '1rem', pixels: '16px', description: 'Large radius' },
    { name: 'xl', value: '2rem', pixels: '32px', description: 'Extra large radius' },
    { name: 'full', value: '9999px', pixels: 'Full', description: 'Pill shape' }
  ];
  
  return `
    <div class="radius-section">
      <h2>Border Radius Scale</h2>
      <p class="section-description">Click any radius to copy the CSS variable</p>
      
      <div class="radius-grid">
        ${radii.map(radius => `
          <div class="radius-item" data-var="--mantine-radius-${radius.name}">
            <div class="radius-box" style="border-radius: var(--mantine-radius-${radius.name})">
              <div class="radius-inner"></div>
            </div>
            <div class="radius-info">
              <h3>${radius.name}</h3>
              <p class="radius-description">${radius.description}</p>
              <div class="radius-values">
                <span>${radius.value}</span>
                <span class="radius-pixels">${radius.pixels}</span>
              </div>
              <code>var(--mantine-radius-${radius.name})</code>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <style>
      .radius-section {
        padding: 1rem;
        font-family: var(--mantine-font-family-body);
      }
      
      .radius-section h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1.5rem;
        font-weight: 600;
      }
      
      .section-description {
        margin: 0 0 2rem 0;
        color: var(--mantine-color-text-secondary);
        font-size: 0.875rem;
      }
      
      .radius-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1.5rem;
      }
      
      .radius-item {
        cursor: pointer;
        text-align: center;
      }
      
      .radius-box {
        width: 100px;
        height: 100px;
        background: var(--mantine-color-primary);
        margin: 0 auto 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 150ms ease;
      }
      
      .radius-item:hover .radius-box {
        transform: scale(1.05);
      }
      
      .radius-inner {
        width: 80%;
        height: 80%;
        background: var(--mantine-color-surface);
        border-radius: inherit;
      }
      
      .radius-info h3 {
        margin: 0 0 0.25rem 0;
        font-size: 1rem;
        font-weight: 600;
      }
      
      .radius-description {
        margin: 0 0 0.5rem 0;
        font-size: 0.75rem;
        color: var(--mantine-color-text-secondary);
      }
      
      .radius-values {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.75rem;
      }
      
      .radius-pixels {
        color: var(--mantine-color-text-tertiary);
      }
      
      .radius-info code {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        background: var(--mantine-color-background);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-xs);
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.625rem;
        color: var(--mantine-color-text-secondary);
      }
    </style>
    
    <script>
      setTimeout(() => {
        document.querySelectorAll('.radius-item').forEach(item => {
          item.addEventListener('click', () => {
            const cssVar = item.dataset.var;
            navigator.clipboard.writeText(cssVar);
            
            const title = item.querySelector('h3');
            const originalText = title.textContent;
            title.textContent = 'Copied!';
            setTimeout(() => {
              title.textContent = originalText;
            }, 1000);
          });
        });
      }, 0);
    </script>
  `;
};

export const RadiusExamples = () => {
  return `
    <div class="radius-section">
      <h2>Border Radius in Practice</h2>
      
      <div class="example-grid">
        <div class="example-section">
          <h3>Buttons</h3>
          <div class="button-examples">
            <button class="example-button" style="border-radius: var(--mantine-radius-none)">
              None
            </button>
            <button class="example-button" style="border-radius: var(--mantine-radius-sm)">
              Small
            </button>
            <button class="example-button" style="border-radius: var(--mantine-radius-md)">
              Medium
            </button>
            <button class="example-button" style="border-radius: var(--mantine-radius-full)">
              Full
            </button>
          </div>
        </div>
        
        <div class="example-section">
          <h3>Cards</h3>
          <div class="card-examples">
            <div class="example-card" style="border-radius: var(--mantine-radius-sm)">
              <h4>Small Radius</h4>
              <p>Subtle rounded corners</p>
            </div>
            <div class="example-card" style="border-radius: var(--mantine-radius-md)">
              <h4>Medium Radius</h4>
              <p>Standard card appearance</p>
            </div>
            <div class="example-card" style="border-radius: var(--mantine-radius-lg)">
              <h4>Large Radius</h4>
              <p>More pronounced rounding</p>
            </div>
          </div>
        </div>
        
        <div class="example-section">
          <h3>Input Fields</h3>
          <div class="input-examples">
            <input type="text" placeholder="None" style="border-radius: var(--mantine-radius-none)" />
            <input type="text" placeholder="Small radius" style="border-radius: var(--mantine-radius-sm)" />
            <input type="text" placeholder="Medium radius" style="border-radius: var(--mantine-radius-md)" />
            <input type="text" placeholder="Full radius" style="border-radius: var(--mantine-radius-full)" />
          </div>
        </div>
        
        <div class="example-section">
          <h3>Badges & Pills</h3>
          <div class="badge-examples">
            <span class="example-badge" style="border-radius: var(--mantine-radius-sm)">Small</span>
            <span class="example-badge" style="border-radius: var(--mantine-radius-md)">Medium</span>
            <span class="example-badge" style="border-radius: var(--mantine-radius-lg)">Large</span>
            <span class="example-badge" style="border-radius: var(--mantine-radius-full)">Full</span>
          </div>
        </div>
      </div>
    </div>
    
    <style>
      .example-grid {
        display: grid;
        gap: 2rem;
      }
      
      .example-section {
        background: var(--mantine-color-background);
        padding: 1.5rem;
        border-radius: var(--mantine-radius-md);
      }
      
      .example-section h3 {
        margin: 0 0 1rem 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--mantine-color-text-secondary);
      }
      
      .button-examples {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      
      .example-button {
        padding: 0.75rem 1.5rem;
        background: var(--mantine-color-primary);
        color: white;
        border: none;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 150ms ease;
      }
      
      .example-button:hover {
        background: var(--mantine-color-primary-hover);
        transform: translateY(-1px);
      }
      
      .card-examples {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
      }
      
      .example-card {
        background: var(--mantine-color-surface);
        padding: 1rem;
        border: 1px solid var(--mantine-color-border-subtle);
      }
      
      .example-card h4 {
        margin: 0 0 0.5rem 0;
        font-size: 0.875rem;
        font-weight: 600;
      }
      
      .example-card p {
        margin: 0;
        font-size: 0.75rem;
        color: var(--mantine-color-text-secondary);
      }
      
      .input-examples {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .input-examples input {
        padding: 0.5rem 1rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border);
        font-size: 0.875rem;
        font-family: inherit;
        outline: none;
        transition: all 150ms ease;
      }
      
      .input-examples input:focus {
        border-color: var(--mantine-color-primary);
        box-shadow: 0 0 0 2px rgba(var(--mantine-color-primary-rgb), 0.2);
      }
      
      .badge-examples {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        flex-wrap: wrap;
      }
      
      .example-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background: var(--mantine-color-primary);
        color: white;
        font-size: 0.75rem;
        font-weight: 600;
      }
    </style>
  `;
};
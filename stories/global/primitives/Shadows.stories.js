export default {
  title: 'Global/Primitives/Shadows',
  parameters: {
    docs: {
      description: {
        component: 'Shadow tokens for elevation and depth'
      }
    }
  }
};

export const ShadowScale = () => {
  const shadows = [
    { name: 'xs', label: 'Extra Small', description: 'Minimal elevation' },
    { name: 'sm', label: 'Small', description: 'Subtle elevation' },
    { name: 'md', label: 'Medium', description: 'Moderate elevation' },
    { name: 'lg', label: 'Large', description: 'Prominent elevation' },
    { name: 'xl', label: 'Extra Large', description: 'Maximum elevation' }
  ];
  
  return `
    <div class="shadow-section">
      <h2>Shadow Scale</h2>
      <p class="section-description">Click any shadow to copy the CSS variable</p>
      
      <div class="shadow-grid">
        ${shadows.map(shadow => `
          <div class="shadow-item" data-var="--mantine-shadow-${shadow.name}">
            <div class="shadow-box" style="box-shadow: var(--mantine-shadow-${shadow.name})">
              <h3>${shadow.label}</h3>
              <p>${shadow.description}</p>
              <code>var(--mantine-shadow-${shadow.name})</code>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <style>
      .shadow-section {
        padding: 1rem;
        font-family: var(--mantine-font-family-body);
      }
      
      .shadow-section h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1.5rem;
        font-weight: 600;
      }
      
      .section-description {
        margin: 0 0 2rem 0;
        color: var(--mantine-color-text-secondary);
        font-size: 0.875rem;
      }
      
      .shadow-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
      }
      
      .shadow-item {
        cursor: pointer;
      }
      
      .shadow-box {
        background: var(--mantine-color-surface);
        border-radius: var(--mantine-radius-md);
        padding: 1.5rem;
        height: 100%;
        transition: all 200ms ease;
      }
      
      .shadow-box:hover {
        transform: translateY(-2px);
      }
      
      .shadow-box h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 600;
      }
      
      .shadow-box p {
        margin: 0 0 1rem 0;
        font-size: 0.875rem;
        color: var(--mantine-color-text-secondary);
      }
      
      .shadow-box code {
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
    
    <script>
      setTimeout(() => {
        document.querySelectorAll('.shadow-item').forEach(item => {
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

export const ShadowExamples = () => {
  return `
    <div class="shadow-section">
      <h2>Shadow Use Cases</h2>
      
      <div class="example-grid">
        <div class="example-section">
          <h3>Cards</h3>
          <div class="card-examples">
            <div class="example-card" style="box-shadow: var(--mantine-shadow-sm)">
              <h4>Default Card</h4>
              <p>Uses sm shadow for subtle elevation</p>
            </div>
            <div class="example-card elevated" style="box-shadow: var(--mantine-shadow-md)">
              <h4>Elevated Card</h4>
              <p>Uses md shadow on hover or for emphasis</p>
            </div>
          </div>
        </div>
        
        <div class="example-section">
          <h3>Modals & Overlays</h3>
          <div class="modal-example">
            <div class="modal-backdrop">
              <div class="modal-content" style="box-shadow: var(--mantine-shadow-xl)">
                <h4>Modal Dialog</h4>
                <p>Uses xl shadow for maximum elevation</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="example-section">
          <h3>Interactive Elements</h3>
          <div class="interactive-examples">
            <button class="shadow-button">
              Hover for shadow
            </button>
            <div class="dropdown-example">
              <button class="dropdown-trigger">Dropdown</button>
              <div class="dropdown-menu" style="box-shadow: var(--mantine-shadow-lg)">
                <div class="dropdown-item">Option 1</div>
                <div class="dropdown-item">Option 2</div>
                <div class="dropdown-item">Option 3</div>
              </div>
            </div>
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
      
      .card-examples {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }
      
      .example-card {
        background: var(--mantine-color-surface);
        padding: 1.25rem;
        border-radius: var(--mantine-radius-md);
        transition: all 200ms ease;
      }
      
      .example-card.elevated:hover {
        box-shadow: var(--mantine-shadow-lg);
        transform: translateY(-2px);
      }
      
      .example-card h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 600;
      }
      
      .example-card p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--mantine-color-text-secondary);
      }
      
      .modal-example {
        height: 200px;
        position: relative;
      }
      
      .modal-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.1);
        border-radius: var(--mantine-radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .modal-content {
        background: var(--mantine-color-surface);
        padding: 1.5rem;
        border-radius: var(--mantine-radius-md);
        max-width: 300px;
      }
      
      .modal-content h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 600;
      }
      
      .modal-content p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--mantine-color-text-secondary);
      }
      
      .interactive-examples {
        display: flex;
        gap: 1.5rem;
        align-items: flex-start;
      }
      
      .shadow-button {
        padding: 0.75rem 1.5rem;
        background: var(--mantine-color-primary);
        color: white;
        border: none;
        border-radius: var(--mantine-radius-sm);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 150ms ease;
      }
      
      .shadow-button:hover {
        box-shadow: var(--mantine-shadow-md);
        transform: translateY(-1px);
      }
      
      .dropdown-example {
        position: relative;
      }
      
      .dropdown-trigger {
        padding: 0.75rem 1.5rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border);
        border-radius: var(--mantine-radius-sm);
        font-size: 0.875rem;
        cursor: pointer;
      }
      
      .dropdown-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 0;
        background: var(--mantine-color-surface);
        border-radius: var(--mantine-radius-md);
        min-width: 150px;
        overflow: hidden;
      }
      
      .dropdown-item {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        cursor: pointer;
        transition: background 150ms ease;
      }
      
      .dropdown-item:hover {
        background: var(--mantine-color-background);
      }
    </style>
  `;
};
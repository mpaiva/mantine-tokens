export default {
  title: 'Design Tokens/Spacing',
  parameters: {
    docs: {
      description: {
        component: 'Spacing scale for consistent layout and component spacing'
      }
    }
  }
};

export const SpacingScale = () => {
  const spacings = [
    { name: '0', value: '0', pixels: '0px' },
    { name: 'xs', value: '0.625rem', pixels: '10px' },
    { name: 'sm', value: '0.75rem', pixels: '12px' },
    { name: 'md', value: '1rem', pixels: '16px' },
    { name: 'lg', value: '1.25rem', pixels: '20px' },
    { name: 'xl', value: '2rem', pixels: '32px' },
    { name: '2xl', value: '3rem', pixels: '48px' },
    { name: '3xl', value: '4rem', pixels: '64px' }
  ];
  
  return `
    <div class="spacing-section">
      <h2>Spacing Scale</h2>
      <p class="section-description">Click any spacing to copy the CSS variable</p>
      
      <div class="spacing-list">
        ${spacings.map(spacing => `
          <div class="spacing-item" data-var="--mantine-spacing-${spacing.name}">
            <div class="spacing-info">
              <span class="spacing-name">${spacing.name}</span>
              <span class="spacing-value">${spacing.value}</span>
              <span class="spacing-pixels">${spacing.pixels}</span>
            </div>
            <div class="spacing-visual">
              <div class="spacing-bar" style="width: var(--mantine-spacing-${spacing.name})"></div>
            </div>
            <code class="spacing-var">var(--mantine-spacing-${spacing.name})</code>
          </div>
        `).join('')}
      </div>
    </div>
    
    <style>
      .spacing-section {
        padding: 1rem;
        font-family: var(--mantine-font-family-body);
      }
      
      .spacing-section h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1.5rem;
        font-weight: 600;
      }
      
      .section-description {
        margin: 0 0 2rem 0;
        color: var(--mantine-color-text-secondary);
        font-size: 0.875rem;
      }
      
      .spacing-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .spacing-item {
        display: grid;
        grid-template-columns: 120px 1fr auto;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
        cursor: pointer;
        transition: all 150ms ease;
      }
      
      .spacing-item:hover {
        box-shadow: var(--mantine-shadow-sm);
        border-color: var(--mantine-color-border);
      }
      
      .spacing-info {
        display: grid;
        grid-template-columns: 2rem 3rem 3rem;
        gap: 0.5rem;
        align-items: center;
      }
      
      .spacing-name {
        font-weight: 600;
        font-size: 0.875rem;
      }
      
      .spacing-value {
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-text-secondary);
      }
      
      .spacing-pixels {
        font-size: 0.75rem;
        color: var(--mantine-color-text-tertiary);
      }
      
      .spacing-visual {
        flex: 1;
        height: 32px;
        display: flex;
        align-items: center;
      }
      
      .spacing-bar {
        height: 100%;
        background: var(--mantine-color-primary);
        border-radius: var(--mantine-radius-sm);
        min-width: 2px;
      }
      
      .spacing-var {
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-text-secondary);
        padding: 0.25rem 0.5rem;
        background: var(--mantine-color-background);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-xs);
      }
    </style>
    
    <script>
      setTimeout(() => {
        document.querySelectorAll('.spacing-item').forEach(item => {
          item.addEventListener('click', () => {
            const cssVar = item.dataset.var;
            navigator.clipboard.writeText(cssVar);
            
            const name = item.querySelector('.spacing-name');
            const originalText = name.textContent;
            name.textContent = 'Copied!';
            setTimeout(() => {
              name.textContent = originalText;
            }, 1000);
          });
        });
      }, 0);
    </script>
  `;
};

export const SpacingExamples = () => {
  return `
    <div class="spacing-section">
      <h2>Spacing in Practice</h2>
      
      <div class="example-grid">
        <div class="example-card">
          <h3>Padding Example</h3>
          <div class="padding-examples">
            <div class="padding-box" style="padding: var(--mantine-spacing-xs)">
              <div class="padding-content">xs padding</div>
            </div>
            <div class="padding-box" style="padding: var(--mantine-spacing-sm)">
              <div class="padding-content">sm padding</div>
            </div>
            <div class="padding-box" style="padding: var(--mantine-spacing-md)">
              <div class="padding-content">md padding</div>
            </div>
            <div class="padding-box" style="padding: var(--mantine-spacing-lg)">
              <div class="padding-content">lg padding</div>
            </div>
          </div>
        </div>
        
        <div class="example-card">
          <h3>Gap Example</h3>
          <div class="gap-examples">
            <div class="gap-container" style="gap: var(--mantine-spacing-xs)">
              <div class="gap-item">1</div>
              <div class="gap-item">2</div>
              <div class="gap-item">3</div>
            </div>
            <span class="example-label">xs gap</span>
            
            <div class="gap-container" style="gap: var(--mantine-spacing-md)">
              <div class="gap-item">1</div>
              <div class="gap-item">2</div>
              <div class="gap-item">3</div>
            </div>
            <span class="example-label">md gap</span>
            
            <div class="gap-container" style="gap: var(--mantine-spacing-xl)">
              <div class="gap-item">1</div>
              <div class="gap-item">2</div>
              <div class="gap-item">3</div>
            </div>
            <span class="example-label">xl gap</span>
          </div>
        </div>
        
        <div class="example-card">
          <h3>Margin Example</h3>
          <div class="margin-examples">
            <div class="margin-container">
              <div class="margin-box" style="margin-bottom: var(--mantine-spacing-xs)">xs margin</div>
              <div class="margin-box" style="margin-bottom: var(--mantine-spacing-sm)">sm margin</div>
              <div class="margin-box" style="margin-bottom: var(--mantine-spacing-md)">md margin</div>
              <div class="margin-box">lg margin above</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <style>
      .example-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }
      
      .example-card {
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
        padding: 1.5rem;
      }
      
      .example-card h3 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--mantine-color-text-secondary);
      }
      
      .padding-examples {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .padding-box {
        background: var(--mantine-color-background);
        border: 2px dashed var(--mantine-color-border);
        border-radius: var(--mantine-radius-sm);
      }
      
      .padding-content {
        background: var(--mantine-color-primary);
        color: white;
        padding: 0.5rem;
        border-radius: var(--mantine-radius-xs);
        text-align: center;
        font-size: 0.875rem;
      }
      
      .gap-examples {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      .gap-container {
        display: flex;
        align-items: center;
      }
      
      .gap-item {
        width: 40px;
        height: 40px;
        background: var(--mantine-color-primary);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--mantine-radius-sm);
        font-weight: 600;
      }
      
      .example-label {
        font-size: 0.75rem;
        color: var(--mantine-color-text-secondary);
        margin-top: 0.25rem;
      }
      
      .margin-examples {
        background: var(--mantine-color-background);
        padding: 1rem;
        border-radius: var(--mantine-radius-sm);
      }
      
      .margin-box {
        background: var(--mantine-color-primary);
        color: white;
        padding: 0.5rem;
        border-radius: var(--mantine-radius-xs);
        text-align: center;
        font-size: 0.875rem;
      }
    </style>
  `;
};
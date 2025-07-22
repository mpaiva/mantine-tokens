export default {
  title: 'Global/Primitives/Typography',
  parameters: {
    docs: {
      description: {
        component: 'Typography tokens including font families, sizes, weights, and line heights'
      }
    }
  }
};

export const FontFamilies = () => {
  return `
    <div class="typography-section">
      <h2>Font Families</h2>
      
      <div class="font-family-grid">
        <div class="font-family-item">
          <h3>Sans Serif</h3>
          <p class="font-demo" style="font-family: var(--mantine-typography-fontfamily-sans)">
            The quick brown fox jumps over the lazy dog
          </p>
          <code>var(--mantine-typography-fontfamily-sans)</code>
        </div>
        
        <div class="font-family-item">
          <h3>Monospace</h3>
          <p class="font-demo" style="font-family: var(--mantine-typography-fontfamily-mono)">
            const greeting = "Hello, World!";
          </p>
          <code>var(--mantine-typography-fontfamily-mono)</code>
        </div>
        
        <div class="font-family-item">
          <h3>Heading</h3>
          <p class="font-demo" style="font-family: var(--mantine-typography-fontfamily-heading)">
            Bold Headlines Capture Attention
          </p>
          <code>var(--mantine-typography-fontfamily-heading)</code>
        </div>
      </div>
    </div>
    
    <style>
      .typography-section {
        padding: 1rem;
        font-family: var(--mantine-font-family-body);
      }
      
      .typography-section h2 {
        margin: 0 0 1.5rem 0;
        font-size: 1.5rem;
        font-weight: 600;
      }
      
      .font-family-grid {
        display: grid;
        gap: 1.5rem;
      }
      
      .font-family-item {
        padding: 1.5rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
      }
      
      .font-family-item h3 {
        margin: 0 0 0.75rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--mantine-color-text-secondary);
      }
      
      .font-demo {
        margin: 0 0 1rem 0;
        font-size: 1.125rem;
        line-height: 1.5;
      }
      
      .font-family-item code {
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
  `;
};

export const FontSizes = () => {
  const sizes = [
    { name: 'xs', value: '0.75rem', label: 'Extra Small (12px)' },
    { name: 'sm', value: '0.875rem', label: 'Small (14px)' },
    { name: 'md', value: '1rem', label: 'Medium (16px)' },
    { name: 'lg', value: '1.125rem', label: 'Large (18px)' },
    { name: 'xl', value: '1.25rem', label: 'Extra Large (20px)' }
  ];
  
  const headingSizes = [
    { name: 'h1', value: '2.125rem', label: 'Heading 1 (34px)' },
    { name: 'h2', value: '1.625rem', label: 'Heading 2 (26px)' },
    { name: 'h3', value: '1.375rem', label: 'Heading 3 (22px)' },
    { name: 'h4', value: '1.125rem', label: 'Heading 4 (18px)' },
    { name: 'h5', value: '1rem', label: 'Heading 5 (16px)' },
    { name: 'h6', value: '0.875rem', label: 'Heading 6 (14px)' }
  ];
  
  return `
    <div class="typography-section">
      <h2>Font Sizes</h2>
      
      <div class="size-section">
        <h3>Body Text Sizes</h3>
        <div class="size-list">
          ${sizes.map(size => `
            <div class="size-item">
              <p style="font-size: var(--mantine-typography-fontsize-${size.name}); margin: 0;">
                The quick brown fox jumps over the lazy dog
              </p>
              <div class="size-info">
                <span class="size-label">${size.label}</span>
                <code>var(--mantine-typography-fontsize-${size.name})</code>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="size-section">
        <h3>Heading Sizes</h3>
        <div class="size-list">
          ${headingSizes.map(size => `
            <div class="size-item">
              <p style="font-size: var(--mantine-typography-fontsize-${size.name}); font-weight: var(--mantine-typography-fontweight-heading); margin: 0;">
                ${size.label}
              </p>
              <div class="size-info">
                <code>var(--mantine-typography-fontsize-${size.name})</code>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    
    <style>
      .size-section {
        margin-bottom: 2.5rem;
      }
      
      .size-section h3 {
        margin: 0 0 1rem 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--mantine-color-text-secondary);
      }
      
      .size-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      .size-item {
        padding: 1rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
      }
      
      .size-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 0.5rem;
      }
      
      .size-label {
        font-size: 0.75rem;
        color: var(--mantine-color-text-secondary);
      }
      
      .size-item code {
        display: inline-block;
        padding: 0.125rem 0.375rem;
        background: var(--mantine-color-background);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-xs);
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.625rem;
        color: var(--mantine-color-text-secondary);
      }
    </style>
  `;
};

export const FontWeights = () => {
  const weights = [
    { name: 'normal', value: '400', label: 'Normal' },
    { name: 'medium', value: '500', label: 'Medium' },
    { name: 'semibold', value: '600', label: 'Semibold' },
    { name: 'bold', value: '700', label: 'Bold' },
    { name: 'heading', value: '700', label: 'Heading (Bold)' }
  ];
  
  return `
    <div class="typography-section">
      <h2>Font Weights</h2>
      
      <div class="weight-grid">
        ${weights.map(weight => `
          <div class="weight-item">
            <p style="font-weight: var(--mantine-typography-fontweight-${weight.name}); font-size: 1.25rem; margin: 0 0 0.5rem 0;">
              ${weight.label} (${weight.value})
            </p>
            <p style="font-weight: var(--mantine-typography-fontweight-${weight.name}); margin: 0 0 0.75rem 0;">
              The quick brown fox jumps over the lazy dog
            </p>
            <code>var(--mantine-typography-fontweight-${weight.name})</code>
          </div>
        `).join('')}
      </div>
    </div>
    
    <style>
      .weight-grid {
        display: grid;
        gap: 1rem;
      }
      
      .weight-item {
        padding: 1.25rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
      }
      
      .weight-item code {
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
  `;
};

export const LineHeights = () => {
  const lineHeights = [
    { name: 'tight', value: '1.25', label: 'Tight' },
    { name: 'normal', value: '1.55', label: 'Normal' },
    { name: 'relaxed', value: '1.75', label: 'Relaxed' },
    { name: 'heading', value: '1.2', label: 'Heading' }
  ];
  
  return `
    <div class="typography-section">
      <h2>Line Heights</h2>
      
      <div class="line-height-grid">
        ${lineHeights.map(lh => `
          <div class="line-height-item">
            <h3>${lh.label} (${lh.value})</h3>
            <p style="line-height: var(--mantine-typography-lineheight-${lh.name});">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <code>var(--mantine-typography-lineheight-${lh.name})</code>
          </div>
        `).join('')}
      </div>
    </div>
    
    <style>
      .line-height-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }
      
      .line-height-item {
        padding: 1.25rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
      }
      
      .line-height-item h3 {
        margin: 0 0 0.75rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--mantine-color-text-secondary);
      }
      
      .line-height-item p {
        margin: 0 0 1rem 0;
        font-size: 0.875rem;
      }
      
      .line-height-item code {
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
  `;
};

export const LetterSpacing = () => {
  const letterSpacings = [
    { name: 'tight', value: '-0.025em', label: 'Tight' },
    { name: 'normal', value: '0', label: 'Normal' },
    { name: 'wide', value: '0.025em', label: 'Wide' }
  ];
  
  return `
    <div class="typography-section">
      <h2>Letter Spacing</h2>
      
      <div class="letter-spacing-grid">
        ${letterSpacings.map(ls => `
          <div class="letter-spacing-item">
            <h3>${ls.label} (${ls.value})</h3>
            <p style="letter-spacing: var(--mantine-typography-letterspacing-${ls.name}); font-size: 1.125rem;">
              The quick brown fox jumps over the lazy dog
            </p>
            <p style="letter-spacing: var(--mantine-typography-letterspacing-${ls.name}); font-size: 1.125rem; text-transform: uppercase;">
              UPPERCASE TEXT EXAMPLE
            </p>
            <code>var(--mantine-typography-letterspacing-${ls.name})</code>
          </div>
        `).join('')}
      </div>
    </div>
    
    <style>
      .letter-spacing-grid {
        display: grid;
        gap: 1rem;
      }
      
      .letter-spacing-item {
        padding: 1.25rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
      }
      
      .letter-spacing-item h3 {
        margin: 0 0 0.75rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--mantine-color-text-secondary);
      }
      
      .letter-spacing-item p {
        margin: 0 0 0.5rem 0;
      }
      
      .letter-spacing-item code {
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
  `;
};
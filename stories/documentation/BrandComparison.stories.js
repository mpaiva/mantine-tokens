export default {
  title: 'Documentation/Brand Comparison',
  parameters: {
    docs: {
      description: {
        component: 'Visual showcase of brand-specific styling and typography'
      }
    }
  }
};

export const BrandComparison = () => {
  return `
    <div class="brand-showcase">
      <h1>Brand Identity Showcase</h1>
      <p class="description">Switch between brands using the toolbar to see how colors, typography, and styling changes.</p>
      
      <section class="brand-info">
        <h2>Current Brand</h2>
        <div class="brand-details">
          <p>Use the paintbrush icon in the toolbar to switch between:</p>
          <ul id="brand-list">
            <li><strong>Mantine</strong> - <span id="mantine-desc">Default blue theme with system fonts</span></li>
            <li><strong>Clearco</strong> - <span id="clearco-desc">Loading...</span></li>
            <li><strong>Firstwatch</strong> - <span id="firstwatch-desc">Loading...</span></li>
          </ul>
        </div>
      </section>
      
      <section class="color-showcase">
        <h2>Brand Colors</h2>
        <div class="color-grid">
          <div class="color-card">
            <div class="color-swatch primary" style="background: var(--mantine-color-primary)"></div>
            <h3>Primary</h3>
            <p>Main brand color</p>
          </div>
          
          <div class="color-card">
            <div class="color-swatch secondary" style="background: var(--mantine-color-secondary, var(--mantine-color-gray-600))"></div>
            <h3>Secondary</h3>
            <p>Supporting color</p>
          </div>
          
          <div class="color-card">
            <div class="color-swatch accent" style="background: var(--mantine-color-accent, var(--mantine-color-cyan-600))"></div>
            <h3>Accent</h3>
            <p>Highlight color</p>
          </div>
          
          <div class="color-card">
            <div class="color-swatch success" style="background: var(--mantine-color-success)"></div>
            <h3>Success</h3>
            <p>Positive state</p>
          </div>
          
          <div class="color-card">
            <div class="color-swatch warning" style="background: var(--mantine-color-warning)"></div>
            <h3>Warning</h3>
            <p>Caution state</p>
          </div>
          
          <div class="color-card">
            <div class="color-swatch error" style="background: var(--mantine-color-error)"></div>
            <h3>Error</h3>
            <p>Error state</p>
          </div>
        </div>
      </section>
      
      <section class="typography-showcase">
        <h2>Brand Typography</h2>
        
        <div class="type-sample">
          <h3 style="font-family: var(--mantine-typography-fontfamily-heading); font-size: 2.5rem; margin: 0;">
            Brand Heading Font
          </h3>
          <p class="font-name">Font: <span id="heading-font"></span></p>
        </div>
        
        <div class="type-sample">
          <p style="font-family: var(--mantine-typography-fontfamily-body); font-size: 1.125rem; line-height: 1.6; margin: 0;">
            This is the body font used for main content. The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.
          </p>
          <p class="font-name">Font: <span id="body-font"></span></p>
        </div>
        
        <div class="type-sample">
          <pre style="font-family: var(--mantine-typography-fontfamily-mono); font-size: 0.875rem; margin: 0;">
const brandColors = {
  primary: 'var(--mantine-color-primary)',
  secondary: 'var(--mantine-color-secondary)'
};</pre>
          <p class="font-name">Font: <span id="mono-font"></span></p>
        </div>
      </section>
      
      <section class="component-showcase">
        <h2>Brand-Styled Components</h2>
        
        <div class="component-grid">
          <div class="component-example">
            <h3>Buttons</h3>
            <div class="button-group">
              <button class="btn btn--filled btn--md btn--primary">Primary Action</button>
              <button class="btn btn--outline btn--md btn--primary">Secondary</button>
              <button class="btn btn--subtle btn--md btn--primary">Tertiary</button>
            </div>
          </div>
          
          <div class="component-example">
            <h3>Cards</h3>
            <div class="card">
              <h4 class="card-title">Brand Card</h4>
              <p class="card-description">This card adapts to brand colors and typography.</p>
              <div class="card-actions">
                <button class="btn btn--filled btn--sm btn--primary">Learn More</button>
              </div>
            </div>
          </div>
          
          <div class="component-example">
            <h3>Form Elements</h3>
            <div class="input-group">
              <label class="input-label">Brand Input</label>
              <input type="text" class="input" placeholder="Type something..." />
            </div>
          </div>
        </div>
      </section>
    </div>
    
    <style>
      .brand-showcase {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        font-family: var(--mantine-typography-fontfamily-body);
      }
      
      .brand-showcase h1 {
        font-family: var(--mantine-typography-fontfamily-heading);
        font-size: 2.5rem;
        margin: 0 0 0.5rem 0;
        color: var(--mantine-color-text-primary);
      }
      
      .description {
        font-size: 1.125rem;
        color: var(--mantine-color-text-secondary);
        margin-bottom: 3rem;
      }
      
      section {
        margin: 3rem 0;
      }
      
      section h2 {
        font-family: var(--mantine-typography-fontfamily-heading);
        font-size: 1.75rem;
        margin: 0 0 1.5rem 0;
        color: var(--mantine-color-text-primary);
      }
      
      .brand-info {
        background: var(--mantine-color-surface);
        padding: 2rem;
        border-radius: var(--mantine-radius-md);
        border: 1px solid var(--mantine-color-border-subtle);
      }
      
      .color-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1.5rem;
      }
      
      .color-card {
        text-align: center;
      }
      
      .color-swatch {
        width: 100%;
        height: 100px;
        border-radius: var(--mantine-radius-md);
        margin-bottom: 0.75rem;
        box-shadow: var(--mantine-shadow-sm);
        transition: transform 200ms ease;
      }
      
      .color-swatch:hover {
        transform: scale(1.05);
      }
      
      .color-card h3 {
        margin: 0 0 0.25rem 0;
        font-size: 1rem;
        font-weight: 600;
      }
      
      .color-card p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--mantine-color-text-secondary);
      }
      
      .type-sample {
        margin: 2rem 0;
        padding: 1.5rem;
        background: var(--mantine-color-surface);
        border-radius: var(--mantine-radius-md);
        border: 1px solid var(--mantine-color-border-subtle);
      }
      
      .font-name {
        margin: 1rem 0 0 0;
        font-size: 0.75rem;
        color: var(--mantine-color-text-tertiary);
        font-family: var(--mantine-typography-fontfamily-mono);
      }
      
      .component-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }
      
      .component-example h3 {
        margin: 0 0 1rem 0;
        font-size: 1.125rem;
        color: var(--mantine-color-text-secondary);
      }
      
      .button-group {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      
      /* Component styles */
      ${getButtonStyles()}
      ${getCardStyles()}
      ${getInputStyles()}
    </style>
    
    <script>
      // Extract font name from font-family string
      function extractFontName(fontFamily) {
        if (!fontFamily) return '';
        // Extract first font name, removing quotes
        const match = fontFamily.match(/['"]?([^'",-]+)/);
        return match ? match[1].trim() : fontFamily.split(',')[0].trim();
      }
      
      // Get brand color info
      function getBrandColorInfo(brand) {
        const computedStyle = getComputedStyle(document.documentElement);
        
        if (brand === 'mantine') {
          return 'blue';
        } else if (brand === 'clearco') {
          return 'deep blue/orange';
        } else if (brand === 'firstwatch') {
          return 'purple/green';
        }
        return '';
      }
      
      // Update brand descriptions
      function updateBrandDescriptions() {
        const computedStyle = getComputedStyle(document.documentElement);
        
        // Update Clearco description
        const clearcoHeading = extractFontName(computedStyle.getPropertyValue('--clearco-typography-fontfamily-heading'));
        const clearcoBody = extractFontName(computedStyle.getPropertyValue('--clearco-typography-fontfamily-body'));
        const clearcoDesc = document.getElementById('clearco-desc');
        if (clearcoDesc) {
          clearcoDesc.textContent = \`Deep blue/orange with \${clearcoBody} & \${clearcoHeading}\`;
        }
        
        // Update Firstwatch description
        const firstwatchHeading = extractFontName(computedStyle.getPropertyValue('--firstwatch-typography-fontfamily-heading'));
        const firstwatchBody = extractFontName(computedStyle.getPropertyValue('--firstwatch-typography-fontfamily-body'));
        const firstwatchDesc = document.getElementById('firstwatch-desc');
        if (firstwatchDesc) {
          firstwatchDesc.textContent = \`Purple/green with \${firstwatchBody} & \${firstwatchHeading}\`;
        }
      }
      
      // Display current font values
      function updateFontDisplay() {
        const computedStyle = getComputedStyle(document.documentElement);
        const currentBrand = document.body.getAttribute('data-brand') || 'mantine';
        
        // Get font values based on current brand
        let headingFont, bodyFont, monoFont;
        
        if (currentBrand === 'mantine') {
          headingFont = computedStyle.getPropertyValue('--mantine-typography-fontfamily-heading');
          bodyFont = computedStyle.getPropertyValue('--mantine-typography-fontfamily-body');
          monoFont = computedStyle.getPropertyValue('--mantine-typography-fontfamily-mono');
        } else {
          // For brands, use brand-specific variables
          headingFont = computedStyle.getPropertyValue(\`--\${currentBrand}-typography-fontfamily-heading\`);
          bodyFont = computedStyle.getPropertyValue(\`--\${currentBrand}-typography-fontfamily-body\`);
          monoFont = computedStyle.getPropertyValue(\`--\${currentBrand}-typography-fontfamily-mono\`);
        }
        
        // Update display
        document.getElementById('heading-font').textContent = headingFont?.trim() || 'Default system fonts';
        document.getElementById('body-font').textContent = bodyFont?.trim() || 'Default system fonts';
        document.getElementById('mono-font').textContent = monoFont?.trim() || 'Default monospace fonts';
        
        // Update brand descriptions
        updateBrandDescriptions();
      }
      
      // Update on load and when brand changes
      setTimeout(updateFontDisplay, 100);
      
      // Listen for brand changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-brand') {
            setTimeout(updateFontDisplay, 100);
          }
        });
      });
      
      observer.observe(document.body, { attributes: true });
    </script>
  `;
};

// Reuse component styles from other stories
function getButtonStyles() {
  return `
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border: none;
      cursor: pointer;
      font-family: var(--mantine-typography-fontfamily-sans);
      font-weight: var(--mantine-button-fontweight-default);
      transition: all var(--mantine-button-transition-duration) var(--mantine-button-transition-timingfunction);
      outline: none;
      position: relative;
      border-radius: var(--mantine-button-radius-default);
      text-decoration: none;
      box-sizing: border-box;
    }
    
    .btn--md {
      padding: 0 calc(var(--mantine-button-padding-md) * 2);
      font-size: var(--mantine-button-fontsize-md);
      min-height: var(--mantine-button-height-md);
      line-height: calc(var(--mantine-button-height-md) - 2px);
    }
    
    .btn--sm {
      padding: 0 calc(var(--mantine-button-padding-sm) * 2);
      font-size: var(--mantine-button-fontsize-sm);
      min-height: var(--mantine-button-height-sm);
      line-height: calc(var(--mantine-button-height-sm) - 2px);
    }
    
    .btn--primary {
      --btn-color: var(--mantine-color-primary);
      --btn-color-hover: var(--mantine-color-primary-hover);
      --btn-color-rgb: var(--mantine-color-primary-rgb);
    }
    
    .btn--filled {
      background: var(--btn-color);
      color: white;
    }
    
    .btn--filled:hover {
      background: var(--btn-color-hover);
      transform: translateY(-1px);
    }
    
    .btn--outline {
      background: transparent;
      color: var(--btn-color);
      border: 1px solid var(--btn-color);
    }
    
    .btn--outline:hover {
      background: var(--btn-color);
      color: white;
    }
    
    .btn--subtle {
      background: transparent;
      color: var(--btn-color);
    }
    
    .btn--subtle:hover {
      background: rgba(var(--btn-color-rgb), 0.1);
    }
  `;
}

function getCardStyles() {
  return `
    .card {
      background: var(--mantine-color-surface);
      border-radius: var(--mantine-card-radius-default);
      padding: var(--mantine-card-padding-default);
      box-shadow: var(--mantine-card-shadow-default);
      transition: all 200ms ease;
    }
    
    .card-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--mantine-color-text-primary);
      font-family: var(--mantine-typography-fontfamily-heading);
    }
    
    .card-description {
      margin: 0 0 1rem 0;
      font-size: 0.875rem;
      line-height: 1.5;
      color: var(--mantine-color-text-secondary);
    }
    
    .card-actions {
      display: flex;
      gap: 0.75rem;
    }
  `;
}

function getInputStyles() {
  return `
    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    
    .input-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--mantine-color-text-primary);
    }
    
    .input {
      width: 100%;
      padding: 0 var(--mantine-input-padding-horizontal);
      height: var(--mantine-input-height-md);
      background: var(--mantine-color-surface);
      border: var(--mantine-input-border-width) var(--mantine-input-border-style) var(--mantine-color-border);
      border-radius: var(--mantine-input-radius-default);
      font-family: inherit;
      font-size: var(--mantine-input-fontsize-md);
      color: var(--mantine-color-text-primary);
      transition: var(--mantine-input-transition-property) var(--mantine-input-transition-duration);
      outline: none;
    }
    
    .input:hover {
      border-color: var(--mantine-color-border-hover);
    }
    
    .input:focus {
      border-color: var(--mantine-color-primary);
      box-shadow: 0 0 0 2px rgba(var(--mantine-color-primary-rgb), 0.2);
    }
  `;
}
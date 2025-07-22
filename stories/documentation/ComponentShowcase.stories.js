export default {
  title: 'Documentation/Component Showcase',
  parameters: {
    docs: {
      description: {
        component: 'Visual test suite for all components with design tokens'
      }
    }
  }
};

export const AllComponents = () => {
  return `
    <div class="component-test-grid">
      <h1>Component Visual Test Suite</h1>
      <p>This page shows all components in their default state to verify proper rendering with design tokens.</p>
      
      <!-- Buttons Section -->
      <section class="test-section">
        <h2>Buttons</h2>
        <div class="test-group">
          <h3>Filled Variants</h3>
          <div class="component-row">
            <button class="btn btn--filled btn--md btn--primary">Primary</button>
            <button class="btn btn--filled btn--md btn--success">Success</button>
            <button class="btn btn--filled btn--md btn--warning">Warning</button>
            <button class="btn btn--filled btn--md btn--error">Error</button>
            <button class="btn btn--filled btn--md btn--info">Info</button>
          </div>
        </div>
        
        <div class="test-group">
          <h3>Outline Variants</h3>
          <div class="component-row">
            <button class="btn btn--outline btn--md btn--primary">Primary</button>
            <button class="btn btn--outline btn--md btn--success">Success</button>
            <button class="btn btn--outline btn--md btn--warning">Warning</button>
            <button class="btn btn--outline btn--md btn--error">Error</button>
            <button class="btn btn--outline btn--md btn--info">Info</button>
          </div>
        </div>
        
        <div class="test-group">
          <h3>Sizes</h3>
          <div class="component-row align-center">
            <button class="btn btn--filled btn--xs btn--primary">XS</button>
            <button class="btn btn--filled btn--sm btn--primary">SM</button>
            <button class="btn btn--filled btn--md btn--primary">MD</button>
            <button class="btn btn--filled btn--lg btn--primary">LG</button>
            <button class="btn btn--filled btn--xl btn--primary">XL</button>
          </div>
        </div>
      </section>
      
      <!-- Cards Section -->
      <section class="test-section">
        <h2>Cards</h2>
        <div class="test-group">
          <div class="card-row">
            <div class="card">
              <h3 class="card-title">Default Card</h3>
              <p class="card-description">This is a default card with standard padding and shadow.</p>
              <div class="card-actions">
                <button class="btn btn--filled btn--sm btn--primary">Action</button>
              </div>
            </div>
            
            <div class="card card--elevated">
              <h3 class="card-title">Elevated Card</h3>
              <p class="card-description">This card has increased elevation for emphasis.</p>
              <div class="card-actions">
                <button class="btn btn--outline btn--sm btn--primary">Learn More</button>
              </div>
            </div>
            
            <div class="card card--bordered">
              <h3 class="card-title">Bordered Card</h3>
              <p class="card-description">This card uses a border instead of shadow.</p>
              <div class="card-actions">
                <button class="btn btn--subtle btn--sm btn--primary">Details</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Inputs Section -->
      <section class="test-section">
        <h2>Form Inputs</h2>
        <div class="test-group">
          <h3>Input States</h3>
          <div class="input-grid">
            <div class="input-group">
              <label class="input-label">Default Input</label>
              <input type="text" class="input" placeholder="Enter text..." />
            </div>
            
            <div class="input-group">
              <label class="input-label">With Error</label>
              <input type="text" class="input input--error" placeholder="Invalid input" />
              <span class="input-error">This field is required</span>
            </div>
            
            <div class="input-group">
              <label class="input-label">With Success</label>
              <input type="text" class="input input--success" value="Valid input" />
              <span class="input-success">Looks good!</span>
            </div>
            
            <div class="input-group">
              <label class="input-label">Disabled</label>
              <input type="text" class="input" placeholder="Disabled" disabled />
            </div>
          </div>
        </div>
        
        <div class="test-group">
          <h3>Input Sizes</h3>
          <div class="input-grid">
            <div class="input-group">
              <label class="input-label">Extra Small</label>
              <input type="text" class="input input--xs" placeholder="XS input" />
            </div>
            
            <div class="input-group">
              <label class="input-label">Small</label>
              <input type="text" class="input input--sm" placeholder="SM input" />
            </div>
            
            <div class="input-group">
              <label class="input-label">Medium</label>
              <input type="text" class="input input--md" placeholder="MD input" />
            </div>
            
            <div class="input-group">
              <label class="input-label">Large</label>
              <input type="text" class="input input--lg" placeholder="LG input" />
            </div>
          </div>
        </div>
      </section>
      
      <!-- Color Palette Quick Test -->
      <section class="test-section">
        <h2>Color Tokens Test</h2>
        <div class="color-test-grid">
          <div class="color-test-item">
            <div class="color-box" style="background: var(--mantine-color-primary)"></div>
            <span>Primary</span>
          </div>
          <div class="color-test-item">
            <div class="color-box" style="background: var(--mantine-color-success)"></div>
            <span>Success</span>
          </div>
          <div class="color-test-item">
            <div class="color-box" style="background: var(--mantine-color-warning)"></div>
            <span>Warning</span>
          </div>
          <div class="color-test-item">
            <div class="color-box" style="background: var(--mantine-color-error)"></div>
            <span>Error</span>
          </div>
          <div class="color-test-item">
            <div class="color-box" style="background: var(--mantine-color-info)"></div>
            <span>Info</span>
          </div>
        </div>
      </section>
      
      <!-- Typography Test -->
      <section class="test-section">
        <h2>Typography Test</h2>
        <div class="typography-test">
          <h1 style="font-size: var(--mantine-typography-fontsize-h1); font-weight: var(--mantine-typography-fontweight-heading);">Heading 1</h1>
          <h2 style="font-size: var(--mantine-typography-fontsize-h2); font-weight: var(--mantine-typography-fontweight-heading);">Heading 2</h2>
          <h3 style="font-size: var(--mantine-typography-fontsize-h3); font-weight: var(--mantine-typography-fontweight-heading);">Heading 3</h3>
          <p style="font-size: var(--mantine-typography-fontsize-md); line-height: var(--mantine-typography-lineheight-normal);">
            Body text with normal line height. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <p style="font-size: var(--mantine-typography-fontsize-sm); color: var(--mantine-color-text-secondary);">
            Small secondary text for additional information.
          </p>
        </div>
      </section>
    </div>
    
    <style>
      /* Test page styles */
      .component-test-grid {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        font-family: var(--mantine-typography-fontfamily-sans);
      }
      
      .component-test-grid h1 {
        font-size: 2rem;
        margin: 0 0 0.5rem 0;
        color: var(--mantine-color-text-primary);
      }
      
      .component-test-grid > p {
        color: var(--mantine-color-text-secondary);
        margin-bottom: 2rem;
      }
      
      .test-section {
        margin: 3rem 0;
        padding: 2rem;
        background: var(--mantine-color-surface);
        border-radius: var(--mantine-radius-md);
        border: 1px solid var(--mantine-color-border-subtle);
      }
      
      .test-section h2 {
        margin: 0 0 1.5rem 0;
        font-size: 1.5rem;
        color: var(--mantine-color-text-primary);
      }
      
      .test-group {
        margin: 2rem 0;
      }
      
      .test-group h3 {
        margin: 0 0 1rem 0;
        font-size: 1.125rem;
        color: var(--mantine-color-text-secondary);
      }
      
      .component-row {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
      
      .component-row.align-center {
        align-items: center;
      }
      
      .card-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }
      
      .input-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
      }
      
      .color-test-grid {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      
      .color-test-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }
      
      .color-box {
        width: 60px;
        height: 60px;
        border-radius: var(--mantine-radius-md);
        box-shadow: var(--mantine-shadow-sm);
      }
      
      .typography-test > * {
        margin: 1rem 0;
      }
      
      /* Import component styles */
      ${getButtonStyles()}
      ${getCardStyles()}
      ${getInputStyles()}
    </style>
  `;
};

// Button styles
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
    }
    
    /* Sizes */
    .btn--xs {
      padding: 0.375rem 0.75rem;
      font-size: var(--mantine-button-fontsize-xs);
      min-height: var(--mantine-button-height-xs);
    }
    
    .btn--sm {
      padding: 0.5rem 1rem;
      font-size: var(--mantine-button-fontsize-sm);
      min-height: var(--mantine-button-height-sm);
    }
    
    .btn--md {
      padding: 0.625rem 1.25rem;
      font-size: var(--mantine-button-fontsize-md);
      min-height: var(--mantine-button-height-md);
    }
    
    .btn--lg {
      padding: 0.75rem 1.5rem;
      font-size: var(--mantine-button-fontsize-lg);
      min-height: var(--mantine-button-height-lg);
    }
    
    .btn--xl {
      padding: 1rem 2rem;
      font-size: var(--mantine-button-fontsize-xl);
      min-height: var(--mantine-button-height-xl);
    }
    
    /* Colors */
    .btn--primary {
      --btn-color: var(--mantine-color-primary, var(--mantine-color-blue-600));
      --btn-color-hover: var(--mantine-color-primary-hover, var(--mantine-color-blue-700));
      --btn-color-rgb: var(--mantine-color-primary-rgb, 34, 139, 230);
    }
    
    .btn--success {
      --btn-color: var(--mantine-color-success, var(--mantine-color-green-600));
      --btn-color-hover: var(--mantine-color-success-hover, var(--mantine-color-green-700));
      --btn-color-rgb: var(--mantine-color-success-rgb, 64, 192, 87);
    }
    
    .btn--warning {
      --btn-color: var(--mantine-color-warning, var(--mantine-color-yellow-600));
      --btn-color-hover: var(--mantine-color-warning-hover, var(--mantine-color-yellow-700));
      --btn-color-rgb: var(--mantine-color-warning-rgb, 250, 176, 5);
    }
    
    .btn--error {
      --btn-color: var(--mantine-color-error, var(--mantine-color-red-600));
      --btn-color-hover: var(--mantine-color-error-hover, var(--mantine-color-red-700));
      --btn-color-rgb: var(--mantine-color-error-rgb, 250, 82, 82);
    }
    
    .btn--info {
      --btn-color: var(--mantine-color-info, var(--mantine-color-blue-600));
      --btn-color-hover: var(--mantine-color-info-hover, var(--mantine-color-blue-700));
      --btn-color-rgb: var(--mantine-color-info-rgb, 34, 139, 230);
    }
    
    /* Variants */
    .btn--filled {
      background: var(--btn-color);
      color: white;
    }
    
    .btn--filled:hover {
      background: var(--btn-color-hover);
      box-shadow: var(--mantine-button-shadow-hover);
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
    
    .btn:focus-visible {
      outline: 2px solid var(--btn-color);
      outline-offset: 2px;
    }
    
    .btn:active {
      transform: translateY(1px);
    }
  `;
}

// Card styles
function getCardStyles() {
  return `
    .card {
      background: var(--mantine-color-surface);
      border-radius: var(--mantine-card-radius-default);
      padding: var(--mantine-card-padding-default);
      box-shadow: var(--mantine-card-shadow-default);
      transition: all 200ms ease;
    }
    
    .card--elevated {
      box-shadow: var(--mantine-card-shadow-elevated);
    }
    
    .card--bordered {
      box-shadow: none;
      border: var(--mantine-card-border-width) var(--mantine-card-border-style) var(--mantine-color-border);
    }
    
    .card-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--mantine-color-text-primary);
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

// Input styles
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
      background: var(--mantine-color-surface);
      border: var(--mantine-input-border-width) var(--mantine-input-border-style) var(--mantine-color-border);
      border-radius: var(--mantine-input-radius-default);
      font-family: inherit;
      font-size: var(--mantine-input-fontsize-md);
      color: var(--mantine-color-text-primary);
      transition: var(--mantine-input-transition-property) var(--mantine-input-transition-duration);
      outline: none;
    }
    
    /* Sizes */
    .input--xs {
      height: var(--mantine-input-height-xs);
      font-size: var(--mantine-input-fontsize-xs);
    }
    
    .input--sm {
      height: var(--mantine-input-height-sm);
      font-size: var(--mantine-input-fontsize-sm);
    }
    
    .input--md {
      height: var(--mantine-input-height-md);
      font-size: var(--mantine-input-fontsize-md);
    }
    
    .input--lg {
      height: var(--mantine-input-height-lg);
      font-size: var(--mantine-input-fontsize-lg);
    }
    
    /* States */
    .input:hover {
      border-color: var(--mantine-color-border-hover);
    }
    
    .input:focus {
      border-color: var(--mantine-color-primary);
      box-shadow: 0 0 0 2px rgba(var(--mantine-color-primary-rgb), 0.2);
    }
    
    .input:disabled {
      background: var(--mantine-color-background);
      color: var(--mantine-color-text-disabled);
      cursor: not-allowed;
    }
    
    .input--error {
      border-color: var(--mantine-color-error);
    }
    
    .input--error:focus {
      border-color: var(--mantine-color-error);
      box-shadow: 0 0 0 2px rgba(var(--mantine-color-error-rgb), 0.2);
    }
    
    .input--success {
      border-color: var(--mantine-color-success);
    }
    
    .input--success:focus {
      border-color: var(--mantine-color-success);
      box-shadow: 0 0 0 2px rgba(var(--mantine-color-success-rgb), 0.2);
    }
    
    /* Helper text */
    .input-error, .input-success {
      font-size: 0.75rem;
      margin-top: 0.125rem;
    }
    
    .input-error {
      color: var(--mantine-color-error);
    }
    
    .input-success {
      color: var(--mantine-color-success);
    }
  `;
}
export default {
  title: 'Components/Card',
  parameters: {
    docs: {
      description: {
        component: 'Card component examples using design tokens'
      }
    }
  }
};

export const Default = () => {
  return `
    <div class="card-showcase">
      <div class="card">
        <h3 class="card-title">Card Title</h3>
        <p class="card-description">This is a basic card component using design tokens for styling.</p>
        <div class="card-actions">
          <button class="btn btn--filled btn--sm btn--primary">Action</button>
          <button class="btn btn--subtle btn--sm btn--primary">Cancel</button>
        </div>
      </div>
    </div>
    
    <style>
      ${getCardStyles()}
      ${getButtonStyles()}
    </style>
  `;
};

export const CardVariants = () => {
  return `
    <div class="card-showcase">
      <h3>Card Variants</h3>
      
      <div class="card-grid">
        <div class="card">
          <h4 class="card-title">Default Card</h4>
          <p class="card-description">Standard card with default shadow and padding.</p>
        </div>
        
        <div class="card card--elevated">
          <h4 class="card-title">Elevated Card</h4>
          <p class="card-description">Card with increased elevation for emphasis.</p>
        </div>
        
        <div class="card card--bordered">
          <h4 class="card-title">Bordered Card</h4>
          <p class="card-description">Card with border instead of shadow.</p>
        </div>
        
        <div class="card card--compact">
          <h4 class="card-title">Compact Card</h4>
          <p class="card-description">Card with reduced padding.</p>
        </div>
      </div>
    </div>
    
    <style>
      ${getCardStyles()}
    </style>
  `;
};

export const CardWithImage = () => {
  return `
    <div class="card-showcase">
      <h3>Cards with Images</h3>
      
      <div class="card-grid">
        <div class="card card--with-image">
          <div class="card-image">
            <div class="placeholder-image"></div>
          </div>
          <div class="card-content">
            <h4 class="card-title">Card with Header Image</h4>
            <p class="card-description">This card includes an image at the top with content below.</p>
            <div class="card-actions">
              <button class="btn btn--filled btn--sm btn--primary">Learn More</button>
            </div>
          </div>
        </div>
        
        <div class="card card--horizontal">
          <div class="card-image">
            <div class="placeholder-image"></div>
          </div>
          <div class="card-content">
            <h4 class="card-title">Horizontal Card</h4>
            <p class="card-description">Image and content side by side.</p>
            <div class="card-actions">
              <button class="btn btn--outline btn--sm btn--primary">View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <style>
      ${getCardStyles()}
      ${getButtonStyles()}
    </style>
  `;
};

export const InteractiveCards = () => {
  return `
    <div class="card-showcase">
      <h3>Interactive Cards</h3>
      
      <div class="card-grid">
        <div class="card card--clickable">
          <h4 class="card-title">Clickable Card</h4>
          <p class="card-description">Entire card is clickable with hover effects.</p>
          <span class="card-link">Click anywhere →</span>
        </div>
        
        <div class="card card--selectable">
          <div class="card-checkbox">
            <input type="checkbox" id="card-select-1" />
          </div>
          <label for="card-select-1" class="card-content">
            <h4 class="card-title">Selectable Card</h4>
            <p class="card-description">Card with checkbox for selection.</p>
          </label>
        </div>
      </div>
    </div>
    
    <style>
      ${getCardStyles()}
    </style>
  `;
};

function getCardStyles() {
  return `
    .card-showcase {
      padding: 1rem;
      font-family: var(--mantine-font-family-body);
    }
    
    .card-showcase > h3 {
      margin: 0 0 1.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
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
    
    .card--compact {
      padding: var(--mantine-card-padding-compact);
    }
    
    .card--with-image {
      padding: 0;
      overflow: hidden;
    }
    
    .card--with-image .card-content {
      padding: var(--mantine-card-padding-default);
    }
    
    .card--horizontal {
      display: flex;
      padding: 0;
      overflow: hidden;
    }
    
    .card--horizontal .card-image {
      width: 150px;
      flex-shrink: 0;
    }
    
    .card--horizontal .card-content {
      padding: var(--mantine-card-padding-default);
      flex: 1;
    }
    
    .card--clickable {
      cursor: pointer;
      position: relative;
    }
    
    .card--clickable:hover {
      box-shadow: var(--mantine-card-shadow-hover);
      transform: translateY(-2px);
    }
    
    .card--selectable {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      cursor: pointer;
    }
    
    .card--selectable:has(input:checked) {
      border: 2px solid var(--mantine-color-primary);
      padding: calc(var(--mantine-card-padding-default) - 2px);
    }
    
    .card-checkbox {
      flex-shrink: 0;
      margin-top: 0.125rem;
    }
    
    .card-checkbox input {
      width: 1.25rem;
      height: 1.25rem;
      cursor: pointer;
    }
    
    .card-content {
      flex: 1;
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
    
    .card-link {
      display: inline-block;
      color: var(--mantine-color-primary);
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .card-image {
      height: 200px;
      overflow: hidden;
    }
    
    .placeholder-image {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, var(--mantine-color-gray-200) 0%, var(--mantine-color-gray-300) 100%);
      position: relative;
    }
    
    .placeholder-image::after {
      content: "📷";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 2rem;
      opacity: 0.5;
    }
  `;
}

function getButtonStyles() {
  return `
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border: none;
      cursor: pointer;
      font-family: inherit;
      font-weight: var(--mantine-button-fontweight-default);
      transition: all var(--mantine-button-transition-duration) var(--mantine-button-transition-timingfunction);
      outline: none;
      border-radius: var(--mantine-button-radius-default);
    }
    
    .btn--sm {
      padding: var(--mantine-button-padding-sm);
      font-size: var(--mantine-button-fontsize-sm);
      height: var(--mantine-button-height-sm);
    }
    
    .btn--primary {
      --btn-color: var(--mantine-color-primary);
      --btn-color-hover: var(--mantine-color-primary-hover);
    }
    
    .btn--filled {
      background: var(--btn-color);
      color: white;
    }
    
    .btn--filled:hover {
      background: var(--btn-color-hover);
      box-shadow: var(--mantine-button-shadow-hover);
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
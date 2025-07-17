export default {
  title: 'Components/Input',
  parameters: {
    docs: {
      description: {
        component: 'Input field examples using design tokens'
      }
    }
  }
};

export const Default = () => {
  return `
    <div class="input-showcase">
      <h3>Basic Input</h3>
      
      <div class="input-group">
        <label for="basic-input" class="input-label">Label</label>
        <input type="text" id="basic-input" class="input" placeholder="Enter text..." />
        <span class="input-helper">Helper text with additional information</span>
      </div>
    </div>
    
    <style>
      ${getInputStyles()}
    </style>
  `;
};

export const InputSizes = () => {
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
  
  return `
    <div class="input-showcase">
      <h3>Input Sizes</h3>
      
      <div class="input-list">
        ${sizes.map(size => `
          <div class="input-group">
            <label class="input-label">Size ${size.toUpperCase()}</label>
            <input type="text" class="input input--${size}" placeholder="${size} size input" />
          </div>
        `).join('')}
      </div>
    </div>
    
    <style>
      ${getInputStyles()}
    </style>
  `;
};

export const InputStates = () => {
  return `
    <div class="input-showcase">
      <h3>Input States</h3>
      
      <div class="input-grid">
        <div class="input-group">
          <label class="input-label">Default</label>
          <input type="text" class="input" placeholder="Default input" />
        </div>
        
        <div class="input-group">
          <label class="input-label">Focused</label>
          <input type="text" class="input input--focused" placeholder="Focused input" />
        </div>
        
        <div class="input-group">
          <label class="input-label">Disabled</label>
          <input type="text" class="input" placeholder="Disabled input" disabled />
        </div>
        
        <div class="input-group">
          <label class="input-label">Error</label>
          <input type="text" class="input input--error" placeholder="Error input" />
          <span class="input-error">This field is required</span>
        </div>
        
        <div class="input-group">
          <label class="input-label">Success</label>
          <input type="text" class="input input--success" placeholder="Success input" value="Valid input" />
          <span class="input-success">Looks good!</span>
        </div>
      </div>
    </div>
    
    <style>
      ${getInputStyles()}
    </style>
  `;
};

export const InputVariants = () => {
  return `
    <div class="input-showcase">
      <h3>Input Variants</h3>
      
      <div class="input-grid">
        <div class="input-group">
          <label class="input-label">With Icon Left</label>
          <div class="input-wrapper">
            <span class="input-icon input-icon--left">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="6" cy="6" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M10 10l4 4" stroke="currentColor" stroke-width="2"/>
              </svg>
            </span>
            <input type="text" class="input input--with-icon-left" placeholder="Search..." />
          </div>
        </div>
        
        <div class="input-group">
          <label class="input-label">With Icon Right</label>
          <div class="input-wrapper">
            <input type="email" class="input input--with-icon-right" placeholder="Email address" />
            <span class="input-icon input-icon--right">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M14 4v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h8a2 2 0 012 2zm-1.5 0L8 7 3.5 4H12.5zm0 1.5V12h-9V5.5L8 8.5l4.5-3z"/>
              </svg>
            </span>
          </div>
        </div>
        
        <div class="input-group">
          <label class="input-label">Password</label>
          <div class="input-wrapper">
            <input type="password" class="input input--with-icon-right" placeholder="Enter password" />
            <button class="input-icon input-icon--right input-icon--button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 3C4.5 3 1.5 5.5 0 8c1.5 2.5 4.5 5 8 5s6.5-2.5 8-5c-1.5-2.5-4.5-5-8-5zm0 8a3 3 0 110-6 3 3 0 010 6zm0-2a1 1 0 100-2 1 1 0 000 2z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="input-group">
          <label class="input-label">With Clear Button</label>
          <div class="input-wrapper">
            <input type="text" class="input input--with-icon-right" value="Clear me" />
            <button class="input-icon input-icon--right input-icon--button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 8l3.5 3.5-1 1L7 9l-3.5 3.5-1-1L6 8 2.5 4.5l1-1L7 7l3.5-3.5 1 1L8 8z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <style>
      ${getInputStyles()}
    </style>
  `;
};

export const TextArea = () => {
  return `
    <div class="input-showcase">
      <h3>Text Area</h3>
      
      <div class="input-grid">
        <div class="input-group">
          <label class="input-label">Basic Textarea</label>
          <textarea class="input textarea" placeholder="Enter your message..." rows="4"></textarea>
          <span class="input-helper">Markdown supported</span>
        </div>
        
        <div class="input-group">
          <label class="input-label">Auto-resize Textarea</label>
          <textarea class="input textarea textarea--auto" placeholder="This textarea grows as you type..." rows="2"></textarea>
        </div>
      </div>
    </div>
    
    <style>
      ${getInputStyles()}
    </style>
  `;
};

export const InputGroups = () => {
  return `
    <div class="input-showcase">
      <h3>Input Groups</h3>
      
      <div class="input-list">
        <div class="input-group">
          <label class="input-label">URL Input</label>
          <div class="input-addon-group">
            <span class="input-addon">https://</span>
            <input type="text" class="input" placeholder="example.com" />
          </div>
        </div>
        
        <div class="input-group">
          <label class="input-label">Price Input</label>
          <div class="input-addon-group">
            <span class="input-addon">$</span>
            <input type="number" class="input" placeholder="0.00" />
            <span class="input-addon">USD</span>
          </div>
        </div>
        
        <div class="input-group">
          <label class="input-label">Search with Button</label>
          <div class="input-addon-group">
            <input type="search" class="input" placeholder="Search..." />
            <button class="input-addon-button">Search</button>
          </div>
        </div>
      </div>
    </div>
    
    <style>
      ${getInputStyles()}
    </style>
  `;
};

function getInputStyles() {
  return `
    .input-showcase {
      padding: 1rem;
      font-family: var(--mantine-font-family-body);
    }
    
    .input-showcase h3 {
      margin: 0 0 1.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .input-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 400px;
    }
    
    .input-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    
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
    
    .input--xl {
      height: var(--mantine-input-height-xl);
      font-size: var(--mantine-input-fontsize-xl);
    }
    
    /* States */
    .input:hover {
      border-color: var(--mantine-color-border-hover);
    }
    
    .input:focus, .input--focused {
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
    .input-helper, .input-error, .input-success {
      font-size: 0.75rem;
      margin-top: 0.125rem;
    }
    
    .input-helper {
      color: var(--mantine-color-text-secondary);
    }
    
    .input-error {
      color: var(--mantine-color-error);
    }
    
    .input-success {
      color: var(--mantine-color-success);
    }
    
    /* Input wrapper */
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .input-icon {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--mantine-input-height-md);
      height: var(--mantine-input-height-md);
      color: var(--mantine-color-text-secondary);
      pointer-events: none;
    }
    
    .input-icon--left {
      left: 0;
    }
    
    .input-icon--right {
      right: 0;
    }
    
    .input-icon--button {
      pointer-events: all;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      transition: color 150ms ease;
    }
    
    .input-icon--button:hover {
      color: var(--mantine-color-text-primary);
    }
    
    .input--with-icon-left {
      padding-left: var(--mantine-input-height-md);
    }
    
    .input--with-icon-right {
      padding-right: var(--mantine-input-height-md);
    }
    
    /* Textarea */
    .textarea {
      min-height: auto;
      resize: vertical;
      padding: var(--mantine-spacing-sm) var(--mantine-input-padding-horizontal);
    }
    
    .textarea--auto {
      resize: none;
      overflow: hidden;
    }
    
    /* Input groups */
    .input-addon-group {
      display: flex;
      align-items: stretch;
    }
    
    .input-addon-group .input {
      border-radius: 0;
      flex: 1;
    }
    
    .input-addon-group .input:first-child {
      border-top-left-radius: var(--mantine-input-radius-default);
      border-bottom-left-radius: var(--mantine-input-radius-default);
    }
    
    .input-addon-group .input:last-child {
      border-top-right-radius: var(--mantine-input-radius-default);
      border-bottom-right-radius: var(--mantine-input-radius-default);
    }
    
    .input-addon {
      display: flex;
      align-items: center;
      padding: 0 var(--mantine-spacing-md);
      background: var(--mantine-color-background);
      border: var(--mantine-input-border-width) var(--mantine-input-border-style) var(--mantine-color-border);
      border-right: none;
      font-size: var(--mantine-input-fontsize-md);
      color: var(--mantine-color-text-secondary);
    }
    
    .input-addon:first-child {
      border-top-left-radius: var(--mantine-input-radius-default);
      border-bottom-left-radius: var(--mantine-input-radius-default);
    }
    
    .input-addon:last-child {
      border-right: var(--mantine-input-border-width) var(--mantine-input-border-style) var(--mantine-color-border);
      border-left: none;
      border-top-right-radius: var(--mantine-input-radius-default);
      border-bottom-right-radius: var(--mantine-input-radius-default);
    }
    
    .input-addon-button {
      padding: 0 var(--mantine-spacing-lg);
      background: var(--mantine-color-primary);
      color: white;
      border: none;
      border-top-right-radius: var(--mantine-input-radius-default);
      border-bottom-right-radius: var(--mantine-input-radius-default);
      font-size: var(--mantine-input-fontsize-md);
      font-weight: 500;
      cursor: pointer;
      transition: background 150ms ease;
    }
    
    .input-addon-button:hover {
      background: var(--mantine-color-primary-hover);
    }
  `;
}
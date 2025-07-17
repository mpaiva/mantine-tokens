export default {
  title: 'Components/Button',
  parameters: {
    docs: {
      description: {
        component: 'Button component examples using design tokens',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outline', 'subtle', 'transparent'],
      defaultValue: 'filled',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'md',
    },
    radius: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
      defaultValue: 'sm',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'success', 'warning', 'error', 'info'],
      defaultValue: 'primary',
    },
  },
};

const createButton = ({
  label = 'Button',
  variant = 'filled',
  size = 'md',
  radius = 'sm',
  color = 'primary',
  ...props
}) => {
  return `
    <button class="btn btn--${variant} btn--${size} btn--${color}" style="border-radius: var(--mantine-radius-${radius})">
      ${label}
    </button>
  `;
};

export const Default = {
  args: {
    label: 'Button',
    variant: 'filled',
    size: 'lg',
    radius: 'sm',
    color: 'primary',
  },
  render: (args) => `
    ${createButton(args)}
    
    <style>
      ${getButtonStyles()}
    </style>
  `,
};

export const AllVariants = () => {
  const variants = ['filled', 'outline', 'subtle', 'transparent'];

  return `
    <div class="button-showcase">
      <h3>Button Variants</h3>
      <div class="button-grid">
        ${variants
          .map(
            (variant) => `
          <div class="button-group">
            <h4>${variant.charAt(0).toUpperCase() + variant.slice(1)}</h4>
            <button class="btn btn--${variant} btn--md btn--primary">
              Primary
            </button>
            <button class="btn btn--${variant} btn--md btn--success">
              Success
            </button>
            <button class="btn btn--${variant} btn--md btn--warning">
              Warning
            </button>
            <button class="btn btn--${variant} btn--md btn--error">
              Error
            </button>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
    
    <style>
      ${getButtonStyles()}
    </style>
  `;
};

export const AllSizes = () => {
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

  return `
    <div class="button-showcase">
      <h3>Button Sizes</h3>
      <div class="button-row">
        ${sizes
          .map(
            (size) => `
          <button class="btn btn--filled btn--${size} btn--primary">
            Size ${size.toUpperCase()}
          </button>
        `,
          )
          .join('')}
      </div>
    </div>
    
    <style>
      ${getButtonStyles()}
    </style>
  `;
};

export const WithIcons = () => {
  return `
    <div class="button-showcase">
      <h3>Buttons with Icons</h3>
      <div class="button-row">
        <button class="btn btn--filled btn--md btn--primary">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2a6 6 0 100 12A6 6 0 008 2zM7 9V5h2v4H7zm0 2v2h2v-2H7z"/>
          </svg>
          <span>Left Icon</span>
        </button>
        
        <button class="btn btn--outline btn--md btn--primary">
          <span>Right Icon</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 12l4-4-4-4v8z"/>
          </svg>
        </button>
        
        <button class="btn btn--filled btn--md btn--primary btn--icon-only">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2a6 6 0 100 12A6 6 0 008 2zM7 9V5h2v4H7zm0 2v2h2v-2H7z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <style>
      ${getButtonStyles()}
      
      .btn svg {
        width: 1em;
        height: 1em;
      }
      
      .btn--icon-only {
        padding: var(--mantine-button-padding-md);
        width: var(--mantine-button-height-md);
        height: var(--mantine-button-height-md);
      }
    </style>
  `;
};

function getButtonStyles() {
  return `
    .button-showcase {
      padding: 1rem;
      font-family: var(--mantine-font-family-body);
    }
    
    .button-showcase h3 {
      margin: 0 0 1.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .button-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }
    
    .button-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .button-group h4 {
      margin: 0 0 0.5rem 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--mantine-color-text-secondary);
    }
    
    .button-row {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }
    
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
      position: relative;
      border-radius: var(--mantine-button-radius-default);
      text-decoration: none;
      box-sizing: border-box;
    }
    
    /* Sizes */
    .btn--xs {
      padding: 0 calc(var(--mantine-button-padding-xs) * 1.5);
      font-size: var(--mantine-button-fontsize-xs);
      min-height: var(--mantine-button-height-xs);
      line-height: calc(var(--mantine-button-height-xs) - 2px);
    }
    
    .btn--sm {
      padding: 0 calc(var(--mantine-button-padding-sm) * 2);
      font-size: var(--mantine-button-fontsize-sm);
      min-height: var(--mantine-button-height-sm);
      line-height: calc(var(--mantine-button-height-sm) - 2px);
    }
    
    .btn--md {
      padding: 0 calc(var(--mantine-button-padding-md) * 2);
      font-size: var(--mantine-button-fontsize-md);
      min-height: var(--mantine-button-height-md);
      line-height: calc(var(--mantine-button-height-md) - 2px);
    }
    
    .btn--lg {
      padding: 0 calc(var(--mantine-button-padding-lg) * 1.5);
      font-size: var(--mantine-button-fontsize-lg);
      min-height: var(--mantine-button-height-lg);
      line-height: calc(var(--mantine-button-height-lg) - 2px);
    }
    
    .btn--xl {
      padding: 0 calc(var(--mantine-button-padding-xl) * 1.5);
      font-size: var(--mantine-button-fontsize-xl);
      min-height: var(--mantine-button-height-xl);
      line-height: calc(var(--mantine-button-height-xl) - 2px);
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
    
    .btn--transparent {
      background: transparent;
      color: var(--btn-color);
    }
    
    .btn--transparent:hover {
      background: transparent;
      text-decoration: underline;
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

export default {
  title: 'Global/Primitives/Colors',
  parameters: {
    docs: {
      description: {
        component: 'Comprehensive color palette with all color scales from 50-900. These are the foundational colors used across all themes and brands.'
      }
    }
  }
};

const colorGroups = [
  { name: 'gray', label: 'Gray' },
  { name: 'dark', label: 'Dark' },
  { name: 'blue', label: 'Blue' },
  { name: 'cyan', label: 'Cyan' },
  { name: 'teal', label: 'Teal' },
  { name: 'green', label: 'Green' },
  { name: 'lime', label: 'Lime' },
  { name: 'yellow', label: 'Yellow' },
  { name: 'orange', label: 'Orange' },
  { name: 'red', label: 'Red' },
  { name: 'pink', label: 'Pink' },
  { name: 'grape', label: 'Grape' },
  { name: 'violet', label: 'Violet' },
  { name: 'indigo', label: 'Indigo' }
];

const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

function createColorSwatch(colorName, shade) {
  const cssVar = `--mantine-color-${colorName}-${shade}`;
  
  return `
    <div class="color-swatch" data-color="${colorName}-${shade}">
      <div class="color-preview" style="background-color: var(${cssVar})"></div>
      <div class="color-info">
        <div class="color-name">${colorName}-${shade}</div>
        <div class="color-var">var(${cssVar})</div>
        <div class="color-value" data-var="${cssVar}"></div>
      </div>
    </div>
  `;
}

function createColorGroup(colorGroup) {
  return `
    <div class="color-group">
      <h3 class="color-group-title">${colorGroup.label}</h3>
      <div class="color-grid">
        ${shades.map(shade => createColorSwatch(colorGroup.name, shade)).join('')}
      </div>
    </div>
  `;
}

export const AllColors = () => {
  const html = `
    <div class="color-palette">
      <div class="palette-header">
        <h2>Color Palette</h2>
        <p>Click any color to copy the CSS variable to clipboard</p>
      </div>
      ${colorGroups.map(group => createColorGroup(group)).join('')}
    </div>
    
    <style>
      .color-palette {
        padding: 1rem;
        font-family: var(--mantine-font-family-body);
      }
      
      .palette-header {
        margin-bottom: 2rem;
      }
      
      .palette-header h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1.5rem;
        font-weight: 600;
      }
      
      .palette-header p {
        margin: 0;
        color: var(--mantine-color-text-secondary);
        font-size: 0.875rem;
      }
      
      .color-group {
        margin-bottom: 2.5rem;
      }
      
      .color-group-title {
        margin: 0 0 1rem 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--mantine-color-text-primary);
      }
      
      .color-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 0.75rem;
      }
      
      .color-swatch {
        cursor: pointer;
        border-radius: var(--mantine-radius-md);
        overflow: hidden;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        transition: all 150ms ease;
      }
      
      .color-swatch:hover {
        transform: translateY(-2px);
        box-shadow: var(--mantine-shadow-sm);
        border-color: var(--mantine-color-border);
      }
      
      .color-preview {
        height: 60px;
        width: 100%;
      }
      
      .color-info {
        padding: 0.5rem;
      }
      
      .color-name {
        font-size: 0.75rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      
      .color-var {
        font-size: 0.625rem;
        font-family: var(--mantine-font-family-mono);
        color: var(--mantine-color-text-secondary);
        margin-bottom: 0.125rem;
      }
      
      .color-value {
        font-size: 0.625rem;
        font-family: var(--mantine-font-family-mono);
        color: var(--mantine-color-text-tertiary);
      }
      
      body[data-theme="dark"] .color-swatch {
        background: var(--mantine-color-surface);
        border-color: var(--mantine-color-border-subtle);
      }
    </style>
  `;
  
  // Add click handler and populate color values after rendering
  setTimeout(() => {
    // Populate color values
    document.querySelectorAll('.color-value[data-var]').forEach(elem => {
      const cssVar = elem.dataset.var;
      const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar);
      elem.textContent = value.trim() || 'Loading...';
    });
    
    // Add click handlers
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const colorVar = swatch.querySelector('.color-var').textContent;
        navigator.clipboard.writeText(colorVar);
        
        // Visual feedback
        const originalText = swatch.querySelector('.color-name').textContent;
        swatch.querySelector('.color-name').textContent = 'Copied!';
        setTimeout(() => {
          swatch.querySelector('.color-name').textContent = originalText;
        }, 1000);
      });
    });
  }, 100);
  
  return html;
};

export const SemanticColors = () => {
  const semanticGroups = [
    {
      name: 'Background',
      colors: [
        { var: '--mantine-color-background', label: 'Background' },
        { var: '--mantine-color-surface', label: 'Surface' },
        { var: '--mantine-color-surface-hover', label: 'Surface Hover' }
      ]
    },
    {
      name: 'Border',
      colors: [
        { var: '--mantine-color-border', label: 'Border' },
        { var: '--mantine-color-border-subtle', label: 'Border Subtle' }
      ]
    },
    {
      name: 'Text',
      colors: [
        { var: '--mantine-color-text-primary', label: 'Text Primary' },
        { var: '--mantine-color-text-secondary', label: 'Text Secondary' },
        { var: '--mantine-color-text-tertiary', label: 'Text Tertiary' },
        { var: '--mantine-color-text-disabled', label: 'Text Disabled' }
      ]
    },
    {
      name: 'State Colors',
      colors: [
        { var: '--mantine-color-primary', label: 'Primary' },
        { var: '--mantine-color-success', label: 'Success' },
        { var: '--mantine-color-warning', label: 'Warning' },
        { var: '--mantine-color-error', label: 'Error' },
        { var: '--mantine-color-info', label: 'Info' }
      ]
    }
  ];
  
  const createSemanticSwatch = (color) => {
    return `
      <div class="semantic-swatch" data-var="${color.var}">
        <div class="semantic-preview" style="background-color: var(${color.var})"></div>
        <div class="semantic-info">
          <div class="semantic-label">${color.label}</div>
          <div class="semantic-var">${color.var}</div>
        </div>
      </div>
    `;
  };
  
  const html = `
    <div class="semantic-colors">
      <div class="palette-header">
        <h2>Semantic Colors</h2>
        <p>Theme-aware color tokens that adapt to light/dark mode</p>
      </div>
      
      ${semanticGroups.map(group => `
        <div class="semantic-group">
          <h3>${group.name}</h3>
          <div class="semantic-grid">
            ${group.colors.map(color => createSemanticSwatch(color)).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    
    <style>
      .semantic-colors {
        padding: 1rem;
        font-family: var(--mantine-font-family-body);
      }
      
      .semantic-group {
        margin-bottom: 2rem;
      }
      
      .semantic-group h3 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--mantine-color-text-secondary);
      }
      
      .semantic-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }
      
      .semantic-swatch {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
        cursor: pointer;
        transition: all 150ms ease;
      }
      
      .semantic-swatch:hover {
        box-shadow: var(--mantine-shadow-sm);
        border-color: var(--mantine-color-border);
      }
      
      .semantic-preview {
        width: 48px;
        height: 48px;
        border-radius: var(--mantine-radius-sm);
        flex-shrink: 0;
      }
      
      .semantic-info {
        flex: 1;
        min-width: 0;
      }
      
      .semantic-label {
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      
      .semantic-var {
        font-size: 0.75rem;
        font-family: var(--mantine-font-family-mono);
        color: var(--mantine-color-text-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    </style>
  `;
  
  // Add click handlers after rendering
  setTimeout(() => {
    document.querySelectorAll('.semantic-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const cssVar = swatch.dataset.var;
        navigator.clipboard.writeText(cssVar);
        
        const label = swatch.querySelector('.semantic-label');
        const originalText = label.textContent;
        label.textContent = 'Copied!';
        setTimeout(() => {
          label.textContent = originalText;
        }, 1000);
      });
    });
  }, 100);
  
  return html;
};
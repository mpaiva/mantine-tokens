export default {
  title: 'Brands/Clearco/Overview',
  parameters: {
    docs: {
      description: {
        component: 'Clearco brand features a professional blue and orange palette with Public Sans and Atkinson Hyperlegible typography.'
      }
    }
  }
};

export const BrandOverview = () => {
  return `
    <div class="brand-overview" data-brand="clearco">
      <h1>Clearco Design System</h1>
      <p class="description">A professional brand identity with strong blues and vibrant accent colors.</p>
      
      <section class="brand-identity">
        <h2>Brand Identity</h2>
        <div class="identity-grid">
          <div class="color-palette">
            <h3>Brand Colors</h3>
            <div class="color-swatches">
              <div class="color-swatch" style="background: var(--clearco-brand-primary)">
                <span>Primary</span>
                <code>#0066cc</code>
              </div>
              <div class="color-swatch" style="background: var(--clearco-brand-secondary)">
                <span>Secondary</span>
                <code>#ff6b35</code>
              </div>
              <div class="color-swatch" style="background: var(--clearco-brand-accent)">
                <span>Accent</span>
                <code>#4ecdc4</code>
              </div>
              <div class="color-swatch" style="background: var(--clearco-brand-neutral-700); color: white">
                <span>Neutral</span>
                <code>#495057</code>
              </div>
            </div>
          </div>
          
          <div class="typography-showcase">
            <h3>Typography</h3>
            <div class="font-examples">
              <div class="font-stack">
                <p class="font-heading" style="font-family: var(--clearco-typography-fontfamily-heading)">Atkinson Hyperlegible</p>
                <code>Headings & Display</code>
              </div>
              <div class="font-stack">
                <p class="font-body" style="font-family: var(--clearco-typography-fontfamily-sans)">Public Sans</p>
                <code>Body Text</code>
              </div>
              <div class="font-stack">
                <p class="font-mono" style="font-family: var(--clearco-typography-fontfamily-mono)">JetBrains Mono</p>
                <code>Code & Data</code>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section class="theme-comparison">
        <h2>Theme Variants</h2>
        <div class="theme-grid">
          <div class="theme-preview light">
            <h3>Light Theme</h3>
            <div class="surface-samples">
              <div class="surface" style="background: #ffffff; color: #1a1a1a">
                Background
              </div>
              <div class="surface" style="background: #f5f5f5; color: #525252">
                Surface
              </div>
              <div class="surface" style="background: #0066cc; color: white">
                Primary Action
              </div>
              <div class="surface" style="background: #ff6b35; color: white">
                Secondary Action
              </div>
            </div>
          </div>
          
          <div class="theme-preview dark">
            <h3>Dark Theme</h3>
            <div class="surface-samples">
              <div class="surface" style="background: #0a0a0a; color: #f5f5f5">
                Background
              </div>
              <div class="surface" style="background: #1a1a1a; color: #d4d4d4">
                Surface
              </div>
              <div class="surface" style="background: #4d94ff; color: white">
                Primary Action
              </div>
              <div class="surface" style="background: #ff8c5c; color: white">
                Secondary Action
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section class="brand-applications">
        <h2>Component Examples</h2>
        <div class="component-examples">
          <button class="btn-primary">Primary Button</button>
          <button class="btn-secondary">Secondary Button</button>
          <button class="btn-accent">Accent Button</button>
          <div class="card-example">
            <h4>Card Component</h4>
            <p>Example content with brand typography and spacing.</p>
          </div>
        </div>
      </section>
      
      <section class="usage-notes">
        <h2>Usage Notes</h2>
        <ul>
          <li>Activate by setting <code>data-brand="clearco"</code> on the root element</li>
          <li>Features enhanced readability with Atkinson Hyperlegible for headings</li>
          <li>Strong brand colors suitable for fintech applications</li>
          <li>Includes custom spacing and card components</li>
        </ul>
      </section>
    </div>
    
    <style>
      .brand-overview[data-brand="clearco"] {
        padding: 2rem;
        font-family: var(--clearco-typography-fontfamily-sans);
      }
      
      .brand-overview[data-brand="clearco"] h1, 
      .brand-overview[data-brand="clearco"] h2, 
      .brand-overview[data-brand="clearco"] h3, 
      .brand-overview[data-brand="clearco"] h4 {
        font-family: var(--clearco-typography-fontfamily-heading);
      }
      
      .identity-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-top: 1rem;
      }
      
      .color-swatches {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-top: 1rem;
      }
      
      .color-swatch {
        padding: 2rem 1rem;
        border-radius: var(--mantine-radius-md);
        text-align: center;
        color: white;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        transition: transform 0.2s;
      }
      
      .color-swatch:hover {
        transform: scale(1.05);
      }
      
      .color-swatch span {
        font-weight: 600;
      }
      
      .color-swatch code {
        font-size: 0.75rem;
        opacity: 0.9;
        font-family: var(--clearco-typography-fontfamily-mono);
      }
      
      .font-examples {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
      }
      
      .font-stack {
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 0.5rem;
      }
      
      .font-stack p {
        font-size: 1.25rem;
        margin-bottom: 0.25rem;
      }
      
      .font-stack code {
        font-size: 0.875rem;
        color: #666;
      }
      
      .theme-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-top: 1rem;
      }
      
      .theme-preview {
        padding: 1.5rem;
        border-radius: 0.5rem;
        border: 1px solid #e5e5e5;
      }
      
      .theme-preview.dark {
        background: #0a0a0a;
        color: #f5f5f5;
        border-color: #333;
      }
      
      .surface-samples {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1rem;
      }
      
      .surface {
        padding: 1rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        text-align: center;
      }
      
      .component-examples {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 1rem;
      }
      
      .btn-primary, .btn-secondary, .btn-accent {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.375rem;
        font-family: var(--clearco-typography-fontfamily-sans);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .btn-primary {
        background: var(--clearco-brand-primary);
        color: white;
      }
      
      .btn-primary:hover {
        background: #0052a3;
      }
      
      .btn-secondary {
        background: var(--clearco-brand-secondary);
        color: white;
      }
      
      .btn-secondary:hover {
        background: #ff5722;
      }
      
      .btn-accent {
        background: var(--clearco-brand-accent);
        color: white;
      }
      
      .btn-accent:hover {
        background: #3db8af;
      }
      
      .card-example {
        flex: 1;
        min-width: 250px;
        padding: 1.5rem;
        background: #f5f5f5;
        border-radius: 0.5rem;
        border: 1px solid #e5e5e5;
      }
      
      .card-example h4 {
        margin: 0 0 0.5rem 0;
      }
      
      .card-example p {
        margin: 0;
        color: #666;
      }
      
      .usage-notes {
        margin-top: 3rem;
      }
      
      .usage-notes ul {
        list-style-type: disc;
        padding-left: 2rem;
        margin-top: 1rem;
      }
      
      .usage-notes li {
        margin-bottom: 0.5rem;
      }
      
      .usage-notes code {
        background: #f5f5f5;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        font-family: var(--clearco-typography-fontfamily-mono);
      }
    </style>
  `;
};
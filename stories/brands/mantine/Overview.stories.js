export default {
  title: 'Brands/Mantine/Overview',
  parameters: {
    docs: {
      description: {
        component: 'Mantine is the default design system with a clean, modern blue theme and system fonts.'
      }
    }
  }
};

export const BrandOverview = () => {
  return `
    <div class="brand-overview">
      <h1>Mantine Design System</h1>
      <p class="description">The default design system with a focus on accessibility and developer experience.</p>
      
      <section class="brand-identity">
        <h2>Brand Identity</h2>
        <div class="identity-grid">
          <div class="color-palette">
            <h3>Primary Colors</h3>
            <div class="color-swatches">
              <div class="color-swatch" style="background: var(--mantine-color-blue-600)">
                <span>Primary</span>
                <code>--mantine-color-blue-600</code>
              </div>
              <div class="color-swatch" style="background: var(--mantine-color-gray-700)">
                <span>Secondary</span>
                <code>--mantine-color-gray-700</code>
              </div>
              <div class="color-swatch" style="background: var(--mantine-color-green-600)">
                <span>Success</span>
                <code>--mantine-color-green-600</code>
              </div>
              <div class="color-swatch" style="background: var(--mantine-color-red-600)">
                <span>Error</span>
                <code>--mantine-color-red-600</code>
              </div>
            </div>
          </div>
          
          <div class="typography-showcase">
            <h3>Typography</h3>
            <div class="font-stack">
              <p class="font-heading">System UI Font Stack</p>
              <code>-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif</code>
            </div>
          </div>
        </div>
      </section>
      
      <section class="theme-comparison">
        <h2>Theme Support</h2>
        <div class="theme-grid">
          <div class="theme-preview light">
            <h3>Light Theme</h3>
            <div class="surface-samples">
              <div class="surface" style="background: var(--mantine-color-white); color: var(--mantine-color-black)">
                Background
              </div>
              <div class="surface" style="background: var(--mantine-color-gray-50); color: var(--mantine-color-gray-900)">
                Surface
              </div>
              <div class="surface" style="background: var(--mantine-color-blue-600); color: white">
                Primary
              </div>
            </div>
          </div>
          
          <div class="theme-preview dark" data-theme="dark">
            <h3>Dark Theme</h3>
            <div class="surface-samples">
              <div class="surface" style="background: var(--mantine-color-dark-900); color: var(--mantine-color-dark-50)">
                Background
              </div>
              <div class="surface" style="background: var(--mantine-color-dark-800); color: var(--mantine-color-dark-100)">
                Surface
              </div>
              <div class="surface" style="background: var(--mantine-color-blue-500); color: white">
                Primary
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section class="usage-notes">
        <h2>Usage Notes</h2>
        <ul>
          <li>Default brand - no additional configuration needed</li>
          <li>Optimized for accessibility with WCAG AA compliance</li>
          <li>System fonts for optimal performance</li>
          <li>Comprehensive color palette with 10 shades per color</li>
        </ul>
      </section>
    </div>
    
    <style>
      .brand-overview {
        padding: 2rem;
        font-family: var(--mantine-typography-fontfamily-sans);
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
      }
      
      .color-swatch span {
        font-weight: var(--mantine-typography-fontweight-semibold);
      }
      
      .color-swatch code {
        font-size: 0.75rem;
        opacity: 0.9;
        font-family: var(--mantine-typography-fontfamily-mono);
      }
      
      .theme-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-top: 1rem;
      }
      
      .theme-preview {
        padding: 1.5rem;
        border-radius: var(--mantine-radius-md);
        border: 1px solid var(--mantine-color-gray-300);
      }
      
      .theme-preview.dark {
        background: var(--mantine-color-dark-900);
        color: var(--mantine-color-dark-50);
        border-color: var(--mantine-color-dark-700);
      }
      
      .surface-samples {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1rem;
      }
      
      .surface {
        padding: 1rem;
        border-radius: var(--mantine-radius-sm);
        font-size: 0.875rem;
        text-align: center;
      }
      
      .font-stack {
        margin-top: 1rem;
        padding: 1rem;
        background: var(--mantine-color-gray-50);
        border-radius: var(--mantine-radius-sm);
      }
      
      .font-heading {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
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
    </style>
  `;
};
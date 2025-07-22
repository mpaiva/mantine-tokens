export default {
  title: 'Brands/Firstwatch/Overview',
  parameters: {
    docs: {
      description: {
        component: 'Firstwatch brand features a vibrant purple and green palette with Roboto Condensed and Roboto Slab typography.'
      }
    }
  }
};

export const BrandOverview = () => {
  return `
    <div class="brand-overview" data-brand="firstwatch">
      <h1>Firstwatch Design System</h1>
      <p class="description">A modern, energetic brand identity with purple and green accents.</p>
      
      <section class="brand-identity">
        <h2>Brand Identity</h2>
        <div class="identity-grid">
          <div class="color-palette">
            <h3>Brand Colors</h3>
            <div class="color-swatches">
              <div class="color-swatch" style="background: var(--firstwatch-brand-primary-500)">
                <span>Primary</span>
                <code>#7c3aed</code>
              </div>
              <div class="color-swatch" style="background: var(--firstwatch-brand-secondary-500)">
                <span>Secondary</span>
                <code>#10b981</code>
              </div>
              <div class="color-swatch" style="background: var(--firstwatch-brand-accent-500)">
                <span>Accent</span>
                <code>#f59e0b</code>
              </div>
              <div class="color-swatch" style="background: var(--firstwatch-brand-neutral-700); color: white">
                <span>Neutral</span>
                <code>#374151</code>
              </div>
            </div>
          </div>
          
          <div class="typography-showcase">
            <h3>Typography</h3>
            <div class="font-examples">
              <div class="font-stack">
                <p class="font-heading" style="font-family: var(--firstwatch-typography-fontfamily-heading)">Roboto Slab</p>
                <code>Headings & Display</code>
              </div>
              <div class="font-stack">
                <p class="font-body" style="font-family: var(--firstwatch-typography-fontfamily-body)">Roboto Condensed</p>
                <code>Body Text</code>
              </div>
              <div class="font-stack">
                <p class="font-mono" style="font-family: var(--firstwatch-typography-fontfamily-mono)">Courier Prime</p>
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
              <div class="surface" style="background: #7c3aed; color: white">
                Primary Action
              </div>
              <div class="surface" style="background: #10b981; color: white">
                Secondary Action
              </div>
            </div>
          </div>
          
          <div class="theme-preview dark">
            <h3>Dark Theme</h3>
            <div class="surface-samples">
              <div class="surface" style="background: #0a0a0b; color: #f5f5f7">
                Background
              </div>
              <div class="surface" style="background: #1a1a1c; color: #d4d4d8">
                Surface
              </div>
              <div class="surface" style="background: #a78bfa; color: white">
                Primary Action
              </div>
              <div class="surface" style="background: #34d399; color: white">
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
      
      <section class="brand-features">
        <h2>Brand Features</h2>
        <div class="feature-grid">
          <div class="feature">
            <div class="feature-icon" style="background: var(--firstwatch-brand-primary-100); color: var(--firstwatch-brand-primary-700)">
              <span>🎨</span>
            </div>
            <h4>Vibrant Colors</h4>
            <p>Purple and green create an energetic, modern feel</p>
          </div>
          <div class="feature">
            <div class="feature-icon" style="background: var(--firstwatch-brand-secondary-100); color: var(--firstwatch-brand-secondary-700)">
              <span>📖</span>
            </div>
            <h4>Readable Typography</h4>
            <p>Roboto family provides excellent readability</p>
          </div>
          <div class="feature">
            <div class="feature-icon" style="background: var(--firstwatch-brand-accent-100); color: var(--firstwatch-brand-accent-700)">
              <span>🌓</span>
            </div>
            <h4>Theme Support</h4>
            <p>Optimized for both light and dark themes</p>
          </div>
        </div>
      </section>
      
      <section class="usage-notes">
        <h2>Usage Notes</h2>
        <ul>
          <li>Activate by setting <code>data-brand="firstwatch"</code> on the root element</li>
          <li>Features Roboto Slab for impactful headings</li>
          <li>Vibrant color palette suitable for modern applications</li>
          <li>Includes comprehensive color scales from 50-900</li>
        </ul>
      </section>
    </div>
    
    <style>
      .brand-overview[data-brand="firstwatch"] {
        padding: 2rem;
        font-family: var(--firstwatch-typography-fontfamily-body);
      }
      
      .brand-overview[data-brand="firstwatch"] h1, 
      .brand-overview[data-brand="firstwatch"] h2, 
      .brand-overview[data-brand="firstwatch"] h3, 
      .brand-overview[data-brand="firstwatch"] h4 {
        font-family: var(--firstwatch-typography-fontfamily-heading);
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
        border-radius: 0.5rem;
        text-align: center;
        color: white;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        transition: all 0.3s ease;
      }
      
      .color-swatch:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      }
      
      .color-swatch span {
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      .color-swatch code {
        font-size: 0.75rem;
        opacity: 0.9;
        font-family: var(--firstwatch-typography-fontfamily-mono);
      }
      
      .font-examples {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
      }
      
      .font-stack {
        padding: 1rem;
        background: #f9fafb;
        border-radius: 0.5rem;
        border: 1px solid #e5e7eb;
      }
      
      .font-stack p {
        font-size: 1.25rem;
        margin-bottom: 0.25rem;
      }
      
      .font-stack code {
        font-size: 0.875rem;
        color: #6b7280;
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
        border: 1px solid #e5e7eb;
      }
      
      .theme-preview.dark {
        background: #0a0a0b;
        color: #f5f5f7;
        border-color: #374151;
      }
      
      .surface-samples {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1rem;
      }
      
      .surface {
        padding: 1rem;
        border-radius: 0.375rem;
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
        font-family: var(--firstwatch-typography-fontfamily-body);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.025em;
      }
      
      .btn-primary {
        background: var(--firstwatch-brand-primary-500);
        color: white;
      }
      
      .btn-primary:hover {
        background: var(--firstwatch-brand-primary-600);
        transform: translateY(-2px);
      }
      
      .btn-secondary {
        background: var(--firstwatch-brand-secondary-500);
        color: white;
      }
      
      .btn-secondary:hover {
        background: var(--firstwatch-brand-secondary-600);
        transform: translateY(-2px);
      }
      
      .btn-accent {
        background: var(--firstwatch-brand-accent-500);
        color: white;
      }
      
      .btn-accent:hover {
        background: var(--firstwatch-brand-accent-600);
        transform: translateY(-2px);
      }
      
      .card-example {
        flex: 1;
        min-width: 250px;
        padding: 1.5rem;
        background: #f9fafb;
        border-radius: 0.5rem;
        border: 1px solid #e5e7eb;
      }
      
      .card-example h4 {
        margin: 0 0 0.5rem 0;
        font-family: var(--firstwatch-typography-fontfamily-heading);
      }
      
      .card-example p {
        margin: 0;
        color: #6b7280;
      }
      
      .feature-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        margin-top: 1.5rem;
      }
      
      .feature {
        text-align: center;
      }
      
      .feature-icon {
        width: 60px;
        height: 60px;
        margin: 0 auto 1rem;
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
      }
      
      .feature h4 {
        margin: 0 0 0.5rem 0;
      }
      
      .feature p {
        margin: 0;
        color: #6b7280;
        font-size: 0.875rem;
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
        background: #f3f4f6;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        font-family: var(--firstwatch-typography-fontfamily-mono);
      }
      
      @media (max-width: 768px) {
        .identity-grid,
        .theme-grid {
          grid-template-columns: 1fr;
        }
        
        .feature-grid {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
      }
    </style>
  `;
};
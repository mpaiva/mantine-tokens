export default {
  title: 'Welcome',
  parameters: {
    docs: {
      page: null
    }
  }
};

export const Introduction = () => {
  return `
    <div class="welcome-page">
      <h1>Mantine Design Tokens</h1>
      <p class="intro">Welcome to the Mantine Design Tokens visual documentation! This Storybook showcases all the design tokens and demonstrates how to use them in your components.</p>
      
      <section>
        <h2>Overview</h2>
        <p>This design system provides a comprehensive set of tokens including:</p>
        <ul>
          <li><strong>Colors</strong>: Full color palette with semantic color mappings</li>
          <li><strong>Typography</strong>: Font families, sizes, weights, and line heights</li>
          <li><strong>Spacing</strong>: Consistent spacing scale from 0 to 3xl</li>
          <li><strong>Shadows</strong>: Elevation system with 5 levels</li>
          <li><strong>Border Radius</strong>: Radius scale from sharp to pill-shaped</li>
          <li><strong>Component Tokens</strong>: Pre-configured tokens for buttons, cards, inputs, and more</li>
        </ul>
      </section>
      
      <section>
        <h2>Features</h2>
        <div class="feature-grid">
          <div class="feature">
            <h3>🎨 Theme Switching</h3>
            <p>Use the toolbar to switch between light and dark themes. The semantic colors automatically adapt to provide optimal contrast.</p>
          </div>
          <div class="feature">
            <h3>🏢 Brand Support</h3>
            <p>Switch between different brands (Mantine, Clearco, Firstwatch) using the brand selector in the toolbar. Each brand has its own color palette and customizations.</p>
          </div>
          <div class="feature">
            <h3>📋 Click to Copy</h3>
            <p>Throughout the documentation, you can click on any token to copy its CSS variable name to your clipboard.</p>
          </div>
        </div>
      </section>
      
      <section>
        <h2>Getting Started</h2>
        
        <h3>Using Tokens in CSS</h3>
        <pre><code>.my-component {
  padding: var(--mantine-spacing-md);
  background: var(--mantine-color-surface);
  border-radius: var(--mantine-radius-md);
  box-shadow: var(--mantine-shadow-sm);
}</code></pre>
        
        <h3>Using Tokens in JavaScript</h3>
        <pre><code>import { mantineTokens } from './build/ts/tokens.ts';

const styles = {
  padding: mantineTokens['spacing.md'],
  fontSize: mantineTokens['typography.fontSize.md']
};</code></pre>
      </section>
      
      <section>
        <h2>Token Categories</h2>
        <p>Navigate through the sidebar to explore:</p>
        <ul>
          <li><strong>Design Tokens</strong>: Raw token values organized by type</li>
          <li><strong>Components</strong>: Example components built with the design tokens</li>
        </ul>
      </section>
      
      <section>
        <h2>Development</h2>
        <p>To use these tokens in your project:</p>
        <ol>
          <li>Import the CSS file: <code>import './build/css/variables.css'</code></li>
          <li>Import theme files: <code>import './build/css/theme-light.css'</code> or <code>theme-dark.css</code></li>
          <li>Apply tokens using CSS custom properties</li>
        </ol>
        <p>For TypeScript projects, you can also import typed tokens from <code>build/ts/tokens.ts</code>.</p>
      </section>
      
      <section class="future-section">
        <h2>Future Figma Plugin Integration</h2>
        <p>This Storybook is designed to be consumed by a Figma plugin that will:</p>
        <ol>
          <li>Connect to this running Storybook instance</li>
          <li>Import all design tokens</li>
          <li>Create Figma styles matching the tokens</li>
          <li>Sync component variants from these stories</li>
          <li>Keep design and code in perfect sync</li>
        </ol>
        <p>Stay tuned for the plugin development!</p>
      </section>
    </div>
    
    <style>
      /* Import CSS variables */
      @import url('/css/variables.css');
      @import url('/css/theme-light.css');
      
      .welcome-page {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        font-family: var(--mantine-font-family-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        line-height: 1.6;
      }
      
      .welcome-page h1 {
        margin: 0 0 1rem 0;
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--mantine-color-text-primary);
      }
      
      .intro {
        font-size: 1.125rem;
        color: var(--mantine-color-text-secondary);
        margin-bottom: 2rem;
      }
      
      .welcome-page section {
        margin: 2rem 0;
      }
      
      .welcome-page h2 {
        margin: 0 0 1rem 0;
        font-size: 1.75rem;
        font-weight: 600;
        color: var(--mantine-color-text-primary);
      }
      
      .welcome-page h3 {
        margin: 1.5rem 0 0.75rem 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--mantine-color-text-primary);
      }
      
      .welcome-page ul, .welcome-page ol {
        margin: 0.5rem 0;
        padding-left: 2rem;
      }
      
      .welcome-page li {
        margin: 0.5rem 0;
      }
      
      .feature-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin: 1rem 0;
      }
      
      .feature {
        padding: 1.5rem;
        background: var(--mantine-color-surface);
        border-radius: var(--mantine-radius-md);
        border: 1px solid var(--mantine-color-border-subtle);
      }
      
      .feature h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.125rem;
      }
      
      .feature p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--mantine-color-text-secondary);
      }
      
      .welcome-page pre {
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-sm);
        padding: 1rem;
        overflow-x: auto;
        margin: 0.5rem 0;
      }
      
      .welcome-page code {
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.875rem;
      }
      
      .welcome-page pre code {
        display: block;
        color: var(--mantine-color-text-primary);
      }
      
      .welcome-page :not(pre) > code {
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-xs);
        padding: 0.125rem 0.375rem;
        font-size: 0.875rem;
        color: var(--mantine-color-text-primary);
      }
      
      .future-section {
        margin-top: 3rem;
        padding: 2rem;
        background: var(--mantine-color-surface);
        border-radius: var(--mantine-radius-md);
        border: 1px solid var(--mantine-color-primary);
      }
    </style>
  `;
};
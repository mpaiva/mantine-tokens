export default {
  title: 'Global/Custom/Overview',
  parameters: {
    docs: {
      description: {
        component: 'Custom tokens extend the primitive tokens with additional values for specific use cases and brand requirements.'
      }
    }
  }
};

export const CustomOverview = () => {
  return `
    <div class="custom-overview">
      <h1>Custom Tokens</h1>
      <p class="description">
        Custom tokens extend the design system's primitive tokens with additional values that are specific to your 
        brand or project needs. They follow the same naming conventions and are built alongside the standard tokens.
      </p>
      
      <section class="concept-section">
        <h2>What are Custom Tokens?</h2>
        <p>
          While primitive tokens provide a solid foundation, sometimes you need additional values that go beyond 
          the standard set. Custom tokens allow you to:
        </p>
        <ul>
          <li>Add extra spacing values for specific layouts</li>
          <li>Include display and hero typography sizes</li>
          <li>Define component-specific tokens for custom components</li>
          <li>Extend the design system without modifying core tokens</li>
        </ul>
      </section>
      
      <section class="categories-section">
        <h2>Custom Token Categories</h2>
        
        <div class="category-grid">
          <div class="category-card">
            <h3>📏 Custom Spacing</h3>
            <p>Additional spacing values beyond the standard scale</p>
            <div class="token-examples">
              <code>--custom-spacing-xxs</code> - 0.25rem (4px)
              <code>--custom-spacing-4xl</code> - 5rem (80px)
              <code>--custom-spacing-5xl</code> - 6rem (96px)
              <code>--custom-spacing-section</code> - 2.5rem (40px)
              <code>--custom-spacing-page</code> - 3.5rem (56px)
            </div>
          </div>
          
          <div class="category-card">
            <h3>📝 Custom Typography</h3>
            <p>Display sizes and additional font weights</p>
            <div class="token-examples">
              <code>--custom-typography-fontsize-display</code> - 3rem (48px)
              <code>--custom-typography-fontsize-jumbo</code> - 4rem (64px)
              <code>--custom-typography-fontsize-hero</code> - 2.5rem (40px)
              <code>--custom-typography-fontweight-thin</code> - 100
              <code>--custom-typography-fontweight-black</code> - 900
            </div>
          </div>
          
          <div class="category-card">
            <h3>🎨 Component Tokens</h3>
            <p>Tokens for custom components like oval buttons</p>
            <div class="token-examples">
              <code>--custom-ovalbutton-height-md</code> - 3rem (48px)
              <code>--custom-ovalbutton-radius</code> - 999px
              <code>--custom-ovalbutton-shadow-hover</code>
              <code>--custom-ovalbutton-transition-duration</code> - 200ms
            </div>
          </div>
        </div>
      </section>
      
      <section class="usage-section">
        <h2>Using Custom Tokens</h2>
        <p>Custom tokens are used the same way as primitive tokens:</p>
        
        <div class="code-example">
          <h4>CSS Usage</h4>
          <pre><code>/* Hero section with custom spacing and typography */
.hero {
  padding: var(--custom-spacing-section) var(--custom-spacing-page);
  font-size: var(--custom-typography-fontsize-hero);
  font-weight: var(--custom-typography-fontweight-bold);
}

/* Oval button using custom component tokens */
.oval-button {
  height: var(--custom-ovalbutton-height-md);
  border-radius: var(--custom-ovalbutton-radius);
  transition: all var(--custom-ovalbutton-transition-duration) 
              var(--custom-ovalbutton-transition-timing);
}</code></pre>
        </div>
      </section>
      
      <section class="prefix-section">
        <h2>Custom Prefix</h2>
        <p>
          Custom tokens use a configurable prefix (default: "custom") that can be changed in 
          <code>tokens/_custom-prefix.json</code>. This allows you to namespace custom tokens 
          separately from your main design tokens.
        </p>
        
        <div class="prefix-example">
          <h4>Example: Using brand-specific prefix</h4>
          <pre><code>// tokens/_custom-prefix.json
{
  "prefix": "myapp"
}

// Results in:
--myapp-spacing-xxs
--myapp-typography-fontsize-hero
--myapp-ovalbutton-radius</code></pre>
        </div>
      </section>
      
      <section class="navigation-section">
        <h2>Explore Custom Tokens</h2>
        <div class="nav-cards">
          <a href="?path=/story/global-custom-spacing--spacing-tokens" class="nav-card">
            <h3>📏 Custom Spacing</h3>
            <p>Extended spacing scale for special layouts</p>
          </a>
          <a href="?path=/story/global-custom-typography--typography-tokens" class="nav-card">
            <h3>📝 Custom Typography</h3>
            <p>Display sizes and extended font weights</p>
          </a>
          <a href="?path=/story/global-custom-components--component-tokens" class="nav-card">
            <h3>🎨 Component Tokens</h3>
            <p>Tokens for custom components</p>
          </a>
        </div>
      </section>
    </div>
    
    <style>
      .custom-overview {
        padding: 2rem;
        font-family: var(--mantine-typography-fontfamily-sans);
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .description {
        font-size: 1.125rem;
        color: var(--mantine-color-gray-700);
        margin-bottom: 3rem;
        line-height: 1.7;
      }
      
      .concept-section,
      .categories-section,
      .usage-section,
      .prefix-section {
        margin-bottom: 3rem;
      }
      
      .category-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
      }
      
      .category-card {
        padding: 1.5rem;
        background: var(--mantine-color-gray-50);
        border-radius: 0.5rem;
        border: 1px solid var(--mantine-color-gray-200);
      }
      
      .category-card h3 {
        margin: 0 0 0.5rem 0;
        color: var(--mantine-color-blue-600);
        font-size: 1.25rem;
      }
      
      .category-card p {
        margin: 0 0 1rem 0;
        color: var(--mantine-color-gray-600);
        font-size: 0.875rem;
      }
      
      .token-examples {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .token-examples code {
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.813rem;
        color: var(--mantine-color-gray-700);
        background: white;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        border: 1px solid var(--mantine-color-gray-200);
      }
      
      .code-example,
      .prefix-example {
        background: #f6f8fa;
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-top: 1rem;
      }
      
      .code-example h4,
      .prefix-example h4 {
        margin: 0 0 0.5rem 0;
        font-size: 0.875rem;
        color: var(--mantine-color-gray-700);
      }
      
      .code-example pre,
      .prefix-example pre {
        margin: 0;
        padding: 1rem;
        background: white;
        border: 1px solid var(--mantine-color-gray-200);
        border-radius: 0.375rem;
        overflow-x: auto;
      }
      
      .code-example code,
      .prefix-example code {
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.875rem;
        line-height: 1.5;
        color: var(--mantine-color-gray-900);
      }
      
      .navigation-section {
        margin-top: 4rem;
      }
      
      .nav-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
      }
      
      .nav-card {
        padding: 2rem;
        background: var(--mantine-color-blue-50);
        border: 1px solid var(--mantine-color-blue-200);
        border-radius: 0.5rem;
        text-decoration: none;
        color: inherit;
        transition: all 0.2s;
        text-align: center;
      }
      
      .nav-card:hover {
        background: var(--mantine-color-blue-100);
        border-color: var(--mantine-color-blue-300);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      
      .nav-card h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
      }
      
      .nav-card p {
        margin: 0;
        color: var(--mantine-color-gray-600);
        font-size: 0.875rem;
      }
      
      @media (max-width: 768px) {
        .category-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `;
};
export default {
  title: 'Global/Custom/Typography',
  parameters: {
    docs: {
      description: {
        component: 'Extended typography tokens including display sizes, additional font weights, and enhanced spacing options.'
      }
    }
  }
};

export const TypographyTokens = () => {
  return `
    <div class="custom-typography">
      <h1>Custom Typography Tokens</h1>
      <p class="description">
        Custom typography tokens extend the standard type system with display sizes for hero sections, 
        additional font weights for finer control, and enhanced line height and letter spacing options.
      </p>
      
      <!-- Font Sizes Section -->
      <section class="typography-section">
        <h2>Display & Hero Sizes</h2>
        <p class="section-description">
          Large typography sizes for impactful headlines and hero sections
        </p>
        
        <div class="size-list">
          <div class="size-item" onclick="navigator.clipboard.writeText('--custom-typography-fontsize-jumbo')">
            <div class="size-demo" style="font-size: var(--custom-typography-fontsize-jumbo)">
              Jumbo
            </div>
            <div class="size-info">
              <h4>Jumbo</h4>
              <code>--custom-typography-fontsize-jumbo</code>
              <span class="value">4rem (64px)</span>
              <p>Maximum impact for hero sections</p>
            </div>
          </div>
          
          <div class="size-item" onclick="navigator.clipboard.writeText('--custom-typography-fontsize-display')">
            <div class="size-demo" style="font-size: var(--custom-typography-fontsize-display)">
              Display
            </div>
            <div class="size-info">
              <h4>Display</h4>
              <code>--custom-typography-fontsize-display</code>
              <span class="value">3rem (48px)</span>
              <p>Large display text for emphasis</p>
            </div>
          </div>
          
          <div class="size-item" onclick="navigator.clipboard.writeText('--custom-typography-fontsize-hero')">
            <div class="size-demo" style="font-size: var(--custom-typography-fontsize-hero)">
              Hero Text
            </div>
            <div class="size-info">
              <h4>Hero</h4>
              <code>--custom-typography-fontsize-hero</code>
              <span class="value">2.5rem (40px)</span>
              <p>Hero section headings</p>
            </div>
          </div>
          
          <div class="size-item" onclick="navigator.clipboard.writeText('--custom-typography-fontsize-headline')">
            <div class="size-demo" style="font-size: var(--custom-typography-fontsize-headline)">
              Headline Text
            </div>
            <div class="size-info">
              <h4>Headline</h4>
              <code>--custom-typography-fontsize-headline</code>
              <span class="value">2rem (32px)</span>
              <p>Page and section headlines</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Font Weights Section -->
      <section class="typography-section">
        <h2>Extended Font Weights</h2>
        <p class="section-description">
          Complete range of font weights from thin to black
        </p>
        
        <div class="weight-grid">
          <div class="weight-item" onclick="navigator.clipboard.writeText('--custom-typography-fontweight-thin')">
            <div class="weight-demo" style="font-weight: var(--custom-typography-fontweight-thin)">
              Thin
            </div>
            <div class="weight-info">
              <code>--custom-typography-fontweight-thin</code>
              <span class="value">100</span>
            </div>
          </div>
          
          <div class="weight-item" onclick="navigator.clipboard.writeText('--custom-typography-fontweight-extralight')">
            <div class="weight-demo" style="font-weight: var(--custom-typography-fontweight-extralight)">
              Extra Light
            </div>
            <div class="weight-info">
              <code>--custom-typography-fontweight-extralight</code>
              <span class="value">200</span>
            </div>
          </div>
          
          <div class="weight-item" onclick="navigator.clipboard.writeText('--custom-typography-fontweight-light')">
            <div class="weight-demo" style="font-weight: var(--custom-typography-fontweight-light)">
              Light
            </div>
            <div class="weight-info">
              <code>--custom-typography-fontweight-light</code>
              <span class="value">300</span>
            </div>
          </div>
          
          <div class="weight-item" onclick="navigator.clipboard.writeText('--custom-typography-fontweight-normal')">
            <div class="weight-demo" style="font-weight: var(--custom-typography-fontweight-normal)">
              Normal
            </div>
            <div class="weight-info">
              <code>--custom-typography-fontweight-normal</code>
              <span class="value">400</span>
            </div>
          </div>
          
          <div class="weight-item" onclick="navigator.clipboard.writeText('--custom-typography-fontweight-medium')">
            <div class="weight-demo" style="font-weight: var(--custom-typography-fontweight-medium)">
              Medium
            </div>
            <div class="weight-info">
              <code>--custom-typography-fontweight-medium</code>
              <span class="value">500</span>
            </div>
          </div>
          
          <div class="weight-item" onclick="navigator.clipboard.writeText('--custom-typography-fontweight-semibold')">
            <div class="weight-demo" style="font-weight: var(--custom-typography-fontweight-semibold)">
              Semibold
            </div>
            <div class="weight-info">
              <code>--custom-typography-fontweight-semibold</code>
              <span class="value">600</span>
            </div>
          </div>
          
          <div class="weight-item" onclick="navigator.clipboard.writeText('--custom-typography-fontweight-bold')">
            <div class="weight-demo" style="font-weight: var(--custom-typography-fontweight-bold)">
              Bold
            </div>
            <div class="weight-info">
              <code>--custom-typography-fontweight-bold</code>
              <span class="value">700</span>
            </div>
          </div>
          
          <div class="weight-item" onclick="navigator.clipboard.writeText('--custom-typography-fontweight-extrabold')">
            <div class="weight-demo" style="font-weight: var(--custom-typography-fontweight-extrabold)">
              Extra Bold
            </div>
            <div class="weight-info">
              <code>--custom-typography-fontweight-extrabold</code>
              <span class="value">800</span>
            </div>
          </div>
          
          <div class="weight-item" onclick="navigator.clipboard.writeText('--custom-typography-fontweight-black')">
            <div class="weight-demo" style="font-weight: var(--custom-typography-fontweight-black)">
              Black
            </div>
            <div class="weight-info">
              <code>--custom-typography-fontweight-black</code>
              <span class="value">900</span>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Line Height Section -->
      <section class="typography-section">
        <h2>Line Heights</h2>
        <p class="section-description">
          Line height options for different content densities
        </p>
        
        <div class="lineheight-list">
          <div class="lineheight-item" onclick="navigator.clipboard.writeText('--custom-typography-lineheight-compact')">
            <div class="lineheight-demo" style="line-height: var(--custom-typography-lineheight-compact)">
              <p>Compact line height is perfect for headings and display text where you want a tight, impactful appearance. Lines are closer together.</p>
            </div>
            <div class="lineheight-info">
              <h4>Compact</h4>
              <code>--custom-typography-lineheight-compact</code>
              <span class="value">1.1</span>
            </div>
          </div>
          
          <div class="lineheight-item" onclick="navigator.clipboard.writeText('--custom-typography-lineheight-normal')">
            <div class="lineheight-demo" style="line-height: var(--custom-typography-lineheight-normal)">
              <p>Normal line height provides standard readability for body text. This is the default spacing that works well for most content.</p>
            </div>
            <div class="lineheight-info">
              <h4>Normal</h4>
              <code>--custom-typography-lineheight-normal</code>
              <span class="value">1.5</span>
            </div>
          </div>
          
          <div class="lineheight-item" onclick="navigator.clipboard.writeText('--custom-typography-lineheight-relaxed')">
            <div class="lineheight-demo" style="line-height: var(--custom-typography-lineheight-relaxed)">
              <p>Relaxed line height improves readability for longer passages of text. The extra space between lines reduces eye strain.</p>
            </div>
            <div class="lineheight-info">
              <h4>Relaxed</h4>
              <code>--custom-typography-lineheight-relaxed</code>
              <span class="value">1.75</span>
            </div>
          </div>
          
          <div class="lineheight-item" onclick="navigator.clipboard.writeText('--custom-typography-lineheight-loose')">
            <div class="lineheight-demo" style="line-height: var(--custom-typography-lineheight-loose)">
              <p>Loose line height maximizes readability with generous spacing. Ideal for accessibility or content that needs extra breathing room.</p>
            </div>
            <div class="lineheight-info">
              <h4>Loose</h4>
              <code>--custom-typography-lineheight-loose</code>
              <span class="value">2</span>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Letter Spacing Section -->
      <section class="typography-section">
        <h2>Letter Spacing</h2>
        <p class="section-description">
          Fine-tune character spacing for different typography styles
        </p>
        
        <div class="letterspacing-grid">
          <div class="letterspacing-item" onclick="navigator.clipboard.writeText('--custom-typography-letterspacing-tighter')">
            <div class="letterspacing-demo" style="letter-spacing: var(--custom-typography-letterspacing-tighter)">
              TIGHTER SPACING
            </div>
            <div class="letterspacing-info">
              <code>--custom-typography-letterspacing-tighter</code>
              <span class="value">-0.02em</span>
            </div>
          </div>
          
          <div class="letterspacing-item" onclick="navigator.clipboard.writeText('--custom-typography-letterspacing-tight')">
            <div class="letterspacing-demo" style="letter-spacing: var(--custom-typography-letterspacing-tight)">
              TIGHT SPACING
            </div>
            <div class="letterspacing-info">
              <code>--custom-typography-letterspacing-tight</code>
              <span class="value">-0.01em</span>
            </div>
          </div>
          
          <div class="letterspacing-item" onclick="navigator.clipboard.writeText('--custom-typography-letterspacing-normal')">
            <div class="letterspacing-demo" style="letter-spacing: var(--custom-typography-letterspacing-normal)">
              NORMAL SPACING
            </div>
            <div class="letterspacing-info">
              <code>--custom-typography-letterspacing-normal</code>
              <span class="value">0</span>
            </div>
          </div>
          
          <div class="letterspacing-item" onclick="navigator.clipboard.writeText('--custom-typography-letterspacing-wide')">
            <div class="letterspacing-demo" style="letter-spacing: var(--custom-typography-letterspacing-wide)">
              WIDE SPACING
            </div>
            <div class="letterspacing-info">
              <code>--custom-typography-letterspacing-wide</code>
              <span class="value">0.02em</span>
            </div>
          </div>
          
          <div class="letterspacing-item" onclick="navigator.clipboard.writeText('--custom-typography-letterspacing-wider')">
            <div class="letterspacing-demo" style="letter-spacing: var(--custom-typography-letterspacing-wider)">
              WIDER SPACING
            </div>
            <div class="letterspacing-info">
              <code>--custom-typography-letterspacing-wider</code>
              <span class="value">0.04em</span>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Usage Examples -->
      <section class="usage-section">
        <h2>Usage Examples</h2>
        
        <div class="example-grid">
          <div class="example-card">
            <h3>Hero Section</h3>
            <pre><code>.hero-title {
  font-size: var(--custom-typography-fontsize-jumbo);
  font-weight: var(--custom-typography-fontweight-black);
  line-height: var(--custom-typography-lineheight-compact);
  letter-spacing: var(--custom-typography-letterspacing-tighter);
}</code></pre>
          </div>
          
          <div class="example-card">
            <h3>Subtitle</h3>
            <pre><code>.subtitle {
  font-size: var(--custom-typography-fontsize-headline);
  font-weight: var(--custom-typography-fontweight-light);
  line-height: var(--custom-typography-lineheight-relaxed);
}</code></pre>
          </div>
          
          <div class="example-card">
            <h3>All Caps Label</h3>
            <pre><code>.label {
  font-size: var(--mantine-typography-fontsize-sm);
  font-weight: var(--custom-typography-fontweight-semibold);
  letter-spacing: var(--custom-typography-letterspacing-wider);
  text-transform: uppercase;
}</code></pre>
          </div>
        </div>
      </section>
    </div>
    
    <style>
      .custom-typography {
        padding: 2rem;
        font-family: var(--mantine-typography-fontfamily-sans);
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .description {
        font-size: 1.125rem;
        color: var(--mantine-color-gray-700);
        margin-bottom: 3rem;
        line-height: 1.6;
      }
      
      .typography-section {
        margin-bottom: 4rem;
      }
      
      .section-description {
        color: var(--mantine-color-gray-600);
        margin: 0.5rem 0 2rem 0;
      }
      
      /* Font Size Styles */
      .size-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .size-item {
        display: flex;
        align-items: center;
        gap: 2rem;
        padding: 1.5rem;
        background: white;
        border: 1px solid var(--mantine-color-gray-200);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .size-item:hover {
        border-color: var(--mantine-color-blue-300);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .size-demo {
        flex: 0 0 40%;
        font-weight: 700;
        line-height: 1;
        color: var(--mantine-color-gray-800);
      }
      
      .size-info h4 {
        margin: 0 0 0.25rem 0;
        font-size: 1rem;
      }
      
      .size-info code {
        display: block;
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.813rem;
        color: var(--mantine-color-gray-600);
        margin-bottom: 0.25rem;
      }
      
      .size-info .value {
        display: inline-block;
        color: var(--mantine-color-gray-500);
        font-size: 0.813rem;
      }
      
      .size-info p {
        margin: 0.5rem 0 0 0;
        color: var(--mantine-color-gray-600);
        font-size: 0.875rem;
      }
      
      /* Font Weight Styles */
      .weight-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }
      
      .weight-item {
        padding: 1.5rem;
        background: white;
        border: 1px solid var(--mantine-color-gray-200);
        border-radius: 0.5rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .weight-item:hover {
        border-color: var(--mantine-color-blue-300);
        transform: translateY(-2px);
      }
      
      .weight-demo {
        font-size: 1.25rem;
        margin-bottom: 1rem;
      }
      
      .weight-info code {
        display: block;
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-gray-600);
        margin-bottom: 0.25rem;
      }
      
      .weight-info .value {
        font-size: 0.813rem;
        color: var(--mantine-color-gray-500);
      }
      
      /* Line Height Styles */
      .lineheight-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .lineheight-item {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 2rem;
        padding: 1.5rem;
        background: white;
        border: 1px solid var(--mantine-color-gray-200);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .lineheight-item:hover {
        border-color: var(--mantine-color-blue-300);
      }
      
      .lineheight-demo {
        font-size: 0.875rem;
        color: var(--mantine-color-gray-700);
      }
      
      .lineheight-demo p {
        margin: 0;
        border-left: 3px solid var(--mantine-color-blue-200);
        padding-left: 1rem;
      }
      
      .lineheight-info {
        text-align: right;
      }
      
      .lineheight-info h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
      }
      
      .lineheight-info code {
        display: block;
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-gray-600);
        margin-bottom: 0.25rem;
      }
      
      .lineheight-info .value {
        font-size: 0.813rem;
        color: var(--mantine-color-gray-500);
      }
      
      /* Letter Spacing Styles */
      .letterspacing-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }
      
      .letterspacing-item {
        padding: 1.5rem;
        background: white;
        border: 1px solid var(--mantine-color-gray-200);
        border-radius: 0.5rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .letterspacing-item:hover {
        border-color: var(--mantine-color-blue-300);
        transform: translateY(-2px);
      }
      
      .letterspacing-demo {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--mantine-color-gray-800);
      }
      
      .letterspacing-info code {
        display: block;
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.75rem;
        color: var(--mantine-color-gray-600);
        margin-bottom: 0.25rem;
      }
      
      .letterspacing-info .value {
        font-size: 0.813rem;
        color: var(--mantine-color-gray-500);
      }
      
      /* Usage Examples */
      .usage-section {
        margin-top: 3rem;
      }
      
      .example-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
      }
      
      .example-card {
        padding: 1.5rem;
        background: var(--mantine-color-gray-50);
        border-radius: 0.5rem;
      }
      
      .example-card h3 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        color: var(--mantine-color-gray-800);
      }
      
      .example-card pre {
        margin: 0;
        padding: 1rem;
        background: white;
        border: 1px solid var(--mantine-color-gray-200);
        border-radius: 0.375rem;
        overflow-x: auto;
      }
      
      .example-card code {
        font-family: var(--mantine-typography-fontfamily-mono);
        font-size: 0.813rem;
        line-height: 1.5;
      }
      
      /* Copy feedback */
      .size-item:active,
      .weight-item:active,
      .lineheight-item:active,
      .letterspacing-item:active {
        transform: scale(0.98);
      }
      
      @media (max-width: 768px) {
        .size-item {
          flex-direction: column;
          align-items: flex-start;
        }
        
        .size-demo {
          flex: none;
          margin-bottom: 1rem;
        }
        
        .weight-grid,
        .letterspacing-grid {
          grid-template-columns: 1fr;
        }
        
        .lineheight-item {
          grid-template-columns: 1fr;
        }
        
        .lineheight-info {
          text-align: left;
          margin-top: 1rem;
        }
      }
    </style>
    
    <script>
      // Visual feedback when copying
      document.querySelectorAll('.size-item, .weight-item, .lineheight-item, .letterspacing-item').forEach(el => {
        el.addEventListener('click', function() {
          const originalBorder = this.style.borderColor;
          this.style.borderColor = 'var(--mantine-color-green-500)';
          setTimeout(() => {
            this.style.borderColor = originalBorder;
          }, 300);
        });
      });
    </script>
  `;
};
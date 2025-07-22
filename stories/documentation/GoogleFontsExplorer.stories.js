export default {
  title: 'Documentation/Google Fonts Explorer',
  parameters: {
    docs: {
      description: {
        component: 'Explore and test all available Google Fonts for your brand typography'
      }
    }
  }
};

export const FontExplorer = () => {
  return `
    <div class="font-explorer">
      <h1>Google Fonts Explorer</h1>
      <p class="description">
        Explore over 100+ popular Google Fonts available in Storybook. 
        Click on any font name to copy it for use in your typography tokens.
      </p>
      
      <div class="controls">
        <div class="search-box">
          <input 
            type="text" 
            id="font-search" 
            placeholder="Search fonts..." 
            class="search-input"
          />
        </div>
        
        <div class="filter-buttons">
          <button class="filter-btn active" data-category="all">All</button>
          <button class="filter-btn" data-category="sans-serif">Sans Serif</button>
          <button class="filter-btn" data-category="serif">Serif</button>
          <button class="filter-btn" data-category="display">Display</button>
          <button class="filter-btn" data-category="handwriting">Handwriting</button>
          <button class="filter-btn" data-category="monospace">Monospace</button>
        </div>
        
        <div class="preview-controls">
          <label>
            Preview Text:
            <input 
              type="text" 
              id="preview-text" 
              value="The quick brown fox jumps over the lazy dog"
              class="preview-input"
            />
          </label>
          
          <label>
            Size:
            <input 
              type="range" 
              id="font-size" 
              min="12" 
              max="72" 
              value="24"
              class="size-slider"
            />
            <span id="size-value">24px</span>
          </label>
        </div>
      </div>
      
      <div class="test-area">
        <h2>Test Your Font</h2>
        <div class="test-input-wrapper">
          <input 
            type="text" 
            id="test-font-name" 
            placeholder="Enter font name (e.g., Lobster Two)"
            class="test-input"
          />
          <button id="test-font-btn" class="test-btn">Test Font</button>
        </div>
        <div id="test-result" class="test-result"></div>
      </div>
      
      <div id="fonts-grid" class="fonts-grid">
        <!-- Font cards will be inserted here by JavaScript -->
      </div>
      
      <div id="copy-notification" class="copy-notification">
        Font name copied to clipboard!
      </div>
    </div>
    
    <style>
      .font-explorer {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
        font-family: var(--mantine-typography-fontfamily-body);
      }
      
      .font-explorer h1 {
        font-family: var(--mantine-typography-fontfamily-heading);
        font-size: 2.5rem;
        margin: 0 0 0.5rem 0;
        color: var(--mantine-color-text-primary);
      }
      
      .description {
        font-size: 1.125rem;
        color: var(--mantine-color-text-secondary);
        margin-bottom: 2rem;
      }
      
      .controls {
        background: var(--mantine-color-surface);
        padding: 1.5rem;
        border-radius: var(--mantine-radius-md);
        margin-bottom: 2rem;
        border: 1px solid var(--mantine-color-border-subtle);
      }
      
      .search-box {
        margin-bottom: 1rem;
      }
      
      .search-input {
        width: 100%;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        border: 1px solid var(--mantine-color-border);
        border-radius: var(--mantine-radius-md);
        background: var(--mantine-color-background);
        color: var(--mantine-color-text-primary);
        transition: border-color 200ms;
      }
      
      .search-input:focus {
        outline: none;
        border-color: var(--mantine-color-primary);
        box-shadow: 0 0 0 2px rgba(var(--mantine-color-primary-rgb), 0.2);
      }
      
      .filter-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
      
      .filter-btn {
        padding: 0.5rem 1rem;
        border: 1px solid var(--mantine-color-border);
        background: var(--mantine-color-background);
        color: var(--mantine-color-text-secondary);
        border-radius: var(--mantine-radius-md);
        cursor: pointer;
        transition: all 200ms;
        font-size: 0.875rem;
      }
      
      .filter-btn:hover {
        border-color: var(--mantine-color-primary);
        color: var(--mantine-color-primary);
      }
      
      .filter-btn.active {
        background: var(--mantine-color-primary);
        color: white;
        border-color: var(--mantine-color-primary);
      }
      
      .preview-controls {
        display: flex;
        gap: 2rem;
        align-items: center;
        flex-wrap: wrap;
      }
      
      .preview-controls label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--mantine-color-text-secondary);
      }
      
      .preview-input {
        padding: 0.375rem 0.75rem;
        border: 1px solid var(--mantine-color-border);
        border-radius: var(--mantine-radius-sm);
        background: var(--mantine-color-background);
        color: var(--mantine-color-text-primary);
        width: 300px;
      }
      
      .size-slider {
        width: 150px;
      }
      
      .test-area {
        background: var(--mantine-color-surface);
        padding: 1.5rem;
        border-radius: var(--mantine-radius-md);
        margin-bottom: 2rem;
        border: 1px solid var(--mantine-color-border-subtle);
      }
      
      .test-area h2 {
        margin: 0 0 1rem 0;
        font-size: 1.25rem;
        color: var(--mantine-color-text-primary);
      }
      
      .test-input-wrapper {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      
      .test-input {
        flex: 1;
        padding: 0.5rem 1rem;
        border: 1px solid var(--mantine-color-border);
        border-radius: var(--mantine-radius-md);
        background: var(--mantine-color-background);
        color: var(--mantine-color-text-primary);
      }
      
      .test-btn {
        padding: 0.5rem 1.5rem;
        background: var(--mantine-color-primary);
        color: white;
        border: none;
        border-radius: var(--mantine-radius-md);
        cursor: pointer;
        font-weight: 500;
        transition: background 200ms;
      }
      
      .test-btn:hover {
        background: var(--mantine-color-primary-hover);
      }
      
      .test-result {
        padding: 1rem;
        background: var(--mantine-color-background);
        border-radius: var(--mantine-radius-md);
        min-height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        transition: all 300ms;
      }
      
      .fonts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
      }
      
      .font-card {
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
        padding: 1.5rem;
        transition: all 200ms;
        cursor: pointer;
      }
      
      .font-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--mantine-shadow-md);
        border-color: var(--mantine-color-primary);
      }
      
      .font-name {
        font-size: 0.875rem;
        color: var(--mantine-color-text-tertiary);
        margin: 0 0 0.5rem 0;
        font-family: var(--mantine-typography-fontfamily-mono);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .font-category {
        font-size: 0.75rem;
        padding: 0.125rem 0.5rem;
        background: var(--mantine-color-primary-subtle);
        color: var(--mantine-color-primary);
        border-radius: var(--mantine-radius-sm);
      }
      
      .font-preview {
        font-size: 24px;
        line-height: 1.4;
        color: var(--mantine-color-text-primary);
        margin: 0;
        min-height: 2em;
        word-break: break-word;
      }
      
      .copy-notification {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: var(--mantine-color-success);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--mantine-radius-md);
        box-shadow: var(--mantine-shadow-lg);
        transform: translateY(100px);
        opacity: 0;
        transition: all 300ms;
        pointer-events: none;
        z-index: 1000;
      }
      
      .copy-notification.show {
        transform: translateY(0);
        opacity: 1;
      }
      
      .font-loading {
        color: var(--mantine-color-text-tertiary);
        font-style: italic;
      }
      
      .font-error {
        color: var(--mantine-color-error);
      }
    </style>
    
    <script type="module">
      import { 
        googleFonts, 
        sansSerifFonts, 
        serifFonts, 
        displayFonts, 
        handwritingFonts, 
        monospaceFonts,
        loadFont
      } from '/.storybook/google-fonts-config.js';
      
      const fontsGrid = document.getElementById('fonts-grid');
      const searchInput = document.getElementById('font-search');
      const previewTextInput = document.getElementById('preview-text');
      const fontSizeSlider = document.getElementById('font-size');
      const sizeValue = document.getElementById('size-value');
      const filterButtons = document.querySelectorAll('.filter-btn');
      const copyNotification = document.getElementById('copy-notification');
      const testFontInput = document.getElementById('test-font-name');
      const testFontBtn = document.getElementById('test-font-btn');
      const testResult = document.getElementById('test-result');
      
      let currentFilter = 'all';
      let currentSearch = '';
      
      // Font categories for easy filtering
      const fontsByCategory = {
        'all': Object.keys(googleFonts),
        'sans-serif': sansSerifFonts,
        'serif': serifFonts,
        'display': displayFonts,
        'handwriting': handwritingFonts,
        'monospace': monospaceFonts
      };
      
      // Render font cards
      function renderFonts() {
        const fonts = fontsByCategory[currentFilter] || [];
        const filteredFonts = fonts.filter(fontName => 
          fontName.toLowerCase().includes(currentSearch.toLowerCase())
        );
        
        fontsGrid.innerHTML = filteredFonts.map(fontName => {
          const fontConfig = googleFonts[fontName];
          return \`
            <div class="font-card" data-font="\${fontName}">
              <div class="font-name">
                <span>\${fontName}</span>
                <span class="font-category">\${fontConfig.category}</span>
              </div>
              <p class="font-preview" style="font-family: '\${fontName}', \${fontConfig.category};">
                \${previewTextInput.value}
              </p>
            </div>
          \`;
        }).join('');
        
        // Update preview text size
        updateFontSize();
      }
      
      // Update font size
      function updateFontSize() {
        const size = fontSizeSlider.value;
        sizeValue.textContent = size + 'px';
        document.querySelectorAll('.font-preview').forEach(el => {
          el.style.fontSize = size + 'px';
        });
      }
      
      // Copy font name to clipboard
      async function copyFontName(fontName) {
        try {
          await navigator.clipboard.writeText(\`'\${fontName}'\`);
          copyNotification.classList.add('show');
          setTimeout(() => {
            copyNotification.classList.remove('show');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      }
      
      // Test font loading
      function testFont() {
        const fontName = testFontInput.value.trim();
        if (!fontName) return;
        
        testResult.textContent = 'Loading font...';
        testResult.className = 'test-result font-loading';
        
        if (googleFonts[fontName]) {
          // Font exists in our config
          loadFont(fontName);
          setTimeout(() => {
            testResult.style.fontFamily = \`'\${fontName}', sans-serif\`;
            testResult.textContent = \`This is "\${fontName}" - \${previewTextInput.value}\`;
            testResult.className = 'test-result';
          }, 500);
        } else {
          testResult.textContent = \`Font "\${fontName}" not found in Google Fonts config\`;
          testResult.className = 'test-result font-error';
          testResult.style.fontFamily = '';
        }
      }
      
      // Event listeners
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderFonts();
      });
      
      previewTextInput.addEventListener('input', renderFonts);
      fontSizeSlider.addEventListener('input', updateFontSize);
      
      filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          filterButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentFilter = btn.dataset.category;
          renderFonts();
        });
      });
      
      fontsGrid.addEventListener('click', (e) => {
        const fontCard = e.target.closest('.font-card');
        if (fontCard) {
          const fontName = fontCard.dataset.font;
          copyFontName(fontName);
        }
      });
      
      testFontBtn.addEventListener('click', testFont);
      testFontInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') testFont();
      });
      
      // Initial render
      renderFonts();
      
      // Test Lobster Two on load as an example
      setTimeout(() => {
        testFontInput.value = 'Lobster Two';
        testFont();
      }, 1000);
    </script>
  `;
};
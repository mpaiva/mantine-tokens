export default {
  title: 'Documentation/JSON Export',
  parameters: {
    docs: {
      description: {
        component: 'View and copy raw JSON token data for all token categories'
      }
    }
  }
};

// Helper function to create JSON viewer
function createJSONViewer(title, description, jsonPath, sectionFilter = null) {
  const viewerId = `json-viewer-${Math.random().toString(36).substr(2, 9)}`;
  
  const html = `
    <div class="json-viewer-container">
      <div class="json-header">
        <h2>${title}</h2>
        <p>${description}</p>
      </div>
      
      <div class="json-toolbar">
        <button class="copy-btn" data-viewer-id="${viewerId}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy JSON
        </button>
        <button class="expand-btn" data-viewer-id="${viewerId}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          Expand All
        </button>
        <button class="collapse-btn" data-viewer-id="${viewerId}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          Collapse All
        </button>
      </div>
      
      <div class="json-content" id="${viewerId}">
        <div class="loading">Loading JSON...</div>
      </div>
    </div>
    
    <style>
      .json-viewer-container {
        padding: 1rem;
        font-family: var(--mantine-font-family-body);
        max-width: 1200px;
        margin: 0 auto;
      }
      
      .json-header {
        margin-bottom: 1.5rem;
      }
      
      .json-header h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--mantine-color-text-primary);
      }
      
      .json-header p {
        margin: 0;
        color: var(--mantine-color-text-secondary);
        font-size: 0.875rem;
      }
      
      .json-toolbar {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      
      .json-toolbar button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-sm);
        color: var(--mantine-color-text-primary);
        font-size: 0.875rem;
        font-family: inherit;
        cursor: pointer;
        transition: all 150ms ease;
      }
      
      .json-toolbar button:hover {
        background: var(--mantine-color-surface-hover);
        border-color: var(--mantine-color-border);
      }
      
      .json-content {
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
        padding: 1.5rem;
        overflow-x: auto;
        font-family: var(--mantine-font-family-mono);
        font-size: 0.875rem;
        line-height: 1.6;
      }
      
      .json-content pre {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
      }
      
      .loading {
        color: var(--mantine-color-text-secondary);
        text-align: center;
        padding: 2rem;
      }
      
      /* JSON Syntax Highlighting */
      .json-key {
        color: var(--mantine-color-blue-600);
        font-weight: 600;
      }
      
      .json-string {
        color: var(--mantine-color-green-600);
      }
      
      .json-number {
        color: var(--mantine-color-orange-600);
      }
      
      .json-boolean {
        color: var(--mantine-color-violet-600);
      }
      
      .json-null {
        color: var(--mantine-color-gray-600);
      }
      
      /* Dark mode adjustments */
      body[data-theme="dark"] .json-key {
        color: var(--mantine-color-blue-400);
      }
      
      body[data-theme="dark"] .json-string {
        color: var(--mantine-color-green-400);
      }
      
      body[data-theme="dark"] .json-number {
        color: var(--mantine-color-orange-400);
      }
      
      body[data-theme="dark"] .json-boolean {
        color: var(--mantine-color-violet-400);
      }
      
      body[data-theme="dark"] .json-null {
        color: var(--mantine-color-gray-400);
      }
      
      /* Collapsible sections */
      .json-section {
        margin-left: 1rem;
        border-left: 1px solid var(--mantine-color-border-subtle);
        padding-left: 1rem;
      }
      
      .json-toggle {
        cursor: pointer;
        user-select: none;
        display: inline-block;
        width: 1rem;
        text-align: center;
        color: var(--mantine-color-text-secondary);
      }
      
      .json-toggle:hover {
        color: var(--mantine-color-text-primary);
      }
      
      .json-collapsed .json-section {
        display: none;
      }
      
      .json-collapsed .json-toggle::before {
        content: '▶';
      }
      
      .json-expanded .json-toggle::before {
        content: '▼';
      }
      
      .copy-success {
        animation: copySuccess 1s ease;
      }
      
      @keyframes copySuccess {
        0% { background-color: var(--mantine-color-green-100); }
        100% { background-color: transparent; }
      }
    </style>
  `;
  
  // Load and display JSON after rendering
  setTimeout(async () => {
    try {
      const response = await fetch(jsonPath);
      const data = await response.json();
      const viewer = document.getElementById(viewerId);
      
      // Apply section filter if provided
      let displayData = data;
      if (sectionFilter) {
        displayData = sectionFilter(data);
      }
      
      // Format JSON with syntax highlighting
      const formattedJSON = formatJSON(displayData);
      viewer.innerHTML = `<pre>${formattedJSON}</pre>`;
      
      // Add event handlers
      setupEventHandlers(viewerId, displayData);
    } catch (error) {
      const viewer = document.getElementById(viewerId);
      viewer.innerHTML = `<div class="error">Error loading JSON: ${error.message}</div>`;
    }
  }, 100);
  
  return html;
}

// JSON formatter with syntax highlighting
function formatJSON(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  const nextIndent = indent + 1;
  const nextSpaces = '  '.repeat(nextIndent);
  
  if (obj === null) {
    return '<span class="json-null">null</span>';
  }
  
  if (typeof obj === 'boolean') {
    return `<span class="json-boolean">${obj}</span>`;
  }
  
  if (typeof obj === 'number') {
    return `<span class="json-number">${obj}</span>`;
  }
  
  if (typeof obj === 'string') {
    return `<span class="json-string">"${escapeHtml(obj)}"</span>`;
  }
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    
    let result = '[\n';
    obj.forEach((item, index) => {
      result += nextSpaces + formatJSON(item, nextIndent);
      if (index < obj.length - 1) result += ',';
      result += '\n';
    });
    result += spaces + ']';
    return result;
  }
  
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';
    
    let result = '{\n';
    keys.forEach((key, index) => {
      const formattedKey = `<span class="json-key">"${escapeHtml(key)}"</span>`;
      result += `${nextSpaces}${formattedKey}: ${formatJSON(obj[key], nextIndent)}`;
      if (index < keys.length - 1) result += ',';
      result += '\n';
    });
    result += spaces + '}';
    return result;
  }
  
  return String(obj);
}

// Escape HTML special characters
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Setup event handlers for the viewer
function setupEventHandlers(viewerId, data) {
  // Copy button
  const copyBtn = document.querySelector(`[data-viewer-id="${viewerId}"].copy-btn`);
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      copyBtn.classList.add('copy-success');
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = copyBtn.innerHTML.replace('Copy JSON', 'Copied!');
      setTimeout(() => {
        copyBtn.classList.remove('copy-success');
        copyBtn.innerHTML = originalText;
      }, 1000);
    });
  }
  
  // Expand/Collapse buttons (future enhancement)
  // These would require a more complex JSON renderer with collapsible sections
}

// Story definitions
export const Primitive = () => {
  return createJSONViewer(
    'Primitive Tokens',
    'Base design tokens including colors, typography, spacing, shadows, and border radius',
    '/json/mantine.primitive.tokens.json'
  );
};

export const Semantic = () => {
  const html = `
    <div class="semantic-container">
      <div class="theme-selector">
        <label>
          <input type="radio" name="theme" value="light" checked>
          Light Theme
        </label>
        <label>
          <input type="radio" name="theme" value="dark">
          Dark Theme
        </label>
      </div>
      <div id="semantic-viewer"></div>
    </div>
    
    <style>
      .semantic-container {
        padding: 1rem;
      }
      
      .theme-selector {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        padding: 1rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
      }
      
      .theme-selector label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.875rem;
        color: var(--mantine-color-text-primary);
      }
    </style>
  `;
  
  setTimeout(() => {
    const container = document.getElementById('semantic-viewer');
    const updateViewer = (theme) => {
      container.innerHTML = createJSONViewer(
        `Semantic Tokens - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
        'Theme-aware tokens that adapt to light/dark mode',
        `/json/mantine.semantic.${theme}.tokens.json`
      );
    };
    
    // Initial load
    updateViewer('light');
    
    // Theme switch handler
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        updateViewer(e.target.value);
      });
    });
  }, 100);
  
  return html;
};

export const Custom = () => {
  return createJSONViewer(
    'Custom Tokens',
    'Additional custom tokens for extended spacing, typography, and component variants',
    '/json/mantine.custom.tokens.json'
  );
};

export const Clearco = () => {
  const html = `
    <div class="brand-container">
      <div class="controls-row">
        <div class="theme-selector">
          <label>
            <input type="radio" name="clearco-theme" value="light" checked>
            Light Theme
          </label>
          <label>
            <input type="radio" name="clearco-theme" value="dark">
            Dark Theme
          </label>
        </div>
        <div class="view-selector">
          <label>
            <input type="checkbox" id="clearco-show-all" name="clearco-show-all">
            Show All Tokens (including typography, spacing, etc.)
          </label>
        </div>
      </div>
      <div id="clearco-viewer"></div>
    </div>
    
    <style>
      .brand-container {
        padding: 1rem;
      }
      
      .controls-row {
        display: flex;
        gap: 2rem;
        align-items: center;
        margin-bottom: 1rem;
        padding: 1rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: var(--mantine-radius-md);
      }
      
      .view-selector label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.875rem;
        color: var(--mantine-color-text-primary);
      }
    </style>
  `;
  
  setTimeout(() => {
    const container = document.getElementById('clearco-viewer');
    const updateViewer = () => {
      const theme = document.querySelector('input[name="clearco-theme"]:checked').value;
      const showAll = document.getElementById('clearco-show-all').checked;
      
      if (showAll) {
        container.innerHTML = createJSONViewer(
          `Clearco Brand Tokens - All Tokens`,
          'Complete set of Clearco brand tokens including typography, spacing, components, and more',
          `/json/clearco.all.tokens.json`
        );
      } else {
        container.innerHTML = createJSONViewer(
          `Clearco Brand Tokens - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
          'Clearco theme-specific tokens only',
          `/json/clearco.${theme}.tokens.json`
        );
      }
    };
    
    // Initial load
    updateViewer();
    
    // Event handlers
    document.querySelectorAll('input[name="clearco-theme"]').forEach(radio => {
      radio.addEventListener('change', updateViewer);
    });
    document.getElementById('clearco-show-all').addEventListener('change', updateViewer);
  }, 100);
  
  return html;
};

export const Firstwatch = () => {
  const html = `
    <div class="brand-container">
      <div class="controls-row">
        <div class="theme-selector">
          <label>
            <input type="radio" name="firstwatch-theme" value="light" checked>
            Light Theme
          </label>
          <label>
            <input type="radio" name="firstwatch-theme" value="dark">
            Dark Theme
          </label>
        </div>
        <div class="view-selector">
          <label>
            <input type="checkbox" id="firstwatch-show-all" name="firstwatch-show-all">
            Show All Tokens (including typography, spacing, etc.)
          </label>
        </div>
      </div>
      <div id="firstwatch-viewer"></div>
    </div>
  `;
  
  setTimeout(() => {
    const container = document.getElementById('firstwatch-viewer');
    const updateViewer = () => {
      const theme = document.querySelector('input[name="firstwatch-theme"]:checked').value;
      const showAll = document.getElementById('firstwatch-show-all').checked;
      
      if (showAll) {
        container.innerHTML = createJSONViewer(
          `Firstwatch Brand Tokens - All Tokens`,
          'Complete set of Firstwatch brand tokens including typography, spacing, components, and more',
          `/json/firstwatch.all.tokens.json`
        );
      } else {
        container.innerHTML = createJSONViewer(
          `Firstwatch Brand Tokens - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
          'Firstwatch theme-specific tokens only',
          `/json/firstwatch.${theme}.tokens.json`
        );
      }
    };
    
    // Initial load
    updateViewer();
    
    // Event handlers
    document.querySelectorAll('input[name="firstwatch-theme"]').forEach(radio => {
      radio.addEventListener('change', updateViewer);
    });
    document.getElementById('firstwatch-show-all').addEventListener('change', updateViewer);
  }, 100);
  
  return html;
};
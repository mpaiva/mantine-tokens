export default {
  title: 'Documentation/JSON Export',
  parameters: {
    docs: {
      description: {
        component: 'Enhanced JSON token viewer with search, filters, and visual previews'
      }
    }
  }
};

// Toast notification system
class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;
    
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        ${this.getIcon(type)}
        <span>${message}</span>
      </div>
    `;
    
    this.container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('toast-show'), 10);
    
    // Remove after duration
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  getIcon(type) {
    const icons = {
      success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg>',
      error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
      info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };
    return icons[type] || icons.info;
  }
}

// Enhanced JSON viewer with tree structure
class EnhancedJSONViewer {
  constructor(containerId, data, options = {}) {
    this.container = document.getElementById(containerId);
    this.data = data;
    this.filteredData = data;
    this.options = {
      searchable: true,
      filterable: true,
      showPreviews: true,
      collapsible: true,
      ...options
    };
    this.searchTerm = '';
    this.activeFilters = new Set();
    this.expandedNodes = new Set();
    this.toast = new ToastManager();
  }

  render() {
    this.container.innerHTML = `
      <div class="json-viewer-enhanced">
        ${this.renderControls()}
        <div class="json-stats">
          <span class="stat-item">Total tokens: <strong>${this.countTokens(this.filteredData)}</strong></span>
          <span class="stat-item">Filtered: <strong>${this.countTokens(this.filteredData)}/${this.countTokens(this.data)}</strong></span>
        </div>
        <div class="json-tree" id="json-tree-${this.container.id}">
          ${this.renderTree(this.filteredData)}
        </div>
      </div>
    `;
    
    this.attachEventListeners();
  }

  renderControls() {
    return `
      <div class="json-controls">
        <div class="search-container">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="text" class="search-input" placeholder="Search tokens..." value="${this.searchTerm}">
          ${this.searchTerm ? '<button class="clear-search">&times;</button>' : ''}
        </div>
        
        <div class="filter-container">
          ${this.renderFilters()}
        </div>
        
        <div class="action-buttons">
          <button class="btn-action" data-action="expand-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9l6 6 6-6"></path>
            </svg>
            Expand All
          </button>
          <button class="btn-action" data-action="collapse-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 15l-6-6-6 6"></path>
            </svg>
            Collapse All
          </button>
          <div class="dropdown">
            <button class="btn-action btn-export">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export
            </button>
            <div class="dropdown-menu">
              <button data-format="json">JSON</button>
              <button data-format="css">CSS Variables</button>
              <button data-format="scss">SCSS Variables</button>
              <button data-format="ts">TypeScript</button>
            </div>
          </div>
          <button class="btn-action" data-action="copy">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy JSON
          </button>
        </div>
      </div>
    `;
  }

  renderFilters() {
    const categories = this.extractCategories(this.data);
    return categories.map(cat => `
      <label class="filter-label">
        <input type="checkbox" value="${cat}" ${this.activeFilters.has(cat) ? 'checked' : ''}>
        <span>${cat}</span>
      </label>
    `).join('');
  }

  renderTree(obj, path = '', level = 0) {
    if (!obj || typeof obj !== 'object') {
      return this.renderLeaf(obj, path);
    }

    const entries = Object.entries(obj);
    if (entries.length === 0) return '<span class="empty">{ }</span>';

    return entries.map(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      const isExpanded = this.expandedNodes.has(currentPath) || level < 1;
      const hasChildren = value && typeof value === 'object' && Object.keys(value).length > 0;
      
      return `
        <div class="tree-node" data-path="${currentPath}" data-level="${level}">
          <div class="tree-node-header">
            ${hasChildren ? `
              <span class="tree-toggle ${isExpanded ? 'expanded' : 'collapsed'}" data-path="${currentPath}">
                ${isExpanded ? '▼' : '▶'}
              </span>
            ` : '<span class="tree-indent"></span>'}
            <span class="tree-key">${key}</span>
            ${this.renderPreview(key, value)}
            ${!hasChildren ? `<span class="tree-value">${this.renderLeaf(value, currentPath)}</span>` : ''}
          </div>
          ${hasChildren ? `
            <div class="tree-children ${isExpanded ? 'expanded' : 'collapsed'}">
              ${this.renderTree(value, currentPath, level + 1)}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  renderLeaf(value, path) {
    if (value === null) return '<span class="json-null">null</span>';
    if (typeof value === 'boolean') return `<span class="json-boolean">${value}</span>`;
    if (typeof value === 'number') return `<span class="json-number">${value}</span>`;
    if (typeof value === 'string') {
      // Check if it's a color
      if (value.match(/^#[0-9A-Fa-f]{3,8}$/)) {
        return `<span class="json-string">"${value}"</span>`;
      }
      return `<span class="json-string">"${this.escapeHtml(value)}"</span>`;
    }
    return String(value);
  }

  renderPreview(key, value) {
    if (!this.options.showPreviews) return '';
    
    // Color preview
    if (typeof value === 'string' && value.match(/^#[0-9A-Fa-f]{3,8}$/)) {
      return `<span class="preview-color" style="background-color: ${value}"></span>`;
    }
    
    // Font size preview
    if (key.toLowerCase().includes('fontsize') && typeof value === 'string') {
      return `<span class="preview-text" style="font-size: ${value}">Aa</span>`;
    }
    
    // Spacing preview
    if (key.toLowerCase().includes('spacing') || key.toLowerCase().includes('radius')) {
      return `<span class="preview-spacing" style="width: ${value}; height: ${value}"></span>`;
    }
    
    return '';
  }

  extractCategories(obj, categories = new Set(), path = '') {
    Object.entries(obj).forEach(([key, value]) => {
      const category = path.split('.')[0] || key;
      categories.add(category);
      
      if (value && typeof value === 'object') {
        this.extractCategories(value, categories, path ? `${path}.${key}` : key);
      }
    });
    
    return Array.from(categories).sort();
  }

  countTokens(obj) {
    if (!obj || typeof obj !== 'object') return 0;
    
    return Object.entries(obj).reduce((count, [key, value]) => {
      if (value && typeof value === 'object') {
        return count + this.countTokens(value);
      }
      return count + 1;
    }, 0);
  }

  filterData(data, searchTerm, filters) {
    if (!searchTerm && filters.size === 0) return data;
    
    const filtered = {};
    
    Object.entries(data).forEach(([key, value]) => {
      // Check filters
      if (filters.size > 0 && !filters.has(key)) return;
      
      // Check search
      if (searchTerm) {
        const matches = this.searchInObject(value, searchTerm, key);
        if (matches && Object.keys(matches).length > 0) {
          filtered[key] = matches;
        }
      } else {
        filtered[key] = value;
      }
    });
    
    return filtered;
  }

  searchInObject(obj, searchTerm, path = '') {
    if (!obj || typeof obj !== 'object') {
      const stringValue = String(obj).toLowerCase();
      const pathLower = path.toLowerCase();
      return (stringValue.includes(searchTerm.toLowerCase()) || pathLower.includes(searchTerm.toLowerCase())) ? obj : null;
    }
    
    const filtered = {};
    let hasMatches = false;
    
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      const result = this.searchInObject(value, searchTerm, currentPath);
      
      if (result !== null) {
        filtered[key] = result;
        hasMatches = true;
      }
    });
    
    return hasMatches ? filtered : null;
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  attachEventListeners() {
    // Search
    const searchInput = this.container.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value;
        this.updateView();
      });
    }

    // Clear search
    const clearBtn = this.container.querySelector('.clear-search');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.searchTerm = '';
        this.updateView();
      });
    }

    // Filters
    this.container.querySelectorAll('.filter-label input').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.activeFilters.add(e.target.value);
        } else {
          this.activeFilters.delete(e.target.value);
        }
        this.updateView();
      });
    });

    // Tree toggles
    this.container.querySelectorAll('.tree-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        const path = e.target.dataset.path;
        if (this.expandedNodes.has(path)) {
          this.expandedNodes.delete(path);
        } else {
          this.expandedNodes.add(path);
        }
        this.updateView();
      });
    });

    // Action buttons
    this.container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.closest('[data-action]').dataset.action;
        this.handleAction(action);
      });
    });

    // Export dropdown
    const exportBtn = this.container.querySelector('.btn-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = e.target.closest('.dropdown');
        dropdown.classList.toggle('open');
      });
    }

    // Export format buttons
    this.container.querySelectorAll('[data-format]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const format = e.target.dataset.format;
        this.export(format);
        e.target.closest('.dropdown').classList.remove('open');
      });
    });

    // Close dropdown on outside click
    document.addEventListener('click', () => {
      this.container.querySelectorAll('.dropdown.open').forEach(dropdown => {
        dropdown.classList.remove('open');
      });
    });
  }

  updateView() {
    this.filteredData = this.filterData(this.data, this.searchTerm, this.activeFilters);
    this.render();
  }

  handleAction(action) {
    switch (action) {
      case 'expand-all':
        this.expandAll();
        break;
      case 'collapse-all':
        this.collapseAll();
        break;
      case 'copy':
        this.copyToClipboard();
        break;
    }
  }

  expandAll() {
    const addPaths = (obj, path = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (value && typeof value === 'object' && Object.keys(value).length > 0) {
          this.expandedNodes.add(currentPath);
          addPaths(value, currentPath);
        }
      });
    };
    
    addPaths(this.filteredData);
    this.updateView();
  }

  collapseAll() {
    this.expandedNodes.clear();
    this.updateView();
  }

  copyToClipboard() {
    const json = JSON.stringify(this.filteredData, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      this.toast.show('JSON copied to clipboard!', 'success');
    }).catch(() => {
      this.toast.show('Failed to copy JSON', 'error');
    });
  }

  export(format) {
    let content = '';
    let filename = '';
    
    switch (format) {
      case 'json':
        content = JSON.stringify(this.filteredData, null, 2);
        filename = 'tokens.json';
        break;
      case 'css':
        content = this.convertToCSS(this.filteredData);
        filename = 'tokens.css';
        break;
      case 'scss':
        content = this.convertToSCSS(this.filteredData);
        filename = 'tokens.scss';
        break;
      case 'ts':
        content = this.convertToTypeScript(this.filteredData);
        filename = 'tokens.ts';
        break;
    }
    
    this.downloadFile(content, filename);
    this.toast.show(`Exported as ${format.toUpperCase()}`, 'success');
  }

  convertToCSS(obj, prefix = '--') {
    const lines = [];
    
    const traverse = (data, path = '') => {
      Object.entries(data).forEach(([key, value]) => {
        const varName = path ? `${path}-${key}` : key;
        
        if (value && typeof value === 'object' && !value.$value) {
          traverse(value, varName);
        } else {
          const finalValue = value.$value || value;
          lines.push(`  ${prefix}${varName}: ${finalValue};`);
        }
      });
    };
    
    lines.push(':root {');
    traverse(obj);
    lines.push('}');
    
    return lines.join('\n');
  }

  convertToSCSS(obj) {
    const lines = [];
    
    const traverse = (data, level = 0) => {
      const indent = '  '.repeat(level);
      
      Object.entries(data).forEach(([key, value]) => {
        if (value && typeof value === 'object' && !value.$value) {
          lines.push(`${indent}$${key}: (`);
          traverse(value, level + 1);
          lines.push(`${indent});`);
        } else {
          const finalValue = value.$value || value;
          lines.push(`${indent}$${key}: ${finalValue};`);
        }
      });
    };
    
    traverse(obj);
    return lines.join('\n');
  }

  convertToTypeScript(obj) {
    const lines = ['export const tokens = {'];
    
    const traverse = (data, level = 1) => {
      const indent = '  '.repeat(level);
      
      Object.entries(data).forEach(([key, value], index, array) => {
        const isLast = index === array.length - 1;
        
        if (value && typeof value === 'object' && !value.$value) {
          lines.push(`${indent}${key}: {`);
          traverse(value, level + 1);
          lines.push(`${indent}}${isLast ? '' : ','}`);
        } else {
          const finalValue = value.$value || value;
          const quotedValue = typeof finalValue === 'string' ? `'${finalValue}'` : finalValue;
          lines.push(`${indent}${key}: ${quotedValue}${isLast ? '' : ','}`);
        }
      });
    };
    
    traverse(obj);
    lines.push('} as const;');
    
    return lines.join('\n');
  }

  downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Story creator function
function createEnhancedViewer(title, description, jsonPath, options = {}) {
  const viewerId = `enhanced-viewer-${Math.random().toString(36).substr(2, 9)}`;
  
  const html = `
    <div class="enhanced-viewer-container">
      <div class="viewer-header">
        <h2>${title}</h2>
        <p>${description}</p>
      </div>
      <div id="${viewerId}" class="viewer-content">
        <div class="loading">Loading tokens...</div>
      </div>
    </div>
    
    <style>
      /* Toast styles */
      .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .toast {
        background: white;
        border-radius: 8px;
        padding: 12px 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 8px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
      }
      
      .toast-show {
        transform: translateX(0);
      }
      
      .toast-success {
        border-left: 4px solid #10b981;
      }
      
      .toast-error {
        border-left: 4px solid #ef4444;
      }
      
      .toast-info {
        border-left: 4px solid #3b82f6;
      }
      
      /* Enhanced viewer styles */
      .enhanced-viewer-container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }
      
      .viewer-header h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1.75rem;
        font-weight: 600;
      }
      
      .viewer-header p {
        margin: 0 0 2rem 0;
        color: var(--mantine-color-text-secondary);
      }
      
      .json-viewer-enhanced {
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: 12px;
        overflow: hidden;
      }
      
      .json-controls {
        padding: 1.5rem;
        background: var(--mantine-color-surface-hover);
        border-bottom: 1px solid var(--mantine-color-border-subtle);
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
      }
      
      .search-container {
        position: relative;
        flex: 1;
        min-width: 300px;
      }
      
      .search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--mantine-color-text-secondary);
      }
      
      .search-input {
        width: 100%;
        padding: 8px 40px 8px 36px;
        border: 1px solid var(--mantine-color-border);
        border-radius: 8px;
        font-size: 14px;
        background: white;
        transition: border-color 0.2s;
      }
      
      .search-input:focus {
        outline: none;
        border-color: var(--mantine-color-blue-500);
      }
      
      .clear-search {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        font-size: 20px;
        color: var(--mantine-color-text-secondary);
        cursor: pointer;
        padding: 4px 8px;
      }
      
      .filter-container {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      
      .filter-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 14px;
        color: var(--mantine-color-text-primary);
      }
      
      .action-buttons {
        display: flex;
        gap: 0.5rem;
      }
      
      .btn-action {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 8px 16px;
        background: white;
        border: 1px solid var(--mantine-color-border);
        border-radius: 8px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .btn-action:hover {
        background: var(--mantine-color-surface-hover);
        border-color: var(--mantine-color-border-hover);
      }
      
      .dropdown {
        position: relative;
      }
      
      .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 4px;
        background: white;
        border: 1px solid var(--mantine-color-border);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        min-width: 150px;
        display: none;
        z-index: 10;
      }
      
      .dropdown.open .dropdown-menu {
        display: block;
      }
      
      .dropdown-menu button {
        display: block;
        width: 100%;
        padding: 8px 16px;
        border: none;
        background: none;
        text-align: left;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.2s;
      }
      
      .dropdown-menu button:hover {
        background: var(--mantine-color-surface-hover);
      }
      
      .json-stats {
        padding: 1rem 1.5rem;
        background: var(--mantine-color-blue-50);
        display: flex;
        gap: 2rem;
        font-size: 14px;
        color: var(--mantine-color-text-secondary);
      }
      
      .stat-item strong {
        color: var(--mantine-color-text-primary);
        font-weight: 600;
      }
      
      .json-tree {
        padding: 1.5rem;
        font-family: var(--mantine-font-family-mono);
        font-size: 13px;
        line-height: 1.6;
        max-height: 600px;
        overflow-y: auto;
      }
      
      .tree-node {
        margin: 2px 0;
      }
      
      .tree-node-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 2px 0;
      }
      
      .tree-toggle {
        width: 16px;
        text-align: center;
        cursor: pointer;
        user-select: none;
        color: var(--mantine-color-text-secondary);
        font-size: 10px;
      }
      
      .tree-indent {
        width: 16px;
      }
      
      .tree-key {
        color: var(--mantine-color-blue-600);
        font-weight: 600;
      }
      
      .tree-value {
        margin-left: 0.5rem;
      }
      
      .tree-children {
        margin-left: 20px;
        border-left: 1px solid var(--mantine-color-border-subtle);
        padding-left: 12px;
        margin-top: 2px;
      }
      
      .tree-children.collapsed {
        display: none;
      }
      
      /* Token previews */
      .preview-color {
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 4px;
        border: 1px solid var(--mantine-color-border);
        vertical-align: middle;
      }
      
      .preview-text {
        display: inline-block;
        margin-left: 8px;
        padding: 2px 8px;
        background: var(--mantine-color-surface-hover);
        border-radius: 4px;
        font-family: var(--mantine-font-family-body);
      }
      
      .preview-spacing {
        display: inline-block;
        background: var(--mantine-color-blue-100);
        border: 1px dashed var(--mantine-color-blue-400);
        vertical-align: middle;
        min-width: 4px;
        min-height: 4px;
      }
      
      /* Syntax highlighting */
      .json-string { color: var(--mantine-color-green-600); }
      .json-number { color: var(--mantine-color-orange-600); }
      .json-boolean { color: var(--mantine-color-violet-600); }
      .json-null { color: var(--mantine-color-gray-600); }
      
      /* Dark mode */
      body[data-theme="dark"] .json-viewer-enhanced {
        background: var(--mantine-color-dark-800);
      }
      
      body[data-theme="dark"] .json-controls {
        background: var(--mantine-color-dark-700);
      }
      
      body[data-theme="dark"] .search-input,
      body[data-theme="dark"] .btn-action {
        background: var(--mantine-color-dark-600);
        border-color: var(--mantine-color-dark-400);
        color: var(--mantine-color-dark-50);
      }
      
      body[data-theme="dark"] .dropdown-menu {
        background: var(--mantine-color-dark-600);
        border-color: var(--mantine-color-dark-400);
      }
      
      body[data-theme="dark"] .json-stats {
        background: var(--mantine-color-dark-700);
      }
      
      body[data-theme="dark"] .tree-key { color: var(--mantine-color-blue-400); }
      body[data-theme="dark"] .json-string { color: var(--mantine-color-green-400); }
      body[data-theme="dark"] .json-number { color: var(--mantine-color-orange-400); }
      body[data-theme="dark"] .json-boolean { color: var(--mantine-color-violet-400); }
      body[data-theme="dark"] .json-null { color: var(--mantine-color-gray-400); }
      
      /* Dark mode for story controls */
      body[data-theme="dark"] .token-tabs,
      body[data-theme="dark"] .brand-tabs,
      body[data-theme="dark"] .view-options,
      body[data-theme="dark"] .theme-selector {
        background: var(--mantine-color-dark-700);
        border-color: var(--mantine-color-dark-400);
      }
      
      body[data-theme="dark"] .token-tab:hover,
      body[data-theme="dark"] .brand-tab:hover {
        background: var(--mantine-color-dark-600);
      }
      
      body[data-theme="dark"] .token-tab.active,
      body[data-theme="dark"] .brand-tab.active {
        background: var(--mantine-color-blue-600);
      }
      
      body[data-theme="dark"] .toast {
        background: var(--mantine-color-dark-700);
        color: var(--mantine-color-dark-50);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }
    </style>
  `;
  
  // Load and initialize viewer after rendering
  setTimeout(async () => {
    try {
      const response = await fetch(jsonPath);
      const data = await response.json();
      const viewer = new EnhancedJSONViewer(viewerId, data, options);
      viewer.render();
    } catch (error) {
      const container = document.getElementById(viewerId);
      container.innerHTML = `<div class="error">Error loading tokens: ${error.message}</div>`;
    }
  }, 100);
  
  return html;
}

// Story exports
export const MantineTokens = () => {
  const html = `
    <div class="token-selector-container">
      <div class="token-tabs">
        <button class="token-tab active" data-type="primitive">Primitive</button>
        <button class="token-tab" data-type="component">Components</button>
        <button class="token-tab" data-type="semantic">Semantic</button>
        <button class="token-tab" data-type="custom">Custom</button>
      </div>
      <div class="theme-selector" id="mantine-theme-selector" style="display: none;">
        <label>
          <input type="radio" name="mantine-theme" value="light" checked>
          Light Theme
        </label>
        <label>
          <input type="radio" name="mantine-theme" value="dark">
          Dark Theme
        </label>
      </div>
      <div id="mantine-viewer-container"></div>
    </div>
    
    <style>
      .token-selector-container {
        padding: 2rem;
      }
      
      .token-tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        background: var(--mantine-color-surface);
        padding: 0.5rem;
        border-radius: 12px;
        border: 1px solid var(--mantine-color-border-subtle);
      }
      
      .token-tab {
        padding: 0.75rem 1.5rem;
        background: transparent;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .token-tab:hover {
        background: var(--mantine-color-surface-hover);
      }
      
      .token-tab.active {
        background: var(--mantine-color-blue-500);
        color: white;
      }
      
      .theme-selector {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        padding: 1rem;
        background: var(--mantine-color-surface);
        border: 1px solid var(--mantine-color-border-subtle);
        border-radius: 12px;
      }
      
      .theme-selector label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 14px;
      }
    </style>
  `;
  
  setTimeout(() => {
    const container = document.getElementById('mantine-viewer-container');
    const themeSelector = document.getElementById('mantine-theme-selector');
    
    const loadTokens = (type) => {
      let path, title, description;
      
      // Show/hide theme selector for semantic tokens
      if (type === 'semantic') {
        themeSelector.style.display = 'flex';
        const theme = document.querySelector('input[name="mantine-theme"]:checked').value;
        path = `/json/mantine.semantic.${theme}.tokens.json`;
        title = `Mantine Semantic Tokens - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`;
        description = 'Theme-aware tokens that adapt to light/dark mode';
      } else {
        themeSelector.style.display = 'none';
        
        switch (type) {
          case 'primitive':
            path = '/json/mantine.primitive.tokens.json';
            title = 'Mantine Primitive Tokens';
            description = 'Base design tokens including colors, typography, spacing, shadows, and border radius';
            break;
          case 'component':
            path = '/json/mantine.component.tokens.json';
            title = 'Mantine Component Tokens';
            description = 'Component-specific tokens for buttons, cards, inputs, and more';
            break;
          case 'custom':
            path = '/json/mantine.custom.tokens.json';
            title = 'Mantine Custom Tokens';
            description = 'Extended tokens for custom components and additional design needs';
            break;
        }
      }
      
      container.innerHTML = createEnhancedViewer(title, description, path);
    };
    
    // Initial load
    loadTokens('primitive');
    
    // Tab handlers
    document.querySelectorAll('.token-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.token-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        loadTokens(e.target.dataset.type);
      });
    });
    
    // Theme selector handler
    document.querySelectorAll('input[name="mantine-theme"]').forEach(radio => {
      radio.addEventListener('change', () => {
        if (document.querySelector('.token-tab.active').dataset.type === 'semantic') {
          loadTokens('semantic');
        }
      });
    });
  }, 100);
  
  return html;
};

export const BrandTokens = () => {
  const html = `
    <div class="brand-selector-container">
      <div class="controls-section">
        <div class="brand-tabs">
          <button class="brand-tab active" data-brand="clearco">Clearco</button>
          <button class="brand-tab" data-brand="firstwatch">Firstwatch</button>
        </div>
        
        <div class="view-options">
          <div class="view-type">
            <label>
              <input type="radio" name="brand-view" value="all" checked>
              All Tokens
            </label>
            <label>
              <input type="radio" name="brand-view" value="theme">
              Theme Only
            </label>
          </div>
          
          <div class="theme-selector" id="brand-theme-selector" style="display: none;">
            <label>
              <input type="radio" name="brand-theme" value="light" checked>
              Light
            </label>
            <label>
              <input type="radio" name="brand-theme" value="dark">
              Dark
            </label>
          </div>
        </div>
      </div>
      
      <div id="brand-viewer-container"></div>
    </div>
    
    <style>
      .brand-selector-container {
        padding: 2rem;
      }
      
      .controls-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
      }
      
      .brand-tabs {
        display: flex;
        gap: 0.5rem;
        background: var(--mantine-color-surface);
        padding: 0.5rem;
        border-radius: 12px;
        border: 1px solid var(--mantine-color-border-subtle);
      }
      
      .brand-tab {
        padding: 0.75rem 1.5rem;
        background: transparent;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .brand-tab:hover {
        background: var(--mantine-color-surface-hover);
      }
      
      .brand-tab.active {
        background: var(--mantine-color-blue-500);
        color: white;
      }
      
      .view-options {
        display: flex;
        gap: 2rem;
        align-items: center;
        background: var(--mantine-color-surface);
        padding: 1rem;
        border-radius: 12px;
        border: 1px solid var(--mantine-color-border-subtle);
      }
      
      .view-type,
      .theme-selector {
        display: flex;
        gap: 1rem;
      }
      
      .view-options label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 14px;
      }
    </style>
  `;
  
  setTimeout(() => {
    const container = document.getElementById('brand-viewer-container');
    const themeSelector = document.getElementById('brand-theme-selector');
    
    const loadBrandTokens = () => {
      const brand = document.querySelector('.brand-tab.active').dataset.brand;
      const viewType = document.querySelector('input[name="brand-view"]:checked').value;
      
      let path, title, description;
      
      if (viewType === 'theme') {
        themeSelector.style.display = 'flex';
        const theme = document.querySelector('input[name="brand-theme"]:checked').value;
        path = `/json/${brand}.${theme}.tokens.json`;
        title = `${brand.charAt(0).toUpperCase() + brand.slice(1)} - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`;
        description = `${theme.charAt(0).toUpperCase() + theme.slice(1)} theme tokens for ${brand.charAt(0).toUpperCase() + brand.slice(1)} brand`;
      } else {
        themeSelector.style.display = 'none';
        path = `/json/${brand}.all.tokens.json`;
        title = `${brand.charAt(0).toUpperCase() + brand.slice(1)} - All Tokens`;
        description = 'Complete set of brand tokens including colors, typography, themes, and components';
      }
      
      container.innerHTML = createEnhancedViewer(title, description, path);
    };
    
    // Initial load
    loadBrandTokens();
    
    // Event handlers
    document.querySelectorAll('.brand-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.brand-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        loadBrandTokens();
      });
    });
    
    document.querySelectorAll('input[name="brand-view"]').forEach(radio => {
      radio.addEventListener('change', loadBrandTokens);
    });
    
    document.querySelectorAll('input[name="brand-theme"]').forEach(radio => {
      radio.addEventListener('change', loadBrandTokens);
    });
  }, 100);
  
  return html;
};

export const SharedTokens = () => {
  return createEnhancedViewer(
    'Shared Brand Tokens',
    'Common tokens shared across all brands including base values and semantic patterns',
    '/json/_shared.all.tokens.json'
  );
};
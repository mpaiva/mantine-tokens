/**
 * Dynamic Theme Switcher for Multibrand Design System
 * Supports runtime switching of brands and themes
 */

class ThemeSwitcher {
  constructor(options = {}) {
    this.options = {
      basePath: options.basePath || '/build/brands',
      defaultBrand: options.defaultBrand || 'clearco',
      defaultTheme: options.defaultTheme || 'light',
      autoDetectPreference: options.autoDetectPreference !== false,
      persistPreference: options.persistPreference !== false,
      transitionDuration: options.transitionDuration || 250,
      onBrandChange: options.onBrandChange || null,
      onThemeChange: options.onThemeChange || null,
      ...options
    };

    this.currentBrand = this.options.defaultBrand;
    this.currentTheme = this.options.defaultTheme;
    this.loadedBrands = new Set();
    this.styleElements = new Map();

    this.init();
  }

  init() {
    // Load saved preferences
    if (this.options.persistPreference) {
      const savedBrand = localStorage.getItem('preferred-brand');
      const savedTheme = localStorage.getItem('preferred-theme');
      
      if (savedBrand) this.currentBrand = savedBrand;
      if (savedTheme) this.currentTheme = savedTheme;
    }

    // Auto-detect system theme preference
    if (this.options.autoDetectPreference && !localStorage.getItem('preferred-theme')) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.currentTheme = 'dark';
      }
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (this.options.autoDetectPreference && !localStorage.getItem('theme-override')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }

    // Apply initial brand and theme
    this.loadBrand(this.currentBrand).then(() => {
      this.setTheme(this.currentTheme);
    });
  }

  /**
   * Load brand stylesheets dynamically
   */
  async loadBrand(brandName) {
    if (this.loadedBrands.has(brandName)) {
      this.activateBrand(brandName);
      return;
    }

    const stylesheets = [
      `${brandName}/colors.css`,
      `${brandName}/theme-light.css`,
      `${brandName}/theme-dark.css`
    ];

    try {
      // Remove all non-active brand stylesheets
      this.styleElements.forEach((elements, brand) => {
        if (brand !== brandName) {
          elements.forEach(el => el.disabled = true);
        }
      });

      const brandElements = [];

      for (const stylesheet of stylesheets) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${this.options.basePath}/${stylesheet}`;
        link.setAttribute('data-brand', brandName);
        link.setAttribute('data-theme-switcher', 'true');
        
        // Wait for stylesheet to load
        await new Promise((resolve, reject) => {
          link.onload = resolve;
          link.onerror = () => reject(new Error(`Failed to load ${stylesheet}`));
          document.head.appendChild(link);
        });

        brandElements.push(link);
      }

      this.styleElements.set(brandName, brandElements);
      this.loadedBrands.add(brandName);
      this.currentBrand = brandName;

      // Save preference
      if (this.options.persistPreference) {
        localStorage.setItem('preferred-brand', brandName);
      }

      // Trigger callback
      if (this.options.onBrandChange) {
        this.options.onBrandChange(brandName);
      }

    } catch (error) {
      console.error(`Failed to load brand ${brandName}:`, error);
      throw error;
    }
  }

  /**
   * Activate a previously loaded brand
   */
  activateBrand(brandName) {
    if (!this.loadedBrands.has(brandName)) {
      throw new Error(`Brand ${brandName} not loaded`);
    }

    // Disable all brand stylesheets
    this.styleElements.forEach((elements, brand) => {
      elements.forEach(el => el.disabled = brand !== brandName);
    });

    this.currentBrand = brandName;

    // Save preference
    if (this.options.persistPreference) {
      localStorage.setItem('preferred-brand', brandName);
    }

    // Trigger callback
    if (this.options.onBrandChange) {
      this.options.onBrandChange(brandName);
    }
  }

  /**
   * Switch between light and dark themes
   */
  setTheme(theme) {
    const validThemes = ['light', 'dark'];
    if (!validThemes.includes(theme)) {
      throw new Error(`Invalid theme: ${theme}. Must be 'light' or 'dark'`);
    }

    // Add transition class for smooth theme switching
    document.body.style.transition = `background-color ${this.options.transitionDuration}ms ease, color ${this.options.transitionDuration}ms ease`;
    
    // Remove all theme classes and add the selected one
    document.body.classList.remove(...validThemes.map(t => `theme-${t}`));
    document.body.classList.add(`theme-${theme}`);

    this.currentTheme = theme;

    // Save preference
    if (this.options.persistPreference) {
      localStorage.setItem('preferred-theme', theme);
      localStorage.setItem('theme-override', 'true');
    }

    // Trigger callback
    if (this.options.onThemeChange) {
      this.options.onThemeChange(theme);
    }

    // Remove transition after completion
    setTimeout(() => {
      document.body.style.transition = '';
    }, this.options.transitionDuration);
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
  }

  /**
   * Get current brand and theme
   */
  getCurrent() {
    return {
      brand: this.currentBrand,
      theme: this.currentTheme
    };
  }

  /**
   * Get all loaded brands
   */
  getLoadedBrands() {
    return Array.from(this.loadedBrands);
  }

  /**
   * Preload multiple brands
   */
  async preloadBrands(brands) {
    const promises = brands.map(brand => this.loadBrand(brand));
    await Promise.all(promises);
  }

  /**
   * Reset to system preferences
   */
  resetToSystemPreference() {
    localStorage.removeItem('preferred-theme');
    localStorage.removeItem('theme-override');
    
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setTheme(prefersDark ? 'dark' : 'light');
  }

  /**
   * Clean up and remove all injected stylesheets
   */
  destroy() {
    this.styleElements.forEach(elements => {
      elements.forEach(el => el.remove());
    });
    
    this.styleElements.clear();
    this.loadedBrands.clear();
    
    // Remove theme class
    document.body.classList.remove(`theme-${this.currentTheme}`);
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeSwitcher;
}
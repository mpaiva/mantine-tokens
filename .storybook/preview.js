/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: ['light', 'dark'],
        showName: true,
      },
    },
    brand: {
      name: 'Brand',
      description: 'Brand tokens to use',
      defaultValue: 'mantine',
      toolbar: {
        icon: 'paintbrush',
        items: ['mantine', 'clearco', 'firstwatch'],
        showName: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      // Ensure DOM is ready
      if (typeof document !== 'undefined') {
        const theme = context.globals.theme || 'light';
        const brand = context.globals.brand || 'mantine';
        
        // Update theme using the correct attribute
        document.documentElement.setAttribute('data-mantine-color-scheme', theme);
        document.body.setAttribute('data-theme', theme);
        
        // Load appropriate CSS file based on theme
        let themeLink = document.getElementById('theme-styles');
        if (themeLink) {
          themeLink.href = `/css/theme-${theme}.css`;
        }
        
        // Update brand
        document.body.setAttribute('data-brand', brand);
        
        // Sync brand with localStorage for manager
        localStorage.setItem('storybook-brand', brand);
        
        // Send message to parent frame (manager) about brand change
        if (window.parent !== window) {
          window.parent.postMessage({
            type: 'brand-change',
            brand: brand
          }, '*');
        }
        
        // Load brand-specific CSS
        let brandLink = document.getElementById('brand-styles');
        let brandOverrideLink = document.getElementById('brand-overrides');
        
        if (brand !== 'mantine') {
          // Load brand tokens
          if (!brandLink) {
            brandLink = document.createElement('link');
            brandLink.id = 'brand-styles';
            brandLink.rel = 'stylesheet';
            document.head.appendChild(brandLink);
          }
          brandLink.href = `/brands/${brand}/all.css`;
          
          // Load brand overrides
          if (!brandOverrideLink) {
            brandOverrideLink = document.createElement('link');
            brandOverrideLink.id = 'brand-overrides';
            brandOverrideLink.rel = 'stylesheet';
            document.head.appendChild(brandOverrideLink);
          }
          brandOverrideLink.href = `/.storybook/brand-overrides-${brand}.css`;
        } else {
          // Remove brand files when switching back to Mantine
          if (brandLink) {
            brandLink.remove();
          }
          if (brandOverrideLink) {
            brandOverrideLink.remove();
          }
        }
      }
      
      return Story();
    },
  ],
};

export default preview;
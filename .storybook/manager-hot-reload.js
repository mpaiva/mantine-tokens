/**
 * Hot reload handler for Storybook manager
 * Listens for token changes and updates the manager theme dynamically
 */

// Create WebSocket connection to Vite HMR
function setupHotReload() {
  if (typeof window === 'undefined') return;
  
  // Connect to Vite's WebSocket for HMR
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host = window.location.host;
  const socket = new WebSocket(`${protocol}://${host}`, 'vite-hmr');
  
  let reconnectTimer = null;
  
  socket.addEventListener('open', () => {
    console.log('[Manager HMR] Connected to Vite HMR');
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  });
  
  socket.addEventListener('message', async (event) => {
    const message = JSON.parse(event.data);
    
    // Handle manager theme updates
    if (message.type === 'custom' && message.event === 'manager-theme-update') {
      console.log('[Manager HMR] Typography update detected:', message.data);
      
      const currentBrand = localStorage.getItem('storybook-brand') || 'mantine';
      const updateBrand = message.data.brand === 'current' ? currentBrand : message.data.brand;
      
      // Only update if it's for the current brand
      if (updateBrand === currentBrand) {
        await refreshManagerTheme(currentBrand);
      }
    }
    
    // Handle manager theme refresh after build
    if (message.type === 'custom' && message.event === 'manager-theme-refresh') {
      console.log('[Manager HMR] Theme refresh after build:', message.data);
      
      const currentBrand = localStorage.getItem('storybook-brand') || 'mantine';
      
      // Only refresh if it's for the current brand
      if (message.data.brand === currentBrand) {
        await refreshManagerTheme(currentBrand);
      }
    }
  });
  
  socket.addEventListener('close', () => {
    console.log('[Manager HMR] Connection closed, attempting reconnect...');
    // Attempt to reconnect after 1 second
    reconnectTimer = setTimeout(() => setupHotReload(), 1000);
  });
  
  socket.addEventListener('error', (error) => {
    console.error('[Manager HMR] WebSocket error:', error);
  });
}

// Function to refresh the manager theme
async function refreshManagerTheme(brand) {
  console.log(`[Manager HMR] Refreshing theme for brand: ${brand}`);
  
  try {
    // Remove cached brand CSS
    const existingBrandLink = document.querySelector(`link[href*="/brands/${brand}/"]`);
    if (existingBrandLink) {
      existingBrandLink.remove();
    }
    
    // Re-add brand CSS with cache-busting parameter
    const newLink = document.createElement('link');
    newLink.rel = 'stylesheet';
    newLink.href = `/brands/${brand}/all.css?t=${Date.now()}`;
    document.head.appendChild(newLink);
    
    // Wait for CSS to load
    await new Promise((resolve, reject) => {
      newLink.onload = resolve;
      newLink.onerror = reject;
      setTimeout(resolve, 500); // Fallback timeout
    });
    
    // Trigger theme update in manager.js
    if (window.__updateManagerTheme) {
      await window.__updateManagerTheme(brand);
    }
    
    // Update CSS variables in manager
    if (window.__applyDynamicFonts) {
      window.__applyDynamicFonts(brand);
    }
    
    console.log(`[Manager HMR] Theme refreshed for ${brand}`);
  } catch (error) {
    console.error('[Manager HMR] Failed to refresh theme:', error);
  }
}

// Setup hot reload when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupHotReload);
} else {
  setupHotReload();
}

// Export for global access
window.__refreshManagerTheme = refreshManagerTheme;
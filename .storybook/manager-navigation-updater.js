/**
 * Manager Navigation Updater
 * Simplified updater that relies on CSS variables
 */

(function() {
  // Function to ensure brand attribute is applied
  function updateBrandAttribute() {
    const brand = localStorage.getItem('storybook-brand') || 'mantine';
    document.documentElement.setAttribute('data-brand', brand);
    
    // Force style recalculation
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  }

  // Update on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateBrandAttribute);
  } else {
    updateBrandAttribute();
  }

  // Update on brand change
  window.addEventListener('storage', (e) => {
    if (e.key === 'storybook-brand') {
      updateBrandAttribute();
    }
  });

  // Also listen for custom brand change events
  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'brand-change' && e.data.brand) {
      updateBrandAttribute();
    }
  });
})();
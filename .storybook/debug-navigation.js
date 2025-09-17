// Debug script to check navigation state
(function() {
  console.log('=== Navigation Debug Info ===');
  
  // Check brand attribute
  const brand = document.documentElement.getAttribute('data-brand');
  console.log('Current brand:', brand);
  
  // Check for navigation elements
  const navButtons = document.querySelectorAll('button');
  console.log('Total buttons found:', navButtons.length);
  
  // Check for selected items
  const selectedItems = document.querySelectorAll('[data-selected="true"]');
  console.log('Selected items:', selectedItems.length);
  
  // Check if manager styles are loaded
  const managerStyles = document.querySelector('link[href*="manager-styles.css"]');
  console.log('Manager styles loaded:', !!managerStyles);
  
  // Check computed styles on a navigation button
  if (navButtons.length > 0) {
    const firstButton = navButtons[0];
    const styles = getComputedStyle(firstButton);
    console.log('First button styles:', {
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      fontFamily: styles.fontFamily
    });
  }
  
  // Check for Storybook navigation structure
  const sidebarItems = document.querySelectorAll('[role="navigation"] button, [role="tree"] button');
  console.log('Sidebar navigation buttons:', sidebarItems.length);
  
  // Log any error messages
  const errors = document.querySelectorAll('.error, [class*="error"]');
  if (errors.length > 0) {
    console.log('Error elements found:', errors);
  }
  
  console.log('=== End Debug Info ===');
})();
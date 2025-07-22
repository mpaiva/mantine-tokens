// Token Status Indicator Component
export function createTokenStatusIndicator() {
  const indicatorId = 'token-status-indicator';
  
  // Remove existing indicator if present
  const existing = document.getElementById(indicatorId);
  if (existing) {
    existing.remove();
  }

  // Create indicator element
  const indicator = document.createElement('div');
  indicator.id = indicatorId;
  indicator.innerHTML = `
    <div class="token-status-content">
      <span class="token-status-icon">🎨</span>
      <span class="token-status-text">Tokens: Ready</span>
      <span class="token-status-time"></span>
    </div>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #token-status-indicator {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px 16px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      z-index: 9999;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }
    
    .token-status-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .token-status-icon {
      font-size: 16px;
    }
    
    .token-status-text {
      font-weight: 500;
    }
    
    .token-status-time {
      opacity: 0.7;
      font-size: 11px;
    }
    
    #token-status-indicator.building {
      background: rgba(59, 130, 246, 0.9);
    }
    
    #token-status-indicator.building .token-status-icon {
      animation: spin 1s linear infinite;
    }
    
    #token-status-indicator.success {
      background: rgba(34, 197, 94, 0.9);
    }
    
    #token-status-indicator.error {
      background: rgba(239, 68, 68, 0.9);
    }
    
    #token-status-indicator.warning {
      background: rgba(251, 191, 36, 0.9);
    }
    
    #token-status-indicator.info {
      background: rgba(99, 102, 241, 0.9);
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    #token-status-indicator.show {
      animation: fadeIn 0.3s ease;
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(indicator);
  
  return {
    update(status, message, timestamp) {
      const textElement = indicator.querySelector('.token-status-text');
      const timeElement = indicator.querySelector('.token-status-time');
      const iconElement = indicator.querySelector('.token-status-icon');
      
      // Update status
      indicator.className = '';
      indicator.classList.add(status, 'show');
      
      // Update text
      textElement.textContent = message || `Tokens: ${status}`;
      
      // Update icon
      switch(status) {
        case 'building':
          iconElement.textContent = '⚙️';
          break;
        case 'success':
          iconElement.textContent = '✅';
          break;
        case 'error':
          iconElement.textContent = '❌';
          break;
        case 'warning':
          iconElement.textContent = '⚠️';
          break;
        case 'info':
          iconElement.textContent = 'ℹ️';
          break;
        default:
          iconElement.textContent = '🎨';
      }
      
      // Update timestamp
      if (timestamp) {
        const time = new Date(timestamp);
        timeElement.textContent = time.toLocaleTimeString();
      }
      
      // Auto-hide success messages after 3 seconds
      if (status === 'success') {
        setTimeout(() => {
          indicator.style.opacity = '0.3';
        }, 3000);
      }
    },
    
    remove() {
      indicator.remove();
      style.remove();
    }
  };
}

// Listen for token update events
if (import.meta.hot) {
  let statusIndicator;
  
  // Initialize indicator
  if (typeof window !== 'undefined') {
    statusIndicator = createTokenStatusIndicator();
  }
  
  // Listen for custom token update events
  import.meta.hot.on('token-update', (data) => {
    if (statusIndicator) {
      statusIndicator.update('building', 'Rebuilding tokens...', Date.now());
      
      // Simulate build completion (in real scenario, this would come from the build process)
      setTimeout(() => {
        statusIndicator.update('success', 'Tokens updated!', Date.now());
      }, 1000);
    }
  });

  // Listen for source token changes
  import.meta.hot.on('token-source-changed', (data) => {
    if (statusIndicator) {
      const fileName = data.file.split('/').pop();
      
      if (data.isBrandToken && data.brand) {
        const currentBrand = document.body.getAttribute('data-brand');
        if (currentBrand === data.brand) {
          statusIndicator.update('building', `Rebuilding ${data.brand} tokens...`, Date.now());
          console.log(`[Token Reload] Brand '${data.brand}' token changed. Rebuilding automatically...`);
          
          // Expect reload within 3 seconds
          setTimeout(() => {
            const currentText = document.querySelector('.token-status-text')?.textContent;
            if (currentText?.includes('Rebuilding')) {
              statusIndicator.update('info', `Waiting for ${data.brand} rebuild...`, Date.now());
            }
          }, 1500);
        } else {
          statusIndicator.update('info', `${data.brand} tokens changed`, Date.now());
        }
      } else {
        statusIndicator.update('error', `Token file changed: ${fileName}. Please rebuild tokens.`, Date.now());
        console.warn(`[Token Reload] Source token file changed: ${data.file}`);
        console.warn(`[Token Reload] Run the appropriate build command:`);
        console.warn(`[Token Reload] - For brand tokens: npm run build:brands`);
        console.warn(`[Token Reload] - For all tokens: npm run build:all`);
      }
    }
  });
}
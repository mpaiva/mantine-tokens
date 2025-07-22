import { createServer } from 'vite';
import chokidar from 'chokidar';
import path from 'path';

/**
 * Vite plugin that watches token build output and triggers HMR updates
 */
export function tokenReloadPlugin() {
  let server;
  
  // Track pending rebuilds
  const pendingRebuilds = new Map(); // sourceFile -> { timestamp, resolved }
  const rebuildTimeout = 3000; // Max wait time for rebuild
  
  // Debounce timers
  const reloadDebounceTimers = new Map();
  const debounceDelay = 300; // Wait 300ms after last change before reloading

  return {
    name: 'vite-plugin-token-reload',
    
    configureServer(_server) {
      server = _server;
      
      // Watch both source tokens and build directory for changes
      const buildPath = path.resolve(process.cwd(), 'build');
      const tokensPath = path.resolve(process.cwd(), 'tokens');
      
      // Watch build outputs
      const buildWatcher = chokidar.watch([
        `${buildPath}/css/**/*.css`,
        `${buildPath}/json/**/*.json`,
        `${buildPath}/brands/**/*.css`,
        `${buildPath}/custom/**/*.css`
      ], {
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 200,
          pollInterval: 100
        }
      });

      buildWatcher.on('change', (filePath) => {
        const relativePath = path.relative(process.cwd(), filePath);
        console.log(`[Token Reload] Build output changed: ${relativePath}`);
        
        // Clear any existing debounce timer for this file
        if (reloadDebounceTimers.has(filePath)) {
          clearTimeout(reloadDebounceTimers.get(filePath));
        }
        
        // Check if this change resolves a pending rebuild
        const isBrandToken = filePath.includes('/brands/');
        if (isBrandToken && filePath.endsWith('.css')) {
          const brandMatch = filePath.match(/\/brands\/([^\/]+)\//);
          if (brandMatch) {
            const brand = brandMatch[1];
            // Mark any pending rebuilds for this brand as resolved
            for (const [sourceFile, rebuild] of pendingRebuilds.entries()) {
              if (sourceFile.includes(`/brands/${brand}/`) && !rebuild.resolved) {
                rebuild.resolved = true;
                console.log(`[Token Reload] Brand '${brand}' rebuild completed`);
              }
            }
          }
        }
        
        // Debounce the reload to wait for all files to be written
        const timer = setTimeout(() => {
          // For CSS files, trigger HMR update
          if (filePath.endsWith('.css')) {
            console.log(`[Token Reload] Triggering reload for ${relativePath}`);
            
            // Check if this is a brand CSS file
            const brandMatch = filePath.match(/\/brands\/([^\/]+)\//);
            if (brandMatch) {
              // Send manager theme refresh for brand changes
              server.ws.send({
                type: 'custom',
                event: 'manager-theme-refresh',
                data: {
                  brand: brandMatch[1],
                  timestamp: Date.now()
                }
              });
            }
            
            server.ws.send({
              type: 'full-reload',
              path: '*'
            });
            
            // Clean up old pending rebuilds
            const now = Date.now();
            for (const [file, rebuild] of pendingRebuilds.entries()) {
              if (now - rebuild.timestamp > rebuildTimeout) {
                pendingRebuilds.delete(file);
              }
            }
          }
          
          // For JSON files, also trigger reload
          if (filePath.endsWith('.json')) {
            server.ws.send({
              type: 'full-reload',
              path: '*'
            });
          }
          
          reloadDebounceTimers.delete(filePath);
        }, debounceDelay);
        
        reloadDebounceTimers.set(filePath, timer);
      });

      // Watch source token files and trigger rebuild message
      const sourceWatcher = chokidar.watch([
        `${tokensPath}/**/*.json`,
        `${tokensPath}/_prefix.json`,
        `${tokensPath}/_custom-prefix.json`,
        `${tokensPath}/brands/**/*.json`  // Explicitly watch brand tokens
      ], {
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 200,
          pollInterval: 100
        }
      });

      sourceWatcher.on('change', (filePath) => {
        const relativePath = path.relative(process.cwd(), filePath);
        console.log(`[Token Reload] Source token changed: ${relativePath}`);
        
        // Check if this is a brand token
        const isBrandToken = filePath.includes('/brands/');
        const brandMatch = filePath.match(/\/brands\/([^\/]+)\//);
        
        if (isBrandToken && brandMatch) {
          const brand = brandMatch[1];
          console.log(`[Token Reload] Brand '${brand}' token source updated - rebuild starting...`);
          
          // Track this pending rebuild
          pendingRebuilds.set(filePath, {
            timestamp: Date.now(),
            resolved: false,
            brand: brand
          });
          
          // Set a timeout to check if rebuild completes
          setTimeout(() => {
            const rebuild = pendingRebuilds.get(filePath);
            if (rebuild && !rebuild.resolved) {
              console.warn(`[Token Reload] Warning: Rebuild for ${brand} may not have completed after ${rebuildTimeout}ms`);
              // Force a reload anyway
              server.ws.send({
                type: 'full-reload',
                path: '*'
              });
              pendingRebuilds.delete(filePath);
            }
          }, rebuildTimeout);
        }
        
        // Send notification that tokens need rebuilding
        server.ws.send({
          type: 'custom',
          event: 'token-source-changed',
          data: {
            file: relativePath,
            timestamp: Date.now(),
            needsRebuild: true,
            isBrandToken,
            brand: brandMatch?.[1]
          }
        });
        
        // If this is a typography token change, notify manager to update theme
        if (filePath.includes('typography.json')) {
          server.ws.send({
            type: 'custom',
            event: 'manager-theme-update',
            data: {
              file: relativePath,
              brand: brandMatch?.[1] || 'current',
              updateType: 'typography'
            }
          });
        }
      });

      // Cleanup on server close
      server.httpServer?.once('close', () => {
        buildWatcher.close();
        sourceWatcher.close();
        
        // Clear all debounce timers
        for (const timer of reloadDebounceTimers.values()) {
          clearTimeout(timer);
        }
        reloadDebounceTimers.clear();
        pendingRebuilds.clear();
      });
    },

    handleHotUpdate({ file, server }) {
      // Handle updates to token source files
      if (file.includes('/tokens/') && (file.endsWith('.json') || file.endsWith('.css'))) {
        console.log(`[Token Reload] Source file changed: ${path.relative(process.cwd(), file)}`);
        
        // Send custom event to client
        server.ws.send({
          type: 'custom',
          event: 'token-update',
          data: {
            file: file,
            timestamp: Date.now()
          }
        });

        return [];
      }
    }
  };
}
import StyleDictionary from 'style-dictionary';
import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { TransformStream } from 'stream/web';

// Dynamic import for chalk
const chalk = await import('chalk').then(m => m.default);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.timers = new Map();
    this.metrics = new Map();
  }

  start(name) {
    this.timers.set(name, process.hrtime.bigint());
  }

  end(name) {
    if (!this.timers.has(name)) return;
    const start = this.timers.get(name);
    const duration = Number(process.hrtime.bigint() - start) / 1_000_000; // Convert to ms
    this.metrics.set(name, duration);
    this.timers.delete(name);
    return duration;
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  printSummary() {
    console.log(chalk.cyan('\n📊 Performance Summary:'));
    for (const [name, duration] of this.metrics) {
      console.log(chalk.gray(`  ${name}: ${duration.toFixed(2)}ms`));
    }
    const total = Array.from(this.metrics.values()).reduce((a, b) => a + b, 0);
    console.log(chalk.green(`  Total: ${total.toFixed(2)}ms`));
  }
}

// Cache manager
class CacheManager {
  constructor(cacheDir = '.cache/figma-tokens') {
    this.cacheDir = path.join(__dirname, cacheDir);
    this.cacheIndex = new Map();
  }

  async initialize() {
    await fs.mkdir(this.cacheDir, { recursive: true });
    await this.loadIndex();
  }

  async loadIndex() {
    const indexPath = path.join(this.cacheDir, 'index.json');
    if (existsSync(indexPath)) {
      try {
        const data = await fs.readFile(indexPath, 'utf-8');
        const index = JSON.parse(data);
        this.cacheIndex = new Map(Object.entries(index));
      } catch (error) {
        console.warn(chalk.yellow('⚠️  Cache index corrupted, rebuilding...'));
        this.cacheIndex = new Map();
      }
    }
  }

  async saveIndex() {
    const indexPath = path.join(this.cacheDir, 'index.json');
    const index = Object.fromEntries(this.cacheIndex);
    await fs.writeFile(indexPath, JSON.stringify(index, null, 2));
  }

  generateHash(content) {
    return crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex').slice(0, 12);
  }

  async get(key) {
    const cacheEntry = this.cacheIndex.get(key);
    if (!cacheEntry) return null;

    const cachePath = path.join(this.cacheDir, `${cacheEntry.hash}.json`);
    if (!existsSync(cachePath)) {
      this.cacheIndex.delete(key);
      return null;
    }

    try {
      const data = await fs.readFile(cachePath, 'utf-8');
      const cached = JSON.parse(data);
      
      // Check if cache is still valid (24 hours)
      if (Date.now() - cached.timestamp > 24 * 60 * 60 * 1000) {
        await fs.unlink(cachePath);
        this.cacheIndex.delete(key);
        return null;
      }

      return cached.data;
    } catch (error) {
      return null;
    }
  }

  async set(key, data) {
    const hash = this.generateHash(data);
    const cachePath = path.join(this.cacheDir, `${hash}.json`);
    
    const cacheData = {
      timestamp: Date.now(),
      data
    };

    await fs.writeFile(cachePath, JSON.stringify(cacheData));
    this.cacheIndex.set(key, { hash, timestamp: Date.now() });
    await this.saveIndex();
  }

  async clear() {
    const files = await fs.readdir(this.cacheDir);
    await Promise.all(
      files.filter(f => f.endsWith('.json')).map(f => fs.unlink(path.join(this.cacheDir, f)))
    );
    this.cacheIndex.clear();
    await this.saveIndex();
  }
}

// Create optimized build function
async function buildFigmaTokensOptimized(options = {}) {
  const monitor = new PerformanceMonitor();
  const cache = new CacheManager();
  
  monitor.start('total');
  monitor.start('initialization');

  console.log(chalk.cyan('🚀 Starting optimized Figma token build...'));

  // Initialize cache
  if (!options.noCache) {
    await cache.initialize();
  }

  monitor.end('initialization');

  // Helper function to capitalize
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Map token reference to unified structure
  function mapTokenReference(value, filePath) {
    if (typeof value !== 'string' || !value.includes('{')) return value;

    return value.replace(/\{([^}]+)\}/g, (match, ref) => {
      // Color references
      if (match.startsWith('{color.') || match.startsWith('{colors.')) {
        const refPath = match.slice(1, -1);
        const parts = refPath.split('.');
        
        // Handle special color cases
        if (parts.length === 2) {
          const [_, colorName] = parts;
          if (colorName === 'white') {
            return `{Primitives.Color.white}`;
          }
          if (colorName === 'black') {
            return `{Primitives.Color.black}`;
          }
        }
        
        if (parts.length === 3) {
          const [_, colorName, shade] = parts;
          // Keep color names lowercase as they are in the source
          return `{Primitives.Color.${colorName}.${shade}}`;
        }
      }

      // Spacing references
      if (match.startsWith('{spacing.')) {
        const spacingKey = match.slice(9, -1);
        return `{Primitives.Spacing.${spacingKey}}`;
      }

      // Shadow references
      if (match.startsWith('{shadow.')) {
        const shadowKey = match.slice(8, -1);
        return `{Primitives.Shadow.${shadowKey}}`;
      }

      // Radius references
      if (match.startsWith('{radius.')) {
        const radiusKey = match.slice(8, -1);
        return `{Primitives.Border Radius.${radiusKey}}`;
      }

      // Typography references
      if (match.startsWith('{typography.')) {
        const refPath = match.slice(1, -1);
        const parts = refPath.split('.');
        
        if (parts.length >= 3) {
          const category = parts[1];
          const subcategory = parts[2];
          
          if (category === 'fontFamily') {
            return `{Primitives.Typography.Font Family.${subcategory}}`;
          }
          
          if (category === 'fontsize' || category === 'fontSize') {
            // Keep font sizes as-is from source
            return `{Primitives.Typography.Font Size.${subcategory}}`;
          }
          
          if (category === 'fontweight' || category === 'fontWeight') {
            // Keep weight values lowercase as they are in source
            return `{Primitives.Typography.Font Weight.${subcategory}}`;
          }
          
          if (category === 'lineheight' || category === 'lineHeight') {
            // Keep line height values as-is from source
            return `{Primitives.Typography.Line Height.${subcategory}}`;
          }
        }
      }

      // Brand references
      if (match.startsWith('{brand.') && filePath.includes('brands/')) {
        const brandMatch = filePath.match(/brands\/([^/]+)\//);
        if (brandMatch) {
          const brandName = capitalize(brandMatch[1]);
          const refPath = match.slice(1, -1);
          const [_, category, ...rest] = refPath.split('.');
          
          // Handle neutral colors
          if (category === 'neutral') {
            return `{Brands.${brandName}.Brand Colors.Neutral.${rest.join('.')}}`;
          }
          
          if (rest.length > 0) {
            return `{Brands.${brandName}.Brand Colors.${capitalize(category)}.${rest.join('.')}}`;
          } else {
            return `{Brands.${brandName}.Brand Colors.${capitalize(category)}}`;
          }
        }
      }

      return match;
    });
  }

  // Process tokens recursively
  async function processTokens(obj, filePath = '', parentKey = '') {
    const processed = {};

    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) {
        processed[key] = value;
        continue;
      }

      if (value && typeof value === 'object') {
        if (value.$value !== undefined) {
          processed[key] = {
            ...value,
            $value: mapTokenReference(value.$value, filePath)
          };
        } else {
          processed[key] = await processTokens(value, filePath, key);
        }
      } else {
        processed[key] = value;
      }
    }

    return processed;
  }

  // Load token files
  monitor.start('token-loading');
  
  const tokenFiles = [
    // Primitives
    ...await fs.readdir(path.join(__dirname, 'tokens/primitives')).then(files => 
      files.filter(f => f.endsWith('-dtcg.json')).map(f => path.join('tokens/primitives', f))
    ),
    // Semantic
    ...await fs.readdir(path.join(__dirname, 'tokens/semantic')).then(files => 
      files.filter(f => f.endsWith('-dtcg.json')).map(f => path.join('tokens/semantic', f))
    ),
    // Components
    ...await fs.readdir(path.join(__dirname, 'tokens/components')).then(files => 
      files.filter(f => f.endsWith('-dtcg.json')).map(f => path.join('tokens/components', f))
    ),
    // Custom (excluding typography)
    'tokens/custom/custom-spacing.json',
    'tokens/custom/oval-button.json',
    // Brands
    'tokens/brands/clearco/colors.json',
    'tokens/brands/clearco/typography.json',
    'tokens/brands/clearco/theme-light.json',
    'tokens/brands/clearco/theme-dark.json',
    'tokens/brands/firstwatch/colors.json',
    'tokens/brands/firstwatch/typography.json',
    'tokens/brands/firstwatch/theme-light.json',
    'tokens/brands/firstwatch/theme-dark.json'
  ];

  monitor.end('token-loading');

  // Process files in parallel batches
  monitor.start('token-processing');
  
  const batchSize = 5;
  const allTokens = {};
  
  for (let i = 0; i < tokenFiles.length; i += batchSize) {
    const batch = tokenFiles.slice(i, i + batchSize);
    
    const batchResults = await Promise.all(
      batch.map(async (file) => {
        const filePath = path.join(__dirname, file);
        console.log(chalk.gray(`  Processing ${file}...`));
        
        const content = await fs.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(content);
        const processed = await processTokens(parsed, file);
        
        return { file, tokens: processed };
      })
    );

    // Store tokens with their file info for proper mapping
    for (const { file, tokens } of batchResults) {
      allTokens[file] = tokens;
    }
  }

  monitor.end('token-processing');

  // Build unified structure
  monitor.start('structure-building');
  
  const unified = {
    Primitives: {
      Color: {},
      Typography: {
        'Font Family': {},
        'Font Size': {},
        'Font Weight': {},
        'Line Height': {},
        'Letter Spacing': {}
      },
      Spacing: {},
      Shadow: {},
      'Border Radius': {}
    },
    Semantic: {
      Light: {},
      Dark: {}
    },
    Components: {},
    Custom: {
      Spacing: {},
      'Oval Button': {}
    },
    Brands: {}
  };

  // Map tokens to unified structure
  for (const [file, tokens] of Object.entries(allTokens)) {
    // Primitives
    if (file.includes('primitives')) {
      if (tokens.color || tokens.colors) {
        Object.assign(unified.Primitives.Color, tokens.color || tokens.colors);
      }
      if (tokens.typography) {
        if (tokens.typography.fontFamily) {
          Object.assign(unified.Primitives.Typography['Font Family'], tokens.typography.fontFamily);
        }
        if (tokens.typography.fontSize) {
          Object.assign(unified.Primitives.Typography['Font Size'], tokens.typography.fontSize);
        }
        if (tokens.typography.fontWeight) {
          Object.assign(unified.Primitives.Typography['Font Weight'], tokens.typography.fontWeight);
        }
        if (tokens.typography.lineHeight) {
          Object.assign(unified.Primitives.Typography['Line Height'], tokens.typography.lineHeight);
        }
        if (tokens.typography.letterSpacing) {
          Object.assign(unified.Primitives.Typography['Letter Spacing'], tokens.typography.letterSpacing);
        }
      }
      if (tokens.spacing) {
        Object.assign(unified.Primitives.Spacing, tokens.spacing);
      }
      if (tokens.shadow) {
        Object.assign(unified.Primitives.Shadow, tokens.shadow);
      }
      if (tokens.radius || tokens.borderRadius) {
        Object.assign(unified.Primitives['Border Radius'], tokens.radius || tokens.borderRadius);
      }
    }

    // Semantic
    if (file.includes('semantic')) {
      if (tokens.theme) {
        if (file.includes('light')) {
          Object.assign(unified.Semantic.Light, tokens.theme);
        } else if (file.includes('dark')) {
          Object.assign(unified.Semantic.Dark, tokens.theme);
        }
      }
    }

    // Components
    if (file.includes('components')) {
      if (tokens.button) unified.Components.Button = tokens.button;
      if (tokens.card) unified.Components.Card = tokens.card;
      if (tokens.input) unified.Components.Input = tokens.input;
      if (tokens.modal) unified.Components.Modal = tokens.modal;
      if (tokens.badge) unified.Components.Badge = tokens.badge;
      if (tokens.alert) unified.Components.Alert = tokens.alert;
    }

    // Custom
    if (file.includes('custom')) {
      if (tokens.spacing) {
        unified.Custom.Spacing = tokens.spacing;
      }
      if (tokens.ovalButton) {
        unified.Custom['Oval Button'] = tokens.ovalButton;
      }
    }

    // Brands
    if (file.includes('brands')) {
      const brandMatch = file.match(/brands\/([^/]+)\//);
      if (brandMatch) {
        const brandName = capitalize(brandMatch[1]);
        
        if (!unified.Brands[brandName]) {
          unified.Brands[brandName] = {
            'Brand Colors': {},
            Typography: {},
            Theme: { Light: {}, Dark: {} }
          };
        }
        
        if (tokens.brand) {
          Object.assign(unified.Brands[brandName]['Brand Colors'], tokens.brand);
        }
        if (tokens.typography) {
          Object.assign(unified.Brands[brandName].Typography, tokens.typography);
        }
        if (tokens.theme) {
          if (file.includes('light')) {
            Object.assign(unified.Brands[brandName].Theme.Light, tokens.theme);
          } else if (file.includes('dark')) {
            Object.assign(unified.Brands[brandName].Theme.Dark, tokens.theme);
          }
        }
      }
    }
  }

  monitor.end('structure-building');

  // Configure and build
  monitor.start('style-dictionary');
  
  const config = {
    tokens: unified,
    platforms: {
      figma: {
        transformGroup: 'js',
        buildPath: 'build/figma/',
        files: [
          {
            destination: 'tokens-v2.json',
            format: 'json/nested'
          },
          {
            destination: 'tokens-v1.json',
            format: 'json/flat'
          }
        ]
      }
    }
  };

  const sd = new StyleDictionary({
    ...config,
    log: {
      verbosity: options.verbose ? 'verbose' : 'default',
      warnings: 'warn'
    }
  });
  
  try {
    await sd.buildAllPlatforms();
  } catch (error) {
    console.error(chalk.red('\n❌ Build failed:'));
    console.error(error.message);
    if (options.verbose) {
      console.error('\nFull error:', error);
    }
    throw error;
  }

  monitor.end('style-dictionary');
  monitor.end('total');

  // Print performance summary
  monitor.printSummary();
  
  console.log(chalk.green('\n✅ Optimized Figma token build complete!'));

  // Cache cleanup (remove old entries)
  if (!options.noCache && options.cleanCache) {
    console.log(chalk.yellow('\n🧹 Cleaning old cache entries...'));
    await cache.clear();
  }
}

// CLI interface
const args = process.argv.slice(2);
const options = {
  noCache: args.includes('--no-cache'),
  cleanCache: args.includes('--clean-cache'),
  verbose: args.includes('--verbose') || args.includes('-v'),
  help: args.includes('--help') || args.includes('-h')
};

if (options.help) {
  console.log(`
${chalk.cyan('Optimized Figma Token Builder')}

${chalk.yellow('Usage:')}
  node build-figma-optimized-v2.js [options]

${chalk.yellow('Options:')}
  --no-cache        Disable caching
  --clean-cache     Clear cache before building
  -v, --verbose     Enable verbose output
  -h, --help        Show this help message

${chalk.yellow('Examples:')}
  node build-figma-optimized-v2.js
  node build-figma-optimized-v2.js --no-cache
  node build-figma-optimized-v2.js --verbose
  `);
  process.exit(0);
}

// Run build
buildFigmaTokensOptimized(options).catch(console.error);
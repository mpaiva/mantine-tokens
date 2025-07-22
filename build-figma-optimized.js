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

// Token processor with chunking support
class TokenProcessor {
  constructor(options = {}) {
    this.chunkSize = options.chunkSize || 100;
    this.cache = options.cache;
    this.monitor = options.monitor;
  }

  async processInChunks(tokens, processor) {
    const entries = Object.entries(tokens);
    const chunks = [];
    
    for (let i = 0; i < entries.length; i += this.chunkSize) {
      chunks.push(entries.slice(i, i + this.chunkSize));
    }

    const results = [];
    for (let i = 0; i < chunks.length; i++) {
      if (this.monitor) {
        this.monitor.start(`chunk-${i}`);
      }
      
      const chunkObj = Object.fromEntries(chunks[i]);
      const processed = await processor(chunkObj);
      results.push(processed);
      
      if (this.monitor) {
        const duration = this.monitor.end(`chunk-${i}`);
        console.log(chalk.gray(`  Processed chunk ${i + 1}/${chunks.length} (${duration.toFixed(0)}ms)`));
      }
    }

    // Merge results
    return results.reduce((acc, chunk) => ({ ...acc, ...chunk }), {});
  }

  async processTokensWithCache(tokens, key, processor) {
    if (this.cache) {
      const cached = await this.cache.get(key);
      if (cached) {
        console.log(chalk.green(`  ✓ Using cached ${key}`));
        return cached;
      }
    }

    const processed = await processor(tokens);

    if (this.cache) {
      await this.cache.set(key, processed);
    }

    return processed;
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

  const processor = new TokenProcessor({
    chunkSize: options.chunkSize || 100,
    cache: options.noCache ? null : cache,
    monitor
  });

  monitor.end('initialization');

  // Helper function to capitalize
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Map token reference to unified structure with caching
  async function mapTokenReference(value, filePath) {
    if (typeof value !== 'string' || !value.includes('{')) return value;

    const cacheKey = `ref:${value}:${filePath}`;
    if (!options.noCache) {
      const cached = await cache.get(cacheKey);
      if (cached) return cached;
    }

    const mapped = value.replace(/\{([^}]+)\}/g, (match, ref) => {
      // Implementation remains the same as before
      if (match.startsWith('{color.') || match.startsWith('{colors.')) {
        const refPath = match.slice(1, -1);
        const parts = refPath.split('.');
        if (parts.length === 3) {
          const [_, colorName, shade] = parts;
          return `{Primitives.Color.${capitalize(colorName)}.${shade}}`;
        }
      }

      if (match.startsWith('{spacing.')) {
        const spacingKey = match.slice(9, -1);
        return `{Primitives.Spacing.${spacingKey}}`;
      }

      if (match.startsWith('{shadow.')) {
        const shadowKey = match.slice(8, -1);
        return `{Primitives.Shadow.${shadowKey}}`;
      }

      if (match.startsWith('{typography.')) {
        const refPath = match.slice(1, -1);
        const parts = refPath.split('.');
        
        if (parts.length >= 3) {
          const category = parts[1];
          const subcategory = parts[2];
          
          if (category === 'fontsize' || category === 'fontSize') {
            const sizeMap = {
              'xs': 'Xs',
              'sm': 'Sm',
              'md': 'Md',
              'lg': 'Lg',
              'xl': 'Xl',
              '2xl': '2xl',
              '3xl': '3xl',
              '4xl': '4xl'
            };
            const mappedSize = sizeMap[subcategory] || capitalize(subcategory);
            return `{Primitives.Typography.Font Size.${mappedSize}}`;
          }
          
          if (category === 'fontweight' || category === 'fontWeight') {
            return `{Primitives.Typography.Font Weight.${capitalize(subcategory)}}`;
          }
          
          if (category === 'lineheight' || category === 'lineHeight') {
            const sizeMap = {
              'xs': 'Xs',
              'sm': 'Sm',
              'md': 'Md',
              'lg': 'Lg',
              'xl': 'Xl'
            };
            const mappedSize = sizeMap[subcategory] || capitalize(subcategory);
            return `{Primitives.Typography.Line Height.${mappedSize}}`;
          }
        }
      }

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

    if (!options.noCache) {
      await cache.set(cacheKey, mapped);
    }

    return mapped;
  }

  // Process tokens with optimization
  async function processTokensOptimized(obj, filePath = '', parentKey = '') {
    const processed = {};

    const entries = Object.entries(obj);
    const chunks = [];
    
    // Create chunks for parallel processing
    for (let i = 0; i < entries.length; i += processor.chunkSize) {
      chunks.push(entries.slice(i, i + processor.chunkSize));
    }

    // Process chunks
    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(async ([key, value]) => {
          if (key.startsWith('$')) return [key, value];

          if (value && typeof value === 'object') {
            if (value.$value !== undefined) {
              const processedValue = {
                ...value,
                $value: await mapTokenReference(value.$value, filePath)
              };
              return [key, processedValue];
            } else {
              const nested = await processTokensOptimized(value, filePath, key);
              return [key, nested];
            }
          }

          return [key, value];
        })
      );

      // Merge chunk results
      for (const [key, value] of chunkResults) {
        processed[key] = value;
      }
    }

    return processed;
  }

  // Load and process token files with caching
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
  const processedTokens = {};
  
  for (let i = 0; i < tokenFiles.length; i += batchSize) {
    const batch = tokenFiles.slice(i, i + batchSize);
    
    const batchResults = await Promise.all(
      batch.map(async (file) => {
        const filePath = path.join(__dirname, file);
        
        // Try cache first
        const cacheKey = `file:${file}`;
        let tokens = await processor.processTokensWithCache(
          null,
          cacheKey,
          async () => {
            const content = await fs.readFile(filePath, 'utf-8');
            const parsed = JSON.parse(content);
            return await processTokensOptimized(parsed, file);
          }
        );

        return { file, tokens };
      })
    );

    // Merge batch results
    for (const { file, tokens } of batchResults) {
      Object.assign(processedTokens, tokens);
    }

    console.log(chalk.gray(`  Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(tokenFiles.length / batchSize)}`));
  }

  monitor.end('token-processing');

  // Build unified structure
  monitor.start('structure-building');
  
  const unifiedTokens = await processor.processTokensWithCache(
    processedTokens,
    'unified-structure',
    async (tokens) => {
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
        Custom: {},
        Brands: {}
      };

      // Map tokens to unified structure
      for (const [key, value] of Object.entries(tokens)) {
        // Primitives
        if (value.color || value.colors) {
          Object.assign(unified.Primitives.Color, value.color || value.colors);
        }
        if (value.typography) {
          if (value.typography.fontFamily) {
            Object.assign(unified.Primitives.Typography['Font Family'], value.typography.fontFamily);
          }
          if (value.typography.fontSize) {
            Object.assign(unified.Primitives.Typography['Font Size'], value.typography.fontSize);
          }
          if (value.typography.fontWeight) {
            Object.assign(unified.Primitives.Typography['Font Weight'], value.typography.fontWeight);
          }
          if (value.typography.lineHeight) {
            Object.assign(unified.Primitives.Typography['Line Height'], value.typography.lineHeight);
          }
          if (value.typography.letterSpacing) {
            Object.assign(unified.Primitives.Typography['Letter Spacing'], value.typography.letterSpacing);
          }
        }
        if (value.spacing) {
          Object.assign(unified.Primitives.Spacing, value.spacing);
        }
        if (value.shadow) {
          Object.assign(unified.Primitives.Shadow, value.shadow);
        }
        if (value.borderRadius) {
          Object.assign(unified.Primitives['Border Radius'], value.borderRadius);
        }

        // Semantic
        if (value.theme) {
          if (key.includes('light')) {
            Object.assign(unified.Semantic.Light, value.theme);
          } else if (key.includes('dark')) {
            Object.assign(unified.Semantic.Dark, value.theme);
          }
        }

        // Components
        if (value.button || value.card || value.input || value.modal || value.badge || value.alert) {
          // Process component tokens and map references
          const componentData = {};
          for (const [compKey, compValue] of Object.entries(value)) {
            if (compValue && typeof compValue === 'object') {
              componentData[compKey] = compValue;
            }
          }
          Object.assign(unified.Components, componentData);
        }

        // Custom
        if (value.custom || key.includes('custom')) {
          if (value.spacing) {
            unified.Custom.spacing = value.spacing;
          }
          if (value.ovalButton) {
            unified.Custom.ovalButton = value.ovalButton;
          }
        }

        // Brands
        if (key.includes('brand')) {
          const brandName = key.includes('clearco') ? 'Clearco' : 'Firstwatch';
          if (!unified.Brands[brandName]) {
            unified.Brands[brandName] = {
              'Brand Colors': {},
              Typography: {},
              Theme: { Light: {}, Dark: {} }
            };
          }
          
          if (value.brand) {
            Object.assign(unified.Brands[brandName]['Brand Colors'], value.brand);
          }
          if (value.typography) {
            Object.assign(unified.Brands[brandName].Typography, value.typography);
          }
          if (value.theme) {
            if (key.includes('light')) {
              Object.assign(unified.Brands[brandName].Theme.Light, value.theme);
            } else if (key.includes('dark')) {
              Object.assign(unified.Brands[brandName].Theme.Dark, value.theme);
            }
          }
        }
      }

      // Debug output
      if (options.verbose) {
        console.log(chalk.cyan('\n📋 Unified structure preview:'));
        console.log(JSON.stringify(unified, null, 2).slice(0, 500) + '...');
      }

      return unified;
    }
  );

  monitor.end('structure-building');

  // Configure and build
  monitor.start('style-dictionary');
  
  const config = {
    tokens: unifiedTokens,
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
  chunkSize: parseInt(args.find(a => a.startsWith('--chunk-size='))?.split('=')[1] || '100'),
  verbose: args.includes('--verbose') || args.includes('-v'),
  help: args.includes('--help') || args.includes('-h')
};

if (options.help) {
  console.log(`
${chalk.cyan('Optimized Figma Token Builder')}

${chalk.yellow('Usage:')}
  node build-figma-optimized.js [options]

${chalk.yellow('Options:')}
  --no-cache        Disable caching
  --clean-cache     Clear cache before building
  --chunk-size=N    Set chunk size for processing (default: 100)
  -v, --verbose     Enable verbose output
  -h, --help        Show this help message

${chalk.yellow('Examples:')}
  node build-figma-optimized.js
  node build-figma-optimized.js --no-cache
  node build-figma-optimized.js --chunk-size=50 --verbose
  `);
  process.exit(0);
}

// Run build
buildFigmaTokensOptimized(options).catch(console.error);
import StyleDictionary from 'style-dictionary';
import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TransformStream } from 'stream/web';
import minimist from 'minimist';
import crypto from 'crypto';

// Dynamic import for chalk
const chalk = await import('chalk').then(m => m.default);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Progress indicator class
class ProgressIndicator {
  constructor(total, label = 'Processing') {
    this.total = total;
    this.current = 0;
    this.label = label;
    this.startTime = Date.now();
    this.barLength = 30;
  }

  update(increment = 1) {
    this.current += increment;
    this.render();
  }

  render() {
    const percent = Math.round((this.current / this.total) * 100);
    const filled = Math.round((this.current / this.total) * this.barLength);
    const empty = this.barLength - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    
    const elapsed = Date.now() - this.startTime;
    const rate = this.current / (elapsed / 1000);
    const eta = this.current === 0 ? 0 : ((this.total - this.current) / rate) * 1000;
    
    process.stdout.write(
      `\r${chalk.cyan(this.label)} ${chalk.green(bar)} ${percent}% ` +
      `(${this.current}/${this.total}) ` +
      chalk.gray(`ETA: ${this.formatTime(eta)}`)
    );
    
    if (this.current >= this.total) {
      console.log(chalk.green(' ✓'));
    }
  }

  formatTime(ms) {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    return `${Math.round(ms / 60000)}m`;
  }
}

// Performance monitor with detailed metrics
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.marks = new Map();
  }

  mark(name) {
    this.marks.set(name, process.hrtime.bigint());
  }

  measure(name, startMark, endMark = null) {
    const start = this.marks.get(startMark);
    const end = endMark ? this.marks.get(endMark) : process.hrtime.bigint();
    
    if (!start) return;
    
    const duration = Number(end - start) / 1_000_000; // Convert to ms
    
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name).push(duration);
    
    return duration;
  }

  getStats(name) {
    const durations = this.metrics.get(name);
    if (!durations || durations.length === 0) return null;
    
    const sum = durations.reduce((a, b) => a + b, 0);
    const avg = sum / durations.length;
    const min = Math.min(...durations);
    const max = Math.max(...durations);
    
    return { avg, min, max, sum, count: durations.length };
  }

  printReport() {
    console.log(chalk.cyan('\n📊 Performance Report:'));
    console.log(chalk.gray('─'.repeat(60)));
    
    for (const [name, durations] of this.metrics) {
      const stats = this.getStats(name);
      console.log(
        chalk.yellow(`${name}:`.padEnd(25)) +
        chalk.green(`${stats.avg.toFixed(2)}ms avg`) +
        chalk.gray(` (${stats.min.toFixed(2)}-${stats.max.toFixed(2)}ms)`) +
        chalk.blue(` × ${stats.count}`)
      );
    }
    
    const totalTime = Array.from(this.metrics.values())
      .flat()
      .reduce((a, b) => a + b, 0);
    
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.green(`Total: ${totalTime.toFixed(2)}ms`));
  }
}

// Cache manager with statistics
class CacheManager {
  constructor(cacheDir = '.cache/figma-tokens') {
    this.cacheDir = path.join(__dirname, cacheDir);
    this.hits = 0;
    this.misses = 0;
    this.writes = 0;
  }

  async initialize() {
    await fs.mkdir(this.cacheDir, { recursive: true });
  }

  generateKey(content, context = '') {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(content));
    hash.update(context);
    return hash.digest('hex').slice(0, 16);
  }

  async get(key) {
    const filePath = path.join(this.cacheDir, `${key}.json`);
    
    if (existsSync(filePath)) {
      try {
        const data = await fs.readFile(filePath, 'utf-8');
        const cached = JSON.parse(data);
        
        // Check if cache is fresh (24 hours)
        if (Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
          this.hits++;
          return cached.data;
        }
      } catch (error) {
        // Invalid cache entry
      }
    }
    
    this.misses++;
    return null;
  }

  async set(key, data) {
    const filePath = path.join(this.cacheDir, `${key}.json`);
    const cacheData = {
      timestamp: Date.now(),
      data
    };
    
    await fs.writeFile(filePath, JSON.stringify(cacheData));
    this.writes++;
  }

  printStats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total * 100).toFixed(1) : 0;
    
    console.log(chalk.cyan('\n📦 Cache Statistics:'));
    console.log(chalk.green(`  Hits: ${this.hits}`));
    console.log(chalk.yellow(`  Misses: ${this.misses}`));
    console.log(chalk.blue(`  Writes: ${this.writes}`));
    console.log(chalk.magenta(`  Hit Rate: ${hitRate}%`));
  }
}

// Build statistics collector
class BuildStats {
  constructor() {
    this.stats = {
      filesProcessed: 0,
      tokensProcessed: 0,
      referencesResolved: 0,
      errors: [],
      warnings: [],
      startTime: Date.now()
    };
  }

  addFile() {
    this.stats.filesProcessed++;
  }

  addTokens(count) {
    this.stats.tokensProcessed += count;
  }

  addReference() {
    this.stats.referencesResolved++;
  }

  addError(error) {
    this.stats.errors.push(error);
  }

  addWarning(warning) {
    this.stats.warnings.push(warning);
  }

  getDuration() {
    return Date.now() - this.stats.startTime;
  }

  printSummary() {
    const duration = this.getDuration();
    
    console.log(chalk.cyan('\n📈 Build Summary:'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.green(`  ✓ Files processed: ${this.stats.filesProcessed}`));
    console.log(chalk.green(`  ✓ Tokens processed: ${this.stats.tokensProcessed}`));
    console.log(chalk.green(`  ✓ References resolved: ${this.stats.referencesResolved}`));
    
    if (this.stats.warnings.length > 0) {
      console.log(chalk.yellow(`  ⚠ Warnings: ${this.stats.warnings.length}`));
    }
    
    if (this.stats.errors.length > 0) {
      console.log(chalk.red(`  ✗ Errors: ${this.stats.errors.length}`));
    }
    
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.blue(`  Total time: ${(duration / 1000).toFixed(2)}s`));
    
    const tokensPerSecond = (this.stats.tokensProcessed / (duration / 1000)).toFixed(0);
    console.log(chalk.magenta(`  Processing rate: ${tokensPerSecond} tokens/s`));
  }
}

// Enhanced token processor
class TokenProcessor {
  constructor(options = {}) {
    this.cache = options.cache;
    this.monitor = options.monitor;
    this.stats = options.stats;
    this.verbose = options.verbose;
  }

  async processFile(filePath, processor) {
    const cacheKey = this.cache?.generateKey(filePath, 'file');
    
    if (this.cache) {
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        if (this.verbose) {
          console.log(chalk.gray(`    ✓ Using cached ${path.basename(filePath)}`));
        }
        return cached;
      }
    }
    
    this.monitor?.mark(`file-start-${filePath}`);
    
    const content = await fs.readFile(filePath, 'utf-8');
    const tokens = JSON.parse(content);
    const processed = await processor(tokens, filePath);
    
    const duration = this.monitor?.measure(`file-process`, `file-start-${filePath}`);
    
    if (this.cache) {
      await this.cache.set(cacheKey, processed);
    }
    
    this.stats?.addFile();
    this.stats?.addTokens(this.countTokens(processed));
    
    if (this.verbose && duration) {
      console.log(chalk.gray(`    ✓ Processed ${path.basename(filePath)} (${duration.toFixed(0)}ms)`));
    }
    
    return processed;
  }

  countTokens(obj) {
    let count = 0;
    
    function traverse(node) {
      if (node && typeof node === 'object') {
        if (node.$value !== undefined) {
          count++;
        }
        for (const value of Object.values(node)) {
          traverse(value);
        }
      }
    }
    
    traverse(obj);
    return count;
  }

  countReferences(obj) {
    let count = 0;
    
    function traverse(node) {
      if (node && typeof node === 'object') {
        if (node.$value && typeof node.$value === 'string' && node.$value.includes('{')) {
          const matches = node.$value.match(/\{[^}]+\}/g);
          count += matches ? matches.length : 0;
        }
        for (const value of Object.values(node)) {
          traverse(value);
        }
      }
    }
    
    traverse(obj);
    return count;
  }
}

// Main build function
async function buildFigmaTokensEnhanced(options = {}) {
  console.log(chalk.cyan.bold('\n🎨 Figma Token Build System v2.0\n'));
  
  const monitor = new PerformanceMonitor();
  const cache = options.noCache ? null : new CacheManager();
  const stats = new BuildStats();
  
  monitor.mark('build-start');
  
  // Initialize systems
  if (cache) {
    console.log(chalk.gray('Initializing cache system...'));
    await cache.initialize();
  }
  
  const processor = new TokenProcessor({
    cache,
    monitor,
    stats,
    verbose: options.verbose
  });

  // Helper function to capitalize
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Map token reference to unified structure
  function mapTokenReference(value, filePath) {
    if (typeof value !== 'string' || !value.includes('{')) return value;

    return value.replace(/\{([^}]+)\}/g, (match, ref) => {
      stats.addReference();
      
      // Color references
      if (match.startsWith('{color.') || match.startsWith('{colors.')) {
        const refPath = match.slice(1, -1);
        const parts = refPath.split('.');
        
        if (parts.length === 2) {
          const [_, colorName] = parts;
          if (colorName === 'white' || colorName === 'black') {
            return `{Primitives.Color.${colorName}}`;
          }
        }
        
        if (parts.length === 3) {
          const [_, colorName, shade] = parts;
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
            return `{Primitives.Typography.Font Weight.${subcategory}}`;
          }
          
          if (category === 'lineheight' || category === 'lineHeight') {
            const sizeMap = {
              'xs': 'Xs',
              'sm': 'Sm',
              'md': 'Md',
              'lg': 'Lg',
              'xl': 'Xl'
            };
            const mappedSize = sizeMap[subcategory] || subcategory;
            return `{Primitives.Typography.Line Height.${mappedSize}}`;
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
  console.log(chalk.cyan('Loading token files...'));
  monitor.mark('load-start');
  
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
    // Custom (excluding typography to avoid collisions)
    'tokens/custom/custom-spacing.json',
    'tokens/custom/oval-button.json',
    // Brands
    'tokens/brands/clearco/colors.json',
    'tokens/brands/clearco/typography.json',
    'tokens/brands/clearco/typography-sizes.json',
    'tokens/brands/clearco/theme-light.json',
    'tokens/brands/clearco/theme-dark.json',
    'tokens/brands/firstwatch/colors.json',
    'tokens/brands/firstwatch/typography.json',
    'tokens/brands/firstwatch/typography-sizes.json',
    'tokens/brands/firstwatch/theme-light.json',
    'tokens/brands/firstwatch/theme-dark.json'
  ];

  monitor.measure('file-discovery', 'load-start');
  
  // Process files with progress indicator
  console.log(chalk.cyan('\nProcessing token files...'));
  const progress = new ProgressIndicator(tokenFiles.length, 'Processing files');
  
  const processedTokens = {};
  const batchSize = 5;
  
  for (let i = 0; i < tokenFiles.length; i += batchSize) {
    const batch = tokenFiles.slice(i, i + batchSize);
    
    const batchResults = await Promise.all(
      batch.map(async (file) => {
        const filePath = path.join(__dirname, file);
        const tokens = await processor.processFile(filePath, async (content) => {
          return await processTokens(content, file);
        });
        
        progress.update();
        return { file, tokens };
      })
    );
    
    for (const { file, tokens } of batchResults) {
      if (file.includes('primitives')) {
        Object.assign(processedTokens, tokens);
      } else if (file.includes('semantic')) {
        Object.assign(processedTokens, tokens);
      } else if (file.includes('components')) {
        Object.assign(processedTokens, tokens);
      } else if (file.includes('custom')) {
        Object.assign(processedTokens, { custom: tokens });
      } else if (file.includes('brands')) {
        const brandMatch = file.match(/brands\/([^/]+)\//);
        if (brandMatch) {
          const brandName = brandMatch[1];
          if (!processedTokens[brandName]) {
            processedTokens[brandName] = {};
          }
          // Merge tokens into brand, handling nested structures
          // For theme files, store them with a key that indicates light/dark
          if (file.includes('theme-light.json')) {
            processedTokens[brandName]['theme-light'] = tokens.theme || tokens;
          } else if (file.includes('theme-dark.json')) {
            processedTokens[brandName]['theme-dark'] = tokens.theme || tokens;
          } else {
            // For other files, merge normally
            for (const [key, value] of Object.entries(tokens)) {
              if (!processedTokens[brandName][key]) {
                processedTokens[brandName][key] = {};
              }
              if (typeof value === 'object' && !Array.isArray(value)) {
                Object.assign(processedTokens[brandName][key], value);
              } else {
                processedTokens[brandName][key] = value;
              }
            }
          }
        }
      }
    }
  }

  monitor.measure('token-processing', 'load-start');

  // Build unified structure
  console.log(chalk.cyan('\nBuilding unified structure...'));
  monitor.mark('structure-start');
  
  const unified = {
    Primitives: {
      Color: processedTokens.color || {},
      Typography: {
        'Font Family': processedTokens.typography?.fontFamily || {},
        'Font Size': processedTokens.typography?.fontSize || {},
        'Font Weight': processedTokens.typography?.fontWeight || {},
        'Line Height': processedTokens.typography?.lineHeight || {},
        'Letter Spacing': processedTokens.typography?.letterSpacing || {}
      },
      Spacing: processedTokens.spacing || {},
      Shadow: processedTokens.shadow || {},
      'Border Radius': processedTokens.radius || processedTokens.borderRadius || {}
    },
    Semantic: {
      Light: processedTokens.theme || {},
      Dark: {}
    },
    Components: {
      Button: processedTokens.button || {},
      Card: processedTokens.card || {},
      Input: processedTokens.input || {},
      Modal: processedTokens.modal || {},
      Badge: processedTokens.badge || {},
      Alert: processedTokens.alert || {}
    },
    Custom: {
      Spacing: processedTokens.custom?.spacing || {},
      'Oval Button': processedTokens.custom?.ovalButton || {}
    },
    Brands: {}
  };

  // Map brands
  for (const [brandName, brandTokens] of Object.entries(processedTokens)) {
    if (['color', 'typography', 'spacing', 'shadow', 'radius', 'theme', 'button', 'card', 'input', 'modal', 'badge', 'alert', 'custom'].includes(brandName)) continue;
    
    unified.Brands[capitalize(brandName)] = {
      'Brand Colors': brandTokens.brand || {},
      Typography: brandTokens.typography || {},
      Theme: {
        Light: {},
        Dark: {}
      }
    };
    
    // Map theme tokens based on what's in the brand
    if (brandTokens['theme-light']) {
      unified.Brands[capitalize(brandName)].Theme.Light = brandTokens['theme-light'];
    }
    if (brandTokens['theme-dark']) {
      unified.Brands[capitalize(brandName)].Theme.Dark = brandTokens['theme-dark'];
    }
    // Fallback if theme is directly assigned
    if (brandTokens.theme && !brandTokens['theme-light'] && !brandTokens['theme-dark']) {
      unified.Brands[capitalize(brandName)].Theme.Light = brandTokens.theme;
    }
  }

  monitor.measure('structure-building', 'structure-start');

  // Configure Style Dictionary
  console.log(chalk.cyan('\nConfiguring Style Dictionary...'));
  monitor.mark('sd-start');
  
  const config = {
    tokens: unified,
    platforms: {
      figma: {
        transformGroup: 'js',
        buildPath: 'build/figma/',
        files: [
          {
            destination: 'tokens.json',
            format: 'json/dtcg-nested',
            options: {
              outputReferences: true
            }
          }
        ]
      }
    }
  };

  // Build with Style Dictionary
  console.log(chalk.cyan('\nBuilding output files...'));
  
  // Register custom format that preserves $value and $type
  StyleDictionary.registerFormat({
    name: 'json/dtcg-nested',
    format: ({ dictionary }) => {
      function processTokens(tokens) {
        const result = {};
        
        for (const [key, value] of Object.entries(tokens)) {
          if (typeof value === 'object' && value !== null) {
            if ('$value' in value) {
              // It's a token
              result[key] = {
                $value: value.$value || value.value,
                $type: value.$type || value.type || 'string'
              };
              if (value.$description || value.comment) {
                result[key].$description = value.$description || value.comment;
              }
            } else {
              // It's a group
              result[key] = processTokens(value);
            }
          } else {
            result[key] = value;
          }
        }
        
        return result;
      }
      
      return JSON.stringify(processTokens(dictionary.tokens), null, 2);
    }
  });

  const sd = new StyleDictionary({
    ...config,
    log: {
      verbosity: options.verbose ? 'verbose' : 'default',
      warnings: 'warn',
      errors: {
        brokenReferences: 'console'
      }
    }
  });

  try {
    await sd.buildAllPlatforms();
    monitor.measure('style-dictionary', 'sd-start');
    
    console.log(chalk.green('\n✅ Build completed successfully!'));
  } catch (error) {
    stats.addError(error.message);
    console.error(chalk.red('\n❌ Build failed:'), error.message);
    
    if (options.verbose) {
      console.error(error);
    }
    
    throw error;
  }

  monitor.measure('total', 'build-start');

  // Print reports
  if (options.showStats) {
    stats.printSummary();
    monitor.printReport();
    
    if (cache) {
      cache.printStats();
    }
  }

  return {
    stats: stats.stats,
    performance: monitor.getStats('total'),
    cache: cache ? { hits: cache.hits, misses: cache.misses } : null
  };
}

// CLI
const argv = minimist(process.argv.slice(2), {
  boolean: ['verbose', 'watch', 'help', 'no-cache', 'show-stats'],
  alias: {
    v: 'verbose',
    w: 'watch',
    h: 'help',
    s: 'show-stats'
  }
});

if (argv.help) {
  console.log(`
${chalk.cyan.bold('Figma Token Build System v2.0')}

${chalk.yellow('Usage:')}
  node build-figma-enhanced.js [options]

${chalk.yellow('Options:')}
  -v, --verbose      Show detailed output
  -w, --watch        Watch for changes
  -s, --show-stats   Show build statistics
  --no-cache         Disable caching
  -h, --help         Show this help

${chalk.yellow('Examples:')}
  node build-figma-enhanced.js
  node build-figma-enhanced.js --verbose --show-stats
  node build-figma-enhanced.js --watch
`);
  process.exit(0);
}

// Run build
buildFigmaTokensEnhanced({
  verbose: argv.verbose,
  noCache: argv['no-cache'],
  showStats: argv['show-stats'] || argv.verbose
}).catch(console.error);

// Watch mode
if (argv.watch) {
  console.log(chalk.cyan('\n👁  Watching for changes...'));
  
  const chokidar = await import('chokidar');
  const watcher = chokidar.watch([
    'tokens/**/*.json',
    '!tokens/**/package.json'
  ], {
    persistent: true,
    ignoreInitial: true
  });

  watcher.on('change', async (path) => {
    console.log(chalk.yellow(`\n📝 File changed: ${path}`));
    console.log(chalk.gray('Rebuilding...'));
    
    try {
      await buildFigmaTokensEnhanced({
        verbose: argv.verbose,
        noCache: argv['no-cache'],
        showStats: argv['show-stats']
      });
    } catch (error) {
      console.error(chalk.red('Build failed:'), error.message);
    }
  });
}
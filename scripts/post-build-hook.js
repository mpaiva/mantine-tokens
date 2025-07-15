import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Check if running for custom build
const isCustomBuild = process.argv.includes('custom');

// Read the current prefix from _prefix.json or _custom-prefix.json
async function getCurrentPrefix() {
  try {
    const prefixFile = isCustomBuild ? '_custom-prefix.json' : '_prefix.json';
    const prefixPath = path.join(__dirname, '..', 'tokens', prefixFile);
    const content = await fs.readFile(prefixPath, 'utf8');
    const data = JSON.parse(content);
    return data.prefix || (isCustomBuild ? 'custom' : 'mantine');
  } catch (error) {
    console.error('Error reading prefix:', error);
    return isCustomBuild ? 'custom' : 'mantine';
  }
}

// Read the last used prefix
async function getLastPrefix() {
  try {
    const cacheFile = isCustomBuild ? '.custom-prefix-cache' : '.prefix-cache';
    const cachePath = path.join(__dirname, '..', cacheFile);
    const content = await fs.readFile(cachePath, 'utf8');
    return content.trim();
  } catch {
    // File doesn't exist, this is the first run
    return null;
  }
}

// Save the current prefix as the last used
async function saveLastPrefix(prefix) {
  const cacheFile = isCustomBuild ? '.custom-prefix-cache' : '.prefix-cache';
  const cachePath = path.join(__dirname, '..', cacheFile);
  await fs.writeFile(cachePath, prefix, 'utf8');
}

// Update a file with the new prefix
async function updateFileWithPrefix(filePath, oldPrefix, newPrefix, patterns) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let updated = false;
    
    // Apply each pattern
    for (const pattern of patterns) {
      const newContent = content.replace(pattern.regex, pattern.replacement);
      if (newContent !== content) {
        updated = true;
        content = newContent;
      }
    }
    
    if (updated) {
      await fs.writeFile(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
    return false;
  }
}

// Update README.md
async function updateReadme(oldPrefix, newPrefix) {
  const readmePath = path.join(__dirname, '..', 'README.md');
  const patterns = [
    {
      regex: /\*\*Current Design System\*\*: The tokens use the "[^"]*" prefix/g,
      replacement: `**Current Design System**: The tokens use the "${newPrefix}" prefix`
    },
    {
      regex: /"prefix": "[^"]*"/g,
      replacement: `"prefix": "${newPrefix}"`
    },
    {
      regex: /--[a-zA-Z0-9-]+-color-primary/g,
      replacement: `--${newPrefix}-color-primary`
    },
    {
      regex: /\(currently "[^"]*"\)/g,
      replacement: `(currently "${newPrefix}")`
    }
  ];
  
  return await updateFileWithPrefix(readmePath, oldPrefix, newPrefix, patterns);
}

// Update documentation guides
async function updateDocGuides(oldPrefix, newPrefix) {
  const docsDir = path.join(__dirname, '..', 'docs');
  const files = [
    'NON_TECHNICAL_GUIDE.md',
    'QUICK_START_GUIDE.md',
    'TOKEN_VIEWER_GUIDE.md'
  ];
  
  const updated = [];
  
  for (const file of files) {
    const filePath = path.join(docsDir, file);
    const patterns = [
      // Update CSS variable examples
      {
        regex: new RegExp(`--${oldPrefix}-`, 'g'),
        replacement: `--${newPrefix}-`
      },
      // Update prefix mentions in text
      {
        regex: new RegExp(`${oldPrefix}-:`, 'g'),
        replacement: `${newPrefix}-:`
      },
      // Update prefix in bold markdown
      {
        regex: new RegExp(`\\*\\*${oldPrefix}-\\*\\*`, 'g'),
        replacement: `**${newPrefix}-**`
      },
      // Update JSON file references
      {
        regex: new RegExp(`${oldPrefix}\\.tokens\\.json`, 'g'),
        replacement: `${newPrefix}.tokens.json`
      },
      // Update backtick-wrapped JSON file paths
      {
        regex: new RegExp(`\`build/json/${oldPrefix}\\.tokens\\.json\``, 'g'),
        replacement: `\`build/json/${newPrefix}.tokens.json\``
      },
      // Update TypeScript references
      {
        regex: new RegExp(`${oldPrefix}Tokens`, 'g'),
        replacement: `${newPrefix}Tokens`
      },
      // Update capitalized references
      {
        regex: new RegExp(`${oldPrefix.charAt(0).toUpperCase() + oldPrefix.slice(1)}Token`, 'g'),
        replacement: `${newPrefix.charAt(0).toUpperCase() + newPrefix.slice(1)}Token`
      }
    ];
    
    if (await updateFileWithPrefix(filePath, oldPrefix, newPrefix, patterns)) {
      updated.push(file);
    }
  }
  
  return updated;
}

// Update the HTML token viewer
async function updateTokenViewer(prefix) {
  const viewerPath = path.join(__dirname, '..', 'build', 'token-viewer.html');
  
  try {
    let content = await fs.readFile(viewerPath, 'utf8');
    
    // Add or update the prefix display in the header
    const prefixNotice = `<div class="prefix-notice">Current prefix: <code>${prefix}</code> (e.g., <code>--${prefix}-color-primary</code>)</div>`;
    
    // Check if prefix notice already exists
    if (content.includes('class="prefix-notice"')) {
      // Update existing notice
      content = content.replace(
        /<div class="prefix-notice">.*?<\/div>/,
        prefixNotice
      );
    } else {
      // Add new notice after subtitle
      content = content.replace(
        /<p class="subtitle">.*?<\/p>/,
        `$&\n        \n        ${prefixNotice}`
      );
    }
    
    // Add CSS for the prefix notice if not present
    if (!content.includes('.prefix-notice')) {
      const prefixNoticeCSS = `
        .prefix-notice {
            background-color: #e3f2fd;
            border: 1px solid #2196F3;
            color: #1565C0;
            padding: 0.75rem 1rem;
            border-radius: 4px;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
        }
        
        .prefix-notice code {
            background-color: rgba(255, 255, 255, 0.7);
            padding: 0.125rem 0.25rem;
            border-radius: 2px;
            font-family: monospace;
        }`;
      
      content = content.replace('</style>', `${prefixNoticeCSS}\n    </style>`);
    }
    
    await fs.writeFile(viewerPath, content, 'utf8');
    return true;
  } catch (error) {
    // Token viewer might not exist yet
    if (error.code !== 'ENOENT') {
      console.error('Error updating token viewer:', error);
    }
    return false;
  }
}

// Update CLAUDE.md
async function updateClaudeMd(oldPrefix, newPrefix) {
  const claudePath = path.join(__dirname, '..', 'CLAUDE.md');
  const patterns = [
    {
      regex: new RegExp(`\\(currently "${oldPrefix}"\\)`, 'g'),
      replacement: `(currently "${newPrefix}")`
    }
  ];
  
  return await updateFileWithPrefix(claudePath, oldPrefix, newPrefix, patterns);
}

// Main function
async function main() {
  const buildType = isCustomBuild ? 'custom' : 'Mantine';
  console.log(`${colors.blue}🎨 Running post-build prefix hook for ${buildType} tokens...${colors.reset}\n`);
  
  // Get current and last prefix
  const currentPrefix = await getCurrentPrefix();
  const lastPrefix = await getLastPrefix();
  
  // Skip documentation updates for custom build
  if (isCustomBuild) {
    console.log(`${colors.green}✓ Custom build completed with prefix "${currentPrefix}"${colors.reset}`);
    await saveLastPrefix(currentPrefix);
    return;
  }
  
  // Check if prefix changed
  if (lastPrefix === currentPrefix) {
    console.log(`${colors.green}✓ Prefix unchanged (${currentPrefix}), skipping documentation updates${colors.reset}`);
    return;
  }
  
  const oldPrefix = lastPrefix || 'mantine'; // Default to mantine if no cache
  console.log(`${colors.yellow}⚡ Prefix changed from "${oldPrefix}" to "${currentPrefix}"${colors.reset}\n`);
  
  // Update files
  const updates = [];
  
  // Update README
  if (await updateReadme(oldPrefix, currentPrefix)) {
    updates.push('README.md');
  }
  
  // Update documentation guides
  const updatedDocs = await updateDocGuides(oldPrefix, currentPrefix);
  updates.push(...updatedDocs.map(doc => `docs/${doc}`));
  
  // Update HTML token viewer
  if (await updateTokenViewer(currentPrefix)) {
    updates.push('build/token-viewer.html');
  }
  
  // Update CLAUDE.md
  if (await updateClaudeMd(oldPrefix, currentPrefix)) {
    updates.push('CLAUDE.md');
  }
  
  // Save the current prefix for next time
  await saveLastPrefix(currentPrefix);
  
  // Report results
  if (updates.length > 0) {
    console.log(`${colors.green}✅ Updated ${updates.length} files:${colors.reset}`);
    updates.forEach(file => console.log(`   - ${file}`));
  } else {
    console.log(`${colors.yellow}⚠️  No files needed updating${colors.reset}`);
  }
  
  console.log(`\n${colors.blue}📝 Documentation is now synchronized with prefix "${currentPrefix}"${colors.reset}`);
}

// Run the hook
main().catch(error => {
  console.error(`${colors.red}❌ Hook failed:${colors.reset}`, error);
  process.exit(1);
});
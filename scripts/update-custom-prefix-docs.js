import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

// Get the current custom prefix
async function getCurrentCustomPrefix() {
  try {
    const prefixPath = path.join(__dirname, '..', 'tokens', '_custom-prefix.json');
    const content = await fs.readFile(prefixPath, 'utf8');
    const data = JSON.parse(content);
    return data.prefix || 'custom';
  } catch (error) {
    console.error('Error reading custom prefix:', error);
    return 'custom';
  }
}

// Update file with new prefix
async function updateFileContent(filePath, oldPrefix, newPrefix) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let updated = false;
    
    const patterns = [
      // CSS variables
      new RegExp(`--${oldPrefix}-`, 'g'),
      // TypeScript exports
      new RegExp(`${oldPrefix}Tokens`, 'g'),
      // Type names
      new RegExp(`${oldPrefix.charAt(0).toUpperCase() + oldPrefix.slice(1)}Token`, 'g'),
      // JSON filenames
      new RegExp(`${oldPrefix}\\.tokens\\.json`, 'g'),
      // Build paths
      new RegExp(`build/custom/${oldPrefix}`, 'g'),
      // Documentation references
      new RegExp(`\`${oldPrefix}-`, 'g'),
      new RegExp(`"${oldPrefix}-`, 'g'),
      // Prefix in example code
      new RegExp(`prefix: '${oldPrefix}'`, 'g'),
      new RegExp(`prefix: "${oldPrefix}"`, 'g'),
      // Default prefix references in documentation
      new RegExp(`\\(default "${oldPrefix}"\\)`, 'g'),
      new RegExp(`\\(default '${oldPrefix}'\\)`, 'g'),
    ];
    
    patterns.forEach(pattern => {
      const replacement = pattern.source
        .replace(oldPrefix, newPrefix)
        .replace(/\\/g, '');
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        updated = true;
        content = newContent;
      }
    });
    
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

// Find all files that might contain custom prefix references
async function findFilesToUpdate() {
  const filesToCheck = [
    // Documentation
    'docs/CUSTOM_TOKENS_GUIDE.md',
    'docs/MULTIBRAND_THEMING_GUIDE.md',
    'docs/TESTING_GUIDE.md',
    'CLAUDE.md',
    'README.md',
    // Examples
    'examples/using-both-tokens.html',
    'examples/oval-button-example.html',
    'examples/multibrand-theme-demo.html',
    'examples/interactive-demo.html',
  ];
  
  return filesToCheck;
}

// Main function
async function main() {
  console.log(`${colors.blue}🔄 Updating documentation with custom prefix changes...${colors.reset}\n`);
  
  // Get the current prefix
  const currentPrefix = await getCurrentCustomPrefix();
  
  // Get the old prefix from command line or default
  const oldPrefix = process.argv[2] || 'clearco';
  
  if (oldPrefix === currentPrefix) {
    console.log(`${colors.yellow}⚠️  Prefix unchanged (${currentPrefix})${colors.reset}`);
    return;
  }
  
  console.log(`${colors.yellow}📝 Updating from "${oldPrefix}" to "${currentPrefix}"${colors.reset}\n`);
  
  // Find and update files
  const filesToUpdate = await findFilesToUpdate();
  const updated = [];
  
  for (const file of filesToUpdate) {
    const filePath = path.join(__dirname, '..', file);
    try {
      if (await updateFileContent(filePath, oldPrefix, currentPrefix)) {
        updated.push(file);
        console.log(`${colors.green}✓${colors.reset} Updated ${file}`);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.log(`${colors.red}✗${colors.reset} Error updating ${file}: ${error.message}`);
      }
    }
  }
  
  // Summary
  console.log(`\n${colors.blue}📊 Summary:${colors.reset}`);
  console.log(`   Updated ${updated.length} files`);
  console.log(`   New prefix: ${colors.green}${currentPrefix}${colors.reset}`);
  
  if (updated.length > 0) {
    console.log(`\n${colors.green}✅ Documentation updated successfully!${colors.reset}`);
    console.log(`\n${colors.yellow}💡 Tip: Run 'npm run build:custom' to rebuild tokens with the new prefix${colors.reset}`);
  }
}

// Run the script
main().catch(error => {
  console.error(`${colors.red}❌ Script failed:${colors.reset}`, error);
  process.exit(1);
});
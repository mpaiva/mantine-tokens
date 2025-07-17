import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read token documentation files
async function readTokenDocs(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    return null;
  }
}

// Extract token tables from markdown
function extractTokenTables(content, prefix) {
  const tables = [];
  const lines = content.split('\n');
  let currentSection = '';
  let inTable = false;
  let currentTable = [];
  
  for (const line of lines) {
    // Track current section
    if (line.startsWith('## ') && !line.includes('Table of Contents')) {
      currentSection = line.replace('## ', '').trim();
      inTable = false;
      if (currentTable.length > 0) {
        tables.push({ section: currentSection, rows: currentTable, prefix });
        currentTable = [];
      }
    }
    
    // Detect table start
    if (line.includes('| Token | Value | CSS Variable |')) {
      inTable = true;
      continue;
    }
    
    // Skip table header separator
    if (line.includes('|-------|')) {
      continue;
    }
    
    // Collect table rows
    if (inTable && line.startsWith('|') && line.includes('|')) {
      const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
      if (cells.length >= 3) {
        currentTable.push({
          token: cells[0],
          value: cells[1],
          cssVar: cells[2],
          description: cells[3] || ''
        });
      }
    } else if (inTable && !line.startsWith('|')) {
      inTable = false;
      if (currentTable.length > 0) {
        tables.push({ section: currentSection, rows: currentTable, prefix });
        currentTable = [];
      }
    }
  }
  
  // Don't forget the last table
  if (currentTable.length > 0) {
    tables.push({ section: currentSection, rows: currentTable, prefix });
  }
  
  return tables;
}

// Generate the unified documentation
async function generateUnifiedDocs() {
  console.log('📚 Generating unified token documentation...\n');
  
  let md = '# All Design Tokens Reference\n\n';
  md += 'This document provides a comprehensive view of all available design tokens across the system.\n\n';
  md += '## Table of Contents\n\n';
  md += '- [Mantine Tokens](#mantine-tokens)\n';
  md += '- [Custom Extension Tokens](#custom-extension-tokens)\n';
  md += '- [Brand Tokens](#brand-tokens)\n';
  md += '- [Token Usage Guide](#token-usage-guide)\n\n';
  md += '---\n\n';
  
  // Read all documentation files
  const docs = {
    mantine: null,
    custom: null,
    brands: {}
  };
  
  // Read Mantine docs
  const mantinePath = path.join(__dirname, '..', 'build', 'docs', 'tokens.md');
  docs.mantine = await readTokenDocs(mantinePath);
  
  // Read custom docs
  const customPath = path.join(__dirname, '..', 'build', 'custom', 'tokens.md');
  docs.custom = await readTokenDocs(customPath);
  
  // Read brand docs
  const brandsDir = path.join(__dirname, '..', 'build', 'brands');
  try {
    const brands = await fs.readdir(brandsDir);
    for (const brand of brands) {
      const brandPath = path.join(brandsDir, brand);
      const stat = await fs.stat(brandPath);
      
      if (stat.isDirectory()) {
        const brandDocsPath = path.join(brandPath, 'tokens.md');
        const brandDocs = await readTokenDocs(brandDocsPath);
        if (brandDocs) {
          docs.brands[brand] = brandDocs;
        }
      }
    }
  } catch (error) {
    console.log('No brand documentation found');
  }
  
  // Generate Mantine section
  if (docs.mantine) {
    md += '## Mantine Tokens\n\n';
    md += 'Base design system tokens provided by Mantine.\n\n';
    
    const mantineTables = extractTokenTables(docs.mantine, 'mantine');
    const mantineCategories = {};
    
    mantineTables.forEach(table => {
      if (!mantineCategories[table.section]) {
        mantineCategories[table.section] = [];
      }
      mantineCategories[table.section].push(...table.rows);
    });
    
    Object.entries(mantineCategories).forEach(([category, tokens]) => {
      md += `### ${category}\n\n`;
      md += `<details>\n<summary>View ${tokens.length} ${category.toLowerCase()} tokens</summary>\n\n`;
      md += '| Token | Value | CSS Variable |\n';
      md += '|-------|-------|-------------|\n';
      tokens.forEach(token => {
        md += `| ${token.token} | ${token.value} | ${token.cssVar} |\n`;
      });
      md += '\n</details>\n\n';
    });
  }
  
  // Generate Custom section
  if (docs.custom) {
    md += '## Custom Extension Tokens\n\n';
    md += 'Additional tokens that extend the base design system.\n\n';
    
    const customTables = extractTokenTables(docs.custom, 'custom');
    const customCategories = {};
    
    customTables.forEach(table => {
      if (!customCategories[table.section]) {
        customCategories[table.section] = [];
      }
      customCategories[table.section].push(...table.rows);
    });
    
    Object.entries(customCategories).forEach(([category, tokens]) => {
      md += `### ${category}\n\n`;
      md += `<details>\n<summary>View ${tokens.length} ${category.toLowerCase()} tokens</summary>\n\n`;
      md += '| Token | Value | CSS Variable |\n';
      md += '|-------|-------|-------------|\n';
      tokens.forEach(token => {
        md += `| ${token.token} | ${token.value} | ${token.cssVar} |\n`;
      });
      md += '\n</details>\n\n';
    });
  }
  
  // Generate Brand sections
  if (Object.keys(docs.brands).length > 0) {
    md += '## Brand Tokens\n\n';
    md += 'Brand-specific design tokens for multi-brand support.\n\n';
    
    for (const [brand, brandDocs] of Object.entries(docs.brands)) {
      md += `### ${brand.charAt(0).toUpperCase() + brand.slice(1)} Brand\n\n`;
      
      const brandTables = extractTokenTables(brandDocs, brand);
      const brandCategories = {};
      
      brandTables.forEach(table => {
        if (!brandCategories[table.section]) {
          brandCategories[table.section] = [];
        }
        brandCategories[table.section].push(...table.rows);
      });
      
      Object.entries(brandCategories).forEach(([category, tokens]) => {
        md += `#### ${category}\n\n`;
        md += `<details>\n<summary>View ${tokens.length} ${category.toLowerCase()} tokens</summary>\n\n`;
        md += '| Token | Value | CSS Variable |\n';
        md += '|-------|-------|-------------|\n';
        tokens.forEach(token => {
          md += `| ${token.token} | ${token.value} | ${token.cssVar} |\n`;
        });
        md += '\n</details>\n\n';
      });
    }
  }
  
  // Add usage guide
  md += '## Token Usage Guide\n\n';
  md += '### Importing Tokens\n\n';
  md += '```css\n';
  md += '/* Import Mantine base tokens */\n';
  md += '@import "path/to/build/css/variables.css";\n\n';
  md += '/* Import custom extension tokens */\n';
  md += '@import "path/to/build/custom/variables.css";\n\n';
  md += '/* Import specific brand tokens */\n';
  md += '@import "path/to/build/brands/clearco/all.css";\n';
  md += '```\n\n';
  
  md += '### Using Tokens in CSS\n\n';
  md += '```css\n';
  md += '/* Mantine tokens */\n';
  md += '.component {\n';
  md += '  padding: var(--mantine-spacing-md);\n';
  md += '  color: var(--mantine-color-text);\n';
  md += '}\n\n';
  md += '/* Custom extension tokens */\n';
  md += '.hero {\n';
  md += '  font-size: var(--custom-typography-fontsize-jumbo);\n';
  md += '  margin-bottom: var(--custom-spacing-section);\n';
  md += '}\n\n';
  md += '/* Brand-specific tokens */\n';
  md += '.brand-element {\n';
  md += '  background: var(--clearco-brand-primary);\n';
  md += '  border-radius: var(--clearco-radius-lg);\n';
  md += '}\n';
  md += '```\n\n';
  
  md += '### Token Naming Conventions\n\n';
  md += '- **Mantine**: `--mantine-{category}-{property}-{variant}`\n';
  md += '- **Custom**: `--custom-{category}-{property}-{variant}`\n';
  md += '- **Brands**: `--{brand}-{category}-{property}-{variant}`\n\n';
  
  md += '### Available Prefixes\n\n';
  md += '| Token Set | Prefix | Example |\n';
  md += '|-----------|--------|----------|\n';
  md += '| Mantine Base | `mantine` | `--mantine-color-primary` |\n';
  md += '| Custom Extensions | `custom` | `--custom-spacing-page` |\n';
  
  if (Object.keys(docs.brands).length > 0) {
    Object.keys(docs.brands).forEach(brand => {
      md += `| ${brand.charAt(0).toUpperCase() + brand.slice(1)} Brand | \`${brand}\` | \`--${brand}-brand-primary\` |\n`;
    });
  }
  
  md += '\n---\n\n';
  md += '*Generated on ' + new Date().toISOString() + '*\n';
  
  // Write the unified documentation
  const outputPath = path.join(__dirname, '..', 'build', 'all-tokens.md');
  await fs.writeFile(outputPath, md, 'utf8');
  
  console.log('✅ Generated unified token documentation: build/all-tokens.md');
  
  // Also generate an HTML version for better navigation
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Design Tokens Reference</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background: #f5f5f5;
        }
        h1, h2, h3, h4 {
            color: #2c3e50;
            margin-top: 2rem;
        }
        h1 {
            border-bottom: 3px solid #3498db;
            padding-bottom: 0.5rem;
        }
        h2 {
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 0.3rem;
        }
        details {
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 1rem;
            margin: 1rem 0;
        }
        summary {
            cursor: pointer;
            font-weight: 600;
            color: #3498db;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        th, td {
            text-align: left;
            padding: 0.5rem;
            border-bottom: 1px solid #ecf0f1;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
        }
        code {
            background: #f4f4f4;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9em;
        }
        pre {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
        }
        pre code {
            background: none;
            color: inherit;
            padding: 0;
        }
        .toc {
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 1rem;
            margin: 2rem 0;
        }
        .toc a {
            color: #3498db;
            text-decoration: none;
        }
        .toc a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    ${md.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
       .replace(/`([^`]+)`/g, '<code>$1</code>')
       .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
       .replace(/^### (.*)/gm, '<h3>$1</h3>')
       .replace(/^## (.*)/gm, '<h2>$1</h2>')
       .replace(/^# (.*)/gm, '<h1>$1</h1>')
       .replace(/\n/g, '<br>\n')}
</body>
</html>`;
  
  const htmlPath = path.join(__dirname, '..', 'build', 'all-tokens.html');
  await fs.writeFile(htmlPath, htmlContent, 'utf8');
  
  console.log('✅ Generated HTML version: build/all-tokens.html');
}

// Run the generator
generateUnifiedDocs().catch(console.error);
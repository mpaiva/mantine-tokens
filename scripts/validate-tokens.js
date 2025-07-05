import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Token validation rules
const TOKEN_TYPES = [
  'color',
  'dimension',
  'fontFamily',
  'fontWeight',
  'duration',
  'cubicBezier',
  'number',
  'shadow',
  'gradient',
  'typography',
  'border',
  'transition',
  'string'
];

const errors = [];
const warnings = [];

// Helper to log with color
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Validate token structure
function validateToken(token, path, allTokens) {
  // Check for $value
  if (!token.$value && !token.$type && typeof token === 'object') {
    // Could be a group, check if it has nested tokens
    const hasNestedTokens = Object.values(token).some(
      v => typeof v === 'object' && (v.$value !== undefined || v.$type !== undefined)
    );
    if (!hasNestedTokens && !token.$description) {
      // Check if all children are token groups
      const allChildrenAreGroups = Object.values(token).every(
        v => typeof v === 'object' && !v.$value && !v.$type
      );
      if (!allChildrenAreGroups) {
        warnings.push(`Token at ${path} might be missing $value or might be a group`);
      }
    }
    return;
  }

  // Validate $type
  if (token.$value !== undefined) {
    if (!token.$type) {
      errors.push(`Token at ${path} has $value but missing $type`);
    } else if (!TOKEN_TYPES.includes(token.$type)) {
      warnings.push(`Token at ${path} has unknown $type: ${token.$type}`);
    }
  }

  // Validate references
  if (typeof token.$value === 'string' && token.$value.includes('{')) {
    const referencePattern = /\{([^}]+)\}/g;
    const references = [...token.$value.matchAll(referencePattern)];
    
    references.forEach(([full, ref]) => {
      const refPath = ref.split('.');
      let current = allTokens;
      
      for (const segment of refPath) {
        if (!current[segment]) {
          errors.push(`Token at ${path} references non-existent token: ${ref}`);
          break;
        }
        current = current[segment];
      }
    });
  }

  // Type-specific validations
  if (token.$type === 'color' && token.$value) {
    if (!isValidColor(token.$value)) {
      errors.push(`Token at ${path} has invalid color value: ${token.$value}`);
    }
  }

  if (token.$type === 'dimension' && token.$value) {
    if (!isValidDimension(token.$value)) {
      errors.push(`Token at ${path} has invalid dimension value: ${token.$value}`);
    }
  }

  if (token.$type === 'fontWeight' && token.$value) {
    if (!isValidFontWeight(token.$value)) {
      errors.push(`Token at ${path} has invalid fontWeight value: ${token.$value}`);
    }
  }
}

// Validate color values
function isValidColor(value) {
  // Skip references
  if (value.includes('{')) return true;
  
  // Hex colors
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/.test(value)) return true;
  
  // RGB/RGBA
  if (/^rgba?\(.+\)$/.test(value)) return true;
  
  // HSL/HSLA
  if (/^hsla?\(.+\)$/.test(value)) return true;
  
  // Named colors
  if (/^(transparent|black|white|red|green|blue|yellow|orange|purple|pink|gray|grey)$/.test(value)) return true;
  
  return false;
}

// Validate dimension values
function isValidDimension(value) {
  // Skip references
  if (value.includes('{')) return true;
  
  // Zero
  if (value === '0') return true;
  
  // Units
  if (/^-?\d*\.?\d+(px|rem|em|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc)$/.test(value)) return true;
  
  // Multiple values (for padding, margin)
  if (/^(-?\d*\.?\d+(px|rem|em|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc)\s*)+$/.test(value)) return true;
  
  return false;
}

// Validate font weight values
function isValidFontWeight(value) {
  // Skip references
  if (value.includes('{')) return true;
  
  // Numeric weights
  if (/^[1-9]00$/.test(value)) return true;
  
  // Named weights
  if (/^(normal|bold|lighter|bolder)$/.test(value)) return true;
  
  return false;
}

// Recursively walk through token structure
function walkTokens(obj, path = '', allTokens = obj) {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Check if this is a token or a group
      if (value.$value !== undefined || value.$type !== undefined) {
        validateToken(value, currentPath, allTokens);
      } else {
        // It's a group, recurse
        walkTokens(value, currentPath, allTokens);
      }
    }
  }
}

// Main validation function
async function validateTokens() {
  log('\n🔍 Validating design tokens...\n', 'blue');

  try {
    // Find all token files
    const tokensDir = path.join(__dirname, '..', 'tokens');
    const files = await findTokenFiles(tokensDir);
    
    log(`Found ${files.length} token files to validate\n`, 'blue');

    // Load and validate each file
    for (const file of files) {
      const relativePath = path.relative(tokensDir, file);
      log(`Checking ${relativePath}...`);
      
      try {
        const content = await fs.readFile(file, 'utf8');
        const tokens = JSON.parse(content);
        
        // Validate JSON structure
        if (typeof tokens !== 'object' || tokens === null) {
          errors.push(`${relativePath}: Root must be an object`);
          continue;
        }
        
        // Walk through and validate tokens
        walkTokens(tokens);
        
      } catch (err) {
        if (err instanceof SyntaxError) {
          errors.push(`${relativePath}: Invalid JSON - ${err.message}`);
        } else {
          errors.push(`${relativePath}: ${err.message}`);
        }
      }
    }

    // Report results
    console.log('\n' + '='.repeat(50) + '\n');

    if (errors.length === 0 && warnings.length === 0) {
      log('✅ All tokens are valid!', 'green');
    } else {
      if (warnings.length > 0) {
        log(`⚠️  ${warnings.length} warning(s) found:`, 'yellow');
        warnings.forEach(w => log(`   - ${w}`, 'yellow'));
      }

      if (errors.length > 0) {
        log(`\n❌ ${errors.length} error(s) found:`, 'red');
        errors.forEach(e => log(`   - ${e}`, 'red'));
        process.exit(1);
      }
    }

  } catch (error) {
    log(`\n❌ Validation failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Find all JSON files in tokens directory
async function findTokenFiles(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await findTokenFiles(fullPath, files);
    } else if (entry.name.endsWith('.json') && !entry.name.startsWith('$')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Run validation
validateTokens();
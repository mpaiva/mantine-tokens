// build.js
import StyleDictionary from 'style-dictionary';

// Define the transform function separately. Using a normal function (not an arrow)
// ensures that "this.dictionary" is available from the Style Dictionary context.
function kebabTransform(token, opts) {
  // Find the prefix token; assuming it's defined as "prefix" at the root level.
  const prefixToken = this.dictionary.allTokens.find(t => t.path.join('.') === 'prefix');
  const prefix = prefixToken ? prefixToken.value : 'mantine';
  // Build the name from the token's path, e.g. ['colors', 'black'] becomes "colors-black".
  return `${prefix}-${token.path.join('-')}`;
}

// Register a custom transform.
// Both the "transformer" and "transform" properties are set so that internal checks pass.
StyleDictionary.registerTransform({
  name: 'name/cti/kebabWithPrefix',
  type: 'name',
  matcher: function (token, opts) {
    return true; // Apply transformation to all tokens.
  },
  transformer: kebabTransform,
  transform: kebabTransform // Alias for backward compatibility.
});

// Define a fallback for the default CSS transforms. In some versions the built-in
// transform group (StyleDictionary.transformGroup.css) isn't exported, so we provide
// a fallback array of common built-in transform names.
const fallbackNames = ['attribute/cti', 'name/cti/kebab', 'color/hex'];
// Filter the fallback list to include only transforms that are registered.
const defaultCssTransforms = fallbackNames.filter(name => {
  return StyleDictionary.transform && typeof StyleDictionary.transform[name] === 'function';
});

// Create a transform group that uses the fallback default CSS transforms plus our custom transform.
StyleDictionary.registerTransformGroup({
  name: 'cssWithPrefix',
  transforms: defaultCssTransforms.concat(['name/cti/kebabWithPrefix'])
});

// Extend the Style Dictionary configuration.
const StyleDictionaryExtended = StyleDictionary.extend({
  source: [
    'tokens/_prefix.json',
    'tokens/_global-settings.json',
    'tokens/_global-colors.json',
    'tokens/_typography.json',
    'tokens/_radii.json',
    'tokens/_breakpoints.json',
    'tokens/_spacing.json',
    'tokens/_fontSizes.json',
    'tokens/_lineHeights.json',
    'tokens/_shadows.json',
    'tokens/_headings.json',
    'tokens/_primaryColors.json',
    'tokens/_secondaryColors.json',
    'tokens/theme-light.json',
    'tokens/theme-dark.json'
  ],
  platforms: {
    css: {
      transformGroup: 'cssWithPrefix',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables'
        }
      ]
    }
  }
});

// Build all platforms.
StyleDictionaryExtended.buildAllPlatforms();
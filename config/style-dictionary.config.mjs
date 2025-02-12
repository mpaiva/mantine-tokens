import StyleDictionary from "style-dictionary";

// Helper function to convert to kebab case
function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

// Register a custom name transform to add mantine prefix
StyleDictionary.registerTransform({
  name: "name/prefix/mantine",
  type: "name",
  transform: function (token) {
    const kebabPath = token.path.map((part) => toKebabCase(part));
    return `mantine-${kebabPath.join("-")}`.toLowerCase();
  },
});

// Register a transform for kebab-case naming
StyleDictionary.registerTransform({
  name: "name/kebab",
  type: "name",
  transform: function (token) {
    return token.path.map(toKebabCase).join("-");
  },
});

// Custom format for DTCG JSON output
StyleDictionary.registerFormat({
  name: "dtcg/json",
  format: function ({ dictionary }) {
    const transformTokens = (tokens) => {
      const result = {};

      tokens.forEach((token) => {
        if (token.value) {
          result[token.name] = {
            $value: token.value,
            $type: token.type || "string",
            $description: token.description || "",
          };
        }
      });

      return result;
    };

    return JSON.stringify(
      {
        $schema: "https://design-tokens.github.io/format/tokens.schema.json",
        tokens: transformTokens(dictionary.allTokens),
      },
      null,
      2
    );
  },
});

// Register a custom transform group
StyleDictionary.registerTransformGroup({
  name: "custom/mantine",
  transforms: ["name/kebab", "name/prefix/mantine", "color/hex", "size/rem"],
});

export default {
  log: "verbose",
  source: ["tokens/**/*.json"],
  parsers: [
    {
      pattern: /\.json$/,
      parse: ({ contents }) => JSON.parse(contents),
    },
  ],
  collisionPolicy: "error",
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "build/css/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
        },
      ],
    },
    dtcg: {
      transformGroup: "custom/mantine",
      buildPath: "build/dtcg/",
      files: [
        {
          destination: "tokens.json",
          format: "dtcg/json",
        },
      ],
    },
  },
  transform: {
    // Add any custom transforms here if needed
  },
};

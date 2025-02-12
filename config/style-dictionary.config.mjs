import StyleDictionary from "style-dictionary";

// Register a custom name transform to add mantine prefix
StyleDictionary.registerTransform({
  name: "name/prefix/mantine",
  type: "name",
  transform: function (token) {
    return `mantine-${token.path.join("-")}`.toLowerCase();
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
  transforms: ["name/prefix/mantine", "color/hex", "size/rem"],
});

export default {
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "custom/mantine",
      buildPath: "build/css/",
      files: [
        {
          destination: "variables.css",
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
};

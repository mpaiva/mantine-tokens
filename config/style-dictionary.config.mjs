import StyleDictionary from "style-dictionary";

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

export default {
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "build/css/",
      files: [
        {
          destination: "variables.css",
          format: "css/variables",
        },
      ],
    },
    dtcg: {
      transformGroup: "css",
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

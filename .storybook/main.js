
/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: [
    "../stories/Welcome.stories.js",
    "../stories/global/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../stories/brands/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../stories/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../stories/documentation/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y"
  ],
  framework: {
    name: "@storybook/html-vite",
    options: {}
  },
  staticDirs: ['../build', '../examples', '../.storybook'],
  viteFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        include: []
      }
    };
  }
};
export default config;
import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  "addons": [
    "@storybook/addon-a11y",
  ],
  "framework": "@storybook/web-components-vite",

  viteFinal: (config) => {
    config.define = {
      ...config.define,
      // ensure that we're using mocks not live data
      'import.meta.env.VITE_USE_MOCKS': JSON.stringify('true'),
    };
    return config;
  },
};
export default config;

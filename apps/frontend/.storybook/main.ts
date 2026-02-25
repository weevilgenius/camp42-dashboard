import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  "addons": [
    "@storybook/addon-a11y",
  ],
  "framework": "@storybook/web-components-vite",
};
export default config;

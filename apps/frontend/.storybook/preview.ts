import type { Preview } from '@storybook/web-components-vite';
import { registerIconLibrary } from '@awesome.me/webawesome/dist/webawesome.js';
import { LitElement } from 'lit';
import '@awesome.me/webawesome/dist/styles/themes/default.css';

// Apply Web Awesome theme classes to the document root
document.documentElement.classList.add('wa-theme-default', 'wa-palette-default', 'wa-brand-blue');

// Dark/light mode detection
const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
function manageDarkLightTheme() {
  document.documentElement.classList.toggle('wa-dark', darkModeQuery.matches);
}
manageDarkLightTheme();
darkModeQuery.addEventListener('change', manageDarkLightTheme);

// Silence Lit update warnings in development
LitElement.disableWarning?.('change-in-update');

// Configure Web Awesome icons to use Material Symbols
registerIconLibrary('material', {
  resolver: (name) => {
    const match = name.match(/^(.*?)(_(rounded|sharp))?$/);
    if (match) {
      return `https://cdn.jsdelivr.net/npm/@material-symbols/svg-400@0.32.0/${match[3] ?? 'outlined'}/${match[1]}.svg`;
    }
    return '';
  },
  mutator: (svg) => svg.setAttribute('fill', 'currentColor'),
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

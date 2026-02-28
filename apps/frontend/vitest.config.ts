import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // use happy-dom for DOM APIs (lighter than jsdom)
    environment: 'happy-dom',
    root: '.',
    include: ['tests/**/*.test.ts'],
    // suppress noisy Web Awesome / Lit warnings (see tests/setup.ts)
    setupFiles: ['tests/setup.ts'],
    // make describe/it/expect available without imports
    globals: true,
  },
});

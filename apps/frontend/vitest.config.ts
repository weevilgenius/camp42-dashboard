import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // use happy-dom for DOM APIs (lighter than jsdom)
    environment: 'happy-dom',
    root: '.',
    include: ['tests/**/*.test.ts'],
    // make describe/it/expect available without imports
    globals: true,
  },
});

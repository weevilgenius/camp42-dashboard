import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  // mirror the tsconfig.app.json path alias so Vitest can resolve @camp42/shared
  resolve: {
    alias: {
      '@camp42/shared': resolve(__dirname, '../../shared/src/index.ts'),
    },
  },
  test: {
    root: '.',
    include: ['tests/**/*.test.ts'],
  },
});

import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  // mirror the tsconfig.app.json path alias so @camp42/shared is resolved (and inlined by the build)
  resolve: {
    alias: {
      '@camp42/shared': resolve(import.meta.dirname, '../../shared/src/index.ts'),
    },
  },
  // SSR build bundles our source into one ESM file and leaves node_modules packages
  // as imports, which Firebase installs from package.json at deploy time
  build: {
    ssr: 'src/index.ts',
    outDir: 'dist',
    target: 'es2022',
    minify: true,
  },
  test: {
    root: '.',
    include: ['tests/**/*.test.ts'],
  },
});

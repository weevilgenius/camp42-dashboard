import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  clean: true,
  minify: true,
  // bundle (inline) the workspace package
  noExternal: ['@camp42/shared'],
});
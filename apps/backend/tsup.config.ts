import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  target: 'es2022',
  platform: 'node',
  format: ['esm'],
  clean: true,
  minify: true,
  tsconfig: 'tsconfig.app.json',
  // always inline the shared package
  noExternal: ['@camp42/shared'],
});
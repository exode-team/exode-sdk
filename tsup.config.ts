import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: { index: 'src/api/index.ts' },
    outDir: 'dist/api',
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: true,
  },
  {
    entry: { index: 'src/miniapp/index.ts' },
    outDir: 'dist/miniapp',
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: true,
  },
  {
    entry: { index: 'src/miniapp/react.ts' },
    outDir: 'dist/miniapp-react',
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    external: ['react'],
  },
  {
    entry: { miniapp: 'src/miniapp/index.ts' },
    outDir: 'dist/miniapp',
    format: ['iife'],
    globalName: 'ExodeMiniAppSDK',
    dts: false,
    clean: false,
    sourcemap: true,
    minify: true,
  },
])

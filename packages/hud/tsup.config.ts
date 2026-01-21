import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: [
    'react',
    '@thehoneyjar/sigil-anchor',
    '@thehoneyjar/sigil-fork',
    '@thehoneyjar/sigil-simulation',
    '@thehoneyjar/sigil-lens',
    '@thehoneyjar/sigil-diagnostics',
  ],
  treeshake: true,
})

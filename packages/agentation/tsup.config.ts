import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    wagmi: 'src/wagmi/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'wagmi', 'viem'],
  treeshake: true,
  splitting: false,
  minify: true,
  sourcemap: true,
})

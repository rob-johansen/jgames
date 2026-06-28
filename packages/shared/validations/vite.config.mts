import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'index.ts',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    target: 'esnext'
  },
  logLevel: 'silent',
  plugins: [
    react(),
    {
      apply: 'build',
      buildEnd(): void {
        this.emitFile({
          fileName: 'index.d.ts',
          source: 'export * from \'../index.ts\'',
          type: 'asset'
        })
        this.emitFile({
          fileName: 'index.d.mts',
          source: 'export * from \'../index.ts\'',
          type: 'asset'
        })
      },
      name: 'vite-plugin-dts'
    }
  ],
  resolve: {
    tsconfigPaths: true
  }
})

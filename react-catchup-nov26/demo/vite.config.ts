import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Separate build: no Redact alias can leak into the native React demos.
// Relative asset paths make this bundle work both locally and below a Pages prefix.
export default defineConfig({
  root: 'demo',
  base: './',
  plugins: [react({ compiler: true })],
  build: { outDir: '../public/demos', emptyOutDir: true, reportCompressedSize: false },
})

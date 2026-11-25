import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { redact } from '@tanstack/redact/vite'

export default defineConfig(({ mode }) => {
  const base = process.env.VITE_BASE_PATH || '/'
  const inspect = mode === 'inspect'
  const native = inspect || process.env.SLIDES_RUNTIME === 'react'
  const compiler = process.env.SLIDES_COMPILER !== 'off'

  return {
    base,
    build: {
      reportCompressedSize: false,
      ...(inspect && { minify: false, sourcemap: true }),
      outDir: process.env.SLIDES_OUT_DIR || 'dist',
    },
    ssr: { noExternal: true },
    plugins: [
      tanstackStart({
        router: { basepath: base },
        prerender: { enabled: mode === 'pages', crawlLinks: false, failOnError: true },
      }),
      react({ compiler }),
      !native && redact(),
    ],
  }
})

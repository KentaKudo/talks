import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { redact } from '@tanstack/redact/vite'

const base = process.env.VITE_BASE_PATH || '/'
export default defineConfig({
  base,
  build: { reportCompressedSize: false },
  ssr: { noExternal: true },
  plugins: [
    tanstackStart({
      router: { basepath: base },
      prerender: { enabled: true, crawlLinks: false, failOnError: true },
    }),
    react({ compiler: true }),
    redact(),
  ],
})

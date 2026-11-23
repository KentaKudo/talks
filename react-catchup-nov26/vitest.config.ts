import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'demo/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      include: ['src/deck/Deck.tsx', 'src/deck/navigation.ts', 'demo/Demos.tsx'],
      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
    },
  },
})

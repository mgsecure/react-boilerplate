import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
      exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**', 'server/**'],

      include: ['src/**/*.{tests,spec}.{js,jsx}']
  }
})

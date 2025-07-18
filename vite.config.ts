/// <reference types="vitest" />

import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  optimizeDeps: {
    include: ['html-to-image', 'recharts'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    fakeTimers: {
      toFake: ['Date', 'performance', 'setTimeout', 'setInterval'],
    },
  },
})

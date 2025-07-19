/// <reference types="vitest" />

import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  appType: 'spa',
  optimizeDeps: {
    include: ['html-to-image', 'recharts'],
  },
  css: {
    devSourcemap: true,
    // CSS 모듈 설정 제거 - Tailwind CSS와 충돌 방지
  },
  build: {
    sourcemap: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
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

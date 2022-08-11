// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    "@": resolve(__dirname, "./src")
  },
  build: {
    rollupOptions: {
      input: {
        // main: resolve(__dirname, 'index.html'),
        // demo1: resolve(__dirname, 'demo/demo1.html'),
        // demo2: resolve(__dirname, 'demo/demo2.html'),
        // demo3: resolve(__dirname, 'demo/demo3.html')
      }
    }
  }
})

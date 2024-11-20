import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    target: 'esnext'
  },
  server: {
    port: 3000
  }
})

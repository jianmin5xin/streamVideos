// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 后端服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 移除 /api 前缀
      }
    }
  }
})
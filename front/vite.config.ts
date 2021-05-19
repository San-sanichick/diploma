import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        port: 8080,
        proxy: {
            "/static": {
                target: "http://localhost:5000",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/static/, '')
            }
        }
    },
    resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
    }
})

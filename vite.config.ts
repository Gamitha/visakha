import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    plugins: [
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            'ziggy-js': path.resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    build: {
        manifest: true,
        outDir: 'public/build',
        rollupOptions: {
            input: 'resources/js/app.ts',
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'localhost',
        },
        // Proxy static files to backend (use 'backend' for Docker, 'localhost' for local dev)
        proxy: {
            '/storage': {
                target: process.env.BACKEND_URL || 'http://0.0.0.0:3000',
                changeOrigin: true,
            },
            '/build': {
                target: process.env.BACKEND_URL || 'http://0.0.0.0:3000',
                changeOrigin: true,
            },
        },
    },
});

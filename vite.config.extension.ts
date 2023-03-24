import { defineConfig, type UserConfigExport } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path'
import baseConfig from './vite.config'

// https://vitejs.dev/config/
const config: UserConfigExport = {
    ...baseConfig,
    build: {
        outDir: '.',
        lib: {
            entry: resolve(__dirname, 'src/environments/extension/index.ts'),
            fileName: 'openpose',
            formats: ['es'],
        },
        rollupOptions: {
            output: {
                entryFileNames: 'javascript/[name].js',
                chunkFileNames: 'javascript/lazy/[name].js',
                assetFileNames(assetInfo) {
                    if (assetInfo?.name?.match(/\.css/i)) return 'style.css'
                    return 'assets/[name]-[hash][extname]'
                },
                sourcemap: 'hidden',
            },
        },
    },
    plugins: [react(), visualizer()],
}

export default defineConfig(config)

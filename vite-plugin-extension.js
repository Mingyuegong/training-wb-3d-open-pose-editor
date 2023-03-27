import { resolve } from 'path'

export default function () {
    return {
        name: 'extension',
        config() {
            return {
                resolve: {
                    alias: [
                        {
                            find: /.*\.\/assets$/,
                            replacement: resolve(
                                __dirname,
                                'src/environments/extension/assets.ts'
                            ),
                        },
                    ],
                },
                build: {
                    outDir: '.',
                    emptyOutDir: false,
                    lib: {
                        entry: resolve(
                            __dirname,
                            'src/environments/extension/index.ts'
                        ),
                        fileName: 'openpose',
                        formats: ['es'],
                    },
                    rollupOptions: {
                        output: {
                            entryFileNames: 'javascript/[name].js',
                            chunkFileNames: 'javascript/lazy/[name].js',
                            assetFileNames(assetInfo) {
                                if (assetInfo?.name?.match(/\.css/i))
                                    return 'style.css'
                                return 'assets/[name]-[hash][extname]'
                            },
                            sourcemap: 'hidden',
                        },
                    },
                },
            }
        },
    }
}

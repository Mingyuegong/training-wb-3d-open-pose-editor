import { resolve } from 'path'

export default function () {
    return {
        name: 'extension',
        generateBundle(options, bundle) {
            for (const key in bundle) {
                const b = bundle[key]
                if (b.type !== 'chunk') {
                    continue
                }
                b.fileName = b.fileName.replace(/\?[0-9a-f]+$/, '')
            }
        },
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
                            chunkFileNames: 'javascript/lazy/[name].js?[hash]',
                            assetFileNames(assetInfo) {
                                if (assetInfo?.name?.match(/\.css/i))
                                    return 'style.css'
                                return 'assets/[name]-[hash][extname]'
                            },
                            // build error
                            // sourcemap: 'hidden',
                        },
                    },
                },
            }
        },
    }
}

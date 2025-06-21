import { UserConfig, defineConfig } from 'vite'
import path from 'path'
import builtins from 'builtin-modules'
import react from '@vitejs/plugin-react'
import fs from 'fs-extra'

const copyManifestPlugin = {
  name: 'copy-manifest',
  closeBundle: async () => {
    try {
      await fs.copy('manifest.json', 'dist/manifest.json')
      if (process.env.NODE_ENV === 'development') {
        await fs.writeFile('dist/.hotreload', '')
      }
      console.log('✅ manifest.json copied to dist/')
    } catch (err) {
      console.error('❌ Error copying manifest:', err)
    }
  },
}

export default defineConfig(async ({ mode }) => {
  const { resolve } = path
  const prod = mode === 'production'

  return {
    plugins: [react(), copyManifestPlugin],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/main.ts'),
        name: 'main',
        fileName: () => 'main.js',
        formats: ['cjs'],
      },
      minify: prod,
      sourcemap: prod ? false : 'inline',
      outDir: 'dist',
      cssCodeSplit: false,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/main.ts'),
        },
        output: {
          entryFileNames: 'main.js',
          assetFileNames: 'styles.css',
        },
        external: [
          'obsidian',
          'electron',
          '@codemirror/autocomplete',
          '@codemirror/collab',
          '@codemirror/commands',
          '@codemirror/language',
          '@codemirror/lint',
          '@codemirror/search',
          '@codemirror/state',
          '@codemirror/view',
          '@lezer/common',
          '@lezer/highlight',
          '@lezer/lr',
          ...builtins,
        ],
      },
    },
  } as UserConfig
})

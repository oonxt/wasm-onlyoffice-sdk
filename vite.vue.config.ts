import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    dts({
      include: ['src/vue/**'],
      outDir: 'dist',
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        'vue/index': resolve(__dirname, 'src/vue/index.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.mjs`,
    },
    rollupOptions: {
      external: ['vue'],
    },
    outDir: 'dist',
    emptyOutDir: false,  // Keep React build output
  },
})

import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    assetsInlineLimit: 0, // Don't inline large assets
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep media files in their own directory
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i.test(assetInfo.name)) {
            return 'media/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
})

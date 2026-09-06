import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor dependencies
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/@radix-ui') || id.includes('node_modules/cmdk')) {
            return 'vendor-ui';
          }
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts';
          }
          // Lazy-loaded pages as separate chunks
          if (id.includes('/pages/')) {
            const match = id.match(/pages\/([A-Za-z]+)\./);
            if (match) {
              return `page-${match[1].toLowerCase()}`;
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})

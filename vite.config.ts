import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  define: {
    'import.meta.env.VITE_CONVEX_URL': JSON.stringify(
      process.env.VITE_CONVEX_URL || "https://tangible-husky-835.eu-west-1.convex.cloud"
    ),
    'import.meta.env.VITE_CONVEX_SITE_URL': JSON.stringify(
      process.env.VITE_CONVEX_SITE_URL || "https://tangible-husky-835.eu-west-1.convex.site"
    ),
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://tangible-husky-835.eu-west-1.convex.site',
        changeOrigin: true,
      },
    },
  },
  appType: 'spa',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          convex: ['convex/react'],
          gsap: ['gsap'],
          motion: ['motion'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  server: {
    port: 5172,
    strictPort: true,
    proxy: {
      '/socket.io': {
        target: process.env.VITE_SOCKET_URL || 'http://localhost:3005',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiTarget = process.env.VITE_DEV_API_TARGET || 'http://localhost:8081';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/Add': apiTarget,
      '/DisplayAll': apiTarget,
      '/Delete': apiTarget,
      '/Update': apiTarget,
    },
  },
});

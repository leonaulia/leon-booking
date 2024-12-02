import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      axios: require.resolve('axios'), // Explicitly resolve axios
    },
  },
  build: {
    rollupOptions: {
      external: ['axios'], // Externalize axios to avoid bundling issues
    },
  },
});

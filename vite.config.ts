import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

<<<<<<< HEAD
=======
// https://vitejs.dev/config/
>>>>>>> 23e5646514ce803740a6f1a73c0d6034daaae02c
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
<<<<<<< HEAD
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('src/components/admin')) {
            return 'admin';
          }
        }
      }
    }
  }
});
=======
});
>>>>>>> 23e5646514ce803740a6f1a73c0d6034daaae02c

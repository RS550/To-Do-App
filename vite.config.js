import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Rolldown (Vite 8's bundler) requires manualChunks as a function,
        // not the object-map shorthand older Rollup/Vite versions accepted.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui/x-date-pickers') || id.includes('dayjs')) {
              return 'dates';
            }
            if (id.includes('@mui/icons-material')) {
              return 'mui-icons';
            }
            if (
              id.includes('@mui/material') ||
              id.includes('@emotion/react') ||
              id.includes('@emotion/styled')
            ) {
              return 'mui';
            }
          }
        },
      },
    },
  },
})
 

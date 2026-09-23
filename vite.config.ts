import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'charts',
              test: /node_modules[\\/](recharts|d3-|victory-vendor)/,
              priority: 10,
            },
            {
              name: 'state',
              test: /node_modules[\\/](@reduxjs|react-redux|reselect|immer)/,
              priority: 9,
            },
            {
              name: 'router',
              test: /node_modules[\\/]react-router/,
              priority: 8,
            },
            {
              name: 'toastify',
              test: /node_modules[\\/]react-toastify/,
              priority: 8,
            },
            {
              name: 'react',
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 7,
            },
            {
              name: 'vendor',
              test: /node_modules/,
              priority: 1,
            },
          ],
        },
      },
    },
  },
})

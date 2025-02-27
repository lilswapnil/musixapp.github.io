import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // base: '/musixapp.github.io/', // Comment out or remove this line for local development
  plugins: [react()],
})

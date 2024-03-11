import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // Listens on all IP addresses
    // host: '192.168.1.10', // Listens on a specific IP address
  },
});

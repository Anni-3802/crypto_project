import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Ensure frontend runs on port 5173
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Forward API requests to backend
        changeOrigin: true, // Adjust the Host header to match the target
        secure: false, // Allow non-SSL connections (for local dev)
      },
    },
  },
});

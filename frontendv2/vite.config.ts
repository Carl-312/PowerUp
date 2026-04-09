import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backendOrigin = process.env.POWERUP_BACKEND_ORIGIN ?? "http://127.0.0.1:3000";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: backendOrigin,
        changeOrigin: true,
      },
    },
  },
});

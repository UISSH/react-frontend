import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "localhost",
    port: 8080,
  },
  preview: {
    host: "localhost",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "UISSH",
      },
      registerType: "autoUpdate",
    }),
  ],
});

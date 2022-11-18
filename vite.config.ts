import react from "@vitejs/plugin-react";
import { defineConfig, splitVendorChunkPlugin } from "vite";

import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  build: {
    cssCodeSplit: true,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          axios: ["axios"],
          i18next: [
            "i18next",
            "i18next-http-backend",
            "i18next-browser-languagedetector",
          ],
          "react-hook-form": ["react-hook-form"],
        },
      },
    },
  },
  server: {
    host: "localhost",
    port: 8080,
  },
  plugins: [react(), visualizer(), splitVendorChunkPlugin()],
});

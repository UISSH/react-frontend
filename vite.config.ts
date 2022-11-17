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
          react: ["react"],
          "react-router-dom": ["react-router-dom"],
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

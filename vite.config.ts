import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
  plugins: [react()],
});

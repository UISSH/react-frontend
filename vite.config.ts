import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const getVitePWA = (mode: string) => {
  if (mode === "development") {
    return null;
  }
  return VitePWA({
    manifest: {
      name: "UISSH",
    },
    registerType: "autoUpdate",
  });
};
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    server: {
      host: "localhost",
      port: 8080,
    },
    preview: {
      host: "localhost",
      port: 8080,
    },
    plugins: [react(), getVitePWA(mode)],
  };
});

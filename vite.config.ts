import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Ajuste definitivo para a Vercel encontrar suas pastas
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: "client",
  build: {
    // Direciona a saída do site para a pasta que a Vercel espera
    outDir: "../dist",
    emptyOutDir: true,
  },
});

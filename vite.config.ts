import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // O path.resolve garante que o "@" aponte para a pasta certa independente de onde o site estiver rodando
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: "client",
  build: {
    // Ajustado para a Vercel encontrar a saída do site na raiz
    outDir: "../dist",
    emptyOutDir: true,
  },
});

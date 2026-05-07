import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@web": path.resolve(__dirname, "src"),
      "@domain": path.resolve(__dirname, "../../packages/domain/src"),
      "@i18n": path.resolve(__dirname, "../../packages/i18n/src"),
    },
  },
});

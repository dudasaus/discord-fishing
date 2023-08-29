import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "src/ui",
  base: "./",
  build: {
    outDir: "../../serverDist/static",
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ["src/ui/styles"],
      },
    },
  },
  envDir: "../../",
});

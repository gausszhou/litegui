import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: {
    port: 5174,
  },
  build: {
    outDir: "../../dist/editor",
    emptyOutDir: true,
  },
});

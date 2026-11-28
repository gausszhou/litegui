import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: {
    host: "127.0.0.1",
    port: 5179,
    strictPort: true
  },
  build: {
    outDir: "../../dist/vectorcraft",
    emptyOutDir: true
  }
});

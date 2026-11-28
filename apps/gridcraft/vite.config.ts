import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: {
    host: "127.0.0.1",
    port: 5184,
    strictPort: true
  },
  build: {
    outDir: "../../dist/gridcraft",
    emptyOutDir: true
  }
});

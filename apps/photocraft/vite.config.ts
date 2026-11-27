import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: {
    host: "127.0.0.1",
    port: 5176,
    strictPort: true,
  },
  build: {
    outDir: "../../dist/photocraft",
    emptyOutDir: true,
  },
});

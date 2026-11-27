import { resolve } from "node:path";
import { defineConfig } from "vite";

// core 自身只依赖 mitt，直接打进产物，保证 UMD 单文件可用。
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      name: "LiteGUICore",
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "umd"],
      fileName: (format) => (format === "es" ? "index.js" : "index.umd.cjs"),
    },
    rollupOptions: {
      output: {
        exports: "named",
      },
    },
  },
});

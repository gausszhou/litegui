import { resolve } from "node:path";
import { defineConfig } from "vite";

// ESM + CJS 构建：core 与 litegui 外置，避免打包出第二份 core 实例。
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: ["@gausszhou/litegui", "@gausszhou/litegui-core"],
    },
  },
});

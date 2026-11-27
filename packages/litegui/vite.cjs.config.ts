import { resolve } from "node:path";
import { defineConfig } from "vite";

// CJS 构建：与 ESM 一样外置 core（以及 mitt），保证 `require` 场景也只有一份 core 实例；
// 入口用 src/umd.ts（仅默认导出），`require("@gausszhou/litegui-components")` 直接拿到 LiteGUI 类；
// lodash-es 是纯 ESM，直接打进 CJS 产物，避免 require 失败。
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/umd.ts"),
      formats: ["cjs"],
      fileName: () => "index.cjs",
    },
    rollupOptions: {
      external: ["@gausszhou/litegui-core", "mitt"],
    },
  },
});

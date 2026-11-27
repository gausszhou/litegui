import { resolve } from "node:path";
import { defineConfig } from "vite";

// UMD/`<script>` 构建：自包含（core、lodash-es、mitt 全部打包），
// 保持 1.0 的单文件用法：`window.LiteGUI` 即可直接 `LiteGUI.init(...)`。
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      name: "LiteGUI",
      entry: resolve(__dirname, "src/umd.ts"),
      formats: ["umd"],
      fileName: () => "index.umd.cjs",
    },
  },
});

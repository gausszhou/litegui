import { resolve } from "node:path";
import { defineConfig } from "vite";

// 单文件版本：内联 litegui 与 CSS，并在加载时注入 tokens，方便 <script> 直接使用。
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      name: "LiteGUIElements",
      entry: resolve(__dirname, "src/umd.ts"),
      formats: ["umd"],
      fileName: () => "index.umd.cjs"
    }
  }
});

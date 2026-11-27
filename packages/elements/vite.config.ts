import { resolve } from "node:path";
import { defineConfig } from "vite";

const entry = {
  index: resolve(__dirname, "src/index.ts"),
  define: resolve(__dirname, "src/define.ts"),
  button: resolve(__dirname, "src/elements/button.ts"),
  checkbox: resolve(__dirname, "src/elements/checkbox.ts"),
  panel: resolve(__dirname, "src/elements/panel.ts"),
  dialog: resolve(__dirname, "src/elements/dialog.ts"),
  menu: resolve(__dirname, "src/elements/menu.ts")
};

// ESM 构建：litegui 外置，CSS 以字符串内联到 base 模块中。
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry,
      formats: ["es"],
      fileName: (_format, entryName) =>
        entryName === "index" || entryName === "define" ? `${entryName}.js` : `elements/${entryName}.js`
    },
    rollupOptions: {
      external: [/^@gausszhou\/litegui-components(\/.*)?$/],
      output: { chunkFileNames: "chunks/[name]-[hash].js" }
    }
  }
});

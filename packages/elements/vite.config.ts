import { resolve } from "node:path";
import { defineConfig } from "vite";

const entry = {
  index: resolve(__dirname, "src/index.ts"),
  define: resolve(__dirname, "src/define.ts"),
  area: resolve(__dirname, "src/elements/area.ts"),
  box: resolve(__dirname, "src/elements/box.ts"),
  button: resolve(__dirname, "src/elements/button.ts"),
  checkbox: resolve(__dirname, "src/elements/checkbox.ts"),
  "complex-list": resolve(__dirname, "src/elements/complex-list.ts"),
  console: resolve(__dirname, "src/elements/console.ts"),
  "context-menu": resolve(__dirname, "src/elements/context-menu.ts"),
  dialog: resolve(__dirname, "src/elements/dialog.ts"),
  dragger: resolve(__dirname, "src/elements/dragger.ts"),
  "header-bar": resolve(__dirname, "src/elements/header-bar.ts"),
  "image-editor": resolve(__dirname, "src/elements/image-editor.ts"),
  inspector: resolve(__dirname, "src/elements/inspector.ts"),
  "line-editor": resolve(__dirname, "src/elements/line-editor.ts"),
  list: resolve(__dirname, "src/elements/list.ts"),
  menu: resolve(__dirname, "src/elements/menu.ts"),
  "node-editor": resolve(__dirname, "src/elements/node-editor.ts"),
  panel: resolve(__dirname, "src/elements/panel.ts"),
  searchbox: resolve(__dirname, "src/elements/searchbox.ts"),
  slider: resolve(__dirname, "src/elements/slider.ts"),
  split: resolve(__dirname, "src/elements/split.ts"),
  "status-bar": resolve(__dirname, "src/elements/status-bar.ts"),
  table: resolve(__dirname, "src/elements/table.ts"),
  tabs: resolve(__dirname, "src/elements/tabs.ts"),
  "text-editor": resolve(__dirname, "src/elements/text-editor.ts"),
  timeline: resolve(__dirname, "src/elements/timeline.ts"),
  toolbar: resolve(__dirname, "src/elements/toolbar.ts"),
  tree: resolve(__dirname, "src/elements/tree.ts"),
  viewport: resolve(__dirname, "src/elements/viewport.ts")
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

import { resolve } from "node:path";
import { defineConfig } from "vite";

const entry = {
  index: resolve(__dirname, "src/index.ts"),
  area: resolve(__dirname, "src/entries/area.ts"),
  panel: resolve(__dirname, "src/entries/panel.ts"),
  split: resolve(__dirname, "src/entries/split.ts"),
  tabs: resolve(__dirname, "src/entries/tabs.ts"),
  dialog: resolve(__dirname, "src/entries/dialog.ts"),
  menu: resolve(__dirname, "src/entries/menu.ts"),
  button: resolve(__dirname, "src/entries/button.ts"),
  checkbox: resolve(__dirname, "src/entries/checkbox.ts"),
  slider: resolve(__dirname, "src/entries/slider.ts"),
  searchbox: resolve(__dirname, "src/entries/searchbox.ts"),
  list: resolve(__dirname, "src/entries/list.ts"),
  table: resolve(__dirname, "src/entries/table.ts"),
  console: resolve(__dirname, "src/entries/console.ts"),
  inspector: resolve(__dirname, "src/entries/inspector.ts"),
  tree: resolve(__dirname, "src/entries/tree.ts"),
  box: resolve(__dirname, "src/entries/box.ts"),
  "complex-list": resolve(__dirname, "src/entries/complex-list.ts"),
  "context-menu": resolve(__dirname, "src/entries/context-menu.ts"),
  dragger: resolve(__dirname, "src/entries/dragger.ts"),
  "line-editor": resolve(__dirname, "src/entries/line-editor.ts"),
  "header-bar": resolve(__dirname, "src/entries/header-bar.ts"),
  "status-bar": resolve(__dirname, "src/entries/status-bar.ts"),
  timeline: resolve(__dirname, "src/entries/timeline.ts"),
  toolbar: resolve(__dirname, "src/entries/toolbar.ts"),
  "node-editor": resolve(__dirname, "src/entries/node-editor.ts"),
  "text-editor": resolve(__dirname, "src/entries/text-editor.ts"),
  "image-editor": resolve(__dirname, "src/entries/image-editor.ts"),
  viewport: resolve(__dirname, "src/entries/viewport.ts")
};

// ESM 构建：core / lodash-es / mitt 外置，保证 core 只有一份实例。
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry,
      formats: ["es"],
      fileName: (_format, entryName) => (entryName === "index" ? "index.js" : `entries/${entryName}.js`)
    },
    rollupOptions: {
      external: ["@gausszhou/litegui-core", "lodash-es", "mitt"],
      output: {
        chunkFileNames: "chunks/[name]-[hash].js"
      }
    }
  }
});

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
      fileName: (_format, entryName) =>
        entryName === "index" ? "index.js" : `entries/${entryName}.js`,
    },
    rollupOptions: {
      external: ["@gausszhou/litegui-core", "lodash-es", "mitt"],
      output: {
        chunkFileNames: "chunks/[name]-[hash].js",
      },
    },
  },
});

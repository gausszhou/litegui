import { resolve } from "node:path";
import { defineConfig } from "vite";

const external = [/^vue$/, /^@gausszhou\/litegui-components(\/.*)?$/, /^@gausszhou\/litegui-core(\/.*)?$/];

const entry = {
  index: resolve(__dirname, "src/index.ts"),
  area: resolve(__dirname, "src/components/area.ts"),
  box: resolve(__dirname, "src/components/box.ts"),
  button: resolve(__dirname, "src/components/button.ts"),
  checkbox: resolve(__dirname, "src/components/checkbox.ts"),
  "complex-list": resolve(__dirname, "src/components/complex-list.ts"),
  console: resolve(__dirname, "src/components/console.ts"),
  "context-menu": resolve(__dirname, "src/components/context-menu.ts"),
  dialog: resolve(__dirname, "src/components/dialog.ts"),
  dragger: resolve(__dirname, "src/components/dragger.ts"),
  "header-bar": resolve(__dirname, "src/components/header-bar.ts"),
  "image-editor": resolve(__dirname, "src/components/image-editor.ts"),
  inspector: resolve(__dirname, "src/components/inspector.ts"),
  "line-editor": resolve(__dirname, "src/components/line-editor.ts"),
  list: resolve(__dirname, "src/components/list.ts"),
  menu: resolve(__dirname, "src/components/menu.ts"),
  "node-editor": resolve(__dirname, "src/components/node-editor.ts"),
  panel: resolve(__dirname, "src/components/panel.ts"),
  searchbox: resolve(__dirname, "src/components/searchbox.ts"),
  slider: resolve(__dirname, "src/components/slider.ts"),
  split: resolve(__dirname, "src/components/split.ts"),
  "status-bar": resolve(__dirname, "src/components/status-bar.ts"),
  table: resolve(__dirname, "src/components/table.ts"),
  tabs: resolve(__dirname, "src/components/tabs.ts"),
  "text-editor": resolve(__dirname, "src/components/text-editor.ts"),
  timeline: resolve(__dirname, "src/components/timeline.ts"),
  toolbar: resolve(__dirname, "src/components/toolbar.ts"),
  tree: resolve(__dirname, "src/components/tree.ts")
};

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry,
      formats: ["es"],
      fileName: (_format, entryName) => (entryName === "index" ? "index.js" : `components/${entryName}.js`)
    },
    rollupOptions: {
      external,
      output: { chunkFileNames: "chunks/[name]-[hash].js" }
    }
  }
});

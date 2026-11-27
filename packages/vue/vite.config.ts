import { resolve } from "node:path";
import { defineConfig } from "vite";

const external = [/^vue$/, /^@gausszhou\/litegui-components(\/.*)?$/, /^@gausszhou\/litegui-core(\/.*)?$/];

const entry = {
  index: resolve(__dirname, "src/index.ts"),
  button: resolve(__dirname, "src/components/button.ts"),
  checkbox: resolve(__dirname, "src/components/checkbox.ts"),
  slider: resolve(__dirname, "src/components/slider.ts"),
  panel: resolve(__dirname, "src/components/panel.ts"),
  dialog: resolve(__dirname, "src/components/dialog.ts"),
  menu: resolve(__dirname, "src/components/menu.ts"),
  table: resolve(__dirname, "src/components/table.ts"),
  list: resolve(__dirname, "src/components/list.ts"),
  split: resolve(__dirname, "src/components/split.ts"),
  searchbox: resolve(__dirname, "src/components/searchbox.ts"),
  tabs: resolve(__dirname, "src/components/tabs.ts"),
  dragger: resolve(__dirname, "src/components/dragger.ts"),
  console: resolve(__dirname, "src/components/console.ts")
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

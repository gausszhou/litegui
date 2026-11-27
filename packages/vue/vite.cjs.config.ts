import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["cjs"],
      fileName: () => "index.cjs"
    },
    rollupOptions: {
      external: [/^vue$/, /^@gausszhou\/litegui-components(\/.*)?$/, /^@gausszhou\/litegui-core(\/.*)?$/],
      output: { exports: "named" }
    }
  }
});

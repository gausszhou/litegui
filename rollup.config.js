import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";

export default [
  {
    input: "src/styles/index.scss",
    output: { file: "lib/litegui.css" },
    plugins: [
      postcss({
        extract: true,
        use: ["sass"]
      })
    ]
  },
  {
    input: "src/index.ts",
    output: [
      {
        format: "es",
        file: "lib/litegui.esm.js",
        sourcemap: true
      },
      {
        format: "umd",
        file: "lib/litegui.umd.cjs",
        name: "LiteGUI",
        exports: "default",
        sourcemap: true
      }
    ],
    plugins: [typescript()],
    onwarn() {
      // Keep the build output focused; type checking is a separate step.
      return;
    }
  },
  {
    input: {
      area: "src/entries/area.ts",
      panel: "src/entries/panel.ts",
      split: "src/entries/split.ts",
      tabs: "src/entries/tabs.ts",
      dialog: "src/entries/dialog.ts",
      menu: "src/entries/menu.ts",
      button: "src/entries/button.ts",
      checkbox: "src/entries/checkbox.ts",
      slider: "src/entries/slider.ts",
      searchbox: "src/entries/searchbox.ts",
      list: "src/entries/list.ts",
      table: "src/entries/table.ts",
      console: "src/entries/console.ts"
    },
    output: {
      format: "es",
      dir: "lib/entries",
      entryFileNames: "[name].js",
      chunkFileNames: "chunks/[name]-[hash].js"
    },
    plugins: [typescript()],
    onwarn() {
      return;
    }
  }
];

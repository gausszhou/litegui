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
  }
];

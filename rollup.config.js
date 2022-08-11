import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import scss from 'rollup-plugin-scss'
export default [
  {
    input: "src/index.ts",
    output: [
      {
        format: "umd",
        file: "lib/bundle.umd.js",
        name: "LiteGUI"
      }
    ],
    plugins: [typescript(), postcss()]
  },
  {
    input: "src/index.ts",
    output: [
      {
        format: "esm",
        file: "lib/bundle.esm.js"
      }
    ],
    plugins: [typescript(), postcss(),scss()]
  }
];
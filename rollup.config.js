import { uglify } from "rollup-plugin-uglify";
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
// import scss from 'rollup-plugin-scss';
export default [
  {
    input: "src/index",
    output: [
      {
        format: "umd",
        file: "lib/bundle.umd.js",
        name: "LiteGUI"
      },
      {
        format: "esm",
        file: "lib/bundle.esm.js"
      }
    ],
    plugins: [uglify(), typescript(), postcss()]
  }
];
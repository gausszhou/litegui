import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

export default [
  {
    input: 'src/styles/index.scss',
    output: { file: 'lib/index.css' },
    plugins: [
      postcss({
        extract: true,
        use: ['sass']
      })
    ]
  },
  {
    input: "src/index.ts",
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
    plugins: [typescript()],
    onwarn() {
      // 完全忽略所有警告
      return;
    }
  }
];
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

// 与 litegraph 保持一致的宽松起步策略：先把真正影响运行的规则设为 error，
// 历史写法（var / function / any）暂时关闭，后续版本再逐步收紧。
export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
      "docs/.vitepress/cache/**",
      "docs/.vitepress/dist/**",
      "docs/api/**",
      "artifacts/**",
      "test-results/**",
      "playwright-report/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-var": "off",
      "prefer-const": "off",
      "prefer-rest-params": "off",
      "prefer-spread": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      // 上游 API 仍以 `Function` 作为回调类型，等类型收敛后替换为具体签名
      "@typescript-eslint/no-unsafe-function-type": "off",
      // Inspector/Tree 与示例页面有意保留 @ts-nocheck（已在文档与注释中登记）
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { args: "none", caughtErrors: "none", varsIgnorePattern: "^_" },
      ],
      "no-useless-assignment": "warn",
      "no-empty": ["warn", { allowEmptyCatch: true }],
    },
  },
);

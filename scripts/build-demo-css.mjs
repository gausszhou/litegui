#!/usr/bin/env node
/**
 * 生成文档站专用的 LiteGUI 演示样式：
 *   1. 编译 packages/components/src/styles/index.scss；
 *   2. 给所有选择器加 `.lg-demo` 前缀（`:root` 主题变量保持全局），
 *      并丢弃 body/html 级别的全局 reset，避免污染 VitePress；
 *   3. 输出到 docs/.vitepress/theme/generated/litegui-demo.css。
 *
 * 这样文档站可以原样渲染组件，而不会改掉站点自身的标题、链接、输入框样式。
 * 修改库内 SCSS 后需要重新执行：pnpm docs:styles
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import * as sass from "sass";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "packages/components/src/styles/index.scss");
const outFile = join(root, "docs/.vitepress/theme/generated/litegui-demo.css");
const PREFIX = ".lg-demo";

const compiled = sass.compile(source, { style: "expanded" });

const result = await postcss([
  {
    postcssPlugin: "litegui-demo-scope",
    Once(cssRoot) {
      cssRoot.walkRules((rule) => {
        const parent = rule.parent;
        if (parent?.type === "atrule" && /keyframes$/i.test(parent.name)) return;

        const selectors = [];
        selectorParser((parsed) => {
          for (const selector of parsed.nodes) {
            const text = selector.toString().trim();
            if (!text) continue;
            // 主题 token 保持全局：变量名都带 --lg- 前缀，不会和站点冲突
            if (text === ":root" || text.startsWith(":root[")) {
              selectors.push(text);
              continue;
            }
            // 文档站自己的 html/body 不能被 LiteGUI 的 reset 覆盖
            if (/^(html|body)(\W|$)/.test(text)) continue;
            selectors.push(`${PREFIX} ${text}`);
          }
        }).processSync(rule.selector);

        if (!selectors.length) rule.remove();
        else rule.selector = selectors.join(", ");
      });
    },
  },
]).process(compiled.css, { from: source });

const css = `/* 由 scripts/build-demo-css.mjs 生成，请勿手动修改。\n * 源文件：${relative(root, source)}\n */\n${result.css}\n`;

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, css);

const rules = result.root.nodes.filter((node) => node.type === "rule").length;
console.log(`✓ ${relative(root, outFile)}`);
console.log(`  ${(css.length / 1024).toFixed(2)} kB, ${rules} top-level rules, prefix "${PREFIX}"`);

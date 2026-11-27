#!/usr/bin/env node
/**
 * 生成 Web Components 包所需的样式：
 *   - tokens.css    :root / [data-lg-theme] 主题变量，供文档页全局引入
 *   - elements.css  : 去掉 html/body/:root 的组件样式，供每个 shadow root adopt
 *
 * 与 docs 的 `.lg-demo` 前缀脚本同一思路：LiteGUI 的 SCSS 本身以 .lite* 类为主，
 * shadow 里只需去掉全局 reset，不需要逐条加前缀。
 *
 * 用法：pnpm elements:styles
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import * as sass from "sass";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "packages/components/src/styles/index.scss");
const outDir = join(root, "packages/elements/src/styles/generated");

const compiled = sass.compile(source, { style: "expanded" });

const tokens = compiled.css.match(/:root(?:\[[^\]]*\])?\s*\{[^}]*\}/g) ?? [];

const result = await postcss([
  {
    postcssPlugin: "litegui-elements-css",
    Once(cssRoot) {
      cssRoot.walkRules(rule => {
        const parent = rule.parent;
        if (parent?.type === "atrule" && /keyframes$/i.test(parent.name)) return;

        const kept = [];
        for (const selector of rule.selector.split(/,(?![^(]*\))/)) {
          const text = selector.trim();
          if (!text) continue;
          // 文档级 reset 与主题变量不进 shadow 样式
          if (/^(html|body)(\W|$)/.test(text)) continue;
          if (text === ":root" || text.startsWith(":root[")) continue;
          kept.push(text);
        }
        if (!kept.length) rule.remove();
        else rule.selector = kept.join(", ");
      });
    }
  }
]).process(compiled.css, { from: source });

const banner = `/* 由 scripts/build-elements-css.mjs 生成，请勿手改。 */\n`;

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "tokens.css"), `${banner}${tokens.join("\n\n")}\n`);
writeFileSync(join(outDir, "elements.css"), `${banner}${result.css}\n`);

console.log(`✓ ${relative(root, join(outDir, "tokens.css"))} (${tokens.length} token blocks)`);
console.log(`✓ ${relative(root, join(outDir, "elements.css"))} (${(result.css.length / 1024).toFixed(2)} kB)`);

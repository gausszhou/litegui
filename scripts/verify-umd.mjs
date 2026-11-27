// 校验 UMD 产物：在无 module/exports/define 的 VM 全局中加载
// core 与 litegui 的 UMD，确认全局命名空间与 API 可用。
import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";

const root = process.cwd();
const packagesDir = join(root, "packages");

const sandbox = { console, window: {} };
const context = vm.createContext(sandbox);
const run = (file) => vm.runInContext(readFileSync(file, "utf8"), context, { filename: file });
const failures = [];

run(join(packagesDir, "core/dist/index.umd.cjs"));
const core = sandbox.LiteGUICore;
if (!core) {
  failures.push("core UMD 未挂载 window.LiteGUICore");
} else {
  for (const name of ["EventMitter", "Widget", "coreState", "bind", "sizeToCSS"]) {
    if (!(name in core)) failures.push(`core UMD 缺少导出 ${name}`);
  }
  console.log(`core UMD: LiteGUICore exposes ${Object.keys(core).length} exports`);
}

run(join(packagesDir, "litegui/dist/index.umd.cjs"));
const LiteGUI = sandbox.LiteGUI;
if (typeof LiteGUI !== "function") {
  failures.push("litegui UMD 未挂载 window.LiteGUI 构造函数");
} else {
  for (const name of ["Area", "Panel", "Dialog", "Table", "Menu", "init", "add", "setTheme"]) {
    if (typeof LiteGUI[name] !== "function") failures.push(`LiteGUI.${name} 不可用`);
  }
  console.log(`litegui UMD: LiteGUI 暴露 ${Object.keys(LiteGUI).length} 个静态成员`);
}

run(join(packagesDir, "elements/dist/index.umd.cjs"));
const elements = sandbox.LiteGUIElements ?? sandbox.window.LiteGUIElements;
if (!elements) {
  failures.push("elements UMD 未挂载 window.LiteGUIElements");
} else {
  if (typeof elements.defineElements !== "function") failures.push("elements UMD 缺少 defineElements");
  const tags = Object.keys(elements.ELEMENT_TAGS ?? {});
  for (const tag of ["litegui-button", "litegui-checkbox", "litegui-panel", "litegui-dialog"]) {
    if (!tags.includes(tag)) failures.push(`elements UMD 缺少 ${tag}`);
  }
  console.log(`elements UMD: ${tags.length} 个自定义元素`);
}

if (failures.length) {
  console.error("\nUMD 校验失败：");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log("\nUMD 校验通过（core + litegui 自包含单文件）");

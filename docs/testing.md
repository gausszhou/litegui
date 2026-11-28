---
title: 测试
description: 单元测试、覆盖率与 Playwright 端到端测试
---

# 测试

## 命令

在仓库根目录执行：

```bash
pnpm typecheck      # 各包 TypeScript 0 错误
pnpm lint           # ESLint flat config
pnpm test           # Vitest + jsdom
pnpm test:coverage  # 覆盖率与门槛
pnpm test:e2e       # Playwright（Chrome + Firefox）
pnpm bench          # Table 基准
```

## 单元测试

测试集中在 `packages/tests/src`，使用 Vitest + jsdom，并通过别名直接指向各包源码，
因此覆盖率统计的是 `packages/core/src` 与 `packages/components/src`。

公共约定：

- 组件 DOM 操作通过 `root` 查询；
- 事件用 `dispatchEvent` 或直接调用公开方法；
- 每个测试结束后由 `packages/tests/src/setup.ts` 清理 `body`/`head`。

示例：

```ts
import { describe, expect, it, vi } from "vitest";
import { Button } from "@gausszhou/litegui-components";

it("clicks", () => {
  const callback = vi.fn();
  const button = new Button("Save", { callback });
  button.content.click();
  expect(callback).toHaveBeenCalledOnce();
});
```

覆盖率门槛在 `packages/tests/vite.config.ts`：statements/functions/lines ≥ 70%，branches ≥ 65%。
`Inspector`/`Tree`（`packages/components/src/components/{Inspector,Tree}.ts`）作为 experimental 暂不纳入覆盖率统计。

## 端到端测试

`packages/tests/e2e/` 下按应用拆分：`vscode.spec.ts`、`blender.spec.ts`、`photocraft.spec.ts`、`gridcraft.spec.ts`、`vectorcraft.spec.ts`、`lightcraft.spec.ts`、`filmcraft.spec.ts`、`cadcraft.spec.ts` 覆盖对应示例应用，
`docs.spec.ts` 逐个加载文档站的 18 个组件页，确认 demo 挂载、无运行时错误，
并校验画廊数量、二级菜单对齐与对话框容器。
vscode / blender / photocraft / gridcraft / vectorcraft / lightcraft / filmcraft / cadcraft 各自是独立 app，Playwright 会分别启动 dev server（5173 / 5175 / 5176 / 5177 / 5179 / 5180 / 5181 / 5184），文档站使用 5178。
使用系统 Chrome，并需要下载 Firefox：

```bash
pnpm test:e2e
# 首次：pnpm --filter @gausszhou/litegui-tests e2e:install
```

新增页面测试时，优先使用稳定的 class（`.lg-area`、`.lg-dialog`、`.lg-menu__panel`）而不是文本选择器。

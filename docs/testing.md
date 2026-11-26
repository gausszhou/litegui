---
title: 测试
description: 单元测试、覆盖率与 Playwright 端到端测试
---

# 测试

## 命令

```bash
npm run typecheck      # TypeScript 0 错误
npm test               # Vitest + jsdom
npm run test:coverage  # 覆盖率与门槛
npm run test:e2e       # Playwright（Chrome + Firefox）
npm run bench          # Table 基准
```

## 单元测试

测试位于 `tests/`，使用 Vitest + jsdom。公共约定：

- 组件 DOM 操作通过 `root` 查询；
- 事件用 `dispatchEvent` 或直接调用公开方法；
- 每个测试结束后由 `tests/setup.ts` 清理 `body`/`head`。

示例：

```ts
import { describe, expect, it, vi } from "vitest";
import { Button } from "../src/packages/Button";

it("clicks", () => {
  const callback = vi.fn();
  const button = new Button("Save", { callback });
  button.content.click();
  expect(callback).toHaveBeenCalledOnce();
});
```

覆盖率门槛在 `vitest.config.ts`：statements/functions/lines ≥ 70%，branches ≥ 65%。`Inspector`/`Tree` 作为 experimental 暂不纳入覆盖率统计。

## 端到端测试

`e2e/pages.spec.ts` 覆盖 demo、editor、菜单、对话框、表格、Tabs 与移动端布局。Playwright 配置使用系统 Chrome，并下载 Firefox：

```bash
npx playwright install firefox
npm run test:e2e
```

新增页面测试时，优先使用稳定的 class（`.litearea`、`.litedialog`、`.lite-menu-panel`）而不是文本选择器。

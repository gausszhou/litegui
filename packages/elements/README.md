# @gausszhou/litegui-elements

LiteGUI 的可选 **Web Components 适配层**：用 Custom Elements + Shadow DOM 包装 `@gausszhou/litegui-components` 的类 API，让组件可以在纯 HTML 或任意框架里以标签使用。

```html
<lg-button label="保存"></lg-button>
<lg-checkbox checked></lg-checkbox>

<lg-panel heading="属性" height="160">
  <div>light DOM 内容通过 slot 投影</div>
</lg-panel>

<lg-dialog heading="设置" width="320" height="190" open closable>
  <div>对话框内容</div>
</lg-dialog>
```

## 安装

```bash
pnpm add @gausszhou/litegui-components @gausszhou/litegui-elements
```

```ts
import "@gausszhou/litegui-elements/tokens.css";
import "@gausszhou/litegui-elements";
```

也可以按需注册：

```ts
import { defineElements } from "@gausszhou/litegui-elements/define";
defineElements();
```

或只引入单个元素类，自行 `customElements.define`：

```ts
import { LiteGuiButtonElement } from "@gausszhou/litegui-elements/button";
customElements.define("my-button", LiteGuiButtonElement);
```

## 元素

已覆盖 `packages/components` 的全部组件（28 个标签）：

| 分类             | 标签                                                                                                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 基础控件与数据   | `<lg-button>`、`<lg-checkbox>`、`<lg-slider>`、`<lg-searchbox>`、`<lg-dragger>`、`<lg-tabs>`、`<lg-list>`、`<lg-table>`、`<lg-console>`、`<lg-complex-list>`、`<lg-tree>`、`<lg-inspector>`、`<lg-line-editor>` |
| 布局             | `<lg-area>`、`<lg-split>`、`<lg-box>`、`<lg-context-menu>`                                                                                                                 |
| 面板与工作区     | `<lg-panel>`、`<lg-dialog>`、`<lg-menu>`、`<lg-menu-item>`、`<lg-header-bar>`、`<lg-status-bar>`、`<lg-timeline>`、`<lg-toolbar>`、`<lg-node-editor>`、`<lg-text-editor>`、`<lg-image-editor>` |

属性 / 事件对照表和 JSON 数据示例见[文档](https://gausszhou.github.io/litegui/docs/web-components)。

事件都是 `bubbles: true` + `composed: true` 的 `CustomEvent`，数据在 `event.detail`。
标题属性使用 `heading`，避免与全局 `title`（tooltip）冲突；HeaderBar / ImageEditor 的文案复用标准 `title`。

## 主题

`tokens.css` 在文档级引入一次；在 `<html>` 上切换 `data-lg-theme="light"` 即可切换浅色/深色。
CSS 变量会穿透 Shadow DOM。

## 单文件

`dist/index.umd.cjs` 是自包含构建，加载后自动注册全部元素并注入 tokens：

```html
<script src="./node_modules/@gausszhou/litegui-elements/dist/index.umd.cjs"></script>
```

## 限制

- 仅客户端：不支持 SSR / Declarative Shadow DOM；
- 模态框尚未适配 Shadow DOM；
- 浮层元素不能放在带 `transform` / `filter` / `contain` 的祖先里；
- Canvas 元素（`<lg-line-editor>` / `<lg-timeline>`）需要真实 canvas，jsdom 下要 mock `getContext`；
- 布局组件是薄适配：`<lg-area>` 用递归二分实现多 section，`<lg-split>` 用命名插槽分发子元素；
- `<lg-node-editor>` 的 `nodes` / `links`、`<lg-complex-list>` 的删除、`<lg-text-editor>` 的输入不会自动回写 attribute，请监听事件维护状态。

文档：https://gausszhou.github.io/litegui/docs/web-components

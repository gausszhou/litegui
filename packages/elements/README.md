# @gausszhou/litegui-elements

LiteGUI 的可选 **Web Components 适配层**：用 Custom Elements + Shadow DOM 包装 `@gausszhou/litegui-components` 的类 API，让组件可以在纯 HTML 或任意框架里以标签使用。

```html
<litegui-button label="保存"></litegui-button>
<litegui-checkbox checked></litegui-checkbox>

<litegui-panel heading="属性" height="160">
  <div>light DOM 内容通过 slot 投影</div>
</litegui-panel>

<litegui-dialog heading="设置" width="320" height="190" open closable>
  <div>对话框内容</div>
</litegui-dialog>
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

| 标签 | 属性 | 事件 |
| --- | --- | --- |
| `<litegui-button>` | `label`、`size`、`disabled` | `litegui-click` |
| `<litegui-checkbox>` | `checked`、`disabled` | `litegui-change` |
| `<litegui-panel>` | `heading`、`height`、`closable` | `litegui-close` |
| `<litegui-dialog>` | `heading`、`width`、`height`、`open`、`closable` | `litegui-close` |
| `<litegui-menu>` | 子元素 `<litegui-menu-item label>` | `litegui-select` |

事件都是 `bubbles: true` + `composed: true` 的 `CustomEvent`，数据在 `event.detail`。
标题属性使用 `heading`，避免与全局 `title`（tooltip）冲突。

## 主题

`tokens.css` 在文档级引入一次；在 `<html>` 上切换 `data-lg-theme="light"` 即可切换浅色/深色。
CSS 变量会穿透 Shadow DOM。

## 单文件

`dist/index.umd.cjs` 是自包含构建，加载后自动注册元素并注入 tokens：

```html
<script src="./node_modules/@gausszhou/litegui-elements/dist/index.umd.cjs"></script>
```

## 限制

- 仅客户端：不支持 SSR / Declarative Shadow DOM；
- 模态框尚未适配 Shadow DOM；
- 浮层元素不能放在带 `transform` / `filter` / `contain` 的祖先里；
- 当前覆盖 Button / Checkbox / Panel / Dialog / Menu，其余元素逐步补齐。

文档：https://gausszhou.github.io/litegui/docs/web-components

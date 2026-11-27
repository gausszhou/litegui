# Web Components

`@gausszhou/litegui-elements` 是 LiteGUI 的可选 **Web Components 适配层**：底层仍然是 `@gausszhou/litegui-components` 的类 API，外层用 Custom Elements + Shadow DOM 包一层，让你可以在任意页面里用标签直接使用组件。

它适合：

- 纯 HTML / 服务端模板里嵌入 LiteGUI，不需要构建工具；
- 在 React 19、Vue、Angular、Svelte 等框架里当作原生元素消费；
- 需要 Shadow DOM 样式隔离，避免与页面全局 CSS 互相污染。

> 适配层不是重写。类 API（`new LiteGUI.Button()` 等）仍是唯一事实来源，元素只负责属性/事件映射。需要完整控制时，可通过元素的 `.component` 拿到原生实例。

## 安装

```bash
pnpm add @gausszhou/litegui-components @gausszhou/litegui-elements
```

```ts
// 1. 文档级主题变量（一次即可）
import "@gausszhou/litegui-elements/tokens.css";

// 2. 注册全部元素；也可以只注册子集：
//    import { defineElements } from "@gausszhou/litegui-elements/define";
import "@gausszhou/litegui-elements";
```

注册后即可在 HTML 中直接写标签。元素默认使用 Shadow DOM，组件样式不会泄漏到页面，页面样式也不会影响组件内部。

## 实时示例

下面的示例就是页面里的真实元素：

<div class="wc-demo">
  <litegui-button label="保存"></litegui-button>
  <litegui-button label="Small" size="small"></litegui-button>
  <litegui-button label="禁用" disabled></litegui-button>
  <litegui-checkbox checked></litegui-checkbox>
</div>

```html
<litegui-button label="保存"></litegui-button>
<litegui-button label="Small" size="small"></litegui-button>
<litegui-button label="禁用" disabled></litegui-button>
<litegui-checkbox checked></litegui-checkbox>
```

Panel 的默认插槽会投影到内容区：

<div class="wc-demo">
  <litegui-panel heading="属性" height="160">
    <div style="padding: 12px">这段内容来自 light DOM，被 slot 投影进面板。</div>
  </litegui-panel>
</div>

```html
<litegui-panel heading="属性" height="160">
  <div>这段内容来自 light DOM，被 slot 投影进面板。</div>
</litegui-panel>
```

Dialog 用 `open` 控制显示，关闭按钮会移除 `open` 并派发 `litegui-close`：

<div class="wc-demo">
  <litegui-dialog heading="设置" width="320" height="190" open closable>
    <div style="padding: 8px">对话框内容同样来自默认插槽。</div>
  </litegui-dialog>
</div>

```html
<litegui-dialog heading="设置" width="320" height="190" open closable>
  <div>对话框内容同样来自默认插槽。</div>
</litegui-dialog>
```

Menu 用嵌套的 `<litegui-menu-item>` 声明菜单树，点击叶子项派发 `litegui-select`：

<div class="wc-demo wc-menu-demo">
  <litegui-menu>
    <litegui-menu-item label="文件">
      <litegui-menu-item label="新建文本文件"></litegui-menu-item>
      <litegui-menu-item label="打开"></litegui-menu-item>
    </litegui-menu-item>
  </litegui-menu>
</div>

```html
<litegui-menu>
  <litegui-menu-item label="文件">
    <litegui-menu-item label="新建文本文件"></litegui-menu-item>
    <litegui-menu-item label="打开"></litegui-menu-item>
  </litegui-menu-item>
</litegui-menu>
```

## 已实现的元素

| 标签                 | 属性                                                        | 事件                             |
| -------------------- | ----------------------------------------------------------- | -------------------------------- |
| `<litegui-button>`   | `label`、`size`（`default` / `small` / `mini`）、`disabled` | `litegui-click` → `{ label }`    |
| `<litegui-checkbox>` | `checked`、`disabled`                                       | `litegui-change` → `{ checked }` |
| `<litegui-panel>`    | `heading`、`height`、`closable`                             | `litegui-close`                  |
| `<litegui-dialog>`   | `heading`、`width`、`height`、`open`、`closable`            | `litegui-close`                  |

约定：

- 简单值走 attribute，复杂数据（后续的表格列、菜单树）走 property；
- 事件统一 `litegui-*`，`bubbles: true`、`composed: true`，数据在 `event.detail`；
- 标题属性叫 `heading` 而不是 `title`，避免和全局 `title`（tooltip）冲突；
- 布尔 attribute 用存在性表示：`disabled`、`checked`、`open`、`closable`。

## 主题与深色模式

`tokens.css` 只在文档级定义一次：

```css
:root {
  --lg-color-bg: #181818; /* 默认深色 */
}
:root[data-lg-theme="light"] {
  --lg-color-bg: #f5f6f8;
}
```

在 `<html>` 上切换 `data-lg-theme` 即可同时影响页面里的所有元素——CSS 变量会穿透 Shadow DOM：

```ts
document.documentElement.dataset.lgTheme = "light";
```

文档站会自动把 VitePress 的深色模式同步到 `data-lg-theme`。

## 在框架里使用

React 19 原生支持 Custom Elements，事件用 `on` + 小写事件名：

```tsx
<litegui-button label="保存" onlitegui-click={event => console.log(event.detail)} />
```

Vue 需要把 `litegui-` 前缀声明为自定义元素，避免被当成 Vue 组件解析：

```ts
// vite.config.ts
vue({
  template: {
    compilerOptions: {
      isCustomElement: tag => tag.startsWith("litegui-")
    }
  }
});
```

```vue
<litegui-button label="保存" @litegui-click="onSave" />
```

## 单文件 / script 标签

包内提供自包含的 UMD 构建：

```html
<script src="./node_modules/@gausszhou/litegui-elements/dist/index.umd.cjs"></script>
<litegui-button label="保存"></litegui-button>
```

UMD 会自动把 tokens 注入文档，无需再单独引入 `tokens.css`。

## 当前限制

- **仅客户端**：元素在 JS 加载并升级前没有内容，暂不支持 SSR / Declarative Shadow DOM；服务端渲染请继续使用类 API。
- **模态框**：`Dialog` 的 `makeModal()` 依赖全局遮罩，Shadow DOM 下尚未适配；当前只支持普通对话框。
- **浮层定位**：`Menu` 等后续元素的 `position: fixed` 面板不能放在有 `transform` / `filter` / `contain` 的祖先里，否则定位会偏移。
- 目前覆盖 Button、Checkbox、Panel、Dialog、Menu；Tabs、Table、Slider 等会逐步补齐。

## 包结构

| 入口                                     | 用途                                                     |
| ---------------------------------------- | -------------------------------------------------------- |
| `@gausszhou/litegui-elements`            | 注册全部元素                                             |
| `@gausszhou/litegui-elements/define`     | 只导出 `defineElements()` / `ELEMENT_TAGS`，适合按需注册 |
| `@gausszhou/litegui-elements/button` 等  | 单个元素类（可自行 `customElements.define`）             |
| `@gausszhou/litegui-elements/tokens.css` | 主题变量                                                 |

完整源码在 [packages/elements](https://github.com/gausszhou/litegui/tree/master/packages/elements)，类 API 文档见[组件](/components)。

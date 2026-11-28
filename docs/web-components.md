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

## 属性、property 与事件约定

- **简单值走 attribute**：`value`、`height`、`disabled` 等；boolean attribute 用存在性表示（`disabled`、`open`、`scrollable`、`vertical`、`readonly`）。
- **复杂数据走 JSON attribute**：`tabs`、`items`、`columns`、`rows`、`data`、`nodes`、`links` 等。解析失败时回退为空数组/默认对象，不会抛错。
- **同名 property 可用**：`element.items = [...]`、`element.value = 10` 会同步回 attribute；读取 `element.items` 返回解析后的 JSON。
- **事件统一 `litegui-*`**：`bubbles: true`、`composed: true`，数据在 `event.detail`，可以穿透 Shadow DOM 监听。
- **标题**：Panel/Dialog 用 `heading` 避免和全局 `title`（tooltip）冲突；HeaderBar/ImageEditor 文案直接复用标准 `title` attribute。
- **JSON 不携带函数**：attribute 里的 JSON 不能包含回调；需要自定义回调时监听 `litegui-*` 事件，或通过 `element.component` 直接操作原生实例。
- **逃生口**：`element.component` 返回原生 LiteGUI 实例，未适配的方法可以直接调用。

## 元素总览

### 基础控件与数据

| 标签                | 属性 / 方法                                                                     | 事件                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `<lg-button>`       | `label`、`size`（`default` / `small` / `mini`）、`disabled`                     | `litegui-click` → `{ label }`                                                                             |
| `<lg-checkbox>`     | `checked`、`disabled`                                                           | `litegui-change` → `{ checked }`                                                                          |
| `<lg-slider>`       | `value`、`min`、`max`、`step`                                                   | `litegui-change` → `{ value }`                                                                            |
| `<lg-searchbox>`    | `value`、`placeholder`                                                          | `litegui-change` → `{ value }`（输入框 change）                                                           |
| `<lg-dragger>`      | `value`、`min`、`max`、`step`、`precision`、`linear`                            | `litegui-change` → `{ value }`                                                                            |
| `<lg-tabs>`         | `tabs` JSON（`[{ id, title, content }]`）、`mode`；或 light DOM 子元素           | `litegui-change` → `{ id }`                                                                               |
| `<lg-list>`         | `items` JSON（字符串或 `{ id, value, label }`）；或 light DOM 子元素文本        | `litegui-select` → `{ value }`                                                                            |
| `<lg-table>`        | `columns` / `rows` JSON、`height`、`scrollable`；默认插槽追加在表格下方          | —（读表格 DOM）                                                                                           |
| `<lg-console>`      | `prompt`；方法 `log()` / `warn()` / `error()` / `clear()`                       | `litegui-command` → `{ command }`                                                                         |
| `<lg-complex-list>` | `items` JSON（`{ id, name, enabled, removable }`）、`height`                    | `litegui-select` → `{ value, item }`、`litegui-toggle` → `{ value, enabled, item }`、`litegui-remove` → `{ value, item }` |
| `<lg-tree>`         | `data` JSON（`{ id, content, children }`）、`height`、`allow-rename`            | `litegui-select` → `{ id }`                                                                               |
| `<lg-inspector>`    | `items` JSON（见下文）                                                          | `litegui-change` → `{ name, value }`                                                                      |
| `<lg-line-editor>`  | `value` JSON（`[[x, y], ...]` 归一化坐标）、`width`、`height`                   | `litegui-change` → `{ value }`                                                                            |

### 布局

| 标签                | 属性 / 插槽                                                              | 事件                            |
| ------------------- | ------------------------------------------------------------------------ | ------------------------------- |
| `<lg-area>`         | `sections`（>=1）、`direction`（`horizontal` / `vertical`）；默认插槽进入第一个区域 | `litegui-resize` → `{ sections }` |
| `<lg-split>`        | `sections`、`vertical`；子元素按顺序分配到命名插槽 `section-0`、`section-1`… | —                            |
| `<lg-box>`          | 默认插槽                                                                 | —                               |
| `<lg-context-menu>` | `items` JSON（`{ title, value, disabled, separator }`）、`open`          | `litegui-select` → `{ value, item }` |

### 面板与工作区

| 标签                | 属性 / 插槽                                                                          | 事件                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `<lg-panel>`        | `heading`、`height`、`closable`；默认插槽                                            | `litegui-close`                                                                               |
| `<lg-dialog>`       | `heading`、`width`、`height`、`open`、`closable`；默认插槽                           | `litegui-close`                                                                               |
| `<lg-menu>`         | 嵌套 `<lg-menu-item label="...">`                                                    | `litegui-select` → `{ label, path }`                                                          |
| `<lg-header-bar>`   | `variant`（`topbar` / `area`）、`title`、`height`、`left` / `center` / `right`；命名插槽 `left` / `center` / `right` | —                                                                                             |
| `<lg-status-bar>`   | `left`、`right`（文本或 JSON 字符串数组）；命名插槽 `left` / `right`                 | —                                                                                             |
| `<lg-timeline>`     | `start`、`end`、`frame`、`fps`、`keyframes` JSON；方法 `play()` / `pause()`          | `litegui-frame` → `{ frame }`、`litegui-play` → `{ playing }`、`litegui-range` → `{ start, end }` |
| `<lg-toolbar>`      | `tools` JSON（`[{ id, label, icon, shortcut }]`）、`active`                          | `litegui-change` → `{ id }`                                                                   |
| `<lg-node-editor>`  | `nodes` JSON、`links` JSON、`readonly`；方法 `select(id)`                            | `litegui-change` → `{ nodes, links }`、`litegui-select` → `{ id }`                             |
| `<lg-text-editor>`  | `value`、`language`、`readonly`                                                      | `litegui-change` → `{ value }`、`litegui-cursor` → `{ line, column }`                          |
| `<lg-image-editor>` | `src`、`title`、`zoom`；方法 `fit()` / `resetView()`                                 | `litegui-zoom` → `{ zoom }`                                                                   |
| `<lg-viewport>`     | `objects` JSON、`selected`、`shading`、`overlays`、`sidebar-open`、`edit-mode`、`edit-element`、`brush`；方法 `frameAll()` / `focusSelection()` / `setView()` / `zoom()` | `litegui-select` → `{ id }`、`litegui-status` → `{ text }`、`litegui-change` → `{ objects }`、`litegui-contextmenu` → `{ x, y }`、`litegui-transform` → `{ kind, phase }` |

`<lg-menu-item>` 只是声明式数据载体，不渲染自身。

## 实时示例

```html
<lg-button label="保存"></lg-button>
<lg-checkbox checked></lg-checkbox>
<lg-slider value="0.4" min="0" max="1"></lg-slider>
<lg-searchbox placeholder="搜索"></lg-searchbox>
```

<div class="wc-demo">
  <lg-button label="保存"></lg-button>
  <lg-button label="Small" size="small"></lg-button>
  <lg-button label="禁用" disabled></lg-button>
  <lg-checkbox checked></lg-checkbox>
  <lg-slider value="0.4" min="0" max="1" style="width: 160px"></lg-slider>
  <lg-searchbox placeholder="搜索"></lg-searchbox>
</div>

Panel 的默认插槽会投影到内容区：

<div class="wc-demo">
  <lg-panel heading="属性" height="160">
    <div style="padding: 12px">这段内容来自 light DOM，被 slot 投影进面板。</div>
  </lg-panel>
</div>

```html
<lg-panel heading="属性" height="160">
  <div>这段内容来自 light DOM，被 slot 投影进面板。</div>
</lg-panel>
```

Dialog 用 `open` 控制显示，关闭按钮会移除 `open` 并派发 `litegui-close`：

<div class="wc-demo">
  <lg-dialog heading="设置" width="320" height="190" open closable>
    <div style="padding: 8px">对话框内容同样来自默认插槽。</div>
  </lg-dialog>
</div>

Tabs 既可以用 JSON，也可以把子元素直接变成标签页：

```html
<lg-tabs>
  <section label="文件">文件内容</section>
  <section label="设置">设置内容</section>
</lg-tabs>
```

<div class="wc-demo">
  <lg-tabs style="height: 160px">
    <section label="文件" style="padding: 12px">文件内容来自 light DOM 子元素。</section>
    <section label="设置" style="padding: 12px">设置内容来自 light DOM 子元素。</section>
  </lg-tabs>
</div>

Menu 用嵌套的 `<lg-menu-item>` 声明菜单树，点击叶子项派发 `litegui-select`：

<div class="wc-demo wc-menu-demo">
  <lg-menu>
    <lg-menu-item label="文件">
      <lg-menu-item label="新建文本文件"></lg-menu-item>
      <lg-menu-item label="打开"></lg-menu-item>
    </lg-menu-item>
  </lg-menu>
</div>

## 复杂数据（JSON）示例

Table 的列可以直接写字符串，也可以用对象指定 `field`：

```html
<lg-table
  height="160"
  columns='[{"name":"名称","field":"name"},{"name":"类型","field":"type"}]'
  rows='[{"name":"Cube","type":"Mesh"},{"name":"Sun","type":"Light"}]'
></lg-table>
```

Inspector 支持 `string` / `number` / `slider` / `checkbox` / `color` / `vector3`，以及 `separator` / `title` / `info`：

```html
<lg-inspector
  items='[
    {"type":"string","name":"Name","value":"Cube"},
    {"type":"slider","name":"Opacity","value":0.5,"options":{"min":0,"max":1,"step":0.01}},
    {"type":"checkbox","name":"Visible","value":true},
    {"type":"vector3","name":"Position","value":[0,0,0]}
  ]'
></lg-inspector>
```

```ts
const inspector = document.querySelector("lg-inspector");
inspector.addEventListener("litegui-change", event => {
  console.log(event.detail); // { name, value }
});
```

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
<lg-button label="保存" onlitegui-click={event => console.log(event.detail)} />
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
<lg-button label="保存" @litegui-click="onSave" />
```

## 单文件 / script 标签

包内提供自包含的 UMD 构建，包含全部元素：

```html
<script src="./node_modules/@gausszhou/litegui-elements/dist/index.umd.cjs"></script>
<lg-button label="保存"></lg-button>
```

UMD 会自动把 tokens 注入文档，无需再单独引入 `tokens.css`。

## 当前限制

- **仅客户端**：元素在 JS 加载并升级前没有内容，暂不支持 SSR / Declarative Shadow DOM；服务端渲染请继续使用类 API。
- **模态框**：`Dialog` 的 `makeModal()` 依赖全局遮罩，Shadow DOM 下尚未适配；当前只支持普通对话框。
- **浮层定位**：`Menu` 等元素的 `position: fixed` 面板不能放在有 `transform` / `filter` / `contain` 的祖先里，否则定位会偏移。`<lg-context-menu>` 已经改为在宿主内 `position: absolute`。
- **复杂数据回写**：`<lg-node-editor>` 的 `nodes` / `links`、`<lg-complex-list>` 的删除操作、`<lg-text-editor>` 的输入内容不会自动写回 attribute。请监听事件并使用 property 维护自己的状态（`<lg-text-editor>.value` 提供实时值）。
- **Canvas 元素**：`<lg-line-editor>` / `<lg-timeline>` 需要真实 canvas；在 jsdom 等环境里测试时要 mock `HTMLCanvasElement.prototype.getContext`。
- **布局是薄适配**：`<lg-area>` 用递归二分实现 N 个 section，`<lg-split>` 用命名插槽分发子元素，不覆盖原生类的全部方法。需要精细控制时用 `.component`。

## 包结构

| 入口                                     | 用途                                                          |
| ---------------------------------------- | ------------------------------------------------------------- |
| `@gausszhou/litegui-elements`            | 注册全部元素                                                  |
| `@gausszhou/litegui-elements/define`     | 只导出 `defineElements()` / `ELEMENT_TAGS`，适合按需注册      |
| `@gausszhou/litegui-elements/slider` 等  | 单个元素类（可自行 `customElements.define`），每个元素都有独立子路径 |
| `@gausszhou/litegui-elements/tokens.css` | 主题变量                                                      |

完整源码在 [packages/elements](https://github.com/gausszhou/litegui/tree/master/packages/elements)，类 API 文档见[组件](/components)。

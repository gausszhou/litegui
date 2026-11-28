# Vue 绑定

`@gausszhou/litegui-vue` 把 LiteGUI 的类 API 封装成 Vue 3 组件，依赖链为：

```text
@gausszhou/litegui-vue
        └── @gausszhou/litegui-components
                    └── @gausszhou/litegui-core
```

## 安装与注册

```bash
pnpm add @gausszhou/litegui-components @gausszhou/litegui-vue vue
```

```ts
import { createApp } from "vue";
import LiteGuiVue from "@gausszhou/litegui-vue";
import "@gausszhou/litegui-components/style.css";

createApp(App).use(LiteGuiVue).mount("#app");
```

也可以按需引入：

```ts
import { LiteGuiButton, LiteGuiCheckbox } from "@gausszhou/litegui-vue";
```

## 实时示例

下面的示例直接使用 Vue 组件：

<script setup>
import { ref } from "vue";
import {
  LiteGuiArea,
  LiteGuiBox,
  LiteGuiButton,
  LiteGuiCheckbox,
  LiteGuiConsole,
  LiteGuiDialog,
  LiteGuiDragger,
  LiteGuiHeaderBar,
  LiteGuiList,
  LiteGuiMenu,
  LiteGuiPanel,
  LiteGuiSearchBox,
  LiteGuiSlider,
  LiteGuiSplit,
  LiteGuiStatusBar,
  LiteGuiTable,
  LiteGuiTabs,
  LiteGuiToolbar
} from "@gausszhou/litegui-vue";

const checked = ref(true);
const volume = ref(35);
const keyword = ref("");
const selected = ref("Alpha");
const columns = [
  { name: "名称", field: "name" },
  { name: "值", field: "value" }
];
const rows = [
  { name: "Alpha", value: 1 },
  { name: "Beta", value: 2 }
];
const dragValue = ref(1.5);
const activeTab = ref("a");
const tabs = [
  { id: "a", title: "概览" },
  { id: "b", title: "详情" }
];
const dialogOpen = ref(false);
const menuItems = [
  { label: "文件", children: [{ label: "新建" }, { label: "打开" }] }
];
const activeTool = ref("move");
const toolbarTools = [
  { id: "move", label: "移动", shortcut: "G" },
  { id: "rotate", label: "旋转", shortcut: "R" }
];
</script>

<div class="lg-demo">
  <LiteGuiButton label="保存" @click="() => {}" />
  <LiteGuiButton label="Small" size="small" />
  <LiteGuiCheckbox v-model="checked" />
  <LiteGuiSlider v-model="volume" :min="0" :max="100" />
</div>

```vue
<script setup lang="ts">
import { ref } from "vue";
import { LiteGuiButton, LiteGuiCheckbox, LiteGuiSlider } from "@gausszhou/litegui-vue";

const checked = ref(true);
const volume = ref(35);
</script>

<template>
  <LiteGuiButton label="保存" />
  <LiteGuiCheckbox v-model="checked" />
  <LiteGuiSlider v-model="volume" :min="0" :max="100" />
</template>
```

Panel 使用默认插槽：

<div class="lg-demo">
  <LiteGuiPanel title="属性" :height="160">
    <div style="padding: 12px">这段内容来自 Vue 默认插槽。</div>
  </LiteGuiPanel>
</div>

```vue
<LiteGuiPanel title="属性" :height="160">
  <div>这段内容来自 Vue 默认插槽。</div>
</LiteGuiPanel>
```

Dialog 用 `v-model` 控制开关：

<div class="lg-demo">
  <LiteGuiButton label="打开对话框" @click="dialogOpen = true" />
  <LiteGuiDialog v-model="dialogOpen" title="设置" :width="320" :height="190">
    <div style="padding: 8px">对话框内容来自 Vue 插槽。</div>
  </LiteGuiDialog>
</div>

```vue
<LiteGuiButton label="打开对话框" @click="dialogOpen = true" />
<LiteGuiDialog v-model="dialogOpen" title="设置" :width="320" :height="190">
  <div>对话框内容来自 Vue 插槽。</div>
</LiteGuiDialog>
```

Menu 通过 `items` 声明菜单树：

<div class="lg-demo lg-menu-demo">
  <LiteGuiMenu :items="menuItems" @select="() => {}" />
</div>

```vue
<LiteGuiMenu :items="menuItems" @select="onSelect" />
```

```ts
const menuItems = [{ label: "文件", children: [{ label: "新建" }, { label: "打开" }] }];
```

Table、List、SearchBox 和 Split 同样是薄封装：

<div class="lg-demo">
  <LiteGuiSearchBox v-model="keyword" placeholder="搜索" />
  <LiteGuiList v-model="selected" :items="['Alpha', 'Beta']" />
</div>

```vue
<LiteGuiSearchBox v-model="keyword" placeholder="搜索" />
<LiteGuiList v-model="selected" :items="['Alpha', 'Beta']" />
```

<div class="lg-demo">
  <LiteGuiTable :columns="columns" :rows="rows" :height="180" />
</div>

```vue
<LiteGuiTable :columns="columns" :rows="rows" :height="180" />
```

Split 用 `section-*` 命名插槽填充每个分区：

<div class="lg-demo">
  <LiteGuiSplit :sections="[50, 50]" style="height: 160px; width: 100%">
    <template #section-0>
      <div style="padding: 12px">左侧</div>
    </template>
    <template #section-1>
      <div style="padding: 12px">右侧</div>
    </template>
  </LiteGuiSplit>
</div>

```vue
<LiteGuiSplit :sections="[50, 50]" style="height: 160px">
  <template #section-0><div>左侧</div></template>
  <template #section-1><div>右侧</div></template>
</LiteGuiSplit>
```

Tabs、Dragger、Console：

<div class="lg-demo">
  <LiteGuiTabs v-model="activeTab" :tabs="tabs" :height="180" style="width: 100%">
    <template #tab-a>
      <div style="padding: 12px">概览内容</div>
    </template>
    <template #tab-b>
      <div style="padding: 12px">详情内容</div>
    </template>
  </LiteGuiTabs>
</div>

```vue
<LiteGuiTabs v-model="activeTab" :tabs="tabs" :height="180">
  <template #tab-a><div>概览内容</div></template>
  <template #tab-b><div>详情内容</div></template>
</LiteGuiTabs>
```

<div class="lg-demo">
  <LiteGuiDragger v-model="dragValue" :precision="2" />
  <LiteGuiConsole prompt=">" style="width: 320px; height: 160px" />
</div>

```vue
<LiteGuiDragger v-model="dragValue" :precision="2" />
<LiteGuiConsole prompt=">" @command="onCommand" />
```

## 布局与外壳组件（新增）

Area、Box、HeaderBar、StatusBar、Toolbar 基本是 slot 投影，适合搭建整个工作区外壳：

<div class="lg-demo" style="display: block">
  <LiteGuiHeaderBar variant="area" title="UV Editor" :height="30">
    <template #right><span style="padding: 0 8px">100%</span></template>
  </LiteGuiHeaderBar>
  <LiteGuiStatusBar left="就绪" :right="['UTF-8', 'Python']" accent="v1.0.1" />
  <LiteGuiToolbar v-model:active="activeTool" :tools="toolbarTools" orientation="horizontal" title="工具" />
  <LiteGuiBox>
    <div style="padding: 12px">LiteGuiBox 的默认插槽内容。</div>
  </LiteGuiBox>
</div>

```vue
<LiteGuiHeaderBar variant="area" title="UV Editor" :height="30">
  <template #left>左侧内容</template>
  <template #center>模式菜单</template>
  <template #right>100%</template>
</LiteGuiHeaderBar>

<!-- left / center / right 也可以直接用 props 传字符串或字符串数组 -->
<LiteGuiHeaderBar title="Topbar" :left="['文件', '编辑']" right="v1.0.1" />

<LiteGuiStatusBar left="就绪" :right="['UTF-8', 'Python']" accent="v1.0.1" />

<LiteGuiToolbar v-model:active="activeTool" :tools="toolbarTools" orientation="horizontal" />

<LiteGuiBox><div>任意内容</div></LiteGuiBox>
```

Area 用 `sections` 描述两个分区的尺寸，`vertical` 控制上下还是左右分割，并支持 `#section-0` / `#section-1`（缺省时默认插槽填充第一个分区）。不传 `sections` 且没有 `#section-1` 插槽时，Area 退化为单个内容区域，默认插槽直接填充：

<div class="lg-demo">
  <LiteGuiArea :sections="[50, 50]" :height="150" vertical>
    <template #section-0>
      <div style="padding: 12px">上方分区</div>
    </template>
    <template #section-1>
      <div style="padding: 12px">下方分区</div>
    </template>
  </LiteGuiArea>
</div>

```vue
<LiteGuiArea :sections="[60, 40]" vertical :height="240" @resize="onResize">
  <template #section-0><div>上方</div></template>
  <template #section-1><div>下方</div></template>
</LiteGuiArea>

<!-- 单区域模式：不传 sections，默认插槽直接作为内容 -->
<LiteGuiArea :height="160">
  <div>单块内容</div>
</LiteGuiArea>
```

`HeaderBar` / `StatusBar` 还额外暴露 `setLeft`、`setRight` 等方法，可通过 `ref` 调用。

## 数据与编辑器组件（新增）

Inspector 用 `items` 声明控件，`type` 支持 `string`、`number`、`slider`、`checkbox`、`color`、`vector3`；每个控件变化都会触发 `change`：

```vue
<LiteGuiInspector :items="inspectorItems" :height="220" @change="onChange" />

<script setup lang="ts">
const inspectorItems = [
  { name: "名称", type: "string", value: "Cube" },
  { name: "强度", type: "slider", value: 0.5, min: 0, max: 1, step: 0.01 },
  { name: "启用", type: "checkbox", value: true },
  { name: "颜色", type: "color", value: [1, 0.5, 0.2] },
  { name: "位置", type: "vector3", value: [0, 1, 0] }
];

const onChange = ({ name, value }: { name: string; value: unknown }) => {
  console.log(name, value);
};
</script>
```

Tree 的 `data` 直接是嵌套对象，节点使用 `id` / `content` / `children`；选中节点时 `select` 事件收到节点的 data：

```vue
<LiteGuiTree :data="tree" :height="220" allow-rename @select="onSelect" />

<script setup lang="ts">
const tree = {
  id: "root",
  content: "场景",
  children: [
    { id: "camera", content: "Camera" },
    { id: "light", content: "Light" }
  ]
};

const onSelect = (data: unknown) => console.log(data);
</script>
```

ComplexList、LineEditor 和 NodeEditor：

```vue
<LiteGuiComplexList :items="items" :height="180" @select="onSelect" @toggle="onToggle" @remove="onRemove" />

<LiteGuiLineEditor v-model="curve" :width="320" :height="120" @change="onCurveChange" />

<LiteGuiNodeEditor :nodes="nodes" :links="links" @change="onGraphChange" @select="onNodeSelect" />
```

```ts
const items = [
  { content: "Camera", enabled: true },
  { content: "Light", enabled: false, removable: true }
];
const curve = ref([
  [0, 0.2],
  [0.5, 0.8],
  [1, 0.3]
]);
const nodes = [
  { id: "bsdf", title: "Principled BSDF", x: 40, y: 40, outputs: [{ id: "out", name: "BSDF" }] },
  { id: "output", title: "Material Output", x: 260, y: 60, inputs: [{ id: "in", name: "Surface" }] }
];
const links = [{ from: "bsdf", fromPort: "out", to: "output", toPort: "in" }];
```

## 时间轴、文本与图像（新增）

Timeline 用 `v-model:frame` 双向绑定当前帧，播放键和范围输入分别触发 `play` 与 `range`：

```vue
<LiteGuiTimeline
  v-model:frame="frame"
  :start="1"
  :end="250"
  :fps="24"
  :keyframes="[1, 25, 60]"
  @play="onPlay"
  @range="onRange"
/>
```

TextEditor 用 `v-model` 绑定当前标签页的内容，并抛出 `change` / `cursor` / `tab` / `run`：

```vue
<LiteGuiTextEditor
  v-model="code"
  language="Python"
  :tabs="tabs"
  @change="onTextChange"
  @cursor="onCursor"
  @tab="onTab"
/>
```

```ts
const code = ref("import bpy\nprint(bpy.app.version_string)");
const tabs = [
  { id: "text", label: "Text", value: code.value },
  { id: "console", label: "Console", value: "" }
];
```

ImageEditor 用 `v-model:zoom` 同步缩放比例：

```vue
<LiteGuiImageEditor v-model:zoom="zoom" src="/render.png" title="Render Result" />
```

Viewport 渲染 3D 场景；`v-model:selected` 同步选中对象，`objects` 里的 `loc` / `rot` / `scale` 会被原地修改：

```vue
<LiteGuiViewport
  v-model:selected="selected"
  :objects="objects"
  shading="solid"
  overlays
  :height="360"
  @change="onSceneChange"
  @contextmenu="openContextMenu"
/>
```

```ts
const selected = ref<string | null>("Cube");
const objects = ref([
  { id: "Cube", name: "Cube", type: "mesh", loc: [0, 0, 1], rot: [0, 0, 0], scale: [1, 1, 1], visible: true, selectable: true }
]);
const onSceneChange = ({ objects: next }: { objects: unknown[] }) => console.log(next);
```

## 弹出菜单（新增）

ContextMenu 由 `modelValue`（或 `open`）控制显隐，位置用 `x` / `y` 指定，选择条目时触发 `select`：

```vue
<LiteGuiContextMenu
  v-model="menuOpen"
  :items="[{ title: '复制' }, { title: '粘贴', disabled: true }, { title: '删除' }]"
  :x="120"
  :y="80"
  @select="onMenuSelect"
/>
```

## 组件 API

| 组件                   | 主要 props                                                          | 事件 / v-model                                            |
| ---------------------- | ------------------------------------------------------------------- | --------------------------------------------------------- |
| `<LiteGuiButton>`      | `label`、`size`、`disabled`                                         | `@click`                                                  |
| `<LiteGuiCheckbox>`    | `modelValue`、`disabled`                                            | `v-model`、`@change`                                      |
| `<LiteGuiSlider>`      | `modelValue`、`min`、`max`、`step`                                  | `v-model`、`@change`                                      |
| `<LiteGuiPanel>`       | `title`、`height`、`closable`                                       | `@close`                                                  |
| `<LiteGuiDialog>`      | `modelValue`、`title`、`width`、`height`、`closable`                | `v-model`、`@close`                                       |
| `<LiteGuiMenu>`        | `items`                                                             | `@select` → `{ label, path }`                             |
| `<LiteGuiList>`        | `items`、`modelValue`、`id`                                         | `v-model`、`@change`                                      |
| `<LiteGuiTable>`       | `columns`、`rows`、`height`、`scrollable`                           | —                                                         |
| `<LiteGuiTabs>`        | `tabs`、`modelValue`、`mode`、`height`                              | `v-model`、`@change`；`#tab-<id>` 插槽                    |
| `<LiteGuiSplit>`       | `sections`、`vertical`                                              | `#section-N` 插槽                                         |
| `<LiteGuiSearchBox>`   | `modelValue`、`placeholder`                                         | `v-model`、`@change`                                      |
| `<LiteGuiDragger>`     | `modelValue`、`precision`、`min`、`max`、`units`                    | `v-model`、`@change`                                      |
| `<LiteGuiConsole>`     | `prompt`                                                            | `@command`                                                |
| `<LiteGuiArea>`        | `sections`、`vertical`、`editable`、`width`、`height`               | `@resize`；`#section-N` / 默认插槽                        |
| `<LiteGuiBox>`         | `stopPropagation`                                                   | 默认插槽                                                  |
| `<LiteGuiComplexList>` | `items`、`height`                                                   | `@select`、`@toggle`、`@remove`                           |
| `<LiteGuiContextMenu>` | `items`、`modelValue` / `open`、`x`、`y`、`title`                   | `v-model`、`v-model:open`、`@open`、`@select`             |
| `<LiteGuiHeaderBar>`   | `variant`、`title`、`height`、`left` / `center` / `right`           | `#left` / `#center` / `#right` 插槽；`setLeft`/`setRight` |
| `<LiteGuiImageEditor>` | `src`、`title`、`zoom`、`minZoom`、`maxZoom`、`height`              | `v-model:zoom`、`@zoom`、`@source`                        |
| `<LiteGuiInspector>`   | `items`、`width`、`height`、`full`、`nameWidth`                     | `@change` → `{ name, value }`；默认插槽                   |
| `<LiteGuiLineEditor>`  | `modelValue`、`width`、`height`、`xrange`、`yrange`                 | `v-model`、`@change`                                      |
| `<LiteGuiNodeEditor>`  | `nodes`、`links`、`readOnly`、`height`                              | `@change` → `{ nodes, links }`、`@select`                 |
| `<LiteGuiStatusBar>`   | `left`、`right`、`accent`                                           | —                                                         |
| `<LiteGuiTextEditor>`  | `modelValue`、`language`、`readOnly`、`tabs`、`height`              | `v-model`、`@change`、`@cursor`、`@tab`、`@run`           |
| `<LiteGuiTimeline>`    | `start`、`end`、`fps`、`frame`、`keyframes`、`height`               | `v-model:frame`、`@play`、`@range`、`@keyframe`           |
| `<LiteGuiToolbar>`     | `tools`、`active`、`orientation`、`title`                           | `v-model:active`、`@change`                               |
| `<LiteGuiTree>`        | `data`、`height`、`allowRename`、`allowDrag`、`allowMultiSelection` | `@select` → 节点 data                                     |
| `<LiteGuiViewport>`    | `objects`、`selected`、`shading`、`overlays`、`sidebarOpen`、`editMode`、`editElement`、`brush`、`height` | `v-model:selected`、`@select`、`@status`、`@change`、`@contextmenu`、`@transform` |

所有组件都暴露 `getInstance()`，用于拿到底层 LiteGUI 实例。事件名不带 `litegui-` 前缀；`v-model:frame`、`v-model:zoom`、`v-model:active` 分别对应 `update:frame`、`update:zoom`、`update:active`。

## 说明

- 外层会渲染一个 `div`（`lg-vue-*`）承载 LiteGUI DOM；布局尺寸可在外层覆盖。
- 样式来自 `@gausszhou/litegui-components/style.css`，应用入口引入一次即可。
- 需要完整控制时，可继续直接使用 `@gausszhou/litegui-components` 的类 API。

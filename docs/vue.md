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
  LiteGuiButton,
  LiteGuiCheckbox,
  LiteGuiDialog,
  LiteGuiList,
  LiteGuiMenu,
  LiteGuiPanel,
  LiteGuiSearchBox,
  LiteGuiSlider,
  LiteGuiSplit,
  LiteGuiTable
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
const dialogOpen = ref(false);
const menuItems = [
  { label: "文件", children: [{ label: "新建" }, { label: "打开" }] }
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

## 组件 API

| 组件                | 主要 props                                           | 事件 / v-model                |
| ------------------- | ---------------------------------------------------- | ----------------------------- |
| `<LiteGuiButton>`   | `label`、`size`、`disabled`                          | `@click`                      |
| `<LiteGuiCheckbox>` | `modelValue`、`disabled`                             | `v-model`、`@change`          |
| `<LiteGuiSlider>`   | `modelValue`、`min`、`max`、`step`                   | `v-model`、`@change`          |
| `<LiteGuiPanel>`    | `title`、`height`、`closable`                        | `@close`                      |
| `<LiteGuiDialog>`   | `modelValue`、`title`、`width`、`height`、`closable` | `v-model`、`@close`           |
| `<LiteGuiMenu>`     | `items`                                              | `@select` → `{ label, path }` |

所有组件都暴露 `getInstance()`，用于拿到底层 LiteGUI 实例。

## 说明

- 外层会渲染一个 `div`（`lg-vue-*`）承载 LiteGUI DOM；布局尺寸可在外层覆盖。
- 样式来自 `@gausszhou/litegui-components/style.css`，应用入口引入一次即可。
- 需要完整控制时，可继续直接使用 `@gausszhou/litegui-components` 的类 API。

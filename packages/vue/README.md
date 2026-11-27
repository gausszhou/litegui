# @gausszhou/litegui-vue

LiteGUI 的 Vue 3 绑定：把 `@gausszhou/litegui-components` 的类 API 封装成 Vue 组件，支持 props、`v-model`、slots 与事件。

依赖链：`@gausszhou/litegui-vue` → `@gausszhou/litegui-components` → `@gausszhou/litegui-core`。

## 安装

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

## 组件

| 组件                | 主要 props                                           | 事件 / v-model                |
| ------------------- | ---------------------------------------------------- | ----------------------------- |
| `<LiteGuiButton>`   | `label`、`size`、`disabled`                          | `@click`                      |
| `<LiteGuiCheckbox>` | `modelValue`、`disabled`                             | `v-model`、`@change`          |
| `<LiteGuiSlider>`   | `modelValue`、`min`、`max`、`step`                   | `v-model`、`@change`          |
| `<LiteGuiPanel>`    | `title`、`height`、`closable`                        | `@close`，默认插槽            |
| `<LiteGuiDialog>`   | `modelValue`、`title`、`width`、`height`、`closable` | `v-model`、`@close`，默认插槽 |
| `<LiteGuiMenu>`     | `items`（嵌套 `{ label, children, disabled }`）      | `@select` → `{ label, path }` |

```vue
<script setup lang="ts">
import { ref } from "vue";
import { LiteGuiButton, LiteGuiCheckbox } from "@gausszhou/litegui-vue";

const checked = ref(true);
</script>

<template>
  <LiteGuiButton label="保存" @click="save" />
  <LiteGuiCheckbox v-model="checked" />
</template>
```

## 说明

- 组件外层会渲染一个 `div`（类名 `lg-vue-*`）承载原生 LiteGUI DOM；可通过 `getInstance()` 拿到原生实例。
- 样式仍来自 `@gausszhou/litegui-components/style.css`，需要在应用入口引入一次。
- 需要完整控制时，可继续直接使用 `@gausszhou/litegui-components` 的类 API。

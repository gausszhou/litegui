---
title: Button
description: 按钮
---

# Button

按钮组件，支持 `default`、`small`、`mini` 三种尺寸；点击时会先执行 `callback`，再派发 `click` 事件。

<ComponentDemo name="button/basic" title="基础用法" height="120px" />

<<< @/demos/button/basic.vue

## Options

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `size` | `"default" \| "small" \| "mini"` | `"default"` | 按钮尺寸 |
| `callback` | `(button: Button) => void` | — | 点击回调，`callback` 的 `this` 指向按钮实例 |

## 属性与方法

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `root` | `HTMLDivElement` | 根元素 |
| `content` | `HTMLButtonElement` | 内部原生按钮 |
| `click()` | `() => this` | 触发点击逻辑并派发 `click` 事件 |
| `emit("click", this)` | `EventMitter` | 通过事件总线订阅点击 |

```ts
const button = new Button("Save", { size: "small" });
button.on("click", () => console.log("clicked"));
container.appendChild(button.root);
```

## 可访问性

内部使用原生 `<button>`，支持键盘 `Enter` / `Space` 与浏览器默认焦点样式。

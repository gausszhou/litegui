---
title: Box
description: 极简 div 容器
---

# Box

`LiteBox` 是 Tree / Inspector 内部使用的极简容器：只创建一个 `div`，可选地阻止点击冒泡。

<ComponentDemo name="box/basic" title="基础容器" height="120px" />

<<< @/demos/box/basic.vue

## 成员

| 成员 | 类型 | 说明 |
| --- | --- | --- |
| `root` | `HTMLDivElement` | 容器元素 |
| `stopPropagation` | `boolean` | 为 `true` 时阻止点击冒泡 |
| `setEmpty(flag)` | `(flag?: boolean) => void` | 清空内容，默认 `true` |

```ts
const box = new LiteBox();
box.root.appendChild(component.root);
box.stopPropagation = true;
```

> 业务里更常用 `Panel`；Box 适合只需要一个可点击阻断的挂载点。

---
title: Menu
description: 菜单栏、子菜单与分隔符
---

# Menu

菜单用 `"A/B/C"` 路径描述层级，支持分隔符、复选框状态与多级子菜单。子菜单与父项顶部对齐、从父面板右缘展开，空间不足时自动翻转。

<ComponentDemo name="menu/basic" title="菜单栏与二级菜单" height="240px" />

<<< @/demos/menu/basic.vue

## 用法

```ts
const menu = new Menu("main-menu", { container: someElement });

menu.add("文件/新建", { callback: () => {} });
menu.add("文件/打开", { callback: () => {} });
menu.add("文件/", {});                       // 分隔符
menu.add("文件/最近打开/项目 A", { callback: () => {} }); // 多级子菜单
```

`add()` 只在路径末级挂载 `data`；同名前缀会自动合并成子菜单。

## Options

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `auto_open` | `boolean` | `false` | 预留：自动展开 |
| `sort_entries` | `boolean` | `false` | 按 `data.order` 排序子项 |
| `container` | `HTMLElement` | `getRoot()` | 菜单面板挂载容器；嵌入到已有页面时传入自己的容器 |

## 方法

| 方法 | 说明 |
| --- | --- |
| `add(path, data)` | 添加菜单项；`path` 用 `/` 分隔 |
| `remove(path)` | 删除菜单项 |
| `separator(path, order)` | 在指定菜单下插入分隔符 |
| `findMenu(path)` | 查找菜单项 |
| `clear()` | 清空所有菜单 |
| `hideMenuPanel()` | 关闭当前打开的面板 |

## 数据项

| 字段 | 说明 |
| --- | --- |
| `callback` | 点击后执行，参数为 `data` |
| `disabled` | 置灰并阻止点击 |
| `checkbox` | 点击切换勾选状态 |
| `order` | 配合 `sort_entries` 排序 |
| `isChecked(data)` | 自定义勾选判断 |

## 键盘与可访问性

菜单根节点带 `role="menubar"`，菜单项带 `role="menuitem"`；当前版本以鼠标操作为主。

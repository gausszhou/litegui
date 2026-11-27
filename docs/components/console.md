---
title: Console
description: 控制台输出
---

# Console

Console 提供日志区、命令输入框与历史记录，适合调试面板。

<ComponentDemo name="console/basic" title="日志与命令输入" height="340px" />

<<< @/demos/console/basic.vue

## 用法

```ts
const consolePanel = new Console({ prompt: ">" });
consolePanel.addMessage("ready", "good");
consolePanel.onProcessCommand = (cmd) => console.log(cmd);
container.appendChild(consolePanel.root);
```

## Options

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `prompt` | `string` | `"]"` | 命令回显前缀 |

## 方法

| 方法 | 说明 |
| --- | --- |
| `addMessage(text, className?, asText?)` | 追加一条日志；返回 `{ update(v) }` 句柄 |
| `log(...args)` | 追加普通日志 |
| `clear()` | 清空日志 |

日志级别 class：`msglog`、`msgwarn`、`msgerror`、`good`。

## 回调

| 回调 | 说明 |
| --- | --- |
| `onProcessCommand(command)` | 输入框回车后收到命令 |
| `onAutocomplete(value)` | 返回补全后的输入值 |

输入框支持 `↑` / `↓` 翻阅最近 10 条历史。

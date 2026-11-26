---
title: 表单
description: Button、Checkbox、Slider、SearchBox 与 Dragger
---

# 表单

## Button

```ts
const button = new LiteGUI.Button("Save", {
  callback: () => console.log("saved")
});
panel.add(button);
```

`Button` 会触发 `click` 事件，同时调用 `options.callback`。

## Checkbox

```ts
const checkbox = new LiteGUI.Checkbox(true, {
  onChange: (value) => console.log(value)
});
panel.add(checkbox);
```

支持点击与 Space/Enter，`role="checkbox"`、`aria-checked` 自动同步。

## Slider

```ts
const slider = new LiteGUI.Slider(0.5, { min: 0, max: 1, step: 0.01 });
slider.onChange = (value) => console.log(value);
panel.add(slider.root);
```

支持鼠标拖动、方向键、Home/End，并维护 `aria-valuenow`。

## SearchBox

```ts
const search = new LiteGUI.SearchBox("", {
  placeholder: "Search",
  callback: (value) => console.log(value)
});
panel.add(search.root);
```

## Dragger

```ts
const number = new LiteGUI.Dragger(1.5, { min: 0, max: 10, precision: 2 });
number.on("change", () => console.log(number.getValue()));
panel.add(number.root);
```

> `Dragger`、`LineEditor` 属于 experimental。

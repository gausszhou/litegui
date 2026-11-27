import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  ELEMENT_TAGS,
  defineElements,
  LiteGuiButtonElement,
  LiteGuiCheckboxElement,
  LiteGuiComplexListElement,
  LiteGuiConsoleElement,
  LiteGuiContextMenuElement,
  LiteGuiDraggerElement,
  LiteGuiHeaderBarElement,
  LiteGuiImageEditorElement,
  LiteGuiInspectorElement,
  LiteGuiLineEditorElement,
  LiteGuiListElement,
  LiteGuiNodeEditorElement,
  LiteGuiSearchBoxElement,
  LiteGuiSliderElement,
  LiteGuiStatusBarElement,
  LiteGuiTableElement,
  LiteGuiTabsElement,
  LiteGuiTextEditorElement,
  LiteGuiTimelineElement,
  LiteGuiToolbarElement,
  LiteGuiTreeElement
} from "@gausszhou/litegui-elements";

defineElements();

beforeAll(() => {
  // jsdom 不实现 canvas，这些元素只需要一个可调用的 2D context。
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    fillText: vi.fn(),
    arc: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    setTransform: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    closePath: vi.fn(),
    measureText: () => ({ width: 10 })
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
});

function mount<T extends HTMLElement>(tag: string, attrs: Record<string, string> = {}): T {
  const element = document.createElement(tag) as T;
  for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, value);
  document.body.appendChild(element);
  return element;
}

/** 原生组件用 keyCode 判断方向键/回车，jsdom 的 KeyboardEvent 需要手动补上。 */
function keyEvent(type: string, key: string, keyCode: number): KeyboardEvent {
  const event = new KeyboardEvent(type, { key, bubbles: true, cancelable: true });
  Object.defineProperty(event, "keyCode", { value: keyCode });
  Object.defineProperty(event, "which", { value: keyCode });
  return event;
}

describe("LiteGUI custom elements", () => {
  it("registers the tags and falls back to a <style> when adoptedStyleSheets is unavailable", () => {
    expect(customElements.get("lg-button")).toBeDefined();
    expect(customElements.get("lg-checkbox")).toBeDefined();
    expect(customElements.get("lg-panel")).toBeDefined();
    expect(customElements.get("lg-dialog")).toBeDefined();

    const button = mount("lg-button", { label: "Save" });
    const style = button.shadowRoot?.querySelector("style");
    expect(style).not.toBeNull();
    expect(style?.textContent).toContain(":host { display: inline-block; }");
  });

  it("registers every entry of ELEMENT_TAGS", () => {
    const tags = Object.keys(ELEMENT_TAGS);
    expect(tags).toHaveLength(28);
    for (const tag of tags) {
      expect(customElements.get(tag), tag).toBeDefined();
    }
  });

  it("lg-button renders, reflects label and emits litegui-click", () => {
    const button = mount<LiteGuiButtonElement>("lg-button", { label: "Save" });
    const inner = button.shadowRoot?.querySelector<HTMLButtonElement>("button.lg-button__control");
    expect(inner?.textContent).toBe("Save");

    const onClick = vi.fn();
    button.addEventListener("litegui-click", onClick);
    inner?.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect((onClick.mock.calls[0][0] as CustomEvent).detail).toEqual({ label: "Save" });

    button.label = "Run";
    expect(button.getAttribute("label")).toBe("Run");
    expect(inner?.textContent).toBe("Run");
  });

  it("lg-button does not emit when disabled", () => {
    const button = mount<LiteGuiButtonElement>("lg-button", {
      label: "Save",
      disabled: ""
    });
    const onClick = vi.fn();
    button.addEventListener("litegui-click", onClick);

    button.shadowRoot?.querySelector<HTMLButtonElement>("button.lg-button__control")?.click();

    expect(button.disabled).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("lg-checkbox reflects checked and emits litegui-change", () => {
    const checkbox = mount<LiteGuiCheckboxElement>("lg-checkbox", { checked: "" });
    expect(checkbox.checked).toBe(true);

    const onChange = vi.fn();
    checkbox.addEventListener("litegui-change", onChange);

    checkbox.shadowRoot?.querySelector<HTMLElement>(".lg-checkbox")?.click();

    expect(checkbox.checked).toBe(false);
    expect(checkbox.hasAttribute("checked")).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.calls[0][0] as CustomEvent).detail).toEqual({ checked: false });
  });

  it("lg-panel projects slot content and emits close", () => {
    const panel = document.createElement("lg-panel");
    panel.setAttribute("heading", "属性");
    panel.setAttribute("height", "160");
    panel.setAttribute("closable", "");
    panel.appendChild(document.createElement("span")).textContent = "内容";

    document.body.appendChild(panel);

    expect(panel.shadowRoot?.querySelector(".lg-panel__title")?.textContent).toBe("属性");
    expect(panel.shadowRoot?.querySelector("slot")).not.toBeNull();
    expect(panel.querySelector("span")?.textContent).toBe("内容");

    const onClose = vi.fn();
    panel.addEventListener("litegui-close", onClose);
    panel.shadowRoot?.querySelector<HTMLElement>(".lg-panel__close")?.click();

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(panel.hidden).toBe(true);
  });

  it("lg-dialog follows the open attribute and reopens after close", () => {
    const dialog = mount("lg-dialog", { heading: "设置", open: "", closable: "" });

    const findDialog = () => dialog.shadowRoot?.querySelector<HTMLElement>(".lg-dialog");
    expect(findDialog()).not.toBeNull();
    expect(findDialog()?.style.display).not.toBe("none");

    const onClose = vi.fn();
    dialog.addEventListener("litegui-close", onClose);

    findDialog()?.querySelector<HTMLElement>(".lg-dialog__button--close")?.click();

    expect(dialog.hasAttribute("open")).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);

    dialog.setAttribute("open", "");
    const reopened = findDialog();
    expect(reopened).not.toBeNull();
    expect(reopened?.style.display).not.toBe("none");
  });

  it("lg-menu builds nested items from light DOM", () => {
    const menu = document.createElement("lg-menu");
    menu.innerHTML = `
      <lg-menu-item label="文件">
        <lg-menu-item label="新建"></lg-menu-item>
        <lg-menu-item label="打开"></lg-menu-item>
      </lg-menu-item>
    `;
    document.body.appendChild(menu);

    const top = menu.shadowRoot?.querySelector<HTMLElement>(".lg-menu__item");
    expect(top?.textContent).toContain("文件");

    top?.click();
    const leaves = [...(menu.shadowRoot?.querySelectorAll<HTMLElement>(".lg-menu__panel-item") ?? [])];
    const leaf = leaves.find(element => element.textContent?.includes("新建"));
    expect(leaf).toBeDefined();

    const onSelect = vi.fn();
    menu.addEventListener("litegui-select", onSelect);
    leaf?.click();

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect((onSelect.mock.calls[0][0] as CustomEvent).detail).toEqual({
      label: "新建",
      path: "文件/新建"
    });
  });

  it("does not duplicate content when the element is moved", () => {
    const button = mount("lg-button", { label: "Move" });
    const other = document.createElement("div");
    document.body.appendChild(other);

    other.appendChild(button);

    expect(button.shadowRoot?.querySelectorAll("button.lg-button__control")).toHaveLength(1);
  });
});

describe("LiteGUI control elements", () => {
  it("lg-slider renders, syncs attributes and emits litegui-change", () => {
    const slider = mount<LiteGuiSliderElement>("lg-slider", { value: "0.5", min: "0", max: "1" });
    const inner = slider.shadowRoot?.querySelector<HTMLElement>(".lg-slider");
    expect(inner).not.toBeNull();
    expect(inner?.getAttribute("aria-valuenow")).toBe("0.5");

    const onChange = vi.fn();
    slider.addEventListener("litegui-change", onChange);
    inner?.dispatchEvent(keyEvent("keydown", "ArrowRight", 39));

    expect(onChange).toHaveBeenCalledTimes(1);
    const detail = (onChange.mock.calls[0][0] as CustomEvent).detail as { value: number };
    expect(detail.value).toBeCloseTo(0.51);
    expect(slider.getAttribute("value")).toBe("0.51");

    slider.value = 0.25;
    expect(inner?.getAttribute("aria-valuenow")).toBe("0.25");
    expect(slider.value).toBe(0.25);
  });

  it("lg-searchbox emits litegui-change on input change and syncs placeholder", () => {
    const search = mount<LiteGuiSearchBoxElement>("lg-searchbox", {
      value: "",
      placeholder: "搜索"
    });
    const input = search.shadowRoot?.querySelector<HTMLInputElement>(".lg-searchbox__input");
    expect(input?.placeholder).toBe("搜索");

    const onChange = vi.fn();
    search.addEventListener("litegui-change", onChange);
    if (input) {
      input.value = "litegui";
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: "litegui" });
    expect(search.getAttribute("value")).toBe("litegui");

    search.placeholder = "Filter";
    expect(input?.placeholder).toBe("Filter");
  });

  it("lg-dragger emits litegui-change when the value is stepped", () => {
    const dragger = mount<LiteGuiDraggerElement>("lg-dragger", {
      value: "1",
      min: "0",
      max: "10",
      step: "1",
      precision: "1"
    });
    const input = dragger.shadowRoot?.querySelector<HTMLInputElement>("input");
    expect(input?.value).toBe("1.0");

    const onChange = vi.fn();
    dragger.addEventListener("litegui-change", onChange);
    input?.dispatchEvent(keyEvent("keydown", "ArrowUp", 38));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: 2 });
    expect(dragger.getAttribute("value")).toBe("2");
    expect(dragger.value).toBe(2);
  });

  it("lg-tabs builds tabs from JSON and emits litegui-change on switch", () => {
    const tabs = mount<LiteGuiTabsElement>("lg-tabs", {
      tabs: JSON.stringify([
        { id: "a", title: "A", content: "<p>First</p>" },
        { id: "b", title: "B", content: "<p>Second</p>" }
      ])
    });

    const headers = tabs.shadowRoot?.querySelectorAll<HTMLElement>(".lg-tabs__tab") ?? [];
    expect(headers).toHaveLength(2);
    expect(tabs.value).toBe("a");

    const onChange = vi.fn();
    tabs.addEventListener("litegui-change", onChange);
    headers[1].click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.calls[0][0] as CustomEvent).detail).toEqual({ id: "b" });
    expect(tabs.value).toBe("b");
  });

  it("lg-list builds items from JSON/light DOM and emits litegui-select", () => {
    const list = mount<LiteGuiListElement>("lg-list", { items: JSON.stringify(["One", "Two"]) });
    const items = list.shadowRoot?.querySelectorAll<HTMLElement>(".lg-list__item") ?? [];
    expect(items).toHaveLength(2);

    const onSelect = vi.fn();
    list.addEventListener("litegui-select", onSelect);
    items[1].click();

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect((onSelect.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: "Two" });
    expect(list.value).toBe("Two");

    // 坏 JSON 不应让组件崩溃
    list.setAttribute("items", "{oops");
    expect(list.shadowRoot?.querySelector(".lg-list")).not.toBeNull();

    // 没有 items attribute 时读取 light DOM 文本
    const light = document.createElement("lg-list");
    light.innerHTML = "<li>Alpha</li><li>Beta</li>";
    document.body.appendChild(light);
    expect(light.shadowRoot?.querySelectorAll(".lg-list__item")).toHaveLength(2);
  });

  it("lg-table renders columns/rows, honors height/scrollable and keeps a slot", () => {
    const table = mount<LiteGuiTableElement>("lg-table", {
      columns: JSON.stringify(["Name", "Age"]),
      rows: JSON.stringify([{ name: "Ada", age: 36 }]),
      height: "180",
      scrollable: ""
    });
    const inner = table.shadowRoot?.querySelector<HTMLTableElement>("table.lg-table");
    expect(inner).not.toBeNull();
    expect(inner?.style.height).toBe("180px");
    expect(inner?.style.overflow).toBe("auto");
    expect(inner?.querySelector("th")?.textContent).toBe("Name");
    expect([...(inner?.querySelectorAll("td") ?? [])].map(cell => cell.textContent)).toEqual(["Ada", "36"]);
    expect(table.shadowRoot?.querySelector("slot")).not.toBeNull();

    table.rows = [{ name: "Grace", age: 85 }];
    const cells = [...(inner?.querySelectorAll("td") ?? [])].map(cell => cell.textContent);
    expect(cells).toEqual(["Grace", "85"]);
  });

  it("lg-console forwards log/warn/error/clear and emits litegui-command", () => {
    const consoleElement = mount<LiteGuiConsoleElement>("lg-console", { prompt: ">" });
    const shadow = consoleElement.shadowRoot!;

    consoleElement.log("hello");
    consoleElement.warn("warned");
    consoleElement.error("failed");
    expect(shadow.querySelectorAll(".lg-console__message")).toHaveLength(3);
    expect(shadow.querySelector(".lg-console__message--log")).not.toBeNull();

    const onCommand = vi.fn();
    consoleElement.addEventListener("litegui-command", onCommand);
    const input = shadow.querySelector<HTMLInputElement>(".lg-console__footer input");
    if (input) {
      input.value = "help";
      input.dispatchEvent(keyEvent("keydown", "Enter", 13));
    }

    expect(onCommand).toHaveBeenCalledTimes(1);
    expect((onCommand.mock.calls[0][0] as CustomEvent).detail).toEqual({ command: "help" });

    consoleElement.clear();
    expect(shadow.querySelectorAll(".lg-console__message")).toHaveLength(0);

    consoleElement.prompt = "$";
    expect((consoleElement.component as { _prompt?: string })._prompt).toBe("$");
  });

  it("lg-complex-list emits select/toggle/remove", () => {
    const list = mount<LiteGuiComplexListElement>("lg-complex-list", {
      items: JSON.stringify([
        { id: "a", name: "Alpha", enabled: true },
        { id: "b", name: "Beta" }
      ])
    });
    const items = list.shadowRoot?.querySelectorAll<HTMLElement>(".lg-complex-list > *") ?? [];
    expect(items).toHaveLength(2);
    expect(items[0].classList.contains("lg-is-enabled")).toBe(true);

    const onSelect = vi.fn();
    const onToggle = vi.fn();
    const onRemove = vi.fn();
    list.addEventListener("litegui-select", onSelect);
    list.addEventListener("litegui-toggle", onToggle);
    list.addEventListener("litegui-remove", onRemove);

    items[0].dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect((onSelect.mock.calls[0][0] as CustomEvent).detail).toMatchObject({ value: "a" });

    items[0]
      .querySelector<HTMLElement>(".lg-complex-list__tick")
      ?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect((onToggle.mock.calls[0][0] as CustomEvent).detail).toMatchObject({ value: "a", enabled: false });

    items[1]
      .querySelector<HTMLElement>(".lg-complex-list__trash")
      ?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect((onRemove.mock.calls[0][0] as CustomEvent).detail).toMatchObject({ value: "b" });
  });

  it("lg-tree renders JSON data and emits litegui-select with the node id", () => {
    const tree = mount<LiteGuiTreeElement>("lg-tree", {
      data: JSON.stringify({
        id: "root",
        content: "场景",
        children: [{ id: "a", content: "Camera" }]
      }),
      height: "200"
    });

    expect(tree.shadowRoot?.querySelectorAll(".ltreeitem")).toHaveLength(2);
    expect(tree.shadowRoot?.querySelector(".litetree")?.getAttribute("style")).toContain("200px");

    const onSelect = vi.fn();
    tree.addEventListener("litegui-select", onSelect);
    tree.shadowRoot?.querySelector<HTMLElement>(".ltreeitem-a")?.click();

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect((onSelect.mock.calls[0][0] as CustomEvent).detail).toEqual({ id: "a" });
  });

  it("lg-inspector renders typed widgets and emits litegui-change", () => {
    const inspector = mount<LiteGuiInspectorElement>("lg-inspector", {
      items: JSON.stringify([
        { type: "string", name: "Title", value: "Hello" },
        { type: "number", name: "Count", value: 1 },
        { type: "checkbox", name: "Enabled", value: true }
      ])
    });

    const widgets = [...(inspector.shadowRoot?.querySelectorAll<HTMLElement>(".widget") ?? [])];
    expect(widgets).toHaveLength(3);

    const onChange = vi.fn();
    inspector.addEventListener("litegui-change", onChange);

    const countWidget = widgets.find(widget => (widget as HTMLElement & { name?: string }).name === "Count");
    const input = countWidget?.querySelector<HTMLInputElement>("input");
    expect(input).not.toBeNull();
    if (input) {
      input.value = "5";
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.calls[0][0] as CustomEvent).detail).toEqual({ name: "Count", value: "5" });
  });

  it("lg-line-editor renders a canvas and emits litegui-change after editing", () => {
    const editor = mount<LiteGuiLineEditorElement>("lg-line-editor", {
      value: JSON.stringify([
        [0, 0.5],
        [1, 0.5]
      ]),
      width: "220",
      height: "80"
    });

    const canvas = editor.shadowRoot?.querySelector<HTMLCanvasElement>("canvas");
    expect(canvas).not.toBeNull();
    expect(canvas?.width).toBe(220);
    expect(canvas?.height).toBe(80);

    const onChange = vi.fn();
    editor.addEventListener("litegui-change", onChange);

    canvas?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, clientX: 20, clientY: 20 }));
    document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(Array.isArray((onChange.mock.calls[0][0] as CustomEvent).detail.value)).toBe(true);
  });
});

describe("LiteGUI layout elements", () => {
  it("lg-area splits into sections and emits litegui-resize", () => {
    const area = document.createElement("lg-area");
    area.setAttribute("sections", "2");
    area.appendChild(document.createElement("span")).textContent = "content";
    document.body.appendChild(area);

    expect(area.shadowRoot?.querySelectorAll(".lg-area__splitbar")).toHaveLength(1);
    expect(area.shadowRoot?.querySelectorAll(".lg-area").length).toBeGreaterThanOrEqual(3);
    expect(area.shadowRoot?.querySelector("slot")).not.toBeNull();

    const onResize = vi.fn();
    area.addEventListener("litegui-resize", onResize);

    const splitbar = area.shadowRoot?.querySelector<HTMLElement>(".lg-area__splitbar");
    splitbar?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, clientX: 100 }));
    document.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, clientX: 80 }));
    document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

    expect(onResize).toHaveBeenCalled();
  });

  it("lg-split creates sections and distributes light DOM via named slots", () => {
    const split = document.createElement("lg-split");
    split.setAttribute("sections", "3");
    split.setAttribute("vertical", "");
    for (const label of ["One", "Two", "Three"]) {
      const section = document.createElement("span");
      section.textContent = label;
      split.appendChild(section);
    }
    document.body.appendChild(split);

    const root = split.shadowRoot?.querySelector(".lg-split");
    expect(root?.classList.contains("lg-split--vertical")).toBe(true);
    expect(split.shadowRoot?.querySelectorAll(".lg-split__section")).toHaveLength(3);
    expect(split.shadowRoot?.querySelectorAll("slot")).toHaveLength(3);
    expect([...split.children].map(child => child.getAttribute("slot"))).toEqual([
      "section-0",
      "section-1",
      "section-2"
    ]);
  });

  it("lg-box projects slot content", () => {
    const box = document.createElement("lg-box");
    const child = document.createElement("span");
    child.textContent = "内容";
    box.appendChild(child);
    document.body.appendChild(box);

    expect(box.shadowRoot?.querySelector("slot")).not.toBeNull();
    expect(box.querySelector("span")?.textContent).toBe("内容");

    box.stopPropagation = true;
    expect(box.stopPropagation).toBe(true);
  });

  it("lg-context-menu opens from JSON items and emits litegui-select", () => {
    const menu = mount<LiteGuiContextMenuElement>("lg-context-menu", {
      items: JSON.stringify([
        { title: "复制", value: "copy" },
        { title: "删除", value: "delete" }
      ]),
      open: ""
    });

    const items = menu.shadowRoot?.querySelectorAll<HTMLElement>(".lg-context-menu__item") ?? [];
    expect(items).toHaveLength(2);

    const onSelect = vi.fn();
    menu.addEventListener("litegui-select", onSelect);
    items[0].click();

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect((onSelect.mock.calls[0][0] as CustomEvent).detail).toMatchObject({ value: "copy" });
    expect(menu.open).toBe(false);
    expect(menu.hasAttribute("open")).toBe(false);
  });
});

describe("LiteGUI workspace elements", () => {
  it("lg-header-bar renders variant/title/height and named slots", () => {
    const bar = mount<LiteGuiHeaderBarElement>("lg-header-bar", {
      variant: "area",
      title: "编辑器",
      height: "32"
    });

    const root = bar.shadowRoot?.querySelector<HTMLElement>(".lg-header-bar");
    expect(root?.classList.contains("lg-header-bar--area")).toBe(true);
    expect(root?.style.height).toBe("32px");
    expect(bar.shadowRoot?.querySelector(".lg-header-bar__title")?.textContent).toContain("编辑器");
    expect(bar.shadowRoot?.querySelector('slot[name="left"]')).not.toBeNull();
    expect(bar.shadowRoot?.querySelector('slot[name="center"]')).not.toBeNull();
    expect(bar.shadowRoot?.querySelector('slot[name="right"]')).not.toBeNull();

    bar.setAttribute("left", "左侧");
    expect(bar.shadowRoot?.querySelector(".lg-header-bar__left")?.textContent).toContain("左侧");
    expect(bar.left).toBe("左侧");
  });

  it("lg-status-bar renders left/right text and updates on attribute change", () => {
    const bar = mount<LiteGuiStatusBarElement>("lg-status-bar", {
      left: "就绪",
      right: JSON.stringify(["v1", "UTF-8"])
    });

    expect(bar.shadowRoot?.querySelector(".lg-status-bar__left")?.textContent).toBe("就绪");
    expect(bar.shadowRoot?.querySelectorAll(".lg-status-bar__right > *")).toHaveLength(2);

    bar.left = "完成";
    expect(bar.shadowRoot?.querySelector(".lg-status-bar__left")?.textContent).toBe("完成");
  });

  it("lg-timeline syncs frame/range and emits frame/play/range events", () => {
    const timeline = mount<LiteGuiTimelineElement>("lg-timeline", {
      start: "1",
      end: "100",
      frame: "10",
      fps: "12",
      keyframes: JSON.stringify([20, 40])
    });

    expect(timeline.shadowRoot?.querySelector(".lg-timeline")).not.toBeNull();
    const frameInput = timeline.shadowRoot?.querySelector<HTMLInputElement>('input[data-role="frame"]');
    expect(frameInput?.value).toBe("10");

    const onFrame = vi.fn();
    const onPlay = vi.fn();
    const onRange = vi.fn();
    timeline.addEventListener("litegui-frame", onFrame);
    timeline.addEventListener("litegui-play", onPlay);
    timeline.addEventListener("litegui-range", onRange);

    if (frameInput) {
      frameInput.value = "20";
      frameInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
    expect((onFrame.mock.calls[0][0] as CustomEvent).detail).toEqual({ frame: 20 });
    expect(timeline.getAttribute("frame")).toBe("20");

    const startInput = timeline.shadowRoot?.querySelector<HTMLInputElement>('input[data-role="start"]');
    if (startInput) {
      startInput.value = "5";
      startInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
    expect((onRange.mock.calls[0][0] as CustomEvent).detail).toEqual({ start: 5, end: 100 });

    timeline.play();
    timeline.pause();
    expect(onPlay.mock.calls.map(call => (call[0] as CustomEvent).detail.playing)).toEqual([true, false]);
    expect(timeline.keyframes).toEqual([20, 40]);
  });

  it("lg-toolbar renders tools and emits litegui-change on activation", () => {
    const toolbar = mount<LiteGuiToolbarElement>("lg-toolbar", {
      tools: JSON.stringify([
        { id: "move", label: "移动" },
        { id: "rotate", label: "旋转" }
      ]),
      active: "move"
    });

    const buttons = [...(toolbar.shadowRoot?.querySelectorAll<HTMLButtonElement>(".lg-toolbar__tool") ?? [])];
    expect(buttons).toHaveLength(2);
    expect(buttons[0].classList.contains("lg-toolbar__tool--active")).toBe(true);

    const onChange = vi.fn();
    toolbar.addEventListener("litegui-change", onChange);
    buttons[1].click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.calls[0][0] as CustomEvent).detail).toEqual({ id: "rotate" });
    expect(toolbar.active).toBe("rotate");

    toolbar.active = "move";
    expect(buttons[0].classList.contains("lg-toolbar__tool--active")).toBe(true);
  });

  it("lg-node-editor renders nodes and emits select/change", () => {
    const editor = mount<LiteGuiNodeEditorElement>("lg-node-editor", {
      nodes: JSON.stringify([
        { id: "a", title: "A", x: 10, y: 10, outputs: [{ id: "out", name: "Out" }] },
        { id: "b", title: "B", x: 120, y: 10, inputs: [{ id: "in", name: "In" }] }
      ]),
      links: JSON.stringify([{ from: "a", fromPort: "out", to: "b", toPort: "in" }])
    });

    expect(editor.shadowRoot?.querySelectorAll(".lg-node-editor__node")).toHaveLength(2);
    expect(editor.shadowRoot?.querySelectorAll(".lg-node-editor__link")).toHaveLength(1);

    const onSelect = vi.fn();
    const onChange = vi.fn();
    editor.addEventListener("litegui-select", onSelect);
    editor.addEventListener("litegui-change", onChange);

    editor.shadowRoot?.querySelector<HTMLElement>('[data-node-id="a"]')?.click();
    expect((onSelect.mock.calls[0][0] as CustomEvent).detail).toEqual({ id: "a" });
    expect(editor.selected).toBe("a");

    editor.shadowRoot
      ?.querySelector<HTMLElement>(".lg-node-editor")
      ?.dispatchEvent(new KeyboardEvent("keydown", { key: "Delete", bubbles: true }));

    expect(onChange).toHaveBeenCalledTimes(1);
    const detail = (onChange.mock.calls[0][0] as CustomEvent).detail as { nodes: unknown[]; links: unknown[] };
    expect(detail.nodes).toHaveLength(1);
    expect(detail.links).toHaveLength(0);
  });

  it("lg-text-editor emits change/cursor and syncs language/readonly", () => {
    const editor = mount<LiteGuiTextEditorElement>("lg-text-editor", {
      value: "const a = 1;",
      language: "TypeScript"
    });
    const textarea = editor.shadowRoot?.querySelector<HTMLTextAreaElement>(".lg-text-editor__textarea");
    expect(textarea?.value).toBe("const a = 1;");

    const onChange = vi.fn();
    const onCursor = vi.fn();
    editor.addEventListener("litegui-change", onChange);
    editor.addEventListener("litegui-cursor", onCursor);

    if (textarea) {
      textarea.value = "const b = 2;";
      textarea.setSelectionRange(0, 0);
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.dispatchEvent(new Event("keyup", { bubbles: true }));
    }

    expect((onChange.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: "const b = 2;" });
    expect(editor.value).toBe("const b = 2;");
    expect((onCursor.mock.calls[0][0] as CustomEvent).detail).toEqual({ line: 1, column: 1 });

    editor.language = "JavaScript";
    expect(editor.shadowRoot?.textContent).toContain("JavaScript");

    editor.readonly = true;
    expect(textarea?.readOnly).toBe(true);
  });

  it("lg-image-editor reflects title/zoom and emits litegui-zoom", () => {
    const editor = mount<LiteGuiImageEditorElement>("lg-image-editor", {
      title: "Render Result",
      zoom: "2"
    });

    expect(editor.shadowRoot?.querySelector(".lg-image-editor__title")?.textContent).toBe("Render Result");
    expect(editor.shadowRoot?.querySelector(".lg-image-editor__zoom")?.textContent).toBe("200%");

    const onZoom = vi.fn();
    editor.addEventListener("litegui-zoom", onZoom);
    const buttons = [...(editor.shadowRoot?.querySelectorAll<HTMLButtonElement>(".lg-image-editor__btn") ?? [])];
    buttons.find(button => button.textContent === "+")?.click();

    expect(onZoom).toHaveBeenCalledTimes(1);
    expect((onZoom.mock.calls[0][0] as CustomEvent).detail).toEqual({ zoom: 2.5 });
    expect(editor.getAttribute("zoom")).toBe("2.5");
    expect(editor.shadowRoot?.querySelector(".lg-image-editor__zoom")?.textContent).toBe("250%");
  });
});

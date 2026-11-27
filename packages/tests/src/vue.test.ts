import { beforeAll, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createApp, nextTick } from "vue";
import LiteGuiVue, {
  components,
  LiteGuiArea,
  LiteGuiBox,
  LiteGuiButton,
  LiteGuiCheckbox,
  LiteGuiComplexList,
  LiteGuiConsole,
  LiteGuiContextMenu,
  LiteGuiDragger,
  LiteGuiDialog,
  LiteGuiHeaderBar,
  LiteGuiImageEditor,
  LiteGuiInspector,
  LiteGuiLineEditor,
  LiteGuiList,
  LiteGuiMenu,
  LiteGuiNodeEditor,
  LiteGuiPanel,
  LiteGuiSearchBox,
  LiteGuiSplit,
  LiteGuiStatusBar,
  LiteGuiTable,
  LiteGuiTabs,
  LiteGuiTextEditor,
  LiteGuiTimeline,
  LiteGuiToolbar,
  LiteGuiTree,
  LiteGuiSlider
} from "@gausszhou/litegui-vue";

beforeAll(() => {
  // jsdom 不实现 canvas；LineEditor / Timeline 只需要一个可用的 2D context。
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

type Exposed<T> = { getInstance: () => T };

const getInstance = <T>(wrapper: { vm: unknown }): T => (wrapper.vm as Exposed<T>).getInstance();

describe("Vue bindings", () => {
  it("installs all components through the Vue plugin", () => {
    const app = createApp({});
    app.use(LiteGuiVue);
    expect(app.component("LiteGuiButton")).toBeDefined();
    expect(app.component("LiteGuiMenu")).toBeDefined();
    expect(Object.keys(components)).toHaveLength(27);
    expect(app.component("LiteGuiNodeEditor")).toBeDefined();
    expect(app.component("LiteGuiTimeline")).toBeDefined();
  });

  it("LiteGuiButton mounts, emits click and reflects label", async () => {
    const wrapper = mount(LiteGuiButton, {
      props: { label: "保存" },
      attachTo: document.body
    });
    await nextTick();

    const button = wrapper.find("button.lg-button__control");
    expect(button.text()).toBe("保存");

    await button.trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);

    await wrapper.setProps({ label: "运行" });
    expect(wrapper.find("button.lg-button__control").text()).toBe("运行");

    wrapper.unmount();
  });

  it("LiteGuiCheckbox supports v-model", async () => {
    const wrapper = mount(LiteGuiCheckbox, {
      props: { modelValue: false },
      attachTo: document.body
    });
    await nextTick();

    await wrapper.find(".lg-checkbox").trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([true]);
    expect(wrapper.emitted("change")?.[0]).toEqual([true]);

    wrapper.unmount();
  });

  it("LiteGuiSlider emits value changes", async () => {
    const wrapper = mount(LiteGuiSlider, {
      props: { modelValue: 0, min: 0, max: 10, step: 1 },
      attachTo: document.body
    });
    await nextTick();

    await wrapper.find(".lg-slider").trigger("keydown", { key: "ArrowRight" });

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([1]);

    wrapper.unmount();
  });

  it("LiteGuiPanel renders title and slot content", async () => {
    const wrapper = mount(LiteGuiPanel, {
      props: { title: "属性" },
      slots: { default: "<span class='slot-content'>内容</span>" },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.find(".lg-panel__title").text()).toBe("属性");
    expect(wrapper.find(".slot-content").text()).toBe("内容");

    wrapper.unmount();
  });

  it("LiteGuiDialog follows v-model and emits close", async () => {
    const wrapper = mount(LiteGuiDialog, {
      props: { modelValue: true, title: "设置" },
      slots: { default: "<span class='slot-content'>内容</span>" },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.find(".lg-dialog").exists()).toBe(true);
    expect(wrapper.find(".slot-content").text()).toBe("内容");

    await wrapper.find(".lg-dialog__button--close").trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
    expect(wrapper.emitted("close")).toHaveLength(1);

    wrapper.unmount();
  });

  it("LiteGuiTabs switches tabs and emits v-model", async () => {
    const wrapper = mount(LiteGuiTabs, {
      props: {
        tabs: [
          { id: "a", title: "A" },
          { id: "b", title: "B" }
        ],
        modelValue: "a"
      },
      slots: {
        "tab-a": "<span class='tab-a'>A content</span>",
        "tab-b": "<span class='tab-b'>B content</span>"
      },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.find(".tab-a").text()).toBe("A content");
    await wrapper.findAll(".lg-tabs__tab")[1].trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["b"]);

    wrapper.unmount();
  });

  it("LiteGuiDragger emits number changes", async () => {
    const wrapper = mount(LiteGuiDragger, {
      props: { modelValue: 1, precision: 2 },
      attachTo: document.body
    });
    await nextTick();

    const input = wrapper.find("input");
    await input.setValue("2.5");
    await input.trigger("change");

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([2.5]);

    wrapper.unmount();
  });

  it("LiteGuiConsole emits commands", async () => {
    const wrapper = mount(LiteGuiConsole, {
      props: { prompt: ">" },
      attachTo: document.body
    });
    await nextTick();

    const input = wrapper.find("input");
    await input.setValue("help");
    await input.trigger("keydown", { keyCode: 13 });

    expect(wrapper.emitted("command")?.[0]).toEqual(["help"]);

    wrapper.unmount();
  });

  it("LiteGuiTable renders columns and updates rows", async () => {
    const wrapper = mount(LiteGuiTable, {
      props: {
        columns: [{ name: "名称", field: "name" }],
        rows: [{ name: "A" }]
      },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.find("table.lg-table").text()).toContain("名称");
    expect(wrapper.find("table.lg-table").text()).toContain("A");

    await wrapper.setProps({ rows: [{ name: "B" }] });
    await nextTick();
    expect(wrapper.find("table.lg-table").text()).toContain("B");

    wrapper.unmount();
  });

  it("LiteGuiList selects items and emits v-model", async () => {
    const wrapper = mount(LiteGuiList, {
      props: { items: ["A", "B"], modelValue: "A" },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.find(".lg-list__item.lg-is-selected").text()).toContain("A");

    await wrapper.findAll(".lg-list__item")[1].trigger("click");

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["B"]);

    wrapper.unmount();
  });

  it("LiteGuiSplit renders section slots", async () => {
    const wrapper = mount(LiteGuiSplit, {
      props: { sections: [50, 50] },
      slots: {
        "section-0": "<span class='left'>Left</span>",
        "section-1": "<span class='right'>Right</span>"
      },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.findAll(".lg-split__section")).toHaveLength(2);
    expect(wrapper.find(".left").text()).toBe("Left");
    expect(wrapper.find(".right").text()).toBe("Right");

    wrapper.unmount();
  });

  it("LiteGuiSearchBox emits changes", async () => {
    const wrapper = mount(LiteGuiSearchBox, {
      props: { modelValue: "a" },
      attachTo: document.body
    });
    await nextTick();

    const input = wrapper.find("input");
    await input.setValue("b");
    await input.trigger("change");

    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["b"]);

    wrapper.unmount();
  });

  it("LiteGuiMenu renders nested items and emits select", async () => {
    const wrapper = mount(LiteGuiMenu, {
      props: {
        items: [{ label: "文件", children: [{ label: "新建" }] }]
      },
      attachTo: document.body
    });
    await nextTick();

    await wrapper.find(".lg-menu__item").trigger("click");

    const leaf = wrapper.findAll(".lg-menu__panel-item").find(item => item.text().includes("新建"));
    expect(leaf).toBeDefined();
    await leaf!.trigger("click");

    expect(wrapper.emitted("select")?.[0]).toEqual([{ label: "新建", path: "文件/新建" }]);

    wrapper.unmount();
  });

  it("LiteGuiArea renders section slots and emits resize", async () => {
    const wrapper = mount(LiteGuiArea, {
      props: { sections: [50, 50] },
      slots: {
        "section-0": "<span class='area-left'>Left</span>",
        "section-1": "<span class='area-right'>Right</span>"
      },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.find(".lg-vue-area").exists()).toBe(true);
    expect(wrapper.find(".area-left").text()).toBe("Left");
    expect(wrapper.find(".area-right").text()).toBe("Right");

    wrapper.find(".lg-area").element.dispatchEvent(new Event("split_moved"));
    expect(wrapper.emitted("resize")).toHaveLength(1);

    wrapper.unmount();
  });

  it("LiteGuiArea falls back to a single content area", async () => {
    const wrapper = mount(LiteGuiArea, {
      slots: { default: "<span class='area-single'>Single</span>" },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.findAll(".lg-area")).toHaveLength(1);
    expect(wrapper.find(".area-single").text()).toBe("Single");

    wrapper.unmount();
  });

  it("LiteGuiBox projects its default slot", async () => {
    const wrapper = mount(LiteGuiBox, {
      props: { stopPropagation: true },
      slots: { default: "<span class='box-slot'>Boxed</span>" },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.find(".box-slot").text()).toBe("Boxed");
    expect(getInstance<{ stopPropagation: boolean }>(wrapper).stopPropagation).toBe(true);

    wrapper.unmount();
  });

  it("LiteGuiComplexList emits select, toggle and remove", async () => {
    const items = [{ content: "Alpha", enabled: true }, { content: "Beta" }];
    const wrapper = mount(LiteGuiComplexList, {
      props: { items, height: 120 },
      attachTo: document.body
    });
    await nextTick();

    const rows = wrapper.findAll(".lg-complex-list__item");
    expect(rows).toHaveLength(2);
    expect(rows[0].element.parentElement?.classList.contains("lg-is-enabled")).toBe(true);

    await rows[1].trigger("mousedown");
    expect(wrapper.emitted("select")?.[0]).toEqual([items[1]]);

    await rows[0].find(".lg-complex-list__tick").trigger("mousedown");
    expect(wrapper.emitted("toggle")?.[0]).toEqual([{ item: items[0], enabled: false }]);

    await rows[1].find(".lg-complex-list__trash").trigger("mousedown");
    expect(wrapper.emitted("remove")?.[0]).toEqual([items[1]]);

    wrapper.unmount();
  });

  it("LiteGuiContextMenu opens with v-model and emits select", async () => {
    const items = [{ title: "Copy", value: "copy" }];
    const wrapper = mount(LiteGuiContextMenu, {
      props: { modelValue: true, items, x: 40, y: 50 },
      attachTo: document.body
    });
    await nextTick();

    const menu = document.body.querySelector<HTMLElement>(".lg-context-menu");
    expect(menu).not.toBeNull();
    expect(wrapper.emitted("open")?.[0]).toEqual([true]);

    menu!.querySelector<HTMLElement>(".lg-context-menu__item")!.click();
    await nextTick();

    expect(wrapper.emitted("select")?.[0]).toEqual([{ title: "Copy", value: "copy" }]);
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([false]);

    wrapper.unmount();
  });

  it("LiteGuiHeaderBar renders slots and exposes setRight", async () => {
    const wrapper = mount(LiteGuiHeaderBar, {
      props: { variant: "area", title: "UV", height: 30 },
      slots: {
        left: "<span class='hb-left'>Left</span>",
        right: "<span class='hb-right'>Right</span>"
      },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.find(".lg-header-bar").classes()).toContain("lg-header-bar--area");
    expect((wrapper.find(".lg-header-bar").element as HTMLElement).style.height).toBe("30px");
    expect(wrapper.find(".hb-left").text()).toBe("Left");
    expect(wrapper.find(".hb-right").text()).toBe("Right");

    (wrapper.vm as unknown as { setRight: (value: string) => void }).setRight("Changed");
    expect(wrapper.find(".lg-header-bar__right").text()).toBe("Changed");

    wrapper.unmount();
  });

  it("LiteGuiImageEditor supports v-model:zoom", async () => {
    const wrapper = mount(LiteGuiImageEditor, {
      props: { title: "Render", zoom: 1, height: 200 },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.find(".lg-image-editor__title").text()).toBe("Render");

    const instance = getInstance<{ setZoom: (value: number, emit?: boolean) => void; getZoom: () => number }>(wrapper);
    instance.setZoom(2, true);
    expect(wrapper.emitted("update:zoom")?.[0]).toEqual([2]);
    expect(wrapper.emitted("zoom")?.[0]).toEqual([2]);

    await wrapper.setProps({ zoom: 3 });
    expect(instance.getZoom()).toBe(3);

    wrapper.unmount();
  });

  it("LiteGuiInspector renders items and emits change", async () => {
    const wrapper = mount(LiteGuiInspector, {
      props: { items: [{ name: "Name", type: "string", value: "Alpha" }] },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.find(".inspector").exists()).toBe(true);
    const input = wrapper.find(".inspector input");
    await input.setValue("Beta");
    await input.trigger("change");

    expect(wrapper.emitted("change")?.at(-1)).toEqual([{ name: "Name", value: "Beta" }]);

    wrapper.unmount();
  });

  it("LiteGuiLineEditor supports v-model through canvas interaction", async () => {
    const wrapper = mount(LiteGuiLineEditor, {
      props: {
        modelValue: [
          [0, 0],
          [1, 1]
        ],
        width: 200,
        height: 80
      },
      attachTo: document.body
    });
    await nextTick();

    const curve = wrapper.find(".curve");
    expect(curve.exists()).toBe(true);
    curve.element.dispatchEvent(new MouseEvent("mousedown", { clientX: 50, clientY: 40, bubbles: true }));
    document.dispatchEvent(new MouseEvent("mouseup", { clientX: 50, clientY: 40, bubbles: true }));

    expect(wrapper.emitted("change")).toHaveLength(1);
    expect(wrapper.emitted("update:modelValue")?.at(-1)?.[0]).toHaveLength(3);

    wrapper.unmount();
  });

  it("LiteGuiNodeEditor emits select and change", async () => {
    const wrapper = mount(LiteGuiNodeEditor, {
      props: {
        nodes: [
          { id: "a", title: "A", x: 10, y: 20, outputs: [{ id: "out", name: "Out" }] },
          { id: "b", title: "B", x: 120, y: 30, inputs: [{ id: "in", name: "In" }] }
        ],
        links: [{ from: "a", fromPort: "out", to: "b", toPort: "in" }]
      },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.findAll(".lg-node-editor__node")).toHaveLength(2);
    wrapper.findAll(".lg-node-editor__node")[0].element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(wrapper.emitted("select")?.[0]).toEqual(["a"]);

    getInstance<{ removeNode: (id: string) => void }>(wrapper).removeNode("b");
    expect(wrapper.emitted("change")).toHaveLength(1);

    wrapper.unmount();
  });

  it("LiteGuiStatusBar updates left and right content", async () => {
    const wrapper = mount(LiteGuiStatusBar, {
      props: { left: "Ready", right: ["UTF-8"], accent: "v1" },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.find(".lg-status-bar__left").text()).toBe("Ready");
    expect(wrapper.find(".lg-status-bar__right").element.children.length).toBe(2);

    await wrapper.setProps({ left: "Done", right: ["Ln 1", "Col 2"] });
    expect(wrapper.find(".lg-status-bar__left").text()).toBe("Done");
    expect(wrapper.find(".lg-status-bar__right").element.children.length).toBe(3);

    wrapper.unmount();
  });

  it("LiteGuiTextEditor supports v-model, tabs and cursor events", async () => {
    const wrapper = mount(LiteGuiTextEditor, {
      props: {
        modelValue: "print(1)",
        tabs: [
          { id: "text", label: "Text", value: "print(1)" },
          { id: "console", label: "Console", value: "" }
        ]
      },
      attachTo: document.body
    });
    await nextTick();

    const textarea = wrapper.find(".lg-text-editor__textarea");
    expect((textarea.element as HTMLTextAreaElement).value).toBe("print(1)");

    await textarea.setValue("print(2)");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["print(2)"]);
    expect(wrapper.emitted("change")?.at(-1)).toEqual([{ tab: "text", value: "print(2)" }]);

    await wrapper.find('button[data-tab="console"]').trigger("click");
    expect(wrapper.emitted("tab")?.[0]).toEqual(["console"]);

    await textarea.trigger("keyup");
    expect(wrapper.emitted("cursor")?.length).toBeGreaterThan(0);

    await wrapper.setProps({ readonly: true });
    expect((wrapper.find(".lg-text-editor__textarea").element as HTMLTextAreaElement).readOnly).toBe(true);

    wrapper.unmount();
  });

  it("LiteGuiTimeline supports v-model:frame, range and play events", async () => {
    const wrapper = mount(LiteGuiTimeline, {
      props: { start: 1, end: 100, frame: 1, height: 120 },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.find(".lg-timeline").exists()).toBe(true);

    const instance = getInstance<{
      setFrame: (value: number, emit?: boolean) => void;
      setRange: (start: number, end: number) => void;
      play: () => void;
      pause: () => void;
    }>(wrapper);

    instance.setFrame(30);
    expect(wrapper.emitted("update:frame")?.[0]).toEqual([30]);

    instance.setRange(10, 80);
    expect(wrapper.emitted("range")?.[0]).toEqual([{ start: 10, end: 80 }]);

    instance.play();
    expect(wrapper.emitted("play")?.[0]).toEqual([true]);
    instance.pause();
    expect(wrapper.emitted("play")?.[1]).toEqual([false]);

    wrapper.unmount();
  });

  it("LiteGuiToolbar supports v-model:active", async () => {
    const wrapper = mount(LiteGuiToolbar, {
      props: {
        tools: [
          { id: "move", label: "Move" },
          { id: "rotate", label: "Rotate" }
        ],
        active: "move",
        orientation: "horizontal"
      },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.find(".lg-toolbar").classes()).toContain("lg-toolbar--horizontal");
    await wrapper.findAll(".lg-toolbar__tool")[1].trigger("click");

    expect(wrapper.emitted("update:active")?.[0]).toEqual(["rotate"]);
    expect(wrapper.emitted("change")?.[0]).toEqual(["rotate"]);

    await wrapper.setProps({ active: "move" });
    expect(wrapper.emitted("change")).toHaveLength(1);

    wrapper.unmount();
  });

  it("LiteGuiTree renders data and emits select", async () => {
    const data = {
      id: "root",
      content: "Root",
      children: [
        { id: "a", content: "A" },
        { id: "b", content: "B" }
      ]
    };
    const wrapper = mount(LiteGuiTree, {
      props: { data, height: 200, allowRename: true },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.findAll(".ltreeitem")).toHaveLength(3);
    wrapper.findAll(".ltreeitem")[1].element.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(wrapper.emitted("select")?.[0]).toEqual([data.children[0]]);

    wrapper.unmount();
  });
});

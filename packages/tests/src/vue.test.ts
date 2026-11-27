import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { createApp, nextTick } from "vue";
import LiteGuiVue, {
  LiteGuiButton,
  LiteGuiCheckbox,
  LiteGuiConsole,
  LiteGuiDragger,
  LiteGuiDialog,
  LiteGuiList,
  LiteGuiMenu,
  LiteGuiPanel,
  LiteGuiSearchBox,
  LiteGuiSplit,
  LiteGuiTable,
  LiteGuiTabs,
  LiteGuiSlider
} from "@gausszhou/litegui-vue";

describe("Vue bindings", () => {
  it("installs all components through the Vue plugin", () => {
    const app = createApp({});
    app.use(LiteGuiVue);
    expect(app.component("LiteGuiButton")).toBeDefined();
    expect(app.component("LiteGuiMenu")).toBeDefined();
  });

  it("LiteGuiButton mounts, emits click and reflects label", async () => {
    const wrapper = mount(LiteGuiButton, {
      props: { label: "保存" },
      attachTo: document.body
    });
    await nextTick();

    const button = wrapper.find("button.litebutton");
    expect(button.text()).toBe("保存");

    await button.trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);

    await wrapper.setProps({ label: "运行" });
    expect(wrapper.find("button.litebutton").text()).toBe("运行");

    wrapper.unmount();
  });

  it("LiteGuiCheckbox supports v-model", async () => {
    const wrapper = mount(LiteGuiCheckbox, {
      props: { modelValue: false },
      attachTo: document.body
    });
    await nextTick();

    await wrapper.find(".litecheckbox").trigger("click");

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

    await wrapper.find(".liteslider").trigger("keydown", { key: "ArrowRight" });

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

    expect(wrapper.find(".panel-title").text()).toBe("属性");
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

    expect(wrapper.find(".litedialog").exists()).toBe(true);
    expect(wrapper.find(".slot-content").text()).toBe("内容");

    await wrapper.find(".close-button").trigger("click");

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
    await wrapper.findAll(".wtab")[1].trigger("click");
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

    expect(wrapper.find("table.litetable").text()).toContain("名称");
    expect(wrapper.find("table.litetable").text()).toContain("A");

    await wrapper.setProps({ rows: [{ name: "B" }] });
    await nextTick();
    expect(wrapper.find("table.litetable").text()).toContain("B");

    wrapper.unmount();
  });

  it("LiteGuiList selects items and emits v-model", async () => {
    const wrapper = mount(LiteGuiList, {
      props: { items: ["A", "B"], modelValue: "A" },
      attachTo: document.body
    });
    await nextTick();

    expect(wrapper.find(".list-item.selected").text()).toContain("A");

    await wrapper.findAll(".list-item")[1].trigger("click");

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

    expect(wrapper.findAll(".split-section")).toHaveLength(2);
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

    await wrapper.find(".lite-menu-item").trigger("click");

    const leaf = wrapper.findAll(".lite-menu-panel-item").find(item => item.text().includes("新建"));
    expect(leaf).toBeDefined();
    await leaf!.trigger("click");

    expect(wrapper.emitted("select")?.[0]).toEqual([{ label: "新建", path: "文件/新建" }]);

    wrapper.unmount();
  });
});

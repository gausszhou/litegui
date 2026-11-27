import { defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { Tabs } from "@gausszhou/litegui-components/tabs";

export interface LiteGuiTab {
  id: string;
  title?: string;
}

/**
 * `<LiteGuiTabs v-model="active" :tabs="tabs">`
 * 每个标签页用 `#tab-<id>` 插槽填充内容。
 */
export const LiteGuiTabs = defineComponent({
  name: "LiteGuiTabs",
  props: {
    tabs: { type: Array as PropType<LiteGuiTab[]>, default: () => [] },
    modelValue: { type: String, default: undefined },
    mode: { type: String as PropType<"horizontal" | "vertical">, default: "horizontal" },
    height: { type: [Number, String], default: 240 }
  },
  emits: ["update:modelValue", "change"],
  setup(props, { slots, emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    const contents: Record<string, HTMLDivElement | null> = {};
    let instance: Tabs | null = null;

    const build = () => {
      if (!host.value) return;
      instance = new Tabs({
        mode: props.mode,
        height: props.height,
        callback: (id: string) => {
          emit("update:modelValue", id);
          emit("change", id);
        }
      });

      for (const tab of props.tabs) {
        const content = contents[tab.id] ?? document.createElement("div");
        instance.addTab(tab.id, {
          title: tab.title ?? tab.id,
          content,
          selected: tab.id === props.modelValue
        });
      }

      host.value.appendChild(instance.root);
      if (props.modelValue) instance.selectTab(props.modelValue, true);
    };

    onMounted(build);

    watch(
      () => props.modelValue,
      value => {
        if (value && instance?.getCurrentTabId() !== value) instance?.selectTab(value);
      }
    );

    watch(
      () => props.tabs,
      async () => {
        await nextTick();
        instance?.root.remove();
        instance = null;
        build();
      },
      { deep: true }
    );

    onBeforeUnmount(() => {
      instance?.root.remove();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () =>
      h(
        "div",
        {
          ref: host,
          class: "lg-vue-tabs",
          style: {
            display: "block",
            height: typeof props.height === "number" ? `${props.height}px` : props.height
          }
        },
        props.tabs.map(tab =>
          h(
            "div",
            {
              key: tab.id,
              class: "lg-vue-tab-content",
              ref: element => {
                if (element) contents[tab.id] = element as HTMLDivElement;
              }
            },
            slots[`tab-${tab.id}`]?.()
          )
        )
      );
  }
});

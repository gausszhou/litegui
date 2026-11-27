import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { Inspector } from "@gausszhou/litegui-components/inspector";

export type LiteGuiInspectorItemType = "string" | "number" | "slider" | "checkbox" | "color" | "vector3";

export interface LiteGuiInspectorItem {
  /** 控件左侧显示的名称。 */
  name: string;
  type?: LiteGuiInspectorItemType;
  value?: unknown;
  min?: number;
  max?: number;
  step?: number;
  /** 透传给底层 Inspector 小部件的额外选项。 */
  options?: Record<string, unknown>;
}

/**
 * Inspector 仍使用 prototype 风格 API，类型声明只覆盖构造签名。
 */
interface InspectorInstance {
  root: HTMLDivElement;
  add: (
    type: string,
    name: string | null,
    value: unknown,
    options?: Record<string, unknown>
  ) => HTMLElement | undefined;
  clear?: () => void;
}

const toCSS = (value: number | string | undefined) => (typeof value === "number" ? `${value}px` : value);

/**
 * `<LiteGuiInspector :items="items" @change="..."/>`，或者用默认插槽放入自定义 DOM。
 */
export const LiteGuiInspector = defineComponent({
  name: "LiteGuiInspector",
  props: {
    items: { type: Array as PropType<LiteGuiInspectorItem[]>, default: () => [] },
    width: { type: [Number, String], default: undefined },
    height: { type: [Number, String], default: 240 },
    full: { type: Boolean, default: false },
    nameWidth: { type: Number, default: undefined }
  },
  emits: ["change"],
  setup(props, { slots, emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    const content = ref<HTMLDivElement | null>(null);
    let instance: InspectorInstance | null = null;

    const build = () => {
      if (!host.value) return;
      instance = new Inspector({
        width: props.width,
        height: props.height,
        full: props.full,
        name_width: props.nameWidth
      }) as unknown as InspectorInstance;
      host.value.replaceChildren(instance.root);

      for (const item of props.items) {
        instance.add(item.type ?? "string", item.name, item.value, {
          ...(item.options ?? {}),
          ...(item.min !== undefined ? { min: item.min } : {}),
          ...(item.max !== undefined ? { max: item.max } : {}),
          ...(item.step !== undefined ? { step: item.step } : {}),
          callback: (value: unknown) => emit("change", { name: item.name, value })
        });
      }

      if (!props.items.length && content.value) instance.root.appendChild(content.value);
    };

    onMounted(build);

    watch(
      () => [props.items, props.width, props.height, props.full, props.nameWidth],
      () => build(),
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
          class: "lg-vue-inspector",
          style: {
            display: "block",
            width: toCSS(props.width) ?? "100%",
            height: toCSS(props.height)
          }
        },
        props.items.length ? [] : [h("div", { ref: content, class: "lg-vue-inspector__content" }, slots.default?.())]
      );
  }
});

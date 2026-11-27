import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { Area } from "@gausszhou/litegui-components/area";

export type LiteGuiAreaSection = number | string;

const toCSS = (value: number | string) => (typeof value === "number" ? `${value}px` : value);

/**
 * `<LiteGuiArea :sections="[60, 40]" vertical>`，每个分区用 `#section-0` / `#section-1`
 * 插槽填充，未提供 `#section-0` 时默认插槽会填充第一个分区。
 * 不传 `sections` 且没有 `#section-1` 插槽时退化为单个内容区域，默认插槽直接填充。
 */
export const LiteGuiArea = defineComponent({
  name: "LiteGuiArea",
  props: {
    sections: {
      type: Array as PropType<LiteGuiAreaSection[]>,
      default: undefined
    },
    vertical: { type: Boolean, default: false },
    editable: { type: Boolean, default: true },
    width: { type: [Number, String], default: "100%" },
    height: { type: [Number, String], default: 240 }
  },
  emits: ["resize"],
  setup(props, { slots, emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    const slotHosts: Array<HTMLDivElement | null> = [];
    let instance: Area | null = null;
    let observer: ResizeObserver | null = null;

    const emitResize = () => {
      if (!instance) return;
      emit("resize", { width: instance.getWidth(), height: instance.getHeight() });
    };

    const destroy = () => {
      observer?.disconnect();
      observer = null;
      if (instance) {
        instance.root.removeEventListener("split_moved", emitResize);
        instance.root.remove();
      }
      instance = null;
    };

    const build = () => {
      destroy();
      if (!host.value) return;
      const sizes = props.sections?.length ? props.sections.slice(0, 2) : [50, 50];
      const split = Boolean(props.sections?.length || slots["section-1"]);
      instance = new Area({ width: props.width, height: props.height });
      if (split) instance.split(props.vertical ? "vertical" : "horizontal", sizes, props.editable);
      instance.root.addEventListener("split_moved", emitResize);
      host.value.replaceChildren(instance.root);

      slotHosts.forEach((element, index) => {
        const section = split ? instance?.sections[index] : index === 0 ? instance : null;
        const target = section ? section.content : null;
        if (element && target) target.appendChild(element);
      });

      if (typeof ResizeObserver !== "undefined" && host.value) {
        observer = new ResizeObserver(emitResize);
        observer.observe(host.value);
      }
    };

    onMounted(build);

    watch(
      () => [props.sections, props.vertical, props.editable],
      () => build(),
      { deep: true }
    );

    watch(
      () => [props.width, props.height],
      () => {
        if (!instance) return;
        instance.root.style.width = toCSS(props.width);
        instance.root.style.height = toCSS(props.height);
      }
    );

    onBeforeUnmount(destroy);

    expose({ getInstance: () => instance });

    return () =>
      h(
        "div",
        {
          ref: host,
          class: "lg-vue-area",
          style: {
            display: "block",
            position: "relative",
            width: toCSS(props.width),
            height: toCSS(props.height)
          }
        },
        [
          h(
            "div",
            {
              ref: element => {
                slotHosts[0] = element as HTMLDivElement | null;
              },
              class: "lg-vue-area__section"
            },
            slots["section-0"]?.() ?? slots.default?.()
          ),
          h(
            "div",
            {
              ref: element => {
                slotHosts[1] = element as HTMLDivElement | null;
              },
              class: "lg-vue-area__section"
            },
            slots["section-1"]?.()
          )
        ]
      );
  }
});

import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { Split } from "@gausszhou/litegui-components/split";

export type LiteGuiSplitSection = number | string | { id?: string; width?: number | string; height?: number | string };

/**
 * `<LiteGuiSplit :sections="[50, 50]" vertical>`，
 * 每个 section 用 `#section-0`、`#section-1` 插槽填充。
 */
export const LiteGuiSplit = defineComponent({
  name: "LiteGuiSplit",
  props: {
    sections: {
      type: Array as PropType<LiteGuiSplitSection[]>,
      default: () => [50, 50]
    },
    vertical: { type: Boolean, default: false }
  },
  setup(props, { slots, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    const contents: HTMLDivElement[] = [];
    let instance: Split | null = null;

    const create = () => {
      if (!host.value) return;
      instance = new Split(props.sections, { vertical: props.vertical });
      host.value.appendChild(instance.root);
      contents.forEach((element, index) => {
        const section = instance?.getSection(index);
        if (section) section.element.appendChild(element);
      });
    };

    onMounted(create);

    watch(
      () => [props.sections, props.vertical],
      () => {
        instance?.root.remove();
        instance = null;
        create();
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
          class: "lg-vue-split",
          style: { display: "block", height: "100%" }
        },
        props.sections.map((_, index) =>
          h(
            "div",
            {
              ref: element => {
                if (element) contents[index] = element as HTMLDivElement;
              },
              class: "lg-vue-split-section"
            },
            slots[`section-${index}`]?.()
          )
        )
      );
  }
});

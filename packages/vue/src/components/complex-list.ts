import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { ComplexList } from "@gausszhou/litegui-components/complex-list";

export interface LiteGuiComplexListItem {
  content?: string;
  name?: string;
  enabled?: boolean;
  removable?: boolean;
  [key: string]: unknown;
}

/**
 * `<LiteGuiComplexList :items="items" :height="200" @select="..." @toggle="..." @remove="..." />`
 */
export const LiteGuiComplexList = defineComponent({
  name: "LiteGuiComplexList",
  props: {
    items: {
      type: Array as PropType<Array<string | LiteGuiComplexListItem>>,
      default: () => []
    },
    height: { type: [Number, String], default: 200 }
  },
  emits: ["select", "toggle", "remove"],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: ComplexList | null = null;

    const build = () => {
      if (!host.value) return;
      instance = new ComplexList({ height: props.height });
      instance.onItemSelected = item => emit("select", item);
      instance.onItemToggled = (item, element) => {
        emit("toggle", { item, enabled: element.classList.contains("lg-is-enabled") });
      };
      instance.onItemRemoved = item => emit("remove", item);

      for (const raw of props.items) {
        const item: LiteGuiComplexListItem = typeof raw === "string" ? { content: raw } : raw;
        const title = item.content ?? item.name ?? "";
        instance.addItem(item, title, Boolean(item.enabled), item.removable !== false);
      }

      host.value.replaceChildren(instance.root);
    };

    onMounted(build);

    watch(
      () => [props.items, props.height],
      () => build(),
      { deep: true }
    );

    onBeforeUnmount(() => {
      instance?.root.remove();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () => h("div", { ref: host, class: "lg-vue-complex-list", style: { display: "block", width: "100%" } });
  }
});

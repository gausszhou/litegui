import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { Tree } from "@gausszhou/litegui-components/tree";

export interface LiteGuiTreeNode {
  id: string;
  content?: string;
  children?: LiteGuiTreeNode[];
  visible?: boolean;
  className?: string;
  [key: string]: unknown;
}

const toCSS = (value: number | string | undefined) => (typeof value === "number" ? `${value}px` : value);

/**
 * `<LiteGuiTree :data="tree" :height="240" allow-rename @select="..." />`
 */
export const LiteGuiTree = defineComponent({
  name: "LiteGuiTree",
  props: {
    data: {
      type: Object as PropType<LiteGuiTreeNode>,
      default: () => ({ id: "root", content: "Root" })
    },
    height: { type: [Number, String], default: 240 },
    allowRename: { type: Boolean, default: false },
    allowDrag: { type: Boolean, default: true },
    allowMultiSelection: { type: Boolean, default: false }
  },
  emits: ["select"],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: Tree | null = null;

    const onSelected = (event: Event) => {
      const detail = (event as CustomEvent<{ data?: unknown }>).detail;
      emit("select", detail?.data ?? detail);
    };

    const build = () => {
      if (!host.value) return;
      instance?.root.removeEventListener("item_selected", onSelected);
      instance = new Tree(props.data, {
        height: props.height,
        allow_rename: props.allowRename,
        allow_drag: props.allowDrag,
        allow_multiselection: props.allowMultiSelection
      });
      instance.root.addEventListener("item_selected", onSelected);
      host.value.replaceChildren(instance.root);
    };

    onMounted(build);

    watch(
      () => props.data,
      value => instance?.updateTree(value),
      { deep: true }
    );

    watch(
      () => props.height,
      value => {
        if (instance) instance.root.style.height = toCSS(value) ?? "";
      }
    );

    watch(
      () => [props.allowRename, props.allowDrag, props.allowMultiSelection],
      () => build()
    );

    onBeforeUnmount(() => {
      instance?.root.removeEventListener("item_selected", onSelected);
      instance?.root.remove();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () => h("div", { ref: host, class: "lg-vue-tree", style: { display: "block", width: "100%" } });
  }
});

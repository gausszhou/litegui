import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { NodeEditor } from "@gausszhou/litegui-components/node-editor";
import type { NodeEditorLink, NodeEditorNode } from "@gausszhou/litegui-components";

const toCSS = (value: number | string) => (typeof value === "number" ? `${value}px` : value);

export interface LiteGuiNodeEditorGraph {
  nodes: NodeEditorNode[];
  links: NodeEditorLink[];
}

/**
 * `<LiteGuiNodeEditor :nodes="nodes" :links="links" @change="..." @select="..." />`
 */
export const LiteGuiNodeEditor = defineComponent({
  name: "LiteGuiNodeEditor",
  props: {
    nodes: { type: Array as PropType<NodeEditorNode[]>, default: () => [] },
    links: { type: Array as PropType<NodeEditorLink[]>, default: () => [] },
    readOnly: { type: Boolean, default: false },
    height: { type: [Number, String], default: 320 }
  },
  emits: ["change", "select"],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: NodeEditor | null = null;

    const build = () => {
      if (!host.value) return;
      instance = new NodeEditor({
        nodes: props.nodes,
        links: props.links,
        readOnly: props.readOnly
      });
      instance.on("change", graph => emit("change", graph as LiteGuiNodeEditorGraph));
      instance.on("select", id => emit("select", id));
      host.value.replaceChildren(instance.root);
    };

    onMounted(build);

    watch(
      () => [props.nodes, props.links],
      () => {
        if (!instance) return;
        instance.setGraph(props.nodes, props.links);
      },
      { deep: true }
    );

    watch(
      () => props.readOnly,
      () => build()
    );

    onBeforeUnmount(() => {
      instance?.root.remove();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () =>
      h("div", {
        ref: host,
        class: "lg-vue-node-editor",
        style: { display: "block", width: "100%", height: toCSS(props.height) }
      });
  }
});

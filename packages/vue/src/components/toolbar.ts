import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { Toolbar } from "@gausszhou/litegui-components/toolbar";

export interface LiteGuiToolbarTool {
  id: string;
  label?: string;
  icon?: string;
  shortcut?: string;
}

/**
 * `<LiteGuiToolbar v-model:active="active" :tools="tools" orientation="horizontal" @change="..." />`
 */
export const LiteGuiToolbar = defineComponent({
  name: "LiteGuiToolbar",
  props: {
    tools: { type: Array as PropType<LiteGuiToolbarTool[]>, default: () => [] },
    active: { type: String as PropType<string | null>, default: null },
    orientation: { type: String as PropType<"vertical" | "horizontal">, default: "vertical" },
    title: { type: String, default: undefined }
  },
  emits: ["update:active", "change"],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: Toolbar | null = null;

    const build = () => {
      if (!host.value) return;
      instance = new Toolbar({
        tools: props.tools,
        active: props.active,
        orientation: props.orientation,
        title: props.title
      });
      instance.on("change", id => {
        emit("update:active", id);
        emit("change", id);
      });
      host.value.replaceChildren(instance.root);
    };

    onMounted(build);

    watch(
      () => props.tools,
      value => instance?.setTools(value),
      { deep: true }
    );

    watch(
      () => props.active,
      value => {
        if (instance && instance.getActive() !== value) instance.setActive(value);
      }
    );

    watch(
      () => [props.orientation, props.title],
      () => build()
    );

    onBeforeUnmount(() => {
      instance?.root.remove();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () => h("div", { ref: host, class: "lg-vue-toolbar", style: { display: "inline-block" } });
  }
});

import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { StatusBar } from "@gausszhou/litegui-components/status-bar";

/**
 * `<LiteGuiStatusBar left="就绪" :right="['UTF-8', 'Ln 1']" accent="v1.0.1" />`
 */
export const LiteGuiStatusBar = defineComponent({
  name: "LiteGuiStatusBar",
  props: {
    left: { type: String, default: "" },
    right: { type: Array as PropType<string[]>, default: () => [] },
    accent: { type: String, default: "" }
  },
  setup(props, { expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: StatusBar | null = null;

    const applyRight = () => {
      if (!instance) return;
      instance.setRight(props.right);
      if (props.accent) instance.addAccent(props.accent);
    };

    const build = () => {
      if (!host.value) return;
      instance = new StatusBar({ left: props.left || undefined });
      applyRight();
      host.value.replaceChildren(instance.root);
    };

    onMounted(build);

    watch(
      () => props.left,
      value => instance?.setLeft(value)
    );

    watch(
      () => props.right,
      () => applyRight(),
      { deep: true }
    );

    watch(
      () => props.accent,
      () => applyRight()
    );

    onBeforeUnmount(() => {
      instance?.root.remove();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () => h("div", { ref: host, class: "lg-vue-status-bar", style: { display: "block", width: "100%" } });
  }
});

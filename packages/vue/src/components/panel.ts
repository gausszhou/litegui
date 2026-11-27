import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Panel } from "@gausszhou/litegui-components/panel";

/**
 * `<LiteGuiPanel title="属性" :height="200" @close="...">内容</LiteGuiPanel>`
 */
export const LiteGuiPanel = defineComponent({
  name: "LiteGuiPanel",
  props: {
    title: { type: String, default: "" },
    height: { type: Number, default: 180 },
    closable: { type: Boolean, default: false }
  },
  emits: ["close"],
  setup(props, { slots, emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    const content = ref<HTMLDivElement | null>(null);
    let instance: Panel | null = null;

    onMounted(() => {
      if (!host.value) return;
      instance = new Panel({
        title: props.title,
        height: props.height,
        close: props.closable
      });
      host.value.appendChild(instance.root);
      if (content.value) instance.content.appendChild(content.value);
      instance.on("closed", () => emit("close"));
    });

    watch(
      () => props.title,
      value => instance?.setTitle(value)
    );

    watch(
      () => props.height,
      value => {
        if (instance) instance.root.style.height = `${value}px`;
      }
    );

    onBeforeUnmount(() => {
      instance?.root.remove();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () =>
      h("div", { ref: host, class: "lg-vue-panel", style: { display: "block", minHeight: "120px" } }, [
        h("div", { ref: content, class: "lg-vue-panel-content" }, slots.default?.())
      ]);
  }
});

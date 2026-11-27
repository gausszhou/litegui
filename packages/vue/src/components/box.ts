import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { LiteBox } from "@gausszhou/litegui-components/box";

/**
 * `<LiteGuiBox><div>内容</div></LiteGuiBox>`
 */
export const LiteGuiBox = defineComponent({
  name: "LiteGuiBox",
  props: {
    stopPropagation: { type: Boolean, default: false }
  },
  setup(props, { slots, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    const content = ref<HTMLDivElement | null>(null);
    let instance: LiteBox | null = null;

    onMounted(() => {
      if (!host.value) return;
      instance = new LiteBox();
      instance.stopPropagation = props.stopPropagation;
      host.value.appendChild(instance.root);
      if (content.value) instance.root.appendChild(content.value);
    });

    watch(
      () => props.stopPropagation,
      value => {
        if (instance) instance.stopPropagation = value;
      }
    );

    onBeforeUnmount(() => {
      instance?.root.remove();
      instance = null;
    });

    expose({ getInstance: () => instance });

    return () =>
      h("div", { ref: host, class: "lg-vue-box", style: { display: "block" } }, [
        h("div", { ref: content, class: "lg-vue-box__content" }, slots.default?.())
      ]);
  }
});

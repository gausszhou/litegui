import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Dialog } from "@gausszhou/litegui-components/dialog";

/**
 * `<LiteGuiDialog v-model="open" title="设置">内容</LiteGuiDialog>`
 */
export const LiteGuiDialog = defineComponent({
  name: "LiteGuiDialog",
  props: {
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: "" },
    width: { type: Number, default: 320 },
    height: { type: Number, default: 200 },
    closable: { type: Boolean, default: true }
  },
  emits: ["update:modelValue", "close"],
  setup(props, { slots, emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    const content = ref<HTMLDivElement | null>(null);
    let instance: Dialog | null = null;

    const create = () => {
      if (!host.value) return;
      instance = new Dialog({
        parent: host.value,
        title: props.title,
        width: props.width,
        height: props.height,
        close: props.closable,
        draggable: true,
        resizable: true
      });
      if (content.value) instance.content.appendChild(content.value);
      instance.on("closed", () => {
        emit("update:modelValue", false);
        emit("close");
      });
    };

    const sync = () => {
      if (props.modelValue) {
        if (!instance || !instance.root.isConnected) create();
        instance?.show();
      } else {
        instance?.hide();
      }
    };

    onMounted(() => {
      create();
      sync();
    });

    watch(() => props.modelValue, sync);

    watch(
      () => [props.width, props.height],
      () => {
        if (!instance) return;
        instance.root.style.width = `${props.width}px`;
        instance.root.style.height = `${props.height}px`;
        instance.center();
      }
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
          class: "lg-vue-dialog",
          style: {
            display: "block",
            position: "relative",
            height: `${props.height + 40}px`
          }
        },
        [h("div", { ref: content, class: "lg-vue-dialog-content" }, slots.default?.())]
      );
  }
});

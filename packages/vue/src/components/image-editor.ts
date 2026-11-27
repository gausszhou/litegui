import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ImageEditor } from "@gausszhou/litegui-components/image-editor";

const toCSS = (value: number | string) => (typeof value === "number" ? `${value}px` : value);

/**
 * `<LiteGuiImageEditor v-model:zoom="zoom" src="/render.png" title="Render Result" />`
 */
export const LiteGuiImageEditor = defineComponent({
  name: "LiteGuiImageEditor",
  props: {
    src: { type: String, default: "" },
    title: { type: String, default: "Image" },
    subtitle: { type: String, default: undefined },
    zoom: { type: Number, default: 1 },
    minZoom: { type: Number, default: 0.1 },
    maxZoom: { type: Number, default: 8 },
    checkerboard: { type: Boolean, default: false },
    autoFit: { type: Boolean, default: true },
    emptyText: { type: String, default: "No image" },
    height: { type: [Number, String], default: 320 }
  },
  emits: ["update:zoom", "zoom", "source"],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: ImageEditor | null = null;

    const build = () => {
      if (!host.value) return;
      instance = new ImageEditor({
        src: props.src || undefined,
        title: props.title,
        subtitle: props.subtitle,
        zoom: props.zoom,
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        checkerboard: props.checkerboard,
        autoFit: props.autoFit,
        emptyText: props.emptyText
      });
      instance.on("zoom", value => {
        emit("update:zoom", value);
        emit("zoom", value);
      });
      instance.on("source", value => emit("source", value));
      host.value.replaceChildren(instance.root);
    };

    onMounted(build);

    watch(
      () => props.src,
      value => {
        if (!instance) return;
        if (value) instance.setSource(value);
      }
    );

    watch(
      () => [props.title, props.subtitle],
      () => instance?.setTitle(props.title, props.subtitle)
    );

    watch(
      () => props.zoom,
      value => {
        if (!instance) return;
        if (Math.abs(instance.getZoom() - value) > 1e-6) instance.setZoom(value);
      }
    );

    watch(
      () => [props.minZoom, props.maxZoom, props.checkerboard, props.autoFit, props.emptyText],
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
        class: "lg-vue-image-editor",
        style: { display: "block", width: "100%", height: toCSS(props.height) }
      });
  }
});

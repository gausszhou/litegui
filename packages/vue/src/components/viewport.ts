import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import { Viewport } from "@gausszhou/litegui-components/viewport";
import type { ViewportEditElement, ViewportObject, ViewportShading } from "@gausszhou/litegui-components/viewport";

const toCSS = (value: number | string) => (typeof value === "number" ? `${value}px` : value);

/**
 * `<LiteGuiViewport v-model:selected="id" :objects="objects" shading="solid" overlays />`
 *
 * 事件：`select` → id、`status` → text、`change` → { objects }、
 * `contextmenu` → { x, y }、`transform` → { kind, phase }。
 */
export const LiteGuiViewport = defineComponent({
  name: "LiteGuiViewport",
  props: {
    objects: { type: Array as PropType<ViewportObject[]>, default: () => [] },
    selected: { type: String as PropType<string | null>, default: null },
    overlays: { type: Boolean, default: false },
    sidebarOpen: { type: Boolean, default: false },
    shading: { type: String as PropType<ViewportShading>, default: "solid" },
    editMode: { type: Boolean, default: false },
    editElement: { type: String as PropType<ViewportEditElement>, default: "vertex" },
    brush: { type: String as PropType<string | null>, default: null },
    height: { type: [Number, String], default: 360 }
  },
  emits: ["update:selected", "select", "status", "change", "contextmenu", "transform"],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement | null>(null);
    let instance: Viewport | null = null;

    onMounted(() => {
      if (!host.value) return;
      instance = new Viewport({
        objects: props.objects,
        selected: props.selected,
        overlays: props.overlays,
        sidebarOpen: props.sidebarOpen,
        shading: props.shading,
        editMode: props.editMode,
        editElement: props.editElement,
        brush: props.brush
      });
      instance.on("select", id => {
        const value = (id ?? null) as string | null;
        emit("update:selected", value);
        emit("select", value);
      });
      instance.on("status", text => emit("status", String(text ?? "")));
      instance.on("change", () => emit("change", { objects: instance?.getObjects() ?? [] }));
      instance.on("context-menu", payload => emit("contextmenu", payload));
      instance.on("transform", payload => emit("transform", payload));
      host.value.replaceChildren(instance.root);
    });

    watch(
      () => props.objects,
      () => instance?.setObjects(props.objects),
      { deep: true }
    );

    watch(
      () => props.selected,
      value => {
        if (!instance) return;
        if (instance.getSelected() !== (value ?? null)) instance.setSelected(value ?? null);
      }
    );

    watch(
      () => props.overlays,
      value => instance?.setOverlays(value)
    );
    watch(
      () => props.sidebarOpen,
      value => instance?.setSidebarOpen(value)
    );
    watch(
      () => props.shading,
      value => instance?.setShading(value)
    );
    watch(
      () => props.editMode,
      value => instance?.setEditMode(value)
    );
    watch(
      () => props.editElement,
      value => instance?.setEditElementMode(value)
    );
    watch(
      () => props.brush,
      value => instance?.setBrush(value)
    );

    onBeforeUnmount(() => {
      instance?.dispose();
      instance = null;
    });

    expose({
      getInstance: () => instance,
      frameAll: () => instance?.frameAll(),
      focusSelection: () => instance?.focusSelection(),
      setView: (yaw: number, pitch: number, distance?: number) => instance?.setView(yaw, pitch, distance),
      zoom: (delta: number) => instance?.zoom(delta),
      snapshot: () => instance?.snapshot() ?? ""
    });

    return () =>
      h("div", {
        ref: host,
        class: "lg-vue-viewport",
        style: { display: "block", width: "100%", height: toCSS(props.height) }
      });
  }
});

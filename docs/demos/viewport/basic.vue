<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Viewport } from "@gausszhou/litegui-components";
import type { ViewportObject } from "@gausszhou/litegui-components";

const host = ref<HTMLElement>();
let viewport: Viewport | null = null;

const objects: ViewportObject[] = [
  {
    id: "cube",
    name: "Cube",
    type: "mesh",
    loc: [0, 0, 0.9],
    rot: [0.35, 0.6, 0],
    scale: [1.4, 1.4, 1.4],
    visible: true,
    selectable: true
  },
  {
    id: "camera",
    name: "Camera",
    type: "camera",
    loc: [3.6, 1.8, 3.4],
    rot: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    selectable: true
  },
  {
    id: "light",
    name: "Light",
    type: "light",
    loc: [-3.2, 2.4, 2.8],
    rot: [0, 0, 0],
    scale: [1, 1, 1],
    visible: true,
    selectable: true
  }
];

onMounted(() => {
  viewport = new Viewport({ objects, overlays: true, shading: "solid" });
  host.value?.appendChild(viewport.root);
  requestAnimationFrame(() => viewport?.resize());
});

onBeforeUnmount(() => {
  viewport?.dispose();
  viewport = null;
});
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-row" style="height: 260px" />
    <p class="doc-demo-hint">拖动旋转、右键平移、滚轮缩放；点击立方体可选中。</p>
  </div>
</template>

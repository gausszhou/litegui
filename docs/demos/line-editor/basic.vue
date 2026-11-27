<script setup lang="ts">
import { onMounted, ref } from "vue";
import { LineEditor } from "@gausszhou/litegui";

const host = ref<HTMLElement>();

onMounted(() => {
  const editor = new LineEditor(
    [
      [0, 0.2],
      [0.5, 0.8],
      [1, 0.3],
    ],
    { width: 360, height: 120, show_samples: 4 },
  );
  host.value?.appendChild(editor.root);
});
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-host doc-demo-canvas-host" />
    <p class="doc-demo-hint">拖动圆点或点击曲线编辑数值；画布尺寸由 `width` / `height` 控制。</p>
  </div>
</template>

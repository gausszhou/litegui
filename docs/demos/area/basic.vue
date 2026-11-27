<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Area } from "@gausszhou/litegui";

const host = ref<HTMLElement>();

onMounted(() => {
  const area = new Area({ id: "doc-area", height: "100%" });
  host.value?.appendChild(area.root);

  area.split("horizontal", [null, 140], true);
  area.getSection(0).content.innerHTML = '<div class="doc-pane">左侧：自适应剩余宽度</div>';
  area.getSection(1).content.innerHTML = '<div class="doc-pane">右侧：140px</div>';
});
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-host doc-demo-area-host" />
    <p class="doc-demo-hint">拖动中间的分隔条可以调整两栏宽度。</p>
  </div>
</template>

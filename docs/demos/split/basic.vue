<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Split } from "@gausszhou/litegui-components";

const host = ref<HTMLElement>();

onMounted(() => {
  const split = new Split([{ width: "35%" }, { width: "65%" }], { parent: host.value });
  split.getSection(0).element.innerHTML = '<div class="doc-pane">35%</div>';
  split.getSection(1).element.innerHTML = '<div class="doc-pane">65%</div>';
});
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-host doc-demo-split-host" />
    <p class="doc-demo-hint">Split 是固定比例分栏；需要可拖拽调整时用 Area。</p>
  </div>
</template>

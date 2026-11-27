<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Dragger } from "@gausszhou/litegui-components";

const host = ref<HTMLElement>();
const value = ref(1.5);

onMounted(() => {
  const dragger = new Dragger(1.5, { min: 0, max: 10, step: 0.1, precision: 2 });
  dragger.input.addEventListener("change", () => {
    value.value = dragger.getValue();
  });
  host.value?.appendChild(dragger.root);
});
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-row" />
    <p class="doc-demo-hint">上下拖动数值区域或直接输入。当前值：{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Slider } from "@gausszhou/litegui-components";

const host = ref<HTMLElement>();
const value = ref(0.4);

onMounted(() => {
  const slider = new Slider(0.4, { min: 0, max: 1, step: 0.01 });
  slider.onChange = (next: number) => {
    value.value = next;
  };
  host.value?.appendChild(slider.root);
});
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-slider-host" />
    <p class="doc-demo-hint">当前值：{{ value.toFixed(2) }}</p>
  </div>
</template>

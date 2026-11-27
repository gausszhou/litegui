<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Checkbox } from "@gausszhou/litegui";

const host = ref<HTMLElement>();
const checked = ref(true);

onMounted(() => {
  const checkbox = new Checkbox(true, {
    onChange: (value: boolean) => {
      checked.value = value;
    },
  });
  host.value?.appendChild(checkbox.root);
});
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-row" />
    <p class="doc-demo-hint">当前值：{{ checked }}（点击或按 Space / Enter 切换）</p>
  </div>
</template>

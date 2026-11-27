<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ComplexList } from "@gausszhou/litegui";

const host = ref<HTMLElement>();
const selected = ref("（未选择）");

onMounted(() => {
  const list = new ComplexList({
    height: 220,
    item_code:
      "<div class='listitem'><span class='tick'><span>Tick</span></span><span class='title'></span></div>",
  });
  list.addTitle("图层");
  list.addItem({ name: "背景" }, "背景", true);
  list.addItem({ name: "角色" }, "角色", true);
  list.addItem({ name: "特效" }, "特效", true);
  list.onItemSelected = (item: { name: string }) => {
    selected.value = item.name;
  };
  host.value?.appendChild(list.root);
});
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-list-host" />
    <p class="doc-demo-hint">当前选中：{{ selected }}</p>
  </div>
</template>

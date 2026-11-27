<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Tabs } from "@gausszhou/litegui-components";

const host = ref<HTMLElement>();

onMounted(() => {
  const tabs = new Tabs();
  tabs.addTab("info", { title: "信息", content: "第一个标签页的内容。" });
  tabs.addTab("tree", { title: "层级", content: "第二个标签页的内容。" });
  tabs.appendTo(host.value!);
  tabs.selectTab("tree");
});
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-host doc-demo-tabs-host" />
    <p class="doc-demo-hint">点击标签切换内容，`selectTab(id)` 用于默认选中。</p>
  </div>
</template>

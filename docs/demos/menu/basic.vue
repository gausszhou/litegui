<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { Menu } from "@gausszhou/litegui-components";

const host = ref<HTMLElement>();
const last = ref("（尚未选择）");
let menu: Menu | null = null;

onMounted(() => {
  menu = new Menu("doc-menu", { container: host.value });

  const pick = (label: string) => () => {
    last.value = label;
  };

  menu.add("文件/新建文本文件", { callback: pick("新建文本文件") });
  menu.add("文件/新建文件夹", { callback: pick("新建文件夹") });
  menu.add("文件/使用配置文件新建窗口/创建配置文件", { callback: pick("创建配置文件") });
  menu.add("编辑/复制", { callback: pick("复制") });
  menu.add("编辑/粘贴", { callback: pick("粘贴") });

  host.value?.appendChild(menu.root);
});

onUnmounted(() => {
  menu?.hideMenuPanel();
});
</script>

<template>
  <div class="doc-demo">
    <div ref="host" class="doc-demo-row doc-demo-menu-host" />
    <p class="doc-demo-hint">
      点击「文件」或「编辑」展开菜单，点击「使用配置文件新建窗口」查看二级菜单。当前选择：{{ last }}
    </p>
    <p class="doc-demo-hint">二级菜单会与父项顶部对齐，并从父面板右缘展开。</p>
  </div>
</template>

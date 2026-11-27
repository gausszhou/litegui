<script setup lang="ts">
import { onErrorCaptured, onMounted, ref, shallowRef, watch, type Component } from "vue";
import { useData } from "vitepress";

const props = withDefaults(
  defineProps<{
    /** docs/demos 下的相对路径（不含 .vue），例如 button/basic */
    name: string;
    title?: string;
    height?: string;
  }>(),
  { height: "220px" },
);

const { isDark } = useData();
const demo = shallowRef<Component | null>(null);
const error = ref("");

// 懒加载：只有真正渲染到 demo 时才加载对应组件与 LiteGUI
const modules = import.meta.glob("../../../demos/**/*.vue");

async function loadDemo() {
  const key = `../../../demos/${props.name}.vue`;
  const loader = modules[key];
  if (!loader) {
    error.value = `未找到 demo：docs/demos/${props.name}.vue`;
    return;
  }
  try {
    const mod = (await loader()) as { default: Component };
    demo.value = mod.default;
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : String(cause);
  }
}

function syncTheme() {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.lgTheme = isDark.value ? "dark" : "light";
}

onMounted(() => {
  syncTheme();
  void loadDemo();
});
watch(isDark, syncTheme);

onErrorCaptured((cause) => {
  error.value = cause instanceof Error ? cause.message : String(cause);
  return false;
});
</script>

<template>
  <div class="lg-demo-block">
    <div v-if="title" class="lg-demo-title">{{ title }}</div>
    <div class="lg-demo" :style="{ minHeight: height }">
      <ClientOnly>
        <component :is="demo" v-if="demo" />
        <p v-else-if="error" class="lg-demo-error">示例加载失败：{{ error }}</p>
        <p v-else class="lg-demo-loading">示例加载中…</p>
      </ClientOnly>
    </div>
  </div>
</template>

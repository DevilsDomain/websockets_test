<template>
  <div
    ref="chatBox"
    v-html="chatLog"
    class="m-4 p-2 overflow-scroll border border-black	border-2 size "
  ></div>
</template>
<script setup>
import { toRefs } from "vue";
import { useScroll } from "@vueuse/core";
const props = defineProps(["chatLog"]);
const { chatLog } = toRefs(props);
const chatBox = ref(null);
const { y } = useScroll(chatBox, {
  behavior: "smooth",
});

watch(chatLog, () => {
  nextTick(() => {
    y.value = chatBox.value.scrollHeight;
  });
});
</script>
<style scoped>

.size {
  width: 621px;
  height: 576px;
}
</style>
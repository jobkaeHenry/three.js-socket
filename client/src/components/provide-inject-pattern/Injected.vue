<template>
  <div>
    {{ counter }}
  </div>
  <button @click="incrementCounter">추가</button>
</template>

<script setup lang="ts">
import { Ref, inject, ref } from "vue";
const { counter, incrementCounter } = inject<{
  counter: Ref<number>;
  incrementCounter: () => void;
}>("counter", {
  counter: ref(0),
  incrementCounter: () => {},
});
</script>

<style scoped></style>

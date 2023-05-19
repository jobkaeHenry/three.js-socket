<template>
  <h1>부모컴포넌트</h1>
  {{ counter }}
  <slot></slot>
  <button @click="incrementCounter">추가</button>
</template>

<script setup lang="ts">
import { ref, provide } from "vue";
const counter = ref(0);
const incrementCounter = () => {
  counter.value++;
};
provide("counter", {counter,incrementCounter});
</script>

<style scoped></style>

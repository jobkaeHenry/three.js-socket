<template>
  <div>
    <RecursiveComponent :array="twoDimensionalArray" />
  </div>
</template>

<script>
export default (await import("vue")).defineComponent({
  name: "RecursiveComponent",
  props: {
    array: {
      type: Array,
      required: true,
    },
  },
  components: {
    RecursiveComponent,
  },
});
</script>

<script setup>

data() {
  return {
    twoDimensionalArray: [
      [1, 5, 1],
      [7, 4, 6],
      [2, 8, 9],
    ],
  };
},
</script>

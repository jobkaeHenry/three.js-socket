<script setup lang="ts">
import { onMounted, ref } from "vue";
import { io } from "socket.io-client";
import NewMatrix3DGraph from "./components/NewMatrix3DGraph.vue";
import Provider from "./components/provide-inject-pattern/Provider.vue";
import Injected from "./components/provide-inject-pattern/Injected.vue";
// import Matrix3DGraph from "./components/Matrix3DGraph.vue";
// import { dummyData } from "./dummyMatrix";

const _socketPort = 3001;

const socket = ref();

const useSocket = (url: string) => {
  const socket = io(url);
  return socket;
};
// export type MatrixType = number[][][]
type DataType = {
  longitude: number;
  latitude: number;
  altitude: number;
  value: number;
};
export type MatrixType = DataType[];
const matrix = ref<MatrixType>();

onMounted(() => {
  socket.value = useSocket(`ws://localhost:${_socketPort}`);
  if (socket.value) {
    socket.value.on("status", (message: MatrixType) => {
      matrix.value = message;
    });
  }
});

const gap = ref(1);
const margin = ref(0.1);
const selectedType = ref<"sphere" | "cube">("sphere");
const isErrorOnly = ref(false);

const errorOnlySelector = () => {
  isErrorOnly.value = !isErrorOnly.value;
};
const typeSelector = () => {
  if (selectedType.value === "sphere") {
    selectedType.value = "cube";
  } else selectedType.value = "sphere";
};
const gapSelector = (e: Event) => {
  gap.value = Number(e.target.value);
};
const marginSelector = (e: Event) => {
  margin.value = Number(e.target.value) / 10;
};
</script>

<template>
  <div class="drawer">
    <Provider>
      <Injected></Injected>
    </Provider>
    <h1>소켓 서버</h1>
    <div class="serverSent-mesage-warpper">
      <span>{{ matrix }}</span>
    </div>
    <NewMatrix3DGraph
      :type="selectedType"
      :matrix="matrix"
      :canvas-size="{ width: 360, height: 240 }"
      :cube-margin="margin"
      :gap="gap"
      :error-only="isErrorOnly"
    />
  </div>
  <div class="row">
    <!-- <Matrix3DGraph
      :type="selectedType"
      :matrix="matrix"
      :canvas-size="{ width: 1600, height: 1000 }"
      :cube-margin="margin"
      :gap="gap"
      :error-only="isErrorOnly"
    /> -->

    <NewMatrix3DGraph
      :type="selectedType"
      :matrix="matrix"
      :canvas-size="{ width: 1024, height: 768 }"
      :cube-margin="margin"
      :gap="gap"
      :error-only="isErrorOnly"
    />
    <div class="col">
      <button :onClick="typeSelector">
        {{ selectedType === "sphere" ? "큐브 모델보기" : "구 모델보기" }}
      </button>
      <button :onClick="errorOnlySelector">
        {{ isErrorOnly ? "모든 정보 보기" : "저품질 정보만 보기" }}
      </button>
      <label>
        Gap
        <input type="number" min="0" @change="gapSelector" :value="gap"
      /></label>
      <label>
        margin
        <input
          type="number"
          min="0"
          @change="marginSelector"
          :value="margin * 10"
      /></label>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-direction: row;
  margin-left: 360px;
  padding: 16px;
}
.col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mesage-log-wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  border: 1px solid #ccc;
  height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.server-sent-message {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ccc;
  list-style: none;
  justify-self: left;
}
.serverSent-mesage-warpper {
  width: 300px;
  height: 500px;
  overflow-y: scroll;
}
.client-sent-message {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ccc;
  list-style: none;
  color: #fff;
  background-color: dimgray;
  justify-self: left;
}
.drawer {
  width: 360px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  border: 1px solid #eee;
  position: absolute;
  background-color: #fff;
}
</style>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import ColorParser from "./utils/colorParser";
import { io } from "socket.io-client";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const _socketPort = 3001;

const socket = ref();
const matrix = ref<number[][]>([
  [1, 2],
  [1, 2],
]);
const canvasRef = ref<HTMLElement | null>(null);

const useSocket = (url: string) => {
  const socket = io(url);
  return socket;
};

onMounted(() => {
  if (!canvasRef.value) {
    return;
  }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
  // 렌더러설정
  const renderer = new THREE.WebGLRenderer();
  canvasRef.value.appendChild(renderer.domElement);
  renderer.setSize(340, 340);

  let cubes: THREE.Mesh[] = [];

  const createCube = () => {
    const cubeSize = 2;
    if (matrix.value) {
      matrix.value.map((row, rowIndex) => {
        row.map((col, colIndex) => {
          const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

          const material = new THREE.MeshBasicMaterial({
            color: ColorParser(col),
          });
          // const material = new THREE.MeshStandardMaterial({
          //   color: new THREE.Color().setStyle(ColorParser(col)),
          //   transparent: true, // 투명하게 설정
          //   opacity: 0.5, // 알파값 설정 (0.0 ~ 1.0)
          // });

          const cube = new THREE.Mesh(geometry, material);

          scene.add(cube);

          cube.position.set(
            (colIndex + 1) * cubeSize - row.length / 2,
            (rowIndex + 1) * cubeSize - matrix.value.length / 2,
            -cubeSize * row.length/2
          );
          cubes.push(cube);
        });
      });
    }
  };
  // 초기 큐브 생성
  createCube();

  // 큐브 업데이트 함수
  function updateCubes() {
    cubes.forEach((cube: THREE.Mesh) => {
      scene.remove(cube);
    });
    cubes = [];
    createCube();
  }

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", () => {
    renderer.render(scene, camera);
  });

  camera.position.z = 20;
  camera.position.x = 10;
  camera.position.y = 20;

  // 매 프레임마다 랜더
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // 업데이트 구현
  watch(matrix, () => {
    updateCubes();
  });
});

onMounted(() => {
  socket.value = useSocket(`ws://localhost:${_socketPort}`);

  if (socket.value) {
    socket.value.on("status", (message: number[][]) => {
      matrix.value = message;
    });
  }
});

const userInput = ref<string>();

watch(userInput, () => console.log(userInput.value));
</script>

<template>
  <h1>소켓 서버</h1>
  <div class="row">
    <div ref="canvasRef"></div>
    <div>
      <div v-for="row in matrix" class="row">
        <div
          v-for="col in row"
          :style="{
            backgroundColor: ColorParser(Number(col)),
          }"
          class="col"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-direction: row;
}
.col {
  padding: 1rem;
  margin: 1px;
  border-radius: 50%;
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
.client-sent-message {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ccc;
  list-style: none;
  color: #fff;
  background-color: dimgray;
  justify-self: left;
}
</style>

<script setup lang="ts">
import { PropType, onMounted, ref, toRefs, watch } from "vue";
import * as THREE from "three";
// @ts-expect-error
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ColorParser from "../utils/colorParser";
import { MatrixType } from "../App.vue";

// 프롭스
const props = defineProps({
  matrix: {
    type: Object as PropType<MatrixType>,
    default: [],
    required: true,
  },
  canvasSize: {
    type: Object as PropType<{ width: number; height: number }>,
    default: { width: 500, height: 500 },
  },
  cubeMargin: { type: Object as PropType<number>, default: 1 },
  gap: { type: Object as PropType<number>, default: 1 },
  cubeSize: { type: Object as PropType<number>, default: 1 },
  type: {
    type: Object as PropType<"sphere" | "cube">,
    required: true,
    default: "sphere",
  },
  errorOnly: { type: Object as PropType<boolean>, default: false },
});

const { matrix, canvasSize, gap, cubeSize, cubeMargin, type, errorOnly } =
  toRefs(props);

const cameraRef = ref<null | THREE.PerspectiveCamera>(null);
const canvasRef = ref<HTMLElement | null>(null);
const controlsRef = ref<OrbitControls|null>(null)

const initialCameraPosition = {
  x: 10 * 3.5,
  y: 10,
  z: -8 * 3.5,
};
  const resetPosition = (
    camera: THREE.PerspectiveCamera,
    initialCameraPosition: { x: number; y: number; z: number }
  ) => {
    const { x, y, z } = initialCameraPosition;
    camera.position.set(x, y, z);
    controlsRef.value.target.set(0, 0, 0);
  };

onMounted(() => {
  const { width, height } = canvasSize.value;
  if (!canvasRef.value) {
    return;
  }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
  cameraRef.value = camera;

  // 렌더러설정
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  canvasRef.value.appendChild(renderer.domElement);
  renderer.setSize(width, height);

  scene.background = new THREE.Color(0x222222);

  scene.add(new THREE.AmbientLight(0xeeeeee, 8));
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(50, 30, 40);

  scene.add(light);


  controlsRef.value = new OrbitControls(camera, renderer.domElement, {});

  controlsRef.value.addEventListener("change", () => {
    renderer.render(scene, camera);
  });

  const initialDirection = new THREE.Vector3(0, 0, 0);
  camera.lookAt(initialDirection);

  resetPosition(camera, initialCameraPosition);

  let cubes: THREE.Mesh[] = [];

  const generateCube = () => {
    /** 형태 */
    let geometry: THREE.SphereGeometry | THREE.BoxGeometry;

    switch (type.value) {
      case "cube":
        geometry = new THREE.BoxGeometry(
          cubeSize.value,
          cubeSize.value,
          cubeSize.value
        );

        break;
      case "sphere":
        geometry = new THREE.SphereGeometry(cubeSize.value * 0.5, 16, 16);
        break;

      default:
        geometry = new THREE.BoxGeometry(
          cubeSize.value,
          cubeSize.value,
          cubeSize.value
        );
        break;
    }
    const min = 21;
    const max = 22;
    const canvasMin = 20;

    if (matrix.value) {
      matrix.value.map((data) => {
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color().setStyle(
            ColorParser(data.value, errorOnly.value).color
          ),
          transparent: true, // 투명하게 설정
          opacity: ColorParser(data.value, errorOnly.value).opacity, // 알파값 설정 (0.0 ~ 1.0)
          metalness: 0.9,
          roughness: 0.5,
        });

        const cube = new THREE.Mesh(geometry, material);

        scene.add(cube);

        cube.position.set(
          // x좌표
          (max - data.longitude) * 10 - min + canvasMin,
          // y좌표
          (max - data.altitude) * 10 - min + canvasMin,
          // z좌표
          (max - data.latitude) * 10 - min + canvasMin
        );
        cubes.push(cube);
      });
    }
  };

  let lines: THREE.Line[] = [];
  const generateLine = () => {
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color().setStyle("orange"),
      linewidth: 2,
      linecap: "round",
      linejoin: "round",
    });

    const zAxisPoints: THREE.Vector3[] = [];
    zAxisPoints.push(new THREE.Vector3(-10, -10, -20));
    zAxisPoints.push(new THREE.Vector3(-10, -10, 20));

    const zAxis = new THREE.BufferGeometry().setFromPoints(zAxisPoints);

    const zLine = new THREE.Line(zAxis, material);
    lines.push(zLine);
    scene.add(zLine);

    const yAxisPoints: THREE.Vector3[] = [];
    yAxisPoints.push(new THREE.Vector3(-10, -10, 20));
    yAxisPoints.push(new THREE.Vector3(-10, 10, 20));

    const yAxis = new THREE.BufferGeometry().setFromPoints(yAxisPoints);

    const yLine = new THREE.Line(yAxis, material);
    lines.push(yLine);

    scene.add(yLine);

    const xAxisPoints: THREE.Vector3[] = [];
    xAxisPoints.push(new THREE.Vector3(-10, -10, 20));
    xAxisPoints.push(new THREE.Vector3(10, -10, 20));

    const xAxis = new THREE.BufferGeometry().setFromPoints(xAxisPoints);

    const xLine = new THREE.Line(xAxis, material);
    lines.push(xLine);

    scene.add(xLine);
  };
  generateLine();

  // 큐브 업데이트 함수
  function updateCubes() {
    cubes.forEach((cube: THREE.Mesh) => {
      scene.remove(cube);
    });
    cubes = [];
    generateCube();
  }

  // 매 프레임마다 랜더
  function animate() {
    requestAnimationFrame(animate);
    controlsRef.value.update();
    renderer.render(scene, camera);
  }
  animate();

  // 업데이트 구현
  watch([matrix, gap, type, cubeMargin, errorOnly], () => {
    if (!matrix?.value) {
      return;
    }
    updateCubes();
  });
});
</script>

<template>
  <div ref="canvasRef"></div>
  <button
    @click="
      () => {
        if (cameraRef) resetPosition(cameraRef, initialCameraPosition);
      }
    "
  >
    초기화
  </button>
</template>

<style lang="scss" scoped></style>

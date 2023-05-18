<script setup lang="ts">
import { PropType, onMounted, ref, toRefs, watch } from "vue";
import * as THREE from "three";
// @ts-expect-error
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ColorParser from "../utils/colorParser";

const canvasRef = ref<HTMLElement | null>(null);

const props = defineProps({
  matrix: {
    type: Object as PropType<number[][][]>,
    default: [[[]]],
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

onMounted(() => {
  const { width, height } = canvasSize.value;
  if (!canvasRef.value) {
    return;
  }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);

  // 렌더러설정
  const renderer = new THREE.WebGLRenderer();
  canvasRef.value.appendChild(renderer.domElement);
  renderer.setSize(width, height);

  scene.background = new THREE.Color(0x222222);

  scene.add(new THREE.AmbientLight(0xeeeeee));
  const light = new THREE.SpotLight(0xffffff, 0.3);
  light.position.set(50, 50, 50);
  scene.add(light);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", () => {
    renderer.render(scene, camera);
  });

  // 상수 말고 계산되게 해야함
  camera.position.z = -8 * 3.5;
  camera.position.x = 10 * 3.5;
  camera.position.y = 10;

  // camera.position.x = -15;
  // camera.position.y = 25;

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

    if (matrix.value) {
      matrix.value.map((layer, layerIndex) => {
        layer.map((row, rowIndex) => {
          row.map((col, colIndex) => {
            const material = new THREE.MeshMatcapMaterial({
              color: new THREE.Color().setStyle(
                ColorParser(col, errorOnly.value).color
              ),
              transparent: true, // 투명하게 설정
              opacity: ColorParser(col, errorOnly.value).opacity, // 알파값 설정 (0.0 ~ 1.0)
            });

            const cube = new THREE.Mesh(geometry, material);

            scene.add(cube);

            cube.position.set(
              // x좌표
              colIndex * (cubeSize.value + cubeMargin.value) -
                (((cubeSize.value + cubeMargin.value) / 2) * row.length -
                  cubeSize.value / 2) +
                cubeMargin.value,
              // y좌표
              ((cubeSize.value + cubeMargin.value) / 2) * layer.length -
                cubeSize.value / 2 -
                rowIndex * (cubeSize.value + cubeMargin.value) +
                cubeMargin.value,
              // z좌표
              ((cubeSize.value + gap.value) / 2) * matrix.value.length +
                cubeSize.value -
                (layerIndex + 1) * (cubeSize.value + gap.value)
            );
            cubes.push(cube);
          });
        });
      });
    }
  };

  let lines: THREE.Line[] = [];
  const generateLine = () => {
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color().setStyle("orange"),
      linewidth: 1,
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
    controls.update();
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
</template>

<style lang="scss" scoped></style>

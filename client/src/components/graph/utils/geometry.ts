import { BoxGeometry, SphereGeometry } from "three";
/**
 *
 * @param type 구 / 박스 중 형태
 * @param cubeSize : 구 / box Entity의 크기 (기본값 : 1)
 * @returns 지오메트리객체
 */
export const geometrySelector = (
  type: "sphere" | "cube",
  cubeSize: number = 1
) => {
  let _geometry: SphereGeometry | BoxGeometry;

  switch (type) {
    case "cube":
      _geometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);

      break;
    case "sphere":
      _geometry = new SphereGeometry(cubeSize * 0.5, 16, 16);
      break;

    default:
      _geometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);
      break;
  }
  return _geometry;
};

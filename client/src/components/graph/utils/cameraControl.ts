interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/**
 *
 * @param camera 카메라 객체
 * @param control control객체 (orbitControls)
 * @param initialCameraPosition 초기 카메라 위치
 * 카메라객체, Control객체, 되돌릴 포지션을 입력받아 camera, contorl을 입력받은 포지션으로 변경
 */
export const resetCameraPosition = (
  camera: THREE.PerspectiveCamera,
  // @ts-expect-error
  control: OrbitControls,
  initialCameraPosition: Vector3 = {
    x: 0,
    y: 0,
    z: 0,
  }
) => {
  const { x, y, z } = initialCameraPosition;
  camera.position.set(x, y, z);
  control.target.set(-10, 10, 20);
};

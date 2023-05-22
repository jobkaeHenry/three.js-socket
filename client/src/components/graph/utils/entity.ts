/**
 * 절대값을 축에 표현하기 위한 상대값으로 바꿔 리턴하는 함수
 * ex) 168~199의 값을 (0,0) ,(0,10) 범위에 표현 하기위해 사용
 * @param currentValue 현재값
 * @param valueRange 값의 최대, 최소값
 * @param axisRange 표시할 축의 최대, 최소 범위
 */
export const getRelativePosition = (
  currentValue: number,
  valueRange: {
    min: number;
    max: number;
  },
  axisRange: {
    min: number;
    max: number;
  },
  padding: number = 0
) =>
  ((currentValue - valueRange.min) / (valueRange.max - valueRange.min)) *
    ((axisRange.max - padding) - (axisRange.min + padding)) +
  axisRange.min;

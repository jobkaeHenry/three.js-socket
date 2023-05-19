const randomNumberGenerator = require("./randomNumberGenerator");

// const matrixGenerator = (size, length = 10, min = 0, max = 9) => {
//   const column = Array.from(Array(size), () => 0);
//   const geneRateRow = () => randomNumberGenerator(min, max);
//   const generateLayer = () =>
//     Array.from(Array(size), () => column.map(() => geneRateRow()));

//   const matrix = Array.from(Array(length), () => generateLayer());

//   return matrix;
// };

const matrixGenerator = (length = 150, min = 21, max = 22) => {
  const generatePosition = () => {
    const longitude = randomNumberGenerator(min, max)+(randomNumberGenerator(0,9999))/10000;
    const latitude = randomNumberGenerator(min, max)+(randomNumberGenerator(0,9999))/10000;
    const altitude = randomNumberGenerator(min, max)+(randomNumberGenerator(0,9999))/10000;
    return { longitude, latitude, altitude };
  };

  let usedPosition = [];

  const checkIsAlreadyExist = () => {
    const filteredArr = usedPosition.filter((e) => {
      if (
        e.longitude === position.longitude &&
        e.latitude === position.latitude &&
        e.altitude === position.altitude
      ) {
        return true;
      } else return false;
    });
    return Boolean(filteredArr.length);
  };

  const matrix = Array.from(Array(length), () => {
    let position = generatePosition();

    let isAlreadyExist = checkIsAlreadyExist(position);
    while (isAlreadyExist) {
      position = generatePosition();
    }

    return { ...position, value: randomNumberGenerator(0, 10) };
  });

  return matrix;
};

module.exports = matrixGenerator;

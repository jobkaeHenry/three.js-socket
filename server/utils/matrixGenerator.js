const matrixGenerator = (size, length = 10, min = 0, max = 9) => {
  const column = Array.from(Array(size), () => 0);
  const geneRateRow = () => randomNumberGenerator(min, max);
  const generateLayer = () =>
    Array.from(Array(size), () => column.map(() => geneRateRow()));

  const matrix = Array.from(Array(length), () => generateLayer());

  return matrix;
};

const randomNumberGenerator = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = matrixGenerator;

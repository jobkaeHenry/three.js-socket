const matrixGenerator = (size, min = 0, max = 9) => {
  const column = Array.from(Array(size), () => 0);
  const geneRateRow = () =>randomNumberGenerator(min, max);
  const matrix = Array.from(Array(size), () => column.map(() => geneRateRow()));
  
  return matrix;
};
const randomNumberGenerator = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = matrixGenerator;

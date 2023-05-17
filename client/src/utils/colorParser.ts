const ColorParser = (number: number) => {
  if (Number(number) <= 2) {
    return "rgb(198, 0, 0)";
  }
  if (Number(number) <= 6) {
    return "rgb(255, 221, 0)";
  } else return "rgb(48, 139, 48)";
};

export default ColorParser;

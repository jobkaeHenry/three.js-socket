const ColorParser = (number: number, errorOnly = false) => {
  if (Number(number) < 3) {
    return { color: "#FE4C4C", opacity: 1 };
  }
  if (Number(number) < 6) {
    return { color: "#FED34B", opacity: 1 };
  }
  if (Number(number) <= 10 && !errorOnly) {
    return { color: "#B2DC83", opacity: 1 };
  } else return { color: "#B2DC83", opacity: 0.1 };
};

export default ColorParser;

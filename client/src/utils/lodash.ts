export const deepForEach = (
  obj: any,
  predict: (key: string | number, value: any, wrapper: any) => any
) => {
  if (!obj) return;

  const repeat = (key: string | number, val: any, wrapper: any) => {
    if (Array.isArray(val)) val.forEach((v, i) => repeat(i, v, val));
    else if (val && typeof val === "object" && !(val instanceof Date))
      Object.keys(val).forEach((k) => repeat(k, val[k], val));
    else {
      const modify: any = predict(key, val, wrapper);
      if (modify !== undefined) wrapper[key] = modify;
    }
  };
};

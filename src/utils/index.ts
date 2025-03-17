export const parseValue = (value: any) => {
  if (typeof value !== "undefined") {
    return value;
  }

  return null;
};

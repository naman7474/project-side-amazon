export const getPreviousDate = (days: number) => {
  const today = new Date();
  today.setDate(today.getDate() - days);
  return today.toISOString().split("T")[0];
};

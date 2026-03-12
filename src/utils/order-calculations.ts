const roundDecimals = (amount: number): number => {
  const rounded = Math.round(amount * 100) / 100;
  return Math.max(0, rounded);
};

export const calculateTotalPaidAmount = (
  downPayment: number,
  totalCollected: number,
) => {
  return roundDecimals(downPayment + totalCollected);
};

export const calculateBalanceAmount = (
  totalAmount: number,
  totalCollected: number,
) => {
  return roundDecimals(totalAmount - totalCollected);
};

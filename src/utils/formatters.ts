export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatRate = (rate: number): string => {
  return rate.toFixed(4);
};

export const generateTransactionId = (): string => {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
};

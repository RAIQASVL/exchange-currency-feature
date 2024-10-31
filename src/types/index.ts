export interface Account {
  id: string;
  name: string;
  currency: Currency;
  balance: number;
}

export type Currency = "USD" | "EUR" | "GBP";
export type ExchangeRateKey = `${Currency}-${Currency}`;
export type ExchangeRates = Record<ExchangeRateKey, number>;

export interface ConversionResult {
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
}

export interface ConversionFormData {
  fromAccountId: string;
  toAccountId: string;
  amount: string;
}

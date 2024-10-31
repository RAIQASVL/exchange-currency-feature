export interface Account {
  id: string;
  name: string;
  currency: Currency;
  balance: number;
}

export type Currency = "USD" | "EUR" | "GBP";

export interface ConversionResult {
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
}

export type ExchangeRates = {
  [K in `${Currency}-${Currency}`]?: number;
};

export interface ConversionParams {
  fromAccountId: string;
  toAccountId: string;
  amount: string;
}

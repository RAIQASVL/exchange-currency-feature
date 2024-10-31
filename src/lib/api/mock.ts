import { Account, ConversionResult, ExchangeRates } from "@/types";

const DELAY = 800;

const mockDelay = () => new Promise((resolve) => setTimeout(resolve, DELAY));

const mockAccounts: Account[] = [
  { id: "1", name: "USD Account", currency: "USD", balance: 1000 },
  { id: "2", name: "EUR Account", currency: "EUR", balance: 2000 },
  { id: "3", name: "GBP Account", currency: "GBP", balance: 3000 },
];

const mockRates: ExchangeRates = {
  "USD-EUR": 0.85,
  "USD-GBP": 0.75,
  "EUR-USD": 1.18,
  "EUR-GBP": 0.88,
  "GBP-USD": 1.33,
  "GBP-EUR": 1.14,
};

export async function getAccounts(): Promise<Account[]> {
  await mockDelay();
  return mockAccounts;
}

export async function getRates(): Promise<ExchangeRates> {
  await mockDelay();
  return mockRates;
}

export async function calculateConversion(
  amount: number,
  rate: number
): Promise<ConversionResult> {
  await mockDelay();
  const convertedAmount = amount * rate;
  const fee = convertedAmount * 0.01;

  return {
    fromAmount: amount,
    toAmount: convertedAmount - fee,
    rate,
    fee,
  };
}

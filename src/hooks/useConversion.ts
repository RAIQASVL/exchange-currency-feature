import { useState, useCallback } from "react";
import { ConversionResult, Account } from "@/types";
import { useExchangeRates } from "./useExchangeRates";

interface UseConversionResult {
  convert: (params: {
    fromAccount: Account;
    toAccount: Account;
    amount: number;
  }) => Promise<ConversionResult>;
  result: ConversionResult | null;
  loading: boolean;
  error: Error | null;
}

export function useConversion(): UseConversionResult {
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { getRate } = useExchangeRates();

  const convert = useCallback(
    async ({
      fromAccount,
      toAccount,
      amount,
    }: {
      fromAccount: Account;
      toAccount: Account;
      amount: number;
    }): Promise<ConversionResult> => {
      setLoading(true);
      setError(null);

      try {
        // Validate amount
        if (amount <= 0) throw new Error("Invalid amount");
        if (amount > fromAccount.balance) throw new Error("Insufficient funds");

        // Get conversion rate
        const rate = getRate(fromAccount.currency, toAccount.currency);
        if (rate === 0) throw new Error("Unable to determine exchange rate");

        // Calculate conversion with 1% fee
        const convertedAmount = amount * rate;
        const fee = convertedAmount * 0.01;
        const finalAmount = convertedAmount - fee;

        const result = {
          fromAmount: amount,
          toAmount: finalAmount,
          rate,
          fee,
        };

        setResult(result);
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Conversion failed");
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getRate]
  );

  return { convert, result, loading, error };
}

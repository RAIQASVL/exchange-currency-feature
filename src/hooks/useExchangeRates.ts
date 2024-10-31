import { useState, useEffect, useCallback } from "react";
import { ExchangeRates, Currency } from "@/types";

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch("/exchange-rates.json");
        if (!response.ok) throw new Error("Failed to fetch exchange rates");
        const data = await response.json();
        setRates(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch exchange rates")
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
  }, []);

  const getRate = useCallback(
    (fromCurrency: Currency, toCurrency: Currency): number => {
      if (!rates) return 0;
      if (fromCurrency === toCurrency) return 1;

      const directRate = rates[`${fromCurrency}-${toCurrency}`];
      if (directRate !== undefined) return directRate;

      const inverseRate = rates[`${toCurrency}-${fromCurrency}`];
      if (inverseRate !== undefined) return 1 / inverseRate;

      // Try conversion through USD
      if (fromCurrency !== "USD" && toCurrency !== "USD") {
        const fromToUSD = rates[`${fromCurrency}-USD`];
        const usdToTo = rates[`USD-${toCurrency}`];
        if (fromToUSD && usdToTo) return usdToTo * (1 / fromToUSD);
      }

      return 0;
    },
    [rates]
  );

  return { rates, loading, error, getRate };
}

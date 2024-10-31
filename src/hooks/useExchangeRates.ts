import { useState, useEffect, useCallback } from "react";
import { Currency, ExchangeRates } from "@/types";
import { getRates } from "@/lib/api/mock";

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadRates() {
      try {
        const data = await getRates();
        if (mounted) {
          setRates(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to load rates")
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadRates();
    return () => {
      mounted = false;
    };
  }, []);

  const getRate = useCallback(
    (from: Currency, to: Currency): number => {
      if (from === to) return 1;

      const directRate = rates[`${from}-${to}`];
      if (directRate !== undefined) return directRate;

      const inverseRate = rates[`${to}-${from}`];
      if (inverseRate !== undefined) return 1 / inverseRate;

      return 0;
    },
    [rates]
  );

  return { getRate, loading, error };
}

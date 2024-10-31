import { useState, useEffect } from "react";
import { Account } from "@/types";

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await fetch("/accounts.json");
        if (!response.ok) throw new Error("Failed to fetch accounts");
        const data = await response.json();
        setAccounts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  return { accounts, loading, error };
}

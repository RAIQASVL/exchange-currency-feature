import { useState, useEffect } from "react";
import { Account } from "@/types";
import { getAccounts } from "@/lib/api/mock";

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadAccounts() {
      try {
        const data = await getAccounts();
        setAccounts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load accounts")
        );
      } finally {
        setLoading(false);
      }
    }

    loadAccounts();
  }, []);

  return { accounts, loading, error };
}

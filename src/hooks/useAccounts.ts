import { useState, useEffect } from "react";
import { Account } from "@/types";
import { getAccounts } from "@/lib/api/mock";

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadAccounts() {
      try {
        const data = await getAccounts();
        if (mounted) {
          setAccounts(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to load accounts")
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAccounts();
    return () => {
      mounted = false;
    };
  }, []);

  return { accounts, loading, error };
}

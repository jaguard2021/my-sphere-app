import { useState, useEffect, useCallback } from 'react';
import { ConnectClient, RPC_METHODS } from '@unicitylabs/sphere-sdk/connect';

export function useSphereBalance(client: ConnectClient | null) {
  const [balances, setBalances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    if (!client) {
      setError('Client is not available');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await client.query<any[]>(RPC_METHODS.GET_BALANCE);
      setBalances(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balances');
      setBalances([]);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    if (client) {
      fetchBalances();
    }
  }, [client, fetchBalances]);

  return { balances, isLoading, error, fetchBalances };
}
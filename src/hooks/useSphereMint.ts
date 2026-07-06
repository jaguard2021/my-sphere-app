import { useState, useCallback } from 'react';
import { ConnectClient, INTENT_ACTIONS } from '@unicitylabs/sphere-sdk/connect';

interface MintParams {
  coinId: string;
  amount: string;
}

export function useSphereMint(client: ConnectClient | null) {
  const [isMinting, setIsMinting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const mint = useCallback(
    async (params: MintParams) => {
      if (!client) {
        setError('Client is not available');
        return false;
      }
      setIsMinting(true);
      setError(null);
      setResult(null);

      try {
        const payload = {
          coinId: params.coinId,
          amount: params.amount,
        };
        const res = await client.intent(INTENT_ACTIONS.MINT, payload);
        setResult(res);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Mint failed';
        setError(msg);
        return false;
      } finally {
        setIsMinting(false);
      }
    },
    [client]
  );

  return { mint, isMinting, result, error };
}
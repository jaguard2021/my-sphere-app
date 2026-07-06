import { useState, useCallback } from 'react';
import { ConnectClient, INTENT_ACTIONS } from '@unicitylabs/sphere-sdk/connect';

interface TransferParams {
  to: string;
  amount: string;
  coinId: string;
  memo?: string;
}

export function useSphereTransfer(client: ConnectClient | null) {
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const transfer = useCallback(
    async (params: TransferParams) => {
      if (!client) {
        setError('Client is not available');
        return;
      }
      setIsSending(true);
      setError(null);
      setResult(null);

      try {
        const payload: any = {
          to: params.to,
          amount: params.amount,
          coinId: params.coinId,
        };
        if (params.memo) payload.memo = params.memo;

        const res = await client.intent(INTENT_ACTIONS.SEND, payload);
        setResult(res);
        return res;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Transfer failed';
        setError(msg);
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [client]
  );

  return { transfer, isSending, result, error };
}
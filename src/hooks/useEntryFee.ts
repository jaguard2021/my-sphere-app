import { useState, useCallback } from 'react';
import { ConnectClient, INTENT_ACTIONS } from '@unicitylabs/sphere-sdk/connect';

interface UseEntryFeeOptions {
  recipient?: string;
  amount?: number;
  memo?: string;
}

export function useEntryFee(client: ConnectClient | null, balances: any[]) {
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  const toBaseUnits = (whole: number, decimals: number): string => {
    const parts = whole.toString().split('.');
    const intPart = BigInt(parts[0]);
    const fracPart = parts[1] ? parts[1].padEnd(decimals, '0').slice(0, decimals) : '0';
    const fracBigInt = BigInt(fracPart);
    return (intPart * 10n ** BigInt(decimals) + fracBigInt).toString();
  };

  const payEntryFee = useCallback(
    async (options?: UseEntryFeeOptions): Promise<boolean> => {
      if (!client) {
        setError('Client is not available');
        return false;
      }

      const uct = balances.find((b: any) => b.symbol === 'UCT');
      if (!uct) {
        setError('UCT asset not found');
        return false;
      }

      let coinId = uct.coinId || uct.id || uct.assetId;
      if (!coinId) {
        setError('Coin ID not found in asset data');
        return false;
      }
      coinId = coinId.toLowerCase().replace(/^0x/, '');

      if (!/^[0-9a-f]+$/.test(coinId) || coinId.length % 2 !== 0) {
        setError('Invalid coinId (must be lowercase even-length hex)');
        return false;
      }

      const decimals = uct.decimals || 18;
      const amount = options?.amount || 1;
      const amountBase = toBaseUnits(amount, decimals);

      let recipient = options?.recipient;
      if (!recipient) {
        try {
          const identity = await client.query<any>('sphere_getIdentity');
          recipient = identity?.directAddress;
          if (!recipient) {
            setError('Could not determine recipient address');
            return false;
          }
        } catch {
          setError('Failed to get identity');
          return false;
        }
      }

      setIsPaying(true);
      setError(null);

      try {
        const payload: any = {
          to: recipient,
          amount: amountBase,
          coinId: coinId,
        };
        if (options?.memo) payload.memo = options.memo;

        await client.intent(INTENT_ACTIONS.SEND, payload);
        setPaid(true);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Payment failed';
        setError(msg);
        return false;
      } finally {
        setIsPaying(false);
      }
    },
    [client, balances]
  );

  const reset = useCallback(() => {
    setPaid(false);
    setError(null);
  }, []);

  return { payEntryFee, isPaying, error, paid, reset };
}
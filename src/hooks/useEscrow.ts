import { useMemo } from 'react';

export function useEscrow() {
  const ESCROW_ADDRESS = 'DIRECT://0000a48f6dcba85e82a69840fec712f46af39d71bdca97ef402091b088d63ea2c461bb5e83f9';

  const address = useMemo(() => ESCROW_ADDRESS, []);
  const isEnabled = address.length > 0;

  return { address, isEnabled };
}
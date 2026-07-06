import { useState, useRef, useCallback, useEffect } from 'react';
import {
  ConnectClient,
  HOST_READY_TYPE,
  HOST_READY_TIMEOUT,
  SPHERE_NETWORKS,
} from '@unicitylabs/sphere-sdk/connect';
import { PostMessageTransport } from '@unicitylabs/sphere-sdk/connect/browser';
import type { PublicIdentity, PermissionScope } from '@unicitylabs/sphere-sdk/connect';

const WALLET_URL = 'https://sphere.unicity.network';
const SESSION_STORAGE_KEY = 'sphere-session-id';

const DAPP_META = {
  name: '2048 Sphere',
  description: '2048 game with Sphere wallet integration',
  url: typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '',
};

const PERMISSIONS: PermissionScope[] = [
  'identity:read',
  'balance:read',
  'transfer:request',
  'mint:request',
];

const DAPP_NETWORK = SPHERE_NETWORKS.testnet2;

function waitForHostReady(): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      window.removeEventListener('message', handler);
      reject(new Error('Wallet did not respond (HOST_READY timeout)'));
    }, HOST_READY_TIMEOUT);

    function handler(event: MessageEvent) {
      if (event.data?.type === HOST_READY_TYPE) {
        clearTimeout(timeout);
        window.removeEventListener('message', handler);
        resolve();
      }
    }
    window.addEventListener('message', handler);
  });
}

export function useSphereConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [identity, setIdentity] = useState<PublicIdentity | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clientRef = useRef<ConnectClient | null>(null);
  const popupRef = useRef<Window | null>(null);

  const getClient = useCallback(() => clientRef.current, []);

  const connect = useCallback(
    async (silent: boolean = false) => {
      if (isConnecting || isConnected) return;
      setIsConnecting(true);
      if (!silent) setError(null);

      try {
        const savedSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY) || undefined;
        let popup: Window | null = null;
        if (!savedSessionId || !silent) {
          popup = window.open(
            `${WALLET_URL}/connect?origin=${encodeURIComponent(location.origin)}`,
            'sphere-wallet',
            'width=420,height=650'
          );
          if (!popup) throw new Error('Popup blocked. Please allow popups for this site.');
          popupRef.current = popup;

          const transport = PostMessageTransport.forClient({
            target: popup,
            targetOrigin: WALLET_URL,
          });

          await waitForHostReady();

          const client = new ConnectClient({
            transport,
            dapp: DAPP_META,
            permissions: PERMISSIONS,
            network: DAPP_NETWORK,
            resumeSessionId: savedSessionId,
          });
          clientRef.current = client;

          const result = await client.connect();
          sessionStorage.setItem(SESSION_STORAGE_KEY, result.sessionId);
          setIdentity(result.identity);
          setIsConnected(true);
          if (!silent) setError(null);
        } else {
          popup = window.open(
            `${WALLET_URL}/connect?origin=${encodeURIComponent(location.origin)}`,
            'sphere-wallet',
            'width=420,height=650'
          );
          if (!popup) throw new Error('Popup blocked. Please allow popups for this site.');
          popupRef.current = popup;

          const transport = PostMessageTransport.forClient({
            target: popup,
            targetOrigin: WALLET_URL,
          });

          await waitForHostReady();

          const client = new ConnectClient({
            transport,
            dapp: DAPP_META,
            permissions: PERMISSIONS,
            network: DAPP_NETWORK,
            resumeSessionId: savedSessionId,
          });
          clientRef.current = client;

          const result = await client.connect();
          sessionStorage.setItem(SESSION_STORAGE_KEY, result.sessionId);
          setIdentity(result.identity);
          setIsConnected(true);
          if (!silent) setError(null);
        }
      } catch (err) {
        if (!silent) {
          setError(err instanceof Error ? err.message : 'Connection failed');
        }
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        popupRef.current?.close();
        popupRef.current = null;
      } finally {
        setIsConnecting(false);
      }
    },
    [isConnecting, isConnected]
  );

  const disconnect = useCallback(async () => {
    try {
      await clientRef.current?.disconnect();
    } catch {}
    clientRef.current = null;
    popupRef.current?.close();
    popupRef.current = null;
    setIsConnected(false);
    setIdentity(null);
    setError(null);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) {
      connect(true).catch(() => sessionStorage.removeItem(SESSION_STORAGE_KEY));
    }
  }, []);

  useEffect(() => {
    return () => {
      clientRef.current?.disconnect().catch(() => {});
      popupRef.current?.close();
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    identity,
    error,
    client: clientRef.current,
    getClient,
    connect: () => connect(false),
    disconnect,
  };
}
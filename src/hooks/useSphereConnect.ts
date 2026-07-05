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

const DAPP_META = {
  name: 'Aplikasi Sphere Saya',
  description: 'Belajar integrasi Unicity Wallet',
  url: typeof window !== 'undefined' ? window.location.origin : '',
};

const PERMISSIONS: PermissionScope[] = [
  'identity:read',
  'balance:read',
];

const DAPP_NETWORK = SPHERE_NETWORKS.testnet2;

function waitForHostReady(): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      window.removeEventListener('message', handler);
      reject(new Error('Wallet tidak merespons (HOST_READY timeout)'));
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

  const connect = useCallback(async () => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);
    setError(null);

    try {
      const popup = window.open(
        `${WALLET_URL}/connect?origin=${encodeURIComponent(location.origin)}`,
        'sphere-wallet',
        'width=420,height=650'
      );
      if (!popup) {
        throw new Error('Popup diblokir. Izinkan popup untuk situs ini.');
      }
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
      });
      clientRef.current = client;

      const result = await client.connect();

      setIdentity(result.identity);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Koneksi gagal');
      popupRef.current?.close();
      popupRef.current = null;
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, isConnected]);

  const disconnect = useCallback(async () => {
    try {
      await clientRef.current?.disconnect();
    } catch {
      // ignore
    }
    clientRef.current = null;
    popupRef.current?.close();
    popupRef.current = null;
    setIsConnected(false);
    setIdentity(null);
    setError(null);
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
    connect,
    disconnect,
  };
}
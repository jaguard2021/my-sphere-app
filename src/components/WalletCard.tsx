import type { PublicIdentity } from '@unicitylabs/sphere-sdk/connect';

interface Props {
  isConnected: boolean;
  isConnecting: boolean;
  identity: PublicIdentity | null;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletCard({
  isConnected,
  isConnecting,
  identity,
  error,
  onConnect,
  onDisconnect,
}: Props) {
  if (!isConnected) {
    return (
      <div
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center',
          border: '1px solid #334155',
        }}
      >
        <button
          onClick={onConnect}
          disabled={isConnecting}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '8px',
            border: 'none',
            cursor: isConnecting ? 'not-allowed' : 'pointer',
            background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
            color: '#0f172a',
            transition: 'opacity 0.2s',
          }}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
        {error && (
          <p style={{ color: '#f87171', marginTop: '0.75rem', fontSize: '0.9rem' }}>
            ❌ {error}
          </p>
        )}
        {!error && !isConnecting && (
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            If popup doesn't appear, click the Sphere Wallet extension icon in your toolbar.
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #334155',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Connected
          </p>
          <p style={{ fontWeight: '600', color: '#e2e8f0' }}>
            {identity?.nametag ? `@${identity.nametag}` : 'Nameless'}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', wordBreak: 'break-all' }}>
            {identity?.directAddress?.slice(0, 30)}...
          </p>
        </div>
        <button
          onClick={onDisconnect}
          style={{
            padding: '0.4rem 1rem',
            fontSize: '0.9rem',
            borderRadius: '6px',
            border: '1px solid #ef4444',
            backgroundColor: 'transparent',
            color: '#ef4444',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444';
            e.currentTarget.style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#ef4444';
          }}
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}
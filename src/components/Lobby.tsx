interface LobbyProps {
  isPaying: boolean;
  paid: boolean;
  onPlay: () => void;
  error: string | null;
}

export function Lobby({ isPaying, paid, onPlay, error }: LobbyProps) {
  if (paid) {
    return (
      <div
        style={{
          marginTop: '1.5rem',
          padding: '2rem',
          backgroundColor: '#064e3b',
          borderRadius: '12px',
          border: '1px solid #22c55e',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#86efac', fontSize: '1.25rem', fontWeight: '600' }}>
          ✅ Game Ready!
        </p>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Payment confirmed. Starting game...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: '1.5rem',
        padding: '1.5rem',
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        border: '1px solid #334155',
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#e2e8f0' }}>
        🕹️ Play 2048
      </h2>
      <p style={{ color: '#94a3b8', margin: '0.5rem 0 1.5rem' }}>
        Entry fee: <span style={{ fontWeight: '600', color: '#e2e8f0' }}>1 UCT</span>
      </p>
      <button
        onClick={onPlay}
        disabled={isPaying}
        style={{
          padding: '0.75rem 2.5rem',
          fontSize: '1.1rem',
          fontWeight: '600',
          borderRadius: '8px',
          border: 'none',
          cursor: isPaying ? 'not-allowed' : 'pointer',
          background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
          color: '#0f172a',
          transition: 'transform 0.15s, opacity 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!isPaying) e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isPaying ? 'Processing...' : 'Play 1 UCT'}
      </button>
      {error && (
        <p style={{ color: '#f87171', marginTop: '0.75rem', fontSize: '0.9rem' }}>
          ❌ {error}
        </p>
      )}
    </div>
  );
}
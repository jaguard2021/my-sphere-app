interface GameReadyProps {
  onReset: () => void;
}

export function GameReady({ onReset }: GameReadyProps) {
  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
      <h2>🧩 Game 2048</h2>
      <div
        style={{
          width: '400px',
          height: '400px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed #ccc',
          borderRadius: '8px',
        }}
      >
        <span style={{ color: '#999', fontSize: '1.2rem' }}>🎮 Game Ready</span>
      </div>
      <button
        onClick={onReset}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1.5rem',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Selesai / Kembali
      </button>
    </div>
  );
}
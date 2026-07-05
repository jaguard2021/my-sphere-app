import { useSphereConnect } from './hooks/useSphereConnect';

function App() {
  const { isConnected, isConnecting, identity, error, connect, disconnect } =
    useSphereConnect();

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Demo Sphere Connect</h1>

      {!isConnected ? (
        <div>
          <button
            onClick={connect}
            disabled={isConnecting}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: isConnecting ? 'not-allowed' : 'pointer',
            }}
          >
            {isConnecting ? 'Menghubungkan...' : 'Hubungkan ke Wallet'}
          </button>
          {error && <p style={{ color: 'red' }}>❌ {error}</p>}
        </div>
      ) : (
        <div>
          <p>✅ Terhubung!</p>
          <p><strong>Identity:</strong></p>
          <pre style={{
            background: '#f0f0f0',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
            maxWidth: '100%',
          }}>
            {JSON.stringify(identity, null, 2)}
          </pre>
          <button
            onClick={disconnect}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '1rem',
            }}
          >
            Putuskan Koneksi
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
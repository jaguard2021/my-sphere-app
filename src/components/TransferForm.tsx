import { useState } from 'react';

interface TransferFormProps {
  onTransfer: (to: string, amount: string, memo?: string) => Promise<void>;
  isSending: boolean;
  error: string | null;
  isSuccess: boolean;   // ganti success → isSuccess
}

export function TransferForm({ onTransfer, isSending, error, isSuccess }: TransferFormProps) {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !amount) {
      alert('Alamat dan jumlah wajib diisi');
      return;
    }
    await onTransfer(to, amount, memo || undefined);
    if (!error) {
      setTo('');
      setAmount('');
      setMemo('');
    }
  };

  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
      <h2>Transfer UCT</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            Alamat Tujuan (Direct Address)
          </label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="DIRECT://..."
            style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            Jumlah (UCT)
          </label>
          <input
            type="number"
            step="0.000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            Memo (Opsional)
          </label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Catatan transfer..."
            style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
          />
        </div>
        <button
          type="submit"
          disabled={isSending}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            cursor: isSending ? 'not-allowed' : 'pointer',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            alignSelf: 'flex-start',
          }}
        >
          {isSending ? 'Memproses...' : 'Kirim UCT'}
        </button>
        {error && <p style={{ color: 'red' }}>❌ {error}</p>}
        {isSuccess && <p style={{ color: 'green' }}>✅ Transfer berhasil!</p>}
      </form>
    </div>
  );
}
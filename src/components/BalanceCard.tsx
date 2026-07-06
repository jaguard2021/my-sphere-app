function formatBalance(amount: string, decimals: number, maxFractionDigits: number = 6): string {
  const num = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const integerPart = num / divisor;
  const fractionalPart = num % divisor;
  let frac = fractionalPart.toString().padStart(decimals, '0').replace(/0+$/, '');
  if (frac === '') return integerPart.toString();
  if (frac.length > maxFractionDigits) frac = frac.slice(0, maxFractionDigits);
  return `${integerPart}.${frac}`;
}

interface Props {
  balances: any[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function BalanceCard({ balances, isLoading, onRefresh }: Props) {
  const uct = balances.find((b) => b.symbol === 'UCT');

  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        padding: '1rem 1.5rem',
        marginTop: '1rem',
        border: '1px solid #334155',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Balance
          </p>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#e2e8f0' }}>
            {isLoading ? '⏳' : uct ? `${formatBalance(uct.totalAmount, uct.decimals)} UCT` : '0 UCT'}
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          style={{
            padding: '0.3rem 0.8rem',
            borderRadius: '6px',
            border: '1px solid #334155',
            backgroundColor: 'transparent',
            color: '#94a3b8',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '0.8rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#334155';
              e.currentTarget.style.color = '#e2e8f0';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          {isLoading ? 'Loading...' : '↻ Refresh'}
        </button>
      </div>
    </div>
  );
}
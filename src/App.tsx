import { useState } from 'react';
import { useSphereConnect } from './hooks/useSphereConnect';
import { useSphereBalance } from './hooks/useSphereBalance';
import { useEntryFee } from './hooks/useEntryFee';
import { useSphereMint } from './hooks/useSphereMint';
import { useEscrow } from './hooks/useEscrow';
import { WalletCard } from './components/WalletCard';
import { BalanceCard } from './components/BalanceCard';
import { Lobby } from './components/Lobby';
import { Game2048 } from './components/Game2048';

const REWARD_THRESHOLD = 2048;
const REWARD_AMOUNT = 0.5;

function toBaseUnits(whole: number, decimals: number): string {
  const parts = whole.toString().split('.');
  const intPart = BigInt(parts[0]);
  const fracPart = parts[1] ? parts[1].padEnd(decimals, '0').slice(0, decimals) : '0';
  const fracBigInt = BigInt(fracPart);
  return (intPart * 10n ** BigInt(decimals) + fracBigInt).toString();
}

function App() {
  const { isConnected, isConnecting, identity, error, connect, disconnect, getClient } =
    useSphereConnect();

  const client = getClient();
  const { balances, isLoading: isLoadingBalance, fetchBalances } = useSphereBalance(client);
  const { payEntryFee, isPaying, error: payError, paid, reset } = useEntryFee(client, balances);
  const { mint, isMinting, error: mintError } = useSphereMint(client);
  const { address: escrowAddress, isEnabled: escrowEnabled } = useEscrow();

  const [gameStarted, setGameStarted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [rewardSuccess, setRewardSuccess] = useState(false);

  const handlePlay = async () => {
    const recipient = escrowEnabled ? escrowAddress : undefined;
    const success = await payEntryFee({
      recipient,
      memo: `Entry fee for 2048 game${recipient ? ' (escrow)' : ''}`,
    });
    if (success) {
      setGameStarted(true);
      setFinalScore(0);
      setRewardClaimed(false);
      setRewardSuccess(false);
      await fetchBalances();
    }
  };

  const handleGameOver = async (score: number) => {
    setFinalScore(score);
    if (score >= REWARD_THRESHOLD && !rewardClaimed) {
      const uct = balances.find((b: any) => b.symbol === 'UCT');
      if (uct) {
        let coinId = uct.coinId || uct.id || uct.assetId;
        if (coinId) {
          coinId = coinId.toLowerCase().replace(/^0x/, '');
          const decimals = uct.decimals || 18;
          const amountBase = toBaseUnits(REWARD_AMOUNT, decimals);
          const success = await mint({ coinId, amount: amountBase });
          if (success) {
            setRewardSuccess(true);
            setRewardClaimed(true);
            await fetchBalances();
          }
        }
      }
    }
  };

  const handleReset = () => {
    reset();
    setGameStarted(false);
    setFinalScore(0);
    setRewardClaimed(false);
    setRewardSuccess(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            2048 Sphere
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
            Play, win, and earn UCT on Sphere
          </p>
        </header>

        <WalletCard
          isConnected={isConnected}
          isConnecting={isConnecting}
          identity={identity}
          error={error}
          onConnect={connect}
          onDisconnect={disconnect}
        />

        {isConnected && (
          <>
            <BalanceCard
              balances={balances}
              isLoading={isLoadingBalance}
              onRefresh={fetchBalances}
            />

            {!gameStarted ? (
              <Lobby
                isPaying={isPaying}
                paid={paid}
                onPlay={handlePlay}
                error={payError}
              />
            ) : (
              <div style={{ marginTop: '1.5rem' }}>
                <Game2048 onGameOver={handleGameOver} />

                {finalScore >= REWARD_THRESHOLD && (
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      borderRadius: '12px',
                      backgroundColor: rewardSuccess ? '#064e3b' : '#451a03',
                      border: `1px solid ${rewardSuccess ? '#22c55e' : '#f59e0b'}`,
                      textAlign: 'center',
                    }}
                  >
                    {rewardSuccess ? (
                      <>
                        <p style={{ color: '#86efac', fontWeight: 'bold' }}>
                          🎉 Reward {REWARD_AMOUNT} UCT claimed!
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                          Score {finalScore} ≥ {REWARD_THRESHOLD}
                        </p>
                      </>
                    ) : rewardClaimed ? (
                      <p style={{ color: '#fcd34d' }}>⏳ Processing reward...</p>
                    ) : (
                      <p style={{ color: '#fcd34d' }}>
                        🏆 Score {finalScore}! You earned {REWARD_AMOUNT} UCT.
                        {isMinting && ' (Waiting for wallet...)'}
                      </p>
                    )}
                    {mintError && <p style={{ color: '#f87171' }}>❌ {mintError}</p>}
                  </div>
                )}

                <button
                  onClick={handleReset}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1.5rem',
                    backgroundColor: '#1e293b',
                    color: '#e2e8f0',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#334155')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
                >
                  ← Back to Lobby
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
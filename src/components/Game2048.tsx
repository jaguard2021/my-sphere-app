import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 4;
const TILE_COLORS: Record<number, string> = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
};

const TILE_TEXT_COLORS: Record<number, string> = {
  2: '#776e65',
  4: '#776e65',
  8: '#f9f6f2',
  16: '#f9f6f2',
  32: '#f9f6f2',
  64: '#f9f6f2',
  128: '#f9f6f2',
  256: '#f9f6f2',
  512: '#f9f6f2',
  1024: '#f9f6f2',
  2048: '#f9f6f2',
};

function createEmptyGrid(): number[][] {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

function addRandomTile(grid: number[][]): number[][] {
  const empty = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const newGrid = grid.map(row => [...row]);
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
}

function slideRow(row: number[]): { newRow: number[]; score: number } {
  let nonZero = row.filter(v => v !== 0);
  let merged: number[] = [];
  let score = 0;
  for (let i = 0; i < nonZero.length; i++) {
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      const val = nonZero[i] * 2;
      merged.push(val);
      score += val;
      i++;
    } else {
      merged.push(nonZero[i]);
    }
  }
  while (merged.length < GRID_SIZE) merged.push(0);
  return { newRow: merged, score };
}

function slideGrid(grid: number[][], direction: 'up' | 'down' | 'left' | 'right'): { newGrid: number[][]; score: number } {
  let rotated = grid.map(row => [...row]);

  const processRows = (rows: number[][]): { processed: number[][]; s: number } => {
    let total = 0;
    const result = rows.map(row => {
      const { newRow, score: s } = slideRow(row);
      total += s;
      return newRow;
    });
    return { processed: result, s: total };
  };

  if (direction === 'left') {
    const { processed, s } = processRows(rotated);
    return { newGrid: processed, score: s };
  }

  if (direction === 'right') {
    const reversed = rotated.map(row => [...row].reverse());
    const { processed, s } = processRows(reversed);
    return { newGrid: processed.map(row => [...row].reverse()), score: s };
  }

  if (direction === 'up') {
    const transposed = rotated[0].map((_, col) => rotated.map(row => row[col]));
    const { processed, s } = processRows(transposed);
    const newGrid = processed[0].map((_, col) => processed.map(row => row[col]));
    return { newGrid, score: s };
  }

  if (direction === 'down') {
    const transposed = rotated[0].map((_, col) => rotated.map(row => row[col]));
    const reversed = transposed.map(row => [...row].reverse());
    const { processed, s } = processRows(reversed);
    const unReversed = processed.map(row => [...row].reverse());
    const newGrid = unReversed[0].map((_, col) => unReversed.map(row => row[col]));
    return { newGrid, score: s };
  }

  return { newGrid: rotated, score: 0 };
}

function isGameOver(grid: number[][]): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) return false;
      if (c + 1 < GRID_SIZE && grid[r][c] === grid[r][c + 1]) return false;
      if (r + 1 < GRID_SIZE && grid[r][c] === grid[r + 1][c]) return false;
    }
  }
  return true;
}

export function Game2048({ onGameOver, onScoreChange }: { onGameOver?: (score: number) => void; onScoreChange?: (score: number) => void }) {
  const [grid, setGrid] = useState<number[][]>(() => {
    const g = createEmptyGrid();
    return addRandomTile(addRandomTile(g));
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const move = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (gameOver) return;
      const { newGrid, score: added } = slideGrid(grid, direction);
      if (JSON.stringify(newGrid) === JSON.stringify(grid)) return;
      const withTile = addRandomTile(newGrid);
      setGrid(withTile);
      const newScore = score + added;
      setScore(newScore);
      onScoreChange?.(newScore);
      if (isGameOver(withTile)) {
        setGameOver(true);
        onGameOver?.(newScore);
      }
    },
    [grid, score, gameOver, onGameOver, onScoreChange]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, 'up' | 'down' | 'left' | 'right'> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        move(dir);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move]);

  const reset = () => {
    const g = createEmptyGrid();
    setGrid(addRandomTile(addRandomTile(g)));
    setScore(0);
    setGameOver(false);
  };

  // Gaya tombol panah
  const arrowButtonStyle: React.CSSProperties = {
    width: '60px',
    height: '60px',
    fontSize: '24px',
    fontWeight: 'bold',
    backgroundColor: '#8f7a66',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    transition: 'background-color 0.1s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '400px' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Score: {score}</span>
        <button
          onClick={reset}
          style={{
            padding: '0.3rem 1rem',
            backgroundColor: '#8f7a66',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          New Game
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '10px',
          backgroundColor: '#bbada0',
          padding: '10px',
          borderRadius: '8px',
          width: '400px',
          height: '400px',
        }}
      >
        {grid.map((row, r) =>
          row.map((value, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: value === 0 ? '#cdc1b4' : TILE_COLORS[value] || '#cdc1b4',
                color: value === 0 ? '#cdc1b4' : TILE_TEXT_COLORS[value] || '#f9f6f2',
                fontWeight: 'bold',
                fontSize: value >= 1024 ? '24px' : value >= 64 ? '32px' : '40px',
                borderRadius: '4px',
                width: '100%',
                height: '100%',
                transition: 'all 0.1s',
              }}
            >
              {value !== 0 ? value : ''}
            </div>
          ))
        )}
      </div>

      {/* Tombol Panah untuk Mouse/Touch */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
        <button
          onClick={() => move('up')}
          style={arrowButtonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9f8b76')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#8f7a66')}
        >
          ↑
        </button>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => move('left')}
            style={arrowButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9f8b76')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#8f7a66')}
          >
            ←
          </button>
          <button
            onClick={() => move('down')}
            style={arrowButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9f8b76')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#8f7a66')}
          >
            ↓
          </button>
          <button
            onClick={() => move('right')}
            style={arrowButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9f8b76')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#8f7a66')}
          >
            →
          </button>
        </div>
      </div>

      {gameOver && (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', border: '2px solid #86efac', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#16a34a' }}>Game Over!</h3>
          <p>Final Score: {score}</p>
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '0.5rem',
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
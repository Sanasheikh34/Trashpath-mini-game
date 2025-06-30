// TrashPath with Demo Mode (No Wallet Required to Play)
// Game logic: memorize a 5-step tile sequence and click it back correctly

import { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const GRID_SIZE = 5;
const SEQUENCE_LENGTH = 5;

function TrashPath() {
  const [sequence, setSequence] = useState([]);
  const [playerPath, setPlayerPath] = useState([]);
  const [phase, setPhase] = useState('start'); // start | show | play | done
  const [activeIndex, setActiveIndex] = useState(null);
  const [result, setResult] = useState(null);

  const startGame = () => {
    setResult(null);
    setPhase('show');
    const seq = Array.from({ length: SEQUENCE_LENGTH }, () => Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE)));
    setSequence(seq);
    setPlayerPath([]);

    let idx = 0;
    const interval = setInterval(() => {
      setActiveIndex(seq[idx]);
      idx++;
      if (idx >= seq.length) {
        clearInterval(interval);
        setTimeout(() => {
          setActiveIndex(null);
          setPhase('play');
        }, 500);
      }
    }, 600);
  };

  const handleClick = (index) => {
    if (phase !== 'play') return;
    const newPath = [...playerPath, index];
    setPlayerPath(newPath);
    if (newPath.length === sequence.length) {
      const success = newPath.every((val, i) => val === sequence[i]);
      setResult(success ? '✅ Correct!' : '❌ Wrong!');
      setPhase('done');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 space-y-4">
      <h1 className="text-4xl font-bold text-green-400">TrashPath 🧠</h1>
      <p className="text-sm text-gray-400">Memorize the sequence and repeat it!</p>

      <div className="mb-4">
        <WalletMultiButton className="!bg-green-600" />
      </div>

      <button
        onClick={startGame}
        className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded"
      >
        Start Game
      </button>

      <div className="grid grid-cols-5 gap-2 mt-4">
        {Array.from({ length: 25 }, (_, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={phase !== 'play'}
            className={`w-14 h-14 border border-gray-600 rounded-md transition-all duration-200 ${
              activeIndex === i
                ? 'bg-green-400 scale-110'
                : playerPath.includes(i)
                ? 'bg-yellow-400'
                : 'bg-gray-800 hover:bg-gray-600'
            }`}
          />
        ))}
      </div>

      {phase === 'done' && (
        <>
          <p className="text-xl mt-4">{result}</p>
          <button
            onClick={startGame}
            className="mt-2 bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
          >
            Play Again
          </button>
        </>
      )}
    </div>
  );
}

export default TrashPath;

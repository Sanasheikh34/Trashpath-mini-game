// TrashPath with Reward Transfer (Gorbagana RPC + Token Transfer)

import { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

const GRID_SIZE = 5;
const LEVELS = [3, 5, 7]; // sequence lengths per level
const GORBAGANA_RPC = 'https://rpc.gorbagana.wtf';
const connection = new Connection(GORBAGANA_RPC);

// Replace with your Gorbagana test wallet public key to receive the tokens
const RECEIVER_WALLET = new PublicKey('9SxrsyQZtbDQQkMTRsNR38BhQ84N1ZgLaMGEejcPZhLu');

function TrashPath() {
  const [level, setLevel] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [playerPath, setPlayerPath] = useState([]);
  const [phase, setPhase] = useState('start');
  const [activeIndex, setActiveIndex] = useState(null);
  const [result, setResult] = useState(null);
  const [completed, setCompleted] = useState(false);
  const { publicKey, sendTransaction } = useWallet();

  const startLevel = () => {
    if (level >= LEVELS.length) return;
    setResult(null);
    setPhase('show');
    const seq = Array.from({ length: LEVELS[level] }, () => Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE)));
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
      setPhase('done');
      if (success) {
        if (level < LEVELS.length - 1) {
          setResult(`✅ Level ${level + 1} passed!`);
          setTimeout(() => {
            setLevel(level + 1);
            startLevel();
          }, 1500);
        } else {
          setCompleted(true);
          setResult('🏆 All Levels Completed! Sending reward…');
          if (publicKey) handleRewardTransfer();
        }
      } else {
        setResult(`❌ Level ${level + 1} failed. Try again.`);
        setTimeout(() => {
          setLevel(0);
          setPhase('start');
        }, 2000);
      }
    }
  };

  const handleRewardTransfer = async () => {
    try {
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: RECEIVER_WALLET,
          lamports: 10000 // 0.00001 SOL on Gorbagana
        })
      );
      await sendTransaction(tx, connection);
      setResult('✅ Reward sent on Gorbagana!');
    } catch (err) {
      console.error(err);
      setResult('⚠️ Transaction failed.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 space-y-4">
      <h1 className="text-4xl font-bold text-green-400">TrashPath 🧠</h1>
      <p className="text-sm text-gray-400">Level {level + 1} of 3 — Match the tile sequence!</p>

      <div className="mb-4">
        <WalletMultiButton className="!bg-green-600" />
      </div>

      {phase === 'start' && (
        <button
          onClick={startLevel}
          className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded"
        >
          Start Level 1
        </button>
      )}

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

      {result && <p className="text-xl mt-4">{result}</p>}

      {completed && (
        <button
          onClick={() => {
            setLevel(0);
            setCompleted(false);
            setPhase('start');
          }}
          className="mt-2 bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
        >
          Play Again
        </button>
      )}
    </div>
  );
}

export default TrashPath;

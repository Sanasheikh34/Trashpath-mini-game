
import { useEffect, useState } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

const GORBAGANA_RPC = 'https://rpc.gorbagana.wtf';
const connection = new Connection(GORBAGANA_RPC);

const GRID_SIZE = 5;
const SEQUENCE_LENGTH = 5;

function TrashPath() {
  const [sequence, setSequence] = useState([]);
  const [playerPath, setPlayerPath] = useState([]);
  const [phase, setPhase] = useState('show'); // show | play | done
  const [activeIndex, setActiveIndex] = useState(null);
  const { publicKey, sendTransaction } = useWallet();

  useEffect(() => {
    if (phase === 'show') {
      const seq = Array.from({ length: SEQUENCE_LENGTH }, () => Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE)));
      setSequence(seq);
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
      }, 700);
    }
  }, [phase]);

  const handleClick = (index) => {
    if (phase !== 'play') return;
    const newPath = [...playerPath, index];
    setPlayerPath(newPath);
    if (newPath.length === sequence.length) {
      const success = newPath.every((val, i) => val === sequence[i]);
      setPhase('done');
      if (success) handleSuccess();
      else alert('Wrong sequence. Try again!');
    }
  };

  const handleSuccess = async () => {
    if (!publicKey) return;
    const ix = SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: new PublicKey('replace_with_your_pubkey'),
      lamports: 10000
    });
    const tx = new Transaction().add(ix);
    try {
      await sendTransaction(tx, connection);
      alert('Success! You earned 0.00001 GORBA.');
    } catch (e) {
      alert('Transaction failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-4">TrashPath 🧠</h1>
      <WalletMultiButton />
      <div className="grid grid-cols-5 gap-2 mt-6">
        {Array.from({ length: 25 }, (_, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`w-14 h-14 border rounded ${
              activeIndex === i ? 'bg-green-500' : playerPath.includes(i) ? 'bg-yellow-400' : 'bg-gray-800'
            }`}
          />
        ))}
      </div>
      {phase === 'done' && (
        <button onClick={() => window.location.reload()} className="mt-4 bg-white text-black px-4 py-2 rounded">
          Play Again
        </button>
      )}
    </div>
  );
}

export default TrashPath;

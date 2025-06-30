# Trashpath-mini-game

TrashPath is a 5x5 memory-based puzzle game built on the Solana-based Gorbagana testnet.  
Memorize a glowing tile path across 3 increasingly difficult levels — and win testnet tokens if you complete them all!

## Live Demo

 Play now: https://trashpath-mini-game.vercel.app  
 Source code: https://github.com/Sanasheikh34/Trashpath-mini-game

##  How It Works

- The game has 3 levels:
   - Level 1 = 3 tiles
   - Level 2 = 5 tiles
   - Level 3 = 7 tiles
- You must repeat the tile sequence in order — without any hints.
- If you complete all 3 levels, you receive a token reward (on testnet).
- Demo mode works without a wallet; Backpack is needed to receive tokens.

##  Gorbagana Integration

- RPC: https://rpc.gorbagana.wtf
- Wallet: Backpack (via Solana Wallet Adapter)
- Reward: Native SOL testnet transfer via SystemProgram.transfer()
- Network: One-validator chain for low-latency

##  Run Locally

1. Clone the repo  
2. Install dependencies:

```bash
npm install


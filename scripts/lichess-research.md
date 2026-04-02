# Lichess Port Research

## Key Components Needed

1. **chessground** - `@lichess-org/chessground` (npm) - Chess board UI
   - 10K gzipped, no dependencies
   - Handles: piece movement, drag & drop, animations, premoves, FEN import/export
   - Styling via CSS only (board/pieces switchable by class)
   - No chess logic inside - pure UI
   - GPL-3.0 license

2. **chess.js** - `chess.js` (npm) - Chess logic engine
   - Move validation, check/checkmate detection, FEN/PGN support
   - Used alongside chessground for legal move enforcement

3. **Stockfish WASM** - `lichess-org/stockfish.wasm` or `stockfish.js` npm
   - WebAssembly port of Stockfish chess engine
   - Runs in browser via Web Worker
   - Different difficulty levels by limiting depth/time
   - Used for AI opponents

## Architecture Plan

- **Board UI**: chessground renders the board, pieces, and handles user interaction
- **Game Logic**: chess.js validates moves, tracks game state, detects checkmate/stalemate
- **AI Engine**: Stockfish WASM runs in a Web Worker, communicates via UCI protocol
- **Multiplayer**: WebSocket-based game rooms through our Express server
- **Progression**: Connect wins/losses to existing XP system

## AI Opponents (Dischordian Saga)

- **The Architect** (Grandmaster) - Stockfish depth 20, full strength
- **The Archons** (Advanced) - Stockfish depth 12-15, strong but beatable
- **The Neyons** (Intermediate) - Stockfish depth 5-8, accessible difficulty

## Integration Points

- Replace current Architect's Gambit chess page
- Use same route structure
- Connect to Loredex OS auth for user tracking
- Award XP on game completion

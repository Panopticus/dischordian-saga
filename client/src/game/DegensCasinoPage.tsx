/* ═══════════════════════════════════════════════════════
   THE DEGEN'S CASINO — Page wrapper with game selection
   Accessible via Trade Hub (Locke trust 30 required)
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Skull, Star, Zap, Dice1 as Dice, Trophy } from "lucide-react";
import {
  CASINO_GAMES, spinSlots, rollDice, getVIPLevel, getDegenQuote,
  DEFAULT_CASINO_STATE, type CasinoState, type CasinoGame,
  SLOT_SYMBOLS,
} from "./degensCasino";

export default function DegensCasinoPage() {
  const [, navigate] = useLocation();
  const [casinoState, setCasinoState] = useState<CasinoState>(() => {
    const saved = localStorage.getItem("degen_casino");
    return saved ? JSON.parse(saved) : DEFAULT_CASINO_STATE;
  });
  const [selectedGame, setSelectedGame] = useState<CasinoGame | null>(null);
  const [degenText, setDegenText] = useState(() => getDegenQuote("welcome"));
  const [slotResult, setSlotResult] = useState<{ reels: string[]; payout: number } | null>(null);
  const [diceResult, setDiceResult] = useState<{ die1: number; die2: number; total: number } | null>(null);

  const vip = useMemo(() => getVIPLevel(casinoState.totalWagered), [casinoState.totalWagered]);

  const save = (s: CasinoState) => { setCasinoState(s); localStorage.setItem("degen_casino", JSON.stringify(s)); };

  const handleSlotSpin = (bet: number) => {
    const result = spinSlots();
    const payout = result.payout * bet;
    setSlotResult({ reels: result.reels, payout });
    save({
      ...casinoState,
      totalWagered: casinoState.totalWagered + bet,
      totalWon: casinoState.totalWon + Math.max(0, payout),
      sessionWins: payout > 0 ? casinoState.sessionWins + 1 : casinoState.sessionWins,
      sessionLosses: payout <= 0 ? casinoState.sessionLosses + 1 : casinoState.sessionLosses,
    });
    setDegenText(result.jackpot ? getDegenQuote("jackpot") : payout > 0 ? getDegenQuote("win") : getDegenQuote("lose"));
  };

  const handleDiceRoll = (bet: number, prediction: "over" | "under" | "exact") => {
    const result = rollDice();
    setDiceResult(result);
    const won = prediction === "over" ? result.total > 7 : prediction === "under" ? result.total < 7 : result.total === 7;
    const multiplier = prediction === "exact" ? 5 : 2;
    const payout = won ? bet * multiplier : 0;
    save({
      ...casinoState,
      totalWagered: casinoState.totalWagered + bet,
      totalWon: casinoState.totalWon + payout,
      sessionWins: won ? casinoState.sessionWins + 1 : casinoState.sessionWins,
      sessionLosses: !won ? casinoState.sessionLosses + 1 : casinoState.sessionLosses,
    });
    setDegenText(won ? getDegenQuote("win") : getDegenQuote("lose"));
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-amber-500/20 bg-gradient-to-r from-black via-amber-950/20 to-black">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Skull size={20} className="text-amber-400" />
          </div>
          <div>
            <h1 className="font-display text-lg tracking-[0.2em] text-amber-400">THE DEGEN'S CASINO</h1>
            <p className="font-mono text-[8px] text-amber-400/40">NE-YON SPACE // OPEN ZONE // THE HOST WATCHES</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-mono text-[9px] text-amber-400/50">VIP: {vip.name}</p>
            <p className="font-mono text-[8px] text-white/20">Wagered: {casinoState.totalWagered}D</p>
          </div>
          <button onClick={() => navigate("/ark")} className="text-white/20 hover:text-white/50">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Degen Commentary */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-start gap-2">
          <Skull size={14} className="text-amber-400/60 mt-0.5 shrink-0" />
          <p className="font-mono text-xs text-amber-400/70 italic leading-relaxed">"{degenText}"</p>
        </div>
      </div>

      {/* Game Selection or Active Game */}
      <div className="p-4 max-w-2xl mx-auto">
        {!selectedGame ? (
          <>
            <p className="font-mono text-[10px] text-white/20 tracking-wider mb-4">SELECT YOUR GAME</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {CASINO_GAMES.map(game => (
                <button key={game.id} onClick={() => setSelectedGame(game.id)}
                  className="p-4 rounded-xl border border-amber-500/15 bg-amber-500/[0.03] hover:bg-amber-500/[0.06] transition-all text-left group">
                  <p className="font-mono text-sm text-amber-400 font-bold mb-1 group-hover:text-amber-300">{game.name}</p>
                  <p className="font-mono text-[9px] text-white/30 mb-2">{game.description}</p>
                  <div className="flex gap-3 font-mono text-[8px] text-white/15">
                    <span>Min: {game.minBet}D</span>
                    <span>Max: {game.maxBet}D</span>
                    <span>Edge: {game.houseEdge}%</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div>
            <button onClick={() => { setSelectedGame(null); setSlotResult(null); setDiceResult(null); }}
              className="font-mono text-[10px] text-white/20 hover:text-white/40 mb-4 flex items-center gap-1">
              ← BACK TO GAMES
            </button>

            {/* VOID SLOTS */}
            {selectedGame === "void_slots" && (
              <div className="text-center">
                <h2 className="font-display text-xl text-amber-400 mb-4">VOID SLOTS</h2>
                {slotResult && (
                  <div className="flex justify-center gap-4 mb-6">
                    {slotResult.reels.map((sym, i) => {
                      const s = SLOT_SYMBOLS.find(x => x.id === sym);
                      return (
                        <motion.div key={i} initial={{ rotateX: 360 }} animate={{ rotateX: 0 }}
                          transition={{ duration: 0.5, delay: i * 0.2 }}
                          className="w-20 h-20 rounded-xl border-2 flex items-center justify-center text-3xl"
                          style={{ borderColor: `${s?.color || "#fff"}40`, background: `${s?.color || "#fff"}10` }}>
                          {s?.emoji || "?"}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
                {slotResult && (
                  <p className={`font-mono text-lg mb-4 ${slotResult.payout > 0 ? "text-green-400" : "text-red-400"}`}>
                    {slotResult.payout > 0 ? `+${slotResult.payout} DREAM!` : "No match"}
                  </p>
                )}
                <div className="flex justify-center gap-3">
                  {[10, 25, 50, 100].map(bet => (
                    <button key={bet} onClick={() => handleSlotSpin(bet)}
                      className="px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-sm hover:bg-amber-500/20 transition-all">
                      SPIN {bet}D
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ENTROPY DICE */}
            {selectedGame === "entropy_dice" && (
              <div className="text-center">
                <h2 className="font-display text-xl text-amber-400 mb-4">ENTROPY DICE</h2>
                {diceResult && (
                  <div className="flex justify-center gap-6 mb-4">
                    <motion.div initial={{ rotateZ: 360 }} animate={{ rotateZ: 0 }}
                      className="w-16 h-16 rounded-xl bg-white/5 border border-white/20 flex items-center justify-center font-display text-2xl text-white">
                      {diceResult.die1}
                    </motion.div>
                    <motion.div initial={{ rotateZ: -360 }} animate={{ rotateZ: 0 }}
                      className="w-16 h-16 rounded-xl bg-white/5 border border-white/20 flex items-center justify-center font-display text-2xl text-white">
                      {diceResult.die2}
                    </motion.div>
                  </div>
                )}
                {diceResult && (
                  <p className="font-mono text-lg text-white/60 mb-4">Total: {diceResult.total}</p>
                )}
                <p className="font-mono text-[10px] text-white/20 mb-3">Bet 25 Dream — Predict the roll:</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => handleDiceRoll(25, "under")}
                    className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-sm hover:bg-blue-500/20">
                    UNDER 7 (2x)
                  </button>
                  <button onClick={() => handleDiceRoll(25, "exact")}
                    className="px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-sm hover:bg-amber-500/20">
                    EXACT 7 (5x)
                  </button>
                  <button onClick={() => handleDiceRoll(25, "over")}
                    className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-sm hover:bg-red-500/20">
                    OVER 7 (2x)
                  </button>
                </div>
              </div>
            )}

            {/* Other games — placeholder */}
            {selectedGame !== "void_slots" && selectedGame !== "entropy_dice" && (
              <div className="text-center py-12">
                <Skull size={32} className="text-amber-400/30 mx-auto mb-3" />
                <p className="font-mono text-sm text-white/40">
                  {CASINO_GAMES.find(g => g.id === selectedGame)?.name}
                </p>
                <p className="font-mono text-[10px] text-white/20 mt-2">
                  {CASINO_GAMES.find(g => g.id === selectedGame)?.rules}
                </p>
                <p className="font-mono text-[9px] text-amber-400/30 mt-4">Coming to Ne-Yon Space soon...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Session Stats */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-2 border-t border-amber-500/10 bg-black/90 backdrop-blur-md">
        <div className="flex items-center justify-between max-w-2xl mx-auto font-mono text-[9px] text-white/20">
          <span>W: {casinoState.sessionWins} / L: {casinoState.sessionLosses}</span>
          <span>Net: <span className={casinoState.totalWon - casinoState.totalWagered >= 0 ? "text-green-400/60" : "text-red-400/60"}>
            {casinoState.totalWon - casinoState.totalWagered}D
          </span></span>
          <span>VIP: {vip.name}</span>
        </div>
      </div>
    </div>
  );
}

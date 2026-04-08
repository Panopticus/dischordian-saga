/* ═══════════════════════════════════════════════════════
   THE DEGEN'S CASINO — Page wrapper with game selection
   Accessible via Trade Hub (Locke trust 30 required)
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Skull, Star, Zap, Dice1 as Dice, Trophy } from "lucide-react";
import LivingBackground from "@/components/LivingBackground";
import {
  CASINO_GAMES, spinSlots, rollDice, getVIPLevel, getDegenQuote,
  DEFAULT_CASINO_STATE, type CasinoState, type CasinoGame,
  SLOT_SYMBOLS, getStreakMultiplier, getStreakReward,
  calculateFavorGain, getDegenFavorMilestone, rollForTale,
  checkEquilibrium, getDegenMood, DEGEN_MOOD_COMMENTARY,
  DEGEN_QUOTES_EXPANSION, type DegenTale,
  rollLiarsDice, dreamRouletteRound, generateBingoCard, checkBingoWin,
  LIARS_DICE_NPCS, SAMPLE_FACTION_BETS, BINGO_LORE_EVENTS,
} from "./degensCasino";

const CASINO_FLOOR_BG = "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775678427/DC-001_THE_CASINO_FLOOR_mp3os6.jpg";

export default function DegensCasinoPage() {
  const [, navigate] = useLocation();
  const [entering, setEntering] = useState(true);
  const [casinoState, setCasinoState] = useState<CasinoState>(() => {
    const saved = localStorage.getItem("degen_casino");
    return saved ? JSON.parse(saved) : DEFAULT_CASINO_STATE;
  });

  // Auto-dismiss loading screen after image loads + brief cinematic pause
  useEffect(() => {
    if (!entering) return;
    const img = new Image();
    img.src = CASINO_FLOOR_BG;
    const timer = setTimeout(() => setEntering(false), 3000);
    img.onload = () => { setTimeout(() => setEntering(false), 1500); clearTimeout(timer); };
    return () => clearTimeout(timer);
  }, []);
  const [selectedGame, setSelectedGame] = useState<CasinoGame | null>(null);
  const [casinoFloor, setCasinoFloor] = useState<"main" | "cards" | "dice" | "slots" | "vip" | "betting" | "bingo" | "roulette">("main");
  const [degenText, setDegenText] = useState(() => getDegenQuote("welcome"));
  const [slotResult, setSlotResult] = useState<{ reels: string[]; payout: number } | null>(null);
  const [diceResult, setDiceResult] = useState<{ die1: number; die2: number; total: number } | null>(null);
  const [latestTale, setLatestTale] = useState<DegenTale | null>(null);
  const [showTale, setShowTale] = useState(false);

  const vip = useMemo(() => getVIPLevel(casinoState.totalWagered), [casinoState.totalWagered]);
  const streakReward = useMemo(() => getStreakReward(casinoState.currentStreak), [casinoState.currentStreak]);
  const degenMood = useMemo(() => getDegenMood(casinoState), [casinoState]);
  const favorMilestone = useMemo(() => getDegenFavorMilestone(casinoState.degenFavor), [casinoState.degenFavor]);
  const isEquilibrium = useMemo(() => checkEquilibrium(casinoState), [casinoState]);

  const save = (s: CasinoState) => { setCasinoState(s); localStorage.setItem("degen_casino", JSON.stringify(s)); };

  /** Unified game result handler — tracks streaks, favor, tales, bets */
  const processGameResult = (game: CasinoGame, bet: number, won: boolean, payout: number, jackpot = false) => {
    const newStreak = won ? casinoState.currentStreak + 1 : 0;
    const streakMult = getStreakMultiplier(casinoState.currentStreak);
    const adjustedPayout = won ? Math.round(payout * streakMult) : 0;
    const favorGain = calculateFavorGain({ won, jackpot, bet });

    // Roll for lore tale drop
    const tale = rollForTale(casinoState.degenFavor, casinoState.collectedTales);
    if (tale) {
      setLatestTale(tale);
      setShowTale(true);
    }

    const newState: CasinoState = {
      ...casinoState,
      totalWagered: casinoState.totalWagered + bet,
      totalWon: casinoState.totalWon + adjustedPayout,
      sessionWins: won ? casinoState.sessionWins + 1 : casinoState.sessionWins,
      sessionLosses: !won ? casinoState.sessionLosses + 1 : casinoState.sessionLosses,
      currentStreak: newStreak,
      bestStreak: Math.max(casinoState.bestStreak, newStreak),
      degenFavor: Math.min(100, casinoState.degenFavor + favorGain),
      totalBetsPlaced: casinoState.totalBetsPlaced + 1,
      collectedTales: tale ? [...casinoState.collectedTales, tale.id] : casinoState.collectedTales,
      gamesPlayed: {
        ...casinoState.gamesPlayed,
        [game]: (casinoState.gamesPlayed[game] ?? 0) + 1,
      },
    };
    save(newState);

    // Set appropriate commentary
    if (jackpot) {
      setDegenText(getDegenQuote("jackpot"));
    } else if (newStreak >= 10) {
      const quotes = DEGEN_QUOTES_EXPANSION.streak_10;
      setDegenText(quotes[Math.floor(Math.random() * quotes.length)]);
    } else if (newStreak >= 5) {
      const quotes = DEGEN_QUOTES_EXPANSION.streak_5;
      setDegenText(quotes[Math.floor(Math.random() * quotes.length)]);
    } else if (newStreak >= 3) {
      const quotes = DEGEN_QUOTES_EXPANSION.streak_3;
      setDegenText(quotes[Math.floor(Math.random() * quotes.length)]);
    } else if (won) {
      setDegenText(getDegenQuote("win"));
    } else {
      setDegenText(getDegenQuote("lose"));
    }
  };

  const handleSlotSpin = (bet: number) => {
    const result = spinSlots();
    const payout = result.payout * bet;
    setSlotResult({ reels: result.reels, payout });
    processGameResult("void_slots", bet, payout > 0, Math.max(0, payout), result.jackpot);
  };

  const handleDiceRoll = (bet: number, prediction: "over" | "under" | "exact") => {
    const result = rollDice();
    setDiceResult(result);
    const won = prediction === "over" ? result.total > 7 : prediction === "under" ? result.total < 7 : result.total === 7;
    const multiplier = prediction === "exact" ? 5 : 2;
    const payout = won ? bet * multiplier : 0;
    processGameResult("entropy_dice", bet, won, payout);
  };

  // ─── LOADING / ENTRY SCREEN ───
  if (entering) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <img
          src={CASINO_FLOOR_BG}
          alt="The Degen's Casino"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.35) saturate(1.2)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Skull size={48} className="text-amber-400 mx-auto mb-4" />
          </motion.div>
          <h1 className="font-display text-3xl sm:text-4xl tracking-[0.3em] text-amber-400 mb-2">
            THE DEGEN'S CASINO
          </h1>
          <p className="font-mono text-[10px] text-amber-400/40 tracking-[0.2em] mb-6">
            EDGE OF THE SHIELD // NE-YON SPACE // THE HOST WATCHES
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto mb-4"
          />
          <motion.p
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-mono text-[9px] text-amber-400/50"
          >
            ENTERING THE FLOOR...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Casino Floor Background */}
      <LivingBackground
        src={CASINO_FLOOR_BG}
        accent="#d97706"
        opacity={0.12}
        particleCount={6}
        scanlines={false}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-amber-500/20 bg-gradient-to-r from-black via-amber-950/20 to-black relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Skull size={20} className="text-amber-400" />
          </div>
          <div>
            <h1 className="font-display text-lg tracking-[0.2em] text-amber-400">THE DEGEN'S CASINO</h1>
            <p className="font-mono text-[8px] text-amber-400/40">EDGE OF THE SHIELD // ONLY OPEN ZONE IN NE-YON SPACE // THE HOST WATCHES</p>
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

      {/* Streak & Favor Bar */}
      {(casinoState.currentStreak >= 3 || casinoState.degenFavor > 0) && (
        <div className="px-4 py-1.5 border-b border-amber-500/10 bg-amber-500/[0.02] flex items-center justify-between font-mono text-[8px]">
          {casinoState.currentStreak >= 3 && (
            <span className="text-amber-300">
              🔥 STREAK: {casinoState.currentStreak} — {streakReward?.effect ?? ""}
              {getStreakMultiplier(casinoState.currentStreak) > 1 && ` (${getStreakMultiplier(casinoState.currentStreak)}x)`}
            </span>
          )}
          {casinoState.degenFavor > 0 && (
            <span className="text-amber-400/40">
              Degen's Favor: {casinoState.degenFavor}/100
              {favorMilestone && ` — ${favorMilestone.name}`}
            </span>
          )}
        </div>
      )}

      {/* Degen Commentary */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-start gap-2">
          <Skull size={14} className="text-amber-400/60 mt-0.5 shrink-0" />
          <p className="font-mono text-xs text-amber-400/70 italic leading-relaxed">"{degenText}"</p>
        </div>
      </div>

      {/* Casino Floor Navigation */}
      {!selectedGame && (
        <div className="px-4 py-2 border-b border-white/5 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {([
              { id: "main", label: "Main Floor", icon: "🎰" },
              { id: "cards", label: "Card Tables", icon: "🃏" },
              { id: "dice", label: "Dice Pit", icon: "🎲" },
              { id: "slots", label: "Slots Gallery", icon: "💎" },
              { id: "betting", label: "Betting Board", icon: "📊" },
              { id: "bingo", label: "Bingo Hall", icon: "📋" },
              { id: "roulette", label: "Dream Roulette", icon: "💀" },
              ...(casinoState.degenFavor >= 80 ? [{ id: "vip", label: "VIP Lounge", icon: "👑" }] : []),
            ] as const).map(floor => (
              <button key={floor.id}
                onClick={() => setCasinoFloor(floor.id as typeof casinoFloor)}
                className={`px-3 py-1.5 rounded-lg font-mono text-[9px] whitespace-nowrap transition-all ${
                  casinoFloor === floor.id
                    ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                    : "bg-white/[0.02] border border-white/5 text-white/30 hover:text-white/50"
                }`}>
                {floor.icon} {floor.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lore Tale Drop Modal */}
      <AnimatePresence>
        {showTale && latestTale && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowTale(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full p-6 rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-950/40 to-black"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-400 text-lg">📖</span>
                <p className="font-mono text-[10px] text-amber-400/60 tracking-wider">DEGEN'S TALE DISCOVERED</p>
              </div>
              <h3 className="font-display text-lg text-amber-300 mb-3">{latestTale.title}</h3>
              <p className="font-mono text-xs text-white/60 leading-relaxed mb-4">{latestTale.text}</p>
              <div className="flex justify-between items-center">
                <p className="font-mono text-[8px] text-amber-400/30">
                  Tale {casinoState.collectedTales.length} collected
                </p>
                <button onClick={() => setShowTale(false)}
                  className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px]">
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Selection or Active Game */}
      <div className="p-4 max-w-2xl mx-auto">
        {!selectedGame ? (
          <>
            <p className="font-mono text-[10px] text-white/20 tracking-wider mb-4">
              {casinoFloor === "main" ? "SELECT YOUR GAME" :
               casinoFloor === "cards" ? "CARD TABLES QUARTER" :
               casinoFloor === "dice" ? "THE DICE PIT" :
               casinoFloor === "slots" ? "SLOTS GALLERY" :
               casinoFloor === "vip" ? "THE DEGEN'S VIP LOUNGE" :
               casinoFloor === "betting" ? "FACTION WAR BETTING BOARD" :
               casinoFloor === "bingo" ? "VOID BINGO HALL" :
               casinoFloor === "roulette" ? "DREAM ROULETTE CHAMBER" : "SELECT YOUR GAME"}
            </p>
            {/* Equilibrium alert */}
            {isEquilibrium && (
              <div className="mb-4 p-4 rounded-xl border border-amber-300/50 bg-amber-300/5 text-center">
                <p className="font-display text-lg text-amber-300">THE EQUILIBRIUM</p>
                <p className="font-mono text-[10px] text-amber-400/70 mt-1">
                  {casinoState.totalBetsPlaced} bets. Exactly even. The Degen is terrified.
                </p>
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {CASINO_GAMES
                .filter(game => {
                  if (casinoFloor === "main") return true;
                  if (casinoFloor === "cards") return ["nebula_poker", "pazaak_21", "void_blackjack_tournament", "card_battlers_gauntlet"].includes(game.id);
                  if (casinoFloor === "dice") return ["entropy_dice", "liars_dice", "dream_roulette"].includes(game.id);
                  if (casinoFloor === "slots") return ["void_slots", "scratch_cards", "void_bingo"].includes(game.id);
                  if (casinoFloor === "vip") return ["nebula_poker", "void_blackjack_tournament", "card_battlers_gauntlet"].includes(game.id);
                  if (casinoFloor === "betting") return game.id === "faction_war_betting";
                  if (casinoFloor === "bingo") return game.id === "void_bingo";
                  if (casinoFloor === "roulette") return ["quantum_roulette", "dream_roulette"].includes(game.id);
                  return true;
                })
                .map(game => (
                <button key={game.id} onClick={() => setSelectedGame(game.id)}
                  className="p-4 rounded-xl border border-amber-500/15 bg-amber-500/[0.03] hover:bg-amber-500/[0.06] transition-all text-left group">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-mono text-sm text-amber-400 font-bold group-hover:text-amber-300">{game.name}</p>
                    {(casinoState.gamesPlayed[game.id] ?? 0) > 0 && (
                      <span className="font-mono text-[7px] text-white/15">played {casinoState.gamesPlayed[game.id]}x</span>
                    )}
                  </div>
                  <p className="font-mono text-[9px] text-white/30 mb-2">{game.description}</p>
                  <div className="flex gap-3 font-mono text-[8px] text-white/15">
                    {game.minBet > 0 ? (
                      <>
                        <span>Min: {game.minBet}D</span>
                        <span>Max: {game.maxBet}D</span>
                        <span>Edge: {game.houseEdge}%</span>
                      </>
                    ) : (
                      <span className="text-green-400/40">FREE TO PLAY</span>
                    )}
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
          {casinoState.currentStreak >= 3 && <span className="text-amber-400/60">🔥{casinoState.currentStreak}</span>}
          <span>Bets: {casinoState.totalBetsPlaced}</span>
          <span>Tales: {casinoState.collectedTales.length}/12</span>
          <span>VIP: {vip.name}</span>
        </div>
      </div>
    </div>
  );
}

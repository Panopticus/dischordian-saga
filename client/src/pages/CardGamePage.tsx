import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import GameCard from "@/components/GameCard";
import { Link } from "wouter";
import {
  ChevronLeft, Swords, Shield, Zap, Heart, Crown,
  RotateCcw, Play, Pause, SkipForward, Trophy,
  Flame, Sparkles, Eye, X, ChevronRight
} from "lucide-react";
import { getLoginUrl } from "@/const";

// Game state types
interface GameCard_ {
  cardId: string;
  name: string;
  cardType: string;
  rarity: string;
  power: number;
  health: number;
  cost: number;
  abilityText?: string | null;
  imageUrl?: string | null;
  element?: string | null;
  alignment?: string | null;
  currentHealth?: number;
  isExhausted?: boolean;
}

interface GameState {
  phase: "setup" | "draw" | "action" | "combat" | "resolution" | "end";
  turn: number;
  activePlayer: "player" | "opponent";
  playerPool: number;
  opponentPool: number;
  playerHand: GameCard_[];
  opponentHand: GameCard_[];
  playerField: GameCard_[];
  opponentField: GameCard_[];
  playerDeck: GameCard_[];
  opponentDeck: GameCard_[];
  playerDiscard: GameCard_[];
  opponentDiscard: GameCard_[];
  log: string[];
  winner: "player" | "opponent" | null;
  selectedCard: GameCard_ | null;
  targetCard: GameCard_ | null;
  animatingAttack: { attacker: GameCard_; target: GameCard_; damage: number } | null;
}

// Initial game setup
function createInitialState(playerCards: GameCard_[], opponentCards: GameCard_[]): GameState {
  const shuffled = (arr: GameCard_[]) => [...arr].sort(() => Math.random() - 0.5);
  const pDeck = shuffled(playerCards);
  const oDeck = shuffled(opponentCards);

  return {
    phase: "draw",
    turn: 1,
    activePlayer: "player",
    playerPool: 4,
    opponentPool: 4,
    playerHand: pDeck.splice(0, 5).map(c => ({ ...c, currentHealth: c.health })),
    opponentHand: oDeck.splice(0, 5).map(c => ({ ...c, currentHealth: c.health })),
    playerField: [],
    opponentField: [],
    playerDeck: pDeck,
    opponentDeck: oDeck,
    playerDiscard: [],
    opponentDiscard: [],
    log: ["Match begins. Draw phase."],
    winner: null,
    selectedCard: null,
    targetCard: null,
    animatingAttack: null,
  };
}

export default function CardGamePage() {
  const { user, isAuthenticated } = useAuth();
  const [gamePhase, setGamePhase] = useState<"menu" | "deckSelect" | "playing" | "result">("menu");
  const [game, setGame] = useState<GameState | null>(null);
  const [showLog, setShowLog] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  // Fetch cards for deck building
  const { data: allCards } = trpc.cardGame.browse.useQuery({
    page: 1,
    limit: 100,
    cardType: "character",
    sortBy: "power",
    sortDir: "desc",
  });

  // Start a new game with random decks
  const startGame = useCallback(() => {
    if (!allCards?.cards) return;

    const available = allCards.cards.filter(c => c.power > 0 && c.health > 0);
    const shuffled = [...available].sort(() => Math.random() - 0.5);

    const playerDeck = shuffled.slice(0, 20).map(c => ({
      ...c,
      currentHealth: c.health,
      isExhausted: false,
    }));
    const opponentDeck = shuffled.slice(20, 40).map(c => ({
      ...c,
      currentHealth: c.health,
      isExhausted: false,
    }));

    setGame(createInitialState(playerDeck, opponentDeck));
    setGamePhase("playing");
  }, [allCards]);

  // Draw a card
  const drawCard = useCallback(() => {
    if (!game) return;
    setGame(prev => {
      if (!prev) return prev;
      const isPlayer = prev.activePlayer === "player";
      const deck = isPlayer ? [...prev.playerDeck] : [...prev.opponentDeck];
      const hand = isPlayer ? [...prev.playerHand] : [...prev.opponentHand];

      if (deck.length === 0) {
        return { ...prev, log: [...prev.log, `${isPlayer ? "You" : "Opponent"} has no cards to draw!`] };
      }

      const drawn = deck.shift()!;
      hand.push({ ...drawn, currentHealth: drawn.health });

      return {
        ...prev,
        ...(isPlayer
          ? { playerDeck: deck, playerHand: hand }
          : { opponentDeck: deck, opponentHand: hand }),
        phase: "action",
        log: [...prev.log, `${isPlayer ? "You" : "Opponent"} drew ${drawn.name}.`],
      };
    });
  }, [game]);

  // Play a card from hand to field
  const playCard = useCallback((card: GameCard_) => {
    if (!game || game.phase !== "action" || game.activePlayer !== "player") return;
    if (card.cost > game.playerPool) return;

    setGame(prev => {
      if (!prev) return prev;
      const hand = prev.playerHand.filter(c => c.cardId !== card.cardId);
      const field = [...prev.playerField, { ...card, isExhausted: true }];

      return {
        ...prev,
        playerHand: hand,
        playerField: field,
        playerPool: prev.playerPool - card.cost,
        log: [...prev.log, `You played ${card.name} (cost ${card.cost}).`],
      };
    });
  }, [game]);

  // Select a card for attack
  const selectAttacker = useCallback((card: GameCard_) => {
    if (!game || game.activePlayer !== "player" || card.isExhausted) return;
    setGame(prev => prev ? { ...prev, selectedCard: card } : prev);
  }, [game]);

  // Attack with selected card
  const attackTarget = useCallback((target: GameCard_) => {
    if (!game || !game.selectedCard) return;

    const attacker = game.selectedCard;
    const damage = attacker.power;

    // Animate the attack
    setGame(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        animatingAttack: { attacker, target, damage },
        selectedCard: null,
      };
    });

    // Apply damage after animation
    setTimeout(() => {
      setGame(prev => {
        if (!prev) return prev;
        const newOpField = prev.opponentField.map(c => {
          if (c.cardId === target.cardId) {
            return { ...c, currentHealth: (c.currentHealth ?? c.health) - damage };
          }
          return c;
        }).filter(c => (c.currentHealth ?? c.health) > 0);

        const destroyed = prev.opponentField.filter(c => {
          if (c.cardId === target.cardId) {
            return (c.currentHealth ?? c.health) - damage <= 0;
          }
          return false;
        });

        // Counter-attack
        const counterDamage = target.power;
        const newPField = prev.playerField.map(c => {
          if (c.cardId === attacker.cardId) {
            return {
              ...c,
              currentHealth: (c.currentHealth ?? c.health) - counterDamage,
              isExhausted: true,
            };
          }
          return c;
        }).filter(c => (c.currentHealth ?? c.health) > 0);

        const newLog = [...prev.log];
        newLog.push(`${attacker.name} attacks ${target.name} for ${damage} damage!`);
        if (destroyed.length > 0) newLog.push(`${target.name} was destroyed!`);
        if (counterDamage > 0) newLog.push(`${target.name} counter-attacks for ${counterDamage}!`);

        // Check if attacker was destroyed by counter
        const attackerDestroyed = (attacker.currentHealth ?? attacker.health) - counterDamage <= 0;
        if (attackerDestroyed) newLog.push(`${attacker.name} was destroyed in combat!`);

        return {
          ...prev,
          playerField: newPField,
          opponentField: newOpField,
          opponentDiscard: [...prev.opponentDiscard, ...destroyed],
          animatingAttack: null,
          log: newLog,
        };
      });
    }, 800);
  }, [game]);

  // End turn
  const endTurn = useCallback(() => {
    if (!game) return;

    setGame(prev => {
      if (!prev) return prev;

      // Reset exhaustion for player
      const refreshedField = prev.playerField.map(c => ({ ...c, isExhausted: false }));

      return {
        ...prev,
        playerField: refreshedField,
        activePlayer: "opponent",
        phase: "draw",
        playerPool: Math.min(10, prev.playerPool + 2),
        log: [...prev.log, "--- Opponent's turn ---"],
      };
    });

    // AI opponent turn
    setTimeout(() => aiTurn(), 1000);
  }, [game]);

  // Simple AI opponent
  const aiTurn = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;

      let state = { ...prev };
      const log = [...state.log];

      // Draw
      if (state.opponentDeck.length > 0) {
        const deck = [...state.opponentDeck];
        const hand = [...state.opponentHand];
        const drawn = deck.shift()!;
        hand.push({ ...drawn, currentHealth: drawn.health });
        state = { ...state, opponentDeck: deck, opponentHand: hand };
        log.push(`Opponent drew a card.`);
      }

      // Play cards
      let pool = state.opponentPool + 2;
      const hand = [...state.opponentHand];
      const field = [...state.opponentField];
      const playable = hand.filter(c => c.cost <= pool).sort((a, b) => b.power - a.power);

      for (const card of playable.slice(0, 2)) {
        if (card.cost <= pool) {
          hand.splice(hand.indexOf(card), 1);
          field.push({ ...card, isExhausted: false });
          pool -= card.cost;
          log.push(`Opponent played ${card.name}.`);
        }
      }

      // Attack
      const attackers = field.filter(c => !c.isExhausted && c.power > 0);
      const targets = [...state.playerField];

      for (const attacker of attackers) {
        if (targets.length === 0) break;
        const target = targets[Math.floor(Math.random() * targets.length)];
        const damage = attacker.power;
        const newHp = (target.currentHealth ?? target.health) - damage;
        log.push(`Opponent's ${attacker.name} attacks your ${target.name} for ${damage}!`);

        if (newHp <= 0) {
          targets.splice(targets.indexOf(target), 1);
          log.push(`Your ${target.name} was destroyed!`);
        } else {
          target.currentHealth = newHp;
        }

        // Counter damage
        const counter = target.power;
        attacker.currentHealth = (attacker.currentHealth ?? attacker.health) - counter;
        if ((attacker.currentHealth ?? 0) <= 0) {
          log.push(`Opponent's ${attacker.name} was destroyed in combat!`);
        }
        attacker.isExhausted = true;
      }

      const aliveOpField = field.filter(c => (c.currentHealth ?? c.health) > 0);
      const alivePField = targets;

      // Check win condition: if either side has no field and no hand
      let winner = state.winner;
      if (alivePField.length === 0 && state.playerHand.length === 0 && state.playerDeck.length === 0) {
        winner = "opponent";
        log.push("You have been defeated!");
      }
      if (aliveOpField.length === 0 && hand.length === 0 && state.opponentDeck.length === 0) {
        winner = "player";
        log.push("Victory! You have won!");
      }

      return {
        ...state,
        opponentHand: hand,
        opponentField: aliveOpField,
        opponentPool: Math.min(10, pool),
        playerField: alivePField,
        activePlayer: "player",
        phase: "draw",
        turn: state.turn + 1,
        log,
        winner,
      };
    });
  }, []);

  // Auto-draw at start of player turn
  useEffect(() => {
    if (game?.phase === "draw" && game.activePlayer === "player" && !game.winner) {
      const timer = setTimeout(() => drawCard(), 500);
      return () => clearTimeout(timer);
    }
  }, [game?.phase, game?.activePlayer, game?.turn]);

  // Scroll log to bottom
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [game?.log.length]);

  // Check for game end
  useEffect(() => {
    if (game?.winner) {
      setTimeout(() => setGamePhase("result"), 1500);
    }
  }, [game?.winner]);

  // ═══ MENU SCREEN ═══
  if (gamePhase === "menu") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
              <Swords size={16} className="text-primary" />
              <span className="font-display text-xs tracking-wider text-primary">CARD GAME</span>
            </div>
            <h1 className="font-display text-2xl font-black tracking-wider text-foreground mb-2">
              THE <span className="text-primary glow-cyan">DISCHORDIAN</span> STRUGGLE
            </h1>
            <p className="font-mono text-xs text-muted-foreground">
              A VTES-inspired card battle system // 3000 cards // 3 seasons
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={startGame}
              className="w-full flex items-center justify-between px-5 py-4 rounded-lg bg-primary/10 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all group"
            >
              <div className="flex items-center gap-3">
                <Play size={18} />
                <div className="text-left">
                  <p className="font-display text-sm tracking-wider">QUICK MATCH</p>
                  <p className="text-[10px] text-primary/60">Random deck vs AI opponent</p>
                </div>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <Link
              href="/cards"
              className="w-full flex items-center justify-between px-5 py-4 rounded-lg bg-secondary/50 border border-border/30 text-foreground font-mono text-sm hover:bg-secondary/80 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Eye size={18} className="text-accent" />
                <div className="text-left">
                  <p className="font-display text-sm tracking-wider">CARD DATABASE</p>
                  <p className="text-[10px] text-muted-foreground">Browse all 3000 cards</p>
                </div>
              </div>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center px-5 py-3 rounded-lg bg-secondary/30 border border-border/20 text-muted-foreground font-mono text-xs hover:text-foreground transition-all"
            >
              <ChevronLeft size={14} className="mr-1" />
              BACK TO LOREDEX
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══ RESULT SCREEN ═══
  if (gamePhase === "result" && game) {
    const isWinner = game.winner === "player";
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {isWinner ? (
              <Trophy size={48} className="mx-auto text-amber-400 mb-4" />
            ) : (
              <Skull size={48} className="mx-auto text-destructive mb-4" />
            )}
            <h2 className={`font-display text-2xl font-black tracking-wider mb-2 ${
              isWinner ? "text-amber-400" : "text-destructive"
            }`}>
              {isWinner ? "VICTORY" : "DEFEAT"}
            </h2>
            <p className="font-mono text-xs text-muted-foreground mb-6">
              {isWinner ? "The Dischordian Struggle continues..." : "Regroup and try again, operative."}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-lg bg-card/50 border border-border/20 p-3">
              <p className="font-display text-lg font-bold text-primary">{game.turn}</p>
              <p className="font-mono text-[9px] text-muted-foreground">TURNS</p>
            </div>
            <div className="rounded-lg bg-card/50 border border-border/20 p-3">
              <p className="font-display text-lg font-bold text-destructive">{game.opponentDiscard.length}</p>
              <p className="font-mono text-[9px] text-muted-foreground">DESTROYED</p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => { setGamePhase("menu"); setGame(null); }}
              className="w-full px-5 py-3 rounded-lg bg-primary/10 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/20 transition-all"
            >
              <RotateCcw size={14} className="inline mr-2" />
              PLAY AGAIN
            </button>
            <Link
              href="/"
              className="block w-full px-5 py-3 rounded-lg bg-secondary/30 border border-border/20 text-muted-foreground font-mono text-xs hover:text-foreground transition-all text-center"
            >
              RETURN TO LOREDEX
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══ GAME BOARD ═══
  if (!game) return null;

  const Skull_ = Flame; // Alias for destroyed icon

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Top bar - opponent info */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/20 bg-card/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-destructive/20 border border-destructive/40 flex items-center justify-center">
            <Skull size={14} className="text-destructive" />
          </div>
          <div>
            <p className="font-mono text-[10px] text-destructive font-bold">OPPONENT</p>
            <p className="font-mono text-[9px] text-muted-foreground">
              Hand: {game.opponentHand.length} | Deck: {game.opponentDeck.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Zap size={12} className="text-amber-400" />
            <span className="font-display text-sm font-bold text-amber-400">{game.opponentPool}</span>
          </div>
          <div className="px-2 py-1 rounded bg-secondary/50 border border-border/20">
            <span className="font-mono text-[9px] text-muted-foreground">TURN {game.turn}</span>
          </div>
          <button
            onClick={() => setShowLog(!showLog)}
            className="p-1.5 rounded bg-secondary/50 border border-border/20 text-muted-foreground hover:text-primary transition-colors"
          >
            <Eye size={12} />
          </button>
        </div>
      </div>

      {/* Opponent field */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-3 py-2 border-b border-border/10">
          <p className="font-mono text-[8px] text-muted-foreground/40 mb-1">OPPONENT FIELD</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {game.opponentField.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-4">
                <span className="font-mono text-[10px] text-muted-foreground/20">No cards in play</span>
              </div>
            ) : (
              game.opponentField.map((card) => (
                <motion.div
                  key={card.cardId}
                  layout
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="relative shrink-0"
                >
                  <GameCard
                    card={card}
                    size="sm"
                    onClick={() => game.selectedCard && attackTarget(card)}
                    isSelected={game.targetCard?.cardId === card.cardId}
                    className={game.selectedCard ? "ring-1 ring-destructive/50 cursor-crosshair" : ""}
                  />
                  {/* Health bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary/50 rounded-b">
                    <div
                      className="h-full bg-green-500 rounded-b transition-all"
                      style={{ width: `${((card.currentHealth ?? card.health) / card.health) * 100}%` }}
                    />
                  </div>
                  {/* Damage indicator */}
                  {(card.currentHealth ?? card.health) < card.health && (
                    <div className="absolute top-1 left-1 px-1 py-0.5 rounded bg-destructive/80 text-[8px] font-mono text-white font-bold">
                      {card.currentHealth ?? card.health}/{card.health}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Center divider with phase info */}
        <div className="flex items-center justify-center gap-4 py-2 bg-card/20 border-y border-border/10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/30" />
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded font-mono text-[9px] font-bold ${
              game.activePlayer === "player"
                ? "bg-primary/15 text-primary border border-primary/30"
                : "bg-destructive/15 text-destructive border border-destructive/30"
            }`}>
              {game.activePlayer === "player" ? "YOUR TURN" : "OPPONENT'S TURN"}
            </span>
            <span className="font-mono text-[9px] text-muted-foreground uppercase">
              {game.phase} phase
            </span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/30" />
        </div>

        {/* Player field */}
        <div className="flex-1 px-3 py-2 border-b border-border/10">
          <p className="font-mono text-[8px] text-muted-foreground/40 mb-1">YOUR FIELD</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {game.playerField.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-4">
                <span className="font-mono text-[10px] text-muted-foreground/20">Play cards from your hand</span>
              </div>
            ) : (
              game.playerField.map((card) => (
                <motion.div
                  key={card.cardId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="relative shrink-0"
                >
                  <GameCard
                    card={card}
                    size="sm"
                    onClick={() => !card.isExhausted && selectAttacker(card)}
                    isSelected={game.selectedCard?.cardId === card.cardId}
                    className={card.isExhausted ? "opacity-50 grayscale-[50%]" : ""}
                  />
                  {/* Health bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary/50 rounded-b">
                    <div
                      className="h-full bg-green-500 rounded-b transition-all"
                      style={{ width: `${((card.currentHealth ?? card.health) / card.health) * 100}%` }}
                    />
                  </div>
                  {card.isExhausted && (
                    <div className="absolute top-1 right-1 px-1 py-0.5 rounded bg-muted/80 text-[8px] font-mono text-muted-foreground">
                      TAPPED
                    </div>
                  )}
                  {(card.currentHealth ?? card.health) < card.health && (
                    <div className="absolute top-1 left-1 px-1 py-0.5 rounded bg-destructive/80 text-[8px] font-mono text-white font-bold">
                      {card.currentHealth ?? card.health}/{card.health}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Player hand */}
      <div className="border-t border-border/30 bg-card/40">
        <div className="flex items-center justify-between px-3 py-1.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Crown size={14} className="text-primary" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-primary font-bold">YOU</p>
              <p className="font-mono text-[9px] text-muted-foreground">
                Deck: {game.playerDeck.length} | Discard: {game.playerDiscard.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-amber-400" />
              <span className="font-display text-sm font-bold text-amber-400">{game.playerPool}</span>
              <span className="font-mono text-[8px] text-muted-foreground">POOL</span>
            </div>
            {game.activePlayer === "player" && game.phase === "action" && (
              <button
                onClick={endTurn}
                className="px-3 py-1.5 rounded-md bg-accent/10 border border-accent/40 font-mono text-[10px] text-accent hover:bg-accent/20 transition-all"
              >
                END TURN →
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 px-3 pb-3 overflow-x-auto">
          <AnimatePresence>
            {game.playerHand.map((card, i) => (
              <motion.div
                key={card.cardId}
                initial={{ opacity: 0, y: 30, rotate: -5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ delay: i * 0.05 }}
                className="shrink-0"
              >
                <GameCard
                  card={card}
                  size="sm"
                  onClick={() => playCard(card)}
                  className={card.cost <= game.playerPool && game.phase === "action" && game.activePlayer === "player"
                    ? "ring-1 ring-primary/30"
                    : "opacity-60"
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Attack animation overlay */}
      <AnimatePresence>
        {game.animatingAttack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <Swords size={64} className="text-destructive drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-4 -right-4 px-2 py-1 rounded bg-destructive text-white font-display text-lg font-bold"
              >
                -{game.animatingAttack.damage}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game log overlay */}
      <AnimatePresence>
        {showLog && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 bottom-0 w-72 bg-card/95 backdrop-blur-sm border-l border-border/30 z-40 flex flex-col"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/20">
              <span className="font-mono text-[10px] text-muted-foreground tracking-wider">BATTLE LOG</span>
              <button onClick={() => setShowLog(false)} className="text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            </div>
            <div ref={logRef} className="flex-1 overflow-y-auto p-3 space-y-1">
              {game.log.map((entry, i) => (
                <p
                  key={i}
                  className={`font-mono text-[10px] leading-relaxed ${
                    entry.startsWith("---") ? "text-primary/50 border-t border-border/10 pt-1 mt-1" :
                    entry.includes("destroyed") ? "text-destructive" :
                    entry.includes("Victory") ? "text-amber-400 font-bold" :
                    "text-muted-foreground"
                  }`}
                >
                  {entry}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Skull icon alias
function Skull({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" />
      <path d="M8 20v2h8v-2" /><path d="m12.5 17-.5-1-.5 1h1z" />
      <path d="M17 20H7c-1.7 0-3-1.3-3-3v-1c0-3.9 3.1-7 7-7h2c3.9 0 7 3.1 7 7v1c0 1.7-1.3 3-3 3z" />
    </svg>
  );
}

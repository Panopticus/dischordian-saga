import { useGameAreaBGM } from "@/contexts/GameAudioContext";
/* ═══════════════════════════════════════════════════════
   RESEARCH MINIGAME — Decrypt, Connect, Sequence
   Solve puzzles to unlock hidden Loredex entries.
   Three puzzle types: Cipher Decode, Connection Web, Timeline Sequence
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { useLoredex, type LoredexEntry, type Relationship } from "@/contexts/LoredexContext";
import { useGamification } from "@/contexts/GamificationContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, Lock, Unlock, Brain, Zap, Link2, Clock,
  RotateCcw, CheckCircle2, XCircle, ArrowRight, Eye,
  Sparkles, Shield, Star, Trophy, HelpCircle, KeyRound
} from "lucide-react";
import { toast } from "sonner";

/* ═══ TYPES ═══ */
type PuzzleType = "cipher" | "connection" | "timeline";
type GameState = "menu" | "playing" | "success" | "failure";

interface CipherPuzzle {
  type: "cipher";
  targetEntry: LoredexEntry;
  hint: string;
  encryptedName: string;
  revealedLetters: Set<string>;
  guessedLetters: Set<string>;
  maxWrong: number;
  wrongCount: number;
}

interface ConnectionPuzzle {
  type: "connection";
  pairs: Array<{ character: string; connection: string; relType: string }>;
  shuffledConnections: string[];
  userMatches: Record<string, string>;
  correctCount: number;
}

interface TimelinePuzzle {
  type: "timeline";
  entries: Array<{ name: string; era: string; eraIndex: number; id: string }>;
  userOrder: string[];
  correctOrder: string[];
  attempts: number;
  maxAttempts: number;
}

type Puzzle = CipherPuzzle | ConnectionPuzzle | TimelinePuzzle;

/* ═══ ERA ORDER FOR TIMELINE ═══ */
const ERA_ORDER = [
  "Epoch Zero",
  "Genesis",
  "First Epoch",
  "Consolidation",
  "Expansion",
  "Golden Age",
  "Early Empire",
  "Late Empire",
  "Pre-Creation / Late Empire",
  "Pre-Fall",
  "Fall Era",
  "The Fall of Reality",
  "Age of Revelation",
  "Insurgency Rising",
  "Age of the Potentials",
];

/* ═══ PUZZLE GENERATORS ═══ */
function generateCipherPuzzle(entries: LoredexEntry[], discoveredIds: Set<string>): CipherPuzzle | null {
  // Pick an undiscovered character (or any character if all discovered)
  const characters = entries.filter(e => e.type === "character" && e.bio && e.bio.length > 50);
  const undiscovered = characters.filter(e => !discoveredIds.has(e.id));
  const pool = undiscovered.length > 0 ? undiscovered : characters;
  if (pool.length === 0) return null;

  const target = pool[Math.floor(Math.random() * pool.length)];
  const name = target.name.toUpperCase();

  // Create hint from bio (first sentence, redacted)
  const bioSentences = (target.bio || "").split(/\.\s+/);
  const hint = bioSentences[0]
    ? bioSentences[0].replace(new RegExp(target.name, "gi"), "[REDACTED]").substring(0, 120) + "..."
    : target.affiliation || target.era || "Unknown entity";

  // Encrypt the name: show spaces and punctuation, hide letters
  const encrypted = name.split("").map(c => /[A-Z]/.test(c) ? "█" : c).join("");

  return {
    type: "cipher",
    targetEntry: target,
    hint,
    encryptedName: encrypted,
    revealedLetters: new Set<string>(),
    guessedLetters: new Set<string>(),
    maxWrong: 6,
    wrongCount: 0,
  };
}

function generateConnectionPuzzle(
  entries: LoredexEntry[],
  relationships: Relationship[]
): ConnectionPuzzle | null {
  // Find characters with known connections
  const characters = entries.filter(
    e => e.type === "character" && e.connections && e.connections.length > 0
  );
  if (characters.length < 4) return null;

  // Pick 4-5 random characters and one of their connections
  const shuffled = [...characters].sort(() => Math.random() - 0.5);
  const pairs: Array<{ character: string; connection: string; relType: string }> = [];
  const usedConnections = new Set<string>();

  for (const char of shuffled) {
    if (pairs.length >= 5) break;
    const conns = (char.connections || []).filter(c => !usedConnections.has(c));
    if (conns.length === 0) continue;
    const conn = conns[Math.floor(Math.random() * conns.length)];

    // Find relationship type
    const rel = relationships.find(
      r => (r.source === char.name && r.target === conn) ||
           (r.target === char.name && r.source === conn)
    );
    const relType = rel?.relationship_type || "connected_to";

    pairs.push({ character: char.name, connection: conn, relType });
    usedConnections.add(conn);
  }

  if (pairs.length < 3) return null;

  const shuffledConnections = pairs.map(p => p.connection).sort(() => Math.random() - 0.5);

  return {
    type: "connection",
    pairs,
    shuffledConnections,
    userMatches: {},
    correctCount: 0,
  };
}

function generateTimelinePuzzle(entries: LoredexEntry[]): TimelinePuzzle | null {
  // Pick characters from different eras
  const withEra = entries.filter(
    e => e.type === "character" && e.era && ERA_ORDER.includes(e.era)
  );
  if (withEra.length < 4) return null;

  // Pick 5 from different eras if possible
  const byEra: Record<string, LoredexEntry[]> = {};
  withEra.forEach(e => {
    const era = e.era!;
    if (!byEra[era]) byEra[era] = [];
    byEra[era].push(e);
  });

  const selected: Array<{ name: string; era: string; eraIndex: number; id: string }> = [];
  const eraKeys = Object.keys(byEra).sort(() => Math.random() - 0.5);

  for (const era of eraKeys) {
    if (selected.length >= 5) break;
    const pool = byEra[era];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const eraIndex = ERA_ORDER.indexOf(era);
    if (eraIndex >= 0 && !selected.find(s => s.id === pick.id)) {
      selected.push({ name: pick.name, era, eraIndex, id: pick.id });
    }
  }

  if (selected.length < 4) return null;

  const correctOrder = [...selected].sort((a, b) => a.eraIndex - b.eraIndex).map(s => s.id);
  const userOrder = [...selected].sort(() => Math.random() - 0.5).map(s => s.id);

  return {
    type: "timeline",
    entries: selected,
    userOrder,
    correctOrder,
    attempts: 0,
    maxAttempts: 3,
  };
}

/* ═══ PUZZLE TYPE CARDS ═══ */
const PUZZLE_TYPES: Array<{
  type: PuzzleType;
  label: string;
  icon: typeof Brain;
  description: string;
  color: string;
  glowClass: string;
}> = [
  {
    type: "cipher",
    label: "CIPHER DECODE",
    icon: KeyRound,
    description: "Decrypt a classified entity name from redacted intelligence files. Guess letters to reveal the hidden identity.",
    color: "text-primary",
    glowClass: "box-glow-cyan",
  },
  {
    type: "connection",
    label: "CONNECTION WEB",
    icon: Link2,
    description: "Match operatives to their known connections. The conspiracy board holds the answers.",
    color: "text-accent",
    glowClass: "box-glow-amber",
  },
  {
    type: "timeline",
    label: "TIMELINE SEQUENCE",
    icon: Clock,
    description: "Arrange characters in chronological order by their era. History reveals the pattern.",
    color: "text-chart-4",
    glowClass: "box-glow-purple",
  },
];

/* ═══ KEYBOARD LAYOUT ═══ */
const KEYBOARD_ROWS = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  "ZXCVBNM".split(""),
];

/* ═══ MAIN COMPONENT ═══ */
export default function ResearchMinigamePage() {
  const { entries, relationships, discoverEntry: loredexDiscover } = useLoredex();
  const { discoverEntry: gamifDiscover, xp, level, title } = useGamification();
  useGameAreaBGM("research_cipher");
  const [gameState, setGameState] = useState<GameState>("menu");
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [selectedPuzzleType, setSelectedPuzzleType] = useState<PuzzleType>("cipher");
  const [puzzlesSolved, setPuzzlesSolved] = useState(() => {
    const saved = localStorage.getItem("research_puzzles_solved");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [entriesUnlocked, setEntriesUnlocked] = useState<string[]>(() => {
    const saved = localStorage.getItem("research_entries_unlocked");
    return saved ? JSON.parse(saved) : [];
  });
  // For connection puzzle: which character is selected for matching
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  // For timeline puzzle: which item is being dragged
  const [dragItem, setDragItem] = useState<string | null>(null);

  const { discoveredIds } = useLoredex();

  // Save progress
  useEffect(() => {
    localStorage.setItem("research_puzzles_solved", String(puzzlesSolved));
  }, [puzzlesSolved]);
  useEffect(() => {
    localStorage.setItem("research_entries_unlocked", JSON.stringify(entriesUnlocked));
  }, [entriesUnlocked]);

  /* ─── START PUZZLE ─── */
  const startPuzzle = useCallback((type: PuzzleType) => {
    let newPuzzle: Puzzle | null = null;

    switch (type) {
      case "cipher":
        newPuzzle = generateCipherPuzzle(entries, discoveredIds);
        break;
      case "connection":
        newPuzzle = generateConnectionPuzzle(entries, relationships);
        break;
      case "timeline":
        newPuzzle = generateTimelinePuzzle(entries);
        break;
    }

    if (!newPuzzle) {
      toast.error("Unable to generate puzzle. Try a different type.");
      return;
    }

    setPuzzle(newPuzzle);
    setGameState("playing");
    setSelectedCharacter(null);
    setDragItem(null);
  }, [entries, relationships, discoveredIds]);

  /* ─── CIPHER: GUESS LETTER ─── */
  const guessLetter = useCallback((letter: string) => {
    if (!puzzle || puzzle.type !== "cipher") return;
    if (puzzle.guessedLetters.has(letter)) return;

    const targetName = puzzle.targetEntry.name.toUpperCase();
    const isCorrect = targetName.includes(letter);

    const newGuessed = new Set(puzzle.guessedLetters);
    newGuessed.add(letter);

    const newRevealed = new Set(puzzle.revealedLetters);
    if (isCorrect) newRevealed.add(letter);

    const newWrong = isCorrect ? puzzle.wrongCount : puzzle.wrongCount + 1;

    // Check win: all letters revealed
    const allRevealed = targetName.split("").every(
      c => !/[A-Z]/.test(c) || newRevealed.has(c)
    );

    // Check loss
    const lost = newWrong >= puzzle.maxWrong;

    setPuzzle({
      ...puzzle,
      guessedLetters: newGuessed,
      revealedLetters: newRevealed,
      wrongCount: newWrong,
    });

    if (allRevealed) {
      handlePuzzleSuccess(puzzle.targetEntry);
    } else if (lost) {
      setGameState("failure");
    }
  }, [puzzle]);

  /* ─── CONNECTION: MATCH ─── */
  const matchConnection = useCallback((connection: string) => {
    if (!puzzle || puzzle.type !== "connection" || !selectedCharacter) return;

    const pair = puzzle.pairs.find(p => p.character === selectedCharacter);
    if (!pair) return;

    const isCorrect = pair.connection === connection;
    const newMatches = { ...puzzle.userMatches, [selectedCharacter]: connection };
    const newCorrect = isCorrect ? puzzle.correctCount + 1 : puzzle.correctCount;

    if (isCorrect) {
      toast.success(`Correct! ${selectedCharacter} → ${connection}`);
    } else {
      toast.error(`Wrong connection for ${selectedCharacter}`);
    }

    setPuzzle({
      ...puzzle,
      userMatches: newMatches,
      correctCount: newCorrect,
    });
    setSelectedCharacter(null);

    // Check if all matched
    if (Object.keys(newMatches).length === puzzle.pairs.length) {
      if (newCorrect >= Math.ceil(puzzle.pairs.length * 0.6)) {
        // Pick a random entry to unlock
        const chars = entries.filter(e => e.type === "character" && !discoveredIds.has(e.id));
        const target = chars.length > 0 ? chars[Math.floor(Math.random() * chars.length)] : puzzle.pairs[0] ? entries.find(e => e.name === puzzle.pairs[0].character) : null;
        if (target) handlePuzzleSuccess(target);
        else {
          setPuzzlesSolved(p => p + 1);
          setGameState("success");
          toast.success("All connections mapped!");
        }
      } else {
        setGameState("failure");
      }
    }
  }, [puzzle, selectedCharacter, entries, discoveredIds]);

  /* ─── TIMELINE: SWAP ─── */
  const swapTimelineItems = useCallback((fromId: string, toId: string) => {
    if (!puzzle || puzzle.type !== "timeline") return;

    const newOrder = [...puzzle.userOrder];
    const fromIdx = newOrder.indexOf(fromId);
    const toIdx = newOrder.indexOf(toId);
    if (fromIdx === -1 || toIdx === -1) return;

    [newOrder[fromIdx], newOrder[toIdx]] = [newOrder[toIdx], newOrder[fromIdx]];

    setPuzzle({ ...puzzle, userOrder: newOrder });
  }, [puzzle]);

  const submitTimeline = useCallback(() => {
    if (!puzzle || puzzle.type !== "timeline") return;

    const isCorrect = puzzle.userOrder.every((id, i) => id === puzzle.correctOrder[i]);
    const newAttempts = puzzle.attempts + 1;

    if (isCorrect) {
      const target = entries.find(e => e.id === puzzle.entries[0]?.id);
      if (target) handlePuzzleSuccess(target);
      else {
        setPuzzlesSolved(p => p + 1);
        setGameState("success");
      }
    } else if (newAttempts >= puzzle.maxAttempts) {
      setGameState("failure");
    } else {
      toast.error(`Incorrect order. ${puzzle.maxAttempts - newAttempts} attempts remaining.`);
      setPuzzle({ ...puzzle, attempts: newAttempts });
    }
  }, [puzzle, entries]);

  /* ─── SUCCESS HANDLER ─── */
  const handlePuzzleSuccess = useCallback((entry: LoredexEntry) => {
    setPuzzlesSolved(p => p + 1);
    setGameState("success");

    // Discover the entry in both contexts
    loredexDiscover(entry.id);
    gamifDiscover(entry.id);

    if (!entriesUnlocked.includes(entry.id)) {
      setEntriesUnlocked(prev => [...prev, entry.id]);
    }

    toast.success(`INTEL DECRYPTED: ${entry.name} unlocked!`);
  }, [loredexDiscover, gamifDiscover, entriesUnlocked]);

  /* ─── KEYBOARD HANDLER FOR CIPHER ─── */
  useEffect(() => {
    if (gameState !== "playing" || !puzzle || puzzle.type !== "cipher") return;

    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        guessLetter(key);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [gameState, puzzle, guessLetter]);

  /* ═══ RENDER: MENU ═══ */
  if (gameState === "menu") {
    return (
      <div className="min-h-screen pb-8 animate-fade-in">
        {/* Header */}
        <div className="border-b border-border/20 bg-card/20">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/games" className="text-muted-foreground hover:text-primary transition-colors">
                  <ChevronLeft size={18} />
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <Brain size={18} className="text-primary" />
                    <h1 className="font-display text-lg font-black tracking-wider text-foreground">
                      RESEARCH MINIGAME
                    </h1>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    Decrypt intelligence to unlock hidden Loredex entries
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-display text-xs font-bold text-primary">{puzzlesSolved}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">SOLVED</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xs font-bold text-accent">{entriesUnlocked.length}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">UNLOCKED</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 mt-6">
          {/* Intro */}
          <div className="border border-primary/20 rounded-lg bg-card/30 p-5 mb-6 box-glow-cyan">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                <Lock size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="font-display text-sm font-bold tracking-wider text-foreground mb-1">
                  CLASSIFIED INTELLIGENCE
                </h2>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                  The Architect's archives contain encrypted data on entities across the Dischordian timeline.
                  Solve research puzzles to decrypt this intelligence and add new entries to your Loredex.
                  Each puzzle type tests a different aspect of your knowledge.
                </p>
              </div>
            </div>
          </div>

          {/* Puzzle Type Selection */}
          <h3 className="font-mono text-[10px] text-muted-foreground tracking-[0.3em] mb-4">
            SELECT RESEARCH PROTOCOL
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {PUZZLE_TYPES.map((pt) => {
              const Icon = pt.icon;
              const isSelected = selectedPuzzleType === pt.type;
              return (
                <button
                  key={pt.type}
                  onClick={() => setSelectedPuzzleType(pt.type)}
                  className={`text-left p-4 rounded-lg border transition-all ${
                    isSelected
                      ? `border-primary/40 bg-primary/5 ${pt.glowClass}`
                      : "border-border/20 bg-card/20 hover:border-border/40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={16} className={pt.color} />
                    <span className={`font-display text-xs font-bold tracking-wider ${pt.color}`}>
                      {pt.label}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                    {pt.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={() => startPuzzle(selectedPuzzleType)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary/10 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/20 hover:box-glow-cyan transition-all"
            >
              <Zap size={16} />
              BEGIN RESEARCH
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Recent Unlocks */}
          {entriesUnlocked.length > 0 && (
            <div className="mt-8">
              <h3 className="font-mono text-[10px] text-muted-foreground tracking-[0.3em] mb-3">
                RECENTLY DECRYPTED ({entriesUnlocked.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {entriesUnlocked.slice(-8).reverse().map(id => {
                  const entry = entries.find(e => e.id === id);
                  if (!entry) return null;
                  return (
                    <Link
                      key={id}
                      href={`/entity/${id}`}
                      className="flex items-center gap-2 p-2 rounded-lg border border-border/20 bg-card/20 hover:border-primary/30 transition-all"
                    >
                      {entry.image ? (
                        <img src={entry.image} alt="" className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
                          <Eye size={12} className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] font-semibold truncate">{entry.name}</p>
                        <p className="font-mono text-[8px] text-muted-foreground truncate">{entry.era || entry.type}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ═══ RENDER: CIPHER PUZZLE ═══ */
  if (gameState === "playing" && puzzle?.type === "cipher") {
    const targetName = puzzle.targetEntry.name.toUpperCase();
    const displayName = targetName.split("").map(c => {
      if (!/[A-Z]/.test(c)) return c;
      return puzzle.revealedLetters.has(c) ? c : "█";
    });

    const wrongRemaining = puzzle.maxWrong - puzzle.wrongCount;

    return (
      <div className="min-h-screen pb-8 animate-fade-in">
        <div className="border-b border-border/20 bg-card/20">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setGameState("menu")} className="text-muted-foreground hover:text-primary transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-2">
                  <KeyRound size={16} className="text-primary" />
                  <span className="font-display text-sm font-bold tracking-wider">CIPHER DECODE</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: puzzle.maxWrong }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${
                      i < puzzle.wrongCount ? "bg-destructive" : "bg-primary/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 mt-6">
          {/* Intel Brief */}
          <div className="border border-primary/20 rounded-lg bg-card/30 p-4 mb-6">
            <p className="font-mono text-[10px] text-primary/60 tracking-[0.2em] mb-1">INTERCEPTED INTELLIGENCE</p>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed italic">
              "{puzzle.hint}"
            </p>
          </div>

          {/* Encrypted Name Display */}
          <div className="text-center mb-8">
            <p className="font-mono text-[10px] text-muted-foreground tracking-[0.3em] mb-3">DECRYPT TARGET IDENTITY</p>
            <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
              {displayName.map((char, i) => (
                <motion.span
                  key={i}
                  initial={puzzle.revealedLetters.has(targetName[i]) ? { scale: 1.3, color: "#33E2E6" } : {}}
                  animate={{ scale: 1, color: "inherit" }}
                  className={`inline-flex items-center justify-center w-8 h-10 sm:w-10 sm:h-12 rounded border font-display text-lg sm:text-xl font-bold ${
                    char === "█"
                      ? "border-primary/30 bg-primary/5 text-primary/30"
                      : /[A-Z]/.test(char)
                      ? "border-primary/50 bg-primary/10 text-primary glow-cyan"
                      : "border-transparent bg-transparent text-muted-foreground"
                  }`}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </div>
            <p className="font-mono text-[10px] text-muted-foreground mt-3">
              {wrongRemaining} incorrect guesses remaining
            </p>
          </div>

          {/* Keyboard */}
          <div className="space-y-2">
            {KEYBOARD_ROWS.map((row, ri) => (
              <div key={ri} className="flex justify-center gap-1 sm:gap-1.5">
                {row.map(letter => {
                  const isGuessed = puzzle.guessedLetters.has(letter);
                  const isCorrect = isGuessed && targetName.includes(letter);
                  const isWrong = isGuessed && !targetName.includes(letter);
                  return (
                    <button
                      key={letter}
                      onClick={() => guessLetter(letter)}
                      disabled={isGuessed}
                      className={`w-8 h-10 sm:w-10 sm:h-11 rounded border font-mono text-xs sm:text-sm font-bold transition-all ${
                        isCorrect
                          ? "bg-primary/20 border-primary/50 text-primary"
                          : isWrong
                          ? "bg-destructive/10 border-destructive/30 text-destructive/50"
                          : "bg-card/30 border-border/30 text-foreground hover:border-primary/40 hover:bg-primary/5"
                      } ${isGuessed ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ═══ RENDER: CONNECTION PUZZLE ═══ */
  if (gameState === "playing" && puzzle?.type === "connection") {
    const matchedConnections = new Set(Object.values(puzzle.userMatches));

    return (
      <div className="min-h-screen pb-8 animate-fade-in">
        <div className="border-b border-border/20 bg-card/20">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setGameState("menu")} className="text-muted-foreground hover:text-primary transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-2">
                  <Link2 size={16} className="text-accent" />
                  <span className="font-display text-sm font-bold tracking-wider">CONNECTION WEB</span>
                </div>
              </div>
              <div className="font-mono text-xs text-muted-foreground">
                {Object.keys(puzzle.userMatches).length}/{puzzle.pairs.length} matched
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 mt-6">
          <p className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] mb-4">
            MATCH EACH OPERATIVE TO THEIR KNOWN CONNECTION
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Characters (Left) */}
            <div className="space-y-2">
              <p className="font-mono text-[9px] text-primary/60 tracking-[0.3em] mb-2">OPERATIVES</p>
              {puzzle.pairs.map(pair => {
                const isMatched = pair.character in puzzle.userMatches;
                const isSelected = selectedCharacter === pair.character;
                const matchedTo = puzzle.userMatches[pair.character];
                const isCorrectMatch = matchedTo === pair.connection;

                return (
                  <button
                    key={pair.character}
                    onClick={() => !isMatched && setSelectedCharacter(pair.character)}
                    disabled={isMatched}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isMatched
                        ? isCorrectMatch
                          ? "border-green-500/30 bg-green-900/10 text-green-400"
                          : "border-destructive/30 bg-destructive/5 text-destructive"
                        : isSelected
                        ? "border-primary/50 bg-primary/10 text-primary box-glow-cyan"
                        : "border-border/20 bg-card/20 text-foreground hover:border-border/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold">{pair.character}</span>
                      {isMatched && (
                        isCorrectMatch
                          ? <CheckCircle2 size={14} className="text-green-400" />
                          : <XCircle size={14} className="text-destructive" />
                      )}
                    </div>
                    {isMatched && (
                      <p className="font-mono text-[9px] text-muted-foreground mt-1">
                        → {matchedTo}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Connections (Right) */}
            <div className="space-y-2">
              <p className="font-mono text-[9px] text-accent/60 tracking-[0.3em] mb-2">CONNECTIONS</p>
              {puzzle.shuffledConnections.map(conn => {
                const isUsed = matchedConnections.has(conn);
                return (
                  <button
                    key={conn}
                    onClick={() => selectedCharacter && !isUsed && matchConnection(conn)}
                    disabled={isUsed || !selectedCharacter}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isUsed
                        ? "border-border/10 bg-card/10 text-muted-foreground/40 line-through"
                        : selectedCharacter
                        ? "border-accent/30 bg-accent/5 text-accent hover:bg-accent/10 hover:box-glow-amber"
                        : "border-border/20 bg-card/20 text-muted-foreground"
                    }`}
                  >
                    <span className="font-mono text-xs font-semibold">{conn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedCharacter && (
            <p className="font-mono text-[10px] text-primary text-center mt-4 animate-pulse">
              Select a connection for {selectedCharacter}
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ═══ RENDER: TIMELINE PUZZLE ═══ */
  if (gameState === "playing" && puzzle?.type === "timeline") {
    const entryMap = new Map(puzzle.entries.map(e => [e.id, e]));

    return (
      <div className="min-h-screen pb-8 animate-fade-in">
        <div className="border-b border-border/20 bg-card/20">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setGameState("menu")} className="text-muted-foreground hover:text-primary transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-chart-4" />
                  <span className="font-display text-sm font-bold tracking-wider">TIMELINE SEQUENCE</span>
                </div>
              </div>
              <div className="font-mono text-xs text-muted-foreground">
                Attempt {puzzle.attempts + 1}/{puzzle.maxAttempts}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 mt-6">
          <p className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] mb-2">
            ARRANGE OPERATIVES IN CHRONOLOGICAL ORDER (EARLIEST → LATEST)
          </p>
          <p className="font-mono text-[9px] text-chart-4/60 mb-4">
            Tap two entries to swap their positions
          </p>

          <div className="space-y-2 mb-6">
            {puzzle.userOrder.map((id, idx) => {
              const entry = entryMap.get(id);
              if (!entry) return null;
              const isDragging = dragItem === id;

              return (
                <motion.button
                  key={id}
                  layout
                  onClick={() => {
                    if (!dragItem) {
                      setDragItem(id);
                    } else if (dragItem === id) {
                      setDragItem(null);
                    } else {
                      swapTimelineItems(dragItem, id);
                      setDragItem(null);
                    }
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ${
                    isDragging
                      ? "border-chart-4/50 bg-chart-4/10 box-glow-purple"
                      : dragItem
                      ? "border-chart-4/20 bg-card/30 hover:border-chart-4/40"
                      : "border-border/20 bg-card/20 hover:border-border/40"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-display ${
                    isDragging ? "bg-chart-4/20 text-chart-4" : "bg-secondary text-muted-foreground"
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-semibold">{entry.name}</p>
                    <p className="font-mono text-[9px] text-muted-foreground">Era hint: {entry.era.charAt(0)}{"•".repeat(entry.era.length - 2)}{entry.era.charAt(entry.era.length - 1)}</p>
                  </div>
                  {isDragging && (
                    <span className="font-mono text-[9px] text-chart-4 animate-pulse">TAP TO SWAP</span>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={submitTimeline}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-chart-4/10 border border-chart-4/40 text-chart-4 font-mono text-sm hover:bg-chart-4/20 transition-all"
            >
              <CheckCircle2 size={14} />
              SUBMIT ORDER
            </button>
            <button
              onClick={() => {
                const shuffled = [...puzzle.userOrder].sort(() => Math.random() - 0.5);
                setPuzzle({ ...puzzle, userOrder: shuffled });
                setDragItem(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card/30 border border-border/30 text-muted-foreground font-mono text-xs hover:text-foreground transition-all"
            >
              <RotateCcw size={12} />
              SHUFFLE
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ═══ RENDER: SUCCESS ═══ */
  if (gameState === "success") {
    const unlockedEntry = puzzle?.type === "cipher" ? puzzle.targetEntry : null;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="border border-primary/30 rounded-lg bg-card/40 p-8 box-glow-cyan">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Unlock size={48} className="mx-auto text-primary mb-4" />
            </motion.div>
            <h2 className="font-display text-xl font-black tracking-wider text-primary glow-cyan mb-2">
              INTEL DECRYPTED
            </h2>
            <p className="font-mono text-xs text-muted-foreground mb-4">
              Research protocol successful. New data added to Loredex.
            </p>

            {unlockedEntry && (
              <Link
                href={`/entity/${unlockedEntry.id}`}
                className="block p-3 rounded-lg border border-primary/20 bg-primary/5 mb-4 hover:bg-primary/10 transition-all"
              >
                <div className="flex items-center gap-3 justify-center">
                  {unlockedEntry.image && (
                    <img src={unlockedEntry.image} alt="" className="w-10 h-10 rounded object-cover" />
                  )}
                  <div className="text-left">
                    <p className="font-display text-sm font-bold text-primary">{unlockedEntry.name}</p>
                    <p className="font-mono text-[9px] text-muted-foreground">{unlockedEntry.era} • {unlockedEntry.type}</p>
                  </div>
                </div>
              </Link>
            )}

            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles size={14} className="text-accent" />
              <span className="font-mono text-xs text-accent">+5 XP earned</span>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => startPuzzle(selectedPuzzleType)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary/10 border border-primary/40 text-primary font-mono text-xs hover:bg-primary/20 transition-all"
              >
                <Zap size={14} />
                NEXT PUZZLE
              </button>
              <button
                onClick={() => setGameState("menu")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-card/30 border border-border/30 text-muted-foreground font-mono text-xs hover:text-foreground transition-all"
              >
                MENU
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ═══ RENDER: FAILURE ═══ */
  if (gameState === "failure") {
    const revealName = puzzle?.type === "cipher" ? puzzle.targetEntry.name : null;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="border border-destructive/30 rounded-lg bg-card/40 p-8 box-glow-red">
            <XCircle size={48} className="mx-auto text-destructive mb-4" />
            <h2 className="font-display text-xl font-black tracking-wider text-destructive glow-red mb-2">
              DECRYPTION FAILED
            </h2>
            <p className="font-mono text-xs text-muted-foreground mb-4">
              Intelligence remains classified. Try again, Operative.
            </p>

            {revealName && (
              <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/5 mb-4">
                <p className="font-mono text-[10px] text-muted-foreground mb-1">THE ANSWER WAS:</p>
                <p className="font-display text-lg font-bold text-foreground">{revealName}</p>
              </div>
            )}

            {puzzle?.type === "timeline" && (
              <div className="p-3 rounded-lg border border-chart-4/20 bg-chart-4/5 mb-4 text-left">
                <p className="font-mono text-[10px] text-muted-foreground mb-2">CORRECT ORDER:</p>
                {puzzle.correctOrder.map((id, i) => {
                  const entry = puzzle.entries.find(e => e.id === id);
                  return entry ? (
                    <p key={id} className="font-mono text-xs text-foreground">
                      {i + 1}. {entry.name} <span className="text-chart-4/60">({entry.era})</span>
                    </p>
                  ) : null;
                })}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => startPuzzle(selectedPuzzleType)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-destructive/10 border border-destructive/40 text-destructive font-mono text-xs hover:bg-destructive/20 transition-all"
              >
                <RotateCcw size={14} />
                TRY AGAIN
              </button>
              <button
                onClick={() => setGameState("menu")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-card/30 border border-border/30 text-muted-foreground font-mono text-xs hover:text-foreground transition-all"
              >
                MENU
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}

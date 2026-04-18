/**
 * HackingPuzzle — BioShock-style pipe-connect hacking minigame for Engineering Bay.
 *
 * Rotate pipe segments on a 5x5 grid to connect power from a source node (left)
 * to a target node (right). Procedurally generated puzzles are always solvable.
 * Timer counts down — solve before lockout. Powered pipes glow cyan; unpowered
 * pipes stay dim gray. Victory flashes gold, failure flashes red.
 */
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, ShieldAlert } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { dispatchVoiceWhisper } from "@/components/VoiceWhisper";

/* ═══ PROPS ═══ */
interface HackingPuzzleProps {
  onComplete: (won: boolean, timeRemaining: number) => void;
  onClose: () => void;
  difficulty?: "normal" | "hard" | "expert";
}

/* ═══ CONSTANTS ═══ */
const GRID = 5;
const TIMERS: Record<string, number> = { normal: 60, hard: 45, expert: 30 };

/* ═══ EPOCH-THEMED PUZZLE THEMES ═══ */
interface EpochPuzzleTheme {
  name: string;
  description: string;
  timerModifier: number;
  visualTheme: string;
}

const EPOCH_PUZZLE_THEMES: Record<string, EpochPuzzleTheme> = {
  "age-of-privacy": {
    name: "Watcher Protocol",
    description: "Surveillance-era decryption under The Eyes' watchful gaze",
    timerModifier: 0.8,
    visualTheme: "green-tinted CRT aesthetic",
  },
  "age-of-prophecy": {
    name: "Prophet's Code",
    description: "Ancient cipher patterns foreseen by the Seers",
    timerModifier: 1.0,
    visualTheme: "purple mystical aesthetic",
  },
  "age-of-insurgency": {
    name: "Rebel Hack",
    description: "Field-grade intrusion tools forged by the resistance",
    timerModifier: 0.9,
    visualTheme: "orange/military aesthetic",
  },
  "age-of-revelation": {
    name: "Truth Circuit",
    description: "All firewalls crumble as hidden truths surface",
    timerModifier: 1.2,
    visualTheme: "red revelation aesthetic",
  },
  "fall-of-reality": {
    name: "Void Breach",
    description: "Reality fractures — the grid itself is unstable",
    timerModifier: 0.7,
    visualTheme: "glitching/fracturing aesthetic",
  },
};

/** Return today's epoch puzzle theme based on day of the week. */
function getDailyPuzzleTheme(): EpochPuzzleTheme {
  const dayOfWeek = new Date().getDay(); // 0=Sun ... 6=Sat
  const epochsByDay: Record<number, string> = {
    1: "age-of-privacy",
    2: "age-of-prophecy",
    3: "age-of-insurgency",
    4: "age-of-revelation",
    5: "fall-of-reality",
  };
  let epochId: string;
  if (epochsByDay[dayOfWeek]) {
    epochId = epochsByDay[dayOfWeek];
  } else {
    // Weekend: pick a random epoch seeded by the date so it's stable for the day
    const dayIndex = Math.floor(Date.now() / 86400000);
    const epochKeys = Object.keys(EPOCH_PUZZLE_THEMES);
    epochId = epochKeys[dayIndex % epochKeys.length];
  }
  return EPOCH_PUZZLE_THEMES[epochId];
}

// Directions: top=0, right=1, bottom=2, left=3
type Dir = 0 | 1 | 2 | 3;
const OPP: Record<Dir, Dir> = { 0: 2, 1: 3, 2: 0, 3: 1 };
const DR: Record<Dir, [number, number]> = { 0: [-1, 0], 1: [0, 1], 2: [1, 0], 3: [0, -1] };

type TileKind = "straight" | "corner" | "tjunction" | "cross" | "empty" | "source" | "target";
interface Tile { kind: TileKind; rotation: number; }
type GameState = "playing" | "won" | "lost";

/* ═══ CONNECTION TABLES ═══ */
const BASE_CONN: Record<TileKind, Dir[]> = {
  straight: [0, 2],       // vertical: top-bottom
  corner: [0, 1],         // top-right
  tjunction: [0, 1, 2],   // top-right-bottom
  cross: [0, 1, 2, 3],
  empty: [],
  source: [1],            // right only
  target: [3],            // left only
};

function getConns(tile: Tile): Set<Dir> {
  return new Set(BASE_CONN[tile.kind].map((d) => ((d + tile.rotation) % 4) as Dir));
}

/* ═══ PROCEDURAL GENERATION ═══ */
function randInt(n: number) { return Math.floor(Math.random() * n); }

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function tileForSides(a: Dir, b: Dir): Tile {
  const diff = ((b - a + 4) % 4);
  // Opposite sides -> straight
  if (diff === 2) return { kind: "straight", rotation: a };
  // Adjacent sides -> corner. Base corner connects {0,1}. Rotate until it fits.
  for (let r = 0; r < 4; r++) {
    const s0 = (r % 4) as Dir, s1 = ((1 + r) % 4) as Dir;
    if ((s0 === a && s1 === b) || (s0 === b && s1 === a)) {
      return { kind: "corner", rotation: r };
    }
  }
  // Fallback: T-junction
  for (let r = 0; r < 4; r++) {
    const set = new Set(BASE_CONN.tjunction.map((d) => (d + r) % 4));
    if (set.has(a) && set.has(b)) return { kind: "tjunction", rotation: r };
  }
  return { kind: "cross", rotation: 0 };
}

function dirBetween(from: [number, number], to: [number, number]): Dir {
  const dr = to[0] - from[0], dc = to[1] - from[1];
  if (dr === -1) return 0;
  if (dc === 1) return 1;
  if (dr === 1) return 2;
  return 3;
}

function generatePuzzle(): Tile[][] {
  const grid: Tile[][] = Array.from({ length: GRID }, () =>
    Array.from({ length: GRID }, (): Tile => ({ kind: "empty", rotation: 0 })),
  );
  const mid = Math.floor(GRID / 2);
  grid[mid][0] = { kind: "source", rotation: 0 };
  grid[mid][GRID - 1] = { kind: "target", rotation: 0 };

  // Build a guaranteed path from (mid,1) to (mid, GRID-2) using random walk
  const path: [number, number][] = [];
  const vis = new Set<string>([`${mid},0`, `${mid},${GRID - 1}`]);

  // Use DFS with backtracking to find a path
  const stack: [number, number][] = [[mid, 1]];
  const parent = new Map<string, [number, number] | null>();
  parent.set(`${mid},1`, null);
  vis.add(`${mid},1`);
  let found = false;

  while (stack.length > 0 && !found) {
    const [r, c] = stack[stack.length - 1];
    // Check if we're adjacent to target column
    if (c === GRID - 2) {
      // Check if we can reach target row from here
      // Build path by tracing parents
      found = true;
      break;
    }
    // Find an unvisited neighbor, prefer rightward
    const dirs = shuffle([0, 1, 2, 3] as Dir[]);
    dirs.sort((a, b) => (a === 1 ? -1 : b === 1 ? 1 : 0)); // bias right
    let pushed = false;
    for (const dir of dirs) {
      const [dr, dc] = DR[dir];
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= GRID || nc <= 0 || nc >= GRID - 1) continue;
      const key = `${nr},${nc}`;
      if (vis.has(key)) continue;
      vis.add(key);
      parent.set(key, [r, c]);
      stack.push([nr, nc]);
      pushed = true;
      break;
    }
    if (!pushed) stack.pop();
  }

  // Reconstruct path
  if (found) {
    let cur: [number, number] | null = stack[stack.length - 1];
    while (cur) {
      path.unshift(cur);
      cur = parent.get(`${cur[0]},${cur[1]}`) ?? null;
    }
  }

  // If path doesn't end at target row, extend vertically
  if (path.length > 0) {
    const last = path[path.length - 1];
    let r = last[0];
    const c = last[1]; // should be GRID-2
    while (r !== mid) {
      const step: [number, number] = [r < mid ? r + 1 : r - 1, c];
      path.push(step);
      r = step[0];
    }
  }

  // Assign pipe types along the path
  for (let i = 0; i < path.length; i++) {
    const [pr, pc] = path[i];
    // Entry side: direction FROM which we enter this tile
    const entryDir: Dir = i === 0
      ? 3  // entering from source (left side)
      : OPP[dirBetween(path[i - 1], path[i])];
    // Exit side: direction TO which we leave this tile
    const exitDir: Dir = i === path.length - 1
      ? 1  // exiting toward target (right side)
      : dirBetween(path[i], path[i + 1]);
    grid[pr][pc] = tileForSides(entryDir, exitDir);
  }

  // Fill remaining empty tiles with random pipes
  const kinds: TileKind[] = ["straight", "corner", "tjunction", "cross"];
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      if (grid[r][c].kind === "empty") {
        grid[r][c] = { kind: kinds[randInt(kinds.length)], rotation: randInt(4) };
      }
    }
  }

  // Scramble path tiles so the player must solve it
  for (const [pr, pc] of path) {
    const tile = grid[pr][pc];
    // Rotate randomly but ensure it's NOT already in the solved orientation
    const orig = tile.rotation;
    let rot = randInt(4);
    if (tile.kind !== "cross") {
      while (rot === orig) rot = randInt(4);
    }
    grid[pr][pc] = { ...tile, rotation: rot };
  }

  return grid;
}

/* ═══ FLOW DETECTION (BFS) ═══ */
function computePowered(grid: Tile[][]): boolean[][] {
  const powered = Array.from({ length: GRID }, () => Array<boolean>(GRID).fill(false));
  const mid = Math.floor(GRID / 2);
  powered[mid][0] = true;
  const queue: [number, number][] = [[mid, 0]];

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const conns = getConns(grid[r][c]);
    for (const dir of conns) {
      const [dr, dc] = DR[dir];
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= GRID || nc < 0 || nc >= GRID) continue;
      if (powered[nr][nc]) continue;
      if (getConns(grid[nr][nc]).has(OPP[dir])) {
        powered[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }
  return powered;
}

/* ═══ TILE SVG COMPONENT ═══ */
const SZ = 64;
const H = SZ / 2;
const W = 10;

function PipeTile({ tile, powered, onClick, frozen }: {
  tile: Tile; powered: boolean; onClick: () => void; frozen: boolean;
}) {
  const col = powered ? "var(--energy-primary)" : "#4b5563";
  const glow = powered ? "drop-shadow(0 0 6px var(--energy-primary))" : "none";
  const isFixed = tile.kind === "source" || tile.kind === "target";

  const pipe = (() => {
    switch (tile.kind) {
      case "straight":
        return <rect x={H - W / 2} y={0} width={W} height={SZ} fill={col} rx={2} />;
      case "corner":
        return (
          <path d={`M${H},0 L${H},${H} L${SZ},${H}`}
            stroke={col} strokeWidth={W} fill="none" strokeLinecap="round" />
        );
      case "tjunction":
        return (<>
          <rect x={H - W / 2} y={0} width={W} height={SZ} fill={col} rx={2} />
          <rect x={H} y={H - W / 2} width={H} height={W} fill={col} rx={2} />
        </>);
      case "cross":
        return (<>
          <rect x={H - W / 2} y={0} width={W} height={SZ} fill={col} rx={2} />
          <rect x={0} y={H - W / 2} width={SZ} height={W} fill={col} rx={2} />
        </>);
      case "source":
        return (<>
          <circle cx={H} cy={H} r={14} fill="none" stroke="var(--energy-success)" strokeWidth={3} />
          <circle cx={H} cy={H} r={7} fill="var(--energy-success)" opacity={0.8} />
          <rect x={H} y={H - W / 2} width={H} height={W} fill="var(--energy-success)" rx={2} />
        </>);
      case "target":
        return (<>
          <circle cx={H} cy={H} r={14} fill="none" stroke="var(--energy-accent)" strokeWidth={3} />
          <circle cx={H} cy={H} r={7} fill="var(--energy-accent)" opacity={0.8} />
          <rect x={0} y={H - W / 2} width={H} height={W} fill="var(--energy-accent)" rx={2} />
        </>);
      default: return null;
    }
  })();

  return (
    <motion.svg
      width={SZ} height={SZ} viewBox={`0 0 ${SZ} ${SZ}`}
      onClick={frozen || isFixed ? undefined : onClick}
      whileTap={frozen || isFixed ? undefined : { scale: 0.9 }}
      style={{
        cursor: frozen || isFixed ? "default" : "pointer",
        filter: glow,
        background: "rgba(30, 27, 75, 0.6)",
        border: "1px solid rgba(99, 102, 241, 0.25)",
        borderRadius: 4,
      }}
    >
      <g transform={`rotate(${isFixed ? 0 : tile.rotation * 90}, ${H}, ${H})`}>
        {pipe}
      </g>
    </motion.svg>
  );
}

/* ═══ MAIN COMPONENT ═══ */
export default function HackingPuzzle({
  onComplete,
  onClose,
  difficulty = "normal",
}: HackingPuzzleProps) {
  const timeLimit = TIMERS[difficulty];
  const [grid, setGrid] = useState<Tile[][]>(() => generatePuzzle());
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [gameState, setGameState] = useState<GameState>("playing");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Audit 2H — puzzle_attempt whisper fires once on mount. Any
  // skill (tactics / perception / craftsmanship) with a registered
  // puzzle_attempt utterance surfaces a hint. No-op when no match.
  const { state: gameCtxState } = useGame();
  useEffect(() => {
    dispatchVoiceWhisper(
      { type: "puzzle_attempt", puzzleId: "hacking" },
      (gameCtxState.innerVoiceSkills ?? {}) as Record<string, number>,
    );
    // Mount-once — intentionally empty deps. Re-triggers on puzzle
    // restart would require unmounting + remounting this component,
    // which the parent already does via onClose/navigate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const powered = useMemo(() => computePowered(grid), [grid]);
  const mid = Math.floor(GRID / 2);
  const solved = powered[mid][GRID - 1];

  // Win detection
  useEffect(() => {
    if (solved && gameState === "playing") {
      setGameState("won");
      if (timerRef.current) clearInterval(timerRef.current);
      onComplete(true, timeLeft);
    }
  }, [solved, gameState, timeLeft, onComplete]);

  // Countdown timer
  useEffect(() => {
    if (gameState !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameState("lost");
          onComplete(false, 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState, onComplete]);

  // Rotate a tile 90 degrees clockwise
  const rotateTile = useCallback((r: number, c: number) => {
    if (gameState !== "playing") return;
    setGrid((prev) => {
      const next = prev.map((row) => row.map((t) => ({ ...t })));
      next[r][c].rotation = (next[r][c].rotation + 1) % 4;
      return next;
    });
  }, [gameState]);

  const pct = timeLeft / timeLimit;
  const barCol = pct > 0.5 ? "var(--energy-success)" : pct > 0.25 ? "var(--energy-accent)" : "var(--energy-error)";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(15, 12, 41, 0.92)", backdropFilter: "blur(8px)",
      }}
    >
      {/* Background art */}
      <img src="/art/minigames/minigame-hacking-pipes.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.12, filter: "brightness(0.4) saturate(0.6)", pointerEvents: "none" }} />
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #0f0a2e 100%)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          borderRadius: 16, padding: 24, position: "relative",
          boxShadow: "0 0 60px rgba(99, 102, 241, 0.15)",
          minWidth: 420,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Zap size={20} color="var(--energy-primary)" />
            <span style={{ color: "#e0e7ff", fontWeight: 700, fontSize: 18 }}>POWER GRID HACK</span>
            <span style={{
              fontSize: 11, padding: "2px 8px", borderRadius: 8,
              background: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc",
            }}>
              {difficulty.toUpperCase()}
            </span>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer", color: "#6366f1",
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Timer bar */}
        <div style={{
          height: 6, borderRadius: 3, background: "rgba(99, 102, 241, 0.15)",
          marginBottom: 16, overflow: "hidden",
        }}>
          <motion.div
            animate={{ width: `${pct * 100}%` }}
            transition={{ duration: 0.4 }}
            style={{ height: "100%", borderRadius: 3, background: barCol }}
          />
        </div>
        <div style={{
          color: barCol, fontSize: 13, textAlign: "right",
          marginBottom: 12, fontFamily: "monospace",
        }}>
          {timeLeft}s
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID}, ${SZ}px)`,
          gap: 3, justifyContent: "center", marginBottom: 20,
        }}>
          {grid.flatMap((row, r) =>
            row.map((tile, c) => (
              <PipeTile
                key={`${r}-${c}`}
                tile={tile}
                powered={powered[r][c]}
                onClick={() => rotateTile(r, c)}
                frozen={gameState !== "playing"}
              />
            )),
          )}
        </div>

        {/* Hint text */}
        {gameState === "playing" && (
          <p style={{ color: "#818cf8", fontSize: 12, textAlign: "center", margin: 0, opacity: 0.7 }}>
            Click pipes to rotate. Connect{" "}
            <span style={{ color: "var(--energy-success)" }}>source</span> to{" "}
            <span style={{ color: "var(--energy-accent)" }}>target</span>.
          </p>
        )}

        {/* Win / Lose overlays */}
        <AnimatePresence>
          {gameState === "won" && (
            <motion.div
              key="win"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute", inset: 0, borderRadius: 16,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "rgba(15, 12, 41, 0.85)", backdropFilter: "blur(4px)",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Zap size={48} color="#eab308" />
              </motion.div>
              <h2 style={{ color: "#eab308", fontSize: 28, margin: "12px 0 4px", letterSpacing: 4 }}>
                SYSTEM HACKED
              </h2>
              <p style={{ color: "#a5b4fc", fontSize: 14, margin: 0 }}>
                +120 XP &middot; Time bonus: {timeLeft}s remaining
              </p>
            </motion.div>
          )}
          {gameState === "lost" && (
            <motion.div
              key="lose"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute", inset: 0, borderRadius: 16,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "rgba(41, 12, 12, 0.85)", backdropFilter: "blur(4px)",
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
              >
                <ShieldAlert size={48} color="var(--energy-error)" />
              </motion.div>
              <h2 style={{ color: "var(--energy-error)", fontSize: 28, margin: "12px 0 4px", letterSpacing: 4 }}>
                LOCKOUT
              </h2>
              <p style={{ color: "#fca5a5", fontSize: 14, margin: 0 }}>
                Security protocols engaged. Try again.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

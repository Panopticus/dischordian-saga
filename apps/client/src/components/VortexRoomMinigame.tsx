/* ═══════════════════════════════════════════════════════
   VORTEX ROOM MINIGAME COMPONENT

   Dispatches on IncursionRoomDef.type to render an
   interactive minigame for the current Vortex room:

     - puzzle   → sequence / cipher / hacking minigame
     - card     → DuelystGameUI against a canonical Vortex
                  opponent faction
     - combat / treasure / boss → themed "Clear" button
                  (richer combat minigames can replace
                  these without touching the dispatcher)

   When the player wins the minigame, onResolve("won") is
   called. On failure, onResolve("lost") fires — the caller
   decides whether a loss still advances the run.

   The puzzle state is owned by this component (it doesn't
   need to persist across reloads because the Vortex run
   store tracks room-cleared state separately).
   ═══════════════════════════════════════════════════════ */

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  Crosshair,
  Gift,
  Swords,
  Terminal,
  Brain,
  Hash,
} from "lucide-react";
import type { IncursionRoomDef } from "@shared/incursions";
import {
  getCiphertext,
  hideSequenceHint,
  setHackingByte,
  startVortexPuzzle,
  submitCipherGuess,
  submitHackingPuzzle,
  tapSequenceTile,
  type VortexCipherPuzzleState,
  type VortexHackingPuzzleState,
  type VortexPuzzleState,
  type VortexSequencePuzzleState,
} from "@shared/vortexRoomMinigame";
import DuelystGameUI from "@/game/duelyst/DuelystGameUI";
import type { Faction } from "@/game/duelyst/types";

export interface VortexRoomMinigameProps {
  roomDef: IncursionRoomDef;
  /** Deterministic seed for puzzle generation. */
  seed: number;
  /** Fires with the outcome once the room resolves. */
  onResolve: (outcome: "won" | "lost") => void;
}

export function VortexRoomMinigame({
  roomDef,
  seed,
  onResolve,
}: VortexRoomMinigameProps) {
  if (roomDef.type === "puzzle" && roomDef.puzzleVariant) {
    return (
      <PuzzleRoom
        variant={roomDef.puzzleVariant}
        seed={seed}
        onResolve={onResolve}
      />
    );
  }
  if (roomDef.type === "card") {
    return <CardRoom seed={seed} onResolve={onResolve} />;
  }
  return <SimpleRoom roomDef={roomDef} onResolve={onResolve} />;
}

/* ═══════════════════════════════════════════════════════
   PUZZLE ROOM — dispatches on variant
   ═══════════════════════════════════════════════════════ */

function PuzzleRoom({
  variant,
  seed,
  onResolve,
}: {
  variant: "sequence" | "cipher" | "hacking";
  seed: number;
  onResolve: (outcome: "won" | "lost") => void;
}) {
  const [state, setState] = useState<VortexPuzzleState>(() =>
    startVortexPuzzle(variant, seed),
  );

  // Auto-resolve once the puzzle finishes.
  useEffect(() => {
    if (state.outcome === "won") {
      const t = setTimeout(() => onResolve("won"), 650);
      return () => clearTimeout(t);
    }
    if (state.outcome === "lost") {
      const t = setTimeout(() => onResolve("lost"), 1200);
      return () => clearTimeout(t);
    }
  }, [state.outcome, onResolve]);

  return (
    <div className="rounded-md border border-violet-800/60 bg-stone-950/70 p-5">
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-violet-200">
        <Brain size={12} />
        PUZZLE · {variant.toUpperCase()}
      </div>
      {state.kind === "sequence" && (
        <SequencePuzzle state={state} setState={setState} />
      )}
      {state.kind === "cipher" && (
        <CipherPuzzle state={state} setState={setState} />
      )}
      {state.kind === "hacking" && (
        <HackingPuzzle state={state} setState={setState} />
      )}
      <OutcomeBanner outcome={state.outcome} />
    </div>
  );
}

/* ─── SEQUENCE ─── */

function SequencePuzzle({
  state,
  setState,
}: {
  state: VortexSequencePuzzleState;
  setState: (s: VortexPuzzleState) => void;
}) {
  // Auto-hide the hint after a memorization window.
  useEffect(() => {
    if (state.hintVisibleCount === 0) return;
    const memorizationMs = 600 * state.targetLength;
    const t = setTimeout(
      () => setState(hideSequenceHint(state)),
      memorizationMs,
    );
    return () => clearTimeout(t);
  }, [state, setState]);

  const hintSet = useMemo(
    () => (state.hintVisibleCount > 0 ? new Set(state.targetSequence) : new Set<number>()),
    [state.hintVisibleCount, state.targetSequence],
  );

  return (
    <div>
      <p className="mb-3 font-serif text-[13px] text-stone-200">
        {state.hintVisibleCount > 0
          ? "Memorize the sequence. The tiles will fade soon."
          : state.outcome === "pending"
          ? "Tap the tiles in the order you saw them."
          : null}
      </p>
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {Array.from({ length: 9 }).map((_, i) => {
          const highlighted = hintSet.has(i);
          const tappedCorrect = state.playerInput.includes(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => setState(tapSequenceTile(state, i))}
              disabled={state.hintVisibleCount > 0 || state.outcome !== "pending"}
              className={`aspect-square rounded border transition-all font-mono text-[11px] ${
                highlighted
                  ? "border-violet-300 bg-violet-700/50 text-violet-50 shadow-[0_0_10px_rgba(167,139,250,0.4)]"
                  : tappedCorrect
                  ? "border-emerald-400/80 bg-emerald-900/30 text-emerald-100"
                  : "border-violet-900/60 bg-stone-900/60 text-violet-300/40 hover:border-violet-700/80"
              }`}
            >
              {tappedCorrect ? "✓" : highlighted ? "●" : i + 1}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center font-mono text-[10px] text-violet-300/60">
        {state.playerInput.length} / {state.targetSequence.length}
      </p>
    </div>
  );
}

/* ─── CIPHER ─── */

function CipherPuzzle({
  state,
  setState,
}: {
  state: VortexCipherPuzzleState;
  setState: (s: VortexPuzzleState) => void;
}) {
  const [guess, setGuess] = useState("");
  const cipher = useMemo(() => getCiphertext(state), [state]);
  return (
    <div>
      <p className="mb-3 font-serif text-[13px] text-stone-200">
        Decode the intercepted transmission. It's a Caesar shift.
      </p>
      <div className="mb-3 rounded border border-violet-900/50 bg-stone-900/60 p-3 font-mono text-center">
        <p className="text-[9px] uppercase text-violet-300/50">CIPHERTEXT</p>
        <p className="mt-1 text-lg tracking-widest text-violet-100">{cipher}</p>
        <p className="mt-1 text-[9px] uppercase text-violet-300/50">
          SHIFT · {state.shift}
        </p>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={state.outcome !== "pending"}
          placeholder="DECRYPTED WORD"
          className="flex-1 rounded border border-violet-800/60 bg-stone-900/60 px-3 py-2 font-mono text-sm uppercase text-violet-100 placeholder:text-violet-300/30"
          onKeyDown={(e) => {
            if (e.key === "Enter") setState(submitCipherGuess(state, guess));
          }}
        />
        <button
          type="button"
          onClick={() => setState(submitCipherGuess(state, guess))}
          disabled={state.outcome !== "pending" || guess.trim().length === 0}
          className="rounded border border-violet-700 bg-violet-900/30 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-violet-100 hover:border-violet-500 hover:bg-violet-900/50 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          Decrypt
        </button>
      </div>
    </div>
  );
}

/* ─── HACKING ─── */

function HackingPuzzle({
  state,
  setState,
}: {
  state: VortexHackingPuzzleState;
  setState: (s: VortexPuzzleState) => void;
}) {
  return (
    <div>
      <p className="mb-3 font-serif text-[13px] text-stone-200">
        Set six hex bytes (0-F) to match the intercepted target.
      </p>
      <div className="mb-2 flex items-center justify-center gap-1 font-mono text-[10px] uppercase tracking-wider text-violet-300/60">
        <Terminal size={10} />
        TARGET &middot;{" "}
        {state.target.map((b) => b.toString(16).toUpperCase()).join(" ")}
      </div>
      <div className="mb-3 flex justify-center gap-2">
        {state.current.map((byte, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => setState(setHackingByte(state, i, byte + 1))}
              disabled={state.outcome !== "pending"}
              className="w-8 text-[10px] text-violet-300/50 hover:text-violet-100"
              aria-label={`Increment byte ${i + 1}`}
            >
              ▲
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded border border-violet-700/60 bg-stone-900/60 font-mono text-lg text-violet-100">
              {byte.toString(16).toUpperCase()}
            </div>
            <button
              type="button"
              onClick={() => setState(setHackingByte(state, i, byte - 1))}
              disabled={state.outcome !== "pending"}
              className="w-8 text-[10px] text-violet-300/50 hover:text-violet-100"
              aria-label={`Decrement byte ${i + 1}`}
            >
              ▼
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setState(submitHackingPuzzle(state))}
          disabled={state.outcome !== "pending"}
          className="rounded border border-violet-700 bg-violet-900/30 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-violet-100 hover:border-violet-500 hover:bg-violet-900/50 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Hash size={11} className="inline mr-1" />
          Breach
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CARD ROOM — routes to a full card match
   ═══════════════════════════════════════════════════════ */

const VORTEX_OPPONENT_FACTIONS: Faction[] = [
  "new_babylon",
  "thought_virus",
  "architect",
];

function pickVortexOpponentFaction(seed: number): Faction {
  const index = Math.abs(seed) % VORTEX_OPPONENT_FACTIONS.length;
  return VORTEX_OPPONENT_FACTIONS[index];
}

function CardRoom({
  seed,
  onResolve,
}: {
  seed: number;
  onResolve: (outcome: "won" | "lost") => void;
}) {
  const [picked, setPicked] = useState<Faction | null>(null);
  const opponentFaction = useMemo(
    () => pickVortexOpponentFaction(seed),
    [seed],
  );

  if (!picked) {
    return (
      <div className="rounded-md border border-violet-800/60 bg-stone-950/70 p-5">
        <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-violet-200">
          <Swords size={12} />
          DISCHORDIA DUEL
        </div>
        <p className="mb-4 font-serif text-[13px] text-stone-200">
          The Vortex has dealt a hand. Choose your faction. The opposing
          deck is already at the table.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {(
            [
              "architect",
              "dreamer",
              "insurgency",
              "new_babylon",
              "antiquarian",
              "thought_virus",
            ] as const
          ).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setPicked(f)}
              className="rounded border border-violet-900/50 bg-stone-900/40 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-violet-200 hover:border-violet-500/80 hover:bg-violet-900/30 transition-colors"
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[80] bg-black">
      <DuelystGameUI
        playerFaction={picked}
        opponentFaction={opponentFaction}
        onGameEnd={(winner) => onResolve(winner === "player" ? "won" : "lost")}
        onBack={() => onResolve("lost")}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SIMPLE ROOM — combat / treasure / boss
   ═══════════════════════════════════════════════════════ */

function SimpleRoom({
  roomDef,
  onResolve,
}: {
  roomDef: IncursionRoomDef;
  onResolve: (outcome: "won" | "lost") => void;
}) {
  const isBoss = roomDef.type === "boss";
  const isTreasure = roomDef.type === "treasure";
  const Icon = isBoss ? Crosshair : isTreasure ? Gift : Swords;
  const label = isBoss
    ? "Hold the Line"
    : isTreasure
    ? "Claim the Cache"
    : "Engage";
  return (
    <div className="rounded-md border border-violet-800/60 bg-stone-950/70 p-5">
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-violet-200">
        <Icon size={12} />
        {roomDef.type.toUpperCase()}
      </div>
      <p className="mb-4 font-serif text-[13px] text-stone-200">
        {isBoss
          ? "The room narrows. The thing at the end of it knows you. You have about one minute of breath before it moves."
          : isTreasure
          ? "The cache is unguarded. That is the strangest part of the room."
          : "The room fills with silhouettes. You know what to do."}
      </p>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onResolve("won")}
          className="flex items-center gap-2 rounded-sm border border-emerald-700/70 bg-emerald-900/20 px-5 py-2 font-mono text-[11px] uppercase tracking-wider text-emerald-100 hover:border-emerald-500/80 hover:bg-emerald-900/40 transition-colors"
        >
          <CheckCircle2 size={12} />
          {label}
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   OUTCOME BANNER — shared footer for puzzle rooms
   ═══════════════════════════════════════════════════════ */

function OutcomeBanner({ outcome }: { outcome: "pending" | "won" | "lost" }) {
  return (
    <AnimatePresence>
      {outcome !== "pending" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`mt-4 rounded border p-3 text-center font-mono text-[11px] uppercase tracking-[0.25em] ${
            outcome === "won"
              ? "border-emerald-500/70 bg-emerald-900/20 text-emerald-100"
              : "border-rose-700/70 bg-rose-950/20 text-rose-200"
          }`}
        >
          {outcome === "won" ? "BREACH · CLEAN" : "FAILURE · DETECTED"}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

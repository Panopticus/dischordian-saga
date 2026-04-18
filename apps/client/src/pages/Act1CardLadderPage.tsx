/* ═══════════════════════════════════════════════════════
   ACT 1 CARD LADDER PAGE — §4.2 / §4.3 / §4.4 / §4.5

   Playable twelve-step Dischordia ladder. Each step is a
   canonical Act 1 opponent from ACT_1_OPPONENTS. The page
   has four views:

     1. "ladder"   — the full 12-rung ladder with current
                     step highlighted + defeated steps
                     marked with the opponent's name.
     2. "matchup"  — opponent card with preMatchLine +
                     faction + "Engage" button. Also
                     offers a faction picker for the player.
     3. "battle"   — DuelystGameUI mounted full-screen.
     4. "postmatch"— win/loss narrative beat + slideshow
                     trigger + Continue.

   On win, the store advances the ladder by one step. The
   opponent's `postBattleSlideshow` (if set) fires through
   the witnessing store, and completion flags are raised on
   the game state.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Swords,
  CheckCircle2,
  Lock,
  Sparkles,
  Trophy,
  Play,
  X,
} from "lucide-react";
import { ACT_1_OPPONENTS, type Act1Opponent } from "@shared/act1Opponents";
import { getAct1OpponentDialog } from "@shared/act1OpponentDialog";
import { getNextAct1Opponent } from "@shared/witnessingRuntime";
import { useAct1LadderStore } from "@/stores/act1CardLadderStore";
import { useGame } from "@/contexts/GameContext";
import { playSlideshow } from "@/stores/witnessingStore";
import DuelystGameUI from "@/game/duelyst/DuelystGameUI";
import { Act1OpponentTauntOverlay } from "@/components/act1/Act1OpponentTauntOverlay";
import {
  FACTION_COLORS,
  FACTION_NAMES,
  type Faction,
} from "@/game/duelyst/types";
import LivingBackground from "@/components/LivingBackground";

type LadderView = "ladder" | "matchup" | "battle" | "postmatch";

const PLAYER_FACTIONS: Faction[] = [
  "architect",
  "dreamer",
  "insurgency",
  "new_babylon",
  "antiquarian",
  "thought_virus",
];

/**
 * Resolve the Act 1 opponent's faction for the card game.
 * Opponents list `deckLeaning: string[]`; we take the first
 * entry that matches a canonical Faction and fall back to
 * "neutral" otherwise.
 */
function resolveOpponentFaction(opponent: Act1Opponent): Faction {
  for (const lean of opponent.deckLeaning) {
    if (
      lean === "architect" ||
      lean === "dreamer" ||
      lean === "insurgency" ||
      lean === "new_babylon" ||
      lean === "antiquarian" ||
      lean === "thought_virus" ||
      lean === "neutral"
    ) {
      return lean as Faction;
    }
  }
  return "neutral";
}

export default function Act1CardLadderPage() {
  const { wins, losses, defeatedOpponents, recordWin, recordLoss } =
    useAct1LadderStore();
  const { setNarrativeFlag } = useGame();

  const [view, setView] = useState<LadderView>("ladder");
  const [playerFaction, setPlayerFaction] = useState<Faction | null>(null);
  const [postMatchResult, setPostMatchResult] = useState<{
    opponent: Act1Opponent;
    outcome: "win" | "loss";
  } | null>(null);

  const currentOpponent = useMemo(
    () => getNextAct1Opponent(wins),
    [wins],
  );
  const ladderComplete = currentOpponent === null;

  /* ─── HANDLERS ─── */

  const handleOpenMatchup = useCallback(() => {
    if (ladderComplete) return;
    setView("matchup");
  }, [ladderComplete]);

  const handleEngage = useCallback(() => {
    if (!playerFaction || !currentOpponent) return;
    setView("battle");
  }, [playerFaction, currentOpponent]);

  const handleGameEnd = useCallback(
    (winner: "player" | "opponent") => {
      if (!currentOpponent) return;
      if (winner === "player") {
        recordWin(currentOpponent.id);
        setNarrativeFlag(`act1_step_${currentOpponent.act1Step}_complete`, true);
        // Mark cycle beats when the player finishes Cycle A/B/C.
        if (currentOpponent.act1Step === 3) {
          setNarrativeFlag("act_1_cycle_a_complete", true);
        } else if (currentOpponent.act1Step === 8) {
          setNarrativeFlag("act_1_cycle_b_complete", true);
        } else if (currentOpponent.act1Step === 12) {
          setNarrativeFlag("act_1_complete", true);
        }
        if (currentOpponent.postBattleSlideshow) {
          try {
            playSlideshow(currentOpponent.postBattleSlideshow);
          } catch {
            /* witnessingStore may not be initialized in tests */
          }
        }
      } else {
        recordLoss(currentOpponent.id);
      }
      setPostMatchResult({ opponent: currentOpponent, outcome: winner === "player" ? "win" : "loss" });
      setView("postmatch");
    },
    [currentOpponent, recordWin, recordLoss, setNarrativeFlag],
  );

  const handlePostMatchContinue = useCallback(() => {
    setPostMatchResult(null);
    setView("ladder");
  }, []);

  /* ─── RENDER ─── */

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 to-[#0d0a05] relative">
      <LivingBackground
        src="/art/rooms/room-archives.png"
        accent="#f59e0b"
        opacity={0.1}
        particleCount={4}
        scanlines={false}
      />
      <div className="relative z-10">
        {/* Header — shown on all views except the full-screen battle */}
        {view !== "battle" && (
          <div className="border-b border-amber-900/40 bg-stone-950/60 backdrop-blur-sm">
            <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link
                    href="/witnessing"
                    className="text-amber-300/60 hover:text-amber-200 transition-colors"
                    aria-label="Back to Witnessing Hub"
                  >
                    <ChevronLeft size={18} />
                  </Link>
                  <div>
                    <h1 className="font-display text-lg font-bold tracking-wider text-amber-100 flex items-center gap-2">
                      <Swords size={16} className="text-amber-400" />
                      THE TWELVE STEPS
                    </h1>
                    <p className="font-mono text-[10px] text-amber-300/60 tracking-wider">
                      Act 1 · Dischordia Ladder · {wins}/12
                    </p>
                  </div>
                </div>
                <p className="font-mono text-[10px] text-amber-300/50">
                  W {wins} · L {losses}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main body */}
        <main className="relative">
          <AnimatePresence mode="wait">
            {view === "ladder" && (
              <motion.section
                key="ladder"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mx-auto max-w-4xl px-4 py-6 sm:px-6"
              >
                <LadderListView
                  wins={wins}
                  defeatedOpponents={defeatedOpponents}
                  currentOpponent={currentOpponent}
                  ladderComplete={ladderComplete}
                  onOpenMatchup={handleOpenMatchup}
                />
              </motion.section>
            )}

            {view === "matchup" && currentOpponent && (
              <motion.section
                key="matchup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mx-auto max-w-2xl px-4 py-6 sm:px-6"
              >
                <MatchupView
                  opponent={currentOpponent}
                  playerFaction={playerFaction}
                  onPickFaction={setPlayerFaction}
                  onEngage={handleEngage}
                  onBack={() => setView("ladder")}
                />
              </motion.section>
            )}

            {view === "battle" && currentOpponent && playerFaction && (
              <motion.div
                key="battle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <DuelystGameUI
                  playerFaction={playerFaction}
                  opponentFaction={resolveOpponentFaction(currentOpponent)}
                  onGameEnd={handleGameEnd}
                  onBack={() => setView("matchup")}
                />
                <Act1OpponentTauntOverlay
                  dialog={getAct1OpponentDialog(currentOpponent.id)}
                  opponentName={currentOpponent.name}
                />
              </motion.div>
            )}

            {view === "postmatch" && postMatchResult && (
              <motion.section
                key="postmatch"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mx-auto max-w-2xl px-4 py-6 sm:px-6"
              >
                <PostMatchView
                  opponent={postMatchResult.opponent}
                  outcome={postMatchResult.outcome}
                  onContinue={handlePostMatchContinue}
                />
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LADDER LIST VIEW
   ═══════════════════════════════════════════════════════ */

function LadderListView({
  wins,
  defeatedOpponents,
  currentOpponent,
  ladderComplete,
  onOpenMatchup,
}: {
  wins: number;
  defeatedOpponents: readonly string[];
  currentOpponent: Act1Opponent | null;
  ladderComplete: boolean;
  onOpenMatchup: () => void;
}) {
  const defeatedSet = useMemo(
    () => new Set(defeatedOpponents),
    [defeatedOpponents],
  );
  return (
    <div className="space-y-4">
      {ladderComplete && (
        <div className="rounded-md border border-amber-500/60 bg-amber-950/30 p-5 text-center">
          <Trophy size={28} className="mx-auto mb-2 text-amber-300" />
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-amber-200">
            TWELVE STEPS COMPLETE
          </p>
          <p className="mt-2 font-serif text-sm text-stone-200">
            Act 1 is written. Last Words has been played. The Engineer's
            memoir is complete.
          </p>
        </div>
      )}

      <ol className="space-y-2">
        {ACT_1_OPPONENTS.map((opponent) => {
          const defeated = defeatedSet.has(opponent.id);
          const isCurrent =
            !defeated && currentOpponent?.id === opponent.id;
          const isLocked = !defeated && !isCurrent;
          return (
            <li
              key={opponent.id}
              className={`rounded border p-3 transition-colors ${
                defeated
                  ? "border-amber-700/60 bg-amber-950/20"
                  : isCurrent
                  ? "border-emerald-500/70 bg-emerald-950/30 shadow-[0_0_20px_rgba(52,211,153,0.1)]"
                  : "border-amber-900/30 bg-stone-900/30 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border text-[10px] font-mono ${
                    defeated
                      ? "border-amber-500/70 text-amber-200"
                      : isCurrent
                      ? "border-emerald-400/80 text-emerald-200"
                      : "border-amber-900/50 text-amber-300/50"
                  }`}
                >
                  {opponent.act1Step}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`font-display text-sm ${
                        defeated
                          ? "text-amber-200"
                          : isCurrent
                          ? "text-emerald-100"
                          : "text-amber-300/50"
                      }`}
                    >
                      {opponent.name}
                    </h3>
                    {defeated && (
                      <CheckCircle2 size={12} className="text-amber-400" />
                    )}
                    {isLocked && (
                      <Lock size={10} className="text-amber-300/30" />
                    )}
                  </div>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-300/40">
                    {opponent.cycle.replace(/_/g, " ")}
                  </p>
                  {(defeated || isCurrent) && (
                    <p className="mt-1 font-serif text-[12px] text-stone-300">
                      {opponent.backstory}
                    </p>
                  )}
                </div>
                {isCurrent && (
                  <button
                    type="button"
                    onClick={onOpenMatchup}
                    className="shrink-0 flex items-center gap-1.5 rounded-sm border border-emerald-700/60 bg-emerald-900/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-100 hover:border-emerald-500/80 hover:bg-emerald-900/40 transition-colors"
                  >
                    <Play size={11} />
                    Engage
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MATCHUP VIEW
   ═══════════════════════════════════════════════════════ */

function MatchupView({
  opponent,
  playerFaction,
  onPickFaction,
  onEngage,
  onBack,
}: {
  opponent: Act1Opponent;
  playerFaction: Faction | null;
  onPickFaction: (f: Faction) => void;
  onEngage: () => void;
  onBack: () => void;
}) {
  const opponentFaction = resolveOpponentFaction(opponent);
  const opponentColor = FACTION_COLORS[opponentFaction];
  const dialog = getAct1OpponentDialog(opponent.id);
  return (
    <div className="space-y-6">
      {/* Engineer memoir frame — opens every Act 1 match */}
      {dialog && (
        <div className="rounded-md border border-amber-800/50 bg-stone-950/60 p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-300/50">
            Engineer · memoir
          </p>
          <p className="mt-2 font-serif text-[13px] leading-relaxed text-amber-50/90">
            {dialog.engineerMemoirIntro}
          </p>
        </div>
      )}

      {/* Opponent card */}
      <div
        className="rounded-md border p-6"
        style={{
          borderColor: `${opponentColor}60`,
          background: `radial-gradient(circle at 50% 0%, ${opponentColor}15, transparent 70%), rgba(12,10,5,0.6)`,
        }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-300/60">
          STEP {opponent.act1Step} · {opponent.cycle.replace(/_/g, " ")}
        </p>
        <h2 className="mt-1 font-display text-2xl text-amber-100">
          {opponent.name}
        </h2>
        <p className="mt-3 font-serif text-[13px] leading-relaxed text-stone-200">
          {opponent.backstory}
        </p>
        <div className="mt-4 border-l-2 border-amber-500/60 pl-4">
          <p className="font-mono text-[9px] uppercase tracking-wider text-amber-300/50">
            Their opening line
          </p>
          <p className="mt-1 font-serif italic text-sm text-amber-100">
            "{opponent.preMatchLine}"
          </p>
        </div>
        {dialog && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded border border-cyan-900/50 bg-cyan-950/20 p-3">
              <p className="font-mono text-[9px] uppercase tracking-wider text-cyan-300/70">
                Elara · recognition
              </p>
              <p className="mt-1 font-serif text-[12px] leading-relaxed text-cyan-50/90">
                {dialog.elaraPreMatch}
              </p>
            </div>
            <div className="rounded border border-rose-900/50 bg-rose-950/20 p-3">
              <p className="font-mono text-[9px] uppercase tracking-wider text-rose-300/70">
                The Human · counter-perspective
              </p>
              <p className="mt-1 font-serif text-[12px] leading-relaxed text-rose-50/90">
                {dialog.humanPreMatch}
              </p>
            </div>
          </div>
        )}
        <p
          className="mt-4 font-mono text-[10px] uppercase tracking-wider"
          style={{ color: opponentColor }}
        >
          Deck · {FACTION_NAMES[opponentFaction]}
        </p>
      </div>

      {/* Player faction picker */}
      <div className="rounded-md border border-amber-900/50 bg-stone-950/60 p-5">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-200">
          CHOOSE YOUR FACTION
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PLAYER_FACTIONS.map((f) => {
            const active = playerFaction === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => onPickFaction(f)}
                className={`rounded border px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider transition-colors ${
                  active
                    ? "border-amber-400 bg-amber-900/30 text-amber-100"
                    : "border-amber-900/40 bg-stone-900/40 text-amber-300/60 hover:border-amber-700/60 hover:text-amber-200"
                }`}
                style={active ? { borderColor: FACTION_COLORS[f] } : {}}
              >
                {FACTION_NAMES[f]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-sm border border-amber-900/50 bg-stone-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-amber-300/70 hover:text-amber-100 hover:border-amber-700/70 transition-colors"
        >
          <X size={12} />
          Back to ladder
        </button>
        <button
          type="button"
          onClick={onEngage}
          disabled={!playerFaction}
          className="flex items-center gap-2 rounded-sm border border-emerald-700/70 bg-emerald-900/20 px-5 py-2 font-mono text-[11px] uppercase tracking-wider text-emerald-100 hover:border-emerald-500/80 hover:bg-emerald-900/40 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Swords size={12} />
          Engage
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   POST-MATCH VIEW
   ═══════════════════════════════════════════════════════ */

function PostMatchView({
  opponent,
  outcome,
  onContinue,
}: {
  opponent: Act1Opponent;
  outcome: "win" | "loss";
  onContinue: () => void;
}) {
  const body = outcome === "win" ? opponent.postMatchWin : opponent.postMatchLoss;
  const accent = outcome === "win" ? "border-amber-500/60 bg-amber-950/30" : "border-rose-900/50 bg-rose-950/20";
  const Icon = outcome === "win" ? Trophy : Sparkles;
  const label = outcome === "win" ? "VICTORY" : "SETBACK";
  const dialog = getAct1OpponentDialog(opponent.id);
  const elaraLine = dialog
    ? outcome === "win"
      ? dialog.elaraPostMatchWin
      : dialog.elaraPostMatchLoss
    : null;
  const humanLine = dialog
    ? outcome === "win"
      ? dialog.humanPostMatchWin
      : dialog.humanPostMatchLoss
    : null;
  const engineerClose = dialog
    ? outcome === "win"
      ? dialog.engineerMemoirCloseWin
      : dialog.engineerMemoirCloseLoss
    : null;
  return (
    <div className={`rounded-md border p-6 ${accent}`}>
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-amber-300" />
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-200">
          {label} · STEP {opponent.act1Step}
        </p>
      </div>
      <h2 className="mt-2 font-display text-xl text-amber-100">
        {opponent.name}
      </h2>
      <p className="mt-4 font-serif text-[14px] leading-relaxed text-stone-100">
        {body}
      </p>
      {(elaraLine || humanLine) && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {elaraLine && (
            <div className="rounded border border-cyan-900/50 bg-cyan-950/20 p-3">
              <p className="font-mono text-[9px] uppercase tracking-wider text-cyan-300/70">
                Elara · reflection
              </p>
              <p className="mt-1 font-serif text-[12px] leading-relaxed text-cyan-50/90">
                {elaraLine}
              </p>
            </div>
          )}
          {humanLine && (
            <div className="rounded border border-rose-900/50 bg-rose-950/20 p-3">
              <p className="font-mono text-[9px] uppercase tracking-wider text-rose-300/70">
                The Human · counter-reflection
              </p>
              <p className="mt-1 font-serif text-[12px] leading-relaxed text-rose-50/90">
                {humanLine}
              </p>
            </div>
          )}
        </div>
      )}
      {engineerClose && (
        <div className="mt-4 rounded border border-amber-800/50 bg-stone-950/60 p-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-300/50">
            Engineer · memoir closes
          </p>
          <p className="mt-1 font-serif italic text-[13px] leading-relaxed text-amber-50/90">
            {engineerClose}
          </p>
        </div>
      )}
      {opponent.postBattleSlideshow && outcome === "win" && (
        <p className="mt-3 font-mono text-[10px] text-amber-300/60">
          · Cinematic queued: {opponent.postBattleSlideshow}
        </p>
      )}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          className="flex items-center gap-2 rounded-sm border border-amber-700/70 bg-amber-900/20 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-amber-100 hover:border-amber-500/80 hover:bg-amber-900/40 transition-colors"
        >
          Continue
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

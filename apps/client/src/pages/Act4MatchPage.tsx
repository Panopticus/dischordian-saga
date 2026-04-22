/* ═══════════════════════════════════════════════════════
   ACT 4 MATCH PAGE — path-resolved single encounter

   Unlike Acts 3 / 6 / 7 (ladder pages), Act 4 plays exactly
   one match determined by the player's Act 1 / Act 3 flag
   state:

     Path A (act1_path_A)        → The Bridge (co-deal)
     Path B (act3_partial_share) → Elara, Learning
     Path C (act3_full_secret)   → Elara, Betrayed

   Four views:
     - resolving — shows which path applies (or a helpful
       message if no flag matches yet)
     - matchup   — opponent card + pre-match copy
     - battle    — DuelystGameUI with generalized taunt overlay
     - postmatch — outcome + close-frame line

   On win of the Betrayal variant (Path C), emits the
   the_programmers_math_loredex_act4_line cross-game beat so
   Dead Man's Circuit can surface the Act 4 "efficiency
   honest with itself" reflection.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useMemo, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Play,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  ACT_4_OPPONENTS,
  type ActNOpponent,
} from "@shared/acts2to7Opponents";
import {
  resolveAct4Dialog,
  type Act4OpponentDialog,
} from "@shared/act4OpponentDialog";
import { getTauntHooksForOpponent } from "@shared/actOpponentTaunts";
import { useAct4MatchStore } from "@/stores/act4MatchStore";
import { useGame } from "@/contexts/GameContext";
import DuelystGameUI from "@/game/duelyst/DuelystGameUI";
import {
  ActNOpponentTauntOverlay,
  type ActNTauntPhase,
} from "@/components/act1/ActNOpponentTauntOverlay";
import { fireCrossGameBeat } from "@/lib/crossGameBeats";
import { fireCompanionComment } from "@/lib/companionCommentQueue";
import LivingBackground from "@/components/LivingBackground";

import { assetUrl } from "@/lib/assetUrl";
type MatchView = "resolving" | "matchup" | "battle" | "postmatch";

function resolveOpponentFaction(o: ActNOpponent): string {
  return o.deckLeaning[0] ?? "neutral";
}

function pathLabelFromOpponentId(id: string): string {
  if (id === "act4_the_bridge") return "Path A — Willing Disclosure";
  if (id === "act4_the_discovery") return "Path B — Discovery";
  if (id === "act4_the_betrayal") return "Path C — Betrayal";
  return "Act 4 Match";
}

export default function Act4MatchPage() {
  const { recordOutcome, outcome } = useAct4MatchStore();
  const { setNarrativeFlag, state: gameState } = useGame();

  const [view, setView] = useState<MatchView>("resolving");
  const [postMatchResult, setPostMatchResult] = useState<{
    opponent: ActNOpponent;
    outcome: "win" | "loss";
  } | null>(null);
  const [tauntPhase, setTauntPhase] = useState<ActNTauntPhase | null>(null);

  const flags = useMemo(
    () =>
      new Set(
        Object.entries(gameState.narrativeFlags)
          .filter(([, v]) => v)
          .map(([k]) => k),
      ),
    [gameState.narrativeFlags],
  );

  const dialog: Act4OpponentDialog | null = useMemo(
    () => resolveAct4Dialog(flags),
    [flags],
  );
  const currentOpponent: ActNOpponent | null = useMemo(() => {
    if (!dialog) return null;
    return (
      ACT_4_OPPONENTS.find((o) => o.id === dialog.opponentId) ?? null
    );
  }, [dialog]);

  const handleTurnChange = useCallback(
    ({
      turnNumber,
      actor,
    }: {
      turnNumber: number;
      actor: "player" | "opponent";
    }) => {
      if (actor !== "opponent") return;
      if (turnNumber === 1) setTauntPhase("early");
      else if (turnNumber === 3) setTauntPhase("mid");
      else if (turnNumber === 5) setTauntPhase("late");
    },
    [],
  );

  const handleBossHpChange = useCallback(
    ({ hp, maxHp }: { hp: number; previousHp: number; maxHp: number }) => {
      if (maxHp <= 0) return;
      const pct = hp / maxHp;
      setTauntPhase((prev) => {
        if (pct <= 0.3 && prev !== "late") return "late";
        if (pct <= 0.6 && prev !== "mid" && prev !== "late") return "mid";
        return prev;
      });
    },
    [],
  );

  const handleGameEnd = useCallback(
    (winner: "player" | "opponent") => {
      if (!currentOpponent) return;
      const outcomeTag: "win" | "loss" = winner === "player" ? "win" : "loss";
      recordOutcome(currentOpponent.id, outcomeTag);
      if (winner === "player") {
        setNarrativeFlag("act4_revelation_complete", true);
        setNarrativeFlag("act4_army_unlocked", true);
        fireCompanionComment("act4_army_unlocked");
        if (currentOpponent.id === "act4_the_bridge") {
          fireCompanionComment("act4_pathA_complete");
        } else if (currentOpponent.id === "act4_the_discovery") {
          fireCompanionComment("act4_pathB_complete");
        } else if (currentOpponent.id === "act4_the_betrayal") {
          fireCompanionComment("act4_pathC_complete");
          // Tier 4D: the Betrayal variant's aftermath is where the
          // DMC efficiency-honest reflection line lands. Safe to
          // fire for any Path C win — helper is idempotent.
          void fireCrossGameBeat("the_programmers_math_loredex_act4_line");
        }
      }
      setPostMatchResult({ opponent: currentOpponent, outcome: outcomeTag });
      setView("postmatch");
    },
    [currentOpponent, recordOutcome, setNarrativeFlag],
  );

  const handlePostMatchContinue = useCallback(() => {
    setPostMatchResult(null);
    setTauntPhase(null);
    setView("resolving");
  }, []);

  const accent = "border-cyan-500/50 text-cyan-200";
  const subAccent = "text-cyan-300/80";

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-100">
      <LivingBackground
        src={assetUrl("art/rooms/room-bridge.png")}
        accent="rgba(34, 211, 238, 0.35)"
        opacity={0.08}
        particleCount={3}
        scanlines={false}
      />

      <header className="relative z-10 flex items-center justify-between border-b border-cyan-500/30 bg-stone-950/80 px-4 py-3 backdrop-blur">
        <Link
          to="/bridge"
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-300/80 hover:text-cyan-100"
        >
          <ChevronLeft size={14} />
          Return to Bridge
        </Link>
        <div className="text-center">
          <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${subAccent}`}>
            Act 4 · The Revelation
          </p>
          <p className="mt-1 font-serif text-lg italic text-cyan-50">
            {currentOpponent
              ? pathLabelFromOpponentId(currentOpponent.id)
              : "Path Resolving"}
          </p>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-300/80">
          {outcome ? outcome.toUpperCase() : "Unplayed"}
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-6">
        <AnimatePresence mode="wait">
          {view === "resolving" && (
            <motion.div
              key="resolving"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {!currentOpponent && (
                <div className="rounded-md border border-amber-500/40 bg-amber-950/20 p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-300/80" />
                    <p className="font-mono text-[10px] uppercase tracking-wider text-amber-300/90">
                      Path not yet resolved
                    </p>
                  </div>
                  <p className="mt-2 font-serif italic text-[12px] text-amber-100/80">
                    Act 4 requires one of act1_path_A, act3_partial_share,
                    or act3_full_secret on your flag set. Complete the
                    Act 3 Offer choice first, then return.
                  </p>
                </div>
              )}

              {currentOpponent && (
                <div className={`rounded-md border ${accent} bg-stone-950/60 p-5`}>
                  <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                    Path resolved
                  </p>
                  <p className="mt-2 font-serif text-[16px] italic text-cyan-50">
                    {pathLabelFromOpponentId(currentOpponent.id)}
                  </p>
                  <p className="mt-3 font-serif italic text-[13px] leading-relaxed text-cyan-100/85">
                    {currentOpponent.backstory}
                  </p>
                  {outcome && (
                    <p className="mt-3 font-mono text-[9px] uppercase tracking-wider text-cyan-300/80">
                      Previous outcome: {outcome}
                    </p>
                  )}
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setView("matchup")}
                      className="flex items-center gap-2 rounded border border-cyan-500/60 bg-cyan-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-cyan-100 hover:bg-cyan-900/60"
                    >
                      <Play size={12} />
                      {outcome ? "Replay" : "Sit at the table"}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === "matchup" && currentOpponent && dialog && (
            <motion.div
              key="matchup"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="rounded-md border border-cyan-500/40 bg-stone-950/60 p-5">
                <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                  {pathLabelFromOpponentId(currentOpponent.id)}
                </p>
                <p className="mt-2 font-serif text-[14px] text-cyan-50">
                  {currentOpponent.backstory}
                </p>
                <p className={`mt-3 font-serif italic text-[12px] leading-relaxed text-cyan-200/80`}>
                  {dialog.frameIntro}
                </p>
                <p className={`mt-3 font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                  Pre-match · Elara
                </p>
                <p className="mt-1 font-serif italic text-[13px] text-cyan-100">
                  "{dialog.elaraPreMatch}"
                </p>
                <p className={`mt-3 font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                  Pre-match · Human
                </p>
                <p className="mt-1 font-serif italic text-[13px] text-cyan-100">
                  "{dialog.humanPreMatch}"
                </p>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setView("resolving")}
                  className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-cyan-300/80 hover:text-cyan-100"
                >
                  <ChevronLeft size={12} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setView("battle")}
                  className="flex items-center gap-2 rounded border border-cyan-500/60 bg-cyan-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-cyan-100 hover:bg-cyan-900/60"
                >
                  <Play size={12} />
                  Begin
                </button>
              </div>
            </motion.div>
          )}

          {view === "battle" && currentOpponent && (
            <motion.div
              key="battle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <DuelystGameUI
                playerFaction={
                  (gameState.characterChoices.alignment as never) ??
                  ("neutral" as never)
                }
                opponentFaction={resolveOpponentFaction(currentOpponent) as never}
                onGameEnd={handleGameEnd}
                onBack={() => setView("matchup")}
                onTurnChange={handleTurnChange}
                onBossHpChange={handleBossHpChange}
              />
              <ActNOpponentTauntOverlay
                hooks={getTauntHooksForOpponent(currentOpponent.id) ?? undefined}
                opponentName={currentOpponent.name}
                phase={tauntPhase}
              />
            </motion.div>
          )}

          {view === "postmatch" && postMatchResult && dialog && (
            <motion.div
              key="postmatch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <div className="rounded-md border border-cyan-500/40 bg-stone-950/60 p-5">
                <div className="flex items-center justify-between">
                  <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                    {postMatchResult.outcome === "win"
                      ? "Match held"
                      : "She won this round"}
                  </p>
                  <button
                    type="button"
                    onClick={handlePostMatchContinue}
                    className="text-cyan-300/80 hover:text-cyan-100"
                    aria-label="Close"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="mt-2 font-serif text-[14px] italic text-cyan-50">
                  {postMatchResult.outcome === "win"
                    ? postMatchResult.opponent.postMatchWin
                    : postMatchResult.opponent.postMatchLoss}
                </p>
                <p className={`mt-3 font-serif italic text-[12px] leading-relaxed text-cyan-200/80`}>
                  {postMatchResult.outcome === "win"
                    ? dialog.frameCloseWin
                    : dialog.frameCloseLoss}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handlePostMatchContinue}
                  className="rounded border border-cyan-500/60 bg-cyan-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-cyan-100 hover:bg-cyan-900/60"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

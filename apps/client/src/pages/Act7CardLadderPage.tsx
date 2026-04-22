/* ═══════════════════════════════════════════════════════
   ACT 7 CARD LADDER PAGE — convergence finale

   Linear 4-match page closing the seven-act arc:
     1. The Visible War (composite deck)
     2. The Watcher's Shadow (fires the_watchers_yawn cross-
        game beat on win)
     3. Patient Zero (Reborn) (both narrators self-mute)
     4. The Convergence Seat (dual-narration close; sets
        act7_convergence_landing + act7_arc_closes flags)

   Stone/neutral palette — the finale's register is quiet
   and shared. Matches ActNOpponentTauntOverlay Act 7 accent.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useMemo, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  CheckCircle2,
  Lock,
  Swords,
  Trophy,
  Play,
  X,
} from "lucide-react";
import {
  ACT_7_OPPONENTS,
  type ActNOpponent,
} from "@shared/acts2to7Opponents";
import {
  getAct7OpponentDialog,
  type Act7OpponentDialog,
} from "@shared/act7OpponentDialog";
import { getTauntHooksForOpponent } from "@shared/actOpponentTaunts";
import { useAct7LadderStore } from "@/stores/act7CardLadderStore";
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
type LadderView = "ladder" | "matchup" | "battle" | "postmatch";

function resolveOpponentFaction(o: ActNOpponent): string {
  return o.deckLeaning[0] ?? "neutral";
}

export default function Act7CardLadderPage() {
  const { wins, losses, defeatedOpponents, recordWin, recordLoss } =
    useAct7LadderStore();
  const { setNarrativeFlag, state: gameState } = useGame();

  const [view, setView] = useState<LadderView>("ladder");
  const [postMatchResult, setPostMatchResult] = useState<{
    opponent: ActNOpponent;
    outcome: "win" | "loss";
  } | null>(null);
  const [tauntPhase, setTauntPhase] = useState<ActNTauntPhase | null>(null);

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

  const currentOpponent = useMemo<ActNOpponent | null>(
    () => ACT_7_OPPONENTS.find((o) => o.actStep === wins + 1) ?? null,
    [wins],
  );
  const ladderComplete = currentOpponent === null;

  const dialog: Act7OpponentDialog | undefined = currentOpponent
    ? getAct7OpponentDialog(currentOpponent.id)
    : undefined;

  const handleEngage = useCallback(() => {
    if (!currentOpponent) return;
    if (currentOpponent.id === "act7_the_visible_war") {
      setNarrativeFlag("act7_army_assembled", true);
      fireCompanionComment("act7_army_assembled");
    }
    setView("battle");
  }, [currentOpponent, setNarrativeFlag]);

  const handleGameEnd = useCallback(
    (winner: "player" | "opponent") => {
      if (!currentOpponent) return;
      if (winner === "player") {
        recordWin(currentOpponent.id);
        setNarrativeFlag(
          `act7_step_${currentOpponent.actStep}_complete`,
          true,
        );
        if (currentOpponent.id === "act7_the_visible_war") {
          setNarrativeFlag("act7_visible_war_won", true);
          fireCompanionComment("act7_visible_war_won");
        } else if (currentOpponent.id === "act7_the_watcher_shadow") {
          // Tier 4D: clearing the Shadow without triggering the
          // Watcher's full attention is the canonical Watcher's Yawn
          // beat. Cades FPS + DMC each suppress one Watcher-related
          // side effect on this flag.
          void fireCrossGameBeat("the_watchers_yawn_loredex_shadow_defeated");
        } else if (currentOpponent.id === "act7_the_convergence_seat") {
          setNarrativeFlag("act7_convergence_landing", true);
          setNarrativeFlag("act7_arc_closes", true);
          setNarrativeFlag("act_7_complete", true);
          fireCompanionComment("act7_convergence_landing");
          fireCompanionComment("act7_arc_closes");
          // Tier 4D: Act 7 callback closes the substrate handshake
          // thread. Only fires once — helper is idempotent.
          void fireCrossGameBeat("substrate_handshake_loredex_act7_callback");
        }
      } else {
        recordLoss(currentOpponent.id);
      }
      setPostMatchResult({
        opponent: currentOpponent,
        outcome: winner === "player" ? "win" : "loss",
      });
      setView("postmatch");
    },
    [currentOpponent, recordWin, recordLoss, setNarrativeFlag],
  );

  const handlePostMatchContinue = useCallback(() => {
    setPostMatchResult(null);
    setTauntPhase(null);
    setView("ladder");
  }, []);

  const accent = "border-stone-400/50 text-stone-200";
  const subAccent = "text-stone-300/80";

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-100">
      <LivingBackground
        src={assetUrl("art/rooms/room-bridge.png")}
        accent="rgba(168, 162, 158, 0.3)"
        opacity={0.08}
        particleCount={2}
        scanlines={false}
      />

      <header className="relative z-10 flex items-center justify-between border-b border-stone-400/30 bg-stone-950/80 px-4 py-3 backdrop-blur">
        <Link
          to="/bridge"
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-stone-300/80 hover:text-stone-100"
        >
          <ChevronLeft size={14} />
          Return to Bridge
        </Link>
        <div className="text-center">
          <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${subAccent}`}>
            Act 7 · The Convergence
          </p>
          <p className="mt-1 font-serif text-lg italic text-stone-50">
            The Seat Awaits
          </p>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-stone-300/80">
          {wins}/{ACT_7_OPPONENTS.length} · {losses}L
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-6">
        <AnimatePresence mode="wait">
          {view === "ladder" && (
            <motion.div
              key="ladder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              <p className={`font-serif italic text-[13px] leading-relaxed text-stone-100/80`}>
                Four matches. The visible war you can see. The Watcher's
                shadow you can barely feel. Patient Zero, wearing a
                jacket you loved. And the Seat. Three absences, resolving
                into one.
              </p>
              {ACT_7_OPPONENTS.map((opp) => {
                const done = defeatedOpponents.includes(opp.id);
                const isCurrent = opp.id === currentOpponent?.id;
                const locked = !done && !isCurrent;
                return (
                  <div
                    key={opp.id}
                    className={`rounded-md border px-4 py-3 transition-colors ${
                      done
                        ? "border-stone-400/30 bg-stone-800/30"
                        : isCurrent
                          ? `${accent} bg-stone-800/50`
                          : "border-stone-700/40 bg-stone-900/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                          Match {opp.actStep}
                        </p>
                        <p className="mt-1 font-serif text-[14px] text-stone-50">
                          {opp.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {done && (
                          <CheckCircle2 size={18} className="text-emerald-400/80" />
                        )}
                        {locked && <Lock size={16} className="text-stone-500" />}
                        {isCurrent && (
                          <button
                            type="button"
                            onClick={() => setView("matchup")}
                            className="flex items-center gap-1 rounded border border-stone-400/50 bg-stone-800/50 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-stone-100 hover:bg-stone-700/60"
                          >
                            <Swords size={12} />
                            Step in
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {ladderComplete && (
                <div className="rounded-md border border-emerald-500/40 bg-emerald-950/20 p-4">
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-emerald-300" />
                    <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/90">
                      Arc complete — you arrived whole
                    </p>
                  </div>
                  <p className="mt-2 font-serif text-[12px] italic text-emerald-100/80">
                    The visible war is won. The invisible war has begun.
                    The Ark is warm. The Array is on. Come back to the
                    bridge when you can.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {view === "matchup" && currentOpponent && (
            <motion.div
              key="matchup"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="rounded-md border border-stone-400/40 bg-stone-950/60 p-5">
                <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                  Match {currentOpponent.actStep} · {currentOpponent.name}
                </p>
                <p className="mt-2 font-serif text-[14px] text-stone-50">
                  {currentOpponent.backstory}
                </p>
                {dialog?.frameIntro && (
                  <p className={`mt-3 font-serif italic text-[12px] leading-relaxed whitespace-pre-line text-stone-200/80`}>
                    {dialog.frameIntro}
                  </p>
                )}
                <p className={`mt-3 font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                  Pre-match
                </p>
                <p className="mt-1 font-serif italic text-[13px] text-stone-100">
                  "{currentOpponent.preMatchLine}"
                </p>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setView("ladder")}
                  className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-stone-300/80 hover:text-stone-100"
                >
                  <ChevronLeft size={12} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleEngage}
                  className="flex items-center gap-2 rounded border border-stone-400/60 bg-stone-800/50 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-stone-100 hover:bg-stone-700/60"
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

          {view === "postmatch" && postMatchResult && (
            <motion.div
              key="postmatch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <div className="rounded-md border border-stone-400/40 bg-stone-950/60 p-5">
                <div className="flex items-center justify-between">
                  <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                    {postMatchResult.outcome === "win"
                      ? "Match closed"
                      : "Return when ready"}
                  </p>
                  <button
                    type="button"
                    onClick={handlePostMatchContinue}
                    className="text-stone-300/80 hover:text-stone-100"
                    aria-label="Close"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="mt-2 font-serif text-[14px] italic text-stone-50">
                  {postMatchResult.outcome === "win"
                    ? postMatchResult.opponent.postMatchWin
                    : postMatchResult.opponent.postMatchLoss}
                </p>
                {dialog && (
                  <p className={`mt-3 font-serif italic text-[12px] leading-relaxed whitespace-pre-line text-stone-200/80`}>
                    {postMatchResult.outcome === "win"
                      ? dialog.frameCloseWin
                      : dialog.frameCloseLoss}
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handlePostMatchContinue}
                  className="rounded border border-stone-400/60 bg-stone-800/50 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-stone-100 hover:bg-stone-700/60"
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

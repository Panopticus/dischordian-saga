/* ═══════════════════════════════════════════════════════
   ACT 6 CARD LADDER PAGE — confession-side mirrors

   Linear 2-match page: The Woman She Was (Elara's pre-
   upload hand, reconstructed from archival preferences)
   followed by The Detective in the Wall (the Human without
   the villain edge, for one match only).

   Mirrors Act3CardLadderPage structurally. Differences:
     - 2 opponents instead of 3
     - amber palette (Act 6 confession warmth)
     - act6_elara_confession_heard flag set on Woman win;
       act6_human_confession_heard + act6_confession_close
       on Detective win.
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
  ACT_6_OPPONENTS,
  type ActNOpponent,
} from "@shared/acts2to7Opponents";
import {
  getAct6OpponentDialog,
  type Act6OpponentDialog,
} from "@shared/act6OpponentDialog";
import { getTauntHooksForOpponent } from "@shared/actOpponentTaunts";
import { useAct6LadderStore } from "@/stores/act6CardLadderStore";
import { useGame } from "@/contexts/GameContext";
import DuelystGameUI from "@/game/duelyst/DuelystGameUI";
import {
  ActNOpponentTauntOverlay,
  type ActNTauntPhase,
} from "@/components/act1/ActNOpponentTauntOverlay";
import { fireCompanionComment } from "@/lib/companionCommentQueue";
import LivingBackground from "@/components/LivingBackground";

type LadderView = "ladder" | "matchup" | "battle" | "postmatch";

function resolveOpponentFaction(o: ActNOpponent): string {
  return o.deckLeaning[0] ?? "neutral";
}

export default function Act6CardLadderPage() {
  const { wins, losses, defeatedOpponents, recordWin, recordLoss } =
    useAct6LadderStore();
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
    () => ACT_6_OPPONENTS.find((o) => o.actStep === wins + 1) ?? null,
    [wins],
  );
  const ladderComplete = currentOpponent === null;

  const dialog: Act6OpponentDialog | undefined = currentOpponent
    ? getAct6OpponentDialog(currentOpponent.id)
    : undefined;

  const handleGameEnd = useCallback(
    (winner: "player" | "opponent") => {
      if (!currentOpponent) return;
      if (winner === "player") {
        recordWin(currentOpponent.id);
        setNarrativeFlag(
          `act6_step_${currentOpponent.actStep}_complete`,
          true,
        );
        if (currentOpponent.id === "act6_the_woman_she_was") {
          setNarrativeFlag("act6_elara_confession_heard", true);
          fireCompanionComment("act6_elara_confession_heard");
        } else if (currentOpponent.id === "act6_the_detective_in_the_wall") {
          setNarrativeFlag("act6_human_confession_heard", true);
          setNarrativeFlag("act6_confession_close", true);
          fireCompanionComment("act6_human_confession_heard");
          fireCompanionComment("act6_confession_close");
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

  const accent = "border-amber-500/50 text-amber-200";
  const subAccent = "text-amber-300/80";

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-100">
      <LivingBackground
        src="/art/rooms/room-archives.png"
        accent="rgba(245, 158, 11, 0.4)"
        opacity={0.08}
        particleCount={3}
        scanlines={false}
      />

      <header className="relative z-10 flex items-center justify-between border-b border-amber-500/30 bg-stone-950/80 px-4 py-3 backdrop-blur">
        <Link
          to="/bridge"
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-amber-300/80 hover:text-amber-100"
        >
          <ChevronLeft size={14} />
          Return to Bridge
        </Link>
        <div className="text-center">
          <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${subAccent}`}>
            Act 6 · The Confession
          </p>
          <p className="mt-1 font-serif text-lg italic text-amber-50">
            Confession Mirrors
          </p>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-amber-300/80">
          {wins}/{ACT_6_OPPONENTS.length} · {losses}L
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
              <p className={`font-serif italic text-[13px] leading-relaxed text-amber-100/80`}>
                Two confessions, two matches. Elara plays the hand of
                the woman she was before the upload. The Human plays
                the hand of the man he was before the role. Neither
                match is about winning.
              </p>
              {ACT_6_OPPONENTS.map((opp) => {
                const done = defeatedOpponents.includes(opp.id);
                const isCurrent = opp.id === currentOpponent?.id;
                const locked = !done && !isCurrent;
                return (
                  <div
                    key={opp.id}
                    className={`rounded-md border px-4 py-3 transition-colors ${
                      done
                        ? "border-amber-500/30 bg-amber-950/20"
                        : isCurrent
                          ? `${accent} bg-amber-950/40`
                          : "border-stone-700/40 bg-stone-900/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                          Match {opp.actStep}
                        </p>
                        <p className="mt-1 font-serif text-[14px] text-amber-50">
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
                            className="flex items-center gap-1 rounded border border-amber-500/50 bg-amber-950/40 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-200 hover:bg-amber-900/60"
                          >
                            <Swords size={12} />
                            Sit
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
                      Both confessions held
                    </p>
                  </div>
                  <p className="mt-2 font-serif text-[12px] italic text-emerald-100/80">
                    Two sacrifices, side by side. Neither apologised.
                    The Ark is warm. Return to the bridge when ready.
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
              <div className="rounded-md border border-amber-500/40 bg-stone-950/60 p-5">
                <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                  Match {currentOpponent.actStep} · {currentOpponent.name}
                </p>
                <p className="mt-2 font-serif text-[14px] text-amber-50">
                  {currentOpponent.backstory}
                </p>
                {dialog?.frameIntro && (
                  <p className={`mt-3 font-serif italic text-[12px] leading-relaxed text-amber-200/80`}>
                    {dialog.frameIntro}
                  </p>
                )}
                <p className={`mt-3 font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                  Pre-match
                </p>
                <p className="mt-1 font-serif italic text-[13px] text-amber-100">
                  "{currentOpponent.preMatchLine}"
                </p>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setView("ladder")}
                  className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-amber-300/80 hover:text-amber-100"
                >
                  <ChevronLeft size={12} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setView("battle")}
                  className="flex items-center gap-2 rounded border border-amber-500/60 bg-amber-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-amber-100 hover:bg-amber-900/60"
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
              <div className="rounded-md border border-amber-500/40 bg-stone-950/60 p-5">
                <div className="flex items-center justify-between">
                  <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                    {postMatchResult.outcome === "win"
                      ? "Match played honestly"
                      : "They took the hand"}
                  </p>
                  <button
                    type="button"
                    onClick={handlePostMatchContinue}
                    className="text-amber-300/80 hover:text-amber-100"
                    aria-label="Close"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="mt-2 font-serif text-[14px] italic text-amber-50">
                  {postMatchResult.outcome === "win"
                    ? postMatchResult.opponent.postMatchWin
                    : postMatchResult.opponent.postMatchLoss}
                </p>
                {dialog && (
                  <p className={`mt-3 font-serif italic text-[12px] leading-relaxed text-amber-200/80`}>
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
                  className="rounded border border-amber-500/60 bg-amber-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-amber-100 hover:bg-amber-900/60"
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

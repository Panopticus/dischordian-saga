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
import { ConvergenceSeatGoodbye } from "@/components/act7/ConvergenceSeatGoodbye";
import {
  getAct7OpponentDialog,
  type Act7OpponentDialog,
} from "@shared/act7OpponentDialog";
import { getTauntHooksForOpponent } from "@shared/actOpponentTaunts";
import { resolveChapterIntroForOpponent } from "@shared/storyEncounterChapterIntros";
import { chapterIntroTriggerFlag } from "@/components/cutscenes/ChapterIntroRouter";
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
import { FactionBackdrop } from "@/components/FactionBackdrop";
import { useActVO } from "@/hooks/useActVO";

import { assetUrl } from "@/lib/assetUrl";
type LadderView = "ladder" | "matchup" | "battle" | "postmatch" | "stance";

function resolveOpponentFaction(o: ActNOpponent): string {
  return o.deckLeaning[0] ?? "neutral";
}

/**
 * The four canonical final stances per ACT_7_FINAL_STANCE_FLAGS. Unlike
 * Act 6, NO stance is required for the Act 7 gate to fire — canon is
 * explicit that "silence is itself a stance." But the four flags exist
 * for downstream UI (companion lines, prestige carryover narration), so
 * the picker is offered after the Convergence Seat falls. Skipping it
 * raises `act7_silence_stance` instead so the silence-is-a-stance branch
 * has a flag of its own.
 */
const FINAL_STANCES: ReadonlyArray<{
  flag:
    | "act7_s1_humanity_path"
    | "act7_s1_machine_path"
    | "act7_s1_balance"
    | "act7_s1_soldier_command";
  label: string;
  body: string;
}> = [
  {
    flag: "act7_s1_humanity_path",
    label: "Choose the Humanity path.",
    body: "The Convergence asks what survives. You answer with names — every one of them, including the ones you couldn't save. The substrate listens. The Ark turns toward warmth.",
  },
  {
    flag: "act7_s1_machine_path",
    label: "Choose the Machine path.",
    body: "You refuse the soft answer. The substrate is the ledger and the ledger does not lie. You tell the Convergence: the work is the work; finish it.",
  },
  {
    flag: "act7_s1_balance",
    label: "Choose Balance.",
    body: "Neither side is fully wrong, and neither is fully yours. You hold the seat without taking it — a deliberate refusal of the binary the Watcher wanted you in.",
  },
  {
    flag: "act7_s1_soldier_command",
    label: "Take the Soldier's Command.",
    body: "Someone has to give the orders the next cycle will inherit. You take the seat without ceremony, and you let the army see you do it.",
  },
];

export default function Act7CardLadderPage() {
  const { wins, losses, defeatedOpponents, recordWin, recordLoss } =
    useAct7LadderStore();
  const { setNarrativeFlag, state: gameState } = useGame();
  const vo = useActVO("7");

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
    // Bible §3.10 — fire ch14_source intro on Patient Zero engage
    // (Source = Kael's eternal-corrupted form, mapped to the
    // existing Patient Zero opponent per the canon-gap audit).
    // Other Act 7 opponents skip silently (resolver returns null).
    const intro = resolveChapterIntroForOpponent(currentOpponent.id);
    if (intro) {
      setNarrativeFlag(chapterIntroTriggerFlag(intro.id), true);
    }
    setView("battle");
  }, [currentOpponent, setNarrativeFlag]);

  const handleGameEnd = useCallback(
    (winner: "player" | "opponent") => {
      if (!currentOpponent) return;
      // Path callback selector — Acts 1-3 path locks the variant of
      // the convergence callback. Mirrors the Act 6 mechanism;
      // honours the path-lock pattern in act4OpponentDialog.ts.
      const pathSuffix = gameState.narrativeFlags?.act1_path_a
        ? "_pathA"
        : gameState.narrativeFlags?.act3_full_secret
          ? "_pathC"
          : gameState.narrativeFlags?.act3_partial_share
            ? "_pathB"
            : "";
      if (winner === "player") {
        recordWin(currentOpponent.id);
        setNarrativeFlag(
          `act7_step_${currentOpponent.actStep}_complete`,
          true,
        );
        if (currentOpponent.id === "act7_the_visible_war") {
          setNarrativeFlag("act7_visible_war_won", true);
          fireCompanionComment("act7_visible_war_won");
          if (pathSuffix) fireCompanionComment(`act7_visible_war_won${pathSuffix}`);
          vo.speak("visible-war-win");
        } else if (currentOpponent.id === "act7_the_watcher_shadow") {
          // Tier 4D: clearing the Shadow without triggering the
          // Watcher's full attention is the canonical Watcher's Yawn
          // beat. Cades FPS + DMC each suppress one Watcher-related
          // side effect on this flag.
          void fireCrossGameBeat("the_watchers_yawn_loredex_shadow_defeated");
          vo.speak("watcher-shadow-resolve");
        } else if (currentOpponent.id === "act7_the_patient_zero_reborn") {
          vo.speak("patient-zero-close");
        } else if (currentOpponent.id === "act7_oracle_meme_final") {
          setNarrativeFlag("act7_convergence_landing", true);
          setNarrativeFlag("act7_arc_closes", true);
          setNarrativeFlag("act_7_complete", true);
          fireCompanionComment("act7_convergence_landing");
          fireCompanionComment("act7_arc_closes");
          if (pathSuffix) {
            fireCompanionComment(`act7_convergence_landing${pathSuffix}`);
            fireCompanionComment(`act7_arc_closes${pathSuffix}`);
          }
          // Tier 4D: Act 7 callback closes the substrate handshake
          // thread. Only fires once — helper is idempotent.
          void fireCrossGameBeat("substrate_handshake_loredex_act7_callback");
          vo.speak("convergence-landing-elara");
          // Queued: Human's landing + dual closing chord. The hook
          // queues follow-up lines behind the currently-playing one.
          vo.speak("convergence-landing-human");
          vo.speak("convergence-landing-dual");
          vo.speak("arc-closes");
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
    [currentOpponent, recordWin, recordLoss, setNarrativeFlag, vo],
  );

  const anyStanceTaken = useMemo(
    () =>
      FINAL_STANCES.some((s) => Boolean(gameState.narrativeFlags?.[s.flag])) ||
      Boolean(gameState.narrativeFlags?.act7_silence_stance),
    [gameState.narrativeFlags],
  );

  const handleStanceChosen = useCallback(
    (flag: (typeof FINAL_STANCES)[number]["flag"]) => {
      setNarrativeFlag(flag, true);
      setNarrativeFlag("act7_stance_chosen", true);
      // Branching-pass aliases — fire the canonical fork-flag name alongside
      // the surface-specific stance flag so companionComments / askTopics /
      // moralityTrustActVariants entries that gate on act7_*_chosen resolve
      // correctly. See actBranchingContract.test.ts.
      const ALIASES: Record<(typeof FINAL_STANCES)[number]["flag"], string> = {
        act7_s1_humanity_path: "act7_humanity_chosen",
        act7_s1_machine_path: "act7_command_chosen",
        act7_s1_balance: "act7_pattern_chosen",
        act7_s1_soldier_command: "act7_bridge_chosen",
      };
      setNarrativeFlag(ALIASES[flag], true);
      fireCompanionComment(flag);
      const stanceLineId: Record<
        (typeof FINAL_STANCES)[number]["flag"],
        string
      > = {
        act7_s1_humanity_path: "final-stance-humanity",
        act7_s1_machine_path: "final-stance-machine",
        act7_s1_balance: "final-stance-balance",
        act7_s1_soldier_command: "final-stance-command",
      };
      vo.speak(stanceLineId[flag]);
      setView("ladder");
    },
    [setNarrativeFlag, vo],
  );

  const handleSilenceChosen = useCallback(() => {
    // Canon: "silence is itself a stance." Recorded as its own flag so
    // downstream UI can distinguish "player declined to choose" from
    // "stance not yet offered." No VO fires — the silence IS the VO.
    setNarrativeFlag("act7_silence_stance", true);
    setNarrativeFlag("act7_stance_chosen", true);
    fireCompanionComment("act7_silence_stance");
    setView("ladder");
  }, [setNarrativeFlag]);

  const handlePostMatchContinue = useCallback(() => {
    const wasConvergenceWin =
      postMatchResult?.opponent.id === "act7_oracle_meme_final" &&
      postMatchResult.outcome === "win";
    setPostMatchResult(null);
    setTauntPhase(null);
    if (wasConvergenceWin && !anyStanceTaken) {
      setView("stance");
    } else {
      setView("ladder");
    }
  }, [postMatchResult, anyStanceTaken]);

  const accent = "void-border void-text";
  const subAccent = "void-text-dim";

  return (
    <div className="relative min-h-screen void-bg-canvas void-text">
      <LivingBackground
        src={assetUrl("art/rooms/room-bridge.png")}
        accent="color-mix(in oklch, var(--energy-accent) 30%, transparent)"
        opacity={0.08}
        particleCount={2}
        scanlines={false}
      />
      {/* May 2026 archive — Act 7 faction backplate (mechronis /
          the Architect returns to Mechronis Core). */}
      <FactionBackdrop faction="mechronis" opacity={0.1} />

      <header className="relative z-10 flex items-center justify-between border-b void-border void-bg-canvas px-4 py-3 backdrop-blur">
        <Link
          to="/bridge"
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] void-text-dim void-text"
        >
          <ChevronLeft size={14} />
          Return to Bridge
        </Link>
        <div className="text-center">
          <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${subAccent}`}>
            Act 7 · The Convergence
          </p>
          <p className="mt-1 font-serif text-lg italic void-text">
            The Seat Awaits
          </p>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-wider void-text-dim">
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
              <p className={`font-serif italic text-[13px] leading-relaxed void-text-dim`}>
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
                        ? "void-border void-bg-canvas"
                        : isCurrent
                          ? `${accent} void-bg-canvas`
                          : "void-border void-bg-canvas"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                          Match {opp.actStep}
                        </p>
                        <p className="mt-1 font-serif text-[14px] void-text">
                          {opp.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {done && (
                          <CheckCircle2 size={18} className="void-text-energy" />
                        )}
                        {locked && <Lock size={16} className="void-text" />}
                        {isCurrent && (
                          <button
                            type="button"
                            onClick={() => setView("matchup")}
                            className="flex items-center gap-1 rounded border void-border void-bg-canvas px-3 py-1 font-mono text-[10px] uppercase tracking-wider void-text void-bg-canvas"
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
                <div className="rounded-md border void-border-success void-bg-success p-4">
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="void-text-energy" />
                    <p className="font-mono text-[10px] uppercase tracking-wider void-text-energy">
                      Arc complete — you arrived whole
                    </p>
                  </div>
                  <p className="mt-2 font-serif text-[12px] italic void-text-energy">
                    The visible war is won. The invisible war has begun.
                    The Ark is warm. The Array is on. Come back to the
                    bridge when you can.
                  </p>
                  {!anyStanceTaken && (
                    <button
                      type="button"
                      onClick={() => setView("stance")}
                      className="mt-3 rounded border void-border void-bg-canvas px-3 py-1 font-mono text-[10px] uppercase tracking-wider void-text void-bg-canvas"
                    >
                      Choose your final stance
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {view === "matchup" &&
            currentOpponent &&
            currentOpponent.id === "act7_the_convergence_seat" &&
            !gameState.narrativeFlags?.convergence_seat_goodbye_walked && (
              <ConvergenceSeatGoodbye onComplete={() => undefined} />
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
              <div className="rounded-md border void-border void-bg-canvas p-5">
                <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                  Match {currentOpponent.actStep} · {currentOpponent.name}
                </p>
                <p className="mt-2 font-serif text-[14px] void-text">
                  {currentOpponent.backstory}
                </p>
                {dialog?.frameIntro && (
                  <p className={`mt-3 font-serif italic text-[12px] leading-relaxed whitespace-pre-line void-text-dim`}>
                    {dialog.frameIntro}
                  </p>
                )}
                <p className={`mt-3 font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                  Pre-match
                </p>
                <p className="mt-1 font-serif italic text-[13px] void-text">
                  "{currentOpponent.preMatchLine}"
                </p>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setView("ladder")}
                  className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider void-text-dim void-text"
                >
                  <ChevronLeft size={12} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleEngage}
                  className="flex items-center gap-2 rounded border void-border void-bg-canvas px-4 py-2 font-mono text-[10px] uppercase tracking-wider void-text void-bg-canvas"
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
              <div className="rounded-md border void-border void-bg-canvas p-5">
                <div className="flex items-center justify-between">
                  <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                    {postMatchResult.outcome === "win"
                      ? "Match closed"
                      : "Return when ready"}
                  </p>
                  <button
                    type="button"
                    onClick={handlePostMatchContinue}
                    className="void-text-dim void-text"
                    aria-label="Close"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="mt-2 font-serif text-[14px] italic void-text">
                  {postMatchResult.outcome === "win"
                    ? postMatchResult.opponent.postMatchWin
                    : postMatchResult.opponent.postMatchLoss}
                </p>
                {dialog && (
                  <p className={`mt-3 font-serif italic text-[12px] leading-relaxed whitespace-pre-line void-text-dim`}>
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
                  className="rounded border void-border void-bg-canvas px-4 py-2 font-mono text-[10px] uppercase tracking-wider void-text void-bg-canvas"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {view === "stance" && (
            <motion.div
              key="stance"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="space-y-4"
            >
              <div className="rounded-md border void-border void-bg-canvas p-5">
                <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${subAccent}`}>
                  Act 7 · Final Stance
                </p>
                <p className="mt-2 font-serif text-[15px] italic void-text">
                  The seat is yours. So is the silence.
                </p>
                <p className="mt-3 font-serif text-[12px] leading-relaxed void-text-dim">
                  The Convergence Seat is empty and the room is waiting.
                  Choose a stance, or refuse to choose — either is the
                  whole answer. The next cycle will inherit it.
                </p>
              </div>
              <ul className="space-y-2">
                {FINAL_STANCES.map((stance) => (
                  <li key={stance.flag}>
                    <button
                      type="button"
                      onClick={() => handleStanceChosen(stance.flag)}
                      className="w-full rounded-md border void-border void-bg-canvas px-4 py-3 text-left void-border void-bg-canvas"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] void-text">
                        {stance.label}
                      </p>
                      <p className="mt-1 font-serif text-[12px] leading-relaxed italic void-text-dim">
                        {stance.body}
                      </p>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={handleSilenceChosen}
                    className="w-full rounded-md border void-border void-bg-canvas px-4 py-3 text-left void-border void-bg-canvas"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] void-text">
                      Refuse to choose. Hold the silence.
                    </p>
                    <p className="mt-1 font-serif text-[12px] leading-relaxed italic void-text-dim">
                      The room is full of people who will speak for you.
                      You let them. The cycle inherits the silence and
                      makes of it what it makes.
                    </p>
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

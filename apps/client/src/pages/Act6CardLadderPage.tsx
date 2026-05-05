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

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { useActVO } from "@/hooks/useActVO";

import { assetUrl } from "@/lib/assetUrl";
type LadderView = "ladder" | "matchup" | "battle" | "postmatch" | "stance";

function resolveOpponentFaction(o: ActNOpponent): string {
  return o.deckLeaning[0] ?? "neutral";
}

/**
 * The four confession-close stances per Act 6 completion gate canon
 * (ACT_6_CONFESSION_STANCE_FLAGS). Raising ANY one of these satisfies
 * the stance requirement of the Act 6 gate. The player picks after the
 * second confession (Detective in the Wall) — the gate never fires
 * without a stance, so this picker is load-bearing for act progression.
 */
const CONFESSION_STANCES: ReadonlyArray<{
  flag:
    | "act6_confession_close_empathy"
    | "act6_confession_close_challenge"
    | "act6_confession_close_refusal"
    | "act6_confession_close_reluctant_ally"
    | "act6_confession_close_partial"
    | "act6_confession_close_oracle_sense"
    | "act6_confession_close_practical";
  label: string;
  body: string;
}> = [
  {
    flag: "act6_confession_close_empathy",
    label: "Sit with them in it.",
    body: "You don't forgive them. You don't correct them. You let the grief be the grief, and you are still there when it is done.",
  },
  {
    flag: "act6_confession_close_challenge",
    label: "Answer the confession with a harder one.",
    body: "If this is what honesty costs, you owe it back. You tell them the thing you hoped you'd never have to say out loud.",
  },
  {
    flag: "act6_confession_close_refusal",
    label: "Refuse the absolution they're asking for.",
    body: "A confession is not a sentence you pass on someone else. You do not tell them it's all right. You tell them it is what it is, and it is theirs.",
  },
  {
    flag: "act6_confession_close_reluctant_ally",
    label: "Pick up the shift beside them.",
    body: "There is more war coming. The confession is a door, not a finish line. You agree — without warmth, without distance — to keep walking.",
  },
  {
    flag: "act6_confession_close_partial",
    label: "Acknowledge what was said. Hold what wasn't.",
    body: "You name back to them only the part you heard clearly. The part you suspect they meant but didn't say — you let it sit. Not every line in a confession is yours to complete. The room can carry what's between you without naming it.",
  },
  {
    flag: "act6_confession_close_oracle_sense",
    label: "Close your eyes and listen beneath the words.",
    body: "The confession carries a substrate reading the speaker did not intend to send. You receive it — the quieter signal underneath the louder sentence. The Oracle's channel opens. You report what you sensed, not what was said.",
  },
  {
    flag: "act6_confession_close_practical",
    label: "Take the ledger out. Balance what was said.",
    body: "A confession is also a transaction — something was owed, something was paid. You name the debt and the payment in plain language. No warmth, no distance, no judgment. Arithmetic. The room is lighter for it.",
  },
];

export default function Act6CardLadderPage() {
  const { wins, losses, defeatedOpponents, recordWin, recordLoss } =
    useAct6LadderStore();
  const { setNarrativeFlag, state: gameState } = useGame();
  const vo = useActVO("6");
  // Prestige-replay meta: if the player ended the previous cycle with
  // `act7_silence_stance`, Act 6's confession room plays a one-shot
  // meta line on entry acknowledging the silence. Canon §6.1 optional.
  const silenceMetaFiredRef = useRef(false);
  useEffect(() => {
    if (silenceMetaFiredRef.current) return;
    if (!gameState.narrativeFlags?.act7_silence_stance) return;
    if (gameState.narrativeFlags?.act6_silence_meta_heard) return;
    silenceMetaFiredRef.current = true;
    setNarrativeFlag("act6_silence_meta_heard", true);
    vo.speak("silence-stance-meta");
  }, [gameState.narrativeFlags, setNarrativeFlag, vo]);

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
        // Path callback selector — Acts 1-3 path locks the variant
        // of the confession callback that fires here. Honours the
        // path-lock pattern in act4OpponentDialog.ts.
        const pathSuffix = gameState.narrativeFlags?.act1_path_A
          ? "_pathA"
          : gameState.narrativeFlags?.act3_full_secret
            ? "_pathC"
            : gameState.narrativeFlags?.act3_partial_share
              ? "_pathB"
              : "";

        if (currentOpponent.id === "act6_the_woman_she_was") {
          setNarrativeFlag("act6_elara_confession_heard", true);
          fireCompanionComment("act6_elara_confession_heard");
          if (pathSuffix) fireCompanionComment(`act6_elara_confession_heard${pathSuffix}`);
          // Queue the full 5-line confession arc; the hook serialises
          // them so the player hears Elara's whole beat in sequence.
          vo.speak("elara-confession-01");
          vo.speak("elara-confession-02");
          vo.speak("elara-confession-03");
          vo.speak("elara-confession-04");
          vo.speak("elara-confession-05");
        } else if (currentOpponent.id === "act6_the_detective_in_the_wall") {
          setNarrativeFlag("act6_human_confession_heard", true);
          setNarrativeFlag("act6_confession_close", true);
          fireCompanionComment("act6_human_confession_heard");
          fireCompanionComment("act6_confession_close");
          if (pathSuffix) {
            fireCompanionComment(`act6_human_confession_heard${pathSuffix}`);
            fireCompanionComment(`act6_confession_close${pathSuffix}`);
          }
          vo.speak("human-confession-01");
          vo.speak("human-confession-02");
          vo.speak("human-confession-03");
          vo.speak("human-confession-04");
          vo.speak("human-confession-05");
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
    () => CONFESSION_STANCES.some((s) => Boolean(gameState.narrativeFlags?.[s.flag])),
    [gameState.narrativeFlags],
  );

  const handleStanceChosen = useCallback(
    (flag: (typeof CONFESSION_STANCES)[number]["flag"]) => {
      setNarrativeFlag(flag, true);
      // Also raise a generic "a stance was chosen" meta-flag so UI surfaces
      // that consume the Act 6 progress panel (the Witnessing Hub) don't
      // each have to know the four specific stance-flag names. The gate
      // itself still reads ACT_6_CONFESSION_STANCE_FLAGS (the four above).
      setNarrativeFlag("act6_stance_chosen", true);
      // Branching-pass aliases — fire the canonical fork-flag name alongside
      // the surface-specific stance flag so companionComments / askTopics /
      // moralityTrustActVariants entries that gate on act6_*_chosen resolve
      // correctly. See actBranchingContract.test.ts.
      const ALIASES: Record<(typeof CONFESSION_STANCES)[number]["flag"], string> = {
        act6_confession_close_empathy: "act6_compassion_chosen",
        act6_confession_close_challenge: "act6_suspicious_chosen",
        act6_confession_close_refusal: "act6_refuse_secrecy_chosen",
        act6_confession_close_reluctant_ally: "act6_ally_chosen",
        act6_confession_close_partial: "act6_partial_disclosure_chosen",
        act6_confession_close_oracle_sense: "act6_oracle_sense_chosen",
        act6_confession_close_practical: "act6_practical_chosen",
      };
      setNarrativeFlag(ALIASES[flag], true);
      fireCompanionComment(flag);
      const stanceLineId: Record<
        (typeof CONFESSION_STANCES)[number]["flag"],
        string
      > = {
        act6_confession_close_empathy: "stance-empathy",
        act6_confession_close_challenge: "stance-challenge",
        act6_confession_close_refusal: "stance-refusal",
        act6_confession_close_reluctant_ally: "stance-reluctant-ally",
        act6_confession_close_partial: "stance-partial",
        act6_confession_close_oracle_sense: "stance-oracle-sense",
        act6_confession_close_practical: "stance-practical",
      };
      vo.speak(stanceLineId[flag]);
      setView("ladder");
    },
    [setNarrativeFlag, vo],
  );

  const handlePostMatchContinue = useCallback(() => {
    const wasDetectiveWin =
      postMatchResult?.opponent.id === "act6_the_detective_in_the_wall" &&
      postMatchResult.outcome === "win";
    setPostMatchResult(null);
    setTauntPhase(null);
    if (wasDetectiveWin && !anyStanceTaken) {
      setView("stance");
    } else {
      setView("ladder");
    }
  }, [postMatchResult, anyStanceTaken]);

  const accent = "void-border void-text-accent";
  const subAccent = "void-text-accent";

  return (
    <div className="relative min-h-screen void-bg-canvas void-text">
      <LivingBackground
        src={assetUrl("art/rooms/room-archives.png")}
        accent="color-mix(in oklch, var(--energy-accent) 40%, transparent)"
        opacity={0.08}
        particleCount={3}
        scanlines={false}
      />

      <header className="relative z-10 flex items-center justify-between border-b void-border void-bg-canvas px-4 py-3 backdrop-blur">
        <Link
          to="/bridge"
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] void-text-accent void-text-accent"
        >
          <ChevronLeft size={14} />
          Return to Bridge
        </Link>
        <div className="text-center">
          <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${subAccent}`}>
            Act 6 · The Confession
          </p>
          <p className="mt-1 font-serif text-lg italic void-text-accent">
            Confession Mirrors
          </p>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-wider void-text-accent">
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
              <p className={`font-serif italic text-[13px] leading-relaxed void-text-accent`}>
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
                        ? "void-border void-bg-sunk"
                        : isCurrent
                          ? `${accent} void-bg-sunk`
                          : "void-border void-bg-canvas"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                          Match {opp.actStep}
                        </p>
                        <p className="mt-1 font-serif text-[14px] void-text-accent">
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
                            className="flex items-center gap-1 rounded border void-border void-bg-sunk px-3 py-1 font-mono text-[10px] uppercase tracking-wider void-text-accent void-bg-sunk"
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
                <div className="rounded-md border void-border-success void-bg-success p-4">
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="void-text-energy" />
                    <p className="font-mono text-[10px] uppercase tracking-wider void-text-energy">
                      Both confessions held
                    </p>
                  </div>
                  <p className="mt-2 font-serif text-[12px] italic void-text-energy">
                    Two sacrifices, side by side. Neither apologised.
                    The Ark is warm. Return to the bridge when ready.
                  </p>
                  {!anyStanceTaken && (
                    <button
                      type="button"
                      onClick={() => setView("stance")}
                      className="mt-3 rounded border void-border void-bg-sunk px-3 py-1 font-mono text-[10px] uppercase tracking-wider void-text-accent void-bg-sunk"
                    >
                      Choose how to carry them
                    </button>
                  )}
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
              <div className="rounded-md border void-border void-bg-canvas p-5">
                <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                  Match {currentOpponent.actStep} · {currentOpponent.name}
                </p>
                <p className="mt-2 font-serif text-[14px] void-text-accent">
                  {currentOpponent.backstory}
                </p>
                {dialog?.frameIntro && (
                  <p className={`mt-3 font-serif italic text-[12px] leading-relaxed void-text-accent`}>
                    {dialog.frameIntro}
                  </p>
                )}
                <p className={`mt-3 font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                  Pre-match
                </p>
                <p className="mt-1 font-serif italic text-[13px] void-text-accent">
                  "{currentOpponent.preMatchLine}"
                </p>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setView("ladder")}
                  className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider void-text-accent void-text-accent"
                >
                  <ChevronLeft size={12} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setView("battle")}
                  className="flex items-center gap-2 rounded border void-border void-bg-sunk px-4 py-2 font-mono text-[10px] uppercase tracking-wider void-text-accent void-bg-sunk"
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
                      ? "Match played honestly"
                      : "They took the hand"}
                  </p>
                  <button
                    type="button"
                    onClick={handlePostMatchContinue}
                    className="void-text-accent void-text-accent"
                    aria-label="Close"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="mt-2 font-serif text-[14px] italic void-text-accent">
                  {postMatchResult.outcome === "win"
                    ? postMatchResult.opponent.postMatchWin
                    : postMatchResult.opponent.postMatchLoss}
                </p>
                {dialog && (
                  <p className={`mt-3 font-serif italic text-[12px] leading-relaxed void-text-accent`}>
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
                  className="rounded border void-border void-bg-sunk px-4 py-2 font-mono text-[10px] uppercase tracking-wider void-text-accent void-bg-sunk"
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
                  Act 6 · Close
                </p>
                <p className="mt-2 font-serif text-[15px] italic void-text-accent">
                  Both confessions held. Choose how you carry them.
                </p>
                <p className="mt-3 font-serif text-[12px] leading-relaxed void-text-accent">
                  The Ark is warm. Neither of them is asking to be saved. The
                  only remaining question is what you do with the silence
                  after.
                </p>
              </div>
              <ul className="space-y-2">
                {CONFESSION_STANCES.map((stance) => (
                  <li key={stance.flag}>
                    <button
                      type="button"
                      onClick={() => handleStanceChosen(stance.flag)}
                      className="w-full rounded-md border void-border void-bg-sunk px-4 py-3 text-left void-border void-bg-sunk"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] void-text-accent">
                        {stance.label}
                      </p>
                      <p className="mt-1 font-serif text-[12px] leading-relaxed italic void-text-accent">
                        {stance.body}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

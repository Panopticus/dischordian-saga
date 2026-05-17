/* ═══════════════════════════════════════════════════════
   ACT 3 CARD LADDER PAGE — substrate-gate opponents

   Minimal, focused sibling of Act1CardLadderPage. Runs the
   three Act 3 gate matches (Substrate Echo, Kael Archivist,
   Substrate Warden) as a linear ladder. On each win the
   canonical narrative flag lands; on the third win the
   player unlocks Kael's logs and the Vox correspondence
   cross-game thread fires.

   Views:
     - ladder   — 3-rung ladder with substrate-tinted chrome
     - matchup  — opponent card + Human framing line + Engage
     - battle   — DuelystGameUI mount + generalized taunt overlay
     - postmatch — win/loss beat + Continue

   The page is deliberately smaller than Act1CardLadderPage
   because Act 3 has no faction picker (the player retains
   their Act 1 faction) and no slideshow chaining beyond the
   final Warden beat.
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
  ACT_3_OPPONENTS,
  type ActNOpponent,
} from "@shared/acts2to7Opponents";
import {
  getAct3OpponentDialog,
  type Act3OpponentDialog,
} from "@shared/act3OpponentDialog";
import { getTauntHooksForOpponent } from "@shared/actOpponentTaunts";
import { useAct3LadderStore } from "@/stores/act3CardLadderStore";
import { useGame } from "@/contexts/GameContext";
import DuelystGameUI from "@/game/duelyst/DuelystGameUI";
import {
  ActNOpponentTauntOverlay,
  type ActNTauntPhase,
} from "@/components/act1/ActNOpponentTauntOverlay";
import { fireCrossGameBeat } from "@/lib/crossGameBeats";
import { fireCompanionComment } from "@/lib/companionCommentQueue";
import { useActVO } from "@/hooks/useActVO";
import LivingBackground from "@/components/LivingBackground";
import { FactionBackdrop } from "@/components/FactionBackdrop";
import { actFaction } from "@shared/actFactionMapping";

import { assetUrl } from "@/lib/assetUrl";
type LadderView = "ladder" | "matchup" | "battle" | "postmatch" | "pathlock";

interface PathLockChoice {
  id: "insurgency" | "empire" | "hierarchy";
  label: string;
  cover: string;
  endingFlag: string;
  rationale: string;
}

const PATH_LOCK_CHOICES: ReadonlyArray<PathLockChoice> = [
  {
    id: "insurgency",
    label: "Wear the Insurgent's name.",
    cover: "Cover identity: Insurgency cell-runner.",
    endingFlag: "act3_insurgency_ending",
    rationale:
      "The lanes are watched, but the Insurgents' channels are watched LESS. You will move slower. You will move further. Kael's old cohort still recognises the handshake.",
  },
  {
    id: "empire",
    label: "Wear the Empire's seal.",
    cover: "Cover identity: New Babylon Empire courier.",
    endingFlag: "act3_empire_ending",
    rationale:
      "The Empire's papers open every door. The papers are mine to forge. The cost is that I will hold the bond, not you, and the bond pays in trades I will choose.",
  },
  {
    id: "hierarchy",
    label: "Wear the Hierarchy's mark.",
    cover: "Cover identity: Hierarchy mid-tier negotiator.",
    endingFlag: "act3_hierarchy_ending",
    rationale:
      "Inside the Hierarchy you will not be hunted. You will be administered. The administration is harder than the hunt. Most people pick this and regret it. Some do not.",
  },
];

function resolveOpponentFaction(o: ActNOpponent): string {
  return o.deckLeaning[0] ?? "neutral";
}

export default function Act3CardLadderPage() {
  const { wins, losses, defeatedOpponents, recordWin, recordLoss } =
    useAct3LadderStore();
  const { setNarrativeFlag, state: gameState } = useGame();
  const vo = useActVO("3");

  // Kael's opener triples land on first mount of the Act 3 ladder —
  // one-shot per save, gated by act3_kael_opener_heard.
  const kaelOpenerFiredRef = useRef(false);
  useEffect(() => {
    if (kaelOpenerFiredRef.current) return;
    if (gameState.narrativeFlags?.act3_kael_opener_heard) return;
    kaelOpenerFiredRef.current = true;
    setNarrativeFlag("act3_kael_opener_heard", true);
    vo.speak("kael-opener-01");
    vo.speak("kael-opener-02");
    vo.speak("kael-opener-03");
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
    () => ACT_3_OPPONENTS.find((o) => o.actStep === wins + 1) ?? null,
    [wins],
  );
  const ladderComplete = currentOpponent === null;

  const dialog: Act3OpponentDialog | undefined = currentOpponent
    ? getAct3OpponentDialog(currentOpponent.id)
    : undefined;

  const handleEngage = useCallback(() => {
    if (!currentOpponent) return;
    if (currentOpponent.actStep === 1) {
      fireCompanionComment("act3_kael_logs_unlocked");
    }
    setView("battle");
  }, [currentOpponent]);

  const handleGameEnd = useCallback(
    (winner: "player" | "opponent") => {
      if (!currentOpponent) return;
      if (winner === "player") {
        recordWin(currentOpponent.id);
        setNarrativeFlag(
          `act3_step_${currentOpponent.actStep}_complete`,
          true,
        );
        if (currentOpponent.actStep === 3) {
          setNarrativeFlag("act3_kael_logs_unlocked", true);
          // Act 3 Kael-logs-unlocked voice beat (queued 01 → 02).
          vo.speak("kael-logs-unlocked-01");
          vo.speak("kael-logs-unlocked-02");
          // Tier 4D: clearing the Substrate Warden is the canonical
          // Vox correspondence thread opener.
          void fireCrossGameBeat("vox_correspondence_loredex_warden_passage");
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

  const handlePostMatchContinue = useCallback(() => {
    setPostMatchResult(null);
    setTauntPhase(null);
    // After the third gate win, the substrate ladder is cleared.
    // Locke's path-lock offer fires once unless the player has already
    // committed to a path on a prior pass (read directly from flags so
    // we don't re-show after picking).
    const flags = gameState.narrativeFlags ?? {};
    const alreadyPicked =
      flags.act3_insurgency_ending ||
      flags.act3_empire_ending ||
      flags.act3_hierarchy_ending;
    if (
      flags.act3_kael_logs_unlocked &&
      !alreadyPicked
    ) {
      setView("pathlock");
    } else {
      setView("ladder");
    }
  }, [gameState.narrativeFlags]);

  const handlePathLockChoice = useCallback(
    (choice: PathLockChoice) => {
      setNarrativeFlag(choice.endingFlag, true);
      setNarrativeFlag(`act3_path_${choice.id}_chosen`, true);
      setView("ladder");
    },
    [setNarrativeFlag],
  );

  const accent = "void-border-system void-text-system";
  const subAccent = "void-text-system";

  return (
    <div className="relative min-h-screen void-bg-canvas void-text">
      <LivingBackground
        src={assetUrl("art/rooms/room-archives.png")}
        accent="color-mix(in oklch, var(--energy-system) 40%, transparent)"
        opacity={0.08}
        particleCount={3}
        scanlines={false}
      />
      {/* May 2026 archive — Act 3 faction backplate (hierarchy / the
          Offer's bargain). */}
      <FactionBackdrop faction="hierarchy" opacity={0.1} />

      <header className="relative z-10 flex items-center justify-between border-b void-border-system void-bg-canvas px-4 py-3 backdrop-blur">
        <Link
          to="/bridge"
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] void-text-system void-text-system"
        >
          <ChevronLeft size={14} />
          Return to Bridge
        </Link>
        <div className="text-center">
          <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${subAccent}`}>
            Act 3 · The Offer
          </p>
          <p className="mt-1 font-serif text-lg italic void-text-system">
            Substrate Gates
          </p>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-wider void-text-system">
          {wins}/{ACT_3_OPPONENTS.length} gates · {losses}L
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
              <p className={`font-serif italic text-[13px] leading-relaxed void-text-system`}>
                Kael left three echoes at the doorway to the substrate.
                Walk past all three and the logs open. The Human will
                narrate the descent.
              </p>
              {ACT_3_OPPONENTS.map((opp) => {
                const done = defeatedOpponents.includes(opp.id);
                const isCurrent = opp.id === currentOpponent?.id;
                const locked = !done && !isCurrent;
                return (
                  <div
                    key={opp.id}
                    className={`rounded-md border px-4 py-3 transition-colors ${
                      done
                        ? "void-border-system void-bg-system"
                        : isCurrent
                          ? `${accent} void-bg-system`
                          : "void-border void-bg-canvas"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                          Gate {opp.actStep}
                        </p>
                        <p className="mt-1 font-serif text-[14px] void-text-system">
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
                            className="flex items-center gap-1 rounded border void-border-system void-bg-system px-3 py-1 font-mono text-[10px] uppercase tracking-wider void-text-system void-bg-system"
                          >
                            <Swords size={12} />
                            Approach
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
                      Gates cleared — Kael's logs unlocked
                    </p>
                  </div>
                  <p className="mt-2 font-serif text-[12px] italic void-text-energy">
                    Return to the bridge. The War Room will light up
                    with every coordinate he ever visited.
                  </p>
                  {!gameState.narrativeFlags?.act3_insurgency_ending &&
                    !gameState.narrativeFlags?.act3_empire_ending &&
                    !gameState.narrativeFlags?.act3_hierarchy_ending && (
                      <button
                        type="button"
                        onClick={() => setView("pathlock")}
                        className="mt-3 rounded-md border border-[var(--void-gold)] bg-[var(--void-gold-subtle)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--void-gold-tint)] hover:bg-[var(--void-gold-subtle)]"
                      >
                        Open Locke's offer →
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
              <div className="rounded-md border void-border-system void-bg-canvas p-5">
                <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                  Gate {currentOpponent.actStep} · {currentOpponent.name}
                </p>
                <p className="mt-2 font-serif text-[14px] void-text-system">
                  {currentOpponent.backstory}
                </p>
                {dialog?.frameIntro && (
                  <p className={`mt-3 font-serif italic text-[12px] leading-relaxed void-text-system`}>
                    {dialog.frameIntro}
                  </p>
                )}
                <p className={`mt-3 font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                  Pre-match
                </p>
                <p className="mt-1 font-serif italic text-[13px] void-text-system">
                  "{currentOpponent.preMatchLine}"
                </p>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setView("ladder")}
                  className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider void-text-system void-text-system"
                >
                  <ChevronLeft size={12} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleEngage}
                  className="flex items-center gap-2 rounded border void-border-system void-bg-system px-4 py-2 font-mono text-[10px] uppercase tracking-wider void-text-system void-bg-system"
                >
                  <Play size={12} />
                  Engage
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
              <div className="rounded-md border void-border-system void-bg-canvas p-5">
                <div className="flex items-center justify-between">
                  <p className={`font-mono text-[9px] uppercase tracking-wider ${subAccent}`}>
                    {postMatchResult.outcome === "win" ? "Gate passed" : "Gate held"}
                  </p>
                  <button
                    type="button"
                    onClick={handlePostMatchContinue}
                    className="void-text-system void-text-system"
                    aria-label="Close"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="mt-2 font-serif text-[14px] italic void-text-system">
                  {postMatchResult.outcome === "win"
                    ? postMatchResult.opponent.postMatchWin
                    : postMatchResult.opponent.postMatchLoss}
                </p>
                {dialog && (
                  <p className={`mt-3 font-serif italic text-[12px] leading-relaxed void-text-system`}>
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
                  className="rounded border void-border-system void-bg-system px-4 py-2 font-mono text-[10px] uppercase tracking-wider void-text-system void-bg-system"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {view === "pathlock" && (
            <motion.div
              key="pathlock"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <div className="rounded-md border border-[var(--void-gold)] bg-[var(--void-gold-subtle)] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--void-gold)]">
                  Inbox · Adjudicator Locke
                </p>
                <p className="mt-1 font-display text-xl text-[var(--void-gold-tint)]">
                  The Offer (final form)
                </p>
                <p className="mt-3 font-serif italic text-[13px] leading-relaxed text-[var(--void-gold-tint)]">
                  You have walked the substrate ladder. Three gates,
                  three echoes of Kael, three confirmations that you
                  can move down there without being eaten.
                </p>
                <p className="mt-3 font-serif italic text-[13px] leading-relaxed text-[var(--void-gold-tint)]">
                  The Trade Empire's real lanes are still patrolled.
                  Real runs need cover. I am offering you three. Pick
                  one. The other two will close behind you.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {PATH_LOCK_CHOICES.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => handlePathLockChoice(choice)}
                    className="text-left rounded-md border border-[var(--void-gold)] bg-[var(--void-surface)] p-4 hover:border-[var(--void-gold-tint)] hover:bg-[var(--void-gold-subtle)] transition-colors"
                    data-testid={`act3-pathlock-${choice.id}`}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--void-gold)]">
                      {choice.cover}
                    </p>
                    <p className="mt-2 font-display text-base text-[var(--void-gold-tint)]">
                      {choice.label}
                    </p>
                    <p className="mt-2 font-serif italic text-[12px] leading-relaxed text-[var(--void-gold-tint)]">
                      {choice.rationale}
                    </p>
                  </button>
                ))}
              </div>
              <p className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--void-gold)]">
                — L.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

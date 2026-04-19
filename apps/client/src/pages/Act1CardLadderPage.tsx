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
import { getTauntHooksForOpponent } from "@shared/actOpponentTaunts";
import { getNextAct1Opponent } from "@shared/witnessingRuntime";
import { useAct1LadderStore } from "@/stores/act1CardLadderStore";
import { useGame } from "@/contexts/GameContext";
import { playSlideshow } from "@/stores/witnessingStore";
import DuelystGameUI from "@/game/duelyst/DuelystGameUI";
import {
  ActNOpponentTauntOverlay,
  type ActNTauntPhase,
} from "@/components/act1/ActNOpponentTauntOverlay";
// Type alias kept for the wiring tests in Act1OpponentTauntOverlay.test.ts;
// the page no longer mounts the Act-1-only component but still uses the
// "Act1TauntPhase" name internally for parity with existing test guards.
type Act1TauntPhase = ActNTauntPhase;
import { Act1CycleCAuthorityWitnessing } from "@/components/act1/Act1CycleCAuthorityWitnessing";
import {
  Act1AskSpeakerToggle,
  Act1CompanionPanel,
} from "@/components/act1/Act1CompanionPanel";
import { CompanionAskPanel } from "@/components/companion/CompanionAskPanel";
import { fireCompanionComment } from "@/lib/companionCommentQueue";
import {
  FACTION_COLORS,
  FACTION_NAMES,
  type Faction,
} from "@/game/duelyst/types";
import LivingBackground from "@/components/LivingBackground";

type LadderView =
  | "ladder"
  | "matchup"
  | "battle"
  | "postmatch"
  | "cycle_c_witnessing";

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
  const [tauntPhase, setTauntPhase] = useState<Act1TauntPhase | null>(null);

  /**
   * Fires early/mid/late taunts on opponent turns 1/3/5. Using the
   * opponent-turn boundary (not absolute turn number) keeps the
   * cadence stable across matches where the player acts first.
   */
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

  /**
   * HP-threshold escalator: when the opponent's general drops
   * through 60% or 30%, bump the taunt phase forward so players who
   * sprint past the turn triggers still see every beat.
   */
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
    // Fire the first-opponent bookends on step 1 of the ladder.
    if (currentOpponent.act1Step === 1) {
      fireCompanionComment("act1_first_opponent_entered");
    }
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
    // If the player just finished the Authority (step 12) WIN, move
    // into the Cycle C Witnessing sequence before returning to the
    // ladder. Losses skip straight back to ladder so the player can
    // retry without the finale re-firing.
    const justBeatAuthority =
      postMatchResult?.outcome === "win" &&
      postMatchResult?.opponent.act1Step === 12;
    setPostMatchResult(null);
    setTauntPhase(null);
    setView(justBeatAuthority ? "cycle_c_witnessing" : "ladder");
  }, [postMatchResult]);

  const handleCycleCComplete = useCallback(() => {
    setView("ladder");
  }, []);

  /* ─── RENDER ─── */

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bg-void)] to-[var(--bg-void)] relative">
      <LivingBackground
        src="/art/rooms/room-archives.png"
        accent="var(--energy-accent)"
        opacity={0.1}
        particleCount={4}
        scanlines={false}
      />
      <div className="relative z-10">
        {/* Header — shown on all views except the full-screen battle */}
        {view !== "battle" && (
          <div className="border-b void-border-subtle void-bg-canvas backdrop-blur-sm">
            <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link
                    href="/witnessing"
                    className="void-text-dim void-text-accent transition-colors"
                    aria-label="Back to Witnessing Hub"
                  >
                    <ChevronLeft size={18} />
                  </Link>
                  <div>
                    <h1 className="font-display text-lg font-bold tracking-wider void-text-accent flex items-center gap-2">
                      <Swords size={16} className="void-text-accent" />
                      THE TWELVE STEPS
                    </h1>
                    <p className="font-mono text-[10px] void-text-dim tracking-wider">
                      Act 1 · Dischordia Ladder · {wins}/12
                    </p>
                  </div>
                </div>
                <p className="font-mono text-[10px] void-text-dim">
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

            {view === "cycle_c_witnessing" && (
              <motion.div
                key="cycle_c_witnessing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Act1CycleCAuthorityWitnessing
                  onComplete={handleCycleCComplete}
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
        <div className="rounded-md border void-border void-bg-sunk p-5 text-center">
          <Trophy size={28} className="mx-auto mb-2 void-text-accent" />
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] void-text-accent">
            TWELVE STEPS COMPLETE
          </p>
          <p className="mt-2 font-serif text-sm void-text">
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
                  ? "void-border void-bg-sunk"
                  : isCurrent
                  ? "void-border void-bg-sunk shadow-[0_0_20px_color-mix(in_oklch,var(--energy-success)_10%,transparent)]"
                  : "void-border-subtle void-bg-canvas opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border text-[10px] font-mono ${
                    defeated
                      ? "void-border void-text-accent"
                      : isCurrent
                      ? "void-border void-text-energy"
                      : "void-border-subtle void-text-dim"
                  }`}
                >
                  {opponent.act1Step}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`font-display text-sm ${
                        defeated
                          ? "void-text-accent"
                          : isCurrent
                          ? "void-text-energy"
                          : "void-text-dim"
                      }`}
                    >
                      {opponent.name}
                    </h3>
                    {defeated && (
                      <CheckCircle2 size={12} className="void-text-accent" />
                    )}
                    {isLocked && (
                      <Lock size={10} className="void-text-muted" />
                    )}
                  </div>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider void-text-muted">
                    {opponent.cycle.replace(/_/g, " ")}
                  </p>
                  {(defeated || isCurrent) && (
                    <p className="mt-1 font-serif text-[12px] void-text-dim">
                      {opponent.backstory}
                    </p>
                  )}
                </div>
                {isCurrent && (
                  <button
                    type="button"
                    onClick={onOpenMatchup}
                    className="shrink-0 flex items-center gap-1.5 rounded-sm border void-border void-bg-sunk px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider void-text-energy void-border void-bg-sunk transition-colors"
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
  const { state: gameState } = useGame();
  const opponentFaction = resolveOpponentFaction(opponent);
  const opponentColor = FACTION_COLORS[opponentFaction];
  const dialog = getAct1OpponentDialog(opponent.id);
  const flags = useMemo(
    () =>
      new Set(
        Object.entries(gameState.narrativeFlags)
          .filter(([, v]) => v)
          .map(([k]) => k),
      ),
    [gameState.narrativeFlags],
  );
  const [askSpeaker, setAskSpeaker] = useState<"elara" | "human" | null>(null);
  return (
    <div className="space-y-6">
      {/* Engineer memoir frame — opens every Act 1 match */}
      {dialog && (
        <div className="rounded-md border void-border void-bg-canvas p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] void-text-dim">
            Engineer · memoir
          </p>
          <p className="mt-2 font-serif text-[13px] leading-relaxed void-text-accent">
            {dialog.engineerMemoirIntro}
          </p>
        </div>
      )}

      {/* Opponent card */}
      <div
        className="rounded-md border p-6"
        style={{
          borderColor: `${opponentColor}60`,
          background: `radial-gradient(circle at 50% 0%, ${opponentColor}15, transparent 70%), color-mix(in oklch, var(--bg-void) 80%, black 20%)`,
        }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] void-text-dim">
          STEP {opponent.act1Step} · {opponent.cycle.replace(/_/g, " ")}
        </p>
        <h2 className="mt-1 font-display text-2xl void-text-accent">
          {opponent.name}
        </h2>
        <p className="mt-3 font-serif text-[13px] leading-relaxed void-text">
          {opponent.backstory}
        </p>
        <div className="mt-4 border-l-2 void-border pl-4">
          <p className="font-mono text-[9px] uppercase tracking-wider void-text-dim">
            Their opening line
          </p>
          <p className="mt-1 font-serif italic text-sm void-text-accent">
            "{opponent.preMatchLine}"
          </p>
        </div>
        {dialog && (
          <Act1CompanionPanel
            elaraLabel="Elara · recognition"
            elaraText={dialog.elaraPreMatch}
            humanLabel="The Human · counter-perspective"
            humanText={dialog.humanPreMatch}
          />
        )}
        <p
          className="mt-4 font-mono text-[10px] uppercase tracking-wider"
          style={{ color: opponentColor }}
        >
          Deck · {FACTION_NAMES[opponentFaction]}
        </p>
      </div>

      {/* Ask a companion — optional, non-blocking */}
      <div className="rounded-md border void-border void-bg-canvas p-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] void-text-muted">
            Ask a companion
          </p>
          <Act1AskSpeakerToggle
            active={askSpeaker}
            onToggle={(speaker) =>
              setAskSpeaker(askSpeaker === speaker ? null : speaker)
            }
          />
        </div>
        {askSpeaker && (
          <div className="mt-3">
            <CompanionAskPanel
              speaker={askSpeaker}
              flags={flags}
              currentAct={gameState.narrativeAct || 1}
              onClose={() => setAskSpeaker(null)}
            />
          </div>
        )}
      </div>

      {/* Player faction picker */}
      <div className="rounded-md border void-border-subtle void-bg-canvas p-5">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] void-text-accent">
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
                    ? "void-border void-bg-sunk void-text-accent"
                    : "void-border-subtle void-bg-canvas void-text-dim void-border void-text-accent"
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
          className="flex items-center gap-2 rounded-sm border void-border-subtle void-bg-canvas px-4 py-2 font-mono text-[10px] uppercase tracking-wider void-text-dim void-text-accent void-border transition-colors"
        >
          <X size={12} />
          Back to ladder
        </button>
        <button
          type="button"
          onClick={onEngage}
          disabled={!playerFaction}
          className="flex items-center gap-2 rounded-sm border void-border void-bg-sunk px-5 py-2 font-mono text-[11px] uppercase tracking-wider void-text-energy void-border void-bg-sunk transition-colors disabled:cursor-not-allowed disabled:opacity-40"
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
  // Outcome chrome: win = sunk surface, loss = sunk surface with
  // error-axis tint. Inline style for the tint since there's no
  // utility class that mixes the sunk bg with --energy-error yet.
  const accent = "void-border void-bg-sunk";
  const accentStyle =
    outcome === "loss"
      ? {
          backgroundColor:
            "color-mix(in oklch, var(--bg-sunk) 70%, var(--energy-error) 30%)",
        }
      : undefined;
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
    <div className={`rounded-md border p-6 ${accent}`} style={accentStyle}>
      <div className="flex items-center gap-2">
        <Icon size={16} className="void-text-accent" />
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] void-text-accent">
          {label} · STEP {opponent.act1Step}
        </p>
      </div>
      <h2 className="mt-2 font-display text-xl void-text-accent">
        {opponent.name}
      </h2>
      <p className="mt-4 font-serif text-[14px] leading-relaxed void-text">
        {body}
      </p>
      {elaraLine && humanLine && (
        <Act1CompanionPanel
          elaraLabel="Elara · reflection"
          elaraText={elaraLine}
          humanLabel="The Human · counter-reflection"
          humanText={humanLine}
        />
      )}
      {engineerClose && (
        <div className="mt-4 rounded border void-border void-bg-canvas p-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] void-text-dim">
            Engineer · memoir closes
          </p>
          <p className="mt-1 font-serif italic text-[13px] leading-relaxed void-text-accent">
            {engineerClose}
          </p>
        </div>
      )}
      {opponent.postBattleSlideshow && outcome === "win" && (
        <p className="mt-3 font-mono text-[10px] void-text-dim">
          · Cinematic queued: {opponent.postBattleSlideshow}
        </p>
      )}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          className="flex items-center gap-2 rounded-sm border void-border void-bg-sunk px-4 py-2 font-mono text-[10px] uppercase tracking-wider void-text-accent void-border-subtle void-bg-sunk transition-colors"
        >
          Continue
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ACT 1 C4 TRIAL PAGE — Wayne Warden's Authority Tribunal

   Unlike the card-ladder pages for Cycles A/B/C1-C3, C4
   uses the Trial format: jury cards + evidence cards vs.
   a verdict scroll, no health pools, no duel engine.

   Three views, mirroring the structure of Act4MatchPage:
     - matchup:  Wayne's opening, six crystal coffins lit,
                 verdict scroll blank, Engineer's hand
     - trial:    the state-machine loop — Tribunal plays,
                 Engineer counters (or passes), repeat
     - postmatch: canonical §2.13 win or loss beat

   The engine logic lives in trialFormat.ts (pure, tested).
   This page is the UI surface + localStorage persistence
   via useAct1C4TrialStore.

   Spec references: Act 1 Ship-Ready Bible §2.13, §16.
   ═══════════════════════════════════════════════════════ */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Scale, Hammer, Play, X } from "lucide-react";
import { getAct1Opponent } from "@shared/act1Opponents";
import {
  JURY_CARDS,
  EVIDENCE_CARDS,
  canCounter,
  type TribunalCard,
} from "@/game/duelyst/trialFormat";
import {
  useAct1C4TrialStore,
  CANONICAL_ENGINEER_HAND,
} from "@/stores/act1C4TrialStore";

type TrialView = "matchup" | "trial" | "postmatch";

/** Map engineer card id → display name for the hand UI. */
const ENGINEER_CARD_NAMES: Record<string, string> = {
  countermelody: "The Countermelody",
  jar_wouldnt_close: "The Jar That Wouldn't Close",
  first_card: "The First Card",
  iron_stance: "The Iron Stance",
  recruiters_gift: "The Recruiter's Gift",
  weapon_i_didnt_build: "The Weapon I Didn't Build",
  memorized_page: "The Memorized Page",
  classmates_compass: "The Classmate's Compass",
  only_reason_i_stayed: "The only reason I stayed",
  standstill: "The Standstill",
  converter: "The Converter",
  friend_i_saved: "The Friend I Saved",
};

function cardLabel(id: string): string {
  return ENGINEER_CARD_NAMES[id] ?? id;
}

export default function Act1C4TrialPage() {
  const [view, setView] = useState<TrialView>("matchup");
  const opponent = getAct1Opponent("wayne_warden");
  const store = useAct1C4TrialStore();
  const { state } = store;

  // Derive UI state from the state machine.
  const pending = state.pendingTribunalCard;
  const outcome = state.outcome;

  // Switch to postmatch automatically when the engine resolves.
  useEffect(() => {
    if (outcome !== null && view === "trial") {
      setView("postmatch");
    }
  }, [outcome, view]);

  const handleStart = (): void => {
    store.advanceTribunal();
    setView("trial");
  };

  const handleCounter = (cardId: string | null): void => {
    store.counterWith(cardId);
    // The store has resolved; advance the tribunal for the next turn,
    // unless the outcome already landed (handled by the useMemo above).
    setTimeout(() => {
      const latest = useAct1C4TrialStore.getState().state;
      if (latest.outcome === null) {
        useAct1C4TrialStore.getState().advanceTribunal();
      }
    }, 400);
  };

  const handleReset = (): void => {
    store.reset();
    setView("matchup");
  };

  if (!opponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-amber-300 font-mono">
        <p>Wayne Warden opponent data not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0608] via-[#1a0808] to-[#0c0608] text-amber-50 font-serif">
      <TopNav />

      <AnimatePresence mode="wait">
        {view === "matchup" && (
          <MatchupView key="matchup" onStart={handleStart} />
        )}
        {view === "trial" && (
          <TrialView
            key="trial"
            inkLines={state.inkLines}
            pending={pending}
            engineerHand={state.engineerHand}
            onCounter={handleCounter}
            canCounterWith={(cardId) => canCounter(state, cardId)}
          />
        )}
        {view === "postmatch" && outcome !== null && (
          <PostMatchView
            key="postmatch"
            outcome={outcome.kind}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── SUB-COMPONENTS ─── */

function TopNav() {
  return (
    <div className="border-b border-amber-900/40 bg-black/50 backdrop-blur px-6 py-3 flex items-center gap-4">
      <Link href="/" className="text-amber-300/70 hover:text-amber-300">
        <ChevronLeft className="w-5 h-5 inline" /> Home
      </Link>
      <div className="flex-1" />
      <div className="text-amber-300/60 text-sm tracking-widest uppercase">
        Cycle C4 — Authority Tribunal
      </div>
    </div>
  );
}

function MatchupView({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto px-6 py-16 space-y-8"
    >
      <header className="space-y-3 text-center">
        <div className="text-amber-300/60 text-xs tracking-[0.3em] uppercase">
          Cycle C4
        </div>
        <h1 className="text-4xl font-bold text-amber-50">
          Wayne Warden
        </h1>
        <div className="text-amber-300/70 italic">Authority's Tribunal</div>
      </header>

      <CrystalCoffins />

      <div className="bg-black/60 border border-amber-900/40 rounded-lg p-6 space-y-4">
        <blockquote className="text-amber-100/90 leading-relaxed italic">
          "The defendant will rise. The chamber is in session. The charges
          have been entered into the record and read in absentia. What do
          you say to the charges?"
        </blockquote>
        <div className="text-amber-300/60 text-sm">— Wayne Warden, §2.13</div>
      </div>

      <div className="bg-black/40 border border-amber-900/30 rounded-lg p-4 text-sm space-y-2 text-amber-100/80">
        <p>
          <strong className="text-amber-300">Trial format.</strong> No health
          pools. The Tribunal plays jury + evidence cards; the verdict
          scroll fills to 10 ink lines (loss) or the Tribunal runs out of
          cards (win).
        </p>
        <p>
          You defend with your accumulated Act 1 deck. Thematic evidence
          counters cancel the ink entirely; any card delays a jury card.
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onStart}
          className="bg-amber-700 hover:bg-amber-600 text-black font-bold px-8 py-3 rounded-lg flex items-center gap-2 transition"
        >
          <Play className="w-5 h-5" /> I will let the deck answer.
        </button>
      </div>
    </motion.div>
  );
}

function TrialView({
  inkLines,
  pending,
  engineerHand,
  onCounter,
  canCounterWith,
}: {
  inkLines: number;
  pending: TribunalCard | null;
  engineerHand: readonly string[];
  onCounter: (cardId: string | null) => void;
  canCounterWith: (cardId: string) => boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6"
    >
      {/* Main trial area */}
      <section className="space-y-6">
        <CrystalCoffins />

        <PendingCard card={pending} />

        <EngineerHand
          hand={engineerHand}
          onCounter={onCounter}
          canCounterWith={canCounterWith}
          pending={pending}
        />
      </section>

      {/* Verdict scroll sidebar */}
      <aside className="space-y-4">
        <VerdictScroll inkLines={inkLines} />
      </aside>
    </motion.div>
  );
}

function CrystalCoffins() {
  return (
    <div className="grid grid-cols-6 gap-2 max-w-2xl mx-auto">
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.55, 0.85, 0.55] }}
          transition={{
            duration: 3.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
          className="h-20 bg-gradient-to-b from-amber-900/30 to-amber-700/20 border border-amber-600/40 rounded-sm"
        />
      ))}
    </div>
  );
}

function PendingCard({ card }: { card: TribunalCard | null }) {
  if (!card) {
    return (
      <div className="bg-black/60 border border-amber-900/30 rounded-lg p-6 text-center text-amber-300/50 italic">
        Awaiting the Tribunal…
      </div>
    );
  }

  const kindLabel =
    card.kind === "jury" ? "Jury Card" : "Evidence Card";
  const weightColor =
    card.weight === 1
      ? "text-amber-300"
      : card.weight === 2
      ? "text-orange-400"
      : card.weight === 3
      ? "text-red-400"
      : "text-red-500";

  return (
    <motion.div
      key={card.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-b from-[#2a0a0a] to-black border-2 border-amber-700/50 rounded-lg p-6 space-y-3"
    >
      <div className="flex items-center justify-between text-xs tracking-widest uppercase">
        <span className="text-amber-300/70">{kindLabel}</span>
        <span className={`${weightColor} font-bold`}>
          Weight {card.weight}
          {card.unanswerable ? " — unanswerable" : ""}
        </span>
      </div>
      <h3 className="text-xl font-bold text-amber-100">{card.name}</h3>
      {card.flavor && (
        <p className="text-amber-200/60 italic text-sm leading-relaxed">
          {card.flavor}
        </p>
      )}
    </motion.div>
  );
}

function EngineerHand({
  hand,
  onCounter,
  canCounterWith,
  pending,
}: {
  hand: readonly string[];
  onCounter: (cardId: string | null) => void;
  canCounterWith: (cardId: string) => boolean;
  pending: TribunalCard | null;
}) {
  const disabled = pending === null;
  return (
    <div className="space-y-3">
      <div className="text-amber-300/70 text-xs tracking-widest uppercase">
        Your deck — {hand.length} cards
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {hand.map((cardId) => {
          const canUse = !disabled && canCounterWith(cardId);
          return (
            <button
              key={cardId}
              onClick={() => onCounter(cardId)}
              disabled={disabled || !canUse}
              className={`text-left p-3 rounded border transition ${
                canUse
                  ? "bg-amber-900/30 border-amber-600/50 hover:bg-amber-800/40 hover:border-amber-500 text-amber-50"
                  : "bg-black/40 border-amber-900/20 text-amber-200/30 cursor-not-allowed"
              }`}
            >
              <div className="text-sm font-semibold">{cardLabel(cardId)}</div>
              {canUse && (
                <div className="text-xs text-amber-400/70 mt-1">
                  thematic counter
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="pt-2">
        <button
          onClick={() => onCounter(null)}
          disabled={disabled}
          className="w-full p-3 rounded border border-red-900/40 bg-black/40 hover:bg-red-950/30 text-red-300/80 text-sm transition disabled:opacity-50"
        >
          Accept the ink (no counter)
        </button>
      </div>
    </div>
  );
}

function VerdictScroll({ inkLines }: { inkLines: number }) {
  const MAX = 10;
  return (
    <div className="bg-[#f4e4bc]/10 border border-amber-700/50 rounded-lg p-4 sticky top-6">
      <div className="flex items-center gap-2 mb-3">
        <Scale className="w-5 h-5 text-amber-400" />
        <h3 className="text-amber-100 font-bold tracking-widest uppercase text-xs">
          Verdict Scroll
        </h3>
      </div>
      <div className="space-y-1">
        {Array.from({ length: MAX }, (_, i) => {
          const filled = i < inkLines;
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{
                backgroundColor: filled
                  ? "rgba(26, 20, 16, 0.85)"
                  : "rgba(244, 228, 188, 0.08)",
              }}
              transition={{ duration: 0.4 }}
              className="h-4 rounded-sm border border-amber-900/30"
            />
          );
        })}
      </div>
      <div className="mt-3 text-center text-amber-300/70 text-sm font-mono">
        {inkLines} / {MAX}
      </div>
      {inkLines >= 7 && inkLines < MAX && (
        <div className="mt-3 text-center text-red-400/80 text-xs italic">
          The Tribunal is near sentence.
        </div>
      )}
    </div>
  );
}

function PostMatchView({
  outcome,
  onReset,
}: {
  outcome: "win" | "loss";
  onReset: () => void;
}) {
  const isWin = outcome === "win";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto px-6 py-16 space-y-8"
    >
      <header className="text-center space-y-3">
        <Hammer className="w-12 h-12 mx-auto text-amber-500" />
        <h2 className="text-3xl font-bold text-amber-50">
          {isWin ? "The Tribunal Recesses" : "Sentence"}
        </h2>
      </header>

      <div className="bg-black/60 border border-amber-900/40 rounded-lg p-6 space-y-4">
        {isWin ? (
          <>
            <p className="text-amber-100/90 italic leading-relaxed">
              "The Tribunal has not been outmatched in this chamber in
              nineteen years. The deck has answered. The Authority will
              consult and reconvene. You will be returned to holding."
            </p>
            <p className="text-amber-200/70 italic text-sm">
              Later, quietly, only to you:
            </p>
            <p className="text-amber-100/90 italic leading-relaxed">
              "You have until morning to decide what you want recorded.
              A microphone will be brought to your cell. Use it well."
            </p>
          </>
        ) : (
          <>
            <p className="text-amber-100/90 italic leading-relaxed">
              "The defendant is found guilty under all entered charges.
              Sentence: termination, by Authority protocol, to be carried
              out at first light. The deck has answered. The Tribunal
              records its decision."
            </p>
            <p className="text-red-300/80 italic text-sm leading-relaxed">
              "You will be granted a final recording before execution.
              Authority protocol. The microphone will be present in the
              chamber. You may speak for as long as the recording medium
              allows. Begin when ready."
            </p>
          </>
        )}
        <div className="text-amber-300/60 text-sm pt-2">— §2.13</div>
      </div>

      <div className="bg-amber-900/10 border border-amber-800/30 rounded-lg p-4 text-center text-amber-200/80 text-sm italic">
        The <em>Last Words</em> slideshow fires next (§17) with the{" "}
        {isWin ? "win-path cell-private" : "loss-path chamber-public"}{" "}
        framing.
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={onReset}
          className="border border-amber-600/40 text-amber-200 hover:bg-amber-900/30 px-6 py-2 rounded transition flex items-center gap-2"
        >
          <X className="w-4 h-4" /> Replay
        </button>
        <Link
          href="/"
          className="bg-amber-700 hover:bg-amber-600 text-black font-bold px-6 py-2 rounded transition"
        >
          Return to Ark
        </Link>
      </div>
    </motion.div>
  );
}

/* Surface the canonical card catalog on import so other modules can
   render it without re-reaching into trialFormat.ts. */
export const ACT1_C4_JURY_CARDS = JURY_CARDS;
export const ACT1_C4_EVIDENCE_CARDS = EVIDENCE_CARDS;
export const ACT1_C4_ENGINEER_HAND = CANONICAL_ENGINEER_HAND;

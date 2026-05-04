/* ═══════════════════════════════════════════════════════
   HAMLET CONSPIRACY BOARD PAGE — The Artist Prince Mystery

   Renders the conspiracy board the player assembles across the
   12 Celebration episodes (with one Mechronis-side cross-school
   clue). Backed by apps/shared/artistPrinceMystery.ts.

   The board's headline question is:
       "How did the FIRST Celebration end?"

   Three surfaces:
     1. CLUES — cards collected so far, with the Antiquarian's
        framing for each
     2. CONNECTIONS — pinned strings between clues; each
        connection unlocks an inference + the Antiquarian's
        archival voice when the player makes it
     3. FINAL CONNECTION — once Mol'Garath's audience completes
        AND all 7 required clues are gathered, the player names
        the Warlord's substrate. Naming "the loop itself"
        correctly fires the trap in Act 6 (HAMLET_FINAL_CONNECTION_FLAG).

   See plan §5 (The Mystery as Gameplay) and §7.5 (Mol'Garath's
   Audience).
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Check, Lock, Sparkles } from "lucide-react";
import {
  CLUE_CARDS,
  BOARD_CONNECTIONS,
  getAvailableConnections,
  boardCompletionPercent,
  type ClueId,
} from "@shared/artistPrinceMystery";
import {
  HAMLET_FINAL_CONNECTION,
  isHamletConnectionUnlocked,
} from "@shared/molGarathEndgameLayer";
import { useGame } from "@/contexts/GameContext";
import {
  MOL_GARATH_AUDIENCE_FLAG,
  HAMLET_FINAL_CONNECTION_FLAG,
} from "@shared/matrixSaveFlags";

const CONNECTION_MADE_FLAG_PREFIX = "hamlet_connection_";

export default function HamletConspiracyBoardPage() {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};

  const cluesCollected = useMemo<ReadonlySet<ClueId>>(() => {
    const set = new Set<ClueId>();
    for (const card of CLUE_CARDS) {
      // Each Celebration / Mechronis episode that surfaces a clue persists a
      // hamlet-clue flag at completion. For first-pass shipping we accept the
      // canonical hamlet_clue_<id> key OR derive from the source-episode
      // completion flag (so the clue surfaces as soon as the episode is done).
      const directFlag = `hamlet_clue_${card.id}`;
      const episodeDoneFlag = `matrix_episode_${card.sourceEpisodeId}_complete`;
      if (flags[directFlag] || flags[episodeDoneFlag]) set.add(card.id);
    }
    return set;
  }, [flags]);

  const connectionsMade = useMemo<ReadonlySet<string>>(() => {
    const set = new Set<string>();
    for (const conn of BOARD_CONNECTIONS) {
      if (flags[`${CONNECTION_MADE_FLAG_PREFIX}${conn.id}`]) set.add(conn.id);
    }
    return set;
  }, [flags]);

  const audienceComplete = Boolean(flags[MOL_GARATH_AUDIENCE_FLAG]);
  const finalConnectionMade = Boolean(flags[HAMLET_FINAL_CONNECTION_FLAG]);

  const finalUnlocked = isHamletConnectionUnlocked(cluesCollected, audienceComplete);

  const completion = boardCompletionPercent({ cluesCollected, connectionsMade });

  const availableConnections = useMemo(
    () => getAvailableConnections({ cluesCollected, connectionsMade }),
    [cluesCollected, connectionsMade],
  );

  const onMakeConnection = (connId: string) => {
    setNarrativeFlag(`${CONNECTION_MADE_FLAG_PREFIX}${connId}`, true);
  };

  return (
    <div
      data-page="hamlet-conspiracy-board"
      className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-8"
    >
      <header className="max-w-5xl mx-auto mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ChevronLeft size={18} />
          <span>Back</span>
        </Link>
        <div className="text-zinc-500 text-sm tabular-nums">
          {completion}% of the board pinned
        </div>
      </header>

      <main className="max-w-5xl mx-auto space-y-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-zinc-500">
            The Antiquarian's Conspiracy Board
          </div>
          <h1 className="text-2xl font-semibold mt-1">How did the first Celebration end?</h1>
        </div>

        <CluesGrid cluesCollected={cluesCollected} />

        <ConnectionsPanel
          connectionsMade={connectionsMade}
          availableConnections={availableConnections}
          onMakeConnection={onMakeConnection}
        />

        <FinalConnectionPanel
          unlocked={finalUnlocked}
          alreadyAnswered={finalConnectionMade}
          audienceComplete={audienceComplete}
          cluesCount={cluesCollected.size}
          onCorrectAnswer={() =>
            setNarrativeFlag(HAMLET_FINAL_CONNECTION_FLAG, true)
          }
        />
      </main>
    </div>
  );
}

/* ─── Clues grid ─── */

function CluesGrid({ cluesCollected }: { cluesCollected: ReadonlySet<ClueId> }) {
  return (
    <section>
      <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-3">
        Clues · {cluesCollected.size} / {CLUE_CARDS.length}
      </h2>
      <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {CLUE_CARDS.map((card) => {
          const found = cluesCollected.has(card.id);
          return (
            <li
              key={card.id}
              className={`rounded-md border p-3 ${found ? "border-amber-700/40 bg-amber-950/10" : "border-zinc-800 bg-zinc-900/30 opacity-50"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                {found ? (
                  <Sparkles size={14} className="text-amber-500 shrink-0" />
                ) : (
                  <Lock size={12} className="text-zinc-600 shrink-0" />
                )}
                <span className="font-medium text-sm truncate">{card.title}</span>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-3">
                {found ? card.framing : "Not yet collected. Surfaces when the source episode is complete."}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ─── Connections panel ─── */

function ConnectionsPanel({
  connectionsMade,
  availableConnections,
  onMakeConnection,
}: {
  connectionsMade: ReadonlySet<string>;
  availableConnections: readonly { id: string; inference: string; antiquarianResponse: string }[];
  onMakeConnection: (connId: string) => void;
}) {
  return (
    <section>
      <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-3">
        Connections · {connectionsMade.size} / {BOARD_CONNECTIONS.length}
      </h2>

      {availableConnections.length === 0 && connectionsMade.size === 0 && (
        <p className="text-zinc-500 italic text-sm">
          No connections available yet. Collect more clues by completing
          Celebration episodes; pinned strings will appear here.
        </p>
      )}

      <div className="space-y-3">
        {availableConnections.map((conn) => (
          <article
            key={conn.id}
            className="rounded-md border border-zinc-700 bg-zinc-900/40 p-4"
          >
            <p className="text-zinc-200 mb-2">{conn.inference}</p>
            <button
              type="button"
              onClick={() => onMakeConnection(conn.id)}
              className="text-xs px-3 py-1 rounded border border-zinc-700 hover:border-zinc-500"
            >
              Pin this connection
            </button>
          </article>
        ))}

        {BOARD_CONNECTIONS.filter((c) => connectionsMade.has(c.id)).map((conn) => (
          <article
            key={conn.id}
            className="rounded-md border border-amber-700/40 bg-amber-950/10 p-4"
          >
            <div className="flex items-start gap-2 mb-2">
              <Check size={14} className="text-amber-500 mt-1 shrink-0" />
              <p className="text-zinc-200">{conn.inference}</p>
            </div>
            <p className="text-xs text-amber-300/80 italic">
              The Antiquarian: "{conn.antiquarianResponse}"
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─── Final connection — Mol'Garath gate ─── */

function FinalConnectionPanel({
  unlocked,
  alreadyAnswered,
  audienceComplete,
  cluesCount,
  onCorrectAnswer,
}: {
  unlocked: boolean;
  alreadyAnswered: boolean;
  audienceComplete: boolean;
  cluesCount: number;
  onCorrectAnswer: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  if (alreadyAnswered) {
    return (
      <section className="rounded-lg border border-emerald-700/40 bg-emerald-950/10 p-6">
        <h2 className="text-sm uppercase tracking-widest text-emerald-400 mb-2">
          Final Connection · Named
        </h2>
        <p className="text-zinc-200 mb-2">
          The Warlord's substrate has been named. The Labyrinth is shorter by one
          entry.
        </p>
        <p className="text-zinc-400 italic text-sm">
          Mol'Garath, almost cheerful: "{HAMLET_FINAL_CONNECTION.correctReaction}"
        </p>
      </section>
    );
  }

  if (!unlocked) {
    const missingClues = HAMLET_FINAL_CONNECTION.requiredClues.length - cluesCount;
    return (
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-6 opacity-70">
        <h2 className="text-sm uppercase tracking-widest text-zinc-400 mb-2">
          Final Connection · Locked
        </h2>
        <p className="text-zinc-400 text-sm">
          {!audienceComplete
            ? "Mol'Garath has not yet granted you a private audience. Complete Tier 3 of his chess climb."
            : `The board needs ${Math.max(0, missingClues)} more required clues before you can name the substrate.`}
        </p>
      </section>
    );
  }

  const onSubmit = () => {
    if (!selected) return;
    if (selected === HAMLET_FINAL_CONNECTION.correctCandidateId) {
      setFeedback("correct");
      onCorrectAnswer();
    } else {
      setFeedback("incorrect");
    }
  };

  return (
    <section className="rounded-lg border border-amber-700/40 bg-amber-950/10 p-6">
      <h2 className="text-sm uppercase tracking-widest text-amber-300 mb-3">
        Final Connection · Name the Warlord's Substrate
      </h2>
      <p className="text-zinc-300 text-sm mb-4">
        Mol'Garath: "The substrate is the thing that makes the instance possible.
        Choose carefully — but I am not going anywhere. I have several centuries."
      </p>

      <ul className="space-y-2 mb-4">
        {HAMLET_FINAL_CONNECTION.candidates.map((candidate) => (
          <li key={candidate.id}>
            <button
              type="button"
              onClick={() => {
                setSelected(candidate.id);
                setFeedback(null);
              }}
              className={`w-full text-left rounded-md border p-3 transition-colors ${
                selected === candidate.id
                  ? "border-amber-500 bg-amber-900/20"
                  : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/40"
              }`}
            >
              <div className="font-medium text-sm">{candidate.displayName}</div>
              <div className="text-xs text-zinc-400 mt-1">
                {candidate.justification}
              </div>
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!selected}
        className="px-4 py-2 rounded-md border border-amber-600 bg-amber-900/30 hover:bg-amber-900/50 disabled:opacity-30 disabled:cursor-not-allowed text-sm"
      >
        Name the substrate
      </button>

      <AnimatePresence>
        {feedback === "correct" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-md border border-emerald-700/40 bg-emerald-950/20 p-4"
          >
            <p className="text-emerald-300 italic">
              {HAMLET_FINAL_CONNECTION.correctReaction}
            </p>
          </motion.div>
        )}
        {feedback === "incorrect" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-md border border-zinc-700 bg-zinc-900/50 p-4"
          >
            <p className="text-zinc-400 italic">
              {HAMLET_FINAL_CONNECTION.incorrectReaction}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

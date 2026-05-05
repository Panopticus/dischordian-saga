/* ═══════════════════════════════════════════════════════
   MOL'GARATH AUDIENCE PAGE — Endgame Referee Surface

   The post-Tier-3 chess climb private audience. Renders the
   already-canonical MOL_GARATH_EPILOGUE scene from
   apps/shared/tcg-core/story/molGarathEpilogue.ts cue-by-cue.

   On completion, persists MOL_GARATH_AUDIENCE_FLAG and unlocks:
     • Labyrinth annotations on every Engineer recording
     • Traps-in-design feed
     • Hamlet final connection (the player can now name the
       Warlord's substrate on the conspiracy board)

   Prerequisite: player has completed Tier 3 of the chess climb
   (chessClimbTiers.ts). Until that flag is set, the page renders
   a "not yet" placeholder.

   See plan §7.5 (Mol'Garath's Audience — The Long View Layer).
   ═══════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Eye, Check } from "lucide-react";
import { MOL_GARATH_EPILOGUE_SCENES } from "@shared/tcg-core/story/molGarathEpilogue";
import {
  LABYRINTH_ANNOTATIONS,
  TRAPS_IN_DESIGN,
} from "@shared/molGarathEndgameLayer";
import { useGame } from "@/contexts/GameContext";
import { MOL_GARATH_AUDIENCE_FLAG } from "@shared/matrixSaveFlags";

const TIER_3_COMPLETE_FLAG = "chess_climb_tier_3_complete";

export default function MolGarathAudiencePage() {
  const [, setLocation] = useLocation();
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};

  const tier3Complete = Boolean(flags[TIER_3_COMPLETE_FLAG]);
  const audienceComplete = Boolean(flags[MOL_GARATH_AUDIENCE_FLAG]);

  const scene = MOL_GARATH_EPILOGUE_SCENES[0];
  const [cueIndex, setCueIndex] = useState(0);
  const [done, setDone] = useState(audienceComplete);

  useEffect(() => {
    if (done && !audienceComplete) {
      setNarrativeFlag(MOL_GARATH_AUDIENCE_FLAG, true);
    }
  }, [done, audienceComplete, setNarrativeFlag]);

  if (!tier3Complete) {
    return <NotYetEligible />;
  }

  const advance = () => {
    if (done) return;
    if (cueIndex < scene.cues.length - 1) {
      setCueIndex(cueIndex + 1);
    } else {
      setDone(true);
    }
  };

  const cue = scene.cues[cueIndex];

  return (
    <div
      data-page="mol-garath-audience"
      className="min-h-screen void-bg-canvas void-text px-6 py-8"
    >
      <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 void-text void-text transition-colors"
        >
          <ChevronLeft size={18} />
          <span>Back</span>
        </Link>
        {!done && (
          <div className="void-text text-sm tabular-nums">
            {cueIndex + 1} / {scene.cues.length}
          </div>
        )}
      </header>

      <main className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest void-text">
            Mol'Garath the Unmaker · Archivist of the Labyrinth
          </div>
          <h1 className="text-2xl font-semibold mt-1">Private Audience</h1>
          <p className="void-text italic mt-1 text-sm">
            The chamber is older than any room you have entered before.
          </p>
        </div>

        <div
          className="rounded-lg border void-border void-bg-canvas p-8 cursor-pointer select-none"
          onClick={advance}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              advance();
            }
          }}
        >
          {!done ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={cueIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-xs uppercase tracking-widest void-text mb-1">
                  {cue.speaker === "mol_garath" ? "Mol'Garath" : "Narrator"}
                  {cue.mood ? ` · ${cue.mood}` : ""}
                </div>
                <p className="text-lg leading-relaxed void-text whitespace-pre-line">
                  {cue.text}
                </p>
              </motion.div>
            </AnimatePresence>
          ) : (
            <AudienceComplete onContinue={() => setLocation("/conspiracy-board")} />
          )}
        </div>

        {!done && (
          <p className="text-center text-xs void-text mt-4">
            click the panel or press space / enter to continue
          </p>
        )}

        {done && <AudienceUnlocks />}
      </main>
    </div>
  );
}

function NotYetEligible() {
  return (
    <div className="min-h-screen void-bg-canvas void-text px-6 py-8">
      <header className="max-w-4xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 void-text void-text"
        >
          <ChevronLeft size={18} />
          <span>Back</span>
        </Link>
      </header>
      <main className="max-w-3xl mx-auto text-center py-24">
        <Eye size={48} className="mx-auto opacity-30 mb-6" />
        <h1 className="text-xl font-semibold mb-2">No audience yet</h1>
        <p className="void-text max-w-md mx-auto">
          Mol'Garath does not grant audiences to those who have not completed
          his Tier 3 chess climb. He has, however, several centuries available.
        </p>
      </main>
    </div>
  );
}

function AudienceComplete({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="text-center">
      <Check size={36} className="mx-auto void-text-energy mb-4" />
      <h2 className="text-lg font-semibold mb-2">Audience concluded</h2>
      <p className="void-text mb-6 max-w-md mx-auto">
        The chamber folds behind you the way a chapter folds when you turn the
        page, which is to say it is still there but no longer the part you are
        reading.
      </p>
      <button
        type="button"
        onClick={onContinue}
        className="px-4 py-2 rounded-md border void-border void-border text-sm"
      >
        Open the Conspiracy Board
      </button>
    </div>
  );
}

function AudienceUnlocks() {
  return (
    <div className="mt-8 space-y-4">
      <div className="rounded-lg border void-border void-bg-sunk p-4">
        <h3 className="text-sm font-semibold void-text-accent mb-2">
          Labyrinth annotations unlocked
        </h3>
        <p className="text-xs void-text">
          Mol'Garath's margin notes — citing which Labyrinth trap each was
          dismantling — are now attached to all {LABYRINTH_ANNOTATIONS.length}{" "}
          Engineer recordings. Visit the Recordings panel to read them.
        </p>
      </div>
      <div className="rounded-lg border void-border void-bg-canvas p-4">
        <h3 className="text-sm font-semibold void-text mb-2">
          Traps-in-design feed live
        </h3>
        <p className="text-xs void-text">
          {TRAPS_IN_DESIGN.length} active traps tracked, sourced from Living
          Universe pressures. Read them with discipline. The list updates every
          hour.
        </p>
      </div>
      <div className="rounded-lg border void-border void-bg-canvas p-4">
        <h3 className="text-sm font-semibold void-text mb-2">
          Hamlet final connection unlocked
        </h3>
        <p className="text-xs void-text">
          You may now name the Warlord's substrate on the conspiracy board.
          Choose the substrate, not the instance. Mol'Garath is not going
          anywhere — he has several centuries.
        </p>
      </div>
    </div>
  );
}

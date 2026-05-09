/* ═══════════════════════════════════════════════════════
   HELLBOX PORTAL PAGE — Medbay → Matrix of Dreams Selector

   The runtime UI for the Hellbox. Renders three states from
   apps/shared/hellboxPortal.ts:
     - locked         (the device hasn't been discovered)
     - first_touch    (compelled-transport cinematic plays)
     - unlocked       (level selector, grouped by school)

   Selecting a level routes to /matrix/:episodeId, where
   MatrixSchoolEpisodePage plays the scenes.

   For first-pass shipping, this page reads completion state
   from in-memory React state. The persistent save-state hook
   is left as a follow-on (it integrates with the existing
   GameContext / flag system).

   See plan §4 (The Hellbox & The Two Schools as Matrix-of-
   Dreams Levels).
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Lock, Sparkles, Eye, Check } from "lucide-react";
import {
  HELLBOX_FIRST_TOUCH,
  buildSelectorModel,
  type HellboxAccessConditions,
  type HellboxSelectorGroup,
} from "@shared/hellboxPortal";
import { MATRIX_OF_DREAMS_LEVELS, type MatrixLevelDefinition } from "@shared/matrixOfDreamsLevels";
import { useGame } from "@/contexts/GameContext";
import {
  episodeCompletionFlag,
  HELLBOX_DISCOVERED_FLAG,
  HELLBOX_FIRST_TOUCH_FLAG,
} from "@shared/matrixSaveFlags";
import OpeningCinematicVideo from "@/components/OpeningCinematicVideo";
import { assetUrl } from "@/lib/assetUrl";

/** CDN URL of the Welcome to Celebration cinematic. The prose cinematic
 *  hands off to this video, which delivers the rampart arrival visually
 *  before C1's dialogue runs. Uploaded from
 *  apps/client/public/videos/openings/welcome-to-celebration/ via
 *  `pnpm assets:upload`. */
const WELCOME_TO_CELEBRATION_VIDEO_URL = assetUrl(
  "videos/openings/welcome-to-celebration/shot1.mp4",
);

/* ─── Component ─── */

export default function HellboxPortalPage() {
  const [, setLocation] = useLocation();
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};

  const hellboxDiscovered = Boolean(flags[HELLBOX_DISCOVERED_FLAG]);
  const firstTouchComplete = Boolean(flags[HELLBOX_FIRST_TOUCH_FLAG]);

  /** Two-stage first-touch handoff: the prose cinematic ends, then the
   *  Welcome to Celebration video plays before we route to C1. */
  const [welcomeVideoPlaying, setWelcomeVideoPlaying] = useState(false);

  const completedIds = useMemo<ReadonlySet<string>>(() => {
    const set = new Set<string>();
    for (const level of MATRIX_OF_DREAMS_LEVELS) {
      if (flags[episodeCompletionFlag(level.id)]) set.add(level.id);
    }
    return set;
  }, [flags]);

  const conditions: HellboxAccessConditions = {
    hellboxDiscovered,
    firstTouchComplete,
    inMedbay: true,
  };

  const model = useMemo(
    () => buildSelectorModel(conditions, completedIds),
    [hellboxDiscovered, firstTouchComplete, completedIds],
  );

  const onSelectLevel = useCallback(
    (level: MatrixLevelDefinition) => {
      setLocation(`/matrix/${level.id}`);
    },
    [setLocation],
  );

  const onMarkComplete = useCallback(
    (levelId: string) => {
      setNarrativeFlag(episodeCompletionFlag(levelId), true);
    },
    [setNarrativeFlag],
  );

  return (
    <div
      data-page="hellbox-portal"
      className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-8"
    >
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ChevronLeft size={18} />
          <span>Medbay</span>
        </Link>
        <div className="text-zinc-500 text-sm tabular-nums">
          {model.totalCompleted} / {model.totalEpisodes} chambers walked
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">The Hellbox</h1>
        <p className="text-zinc-400 italic mb-8">{model.elaraFraming}</p>

        {model.state === "locked" && <LockedState />}

        {model.state === "first_touch" && !welcomeVideoPlaying && (
          <FirstTouchCinematic
            onComplete={() => {
              // Hand off to the Welcome to Celebration cinematic before
              // routing — the video delivers the rampart arrival visually.
              setWelcomeVideoPlaying(true);
            }}
          />
        )}

        {welcomeVideoPlaying && (
          <OpeningCinematicVideo
            videoUrl={WELCOME_TO_CELEBRATION_VIDEO_URL}
            onEnd={() => {
              setNarrativeFlag(HELLBOX_FIRST_TOUCH_FLAG, true);
              // Per canon: first touch lands the player in C1 automatically.
              setLocation("/matrix/celebration_c1_the_watch");
            }}
          />
        )}

        {model.state === "unlocked" && (
          <UnlockedSelector
            groups={model.groups}
            onSelectLevel={onSelectLevel}
            onMarkComplete={onMarkComplete}
          />
        )}

        {/* Dev affordance — Beat B normally fires this in the medbay flow.
            Until that wiring is added, this lets developers/QA discover
            the device manually. */}
        {!hellboxDiscovered && (
          <div className="mt-12 border-t border-zinc-800 pt-6">
            <button
              type="button"
              className="text-xs text-zinc-600 hover:text-zinc-400 underline"
              onClick={() => setNarrativeFlag(HELLBOX_DISCOVERED_FLAG, true)}
            >
              [dev] simulate Beat-B Hellbox discovery
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

/* ─── State: Locked ─── */

function LockedState() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-zinc-500">
      <Lock size={48} className="opacity-50" />
      <p className="text-center max-w-md">
        There is no portal here. Not yet. The medbay holds.
      </p>
    </div>
  );
}

/* ─── State: First Touch Cinematic ─── */

function FirstTouchCinematic({ onComplete }: { onComplete: () => void }) {
  const cues = HELLBOX_FIRST_TOUCH.cue;
  const [cueIndex, setCueIndex] = useState(0);
  const cue = cues[cueIndex];

  const advance = () => {
    if (cueIndex < cues.length - 1) {
      setCueIndex(cueIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div
      className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 cursor-pointer select-none"
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
      <AnimatePresence mode="wait">
        <motion.div
          key={cueIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
            {cue.speaker}
          </div>
          <p className="text-lg leading-relaxed text-zinc-200">{cue.text}</p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between text-xs text-zinc-500">
        <span>
          {cueIndex + 1} / {cues.length}
        </span>
        <span className="italic">click or press space to continue</span>
      </div>
    </div>
  );
}

/* ─── State: Unlocked Selector ─── */

function UnlockedSelector({
  groups,
  onSelectLevel,
  onMarkComplete,
}: {
  groups: readonly HellboxSelectorGroup[];
  onSelectLevel: (level: MatrixLevelDefinition) => void;
  onMarkComplete: (levelId: string) => void;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {groups.map((group) => (
        <SchoolColumn
          key={group.school}
          group={group}
          onSelectLevel={onSelectLevel}
          onMarkComplete={onMarkComplete}
        />
      ))}
    </div>
  );
}

function SchoolColumn({
  group,
  onSelectLevel,
  onMarkComplete,
}: {
  group: HellboxSelectorGroup;
  onSelectLevel: (level: MatrixLevelDefinition) => void;
  onMarkComplete: (levelId: string) => void;
}) {
  // Tailwind safelist note: these arbitrary tokens stay neutral so we
  // don't need the design-system migration touch yet — this page isn't
  // in .void-energy-adopted.
  const themeAccent =
    group.themeTag === "celebration_warm"
      ? "border-amber-700/40 bg-amber-950/10"
      : "border-slate-700/40 bg-slate-950/30";

  return (
    <section className={`rounded-lg border ${themeAccent} p-5`}>
      <header className="mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          {group.themeTag === "celebration_warm" ? (
            <Sparkles size={18} className="text-amber-500" />
          ) : (
            <Eye size={18} className="text-slate-400" />
          )}
          {group.displayName}
        </h2>
        <div className="text-xs text-zinc-500 mt-1">
          {group.completedLevels.length} completed ·{" "}
          {group.availableLevels.length} available ·{" "}
          {group.lockedLevels.length} locked
        </div>
      </header>

      <ul className="space-y-2">
        {group.availableLevels.map((level) => (
          <LevelRow
            key={level.id}
            level={level}
            state="available"
            onSelect={() => onSelectLevel(level)}
            onMarkComplete={() => onMarkComplete(level.id)}
          />
        ))}
        {group.completedLevels.map((level) => (
          <LevelRow
            key={level.id}
            level={level}
            state="completed"
            onSelect={() => onSelectLevel(level)}
            onMarkComplete={() => onMarkComplete(level.id)}
          />
        ))}
        {group.lockedLevels.map((level) => (
          <LevelRow
            key={level.id}
            level={level}
            state="locked"
            onSelect={() => undefined}
            onMarkComplete={() => undefined}
          />
        ))}
      </ul>
    </section>
  );
}

function LevelRow({
  level,
  state,
  onSelect,
  onMarkComplete,
}: {
  level: MatrixLevelDefinition;
  state: "available" | "completed" | "locked";
  onSelect: () => void;
  onMarkComplete: () => void;
}) {
  const isLocked = state === "locked";
  const isCompleted = state === "completed";

  const baseClasses = "rounded-md border px-3 py-2 transition-colors";
  const stateClasses = isLocked
    ? "border-zinc-800 bg-zinc-900/30 opacity-50"
    : isCompleted
      ? "border-zinc-700 bg-zinc-800/40 hover:bg-zinc-800/60"
      : "border-zinc-700 bg-zinc-900/40 hover:bg-zinc-800/60 cursor-pointer";

  return (
    <li className={`${baseClasses} ${stateClasses}`}>
      <button
        type="button"
        disabled={isLocked}
        onClick={onSelect}
        className="w-full text-left disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-zinc-500 text-xs tabular-nums shrink-0">
              {level.school === "celebration" ? "C" : "M"}
              {level.episodeNumber}
            </span>
            <span className="font-medium truncate">{level.title}</span>
          </div>
          {isCompleted && <Check size={14} className="text-emerald-500 shrink-0" />}
          {isLocked && <Lock size={12} className="text-zinc-600 shrink-0" />}
        </div>
        {!isLocked && (
          <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{level.beat}</p>
        )}
      </button>
      {isCompleted && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMarkComplete();
          }}
          className="hidden"
          aria-label="Replay (already marked complete)"
        />
      )}
    </li>
  );
}

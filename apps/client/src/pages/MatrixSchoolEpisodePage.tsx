/* ═══════════════════════════════════════════════════════
   MATRIX SCHOOL EPISODE PAGE — Episode Runtime

   Plays the scenes for a single Matrix-of-Dreams Level
   (Celebration or Mechronis episode). Receives :episodeId via
   the wouter route. Loads the episode definition + its scripted
   scene cues, advances on click/space, and routes back to the
   Hellbox portal on completion.

   For first-pass shipping, episode completion is signaled to
   the Hellbox via wouter location only — persistent flag-state
   integration is left for the follow-on PR that wires this to
   GameContext.

   See plan §4 (The Hellbox & The Two Schools as Matrix-of-
   Dreams Levels), §5 (Celebration School cast), §6 (Mechronis
   Academy episodes).
   ═══════════════════════════════════════════════════════ */

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Check } from "lucide-react";
import {
  getLevelById,
  type MatrixLevelDefinition,
} from "@shared/matrixOfDreamsLevels";
import {
  getScenesForEpisode,
  CELEBRATION_EPISODE_SCENE_MAP,
} from "@shared/celebrationSchoolDialog";
import {
  getMechronisScenesForEpisode,
  MECHRONIS_EPISODE_SCENE_MAP,
} from "@shared/mechronisAcademyDialog";
import type { DialogScene, DialogCue } from "@shared/tcg-core/story/dialogBank";
import { episodeCompletionFlag } from "@shared/matrixSaveFlags";
import { useGame } from "@/contexts/GameContext";

/* ─── Helpers ─── */

function loadScenesForEpisode(episodeId: string): readonly DialogScene[] {
  // First check the Celebration map, then the Mechronis map.
  if (episodeId in CELEBRATION_EPISODE_SCENE_MAP) {
    return getScenesForEpisode(episodeId);
  }
  if (episodeId in MECHRONIS_EPISODE_SCENE_MAP) {
    return getMechronisScenesForEpisode(episodeId);
  }
  return [];
}

/* ─── Component ─── */

export default function MatrixSchoolEpisodePage() {
  const [, params] = useRoute<{ episodeId: string }>("/matrix/:episodeId");
  const [, setLocation] = useLocation();
  const { setNarrativeFlag } = useGame();
  const episodeId = params?.episodeId ?? "";

  const level: MatrixLevelDefinition | undefined = useMemo(
    () => getLevelById(episodeId),
    [episodeId],
  );
  const scenes = useMemo(() => loadScenesForEpisode(episodeId), [episodeId]);

  const [sceneIndex, setSceneIndex] = useState(0);
  const [cueIndex, setCueIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setSceneIndex(0);
    setCueIndex(0);
    setDone(false);
  }, [episodeId]);

  // Persist completion flag the first time the player reaches the end
  // of the episode. Replays do not unset.
  useEffect(() => {
    if (done && episodeId) {
      setNarrativeFlag(episodeCompletionFlag(episodeId), true);
    }
  }, [done, episodeId, setNarrativeFlag]);

  const advance = () => {
    if (done) return;
    if (scenes.length === 0) {
      setDone(true);
      return;
    }
    const currentScene = scenes[sceneIndex];
    if (cueIndex < currentScene.cues.length - 1) {
      setCueIndex(cueIndex + 1);
      return;
    }
    if (sceneIndex < scenes.length - 1) {
      setSceneIndex(sceneIndex + 1);
      setCueIndex(0);
      return;
    }
    setDone(true);
  };

  if (!level) {
    return <NotFoundEpisode episodeId={episodeId} />;
  }

  if (scenes.length === 0) {
    return <UnscriptedEpisode level={level} />;
  }

  const scene = scenes[sceneIndex];
  const cue: DialogCue = scene.cues[cueIndex];

  const themeAccent =
    level.school === "celebration"
      ? "bg-amber-950/10 border-amber-800/30"
      : "bg-slate-950/30 border-slate-700/40";

  return (
    <div
      data-page="matrix-school-episode"
      data-episode={episodeId}
      className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-8"
    >
      <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <Link
          href="/hellbox"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ChevronLeft size={18} />
          <span>Hellbox</span>
        </Link>
        <div className="text-zinc-500 text-sm tabular-nums">
          Scene {sceneIndex + 1} / {scenes.length}
          {" · "}
          Cue {cueIndex + 1} / {scene.cues.length}
        </div>
      </header>

      <main className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-zinc-500">
            {level.school === "celebration" ? "Celebration School" : "Mechronis Academy"}
            {" · Episode "}
            {level.episodeNumber}
          </div>
          <h1 className="text-2xl font-semibold mt-1">{level.title}</h1>
          <p className="text-zinc-400 italic mt-1 text-sm">{level.beat}</p>
        </div>

        <div
          className={`rounded-lg border p-8 cursor-pointer select-none ${themeAccent}`}
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
            <CueRender cue={cue} scene={scene} keySuffix={`${sceneIndex}-${cueIndex}`} />
          ) : (
            <EpisodeComplete
              level={level}
              onReturn={() => setLocation("/hellbox")}
              onReplay={() => {
                setSceneIndex(0);
                setCueIndex(0);
                setDone(false);
              }}
            />
          )}
        </div>

        {!done && (
          <p className="text-center text-xs text-zinc-600 mt-4">
            click the panel or press space / enter to advance
          </p>
        )}
      </main>
    </div>
  );
}

/* ─── Cue rendering ─── */

function CueRender({
  cue,
  scene,
  keySuffix,
}: {
  cue: DialogCue;
  scene: DialogScene;
  keySuffix: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keySuffix}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
      >
        <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
          {prettySpeaker(cue.speaker)}
          {cue.mood ? ` · ${cue.mood}` : ""}
        </div>
        <p className="text-lg leading-relaxed text-zinc-100">{cue.text}</p>
        {cue.internal && (
          <p className="mt-3 italic text-zinc-500 text-sm">— {cue.internal}</p>
        )}
        <p className="sr-only">Scene label: {scene.label}</p>
      </motion.div>
    </AnimatePresence>
  );
}

function prettySpeaker(speaker: string): string {
  return speaker
    .split("_")
    .map((part) => (part.length > 0 ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");
}

/* ─── Empty / fallback states ─── */

function EpisodeComplete({
  level,
  onReturn,
  onReplay,
}: {
  level: MatrixLevelDefinition;
  onReturn: () => void;
  onReplay: () => void;
}) {
  return (
    <div className="text-center">
      <Check size={36} className="mx-auto text-emerald-500 mb-4" />
      <h2 className="text-lg font-semibold mb-2">Episode complete</h2>
      <p className="text-zinc-400 mb-6">
        {level.school === "celebration"
          ? "The chamber folds behind you."
          : "The lecture ends. The cohort files out."}
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReturn}
          className="px-4 py-2 rounded-md border border-zinc-700 hover:border-zinc-500 text-sm"
        >
          Back to Hellbox
        </button>
        {level.replayable && (
          <button
            type="button"
            onClick={onReplay}
            className="px-4 py-2 rounded-md border border-zinc-700 hover:border-zinc-500 text-sm"
          >
            Replay
          </button>
        )}
      </div>
    </div>
  );
}

function UnscriptedEpisode({ level }: { level: MatrixLevelDefinition }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-8">
      <header className="max-w-4xl mx-auto mb-8">
        <Link
          href="/hellbox"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100"
        >
          <ChevronLeft size={18} />
          <span>Hellbox</span>
        </Link>
      </header>
      <main className="max-w-3xl mx-auto rounded-lg border border-zinc-800 bg-zinc-900/40 p-8">
        <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
          {level.school === "celebration" ? "Celebration School" : "Mechronis Academy"}
          {" · Episode "}
          {level.episodeNumber}
        </div>
        <h1 className="text-2xl font-semibold mb-4">{level.title}</h1>
        <p className="text-zinc-300 mb-6">{level.beat}</p>
        <p className="text-zinc-500 italic">
          Scenes for this episode are scaffolded but not yet scripted in the
          dialog bank. Authoring continues in a follow-on PR.
        </p>
        {level.authorNotes && (
          <details className="mt-6 text-zinc-500 text-sm">
            <summary className="cursor-pointer">Author notes</summary>
            <p className="mt-2 whitespace-pre-wrap">{level.authorNotes}</p>
          </details>
        )}
      </main>
    </div>
  );
}

function NotFoundEpisode({ episodeId }: { episodeId: string }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-8">
      <header className="max-w-4xl mx-auto mb-8">
        <Link
          href="/hellbox"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100"
        >
          <ChevronLeft size={18} />
          <span>Hellbox</span>
        </Link>
      </header>
      <main className="max-w-3xl mx-auto text-center py-24">
        <h1 className="text-xl font-semibold mb-2">Chamber not found</h1>
        <p className="text-zinc-500">
          No Matrix-of-Dreams level registered for "{episodeId}".
        </p>
      </main>
    </div>
  );
}

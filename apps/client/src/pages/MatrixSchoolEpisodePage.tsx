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
import { episodeCompletionFlag, hamletClueFlag } from "@shared/matrixSaveFlags";
import { useGame } from "@/contexts/GameContext";

/* ─── Helpers ─── */

interface Playhead {
  sceneIndex: number;
  cueIndex: number;
}

const PLAYHEAD_STORAGE_PREFIX = "matrix_episode_playhead:";

function playheadKey(episodeId: string): string {
  return `${PLAYHEAD_STORAGE_PREFIX}${episodeId}`;
}

function readPlayhead(episodeId: string): Playhead {
  if (!episodeId) return { sceneIndex: 0, cueIndex: 0 };
  if (typeof window === "undefined") return { sceneIndex: 0, cueIndex: 0 };
  try {
    const raw = window.localStorage.getItem(playheadKey(episodeId));
    if (!raw) return { sceneIndex: 0, cueIndex: 0 };
    const parsed = JSON.parse(raw) as Partial<Playhead>;
    const sceneIndex = Number.isFinite(parsed.sceneIndex)
      ? Math.max(0, Math.floor(parsed.sceneIndex as number))
      : 0;
    const cueIndex = Number.isFinite(parsed.cueIndex)
      ? Math.max(0, Math.floor(parsed.cueIndex as number))
      : 0;
    return { sceneIndex, cueIndex };
  } catch {
    return { sceneIndex: 0, cueIndex: 0 };
  }
}

function writePlayhead(episodeId: string, head: Playhead): void {
  if (!episodeId) return;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(playheadKey(episodeId), JSON.stringify(head));
  } catch {
    // Storage may be full or disabled; the runtime degrades to non-resuming
    // playback, which is harmless.
  }
}

function clearPlayhead(episodeId: string): void {
  if (!episodeId) return;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(playheadKey(episodeId));
  } catch {
    // Same as writePlayhead — non-fatal.
  }
}

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

  // Restore playhead from localStorage on mount. If the player departed
  // the episode mid-flow (e.g. via the playable bridge), they resume here.
  const initial = useMemo(() => readPlayhead(episodeId), [episodeId]);
  const [sceneIndex, setSceneIndex] = useState(initial.sceneIndex);
  const [cueIndex, setCueIndex] = useState(initial.cueIndex);
  const [done, setDone] = useState(false);
  /** Mid-episode bridge gate — set when a scene completes that matches
   *  level.playableBridgeAfterScene. The runtime renders the bridge
   *  panel; the player chooses to play or to skip and continue. */
  const [bridgeOffered, setBridgeOffered] = useState(false);

  useEffect(() => {
    const restored = readPlayhead(episodeId);
    setSceneIndex(restored.sceneIndex);
    setCueIndex(restored.cueIndex);
    setDone(false);
    setBridgeOffered(false);
  }, [episodeId]);

  // Persist completion flag the first time the player reaches the end
  // of the episode. If the episode surfaces a Hamlet conspiracy clue
  // (per its level definition), set the per-clue flag too — this is the
  // canonical wiring; the conspiracy board's episode-completion fallback
  // is a safety net, not the primary signal. Replays do not unset.
  useEffect(() => {
    if (done && episodeId) {
      setNarrativeFlag(episodeCompletionFlag(episodeId), true);
      if (level?.conspiracyClue) {
        setNarrativeFlag(hamletClueFlag(level.conspiracyClue), true);
      }
      // Episode finished — clear the playhead so a clean replay starts at scene 0.
      clearPlayhead(episodeId);
    }
  }, [done, episodeId, level, setNarrativeFlag]);

  // Persist the playhead whenever it advances. Localized to localStorage
  // (not GameContext flags, since flags are boolean-only here).
  useEffect(() => {
    if (!episodeId) return;
    if (done) return;
    writePlayhead(episodeId, { sceneIndex, cueIndex });
  }, [episodeId, sceneIndex, cueIndex, done]);

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
    // End of scene — check whether a mid-episode playable bridge is
    // configured to surface here. If so, pause the runtime; the player
    // chooses to play the bridge or skip past it.
    const justFinishedScene = currentScene;
    if (
      level?.playableBridge &&
      level.playableBridgeAfterScene === justFinishedScene.id &&
      !bridgeOffered
    ) {
      setBridgeOffered(true);
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

        {bridgeOffered && level.playableBridge ? (
          <MidEpisodeBridge
            level={level}
            onPlay={() => {
              // Persist the playhead at the END of the just-finished scene.
              // When the player returns from the bridge, they land in the
              // NEXT scene at cue 0.
              const nextScene = Math.min(sceneIndex + 1, scenes.length - 1);
              writePlayhead(episodeId, { sceneIndex: nextScene, cueIndex: 0 });
              window.location.assign(level.playableBridge!.path);
            }}
            onSkip={() => {
              setBridgeOffered(false);
              if (sceneIndex < scenes.length - 1) {
                setSceneIndex(sceneIndex + 1);
                setCueIndex(0);
              } else {
                setDone(true);
              }
            }}
          />
        ) : (
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
                  clearPlayhead(episodeId);
                  setSceneIndex(0);
                  setCueIndex(0);
                  setDone(false);
                  setBridgeOffered(false);
                }}
              />
            )}
          </div>
        )}

        {!done && !bridgeOffered && (
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

/* ─── Mid-episode playable bridge ─── */

function MidEpisodeBridge({
  level,
  onPlay,
  onSkip,
}: {
  level: MatrixLevelDefinition;
  onPlay: () => void;
  onSkip: () => void;
}) {
  if (!level.playableBridge) return null;
  return (
    <div
      className="rounded-lg border border-amber-700/50 bg-amber-950/20 p-8"
      data-component="mid-episode-bridge"
      data-episode={level.id}
    >
      <div className="text-xs uppercase tracking-widest text-amber-400 mb-2">
        Take a hand in the moment
      </div>
      <h2 className="text-xl font-semibold mb-3">{level.playableBridge.label}</h2>
      {level.playableBridge.description && (
        <p className="text-sm text-zinc-300 mb-5 leading-relaxed">
          {level.playableBridge.description}
        </p>
      )}
      <p className="text-xs text-zinc-500 italic mb-5">
        Stepping into the game pauses the chamber. When you return, the next
        scene picks up where you left off.
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPlay}
          className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-amber-600 bg-amber-900/30 hover:bg-amber-900/50 text-sm transition-colors"
        >
          {level.playableBridge.label} →
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="text-sm px-4 py-2 rounded-md border border-zinc-700 hover:border-zinc-500 transition-colors"
        >
          Skip and watch
        </button>
      </div>
    </div>
  );
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
      {level.playableBridge && (
        <div className="mb-6 mx-auto max-w-md rounded-md border border-amber-700/40 bg-amber-950/20 p-4">
          <div className="text-xs uppercase tracking-widest text-amber-400 mb-1">
            Playable bridge
          </div>
          {level.playableBridge.description && (
            <p className="text-sm text-zinc-300 mb-3 leading-relaxed">
              {level.playableBridge.description}
            </p>
          )}
          <a
            href={level.playableBridge.path}
            className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-amber-600 bg-amber-900/30 hover:bg-amber-900/50 text-sm transition-colors"
          >
            {level.playableBridge.label} →
          </a>
        </div>
      )}
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

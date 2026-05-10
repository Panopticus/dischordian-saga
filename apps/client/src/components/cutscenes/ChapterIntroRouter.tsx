/* ═══════════════════════════════════════════════════════
   CHAPTER INTRO ROUTER

   Watches `state.narrativeFlags` for chapter-intro trigger
   flags and renders the matching producer-delivered opener
   from `apps/shared/chapterIntroCutscenes.ts`.

   Trigger flag pattern (mirrors CutsceneRouter):
     `chapter_intro_<id>_triggered`  → set true to fire
     `chapter_intro_<id>_seen`       → set true on completion
   where <id> is the ChapterIntroDef.id (e.g. `ch05_watcher`).

   Mounted once at the App root next to <CutsceneRouter/>;
   any page (story-mode chapter loader, debug overlay, etc.)
   can fire by setting the trigger flag.

   Pure trigger resolution lives in `resolvePendingChapterIntro`
   so it's testable without a DOM.
   ═══════════════════════════════════════════════════════ */
import { useMemo, type ReactElement } from "react";
import { useGame } from "@/contexts/GameContext";
import {
  CHAPTER_INTROS,
  type ChapterIntroDef,
} from "@shared/chapterIntroCutscenes";
import { ChapterOpenerOverlay } from "./ChapterOpenerOverlay";

export const chapterIntroTriggerFlag = (id: string): string =>
  `chapter_intro_${id}_triggered`;
export const chapterIntroSeenFlag = (id: string): string =>
  `chapter_intro_${id}_seen`;

/** Pure resolver: given a narrative-flag map, return the first
 *  chapter intro whose trigger is set and whose seen flag is
 *  not yet set. Returns null if none match.
 *
 *  Iteration order matches CHAPTER_INTROS (chapter ascending,
 *  primary before BONUS within a chapter). */
export function resolvePendingChapterIntro(
  flags: Readonly<Record<string, unknown>>,
): ChapterIntroDef | null {
  for (const def of CHAPTER_INTROS) {
    const triggered = flags[chapterIntroTriggerFlag(def.id)] === true;
    if (!triggered) continue;
    const seen = flags[chapterIntroSeenFlag(def.id)] === true;
    if (seen) continue;
    return def;
  }
  return null;
}

export function ChapterIntroRouter(): ReactElement | null {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};

  const active = useMemo<ChapterIntroDef | null>(
    () => resolvePendingChapterIntro(flags),
    [flags],
  );

  if (!active) return null;

  const handleComplete = (): void => {
    // Clear the trigger so we don't loop, and stamp the seen
    // flag so completion is observable from downstream beats.
    setNarrativeFlag(chapterIntroTriggerFlag(active.id), false);
    setNarrativeFlag(chapterIntroSeenFlag(active.id), true);
  };

  return <ChapterOpenerOverlay intro={active} onComplete={handleComplete} />;
}

export default ChapterIntroRouter;

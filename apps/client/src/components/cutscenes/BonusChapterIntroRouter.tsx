/* ═══════════════════════════════════════════════════════
   BONUS CHAPTER-INTRO ROUTER

   Mounted at App root next to ChapterIntroRouter. Watches the
   BONUS-variant gates from `apps/shared/bonusChapterIntroTriggers.ts`
   and fires the matching producer-delivered MP4 via
   SingleVideoCutsceneOverlay. Stamps the standard
   `chapter_intro_<id>_seen` flag on completion so it doesn't
   replay across mounts.

   Pure resolver (`pickBonusChapterIntroToFire`) lives in shared/
   so the trigger logic can be unit-tested without a DOM.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useMemo, type ReactElement } from "react";
import { useGame } from "@/contexts/GameContext";
import {
  bonusChapterIntroSeenFlag,
  pickBonusChapterIntroToFire,
} from "@shared/bonusChapterIntroTriggers";
import type { ChapterIntroDef } from "@shared/chapterIntroCutscenes";
import { SingleVideoCutsceneOverlay } from "./SingleVideoCutsceneOverlay";

export function BonusChapterIntroRouter(): ReactElement | null {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};
  const narrativeAct = state.narrativeAct ?? 0;

  const active = useMemo<{ def: ChapterIntroDef } | null>(() => {
    const result = pickBonusChapterIntroToFire({ narrativeAct, flags });
    return result ? { def: result.def } : null;
  }, [narrativeAct, flags]);

  const handleComplete = useCallback(() => {
    if (!active) return;
    setNarrativeFlag(bonusChapterIntroSeenFlag(active.def.id), true);
  }, [active, setNarrativeFlag]);

  if (!active) return null;

  const { def } = active;
  const slugLabel = def.slug
    .replace(/_BONUS$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <SingleVideoCutsceneOverlay
      cutsceneId={def.id}
      videoRelPath={def.videoRelPath}
      primaryLabel={`Chapter ${def.chapter}`}
      secondaryLabel={slugLabel}
      badge="· BONUS"
      onComplete={handleComplete}
    />
  );
}

export default BonusChapterIntroRouter;

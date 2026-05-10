/* ═══════════════════════════════════════════════════════
   CHAPTER OPENER OVERLAY — chapter-intro adapter

   Thin adapter over SingleVideoCutsceneOverlay that knows how to
   format a ChapterIntroDef as primary/secondary labels and a
   BONUS badge. The actual <video> + reduced-motion plumbing
   lives in SingleVideoCutsceneOverlay so confession-close,
   wheel-reactions, and event-reveals can reuse it.

   Mount via <ChapterIntroRouter/> at the App root; pages
   trigger by setting `chapter_intro_<id>_triggered` flags.
   ═══════════════════════════════════════════════════════ */
import { type ReactElement } from "react";
import type { ChapterIntroDef } from "@shared/chapterIntroCutscenes";
import { SingleVideoCutsceneOverlay } from "./SingleVideoCutsceneOverlay";

export interface ChapterOpenerOverlayProps {
  intro: ChapterIntroDef;
  onComplete: () => void;
  /** Force the reduced-motion path regardless of OS settings. */
  reduced?: boolean;
}

export function ChapterOpenerOverlay({
  intro,
  onComplete,
  reduced,
}: ChapterOpenerOverlayProps): ReactElement {
  const slugLabel = intro.slug
    .replace(/_BONUS$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <SingleVideoCutsceneOverlay
      cutsceneId={intro.id}
      videoRelPath={intro.videoRelPath}
      primaryLabel={`Chapter ${intro.chapter}`}
      secondaryLabel={slugLabel}
      badge={intro.isBonusVariant ? "· BONUS" : undefined}
      onComplete={onComplete}
      reduced={reduced}
    />
  );
}

export default ChapterOpenerOverlay;

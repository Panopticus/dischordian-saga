/* ═══════════════════════════════════════════════════════
   CHAPTER OPENER OVERLAY — single-shot video player

   Renders the producer-delivered chapter intro for one
   ChapterIntroDef from `apps/shared/chapterIntroCutscenes.ts`.
   This is a thinner cousin of AnimatedCutscenePlayer — chapter
   intros are single MP4s with no shot chain, so the playback
   path is a single <video> element with a skip button and a
   reduced-motion fallback (label + continue button only).

   Mount via <ChapterIntroRouter/> at the App root; pages
   trigger by setting `chapter_intro_<id>_triggered` flags.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import { assetUrl } from "@/lib/assetUrl";
import { useReduceMotion } from "@/hooks/useReduceMotion";
import type { ChapterIntroDef } from "@shared/chapterIntroCutscenes";

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
  const osReduced = useReduceMotion();
  const [assetMissing, setAssetMissing] = useState(false);
  const warnedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const showReduced = reduced || osReduced || assetMissing;

  const handleError = useCallback(() => {
    if (!warnedRef.current) {
      warnedRef.current = true;
      console.warn(
        `[chapter-intro] missing video asset for ${intro.id}; ` +
          `falling back to reduced-motion label. ` +
          `Producer team: deliver to ${intro.videoRelPath}.`,
      );
    }
    setAssetMissing(true);
  }, [intro]);

  useEffect(() => {
    if (showReduced) return;
    const v = videoRef.current;
    if (!v) return;
    const playPromise = v.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Autoplay blocked — surface the reduced path so the
        // user can still progress past the cutscene.
        handleError();
      });
    }
  }, [showReduced, handleError]);

  const chapterLabel = `Chapter ${intro.chapter}`;
  const slugLabel = intro.slug
    .replace(/_BONUS$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  if (showReduced) {
    return (
      <div
        role="dialog"
        aria-label={`${chapterLabel}: ${slugLabel}`}
        className="fixed inset-0 z-[9999] void-bg-sunk flex flex-col items-center justify-center p-8"
        data-chapter-intro-id={intro.id}
      >
        <div className="font-mono text-xs void-text-system tracking-[0.2em] mb-2">
          {chapterLabel.toUpperCase()}
          {intro.isBonusVariant ? " · BONUS" : ""}
        </div>
        <h2 className="font-display text-3xl void-text-accent tracking-wider text-center max-w-2xl">
          {slugLabel}
        </h2>
        <button
          type="button"
          onClick={onComplete}
          className="mt-8 px-6 py-2 rounded-md void-border void-bg-elev void-text-accent font-mono text-sm tracking-wider hover:void-bg-hover transition-colors"
        >
          CONTINUE
        </button>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-label={`${chapterLabel}: ${slugLabel}`}
      className="fixed inset-0 z-[9999] void-bg-sunk flex items-center justify-center"
      data-chapter-intro-id={intro.id}
    >
      <video
        ref={videoRef}
        src={assetUrl(intro.videoRelPath)}
        autoPlay
        playsInline
        onEnded={onComplete}
        onError={handleError}
        className="w-full h-full object-contain"
      >
        <track kind="captions" />
      </video>
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <span className="font-mono text-xs void-text-system tracking-wider">
          {chapterLabel.toUpperCase()}
          {intro.isBonusVariant ? " · BONUS" : ""}
        </span>
        <button
          type="button"
          onClick={onComplete}
          className="px-3 py-1.5 rounded-md void-border void-bg-elev void-text-accent font-mono text-xs tracking-wider hover:void-bg-hover transition-colors"
        >
          SKIP
        </button>
      </div>
    </div>
  );
}

export default ChapterOpenerOverlay;

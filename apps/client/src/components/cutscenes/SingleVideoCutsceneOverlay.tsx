/* ═══════════════════════════════════════════════════════
   SINGLE-VIDEO CUTSCENE OVERLAY — generic primitive

   Renders one MP4 with a skip button + reduced-motion fallback.
   The shape is identical for every "single-shot, fire-and-forget"
   cutscene drop (chapter intros, confession-close, wheel reactions,
   event reveals). Each consumer wraps this with its own thin
   props-mapping layer that knows which video URL + label to pass.

   This used to be inlined inside ChapterOpenerOverlay; extracted
   so additional routers don't have to copy the <video> + reduced-
   motion handling. Multi-shot sequences (the 5 named cutscenes,
   prestige reset) continue to use AnimatedCutscenePlayer instead.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import { assetUrl } from "@/lib/assetUrl";
import { useReduceMotion } from "@/hooks/useReduceMotion";

export interface SingleVideoCutsceneOverlayProps {
  /** Path under apps/client/public/videos/, resolved through assetUrl(). */
  videoRelPath: string;
  /** Stable id used for data-* attributes + console warnings. */
  cutsceneId: string;
  /** Top-line label (e.g. "CHAPTER 5"). */
  primaryLabel: string;
  /** Sub-label (e.g. "Watcher"). */
  secondaryLabel: string;
  /** Optional badge appended to the labels (e.g. "· BONUS"). */
  badge?: string;
  /** Optional in-voice lead-in line. Fades in shortly after the
   *  video starts, holds, then fades out before first dialog so
   *  it doesn't compete with the asset's narration. Surfaced at
   *  the bottom of the frame and in the reduced-motion fallback. */
  frameLine?: string;
  /** Called when the video ends OR the skip button is pressed OR
   *  the reduced-motion CONTINUE button is pressed OR the asset
   *  fires onerror and we've shown the fallback. */
  onComplete: () => void;
  /** Force the reduced-motion path regardless of OS settings. */
  reduced?: boolean;
  /** Used in console.warn when the asset is missing — tells the
   *  producer team where to deliver the file. Defaults to videoRelPath. */
  diagnosticDeliveryHint?: string;
}

export function SingleVideoCutsceneOverlay({
  videoRelPath,
  cutsceneId,
  primaryLabel,
  secondaryLabel,
  badge,
  frameLine,
  onComplete,
  reduced,
  diagnosticDeliveryHint,
}: SingleVideoCutsceneOverlayProps): ReactElement {
  const osReduced = useReduceMotion();
  const [assetMissing, setAssetMissing] = useState(false);
  const warnedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const showReduced = reduced || osReduced || assetMissing;

  // frameLine lifecycle: hidden → visible (fade in) → hidden (fade out)
  // before first asset dialog. Held ~5s so the player can read it
  // without it sitting on top of the narration.
  const [frameLinePhase, setFrameLinePhase] = useState<
    "hidden" | "visible" | "fading"
  >("hidden");
  useEffect(() => {
    if (!frameLine || showReduced) return;
    const inT = window.setTimeout(() => setFrameLinePhase("visible"), 800);
    const outT = window.setTimeout(() => setFrameLinePhase("fading"), 5800);
    const goneT = window.setTimeout(() => setFrameLinePhase("hidden"), 6400);
    return () => {
      window.clearTimeout(inT);
      window.clearTimeout(outT);
      window.clearTimeout(goneT);
    };
  }, [frameLine, showReduced]);

  const handleError = useCallback(() => {
    if (!warnedRef.current) {
      warnedRef.current = true;
      console.warn(
        `[cutscene] missing video asset for ${cutsceneId}; ` +
          `falling back to reduced-motion label. ` +
          `Producer team: deliver to ${diagnosticDeliveryHint ?? videoRelPath}.`,
      );
    }
    setAssetMissing(true);
  }, [cutsceneId, videoRelPath, diagnosticDeliveryHint]);

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

  const ariaLabel = `${primaryLabel}: ${secondaryLabel}`;
  const labelBadge = badge ? ` ${badge}` : "";

  if (showReduced) {
    return (
      <div
        role="dialog"
        aria-label={ariaLabel}
        className="fixed inset-0 z-[9999] void-bg-sunk flex flex-col items-center justify-center p-8"
        data-cutscene-id={cutsceneId}
      >
        <div className="font-mono text-xs void-text-system tracking-[0.2em] mb-2">
          {primaryLabel.toUpperCase()}
          {labelBadge}
        </div>
        <h2 className="font-display text-3xl void-text-accent tracking-wider text-center max-w-2xl">
          {secondaryLabel}
        </h2>
        {frameLine ? (
          <p
            data-frame-line
            className="mt-6 font-mono text-sm void-text-system tracking-wide text-center max-w-2xl italic opacity-80"
          >
            {frameLine}
          </p>
        ) : null}
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
      aria-label={ariaLabel}
      className="fixed inset-0 z-[9999] void-bg-sunk flex items-center justify-center"
      data-cutscene-id={cutsceneId}
    >
      <video
        ref={videoRef}
        src={assetUrl(videoRelPath)}
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
          {primaryLabel.toUpperCase()}
          {labelBadge}
        </span>
        <button
          type="button"
          onClick={onComplete}
          className="px-3 py-1.5 rounded-md void-border void-bg-elev void-text-accent font-mono text-xs tracking-wider hover:void-bg-hover transition-colors"
        >
          SKIP
        </button>
      </div>
      {frameLine && frameLinePhase !== "hidden" ? (
        <p
          data-frame-line
          aria-live="polite"
          className={`absolute bottom-12 left-1/2 -translate-x-1/2 max-w-2xl px-6 text-center font-mono text-sm md:text-base void-text-accent tracking-wide italic transition-opacity duration-500 ${
            frameLinePhase === "visible" ? "opacity-90" : "opacity-0"
          }`}
        >
          {frameLine}
        </p>
      ) : null}
    </div>
  );
}

export default SingleVideoCutsceneOverlay;

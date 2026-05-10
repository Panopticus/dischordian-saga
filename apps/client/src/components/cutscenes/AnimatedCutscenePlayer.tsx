/* ═══════════════════════════════════════════════════════
   ANIMATED CUTSCENE PLAYER — shared scaffold

   Generic shot-chained <video> player driven by a
   CutsceneDefinition from `apps/shared/cutsceneRegistry.ts`.
   The five named cutscenes (Awakening, First Human Contact,
   Elara's Memory Recovery, The Breaking Point, The Thought
   Virus Manifests) are thin wrappers around this player.

   Producer-facing asset specs (Seedance v2 prompts, shot
   timing, motion notes) live in
   `docs/production/CUTSCENE_SEEDANCE_PROMPTS.md`. Components
   only need to know the shot count and base path — both come
   from the registry.

   Reduced motion / missing-asset behaviour:
   - If `reduced` prop is true (or `prefers-reduced-motion` is
     on) we skip the video chain entirely and render the
     poster + a brief text summary.
   - If the first shot 404s or fires `onerror`, we log a
     single console.warn and downgrade to the reduced path.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import { assetUrl } from "@/lib/assetUrl";
import { useReduceMotion } from "@/hooks/useReduceMotion";
import type { CutsceneDefinition } from "@shared/cutsceneRegistry";

export interface AnimatedCutscenePlayerProps {
  definition: CutsceneDefinition;
  /** Brief reduced-motion summary; rendered next to the poster. */
  summary: string;
  /** Called when the final shot ends OR Skip is pressed OR the
   *  reduced-motion path's "Continue" is clicked. */
  onComplete: () => void;
  /** Force the reduced-motion path regardless of OS / settings. */
  reduced?: boolean;
}

export function AnimatedCutscenePlayer({
  definition,
  summary,
  onComplete,
  reduced,
}: AnimatedCutscenePlayerProps): ReactElement {
  const osReduced = useReduceMotion();
  const [shotIndex, setShotIndex] = useState(1);
  const [assetMissing, setAssetMissing] = useState(false);
  const warnedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const showReduced = reduced || osReduced || assetMissing;

  const handleShotEnd = useCallback(() => {
    if (shotIndex >= definition.shotCount) {
      onComplete();
      return;
    }
    setShotIndex((i) => i + 1);
  }, [shotIndex, definition.shotCount, onComplete]);

  const handleShotError = useCallback(() => {
    if (!warnedRef.current) {
      warnedRef.current = true;
      console.warn(
        `[cutscene] missing video asset for ${definition.id} ` +
          `(shot ${shotIndex} of ${definition.shotCount}); ` +
          `falling back to reduced-motion poster. ` +
          `Producer team: deliver to ${definition.videoBasePath}.`,
      );
    }
    setAssetMissing(true);
  }, [definition, shotIndex]);

  // Auto-play each shot when the index changes.
  useEffect(() => {
    if (showReduced) return;
    const v = videoRef.current;
    if (!v) return;
    const playPromise = v.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Autoplay blocked — surface the reduced path so the
        // user can still progress past the cutscene.
        handleShotError();
      });
    }
  }, [shotIndex, showReduced, handleShotError]);

  if (showReduced) {
    return (
      <div
        role="dialog"
        aria-label={definition.title}
        className="fixed inset-0 z-[9999] void-bg-sunk flex flex-col items-center justify-center p-8"
      >
        <img
          src={assetUrl(definition.posterPath)}
          alt={`${definition.title} — still frame`}
          className="max-w-2xl w-full rounded-lg void-border shadow-lg"
          onError={() => {
            /* poster also missing — UI still renders */
          }}
        />
        <h2 className="font-display text-2xl void-text-accent mt-6 tracking-wider">
          {definition.title}
        </h2>
        <p className="font-mono text-sm void-text-system mt-3 max-w-xl text-center leading-relaxed">
          {summary}
        </p>
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

  // Honour shotFilenames override when present (used by human-reveal
  // variants and any future cutscene where producer filenames don't
  // follow the shot1.mp4..shotN.mp4 convention). Falls back to the
  // numbered convention so existing cutscenes are untouched.
  const shotFile =
    definition.shotFilenames?.[shotIndex - 1] ?? `shot${shotIndex}.mp4`;
  const shotSrc = assetUrl(`${definition.videoBasePath}${shotFile}`);
  const posterSrc = assetUrl(definition.posterPath);

  return (
    <div
      role="dialog"
      aria-label={definition.title}
      className="fixed inset-0 z-[9999] void-bg-sunk flex items-center justify-center"
    >
      <video
        ref={videoRef}
        key={shotIndex}
        src={shotSrc}
        poster={posterSrc}
        autoPlay
        playsInline
        onEnded={handleShotEnd}
        onError={handleShotError}
        className="w-full h-full object-contain"
        data-cutscene-id={definition.id}
        data-shot-index={shotIndex}
      >
        <track kind="captions" />
      </video>
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <span className="font-mono text-xs void-text-system tracking-wider">
          SHOT {shotIndex}/{definition.shotCount}
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

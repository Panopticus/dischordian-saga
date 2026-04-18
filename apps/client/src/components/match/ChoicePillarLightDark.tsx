/**
 * §5.8.1 Light/Dark alignment pillar choice.
 *
 * Spec: docs/production/act1/authority-trial-phase-mechanic.md §5.
 * Positioned as "the canonical alignment moment of the entire game" —
 * the player picks one of two pillars after the Authority trial
 * resolves (regardless of overturn / sentence_passed outcome). The
 * pick writes the persistent `lightDarkAlignment` campaign flag
 * (see apps/shared/campaignState.ts); Acts 2+ read that flag to
 * branch the canonical memoir-narrator framing.
 *
 * Timing hook (spec §5): the pillar appears synced to the Last Words
 * chorus-1 line at 66s from song start. This component is pure
 * presentation + click handling; the 66s-sync is the parent's
 * responsibility (it mounts this component at the right moment and
 * unmounts after the pick).
 *
 * Visual: two vertical pillars, gold (Light) + obsidian (Dark),
 * separated by a thin brass rule. Each pillar carries a short
 * subtitle derived from spec §5's Acts-2-opener text for the
 * relevant outcome × alignment combination. The parent passes the
 * trial outcome so the subtitle reflects the right branch; if
 * omitted, neutral subtitles are used (the §5.8.1 moment fires
 * after turn 10 so in practice the outcome is always known).
 */
import { useState } from "react";
import type { LightDarkAlignment } from "@shared/campaignState";

export interface ChoicePillarLightDarkProps {
  /** The Authority trial verdict. Drives the per-pillar subtitle copy
   *  per spec §5. Omit to use the neutral fallback subtitle. */
  trialOutcome?: "overturn" | "sentence_passed";
  /** Called with the player's pick. The caller is expected to write
   *  the flag via setLightDarkAlignment() and unmount this component. */
  onPick: (alignment: LightDarkAlignment) => void;
}

/** Per spec §5, the four outcome × alignment combos with their
 *  canonical Act-2-opener framing line. Pillar subtitles use these. */
const SUBTITLES: Readonly<
  Record<"overturn" | "sentence_passed" | "neutral", { light: string; dark: string }>
> = {
  overturn: {
    light:
      "The Authority's delay is granted. Carry forward what the Engineer died for.",
    dark: "The Authority's delay is granted. Let the Engineer's thought die uncarried.",
  },
  sentence_passed: {
    light:
      "The Engineer is executed. Carry the legacy forward — the Potential lives.",
    dark: "The Engineer is executed. Let the thought die with him — the Empire wins quietly.",
  },
  neutral: {
    light: "Commit to what the Engineer died for.",
    dark: "Let the Engineer's thought die uncarried.",
  },
};

export function ChoicePillarLightDark({
  trialOutcome,
  onPick,
}: ChoicePillarLightDarkProps) {
  const [picked, setPicked] = useState<LightDarkAlignment | null>(null);

  const subtitles = SUBTITLES[trialOutcome ?? "neutral"];

  const handlePick = (alignment: LightDarkAlignment) => {
    if (picked) return; // one-shot per spec §5
    setPicked(alignment);
    onPick(alignment);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Light or Dark alignment choice"
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
    >
      {/* Caption above the pillars — quiet instruction, not a prompt */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 text-center">
        <p className="font-serif text-sm uppercase tracking-[0.4em] void-text-dim">
          The last words
        </p>
      </div>

      <div className="flex items-stretch gap-0">
        {/* Light pillar */}
        <button
          type="button"
          aria-label="Choose Light"
          disabled={picked !== null}
          onClick={() => handlePick("light")}
          className={
            "group relative flex-col flex w-64 h-[60vh] px-6 py-10 " +
            "border void-border bg-gradient-to-b from-amber-100/10 via-amber-200/5 to-amber-50/10 " +
            "transition-all duration-500 " +
            (picked === "light"
              ? "void-border shadow-[0_0_40px_rgba(255,220,130,0.5)] scale-[1.02]"
              : picked !== null
                ? "opacity-30"
                : "void-border hover:shadow-[0_0_24px_rgba(255,220,130,0.3)] cursor-pointer")
          }
        >
          <div className="flex-1 flex items-start justify-center pt-4">
            <span className="font-serif text-4xl tracking-[0.2em] void-text-accent">
              LIGHT
            </span>
          </div>
          <p className="font-serif text-[11px] void-text-accent leading-relaxed text-center mt-auto">
            {subtitles.light}
          </p>
        </button>

        {/* Separator — thin brass rule */}
        <div className="w-px void-bg-sunk" />

        {/* Dark pillar */}
        <button
          type="button"
          aria-label="Choose Dark"
          disabled={picked !== null}
          onClick={() => handlePick("dark")}
          className={
            "group relative flex-col flex w-64 h-[60vh] px-6 py-10 " +
            "border void-border bg-gradient-to-b from-stone-900/80 via-black/90 to-stone-950/95 " +
            "transition-all duration-500 " +
            (picked === "dark"
              ? "void-border shadow-[0_0_40px_color-mix(in oklch, var(--bg-void) 90%, transparent)] scale-[1.02]"
              : picked !== null
                ? "opacity-30"
                : "void-border hover:shadow-[0_0_24px_rgba(40,40,50,0.8)] cursor-pointer")
          }
        >
          <div className="flex-1 flex items-start justify-center pt-4">
            <span className="font-serif text-4xl tracking-[0.2em] void-text">
              DARK
            </span>
          </div>
          <p className="font-serif text-[11px] void-text-dim leading-relaxed text-center mt-auto">
            {subtitles.dark}
          </p>
        </button>
      </div>
    </div>
  );
}

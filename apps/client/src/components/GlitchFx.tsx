/* ═══════════════════════════════════════════════════════
   GLITCH FX — Cheap, widely-applicable visual corruption

   A CSS-only counterpart to ShaderOverlay.frag. Where the
   fullscreen WebGL shader is the right tool for narrative
   beats (Thought Virus infection, morality spectrum), this
   component is the right tool for _lots of small elements_:
   locked roster cards, classified codex entries, redacted
   names, "error" states, cryo-wake title text.

   Why CSS? On an iPhone 60fps budget, spinning up a fresh
   WebGLRenderer per card is pure waste. This component
   uses clip-path + text-shadow + a single keyframe and
   costs effectively nothing per element.

   Variants:
     "chroma"  — RGB chromatic aberration on text / images
                 (magenta behind + cyan in front, both slightly
                 offset, with a subtle jitter). Best for logos
                 and fighter splash names.
     "redact"  — Replaces glyphs with █ block characters and
                 drifts horizontal bands. Best for classified
                 codex entries — intriguing without spoiling.
     "lock"    — Grayscale + reduced saturation + sparse glitch
                 band sweep. Best for locked roster/gallery
                 items that should still show silhouette.

   All variants are gated by `.reduce-motion` and scale with
   `--motion-intensity` — when the user's slider hits 0, the
   effect is still visible (static) but the motion stops.
   ═══════════════════════════════════════════════════════ */
import type { ReactNode, CSSProperties } from "react";

export type GlitchVariant = "chroma" | "redact" | "lock";

interface GlitchFxProps {
  children: ReactNode;
  variant: GlitchVariant;
  /** 0..1 — overrides the default intensity per variant. */
  intensity?: number;
  /** Extra classes passed through to the wrapper. */
  className?: string;
  /** For "redact": used to determine block count if children is text. Optional. */
  redactText?: string;
  /** For "chroma" / "lock" — controls whether motion also pulses with audio-bass. */
  audioReactive?: boolean;
  style?: CSSProperties;
}

export default function GlitchFx({
  children,
  variant,
  intensity,
  className = "",
  redactText,
  audioReactive = false,
  style,
}: GlitchFxProps) {
  const intensityVar: CSSProperties =
    intensity !== undefined ? ({ ["--glitch-intensity" as string]: String(clamp01(intensity)) } as CSSProperties) : {};

  const audioVar: CSSProperties = audioReactive
    ? ({ ["--glitch-audio" as string]: "var(--audio-bass, 0)" } as CSSProperties)
    : {};

  if (variant === "redact") {
    // For redacted text, we replace children with a block-character string
    // of equivalent length so layout doesn't shift. The real children are
    // still rendered (visually hidden) for screen-reader clarity.
    const source = redactText ?? (typeof children === "string" ? children : "");
    const blocks = source.length > 0 ? "█".repeat(Math.max(6, source.length)) : "████████";
    return (
      <span
        className={`void-glitch void-glitch-redact ${className}`}
        data-variant="redact"
        style={{ ...intensityVar, ...audioVar, ...style }}
      >
        <span aria-hidden="true" className="void-glitch-redact__blocks">
          {blocks}
        </span>
        <span className="sr-only">{children}</span>
      </span>
    );
  }

  return (
    <span
      className={`void-glitch void-glitch-${variant} ${className}`}
      data-variant={variant}
      data-text={typeof children === "string" ? children : undefined}
      style={{ ...intensityVar, ...audioVar, ...style }}
    >
      {children}
    </span>
  );
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

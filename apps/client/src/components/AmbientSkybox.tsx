/* ═══════════════════════════════════════════════════════
   AMBIENT SKYBOX — Persistent "every page is in space" layer

   Sits behind AppShellImmersive and survives route changes.
   Replaces the flat blurred Ark-control-room image that every
   non-custom page shows today, which was reading as "web app
   background image" rather than "the void behind the Ark."

   Three ultra-cheap GPU-composited layers:
     1. Deep void gradient (static) — anchors the palette.
     2. Far-star dust — procedural radial-gradient spots drifting
        on a 180s loop. Motion-intensity scales drift speed.
     3. Nebula glow — slow oscillating radial gradient (6s pulse)
        optionally audio-reactive when the player has a track on.

   No canvas, no WebGL, no RAF. Total cost: three composited
   divs with transform animations. Holds 60fps on iPhone 11.

   Respects:
     html.reduce-motion  → all drift stops, static starfield remains.
     --motion-intensity  → scales animation durations.
     --audio-bass        → subtle nebula brightness pulse (via CSS).
   ═══════════════════════════════════════════════════════ */
import { memo, type CSSProperties } from "react";

interface AmbientSkyboxProps {
  /** Override nebula hue (expects oklch or hex). Defaults to --energy-primary. */
  nebulaColor?: string;
  /** Scale the whole layer's opacity. Useful for pages that want a darker cockpit. */
  opacity?: number;
}

/**
 * Dense starfield via a single `radial-gradient` with many color stops and a
 * `background-size` tile. Drift comes from animating `background-position`.
 * One element; GPU composited; no layout thrash.
 */
const STAR_DUST_BACKGROUND = `
  radial-gradient(1px 1px at 11% 23%,  rgba(255,255,255,0.75), transparent 50%),
  radial-gradient(1px 1px at 37% 68%,  rgba(255,255,255,0.55), transparent 50%),
  radial-gradient(1px 1px at 64% 14%,  rgba(51,226,230,0.60),  transparent 50%),
  radial-gradient(1px 1px at 82% 52%,  rgba(255,255,255,0.65), transparent 50%),
  radial-gradient(1.2px 1.2px at 18% 82%, rgba(160,120,255,0.55), transparent 50%),
  radial-gradient(1px 1px at 48% 38%,  rgba(255,255,255,0.50), transparent 50%),
  radial-gradient(1px 1px at 92% 78%,  rgba(255,255,255,0.45), transparent 50%),
  radial-gradient(1.4px 1.4px at 6% 56%,  rgba(255,140,40,0.35),  transparent 50%),
  radial-gradient(1px 1px at 72% 88%,  rgba(255,255,255,0.55), transparent 50%),
  radial-gradient(1px 1px at 28% 4%,   rgba(51,226,230,0.40),  transparent 50%),
  radial-gradient(1px 1px at 54% 92%,  rgba(255,255,255,0.50), transparent 50%),
  radial-gradient(1px 1px at 88% 22%,  rgba(255,255,255,0.55), transparent 50%)
`;

function AmbientSkyboxInner({ nebulaColor, opacity = 1 }: AmbientSkyboxProps) {
  const style: CSSProperties = {
    opacity,
    // Expose the optional override to the nebula layer via a CSS var so
    // consumers can swap hue per-atmosphere without prop drilling.
    ...(nebulaColor ? ({ ["--skybox-nebula" as string]: nebulaColor } as CSSProperties) : {}),
  };

  return (
    <div
      className="ambient-skybox"
      aria-hidden="true"
      style={style}
    >
      <div className="ambient-skybox__void" />
      <div
        className="ambient-skybox__stars"
        style={{
          backgroundImage: STAR_DUST_BACKGROUND,
          backgroundSize: "620px 620px",
        }}
      />
      <div className="ambient-skybox__nebula" />
    </div>
  );
}

export default memo(AmbientSkyboxInner);

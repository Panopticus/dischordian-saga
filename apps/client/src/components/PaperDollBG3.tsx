/* ═══════════════════════════════════════════════════════
   PAPER DOLL BG3 RENDERER (plan §G.9)

   Minimal SVG renderer that takes a Loadout and draws one
   colored rectangle per composited layer. This is a
   stand-in for the eventual PNG compositor — it proves the
   layering math, the base-lock invariant, and the tint
   pathway are all wired correctly so the real renderer can
   drop in without changing any callers.

   Opt-in via the DRESSUP_V2 feature flag:
     localStorage.setItem("DRESSUP_V2", "on")
   (or VITE_DRESSUP_V2=on at build time). Off by default —
   the legacy EquipmentPanel keeps rendering until the real
   PNGs ship and a follow-up PR flips the default.
   ═══════════════════════════════════════════════════════ */

import {
  compositePaperDoll,
  hasRequiredBaseLayers,
  type Loadout,
  type CompositedLayer,
} from "@/game/paperDoll/compositePaperDoll";
import type { SuitEquipSlot } from "@shared/suitEquipSlots";

interface Props {
  loadout: Loadout;
  /** Element tint applied to every layer with tintMask: true. CSS color string. */
  elementTint?: string;
  /** Canvas-width override (base is 1024 to match the art spec). */
  width?: number;
}

/** Canvas dimensions baked in §G.8. */
const CANVAS_W = 1024;
const CANVAS_H = 1536;

/** Per-slot placeholder rectangles. Coordinates in the §G.8 pivot grid. */
const SLOT_RECTS: Record<SuitEquipSlot, {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
}> = {
  aura: { x: 256, y: 300, w: 512, h: 1000, fill: "#b6a8f2" },
  back: { x: 340, y: 340, w: 344, h: 900, fill: "#2b2414" },
  legs: { x: 390, y: 900, w: 244, h: 280, fill: "#13344a" },
  feet: { x: 400, y: 1380, w: 224, h: 80, fill: "#050506" },
  "base-suit": { x: 380, y: 320, w: 264, h: 1100, fill: "#221b2d" },
  chest: { x: 380, y: 380, w: 264, h: 380, fill: "#7a1e13" },
  belt: { x: 380, y: 760, w: 264, h: 70, fill: "#5b4a2a" },
  "weapon-offhand": { x: 260, y: 820, w: 100, h: 200, fill: "#8b47c2" },
  arms: { x: 340, y: 620, w: 344, h: 260, fill: "#4fa86b" },
  gloves: { x: 310, y: 860, w: 60, h: 60, fill: "#d9a23b" },
  shoulders: { x: 360, y: 340, w: 304, h: 100, fill: "#3b6edb" },
  neck: { x: 460, y: 300, w: 104, h: 60, fill: "#8c8c8c" },
  "base-mask": { x: 460, y: 120, w: 104, h: 190, fill: "#2b2414" },
  head: { x: 450, y: 100, w: 124, h: 210, fill: "#a87f3b" },
  face: { x: 470, y: 220, w: 84, h: 80, fill: "#f4a13a" },
  "ring-1": { x: 690, y: 870, w: 18, h: 18, fill: "#d8f05a" },
  "ring-2": { x: 710, y: 870, w: 18, h: 18, fill: "#d8f05a" },
  "weapon-primary": { x: 660, y: 820, w: 120, h: 300, fill: "#c79eff" },
};

export default function PaperDollBG3({ loadout, elementTint, width = 512 }: Props) {
  if (!hasRequiredBaseLayers(loadout)) {
    return (
      <div className="font-mono text-xs text-muted-foreground/60 p-4 rounded border border-red-500/40">
        PaperDollBG3: base-mask or base-suit missing. Run
        resolveStarterLoadout() before rendering.
      </div>
    );
  }

  const layers: readonly CompositedLayer[] = compositePaperDoll(loadout);
  const aspect = CANVAS_H / CANVAS_W;

  return (
    <svg
      role="img"
      aria-label="Paper doll preview"
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      width={width}
      height={width * aspect}
      style={{ background: "transparent" }}
    >
      {layers.map((layer) => {
        const rect = SLOT_RECTS[layer.slot];
        if (!rect) return null;
        const baseFill = rect.fill;
        const tint = layer.tintMask && elementTint ? elementTint : baseFill;
        return (
          <g key={`${layer.slot}:${layer.layerZ}`}>
            <rect
              x={rect.x}
              y={rect.y}
              width={rect.w}
              height={rect.h}
              fill={tint}
              stroke="#00000066"
              strokeWidth={2}
              opacity={0.9}
            />
            <text
              x={rect.x + rect.w / 2}
              y={rect.y + rect.h / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="monospace"
              fontSize={14}
              fill="#ffffffb0"
            >
              {layer.slot}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Returns true iff the DRESSUP_V2 feature flag is currently enabled
 * for this browser. Callers can gate component imports off this —
 * the flag flips default once the real PNG catalog ships and the
 * renderer switches off placeholder rectangles.
 */
export function isDressupV2Enabled(): boolean {
  if (typeof window === "undefined") return false;
  // Build-time override wins.
  const buildFlag = (import.meta as unknown as { env?: Record<string, string> })
    .env?.VITE_DRESSUP_V2;
  if (buildFlag === "on") return true;
  try {
    return window.localStorage.getItem("DRESSUP_V2") === "on";
  } catch {
    return false;
  }
}

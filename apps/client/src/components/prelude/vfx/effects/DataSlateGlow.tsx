/**
 * DataSlateGlow — Cyan-pulsing data slate with glyph-grid mask.
 *
 * Pulse slows from ~1 Hz to ~0.25 Hz after "read" state.
 * Beat F. Bible §11.6, §18.2.
 */
import { useMemo } from "react";
import { registerPreludeVfx, type PreludeVfxProps } from "../preludeVfxRegistry";
import "../prelude-vfx.css";

export function DataSlateGlow({ active, state = "pulsing", onComplete, className = "" }: PreludeVfxProps) {
  const isRead = state === "read" || state === "slowdown";
  const animation = isRead
    ? "pvfx-slate-slow 4s ease-in-out infinite"
    : "pvfx-slate-pulse 1s ease-in-out infinite";

  const glyphGrid = useMemo(() => {
    // Generate a repeating glyph-grid mask pattern
    const size = 4;
    const cells: React.ReactNode[] = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        cells.push(
          <div
            key={`${r}-${c}`}
            style={{
              width: "25%",
              height: "25%",
              borderRight: "1px solid rgba(34, 211, 238, 0.15)",
              borderBottom: "1px solid rgba(34, 211, 238, 0.15)",
              boxSizing: "border-box",
            }}
          />,
        );
      }
    }
    return cells;
  }, []);

  if (!active) return null;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        width: "120px",
        height: "80px",
        borderRadius: "4px",
        backgroundColor: "rgba(34, 211, 238, 0.08)",
        border: "1px solid rgba(34, 211, 238, 0.3)",
        animation,
        overflow: "hidden",
        pointerEvents: "none",
      }}
      onAnimationEnd={onComplete}
    >
      <div style={{ display: "flex", flexWrap: "wrap", width: "100%", height: "100%" }}>
        {glyphGrid}
      </div>
    </div>
  );
}

registerPreludeVfx("vfx_data_slate_glow", {
  component: DataSlateGlow,
  label: "Data Slate Glow",
  mode: "stateful",
});

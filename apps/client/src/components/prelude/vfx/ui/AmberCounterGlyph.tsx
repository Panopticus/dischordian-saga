/**
 * AmberCounterGlyph — Canonical unread-count indicator.
 *
 * Beat H. Bible §14.6, §18.3.
 * Amber #fbbf24 is the canonical unread-count color across the
 * entire game. Reused anywhere an Inbox unread count appears.
 */
import { registerPreludeVfx, type PreludeVfxProps } from "../preludeVfxRegistry";

interface AmberCounterProps extends PreludeVfxProps {
  /** The unread count to display. */
  count?: number;
}

export function AmberCounterGlyph({ active, count = 1, className = "" }: AmberCounterProps) {
  if (!active || count <= 0) return null;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        minWidth: "20px",
        height: "20px",
        borderRadius: "10px",
        backgroundColor: "#fbbf24",
        color: "#1e1b4b",
        fontSize: "11px",
        fontWeight: 700,
        fontFamily: "monospace",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 6px",
        boxShadow: "0 0 8px #fbbf24, 0 0 16px color-mix(in oklch, var(--energy-premium) 30%, transparent)",
        pointerEvents: "none",
      }}
    >
      {count}
    </div>
  );
}

registerPreludeVfx("vfx_amber_counter_glyph", {
  component: AmberCounterGlyph as React.ComponentType<PreludeVfxProps>,
  label: "Amber Counter Glyph",
  mode: "continuous",
});

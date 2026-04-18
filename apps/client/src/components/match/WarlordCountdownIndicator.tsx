/**
 * §5.5 Warlord three-move lockout countdown indicator.
 *
 * Three brass tiles, horizontally arranged, mounted in the upper-right
 * of the match field. Each tile shows a numeral (3 / 2 / 1). At lockout
 * activation all three tiles are lit; as the player completes each
 * lockout turn the corresponding tile dims to a "spent" state. When the
 * lockout ends, the indicator fades out.
 *
 * Spec: docs/production/act1/warlord-three-move-mechanic.md §2.3.
 *
 * Visual rules:
 *  - Lit tile: brass-glow background, ember-orange text on highlight,
 *    dust-brown border (Nexon palette per spec §5.4.1)
 *  - Spent tile: brass tone but no glow, numeral retained at 50% opacity
 *  - Highlighted tile: the lit tile that matches `turnsRemaining`
 *
 * The indicator is purely presentational — it reads `lockout` from the
 * adapted GameState and renders. Visibility is controlled by the
 * caller (render only when lockout is present).
 */
import { useEffect, useState } from "react";

interface WarlordCountdownIndicatorProps {
  /** turnsRemaining from gameState.lockout. Drives lit/spent state. */
  turnsRemaining: number;
  /**
   * True when the lockout just ended this frame (turnsRemaining
   * transitioned to 0 last tick). Used to play the 2-second fade-out
   * spec §2.3 calls for. The caller should set true for ~2s after the
   * `warlord_lockout_ended` event, then unmount the component.
   */
  fadingOut?: boolean;
}

const TILES: ReadonlyArray<{ label: number; index: number }> = [
  { label: 3, index: 0 },
  { label: 2, index: 1 },
  { label: 1, index: 2 },
];

export function WarlordCountdownIndicator({
  turnsRemaining,
  fadingOut = false,
}: WarlordCountdownIndicatorProps) {
  // The fade transition is handled by Tailwind's `transition-opacity` on
  // the wrapper; we just toggle the opacity class based on `fadingOut`.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      role="status"
      aria-label={`Warlord lockout: ${turnsRemaining} of 3 turns remaining`}
      className={`absolute top-3 right-3 z-30 flex gap-1.5 transition-opacity duration-1000 ${
        mounted && !fadingOut ? "opacity-100" : "opacity-0"
      }`}
    >
      {TILES.map((t) => {
        // A tile is "spent" once the corresponding lockout turn has
        // passed. Tile 3 is spent when turnsRemaining < 3 (one player
        // turn elapsed); tile 2 when < 2; tile 1 when < 1 (lockout
        // ended). The currently-active turn tile is the lit one whose
        // label === turnsRemaining.
        const spent = turnsRemaining < t.label;
        const highlighted = !spent && turnsRemaining === t.label;
        return (
          <div
            key={t.label}
            className={
              "w-9 h-9 flex items-center justify-center rounded border font-mono text-sm font-bold transition-all duration-300 " +
              (spent
                ? "void-bg-sunk void-border void-text-accent"
                : highlighted
                  ? "void-bg-sunk void-border void-text-premium shadow-[0_0_8px_rgba(255,140,40,0.55)]"
                  : "void-bg-sunk void-border void-text-accent")
            }
          >
            {t.label}
          </div>
        );
      })}
    </div>
  );
}

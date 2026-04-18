/**
 * §4.9 Seer prophecy — card-play visual signal.
 *
 * Minimal foundation-level UI for the spec §2.1 "800ms flicker + 2-card
 * superimposition" mechanic. A full dedicated art pass (Canon Rev 7
 * §5.6.9 Last Words treatment) is the design target for this visual;
 * this component surfaces a lightweight placeholder — a brief,
 * translucent caption — so the player has an unambiguous signal that
 * the Seer's play came from a future turn.
 *
 * Usage: the parent DuelystGameUI mounts this component briefly each
 * time `gameState.seerProphecy.playsPerformed` increments. The
 * component manages its own 800ms lifetime and unmounts via onDismiss.
 *
 * Accessibility (spec §6.3): the screen-reader announcement — "The
 * Seer plays a card from a future turn. Her hand count does not
 * decrease." — is fired by the parent via the existing `announce()`
 * helper, NOT by this component (to avoid duplicate announcements if
 * the component remounts on re-render).
 */
import { useEffect } from "react";

export interface SeerPlayOverlayProps {
  /** Fired after the 800ms lifetime expires. Parent unmounts. */
  onDismiss: () => void;
}

/** Spec §2.1 visual-signal duration. */
export const SEER_PLAY_OVERLAY_MS = 800;

export function SeerPlayOverlay({ onDismiss }: SeerPlayOverlayProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, SEER_PLAY_OVERLAY_MS);
    return () => window.clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
    >
      <div
        className="px-8 py-4 rounded border void-border void-bg-canvas backdrop-blur-sm"
        style={{
          animation: `seer-flicker ${SEER_PLAY_OVERLAY_MS}ms ease-out forwards`,
        }}
      >
        <p className="font-serif text-sm tracking-[0.3em] uppercase void-text-accent text-center">
          The Seer plays a card from a future turn
        </p>
      </div>
      <style>{`
        @keyframes seer-flicker {
          0%   { opacity: 0;   transform: scale(0.98); }
          15%  { opacity: 0.9; transform: scale(1); }
          35%  { opacity: 0.35; }
          55%  { opacity: 0.9; }
          75%  { opacity: 0.55; }
          100% { opacity: 0;   transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}

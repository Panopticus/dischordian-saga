/**
 * §5.5 Warlord lockout — card lock overlay.
 *
 * Mounted inside each player hand-card button when the card is locked
 * by the active Warlord lockout. The overlay produces the visual
 * spec §2.4.1 calls for: 30% opacity dimming + brass-outlined lock
 * icon, attempted plays land in the rejection toast (handled by the
 * parent click handler).
 *
 * Pure presentational — the parent decides when to render this by
 * checking `gameState.lockout?.lockedEntityIds.includes(card.id)`.
 */
import { Lock } from "lucide-react";

export function CardLockOverlay() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 rounded-lg bg-black/70 flex items-center justify-center pointer-events-none"
    >
      <Lock className="w-6 h-6 text-amber-400/90 drop-shadow-[0_0_3px_rgba(255,180,80,0.7)]" />
    </div>
  );
}

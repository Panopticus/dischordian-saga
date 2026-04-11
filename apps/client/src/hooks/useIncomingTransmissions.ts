/* ═══════════════════════════════════════════════════════
   useIncomingTransmissions — "TRANSMISSION INCOMING" toast

   Watches the player context for newly unlocked Meme
   broadcasts. When one becomes available for the first time,
   fires a toast and marks it as notified in game state so
   the player isn't pinged twice for the same transmission.

   Mounted once globally in AppShellImmersive — do NOT use
   in individual page components.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useGame } from "@/contexts/GameContext";
import { usePlayerContext } from "@/hooks/usePlayerContext";
import {
  ALL_TRANSMISSIONS,
  getNewlyUnlocked,
  transmissionId,
} from "@shared/transmissions";

export function useIncomingTransmissions() {
  const { state, markTransmissionNotified } = useGame();
  const ctx = usePlayerContext();
  // Debounce repeated fires during a single tick of fast state updates.
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Respect the "already notified" list so we survive page reloads.
    const notified = new Set(state.transmissionsNotified ?? []);
    const watched = new Set(state.transmissionsWatched ?? []);

    // "Newly unlocked" means unlocked AND not already notified AND
    // not already watched (e.g. legacy installs where watched ids
    // were never marked as notified).
    const newly = getNewlyUnlocked(ctx, [...notified, ...watched]);
    if (newly.length === 0) return;

    for (const t of newly) {
      const id = transmissionId(t);
      if (firedRef.current.has(id)) continue;
      firedRef.current.add(id);

      // Mark notified first so a re-run of the effect (caused by
      // state update inside the toast callback) doesn't re-fire.
      markTransmissionNotified(id);

      toast.info("▸ TRANSMISSION INCOMING", {
        description: `Late Night with the Meme: "${t.title}"`,
        duration: 7000,
        action: {
          label: "Watch",
          onClick: () => {
            window.location.assign("/transmissions");
          },
        },
      });
    }
  }, [ctx, state.transmissionsNotified, state.transmissionsWatched, markTransmissionNotified]);
}

/** Exported for tests. Number of currently-unlocked transmissions
 *  for a given player context. */
export function countUnlockedForContext(
  ctx: Parameters<typeof getNewlyUnlocked>[0],
  alreadyNotified: string[],
): number {
  return ALL_TRANSMISSIONS.filter(
    t => !alreadyNotified.includes(transmissionId(t)),
  ).filter(t => getNewlyUnlocked(ctx, alreadyNotified).includes(t)).length;
}

/**
 * useHellboxDiscovery — Beat-B side effect
 *
 * Watches GameContext for the player entering the medical bay and
 * persists HELLBOX_DISCOVERED_FLAG the first time they do. After
 * discovery, the player can navigate to /hellbox at will and the
 * portal selector unlocks (per apps/shared/hellboxPortal.ts state
 * machine).
 *
 * Mounts as a side-effect-only hook in App.tsx — no JSX, no return.
 *
 * Canon: the Hellbox is wired into the medbay's cloning pod (per
 * docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md Beat B). The
 * discovery itself is the player walking into the medbay; the
 * compelled-transport cinematic (Beat C) fires when they
 * subsequently navigate to /hellbox.
 */

import { useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { HELLBOX_DISCOVERED_FLAG } from "@shared/matrixSaveFlags";

/** Both spellings of the medbay room id occur in the codebase
 *  (kebab in GameContext currentRoomId; snake in arkEventHandler).
 *  Match either. */
const MEDBAY_ROOM_IDS = ["medical-bay", "medical_bay", "medbay", "med-bay"] as const;

export function useHellboxDiscovery(): void {
  const { state, setNarrativeFlag } = useGame();
  const currentRoomId = state.currentRoomId ?? "";
  const alreadyDiscovered = Boolean(state.narrativeFlags?.[HELLBOX_DISCOVERED_FLAG]);

  useEffect(() => {
    if (alreadyDiscovered) return;
    if (MEDBAY_ROOM_IDS.includes(currentRoomId as (typeof MEDBAY_ROOM_IDS)[number])) {
      setNarrativeFlag(HELLBOX_DISCOVERED_FLAG, true);
    }
  }, [currentRoomId, alreadyDiscovered, setNarrativeFlag]);
}

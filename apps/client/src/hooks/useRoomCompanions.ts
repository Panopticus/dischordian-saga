/* ═══════════════════════════════════════════════════════
   useRoomCompanions — companion-presence + visit-badge resolver

   Plan §B5 consumer. Combines companionRoomRegistry +
   useCompanionVisits so a room renderer can answer:

     "Who is currently in this room, and which of them have
      new dialogue I haven't seen since my last visit?"

   in one hook call.

   This does not render anything; it returns the data the
   room renderer drops into a presence-marker / badge widget.
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import {
  listCompanionsInRoom,
  type CompanionRoomEntry,
  type CompanionRoomId,
  type CompanionRosterId,
} from "@shared/companionRoomRegistry";
import { useCompanionVisits } from "./useCompanionVisits";
import { useGame } from "@/contexts/GameContext";

export interface CompanionRoomPresence {
  entry: CompanionRoomEntry;
  /** True iff the player has unread content for this companion at
   *  the version baked into the bank. Drives the badge UI. */
  hasUnread: boolean;
}

export interface UseRoomCompanionsResult {
  companions: CompanionRoomPresence[];
  /** Mark the named companion as visited at the given version. */
  visit: (companionId: CompanionRosterId, currentVersion: number) => void;
}

export function useRoomCompanions(
  roomId: CompanionRoomId,
  /** Per-companion content version. Pass the banks' authored
   *  version integers; companions without a tracked version are
   *  treated as never-unread. */
  versions: Partial<Record<CompanionRosterId, number>> = {},
): UseRoomCompanionsResult {
  const { state } = useGame();
  const { hasUnread, visit } = useCompanionVisits();

  const companions = useMemo<CompanionRoomPresence[]>(() => {
    const present = listCompanionsInRoom(roomId, state.narrativeFlags);
    return present.map((entry) => ({
      entry,
      hasUnread: hasUnread(entry.companionId, versions[entry.companionId] ?? 0),
    }));
  }, [roomId, state.narrativeFlags, hasUnread, versions]);

  return { companions, visit };
}

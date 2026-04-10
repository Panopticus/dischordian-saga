/* ═══════════════════════════════════════════════════════
   GEAR SYNC HOOK — Hydrates the localStorage equipment cache
   (client/src/game/equipmentState.ts) from the server's
   authoritative citizenCharacters.gear JSON on app load.

   Without this, legacy consumers of getEquippedItems() —
   CharacterWidget, TradeEmpirePage's mission-speed bonus,
   etc. — show stale or empty state on a fresh device because
   they only read localStorage. With this, localStorage is
   treated as a cache: the server is the source of truth, and
   the cache is refilled every time citizen.getCharacter
   returns fresh data.

   Mount once in GameGate (client/src/App.tsx) so every
   authenticated session hydrates before any gear-dependent
   UI renders.
   ═══════════════════════════════════════════════════════ */

import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { seedEquippedItems } from "@/game/equipmentState";

/**
 * Subscribes to citizen.getCharacter and mirrors the server's gear
 * map into the localStorage equipment cache whenever it changes.
 * Safe to call unconditionally — the query is enabled only when
 * the user is authenticated (the tRPC context guards it).
 */
export function useGearSync(): void {
  const { data } = trpc.citizen.getCharacter.useQuery(undefined, {
    // Gear changes come through citizen.updateGear (which invalidates
    // this query), so a long stale time is fine here.
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!data) return;
    // char.data.gear is Record<string, unknown> | null; seedEquippedItems
    // defensively resolves each slot against EQUIPMENT_DB.
    seedEquippedItems(data.gear as Record<string, string | null | undefined> | null | undefined);
  }, [data]);
}

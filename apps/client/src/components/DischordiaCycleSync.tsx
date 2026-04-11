/* ═══════════════════════════════════════════════════════
   DISCHORDIA CYCLE SYNC — thin React bridge.

   Mount once near the app root (inside GameProvider + tRPC
   provider). Does two jobs:

     1. Wires the module-level `syncUtils` reference in the
        dischordiaCycleStore so every subsequent `applyEnergy`
        call fires a fire-and-forget server mutation alongside
        the local state update.

     2. Hydrates the local store from the server on mount so
        the client meter reflects the community-wide state as
        soon as the app boots. Silently retries via the next
        tRPC getState query if the initial call fails.

   Renders nothing. Pure side-effect component.
   ═══════════════════════════════════════════════════════ */

import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import {
  hydrateDischordiaFromServer,
  initDischordiaSync,
  useDischordiaCycleStore,
} from "@/stores/dischordiaCycleStore";

export function DischordiaCycleSync() {
  const utils = trpc.useUtils();

  // Wire the utils reference into the store module so the
  // fire-and-forget write-through path lights up.
  useEffect(() => {
    initDischordiaSync(utils);
    return () => initDischordiaSync(null);
  }, [utils]);

  // Hydrate from server on mount. We use a useEffect + explicit
  // helper rather than `useQuery` so the component stays silent
  // and never triggers React re-renders for data it only writes
  // to the Zustand store.
  useEffect(() => {
    void hydrateDischordiaFromServer();
  }, []);

  // Subscribe to the community meter in case some other part of
  // the app wants a React re-render on server → local reconcile.
  // Not used by any consumer yet, but cheap.
  useDischordiaCycleStore((s) => s.state.lightEnergy);

  return null;
}

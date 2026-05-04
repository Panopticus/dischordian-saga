/* ═══════════════════════════════════════════════════════
   WATCHER HOST — lifecycle-only mount

   Sibling of CompanionHost / DreamerRelayHintsHost. Renders no
   UI of its own; its only job is to:

     1. Hydrate the local Watcher log mirror from the server on
        mount.
     2. Start the periodic batched-flush daemon.
     3. (Future, Stops 1–17) subscribe to scheduler context +
        observation log, evaluate trigger predicates, fire
        `fireCompanionComment(...)` to surface Watcher lines via
        the existing toast.

   Stop 0 ships only (1) and (2). Trigger evaluation lands as
   per-stop additions during the audit campaign.
   ═══════════════════════════════════════════════════════ */

import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { hydrateFromServer, startFlushDaemon } from "@/lib/watcher";

export function WatcherHost(): null {
  const utils = trpc.useUtils();

  useEffect(() => {
    // Best-effort hydrate. Failure (no auth, no DB) is silent — the
    // local mirror remains whatever localStorage has.
    void hydrateFromServer(utils);

    // Start batched flush. Returns a teardown that clears the
    // interval + visibilitychange listener.
    const stop = startFlushDaemon(utils);
    return stop;
  }, [utils]);

  // Trigger evaluation is added per audit stop. Pattern:
  //   useEffect(() => {
  //     const log = readLog();
  //     if (countByKind(log, "first_dissent") > 0 && /* ... */) {
  //       fireCompanionComment({ trigger: "watcher_act2_seen_dissent" });
  //     }
  //   }, [/* scheduler context */]);

  return null;
}

export default WatcherHost;

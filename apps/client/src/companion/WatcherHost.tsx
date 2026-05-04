/* ═══════════════════════════════════════════════════════
   WATCHER HOST — lifecycle-only mount

   Sibling of CompanionHost / DreamerRelayHintsHost. Renders no
   UI of its own; its responsibilities:

     1. Hydrate the local Watcher log mirror from the server on
        mount.
     2. Start the periodic batched-flush daemon.
     3. Evaluate act-gated Watcher trigger predicates and fire
        `fireCompanionComment(...)` so the toast surfaces them.

   Trigger predicates are act-gated by `narrativeAct >= N` and
   often by an additional flag/observation. Once-per-account is
   enforced by `maxPlays: 1` in the registered CompanionComment
   entries, not here — re-firing the trigger is harmless because
   the toast picker filters out played lines.
   ═══════════════════════════════════════════════════════ */

import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useGame } from "@/contexts/GameContext";
import { fireCompanionComment } from "@/lib/companionCommentQueue";
import { hydrateFromServer, startFlushDaemon } from "@/lib/watcher";

export function WatcherHost(): null {
  const utils = trpc.useUtils();
  const { state } = useGame();

  useEffect(() => {
    // Best-effort hydrate. Failure (no auth, no DB) is silent — the
    // local mirror remains whatever localStorage has.
    void hydrateFromServer(utils);

    // Start batched flush. Returns a teardown that clears the
    // interval + visibilitychange listener.
    const stop = startFlushDaemon(utils);
    return stop;
  }, [utils]);

  // Per-act trigger evaluation. Re-runs whenever narrativeAct
  // changes; the toast pipeline dedupes via maxPlays so spurious
  // re-fires are harmless. Each block is independent — adding new
  // lines means adding a new conditional fire here.
  useEffect(() => {
    const act = state.narrativeAct ?? 0;
    if (act < 3) return;
    // Stop 11 — Act 3 (Offer): the operator has crossed into Act 3.
    // Watcher comments on hesitation as a tracked signal.
    fireCompanionComment("watcher_act3_hesitation");
  }, [state.narrativeAct]);

  return null;
}

export default WatcherHost;

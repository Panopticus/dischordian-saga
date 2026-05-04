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
import { hydrateFromServer, readLog, startFlushDaemon } from "@/lib/watcher";

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
    // Stop 11 — Act 3 (Offer): hesitation-as-data tell.
    if (act >= 3) fireCompanionComment("watcher_act3_hesitation");
    // Stop 12 — Act 4 (Revelation): pattern-recognition tell.
    if (act >= 4) fireCompanionComment("watcher_act4_pattern");
    // Stop 13 — Act 4.5 (Circuit): three-retreats tell. Counts
    // pvp_retreat events across the whole log; >= 3 fires the
    // line. Act 4.5 is gated behind the act_4_5_started flag, but
    // the Watcher line itself is gated by accumulation rather
    // than a specific cinematic — the player who never retreats
    // doesn't hear it.
    if (act >= 4) {
      const log = readLog();
      const retreats = log.events.filter(e => e.kind === "pvp_retreat").length;
      if (retreats >= 3) {
        fireCompanionComment("watcher_act4_5_three_retreats");
      }
    }
    // Stop 14 — Act 5 (Map): chronosphere-placement tell. The
    // delayed_5s timing means the line follows Elara's
    // "seventeen thousand years" map-first-open beat rather than
    // racing it.
    if (act >= 5) fireCompanionComment("watcher_act5_chronosphere");
    // Stop 15 — Act 6 (Confession): the unification reveal. The
    // single most important Watcher line in the campaign — names
    // Architect / Panopticon / Source / Watcher as one entity and
    // claims authorship of the operator's experience. Bible-
    // locked tone; future copy passes refine but never edit.
    if (act >= 6) fireCompanionComment("watcher_act6_unification");
  }, [state.narrativeAct]);

  return null;
}

export default WatcherHost;

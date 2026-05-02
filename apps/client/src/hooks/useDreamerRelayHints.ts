/* ═══════════════════════════════════════════════════════
   DREAMER RELAY HINTS — D4 (dual-faction recruitment plan)

   Watches the dreamer-awareness state via the
   `dreamerAwareness.getStatus` query and fires Elara's covert-
   relay companion-comment lines on threshold crossings.

   The plan: Elara is the silent informant who relays the
   player's actions through the Oracle in Hiding to the
   Dreamer. Her hint lines never name the relay — they're
   ambient, under-explained, and rare. Players who notice the
   pattern figure her role out; players who don't still get
   pleasant character ambience.

   The fired triggers are:
     • dreamer_relay_threshold_3      — count crossed 3
     • dreamer_relay_after_vision_1   — vision 1 received
     • dreamer_relay_after_vision_2   — vision 2 received
     • dreamer_relay_after_vision_3   — vision 3 received

   Lines are authored in apps/shared/companionComments.ts and
   render via the existing CompanionCommentToast (max 1 play
   per trigger). If the toast subsystem is absent or the
   awareness state is unavailable, this hook is a silent
   no-op — no UI, no errors.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { fireCompanionComment } from "@/lib/companionCommentQueue";

interface PrevSnapshot {
  count: number;
  visions: number;
}

export function useDreamerRelayHints(): void {
  // Stale-cached aggressively — the query result moves only when a
  // new tag fires server-side, and the relay-hint events fire on
  // transitions, so refetching frequently isn't useful. Pull the
  // current status once per page load + once per app focus.
  const { data } = trpc.dreamerAwareness.getStatus.useQuery(undefined, {
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  const prevRef = useRef<PrevSnapshot | null>(null);

  useEffect(() => {
    if (!data) return;
    const next: PrevSnapshot = {
      count: data.count,
      visions: data.visionsReceivedCount,
    };
    const prev = prevRef.current;
    prevRef.current = next;

    // First read of the session — no transitions to detect; just
    // record the baseline.
    if (!prev) return;

    // Threshold-3 crossing — count went from < 3 to >= 3.
    if (prev.count < 3 && next.count >= 3) {
      fireCompanionComment("dreamer_relay_threshold_3");
    }
    // Vision deliveries — each increments the visions counter
    // monotonically. Fire once per crossing.
    if (prev.visions < 1 && next.visions >= 1) {
      fireCompanionComment("dreamer_relay_after_vision_1");
    }
    if (prev.visions < 2 && next.visions >= 2) {
      fireCompanionComment("dreamer_relay_after_vision_2");
    }
    if (prev.visions < 3 && next.visions >= 3) {
      fireCompanionComment("dreamer_relay_after_vision_3");
    }
  }, [data]);
}

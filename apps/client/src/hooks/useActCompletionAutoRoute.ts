/* ═══════════════════════════════════════════════════════
   ACT COMPLETION AUTO-ROUTE

   Watches narrativeFlags for act_N_complete transitions
   (1..7) and navigates the player to the canonical next-act
   surface so the campaign keeps flowing without requiring a
   manual return-to-bridge between acts.

   Routing table:
     act_1_complete → /bridge          (return for Locke + Antiquarian
                                        bridge messages, then Act 2)
     act_2_complete → /act3-card-ladder (Trade Empire substrate gates)
     act_3_complete → /collectors-arena (Act 4 prisoner chapter)
     act_4_complete → /act5-interlude   (Kael's star map + Iron Lion)
     act_5_complete → /act6-ladder      (Confession Hall)
     act_6_complete → /act7-card-ladder (Convergence Seat)
     act_7_complete → /bridge          (post-prestige hub)

   Idempotent — each act-complete flag triggers navigation at
   most once per session. The user can override by manually
   navigating elsewhere; the watcher does NOT re-route on
   subsequent renders unless they exit and the flag flips
   from false → true again (which only happens on a fresh
   prestige cycle).

   Mounted once at App root via the
   <ActCompletionAutoRouteWatcher/> wrapper.
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useGame } from "@/contexts/GameContext";

interface ActRoute {
  flag: string;
  destination: string;
}

const ACT_ROUTES: ReadonlyArray<ActRoute> = [
  { flag: "act_1_complete", destination: "/bridge" },
  { flag: "act_2_complete", destination: "/act3-card-ladder" },
  { flag: "act_3_complete", destination: "/collectors-arena" },
  { flag: "act_4_complete", destination: "/act5-interlude" },
  { flag: "act_5_complete", destination: "/act6-ladder" },
  { flag: "act_6_complete", destination: "/act7-card-ladder" },
  { flag: "act_7_complete", destination: "/bridge" },
];

/** Debounce: wait this long after the flag fires before navigating,
 *  giving the act-complete cutscene + slideshows time to play. */
const POST_COMPLETE_NAVIGATE_DELAY_MS = 1800;

export function useActCompletionAutoRoute(): void {
  const { state } = useGame();
  const [, navigate] = useLocation();
  const flags = state.narrativeFlags ?? {};
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    for (const { flag, destination } of ACT_ROUTES) {
      if (!flags[flag]) continue;
      if (firedRef.current.has(flag)) continue;
      firedRef.current.add(flag);
      const timer = setTimeout(() => {
        navigate(destination);
      }, POST_COMPLETE_NAVIGATE_DELAY_MS);
      // Best-effort cleanup; the navigate fires once and the ref
      // guards against duplicate fires.
      return () => clearTimeout(timer);
    }
  }, [flags, navigate]);
}

export function ActCompletionAutoRouteWatcher(): null {
  useActCompletionAutoRoute();
  return null;
}

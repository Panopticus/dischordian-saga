/* ═══════════════════════════════════════════════════════
   DREAMER VISION PLAYER (D2 in
   /root/.claude/plans/continue-your-qr-assessment-mighty-valley.md)

   Mount once near the app root, alongside SlideshowPlayerRoot.
   On authenticated session start, polls
   `dreamerVisions.getNextPendingVision` once. If a vision is
   pending (the player has crossed an awareness threshold without
   yet receiving the corresponding vision), queues it via
   `playSlideshow(...)` and marks it received on completion.

   Contracts:
     - Fires AT MOST ONCE per page load (the per-vision idempotency
       lives server-side via dreamer_awareness.visionsReceived).
       Re-mounting / route changes don't re-fetch.
     - Does NOT block the title screen. The vision plays as an
       overlay via the existing SlideshowPlayerRoot host; the
       player can dismiss it like any other slideshow.
     - On completion, calls markVisionReceived so the next pending
       vision (if any) becomes available next session.
     - Silent on the no-vision path — no toast, no log, no badge.
       The player's awareness journey stays hidden; visions are
       the only visible signal.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useWitnessingStore } from "@/stores/witnessingStore";
import { trpc } from "@/lib/trpc";

export default function DreamerVisionPlayer(): null {
  const { isAuthenticated } = useAuth();
  const playSlideshow = useWitnessingStore((s) => s.playSlideshow);
  const firedRef = useRef(false);

  const pendingQuery = trpc.dreamerVisions.getNextPendingVision.useQuery(
    undefined,
    {
      enabled: isAuthenticated && !firedRef.current,
      // Don't refetch on focus / window changes; the orchestrator
      // is intentionally a one-shot per page load. The next vision
      // (if any) waits for the next session.
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: Infinity,
    },
  );

  const markReceivedMutation =
    trpc.dreamerVisions.markVisionReceived.useMutation();

  useEffect(() => {
    if (firedRef.current) return;
    if (!isAuthenticated) return;
    const vision = pendingQuery.data?.vision;
    if (!vision) return;

    firedRef.current = true;
    playSlideshow(vision.slideshow, {
      onComplete: () => {
        // Best-effort. If the marking fails (offline, transient
        // 5xx), the player will see the same vision again on next
        // login — preferable to losing the cutscene to a stale
        // bookkeeping write.
        markReceivedMutation.mutate(
          { visionId: vision.id },
          {
            onError: () => {
              firedRef.current = false; // allow another attempt
            },
          },
        );
      },
    });
  }, [
    isAuthenticated,
    pendingQuery.data,
    playSlideshow,
    markReceivedMutation,
  ]);

  return null;
}

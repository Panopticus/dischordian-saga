/* ═══════════════════════════════════════════════════════
   DREAMER VISION PLAYER

   Drains the prophecy queue at session start. Two pipelines
   share this surface:

     1. Legacy awareness-threshold cutscenes (Visions 1-4 in
        apps/shared/dreamerVisions.ts) — fired at thresholds
        {3, 7, 13, 23} when the dreamer_awareness counter
        crosses one. These remain the simplest dream surface
        and don't carry bookend prophecy.

     2. Prophecy marquee dreams (apps/shared/prophecyVisionMap.ts)
        — fired by narrative-flag transitions, queued server-
        side, and drained ≤ 1 per session. These render in
        dream mode with Daniel Cross bookend prophecies and
        the awaken affordance.

   On any given session-start, the prophecy queue is checked
   first; if a marquee is pending and eligible, it plays.
   Otherwise, the legacy awareness-threshold path fires.

   Contracts:
     - Fires AT MOST ONCE per page load. Server-side
       lastMarqueePlayedAt enforces ≤ 1 marquee per session
       window.
     - Does NOT block the title screen — plays as an overlay
       via SlideshowPlayerRoot.
     - First Visitation gating: while
       `daniel_cross_first_contact` is unset, the queue
       promotes the First Visitation ahead of any other
       pending marquee.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useGame } from "@/contexts/GameContext";
import { useWitnessingStore } from "@/stores/witnessingStore";
import { trpc } from "@/lib/trpc";
import { getSlideshow } from "@shared/songSlideshows";
import { DREAMER_VISIONS } from "@shared/dreamerVisions";

function resolveSlideshowDef(slideshowId: string) {
  const direct = getSlideshow(slideshowId);
  if (direct) return direct;
  for (const dv of DREAMER_VISIONS) {
    if (dv.slideshow.id === slideshowId) return dv.slideshow;
  }
  return undefined;
}

/** Best-effort current-act derivation from the narrativeFlags
 *  bag. The codebase doesn't carry an explicit act counter — acts
 *  are gated through `actN_started` / `actN_complete` flags, so
 *  we just walk down from the highest flag we see. */
function deriveCurrentAct(
  flags: Readonly<Record<string, boolean>> | undefined,
): number {
  if (!flags) return 1;
  for (let n = 7; n >= 1; n--) {
    if (flags[`act${n}_started`] || flags[`act${n}_complete`]) {
      return n;
    }
  }
  return 1;
}

export default function DreamerVisionPlayer(): null {
  const { isAuthenticated } = useAuth();
  const playSlideshow = useWitnessingStore((s) => s.playSlideshow);
  const game = useGame();
  const firedRef = useRef(false);

  // Best-effort current act + first-contact flag, threaded into
  // every prophecy-side query and mutation. Act is derived from
  // narrativeFlags — there's no dedicated counter, so we read the
  // highest "actN_started" / "actN_complete" flag the player has.
  const eligibility = useMemo(
    () => ({
      currentAct: deriveCurrentAct(game.state.narrativeFlags),
      firstContactReceived: Boolean(
        game.state.narrativeFlags?.daniel_cross_first_contact,
      ),
    }),
    [game.state.narrativeFlags],
  );

  // Prophecy queue first.
  const prophecyQuery = trpc.dreamerVisions.getNextPendingProphecy.useQuery(
    eligibility,
    {
      enabled: isAuthenticated && !firedRef.current,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: Infinity,
    },
  );

  // Legacy awareness-threshold cutscene as fallback when no
  // marquee is pending.
  const awarenessQuery = trpc.dreamerVisions.getNextPendingVision.useQuery(
    undefined,
    {
      enabled:
        isAuthenticated &&
        !firedRef.current &&
        prophecyQuery.data?.vision === null,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: Infinity,
    },
  );

  const markProphecyMutation =
    trpc.dreamerVisions.markProphecyReceived.useMutation();
  const markAwarenessMutation =
    trpc.dreamerVisions.markVisionReceived.useMutation();
  const queueProphecyMutation =
    trpc.dreamerVisions.queueProphecyVision.useMutation();

  // Install the global reactor that GameContext.setNarrativeFlag
  // calls on every false→true transition. Living in this component
  // keeps the prophecy machinery isolated to the dream-surface tree
  // — GameContext stays free of tRPC imports.
  useEffect(() => {
    if (!isAuthenticated) return;
    const reactor = (flagId: string) => {
      queueProphecyMutation.mutate({
        flagId,
        currentAct: eligibility.currentAct,
        firstContactReceived: eligibility.firstContactReceived,
      });
    };
    (window as unknown as { __prophecyReactor?: (flagId: string) => void }).__prophecyReactor =
      reactor;
    return () => {
      const w = window as unknown as {
        __prophecyReactor?: (flagId: string) => void;
      };
      if (w.__prophecyReactor === reactor) {
        delete w.__prophecyReactor;
      }
    };
  }, [
    isAuthenticated,
    queueProphecyMutation,
    eligibility.currentAct,
    eligibility.firstContactReceived,
  ]);

  useEffect(() => {
    if (firedRef.current) return;
    if (!isAuthenticated) return;

    // Prophecy marquee path takes priority.
    const prophecyVision = prophecyQuery.data?.vision;
    if (prophecyVision) {
      const def = resolveSlideshowDef(prophecyVision.slideshowId);
      if (!def) return;
      const opening = prophecyVision.opening;
      const closing = prophecyVision.closing;
      if (!opening || !closing) return;
      firedRef.current = true;
      playSlideshow(def, {
        dream: {
          visionId: prophecyVision.id,
          bookend: { opening, closing },
          unawakenable: prophecyVision.unawakenable,
          onDreamEnd: ({ kind }: { kind: "full" | "awoken_early" }) => {
            markProphecyMutation.mutate({
              visionId: prophecyVision.id,
              watched: kind,
              currentAct: eligibility.currentAct,
            });
          },
        },
      });
      return;
    }

    // Legacy awareness-threshold path.
    const vision = awarenessQuery.data?.vision;
    if (!vision) return;
    firedRef.current = true;
    playSlideshow(vision.slideshow, {
      onComplete: () => {
        markAwarenessMutation.mutate(
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
    prophecyQuery.data,
    awarenessQuery.data,
    playSlideshow,
    markProphecyMutation,
    markAwarenessMutation,
    eligibility.currentAct,
  ]);

  return null;
}

/* ═══════════════════════════════════════════════════════
   RESURRECTION CINEMATIC ROUTER

   Mounted at App root next to ConfessionCloseRouter and
   ChapterIntroRouter. Watches narrative flags for a pending
   resurrection cinematic — when the server-side resurrection
   flow stamps `pending_resurrection_cinematic_<npcKey>`, this
   router resolves the cinematic id via
   `RESURRECTION_CINEMATIC_BY_NPC` and plays the MP4 once.

   On completion, stamps `resurrection_cinematic_<npcKey>_seen`
   so re-deaths / re-resurrections don't replay the cinematic
   (the death-and-rebirth video is the first-reanimation beat;
   subsequent revives use the standard Path A / Path B flows
   without the cinematic).

   Idempotency: the pending flag is the trigger; the seen flag
   gates replay. The pure resolver
   (`resolvePendingResurrection`) is exported separately for
   unit testing.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useMemo, type ReactElement } from "react";
import { useGame } from "@/contexts/GameContext";
import {
  RESURRECTABLE_NPC_KEYS,
  RESURRECTION_CINEMATIC_BY_NPC,
  pendingResurrectionCinematicFlag,
  resurrectionCinematicSeenFlag,
  type ResurrectableNpcKey,
} from "@shared/resurrectionProtocols";
import {
  CINEMATICS,
  type CinematicId,
} from "@shared/expansionArt/cinematicsManifest";
import { SingleVideoCutsceneOverlay } from "@/components/cutscenes/SingleVideoCutsceneOverlay";

export interface PendingResurrectionCinematic {
  npcKey: ResurrectableNpcKey;
  cinematicId: CinematicId;
}

/** Pure resolver: given a narrative-flag map, return the
 *  pending NPC + cinematic id, or null if no resurrection is
 *  pending or it's already been seen. Iteration matches
 *  RESURRECTABLE_NPC_KEYS order. */
export function resolvePendingResurrection(
  flags: Readonly<Record<string, unknown>>,
): PendingResurrectionCinematic | null {
  for (const npcKey of RESURRECTABLE_NPC_KEYS) {
    const cinematicId = RESURRECTION_CINEMATIC_BY_NPC[npcKey];
    if (!cinematicId) continue;
    if (flags[pendingResurrectionCinematicFlag(npcKey)] !== true) continue;
    if (flags[resurrectionCinematicSeenFlag(npcKey)] === true) continue;
    return { npcKey, cinematicId: cinematicId as CinematicId };
  }
  return null;
}

/** Pretty label for the SingleVideoCutsceneOverlay banner. */
function labelsForNpc(npcKey: ResurrectableNpcKey): {
  primary: string;
  secondary: string;
} {
  switch (npcKey) {
    case "wraith_calder":
      return { primary: "Resurrection", secondary: "Syndicate of Death" };
    case "akai_shi":
      return { primary: "Resurrection", secondary: "The Necromancer's Lair" };
    case "vex_solene":
    case "locke":
    case "jericho_jones":
      // No cinematic registered yet — resolver short-circuits
      // before we get here, but keep the type-exhaustive switch.
      return { primary: "Resurrection", secondary: npcKey };
  }
}

export function ResurrectionCinematicRouter(): ReactElement | null {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};

  const pending = useMemo<PendingResurrectionCinematic | null>(
    () => resolvePendingResurrection(flags),
    [flags],
  );

  const handleComplete = useCallback(() => {
    if (!pending) return;
    setNarrativeFlag(resurrectionCinematicSeenFlag(pending.npcKey), true);
    // Clear the pending flag so the router unmounts on the next
    // render. setNarrativeFlag(flag, false) — the GameContext
    // accepts undefined as "false" too.
    setNarrativeFlag(pendingResurrectionCinematicFlag(pending.npcKey), false);
  }, [pending, setNarrativeFlag]);

  if (!pending) return null;

  const def = CINEMATICS.find((c) => c.id === pending.cinematicId);
  if (!def) {
    // Defensive: registry parity is enforced by the ship-check,
    // but if a bad cinematic id slips in we degrade silently
    // (stamp the seen flag and let the player progress).
    console.warn(
      `[resurrection] cinematic id ${pending.cinematicId} not found in CINEMATICS; ` +
        `stamping seen-flag and skipping playback for ${pending.npcKey}.`,
    );
    handleComplete();
    return null;
  }

  const { primary, secondary } = labelsForNpc(pending.npcKey);

  return (
    <SingleVideoCutsceneOverlay
      cutsceneId={`resurrection_cinematic_${pending.npcKey}`}
      videoRelPath={def.videoRelPath}
      primaryLabel={primary}
      secondaryLabel={secondary}
      onComplete={handleComplete}
    />
  );
}

export default ResurrectionCinematicRouter;

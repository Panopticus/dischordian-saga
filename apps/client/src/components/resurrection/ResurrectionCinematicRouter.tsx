/* ═══════════════════════════════════════════════════════
   RESURRECTION CINEMATIC ROUTER

   Mounted at App root next to ConfessionCloseRouter and
   ChapterIntroRouter. Watches narrative flags for a pending
   death-and-rebirth cinematic and plays the matching MP4
   exactly once.

   Two fire paths:

   1. Resurrection Protocols (Wraith Calder, Akai Shi) —
      server-side flow stamps
      `pending_resurrection_cinematic_<npcKey>` when the
      Path-A quest completes (or Path-B Necromancer-event
      auto-return fires). Cinematic resolves via
      RESURRECTION_CINEMATIC_BY_NPC.

   2. Wolf Crucible release (Lycos) — the canonical
      Mystery-Engine handoff flag
      `mystery_episode_complete:arc.dlc.wolf_anara_hunt:
      wolf.anara_hunt.e5` is written by mysteryService when
      the player commits the Wolf E5 choice (the threshold
      where the investigation closes and the Hunt-the-Hero
      minigame opens — i.e. the player releases Lycos from
      Anara/the Crucible). Cinematic id is
      WOLF_CRUCIBLE_RESCUE_CINEMATIC.

   Idempotency: each pending trigger has a paired seen-flag;
   the router stamps the seen-flag on completion so the
   cinematic never replays. The pure resolver
   (`resolvePendingCinematic`) is exported separately for
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
  WOLF_CRUCIBLE_RESCUE_CINEMATIC,
  WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG,
  WOLF_CRUCIBLE_RESCUE_CINEMATIC_SEEN_FLAG,
} from "@shared/dlcMysteries/wolfAnaraHunt";
import { HUNT_THE_HERO_AVAILABLE_FLAG } from "@shared/tcg-core/matches/huntTheHero";
import {
  CINEMATICS,
  type CinematicId,
} from "@shared/expansionArt/cinematicsManifest";
import { SingleVideoCutsceneOverlay } from "@/components/cutscenes/SingleVideoCutsceneOverlay";

export interface PendingCinematic {
  /** Stable id used as the SingleVideoCutsceneOverlay's
   *  cutsceneId for data-* attrs and missing-asset warnings. */
  triggerId: string;
  /** Cinematic registry id (resolves against CINEMATICS). */
  cinematicId: CinematicId;
  /** Banner label shown over the playing video. */
  primaryLabel: string;
  /** Sub-label under primary. */
  secondaryLabel: string;
  /** Flags to flip when the cinematic completes. `pending`
   *  may be null when the trigger flag is permanent (e.g. an
   *  episode-completion flag that should NOT be cleared);
   *  the seen-flag alone gates replay in that case.
   *  `extraOnTrue` is an optional list of flag ids to set
   *  true on completion — used by the Wolf branch to open
   *  the Hunt-the-Hero CTA gate immediately after the
   *  cinematic ends. */
  flagsOnComplete: {
    pending: string | null;
    seen: string;
    extraOnTrue?: ReadonlyArray<string>;
  };
}

/** Pure resolver: walk all registered triggers, return the
 *  first one whose pending flag is set and seen flag is not.
 *  Iteration order: resurrection-protocol NPCs (in
 *  RESURRECTABLE_NPC_KEYS order), then the Wolf release. */
export function resolvePendingCinematic(
  flags: Readonly<Record<string, unknown>>,
): PendingCinematic | null {
  for (const npcKey of RESURRECTABLE_NPC_KEYS) {
    const cinematicId = RESURRECTION_CINEMATIC_BY_NPC[npcKey];
    if (!cinematicId) continue;
    const pendingFlag = pendingResurrectionCinematicFlag(npcKey);
    const seenFlag = resurrectionCinematicSeenFlag(npcKey);
    if (flags[pendingFlag] !== true) continue;
    if (flags[seenFlag] === true) continue;
    return {
      triggerId: `resurrection_cinematic_${npcKey}`,
      cinematicId: cinematicId as CinematicId,
      ...labelsForNpc(npcKey),
      flagsOnComplete: { pending: pendingFlag, seen: seenFlag },
    };
  }

  // Wolf release: trigger is the canonical mystery-episode
  // completion flag, NOT cleared on cinematic-complete (it's
  // a permanent record that the player committed E5). Only
  // the seen-flag gates replay.
  if (
    flags[WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG] === true &&
    flags[WOLF_CRUCIBLE_RESCUE_CINEMATIC_SEEN_FLAG] !== true
  ) {
    return {
      triggerId: "resurrection_cinematic_wolf",
      cinematicId: WOLF_CRUCIBLE_RESCUE_CINEMATIC as CinematicId,
      primaryLabel: "Release",
      secondaryLabel: "Planet of the Wolf",
      flagsOnComplete: {
        pending: null,
        seen: WOLF_CRUCIBLE_RESCUE_CINEMATIC_SEEN_FLAG,
        // Open the Hunt-the-Hero CTA the moment the
        // release cinematic ends. The minigame's router
        // closes the gate on outcome.
        extraOnTrue: [HUNT_THE_HERO_AVAILABLE_FLAG],
      },
    };
  }

  return null;
}

function labelsForNpc(npcKey: ResurrectableNpcKey): {
  primaryLabel: string;
  secondaryLabel: string;
} {
  switch (npcKey) {
    case "wraith_calder":
      return { primaryLabel: "Resurrection", secondaryLabel: "Syndicate of Death" };
    case "akai_shi":
      return { primaryLabel: "Resurrection", secondaryLabel: "The Necromancer's Lair" };
    case "vex_solene":
    case "locke":
    case "jericho_jones":
      // No cinematic registered yet — resolver short-circuits
      // before reaching here, but keep the switch exhaustive.
      return { primaryLabel: "Resurrection", secondaryLabel: npcKey };
  }
}

export function ResurrectionCinematicRouter(): ReactElement | null {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};

  const pending = useMemo<PendingCinematic | null>(
    () => resolvePendingCinematic(flags),
    [flags],
  );

  const handleComplete = useCallback(() => {
    if (!pending) return;
    setNarrativeFlag(pending.flagsOnComplete.seen, true);
    if (pending.flagsOnComplete.pending) {
      setNarrativeFlag(pending.flagsOnComplete.pending, false);
    }
    for (const flag of pending.flagsOnComplete.extraOnTrue ?? []) {
      setNarrativeFlag(flag, true);
    }
  }, [pending, setNarrativeFlag]);

  if (!pending) return null;

  const def = CINEMATICS.find((c) => c.id === pending.cinematicId);
  if (!def) {
    console.warn(
      `[resurrection] cinematic id ${pending.cinematicId} not found in CINEMATICS; ` +
        `stamping seen-flag and skipping playback for ${pending.triggerId}.`,
    );
    handleComplete();
    return null;
  }

  return (
    <SingleVideoCutsceneOverlay
      cutsceneId={pending.triggerId}
      videoRelPath={def.videoRelPath}
      primaryLabel={pending.primaryLabel}
      secondaryLabel={pending.secondaryLabel}
      frameLine={def.frameLine}
      onComplete={handleComplete}
    />
  );
}

export default ResurrectionCinematicRouter;

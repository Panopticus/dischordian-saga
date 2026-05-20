/**
 * Resurrection cinematic coverage parity check.
 *
 * The producer 2026-05-20 drop delivered death-and-rebirth
 * cinematics for the three resurrected Potentials (Wraith
 * Calder, Akai Shi, The Wolf), per the canon in
 * apps/shared/dlcMysteries/resurrectionistCycleWalker.ts:46-48.
 *
 * Two of the three (Wraith, Akai) are members of the canonical
 * RESURRECTABLE_NPC_KEYS tuple and fire via the
 * RESURRECTION_CINEMATIC_BY_NPC binding. This check enforces
 * hard parity: every cinematic id in that binding must resolve
 * to a real CinematicDef.
 *
 * The Wolf's reanimation is canonically pre-game (Year 128,652
 * A.A.) and uses a separate trigger
 * (WOLF_CRUCIBLE_RESCUE_CINEMATIC in
 * apps/shared/dlcMysteries/wolfAnaraHunt.ts). It's verified in
 * its own assertion below so the whole trio stays covered.
 */
import { CINEMATICS } from "../../expansionArt/cinematicsManifest";
import { RESURRECTION_CINEMATIC_BY_NPC } from "../../resurrectionProtocols";
import {
  WOLF_CRUCIBLE_RESCUE_CINEMATIC,
  WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG,
} from "../../dlcMysteries/wolfAnaraHunt";
import { WOLF_ANARA_HUNT_MYSTERY } from "../../dlcMysteries/wolfAnaraHunt";
import type { RawParityCount } from "../types";

export function checkResurrectionCinematicCoverage(): RawParityCount {
  const cinematicIds = new Set(CINEMATICS.map((c) => c.id));
  const missing: string[] = [];

  let declared = 0;
  let implemented = 0;

  // Path A / Path B bindings for the resurrectable NPCs.
  for (const [npcKey, cinematicId] of Object.entries(
    RESURRECTION_CINEMATIC_BY_NPC,
  )) {
    declared += 1;
    if (!cinematicId) {
      missing.push(
        `${npcKey}: RESURRECTION_CINEMATIC_BY_NPC entry is empty`,
      );
      continue;
    }
    if (!cinematicIds.has(cinematicId as (typeof CINEMATICS)[number]["id"])) {
      missing.push(
        `${npcKey}: cinematic id '${cinematicId}' is not registered in CINEMATICS`,
      );
      continue;
    }
    implemented += 1;
  }

  // The Wolf's Crucible-release cinematic — separate trigger
  // (mystery-engine episode-completion flag), same parity
  // contract on the cinematic-id side.
  declared += 1;
  if (
    !cinematicIds.has(
      WOLF_CRUCIBLE_RESCUE_CINEMATIC as (typeof CINEMATICS)[number]["id"],
    )
  ) {
    missing.push(
      `the_wolf: WOLF_CRUCIBLE_RESCUE_CINEMATIC '${WOLF_CRUCIBLE_RESCUE_CINEMATIC}' is not registered in CINEMATICS`,
    );
  } else {
    implemented += 1;
  }

  // The Wolf trigger flag must reference the actual final
  // episode of the Wolf Anara Hunt arc — guards against drift
  // where the arc is renamed or its episode list reordered
  // but the trigger-flag constant lags behind.
  declared += 1;
  const finalEpisode =
    WOLF_ANARA_HUNT_MYSTERY.episodes[
      WOLF_ANARA_HUNT_MYSTERY.episodes.length - 1
    ];
  const expectedTriggerFlag =
    `mystery_episode_complete:${WOLF_ANARA_HUNT_MYSTERY.arcId}:${finalEpisode.id}`;
  if (WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG !== expectedTriggerFlag) {
    missing.push(
      `the_wolf: WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG ` +
        `('${WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG}') does not match ` +
        `the arc's final-episode completion flag ('${expectedTriggerFlag}')`,
    );
  } else {
    implemented += 1;
  }

  return { declared, implemented, missing };
}

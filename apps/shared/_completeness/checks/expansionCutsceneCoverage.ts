/**
 * Expansion-cutscene coverage parity check.
 *
 * Declared surface: every entry in
 * `apps/shared/expansionArt/cinematicsManifest.ts` EXPANSION_CUTSCENES.
 *
 * Implemented surface: every cutscene that has at least one runtime
 * trigger in `apps/shared/roomCutscenes/roomCutsceneTriggers.ts`
 * ROOM_CUTSCENE_TRIGGERS.
 *
 * Hard parity: a producer-delivered cutscene without a runtime trigger
 * is unreachable in-game. If a new producer pass lands cutscenes the
 * trigger registry doesn't cover, this gate fails until each new
 * cutscene gets an explicit trigger entry.
 */
import type { RawParityCount } from "../types";

export async function checkExpansionCutsceneCoverage(): Promise<RawParityCount> {
  const cinematicsMod = await import("../../expansionArt/cinematicsManifest");
  const triggersMod = await import(
    "../../roomCutscenes/roomCutsceneTriggers"
  );

  const { EXPANSION_CUTSCENES } = cinematicsMod;
  const { TRIGGERS_BY_CUTSCENE } = triggersMod;

  const declared = EXPANSION_CUTSCENES.length;
  const missing: string[] = [];
  let implemented = 0;
  for (const c of EXPANSION_CUTSCENES) {
    if (TRIGGERS_BY_CUTSCENE.has(c.id)) {
      implemented += 1;
    } else {
      missing.push(`untriggered: ${c.category}/${c.id}`);
    }
  }

  return { declared, implemented, missing };
}

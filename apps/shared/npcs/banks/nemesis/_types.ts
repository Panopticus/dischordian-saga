/* ═══════════════════════════════════════════════════════
   NEMESIS PAIR-BANK TYPES — Phase K5

   Each (player-archetype, nemesis-archetype) pair gets
   one bank file under apps/shared/npcs/banks/nemesis/
   named `{playerArchetype}_vs_{nemesisArchetype}.ts`.

   The bank exports `NemesisPairBank` with 8 canonical
   encounter scenes × 3 grudge bands per scene. Each
   variant is a DialogTree the runtime renders when the
   encounter scene fires for this pairing.

   Authoring discipline (per Picard-vs-Q canon, dreamer):
     - Mutual recognition varies by pairing — a Ghost-
       player vs. Witch-Nemesis is cryptic on both sides;
       a Heretic-player vs. Sentinel-Nemesis is open
       doctrinal warfare.
     - Respect varies by pairing — high-compatibility
       pairs (recruitAffinityVector ≥ 8) write Q's
       "I admire you, captain" register at high grudge.
     - Mockery is rare — only Jester-Nemesis lands it
       cleanly; for others it reads as desperation.

   The selector in apps/shared/npcs/selector.ts will
   eventually consume these via a "nemesis_encounter"
   DialogSurface; until then, the pair-bank export is
   read directly by the encounter-render path (TBD).
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "../../../apprentices";
import type { DialogTree } from "../../../dialogTree";

/** The 8 canonical encounter scenes. */
export type NemesisEncounterSceneId =
  | "first_sighting"
  | "sabotage_caught_in_act"
  | "mocking_interlude"
  | "lieutenant_promotion"
  | "cohort_end_confrontation"
  | "accumulation_reveal"
  | "name_reveal_moment"
  | "final_encounter";

/** Grudge-band variants per scene. */
export type NemesisGrudgeBand = "low" | "mid" | "high";

export interface NemesisScene {
  /** Three grudge-band-keyed variants per scene. */
  variants: Record<NemesisGrudgeBand, DialogTree>;
}

export interface NemesisPairBank {
  /** Stable id: `${playerArchetype}_vs_${nemesisArchetype}`. */
  pairId: string;
  playerArchetype: ApprenticeArchetype;
  nemesisArchetype: ApprenticeArchetype;
  scenes: Partial<Record<NemesisEncounterSceneId, NemesisScene>>;
}

/** Helper: standard grudge-band → DialogTree shape. */
export function makeScene(args: {
  low: DialogTree;
  mid: DialogTree;
  high: DialogTree;
}): NemesisScene {
  return {
    variants: {
      low: args.low,
      mid: args.mid,
      high: args.high,
    },
  };
}

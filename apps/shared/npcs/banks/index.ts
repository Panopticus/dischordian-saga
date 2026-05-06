// apps/shared/npcs/banks/index.ts
//
// Bank registry — Phase 1 exit-criteria proof.
// Aggregates per-character NpcBank arrays into a single lookup.
//
// Phase 3 will add Locke / Vex / Degen / Nilmorg / Hierophant / Companion /
// Eidolon banks. Currently only the 4 deferred-priority characters
// (Game Master / Meme / Seer / Oracle) have stub banks for selector
// validation.

import type { NpcKey, NpcLine, DialogSurface } from "../types";
import { ADJUDICATOR_LOCKE_BANK } from "./adjudicator_locke";
import { NILMORG_BANK } from "./nilmorg";
import { YOUR_EIDOLON_BANK } from "./your_eidolon";
import { VEX_SOLENE_BANK } from "./vex_solene";
import { THE_DEGEN_BANK } from "./the_degen";
import { THE_SEER_BANK } from "./the_seer";
import { THE_ORACLE_BANK } from "./the_oracle";
import { THE_MEME_BANK } from "./the_meme";
import { THE_GAME_MASTER_BANK } from "./the_game_master";
import { WRAITH_CALDER_BANK } from "./wraith_calder";
import { DMC_CLONE_COMPANION_BANK } from "./dmc_clone_companion";
import { THE_ANTIQUARIAN_BANK } from "./the_antiquarian";
import { DRAEL_MON_BANK } from "./drael_mon";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

/**
 * All currently-shipped NPC banks, concatenated. Selector consumes this
 * directly via apps/shared/npcs/selector.ts:selectNpcLine().
 */
export const ALL_NPC_LINES: ReadonlyArray<BankEntry> = [
  ...ADJUDICATOR_LOCKE_BANK,
  ...NILMORG_BANK,
  ...YOUR_EIDOLON_BANK,
  ...VEX_SOLENE_BANK,
  ...THE_DEGEN_BANK,
  ...THE_SEER_BANK,
  ...THE_ORACLE_BANK,
  ...THE_MEME_BANK,
  ...THE_GAME_MASTER_BANK,
  ...WRAITH_CALDER_BANK,
  ...DMC_CLONE_COMPANION_BANK,
  ...THE_ANTIQUARIAN_BANK,
  ...DRAEL_MON_BANK,
];

/**
 * Per-NPC bank lookup. Returns the lines for a single character, or an
 * empty array if no bank is shipped yet (silent-fail contract).
 */
export function getBank(npcKey: NpcKey): ReadonlyArray<BankEntry> {
  return ALL_NPC_LINES.filter(line => line.npcKey === npcKey);
}

/**
 * Re-export per-NPC banks for direct import where the consumer knows
 * which character they want.
 */
export {
  ADJUDICATOR_LOCKE_BANK,
  NILMORG_BANK,
  YOUR_EIDOLON_BANK,
  VEX_SOLENE_BANK,
  THE_DEGEN_BANK,
  THE_SEER_BANK,
  THE_ORACLE_BANK,
  THE_MEME_BANK,
  THE_GAME_MASTER_BANK,
  WRAITH_CALDER_BANK,
  DMC_CLONE_COMPANION_BANK,
  THE_ANTIQUARIAN_BANK,
  DRAEL_MON_BANK,
};

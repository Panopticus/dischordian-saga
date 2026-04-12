/* ═══════════════════════════════════════════════════════
   RACE QUESTLINE — DeMagi
   "THE GARDEN'S CHILDREN"

   Spec §2.1 — 4 chapters.

   Ch1  First Contact from the Assembly     (Act 2)
   Ch2  The Assembly's Offer                (Act 2)
   Ch3  The Pure Flame's Invitation         (Act 2)
   Ch4  The Choice — Three-Way Mediation    (Act 2)
   ═══════════════════════════════════════════════════════ */

import type { PotentialQuestline } from "./potentialQuestlineTypes";
import { DEMAGI_CH1, DEMAGI_CH1_FLAGS } from "./questlineDemagiCh1";
import { DEMAGI_CH2, DEMAGI_CH2_FLAGS } from "./questlineDemagiCh2";
import { DEMAGI_CH3, DEMAGI_CH3_FLAGS } from "./questlineDemagiCh3";
import { DEMAGI_CH4, DEMAGI_CH4_FLAGS } from "./questlineDemagiCh4";

export const DEMAGI_QUESTLINE_FLAGS = [
  ...DEMAGI_CH1_FLAGS,
  ...DEMAGI_CH2_FLAGS,
  ...DEMAGI_CH3_FLAGS,
  ...DEMAGI_CH4_FLAGS,
] as const;

export const DEMAGI_QUESTLINE: PotentialQuestline = {
  id: "demagi_gardens_children",
  title: "The Garden's Children",
  premise:
    "The Elemental Assembly contacts you. The Pure Flame warns you. Both are DeMagi. Both are right about different things. The mediation that follows will shape DeMagi-Quarchon relations for a generation.",
  actGate: 2,
  chapters: [DEMAGI_CH1, DEMAGI_CH2, DEMAGI_CH3, DEMAGI_CH4],
  flags: DEMAGI_QUESTLINE_FLAGS,
};

export { DEMAGI_CH1, DEMAGI_CH2, DEMAGI_CH3, DEMAGI_CH4 };

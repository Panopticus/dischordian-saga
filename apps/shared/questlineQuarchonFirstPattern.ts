/* ═══════════════════════════════════════════════════════
   RACE QUESTLINE — Quarchon
   "FIRST PATTERN, LAST VARIABLE"

   Spec §2.2 — 3 chapters.

   Ch1  Zephyr-9's Message               (Act 1)
   Ch2  The Probability Accord's Offer    (Act 2)
   Ch3  The First Pattern's Warning       (Act 2)
   ═══════════════════════════════════════════════════════ */

import type { PotentialQuestline } from "./potentialQuestlineTypes";
import { QUARCHON_CH1, QUARCHON_CH1_FLAGS } from "./questlineQuarchonCh1";
import { QUARCHON_CH2, QUARCHON_CH2_FLAGS } from "./questlineQuarchonCh2";
import { QUARCHON_CH3, QUARCHON_CH3_FLAGS } from "./questlineQuarchonCh3";

export const QUARCHON_QUESTLINE_FLAGS = [
  ...QUARCHON_CH1_FLAGS,
  ...QUARCHON_CH2_FLAGS,
  ...QUARCHON_CH3_FLAGS,
] as const;

export const QUARCHON_QUESTLINE: PotentialQuestline = {
  id: "quarchon_first_pattern",
  title: "First Pattern, Last Variable",
  premise:
    "The Quarchon side of the Potential Identity System. Zephyr-9 reveals her twelve-year secret. The Probability Accord makes an offer. The Architect's Echo asks a question it doesn't know the answer to.",
  actGate: 1,
  chapters: [QUARCHON_CH1, QUARCHON_CH2, QUARCHON_CH3],
  flags: QUARCHON_QUESTLINE_FLAGS,
};

export { QUARCHON_CH1, QUARCHON_CH2, QUARCHON_CH3 };

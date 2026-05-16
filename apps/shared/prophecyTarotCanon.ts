/* ═══════════════════════════════════════════════════════
   PROPHECY · SEAL · SEER · ORACLE-TAROT UNIFICATION — PR-19

   Four registries describe the saga's prophetic spine and,
   before this PR, none of them knew about the others:

     - sevenSeals.ts          Acts 1-7 ↔ Seals I-VII (the
                              Revelation frame: horsemen, the
                              souls under the altar, the silence)
     - danielCrossProphecies  the prophecy text bank, themed +
                              keyed by Seer register (the
                              Antiquarian, "the Book of Daniel
                              was named for me", is the author)
     - prophecyVisionMap.ts   the marquee dream-visions, each
                              bound to a player act and (for 23
                              of them) an Oracle Deck card slug
     - identityCollisionCanon the antiquarian_manifold
                              (Dr. Daniel Cross = the Programmer
                              = the Antiquarian — the prophet)

   This module is the single cross-binding surface. Per Act it
   ties the Seal → the prophecy bookend → the Oracle-Tarot
   cards that fall under it → the Seer register that delivers
   it → the Revelation/Daniel citation it mirrors → the
   Antiquarian manifold that authored it.

   THE TAROT IS NOT NEW. Per the project owner's decision, the
   EXISTING 23-card Oracle Deck (route /oracle,
   apps/server/routers/oracleDeck.ts) IS the Dischordian Tarot
   archive. No new cards, no new art — this PR is branding +
   cross-citation only. `oracleCardSlugsForAct` derives the
   per-act card set from the already-test-validated
   PROPHECY_VISIONS registry, so the 23-card binding stays
   sourced, never duplicated.

   The parity gate
   (apps/shared/_completeness/checks/prophecyTarotCoverage.ts)
   is HARD: every one of the 7 act bindings must resolve its
   Seal, its prophecy bookend (getProphecyById), at least one
   Oracle-Tarot slug, and the antiquarian manifold. Achievable
   on landing because every referenced registry is already
   validated elsewhere.
   ═══════════════════════════════════════════════════════ */

import type { SealNumber } from "./sevenSeals";
import type { SeerRegister } from "./danielCrossProphecies";
import { PROPHECY_VISIONS } from "./prophecyVisionMap";

export const TAROT_BRAND = {
  name: "The Dischordian Tarot archive",
  deckRoute: "/oracle",
  deckRouter: "apps/server/routers/oracleDeck.ts",
  cardCount: 23,
  thesis:
    "The Oracle Deck IS the Dischordian Tarot — imprints of stories on the Matrix of Dreams, read by the Seer, authored by the Antiquarian (Daniel Cross). No new cards; the archive was always here.",
} as const;

export interface ProphecyTarotActBinding {
  act: SealNumber;
  /** → SEVEN_SEALS entry whose .num === sealNum and .act === act. */
  sealNum: SealNumber;
  /** The Seal-break cinematic IS this prophecy's fulfilment. */
  breaksSeal: true;
  /** → DANIEL_CROSS_PROPHECIES via getProphecyById. */
  prophecyBookend: { openingId: string; closingId: string };
  /** Seer delivery register — cold (1-2) → warm (3-5) →
   *  confidant (6-7), tracking the Seer mystery arc. */
  seerRegister: SeerRegister;
  /** The Revelation / Book-of-Daniel passage the Seal mirrors.
   *  Text citation only — no asset. */
  revelationCitation: string;
  /** Always the Antiquarian — Daniel Cross is the prophet. */
  danielCrossManifold: "antiquarian_manifold";
  loreSource: string;
}

/**
 * The Oracle-Tarot card slugs that fall under a given Act,
 * sourced from the validated PROPHECY_VISIONS registry (never
 * duplicated here — the 23-card binding lives there).
 */
export function oracleCardSlugsForAct(act: number): string[] {
  const out = new Set<string>();
  for (const v of PROPHECY_VISIONS) {
    if (v.playerAct === act && v.oracleCardSlug) out.add(v.oracleCardSlug);
  }
  return [...out];
}

/** Canonical Seer register for an act (the arc's warming curve). */
function registerForAct(act: SealNumber): SeerRegister {
  if (act <= 2) return "cold";
  if (act <= 5) return "warm";
  return "confidant";
}

export const PROPHECY_TAROT_ACTS: readonly ProphecyTarotActBinding[] = [
  {
    act: 1,
    sealNum: 1,
    breaksSeal: true,
    prophecyBookend: { openingId: "dc_prophecy_onset_open", closingId: "dc_prophecy_onset_close" },
    seerRegister: registerForAct(1),
    revelationCitation:
      "Revelation 6:1-2 — the white horse, conquest. Daniel 12:4 — 'shut up the words, and seal the book.'",
    danielCrossManifold: "antiquarian_manifold",
    loreSource: "apps/shared/sevenSeals.ts (Seal I) + prophecyVisionMap.ts (pv_first_visitation)",
  },
  {
    act: 2,
    sealNum: 2,
    breaksSeal: true,
    prophecyBookend: { openingId: "dc_prophecy_001", closingId: "dc_prophecy_005" },
    seerRegister: registerForAct(2),
    revelationCitation:
      "Revelation 6:3-4 — the red horse, war. Daniel 7 — the beasts rise from the sea.",
    danielCrossManifold: "antiquarian_manifold",
    loreSource: "apps/shared/sevenSeals.ts (Seal II) + prophecyVisionMap.ts (pv_album1_to_be_the_human)",
  },
  {
    act: 3,
    sealNum: 3,
    breaksSeal: true,
    prophecyBookend: { openingId: "dc_prophecy_006", closingId: "dc_prophecy_012" },
    seerRegister: registerForAct(3),
    revelationCitation:
      "Revelation 6:5-6 — the black horse, famine, the scales. Daniel 5 — the writing on the wall.",
    danielCrossManifold: "antiquarian_manifold",
    loreSource: "apps/shared/sevenSeals.ts (Seal III) + prophecyVisionMap.ts (pv_album1_hacking_reality)",
  },
  {
    act: 4,
    sealNum: 4,
    breaksSeal: true,
    prophecyBookend: { openingId: "dc_prophecy_003", closingId: "dc_prophecy_007" },
    seerRegister: registerForAct(4),
    revelationCitation:
      "Revelation 6:7-8 — the pale horse, Death, and Hades following. Daniel 9 — the seventy weeks.",
    danielCrossManifold: "antiquarian_manifold",
    loreSource: "apps/shared/sevenSeals.ts (Seal IV) + prophecyVisionMap.ts (pv_album3_lion_in_black)",
  },
  {
    act: 5,
    sealNum: 5,
    breaksSeal: true,
    prophecyBookend: { openingId: "dc_prophecy_009", closingId: "dc_prophecy_010" },
    seerRegister: registerForAct(5),
    revelationCitation:
      "Revelation 6:9-11 — the souls under the altar, crying how long. Daniel 12:1 — the time of trouble.",
    danielCrossManifold: "antiquarian_manifold",
    loreSource: "apps/shared/sevenSeals.ts (Seal V) + prophecyVisionMap.ts (pv_album3_two_witnesses_meet)",
  },
  {
    act: 6,
    sealNum: 6,
    breaksSeal: true,
    prophecyBookend: { openingId: "dc_prophecy_017", closingId: "dc_prophecy_021" },
    seerRegister: registerForAct(6),
    revelationCitation:
      "Revelation 6:12-17 — the sixth seal, the sun black, the moon as blood. Daniel 8 — the vision of the end.",
    danielCrossManifold: "antiquarian_manifold",
    loreSource: "apps/shared/sevenSeals.ts (Seal VI) + prophecyVisionMap.ts (pv_album4_bulb_breaks)",
  },
  {
    act: 7,
    sealNum: 7,
    breaksSeal: true,
    prophecyBookend: { openingId: "dc_prophecy_018", closingId: "dc_prophecy_019" },
    seerRegister: registerForAct(7),
    revelationCitation:
      "Revelation 8:1 — the seventh seal, and silence in heaven about the space of half an hour. Daniel 12:9 — the words are closed up and sealed till the time of the end.",
    danielCrossManifold: "antiquarian_manifold",
    loreSource: "apps/shared/sevenSeals.ts (Seal VII) + prophecyVisionMap.ts (pv_album5_silence_two_witnesses)",
  },
];

/** Look up an act's prophecy-tarot binding. */
export function getProphecyTarotAct(
  act: number,
): ProphecyTarotActBinding | undefined {
  return PROPHECY_TAROT_ACTS.find((b) => b.act === act);
}

/** Coverage snapshot for the parity gate. */
export function getProphecyTarotCoverage(): {
  declared: number;
  acts: number;
} {
  return { declared: PROPHECY_TAROT_ACTS.length, acts: 7 };
}

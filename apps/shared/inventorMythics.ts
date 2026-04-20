/* ═══════════════════════════════════════════════════════
   INVENTOR MYTHICS — one-of-one story artifacts (plan §G.7)

   Every named set ships a Mythic tier: a single,
   story-bound heirloom that the schematic/trade/shop
   paths CANNOT produce. These items exist exactly once in
   the run; losing them means losing them.

   This module is the registry of Mythic acquisition beats.
   Three placeholder beats are authored on this branch per
   the plan's §G.7 carve-out; the full roster is
   co-authored with the Act-by-Act narrative team.

   NOTE: the actual piece ids the Mythic yields reuse the
   catalog's `<setId>:mythic:<slot>` identifier from
   suitSets.ts — the Mythic rarity IS part of the asset
   catalog, only its acquisition path is different.
   ═══════════════════════════════════════════════════════ */

import type { Rarity, SuitSlot } from "./suitSets";

export type MythicBeatStatus = "placeholder" | "authored";

export type MythicTrigger =
  | "boss_defeat"
  | "companion_gift"
  | "act_climax"
  | "hidden_encounter";

export interface MythicBeat {
  /** Stable id — `mythic:<setId>:<slot>`. */
  id: string;
  setId: string;
  slot: SuitSlot;
  /** Mythic pieces always resolve to this rarity; fixed here for clarity. */
  rarity: Extract<Rarity, "mythic">;
  /** Plain-English when/where the player earns this one-of-one. */
  description: string;
  /** Canonical trigger tag — feeds content discovery tooling. */
  trigger: MythicTrigger;
  /**
   * Placeholder vs authored. Placeholder beats ship the slot + the
   * render path; final narrative hook is a follow-up with the Act
   * writers.
   */
  status: MythicBeatStatus;
}

function mythicId(setId: string, slot: SuitSlot): string {
  return `mythic:${setId}:${slot}`;
}

/** Three placeholder beats for this branch. */
export const MYTHIC_BEATS: readonly MythicBeat[] = [
  {
    id: mythicId("regalia-of-the-seeing-stylus", "weapon-primary"),
    setId: "regalia-of-the-seeing-stylus",
    slot: "weapon-primary",
    rarity: "mythic",
    description:
      "Recovered from the first Oracle who wore the Stylus in the Age of Privacy, dropped by the act-climax boss that wears it imperfectly.",
    trigger: "act_climax",
    status: "placeholder",
  },
  {
    id: mythicId("the-mourners-coat", "back"),
    setId: "the-mourners-coat",
    slot: "back",
    rarity: "mythic",
    description:
      "Given — not taken. A late-Act companion who has worn it since before the Fall of Realities bequeaths the coat on their departure from the Ark.",
    trigger: "companion_gift",
    status: "placeholder",
  },
  {
    id: mythicId("clockwork-exoframe", "chest"),
    setId: "clockwork-exoframe",
    slot: "chest",
    rarity: "mythic",
    description:
      "Pulled from a hidden Quarchon war-chest discoverable only by completing a full §B progressive-disclosure chain that ends in the Engineering Deck.",
    trigger: "hidden_encounter",
    status: "placeholder",
  },
];

const BY_ID = new Map<string, MythicBeat>(
  MYTHIC_BEATS.map((m) => [m.id, m] as const),
);

export function getMythicBeat(id: string): MythicBeat | null {
  return BY_ID.get(id) ?? null;
}

export function getMythicBeatsForSet(setId: string): readonly MythicBeat[] {
  return MYTHIC_BEATS.filter((m) => m.setId === setId);
}

/** Every set id with at least one authored-or-placeholder Mythic beat. */
export function setIdsWithMythics(): readonly string[] {
  return Array.from(new Set(MYTHIC_BEATS.map((m) => m.setId)));
}

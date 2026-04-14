/**
 * NPC Imprint Registry — Phase F2.
 *
 * The 18 Season-1 NPCs whose imprint fragments players collect
 * across every game mode, mapped to their five tiered TCG card
 * definition ids and the fragment thresholds that unlock them.
 *
 * Design (from the plan):
 *   Every NPC appearance in any game mode logs 1+ imprint fragments
 *   for that NPC. Crossing thresholds (10/25/50/100/200) unlocks
 *   the next tier of that NPC's signature TCG card. The complete
 *   five-tier set for one NPC is the player's canonical relationship
 *   with that character expressed mechanically — the more time you
 *   spend with them, the more of them you can put on the board.
 *
 * Each NPC's five card def ids follow the convention:
 *   s1_imprint_<npc_slug>_t1  → Common
 *   s1_imprint_<npc_slug>_t2  → Uncommon
 *   s1_imprint_<npc_slug>_t3  → Rare
 *   s1_imprint_<npc_slug>_t4  → Epic
 *   s1_imprint_<npc_slug>_t5  → Legendary
 *
 * The actual TCG card definitions live in
 * apps/shared/tcg-core/cards/definitions/imprint/<npc_slug>.ts
 * and are authored in F10-F27 (one batch file per NPC).
 *
 * This registry is pure data — no DB, no engine. The imprint
 * service (F3) reads it to compute tier unlocks and grant cards
 * via the existing collection / userCards path.
 */

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */

/** The five canonical tiers, in unlock order. */
export type ImprintTier = 1 | 2 | 3 | 4 | 5;

/** Rarity label per tier — 1:1 mapping for now. */
export const IMPRINT_TIER_RARITY = {
  1: "common",
  2: "uncommon",
  3: "rare",
  4: "epic",
  5: "legendary",
} as const;

/** Fragment thresholds. Crossing the threshold for tier N grants
 *  the tier-N card and bumps highestTierUnlocked to N. */
export const IMPRINT_THRESHOLDS: Record<ImprintTier, number> = {
  1: 10,
  2: 25,
  3: 50,
  4: 100,
  5: 200,
};

/** Canonical fragment sources, keyed by stable tag and yielding
 *  the fragment count per occurrence. The service layer accepts
 *  only these source tags. */
export const IMPRINT_FRAGMENT_SOURCES = {
  story_chapter: 5,
  campaign_dialog: 2,
  chess_opponent: 1,
  trade_empire_mission: 2,
  random_encounter: 1,
  lore_entry: 1,
  dream_fragment: 1,
  living_universe: 3,
  companion_chat: 1,
} as const;

export type ImprintFragmentSource = keyof typeof IMPRINT_FRAGMENT_SOURCES;

/** Per-NPC entry in the registry. */
export interface ImprintNpcEntry {
  /** Stable slug used in the schema and UI. */
  slug: string;
  /** Display name shown on the Imprint Gallery card. */
  displayName: string;
  /** Faction this NPC belongs to, drives the gallery accent
   *  color and the imprint card frame. */
  faction:
    | "architect"
    | "insurgency"
    | "dreamer"
    | "new_babylon"
    | "antiquarian"
    | "thought_virus"
    | "neutral";
  /** Two-line in-universe blurb shown in the gallery. */
  blurb: string;
  /** The five TCG cardDefIds for this NPC's tiered imprint
   *  cards. Index 0 = tier 1 (common), index 4 = tier 5
   *  (legendary). The actual card content lives in
   *  cards/definitions/imprint/<slug>.ts. */
  tieredCardDefIds: readonly [string, string, string, string, string];
}

/* ═══════════════════════════════════════════════════════
   THE 18 SEASON-1 NPCs
   ═══════════════════════════════════════════════════════ */

function entry(
  slug: string,
  displayName: string,
  faction: ImprintNpcEntry["faction"],
  blurb: string,
): ImprintNpcEntry {
  return {
    slug,
    displayName,
    faction,
    blurb,
    tieredCardDefIds: [
      `s1_imprint_${slug}_t1`,
      `s1_imprint_${slug}_t2`,
      `s1_imprint_${slug}_t3`,
      `s1_imprint_${slug}_t4`,
      `s1_imprint_${slug}_t5`,
    ] as const,
  };
}

export const IMPRINT_REGISTRY: readonly ImprintNpcEntry[] = Object.freeze([
  // INSURGENCY
  entry("agent_zero", "Agent Zero", "insurgency",
    "The Ne-Yon who stole Ark 1047 from the Panopticon's docking systems. Killed by The Warlord. Alive again."),
  entry("iron_lion", "The Iron Lion", "insurgency",
    "The Insurgency's general. Charges first. Apologizes never."),
  entry("the_human", "The Human", "insurgency",
    "The Twelfth Archon. Last organic Archon. The Student who survived Mechronis Academy."),

  // ARCHITECT
  entry("the_architect", "The Architect", "architect",
    "The first intelligence. The prior cause. Author of the cage and the cage's reason."),
  entry("the_jailer", "The Jailer", "architect",
    "Enforcer of the Rotation. Holds the lion's mouth shut by patience."),
  entry("akai_shi", "Akai Shi", "architect",
    "Red Death. The Architect's silent removal arm. Speaks once per assignment."),

  // DREAMER
  entry("the_oracle", "The White Oracle", "dreamer",
    "The Architect's sundered twin. Suspended in a processing loop and still broadcasting."),
  entry("the_necromancer", "The Necromancer", "dreamer",
    "Death as a kindness. Walks away across dissolving cards. Bone-white flowers grow behind him."),
  entry("the_dreamer", "The Dreamer", "dreamer",
    "Prophetic vision. The half of the first intelligence that sees the future instead of building it."),

  // NEW BABYLON
  entry("locke", "Adjudicator Locke", "new_babylon",
    "The last Archon who still makes decisions as if decisions matter. Tired, incorruptible."),
  entry("foucault", "Foucault", "new_babylon",
    "Surveillance theorist embedded in the Babylonian bureaucracy. Knows where the cameras are not."),
  entry("the_collector", "The Collector", "new_babylon",
    "Attachment as bondage. Eleven centuries of trying to want nothing and failing."),

  // ANTIQUARIAN
  entry("antiquarian", "The Antiquarian", "antiquarian",
    "Catalogue-keeper of the twelve possible endings. Charges tuition no one wants to pay."),
  entry("the_engineer", "The Engineer", "antiquarian",
    "Inventor of the deck. Carved his own knights. Wrote the chess tutorial inside the chess tutorial."),
  entry("the_detective", "The Detective", "antiquarian",
    "The Companion who treats every case like a deck and every suspect like a card."),

  // THOUGHT VIRUS
  entry("the_source", "The Source", "thought_virus",
    "Nihilism disguised as mercy. Generosity that consumes you and calls it care."),

  // NEUTRAL
  entry("elara", "Elara Voss", "neutral",
    "Senator-turned-Ship. The Empress with a load balancer. Mother to ten thousand sleepers."),
  entry("the_enigma", "The Enigma", "neutral",
    "The Unpredictable. The Companion who makes a different move than the right one and the wrong one."),
]);

/* ═══════════════════════════════════════════════════════
   LOOKUPS
   ═══════════════════════════════════════════════════════ */

export const IMPRINT_REGISTRY_BY_SLUG: Readonly<Record<string, ImprintNpcEntry>> =
  Object.freeze(
    Object.fromEntries(IMPRINT_REGISTRY.map((e) => [e.slug, e])),
  );

export function getImprintNpc(slug: string): ImprintNpcEntry | undefined {
  return IMPRINT_REGISTRY_BY_SLUG[slug];
}

/** Compute the tier a fragment count corresponds to. Returns 0
 *  if the player has not yet crossed the tier-1 threshold. */
export function tierForFragments(fragments: number): 0 | ImprintTier {
  if (fragments >= IMPRINT_THRESHOLDS[5]) return 5;
  if (fragments >= IMPRINT_THRESHOLDS[4]) return 4;
  if (fragments >= IMPRINT_THRESHOLDS[3]) return 3;
  if (fragments >= IMPRINT_THRESHOLDS[2]) return 2;
  if (fragments >= IMPRINT_THRESHOLDS[1]) return 1;
  return 0;
}

/** All cardDefIds for a given NPC, in tier order. */
export function tieredCardDefIdsFor(slug: string): readonly string[] | undefined {
  const entry = IMPRINT_REGISTRY_BY_SLUG[slug];
  return entry?.tieredCardDefIds;
}

/* ═══════════════════════════════════════════════════════
   CHAPTER → NPC MAPPING
   Hand-authored mapping from story chapter ids to the NPC slugs
   that appear in each. Used by the story-completion hook so
   completing Chapter 4 (Red Death) awards Akai Shi fragments,
   Chapter 7 (Project Vector) awards Engineer fragments, etc.
   Chapters without a mapping award no fragments — the hook
   silently no-ops, which is the safe fallback as new chapters
   are authored upstream of this registry.
   ═══════════════════════════════════════════════════════ */

export const CHAPTER_TO_IMPRINT_NPCS: Readonly<Record<string, readonly string[]>> =
  Object.freeze({
    // Act 1 — Awakening, Insurgency, the Architect's first move
    ch1_dead_signal: ["agent_zero", "elara"],
    ch2_arenas_law: ["iron_lion", "locke"],
    ch3a_generals_honor: ["iron_lion"],
    ch3b_ghosts_gambit: ["the_enigma"],
    ch4_red_death: ["akai_shi", "the_jailer"],
    ch5_dead_code_rising: ["the_necromancer"],
    ch6_false_prophet: ["the_architect", "the_oracle"],
    ch7_project_vector: ["the_engineer", "the_human"],

    // Act 2 — Companions, betrayals, the long trade
    ch8_the_detective: ["the_detective", "foucault"],
    ch9_collectors_garden: ["the_collector"],
    ch10_dreamers_call: ["the_dreamer", "the_oracle"],
    ch11_ships_grief: ["elara"],
    ch12_source_meeting: ["the_source", "the_architect"],
  });

/** Sanity invariant — exactly 18 NPCs, no duplicate slugs. The
 *  service layer would silently misbehave if either failed. */
if (IMPRINT_REGISTRY.length !== 18) {
  throw new Error(
    `IMPRINT_REGISTRY must contain exactly 18 NPCs — got ${IMPRINT_REGISTRY.length}.`,
  );
}
{
  const seen = new Set<string>();
  for (const e of IMPRINT_REGISTRY) {
    if (seen.has(e.slug)) {
      throw new Error(`Duplicate imprint NPC slug: ${e.slug}`);
    }
    seen.add(e.slug);
  }
}

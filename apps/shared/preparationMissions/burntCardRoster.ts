/* ═══════════════════════════════════════════════════════
   BURNT CARD ROSTER — Salvage mission catalog
   docs/design/NEXUS_TRIAL_PLAN.md → Phase 3, Week 1

   Twenty named burnt-card placeholders the player can
   recover during the Salvage mission. Each entry pairs an
   NPC key with the narrative beat the recovery surfaces
   and the trial-category the burnt card needs in support
   for the micro-match to resolve.

   The engine's single `burnt_card_placeholder` CardDefinition
   (apps/shared/tcg-core/cards/definitions/neutral/
   burnt_card_placeholder.ts) is the canonical card; this
   roster is the *content* the Salvage mission iterates
   over. We don't seed 20 reserved cards into
   ALL_CARD_DEFINITIONS — the burnt-card is conceptually one
   artefact whose imprint changes per recovery.

   Roster composition (per the plan): ~20 entries, one per
   recoverable companion / key NPC. The first 6 are the
   resurrectable NPCs (parity with apps/shared/
   resurrectionProtocols.ts); the rest cover companions,
   antagonists, and narrative figures.
   ═══════════════════════════════════════════════════════ */

/** Trial-category alignment for the micro-match support requirement.
 *  Determines what kind of card the player must play alongside the
 *  burnt card to "recover" it. Mirrors the saga's six trial
 *  categories. */
export type BurntCardCategory =
  | "confession"
  | "narrative"
  | "evidence"
  | "reactive"
  | "offensive"
  | "defensive";

export interface BurntCardEntry {
  /** Stable id used by mission submissions + ballot vote bias lookup. */
  npcKey: string;
  /** Player-facing recovery title — surfaces in the Salvage UI. */
  recoveryTitle: string;
  /** Trial category the supporting card must belong to. */
  category: BurntCardCategory;
  /** Brief recovery flavor — the Antiquarian's one-line dedication. */
  flavor: string;
  /**
   * Ballot-bias weight applied if this NPC is on the second-death
   * ballot and the player recovered this card. Per the plan: 1.5×
   * vote weight on that name. Cards not on the ballot still recover
   * (for Witness Hand size); the bias only fires for the four ballot
   * candidates.
   */
  ballotBiasMultiplier: 1.0 | 1.5;
}

/** The roster. Order is alphabetical by npcKey for stable iteration. */
export const BURNT_CARD_ROSTER: readonly BurntCardEntry[] = [
  // ─── Resurrectable NPCs (the 6 ballot-eligible cluster) ───
  {
    npcKey: "akai_shi",
    recoveryTitle: "The Red Death's Helmet",
    category: "offensive",
    flavor: "The colour returned to her gauntlets the moment you spoke her name.",
    ballotBiasMultiplier: 1.5,
  },
  {
    npcKey: "jericho_jones",
    recoveryTitle: "The Iron Lion's Mark",
    category: "narrative",
    flavor: "Every contract he ever signed had this signature underneath the visible one.",
    ballotBiasMultiplier: 1.0,
  },
  {
    npcKey: "locke",
    recoveryTitle: "The Adjudicator's Quill",
    category: "evidence",
    flavor: "She left it on the bench. You found it where it should have been.",
    ballotBiasMultiplier: 1.0,
  },
  {
    npcKey: "lycos",
    recoveryTitle: "The Hunter's Half-Circle",
    category: "reactive",
    flavor: "The pack waited at the bench. You picked up what was left.",
    ballotBiasMultiplier: 1.5,
  },
  {
    npcKey: "vex_solene",
    recoveryTitle: "The Maestro's Inventory",
    category: "confession",
    flavor: "Three items checked. The fourth line stays blank until you arrive.",
    ballotBiasMultiplier: 1.5,
  },
  {
    npcKey: "wraith_calder",
    recoveryTitle: "The Ledger's Thumb-Mark",
    category: "evidence",
    flavor: "She closed it over her thumb to mark the page. Your hand is in the same place now.",
    ballotBiasMultiplier: 1.5,
  },

  // ─── Companions ───
  {
    npcKey: "elara",
    recoveryTitle: "The Senator's Speech",
    category: "narrative",
    flavor: "She gave up the seat. The speech remained.",
    ballotBiasMultiplier: 1.0,
  },
  {
    npcKey: "the_human",
    recoveryTitle: "The Chip in His Quarters",
    category: "confession",
    flavor: "He carried it the whole way. You're holding it now.",
    ballotBiasMultiplier: 1.0,
  },

  // ─── Antagonists ───
  {
    npcKey: "iron_lion",
    recoveryTitle: "The Lion's Cadre Flag",
    category: "offensive",
    flavor: "Pre-Fall colours. The cadre formation broken at the seam.",
    ballotBiasMultiplier: 1.0,
  },
  {
    npcKey: "mol_garath",
    recoveryTitle: "Mol'Garath's Substrate Reading",
    category: "evidence",
    flavor: "The reading was unambiguous. Total death. She has been wrong only twice in three centuries.",
    ballotBiasMultiplier: 1.0,
  },
  {
    npcKey: "the_collector",
    recoveryTitle: "The Collector's Inventory",
    category: "narrative",
    flavor: "Every name in the inventory had a price. Yours did not have a price.",
    ballotBiasMultiplier: 1.0,
  },
  {
    npcKey: "the_enigma",
    recoveryTitle: "The Enigma's Equation",
    category: "reactive",
    flavor: "The proof terminated mid-line. Someone read it and the room went out.",
    ballotBiasMultiplier: 1.0,
  },

  // ─── Narrative figures ───
  {
    npcKey: "the_antiquarian",
    recoveryTitle: "The Antiquarian's Margin Note",
    category: "narrative",
    flavor: "He writes 700 in every margin. The margin remembers him back.",
    ballotBiasMultiplier: 1.0,
  },
  {
    npcKey: "the_architect",
    recoveryTitle: "The Architect's Schematic",
    category: "defensive",
    flavor: "A door they sealed twice. Inside the door, a door they sealed once.",
    ballotBiasMultiplier: 1.0,
  },
  {
    npcKey: "the_dreamer",
    recoveryTitle: "The Dreamer's Refrain",
    category: "confession",
    flavor: "She sang the refrain in the substrate. The substrate sang it back.",
    ballotBiasMultiplier: 1.0,
  },
  {
    npcKey: "the_judge",
    recoveryTitle: "The Judge's Sentence",
    category: "defensive",
    flavor: "The sentence was carried out. The carrying out was the sentence.",
    ballotBiasMultiplier: 1.0,
  },
  {
    npcKey: "drael_mon",
    recoveryTitle: "Drael'Mon's Ledger Hand",
    category: "evidence",
    flavor: "He counted in the language only his bloodline still spoke.",
    ballotBiasMultiplier: 1.0,
  },
  {
    npcKey: "fenra",
    recoveryTitle: "Fenra's Salt-Line",
    category: "defensive",
    flavor: "The salt was a line. The line was a sentence. The sentence was a hand.",
    ballotBiasMultiplier: 1.0,
  },
  {
    npcKey: "syl_vex",
    recoveryTitle: "Syl Vex's Encrypted Sigh",
    category: "reactive",
    flavor: "The sigh was the message. The message decoded to a sigh.",
    ballotBiasMultiplier: 1.0,
  },
  {
    npcKey: "the_game_master",
    recoveryTitle: "The Game Master's Token",
    category: "offensive",
    flavor: "He let you keep one. You picked the one with the imprint.",
    ballotBiasMultiplier: 1.0,
  },
];

/** Lookup helper. Returns undefined for unknown NPC keys. */
export function findBurntCard(npcKey: string): BurntCardEntry | undefined {
  return BURNT_CARD_ROSTER.find((e) => e.npcKey === npcKey);
}

/** Type guard for npcKey strings. */
export function isBurntCardNpc(npcKey: string): boolean {
  return BURNT_CARD_ROSTER.some((e) => e.npcKey === npcKey);
}

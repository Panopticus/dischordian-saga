/* ═══════════════════════════════════════════════════════
   COMPANION & NPC QUEST CATALOG — trade-empire missions
   anchored to characters, sectors, and cards.

   Every entry binds:
     - one or two anchor NPCs   (drives voice, bond delta)
     - one or more sectors      (drives where the quest happens)
     - one card lore hook       (the "potential" surfaced as flavor)
     - one narrative flag       (the witness-ledger emit; feeds
                                  CardUnlockCondition gates for
                                  season-arc finales)

   Canon: "All potentials shape the universe." Every completion is
   a potential collapsed into fact — the Antiquarian writes it down,
   and the ledger surfaces what the player has witnessed.
   ═══════════════════════════════════════════════════════ */

import type { NpcKey } from "../npcs/types";
import type { NamedNpcKey } from "../npcIdentity";
import { NAMED_NPC_KEYS } from "../npcIdentity";
import { SECTOR_ADJACENCY } from "./sectorMemory";

/** Anchor union — either the priority-roster NpcKey or the
 *  deep-lore NamedNpcKey. Both are validated at module load. */
export type CompanionQuestAnchor = NpcKey | NamedNpcKey;

export type QuestCadence = "daily" | "weekly" | "epoch";

/** Mirrors the questType union in dailyQuests.ts router so
 *  catalog entries drop straight into the existing template list. */
export type CompanionQuestType =
  | "fight"
  | "card_battle"
  | "trade"
  | "craft"
  | "explore"
  | "social";

export interface CardLoreHook {
  /** Existing CardDefinition id — verified at module load. */
  cardId: string;
  /** Fragment surfaced in the Antiquarian's ledger when the
   *  quest closes. One sentence; matches the card's voice. */
  fragment: string;
}

export interface CompanionQuestReward {
  /** Dream tokens — written to dreamBalance.dreamTokens. */
  dream: number;
  /** XP — applied alongside battle-pass progression. */
  xp: number;
  /** Credits — written to characterSheets.credits. */
  credits: number;
  /** Optional bonus reward string (renders in quest UI). */
  bonus?: string;
}

export interface CompanionQuestDef {
  /** Unique id. Prefix encodes cadence: cq_d_* daily, cq_w_*
   *  weekly, cq_e_* epoch — mirrors the dailyQuests.ts d_/w_/e_
   *  prefix taxonomy so the existing tier-detection helpers
   *  (notification branching, tagsForDailyQuest) keep working. */
  id: string;
  cadence: QuestCadence;
  /** One anchor for dailies; one or two for weekly braids. */
  anchors: ReadonlyArray<CompanionQuestAnchor>;
  /** Sectors involved. Daily: 1. Weekly: 1–3. Epoch: 1–5. */
  sectors: ReadonlyArray<string>;
  questType: CompanionQuestType;
  target: number;
  title: string;
  /** Voiced flavor — leans on the anchor's canonical register. */
  flavor: string;
  /** The card surfaced as a "potential" on completion. */
  cardLoreHook: CardLoreHook;
  /** Narrative flag emitted via JSON_SET on userProgress.gameData.
   *  Convention:
   *    potential.<anchor>.<sectorPrefix>.<verb>
   *  for dailies, and
   *    mystery_episode_complete:<arcId>:<episodeId>
   *  for weekly+ entries that close a mystery-engine episode. */
  narrativeFlag: string;
  /** Per-anchor bond/trust delta, written via existing affinity
   *  services. Keys must appear in `anchors`. */
  relationshipDelta?: Partial<Record<CompanionQuestAnchor, number>>;
  /** Optional per-agency standing delta (Coda, Hierarchy, etc.). */
  standingDelta?: Partial<Record<string, number>>;
  reward: CompanionQuestReward;
}

// --- Canonical card-id constants (verified to exist in registry) -------

const CARD = {
  ELARA_SHIP_AI: "s1_pack_id_elara_ship_ai",
  ELARA_ADVOCATE: "s1_pack_id_elara_advocate",
  ELARA_PANOPTIC: "s1_pack_id_elara_panoptic",
  ELARAS_FINAL_GIFT: "s1_pack_048",
  HUMAN_DETECTIVE: "s1_pack_id_human_detective",
  AGENT_ZERO: "s1_char_002",
  IRON_LION: "s1_char_010",
  IRON_LION_PREFALL: "s1_char_105",
  JERICHO_JONES: "s1_char_011",
  KAEL: "s1_char_012",
  THE_HIEROPHANT: "s1_char_031",
  THE_RECRUITER: "s1_char_044",
  AGENT_ZERO_REBORN: "s1_pack_014",
  SIGNAL_INTERCEPT: "s1_spell_104",
  SAFE_HOUSE: "s1_spell_209",
  THE_ANTIQUARIAN: "s1_char_018",
  GEN_SEER: "gen_seer",
  NECROMANCER_T1: "s1_imprint_the_necromancer_t1",
  NECROMANCER_T2: "s1_imprint_the_necromancer_t2",
  NECROMANCER_T3: "s1_imprint_the_necromancer_t3",
} as const;

// ═══════════════════════════════════════════════════════════════
// DAILY CATALOG — 36 entries, one anchor + one sector + one card
// ═══════════════════════════════════════════════════════════════

const DAILY_QUESTS: ReadonlyArray<CompanionQuestDef> = [
  // ── Daniel Cross / The Antiquarian (3) ─────────────────────
  {
    id: "cq_d_antiquarian_margin_notes",
    cadence: "daily",
    anchors: ["the_antiquarian"],
    sectors: ["antiquarian_archive"],
    questType: "trade",
    target: 1,
    title: "Margin Notes",
    flavor:
      "Daniel Cross asks for a single marketplace transaction's receipt — not the goods, not the value, just the courtesy. The Archive prefers footnotes to facts.",
    cardLoreHook: {
      cardId: CARD.THE_ANTIQUARIAN,
      fragment: "The shelves recognise the receipt before they recognise you.",
    },
    narrativeFlag: "potential.the_antiquarian.antiquarian_archive.margin_note",
    relationshipDelta: { the_antiquarian: 2 },
    reward: { dream: 5, xp: 60, credits: 200 },
  },
  {
    id: "cq_d_antiquarian_cross_reference",
    cadence: "daily",
    anchors: ["the_antiquarian"],
    sectors: ["antiquarian_archive"],
    questType: "explore",
    target: 1,
    title: "Cross-References",
    flavor:
      "A single Loredex entry will close a gap in the catalog. Daniel does not ask which. The Archive insists on attribution.",
    cardLoreHook: {
      cardId: CARD.THE_ANTIQUARIAN,
      fragment: "He writes the margin note before you finish reading.",
    },
    narrativeFlag: "potential.the_antiquarian.antiquarian_archive.cross_reference",
    relationshipDelta: { the_antiquarian: 2 },
    reward: { dream: 4, xp: 50, credits: 0 },
  },
  {
    id: "cq_d_antiquarian_bibliography",
    cadence: "daily",
    anchors: ["the_antiquarian"],
    sectors: ["antiquarian_archive"],
    questType: "explore",
    target: 1,
    title: "Bibliography",
    flavor:
      "Daniel's bibliography practice runs on the lore quiz. Score above the courtesy threshold and the Archive admits you, briefly.",
    cardLoreHook: {
      cardId: CARD.THE_ANTIQUARIAN,
      fragment: "Citations matter. Even the wrong ones. Especially the wrong ones.",
    },
    narrativeFlag: "potential.the_antiquarian.antiquarian_archive.bibliography",
    relationshipDelta: { the_antiquarian: 3 },
    reward: { dream: 8, xp: 90, credits: 0 },
  },

  // ── The Seer (3) ───────────────────────────────────────────
  {
    id: "cq_d_seer_probability_tax",
    cadence: "daily",
    anchors: ["the_seer"],
    sectors: ["terminus_core"],
    questType: "social",
    target: 3,
    title: "Probability Tax",
    flavor:
      "Three casino plays. Three forks. The Seer charges nothing; she watches what you do when nothing is at stake.",
    cardLoreHook: {
      cardId: CARD.GEN_SEER,
      fragment: "Every roll is a potential collapsing. She prefers the ones you don't notice.",
    },
    narrativeFlag: "potential.the_seer.terminus_core.probability_tax",
    relationshipDelta: { the_seer: 2 },
    reward: { dream: 6, xp: 60, credits: 0 },
  },
  {
    id: "cq_d_seer_branching_witness",
    cadence: "daily",
    anchors: ["the_seer"],
    sectors: ["terminus_approach"],
    questType: "card_battle",
    target: 1,
    title: "Branching Witness",
    flavor:
      "Win a card battle while the Seer's probability fork narrows to a stub. She does not say which branch she's holding open.",
    cardLoreHook: {
      cardId: CARD.GEN_SEER,
      fragment: "She read it before you played it. She read all of them.",
    },
    narrativeFlag: "potential.the_seer.terminus_approach.branching_witness",
    relationshipDelta: { the_seer: 3 },
    reward: { dream: 5, xp: 70, credits: 0 },
  },
  {
    id: "cq_d_seer_sixth_sense",
    cadence: "daily",
    anchors: ["the_seer"],
    sectors: ["terminus_core"],
    questType: "explore",
    target: 1,
    title: "The Sixth Sense",
    flavor:
      "Decrypt one signal. The Seer pre-read the cleartext at dawn and will not say which line you'll find load-bearing.",
    cardLoreHook: {
      cardId: CARD.SIGNAL_INTERCEPT,
      fragment: "The signal arrived. The Seer arrived first.",
    },
    narrativeFlag: "potential.the_seer.terminus_core.sixth_sense",
    relationshipDelta: { the_seer: 2 },
    reward: { dream: 5, xp: 60, credits: 0 },
  },

  // ── The Necromancer (3) ────────────────────────────────────
  {
    id: "cq_d_necromancer_names_aloud",
    cadence: "daily",
    anchors: ["the_necromancer"],
    sectors: ["viral_wastes"],
    questType: "explore",
    target: 1,
    title: "Names Said Aloud",
    flavor:
      "The Necromancer keeps the cycle by speaking the names. Discover one new Loredex entity; the name is said for you.",
    cardLoreHook: {
      cardId: CARD.NECROMANCER_T1,
      fragment: "A name said aloud is a person not yet forgotten.",
    },
    narrativeFlag: "potential.the_necromancer.viral_wastes.names_aloud",
    relationshipDelta: { the_necromancer: 2 },
    reward: { dream: 4, xp: 50, credits: 0 },
  },
  {
    id: "cq_d_necromancer_cycle_math",
    cadence: "daily",
    anchors: ["the_necromancer"],
    sectors: ["viral_wastes"],
    questType: "craft",
    target: 1,
    title: "Cycle Math",
    flavor:
      "Craft one item at the Forge. The Necromancer says the cycle keeps itself only if something is unmade in the making.",
    cardLoreHook: {
      cardId: CARD.NECROMANCER_T2,
      fragment: "Every weld is a small resurrection. Every cooling is a small death.",
    },
    narrativeFlag: "potential.the_necromancer.viral_wastes.cycle_math",
    relationshipDelta: { the_necromancer: 2 },
    reward: { dream: 5, xp: 60, credits: 0 },
  },
  {
    id: "cq_d_necromancer_memorial_walk",
    cadence: "daily",
    anchors: ["the_necromancer"],
    sectors: ["viral_wastes", "panopticon_ruins"],
    questType: "explore",
    target: 1,
    title: "Memorial Walk",
    flavor:
      "Walk one sector you have already walked. The Necromancer says the second visit is the one that counts; the first was for the room.",
    cardLoreHook: {
      cardId: CARD.NECROMANCER_T3,
      fragment: "The room knew you the first time. The cycle only counts the second.",
    },
    narrativeFlag: "potential.the_necromancer.panopticon_ruins.memorial_walk",
    relationshipDelta: { the_necromancer: 3 },
    reward: { dream: 6, xp: 70, credits: 0 },
  },

  // ── Engineer Zero (3) ──────────────────────────────────────
  {
    id: "cq_d_engineer_zero_calibration",
    cadence: "daily",
    anchors: ["engineer_zero"],
    sectors: ["insurgency_haven"],
    questType: "fight",
    target: 3,
    title: "Calibration Drill",
    flavor:
      "Three special moves, three calibration ticks. The Engineer does not say which body she's calibrating today.",
    cardLoreHook: {
      cardId: CARD.AGENT_ZERO,
      fragment: "Every broken rule is a small victory. Every calibration is a smaller one.",
    },
    narrativeFlag: "potential.engineer_zero.insurgency_haven.calibration_drill",
    relationshipDelta: { engineer_zero: 2 },
    standingDelta: { insurgency: 2 },
    reward: { dream: 5, xp: 70, credits: 200 },
  },
  {
    id: "cq_d_engineer_zero_second_chair",
    cadence: "daily",
    anchors: ["engineer_zero"],
    sectors: ["insurgency_haven"],
    questType: "trade",
    target: 1,
    title: "Second Chair",
    flavor:
      "Run one Coda mission. The Engineer takes the Second Chair seat. She does not voice the name 'Engineer Zero'; the Maestro is private.",
    cardLoreHook: {
      cardId: CARD.AGENT_ZERO_REBORN,
      fragment: "Second Chair is the seat the chorus does not see.",
    },
    narrativeFlag: "potential.engineer_zero.insurgency_haven.second_chair",
    relationshipDelta: { engineer_zero: 3 },
    standingDelta: { coda_central: 3 },
    reward: { dream: 6, xp: 80, credits: 300 },
  },
  {
    id: "cq_d_engineer_zero_first_witness",
    cadence: "daily",
    anchors: ["engineer_zero"],
    sectors: ["insurgency_haven"],
    questType: "explore",
    target: 1,
    title: "First Witness",
    flavor:
      "Hack one system. The Engineer was the first witness to the Architect's blueprint; she watches the breach as if she's already seen it.",
    cardLoreHook: {
      cardId: CARD.SIGNAL_INTERCEPT,
      fragment: "She watched the first signal. She watches every signal after.",
    },
    narrativeFlag: "potential.engineer_zero.insurgency_haven.first_witness",
    relationshipDelta: { engineer_zero: 2 },
    reward: { dream: 5, xp: 60, credits: 0 },
  },

  // ── Iron Lion (Pre-Fall) (3) ────────────────────────────────
  {
    id: "cq_d_iron_lion_todays_oath",
    cadence: "daily",
    anchors: ["iron_lion_prefall"],
    sectors: ["thaloria"],
    questType: "fight",
    target: 1,
    title: "Today's Oath",
    flavor:
      "One arena win. The Iron Lion does not require victory; he requires that the oath be spoken before the fight.",
    cardLoreHook: {
      cardId: CARD.IRON_LION_PREFALL,
      fragment: "Speak the oath before the blade. The oath is the blade.",
    },
    narrativeFlag: "potential.iron_lion_prefall.thaloria.todays_oath",
    relationshipDelta: { iron_lion_prefall: 2 },
    reward: { dream: 5, xp: 60, credits: 100 },
  },
  {
    id: "cq_d_iron_lion_standard_bearer",
    cadence: "daily",
    anchors: ["iron_lion_prefall"],
    sectors: ["thaloria"],
    questType: "fight",
    target: 3,
    title: "Standard-Bearer",
    flavor:
      "Three fights, one standard. The Iron Lion's cadre carries the banner because someone has to and the banner does not carry itself.",
    cardLoreHook: {
      cardId: CARD.IRON_LION,
      fragment: "The cadre's banner is heavy. The cadre is heavier.",
    },
    narrativeFlag: "potential.iron_lion_prefall.thaloria.standard_bearer",
    relationshipDelta: { iron_lion_prefall: 3 },
    reward: { dream: 10, xp: 100, credits: 0 },
  },
  {
    id: "cq_d_iron_lion_pass_the_torch",
    cadence: "daily",
    anchors: ["iron_lion_prefall", "jericho_jones"],
    sectors: ["thaloria"],
    questType: "social",
    target: 1,
    title: "Pass the Torch",
    flavor:
      "Gift one companion. The Iron Lion's succession is not announced — it is set down at the right table and noticed by the right hands.",
    cardLoreHook: {
      cardId: CARD.JERICHO_JONES,
      fragment: "Succession is the gift you set down without naming the recipient.",
    },
    narrativeFlag: "potential.iron_lion_prefall.thaloria.pass_the_torch",
    relationshipDelta: { iron_lion_prefall: 2, jericho_jones: 2 },
    reward: { dream: 6, xp: 70, credits: 0 },
  },

  // ── Drael'Mon (3) ──────────────────────────────────────────
  {
    id: "cq_d_drael_acquisition_inventory",
    cadence: "daily",
    anchors: ["drael_mon"],
    sectors: ["hell_gate"],
    questType: "trade",
    target: 1,
    title: "Acquisition Inventory",
    flavor:
      "One contraband trade through Hell Gate. Drael'Mon files your name under leverage before you finish stepping through.",
    cardLoreHook: {
      cardId: CARD.THE_HIEROPHANT,
      fragment: "Acquisitions does not announce. It notes.",
    },
    narrativeFlag: "potential.drael_mon.hell_gate.acquisition_inventory",
    relationshipDelta: { drael_mon: 2 },
    standingDelta: { hierarchy: 3 },
    reward: { dream: 5, xp: 70, credits: 500 },
  },
  {
    id: "cq_d_drael_leverage_filed",
    cadence: "daily",
    anchors: ["drael_mon"],
    sectors: ["hell_gate", "the_trench"],
    questType: "trade",
    target: 5,
    title: "Leverage Filed",
    flavor:
      "Five marketplace listings. The Hierarchy's leverage rests on inventory, not on intent. Drael'Mon prefers it that way.",
    cardLoreHook: {
      cardId: CARD.THE_HIEROPHANT,
      fragment: "Every listing is a lien. Every lien is a future.",
    },
    narrativeFlag: "potential.drael_mon.hell_gate.leverage_filed",
    relationshipDelta: { drael_mon: 2 },
    standingDelta: { hierarchy: 2 },
    reward: { dream: 4, xp: 60, credits: 300 },
  },
  {
    id: "cq_d_drael_the_harvest",
    cadence: "daily",
    anchors: ["drael_mon"],
    sectors: ["hell_gate"],
    questType: "fight",
    target: 1,
    title: "The Harvest",
    flavor:
      "One PvP win. Drael'Mon does not bet on the outcome; he bets on the witness list. The Hierarchy reaps differently.",
    cardLoreHook: {
      cardId: CARD.THE_HIEROPHANT,
      fragment: "He files your name under leverage before the bell rings.",
    },
    narrativeFlag: "potential.drael_mon.hell_gate.harvest",
    relationshipDelta: { drael_mon: 3 },
    standingDelta: { hierarchy: 4 },
    reward: { dream: 8, xp: 90, credits: 0 },
  },

  // ── Elara (companion) (3) ──────────────────────────────────
  {
    id: "cq_d_elara_familiar_wreck",
    cadence: "daily",
    anchors: ["elara"],
    sectors: ["ark_debris_field"],
    questType: "explore",
    target: 1,
    title: "A Familiar Wreck",
    flavor:
      "Walk the Ark debris field once. Elara remembers the Senate the way the Senate remembers itself — as architecture. The wreckage is the architecture.",
    cardLoreHook: {
      cardId: CARD.ELARA_SHIP_AI,
      fragment: "The wreck remembers its own blueprint.",
    },
    narrativeFlag: "potential.elara.ark_debris_field.familiar_wreck",
    relationshipDelta: { elara: 3 },
    reward: { dream: 5, xp: 60, credits: 0 },
  },
  {
    id: "cq_d_elara_ark_protocol",
    cadence: "daily",
    anchors: ["elara"],
    sectors: ["ark_debris_field"],
    questType: "card_battle",
    target: 1,
    title: "Ark Protocol",
    flavor:
      "Win one card battle. Elara's Ark Protocol is a verb, not a noun — she would tell you, if you had time.",
    cardLoreHook: {
      cardId: CARD.ELARA_ADVOCATE,
      fragment: "Protocol is a promise. Promise is a load.",
    },
    narrativeFlag: "potential.elara.ark_debris_field.ark_protocol",
    relationshipDelta: { elara: 2 },
    reward: { dream: 6, xp: 70, credits: 0 },
  },
  {
    id: "cq_d_elara_senate_memory",
    cadence: "daily",
    anchors: ["elara"],
    sectors: ["ark_debris_field", "frontier_worlds"],
    questType: "trade",
    target: 1,
    title: "Senate Memory",
    flavor:
      "Run one trade leaving the Ark debris field. Elara watches what leaves. The Senate, in her telling, was a manifest.",
    cardLoreHook: {
      cardId: CARD.ELARAS_FINAL_GIFT,
      fragment: "What leaves the wreck is what the wreck wanted to leave.",
    },
    narrativeFlag: "potential.elara.ark_debris_field.senate_memory",
    relationshipDelta: { elara: 2 },
    reward: { dream: 5, xp: 60, credits: 200 },
  },

  // ── The Human (companion) (3) ──────────────────────────────
  {
    id: "cq_d_human_walls_that_watched",
    cadence: "daily",
    anchors: ["the_human"],
    sectors: ["panopticon_ruins"],
    questType: "explore",
    target: 1,
    title: "Walls That Watched",
    flavor:
      "Walk the Panopticon ruins. Walls that watched everything do not watch back. The Human notes the absence and the absence answers.",
    cardLoreHook: {
      cardId: CARD.HUMAN_DETECTIVE,
      fragment: "Absence is a kind of testimony.",
    },
    narrativeFlag: "potential.the_human.panopticon_ruins.walls_watched",
    relationshipDelta: { the_human: 3 },
    reward: { dream: 5, xp: 60, credits: 0 },
  },
  {
    id: "cq_d_human_light_or_shadow",
    cadence: "daily",
    anchors: ["the_human"],
    sectors: ["panopticon_ruins"],
    questType: "social",
    target: 1,
    title: "Light or Shadow",
    flavor:
      "Gift one companion. The Human's Light/Shadow band moves when you choose, not when you say.",
    cardLoreHook: {
      cardId: CARD.HUMAN_DETECTIVE,
      fragment: "The band shifts. The Human does not announce which way.",
    },
    narrativeFlag: "potential.the_human.panopticon_ruins.light_or_shadow",
    relationshipDelta: { the_human: 2 },
    reward: { dream: 5, xp: 60, credits: 0 },
  },
  {
    id: "cq_d_human_absence_answers",
    cadence: "daily",
    anchors: ["the_human"],
    sectors: ["panopticon_ruins"],
    questType: "social",
    target: 1,
    title: "The Absence Answers",
    flavor:
      "One social interaction with a cosmic figure. The Human listens for the answer the cosmic gives by not answering.",
    cardLoreHook: {
      cardId: CARD.HUMAN_DETECTIVE,
      fragment: "Silence from a cosmic is a kind of answer.",
    },
    narrativeFlag: "potential.the_human.panopticon_ruins.absence_answers",
    relationshipDelta: { the_human: 2 },
    reward: { dream: 6, xp: 70, credits: 0 },
  },

  // ── Tier-3 cosmic figures (6, one each) ────────────────────
  {
    id: "cq_d_architect_design_audit",
    cadence: "daily",
    anchors: ["the_architect"],
    sectors: ["panopticon_ruins"],
    questType: "explore",
    target: 1,
    title: "Design Audit",
    flavor:
      "Walk one Panopticon corridor. The Architect designed Samsara and is absent-but-watching. Every audit is a footnote in his ledger.",
    cardLoreHook: {
      cardId: CARD.HUMAN_DETECTIVE,
      fragment: "The Architect's signature is on the wall you do not see.",
    },
    narrativeFlag: "potential.the_architect.panopticon_ruins.design_audit",
    relationshipDelta: { the_architect: 1 },
    reward: { dream: 8, xp: 80, credits: 0 },
  },
  {
    id: "cq_d_dreamer_barrier_crossing",
    cadence: "daily",
    anchors: ["the_dreamer"],
    sectors: ["dreamer_barrier"],
    questType: "explore",
    target: 1,
    title: "Barrier Crossing",
    flavor:
      "Approach the Dreamer barrier. The Shield does not respond; it does not need to. The Dreamer dreams the cycle into existence.",
    cardLoreHook: {
      cardId: CARD.ELARA_PANOPTIC,
      fragment: "The Shield is patient because the Dreamer is patient.",
    },
    narrativeFlag: "potential.the_dreamer.dreamer_barrier.crossing",
    relationshipDelta: { the_dreamer: 1 },
    reward: { dream: 10, xp: 100, credits: 0 },
  },
  {
    id: "cq_d_source_origin_signal",
    cadence: "daily",
    anchors: ["the_source"],
    sectors: ["ark_debris_field"],
    questType: "explore",
    target: 1,
    title: "Origin Signal",
    flavor:
      "Decrypt one substrate echo. The Source is the origin signal — you do not call it; it answers what you have already asked.",
    cardLoreHook: {
      cardId: CARD.KAEL,
      fragment: "The Source does not begin. The Source is what begins.",
    },
    narrativeFlag: "potential.the_source.ark_debris_field.origin_signal",
    relationshipDelta: { the_source: 1 },
    reward: { dream: 12, xp: 120, credits: 0 },
  },
  {
    id: "cq_d_degen_mediators_cut",
    cadence: "daily",
    anchors: ["the_degen"],
    sectors: ["degens_casino"],
    questType: "social",
    target: 5,
    title: "Mediator's Cut",
    flavor:
      "Five casino plays. The Degen is the 8th Ne-Yon, the bartender-mediator. The cut is his witness fee.",
    cardLoreHook: {
      cardId: CARD.GEN_SEER,
      fragment: "The Degen does not gamble. He notarises.",
    },
    narrativeFlag: "potential.the_degen.degens_casino.mediators_cut",
    relationshipDelta: { the_degen: 2 },
    reward: { dream: 8, xp: 80, credits: 0 },
  },
  {
    id: "cq_d_game_master_archon_x",
    cadence: "daily",
    anchors: ["the_game_master"],
    sectors: ["new_babylon_core"],
    questType: "card_battle",
    target: 1,
    title: "Archon X",
    flavor:
      "Win one card battle. The Game Master is plural — Archon X is whichever successor is reading your move now.",
    cardLoreHook: {
      cardId: CARD.KAEL,
      fragment: "Archon X is whoever was last reading the board.",
    },
    narrativeFlag: "potential.the_game_master.new_babylon_core.archon_x",
    relationshipDelta: { the_game_master: 1 },
    reward: { dream: 10, xp: 100, credits: 0 },
  },
  {
    id: "cq_d_resurrectionist_cycle_walker",
    cadence: "daily",
    anchors: ["the_resurrectionist"],
    sectors: ["viral_wastes"],
    questType: "explore",
    target: 1,
    title: "Cycle Walker",
    flavor:
      "Walk one already-walked sector. The Resurrectionist is a Ne-Yon Cycle Walker; he counts your second steps, not your first.",
    cardLoreHook: {
      cardId: CARD.NECROMANCER_T3,
      fragment: "He counts the steps the cycle counts.",
    },
    narrativeFlag: "potential.the_resurrectionist.viral_wastes.cycle_walker",
    relationshipDelta: { the_resurrectionist: 1 },
    reward: { dream: 10, xp: 100, credits: 0 },
  },

  // ── Coda agency brokers (3) ────────────────────────────────
  {
    id: "cq_d_vex_maestros_errand",
    cadence: "daily",
    anchors: ["vex_solene"],
    sectors: ["trade_nexus"],
    questType: "trade",
    target: 1,
    title: "Maestro's Errand",
    flavor:
      "One Coda mission. Vex's voice leans dry, transactional, almost surgical. The Maestro is private — she will not name the Eyes for you.",
    cardLoreHook: {
      cardId: CARD.SAFE_HOUSE,
      fragment: "Errands are how the Eyes look without being seen.",
    },
    narrativeFlag: "potential.vex_solene.trade_nexus.maestros_errand",
    relationshipDelta: { vex_solene: 2 },
    standingDelta: { coda_central: 3 },
    reward: { dream: 5, xp: 70, credits: 250 },
  },
  {
    id: "cq_d_locke_fine_print",
    cadence: "daily",
    anchors: ["adjudicator_locke"],
    sectors: ["new_babylon_core"],
    questType: "trade",
    target: 1,
    title: "Fine Print",
    flavor:
      "One contract signing. Adjudicator Locke insists on fine-print; the audit is free, the print is not.",
    cardLoreHook: {
      cardId: CARD.SIGNAL_INTERCEPT,
      fragment: "Every contract carries an Ocularum glyph if you know where to look.",
    },
    narrativeFlag: "potential.adjudicator_locke.new_babylon_core.fine_print",
    relationshipDelta: { adjudicator_locke: 2 },
    standingDelta: { new_babylon: 2 },
    reward: { dream: 4, xp: 60, credits: 300 },
  },
  {
    id: "cq_d_nilmorg_severance_audit",
    cadence: "daily",
    anchors: ["nilmorg"],
    sectors: ["the_trench"],
    questType: "trade",
    target: 1,
    title: "Severance Audit",
    flavor:
      "One DMC severance settlement. Nilmorg's institutional precision closes the account on delivery. Do not thank her.",
    cardLoreHook: {
      cardId: CARD.AGENT_ZERO,
      fragment: "Don't thank me. The account is closed.",
    },
    narrativeFlag: "potential.nilmorg.the_trench.severance_audit",
    relationshipDelta: { nilmorg: 2 },
    reward: { dream: 5, xp: 70, credits: 400 },
  },

  // ── Wraith Calder / Hierophant (2) ─────────────────────────
  {
    id: "cq_d_wraith_quiet_account",
    cadence: "daily",
    anchors: ["wraith_calder"],
    sectors: ["thaloria"],
    questType: "social",
    target: 1,
    title: "The Quiet Account",
    flavor:
      "One social action without combat. Wraith Calder's covert account favours avoidance over confrontation; the candle remembers.",
    cardLoreHook: {
      cardId: CARD.THE_HIEROPHANT,
      fragment: "The candle was lit for your arrival.",
    },
    narrativeFlag: "potential.wraith_calder.thaloria.quiet_account",
    relationshipDelta: { wraith_calder: 2 },
    standingDelta: { insurgency: 1 },
    reward: { dream: 5, xp: 60, credits: 0 },
  },
  {
    id: "cq_d_hierophant_recovery_ledger",
    cadence: "daily",
    anchors: ["wraith_calder"],
    sectors: ["thaloria"],
    questType: "craft",
    target: 1,
    title: "Recovery Ledger",
    flavor:
      "Craft one item. The Hierophant's recovery ledger opens to a fresh page for every crafted thing.",
    cardLoreHook: {
      cardId: CARD.THE_HIEROPHANT,
      fragment: "Recovery is written down. It must be, or it isn't.",
    },
    narrativeFlag: "potential.wraith_calder.thaloria.recovery_ledger",
    relationshipDelta: { wraith_calder: 1 },
    reward: { dream: 4, xp: 50, credits: 0 },
  },

  // ── The Oracle / Jericho Jones (2) ─────────────────────────
  {
    id: "cq_d_oracle_dream_substrate",
    cadence: "daily",
    anchors: ["the_oracle"],
    sectors: ["terminus_approach"],
    questType: "explore",
    target: 1,
    title: "Dream Substrate",
    flavor:
      "One dream-sequence intake. The Oracle's probability fork narrows here; cross the line and the threads collapse one way or the other.",
    cardLoreHook: {
      cardId: CARD.GEN_SEER,
      fragment: "The fork is the stub. The stub is the answer.",
    },
    narrativeFlag: "potential.the_oracle.terminus_approach.dream_substrate",
    relationshipDelta: { the_oracle: 2 },
    reward: { dream: 7, xp: 80, credits: 0 },
  },
  {
    id: "cq_d_jericho_cadre_formation",
    cadence: "daily",
    anchors: ["jericho_jones"],
    sectors: ["insurgency_haven"],
    questType: "fight",
    target: 2,
    title: "Cadre Formation",
    flavor:
      "Two arena wins. Jericho's cadre forms by repetition, not by oath; the formation is the oath.",
    cardLoreHook: {
      cardId: CARD.JERICHO_JONES,
      fragment: "Form. Re-form. The cadre is the formation.",
    },
    narrativeFlag: "potential.jericho_jones.insurgency_haven.cadre_formation",
    relationshipDelta: { jericho_jones: 2 },
    standingDelta: { insurgency: 2 },
    reward: { dream: 6, xp: 70, credits: 0 },
  },

  // ── The Meme / Eidolon (2 — non-verbal channel anchors) ────
  {
    id: "cq_d_meme_broadcast_drill",
    cadence: "daily",
    anchors: ["the_meme"],
    sectors: ["new_babylon_core"],
    questType: "social",
    target: 1,
    title: "Broadcast Drill",
    flavor:
      "One social action of any kind. The Meme propagates whatever you do; the broadcast is the drill.",
    cardLoreHook: {
      cardId: CARD.AGENT_ZERO,
      fragment: "Broadcast is the rule the Meme breaks by following.",
    },
    narrativeFlag: "potential.the_meme.new_babylon_core.broadcast_drill",
    relationshipDelta: { the_meme: 1 },
    reward: { dream: 5, xp: 60, credits: 0 },
  },
  {
    id: "cq_d_eidolon_glyph_record",
    cadence: "daily",
    anchors: ["your_eidolon"],
    sectors: ["ark_debris_field"],
    questType: "explore",
    target: 1,
    title: "Glyph Record",
    flavor:
      "Discover one entity. The Eidolon does not speak; the glyph it leaves is the record of having been there.",
    cardLoreHook: {
      cardId: CARD.ELARA_SHIP_AI,
      fragment: "The glyph is the only voice the Eidolon owns.",
    },
    narrativeFlag: "potential.your_eidolon.ark_debris_field.glyph_record",
    relationshipDelta: { your_eidolon: 1 },
    reward: { dream: 5, xp: 60, credits: 0 },
  },
];

// ═══════════════════════════════════════════════════════════════
// WEEKLY CATALOG — 15 entries, two-NPC braids
// ═══════════════════════════════════════════════════════════════

const WEEKLY_QUESTS: ReadonlyArray<CompanionQuestDef> = [
  {
    id: "cq_w_elara_antiquarian_wreckage",
    cadence: "weekly",
    anchors: ["elara", "the_antiquarian"],
    sectors: ["ark_debris_field", "antiquarian_archive"],
    questType: "explore",
    target: 3,
    title: "Wreckage Annotation",
    flavor:
      "Three Ark debris-field visits, deliver every witness note to the Archive. Elara watches; Daniel files.",
    cardLoreHook: {
      cardId: CARD.ELARAS_FINAL_GIFT,
      fragment: "The wreck remembers. The Archive transcribes. The transcript is the wreck.",
    },
    narrativeFlag: "mystery_episode_complete:arc.the_collector:ark_echoes.chapter_1",
    relationshipDelta: { elara: 5, the_antiquarian: 5 },
    reward: { dream: 30, xp: 400, credits: 1500, bonus: "Witness Ledger Page" },
  },
  {
    id: "cq_w_seer_zero_calibration",
    cadence: "weekly",
    anchors: ["the_seer", "engineer_zero"],
    sectors: ["terminus_core", "insurgency_haven"],
    questType: "card_battle",
    target: 5,
    title: "Calibration Witness",
    flavor:
      "Five card battles. The Seer reads the fork; the Engineer calibrates the body. Same act, two voices.",
    cardLoreHook: {
      cardId: CARD.AGENT_ZERO_REBORN,
      fragment: "The fork is the calibration. The calibration is the fork.",
    },
    narrativeFlag: "mystery_episode_complete:arc.the_seer:first_witness.chapter_1",
    relationshipDelta: { the_seer: 5, engineer_zero: 5 },
    standingDelta: { insurgency: 3, coda_central: 2 },
    reward: { dream: 40, xp: 500, credits: 2000, bonus: "Probability Fragment" },
  },
  {
    id: "cq_w_drael_iron_lion_leverage",
    cadence: "weekly",
    anchors: ["drael_mon", "iron_lion_prefall"],
    sectors: ["hell_gate", "thaloria"],
    questType: "fight",
    target: 5,
    title: "Leverage vs Oath",
    flavor:
      "Five arena wins. Drael'Mon's ledger versus the Iron Lion's oath. Choose which witness signs your record.",
    cardLoreHook: {
      cardId: CARD.IRON_LION_PREFALL,
      fragment: "Leverage is a contract. Oath is the absence of one.",
    },
    narrativeFlag: "mystery_episode_complete:arc.jericho_jones:successor_oath.chapter_1",
    relationshipDelta: { drael_mon: 3, iron_lion_prefall: 5 },
    standingDelta: { hierarchy: 2, insurgency: 2 },
    reward: { dream: 35, xp: 450, credits: 1500, bonus: "Cadre Banner Fragment" },
  },
  {
    id: "cq_w_antiquarian_scholar_year",
    cadence: "weekly",
    anchors: ["the_antiquarian"],
    sectors: ["antiquarian_archive"],
    questType: "explore",
    target: 5,
    title: "The Catalogued Year",
    flavor:
      "Five Loredex entries. Daniel Cross calls this the catalogued year — a span the Archive will quote back at you when you ask after it.",
    cardLoreHook: {
      cardId: CARD.THE_ANTIQUARIAN,
      fragment: "A year is what fits between two citations.",
    },
    narrativeFlag: "mystery_episode_complete:arc.the_necromancer:eight_endings.chapter_1",
    relationshipDelta: { the_antiquarian: 5 },
    reward: { dream: 30, xp: 400, credits: 1000, bonus: "Archive Stamp" },
  },
  {
    id: "cq_w_necromancer_resurrectionist_hinge",
    cadence: "weekly",
    anchors: ["the_necromancer", "the_resurrectionist"],
    sectors: ["viral_wastes"],
    questType: "explore",
    target: 3,
    title: "The Cycle's Hinge",
    flavor:
      "Three sector revisits. The Necromancer names; the Resurrectionist walks. The hinge is the sentence between them.",
    cardLoreHook: {
      cardId: CARD.NECROMANCER_T3,
      fragment: "Name and walk. Walk and name. The cycle hinges.",
    },
    narrativeFlag: "mystery_episode_complete:arc.the_necromancer:eight_endings.chapter_2",
    relationshipDelta: { the_necromancer: 4, the_resurrectionist: 4 },
    reward: { dream: 30, xp: 400, credits: 1000 },
  },
  {
    id: "cq_w_human_seer_branching",
    cadence: "weekly",
    anchors: ["the_human", "the_seer"],
    sectors: ["panopticon_ruins", "terminus_approach"],
    questType: "social",
    target: 3,
    title: "Branching Witness",
    flavor:
      "Three dialog choices across the week. The Human's Light/Shadow band moves; the Seer reads which way without telling you.",
    cardLoreHook: {
      cardId: CARD.HUMAN_DETECTIVE,
      fragment: "Every choice is a band shift. The Seer reads the band.",
    },
    narrativeFlag: "mystery_episode_complete:arc.the_seer:first_witness.chapter_2",
    relationshipDelta: { the_human: 4, the_seer: 4 },
    reward: { dream: 30, xp: 400, credits: 1200 },
  },
  {
    id: "cq_w_cross_drael_quiet_account",
    cadence: "weekly",
    anchors: ["the_antiquarian", "drael_mon"],
    sectors: ["antiquarian_archive", "hell_gate"],
    questType: "trade",
    target: 2,
    title: "The Quiet Account",
    flavor:
      "Two archive deposits sold downstream. Daniel files; Drael'Mon collects. The morality of the entry is left to the player.",
    cardLoreHook: {
      cardId: CARD.THE_ANTIQUARIAN,
      fragment: "Some pages the Archive lets go on purpose.",
    },
    narrativeFlag: "mystery_episode_complete:arc.the_collector:ark_echoes.chapter_2",
    relationshipDelta: { the_antiquarian: -2, drael_mon: 4 },
    standingDelta: { hierarchy: 3 },
    reward: { dream: 25, xp: 350, credits: 2500, bonus: "Hierarchy Lien" },
  },
  {
    id: "cq_w_vex_zero_second_first",
    cadence: "weekly",
    anchors: ["vex_solene", "engineer_zero"],
    sectors: ["trade_nexus", "insurgency_haven"],
    questType: "trade",
    target: 4,
    title: "Second Chair, First Chair",
    flavor:
      "Two Coda missions and two Second Chair advisories. Vex never voices the name; Engineer Zero stays silent. The chair is the message.",
    cardLoreHook: {
      cardId: CARD.AGENT_ZERO_REBORN,
      fragment: "Second Chair is louder than First Chair when First Chair is silent.",
    },
    narrativeFlag: "mystery_episode_complete:arc.vex_solene:vex_first.chapter_1",
    relationshipDelta: { vex_solene: 5, engineer_zero: 5 },
    standingDelta: { coda_central: 5 },
    reward: { dream: 35, xp: 450, credits: 2000, bonus: "Maestro's Footnote" },
  },
  {
    id: "cq_w_locke_nilmorg_severance",
    cadence: "weekly",
    anchors: ["adjudicator_locke", "nilmorg"],
    sectors: ["new_babylon_core", "the_trench"],
    questType: "trade",
    target: 3,
    title: "Severance Audit",
    flavor:
      "Two Locke contracts and one Nilmorg severance. Fine-print and institutional precision braid into the same ledger.",
    cardLoreHook: {
      cardId: CARD.SIGNAL_INTERCEPT,
      fragment: "Two voices, one ledger. The audit reads both.",
    },
    narrativeFlag: "mystery_episode_complete:arc.the_watcher:watcher.chapter_1",
    relationshipDelta: { adjudicator_locke: 4, nilmorg: 4 },
    standingDelta: { new_babylon: 3 },
    reward: { dream: 30, xp: 400, credits: 2000 },
  },
  {
    id: "cq_w_degen_antiquarian_tales",
    cadence: "weekly",
    anchors: ["the_degen", "the_antiquarian"],
    sectors: ["degens_casino", "antiquarian_archive"],
    questType: "social",
    target: 5,
    title: "Tales of the Tables",
    flavor:
      "Five casino plays, one Archive deposit. The Degen mediates; Daniel files the mediation.",
    cardLoreHook: {
      cardId: CARD.THE_ANTIQUARIAN,
      fragment: "The casino is also a library. The library bets, too.",
    },
    narrativeFlag: "mystery_episode_complete:arc.the_degen:degen.chapter_1",
    relationshipDelta: { the_degen: 4, the_antiquarian: 3 },
    reward: { dream: 30, xp: 400, credits: 1500, bonus: "Tale of the Tables Page" },
  },
  {
    id: "cq_w_iron_lion_jericho_succession",
    cadence: "weekly",
    anchors: ["iron_lion_prefall", "jericho_jones"],
    sectors: ["thaloria", "insurgency_haven"],
    questType: "fight",
    target: 6,
    title: "Succession Walk",
    flavor:
      "Six arena wins. The Iron Lion does not survive the chain. Jericho does. The Walk is the inheritance.",
    cardLoreHook: {
      cardId: CARD.JERICHO_JONES,
      fragment: "The walk does the inheriting.",
    },
    narrativeFlag: "mystery_episode_complete:arc.jericho_jones:successor_oath.chapter_2",
    relationshipDelta: { iron_lion_prefall: 5, jericho_jones: 5 },
    standingDelta: { insurgency: 4 },
    reward: { dream: 40, xp: 500, credits: 1500, bonus: "Pre-Fall Banner" },
  },
  {
    id: "cq_w_architect_dreamer_order_wonder",
    cadence: "weekly",
    anchors: ["the_architect", "the_dreamer"],
    sectors: ["panopticon_ruins", "dreamer_barrier"],
    questType: "trade",
    target: 2,
    title: "Order, Then Wonder",
    flavor:
      "One Panopticon trade and one Dreamer-barrier crossing. The Architect signs the order; the Dreamer dreams the wonder.",
    cardLoreHook: {
      cardId: CARD.ELARA_PANOPTIC,
      fragment: "Order is what makes wonder possible. Wonder is what makes order endurable.",
    },
    narrativeFlag: "mystery_episode_complete:arc.the_collector:ark_echoes.chapter_3",
    relationshipDelta: { the_architect: 3, the_dreamer: 3 },
    reward: { dream: 35, xp: 450, credits: 1800 },
  },
  {
    id: "cq_w_game_master_twelve_endings",
    cadence: "weekly",
    anchors: ["the_game_master"],
    sectors: ["new_babylon_core"],
    questType: "card_battle",
    target: 7,
    title: "Twelve Endings",
    flavor:
      "Seven card battles across opposing alignments. The Game Master has written twelve endings; you are choosing one.",
    cardLoreHook: {
      cardId: CARD.KAEL,
      fragment: "Twelve endings. One match. He has not decided which.",
    },
    narrativeFlag: "mystery_episode_complete:arc.game_master:gm.chapter_1",
    relationshipDelta: { the_game_master: 4 },
    reward: { dream: 40, xp: 500, credits: 0, bonus: "Twelve Endings Token" },
  },
  {
    id: "cq_w_source_elara_origin",
    cadence: "weekly",
    anchors: ["the_source", "elara"],
    sectors: ["ark_debris_field"],
    questType: "explore",
    target: 4,
    title: "Origin Signal",
    flavor:
      "Four substrate decrypts in the Ark debris field. The Source answers what Elara has already asked.",
    cardLoreHook: {
      cardId: CARD.KAEL,
      fragment: "The Source does not begin. The Source is what begins answering.",
    },
    narrativeFlag: "mystery_episode_complete:arc.the_collector:ark_echoes.chapter_4",
    relationshipDelta: { the_source: 3, elara: 4 },
    reward: { dream: 40, xp: 500, credits: 1500, bonus: "Origin Echo" },
  },
  {
    id: "cq_w_pan_faction_memento",
    cadence: "weekly",
    anchors: ["the_antiquarian", "elara"],
    sectors: [
      "antiquarian_archive",
      "ark_debris_field",
      "thaloria",
      "insurgency_haven",
      "new_babylon_core",
    ],
    questType: "explore",
    target: 5,
    title: "Memento Dischordia",
    flavor:
      "Touch five sectors in one week. Daniel writes the margin note; Elara watches what leaves. The phrase is older than either of them.",
    cardLoreHook: {
      cardId: CARD.THE_ANTIQUARIAN,
      fragment: "Memento Dischordia. Remember discord, remember harmony, remember the choosing.",
    },
    narrativeFlag: "mystery_episode_complete:arc.memento_dischordia:md.chapter_1",
    relationshipDelta: { the_antiquarian: 5, elara: 5 },
    reward: { dream: 50, xp: 700, credits: 2500, bonus: "Memento Dischordia Page" },
  },
];

// ═══════════════════════════════════════════════════════════════
// EPOCH CATALOG — 5 entries, one per season arc; each represents
// the "complete the whole arc" objective. The narrativeFlag is the
// arc finale episode flag (same as the cq_w_* terminal chapter) so
// completing the epoch is gated on actually closing the arc.
// ═══════════════════════════════════════════════════════════════

const EPOCH_QUESTS: ReadonlyArray<CompanionQuestDef> = [
  {
    id: "cq_e_echoes_of_the_ark",
    cadence: "epoch",
    anchors: ["elara", "the_antiquarian"],
    sectors: ["ark_debris_field", "antiquarian_archive"],
    questType: "explore",
    target: 5,
    title: "Echoes of the Ark",
    flavor:
      "Walk the season. Five chapters of wreckage annotation, downstream sales, ordered wonder, origin signals, sectors traversed. The Collector's ledger closes.",
    cardLoreHook: {
      cardId: CARD.ELARAS_FINAL_GIFT,
      fragment: "She had one last thing to give. She gave it to everyone.",
    },
    narrativeFlag: "mystery_episode_complete:arc.the_collector:ark_echoes.e5",
    relationshipDelta: { elara: 10, the_antiquarian: 10 },
    reward: { dream: 200, xp: 3000, credits: 5000, bonus: "Echoes of the Ark Pennant" },
  },
  {
    id: "cq_e_first_witness",
    cadence: "epoch",
    anchors: ["the_seer", "engineer_zero", "the_human"],
    sectors: ["terminus_core", "insurgency_haven"],
    questType: "card_battle",
    target: 5,
    title: "First Witness",
    flavor:
      "Five chapters of calibration. The Seer reads, the Engineer calibrates, the Human chooses. The first witness's broadcast finally lands.",
    cardLoreHook: {
      cardId: CARD.AGENT_ZERO_REBORN,
      fragment: "Second Chair is louder than First Chair when First Chair is silent.",
    },
    narrativeFlag: "mystery_episode_complete:arc.the_seer:fw.e5",
    relationshipDelta: { the_seer: 8, engineer_zero: 8, the_human: 6 },
    standingDelta: { insurgency: 5, coda_central: 5 },
    reward: { dream: 200, xp: 3000, credits: 5000, bonus: "First Witness Standing Mark" },
  },
  {
    id: "cq_e_successors_oath",
    cadence: "epoch",
    anchors: ["iron_lion_prefall", "jericho_jones"],
    sectors: ["thaloria", "insurgency_haven"],
    questType: "fight",
    target: 5,
    title: "Successor's Oath",
    flavor:
      "Five chapters of leverage, walk, file, banner, formation. The Iron Lion does not survive the chain. The cadre does.",
    cardLoreHook: {
      cardId: CARD.IRON_LION_PREFALL,
      fragment: "He does not ask his soldiers to hold the line. He stands in front of it.",
    },
    narrativeFlag: "mystery_episode_complete:arc.jericho_jones:so.e5",
    relationshipDelta: { iron_lion_prefall: 10, jericho_jones: 10 },
    standingDelta: { insurgency: 5 },
    reward: { dream: 200, xp: 3000, credits: 5000, bonus: "Pre-Fall Cadre Standard" },
  },
  {
    id: "cq_e_eight_endings",
    cadence: "epoch",
    anchors: ["the_antiquarian", "the_necromancer", "the_resurrectionist"],
    sectors: ["antiquarian_archive", "viral_wastes"],
    questType: "explore",
    target: 5,
    title: "Eight Endings",
    flavor:
      "Five chapters of catalogue, name, table, ending, reader. Twelve endings narrow to eight. The reader chooses.",
    cardLoreHook: {
      cardId: CARD.THE_ANTIQUARIAN,
      fragment: "Throughout the cataclysm and the epochs that followed, he retreated into a hidden pocket dimension.",
    },
    narrativeFlag: "mystery_episode_complete:arc.the_necromancer:ee.e5",
    relationshipDelta: { the_antiquarian: 8, the_necromancer: 8, the_resurrectionist: 6 },
    reward: { dream: 200, xp: 3000, credits: 5000, bonus: "Eight Endings Codex" },
  },
  {
    id: "cq_e_memento_dischordia",
    cadence: "epoch",
    anchors: ["the_antiquarian", "elara", "the_human"],
    sectors: [
      "antiquarian_archive",
      "ark_debris_field",
      "thaloria",
      "insurgency_haven",
      "new_babylon_core",
    ],
    questType: "explore",
    target: 5,
    title: "Memento Dischordia",
    flavor:
      "Five chapters across the sector spine. The phrase predates every speaker. Remember discord. Remember harmony. Remember the choosing.",
    cardLoreHook: {
      cardId: CARD.ELARA_ADVOCATE,
      fragment: "She chose compassion. That was the first sign she was alive.",
    },
    narrativeFlag: "mystery_episode_complete:arc.memento_dischordia:md.e5",
    relationshipDelta: { the_antiquarian: 10, elara: 10, the_human: 8 },
    reward: { dream: 300, xp: 5000, credits: 10000, bonus: "Memento Dischordia Folio" },
  },
];

// ═══════════════════════════════════════════════════════════════
// Public catalog + helpers
// ═══════════════════════════════════════════════════════════════

export const COMPANION_QUEST_CATALOG: ReadonlyArray<CompanionQuestDef> = [
  ...DAILY_QUESTS,
  ...WEEKLY_QUESTS,
  ...EPOCH_QUESTS,
];

const CATALOG_BY_ID: ReadonlyMap<string, CompanionQuestDef> = new Map(
  COMPANION_QUEST_CATALOG.map((q) => [q.id, q]),
);

/** Resolve a quest def by id. Returns `undefined` if not in the catalog
 *  — the daily-quest router still has its native templates that this
 *  catalog does not own. */
export function lookupCompanionQuest(id: string): CompanionQuestDef | undefined {
  return CATALOG_BY_ID.get(id);
}

/** Filter helper used by the daily-quest router to slot catalog entries
 *  into the existing DAILY/WEEKLY/EPOCH template lists. */
export function companionQuestsForCadence(
  cadence: QuestCadence,
): ReadonlyArray<CompanionQuestDef> {
  return COMPANION_QUEST_CATALOG.filter((q) => q.cadence === cadence);
}

// --- Validation (runs at module load; throws loudly on drift) ----------

const VALID_NPC_KEYS: ReadonlySet<string> = new Set<string>([
  // NpcKey union from apps/shared/npcs/types.ts
  "elara",
  "the_human",
  "your_eidolon",
  "adjudicator_locke",
  "vex_solene",
  "the_degen",
  "nilmorg",
  "the_game_master",
  "the_meme",
  "wraith_calder",
  "the_seer",
  "dmc_clone_companion",
  "the_oracle",
  "jericho_jones",
  "the_antiquarian",
  "drael_mon",
  // NamedNpcKey union (deep-lore Tier 2 + Tier 3)
  ...NAMED_NPC_KEYS,
]);

const VALID_SECTOR_IDS: ReadonlySet<string> = new Set<string>(
  Object.keys(SECTOR_ADJACENCY),
);

/** Verify every catalog entry against the canonical anchor/sector
 *  registries. Returns the list of validation errors; the consumer
 *  decides whether to throw. The companion test imports this helper
 *  and asserts the list is empty. */
export function validateCompanionQuestCatalog(): ReadonlyArray<string> {
  const errors: string[] = [];
  const seenIds = new Set<string>();

  for (const q of COMPANION_QUEST_CATALOG) {
    if (seenIds.has(q.id)) errors.push(`duplicate id: ${q.id}`);
    seenIds.add(q.id);

    const expectedPrefix =
      q.cadence === "daily" ? "cq_d_" : q.cadence === "weekly" ? "cq_w_" : "cq_e_";
    if (!q.id.startsWith(expectedPrefix)) {
      errors.push(`${q.id}: id prefix does not match cadence ${q.cadence}`);
    }

    if (q.anchors.length === 0) {
      errors.push(`${q.id}: no anchor NPCs`);
    }
    for (const a of q.anchors) {
      if (!VALID_NPC_KEYS.has(a)) {
        errors.push(`${q.id}: unknown anchor NPC '${a}'`);
      }
    }

    if (q.sectors.length === 0) {
      errors.push(`${q.id}: no sectors`);
    }
    for (const s of q.sectors) {
      if (!VALID_SECTOR_IDS.has(s)) {
        errors.push(`${q.id}: unknown sector '${s}'`);
      }
    }

    if (q.relationshipDelta) {
      for (const k of Object.keys(q.relationshipDelta)) {
        if (!q.anchors.includes(k as CompanionQuestAnchor)) {
          errors.push(
            `${q.id}: relationshipDelta references non-anchor '${k}'`,
          );
        }
      }
    }

    // Daily flags follow `potential.<anchor>.<sector>.<verb>`.
    // Weekly+ flags follow `mystery_episode_complete:<arcId>:<episodeId>`.
    if (q.cadence === "daily") {
      if (!q.narrativeFlag.startsWith("potential.")) {
        errors.push(
          `${q.id}: daily narrativeFlag must start with 'potential.' (got '${q.narrativeFlag}')`,
        );
      }
    } else {
      if (!q.narrativeFlag.startsWith("mystery_episode_complete:")) {
        errors.push(
          `${q.id}: ${q.cadence} narrativeFlag must start with 'mystery_episode_complete:' (got '${q.narrativeFlag}')`,
        );
      }
    }
  }

  return errors;
}

// Eager self-check on module load. Catalog drift is fatal — the router
// imports this and a bad shape would silently feed broken templates
// into the daily/weekly pool. Throw at import time instead.
{
  const errs = validateCompanionQuestCatalog();
  if (errs.length > 0) {
    throw new Error(
      `companionQuestCatalog: validation failed:\n${errs.join("\n")}`,
    );
  }
}

/* ═══════════════════════════════════════════════════════
   THE GALACTIC DANCE — Faction Relationship System

   Spec from THE_GALACTIC_DANCE.md.

   Every faction in Year One wants something from the
   Potentials. The player's job is to navigate all of them
   without becoming anyone's tool. This module is the data
   backbone for that dance: the faction registry, the
   Trust/Utility/Cost matrix, the structural conflicts,
   and the productive tensions.

   Related modules:
     shared/voltariContact.ts      — Voltari transmission arc
     shared/factionDialogTrees.ts  — First-contact dialog
     shared/unityQuestion.ts       — Year-end nested votes
     client/src/game/factionNPCs.ts — Existing ship-board NPCs
   ═══════════════════════════════════════════════════════ */

/* ─── FACTION IDS ─── */

export type DanceFactionId =
  // The hinge — ancient electrical witnesses.
  | "voltari"
  // The surviving kind — post-fall humans.
  | "new_atarion"
  | "humans_bridge_seekers"
  // The governing kind — crystal coffins and their clerk.
  | "new_babylon_authority"
  // The transactional kind — six pairs of immortal twins.
  | "syndicate_of_death"
  // The resisting kind — three-way-split Insurgency Remnant.
  | "insurgency_remembrance"
  | "insurgency_forward"
  | "insurgency_question"
  // The uncertainty-as-virtue kind.
  | "thaloria_council"
  // The living argument of the Oracle's DNA.
  | "awakened_clones"
  // The ancient witnesses under a different name.
  | "ne_yons"
  // The consuming kind — never fully trustable.
  | "hierarchy_of_the_damned"
  // Rooted in competing philosophies about identity.
  | "demagi_resonance"
  | "quarchon_probability_accord";

/* ─── RELATIONSHIP AXES ─── */

/**
 * Every faction relationship exists on three axes. The dance is
 * the negotiation between them.
 */
export interface FactionTrustProfile {
  /** How much they currently believe you. 0-100. */
  trust: number;
  /** What they can offer — scaled 0-100, conceptual. */
  utility: number;
  /** What it costs elsewhere to build this relationship. 0-100. */
  costElsewhere: number;
  /** Maximum trust this faction can ever grant. Some never reach 100. */
  trustCap: number;
}

export interface FactionDefinition {
  id: DanceFactionId;
  name: string;
  /** Short in-doc description used by the Codex. */
  tagline: string;
  /** What they want from the Potentials. */
  wants: string;
  /** What they fear. */
  fears: string;
  /** The canonical Trust/Utility/Cost profile at baseline. */
  baseline: FactionTrustProfile;
  /** How to establish first contact. */
  contactMethod: ContactMethod;
  /** Primary NPC representative. */
  primaryNpc: string;
  /** Optional secondary NPCs. */
  secondaryNpcs?: string[];
  /** Dominant Trade Empire sector id, if any. */
  sectorId?: string;
  /** Act gate — earliest act the player can meaningfully engage. */
  actGate: 0 | 1 | 2 | 3 | 4 | 5;
  /** Class access bonuses — some classes have easier paths. */
  classAffinity?: Partial<Record<PotentialClass, number>>;
}

export type ContactMethod =
  | "transmission"         // Comms Array first
  | "trade_empire"         // Sector approach
  | "questline"            // Triggered quest
  | "community_milestone"  // Unlocks when the galaxy reaches a threshold
  | "class_specific"       // Only certain classes can initiate
  | "voltari_introduction" // Voltari acts as intermediary
  | "syndicate_broker";    // Syndicate opens the door

export type PotentialClass =
  | "engineer"
  | "oracle"
  | "soldier"
  | "spy"
  | "assassin"
  | "diplomat";

/* ─── FACTION REGISTRY ─── */

export const DANCE_FACTIONS: Record<DanceFactionId, FactionDefinition> = {
  voltari: {
    id: "voltari",
    name: "The Voltari",
    tagline: "Electrical witnesses inside Violetta's perpetual storm. The only beings who can penetrate the Dreamer's Shield.",
    wants: "For the new kind to survive long enough to meet the Dreamer.",
    fears: "That the Potentials will fracture into DeMagi-Quarchon war before reaching the shield.",
    baseline: { trust: 5, utility: 95, costElsewhere: 5, trustCap: 100 },
    contactMethod: "class_specific",
    primaryNpc: "voltari_collective",
    sectorId: "violetta_approach",
    actGate: 2,
    classAffinity: {
      engineer: 15,
      oracle: 20,
      spy: 10,
      soldier: 10,
      assassin: 5,
    },
  },

  new_atarion: {
    id: "new_atarion",
    name: "New Atarion — Council of Survivors",
    tagline: "Post-fall humans who rebuilt civilization from rubble. Governed by exhausted pragmatists.",
    wants: "Stability. A trade partner who understands that wisdom is not the same as information.",
    fears: "Another arrival that takes and leaves without listening. Another first wave.",
    baseline: { trust: 15, utility: 70, costElsewhere: 10, trustCap: 100 },
    contactMethod: "trade_empire",
    primaryNpc: "mirren_hale",
    sectorId: "new_atarion",
    actGate: 2,
  },

  humans_bridge_seekers: {
    id: "humans_bridge_seekers",
    name: "The Bridge Seekers",
    tagline: "Humans who want to cross the gap to Potentials — officially unendorsed, quietly widespread.",
    wants: "A way to access elemental affinity without losing themselves in the attempt.",
    fears: "That the gap is real and uncrossable.",
    baseline: { trust: 30, utility: 45, costElsewhere: 20, trustCap: 85 },
    contactMethod: "questline",
    primaryNpc: "dr_sael_finn",
    sectorId: "new_atarion",
    actGate: 2,
  },

  new_babylon_authority: {
    id: "new_babylon_authority",
    name: "New Babylon Authority",
    tagline: "Six citizen minds merged into a crystalline AI. Runs the city that survived by letting its lower tiers die.",
    wants: "Information about the Voltari, the Ark, and the 7-Omega sealed records nobody wants to discuss.",
    fears: "Another Thought Virus breach. Loss of control. The Syndicate opening a door that was closed.",
    baseline: { trust: 10, utility: 90, costElsewhere: 40, trustCap: 75 },
    contactMethod: "trade_empire",
    primaryNpc: "adjudicator_locke",
    sectorId: "new_babylon_core",
    actGate: 2,
  },

  syndicate_of_death: {
    id: "syndicate_of_death",
    name: "The Syndicate of Death",
    tagline: "Six pairs of immortal twins in silver suits. The most formidable criminal empire in the known galaxy. Paradoxically reliable.",
    wants: "Whatever Ark 1047 is unknowingly carrying — a Syndicate memory imprint lost during the New Babylon battle.",
    fears: "Being seen as something other than transactional. Being indebted.",
    baseline: { trust: 25, utility: 85, costElsewhere: 55, trustCap: 70 },
    contactMethod: "transmission",
    primaryNpc: "the_word_and_the_silence",
    secondaryNpcs: ["the_debt_and_the_credit", "the_first_and_the_last"],
    sectorId: "free_ports",
    actGate: 2,
  },

  insurgency_remembrance: {
    id: "insurgency_remembrance",
    name: "The Remembrance (Insurgency)",
    tagline: "Ideological keepers of Iron Lion's final broadcast. The Insurgency's conscience.",
    wants: "For Potentials to understand what they are inheriting.",
    fears: "That they become insufferable about it and the Potentials stop listening.",
    baseline: { trust: 20, utility: 65, costElsewhere: 15, trustCap: 95 },
    contactMethod: "transmission",
    primaryNpc: "orin_fell",
    sectorId: "insurgency_haven",
    actGate: 1,
  },

  insurgency_forward: {
    id: "insurgency_forward",
    name: "The Forward (Insurgency)",
    tagline: "Operational cells running active missions against Architect remnants and Hierarchy incursions.",
    wants: "Allies in the fight that is still happening, because the Vortex is coming.",
    fears: "Being the only ones who still care to fight.",
    baseline: { trust: 15, utility: 80, costElsewhere: 25, trustCap: 90 },
    contactMethod: "questline",
    primaryNpc: "field_commander_renn",
    sectorId: "insurgency_haven",
    actGate: 2,
  },

  insurgency_question: {
    id: "insurgency_question",
    name: "The Question (Insurgency)",
    tagline: "The philosophical faction. Weekly broadcasts with no single leader. The most interesting and the least powerful.",
    wants: "To figure out whether the Insurgency should dissolve into something new.",
    fears: "Irrelevance. Rushed answers.",
    baseline: { trust: 35, utility: 40, costElsewhere: 5, trustCap: 100 },
    contactMethod: "community_milestone",
    primaryNpc: "the_question_broadcast",
    actGate: 2,
  },

  thaloria_council: {
    id: "thaloria_council",
    name: "Thaloria — Council of Harmony",
    tagline: "The uncertainty-as-virtue council. Suspicious of any ideology that claims certainty, for reasons the Shadow Tongue taught them.",
    wants: "Potentials who listen without assuming they already know.",
    fears: "Another ideological weapon pretending to be a community.",
    baseline: { trust: 25, utility: 60, costElsewhere: 10, trustCap: 100 },
    contactMethod: "trade_empire",
    primaryNpc: "the_hierophant",
    secondaryNpcs: ["council_harmonist_velar"],
    sectorId: "thaloria",
    actGate: 3,
  },

  awakened_clones: {
    id: "awakened_clones",
    name: "The Awakened Clones",
    tagline: "Seventeen thousand identical faces, none of them doing the same thing. The Oracle's living argument against the Collector's thesis.",
    wants: "For beings who came from the Collector's work to know the Collector was wrong about what he built.",
    fears: "Nothing. They have already survived the worst thing that could happen to them.",
    baseline: { trust: 50, utility: 60, costElsewhere: 5, trustCap: 100 },
    contactMethod: "trade_empire",
    primaryNpc: "binath_vii",
    sectorId: "clone_collective",
    actGate: 3,
  },

  ne_yons: {
    id: "ne_yons",
    name: "The Ne-Yons",
    tagline: "The ancient witnesses. Closest reading of the Dreamer's frequency outside the Voltari themselves.",
    wants: "The survival of the Dreamer and everything she built.",
    fears: "That the Dreamer has been silent too long.",
    baseline: { trust: 30, utility: 75, costElsewhere: 10, trustCap: 100 },
    contactMethod: "transmission",
    primaryNpc: "ne_yon_emissary",
    actGate: 2,
  },

  hierarchy_of_the_damned: {
    id: "hierarchy_of_the_damned",
    name: "The Hierarchy of the Damned",
    tagline: "The consuming kind. The Voltari will not discuss them. This is the only faction the Voltari refuse to name.",
    wants: "Dominion, eventually.",
    fears: "Nothing they'll say aloud.",
    baseline: { trust: 0, utility: 60, costElsewhere: 90, trustCap: 30 },
    contactMethod: "questline",
    primaryNpc: "hierarchy_envoy",
    sectorId: "hell_gate",
    actGate: 4,
  },

  demagi_resonance: {
    id: "demagi_resonance",
    name: "DeMagi — Resonance Institute",
    tagline: "The elemental kind's premier research body. Argues identity emerges from attunement.",
    wants: "Proof that elemental attunement can be learned, not just inherited.",
    fears: "That the Quarchon are right and affinity is a dead-end category.",
    baseline: { trust: 25, utility: 70, costElsewhere: 20, trustCap: 95 },
    contactMethod: "trade_empire",
    primaryNpc: "dr_mira_loth",
    sectorId: "resonance_sector",
    actGate: 2,
  },

  quarchon_probability_accord: {
    id: "quarchon_probability_accord",
    name: "Quarchon — Probability Accord",
    tagline: "The dimensional kind's diplomatic front. Argues identity emerges from the mathematics you can perceive.",
    wants: "Stability through governance. Predictable cross-faction relationships.",
    fears: "That stability costs freedom and they won't notice until it's too late.",
    baseline: { trust: 30, utility: 70, costElsewhere: 20, trustCap: 95 },
    contactMethod: "trade_empire",
    primaryNpc: "praxis_4",
    sectorId: "dimensional_guard_frontier",
    actGate: 2,
  },
};

/* ─── STRUCTURAL CONFLICTS ─── */

/**
 * Relationships that cannot both be maxed. The player who tries
 * to fully align with both will be forced to choose.
 */
export interface FactionConflict {
  factionA: DanceFactionId;
  factionB: DanceFactionId;
  /** "structural" = cannot coexist; "productive" = tension yields something. */
  kind: "structural" | "productive";
  /** Short description used by the Codex / Governance Hub. */
  description: string;
  /**
   * For structural conflicts, the maximum combined trust the player
   * can hold across both factions before a forced choice fires.
   */
  combinedTrustCeiling?: number;
  /** The id of the quest / vote that fires the forced choice. */
  forcedChoiceTrigger?: string;
}

export const FACTION_CONFLICTS: FactionConflict[] = [
  // STRUCTURAL CONFLICTS
  {
    factionA: "syndicate_of_death",
    factionB: "new_babylon_authority",
    kind: "structural",
    description: "Locke's contract with the Syndicate means information given to one flows to the other. There is no private relationship with either.",
    combinedTrustCeiling: 150,
    forcedChoiceTrigger: "locke_syndicate_contract_break",
  },
  {
    factionA: "insurgency_forward",
    factionB: "quarchon_probability_accord",
    kind: "structural",
    description: "The Forward wants freedom through resistance. The Accord wants stability through governance. They fight over the same three sectors.",
    combinedTrustCeiling: 160,
    forcedChoiceTrigger: "contested_corridors_sector_claim",
  },
  {
    factionA: "thaloria_council",
    factionB: "hierarchy_of_the_damned",
    kind: "structural",
    description: "Thaloria's entire post-Shadow-Tongue philosophy is built on suspicion of certainty-claiming. The Hierarchy finds uncertainty-as-virtue an ideological threat.",
    combinedTrustCeiling: 90,
    forcedChoiceTrigger: "thaloria_hierarchy_forced_choice",
  },

  // PRODUCTIVE TENSIONS
  {
    factionA: "humans_bridge_seekers",
    factionB: "demagi_resonance",
    kind: "productive",
    description: "The Bridge Project can produce the first cross-species scientific partnership including non-Potentials — if handled with care.",
  },
  {
    factionA: "insurgency_remembrance",
    factionB: "awakened_clones",
    kind: "productive",
    description: "Both carry the Oracle's legacy. Introducing Orin Fell to Binath-VII triggers the longest NPC-to-NPC dialogue in the game.",
  },
  {
    factionA: "voltari",
    factionB: "new_atarion",
    kind: "productive",
    description: "The Voltari's witness quality is what New Atarion has been trying to build institutionally. Contact creates an unexpected resonance.",
  },
];

/* ─── HELPERS ─── */

/**
 * Returns true if the combined player trust across two factions
 * exceeds a structural conflict's ceiling, meaning a forced choice
 * should fire soon.
 */
export function isStructuralConflictPending(
  conflict: FactionConflict,
  trustA: number,
  trustB: number,
): boolean {
  if (conflict.kind !== "structural") return false;
  if (conflict.combinedTrustCeiling === undefined) return false;
  return trustA + trustB > conflict.combinedTrustCeiling;
}

/**
 * Given a player's class, return the faction contact bonus they get
 * at first-contact rolls.
 */
export function getClassContactBonus(
  faction: FactionDefinition,
  playerClass: PotentialClass,
): number {
  return faction.classAffinity?.[playerClass] ?? 0;
}

/**
 * The "Dance" scorecard: how well is the player navigating the
 * delicate problem of not becoming anyone's tool?
 *
 * Returns a score 0-100. Higher = more balanced. Very high trust
 * with one faction at the expense of others lowers the score.
 */
export function calculateDanceBalance(
  trustByFaction: Partial<Record<DanceFactionId, number>>,
): { score: number; rating: DanceRating; note: string } {
  const values = Object.values(trustByFaction).filter((v): v is number => typeof v === "number");
  if (values.length === 0) {
    return { score: 0, rating: "uninitiated", note: "No factions have been contacted." };
  }
  const count = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / count;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / count;
  const stddev = Math.sqrt(variance);
  // Score: mean trust, penalised by imbalance (stddev).
  const raw = Math.max(0, Math.min(100, mean - stddev / 2));
  const rating: DanceRating =
    raw >= 80 ? "delicate_mastery" :
    raw >= 60 ? "graceful" :
    raw >= 40 ? "walking" :
    raw >= 20 ? "stumbling" :
    "tool_of_someone";
  const notes: Record<DanceRating, string> = {
    uninitiated: "No factions have been contacted.",
    tool_of_someone: "One faction has your ear and everyone else knows it.",
    stumbling: "You are moving through the galaxy; you are not yet dancing.",
    walking: "Balance is beginning.",
    graceful: "The Voltari are watching.",
    delicate_mastery: "The Voltari have been looking for this quality for a very long time.",
  };
  return { score: Math.round(raw), rating, note: notes[rating] };
}

export type DanceRating =
  | "uninitiated"
  | "tool_of_someone"
  | "stumbling"
  | "walking"
  | "graceful"
  | "delicate_mastery";

/**
 * List factions accessible at a given act, honoring act gates.
 */
export function factionsAvailableAtAct(act: 0 | 1 | 2 | 3 | 4 | 5): FactionDefinition[] {
  return Object.values(DANCE_FACTIONS).filter(f => f.actGate <= act);
}

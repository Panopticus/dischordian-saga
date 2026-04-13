/* Faction Relationship Matrix — trust/utility/cost + conflicts (spec §8) */

export interface FactionRelationship {
  factionId: string;
  trust: "earned_slowly" | "earned_by_action" | "transactional" | "ideology_gated" | "slow_certain" | "never_full" | "fastest" | "race_variable" | "given_once";
  utility: "highest" | "very_high" | "high" | "medium_high" | "medium" | "unique" | "variable" | "ancient_info";
  costToBuild: string;
}

export const FACTION_RELATIONSHIPS: FactionRelationship[] = [
  { factionId: "voltari", trust: "earned_slowly", utility: "highest", costToBuild: "Time + approach method" },
  { factionId: "humans_new_atarion", trust: "earned_by_action", utility: "high", costToBuild: "Patience — no shortcuts" },
  { factionId: "new_babylon", trust: "transactional", utility: "high", costToBuild: "Resources or secrets" },
  { factionId: "insurgency", trust: "ideology_gated", utility: "medium_high", costToBuild: "Accepting their framing" },
  { factionId: "thaloria", trust: "slow_certain", utility: "unique", costToBuild: "Time, no shortcuts (Shadow Tongue intel)" },
  { factionId: "syndicate", trust: "never_full", utility: "very_high", costToBuild: "Moral flexibility" },
  { factionId: "awakened_clones", trust: "fastest", utility: "medium", costToBuild: "Nothing, oddly" },
  { factionId: "demagi_factions", trust: "race_variable", utility: "variable", costToBuild: "Quarchon suspicion" },
  { factionId: "quarchon_factions", trust: "race_variable", utility: "variable", costToBuild: "DeMagi suspicion" },
  { factionId: "neyon_enigma", trust: "given_once", utility: "ancient_info", costToBuild: "Nothing once given; devastating if lost" },
];

/** Structurally incompatible faction pairs — full trust with one blocks full trust with the other. */
export const FACTION_CONFLICTS = [
  { pair: ["syndicate", "new_babylon"], reason: "Locke's contract means information flows both ways. No private relationship with either." },
  { pair: ["insurgency_forward", "quarchon_accord"], reason: "Structurally opposed governance philosophies. Compete for the same 3 sectors." },
  { pair: ["thaloria", "hierarchy"], reason: "Permanent philosophical opposition. Thaloria's post-Shadow-Tongue philosophy defines itself against Hierarchy certainty." },
] as const;

/** Productive tensions — managed well, these produce unique outcomes. */
export const FACTION_PRODUCTIVE_TENSIONS = [
  { pair: ["humans", "potentials"], output: "Bridge Seekers research collaboration — first cross-species scientific partnership including non-Potentials. Unique crafting outcomes." },
  { pair: ["insurgency_remembrance", "awakened_clones"], output: "Orin Fell + Binath-VII dialogue — longest NPC-to-NPC conversation in the game. Reveals the Oracle's true beliefs." },
  { pair: ["voltari", "all"], output: "Voltari Resonance Nodes create shared truth layer. Factions that distrust each other read the same Witness Point and discover they saw the same event differently." },
] as const;

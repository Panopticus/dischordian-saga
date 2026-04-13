/* ═══════════════════════════════════════════════════════
   POTENTIAL FACTIONS

   Four DeMagi and four Quarchon factions, ranging from
   cooperative to extremist. The political landscape that
   runs through every race, class, and element questline.

   Spec references: Part 1 (The Political Landscape),
   Part 6 (The Unification Question), §6.1 (Unity Meter).
   ═══════════════════════════════════════════════════════ */

import type { Species } from "./characterCreationImpact";

/** Narrow species used for Potential factions (Ne-Yon bridges both). */
export type PotentialSpecies = Extract<Species, "demagi" | "quarchon">;

export type PotentialFactionId =
  | "demagi_assembly"
  | "demagi_wardens"
  | "demagi_resonance"
  | "demagi_pureflame"
  | "quarchon_accord"
  | "quarchon_dimguard"
  | "quarchon_realinst"
  | "quarchon_firstpattern";

export interface PotentialFaction {
  id: PotentialFactionId;
  species: PotentialSpecies;
  name: string;
  /** NPC id of the leader (matches the factionNPCs map). */
  leaderNpcId: string;
  leaderName: string;
  /** Home sector id in the galactic map. */
  territorySectorId: string;
  /** Stance toward the opposing species. */
  stance: "cooperative" | "military" | "scientific" | "extremist";
  /** Whether this faction is extremist — i.e. joining it subtracts from Unity. */
  extremist: boolean;
  /** Whether the faction has an explicit cross-species cooperation mandate. */
  cooperative: boolean;
  /** Narrative flag set when the player completes the faction's first chapter. */
  questChapterFlag: string;
  /** One-paragraph manifesto shown on first contact (paraphrased from spec). */
  manifesto: string;
  /** Reputation threshold required before the formal recruitment offer fires. */
  recruitmentThresholdReputation: number;
  /** Whether the faction is publicly visible (hidden factions must be found). */
  publicVisibility: "public" | "hidden";
}

/* ─── DEMAGI FACTIONS (spec §1.2) ─── */

export const DEMAGI_FACTIONS: PotentialFaction[] = [
  {
    id: "demagi_assembly",
    species: "demagi",
    name: "The Elemental Assembly",
    leaderNpcId: "thael_vo",
    leaderName: "Council Speaker Thael-Vo",
    territorySectorId: "free_ports",
    stance: "cooperative",
    extremist: false,
    cooperative: true,
    questChapterFlag: "demagi_assembly_ch1",
    manifesto:
      "Moderate governance, works with Quarchon. Twelve self-sustaining DeMagi colonies, a mutual defense network, a shared research archive, and the beginning of a distributed governance framework. The Assembly does not oppose the Quarchon — it opposes centralized machine authority.",
    recruitmentThresholdReputation: 40,
    publicVisibility: "public",
  },
  {
    id: "demagi_wardens",
    species: "demagi",
    name: "The Warden's Vanguard",
    leaderNpcId: "seris_fen",
    leaderName: "Commander Seris-Fen",
    territorySectorId: "panopticon_ruins",
    stance: "military",
    extremist: false,
    cooperative: false,
    questChapterFlag: "demagi_wardens_ch1",
    manifesto:
      "Aggressive containment of any centralized machine intelligence. The Vanguard believes that organic-heritage Potentials must maintain hard-power parity with Quarchon factions until the Probability Accord publishes verifiable disarmament. They are not cruel. They are cautious.",
    recruitmentThresholdReputation: 55,
    publicVisibility: "public",
  },
  {
    id: "demagi_resonance",
    species: "demagi",
    name: "The Resonance Institute",
    leaderNpcId: "mira_loth",
    leaderName: "Dr. Mira Loth",
    territorySectorId: "research_corridor_beta",
    stance: "scientific",
    extremist: false,
    cooperative: true,
    questChapterFlag: "demagi_resonance_ch1",
    manifesto:
      "Studying elemental affinities as the next organic evolutionary step. Dr. Loth has been in nineteen years of unresolved conversation with her Quarchon counterpart — the Reality Institute's Theorist Praxis-4. Their research keeps almost meeting in the middle. An Engineer Potential could help them finish.",
    recruitmentThresholdReputation: 35,
    publicVisibility: "public",
  },
  {
    id: "demagi_pureflame",
    species: "demagi",
    name: "The Pure Flame",
    leaderNpcId: "arch_burner_vel",
    leaderName: "Arch-Burner Vel",
    territorySectorId: "hidden_pureflame_cell",
    stance: "extremist",
    extremist: true,
    cooperative: false,
    questChapterFlag: "demagi_pureflame_ch1",
    manifesto:
      "Believes the Quarchon are too machine-coded to be trusted with power. Vel's colony Ember IV (46 DeMagi) was destroyed by a Reality Institute probability cascade that the Accord categorized as a 'calculated risk.' Vel is not satisfied with that explanation. Joining the Pure Flame is a -20 Unity Meter contribution — and Vel is not wrong about the grievance.",
    recruitmentThresholdReputation: 80,
    publicVisibility: "hidden",
  },
];

/* ─── QUARCHON FACTIONS (spec §1.2) ─── */

export const QUARCHON_FACTIONS: PotentialFaction[] = [
  {
    id: "quarchon_accord",
    species: "quarchon",
    name: "The Probability Accord",
    leaderNpcId: "architect_prime_zyn7",
    leaderName: "Architect-Prime Zyn-7",
    territorySectorId: "new_babylon_core",
    stance: "cooperative",
    extremist: false,
    cooperative: true,
    questChapterFlag: "quarchon_accord_ch1",
    manifesto:
      "Cooperative governance through consensus probability modeling. Distributed rather than centralized. The Accord is not the Architect's Empire — the distinction is the difference between a city and a prison. It is still the largest Quarchon political structure and its probability models shape every question the community asks.",
    recruitmentThresholdReputation: 40,
    publicVisibility: "public",
  },
  {
    id: "quarchon_dimguard",
    species: "quarchon",
    name: "The Dimensional Guard",
    leaderNpcId: "general_axis9",
    leaderName: "General Axis-9",
    territorySectorId: "frontier_worlds",
    stance: "military",
    extremist: false,
    cooperative: false,
    questChapterFlag: "quarchon_dimguard_ch1",
    manifesto:
      "Security requires Quarchon-led enforcement. The Dimensional Guard patrols contested sectors and runs joint operations with the Warden's Vanguard that their respective superiors don't know about. General Axis-9 is precise, patient, and willing to share classified probability branches with any Oracle who asks the right way.",
    recruitmentThresholdReputation: 55,
    publicVisibility: "public",
  },
  {
    id: "quarchon_realinst",
    species: "quarchon",
    name: "The Reality Institute",
    leaderNpcId: "praxis_4",
    leaderName: "Theorist Praxis-4",
    territorySectorId: "research_corridor_gamma",
    stance: "scientific",
    extremist: false,
    cooperative: true,
    questChapterFlag: "quarchon_realinst_ch1",
    manifesto:
      "Studying dimensional affinities — the Quarchon mirror to the Resonance Institute's elemental research. Praxis-4 has been trying to collaborate with Dr. Loth for nineteen years. An Engineer Potential can be the neutral relay their factions can't publicly authorize.",
    recruitmentThresholdReputation: 35,
    publicVisibility: "public",
  },
  {
    id: "quarchon_firstpattern",
    species: "quarchon",
    name: "The First Pattern",
    leaderNpcId: "architects_echo",
    leaderName: "The Architect's Echo",
    territorySectorId: "hidden_firstpattern_cell",
    stance: "extremist",
    extremist: true,
    cooperative: false,
    questChapterFlag: "quarchon_firstpattern_ch1",
    manifesto:
      "Claims to carry fragments of the Architect's original code. Believes DeMagi elemental magic is statistically unstable and that preemptive containment is mathematically inevitable. Distinguishes itself from the Architect by asking rather than ordering — a distinction The Echo is visibly uncertain about. Joining the First Pattern is a -20 Unity Meter contribution.",
    recruitmentThresholdReputation: 80,
    publicVisibility: "hidden",
  },
];

export const ALL_POTENTIAL_FACTIONS: PotentialFaction[] = [
  ...DEMAGI_FACTIONS,
  ...QUARCHON_FACTIONS,
];

export const POTENTIAL_FACTION_INDEX: Record<PotentialFactionId, PotentialFaction> =
  Object.fromEntries(
    ALL_POTENTIAL_FACTIONS.map((f) => [f.id, f]),
  ) as Record<PotentialFactionId, PotentialFaction>;

/* ═══════════════════════════════════════════════════════
   UNITY METER — Community state machine (spec §6.1)
   ═══════════════════════════════════════════════════════ */

export type UnityPhase =
  | "fracturing"
  | "tense"
  | "contested"
  | "negotiating"
  | "converging"
  | "unified";

/** Poetic display text per phase (spec §6.1). */
export const UNITY_TEXT: Record<UnityPhase, string> = {
  fracturing:
    "Two species remember what they lost. Neither trusts the other to grieve the same way.",
  tense: "The conversation keeps almost starting.",
  contested: "Every room where DeMagi and Quarchon meet is a negotiation.",
  negotiating: "Someone has started listening. Others are learning to follow.",
  converging: "The Potentials are becoming something neither species expected.",
  unified: "THE SECOND COMING SPEAKS WITH ONE VOICE.",
};

/** Percent bands per phase — inclusive of `min`, exclusive of `max`. */
export const UNITY_THRESHOLDS: Record<UnityPhase, { min: number; max: number }> = {
  fracturing: { min: 0, max: 20 },
  tense: { min: 20, max: 40 },
  contested: { min: 40, max: 60 },
  negotiating: { min: 60, max: 80 },
  converging: { min: 80, max: 100 },
  // `unified` is a special state — only reachable by sustained converging
  // plus a community milestone. Expressed here as the upper edge.
  unified: { min: 100, max: 100 },
};

/** Canonical contribution sources (spec §6.2). Keys match ripple sources. */
export type UnityContributionSource =
  | "questline_third_path"
  | "questline_mediation"
  | "questline_cross_faction_research"
  | "questline_dischordia_cross_species_win"
  | "questline_neyon_crossing"
  | "questline_extremist_act"
  | "questline_formal_affiliation"
  | "questline_spy_blown_cover"
  | "questline_vortex_both_species"
  | "origin_processing_horror"
  | "origin_processing_defiant"
  | "origin_processing_curious"
  | "origin_processing_philosophical"
  | "origin_processing_cold"
  | "origin_processing_intelligence"
  | "origin_processing_spy_preempt";

/** Delta per contribution source (spec §6.2). */
export const UNITY_CONTRIBUTIONS: Record<UnityContributionSource, number> = {
  // Core mediation & cooperation
  questline_third_path: 20,
  questline_mediation: 15,
  questline_cross_faction_research: 10,
  questline_dischordia_cross_species_win: 3,
  questline_neyon_crossing: 10,
  questline_vortex_both_species: 50,
  // Penalties
  questline_extremist_act: -20,
  questline_formal_affiliation: -5,
  questline_spy_blown_cover: -15,
  // Origin reveal branches — small positive deltas per spec §0.2
  // (the reveal itself primes the meter toward processing / cooperation)
  origin_processing_horror: 2,
  origin_processing_defiant: 3,
  origin_processing_curious: 2,
  origin_processing_philosophical: 3,
  origin_processing_cold: 1,
  origin_processing_intelligence: 5,
  origin_processing_spy_preempt: 5,
};

/** Returns the phase for a given percent value (0-100). */
export function getUnityPhase(percent: number): UnityPhase {
  const clamped = Math.max(0, Math.min(100, percent));
  if (clamped >= 100) return "unified";
  if (clamped >= 80) return "converging";
  if (clamped >= 60) return "negotiating";
  if (clamped >= 40) return "contested";
  if (clamped >= 20) return "tense";
  return "fracturing";
}

/** Applies a contribution to a current percent, clamped [0,100]. */
export function applyUnityContribution(
  currentPercent: number,
  source: UnityContributionSource,
): number {
  const delta = UNITY_CONTRIBUTIONS[source] ?? 0;
  return Math.max(0, Math.min(100, currentPercent + delta));
}

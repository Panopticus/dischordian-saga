/* ═══════════════════════════════════════════════════════
   NEMESIS ARCHETYPE BEHAVIORS — Phase K4

   Per Phase K plan (§VIII Phase K4): each of the 12
   apprentice archetypes, when worn by a Nemesis, has 5
   behavioral quirks that differentiate the runtime
   experience of fighting them. Without this, every
   Nemesis feels the same — only the title changes.

   The 5 fields per archetype:

     1. planKindPreference — multiplicative weights the
        plan-spawner uses when picking a new plan kind
        for this Nemesis. Witch leans casino_odds_rigging,
        Heretic leans apprentice_breaking_point_whisper,
        etc.

     2. tickCadenceMultiplier — multiplies the per-plan
        defaultTickHours. Sentinel ticks slow (1.4×, plays
        long); Jester ticks fast (0.6×, opportunist).

     3. voiceRegister — the dialog flavor key. Used by
        Phase K5 pair-banks to select line variants.

     4. grudgeAccelerationTrigger — encounter kinds where
        grudge gain DOUBLES for this archetype (their
        signature insult).

     5. recruitAffinityVector — which player-archetypes
        can possibly recruit this Nemesis. Used by Phase
        K8.1 evaluateRecruitEligibility as the
        archetypeCompatibility input. 0-10 scale (10 =
        maximally recruitable by that player archetype).

   This file is the authoring SOURCE of truth. Phase K10.1
   parity check `nemesis.archetype_behavior_coverage`
   verifies all 12 archetypes have entries.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";
import { APPRENTICE_ARCHETYPES } from "./apprentices";
import type { NemesisPlanKind } from "./nemesisPlans";
import type { NemesisEncounterKind } from "./nemesisMemory";
import type { FactionId } from "./factions";
import { FACTION_IDS } from "./factions";

/** Voice-register key. Feeds Phase K5 dialog selection.
 *  Each register implies a tone the line-author writes for. */
export type NemesisVoiceRegister =
  | "cryptic_referential"      // Witch — references the player doesn't have
  | "minimal_present_tense"    // Ghost — never volunteers detail
  | "cross_referencing"        // Scholar — quotes the player back at themselves
  | "debt_language"            // Revenant — "you owe me" framing
  | "craftsman_dismissive"     // Artisan — "you misuse what I made"
  | "vision_certainty"         // Oracle — speaks already-known outcomes
  | "horizon_gesture"          // Wanderer — distance + transit metaphors
  | "self_sacrificing_certainty" // Martyr — "I welcome this" register
  | "sermonizing"              // Heretic — claims the truer cause
  | "barbed_wit"               // Jester — humor weaponized
  | "watchman_formal"          // Sentinel — duty-language, formal
  | "prodigal_returning"       // Prodigal — "I came back to settle this"
  | "tic_laden_propaganda";    // (used as flavor overlay, not standalone)

export interface NemesisArchetypeBehavior {
  archetype: ApprenticeArchetype;
  /** Display title surfaced to the player as
   *  "The {title}-Nemesis". */
  archetypeTitle: string;
  /** Per-plan-kind weight multiplier for the spawner's
   *  RNG (1.0 = neutral; >1 = preferred; <1 = avoided;
   *  0 = never). Plans not listed default to 1.0. */
  planKindPreference: Partial<Record<NemesisPlanKind, number>>;
  /** Multiplies PLAN_KIND_CATALOG.defaultTickHours when
   *  this Nemesis spawns the plan. <1 = ticks faster. */
  tickCadenceMultiplier: number;
  /** Phase K5 dialog selection key. */
  voiceRegister: NemesisVoiceRegister;
  /** Encounter kinds where grudge gain is DOUBLED for
   *  this archetype. */
  grudgeAccelerationTriggers: readonly NemesisEncounterKind[];
  /** Per-player-archetype recruit affinity. 0-10 scale.
   *  10 = maximally recruitable when player trains this
   *  archetype. Phase K8.1 reads this. */
  recruitAffinityVector: Record<ApprenticeArchetype, number>;
  /** A short canonical "signature" line the dialog system
   *  can drop in as a fallback if no pair-bank line
   *  matches. NEVER empty — every Nemesis must be able
   *  to speak. */
  signatureFallbackLine: string;
  /** Per-faction affinity 0-10. Used by the spawn-time
   *  `chooseNemesisFaction` selector to pin the Nemesis
   *  to a living-universe faction whose interests align
   *  with their archetype. Drives K9 NPC commentary
   *  ("the Hierarchy is funding them now") and K5 dialog
   *  ("I do this for the Architect Remnants"). */
  factionAffinityVector: Record<FactionId, number>;
}

/* ═══════════════════════════════════════════════════════
   THE 12 — Archetype-by-archetype
   ═══════════════════════════════════════════════════════ */

/** Build a recruit-affinity vector with a default of 3
 *  (mid-low) and per-archetype overrides. */
function affinity(
  overrides: Partial<Record<ApprenticeArchetype, number>>,
): Record<ApprenticeArchetype, number> {
  const out = {} as Record<ApprenticeArchetype, number>;
  for (const a of APPRENTICE_ARCHETYPES) out[a] = 3;
  for (const [k, v] of Object.entries(overrides)) {
    out[k as ApprenticeArchetype] = v as number;
  }
  return out;
}

/** Build a faction-affinity vector with a default of 4
 *  (mid) and per-faction overrides. Every archetype has
 *  some affinity for every faction — none are pure-neutral
 *  in the living universe. */
function fAffinity(
  overrides: Partial<Record<FactionId, number>>,
): Record<FactionId, number> {
  const out = {} as Record<FactionId, number>;
  for (const f of FACTION_IDS) out[f] = 4;
  for (const [k, v] of Object.entries(overrides)) {
    out[k as FactionId] = v as number;
  }
  return out;
}

export const NEMESIS_ARCHETYPE_BEHAVIORS: Record<
  ApprenticeArchetype,
  NemesisArchetypeBehavior
> = {
  zealot: {
    archetype: "zealot",
    archetypeTitle: "Zealot",
    planKindPreference: {
      hub_smear_campaign: 2.0,
      hub_counter_vote_campaign: 1.5,
      apprentice_breaking_point_whisper: 1.3,
      casino_odds_rigging: 0.4,
    },
    tickCadenceMultiplier: 1.0,
    voiceRegister: "sermonizing",
    grudgeAccelerationTriggers: [
      "mocked_by_player",
      "hub_counter_vote_blocked",
    ],
    recruitAffinityVector: affinity({
      zealot: 7, heretic: 8, martyr: 6, sentinel: 5,
    }),
    signatureFallbackLine:
      "You think you serve. I have served longer, harder, and with cleaner hands.",
    factionAffinityVector: fAffinity({
      hierarchy: 8, new_babylon: 6, dreamers_children: 2,
    }),
  },

  ghost: {
    archetype: "ghost",
    archetypeTitle: "Ghost",
    planKindPreference: {
      casino_tip_jar_lift: 2.5,
      trade_intel_forgery: 1.6,
      hub_smear_campaign: 0.3,
    },
    tickCadenceMultiplier: 0.9,
    voiceRegister: "minimal_present_tense",
    grudgeAccelerationTriggers: [
      "fled_player",
    ],
    recruitAffinityVector: affinity({
      ghost: 9, wanderer: 6, oracle: 5, scholar: 4,
    }),
    signatureFallbackLine: "You see me now. You shouldn't.",
    factionAffinityVector: fAffinity({
      architect_remnants: 7, new_babylon: 7, hierarchy: 5, insurgency: 3,
    }),
  },

  scholar: {
    archetype: "scholar",
    archetypeTitle: "Scholar",
    planKindPreference: {
      trade_intel_forgery: 2.2,
      world_chronicle_edit_request: 2.0,
      hub_smear_campaign: 1.4,
      casino_odds_rigging: 0.6,
    },
    tickCadenceMultiplier: 1.2,
    voiceRegister: "cross_referencing",
    grudgeAccelerationTriggers: [
      "route_sabotage_blocked",
      "hub_counter_vote_blocked",
    ],
    recruitAffinityVector: affinity({
      scholar: 9, oracle: 7, ghost: 5, sentinel: 5,
    }),
    signatureFallbackLine:
      "I have your file. The earlier draft, before you began revising yourself.",
    factionAffinityVector: fAffinity({
      architect_remnants: 9, hierarchy: 7, new_babylon: 5, insurgency: 2,
    }),
  },

  revenant: {
    archetype: "revenant",
    archetypeTitle: "Revenant",
    planKindPreference: {
      trade_faction_rep_theft: 2.0,
      hub_counter_vote_campaign: 1.4,
      apprentice_early_kill: 1.6,
    },
    tickCadenceMultiplier: 1.1,
    voiceRegister: "debt_language",
    grudgeAccelerationTriggers: [
      "killed_by_player",
      "ambush_survived",
    ],
    recruitAffinityVector: affinity({
      revenant: 8, martyr: 6, prodigal: 7, zealot: 4,
    }),
    signatureFallbackLine:
      "You owe me a debt you don't remember incurring. The principal compounds.",
    factionAffinityVector: fAffinity({
      insurgency: 7, hierarchy: 6, new_babylon: 5, dreamers_children: 5,
    }),
  },

  artisan: {
    archetype: "artisan",
    archetypeTitle: "Artisan",
    planKindPreference: {
      trade_route_sabotage: 1.8,
      casino_odds_rigging: 1.4,
      apprentice_trial_corruption: 1.3,
      apprentice_early_kill: 0.4,
    },
    tickCadenceMultiplier: 1.3,
    voiceRegister: "craftsman_dismissive",
    grudgeAccelerationTriggers: [
      "mocked_by_player",
    ],
    recruitAffinityVector: affinity({
      artisan: 9, sentinel: 6, scholar: 5,
    }),
    signatureFallbackLine:
      "You break what I shaped. The break tells me what I should have built instead.",
    factionAffinityVector: fAffinity({
      new_babylon: 8, hierarchy: 6, architect_remnants: 5,
    }),
  },

  oracle: {
    archetype: "oracle",
    archetypeTitle: "Oracle",
    planKindPreference: {
      world_chronicle_edit_request: 2.2,
      hub_smear_campaign: 1.6,
      apprentice_breaking_point_whisper: 1.4,
    },
    tickCadenceMultiplier: 1.1,
    voiceRegister: "vision_certainty",
    grudgeAccelerationTriggers: [
      "ambush_survived",
      "fled_player",
    ],
    recruitAffinityVector: affinity({
      oracle: 9, ghost: 6, scholar: 7, wanderer: 5,
    }),
    signatureFallbackLine:
      "I saw this conversation seven cohorts ago. You said almost the same words.",
    factionAffinityVector: fAffinity({
      dreamers_children: 8, architect_remnants: 6, hierarchy: 5,
    }),
  },

  wanderer: {
    archetype: "wanderer",
    archetypeTitle: "Wanderer",
    planKindPreference: {
      trade_route_sabotage: 2.0,
      trade_intel_forgery: 1.4,
      trade_faction_rep_theft: 1.2,
      apprentice_early_kill: 0.5,
    },
    tickCadenceMultiplier: 0.8,
    voiceRegister: "horizon_gesture",
    grudgeAccelerationTriggers: [
      "route_sabotage_blocked",
    ],
    recruitAffinityVector: affinity({
      wanderer: 9, ghost: 6, prodigal: 7,
    }),
    signatureFallbackLine:
      "Every road I've taken came back through you. I've stopped being surprised.",
    factionAffinityVector: fAffinity({
      insurgency: 6, dreamers_children: 6, new_babylon: 5, hierarchy: 5,
    }),
  },

  martyr: {
    archetype: "martyr",
    archetypeTitle: "Martyr",
    planKindPreference: {
      apprentice_breaking_point_whisper: 2.0,
      apprentice_trial_corruption: 1.6,
      hub_counter_vote_campaign: 1.2,
      casino_odds_rigging: 0.4,
    },
    tickCadenceMultiplier: 1.0,
    voiceRegister: "self_sacrificing_certainty",
    grudgeAccelerationTriggers: [
      "killed_by_player",
    ],
    recruitAffinityVector: affinity({
      martyr: 9, zealot: 7, revenant: 6, sentinel: 5,
    }),
    signatureFallbackLine:
      "I welcome what you bring. I came here knowing it would cost me everything.",
    factionAffinityVector: fAffinity({
      insurgency: 8, dreamers_children: 6, hierarchy: 4,
    }),
  },

  heretic: {
    archetype: "heretic",
    archetypeTitle: "Heretic",
    planKindPreference: {
      apprentice_breaking_point_whisper: 2.4,
      apprentice_trial_corruption: 2.0,
      hub_smear_campaign: 1.8,
      hub_counter_vote_campaign: 1.6,
    },
    tickCadenceMultiplier: 0.9,
    voiceRegister: "sermonizing",
    grudgeAccelerationTriggers: [
      "apprentice_whisper_blocked",
      "hub_counter_vote_blocked",
    ],
    recruitAffinityVector: affinity({
      heretic: 9, zealot: 6, scholar: 5, jester: 6,
    }),
    signatureFallbackLine:
      "Your orthodoxy is my heresy. We could trade and both be right.",
    factionAffinityVector: fAffinity({
      insurgency: 8, dreamers_children: 7, hierarchy: 5, new_babylon: 2,
    }),
  },

  jester: {
    archetype: "jester",
    archetypeTitle: "Jester",
    planKindPreference: {
      casino_tip_jar_lift: 1.8,
      hub_smear_campaign: 1.6,
      apprentice_breaking_point_whisper: 1.2,
      world_chronicle_edit_request: 1.4,
    },
    tickCadenceMultiplier: 0.6,
    voiceRegister: "barbed_wit",
    grudgeAccelerationTriggers: [
      "mocked_by_player",
      "fled_player",
    ],
    recruitAffinityVector: affinity({
      jester: 9, heretic: 6, prodigal: 5, wanderer: 5,
    }),
    signatureFallbackLine:
      "You're funnier when you're losing. Don't deprive me.",
    factionAffinityVector: fAffinity({
      hierarchy: 7, insurgency: 6, new_babylon: 5,
    }),
  },

  sentinel: {
    archetype: "sentinel",
    archetypeTitle: "Sentinel",
    planKindPreference: {
      apprentice_early_kill: 1.8,
      trade_route_sabotage: 1.4,
      hub_counter_vote_campaign: 1.2,
      casino_tip_jar_lift: 0.5,
    },
    tickCadenceMultiplier: 1.4,
    voiceRegister: "watchman_formal",
    grudgeAccelerationTriggers: [
      "killed_by_player",
      "route_sabotage_blocked",
    ],
    recruitAffinityVector: affinity({
      sentinel: 9, zealot: 6, artisan: 6, martyr: 5,
    }),
    signatureFallbackLine:
      "I have stood this watch longer than you have been awake. Pass, or be marked.",
    factionAffinityVector: fAffinity({
      new_babylon: 8, architect_remnants: 7, hierarchy: 5, insurgency: 2,
    }),
  },

  prodigal: {
    archetype: "prodigal",
    archetypeTitle: "Prodigal",
    planKindPreference: {
      apprentice_trial_corruption: 1.8,
      trade_faction_rep_theft: 1.6,
      hub_smear_campaign: 1.4,
      apprentice_early_kill: 1.2,
    },
    tickCadenceMultiplier: 1.0,
    voiceRegister: "prodigal_returning",
    grudgeAccelerationTriggers: [
      "fled_player",
    ],
    recruitAffinityVector: affinity({
      prodigal: 9, wanderer: 7, revenant: 6, jester: 5,
    }),
    signatureFallbackLine:
      "I left. I came back. You're going to find out why, the slow way.",
    factionAffinityVector: fAffinity({
      insurgency: 7, hierarchy: 6, dreamers_children: 5, new_babylon: 4,
    }),
  },
};

/** Lookup helper. Throws on unknown archetype — that's a
 *  programming error caught by the parity check. */
export function getNemesisArchetypeBehavior(
  archetype: ApprenticeArchetype,
): NemesisArchetypeBehavior {
  const b = NEMESIS_ARCHETYPE_BEHAVIORS[archetype];
  if (!b) {
    throw new Error(
      `[nemesisArchetypes] no behavior registered for archetype "${archetype}". ` +
        `All 12 ApprenticeArchetypes must have entries.`,
    );
  }
  return b;
}

/** Apply an archetype's planKindPreference weights on top
 *  of a baseline weight map. Used by the spawner. Defensive
 *  on unknown archetype (returns baseline unchanged). */
export function weightedPlanKindsFor(
  archetype: ApprenticeArchetype,
  baseline: Partial<Record<NemesisPlanKind, number>>,
): Partial<Record<NemesisPlanKind, number>> {
  const behavior = NEMESIS_ARCHETYPE_BEHAVIORS[archetype];
  const prefs = behavior?.planKindPreference ?? {};
  const out: Partial<Record<NemesisPlanKind, number>> = {};
  const keys = new Set<NemesisPlanKind>([
    ...(Object.keys(baseline) as NemesisPlanKind[]),
    ...(Object.keys(prefs) as NemesisPlanKind[]),
  ]);
  for (const k of keys) {
    const base = baseline[k] ?? 1.0;
    const pref = prefs[k] ?? 1.0;
    out[k] = base * pref;
  }
  return out;
}

/** Returns true iff the encounter kind triggers double-
 *  grudge gain for this archetype. */
export function isGrudgeAcceleratorFor(
  archetype: ApprenticeArchetype,
  kind: NemesisEncounterKind,
): boolean {
  return NEMESIS_ARCHETYPE_BEHAVIORS[archetype].grudgeAccelerationTriggers.includes(kind);
}

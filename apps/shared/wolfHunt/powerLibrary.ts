/* ═══════════════════════════════════════════════════════
   WOLF-HUNT — Corrupted-power library

   Five class libraries, one per HeroClass. Each library
   defines the canonical power ids the class's heroes
   can carry in their powerSet. The mission reducer reads
   each power's `severity` to score the engagement step
   and compute Lycos's risk-of-injury per choice.

   New powers can be added freely. Hero dossiers reference
   powers by id — at registry build the index test (added
   in C-pivot.A.11) asserts that every powerSet.id resolves
   here. (The schema cannot enforce cross-registry
   resolution; the test fills that gap.)
   ═══════════════════════════════════════════════════════ */

import type { HeroClass } from "./types/HeroClass";

export interface PowerLibraryEntry {
  id: string;
  category: HeroClass;
  severity: 1 | 2 | 3;
  /** Brief authoring blurb; surfaces in the Antiquarian's tactical notes. */
  blurb: string;
}

const ENGINEER_POWERS: ReadonlyArray<PowerLibraryEntry> = [
  { id: "severance_protocol_refinement", category: "engineer", severity: 3, blurb: "Iterates the Severance against the hunter mid-engagement." },
  { id: "iterative_flay", category: "engineer", severity: 3, blurb: "Revises its own anatomy between strikes to evade neutralisation." },
  { id: "field_redesign", category: "engineer", severity: 2, blurb: "Rebuilds the engagement geometry — favourable cover becomes hostile." },
  { id: "telemetry_swarm", category: "engineer", severity: 2, blurb: "Saturates the field with measuring devices that score the hunter's posture." },
  { id: "trustee_clause_authoring", category: "engineer", severity: 3, blurb: "Drafts binding side-contracts mid-fight; refusal carries penalty." },
  { id: "principal_machinery", category: "engineer", severity: 3, blurb: "Operates a stationary engine of corruption that interest-compounds the encounter." },
  { id: "anniversary_recursion", category: "engineer", severity: 2, blurb: "Repeats the previous year's contract on the current engagement." },
  { id: "fiduciary_lock", category: "engineer", severity: 2, blurb: "Binds the hunter's options to a pre-authored exclusion list." },
  { id: "patch_propagation", category: "engineer", severity: 1, blurb: "Releases corrupted firmware into the engagement's machine adversaries." },
  { id: "tooling_call", category: "engineer", severity: 1, blurb: "Summons a corrupted tool the hunter has touched in a prior contract." },
];

const ORACLE_POWERS: ReadonlyArray<PowerLibraryEntry> = [
  { id: "ledger_sight", category: "oracle", severity: 3, blurb: "Reads every promise the hunter has made aloud, including those still pending." },
  { id: "contract_recall", category: "oracle", severity: 3, blurb: "Recites the hunter's least-favourable past contracts at strike moments." },
  { id: "interest_compounder", category: "oracle", severity: 2, blurb: "Doubles the cost of every choice the hunter takes more than once." },
  { id: "default_reckoning", category: "oracle", severity: 2, blurb: "Forces a settlement on outstanding debts at the engagement's apex." },
  { id: "tidal_prediction", category: "oracle", severity: 3, blurb: "Knows the next four moves; counters them in order." },
  { id: "celestial_indexing", category: "oracle", severity: 3, blurb: "Indexes the engagement against the canonical celestial cycle." },
  { id: "lunatic_compass", category: "oracle", severity: 2, blurb: "Re-orients the engagement's compass toward the corruptor's chosen direction." },
  { id: "phase_displacement", category: "oracle", severity: 2, blurb: "Steps out of the current tempo for a count and returns inside the hunter's guard." },
  { id: "vow_reading", category: "oracle", severity: 1, blurb: "Recites the hunter's vows back to him at unhelpful moments." },
  { id: "shape_of_the_loss", category: "oracle", severity: 1, blurb: "Describes the hunter's eventual loss in advance; some find it demoralising." },
];

const ASSASSIN_POWERS: ReadonlyArray<PowerLibraryEntry> = [
  { id: "soul_taxis", category: "assassin", severity: 3, blurb: "Counts down souls owed in fives before each strike." },
  { id: "harvest_pace", category: "assassin", severity: 3, blurb: "Maintains a rate of slaughter calibrated against the corruptor's quota." },
  { id: "veil_step", category: "assassin", severity: 2, blurb: "Crosses the visibility threshold without disturbing the field." },
  { id: "memorial_taking", category: "assassin", severity: 2, blurb: "Takes the dead's last memory along with the life." },
  { id: "cathedral_resonance", category: "assassin", severity: 3, blurb: "Hums the Cathedral's load-bearing frequency; mid-bar strikes." },
  { id: "blood_lexicon", category: "assassin", severity: 3, blurb: "Speaks the hunter's blood-type back at him as a curse." },
  { id: "vampiric_economy", category: "assassin", severity: 2, blurb: "Heals the wound budget by drinking the wounder's." },
  { id: "exact_quietus", category: "assassin", severity: 2, blurb: "Picks the precise breath in which to administer the death blow." },
  { id: "shadow_weapon", category: "assassin", severity: 1, blurb: "Carries a blade composed of the hunter's own afterimage." },
  { id: "ritual_grace", category: "assassin", severity: 1, blurb: "Performs a brief sacrament before each kill that the corruptor accepts as tithe." },
];

const SOLDIER_POWERS: ReadonlyArray<PowerLibraryEntry> = [
  { id: "unmaking_command", category: "soldier", severity: 3, blurb: "Issues an order in Mol'Garath's authority that the field obeys." },
  { id: "rank_compulsion", category: "soldier", severity: 3, blurb: "Compels lesser corruptees to charge in coordinated lines." },
  { id: "executive_charge", category: "soldier", severity: 2, blurb: "Leads from the front with the CEO's authority cascading down rank." },
  { id: "iron_quartermaster", category: "soldier", severity: 2, blurb: "Re-supplies the engagement from a corrupted depot just out of reach." },
  { id: "seven_dimension_siege", category: "soldier", severity: 3, blurb: "Imposes Riri'Ahlia's siege doctrine on the engagement geometry." },
  { id: "reorganization_doctrine", category: "soldier", severity: 3, blurb: "Reorders the hunter's known formations against him." },
  { id: "attritional_will", category: "soldier", severity: 2, blurb: "Outlasts the hunter through corrupted endurance." },
  { id: "flag_authority", category: "soldier", severity: 2, blurb: "Plants a standard the corrupted cohort regroups around." },
  { id: "uniform_disregard", category: "soldier", severity: 1, blurb: "Refuses to acknowledge non-canonical orders." },
  { id: "garrison_recall", category: "soldier", severity: 1, blurb: "Calls a corrupted reserve unit into the engagement on a delay." },
];

const SPY_POWERS: ReadonlyArray<PowerLibraryEntry> = [
  { id: "whisper_inheritance", category: "spy", severity: 3, blurb: "Inherits every secret the hunter has half-spoken." },
  { id: "thaloria_dialect", category: "spy", severity: 3, blurb: "Conducts the engagement in a language the hunter half-remembers." },
  { id: "patient_subversion", category: "spy", severity: 2, blurb: "Has spent decades preparing this exact engagement." },
  { id: "shadow_tongue_handle", category: "spy", severity: 2, blurb: "Speaks the Shadow Tongue to handle uncorrupted listeners." },
  { id: "cobalt_conversion", category: "spy", severity: 3, blurb: "Syl'Vex's weave runs visibly cobalt under his skin." },
  { id: "mirror_argument", category: "spy", severity: 3, blurb: "Argues the hunter into his opposite without raising the voice." },
  { id: "consent_extraction", category: "spy", severity: 2, blurb: "Extracts agreement from the hunter under reasonable framing." },
  { id: "long_listen", category: "spy", severity: 2, blurb: "Has been listening since before the hunter arrived." },
  { id: "named_signal", category: "spy", severity: 1, blurb: "Knows the hunter's name in a register the hunter has not used since boyhood." },
  { id: "rumor_seed", category: "spy", severity: 1, blurb: "Plants a falsehood about the hunter that returns later as accepted truth." },
];

const ALL_LIBRARIES: Readonly<Record<HeroClass, ReadonlyArray<PowerLibraryEntry>>> = {
  engineer: ENGINEER_POWERS,
  oracle: ORACLE_POWERS,
  assassin: ASSASSIN_POWERS,
  soldier: SOLDIER_POWERS,
  spy: SPY_POWERS,
};

/** Flat lookup by id. Throws if the id does not resolve. */
const BY_ID = new Map<string, PowerLibraryEntry>();
for (const list of Object.values(ALL_LIBRARIES)) {
  for (const entry of list) {
    if (BY_ID.has(entry.id)) {
      throw new Error(`powerLibrary: duplicate power id "${entry.id}"`);
    }
    BY_ID.set(entry.id, entry);
  }
}

export function getPowerLibraryEntry(id: string): PowerLibraryEntry | undefined {
  return BY_ID.get(id);
}

export function getPowersForClass(
  cls: HeroClass,
): ReadonlyArray<PowerLibraryEntry> {
  return ALL_LIBRARIES[cls];
}

export function powerLibraryIds(): ReadonlyArray<string> {
  return Array.from(BY_ID.keys());
}

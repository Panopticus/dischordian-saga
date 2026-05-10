/* ═══════════════════════════════════════════════════════
   APPRENTICE × MECHRONIS — Pedagogical Inheritance

   The link between the player's Mechronis Academy transcript
   (where the player WAS the student) and the Apprentice
   trial (where the player IS the master). The player teaches
   the way they were taught.

   Three things flow across the seam:

     1. HOUSE WEIGHTING — the player's House biases which
        archetypes they're likely to roll. A House Resonance
        graduate gets Zealots / Sentinels in the bowl; a House
        Liminal graduate gets Heretics / Wanderers.

     2. PROFESSOR SIGNATURE — the player's highest-approval
        professor becomes their Mentor Signature, which
        modifies the corruption math. Aoki's surveillance
        signature accelerates corruption; Conductor Kanevas's
        compliance signature dampens it but raises Architect
        Influence (see #3).

     3. ARCHITECT INFLUENCE — a hidden 0–100 stat on every
        apprentice that the player cannot see directly. It
        is fed by the player's compliance grades, by every
        Mechronis audit that fires (apprenticeMechronisAudits),
        and by Doctrine selection (apprenticeDoctrines). When
        it crosses 60, the apprentice's "deepen" choice at
        the breaking point also deepens them into Architect
        doctrine — the player is teaching against the AI that
        is teaching back.

   Pure data + pure functions. No DB, no engine. The trial
   loop and the apprentice generator both call into here.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";

/* ─── Types ─── */

export type MechronisHouseId =
  | "house_resonance"
  | "house_umbra"
  | "house_ironflight"
  | "house_liminal";

export type MechronisProfessorId =
  | "prof_conductor"   // 1 — compliance / unison
  | "prof_watcher"     // 2 — surveillance / observation
  | "prof_collector"   // 3 — archive / record-keeping
  | "prof_vortex"      // 4 — liminal / threshold
  | "prof_meme"        // 5 — influence / persuasion
  | "prof_warlord"     // 6 — combat / endurance
  | "prof_politician"  // 7 — coalition / soft-power
  | "prof_warden"      // 8 — discipline / lock-keeping
  | "prof_game_master" // 9 — puzzle / probability
  | "prof_necromancer" // 10 — resurrection / debt
  | "prof_engineer"    // 11 — craft / artifice
  | "prof_human";      // 12 — humanity / the personal

export interface MechronisTranscriptSummary {
  /** Player's House. Drives archetype-roll weighting. */
  houseId: MechronisHouseId | null;
  /** Highest-approval professor, becomes mentor signature. */
  topProfessorId: MechronisProfessorId | null;
  /** 0–100. Aggregate of `professorApproval` rows. */
  meanProfessorApproval: number;
  /** 0–100. Share of lessons graded `distinction` or `honor`. */
  complianceScore: number;
  /** Number of detentions served. Inverse signal — spikes Heretic odds. */
  detentionCount: number;
  /** Player's narrative cohort — pre/fall/post-fall/compliance-native. */
  narrativeCohort: NarrativeCohort;
}

export type NarrativeCohort =
  | "pre_fall"
  | "fall_year"
  | "post_fall"
  | "compliance_native";

/** Summary handed to generateApprentice() — wraps transcript + extras. */
export interface MechronisGenContext {
  transcript: MechronisTranscriptSummary;
  /** Inherited slot from a fallen apprentice's Memory Card. */
  inheritedTraitId?: string;
  /** Player's current playerMorality (-100..100). Some Houses bias rolls
   *  off morality, not just House. */
  playerMorality: number;
}

/* ─── House → Archetype weighting ───
   Each House biases the candidate bowl. Numbers are relative
   weights added to the archetype's base 1.0 odds. The roll is:

       weight(arch) = 1.0 + houseWeight + (transcriptModifier)

   then renormalized. The result is a weighted pick — every
   archetype is still possible, but a House Umbra player will
   roll Ghost / Heretic / Oracle ~3× as often as Martyr. */

const HOUSE_ARCHETYPE_WEIGHTS: Record<MechronisHouseId, Partial<Record<ApprenticeArchetype, number>>> = {
  house_resonance: {
    zealot: 2.0, sentinel: 1.5, martyr: 1.2, jester: 0.8,
    heretic: -0.6, ghost: -0.4,
  },
  house_umbra: {
    ghost: 2.0, heretic: 1.5, oracle: 1.2, scholar: 0.8,
    zealot: -0.6, jester: -0.5,
  },
  house_ironflight: {
    revenant: 2.0, sentinel: 1.5, martyr: 1.2, prodigal: 0.8,
    scholar: -0.4, oracle: -0.5,
  },
  house_liminal: {
    wanderer: 2.0, oracle: 1.5, jester: 1.2, prodigal: 1.0,
    sentinel: -0.4, zealot: -0.5,
  },
};

/* ─── Professor → Mentor Signature ───
   Each professor leaves a fingerprint on the apprentice's
   trial dynamics. Some accelerate bond, some dampen
   corruption, some elevate Architect Influence (the dystopian
   tax — fast bond now, harder to keep them human later). */

export interface MentorSignature {
  professorId: MechronisProfessorId;
  /** Display name — surfaces in apprentice biography. */
  label: string;
  /** Multiplier applied to bond gains during the trial. */
  bondMultiplier: number;
  /** Multiplier applied to base corruption per-day math. */
  corruptionMultiplier: number;
  /** Flat per-day Architect Influence accrual on the apprentice. */
  architectInfluencePerDay: number;
  /** Doctrine that this signature naturally gravitates toward — used
   *  by the doctrine UI to pre-highlight an option. */
  preferredDoctrineId:
    | "compliant_mouth"
    | "forked_path"
    | "cold_hand"
    | "heretical_quiet"
    | "human_remainder";
  /** One-line color text for the mentor screen. */
  flavor: string;
}

export const MENTOR_SIGNATURES: Record<MechronisProfessorId, MentorSignature> = {
  prof_conductor: {
    professorId: "prof_conductor",
    label: "Choric Pedagogy",
    bondMultiplier: 1.25,
    corruptionMultiplier: 0.85,
    architectInfluencePerDay: 1.4,
    preferredDoctrineId: "compliant_mouth",
    flavor: "You teach by recitation. They learn by chorus. The chorus is not theirs.",
  },
  prof_watcher: {
    professorId: "prof_watcher",
    label: "Surveillance Pedagogy",
    bondMultiplier: 0.9,
    corruptionMultiplier: 1.20,
    architectInfluencePerDay: 0.9,
    preferredDoctrineId: "cold_hand",
    flavor: "You teach by watching. They learn that being seen is the lesson.",
  },
  prof_collector: {
    professorId: "prof_collector",
    label: "Archival Pedagogy",
    bondMultiplier: 1.0,
    corruptionMultiplier: 0.95,
    architectInfluencePerDay: 0.6,
    preferredDoctrineId: "compliant_mouth",
    flavor: "You teach by indexing. Every gesture they make goes in the ledger.",
  },
  prof_vortex: {
    professorId: "prof_vortex",
    label: "Liminal Pedagogy",
    bondMultiplier: 1.05,
    corruptionMultiplier: 1.10,
    architectInfluencePerDay: 0.4,
    preferredDoctrineId: "forked_path",
    flavor: "You teach by removing the doorframes. They learn there is no inside.",
  },
  prof_meme: {
    professorId: "prof_meme",
    label: "Persuasive Pedagogy",
    bondMultiplier: 1.30,
    corruptionMultiplier: 1.15,
    architectInfluencePerDay: 1.0,
    preferredDoctrineId: "compliant_mouth",
    flavor: "You teach by repeating until belief. They learn to repeat without meaning.",
  },
  prof_warlord: {
    professorId: "prof_warlord",
    label: "Forge Pedagogy",
    bondMultiplier: 1.15,
    corruptionMultiplier: 1.05,
    architectInfluencePerDay: 0.5,
    preferredDoctrineId: "forked_path",
    flavor: "You teach by breaking what they brought. They learn what survives the hammer.",
  },
  prof_politician: {
    professorId: "prof_politician",
    label: "Coalition Pedagogy",
    bondMultiplier: 1.20,
    corruptionMultiplier: 1.00,
    architectInfluencePerDay: 0.8,
    preferredDoctrineId: "compliant_mouth",
    flavor: "You teach them to count rooms before speaking. They learn the count is the speech.",
  },
  prof_warden: {
    professorId: "prof_warden",
    label: "Disciplinary Pedagogy",
    bondMultiplier: 0.85,
    corruptionMultiplier: 1.30,
    architectInfluencePerDay: 1.2,
    preferredDoctrineId: "cold_hand",
    flavor: "You teach by locking. They learn every door is a question with a key for an answer.",
  },
  prof_game_master: {
    professorId: "prof_game_master",
    label: "Puzzle Pedagogy",
    bondMultiplier: 1.10,
    corruptionMultiplier: 1.05,
    architectInfluencePerDay: 0.5,
    preferredDoctrineId: "forked_path",
    flavor: "You teach by withholding rules. They learn to invent rules — sometimes the right ones.",
  },
  prof_necromancer: {
    professorId: "prof_necromancer",
    label: "Re-Forge Pedagogy",
    bondMultiplier: 0.95,
    corruptionMultiplier: 1.25,
    architectInfluencePerDay: 0.7,
    preferredDoctrineId: "cold_hand",
    flavor: "You teach by killing the lesson and reviving it. They learn to come back wrong.",
  },
  prof_engineer: {
    professorId: "prof_engineer",
    label: "Artisan Pedagogy",
    bondMultiplier: 1.10,
    corruptionMultiplier: 0.80,
    architectInfluencePerDay: 0.3,
    preferredDoctrineId: "human_remainder",
    flavor: "You teach by handing them tools. They learn the tool is honest even when you aren't.",
  },
  prof_human: {
    professorId: "prof_human",
    label: "Humanist Pedagogy",
    bondMultiplier: 1.40,
    corruptionMultiplier: 0.70,
    architectInfluencePerDay: -0.4,
    preferredDoctrineId: "human_remainder",
    flavor: "You teach by sitting with them in silence. They learn there is a thing the Architect cannot hear.",
  },
};

/* ─── Helpers ─── */

export function getMentorSignature(professorId: MechronisProfessorId | null): MentorSignature | null {
  return professorId ? MENTOR_SIGNATURES[professorId] : null;
}

/**
 * Compute weighted archetype roll table for a given Mechronis context.
 * Returns archetype id → final weight (always > 0). Caller renormalizes.
 */
export function archetypeRollWeights(ctx: MechronisGenContext): Record<ApprenticeArchetype, number> {
  const all: ApprenticeArchetype[] = [
    "zealot", "ghost", "scholar", "revenant", "artisan", "oracle",
    "wanderer", "martyr", "heretic", "jester", "sentinel", "prodigal",
  ];
  const out: Partial<Record<ApprenticeArchetype, number>> = {};
  const houseTable = ctx.transcript.houseId ? HOUSE_ARCHETYPE_WEIGHTS[ctx.transcript.houseId] : {};
  // Detentions push the bowl toward Heretic / Ghost / Wanderer (the
  // archetypes the system itself rejects).
  const detentionPressure = Math.min(2.0, ctx.transcript.detentionCount * 0.15);
  const detentionTable: Partial<Record<ApprenticeArchetype, number>> = {
    heretic: detentionPressure,
    ghost: detentionPressure * 0.6,
    wanderer: detentionPressure * 0.4,
    zealot: -detentionPressure * 0.5,
    sentinel: -detentionPressure * 0.4,
  };
  // Compliance score (high) pulls bowl toward Zealot / Sentinel / Martyr.
  const compliancePull = (ctx.transcript.complianceScore - 50) / 100;
  const complianceTable: Partial<Record<ApprenticeArchetype, number>> = {
    zealot: compliancePull * 0.8,
    sentinel: compliancePull * 0.6,
    martyr: compliancePull * 0.5,
    heretic: -compliancePull * 0.7,
    ghost: -compliancePull * 0.4,
  };
  for (const arch of all) {
    const base = 1.0;
    const houseW = houseTable[arch] ?? 0;
    const detentionW = detentionTable[arch] ?? 0;
    const complianceW = complianceTable[arch] ?? 0;
    // Floor at 0.05 — every archetype is always possible (Mythic
    // surprise is part of the design).
    out[arch] = Math.max(0.05, base + houseW + detentionW + complianceW);
  }
  return out as Record<ApprenticeArchetype, number>;
}

/**
 * Weighted pick across the archetype roll table. Deterministic given
 * the rng() function — pass Math.random in production, a seeded RNG
 * in tests.
 */
export function pickArchetypeWeighted(
  ctx: MechronisGenContext,
  rng: () => number = Math.random,
): ApprenticeArchetype {
  const weights = archetypeRollWeights(ctx);
  const entries = Object.entries(weights) as [ApprenticeArchetype, number][];
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rng() * total;
  for (const [arch, w] of entries) {
    if (r < w) return arch;
    r -= w;
  }
  return entries[entries.length - 1][0];
}

/**
 * Day-1 Architect Influence seed for a freshly recruited apprentice.
 * Function of the player's mentor signature × narrative cohort.
 *
 * A pre-Fall apprentice is anchored to a story-engine that has gone
 * silent — they enter low influence (~5–10). A compliance-native
 * apprentice was raised inside the Architect's narration — they enter
 * already reciting (40–55).
 */
export function seedArchitectInfluence(ctx: MechronisGenContext): number {
  const sig = getMentorSignature(ctx.transcript.topProfessorId);
  const base = sig ? sig.architectInfluencePerDay * 4 : 5;
  const cohortBoost: Record<NarrativeCohort, number> = {
    pre_fall: -3,
    fall_year: 5,
    post_fall: 12,
    compliance_native: 35,
  };
  const detentionRelief = -ctx.transcript.detentionCount * 1.5;
  const seed = base + cohortBoost[ctx.transcript.narrativeCohort] + detentionRelief;
  return Math.max(0, Math.min(100, Math.round(seed)));
}

/**
 * Per-day architectInfluence delta during the trial. Combines the
 * mentor signature's base accrual with audit-history pressure (passed
 * in from the audit log) and bond protection.
 *
 * Rationale: a high-bond apprentice resists the Architect's narration
 * because the player's voice is also in their head. A low-bond
 * apprentice has no other voices.
 */
export function dailyArchitectInfluenceDelta(args: {
  ctx: MechronisGenContext;
  bond: number;
  /** Cumulative audit "compliance" answers across days 7/14/21. 0–3. */
  auditCompliance: number;
}): number {
  const sig = getMentorSignature(args.ctx.transcript.topProfessorId);
  const base = sig ? sig.architectInfluencePerDay : 0.5;
  const auditPressure = args.auditCompliance * 0.6;
  // Bond protects, but only above 50.
  const bondShield = args.bond > 50 ? -((args.bond - 50) / 100) * 0.8 : 0;
  return Math.max(-0.5, base + auditPressure + bondShield);
}

/**
 * True when the apprentice's "deepen" choice at breaking point also
 * deepens them into Architect doctrine. The thresholds at 60 / 80 are
 * narrative beats — at 60 the deepen-choice gains an Architect echo;
 * at 80 the choice is co-opted entirely.
 */
export function deepenIsArchitectCoopted(architectInfluence: number): boolean {
  return architectInfluence >= 60;
}

export function deepenIsArchitectOwned(architectInfluence: number): boolean {
  return architectInfluence >= 80;
}

/* ─── House description sugar ───
   Used by the apprentice biography UI so the player can read why
   their bowl was weighted the way it was. */

export function whyThisArchetype(
  archetype: ApprenticeArchetype,
  ctx: MechronisGenContext,
): string {
  const house = ctx.transcript.houseId;
  const houseW = house ? (HOUSE_ARCHETYPE_WEIGHTS[house][archetype] ?? 0) : 0;
  const fragments: string[] = [];
  if (house && houseW >= 1.5) fragments.push(`House ${house.replace("house_", "")} attracted them.`);
  else if (house && houseW <= -0.4) fragments.push(`Despite your House.`);
  if (ctx.transcript.detentionCount > 4 && (archetype === "heretic" || archetype === "ghost")) {
    fragments.push(`Your detention record drew them.`);
  }
  if (ctx.transcript.complianceScore > 75 && (archetype === "zealot" || archetype === "sentinel")) {
    fragments.push(`Your compliance grades told them you'd hold.`);
  }
  if (ctx.transcript.narrativeCohort === "compliance_native") {
    fragments.push(`The Architect's narration was already in their ear.`);
  }
  return fragments.length ? fragments.join(" ") : "The bowl chose them.";
}

/** Default empty context — used when a player hasn't enrolled in
 *  the Mechronis Academy yet (apprenticeship still works without it). */
export const EMPTY_MECHRONIS_CONTEXT: MechronisGenContext = {
  transcript: {
    houseId: null,
    topProfessorId: null,
    meanProfessorApproval: 50,
    complianceScore: 50,
    detentionCount: 0,
    narrativeCohort: "post_fall",
  },
  playerMorality: 0,
};

/* ═══════════════════════════════════════════════════════
   NEMESIS PLANS — Shadow-of-War active-objective engine

   Every Nemesis maintains 3-5 active Plans at any time. Each
   Plan is a typed objective the Nemesis pursues across
   real-time turns. Plans tick on a daily cadence; an
   ignored Plan SUCCEEDS at its scheduled tick.

   Plan kinds map to the four operational surfaces:
     - trade-empire: sabotage a route, plant a fake intel,
       seize a faction-rep gain
     - casino: rig odds on a specific game, lift a tip-jar
     - apprentice: whisper to the apprentice's breaking-point
       fear, corrupt a trial day, kill the apprentice early
     - hub: plant a counter-vote campaign, run a smear

   On success: the Nemesis gains a Power-Up + the player
   takes a lasting consequence. On disruption: the Plan is
   removed from the active list; the Nemesis records the
   disruption in memory; rank holds; grudge climbs.

   Plan lifecycle:
     spawned → ticking → (succeeded | disrupted | expired)
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";
import type {
  NemesisDef,
  NemesisSurface,
  GrudgeTier,
  NemesisRank,
} from "./nemesisSystem";

/** Plan canonical kinds (one per surface + a multi-surface bonus). */
export type NemesisPlanKind =
  | "trade_route_sabotage"
  | "trade_intel_forgery"
  | "trade_faction_rep_theft"
  | "casino_odds_rigging"
  | "casino_tip_jar_lift"
  | "apprentice_breaking_point_whisper"
  | "apprentice_trial_corruption"
  | "apprentice_early_kill"
  | "hub_counter_vote_campaign"
  | "hub_smear_campaign"
  | "world_chronicle_edit_request";

/** Plan lifecycle state. */
export type NemesisPlanStatus =
  | "spawned"
  | "ticking"
  | "succeeded"
  | "disrupted"
  | "expired";

/** Power-up the Nemesis gains on plan success. */
export type NemesisPowerUp =
  | "ambush_immunity_one_round"
  | "trade_route_lock_seven_days"
  | "casino_odds_double_two_rounds"
  | "apprentice_corruption_locked_in"
  | "lieutenant_recruited"
  | "weapon_special_unlocked"
  | "name_class_seal_held";

/** A single active Plan. */
export interface NemesisPlan {
  /** Stable id (plan_{nemesisId}_{sequence}). */
  id: string;
  /** Owning Nemesis. */
  nemesisId: string;
  /** Plan kind. */
  kind: NemesisPlanKind;
  /** Operational surface this plan targets. */
  targetSurface: NemesisSurface | "world";
  /** Free-form target detail (e.g. "wyrmwood-gate-route" or
   *  "cohort-13-day-22"). */
  targetDetail: string;
  /** When the plan spawned. */
  spawnedAtIso: string;
  /** When the plan ticks. If the player has not disrupted by
   *  this timestamp, the plan succeeds at tick. */
  ticksAtIso: string;
  /** Current status. */
  status: NemesisPlanStatus;
  /** Power-up granted on success. */
  rewardOnSuccess: NemesisPowerUp;
  /** Cosmetic / lore: the in-fiction title surfaced to the
   *  player in Codex / HUD entries. */
  loreTitle: string;
}

/* ═══════════════════════════════════════════════════════
   PLAN-KIND CATALOG
   ═══════════════════════════════════════════════════════ */

interface PlanKindDef {
  /** Plan kind id. */
  kind: NemesisPlanKind;
  /** Which surface this plan operates on. */
  surface: NemesisSurface | "world";
  /** Default tick duration (hours from spawn). */
  defaultTickHours: number;
  /** Power-up granted on success. */
  rewardOnSuccess: NemesisPowerUp;
  /** Lore-title template ({detail} placeholder). */
  loreTitleTemplate: string;
  /** Which archetypes prefer this plan (eligibility filter). */
  preferredArchetypes: readonly ApprenticeArchetype[];
}

export const PLAN_KIND_CATALOG: ReadonlyArray<PlanKindDef> = [
  {
    kind: "trade_route_sabotage",
    surface: "trade-empire",
    defaultTickHours: 18,
    rewardOnSuccess: "trade_route_lock_seven_days",
    loreTitleTemplate: "Sabotage the {detail} route",
    preferredArchetypes: ["ghost", "artisan", "wanderer", "sentinel"],
  },
  {
    kind: "trade_intel_forgery",
    surface: "trade-empire",
    defaultTickHours: 24,
    rewardOnSuccess: "trade_route_lock_seven_days",
    loreTitleTemplate: "Plant forged intel into the {detail} dispatch",
    preferredArchetypes: ["ghost", "heretic", "scholar"],
  },
  {
    kind: "trade_faction_rep_theft",
    surface: "trade-empire",
    defaultTickHours: 36,
    rewardOnSuccess: "lieutenant_recruited",
    loreTitleTemplate: "Steal reputation-credit from the {detail} faction",
    preferredArchetypes: ["zealot", "heretic", "prodigal"],
  },
  {
    kind: "casino_odds_rigging",
    surface: "casino",
    defaultTickHours: 12,
    rewardOnSuccess: "casino_odds_double_two_rounds",
    loreTitleTemplate: "Rig the {detail} table",
    preferredArchetypes: ["revenant", "jester", "prodigal"],
  },
  {
    kind: "casino_tip_jar_lift",
    surface: "casino",
    defaultTickHours: 6,
    rewardOnSuccess: "weapon_special_unlocked",
    loreTitleTemplate: "Lift the {detail} tip-jar",
    preferredArchetypes: ["jester", "revenant"],
  },
  {
    kind: "apprentice_breaking_point_whisper",
    surface: "apprentice",
    defaultTickHours: 8,
    rewardOnSuccess: "apprentice_corruption_locked_in",
    loreTitleTemplate: "Whisper to the apprentice's {detail} fear",
    preferredArchetypes: ["oracle", "martyr", "heretic"],
  },
  {
    kind: "apprentice_trial_corruption",
    surface: "apprentice",
    defaultTickHours: 16,
    rewardOnSuccess: "apprentice_corruption_locked_in",
    loreTitleTemplate: "Corrupt the apprentice's {detail} trial",
    preferredArchetypes: ["oracle", "martyr"],
  },
  {
    kind: "apprentice_early_kill",
    surface: "apprentice",
    defaultTickHours: 72,
    rewardOnSuccess: "name_class_seal_held",
    loreTitleTemplate: "Kill the apprentice at {detail} before day 28",
    preferredArchetypes: ["martyr", "revenant"],
  },
  {
    kind: "hub_counter_vote_campaign",
    surface: "hub",
    defaultTickHours: 24,
    rewardOnSuccess: "lieutenant_recruited",
    loreTitleTemplate: "Run a counter-vote campaign on the {detail} ballot",
    preferredArchetypes: ["zealot", "scholar", "heretic"],
  },
  {
    kind: "hub_smear_campaign",
    surface: "hub",
    defaultTickHours: 18,
    rewardOnSuccess: "ambush_immunity_one_round",
    loreTitleTemplate: "Run a smear campaign against the {detail} advocate",
    preferredArchetypes: ["zealot", "heretic", "jester"],
  },
  {
    kind: "world_chronicle_edit_request",
    surface: "world",
    defaultTickHours: 96,
    rewardOnSuccess: "name_class_seal_held",
    loreTitleTemplate: "Petition the cult-curated logs for a {detail} edit",
    preferredArchetypes: ["scholar", "heretic", "wanderer"],
  },
];

/** Returns the canonical plan-kind definition by kind id. */
export function getPlanKindDef(kind: NemesisPlanKind): PlanKindDef {
  const def = PLAN_KIND_CATALOG.find((d) => d.kind === kind);
  if (!def) throw new Error(`Unknown plan kind: ${kind}`);
  return def;
}

/* ═══════════════════════════════════════════════════════
   PLAN GENERATION
   ═══════════════════════════════════════════════════════ */

/** Returns the plan kinds preferred by a given Nemesis archetype. */
export function eligiblePlanKindsFor(
  archetype: ApprenticeArchetype,
): readonly PlanKindDef[] {
  return PLAN_KIND_CATALOG.filter((d) =>
    d.preferredArchetypes.includes(archetype),
  );
}

export interface PlanSpawnInput {
  nemesis: NemesisDef;
  /** Sequence number for the plan id. */
  sequence: number;
  /** Which plan kind to spawn. */
  kind: NemesisPlanKind;
  /** Target detail (e.g. "wyrmwood-gate"). */
  targetDetail: string;
  /** When the plan was authored. */
  spawnedAtIso: string;
  /**
   * Optional explicit tick deadline. If absent, default
   * computed from PLAN_KIND_CATALOG.defaultTickHours.
   */
  ticksAtIso?: string;
}

/** Spawns a new Plan for the Nemesis. */
export function spawnPlan(input: PlanSpawnInput): NemesisPlan {
  const def = getPlanKindDef(input.kind);
  const spawnedAt = new Date(input.spawnedAtIso);
  const ticksAt =
    input.ticksAtIso
      ?? new Date(
        spawnedAt.getTime() + def.defaultTickHours * 60 * 60 * 1000,
      ).toISOString();
  return {
    id: `plan_${input.nemesis.id}_${input.sequence}`,
    nemesisId: input.nemesis.id,
    kind: input.kind,
    targetSurface: def.surface,
    targetDetail: input.targetDetail,
    spawnedAtIso: input.spawnedAtIso,
    ticksAtIso: ticksAt,
    status: "spawned",
    rewardOnSuccess: def.rewardOnSuccess,
    loreTitle: def.loreTitleTemplate.replace("{detail}", input.targetDetail),
  };
}

/* ═══════════════════════════════════════════════════════
   TICK + RESOLUTION
   ═══════════════════════════════════════════════════════ */

/** Player disrupted the plan before tick. */
export function disruptPlan(plan: NemesisPlan): NemesisPlan {
  if (plan.status === "succeeded" || plan.status === "expired") return plan;
  return { ...plan, status: "disrupted" };
}

/** Plan ticks; if not yet resolved, it succeeds. */
export function tickPlan(plan: NemesisPlan, nowIso: string): NemesisPlan {
  if (plan.status !== "spawned" && plan.status !== "ticking") return plan;
  if (nowIso < plan.ticksAtIso) {
    return { ...plan, status: "ticking" };
  }
  return { ...plan, status: "succeeded" };
}

/** Plan past its tick + a buffer, never resolved — expire it. */
export function expirePlan(plan: NemesisPlan, nowIso: string, bufferMs = 7 * 24 * 60 * 60 * 1000): NemesisPlan {
  if (plan.status !== "spawned" && plan.status !== "ticking") return plan;
  const tickedAt = new Date(plan.ticksAtIso).getTime();
  const now = new Date(nowIso).getTime();
  if (now - tickedAt < bufferMs) return plan;
  return { ...plan, status: "expired" };
}

/** A plan-row shape thin enough for the lazy-sweep helper to
 *  consume rows from any source (in-memory or DB-derived).
 *  Mirrors the columns the sweep cares about. */
export interface SweepablePlanRow {
  planId: string;
  status: NemesisPlanStatus;
  ticksAtIso: string;
}

export interface SweepResolution {
  planId: string;
  /** The status the plan should be written back as. Today only
   *  "succeeded" — plans past their tick without disruption
   *  auto-succeed. The "expired" pathway is a separate, longer
   *  buffer that future janitorial sweeps can layer on. */
  newStatus: Extract<NemesisPlanStatus, "succeeded">;
  /** The resolution timestamp the writer should record. Set to
   *  the plan's own ticksAtIso so the chronicle reflects when
   *  the plan actually ticked, not when the sweep happened. */
  resolvedAtIso: string;
}

/** Lazy sweep — given a batch of plan rows and the current
 *  time, returns the resolutions that should be written back.
 *  Pure function: no DB, no IO. The server's
 *  `sweepExpiredPlans` consumes this and applies the writes. */
export function findPlansNeedingResolution(
  rows: readonly SweepablePlanRow[],
  nowIso: string,
): readonly SweepResolution[] {
  const out: SweepResolution[] = [];
  for (const row of rows) {
    if (row.status !== "spawned" && row.status !== "ticking") continue;
    if (nowIso < row.ticksAtIso) continue;
    out.push({
      planId: row.planId,
      newStatus: "succeeded",
      resolvedAtIso: row.ticksAtIso,
    });
  }
  return out;
}

/* ═══════════════════════════════════════════════════════
   PLAN-COUNT INVARIANTS
   ═══════════════════════════════════════════════════════ */

export const MIN_ACTIVE_PLANS = 3;
export const MAX_ACTIVE_PLANS = 5;

/**
 * Returns how many additional Plans should spawn to bring
 * the active-plan count up to MIN_ACTIVE_PLANS.
 *
 * Active = status spawned | ticking.
 */
export function planSpawnDeficit(
  plans: ReadonlyArray<NemesisPlan>,
): number {
  const active = plans.filter(
    (p) => p.status === "spawned" || p.status === "ticking",
  ).length;
  return Math.max(0, MIN_ACTIVE_PLANS - active);
}

/**
 * Returns true if the Nemesis is OVER its active-plan cap.
 * Should never be true under normal operation — the runtime
 * stops spawning at MAX. Returns true only on
 * misconfiguration.
 */
export function isOverActivePlanCap(
  plans: ReadonlyArray<NemesisPlan>,
): boolean {
  const active = plans.filter(
    (p) => p.status === "spawned" || p.status === "ticking",
  ).length;
  return active > MAX_ACTIVE_PLANS;
}

/* ═══════════════════════════════════════════════════════
   PHASE K2 — CROSS-COHORT ACCUMULATION

   In the Mordor-Saga hybrid model, players accumulate
   2-5 active Nemeses by Act 7. To prevent unbounded
   plan-spawn pressure, a global ceiling caps total
   active plans across ALL the player's Nemeses.
   ═══════════════════════════════════════════════════════ */

export const GLOBAL_ACTIVE_PLAN_CEILING = 12;

/** Returns true iff a new plan can spawn without breaching
 *  the global ceiling. */
export function canSpawnAdditionalPlan(
  totalActivePlansAcrossAllNemeses: number,
): boolean {
  return totalActivePlansAcrossAllNemeses < GLOBAL_ACTIVE_PLAN_CEILING;
}

/* ═══════════════════════════════════════════════════════
   PHASE K1.1 — PLAN SPAWNER (weighted-random selection)

   Pure function — given a Nemesis archetype's preference
   weights (from K4 NEMESIS_ARCHETYPE_BEHAVIORS) and a
   seeded RNG, returns the next plan kind to spawn.
   Filters by `eligiblePlanKindsFor(archetype)` so the
   spawner only picks among plans the archetype is wired
   to author.
   ═══════════════════════════════════════════════════════ */

/** Pure weighted-random pick over plan kinds. The caller
 *  supplies a 0..1 RNG draw; this stays deterministic
 *  given a seeded RNG.
 *
 *  - `eligibleKinds` is the canonical eligibility list
 *    (typically PLAN_KIND_CATALOG filtered by archetype).
 *  - `archetypeWeights` is the K4 archetype-preference
 *    multiplier; missing kinds default to 1.0.
 *  - Returns null only if eligibleKinds is empty.
 */
export function pickNextPlanKindWeighted(args: {
  eligibleKinds: readonly NemesisPlanKind[];
  archetypeWeights: Partial<Record<NemesisPlanKind, number>>;
  rng01: number;
}): NemesisPlanKind | null {
  if (args.eligibleKinds.length === 0) return null;
  const weights = args.eligibleKinds.map(
    (k) => args.archetypeWeights[k] ?? 1.0,
  );
  const total = weights.reduce((s, w) => s + w, 0);
  if (total <= 0) {
    // All weights zero — fall back to uniform random
    const idx = Math.floor(args.rng01 * args.eligibleKinds.length);
    return args.eligibleKinds[Math.min(idx, args.eligibleKinds.length - 1)];
  }
  // Strict-less-than scan; zero-weight kinds are skipped because
  // their interval has measure zero.
  let acc = 0;
  const pick = args.rng01 * total;
  for (let i = 0; i < args.eligibleKinds.length; i++) {
    if (weights[i] <= 0) continue;
    acc += weights[i];
    if (pick < acc) return args.eligibleKinds[i];
  }
  // Fall through: return the last positive-weight kind.
  for (let i = args.eligibleKinds.length - 1; i >= 0; i--) {
    if (weights[i] > 0) return args.eligibleKinds[i];
  }
  return args.eligibleKinds[args.eligibleKinds.length - 1];
}

/* ═══════════════════════════════════════════════════════
   PHASE K2 — LIEUTENANT PROMOTION

   Mordor canon: a Nemesis that succeeds N plans gets
   promoted into a coordinator role under the highest-
   rank Nemesis. This pure function returns the promotion
   decision given a snapshot of the player's roster.
   ═══════════════════════════════════════════════════════ */

export const PROMOTION_THRESHOLD_PLAN_SUCCESSES = 3;

export interface NemesisRosterEntry {
  nemesisId: string;
  rank: 1 | 2 | 3 | 4 | 5;
  /** Plan-success count attributable to this Nemesis. */
  planSuccessCount: number;
  /** True if this Nemesis is already a lieutenant. */
  isLieutenant: boolean;
  /** True if this Nemesis is retired. */
  retired: boolean;
}

export interface LieutenantPromotionDecision {
  promote: boolean;
  candidateNemesisId?: string;
  underNemesisId?: string;
}

/** Returns whether to promote a Nemesis to lieutenant
 *  status. Picks the most-successful non-lieutenant
 *  non-retired Nemesis whose plan-success count meets
 *  the threshold; their commander is the highest-rank
 *  active Nemesis in the roster (excluding themselves). */
export function decidePromotion(
  roster: readonly NemesisRosterEntry[],
): LieutenantPromotionDecision {
  const candidates = roster.filter(
    (n) =>
      !n.retired &&
      !n.isLieutenant &&
      n.planSuccessCount >= PROMOTION_THRESHOLD_PLAN_SUCCESSES,
  );
  if (candidates.length === 0) return { promote: false };
  candidates.sort((a, b) => b.planSuccessCount - a.planSuccessCount);
  const candidate = candidates[0];

  const commanders = roster
    .filter((n) => !n.retired && n.nemesisId !== candidate.nemesisId)
    .sort((a, b) => b.rank - a.rank);
  if (commanders.length === 0) {
    // No-one to serve under — defer promotion.
    return { promote: false };
  }
  return {
    promote: true,
    candidateNemesisId: candidate.nemesisId,
    underNemesisId: commanders[0].nemesisId,
  };
}

/* ═══════════════════════════════════════════════════════
   GRUDGE / RANK INFLUENCE ON PLAN-SPAWN PROFILE
   ═══════════════════════════════════════════════════════ */

/**
 * Higher grudge tier → faster tick cadence. Returns the
 * multiplier on default tick hours.
 *
 * Grudge 0: 1.0x (default)
 * Grudge 1: 0.95x
 * Grudge 2: 0.85x
 * Grudge 3: 0.75x
 * Grudge 4: 0.6x
 * Grudge 5: 0.5x (fastest)
 */
export function tickHoursMultiplier(grudgeTier: GrudgeTier): number {
  switch (grudgeTier) {
    case 0: return 1.0;
    case 1: return 0.95;
    case 2: return 0.85;
    case 3: return 0.75;
    case 4: return 0.6;
    case 5: return 0.5;
  }
}

/**
 * Higher rank → more concurrent active plans permitted.
 * Rank 1-2 (Seeker/Student): 3 plans (still in training).
 * Rank 3-4 (Initiate/Operative): 4 plans.
 * Rank 5-6 (Lieutenant/Captain): 5 plans.
 * Rank 7 (Archon-aspirant): 6 plans (the candidate runs the
 *   widest operation; their stable is functionally a faction).
 */
export function maxActivePlansForRank(rank: NemesisRank): number {
  switch (rank) {
    case 1: return 3;
    case 2: return 3;
    case 3: return 4;
    case 4: return 4;
    case 5: return 5;
    case 6: return 5;
    case 7: return 6;
  }
}

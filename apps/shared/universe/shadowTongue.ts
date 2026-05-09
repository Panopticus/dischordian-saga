// apps/shared/universe/shadowTongue.ts
//
// SHADOW TONGUE — adaptive per-player Loredex redaction (NPC depth #13).
//
// Canon (docs/built/LORE_BIBLE.md): the Shadow Tongue is an in-universe
// editorial force that rewrites the Chronicle and Loredex. It edited
// Marion Kell out for 400 years. It edited the Programmer's true fate
// from official records. It is *still in the walls of this universe;
// it is still rewriting* (questlineThaloria.ts).
//
// The shipping codebase has a singleton apps/shared/shadowTongueEdits.ts
// (room/artifact-scoped active edits) and the global
// `shadow_tongue_state.powerLevel` column. Both are community-wide.
//
// This module adds the personalized layer: every player sees a
// slightly-different Loredex, depending on their faction alignment
// and 7-axis profile. Players championing the Architect's order see
// more redactions on Architect-secret entries; players aligned with
// the Insurgency see fewer of those redactions but more on
// Architect-public entries; players with high curiosity see redaction
// markers ("[redacted]") rather than silent omissions; players with
// high conformity see entries simply edited out without notification.
//
// Pure data + pure functions. Server-side state lives in
// `apps/server/services/shadowTongueRedactionService.ts` (DB writes)
// and the `shadow_tongue_redactions` table (per-player rows). The
// client reads via the trpc surface and gates Loredex rendering on
// the result.

import type { CanonicalFactionId } from "../factionCrosswalk";
import type { FactionId as StandingFactionId } from "../factions";
import type { PlayerAxis, AxisMagnitude } from "../npcs/types";

// --- Redaction state -----------------------------------------------------

/**
 * Per-(player, entry) redaction status. Visible everywhere a Loredex
 * entry would render — bio page, encounter card, "mentioned by"
 * tap-target, etc. The renderer chooses what to show:
 *
 *   - visible       — the entry shows in full
 *   - redacted      — fully hidden; the player sees a "[REDACTED]"
 *                     placeholder (high-curiosity players) or nothing
 *                     at all (high-conformity / low-curiosity players)
 *   - partial       — bio is shown but specific fields (status, era)
 *                     are masked
 *   - contradictory — multiple sources disagree; both versions render
 *                     side-by-side with attributions, like the
 *                     #4 contradictions registry but at the
 *                     information-layer rather than the dialog-layer
 */
export type RedactionState =
  | "visible"
  | "redacted"
  | "partial"
  | "contradictory";

// --- Redaction policy ----------------------------------------------------

/**
 * Per-Loredex-entry redaction policy. Declares the entry's risk
 * profile: which factions the Shadow Tongue protects when redacting
 * this entry, which axis traits in the player accelerate or slow the
 * redaction, and which player actions can break the redaction.
 *
 * Authoring discipline: only entries the lore canonically marks as
 * editable need a policy. Most Loredex entries are unconditionally
 * `visible`; a small set (~20-50) carry policies. Default behavior
 * for an entry without a policy is `visible` for everyone, always.
 */
export interface RedactionPolicy {
  /** Loredex entryId (from apps/client/src/data/loredex-data.json). */
  entryId: string;
  /**
   * Canonical factions the Shadow Tongue protects when redacting this
   * entry. A player who is `champion` of any of these sees fewer
   * redactions; a player who is `enemy` sees more.
   *
   * Crosswalks via apps/shared/factionCrosswalk.ts to the standing
   * registry — only those 5 factions actually have per-player
   * standing rows, so canonical entities outside that set are still
   * declared here for documentation but contribute nothing to the
   * computation today (they will when the standing registry expands).
   */
  protectedFactions: ReadonlyArray<CanonicalFactionId>;
  /**
   * Canonical factions the Shadow Tongue exposes when redacting this
   * entry. A player who is `champion` of any of these sees the entry
   * MORE clearly than baseline (the redaction is being broken by the
   * player's loyalties).
   */
  exposedByFactions: ReadonlyArray<CanonicalFactionId>;
  /**
   * Axis-trait modifiers. Each axis name maps to an effect on the
   * redaction:
   *   - "deepen" — high magnitude on this axis makes the redaction
   *     more aggressive (high conformity → more silent omissions).
   *   - "soften" — high magnitude on this axis surfaces the
   *     redaction marker / partial reveals (high curiosity → see
   *     "[redacted]" rather than silent omissions).
   *   - "expose" — high magnitude on this axis can flip the
   *     entry to `contradictory` state (player has earned both
   *     sides of the dispute via vigilance/wit).
   */
  axisModifiers?: Partial<Record<PlayerAxis, "deepen" | "soften" | "expose">>;
  /**
   * Triggers that can break the redaction outright. When the player
   * fires a trigger, the entry's per-player state flips to `visible`
   * regardless of standing/axis. The reveal is permanent for that
   * player.
   */
  revealableVia?: ReadonlyArray<RevealTrigger>;
  /**
   * Optional contradictory-state declaration. If specified, when the
   * entry would otherwise be `redacted`, the player gets the
   * `contradictory` state instead — surfacing the dispute via the
   * #4 contradictions registry.
   */
  contradictoryWhenRedacted?: { contradictionId: string };
  /**
   * Long-form note for writers. Where the canon attestation lives,
   * what the redaction is hiding, and why the policy is shaped this
   * way.
   */
  note: string;
}

/**
 * Triggers that break a redaction. Each trigger is a synthesized
 * event the rippleEngine fires; the redaction service catches it
 * and marks the entry visible for the firing player.
 */
export type RevealTrigger =
  | { kind: "loredex_citation"; cited_by_npc: string; cite_target: string }
  | { kind: "encounter_card_investigated"; entryId: string }
  | { kind: "antiquarian_research"; archive: string }
  | { kind: "vex_broadcast_received"; broadcast_id: string }
  | { kind: "shadow_tongue_redactions_revealed_min"; n: number }
  | { kind: "narrative_flag_set"; flag: string };

// --- Authored policies ---------------------------------------------------

/**
 * Initial redaction-policy authorings. Bible-grounded — every entry
 * here has an explicit canon attestation in `note`. New policies are
 * additive; the registry has no upper bound.
 *
 * Note: entryIds reference apps/client/src/data/loredex-data.json.
 * The ship-check parity row (TODO) will assert every id resolves.
 */
export const REDACTION_POLICIES: ReadonlyArray<RedactionPolicy> = [
  {
    entryId: "entity_105", // Marion Kell
    protectedFactions: ["architect_order"],
    exposedByFactions: ["insurgency", "antiquarian_circle"],
    axisModifiers: {
      curiosity: "soften",
      vigilance: "expose",
      conformity: "deepen",
    },
    revealableVia: [
      { kind: "encounter_card_investigated", entryId: "entity_105" },
      { kind: "antiquarian_research", archive: "shelf_lower" },
      { kind: "narrative_flag_set", flag: "the_human_attempted_substrate_rescue" },
    ],
    contradictoryWhenRedacted: { contradictionId: "marion_kell_recoverable" },
    note: "Marion Kell — canonically erased from the Chronicle by the Shadow Tongue per Loredex entity_105 status. Bible the_antiquarian §1.4 holds her file on the shelf adjacent to Darren Fessler's. The Inventor restored two of the entries the Shadow Tongue removed (per the antiquarian's mention line). Players who reach Wraith Calder Inheriting band hear his Marion Kell line; combined with the Antiquarian's Shelf-mate-band citation, the player has earned the contradictory state.",
  },
  {
    entryId: "entity_1", // The Programmer / Daniel Cross
    protectedFactions: ["architect_order"],
    exposedByFactions: ["insurgency", "antiquarian_circle"],
    axisModifiers: {
      curiosity: "soften",
      vigilance: "soften",
    },
    revealableVia: [
      { kind: "encounter_card_investigated", entryId: "entity_1" },
      { kind: "antiquarian_research", archive: "cross_references_desk" },
    ],
    contradictoryWhenRedacted: { contradictionId: "the_programmers_fate" },
    note: "The Programmer — Loredex entity_1 status field carries both readings ('Presumed vanished... in truth rescued across time by the Insurgency'). The contradictions registry surfaces three speakers' positions; this redaction policy expresses the same dispute at the information layer. The Architect's records benefit from the redaction; the Insurgency and the Antiquarian Circle (Cross's home) benefit from its breaking.",
  },
  {
    entryId: "entity_5", // The Meme
    protectedFactions: ["architect_order", "panopticon"],
    exposedByFactions: ["insurgency", "dreamer_order"],
    axisModifiers: {
      vigilance: "soften",
      wit: "expose",
      conformity: "deepen",
    },
    revealableVia: [
      { kind: "vex_broadcast_received", broadcast_id: "coda_signal_irregularities" },
      { kind: "narrative_flag_set", flag: "human_opens_meme_case_file" },
    ],
    contradictoryWhenRedacted: { contradictionId: "the_meme_status" },
    note: "The Meme — Loredex entity_5 status reads 'CONTESTED — believed destroyed by the White Oracle'. The Architect's Court has institutional reason to maintain the destroyed framing. The Insurgency's Coda picks up signal irregularities consistent with a broadcast presence. The Dreamer's Children oppose Architect framings on principle.",
  },
  {
    entryId: "entity_18", // The Engineer
    protectedFactions: ["architect_order"],
    exposedByFactions: ["insurgency", "antiquarian_circle"],
    axisModifiers: {
      vigilance: "soften",
      curiosity: "soften",
    },
    revealableVia: [
      { kind: "antiquarian_research", archive: "cross_references_desk" },
      { kind: "vex_broadcast_received", broadcast_id: "coda_engineer_zero_unification" },
    ],
    contradictoryWhenRedacted: { contradictionId: "the_engineer_agent_zero" },
    note: "The Engineer / Agent Zero identity — the Antiquarian preserves two filings; Vex's Coda reconciles to one. The Architect's records benefit from keeping the dual filings (operational ambiguity); the Insurgency benefits from the unified post-rite identity.",
  },
  {
    entryId: "entity_2", // The Architect
    protectedFactions: ["architect_order"],
    exposedByFactions: ["insurgency"],
    axisModifiers: {
      curiosity: "soften",
      conformity: "deepen",
    },
    revealableVia: [
      { kind: "narrative_flag_set", flag: "the_human_intent_disclosure" },
      { kind: "vex_broadcast_received", broadcast_id: "coda_budget_audit" },
    ],
    contradictoryWhenRedacted: { contradictionId: "the_architects_intent" },
    note: "The Architect — the lifeboat-vs-tyranny question (per the_human + Vex contradiction). The Architect's order suppresses the harshest readings of intent; the Insurgency surfaces them. The Twelfth Archon's disclosure (the_human Inheriting reveal) breaks the redaction.",
  },
  {
    entryId: "entity_58", // The Hierophant
    protectedFactions: ["thaloria"],
    exposedByFactions: ["insurgency"],
    axisModifiers: {
      vigilance: "soften",
      vulnerability: "soften",
    },
    revealableVia: [
      { kind: "narrative_flag_set", flag: "wraith_inheriting_band_reached" },
      { kind: "vex_broadcast_received", broadcast_id: "coda_hierophant_interview_variance" },
    ],
    contradictoryWhenRedacted: { contradictionId: "thaloria_revival_purpose" },
    note: "The Hierophant — bible §3.10 covert inheritance layer. The mourning-only reading is the public position; the inheritance-infrastructure reading is reserved for Inheriting band. The contradictory state surfaces three positions (Wraith, Drael'Mon, Vex) when the Shadow Tongue's redaction would otherwise hide the disputes.",
  },
  {
    entryId: "loredex.epoch_one_dmc_contract", // Dead Man's Circuit / DMC contract
    protectedFactions: ["hierarchy_of_damned"],
    exposedByFactions: ["insurgency"],
    axisModifiers: {
      vigilance: "soften",
      mercy: "expose",
    },
    revealableVia: [
      { kind: "narrative_flag_set", flag: "nilmorg_severance_prize_paid" },
    ],
    note: "The Epoch-One DMC Contract — the Hierarchy's institutional record of the Severance protocol. The Hierarchy benefits from keeping the contract terms private; the Insurgency benefits from publishing them. Players with high mercy (who object to the institutional cost of Severance) see the contradictory state when the protocol is invoked.",
  },
  {
    entryId: "entity_50", // The Oracle
    protectedFactions: ["architect_order"],
    exposedByFactions: ["dreamer_order", "antiquarian_circle"],
    axisModifiers: {
      vulnerability: "soften",
      curiosity: "soften",
    },
    revealableVia: [
      { kind: "loredex_citation", cited_by_npc: "the_antiquarian", cite_target: "entity_50" },
      { kind: "encounter_card_investigated", entryId: "entity_50" },
    ],
    note: "The Oracle — three centuries of Architect's Court suppression. The Dreamer's Children naturally expose her by canon; the Antiquarian's upper-shelf entries (three of which she dictated personally per the antiquarian mention line) break the redaction.",
  },
];

// --- Lookup helpers ------------------------------------------------------

/** Map from entryId to policy (for O(1) lookup). */
const POLICY_BY_ENTRY = new Map(
  REDACTION_POLICIES.map(p => [p.entryId, p] as const),
);

export function policyFor(entryId: string): RedactionPolicy | null {
  return POLICY_BY_ENTRY.get(entryId) ?? null;
}

export function entriesWithPolicy(): ReadonlyArray<string> {
  return REDACTION_POLICIES.map(p => p.entryId);
}

// --- Computation ---------------------------------------------------------

/**
 * Inputs to the per-player redaction computation. The service layer
 * gathers these from the player's standing rows, axis profile, and
 * the global Shadow Tongue power level, then calls
 * `computeRedactionState` to decide what the player should see.
 */
export interface RedactionContext {
  /** Player's standing per faction (from factionStandingService). */
  standings: Partial<Record<StandingFactionId, number>>;
  /** Player's axis magnitudes (from citizen-trait subsystem). */
  axes: Partial<Record<PlayerAxis, AxisMagnitude>>;
  /**
   * Global Shadow Tongue power level (0..100) from
   * shadowTongueState.powerLevel. Higher = more aggressive
   * redactions across the board.
   */
  globalPowerLevel: number;
  /**
   * Reveal triggers the player has already fired. The service stores
   * these in shadow_tongue_redactions rows; missing rows = trigger
   * not fired. If the entry's policy lists a fired trigger, the
   * computation short-circuits to `visible`.
   */
  firedTriggers?: ReadonlySet<string>;
}

function magnitudeStrength(magnitude: AxisMagnitude | undefined): number {
  if (!magnitude) return 0;
  switch (magnitude) {
    case "strong_positive":
      return 3;
    case "moderate_positive":
      return 2;
    case "mild_positive":
      return 1;
    case "neutral":
      return 0;
    case "mild_negative":
      return -1;
    case "moderate_negative":
      return -2;
    case "strong_negative":
      return -3;
  }
}

/**
 * Encode a fired trigger into a stable string the computation can
 * match against `RedactionContext.firedTriggers`. Mirrored by the
 * service layer when persisting trigger-fired rows.
 */
export function encodeTriggerKey(trigger: RevealTrigger): string {
  switch (trigger.kind) {
    case "loredex_citation":
      return `lc:${trigger.cited_by_npc}:${trigger.cite_target}`;
    case "encounter_card_investigated":
      return `ec:${trigger.entryId}`;
    case "antiquarian_research":
      return `ar:${trigger.archive}`;
    case "vex_broadcast_received":
      return `vb:${trigger.broadcast_id}`;
    case "shadow_tongue_redactions_revealed_min":
      return `mr:${trigger.n}`;
    case "narrative_flag_set":
      return `nf:${trigger.flag}`;
  }
}

/**
 * The core computation. Given a Loredex entryId and a RedactionContext,
 * decide what the player should see. Pure function — no DB, no clock,
 * no global state.
 *
 * Algorithm:
 *  1. If no policy → `visible` (most entries).
 *  2. If any reveal trigger has fired → `visible`.
 *  3. Compute a redaction-pressure score:
 *       base = globalPowerLevel / 100 (0..1)
 *       +∑ champion-of-protected (×0.3)         → harder to redact
 *       −∑ champion-of-exposed (×0.3)           → easier to redact (i.e. exposed)
 *       +∑ axis modifier "deepen"  × strength × 0.05
 *       −∑ axis modifier "soften"  × strength × 0.05
 *  4. Bucket the score:
 *       ≤ 0.20 → visible
 *       ≤ 0.55 → partial
 *       > 0.55 → redacted (or contradictory if both expose+modifier "expose"
 *                          axis is strong AND the policy has a contradiction)
 */
export function computeRedactionState(
  entryId: string,
  ctx: RedactionContext,
): RedactionState {
  const policy = policyFor(entryId);
  if (!policy) return "visible";

  if (policy.revealableVia && ctx.firedTriggers) {
    for (const trigger of policy.revealableVia) {
      if (ctx.firedTriggers.has(encodeTriggerKey(trigger))) {
        return "visible";
      }
    }
  }

  // Score starts at the community-wide power level.
  let score = (ctx.globalPowerLevel ?? 0) / 100;

  // Faction-standing tilts.
  for (const faction of policy.protectedFactions) {
    const standing = standingForCanonical(ctx.standings, faction);
    if (standing >= 75) score += 0.3;
    else if (standing >= 25) score += 0.1;
    else if (standing <= -75) score -= 0.3;
    else if (standing <= -25) score -= 0.1;
  }
  for (const faction of policy.exposedByFactions) {
    const standing = standingForCanonical(ctx.standings, faction);
    if (standing >= 75) score -= 0.3;
    else if (standing >= 25) score -= 0.1;
    else if (standing <= -75) score += 0.3;
    else if (standing <= -25) score += 0.1;
  }

  // Axis modifiers.
  let exposeAxisStrong = false;
  if (policy.axisModifiers) {
    for (const [axis, modifier] of Object.entries(policy.axisModifiers) as Array<
      [PlayerAxis, "deepen" | "soften" | "expose"]
    >) {
      const strength = magnitudeStrength(ctx.axes[axis]);
      if (modifier === "deepen") score += Math.max(0, strength) * 0.05;
      else if (modifier === "soften") score -= Math.max(0, strength) * 0.05;
      else if (modifier === "expose" && strength >= 2) {
        exposeAxisStrong = true;
        score -= strength * 0.05;
      }
    }
  }

  if (score <= 0.2) return "visible";
  if (score > 0.55) {
    if (exposeAxisStrong && policy.contradictoryWhenRedacted) {
      return "contradictory";
    }
    if (policy.contradictoryWhenRedacted) return "contradictory";
    return "redacted";
  }
  return "partial";
}

/**
 * Pull a player's standing for a canonical faction id. Maps via the
 * standing-registry crosswalk; non-tracked canonical entities (those
 * with `standing: null` in the crosswalk) return 0 (neutral).
 */
function standingForCanonical(
  standings: Partial<Record<StandingFactionId, number>>,
  canonical: CanonicalFactionId,
): number {
  // Inline crosswalk to avoid a circular import — the canonical-id
  // → standing-id map is small.
  const map: Partial<Record<CanonicalFactionId, StandingFactionId>> = {
    architect_order: "architect_remnants",
    dreamer_order: "dreamers_children",
    new_babylon: "new_babylon",
    hierarchy_of_damned: "hierarchy",
    insurgency: "insurgency",
  };
  const standingId = map[canonical];
  if (!standingId) return 0;
  return standings[standingId] ?? 0;
}

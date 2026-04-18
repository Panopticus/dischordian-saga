/* ═══════════════════════════════════════════════════════
   MORALITY / TRUST / ACT VARIANTS — authoring infrastructure

   Tier 4 of the project audit calls for dialog variants
   across rooms, transmissions, and NPC trust thresholds,
   gated by the player's morality score, NPC trust level,
   and current narrative act. The remap / threshold
   infrastructure that feeds this is already shipped:

     - moralityScore in GameContext.state (number; -100..+100)
     - state.companionStats[companionId].trust (0..100)
     - state.narrativeAct (0..7)

   This module is the schema + resolver for the authored
   content that consumes those signals. Writers add entries
   to VARIANT_REGISTRY; runtime code calls resolveVariant
   with the current state snapshot and renders the matching
   text.

   The schema intentionally keeps the fields flat — writers
   should not have to reason about precedence rules. The
   resolver applies a deterministic best-match priority
   (most specific wins), and a test ensures the registry
   never contains an unreachable entry.

   Consumed by:
     - any dialog / transmission / room overlay that wants
       morality/trust/act-aware text
     - moralityTrustActVariants.test.ts
     - docs/design/AUTHORING_MORALITY_VARIANTS.md
   ═══════════════════════════════════════════════════════ */

/** Global morality axis buckets. Matches the existing moralityScore ranges. */
export type MoralityBand = "machine" | "balanced" | "humanity";

/** NPC trust thresholds — coarse buckets that writers find easy to target. */
export type TrustBand = "cold" | "neutral" | "warm" | "confidant";

/** Which narrative act (0-7) the variant targets. `"any"` = act-agnostic. */
export type ActGate = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | "any";

export interface MoralityTrustActVariant {
  /** Globally unique id. Pattern: "{surface}_{descriptor}". */
  id: string;
  /**
   * Which surface this line renders on. Writers use this to group
   * related entries. Consumers filter by surface first, then by gates.
   */
  surface: "room" | "transmission" | "npc_line" | "journal" | "wheel_followup";
  /** Optional surface-specific target id (room id, transmission id, etc.). */
  targetId?: string;
  /** The authored line. Multi-paragraph allowed; UI decides whether to truncate. */
  text: string;
  /** Morality bucket this variant is written for. `"any"` = any morality. */
  morality: MoralityBand | "any";
  /** Trust bucket. `"any"` = no trust gating. */
  trust: TrustBand | "any";
  /** Companion the trust bucket applies to (required if trust !== "any"). */
  trustCompanionId?: string;
  /** Act gate. */
  act: ActGate;
  /**
   * Optional narrative-flag requirements. All listed flags must be true
   * for this variant to resolve; omitted means unrestricted.
   */
  requiredFlags?: readonly string[];
}

export interface VariantResolutionInput {
  moralityScore: number;
  narrativeAct: number;
  trustByCompanion: Readonly<Record<string, number>>;
  flags: ReadonlySet<string>;
}

/** Derive morality band from the raw score. */
export function bandForMorality(score: number): MoralityBand {
  if (score <= -20) return "machine";
  if (score >= 20) return "humanity";
  return "balanced";
}

/** Derive a trust band from a 0..100 trust value. */
export function bandForTrust(trust: number): TrustBand {
  if (trust >= 80) return "confidant";
  if (trust >= 50) return "warm";
  if (trust >= 25) return "neutral";
  return "cold";
}

/**
 * Specificity score — higher wins when multiple variants match.
 * Scoring rewards specificity: bound morality + bound trust + exact act +
 * required flags each count.
 */
function specificityScore(v: MoralityTrustActVariant): number {
  let s = 0;
  if (v.morality !== "any") s += 3;
  if (v.trust !== "any") s += 3;
  if (v.act !== "any") s += 2;
  if (v.requiredFlags && v.requiredFlags.length) s += v.requiredFlags.length;
  return s;
}

/** Returns true iff every gate on `v` matches the input state. */
function gatesMatch(
  v: MoralityTrustActVariant,
  input: VariantResolutionInput,
): boolean {
  if (v.morality !== "any" && bandForMorality(input.moralityScore) !== v.morality) {
    return false;
  }
  if (v.trust !== "any") {
    if (!v.trustCompanionId) return false;
    const trust = input.trustByCompanion[v.trustCompanionId] ?? 0;
    if (bandForTrust(trust) !== v.trust) return false;
  }
  if (v.act !== "any" && input.narrativeAct !== v.act) return false;
  if (v.requiredFlags) {
    for (const f of v.requiredFlags) if (!input.flags.has(f)) return false;
  }
  return true;
}

/**
 * Resolve the best-matching variant for a surface + targetId under the
 * current state. Returns null when nothing matches — callers should
 * fall back to the non-variant default line.
 */
export function resolveVariant(
  registry: readonly MoralityTrustActVariant[],
  surface: MoralityTrustActVariant["surface"],
  targetId: string | undefined,
  input: VariantResolutionInput,
): MoralityTrustActVariant | null {
  const candidates = registry.filter(
    (v) =>
      v.surface === surface &&
      v.targetId === targetId &&
      gatesMatch(v, input),
  );
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => specificityScore(b) - specificityScore(a));
  return candidates[0];
}

/* ─── Seed entries ─────────────────────────────────────
   Writers extend this registry. Two canonical examples are
   included to demonstrate the shape and to exercise the
   resolver in tests. These are intentionally bounded — the
   full Tier 4 authoring pass will add dozens per surface.
   ─────────────────────────────────────────────────────── */

export const VARIANT_REGISTRY: readonly MoralityTrustActVariant[] = [
  {
    id: "comms_array_first_entry_humanity",
    surface: "room",
    targetId: "comms-relay",
    text:
      "Elara exhales. Whatever you are on the way to, you are walking there with her.",
    morality: "humanity",
    trust: "any",
    act: 1,
  },
  {
    id: "comms_array_first_entry_machine",
    surface: "room",
    targetId: "comms-relay",
    text:
      "Elara says nothing. The Array's substrate hum is one semitone off and she is pretending not to notice.",
    morality: "machine",
    trust: "any",
    act: 1,
  },
  {
    id: "human_trust_confidant_act3",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human speaks without the usual pauses. He thinks you are ready. You are not, but you will be, and he will help you be.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 3,
  },
];

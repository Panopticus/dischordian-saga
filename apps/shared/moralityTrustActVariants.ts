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
  /* ── SURFACE: room ─────────────────────────────────── */

  // Comms Array
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
    id: "comms_array_first_entry_balanced",
    surface: "room",
    targetId: "comms-relay",
    text:
      "The Array breathes. Elara waits a polite half-second before speaking. You have not earned a welcome and you have not earned a silence. Both sit on the counter.",
    morality: "balanced",
    trust: "any",
    act: 1,
  },

  // Cryo Bay
  {
    id: "cryo_bay_return_humanity",
    surface: "room",
    targetId: "cryo-bay",
    text:
      "The Bay remembers you warmer than it was when you left it. That is you, not the Bay. Elara does not comment.",
    morality: "humanity",
    trust: "any",
    act: "any",
  },
  {
    id: "cryo_bay_return_machine",
    surface: "room",
    targetId: "cryo-bay",
    text:
      "The Bay is cold. You noticed it on your way in. You notice it again now. The chair where your pod sat is still within reach.",
    morality: "machine",
    trust: "any",
    act: "any",
  },

  // Engineering
  {
    id: "engineering_humanity_act2",
    surface: "room",
    targetId: "engineering",
    text:
      "You touch the console the way the Engineer taught you. Elara watches the way you touch it. She will not say so, but you remind her of him.",
    morality: "humanity",
    trust: "any",
    act: 2,
  },
  {
    id: "engineering_machine_act2",
    surface: "room",
    targetId: "engineering",
    text:
      "You touch the console clean. The console takes the input. Neither of you decorates the moment.",
    morality: "machine",
    trust: "any",
    act: 2,
  },

  // War Room — gated on Act 5 unlock
  {
    id: "war_room_act5_humanity",
    surface: "room",
    targetId: "war-room",
    text:
      "The map glows. You stand in front of it the way a friend stands in front of a door before knocking. Elara notices the hesitation. She does not hurry you.",
    morality: "humanity",
    trust: "any",
    act: 5,
  },
  {
    id: "war_room_act5_machine",
    surface: "room",
    targetId: "war-room",
    text:
      "The map glows. You read the coordinates first. Names come second. The order will matter later.",
    morality: "machine",
    trust: "any",
    act: 5,
  },

  // Mess Hall — gates on the Human being a confidant
  {
    id: "mess_hall_human_confidant",
    surface: "room",
    targetId: "mess-hall",
    text:
      "You sit at a table the Human once sat at, in a body. He does not say so. You know because the table is the one he describes when you ask him where he eats in dreams.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: "any",
  },

  /* ── SURFACE: transmission ─────────────────────────── */

  {
    id: "engineer_fragment_humanity",
    surface: "transmission",
    targetId: "engineer_fragment_1",
    text:
      "The fragment arrives already decoded in your hand — your bridge-language is better than you thought. Elara is quiet, in the way people are quiet around work that has gone right.",
    morality: "humanity",
    trust: "any",
    act: "any",
  },
  {
    id: "engineer_fragment_machine",
    surface: "transmission",
    targetId: "engineer_fragment_1",
    text:
      "The fragment resolves cleanly. The Engineer's logs always resolve cleanly when you are the one decoding them. Note the pattern; the pattern is information.",
    morality: "machine",
    trust: "any",
    act: "any",
  },
  {
    id: "kael_log_first_open",
    surface: "transmission",
    targetId: "kael_log_1",
    text:
      "Kael's log opens with the first sentence he ever recorded. It is exactly the sentence a recruiter would open with. You do not know yet whether that is a comfort or a warning.",
    morality: "any",
    trust: "any",
    act: 3,
    requiredFlags: ["kael_lore_discovered"],
  },
  {
    id: "last_words_echo_light",
    surface: "transmission",
    targetId: "last_words_echo",
    text:
      "The song comes back to you in the key of mercy. You did not choose mercy easily. The song does not pretend you did.",
    morality: "humanity",
    trust: "any",
    act: 5,
    requiredFlags: ["last_words_light_chosen"],
  },
  {
    id: "last_words_echo_dark",
    surface: "transmission",
    targetId: "last_words_echo",
    text:
      "The song comes back to you in the key of honesty. You chose honesty knowing what it would cost someone else. The song does not let you forget the someone.",
    morality: "machine",
    trust: "any",
    act: 5,
    requiredFlags: ["last_words_dark_chosen"],
  },

  /* ── SURFACE: npc_line ─────────────────────────────── */

  // Elara — post-Act 4 outcomes
  {
    id: "elara_humanity_confidant",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara speaks without the softeners. You have earned the directness. She will keep earning it back.",
    morality: "humanity",
    trust: "confidant",
    trustCompanionId: "elara",
    act: "any",
  },
  {
    id: "elara_cold_after_broken_trust",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara's cadence is the ship's cadence. The Senator's cadence is somewhere else in the ship, temporarily unhoused. You know where she filed it.",
    morality: "machine",
    trust: "cold",
    trustCompanionId: "elara",
    act: 4,
    requiredFlags: ["act4_broken_trust"],
  },
  {
    id: "elara_fragile_after_apology",
    surface: "npc_line",
    targetId: "elara_any",
    text:
      "Elara chooses words the way she chose votes in committee — deliberately, with the knowledge that a bad one lasts decades. You hear the deliberation. You hear the repair.",
    morality: "any",
    trust: "neutral",
    trustCompanionId: "elara",
    act: 4,
    requiredFlags: ["act4_fragile_trust"],
  },

  // The Human — confidant line acts as the canonical "shipped" example
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
  {
    id: "human_confidant_post_confession",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human uses his name in a sentence. Not the long one. The old one. It is the first time he has used it out loud since the wall. You mark the hour.",
    morality: "any",
    trust: "confidant",
    trustCompanionId: "the_human",
    act: 6,
    requiredFlags: ["act6_intro_complete"],
  },
  {
    id: "human_cold_after_refused_secrecy",
    surface: "npc_line",
    targetId: "the_human_any",
    text:
      "The Human is polite. The politeness is a kind of grief. He will answer every question. He will not volunteer anything. That is the part that costs him.",
    morality: "any",
    trust: "cold",
    trustCompanionId: "the_human",
    act: 6,
    requiredFlags: ["act6_refused_secrecy"],
  },

  // Locke — Act 5 recruitment warm
  {
    id: "locke_warm_act5",
    surface: "npc_line",
    targetId: "locke_any",
    text:
      "Locke does not look up from the bond ledger. She does not need to. 'Bring me the next one. I'm ready.' The readiness is a compliment.",
    morality: "any",
    trust: "warm",
    trustCompanionId: "locke",
    act: 5,
  },

  // Antiquarian — first journal context
  {
    id: "antiquarian_any_act1",
    surface: "npc_line",
    targetId: "antiquarian_any",
    text:
      "The Antiquarian's goggles are amber at the edge. Reading light. He is reading something he has read before and finding new in it. You know the feeling.",
    morality: "any",
    trust: "any",
    act: 1,
    requiredFlags: ["journal_entry_read_first_time"],
  },

  /* ── SURFACE: journal ──────────────────────────────── */

  {
    id: "journal_first_read_humanity",
    surface: "journal",
    targetId: "first_entry",
    text:
      "The entry ends on an in-breath. The Antiquarian writes like someone who expects to be read aloud. You read it aloud. Elara listens.",
    morality: "humanity",
    trust: "any",
    act: "any",
    requiredFlags: ["journal_entry_read_first_time"],
  },
  {
    id: "journal_first_read_machine",
    surface: "journal",
    targetId: "first_entry",
    text:
      "The entry is well-structured. Observation, citation, implication. The Antiquarian is an engineer of prose. You respect the schema without deciding how you feel about the schema.",
    morality: "machine",
    trust: "any",
    act: "any",
    requiredFlags: ["journal_entry_read_first_time"],
  },
  {
    id: "journal_morality_turning_point",
    surface: "journal",
    targetId: "morality_turning_point",
    text:
      "The journal auto-stamps this entry without a prompt. The Antiquarian is paying attention to your arc and he is writing a sentence about it that you will read later. The sentence is short and it does not editorialise.",
    morality: "any",
    trust: "any",
    act: "any",
    requiredFlags: ["first_costly_morality_choice"],
  },

  /* ── SURFACE: wheel_followup ───────────────────────── */

  {
    id: "wheel_followup_act1_told_elara",
    surface: "wheel_followup",
    targetId: "act1_told_elara",
    text:
      "You told her. She lodged the telling. The lodging costs her a kind of solitude she did not know she had. She does not mourn it — she files it.",
    morality: "humanity",
    trust: "any",
    act: 1,
    requiredFlags: ["act1_told_elara"],
  },
  {
    id: "wheel_followup_act1_kept_secret",
    surface: "wheel_followup",
    targetId: "act1_kept_secret",
    text:
      "You kept it. The keeping is its own kind of weight. Caelum notices the weight redistribute across your shoulders. He does not comment. He has carried the same weight for fifteen thousand years.",
    morality: "balanced",
    trust: "any",
    act: 1,
    requiredFlags: ["act1_kept_secret"],
  },
  {
    id: "wheel_followup_act3_transparent",
    surface: "wheel_followup",
    targetId: "act3_transparent",
    text:
      "The transparency cost you nothing and won you several days of interior quiet. That is the discount for the honest option. It does not last forever. You will pay later. The paying will be easier for having been early.",
    morality: "humanity",
    trust: "any",
    act: 3,
    requiredFlags: ["act3_transparent"],
  },
  {
    id: "wheel_followup_act3_full_secret",
    surface: "wheel_followup",
    targetId: "act3_full_secret",
    text:
      "The secret is yours now. Yours and the wall's. Caelum welcomes you to the tenancy without ceremony. The tenancy has ceremonies. You will learn them in the order you are ready for them.",
    morality: "machine",
    trust: "any",
    act: 3,
    requiredFlags: ["act3_full_secret"],
  },
];

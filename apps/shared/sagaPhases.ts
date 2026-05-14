/* ═══════════════════════════════════════════════════════
   SAGA PHASES — the player's path, beat by beat

   Maps the canonical 14-phase saga spine (per
   /root/.claude/plans/do-a-walkthrough-analysis-spicy-marble.md
   §V.3) to existing episode flags + the runtime
   `narrativeAct` integer.

   The saga's existing act-completion gates
   (apps/shared/act{2,3,4,5,6,7}CompletionGate.ts) advance
   `narrativeAct` from 1 → 7 across the player's playthrough.
   This module adds the FINER-GRAINED phase resolution on top of
   that — within each act, specific cinematic / episode flags
   subdivide the act into canonical phases.

   The Hub UI, the Codex's progress surface, the Mystery Engine
   catalog (apps/shared/mysteryEngineCanon.ts), the
   Order-of-the-Dreamer ladder display, and any "what should
   the player do next" surface reads from this module.

   Design principles:
     - READ-ONLY. The phase tracker DERIVES from existing flags +
       narrativeAct. It does NOT advance phases on its own; the
       canonical act-completion gates own that responsibility.
     - NO FABRICATED FLAGS. Every flag this module reads from is
       cited to an existing gate or episode-mystery file. If a
       phase's canonical trigger flag is not yet shipped, the
       phase is registered as `triggerFlag: null` and falls back
       to the act-range gate.
     - PURE FUNCTIONS. No state mutation; pass the current state
       in, get the resolved phase out.

   Canonical 14-phase spine (per plan §V.3):
     Phase 0:  Prelude / cold-open (before Act 1)
     Phase 1:  Awakening (Act 1 opening)
     Phase 2:  Fall of the First Wave (Act 1 mid)
     Phase 3:  The Source descended (Act 2 opening)
     Phase 4:  Templum Veritus (Act 2 main)
     Phase 5:  Collector Freed (Act 3 opening)
     Phase 6:  Wyrmwood + Hierarchy breach (Act 3 late)
     Phase 7:  Memento Dischordia cliffhanger (Act 4)
     Phase 8:  Theft of All Time (Act 5 opening)
     Phase 9:  Authority Hack (Act 5 main)
     Phase 10: Civil War + CADES M7 (Act 6)
     Phase 11: Agent Zero Death Reveal (Act 6 climax)
     Phase 12: Baron's Time Heist (Act 7 opening)
     Phase 13: War-Choice (Act 7 climax)
     Phase 14: Servant Hero Academy Era (post-Fall pivot)
   ═══════════════════════════════════════════════════════ */

/** The 14 canonical saga phases. */
export type SagaPhase =
  | 0  // Prelude / cold-open
  | 1  // Awakening
  | 2  // Fall of the First Wave
  | 3  // The Source descended
  | 4  // Templum Veritus
  | 5  // Collector Freed
  | 6  // Wyrmwood + Hierarchy breach
  | 7  // Memento Dischordia cliffhanger
  | 8  // Theft of All Time
  | 9  // Authority Hack
  | 10 // Civil War + CADES M7
  | 11 // Agent Zero Death Reveal
  | 12 // Baron's Time Heist
  | 13 // War-Choice
  | 14; // Servant Hero Academy Era (post-Fall)

/**
 * Minimal state shape for phase resolution. The runtime passes
 * the player's narrativeAct + their flag map. Callers in the Hub /
 * Codex / saga-walkthrough surfaces wire this up to their state.
 */
export interface SagaPhaseInput {
  /** Runtime narrativeAct (canonical 1-7; 0 = pre-game; 8+ = post-Fall). */
  narrativeAct: number;
  /** Player-state flags (the same shape used by act-completion gates). */
  flags: Readonly<Record<string, boolean>>;
}

/** A canonical phase definition. */
export interface SagaPhaseDefinition {
  /** The phase number 0-14. */
  phase: SagaPhase;
  /** Display name for the phase. */
  title: string;
  /** Brief premise — what happens in this phase. */
  premise: string;
  /**
   * The narrativeAct range that anchors this phase. Phases within
   * the same act are further distinguished by triggerFlag.
   */
  actRange: { min: number; max: number };
  /**
   * Specific cinematic / episode / cutscene flag that, when set,
   * advances the player INTO this phase (within the act-range).
   * `null` when the phase is purely act-range-defined (no
   * sub-act granularity).
   */
  triggerFlag: string | null;
  /** Canonical reference for the phase's saga beat. */
  loreSource: string;
}

/* ═══════════════════════════════════════════════════════
   THE 14-PHASE CATALOG
   ═══════════════════════════════════════════════════════ */

export const SAGA_PHASES: readonly SagaPhaseDefinition[] = [
  {
    phase: 0,
    title: "Prelude / Cold-Open",
    premise:
      "The player awakens. The Inception Ark's emergency recording " +
      "plays — Cross / Programmer's voice as the Antiquarian. " +
      "Character creation. Project Celebration (the Architect's " +
      "hidden testing ground per LORE_BIBLE.md:410). Mechronis " +
      "Academy guild selection. The first Hub vote — Engage " +
      "Defensive Protocols → Heart-of-Time vessel cutscene → " +
      "Human's 'didn't happen last time' voice.",
    actRange: { min: 0, max: 0 },
    triggerFlag: null,
    loreSource: "Plan §V.1 + apps/shared/preludeSequence.ts",
  },
  {
    phase: 1,
    title: "Awakening",
    premise:
      "Act 1 opens. The Engineer's Bench surfaces. First TCG " +
      "matches. Tower Defense waves 1-3. First Mystery Engine " +
      "arcs unlock as the player progresses past act_1_start.",
    actRange: { min: 1, max: 1 },
    triggerFlag: "act_1_started",
    loreSource: "Plan §V.3 + apps/shared/act1Opponents.ts",
  },
  {
    phase: 2,
    title: "Fall of the First Wave",
    premise:
      "Engineer Eps 1-4 unfold (holo_wake_the_bench → " +
      "holo_line_they_crossed). S1 Eps 3-5 cinematics. The first " +
      "wave's catastrophe is recorded. Act 1 progresses to " +
      "completion.",
    actRange: { min: 1, max: 1 },
    triggerFlag: "holo_line_they_crossed",
    loreSource: "Plan §V.3 (canon-verified rebuild)",
  },
  {
    phase: 3,
    title: "The Source descended",
    premise:
      "Act 2 opens. Engineer Eps 5-6 (holo_agent_zero_dispatched, " +
      "holo_which_ark). S1 Eps 6-7. The Engineer dies. The Source " +
      "(Kael Reborn — spoiler-protected) is approached.",
    actRange: { min: 2, max: 2 },
    triggerFlag: "act_2_started",
    loreSource: "Plan §V.3 (canon-verified rebuild)",
  },
  {
    phase: 4,
    title: "Templum Veritus + the Oracle",
    premise:
      "Oracle Eps 1-2 (oracle_vision_first_sight, " +
      "oracle_vision_ancient_prophecies). Templum Veritus's " +
      "crystal-harmonic vaccination canon surfaces. The Heirophant " +
      "is introduced.",
    actRange: { min: 2, max: 2 },
    triggerFlag: "oracle_vision_first_sight",
    loreSource: "Plan §V.3 (canon-verified rebuild)",
  },
  {
    phase: 5,
    title: "Collector freed",
    premise:
      "Act 3 opens. S1 Ep 10 cinematic. The helmet trap; the " +
      "Collector escapes. The Collector's Arena Tier 1 unlocks. " +
      "Eyes / Locke video lands (post-dispatch_F7_final_first_read). " +
      "Oracle Eps 3-4.",
    actRange: { min: 3, max: 3 },
    triggerFlag: "act_3_started",
    loreSource: "Plan §V.3 (canon-verified rebuild)",
  },
  {
    phase: 6,
    title: "Wyrmwood + Hierarchy breach",
    premise:
      "S1 Eps 11-13. The Wyrmwood barrier shatters. The Hierarchy " +
      "of the Damned begin reaching through the Advocate's broken " +
      "seal. Oracle Ep 5. Two-Oracles-One-Pattern Codex unlock.",
    actRange: { min: 3, max: 3 },
    triggerFlag: "wyrmwood_barrier_shattered",
    loreSource: "Plan §V.3 (canon-verified rebuild)",
  },
  {
    phase: 7,
    title: "Memento Dischordia cliffhanger",
    premise:
      "Act 4. S1 Eps 14-16. Oracle Ep 6 (Shadow Tongue summoning). " +
      "Prisoner cinematic. The Side-Choice vote (Architect / " +
      "Hierarchy / Source / Independence — winner deferred to S2 " +
      "Ep 2.1, canonically Potentials' independence per plan §V.3).",
    actRange: { min: 4, max: 4 },
    triggerFlag: "act_4_started",
    loreSource: "Plan §V.3 (canon-verified rebuild)",
  },
  {
    phase: 8,
    title: "Theft of All Time",
    premise:
      "Act 5 opens. S2 Ep 2.1 — the Heart of Time becomes the " +
      "player's vessel (canonically the Degen's vessel — see " +
      "apps/shared/neYonCanon.ts the_degen entry). Politician's " +
      "97th re-election broadcast. S2 Eps 2.2-2.4. CADES FPS " +
      "M1-M5.",
    actRange: { min: 5, max: 5 },
    triggerFlag: "act_5_started",
    loreSource: "Plan §V.3 (canon-verified rebuild)",
  },
  {
    phase: 9,
    title: "Authority Hack",
    premise:
      "S2 Eps 2.5-2.7. The Authority's biohorror-six-construct is " +
      "investigated. One of the Six Sins is freed (Hacking Reality " +
      "episode). CADES M6 — Agent Zero (Vex Solène) recruitment.",
    actRange: { min: 5, max: 5 },
    triggerFlag: "cades_m6_complete",
    loreSource: "Plan §V.3 (canon-verified rebuild)",
  },
  {
    phase: 10,
    title: "Civil War + CADES M7",
    premise:
      "Act 6 opens. S2 Eps 2.8-2.10. CADES M7 — Iron Lion's Last " +
      "Stand on Veridian VI. Tower Defense Wave 10 — Kael Fragment " +
      "unlock. Source = Kael keystone reveal lands.",
    actRange: { min: 6, max: 6 },
    triggerFlag: "act_6_started",
    loreSource: "Plan §V.3 + apps/shared/act6CompletionGate.ts",
  },
  {
    phase: 11,
    title: "Agent Zero Death Reveal",
    premise:
      "S2 Ep 2.11 — the saga's highest-payoff Hub moment. Vex " +
      "Solène's identity-collapse reveal: Engineer Zero, Agent " +
      "Zero, The Eyes of Reality, Maestro of The Coda — ONE " +
      "character carrying the Engineer's intellect and the " +
      "Warlord's nano-swarm in one body (Mystery Engine arc " +
      "mystery.vex_solene resolves here).",
    actRange: { min: 6, max: 6 },
    triggerFlag: "vex_solene_identity_revealed",
    loreSource: "Plan §V.3 + apps/shared/mysteryEngineCanon.ts arc.vex_solene",
  },
  {
    phase: 12,
    title: "Baron's Time Heist",
    premise:
      "Act 7 opens. S2 Ep 2.12 — the Baron's time-heist backstory. " +
      "Akai Shi → Red Death arc resolves (her killing of the " +
      "Necromancer). Wraith Calder's Mystery Engine arc reaches " +
      "E5 (Herald's Vigil).",
    actRange: { min: 7, max: 7 },
    triggerFlag: "act_7_started",
    loreSource: "Plan §V.3 (canon-verified rebuild)",
  },
  {
    phase: 13,
    title: "War-Choice (the catastrophic vote)",
    premise:
      "S2 Eps 2.13-2.14. The Inventor dies 'messy.' The Judge " +
      "dies charging the Architect. The Painter is killed again " +
      "(the Architect's resurrection-then-second-death). The " +
      "catastrophic War-Choice vote (War / Peace / Time / " +
      "Sacrifice). The Fall of Reality completes; nanobot plague " +
      "consumes reality; loop closes to S1 Ep 1.1's recording.",
    actRange: { min: 7, max: 7 },
    triggerFlag: "war_choice_vote_cast",
    loreSource: "Plan §V.3 (canon-verified rebuild)",
  },
  {
    phase: 14,
    title: "Servant Hero Academy Era",
    premise:
      "Post-Fall pivot. Lions International Convention onboarding. " +
      "The DGRS Lions Club mechanics unlock (apps/shared/" +
      "lionsClub.ts — $35 base + up to $65 prorated + $25 LCIF " +
      "honor donation). Order of the Dreamer 10-tier ladder " +
      "begins (apps/shared/dreamerOrder.ts). The Real-World " +
      "Chronicle Codex sub-section becomes active.",
    actRange: { min: 8, max: 99 },
    triggerFlag: "servant_hero_academy_onboarded",
    loreSource: "Plan §V.4 + apps/shared/lionsClub.ts + apps/shared/dreamerOrder.ts",
  },
] as const satisfies readonly SagaPhaseDefinition[];

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

/** Look up a phase definition by phase number. */
export function getSagaPhaseDefinition(
  phase: SagaPhase,
): SagaPhaseDefinition {
  const entry = SAGA_PHASES.find((p) => p.phase === phase);
  if (!entry) {
    // Type system should prevent this; defensive throw for any-cast callers.
    throw new Error(`Unknown saga phase: ${phase}`);
  }
  return entry;
}

/**
 * Resolves the player's current canonical saga phase from their
 * state. Returns the HIGHEST phase whose conditions are met.
 *
 * Phases resolve in two passes:
 *   1. Filter to phases whose actRange contains narrativeAct.
 *   2. Of those, return the highest-numbered phase whose
 *      triggerFlag is set (or whose triggerFlag is null = pure
 *      act-range phase).
 *
 * Pure function. No state mutation.
 */
export function resolveCurrentSagaPhase(input: SagaPhaseInput): SagaPhase {
  const { narrativeAct, flags } = input;

  // Special case: post-Fall era (narrativeAct >= 8 OR explicit
  // SHA onboarding flag).
  if (narrativeAct >= 8 || flags["servant_hero_academy_onboarded"]) {
    return 14;
  }

  // Walk phases in descending order; return first match.
  for (let i = SAGA_PHASES.length - 1; i >= 0; i--) {
    const def = SAGA_PHASES[i];
    const inActRange =
      narrativeAct >= def.actRange.min && narrativeAct <= def.actRange.max;
    if (!inActRange) continue;
    if (def.triggerFlag === null) return def.phase;
    if (flags[def.triggerFlag]) return def.phase;
  }

  return 0;
}

/**
 * Returns true if the player has reached at least `phase`.
 * Useful for content-gating ("this Codex entry unlocks at Phase 7+").
 */
export function hasReachedPhase(
  input: SagaPhaseInput,
  phase: SagaPhase,
): boolean {
  return resolveCurrentSagaPhase(input) >= phase;
}

/**
 * Returns the canonical "what should the player do next" guidance:
 * the title + premise of the NEXT phase the player has not yet
 * reached. Returns null if the player is at phase 14 (no next phase).
 *
 * The Hub UI's "Your path continues..." surface reads this.
 */
export function getNextPhaseGuidance(
  input: SagaPhaseInput,
): SagaPhaseDefinition | null {
  const current = resolveCurrentSagaPhase(input);
  if (current >= 14) return null;
  return getSagaPhaseDefinition((current + 1) as SagaPhase);
}

/**
 * Returns all phases the player has canonically completed
 * (i.e., reached AND moved past — current phase is NOT
 * considered completed).
 */
export function getCompletedPhases(
  input: SagaPhaseInput,
): readonly SagaPhase[] {
  const current = resolveCurrentSagaPhase(input);
  const completed: SagaPhase[] = [];
  for (let p = 0 as SagaPhase; p < current; p = (p + 1) as SagaPhase) {
    completed.push(p);
  }
  return completed;
}

/**
 * Canonical saga total: 15 phases (0-14 inclusive).
 */
export const CANONICAL_SAGA_PHASE_COUNT = 15;

/**
 * Returns the phase number that the given narrativeAct's minimum-phase
 * gates to. Used by the Mystery Engine catalog's act-gating logic.
 */
export function getMinimumPhaseForAct(narrativeAct: number): SagaPhase {
  const acts = SAGA_PHASES.filter(
    (p) =>
      narrativeAct >= p.actRange.min && narrativeAct <= p.actRange.max,
  );
  if (acts.length === 0) return 0;
  return acts[0].phase;
}

/* ═══════════════════════════════════════════════════════
   VOID NARRATIVE — Story event → effect mapping

   Maps game narrative events to Void Energy narrative effects.
   Effects are CSS-driven (void-narrative.css) and applied via
   the useNarrative hook or direct data-narrative attribute.

   Design principles (from upstream void-energy-ui):
   - Most steps should have NO effect (null) — effects are seasoning
   - Never combine one-shot + continuous on the same step
   - Match intensity to narrative weight
   - One-shot: punctuate single events (crash, scare, revelation)
   - Continuous: establish sustained atmosphere (dread, tension, calm)

   "A casual conversation does not need breathe.
    A world-ending explosion does not need shake — it needs quake."
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export type OneShotEffect = "shake" | "quake" | "jolt" | "glitch" | "surge" | "warp";
export type ContinuousEffect = "drift" | "flicker" | "breathe" | "tremble" | "pulse" | "whisper" | "fade" | "freeze" | "burn" | "static" | "distort" | "sway";
export type NarrativeEffect = OneShotEffect | ContinuousEffect | null;

export const ONE_SHOT_EFFECTS: ReadonlySet<string> = new Set([
  "shake", "quake", "jolt", "glitch", "surge", "warp",
]);

export const CONTINUOUS_EFFECTS: ReadonlySet<string> = new Set([
  "drift", "flicker", "breathe", "tremble", "pulse",
  "whisper", "fade", "freeze", "burn", "static", "distort", "sway",
]);

/* ─── NARRATIVE EVENT → EFFECT MAP ─── */

/**
 * Maps game events to their narrative effect. null = no effect.
 * Intentionally sparse — most events should NOT have an effect.
 */
export const NARRATIVE_EVENT_EFFECTS: Record<string, NarrativeEffect> = {
  // ── Awakening & progression ──
  awakening_start: "surge",
  awakening_milestone: "pulse",
  awakening_threshold: "surge",
  level_up: "jolt",
  prestige_unlock: "surge",

  // ── Combat moments ──
  player_hit: "shake",
  player_critical_hit: "quake",
  player_death: "freeze",
  limit_break_activate: "surge",
  combo_finish: "jolt",
  round_start: null,
  round_end: null,

  // ── NPC interactions ──
  npc_revelation: "glitch",
  npc_trust_gained: "pulse",
  npc_trust_lost: "shake",
  npc_betrayal: "quake",
  npc_summon: "surge",
  elara_first_contact: "warp",
  shadow_tongue_whisper: "whisper",
  source_corruption: "static",
  necromancer_revival: "glitch",

  // ── Room transitions ──
  enter_shadow_vault: "tremble",
  enter_chaos_forge: "burn",
  enter_observation_deck: "drift",
  enter_oracle_sanctum: "breathe",
  enter_cryo_bay: "fade",

  // ── Card game / DISCHORDIA ──
  card_summon: "warp",
  general_defeated: "quake",
  spell_cast: "jolt",

  // ── Terminus Swarm ──
  swarm_wave_start: "tremble",
  swarm_base_hit: "shake",
  swarm_boss_spawn: "quake",

  // ── Trade Wars ──
  fleet_destroyed: "shake",
  territory_captured: "surge",
  trade_deal_struck: null,

  // ── Atmosphere shifts ──
  morality_shift_machine: "distort",
  morality_shift_humanity: "breathe",
  virus_encounter: "static",
  reality_fracture: "warp",

  // ── Meta / system ──
  achievement_unlock: "jolt",
  cutscene_start: "fade",
  cutscene_climax: "surge",
  cutscene_end: null,
};

/* ─── HELPERS ─── */

/**
 * Get the narrative effect for a game event.
 * Returns null if no effect is mapped (most events).
 */
export function getEffectForEvent(eventId: string): NarrativeEffect {
  return NARRATIVE_EVENT_EFFECTS[eventId] ?? null;
}

/**
 * Check if an effect is one-shot (plays once) or continuous (loops).
 */
export function isOneShot(effect: NarrativeEffect): boolean {
  return effect !== null && ONE_SHOT_EFFECTS.has(effect);
}

/**
 * Suggested intensity levels for matching effect to narrative weight.
 * Use this when dynamically choosing effects.
 */
export const INTENSITY_SCALE: Record<string, NarrativeEffect[]> = {
  // From lightest to heaviest
  subtle: ["whisper", "drift", "sway", "fade"],
  moderate: ["breathe", "pulse", "tremble", "distort"],
  strong: ["shake", "jolt", "burn", "flicker"],
  extreme: ["quake", "surge", "warp", "glitch", "static", "freeze"],
};

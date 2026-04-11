/* ═══════════════════════════════════════════════════════
   ARENA HAZARDS & ENVIRONMENTAL EFFECTS

   Per-arena registry of stage hazards, ambient effects,
   and interactive props. The Collectors Arena's 16 stages
   each get a distinct tactile identity — bioluminescent
   spores on Thaloria, drone feedback on the Panopticon,
   green fire at the Necromancer's castle, etc.

   Data-only. Rendering and gameplay application live in
   FightArena2D / FightEngine2D; this file defines WHICH
   hazards exist, their timing, and their damage.

   The `damagePerTick` field is in frame-damage units (not
   HP), consistent with FightEngine2D's damage scaling.
   ═══════════════════════════════════════════════════════ */

// ─── TYPES ─────────────────────────────────────────────

/** Hazard behavior classification. */
export type HazardType =
  | "static_prop"       // decorative, no gameplay impact
  | "ambient_effect"    // periodic or continuous visual, no damage
  | "damage_zone"       // position-bound damage over time
  | "interactive_prop"  // activated by player actions
  | "phase_transition"  // triggers arena state change mid-fight
  ;

/** Ambient visual effect descriptor. Consumed by a future
 *  ArenaEffectRenderer; for now, purely declarative. */
export type AmbientEffect =
  | { type: "particle_drift"; color: string; density: number; direction: "up" | "down" | "left" | "right" | "drift" }
  | { type: "pulse"; color: string; intervalMs: number; fadeMs: number }
  | { type: "fog_layer"; color: string; density: number; parallax: number }
  | { type: "lightning_strike"; color: string; intervalMs: number }
  | { type: "spore_cloud"; color: string; driftSpeed: number; lifespanMs: number }
  | { type: "drone_hum"; color: string; pulseRate: number }
  | { type: "camera_shake"; intensity: number; intervalMs: number }
  | { type: "bioluminescent_wash"; color: string; intensity: number }
  | { type: "ember_rain"; color: string; density: number }
  | { type: "static_flicker"; color: string; frequency: number }
  ;

/** When does the hazard fire? */
export type HazardActivation =
  | "always"         // constant presence
  | "periodic"       // repeats on a timer
  | "on_hit"         // reacts to fighter hits
  | "phase_2"        // triggers when a fighter drops below 50% HP
  | "phase_3"        // triggers on low HP
  | "guard_break"    // triggers when a fighter's guard breaks
  ;

/** A single hazard / environmental effect attached to an arena. */
export interface ArenaHazard {
  id: string;
  arenaId: string;
  name: string;
  description: string;
  type: HazardType;
  activation: HazardActivation;
  /** Bounding box (% of arena width/height) for positional hazards */
  position?: { x: number; y: number; w: number; h: number };
  ambientEffect?: AmbientEffect;
  /** Damage per 60-fps frame while active (0 for non-damaging hazards) */
  damagePerTick: number;
  /** For periodic hazards, how often the hazard fires */
  periodMs?: number;
  /** How long the hazard stays active per fire (0 = always) */
  activeDurationMs?: number;
  /** Narrative lore tag — connects the hazard to the arena's story */
  loreTag?: string;
}

// ─── HELPERS ───────────────────────────────────────────

/** Fetch all hazards for a given arena id. */
export function getArenaHazards(arenaId: string): ArenaHazard[] {
  return ARENA_HAZARDS.filter(h => h.arenaId === arenaId);
}

/** Fetch all ambient-only (non-damaging) effects for an arena. */
export function getArenaAmbientEffects(arenaId: string): ArenaHazard[] {
  return getArenaHazards(arenaId).filter(
    h => h.damagePerTick === 0 && !!h.ambientEffect,
  );
}

/** Fetch all damage-dealing hazards for an arena. */
export function getArenaDamageHazards(arenaId: string): ArenaHazard[] {
  return getArenaHazards(arenaId).filter(h => h.damagePerTick > 0);
}

/** True if the arena has any phase-transition hazards (i.e. the
 *  arena physically changes mid-fight, e.g. boss phases). */
export function arenaHasPhaseTransitions(arenaId: string): boolean {
  return getArenaHazards(arenaId).some(h => h.type === "phase_transition");
}

// ═══════════════════════════════════════════════════════
// REGISTRY
//
// Convention: hazard ids are `{arenaId}_{slug}` to guarantee
// uniqueness across the registry.
// ═══════════════════════════════════════════════════════

export const ARENA_HAZARDS: ArenaHazard[] = [
  /* ─── new-babylon ─── */
  {
    id: "new-babylon_neon_rain", arenaId: "new-babylon",
    name: "Neon Rain", description: "Cold acid rain refracted through city light. Constant, mood-setting, harmless.",
    type: "ambient_effect", activation: "always", damagePerTick: 0,
    ambientEffect: { type: "particle_drift", color: "#6366f1", density: 0.6, direction: "down" },
    loreTag: "New Babylon's weather hasn't stopped crying since the Fall.",
  },
  {
    id: "new-babylon_street_static", arenaId: "new-babylon",
    name: "Street Static", description: "Billboards flicker with pink propaganda on a 12s cycle.",
    type: "ambient_effect", activation: "periodic", periodMs: 12000, activeDurationMs: 600, damagePerTick: 0,
    ambientEffect: { type: "static_flicker", color: "#ec4899", frequency: 0.3 },
  },

  /* ─── panopticon ─── */
  {
    id: "panopticon_watching_eyes", arenaId: "panopticon",
    name: "100 Watching Eyes", description: "The cell's surveillance cameras rotate in a slow, unified pattern.",
    type: "ambient_effect", activation: "always", damagePerTick: 0,
    ambientEffect: { type: "drone_hum", color: "#f59e0b", pulseRate: 0.2 },
    loreTag: "The Jailer never blinks. None of them blink.",
  },
  {
    id: "panopticon_cell_shadow", arenaId: "panopticon",
    name: "Cell Bar Shadow", description: "Bar shadows sweep the arena floor every 43 seconds — the camera rotation Agent Zero mentioned.",
    type: "ambient_effect", activation: "periodic", periodMs: 43000, activeDurationMs: 2000, damagePerTick: 0,
    ambientEffect: { type: "fog_layer", color: "#1c1917", density: 0.3, parallax: 0.2 },
  },

  /* ─── thaloria ─── */
  {
    id: "thaloria_spore_cloud", arenaId: "thaloria",
    name: "Bioluminescent Spores", description: "Glowing teal spores drift from the canopy in slow tides.",
    type: "ambient_effect", activation: "always", damagePerTick: 0,
    ambientEffect: { type: "spore_cloud", color: "#14b8a6", driftSpeed: 0.15, lifespanMs: 8000 },
    loreTag: "Thaloria's forests breathe out memories of dead moons.",
  },
  {
    id: "thaloria_canopy_wash", arenaId: "thaloria",
    name: "Canopy Wash", description: "The overhead foliage pulses teal on a slow 6s heartbeat.",
    type: "ambient_effect", activation: "periodic", periodMs: 6000, activeDurationMs: 800, damagePerTick: 0,
    ambientEffect: { type: "bioluminescent_wash", color: "#14b8a6", intensity: 0.4 },
  },
  {
    id: "thaloria_root_slam", arenaId: "thaloria",
    name: "Root Slam", description: "A sentient tree-root lashes the arena floor at a random edge position every 14s.",
    type: "damage_zone", activation: "periodic", periodMs: 14000, activeDurationMs: 600, damagePerTick: 4,
    position: { x: 10, y: 80, w: 15, h: 20 },
  },

  /* ─── terminus ─── */
  {
    id: "terminus_virus_bleed", arenaId: "terminus",
    name: "Thought Virus Bleed", description: "Purple corruption bleeds from the walls in faint, continuous streams.",
    type: "ambient_effect", activation: "always", damagePerTick: 0,
    ambientEffect: { type: "fog_layer", color: "#a855f7", density: 0.25, parallax: 0.3 },
    loreTag: "Project Vector is stored in this lab. Some of it has leaked into the architecture.",
  },
  {
    id: "terminus_equation_flicker", arenaId: "terminus",
    name: "Equation Flicker", description: "Equations scrawled on the walls rewrite themselves mid-fight.",
    type: "ambient_effect", activation: "periodic", periodMs: 4000, activeDurationMs: 400, damagePerTick: 0,
    ambientEffect: { type: "static_flicker", color: "#22d3ee", frequency: 0.6 },
  },

  /* ─── mechronis ─── */
  {
    id: "mechronis_circuitry", arenaId: "mechronis",
    name: "Living Circuitry", description: "The walls themselves are a data center. Green circuit pulses travel the floor.",
    type: "ambient_effect", activation: "always", damagePerTick: 0,
    ambientEffect: { type: "pulse", color: "#22c55e", intervalMs: 2000, fadeMs: 400 },
  },
  {
    id: "mechronis_data_surge", arenaId: "mechronis",
    name: "Data Surge", description: "Every 18 seconds, a floor panel shoots a vertical data column — visual only.",
    type: "ambient_effect", activation: "periodic", periodMs: 18000, activeDurationMs: 800, damagePerTick: 0,
    ambientEffect: { type: "particle_drift", color: "#22c55e", density: 0.5, direction: "up" },
  },

  /* ─── crucible ─── */
  {
    id: "crucible_ember_rain", arenaId: "crucible",
    name: "Ember Rain", description: "Orange embers drift down from the broken forge-ceiling.",
    type: "ambient_effect", activation: "always", damagePerTick: 0,
    ambientEffect: { type: "ember_rain", color: "#f97316", density: 0.4 },
    loreTag: "The Crucible forges the fighters who aren't already forged.",
  },
  {
    id: "crucible_forge_flare", arenaId: "crucible",
    name: "Forge Flare", description: "Every 22 seconds a forge-vent blasts a pillar of fire at the arena edge.",
    type: "damage_zone", activation: "periodic", periodMs: 22000, activeDurationMs: 1200, damagePerTick: 5,
    position: { x: 85, y: 30, w: 12, h: 60 },
  },

  /* ─── blood-weave ─── */
  {
    id: "blood-weave_resin_drip", arenaId: "blood-weave",
    name: "Resin Drip", description: "The training-room walls weep red resin. Slow, continuous, gory.",
    type: "ambient_effect", activation: "always", damagePerTick: 0,
    ambientEffect: { type: "particle_drift", color: "#dc2626", density: 0.3, direction: "down" },
    loreTag: "Akai Shi says the resin was alive once. She's not wrong.",
  },
  {
    id: "blood-weave_phantom_wounds", arenaId: "blood-weave",
    name: "Phantom Wounds", description: "Red lightning arcs across the ceiling on a 9s timer.",
    type: "ambient_effect", activation: "periodic", periodMs: 9000, activeDurationMs: 200, damagePerTick: 0,
    ambientEffect: { type: "lightning_strike", color: "#dc2626", intervalMs: 9000 },
  },

  /* ─── shadow-sanctum ─── */
  {
    id: "shadow-sanctum_dream_fog", arenaId: "shadow-sanctum",
    name: "Dream Fog", description: "Violet dream-fog rolls across the floor at ankle height.",
    type: "ambient_effect", activation: "always", damagePerTick: 0,
    ambientEffect: { type: "fog_layer", color: "#7c3aed", density: 0.5, parallax: 0.15 },
    loreTag: "Wraith Calder says the fog is the inside of his seventh death.",
  },
  {
    id: "shadow-sanctum_seven_echoes", arenaId: "shadow-sanctum",
    name: "Seven Echoes", description: "Seven faint Wraith Calder silhouettes flicker around the arena perimeter.",
    type: "ambient_effect", activation: "periodic", periodMs: 7000, activeDurationMs: 500, damagePerTick: 0,
    ambientEffect: { type: "static_flicker", color: "#c4b5fd", frequency: 0.4 },
  },

  /* ─── ranked-table ─── */
  {
    id: "ranked-table_cyan_grid", arenaId: "ranked-table",
    name: "Cyan Grid", description: "An ELO-leaderboard grid pulses under the arena floor.",
    type: "ambient_effect", activation: "periodic", periodMs: 3000, activeDurationMs: 800, damagePerTick: 0,
    ambientEffect: { type: "pulse", color: "#33E2E6", intervalMs: 3000, fadeMs: 800 },
  },

  /* ─── tournament-hall ─── */
  {
    id: "tournament-hall_crowd_glow", arenaId: "tournament-hall",
    name: "Crowd Glow", description: "Thousands of amber torches pulse in the spectator tiers.",
    type: "ambient_effect", activation: "periodic", periodMs: 4500, activeDurationMs: 700, damagePerTick: 0,
    ambientEffect: { type: "pulse", color: "#f59e0b", intervalMs: 4500, fadeMs: 700 },
  },

  /* ─── draft-chamber ─── */
  {
    id: "draft-chamber_selection_light", arenaId: "draft-chamber",
    name: "Selection Light", description: "A slow amber spotlight sweeps the arena floor — the draft algorithm deliberating.",
    type: "ambient_effect", activation: "always", damagePerTick: 0,
    ambientEffect: { type: "bioluminescent_wash", color: "#d97706", intensity: 0.3 },
  },

  /* ─── watcher-panopticon ─── */
  {
    id: "watcher-panopticon_100_eyes", arenaId: "watcher-panopticon",
    name: "One Hundred Eyes", description: "A full rotation of surveillance drones, each one tracking the fight.",
    type: "ambient_effect", activation: "always", damagePerTick: 0,
    ambientEffect: { type: "drone_hum", color: "#facc15", pulseRate: 0.5 },
    loreTag: "The Warden personally calibrated every drone to follow the Prisoner.",
  },
  {
    id: "watcher-panopticon_discipline_beam", arenaId: "watcher-panopticon",
    name: "Discipline Beam", description: "Phase 2 trigger — at 50% HP the Warden fires a tracking beam that sweeps left to right.",
    type: "damage_zone", activation: "phase_2", periodMs: 10000, activeDurationMs: 1500, damagePerTick: 6,
    position: { x: 0, y: 40, w: 100, h: 10 },
  },

  /* ─── architect-throne ─── */
  {
    id: "architect-throne_schematic_overlay", arenaId: "architect-throne",
    name: "Schematic Overlay", description: "Blueprints of the Arena itself project onto the air around the throne.",
    type: "ambient_effect", activation: "always", damagePerTick: 0,
    ambientEffect: { type: "static_flicker", color: "#ef4444", frequency: 0.15 },
    loreTag: "The Architect is reviewing his design in real-time.",
  },
  {
    id: "architect-throne_reality_glitch", arenaId: "architect-throne",
    name: "Reality Glitch", description: "The arena briefly renders itself as pink neon — a Meme intrusion — every 9 seconds.",
    type: "ambient_effect", activation: "periodic", periodMs: 9000, activeDurationMs: 300, damagePerTick: 0,
    ambientEffect: { type: "static_flicker", color: "#ec4899", frequency: 0.8 },
  },
  {
    id: "architect-throne_phase_collapse", arenaId: "architect-throne",
    name: "Design Collapse", description: "Phase 3 trigger — below 25% HP the throne room walls begin to physically crumble.",
    type: "phase_transition", activation: "phase_3", damagePerTick: 0,
    loreTag: "The Architect built the Arena to be dismantled by exactly one person.",
  },

  /* ─── necromancer-castle ─── */
  {
    id: "necromancer-castle_green_fire", arenaId: "necromancer-castle",
    name: "Green Fire Floor", description: "Cold green fire licks the throne-hall floor in continuous, low-intensity flames.",
    type: "ambient_effect", activation: "always", damagePerTick: 0,
    ambientEffect: { type: "ember_rain", color: "#22c55e", density: 0.3 },
    loreTag: "The fire does not warm. It is the Necromancer's own pulse, made visible.",
  },
  {
    id: "necromancer-castle_death_tide", arenaId: "necromancer-castle",
    name: "Death Tide", description: "Every 12 seconds a green wavefront rolls across the arena floor — visual only.",
    type: "ambient_effect", activation: "periodic", periodMs: 12000, activeDurationMs: 1000, damagePerTick: 0,
    ambientEffect: { type: "pulse", color: "#22c55e", intervalMs: 12000, fadeMs: 1000 },
  },
  {
    id: "necromancer-castle_resurrection_vortex", arenaId: "necromancer-castle",
    name: "Resurrection Vortex", description: "CH5 mandatory-loss transition — a green vortex opens at the center of the arena.",
    type: "phase_transition", activation: "phase_3", damagePerTick: 0,
    position: { x: 40, y: 40, w: 20, h: 30 },
    loreTag: "This is where the Prisoner dies the seventh death and wakes as the Oracle.",
  },

  /* ─── terminus-core ─── */
  {
    id: "terminus-core_unsolved_equations", arenaId: "terminus-core",
    name: "Unsolved Equations", description: "The walls are covered in equations that rewrite themselves every few seconds.",
    type: "ambient_effect", activation: "periodic", periodMs: 2000, activeDurationMs: 300, damagePerTick: 0,
    ambientEffect: { type: "static_flicker", color: "#22d3ee", frequency: 0.7 },
    loreTag: "Enigma's unsolvable proofs, slowly coming apart for the first time.",
  },
  {
    id: "terminus-core_data_storm", arenaId: "terminus-core",
    name: "Data Storm", description: "Periodic data bursts scour the arena from above.",
    type: "ambient_effect", activation: "periodic", periodMs: 15000, activeDurationMs: 1200, damagePerTick: 0,
    ambientEffect: { type: "particle_drift", color: "#22d3ee", density: 0.4, direction: "down" },
  },

  /* ─── the-trench ─── */
  {
    id: "the-trench_dust_storm", arenaId: "the-trench",
    name: "Dust Storm", description: "Sand and circuit dust blows laterally across the arena.",
    type: "ambient_effect", activation: "always", damagePerTick: 0,
    ambientEffect: { type: "particle_drift", color: "#f97316", density: 0.5, direction: "right" },
    loreTag: "The Trench is the only arena where the ground is still organic.",
  },
];

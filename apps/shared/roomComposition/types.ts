/* ═══════════════════════════════════════════════════════
   ROOM COMPOSITION — layered base + sprite renderer (Phase J)

   The Phase H system (apps/shared/roomVariants/) composites
   a 4-axis layer stack (TV / cycle / faction / storyteller)
   on top of a producer-baseline image. That model is a great
   fit for the 60+ rooms that share a single base-art tone.

   Phase J targets the three "load-bearing" rooms — Bridge,
   Cryo Bay, Medical Bay — where the base ITSELF mutates
   under heavy lighting / atmospheric state (cycle-phase,
   TV-corruption stages, epoch grand-edit, season-interregnum,
   long-sleep ending, HB1 transit) AND a wide library of
   object-level sprite overlays composite on top.

   Each Phase J room has:
     - ~12-15 distinct base renders (one selected per scene)
     - ~58-88 sprite overlays (zero or more composited per scene)

   The resolver collapses a GameStateSlice → a CompositeResult
   the renderer can turn into a ParallaxLayer[] for the existing
   ParallaxRoom component.

   Compatibility: the resolver returns null for rooms not yet
   wired, so the caller can keep falling back through Phase H
   (`useRoomArt`), then the Phase F single-image tier picker
   (`resolveRoomBackgroundUrl`), then the legacy `imageUrl`.
   ═══════════════════════════════════════════════════════ */

/** Rooms covered by Phase J composite rendering. */
export type CompositeRoomId = "bridge" | "cryo-bay" | "medical-bay" | "engineering";

/** Map the public room id ("cryo-bay") to the S3 path segment ("cryo_bay"). */
export const COMPOSITE_ROOM_S3_DIR: Readonly<Record<CompositeRoomId, string>> = {
  bridge: "bridge",
  "cryo-bay": "cryo_bay",
  "medical-bay": "medical_bay",
  engineering: "engineering",
};

/** A resolved composite: the single chosen base + ordered sprite list. */
export interface CompositeResult {
  /** Base asset id (one per scene). */
  readonly base: string;
  /** Sprite asset ids in z-order (lowest first → highest last). */
  readonly sprites: readonly string[];
  /** Optional CSS filter string to apply to the sprite stack when the
   *  base lighting differs from the 5500 K sprite-rendering baseline.
   *  Applied to the wrapping container around the sprite layers only. */
  readonly baseLightingFilter?: string;
}

/** Thin slice of game state the resolvers need. Keeping this minimal
 *  decouples the resolvers from the full GameState type. */
export interface CompositeGameSlice {
  readonly narrativeFlags: Readonly<Record<string, boolean | undefined>>;
  /** -100 (dark / Machine) → +100 (light / Humanity). 0 = balanced. */
  readonly moralityScore?: number;
  /** 0-100. */
  readonly elaraTrust?: number;
  /** faction id → integer score. Convention: ≥ 75 reads as "high",
   *  ≤ -50 as "enemied". */
  readonly factionReputation?: Readonly<Record<string, number>>;
  /** IRL season for chandelier/trinket dressings. */
  readonly irlSeason?: "spring" | "summer" | "autumn" | "winter";
  /** Wall-clock override for cycle-phase derivation. The client hook
   *  (`useRoomComposite`) injects `new Date()` so production gets
   *  wall-clock lighting variation; tests + replays pin a fixed date
   *  for determinism. When undefined AND no `cycle_phase_*` flag is
   *  set, deriveCyclePhase returns "balanced" (no time-of-day shift). */
  readonly now?: Date;
}

/** Cycle-phase derivation — pulled from narrative flags so the resolver
 *  stays pure. Real cycle clock is in apps/shared/timeOfDay.ts; callers
 *  can pre-derive and stamp the matching flag.
 *
 *  Flag → phase mapping:
 *    cycle_phase_dawn → "dawn"
 *    cycle_phase_dimming → "dimming"
 *    cycle_phase_long_night → "longNight"
 *    (default → "balanced") */
export type CyclePhase = "dawn" | "balanced" | "dimming" | "longNight";

/** TV-infection level. Same domain as Phase H's axis 9. */
export type TVInfection = "clean" | "exposed" | "spreading" | "corrupted" | "quarantined";

/** Per-axis CSS filter applied to the sprite stack. Keeps the sprites
 *  visually consistent with the base they're composited over. */
export const LIGHTING_FILTERS: Readonly<Record<string, string>> = {
  cycle_dawn: "brightness(1.05) sepia(0.10) hue-rotate(-4deg)",
  cycle_dimming: "brightness(0.85) hue-rotate(4deg)",
  cycle_long_night: "brightness(0.65) hue-rotate(220deg) saturate(0.85)",
  morality_dark: "brightness(0.90) hue-rotate(260deg) saturate(0.80)",
  season_interregnum: "brightness(0.55)",
  tv_corrupted: "brightness(0.70) saturate(0.60)",
  tv_quarantined: "brightness(0.85) saturate(1.10) hue-rotate(8deg)",
  epoch_grand_edit: "brightness(0.85) hue-rotate(240deg)",
  hellbox1_transit: "brightness(1.10) sepia(0.15)",
  long_sleep_ending: "brightness(0.95)",
};

/** Convert -100..+100 moralityScore to a tri-state. */
export function moralityBand(score: number | undefined): "light" | "balanced" | "dark" {
  if (score == null) return "balanced";
  if (score <= -33) return "dark";
  if (score >= 33) return "light";
  return "balanced";
}

/** Convert 0-100 trust into tri-state. Returns null when trust is
 *  unknown (resolvers should skip trust-conditional overlays so the
 *  default render is a neutral baseline). */
export function trustBand(
  score: number | undefined,
): "fragmented" | "lucid" | "luminous" | null {
  if (score == null) return null;
  if (score <= 33) return "fragmented";
  if (score >= 67) return "luminous";
  return "lucid";
}

/** Faction reputation band check. Returns true when the named faction's
 *  reputation reads as "high" (≥ 75 by default).
 *
 *  Faction keys are matched permissively — both the canonical key and
 *  common synonyms count. Example: `factionHigh(g, "authority")` matches
 *  `factionReputation.authority`, `.new_babylon_authority`, `.empire`. */
export function factionHigh(g: CompositeGameSlice, key: string): boolean {
  const rep = g.factionReputation;
  if (!rep) return false;
  const aliases = FACTION_ALIASES[key] ?? [key];
  for (const a of aliases) {
    const v = rep[a];
    if (typeof v === "number" && v >= 75) return true;
  }
  return false;
}

const FACTION_ALIASES: Readonly<Record<string, readonly string[]>> = {
  authority: ["authority", "new_babylon_authority", "empire"],
  insurgency: ["insurgency", "insurgents", "rebellion"],
  antiquarian: ["antiquarian", "antiquarians", "shelf_mates"],
  substrate_rebels: ["substrate_rebels", "substrate", "artificial_empire_substrate_rebels"],
  hierarchy: ["hierarchy", "hierarchy_acquisitions", "hierarchy_severance"],
  thaloria: ["thaloria", "thaloria_council"],
  guild: ["guild", "civic_engineers", "new_babylon_civic_engineers"],
  coda: ["coda", "coda_inner_circle"],
  dreamers: ["dreamers", "dreamer_shield"],
};

/** Derive cycle-phase from narrative flags. Falls back to the wall-clock
 *  `currentPhase()` from apps/shared/timeOfDay.ts so resolvers light up
 *  even when the game logic hasn't started writing explicit phase flags.
 *
 *  Flag → phase mapping (highest priority):
 *    cycle_phase_dawn → "dawn"
 *    cycle_phase_dimming → "dimming"
 *    cycle_phase_long_night → "longNight"
 *
 *  timeOfDay fallback:
 *    dawn → "dawn"
 *    midday → "balanced"
 *    dusk → "dimming"
 *    nightwatch → "longNight" */
import { currentPhase, type DayPhase } from "@shared/timeOfDay";

export function deriveCyclePhase(g: CompositeGameSlice, now?: Date): CyclePhase {
  const f = g.narrativeFlags;
  if (f.cycle_phase_long_night) return "longNight";
  if (f.cycle_phase_dimming) return "dimming";
  if (f.cycle_phase_dawn) return "dawn";
  // Fall back to the supplied wall clock (via `now` arg or g.now). When
  // neither is supplied, return "balanced" so default tests stay
  // deterministic — production callers (useRoomComposite) inject
  // `new Date()` so the lighting actually moves.
  const clock = now ?? g.now;
  if (!clock) return "balanced";
  return wallClockToCyclePhase(currentPhase(clock));
}

function wallClockToCyclePhase(phase: DayPhase): CyclePhase {
  switch (phase) {
    case "dawn": return "dawn";
    case "midday": return "balanced";
    case "dusk": return "dimming";
    case "nightwatch": return "longNight";
  }
}

/** Derive TV-infection level. Tries the explicit `tv_infection_*` flags
 *  first; falls back to the Phase H axis 9 resolver
 *  (`apps/shared/roomVariants/axis9Resolver.ts`) when a `zipDir` is
 *  supplied — that resolver reads the canonical `tv_phase_<n>` global
 *  flag and `room_<zipDir>_tv_<state>` per-room overrides. */
import { resolveAxis9State } from "@shared/roomVariants/axis9Resolver";

export function deriveTVInfection(
  g: CompositeGameSlice,
  zipDir?: string,
): TVInfection {
  const f = g.narrativeFlags;
  if (f.tv_infection_quarantined) return "quarantined";
  if (f.tv_infection_corrupted) return "corrupted";
  if (f.tv_infection_spreading) return "spreading";
  if (f.tv_infection_exposed) return "exposed";
  if (zipDir) {
    return resolveAxis9State({ narrativeFlags: f }, zipDir);
  }
  return "clean";
}

/** Derive the highest reached act tier from narrative flags. Recognises
 *  both the canonical `act_N_complete` flag family (set when a player
 *  completes Act N — they're now in Act N+1) and a forward-looking
 *  `act_tier_N_reached` family for explicit overrides. */
export function deriveActTier(g: CompositeGameSlice): number {
  const f = g.narrativeFlags;
  // Explicit overrides win.
  for (let n = 7; n >= 1; n--) {
    if (f[`act_tier_${n}_reached`]) return n;
  }
  // Canonical act_N_complete → reached tier N+1; capped at 7 (finale).
  for (let n = 7; n >= 1; n--) {
    if (f[`act_${n}_complete`]) return Math.min(n + 1, 7);
  }
  return 0;
}

/** Build the CDN URL for a composite asset.
 *  Layout: art/rooms/<s3dir>/<kind>/<assetId>.png */
import { assetUrl } from "@shared/lib/assetUrl";

export function compositeBaseUrl(roomId: CompositeRoomId, baseId: string): string {
  return assetUrl(`art/rooms/${COMPOSITE_ROOM_S3_DIR[roomId]}/base/${baseId}.png`);
}

export function compositeSpriteUrl(roomId: CompositeRoomId, spriteId: string): string {
  return assetUrl(`art/rooms/${COMPOSITE_ROOM_S3_DIR[roomId]}/sprites/${spriteId}.png`);
}

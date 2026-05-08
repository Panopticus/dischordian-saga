/**
 * fightFrameData — pure-function frame data + collision math.
 *
 * Extracted from FightEngine2D.ts (audit/01.F4 / refactor-plans/
 * fight-engine-2d-split.md, Step 2). The whole module is referentially
 * transparent: zero `this.*`, zero module-level mutable state, zero
 * Math.random — every function is a pure (input → output) map.
 *
 * What lives here:
 *   - Hurtbox geometry (standing / crouching / air poses)
 *   - AABB collision primitives (overlap, world-space mapping)
 *   - Per-move frame-data builders (buildMoveData, buildSpecialMoveData)
 *   - State → pose mapping for sprite selection
 *
 * What stays in FightEngine2D.ts:
 *   - The class itself (state, ticking, rendering)
 *   - Input handling, AI, particle effects, camera
 *   - Anything that touches `this` or DOM/canvas state
 *
 * Constants `FIGHTER_HEIGHT` and `METER_PER_HIT` are owned here because
 * the frame-data builders need them; FightEngine2D re-imports them.
 */
import type { FrameProfile, FighterArchetype } from "./gameData";
import type { SpecialMove } from "./specialMoves";

/** Re-exported by FightEngine2D for back-compat with the 12+ class-body
 *  callsites that read this constant. */
export const FIGHTER_HEIGHT = 200;

/** Meter granted per hit landed. Multiplied per move below. */
export const METER_PER_HIT = 8;

/** Re-export the FighterArchetype type so renderer/AI modules that
 *  consume frame data don't need a second import path for the
 *  archetype enum. */
export type { FighterArchetype };

/* ═══════════════════════════════════════════════════════
   HITBOX / HURTBOX SYSTEM (AABB)
   ═══════════════════════════════════════════════════════ */

export interface AABB {
  x: number; // left edge relative to fighter center
  y: number; // top edge relative to fighter feet
  w: number; // width
  h: number; // height
}

export interface HurtBoxSet {
  head: AABB;
  body: AABB;
  legs: AABB;
}

export interface HitBox extends AABB {
  damage: number;
  hitstun: number;
  blockstun: number;
  pushbackHit: number;
  pushbackBlock: number;
  meterGain: number;
  juggleCost: number;
  launchForce: number; // 0 = no launch, >0 = vertical launch velocity
  knockdownForce: number; // 0 = no knockdown, >0 = knockdown
  type: "high" | "mid" | "low" | "overhead" | "unblockable";
}

/** Default hurtboxes for standing fighter */
export function getStandingHurtBoxes(facingRight: boolean): HurtBoxSet {
  const dir = facingRight ? 1 : -1;
  return {
    head: { x: -15 * dir, y: -FIGHTER_HEIGHT, w: 40, h: 45 },
    body: { x: -20 * dir, y: -FIGHTER_HEIGHT + 45, w: 50, h: 70 },
    legs: { x: -20 * dir, y: -FIGHTER_HEIGHT + 115, w: 50, h: 85 },
  };
}

export function getCrouchingHurtBoxes(facingRight: boolean): HurtBoxSet {
  const dir = facingRight ? 1 : -1;
  return {
    head: { x: -15 * dir, y: -130, w: 40, h: 35 },
    body: { x: -20 * dir, y: -95, w: 55, h: 50 },
    legs: { x: -25 * dir, y: -45, w: 60, h: 45 },
  };
}

export function getAirHurtBoxes(facingRight: boolean): HurtBoxSet {
  const dir = facingRight ? 1 : -1;
  return {
    head: { x: -15 * dir, y: -50, w: 40, h: 30 },
    body: { x: -20 * dir, y: -20, w: 50, h: 40 },
    legs: { x: -15 * dir, y: 20, w: 45, h: 40 },
  };
}

/** AABB overlap test — world coordinates */
export function aabbOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

/** Convert a local-space AABB to world space given fighter position */
export function toWorld(
  box: AABB,
  fx: number,
  fy: number,
  facingRight: boolean,
): { x: number; y: number; w: number; h: number } {
  const worldX = facingRight ? fx + box.x : fx - box.x - box.w;
  return { x: worldX, y: fy + box.y, w: box.w, h: box.h };
}

/* ═══════════════════════════════════════════════════════
   FRAME DATA — Per-move timing and hitbox data
   ═══════════════════════════════════════════════════════ */

export interface MoveFrameData {
  startup: number;
  active: number;
  recovery: number;
  hitbox: HitBox; // Active during active frames
  cancelWindow: number; // Frames during active+recovery where cancel is allowed
}

/** Build frame data for a move based on archetype and frame profile */
export function buildMoveData(
  profile: FrameProfile,
  move:
    | "light_1"
    | "light_2"
    | "light_3"
    | "medium"
    | "heavy_release"
    | "light_kick"
    | "medium_kick"
    | "heavy_kick"
    | "crouch_light"
    | "crouch_medium"
    | "crouch_heavy"
    | "jump_light"
    | "jump_medium"
    | "jump_heavy",
): MoveFrameData {
  const baseDmg = 30 * profile.damageMult;
  const baseRange = 70 * profile.rangeMult;
  const baseHitstun = 12 * profile.hitstunMult;
  const basePushback = 4 * profile.pushbackMult;

  switch (move) {
    case "light_1":
      return {
        startup: profile.lightStartup,
        active: 3,
        recovery: profile.lightRecovery,
        hitbox: {
          x: 20, y: -FIGHTER_HEIGHT + 50, w: baseRange * 0.8, h: 40,
          damage: baseDmg * 0.6, hitstun: baseHitstun * 0.8, blockstun: Math.floor(baseHitstun * 0.5),
          pushbackHit: basePushback * 0.5, pushbackBlock: basePushback * 0.7,
          meterGain: METER_PER_HIT, juggleCost: 1, launchForce: 0, knockdownForce: 0,
          type: "high",
        },
        cancelWindow: 8,
      };
    case "light_2":
      return {
        startup: profile.lightStartup + 1,
        active: 3,
        recovery: profile.lightRecovery + 2,
        hitbox: {
          x: 20, y: -FIGHTER_HEIGHT + 60, w: baseRange * 0.85, h: 45,
          damage: baseDmg * 0.7, hitstun: baseHitstun * 0.9, blockstun: Math.floor(baseHitstun * 0.55),
          pushbackHit: basePushback * 0.6, pushbackBlock: basePushback * 0.8,
          meterGain: METER_PER_HIT, juggleCost: 1, launchForce: 0, knockdownForce: 0,
          type: "mid",
        },
        cancelWindow: 6,
      };
    case "light_3":
      return {
        startup: profile.lightStartup + 2,
        active: 4,
        recovery: profile.lightRecovery + 3,
        hitbox: {
          x: 20, y: -FIGHTER_HEIGHT + 55, w: baseRange * 0.9, h: 50,
          damage: baseDmg * 0.8, hitstun: baseHitstun, blockstun: Math.floor(baseHitstun * 0.6),
          pushbackHit: basePushback * 0.7, pushbackBlock: basePushback * 0.9,
          meterGain: METER_PER_HIT, juggleCost: 2, launchForce: 0, knockdownForce: 0,
          type: "mid",
        },
        cancelWindow: 5,
      };
    case "medium":
      return {
        startup: profile.mediumStartup,
        active: 4,
        recovery: profile.mediumRecovery,
        hitbox: {
          x: 15, y: -FIGHTER_HEIGHT + 40, w: baseRange, h: 55,
          damage: baseDmg, hitstun: baseHitstun * 1.2, blockstun: Math.floor(baseHitstun * 0.7),
          pushbackHit: basePushback, pushbackBlock: basePushback * 1.2,
          meterGain: METER_PER_HIT * 1.5, juggleCost: 2, launchForce: 0, knockdownForce: 0,
          type: "mid",
        },
        cancelWindow: 6,
      };
    case "heavy_release":
      return {
        startup: profile.heavyStartup,
        active: 5,
        recovery: profile.heavyRecovery,
        hitbox: {
          x: 10, y: -FIGHTER_HEIGHT + 30, w: baseRange * 1.2, h: 70,
          damage: baseDmg * 1.8, hitstun: baseHitstun * 1.5, blockstun: Math.floor(baseHitstun * 0.9),
          pushbackHit: basePushback * 1.5, pushbackBlock: basePushback * 1.8,
          meterGain: METER_PER_HIT * 2, juggleCost: 3, launchForce: 6, knockdownForce: 0,
          type: "mid",
        },
        cancelWindow: 4,
      };
    case "crouch_light":
      return {
        startup: profile.lightStartup,
        active: 3,
        recovery: profile.lightRecovery,
        hitbox: {
          x: 15, y: -50, w: baseRange * 0.85, h: 30,
          damage: baseDmg * 0.5, hitstun: baseHitstun * 0.7, blockstun: Math.floor(baseHitstun * 0.4),
          pushbackHit: basePushback * 0.3, pushbackBlock: basePushback * 0.5,
          meterGain: METER_PER_HIT * 0.8, juggleCost: 1, launchForce: 0, knockdownForce: 0,
          type: "low",
        },
        cancelWindow: 8,
      };
    case "crouch_medium":
      return {
        startup: profile.mediumStartup,
        active: 4,
        recovery: profile.mediumRecovery + 2,
        hitbox: {
          x: 10, y: -60, w: baseRange * 1.1, h: 35,
          damage: baseDmg * 0.85, hitstun: baseHitstun, blockstun: Math.floor(baseHitstun * 0.6),
          pushbackHit: basePushback * 0.7, pushbackBlock: basePushback,
          meterGain: METER_PER_HIT * 1.2, juggleCost: 2, launchForce: 0, knockdownForce: 0,
          type: "low",
        },
        cancelWindow: 5,
      };
    case "crouch_heavy":
      return {
        startup: profile.heavyStartup + 2,
        active: 5,
        recovery: profile.heavyRecovery + 4,
        hitbox: {
          x: 5, y: -40, w: baseRange * 1.3, h: 40,
          damage: baseDmg * 1.4, hitstun: baseHitstun * 1.3, blockstun: Math.floor(baseHitstun * 0.8),
          pushbackHit: basePushback * 1.2, pushbackBlock: basePushback * 1.5,
          meterGain: METER_PER_HIT * 1.8, juggleCost: 3, launchForce: 8, knockdownForce: 5,
          type: "low",
        },
        cancelWindow: 3,
      };
    case "jump_light":
      return {
        startup: 3,
        active: 6,
        recovery: 4,
        hitbox: {
          x: 15, y: -30, w: baseRange * 0.7, h: 50,
          damage: baseDmg * 0.5, hitstun: baseHitstun * 0.8, blockstun: Math.floor(baseHitstun * 0.5),
          pushbackHit: basePushback * 0.3, pushbackBlock: basePushback * 0.5,
          meterGain: METER_PER_HIT * 0.8, juggleCost: 1, launchForce: 0, knockdownForce: 0,
          type: "overhead",
        },
        cancelWindow: 0,
      };
    case "jump_medium":
      return {
        startup: 5,
        active: 5,
        recovery: 6,
        hitbox: {
          x: 10, y: -20, w: baseRange * 0.85, h: 55,
          damage: baseDmg * 0.9, hitstun: baseHitstun * 1.1, blockstun: Math.floor(baseHitstun * 0.65),
          pushbackHit: basePushback * 0.5, pushbackBlock: basePushback * 0.8,
          meterGain: METER_PER_HIT * 1.2, juggleCost: 2, launchForce: 0, knockdownForce: 0,
          type: "overhead",
        },
        cancelWindow: 0,
      };
    case "jump_heavy":
      return {
        startup: 7,
        active: 4,
        recovery: 10,
        hitbox: {
          x: 5, y: -10, w: baseRange * 1.1, h: 65,
          damage: baseDmg * 1.5, hitstun: baseHitstun * 1.4, blockstun: Math.floor(baseHitstun * 0.85),
          pushbackHit: basePushback * 1.2, pushbackBlock: basePushback * 1.5,
          meterGain: METER_PER_HIT * 2, juggleCost: 3, launchForce: 0, knockdownForce: 4,
          type: "overhead",
        },
        cancelWindow: 0,
      };
    // ═══ KICK ATTACKS ═══
    case "light_kick":
      return {
        startup: profile.lightStartup + 1,
        active: 4,
        recovery: profile.lightRecovery + 1,
        hitbox: {
          x: 20, y: -FIGHTER_HEIGHT + 100, w: baseRange * 0.9, h: 50,
          damage: baseDmg * 0.65, hitstun: baseHitstun * 0.85, blockstun: Math.floor(baseHitstun * 0.5),
          pushbackHit: basePushback * 0.6, pushbackBlock: basePushback * 0.8,
          meterGain: METER_PER_HIT, juggleCost: 1, launchForce: 0, knockdownForce: 0,
          type: "mid",
        },
        cancelWindow: 7,
      };
    case "medium_kick":
      return {
        startup: profile.mediumStartup + 1,
        active: 5,
        recovery: profile.mediumRecovery + 1,
        hitbox: {
          x: 15, y: -FIGHTER_HEIGHT + 80, w: baseRange * 1.1, h: 55,
          damage: baseDmg * 1.1, hitstun: baseHitstun * 1.15, blockstun: Math.floor(baseHitstun * 0.7),
          pushbackHit: basePushback * 1.1, pushbackBlock: basePushback * 1.3,
          meterGain: METER_PER_HIT * 1.5, juggleCost: 2, launchForce: 0, knockdownForce: 0,
          type: "mid",
        },
        cancelWindow: 5,
      };
    case "heavy_kick":
      return {
        startup: profile.heavyStartup + 2,
        active: 5,
        recovery: profile.heavyRecovery + 2,
        hitbox: {
          x: 10, y: -FIGHTER_HEIGHT + 70, w: baseRange * 1.3, h: 70,
          damage: baseDmg * 1.9, hitstun: baseHitstun * 1.5, blockstun: Math.floor(baseHitstun * 0.95),
          pushbackHit: basePushback * 1.6, pushbackBlock: basePushback * 2.0,
          meterGain: METER_PER_HIT * 2.2, juggleCost: 3, launchForce: 5, knockdownForce: 3,
          type: "mid",
        },
        cancelWindow: 3,
      };
  }
}

/* ═══════════════════════════════════════════════════════
   SPECIAL MOVE FRAME DATA
   ═══════════════════════════════════════════════════════ */

export function buildSpecialMoveData(
  special: SpecialMove,
  level: 1 | 2 | 3,
  profile: FrameProfile,
): MoveFrameData {
  const baseDmg = 30 * profile.damageMult;
  const baseRange = 70 * profile.rangeMult;
  const baseHitstun = 12 * profile.hitstunMult;
  const basePushback = 4 * profile.pushbackMult;
  const dmgMult = special.damage * (1 + (level - 1) * 0.3);

  return {
    startup: special.startupFrames ?? (10 + (level - 1) * 3),
    active: special.activeFrames ?? (6 + level * 2),
    recovery: special.recoveryFrames ?? (15 + (level - 1) * 5),
    hitbox: {
      x: 10, y: -FIGHTER_HEIGHT + 30, w: baseRange * (1.2 + level * 0.15), h: 80,
      damage: baseDmg * dmgMult,
      hitstun: Math.floor(baseHitstun * (1.5 + level * 0.2)),
      blockstun: Math.floor(baseHitstun * (0.9 + level * 0.1)),
      pushbackHit: basePushback * (1.5 + level * 0.3),
      pushbackBlock: basePushback * (2 + level * 0.3),
      meterGain: 0, // Specials cost meter, don't gain
      juggleCost: level + 1,
      launchForce: level >= 2 ? 8 + level * 2 : 0,
      knockdownForce: level >= 3 ? 6 : 0,
      type: "mid",
    },
    cancelWindow: 0,
  };
}

/* ═══════════════════════════════════════════════════════
   STATE → POSE MAPPING
   ═══════════════════════════════════════════════════════ */

/** Pose keys consumed by the sprite renderer. Mirrors the union the
 *  renderer publishes; kept here so frame-data callers don't import
 *  back into FightEngine2D for the type. */
export type PoseKey =
  | "idle" | "attack" | "block" | "hit" | "ko" | "victory"
  | "walkForward" | "walkBack" | "crouch" | "dash"
  | "lightPunch" | "mediumPunch" | "heavyPunch"
  | "lightKick" | "mediumKick" | "heavyKick"
  | "crouchPunch" | "crouchKick" | "sweep"
  | "jump" | "jumpAttack" | "grab"
  | "knockdown" | "dizzy" | "special" | "taunt";

/** Fighter state machine — the mover side of the sim. The FightEngine2D
 *  class drives transitions; this pose mapper consumes the current
 *  state to choose a sprite. */
export type FighterState2D =
  | "idle" | "walk_fwd" | "walk_back" | "dash_fwd" | "dash_back"
  | "crouch_down" | "crouch" | "crouch_up" | "crouch_turn"
  | "jump_start" | "jump_up" | "jump_fwd" | "jump_back" | "jump_land"
  | "light_1" | "light_2" | "light_3" | "medium" | "heavy_charge" | "heavy_release"
  | "light_kick" | "medium_kick" | "heavy_kick"
  | "crouch_light" | "crouch_medium" | "crouch_heavy"
  | "jump_light" | "jump_medium" | "jump_heavy"
  | "special_1" | "special_2" | "special_3"
  | "throw_startup" | "throw_whiff"
  | "block_stand" | "block_crouch" | "blockstun" | "parry_stun"
  | "hitstun" | "air_hitstun" | "launched" | "thrown" | "finish_stun"
  | "knockdown" | "ko" | "getup"
  | "taunt" | "victory";

/** Map fighter state to the most specific pose key available.
 *  The renderer will fall back to base poses if the extended pose isn't loaded. */
export function stateToPose(state: FighterState2D): PoseKey {
  switch (state) {
    // Movement
    case "walk_fwd":       return "walkForward";
    case "walk_back":      return "walkBack";
    case "dash_fwd":       return "dash";
    case "dash_back":      return "dash";
    // Crouch
    case "crouch_down":
    case "crouch":
    case "crouch_up":
    case "crouch_turn":    return "crouch";
    // Jump
    case "jump_start":
    case "jump_up":
    case "jump_fwd":
    case "jump_back":      return "jump";
    case "jump_land":      return "idle";
    // Standing attacks
    case "light_1":
    case "light_2":
    case "light_3":        return "lightPunch";
    case "medium":         return "mediumPunch";
    case "heavy_charge":
    case "heavy_release":  return "heavyPunch";
    // Kick attacks
    case "light_kick":     return "lightKick";
    case "medium_kick":    return "mediumKick";
    case "heavy_kick":     return "heavyKick";
    // Crouch attacks
    case "crouch_light":   return "crouchPunch";
    case "crouch_medium":  return "crouchKick";
    case "crouch_heavy":   return "sweep";
    // Air attacks
    case "jump_light":
    case "jump_medium":
    case "jump_heavy":     return "jumpAttack";
    // Specials
    case "special_1":
    case "special_2":
    case "special_3":      return "special";
    // Throw
    case "throw_startup":  return "grab";
    case "throw_whiff":    return "grab";
    // Defense
    case "block_stand":
    case "block_crouch":
    case "blockstun":
    case "parry_stun":     return "block";
    // Damage
    case "hitstun":
    case "air_hitstun":
    case "launched":
    case "thrown":
    case "finish_stun":    return "hit";
    // Down states
    case "knockdown":      return "knockdown";
    case "ko":             return "ko";
    case "getup":          return "dizzy";
    // Taunt
    case "taunt":          return "taunt";
    // Win
    case "victory":        return "victory";
    // Default
    case "idle":
    default:               return "idle";
  }
}

/** Fallback chain: if the specific pose sprite isn't loaded, degrade gracefully */
export const POSE_FALLBACK: Partial<Record<PoseKey, PoseKey>> = {
  walkForward: "idle",
  walkBack: "idle",
  crouch: "block",
  dash: "attack",
  lightPunch: "attack",
  mediumPunch: "attack",
  heavyPunch: "attack",
  lightKick: "attack",
  mediumKick: "attack",
  heavyKick: "attack",
  crouchPunch: "attack",
  crouchKick: "attack",
  sweep: "attack",
  jump: "idle",
  jumpAttack: "attack",
  grab: "attack",
  knockdown: "ko",
  dizzy: "hit",
  special: "attack",
  taunt: "victory",
};

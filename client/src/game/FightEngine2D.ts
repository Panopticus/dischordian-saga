/**
 * FightEngine2D — Canvas-Based 2D Fighting Game Engine
 * 
 * Ported from the open-source StreetFighter JS engine with enhancements:
 * - Control History system for directional special move inputs (QCF, DP, HCF)
 * - Hit Splash effects with radial bursts, speed lines, and damage numbers
 * - Perspective-correct shadow rendering that scales with fighter height
 * - Enhanced projectile rendering with energy trails
 * - Adaptive AI with pattern recognition from SF engine
 * 
 * Uses proper AABB hitbox/hurtbox collision, per-frame push boxes,
 * multi-frame sprite animation, and a clean state machine.
 */
import type { FighterData, FrameProfile, FighterArchetype } from "./gameData";
import { getCharacterSpecials, type CharacterSpecials, type SpecialMove } from "./specialMoves";
import { getCharacterConfig } from "./CharacterModel3D";
import { FightSoundManager } from "./FightSoundManager";

type PoseKey = "idle" | "attack" | "block" | "hit" | "ko" | "victory"
  | "walkForward" | "walkBack" | "crouch" | "dash"
  | "lightPunch" | "mediumPunch" | "heavyPunch"
  | "lightKick" | "mediumKick" | "heavyKick"
  | "crouchPunch" | "crouchKick" | "sweep"
  | "jump" | "jumpAttack" | "grab"
  | "knockdown" | "dizzy" | "special" | "taunt";

/* ═══════════════════════════════════════════════════════
   EXPORTED TYPES
   ═══════════════════════════════════════════════════════ */

export type FightPhase2D = "intro" | "round_announce" | "fighting" | "finish_him" | "ko" | "round_end" | "match_end";

export type FighterState2D =
  | "idle" | "walk_fwd" | "walk_back"
  | "crouch_down" | "crouch" | "crouch_up" | "crouch_turn"
  | "dash_fwd" | "dash_back"
  | "jump_start" | "jump_up" | "jump_fwd" | "jump_back" | "jump_land"
  | "light_1" | "light_2" | "light_3"
  | "light_kick" | "medium_kick" | "heavy_kick"
  | "crouch_light" | "crouch_medium" | "crouch_heavy"
  | "jump_light" | "jump_medium" | "jump_heavy"
  | "medium" | "heavy_charge" | "heavy_release"
  | "special_1" | "special_2" | "special_3"
  | "block_stand" | "block_crouch" | "blockstun"
  | "hitstun" | "knockdown" | "getup" | "launched" | "air_hitstun"
  | "parry_stun" | "finish_stun" | "ko" | "victory"
  | "throw_startup" | "throw_whiff" | "thrown"
  | "taunt";

export type AIStyle2D = "aggressive" | "defensive" | "evasive" | "balanced";
export type Difficulty2D = "recruit" | "soldier" | "veteran" | "archon";

export interface TouchInput2D {
  type: "tap" | "swipe_left" | "swipe_right" | "swipe_up" | "swipe_down" | "hold_start" | "hold_end" | "double_tap" | "triple_tap" | "none";
  side: "left" | "right";
  timestamp: number;
}

export interface FightCallbacks2D {
  onPhaseChange?: (phase: FightPhase2D) => void;
  onHealthChange?: (p1Hp: number, p1Max: number, p2Hp: number, p2Max: number) => void;
  onCombo?: (player: 1 | 2, count: number, damage: number) => void;
  onRoundEnd?: (winner: 1 | 2, p1Wins: number, p2Wins: number) => void;
  onMatchEnd?: (winner: 1 | 2) => void;
  onSpecialReady?: (player: 1 | 2, level: number) => void;
  onHit?: (attacker: 1 | 2, type: string) => void;
  onParry?: (player: 1 | 2) => void;
  onDex?: (player: 1 | 2) => void;
  onIntercept?: (player: 1 | 2) => void;
  onGuardBreak?: (player: 1 | 2) => void;
  onSpecialActivate?: (player: 1 | 2, level: 1 | 2 | 3, moveName: string, moveType: string) => void;
  onDot?: (player: 1 | 2, damage: number) => void;
  onHeal?: (player: 1 | 2, amount: number) => void;
  onFinishHim?: (target: 1 | 2) => void;
}

export interface TrainingFighterData {
  state: FighterState2D;
  stateFrame: number;
  hp: number;
  maxHp: number;
  meter: number;
  comboCount: number;
  comboDamage: number;
  facingRight: boolean;
  airborne: boolean;
  isCrouching: boolean;
  x: number;
  y: number;
  moveData: {
    startup: number;
    active: number;
    recovery: number;
    damage: number;
    type: string;
    cancelWindow: number;
    totalFrames: number;
    currentPhase: "startup" | "active" | "recovery";
  } | null;
}

export interface TrainingData {
  p1: TrainingFighterData;
  p2: TrainingFighterData;
  stats: { maxCombo: number; totalDamage: number; hitsLanded: number };
  frameCount: number;
  distance: number;
  showHitboxes: boolean;
  showFrameData: boolean;
}

export interface MoveListEntry {
  name: string;
  input: string;
  startup: number;
  active: number;
  recovery: number;
  total: number;
  damage: number;
  type: string;
  onHit: string;
  onBlock: string;
  cancelWindow: number;
}

/* ═══════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════ */

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;
const FLOOR_Y = 580;           // Y position of the floor line
const STAGE_WIDTH = 1800;      // Total stage width (scrollable)
const GRAVITY = 0.65;          // Gravity per frame
const FIXED_DT = 1000 / 60;   // 60fps fixed timestep

// Fighter dimensions
const FIGHTER_WIDTH = 80;
const FIGHTER_HEIGHT = 200;
const FIGHTER_DRAW_WIDTH = 180;  // Visual sprite width
const FIGHTER_DRAW_HEIGHT = 280; // Visual sprite height

// Push box (prevents overlap)
const PUSH_BOX_WIDTH = 60;
const PUSH_BOX_HEIGHT = 160;

// Input buffer
const INPUT_BUFFER_SIZE = 8;
const INPUT_BUFFER_WINDOW = 6; // frames

// Combat timing
const ROUNDS_TO_WIN = 2;
const ROUND_TIME = 99;         // seconds
const ROUND_ANNOUNCE_FRAMES = 90;
const KO_FREEZE_FRAMES = 60;
const FINISH_HIM_FRAMES = 300;
const INTRO_FRAMES = 120;

// Hitstop
const HITSTOP_LIGHT = 6;
const HITSTOP_MEDIUM = 8;
const HITSTOP_HEAVY = 12;
const HITSTOP_SPECIAL = 15;

// Parry
const PARRY_WINDOW = 6;       // frames
const PARRY_STUN = 30;        // frames attacker is stunned

// Combo
const COMBO_DROP_FRAMES = 30;  // frames before combo resets
const MAX_JUGGLE_POINTS = 8;

// Meter
const MAX_METER = 300;
const METER_PER_HIT = 8;
const METER_PER_DAMAGE = 0.15;

// Camera
const CAMERA_LERP = 0.08;
const CAMERA_MIN_ZOOM = 0.85;
const CAMERA_MAX_ZOOM = 1.15;

/* ═══════════════════════════════════════════════════════
   HITBOX / HURTBOX SYSTEM (AABB)
   ═══════════════════════════════════════════════════════ */

interface AABB {
  x: number;      // left edge relative to fighter center
  y: number;      // top edge relative to fighter feet
  w: number;      // width
  h: number;      // height
}

interface HurtBoxSet {
  head: AABB;
  body: AABB;
  legs: AABB;
}

interface HitBox extends AABB {
  damage: number;
  hitstun: number;
  blockstun: number;
  pushbackHit: number;
  pushbackBlock: number;
  meterGain: number;
  juggleCost: number;
  launchForce: number;    // 0 = no launch, >0 = vertical launch velocity
  knockdownForce: number; // 0 = no knockdown, >0 = knockdown
  type: "high" | "mid" | "low" | "overhead" | "unblockable";
}

/** Default hurtboxes for standing fighter */
function getStandingHurtBoxes(facingRight: boolean): HurtBoxSet {
  const dir = facingRight ? 1 : -1;
  return {
    head: { x: -15 * dir, y: -FIGHTER_HEIGHT, w: 40, h: 45 },
    body: { x: -20 * dir, y: -FIGHTER_HEIGHT + 45, w: 50, h: 70 },
    legs: { x: -20 * dir, y: -FIGHTER_HEIGHT + 115, w: 50, h: 85 },
  };
}

function getCrouchingHurtBoxes(facingRight: boolean): HurtBoxSet {
  const dir = facingRight ? 1 : -1;
  return {
    head: { x: -15 * dir, y: -130, w: 40, h: 35 },
    body: { x: -20 * dir, y: -95, w: 55, h: 50 },
    legs: { x: -25 * dir, y: -45, w: 60, h: 45 },
  };
}

function getAirHurtBoxes(facingRight: boolean): HurtBoxSet {
  const dir = facingRight ? 1 : -1;
  return {
    head: { x: -15 * dir, y: -50, w: 40, h: 30 },
    body: { x: -20 * dir, y: -20, w: 50, h: 40 },
    legs: { x: -15 * dir, y: 20, w: 45, h: 40 },
  };
}

/** AABB overlap test — world coordinates */
function aabbOverlap(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

/** Convert a local-space AABB to world space given fighter position */
function toWorld(box: AABB, fx: number, fy: number, facingRight: boolean): { x: number; y: number; w: number; h: number } {
  const worldX = facingRight ? fx + box.x : fx - box.x - box.w;
  return { x: worldX, y: fy + box.y, w: box.w, h: box.h };
}

/* ═══════════════════════════════════════════════════════
   FRAME DATA — Per-move timing and hitbox data
   ═══════════════════════════════════════════════════════ */

interface MoveFrameData {
  startup: number;
  active: number;
  recovery: number;
  hitbox: HitBox;        // Active during active frames
  cancelWindow: number;  // Frames during active+recovery where cancel is allowed
}

/** Build frame data for a move based on archetype and frame profile */
function buildMoveData(
  profile: FrameProfile,
  move: "light_1" | "light_2" | "light_3" | "medium" | "heavy_release" |
        "light_kick" | "medium_kick" | "heavy_kick" |
        "crouch_light" | "crouch_medium" | "crouch_heavy" |
        "jump_light" | "jump_medium" | "jump_heavy"
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

function buildSpecialMoveData(special: SpecialMove, level: 1 | 2 | 3, profile: FrameProfile): MoveFrameData {
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
   PROJECTILE
   ═══════════════════════════════════════════════════════ */

interface Projectile2D {
  x: number;
  y: number;
  vx: number;
  vy: number;
  owner: 1 | 2;
  damage: number;
  hitstun: number;
  width: number;
  height: number;
  life: number;
  maxLife: number;
  color: string;
  secondaryColor: string;
}

/* ═══════════════════════════════════════════════════════
   HIT EFFECT / PARTICLE
   ═══════════════════════════════════════════════════════ */

interface HitParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: "spark" | "heavy" | "block" | "special" | "parry" | "dust" | "energy";
}

/* ═══════════════════════════════════════════════════
   HIT SPLASH SYSTEM (Ported from SF Engine)
   Stylized impact visuals with radial burst, speed lines,
   and floating damage numbers.
   ═══════════════════════════════════════════════════ */

interface HitSplash {
  x: number;
  y: number;
  timer: number;
  maxTimer: number;
  damage: number;
  color: string;
  type: "light" | "medium" | "heavy" | "special" | "block" | "parry";
  /** Radial speed lines angles (pre-computed for visual variety) */
  lineAngles: number[];
  /** Scale factor for the burst ring */
  scale: number;
}

interface DamageNumber {
  x: number;
  y: number;
  vy: number;
  damage: number;
  color: string;
  timer: number;
  maxTimer: number;
  isCritical: boolean;
}

/* ═══════════════════════════════════════════════════
   CONTROL HISTORY SYSTEM (Ported from SF Engine)
   Tracks directional input sequences for special move
   detection: QCF (236), DP (623), HCF (41236), etc.
   ═══════════════════════════════════════════════════ */

/** Numpad notation for directional inputs (relative to facing direction) */
type NumpadDir = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type MotionButton = "LP" | "MP" | "HP";

interface ControlHistoryEntry {
  input: NumpadDir | MotionButton;
  frame: number;
}

/** Special move motion definitions using numpad notation */
interface MotionSequence {
  name: string;
  /** Sequence of numpad directions + button, e.g. [2,3,6,"LP"] = QCF+LP */
  sequence: (NumpadDir | MotionButton)[];
  /** Which special level this triggers (1, 2, or 3) */
  level: 1 | 2 | 3;
}

/** Default motion inputs for special moves */
const SPECIAL_MOTIONS: MotionSequence[] = [
  // QCF (Quarter Circle Forward) + button = SP1
  { name: "QCF+LP", sequence: [2, 3, 6, "LP"], level: 1 },
  { name: "QCF+MP", sequence: [2, 3, 6, "MP"], level: 1 },
  { name: "QCF+HP", sequence: [2, 3, 6, "HP"], level: 1 },
  // DP (Dragon Punch / Shoryuken) + button = SP2
  { name: "DP+LP", sequence: [6, 2, 3, "LP"], level: 2 },
  { name: "DP+MP", sequence: [6, 2, 3, "MP"], level: 2 },
  { name: "DP+HP", sequence: [6, 2, 3, "HP"], level: 2 },
  // HCF (Half Circle Forward) + button = SP3
  { name: "HCF+LP", sequence: [4, 1, 2, 3, 6, "LP"], level: 3 },
  { name: "HCF+MP", sequence: [4, 1, 2, 3, 6, "MP"], level: 3 },
  { name: "HCF+HP", sequence: [4, 1, 2, 3, 6, "HP"], level: 3 },
];

/** Maximum age of a control history entry (in frames) before it expires */
const CONTROL_HISTORY_CAP = 120; // 2 seconds at 60fps
/** Minimum frames between re-polling the same input */
const CONTROL_HISTORY_REPOLL = 3;
/** Polling delay between input reads */
const CONTROL_HISTORY_POLL_DELAY = 2;

/* ═══════════════════════════════════════════════════
   SPRITE ANIMATION SYSTEM
   ═══════════════════════════════════════════════════════ */

interface SpriteSheet {
  idle: HTMLImageElement | null;
  attack: HTMLImageElement | null;
  block: HTMLImageElement | null;
  hit: HTMLImageElement | null;
  ko: HTMLImageElement | null;
  victory: HTMLImageElement | null;
  walkForward: HTMLImageElement | null;
  walkBack: HTMLImageElement | null;
  crouch: HTMLImageElement | null;
  dash: HTMLImageElement | null;
  lightPunch: HTMLImageElement | null;
  mediumPunch: HTMLImageElement | null;
  heavyPunch: HTMLImageElement | null;
  lightKick: HTMLImageElement | null;
  mediumKick: HTMLImageElement | null;
  heavyKick: HTMLImageElement | null;
  crouchPunch: HTMLImageElement | null;
  crouchKick: HTMLImageElement | null;
  sweep: HTMLImageElement | null;
  jump: HTMLImageElement | null;
  jumpAttack: HTMLImageElement | null;
  grab: HTMLImageElement | null;
  knockdown: HTMLImageElement | null;
  dizzy: HTMLImageElement | null;
  special: HTMLImageElement | null;
  taunt: HTMLImageElement | null;
}

// PoseKey defined at top of file

/** Map fighter state to the most specific pose key available.
 *  The renderer will fall back to base poses if the extended pose isn't loaded. */
function stateToPose(state: FighterState2D): PoseKey {
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
const POSE_FALLBACK: Partial<Record<PoseKey, PoseKey>> = {
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

/* ═══════════════════════════════════════════════════════
   INPUT SYSTEM — Keyboard + Touch
   ═══════════════════════════════════════════════════════ */

type InputAction2D =
  | "left" | "right" | "up" | "down"
  | "light" | "medium" | "heavy_start" | "heavy_release"
  | "special" | "block" | "block_release"
  | "dash_fwd" | "dash_back";

interface BufferedInput2D {
  action: InputAction2D;
  frame: number;
}

interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  light: boolean;
  medium: boolean;
  heavy: boolean;
  special: boolean;
  block: boolean;
  lightKick: boolean;
  mediumKick: boolean;
  heavyKick: boolean;
  taunt: boolean;
}

/* ═══════════════════════════════════════════════════════
   FIGHTER STATE
   ═══════════════════════════════════════════════════════ */

interface Fighter2D {
  data: FighterData;
  sprites: SpriteSheet;
  specials: CharacterSpecials;

  // Position & velocity (in game pixels)
  x: number;
  y: number;
  vx: number;
  vy: number;
  facingRight: boolean;

  // State machine
  state: FighterState2D;
  stateFrame: number;
  prevState: FighterState2D;

  // Health
  hp: number;
  maxHp: number;
  displayHp: number;

  // Combo
  comboCount: number;
  comboDamage: number;
  comboTimer: number;
  comboChain: number;  // gatling chain position (0=L1, 1=L2, 2=L3, 3=M, 4=H)

  // Juggle
  jugglePoints: number;
  airborne: boolean;

  // Meter (0-300)
  specialMeter: number;

  // Block / parry
  isParrying: boolean;
  parryFrames: number;
  blockFrame: number;

  // Invincibility
  invincibleFrames: number;

  // Dexterity (dodge)
  dexActive: boolean;
  dexFrames: number;

  // Heavy charge
  heavyChargeFrames: number;

  // Round wins
  roundWins: number;

  // AI
  aiStyle: AIStyle2D;
  aiTimer: number;
  aiDecision: string;
  aiComboStep: number;
  aiReactDelay: number;
  aiReactTimer: number;
  aiPressureTimer: number;
  aiDodgeCooldown: number;
  aiAggression: number;
  aiMistakeTimer: number;
  aiPatternMemory: string[];
  aiLastSeenState: FighterState2D;
  aiWhiffPunishWindow: number;

  // Stun
  stunFrames: number;

  // Dash
  dashCooldownFrames: number;

  // Hit tracking
  hitThisAttack: boolean;
  cancelUsed: boolean;

  // DOT / Buffs
  dotTimer: number;
  dotDamagePerTick: number;
  dotTickInterval: number;
  dotTickTimer: number;
  speedBuffTimer: number;
  speedBuffMult: number;
  defenseDebuffTimer: number;

  // Push velocity (knockback slide)
  pushVx: number;

  // Animation
  animFrame: number;
  currentPose: PoseKey;
  poseTimer: number;
  // Sprite animation blending
  prevPose: PoseKey;
  blendAlpha: number;   // 0 = showing prevPose, 1 = fully transitioned to currentPose
  blendFrames: number;  // total frames for the crossfade
  walkCycleFrame: number; // oscillates for walk animation

  // Crouch state
  isCrouching: boolean;

  // Control History (SF-ported input sequence detection)
  controlHistory: ControlHistoryEntry[];
  controlPollTimer: number;
  lastPolledInput: NumpadDir | null;
}

/* ═══════════════════════════════════════════════════════
   CAMERA
   ═══════════════════════════════════════════════════════ */

interface Camera2D {
  x: number;        // Center of viewport in world coords
  y: number;
  zoom: number;     // 1.0 = default
  targetX: number;
  targetY: number;
  targetZoom: number;
  shakeX: number;
  shakeY: number;
  shakeIntensity: number;
  shakeTimer: number;
}

/* ═══════════════════════════════════════════════════════
   SCREEN FLASH / HITSTOP
   ═══════════════════════════════════════════════════════ */

interface ScreenFlash {
  active: boolean;
  color: string;
  alpha: number;
  timer: number;
  duration: number;
}

interface HitStop {
  active: boolean;
  frames: number;
  remaining: number;
}

/* ═══════════════════════════════════════════════════════
   ARCHETYPE BASE STATS
   ═══════════════════════════════════════════════════════ */

const ARCHETYPE_WALK_SPEED: Record<FighterArchetype, number> = {
  rushdown: 4.5, powerhouse: 2.8, grappler: 2.5, zoner: 3.2,
  balanced: 3.5, glass_cannon: 5.0, tricky: 4.0, tank: 2.2,
};

const ARCHETYPE_DASH_SPEED: Record<FighterArchetype, number> = {
  rushdown: 12, powerhouse: 8, grappler: 7, zoner: 9,
  balanced: 10, glass_cannon: 14, tricky: 11, tank: 6,
};

const ARCHETYPE_JUMP_FORCE: Record<FighterArchetype, number> = {
  rushdown: 14, powerhouse: 11, grappler: 10, zoner: 12,
  balanced: 13, glass_cannon: 15, tricky: 14, tank: 9,
};

/* ═══════════════════════════════════════════════════════
   AI DIFFICULTY PROFILES
   ═══════════════════════════════════════════════════════ */

interface AIDifficultyProfile {
  reactionFrames: number;     // How many frames AI waits before reacting
  comboAccuracy: number;      // 0-1, chance of continuing combo
  blockRate: number;          // 0-1, chance of blocking on reaction
  antiAirRate: number;        // 0-1, chance of anti-airing jumps
  whiffPunishRate: number;    // 0-1, chance of punishing whiffed attacks
  specialUseRate: number;     // 0-1, how often AI uses specials
  mistakeRate: number;        // 0-1, chance of random mistake
  aggressionBase: number;     // 0-1, base aggression level
}

const AI_PROFILES: Record<Difficulty2D, AIDifficultyProfile> = {
  recruit: {
    reactionFrames: 30, comboAccuracy: 0.3, blockRate: 0.2, antiAirRate: 0.1,
    whiffPunishRate: 0.1, specialUseRate: 0.15, mistakeRate: 0.3, aggressionBase: 0.3,
  },
  soldier: {
    reactionFrames: 18, comboAccuracy: 0.55, blockRate: 0.45, antiAirRate: 0.3,
    whiffPunishRate: 0.3, specialUseRate: 0.3, mistakeRate: 0.15, aggressionBase: 0.5,
  },
  veteran: {
    reactionFrames: 10, comboAccuracy: 0.75, blockRate: 0.65, antiAirRate: 0.55,
    whiffPunishRate: 0.55, specialUseRate: 0.5, mistakeRate: 0.07, aggressionBase: 0.6,
  },
  archon: {
    reactionFrames: 4, comboAccuracy: 0.92, blockRate: 0.85, antiAirRate: 0.8,
    whiffPunishRate: 0.8, specialUseRate: 0.7, mistakeRate: 0.02, aggressionBase: 0.7,
  },
};

/* ═══════════════════════════════════════════════════════
   MAIN ENGINE CLASS
   ═══════════════════════════════════════════════════════ */

export class FightEngine2D {
  // Canvas
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // Fighters
  private p1!: Fighter2D;
  private p2!: Fighter2D;

  // Game state
  private phase: FightPhase2D = "intro";
  private round = 1;
  private roundTimer = ROUND_TIME * 60; // in frames
  private phaseTimer = 0;
  private frameCount = 0;
  private running = false;

  // Combat systems
  private projectiles: Projectile2D[] = [];
  private particles: HitParticle[] = [];
  private hitStop: HitStop = { active: false, frames: 0, remaining: 0 };
  private screenFlash: ScreenFlash = { active: false, color: "#fff", alpha: 0, timer: 0, duration: 0 };

  // SF-ported: Hit Splash system
  private hitSplashes: HitSplash[] = [];
  private damageNumbers: DamageNumber[] = [];

  // SF-ported: Control History special move sequences
  // QCF = ↓↘→ (2,3,6), QCB = ↓↙← (2,1,4), DP = →↓↘ (6,2,3)
  private readonly SPECIAL_INPUT_SEQUENCES: { name: string; sequence: NumpadDir[]; level: 1 | 2 | 3 }[] = [
    { name: 'qcf', sequence: [2, 3, 6], level: 1 },   // Quarter-circle forward
    { name: 'qcb', sequence: [2, 1, 4], level: 1 },   // Quarter-circle back
    { name: 'dp',  sequence: [6, 2, 3], level: 2 },    // Dragon punch
    { name: 'rdp', sequence: [4, 2, 1], level: 2 },    // Reverse dragon punch
    { name: 'hcf', sequence: [4, 1, 2, 3, 6], level: 3 }, // Half-circle forward
    { name: 'hcb', sequence: [6, 3, 2, 1, 4], level: 3 }, // Half-circle back
  ];

  // Camera
  private camera: Camera2D = {
    x: STAGE_WIDTH / 2, y: GAME_HEIGHT / 2, zoom: 1,
    targetX: STAGE_WIDTH / 2, targetY: GAME_HEIGHT / 2, targetZoom: 1,
    shakeX: 0, shakeY: 0, shakeIntensity: 0, shakeTimer: 0,
  };

  // Input
  private inputState: InputState = {
    left: false, right: false, up: false, down: false,
    light: false, medium: false, heavy: false, special: false, block: false,
    lightKick: false, mediumKick: false, heavyKick: false, taunt: false,
  };
  private inputBuffer: BufferedInput2D[] = [];
  private prevInputState: InputState = { ...this.inputState };

  // Difficulty & callbacks
  private difficulty: Difficulty2D;
  private aiProfile: AIDifficultyProfile;
  private callbacks: FightCallbacks2D;

  // Timing
  private lastTime = 0;
  private accumulator = 0;
  private rafId = 0;

  // Background
  private bgGradient: string;
  private floorColor: string;
  private ambientColor: string;
  private arenaId: string;

  // Sound
  private sound: FightSoundManager;

  // Announcements (for HUD)
  private announcement: { text: string; color: string; timer: number } | null = null;

  // Training mode
  private trainingMode: boolean;
  private trainingStats = { maxCombo: 0, totalDamage: 0, hitsLanded: 0 };
  private showHitboxes = false;
  private showFrameData = false;
  private trainingAutoRecover = true;
  private trainingInfiniteHealth = true;
  private trainingInfiniteMeter = false;

  constructor(
    canvas: HTMLCanvasElement,
    p1Data: FighterData,
    p2Data: FighterData,
    arenaId: string,
    bgGradient: string,
    floorColor: string,
    ambientColor: string,
    difficulty: Difficulty2D,
    callbacks: FightCallbacks2D,
    trainingMode = false,
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;
    this.difficulty = difficulty;
    this.aiProfile = AI_PROFILES[difficulty];
    this.callbacks = callbacks;
    this.bgGradient = bgGradient;
    this.floorColor = floorColor;
    this.ambientColor = ambientColor;
    this.arenaId = arenaId;
    this.trainingMode = trainingMode;

    // Initialize sound system
    this.sound = new FightSoundManager(arenaId);
    this.sound.init();
    if (trainingMode) {
      this.showHitboxes = true;
      this.showFrameData = true;
    }

    // Create fighters
    this.p1 = this.createFighter(p1Data, STAGE_WIDTH / 2 - 200, true);
    this.p2 = this.createFighter(p2Data, STAGE_WIDTH / 2 + 200, false);

    // Load sprites
    this.loadSprites(this.p1, p1Data);
    this.loadSprites(this.p2, p2Data);

    // Bind input handlers
    this.bindInputs();
  }

  /* ═══ FIGHTER CREATION ═══ */
  private createFighter(data: FighterData, startX: number, facingRight: boolean): Fighter2D {
    const specials = getCharacterSpecials(data.id);
    const arch = data.frameProfile.archetype;
    return {
      data,
      sprites: {
        idle: null, attack: null, block: null, hit: null, ko: null, victory: null,
        walkForward: null, walkBack: null, crouch: null, dash: null,
        lightPunch: null, mediumPunch: null, heavyPunch: null,
        lightKick: null, mediumKick: null, heavyKick: null,
        crouchPunch: null, crouchKick: null, sweep: null,
        jump: null, jumpAttack: null, grab: null,
        knockdown: null, dizzy: null, special: null, taunt: null,
      },
      specials,
      x: startX, y: FLOOR_Y, vx: 0, vy: 0,
      facingRight,
      state: "idle", stateFrame: 0, prevState: "idle",
      hp: data.hp, maxHp: data.hp, displayHp: data.hp,
      comboCount: 0, comboDamage: 0, comboTimer: 0, comboChain: 0,
      jugglePoints: MAX_JUGGLE_POINTS, airborne: false,
      specialMeter: 0,
      isParrying: false, parryFrames: 0, blockFrame: 0,
      invincibleFrames: 0,
      dexActive: false, dexFrames: 0,
      heavyChargeFrames: 0,
      roundWins: 0,
      aiStyle: (data.frameProfile.archetype === "rushdown" ? "aggressive" :
                data.frameProfile.archetype === "zoner" ? "defensive" :
                data.frameProfile.archetype === "tricky" ? "evasive" : "balanced") as AIStyle2D,
      aiTimer: 0, aiDecision: "idle", aiComboStep: 0,
      aiReactDelay: this.aiProfile?.reactionFrames ?? 18,
      aiReactTimer: 0, aiPressureTimer: 0, aiDodgeCooldown: 0,
      aiAggression: this.aiProfile?.aggressionBase ?? 0.5,
      aiMistakeTimer: 0, aiPatternMemory: [],
      aiLastSeenState: "idle", aiWhiffPunishWindow: 0,
      stunFrames: 0, dashCooldownFrames: 0,
      hitThisAttack: false, cancelUsed: false,
      dotTimer: 0, dotDamagePerTick: 0, dotTickInterval: 0, dotTickTimer: 0,
      speedBuffTimer: 0, speedBuffMult: 1, defenseDebuffTimer: 0,
      pushVx: 0,
      animFrame: 0, currentPose: "idle", poseTimer: 0,
      prevPose: "idle", blendAlpha: 1, blendFrames: 6, walkCycleFrame: 0,
      isCrouching: false,
      // Control History (SF-ported)
      controlHistory: [],
      controlPollTimer: 0,
      lastPolledInput: null,
    };
  }

  /* ═══ SPRITE LOADING ═══ */
  private loadSprites(fighter: Fighter2D, data: FighterData) {
    // Load all pose sprites from CharacterModel3D config
    const poses: Record<string, string> = {};
    try {
      const config = getCharacterConfig(data.id);
      if (config?.poseSprites) {
        const ps = config.poseSprites;
        // Base 6 poses
        if (ps.idle) poses.idle = ps.idle;
        if (ps.attack) poses.attack = ps.attack;
        if (ps.block) poses.block = ps.block;
        if (ps.hit) poses.hit = ps.hit;
        if (ps.ko) poses.ko = ps.ko;
        if (ps.victory) poses.victory = ps.victory;
        // Extended 20 poses (SF-ported)
        if (ps.walkForward) poses.walkForward = ps.walkForward;
        if (ps.walkBack) poses.walkBack = ps.walkBack;
        if (ps.crouch) poses.crouch = ps.crouch;
        if (ps.dash) poses.dash = ps.dash;
        if (ps.lightPunch) poses.lightPunch = ps.lightPunch;
        if (ps.mediumPunch) poses.mediumPunch = ps.mediumPunch;
        if (ps.heavyPunch) poses.heavyPunch = ps.heavyPunch;
        if (ps.lightKick) poses.lightKick = ps.lightKick;
        if (ps.mediumKick) poses.mediumKick = ps.mediumKick;
        if (ps.heavyKick) poses.heavyKick = ps.heavyKick;
        if (ps.crouchPunch) poses.crouchPunch = ps.crouchPunch;
        if (ps.crouchKick) poses.crouchKick = ps.crouchKick;
        if (ps.sweep) poses.sweep = ps.sweep;
        if (ps.jump) poses.jump = ps.jump;
        if (ps.jumpAttack) poses.jumpAttack = ps.jumpAttack;
        if (ps.grab) poses.grab = ps.grab;
        if (ps.knockdown) poses.knockdown = ps.knockdown;
        if (ps.dizzy) poses.dizzy = ps.dizzy;
        if (ps.special) poses.special = ps.special;
        if (ps.taunt) poses.taunt = ps.taunt;
      }
    } catch {
      // Config not found — use fallback
    }
    // Fallback: use the fighter's main image for base poses
    if (!poses.idle && data.image) {
      poses.idle = data.image;
      poses.attack = data.image;
      poses.block = data.image;
      poses.hit = data.image;
      poses.ko = data.image;
      poses.victory = data.image;
    }

    for (const [key, url] of Object.entries(poses)) {
      if (!url) continue;
      const img = new Image();
      // Note: crossOrigin removed intentionally. The CDN serves files as
      // application/octet-stream which can cause CORS-related rendering
      // issues in some browsers. The sprites already have proper alpha
      // transparency so no canvas pixel manipulation is needed.
      img.src = url;
      fighter.sprites[key as PoseKey] = img;
    }
  }

  /* ═══ INPUT BINDING ═══ */
  private keydownHandler = (e: KeyboardEvent) => {
    switch (e.code) {
      case "KeyA": case "ArrowLeft": this.inputState.left = true; break;
      case "KeyD": case "ArrowRight": this.inputState.right = true; break;
      case "KeyW": case "ArrowUp": this.inputState.up = true; break;
      case "KeyS": case "ArrowDown": this.inputState.down = true; break;
      // Punches: J/Z = light, K/X = medium, L/C = heavy
      case "KeyJ": case "KeyZ": this.inputState.light = true; break;
      case "KeyK": case "KeyX": this.inputState.medium = true; break;
      case "KeyL": case "KeyC": this.inputState.heavy = true; break;
      // Kicks: U = light kick, I = medium kick (moved special to O), O = heavy kick
      case "KeyU": this.inputState.lightKick = true; break;
      case "KeyH": this.inputState.mediumKick = true; break;
      case "KeyN": this.inputState.heavyKick = true; break;
      // Special: V
      case "KeyI": case "KeyV": this.inputState.special = true; break;
      case "Space": this.inputState.block = true; break;
      // Taunt: T
      case "KeyT": this.inputState.taunt = true; break;
    }
  };

  private keyupHandler = (e: KeyboardEvent) => {
    switch (e.code) {
      case "KeyA": case "ArrowLeft": this.inputState.left = false; break;
      case "KeyD": case "ArrowRight": this.inputState.right = false; break;
      case "KeyW": case "ArrowUp": this.inputState.up = false; break;
      case "KeyS": case "ArrowDown": this.inputState.down = false; break;
      case "KeyJ": case "KeyZ": this.inputState.light = false; break;
      case "KeyK": case "KeyX": this.inputState.medium = false; break;
      case "KeyL": case "KeyC": this.inputState.heavy = false; break;
      case "KeyU": this.inputState.lightKick = false; break;
      case "KeyH": this.inputState.mediumKick = false; break;
      case "KeyN": this.inputState.heavyKick = false; break;
      case "KeyI": case "KeyV": this.inputState.special = false; break;
      case "Space": this.inputState.block = false; break;
      case "KeyT": this.inputState.taunt = false; break;
    }
  };

  private bindInputs() {
    window.addEventListener("keydown", this.keydownHandler);
    window.addEventListener("keyup", this.keyupHandler);
  }

  private unbindInputs() {
    window.removeEventListener("keydown", this.keydownHandler);
    window.removeEventListener("keyup", this.keyupHandler);
  }

  /* ═══ TOUCH INPUT (from React wrapper) ═══ */
  /** Touch input auto-clear timers */
  private touchClearTimers: ReturnType<typeof setTimeout>[] = [];

  /** Set an inputState flag and auto-clear it after a short window */
  private setTouchInput(key: keyof InputState, value: boolean, autoClearMs = 100) {
    this.inputState[key] = value;
    if (value) {
      const timer = setTimeout(() => {
        this.inputState[key] = false;
      }, autoClearMs);
      this.touchClearTimers.push(timer);
    }
  }

  public handleTouchInput(input: TouchInput2D) {
    if (this.phase !== "fighting" && this.phase !== "finish_him") return;

    switch (input.type) {
      case "tap":
        if (input.side === "right") {
          // Light attack
          this.setTouchInput("light", true);
        } else {
          // Block
          this.setTouchInput("block", true, 200);
        }
        break;
      case "double_tap":
        if (input.side === "right") {
          // Light kick
          this.setTouchInput("lightKick", true);
        } else {
          // Dash back
          this.setTouchInput("left", true);
          setTimeout(() => {
            this.setTouchInput("left", false);
            this.setTouchInput("left", true);
          }, 30);
        }
        break;
      case "triple_tap":
        if (input.side === "right") {
          // Taunt
          this.setTouchInput("taunt", true);
        }
        break;
      case "swipe_right":
        if (input.side === "left") {
          // Move forward/backward
          const key = this.p1.facingRight ? "right" : "left";
          this.setTouchInput(key, true, 250);
        } else {
          // Medium punch
          this.setTouchInput("medium", true);
        }
        break;
      case "swipe_left":
        if (input.side === "left") {
          // Move backward/forward
          const key = this.p1.facingRight ? "left" : "right";
          this.setTouchInput(key, true, 250);
        } else {
          // Heavy kick
          this.setTouchInput("heavyKick", true);
        }
        break;
      case "swipe_up":
        if (input.side === "left") {
          // Jump
          this.setTouchInput("up", true);
        } else {
          // Special attack
          this.setTouchInput("special", true);
        }
        break;
      case "swipe_down":
        if (input.side === "left") {
          // Crouch
          this.setTouchInput("down", true, 300);
        } else {
          // Medium kick
          this.setTouchInput("mediumKick", true);
        }
        break;
      case "hold_start":
        if (input.side === "right") {
          // Heavy charge
          this.inputState.heavy = true;
        } else {
          // Block (hold)
          this.inputState.block = true;
        }
        break;
      case "hold_end":
        if (input.side === "right") {
          this.inputState.heavy = false;
        } else {
          this.inputState.block = false;
        }
        break;
    }
  }

  private bufferInput(action: InputAction2D) {
    this.inputBuffer.push({ action, frame: this.frameCount });
    // Keep buffer size manageable
    if (this.inputBuffer.length > INPUT_BUFFER_SIZE * 2) {
      this.inputBuffer = this.inputBuffer.slice(-INPUT_BUFFER_SIZE);
    }
  }

  /* ═══ PROCESS INPUT BUFFER ═══ */
  private processInputBuffer(fighter: Fighter2D): InputAction2D | null {
    const cutoff = this.frameCount - INPUT_BUFFER_WINDOW;
    // Find the oldest valid buffered input
    for (let i = 0; i < this.inputBuffer.length; i++) {
      if (this.inputBuffer[i].frame >= cutoff) {
        const action = this.inputBuffer[i].action;
        this.inputBuffer.splice(i, 1);
        return action;
      }
    }
    return null;
  }

  /* ═══ GAME LOOP ═══ */
  public start() {
    this.running = true;
    this.lastTime = performance.now();
    this.phase = "intro";
    this.phaseTimer = INTRO_FRAMES;
    this.callbacks.onPhaseChange?.("intro");
    // Start arena music
    this.sound.startArenaMusic();
    this.loop(performance.now());
  }
  public stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  public destroy() {
    this.stop();
    this.unbindInputs();
    // Clean up touch input timers
    this.touchClearTimers.forEach(t => clearTimeout(t));
    this.touchClearTimers = [];
    // Clean up sound
    this.sound.dispose();
  }

  /** Toggle sound mute — returns new muted state */
  public toggleMute(): boolean {
    return this.sound.toggleMute();
  }

  /** Check if sound is muted */
  public isMuted(): boolean {
    return this.sound.isMuted();
  }

  private loop = (now: number) => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this.loop);

    const dt = now - this.lastTime;
    this.lastTime = now;
    this.accumulator += Math.min(dt, 100); // Cap to prevent spiral of death

    // Fixed timestep updates
    while (this.accumulator >= FIXED_DT) {
      this.accumulator -= FIXED_DT;
      this.fixedUpdate();
    }

    // Render at display rate
    this.render();
  };

  /* ═══ FIXED UPDATE (60fps game logic) ═══ */
  private fixedUpdate() {
    this.frameCount++;

    // Hitstop — freeze game logic but keep rendering
    if (this.hitStop.active) {
      this.hitStop.remaining--;
      if (this.hitStop.remaining <= 0) {
        this.hitStop.active = false;
      }
      return;
    }

    switch (this.phase) {
      case "intro":
        this.updateIntro();
        break;
      case "round_announce":
        this.updateRoundAnnounce();
        break;
      case "fighting":
        this.updateFighting();
        break;
      case "finish_him":
        this.updateFinishHim();
        break;
      case "ko":
        this.updateKO();
        break;
      case "round_end":
        this.updateRoundEnd();
        break;
      case "match_end":
        // Nothing — waiting for external cleanup
        break;
    }

    // Always update visual effects
    this.updateParticles();
    this.updateProjectiles();
    this.updateHitSplashes(); // SF-ported
    this.updateCamera();
    this.updateScreenFlashTimer();

    // Update announcement timer
    if (this.announcement) {
      this.announcement.timer--;
      if (this.announcement.timer <= 0) this.announcement = null;
    }
  }

  /* ═══ PHASE: INTRO ═══ */
  private updateIntro() {
    this.phaseTimer--;
    // Fighters walk toward each other
    if (this.phaseTimer > 30) {
      const targetDist = 250;
      const midX = STAGE_WIDTH / 2;
      const targetP1 = midX - targetDist / 2;
      const targetP2 = midX + targetDist / 2;
      this.p1.x += (targetP1 - this.p1.x) * 0.05;
      this.p2.x += (targetP2 - this.p2.x) * 0.05;
    }
    if (this.phaseTimer <= 0) {
      this.setPhase("round_announce");
    }
  }

  /* ═══ PHASE: ROUND ANNOUNCE ═══ */
  private updateRoundAnnounce() {
    this.phaseTimer--;
    if (this.phaseTimer === ROUND_ANNOUNCE_FRAMES - 1) {
      this.announce(`ROUND ${this.round}`, this.ambientColor, 60);
      this.sound.playRoundFanfare();
      this.sound.announce(`Round ${this.round}`);
    }
    if (this.phaseTimer === 30) {
      this.announce("FIGHT!", "#ef4444", 40);
      this.sound.play("round_bell");
      this.sound.announce("Fight!");
    }
    if (this.phaseTimer <= 0) {
      this.setPhase("fighting");
    }
  }

  /* ═══ PHASE: FIGHTING ═══ */
  private updateFighting() {
    // Timer countdown
    this.roundTimer--;
    if (this.roundTimer <= 0) {
      // Time's up — whoever has more HP wins
      const winner: 1 | 2 = this.p1.hp >= this.p2.hp ? 1 : 2;
      this.triggerRoundEnd(winner);
      return;
    }

    // Process P1 input
    this.processP1Input();

    // Process P2 AI
    this.processAI(this.p2, this.p1);

    // Update both fighters
    this.updateFighter(this.p1);
    this.updateFighter(this.p2);

    // Resolve push boxes (prevent overlap)
    this.resolvePushBoxes();

    // Check hits
    this.checkAllHits();

    // Check projectile collisions
    this.checkProjectileHits();

    // Stage boundaries
    this.enforceStageBounds(this.p1);
    this.enforceStageBounds(this.p2);

    // Check for KO
    this.checkKO();

    // Update display HP (smooth drain)
    this.updateDisplayHp(this.p1);
    this.updateDisplayHp(this.p2);

    // Report health
    this.callbacks.onHealthChange?.(this.p1.hp, this.p1.maxHp, this.p2.hp, this.p2.maxHp);

    // Training mode: auto-recover P2 health & meter
    if (this.trainingMode) {
      if (this.trainingInfiniteHealth) {
        // Slowly regenerate P2 health when not in hitstun
        if (this.p2.state === "idle" || this.p2.state === "walk_fwd" || this.p2.state === "walk_back") {
          if (this.p2.hp < this.p2.maxHp) {
            this.p2.hp = Math.min(this.p2.maxHp, this.p2.hp + 2);
            this.p2.displayHp = this.p2.hp;
          }
        }
      }
      if (this.trainingInfiniteMeter) {
        this.p1.specialMeter = MAX_METER;
      }
      if (this.trainingAutoRecover && this.p2.hp <= 0) {
        // Auto-revive the dummy
        this.p2.hp = this.p2.maxHp;
        this.p2.displayHp = this.p2.maxHp;
        this.changeState(this.p2, "idle");
        this.p2.y = FLOOR_Y;
        this.p2.vy = 0;
        this.p2.airborne = false;
        this.p2.jugglePoints = MAX_JUGGLE_POINTS;
      }
    }
  }

  /* ═══ P1 INPUT PROCESSING ═══ */
  private processP1Input() {
    const f = this.p1;

    // SF-ported: Always poll control history (even when not actionable)
    this.pollControlHistory(f);

    if (!this.isActionable(f)) {
      // Still check for buffered inputs during recovery
      return;
    }

    // Detect new button presses (rising edge)
    const lightPressed = this.inputState.light && !this.prevInputState.light;
    const mediumPressed = this.inputState.medium && !this.prevInputState.medium;
    const heavyPressed = this.inputState.heavy && !this.prevInputState.heavy;
    const lightKickPressed = this.inputState.lightKick && !this.prevInputState.lightKick;
    const mediumKickPressed = this.inputState.mediumKick && !this.prevInputState.mediumKick;
    const heavyKickPressed = this.inputState.heavyKick && !this.prevInputState.heavyKick;
    const specialPressed = this.inputState.special && !this.prevInputState.special;
    const blockPressed = this.inputState.block;
    const upPressed = this.inputState.up && !this.prevInputState.up;
    const downHeld = this.inputState.down;
    const tauntPressed = this.inputState.taunt && !this.prevInputState.taunt;

    // Save previous state for edge detection
    this.prevInputState = { ...this.inputState };

    // SF-ported: Record button presses into control history for motion detection
    if (lightPressed) this.recordButtonPress(f, "LP");
    if (mediumPressed) this.recordButtonPress(f, "MP");
    if (heavyPressed) this.recordButtonPress(f, "HP");
    if (lightKickPressed) this.recordButtonPress(f, "LP");
    if (mediumKickPressed) this.recordButtonPress(f, "MP");
    if (heavyKickPressed) this.recordButtonPress(f, "HP");

    // SF-ported: Check for motion input specials (QCF, DP, HCF + button)
    // This takes priority over the simple special button
    if (lightPressed || mediumPressed || heavyPressed || lightKickPressed || mediumKickPressed || heavyKickPressed) {
      const motionResult = this.checkMotionInputs(f);
      if (motionResult && f.specialMeter >= motionResult.level * 100) {
        this.activateSpecial(f, motionResult.level);
        return;
      }
    }

    // Block
    if (blockPressed && this.isGrounded(f)) {
      if (downHeld) {
        this.changeState(f, "block_crouch");
      } else {
        this.changeState(f, "block_stand");
      }
      f.blockFrame = this.frameCount;
      f.isParrying = f.parryFrames > 0 || (this.frameCount - f.blockFrame <= PARRY_WINDOW);
      f.parryFrames = Math.max(0, PARRY_WINDOW - (this.frameCount - f.blockFrame));
      return;
    }

    // Special moves (check meter) — fallback for dedicated special button
    if (specialPressed) {
      if (f.specialMeter >= 300) {
        this.activateSpecial(f, 3);
        return;
      } else if (f.specialMeter >= 200) {
        this.activateSpecial(f, 2);
        return;
      } else if (f.specialMeter >= 100) {
        this.activateSpecial(f, 1);
        return;
      }
    }

    // Jump
    if (upPressed && this.isGrounded(f)) {
      if (this.inputState.right) {
        this.changeState(f, "jump_fwd");
      } else if (this.inputState.left) {
        this.changeState(f, "jump_back");
      } else {
        this.changeState(f, "jump_up");
      }
      f.vy = -(ARCHETYPE_JUMP_FORCE[f.data.frameProfile.archetype] * f.data.frameProfile.jumpForceMult);
      f.airborne = true;
      return;
    }

    // Crouch
    if (downHeld && this.isGrounded(f)) {
      if (!f.isCrouching) {
        this.changeState(f, "crouch_down");
        f.isCrouching = true;
      }
      // Crouch attacks
      if (lightPressed) { this.changeState(f, "crouch_light"); return; }
      if (mediumPressed) { this.changeState(f, "crouch_medium"); return; }
      if (heavyPressed) { this.changeState(f, "crouch_heavy"); return; }
      return;
    } else if (f.isCrouching && !downHeld) {
      f.isCrouching = false;
      this.changeState(f, "crouch_up");
    }

    // Air attacks
    if (f.airborne) {
      if (lightPressed) { this.changeState(f, "jump_light"); return; }
      if (mediumPressed) { this.changeState(f, "jump_medium"); return; }
      if (heavyPressed) { this.changeState(f, "jump_heavy"); return; }
    }

    // Taunt (only when fully idle and grounded)
    if (tauntPressed && this.isGrounded(f) && f.state === "idle") {
      this.changeState(f, "taunt");
      return;
    }

    // Ground attacks — Punches
    if (lightPressed && this.isGrounded(f)) {
      // Gatling chain
      if (f.state === "light_1" && f.comboChain === 0) {
        this.changeState(f, "light_2");
        f.comboChain = 1;
      } else if (f.state === "light_2" && f.comboChain === 1) {
        this.changeState(f, "light_3");
        f.comboChain = 2;
      } else {
        this.changeState(f, "light_1");
        f.comboChain = 0;
      }
      return;
    }
    if (mediumPressed && this.isGrounded(f)) {
      this.changeState(f, "medium");
      f.comboChain = 3;
      return;
    }
    if (heavyPressed && this.isGrounded(f)) {
      this.changeState(f, "heavy_charge");
      f.heavyChargeFrames = 0;
      return;
    }

    // Ground attacks — Kicks
    if (lightKickPressed && this.isGrounded(f)) {
      this.changeState(f, "light_kick");
      return;
    }
    if (mediumKickPressed && this.isGrounded(f)) {
      this.changeState(f, "medium_kick");
      f.comboChain = 3;
      return;
    }
    if (heavyKickPressed && this.isGrounded(f)) {
      this.changeState(f, "heavy_kick");
      return;
    }

    // Movement
    const walkSpeed = ARCHETYPE_WALK_SPEED[f.data.frameProfile.archetype] * f.data.frameProfile.walkSpeedMult *
                      (f.speedBuffTimer > 0 ? f.speedBuffMult : 1);
    if (this.inputState.right) {
      f.vx = f.facingRight ? walkSpeed : -walkSpeed;
      this.changeState(f, f.facingRight ? "walk_fwd" : "walk_back");
    } else if (this.inputState.left) {
      f.vx = f.facingRight ? -walkSpeed : walkSpeed;
      this.changeState(f, f.facingRight ? "walk_back" : "walk_fwd");
    } else if (this.isGrounded(f) && f.state !== "idle") {
      if (f.state === "walk_fwd" || f.state === "walk_back") {
        this.changeState(f, "idle");
        f.vx = 0;
      }
    }
  }

  /* ═══ FIGHTER UPDATE ═══ */
  private updateFighter(f: Fighter2D) {
    f.stateFrame++;
    f.animFrame++;

    // Gravity
    if (f.airborne || f.y < FLOOR_Y) {
      f.vy += GRAVITY;
      f.y += f.vy;
      if (f.y >= FLOOR_Y) {
        f.y = FLOOR_Y;
        f.vy = 0;
        f.airborne = false;
        f.jugglePoints = MAX_JUGGLE_POINTS;
        if (f.state === "launched" || f.state === "air_hitstun") {
          this.changeState(f, "knockdown");
        } else if (f.state.startsWith("jump")) {
          this.changeState(f, "jump_land");
        }
      }
    }

    // Apply velocity
    f.x += f.vx;

    // Push velocity (knockback slide with friction)
    if (Math.abs(f.pushVx) > 0.1) {
      f.x += f.pushVx;
      f.pushVx *= 0.85; // friction
    } else {
      f.pushVx = 0;
    }

    // Facing direction (always face opponent)
    const opponent = f === this.p1 ? this.p2 : this.p1;
    if (this.isActionable(f) || f.state === "idle" || f.state === "walk_fwd" || f.state === "walk_back") {
      f.facingRight = f.x < opponent.x;
    }

    // State transitions
    this.updateStateTransitions(f);

    // Decrement timers
    if (f.invincibleFrames > 0) f.invincibleFrames--;
    if (f.dexFrames > 0) { f.dexFrames--; if (f.dexFrames <= 0) f.dexActive = false; }
    if (f.dashCooldownFrames > 0) f.dashCooldownFrames--;
    if (f.stunFrames > 0) f.stunFrames--;
    if (f.speedBuffTimer > 0) f.speedBuffTimer--;
    if (f.defenseDebuffTimer > 0) f.defenseDebuffTimer--;

    // Combo timer
    if (f.comboCount > 0) {
      f.comboTimer++;
      if (f.comboTimer > COMBO_DROP_FRAMES) {
        f.comboCount = 0;
        f.comboDamage = 0;
        f.comboTimer = 0;
        f.comboChain = 0;
      }
    }

    // DOT
    if (f.dotTimer > 0) {
      f.dotTimer--;
      f.dotTickTimer++;
      if (f.dotTickTimer >= f.dotTickInterval) {
        f.dotTickTimer = 0;
        f.hp = Math.max(1, f.hp - f.dotDamagePerTick);
        const pid: 1 | 2 = f === this.p1 ? 1 : 2;
        this.callbacks.onDot?.(pid, f.dotDamagePerTick);
      }
    }

    // Heavy charge
    if (f.state === "heavy_charge") {
      f.heavyChargeFrames++;
      // Auto-release after 45 frames
      if (f.heavyChargeFrames >= 45 || (f === this.p1 && !this.inputState.heavy)) {
        this.changeState(f, "heavy_release");
      }
    }

    // Update sprite pose with crossfade blending
    const targetPose = stateToPose(f.state);
    if (targetPose !== f.currentPose) {
      f.prevPose = f.currentPose;
      f.currentPose = targetPose;
      f.poseTimer = 0;
      f.blendAlpha = 0;
      // Faster blend for attacks, slower for movement transitions
      const isAttack = targetPose === "lightPunch" || targetPose === "mediumPunch" || targetPose === "heavyPunch" ||
                        targetPose === "lightKick" || targetPose === "mediumKick" || targetPose === "heavyKick" ||
                        targetPose === "crouchPunch" || targetPose === "crouchKick" || targetPose === "sweep" ||
                        targetPose === "jumpAttack" || targetPose === "special" || targetPose === "grab" ||
                        targetPose === "taunt";
      f.blendFrames = isAttack ? ((targetPose as string) === "taunt" ? 8 : 3) : 6;
    }
    // Advance blend alpha
    if (f.blendAlpha < 1) {
      f.blendAlpha = Math.min(1, f.blendAlpha + 1 / f.blendFrames);
    }
    f.poseTimer++;
    // Walk cycle frame for oscillating between poses
    if (f.state === "walk_fwd" || f.state === "walk_back") {
      f.walkCycleFrame++;
    } else {
      f.walkCycleFrame = 0;
    }
  }

  /* ═══ STATE TRANSITIONS ═══ */
  private updateStateTransitions(f: Fighter2D) {
    const totalFrames = this.getStateTotalFrames(f);
    if (f.stateFrame >= totalFrames) {
      switch (f.state) {
        case "light_1": case "light_2": case "light_3":
        case "medium": case "heavy_release":
        case "light_kick": case "medium_kick": case "heavy_kick":
        case "crouch_light": case "crouch_medium": case "crouch_heavy":
          this.changeState(f, f.isCrouching ? "crouch" : "idle");
          f.vx = 0;
          break;
        case "taunt":
          this.changeState(f, "idle");
          // Taunt grants a small meter bonus
          f.specialMeter = Math.min(MAX_METER, f.specialMeter + 25);
          break;
        case "jump_light": case "jump_medium": case "jump_heavy":
          // Stay airborne, return to jump state
          break;
        case "jump_land": case "crouch_down": case "crouch_up":
        case "getup": case "throw_whiff":
          this.changeState(f, f.isCrouching ? "crouch" : "idle");
          break;
        case "dash_fwd": case "dash_back":
          this.changeState(f, "idle");
          f.vx = 0;
          break;
        case "hitstun": case "blockstun": case "parry_stun":
          this.changeState(f, "idle");
          f.vx = 0;
          break;
        case "knockdown":
          if (f.stateFrame >= 40) {
            this.changeState(f, "getup");
            f.invincibleFrames = 10;
          }
          break;
        case "launched":
          // Stays launched until landing
          break;
        case "special_1": case "special_2": case "special_3":
          this.changeState(f, "idle");
          f.vx = 0;
          break;
        case "finish_stun":
          // Stay in finish stun
          break;
        case "ko":
          // Stay KO'd
          break;
        case "victory":
          // Stay in victory
          break;
        default:
          // idle, walk, crouch, jump — continuous states
          break;
      }
    }
  }

  private getStateTotalFrames(f: Fighter2D): number {
    const profile = f.data.frameProfile;
    switch (f.state) {
      case "light_1": case "light_2": case "light_3": {
        const md = buildMoveData(profile, f.state);
        return md.startup + md.active + md.recovery;
      }
      case "medium": {
        const md = buildMoveData(profile, "medium");
        return md.startup + md.active + md.recovery;
      }
      case "heavy_release": {
        const md = buildMoveData(profile, "heavy_release");
        return md.startup + md.active + md.recovery;
      }
      case "light_kick": case "medium_kick": case "heavy_kick": {
        const md = buildMoveData(profile, f.state);
        return md.startup + md.active + md.recovery;
      }
      case "crouch_light": case "crouch_medium": case "crouch_heavy": {
        const md = buildMoveData(profile, f.state);
        return md.startup + md.active + md.recovery;
      }
      case "jump_light": case "jump_medium": case "jump_heavy": {
        const md = buildMoveData(profile, f.state);
        return md.startup + md.active + md.recovery;
      }
      case "special_1": {
        const md = buildSpecialMoveData(f.specials.sp1, 1, profile);
        return md.startup + md.active + md.recovery;
      }
      case "special_2": {
        const md = buildSpecialMoveData(f.specials.sp2, 2, profile);
        return md.startup + md.active + md.recovery;
      }
      case "special_3": {
        const md = buildSpecialMoveData(f.specials.sp3, 3, profile);
        return md.startup + md.active + md.recovery;
      }
      case "hitstun": case "blockstun": return f.stunFrames;
      case "parry_stun": return PARRY_STUN;
      case "knockdown": return 60;
      case "getup": return 15;
      case "dash_fwd": case "dash_back": return 18;
      case "jump_land": return 4;
      case "crouch_down": return 4;
      case "crouch_up": return 4;
      case "throw_startup": return 5;
      case "throw_whiff": return 20;
      case "taunt": return 60; // Taunt animation lasts ~1 second
      default: return 9999; // Continuous states
    }
  }

  /* ═══ HIT DETECTION (AABB) ═══ */
  private checkAllHits() {
    this.checkHitPair(this.p1, this.p2);
    this.checkHitPair(this.p2, this.p1);
  }

  private checkHitPair(attacker: Fighter2D, defender: Fighter2D) {
    if (!this.isInAttackState(attacker)) return;
    if (attacker.hitThisAttack) return;

    const moveData = this.getMoveData(attacker);
    if (!moveData) return;

    const frame = attacker.stateFrame;
    // Only check during active frames
    if (frame < moveData.startup || frame >= moveData.startup + moveData.active) return;

    // Get attacker's hitbox in world space
    const hitboxWorld = toWorld(moveData.hitbox, attacker.x, attacker.y, attacker.facingRight);

    // Get defender's hurtboxes in world space
    const hurtBoxes = this.getHurtBoxes(defender);
    const hurtWorld = {
      head: toWorld(hurtBoxes.head, defender.x, defender.y, defender.facingRight),
      body: toWorld(hurtBoxes.body, defender.x, defender.y, defender.facingRight),
      legs: toWorld(hurtBoxes.legs, defender.x, defender.y, defender.facingRight),
    };

    // Check overlap with any hurtbox zone
    let hitZone: "head" | "body" | "legs" | null = null;
    if (aabbOverlap(hitboxWorld, hurtWorld.head)) hitZone = "head";
    else if (aabbOverlap(hitboxWorld, hurtWorld.body)) hitZone = "body";
    else if (aabbOverlap(hitboxWorld, hurtWorld.legs)) hitZone = "legs";

    if (!hitZone) return;

    // Invincibility check
    if (defender.invincibleFrames > 0) return;

    // Dexterity dodge
    if (defender.dexActive) {
      const pid: 1 | 2 = defender === this.p1 ? 1 : 2;
      this.callbacks.onDex?.(pid);
      return;
    }

    attacker.hitThisAttack = true;

    // Determine if blocked
    const isBlocking = defender.state === "block_stand" || defender.state === "block_crouch" || defender.state === "blockstun";
    const isParrying = defender.isParrying && defender.parryFrames > 0;

    // Check block type validity
    const hitType = moveData.hitbox.type;
    let blockValid = isBlocking;
    if (blockValid) {
      if (hitType === "low" && defender.state === "block_stand") blockValid = false; // Must crouch block lows
      if (hitType === "overhead" && defender.state === "block_crouch") blockValid = false; // Must stand block overheads
      if (hitType === "unblockable") blockValid = false;
    }

    if (isParrying) {
      this.resolveParry(attacker, defender);
    } else if (blockValid) {
      this.resolveBlock(attacker, defender, moveData);
    } else {
      this.resolveHit(attacker, defender, moveData, hitZone);
    }
  }

  private getHurtBoxes(f: Fighter2D): HurtBoxSet {
    if (f.airborne) return getAirHurtBoxes(f.facingRight);
    if (f.isCrouching || f.state === "crouch" || f.state === "crouch_down" ||
        f.state === "block_crouch" || f.state.startsWith("crouch_")) {
      return getCrouchingHurtBoxes(f.facingRight);
    }
    return getStandingHurtBoxes(f.facingRight);
  }

  /* ═══ HIT RESOLUTION ═══ */
  private resolveHit(attacker: Fighter2D, defender: Fighter2D, moveData: MoveFrameData, hitZone: "head" | "body" | "legs") {
    const hb = moveData.hitbox;
    const atkId: 1 | 2 = attacker === this.p1 ? 1 : 2;
    const defId: 1 | 2 = defender === this.p1 ? 1 : 2;

    // Damage calculation with combo scaling
    const comboScale = Math.max(0.2, 1 - defender.comboCount * 0.08);
    const defMult = defender.defenseDebuffTimer > 0 ? 1.2 : 1;
    const headBonus = hitZone === "head" ? 1.15 : 1;
    const damage = Math.floor(hb.damage * comboScale * defMult * headBonus);

    defender.hp = Math.max(0, defender.hp - damage);

    // Hitstun
    if (defender.airborne || hb.launchForce > 0) {
      this.changeState(defender, "air_hitstun");
      defender.vy = -hb.launchForce;
      defender.airborne = true;
      defender.jugglePoints -= hb.juggleCost;
    } else if (hb.knockdownForce > 0) {
      this.changeState(defender, "launched");
      defender.vy = -hb.knockdownForce;
      defender.airborne = true;
    } else {
      this.changeState(defender, "hitstun");
      defender.stunFrames = hb.hitstun;
    }

    // Pushback
    const pushDir = attacker.facingRight ? 1 : -1;
    defender.pushVx = hb.pushbackHit * pushDir;

    // Combo tracking
    const opponent = attacker === this.p1 ? this.p2 : this.p1;
    opponent.comboCount++;
    opponent.comboDamage += damage;
    opponent.comboTimer = 0;
    this.callbacks.onCombo?.(atkId, opponent.comboCount, opponent.comboDamage);

    // Meter gain
    attacker.specialMeter = Math.min(MAX_METER, attacker.specialMeter + hb.meterGain);
    defender.specialMeter = Math.min(MAX_METER, defender.specialMeter + Math.floor(hb.meterGain * METER_PER_DAMAGE * damage));

    // Check meter levels
    for (const level of [1, 2, 3]) {
      if (attacker.specialMeter >= level * 100) {
        this.callbacks.onSpecialReady?.(atkId, level);
      }
    }

    // Hitstop
    const stopFrames = this.isSpecialAttack(attacker.state) ? HITSTOP_SPECIAL :
                       attacker.state.includes("heavy") ? HITSTOP_HEAVY :
                       attacker.state.includes("medium") ? HITSTOP_MEDIUM : HITSTOP_LIGHT;
    this.hitStop = { active: true, frames: stopFrames, remaining: stopFrames };

    // Visual effects
    const hitX = (attacker.x + defender.x) / 2;
    const hitY = hitZone === "head" ? defender.y - FIGHTER_HEIGHT + 30 :
                 hitZone === "body" ? defender.y - FIGHTER_HEIGHT / 2 :
                 defender.y - 30;
    this.spawnHitParticles(hitX, hitY, attacker.data.color, "spark", 8);

    // SF-ported: Hit splash effect with damage number
    const splashType: HitSplash["type"] = this.isSpecialAttack(attacker.state) ? "special" :
                      attacker.state.includes("heavy") ? "heavy" :
                      attacker.state.includes("medium") ? "medium" : "light";
    this.spawnHitSplash(hitX, hitY, damage, attacker.data.color, splashType);

    // Screen shake
    const shakeIntensity = this.isSpecialAttack(attacker.state) ? 8 :
                           attacker.state.includes("heavy") ? 5 : 2;
    this.triggerScreenShake(shakeIntensity, 8);

    // Sound effects for hit
    if (this.isSpecialAttack(attacker.state)) {
      this.sound.play("special");
    } else if (attacker.state.includes("heavy")) {
      this.sound.play(attacker.state.includes("kick") ? "kick_heavy" : "punch_heavy");
    } else if (attacker.state.includes("medium")) {
      this.sound.play(attacker.state.includes("kick") ? "kick_light" : "punch_light");
    } else {
      this.sound.play("punch_light");
    }
    this.sound.play("grunt_hit");
    // Combo callouts
    if (opponent.comboCount >= 5) {
      this.sound.play("toasty");
    } else if (opponent.comboCount >= 3) {
      this.sound.play("combo_hit");
    }

    // Callbacks
    this.callbacks.onHit?.(atkId, attacker.state);

    // Training stats
    if (this.trainingMode) {
      this.trainingStats.hitsLanded++;
      this.trainingStats.totalDamage += damage;
      if (opponent.comboCount > this.trainingStats.maxCombo) {
        this.trainingStats.maxCombo = opponent.comboCount;
      }
    }
  }

  private resolveBlock(attacker: Fighter2D, defender: Fighter2D, moveData: MoveFrameData) {
    const hb = moveData.hitbox;
    const atkId: 1 | 2 = attacker === this.p1 ? 1 : 2;

    // Blockstun
    this.changeState(defender, "blockstun");
    defender.stunFrames = hb.blockstun;

    // Chip damage for specials
    if (this.isSpecialAttack(attacker.state)) {
      const chip = Math.floor(hb.damage * 0.1);
      defender.hp = Math.max(1, defender.hp - chip); // Can't kill with chip
    }

    // Pushback (more on block)
    const pushDir = attacker.facingRight ? 1 : -1;
    defender.pushVx = hb.pushbackBlock * pushDir;
    attacker.pushVx = -hb.pushbackBlock * pushDir * 0.3; // Attacker also pushed back slightly

    // Small hitstop on block
    this.hitStop = { active: true, frames: 4, remaining: 4 };

    // Block particles
    const hitX = (attacker.x + defender.x) / 2;
    const hitY = defender.y - FIGHTER_HEIGHT / 2;
    this.spawnHitParticles(hitX, hitY, "#ffffff", "block", 4);

    // SF-ported: Block splash effect
    this.spawnHitSplash(hitX, hitY, 0, "#ffffff", "block");

    // Meter gain for defender (reward blocking)
    defender.specialMeter = Math.min(MAX_METER, defender.specialMeter + 5);

    this.sound.play("block");
    this.callbacks.onHit?.(atkId, "blocked");
  }

  private resolveParry(attacker: Fighter2D, defender: Fighter2D) {
    const atkId: 1 | 2 = attacker === this.p1 ? 1 : 2;
    const defId: 1 | 2 = defender === this.p1 ? 1 : 2;

    // Attacker gets stunned
    this.changeState(attacker, "parry_stun");
    attacker.stunFrames = PARRY_STUN;

    // Defender recovers instantly
    this.changeState(defender, "idle");
    defender.isParrying = false;
    defender.specialMeter = Math.min(MAX_METER, defender.specialMeter + 30);

    // Big hitstop
    this.hitStop = { active: true, frames: 12, remaining: 12 };

    // Parry flash
    const hitX = (attacker.x + defender.x) / 2;
    const hitY = defender.y - FIGHTER_HEIGHT / 2;
    this.spawnHitParticles(hitX, hitY, "#00ffff", "parry", 12);
    this.triggerScreenFlash("#00ffff", 0.3, 6);
    this.triggerScreenShake(4, 10);

    // SF-ported: Parry splash effect
    this.spawnHitSplash(hitX, hitY, 0, "#00ffff", "parry");

    this.callbacks.onParry?.(defId);
    this.sound.play("parry_flash");
    this.callbacks.onHit?.(atkId, "parried");
  }

  /* ═══ SPECIAL MOVES ═══ */
  private activateSpecial(f: Fighter2D, level: 1 | 2 | 3) {
    const cost = level * 100;
    if (f.specialMeter < cost) return;
    f.specialMeter -= cost;

    const special = level === 1 ? f.specials.sp1 : level === 2 ? f.specials.sp2 : f.specials.sp3;
    const stateKey: FighterState2D = level === 1 ? "special_1" : level === 2 ? "special_2" : "special_3";
    this.changeState(f, stateKey);

    const pid: 1 | 2 = f === this.p1 ? 1 : 2;
    this.callbacks.onSpecialActivate?.(pid, level, special.name, special.type);

    // Projectile specials
    if (special.type === "projectile") {
      const dir = f.facingRight ? 1 : -1;
      this.projectiles.push({
        x: f.x + dir * 50,
        y: f.y - FIGHTER_HEIGHT / 2,
        vx: dir * (8 + level * 2),
        vy: 0,
        owner: pid,
        damage: 30 * f.data.frameProfile.damageMult * special.damage,
        hitstun: 15 + level * 3,
        width: 40 + level * 10,
        height: 30 + level * 5,
        life: 120,
        maxLife: 120,
        color: special.color,
        secondaryColor: special.secondaryColor || special.color,
      });
    }

    // Rush specials — move forward
    if (special.type === "rush") {
      const dir = f.facingRight ? 1 : -1;
      f.vx = dir * (ARCHETYPE_DASH_SPEED[f.data.frameProfile.archetype] * 1.5);
      f.invincibleFrames = 5;
    }

    // Buff specials
    if (special.type === "buff") {
      if (special.speedBuff) {
        f.speedBuffTimer = 300; // 5 seconds
        f.speedBuffMult = special.speedBuff;
      }
      if (special.heal) {
        const healAmount = Math.floor(f.maxHp * special.heal * 0.01);
        f.hp = Math.min(f.maxHp, f.hp + healAmount);
        this.callbacks.onHeal?.(pid, healAmount);
      }
    }

    // Drain specials
    if (special.type === "drain") {
      const opponent = f === this.p1 ? this.p2 : this.p1;
      if (special.defenseDebuff) {
        opponent.defenseDebuffTimer = 300;
      }
    }

    // DOT specials
    if (special.dot) {
      const opponent = f === this.p1 ? this.p2 : this.p1;
      opponent.dotTimer = 180; // 3 seconds
      opponent.dotDamagePerTick = special.dot;
      opponent.dotTickInterval = 30; // every 0.5s
      opponent.dotTickTimer = 0;
    }

    // Visual effects
    this.triggerScreenFlash(special.color, 0.4, special.flashDuration / 16);
    this.triggerScreenShake(special.screenShake, 15);
    this.spawnHitParticles(f.x, f.y - FIGHTER_HEIGHT / 2, special.color, "special", special.particleCount);
  }

  /* ═══ PROJECTILE SYSTEM ═══ */
  private checkProjectileHits() {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      const target = proj.owner === 1 ? this.p2 : this.p1;

      // Projectile-vs-opponent collision
      const projBox = { x: proj.x - proj.width / 2, y: proj.y - proj.height / 2, w: proj.width, h: proj.height };
      const targetBox = { x: target.x - FIGHTER_WIDTH / 2, y: target.y - FIGHTER_HEIGHT, w: FIGHTER_WIDTH, h: FIGHTER_HEIGHT };

      if (aabbOverlap(projBox, targetBox) && target.invincibleFrames <= 0 && !target.dexActive) {
        // Hit!
        const isBlocking = target.state === "block_stand" || target.state === "block_crouch" || target.state === "blockstun";
        if (isBlocking) {
          const chip = Math.floor(proj.damage * 0.15);
          target.hp = Math.max(1, target.hp - chip);
          this.changeState(target, "blockstun");
          target.stunFrames = 10;
          target.pushVx = (proj.vx > 0 ? 1 : -1) * 5;
          this.spawnHitParticles(proj.x, proj.y, "#ffffff", "block", 4);
        } else {
          target.hp = Math.max(0, target.hp - Math.floor(proj.damage));
          this.changeState(target, "hitstun");
          target.stunFrames = proj.hitstun;
          target.pushVx = (proj.vx > 0 ? 1 : -1) * 6;
          this.spawnHitParticles(proj.x, proj.y, proj.color, "energy", 10);
          this.triggerScreenShake(3, 6);

          // Combo
          const atkId = proj.owner;
          const attacker = atkId === 1 ? this.p1 : this.p2;
          attacker.comboCount++;
          attacker.comboDamage += Math.floor(proj.damage);
          attacker.comboTimer = 0;
          this.callbacks.onCombo?.(atkId, attacker.comboCount, attacker.comboDamage);
          this.callbacks.onHit?.(atkId, "projectile");
        }
        this.projectiles.splice(i, 1);
        continue;
      }

      // Projectile-vs-projectile collision
      for (let j = this.projectiles.length - 1; j >= 0; j--) {
        if (i === j) continue;
        const other = this.projectiles[j];
        if (proj.owner === other.owner) continue;
        const otherBox = { x: other.x - other.width / 2, y: other.y - other.height / 2, w: other.width, h: other.height };
        if (aabbOverlap(projBox, otherBox)) {
          // Both projectiles destroy each other
          this.spawnHitParticles((proj.x + other.x) / 2, (proj.y + other.y) / 2, "#ffffff", "energy", 12);
          this.projectiles.splice(Math.max(i, j), 1);
          this.projectiles.splice(Math.min(i, j), 1);
          i = Math.min(i, this.projectiles.length);
          break;
        }
      }
    }
  }

  private updateProjectiles() {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.x += proj.vx;
      proj.y += proj.vy;
      proj.life--;
      if (proj.life <= 0 || proj.x < -100 || proj.x > STAGE_WIDTH + 100) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  /* ═══ PUSH BOX RESOLUTION ═══ */
  private resolvePushBoxes() {
    const p1Left = this.p1.x - PUSH_BOX_WIDTH / 2;
    const p1Right = this.p1.x + PUSH_BOX_WIDTH / 2;
    const p2Left = this.p2.x - PUSH_BOX_WIDTH / 2;
    const p2Right = this.p2.x + PUSH_BOX_WIDTH / 2;

    if (p1Right > p2Left && p1Left < p2Right) {
      const overlap = Math.min(p1Right - p2Left, p2Right - p1Left);
      const push = overlap / 2 + 1;
      if (this.p1.x < this.p2.x) {
        this.p1.x -= push;
        this.p2.x += push;
      } else {
        this.p1.x += push;
        this.p2.x -= push;
      }
    }
  }

  /* ═══ STAGE BOUNDS ═══ */
  private enforceStageBounds(f: Fighter2D) {
    const halfW = PUSH_BOX_WIDTH / 2;
    if (f.x - halfW < 0) { f.x = halfW; f.vx = 0; }
    if (f.x + halfW > STAGE_WIDTH) { f.x = STAGE_WIDTH - halfW; f.vx = 0; }
  }

  /* ═══ KO CHECK ═══ */
  private checkKO() {
    if (this.p1.hp <= 0 || this.p2.hp <= 0) {
      const loser = this.p1.hp <= 0 ? this.p1 : this.p2;
      const winner = loser === this.p1 ? this.p2 : this.p1;

      // Check for finish him
      if (this.phase === "fighting" && loser.hp <= 0) {
        // If attacker has enough meter, trigger finish him
        if (winner.specialMeter >= 100 && !this.trainingMode) {
          this.changeState(loser, "finish_stun");
          this.setPhase("finish_him");
          this.callbacks.onFinishHim?.(loser === this.p1 ? 1 : 2);
          return;
        }
        this.triggerKO(loser);
      }
    }
  }

  private triggerKO(loser: Fighter2D) {
    this.changeState(loser, "ko");
    const winner = loser === this.p1 ? this.p2 : this.p1;
    const winnerId: 1 | 2 = winner === this.p1 ? 1 : 2;

    this.announce("K.O.!", "#ef4444", 90);
    this.triggerScreenFlash("#ef4444", 0.5, 15);
    this.triggerScreenShake(10, 20);
    this.sound.play("ko");
    this.sound.play("dramatic_boom");
    this.sound.announce("K.O.!");

    this.setPhase("ko");
  }

  private triggerRoundEnd(winner: 1 | 2) {
    const w = winner === 1 ? this.p1 : this.p2;
    w.roundWins++;
    this.changeState(w, "victory");
    this.sound.playVictoryFanfare();

    const perfect = (winner === 1 ? this.p1.hp === this.p1.maxHp : this.p2.hp === this.p2.maxHp);
    if (perfect) {
      this.announce("PERFECT!", "#f59e0b", 90);
      this.sound.announce("Perfect!");
    }

    this.callbacks.onRoundEnd?.(winner, this.p1.roundWins, this.p2.roundWins);

    if (w.roundWins >= ROUNDS_TO_WIN) {
      this.setPhase("match_end");
      this.callbacks.onMatchEnd?.(winner);
    } else {
      this.round++;
      this.setPhase("round_end");
    }
  }

  /* ═══ PHASE: FINISH HIM ═══ */
  private updateFinishHim() {
    this.phaseTimer++;
    if (this.phaseTimer >= FINISH_HIM_FRAMES) {
      // Time's up, just KO
      const loser = this.p1.hp <= 0 ? this.p1 : this.p2;
      this.triggerKO(loser);
    }
  }

  /* ═══ PHASE: KO ═══ */
  private updateKO() {
    this.phaseTimer++;
    if (this.phaseTimer >= KO_FREEZE_FRAMES) {
      const winner: 1 | 2 = this.p1.hp > 0 ? 1 : 2;
      this.triggerRoundEnd(winner);
    }
  }

  /* ═══ PHASE: ROUND END ═══ */
  private updateRoundEnd() {
    this.phaseTimer++;
    if (this.phaseTimer >= 90) {
      // Reset for next round
      this.resetRound();
      this.setPhase("round_announce");
    }
  }

  private resetRound() {
    this.roundTimer = ROUND_TIME * 60;
    const midX = STAGE_WIDTH / 2;
    this.resetFighter(this.p1, midX - 200, true);
    this.resetFighter(this.p2, midX + 200, false);
    this.projectiles = [];
    this.particles = [];
  }

  private resetFighter(f: Fighter2D, x: number, facingRight: boolean) {
    f.x = x;
    f.y = FLOOR_Y;
    f.vx = 0;
    f.vy = 0;
    f.facingRight = facingRight;
    f.state = "idle";
    f.stateFrame = 0;
    f.hp = f.maxHp;
    f.displayHp = f.maxHp;
    f.comboCount = 0;
    f.comboDamage = 0;
    f.comboTimer = 0;
    f.comboChain = 0;
    f.jugglePoints = MAX_JUGGLE_POINTS;
    f.airborne = false;
    f.specialMeter = 0;
    f.isParrying = false;
    f.parryFrames = 0;
    f.invincibleFrames = 0;
    f.dexActive = false;
    f.dexFrames = 0;
    f.stunFrames = 0;
    f.hitThisAttack = false;
    f.cancelUsed = false;
    f.pushVx = 0;
    f.dotTimer = 0;
    f.speedBuffTimer = 0;
    f.defenseDebuffTimer = 0;
    f.isCrouching = false;
  }

  /* ═══ AI SYSTEM ═══ */
  private processAI(ai: Fighter2D, player: Fighter2D) {
    ai.aiTimer++;
    if (ai.aiTimer < ai.aiReactDelay) return;

    const dist = Math.abs(ai.x - player.x);
    const profile = this.aiProfile;

    // Mistake check
    if (Math.random() < profile.mistakeRate) {
      ai.aiTimer = 0;
      return; // AI does nothing (mistake)
    }

    // React to player attacks — block
    if (this.isInAttackState(player) && dist < 150) {
      if (Math.random() < profile.blockRate) {
        if (player.state.startsWith("crouch_")) {
          this.changeState(ai, "block_crouch");
        } else {
          this.changeState(ai, "block_stand");
        }
        ai.blockFrame = this.frameCount;
        ai.isParrying = this.frameCount - ai.blockFrame <= PARRY_WINDOW;
        ai.parryFrames = PARRY_WINDOW;
        ai.aiTimer = 0;
        return;
      }
    }

    // Anti-air
    if (player.airborne && dist < 200 && Math.random() < profile.antiAirRate) {
      this.changeState(ai, "heavy_release");
      ai.hitThisAttack = false;
      ai.aiTimer = 0;
      return;
    }

    // Whiff punish — use kicks or punches
    if (this.isInRecovery(player) && dist < 120 && Math.random() < profile.whiffPunishRate) {
      const useKick = Math.random() < 0.4;
      this.changeState(ai, useKick ? "medium_kick" : "medium");
      ai.hitThisAttack = false;
      ai.aiTimer = 0;
      return;
    }

    // Combo continuation
    if (ai.comboCount > 0 && Math.random() < profile.comboAccuracy) {
      if (ai.comboChain < 2) {
        const nextState: FighterState2D = ai.comboChain === 0 ? "light_2" : "light_3";
        this.changeState(ai, nextState);
        ai.comboChain++;
        ai.hitThisAttack = false;
        ai.aiTimer = 0;
        return;
      } else if (ai.comboChain === 2) {
        this.changeState(ai, "medium");
        ai.comboChain = 3;
        ai.hitThisAttack = false;
        ai.aiTimer = 0;
        return;
      }
    }

    // Special move usage
    if (ai.specialMeter >= 100 && Math.random() < profile.specialUseRate && dist < 250) {
      const level: 1 | 2 | 3 = ai.specialMeter >= 300 ? 3 : ai.specialMeter >= 200 ? 2 : 1;
      this.activateSpecial(ai, level);
      ai.aiTimer = 0;
      return;
    }

    // Approach or zone based on style
    if (!this.isActionable(ai)) return;

    const arch = ai.data.frameProfile.archetype;
    const idealDist = arch === "zoner" ? 400 : arch === "grappler" ? 80 : arch === "rushdown" ? 100 : 180;

    if (dist > idealDist + 50) {
      // Move closer — occasionally dash for faster approach
      const dir = ai.x < player.x ? 1 : -1;
      const walkSpeed = ARCHETYPE_WALK_SPEED[arch] * ai.data.frameProfile.walkSpeedMult;
      if (dist > idealDist + 150 && Math.random() < profile.aggressionBase * 0.5 && ai.dashCooldownFrames <= 0) {
        // Dash approach for closing large gaps
        this.changeState(ai, "dash_fwd");
        ai.vx = dir * walkSpeed * 2.5;
        ai.dashCooldownFrames = 30;
      } else {
        ai.vx = dir * walkSpeed;
        this.changeState(ai, dir === (ai.facingRight ? 1 : -1) ? "walk_fwd" : "walk_back");
      }
    } else if (dist < idealDist - 30) {
      // Move away — occasionally dash back for safety
      const dir = ai.x < player.x ? -1 : 1;
      const walkSpeed = ARCHETYPE_WALK_SPEED[arch] * ai.data.frameProfile.walkSpeedMult;
      if (Math.random() < 0.2 && ai.dashCooldownFrames <= 0) {
        this.changeState(ai, "dash_back");
        ai.vx = dir * walkSpeed * 2.5;
        ai.dashCooldownFrames = 30;
      } else {
        ai.vx = dir * walkSpeed;
        this.changeState(ai, "walk_back");
      }
    } else {
      // In range — attack with varied options
      if (Math.random() < ai.aiAggression) {
        const roll = Math.random();
        if (roll < 0.35) {
          // Punch combo starter
          this.changeState(ai, "light_1");
          ai.comboChain = 0;
        } else if (roll < 0.48) {
          // Light kick (fast poke)
          this.changeState(ai, "light_kick");
        } else if (roll < 0.60) {
          // Medium kick (mid-range)
          this.changeState(ai, "medium_kick");
        } else if (roll < 0.70) {
          // Heavy kick (high damage)
          this.changeState(ai, "heavy_kick");
        } else if (roll < 0.80) {
          // Medium punch
          this.changeState(ai, "medium");
        } else if (roll < 0.88) {
          // Crouch attack mix-up (low)
          ai.isCrouching = true;
          this.changeState(ai, "crouch_light");
        } else if (roll < 0.94 && dist < 80) {
          // Throw attempt at close range
          this.changeState(ai, "throw_startup");
        } else {
          // Jump-in attack for pressure
          if (Math.random() < 0.5) {
            this.changeState(ai, "jump_fwd");
            ai.vy = -(ARCHETYPE_JUMP_FORCE[arch] * ai.data.frameProfile.jumpForceMult);
            ai.airborne = true;
          } else {
            // Heavy punch for damage
            this.changeState(ai, "heavy_charge");
            ai.heavyChargeFrames = 0;
          }
        }
        ai.hitThisAttack = false;
      } else {
        // Idle — but occasionally reposition
        if (Math.random() < 0.3) {
          const dir = ai.x < player.x ? 1 : -1;
          const walkSpeed = ARCHETYPE_WALK_SPEED[arch] * ai.data.frameProfile.walkSpeedMult;
          ai.vx = dir * walkSpeed * 0.5;
          this.changeState(ai, "walk_fwd");
        } else {
          this.changeState(ai, "idle");
          ai.vx = 0;
        }
      }
    }

    ai.aiTimer = 0;
  }

  /* ═══ HELPER METHODS ═══ */
  private isActionable(f: Fighter2D): boolean {
    return f.state === "idle" || f.state === "walk_fwd" || f.state === "walk_back" ||
           f.state === "crouch" || f.state === "crouch_down";
    // Note: taunt is NOT actionable — player is locked in for the full animation
  }

  private isGrounded(f: Fighter2D): boolean {
    return !f.airborne && f.y >= FLOOR_Y;
  }

  private isInAttackState(f: Fighter2D): boolean {
    return f.state === "light_1" || f.state === "light_2" || f.state === "light_3" ||
           f.state === "medium" || f.state === "heavy_release" ||
           f.state === "light_kick" || f.state === "medium_kick" || f.state === "heavy_kick" ||
           f.state === "crouch_light" || f.state === "crouch_medium" || f.state === "crouch_heavy" ||
           f.state === "jump_light" || f.state === "jump_medium" || f.state === "jump_heavy" ||
           f.state === "special_1" || f.state === "special_2" || f.state === "special_3";
  }

  private isSpecialAttack(state: FighterState2D): boolean {
    return state === "special_1" || state === "special_2" || state === "special_3";
  }

  private isInRecovery(f: Fighter2D): boolean {
    if (!this.isInAttackState(f)) return false;
    const md = this.getMoveData(f);
    if (!md) return false;
    return f.stateFrame >= md.startup + md.active;
  }

  private getMoveData(f: Fighter2D): MoveFrameData | null {
    const profile = f.data.frameProfile;
    switch (f.state) {
      case "light_1": return buildMoveData(profile, "light_1");
      case "light_2": return buildMoveData(profile, "light_2");
      case "light_3": return buildMoveData(profile, "light_3");
      case "medium": return buildMoveData(profile, "medium");
      case "heavy_release": return buildMoveData(profile, "heavy_release");
      case "light_kick": return buildMoveData(profile, "light_kick");
      case "medium_kick": return buildMoveData(profile, "medium_kick");
      case "heavy_kick": return buildMoveData(profile, "heavy_kick");
      case "crouch_light": return buildMoveData(profile, "crouch_light");
      case "crouch_medium": return buildMoveData(profile, "crouch_medium");
      case "crouch_heavy": return buildMoveData(profile, "crouch_heavy");
      case "jump_light": return buildMoveData(profile, "jump_light");
      case "jump_medium": return buildMoveData(profile, "jump_medium");
      case "jump_heavy": return buildMoveData(profile, "jump_heavy");
      case "special_1": return buildSpecialMoveData(f.specials.sp1, 1, profile);
      case "special_2": return buildSpecialMoveData(f.specials.sp2, 2, profile);
      case "special_3": return buildSpecialMoveData(f.specials.sp3, 3, profile);
      default: return null;
    }
  }

  private changeState(f: Fighter2D, newState: FighterState2D) {
    if (f.state === newState && f.stateFrame < 2) return; // Prevent re-entry flicker
    f.prevState = f.state;
    f.state = newState;
    f.stateFrame = 0;
    f.hitThisAttack = false;
    f.cancelUsed = false;

    // Sound triggers on state entry
    switch (newState) {
      case "dash_fwd":
      case "dash_back":
        this.sound.play("dash_whoosh");
        break;
      case "knockdown":
        this.sound.play("impact_ground");
        this.sound.play("body_thud");
        break;
      case "light_1":
      case "light_2":
      case "light_3":
        this.sound.play("whoosh");
        break;
      case "medium":
      case "crouch_medium":
      case "medium_kick":
        this.sound.play("whoosh");
        this.sound.play("grunt_attack");
        break;
      case "light_kick":
        this.sound.play("whoosh");
        break;
      case "heavy_kick":
        this.sound.play("grunt_attack");
        break;
      case "taunt":
        this.sound.play("grunt_attack");
        break;
      case "heavy_charge":
      case "heavy_release":
      case "crouch_heavy":
        this.sound.play("grunt_attack");
        break;
      case "special_1":
      case "special_2":
      case "special_3":
        this.sound.play("grunt_attack");
        break;
      case "finish_stun":
        this.sound.play("crowd_gasp");
        this.sound.announce("Finish Him!");
        break;
    }
  }

  private setPhase(phase: FightPhase2D) {
    this.phase = phase;
    this.phaseTimer = 0;
    switch (phase) {
      case "round_announce": this.phaseTimer = ROUND_ANNOUNCE_FRAMES; break;
    }
    this.callbacks.onPhaseChange?.(phase);
  }

  private updateDisplayHp(f: Fighter2D) {
    if (f.displayHp > f.hp) {
      f.displayHp = Math.max(f.hp, f.displayHp - Math.max(1, (f.displayHp - f.hp) * 0.1));
    }
  }

  /* ═══ VISUAL EFFECTS ═══ */
  private spawnHitParticles(x: number, y: number, color: string, type: HitParticle["type"], count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 3,
        life: 15 + Math.random() * 15,
        maxLife: 30,
        color,
        size: 2 + Math.random() * 4,
        type,
      });
    }
  }

  private updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // gravity
      p.life--;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  private triggerScreenShake(intensity: number, duration: number) {
    this.camera.shakeIntensity = intensity;
    this.camera.shakeTimer = duration;
  }

  private triggerScreenFlash(color: string, alpha: number, duration: number) {
    this.screenFlash = { active: true, color, alpha, timer: duration, duration };
  }

  private updateScreenFlashTimer() {
    if (this.screenFlash.active) {
      this.screenFlash.timer--;
      if (this.screenFlash.timer <= 0) this.screenFlash.active = false;
    }
  }

  private announce(text: string, color: string, duration: number) {
    this.announcement = { text, color, timer: duration };
  }

  /* ═══════════════════════════════════════════════════════
     SF-PORTED: CONTROL HISTORY SYSTEM
     Polls directional input each frame, converts to numpad
     notation relative to facing direction, and checks for
     special move motion sequences (QCF, DP, HCF, etc.).
     ═══════════════════════════════════════════════════════ */

  /** Convert raw input state to numpad direction relative to facing */
  private inputToNumpad(input: InputState, facingRight: boolean): NumpadDir {
    const l = facingRight ? input.left : input.right; // back
    const r = facingRight ? input.right : input.left; // forward
    const u = input.up;
    const d = input.down;
    if (u && r) return 9;
    if (u && l) return 7;
    if (d && r) return 3;
    if (d && l) return 1;
    if (u) return 8;
    if (d) return 2;
    if (r) return 6;
    if (l) return 4;
    return 5; // neutral
  }

  /** Poll and record the current directional input into the fighter's control history */
  private pollControlHistory(f: Fighter2D) {
    f.controlPollTimer++;
    if (f.controlPollTimer < CONTROL_HISTORY_POLL_DELAY) return;
    f.controlPollTimer = 0;

    const dir = this.inputToNumpad(this.inputState, f.facingRight);
    // Only record if the direction changed (avoid flooding with neutral)
    if (dir === f.lastPolledInput && dir === 5) return;
    f.lastPolledInput = dir;

    f.controlHistory.push({ input: dir, frame: this.frameCount });

    // Trim old entries
    const cutoff = this.frameCount - CONTROL_HISTORY_CAP;
    while (f.controlHistory.length > 0 && f.controlHistory[0].frame < cutoff) {
      f.controlHistory.shift();
    }
  }

  /** Record a button press into the control history */
  private recordButtonPress(f: Fighter2D, button: MotionButton) {
    f.controlHistory.push({ input: button, frame: this.frameCount });
  }

  /** Check if the fighter's control history matches any special move motion */
  private checkMotionInputs(f: Fighter2D): { level: 1 | 2 | 3; name: string } | null {
    if (f.controlHistory.length < 3) return null;

    // Check each motion sequence (longest first for priority)
    const sorted = [...SPECIAL_MOTIONS].sort((a, b) => b.sequence.length - a.sequence.length);

    for (const motion of sorted) {
      if (this.matchMotionSequence(f.controlHistory, motion.sequence)) {
        // Clear history after successful match to prevent double-triggers
        f.controlHistory = [];
        return { level: motion.level, name: motion.name };
      }
    }
    return null;
  }

  /** Check if the recent control history ends with the given motion sequence */
  private matchMotionSequence(
    history: ControlHistoryEntry[],
    sequence: (NumpadDir | MotionButton)[],
  ): boolean {
    if (history.length < sequence.length) return false;

    // Work backwards from the end of history
    let seqIdx = sequence.length - 1;
    let histIdx = history.length - 1;
    const maxGap = 15; // Max frames between inputs in the sequence

    while (seqIdx >= 0 && histIdx >= 0) {
      const entry = history[histIdx];
      const expected = sequence[seqIdx];

      if (entry.input === expected) {
        // Check timing gap (except for the first element)
        if (seqIdx < sequence.length - 1) {
          const nextEntry = history[histIdx + 1];
          if (nextEntry && nextEntry.frame - entry.frame > maxGap) return false;
        }
        seqIdx--;
      }
      histIdx--;
    }

    return seqIdx < 0; // All sequence elements matched
  }

  /* ═══════════════════════════════════════════════════════
     SF-PORTED: HIT SPLASH & DAMAGE NUMBER SYSTEM
     Stylized radial burst impact effects with speed lines
     and floating damage numbers on hit/block/parry.
     ═══════════════════════════════════════════════════════ */

  /** Spawn a hit splash effect at the given position */
  private spawnHitSplash(
    x: number, y: number, damage: number, color: string,
    type: HitSplash["type"],
  ) {
    const numLines = type === "special" ? 12 : type === "heavy" ? 10 : type === "parry" ? 8 : 6;
    const lineAngles: number[] = [];
    for (let i = 0; i < numLines; i++) {
      lineAngles.push((Math.PI * 2 * i) / numLines + (Math.random() - 0.5) * 0.3);
    }
    const scale = type === "special" ? 1.8 : type === "heavy" ? 1.4 : type === "parry" ? 1.2 : 1.0;
    const duration = type === "special" ? 20 : type === "heavy" ? 16 : 12;

    this.hitSplashes.push({
      x, y,
      timer: duration,
      maxTimer: duration,
      damage,
      color,
      type,
      lineAngles,
      scale,
    });

    // Also spawn a floating damage number
    if (damage > 0 && type !== "block") {
      this.damageNumbers.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y - 20,
        vy: -2.5,
        damage,
        color,
        timer: 45,
        maxTimer: 45,
        isCritical: type === "special" || type === "heavy",
      });
    }
  }

  /** Update hit splash and damage number timers */
  private updateHitSplashes() {
    for (let i = this.hitSplashes.length - 1; i >= 0; i--) {
      this.hitSplashes[i].timer--;
      if (this.hitSplashes[i].timer <= 0) this.hitSplashes.splice(i, 1);
    }
    for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
      const dn = this.damageNumbers[i];
      dn.y += dn.vy;
      dn.vy *= 0.95; // decelerate
      dn.timer--;
      if (dn.timer <= 0) this.damageNumbers.splice(i, 1);
    }
  }

  /** Render hit splash effects (called in world space) */
  private renderHitSplashes(ctx: CanvasRenderingContext2D) {
    for (const splash of this.hitSplashes) {
      const progress = 1 - splash.timer / splash.maxTimer;
      const alpha = 1 - progress;
      const expandRadius = 30 * splash.scale * progress;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(splash.x, splash.y);

      // Radial burst ring
      ctx.beginPath();
      ctx.arc(0, 0, expandRadius, 0, Math.PI * 2);
      ctx.strokeStyle = splash.color;
      ctx.lineWidth = 3 * (1 - progress);
      ctx.stroke();

      // Inner flash
      if (progress < 0.3) {
        const flashAlpha = (0.3 - progress) / 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, expandRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = splash.type === "parry" ? "#00ffff" : "#ffffff";
        ctx.globalAlpha = flashAlpha * 0.8;
        ctx.fill();
        ctx.globalAlpha = alpha;
      }

      // Speed lines
      for (const angle of splash.lineAngles) {
        const innerR = expandRadius * 0.5;
        const outerR = expandRadius + 15 * splash.scale * (1 - progress);
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);
        ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
        ctx.strokeStyle = splash.color;
        ctx.lineWidth = 2 * (1 - progress);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  /** Render floating damage numbers (called in world space) */
  private renderDamageNumbers(ctx: CanvasRenderingContext2D) {
    for (const dn of this.damageNumbers) {
      const progress = 1 - dn.timer / dn.maxTimer;
      const alpha = progress < 0.7 ? 1 : 1 - (progress - 0.7) / 0.3;
      const scale = dn.isCritical ? 1.3 + Math.sin(progress * Math.PI) * 0.3 : 1.0;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(dn.x, dn.y);
      ctx.scale(scale, scale);

      const fontSize = dn.isCritical ? 22 : 16;
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Text shadow
      ctx.fillStyle = "#000";
      ctx.fillText(`-${dn.damage}`, 1, 1);

      // Main text
      ctx.fillStyle = dn.color;
      ctx.fillText(`-${dn.damage}`, 0, 0);

      ctx.restore();
    }
  }

  /* ═══════════════════════════════════════════════════════
     SF-PORTED: ENHANCED SHADOW SYSTEM
     Perspective-correct elliptical shadows that scale with
     fighter height above ground.
     ═══════════════════════════════════════════════════════ */

  /** Render a perspective shadow beneath a fighter */
  private renderFighterShadow(ctx: CanvasRenderingContext2D, f: Fighter2D) {
    const heightAboveGround = FLOOR_Y - f.y;
    // Shadow shrinks and becomes more transparent as fighter rises
    const heightFactor = Math.max(0, 1 - heightAboveGround / 300);
    if (heightFactor <= 0) return;

    const shadowWidth = (FIGHTER_WIDTH * 0.8) * heightFactor;
    const shadowHeight = 8 * heightFactor;
    const shadowAlpha = 0.35 * heightFactor;

    ctx.save();
    ctx.globalAlpha = shadowAlpha;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(f.x, FLOOR_Y + 2, shadowWidth / 2, shadowHeight / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* ═══ CAMERA ═══ */
  private updateCamera() {
    // Target: midpoint between fighters
    const midX = (this.p1.x + this.p2.x) / 2;
    const midY = Math.min(this.p1.y, this.p2.y) - FIGHTER_HEIGHT / 2;
    this.camera.targetX = midX;
    this.camera.targetY = midY + GAME_HEIGHT * 0.15;

    // Zoom based on distance
    const dist = Math.abs(this.p1.x - this.p2.x);
    const idealZoom = Math.max(CAMERA_MIN_ZOOM, Math.min(CAMERA_MAX_ZOOM, GAME_WIDTH / (dist + 300)));
    this.camera.targetZoom = idealZoom;

    // Lerp
    this.camera.x += (this.camera.targetX - this.camera.x) * CAMERA_LERP;
    this.camera.y += (this.camera.targetY - this.camera.y) * CAMERA_LERP;
    this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * CAMERA_LERP;

    // Screen shake
    if (this.camera.shakeTimer > 0) {
      this.camera.shakeTimer--;
      const t = this.camera.shakeTimer / 20;
      this.camera.shakeX = (Math.random() - 0.5) * this.camera.shakeIntensity * t;
      this.camera.shakeY = (Math.random() - 0.5) * this.camera.shakeIntensity * t;
    } else {
      this.camera.shakeX = 0;
      this.camera.shakeY = 0;
    }
  }

  /* ═══════════════════════════════════════════════════════
     RENDERING
     ═══════════════════════════════════════════════════════ */

   private render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    // Clear the canvas each frame to prevent visual artifacts
    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // Camera transform
    const cx = this.camera.x + this.camera.shakeX;
    const cy = this.camera.y + this.camera.shakeY;
    const zoom = this.camera.zoom;

    ctx.translate(w / 2, h / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-cx, -cy + GAME_HEIGHT * 0.35);

    // Background
    this.renderBackground(ctx);

    // Floor
    this.renderFloor(ctx);

    // SF-ported: Perspective shadows (drawn before fighters for proper layering)
    this.renderFighterShadow(ctx, this.p1);
    this.renderFighterShadow(ctx, this.p2);

    // Projectiles
    this.renderProjectiles(ctx);

    // Fighters (draw the one further back first)
    if (this.p1.x < this.p2.x) {
      this.renderFighter(ctx, this.p1);
      this.renderFighter(ctx, this.p2);
    } else {
      this.renderFighter(ctx, this.p2);
      this.renderFighter(ctx, this.p1);
    }

    // Particles
    this.renderParticles(ctx);

    // SF-ported: Hit splash effects and damage numbers
    this.renderHitSplashes(ctx);
    this.renderDamageNumbers(ctx);

    // Debug hitbox/hurtbox overlay (training mode)
    if (this.showHitboxes && this.trainingMode) {
      this.renderHitboxOverlay(ctx);
    }

    ctx.restore();

    // Screen flash (screen space)
    if (this.screenFlash.active) {
      const flashAlpha = this.screenFlash.alpha * (this.screenFlash.timer / this.screenFlash.duration);
      ctx.fillStyle = this.screenFlash.color;
      ctx.globalAlpha = flashAlpha;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }

    // HUD (screen space)
    this.renderHUD(ctx);

    // Announcement
    if (this.announcement) {
      this.renderAnnouncement(ctx);
    }
  }

  private renderBackground(ctx: CanvasRenderingContext2D) {
    if (this.bgImageLoaded && this.bgImage) {
      // Draw the arena background image with parallax scrolling
      const img = this.bgImage;
      const imgAspect = img.width / img.height;
      
      // The background should cover the full visible area
      // Parallax: background moves slower than camera (0.3x factor)
      const parallaxFactor = 0.3;
      const cameraCenter = this.camera.x;
      const stageCenter = STAGE_WIDTH / 2;
      const parallaxOffset = (cameraCenter - stageCenter) * parallaxFactor;
      
      // Calculate draw dimensions to cover the stage
      const drawHeight = GAME_HEIGHT + 400;
      const drawWidth = drawHeight * imgAspect;
      
      // Center the image on the stage with parallax offset
      const drawX = stageCenter - drawWidth / 2 - parallaxOffset;
      const drawY = -200;
      
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      ctx.globalAlpha = 1;
      ctx.restore();
      
      // Subtle vignette overlay
      const vignette = ctx.createRadialGradient(
        stageCenter, GAME_HEIGHT / 2, GAME_HEIGHT * 0.3,
        stageCenter, GAME_HEIGHT / 2, GAME_HEIGHT * 0.9
      );
      vignette.addColorStop(0, "transparent");
      vignette.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = vignette;
      ctx.fillRect(-200, -200, STAGE_WIDTH + 400, GAME_HEIGHT + 400);
    } else {
      // Fallback: gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
      gradient.addColorStop(0, "#000000");
      gradient.addColorStop(0.3, this.mixColor("#050510", this.ambientColor, 0.15));
      gradient.addColorStop(0.5, this.mixColor("#0a0a20", this.ambientColor, 0.2));
      gradient.addColorStop(0.7, this.mixColor("#050510", this.ambientColor, 0.15));
      gradient.addColorStop(1, "#000000");
      ctx.fillStyle = gradient;
      ctx.fillRect(-200, -200, STAGE_WIDTH + 400, GAME_HEIGHT + 400);

      // Grid lines for depth
      ctx.strokeStyle = `${this.ambientColor}15`;
      ctx.lineWidth = 1;
      for (let x = 0; x < STAGE_WIDTH; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, GAME_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < GAME_HEIGHT; y += 80) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(STAGE_WIDTH, y);
        ctx.stroke();
      }
    }
  }

  private renderFloor(ctx: CanvasRenderingContext2D) {
    // Floor line
    ctx.fillStyle = this.floorColor;
    ctx.fillRect(-200, FLOOR_Y, STAGE_WIDTH + 400, 200);

    // Floor highlight
    const floorGrad = ctx.createLinearGradient(0, FLOOR_Y, 0, FLOOR_Y + 40);
    floorGrad.addColorStop(0, `${this.ambientColor}30`);
    floorGrad.addColorStop(1, "transparent");
    ctx.fillStyle = floorGrad;
    ctx.fillRect(-200, FLOOR_Y, STAGE_WIDTH + 400, 40);

    // Floor grid perspective
    ctx.strokeStyle = `${this.ambientColor}20`;
    ctx.lineWidth = 1;
    for (let x = 0; x < STAGE_WIDTH; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, FLOOR_Y);
      ctx.lineTo(x + (x - STAGE_WIDTH / 2) * 0.3, FLOOR_Y + 200);
      ctx.stroke();
    }
  }

  private renderFighter(ctx: CanvasRenderingContext2D, f: Fighter2D) {
    ctx.save();
    ctx.translate(f.x, f.y);

    // Flip if facing left
    if (!f.facingRight) {
      ctx.scale(-1, 1);
    }

    // ═══ RESOLVE SPRITES ═══
    // Walk cycle: alternate between walk pose and idle every ~12 frames for 2-frame walk anim
    let effectivePose: PoseKey = f.currentPose;
    if ((f.state === "walk_fwd" || f.state === "walk_back") && f.walkCycleFrame > 0) {
      const walkPhase = Math.floor(f.walkCycleFrame / 12) % 2;
      effectivePose = walkPhase === 0 ? f.currentPose : "idle";
    }
    // Attack sequence cycling: cycle through related attack poses during startup/active/recovery
    if (f.state === "light_1" || f.state === "light_2" || f.state === "light_3") {
      // Light combo: cycle lightPunch → mediumPunch at mid-animation
      const md = this.getMoveData(f);
      if (md && f.stateFrame > md.startup && f.sprites.mediumPunch) {
        effectivePose = "mediumPunch";
      }
    } else if (f.state === "crouch_light") {
      // Crouch light: show crouchKick at active frames if available
      const md = this.getMoveData(f);
      if (md && f.stateFrame > md.startup && f.sprites.crouchKick) {
        effectivePose = "crouchKick";
      }
    } else if (f.state === "crouch_heavy") {
      // Sweep: show sweep sprite throughout
      effectivePose = "sweep";
    } else if (f.state === "light_kick" || f.state === "medium_kick" || f.state === "heavy_kick") {
      // Kick attacks: show the specific kick sprite
      const kickMd = this.getMoveData(f);
      if (kickMd && f.stateFrame > kickMd.startup) {
        // During active/recovery, show the heavier kick sprite for visual progression
        if (f.state === "light_kick" && f.sprites.mediumKick) {
          effectivePose = "mediumKick";
        } else if (f.state === "medium_kick" && f.sprites.heavyKick) {
          effectivePose = "heavyKick";
        }
      }
    }

    // Resolve sprite with fallback chain
    let sprite = f.sprites[effectivePose];
    if (!sprite) {
      const fb = POSE_FALLBACK[effectivePose];
      if (fb) sprite = f.sprites[fb];
    }
    if (!sprite) sprite = f.sprites.idle;

    // Resolve previous pose sprite for crossfade
    let prevSprite: HTMLImageElement | null = null;
    if (f.blendAlpha < 1) {
      prevSprite = f.sprites[f.prevPose];
      if (!prevSprite) {
        const fb = POSE_FALLBACK[f.prevPose];
        if (fb) prevSprite = f.sprites[fb];
      }
      if (!prevSprite) prevSprite = f.sprites.idle;
    }

    // ═══ ANIMATION EFFECTS ═══
    let scaleX = 1;
    let scaleY = 1;
    let rotation = 0;
    let offsetY = 0;
    let alpha = 1;

    switch (f.state) {
      case "idle": {
        const breathe = Math.sin(f.animFrame * 0.06) * 0.015;
        scaleY = 1 + breathe;
        break;
      }
      case "walk_fwd":
      case "walk_back": {
        const bob = Math.sin(f.animFrame * 0.2) * 3;
        offsetY = bob;
        const lean = f.state === "walk_fwd" ? 0.03 : -0.03;
        rotation = lean;
        // Squash/stretch during walk cycle
        const walkSquash = Math.sin(f.walkCycleFrame * 0.26) * 0.03;
        scaleX = 1 + walkSquash;
        scaleY = 1 - walkSquash * 0.5;
        break;
      }
      case "crouch":
      case "crouch_down":
      case "block_crouch": {
        // Smooth crouch transition
        const crouchT = Math.min(1, f.stateFrame / 6);
        scaleY = 1 - 0.3 * crouchT;
        offsetY = FIGHTER_DRAW_HEIGHT * 0.15 * crouchT;
        break;
      }
      case "crouch_up": {
        const upT = Math.min(1, f.stateFrame / 4);
        scaleY = 0.7 + 0.3 * upT;
        offsetY = FIGHTER_DRAW_HEIGHT * 0.15 * (1 - upT);
        break;
      }
      case "dash_fwd": {
        // Dash with stretch effect
        const dashT = Math.min(1, f.stateFrame / 8);
        rotation = 0.1 * (1 - dashT);
        scaleX = 1.1 + Math.sin(dashT * Math.PI) * 0.05;
        scaleY = 0.95;
        break;
      }
      case "dash_back": {
        const dashT = Math.min(1, f.stateFrame / 8);
        rotation = -0.1 * (1 - dashT);
        scaleX = 1.1 + Math.sin(dashT * Math.PI) * 0.05;
        scaleY = 0.95;
        break;
      }
      case "light_1":
      case "light_2":
      case "light_3": {
        // Snappy punch: stretch on startup, snap back on recovery
        const md = this.getMoveData(f);
        if (md) {
          if (f.stateFrame <= md.startup) {
            const t = f.stateFrame / md.startup;
            scaleX = 1 + t * 0.12;
            scaleY = 1 - t * 0.04;
          } else if (f.stateFrame <= md.startup + md.active) {
            scaleX = 1.12;
            scaleY = 0.96;
          } else {
            const recT = (f.stateFrame - md.startup - md.active) / Math.max(1, md.recovery);
            scaleX = 1.12 - recT * 0.12;
            scaleY = 0.96 + recT * 0.04;
          }
        } else {
          const t = f.stateFrame / 10;
          scaleX = 1 + Math.sin(t * Math.PI) * 0.08;
        }
        break;
      }
      case "medium": {
        const md = this.getMoveData(f);
        if (md) {
          if (f.stateFrame <= md.startup) {
            const t = f.stateFrame / md.startup;
            scaleX = 1 + t * 0.15;
            rotation = t * 0.06;
            scaleY = 1 - t * 0.05;
          } else if (f.stateFrame <= md.startup + md.active) {
            scaleX = 1.15;
            rotation = 0.06;
            scaleY = 0.95;
          } else {
            const recT = (f.stateFrame - md.startup - md.active) / Math.max(1, md.recovery);
            scaleX = 1.15 - recT * 0.15;
            rotation = 0.06 * (1 - recT);
            scaleY = 0.95 + recT * 0.05;
          }
        } else {
          const t = f.stateFrame / 15;
          scaleX = 1 + Math.sin(t * Math.PI) * 0.12;
          rotation = 0.05;
        }
        break;
      }
      case "heavy_charge": {
        const shake = Math.sin(f.stateFrame * 0.8) * 2;
        offsetY = shake;
        const chargeGlow = Math.min(1, f.heavyChargeFrames / 30);
        // Charge compression
        scaleY = 1 - chargeGlow * 0.08;
        scaleX = 1 + chargeGlow * 0.04;
        ctx.globalAlpha = chargeGlow * 0.3;
        ctx.fillStyle = f.data.color;
        ctx.beginPath();
        ctx.arc(0, -FIGHTER_HEIGHT / 2, 60 + chargeGlow * 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        break;
      }
      case "heavy_release": {
        // Explosive release: big stretch then snap
        const releaseT = Math.min(1, f.stateFrame / 12);
        if (releaseT < 0.3) {
          scaleX = 1.2;
          scaleY = 0.9;
          rotation = 0.1;
        } else {
          scaleX = 1.2 - (releaseT - 0.3) * 0.29;
          scaleY = 0.9 + (releaseT - 0.3) * 0.14;
          rotation = 0.1 * (1 - releaseT);
        }
        break;
      }
      case "hitstun":
      case "air_hitstun": {
        const shake = Math.sin(f.stateFrame * 1.5) * 3;
        offsetY = shake;
        rotation = -0.05;
        // Impact squash on first few frames
        if (f.stateFrame < 4) {
          scaleX = 0.92;
          scaleY = 1.06;
        }
        break;
      }
      case "knockdown": {
        rotation = Math.PI / 2 * Math.min(1, f.stateFrame / 15);
        offsetY = 30;
        break;
      }
      case "ko": {
        rotation = Math.PI / 2;
        offsetY = 40;
        alpha = 0.8;
        break;
      }
      case "launched": {
        rotation = f.stateFrame * 0.15;
        break;
      }
      case "blockstun": {
        const shake = Math.sin(f.stateFrame * 2) * 2;
        offsetY = shake;
        // Block impact compression
        if (f.stateFrame < 3) {
          scaleX = 0.95;
          scaleY = 1.03;
        }
        break;
      }
      case "light_kick":
      case "medium_kick":
      case "heavy_kick": {
        // Kick animation: lean back slightly, extend leg
        const kickMd = this.getMoveData(f);
        if (kickMd) {
          if (f.stateFrame <= kickMd.startup) {
            const t = f.stateFrame / kickMd.startup;
            scaleX = 1 - t * 0.05;
            scaleY = 1 + t * 0.08;
            rotation = -0.05 * t; // Lean back
          } else if (f.stateFrame <= kickMd.startup + kickMd.active) {
            scaleX = 1.12;
            scaleY = 0.95;
            rotation = 0.08; // Lean forward into kick
          } else {
            const recT = (f.stateFrame - kickMd.startup - kickMd.active) / Math.max(1, kickMd.recovery);
            scaleX = 1.12 - recT * 0.12;
            scaleY = 0.95 + recT * 0.05;
            rotation = 0.08 * (1 - recT);
          }
        }
        break;
      }
      case "taunt": {
        // Taunt animation: slight bounce and scale pulse
        const tauntT = f.stateFrame / 60;
        const pulse = Math.sin(tauntT * Math.PI * 4) * 0.03;
        scaleX = 1 + pulse;
        scaleY = 1 + pulse;
        offsetY = Math.sin(tauntT * Math.PI * 2) * -5;
        break;
      }
      case "crouch_light":
      case "crouch_medium":
      case "crouch_heavy": {
        scaleY = 0.75;
        offsetY = FIGHTER_DRAW_HEIGHT * 0.12;
        const atkT = f.stateFrame / 12;
        scaleX = 1 + Math.sin(atkT * Math.PI) * 0.1;
        break;
      }
      case "jump_start": {
        // Pre-jump compression
        scaleY = 0.85;
        scaleX = 1.05;
        offsetY = 10;
        break;
      }
      case "jump_up":
      case "jump_fwd":
      case "jump_back": {
        // Air stretch
        scaleY = 1.05;
        scaleX = 0.97;
        break;
      }
      case "jump_light":
      case "jump_medium":
      case "jump_heavy": {
        scaleX = 1.1;
        rotation = f.state === "jump_heavy" ? 0.15 : 0.08;
        break;
      }
      case "jump_land": {
        // Landing squash
        const landT = Math.min(1, f.stateFrame / 4);
        scaleY = 0.85 + landT * 0.15;
        scaleX = 1.08 - landT * 0.08;
        break;
      }
      case "throw_startup":
      case "throw_whiff": {
        scaleX = 1.08;
        rotation = 0.04;
        break;
      }
      case "thrown": {
        rotation = -0.1;
        scaleY = 0.9;
        break;
      }
      case "getup": {
        const getupT = Math.min(1, f.stateFrame / 20);
        rotation = (Math.PI / 2) * (1 - getupT);
        offsetY = 30 * (1 - getupT);
        break;
      }
      case "special_1":
      case "special_2":
      case "special_3": {
        const pulse = Math.sin(f.stateFrame * 0.3) * 0.05;
        scaleX = 1.05 + pulse;
        scaleY = 1.05 + pulse;
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = f.data.color;
        ctx.beginPath();
        ctx.arc(0, -FIGHTER_HEIGHT / 2, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        break;
      }
      case "victory": {
        const bounce = Math.abs(Math.sin(f.animFrame * 0.05)) * 5;
        offsetY = -bounce;
        break;
      }
      case "parry_stun": {
        const flash = Math.sin(f.stateFrame * 0.5) > 0 ? 0.5 : 1;
        alpha = flash;
        break;
      }
      case "finish_stun": {
        // Stagger effect
        const stagger = Math.sin(f.stateFrame * 0.3) * 4;
        offsetY = stagger;
        rotation = Math.sin(f.stateFrame * 0.2) * 0.03;
        break;
      }
    }

    // Invincibility flash
    if (f.invincibleFrames > 0) {
      alpha = f.animFrame % 4 < 2 ? 0.4 : 1;
    }

    ctx.globalAlpha = alpha;
    ctx.translate(0, offsetY);
    ctx.rotate(rotation);
    ctx.scale(scaleX, scaleY);

    const drawW = FIGHTER_DRAW_WIDTH;
    const drawH = FIGHTER_DRAW_HEIGHT;

    // ═══ CROSSFADE BLENDING ═══
    // Draw previous pose sprite fading out during transition
    if (prevSprite && prevSprite.complete && prevSprite.naturalWidth > 0 && f.blendAlpha < 1) {
      ctx.globalAlpha = alpha * (1 - f.blendAlpha);
      ctx.drawImage(prevSprite, -drawW / 2, -drawH, drawW, drawH);
    }

    // Draw current pose sprite fading in
    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      ctx.globalAlpha = f.blendAlpha < 1 ? alpha * f.blendAlpha : alpha;
      ctx.drawImage(sprite, -drawW / 2, -drawH, drawW, drawH);
    } else {
      ctx.globalAlpha = alpha;
      this.renderFighterFallback(ctx, f);
    }

    ctx.globalAlpha = 1;
    ctx.restore();

    // Shadow
    ctx.save();
    ctx.translate(f.x, FLOOR_Y);
    ctx.scale(1, 0.2);
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(0, 0, 40, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  private renderFighterFallback(ctx: CanvasRenderingContext2D, f: Fighter2D) {
    // Simple colored silhouette
    const w = FIGHTER_WIDTH;
    const h = FIGHTER_HEIGHT;

    // Body
    ctx.fillStyle = f.data.color;
    ctx.fillRect(-w / 2, -h, w, h);

    // Head
    ctx.beginPath();
    ctx.arc(0, -h - 15, 18, 0, Math.PI * 2);
    ctx.fill();

    // Name
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(f.data.name.substring(0, 12), 0, -h - 35);
  }

  private renderProjectiles(ctx: CanvasRenderingContext2D) {
    for (const proj of this.projectiles) {
      ctx.save();
      ctx.translate(proj.x, proj.y);

      // Glow
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, proj.width);
      glow.addColorStop(0, proj.color + "80");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(-proj.width, -proj.width, proj.width * 2, proj.width * 2);

      // Core
      ctx.fillStyle = proj.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, proj.width / 2, proj.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright
      ctx.fillStyle = "#ffffff80";
      ctx.beginPath();
      ctx.ellipse(0, 0, proj.width / 4, proj.height / 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  private renderParticles(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;

      if (p.type === "spark" || p.type === "energy") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === "block") {
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      } else if (p.type === "parry") {
        ctx.fillStyle = "#00ffff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ═══ HUD RENDERING ═══ */
  private renderHUD(ctx: CanvasRenderingContext2D) {
    const w = this.canvas.width;
    const barWidth = w * 0.35;
    const barHeight = 20;
    const barY = 25;
    const barGap = 10;

    // P1 health bar (left side, fills right to left)
    this.renderHealthBar(ctx, barGap, barY, barWidth, barHeight, this.p1, true);

    // P2 health bar (right side, fills left to right)
    this.renderHealthBar(ctx, w - barGap - barWidth, barY, barWidth, barHeight, this.p2, false);

    // Timer
    const timerSeconds = Math.max(0, Math.ceil(this.roundTimer / 60));
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px 'Orbitron', monospace";
    ctx.textAlign = "center";
    ctx.fillText(String(timerSeconds), w / 2, barY + barHeight - 2);

    // Round indicator
    ctx.font = "10px 'Orbitron', monospace";
    ctx.fillStyle = "#ffffff80";
    ctx.fillText(`ROUND ${this.round}`, w / 2, barY - 8);

    // Round wins
    this.renderRoundWins(ctx, w / 2 - 50, barY + barHeight + 8, this.p1.roundWins);
    this.renderRoundWins(ctx, w / 2 + 30, barY + barHeight + 8, this.p2.roundWins);

    // Special meter bars
    this.renderMeterBar(ctx, barGap, barY + barHeight + 5, barWidth * 0.6, 6, this.p1);
    this.renderMeterBar(ctx, w - barGap - barWidth * 0.6, barY + barHeight + 5, barWidth * 0.6, 6, this.p2);

    // Fighter names
    ctx.font = "bold 11px 'Orbitron', monospace";
    ctx.textAlign = "left";
    ctx.fillStyle = this.p1.data.color;
    ctx.fillText(this.p1.data.name.toUpperCase(), barGap, barY - 5);
    ctx.textAlign = "right";
    ctx.fillStyle = this.p2.data.color;
    ctx.fillText(this.p2.data.name.toUpperCase(), w - barGap, barY - 5);

    // Combo display
    if (this.p1.comboCount > 1) {
      this.renderComboCounter(ctx, 50, GAME_HEIGHT * 0.4, this.p1.comboCount, this.p1.comboDamage, this.p1.data.color);
    }
    if (this.p2.comboCount > 1) {
      this.renderComboCounter(ctx, w - 50, GAME_HEIGHT * 0.4, this.p2.comboCount, this.p2.comboDamage, this.p2.data.color);
    }
  }

  private renderHealthBar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, f: Fighter2D, isP1: boolean) {
    // Background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(x, y, w, h);

    // Damage drain (yellow)
    const drainRatio = f.displayHp / f.maxHp;
    const drainW = w * drainRatio;
    ctx.fillStyle = "#f59e0b40";
    if (isP1) {
      ctx.fillRect(x + w - drainW, y, drainW, h);
    } else {
      ctx.fillRect(x, y, drainW, h);
    }

    // Current HP
    const hpRatio = f.hp / f.maxHp;
    const hpW = w * hpRatio;
    const hpColor = hpRatio > 0.5 ? "#22c55e" : hpRatio > 0.25 ? "#f59e0b" : "#ef4444";
    ctx.fillStyle = hpColor;
    if (isP1) {
      ctx.fillRect(x + w - hpW, y, hpW, h);
    } else {
      ctx.fillRect(x, y, hpW, h);
    }

    // Border
    ctx.strokeStyle = "#ffffff30";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // HP text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${f.hp}/${f.maxHp}`, x + w / 2, y + h - 5);
  }

  private renderMeterBar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, f: Fighter2D) {
    ctx.fillStyle = "#0a0a1a";
    ctx.fillRect(x, y, w, h);

    // Meter segments (3 bars)
    const segW = w / 3;
    for (let i = 0; i < 3; i++) {
      const segStart = i * 100;
      const segEnd = (i + 1) * 100;
      const fill = Math.max(0, Math.min(1, (f.specialMeter - segStart) / 100));
      if (fill > 0) {
        const colors = ["#3b82f6", "#8b5cf6", "#ef4444"];
        ctx.fillStyle = colors[i];
        ctx.fillRect(x + i * segW + 1, y + 1, (segW - 2) * fill, h - 2);
      }
    }
    // Segment dividers
    ctx.strokeStyle = "#ffffff20";
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * segW, y);
      ctx.lineTo(x + i * segW, y + h);
      ctx.stroke();
    }
  }

  private renderComboCounter(ctx: CanvasRenderingContext2D, x: number, y: number, count: number, damage: number, color: string) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    ctx.font = "bold 28px 'Orbitron', monospace";
    ctx.fillText(`${count}`, x, y);
    ctx.font = "bold 10px 'Orbitron', monospace";
    ctx.fillStyle = "#ffffff80";
    ctx.fillText("HITS", x, y + 14);
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 12px monospace";
    ctx.fillText(`${damage} DMG`, x, y + 28);
    ctx.restore();
  }

  private renderRoundWins(ctx: CanvasRenderingContext2D, x: number, y: number, wins: number) {
    for (let i = 0; i < ROUNDS_TO_WIN; i++) {
      ctx.beginPath();
      ctx.arc(x + i * 16, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = i < wins ? "#f59e0b" : "#333";
      ctx.fill();
      ctx.strokeStyle = "#ffffff30";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  private renderAnnouncement(ctx: CanvasRenderingContext2D) {
    if (!this.announcement) return;
    const a = this.announcement;
    const alpha = Math.min(1, a.timer / 10);
    const scale = 1 + (1 - alpha) * 0.3;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(GAME_WIDTH / 2, GAME_HEIGHT * 0.4);
    ctx.scale(scale, scale);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Shadow
    ctx.fillStyle = "#000000";
    ctx.font = "bold 56px 'Orbitron', monospace";
    ctx.fillText(a.text, 2, 2);

    // Main text
    ctx.fillStyle = a.color;
    ctx.fillText(a.text, 0, 0);

    // Glow
    ctx.shadowColor = a.color;
    ctx.shadowBlur = 20;
    ctx.fillText(a.text, 0, 0);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  /* ═══ COLOR UTILITY ═══ */
  private mixColor(base: string, tint: string, amount: number): string {
    // Simple hex color mixing
    const parseHex = (hex: string) => {
      const h = hex.replace("#", "");
      return {
        r: parseInt(h.substring(0, 2), 16) || 0,
        g: parseInt(h.substring(2, 4), 16) || 0,
        b: parseInt(h.substring(4, 6), 16) || 0,
      };
    };
    const b = parseHex(base);
    const t = parseHex(tint);
    const r = Math.round(b.r + (t.r - b.r) * amount);
    const g = Math.round(b.g + (t.g - b.g) * amount);
    const bl = Math.round(b.b + (t.b - b.b) * amount);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
  }

  /* ═══ HITBOX/HURTBOX DEBUG OVERLAY ═══ */
  private renderHitboxOverlay(ctx: CanvasRenderingContext2D) {
    // Draw hurtboxes for both fighters
    this.renderFighterBoxes(ctx, this.p1, "#00ff00");
    this.renderFighterBoxes(ctx, this.p2, "#00ff00");

    // Draw active hitboxes
    this.renderActiveHitbox(ctx, this.p1, "#ff0000");
    this.renderActiveHitbox(ctx, this.p2, "#ff0000");

    // Draw push boxes
    this.renderPushBox(ctx, this.p1, "#ffff00");
    this.renderPushBox(ctx, this.p2, "#ffff00");
  }

  private renderFighterBoxes(ctx: CanvasRenderingContext2D, f: Fighter2D, color: string) {
    const hurtBoxes = this.getHurtBoxes(f);
    const zones = [hurtBoxes.head, hurtBoxes.body, hurtBoxes.legs];
    const zoneColors = ["#00ccff", "#00ff66", "#66ff00"];
    const zoneLabels = ["HEAD", "BODY", "LEGS"];

    zones.forEach((box, i) => {
      const world = toWorld(box, f.x, f.y, f.facingRight);
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = zoneColors[i];
      ctx.fillRect(world.x, world.y, world.w, world.h);
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = zoneColors[i];
      ctx.lineWidth = 1.5;
      ctx.strokeRect(world.x, world.y, world.w, world.h);
      // Label
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 8px monospace";
      ctx.fillText(zoneLabels[i], world.x + 2, world.y + 9);
      ctx.restore();
    });
  }

  private renderActiveHitbox(ctx: CanvasRenderingContext2D, f: Fighter2D, color: string) {
    if (!this.isInAttackState(f)) return;
    const moveData = this.getMoveData(f);
    if (!moveData) return;

    const frame = f.stateFrame;
    const inStartup = frame < moveData.startup;
    const inActive = frame >= moveData.startup && frame < moveData.startup + moveData.active;
    const inRecovery = frame >= moveData.startup + moveData.active;

    const hitboxWorld = toWorld(moveData.hitbox, f.x, f.y, f.facingRight);

    ctx.save();
    if (inActive) {
      // Active hitbox — bright red
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(hitboxWorld.x, hitboxWorld.y, hitboxWorld.w, hitboxWorld.h);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = 2;
      ctx.strokeRect(hitboxWorld.x, hitboxWorld.y, hitboxWorld.w, hitboxWorld.h);
      // Pulsing glow
      ctx.shadowColor = "#ff0000";
      ctx.shadowBlur = 8;
      ctx.strokeRect(hitboxWorld.x, hitboxWorld.y, hitboxWorld.w, hitboxWorld.h);
      ctx.shadowBlur = 0;
    } else if (inStartup) {
      // Startup — yellow outline (hitbox about to become active)
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = "#ffaa00";
      ctx.fillRect(hitboxWorld.x, hitboxWorld.y, hitboxWorld.w, hitboxWorld.h);
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = "#ffaa00";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(hitboxWorld.x, hitboxWorld.y, hitboxWorld.w, hitboxWorld.h);
    } else if (inRecovery) {
      // Recovery — dim blue outline
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = "#4488ff";
      ctx.fillRect(hitboxWorld.x, hitboxWorld.y, hitboxWorld.w, hitboxWorld.h);
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = "#4488ff";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 6]);
      ctx.strokeRect(hitboxWorld.x, hitboxWorld.y, hitboxWorld.w, hitboxWorld.h);
    }

    // Frame phase label
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = inActive ? "#ff4444" : inStartup ? "#ffaa00" : "#4488ff";
    ctx.font = "bold 9px monospace";
    const label = inActive ? "ACTIVE" : inStartup ? "STARTUP" : "RECOVERY";
    ctx.fillText(label, hitboxWorld.x, hitboxWorld.y - 4);
    ctx.restore();
  }

  private renderPushBox(ctx: CanvasRenderingContext2D, f: Fighter2D, color: string) {
    const pushW = PUSH_BOX_WIDTH;
    const pushH = f.isCrouching ? PUSH_BOX_HEIGHT * 0.6 : PUSH_BOX_HEIGHT;
    const px = f.x - pushW / 2;
    const py = f.y - pushH;

    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = color;
    ctx.fillRect(px, py, pushW, pushH);
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(px, py, pushW, pushH);
    ctx.restore();
  }

  /* ═══ ARENA BACKGROUND IMAGE ═══ */
  private bgImage: HTMLImageElement | null = null;
  private bgImageLoaded = false;

  public loadBackgroundImage(url: string) {
    const img = new Image();
    // crossOrigin not needed — we don't manipulate bg pixels
    img.onload = () => {
      this.bgImage = img;
      this.bgImageLoaded = true;
    };
    img.src = url;
  }

  /* ═══ PUBLIC GETTERS ═══ */
  public getPhase(): FightPhase2D { return this.phase; }
  public getRound(): number { return this.round; }
  public getP1Health(): number { return this.p1.hp; }
  public getP2Health(): number { return this.p2.hp; }
  public getP1Meter(): number { return this.p1.specialMeter; }
  public getP2Meter(): number { return this.p2.specialMeter; }
  public getTimer(): number { return Math.ceil(this.roundTimer / 60); }
  public getTrainingStats() { return { ...this.trainingStats }; }
  public isRunning(): boolean { return this.running; }

  /* ═══ TRAINING MODE PUBLIC API ═══ */
  public setShowHitboxes(show: boolean) { this.showHitboxes = show; }
  public setShowFrameData(show: boolean) { this.showFrameData = show; }
  public setTrainingAutoRecover(on: boolean) { this.trainingAutoRecover = on; }
  public setTrainingInfiniteHealth(on: boolean) { this.trainingInfiniteHealth = on; }
  public setTrainingInfiniteMeter(on: boolean) { this.trainingInfiniteMeter = on; }
  public getShowHitboxes(): boolean { return this.showHitboxes; }
  public getShowFrameData(): boolean { return this.showFrameData; }

  public resetTrainingDummy() {
    if (!this.trainingMode) return;
    this.p2.hp = this.p2.maxHp;
    this.p2.displayHp = this.p2.maxHp;
    this.p2.specialMeter = 0;
    this.changeState(this.p2, "idle");
    this.p2.comboCount = 0;
    this.p2.comboDamage = 0;
    this.p2.comboTimer = 0;
    this.p2.jugglePoints = MAX_JUGGLE_POINTS;
    this.p2.airborne = false;
    this.p2.stunFrames = 0;
    this.p2.invincibleFrames = 0;
    this.p2.dotTimer = 0;
    this.p2.defenseDebuffTimer = 0;
    this.p2.speedBuffTimer = 0;
    this.trainingStats = { maxCombo: 0, totalDamage: 0, hitsLanded: 0 };
  }

  public resetP1Position() {
    if (!this.trainingMode) return;
    this.p1.x = STAGE_WIDTH / 2 - 200;
    this.p1.y = FLOOR_Y;
    this.p1.vx = 0;
    this.p1.vy = 0;
    this.p1.airborne = false;
    this.changeState(this.p1, "idle");
    this.p2.x = STAGE_WIDTH / 2 + 200;
    this.p2.y = FLOOR_Y;
    this.p2.vx = 0;
    this.p2.vy = 0;
    this.p2.airborne = false;
    this.changeState(this.p2, "idle");
  }

  /** Get comprehensive training data for the overlay UI */
  public getTrainingData(): TrainingData {
    const p1Move = this.getMoveData(this.p1);
    const p2Move = this.getMoveData(this.p2);
    return {
      p1: {
        state: this.p1.state,
        stateFrame: this.p1.stateFrame,
        hp: this.p1.hp,
        maxHp: this.p1.maxHp,
        meter: this.p1.specialMeter,
        comboCount: this.p1.comboCount,
        comboDamage: this.p1.comboDamage,
        facingRight: this.p1.facingRight,
        airborne: this.p1.airborne,
        isCrouching: this.p1.isCrouching,
        x: Math.round(this.p1.x),
        y: Math.round(this.p1.y),
        moveData: p1Move ? {
          startup: p1Move.startup,
          active: p1Move.active,
          recovery: p1Move.recovery,
          damage: Math.round(p1Move.hitbox.damage),
          type: p1Move.hitbox.type,
          cancelWindow: p1Move.cancelWindow,
          totalFrames: p1Move.startup + p1Move.active + p1Move.recovery,
          currentPhase: this.p1.stateFrame < p1Move.startup ? "startup" :
                        this.p1.stateFrame < p1Move.startup + p1Move.active ? "active" : "recovery",
        } : null,
      },
      p2: {
        state: this.p2.state,
        stateFrame: this.p2.stateFrame,
        hp: this.p2.hp,
        maxHp: this.p2.maxHp,
        meter: this.p2.specialMeter,
        comboCount: this.p2.comboCount,
        comboDamage: this.p2.comboDamage,
        facingRight: this.p2.facingRight,
        airborne: this.p2.airborne,
        isCrouching: this.p2.isCrouching,
        x: Math.round(this.p2.x),
        y: Math.round(this.p2.y),
        moveData: p2Move ? {
          startup: p2Move.startup,
          active: p2Move.active,
          recovery: p2Move.recovery,
          damage: Math.round(p2Move.hitbox.damage),
          type: p2Move.hitbox.type,
          cancelWindow: p2Move.cancelWindow,
          totalFrames: p2Move.startup + p2Move.active + p2Move.recovery,
          currentPhase: this.p2.stateFrame < p2Move.startup ? "startup" :
                        this.p2.stateFrame < p2Move.startup + p2Move.active ? "active" : "recovery",
        } : null,
      },
      stats: { ...this.trainingStats },
      frameCount: this.frameCount,
      distance: Math.round(Math.abs(this.p1.x - this.p2.x)),
      showHitboxes: this.showHitboxes,
      showFrameData: this.showFrameData,
    };
  }

  /** Get all move frame data for a fighter (for the move list panel) */
  public getAllMoveData(player: 1 | 2): MoveListEntry[] {
    const f = player === 1 ? this.p1 : this.p2;
    const profile = f.data.frameProfile;
    const moves: MoveListEntry[] = [];

    const moveKeys: Array<Parameters<typeof buildMoveData>[1]> = [
      "light_1", "light_2", "light_3", "medium", "heavy_release",
      "light_kick", "medium_kick", "heavy_kick",
      "crouch_light", "crouch_medium", "crouch_heavy",
      "jump_light", "jump_medium", "jump_heavy",
    ];

    const moveNames: Record<string, string> = {
      light_1: "Light Punch 1 (Jab)",
      light_2: "Light Punch 2",
      light_3: "Light Punch 3 (Chain)",
      medium: "Medium Punch",
      heavy_release: "Heavy Punch",
      light_kick: "Light Kick",
      medium_kick: "Medium Kick",
      heavy_kick: "Heavy Kick",
      crouch_light: "Crouch Light",
      crouch_medium: "Crouch Medium",
      crouch_heavy: "Crouch Heavy (Sweep)",
      jump_light: "Jump Light",
      jump_medium: "Jump Medium",
      jump_heavy: "Jump Heavy",
    };

    for (const key of moveKeys) {
      const md = buildMoveData(profile, key);
      moves.push({
        name: moveNames[key] || key,
        input: key,
        startup: md.startup,
        active: md.active,
        recovery: md.recovery,
        total: md.startup + md.active + md.recovery,
        damage: Math.round(md.hitbox.damage),
        type: md.hitbox.type,
        onHit: `+${md.hitbox.hitstun - md.recovery}`,
        onBlock: `${md.hitbox.blockstun - md.recovery}`,
        cancelWindow: md.cancelWindow,
      });
    }

    // Add specials
    const specials = f.specials;
    const spList: Array<{ sp: SpecialMove; level: 1 | 2 | 3; label: string }> = [
      { sp: specials.sp1, level: 1, label: `SP1: ${specials.sp1.name}` },
      { sp: specials.sp2, level: 2, label: `SP2: ${specials.sp2.name}` },
      { sp: specials.sp3, level: 3, label: `SP3: ${specials.sp3.name}` },
    ];

    for (const { sp, level, label } of spList) {
      const md = buildSpecialMoveData(sp, level, profile);
      moves.push({
        name: label,
        input: `special_${level}`,
        startup: md.startup,
        active: md.active,
        recovery: md.recovery,
        total: md.startup + md.active + md.recovery,
        damage: Math.round(md.hitbox.damage),
        type: md.hitbox.type,
        onHit: `+${md.hitbox.hitstun - md.recovery}`,
        onBlock: `${md.hitbox.blockstun - md.recovery}`,
        cancelWindow: md.cancelWindow,
      });
    }

    return moves;
  }
}

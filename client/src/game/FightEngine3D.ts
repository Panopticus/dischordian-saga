/**
 * FightEngine3D — AAA Fighting Game Engine
 * 
 * Frame-based combat engine inspired by professional fighting game design:
 * - 60fps frame-based timing (not time-based delta)
 * - Proper startup/active/recovery frame data for all moves
 * - Input buffering system (5-frame buffer window)
 * - Hitstop freeze frames proportional to attack strength
 * - Hitstun/blockstun with frame advantage calculations
 * - Gatling chain combo system (L→M→H→Special)
 * - Juggle system with gravity and hit decay
 * - Pushback on hit and block
 * - AI that reacts to animations, not inputs
 */

import * as THREE from "three";
import { buildCharacterModel, getCharacterConfig, type CharacterModel, type CharacterConfig } from "./CharacterModel3D";
import type { FighterData } from "./gameData";
import { getCharacterSpecials, type CharacterSpecials, type SpecialMove } from "./specialMoves";

/* ═══ EXPORTED TYPES ═══ */
export type FightPhase = "intro" | "round_announce" | "fighting" | "finish_him" | "ko" | "round_end" | "match_end";
export type FighterState = "idle" | "walk_fwd" | "walk_back" | "dash_fwd" | "dash_back" |
  "jump" | "jump_fwd" | "jump_back" |
  "light_1" | "light_2" | "light_3" | "light_4" |
  "medium" | "heavy_charge" | "heavy_release" |
  "special_1" | "special_2" | "special_3" |
  "block_stand" | "block_crouch" | "blockstun" |
  "hitstun" | "knockdown" | "getup" | "launched" |
  "parry_stun" | "finish_stun" | "ko" | "victory";
export type AIStyle = "aggressive" | "defensive" | "evasive" | "balanced";
export type Difficulty = "recruit" | "soldier" | "veteran" | "archon";

export interface TouchInput {
  type: "tap" | "swipe_left" | "swipe_right" | "swipe_up" | "swipe_down" | "hold_start" | "hold_end" | "none";
  side: "left" | "right";
  timestamp: number;
}

export interface FightCallbacks {
  onPhaseChange?: (phase: FightPhase) => void;
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

/* ═══ INTERNAL TYPES ═══ */

/** Frame data for a single move */
interface FrameData {
  startup: number;   // frames before hitbox appears (inclusive of hit frame)
  active: number;    // frames hitbox is out
  recovery: number;  // frames after active before actionable
  hitstun: number;   // frames opponent is stuck on HIT
  blockstun: number; // frames opponent is stuck on BLOCK
  damage: number;
  pushbackHit: number;   // units pushed on hit
  pushbackBlock: number; // units pushed on block (more than hit)
  range: number;         // horizontal reach
  meterGain: number;     // special meter gained on hit
  cancelWindow: number;  // frames during active+early recovery where cancel is allowed
  jugglePoints: number;  // juggle cost (airborne opponents)
  launchHeight: number;  // 0 = no launch, >0 = launch opponent
}

interface HitEffect {
  x: number; y: number; z: number;
  life: number; maxLife: number;
  type: "spark" | "heavy" | "block" | "special" | "parry" | "critical" |
        "impact_ring" | "energy_wave" | "blood" | "dust" | "sweat" | "ground_crack";
  color: string;
  particles: THREE.Group;
}

interface AfterimageFrame {
  mesh: THREE.Mesh;
  life: number;
  maxLife: number;
}

interface EnergyProjectile {
  mesh: THREE.Group;
  x: number; y: number; z: number;
  vx: number;
  owner: 1 | 2;
  damage: number;
  life: number;
  color: string;
}

interface ImpactCrater {
  mesh: THREE.Group;
  life: number;
  maxLife: number;
}

interface CinematicCamera {
  active: boolean;
  type: "none" | "intro_sweep" | "ko_zoom" | "special_zoom" | "heavy_zoom";
  timer: number;
  duration: number;
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  startLookAt: THREE.Vector3;
  endLookAt: THREE.Vector3;
}

/** Input buffer entry */
interface BufferedInput {
  action: InputAction;
  frame: number;  // frame when input was recorded
}

type InputAction = "light" | "medium" | "heavy_start" | "heavy_release" |
  "special" | "block" | "block_release" |
  "dash_fwd" | "dash_back" | "jump" |
  "up" | "down" | "left" | "right";

interface Fighter {
  data: FighterData;
  model: CharacterModel;
  config: CharacterConfig;
  x: number;
  y: number;
  vx: number;
  vy: number;
  facingRight: boolean;
  state: FighterState;
  stateFrame: number;      // current frame within the state (frame-based, not time)
  hp: number;
  maxHp: number;
  displayHp: number;
  // Combo system
  comboCount: number;
  comboDamage: number;
  comboTimer: number;       // frames since last hit
  comboChain: number;       // position in gatling chain (0-3 for L1-L4)
  maxComboHits: number;
  // Juggle
  jugglePoints: number;     // remaining juggle points (resets on ground)
  airborne: boolean;
  // Special meter (0-300)
  specialMeter: number;
  // Block / parry
  blockFrame: number;       // frame when block started
  isParrying: boolean;
  parryFrames: number;      // remaining parryWindow frames (parry window)
  // Invincibility
  invincibleFrames: number;
  // Dexterity
  dexActive: boolean;
  dexFrames: number;
  // Heavy charge
  heavyChargeFrames: number; // heavyChargeTime in frames
  // Round wins
  roundWins: number;
  // AI
  aiStyle: AIStyle;
  aiTimer: number;
  aiDecision: string;
  aiComboStep: number;
  aiReactDelay: number;     // frames of reaction delay
  aiReactTimer: number;
  aiPressureTimer: number;
  aiDodgeCooldown: number;
  aiAggression: number;
  aiMistakeTimer: number;
  aiPatternMemory: string[];
  aiLastSeenState: FighterState;  // what AI last saw opponent doing
  aiWhiffPunishWindow: number;    // frames to punish a whiffed attack
  // Stun
  stunFrames: number;
  // Dash
  dashCooldownFrames: number;
  // Hit tracking
  hitThisAttack: boolean;
  // Cancel tracking
  cancelUsed: boolean;      // already cancelled this move?
  // Character specials
  specials: CharacterSpecials;
  // DOT
  dotTimer: number;
  dotDamagePerTick: number;
  dotTickInterval: number;
  dotTickTimer: number;
  // Buffs/debuffs
  speedBuffTimer: number;
  speedBuffMult: number;
  defenseDebuffTimer: number;
  defenseDebuffPct: number;
  // Pushback velocity (decelerates)
  pushVx: number;
}

/* ═══════════════════════════════════════════════════════════
   CONSTANTS — AAA FIGHTING GAME FRAME DATA
   All timing is in FRAMES at 60fps (1 frame = 1/60s ≈ 16.67ms)
   ═══════════════════════════════════════════════════════════ */

const FPS = 60;
const FRAME_DURATION = 1 / FPS;  // seconds per frame

// Stage
const STAGE_WIDTH = 12;
const STAGE_HALF = STAGE_WIDTH / 2;
const GROUND_Y = 0;

// Physics
const GRAVITY = -32;             // units/sec² — heavier than before for weighty feel
const JUMP_FORCE = 11;           // initial upward velocity
const JUMP_FWD_VX = 4;           // horizontal speed during forward jump
const JUMP_BACK_VX = 3;          // horizontal speed during back jump
const PRE_JUMP_FRAMES = 3;       // vulnerable pre-jump frames (can't block)
const LANDING_RECOVERY = 3;      // frames of landing lag

// Movement — deliberate, weighty
const WALK_FWD_SPEED = 3.2;      // units/sec — walking is for spacing
const WALK_BACK_SPEED = 2.4;     // backing up is slower (defensive penalty)
const WALK_ACCEL = 40;           // fast acceleration to target speed
const WALK_DECEL = 60;           // fast deceleration when stopping

// Dashes — committal movement
const DASH_FWD_SPEED = 14;       // fast burst
const DASH_FWD_FRAMES = 12;      // ~200ms commitment
const DASH_BACK_SPEED = 11;
const DASH_BACK_FRAMES = 15;     // slightly longer (defensive option has more recovery)
const DASH_INVULN_FRAMES = 4;    // i-frames at start of backdash
const DASH_COOLDOWN_FRAMES = 15; // can't dash again for 15 frames

// Pushback — creates spacing after hits
const PUSHBACK_DECEL = 20;       // how fast pushback velocity decays (units/sec²)

// Collision
const FIGHTER_WIDTH = 0.8;       // collision body width
const MIN_DISTANCE = 0.9;        // minimum distance between fighters
const PUSH_FORCE = 3;            // push apart speed when overlapping

// ─── FRAME DATA: LIGHT ATTACKS (fast, safe, combo starters) ───
const LIGHT_1: FrameData = {
  startup: 5, active: 3, recovery: 8,
  hitstun: 14, blockstun: 10,
  damage: 4, pushbackHit: 0.3, pushbackBlock: 0.5,
  range: 1.0, meterGain: 3, cancelWindow: 6,
  jugglePoints: 1, launchHeight: 0,
};
const LIGHT_2: FrameData = {
  startup: 4, active: 3, recovery: 7,
  hitstun: 14, blockstun: 10,
  damage: 4, pushbackHit: 0.3, pushbackBlock: 0.5,
  range: 1.0, meterGain: 3, cancelWindow: 5,
  jugglePoints: 1, launchHeight: 0,
};
const LIGHT_3: FrameData = {
  startup: 5, active: 4, recovery: 8,
  hitstun: 16, blockstun: 11,
  damage: 5, pushbackHit: 0.4, pushbackBlock: 0.6,
  range: 1.1, meterGain: 4, cancelWindow: 6,
  jugglePoints: 1, launchHeight: 0,
};
const LIGHT_4: FrameData = {
  startup: 6, active: 4, recovery: 12,
  hitstun: 18, blockstun: 12,
  damage: 6, pushbackHit: 0.6, pushbackBlock: 0.8,
  range: 1.2, meterGain: 5, cancelWindow: 4,
  jugglePoints: 1, launchHeight: 0,
};

// ─── FRAME DATA: MEDIUM ATTACK (slower, more damage, lunges forward) ───
const MEDIUM: FrameData = {
  startup: 9, active: 4, recovery: 16,
  hitstun: 22, blockstun: 15,
  damage: 9, pushbackHit: 0.8, pushbackBlock: 1.2,
  range: 1.6, meterGain: 8, cancelWindow: 6,
  jugglePoints: 2, launchHeight: 0,
};
const MEDIUM_LUNGE = 2.0;  // distance covered during medium attack

// ─── FRAME DATA: HEAVY ATTACK (chargeable, big damage, launches) ───
const HEAVY_MIN_CHARGE_FRAMES = 12;  // minimum charge time
const HEAVY_MAX_CHARGE_FRAMES = 60;  // full charge = 1 second
const HEAVY_RELEASE: FrameData = {
  startup: 8, active: 5, recovery: 22,
  hitstun: 28, blockstun: 20,
  damage: 14, pushbackHit: 1.5, pushbackBlock: 2.0,
  range: 1.3, meterGain: 12, cancelWindow: 4,
  jugglePoints: 3, launchHeight: 5,
};
const HEAVY_MAX_DAMAGE = 24;  // at full charge

// ─── FRAME DATA: SPECIAL MOVES ───
const SP1_DATA: FrameData = {
  startup: 10, active: 8, recovery: 18,
  hitstun: 26, blockstun: 18,
  damage: 18, pushbackHit: 1.2, pushbackBlock: 1.8,
  range: 2.0, meterGain: 0, cancelWindow: 0,
  jugglePoints: 2, launchHeight: 3,
};
const SP2_DATA: FrameData = {
  startup: 14, active: 12, recovery: 22,
  hitstun: 30, blockstun: 22,
  damage: 32, pushbackHit: 1.8, pushbackBlock: 2.5,
  range: 2.2, meterGain: 0, cancelWindow: 0,
  jugglePoints: 3, launchHeight: 4,
};
const SP3_DATA: FrameData = {
  startup: 18, active: 16, recovery: 26,
  hitstun: 36, blockstun: 26,
  damage: 50, pushbackHit: 2.5, pushbackBlock: 3.0,
  range: 2.5, meterGain: 0, cancelWindow: 0,
  jugglePoints: 4, launchHeight: 6,
};

// ─── HITSTOP (freeze frames on contact — THE key to impact feel) ───
const HITSTOP_LIGHT = 7;        // frames both fighters freeze on light hit
const HITSTOP_MEDIUM = 10;
const HITSTOP_HEAVY = 14;
const HITSTOP_SPECIAL = 16;
const HITSTOP_BLOCK = 5;        // less hitstop on block

// ─── COMBO SYSTEM ───
const COMBO_SCALING = 0.88;      // each hit does 88% of previous
const COMBO_SCALING_MIN = 0.30;  // minimum scaling (30% damage floor)
const COMBO_DROP_FRAMES = 40;    // combo drops after 40 frames without a hit
const MAX_COMBO_HITS = 12;       // absolute combo limit
const MAX_JUGGLE_POINTS = 6;     // juggle point budget per combo

// ─── BLOCKING ───
const BLOCKSTUN_RECOVERY = 2;    // extra recovery frames after blockstun ends
const CHIP_DAMAGE_RATIO = 0.10;  // chip damage on block (specials only)
const PARRY_WINDOW_FRAMES = 9;   // 9 frames = 150ms parryWindow
const PARRY_STUN_FRAMES = 72;    // 1.2 seconds of parry stun on opponent
const PARRY_BONUS_DAMAGE = 1.3;
const GUARD_BREAK_THRESHOLD = 5; // consecutive blocks before guard break

// ─── KNOCKDOWN / GETUP ───
const KNOCKDOWN_FRAMES = 36;
const GETUP_FRAMES = 18;
const GETUP_INVULN = 8;          // i-frames during getup

// ─── LAUNCH / JUGGLE ───
const LAUNCH_GRAVITY = -20;      // slower gravity for juggles (floatier in air)
const JUGGLE_HITSTUN_DECAY = 0.85; // each juggle hit gives 85% of normal hitstun

// ─── DEX (EVADE) ───
const DEX_WINDOW_FRAMES = 12;    // 200ms evade window
const DEX_INVULN_FRAMES = 10;

// ─── SPECIAL METER ───
const METER_MAX = 300;
const METER_PER_HIT_TAKEN = 5;   // gain meter when hit (comeback mechanic)
const METER_SP1_COST = 100;
const METER_SP2_COST = 200;
const METER_SP3_COST = 300;

// ─── INTERCEPT ───
const INTERCEPT_BONUS = 1.25;
const INTERCEPT_WINDOW_FRAMES = 6; // frames at start of opponent's attack where intercept counts

// ─── INPUT BUFFER ───
const INPUT_BUFFER_FRAMES = 6;   // inputs stored for 6 frames

// ─── FINISH HIM ───
const FINISH_HIM_HP_THRESHOLD = 0.15;  // triggers at 15% HP
const FINISH_HIM_STUN_FRAMES = 210;    // 3.5 seconds
const FINISH_HIM_SLOW_MO = 0.3;

// ─── ROUND ───
const ROUND_TIME = 99;           // seconds
const MAX_ROUNDS = 3;
const WINS_NEEDED = 2;

// ─── DAMAGE ───
const BASE_HP = 100;


/* ═══════════════════════════════════════════════════════════
   FIGHT ENGINE 3D CLASS — AAA FRAME-BASED COMBAT
   ═══════════════════════════════════════════════════════════ */
export class FightEngine3D {
  // Three.js
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;

  // Fighters
  private p1!: Fighter;
  private p2!: Fighter;

  // Game state
  private phase: FightPhase = "intro";
  private phaseTimer = 0;
  private roundTimer = ROUND_TIME;
  private currentRound = 1;
  private maxRounds = MAX_ROUNDS;
  private paused = false;
  private difficulty: Difficulty;
  private callbacks: FightCallbacks;
  private gameFrame = 0;           // global frame counter

  // Frame-based timing accumulator
  private frameAccumulator = 0;

  // Effects
  private hitEffects: HitEffect[] = [];
  private screenShake = { intensity: 0, duration: 0, timer: 0 };
  private hitStop = { active: false, frames: 0, remaining: 0 };
  private slowMo = { active: false, speed: 1, frames: 0, remaining: 0 };

  // AAA VFX Systems
  private afterimages: AfterimageFrame[] = [];
  private energyProjectiles: EnergyProjectile[] = [];
  private impactCraters: ImpactCrater[] = [];
  private screenFlash = { active: false, color: new THREE.Color(1, 1, 1), intensity: 0, timer: 0, duration: 0 };
  private screenFlashMesh!: THREE.Mesh;
  private cinematicCamera: CinematicCamera = {
    active: false, type: "none", timer: 0, duration: 0,
    startPos: new THREE.Vector3(), endPos: new THREE.Vector3(),
    startLookAt: new THREE.Vector3(), endLookAt: new THREE.Vector3(),
  };
  private koZoomTarget: THREE.Vector3 | null = null;
  private introSweepDone = false;

  // Camera
  private cameraTarget = new THREE.Vector3(0, 1.0, 0);
  private cameraShakeOffset = new THREE.Vector3();

  // Input — buffered system
  private keys: Set<string> = new Set();
  private inputQueue: TouchInput[] = [];
  private inputBuffer: BufferedInput[] = [];
  private holdingBlock = false;
  private holdingHeavy = false;
  private heavyHoldStart = 0;

  // Legacy touch state
  private touchState = { left: false, right: false, up: false, down: false, punch: false, kick: false, block: false, special: false };

  // Stage
  private stageFloor!: THREE.Mesh;
  private stageLights: THREE.PointLight[] = [];
  private arenaBackgroundUrl?: string;
  private arenaAmbientColor?: string;
  private arenaFloorColor?: string;

  // Character specials
  private p1Specials!: CharacterSpecials;
  private p2Specials!: CharacterSpecials;

  // Finish Him
  private finishHimTriggered = false;
  private finishHimTarget: 1 | 2 = 2;

  // Animation
  private animFrame = 0;
  private disposed = false;

  constructor(
    container: HTMLElement,
    p1Data: FighterData,
    p2Data: FighterData,
    difficulty: Difficulty,
    callbacks: FightCallbacks = {},
    arenaData?: { backgroundImage?: string; ambientColor?: string; floorColor?: string },
    public trainingMode = false
  ) {
    this.difficulty = difficulty;
    this.callbacks = callbacks;
    this.arenaBackgroundUrl = arenaData?.backgroundImage;
    this.arenaAmbientColor = arenaData?.ambientColor;
    this.arenaFloorColor = arenaData?.floorColor;

    // Three.js setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    this.camera.position.set(0, 2.2, 7);
    this.camera.lookAt(0, 1.0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();

    // Build scene
    this.buildStage();
    this.buildLighting();
    this.buildScreenFlash();

    // Create fighters
    this.p1 = this.createFighter(p1Data, -2.5, true);
    this.p2 = this.createFighter(p2Data, 2.5, false);
    this.p1Specials = getCharacterSpecials(p1Data.id);
    this.p2Specials = getCharacterSpecials(p2Data.id);
    this.p1.specials = this.p1Specials;
    this.p2.specials = this.p2Specials;

    // Input setup
    this.setupInput();

    // Start intro
    this.phase = "intro";
    this.phaseTimer = 0;
    this.callbacks.onPhaseChange?.("intro");

    // Start game loop
    this.gameLoop();
  }

  /* ═══ STAGE BUILDING ═══ */
  private buildStage() {
    // Background
    this.scene.background = new THREE.Color(0x0a0a12);
    this.scene.fog = new THREE.FogExp2(0x0a0a12, 0.04);

    if (this.arenaBackgroundUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(this.arenaBackgroundUrl, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const bgGeo = new THREE.PlaneGeometry(30, 16);
        const bgMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.6 });
        const bgMesh = new THREE.Mesh(bgGeo, bgMat);
        bgMesh.position.set(0, 4, -8);
        this.scene.add(bgMesh);
      });
    }

    // Floor
    const floorColor = this.arenaFloorColor || "#1a1a2e";
    const floorGeo = new THREE.PlaneGeometry(STAGE_WIDTH * 2, 8);
    const floorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(floorColor),
      roughness: 0.7,
      metalness: 0.3,
    });
    this.stageFloor = new THREE.Mesh(floorGeo, floorMat);
    this.stageFloor.rotation.x = -Math.PI / 2;
    this.stageFloor.position.y = 0;
    this.stageFloor.receiveShadow = true;
    this.scene.add(this.stageFloor);

    // Stage boundaries (subtle glowing lines)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.15 });
    for (const xPos of [-STAGE_HALF, STAGE_HALF]) {
      const lineGeo = new THREE.PlaneGeometry(0.05, 4);
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(xPos, 2, -0.5);
      this.scene.add(line);
    }

    // Grid lines on floor
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.04 });
    for (let i = -6; i <= 6; i++) {
      const gridLine = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 8), gridMat);
      gridLine.rotation.x = -Math.PI / 2;
      gridLine.position.set(i, 0.01, 0);
      this.scene.add(gridLine);
    }

    // FLOOR GLOW LINES — energy channels running along the arena floor
    const glowLineMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.12 });
    for (let i = -3; i <= 3; i += 2) {
      const channelGeo = new THREE.PlaneGeometry(STAGE_WIDTH * 1.5, 0.04);
      const channel = new THREE.Mesh(channelGeo, glowLineMat);
      channel.rotation.x = -Math.PI / 2;
      channel.position.set(0, 0.015, i * 0.5);
      this.scene.add(channel);
    }

    // ── SIDE DECORATIONS & barriers ──
    const barrierMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a3e, metalness: 0.8, roughness: 0.3, transparent: true, opacity: 0.6,
    });
    for (const side of [-1, 1]) {
      const barrierGeo = new THREE.BoxGeometry(0.15, 2.5, 3);
      const barrier = new THREE.Mesh(barrierGeo, barrierMat);
      barrier.position.set(side * (STAGE_HALF + 0.3), 1.25, -0.5);
      this.scene.add(barrier);
    }

    // Emblem rings on barriers
    const ringGeo = new THREE.TorusGeometry(0.35, 0.04, 8, 24);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.3 });
    for (const side of [-1, 1]) {
      const ring = new THREE.Mesh(ringGeo, ringMat2);
      ring.position.set(side * (STAGE_HALF + 0.3), 2, -0.5);
      ring.rotation.y = Math.PI / 2;
      this.scene.add(ring);
    }

    // ── PILLARS ──
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a4e, metalness: 0.7, roughness: 0.4,
    });
    for (const side of [-1, 1]) {
      const pillarGeo = new THREE.CylinderGeometry(0.2, 0.25, 5, 8);
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(side * (STAGE_HALF + 0.8), 2.5, -2);
      pillar.castShadow = true;
      this.scene.add(pillar);

      // Pillar glow ring
      const pRingGeo = new THREE.TorusGeometry(0.28, 0.03, 8, 16);
      const pRing = new THREE.Mesh(pRingGeo, ringMat2);
      pRing.position.set(side * (STAGE_HALF + 0.8), 4.5, -2);
      pRing.rotation.x = Math.PI / 2;
      this.scene.add(pRing);
    }

    // ── ARCHWAY ── spanning between pillars
    const archGeo = new THREE.TorusGeometry(STAGE_HALF + 0.8, 0.12, 8, 32, Math.PI);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x3a3a6e, metalness: 0.6, roughness: 0.5, transparent: true, opacity: 0.5,
    });
    const arch = new THREE.Mesh(archGeo, archMat);
    arch.position.set(0, 5, -2);
    arch.rotation.z = Math.PI;
    this.scene.add(arch);
  }

  private buildLighting() {
    const ambientColor = this.arenaAmbientColor || "#4a6fa5";
    const ambient = new THREE.AmbientLight(new THREE.Color(ambientColor), 0.5);
    this.scene.add(ambient);

    // Key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    this.scene.add(keyLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x6688cc, 0.4);
    fillLight.position.set(-3, 4, 3);
    this.scene.add(fillLight);

    // Rim light
    const rimLight = new THREE.DirectionalLight(0xff4444, 0.3);
    rimLight.position.set(0, 3, -5);
    this.scene.add(rimLight);

    // Fighter spotlights
    for (const xPos of [-2.5, 2.5]) {
      const spot = new THREE.PointLight(0xffffff, 0.6, 8);
      spot.position.set(xPos, 4, 2);
      this.scene.add(spot);
      this.stageLights.push(spot);
    }
  }

  private buildScreenFlash() {
    const flashGeo = new THREE.PlaneGeometry(40, 40);
    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
    });
    this.screenFlashMesh = new THREE.Mesh(flashGeo, flashMat);
    this.screenFlashMesh.position.set(0, 0, 5);
    this.screenFlashMesh.renderOrder = 999;
    this.scene.add(this.screenFlashMesh);
  }

  /* ═══ FIGHTER CREATION ═══ */
  private createFighter(data: FighterData, startX: number, facingRight: boolean): Fighter {
    const model = buildCharacterModel(data.id);
    const config = getCharacterConfig(data.id);
    model.group.position.set(startX, 0, 0);
    this.scene.add(model.group);

    // Scale based on character stats (FighterData has hp/attack/defense/speed directly)
    const hpMult = 1 + (data.hp - 50) / 100;
    const maxHp = Math.round(BASE_HP * hpMult);

    return {
      data, model, config,
      x: startX, y: 0, vx: 0, vy: 0,
      facingRight,
      state: "idle",
      stateFrame: 0,
      hp: maxHp, maxHp, displayHp: maxHp,
      comboCount: 0, comboDamage: 0, comboTimer: 0, comboChain: 0, maxComboHits: 0,
      jugglePoints: MAX_JUGGLE_POINTS, airborne: false,
      specialMeter: 0,
      blockFrame: 0, isParrying: false, parryFrames: 0,
      invincibleFrames: 0,
      dexActive: false, dexFrames: 0,
      heavyChargeFrames: 0,
      roundWins: 0,
      aiStyle: "balanced",
      aiTimer: 0, aiDecision: "idle", aiComboStep: 0,
      aiReactDelay: this.getAIReactDelay(),
      aiReactTimer: 0, aiPressureTimer: 0, aiDodgeCooldown: 0,
      aiAggression: 0, aiMistakeTimer: 0,
      aiPatternMemory: [],
      aiLastSeenState: "idle",
      aiWhiffPunishWindow: 0,
      stunFrames: 0,
      dashCooldownFrames: 0,
      hitThisAttack: false,
      cancelUsed: false,
      specials: getCharacterSpecials(data.id),
      dotTimer: 0, dotDamagePerTick: 0, dotTickInterval: 0, dotTickTimer: 0,
      speedBuffTimer: 0, speedBuffMult: 1,
      defenseDebuffTimer: 0, defenseDebuffPct: 0,
      pushVx: 0,
    };
  }

  private getAIReactDelay(): number {
    switch (this.difficulty) {
      case "recruit": return 25;   // ~417ms — very slow reactions
      case "soldier": return 16;   // ~267ms — average human
      case "veteran": return 10;   // ~167ms — fast
      case "archon": return 4;     // ~67ms — near frame-perfect
      default: return 16;
    }
  }

  /* ═══ INPUT SYSTEM ═══ */
  private setupInput() {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (!this.keys.has(key)) {
        this.keys.add(key);
        this.processKeyDown(key);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      this.keys.delete(key);
      this.processKeyUp(key);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  }

  private processKeyDown(key: string) {
    // Map keyboard to buffered inputs
    switch (key) {
      case "j": case "z": this.bufferInput("light"); break;
      case "k": case "x": this.bufferInput("medium"); break;
      case "l": case "c": this.bufferInput("heavy_start"); break;
      case "i": case "v": this.bufferInput("special"); break;
      case "w": case "arrowup": this.bufferInput("jump"); break;
      case "s": case "arrowdown": this.bufferInput("down"); break;
      case "a": case "arrowleft": this.bufferInput("left"); break;
      case "d": case "arrowright": this.bufferInput("right"); break;
    }
  }

  private processKeyUp(key: string) {
    if (key === "l" || key === "c") {
      this.bufferInput("heavy_release");
    }
  }

  /** Add an input to the buffer */
  private bufferInput(action: InputAction) {
    this.inputBuffer.push({ action, frame: this.gameFrame });
  }

  /** Consume the oldest buffered input of a given type (within buffer window) */
  private consumeBuffer(action: InputAction): boolean {
    const cutoff = this.gameFrame - INPUT_BUFFER_FRAMES;
    const idx = this.inputBuffer.findIndex(b => b.action === action && b.frame >= cutoff);
    if (idx >= 0) {
      this.inputBuffer.splice(idx, 1);
      return true;
    }
    return false;
  }

  /** Check if an input is in the buffer without consuming */
  private peekBuffer(action: InputAction): boolean {
    const cutoff = this.gameFrame - INPUT_BUFFER_FRAMES;
    return this.inputBuffer.some(b => b.action === action && b.frame >= cutoff);
  }

  /** Clean expired buffer entries */
  private cleanBuffer() {
    const cutoff = this.gameFrame - INPUT_BUFFER_FRAMES * 2;
    this.inputBuffer = this.inputBuffer.filter(b => b.frame >= cutoff);
  }

  // Public input methods (called by FightArena3D)
  public pushTouchInput(input: TouchInput) {
    this.inputQueue.push(input);
  }

  public setTouchState(state: Partial<typeof this.touchState>) {
    Object.assign(this.touchState, state);
  }

  public setBlockHold(holding: boolean) {
    this.holdingBlock = holding;
    if (holding) {
      this.bufferInput("block");
    } else {
      this.bufferInput("block_release");
    }
  }

  public setHeavyHold(holding: boolean) {
    this.holdingHeavy = holding;
    if (holding) {
      this.heavyHoldStart = this.gameFrame;
      this.bufferInput("heavy_start");
    } else {
      this.bufferInput("heavy_release");
    }
  }

  /* ═══ CORE GAME LOOP — FIXED TIMESTEP AT 60FPS ═══ */
  private gameLoop = () => {
    if (this.disposed) return;
    requestAnimationFrame(this.gameLoop);

    if (this.paused) return;

    const rawDt = this.clock.getDelta();
    // Apply slow-mo
    const effectiveDt = this.slowMo.active ? rawDt * this.slowMo.speed : rawDt;

    // Fixed timestep accumulator — ensures consistent frame-based logic
    this.frameAccumulator += effectiveDt;

    // Process frames (cap at 4 to prevent spiral of death)
    let framesProcessed = 0;
    while (this.frameAccumulator >= FRAME_DURATION && framesProcessed < 4) {
      this.frameAccumulator -= FRAME_DURATION;
      framesProcessed++;

      // Skip game logic during hitstop (but still render)
      if (this.hitStop.active) {
        this.hitStop.remaining--;
        if (this.hitStop.remaining <= 0) {
          this.hitStop.active = false;
        }
        continue;
      }

      this.gameFrame++;
      this.fixedUpdate();
    }

    // Always render (even during hitstop for visual feedback)
    this.updateVisuals(rawDt);
    this.render();
  };

  /** Fixed update — runs exactly once per game frame (1/60s) */
  private fixedUpdate() {
    this.cleanBuffer();
    this.processTouchQueue();

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
        break;
    }

    // Update slow-mo timer
    if (this.slowMo.active) {
      this.slowMo.remaining--;
      if (this.slowMo.remaining <= 0) {
        this.slowMo.active = false;
        this.slowMo.speed = 1;
      }
    }
  }

  /** Process queued touch inputs into the buffer */
  private processTouchQueue() {
    while (this.inputQueue.length > 0) {
      const input = this.inputQueue.shift()!;
      this.mapTouchToBuffer(input);
    }
  }

  /** Map touch gestures to buffered input actions */
  private mapTouchToBuffer(input: TouchInput) {
    if (input.side === "right") {
      switch (input.type) {
        case "tap": this.bufferInput("light"); break;
        case "swipe_right": this.bufferInput("medium"); break;
        case "swipe_up": this.bufferInput("special"); break;
        case "swipe_down": this.bufferInput("heavy_start"); break;
        case "hold_start": this.bufferInput("heavy_start"); break;
        case "hold_end": this.bufferInput("heavy_release"); break;
      }
    } else {
      switch (input.type) {
        case "swipe_left": this.bufferInput("dash_back"); break;
        case "swipe_right": this.bufferInput("dash_fwd"); break;
        case "tap": this.bufferInput("block"); break;
        case "hold_start": this.bufferInput("block"); break;
        case "hold_end": this.bufferInput("block_release"); break;
        case "swipe_up": this.bufferInput("jump"); break;
      }
    }
  }

  /* ═══ PHASE UPDATES ═══ */
  private updateIntro() {
    this.phaseTimer++;
    if (!this.introSweepDone && this.phaseTimer === 1) {
      this.startCinematicCamera("intro_sweep", 2.0);
      this.introSweepDone = true;
    }
    if (this.phaseTimer >= 120) { // 2 seconds
      this.phase = "round_announce";
      this.phaseTimer = 0;
      this.callbacks.onPhaseChange?.("round_announce");
    }
  }

  private updateRoundAnnounce() {
    this.phaseTimer++;
    if (this.phaseTimer >= 90) { // 1.5 seconds
      this.phase = "fighting";
      this.phaseTimer = 0;
      this.callbacks.onPhaseChange?.("fighting");
    }
  }

  private updateFighting() {
    // Round timer (decrement every 60 frames = 1 second)
    this.phaseTimer++;
    if (this.phaseTimer % FPS === 0) {
      this.roundTimer = Math.max(0, this.roundTimer - 1);
      if (this.roundTimer <= 0) {
        // Time out — winner is whoever has more HP
        const winner: 1 | 2 = this.p1.hp >= this.p2.hp ? 1 : 2;
        this.endRound(winner);
        return;
      }
    }

    // Update both fighters
    this.updateFighterFrame(this.p1, this.p2, true);
    this.updateFighterFrame(this.p2, this.p1, false);

    // Process player input for P1
    this.processPlayerInput(this.p1);

    // AI for P2
    this.updateAI(this.p2, this.p1);

    // Collision resolution
    this.resolveFighterCollision();
    this.clampToStage(this.p1);
    this.clampToStage(this.p2);

    // Update facing
    this.updateFacing();

    // Check hits
    this.checkHits();

    // Update projectiles
    this.updateProjectilesFrame();

    // Check for FINISH HIM
    this.checkFinishHim();

    // Check for KO
    this.checkKO();

    // Smooth HP display
    this.smoothHpDisplay(this.p1);
    this.smoothHpDisplay(this.p2);

    // Report health
    this.callbacks.onHealthChange?.(this.p1.hp, this.p1.maxHp, this.p2.hp, this.p2.maxHp);
  }

  private updateFinishHim() {
    this.phaseTimer++;
    const target = this.finishHimTarget === 1 ? this.p1 : this.p2;
    const attacker = this.finishHimTarget === 1 ? this.p2 : this.p1;

    // Target is stunned
    target.state = "finish_stun";

    // Attacker can still act
    if (this.finishHimTarget === 2) {
      this.processPlayerInput(this.p1);
    }
    this.updateFighterFrame(attacker, target, this.finishHimTarget === 2);
    this.updateFighterFrame(target, attacker, this.finishHimTarget === 1);

    // Spawn sweat particles on stunned target
    if (this.phaseTimer % 15 === 0) {
      this.spawnHitEffect(target.x, 1.5, 0, "sweat", "#88ccff");
    }

    // Timeout — if attacker doesn't finish, round ends
    if (this.phaseTimer >= FINISH_HIM_STUN_FRAMES) {
      this.endRound(this.finishHimTarget === 1 ? 2 : 1);
    }

    // Check if target got KO'd
    if (target.hp <= 0) {
      this.endRound(this.finishHimTarget === 1 ? 2 : 1);
    }

    this.resolveFighterCollision();
    this.clampToStage(this.p1);
    this.clampToStage(this.p2);
    this.smoothHpDisplay(this.p1);
    this.smoothHpDisplay(this.p2);
    this.callbacks.onHealthChange?.(this.p1.hp, this.p1.maxHp, this.p2.hp, this.p2.maxHp);
  }

  private updateKO() {
    this.phaseTimer++;
    if (this.phaseTimer >= 120) { // 2 seconds
      const winner: 1 | 2 = this.p1.hp > 0 ? 1 : 2;
      this.endRound(winner);
    }
  }

  private updateRoundEnd() {
    this.phaseTimer++;
    if (this.phaseTimer >= 120) {
      if (this.checkMatchEnd()) return;
      this.resetRound();
    }
  }

  private checkFinishHim() {
    if (this.finishHimTriggered) return;

    for (const [fighter, id] of [[this.p1, 1], [this.p2, 2]] as [Fighter, 1 | 2][]) {
      const ratio = fighter.hp / fighter.maxHp;
      if (ratio <= FINISH_HIM_HP_THRESHOLD && ratio > 0 && fighter.state === "hitstun") {
        this.finishHimTriggered = true;
        this.finishHimTarget = id;
        this.phase = "finish_him";
        this.phaseTimer = 0;
        fighter.stunFrames = FINISH_HIM_STUN_FRAMES;
        this.slowMo = { active: true, speed: FINISH_HIM_SLOW_MO, frames: 60, remaining: 60 };
        this.triggerScreenFlash("#ff0000", 0.4, 0.3);
        this.callbacks.onPhaseChange?.("finish_him");
        this.callbacks.onFinishHim?.(id);
        break;
      }
    }
  }

  private checkKO() {
    for (const [fighter, id] of [[this.p1, 1], [this.p2, 2]] as [Fighter, 1 | 2][]) {
      if (fighter.hp <= 0 && this.phase === "fighting") {
        fighter.hp = 0;
        fighter.state = "ko";
        fighter.stateFrame = 0;
        this.phase = "ko";
        this.phaseTimer = 0;
        this.slowMo = { active: true, speed: 0.2, frames: 40, remaining: 40 };
        this.startCinematicCamera("ko_zoom", 1.5);
        this.koZoomTarget = new THREE.Vector3(fighter.x, 1, 0);
        this.spawnHitEffect(fighter.x, 1.0, 0, "dust", "#aaaaaa");
        this.spawnGroundCrater(fighter.x, "#ff4444");
        this.triggerScreenFlash("#ffffff", 0.8, 0.2);
        this.screenShake = { intensity: 0.15, duration: 0.5, timer: 0 };
        this.callbacks.onPhaseChange?.("ko");
        break;
      }
    }
  }


  /* ═══ FIGHTER FRAME UPDATE — Per-frame state machine ═══ */
  private updateFighterFrame(f: Fighter, opponent: Fighter, isPlayer: boolean) {
    f.stateFrame++;

    // Decrement timers (frame-based)
    if (f.invincibleFrames > 0) f.invincibleFrames--;
    if (f.dashCooldownFrames > 0) f.dashCooldownFrames--;
    if (f.stunFrames > 0) f.stunFrames--;
    if (f.parryFrames > 0) { f.parryFrames--; if (f.parryFrames <= 0) f.isParrying = false; }
    if (f.dexActive) { f.dexFrames--; if (f.dexFrames <= 0) f.dexActive = false; }

    // Combo drop timer
    if (f.comboCount > 0) {
      f.comboTimer++;
      if (f.comboTimer >= COMBO_DROP_FRAMES) {
        if (f.comboCount > f.maxComboHits) f.maxComboHits = f.comboCount;
        f.comboCount = 0;
        f.comboDamage = 0;
        f.comboTimer = 0;
      }
    }

    // DOT ticks
    if (f.dotTimer > 0) {
      f.dotTimer -= FRAME_DURATION;
      f.dotTickTimer -= FRAME_DURATION;
      if (f.dotTickTimer <= 0) {
        f.hp = Math.max(0, f.hp - f.dotDamagePerTick);
        f.dotTickTimer = f.dotTickInterval;
        const pid: 1 | 2 = f === this.p1 ? 1 : 2;
        this.callbacks.onDot?.(pid, f.dotDamagePerTick);
      }
    }

    // Buff/debuff timers
    if (f.speedBuffTimer > 0) { f.speedBuffTimer -= FRAME_DURATION; if (f.speedBuffTimer <= 0) f.speedBuffMult = 1; }
    if (f.defenseDebuffTimer > 0) { f.defenseDebuffTimer -= FRAME_DURATION; if (f.defenseDebuffTimer <= 0) f.defenseDebuffPct = 0; }

    // Pushback deceleration
    if (Math.abs(f.pushVx) > 0.01) {
      const decel = PUSHBACK_DECEL * FRAME_DURATION;
      if (f.pushVx > 0) f.pushVx = Math.max(0, f.pushVx - decel);
      else f.pushVx = Math.min(0, f.pushVx + decel);
      f.x += f.pushVx * FRAME_DURATION;
    } else {
      f.pushVx = 0;
    }

    // State machine
    switch (f.state) {
      case "idle":
        f.vx = 0;
        f.airborne = false;
        f.jugglePoints = MAX_JUGGLE_POINTS;
        break;

      case "walk_fwd": {
        const targetSpeed = (f.facingRight ? 1 : -1) * WALK_FWD_SPEED * f.speedBuffMult;
        f.vx = this.approach(f.vx, targetSpeed, WALK_ACCEL * FRAME_DURATION);
        f.x += f.vx * FRAME_DURATION;
        break;
      }

      case "walk_back": {
        const targetSpeed = (f.facingRight ? -1 : 1) * WALK_BACK_SPEED * f.speedBuffMult;
        f.vx = this.approach(f.vx, targetSpeed, WALK_ACCEL * FRAME_DURATION);
        f.x += f.vx * FRAME_DURATION;
        break;
      }

      case "dash_fwd": {
        const totalFrames = DASH_FWD_FRAMES;
        if (f.stateFrame <= totalFrames) {
          // Acceleration curve: fast start, slight decel at end
          const progress = f.stateFrame / totalFrames;
          const speedCurve = progress < 0.3 ? 1.2 : (1.0 - (progress - 0.3) * 0.4);
          f.vx = (f.facingRight ? 1 : -1) * DASH_FWD_SPEED * speedCurve;
          f.x += f.vx * FRAME_DURATION;
          // Spawn afterimage every 3 frames
          if (f.stateFrame % 3 === 0) this.spawnAfterimage(f);
        } else {
          f.state = "idle";
          f.stateFrame = 0;
          f.vx = 0;
          f.dashCooldownFrames = DASH_COOLDOWN_FRAMES;
        }
        break;
      }

      case "dash_back": {
        const totalFrames = DASH_BACK_FRAMES;
        if (f.stateFrame <= totalFrames) {
          // Invulnerable at start
          if (f.stateFrame <= DASH_INVULN_FRAMES) f.invincibleFrames = 1;
          const progress = f.stateFrame / totalFrames;
          const speedCurve = progress < 0.4 ? 1.3 : (1.0 - (progress - 0.4) * 0.5);
          f.vx = (f.facingRight ? -1 : 1) * DASH_BACK_SPEED * speedCurve;
          f.x += f.vx * FRAME_DURATION;
          if (f.stateFrame % 3 === 0) this.spawnAfterimage(f);
        } else {
          f.state = "idle";
          f.stateFrame = 0;
          f.vx = 0;
          f.dashCooldownFrames = DASH_COOLDOWN_FRAMES;
        }
        break;
      }

      case "jump":
      case "jump_fwd":
      case "jump_back": {
        // Pre-jump frames
        if (f.stateFrame <= PRE_JUMP_FRAMES) {
          if (f.stateFrame === PRE_JUMP_FRAMES) {
            f.vy = JUMP_FORCE;
            if (f.state === "jump_fwd") f.vx = (f.facingRight ? 1 : -1) * JUMP_FWD_VX;
            else if (f.state === "jump_back") f.vx = (f.facingRight ? -1 : 1) * JUMP_BACK_VX;
            f.airborne = true;
          }
        } else {
          // Airborne physics
          f.vy += GRAVITY * FRAME_DURATION;
          f.y += f.vy * FRAME_DURATION;
          f.x += f.vx * FRAME_DURATION;

          // Landing
          if (f.y <= GROUND_Y && f.vy < 0) {
            f.y = GROUND_Y;
            f.vy = 0;
            f.vx = 0;
            f.airborne = false;
            f.jugglePoints = MAX_JUGGLE_POINTS;
            f.state = "idle";
            f.stateFrame = 0;
            // Landing recovery — can't act for a few frames
            f.stunFrames = LANDING_RECOVERY;
          }
        }
        break;
      }

      // Attack states — use frame data
      case "light_1": case "light_2": case "light_3": case "light_4":
      case "medium":
      case "heavy_release":
      case "special_1": case "special_2": case "special_3": {
        const fd = this.getFrameData(f.state);
        const totalFrames = fd.startup + fd.active + fd.recovery;

        // Medium attack lunge
        if (f.state === "medium" && f.stateFrame <= fd.startup + fd.active) {
          const lungeSpeed = MEDIUM_LUNGE / ((fd.startup + fd.active) * FRAME_DURATION);
          f.x += (f.facingRight ? 1 : -1) * lungeSpeed * FRAME_DURATION;
        }

        // Attack complete
        if (f.stateFrame >= totalFrames) {
          f.state = "idle";
          f.stateFrame = 0;
          f.hitThisAttack = false;
          f.cancelUsed = false;
          f.comboChain = 0;
        }
        break;
      }

      case "heavy_charge": {
        f.heavyChargeFrames++;
        f.vx = 0;
        // Auto-release at max charge
        if (f.heavyChargeFrames >= HEAVY_MAX_CHARGE_FRAMES && !this.holdingHeavy) {
          this.startAttack(f, "heavy_release");
        }
        break;
      }

      case "block_stand":
      case "block_crouch": {
        f.vx = 0;
        // Parry window check
        if (f.stateFrame <= PARRY_WINDOW_FRAMES) {
          f.isParrying = true;
          f.parryFrames = PARRY_WINDOW_FRAMES - f.stateFrame;
        }
        // Release block
        if (!this.holdingBlock && !this.keys.has("s") && !this.keys.has("arrowdown")) {
          if (f === this.p1) {
            f.state = "idle";
            f.stateFrame = 0;
          }
        }
        break;
      }

      case "blockstun": {
        f.vx = 0;
        if (f.stunFrames <= 0) {
          f.state = "idle";
          f.stateFrame = 0;
        }
        break;
      }

      case "hitstun": {
        f.vx = 0;
        if (f.stunFrames <= 0) {
          f.state = "idle";
          f.stateFrame = 0;
        }
        break;
      }

      case "launched": {
        // Airborne after being launched
        f.vy += LAUNCH_GRAVITY * FRAME_DURATION;
        f.y += f.vy * FRAME_DURATION;
        f.x += f.pushVx * FRAME_DURATION;
        f.airborne = true;

        if (f.y <= GROUND_Y && f.vy < 0) {
          f.y = GROUND_Y;
          f.vy = 0;
          f.airborne = false;
          f.state = "knockdown";
          f.stateFrame = 0;
          f.stunFrames = KNOCKDOWN_FRAMES;
          // Dust on landing
          this.spawnHitEffect(f.x, 0.1, 0, "dust", "#aaaaaa");
          this.screenShake = { intensity: 0.06, duration: 0.15, timer: 0 };
        }
        break;
      }

      case "knockdown": {
        f.vx = 0;
        if (f.stunFrames <= 0) {
          f.state = "getup";
          f.stateFrame = 0;
          f.stunFrames = GETUP_FRAMES;
          f.invincibleFrames = GETUP_INVULN;
        }
        break;
      }

      case "getup": {
        if (f.stunFrames <= 0) {
          f.state = "idle";
          f.stateFrame = 0;
          f.jugglePoints = MAX_JUGGLE_POINTS;
        }
        break;
      }

      case "parry_stun": {
        f.vx = 0;
        if (f.stunFrames <= 0) {
          f.state = "idle";
          f.stateFrame = 0;
        }
        break;
      }

      case "finish_stun":
        f.vx = 0;
        break;

      case "ko":
        f.vx = 0;
        // Slowly fall
        if (f.y > GROUND_Y) {
          f.vy += GRAVITY * FRAME_DURATION;
          f.y += f.vy * FRAME_DURATION;
          if (f.y <= GROUND_Y) f.y = GROUND_Y;
        }
        break;

      case "victory":
        f.vx = 0;
        break;
    }
  }

  /** Smoothly approach a target value */
  private approach(current: number, target: number, maxDelta: number): number {
    if (current < target) return Math.min(current + maxDelta, target);
    if (current > target) return Math.max(current - maxDelta, target);
    return target;
  }

  /* ═══ PLAYER INPUT PROCESSING — Uses input buffer ═══ */
  private processPlayerInput(f: Fighter) {
    if (this.phase !== "fighting" && this.phase !== "finish_him") return;
    if (f.state === "ko" || f.state === "victory") return;

    // Can't act during stun (except blockstun → can buffer)
    if (f.state === "hitstun" || f.state === "knockdown" || f.state === "getup" ||
        f.state === "parry_stun" || f.state === "finish_stun" || f.state === "launched") {
      return;
    }

    const isAttacking = this.isInAttackState(f);
    const canCancel = isAttacking && this.canCancelIntoNext(f) && !f.cancelUsed;
    const isIdle = f.state === "idle" || f.state === "walk_fwd" || f.state === "walk_back";
    const canAct = isIdle || canCancel;

    if (!canAct && !isAttacking) return;

    // ── Check buffered inputs in priority order ──

    // Special attack (highest priority when available)
    if (canAct && this.consumeBuffer("special")) {
      this.doSpecialAttack(f);
      return;
    }

    // Heavy release
    if (f.state === "heavy_charge" && this.consumeBuffer("heavy_release")) {
      this.startAttack(f, "heavy_release");
      return;
    }

    // Heavy start
    if (canAct && this.consumeBuffer("heavy_start")) {
      f.state = "heavy_charge";
      f.stateFrame = 0;
      f.heavyChargeFrames = 0;
      return;
    }

    // Medium attack
    if (canAct && this.consumeBuffer("medium")) {
      if (canCancel) f.cancelUsed = true;
      this.startAttack(f, "medium");
      return;
    }

    // Light attack (chains)
    if (canAct && this.consumeBuffer("light")) {
      if (canCancel) f.cancelUsed = true;
      this.doLightAttack(f);
      return;
    }

    // Block
    if (isIdle && (this.holdingBlock || this.consumeBuffer("block"))) {
      const down = this.keys.has("s") || this.keys.has("arrowdown") || this.touchState.down;
      f.state = down ? "block_crouch" : "block_stand";
      f.stateFrame = 0;
      f.blockFrame = this.gameFrame;
      f.isParrying = true;
      f.parryFrames = PARRY_WINDOW_FRAMES;
      return;
    }

    // Dash back
    if (isIdle && f.dashCooldownFrames <= 0 && this.consumeBuffer("dash_back")) {
      this.doDashBack(f);
      return;
    }

    // Dash forward
    if (isIdle && f.dashCooldownFrames <= 0 && this.consumeBuffer("dash_fwd")) {
      this.doDashForward(f);
      return;
    }

    // Jump
    if (isIdle && this.consumeBuffer("jump")) {
      const fwd = this.keys.has(f.facingRight ? "d" : "a") || this.keys.has(f.facingRight ? "arrowright" : "arrowleft");
      const back = this.keys.has(f.facingRight ? "a" : "d") || this.keys.has(f.facingRight ? "arrowleft" : "arrowright");
      if (fwd) f.state = "jump_fwd";
      else if (back) f.state = "jump_back";
      else f.state = "jump";
      f.stateFrame = 0;
      f.vx = 0;
      return;
    }

    // Walking (continuous, not buffered)
    if (isIdle && !isAttacking) {
      const left = this.keys.has("a") || this.keys.has("arrowleft");
      const right = this.keys.has("d") || this.keys.has("arrowright");

      if (right && !left) {
        f.state = f.facingRight ? "walk_fwd" : "walk_back";
        f.stateFrame = f.state === f.state ? f.stateFrame : 0; // preserve frame if same state
      } else if (left && !right) {
        f.state = f.facingRight ? "walk_back" : "walk_fwd";
        f.stateFrame = f.state === f.state ? f.stateFrame : 0;
      } else if (f.state === "walk_fwd" || f.state === "walk_back") {
        f.state = "idle";
        f.stateFrame = 0;
        // Decelerate to stop
        f.vx = this.approach(f.vx, 0, WALK_DECEL * FRAME_DURATION);
      }
    }
  }

  /* ═══ ATTACK SYSTEM ═══ */
  private doLightAttack(f: Fighter) {
    // Chain system: L1 → L2 → L3 → L4
    const chain = f.comboChain;
    const states: FighterState[] = ["light_1", "light_2", "light_3", "light_4"];
    const nextState = states[Math.min(chain, 3)];
    this.startAttack(f, nextState);
    f.comboChain = Math.min(chain + 1, 4);
  }

  private doSpecialAttack(f: Fighter) {
    if (f.specialMeter >= METER_SP3_COST) {
      this.startAttack(f, "special_3");
      f.specialMeter -= METER_SP3_COST;
    } else if (f.specialMeter >= METER_SP2_COST) {
      this.startAttack(f, "special_2");
      f.specialMeter -= METER_SP2_COST;
    } else if (f.specialMeter >= METER_SP1_COST) {
      this.startAttack(f, "special_1");
      f.specialMeter -= METER_SP1_COST;
    }
  }

  private doDashForward(f: Fighter) {
    f.state = "dash_fwd";
    f.stateFrame = 0;
    f.dashCooldownFrames = DASH_COOLDOWN_FRAMES;
  }

  private doDashBack(f: Fighter) {
    f.state = "dash_back";
    f.stateFrame = 0;
    f.dashCooldownFrames = DASH_COOLDOWN_FRAMES;
    // Dex check — if timed during opponent's attack startup
    const opponent = f === this.p1 ? this.p2 : this.p1;
    if (this.isInAttackState(opponent)) {
      const fd = this.getFrameData(opponent.state);
      if (opponent.stateFrame <= fd.startup) {
        f.dexActive = true;
        f.dexFrames = DEX_INVULN_FRAMES;
        f.invincibleFrames = DEX_INVULN_FRAMES;
        const pid: 1 | 2 = f === this.p1 ? 1 : 2;
        this.callbacks.onDex?.(pid);
      }
    }
  }

  private startAttack(f: Fighter, type: FighterState) {
    f.state = type;
    f.stateFrame = 0;
    f.hitThisAttack = false;
    f.cancelUsed = false;

    // Special move cinematics
    if (type === "special_2" || type === "special_3") {
      const dur = type === "special_3" ? 0.8 : 0.5;
      this.startCinematicCamera("special_zoom", dur);
      if (type === "special_3") {
        this.triggerScreenFlash(f.config.accentColor, 0.5, 0.2);
      }
    }

    // Callback
    if (this.isSpecialAttack(type)) {
      const level = type === "special_1" ? 1 : type === "special_2" ? 2 : 3;
      const special = this.getSpecialMove(f, level);
      if (special) {
        this.callbacks.onSpecialActivate?.(
          f === this.p1 ? 1 : 2,
          level as 1 | 2 | 3,
          special.name,
          special.type
        );
      }
    }
  }

  /** Can the current attack be cancelled into the next move? */
  private canCancelIntoNext(f: Fighter): boolean {
    if (!this.isInAttackState(f)) return false;
    const fd = this.getFrameData(f.state);
    const frame = f.stateFrame;

    // Cancel window: during active frames and early recovery
    const cancelStart = fd.startup;
    const cancelEnd = fd.startup + fd.active + fd.cancelWindow;

    if (frame >= cancelStart && frame <= cancelEnd) {
      // Gatling hierarchy: can only cancel into equal or higher strength
      return true;
    }
    return false;
  }

  /** Get frame data for an attack type */
  private getFrameData(state: FighterState): FrameData {
    switch (state) {
      case "light_1": return LIGHT_1;
      case "light_2": return LIGHT_2;
      case "light_3": return LIGHT_3;
      case "light_4": return LIGHT_4;
      case "medium": return MEDIUM;
      case "heavy_release": return HEAVY_RELEASE;
      case "special_1": return SP1_DATA;
      case "special_2": return SP2_DATA;
      case "special_3": return SP3_DATA;
      default: return LIGHT_1; // fallback
    }
  }

  /** Get the hitstop frames for an attack type */
  private getHitstopFrames(state: FighterState): number {
    if (this.isLightAttack(state)) return HITSTOP_LIGHT;
    if (state === "medium") return HITSTOP_MEDIUM;
    if (state === "heavy_release") return HITSTOP_HEAVY;
    if (this.isSpecialAttack(state)) return HITSTOP_SPECIAL;
    return HITSTOP_LIGHT;
  }

  private getSpecialMove(f: Fighter, level: number): SpecialMove | undefined {
    const specials = f === this.p1 ? this.p1Specials : this.p2Specials;
    return specials[`sp${level}` as keyof CharacterSpecials] as SpecialMove | undefined;
  }

  /* ═══ HIT DETECTION — Frame-precise ═══ */
  private checkHits() {
    this.checkHitPair(this.p1, this.p2);
    this.checkHitPair(this.p2, this.p1);
  }

  private checkHitPair(attacker: Fighter, defender: Fighter) {
    if (!this.isInAttackState(attacker)) return;
    if (attacker.hitThisAttack) return;

    const fd = this.getFrameData(attacker.state);
    const frame = attacker.stateFrame;

    // Only check during active frames
    if (frame < fd.startup || frame >= fd.startup + fd.active) return;

    // Range check
    const dist = Math.abs(attacker.x - defender.x);
    if (dist > fd.range) return;

    // Invincibility check
    if (defender.invincibleFrames > 0) return;
    if (defender.dexActive) {
      const pid: 1 | 2 = defender === this.p1 ? 1 : 2;
      this.callbacks.onDex?.(pid);
      return;
    }

    attacker.hitThisAttack = true;

    // Determine if blocked
    const isBlocking = defender.state === "block_stand" || defender.state === "block_crouch" || defender.state === "blockstun";
    const isParrying = defender.isParrying && defender.parryFrames > 0;

    if (isParrying) {
      this.resolveParry(attacker, defender);
    } else if (isBlocking) {
      this.resolveBlock(attacker, defender);
    } else {
      this.resolveHit(attacker, defender);
    }
  }

  /** Resolve a successful parry */
  private resolveParry(attacker: Fighter, defender: Fighter) {
    const atkId: 1 | 2 = attacker === this.p1 ? 1 : 2;
    const defId: 1 | 2 = defender === this.p1 ? 1 : 2;

    // Attacker gets stunned
    attacker.state = "parry_stun";
    attacker.stateFrame = 0;
    attacker.stunFrames = PARRY_STUN_FRAMES;

    // Defender recovers instantly
    defender.state = "idle";
    defender.stateFrame = 0;
    defender.isParrying = false;

    // Effects
    this.hitStop = { active: true, frames: 12, remaining: 12 };
    this.spawnHitEffect(
      (attacker.x + defender.x) / 2, 1.2, 0,
      "parry", "#00ffff"
    );
    this.triggerScreenFlash("#00ffff", 0.3, 0.1);
    this.screenShake = { intensity: 0.04, duration: 0.1, timer: 0 };

    this.callbacks.onParry?.(defId);
    this.callbacks.onHit?.(atkId, "parried");
  }

  /** Resolve a blocked hit */
  private resolveBlock(attacker: Fighter, defender: Fighter) {
    const fd = this.getFrameData(attacker.state);
    const atkId: 1 | 2 = attacker === this.p1 ? 1 : 2;

    // Blockstun
    defender.state = "blockstun";
    defender.stateFrame = 0;
    defender.stunFrames = fd.blockstun;

    // Chip damage (specials only)
    if (this.isSpecialAttack(attacker.state)) {
      const chip = Math.round(fd.damage * CHIP_DAMAGE_RATIO);
      defender.hp = Math.max(1, defender.hp - chip); // chip can't kill
    }

    // Pushback (more on block than on hit)
    const pushDir = defender.x > attacker.x ? 1 : -1;
    defender.pushVx = pushDir * fd.pushbackBlock * 8;
    attacker.pushVx = -pushDir * fd.pushbackBlock * 3; // attacker pushed back slightly too

    // Meter gain for attacker (reduced on block)
    attacker.specialMeter = Math.min(METER_MAX, attacker.specialMeter + Math.floor(fd.meterGain * 0.5));
    // Defender gains meter when blocking (comeback mechanic)
    defender.specialMeter = Math.min(METER_MAX, defender.specialMeter + METER_PER_HIT_TAKEN);

    // Hitstop (less on block)
    this.hitStop = { active: true, frames: HITSTOP_BLOCK, remaining: HITSTOP_BLOCK };

    // Effects
    this.spawnHitEffect(
      (attacker.x + defender.x) / 2, 1.0, 0,
      "block", "#4488ff"
    );
    this.screenShake = { intensity: 0.02, duration: 0.08, timer: 0 };

    this.callbacks.onHit?.(atkId, "blocked");
  }

  /** Resolve a clean hit */
  private resolveHit(attacker: Fighter, defender: Fighter) {
    const fd = this.getFrameData(attacker.state);
    const atkId: 1 | 2 = attacker === this.p1 ? 1 : 2;
    const defId: 1 | 2 = defender === this.p1 ? 1 : 2;

    // ── Damage calculation ──
    let damage = fd.damage;

    // Heavy charge scaling
    if (attacker.state === "heavy_release") {
      const chargeRatio = Math.min(attacker.heavyChargeFrames / HEAVY_MAX_CHARGE_FRAMES, 1);
      damage = HEAVY_RELEASE.damage + (HEAVY_MAX_DAMAGE - HEAVY_RELEASE.damage) * chargeRatio;
    }

    // Character stat scaling
    const atkMult = 1 + (attacker.data.attack - 50) / 200;
    damage *= atkMult;

    // Defense scaling
    const defMult = 1 - (defender.data.defense - 50) / 300;
    damage *= Math.max(0.5, defMult);

    // Defense debuff
    if (defender.defenseDebuffPct > 0) {
      damage *= (1 + defender.defenseDebuffPct);
    }

    // Parry bonus (if attacker was in parry stun recently)
    if (attacker.state !== "parry_stun" && defender.stunFrames > 0 && defender.state === "parry_stun") {
      damage *= PARRY_BONUS_DAMAGE;
    }

    // Intercept bonus
    const isIntercept = this.isInAttackState(defender) && defender.stateFrame <= INTERCEPT_WINDOW_FRAMES;
    if (isIntercept) {
      damage *= INTERCEPT_BONUS;
      this.callbacks.onIntercept?.(atkId);
    }

    // Combo scaling
    const comboHit = attacker.comboCount;
    const scaling = Math.max(COMBO_SCALING_MIN, Math.pow(COMBO_SCALING, comboHit));
    damage = Math.round(damage * scaling);
    damage = Math.max(1, damage);

    // Apply damage
    defender.hp = Math.max(0, defender.hp - damage);

    // ── Hitstun ──
    let hitstun = fd.hitstun;

    // Juggle hitstun decay
    if (defender.airborne) {
      const juggleDecay = Math.pow(JUGGLE_HITSTUN_DECAY, MAX_JUGGLE_POINTS - defender.jugglePoints);
      hitstun = Math.round(hitstun * juggleDecay);
    }

    // ── Hit reaction ──
    if (fd.launchHeight > 0 && !defender.airborne && defender.jugglePoints >= fd.jugglePoints) {
      // Launch!
      defender.state = "launched";
      defender.stateFrame = 0;
      defender.vy = fd.launchHeight;
      defender.airborne = true;
      defender.jugglePoints -= fd.jugglePoints;
      defender.stunFrames = hitstun + 20; // extra stun while airborne
    } else if (defender.airborne && defender.jugglePoints >= fd.jugglePoints) {
      // Juggle hit
      defender.vy = Math.max(defender.vy, 3); // pop up slightly
      defender.jugglePoints -= fd.jugglePoints;
      defender.stunFrames = hitstun;
    } else {
      // Ground hit
      defender.state = "hitstun";
      defender.stateFrame = 0;
      defender.stunFrames = hitstun;
    }

    // ── Pushback ──
    const pushDir = defender.x > attacker.x ? 1 : -1;
    defender.pushVx = pushDir * fd.pushbackHit * 8;

    // ── Combo tracking ──
    attacker.comboCount++;
    attacker.comboDamage += damage;
    attacker.comboTimer = 0;
    if (attacker.comboCount > 1) {
      this.callbacks.onCombo?.(atkId, attacker.comboCount, attacker.comboDamage);
    }

    // ── Meter gain ──
    attacker.specialMeter = Math.min(METER_MAX, attacker.specialMeter + fd.meterGain);
    defender.specialMeter = Math.min(METER_MAX, defender.specialMeter + METER_PER_HIT_TAKEN);

    // Check meter thresholds
    for (const threshold of [100, 200, 300]) {
      if (attacker.specialMeter >= threshold) {
        this.callbacks.onSpecialReady?.(atkId, threshold / 100);
      }
    }

    // ── Hitstop — THE key to impact feel ──
    const hitstopFrames = this.getHitstopFrames(attacker.state);
    this.hitStop = { active: true, frames: hitstopFrames, remaining: hitstopFrames };

    // ── Visual effects ──
    const hitX = (attacker.x + defender.x) / 2;
    const hitY = defender.airborne ? Math.max(defender.y, 0.5) : 1.0;

    // Determine effect type based on attack strength
    if (this.isSpecialAttack(attacker.state)) {
      this.spawnHitEffect(hitX, hitY, 0, "special", attacker.config.accentColor);
      this.spawnHitEffect(hitX, hitY, 0, "energy_wave", attacker.config.accentColor);
      this.screenShake = { intensity: 0.12, duration: 0.3, timer: 0 };
      this.triggerScreenFlash(attacker.config.accentColor, 0.3, 0.15);
      if (attacker.state === "special_3") {
        this.spawnImpactRing(hitX, hitY, 0, attacker.config.accentColor);
      }
    } else if (attacker.state === "heavy_release") {
      this.spawnHitEffect(hitX, hitY, 0, "heavy", "#ff8800");
      this.spawnHitEffect(hitX, hitY, 0, "blood", "#cc0000");
      this.screenShake = { intensity: 0.08, duration: 0.2, timer: 0 };
      this.triggerScreenFlash("#ffffff", 0.2, 0.08);
      // Camera zoom on heavy hits
      this.startCinematicCamera("heavy_zoom", 0.3);
    } else if (attacker.state === "medium") {
      this.spawnHitEffect(hitX, hitY, 0, "spark", "#ffaa00");
      this.spawnHitEffect(hitX, hitY, 0, "blood", "#cc0000");
      this.screenShake = { intensity: 0.05, duration: 0.12, timer: 0 };
    } else {
      // Light hits
      this.spawnHitEffect(hitX, hitY, 0, "spark", "#ffffff");
      this.screenShake = { intensity: 0.02, duration: 0.06, timer: 0 };
    }

    // Blood on all hits
    if (damage > 5) {
      this.spawnHitEffect(hitX, hitY + 0.2, 0, "blood", "#cc0000");
    }

    // Callback
    const hitType = this.isSpecialAttack(attacker.state) ? "special" :
                    attacker.state === "heavy_release" ? "heavy" :
                    attacker.state === "medium" ? "medium" : "light";
    this.callbacks.onHit?.(atkId, hitType);

    // Apply special move effects
    if (this.isSpecialAttack(attacker.state)) {
      this.applySpecialEffects(attacker, defender);
    }
  }

  /** Apply character-specific special move effects */
  private applySpecialEffects(attacker: Fighter, defender: Fighter) {
    const level = attacker.state === "special_1" ? 1 : attacker.state === "special_2" ? 2 : 3;
    const special = this.getSpecialMove(attacker, level);
    if (!special) return;

    const atkId: 1 | 2 = attacker === this.p1 ? 1 : 2;

    // Apply effects based on special move type
    // SpecialMoveType = "projectile" | "rush" | "area" | "grab" | "counter" | "buff" | "drain"
    switch (special.type) {
      case "projectile":
        this.spawnEnergyProjectile(attacker, special.color || attacker.config.accentColor, 10);
        break;
      case "rush":
        // Rush forward with extra damage (already in base calc)
        attacker.pushVx = (attacker.facingRight ? 1 : -1) * 12;
        break;
      case "area":
        // AOE — spawn extra effects
        this.spawnHitEffect(defender.x, 0.5, 0, "energy_wave", special.color || attacker.config.accentColor);
        this.spawnHitEffect(defender.x, 0.1, 0, "ground_crack", "#ff4444");
        break;
      case "grab":
        // Grab — extra stun
        defender.stunFrames = Math.max(defender.stunFrames, 90);
        break;
      case "counter":
        // Counter — parry bonus
        attacker.isParrying = true;
        attacker.parryFrames = 20;
        break;
      case "buff":
        attacker.speedBuffTimer = 5;
        attacker.speedBuffMult = 1.3;
        break;
      case "drain": {
        const drainAmt = Math.round(special.damage * 0.3);
        attacker.hp = Math.min(attacker.maxHp, attacker.hp + drainAmt);
        this.callbacks.onHeal?.(atkId, drainAmt);
        break;
      }
    }

    // Apply optional special effects from the SpecialMove definition
    if (special.dot && special.dot > 0) {
      defender.dotTimer = 3;
      defender.dotDamagePerTick = Math.round(special.dot);
      defender.dotTickInterval = 0.5;
      defender.dotTickTimer = 0.5;
    }
    if (special.defenseDebuff && special.defenseDebuff > 0) {
      defender.defenseDebuffTimer = 4;
      defender.defenseDebuffPct = special.defenseDebuff / 100;
    }
    if (special.speedBuff && special.speedBuff > 0) {
      attacker.speedBuffTimer = 5;
      attacker.speedBuffMult = special.speedBuff;
    }
    if (special.heal && special.heal > 0) {
      const healAmt = Math.round(special.damage * special.heal / 100);
      attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmt);
      this.callbacks.onHeal?.(atkId, healAmt);
    }
    if (special.stun && special.stun > 0) {
      defender.stunFrames = Math.max(defender.stunFrames, Math.round(special.stun * 60));
    }
  }

  /* ═══ UTILITY CHECKS ═══ */
  private isLightAttack(state: FighterState): boolean {
    return state === "light_1" || state === "light_2" || state === "light_3" || state === "light_4";
  }

  private isSpecialAttack(state: FighterState): boolean {
    return state === "special_1" || state === "special_2" || state === "special_3";
  }

  private isInAttackState(f: Fighter): boolean {
    return this.isLightAttack(f.state) || f.state === "medium" ||
           f.state === "heavy_release" || this.isSpecialAttack(f.state);
  }

  private isInActionState(f: Fighter): boolean {
    return this.isInAttackState(f) || f.state === "dash_fwd" || f.state === "dash_back" ||
           f.state === "heavy_charge" || f.state === "hitstun" || f.state === "blockstun" ||
           f.state === "knockdown" || f.state === "getup" || f.state === "launched" ||
           f.state === "parry_stun" || f.state === "finish_stun" || f.state === "ko";
  }


  /* ═══ AI SYSTEM — Reacts to animations, not inputs ═══ */
  private updateAI(ai: Fighter, player: Fighter) {
    if (this.phase !== "fighting") return;
    if (ai.state === "ko" || ai.state === "victory") return;
    if (ai.state === "hitstun" || ai.state === "knockdown" || ai.state === "getup" ||
        ai.state === "parry_stun" || ai.state === "finish_stun" || ai.state === "launched") return;

    // Reaction delay — AI only acts on what it "saw" N frames ago
    ai.aiReactTimer++;
    if (ai.aiReactTimer < ai.aiReactDelay) {
      // During reaction delay, AI continues current action but doesn't make new decisions
      this.continueAIAction(ai, player);
      return;
    }

    // AI "sees" the player's state (with reaction delay already elapsed)
    ai.aiLastSeenState = player.state;
    ai.aiReactTimer = 0;

    // Track player patterns
    if (this.isInAttackState(player) && player.stateFrame === 1) {
      ai.aiPatternMemory.push(player.state);
      if (ai.aiPatternMemory.length > 10) ai.aiPatternMemory.shift();
    }

    // Whiff punishment window
    if (this.isInAttackState(player) && !player.hitThisAttack) {
      const fd = this.getFrameData(player.state);
      if (player.stateFrame >= fd.startup + fd.active) {
        ai.aiWhiffPunishWindow = fd.recovery;
      }
    }

    // Aggression buildup (increases when getting hit)
    if (ai.state === "blockstun") ai.aiAggression = Math.min(100, ai.aiAggression + 2);
    ai.aiAggression = Math.max(0, ai.aiAggression - 0.1);

    // Mistake timer — occasionally leave an opening
    ai.aiMistakeTimer--;
    if (ai.aiMistakeTimer <= 0) {
      const mistakeChance = this.difficulty === "recruit" ? 0.15 :
                            this.difficulty === "soldier" ? 0.08 :
                            this.difficulty === "veteran" ? 0.03 : 0.01;
      if (Math.random() < mistakeChance) {
        ai.aiMistakeTimer = 60 + Math.floor(Math.random() * 60); // idle for 1-2 seconds
        ai.aiDecision = "idle";
        return;
      }
      ai.aiMistakeTimer = 30;
    }

    const dist = Math.abs(ai.x - player.x);
    const aiHealthRatio = ai.hp / ai.maxHp;
    const playerHealthRatio = player.hp / player.maxHp;
    const isPlayerAttacking = this.isInAttackState(player);
    const isPlayerRecovering = isPlayerAttacking && player.stateFrame >= this.getFrameData(player.state).startup + this.getFrameData(player.state).active;
    const isPlayerClose = dist < 1.5;
    const isPlayerMidRange = dist >= 1.5 && dist < 3.0;

    // Choose AI style based on situation
    let style = ai.aiStyle;
    if (aiHealthRatio < 0.3 && playerHealthRatio > 0.5) style = "evasive";
    else if (aiHealthRatio > 0.7 && playerHealthRatio < 0.4) style = "aggressive";
    else if (ai.aiAggression > 60) style = "aggressive";

    // ── DECISION MAKING ──
    switch (style) {
      case "aggressive":
        this.aiDecideAggressive(ai, player, dist, isPlayerAttacking, isPlayerRecovering, isPlayerClose, isPlayerMidRange);
        break;
      case "defensive":
        this.aiDecideDefensive(ai, player, dist, isPlayerAttacking, isPlayerRecovering, isPlayerClose);
        break;
      case "evasive":
        this.aiDecideEvasive(ai, player, dist, isPlayerAttacking, isPlayerClose);
        break;
      default:
        this.aiDecideBalanced(ai, player, dist, isPlayerAttacking, isPlayerRecovering, isPlayerClose, isPlayerMidRange, aiHealthRatio, playerHealthRatio);
        break;
    }

    this.executeAIDecision(ai, player);
  }

  // aiAggressive decision logic
  private aiDecideAggressive(ai: Fighter, player: Fighter, dist: number,
    isPlayerAttacking: boolean, isPlayerRecovering: boolean,
    isPlayerClose: boolean, isPlayerMidRange: boolean) {

    // Whiff punish — rush in when player misses
    if (isPlayerRecovering && dist < 3.0) {
      ai.aiDecision = isPlayerClose ? "light_combo" : "dash_fwd_attack";
      return;
    }

    // Close range — pressure with combos
    if (isPlayerClose) {
      if (isPlayerAttacking && Math.random() < 0.4) {
        ai.aiDecision = "parry"; // try to parry
      } else {
        const r = Math.random();
        if (r < 0.5) ai.aiDecision = "light_combo";
        else if (r < 0.7) ai.aiDecision = "medium_attack";
        else if (r < 0.85) ai.aiDecision = "heavy_attack";
        else ai.aiDecision = ai.specialMeter >= METER_SP1_COST ? "special_attack" : "light_combo";
      }
      return;
    }

    // Mid range — close distance
    if (isPlayerMidRange) {
      if (Math.random() < 0.6) ai.aiDecision = "dash_fwd";
      else ai.aiDecision = "walk_fwd";
      return;
    }

    // Far range — approach
    ai.aiDecision = Math.random() < 0.7 ? "dash_fwd" : "walk_fwd";
  }

  // aiDefensive decision logic
  private aiDecideDefensive(ai: Fighter, player: Fighter, dist: number,
    isPlayerAttacking: boolean, isPlayerRecovering: boolean, isPlayerClose: boolean) {

    // Whiff punish
    if (isPlayerRecovering && isPlayerClose) {
      ai.aiDecision = "medium_attack";
      return;
    }

    // Block incoming attacks
    if (isPlayerAttacking && isPlayerClose) {
      ai.aiDecision = Math.random() < 0.6 ? "parry" : "block";
      return;
    }

    // Keep distance
    if (isPlayerClose) {
      if (ai.dashCooldownFrames <= 0 && Math.random() < 0.5) {
        ai.aiDecision = "dash_back";
      } else {
        ai.aiDecision = "walk_back";
      }
      return;
    }

    // Counter-attack when safe
    if (dist < 2.5 && !isPlayerAttacking && Math.random() < 0.3) {
      ai.aiDecision = "medium_attack";
      return;
    }

    ai.aiDecision = "idle";
  }

  // aiEvasive decision logic
  private aiDecideEvasive(ai: Fighter, player: Fighter, dist: number,
    isPlayerAttacking: boolean, isPlayerClose: boolean) {

    // Always try to evade when close
    if (isPlayerClose && isPlayerAttacking) {
      if (ai.dashCooldownFrames <= 0) {
        ai.aiDecision = "dash_back";
      } else {
        ai.aiDecision = "block";
      }
      return;
    }

    if (isPlayerClose) {
      ai.aiDecision = ai.dashCooldownFrames <= 0 ? "dash_back" : "walk_back";
      return;
    }

    // Only attack when very safe
    if (dist > 3.0 && ai.specialMeter >= METER_SP1_COST && Math.random() < 0.2) {
      ai.aiDecision = "special_attack";
      return;
    }

    ai.aiDecision = "idle";
  }

  // aiBalanced decision logic
  private aiDecideBalanced(ai: Fighter, player: Fighter, dist: number,
    isPlayerAttacking: boolean, isPlayerRecovering: boolean,
    isPlayerClose: boolean, isPlayerMidRange: boolean,
    aiHealthRatio: number, playerHealthRatio: number) {

    // Whiff punish (balanced AI is good at this)
    if (isPlayerRecovering && dist < 2.5) {
      ai.aiDecision = isPlayerClose ? "light_combo" : "dash_fwd_attack";
      return;
    }

    // React to attacks
    if (isPlayerAttacking && isPlayerClose) {
      const r = Math.random();
      if (r < 0.35) ai.aiDecision = "parry";
      else if (r < 0.6) ai.aiDecision = "block";
      else if (ai.dashCooldownFrames <= 0) ai.aiDecision = "dash_back";
      else ai.aiDecision = "block";
      return;
    }

    // Footsies — spacing game at mid range
    if (isPlayerMidRange) {
      const r = Math.random();
      if (r < 0.25) ai.aiDecision = "walk_fwd";
      else if (r < 0.45) ai.aiDecision = "medium_attack"; // poke
      else if (r < 0.6) ai.aiDecision = "walk_back"; // bait
      else if (r < 0.75 && ai.dashCooldownFrames <= 0) ai.aiDecision = "dash_fwd";
      else ai.aiDecision = "idle"; // wait and watch
      return;
    }

    // Close range — mix it up
    if (isPlayerClose) {
      const r = Math.random();
      if (r < 0.35) ai.aiDecision = "light_combo";
      else if (r < 0.55) ai.aiDecision = "medium_attack";
      else if (r < 0.7 && ai.specialMeter >= METER_SP1_COST) ai.aiDecision = "special_attack";
      else if (r < 0.85) ai.aiDecision = "heavy_attack";
      else ai.aiDecision = ai.dashCooldownFrames <= 0 ? "dash_back" : "block";
      return;
    }

    // Far range — approach or wait
    if (Math.random() < 0.5) ai.aiDecision = "dash_fwd";
    else ai.aiDecision = "walk_fwd";
  }

  /** Execute the AI's current decision */
  private executeAIDecision(ai: Fighter, player: Fighter) {
    const isIdle = ai.state === "idle" || ai.state === "walk_fwd" || ai.state === "walk_back";
    const canCancel = this.isInAttackState(ai) && this.canCancelIntoNext(ai) && !ai.cancelUsed;
    const canAct = isIdle || canCancel;

    switch (ai.aiDecision) {
      case "idle":
        if (isIdle) { ai.state = "idle"; ai.stateFrame = 0; ai.vx = 0; }
        break;

      case "walk_fwd":
        if (isIdle) { ai.state = "walk_fwd"; if (ai.stateFrame === 0) ai.stateFrame = 1; }
        break;

      case "walk_back":
        if (isIdle) { ai.state = "walk_back"; if (ai.stateFrame === 0) ai.stateFrame = 1; }
        break;

      case "dash_fwd":
        if (isIdle && ai.dashCooldownFrames <= 0) this.doDashForward(ai);
        break;

      case "dash_back":
        if (isIdle && ai.dashCooldownFrames <= 0) this.doDashBack(ai);
        break;

      case "dash_fwd_attack":
        if (isIdle && ai.dashCooldownFrames <= 0) {
          this.doDashForward(ai);
          // Buffer a light attack for when dash ends
          ai.aiComboStep = 1;
        }
        break;

      case "light_combo":
        if (canAct) {
          if (canCancel) ai.cancelUsed = true;
          this.doLightAttack(ai);
          ai.aiComboStep++;
          // Chain into medium after 2-3 lights
          if (ai.aiComboStep >= 2 + Math.floor(Math.random() * 2)) {
            ai.aiDecision = "medium_attack";
            ai.aiComboStep = 0;
          }
        }
        break;

      case "medium_attack":
        if (canAct) {
          if (canCancel) ai.cancelUsed = true;
          this.startAttack(ai, "medium");
          ai.aiComboStep = 0;
          // Sometimes cancel medium into special
          if (ai.specialMeter >= METER_SP1_COST && Math.random() < 0.3) {
            ai.aiDecision = "special_attack";
          }
        }
        break;

      case "heavy_attack":
        if (canAct) {
          ai.heavyChargeFrames = HEAVY_MIN_CHARGE_FRAMES + Math.floor(Math.random() * 20);
          this.startAttack(ai, "heavy_release");
        }
        break;

      case "special_attack":
        if (canAct) {
          if (canCancel) ai.cancelUsed = true;
          this.doSpecialAttack(ai);
        }
        break;

      case "block":
        if (isIdle) {
          ai.state = "block_stand";
          ai.stateFrame = 0;
          ai.blockFrame = this.gameFrame;
          ai.isParrying = false; // AI block doesn't auto-parry (too strong)
        }
        break;

      case "parry":
        if (isIdle) {
          ai.state = "block_stand";
          ai.stateFrame = 0;
          ai.blockFrame = this.gameFrame;
          ai.isParrying = true;
          ai.parryFrames = PARRY_WINDOW_FRAMES;
        }
        break;
    }
  }

  /** Continue current AI action (during reaction delay) */
  private continueAIAction(ai: Fighter, player: Fighter) {
    // If AI is in a combo, continue it
    if (ai.aiDecision === "light_combo" && this.isInAttackState(ai) && this.canCancelIntoNext(ai)) {
      ai.cancelUsed = true;
      this.doLightAttack(ai);
      ai.aiComboStep++;
    }

    // If AI was dashing and arrived, attack
    if (ai.aiDecision === "dash_fwd_attack" && ai.state === "idle" && ai.aiComboStep > 0) {
      this.doLightAttack(ai);
      ai.aiDecision = "light_combo";
    }

    // Release block if player isn't attacking
    if ((ai.state === "block_stand" || ai.state === "block_crouch") && !this.isInAttackState(player)) {
      if (ai.stateFrame > 30) { // hold block for at least 30 frames
        ai.state = "idle";
        ai.stateFrame = 0;
      }
    }
  }


  /* ═══ COLLISION & STAGE ═══ */
  private resolveFighterCollision() {
    const dist = Math.abs(this.p1.x - this.p2.x);
    if (dist < MIN_DISTANCE) {
      const overlap = MIN_DISTANCE - dist;
      const pushDir = this.p1.x < this.p2.x ? -1 : 1;
      this.p1.x += pushDir * overlap * 0.5;
      this.p2.x -= pushDir * overlap * 0.5;
    }
  }

  private clampToStage(f: Fighter) {
    f.x = Math.max(-STAGE_HALF + FIGHTER_WIDTH / 2, Math.min(STAGE_HALF - FIGHTER_WIDTH / 2, f.x));
  }

  private updateFacing() {
    if (this.p1.state !== "dash_fwd" && this.p1.state !== "dash_back" &&
        this.p2.state !== "dash_fwd" && this.p2.state !== "dash_back") {
      this.p1.facingRight = this.p1.x < this.p2.x;
      this.p2.facingRight = this.p2.x < this.p1.x;
    }
  }

  private smoothHpDisplay(f: Fighter) {
    const diff = f.displayHp - f.hp;
    if (Math.abs(diff) > 0.5) {
      f.displayHp -= diff * 0.12;
    } else {
      f.displayHp = f.hp;
    }
  }

  /* ═══ ROUND MANAGEMENT ═══ */
  private endRound(winner: 1 | 2) {
    const w = winner === 1 ? this.p1 : this.p2;
    const l = winner === 1 ? this.p2 : this.p1;
    w.roundWins++;
    w.state = "victory";
    w.stateFrame = 0;
    if (l.hp <= 0) { l.state = "ko"; l.stateFrame = 0; }

    this.phase = "round_end";
    this.phaseTimer = 0;
    this.callbacks.onPhaseChange?.("round_end");
    this.callbacks.onRoundEnd?.(winner, this.p1.roundWins, this.p2.roundWins);
  }

  private checkMatchEnd(): boolean {
    if (this.p1.roundWins >= WINS_NEEDED) {
      this.phase = "match_end";
      this.callbacks.onPhaseChange?.("match_end");
      this.callbacks.onMatchEnd?.(1);
      return true;
    }
    if (this.p2.roundWins >= WINS_NEEDED) {
      this.phase = "match_end";
      this.callbacks.onPhaseChange?.("match_end");
      this.callbacks.onMatchEnd?.(2);
      return true;
    }
    return false;
  }

  private resetRound() {
    this.currentRound++;
    this.roundTimer = ROUND_TIME;
    this.phaseTimer = 0;
    this.finishHimTriggered = false;

    // Reset fighters
    for (const f of [this.p1, this.p2]) {
      const startX = f === this.p1 ? -2.5 : 2.5;
      f.x = startX; f.y = 0; f.vx = 0; f.vy = 0;
      f.state = "idle"; f.stateFrame = 0;
      f.hp = f.maxHp; f.displayHp = f.maxHp;
      f.comboCount = 0; f.comboDamage = 0; f.comboTimer = 0; f.comboChain = 0;
      f.jugglePoints = MAX_JUGGLE_POINTS; f.airborne = false;
      f.specialMeter = 0;
      f.blockFrame = 0; f.isParrying = false; f.parryFrames = 0;
      f.invincibleFrames = 0;
      f.dexActive = false; f.dexFrames = 0;
      f.heavyChargeFrames = 0;
      f.stunFrames = 0; f.dashCooldownFrames = 0;
      f.hitThisAttack = false; f.cancelUsed = false;
      f.pushVx = 0;
      f.dotTimer = 0; f.speedBuffTimer = 0; f.speedBuffMult = 1;
      f.defenseDebuffTimer = 0; f.defenseDebuffPct = 0;
      f.aiComboStep = 0; f.aiAggression = 0;
    }

    // Clear effects
    this.hitEffects.forEach(e => this.scene.remove(e.particles));
    this.hitEffects = [];
    this.afterimages.forEach(a => this.scene.remove(a.mesh));
    this.afterimages = [];
    this.energyProjectiles.forEach(p => this.scene.remove(p.mesh));
    this.energyProjectiles = [];

    this.phase = "round_announce";
    this.callbacks.onPhaseChange?.("round_announce");
  }

  /* ═══ PROJECTILE SYSTEM ═══ */
  private updateProjectilesFrame() {
    for (let i = this.energyProjectiles.length - 1; i >= 0; i--) {
      const proj = this.energyProjectiles[i];
      proj.x += proj.vx * FRAME_DURATION;
      proj.mesh.position.set(proj.x, proj.y, proj.z);
      proj.life -= FRAME_DURATION;

      // Check hit
      const target = proj.owner === 1 ? this.p2 : this.p1;
      if (Math.abs(proj.x - target.x) < 1.0 && target.invincibleFrames <= 0 && !target.dexActive) {
        // Hit!
        const isBlocking = target.state === "block_stand" || target.state === "block_crouch";
        if (isBlocking) {
          target.state = "blockstun";
          target.stateFrame = 0;
          target.stunFrames = 15;
          const chip = Math.round(proj.damage * CHIP_DAMAGE_RATIO);
          target.hp = Math.max(1, target.hp - chip);
          this.spawnHitEffect(proj.x, 1.0, 0, "block", "#4488ff");
        } else {
          target.hp = Math.max(0, target.hp - proj.damage);
          target.state = "hitstun";
          target.stateFrame = 0;
          target.stunFrames = 20;
          this.spawnHitEffect(proj.x, 1.0, 0, "special", proj.color);
          this.screenShake = { intensity: 0.06, duration: 0.15, timer: 0 };
        }
        this.scene.remove(proj.mesh);
        this.energyProjectiles.splice(i, 1);
        continue;
      }

      // Off screen
      if (Math.abs(proj.x) > STAGE_HALF + 2 || proj.life <= 0) {
        this.scene.remove(proj.mesh);
        this.energyProjectiles.splice(i, 1);
      }
    }
  }

  /* ═══ VISUAL EFFECTS — FLOATING PARTICLES ═══ */
  private spawnHitEffect(x: number, y: number, z: number, type: HitEffect["type"], color: string) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    this.scene.add(group);

    const col = new THREE.Color(color);
    const count = type === "spark" ? 8 : type === "heavy" ? 14 : type === "special" ? 18 :
                  type === "block" ? 6 : type === "parry" ? 12 : type === "blood" ? 10 :
                  type === "dust" ? 12 : type === "sweat" ? 6 : type === "ground_crack" ? 8 :
                  type === "energy_wave" ? 16 : type === "impact_ring" ? 1 : type === "critical" ? 20 : 8;

    for (let i = 0; i < count; i++) {
      let geo: THREE.BufferGeometry;
      let mat: THREE.Material;

      if (type === "blood") {
        // Blood droplets — small spheres with gravity
        geo = new THREE.SphereGeometry(0.02 + Math.random() * 0.03, 4, 4);
        mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.9 });
      } else if (type === "dust") {
        // Dust clouds — larger, softer particles
        geo = new THREE.SphereGeometry(0.05 + Math.random() * 0.08, 6, 6);
        mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.4 });
      } else if (type === "sweat") {
        geo = new THREE.SphereGeometry(0.015 + Math.random() * 0.02, 4, 4);
        mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.7 });
      } else if (type === "impact_ring") {
        geo = new THREE.RingGeometry(0.1, 0.15, 24);
        mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
      } else if (type === "energy_wave") {
        geo = new THREE.PlaneGeometry(0.08, 0.3);
        mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.7 });
      } else if (type === "ground_crack") {
        geo = new THREE.PlaneGeometry(0.03, 0.15 + Math.random() * 0.2);
        mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.6 });
      } else {
        // Standard spark particles
        const size = type === "heavy" || type === "critical" ? 0.04 + Math.random() * 0.05 :
                     type === "special" ? 0.03 + Math.random() * 0.06 :
                     type === "parry" ? 0.03 + Math.random() * 0.04 :
                     0.02 + Math.random() * 0.03;
        geo = new THREE.BoxGeometry(size, size, size);
        mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.9 });
      }

      const mesh = new THREE.Mesh(geo, mat);

      // Initial velocity based on type
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      let speed: number;

      if (type === "blood") {
        speed = 2 + Math.random() * 4;
        mesh.userData.vx = Math.cos(angle) * speed;
        mesh.userData.vy = Math.sin(angle) * speed * 0.5 + Math.random() * 3;
        mesh.userData.vz = (Math.random() - 0.5) * 2;
        mesh.userData.gravity = -12;
      } else if (type === "dust") {
        speed = 1 + Math.random() * 2;
        mesh.userData.vx = Math.cos(angle) * speed;
        mesh.userData.vy = Math.random() * 1.5;
        mesh.userData.vz = (Math.random() - 0.5) * 1;
        mesh.userData.gravity = -0.5;
        mesh.userData.expansion = 1 + Math.random() * 2;
      } else if (type === "sweat") {
        mesh.userData.vx = (Math.random() - 0.5) * 1.5;
        mesh.userData.vy = 1 + Math.random() * 2;
        mesh.userData.vz = (Math.random() - 0.5) * 0.5;
        mesh.userData.gravity = -6;
      } else if (type === "ground_crack") {
        speed = 0.5 + Math.random() * 1;
        mesh.userData.vx = Math.cos(angle) * speed;
        mesh.userData.vy = 0;
        mesh.userData.vz = Math.sin(angle) * speed * 0.3;
        mesh.userData.gravity = 0;
        mesh.rotation.z = angle;
      } else if (type === "energy_wave") {
        speed = 3 + Math.random() * 5;
        mesh.userData.vx = Math.cos(angle) * speed;
        mesh.userData.vy = Math.sin(angle) * speed;
        mesh.userData.vz = (Math.random() - 0.5) * 2;
        mesh.userData.gravity = 0;
      } else if (type === "impact_ring") {
        mesh.userData.vx = 0;
        mesh.userData.vy = 0;
        mesh.userData.vz = 0;
        mesh.userData.gravity = 0;
        mesh.userData.expansion = 8;
      } else {
        // Standard sparks
        speed = type === "heavy" || type === "critical" ? 4 + Math.random() * 6 :
                type === "special" ? 3 + Math.random() * 5 :
                type === "parry" ? 5 + Math.random() * 4 :
                2 + Math.random() * 4;
        mesh.userData.vx = Math.cos(angle) * speed;
        mesh.userData.vy = Math.sin(angle) * speed * 0.6 + Math.random() * 2;
        mesh.userData.vz = (Math.random() - 0.5) * 2;
        mesh.userData.gravity = -8;
      }

      group.add(mesh);
    }

    const life = type === "dust" ? 0.8 : type === "blood" ? 0.6 : type === "impact_ring" ? 0.4 :
                 type === "ground_crack" ? 1.2 : type === "sweat" ? 0.5 : 0.35;

    this.hitEffects.push({ x, y, z, life, maxLife: life, type, color, particles: group });

    // Cap maximum active effects to prevent performance degradation
    const MAX_EFFECTS = 40;
    while (this.hitEffects.length > MAX_EFFECTS) {
      const oldest = this.hitEffects.shift()!;
      this.scene.remove(oldest.particles);
      oldest.particles.children.forEach(c => {
        const m = c as THREE.Mesh;
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
    }
  }

  /** Update all particle effects */
  private updateEffects(dt: number) {
    for (let i = this.hitEffects.length - 1; i >= 0; i--) {
      const effect = this.hitEffects[i];
      effect.life -= dt;

      if (effect.life <= 0) {
        this.scene.remove(effect.particles);
        this.hitEffects.splice(i, 1);
        continue;
      }

      const progress = 1 - effect.life / effect.maxLife;

      effect.particles.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const vx = mesh.userData.vx || 0;
        const vy = mesh.userData.vy || 0;
        const vz = mesh.userData.vz || 0;
        const gravity = mesh.userData.gravity || 0;
        const expansion = mesh.userData.expansion || 0;

        // Update velocity with gravity
        mesh.userData.vy = vy + gravity * dt;

        // Update position
        mesh.position.x += vx * dt;
        mesh.position.y += mesh.userData.vy * dt;
        mesh.position.z += vz * dt;

        // Floor collision for blood
        if (effect.type === "blood" && mesh.position.y + effect.y < 0.02) {
          mesh.position.y = 0.02 - effect.y;
          mesh.userData.vy = 0;
          mesh.userData.vx *= 0.3;
          mesh.userData.vz *= 0.3;
        }

        // Expansion for dust and impact rings
        if (expansion > 0) {
          const scale = 1 + expansion * progress;
          mesh.scale.setScalar(scale);
        }

        // Fade out
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (effect.type === "dust") {
          mat.opacity = 0.4 * (1 - progress * progress);
        } else if (effect.type === "impact_ring") {
          mat.opacity = 0.8 * (1 - progress);
        } else {
          mat.opacity = Math.max(0, 1 - progress * 1.5);
        }

        // Velocity damping
        mesh.userData.vx *= (1 - dt * 3);
        mesh.userData.vz *= (1 - dt * 3);
      });
    }
  }

  /* ═══ SCREEN EFFECTS ═══ */
  private triggerScreenFlash(color: string, intensity: number = 0.6, duration: number = 0.15) {
    this.screenFlash = {
      active: true,
      color: new THREE.Color(color),
      intensity,
      timer: 0,
      duration,
    };
  }

  private updateScreenFlash(dt: number) {
    if (!this.screenFlash.active) return;
    this.screenFlash.timer += dt;
    const progress = this.screenFlash.timer / this.screenFlash.duration;

    if (progress >= 1) {
      this.screenFlash.active = false;
      (this.screenFlashMesh.material as THREE.MeshBasicMaterial).opacity = 0;
      return;
    }

    const mat = this.screenFlashMesh.material as THREE.MeshBasicMaterial;
    mat.color.copy(this.screenFlash.color);
    // Sharp flash then quick fade
    const opacity = this.screenFlash.intensity * Math.pow(1 - progress, 2);
    mat.opacity = opacity;
  }

  private updateScreenShake(dt: number) {
    if (this.screenShake.duration <= 0) {
      this.cameraShakeOffset.set(0, 0, 0);
      return;
    }
    this.screenShake.timer += dt;
    if (this.screenShake.timer >= this.screenShake.duration) {
      this.screenShake.duration = 0;
      this.cameraShakeOffset.set(0, 0, 0);
      return;
    }
    const decay = 1 - this.screenShake.timer / this.screenShake.duration;
    const intensity = this.screenShake.intensity * decay;
    this.cameraShakeOffset.set(
      (Math.random() - 0.5) * intensity * 2,
      (Math.random() - 0.5) * intensity * 2,
      (Math.random() - 0.5) * intensity
    );
  }

  /* ═══ AFTERIMAGE SYSTEM ═══ */
  private spawnAfterimage(f: Fighter) {
    if (!f.model.sprite) return;
    const spriteMat = f.model.sprite.material as THREE.SpriteMaterial;
    if (!spriteMat.map) return;

    const geo = new THREE.PlaneGeometry(
      f.model.sprite.scale.x,
      f.model.sprite.scale.y
    );
    const mat = new THREE.MeshBasicMaterial({
      map: spriteMat.map,
      transparent: true,
      opacity: 0.4,
      color: new THREE.Color(f.config.accentColor),
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(f.model.group.position);
    mesh.position.y += f.model.sprite.scale.y / 2;
    this.scene.add(mesh);

    this.afterimages.push({ mesh, life: 0.2, maxLife: 0.2 });
  }

  private updateAfterimages(dt: number) {
    for (let i = this.afterimages.length - 1; i >= 0; i--) {
      const ai = this.afterimages[i];
      ai.life -= dt;
      if (ai.life <= 0) {
        this.scene.remove(ai.mesh);
        this.afterimages.splice(i, 1);
        continue;
      }
      const mat = ai.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 * (ai.life / ai.maxLife);
    }
  }

  /* ═══ ENERGY PROJECTILE SPAWNING ═══ */
  private spawnEnergyProjectile(f: Fighter, color: string, speed: number = 8) {
    const group = new THREE.Group();
    const col = new THREE.Color(color);

    // Core sphere
    const coreGeo = new THREE.SphereGeometry(0.15, 12, 12);
    const coreMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.9 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Glow ring
    const ringGeo = new THREE.RingGeometry(0.2, 0.3, 16);
    const ringMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    group.add(ring);

    const startX = f.x + (f.facingRight ? 0.8 : -0.8);
    group.position.set(startX, 1.2, 0);
    this.scene.add(group);

    const owner: 1 | 2 = f === this.p1 ? 1 : 2;
    this.energyProjectiles.push({
      mesh: group,
      x: startX, y: 1.2, z: 0,
      vx: (f.facingRight ? 1 : -1) * speed,
      owner,
      damage: 12,
      life: 2,
      color,
    });
  }

  /* ═══ IMPACT RING / CRATER ═══ */
  private spawnImpactRing(x: number, y: number, z: number, color: string) {
    const group = new THREE.Group();
    const col = new THREE.Color(color);

    const ringGeo = new THREE.RingGeometry(0.1, 0.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    group.add(ring);

    group.position.set(x, y, z);
    this.scene.add(group);

    this.impactCraters.push({ mesh: group, life: 0.5, maxLife: 0.5 });
  }

  private spawnGroundCrater(x: number, color: string) {
    this.spawnHitEffect(x, 0.05, 0, "ground_crack", color);
  }

  private updateImpactCraters(dt: number) {
    for (let i = this.impactCraters.length - 1; i >= 0; i--) {
      const crater = this.impactCraters[i];
      crater.life -= dt;
      if (crater.life <= 0) {
        this.scene.remove(crater.mesh);
        this.impactCraters.splice(i, 1);
        continue;
      }
      const progress = 1 - crater.life / crater.maxLife;
      // Expand ring
      const scale = 1 + progress * 8;
      crater.mesh.scale.setScalar(scale);
      crater.mesh.children.forEach(child => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.8 * (1 - progress);
      });
    }
  }

  /* ═══ CINEMATIC CAMERA ═══ */
  private startCinematicCamera(type: CinematicCamera["type"], duration: number) {
    this.cinematicCamera = {
      active: true, type, timer: 0, duration,
      startPos: this.camera.position.clone(),
      endPos: this.camera.position.clone(),
      startLookAt: this.cameraTarget.clone(),
      endLookAt: this.cameraTarget.clone(),
    };

    const midX = (this.p1.x + this.p2.x) / 2;

    switch (type) {
      case "intro_sweep":
        this.cinematicCamera.startPos.set(-4, 3, 8);
        this.cinematicCamera.endPos.set(0, 2.2, 7);
        this.cinematicCamera.startLookAt.set(-2, 1, 0);
        this.cinematicCamera.endLookAt.set(midX, 1, 0);
        break;
      case "ko_zoom":
        this.cinematicCamera.endPos.set(midX, 1.8, 4);
        this.cinematicCamera.endLookAt.set(midX, 0.8, 0);
        break;
      case "special_zoom":
        this.cinematicCamera.endPos.set(midX, 2, 5);
        this.cinematicCamera.endLookAt.set(midX, 1.2, 0);
        break;
      case "heavy_zoom":
        this.cinematicCamera.endPos.set(midX, 2, 5.5);
        this.cinematicCamera.endLookAt.set(midX, 1, 0);
        break;
    }
  }

  private updateCinematicCamera(dt: number) {
    if (!this.cinematicCamera.active) return;
    this.cinematicCamera.timer += dt;
    const t = Math.min(1, this.cinematicCamera.timer / this.cinematicCamera.duration);

    // Smooth easing
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    this.camera.position.lerpVectors(this.cinematicCamera.startPos, this.cinematicCamera.endPos, ease);
    const lookAt = new THREE.Vector3().lerpVectors(this.cinematicCamera.startLookAt, this.cinematicCamera.endLookAt, ease);
    this.camera.lookAt(lookAt);

    if (t >= 1) {
      this.cinematicCamera.active = false;
    }
  }


  /* ═══ VISUAL UPDATE — Runs every render frame (not fixed timestep) ═══ */
  private updateVisuals(dt: number) {
    this.animFrame++;

    // Update sprite animations
    this.animateSprite(this.p1);
    this.animateSprite(this.p2);

    // Update model positions
    this.p1.model.group.position.set(this.p1.x, this.p1.y, 0);
    this.p2.model.group.position.set(this.p2.x, this.p2.y, 0);

    // Update facing (flip sprites)
    this.p1.model.group.scale.x = this.p1.facingRight ? 1 : -1;
    this.p2.model.group.scale.x = this.p2.facingRight ? 1 : -1;

    // Update spotlight positions
    if (this.stageLights.length >= 2) {
      this.stageLights[0].position.set(this.p1.x, 4, 2);
      this.stageLights[1].position.set(this.p2.x, 4, 2);
    }

    // Update effects
    this.updateEffects(dt);
    this.updateAfterimages(dt);
    this.updateImpactCraters(dt);
    this.updateScreenFlash(dt);
    this.updateScreenShake(dt);

    // Camera
    this.updateCamera(dt);
  }

  /* ═══ SPRITE ANIMATION — Pose-based with frame timing ═══ */
  private animateSprite(f: Fighter) {
    if (!f.model.sprite) return;

    // Helper: get the ShaderMaterial for rotation/color manipulation
    const shaderMat = f.model.spriteMaterial;
    // Store base scale on first call
    if (!(f.model as any)._baseScaleX) {
      (f.model as any)._baseScaleX = f.model.sprite.scale.x;
      (f.model as any)._baseScaleY = f.model.sprite.scale.y;
    }
    const baseScaleX: number = (f.model as any)._baseScaleX;
    const baseScaleY: number = (f.model as any)._baseScaleY;

    // Determine target pose based on state
    let targetPose: string;
    const state = f.state;

    switch (state) {
      case "idle":
        // Breathing animation — subtle scale oscillation
        targetPose = "idle";
        const breathe = Math.sin(this.animFrame * 0.05) * 0.01;
        f.model.sprite.scale.y = baseScaleY + breathe;
        break;

      case "walk_fwd":
      case "walk_back":
        // Bob animation
        targetPose = "idle";
        const bob = Math.sin(this.animFrame * 0.15) * 0.02;
        f.model.sprite.position.y = bob;
        break;

      case "dash_fwd":
      case "dash_back":
        targetPose = "attack";
        // Lean in dash direction
        const lean = state === "dash_fwd" ? 0.1 : -0.1;
        f.model.sprite.rotation.z = f.facingRight ? lean : -lean;
        break;

      case "jump":
      case "jump_fwd":
      case "jump_back":
        targetPose = f.vy > 0 ? "attack" : "idle";
        break;

      case "light_1":
      case "light_2":
      case "light_3":
      case "light_4":
      case "medium":
      case "heavy_release":
        targetPose = "attack";
        // Attack animation: scale punch on active frames
        const fd = this.getFrameData(state);
        if (f.stateFrame >= fd.startup && f.stateFrame < fd.startup + fd.active) {
          // Active frames — extend
          const extend = 1.05 + (state === "heavy_release" ? 0.08 : state === "medium" ? 0.05 : 0.02);
          f.model.sprite.scale.x = baseScaleX * extend;
        } else if (f.stateFrame < fd.startup) {
          // Startup — wind up (slight compress)
          f.model.sprite.scale.x = baseScaleX * 0.95;
        } else {
          // Recovery — return to normal
          f.model.sprite.scale.x = baseScaleX;
        }
        break;

      case "heavy_charge":
        targetPose = "idle";
        // Charge glow effect — pulsing scale
        const chargeRatio = Math.min(f.heavyChargeFrames / HEAVY_MAX_CHARGE_FRAMES, 1);
        const pulse = 1 + Math.sin(this.animFrame * 0.2) * 0.03 * chargeRatio;
        f.model.sprite.scale.setScalar(pulse);
        // Charge glow via shader uniform
        if (shaderMat.uniforms?.uSpecialGlow) {
          shaderMat.uniforms.uSpecialGlow.value = chargeRatio * 0.8;
        }
        break;

      case "special_1":
      case "special_2":
      case "special_3":
        targetPose = "attack";
        // Special move glow via shader
        if (shaderMat.uniforms?.uSpecialGlow) {
          shaderMat.uniforms.uSpecialGlow.value = 0.5 + Math.sin(this.animFrame * 0.3) * 0.3;
        }
        // Spawn afterimages during specials
        if (f.stateFrame % 4 === 0) this.spawnAfterimage(f);
        break;

      case "block_stand":
      case "block_crouch":
        targetPose = "block";
        // Slight compress when blocking
        f.model.sprite.scale.x = baseScaleX * 0.92;
        if (state === "block_crouch") {
          f.model.sprite.position.y = -0.15;
        }
        break;

      case "blockstun":
        targetPose = "block";
        // Shake on blockstun
        const blockShake = Math.sin(f.stateFrame * 1.5) * 0.03;
        f.model.sprite.position.x = blockShake;
        break;

      case "hitstun":
        targetPose = "hit";
        // Recoil animation
        const recoil = Math.sin(f.stateFrame * 0.8) * 0.04 * Math.max(0, 1 - f.stateFrame / 20);
        f.model.sprite.position.x = recoil;
        // Flash white on first few frames
        if (f.stateFrame < 4 && shaderMat.uniforms?.uHitFlash) {
          shaderMat.uniforms.uHitFlash.value = 1.0 - (f.stateFrame / 4);
        }
        break;

      case "launched":
        targetPose = "hit";
        // Spin while launched
        f.model.sprite.rotation.z = (f.stateFrame * 0.15) * (f.facingRight ? -1 : 1);
        break;

      case "knockdown":
        targetPose = "ko";
        f.model.sprite.rotation.z = Math.PI / 2 * (f.facingRight ? -1 : 1) * 0.7;
        break;

      case "getup":
        targetPose = "idle";
        // Gradually return rotation to 0
        const getupProgress = f.stateFrame / GETUP_FRAMES;
        f.model.sprite.rotation.z *= (1 - getupProgress);
        // Flash during invuln
        if (f.invincibleFrames > 0 && f.stateFrame % 4 < 2) {
          if (shaderMat.uniforms?.uOpacity) shaderMat.uniforms.uOpacity.value = 0.5;
        } else {
          if (shaderMat.uniforms?.uOpacity) shaderMat.uniforms.uOpacity.value = 1;
        }
        break;

      case "parry_stun":
        targetPose = "hit";
        // Stunned — wobble
        const wobble = Math.sin(f.stateFrame * 0.2) * 0.05;
        f.model.sprite.position.x = wobble;
        // Stars effect (flash)
        if (f.stateFrame % 20 < 10 && shaderMat.uniforms?.uHitFlash) {
          shaderMat.uniforms.uHitFlash.value = 0.3;
        }
        break;

      case "finish_stun":
        targetPose = "hit";
        // Wobble + flash
        const fWobble = Math.sin(f.stateFrame * 0.15) * 0.06;
        f.model.sprite.position.x = fWobble;
        if (f.stateFrame % 30 < 15 && shaderMat.uniforms?.uHitFlash) {
          shaderMat.uniforms.uHitFlash.value = 0.5;
        }
        break;

      case "ko":
        targetPose = "ko";
        // Fall animation
        const fallProgress = Math.min(f.stateFrame / 30, 1);
        f.model.sprite.rotation.z = (Math.PI / 2) * fallProgress * (f.facingRight ? -1 : 1);
        // Desaturate via opacity fade
        if (shaderMat.uniforms?.uOpacity) {
          shaderMat.uniforms.uOpacity.value = 1 - fallProgress * 0.3;
        }
        break;

      case "victory":
        targetPose = "victory";
        // Subtle victory pose animation
        const victoryBounce = Math.sin(this.animFrame * 0.08) * 0.02;
        f.model.sprite.position.y = victoryBounce;
        break;

      default:
        targetPose = "idle";
    }

    // Apply pose texture swap using poseTextures map
    if (f.model.currentPose !== targetPose && f.model.poseTextures[targetPose]) {
      const tex = f.model.poseTextures[targetPose];
      // The shader uses 'uTexture' uniform, not 'map'
      if (shaderMat.uniforms?.uTexture) {
        shaderMat.uniforms.uTexture.value = tex;
        shaderMat.needsUpdate = true;
      }
      // Also update the glow sprite texture
      if (f.model.glowMaterial?.uniforms?.uTexture) {
        f.model.glowMaterial.uniforms.uTexture.value = tex;
        f.model.glowMaterial.needsUpdate = true;
      }
      f.model.currentPose = targetPose;
    }

    // Reset sprite transforms that shouldn't persist
    if (state !== "dash_fwd" && state !== "dash_back" && state !== "launched" &&
        state !== "knockdown" && state !== "ko") {
      f.model.sprite.rotation.z = 0;
    }
    if (state !== "blockstun" && state !== "hitstun" && state !== "parry_stun" &&
        state !== "finish_stun" && state !== "walk_fwd" && state !== "walk_back") {
      f.model.sprite.position.x = 0;
    }
    if (state !== "block_crouch" && state !== "walk_fwd" && state !== "walk_back" && state !== "victory") {
      f.model.sprite.position.y = 0;
    }

    // Reset shader effects for states that don't use them
    if (state !== "hitstun" && state !== "parry_stun" && state !== "finish_stun" &&
        state !== "ko" && state !== "heavy_charge" && state !== "special_1" &&
        state !== "special_2" && state !== "special_3" && state !== "getup") {
      if (shaderMat.uniforms?.uHitFlash) shaderMat.uniforms.uHitFlash.value = 0;
      if (shaderMat.uniforms?.uSpecialGlow) shaderMat.uniforms.uSpecialGlow.value = 0;
      if (shaderMat.uniforms?.uBlockTint) shaderMat.uniforms.uBlockTint.value = 0;
      if (shaderMat.uniforms?.uOpacity) shaderMat.uniforms.uOpacity.value = 1;
    }

    // Block tint for blocking states
    if (state === "block_stand" || state === "block_crouch" || state === "blockstun") {
      if (shaderMat.uniforms?.uBlockTint) shaderMat.uniforms.uBlockTint.value = 0.4;
    }

    // Update time uniform for shader animations
    if (shaderMat.uniforms?.uTime) {
      shaderMat.uniforms.uTime.value = this.animFrame * FRAME_DURATION;
    }
  }

  /* ═══ CAMERA ═══ */
  private updateCamera(dt: number) {
    if (this.cinematicCamera.active) {
      this.updateCinematicCamera(dt);
      return;
    }

    // Dynamic camera — tracks fighters
    const midX = (this.p1.x + this.p2.x) / 2;
    const dist = Math.abs(this.p1.x - this.p2.x);

    // Camera pulls back as fighters separate
    const targetZ = 6 + Math.max(0, dist - 3) * 0.8;
    const targetX = midX * 0.5; // Don't follow 1:1, slight lag
    const targetY = 2.0 + Math.max(this.p1.y, this.p2.y) * 0.3;

    // Smooth camera movement
    this.cameraTarget.x += (targetX - this.cameraTarget.x) * 0.08;
    this.cameraTarget.y += (targetY - this.cameraTarget.y) * 0.08;

    this.camera.position.x += (targetX - this.camera.position.x) * 0.06;
    this.camera.position.y += (targetY + 0.2 - this.camera.position.y) * 0.06;
    this.camera.position.z += (targetZ - this.camera.position.z) * 0.04;

    // Apply shake
    this.camera.position.add(this.cameraShakeOffset);

    this.camera.lookAt(this.cameraTarget.x, this.cameraTarget.y - 0.2, 0);
  }

  /* ═══ RENDER ═══ */
  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  /* ═══ PUBLIC API — getState() ═══ */
  public getState() {
    return {
      phase: this.phase,
      round: this.currentRound,
      timer: Math.ceil(this.roundTimer),
      p1: this.getFighterState(this.p1),
      p2: this.getFighterState(this.p2),
    };
  }

  private getFighterState(f: Fighter) {
    return {
      name: f.data.name,
      hp: f.hp,
      maxHp: f.maxHp,
      displayHp: f.displayHp,
      specialMeter: f.specialMeter,
      roundWins: f.roundWins,
      state: f.state,
      comboCount: f.comboCount,
      comboDamage: f.comboDamage,
      comboChain: f.comboChain,
      stunTimer: f.stunFrames * FRAME_DURATION, // convert to seconds for UI compat
      isParrying: f.isParrying,
      dexActive: f.dexActive,
      heavyCharging: f.state === "heavy_charge",
      heavyChargeRatio: Math.min(f.heavyChargeFrames / HEAVY_MAX_CHARGE_FRAMES, 1),
      color: f.config.accentColor,
      image: f.data.image,
      specials: f.specials,
      dotActive: f.dotTimer > 0,
      speedBuffActive: f.speedBuffTimer > 0,
      defenseDebuffActive: f.defenseDebuffTimer > 0,
    };
  }

  /* ═══ PUBLIC CONTROLS ═══ */
  public pause() { this.paused = true; }
  public resume() { this.paused = false; this.clock.getDelta(); }

  public handleResize() {
    const parent = this.renderer.domElement.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  /* ═══ DISPOSE ═══ */
  public dispose() {
    this.disposed = true;

    // Remove event listeners
    // (In production, store refs and remove properly)

    // Clean up Three.js
    this.hitEffects.forEach(e => this.scene.remove(e.particles));
    this.afterimages.forEach(a => this.scene.remove(a.mesh));
    this.energyProjectiles.forEach(p => this.scene.remove(p.mesh));
    this.impactCraters.forEach(c => this.scene.remove(c.mesh));

    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          obj.material?.dispose();
        }
      }
    });

    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

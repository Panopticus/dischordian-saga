/* ═══════════════════════════════════════════════════════
   FIGHT ENGINE 3D — MCOC-Style Mobile Fighting Engine
   Split-screen tap/swipe controls inspired by
   Marvel Contest of Champions.
   Left side = defense (block, dash), Right side = offense (attacks)
   ═══════════════════════════════════════════════════════ */
import * as THREE from "three";
import { buildCharacterModel, getCharacterConfig, type CharacterModel, type CharacterConfig } from "./CharacterModel3D";
import type { FighterData } from "./gameData";
import { getCharacterSpecials, type CharacterSpecials, type SpecialMove } from "./specialMoves";

/* ═══ TYPES ═══ */
export type FightPhase = "intro" | "round_announce" | "fighting" | "ko" | "round_end" | "match_end";
export type FighterState = "idle" | "walk_fwd" | "walk_back" | "dash_fwd" | "dash_back" |
  "jump" | "crouch" |
  "light_1" | "light_2" | "light_3" | "light_4" | "medium" | "heavy_charge" | "heavy_release" |
  "special_1" | "special_2" | "special_3" |
  "block_stand" | "block_crouch" |
  "hitstun" | "blockstun" | "parry_stun" | "knockdown" | "getup" | "launched" |
  "victory" | "ko";
export type AIStyle = "aggressive" | "defensive" | "evasive" | "balanced";
export type Difficulty = "recruit" | "soldier" | "veteran" | "archon";

interface HitEffect {
  x: number; y: number; z: number;
  life: number; maxLife: number;
  type: "spark" | "heavy" | "block" | "special" | "parry" | "critical";
  color: string;
  particles: THREE.Group;
}

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
  stateTimer: number;
  hp: number;
  maxHp: number;
  displayHp: number;
  // Combo system
  comboCount: number;      // hits in current combo
  comboDamage: number;     // total damage in current combo
  comboTimer: number;      // time since last hit (combo drops if > threshold)
  comboChain: number;      // position in MLLLM chain (0-4)
  maxComboHits: number;    // best combo this round
  // Special meter (0-300, L1=100, L2=200, L3=300)
  specialMeter: number;
  // Block / parry
  blockTimer: number;
  blockStartTime: number;  // when block was initiated (for parry window)
  isParrying: boolean;
  parryWindow: number;     // remaining parry window time
  // Invincibility
  invincible: number;
  // Dexterity (evade)
  dexActive: boolean;
  dexTimer: number;
  // Heavy charge
  heavyChargeTime: number;
  // Round wins
  roundWins: number;
  // AI fields
  aiStyle: AIStyle;
  aiTimer: number;
  aiDecision: string;
  aiComboStep: number;
  aiReactTimer: number;
  aiPressureTimer: number;
  aiDodgeCooldown: number;
  aiAggression: number;     // builds when getting hit, decays over time
  aiMistakeTimer: number;   // chance to make a "mistake" (opening for player)
  aiPatternMemory: string[]; // last N player actions for pattern reading
  // Stun
  stunTimer: number;
  // Dash
  dashCooldown: number;
  // Hit tracking
  hitThisAttack: boolean;
  // Character-specific specials
  specials: CharacterSpecials;
  // DOT (damage over time)
  dotTimer: number;
  dotDamagePerTick: number;
  dotTickInterval: number;
  dotTickTimer: number;
  // Temporary buffs/debuffs
  speedBuffTimer: number;
  speedBuffMult: number;
  defenseDebuffTimer: number;
  defenseDebuffPct: number;
  // Auto-spacing
  idleTimer: number;           // time spent in idle (for auto-space delay)
  autoSpaceTarget: number;     // current target spacing distance
}

/* ═══ CONSTANTS ═══ */
const STAGE_WIDTH = 12;
const GROUND_Y = 0;
const GRAVITY = -28;
const JUMP_FORCE = 10;
const WALK_SPEED = 3.5;
const BACK_SPEED = 2.5;
const DASH_FWD_SPEED = 12;
const DASH_BACK_SPEED = 10;
const DASH_DURATION = 0.18;
const DASH_COOLDOWN = 0.25;
const PUSH_FORCE = 2.5;

// Auto-spacing (MCOC-style: fighters drift to optimal range when neutral)
const AUTO_SPACE_TARGET = 2.8;       // optimal distance between fighters
const AUTO_SPACE_SPEED = 1.8;        // drift speed toward optimal range
const AUTO_SPACE_DEADZONE = 0.3;     // don't drift if within this tolerance
const AUTO_SPACE_DELAY = 0.4;        // wait this long after action before auto-spacing
const POST_KNOCKDOWN_SPACE = 3.5;    // extra space after knockdown recovery
const POST_COMBO_SPACE = 2.5;        // space after combo drops

// Frame data (in seconds for 60fps feel)
const FRAME = 1 / 60;

// Light attacks chain: L1 → L2 → L3 → L4 (faster each hit)
const LIGHT_1_STARTUP = 3 * FRAME;
const LIGHT_1_ACTIVE = 2 * FRAME;
const LIGHT_1_RECOVERY = 4 * FRAME;
const LIGHT_2_STARTUP = 2 * FRAME;
const LIGHT_2_ACTIVE = 2 * FRAME;
const LIGHT_2_RECOVERY = 3 * FRAME;
const LIGHT_3_STARTUP = 2 * FRAME;
const LIGHT_3_ACTIVE = 3 * FRAME;
const LIGHT_3_RECOVERY = 3 * FRAME;
const LIGHT_4_STARTUP = 3 * FRAME;
const LIGHT_4_ACTIVE = 3 * FRAME;
const LIGHT_4_RECOVERY = 6 * FRAME;

// Medium attack
const MEDIUM_STARTUP = 5 * FRAME;
const MEDIUM_ACTIVE = 3 * FRAME;
const MEDIUM_RECOVERY = 8 * FRAME;
const MEDIUM_LUNGE = 2.0; // distance covered

// Heavy attack
const HEAVY_MIN_CHARGE = 0.2;  // minimum charge time
const HEAVY_MAX_CHARGE = 1.0;  // full charge
const HEAVY_ACTIVE = 4 * FRAME;
const HEAVY_RECOVERY = 14 * FRAME;

// Special attacks
const SP1_STARTUP = 6 * FRAME;
const SP1_ACTIVE = 8 * FRAME;
const SP1_RECOVERY = 12 * FRAME;
const SP2_STARTUP = 10 * FRAME;
const SP2_ACTIVE = 12 * FRAME;
const SP2_RECOVERY = 16 * FRAME;
const SP3_STARTUP = 14 * FRAME;
const SP3_ACTIVE = 18 * FRAME;
const SP3_RECOVERY = 20 * FRAME;

// Stun / hitstun
const HITSTUN_LIGHT = 10 * FRAME;
const HITSTUN_MEDIUM = 14 * FRAME;
const HITSTUN_HEAVY = 20 * FRAME;
const HITSTUN_SPECIAL = 22 * FRAME;
const BLOCKSTUN = 6 * FRAME;
const PARRY_STUN_DURATION = 1.2;  // parry stuns opponent for 1.2s (MCOC-like)
const PARRY_WINDOW = 0.15;        // 150ms window to parry
const DEX_WINDOW = 0.2;           // 200ms window for dexterity evade
const KNOCKDOWN_TIME = 35 * FRAME;
const GETUP_TIME = 18 * FRAME;
const LAUNCH_HEIGHT = 6;
const LAUNCH_GRAVITY = -18;

// Damage values
const DMG_LIGHT = 4;
const DMG_MEDIUM = 8;
const DMG_HEAVY_MIN = 10;
const DMG_HEAVY_MAX = 22;
const DMG_SP1 = 18;
const DMG_SP2 = 35;
const DMG_SP3 = 55;
const CHIP_DAMAGE_RATIO = 0.12;
const COMBO_SCALING = 0.92;        // each hit does 92% of previous (gentler scaling)
const PARRY_BONUS_DAMAGE = 1.3;    // 30% bonus after parry stun
const INTERCEPT_BONUS = 1.25;      // 25% bonus for intercepting

// Hit ranges
const LIGHT_RANGE = 1.1;
const MEDIUM_RANGE = 1.8;
const HEAVY_RANGE = 1.4;
const SPECIAL_RANGE = 2.2;

// Combo system
const COMBO_DROP_TIME = 0.6;       // combo drops after 0.6s of no hits
const MAX_COMBO_HITS = 5;          // MCOC-style 5-hit max before defender can respond

// Special meter
const METER_PER_LIGHT = 8;
const METER_PER_MEDIUM = 12;
const METER_PER_HEAVY = 15;
const METER_PER_BLOCK = 4;
const METER_ON_HIT = 6;           // defender gains meter when hit

// Difficulty multipliers
const DIFFICULTY_SETTINGS: Record<Difficulty, {
  aiReactSpeed: number;
  aiAggression: number;
  dmgMult: number;
  blockRate: number;
  parryRate: number;
  dexRate: number;
  comboLength: number;
  mistakeRate: number;
  interceptRate: number;
}> = {
  recruit:  { aiReactSpeed: 0.3, aiAggression: 0.25, dmgMult: 0.65, blockRate: 0.15, parryRate: 0.05, dexRate: 0.05, comboLength: 3, mistakeRate: 0.4, interceptRate: 0.05 },
  soldier:  { aiReactSpeed: 0.55, aiAggression: 0.45, dmgMult: 0.85, blockRate: 0.35, parryRate: 0.15, dexRate: 0.15, comboLength: 4, mistakeRate: 0.25, interceptRate: 0.15 },
  veteran:  { aiReactSpeed: 0.75, aiAggression: 0.65, dmgMult: 1.0, blockRate: 0.55, parryRate: 0.3, dexRate: 0.3, comboLength: 5, mistakeRate: 0.12, interceptRate: 0.3 },
  archon:   { aiReactSpeed: 0.92, aiAggression: 0.8, dmgMult: 1.2, blockRate: 0.7, parryRate: 0.45, dexRate: 0.45, comboLength: 5, mistakeRate: 0.05, interceptRate: 0.5 },
};

/* ═══ INPUT TYPES ═══ */
export interface TouchInput {
  type: "tap" | "swipe_left" | "swipe_right" | "swipe_up" | "swipe_down" | "hold_start" | "hold_end" | "none";
  side: "left" | "right";
  timestamp: number;
}

/* ═══ CALLBACKS ═══ */
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
}

/* ═══════════════════════════════════════════════════════
   FIGHT ENGINE 3D CLASS — MCOC-Style
   ═══════════════════════════════════════════════════════ */
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
  private roundTimer = 99;
  private currentRound = 1;
  private maxRounds = 3;
  private paused = false;
  private difficulty: Difficulty;
  private callbacks: FightCallbacks;

  // Effects
  private hitEffects: HitEffect[] = [];
  private screenShake = { intensity: 0, duration: 0, timer: 0 };
  private hitStop = { active: false, duration: 0, timer: 0 };
  private slowMo = { active: false, speed: 1, duration: 0, timer: 0 };

  // Camera
  private cameraTarget = new THREE.Vector3(0, 1.0, 0);
  private cameraShakeOffset = new THREE.Vector3();

  // Input — MCOC style
  private keys: Set<string> = new Set();
  private inputQueue: TouchInput[] = [];
  private holdingBlock = false;
  private holdingHeavy = false;
  private heavyHoldStart = 0;

  // Legacy touch state (for backward compat)
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

    // ── Three.js Setup ──
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0f);
    this.scene.fog = new THREE.FogExp2(0x0a0a0f, 0.03);

    this.camera = new THREE.PerspectiveCamera(48, container.clientWidth / container.clientHeight, 0.1, 100);
    this.camera.position.set(0, 1.0, 3.2);
    this.camera.lookAt(0, 0.7, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.6;
    container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();

    // ── Stage ──
    this.buildStage();

    // ── Lighting ──
    this.buildLighting();

    // ── Fighters ──
    this.p1 = this.createFighter(p1Data, -0.8, true);
    this.p2 = this.createFighter(p2Data, 0.8, false);
    this.p1Specials = this.p1.specials;
    this.p2Specials = this.p2.specials;

    // ── Input ──
    this.setupInput();

    // ── Resize ──
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener("resize", this.handleResize);

    // ── Start ──
    this.phase = "intro";
    this.phaseTimer = 2.0;
    this.callbacks.onPhaseChange?.("intro");
  }

  /* ═══ STAGE BUILDING ═══ */
  private buildStage() {
    // ── ARENA BACKGROUND IMAGE — panoramic backdrop ──
    if (this.arenaBackgroundUrl) {
      const bgLoader = new THREE.TextureLoader();
      bgLoader.crossOrigin = "anonymous";
      bgLoader.load(this.arenaBackgroundUrl, (bgTex) => {
        bgTex.colorSpace = THREE.SRGBColorSpace;
        const bgAspect = bgTex.image.width / bgTex.image.height;
        const bgWidth = 36;
        const bgHeight = bgWidth / bgAspect;
        const bgGeo = new THREE.PlaneGeometry(bgWidth, Math.max(bgHeight, 14));
        const bgMat = new THREE.MeshBasicMaterial({
          map: bgTex, transparent: true, opacity: 0.85, depthWrite: false,
        });
        const bgMesh = new THREE.Mesh(bgGeo, bgMat);
        bgMesh.position.set(0, 5, -8);
        this.scene.add(bgMesh);

        // Mid-ground parallax layer
        const midGeo = new THREE.PlaneGeometry(bgWidth * 0.8, Math.max(bgHeight * 0.6, 8));
        const midMat = new THREE.MeshBasicMaterial({
          map: bgTex, transparent: true, opacity: 0.3, depthWrite: false,
        });
        const midMesh = new THREE.Mesh(midGeo, midMat);
        midMesh.position.set(0, 3, -6.5);
        midMesh.userData.parallaxFactor = 0.15;
        this.scene.add(midMesh);
      });

      if (this.arenaFloorColor) {
        const col = new THREE.Color(this.arenaFloorColor);
        this.scene.background = col.clone().multiplyScalar(0.3);
        this.scene.fog = new THREE.FogExp2(col.clone().multiplyScalar(0.3).getHex(), 0.025);
      }
    }

    // ── FLOOR ──
    const floorColor = this.arenaFloorColor ? new THREE.Color(this.arenaFloorColor) : new THREE.Color(0x1a1a2e);
    const floorGeo = new THREE.PlaneGeometry(24, 14, 48, 28);
    const floorMat = new THREE.MeshStandardMaterial({
      color: floorColor, roughness: 0.25, metalness: 0.75,
    });
    this.stageFloor = new THREE.Mesh(floorGeo, floorMat);
    this.stageFloor.rotation.x = -Math.PI / 2;
    this.stageFloor.receiveShadow = true;
    this.scene.add(this.stageFloor);

    // Floor grid
    const gridHelper = new THREE.GridHelper(24, 48, 0x1a3355, 0x0d1a2e);
    gridHelper.position.y = 0.01;
    this.scene.add(gridHelper);

    // FLOOR GLOW LINES — energy channels
    const channelMat = new THREE.MeshBasicMaterial({
      color: 0x00ccff, transparent: true, opacity: 0.15,
    });
    for (const x of [-3, 0, 3]) {
      const ch = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.005, 14), channelMat);
      ch.position.set(x, 0.02, 0);
      this.scene.add(ch);
    }
    for (const z of [-3, -1, 1, 3]) {
      const ch = new THREE.Mesh(new THREE.BoxGeometry(24, 0.005, 0.04), channelMat);
      ch.position.set(0, 0.02, z);
      this.scene.add(ch);
    }

    // ── SIDE DECORATIONS & barriers ──
    // Back wall
    const wallGeo = new THREE.PlaneGeometry(24, 10);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x12122a, roughness: 0.4, metalness: 0.4,
      emissive: 0x0a0a1e, emissiveIntensity: 0.8,
    });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 5, -6);
    this.scene.add(wall);

    // Wall accent panel
    const panelGeo = new THREE.PlaneGeometry(6, 4);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a3a, roughness: 0.3, metalness: 0.6,
      emissive: 0x111133, emissiveIntensity: 0.5,
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, 5, -5.95);
    this.scene.add(panel);

    // Central emblem ring
    const ringGeo = new THREE.TorusGeometry(1.2, 0.06, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, 5.2, -5.9);
    this.scene.add(ring);
    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.7, 0.04, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.4 })
    );
    innerRing.position.set(0, 5.2, -5.88);
    this.scene.add(innerRing);

    // ── PILLARS ──
    const pillarGeo = new THREE.CylinderGeometry(0.22, 0.3, 8, 12);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a4e, roughness: 0.15, metalness: 0.85,
      emissive: 0x151530, emissiveIntensity: 0.4,
    });
    const pillarPositions = [-5.5, -3, 3, 5.5];
    for (const x of pillarPositions) {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(x, 4, -5.2);
      pillar.castShadow = true;
      this.scene.add(pillar);

      const capGeo = new THREE.CylinderGeometry(0.35, 0.22, 0.3, 12);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0x4a4a7e, roughness: 0.1, metalness: 0.9,
        emissive: 0x2a2a5e, emissiveIntensity: 0.3,
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(x, 8.15, -5.2);
      this.scene.add(cap);

      const baseGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.4, 12);
      const base = new THREE.Mesh(baseGeo, capMat);
      base.position.set(x, 0.2, -5.2);
      this.scene.add(base);

      const colors = [0x4488ff, 0x00ccff, 0x6644ff];
      for (let i = 0; i < 3; i++) {
        const stripGeo = new THREE.BoxGeometry(0.04, 1.2, 0.04);
        const stripMat = new THREE.MeshBasicMaterial({
          color: colors[i % colors.length], transparent: true, opacity: 0.5 - i * 0.1,
        });
        const strip = new THREE.Mesh(stripGeo, stripMat);
        strip.position.set(x, 2 + i * 2.2, -5.0);
        this.scene.add(strip);
      }
    }

    // ── ARCHWAY ──
    const archGeo = new THREE.BoxGeometry(11, 0.25, 0.5);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a4e, roughness: 0.15, metalness: 0.85,
      emissive: 0x1a1a3e, emissiveIntensity: 0.3,
    });
    const arch = new THREE.Mesh(archGeo, archMat);
    arch.position.set(0, 8.25, -5.2);
    this.scene.add(arch);
  }

  /* ═══ LIGHTING ═══ */
  private buildLighting() {
    const ambient = new THREE.AmbientLight(
      this.arenaAmbientColor ? new THREE.Color(this.arenaAmbientColor).getHex() : 0x334466, 0.6
    );
    this.scene.add(ambient);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(2, 6, 4);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.set(1024, 1024);
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 20;
    this.scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x6666ff, 0.5);
    rimLight.position.set(-3, 3, -2);
    this.scene.add(rimLight);

    for (const x of [-3, 0, 3]) {
      const spot = new THREE.PointLight(0x6666ff, 0.8, 12);
      spot.position.set(x, 4, -2);
      this.scene.add(spot);
      this.stageLights.push(spot);
    }

    const frontFill = new THREE.PointLight(0xffffff, 0.7, 12);
    frontFill.position.set(0, 2, 3.5);
    this.scene.add(frontFill);
    const leftFill = new THREE.PointLight(0xffffff, 0.3, 8);
    leftFill.position.set(-2, 1.5, 3);
    this.scene.add(leftFill);
    const rightFill = new THREE.PointLight(0xffffff, 0.3, 8);
    rightFill.position.set(2, 1.5, 3);
    this.scene.add(rightFill);
  }

  /* ═══ FIGHTER CREATION ═══ */
  private createFighter(data: FighterData, startX: number, facingRight: boolean): Fighter {
    const model = buildCharacterModel(data.id);
    const config = getCharacterConfig(data.id);

    model.group.position.set(startX, 0, 0);
    if (!facingRight) model.group.scale.x = -1;
    model.group.castShadow = true;
    this.scene.add(model.group);

    const glowLight = new THREE.PointLight(new THREE.Color(config.glowColor).getHex(), 0.4, 3);
    glowLight.position.set(0, 1.2, 0.5);
    model.group.add(glowLight);

    return {
      data, model, config,
      x: startX, y: 0, vx: 0, vy: 0,
      facingRight,
      state: "idle", stateTimer: 0,
      hp: data.hp, maxHp: data.hp, displayHp: data.hp,
      comboCount: 0, comboDamage: 0, comboTimer: 0, comboChain: 0, maxComboHits: 0,
      specialMeter: 0,
      blockTimer: 0, blockStartTime: 0, isParrying: false, parryWindow: 0,
      invincible: 0,
      dexActive: false, dexTimer: 0,
      heavyChargeTime: 0,
      roundWins: 0,
      aiStyle: config.fightStyle,
      aiTimer: 0, aiDecision: "idle", aiComboStep: 0,
      aiReactTimer: 0, aiPressureTimer: 0, aiDodgeCooldown: 0,
      aiAggression: 0, aiMistakeTimer: 0, aiPatternMemory: [],
      stunTimer: 0,
      dashCooldown: 0,
      hitThisAttack: false,
      specials: getCharacterSpecials(data.id),
      dotTimer: 0,
      dotDamagePerTick: 0,
      dotTickInterval: 0.5,
      dotTickTimer: 0,
      speedBuffTimer: 0,
      speedBuffMult: 1,
      defenseDebuffTimer: 0,
      defenseDebuffPct: 0,
      // Auto-spacing
      idleTimer: 0,
      autoSpaceTarget: AUTO_SPACE_TARGET,
    };
  }

  /* ═══ INPUT HANDLING — MCOC STYLE ═══ */
  private setupInput() {
    const onKeyDown = (e: KeyboardEvent) => {
      this.keys.add(e.key.toLowerCase());
      e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      this.keys.delete(e.key.toLowerCase());
      e.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    (this as any)._keyDown = onKeyDown;
    (this as any)._keyUp = onKeyUp;
  }

  /** MCOC-style touch input from the React component */
  public pushTouchInput(input: TouchInput) {
    this.inputQueue.push(input);
  }

  /** Legacy touch state for backward compat */
  public setTouchState(state: Partial<typeof this.touchState>) {
    Object.assign(this.touchState, state);
  }

  /** Set block hold state (left side hold) */
  public setBlockHold(holding: boolean) {
    this.holdingBlock = holding;
    if (holding) {
      this.p1.blockStartTime = performance.now() / 1000;
      this.p1.parryWindow = PARRY_WINDOW;
      this.p1.isParrying = true;
    }
  }

  /** Set heavy charge state (right side hold) */
  public setHeavyHold(holding: boolean) {
    if (holding && !this.holdingHeavy) {
      this.holdingHeavy = true;
      this.heavyHoldStart = performance.now() / 1000;
    } else if (!holding && this.holdingHeavy) {
      this.holdingHeavy = false;
      // Release heavy attack
      if (this.phase === "fighting" && !this.isInActionState(this.p1)) {
        const chargeTime = Math.min(performance.now() / 1000 - this.heavyHoldStart, HEAVY_MAX_CHARGE);
        if (chargeTime >= HEAVY_MIN_CHARGE) {
          this.p1.heavyChargeTime = chargeTime;
          this.startAttack(this.p1, "heavy_release");
        }
      }
    }
  }

  /* ═══ MAIN GAME LOOP ═══ */
  public update() {
    if (this.disposed || this.paused) return;

    const dt = Math.min(this.clock.getDelta(), 1 / 30);
    this.animFrame++;

    // Hit stop
    if (this.hitStop.active) {
      this.hitStop.timer -= dt;
      if (this.hitStop.timer <= 0) this.hitStop.active = false;
      else {
        this.updateEffects(dt);
        this.render();
        return;
      }
    }

    // Slow motion
    const timeScale = this.slowMo.active ? this.slowMo.speed : 1;
    const gameDt = dt * timeScale;
    if (this.slowMo.active) {
      this.slowMo.timer -= dt;
      if (this.slowMo.timer <= 0) this.slowMo.active = false;
    }

    // Phase logic
    switch (this.phase) {
      case "intro":
        this.phaseTimer -= dt;
        if (this.phaseTimer <= 0) {
          this.phase = "round_announce";
          this.phaseTimer = 2.0;
          this.callbacks.onPhaseChange?.("round_announce");
        }
        break;
      case "round_announce":
        this.phaseTimer -= dt;
        if (this.phaseTimer <= 0) {
          this.phase = "fighting";
          this.callbacks.onPhaseChange?.("fighting");
        }
        break;
      case "fighting":
        this.updateFighting(gameDt);
        break;
      case "ko":
        this.phaseTimer -= dt;
        if (this.phaseTimer <= 0) {
          this.phase = "round_end";
          this.phaseTimer = 2.0;
          this.callbacks.onPhaseChange?.("round_end");
        }
        break;
      case "round_end":
        this.phaseTimer -= dt;
        if (this.phaseTimer <= 0) this.checkMatchEnd();
        break;
      case "match_end":
        break;
    }

    // Smooth HP drain
    this.p1.displayHp += (this.p1.hp - this.p1.displayHp) * 0.12;
    this.p2.displayHp += (this.p2.hp - this.p2.displayHp) * 0.12;

    this.updateEffects(dt);
    this.updateCamera(dt);
    this.animateModels(gameDt);
    this.render();
  }

  /* ═══ FIGHTING UPDATE ═══ */
  private updateFighting(dt: number) {
    this.roundTimer -= dt;
    if (this.roundTimer <= 0) {
      this.roundTimer = 0;
      this.endRound(this.p1.hp >= this.p2.hp ? 1 : 2);
      return;
    }

    // Process MCOC-style input for P1
    this.processPlayerInput(this.p1, dt);

    // AI for P2
    this.updateAI(this.p2, this.p1, dt);

    // Update both fighters
    this.updateFighter(this.p1, dt);
    this.updateFighter(this.p2, dt);

    // Collision
    this.resolveFighterCollision();
    this.clampToStage(this.p1);
    this.clampToStage(this.p2);
    this.updateFacing();

    // Auto-spacing (MCOC-style: fighters drift to optimal range when neutral)
    this.updateAutoSpacing(this.p1, this.p2, dt);
    this.updateAutoSpacing(this.p2, this.p1, dt);

    this.callbacks.onHealthChange?.(this.p1.hp, this.p1.maxHp, this.p2.hp, this.p2.maxHp);

    // Training mode
    if (this.trainingMode) {
      if (this.p2.hp < this.p2.maxHp * 0.3) {
        this.p2.hp = this.p2.maxHp;
        this.p2.displayHp = this.p2.maxHp;
      }
      if (this.p1.hp < this.p1.maxHp) {
        this.p1.hp = Math.min(this.p1.maxHp, this.p1.hp + this.p1.maxHp * 0.002);
      }
      this.roundTimer = 99;
    } else {
      if (this.p1.hp <= 0) this.endRound(2);
      if (this.p2.hp <= 0) this.endRound(1);
    }
  }

  /* ═══ PLAYER INPUT — MCOC SPLIT-SCREEN ═══ */
  private processPlayerInput(f: Fighter, dt: number) {
    // Process queued touch inputs
    while (this.inputQueue.length > 0) {
      const input = this.inputQueue.shift()!;
      this.handleTouchInput(f, input, dt);
    }

    // Handle keyboard input (desktop fallback)
    this.handleKeyboardInput(f, dt);

    // Handle continuous block hold
    if (this.holdingBlock && !this.isInAttackState(f) && f.stunTimer <= 0) {
      if (f.state !== "block_stand" && f.state !== "block_crouch" && f.state !== "blockstun" && f.state !== "parry_stun") {
        const down = this.keys.has("s") || this.keys.has("arrowdown") || this.touchState.down;
        f.state = down ? "block_crouch" : "block_stand";
        f.blockTimer = 0.1;
      }
    }

    // Handle continuous heavy charge
    if (this.holdingHeavy && !this.isInActionState(f) && f.stunTimer <= 0) {
      if (f.state !== "heavy_charge") {
        f.state = "heavy_charge";
        f.stateTimer = 0;
        f.heavyChargeTime = 0;
      } else {
        f.heavyChargeTime += dt;
      }
    }

    // Update parry window
    if (f.isParrying) {
      f.parryWindow -= dt;
      if (f.parryWindow <= 0) {
        f.isParrying = false;
      }
    }

    // Update dex
    if (f.dexActive) {
      f.dexTimer -= dt;
      if (f.dexTimer <= 0) f.dexActive = false;
    }
  }

  private handleTouchInput(f: Fighter, input: TouchInput, _dt: number) {
    if (this.isInActionState(f) && !this.canCancelIntoNext(f)) return;

    if (input.side === "right") {
      // RIGHT SIDE — Offense
      switch (input.type) {
        case "tap":
          // Light attack — chains into combo (L1 → L2 → L3 → L4)
          this.doLightAttack(f);
          break;
        case "swipe_right":
          // Medium attack — lunges forward
          this.startAttack(f, "medium");
          break;
        case "swipe_up":
          // Special attack — use highest available level
          this.doSpecialAttack(f);
          break;
        case "swipe_down":
          // Heavy attack (quick release)
          f.heavyChargeTime = HEAVY_MIN_CHARGE;
          this.startAttack(f, "heavy_release");
          break;
      }
    } else {
      // LEFT SIDE — Defense (MCOC-style: dash-only, no walk/jump from touch)
      switch (input.type) {
        case "swipe_left":
          // Dash back (dexterity if timed right)
          this.doDashBack(f);
          break;
        case "swipe_right":
          // Dash forward (close distance)
          this.doDashForward(f);
          break;
        case "tap":
          // Quick tap on left side = momentary block pulse
          // (Hold is handled separately via holdingBlock)
          if (!this.isInAttackState(f) && f.stunTimer <= 0) {
            f.state = "block_stand";
            f.blockTimer = 0.2;
            f.blockStartTime = performance.now() / 1000;
            f.parryWindow = PARRY_WINDOW;
            f.isParrying = true;
          }
          break;
      }
    }
  }

  private handleKeyboardInput(f: Fighter, dt: number) {
    if (this.isInActionState(f) && !this.canCancelIntoNext(f)) return;

    const left = this.keys.has("a") || this.keys.has("arrowleft");
    const right = this.keys.has("d") || this.keys.has("arrowright");
    const up = this.keys.has("w") || this.keys.has("arrowup");
    const down = this.keys.has("s") || this.keys.has("arrowdown");

    // Block (L/C key)
    const block = this.keys.has("l") || this.keys.has("c");
    if (block && !this.isInAttackState(f)) {
      if (!this.holdingBlock) {
        this.holdingBlock = true;
        f.blockStartTime = performance.now() / 1000;
        f.parryWindow = PARRY_WINDOW;
        f.isParrying = true;
      }
      f.state = down ? "block_crouch" : "block_stand";
      f.blockTimer = 0.1;
      return;
    } else if (!block && this.holdingBlock && !this.touchState.block) {
      this.holdingBlock = false;
    }

    // Light attack (J/Z)
    const punch = this.keys.has("j") || this.keys.has("z") || this.touchState.punch;
    if (punch) {
      this.doLightAttack(f);
      this.keys.delete("j"); this.keys.delete("z");
      this.touchState.punch = false;
      return;
    }

    // Medium attack (K/X)
    const kick = this.keys.has("k") || this.keys.has("x") || this.touchState.kick;
    if (kick) {
      this.startAttack(f, "medium");
      this.keys.delete("k"); this.keys.delete("x");
      this.touchState.kick = false;
      return;
    }

    // Special attack (Space/V)
    const special = this.keys.has(" ") || this.keys.has("v") || this.touchState.special;
    if (special) {
      this.doSpecialAttack(f);
      this.keys.delete(" "); this.keys.delete("v");
      this.touchState.special = false;
      return;
    }

    // Dash back (double-tap left or Q)
    if (this.keys.has("q")) {
      this.doDashBack(f);
      this.keys.delete("q");
      return;
    }

    // Dash forward (double-tap right or E)
    if (this.keys.has("e")) {
      this.doDashForward(f);
      this.keys.delete("e");
      return;
    }

    // Jump
    if (up && f.y <= 0.01 && !this.holdingBlock) {
      f.vy = JUMP_FORCE;
      f.state = "jump";
      if (left) f.vx = f.facingRight ? -WALK_SPEED * 0.7 : WALK_SPEED * 0.7;
      else if (right) f.vx = f.facingRight ? WALK_SPEED * 0.7 : -WALK_SPEED * 0.7;
      return;
    }

    // Crouch
    if (down && f.y <= 0 && !this.holdingBlock) {
      f.state = "crouch";
      f.vx = 0;
      return;
    }

    // Walk
    if (!this.holdingBlock && !this.holdingHeavy) {
      if (right) {
        f.vx = f.facingRight ? WALK_SPEED : -BACK_SPEED;
        f.state = f.facingRight ? "walk_fwd" : "walk_back";
      } else if (left) {
        f.vx = f.facingRight ? -BACK_SPEED : WALK_SPEED;
        f.state = f.facingRight ? "walk_back" : "walk_fwd";
      } else if (!this.isInActionState(f)) {
        f.vx = 0;
        f.state = "idle";
      }
    }
  }

  /* ═══ ATTACK ACTIONS ═══ */
  private doLightAttack(f: Fighter) {
    // Chain light attacks: L1 → L2 → L3 → L4
    if (f.comboChain === 0 || f.comboTimer <= 0) {
      this.startAttack(f, "light_1");
      f.comboChain = 1;
    } else if (f.comboChain === 1 && this.canCancelIntoNext(f)) {
      this.startAttack(f, "light_2");
      f.comboChain = 2;
    } else if (f.comboChain === 2 && this.canCancelIntoNext(f)) {
      this.startAttack(f, "light_3");
      f.comboChain = 3;
    } else if (f.comboChain === 3 && this.canCancelIntoNext(f)) {
      this.startAttack(f, "light_4");
      f.comboChain = 4;
    } else if (f.comboChain >= 4) {
      // Combo complete — can't chain more lights, must dash back or use medium/special
      f.comboChain = 0;
    }
  }

  private doSpecialAttack(f: Fighter) {
    const playerNum = f === this.p1 ? 1 : 2;
    if (f.specialMeter >= 300) {
      this.startAttack(f, "special_3");
      f.specialMeter -= 300;
      this.callbacks.onSpecialActivate?.(playerNum as 1 | 2, 3, f.specials.sp3.name, f.specials.sp3.type);
    } else if (f.specialMeter >= 200) {
      this.startAttack(f, "special_2");
      f.specialMeter -= 200;
      this.callbacks.onSpecialActivate?.(playerNum as 1 | 2, 2, f.specials.sp2.name, f.specials.sp2.type);
    } else if (f.specialMeter >= 100) {
      this.startAttack(f, "special_1");
      f.specialMeter -= 100;
      this.callbacks.onSpecialActivate?.(playerNum as 1 | 2, 1, f.specials.sp1.name, f.specials.sp1.type);
    }
  }

  private doDashBack(f: Fighter) {
    if (f.dashCooldown > 0 || f.y > 0.01) return;
    f.state = "dash_back";
    f.stateTimer = 0;
    f.vx = f.facingRight ? -DASH_BACK_SPEED : DASH_BACK_SPEED;
    f.dashCooldown = DASH_COOLDOWN;
    // Check for dexterity (evade) — if opponent is attacking and we dash at the right time
    const opponent = f === this.p1 ? this.p2 : this.p1;
    if (this.isInAttackState(opponent)) {
      f.dexActive = true;
      f.dexTimer = DEX_WINDOW;
      f.invincible = DEX_WINDOW;
      this.callbacks.onDex?.(f === this.p1 ? 1 : 2);
    }
  }

  private doDashForward(f: Fighter) {
    if (f.dashCooldown > 0 || f.y > 0.01) return;
    f.state = "dash_fwd";
    f.stateTimer = 0;
    f.vx = f.facingRight ? DASH_FWD_SPEED : -DASH_FWD_SPEED;
    f.dashCooldown = DASH_COOLDOWN;
  }

  /* ═══ ATTACK SYSTEM ═══ */
  private startAttack(f: Fighter, type: FighterState) {
    f.state = type;
    f.stateTimer = 0;
    f.hitThisAttack = false;
    // Record player action for AI pattern memory
    if (f === this.p1) {
      this.p2.aiPatternMemory.push(type);
      if (this.p2.aiPatternMemory.length > 10) this.p2.aiPatternMemory.shift();
    }
  }

  private canCancelIntoNext(f: Fighter): boolean {
    // Can cancel during recovery frames of light attacks
    if (!this.isLightAttack(f.state)) return false;
    const frameData = this.getAttackFrameData(f.state, f);
    const hitPhaseEnd = frameData.startup + frameData.active;
    return f.stateTimer >= hitPhaseEnd; // can cancel during recovery
  }

  private getAttackFrameData(type: FighterState, fighter?: Fighter): { startup: number; active: number; recovery: number } {
    switch (type) {
      case "light_1": return { startup: LIGHT_1_STARTUP, active: LIGHT_1_ACTIVE, recovery: LIGHT_1_RECOVERY };
      case "light_2": return { startup: LIGHT_2_STARTUP, active: LIGHT_2_ACTIVE, recovery: LIGHT_2_RECOVERY };
      case "light_3": return { startup: LIGHT_3_STARTUP, active: LIGHT_3_ACTIVE, recovery: LIGHT_3_RECOVERY };
      case "light_4": return { startup: LIGHT_4_STARTUP, active: LIGHT_4_ACTIVE, recovery: LIGHT_4_RECOVERY };
      case "medium": return { startup: MEDIUM_STARTUP, active: MEDIUM_ACTIVE, recovery: MEDIUM_RECOVERY };
      case "heavy_release": return { startup: 2 * FRAME, active: HEAVY_ACTIVE, recovery: HEAVY_RECOVERY };
      case "special_1": {
        const sp = fighter?.specials.sp1;
        return {
          startup: sp?.startupFrames ? sp.startupFrames * FRAME : SP1_STARTUP,
          active: sp?.activeFrames ? sp.activeFrames * FRAME : SP1_ACTIVE,
          recovery: sp?.recoveryFrames ? sp.recoveryFrames * FRAME : SP1_RECOVERY,
        };
      }
      case "special_2": {
        const sp = fighter?.specials.sp2;
        return {
          startup: sp?.startupFrames ? sp.startupFrames * FRAME : SP2_STARTUP,
          active: sp?.activeFrames ? sp.activeFrames * FRAME : SP2_ACTIVE,
          recovery: sp?.recoveryFrames ? sp.recoveryFrames * FRAME : SP2_RECOVERY,
        };
      }
      case "special_3": {
        const sp = fighter?.specials.sp3;
        return {
          startup: sp?.startupFrames ? sp.startupFrames * FRAME : SP3_STARTUP,
          active: sp?.activeFrames ? sp.activeFrames * FRAME : SP3_ACTIVE,
          recovery: sp?.recoveryFrames ? sp.recoveryFrames * FRAME : SP3_RECOVERY,
        };
      }
      default: return { startup: 0, active: 0, recovery: 0 };
    }
  }

  private getAttackDamage(type: FighterState, attacker: Fighter): number {
    const statMult = 1 + (attacker.data.attack - 7) * 0.05;
    switch (type) {
      case "light_1": case "light_2": case "light_3": return DMG_LIGHT * statMult;
      case "light_4": return DMG_LIGHT * 1.3 * statMult; // last hit in chain does more
      case "medium": return DMG_MEDIUM * statMult;
      case "heavy_release": {
        const chargeRatio = Math.min(attacker.heavyChargeTime / HEAVY_MAX_CHARGE, 1);
        return (DMG_HEAVY_MIN + (DMG_HEAVY_MAX - DMG_HEAVY_MIN) * chargeRatio) * statMult;
      }
      case "special_1": return DMG_SP1 * attacker.specials.sp1.damage * statMult;
      case "special_2": return DMG_SP2 * attacker.specials.sp2.damage * statMult;
      case "special_3": return DMG_SP3 * attacker.specials.sp3.damage * statMult;
      default: return 0;
    }
  }

  private getAttackRange(type: FighterState): number {
    switch (type) {
      case "light_1": case "light_2": case "light_3": case "light_4": return LIGHT_RANGE;
      case "medium": return MEDIUM_RANGE;
      case "heavy_release": return HEAVY_RANGE;
      case "special_1": case "special_2": case "special_3": return SPECIAL_RANGE;
      default: return 0;
    }
  }

  private getHitstun(type: FighterState): number {
    if (this.isLightAttack(type)) return HITSTUN_LIGHT;
    if (type === "medium") return HITSTUN_MEDIUM;
    if (type === "heavy_release") return HITSTUN_HEAVY;
    if (this.isSpecialAttack(type)) return HITSTUN_SPECIAL;
    return HITSTUN_LIGHT;
  }

  private isLightAttack(state: FighterState): boolean {
    return ["light_1", "light_2", "light_3", "light_4"].includes(state);
  }

  private isSpecialAttack(state: FighterState): boolean {
    return ["special_1", "special_2", "special_3"].includes(state);
  }

  private isInAttackState(f: Fighter): boolean {
    return this.isLightAttack(f.state) || f.state === "medium" ||
           f.state === "heavy_charge" || f.state === "heavy_release" ||
           this.isSpecialAttack(f.state);
  }

  private isInActionState(f: Fighter): boolean {
    return ["hitstun", "blockstun", "parry_stun", "knockdown", "getup", "ko",
            "launched", "dash_fwd", "dash_back", "victory"].includes(f.state) ||
           this.isInAttackState(f);
  }

  /* ═══ FIGHTER UPDATE ═══ */
  private updateFighter(f: Fighter, dt: number) {
    f.stateTimer += dt;
    if (f.blockTimer > 0) f.blockTimer -= dt;
    if (f.invincible > 0) f.invincible -= dt;
    if (f.dashCooldown > 0) f.dashCooldown -= dt;
    if (f.stunTimer > 0) {
      f.stunTimer -= dt;
      if (f.stunTimer <= 0 && f.state === "parry_stun") {
        f.state = "idle";
        f.vx = 0;
      }
    }

    // DOT (damage over time) processing
    if (f.dotTimer > 0) {
      f.dotTimer -= dt;
      f.dotTickTimer += dt;
      if (f.dotTickTimer >= f.dotTickInterval) {
        f.dotTickTimer -= f.dotTickInterval;
        const dotDmg = f.dotDamagePerTick;
        f.hp = Math.max(0, f.hp - dotDmg);
        const playerNum = f === this.p1 ? 2 : 1; // DOT was applied BY the other player
        this.callbacks.onDot?.(playerNum as 1 | 2, dotDmg);
        // Small visual effect for DOT tick
        this.spawnHitEffect(f.x, 1.5, 0.3, "spark", "#ff4444");
      }
      if (f.dotTimer <= 0) {
        f.dotDamagePerTick = 0;
        f.dotTickTimer = 0;
      }
    }

    // Speed buff decay
    if (f.speedBuffTimer > 0) {
      f.speedBuffTimer -= dt;
      if (f.speedBuffTimer <= 0) {
        f.speedBuffMult = 1;
      }
    }

    // Defense debuff decay
    if (f.defenseDebuffTimer > 0) {
      f.defenseDebuffTimer -= dt;
      if (f.defenseDebuffTimer <= 0) {
        f.defenseDebuffPct = 0;
      }
    }

    // Combo timer
    if (f.comboTimer > 0) {
      f.comboTimer -= dt;
      if (f.comboTimer <= 0) {
        if (f.comboCount > f.maxComboHits) f.maxComboHits = f.comboCount;
        f.comboCount = 0;
        f.comboDamage = 0;
        f.comboChain = 0;
      }
    }

    // Gravity
    if (f.y > 0.01 || f.vy > 0) {
      const grav = f.state === "launched" ? LAUNCH_GRAVITY : GRAVITY;
      f.vy += grav * dt;
      f.y += f.vy * dt;
      if (f.y <= 0) {
        f.y = 0;
        f.vy = 0;
        if (f.state === "jump") f.state = "idle";
        if (f.state === "launched") {
          f.state = "knockdown";
          f.stateTimer = 0;
        }
      }
    }

    // Movement
    f.x += f.vx * dt;

    // Dash states
    if (f.state === "dash_fwd" || f.state === "dash_back") {
      if (f.stateTimer >= DASH_DURATION) {
        f.state = "idle";
        f.vx = 0;
      }
    }

    // Heavy charge animation
    if (f.state === "heavy_charge") {
      f.vx = 0; // can't move while charging
    }

    // Attack state machine
    if (this.isInAttackState(f) && f.state !== "heavy_charge") {
      const frameData = this.getAttackFrameData(f.state, f);
      const totalTime = frameData.startup + frameData.active + frameData.recovery;

      // Medium attack lunge
      if (f.state === "medium" && f.stateTimer < frameData.startup + frameData.active) {
        const lungeDir = f.facingRight ? 1 : -1;
        f.vx = lungeDir * MEDIUM_LUNGE / (frameData.startup + frameData.active);
      }

      // Check hit during active frames
      if (f.stateTimer >= frameData.startup && f.stateTimer < frameData.startup + frameData.active) {
        if (!f.hitThisAttack) {
          const target = f === this.p1 ? this.p2 : this.p1;
          this.checkHit(f, target, f.state);
        }
      }

      // Return to idle after recovery (unless canceling)
      if (f.stateTimer >= totalTime) {
        f.state = "idle";
        f.vx = 0;
      }
    }

    // Hitstun
    if (f.state === "hitstun") {
      if (f.stateTimer >= this.getHitstun(f.state)) {
        f.state = "idle";
        f.vx = 0;
      }
    }
    if (f.state === "blockstun") {
      if (f.stateTimer >= BLOCKSTUN) {
        f.state = this.holdingBlock && f === this.p1 ? "block_stand" : "idle";
        f.vx = 0;
      }
    }
    if (f.state === "knockdown") {
      if (f.stateTimer >= KNOCKDOWN_TIME) {
        f.state = "getup";
        f.stateTimer = 0;
        f.invincible = GETUP_TIME;
      }
    }
    if (f.state === "getup") {
      if (f.stateTimer >= GETUP_TIME) f.state = "idle";
    }

    // Track idle time for auto-spacing
    if (f.state === "idle") {
      f.idleTimer += dt;
    } else {
      f.idleTimer = 0;
    }

    // Set auto-space target based on recovery context
    if (f.state === "getup" && f.stateTimer >= GETUP_TIME * 0.9) {
      f.autoSpaceTarget = POST_KNOCKDOWN_SPACE; // extra space after knockdown
    } else if (f.comboTimer <= 0 && f.comboCount === 0 && f.state === "idle") {
      // Gradually return to normal spacing
      f.autoSpaceTarget += (AUTO_SPACE_TARGET - f.autoSpaceTarget) * 0.05;
    }

    // Update 3D model
    f.model.group.position.x = f.x;
    f.model.group.position.y = f.y;
    f.model.group.scale.x = f.facingRight ? 1 : -1;
  }

  /* ═══ AUTO-SPACING — MCOC-style neutral positioning ═══ */
  private updateAutoSpacing(f: Fighter, opponent: Fighter, dt: number) {
    // Only auto-space when fighter is in a neutral state and has been idle long enough
    if (f.state !== "idle") return;
    if (f.idleTimer < AUTO_SPACE_DELAY) return;
    if (f.y > 0.01) return; // don't auto-space in air
    if (f.stunTimer > 0) return;

    // Don't auto-space if opponent is in an active state (let the player decide)
    // But DO auto-space if opponent is also idle (neutral game reset)
    const opponentNeutral = opponent.state === "idle" || opponent.state === "block_stand" || opponent.state === "block_crouch";
    if (!opponentNeutral && f === this.p1) return; // player controls their own spacing

    const dist = Math.abs(f.x - opponent.x);
    const targetDist = f.autoSpaceTarget;
    const diff = dist - targetDist;

    // Within deadzone — no drift needed
    if (Math.abs(diff) < AUTO_SPACE_DEADZONE) return;

    // Drift toward optimal range
    const driftDir = f.x < opponent.x ? -1 : 1; // away from opponent
    const driftSpeed = AUTO_SPACE_SPEED * Math.min(Math.abs(diff) / targetDist, 1);

    if (diff < -AUTO_SPACE_DEADZONE) {
      // Too close — drift apart
      f.x += driftDir * driftSpeed * dt;
    } else if (diff > AUTO_SPACE_DEADZONE) {
      // Too far — drift closer
      f.x -= driftDir * driftSpeed * dt;
    }
  }

  /* ═══ HIT DETECTION — MCOC STYLE ═══ */
  private checkHit(attacker: Fighter, defender: Fighter, attackType: FighterState) {
    if (defender.invincible > 0) return;
    if (defender.state === "knockdown" || defender.state === "getup") return;
    if (defender.dexActive) return; // Dexterity evade

    const dist = Math.abs(attacker.x - defender.x);
    const range = this.getAttackRange(attackType);
    if (dist > range) return;

    attacker.hitThisAttack = true;

    // Is defender blocking?
    const isBlocking = defender.state === "block_stand" || defender.state === "block_crouch";
    const isFacingAttacker = (defender.x < attacker.x && !defender.facingRight) ||
                              (defender.x > attacker.x && defender.facingRight);

    // Heavy attacks break blocks (guard break) — MCOC style
    const isHeavy = attackType === "heavy_release";
    const isGuardBreak = isHeavy && isBlocking;

    if (isBlocking && isFacingAttacker && !isGuardBreak) {
      // ── PARRY CHECK ──
      if (defender.isParrying && defender.parryWindow > 0) {
        // PARRY! Stun the attacker
        attacker.state = "parry_stun";
        attacker.stateTimer = 0;
        attacker.stunTimer = PARRY_STUN_DURATION;
        attacker.vx = 0;
        defender.isParrying = false;
        defender.parryWindow = 0;

        this.spawnHitEffect(
          (attacker.x + defender.x) / 2, 1.3, 0.5, "parry", "#ffdd00"
        );
        this.screenShake.intensity = 4;
        this.screenShake.duration = 0.12;
        this.screenShake.timer = 0;
        this.hitStop = { active: true, duration: 0.1, timer: 0.1 };

        this.callbacks.onParry?.(defender === this.p1 ? 1 : 2);
        this.callbacks.onHit?.(attacker === this.p1 ? 1 : 2, "parried");
        return;
      }

      // Normal block — chip damage
      const chipDmg = this.getAttackDamage(attackType, attacker) * CHIP_DAMAGE_RATIO;
      defender.hp = Math.max(1, defender.hp - chipDmg);
      defender.state = "blockstun";
      defender.stateTimer = 0;
      defender.vx = (defender.x > attacker.x ? 1 : -1) * 1.5;

      // Defender gains meter from blocking
      defender.specialMeter = Math.min(300, defender.specialMeter + METER_PER_BLOCK);

      this.spawnHitEffect(
        (attacker.x + defender.x) / 2, 1.2, 0.5, "block", "#88aaff"
      );
      this.screenShake.intensity = 2;
      this.screenShake.duration = 0.08;
      this.screenShake.timer = 0;
      this.callbacks.onHit?.(attacker === this.p1 ? 1 : 2, "blocked");
      return;
    }

    // ── GUARD BREAK ──
    if (isGuardBreak) {
      this.callbacks.onGuardBreak?.(attacker === this.p1 ? 1 : 2);
    }

    // ── HIT! ──
    let damage = this.getAttackDamage(attackType, attacker);
    const playerNum = attacker === this.p1 ? 1 : 2;

    // Combo scaling
    if (attacker.comboCount > 0) {
      damage *= Math.pow(COMBO_SCALING, attacker.comboCount);
    }

    // Parry bonus — if opponent is stunned from parry, deal bonus damage
    if (defender.stunTimer > 0 && defender.state === "parry_stun") {
      damage *= PARRY_BONUS_DAMAGE;
    }

    // Intercept bonus — if attacker hits during opponent's dash
    if (defender.state === "dash_fwd") {
      damage *= INTERCEPT_BONUS;
      this.callbacks.onIntercept?.(playerNum as 1 | 2);
    }

    // Difficulty damage multiplier (AI deals modified damage)
    if (attacker === this.p2) {
      damage *= DIFFICULTY_SETTINGS[this.difficulty].dmgMult;
    }

    // Defense reduction (including debuff from specials)
    const defDebuff = defender.defenseDebuffPct > 0 ? defender.defenseDebuffPct / 100 : 0;
    const defMult = (1 - (defender.data.defense - 5) * 0.03) * (1 + defDebuff);
    damage *= defMult;

    defender.hp = Math.max(0, defender.hp - damage);

    // Combo tracking
    attacker.comboCount++;
    attacker.comboDamage += damage;
    attacker.comboTimer = COMBO_DROP_TIME;
    if (attacker.comboCount >= 2) {
      this.callbacks.onCombo?.(playerNum as 1 | 2, attacker.comboCount, attacker.comboDamage);
    }

    // Special meter gain
    const meterGain = this.isLightAttack(attackType) ? METER_PER_LIGHT :
                      attackType === "medium" ? METER_PER_MEDIUM :
                      attackType === "heavy_release" ? METER_PER_HEAVY : 0;
    attacker.specialMeter = Math.min(300, attacker.specialMeter + meterGain);
    defender.specialMeter = Math.min(300, defender.specialMeter + METER_ON_HIT);

    // Check special meter thresholds
    if (attacker.specialMeter >= 100 && attacker.specialMeter - meterGain < 100) {
      this.callbacks.onSpecialReady?.(playerNum as 1 | 2, 1);
    }
    if (attacker.specialMeter >= 200 && attacker.specialMeter - meterGain < 200) {
      this.callbacks.onSpecialReady?.(playerNum as 1 | 2, 2);
    }
    if (attacker.specialMeter >= 300 && attacker.specialMeter - meterGain < 300) {
      this.callbacks.onSpecialReady?.(playerNum as 1 | 2, 3);
    }

    // Hitstun / knockdown / launch
    const isHeavyOrSpecial = isHeavy || this.isSpecialAttack(attackType);
    if (isHeavy && defender.y <= 0.01) {
      // Heavy launches opponent into the air
      defender.state = "launched";
      defender.stateTimer = 0;
      defender.vy = LAUNCH_HEIGHT;
      defender.vx = (defender.x > attacker.x ? 1 : -1) * 3;
    } else if (this.isSpecialAttack(attackType) && defender.y <= 0.01) {
      defender.state = "knockdown";
      defender.stateTimer = 0;
      defender.vy = 4;
      defender.vx = (defender.x > attacker.x ? 1 : -1) * 5;
    } else {
      defender.state = "hitstun";
      defender.stateTimer = 0;
      defender.vx = (defender.x > attacker.x ? 1 : -1) * (isHeavyOrSpecial ? 4 : 2);
    }

    // 5-hit combo limit — after 5 hits, defender gets a response window
    if (attacker.comboCount >= MAX_COMBO_HITS) {
      // Force a gap — attacker gets slight recovery
      attacker.comboChain = 0;
    }

    // Effects
    const hitY = 1.2 + (this.isLightAttack(attackType) ? 0.1 : attackType === "medium" ? 0 : -0.1);
    const effectType = this.isSpecialAttack(attackType) ? "special" :
                       isHeavy ? "heavy" :
                       attackType === "medium" ? "heavy" : "spark";
    this.spawnHitEffect(
      (attacker.x + defender.x) / 2, hitY, 0.5,
      effectType, attacker.config.accentColor
    );

    // Screen effects — scaled by attack power
    if (this.isSpecialAttack(attackType)) {
      this.hitStop = { active: true, duration: 0.18, timer: 0.18 };
      this.screenShake.intensity = 10;
      this.screenShake.duration = 0.35;
      this.screenShake.timer = 0;
      this.slowMo = { active: true, speed: 0.25, duration: 0.6, timer: 0.6 };
    } else if (isHeavy) {
      this.hitStop = { active: true, duration: 0.1, timer: 0.1 };
      this.screenShake.intensity = 6;
      this.screenShake.duration = 0.2;
      this.screenShake.timer = 0;
    } else if (attackType === "medium") {
      this.hitStop = { active: true, duration: 0.06, timer: 0.06 };
      this.screenShake.intensity = 3;
      this.screenShake.duration = 0.1;
      this.screenShake.timer = 0;
    } else {
      this.hitStop = { active: true, duration: 0.03, timer: 0.03 };
      this.screenShake.intensity = 1.5;
      this.screenShake.duration = 0.06;
      this.screenShake.timer = 0;
    }

    this.callbacks.onHit?.(playerNum as 1 | 2, attackType);

    // ── CHARACTER-SPECIFIC SPECIAL EFFECTS ──
    if (this.isSpecialAttack(attackType)) {
      const spLevel = attackType === "special_3" ? 3 : attackType === "special_2" ? 2 : 1;
      const sp: SpecialMove = spLevel === 3 ? attacker.specials.sp3 : spLevel === 2 ? attacker.specials.sp2 : attacker.specials.sp1;

      // DOT (damage over time)
      if (sp.dot && sp.dot > 0) {
        defender.dotTimer = 3.0; // 3 seconds of DOT
        defender.dotDamagePerTick = sp.dot;
        defender.dotTickTimer = 0;
      }

      // Heal
      if (sp.heal && sp.heal > 0) {
        const healAmount = damage * (sp.heal / 100);
        attacker.hp = Math.min(attacker.maxHp, attacker.hp + healAmount);
        this.callbacks.onHeal?.(playerNum as 1 | 2, healAmount);
      }

      // Armor break (already handled by armorBreak flag in hit resolution)
      if (sp.armorBreak) {
        // Extra stun on armor break
        defender.stunTimer = Math.max(defender.stunTimer, 0.3);
      }

      // Speed buff
      if (sp.speedBuff && sp.speedBuff > 1) {
        attacker.speedBuffTimer = 4.0; // 4 seconds
        attacker.speedBuffMult = sp.speedBuff;
      }

      // Defense debuff
      if (sp.defenseDebuff && sp.defenseDebuff > 0) {
        defender.defenseDebuffTimer = 5.0; // 5 seconds
        defender.defenseDebuffPct = sp.defenseDebuff;
      }

      // Extra stun from special
      if (sp.stun && sp.stun > 0) {
        defender.stunTimer = Math.max(defender.stunTimer, sp.stun);
      }

      // Use character-specific effect colors for the hit effect
      this.spawnHitEffect(
        (attacker.x + defender.x) / 2, 1.0, 0.5,
        "special", sp.color
      );

      // Character-specific screen shake
      if (sp.screenShake > this.screenShake.intensity) {
        this.screenShake.intensity = sp.screenShake;
        this.screenShake.duration = 0.2 + sp.screenShake * 0.03;
        this.screenShake.timer = 0;
      }
    }
  }

  /* ═══ AI SYSTEM — MCOC-INSPIRED WEIGHTED RANDOM ═══ */
  private updateAI(ai: Fighter, player: Fighter, dt: number) {
    // Don't act during stun
    if (ai.stunTimer > 0) return;
    if (ai.state === "parry_stun" || ai.state === "knockdown" || ai.state === "getup" || ai.state === "ko") return;
    if (this.isInAttackState(ai) && !this.canCancelIntoNext(ai)) return;

    ai.aiTimer -= dt;
    if (ai.aiDodgeCooldown > 0) ai.aiDodgeCooldown -= dt;

    // Aggression decay
    ai.aiAggression = Math.max(0, ai.aiAggression - dt * 0.3);

    // Mistake timer
    ai.aiMistakeTimer -= dt;

    const settings = DIFFICULTY_SETTINGS[this.difficulty];
    const dist = Math.abs(ai.x - player.x);
    const isPlayerAttacking = this.isInAttackState(player);
    const isPlayerDashing = player.state === "dash_fwd";
    const isPlayerClose = dist < MEDIUM_RANGE;
    const aiHealthRatio = ai.hp / ai.maxHp;
    const playerHealthRatio = player.hp / player.maxHp;

    if (ai.aiTimer > 0) return;

    // React speed based on difficulty
    const reactDelay = (1 - settings.aiReactSpeed) * 0.4;

    // ── MISTAKE SYSTEM — gives player openings ──
    if (ai.aiMistakeTimer <= 0 && Math.random() < settings.mistakeRate) {
      // AI makes a "mistake" — does nothing for a moment
      ai.aiMistakeTimer = 0.5 + Math.random() * 0.5;
      ai.state = "idle";
      ai.vx = 0;
      ai.aiTimer = 0.3 + Math.random() * 0.3;
      return;
    }

    // ── DEFENSIVE REACTIONS ──

    // Parry attempt — block just before player's attack lands
    if (isPlayerAttacking && isPlayerClose && Math.random() < settings.parryRate) {
      ai.state = "block_stand";
      ai.blockTimer = 0.3;
      ai.isParrying = true;
      ai.parryWindow = PARRY_WINDOW;
      ai.blockStartTime = performance.now() / 1000;
      ai.aiTimer = 0.2 + reactDelay;
      return;
    }

    // Dexterity (evade) — dash back to avoid attack
    if (isPlayerAttacking && isPlayerClose && Math.random() < settings.dexRate && ai.dashCooldown <= 0) {
      this.doDashBack(ai);
      ai.dexActive = true;
      ai.dexTimer = DEX_WINDOW;
      ai.invincible = DEX_WINDOW;
      ai.aiTimer = 0.3 + reactDelay;
      return;
    }

    // Block incoming attacks
    if (isPlayerAttacking && isPlayerClose && Math.random() < settings.blockRate) {
      ai.state = "block_stand";
      ai.blockTimer = 0.2;
      ai.aiTimer = 0.15 + reactDelay;
      return;
    }

    // ── INTERCEPT — attack during player's dash ──
    if (isPlayerDashing && isPlayerClose && Math.random() < settings.interceptRate) {
      this.startAttack(ai, "medium");
      ai.aiTimer = 0.3;
      this.callbacks.onIntercept?.(2);
      return;
    }

    // ── OFFENSIVE ACTIONS based on AI style ──
    switch (ai.aiStyle) {
      case "aggressive":
        this.aiAggressive(ai, player, dist, isPlayerAttacking, isPlayerClose, settings, reactDelay, dt);
        break;
      case "defensive":
        this.aiDefensive(ai, player, dist, isPlayerAttacking, isPlayerClose, aiHealthRatio, settings, reactDelay, dt);
        break;
      case "evasive":
        this.aiEvasive(ai, player, dist, isPlayerAttacking, isPlayerClose, settings, reactDelay, dt);
        break;
      case "balanced":
        this.aiBalanced(ai, player, dist, isPlayerAttacking, isPlayerClose, aiHealthRatio, playerHealthRatio, settings, reactDelay, dt);
        break;
    }
  }

  /* ── AGGRESSIVE AI ── */
  private aiAggressive(ai: Fighter, player: Fighter, dist: number, isPlayerAttacking: boolean, isPlayerClose: boolean, settings: any, reactDelay: number, _dt: number) {
    // Dash in if far
    if (dist > MEDIUM_RANGE && ai.dashCooldown <= 0) {
      this.doDashForward(ai);
      ai.aiTimer = DASH_DURATION + 0.05;
      return;
    }

    // Walk forward if medium distance
    if (dist > LIGHT_RANGE) {
      ai.vx = ai.facingRight ? WALK_SPEED * 1.1 : -WALK_SPEED * 1.1;
      ai.state = "walk_fwd";
      ai.aiTimer = 0.05;
      return;
    }

    // In range — MCOC combo: M-L-L-L-M pattern
    if (isPlayerClose) {
      // Special when ready
      if (ai.specialMeter >= 100 && Math.random() < 0.6) {
        this.doSpecialAttack(ai);
        ai.aiTimer = 0.5;
        return;
      }

      // Execute combo chain based on difficulty
      const maxChain = settings.comboLength;
      if (ai.aiComboStep === 0) {
        this.startAttack(ai, "medium"); // M
        ai.aiComboStep = 1;
        ai.aiTimer = MEDIUM_STARTUP + MEDIUM_ACTIVE + 0.02;
      } else if (ai.aiComboStep < maxChain - 1) {
        const lightNum = Math.min(ai.aiComboStep, 4) as 1 | 2 | 3 | 4;
        this.startAttack(ai, `light_${lightNum}` as FighterState); // L
        ai.aiComboStep++;
        ai.aiTimer = LIGHT_1_STARTUP + LIGHT_1_ACTIVE + 0.02;
      } else {
        this.startAttack(ai, "medium"); // M (ender)
        ai.aiComboStep = 0;
        ai.aiTimer = MEDIUM_STARTUP + MEDIUM_ACTIVE + MEDIUM_RECOVERY + reactDelay;
        // Dash back after combo
        setTimeout(() => {
          if (ai.state === "idle" && ai.dashCooldown <= 0) {
            this.doDashBack(ai);
          }
        }, 200);
      }
      return;
    }

    ai.aiTimer = 0.05;
  }

  /* ── DEFENSIVE AI ── */
  private aiDefensive(ai: Fighter, player: Fighter, dist: number, isPlayerAttacking: boolean, isPlayerClose: boolean, aiHealthRatio: number, settings: any, reactDelay: number, _dt: number) {
    // Block when player attacks
    if (isPlayerAttacking && isPlayerClose) {
      ai.state = "block_stand";
      ai.blockTimer = 0.3;
      ai.aiTimer = 0.3 + reactDelay * 0.5;
      return;
    }

    // Counter after blocking — wait for opening then punish
    if (ai.state === "block_stand" && !isPlayerAttacking && isPlayerClose) {
      // Player finished combo — counter with M-L-L-L
      this.startAttack(ai, "medium");
      ai.aiComboStep = 1;
      ai.aiTimer = MEDIUM_STARTUP + MEDIUM_ACTIVE + 0.02;
      return;
    }

    // Keep medium distance
    if (dist < 1.5) {
      this.doDashBack(ai);
      ai.aiTimer = 0.3;
      return;
    }

    if (dist > 3) {
      ai.vx = ai.facingRight ? WALK_SPEED * 0.6 : -WALK_SPEED * 0.6;
      ai.state = "walk_fwd";
      ai.aiTimer = 0.1;
      return;
    }

    // Occasional poke
    if (dist < LIGHT_RANGE && Math.random() < 0.15 * settings.aiAggression) {
      this.startAttack(ai, "light_1");
      ai.aiTimer = 0.4 + reactDelay;
      return;
    }

    // Special when safe
    if (ai.specialMeter >= 100 && dist < SPECIAL_RANGE && !isPlayerAttacking) {
      this.doSpecialAttack(ai);
      ai.aiTimer = 0.5;
      return;
    }

    ai.state = "idle";
    ai.vx = 0;
    ai.aiTimer = 0.15 + reactDelay;
  }

  /* ── EVASIVE AI ── */
  private aiEvasive(ai: Fighter, player: Fighter, dist: number, isPlayerAttacking: boolean, isPlayerClose: boolean, settings: any, reactDelay: number, _dt: number) {
    // Dodge incoming attacks
    if (isPlayerAttacking && isPlayerClose && ai.dashCooldown <= 0) {
      this.doDashBack(ai);
      ai.aiTimer = 0.3;
      return;
    }

    // Hit and run — dash in, quick attack, dash out
    if (dist > MEDIUM_RANGE && ai.dashCooldown <= 0) {
      this.doDashForward(ai);
      ai.aiTimer = DASH_DURATION + 0.05;
      return;
    }

    if (isPlayerClose && !isPlayerAttacking) {
      // Quick 2-hit poke then retreat
      this.startAttack(ai, "light_1");
      ai.aiComboStep = 1;
      ai.aiTimer = LIGHT_1_STARTUP + LIGHT_1_ACTIVE + 0.02;
      ai.aiPressureTimer = -1; // signal retreat
      return;
    }

    if (ai.aiPressureTimer < 0 && ai.dashCooldown <= 0) {
      this.doDashBack(ai);
      ai.aiPressureTimer = 0;
      ai.aiTimer = 0.3;
      return;
    }

    // Special from distance
    if (ai.specialMeter >= 100 && dist < SPECIAL_RANGE) {
      this.doSpecialAttack(ai);
      ai.aiTimer = 0.5;
      return;
    }

    ai.state = "idle";
    ai.vx = 0;
    ai.aiTimer = 0.1 + reactDelay;
  }

  /* ── BALANCED AI ── */
  private aiBalanced(ai: Fighter, player: Fighter, dist: number, isPlayerAttacking: boolean, isPlayerClose: boolean, aiHealthRatio: number, playerHealthRatio: number, settings: any, reactDelay: number, dt: number) {
    // Low health → play defensive
    if (aiHealthRatio < 0.3) {
      this.aiDefensive(ai, player, dist, isPlayerAttacking, isPlayerClose, aiHealthRatio, settings, reactDelay, dt);
      return;
    }

    // Player low health → go aggressive
    if (playerHealthRatio < 0.3) {
      this.aiAggressive(ai, player, dist, isPlayerAttacking, isPlayerClose, settings, reactDelay, dt);
      return;
    }

    // Normal play — MCOC-style: block → punish → combo → dash back
    if (isPlayerAttacking && isPlayerClose) {
      if (Math.random() < 0.6) {
        ai.state = "block_stand";
        ai.blockTimer = 0.2;
        ai.aiTimer = 0.2 + reactDelay;
      } else if (ai.dashCooldown <= 0) {
        this.doDashBack(ai);
        ai.aiTimer = 0.3;
      }
      return;
    }

    // Approach
    if (dist > MEDIUM_RANGE) {
      if (ai.dashCooldown <= 0 && Math.random() < 0.4) {
        this.doDashForward(ai);
        ai.aiTimer = DASH_DURATION + 0.05;
      } else {
        ai.vx = ai.facingRight ? WALK_SPEED : -WALK_SPEED;
        ai.state = "walk_fwd";
        ai.aiTimer = 0.08;
      }
      return;
    }

    // In range — varied attacks
    if (isPlayerClose) {
      const roll = Math.random();
      if (ai.specialMeter >= 100 && roll < 0.2) {
        this.doSpecialAttack(ai);
        ai.aiTimer = 0.5;
      } else if (roll < 0.5) {
        // MLLLM combo
        this.startAttack(ai, "medium");
        ai.aiComboStep = 1;
        ai.aiTimer = MEDIUM_STARTUP + MEDIUM_ACTIVE + 0.02;
      } else if (roll < 0.7) {
        // Heavy attack (guard break)
        ai.heavyChargeTime = HEAVY_MIN_CHARGE + Math.random() * 0.3;
        this.startAttack(ai, "heavy_release");
        ai.aiTimer = HEAVY_ACTIVE + HEAVY_RECOVERY + reactDelay;
      } else {
        // Feint — dash back then forward
        if (ai.dashCooldown <= 0) {
          this.doDashBack(ai);
          ai.aiTimer = 0.2;
        }
      }
      return;
    }

    ai.state = "idle";
    ai.vx = 0;
    ai.aiTimer = 0.1 + reactDelay;
  }

  /* ═══ COLLISION & PHYSICS ═══ */
  private resolveFighterCollision() {
    const dist = Math.abs(this.p1.x - this.p2.x);
    const minDist = 0.8;
    if (dist < minDist) {
      const overlap = (minDist - dist) / 2;
      const dir = this.p1.x < this.p2.x ? -1 : 1;
      this.p1.x += dir * overlap * PUSH_FORCE * 0.016;
      this.p2.x -= dir * overlap * PUSH_FORCE * 0.016;
    }
  }

  private clampToStage(f: Fighter) {
    const halfStage = STAGE_WIDTH / 2;
    f.x = Math.max(-halfStage, Math.min(halfStage, f.x));
  }

  private updateFacing() {
    if (!this.isInActionState(this.p1)) {
      this.p1.facingRight = this.p1.x < this.p2.x;
    }
    if (!this.isInActionState(this.p2)) {
      this.p2.facingRight = this.p2.x < this.p1.x;
    }
  }

  /* ═══ ROUND MANAGEMENT ═══ */
  private endRound(winner: 1 | 2) {
    const winnerFighter = winner === 1 ? this.p1 : this.p2;
    const loserFighter = winner === 1 ? this.p2 : this.p1;

    winnerFighter.roundWins++;
    winnerFighter.state = "victory";
    loserFighter.state = "ko";

    this.phase = "ko";
    this.phaseTimer = 2.0;
    this.callbacks.onPhaseChange?.("ko");
    this.callbacks.onRoundEnd?.(winner, this.p1.roundWins, this.p2.roundWins);

    this.slowMo = { active: true, speed: 0.2, duration: 1.0, timer: 1.0 };
    this.screenShake.intensity = 10;
    this.screenShake.duration = 0.5;
    this.screenShake.timer = 0;
  }

  private checkMatchEnd() {
    const winsNeeded = Math.ceil(this.maxRounds / 2);
    if (this.p1.roundWins >= winsNeeded) {
      this.phase = "match_end";
      this.callbacks.onPhaseChange?.("match_end");
      this.callbacks.onMatchEnd?.(1);
      return;
    }
    if (this.p2.roundWins >= winsNeeded) {
      this.phase = "match_end";
      this.callbacks.onPhaseChange?.("match_end");
      this.callbacks.onMatchEnd?.(2);
      return;
    }
    this.currentRound++;
    this.resetRound();
  }

  private resetRound() {
    this.p1.x = -0.6; this.p2.x = 0.6;
    this.p1.y = 0; this.p2.y = 0;
    this.p1.vx = 0; this.p2.vx = 0;
    this.p1.vy = 0; this.p2.vy = 0;
    this.p1.hp = this.p1.maxHp; this.p2.hp = this.p2.maxHp;
    this.p1.displayHp = this.p1.maxHp; this.p2.displayHp = this.p2.maxHp;
    this.p1.state = "idle"; this.p2.state = "idle";
    this.p1.specialMeter = 0; this.p2.specialMeter = 0;
    this.p1.comboCount = 0; this.p2.comboCount = 0;
    this.p1.comboChain = 0; this.p2.comboChain = 0;
    this.p1.stunTimer = 0; this.p2.stunTimer = 0;
    this.roundTimer = 99;

    this.phase = "round_announce";
    this.phaseTimer = 2.0;
    this.callbacks.onPhaseChange?.("round_announce");
  }

  /* ═══ HIT EFFECTS ═══ */
  private spawnHitEffect(x: number, y: number, z: number, type: HitEffect["type"], color: string) {
    const group = new THREE.Group();
    // FLOATING PARTICLES
    const particleCount = type === "special" ? 24 : type === "heavy" ? 14 : type === "parry" ? 16 : type === "critical" ? 18 : 8;
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(type === "parry" ? "#ffdd00" : color),
      transparent: true, opacity: 1,
    });

    for (let i = 0; i < particleCount; i++) {
      const size = type === "special" ? 0.08 : type === "heavy" ? 0.06 : 0.04;
      const geo = Math.random() < 0.5
        ? new THREE.SphereGeometry(size * (0.5 + Math.random()), 4, 4)
        : new THREE.BoxGeometry(size, size, size);
      const particle = new THREE.Mesh(geo, mat.clone());
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      particle.position.set(0, 0, 0);
      particle.userData.vx = Math.cos(angle) * speed;
      particle.userData.vy = Math.sin(angle) * speed * 0.5 + 2;
      particle.userData.vz = (Math.random() - 0.5) * speed;
      group.add(particle);
    }

    // Flash
    const flashGeo = new THREE.SphereGeometry(type === "special" ? 0.2 : type === "parry" ? 0.18 : 0.12, 8, 8);
    const flashMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(type === "parry" ? "#ffdd00" : color),
      transparent: true, opacity: 0.8,
    });
    const flash = new THREE.Mesh(flashGeo, flashMat);
    flash.name = "flash";
    group.add(flash);

    group.position.set(x, y, z);
    this.scene.add(group);

    this.hitEffects.push({
      x, y, z,
      life: 0, maxLife: type === "special" ? 0.6 : type === "parry" ? 0.5 : 0.4,
      type, color, particles: group,
    });
  }

  private updateEffects(dt: number) {
    // Screen shake
    if (this.screenShake.duration > 0) {
      this.screenShake.timer += dt;
      if (this.screenShake.timer < this.screenShake.duration) {
        const decay = 1 - this.screenShake.timer / this.screenShake.duration;
        this.cameraShakeOffset.set(
          (Math.random() - 0.5) * this.screenShake.intensity * decay * 0.05,
          (Math.random() - 0.5) * this.screenShake.intensity * decay * 0.03,
          0
        );
      } else {
        this.screenShake.duration = 0;
        this.cameraShakeOffset.set(0, 0, 0);
      }
    }

    // Hit effect particles
    for (let i = this.hitEffects.length - 1; i >= 0; i--) {
      const effect = this.hitEffects[i];
      effect.life += dt;
      const progress = effect.life / effect.maxLife;

      if (progress >= 1) {
        this.scene.remove(effect.particles);
        effect.particles.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          }
        });
        this.hitEffects.splice(i, 1);
        continue;
      }

      effect.particles.children.forEach((child) => {
        if (child.name === "flash") {
          const scale = 1 + progress * 1.2;
          child.scale.set(scale, scale, scale);
          ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = (1 - progress) * 0.8;
          return;
        }
        child.position.x += (child.userData.vx || 0) * dt;
        child.position.y += (child.userData.vy || 0) * dt;
        child.position.z += (child.userData.vz || 0) * dt;
        child.userData.vy -= 10 * dt;
        const pMat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        pMat.opacity = 1 - progress;
        child.scale.multiplyScalar(0.97);
      });
    }
  }

  /* ═══ SPRITE-BASED ANIMATION ═══ */
  private animateModels(dt: number) {
    this.animateSprite(this.p1, dt);
    this.animateSprite(this.p2, dt);
  }

  private animateSprite(f: Fighter, _dt: number) {
    const t = this.animFrame * 0.05;
    const sprite = f.model.sprite;
    const mat = f.model.spriteMaterial;
    const glowMat = f.model.glowMaterial;
    const h = f.config.height * 0.95;
    const baseY = h / 2 - 0.1;

    mat.uniforms.uTime.value = t;
    glowMat.uniforms.uTime.value = t;

    // Reset
    sprite.position.y = baseY;
    sprite.position.z = 0;
    sprite.rotation.set(0, 0, 0);
    sprite.scale.set(1, 1, 1);
    mat.uniforms.uHitFlash.value = 0;
    mat.uniforms.uSpecialGlow.value = 0;
    mat.uniforms.uBlockTint.value = 0;
    mat.uniforms.uOpacity.value = 1.0;
    glowMat.uniforms.uGlowIntensity.value = 0.5;

    const glowSprite = f.model.glowSprite;

    // ── Pose-based texture swapping ──
    const poseTextures = f.model.poseTextures;
    if (poseTextures && Object.keys(poseTextures).length > 0) {
      let targetPose = "idle";
      if (["idle", "walk_fwd", "walk_back", "crouch", "jump", "dash_fwd", "dash_back"].includes(f.state)) {
        targetPose = "idle";
      } else if (this.isInAttackState(f)) {
        targetPose = "attack";
      } else if (["block_stand", "block_crouch", "blockstun"].includes(f.state)) {
        targetPose = "block";
      } else if (["hitstun", "knockdown", "getup", "launched", "parry_stun"].includes(f.state)) {
        targetPose = "hit";
      } else if (f.state === "ko") {
        targetPose = "ko";
      } else if (f.state === "victory") {
        targetPose = "victory";
      }

      if (targetPose !== f.model.currentPose && poseTextures[targetPose]) {
        mat.uniforms.uTexture.value = poseTextures[targetPose];
        f.model.glowMaterial.uniforms.uTexture.value = poseTextures[targetPose];
        f.model.currentPose = targetPose;
      }
    }

    switch (f.state) {
      case "idle": {
        const bob = Math.sin(t * 2.5) * 0.025;
        const breathe = 1.0 + Math.sin(t * 2.5) * 0.008;
        sprite.position.y = baseY + bob;
        sprite.scale.set(breathe, 1.0 + Math.sin(t * 2.5) * 0.005, 1);
        glowMat.uniforms.uGlowIntensity.value = 0.4 + Math.sin(t * 1.5) * 0.15;
        break;
      }
      case "walk_fwd": {
        const walkBob = Math.abs(Math.sin(t * 5)) * 0.03;
        sprite.position.y = baseY + walkBob;
        sprite.rotation.z = -0.03;
        sprite.position.z = 0.05;
        break;
      }
      case "walk_back": {
        const walkBob = Math.abs(Math.sin(t * 5)) * 0.03;
        sprite.position.y = baseY + walkBob;
        sprite.rotation.z = 0.03;
        sprite.position.z = -0.05;
        break;
      }
      case "dash_fwd": {
        // Fast lunge forward
        sprite.position.z = 0.15;
        sprite.rotation.z = -0.06;
        sprite.scale.set(0.92, 1.05, 1);
        const dashProg = f.stateTimer / DASH_DURATION;
        mat.uniforms.uSpecialGlow.value = (1 - dashProg) * 0.3;
        break;
      }
      case "dash_back": {
        // Quick evade backward
        sprite.position.z = -0.12;
        sprite.rotation.z = 0.04;
        sprite.scale.set(0.95, 1.02, 1);
        if (f.dexActive) {
          mat.uniforms.uOpacity.value = 0.6 + Math.sin(t * 20) * 0.3;
          glowMat.uniforms.uGlowIntensity.value = 2.0;
        }
        break;
      }
      case "light_1": case "light_2": case "light_3": case "light_4": {
        const frameData = this.getAttackFrameData(f.state, f);
        if (f.stateTimer < frameData.startup) {
          const prog = f.stateTimer / frameData.startup;
          sprite.position.z = -0.06 * prog;
          sprite.scale.set(1.02, 0.98, 1);
        } else if (f.stateTimer < frameData.startup + frameData.active) {
          sprite.position.z = 0.12;
          sprite.scale.set(0.96, 1.03, 1);
          sprite.rotation.z = -0.03;
          mat.uniforms.uHitFlash.value = 0.12;
        } else {
          const recProg = (f.stateTimer - frameData.startup - frameData.active) / frameData.recovery;
          sprite.position.z = 0.12 * (1 - recProg);
        }
        break;
      }
      case "medium": {
        const frameData = this.getAttackFrameData("medium", f);
        if (f.stateTimer < frameData.startup) {
          const prog = f.stateTimer / frameData.startup;
          sprite.position.z = -0.1 * prog;
          sprite.scale.set(1.04, 0.96, 1);
          sprite.rotation.z = 0.04;
        } else if (f.stateTimer < frameData.startup + frameData.active) {
          sprite.position.z = 0.2;
          sprite.scale.set(0.92, 1.06, 1);
          sprite.rotation.z = -0.05;
          mat.uniforms.uHitFlash.value = 0.2;
        } else {
          const recProg = (f.stateTimer - frameData.startup - frameData.active) / frameData.recovery;
          sprite.position.z = 0.2 * (1 - recProg);
          sprite.scale.set(1 - 0.08 * (1 - recProg), 1 + 0.06 * (1 - recProg), 1);
        }
        break;
      }
      case "heavy_charge": {
        const chargeRatio = Math.min(f.heavyChargeTime / HEAVY_MAX_CHARGE, 1);
        const pulse = Math.sin(f.stateTimer * 15) * 0.02 * chargeRatio;
        sprite.scale.set(1.05 + pulse, 1.05 + pulse, 1);
        mat.uniforms.uSpecialGlow.value = chargeRatio * 0.6;
        glowMat.uniforms.uGlowIntensity.value = 1.0 + chargeRatio * 2;
        sprite.position.y = baseY + pulse * 2;
        break;
      }
      case "heavy_release": {
        const frameData = this.getAttackFrameData("heavy_release", f);
        if (f.stateTimer < frameData.startup) {
          sprite.position.z = -0.1;
          sprite.scale.set(1.08, 0.92, 1);
          mat.uniforms.uSpecialGlow.value = 0.5;
        } else if (f.stateTimer < frameData.startup + frameData.active) {
          sprite.position.z = 0.25;
          sprite.scale.set(0.88, 1.1, 1);
          sprite.rotation.z = -0.08;
          mat.uniforms.uHitFlash.value = 0.3;
          mat.uniforms.uSpecialGlow.value = 0.8;
          glowMat.uniforms.uGlowIntensity.value = 2.5;
        } else {
          const recProg = (f.stateTimer - frameData.startup - frameData.active) / frameData.recovery;
          sprite.position.z = 0.25 * (1 - recProg);
          mat.uniforms.uSpecialGlow.value = 0.8 * (1 - recProg);
        }
        break;
      }
      case "block_stand": case "block_crouch": {
        mat.uniforms.uBlockTint.value = 0.5;
        sprite.scale.set(0.95, f.state === "block_crouch" ? 0.85 : 0.97, 1);
        if (f.state === "block_crouch") sprite.position.y = baseY - 0.15;
        glowMat.uniforms.uGlowIntensity.value = 1.2;
        const blockPulse = Math.sin(t * 8) * 0.02;
        sprite.scale.x += blockPulse;
        sprite.scale.y += blockPulse;
        // Parry flash
        if (f.isParrying && f.parryWindow > 0) {
          mat.uniforms.uBlockTint.value = 0.8;
          glowMat.uniforms.uGlowIntensity.value = 2.5;
        }
        break;
      }
      case "special_1": case "special_2": case "special_3": {
        const frameData = this.getAttackFrameData(f.state, f);
        const spLevel = f.state === "special_3" ? 3 : f.state === "special_2" ? 2 : 1;
        if (f.stateTimer < frameData.startup) {
          const prog = f.stateTimer / frameData.startup;
          const pulse = Math.sin(f.stateTimer * 25) * 0.03;
          sprite.scale.set(1.05 + pulse, 1.05 + pulse, 1);
          mat.uniforms.uSpecialGlow.value = prog * 0.8;
          glowMat.uniforms.uGlowIntensity.value = 1.5 + prog * spLevel;
          sprite.position.y = baseY + pulse * 2;
        } else if (f.stateTimer < frameData.startup + frameData.active) {
          sprite.position.z = 0.3;
          sprite.scale.set(0.85, 1.12, 1);
          mat.uniforms.uSpecialGlow.value = 1.0;
          mat.uniforms.uHitFlash.value = 0.3;
          glowMat.uniforms.uGlowIntensity.value = 2.0 + spLevel;
        } else {
          const recProg = (f.stateTimer - frameData.startup - frameData.active) / frameData.recovery;
          sprite.position.z = 0.3 * (1 - recProg);
          mat.uniforms.uSpecialGlow.value = 1.0 * (1 - recProg);
          glowMat.uniforms.uGlowIntensity.value = (2.0 + spLevel) * (1 - recProg) + 0.5;
        }
        break;
      }
      case "hitstun": {
        const hitProg = Math.min(f.stateTimer / 0.15, 1);
        const shake = Math.sin(hitProg * Math.PI * 6) * 0.04 * (1 - hitProg);
        sprite.position.z = -0.08 * (1 - hitProg);
        sprite.rotation.z = shake;
        sprite.scale.set(1.03, 0.97, 1);
        mat.uniforms.uHitFlash.value = 0.6 * (1 - hitProg);
        break;
      }
      case "blockstun": {
        const blockProg = Math.min(f.stateTimer / 0.12, 1);
        const shake = Math.sin(blockProg * Math.PI * 4) * 0.02 * (1 - blockProg);
        sprite.rotation.z = shake;
        mat.uniforms.uBlockTint.value = 0.4 * (1 - blockProg);
        break;
      }
      case "parry_stun": {
        // Stunned — dizzy wobble
        const stunProg = f.stunTimer / PARRY_STUN_DURATION;
        sprite.rotation.z = Math.sin(t * 8) * 0.06 * stunProg;
        sprite.position.y = baseY - 0.05;
        mat.uniforms.uHitFlash.value = 0.3 * stunProg;
        // Stars effect (yellow glow)
        glowMat.uniforms.uGlowIntensity.value = 1.5 * stunProg;
        break;
      }
      case "launched": {
        sprite.rotation.z = f.stateTimer * 5; // spin in air
        sprite.scale.set(0.95, 1.05, 1);
        mat.uniforms.uHitFlash.value = 0.2;
        break;
      }
      case "knockdown": {
        const knockProg = Math.min(f.stateTimer / 0.5, 1);
        sprite.rotation.z = knockProg * 1.2;
        sprite.position.y = baseY * (1 - knockProg * 0.6);
        sprite.scale.set(1 + knockProg * 0.1, 1 - knockProg * 0.2, 1);
        mat.uniforms.uHitFlash.value = 0.3 * (1 - knockProg);
        mat.uniforms.uOpacity.value = 1.0 - knockProg * 0.15;
        break;
      }
      case "getup": {
        const getProg = Math.min(f.stateTimer / 0.4, 1);
        sprite.rotation.z = 1.2 * (1 - getProg);
        sprite.position.y = baseY * (0.4 + getProg * 0.6);
        mat.uniforms.uOpacity.value = 0.7 + Math.sin(t * 20) * 0.3;
        break;
      }
      case "victory": {
        const victBob = Math.sin(t * 3) * 0.05;
        sprite.position.y = baseY + 0.05 + victBob;
        sprite.scale.set(1.03, 1.03, 1);
        mat.uniforms.uSpecialGlow.value = 0.3 + Math.sin(t * 2) * 0.15;
        glowMat.uniforms.uGlowIntensity.value = 1.5;
        break;
      }
      case "ko": {
        sprite.rotation.z = Math.PI / 2.5;
        sprite.position.y = baseY * 0.35;
        sprite.scale.set(1.05, 0.85, 1);
        mat.uniforms.uOpacity.value = 0.7;
        glowMat.uniforms.uGlowIntensity.value = 0.1;
        break;
      }
      case "crouch": {
        sprite.scale.set(1.05, 0.8, 1);
        sprite.position.y = baseY - 0.2;
        break;
      }
      case "jump": {
        sprite.scale.set(0.95, 1.06, 1);
        sprite.rotation.z = f.vx > 0 ? -0.05 : f.vx < 0 ? 0.05 : 0;
        break;
      }
    }

    // Sync glow sprite
    glowSprite.position.copy(sprite.position);
    glowSprite.position.z = sprite.position.z - 0.01;
    glowSprite.rotation.copy(sprite.rotation);
    glowSprite.scale.copy(sprite.scale);

    // Energy particles
    if (f.model.energyParticles) {
      f.model.energyParticles.children.forEach((p) => {
        const ud = p.userData;
        ud.angle += ud.speed * _dt;
        p.position.x = Math.cos(ud.angle) * ud.radius;
        p.position.z = Math.sin(ud.angle) * ud.radius * 0.3;
        p.position.y = ud.yBase + Math.sin(ud.angle * 2) * 0.1;
        const mesh = p as THREE.Mesh;
        const pMat = mesh.material as THREE.MeshBasicMaterial;
        if (this.isSpecialAttack(f.state)) {
          pMat.opacity = 0.9;
          ud.radius = 0.6 + Math.sin(t * 5) * 0.2;
        } else if (f.state === "idle") {
          pMat.opacity = 0.3 + Math.sin(t + ud.angle) * 0.2;
        } else {
          pMat.opacity = 0.4;
        }
      });
    }

    // Ground shadow
    if (f.model.groundShadow) {
      const shadowMat = f.model.groundShadow.material as THREE.MeshBasicMaterial;
      if (f.state === "jump" || f.state === "launched") {
        const jumpH = Math.max(0, f.y);
        const shadowScale = Math.max(0.3, 1 - jumpH * 0.3);
        f.model.groundShadow.scale.set(shadowScale, 0.5 * shadowScale, shadowScale);
        shadowMat.opacity = 0.15 * shadowScale;
      } else if (f.state === "knockdown" || f.state === "ko") {
        f.model.groundShadow.scale.set(1.3, 0.3, 1);
        shadowMat.opacity = 0.25;
      } else {
        f.model.groundShadow.scale.set(1, 0.5, 1);
        shadowMat.opacity = 0.3;
      }
    }
  }

  /* ═══ CAMERA ═══ */
  private updateCamera(_dt: number) {
    const midX = (this.p1.x + this.p2.x) / 2;
    const dist = Math.abs(this.p1.x - this.p2.x);
    const targetZ = 3.0 + dist * 0.25;

    this.cameraTarget.x += (midX - this.cameraTarget.x) * 0.15;
    this.cameraTarget.z = targetZ;

    this.camera.position.x = this.cameraTarget.x + this.cameraShakeOffset.x;
    this.camera.position.y = 1.0 + this.cameraShakeOffset.y;
    this.camera.position.z = this.cameraTarget.z;
    this.camera.lookAt(this.cameraTarget.x, 0.7, 0);
  }

  /* ═══ RENDER ═══ */
  private render() {
    this.stageLights.forEach((light, i) => {
      light.intensity = 0.3 + Math.sin(this.animFrame * 0.02 + i) * 0.2;
    });
    this.renderer.render(this.scene, this.camera);
  }

  /* ═══ PUBLIC API ═══ */
  public getState() {
    return {
      phase: this.phase,
      round: this.currentRound,
      timer: Math.ceil(this.roundTimer),
      p1: {
        name: this.p1.data.name,
        hp: this.p1.hp,
        maxHp: this.p1.maxHp,
        displayHp: this.p1.displayHp,
        specialMeter: this.p1.specialMeter,
        roundWins: this.p1.roundWins,
        state: this.p1.state,
        comboCount: this.p1.comboCount,
        comboDamage: this.p1.comboDamage,
        comboChain: this.p1.comboChain,
        stunTimer: this.p1.stunTimer,
        isParrying: this.p1.isParrying,
        dexActive: this.p1.dexActive,
        heavyCharging: this.p1.state === "heavy_charge",
        heavyChargeRatio: Math.min(this.p1.heavyChargeTime / HEAVY_MAX_CHARGE, 1),
        color: this.p1.config.accentColor,
        image: this.p1.data.image,
        specials: this.p1.specials,
        dotActive: this.p1.dotTimer > 0,
        speedBuffActive: this.p1.speedBuffTimer > 0,
        defenseDebuffActive: this.p1.defenseDebuffTimer > 0,
      },
      p2: {
        name: this.p2.data.name,
        hp: this.p2.hp,
        maxHp: this.p2.maxHp,
        displayHp: this.p2.displayHp,
        specialMeter: this.p2.specialMeter,
        roundWins: this.p2.roundWins,
        state: this.p2.state,
        comboCount: this.p2.comboCount,
        comboDamage: this.p2.comboDamage,
        comboChain: this.p2.comboChain,
        stunTimer: this.p2.stunTimer,
        isParrying: false,
        dexActive: false,
        heavyCharging: false,
        heavyChargeRatio: 0,
        color: this.p2.config.accentColor,
        image: this.p2.data.image,
        specials: this.p2.specials,
        dotActive: this.p2.dotTimer > 0,
        speedBuffActive: this.p2.speedBuffTimer > 0,
        defenseDebuffActive: this.p2.defenseDebuffTimer > 0,
      },
    };
  }

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

  public dispose() {
    this.disposed = true;
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("keydown", (this as any)._keyDown);
    window.removeEventListener("keyup", (this as any)._keyUp);

    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach(m => m.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

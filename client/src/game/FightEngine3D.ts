/* ═══════════════════════════════════════════════════════
   FIGHT ENGINE 3D — 2.5D Fighting Game Engine
   Three.js scene with 3D character models on a 2D plane.
   MK/SF/Tekken-inspired combat with 4 AI fighting styles.
   ═══════════════════════════════════════════════════════ */
import * as THREE from "three";
import { buildCharacterModel, getCharacterConfig, type CharacterModel, type CharacterConfig } from "./CharacterModel3D";
import type { FighterData } from "./gameData";

/* ═══ TYPES ═══ */
export type FightPhase = "intro" | "round_announce" | "fighting" | "ko" | "round_end" | "match_end";
export type FighterState = "idle" | "walk_fwd" | "walk_back" | "jump" | "crouch" |
  "punch_light" | "punch_heavy" | "kick_light" | "kick_heavy" |
  "block_stand" | "block_crouch" | "special" |
  "hitstun" | "blockstun" | "knockdown" | "getup" | "victory" | "ko";
export type AIStyle = "aggressive" | "defensive" | "evasive" | "balanced";
export type Difficulty = "recruit" | "soldier" | "veteran" | "archon";

interface HitEffect {
  x: number; y: number; z: number;
  life: number; maxLife: number;
  type: "spark" | "heavy" | "block" | "special";
  color: string;
  particles: THREE.Group;
}

interface Fighter {
  data: FighterData;
  model: CharacterModel;
  config: CharacterConfig;
  // Position & physics (2D plane: x = left/right, y = up/down)
  x: number;
  y: number;
  vx: number;
  vy: number;
  facingRight: boolean;
  // State
  state: FighterState;
  stateTimer: number;
  // Health
  hp: number;
  maxHp: number;
  displayHp: number; // for smooth drain animation
  // Combat
  comboCount: number;
  comboDamage: number;
  comboTimer: number;
  specialMeter: number; // 0-100
  blockTimer: number;
  invincible: number;
  // Round wins
  roundWins: number;
  // AI
  aiStyle: AIStyle;
  aiTimer: number;
  aiDecision: string;
  aiComboStep: number;
  aiReactTimer: number;
  aiPressureTimer: number;
  aiDodgeCooldown: number;
}

/* ═══ CONSTANTS ═══ */
const STAGE_WIDTH = 12;
const GROUND_Y = 0;
const GRAVITY = -28;
const JUMP_FORCE = 10;
const WALK_SPEED = 4.5;
const BACK_SPEED = 3.0;
const DASH_SPEED = 8;
const PUSH_FORCE = 2.5;

// Frame data (in seconds for 60fps feel)
const FRAME = 1 / 60;
const LIGHT_STARTUP = 4 * FRAME;
const LIGHT_ACTIVE = 3 * FRAME;
const LIGHT_RECOVERY = 6 * FRAME;
const HEAVY_STARTUP = 8 * FRAME;
const HEAVY_ACTIVE = 4 * FRAME;
const HEAVY_RECOVERY = 12 * FRAME;
const SPECIAL_STARTUP = 12 * FRAME;
const SPECIAL_ACTIVE = 6 * FRAME;
const SPECIAL_RECOVERY = 18 * FRAME;
const HITSTUN_LIGHT = 12 * FRAME;
const HITSTUN_HEAVY = 18 * FRAME;
const HITSTUN_SPECIAL = 24 * FRAME;
const BLOCKSTUN = 8 * FRAME;
const KNOCKDOWN_TIME = 40 * FRAME;
const GETUP_TIME = 20 * FRAME;

// Damage values
const DMG_PUNCH_LIGHT = 5;
const DMG_PUNCH_HEAVY = 10;
const DMG_KICK_LIGHT = 6;
const DMG_KICK_HEAVY = 12;
const DMG_SPECIAL_BASE = 25;
const CHIP_DAMAGE_RATIO = 0.15;
const COMBO_SCALING = 0.85; // each hit in combo does 85% of previous

// Hit ranges
const PUNCH_RANGE = 1.2;
const KICK_RANGE = 1.5;
const SPECIAL_RANGE = 2.0;

// Difficulty multipliers
const DIFFICULTY_SETTINGS: Record<Difficulty, { aiReactSpeed: number; aiAggression: number; dmgMult: number; blockRate: number }> = {
  recruit:  { aiReactSpeed: 0.4, aiAggression: 0.3, dmgMult: 0.7, blockRate: 0.15 },
  soldier:  { aiReactSpeed: 0.6, aiAggression: 0.5, dmgMult: 0.9, blockRate: 0.35 },
  veteran:  { aiReactSpeed: 0.8, aiAggression: 0.7, dmgMult: 1.0, blockRate: 0.55 },
  archon:   { aiReactSpeed: 0.95, aiAggression: 0.85, dmgMult: 1.2, blockRate: 0.75 },
};

/* ═══ CALLBACKS ═══ */
export interface FightCallbacks {
  onPhaseChange?: (phase: FightPhase) => void;
  onHealthChange?: (p1Hp: number, p1Max: number, p2Hp: number, p2Max: number) => void;
  onCombo?: (player: 1 | 2, count: number, damage: number) => void;
  onRoundEnd?: (winner: 1 | 2, p1Wins: number, p2Wins: number) => void;
  onMatchEnd?: (winner: 1 | 2) => void;
  onSpecialReady?: (player: 1 | 2) => void;
  onHit?: (attacker: 1 | 2, type: string) => void;
}

/* ═══════════════════════════════════════════════════════
   FIGHT ENGINE 3D CLASS
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
  private maxRounds = 3; // best of 3
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

  // Input
  private keys: Set<string> = new Set();
  private touchState = { left: false, right: false, up: false, down: false, punch: false, kick: false, block: false, special: false };

  // Stage
  private stageFloor!: THREE.Mesh;
  private stageLights: THREE.PointLight[] = [];

  // Animation
  private animFrame = 0;
  private disposed = false;

  constructor(
    container: HTMLElement,
    p1Data: FighterData,
    p2Data: FighterData,
    difficulty: Difficulty,
    callbacks: FightCallbacks = {}
  ) {
    this.difficulty = difficulty;
    this.callbacks = callbacks;

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
    // ── FLOOR — reflective arena platform ──
    const floorGeo = new THREE.PlaneGeometry(24, 14, 48, 28);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      roughness: 0.25,
      metalness: 0.75,
    });
    this.stageFloor = new THREE.Mesh(floorGeo, floorMat);
    this.stageFloor.rotation.x = -Math.PI / 2;
    this.stageFloor.receiveShadow = true;
    this.scene.add(this.stageFloor);

    // Floor grid — cyan-tinted tech grid
    const gridHelper = new THREE.GridHelper(24, 48, 0x1a3355, 0x0d1a2e);
    gridHelper.position.y = 0.01;
    this.scene.add(gridHelper);

    // ── FLOOR GLOW LINES — pulsing energy channels ──
    const channelMat = new THREE.MeshBasicMaterial({
      color: 0x00ccff, transparent: true, opacity: 0.15,
    });
    for (const x of [-3, 0, 3]) {
      const ch = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.005, 14), channelMat);
      ch.position.set(x, 0.02, 0);
      this.scene.add(ch);
    }
    // Cross channels
    for (const z of [-3, -1, 1, 3]) {
      const ch = new THREE.Mesh(new THREE.BoxGeometry(24, 0.005, 0.04), channelMat);
      ch.position.set(0, 0.02, z);
      this.scene.add(ch);
    }

    // ── BACK WALL — layered depth with architectural detail ──
    const wallGeo = new THREE.PlaneGeometry(24, 10);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x12122a,
      roughness: 0.4,
      metalness: 0.4,
      emissive: 0x0a0a1e,
      emissiveIntensity: 0.8,
    });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 5, -6);
    this.scene.add(wall);

    // Wall accent panel — large central emblem area
    const panelGeo = new THREE.PlaneGeometry(6, 4);
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a3a,
      roughness: 0.3,
      metalness: 0.6,
      emissive: 0x111133,
      emissiveIntensity: 0.5,
    });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, 5, -5.95);
    this.scene.add(panel);

    // Central emblem ring
    const ringGeo = new THREE.TorusGeometry(1.2, 0.06, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x4488ff, transparent: true, opacity: 0.5,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, 5.2, -5.9);
    this.scene.add(ring);
    // Inner ring
    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.7, 0.04, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.4 })
    );
    innerRing.position.set(0, 5.2, -5.88);
    this.scene.add(innerRing);

    // ── PILLARS — ornate columns with glowing runes ──
    const pillarGeo = new THREE.CylinderGeometry(0.22, 0.3, 8, 12);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a4e,
      roughness: 0.15,
      metalness: 0.85,
      emissive: 0x151530,
      emissiveIntensity: 0.4,
    });
    const pillarPositions = [-5.5, -3, 3, 5.5];
    for (const x of pillarPositions) {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(x, 4, -5.2);
      pillar.castShadow = true;
      this.scene.add(pillar);

      // Pillar cap — ornamental top
      const capGeo = new THREE.CylinderGeometry(0.35, 0.22, 0.3, 12);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0x4a4a7e, roughness: 0.1, metalness: 0.9,
        emissive: 0x2a2a5e, emissiveIntensity: 0.3,
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(x, 8.15, -5.2);
      this.scene.add(cap);

      // Pillar base
      const baseGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.4, 12);
      const base = new THREE.Mesh(baseGeo, capMat);
      base.position.set(x, 0.2, -5.2);
      this.scene.add(base);

      // Glowing rune strips on pillar
      const colors = [0x4488ff, 0x00ccff, 0x6644ff];
      for (let i = 0; i < 3; i++) {
        const stripGeo = new THREE.BoxGeometry(0.04, 1.2, 0.04);
        const stripMat = new THREE.MeshBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0.5 - i * 0.1,
        });
        const strip = new THREE.Mesh(stripGeo, stripMat);
        strip.position.set(x, 2 + i * 2.2, -5.0);
        this.scene.add(strip);
      }
    }

    // ── ARCHWAY — connecting top pillars ──
    const archGeo = new THREE.BoxGeometry(11, 0.25, 0.5);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a4e, roughness: 0.15, metalness: 0.85,
      emissive: 0x1a1a3e, emissiveIntensity: 0.3,
    });
    const arch = new THREE.Mesh(archGeo, archMat);
    arch.position.set(0, 8.3, -5.2);
    this.scene.add(arch);

    // Arch glow strip
    const archGlowGeo = new THREE.BoxGeometry(10.5, 0.05, 0.1);
    const archGlowMat = new THREE.MeshBasicMaterial({
      color: 0x4488ff, transparent: true, opacity: 0.4,
    });
    const archGlow = new THREE.Mesh(archGlowGeo, archGlowMat);
    archGlow.position.set(0, 8.15, -4.95);
    this.scene.add(archGlow);

    // ── FLOATING PARTICLES — atmospheric dust/embers ──
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 8;
      positions[i * 3 + 2] = -6 + Math.random() * 4;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x6688cc,
      size: 0.06,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    this.scene.add(particles);

    // ── STAGE EDGE MARKERS — glowing boundary lines ──
    const edgeGeo = new THREE.BoxGeometry(0.08, 0.03, 14);
    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 0.8,
    });
    for (const x of [-STAGE_WIDTH / 2, STAGE_WIDTH / 2]) {
      const edge = new THREE.Mesh(edgeGeo, edgeMat);
      edge.position.set(x, 0.015, 0);
      this.scene.add(edge);
      // Vertical danger glow
      const vGlow = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 3, 0.02),
        new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.25 })
      );
      vGlow.position.set(x, 1.5, 0);
      this.scene.add(vGlow);
    }

    // ── SIDE DECORATIONS — spectator stands / barriers ──
    const barrierMat = new THREE.MeshStandardMaterial({
      color: 0x1e1e3a, roughness: 0.3, metalness: 0.7,
    });
    for (const x of [-8, 8]) {
      const barrier = new THREE.Mesh(new THREE.BoxGeometry(2, 1.5, 8), barrierMat);
      barrier.position.set(x, 0.75, -2);
      this.scene.add(barrier);
      // Barrier top glow
      const topGlow = new THREE.Mesh(
        new THREE.BoxGeometry(2.1, 0.05, 8.1),
        new THREE.MeshBasicMaterial({ color: 0x3366aa, transparent: true, opacity: 0.3 })
      );
      topGlow.position.set(x, 1.52, -2);
      this.scene.add(topGlow);
    }
  }

  private buildLighting() {
    // Ambient — bright enough to see character details
    const ambient = new THREE.AmbientLight(0x667788, 1.5);
    this.scene.add(ambient);

    // Main directional (sun/key light)
    const dirLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    dirLight.position.set(3, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 20;
    dirLight.shadow.camera.left = -8;
    dirLight.shadow.camera.right = 8;
    dirLight.shadow.camera.top = 6;
    dirLight.shadow.camera.bottom = -1;
    this.scene.add(dirLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x6688cc, 1.0);
    fillLight.position.set(-3, 4, 3);
    this.scene.add(fillLight);

    // Rim light (back)
    const rimLight = new THREE.DirectionalLight(0x8866cc, 1.2);
    rimLight.position.set(0, 3, -5);
    this.scene.add(rimLight);

    // Stage spotlights — brighter for better visibility
    for (const x of [-3, 0, 3]) {
      const spot = new THREE.PointLight(0x6666ff, 0.8, 12);
      spot.position.set(x, 4, -2);
      this.scene.add(spot);
      this.stageLights.push(spot);
    }

    // Front fill lights to illuminate characters from the camera side
    const frontFill = new THREE.PointLight(0xffffff, 0.7, 12);
    frontFill.position.set(0, 2, 3.5);

    // Additional front-side fills for character sprites
    const leftFill = new THREE.PointLight(0xffffff, 0.3, 8);
    leftFill.position.set(-2, 1.5, 3);
    this.scene.add(leftFill);
    const rightFill = new THREE.PointLight(0xffffff, 0.3, 8);
    rightFill.position.set(2, 1.5, 3);
    this.scene.add(rightFill);
    this.scene.add(frontFill);
  }

  /* ═══ FIGHTER CREATION ═══ */
  private createFighter(data: FighterData, startX: number, facingRight: boolean): Fighter {
    const model = buildCharacterModel(data.id);
    const config = getCharacterConfig(data.id);

    // Position model — 2.5D: characters always face camera, mirror via scale.x
    model.group.position.set(startX, 0, 0);
    if (!facingRight) {
      model.group.scale.x = -1; // mirror for facing left
    }
    model.group.castShadow = true;
    this.scene.add(model.group);

    // Character glow light
    const glowLight = new THREE.PointLight(new THREE.Color(config.glowColor).getHex(), 0.4, 3);
    glowLight.position.set(0, 1.2, 0.5);
    model.group.add(glowLight);

    return {
      data,
      model,
      config,
      x: startX,
      y: 0,
      vx: 0,
      vy: 0,
      facingRight,
      state: "idle",
      stateTimer: 0,
      hp: data.hp,
      maxHp: data.hp,
      displayHp: data.hp,
      comboCount: 0,
      comboDamage: 0,
      comboTimer: 0,
      specialMeter: 0,
      blockTimer: 0,
      invincible: 0,
      roundWins: 0,
      aiStyle: config.fightStyle,
      aiTimer: 0,
      aiDecision: "idle",
      aiComboStep: 0,
      aiReactTimer: 0,
      aiPressureTimer: 0,
      aiDodgeCooldown: 0,
    };
  }

  /* ═══ INPUT HANDLING ═══ */
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
    // Store for cleanup
    (this as any)._keyDown = onKeyDown;
    (this as any)._keyUp = onKeyUp;
  }

  public setTouchState(state: Partial<typeof this.touchState>) {
    Object.assign(this.touchState, state);
  }

  /* ═══ MAIN GAME LOOP ═══ */
  public update() {
    if (this.disposed || this.paused) return;

    const dt = Math.min(this.clock.getDelta(), 1 / 30); // cap at 30fps minimum
    this.animFrame++;

    // Hit stop
    if (this.hitStop.active) {
      this.hitStop.timer -= dt;
      if (this.hitStop.timer <= 0) this.hitStop.active = false;
      else {
        this.updateEffects(dt);
        this.render();
        return; // freeze game during hitstop
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
        if (this.phaseTimer <= 0) {
          this.checkMatchEnd();
        }
        break;

      case "match_end":
        // Victory animation
        break;
    }

    // Update display HP (smooth drain)
    this.p1.displayHp += (this.p1.hp - this.p1.displayHp) * 0.1;
    this.p2.displayHp += (this.p2.hp - this.p2.displayHp) * 0.1;

    // Update effects
    this.updateEffects(dt);

    // Update camera
    this.updateCamera(dt);

    // Animate models
    this.animateModels(gameDt);

    // Render
    this.render();
  }

  /* ═══ FIGHTING UPDATE ═══ */
  private updateFighting(dt: number) {
    // Round timer
    this.roundTimer -= dt;
    if (this.roundTimer <= 0) {
      this.roundTimer = 0;
      this.endRound(this.p1.hp >= this.p2.hp ? 1 : 2);
      return;
    }

    // Player 1 input
    this.handlePlayerInput(this.p1, dt);

    // Player 2 AI
    this.updateAI(this.p2, this.p1, dt);

    // Update both fighters
    this.updateFighter(this.p1, dt);
    this.updateFighter(this.p2, dt);

    // Collision between fighters (push apart)
    this.resolveFighterCollision();

    // Stage boundaries
    this.clampToStage(this.p1);
    this.clampToStage(this.p2);

    // Update facing
    this.updateFacing();

    // Health callbacks
    this.callbacks.onHealthChange?.(this.p1.hp, this.p1.maxHp, this.p2.hp, this.p2.maxHp);

    // Check KO
    if (this.p1.hp <= 0) this.endRound(2);
    if (this.p2.hp <= 0) this.endRound(1);
  }

  /* ═══ PLAYER INPUT ═══ */
  private handlePlayerInput(f: Fighter, dt: number) {
    if (this.isInActionState(f)) return;

    const left = this.keys.has("a") || this.keys.has("arrowleft") || this.touchState.left;
    const right = this.keys.has("d") || this.keys.has("arrowright") || this.touchState.right;
    const up = this.keys.has("w") || this.keys.has("arrowup") || this.touchState.up;
    const down = this.keys.has("s") || this.keys.has("arrowdown") || this.touchState.down;
    const punch = this.keys.has("j") || this.keys.has("z") || this.touchState.punch;
    const kick = this.keys.has("k") || this.keys.has("x") || this.touchState.kick;
    const block = this.keys.has("l") || this.keys.has("c") || this.touchState.block;
    const special = this.keys.has(" ") || this.keys.has("v") || this.touchState.special;

    // Block
    if (block) {
      f.state = down ? "block_crouch" : "block_stand";
      f.blockTimer = 0.1;
      return;
    }

    // Special
    if (special && f.specialMeter >= 100) {
      this.startAttack(f, "special");
      f.specialMeter = 0;
      return;
    }

    // Attacks
    if (punch) {
      this.startAttack(f, down ? "punch_heavy" : "punch_light");
      // Clear key to prevent repeat
      this.keys.delete("j"); this.keys.delete("z");
      this.touchState.punch = false;
      return;
    }
    if (kick) {
      this.startAttack(f, down ? "kick_heavy" : "kick_light");
      this.keys.delete("k"); this.keys.delete("x");
      this.touchState.kick = false;
      return;
    }

    // Crouch
    if (down && f.y <= 0) {
      f.state = "crouch";
      f.vx = 0;
      return;
    }

    // Jump
    if (up && f.y <= 0.01) {
      f.vy = JUMP_FORCE;
      f.state = "jump";
      if (left && f.facingRight) f.vx = -WALK_SPEED * 0.7;
      else if (right && !f.facingRight) f.vx = -WALK_SPEED * 0.7;
      else if (right && f.facingRight) f.vx = WALK_SPEED * 0.7;
      else if (left && !f.facingRight) f.vx = WALK_SPEED * 0.7;
      return;
    }

    // Walk
    if (right) {
      f.vx = f.facingRight ? WALK_SPEED : -BACK_SPEED;
      f.state = f.facingRight ? "walk_fwd" : "walk_back";
    } else if (left) {
      f.vx = f.facingRight ? -BACK_SPEED : WALK_SPEED;
      f.state = f.facingRight ? "walk_back" : "walk_fwd";
    } else {
      f.vx = 0;
      f.state = "idle";
    }
  }

  /* ═══ ATTACK SYSTEM ═══ */
  private startAttack(f: Fighter, type: FighterState) {
    f.state = type;
    f.stateTimer = 0;
  }

  private getAttackFrameData(type: FighterState): { startup: number; active: number; recovery: number } {
    switch (type) {
      case "punch_light": return { startup: LIGHT_STARTUP, active: LIGHT_ACTIVE, recovery: LIGHT_RECOVERY };
      case "punch_heavy": return { startup: HEAVY_STARTUP, active: HEAVY_ACTIVE, recovery: HEAVY_RECOVERY };
      case "kick_light": return { startup: LIGHT_STARTUP, active: LIGHT_ACTIVE, recovery: LIGHT_RECOVERY + 2 * FRAME };
      case "kick_heavy": return { startup: HEAVY_STARTUP, active: HEAVY_ACTIVE, recovery: HEAVY_RECOVERY + 2 * FRAME };
      case "special": return { startup: SPECIAL_STARTUP, active: SPECIAL_ACTIVE, recovery: SPECIAL_RECOVERY };
      default: return { startup: 0, active: 0, recovery: 0 };
    }
  }

  private getAttackDamage(type: FighterState, attacker: Fighter): number {
    const statMult = 1 + (attacker.data.attack - 7) * 0.05;
    switch (type) {
      case "punch_light": return DMG_PUNCH_LIGHT * statMult;
      case "punch_heavy": return DMG_PUNCH_HEAVY * statMult;
      case "kick_light": return DMG_KICK_LIGHT * statMult;
      case "kick_heavy": return DMG_KICK_HEAVY * statMult;
      case "special": return (DMG_SPECIAL_BASE + attacker.data.special.damage * 0.3) * statMult;
      default: return 0;
    }
  }

  private getAttackRange(type: FighterState): number {
    switch (type) {
      case "punch_light":
      case "punch_heavy": return PUNCH_RANGE;
      case "kick_light":
      case "kick_heavy": return KICK_RANGE;
      case "special": return SPECIAL_RANGE;
      default: return 0;
    }
  }

  private getHitstun(type: FighterState): number {
    switch (type) {
      case "punch_light":
      case "kick_light": return HITSTUN_LIGHT;
      case "punch_heavy":
      case "kick_heavy": return HITSTUN_HEAVY;
      case "special": return HITSTUN_SPECIAL;
      default: return HITSTUN_LIGHT;
    }
  }

  /* ═══ FIGHTER UPDATE ═══ */
  private updateFighter(f: Fighter, dt: number) {
    // Timers
    f.stateTimer += dt;
    if (f.blockTimer > 0) f.blockTimer -= dt;
    if (f.invincible > 0) f.invincible -= dt;
    if (f.comboTimer > 0) {
      f.comboTimer -= dt;
      if (f.comboTimer <= 0) {
        f.comboCount = 0;
        f.comboDamage = 0;
      }
    }

    // Gravity
    if (f.y > 0.01 || f.vy > 0) {
      f.vy += GRAVITY * dt;
      f.y += f.vy * dt;
      if (f.y <= 0) {
        f.y = 0;
        f.vy = 0;
        if (f.state === "jump") f.state = "idle";
      }
    }

    // Movement
    f.x += f.vx * dt;

    // Attack state machine
    if (this.isAttackState(f.state)) {
      const frameData = this.getAttackFrameData(f.state);
      const totalTime = frameData.startup + frameData.active + frameData.recovery;

      // Check hit during active frames
      if (f.stateTimer >= frameData.startup && f.stateTimer < frameData.startup + frameData.active) {
        const target = f === this.p1 ? this.p2 : this.p1;
        this.checkHit(f, target, f.state);
      }

      // Return to idle after recovery
      if (f.stateTimer >= totalTime) {
        f.state = "idle";
        f.vx = 0;
      }
    }

    // Hitstun / blockstun
    if (f.state === "hitstun") {
      if (f.stateTimer >= this.getHitstun(f.state)) {
        f.state = "idle";
        f.vx = 0;
      }
    }
    if (f.state === "blockstun") {
      if (f.stateTimer >= BLOCKSTUN) {
        f.state = "idle";
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
      if (f.stateTimer >= GETUP_TIME) {
        f.state = "idle";
      }
    }

    // Update 3D model position
    f.model.group.position.x = f.x;
    f.model.group.position.y = f.y;

    // Facing — 2.5D: mirror via scale.x so characters always face camera
    f.model.group.scale.x = f.facingRight ? 1 : -1;
  }

  /* ═══ HIT DETECTION ═══ */
  private checkHit(attacker: Fighter, defender: Fighter, attackType: FighterState) {
    if (defender.invincible > 0) return;
    if (defender.state === "knockdown" || defender.state === "getup") return;

    const dist = Math.abs(attacker.x - defender.x);
    const range = this.getAttackRange(attackType);

    if (dist > range) return;

    // Check if already hit this attack (prevent multi-hit)
    const attackKey = `${attacker === this.p1 ? "p1" : "p2"}_${attackType}_${Math.floor(attacker.stateTimer * 100)}`;
    if ((this as any)._lastHitKey === attackKey) return;
    (this as any)._lastHitKey = attackKey;

    // Is defender blocking?
    const isBlocking = defender.state === "block_stand" || defender.state === "block_crouch";
    const isFacingAttacker = (defender.x < attacker.x && !defender.facingRight) ||
                              (defender.x > attacker.x && defender.facingRight);

    if (isBlocking && isFacingAttacker) {
      // Blocked!
      const chipDmg = this.getAttackDamage(attackType, attacker) * CHIP_DAMAGE_RATIO;
      defender.hp = Math.max(1, defender.hp - chipDmg);
      defender.state = "blockstun";
      defender.stateTimer = 0;
      defender.vx = (defender.x > attacker.x ? 1 : -1) * 1.5;

      this.spawnHitEffect(
        (attacker.x + defender.x) / 2,
        1.2 + (attackType.includes("kick") ? -0.3 : 0),
        0.5,
        "block",
        "#88aaff"
      );
      this.screenShake.intensity = 2;
      this.screenShake.duration = 0.08;
      this.screenShake.timer = 0;
      return;
    }

    // HIT!
    let damage = this.getAttackDamage(attackType, attacker);
    const playerNum = attacker === this.p1 ? 1 : 2;

    // Combo scaling
    if (attacker.comboCount > 0) {
      damage *= Math.pow(COMBO_SCALING, attacker.comboCount);
    }

    // Difficulty damage multiplier (AI deals modified damage)
    if (attacker === this.p2) {
      damage *= DIFFICULTY_SETTINGS[this.difficulty].dmgMult;
    }

    // Defense reduction
    const defMult = 1 - (defender.data.defense - 5) * 0.03;
    damage *= defMult;

    defender.hp = Math.max(0, defender.hp - damage);

    // Combo tracking
    attacker.comboCount++;
    attacker.comboDamage += damage;
    attacker.comboTimer = 0.8;
    if (attacker.comboCount >= 2) {
      this.callbacks.onCombo?.(playerNum as 1 | 2, attacker.comboCount, attacker.comboDamage);
    }

    // Special meter gain
    attacker.specialMeter = Math.min(100, attacker.specialMeter + (attackType === "special" ? 0 : 15));
    defender.specialMeter = Math.min(100, defender.specialMeter + 8);
    if (attacker.specialMeter >= 100) this.callbacks.onSpecialReady?.(playerNum as 1 | 2);

    // Hitstun / knockdown
    const isHeavy = attackType.includes("heavy") || attackType === "special";
    if (isHeavy && defender.y <= 0.01) {
      defender.state = "knockdown";
      defender.stateTimer = 0;
      defender.vy = 4;
      defender.vx = (defender.x > attacker.x ? 1 : -1) * 5;
    } else {
      defender.state = "hitstun";
      defender.stateTimer = 0;
      defender.vx = (defender.x > attacker.x ? 1 : -1) * 3;
    }

    // Effects
    const hitY = 1.2 + (attackType.includes("kick") ? -0.2 : 0.1);
    const effectType = attackType === "special" ? "special" : (isHeavy ? "heavy" : "spark");
    this.spawnHitEffect(
      (attacker.x + defender.x) / 2,
      hitY,
      0.5,
      effectType,
      attacker.config.accentColor
    );

    // Screen effects
    if (attackType === "special") {
      this.hitStop = { active: true, duration: 0.15, timer: 0.15 };
      this.screenShake.intensity = 8;
      this.screenShake.duration = 0.3;
      this.screenShake.timer = 0;
      this.slowMo = { active: true, speed: 0.3, duration: 0.5, timer: 0.5 };
    } else if (isHeavy) {
      this.hitStop = { active: true, duration: 0.08, timer: 0.08 };
      this.screenShake.intensity = 5;
      this.screenShake.duration = 0.15;
      this.screenShake.timer = 0;
    } else {
      this.hitStop = { active: true, duration: 0.04, timer: 0.04 };
      this.screenShake.intensity = 2;
      this.screenShake.duration = 0.08;
      this.screenShake.timer = 0;
    }

    this.callbacks.onHit?.(playerNum as 1 | 2, attackType);
  }

  /* ═══ AI SYSTEM — 4 FIGHTING STYLES ═══ */
  private updateAI(ai: Fighter, player: Fighter, dt: number) {
    if (this.isInActionState(ai) && ai.state !== "idle") return;

    ai.aiTimer -= dt;
    if (ai.aiReactTimer > 0) ai.aiReactTimer -= dt;
    if (ai.aiDodgeCooldown > 0) ai.aiDodgeCooldown -= dt;

    const settings = DIFFICULTY_SETTINGS[this.difficulty];
    const dist = Math.abs(ai.x - player.x);
    const isPlayerAttacking = this.isAttackState(player.state);
    const isPlayerClose = dist < KICK_RANGE;
    const isPlayerMedium = dist < 3;
    const aiHealthRatio = ai.hp / ai.maxHp;
    const playerHealthRatio = player.hp / player.maxHp;

    if (ai.aiTimer > 0) return;

    // React speed based on difficulty
    const reactDelay = (1 - settings.aiReactSpeed) * 0.5;

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

  /* ── AGGRESSIVE AI: Relentless pressure, constant attacks ── */
  private aiAggressive(ai: Fighter, player: Fighter, dist: number, isPlayerAttacking: boolean, isPlayerClose: boolean, settings: any, reactDelay: number, dt: number) {
    // Always close distance
    if (dist > PUNCH_RANGE) {
      ai.vx = ai.facingRight ? WALK_SPEED * 1.1 : -WALK_SPEED * 1.1;
      ai.state = "walk_fwd";
      ai.aiTimer = 0.05;
      return;
    }

    // In range — attack constantly
    if (isPlayerClose) {
      // Block incoming attacks sometimes
      if (isPlayerAttacking && Math.random() < settings.blockRate * 0.5) {
        ai.state = "block_stand";
        ai.blockTimer = 0.15;
        ai.aiTimer = 0.15 + reactDelay;
        return;
      }

      // Special when ready
      if (ai.specialMeter >= 100 && Math.random() < 0.8) {
        this.startAttack(ai, "special");
        ai.aiTimer = 0.5;
        return;
      }

      // Combo chains: light → light → heavy
      if (ai.aiComboStep === 0) {
        this.startAttack(ai, "punch_light");
        ai.aiComboStep = 1;
        ai.aiTimer = LIGHT_STARTUP + LIGHT_ACTIVE + 0.02;
      } else if (ai.aiComboStep === 1) {
        this.startAttack(ai, "kick_light");
        ai.aiComboStep = 2;
        ai.aiTimer = LIGHT_STARTUP + LIGHT_ACTIVE + 0.02;
      } else {
        this.startAttack(ai, Math.random() < 0.5 ? "punch_heavy" : "kick_heavy");
        ai.aiComboStep = 0;
        ai.aiTimer = HEAVY_STARTUP + HEAVY_ACTIVE + HEAVY_RECOVERY + reactDelay;
      }
      return;
    }

    ai.aiTimer = 0.05;
  }

  /* ── DEFENSIVE AI: Blocks, counters, waits for openings ── */
  private aiDefensive(ai: Fighter, player: Fighter, dist: number, isPlayerAttacking: boolean, isPlayerClose: boolean, aiHealthRatio: number, settings: any, reactDelay: number, dt: number) {
    // Block when player attacks
    if (isPlayerAttacking && isPlayerClose) {
      ai.state = player.state.includes("kick") ? "block_crouch" : "block_stand";
      ai.blockTimer = 0.3;
      ai.aiTimer = 0.3 + reactDelay * 0.5;
      return;
    }

    // Counter after blocking
    if (ai.blockTimer > 0 && ai.state.includes("block") && !isPlayerAttacking) {
      // Player finished attacking — counter!
      if (dist < PUNCH_RANGE) {
        this.startAttack(ai, "punch_heavy");
        ai.aiTimer = 0.4;
        return;
      }
    }

    // Keep medium distance
    if (dist < 1.5) {
      ai.vx = ai.facingRight ? -BACK_SPEED : BACK_SPEED;
      ai.state = "walk_back";
      ai.aiTimer = 0.1;
      return;
    }

    if (dist > 3) {
      ai.vx = ai.facingRight ? WALK_SPEED * 0.6 : -WALK_SPEED * 0.6;
      ai.state = "walk_fwd";
      ai.aiTimer = 0.1;
      return;
    }

    // Occasional poke
    if (dist < KICK_RANGE && Math.random() < 0.2 * settings.aiAggression) {
      this.startAttack(ai, "kick_light");
      ai.aiTimer = 0.4 + reactDelay;
      return;
    }

    // Special when safe and ready
    if (ai.specialMeter >= 100 && dist < SPECIAL_RANGE && !isPlayerAttacking) {
      this.startAttack(ai, "special");
      ai.aiTimer = 0.5;
      return;
    }

    ai.state = "idle";
    ai.vx = 0;
    ai.aiTimer = 0.15 + reactDelay;
  }

  /* ── EVASIVE AI: Dodges, hit-and-run, uses speed ── */
  private aiEvasive(ai: Fighter, player: Fighter, dist: number, isPlayerAttacking: boolean, isPlayerClose: boolean, settings: any, reactDelay: number, dt: number) {
    // Dodge incoming attacks
    if (isPlayerAttacking && isPlayerClose && ai.aiDodgeCooldown <= 0) {
      // Jump back
      if (ai.y <= 0.01) {
        ai.vy = JUMP_FORCE * 0.8;
        ai.vx = ai.facingRight ? -DASH_SPEED : DASH_SPEED;
        ai.state = "jump";
        ai.aiDodgeCooldown = 0.8;
        ai.aiTimer = 0.4;
        return;
      }
    }

    // Hit and run — dash in, attack, dash out
    if (dist > KICK_RANGE * 1.5) {
      // Approach
      ai.vx = ai.facingRight ? WALK_SPEED * 1.2 : -WALK_SPEED * 1.2;
      ai.state = "walk_fwd";
      ai.aiTimer = 0.08;
      return;
    }

    if (isPlayerClose && !isPlayerAttacking) {
      // Quick attack then retreat
      this.startAttack(ai, Math.random() < 0.6 ? "punch_light" : "kick_light");
      ai.aiTimer = LIGHT_STARTUP + LIGHT_ACTIVE + 0.05;
      // Queue retreat
      ai.aiPressureTimer = -1; // signal to retreat next cycle
      return;
    }

    if (ai.aiPressureTimer < 0) {
      // Retreat after attack
      ai.vx = ai.facingRight ? -DASH_SPEED * 0.8 : DASH_SPEED * 0.8;
      ai.state = "walk_back";
      ai.aiPressureTimer = 0;
      ai.aiTimer = 0.3;
      return;
    }

    // Special from distance
    if (ai.specialMeter >= 100 && dist < SPECIAL_RANGE) {
      this.startAttack(ai, "special");
      ai.aiTimer = 0.5;
      return;
    }

    // Circle / maintain distance
    ai.state = "idle";
    ai.vx = 0;
    ai.aiTimer = 0.1 + reactDelay;
  }

  /* ── BALANCED AI: Adapts to situation ── */
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

    // Normal play — mix of approaches
    if (isPlayerAttacking && isPlayerClose) {
      // 50% block, 50% dodge
      if (Math.random() < 0.5) {
        ai.state = "block_stand";
        ai.blockTimer = 0.2;
        ai.aiTimer = 0.2 + reactDelay;
      } else if (ai.y <= 0.01) {
        ai.vy = JUMP_FORCE * 0.7;
        ai.vx = ai.facingRight ? -BACK_SPEED * 2 : BACK_SPEED * 2;
        ai.state = "jump";
        ai.aiTimer = 0.4;
      }
      return;
    }

    // Approach
    if (dist > PUNCH_RANGE * 1.3) {
      ai.vx = ai.facingRight ? WALK_SPEED : -WALK_SPEED;
      ai.state = "walk_fwd";
      ai.aiTimer = 0.08;
      return;
    }

    // In range — varied attacks
    if (isPlayerClose) {
      const roll = Math.random();
      if (ai.specialMeter >= 100 && roll < 0.3) {
        this.startAttack(ai, "special");
        ai.aiTimer = 0.5;
      } else if (roll < 0.5) {
        this.startAttack(ai, "punch_light");
        ai.aiComboStep = 1;
        ai.aiTimer = LIGHT_STARTUP + LIGHT_ACTIVE + 0.03;
      } else if (roll < 0.7) {
        this.startAttack(ai, "kick_heavy");
        ai.aiTimer = HEAVY_STARTUP + HEAVY_ACTIVE + HEAVY_RECOVERY * 0.5;
      } else {
        // Feint — walk back then attack
        ai.vx = ai.facingRight ? -BACK_SPEED : BACK_SPEED;
        ai.state = "walk_back";
        ai.aiTimer = 0.15;
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

  /* ═══ HELPER METHODS ═══ */
  private isAttackState(state: FighterState): boolean {
    return ["punch_light", "punch_heavy", "kick_light", "kick_heavy", "special"].includes(state);
  }

  private isInActionState(f: Fighter): boolean {
    return ["hitstun", "blockstun", "knockdown", "getup", "ko"].includes(f.state) ||
           this.isAttackState(f.state);
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

    // Dramatic slow-mo
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

    // Next round
    this.currentRound++;
    this.resetRound();
  }

  private resetRound() {
    this.p1.x = -0.6;
    this.p2.x = 0.6;
    this.p1.y = 0; this.p2.y = 0;
    this.p1.vx = 0; this.p2.vx = 0;
    this.p1.vy = 0; this.p2.vy = 0;
    this.p1.hp = this.p1.maxHp;
    this.p2.hp = this.p2.maxHp;
    this.p1.displayHp = this.p1.maxHp;
    this.p2.displayHp = this.p2.maxHp;
    this.p1.state = "idle"; this.p2.state = "idle";
    this.p1.specialMeter = 0; this.p2.specialMeter = 0;
    this.p1.comboCount = 0; this.p2.comboCount = 0;
    this.roundTimer = 99;

    this.phase = "round_announce";
    this.phaseTimer = 2.0;
    this.callbacks.onPhaseChange?.("round_announce");
  }

  /* ═══ HIT EFFECTS ═══ */
  private spawnHitEffect(x: number, y: number, z: number, type: HitEffect["type"], color: string) {
    const group = new THREE.Group();
    const particleCount = type === "special" ? 20 : type === "heavy" ? 12 : 6;
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 1,
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
    const flashGeo = new THREE.SphereGeometry(type === "special" ? 0.5 : 0.3, 8, 8);
    const flashMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.8,
    });
    const flash = new THREE.Mesh(flashGeo, flashMat);
    flash.name = "flash";
    group.add(flash);

    group.position.set(x, y, z);
    this.scene.add(group);

    this.hitEffects.push({
      x, y, z,
      life: 0, maxLife: type === "special" ? 0.6 : 0.4,
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

      // Update particles
      effect.particles.children.forEach((child) => {
        if (child.name === "flash") {
          const scale = 1 + progress * 2;
          child.scale.set(scale, scale, scale);
          ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = (1 - progress) * 0.8;
          return;
        }
        child.position.x += (child.userData.vx || 0) * dt;
        child.position.y += (child.userData.vy || 0) * dt;
        child.position.z += (child.userData.vz || 0) * dt;
        child.userData.vy -= 10 * dt; // gravity on particles
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 1 - progress;
        child.scale.multiplyScalar(0.97);
      });
    }
  }

  /* ═══ SPRITE-BASED ANIMATION ═══ */
  private animateModels(dt: number) {
    this.animateSprite(this.p1, dt);
    this.animateSprite(this.p2, dt);
  }

  private animateSprite(f: Fighter, dt: number) {
    const t = this.animFrame * 0.05;
    const sprite = f.model.sprite;
    const mat = f.model.spriteMaterial;
    const glowMat = f.model.glowMaterial;
    const h = f.config.height * 0.95; // sprite height (matches buildCharacterModel)
    const baseY = h / 2 - 0.1; // default sprite center Y (lowered so feet touch floor)

    // Update shader time
    mat.uniforms.uTime.value = t;
    glowMat.uniforms.uTime.value = t;

    // Reset sprite transforms
    sprite.position.y = baseY;
    sprite.position.z = 0;
    sprite.rotation.set(0, 0, 0);
    sprite.scale.set(1, 1, 1);
    mat.uniforms.uHitFlash.value = 0;
    mat.uniforms.uSpecialGlow.value = 0;
    mat.uniforms.uBlockTint.value = 0;
    mat.uniforms.uOpacity.value = 1.0;
    glowMat.uniforms.uGlowIntensity.value = 0.5;

    // Also sync glow sprite
    const glowSprite = f.model.glowSprite;

    switch (f.state) {
      case "idle": {
        // Breathing bob + subtle scale pulse
        const bob = Math.sin(t * 2.5) * 0.025;
        const breathe = 1.0 + Math.sin(t * 2.5) * 0.008;
        sprite.position.y = baseY + bob;
        sprite.scale.set(breathe, 1.0 + Math.sin(t * 2.5) * 0.005, 1);
        glowMat.uniforms.uGlowIntensity.value = 0.4 + Math.sin(t * 1.5) * 0.15;
        break;
      }

      case "walk_fwd": {
        // Lean forward + bob + slight tilt
        const walkBob = Math.abs(Math.sin(t * 5)) * 0.03;
        sprite.position.y = baseY + walkBob;
        sprite.rotation.z = -0.03; // lean forward
        sprite.position.z = 0.05; // slight forward
        break;
      }

      case "walk_back": {
        // Lean backward + bob
        const walkBob = Math.abs(Math.sin(t * 5)) * 0.03;
        sprite.position.y = baseY + walkBob;
        sprite.rotation.z = 0.03; // lean back
        sprite.position.z = -0.05;
        break;
      }

      case "punch_light": {
        const frameData = this.getAttackFrameData("punch_light");
        const total = frameData.startup + frameData.active + frameData.recovery;
        if (f.stateTimer < frameData.startup) {
          // Wind up — pull back
          const prog = f.stateTimer / frameData.startup;
          sprite.position.z = -0.08 * prog;
          sprite.scale.set(1.02, 0.98, 1); // squash
          sprite.rotation.z = 0.02;
        } else if (f.stateTimer < frameData.startup + frameData.active) {
          // Strike — lunge forward
          const prog = (f.stateTimer - frameData.startup) / frameData.active;
          sprite.position.z = 0.15;
          sprite.scale.set(0.95, 1.04, 1); // stretch
          sprite.rotation.z = -0.04;
          mat.uniforms.uHitFlash.value = 0.15; // slight flash on strike
        } else {
          // Recovery
          const recProg = (f.stateTimer - frameData.startup - frameData.active) / frameData.recovery;
          sprite.position.z = 0.15 * (1 - recProg);
          sprite.scale.set(1 - 0.05 * (1 - recProg), 1 + 0.04 * (1 - recProg), 1);
        }
        break;
      }

      case "punch_heavy": {
        const frameData = this.getAttackFrameData("punch_heavy");
        if (f.stateTimer < frameData.startup) {
          const prog = f.stateTimer / frameData.startup;
          sprite.position.z = -0.12 * prog;
          sprite.scale.set(1.05, 0.95, 1); // bigger squash
          sprite.rotation.z = 0.05;
          // Power charge glow
          mat.uniforms.uSpecialGlow.value = prog * 0.3;
        } else if (f.stateTimer < frameData.startup + frameData.active) {
          // Big lunge
          sprite.position.z = 0.25;
          sprite.scale.set(0.9, 1.08, 1); // big stretch
          sprite.rotation.z = -0.06;
          mat.uniforms.uHitFlash.value = 0.25;
        } else {
          const recProg = (f.stateTimer - frameData.startup - frameData.active) / frameData.recovery;
          sprite.position.z = 0.25 * (1 - recProg);
          sprite.scale.set(1 - 0.1 * (1 - recProg), 1 + 0.08 * (1 - recProg), 1);
        }
        break;
      }

      case "kick_light": {
        const frameData = this.getAttackFrameData("kick_light");
        if (f.stateTimer < frameData.startup) {
          const prog = f.stateTimer / frameData.startup;
          sprite.position.y = baseY + 0.05 * prog;
          sprite.rotation.z = 0.03 * prog;
        } else if (f.stateTimer < frameData.startup + frameData.active) {
          sprite.position.z = 0.12;
          sprite.position.y = baseY + 0.08;
          sprite.rotation.z = -0.08; // kick lean
          sprite.scale.set(0.96, 1.03, 1);
          mat.uniforms.uHitFlash.value = 0.12;
        } else {
          const recProg = (f.stateTimer - frameData.startup - frameData.active) / frameData.recovery;
          sprite.position.z = 0.12 * (1 - recProg);
          sprite.position.y = baseY + 0.08 * (1 - recProg);
          sprite.rotation.z = -0.08 * (1 - recProg);
        }
        break;
      }

      case "kick_heavy": {
        const frameData = this.getAttackFrameData("kick_heavy");
        if (f.stateTimer < frameData.startup) {
          const prog = f.stateTimer / frameData.startup;
          sprite.position.y = baseY + 0.1 * prog;
          sprite.rotation.z = 0.06 * prog;
          sprite.scale.set(1.03, 0.97, 1);
        } else if (f.stateTimer < frameData.startup + frameData.active) {
          sprite.position.z = 0.2;
          sprite.position.y = baseY + 0.15;
          sprite.rotation.z = -0.12; // big kick lean
          sprite.scale.set(0.92, 1.06, 1);
          mat.uniforms.uHitFlash.value = 0.2;
        } else {
          const recProg = (f.stateTimer - frameData.startup - frameData.active) / frameData.recovery;
          sprite.position.z = 0.2 * (1 - recProg);
          sprite.position.y = baseY + 0.15 * (1 - recProg);
          sprite.rotation.z = -0.12 * (1 - recProg);
        }
        break;
      }

      case "block_stand":
      case "block_crouch": {
        // Defensive tint + slight shrink
        mat.uniforms.uBlockTint.value = 0.5;
        sprite.scale.set(0.95, f.state === "block_crouch" ? 0.85 : 0.97, 1);
        if (f.state === "block_crouch") {
          sprite.position.y = baseY - 0.15;
        }
        glowMat.uniforms.uGlowIntensity.value = 1.2; // bright shield glow
        // Pulse
        const blockPulse = Math.sin(t * 8) * 0.02;
        sprite.scale.x += blockPulse;
        sprite.scale.y += blockPulse;
        break;
      }

      case "special": {
        const frameData = this.getAttackFrameData("special");
        if (f.stateTimer < frameData.startup) {
          // Power up — intense glow + scale pulse
          const prog = f.stateTimer / frameData.startup;
          const pulse = Math.sin(f.stateTimer * 25) * 0.03;
          sprite.scale.set(1.05 + pulse, 1.05 + pulse, 1);
          mat.uniforms.uSpecialGlow.value = prog * 0.8;
          glowMat.uniforms.uGlowIntensity.value = 1.5 + prog * 2;
          sprite.position.y = baseY + pulse * 2;
        } else if (f.stateTimer < frameData.startup + frameData.active) {
          // Release — big lunge + flash
          sprite.position.z = 0.3;
          sprite.scale.set(0.88, 1.1, 1);
          mat.uniforms.uSpecialGlow.value = 1.0;
          mat.uniforms.uHitFlash.value = 0.3;
          glowMat.uniforms.uGlowIntensity.value = 3.0;
        } else {
          const recProg = (f.stateTimer - frameData.startup - frameData.active) / frameData.recovery;
          sprite.position.z = 0.3 * (1 - recProg);
          mat.uniforms.uSpecialGlow.value = 1.0 * (1 - recProg);
          glowMat.uniforms.uGlowIntensity.value = 3.0 * (1 - recProg) + 0.5;
        }
        break;
      }

      case "hitstun": {
        // Knockback shake + red flash
        const hitProg = Math.min(f.stateTimer / 0.15, 1);
        const shake = Math.sin(hitProg * Math.PI * 6) * 0.04 * (1 - hitProg);
        sprite.position.z = -0.08 * (1 - hitProg);
        sprite.rotation.z = shake;
        sprite.scale.set(1.03, 0.97, 1); // squash on hit
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

      case "knockdown": {
        // Fall backward + fade
        const knockProg = Math.min(f.stateTimer / 0.5, 1);
        sprite.rotation.z = knockProg * 1.2; // rotate to ground
        sprite.position.y = baseY * (1 - knockProg * 0.6); // drop
        sprite.scale.set(1 + knockProg * 0.1, 1 - knockProg * 0.2, 1);
        mat.uniforms.uHitFlash.value = 0.3 * (1 - knockProg);
        mat.uniforms.uOpacity.value = 1.0 - knockProg * 0.15;
        break;
      }

      case "getup": {
        // Rise back up
        const getProg = Math.min(f.stateTimer / 0.4, 1);
        sprite.rotation.z = 1.2 * (1 - getProg);
        sprite.position.y = baseY * (0.4 + getProg * 0.6);
        // Invincibility flash
        mat.uniforms.uOpacity.value = 0.7 + Math.sin(t * 20) * 0.3;
        break;
      }

      case "victory": {
        // Triumphant bounce + glow
        const victBob = Math.sin(t * 3) * 0.05;
        sprite.position.y = baseY + 0.05 + victBob;
        sprite.scale.set(1.03, 1.03, 1);
        mat.uniforms.uSpecialGlow.value = 0.3 + Math.sin(t * 2) * 0.15;
        glowMat.uniforms.uGlowIntensity.value = 1.5;
        break;
      }

      case "ko": {
        // Collapsed on ground
        sprite.rotation.z = Math.PI / 2.5;
        sprite.position.y = baseY * 0.35;
        sprite.scale.set(1.05, 0.85, 1);
        mat.uniforms.uOpacity.value = 0.7;
        glowMat.uniforms.uGlowIntensity.value = 0.1;
        break;
      }

      case "crouch": {
        sprite.scale.set(1.05, 0.8, 1); // squash down
        sprite.position.y = baseY - 0.2;
        break;
      }

      case "jump": {
        // Stretch upward
        sprite.scale.set(0.95, 1.06, 1);
        // Arms up feel
        sprite.rotation.z = f.vx > 0 ? -0.05 : f.vx < 0 ? 0.05 : 0;
        break;
      }
    }

    // Sync glow sprite position/rotation/scale with main sprite
    glowSprite.position.copy(sprite.position);
    glowSprite.position.z = sprite.position.z - 0.01;
    glowSprite.rotation.copy(sprite.rotation);
    glowSprite.scale.copy(sprite.scale);

    // Animate energy particles
    if (f.model.energyParticles) {
      f.model.energyParticles.children.forEach((p) => {
        const ud = p.userData;
        ud.angle += ud.speed * dt;
        p.position.x = Math.cos(ud.angle) * ud.radius;
        p.position.z = Math.sin(ud.angle) * ud.radius * 0.3;
        p.position.y = ud.yBase + Math.sin(ud.angle * 2) * 0.1;
        // Pulse opacity based on state
        const mesh = p as THREE.Mesh;
        const pMat = mesh.material as THREE.MeshBasicMaterial;
        if (f.state === "special") {
          pMat.opacity = 0.9;
          ud.radius = 0.6 + Math.sin(t * 5) * 0.2;
        } else if (f.state === "idle") {
          pMat.opacity = 0.3 + Math.sin(t + ud.angle) * 0.2;
        } else {
          pMat.opacity = 0.4;
        }
      });
    }

    // Animate ground shadow
    if (f.model.groundShadow) {
      const shadowMat = f.model.groundShadow.material as THREE.MeshBasicMaterial;
      if (f.state === "jump") {
        // Shadow shrinks when jumping
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
  private updateCamera(dt: number) {
    // Follow midpoint between fighters
    const midX = (this.p1.x + this.p2.x) / 2;
    const dist = Math.abs(this.p1.x - this.p2.x);
    const targetZ = 3.0 + dist * 0.25; // zoom out when fighters are far apart

    this.cameraTarget.x += (midX - this.cameraTarget.x) * 0.15; // fast camera tracking
    this.cameraTarget.z = targetZ;

    this.camera.position.x = this.cameraTarget.x + this.cameraShakeOffset.x;
    this.camera.position.y = 1.0 + this.cameraShakeOffset.y;
    this.camera.position.z = this.cameraTarget.z;
    this.camera.lookAt(this.cameraTarget.x, 0.7, 0);
  }

  /* ═══ RENDER ═══ */
  private render() {
    // Pulse stage lights
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
        color: this.p1.config.accentColor,
        image: this.p1.data.image,
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
        color: this.p2.config.accentColor,
        image: this.p2.data.image,
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

    // Dispose Three.js resources
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

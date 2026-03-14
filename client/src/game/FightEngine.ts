/* ═══════════════════════════════════════════════════════
   FALL OF REALITY — 2D Fighting Game Engine v2.0
   MK-style combat with procedural sprites, intelligent AI,
   and mobile touch controls
   ═══════════════════════════════════════════════════════ */
import { type FighterData, type ArenaData, type DifficultyLevel } from "./gameData";
import { getOrGenerateSprite, type CharacterSprite, type AnimState } from "./SpriteGenerator";

/* ─── TYPES ─── */
export type FighterState =
  | "idle" | "walk_fwd" | "walk_back" | "crouch"
  | "jump" | "jump_fwd" | "jump_back"
  | "punch" | "kick" | "uppercut" | "sweep"
  | "jump_punch" | "jump_kick"
  | "special" | "block_stand" | "block_crouch"
  | "hit_high" | "hit_low" | "hit_air" | "knockdown"
  | "getup" | "ko" | "victory" | "taunt";

export interface Fighter {
  data: FighterData;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  facing: 1 | -1;
  state: FighterState;
  prevState: FighterState;
  stateTimer: number;
  animFrame: number;
  animTimer: number;
  specialCooldown: number;
  specialReady: boolean;
  specialMeter: number; // 0-100 builds from hits
  comboCount: number;
  comboTimer: number;
  comboDamage: number;
  blockTimer: number;
  hitStun: number;
  isBlocking: boolean;
  isCrouching: boolean;
  isAirborne: boolean;
  canAct: boolean;
  knockdownTimer: number;
  sprite: CharacterSprite | null;
  imgLoaded: boolean;
  img: HTMLImageElement | null;
  // Combo input buffer
  inputBuffer: string[];
  inputBufferTimer: number;
}

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  owner: "p1" | "p2";
  damage: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  type: "fireball" | "beam" | "wave" | "orb";
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: "hit" | "special" | "spark" | "ko" | "blood" | "dust" | "flash";
}

export interface HitBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GameState {
  phase: "intro" | "round_intro" | "fighting" | "hit_pause" | "round_end" | "match_end";
  round: number;
  maxRounds: 3;
  p1Wins: number;
  p2Wins: number;
  timer: number;
  maxTimer: number;
  phaseTimer: number;
  hitPauseTimer: number;
  winner: "p1" | "p2" | null;
  perfectWin: boolean;
  announceText: string;
  announceTimer: number;
  announceColor: string;
  comboText: string;
  comboTextTimer: number;
  screenShake: number;
  screenShakeX: number;
  screenShakeY: number;
  slowMotion: number;
  flashTimer: number;
  flashColor: string;
}

/* ─── COLOR UTILS ─── */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

function lightenHex(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

function darkenHex(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

/* ─── CONSTANTS ─── */
const GROUND_Y_RATIO = 0.82;
const ROUND_TIME = 99;

// These are now computed dynamically in the engine based on canvas size
// Reference values for a 800px tall canvas:
const REF_H = 800;
const REF_GRAVITY = 0.65;
const REF_WALK_SPEED = 4.5;
const REF_BACK_SPEED = 2.8;
const REF_JUMP_FORCE = -14;
const REF_JUMP_FWD_VX = 4.5;
const REF_FIGHTER_W = 110;
const REF_FIGHTER_H = 165;
const REF_SPRITE_SCALE = 2.6;

// Attack frame data: [startup, active, recovery, damage, hitstun, blockstun, knockback]
const ATTACK_DATA: Record<string, [number, number, number, number, number, number, number]> = {
  punch:      [4,  3, 6,  8,  12, 6,  3],
  kick:       [6,  3, 8,  12, 14, 8,  5],
  uppercut:   [8,  4, 14, 18, 20, 10, 8],
  sweep:      [10, 3, 16, 14, 0,  0,  0],  // sweep causes knockdown
  jump_punch: [3,  4, 5,  10, 12, 6,  4],
  jump_kick:  [4,  5, 6,  14, 16, 8,  6],
  special:    [12, 6, 20, 0,  24, 12, 10], // damage comes from fighter data
};

// Hitbox offsets relative to fighter center [xOff, yOff, w, h]
const HITBOX_DATA: Record<string, [number, number, number, number]> = {
  punch:      [40, -20, 50, 30],
  kick:       [35, 10,  60, 35],
  uppercut:   [30, -40, 45, 60],
  sweep:      [20, 30,  70, 25],
  jump_punch: [35, -10, 50, 30],
  jump_kick:  [30, 0,   60, 40],
  special:    [30, -10, 80, 50],
};

export class FightEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  groundY: number;

  // Dynamic scaling — computed from canvas height
  scaleFactor: number;
  DRAW_W: number;
  DRAW_H: number;
  SPRITE_SCALE: number;
  FIGHTER_W: number;
  FIGHTER_H: number;
  GRAVITY: number;
  WALK_SPEED: number;
  BACK_SPEED: number;
  JUMP_FORCE: number;
  JUMP_FWD_VX: number;

  p1: Fighter;
  p2: Fighter;
  arena: ArenaData;
  difficulty: DifficultyLevel;
  particles: Particle[] = [];
  projectiles: Projectile[] = [];
  gameState: GameState;

  keys: Set<string> = new Set();
  touchState = {
    left: false, right: false, up: false, down: false,
    punch: false, kick: false, special: false, block: false,
  };
  animFrame: number = 0;
  frameCount: number = 0;
  lastTime: number = 0;
  running: boolean = false;
  timerInterval: number = 0;

  // AI state machine
  aiState: "neutral" | "pressure" | "defense" | "punish" | "zoning" | "wakeup" = "neutral";
  aiTimer: number = 0;
  aiDecisionCooldown: number = 0;
  aiComboStep: number = 0;
  aiTargetX: number = 0;
  aiPatience: number = 0; // How long AI waits before attacking

  // Sprite generator
  // Sprite generation uses module-level functions

  // Callbacks
  onRoundEnd?: (winner: "p1" | "p2") => void;
  onMatchEnd?: (winner: "p1" | "p2", perfect: boolean) => void;

  // Background cache
  bgStars: { x: number; y: number; size: number; brightness: number; speed: number }[] = [];
  bgBuildings: { x: number; w: number; h: number; color: string; windows: boolean }[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    p1Data: FighterData,
    p2Data: FighterData,
    arena: ArenaData,
    difficulty: DifficultyLevel
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.width = canvas.width;
    this.height = canvas.height;
    this.groundY = this.height * GROUND_Y_RATIO;
    this.arena = arena;
    this.difficulty = difficulty;

    // Compute dynamic scaling based on canvas height
    this.scaleFactor = this.height / REF_H;
    this.SPRITE_SCALE = REF_SPRITE_SCALE * this.scaleFactor;
    this.FIGHTER_W = Math.round(REF_FIGHTER_W * this.scaleFactor);
    this.FIGHTER_H = Math.round(REF_FIGHTER_H * this.scaleFactor);
    this.DRAW_W = Math.round(this.FIGHTER_W * REF_SPRITE_SCALE);
    this.DRAW_H = Math.round(this.FIGHTER_H * REF_SPRITE_SCALE);
    this.GRAVITY = REF_GRAVITY * this.scaleFactor;
    this.WALK_SPEED = REF_WALK_SPEED * this.scaleFactor;
    this.BACK_SPEED = REF_BACK_SPEED * this.scaleFactor;
    this.JUMP_FORCE = REF_JUMP_FORCE * this.scaleFactor;
    this.JUMP_FWD_VX = REF_JUMP_FWD_VX * this.scaleFactor;
    // Sprites generated via getOrGenerateSprite()

    this.p1 = this.createFighter(p1Data, this.width * 0.25, 1);
    this.p2 = this.createFighter(p2Data, this.width * 0.75, -1);

    this.gameState = {
      phase: "intro",
      round: 1,
      maxRounds: 3,
      p1Wins: 0,
      p2Wins: 0,
      timer: ROUND_TIME,
      maxTimer: ROUND_TIME,
      phaseTimer: 150,
      hitPauseTimer: 0,
      winner: null,
      perfectWin: true,
      announceText: "",
      announceTimer: 0,
      announceColor: "#ffffff",
      comboText: "",
      comboTextTimer: 0,
      screenShake: 0,
      screenShakeX: 0,
      screenShakeY: 0,
      slowMotion: 0,
      flashTimer: 0,
      flashColor: "#ffffff",
    };

    this.generateBackground();
    this.loadAssets();
  }

  createFighter(data: FighterData, x: number, facing: 1 | -1): Fighter {
    return {
      data,
      x,
      y: 0, // will be set in start
      vx: 0,
      vy: 0,
      hp: data.hp,
      maxHp: data.hp,
      facing,
      state: "idle",
      prevState: "idle",
      stateTimer: 0,
      animFrame: 0,
      animTimer: 0,
      specialCooldown: 0,
      specialReady: true,
      specialMeter: 0,
      comboCount: 0,
      comboTimer: 0,
      comboDamage: 0,
      blockTimer: 0,
      hitStun: 0,
      isBlocking: false,
      isCrouching: false,
      isAirborne: false,
      canAct: true,
      knockdownTimer: 0,
      sprite: null,
      imgLoaded: false,
      img: null,
      inputBuffer: [],
      inputBufferTimer: 0,
    };
  }

  generateBackground() {
    // Stars
    this.bgStars = [];
    for (let i = 0; i < 120; i++) {
      this.bgStars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.groundY * 0.7,
        size: Math.random() * 2.5 + 0.3,
        brightness: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
      });
    }
    // Cityscape silhouette buildings
    this.bgBuildings = [];
    let bx = 0;
    while (bx < this.width + 60) {
      const bw = 30 + Math.random() * 60;
      const bh = 40 + Math.random() * (this.groundY * 0.4);
      this.bgBuildings.push({
        x: bx,
        w: bw,
        h: bh,
        color: `rgba(${10 + Math.random() * 20},${10 + Math.random() * 15},${30 + Math.random() * 30},0.7)`,
        windows: Math.random() > 0.3,
      });
      bx += bw + Math.random() * 10;
    }
  }

  loadAssets() {
    // Generate sprite sheets for both fighters
    [this.p1, this.p2].forEach((f) => {
      try {
        f.sprite = getOrGenerateSprite(f.data.id);
        console.log(`[FightEngine] Sprite for ${f.data.id}:`, f.sprite ? `OK (${Object.keys(f.sprite.animations).length} anims)` : 'NULL');
      } catch (e) {
        console.error(`[FightEngine] Sprite generation failed for ${f.data.id}:`, e);
        f.sprite = null;
      }
      // Also load portrait image for HUD
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => { f.img = img; f.imgLoaded = true; };
      img.onerror = () => { f.imgLoaded = false; };
      img.src = f.data.image;
    });
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.groundY = this.height * GROUND_Y_RATIO;

    // Position fighters on ground
    this.p1.y = this.groundY - this.DRAW_H;
    this.p2.y = this.groundY - this.DRAW_H;

    this.gameState.phase = "intro";
    this.gameState.phaseTimer = 150;
    this.announce("ROUND 1", "#ffffff", 90);

    // Timer countdown
    this.timerInterval = window.setInterval(() => {
      if (this.gameState.phase === "fighting" && this.gameState.timer > 0) {
        this.gameState.timer--;
        if (this.gameState.timer <= 0) this.endRound();
      }
    }, 1000);

    this.loop();
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.animFrame);
    clearInterval(this.timerInterval);
  }

  loop = () => {
    if (!this.running) return;
    const slowFactor = this.gameState.slowMotion > 0 ? 0.3 : 1;
    if (slowFactor < 1 && this.frameCount % 3 !== 0) {
      this.gameState.slowMotion--;
      this.render();
      this.animFrame = requestAnimationFrame(this.loop);
      return;
    }
    this.update();
    this.render();
    this.frameCount++;
    if (this.gameState.slowMotion > 0) this.gameState.slowMotion--;
    this.animFrame = requestAnimationFrame(this.loop);
  };

  /* ─── INPUT ─── */
  handleKeyDown = (e: KeyboardEvent) => {
    this.keys.add(e.key.toLowerCase());
    // Match end continue
    if (this.gameState.phase === "match_end" && e.key === "Enter") {
      this.gameState.phaseTimer = 0;
    }
    e.preventDefault();
  };

  handleKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.key.toLowerCase());
    e.preventDefault();
  };

  // Mobile touch input
  setTouchInput(input: keyof typeof this.touchState, active: boolean) {
    this.touchState[input] = active;
  }

  /* ─── ANNOUNCE ─── */
  announce(text: string, color: string, duration: number) {
    this.gameState.announceText = text;
    this.gameState.announceColor = color;
    this.gameState.announceTimer = duration;
  }

  showCombo(fighter: Fighter) {
    if (fighter.comboCount >= 2) {
      const labels = ["", "", "DOUBLE", "TRIPLE", "QUAD", "ULTRA", "MEGA", "INSANE", "GODLIKE"];
      const label = labels[Math.min(fighter.comboCount, labels.length - 1)] || `${fighter.comboCount}x`;
      this.gameState.comboText = `${label} COMBO! ${fighter.comboDamage} DMG`;
      this.gameState.comboTextTimer = 60;
    }
  }

  /* ─── UPDATE ─── */
  update() {
    const gs = this.gameState;

    // Screen shake decay
    if (gs.screenShake > 0) {
      gs.screenShakeX = (Math.random() - 0.5) * gs.screenShake;
      gs.screenShakeY = (Math.random() - 0.5) * gs.screenShake;
      gs.screenShake *= 0.85;
      if (gs.screenShake < 0.5) gs.screenShake = 0;
    }

    // Announce timer
    if (gs.announceTimer > 0) gs.announceTimer--;
    if (gs.comboTextTimer > 0) gs.comboTextTimer--;
    if (gs.flashTimer > 0) gs.flashTimer--;

    // Hit pause
    if (gs.hitPauseTimer > 0) {
      gs.hitPauseTimer--;
      return;
    }

    if (gs.phase === "intro") {
      gs.phaseTimer--;
      if (gs.phaseTimer <= 60) {
        this.announce("FIGHT!", this.arena.ambientColor, 50);
      }
      if (gs.phaseTimer <= 0) {
        gs.phase = "fighting";
        gs.timer = ROUND_TIME;
      }
      return;
    }

    if (gs.phase === "round_intro") {
      gs.phaseTimer--;
      if (gs.phaseTimer <= 40) {
        this.announce("FIGHT!", this.arena.ambientColor, 40);
      }
      if (gs.phaseTimer <= 0) {
        gs.phase = "fighting";
        gs.timer = ROUND_TIME;
      }
      return;
    }

    if (gs.phase === "round_end" || gs.phase === "match_end") {
      gs.phaseTimer--;
      this.updateParticles();
      this.updateAnimations(this.p1);
      this.updateAnimations(this.p2);
      if (gs.phase === "round_end" && gs.phaseTimer <= 0) {
        this.startNewRound();
      }
      return;
    }

    // Fighting phase
    this.handlePlayerInput();
    this.handleAI();
    this.updateFighter(this.p1);
    this.updateFighter(this.p2);
    this.updateProjectiles();
    this.checkCollisions();
    this.updateParticles();
    this.updateAnimations(this.p1);
    this.updateAnimations(this.p2);
  }

  /* ─── PLAYER INPUT ─── */
  handlePlayerInput() {
    const f = this.p1;
    if (!f.canAct || f.state === "ko" || f.state === "knockdown" || f.state === "getup") return;

    const inAttack = this.isAttackState(f.state);
    if (inAttack && f.stateTimer > 0) return;

    // Read input (keyboard + touch)
    const left = this.keys.has("a") || this.keys.has("arrowleft") || this.touchState.left;
    const right = this.keys.has("d") || this.keys.has("arrowright") || this.touchState.right;
    const up = this.keys.has("w") || this.keys.has("arrowup") || this.touchState.up;
    const down = this.keys.has("s") || this.keys.has("arrowdown") || this.touchState.down;
    const btnPunch = this.keys.has("j") || this.keys.has("z") || this.touchState.punch;
    const btnKick = this.keys.has("k") || this.keys.has("x") || this.touchState.kick;
    const btnSpecial = this.keys.has("l") || this.keys.has("c") || this.touchState.special;
    const btnBlock = this.keys.has("shift") || this.touchState.block;

    // Block
    if (btnBlock || (f.facing === 1 && left && !right) || (f.facing === -1 && right && !left)) {
      if (down) {
        this.setState(f, "block_crouch");
        f.isBlocking = true;
        f.isCrouching = true;
      } else if (btnBlock) {
        this.setState(f, "block_stand");
        f.isBlocking = true;
        f.isCrouching = false;
      }
    } else {
      f.isBlocking = false;
    }

    if (f.isBlocking) return;

    // Crouch
    if (down && !f.isAirborne) {
      f.isCrouching = true;
      if (btnPunch) {
        this.setState(f, "uppercut");
        f.stateTimer = this.getAttackDuration("uppercut");
        return;
      }
      if (btnKick) {
        this.setState(f, "sweep");
        f.stateTimer = this.getAttackDuration("sweep");
        return;
      }
      this.setState(f, "crouch");
      f.vx = 0;
      return;
    }
    f.isCrouching = false;

    // Jump
    if (up && !f.isAirborne) {
      f.vy = this.JUMP_FORCE;
      f.isAirborne = true;
      if (right) { f.vx = this.JUMP_FWD_VX * f.facing; this.setState(f, "jump_fwd"); }
      else if (left) { f.vx = -this.JUMP_FWD_VX * f.facing; this.setState(f, "jump_back"); }
      else { this.setState(f, "jump"); }
      this.spawnDust(f.x + this.DRAW_W / 2, this.groundY);
      return;
    }

    // Air attacks
    if (f.isAirborne) {
      if (btnPunch) {
        this.setState(f, "jump_punch");
        f.stateTimer = this.getAttackDuration("jump_punch");
      } else if (btnKick) {
        this.setState(f, "jump_kick");
        f.stateTimer = this.getAttackDuration("jump_kick");
      }
      return;
    }

    // Ground attacks
    if (btnSpecial && f.specialMeter >= 50) {
      this.setState(f, "special");
      f.stateTimer = this.getAttackDuration("special");
      f.specialMeter = Math.max(0, f.specialMeter - 50);
      this.announce(f.data.special.name.toUpperCase(), f.data.special.color, 60);
      this.spawnSpecialParticles(f);
      this.gameState.screenShake = 8;
      return;
    }
    if (btnPunch) {
      this.setState(f, "punch");
      f.stateTimer = this.getAttackDuration("punch");
      return;
    }
    if (btnKick) {
      this.setState(f, "kick");
      f.stateTimer = this.getAttackDuration("kick");
      return;
    }

    // Movement
    if (right) {
      f.vx = f.facing === 1 ? this.WALK_SPEED : -this.BACK_SPEED;
      this.setState(f, f.facing === 1 ? "walk_fwd" : "walk_back");
    } else if (left) {
      f.vx = f.facing === 1 ? -this.BACK_SPEED : this.WALK_SPEED;
      this.setState(f, f.facing === 1 ? "walk_back" : "walk_fwd");
    } else {
      f.vx *= 0.7;
      if (Math.abs(f.vx) < 0.5) f.vx = 0;
      if (!this.isAttackState(f.state) && f.state !== "hit_high" && f.state !== "hit_low") {
        this.setState(f, "idle");
      }
    }
  }

  /* ─── INTELLIGENT AI ─── */
  handleAI() {
    const ai = this.p2;
    const player = this.p1;
    if (ai.state === "ko" || ai.state === "knockdown") return;
    if (ai.state === "getup") {
      if (ai.stateTimer > 0) return;
    }

    this.aiTimer++;
    const dist = Math.abs(ai.x + this.DRAW_W / 2 - (player.x + this.DRAW_W / 2));
    const closeRange = dist < this.DRAW_W * 1.5;
    const midRange = dist < this.DRAW_W * 3;
    const farRange = dist >= this.DRAW_W * 3;

    // Reaction time scales with difficulty
    const reactionDelay = Math.max(2, Math.floor(20 - this.difficulty.aiAggressiveness * 15));
    if (this.aiDecisionCooldown > 0) {
      this.aiDecisionCooldown--;
      // Continue current action
      this.executeAIAction(ai, player, dist);
      return;
    }

    // State machine transitions
    const rand = Math.random();
    const aggression = this.difficulty.aiAggressiveness;
    const blockChance = this.difficulty.aiBlockChance;

    // Detect if player is attacking — react defensively
    const playerAttacking = this.isAttackState(player.state) && player.stateTimer > 0;
    const playerRecovering = this.isAttackState(player.state) && player.stateTimer <= 3;

    // Wakeup state after knockdown
    if (ai.knockdownTimer > 0) {
      this.aiState = "wakeup";
    }

    // State transitions
    if (playerAttacking && closeRange) {
      // Decide to block or try to counter
      if (rand < blockChance) {
        this.aiState = "defense";
        this.aiDecisionCooldown = reactionDelay;
      } else if (rand < blockChance + 0.15 && !playerRecovering) {
        // Try to backdash away
        this.aiState = "neutral";
        ai.vx = -this.WALK_SPEED * ai.facing;
        this.setState(ai, "walk_back");
        this.aiDecisionCooldown = 15;
        return;
      }
    } else if (playerRecovering && closeRange) {
      // Punish window!
      this.aiState = "punish";
      this.aiDecisionCooldown = 5;
    } else if (closeRange) {
      this.aiState = rand < aggression ? "pressure" : "neutral";
      this.aiDecisionCooldown = Math.floor(8 + Math.random() * 12);
    } else if (midRange) {
      if (rand < aggression * 0.7) {
        this.aiState = "pressure";
      } else if (rand < 0.6 && ai.specialMeter >= 50) {
        this.aiState = "zoning";
      } else {
        this.aiState = "neutral";
      }
      this.aiDecisionCooldown = Math.floor(15 + Math.random() * 20);
    } else {
      // Far range — approach or zone
      this.aiState = rand < 0.7 ? "pressure" : "zoning";
      this.aiDecisionCooldown = Math.floor(20 + Math.random() * 25);
    }

    this.executeAIAction(ai, player, dist);
  }

  executeAIAction(ai: Fighter, player: Fighter, dist: number) {
    if (!ai.canAct && ai.state !== "idle" && ai.state !== "walk_fwd" && ai.state !== "walk_back") return;

    const closeRange = dist < this.DRAW_W * 1.5;
    const attackRange = dist < this.DRAW_W * 2;
    const rand = Math.random();

    switch (this.aiState) {
      case "defense": {
        ai.isBlocking = true;
        if (player.isCrouching) {
          this.setState(ai, "block_crouch");
        } else {
          this.setState(ai, "block_stand");
        }
        // Release block after player stops attacking
        if (!this.isAttackState(player.state)) {
          ai.isBlocking = false;
          this.aiState = "neutral";
        }
        break;
      }

      case "punish": {
        ai.isBlocking = false;
        if (closeRange) {
          // Punish with best available move
          if (ai.specialMeter >= 50 && rand < 0.3) {
            this.setState(ai, "special");
            ai.stateTimer = this.getAttackDuration("special");
            ai.specialMeter -= 50;
            this.announce(ai.data.special.name.toUpperCase(), ai.data.special.color, 60);
            this.spawnSpecialParticles(ai);
            this.gameState.screenShake = 6;
          } else if (rand < 0.5) {
            this.setState(ai, "uppercut");
            ai.stateTimer = this.getAttackDuration("uppercut");
          } else {
            this.setState(ai, "kick");
            ai.stateTimer = this.getAttackDuration("kick");
          }
        } else {
          // Move in to punish
          ai.vx = player.x > ai.x ? this.WALK_SPEED : -this.WALK_SPEED;
          this.setState(ai, "walk_fwd");
        }
        this.aiState = "neutral";
        this.aiDecisionCooldown = 20;
        break;
      }

      case "pressure": {
        ai.isBlocking = false;
        if (attackRange) {
          // In range — attack with variety
          if (rand < 0.25) {
            this.setState(ai, "punch");
            ai.stateTimer = this.getAttackDuration("punch");
          } else if (rand < 0.45) {
            this.setState(ai, "kick");
            ai.stateTimer = this.getAttackDuration("kick");
          } else if (rand < 0.6) {
            this.setState(ai, "uppercut");
            ai.stateTimer = this.getAttackDuration("uppercut");
          } else if (rand < 0.7) {
            this.setState(ai, "sweep");
            ai.stateTimer = this.getAttackDuration("sweep");
          } else if (rand < 0.85 && ai.specialMeter >= 50) {
            this.setState(ai, "special");
            ai.stateTimer = this.getAttackDuration("special");
            ai.specialMeter -= 50;
            this.announce(ai.data.special.name.toUpperCase(), ai.data.special.color, 60);
            this.spawnSpecialParticles(ai);
          } else {
            // Jump attack
            if (!ai.isAirborne) {
              ai.vy = this.JUMP_FORCE;
              ai.isAirborne = true;
              ai.vx = (player.x > ai.x ? 1 : -1) * this.JUMP_FWD_VX;
              this.setState(ai, "jump_fwd");
              // Queue air attack
              setTimeout(() => {
                if (ai.isAirborne && this.running) {
                  const airAtk = Math.random() < 0.5 ? "jump_punch" : "jump_kick";
                  this.setState(ai, airAtk as FighterState);
                  ai.stateTimer = this.getAttackDuration(airAtk);
                }
              }, 200);
            }
          }
          this.aiDecisionCooldown = Math.floor(15 + Math.random() * 20);
        } else {
          // Approach
          ai.vx = player.x > ai.x ? this.WALK_SPEED : -this.WALK_SPEED;
          this.setState(ai, "walk_fwd");
          // Occasionally jump forward
          if (rand < 0.08 && !ai.isAirborne) {
            ai.vy = this.JUMP_FORCE;
            ai.isAirborne = true;
            this.setState(ai, "jump_fwd");
          }
        }
        break;
      }

      case "zoning": {
        ai.isBlocking = false;
        if (ai.specialMeter >= 50) {
          this.setState(ai, "special");
          ai.stateTimer = this.getAttackDuration("special");
          ai.specialMeter -= 50;
          this.announce(ai.data.special.name.toUpperCase(), ai.data.special.color, 60);
          this.spawnSpecialParticles(ai);
          this.aiState = "neutral";
          this.aiDecisionCooldown = 30;
        } else {
          // Build meter with safe pokes
          if (attackRange) {
            this.setState(ai, "kick");
            ai.stateTimer = this.getAttackDuration("kick");
          }
          // Back away
          ai.vx = player.x > ai.x ? -this.BACK_SPEED : this.BACK_SPEED;
          this.setState(ai, "walk_back");
          this.aiDecisionCooldown = 20;
        }
        break;
      }

      case "wakeup": {
        // After getting up, either block or reversal
        if (ai.knockdownTimer <= 0 && ai.state === "idle") {
          if (rand < this.difficulty.aiBlockChance) {
            ai.isBlocking = true;
            this.setState(ai, "block_stand");
            this.aiDecisionCooldown = 15;
          } else {
            // Wakeup attack
            this.setState(ai, "uppercut");
            ai.stateTimer = this.getAttackDuration("uppercut");
            this.aiDecisionCooldown = 20;
          }
          this.aiState = "neutral";
        }
        break;
      }

      default: { // neutral
        ai.isBlocking = false;
        if (closeRange) {
          // Mix between attack and retreat
          if (rand < this.difficulty.aiAggressiveness * 0.6) {
            this.setState(ai, rand < 0.5 ? "punch" : "kick");
            ai.stateTimer = this.getAttackDuration(rand < 0.5 ? "punch" : "kick");
          } else {
            // Slight retreat
            ai.vx = player.x > ai.x ? -this.BACK_SPEED : this.BACK_SPEED;
            this.setState(ai, "walk_back");
          }
        } else {
          // Slow approach with occasional pauses
          if (rand < 0.6) {
            ai.vx = player.x > ai.x ? this.WALK_SPEED * 0.7 : -this.WALK_SPEED * 0.7;
            this.setState(ai, "walk_fwd");
          } else {
            ai.vx = 0;
            this.setState(ai, "idle");
          }
        }
        this.aiDecisionCooldown = Math.floor(10 + Math.random() * 15);
        break;
      }
    }
  }

  /* ─── STATE HELPERS ─── */
  setState(f: Fighter, state: FighterState) {
    if (f.state === state) return;
    f.prevState = f.state;
    f.state = state;
    f.animFrame = 0;
    f.animTimer = 0;
  }

  isAttackState(state: FighterState): boolean {
    return ["punch", "kick", "uppercut", "sweep", "jump_punch", "jump_kick", "special"].includes(state);
  }

  getAttackDuration(attack: string): number {
    const data = ATTACK_DATA[attack];
    if (!data) return 20;
    return data[0] + data[1] + data[2]; // startup + active + recovery
  }

  getAttackPhase(f: Fighter): "startup" | "active" | "recovery" | null {
    const atk = f.state as string;
    const data = ATTACK_DATA[atk];
    if (!data) return null;
    const [startup, active, recovery] = data;
    const total = startup + active + recovery;
    const elapsed = total - f.stateTimer;
    if (elapsed < startup) return "startup";
    if (elapsed < startup + active) return "active";
    return "recovery";
  }

  /* ─── FIGHTER UPDATE ─── */
  updateFighter(f: Fighter) {
    // State timer
    if (f.stateTimer > 0) {
      f.stateTimer--;
      if (f.stateTimer <= 0) {
        if (f.state === "knockdown") {
          this.setState(f, "getup");
          f.stateTimer = 20;
          f.knockdownTimer = 0;
        } else if (f.state === "getup") {
          this.setState(f, "idle");
          f.canAct = true;
        } else if (f.state !== "ko" && f.state !== "victory") {
          this.setState(f, "idle");
          f.canAct = true;
        }
      }
    }

    // Hit stun
    if (f.hitStun > 0) {
      f.hitStun--;
      f.canAct = false;
      if (f.hitStun <= 0) {
        if (f.state === "hit_high" || f.state === "hit_low" || f.state === "hit_air") {
          this.setState(f, "idle");
          f.canAct = true;
        }
      }
    }

    // Combo timer
    if (f.comboTimer > 0) {
      f.comboTimer--;
      if (f.comboTimer <= 0) {
        if (f.comboCount >= 2) this.showCombo(f);
        f.comboCount = 0;
        f.comboDamage = 0;
      }
    }

    // Special cooldown
    if (f.specialCooldown > 0) {
      f.specialCooldown--;
      if (f.specialCooldown <= 0) f.specialReady = true;
    }

    // Physics
    f.vy += this.GRAVITY;
    f.x += f.vx;
    f.y += f.vy;

    // Ground collision
    const groundLevel = this.groundY - this.DRAW_H;
    if (f.y >= groundLevel) {
      f.y = groundLevel;
      f.vy = 0;
      if (f.isAirborne) {
        f.isAirborne = false;
        if (f.state === "hit_air") {
          this.setState(f, "knockdown");
          f.stateTimer = 40;
          f.knockdownTimer = 40;
          f.canAct = false;
          this.spawnDust(f.x + this.DRAW_W / 2, this.groundY);
          this.gameState.screenShake = 4;
        } else if (!this.isAttackState(f.state)) {
          this.setState(f, "idle");
          this.spawnDust(f.x + this.DRAW_W / 2, this.groundY);
        }
      }
    }

    // Wall bounds
    f.x = Math.max(10, Math.min(this.width - 10 - this.DRAW_W, f.x));

    // Face opponent
    const other = f === this.p1 ? this.p2 : this.p1;
    if (!this.isAttackState(f.state) && f.state !== "knockdown" && f.state !== "getup") {
      f.facing = other.x > f.x ? 1 : -1;
    }

    // Friction when not walking
    if (f.state === "idle" || f.state === "crouch" || this.isAttackState(f.state)) {
      f.vx *= 0.8;
    }

    // Prevent fighters from overlapping
    const overlap = this.DRAW_W * 0.6;
    if (Math.abs(f.x - other.x) < overlap && !f.isAirborne && !other.isAirborne) {
      const push = f.x < other.x ? -1.5 : 1.5;
      f.x += push;
    }
  }

  updateAnimations(f: Fighter) {
    f.animTimer++;
    const speed = this.isAttackState(f.state) ? 3 : 6;
    if (f.animTimer >= speed) {
      f.animTimer = 0;
      f.animFrame++;
    }
  }

  /* ─── PROJECTILES ─── */
  updateProjectiles() {
    this.projectiles = this.projectiles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0 || p.x < -50 || p.x > this.width + 50) return false;

      // Check hit against opponent
      const target = p.owner === "p1" ? this.p2 : this.p1;
      const tx = target.x + this.DRAW_W / 2;
      const ty = target.y + this.DRAW_H / 2;
      if (Math.abs(p.x - tx) < this.DRAW_W * 0.6 && Math.abs(p.y - ty) < this.DRAW_H * 0.6) {
        if (target.isBlocking) {
          this.spawnParticles(p.x, p.y, 5, "#ffffff", "spark");
          return false;
        }
        this.applyDamage(p.owner === "p1" ? this.p1 : this.p2, target, p.damage, 5, "high");
        this.spawnParticles(p.x, p.y, 10, p.color, "hit");
        return false;
      }
      return true;
    });
  }

  /* ─── COLLISION DETECTION ─── */
  checkCollisions() {
    this.checkAttack(this.p1, this.p2, "p1");
    this.checkAttack(this.p2, this.p1, "p2");
  }

  getHitBox(f: Fighter): HitBox | null {
    const atk = f.state as string;
    const data = HITBOX_DATA[atk];
    if (!data) return null;
    const phase = this.getAttackPhase(f);
    if (phase !== "active") return null;

    const [xOff, yOff, w, h] = data;
    return {
      x: f.x + this.DRAW_W / 2 + xOff * f.facing * (this.SPRITE_SCALE / 2),
      y: f.y + this.DRAW_H / 2 + yOff * (this.SPRITE_SCALE / 2),
      w: w * (this.SPRITE_SCALE / 2),
      h: h * (this.SPRITE_SCALE / 2),
    };
  }

  getHurtBox(f: Fighter): HitBox {
    const shrink = f.isCrouching ? 0.6 : 1;
    return {
      x: f.x + this.DRAW_W * 0.15,
      y: f.y + this.DRAW_H * (1 - shrink),
      w: this.DRAW_W * 0.7,
      h: this.DRAW_H * shrink,
    };
  }

  boxesOverlap(a: HitBox, b: HitBox): boolean {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  checkAttack(attacker: Fighter, defender: Fighter, attackerSide: "p1" | "p2") {
    const hitBox = this.getHitBox(attacker);
    if (!hitBox) return;

    const hurtBox = this.getHurtBox(defender);
    if (!this.boxesOverlap(hitBox, hurtBox)) return;

    const atk = attacker.state as string;
    const data = ATTACK_DATA[atk];
    if (!data) return;
    const [, , , baseDmg, hitStun, blockStun, knockback] = data;

    // Use special damage for special attacks
    const damage = atk === "special" ? attacker.data.special.damage : baseDmg;

    // Scale damage with fighter stats
    const atkMult = 1 + (attacker.data.attack - 5) * 0.08;
    const defMult = 1 - (defender.data.defense - 5) * 0.04;
    const scaledDmg = Math.max(1, Math.round(damage * atkMult * defMult * this.difficulty.damageMultiplier));

    // Check block
    if (defender.isBlocking) {
      const chipDmg = Math.max(1, Math.floor(scaledDmg * 0.1));
      defender.hp = Math.max(1, defender.hp - chipDmg); // chip can't kill
      defender.hitStun = blockStun;
      defender.vx = attacker.facing * knockback * 0.5;
      this.spawnParticles(hitBox.x, hitBox.y, 4, "#ffffff", "spark");
      this.gameState.hitPauseTimer = 3;
      // Reset attack so it doesn't multi-hit
      attacker.stateTimer = Math.min(attacker.stateTimer, ATTACK_DATA[atk]?.[2] ?? 6);
      return;
    }

    // Hit type
    const hitType = atk === "sweep" ? "low" : defender.isAirborne ? "air" : "high";
    this.applyDamage(attacker, defender, scaledDmg, knockback, hitType);

    // Hit effects
    const color = atk === "special" ? attacker.data.special.color : attacker.data.color;
    this.spawnParticles(hitBox.x, hitBox.y, atk === "special" ? 20 : 8, color, "hit");
    this.gameState.hitPauseTimer = atk === "special" ? 8 : atk === "uppercut" ? 6 : 4;
    this.gameState.screenShake = atk === "special" ? 10 : atk === "uppercut" ? 6 : 3;

    if (atk === "special") {
      this.gameState.flashTimer = 4;
      this.gameState.flashColor = attacker.data.special.color;
      this.gameState.slowMotion = 8;
    }

    // Reset attack to recovery
    attacker.stateTimer = Math.min(attacker.stateTimer, ATTACK_DATA[atk]?.[2] ?? 6);

    // Build special meter
    attacker.specialMeter = Math.min(100, attacker.specialMeter + 8);
    defender.specialMeter = Math.min(100, defender.specialMeter + 5);
  }

  applyDamage(attacker: Fighter, defender: Fighter, damage: number, knockback: number, hitType: "high" | "low" | "air") {
    defender.hp = Math.max(0, defender.hp - damage);

    // Combo tracking
    attacker.comboCount++;
    attacker.comboTimer = 30;
    attacker.comboDamage += damage;

    // Track perfect
    if (defender === this.p2 && this.p1.hp < this.p1.maxHp) this.gameState.perfectWin = false;

    // Hit reaction
    const atk = attacker.state as string;
    if (atk === "sweep") {
      this.setState(defender, "knockdown");
      defender.stateTimer = 50;
      defender.knockdownTimer = 50;
      defender.canAct = false;
      defender.vy = -3;
      defender.vx = attacker.facing * 4;
    } else if (atk === "uppercut" || atk === "special") {
      this.setState(defender, "hit_air");
      defender.hitStun = 24;
      defender.canAct = false;
      defender.vy = -10;
      defender.vx = attacker.facing * knockback;
      defender.isAirborne = true;
    } else if (defender.isAirborne) {
      this.setState(defender, "hit_air");
      defender.hitStun = 20;
      defender.canAct = false;
      defender.vx = attacker.facing * knockback;
    } else {
      this.setState(defender, hitType === "low" ? "hit_low" : "hit_high");
      defender.hitStun = ATTACK_DATA[atk]?.[4] ?? 12;
      defender.canAct = false;
      defender.vx = attacker.facing * knockback;
    }

    // KO check
    if (defender.hp <= 0) {
      this.setState(defender, "ko");
      defender.stateTimer = 999;
      defender.canAct = false;
      defender.vy = -8;
      defender.vx = attacker.facing * 6;
      this.spawnParticles(defender.x + this.DRAW_W / 2, defender.y + this.DRAW_H / 3, 30, attacker.data.color, "ko");
      this.gameState.screenShake = 15;
      this.gameState.slowMotion = 20;
      this.gameState.flashTimer = 6;
      this.gameState.flashColor = "#ffffff";
      this.endRound();
    }
  }

  /* ─── ROUND MANAGEMENT ─── */
  endRound() {
    const gs = this.gameState;
    let roundWinner: "p1" | "p2";

    if (this.p1.hp <= 0) roundWinner = "p2";
    else if (this.p2.hp <= 0) roundWinner = "p1";
    else roundWinner = this.p1.hp >= this.p2.hp ? "p1" : "p2";

    if (roundWinner === "p1") gs.p1Wins++;
    else gs.p2Wins++;

    const winner = roundWinner === "p1" ? this.p1 : this.p2;
    this.setState(winner, "victory");

    const loser = roundWinner === "p1" ? this.p2 : this.p1;
    if (loser.state !== "ko") this.setState(loser, "ko");

    this.announce(
      `${winner.data.name.toUpperCase()} WINS`,
      winner.data.color,
      90
    );

    this.onRoundEnd?.(roundWinner);

    const winsNeeded = Math.ceil(gs.maxRounds / 2);
    if (gs.p1Wins >= winsNeeded || gs.p2Wins >= winsNeeded) {
      gs.phase = "match_end";
      gs.phaseTimer = 200;
      gs.winner = gs.p1Wins >= winsNeeded ? "p1" : "p2";
      const perfect = gs.winner === "p1" && gs.perfectWin;
      if (perfect) this.announce("PERFECT!", "#fbbf24", 120);
      this.onMatchEnd?.(gs.winner, perfect);
    } else {
      gs.phase = "round_end";
      gs.phaseTimer = 120;
    }
  }

  startNewRound() {
    const gs = this.gameState;
    gs.round++;
    gs.phase = "round_intro";
    gs.phaseTimer = 90;
    gs.timer = ROUND_TIME;

    const groundLevel = this.groundY - this.DRAW_H;
    [this.p1, this.p2].forEach((f, i) => {
      f.x = this.width * (i === 0 ? 0.25 : 0.75);
      f.y = groundLevel;
      f.hp = f.maxHp;
      f.vx = 0;
      f.vy = 0;
      f.hitStun = 0;
      f.stateTimer = 0;
      f.isBlocking = false;
      f.isCrouching = false;
      f.isAirborne = false;
      f.canAct = true;
      f.knockdownTimer = 0;
      f.comboCount = 0;
      f.comboTimer = 0;
      f.comboDamage = 0;
      this.setState(f, "idle");
    });

    this.particles = [];
    this.projectiles = [];
    this.announce(`ROUND ${gs.round}`, "#ffffff", 60);
  }

  /* ─── PARTICLES ─── */
  spawnParticles(x: number, y: number, count: number, color: string, type: Particle["type"]) {
    for (let i = 0; i < count; i++) {
      const spread = type === "ko" ? 14 : type === "hit" ? 8 : 5;
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * spread,
        vy: (Math.random() - 0.5) * spread - 2,
        life: type === "ko" ? 50 : type === "flash" ? 8 : 25,
        maxLife: type === "ko" ? 50 : type === "flash" ? 8 : 25,
        color,
        size: type === "ko" ? Math.random() * 8 + 3 : Math.random() * 5 + 1,
        type,
      });
    }
  }

  spawnDust(x: number, y: number) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y - Math.random() * 5,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2,
        life: 15,
        maxLife: 15,
        color: "#8b7355",
        size: Math.random() * 4 + 2,
        type: "dust",
      });
    }
  }

  spawnSpecialParticles(f: Fighter) {
    const cx = f.x + this.DRAW_W / 2;
    const cy = f.y + this.DRAW_H / 2;
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      this.particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * (4 + Math.random() * 4),
        vy: Math.sin(angle) * (4 + Math.random() * 4),
        life: 35,
        maxLife: 35,
        color: f.data.special.color,
        size: Math.random() * 4 + 2,
        type: "special",
      });
    }
  }

  updateParticles() {
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.type !== "dust" && p.type !== "flash") p.vy += 0.15;
      p.vx *= 0.97;
      p.life--;
      return p.life > 0;
    });
  }

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */
  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.save();

    // Screen shake offset
    if (this.gameState.screenShake > 0) {
      ctx.translate(this.gameState.screenShakeX, this.gameState.screenShakeY);
    }

    // Background
    this.renderBackground();

    // Particles behind fighters
    this.renderParticles("behind");

    // Fighters (back one first)
    const backFighter = this.p1.x > this.p2.x ? this.p2 : this.p1;
    const frontFighter = backFighter === this.p1 ? this.p2 : this.p1;
    this.renderFighter(backFighter);
    this.renderFighter(frontFighter);

    // Projectiles
    this.renderProjectiles();

    // Particles in front
    this.renderParticles("front");

    // HUD
    this.renderHUD();

    // Phase overlays
    this.renderPhaseOverlay();

    // Flash effect
    if (this.gameState.flashTimer > 0) {
      ctx.fillStyle = this.gameState.flashColor + Math.floor((this.gameState.flashTimer / 6) * 80).toString(16).padStart(2, "0");
      ctx.fillRect(0, 0, w, h);
    }

    ctx.restore();
  }

  renderBackground() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, this.groundY);
    const colors = this.arena.bgGradient.match(/#[0-9a-f]{6}/gi) || ["#0a0a2e", "#1a0a3e", "#2d1b69"];
    colors.forEach((c, i) => grad.addColorStop(i / Math.max(1, colors.length - 1), c));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Stars with twinkle
    this.bgStars.forEach(s => {
      const flicker = s.brightness + Math.sin(this.frameCount * 0.03 * s.speed + s.x * 0.1) * 0.2;
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, flicker)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Cityscape silhouette
    this.bgBuildings.forEach(b => {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, this.groundY - b.h, b.w, b.h);
      // Windows
      if (b.windows) {
        for (let wy = this.groundY - b.h + 8; wy < this.groundY - 8; wy += 12) {
          for (let wx = b.x + 4; wx < b.x + b.w - 4; wx += 8) {
            if (Math.random() > 0.4) {
              ctx.fillStyle = `rgba(${180 + Math.random() * 75},${150 + Math.random() * 60},${50 + Math.random() * 50},${0.15 + Math.random() * 0.2})`;
              ctx.fillRect(wx, wy, 4, 6);
            }
          }
        }
      }
    });

    // Floor
    const floorGrad = ctx.createLinearGradient(0, this.groundY, 0, h);
    floorGrad.addColorStop(0, this.arena.floorColor);
    floorGrad.addColorStop(1, "#000000");
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, this.groundY, w, h - this.groundY);

    // Floor highlight line
    ctx.strokeStyle = this.arena.ambientColor + "50";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, this.groundY);
    ctx.lineTo(w, this.groundY);
    ctx.stroke();

    // Perspective grid on floor
    ctx.strokeStyle = this.arena.ambientColor + "10";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, this.groundY);
      ctx.lineTo(x + (x - w / 2) * 0.3, h);
      ctx.stroke();
    }
    for (let y = this.groundY + 15; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Arena name
    ctx.font = "bold 11px monospace";
    ctx.fillStyle = this.arena.ambientColor + "30";
    ctx.textAlign = "center";
    ctx.fillText(this.arena.name.toUpperCase(), w / 2, this.groundY + 16);
  }

  renderFighter(f: Fighter) {
    const ctx = this.ctx;
    const cx = f.x + this.DRAW_W / 2;

    ctx.save();

    // Idle breathing
    let drawY = f.y;
    if (f.state === "idle") {
      drawY += Math.sin(this.frameCount * 0.05) * 2;
    }

    // Shadow
    const shadowScale = Math.max(0.3, 1 - Math.abs(f.y - (this.groundY - this.DRAW_H)) / 200);
    ctx.fillStyle = `rgba(0,0,0,${0.4 * shadowScale})`;
    ctx.beginPath();
    ctx.ellipse(cx, this.groundY + 3, this.DRAW_W * 0.4 * shadowScale, 8 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ambient glow
    const glowSize = this.DRAW_W * 0.5;
    const glowGrad = ctx.createRadialGradient(cx, this.groundY, 0, cx, this.groundY, glowSize);
    glowGrad.addColorStop(0, f.data.color + "18");
    glowGrad.addColorStop(1, f.data.color + "00");
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, this.groundY, glowSize, 0, Math.PI * 2);
    ctx.fill();

    // Hit flash
    if ((f.state === "hit_high" || f.state === "hit_low") && f.hitStun > 8) {
      ctx.globalAlpha = 0.5 + Math.sin(this.frameCount * 0.8) * 0.3;
    }
    if (f.state === "ko") {
      ctx.globalAlpha = 0.3 + Math.sin(this.frameCount * 0.1) * 0.1;
    }

    // Draw sprite or portrait
    if (f.sprite) {
      this.renderSprite(f, drawY);
    } else if (f.imgLoaded && f.img) {
      this.renderPortrait(f, drawY);
    } else {
      this.renderSilhouette(f, drawY);
    }

    // State-based effects
    this.renderFighterEffects(f, drawY);

    ctx.restore();
  }

  renderSprite(f: Fighter, drawY: number) {
    const ctx = this.ctx;

    // Map game state to sprite animation state
    let spriteState: string = "idle";
    switch (f.state) {
      case "idle": spriteState = "idle"; break;
      case "walk_fwd": case "walk_back": spriteState = "walk"; break;
      case "crouch": case "block_crouch": spriteState = "crouch"; break;
      case "jump": case "jump_fwd": case "jump_back": spriteState = "idle"; break;
      case "punch": case "jump_punch": spriteState = "punch"; break;
      case "kick": case "jump_kick": case "uppercut": case "sweep": spriteState = "kick"; break;
      case "special": spriteState = "special"; break;
      case "block_stand": spriteState = "block"; break;
      case "hit_high": case "hit_low": case "hit_air": spriteState = "hit"; break;
      case "ko": case "knockdown": spriteState = "ko"; break;
      case "victory": case "taunt": spriteState = "victory"; break;
      default: spriteState = "idle";
    }

    const frames = f.sprite!.animations[spriteState as AnimState] || f.sprite!.animations["idle"];
    if (!frames || frames.length === 0) {
      this.renderSilhouette(f, drawY);
      return;
    }

    const frameIdx = f.animFrame % frames.length;
    const frame = frames[frameIdx];
    const frameCanvas = frame.canvas;

    ctx.save();

    // Glow behind sprite
    ctx.shadowColor = f.data.color;
    ctx.shadowBlur = f.state === "special" ? 25 : this.isAttackState(f.state) ? 15 : 8;

    if (f.facing === -1) {
      ctx.translate(f.x + this.DRAW_W, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(frameCanvas, 0, drawY, this.DRAW_W, this.DRAW_H);
    } else {
      ctx.drawImage(frameCanvas, f.x, drawY, this.DRAW_W, this.DRAW_H);
    }

    ctx.shadowBlur = 0;
    ctx.restore();
  }

  renderPortrait(f: Fighter, drawY: number) {
    const ctx = this.ctx;

    // Colored border
    ctx.shadowColor = f.data.color;
    ctx.shadowBlur = this.isAttackState(f.state) ? 20 : 10;

    const borderR = 6;
    ctx.beginPath();
    ctx.roundRect(f.x - 2, drawY - 2, this.DRAW_W + 4, this.DRAW_H + 4, borderR + 2);
    ctx.fillStyle = f.data.color + "50";
    ctx.fill();
    ctx.shadowBlur = 0;

    // Clip and draw image
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(f.x, drawY, this.DRAW_W, this.DRAW_H, borderR);
    ctx.clip();

    if (f.facing === -1) {
      ctx.translate(f.x + this.DRAW_W, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(f.img!, 0, drawY, this.DRAW_W, this.DRAW_H);
    } else {
      ctx.drawImage(f.img!, f.x, drawY, this.DRAW_W, this.DRAW_H);
    }

    // Darken bottom
    const nameGrad = ctx.createLinearGradient(f.x, drawY + this.DRAW_H * 0.65, f.x, drawY + this.DRAW_H);
    nameGrad.addColorStop(0, "rgba(0,0,0,0)");
    nameGrad.addColorStop(1, "rgba(0,0,0,0.7)");
    ctx.fillStyle = nameGrad;
    ctx.fillRect(f.facing === -1 ? 0 : f.x, drawY, this.DRAW_W, this.DRAW_H);

    ctx.restore();
  }

  renderSilhouette(f: Fighter, drawY: number) {
    const ctx = this.ctx;
    const cx = f.x + this.DRAW_W / 2;

    // Body silhouette
    ctx.fillStyle = f.data.color + "25";
    ctx.beginPath();
    ctx.roundRect(f.x, drawY, this.DRAW_W, this.DRAW_H, 6);
    ctx.fill();

    ctx.strokeStyle = f.data.color + "60";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(f.x, drawY, this.DRAW_W, this.DRAW_H, 6);
    ctx.stroke();

    // Head
    ctx.fillStyle = f.data.color + "40";
    ctx.beginPath();
    ctx.arc(cx, drawY + this.DRAW_H * 0.18, this.DRAW_W * 0.18, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.moveTo(cx - this.DRAW_W * 0.22, drawY + this.DRAW_H * 0.3);
    ctx.lineTo(cx + this.DRAW_W * 0.22, drawY + this.DRAW_H * 0.3);
    ctx.lineTo(cx + this.DRAW_W * 0.18, drawY + this.DRAW_H * 0.8);
    ctx.lineTo(cx - this.DRAW_W * 0.18, drawY + this.DRAW_H * 0.8);
    ctx.closePath();
    ctx.fill();
  }

  renderFighterEffects(f: Fighter, drawY: number) {
    const ctx = this.ctx;
    const cx = f.x + this.DRAW_W / 2;
    const cy = drawY + this.DRAW_H / 2;

    // Attack effects
    if (this.isAttackState(f.state) && this.getAttackPhase(f) === "active") {
      const attackX = cx + (f.facing === 1 ? this.DRAW_W * 0.5 : -this.DRAW_W * 0.5);

      if (f.state === "special") {
        // Dramatic special aura
        for (let ring = 3; ring >= 0; ring--) {
          const size = 60 + ring * 20 + Math.sin(this.frameCount * 0.3) * 10;
          const alpha = Math.max(0, 0.25 - ring * 0.05);
          const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size);
          gradient.addColorStop(0, f.data.special.color + Math.floor(alpha * 255).toString(16).padStart(2, "0"));
          gradient.addColorStop(0.7, f.data.special.color + "10");
          gradient.addColorStop(1, f.data.special.color + "00");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(cx, cy, size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Energy ring
        ctx.strokeStyle = f.data.special.color + "70";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.lineDashOffset = -this.frameCount * 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 50, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        // Slash arc
        const slashSize = f.state === "uppercut" || f.state === "kick" ? 40 : 28;
        ctx.strokeStyle = f.data.color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(attackX, cy, slashSize, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Impact flash
        ctx.fillStyle = f.data.color + "30";
        ctx.beginPath();
        ctx.arc(attackX, cy, slashSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Block shield
    if (f.state === "block_stand" || f.state === "block_crouch") {
      const shieldX = cx + f.facing * this.DRAW_W * 0.3;
      ctx.strokeStyle = "#88ccff80";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const r = this.DRAW_W * 0.4;
        const sx = shieldX + Math.cos(angle) * r;
        const sy = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = "rgba(100,180,255,0.06)";
      ctx.fill();
    }

    // Victory glow
    if (f.state === "victory") {
      const pulse = Math.sin(this.frameCount * 0.08) * 0.3 + 0.5;
      ctx.shadowColor = f.data.color;
      ctx.shadowBlur = 30 * pulse;
      ctx.strokeStyle = f.data.color + "60";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(f.x - 3, drawY - 3, this.DRAW_W + 6, this.DRAW_H + 6, 8);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Special meter bar under fighter
    if (this.gameState.phase === "fighting") {
      const meterW = this.DRAW_W * 0.8;
      const meterH = 4;
      const meterX = cx - meterW / 2;
      const meterY = drawY + this.DRAW_H + 8;

      ctx.fillStyle = "#1e293b80";
      ctx.fillRect(meterX, meterY, meterW, meterH);

      const fillW = meterW * (f.specialMeter / 100);
      const meterColor = f.specialMeter >= 50 ? f.data.special.color : f.data.color + "60";
      ctx.fillStyle = meterColor;
      ctx.fillRect(meterX, meterY, fillW, meterH);

      if (f.specialMeter >= 50) {
        ctx.strokeStyle = f.data.special.color + "80";
        ctx.lineWidth = 1;
        ctx.strokeRect(meterX, meterY, meterW, meterH);
      }
    }

    // Name tag
    const name = f.data.name.length > 14 ? f.data.name.substring(0, 12) + ".." : f.data.name;
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    const nameW = ctx.measureText(name.toUpperCase()).width;
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.beginPath();
    ctx.roundRect(cx - nameW / 2 - 5, drawY - 20, nameW + 10, 16, 3);
    ctx.fill();
    ctx.fillStyle = f.data.color;
    ctx.fillText(name.toUpperCase(), cx, drawY - 8);
  }

  renderParticles(layer: "behind" | "front") {
    const ctx = this.ctx;
    this.particles.forEach(p => {
      const isBehind = p.type === "dust" || p.type === "special";
      if ((layer === "behind" && !isBehind) || (layer === "front" && isBehind)) return;

      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;

      if (p.type === "special" || p.type === "flash") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        // Glow
        ctx.fillStyle = p.color + "40";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === "dust") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === "ko") {
        // Larger glowing particles for KO
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = p.color + "30";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Hit sparks — angular shards
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.atan2(p.vy, p.vx));
        ctx.fillRect(-p.size, -p.size * 0.3, p.size * 2, p.size * 0.6);
        ctx.restore();
      }
    });
    ctx.globalAlpha = 1;
  }

  renderProjectiles() {
    const ctx = this.ctx;
    this.projectiles.forEach(p => {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;

      // Core
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Glow
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      glow.addColorStop(0, p.color + "60");
      glow.addColorStop(1, p.color + "00");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Trail
      ctx.strokeStyle = p.color + "40";
      ctx.lineWidth = p.size * 0.8;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }

  /* ─── HUD — MK1-STYLE ─── */
  renderHUD() {
    const ctx = this.ctx;
    const w = this.width;
    const isMobile = w < 600;

    const barW = isMobile ? w * 0.34 : w * 0.38;
    const barH = isMobile ? 18 : 24;
    const barY = isMobile ? 10 : 14;
    const barPad = isMobile ? 8 : 16;
    const portraitSize = isMobile ? 32 : 44;
    const hudH = barY + barH + (isMobile ? 26 : 36);

    // ═══ HUD BACKGROUND — dark gradient strip ═══
    const hudGrad = ctx.createLinearGradient(0, 0, 0, hudH);
    hudGrad.addColorStop(0, "rgba(0,0,0,0.85)");
    hudGrad.addColorStop(0.7, "rgba(0,0,0,0.65)");
    hudGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = hudGrad;
    ctx.fillRect(0, 0, w, hudH);

    // ═══ FIGHTER PORTRAITS ═══
    [this.p1, this.p2].forEach((f, i) => {
      const px = i === 0 ? barPad : w - barPad - portraitSize;
      const py = barY - 2;

      // Portrait border glow
      ctx.shadowColor = f.data.color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = f.data.color;
      ctx.fillRect(px - 2, py - 2, portraitSize + 4, portraitSize + 4);
      ctx.shadowBlur = 0;

      // Portrait background
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(px, py, portraitSize, portraitSize);

      if (f.imgLoaded && f.img) {
        ctx.drawImage(f.img, px, py, portraitSize, portraitSize);
      } else {
        ctx.fillStyle = f.data.color + "40";
        ctx.fillRect(px, py, portraitSize, portraitSize);
      }

      // Corner accent
      ctx.strokeStyle = f.data.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py, portraitSize, portraitSize);
    });

    // ═══ HEALTH BARS — MK-style with angled edges ═══
    const hbX1 = barPad + portraitSize + 6;
    const hbX2 = w - barPad - portraitSize - 6 - barW;
    this.drawMKHealthBar(hbX1, barY, barW, barH, this.p1.hp / this.p1.maxHp, this.p1.data.color, false);
    this.drawMKHealthBar(hbX2, barY, barW, barH, this.p2.hp / this.p2.maxHp, this.p2.data.color, true);

    // ═══ NAMES ═══
    const nameSize = isMobile ? 10 : 13;
    ctx.font = `bold ${nameSize}px monospace`;
    ctx.textAlign = "left";
    ctx.fillStyle = this.p1.data.color;
    const p1Name = this.p1.data.name.length > 14 ? this.p1.data.name.substring(0, 12) + ".." : this.p1.data.name;
    ctx.fillText(p1Name.toUpperCase(), hbX1, barY - 2);
    ctx.textAlign = "right";
    ctx.fillStyle = this.p2.data.color;
    const p2Name = this.p2.data.name.length > 14 ? this.p2.data.name.substring(0, 12) + ".." : this.p2.data.name;
    ctx.fillText(p2Name.toUpperCase(), hbX2 + barW, barY - 2);

    // ═══ TIMER — MK-style centered octagon ═══
    const timerCx = w / 2;
    const timerCy = barY + barH / 2;
    const timerR = isMobile ? 20 : 26;

    // Timer background octagon
    ctx.fillStyle = "rgba(0,0,0,0.9)";
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 - Math.PI / 8;
      const x = timerCx + Math.cos(angle) * (timerR + 3);
      const y = timerCy + Math.sin(angle) * (timerR + 3);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // Timer border
    ctx.strokeStyle = this.gameState.timer <= 10 ? "#ef4444" : "#fbbf24";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 - Math.PI / 8;
      const x = timerCx + Math.cos(angle) * (timerR + 2);
      const y = timerCy + Math.sin(angle) * (timerR + 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Timer number
    const timerSize = isMobile ? 22 : 30;
    ctx.font = `bold ${timerSize}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = this.gameState.timer <= 10 ? "#ef4444" : "#ffffff";
    ctx.fillText(String(this.gameState.timer), timerCx, timerCy + 1);
    ctx.textBaseline = "alphabetic";

    // ═══ ROUND INDICATOR ═══
    ctx.font = `bold ${isMobile ? 9 : 11}px monospace`;
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.fillText(`ROUND ${this.gameState.round}`, w / 2, barY + barH + (isMobile ? 14 : 18));

    // ═══ WIN DOTS — MK skulls style ═══
    const dotR = isMobile ? 4 : 5;
    const winsNeeded = Math.ceil(this.gameState.maxRounds / 2);
    for (let i = 0; i < winsNeeded; i++) {
      // P1 wins
      const p1dx = hbX1 + i * (dotR * 3 + 2);
      const p1dy = barY + barH + (isMobile ? 12 : 16);
      ctx.fillStyle = i < this.gameState.p1Wins ? this.p1.data.color : "#1e293b";
      ctx.beginPath();
      ctx.arc(p1dx, p1dy, dotR, 0, Math.PI * 2);
      ctx.fill();
      if (i < this.gameState.p1Wins) {
        ctx.strokeStyle = this.p1.data.color + "80";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // P2 wins
      const p2dx = hbX2 + barW - i * (dotR * 3 + 2);
      ctx.fillStyle = i < this.gameState.p2Wins ? this.p2.data.color : "#1e293b";
      ctx.beginPath();
      ctx.arc(p2dx, p1dy, dotR, 0, Math.PI * 2);
      ctx.fill();
      if (i < this.gameState.p2Wins) {
        ctx.strokeStyle = this.p2.data.color + "80";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // ═══ COMBO TEXT ═══
    if (this.gameState.comboTextTimer > 0) {
      const alpha = Math.min(1, this.gameState.comboTextTimer / 20);
      const scale = 1 + (1 - alpha) * 0.15;
      ctx.globalAlpha = alpha;
      ctx.save();
      ctx.translate(w / 2, this.height * 0.32);
      ctx.scale(scale, scale);
      ctx.font = `bold ${isMobile ? 18 : 26}px monospace`;
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 4;
      ctx.textAlign = "center";
      ctx.strokeText(this.gameState.comboText, 0, 0);
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(this.gameState.comboText, 0, 0);
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    // ═══ ANNOUNCE TEXT — MK-style dramatic ═══
    if (this.gameState.announceTimer > 0) {
      const alpha = Math.min(1, this.gameState.announceTimer / 15);
      const scale = 1 + (1 - Math.min(1, this.gameState.announceTimer / 30)) * 0.3;
      ctx.globalAlpha = alpha;
      ctx.save();
      ctx.translate(w / 2, this.height * 0.44);
      ctx.scale(scale, scale);

      // Text shadow glow
      const fontSize = isMobile ? 34 : 52;
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = "center";

      // Outer glow
      ctx.shadowColor = this.gameState.announceColor;
      ctx.shadowBlur = 20;
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 6;
      ctx.strokeText(this.gameState.announceText, 0, 0);

      // Fill
      ctx.fillStyle = this.gameState.announceColor;
      ctx.fillText(this.gameState.announceText, 0, 0);

      // Inner highlight
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillText(this.gameState.announceText, 0, -2);

      ctx.restore();
      ctx.globalAlpha = 1;
    }

    // Controls hint (desktop only)
    if (!isMobile) {
      ctx.font = "10px monospace";
      ctx.fillStyle = "#475569";
      ctx.textAlign = "center";
      ctx.fillText("WASD: Move | J: Punch | K: Kick | L: Special | SHIFT: Block", w / 2, this.height - 10);
    }
  }

  drawMKHealthBar(x: number, y: number, w: number, h: number, pct: number, color: string, reverse: boolean) {
    const ctx = this.ctx;
    const skew = h * 0.3; // MK-style angled edges

    // Angled background shape
    ctx.fillStyle = "#0a0a1a";
    ctx.beginPath();
    if (!reverse) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w - skew, y + h);
      ctx.lineTo(x, y + h);
    } else {
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x + skew, y + h);
    }
    ctx.closePath();
    ctx.fill();

    // Damage flash (red underneath)
    ctx.fillStyle = "#ef444430";
    ctx.beginPath();
    if (!reverse) {
      ctx.moveTo(x + 1, y + 1);
      ctx.lineTo(x + w - 1, y + 1);
      ctx.lineTo(x + w - skew - 1, y + h - 1);
      ctx.lineTo(x + 1, y + h - 1);
    } else {
      ctx.moveTo(x + 1, y + 1);
      ctx.lineTo(x + w - 1, y + 1);
      ctx.lineTo(x + w - 1, y + h - 1);
      ctx.lineTo(x + skew + 1, y + h - 1);
    }
    ctx.closePath();
    ctx.fill();

    // Health fill with gradient
    const fillW = (w - 2) * Math.max(0, pct);
    if (fillW > 0) {
      const fillX = reverse ? x + 1 + (w - 2) - fillW : x + 1;
      const gradient = ctx.createLinearGradient(fillX, y, fillX + fillW, y + h);
      if (pct > 0.5) {
        gradient.addColorStop(0, lightenHex(color, 0.15));
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, darkenHex(color, 0.1));
      } else if (pct > 0.25) {
        gradient.addColorStop(0, "#fbbf24");
        gradient.addColorStop(0.5, "#f59e0b");
        gradient.addColorStop(1, "#d97706");
      } else {
        gradient.addColorStop(0, "#f87171");
        gradient.addColorStop(0.5, "#ef4444");
        gradient.addColorStop(1, "#b91c1c");
      }

      ctx.save();
      // Clip to the angled shape
      ctx.beginPath();
      if (!reverse) {
        ctx.moveTo(x + 1, y + 1);
        ctx.lineTo(x + w - 1, y + 1);
        ctx.lineTo(x + w - skew - 1, y + h - 1);
        ctx.lineTo(x + 1, y + h - 1);
      } else {
        ctx.moveTo(x + 1, y + 1);
        ctx.lineTo(x + w - 1, y + 1);
        ctx.lineTo(x + w - 1, y + h - 1);
        ctx.lineTo(x + skew + 1, y + h - 1);
      }
      ctx.closePath();
      ctx.clip();

      ctx.fillStyle = gradient;
      ctx.fillRect(fillX, y + 1, fillW, h - 2);

      // Top shine strip
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(fillX, y + 1, fillW, h * 0.35);

      // Bottom shadow
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(fillX, y + h * 0.7, fillW, h * 0.3);

      ctx.restore();
    }

    // Angled border
    ctx.strokeStyle = color + "60";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (!reverse) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w - skew, y + h);
      ctx.lineTo(x, y + h);
    } else {
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x + skew, y + h);
    }
    ctx.closePath();
    ctx.stroke();

    // HP text
    ctx.font = `bold ${h > 20 ? 11 : 9}px monospace`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.ceil(pct * 100)}%`, x + w / 2, y + h - 4);
  }

  renderPhaseOverlay() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const gs = this.gameState;

    if (gs.phase === "intro" || gs.phase === "round_intro") {
      const progress = 1 - gs.phaseTimer / 150;
      if (progress < 0.5) {
        // VS screen with fighter portraits
        ctx.fillStyle = `rgba(0,0,0,${0.8 - progress})`;
        ctx.fillRect(0, 0, w, h);

        // P1 side
        ctx.font = "bold 18px monospace";
        ctx.fillStyle = this.p1.data.color;
        ctx.textAlign = "right";
        ctx.fillText(this.p1.data.name.toUpperCase(), w / 2 - 20, h * 0.4);

        ctx.font = "bold 24px monospace";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("VS", w / 2, h * 0.45);

        // P2 side
        ctx.font = "bold 18px monospace";
        ctx.fillStyle = this.p2.data.color;
        ctx.textAlign = "left";
        ctx.fillText(this.p2.data.name.toUpperCase(), w / 2 + 20, h * 0.5);
      }
    }

    if (gs.phase === "match_end") {
      const alpha = Math.min(0.8, gs.phaseTimer > 150 ? (200 - gs.phaseTimer) / 50 : 0.8);
      ctx.fillStyle = `rgba(0,0,0,${alpha})`;
      ctx.fillRect(0, 0, w, h);

      const winner = gs.winner === "p1" ? this.p1 : this.p2;
      const isPlayer = gs.winner === "p1";

      // Result label
      ctx.font = "bold 16px monospace";
      ctx.fillStyle = isPlayer ? "#22c55e" : "#ef4444";
      ctx.textAlign = "center";
      ctx.fillText(isPlayer ? "VICTORY" : "DEFEAT", w / 2, h * 0.3);

      // Winner name
      ctx.font = "bold 32px monospace";
      ctx.fillStyle = winner.data.color;
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.strokeText(winner.data.name.toUpperCase(), w / 2, h * 0.42);
      ctx.fillText(winner.data.name.toUpperCase(), w / 2, h * 0.42);

      // Perfect
      if (isPlayer && gs.perfectWin) {
        ctx.font = "bold 22px monospace";
        ctx.fillStyle = "#fbbf24";
        ctx.fillText("PERFECT!", w / 2, h * 0.52);
      }

      // Score
      ctx.font = "14px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(`${gs.p1Wins} - ${gs.p2Wins}`, w / 2, h * 0.62);

      if (gs.phaseTimer < 140) {
        ctx.font = "12px monospace";
        ctx.fillStyle = "#64748b";
        ctx.fillText("Press ENTER to continue", w / 2, h * 0.72);
      }
    }
  }

  /* ─── RESIZE ─── */
  resize(width: number, height: number) {
    const oldW = this.width;
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.groundY = height * GROUND_Y_RATIO;

    // Recalculate dynamic scaling
    this.scaleFactor = this.height / REF_H;
    this.SPRITE_SCALE = REF_SPRITE_SCALE * this.scaleFactor;
    this.FIGHTER_W = Math.round(REF_FIGHTER_W * this.scaleFactor);
    this.FIGHTER_H = Math.round(REF_FIGHTER_H * this.scaleFactor);
    this.DRAW_W = Math.round(this.FIGHTER_W * REF_SPRITE_SCALE);
    this.DRAW_H = Math.round(this.FIGHTER_H * REF_SPRITE_SCALE);
    this.GRAVITY = REF_GRAVITY * this.scaleFactor;
    this.WALK_SPEED = REF_WALK_SPEED * this.scaleFactor;
    this.BACK_SPEED = REF_BACK_SPEED * this.scaleFactor;
    this.JUMP_FORCE = REF_JUMP_FORCE * this.scaleFactor;
    this.JUMP_FWD_VX = REF_JUMP_FWD_VX * this.scaleFactor;

    // Scale fighter positions
    this.p1.x = (this.p1.x / oldW) * width;
    this.p2.x = (this.p2.x / oldW) * width;
    const groundLevel = this.groundY - this.DRAW_H;
    if (!this.p1.isAirborne) this.p1.y = groundLevel;
    if (!this.p2.isAirborne) this.p2.y = groundLevel;

    this.generateBackground();
  }
}

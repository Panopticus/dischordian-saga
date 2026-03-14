/* ═══════════════════════════════════════════════════════
   FALL OF REALITY — 2D Fighting Game Engine
   Canvas-based combat with physics, AI, and effects
   ═══════════════════════════════════════════════════════ */
import { type FighterData, type ArenaData, type DifficultyLevel } from "./gameData";

/* ─── TYPES ─── */
export type FighterState = "idle" | "walk" | "attack" | "heavy" | "special" | "block" | "hit" | "ko" | "victory";

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
  stateTimer: number;
  specialCooldown: number;
  specialReady: boolean;
  comboCount: number;
  blockTimer: number;
  hitStun: number;
  isBlocking: boolean;
  imgLoaded: boolean;
  img: HTMLImageElement | null;
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
  type: "hit" | "special" | "spark" | "ko";
}

export interface GameState {
  phase: "intro" | "fighting" | "round-end" | "match-end";
  round: number;
  maxRounds: 3;
  p1Wins: number;
  p2Wins: number;
  timer: number;
  maxTimer: number;
  phaseTimer: number;
  winner: "p1" | "p2" | null;
  perfectWin: boolean;
  showSpecialName: string;
  specialNameTimer: number;
}

/* ─── CONSTANTS ─── */
const GROUND_Y = 0.75; // fraction of canvas height
const GRAVITY = 0.6;
const FIGHTER_W = 80;
const FIGHTER_H = 120;
const WALK_SPEED = 3.5;
const JUMP_FORCE = -12;
const ATTACK_RANGE = 90;
const HEAVY_RANGE = 100;
const ATTACK_FRAMES = 18;
const HEAVY_FRAMES = 28;
const SPECIAL_FRAMES = 45;
const HIT_STUN_FRAMES = 15;
const BLOCK_STUN_FRAMES = 8;
const ROUND_TIME = 90; // seconds

export class FightEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  groundY: number;

  p1: Fighter;
  p2: Fighter;
  arena: ArenaData;
  difficulty: DifficultyLevel;
  particles: Particle[] = [];
  gameState: GameState;

  keys: Set<string> = new Set();
  animFrame: number = 0;
  frameCount: number = 0;
  lastTime: number = 0;
  running: boolean = false;
  timerInterval: number = 0;

  // AI
  aiTimer: number = 0;
  aiAction: string = "idle";
  aiDecisionInterval: number = 60;

  // Callbacks
  onRoundEnd?: (winner: "p1" | "p2") => void;
  onMatchEnd?: (winner: "p1" | "p2", perfect: boolean) => void;

  // Background image cache
  bgStars: { x: number; y: number; size: number; brightness: number }[] = [];

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
    this.groundY = this.height * GROUND_Y;
    this.arena = arena;
    this.difficulty = difficulty;

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
      phaseTimer: 120,
      winner: null,
      perfectWin: true,
      showSpecialName: "",
      specialNameTimer: 0,
    };

    // Generate background stars
    for (let i = 0; i < 80; i++) {
      this.bgStars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.groundY,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.5 + 0.3,
      });
    }

    this.loadFighterImages();
  }

  createFighter(data: FighterData, x: number, facing: 1 | -1): Fighter {
    return {
      data,
      x,
      y: this.height * GROUND_Y - FIGHTER_H,
      vx: 0,
      vy: 0,
      hp: data.hp,
      maxHp: data.hp,
      facing,
      state: "idle",
      stateTimer: 0,
      specialCooldown: 0,
      specialReady: true,
      comboCount: 0,
      blockTimer: 0,
      hitStun: 0,
      isBlocking: false,
      imgLoaded: false,
      img: null,
    };
  }

  loadFighterImages() {
    [this.p1, this.p2].forEach((f) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        f.img = img;
        f.imgLoaded = true;
      };
      img.src = f.data.image;
    });
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.gameState.phase = "intro";
    this.gameState.phaseTimer = 120;

    // Timer countdown
    this.timerInterval = window.setInterval(() => {
      if (this.gameState.phase === "fighting" && this.gameState.timer > 0) {
        this.gameState.timer--;
        if (this.gameState.timer <= 0) {
          this.endRound();
        }
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
    this.update();
    this.render();
    this.frameCount++;
    this.animFrame = requestAnimationFrame(this.loop);
  };

  /* ─── INPUT ─── */
  handleKeyDown = (e: KeyboardEvent) => {
    this.keys.add(e.key.toLowerCase());
    e.preventDefault();
  };

  handleKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.key.toLowerCase());
    e.preventDefault();
  };

  /* ─── UPDATE ─── */
  update() {
    const gs = this.gameState;

    if (gs.phase === "intro") {
      gs.phaseTimer--;
      if (gs.phaseTimer <= 0) {
        gs.phase = "fighting";
        gs.timer = ROUND_TIME;
      }
      return;
    }

    if (gs.phase === "round-end" || gs.phase === "match-end") {
      gs.phaseTimer--;
      this.updateParticles();
      if (gs.phase === "round-end" && gs.phaseTimer <= 0) {
        this.startNewRound();
      }
      return;
    }

    // Fighting phase
    this.handlePlayerInput();
    this.handleAI();
    this.updateFighter(this.p1);
    this.updateFighter(this.p2);
    this.checkCollisions();
    this.updateParticles();

    // Special name display
    if (gs.specialNameTimer > 0) gs.specialNameTimer--;
  }

  handlePlayerInput() {
    const f = this.p1;
    if (f.hitStun > 0 || f.state === "ko") return;

    const inAction = f.state === "attack" || f.state === "heavy" || f.state === "special";
    if (inAction && f.stateTimer > 0) return;

    // Block
    if (this.keys.has("s") || this.keys.has("arrowdown")) {
      f.isBlocking = true;
      f.state = "block";
    } else {
      f.isBlocking = false;
    }

    // Movement
    if (!f.isBlocking) {
      if (this.keys.has("a") || this.keys.has("arrowleft")) {
        f.vx = -WALK_SPEED;
        if (f.state === "idle") f.state = "walk";
      } else if (this.keys.has("d") || this.keys.has("arrowright")) {
        f.vx = WALK_SPEED;
        if (f.state === "idle") f.state = "walk";
      } else {
        f.vx = 0;
        if (f.state === "walk") f.state = "idle";
      }

      // Jump
      if ((this.keys.has("w") || this.keys.has("arrowup")) && f.y >= this.groundY - FIGHTER_H - 2) {
        f.vy = JUMP_FORCE;
      }
    }

    // Attacks
    if (this.keys.has("j") || this.keys.has("z")) {
      f.state = "attack";
      f.stateTimer = ATTACK_FRAMES;
      f.comboCount++;
    } else if (this.keys.has("k") || this.keys.has("x")) {
      f.state = "heavy";
      f.stateTimer = HEAVY_FRAMES;
    } else if ((this.keys.has("l") || this.keys.has("c")) && f.specialReady) {
      f.state = "special";
      f.stateTimer = SPECIAL_FRAMES;
      f.specialReady = false;
      f.specialCooldown = f.data.special.cooldown;
      this.gameState.showSpecialName = f.data.special.name;
      this.gameState.specialNameTimer = 90;
      this.spawnSpecialParticles(f);
    }
  }

  handleAI() {
    const ai = this.p2;
    const player = this.p1;
    if (ai.hitStun > 0 || ai.state === "ko") return;

    this.aiTimer++;
    if (this.aiTimer < this.aiDecisionInterval) return;
    this.aiTimer = 0;

    // Reaction time based on difficulty
    const reactionFrames = Math.floor(this.difficulty.aiReactionTime / 16);
    if (this.frameCount % reactionFrames !== 0 && this.aiAction !== "idle") return;

    const dist = Math.abs(ai.x - player.x);
    const inRange = dist < ATTACK_RANGE + 20;
    const rand = Math.random();

    // Block incoming attacks
    if (player.state === "attack" || player.state === "heavy" || player.state === "special") {
      if (rand < this.difficulty.aiBlockChance) {
        ai.isBlocking = true;
        ai.state = "block";
        this.aiAction = "block";
        this.aiDecisionInterval = 20;
        return;
      }
    }

    ai.isBlocking = false;

    if (inRange) {
      if (rand < this.difficulty.aiAggressiveness) {
        // Attack
        const attackRand = Math.random();
        if (attackRand < 0.15 && ai.specialReady) {
          ai.state = "special";
          ai.stateTimer = SPECIAL_FRAMES;
          ai.specialReady = false;
          ai.specialCooldown = ai.data.special.cooldown;
          this.gameState.showSpecialName = ai.data.special.name;
          this.gameState.specialNameTimer = 90;
          this.spawnSpecialParticles(ai);
          this.aiAction = "special";
        } else if (attackRand < 0.5) {
          ai.state = "heavy";
          ai.stateTimer = HEAVY_FRAMES;
          this.aiAction = "heavy";
        } else {
          ai.state = "attack";
          ai.stateTimer = ATTACK_FRAMES;
          ai.comboCount++;
          this.aiAction = "attack";
        }
        this.aiDecisionInterval = 30;
      } else {
        // Retreat
        ai.vx = ai.facing * WALK_SPEED;
        ai.state = "walk";
        this.aiAction = "retreat";
        this.aiDecisionInterval = 20;
      }
    } else {
      // Approach
      if (rand < this.difficulty.aiAggressiveness + 0.3) {
        ai.vx = player.x > ai.x ? WALK_SPEED : -WALK_SPEED;
        ai.state = "walk";
        this.aiAction = "approach";
        // Sometimes jump
        if (Math.random() < 0.1 && ai.y >= this.groundY - FIGHTER_H - 2) {
          ai.vy = JUMP_FORCE;
        }
      } else {
        ai.vx = 0;
        ai.state = "idle";
        this.aiAction = "idle";
      }
      this.aiDecisionInterval = 40;
    }
  }

  updateFighter(f: Fighter) {
    // State timer
    if (f.stateTimer > 0) {
      f.stateTimer--;
      if (f.stateTimer <= 0) {
        if (f.state !== "ko") {
          f.state = "idle";
          f.comboCount = 0;
        }
      }
    }

    // Hit stun
    if (f.hitStun > 0) {
      f.hitStun--;
      if (f.hitStun <= 0 && f.state === "hit") {
        f.state = "idle";
      }
    }

    // Special cooldown
    if (f.specialCooldown > 0) {
      f.specialCooldown--;
      if (f.specialCooldown <= 0) f.specialReady = true;
    }

    // Physics
    f.vy += GRAVITY;
    f.x += f.vx;
    f.y += f.vy;

    // Ground collision
    if (f.y >= this.groundY - FIGHTER_H) {
      f.y = this.groundY - FIGHTER_H;
      f.vy = 0;
    }

    // Wall bounds
    f.x = Math.max(20, Math.min(this.width - 20 - FIGHTER_W, f.x));

    // Face opponent
    const other = f === this.p1 ? this.p2 : this.p1;
    f.facing = other.x > f.x ? 1 : -1;

    // Slow down when not walking
    if (f.state !== "walk" && f.state !== "hit") {
      f.vx *= 0.85;
    }
  }

  checkCollisions() {
    this.checkAttack(this.p1, this.p2);
    this.checkAttack(this.p2, this.p1);
  }

  checkAttack(attacker: Fighter, defender: Fighter) {
    const isAttacking = attacker.state === "attack" || attacker.state === "heavy" || attacker.state === "special";
    if (!isAttacking) return;

    // Only hit on specific frame of animation
    const hitFrame = attacker.state === "attack" ? ATTACK_FRAMES - 8
      : attacker.state === "heavy" ? HEAVY_FRAMES - 12
      : SPECIAL_FRAMES - 20;

    if (attacker.stateTimer !== hitFrame) return;

    const range = attacker.state === "special" ? HEAVY_RANGE + 30 : attacker.state === "heavy" ? HEAVY_RANGE : ATTACK_RANGE;
    const dist = Math.abs(attacker.x + FIGHTER_W / 2 - (defender.x + FIGHTER_W / 2));

    if (dist > range) return;

    // Check if blocked
    if (defender.isBlocking) {
      defender.hitStun = BLOCK_STUN_FRAMES;
      defender.vx = attacker.facing * 3;
      this.spawnParticles(defender.x + FIGHTER_W / 2, defender.y + FIGHTER_H / 2, 3, "#ffffff", "spark");
      return;
    }

    // Calculate damage
    let baseDmg = attacker.state === "attack" ? attacker.data.attack * 1.2
      : attacker.state === "heavy" ? attacker.data.attack * 2
      : attacker.data.special.damage;

    // Combo bonus
    if (attacker.comboCount > 1) baseDmg *= 1 + (attacker.comboCount - 1) * 0.15;

    // Defense reduction
    const dmg = Math.max(1, Math.round(baseDmg * (1 - defender.data.defense * 0.03) * this.difficulty.damageMultiplier));

    defender.hp = Math.max(0, defender.hp - dmg);
    defender.state = "hit";
    defender.hitStun = HIT_STUN_FRAMES;
    defender.vx = attacker.facing * (attacker.state === "special" ? 8 : 5);
    defender.vy = attacker.state === "special" ? -5 : -2;

    // Track perfect win
    if (defender === this.p2 && this.p1.hp < this.p1.maxHp) {
      this.gameState.perfectWin = false;
    }
    if (defender === this.p1 && this.p1.hp < this.p1.maxHp) {
      this.gameState.perfectWin = false;
    }

    // Particles
    const color = attacker.state === "special" ? attacker.data.special.color : attacker.data.color;
    const count = attacker.state === "special" ? 20 : attacker.state === "heavy" ? 10 : 5;
    this.spawnParticles(defender.x + FIGHTER_W / 2, defender.y + FIGHTER_H / 3, count, color, "hit");

    // Check KO
    if (defender.hp <= 0) {
      defender.state = "ko";
      defender.stateTimer = 999;
      this.spawnParticles(defender.x + FIGHTER_W / 2, defender.y + FIGHTER_H / 2, 30, color, "ko");
      this.endRound();
    }
  }

  endRound() {
    const gs = this.gameState;
    let roundWinner: "p1" | "p2";

    if (this.p1.hp <= 0) {
      roundWinner = "p2";
    } else if (this.p2.hp <= 0) {
      roundWinner = "p1";
    } else {
      // Timer ran out — whoever has more HP wins
      roundWinner = this.p1.hp >= this.p2.hp ? "p1" : "p2";
    }

    if (roundWinner === "p1") gs.p1Wins++;
    else gs.p2Wins++;

    const winner = roundWinner === "p1" ? this.p1 : this.p2;
    winner.state = "victory";

    this.onRoundEnd?.(roundWinner);

    // Check match end
    const winsNeeded = Math.ceil(gs.maxRounds / 2);
    if (gs.p1Wins >= winsNeeded || gs.p2Wins >= winsNeeded) {
      gs.phase = "match-end";
      gs.phaseTimer = 180;
      gs.winner = gs.p1Wins >= winsNeeded ? "p1" : "p2";
      const perfect = gs.winner === "p1" && gs.perfectWin;
      this.onMatchEnd?.(gs.winner, perfect);
    } else {
      gs.phase = "round-end";
      gs.phaseTimer = 120;
    }
  }

  startNewRound() {
    const gs = this.gameState;
    gs.round++;
    gs.phase = "intro";
    gs.phaseTimer = 90;
    gs.timer = ROUND_TIME;

    // Reset fighters
    this.p1.x = this.width * 0.25;
    this.p1.y = this.groundY - FIGHTER_H;
    this.p1.hp = this.p1.maxHp;
    this.p1.state = "idle";
    this.p1.vx = 0;
    this.p1.vy = 0;
    this.p1.hitStun = 0;
    this.p1.stateTimer = 0;
    this.p1.specialReady = true;
    this.p1.specialCooldown = 0;

    this.p2.x = this.width * 0.75;
    this.p2.y = this.groundY - FIGHTER_H;
    this.p2.hp = this.p2.maxHp;
    this.p2.state = "idle";
    this.p2.vx = 0;
    this.p2.vy = 0;
    this.p2.hitStun = 0;
    this.p2.stateTimer = 0;
    this.p2.specialReady = true;
    this.p2.specialCooldown = 0;

    this.particles = [];
  }

  /* ─── PARTICLES ─── */
  spawnParticles(x: number, y: number, count: number, color: string, type: Particle["type"]) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * (type === "ko" ? 12 : 8),
        vy: (Math.random() - 0.5) * (type === "ko" ? 12 : 8) - 2,
        life: type === "ko" ? 60 : 30,
        maxLife: type === "ko" ? 60 : 30,
        color,
        size: type === "ko" ? Math.random() * 6 + 2 : Math.random() * 4 + 1,
        type,
      });
    }
  }

  spawnSpecialParticles(f: Fighter) {
    const cx = f.x + FIGHTER_W / 2;
    const cy = f.y + FIGHTER_H / 2;
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      this.particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * 6,
        vy: Math.sin(angle) * 6,
        life: 40,
        maxLife: 40,
        color: f.data.special.color,
        size: 3,
        type: "special",
      });
    }
  }

  updateParticles() {
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.vx *= 0.98;
      p.life--;
      return p.life > 0;
    });
  }

  /* ─── RENDER ─── */
  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    const colors = this.arena.bgGradient.match(/#[0-9a-f]{6}/gi) || ["#0a0a2e", "#1a0a3e", "#2d1b69", "#1a0a2e"];
    colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Stars
    this.bgStars.forEach(s => {
      const flicker = s.brightness + Math.sin(this.frameCount * 0.02 + s.x) * 0.15;
      ctx.fillStyle = `rgba(255,255,255,${flicker})`;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });

    // Floor
    ctx.fillStyle = this.arena.floorColor;
    ctx.fillRect(0, this.groundY, w, h - this.groundY);

    // Floor line
    ctx.strokeStyle = this.arena.ambientColor + "60";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, this.groundY);
    ctx.lineTo(w, this.groundY);
    ctx.stroke();

    // Grid on floor
    ctx.strokeStyle = this.arena.ambientColor + "15";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, this.groundY);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Arena name
    ctx.font = "10px monospace";
    ctx.fillStyle = this.arena.ambientColor + "40";
    ctx.textAlign = "center";
    ctx.fillText(this.arena.name.toUpperCase(), w / 2, this.groundY + 20);

    // Particles (behind fighters)
    this.renderParticles();

    // Fighters
    this.renderFighter(this.p1);
    this.renderFighter(this.p2);

    // HUD
    this.renderHUD();

    // Phase overlays
    this.renderPhaseOverlay();
  }

  renderFighter(f: Fighter) {
    const ctx = this.ctx;
    const cx = f.x + FIGHTER_W / 2;
    const cy = f.y + FIGHTER_H / 2;

    ctx.save();

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(cx, this.groundY + 2, FIGHTER_W * 0.4, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hit flash
    if (f.state === "hit" && f.hitStun > 10) {
      ctx.globalAlpha = 0.6;
    }

    // KO state
    if (f.state === "ko") {
      ctx.globalAlpha = 0.5 + Math.sin(this.frameCount * 0.1) * 0.2;
    }

    // Draw character image or placeholder
    if (f.imgLoaded && f.img) {
      // Flip based on facing
      ctx.save();
      if (f.facing === -1) {
        ctx.translate(f.x + FIGHTER_W, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(f.img, 0, f.y, FIGHTER_W, FIGHTER_H);
      } else {
        ctx.drawImage(f.img, f.x, f.y, FIGHTER_W, FIGHTER_H);
      }
      ctx.restore();

      // State-based overlays
      if (f.state === "attack" || f.state === "heavy") {
        // Attack glow
        const attackX = f.facing === 1 ? f.x + FIGHTER_W : f.x - 20;
        ctx.fillStyle = f.data.color + "40";
        ctx.beginPath();
        ctx.arc(attackX, cy - 10, f.state === "heavy" ? 25 : 18, 0, Math.PI * 2);
        ctx.fill();
      }

      if (f.state === "special") {
        // Special aura
        const auraSize = 50 + Math.sin(this.frameCount * 0.3) * 10;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, auraSize);
        gradient.addColorStop(0, f.data.special.color + "60");
        gradient.addColorStop(1, f.data.special.color + "00");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, auraSize, 0, Math.PI * 2);
        ctx.fill();
      }

      if (f.state === "block") {
        // Shield effect
        ctx.strokeStyle = "#ffffff80";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, FIGHTER_W * 0.5, -0.5, 0.5);
        ctx.stroke();
      }
    } else {
      // Placeholder rectangle
      ctx.fillStyle = f.data.color + "80";
      ctx.fillRect(f.x, f.y, FIGHTER_W, FIGHTER_H);
      ctx.strokeStyle = f.data.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(f.x, f.y, FIGHTER_W, FIGHTER_H);
    }

    // Name tag
    ctx.font = "bold 10px monospace";
    ctx.fillStyle = f.data.color;
    ctx.textAlign = "center";
    ctx.fillText(f.data.name.toUpperCase(), cx, f.y - 8);

    ctx.restore();
  }

  renderParticles() {
    const ctx = this.ctx;
    this.particles.forEach(p => {
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      if (p.type === "special") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
    });
    ctx.globalAlpha = 1;
  }

  renderHUD() {
    const ctx = this.ctx;
    const w = this.width;

    // Health bars
    const barW = w * 0.35;
    const barH = 16;
    const barY = 20;
    const barPad = 20;

    // P1 health (left, fills from left)
    this.drawHealthBar(barPad, barY, barW, barH, this.p1.hp / this.p1.maxHp, this.p1.data.color, false);
    // P2 health (right, fills from right)
    this.drawHealthBar(w - barPad - barW, barY, barW, barH, this.p2.hp / this.p2.maxHp, this.p2.data.color, true);

    // Names
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "left";
    ctx.fillStyle = this.p1.data.color;
    ctx.fillText(this.p1.data.name.toUpperCase(), barPad, barY - 4);
    ctx.textAlign = "right";
    ctx.fillStyle = this.p2.data.color;
    ctx.fillText(this.p2.data.name.toUpperCase(), w - barPad, barY - 4);

    // Timer
    ctx.font = "bold 24px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = this.gameState.timer <= 10 ? "#ef4444" : "#ffffff";
    ctx.fillText(String(this.gameState.timer), w / 2, barY + 14);

    // Round indicators
    ctx.font = "10px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.fillText(`ROUND ${this.gameState.round}`, w / 2, barY + 30);

    // Win dots
    for (let i = 0; i < Math.ceil(this.gameState.maxRounds / 2); i++) {
      ctx.fillStyle = i < this.gameState.p1Wins ? this.p1.data.color : "#334155";
      ctx.beginPath();
      ctx.arc(barPad + barW / 2 - 10 + i * 15, barY + barH + 10, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = i < this.gameState.p2Wins ? this.p2.data.color : "#334155";
      ctx.beginPath();
      ctx.arc(w - barPad - barW / 2 + 10 - i * 15, barY + barH + 10, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Special cooldown indicators
    if (!this.p1.specialReady) {
      const cd = 1 - this.p1.specialCooldown / this.p1.data.special.cooldown;
      ctx.fillStyle = "#334155";
      ctx.fillRect(barPad, barY + barH + 20, 60, 4);
      ctx.fillStyle = this.p1.data.special.color;
      ctx.fillRect(barPad, barY + barH + 20, 60 * cd, 4);
    } else {
      ctx.font = "8px monospace";
      ctx.fillStyle = this.p1.data.special.color;
      ctx.textAlign = "left";
      ctx.fillText("SPECIAL READY [L]", barPad, barY + barH + 26);
    }

    // Special name flash
    if (this.gameState.specialNameTimer > 0) {
      const alpha = Math.min(1, this.gameState.specialNameTimer / 30);
      ctx.globalAlpha = alpha;
      ctx.font = "bold 20px monospace";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(this.gameState.showSpecialName, w / 2, this.height * 0.4);
      ctx.globalAlpha = 1;
    }

    // Controls hint
    ctx.font = "9px monospace";
    ctx.fillStyle = "#475569";
    ctx.textAlign = "left";
    ctx.fillText("WASD/Arrows: Move  |  J/Z: Attack  |  K/X: Heavy  |  L/C: Special  |  S: Block", 10, this.height - 8);
  }

  drawHealthBar(x: number, y: number, w: number, h: number, pct: number, color: string, reverse: boolean) {
    const ctx = this.ctx;

    // Background
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(x, y, w, h);

    // Health fill
    const fillW = w * Math.max(0, pct);
    const fillX = reverse ? x + w - fillW : x;
    const gradient = ctx.createLinearGradient(fillX, y, fillX + fillW, y);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, color + "80");
    ctx.fillStyle = gradient;
    ctx.fillRect(fillX, y, fillW, h);

    // Border
    ctx.strokeStyle = color + "60";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

    // HP text
    ctx.font = "bold 10px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.ceil(pct * 100)}%`, x + w / 2, y + h - 3);
  }

  renderPhaseOverlay() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const gs = this.gameState;

    if (gs.phase === "intro") {
      const alpha = Math.min(1, gs.phaseTimer / 60);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = "bold 36px monospace";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(`ROUND ${gs.round}`, w / 2, h * 0.4);

      if (gs.phaseTimer < 60) {
        ctx.font = "bold 48px monospace";
        ctx.fillStyle = this.arena.ambientColor;
        ctx.fillText("FIGHT!", w / 2, h * 0.55);
      }
      ctx.globalAlpha = 1;
    }

    if (gs.phase === "round-end") {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, w, h);

      const winner = gs.p1Wins > gs.p2Wins ? this.p1 : this.p2;
      ctx.font = "bold 28px monospace";
      ctx.fillStyle = winner.data.color;
      ctx.textAlign = "center";
      ctx.fillText(`${winner.data.name.toUpperCase()} WINS`, w / 2, h * 0.45);

      ctx.font = "14px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("Next round starting...", w / 2, h * 0.55);
    }

    if (gs.phase === "match-end") {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, w, h);

      const winner = gs.winner === "p1" ? this.p1 : this.p2;
      const isPlayer = gs.winner === "p1";

      ctx.font = "bold 16px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.textAlign = "center";
      ctx.fillText(isPlayer ? "VICTORY" : "DEFEAT", w / 2, h * 0.3);

      ctx.font = "bold 32px monospace";
      ctx.fillStyle = winner.data.color;
      ctx.fillText(winner.data.name.toUpperCase(), w / 2, h * 0.42);

      if (isPlayer && gs.perfectWin) {
        ctx.font = "bold 20px monospace";
        ctx.fillStyle = "#fbbf24";
        ctx.fillText("PERFECT!", w / 2, h * 0.52);
      }

      ctx.font = "14px monospace";
      ctx.fillStyle = "#64748b";
      ctx.fillText(`Score: ${gs.p1Wins} - ${gs.p2Wins}`, w / 2, h * 0.62);

      if (gs.phaseTimer < 120) {
        ctx.font = "12px monospace";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("Press ENTER to continue", w / 2, h * 0.72);
      }
    }
  }

  /* ─── RESIZE ─── */
  resize(width: number, height: number) {
    const oldW = this.width;
    const oldH = this.height;
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.groundY = height * GROUND_Y;

    // Scale fighter positions
    this.p1.x = (this.p1.x / oldW) * width;
    this.p2.x = (this.p2.x / oldW) * width;
    this.p1.y = this.groundY - FIGHTER_H;
    this.p2.y = this.groundY - FIGHTER_H;

    // Regenerate stars
    this.bgStars = [];
    for (let i = 0; i < 80; i++) {
      this.bgStars.push({
        x: Math.random() * width,
        y: Math.random() * this.groundY,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.5 + 0.3,
      });
    }
  }
}

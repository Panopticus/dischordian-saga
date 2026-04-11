/* ═══════════════════════════════════════════════════════
   DISCHORDIA BOARD RENDERER — PixiJS 8 WebGL rendering for the
   5×9 tactical board with units, tiles, effects,
   and combat animations
   ═══════════════════════════════════════════════════════ */
import { Application, Container, Graphics, Text, TextStyle, Sprite, Assets } from "pixi.js";
import type { DuelystGameState, BoardUnit } from "./types";
import { FACTION_COLORS } from "./types";
import { posKey, findUnit, BOARD_W, BOARD_H } from "./engine";
import type { Texture } from "pixi.js";

const TILE_W = 80;
const TILE_H = 80;
const TILE_GAP = 2;
const BOARD_PAD = 20;

// Particle for effects
interface Particle {
  g: Graphics;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  gravity: number;
}

export class BoardRenderer {
  private app: Application;
  private boardContainer: Container;
  private unitsContainer: Container;
  private effectsContainer: Container;
  private highlightContainer: Container;
  private tileSprites: Map<string, Graphics> = new Map();
  private unitSprites: Map<string, Container> = new Map();
  private unitTextures: Map<string, Texture> = new Map();
  private particles: Particle[] = [];
  private onTileClick: ((row: number, col: number) => void) | null = null;
  private onUnitClick: ((unitId: string) => void) | null = null;
  private initialized = false;
  private animating = false;
  private previousBoard: Map<string, { row: number; col: number; health: number }> = new Map();

  constructor() {
    this.app = new Application();
    this.boardContainer = new Container();
    this.highlightContainer = new Container();
    this.unitsContainer = new Container();
    this.effectsContainer = new Container();
  }

  async init(canvas: HTMLCanvasElement): Promise<void> {
    if (this.initialized) return;
    await this.app.init({
      canvas,
      width: BOARD_W * (TILE_W + TILE_GAP) + BOARD_PAD * 2,
      height: BOARD_H * (TILE_H + TILE_GAP) + BOARD_PAD * 2,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    this.app.stage.addChild(this.boardContainer);
    this.app.stage.addChild(this.highlightContainer);
    this.app.stage.addChild(this.unitsContainer);
    this.app.stage.addChild(this.effectsContainer);
    this.drawBoard();
    this.startParticleLoop();
    this.initialized = true;
  }

  setCallbacks(onTile: (row: number, col: number) => void, onUnit: (unitId: string) => void): void {
    this.onTileClick = onTile;
    this.onUnitClick = onUnit;
  }

  private tileX(col: number): number { return BOARD_PAD + col * (TILE_W + TILE_GAP); }
  private tileY(row: number): number { return BOARD_PAD + row * (TILE_H + TILE_GAP); }
  private tileCX(col: number): number { return this.tileX(col) + TILE_W / 2; }
  private tileCY(row: number): number { return this.tileY(row) + TILE_H / 2; }

  private drawBoard(): void {
    for (let r = 0; r < BOARD_H; r++) {
      for (let c = 0; c < BOARD_W; c++) {
        const tile = new Graphics();
        const x = this.tileX(c), y = this.tileY(r);
        const isDark = (r + c) % 2 === 0;
        tile.rect(x, y, TILE_W, TILE_H);
        tile.fill({ color: isDark ? 0x1a1a2e : 0x16213e });
        tile.stroke({ color: 0x0f3460, width: 1 });
        tile.eventMode = "static";
        tile.cursor = "pointer";
        const row = r, col = c;
        tile.on("pointerdown", () => this.onTileClick?.(row, col));
        this.boardContainer.addChild(tile);
        this.tileSprites.set(posKey(r, c), tile);
      }
    }
  }

  /* ═══ MAIN UPDATE ═══ */
  update(state: DuelystGameState): void {
    if (!this.initialized) return;

    // Detect changes for animations
    const newBoard = new Map<string, { row: number; col: number; health: number }>();
    for (const [, unit] of state.board) {
      newBoard.set(unit.id, { row: unit.row, col: unit.col, health: unit.currentHealth });
    }

    // Detect deaths (units in previous but not in new)
    for (const [id, prev] of this.previousBoard) {
      if (!newBoard.has(id)) {
        this.playDeathEffect(prev.row, prev.col);
      }
    }

    // Detect new summons (units in new but not in previous)
    for (const [id, cur] of newBoard) {
      if (!this.previousBoard.has(id)) {
        this.playSummonEffect(cur.row, cur.col, state);
      }
    }

    // Detect damage dealt
    for (const [id, cur] of newBoard) {
      const prev = this.previousBoard.get(id);
      if (prev && cur.health < prev.health) {
        this.showDamageNumber(cur.row, cur.col, prev.health - cur.health);
        this.playHitEffect(cur.row, cur.col);
      } else if (prev && cur.health > prev.health) {
        this.showHealNumber(cur.row, cur.col, cur.health - prev.health);
      }
    }

    this.previousBoard = newBoard;

    // Redraw units
    this.unitsContainer.removeChildren();
    this.unitSprites.clear();

    for (const [key, unit] of state.board) {
      const [r, c] = key.split(",").map(Number);
      const x = this.tileX(c), y = this.tileY(r);
      const container = new Container();
      container.x = x;
      container.y = y;

      const color = unit.owner === 0
        ? parseInt(FACTION_COLORS[state.players[0].faction].replace("#", ""), 16)
        : parseInt(FACTION_COLORS[state.players[1].faction].replace("#", ""), 16);

      // Unit background circle
      const bg = new Graphics();
      bg.circle(TILE_W / 2, TILE_H / 2, TILE_W * 0.38);
      bg.fill({ color, alpha: 0.3 });
      bg.stroke({ color, width: 2 });
      container.addChild(bg);

      // General crown
      if (unit.isGeneral) {
        const crown = new Graphics();
        crown.rect(TILE_W / 2 - 10, 2, 20, 8);
        crown.fill({ color: 0xffd700 });
        // Crown points
        const cp = new Graphics();
        cp.moveTo(TILE_W / 2 - 10, 2);
        cp.lineTo(TILE_W / 2 - 6, -4);
        cp.lineTo(TILE_W / 2, 2);
        cp.lineTo(TILE_W / 2 + 6, -4);
        cp.lineTo(TILE_W / 2 + 10, 2);
        cp.fill({ color: 0xffd700 });
        container.addChild(crown);
        container.addChild(cp);
      }

      // Unit image or initial
      if (unit.card.imageUrl) {
        this.loadUnitImage(container, unit.card.imageUrl, unit);
      } else {
        const initial = new Text({
          text: unit.card.name.charAt(0).toUpperCase(),
          style: new TextStyle({ fontSize: 24, fontWeight: "bold", fill: 0xffffff, fontFamily: "monospace" }),
        });
        initial.x = TILE_W / 2 - initial.width / 2;
        initial.y = TILE_H / 2 - initial.height / 2;
        container.addChild(initial);
      }

      // Attack stat (bottom-left, red circle)
      const atkBg = new Graphics();
      atkBg.circle(10, TILE_H - 10, 11);
      atkBg.fill({ color: 0xcc2222 });
      atkBg.stroke({ color: 0xff4444, width: 1 });
      container.addChild(atkBg);
      const atkText = new Text({ text: `${unit.currentAttack}`, style: new TextStyle({ fontSize: 11, fontWeight: "bold", fill: 0xffffff, fontFamily: "monospace" }) });
      atkText.x = 10 - atkText.width / 2;
      atkText.y = TILE_H - 10 - atkText.height / 2;
      container.addChild(atkText);

      // Health stat (bottom-right, green/red circle)
      const hpLow = unit.currentHealth <= unit.maxHealth * 0.3;
      const hpColor = hpLow ? 0xcc0000 : 0x22aa22;
      const hpBorder = hpLow ? 0xff4444 : 0x44ff44;
      const hpBg = new Graphics();
      hpBg.circle(TILE_W - 10, TILE_H - 10, 11);
      hpBg.fill({ color: hpColor });
      hpBg.stroke({ color: hpBorder, width: 1 });
      container.addChild(hpBg);
      const hpText = new Text({ text: `${unit.currentHealth}`, style: new TextStyle({ fontSize: 11, fontWeight: "bold", fill: 0xffffff, fontFamily: "monospace" }) });
      hpText.x = TILE_W - 10 - hpText.width / 2;
      hpText.y = TILE_H - 10 - hpText.height / 2;
      container.addChild(hpText);

      // Keyword indicators
      if (unit.activeKeywords.has("provoke") || unit.activeKeywords.has("taunt")) {
        const border = new Graphics();
        border.rect(0, 0, TILE_W, TILE_H);
        border.stroke({ color: 0xffaa00, width: 3 });
        container.addChild(border);
      }
      if (unit.activeKeywords.has("ranged")) {
        const dot = new Graphics();
        dot.circle(TILE_W / 2, 6, 3);
        dot.fill({ color: 0x44aaff });
        container.addChild(dot);
      }
      if (unit.isStunned) {
        const overlay = new Graphics();
        overlay.rect(0, 0, TILE_W, TILE_H);
        overlay.fill({ color: 0x4444ff, alpha: 0.25 });
        container.addChild(overlay);
      }

      container.eventMode = "static";
      container.cursor = "pointer";
      const unitId = unit.id;
      container.on("pointerdown", (e) => { e.stopPropagation(); this.onUnitClick?.(unitId); });
      this.unitsContainer.addChild(container);
      this.unitSprites.set(unit.id, container);
    }
  }

  /* ═══ ANIMATIONS ═══ */

  /** Summon burst: particles radiate outward from the summoned tile */
  private playSummonEffect(row: number, col: number, state?: DuelystGameState): void {
    const cx = this.tileCX(col), cy = this.tileCY(row);
    const color = 0x4488ff;
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const speed = 2 + Math.random() * 3;
      this.spawnParticle(cx, cy, Math.cos(angle) * speed, Math.sin(angle) * speed, color, 20 + Math.random() * 10, 4);
    }
    // Central flash
    const flash = new Graphics();
    flash.circle(cx, cy, TILE_W * 0.5);
    flash.fill({ color: 0xffffff, alpha: 0.4 });
    this.effectsContainer.addChild(flash);
    let frame = 0;
    const animate = () => {
      frame++;
      flash.alpha = 0.4 * (1 - frame / 12);
      flash.scale.set(1 + frame * 0.05);
      if (frame < 12) requestAnimationFrame(animate);
      else this.effectsContainer.removeChild(flash);
    };
    requestAnimationFrame(animate);
  }

  /** Hit impact: red sparks and screen shake */
  private playHitEffect(row: number, col: number): void {
    const cx = this.tileCX(col), cy = this.tileCY(row);
    // Red sparks
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 2.5;
      this.spawnParticle(cx, cy, Math.cos(angle) * speed, Math.sin(angle) * speed, 0xff4444, 15 + Math.random() * 8, 3);
    }
    // White impact flash
    const flash = new Graphics();
    flash.circle(cx, cy, TILE_W * 0.3);
    flash.fill({ color: 0xffffff, alpha: 0.6 });
    this.effectsContainer.addChild(flash);
    let frame = 0;
    const animate = () => {
      frame++;
      flash.alpha = 0.6 * (1 - frame / 8);
      if (frame < 8) requestAnimationFrame(animate);
      else this.effectsContainer.removeChild(flash);
    };
    requestAnimationFrame(animate);

    // Screen shake
    this.shakeBoard(4, 6);
  }

  /** Death: unit shatters into particles */
  private playDeathEffect(row: number, col: number): void {
    const cx = this.tileCX(col), cy = this.tileCY(row);
    // Explosion of particles
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      const color = Math.random() < 0.5 ? 0xff6644 : 0xffaa44;
      this.spawnParticle(cx, cy, Math.cos(angle) * speed, Math.sin(angle) * speed - 1, color, 25 + Math.random() * 15, 3 + Math.random() * 2, 0.08);
    }
    // Dark smoke
    for (let i = 0; i < 6; i++) {
      const ox = (Math.random() - 0.5) * TILE_W * 0.5;
      const oy = (Math.random() - 0.5) * TILE_H * 0.5;
      this.spawnParticle(cx + ox, cy + oy, (Math.random() - 0.5) * 0.5, -0.5 - Math.random(), 0x333333, 30 + Math.random() * 20, 6 + Math.random() * 4, 0);
    }
    this.shakeBoard(6, 10);
  }

  /** Board shake effect */
  private shakeBoard(intensity: number, durationFrames: number): void {
    const stage = this.app.stage;
    const originalX = stage.x, originalY = stage.y;
    let frame = 0;
    const animate = () => {
      frame++;
      const decay = 1 - frame / durationFrames;
      stage.x = originalX + (Math.random() - 0.5) * intensity * decay;
      stage.y = originalY + (Math.random() - 0.5) * intensity * decay;
      if (frame < durationFrames) requestAnimationFrame(animate);
      else { stage.x = originalX; stage.y = originalY; }
    };
    requestAnimationFrame(animate);
  }

  /* ═══ PARTICLE SYSTEM ═══ */

  private spawnParticle(x: number, y: number, vx: number, vy: number, color: number, life: number, size: number, gravity: number = 0.05): void {
    const g = new Graphics();
    g.circle(0, 0, size);
    g.fill({ color, alpha: 0.9 });
    g.x = x;
    g.y = y;
    this.effectsContainer.addChild(g);
    this.particles.push({ g, vx, vy, life, maxLife: life, gravity });
  }

  private startParticleLoop(): void {
    if (this.animating) return;
    this.animating = true;
    const tick = () => {
      if (!this.animating) return;
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.g.x += p.vx;
        p.g.y += p.vy;
        p.vy += p.gravity;
        p.life--;
        p.g.alpha = Math.max(0, p.life / p.maxLife);
        if (p.life <= 0) {
          this.effectsContainer.removeChild(p.g);
          this.particles.splice(i, 1);
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ═══ SPELL EFFECT ═══ */

  showSpellEffect(row: number, col: number, color: number = 0x9944ff): void {
    const cx = this.tileCX(col), cy = this.tileCY(row);
    // Expanding ring
    const ring = new Graphics();
    ring.circle(cx, cy, 10);
    ring.stroke({ color, width: 3, alpha: 0.8 });
    this.effectsContainer.addChild(ring);
    let frame = 0;
    const animate = () => {
      frame++;
      ring.clear();
      const radius = 10 + frame * 4;
      ring.circle(cx, cy, radius);
      ring.stroke({ color, width: 3, alpha: 0.8 * (1 - frame / 15) });
      if (frame < 15) requestAnimationFrame(animate);
      else this.effectsContainer.removeChild(ring);
    };
    requestAnimationFrame(animate);

    // Sparkle particles
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      this.spawnParticle(cx, cy, Math.cos(angle) * 2, Math.sin(angle) * 2, color, 18, 2.5, 0);
    }
  }

  /* ═══ UNIT IMAGES ═══ */

  private async loadUnitImage(container: Container, url: string, unit: BoardUnit): Promise<void> {
    try {
      let texture = this.unitTextures.get(url);
      if (!texture) { texture = await Assets.load(url) as Texture; this.unitTextures.set(url, texture); }
      const sprite = new Sprite(texture!);
      const size = TILE_W * 0.65;
      sprite.width = size; sprite.height = size;
      sprite.x = (TILE_W - size) / 2; sprite.y = (TILE_H - size) / 2 - 4;
      const mask = new Graphics();
      mask.circle(TILE_W / 2, TILE_H / 2 - 4, size / 2);
      mask.fill({ color: 0xffffff });
      container.addChild(mask);
      sprite.mask = mask;
      container.addChild(sprite);
    } catch {
      const initial = new Text({
        text: unit.card.name.charAt(0).toUpperCase(),
        style: new TextStyle({ fontSize: 22, fontWeight: "bold", fill: 0xffffff, fontFamily: "monospace" }),
      });
      initial.x = TILE_W / 2 - initial.width / 2;
      initial.y = TILE_H / 2 - initial.height / 2;
      container.addChild(initial);
    }
  }

  /* ═══ HIGHLIGHTS ═══ */

  highlightTiles(tiles: [number, number][], color: number = 0x00ff88): void {
    this.highlightContainer.removeChildren();
    for (const [r, c] of tiles) {
      const x = this.tileX(c), y = this.tileY(r);
      const hl = new Graphics();
      hl.rect(x, y, TILE_W, TILE_H);
      hl.fill({ color, alpha: 0.2 });
      hl.stroke({ color, width: 2 });
      hl.eventMode = "static"; hl.cursor = "pointer";
      const row = r, col = c;
      hl.on("pointerdown", () => this.onTileClick?.(row, col));
      this.highlightContainer.addChild(hl);
    }
  }

  highlightUnits(unitIds: string[], state: DuelystGameState, color: number = 0xff4444): void {
    for (const id of unitIds) {
      const unit = findUnit(state, id);
      if (!unit) continue;
      const x = this.tileX(unit.col), y = this.tileY(unit.row);
      const hl = new Graphics();
      hl.rect(x, y, TILE_W, TILE_H);
      hl.fill({ color, alpha: 0.15 });
      hl.stroke({ color, width: 3 });
      hl.eventMode = "static"; hl.cursor = "pointer";
      const unitId = id;
      hl.on("pointerdown", (e) => { e.stopPropagation(); this.onUnitClick?.(unitId); });
      this.highlightContainer.addChild(hl);
    }
  }

  clearHighlights(): void { this.highlightContainer.removeChildren(); }

  highlightSelected(unitId: string, state: DuelystGameState): void {
    const unit = findUnit(state, unitId);
    if (!unit) return;
    const x = this.tileX(unit.col), y = this.tileY(unit.row);
    const hl = new Graphics();
    hl.rect(x - 2, y - 2, TILE_W + 4, TILE_H + 4);
    hl.stroke({ color: 0xffffff, width: 3 });
    this.highlightContainer.addChild(hl);
  }

  /* ═══ FLOATING NUMBERS ═══ */

  showDamageNumber(row: number, col: number, damage: number): void {
    const cx = this.tileCX(col), cy = this.tileCY(row);
    const text = new Text({ text: `-${damage}`, style: new TextStyle({ fontSize: 22, fontWeight: "bold", fill: 0xff4444, fontFamily: "monospace", stroke: { color: 0x000000, width: 3 } }) });
    text.x = cx - text.width / 2; text.y = cy - 20;
    this.effectsContainer.addChild(text);
    let frame = 0;
    const animate = () => {
      frame++;
      text.y -= 1.2;
      text.alpha = 1 - frame / 35;
      text.scale.set(1 + frame * 0.01);
      if (frame < 35) requestAnimationFrame(animate);
      else this.effectsContainer.removeChild(text);
    };
    requestAnimationFrame(animate);
  }

  showHealNumber(row: number, col: number, amount: number): void {
    const cx = this.tileCX(col), cy = this.tileCY(row);
    const text = new Text({ text: `+${amount}`, style: new TextStyle({ fontSize: 22, fontWeight: "bold", fill: 0x44ff44, fontFamily: "monospace", stroke: { color: 0x000000, width: 3 } }) });
    text.x = cx - text.width / 2; text.y = cy - 20;
    this.effectsContainer.addChild(text);
    let frame = 0;
    const animate = () => {
      frame++;
      text.y -= 1.2;
      text.alpha = 1 - frame / 35;
      if (frame < 35) requestAnimationFrame(animate);
      else this.effectsContainer.removeChild(text);
    };
    requestAnimationFrame(animate);
  }

  /* ═══ UTILITY ═══ */

  getWidth(): number { return BOARD_W * (TILE_W + TILE_GAP) + BOARD_PAD * 2; }
  getHeight(): number { return BOARD_H * (TILE_H + TILE_GAP) + BOARD_PAD * 2; }

  destroy(): void {
    this.animating = false;
    this.app.destroy(true);
    this.tileSprites.clear();
    this.unitSprites.clear();
    this.unitTextures.clear();
    this.particles = [];
    this.previousBoard.clear();
    this.initialized = false;
  }
}

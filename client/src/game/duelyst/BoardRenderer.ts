/* ═══════════════════════════════════════════════════════
   BOARD RENDERER — PixiJS 8 WebGL rendering for the
   5×9 tactical board with units, tiles, and effects
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

export class BoardRenderer {
  private app: Application;
  private boardContainer: Container;
  private unitsContainer: Container;
  private effectsContainer: Container;
  private highlightContainer: Container;
  private tileSprites: Map<string, Graphics> = new Map();
  private unitSprites: Map<string, Container> = new Map();
  private unitTextures: Map<string, Texture> = new Map();
  private onTileClick: ((row: number, col: number) => void) | null = null;
  private onUnitClick: ((unitId: string) => void) | null = null;
  private initialized = false;

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
    this.initialized = true;
  }

  setCallbacks(onTile: (row: number, col: number) => void, onUnit: (unitId: string) => void): void {
    this.onTileClick = onTile;
    this.onUnitClick = onUnit;
  }

  private drawBoard(): void {
    for (let r = 0; r < BOARD_H; r++) {
      for (let c = 0; c < BOARD_W; c++) {
        const tile = new Graphics();
        const x = BOARD_PAD + c * (TILE_W + TILE_GAP);
        const y = BOARD_PAD + r * (TILE_H + TILE_GAP);
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

  update(state: DuelystGameState): void {
    if (!this.initialized) return;
    this.unitsContainer.removeChildren();
    this.unitSprites.clear();

    for (const [key, unit] of state.board) {
      const [r, c] = key.split(",").map(Number);
      const x = BOARD_PAD + c * (TILE_W + TILE_GAP);
      const y = BOARD_PAD + r * (TILE_H + TILE_GAP);
      const container = new Container();
      container.x = x;
      container.y = y;

      const color = unit.owner === 0
        ? parseInt(FACTION_COLORS[state.players[0].faction].replace("#", ""), 16)
        : parseInt(FACTION_COLORS[state.players[1].faction].replace("#", ""), 16);

      const bg = new Graphics();
      bg.circle(TILE_W / 2, TILE_H / 2, TILE_W * 0.38);
      bg.fill({ color, alpha: 0.3 });
      bg.stroke({ color, width: 2 });
      container.addChild(bg);

      if (unit.isGeneral) {
        const crown = new Graphics();
        crown.rect(TILE_W / 2 - 8, 4, 16, 8);
        crown.fill({ color: 0xffd700 });
        container.addChild(crown);
      }

      if (unit.card.imageUrl) {
        this.loadUnitImage(container, unit.card.imageUrl, unit);
      } else {
        const initial = new Text({ text: unit.card.name.charAt(0).toUpperCase(), style: new TextStyle({ fontSize: 24, fontWeight: "bold", fill: 0xffffff, fontFamily: "monospace" }) });
        initial.x = TILE_W / 2 - initial.width / 2;
        initial.y = TILE_H / 2 - initial.height / 2;
        container.addChild(initial);
      }

      // Attack stat
      const atkBg = new Graphics();
      atkBg.circle(8, TILE_H - 8, 10);
      atkBg.fill({ color: 0xff4444 });
      container.addChild(atkBg);
      const atkText = new Text({ text: `${unit.currentAttack}`, style: new TextStyle({ fontSize: 11, fontWeight: "bold", fill: 0xffffff, fontFamily: "monospace" }) });
      atkText.x = 8 - atkText.width / 2;
      atkText.y = TILE_H - 8 - atkText.height / 2;
      container.addChild(atkText);

      // Health stat
      const hpBg = new Graphics();
      hpBg.circle(TILE_W - 8, TILE_H - 8, 10);
      hpBg.fill({ color: unit.currentHealth <= unit.maxHealth * 0.3 ? 0xff0000 : 0x44ff44 });
      container.addChild(hpBg);
      const hpText = new Text({ text: `${unit.currentHealth}`, style: new TextStyle({ fontSize: 11, fontWeight: "bold", fill: 0xffffff, fontFamily: "monospace" }) });
      hpText.x = TILE_W - 8 - hpText.width / 2;
      hpText.y = TILE_H - 8 - hpText.height / 2;
      container.addChild(hpText);

      if (unit.activeKeywords.has("provoke") || unit.activeKeywords.has("taunt")) {
        const border = new Graphics();
        border.rect(0, 0, TILE_W, TILE_H);
        border.stroke({ color: 0xffaa00, width: 3 });
        container.addChild(border);
      }
      if (unit.isStunned) {
        const overlay = new Graphics();
        overlay.rect(0, 0, TILE_W, TILE_H);
        overlay.fill({ color: 0x0000ff, alpha: 0.2 });
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
      const initial = new Text({ text: unit.card.name.charAt(0).toUpperCase(), style: new TextStyle({ fontSize: 22, fontWeight: "bold", fill: 0xffffff, fontFamily: "monospace" }) });
      initial.x = TILE_W / 2 - initial.width / 2;
      initial.y = TILE_H / 2 - initial.height / 2;
      container.addChild(initial);
    }
  }

  highlightTiles(tiles: [number, number][], color: number = 0x00ff88): void {
    this.highlightContainer.removeChildren();
    for (const [r, c] of tiles) {
      const x = BOARD_PAD + c * (TILE_W + TILE_GAP);
      const y = BOARD_PAD + r * (TILE_H + TILE_GAP);
      const hl = new Graphics();
      hl.rect(x, y, TILE_W, TILE_H);
      hl.fill({ color, alpha: 0.25 });
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
      const x = BOARD_PAD + unit.col * (TILE_W + TILE_GAP);
      const y = BOARD_PAD + unit.row * (TILE_H + TILE_GAP);
      const hl = new Graphics();
      hl.rect(x, y, TILE_W, TILE_H);
      hl.fill({ color, alpha: 0.2 });
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
    const x = BOARD_PAD + unit.col * (TILE_W + TILE_GAP);
    const y = BOARD_PAD + unit.row * (TILE_H + TILE_GAP);
    const hl = new Graphics();
    hl.rect(x - 2, y - 2, TILE_W + 4, TILE_H + 4);
    hl.stroke({ color: 0xffffff, width: 3 });
    this.highlightContainer.addChild(hl);
  }

  showDamageNumber(row: number, col: number, damage: number): void {
    const x = BOARD_PAD + col * (TILE_W + TILE_GAP) + TILE_W / 2;
    const y = BOARD_PAD + row * (TILE_H + TILE_GAP);
    const text = new Text({ text: `-${damage}`, style: new TextStyle({ fontSize: 20, fontWeight: "bold", fill: 0xff4444, fontFamily: "monospace" }) });
    text.x = x - text.width / 2; text.y = y;
    this.effectsContainer.addChild(text);
    let frame = 0;
    const animate = () => { frame++; text.y -= 1.5; text.alpha -= 0.03; if (frame < 30) requestAnimationFrame(animate); else this.effectsContainer.removeChild(text); };
    requestAnimationFrame(animate);
  }

  showHealNumber(row: number, col: number, amount: number): void {
    const x = BOARD_PAD + col * (TILE_W + TILE_GAP) + TILE_W / 2;
    const y = BOARD_PAD + row * (TILE_H + TILE_GAP);
    const text = new Text({ text: `+${amount}`, style: new TextStyle({ fontSize: 20, fontWeight: "bold", fill: 0x44ff44, fontFamily: "monospace" }) });
    text.x = x - text.width / 2; text.y = y;
    this.effectsContainer.addChild(text);
    let frame = 0;
    const animate = () => { frame++; text.y -= 1.5; text.alpha -= 0.03; if (frame < 30) requestAnimationFrame(animate); else this.effectsContainer.removeChild(text); };
    requestAnimationFrame(animate);
  }

  getWidth(): number { return BOARD_W * (TILE_W + TILE_GAP) + BOARD_PAD * 2; }
  getHeight(): number { return BOARD_H * (TILE_H + TILE_GAP) + BOARD_PAD * 2; }

  destroy(): void {
    this.app.destroy(true);
    this.tileSprites.clear();
    this.unitSprites.clear();
    this.unitTextures.clear();
    this.initialized = false;
  }
}

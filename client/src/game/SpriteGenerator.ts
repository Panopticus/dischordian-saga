/* ═══════════════════════════════════════════════════════
   SPRITE GENERATOR — Procedural pixel-art fighter sprites
   Generates unique character models with faction-based
   body types, armor, weapons, and color palettes.
   Each character gets 8 animation states with multiple frames.
   ═══════════════════════════════════════════════════════ */

export type AnimState = "idle" | "walk" | "punch" | "kick" | "block" | "special" | "hit" | "victory" | "ko" | "crouch";

export interface SpriteFrame {
  canvas: OffscreenCanvas;
  duration: number; // frames this frame lasts
}

export interface CharacterSprite {
  id: string;
  animations: Record<AnimState, SpriteFrame[]>;
  width: number;
  height: number;
}

// Character body archetype definitions
interface BodyDef {
  headSize: number;      // radius
  torsoW: number;
  torsoH: number;
  shoulderW: number;
  armW: number;
  armLen: number;
  legW: number;
  legLen: number;
  hipW: number;
}

interface CharacterVisual {
  body: BodyDef;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  eyeColor: string;
  hasHelmet: boolean;
  helmetStyle: "visor" | "crown" | "hood" | "mask" | "horns" | "halo" | "none";
  hasCape: boolean;
  hasShoulderPads: boolean;
  weaponType: "none" | "sword" | "staff" | "claws" | "dual-blades" | "hammer" | "scythe" | "chains" | "gauntlets" | "orb";
  armorStyle: "light" | "medium" | "heavy" | "robes" | "tech";
  glowEffect: boolean;
  glowColor: string;
}

const SPRITE_W = 128;
const SPRITE_H = 192;

// Map character IDs to unique visual definitions
const CHARACTER_VISUALS: Record<string, Partial<CharacterVisual>> = {
  "architect": {
    primaryColor: "#dc2626", secondaryColor: "#1a0000", accentColor: "#ff6b6b",
    eyeColor: "#ff0000", hasHelmet: true, helmetStyle: "crown", hasCape: true,
    hasShoulderPads: true, weaponType: "orb", armorStyle: "heavy", glowEffect: true, glowColor: "#ef4444",
    body: { headSize: 12, torsoW: 30, torsoH: 38, shoulderW: 38, armW: 8, armLen: 32, legW: 10, legLen: 36, hipW: 24 },
  },
  "collector": {
    primaryColor: "#7c3aed", secondaryColor: "#1a0033", accentColor: "#c084fc",
    eyeColor: "#a855f7", hasHelmet: true, helmetStyle: "hood", hasCape: true,
    hasShoulderPads: false, weaponType: "staff", armorStyle: "robes", glowEffect: true, glowColor: "#a855f7",
    body: { headSize: 11, torsoW: 26, torsoH: 36, shoulderW: 32, armW: 7, armLen: 30, legW: 9, legLen: 34, hipW: 22 },
  },
  "enigma": {
    primaryColor: "#0891b2", secondaryColor: "#001a2e", accentColor: "#22d3ee",
    eyeColor: "#22d3ee", hasHelmet: false, helmetStyle: "none", hasCape: false,
    hasShoulderPads: false, weaponType: "dual-blades", armorStyle: "light", glowEffect: true, glowColor: "#22d3ee",
    body: { headSize: 11, torsoW: 24, torsoH: 34, shoulderW: 30, armW: 7, armLen: 30, legW: 9, legLen: 36, hipW: 20 },
  },
  "warlord": {
    primaryColor: "#d97706", secondaryColor: "#1a0f00", accentColor: "#fbbf24",
    eyeColor: "#f59e0b", hasHelmet: true, helmetStyle: "visor", hasCape: false,
    hasShoulderPads: true, weaponType: "hammer", armorStyle: "heavy", glowEffect: false, glowColor: "#f59e0b",
    body: { headSize: 13, torsoW: 34, torsoH: 40, shoulderW: 42, armW: 10, armLen: 34, legW: 12, legLen: 36, hipW: 28 },
  },
  "necromancer": {
    primaryColor: "#059669", secondaryColor: "#001a0f", accentColor: "#34d399",
    eyeColor: "#10b981", hasHelmet: true, helmetStyle: "hood", hasCape: true,
    hasShoulderPads: false, weaponType: "scythe", armorStyle: "robes", glowEffect: true, glowColor: "#10b981",
    body: { headSize: 11, torsoW: 26, torsoH: 36, shoulderW: 30, armW: 7, armLen: 32, legW: 9, legLen: 34, hipW: 20 },
  },
  "meme": {
    primaryColor: "#db2777", secondaryColor: "#1a0015", accentColor: "#f472b6",
    eyeColor: "#ec4899", hasHelmet: true, helmetStyle: "mask", hasCape: false,
    hasShoulderPads: false, weaponType: "claws", armorStyle: "light", glowEffect: true, glowColor: "#ec4899",
    body: { headSize: 11, torsoW: 24, torsoH: 34, shoulderW: 28, armW: 7, armLen: 30, legW: 8, legLen: 36, hipW: 20 },
  },
  "shadow-tongue": {
    primaryColor: "#4338ca", secondaryColor: "#0a0033", accentColor: "#818cf8",
    eyeColor: "#6366f1", hasHelmet: true, helmetStyle: "hood", hasCape: true,
    hasShoulderPads: false, weaponType: "none", armorStyle: "robes", glowEffect: true, glowColor: "#6366f1",
    body: { headSize: 11, torsoW: 26, torsoH: 36, shoulderW: 30, armW: 7, armLen: 30, legW: 9, legLen: 34, hipW: 22 },
  },
  "watcher": {
    primaryColor: "#0d9488", secondaryColor: "#001a1a", accentColor: "#2dd4bf",
    eyeColor: "#14b8a6", hasHelmet: true, helmetStyle: "visor", hasCape: false,
    hasShoulderPads: true, weaponType: "orb", armorStyle: "tech", glowEffect: true, glowColor: "#14b8a6",
    body: { headSize: 12, torsoW: 28, torsoH: 36, shoulderW: 34, armW: 8, armLen: 30, legW: 10, legLen: 34, hipW: 24 },
  },
  "game-master": {
    primaryColor: "#ea580c", secondaryColor: "#1a0800", accentColor: "#fb923c",
    eyeColor: "#f97316", hasHelmet: true, helmetStyle: "crown", hasCape: true,
    hasShoulderPads: true, weaponType: "staff", armorStyle: "medium", glowEffect: true, glowColor: "#f97316",
    body: { headSize: 12, torsoW: 28, torsoH: 38, shoulderW: 34, armW: 8, armLen: 32, legW: 10, legLen: 34, hipW: 24 },
  },
  "authority": {
    primaryColor: "#ca8a04", secondaryColor: "#1a1200", accentColor: "#fde047",
    eyeColor: "#eab308", hasHelmet: true, helmetStyle: "crown", hasCape: true,
    hasShoulderPads: true, weaponType: "hammer", armorStyle: "heavy", glowEffect: true, glowColor: "#eab308",
    body: { headSize: 13, torsoW: 32, torsoH: 40, shoulderW: 40, armW: 10, armLen: 34, legW: 12, legLen: 36, hipW: 26 },
  },
  "source": {
    primaryColor: "#b91c1c", secondaryColor: "#1a0000", accentColor: "#fca5a5",
    eyeColor: "#dc2626", hasHelmet: true, helmetStyle: "horns", hasCape: false,
    hasShoulderPads: true, weaponType: "gauntlets", armorStyle: "heavy", glowEffect: true, glowColor: "#dc2626",
    body: { headSize: 13, torsoW: 32, torsoH: 40, shoulderW: 40, armW: 10, armLen: 34, legW: 12, legLen: 36, hipW: 26 },
  },
  "jailer": {
    primaryColor: "#57534e", secondaryColor: "#1c1917", accentColor: "#a8a29e",
    eyeColor: "#78716c", hasHelmet: true, helmetStyle: "visor", hasCape: false,
    hasShoulderPads: true, weaponType: "chains", armorStyle: "heavy", glowEffect: false, glowColor: "#78716c",
    body: { headSize: 13, torsoW: 34, torsoH: 42, shoulderW: 42, armW: 11, armLen: 34, legW: 12, legLen: 36, hipW: 28 },
  },
  "host": {
    primaryColor: "#6d28d9", secondaryColor: "#1a0040", accentColor: "#a78bfa",
    eyeColor: "#7c3aed", hasHelmet: false, helmetStyle: "none", hasCape: false,
    hasShoulderPads: false, weaponType: "gauntlets", armorStyle: "medium", glowEffect: true, glowColor: "#7c3aed",
    body: { headSize: 12, torsoW: 28, torsoH: 36, shoulderW: 34, armW: 8, armLen: 32, legW: 10, legLen: 36, hipW: 24 },
  },
  // Ne-Yons
  "dreamer": {
    primaryColor: "#6366f1", secondaryColor: "#1e1b4b", accentColor: "#a5b4fc",
    eyeColor: "#818cf8", hasHelmet: false, helmetStyle: "none", hasCape: true,
    hasShoulderPads: false, weaponType: "orb", armorStyle: "robes", glowEffect: true, glowColor: "#818cf8",
    body: { headSize: 11, torsoW: 24, torsoH: 34, shoulderW: 28, armW: 7, armLen: 30, legW: 8, legLen: 34, hipW: 20 },
  },
  "judge": {
    primaryColor: "#ca8a04", secondaryColor: "#1a1200", accentColor: "#fde047",
    eyeColor: "#fbbf24", hasHelmet: false, helmetStyle: "none", hasCape: false,
    hasShoulderPads: true, weaponType: "hammer", armorStyle: "medium", glowEffect: true, glowColor: "#fbbf24",
    body: { headSize: 12, torsoW: 30, torsoH: 38, shoulderW: 36, armW: 9, armLen: 32, legW: 10, legLen: 36, hipW: 24 },
  },
  "inventor": {
    primaryColor: "#db2777", secondaryColor: "#500724", accentColor: "#f9a8d4",
    eyeColor: "#f472b6", hasHelmet: true, helmetStyle: "visor", hasCape: false,
    hasShoulderPads: false, weaponType: "gauntlets", armorStyle: "tech", glowEffect: true, glowColor: "#f472b6",
    body: { headSize: 11, torsoW: 26, torsoH: 34, shoulderW: 30, armW: 8, armLen: 30, legW: 9, legLen: 34, hipW: 22 },
  },
  "seer": {
    primaryColor: "#06b6d4", secondaryColor: "#083344", accentColor: "#67e8f9",
    eyeColor: "#67e8f9", hasHelmet: false, helmetStyle: "none", hasCape: true,
    hasShoulderPads: false, weaponType: "orb", armorStyle: "light", glowEffect: true, glowColor: "#67e8f9",
    body: { headSize: 10, torsoW: 22, torsoH: 32, shoulderW: 26, armW: 6, armLen: 28, legW: 8, legLen: 34, hipW: 18 },
  },
  "knowledge": {
    primaryColor: "#059669", secondaryColor: "#022c22", accentColor: "#6ee7b7",
    eyeColor: "#34d399", hasHelmet: true, helmetStyle: "halo", hasCape: true,
    hasShoulderPads: false, weaponType: "staff", armorStyle: "robes", glowEffect: true, glowColor: "#34d399",
    body: { headSize: 12, torsoW: 26, torsoH: 36, shoulderW: 30, armW: 7, armLen: 30, legW: 9, legLen: 34, hipW: 22 },
  },
  "silence": {
    primaryColor: "#334155", secondaryColor: "#0f172a", accentColor: "#64748b",
    eyeColor: "#475569", hasHelmet: true, helmetStyle: "mask", hasCape: true,
    hasShoulderPads: false, weaponType: "dual-blades", armorStyle: "light", glowEffect: false, glowColor: "#475569",
    body: { headSize: 10, torsoW: 24, torsoH: 34, shoulderW: 28, armW: 7, armLen: 30, legW: 8, legLen: 36, hipW: 20 },
  },
  "storm": {
    primaryColor: "#2563eb", secondaryColor: "#1e3a5f", accentColor: "#93c5fd",
    eyeColor: "#60a5fa", hasHelmet: false, helmetStyle: "none", hasCape: false,
    hasShoulderPads: true, weaponType: "gauntlets", armorStyle: "medium", glowEffect: true, glowColor: "#60a5fa",
    body: { headSize: 12, torsoW: 30, torsoH: 38, shoulderW: 36, armW: 9, armLen: 32, legW: 10, legLen: 36, hipW: 24 },
  },
  "degen": {
    primaryColor: "#ea580c", secondaryColor: "#431407", accentColor: "#fdba74",
    eyeColor: "#fb923c", hasHelmet: true, helmetStyle: "mask", hasCape: false,
    hasShoulderPads: false, weaponType: "claws", armorStyle: "light", glowEffect: true, glowColor: "#fb923c",
    body: { headSize: 11, torsoW: 24, torsoH: 34, shoulderW: 28, armW: 7, armLen: 30, legW: 8, legLen: 36, hipW: 20 },
  },
  "advocate": {
    primaryColor: "#ca8a04", secondaryColor: "#422006", accentColor: "#fde68a",
    eyeColor: "#fcd34d", hasHelmet: false, helmetStyle: "none", hasCape: false,
    hasShoulderPads: false, weaponType: "sword", armorStyle: "medium", glowEffect: true, glowColor: "#fcd34d",
    body: { headSize: 11, torsoW: 26, torsoH: 36, shoulderW: 30, armW: 8, armLen: 30, legW: 9, legLen: 34, hipW: 22 },
  },
  "forgotten": {
    primaryColor: "#64748b", secondaryColor: "#1e293b", accentColor: "#cbd5e1",
    eyeColor: "#94a3b8", hasHelmet: true, helmetStyle: "hood", hasCape: true,
    hasShoulderPads: false, weaponType: "none", armorStyle: "robes", glowEffect: false, glowColor: "#94a3b8",
    body: { headSize: 11, torsoW: 24, torsoH: 34, shoulderW: 28, armW: 7, armLen: 30, legW: 8, legLen: 34, hipW: 20 },
  },
  "resurrectionist": {
    primaryColor: "#16a34a", secondaryColor: "#052e16", accentColor: "#86efac",
    eyeColor: "#4ade80", hasHelmet: true, helmetStyle: "halo", hasCape: true,
    hasShoulderPads: false, weaponType: "staff", armorStyle: "robes", glowEffect: true, glowColor: "#4ade80",
    body: { headSize: 11, torsoW: 26, torsoH: 36, shoulderW: 30, armW: 7, armLen: 30, legW: 9, legLen: 34, hipW: 22 },
  },
  "akai-shi": {
    primaryColor: "#dc2626", secondaryColor: "#450a0a", accentColor: "#fca5a5",
    eyeColor: "#ef4444", hasHelmet: true, helmetStyle: "mask", hasCape: false,
    hasShoulderPads: false, weaponType: "sword", armorStyle: "light", glowEffect: true, glowColor: "#dc2626",
    body: { headSize: 11, torsoW: 24, torsoH: 34, shoulderW: 28, armW: 7, armLen: 32, legW: 9, legLen: 36, hipW: 20 },
  },
  "wraith-calder": {
    primaryColor: "#7c3aed", secondaryColor: "#2e1065", accentColor: "#c4b5fd",
    eyeColor: "#a78bfa", hasHelmet: false, helmetStyle: "none", hasCape: true,
    hasShoulderPads: false, weaponType: "dual-blades", armorStyle: "light", glowEffect: true, glowColor: "#a78bfa",
    body: { headSize: 10, torsoW: 22, torsoH: 32, shoulderW: 26, armW: 6, armLen: 30, legW: 8, legLen: 36, hipW: 18 },
  },
  "wolf": {
    primaryColor: "#57534e", secondaryColor: "#1c1917", accentColor: "#d6d3d1",
    eyeColor: "#fbbf24", hasHelmet: false, helmetStyle: "none", hasCape: false,
    hasShoulderPads: true, weaponType: "claws", armorStyle: "medium", glowEffect: false, glowColor: "#78716c",
    body: { headSize: 13, torsoW: 32, torsoH: 40, shoulderW: 40, armW: 10, armLen: 34, legW: 12, legLen: 36, hipW: 26 },
  },
  "iron-lion": {
    primaryColor: "#b45309", secondaryColor: "#451a03", accentColor: "#fcd34d",
    eyeColor: "#f59e0b", hasHelmet: true, helmetStyle: "visor", hasCape: false,
    hasShoulderPads: true, weaponType: "gauntlets", armorStyle: "heavy", glowEffect: true, glowColor: "#d97706",
    body: { headSize: 14, torsoW: 36, torsoH: 42, shoulderW: 44, armW: 12, armLen: 36, legW: 14, legLen: 36, hipW: 30 },
  },
  "engineer": {
    primaryColor: "#0891b2", secondaryColor: "#083344", accentColor: "#67e8f9",
    eyeColor: "#06b6d4", hasHelmet: true, helmetStyle: "visor", hasCape: false,
    hasShoulderPads: false, weaponType: "gauntlets", armorStyle: "tech", glowEffect: true, glowColor: "#06b6d4",
    body: { headSize: 11, torsoW: 28, torsoH: 36, shoulderW: 32, armW: 8, armLen: 30, legW: 10, legLen: 34, hipW: 24 },
  },
  "oracle": {
    primaryColor: "#c026d3", secondaryColor: "#4a044e", accentColor: "#f0abfc",
    eyeColor: "#e879f9", hasHelmet: false, helmetStyle: "none", hasCape: true,
    hasShoulderPads: false, weaponType: "orb", armorStyle: "robes", glowEffect: true, glowColor: "#e879f9",
    body: { headSize: 11, torsoW: 24, torsoH: 34, shoulderW: 28, armW: 7, armLen: 30, legW: 8, legLen: 34, hipW: 20 },
  },
  "eyes": {
    primaryColor: "#0891b2", secondaryColor: "#164e63", accentColor: "#67e8f9",
    eyeColor: "#22d3ee", hasHelmet: true, helmetStyle: "visor", hasCape: false,
    hasShoulderPads: false, weaponType: "dual-blades", armorStyle: "tech", glowEffect: true, glowColor: "#22d3ee",
    body: { headSize: 10, torsoW: 22, torsoH: 32, shoulderW: 26, armW: 6, armLen: 30, legW: 8, legLen: 36, hipW: 18 },
  },
  "agent-zero": {
    primaryColor: "#1e293b", secondaryColor: "#020617", accentColor: "#475569",
    eyeColor: "#ef4444", hasHelmet: true, helmetStyle: "mask", hasCape: false,
    hasShoulderPads: false, weaponType: "dual-blades", armorStyle: "light", glowEffect: false, glowColor: "#1e293b",
    body: { headSize: 10, torsoW: 24, torsoH: 34, shoulderW: 28, armW: 7, armLen: 32, legW: 8, legLen: 38, hipW: 20 },
  },
};

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const nr = Math.min(255, r + Math.round(amount * 255));
  const ng = Math.min(255, g + Math.round(amount * 255));
  const nb = Math.min(255, b + Math.round(amount * 255));
  return `rgb(${nr},${ng},${nb})`;
}

function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const nr = Math.max(0, r - Math.round(amount * 255));
  const ng = Math.max(0, g - Math.round(amount * 255));
  const nb = Math.max(0, b - Math.round(amount * 255));
  return `rgb(${nr},${ng},${nb})`;
}

function getVisual(id: string): CharacterVisual {
  const custom = CHARACTER_VISUALS[id] || {};
  const defaultBody: BodyDef = {
    headSize: 12, torsoW: 28, torsoH: 36, shoulderW: 34,
    armW: 8, armLen: 30, legW: 10, legLen: 34, hipW: 24,
  };
  return {
    body: custom.body || defaultBody,
    primaryColor: custom.primaryColor || "#6366f1",
    secondaryColor: custom.secondaryColor || "#1e1b4b",
    accentColor: custom.accentColor || "#a5b4fc",
    eyeColor: custom.eyeColor || "#818cf8",
    hasHelmet: custom.hasHelmet ?? false,
    helmetStyle: custom.helmetStyle || "none",
    hasCape: custom.hasCape ?? false,
    hasShoulderPads: custom.hasShoulderPads ?? false,
    weaponType: custom.weaponType || "none",
    armorStyle: custom.armorStyle || "medium",
    glowEffect: custom.glowEffect ?? false,
    glowColor: custom.glowColor || "#6366f1",
  };
}

/* ─── DRAWING HELPERS ─── */

function drawBody(
  ctx: OffscreenCanvasRenderingContext2D,
  vis: CharacterVisual,
  cx: number,
  baseY: number,
  pose: {
    headTilt?: number;
    torsoLean?: number;
    leftArmAngle?: number;
    rightArmAngle?: number;
    leftLegAngle?: number;
    rightLegAngle?: number;
    leftForearmAngle?: number;
    rightForearmAngle?: number;
    crouching?: boolean;
  }
) {
  const b = vis.body;
  const lean = pose.torsoLean || 0;
  const crouch = pose.crouching ? 12 : 0;

  // Torso center
  const torsoX = cx + lean;
  const torsoTopY = baseY - b.legLen - b.torsoH + crouch;
  const torsoBottomY = baseY - b.legLen + crouch;
  const torsoCenterY = torsoTopY + b.torsoH / 2;

  // Cape (behind body)
  if (vis.hasCape) {
    ctx.fillStyle = darken(vis.primaryColor, 0.2);
    ctx.beginPath();
    ctx.moveTo(torsoX - b.shoulderW / 2 + 2, torsoTopY + 4);
    ctx.quadraticCurveTo(torsoX - b.shoulderW / 2 - 6, torsoBottomY + b.legLen * 0.6, torsoX - 4, baseY + 4);
    ctx.lineTo(torsoX + 4, baseY + 4);
    ctx.quadraticCurveTo(torsoX + b.shoulderW / 2 + 6, torsoBottomY + b.legLen * 0.6, torsoX + b.shoulderW / 2 - 2, torsoTopY + 4);
    ctx.closePath();
    ctx.fill();
  }

  // Legs
  const leftLegAngle = pose.leftLegAngle || 0;
  const rightLegAngle = pose.rightLegAngle || 0;
  drawLimb(ctx, torsoX - b.hipW / 2, torsoBottomY, b.legW, b.legLen, leftLegAngle, darken(vis.primaryColor, 0.15), vis.armorStyle === "heavy");
  drawLimb(ctx, torsoX + b.hipW / 2 - b.legW, torsoBottomY, b.legW, b.legLen, rightLegAngle, darken(vis.primaryColor, 0.15), vis.armorStyle === "heavy");

  // Boots
  const lFootX = torsoX - b.hipW / 2 + Math.sin(leftLegAngle) * b.legLen;
  const lFootY = torsoBottomY + Math.cos(leftLegAngle) * b.legLen;
  const rFootX = torsoX + b.hipW / 2 - b.legW + Math.sin(rightLegAngle) * b.legLen;
  const rFootY = torsoBottomY + Math.cos(rightLegAngle) * b.legLen;
  drawBoot(ctx, lFootX, lFootY, b.legW + 4, vis.secondaryColor);
  drawBoot(ctx, rFootX, rFootY, b.legW + 4, vis.secondaryColor);

  // Torso
  const torsoGrad = ctx.createLinearGradient(torsoX - b.torsoW / 2, torsoTopY, torsoX + b.torsoW / 2, torsoBottomY);
  torsoGrad.addColorStop(0, vis.primaryColor);
  torsoGrad.addColorStop(0.5, lighten(vis.primaryColor, 0.05));
  torsoGrad.addColorStop(1, darken(vis.primaryColor, 0.1));
  ctx.fillStyle = torsoGrad;
  ctx.beginPath();
  ctx.moveTo(torsoX - b.shoulderW / 2, torsoTopY);
  ctx.lineTo(torsoX + b.shoulderW / 2, torsoTopY);
  ctx.lineTo(torsoX + b.hipW / 2, torsoBottomY);
  ctx.lineTo(torsoX - b.hipW / 2, torsoBottomY);
  ctx.closePath();
  ctx.fill();

  // Armor detail lines
  if (vis.armorStyle === "heavy" || vis.armorStyle === "tech") {
    ctx.strokeStyle = vis.accentColor + "60";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(torsoX, torsoTopY + 4);
    ctx.lineTo(torsoX, torsoBottomY - 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(torsoX - b.torsoW / 3, torsoCenterY);
    ctx.lineTo(torsoX + b.torsoW / 3, torsoCenterY);
    ctx.stroke();
  }

  if (vis.armorStyle === "tech") {
    // Tech lines
    ctx.strokeStyle = vis.accentColor + "40";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 3; i++) {
      const y = torsoTopY + 8 + i * 10;
      ctx.beginPath();
      ctx.moveTo(torsoX - b.torsoW / 3, y);
      ctx.lineTo(torsoX + b.torsoW / 3, y);
      ctx.stroke();
    }
  }

  // Shoulder pads
  if (vis.hasShoulderPads) {
    drawShoulderPad(ctx, torsoX - b.shoulderW / 2 - 4, torsoTopY - 2, 14, vis.secondaryColor, vis.accentColor);
    drawShoulderPad(ctx, torsoX + b.shoulderW / 2 - 10, torsoTopY - 2, 14, vis.secondaryColor, vis.accentColor);
  }

  // Arms
  const leftArmAngle = pose.leftArmAngle || -0.3;
  const rightArmAngle = pose.rightArmAngle || 0.3;
  const leftForearmAngle = pose.leftForearmAngle || 0.4;
  const rightForearmAngle = pose.rightForearmAngle || -0.4;

  const lShoulderX = torsoX - b.shoulderW / 2;
  const rShoulderX = torsoX + b.shoulderW / 2;
  const shoulderY = torsoTopY + 4;

  // Upper arms
  drawLimb(ctx, lShoulderX, shoulderY, b.armW, b.armLen * 0.55, leftArmAngle, vis.primaryColor, false);
  drawLimb(ctx, rShoulderX - b.armW, shoulderY, b.armW, b.armLen * 0.55, rightArmAngle, vis.primaryColor, false);

  // Forearms
  const lElbowX = lShoulderX + Math.sin(leftArmAngle) * b.armLen * 0.55;
  const lElbowY = shoulderY + Math.cos(leftArmAngle) * b.armLen * 0.55;
  const rElbowX = rShoulderX - b.armW + Math.sin(rightArmAngle) * b.armLen * 0.55;
  const rElbowY = shoulderY + Math.cos(rightArmAngle) * b.armLen * 0.55;

  drawLimb(ctx, lElbowX, lElbowY, b.armW - 1, b.armLen * 0.5, leftForearmAngle, lighten(vis.primaryColor, 0.05), false);
  drawLimb(ctx, rElbowX, rElbowY, b.armW - 1, b.armLen * 0.5, rightForearmAngle, lighten(vis.primaryColor, 0.05), false);

  // Hands/gauntlets
  const lHandX = lElbowX + Math.sin(leftForearmAngle) * b.armLen * 0.5;
  const lHandY = lElbowY + Math.cos(leftForearmAngle) * b.armLen * 0.5;
  const rHandX = rElbowX + Math.sin(rightForearmAngle) * b.armLen * 0.5;
  const rHandY = rElbowY + Math.cos(rightForearmAngle) * b.armLen * 0.5;

  drawHand(ctx, lHandX, lHandY, b.armW, vis);
  drawHand(ctx, rHandX, rHandY, b.armW, vis);

  // Weapon in right hand
  drawWeapon(ctx, rHandX, rHandY, vis, rightForearmAngle);

  // Head
  const headY = torsoTopY - b.headSize - 2;
  drawHead(ctx, torsoX + lean * 0.5, headY, b.headSize, vis, pose.headTilt || 0);

  // Glow effect
  if (vis.glowEffect) {
    ctx.shadowColor = vis.glowColor;
    ctx.shadowBlur = 8;
    ctx.strokeStyle = vis.glowColor + "30";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(torsoX, torsoCenterY, b.shoulderW / 2 + 8, b.torsoH / 2 + 12, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

function drawLimb(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, w: number, len: number, angle: number, color: string, armored: boolean) {
  ctx.save();
  ctx.translate(x + w / 2, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.fillRect(-w / 2, 0, w, len);
  if (armored) {
    ctx.strokeStyle = lighten(color, 0.2) + "60";
    ctx.lineWidth = 1;
    ctx.strokeRect(-w / 2, 0, w, len);
  }
  ctx.restore();
}

function drawBoot(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, w: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x - 2, y - 2, w + 4, 8, [0, 0, 3, 3]);
  ctx.fill();
}

function drawShoulderPad(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, size: number, color: string, accent: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x + size / 2, y + size / 3, size / 2, size / 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = accent + "60";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawHand(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, armW: number, vis: CharacterVisual) {
  const size = armW * 0.7;
  if (vis.weaponType === "gauntlets" || vis.weaponType === "claws") {
    ctx.fillStyle = vis.accentColor;
    ctx.beginPath();
    ctx.arc(x, y, size + 2, 0, Math.PI * 2);
    ctx.fill();
    if (vis.weaponType === "claws") {
      ctx.strokeStyle = vis.accentColor;
      ctx.lineWidth = 1.5;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * 3, y);
        ctx.lineTo(x + i * 3 + 2, y + 10);
        ctx.stroke();
      }
    }
  } else {
    ctx.fillStyle = lighten(vis.primaryColor, 0.1);
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWeapon(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, vis: CharacterVisual, angle: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  switch (vis.weaponType) {
    case "sword": {
      ctx.fillStyle = "#c0c0c0";
      ctx.fillRect(-1.5, -30, 3, 30);
      ctx.fillStyle = vis.accentColor;
      ctx.fillRect(-4, -2, 8, 4);
      ctx.fillStyle = vis.primaryColor;
      ctx.fillRect(-2, 2, 4, 6);
      break;
    }
    case "staff": {
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(-1.5, -35, 3, 40);
      ctx.fillStyle = vis.accentColor;
      ctx.beginPath();
      ctx.arc(0, -35, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "hammer": {
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(-2, -28, 4, 32);
      ctx.fillStyle = vis.secondaryColor;
      ctx.fillRect(-8, -34, 16, 10);
      ctx.strokeStyle = vis.accentColor + "80";
      ctx.lineWidth = 1;
      ctx.strokeRect(-8, -34, 16, 10);
      break;
    }
    case "scythe": {
      ctx.fillStyle = "#5a3a1a";
      ctx.fillRect(-1.5, -35, 3, 40);
      ctx.fillStyle = "#c0c0c0";
      ctx.beginPath();
      ctx.moveTo(0, -35);
      ctx.quadraticCurveTo(18, -35, 20, -20);
      ctx.lineTo(16, -22);
      ctx.quadraticCurveTo(14, -33, 0, -33);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "chains": {
      ctx.strokeStyle = "#a8a29e";
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(8, -20);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#78716c";
      ctx.beginPath();
      ctx.arc(8, -22, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "dual-blades": {
      ctx.fillStyle = "#c0c0c0";
      ctx.fillRect(-1, -24, 2, 24);
      ctx.fillStyle = vis.accentColor + "80";
      ctx.fillRect(-3, -1, 6, 3);
      break;
    }
    case "orb": {
      ctx.fillStyle = vis.accentColor + "60";
      ctx.beginPath();
      ctx.arc(0, -10, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = vis.accentColor;
      ctx.lineWidth = 1;
      ctx.stroke();
      break;
    }
    default:
      break;
  }
  ctx.restore();
}

function drawHead(ctx: OffscreenCanvasRenderingContext2D, cx: number, cy: number, radius: number, vis: CharacterVisual, tilt: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt * 0.1);

  // Helmet/head base
  if (vis.hasHelmet) {
    switch (vis.helmetStyle) {
      case "visor": {
        ctx.fillStyle = vis.secondaryColor;
        ctx.beginPath();
        ctx.arc(0, 0, radius + 2, 0, Math.PI * 2);
        ctx.fill();
        // Visor slit
        ctx.fillStyle = vis.eyeColor;
        ctx.fillRect(-radius * 0.7, -2, radius * 1.4, 4);
        break;
      }
      case "crown": {
        ctx.fillStyle = vis.secondaryColor;
        ctx.beginPath();
        ctx.arc(0, 2, radius, 0, Math.PI * 2);
        ctx.fill();
        // Crown points
        ctx.fillStyle = vis.accentColor;
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath();
          ctx.moveTo(i * 5 - 2, -radius);
          ctx.lineTo(i * 5, -radius - 8);
          ctx.lineTo(i * 5 + 2, -radius);
          ctx.closePath();
          ctx.fill();
        }
        // Eyes
        drawEyes(ctx, 0, 0, radius, vis.eyeColor);
        break;
      }
      case "hood": {
        ctx.fillStyle = darken(vis.primaryColor, 0.3);
        ctx.beginPath();
        ctx.arc(0, 0, radius + 3, -Math.PI, 0);
        ctx.lineTo(radius + 5, radius * 0.3);
        ctx.quadraticCurveTo(0, radius + 2, -radius - 5, radius * 0.3);
        ctx.closePath();
        ctx.fill();
        // Shadowed face
        ctx.fillStyle = "#0a0a0a";
        ctx.beginPath();
        ctx.arc(0, 2, radius - 2, 0, Math.PI * 2);
        ctx.fill();
        // Glowing eyes
        ctx.fillStyle = vis.eyeColor;
        ctx.shadowColor = vis.eyeColor;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(-4, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(4, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
      }
      case "mask": {
        ctx.fillStyle = vis.secondaryColor;
        ctx.beginPath();
        ctx.arc(0, 0, radius + 1, 0, Math.PI * 2);
        ctx.fill();
        // Mask pattern
        ctx.strokeStyle = vis.accentColor + "60";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-radius, 0);
        ctx.lineTo(radius, 0);
        ctx.stroke();
        // Eyes
        ctx.fillStyle = vis.eyeColor;
        ctx.shadowColor = vis.eyeColor;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.ellipse(-4, -1, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(4, -1, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
      }
      case "horns": {
        ctx.fillStyle = vis.secondaryColor;
        ctx.beginPath();
        ctx.arc(0, 0, radius + 1, 0, Math.PI * 2);
        ctx.fill();
        // Horns
        ctx.fillStyle = vis.accentColor;
        ctx.beginPath();
        ctx.moveTo(-radius, -radius * 0.5);
        ctx.lineTo(-radius - 8, -radius - 12);
        ctx.lineTo(-radius + 4, -radius);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(radius, -radius * 0.5);
        ctx.lineTo(radius + 8, -radius - 12);
        ctx.lineTo(radius - 4, -radius);
        ctx.closePath();
        ctx.fill();
        drawEyes(ctx, 0, 0, radius, vis.eyeColor);
        break;
      }
      case "halo": {
        // Head
        ctx.fillStyle = lighten(vis.primaryColor, 0.1);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        // Halo
        ctx.strokeStyle = vis.accentColor;
        ctx.lineWidth = 2;
        ctx.shadowColor = vis.accentColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.ellipse(0, -radius - 6, radius + 4, 4, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
        drawEyes(ctx, 0, 0, radius, vis.eyeColor);
        break;
      }
      default: {
        ctx.fillStyle = lighten(vis.primaryColor, 0.1);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        drawEyes(ctx, 0, 0, radius, vis.eyeColor);
      }
    }
  } else {
    // No helmet — skin + hair
    ctx.fillStyle = lighten(vis.primaryColor, 0.15);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    // Hair
    ctx.fillStyle = darken(vis.primaryColor, 0.2);
    ctx.beginPath();
    ctx.arc(0, -2, radius + 1, -Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    drawEyes(ctx, 0, 0, radius, vis.eyeColor);
  }

  ctx.restore();
}

function drawEyes(ctx: OffscreenCanvasRenderingContext2D, cx: number, cy: number, headR: number, eyeColor: string) {
  ctx.fillStyle = eyeColor;
  ctx.shadowColor = eyeColor;
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.ellipse(cx - headR * 0.3, cy - 1, 2.5, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + headR * 0.3, cy - 1, 2.5, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

/* ─── FRAME GENERATION ─── */

function generateFrame(id: string, state: AnimState, frameIdx: number): OffscreenCanvas {
  const canvas = new OffscreenCanvas(SPRITE_W, SPRITE_H);
  const ctx = canvas.getContext("2d")!;
  const vis = getVisual(id);
  const cx = SPRITE_W / 2;
  const baseY = SPRITE_H - 10;

  // Clear
  ctx.clearRect(0, 0, SPRITE_W, SPRITE_H);

  const t = frameIdx; // frame index for animation

  switch (state) {
    case "idle": {
      const breathe = Math.sin(t * 0.8) * 2;
      drawBody(ctx, vis, cx, baseY - breathe, {
        leftArmAngle: -0.2 + Math.sin(t * 0.5) * 0.05,
        rightArmAngle: 0.2 + Math.sin(t * 0.5 + 1) * 0.05,
        leftForearmAngle: 0.5,
        rightForearmAngle: -0.5,
        leftLegAngle: -0.05,
        rightLegAngle: 0.05,
      });
      break;
    }
    case "walk": {
      const stride = Math.sin(t * 1.2) * 0.4;
      drawBody(ctx, vis, cx, baseY, {
        torsoLean: Math.sin(t * 1.2) * 2,
        leftArmAngle: -stride * 0.8,
        rightArmAngle: stride * 0.8,
        leftForearmAngle: 0.4 + stride * 0.3,
        rightForearmAngle: -0.4 - stride * 0.3,
        leftLegAngle: stride,
        rightLegAngle: -stride,
      });
      break;
    }
    case "punch": {
      const progress = t / 5; // 6 frames
      const punchExtend = progress < 0.5 ? progress * 2 : 2 - progress * 2;
      drawBody(ctx, vis, cx, baseY, {
        torsoLean: punchExtend * 6,
        rightArmAngle: -1.2 + punchExtend * 1.8,
        rightForearmAngle: -0.8 + punchExtend * 1.2,
        leftArmAngle: -0.5,
        leftForearmAngle: 0.8,
        leftLegAngle: -0.1,
        rightLegAngle: 0.15 + punchExtend * 0.1,
      });
      // Impact flash
      if (progress > 0.3 && progress < 0.7) {
        ctx.fillStyle = vis.accentColor + "60";
        ctx.beginPath();
        ctx.arc(cx + 40 + punchExtend * 10, baseY - vis.body.torsoH - vis.body.legLen + 20, 12, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "kick": {
      const progress = t / 5;
      const kickExtend = progress < 0.4 ? progress * 2.5 : (1 - progress) * 1.67;
      drawBody(ctx, vis, cx - 4, baseY, {
        torsoLean: -kickExtend * 4,
        rightLegAngle: -0.8 + kickExtend * 1.6,
        leftLegAngle: -0.1,
        leftArmAngle: -0.6,
        rightArmAngle: 0.6,
        leftForearmAngle: 0.6,
        rightForearmAngle: -0.3,
      });
      // Kick trail
      if (progress > 0.2 && progress < 0.8) {
        ctx.strokeStyle = vis.accentColor + "50";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx + 30, baseY - 20, 15 * kickExtend, -0.5, 0.5);
        ctx.stroke();
      }
      break;
    }
    case "block": {
      drawBody(ctx, vis, cx, baseY + 4, {
        torsoLean: -2,
        leftArmAngle: -1.2,
        rightArmAngle: -1.0,
        leftForearmAngle: 1.5,
        rightForearmAngle: 1.3,
        leftLegAngle: -0.15,
        rightLegAngle: 0.15,
        crouching: true,
      });
      // Shield effect
      ctx.strokeStyle = "#ffffff60";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx + 10, baseY - vis.body.torsoH - vis.body.legLen + 30, 25, -1, 1);
      ctx.stroke();
      ctx.fillStyle = vis.accentColor + "15";
      ctx.fill();
      break;
    }
    case "special": {
      const pulse = Math.sin(t * 0.6) * 0.5 + 0.5;
      drawBody(ctx, vis, cx, baseY - 4 - pulse * 4, {
        torsoLean: 0,
        leftArmAngle: -1.5 - pulse * 0.3,
        rightArmAngle: 1.5 + pulse * 0.3,
        leftForearmAngle: -0.5,
        rightForearmAngle: 0.5,
        leftLegAngle: -0.2,
        rightLegAngle: 0.2,
      });
      // Energy aura
      const auraR = 35 + pulse * 15;
      const auraGrad = ctx.createRadialGradient(cx, baseY - 60, 0, cx, baseY - 60, auraR);
      auraGrad.addColorStop(0, vis.glowColor + "40");
      auraGrad.addColorStop(0.6, vis.glowColor + "15");
      auraGrad.addColorStop(1, vis.glowColor + "00");
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, baseY - 60, auraR, 0, Math.PI * 2);
      ctx.fill();
      // Energy ring
      ctx.strokeStyle = vis.glowColor + "80";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -t * 4;
      ctx.beginPath();
      ctx.arc(cx, baseY - 60, auraR * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      break;
    }
    case "hit": {
      const recoil = t < 3 ? t / 3 : 1 - (t - 3) / 3;
      drawBody(ctx, vis, cx - recoil * 10, baseY, {
        torsoLean: -recoil * 8,
        headTilt: -recoil * 3,
        leftArmAngle: -0.3 - recoil * 0.5,
        rightArmAngle: 0.3 + recoil * 0.5,
        leftForearmAngle: 0.6 + recoil * 0.3,
        rightForearmAngle: -0.6 - recoil * 0.3,
        leftLegAngle: -0.1 - recoil * 0.2,
        rightLegAngle: 0.1 + recoil * 0.1,
      });
      // Hit flash
      if (t < 3) {
        ctx.fillStyle = `rgba(255,255,255,${0.3 - t * 0.1})`;
        ctx.fillRect(0, 0, SPRITE_W, SPRITE_H);
      }
      break;
    }
    case "victory": {
      const pump = Math.sin(t * 0.4) * 0.3;
      drawBody(ctx, vis, cx, baseY - 2, {
        torsoLean: 0,
        leftArmAngle: -2.5 - pump,
        rightArmAngle: 2.5 + pump,
        leftForearmAngle: -0.5,
        rightForearmAngle: 0.5,
        leftLegAngle: -0.15,
        rightLegAngle: 0.15,
      });
      // Victory glow
      ctx.fillStyle = vis.glowColor + "20";
      ctx.beginPath();
      ctx.arc(cx, baseY - 60, 40 + pump * 10, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "ko": {
      // Fallen on the ground
      ctx.save();
      ctx.translate(cx, baseY - 15);
      ctx.rotate(Math.PI / 2 * 0.8);
      drawBody(ctx, vis, 0, 0, {
        leftArmAngle: -0.8,
        rightArmAngle: 1.2,
        leftForearmAngle: 0.3,
        rightForearmAngle: -0.8,
        leftLegAngle: -0.3,
        rightLegAngle: 0.4,
      });
      ctx.restore();
      // Fade effect
      ctx.fillStyle = `rgba(0,0,0,${0.1 + Math.sin(t * 0.2) * 0.05})`;
      ctx.fillRect(0, 0, SPRITE_W, SPRITE_H);
      break;
    }
    case "crouch": {
      drawBody(ctx, vis, cx, baseY + 8, {
        torsoLean: 0,
        leftArmAngle: -0.4,
        rightArmAngle: 0.4,
        leftForearmAngle: 0.8,
        rightForearmAngle: -0.8,
        leftLegAngle: -0.3,
        rightLegAngle: 0.3,
        crouching: true,
      });
      break;
    }
  }

  return canvas;
}

/* ─── PUBLIC API ─── */

const FRAME_COUNTS: Record<AnimState, number> = {
  idle: 8,
  walk: 8,
  punch: 6,
  kick: 6,
  block: 4,
  special: 10,
  hit: 6,
  victory: 8,
  ko: 4,
  crouch: 3,
};

const FRAME_DURATIONS: Record<AnimState, number> = {
  idle: 8,    // slow breathing
  walk: 5,    // moderate stride
  punch: 3,   // fast attack
  kick: 3,    // fast attack
  block: 6,   // hold
  special: 4, // dramatic
  hit: 4,     // stagger
  victory: 6, // celebration
  ko: 10,     // slow fall
  crouch: 5,  // hold
};

export function generateCharacterSprite(id: string): CharacterSprite {
  const animations: Partial<Record<AnimState, SpriteFrame[]>> = {};

  const states: AnimState[] = ["idle", "walk", "punch", "kick", "block", "special", "hit", "victory", "ko", "crouch"];

  for (const state of states) {
    const frames: SpriteFrame[] = [];
    const count = FRAME_COUNTS[state];
    const duration = FRAME_DURATIONS[state];

    for (let i = 0; i < count; i++) {
      frames.push({
        canvas: generateFrame(id, state, i),
        duration,
      });
    }
    animations[state] = frames;
  }

  return {
    id,
    animations: animations as Record<AnimState, SpriteFrame[]>,
    width: SPRITE_W,
    height: SPRITE_H,
  };
}

// Cache generated sprites
const spriteCache = new Map<string, CharacterSprite>();

export function getOrGenerateSprite(id: string): CharacterSprite {
  if (!spriteCache.has(id)) {
    spriteCache.set(id, generateCharacterSprite(id));
  }
  return spriteCache.get(id)!;
}

export function preloadSprites(ids: string[]): void {
  ids.forEach(id => getOrGenerateSprite(id));
}

export { SPRITE_W, SPRITE_H };

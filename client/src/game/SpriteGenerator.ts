/* ═══════════════════════════════════════════════════════
   SPRITE GENERATOR v2 — MK1-Quality Procedural Sprites
   Larger canvas (256×384), dark outlines on all body parts,
   gradient muscle/armor shading, detailed proportions,
   and per-character visual definitions.
   ═══════════════════════════════════════════════════════ */

import { drawCharacterDetails } from "./CharacterDetails";

export type AnimState = "idle" | "walk" | "punch" | "kick" | "block" | "special" | "hit" | "victory" | "ko" | "crouch";

export interface SpriteFrame {
  canvas: OffscreenCanvas;
  duration: number;
}

export interface CharacterSprite {
  id: string;
  animations: Record<AnimState, SpriteFrame[]>;
  width: number;
  height: number;
}

interface BodyDef {
  headSize: number;
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

// ═══ DOUBLED SPRITE SIZE ═══
const SPRITE_W = 256;
const SPRITE_H = 384;

// Scale factor for body proportions (2x from old 128x192)
const S = 2;

const CHARACTER_VISUALS: Record<string, Partial<CharacterVisual>> = {
  "architect": {
    primaryColor: "#dc2626", secondaryColor: "#1a0000", accentColor: "#ff6b6b",
    eyeColor: "#ff0000", hasHelmet: true, helmetStyle: "crown", hasCape: true,
    hasShoulderPads: true, weaponType: "orb", armorStyle: "heavy", glowEffect: true, glowColor: "#ef4444",
    body: { headSize: 24, torsoW: 60, torsoH: 76, shoulderW: 76, armW: 16, armLen: 64, legW: 20, legLen: 72, hipW: 48 },
  },
  "collector": {
    primaryColor: "#7c3aed", secondaryColor: "#1a0033", accentColor: "#c084fc",
    eyeColor: "#a855f7", hasHelmet: true, helmetStyle: "hood", hasCape: true,
    hasShoulderPads: false, weaponType: "staff", armorStyle: "robes", glowEffect: true, glowColor: "#a855f7",
    body: { headSize: 22, torsoW: 52, torsoH: 72, shoulderW: 64, armW: 14, armLen: 60, legW: 18, legLen: 68, hipW: 44 },
  },
  "enigma": {
    primaryColor: "#0891b2", secondaryColor: "#001a2e", accentColor: "#22d3ee",
    eyeColor: "#22d3ee", hasHelmet: false, helmetStyle: "none", hasCape: false,
    hasShoulderPads: false, weaponType: "dual-blades", armorStyle: "light", glowEffect: true, glowColor: "#22d3ee",
    body: { headSize: 22, torsoW: 48, torsoH: 68, shoulderW: 60, armW: 14, armLen: 60, legW: 18, legLen: 72, hipW: 40 },
  },
  "warlord": {
    primaryColor: "#d97706", secondaryColor: "#1a0f00", accentColor: "#fbbf24",
    eyeColor: "#f59e0b", hasHelmet: true, helmetStyle: "visor", hasCape: false,
    hasShoulderPads: true, weaponType: "hammer", armorStyle: "heavy", glowEffect: false, glowColor: "#f59e0b",
    body: { headSize: 26, torsoW: 68, torsoH: 80, shoulderW: 84, armW: 20, armLen: 68, legW: 24, legLen: 72, hipW: 56 },
  },
  "necromancer": {
    primaryColor: "#059669", secondaryColor: "#001a0f", accentColor: "#34d399",
    eyeColor: "#10b981", hasHelmet: true, helmetStyle: "hood", hasCape: true,
    hasShoulderPads: false, weaponType: "scythe", armorStyle: "robes", glowEffect: true, glowColor: "#10b981",
    body: { headSize: 22, torsoW: 52, torsoH: 72, shoulderW: 60, armW: 14, armLen: 64, legW: 18, legLen: 68, hipW: 40 },
  },
  "meme": {
    primaryColor: "#db2777", secondaryColor: "#1a0015", accentColor: "#f472b6",
    eyeColor: "#ec4899", hasHelmet: true, helmetStyle: "mask", hasCape: false,
    hasShoulderPads: false, weaponType: "claws", armorStyle: "light", glowEffect: true, glowColor: "#ec4899",
    body: { headSize: 22, torsoW: 48, torsoH: 68, shoulderW: 56, armW: 14, armLen: 60, legW: 16, legLen: 72, hipW: 40 },
  },
  "shadow-tongue": {
    primaryColor: "#4338ca", secondaryColor: "#0a0033", accentColor: "#818cf8",
    eyeColor: "#6366f1", hasHelmet: true, helmetStyle: "hood", hasCape: true,
    hasShoulderPads: false, weaponType: "none", armorStyle: "robes", glowEffect: true, glowColor: "#6366f1",
    body: { headSize: 22, torsoW: 52, torsoH: 72, shoulderW: 60, armW: 14, armLen: 60, legW: 18, legLen: 68, hipW: 44 },
  },
  "watcher": {
    primaryColor: "#0d9488", secondaryColor: "#001a1a", accentColor: "#2dd4bf",
    eyeColor: "#14b8a6", hasHelmet: true, helmetStyle: "visor", hasCape: false,
    hasShoulderPads: true, weaponType: "orb", armorStyle: "tech", glowEffect: true, glowColor: "#14b8a6",
    body: { headSize: 24, torsoW: 56, torsoH: 72, shoulderW: 68, armW: 16, armLen: 60, legW: 20, legLen: 68, hipW: 48 },
  },
  "game-master": {
    primaryColor: "#ea580c", secondaryColor: "#1a0800", accentColor: "#fb923c",
    eyeColor: "#f97316", hasHelmet: true, helmetStyle: "crown", hasCape: true,
    hasShoulderPads: true, weaponType: "staff", armorStyle: "medium", glowEffect: true, glowColor: "#f97316",
    body: { headSize: 24, torsoW: 56, torsoH: 76, shoulderW: 68, armW: 16, armLen: 64, legW: 20, legLen: 68, hipW: 48 },
  },
  "authority": {
    primaryColor: "#ca8a04", secondaryColor: "#1a1200", accentColor: "#fde047",
    eyeColor: "#eab308", hasHelmet: true, helmetStyle: "crown", hasCape: true,
    hasShoulderPads: true, weaponType: "hammer", armorStyle: "heavy", glowEffect: true, glowColor: "#eab308",
    body: { headSize: 26, torsoW: 64, torsoH: 80, shoulderW: 80, armW: 20, armLen: 68, legW: 24, legLen: 72, hipW: 52 },
  },
  "source": {
    primaryColor: "#b91c1c", secondaryColor: "#1a0000", accentColor: "#fca5a5",
    eyeColor: "#dc2626", hasHelmet: true, helmetStyle: "horns", hasCape: false,
    hasShoulderPads: true, weaponType: "gauntlets", armorStyle: "heavy", glowEffect: true, glowColor: "#dc2626",
    body: { headSize: 26, torsoW: 64, torsoH: 80, shoulderW: 80, armW: 20, armLen: 68, legW: 24, legLen: 72, hipW: 52 },
  },
  "jailer": {
    primaryColor: "#57534e", secondaryColor: "#1c1917", accentColor: "#a8a29e",
    eyeColor: "#78716c", hasHelmet: true, helmetStyle: "visor", hasCape: false,
    hasShoulderPads: true, weaponType: "chains", armorStyle: "heavy", glowEffect: false, glowColor: "#78716c",
    body: { headSize: 26, torsoW: 68, torsoH: 84, shoulderW: 84, armW: 22, armLen: 68, legW: 24, legLen: 72, hipW: 56 },
  },
  "host": {
    primaryColor: "#6d28d9", secondaryColor: "#1a0040", accentColor: "#a78bfa",
    eyeColor: "#7c3aed", hasHelmet: false, helmetStyle: "none", hasCape: false,
    hasShoulderPads: false, weaponType: "gauntlets", armorStyle: "medium", glowEffect: true, glowColor: "#7c3aed",
    body: { headSize: 24, torsoW: 56, torsoH: 72, shoulderW: 68, armW: 16, armLen: 64, legW: 20, legLen: 72, hipW: 48 },
  },
  "dreamer": {
    primaryColor: "#6366f1", secondaryColor: "#1e1b4b", accentColor: "#a5b4fc",
    eyeColor: "#818cf8", hasHelmet: false, helmetStyle: "none", hasCape: true,
    hasShoulderPads: false, weaponType: "orb", armorStyle: "robes", glowEffect: true, glowColor: "#818cf8",
    body: { headSize: 22, torsoW: 48, torsoH: 68, shoulderW: 56, armW: 14, armLen: 60, legW: 16, legLen: 68, hipW: 40 },
  },
  "judge": {
    primaryColor: "#ca8a04", secondaryColor: "#1a1200", accentColor: "#fde047",
    eyeColor: "#fbbf24", hasHelmet: false, helmetStyle: "none", hasCape: false,
    hasShoulderPads: true, weaponType: "hammer", armorStyle: "medium", glowEffect: true, glowColor: "#fbbf24",
    body: { headSize: 24, torsoW: 60, torsoH: 76, shoulderW: 72, armW: 18, armLen: 64, legW: 20, legLen: 72, hipW: 48 },
  },
  "inventor": {
    primaryColor: "#db2777", secondaryColor: "#500724", accentColor: "#f9a8d4",
    eyeColor: "#f472b6", hasHelmet: true, helmetStyle: "visor", hasCape: false,
    hasShoulderPads: false, weaponType: "gauntlets", armorStyle: "tech", glowEffect: true, glowColor: "#f472b6",
    body: { headSize: 22, torsoW: 52, torsoH: 68, shoulderW: 60, armW: 16, armLen: 60, legW: 18, legLen: 68, hipW: 44 },
  },
  "seer": {
    primaryColor: "#06b6d4", secondaryColor: "#083344", accentColor: "#67e8f9",
    eyeColor: "#67e8f9", hasHelmet: false, helmetStyle: "none", hasCape: true,
    hasShoulderPads: false, weaponType: "orb", armorStyle: "light", glowEffect: true, glowColor: "#67e8f9",
    body: { headSize: 20, torsoW: 44, torsoH: 64, shoulderW: 52, armW: 12, armLen: 56, legW: 16, legLen: 68, hipW: 36 },
  },
  "knowledge": {
    primaryColor: "#059669", secondaryColor: "#022c22", accentColor: "#6ee7b7",
    eyeColor: "#34d399", hasHelmet: true, helmetStyle: "halo", hasCape: true,
    hasShoulderPads: false, weaponType: "staff", armorStyle: "robes", glowEffect: true, glowColor: "#34d399",
    body: { headSize: 24, torsoW: 52, torsoH: 72, shoulderW: 60, armW: 14, armLen: 60, legW: 18, legLen: 68, hipW: 44 },
  },
  "silence": {
    primaryColor: "#334155", secondaryColor: "#0f172a", accentColor: "#64748b",
    eyeColor: "#475569", hasHelmet: true, helmetStyle: "mask", hasCape: true,
    hasShoulderPads: false, weaponType: "dual-blades", armorStyle: "light", glowEffect: false, glowColor: "#475569",
    body: { headSize: 20, torsoW: 48, torsoH: 68, shoulderW: 56, armW: 14, armLen: 60, legW: 16, legLen: 72, hipW: 40 },
  },
  "storm": {
    primaryColor: "#2563eb", secondaryColor: "#1e3a5f", accentColor: "#93c5fd",
    eyeColor: "#60a5fa", hasHelmet: false, helmetStyle: "none", hasCape: false,
    hasShoulderPads: true, weaponType: "gauntlets", armorStyle: "medium", glowEffect: true, glowColor: "#60a5fa",
    body: { headSize: 24, torsoW: 60, torsoH: 76, shoulderW: 72, armW: 18, armLen: 64, legW: 20, legLen: 72, hipW: 48 },
  },
  "degen": {
    primaryColor: "#ea580c", secondaryColor: "#431407", accentColor: "#fdba74",
    eyeColor: "#fb923c", hasHelmet: true, helmetStyle: "mask", hasCape: false,
    hasShoulderPads: false, weaponType: "claws", armorStyle: "light", glowEffect: true, glowColor: "#fb923c",
    body: { headSize: 22, torsoW: 48, torsoH: 68, shoulderW: 56, armW: 14, armLen: 60, legW: 16, legLen: 72, hipW: 40 },
  },
  "advocate": {
    primaryColor: "#ca8a04", secondaryColor: "#422006", accentColor: "#fde68a",
    eyeColor: "#fcd34d", hasHelmet: false, helmetStyle: "none", hasCape: false,
    hasShoulderPads: false, weaponType: "sword", armorStyle: "medium", glowEffect: true, glowColor: "#fcd34d",
    body: { headSize: 22, torsoW: 52, torsoH: 72, shoulderW: 60, armW: 16, armLen: 60, legW: 18, legLen: 68, hipW: 44 },
  },
  "forgotten": {
    primaryColor: "#64748b", secondaryColor: "#1e293b", accentColor: "#cbd5e1",
    eyeColor: "#94a3b8", hasHelmet: true, helmetStyle: "hood", hasCape: true,
    hasShoulderPads: false, weaponType: "none", armorStyle: "robes", glowEffect: false, glowColor: "#94a3b8",
    body: { headSize: 22, torsoW: 48, torsoH: 68, shoulderW: 56, armW: 14, armLen: 60, legW: 16, legLen: 68, hipW: 40 },
  },
  "resurrectionist": {
    primaryColor: "#16a34a", secondaryColor: "#052e16", accentColor: "#86efac",
    eyeColor: "#4ade80", hasHelmet: true, helmetStyle: "halo", hasCape: true,
    hasShoulderPads: false, weaponType: "staff", armorStyle: "robes", glowEffect: true, glowColor: "#4ade80",
    body: { headSize: 22, torsoW: 52, torsoH: 72, shoulderW: 60, armW: 14, armLen: 60, legW: 18, legLen: 68, hipW: 44 },
  },
  "akai-shi": {
    primaryColor: "#dc2626", secondaryColor: "#450a0a", accentColor: "#fca5a5",
    eyeColor: "#ef4444", hasHelmet: true, helmetStyle: "mask", hasCape: false,
    hasShoulderPads: false, weaponType: "sword", armorStyle: "light", glowEffect: true, glowColor: "#dc2626",
    body: { headSize: 22, torsoW: 48, torsoH: 68, shoulderW: 56, armW: 14, armLen: 64, legW: 18, legLen: 72, hipW: 40 },
  },
  "wraith-calder": {
    primaryColor: "#7c3aed", secondaryColor: "#2e1065", accentColor: "#c4b5fd",
    eyeColor: "#a78bfa", hasHelmet: false, helmetStyle: "none", hasCape: true,
    hasShoulderPads: false, weaponType: "dual-blades", armorStyle: "light", glowEffect: true, glowColor: "#a78bfa",
    body: { headSize: 20, torsoW: 44, torsoH: 64, shoulderW: 52, armW: 12, armLen: 60, legW: 16, legLen: 72, hipW: 36 },
  },
  "wolf": {
    primaryColor: "#57534e", secondaryColor: "#1c1917", accentColor: "#d6d3d1",
    eyeColor: "#fbbf24", hasHelmet: false, helmetStyle: "none", hasCape: false,
    hasShoulderPads: true, weaponType: "claws", armorStyle: "medium", glowEffect: false, glowColor: "#78716c",
    body: { headSize: 26, torsoW: 64, torsoH: 80, shoulderW: 80, armW: 20, armLen: 68, legW: 24, legLen: 72, hipW: 52 },
  },
  "iron-lion": {
    primaryColor: "#b45309", secondaryColor: "#451a03", accentColor: "#fcd34d",
    eyeColor: "#f59e0b", hasHelmet: true, helmetStyle: "visor", hasCape: false,
    hasShoulderPads: true, weaponType: "gauntlets", armorStyle: "heavy", glowEffect: true, glowColor: "#d97706",
    body: { headSize: 28, torsoW: 72, torsoH: 84, shoulderW: 88, armW: 24, armLen: 72, legW: 28, legLen: 72, hipW: 60 },
  },
  "engineer": {
    primaryColor: "#0891b2", secondaryColor: "#083344", accentColor: "#67e8f9",
    eyeColor: "#06b6d4", hasHelmet: true, helmetStyle: "visor", hasCape: false,
    hasShoulderPads: false, weaponType: "gauntlets", armorStyle: "tech", glowEffect: true, glowColor: "#06b6d4",
    body: { headSize: 22, torsoW: 56, torsoH: 72, shoulderW: 64, armW: 16, armLen: 60, legW: 20, legLen: 68, hipW: 48 },
  },
  "oracle": {
    primaryColor: "#c026d3", secondaryColor: "#4a044e", accentColor: "#f0abfc",
    eyeColor: "#e879f9", hasHelmet: false, helmetStyle: "none", hasCape: true,
    hasShoulderPads: false, weaponType: "orb", armorStyle: "robes", glowEffect: true, glowColor: "#e879f9",
    body: { headSize: 22, torsoW: 48, torsoH: 68, shoulderW: 56, armW: 14, armLen: 60, legW: 16, legLen: 68, hipW: 40 },
  },
  "eyes": {
    primaryColor: "#22d3ee", secondaryColor: "#083344", accentColor: "#67e8f9",
    eyeColor: "#22d3ee", hasHelmet: true, helmetStyle: "visor", hasCape: false,
    hasShoulderPads: false, weaponType: "dual-blades", armorStyle: "tech", glowEffect: true, glowColor: "#22d3ee",
    body: { headSize: 20, torsoW: 44, torsoH: 64, shoulderW: 52, armW: 12, armLen: 60, legW: 16, legLen: 72, hipW: 36 },
  },
  "agent-zero": {
    primaryColor: "#1e293b", secondaryColor: "#020617", accentColor: "#475569",
    eyeColor: "#ef4444", hasHelmet: true, helmetStyle: "mask", hasCape: false,
    hasShoulderPads: false, weaponType: "dual-blades", armorStyle: "light", glowEffect: false, glowColor: "#1e293b",
    body: { headSize: 20, torsoW: 48, torsoH: 68, shoulderW: 56, armW: 14, armLen: 64, legW: 16, legLen: 76, hipW: 40 },
  },
};

/* ─── COLOR UTILITIES ─── */

function hexToRgb(color: string): [number, number, number] {
  // Handle rgb() format
  if (color.startsWith("rgb")) {
    const m = color.match(/(\d+)/g);
    if (m && m.length >= 3) return [+m[0], +m[1], +m[2]];
    return [128, 128, 128]; // fallback
  }
  // Handle hex format
  const hex = color.startsWith("#") ? color : `#${color}`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [isNaN(r) ? 128 : r, isNaN(g) ? 128 : g, isNaN(b) ? 128 : b];
}

function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.min(255, r + Math.round(amount * 255))},${Math.min(255, g + Math.round(amount * 255))},${Math.min(255, b + Math.round(amount * 255))})`;
}

function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.max(0, r - Math.round(amount * 255))},${Math.max(0, g - Math.round(amount * 255))},${Math.max(0, b - Math.round(amount * 255))})`;
}

function getVisual(id: string): CharacterVisual {
  const custom = CHARACTER_VISUALS[id] || {};
  const defaultBody: BodyDef = {
    headSize: 24, torsoW: 56, torsoH: 72, shoulderW: 68,
    armW: 16, armLen: 60, legW: 20, legLen: 68, hipW: 48,
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

/* ═══════════════════════════════════════════════════════
   DRAWING HELPERS — with dark outlines and shading
   ═══════════════════════════════════════════════════════ */

/** Draw a filled shape with a 1-2px dark outline for pixel art readability */
function outlinedRect(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string, outlineColor = "rgba(0,0,0,0.7)") {
  ctx.fillStyle = outlineColor;
  ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function outlinedCircle(ctx: OffscreenCanvasRenderingContext2D, cx: number, cy: number, r: number, fill: string, outlineColor = "rgba(0,0,0,0.7)") {
  ctx.fillStyle = outlineColor;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

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
  const crouch = pose.crouching ? 24 : 0;

  const torsoX = cx + lean;
  const torsoTopY = baseY - b.legLen - b.torsoH + crouch;
  const torsoBottomY = baseY - b.legLen + crouch;
  const torsoCenterY = torsoTopY + b.torsoH / 2;

  // ═══ CAPE (behind body) ═══
  if (vis.hasCape) {
    // Outline
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.moveTo(torsoX - b.shoulderW / 2 + 2, torsoTopY + 6);
    ctx.quadraticCurveTo(torsoX - b.shoulderW / 2 - 14, torsoBottomY + b.legLen * 0.6, torsoX - 8, baseY + 8);
    ctx.lineTo(torsoX + 8, baseY + 8);
    ctx.quadraticCurveTo(torsoX + b.shoulderW / 2 + 14, torsoBottomY + b.legLen * 0.6, torsoX + b.shoulderW / 2 - 2, torsoTopY + 6);
    ctx.closePath();
    ctx.fill();
    // Cape fill with gradient
    const capeGrad = ctx.createLinearGradient(torsoX, torsoTopY, torsoX, baseY);
    capeGrad.addColorStop(0, darken(vis.primaryColor, 0.15));
    capeGrad.addColorStop(1, darken(vis.primaryColor, 0.35));
    ctx.fillStyle = capeGrad;
    ctx.beginPath();
    ctx.moveTo(torsoX - b.shoulderW / 2 + 4, torsoTopY + 8);
    ctx.quadraticCurveTo(torsoX - b.shoulderW / 2 - 12, torsoBottomY + b.legLen * 0.6, torsoX - 6, baseY + 6);
    ctx.lineTo(torsoX + 6, baseY + 6);
    ctx.quadraticCurveTo(torsoX + b.shoulderW / 2 + 12, torsoBottomY + b.legLen * 0.6, torsoX + b.shoulderW / 2 - 4, torsoTopY + 8);
    ctx.closePath();
    ctx.fill();
    // Cape inner fold line
    ctx.strokeStyle = darken(vis.primaryColor, 0.4) + "80";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(torsoX, torsoTopY + 12);
    ctx.quadraticCurveTo(torsoX + 3, torsoCenterY, torsoX, baseY);
    ctx.stroke();
  }

  // ═══ LEGS with outline and shading ═══
  const leftLegAngle = pose.leftLegAngle || 0;
  const rightLegAngle = pose.rightLegAngle || 0;
  drawLimb(ctx, torsoX - b.hipW / 2, torsoBottomY, b.legW, b.legLen, leftLegAngle, vis, "leg");
  drawLimb(ctx, torsoX + b.hipW / 2 - b.legW, torsoBottomY, b.legW, b.legLen, rightLegAngle, vis, "leg");

  // ═══ BOOTS ═══
  const lFootX = torsoX - b.hipW / 2 + Math.sin(leftLegAngle) * b.legLen;
  const lFootY = torsoBottomY + Math.cos(leftLegAngle) * b.legLen;
  const rFootX = torsoX + b.hipW / 2 - b.legW + Math.sin(rightLegAngle) * b.legLen;
  const rFootY = torsoBottomY + Math.cos(rightLegAngle) * b.legLen;
  drawBoot(ctx, lFootX, lFootY, b.legW + 8, vis);
  drawBoot(ctx, rFootX, rFootY, b.legW + 8, vis);

  // ═══ TORSO with gradient shading and outline ═══
  // Outline
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.beginPath();
  ctx.moveTo(torsoX - b.shoulderW / 2 - 2, torsoTopY - 1);
  ctx.lineTo(torsoX + b.shoulderW / 2 + 2, torsoTopY - 1);
  ctx.lineTo(torsoX + b.hipW / 2 + 2, torsoBottomY + 1);
  ctx.lineTo(torsoX - b.hipW / 2 - 2, torsoBottomY + 1);
  ctx.closePath();
  ctx.fill();

  // Torso fill with muscle/armor shading
  const torsoGrad = ctx.createLinearGradient(torsoX - b.torsoW / 2, torsoTopY, torsoX + b.torsoW / 2, torsoBottomY);
  torsoGrad.addColorStop(0, lighten(vis.primaryColor, 0.08));
  torsoGrad.addColorStop(0.3, vis.primaryColor);
  torsoGrad.addColorStop(0.7, darken(vis.primaryColor, 0.05));
  torsoGrad.addColorStop(1, darken(vis.primaryColor, 0.15));
  ctx.fillStyle = torsoGrad;
  ctx.beginPath();
  ctx.moveTo(torsoX - b.shoulderW / 2, torsoTopY);
  ctx.lineTo(torsoX + b.shoulderW / 2, torsoTopY);
  ctx.lineTo(torsoX + b.hipW / 2, torsoBottomY);
  ctx.lineTo(torsoX - b.hipW / 2, torsoBottomY);
  ctx.closePath();
  ctx.fill();

  // Chest highlight (muscle/armor shine)
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.moveTo(torsoX - b.shoulderW * 0.3, torsoTopY + 4);
  ctx.lineTo(torsoX + b.shoulderW * 0.1, torsoTopY + 4);
  ctx.lineTo(torsoX + b.hipW * 0.05, torsoCenterY - 4);
  ctx.lineTo(torsoX - b.hipW * 0.2, torsoCenterY - 4);
  ctx.closePath();
  ctx.fill();

  // Armor/muscle detail lines
  if (vis.armorStyle === "heavy" || vis.armorStyle === "tech") {
    ctx.strokeStyle = vis.accentColor + "50";
    ctx.lineWidth = 1.5;
    // Center line
    ctx.beginPath();
    ctx.moveTo(torsoX, torsoTopY + 6);
    ctx.lineTo(torsoX, torsoBottomY - 6);
    ctx.stroke();
    // Cross line
    ctx.beginPath();
    ctx.moveTo(torsoX - b.torsoW / 3, torsoCenterY);
    ctx.lineTo(torsoX + b.torsoW / 3, torsoCenterY);
    ctx.stroke();
    // Plate edges
    ctx.strokeStyle = vis.accentColor + "30";
    ctx.beginPath();
    ctx.moveTo(torsoX - b.shoulderW * 0.4, torsoTopY + b.torsoH * 0.3);
    ctx.lineTo(torsoX + b.shoulderW * 0.4, torsoTopY + b.torsoH * 0.3);
    ctx.stroke();
  }

  if (vis.armorStyle === "tech") {
    ctx.strokeStyle = vis.accentColor + "35";
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const y = torsoTopY + 12 + i * 16;
      ctx.beginPath();
      ctx.moveTo(torsoX - b.torsoW / 3, y);
      ctx.lineTo(torsoX + b.torsoW / 3, y);
      ctx.stroke();
    }
    // Tech dots
    ctx.fillStyle = vis.accentColor + "60";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(torsoX - b.torsoW / 4 + i * (b.torsoW / 4), torsoTopY + 8, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (vis.armorStyle === "robes") {
    // Robe fold lines
    ctx.strokeStyle = darken(vis.primaryColor, 0.15) + "60";
    ctx.lineWidth = 1;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(torsoX + i * 8, torsoTopY + 10);
      ctx.quadraticCurveTo(torsoX + i * 6, torsoCenterY, torsoX + i * 10, torsoBottomY);
      ctx.stroke();
    }
  }

  // Belt/waist detail
  ctx.fillStyle = vis.secondaryColor;
  outlinedRect(ctx, torsoX - b.hipW / 2, torsoBottomY - 6, b.hipW, 6, vis.secondaryColor);
  // Belt buckle
  ctx.fillStyle = vis.accentColor + "80";
  ctx.fillRect(torsoX - 4, torsoBottomY - 5, 8, 4);

  // ═══ SHOULDER PADS ═══
  if (vis.hasShoulderPads) {
    drawShoulderPad(ctx, torsoX - b.shoulderW / 2 - 8, torsoTopY - 4, 28, vis);
    drawShoulderPad(ctx, torsoX + b.shoulderW / 2 - 20, torsoTopY - 4, 28, vis);
  }

  // ═══ ARMS with outline ═══
  const leftArmAngle = pose.leftArmAngle || -0.3;
  const rightArmAngle = pose.rightArmAngle || 0.3;
  const leftForearmAngle = pose.leftForearmAngle || 0.4;
  const rightForearmAngle = pose.rightForearmAngle || -0.4;

  const lShoulderX = torsoX - b.shoulderW / 2;
  const rShoulderX = torsoX + b.shoulderW / 2;
  const shoulderY = torsoTopY + 6;

  // Upper arms
  drawLimb(ctx, lShoulderX, shoulderY, b.armW, b.armLen * 0.55, leftArmAngle, vis, "arm");
  drawLimb(ctx, rShoulderX - b.armW, shoulderY, b.armW, b.armLen * 0.55, rightArmAngle, vis, "arm");

  // Forearms
  const lElbowX = lShoulderX + Math.sin(leftArmAngle) * b.armLen * 0.55;
  const lElbowY = shoulderY + Math.cos(leftArmAngle) * b.armLen * 0.55;
  const rElbowX = rShoulderX - b.armW + Math.sin(rightArmAngle) * b.armLen * 0.55;
  const rElbowY = shoulderY + Math.cos(rightArmAngle) * b.armLen * 0.55;

  drawLimb(ctx, lElbowX, lElbowY, b.armW - 2, b.armLen * 0.5, leftForearmAngle, vis, "forearm");
  drawLimb(ctx, rElbowX, rElbowY, b.armW - 2, b.armLen * 0.5, rightForearmAngle, vis, "forearm");

  // Hands
  const lHandX = lElbowX + Math.sin(leftForearmAngle) * b.armLen * 0.5;
  const lHandY = lElbowY + Math.cos(leftForearmAngle) * b.armLen * 0.5;
  const rHandX = rElbowX + Math.sin(rightForearmAngle) * b.armLen * 0.5;
  const rHandY = rElbowY + Math.cos(rightForearmAngle) * b.armLen * 0.5;

  drawHand(ctx, lHandX, lHandY, b.armW, vis);
  drawHand(ctx, rHandX, rHandY, b.armW, vis);

  // Weapon in right hand
  drawWeapon(ctx, rHandX, rHandY, vis, rightForearmAngle);

  // ═══ HEAD with outline ═══
  const headY = torsoTopY - b.headSize - 4;
  drawHead(ctx, torsoX + lean * 0.5, headY, b.headSize, vis, pose.headTilt || 0);

  // ═══ GLOW EFFECT ═══
  if (vis.glowEffect) {
    ctx.shadowColor = vis.glowColor;
    ctx.shadowBlur = 12;
    ctx.strokeStyle = vis.glowColor + "25";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(torsoX, torsoCenterY, b.shoulderW / 2 + 14, b.torsoH / 2 + 20, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

function drawLimb(
  ctx: OffscreenCanvasRenderingContext2D,
  x: number, y: number, w: number, len: number, angle: number,
  vis: CharacterVisual, part: "leg" | "arm" | "forearm"
) {
  ctx.save();
  ctx.translate(x + w / 2, y);
  ctx.rotate(angle);

  // Dark outline
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(-w / 2 - 1.5, -1, w + 3, len + 2);

  // Gradient fill for muscle/armor shading
  const baseColor = part === "leg" ? darken(vis.primaryColor, 0.12) : vis.primaryColor;
  const grad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
  grad.addColorStop(0, darken(baseColor, 0.08));
  grad.addColorStop(0.3, lighten(baseColor, 0.04));
  grad.addColorStop(0.7, baseColor);
  grad.addColorStop(1, darken(baseColor, 0.12));
  ctx.fillStyle = grad;
  ctx.fillRect(-w / 2, 0, w, len);

  // Highlight strip (muscle/armor shine)
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(-w / 2 + 2, 2, w * 0.3, len - 4);

  // Armor plate edge for heavy/tech
  if (vis.armorStyle === "heavy" || vis.armorStyle === "tech") {
    ctx.strokeStyle = vis.accentColor + "40";
    ctx.lineWidth = 1;
    ctx.strokeRect(-w / 2, 0, w, len);
    // Knee/elbow joint
    if (part === "leg" || part === "forearm") {
      ctx.fillStyle = vis.secondaryColor;
      ctx.fillRect(-w / 2 - 1, -2, w + 2, 4);
    }
  }

  ctx.restore();
}

function drawBoot(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, w: number, vis: CharacterVisual) {
  // Outline
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.beginPath();
  ctx.roundRect(x - 4, y - 4, w + 8, 16, [0, 0, 5, 5]);
  ctx.fill();
  // Boot fill
  const bootGrad = ctx.createLinearGradient(x, y, x, y + 12);
  bootGrad.addColorStop(0, vis.secondaryColor);
  bootGrad.addColorStop(1, darken(vis.secondaryColor, 0.15));
  ctx.fillStyle = bootGrad;
  ctx.beginPath();
  ctx.roundRect(x - 2, y - 2, w + 4, 14, [0, 0, 4, 4]);
  ctx.fill();
  // Boot trim
  ctx.fillStyle = vis.accentColor + "30";
  ctx.fillRect(x, y - 2, w, 3);
}

function drawShoulderPad(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, size: number, vis: CharacterVisual) {
  // Outline
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.beginPath();
  ctx.ellipse(x + size / 2, y + size / 3, size / 2 + 2, size / 3 + 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // Pad fill with gradient
  const padGrad = ctx.createRadialGradient(x + size / 2 - 3, y + size / 3 - 3, 0, x + size / 2, y + size / 3, size / 2);
  padGrad.addColorStop(0, lighten(vis.secondaryColor, 0.1));
  padGrad.addColorStop(1, vis.secondaryColor);
  ctx.fillStyle = padGrad;
  ctx.beginPath();
  ctx.ellipse(x + size / 2, y + size / 3, size / 2, size / 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // Edge highlight
  ctx.strokeStyle = vis.accentColor + "50";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(x + size / 2, y + size / 3, size / 2, size / 3, 0, -Math.PI * 0.8, -Math.PI * 0.2);
  ctx.stroke();
  // Spike/stud
  ctx.fillStyle = vis.accentColor + "70";
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 3 - 2, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawHand(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, armW: number, vis: CharacterVisual) {
  const size = armW * 0.8;
  if (vis.weaponType === "gauntlets" || vis.weaponType === "claws") {
    outlinedCircle(ctx, x, y, size + 3, vis.accentColor);
    // Knuckle detail
    ctx.fillStyle = lighten(vis.accentColor, 0.1);
    ctx.beginPath();
    ctx.arc(x, y - 2, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    if (vis.weaponType === "claws") {
      ctx.strokeStyle = vis.accentColor;
      ctx.lineWidth = 2;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * 5, y);
        ctx.lineTo(x + i * 5 + 3, y + 16);
        ctx.stroke();
      }
    }
  } else {
    outlinedCircle(ctx, x, y, size, lighten(vis.primaryColor, 0.1));
  }
}

function drawWeapon(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, vis: CharacterVisual, angle: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  switch (vis.weaponType) {
    case "sword": {
      // Blade outline
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(-3, -56, 6, 56);
      // Blade
      const bladeGrad = ctx.createLinearGradient(-2, -54, 2, -54);
      bladeGrad.addColorStop(0, "#a0a0a0");
      bladeGrad.addColorStop(0.5, "#e0e0e0");
      bladeGrad.addColorStop(1, "#a0a0a0");
      ctx.fillStyle = bladeGrad;
      ctx.fillRect(-2, -54, 4, 52);
      // Edge highlight
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(-1, -52, 1, 48);
      // Guard
      ctx.fillStyle = vis.accentColor;
      ctx.fillRect(-7, -4, 14, 5);
      // Pommel
      ctx.fillStyle = vis.primaryColor;
      ctx.fillRect(-3, 2, 6, 8);
      break;
    }
    case "staff": {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(-3, -66, 6, 76);
      ctx.fillStyle = "#6B3A1F";
      ctx.fillRect(-2, -64, 4, 72);
      // Wood grain
      ctx.strokeStyle = "#8B5A2F40";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -60);
      ctx.lineTo(0, 4);
      ctx.stroke();
      // Crystal orb
      outlinedCircle(ctx, 0, -66, 8, vis.accentColor);
      // Crystal glow
      ctx.fillStyle = vis.accentColor + "40";
      ctx.beginPath();
      ctx.arc(0, -66, 14, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "hammer": {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(-3, -54, 6, 60);
      ctx.fillStyle = "#6B3A1F";
      ctx.fillRect(-2, -52, 4, 56);
      // Hammer head outline
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(-15, -66, 30, 18);
      // Hammer head
      const hammerGrad = ctx.createLinearGradient(-14, -64, 14, -64);
      hammerGrad.addColorStop(0, darken(vis.secondaryColor, 0.1));
      hammerGrad.addColorStop(0.5, lighten(vis.secondaryColor, 0.05));
      hammerGrad.addColorStop(1, darken(vis.secondaryColor, 0.1));
      ctx.fillStyle = hammerGrad;
      ctx.fillRect(-14, -64, 28, 16);
      ctx.strokeStyle = vis.accentColor + "60";
      ctx.lineWidth = 1;
      ctx.strokeRect(-14, -64, 28, 16);
      break;
    }
    case "scythe": {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(-3, -66, 6, 76);
      ctx.fillStyle = "#4a2a0a";
      ctx.fillRect(-2, -64, 4, 72);
      // Blade
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.beginPath();
      ctx.moveTo(0, -66);
      ctx.quadraticCurveTo(32, -66, 36, -40);
      ctx.lineTo(30, -42);
      ctx.quadraticCurveTo(26, -62, 0, -62);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#c0c0c0";
      ctx.beginPath();
      ctx.moveTo(0, -64);
      ctx.quadraticCurveTo(30, -64, 34, -40);
      ctx.lineTo(28, -42);
      ctx.quadraticCurveTo(24, -60, 0, -60);
      ctx.closePath();
      ctx.fill();
      // Edge shine
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(2, -63);
      ctx.quadraticCurveTo(28, -63, 32, -42);
      ctx.stroke();
      break;
    }
    case "chains": {
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = 4;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(14, -36);
      ctx.stroke();
      ctx.strokeStyle = "#a8a29e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(14, -36);
      ctx.stroke();
      ctx.setLineDash([]);
      // Flail head
      outlinedCircle(ctx, 14, -38, 7, "#78716c");
      // Spikes
      ctx.fillStyle = "#a8a29e";
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(14 + Math.cos(a) * 7, -38 + Math.sin(a) * 7);
        ctx.lineTo(14 + Math.cos(a) * 12, -38 + Math.sin(a) * 12);
        ctx.lineTo(14 + Math.cos(a + 0.3) * 7, -38 + Math.sin(a + 0.3) * 7);
        ctx.closePath();
        ctx.fill();
      }
      break;
    }
    case "dual-blades": {
      // Blade outline
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(-2.5, -46, 5, 46);
      // Blade
      const dbGrad = ctx.createLinearGradient(-2, 0, 2, 0);
      dbGrad.addColorStop(0, "#a0a0a0");
      dbGrad.addColorStop(0.5, "#d0d0d0");
      dbGrad.addColorStop(1, "#a0a0a0");
      ctx.fillStyle = dbGrad;
      ctx.fillRect(-1.5, -44, 3, 44);
      // Guard
      ctx.fillStyle = vis.accentColor + "80";
      ctx.fillRect(-5, -2, 10, 4);
      break;
    }
    case "orb": {
      // Outer glow
      ctx.fillStyle = vis.accentColor + "30";
      ctx.beginPath();
      ctx.arc(0, -16, 16, 0, Math.PI * 2);
      ctx.fill();
      // Orb outline
      outlinedCircle(ctx, 0, -16, 10, vis.accentColor + "70");
      // Inner bright core
      ctx.fillStyle = lighten(vis.accentColor, 0.3);
      ctx.beginPath();
      ctx.arc(-2, -18, 4, 0, Math.PI * 2);
      ctx.fill();
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

  if (vis.hasHelmet) {
    switch (vis.helmetStyle) {
      case "visor": {
        outlinedCircle(ctx, 0, 0, radius + 3, vis.secondaryColor);
        // Visor slit with glow
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(-radius * 0.75, -3, radius * 1.5, 6);
        ctx.fillStyle = vis.eyeColor;
        ctx.shadowColor = vis.eyeColor;
        ctx.shadowBlur = 8;
        ctx.fillRect(-radius * 0.65, -2, radius * 1.3, 4);
        ctx.shadowBlur = 0;
        // Helmet ridge
        ctx.strokeStyle = vis.accentColor + "40";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, radius + 3, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.stroke();
        break;
      }
      case "crown": {
        outlinedCircle(ctx, 0, 2, radius, vis.secondaryColor);
        // Crown base
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(-radius - 2, -radius - 2, radius * 2 + 4, 8);
        ctx.fillStyle = vis.accentColor;
        ctx.fillRect(-radius, -radius, radius * 2, 6);
        // Crown points
        for (let i = -2; i <= 2; i++) {
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.beginPath();
          ctx.moveTo(i * 9 - 4, -radius);
          ctx.lineTo(i * 9, -radius - 16);
          ctx.lineTo(i * 9 + 4, -radius);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = vis.accentColor;
          ctx.beginPath();
          ctx.moveTo(i * 9 - 3, -radius + 1);
          ctx.lineTo(i * 9, -radius - 14);
          ctx.lineTo(i * 9 + 3, -radius + 1);
          ctx.closePath();
          ctx.fill();
        }
        // Crown jewels
        ctx.fillStyle = "#ff0000";
        ctx.shadowColor = "#ff0000";
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(0, -radius - 8, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        drawEyes(ctx, 0, 0, radius, vis.eyeColor);
        break;
      }
      case "hood": {
        // Hood outline
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.beginPath();
        ctx.arc(0, 0, radius + 6, -Math.PI, 0);
        ctx.lineTo(radius + 10, radius * 0.4);
        ctx.quadraticCurveTo(0, radius + 4, -radius - 10, radius * 0.4);
        ctx.closePath();
        ctx.fill();
        // Hood fill
        const hoodGrad = ctx.createLinearGradient(0, -radius - 4, 0, radius);
        hoodGrad.addColorStop(0, darken(vis.primaryColor, 0.25));
        hoodGrad.addColorStop(1, darken(vis.primaryColor, 0.4));
        ctx.fillStyle = hoodGrad;
        ctx.beginPath();
        ctx.arc(0, 0, radius + 4, -Math.PI, 0);
        ctx.lineTo(radius + 8, radius * 0.35);
        ctx.quadraticCurveTo(0, radius + 2, -radius - 8, radius * 0.35);
        ctx.closePath();
        ctx.fill();
        // Shadowed face
        ctx.fillStyle = "#050505";
        ctx.beginPath();
        ctx.arc(0, 2, radius - 3, 0, Math.PI * 2);
        ctx.fill();
        // Glowing eyes
        ctx.fillStyle = vis.eyeColor;
        ctx.shadowColor = vis.eyeColor;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(-6, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
      }
      case "mask": {
        outlinedCircle(ctx, 0, 0, radius + 2, vis.secondaryColor);
        // Mask pattern lines
        ctx.strokeStyle = vis.accentColor + "50";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-radius - 1, 0);
        ctx.lineTo(radius + 1, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -radius);
        ctx.lineTo(0, radius * 0.5);
        ctx.stroke();
        // Eyes
        ctx.fillStyle = vis.eyeColor;
        ctx.shadowColor = vis.eyeColor;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.ellipse(-6, -2, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(6, -2, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
      }
      case "horns": {
        outlinedCircle(ctx, 0, 0, radius + 2, vis.secondaryColor);
        // Horns with outline
        for (const dir of [-1, 1]) {
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.beginPath();
          ctx.moveTo(dir * radius, -radius * 0.5);
          ctx.lineTo(dir * (radius + 14), -radius - 22);
          ctx.lineTo(dir * (radius - 6), -radius);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = vis.accentColor;
          ctx.beginPath();
          ctx.moveTo(dir * (radius - 1), -radius * 0.5 + 1);
          ctx.lineTo(dir * (radius + 12), -radius - 20);
          ctx.lineTo(dir * (radius - 5), -radius + 1);
          ctx.closePath();
          ctx.fill();
        }
        drawEyes(ctx, 0, 0, radius, vis.eyeColor);
        break;
      }
      case "halo": {
        outlinedCircle(ctx, 0, 0, radius, lighten(vis.primaryColor, 0.1));
        // Halo with glow
        ctx.strokeStyle = vis.accentColor;
        ctx.lineWidth = 3;
        ctx.shadowColor = vis.accentColor;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.ellipse(0, -radius - 10, radius + 8, 6, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
        drawEyes(ctx, 0, 0, radius, vis.eyeColor);
        break;
      }
      default: {
        outlinedCircle(ctx, 0, 0, radius, lighten(vis.primaryColor, 0.1));
        drawEyes(ctx, 0, 0, radius, vis.eyeColor);
      }
    }
  } else {
    // No helmet — skin + hair
    outlinedCircle(ctx, 0, 0, radius, lighten(vis.primaryColor, 0.15));
    // Hair
    ctx.fillStyle = darken(vis.primaryColor, 0.2);
    ctx.beginPath();
    ctx.arc(0, -3, radius + 2, -Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    // Face highlight
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath();
    ctx.arc(-3, -3, radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
    drawEyes(ctx, 0, 0, radius, vis.eyeColor);
  }

  ctx.restore();
}

function drawEyes(ctx: OffscreenCanvasRenderingContext2D, cx: number, cy: number, headR: number, eyeColor: string) {
  // Eye sockets (dark)
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(cx - headR * 0.3, cy - 1, 5, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + headR * 0.3, cy - 1, 5, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Glowing iris
  ctx.fillStyle = eyeColor;
  ctx.shadowColor = eyeColor;
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.ellipse(cx - headR * 0.3, cy - 1, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + headR * 0.3, cy - 1, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // Bright pupil
  ctx.fillStyle = lighten(eyeColor, 0.3);
  ctx.beginPath();
  ctx.arc(cx - headR * 0.3, cy - 1, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + headR * 0.3, cy - 1, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

/* ═══════════════════════════════════════════════════════
   FRAME GENERATION — Animation poses
   ═══════════════════════════════════════════════════════ */

function generateFrame(id: string, state: AnimState, frameIdx: number): OffscreenCanvas {
  const canvas = new OffscreenCanvas(SPRITE_W, SPRITE_H);
  const ctx = canvas.getContext("2d")!;
  const vis = getVisual(id);
  const cx = SPRITE_W / 2;
  const baseY = SPRITE_H - 20;

  ctx.clearRect(0, 0, SPRITE_W, SPRITE_H);

  const t = frameIdx;

  switch (state) {
    case "idle": {
      const breathe = Math.sin(t * 0.8) * 3;
      drawBody(ctx, vis, cx, baseY - breathe, {
        leftArmAngle: -0.2 + Math.sin(t * 0.5) * 0.06,
        rightArmAngle: 0.2 + Math.sin(t * 0.5 + 1) * 0.06,
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
        torsoLean: Math.sin(t * 1.2) * 3,
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
      const progress = t / 5;
      const punchExtend = progress < 0.5 ? progress * 2 : 2 - progress * 2;
      drawBody(ctx, vis, cx, baseY, {
        torsoLean: punchExtend * 8,
        rightArmAngle: -1.2 + punchExtend * 1.8,
        rightForearmAngle: -0.8 + punchExtend * 1.2,
        leftArmAngle: -0.5,
        leftForearmAngle: 0.8,
        leftLegAngle: -0.1,
        rightLegAngle: 0.15 + punchExtend * 0.1,
      });
      // Impact flash
      if (progress > 0.3 && progress < 0.7) {
        ctx.fillStyle = vis.accentColor + "50";
        ctx.beginPath();
        ctx.arc(cx + 70 + punchExtend * 16, baseY - vis.body.torsoH - vis.body.legLen + 40, 18, 0, Math.PI * 2);
        ctx.fill();
        // Impact lines
        ctx.strokeStyle = "#ffffff60";
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          const r1 = 10;
          const r2 = 22;
          ctx.beginPath();
          ctx.moveTo(cx + 70 + punchExtend * 16 + Math.cos(angle) * r1, baseY - vis.body.torsoH - vis.body.legLen + 40 + Math.sin(angle) * r1);
          ctx.lineTo(cx + 70 + punchExtend * 16 + Math.cos(angle) * r2, baseY - vis.body.torsoH - vis.body.legLen + 40 + Math.sin(angle) * r2);
          ctx.stroke();
        }
      }
      break;
    }
    case "kick": {
      const progress = t / 5;
      const kickExtend = progress < 0.4 ? progress * 2.5 : (1 - progress) * 1.67;
      drawBody(ctx, vis, cx - 6, baseY, {
        torsoLean: -kickExtend * 5,
        rightLegAngle: -0.8 + kickExtend * 1.6,
        leftLegAngle: -0.1,
        leftArmAngle: -0.6,
        rightArmAngle: 0.6,
        leftForearmAngle: 0.6,
        rightForearmAngle: -0.3,
      });
      // Kick trail arc
      if (progress > 0.2 && progress < 0.8) {
        ctx.strokeStyle = vis.accentColor + "40";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx + 50, baseY - 30, 24 * kickExtend, -0.6, 0.6);
        ctx.stroke();
      }
      break;
    }
    case "block": {
      drawBody(ctx, vis, cx, baseY + 6, {
        torsoLean: -3,
        leftArmAngle: -1.2,
        rightArmAngle: -1.0,
        leftForearmAngle: 1.5,
        rightForearmAngle: 1.3,
        leftLegAngle: -0.15,
        rightLegAngle: 0.15,
        crouching: true,
      });
      // Shield effect
      ctx.strokeStyle = "#ffffff50";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx + 16, baseY - vis.body.torsoH - vis.body.legLen + 50, 40, -1.2, 1.2);
      ctx.stroke();
      ctx.fillStyle = vis.accentColor + "10";
      ctx.fill();
      break;
    }
    case "special": {
      const pulse = Math.sin(t * 0.6) * 0.5 + 0.5;
      drawBody(ctx, vis, cx, baseY - 6 - pulse * 6, {
        torsoLean: 0,
        leftArmAngle: -1.5 - pulse * 0.3,
        rightArmAngle: 1.5 + pulse * 0.3,
        leftForearmAngle: -0.5,
        rightForearmAngle: 0.5,
        leftLegAngle: -0.2,
        rightLegAngle: 0.2,
      });
      // Energy aura
      const auraR = 60 + pulse * 24;
      const auraGrad = ctx.createRadialGradient(cx, baseY - 110, 0, cx, baseY - 110, auraR);
      auraGrad.addColorStop(0, vis.glowColor + "35");
      auraGrad.addColorStop(0.6, vis.glowColor + "12");
      auraGrad.addColorStop(1, vis.glowColor + "00");
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, baseY - 110, auraR, 0, Math.PI * 2);
      ctx.fill();
      // Energy ring
      ctx.strokeStyle = vis.glowColor + "70";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 6]);
      ctx.lineDashOffset = -t * 6;
      ctx.beginPath();
      ctx.arc(cx, baseY - 110, auraR * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      break;
    }
    case "hit": {
      const recoil = t < 3 ? t / 3 : 1 - (t - 3) / 3;
      drawBody(ctx, vis, cx - recoil * 16, baseY, {
        torsoLean: -recoil * 10,
        headTilt: -recoil * 4,
        leftArmAngle: -0.3 - recoil * 0.5,
        rightArmAngle: 0.3 + recoil * 0.5,
        leftForearmAngle: 0.6 + recoil * 0.3,
        rightForearmAngle: -0.6 - recoil * 0.3,
        leftLegAngle: -0.1 - recoil * 0.2,
        rightLegAngle: 0.1 + recoil * 0.1,
      });
      // Hit flash overlay
      if (t < 3) {
        ctx.fillStyle = `rgba(255,255,255,${0.35 - t * 0.12})`;
        ctx.fillRect(0, 0, SPRITE_W, SPRITE_H);
      }
      break;
    }
    case "victory": {
      const pump = Math.sin(t * 0.4) * 0.3;
      drawBody(ctx, vis, cx, baseY - 3, {
        torsoLean: 0,
        leftArmAngle: -2.5 - pump,
        rightArmAngle: 2.5 + pump,
        leftForearmAngle: -0.5,
        rightForearmAngle: 0.5,
        leftLegAngle: -0.15,
        rightLegAngle: 0.15,
      });
      // Victory glow
      ctx.fillStyle = vis.glowColor + "18";
      ctx.beginPath();
      ctx.arc(cx, baseY - 110, 60 + pump * 16, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "ko": {
      ctx.save();
      ctx.translate(cx, baseY - 24);
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
      // Fade
      ctx.fillStyle = `rgba(0,0,0,${0.12 + Math.sin(t * 0.2) * 0.06})`;
      ctx.fillRect(0, 0, SPRITE_W, SPRITE_H);
      break;
    }
    case "crouch": {
      drawBody(ctx, vis, cx, baseY + 14, {
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

  // Draw character-specific visual details on top
  drawCharacterDetails(ctx, id, cx, baseY, frameIdx, state);

  return canvas;
}

/* ═══ PUBLIC API ═══ */

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
  idle: 8,
  walk: 5,
  punch: 3,
  kick: 3,
  block: 6,
  special: 4,
  hit: 4,
  victory: 6,
  ko: 10,
  crouch: 5,
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

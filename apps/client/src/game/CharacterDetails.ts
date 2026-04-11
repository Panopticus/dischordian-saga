/* ═══════════════════════════════════════════════════════
   CHARACTER DETAILS — Unique per-character visual overlays
   Each character gets custom drawing that makes them
   visually distinct and recognizable. Called after the
   base body is drawn to add character-specific features.
   ═══════════════════════════════════════════════════════ */

type Ctx = OffscreenCanvasRenderingContext2D;

interface DetailParams {
  cx: number;       // center X
  baseY: number;    // ground Y
  t: number;        // animation frame index
  state: string;    // current animation state
  facing?: 1 | -1;  // direction facing
}

/* ─── HELPER FUNCTIONS ─── */

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbStr(hex: string, alpha = 1): string {
  const [r, g, b] = hexToRgb(hex);
  return alpha < 1 ? `rgba(${r},${g},${b},${alpha})` : `rgb(${r},${g},${b})`;
}

/* ═══════════════════════════════════════════════════════
   THE ARCHITECT — Creator of the AI Empire
   Visual: Imposing dark figure with ornate golden crown,
   flowing crimson robes with gold embroidery, reality-
   distortion energy orb, geometric patterns on armor,
   and a menacing red eye glow
   ═══════════════════════════════════════════════════════ */
function drawArchitect(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t, state } = p;
  const breathe = state === "idle" ? Math.sin(t * 0.8) * 2 : 0;
  const bodyTop = baseY - 70 - 36 - breathe; // approximate torso top

  // ── Flowing robe bottom (extends below torso) ──
  const robeY = baseY - 40;
  ctx.fillStyle = "#1a0000";
  ctx.beginPath();
  ctx.moveTo(cx - 22, robeY);
  // Flowing robe shape with wave
  const robeWave = Math.sin(t * 0.6) * 3;
  ctx.quadraticCurveTo(cx - 28 + robeWave, baseY - 10, cx - 20, baseY + 2);
  ctx.lineTo(cx + 20, baseY + 2);
  ctx.quadraticCurveTo(cx + 28 - robeWave, baseY - 10, cx + 22, robeY);
  ctx.closePath();
  ctx.fill();
  // Robe gold trim
  ctx.strokeStyle = "#fbbf2480";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 20, baseY + 1);
  ctx.quadraticCurveTo(cx, baseY + 4 + robeWave, cx + 20, baseY + 1);
  ctx.stroke();

  // ── Ornate crown jewels (on top of the base crown) ──
  const crownY = bodyTop - 14;
  // Center jewel (large ruby)
  ctx.fillStyle = "#ff0000";
  ctx.shadowColor = "#ff0000";
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(cx, crownY - 6, 3, 0, Math.PI * 2);
  ctx.fill();
  // Side jewels
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(cx - 8, crownY - 3, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 8, crownY - 3, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // ── Crown gold band ──
  ctx.fillStyle = "#fbbf2490";
  ctx.fillRect(cx - 13, crownY + 2, 26, 3);

  // ── Geometric chest emblem (All-Seeing Eye / Triangle) ──
  const chestY = bodyTop + 20;
  ctx.strokeStyle = "#fbbf2460";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx, chestY - 8);
  ctx.lineTo(cx - 8, chestY + 6);
  ctx.lineTo(cx + 8, chestY + 6);
  ctx.closePath();
  ctx.stroke();
  // Eye in triangle
  ctx.fillStyle = "#ff000080";
  ctx.beginPath();
  ctx.arc(cx, chestY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ff0000";
  ctx.beginPath();
  ctx.ellipse(cx, chestY, 2, 1.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Gold shoulder trim ──
  ctx.strokeStyle = "#fbbf2470";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx - 20, bodyTop + 6, 8, -Math.PI * 0.8, -Math.PI * 0.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + 20, bodyTop + 6, 8, -Math.PI * 0.8, -Math.PI * 0.2);
  ctx.stroke();

  // ── Reality distortion orb (floating near right hand) ──
  if (state !== "ko" && state !== "hit") {
    const orbX = cx + 30 + Math.sin(t * 0.4) * 3;
    const orbY = baseY - 55 + Math.cos(t * 0.3) * 4 - breathe;
    const orbPulse = 0.7 + Math.sin(t * 0.6) * 0.3;

    // Outer glow
    const orbGrad = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, 14 * orbPulse);
    orbGrad.addColorStop(0, "rgba(239,68,68,0.4)");
    orbGrad.addColorStop(0.5, "rgba(239,68,68,0.15)");
    orbGrad.addColorStop(1, "rgba(239,68,68,0)");
    ctx.fillStyle = orbGrad;
    ctx.beginPath();
    ctx.arc(orbX, orbY, 14 * orbPulse, 0, Math.PI * 2);
    ctx.fill();

    // Core orb
    ctx.fillStyle = "rgba(255,100,100,0.8)";
    ctx.beginPath();
    ctx.arc(orbX, orbY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright core
    ctx.fillStyle = "rgba(255,200,200,0.9)";
    ctx.beginPath();
    ctx.arc(orbX, orbY, 2, 0, Math.PI * 2);
    ctx.fill();

    // Orbiting particles
    for (let i = 0; i < 3; i++) {
      const angle = (t * 0.15) + (i * Math.PI * 2 / 3);
      const px = orbX + Math.cos(angle) * 8;
      const py = orbY + Math.sin(angle) * 8;
      ctx.fillStyle = `rgba(255,${100 + i * 50},${50 + i * 30},${0.5 + Math.sin(t * 0.3 + i) * 0.3})`;
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── Red energy veins on arms (tech/magic hybrid) ──
  ctx.strokeStyle = "rgba(239,68,68,0.25)";
  ctx.lineWidth = 0.5;
  // Left arm vein
  ctx.beginPath();
  ctx.moveTo(cx - 18, bodyTop + 15);
  ctx.quadraticCurveTo(cx - 22, bodyTop + 30, cx - 20, bodyTop + 45);
  ctx.stroke();
  // Right arm vein
  ctx.beginPath();
  ctx.moveTo(cx + 18, bodyTop + 15);
  ctx.quadraticCurveTo(cx + 22, bodyTop + 30, cx + 20, bodyTop + 45);
  ctx.stroke();

  // ── Ground shadow / power aura ──
  if (state === "idle" || state === "special" || state === "victory") {
    const auraAlpha = 0.1 + Math.sin(t * 0.3) * 0.05;
    ctx.fillStyle = `rgba(239,68,68,${auraAlpha})`;
    ctx.beginPath();
    ctx.ellipse(cx, baseY + 2, 25, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Special state: Genesis Protocol energy burst ──
  if (state === "special") {
    const pulse = Math.sin(t * 0.6) * 0.5 + 0.5;
    // Geometric pattern expanding outward
    ctx.save();
    ctx.translate(cx, baseY - 60);
    ctx.rotate(t * 0.05);
    ctx.strokeStyle = `rgba(239,68,68,${0.3 + pulse * 0.3})`;
    ctx.lineWidth = 1;
    // Hexagonal pattern
    for (let ring = 0; ring < 3; ring++) {
      const r = 20 + ring * 12 + pulse * 8;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2 / 6);
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }
}

/* ═══════════════════════════════════════════════════════
   THE COLLECTOR — Keeper of Forbidden Knowledge
   Visual: Hunched figure in deep purple robes, hood
   casting shadow over face, floating artifacts orbit
   around him, staff with pulsing crystal, soul jars
   ═══════════════════════════════════════════════════════ */
function drawCollector(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t, state } = p;
  const bodyTop = baseY - 70 - 34;

  // ── Floating artifacts orbiting ──
  if (state !== "ko") {
    for (let i = 0; i < 4; i++) {
      const angle = (t * 0.08) + (i * Math.PI / 2);
      const orbitR = 22 + Math.sin(t * 0.2 + i) * 4;
      const ax = cx + Math.cos(angle) * orbitR;
      const ay = baseY - 50 + Math.sin(angle) * 8 + Math.sin(t * 0.3 + i) * 3;
      // Artifact glow
      ctx.fillStyle = `rgba(168,85,247,${0.3 + Math.sin(t * 0.4 + i) * 0.2})`;
      ctx.beginPath();
      ctx.arc(ax, ay, 3, 0, Math.PI * 2);
      ctx.fill();
      // Artifact shape (diamond)
      ctx.fillStyle = "#c084fc80";
      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(t * 0.1 + i);
      ctx.fillRect(-2, -2, 4, 4);
      ctx.restore();
    }
  }

  // ── Hood shadow deepening ──
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.arc(cx, bodyTop - 8, 10, 0.3, Math.PI - 0.3);
  ctx.closePath();
  ctx.fill();

  // ── Rune markings on robes ──
  ctx.strokeStyle = "#a855f730";
  ctx.lineWidth = 0.8;
  const runeY = bodyTop + 25;
  // Vertical rune lines
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(cx + i * 5, runeY);
    ctx.lineTo(cx + i * 5, runeY + 8);
    ctx.stroke();
  }
  // Horizontal rune
  ctx.beginPath();
  ctx.moveTo(cx - 10, runeY + 4);
  ctx.lineTo(cx + 10, runeY + 4);
  ctx.stroke();

  // ── Staff crystal glow ──
  if (state !== "ko") {
    const crystalPulse = 0.5 + Math.sin(t * 0.5) * 0.5;
    const crystalGrad = ctx.createRadialGradient(cx + 20, bodyTop - 5, 0, cx + 20, bodyTop - 5, 10);
    crystalGrad.addColorStop(0, `rgba(168,85,247,${0.5 * crystalPulse})`);
    crystalGrad.addColorStop(1, "rgba(168,85,247,0)");
    ctx.fillStyle = crystalGrad;
    ctx.beginPath();
    ctx.arc(cx + 20, bodyTop - 5, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Soul wisps trailing ──
  if (state === "idle" || state === "walk") {
    for (let i = 0; i < 3; i++) {
      const wispX = cx - 15 + i * 15 + Math.sin(t * 0.3 + i * 2) * 5;
      const wispY = baseY - 20 - Math.abs(Math.sin(t * 0.2 + i)) * 15;
      ctx.fillStyle = `rgba(192,132,252,${0.15 + Math.sin(t * 0.4 + i) * 0.1})`;
      ctx.beginPath();
      ctx.arc(wispX, wispY, 2 + Math.sin(t * 0.3 + i) * 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/* ═══════════════════════════════════════════════════════
   THE ENIGMA (Malkia Ukweli) — The Human
   Visual: Agile warrior with cyan energy trails,
   flowing hair, dual blade energy arcs, speed lines,
   determination in stance
   ═══════════════════════════════════════════════════════ */
function drawEnigma(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t, state } = p;
  const bodyTop = baseY - 70 - 34;

  // ── Flowing hair strands ──
  ctx.strokeStyle = "#22d3ee60";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 4; i++) {
    const hairX = cx - 6 + i * 4;
    const wave = Math.sin(t * 0.4 + i * 0.8) * 4;
    ctx.beginPath();
    ctx.moveTo(hairX, bodyTop - 8);
    ctx.quadraticCurveTo(hairX - 4 + wave, bodyTop + 5, hairX - 6 + wave * 1.5, bodyTop + 15);
    ctx.stroke();
  }

  // ── Blade energy trails ──
  if (state === "punch" || state === "kick" || state === "special") {
    ctx.strokeStyle = "rgba(34,211,238,0.4)";
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.lineDashOffset = -t * 6;
    // Arc trails
    ctx.beginPath();
    ctx.arc(cx + 15, baseY - 50, 20, -1, 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx - 15, baseY - 50, 20, Math.PI - 0.5, Math.PI + 1);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ── Speed lines when walking ──
  if (state === "walk") {
    ctx.strokeStyle = "rgba(34,211,238,0.15)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const ly = baseY - 30 - i * 12;
      ctx.beginPath();
      ctx.moveTo(cx - 30, ly);
      ctx.lineTo(cx - 45 - Math.random() * 10, ly);
      ctx.stroke();
    }
  }

  // ── Cyan energy pulse at feet ──
  if (state !== "ko") {
    const footGlow = Math.sin(t * 0.5) * 0.15 + 0.1;
    ctx.fillStyle = `rgba(34,211,238,${footGlow})`;
    ctx.beginPath();
    ctx.ellipse(cx, baseY + 1, 15, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Determination marks (anime style) ──
  if (state === "special") {
    ctx.strokeStyle = "rgba(34,211,238,0.6)";
    ctx.lineWidth = 2;
    // Cross marks near head
    ctx.beginPath();
    ctx.moveTo(cx + 15, bodyTop - 15);
    ctx.lineTo(cx + 20, bodyTop - 10);
    ctx.moveTo(cx + 20, bodyTop - 15);
    ctx.lineTo(cx + 15, bodyTop - 10);
    ctx.stroke();
  }
}

/* ═══════════════════════════════════════════════════════
   THE WARLORD — Military Commander
   Visual: Massive armored figure, yellow/gold plating,
   battle scars, war hammer crackling with energy,
   military insignia, intimidating visor
   ═══════════════════════════════════════════════════════ */
function drawWarlord(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t, state } = p;
  const bodyTop = baseY - 70 - 40;

  // ── Visor glow line ──
  ctx.fillStyle = "#f59e0b";
  ctx.shadowColor = "#f59e0b";
  ctx.shadowBlur = 4;
  ctx.fillRect(cx - 10, bodyTop - 12, 20, 3);
  ctx.shadowBlur = 0;

  // ── Battle scars (diagonal lines on torso) ──
  ctx.strokeStyle = "rgba(120,80,40,0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 10, bodyTop + 12);
  ctx.lineTo(cx + 5, bodyTop + 22);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 8, bodyTop + 8);
  ctx.lineTo(cx - 3, bodyTop + 18);
  ctx.stroke();

  // ── Military insignia (star) on chest ──
  ctx.fillStyle = "#fbbf2480";
  const starCx = cx;
  const starCy = bodyTop + 18;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
    const x = starCx + Math.cos(angle) * 5;
    const y = starCy + Math.sin(angle) * 5;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // ── Hammer energy crackle ──
  if (state !== "ko" && state !== "hit") {
    ctx.strokeStyle = `rgba(251,191,36,${0.3 + Math.sin(t * 0.8) * 0.2})`;
    ctx.lineWidth = 1;
    const hammerX = cx + 22;
    const hammerY = bodyTop + 10;
    // Lightning bolts from hammer
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      const startX = hammerX + (Math.random() - 0.5) * 8;
      ctx.moveTo(startX, hammerY - 5);
      ctx.lineTo(startX + 3, hammerY - 12);
      ctx.lineTo(startX - 2, hammerY - 8);
      ctx.lineTo(startX + 1, hammerY - 18);
      ctx.stroke();
    }
  }

  // ── Heavy boot treads ──
  ctx.fillStyle = "#78716c40";
  ctx.fillRect(cx - 18, baseY, 10, 3);
  ctx.fillRect(cx + 8, baseY, 10, 3);

  // ── Ground crack effect on special ──
  if (state === "special") {
    ctx.strokeStyle = "rgba(251,191,36,0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, baseY + 2);
    ctx.lineTo(cx - 20, baseY + 5);
    ctx.moveTo(cx, baseY + 2);
    ctx.lineTo(cx + 25, baseY + 4);
    ctx.moveTo(cx, baseY + 2);
    ctx.lineTo(cx - 10, baseY + 7);
    ctx.stroke();
  }
}

/* ═══════════════════════════════════════════════════════
   THE NECROMANCER — Master of Death
   Visual: Skeletal thin figure, green death energy,
   scythe with dripping essence, skull motifs,
   floating bone fragments, necrotic aura
   ═══════════════════════════════════════════════════════ */
function drawNecromancer(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t, state } = p;
  const bodyTop = baseY - 70 - 36;

  // ── Skull motif on hood ──
  ctx.fillStyle = "#10b98140";
  const skullY = bodyTop - 6;
  // Eye sockets (skull-like)
  ctx.beginPath();
  ctx.arc(cx - 4, skullY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 4, skullY, 3, 0, Math.PI * 2);
  ctx.fill();
  // Nose triangle
  ctx.beginPath();
  ctx.moveTo(cx, skullY + 3);
  ctx.lineTo(cx - 1.5, skullY + 6);
  ctx.lineTo(cx + 1.5, skullY + 6);
  ctx.closePath();
  ctx.fill();

  // ── Floating bone fragments ──
  if (state !== "ko") {
    for (let i = 0; i < 3; i++) {
      const bx = cx - 20 + i * 20 + Math.sin(t * 0.2 + i * 2) * 6;
      const by = baseY - 30 - Math.abs(Math.sin(t * 0.15 + i)) * 20;
      ctx.fillStyle = "#d6d3d140";
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(t * 0.1 + i);
      ctx.fillRect(-3, -1, 6, 2);
      ctx.restore();
    }
  }

  // ── Necrotic drip from scythe ──
  if (state !== "ko") {
    const dripX = cx + 22;
    for (let i = 0; i < 2; i++) {
      const dripY = bodyTop + 5 + (t * 2 + i * 10) % 30;
      ctx.fillStyle = `rgba(16,185,129,${0.4 - (dripY - bodyTop) * 0.01})`;
      ctx.beginPath();
      ctx.ellipse(dripX + i * 3, dripY, 1.5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── Death aura ground effect ──
  const auraAlpha = 0.08 + Math.sin(t * 0.3) * 0.04;
  ctx.fillStyle = `rgba(16,185,129,${auraAlpha})`;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + 2, 28, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Spectral wisps rising ──
  if (state === "idle" || state === "special") {
    for (let i = 0; i < 4; i++) {
      const wx = cx - 15 + i * 10 + Math.sin(t * 0.2 + i) * 3;
      const wy = baseY - (t * 1.5 + i * 8) % 40;
      ctx.fillStyle = `rgba(52,211,153,${0.2 - ((baseY - wy) / 40) * 0.2})`;
      ctx.beginPath();
      ctx.arc(wx, wy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/* ═══════════════════════════════════════════════════════
   THE MEME — Shapeshifter / Trickster
   Visual: Glitchy, unstable form that shifts colors,
   digital distortion effects, pixelated edges,
   face constantly changing, chaotic energy
   ═══════════════════════════════════════════════════════ */
function drawMeme(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t, state } = p;
  const bodyTop = baseY - 70 - 34;

  // ── Glitch effect (random color bars) ──
  if (state !== "ko") {
    for (let i = 0; i < 3; i++) {
      const glitchY = bodyTop + 10 + Math.floor(Math.sin(t * 1.5 + i * 3) * 20 + 20);
      const glitchW = 8 + Math.floor(Math.sin(t * 2 + i) * 5);
      const glitchX = cx - glitchW / 2 + Math.sin(t * 0.8 + i) * 5;
      ctx.fillStyle = `rgba(236,72,153,${0.15 + Math.sin(t * 0.5 + i) * 0.1})`;
      ctx.fillRect(glitchX, glitchY, glitchW, 2);
    }
  }

  // ── Face shifting effect (multiple overlapping faces) ──
  const faceAlpha = 0.15 + Math.sin(t * 0.3) * 0.1;
  ctx.strokeStyle = `rgba(244,114,182,${faceAlpha})`;
  ctx.lineWidth = 0.5;
  // Ghost face offset
  const ghostOff = Math.sin(t * 0.5) * 3;
  ctx.beginPath();
  ctx.arc(cx + ghostOff, bodyTop - 8, 10, 0, Math.PI * 2);
  ctx.stroke();

  // ── Digital noise particles ──
  for (let i = 0; i < 5; i++) {
    const nx = cx - 20 + ((t * 7 + i * 13) % 40);
    const ny = bodyTop + ((t * 5 + i * 17) % 60);
    ctx.fillStyle = `rgba(${200 + (i * 30) % 55},${50 + (i * 40) % 100},${150 + (i * 20) % 80},0.3)`;
    ctx.fillRect(nx, ny, 2, 2);
  }

  // ── Mask crack lines ──
  ctx.strokeStyle = "#f472b640";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(cx - 2, bodyTop - 14);
  ctx.lineTo(cx - 5, bodyTop - 4);
  ctx.lineTo(cx - 3, bodyTop + 2);
  ctx.stroke();

  // ── Chaos energy sparks ──
  if (state === "special" || state === "punch") {
    for (let i = 0; i < 6; i++) {
      const angle = t * 0.2 + i * Math.PI / 3;
      const dist = 15 + Math.sin(t * 0.5 + i) * 8;
      const sx = cx + Math.cos(angle) * dist;
      const sy = baseY - 50 + Math.sin(angle) * dist * 0.5;
      ctx.fillStyle = ["#ec4899", "#f472b6", "#db2777", "#f9a8d4"][i % 4] + "60";
      ctx.beginPath();
      ctx.arc(sx, sy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/* ═══════════════════════════════════════════════════════
   THE ORACLE — Prophet of the Fall
   Visual: Ethereal figure with third eye, flowing
   purple/magenta robes, prophecy symbols floating,
   crystal ball energy, mystical sigils
   ═══════════════════════════════════════════════════════ */
function drawOracle(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t, state } = p;
  const bodyTop = baseY - 70 - 34;

  // ── Third eye on forehead ──
  const eyeY = bodyTop - 14;
  ctx.fillStyle = "#e879f9";
  ctx.shadowColor = "#e879f9";
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.ellipse(cx, eyeY, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // Pupil
  ctx.fillStyle = "#faf5ff";
  ctx.beginPath();
  ctx.arc(cx, eyeY, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // ── Prophecy symbols floating ──
  if (state !== "ko") {
    const symbols = ["◇", "△", "○", "☆"];
    ctx.font = "8px monospace";
    for (let i = 0; i < 4; i++) {
      const angle = t * 0.06 + i * Math.PI / 2;
      const dist = 25 + Math.sin(t * 0.2 + i) * 5;
      const sx = cx + Math.cos(angle) * dist;
      const sy = baseY - 50 + Math.sin(angle) * 10;
      ctx.fillStyle = `rgba(232,121,249,${0.3 + Math.sin(t * 0.3 + i) * 0.15})`;
      ctx.fillText(symbols[i], sx - 3, sy);
    }
  }

  // ── Mystical sigil on ground ──
  ctx.strokeStyle = `rgba(192,38,211,${0.1 + Math.sin(t * 0.2) * 0.05})`;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(cx, baseY + 1, 18, 0, Math.PI * 2);
  ctx.stroke();
  // Inner circle
  ctx.beginPath();
  ctx.arc(cx, baseY + 1, 12, 0, Math.PI * 2);
  ctx.stroke();
}

/* ═══════════════════════════════════════════════════════
   IRON LION — The Mechanical Warrior
   Visual: Massive mechanical frame, gold/bronze plating,
   glowing joints, exhaust vents, lion-like visor,
   hydraulic pistons visible
   ═══════════════════════════════════════════════════════ */
function drawIronLion(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t, state } = p;
  const bodyTop = baseY - 70 - 42;

  // ── Mechanical joint glows ──
  const jointGlow = 0.4 + Math.sin(t * 0.6) * 0.2;
  ctx.fillStyle = `rgba(245,158,11,${jointGlow})`;
  // Shoulder joints
  ctx.beginPath(); ctx.arc(cx - 22, bodyTop + 8, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 22, bodyTop + 8, 3, 0, Math.PI * 2); ctx.fill();
  // Knee joints
  ctx.beginPath(); ctx.arc(cx - 12, baseY - 20, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 12, baseY - 20, 2.5, 0, Math.PI * 2); ctx.fill();

  // ── Exhaust vents (steam puffs) ──
  if (state === "special" || state === "punch") {
    for (let i = 0; i < 3; i++) {
      const ventX = cx - 18 + i * 3;
      const ventY = bodyTop + 30 - i * 2 - t * 0.5;
      ctx.fillStyle = `rgba(200,200,200,${0.2 - i * 0.06})`;
      ctx.beginPath();
      ctx.arc(ventX, ventY, 2 + i, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── Lion mane detail (around visor) ──
  ctx.strokeStyle = "#fcd34d40";
  ctx.lineWidth = 1.5;
  for (let i = -3; i <= 3; i++) {
    const angle = (i * 0.3) - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 14, bodyTop - 10 + Math.sin(angle) * 14);
    ctx.lineTo(cx + Math.cos(angle) * 20, bodyTop - 10 + Math.sin(angle) * 20);
    ctx.stroke();
  }

  // ── Armor plate lines ──
  ctx.strokeStyle = "#d9770640";
  ctx.lineWidth = 0.8;
  // Chest plates
  ctx.beginPath();
  ctx.moveTo(cx - 16, bodyTop + 10);
  ctx.lineTo(cx - 8, bodyTop + 25);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 16, bodyTop + 10);
  ctx.lineTo(cx + 8, bodyTop + 25);
  ctx.stroke();

  // ── Heavy ground impact ──
  ctx.fillStyle = "rgba(180,83,9,0.08)";
  ctx.beginPath();
  ctx.ellipse(cx, baseY + 2, 30, 5, 0, 0, Math.PI * 2);
  ctx.fill();
}

/* ═══════════════════════════════════════════════════════
   AGENT ZERO — Assassin of the Insurgency
   Visual: Sleek dark figure, red targeting eye,
   stealth shimmer effect, afterimage trails,
   tactical gear details, silent and deadly
   ═══════════════════════════════════════════════════════ */
function drawAgentZero(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t, state } = p;
  const bodyTop = baseY - 70 - 34;

  // ── Red targeting eye (single glowing dot) ──
  ctx.fillStyle = "#ef4444";
  ctx.shadowColor = "#ef4444";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(cx + 3, bodyTop - 10, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // ── Targeting reticle ──
  if (state === "idle" || state === "punch") {
    ctx.strokeStyle = "rgba(239,68,68,0.2)";
    ctx.lineWidth = 0.5;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.arc(cx + 3, bodyTop - 10, 6, 0, Math.PI * 2);
    ctx.stroke();
    // Crosshair
    ctx.beginPath();
    ctx.moveTo(cx + 3, bodyTop - 17);
    ctx.lineTo(cx + 3, bodyTop - 3);
    ctx.moveTo(cx - 4, bodyTop - 10);
    ctx.lineTo(cx + 10, bodyTop - 10);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ── Afterimage trail when moving ──
  if (state === "walk" || state === "punch" || state === "kick") {
    for (let i = 1; i <= 3; i++) {
      ctx.fillStyle = `rgba(30,41,59,${0.08 * (4 - i)})`;
      ctx.beginPath();
      ctx.ellipse(cx - i * 8, baseY - 50, 12, 30, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── Stealth shimmer (scanline effect) ──
  if (state === "idle") {
    const shimmerY = bodyTop + (t * 3) % 60;
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.fillRect(cx - 15, shimmerY, 30, 2);
  }

  // ── Tactical belt detail ──
  ctx.fillStyle = "#47556940";
  ctx.fillRect(cx - 14, baseY - 42, 28, 3);
  // Belt pouches
  ctx.fillStyle = "#33415540";
  ctx.fillRect(cx - 12, baseY - 42, 5, 5);
  ctx.fillRect(cx + 7, baseY - 42, 5, 5);
}

/* ═══════════════════════════════════════════════════════
   AKAI SHI — The Red Death
   Visual: Japanese-inspired warrior, crimson mask with
   oni details, katana with blood trail, cherry blossom
   petals, red mist aura
   ═══════════════════════════════════════════════════════ */
function drawAkaiShi(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t, state } = p;
  const bodyTop = baseY - 70 - 34;

  // ── Oni mask horns ──
  ctx.fillStyle = "#dc262680";
  // Left horn
  ctx.beginPath();
  ctx.moveTo(cx - 10, bodyTop - 10);
  ctx.lineTo(cx - 15, bodyTop - 22);
  ctx.lineTo(cx - 7, bodyTop - 12);
  ctx.closePath();
  ctx.fill();
  // Right horn
  ctx.beginPath();
  ctx.moveTo(cx + 10, bodyTop - 10);
  ctx.lineTo(cx + 15, bodyTop - 22);
  ctx.lineTo(cx + 7, bodyTop - 12);
  ctx.closePath();
  ctx.fill();

  // ── Mask fangs ──
  ctx.fillStyle = "#fca5a560";
  ctx.beginPath();
  ctx.moveTo(cx - 4, bodyTop - 2);
  ctx.lineTo(cx - 3, bodyTop + 3);
  ctx.lineTo(cx - 2, bodyTop - 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 2, bodyTop - 2);
  ctx.lineTo(cx + 3, bodyTop + 3);
  ctx.lineTo(cx + 4, bodyTop - 2);
  ctx.fill();

  // ── Cherry blossom petals ──
  if (state !== "ko") {
    for (let i = 0; i < 5; i++) {
      const petalX = cx - 25 + ((t * 2 + i * 15) % 50);
      const petalY = bodyTop - 10 + ((t * 1.5 + i * 12) % 80);
      const petalAlpha = 0.3 - (petalY - bodyTop) * 0.003;
      if (petalAlpha > 0) {
        ctx.fillStyle = `rgba(252,165,165,${petalAlpha})`;
        ctx.save();
        ctx.translate(petalX, petalY);
        ctx.rotate(t * 0.1 + i);
        ctx.beginPath();
        ctx.ellipse(0, 0, 2, 1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  // ── Blood trail from sword ──
  if (state === "punch" || state === "special") {
    ctx.strokeStyle = "rgba(220,38,38,0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx + 20, baseY - 40, 18, -1.5, 0.5);
    ctx.stroke();
  }

  // ── Red mist at feet ──
  ctx.fillStyle = `rgba(220,38,38,${0.06 + Math.sin(t * 0.3) * 0.03})`;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + 1, 22, 4, 0, 0, Math.PI * 2);
  ctx.fill();
}

/* ═══════════════════════════════════════════════════════
   GENERIC DETAIL FUNCTIONS for remaining characters
   ═══════════════════════════════════════════════════════ */

function drawShadowTongue(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t } = p;
  const bodyTop = baseY - 70 - 36;
  // Shadow tendrils
  for (let i = 0; i < 4; i++) {
    const tx = cx - 10 + i * 7;
    const wave = Math.sin(t * 0.3 + i * 1.5) * 8;
    ctx.strokeStyle = `rgba(99,102,241,${0.2 - i * 0.04})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tx, baseY - 10);
    ctx.quadraticCurveTo(tx + wave, baseY - 30, tx + wave * 0.5, baseY - 50);
    ctx.stroke();
  }
  // Whisper particles
  for (let i = 0; i < 3; i++) {
    const wx = cx + Math.sin(t * 0.2 + i * 2) * 20;
    const wy = bodyTop + 10 + Math.cos(t * 0.15 + i) * 15;
    ctx.fillStyle = `rgba(129,140,248,${0.15 + Math.sin(t * 0.4 + i) * 0.1})`;
    ctx.beginPath();
    ctx.arc(wx, wy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWatcher(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t } = p;
  const bodyTop = baseY - 70 - 36;
  // Surveillance scan line
  const scanY = bodyTop - 20 + (t * 2) % 80;
  ctx.strokeStyle = "rgba(20,184,166,0.15)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 25, scanY);
  ctx.lineTo(cx + 25, scanY);
  ctx.stroke();
  // Multiple eye indicators
  for (let i = 0; i < 3; i++) {
    const eyeX = cx - 8 + i * 8;
    const eyeY = bodyTop - 8;
    ctx.fillStyle = `rgba(20,184,166,${0.3 + Math.sin(t * 0.5 + i) * 0.15})`;
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 2, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Data stream
  ctx.fillStyle = "rgba(45,212,191,0.1)";
  for (let i = 0; i < 5; i++) {
    const dx = cx - 15 + i * 8;
    const dy = bodyTop + ((t + i * 7) % 50);
    ctx.fillRect(dx, dy, 1, 3);
  }
}

function drawGameMaster(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t } = p;
  const bodyTop = baseY - 70 - 38;
  // Floating game pieces
  const pieces = ["♟", "♜", "♞"];
  ctx.font = "10px serif";
  for (let i = 0; i < 3; i++) {
    const px = cx - 15 + i * 15 + Math.sin(t * 0.15 + i) * 5;
    const py = bodyTop - 5 + Math.cos(t * 0.2 + i * 2) * 8;
    ctx.fillStyle = `rgba(249,115,22,${0.4 + Math.sin(t * 0.3 + i) * 0.2})`;
    ctx.fillText(pieces[i], px - 4, py);
  }
  // Crown glow
  ctx.fillStyle = `rgba(251,146,60,${0.1 + Math.sin(t * 0.4) * 0.05})`;
  ctx.beginPath();
  ctx.arc(cx, bodyTop - 14, 8, 0, Math.PI * 2);
  ctx.fill();
}

function drawAuthority(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t } = p;
  const bodyTop = baseY - 70 - 40;
  // Golden aura
  ctx.fillStyle = `rgba(234,179,8,${0.08 + Math.sin(t * 0.3) * 0.04})`;
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 50, 30, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  // Crown jewel pulse
  ctx.fillStyle = "#fde047";
  ctx.shadowColor = "#fde047";
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(cx, bodyTop - 18, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  // Authority chains
  ctx.strokeStyle = "#fbbf2430";
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 3]);
  ctx.beginPath();
  ctx.moveTo(cx - 20, bodyTop + 15);
  ctx.lineTo(cx + 20, bodyTop + 15);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawSource(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t } = p;
  const bodyTop = baseY - 70 - 40;
  // Horns energy
  ctx.fillStyle = `rgba(220,38,38,${0.3 + Math.sin(t * 0.5) * 0.15})`;
  ctx.beginPath();
  ctx.arc(cx - 14, bodyTop - 18, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 14, bodyTop - 18, 3, 0, Math.PI * 2);
  ctx.fill();
  // Raw power lines
  ctx.strokeStyle = "rgba(252,165,165,0.2)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(cx, bodyTop + 10 + i * 10);
    ctx.lineTo(cx + 15 + Math.sin(t * 0.5 + i) * 5, bodyTop + 15 + i * 10);
    ctx.stroke();
  }
}

function drawJailer(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t } = p;
  const bodyTop = baseY - 70 - 42;
  // Heavy chains
  ctx.strokeStyle = "#a8a29e50";
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(cx - 20, bodyTop + 20);
  ctx.quadraticCurveTo(cx, bodyTop + 30, cx + 20, bodyTop + 20);
  ctx.stroke();
  ctx.setLineDash([]);
  // Lock symbol on chest
  ctx.strokeStyle = "#78716c60";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, bodyTop + 18, 4, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = "#78716c40";
  ctx.fillRect(cx - 4, bodyTop + 18, 8, 6);
}

function drawHost(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t } = p;
  const bodyTop = baseY - 70 - 36;
  // Dual energy (split personality)
  ctx.fillStyle = `rgba(124,58,237,${0.1 + Math.sin(t * 0.4) * 0.05})`;
  ctx.beginPath();
  ctx.ellipse(cx - 8, baseY - 50, 15, 35, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(59,130,246,${0.1 + Math.cos(t * 0.4) * 0.05})`;
  ctx.beginPath();
  ctx.ellipse(cx + 8, baseY - 50, 15, 35, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Split line
  ctx.strokeStyle = "rgba(167,139,250,0.2)";
  ctx.lineWidth = 0.5;
  ctx.setLineDash([2, 4]);
  ctx.beginPath();
  ctx.moveTo(cx, bodyTop - 15);
  ctx.lineTo(cx, baseY);
  ctx.stroke();
  ctx.setLineDash([]);
}

// Ne-Yons share a common celestial aesthetic with individual variations
function drawNeYon(ctx: Ctx, p: DetailParams, color: string, symbol: string) {
  const { cx, baseY, t } = p;
  const bodyTop = baseY - 70 - 34;
  // Celestial halo ring
  ctx.strokeStyle = `${color}30`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(cx, bodyTop - 18, 14, 4, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Symbol above head
  ctx.font = "10px monospace";
  ctx.fillStyle = `${color}50`;
  ctx.fillText(symbol, cx - 4, bodyTop - 22);
  // Starfield particles
  for (let i = 0; i < 3; i++) {
    const sx = cx - 18 + ((t * 1.5 + i * 20) % 36);
    const sy = bodyTop + ((t + i * 15) % 50);
    ctx.fillStyle = `${color}${Math.floor(20 + Math.sin(t * 0.3 + i) * 10).toString(16).padStart(2, "0")}`;
    ctx.beginPath();
    ctx.arc(sx, sy, 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWolf(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t } = p;
  const bodyTop = baseY - 70 - 40;
  // Wolf ears
  ctx.fillStyle = "#57534e80";
  ctx.beginPath();
  ctx.moveTo(cx - 10, bodyTop - 10);
  ctx.lineTo(cx - 14, bodyTop - 22);
  ctx.lineTo(cx - 5, bodyTop - 12);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 10, bodyTop - 10);
  ctx.lineTo(cx + 14, bodyTop - 22);
  ctx.lineTo(cx + 5, bodyTop - 12);
  ctx.closePath();
  ctx.fill();
  // Yellow eyes glow
  ctx.fillStyle = "#fbbf24";
  ctx.shadowColor = "#fbbf24";
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.arc(cx - 4, bodyTop - 8, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 4, bodyTop - 8, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  // Claw marks on ground
  ctx.strokeStyle = "rgba(120,113,108,0.2)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(cx - 8 + i * 5, baseY);
    ctx.lineTo(cx - 10 + i * 5, baseY + 4);
    ctx.stroke();
  }
}

function drawWraithCalder(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t } = p;
  const bodyTop = baseY - 70 - 32;
  // Ghost transparency effect
  ctx.fillStyle = `rgba(167,139,250,${0.05 + Math.sin(t * 0.3) * 0.03})`;
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 45, 18, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  // Spectral trail
  for (let i = 0; i < 4; i++) {
    const trailX = cx - i * 5;
    const trailAlpha = 0.1 - i * 0.025;
    ctx.fillStyle = `rgba(196,181,253,${trailAlpha})`;
    ctx.beginPath();
    ctx.ellipse(trailX, baseY - 45, 10 - i * 2, 30 - i * 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Phasing effect
  if (p.state === "walk") {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "#c4b5fd10";
    ctx.beginPath();
    ctx.ellipse(cx + 10, baseY - 45, 14, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function drawEngineer(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t } = p;
  const bodyTop = baseY - 70 - 36;
  // Holographic display
  ctx.strokeStyle = "rgba(6,182,212,0.2)";
  ctx.lineWidth = 0.5;
  ctx.fillStyle = "rgba(6,182,212,0.05)";
  ctx.beginPath();
  ctx.rect(cx + 15, bodyTop + 5, 16, 12);
  ctx.fill();
  ctx.stroke();
  // Display data lines
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = `rgba(103,232,249,${0.3 + Math.sin(t * 0.5 + i) * 0.15})`;
    ctx.fillRect(cx + 17, bodyTop + 8 + i * 3, 8 + Math.sin(t * 0.3 + i) * 4, 1);
  }
  // Tool belt
  ctx.fillStyle = "#08334440";
  ctx.fillRect(cx - 14, baseY - 40, 28, 3);
  // Wrench icon
  ctx.strokeStyle = "#67e8f940";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 8, baseY - 39);
  ctx.lineTo(cx - 5, baseY - 36);
  ctx.stroke();
}

function drawEyes(ctx: Ctx, p: DetailParams) {
  const { cx, baseY, t } = p;
  const bodyTop = baseY - 70 - 32;
  // Multiple surveillance eyes
  for (let i = 0; i < 5; i++) {
    const ex = cx - 16 + i * 8 + Math.sin(t * 0.2 + i) * 2;
    const ey = bodyTop - 5 + Math.cos(t * 0.15 + i * 1.5) * 3;
    ctx.fillStyle = `rgba(34,211,238,${0.2 + Math.sin(t * 0.4 + i) * 0.1})`;
    ctx.beginPath();
    ctx.ellipse(ex, ey, 2, 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Scan beam
  ctx.strokeStyle = "rgba(34,211,238,0.1)";
  ctx.lineWidth = 0.5;
  const beamAngle = Math.sin(t * 0.1) * 0.5;
  ctx.beginPath();
  ctx.moveTo(cx, bodyTop - 5);
  ctx.lineTo(cx + Math.sin(beamAngle) * 40, baseY + 5);
  ctx.stroke();
}

/* ═══════════════════════════════════════════════════════
   MASTER DISPATCH — Routes character ID to detail fn
   ═══════════════════════════════════════════════════════ */
const CHARACTER_DETAIL_MAP: Record<string, (ctx: Ctx, p: DetailParams) => void> = {
  "architect": drawArchitect,
  "collector": drawCollector,
  "enigma": drawEnigma,
  "warlord": drawWarlord,
  "necromancer": drawNecromancer,
  "meme": drawMeme,
  "oracle": drawOracle,
  "iron-lion": drawIronLion,
  "agent-zero": drawAgentZero,
  "akai-shi": drawAkaiShi,
  "shadow-tongue": drawShadowTongue,
  "watcher": drawWatcher,
  "game-master": drawGameMaster,
  "authority": drawAuthority,
  "source": drawSource,
  "jailer": drawJailer,
  "host": drawHost,
  "wolf": drawWolf,
  "wraith-calder": drawWraithCalder,
  "engineer": drawEngineer,
  "eyes": drawEyes,
  // Ne-Yons
  "dreamer": (ctx, p) => drawNeYon(ctx, p, "#818cf8", "☽"),
  "judge": (ctx, p) => drawNeYon(ctx, p, "#fbbf24", "⚖"),
  "inventor": (ctx, p) => drawNeYon(ctx, p, "#f472b6", "⚙"),
  "seer": (ctx, p) => drawNeYon(ctx, p, "#67e8f9", "◉"),
  "knowledge": (ctx, p) => drawNeYon(ctx, p, "#34d399", "∞"),
  "silence": (ctx, p) => drawNeYon(ctx, p, "#64748b", "∅"),
  "storm": (ctx, p) => drawNeYon(ctx, p, "#60a5fa", "⚡"),
  "degen": (ctx, p) => drawNeYon(ctx, p, "#fb923c", "☢"),
  "advocate": (ctx, p) => drawNeYon(ctx, p, "#fcd34d", "⚔"),
  "forgotten": (ctx, p) => drawNeYon(ctx, p, "#94a3b8", "?"),
  "resurrectionist": (ctx, p) => drawNeYon(ctx, p, "#4ade80", "✝"),
};

export function drawCharacterDetails(
  ctx: Ctx,
  characterId: string,
  cx: number,
  baseY: number,
  t: number,
  state: string
) {
  const drawFn = CHARACTER_DETAIL_MAP[characterId];
  if (drawFn) {
    ctx.save();
    drawFn(ctx, { cx, baseY, t, state });
    ctx.restore();
  }
}

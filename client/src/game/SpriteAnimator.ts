/* ═══════════════════════════════════════════════════════
   SPRITE ANIMATOR — Multi-Frame Sprite Animation System
   
   Ported from the SFII sprite sheet architecture.
   Each pose can have multiple animation frames that cycle
   based on the move's startup/active/recovery timing.
   
   For poses with only a single source image, the system
   synthesizes intermediate frames using canvas manipulation
   (shift, stretch, tint) to create visual phases:
   - Anticipation (wind-up)
   - Active (impact)
   - Recovery (return to neutral)
   
   When actual multi-frame sprite sheets are available,
   they override the synthesized frames entirely.
   ═══════════════════════════════════════════════════════ */

/** A single animation frame within a pose */
export interface SpriteFrame {
  image: HTMLImageElement | OffscreenCanvas;
  /** Duration in game frames (60fps) — 0 means use move timing */
  duration: number;
  /** Horizontal offset from base position */
  offsetX: number;
  /** Vertical offset from base position */
  offsetY: number;
  /** Scale multiplier X */
  scaleX: number;
  /** Scale multiplier Y */
  scaleY: number;
  /** Rotation in radians */
  rotation: number;
}

/** Animation data for a single pose (e.g., "lightPunch") */
export interface PoseAnimation {
  frames: SpriteFrame[];
  /** Whether to loop the animation (idle, walk) or play once (attacks) */
  loop: boolean;
  /** Total frame count for the full animation cycle */
  totalDuration: number;
}

/** Pose categories for determining animation behavior */
export type PoseCategory = 
  | "idle"      // Continuous loop (idle, walk)
  | "attack"    // Plays once, maps to startup/active/recovery
  | "reaction"  // Plays once (hit, block, knockdown)
  | "movement"  // Continuous loop (walk, dash)
  | "static";   // Single frame held (crouch, jump apex)

/** Map pose keys to their category */
const POSE_CATEGORIES: Record<string, PoseCategory> = {
  idle: "idle",
  walkForward: "movement",
  walkBack: "movement",
  dash: "movement",
  crouch: "static",
  jump: "static",
  
  lightPunch: "attack",
  mediumPunch: "attack",
  heavyPunch: "attack",
  lightKick: "attack",
  mediumKick: "attack",
  heavyKick: "attack",
  crouchPunch: "attack",
  crouchKick: "attack",
  sweep: "attack",
  jumpAttack: "attack",
  grab: "attack",
  special: "attack",
  taunt: "attack",
  attack: "attack",
  
  block: "reaction",
  hit: "reaction",
  ko: "reaction",
  knockdown: "reaction",
  dizzy: "reaction",
  victory: "idle",
};

/**
 * Get the category for a pose key.
 */
export function getPoseCategory(poseKey: string): PoseCategory {
  return POSE_CATEGORIES[poseKey] || "static";
}

/**
 * Given a source image and pose category, synthesize multi-frame animation.
 * This is the core of the "make one image look like multiple frames" system.
 * 
 * Returns a PoseAnimation with 3-6 synthesized frames depending on category.
 */
export function synthesizeFrames(
  sourceImage: HTMLImageElement,
  poseKey: string,
  category: PoseCategory,
): PoseAnimation | null {
  if (!sourceImage.complete || sourceImage.naturalWidth === 0) return null;

  const w = sourceImage.naturalWidth;
  const h = sourceImage.naturalHeight;

  switch (category) {
    case "idle":
      return synthesizeIdleFrames(sourceImage, w, h);
    case "movement":
      return synthesizeMovementFrames(sourceImage, w, h, poseKey);
    case "attack":
      return synthesizeAttackFrames(sourceImage, w, h, poseKey);
    case "reaction":
      return synthesizeReactionFrames(sourceImage, w, h, poseKey);
    case "static":
      return synthesizeStaticFrames(sourceImage, w, h);
  }
}

/**
 * Idle animation: subtle breathing cycle (4 frames, looping)
 * Frame 0: Neutral
 * Frame 1: Slight inhale (taller, narrower)
 * Frame 2: Peak inhale
 * Frame 3: Exhale (return)
 */
function synthesizeIdleFrames(
  src: HTMLImageElement, w: number, h: number,
): PoseAnimation {
  const frames: SpriteFrame[] = [
    { image: src, duration: 10, offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1, rotation: 0 },
    { image: src, duration: 10, offsetX: 0, offsetY: -2, scaleX: 0.99, scaleY: 1.015, rotation: 0 },
    { image: src, duration: 10, offsetX: 0, offsetY: -3, scaleX: 0.985, scaleY: 1.02, rotation: 0 },
    { image: src, duration: 10, offsetX: 0, offsetY: -1, scaleX: 0.995, scaleY: 1.008, rotation: 0 },
  ];
  return { frames, loop: true, totalDuration: 40 };
}

/**
 * Movement animation: walk/dash bob cycle (4 frames, looping)
 */
function synthesizeMovementFrames(
  src: HTMLImageElement, w: number, h: number, poseKey: string,
): PoseAnimation {
  const isDash = poseKey === "dash";
  if (isDash) {
    // Dash: lean forward, stretch
    const frames: SpriteFrame[] = [
      { image: src, duration: 3, offsetX: 0, offsetY: 0, scaleX: 1.08, scaleY: 0.96, rotation: 0.04 },
      { image: src, duration: 3, offsetX: 4, offsetY: -2, scaleX: 1.12, scaleY: 0.94, rotation: 0.06 },
      { image: src, duration: 3, offsetX: 6, offsetY: -1, scaleX: 1.1, scaleY: 0.95, rotation: 0.05 },
      { image: src, duration: 3, offsetX: 2, offsetY: 0, scaleX: 1.04, scaleY: 0.98, rotation: 0.02 },
    ];
    return { frames, loop: false, totalDuration: 12 };
  }

  // Walk: alternating bob with slight lean
  const isBack = poseKey === "walkBack";
  const leanDir = isBack ? -1 : 1;
  const frames: SpriteFrame[] = [
    { image: src, duration: 8, offsetX: 0, offsetY: 0, scaleX: 1.02, scaleY: 0.99, rotation: 0.02 * leanDir },
    { image: src, duration: 8, offsetX: 0, offsetY: -4, scaleX: 0.99, scaleY: 1.02, rotation: 0 },
    { image: src, duration: 8, offsetX: 0, offsetY: 0, scaleX: 1.02, scaleY: 0.99, rotation: -0.02 * leanDir },
    { image: src, duration: 8, offsetX: 0, offsetY: -4, scaleX: 0.99, scaleY: 1.02, rotation: 0 },
  ];
  return { frames, loop: true, totalDuration: 32 };
}

/**
 * Attack animation: startup → active → recovery (3-4 frames, plays once)
 * This maps directly to the move's frame data timing.
 */
function synthesizeAttackFrames(
  src: HTMLImageElement, w: number, h: number, poseKey: string,
): PoseAnimation {
  const isKick = poseKey.toLowerCase().includes("kick") || poseKey === "sweep";
  const isHeavy = poseKey.toLowerCase().includes("heavy") || poseKey === "sweep";
  const isSpecial = poseKey === "special";
  const isCrouch = poseKey.toLowerCase().includes("crouch");
  const isJump = poseKey === "jumpAttack";
  const isGrab = poseKey === "grab";
  const isTaunt = poseKey === "taunt";

  if (isTaunt) {
    const frames: SpriteFrame[] = [
      { image: src, duration: 15, offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1, rotation: 0 },
      { image: src, duration: 15, offsetX: 0, offsetY: -5, scaleX: 1.04, scaleY: 1.04, rotation: 0 },
      { image: src, duration: 15, offsetX: 0, offsetY: -3, scaleX: 1.02, scaleY: 1.02, rotation: 0 },
      { image: src, duration: 15, offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1, rotation: 0 },
    ];
    return { frames, loop: false, totalDuration: 60 };
  }

  if (isGrab) {
    const frames: SpriteFrame[] = [
      { image: src, duration: 5, offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1, rotation: 0 },
      { image: src, duration: 5, offsetX: 8, offsetY: -3, scaleX: 1.1, scaleY: 0.95, rotation: 0.05 },
      { image: src, duration: 8, offsetX: 12, offsetY: -5, scaleX: 1.15, scaleY: 0.92, rotation: 0.08 },
      { image: src, duration: 5, offsetX: 4, offsetY: 0, scaleX: 1.02, scaleY: 0.99, rotation: 0.02 },
    ];
    return { frames, loop: false, totalDuration: 23 };
  }

  if (isSpecial) {
    // Special: dramatic wind-up, explosive active, long recovery
    const frames: SpriteFrame[] = [
      // Wind-up: compress
      { image: src, duration: 0, offsetX: 0, offsetY: 3, scaleX: 0.95, scaleY: 1.06, rotation: -0.03 },
      // Active: explosive extension
      { image: src, duration: 0, offsetX: 6, offsetY: -5, scaleX: 1.15, scaleY: 0.92, rotation: 0.08 },
      // Peak
      { image: src, duration: 0, offsetX: 8, offsetY: -8, scaleX: 1.18, scaleY: 0.9, rotation: 0.1 },
      // Recovery: snap back
      { image: src, duration: 0, offsetX: 2, offsetY: 0, scaleX: 1.02, scaleY: 0.99, rotation: 0.01 },
    ];
    return { frames, loop: false, totalDuration: 0 }; // Duration set by move data
  }

  if (isJump) {
    const frames: SpriteFrame[] = [
      { image: src, duration: 0, offsetX: 0, offsetY: 0, scaleX: 0.98, scaleY: 1.04, rotation: -0.05 },
      { image: src, duration: 0, offsetX: 5, offsetY: -3, scaleX: 1.12, scaleY: 0.94, rotation: 0.1 },
      { image: src, duration: 0, offsetX: 3, offsetY: -1, scaleX: 1.06, scaleY: 0.97, rotation: 0.05 },
    ];
    return { frames, loop: false, totalDuration: 0 };
  }

  if (isCrouch) {
    // Crouch attacks: compressed body, horizontal extension
    const frames: SpriteFrame[] = [
      { image: src, duration: 0, offsetX: 0, offsetY: 2, scaleX: 1, scaleY: 0.92, rotation: 0 },
      { image: src, duration: 0, offsetX: 6, offsetY: 0, scaleX: 1.12, scaleY: 0.88, rotation: 0.04 },
      { image: src, duration: 0, offsetX: 2, offsetY: 1, scaleX: 1.03, scaleY: 0.91, rotation: 0.01 },
    ];
    return { frames, loop: false, totalDuration: 0 };
  }

  // Standard punch/kick
  const stretchX = isHeavy ? 0.18 : isKick ? 0.14 : 0.12;
  const compressY = isHeavy ? 0.06 : isKick ? 0.05 : 0.04;
  const rotAmount = isKick ? 0.08 : 0.05;
  const offsetAmount = isHeavy ? 8 : isKick ? 6 : 4;

  const frames: SpriteFrame[] = [
    // Startup: wind-up (slight compression)
    {
      image: src, duration: 0,
      offsetX: -2, offsetY: 2,
      scaleX: 1 - stretchX * 0.3, scaleY: 1 + compressY * 0.5,
      rotation: -rotAmount * 0.3,
    },
    // Active: full extension
    {
      image: src, duration: 0,
      offsetX: offsetAmount, offsetY: -3,
      scaleX: 1 + stretchX, scaleY: 1 - compressY,
      rotation: rotAmount,
    },
    // Active peak (held slightly longer for impact feel)
    {
      image: src, duration: 0,
      offsetX: offsetAmount * 0.8, offsetY: -2,
      scaleX: 1 + stretchX * 0.9, scaleY: 1 - compressY * 0.8,
      rotation: rotAmount * 0.8,
    },
    // Recovery: snap back
    {
      image: src, duration: 0,
      offsetX: 1, offsetY: 0,
      scaleX: 1.01, scaleY: 0.995,
      rotation: 0.005,
    },
  ];

  return { frames, loop: false, totalDuration: 0 }; // Duration determined by move data
}

/**
 * Reaction animation: hit/block/KO (3 frames, plays once)
 */
function synthesizeReactionFrames(
  src: HTMLImageElement, w: number, h: number, poseKey: string,
): PoseAnimation {
  if (poseKey === "ko") {
    const frames: SpriteFrame[] = [
      { image: src, duration: 8, offsetX: 0, offsetY: 0, scaleX: 0.95, scaleY: 1.04, rotation: -0.05 },
      { image: src, duration: 10, offsetX: -5, offsetY: 10, scaleX: 1.05, scaleY: 0.85, rotation: -0.2 },
      { image: src, duration: 0, offsetX: -8, offsetY: 30, scaleX: 1.1, scaleY: 0.7, rotation: -Math.PI / 4 },
    ];
    return { frames, loop: false, totalDuration: 0 };
  }

  if (poseKey === "knockdown") {
    const frames: SpriteFrame[] = [
      { image: src, duration: 5, offsetX: 0, offsetY: 0, scaleX: 0.96, scaleY: 1.03, rotation: -0.08 },
      { image: src, duration: 8, offsetX: -4, offsetY: 15, scaleX: 1.06, scaleY: 0.88, rotation: -0.3 },
      { image: src, duration: 12, offsetX: -6, offsetY: 25, scaleX: 1.1, scaleY: 0.75, rotation: -Math.PI / 3 },
      { image: src, duration: 0, offsetX: -5, offsetY: 28, scaleX: 1.08, scaleY: 0.78, rotation: -Math.PI / 3 },
    ];
    return { frames, loop: false, totalDuration: 0 };
  }

  if (poseKey === "dizzy") {
    const frames: SpriteFrame[] = [
      { image: src, duration: 12, offsetX: -3, offsetY: 2, scaleX: 1, scaleY: 0.98, rotation: -0.03 },
      { image: src, duration: 12, offsetX: 3, offsetY: 0, scaleX: 1, scaleY: 1, rotation: 0.03 },
      { image: src, duration: 12, offsetX: -2, offsetY: 1, scaleX: 1, scaleY: 0.99, rotation: -0.02 },
      { image: src, duration: 12, offsetX: 2, offsetY: -1, scaleX: 1, scaleY: 1.01, rotation: 0.02 },
    ];
    return { frames, loop: true, totalDuration: 48 };
  }

  // hit, block: impact then settle
  const frames: SpriteFrame[] = [
    { image: src, duration: 4, offsetX: -4, offsetY: 2, scaleX: 0.94, scaleY: 1.05, rotation: -0.06 },
    { image: src, duration: 6, offsetX: -2, offsetY: 1, scaleX: 0.97, scaleY: 1.02, rotation: -0.03 },
    { image: src, duration: 0, offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1, rotation: 0 },
  ];
  return { frames, loop: false, totalDuration: 0 };
}

/**
 * Static pose: single frame held with very subtle micro-movement
 */
function synthesizeStaticFrames(
  src: HTMLImageElement, w: number, h: number,
): PoseAnimation {
  const frames: SpriteFrame[] = [
    { image: src, duration: 20, offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1, rotation: 0 },
    { image: src, duration: 20, offsetX: 0, offsetY: -1, scaleX: 1, scaleY: 1.005, rotation: 0 },
  ];
  return { frames, loop: true, totalDuration: 40 };
}

/**
 * Resolve which frame to display given the current animation state.
 * 
 * For attack poses, maps frames to startup/active/recovery phases.
 * For looping poses, cycles through frames based on total elapsed time.
 */
export function resolveFrame(
  anim: PoseAnimation,
  stateFrame: number,
  moveData?: { startup: number; active: number; recovery: number } | null,
): SpriteFrame {
  if (!anim || anim.frames.length === 0) {
    // Fallback: return a neutral frame
    return {
      image: new Image(),
      duration: 1,
      offsetX: 0, offsetY: 0,
      scaleX: 1, scaleY: 1,
      rotation: 0,
    };
  }

  const frameCount = anim.frames.length;

  // For attack animations with move data, map frames to phases
  if (moveData && !anim.loop && frameCount >= 3) {
    const { startup, active, recovery } = moveData;
    const total = startup + active + recovery;

    if (frameCount === 3) {
      // 3 frames: startup, active, recovery
      if (stateFrame < startup) return anim.frames[0];
      if (stateFrame < startup + active) return anim.frames[1];
      return anim.frames[2];
    }

    if (frameCount === 4) {
      // 4 frames: startup, active-start, active-peak, recovery
      if (stateFrame < startup) return anim.frames[0];
      if (stateFrame < startup + Math.floor(active / 2)) return anim.frames[1];
      if (stateFrame < startup + active) return anim.frames[2];
      return anim.frames[3];
    }

    // Generic: distribute frames across phases
    const phase = stateFrame < startup ? 0 :
                  stateFrame < startup + active ? 1 : 2;
    const phaseFrames = phase === 0 ? 1 : phase === 1 ? Math.max(1, frameCount - 2) : 1;
    const startIdx = phase === 0 ? 0 : phase === 1 ? 1 : frameCount - 1;
    
    if (phase === 1 && phaseFrames > 1) {
      const phaseProgress = (stateFrame - startup) / Math.max(1, active);
      const idx = startIdx + Math.floor(phaseProgress * phaseFrames);
      return anim.frames[Math.min(idx, frameCount - 2)];
    }
    return anim.frames[startIdx];
  }

  // For looping animations, cycle through frames
  if (anim.loop) {
    let elapsed = stateFrame % anim.totalDuration;
    let accumulated = 0;
    for (let i = 0; i < frameCount; i++) {
      accumulated += anim.frames[i].duration;
      if (elapsed < accumulated) return anim.frames[i];
    }
    return anim.frames[frameCount - 1];
  }

  // For non-looping, non-attack: play through and hold last frame
  let accumulated = 0;
  for (let i = 0; i < frameCount; i++) {
    if (anim.frames[i].duration === 0) {
      // Duration 0 means "hold until end"
      return anim.frames[i];
    }
    accumulated += anim.frames[i].duration;
    if (stateFrame < accumulated) return anim.frames[i];
  }
  return anim.frames[frameCount - 1];
}

/**
 * Cache for synthesized animations.
 * Key: `${characterId}_${poseKey}`
 */
const animationCache = new Map<string, PoseAnimation>();

/**
 * Get or create a synthesized animation for a character pose.
 */
export function getOrSynthesizeAnimation(
  characterId: string,
  poseKey: string,
  sourceImage: HTMLImageElement | null,
): PoseAnimation | null {
  if (!sourceImage || !sourceImage.complete || sourceImage.naturalWidth === 0) return null;

  const cacheKey = `${characterId}_${poseKey}`;
  const cached = animationCache.get(cacheKey);
  if (cached) return cached;

  const category = getPoseCategory(poseKey);
  const anim = synthesizeFrames(sourceImage, poseKey, category);
  if (anim) {
    animationCache.set(cacheKey, anim);
  }
  return anim;
}

/**
 * Clear the animation cache (call when characters change).
 */
export function clearAnimationCache() {
  animationCache.clear();
}

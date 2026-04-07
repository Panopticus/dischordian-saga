/* ═══════════════════════════════════════════════════════
   COMBAT JUICE — Visual feedback animations for combat
   Screen shakes, combo flashes, loot celebrations,
   achievement fanfares, hit impacts, and KO slowdowns.
   All effects respect prefers-reduced-motion.
   ═══════════════════════════════════════════════════════ */

// ── Motion Preference ────────────────────────────────────────────────

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

// ── Injected Style Sheet ─────────────────────────────────────────────
// We inject a shared <style> element once for all combat juice animations.

let styleInjected = false;

function injectCombatJuiceStyles(): void {
  if (styleInjected || typeof document === "undefined") return;
  styleInjected = true;

  const style = document.createElement("style");
  style.id = "combat-juice-styles";
  style.textContent = `
    /* ── Screen Shake ── */
    @keyframes cj-shake-light {
      0%, 100% { transform: translate(0, 0); }
      25% { transform: translate(-2px, 1px); }
      50% { transform: translate(2px, -1px); }
      75% { transform: translate(-1px, 2px); }
    }
    @keyframes cj-shake-medium {
      0%, 100% { transform: translate(0, 0); }
      20% { transform: translate(-5px, 3px); }
      40% { transform: translate(4px, -5px); }
      60% { transform: translate(-3px, 4px); }
      80% { transform: translate(5px, -2px); }
    }
    @keyframes cj-shake-heavy {
      0%, 100% { transform: translate(0, 0); }
      10% { transform: translate(-10px, 5px); }
      20% { transform: translate(8px, -10px); }
      30% { transform: translate(-6px, 8px); }
      40% { transform: translate(10px, -4px); }
      50% { transform: translate(-8px, 10px); }
      60% { transform: translate(6px, -6px); }
      70% { transform: translate(-4px, 8px); }
      80% { transform: translate(10px, -8px); }
      90% { transform: translate(-6px, 4px); }
    }
    @keyframes cj-shake-ko {
      0%, 100% { transform: translate(0, 0); }
      5% { transform: translate(-15px, 8px); }
      10% { transform: translate(12px, -15px); }
      15% { transform: translate(-10px, 12px); }
      20% { transform: translate(15px, -6px); }
      30% { transform: translate(-12px, 14px); }
      40% { transform: translate(10px, -10px); }
      50% { transform: translate(-8px, 10px); }
      60% { transform: translate(6px, -8px); }
      70% { transform: translate(-4px, 6px); }
      80% { transform: translate(3px, -4px); }
      90% { transform: translate(-2px, 2px); }
    }

    /* ── Hit Flash ── */
    @keyframes cj-hit-flash {
      0% { opacity: 0.6; }
      100% { opacity: 0; }
    }
    .cj-hit-flash-overlay {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 99999;
      animation: cj-hit-flash 150ms ease-out forwards;
    }

    /* ── Achievement Ring ── */
    @keyframes cj-ring-expand {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
    }
    @keyframes cj-fanfare-flash {
      0% { opacity: 0.3; }
      100% { opacity: 0; }
    }
    .cj-fanfare-ring {
      position: fixed;
      top: 50%;
      left: 50%;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      border: 3px solid currentColor;
      pointer-events: none;
      z-index: 99998;
      animation: cj-ring-expand 600ms ease-out forwards;
    }
    .cj-fanfare-flash {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 99997;
      animation: cj-fanfare-flash 400ms ease-out forwards;
    }

    /* ── Loot Particles ── */
    @keyframes cj-particle-burst {
      0% { transform: translate(0, 0) scale(1); opacity: 1; }
      100% { transform: translate(var(--cj-dx), var(--cj-dy)) scale(0); opacity: 0; }
    }
    .cj-particle {
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 99996;
      animation: cj-particle-burst var(--cj-duration) ease-out forwards;
    }

    /* ── KO Slowdown ── */
    .cj-slowmo {
      transition: all 800ms cubic-bezier(0.25, 0.1, 0.25, 1) !important;
    }
    .cj-slowmo * {
      transition-duration: 800ms !important;
    }
  `;
  document.head.appendChild(style);
}

// ── Screen Shake ─────────────────────────────────────────────────────

const SHAKE_CONFIG = {
  light:  { animation: "cj-shake-light",  duration: 50  },
  medium: { animation: "cj-shake-medium", duration: 80  },
  heavy:  { animation: "cj-shake-heavy",  duration: 120 },
  ko:     { animation: "cj-shake-ko",     duration: 200 },
} as const;

/**
 * Apply a screen shake effect to document.body.
 * Intensity levels:
 *   light:  2px displacement, 50ms
 *   medium: 5px displacement, 80ms
 *   heavy:  10px displacement, 120ms
 *   ko:     15px displacement, 200ms with decay
 */
export function screenShake(intensity: "light" | "medium" | "heavy" | "ko"): void {
  if (prefersReducedMotion() || typeof document === "undefined") return;
  injectCombatJuiceStyles();

  const config = SHAKE_CONFIG[intensity];
  const body = document.body;

  // Remove any existing shake animation
  body.style.animation = "none";
  // Force reflow to restart animation
  void body.offsetHeight;

  body.style.animation = `${config.animation} ${config.duration}ms ease-out`;

  const cleanup = () => {
    body.style.animation = "";
    body.removeEventListener("animationend", cleanup);
  };
  body.addEventListener("animationend", cleanup);

  // Safety cleanup in case animationend doesn't fire
  setTimeout(cleanup, config.duration + 50);
}

// ── Combo Flash ──────────────────────────────────────────────────────

export interface ComboFlashResult {
  scale: number;
  color: string;
  shake: boolean;
}

/**
 * Calculate combo feedback properties based on combo count.
 *   1-2:  normal    — 1.0x scale, white,  no shake
 *   3-5:  good      — 1.1x scale, yellow, no shake
 *   6-9:  great     — 1.2x scale, orange, light shake
 *   10+:  legendary — 1.4x scale, red,    heavy shake
 */
export function comboFlash(comboCount: number): ComboFlashResult {
  if (comboCount >= 10) {
    if (!prefersReducedMotion()) screenShake("heavy");
    return { scale: 1.4, color: "#ef4444", shake: true };
  }
  if (comboCount >= 6) {
    if (!prefersReducedMotion()) screenShake("light");
    return { scale: 1.2, color: "#f97316", shake: true };
  }
  if (comboCount >= 3) {
    return { scale: 1.1, color: "#eab308", shake: false };
  }
  return { scale: 1.0, color: "#ffffff", shake: false };
}

// ── Loot Celebration ─────────────────────────────────────────────────

const LOOT_CONFIG: Record<string, { count: number; color: string; spread: number; duration: number }> = {
  common:    { count: 6,  color: "#a3a3a3", spread: 60,  duration: 400 },
  rare:      { count: 12, color: "#3b82f6", spread: 80,  duration: 500 },
  epic:      { count: 20, color: "#a855f7", spread: 100, duration: 600 },
  legendary: { count: 30, color: "#eab308", spread: 130, duration: 700 },
  mythic:    { count: 40, color: "rainbow", spread: 160, duration: 800 },
};

const RAINBOW_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];

/**
 * Create a particle burst celebration around a target element.
 * Rarity levels:
 *   common:    few grey sparks
 *   rare:      blue sparkles
 *   epic:      purple burst
 *   legendary: gold explosion
 *   mythic:    rainbow cascade
 */
export function lootCelebration(rarity: string, targetElement: HTMLElement): void {
  if (prefersReducedMotion() || typeof document === "undefined") return;
  injectCombatJuiceStyles();

  const config = LOOT_CONFIG[rarity] || LOOT_CONFIG.common;
  const rect = targetElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Create a container for particles
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.pointerEvents = "none";
  container.style.zIndex = "99996";
  document.body.appendChild(container);

  for (let i = 0; i < config.count; i++) {
    const particle = document.createElement("div");
    particle.className = "cj-particle";

    // Random angle and distance
    const angle = (Math.PI * 2 * i) / config.count + (Math.random() - 0.5) * 0.5;
    const distance = config.spread * (0.5 + Math.random() * 0.5);
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    // Color
    const particleColor =
      config.color === "rainbow"
        ? RAINBOW_COLORS[i % RAINBOW_COLORS.length]
        : config.color;

    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    particle.style.backgroundColor = particleColor;
    particle.style.boxShadow = `0 0 4px ${particleColor}`;
    particle.style.setProperty("--cj-dx", `${dx}px`);
    particle.style.setProperty("--cj-dy", `${dy}px`);
    particle.style.setProperty("--cj-duration", `${config.duration + Math.random() * 200}ms`);

    // Vary particle size for higher rarities
    const size = rarity === "mythic" || rarity === "legendary" ? 4 + Math.random() * 6 : 3 + Math.random() * 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    container.appendChild(particle);
  }

  // Clean up after animation completes
  setTimeout(() => {
    container.remove();
  }, config.duration + 300);
}

// ── Achievement Fanfare ──────────────────────────────────────────────

const FANFARE_CONFIG: Record<string, { ringColor: string; flashColor: string; ringCount: number; flashOpacity: number }> = {
  bronze:    { ringColor: "#cd7f32", flashColor: "#cd7f32", ringCount: 1, flashOpacity: 0.1  },
  silver:    { ringColor: "#c0c0c0", flashColor: "#c0c0c0", ringCount: 1, flashOpacity: 0.12 },
  gold:      { ringColor: "#eab308", flashColor: "#eab308", ringCount: 2, flashOpacity: 0.2  },
  legendary: { ringColor: "#eab308", flashColor: "#fbbf24", ringCount: 3, flashOpacity: 0.3  },
};

/**
 * Trigger a full-screen achievement unlock fanfare.
 *   bronze:    subtle ring + faint flash
 *   silver:    clean ring + light flash
 *   gold:      dramatic double ring + bright flash
 *   legendary: screen-wide golden pulse with triple expanding rings
 */
export function achievementFanfare(tier: string): void {
  if (prefersReducedMotion() || typeof document === "undefined") return;
  injectCombatJuiceStyles();

  const config = FANFARE_CONFIG[tier] || FANFARE_CONFIG.bronze;

  // Background flash
  const flash = document.createElement("div");
  flash.className = "cj-fanfare-flash";
  flash.style.backgroundColor = config.flashColor;
  flash.style.opacity = String(config.flashOpacity);
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 500);

  // Expanding rings (staggered)
  for (let i = 0; i < config.ringCount; i++) {
    setTimeout(() => {
      const ring = document.createElement("div");
      ring.className = "cj-fanfare-ring";
      ring.style.color = config.ringColor;
      ring.style.borderWidth = `${3 - i}px`;
      document.body.appendChild(ring);
      setTimeout(() => ring.remove(), 700);
    }, i * 120);
  }

  // Add a subtle screen shake for gold/legendary
  if (tier === "gold") {
    screenShake("light");
  } else if (tier === "legendary") {
    screenShake("medium");
  }
}

// ── Hit Impact Flash ─────────────────────────────────────────────────

/**
 * Brief flash on the screen edges to indicate a hit.
 * Defaults to white; pass a color for elemental hits
 * (e.g., "#ef4444" for fire, "#3b82f6" for ice).
 */
export function hitFlash(color: string = "#ffffff"): void {
  if (prefersReducedMotion() || typeof document === "undefined") return;
  injectCombatJuiceStyles();

  const overlay = document.createElement("div");
  overlay.className = "cj-hit-flash-overlay";
  overlay.style.background = `radial-gradient(ellipse at center, transparent 40%, ${color}40 100%)`;
  document.body.appendChild(overlay);

  setTimeout(() => overlay.remove(), 200);
}

// ── KO Slowdown Effect ───────────────────────────────────────────────

/**
 * Briefly apply a CSS-based slowdown effect to simulate
 * a dramatic KO moment. Adds slow transitions to the
 * fight arena (or document body as fallback).
 *
 * @param durationMs How long the slowdown lasts (default 600ms)
 */
export function koSlowmo(durationMs: number = 600): void {
  if (prefersReducedMotion() || typeof document === "undefined") return;
  injectCombatJuiceStyles();

  // Try to target the fight arena specifically, fall back to body
  const target =
    document.querySelector<HTMLElement>("[data-fight-arena]") ||
    document.querySelector<HTMLElement>(".fight-arena") ||
    document.body;

  target.classList.add("cj-slowmo");

  // Also apply a slight desaturation for cinematic effect
  const prevFilter = target.style.filter;
  target.style.filter = "saturate(0.5) brightness(0.9)";

  setTimeout(() => {
    target.classList.remove("cj-slowmo");
    target.style.filter = prevFilter;
  }, durationMs);
}

// ── Convenience: Combined Combat Hit ─────────────────────────────────

/**
 * Fire a combined hit effect: screen shake + hit flash + optional haptic.
 * Useful as a single call for attack impacts.
 */
export function combatHit(
  intensity: "light" | "medium" | "heavy" | "ko",
  elementalColor?: string
): void {
  screenShake(intensity);
  hitFlash(elementalColor);
  if (intensity === "ko") {
    koSlowmo();
  }
}

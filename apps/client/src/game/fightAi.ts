/**
 * fightAi — AI difficulty profiles + helpers + behavior runner.
 *
 * audit/01.F4 of the FightEngine2D split.
 *
 * Step 3a (data layer): difficulty profiles + adaptAggression +
 * idealDistanceFor — the constants and pure helpers the AI loop
 * reads.
 *
 * Step 3b (behavior layer, this commit): the 211-line `processAI`
 * method that lived inline on FightEngine2D moves here as
 * `executeAIDecision(host, ai, player, profile)`. The function
 * still mutates fighter state directly (same imperative shape as
 * before — a pure-function rewrite would require a discriminated-
 * union AiDecision type and a separate apply step, which is a
 * larger behavioral refactor and would void replay determinism).
 * Instead, we route the few engine-side primitives the loop needs
 * (state-machine predicates + state mutators + special-move
 * activator + frame-cluster constants) through an
 * AIControllerHost facade the engine constructs once per match.
 *
 * Behaviorally identical to the inline processAI it replaces;
 * the only differences are import path and the host-method
 * indirection.
 */

/** Four difficulty tiers, easiest → hardest. */
export type Difficulty2D = "recruit" | "soldier" | "veteran" | "archon";

/** Tunable knobs for the AI decision loop. Each rate is a [0, 1]
 *  probability the loop checks against `Math.random()` per frame
 *  cluster; fewer-frames-per-cluster + more-checks = harder AI. */
export interface AIDifficultyProfile {
  /** How many frames AI waits before reacting */
  reactionFrames: number;
  /** 0-1, chance of continuing combo */
  comboAccuracy: number;
  /** 0-1, chance of blocking on reaction */
  blockRate: number;
  /** 0-1, chance of anti-airing jumps */
  antiAirRate: number;
  /** 0-1, chance of punishing whiffed attacks */
  whiffPunishRate: number;
  /** 0-1, how often AI uses specials */
  specialUseRate: number;
  /** 0-1, chance of random mistake */
  mistakeRate: number;
  /** 0-1, base aggression level */
  aggressionBase: number;
}

/** AI profile table. Difficulty curve is hand-tuned; tests in
 *  fightAi.test.ts (planned) lock in the per-knob monotonicity. */
export const AI_PROFILES: Record<Difficulty2D, AIDifficultyProfile> = {
  // Easy: approachable, lets player learn. Slow reactions, frequent mistakes,
  // rarely blocks or punishes. Feels like sparring a beginner.
  recruit: {
    reactionFrames: 35, comboAccuracy: 0.2, blockRate: 0.15, antiAirRate: 0.05,
    whiffPunishRate: 0.05, specialUseRate: 0.1, mistakeRate: 0.35, aggressionBase: 0.35,
  },
  // Normal: solid opponent, blocks sometimes, can chain 2-hit combos.
  // Reacts to jump-ins occasionally. Feels like a competent player.
  soldier: {
    reactionFrames: 20, comboAccuracy: 0.5, blockRate: 0.4, antiAirRate: 0.25,
    whiffPunishRate: 0.25, specialUseRate: 0.25, mistakeRate: 0.18, aggressionBase: 0.5,
  },
  // Hard: reads your patterns, blocks most attacks, punishes mistakes.
  // Chains full combos and uses specials strategically. Fair but demanding.
  veteran: {
    reactionFrames: 12, comboAccuracy: 0.7, blockRate: 0.6, antiAirRate: 0.5,
    whiffPunishRate: 0.5, specialUseRate: 0.45, mistakeRate: 0.08, aggressionBase: 0.6,
  },
  // Nightmare: near-frame-perfect reactions, optimal combos, ruthless punishes.
  // Still makes rare mistakes to keep it beatable.
  archon: {
    reactionFrames: 5, comboAccuracy: 0.9, blockRate: 0.8, antiAirRate: 0.75,
    whiffPunishRate: 0.75, specialUseRate: 0.65, mistakeRate: 0.04, aggressionBase: 0.7,
  },
};

/**
 * Adapt the profile's effective aggression based on the health
 * ratio between AI and player.
 *
 *   - Comeback mechanic: AI gets more aggressive (and reacts
 *     faster) when losing badly.
 *   - Mercy mode: AI eases off when dominating (more fun for
 *     the player).
 *   - Otherwise: profile baseline.
 *
 * Returns both the adjusted aggression value AND the adjusted
 * reactionFrames so the caller can apply both atomically. The
 * function is pure — moved out of processAI's body so it can be
 * unit-tested and reused by the upcoming AI-controller extraction.
 */
export function adaptAggression(
  profile: AIDifficultyProfile,
  aiHealthRatio: number,
  playerHealthRatio: number,
): { aggression: number; reactDelay: number } {
  if (aiHealthRatio < 0.3 && playerHealthRatio > 0.5) {
    return {
      aggression: Math.min(0.9, profile.aggressionBase + 0.3),
      reactDelay: Math.max(4, profile.reactionFrames - 8),
    };
  }
  if (aiHealthRatio > 0.7 && playerHealthRatio < 0.3) {
    return {
      aggression: Math.max(0.2, profile.aggressionBase - 0.15),
      reactDelay: profile.reactionFrames + 4,
    };
  }
  return {
    aggression: profile.aggressionBase,
    reactDelay: profile.reactionFrames,
  };
}

/**
 * Compute the ideal stand-off distance for a fighter archetype.
 * Pure helper; pulled out of processAI's body so the rest of the
 * stack (combo trainer, replay viewer, AI controller) can reuse the
 * same constants without duplicating the magic numbers.
 *
 * Archetype names match `FighterArchetype` from gameData.
 */
export function idealDistanceFor(archetype: string): number {
  switch (archetype) {
    case "zoner":     return 400;
    case "grappler":  return 80;
    case "rushdown":  return 100;
    default:          return 180;
  }
}

/* ═══════════════════════════════════════════════════════
   STEP 3B — BEHAVIOR LAYER
   ═══════════════════════════════════════════════════════ */

/**
 * Structural shape of a fighter the AI loop touches. Defined here
 * (rather than imported from FightEngine2D) so this module stays
 * acyclic with the engine — FightEngine2D imports from here, so
 * we cannot import from there. Fighter2D in FightEngine2D
 * structurally satisfies this shape.
 */
export interface AIFighter {
  data: {
    frameProfile: {
      archetype: string;
      walkSpeedMult: number;
      jumpForceMult: number;
    };
  };
  x: number;
  vx: number;
  vy: number;
  facingRight: boolean;
  hp: number;
  maxHp: number;
  state: string;
  airborne: boolean;
  isCrouching: boolean;
  comboCount: number;
  comboChain: number;
  specialMeter: number;
  isParrying: boolean;
  parryFrames: number;
  blockFrame: number;
  heavyChargeFrames: number;
  aiTimer: number;
  aiReactDelay: number;
  hitThisAttack: boolean;
  dashCooldownFrames: number;
}

/**
 * Engine-side primitives the AI loop calls into. The engine
 * constructs one host per match and passes it to
 * executeAIDecision on every AI tick.
 */
export interface AIControllerHost {
  isInAttackState(f: AIFighter): boolean;
  isInRecovery(f: AIFighter): boolean;
  isActionable(f: AIFighter): boolean;
  changeState(f: AIFighter, s: string): void;
  activateSpecial(ai: AIFighter, level: 1 | 2 | 3): void;
  /** Current global frame counter; the loop uses it to mark
   *  block-start frames for parry windows. */
  readonly frameCount: number;
  /** Frames the AI is parrying after entering a block stance. */
  readonly parryWindow: number;
  /** Per-archetype walk speed (px / frame). */
  walkSpeedFor(archetype: string): number;
  /** Per-archetype jump force (initial -vy magnitude). */
  jumpForceFor(archetype: string): number;
}

/**
 * Run one AI tick. Returns early via `aiTimer` gating until
 * `aiReactDelay` frames have elapsed, then chooses + executes
 * one of the loop's reactive or proactive branches.
 *
 * Behaviorally identical to the inline FightEngine2D.processAI
 * it replaces; only the engine primitives (state predicates +
 * mutators + special activator + arch tables) are routed via
 * `host` rather than `this`.
 */
export function executeAIDecision(
  host: AIControllerHost,
  ai: AIFighter,
  player: AIFighter,
  profile: AIDifficultyProfile,
): void {
  ai.aiTimer++;
  if (ai.aiTimer < ai.aiReactDelay) return;

  const dist = Math.abs(ai.x - player.x);

  // Comeback / mercy aggression adapt — same pure helper as
  // before, just called by name now.
  const aiHealthRatio = ai.hp / ai.maxHp;
  const playerHealthRatio = player.hp / player.maxHp;
  const adapted = adaptAggression(profile, aiHealthRatio, playerHealthRatio);
  const aggression = adapted.aggression;
  ai.aiReactDelay = adapted.reactDelay;

  // Mistake check
  if (Math.random() < profile.mistakeRate) {
    ai.aiTimer = 0;
    return;
  }

  // React to player attacks — block
  if (host.isInAttackState(player) && dist < 150) {
    if (Math.random() < profile.blockRate) {
      // Match block stance to attack type
      if (player.state.startsWith("crouch_") || player.state.includes("low")) {
        host.changeState(ai, "block_crouch");
      } else {
        host.changeState(ai, Math.random() < 0.3 ? "block_crouch" : "block_stand");
      }
      ai.blockFrame = host.frameCount;
      ai.isParrying = true;
      ai.parryFrames = host.parryWindow;
      ai.aiTimer = 0;
      return;
    }
  }

  // Anti-air — react to jumps
  if (player.airborne && dist < 200 && Math.random() < profile.antiAirRate) {
    // Vary anti-air option
    if (dist < 100 && Math.random() < 0.4) {
      host.changeState(ai, "crouch_heavy"); // Close anti-air
    } else {
      host.changeState(ai, "heavy_release"); // Standard anti-air
    }
    ai.hitThisAttack = false;
    ai.aiTimer = 0;
    return;
  }

  // Whiff punish — punish recovery with best available option
  if (host.isInRecovery(player) && dist < 120 && Math.random() < profile.whiffPunishRate) {
    if (dist < 60 && Math.random() < 0.3) {
      host.changeState(ai, "throw_startup"); // Close range throw punish
    } else if (ai.specialMeter >= 100 && Math.random() < 0.4) {
      host.activateSpecial(ai, 1); // Special punish for big damage
    } else {
      const useKick = Math.random() < 0.4;
      host.changeState(ai, useKick ? "medium_kick" : "medium");
    }
    ai.hitThisAttack = false;
    ai.aiTimer = 0;
    return;
  }

  // Combo continuation — chain attacks naturally
  if (ai.comboCount > 0 && Math.random() < profile.comboAccuracy) {
    if (ai.comboChain < 2) {
      const nextState = ai.comboChain === 0 ? "light_2" : "light_3";
      host.changeState(ai, nextState);
      ai.comboChain++;
      ai.hitThisAttack = false;
      ai.aiTimer = 0;
      return;
    } else if (ai.comboChain === 2) {
      // Finish combo with medium or special
      if (ai.specialMeter >= 100 && Math.random() < 0.5) {
        host.activateSpecial(ai, 1); // Cancel into special for flashy finish
      } else {
        host.changeState(ai, "medium");
      }
      ai.comboChain = 3;
      ai.hitThisAttack = false;
      ai.aiTimer = 0;
      return;
    }
  }

  // Special move usage
  if (ai.specialMeter >= 100 && Math.random() < profile.specialUseRate && dist < 250) {
    const level: 1 | 2 | 3 = ai.specialMeter >= 300 ? 3 : ai.specialMeter >= 200 ? 2 : 1;
    host.activateSpecial(ai, level);
    ai.aiTimer = 0;
    return;
  }

  // Approach or zone based on style
  if (!host.isActionable(ai)) return;

  const arch = ai.data.frameProfile.archetype;
  const idealDist = idealDistanceFor(arch);

  if (dist > idealDist + 50) {
    // Move closer
    const dir = ai.x < player.x ? 1 : -1;
    const walkSpeed = host.walkSpeedFor(arch) * ai.data.frameProfile.walkSpeedMult;
    if (dist > idealDist + 150 && Math.random() < aggression * 0.5 && ai.dashCooldownFrames <= 0) {
      host.changeState(ai, "dash_fwd");
      ai.vx = dir * walkSpeed * 2.5;
      ai.dashCooldownFrames = 30;
    } else if (dist > idealDist + 80 && Math.random() < 0.15) {
      // Jump-in approach (mix-up vs walking)
      host.changeState(ai, "jump_fwd");
      ai.vy = -(host.jumpForceFor(arch) * ai.data.frameProfile.jumpForceMult);
      ai.airborne = true;
    } else {
      ai.vx = dir * walkSpeed;
      host.changeState(ai, dir === (ai.facingRight ? 1 : -1) ? "walk_fwd" : "walk_back");
    }
  } else if (dist < idealDist - 30) {
    // Move away
    const dir = ai.x < player.x ? -1 : 1;
    const walkSpeed = host.walkSpeedFor(arch) * ai.data.frameProfile.walkSpeedMult;
    if (Math.random() < 0.25 && ai.dashCooldownFrames <= 0) {
      host.changeState(ai, "dash_back");
      ai.vx = dir * walkSpeed * 2.5;
      ai.dashCooldownFrames = 30;
    } else {
      ai.vx = dir * walkSpeed;
      host.changeState(ai, "walk_back");
    }
  } else {
    // In range — attack with varied options
    if (Math.random() < aggression) {
      const roll = Math.random();
      if (roll < 0.28) {
        // Punch combo starter
        host.changeState(ai, "light_1");
        ai.comboChain = 0;
      } else if (roll < 0.40) {
        // Light kick (fast poke)
        host.changeState(ai, "light_kick");
      } else if (roll < 0.50) {
        // Medium kick (mid-range)
        host.changeState(ai, "medium_kick");
      } else if (roll < 0.58) {
        // Heavy kick (high damage, committal)
        host.changeState(ai, "heavy_kick");
      } else if (roll < 0.66) {
        // Medium punch
        host.changeState(ai, "medium");
      } else if (roll < 0.74) {
        // Crouch attack mix-up (low)
        ai.isCrouching = true;
        host.changeState(ai, "crouch_light");
      } else if (roll < 0.80 && dist < 80) {
        // Throw attempt at close range
        host.changeState(ai, "throw_startup");
      } else if (roll < 0.88) {
        // Jump-in attack for pressure
        host.changeState(ai, "jump_fwd");
        ai.vy = -(host.jumpForceFor(arch) * ai.data.frameProfile.jumpForceMult);
        ai.airborne = true;
      } else if (roll < 0.94) {
        // Heavy punch for damage
        host.changeState(ai, "heavy_charge");
        ai.heavyChargeFrames = 0;
      } else {
        // Dash in for pressure then attack next frame
        if (ai.dashCooldownFrames <= 0) {
          const dir = ai.x < player.x ? 1 : -1;
          const walkSpeed = host.walkSpeedFor(arch) * ai.data.frameProfile.walkSpeedMult;
          host.changeState(ai, "dash_fwd");
          ai.vx = dir * walkSpeed * 2.5;
          ai.dashCooldownFrames = 30;
        }
      }
      ai.hitThisAttack = false;
    } else {
      // Idle — but reposition or feint
      const idleRoll = Math.random();
      if (idleRoll < 0.25) {
        // Walk forward (pressure)
        const dir = ai.x < player.x ? 1 : -1;
        const walkSpeed = host.walkSpeedFor(arch) * ai.data.frameProfile.walkSpeedMult;
        ai.vx = dir * walkSpeed * 0.5;
        host.changeState(ai, "walk_fwd");
      } else if (idleRoll < 0.40) {
        // Walk back (bait attacks)
        const dir = ai.x < player.x ? -1 : 1;
        const walkSpeed = host.walkSpeedFor(arch) * ai.data.frameProfile.walkSpeedMult;
        ai.vx = dir * walkSpeed * 0.4;
        host.changeState(ai, "walk_back");
      } else if (idleRoll < 0.50) {
        // Crouch (change posture)
        ai.isCrouching = true;
        host.changeState(ai, "crouch");
      } else {
        host.changeState(ai, "idle");
        ai.vx = 0;
      }
    }
  }

  ai.aiTimer = 0;
}

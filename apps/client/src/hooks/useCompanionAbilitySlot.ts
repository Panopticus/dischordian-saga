/* ═══════════════════════════════════════════════════════
   useCompanionAbilitySlot — bond-gated ability cooldowns

   Plan §B6. Pure state machine + React hook. Tracks per-
   ability cooldown timers so the card-battle UI can grey
   out abilities that are still cooling and re-enable them
   when the cooldown elapses.

   Engine wiring (apps/shared/tcg-core/engine/cardGame.ts
   reading the ability effect on activation) is a follow-up;
   this hook is the UI-side scaffolding. The pure helpers
   below are testable without React.
   ═══════════════════════════════════════════════════════ */

import { useCallback, useEffect, useState } from "react";
import {
  COMPANION_ABILITIES,
  type CompanionAbility,
} from "@shared/companionAbilities";

/** Per-ability cooldown deadline. The value is the wall-clock
 *  ms timestamp at which the cooldown expires; undefined =
 *  ready. */
export type CooldownMap = Readonly<Record<string, number | undefined>>;

/* ─── Pure helpers ─── */

/** True iff the named ability is ready (no cooldown, or its
 *  deadline has passed). */
export function isAbilityReady(
  abilityId: string,
  cooldowns: CooldownMap,
  now: number = Date.now(),
): boolean {
  const deadline = cooldowns[abilityId];
  if (deadline === undefined) return true;
  return now >= deadline;
}

/** Remaining cooldown in ms; 0 if ready. */
export function remainingCooldownMs(
  abilityId: string,
  cooldowns: CooldownMap,
  now: number = Date.now(),
): number {
  const deadline = cooldowns[abilityId];
  if (deadline === undefined) return 0;
  return Math.max(0, deadline - now);
}

/** Apply one activation: set the cooldown deadline for the
 *  ability. Pure — returns a new map. */
export function startCooldown(
  ability: CompanionAbility,
  cooldowns: CooldownMap,
  now: number = Date.now(),
): CooldownMap {
  return { ...cooldowns, [ability.id]: now + ability.cooldownMs };
}

/** Clear an ability's cooldown immediately — useful for
 *  scenes that reset timers (start-of-turn, scene end, etc). */
export function clearCooldown(
  abilityId: string,
  cooldowns: CooldownMap,
): CooldownMap {
  if (cooldowns[abilityId] === undefined) return cooldowns;
  const next: Record<string, number | undefined> = { ...cooldowns };
  delete next[abilityId];
  return next;
}

/* ─── Hook ─── */

export interface UseCompanionAbilitySlotResult {
  cooldowns: CooldownMap;
  isReady: (abilityId: string) => boolean;
  remainingMs: (abilityId: string) => number;
  /** Activate an ability. No-op if it isn't ready. Returns
   *  true iff the activation actually fired. The caller is
   *  responsible for delivering the ability's effect to the
   *  engine — this hook only manages timing. */
  activate: (abilityId: string) => boolean;
  /** Clear all cooldowns — call at end of card battle. */
  resetAll: () => void;
}

/** React glue. Composes the pure cooldown helpers with a
 *  tick interval that triggers a re-render when an ability
 *  comes off cooldown. */
export function useCompanionAbilitySlot(): UseCompanionAbilitySlotResult {
  const [cooldowns, setCooldowns] = useState<CooldownMap>({});
  const [, setTick] = useState(0);

  // Re-render every 250 ms while any cooldown is active. This
  // is throttled deliberately — cooldowns are seconds-scale,
  // sub-quarter-second precision isn't needed.
  useEffect(() => {
    const anyActive = Object.values(cooldowns).some(
      (d) => d !== undefined && d > Date.now(),
    );
    if (!anyActive) return;
    const interval = setInterval(() => setTick((t) => t + 1), 250);
    return () => clearInterval(interval);
  }, [cooldowns]);

  const isReady = useCallback(
    (abilityId: string) => isAbilityReady(abilityId, cooldowns),
    [cooldowns],
  );

  const remainingMs = useCallback(
    (abilityId: string) => remainingCooldownMs(abilityId, cooldowns),
    [cooldowns],
  );

  const activate = useCallback((abilityId: string): boolean => {
    const ability = COMPANION_ABILITIES.find((a) => a.id === abilityId);
    if (!ability) return false;
    if (!isAbilityReady(abilityId, cooldowns)) return false;
    setCooldowns((prev) => startCooldown(ability, prev));
    return true;
  }, [cooldowns]);

  const resetAll = useCallback(() => setCooldowns({}), []);

  return { cooldowns, isReady, remainingMs, activate, resetAll };
}

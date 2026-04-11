/* ═══════════════════════════════════════════════════════
   VIRUS COMBAT BUS — Integration primitive for combat systems

   thoughtVirus.ts exposes applyVirusStatus / tickVirusStatus
   as pure functions, but combat engines (FightEngine2D, the
   card battle engine, substrate dungeon turn loop) need a
   shared, stateful place to track which units have the
   Thought Virus dark-variant status attached.

   This module is that place. It's a tiny in-memory registry
   indexed by unit instance id. Combat engines call three
   functions:

     • castThoughtVirus(unitId)  — the Locks dark-variant cast
     • beginVirusTurn(unitId)    — called at start of target's
                                   turn; returns whether the
                                   unit should attack an ally
                                   AND decrements its status.
     • clearVirusStatus(unitId)  — cleanup when the unit dies
                                   or the encounter ends.

   Reset() is provided so tests can isolate themselves.
   Encounter-scoped combat engines should call reset() in
   their teardown, or clearEncounter(prefix) to drop a group
   of units by shared id prefix.
   ═══════════════════════════════════════════════════════ */

import {
  applyVirusStatus,
  tickVirusStatus,
  type VirusStatusEffect,
} from "./thoughtVirus";

const registry = new Map<string, VirusStatusEffect>();

/**
 * Apply or stack the Thought Virus status on a unit.
 * Returns the resulting status effect.
 */
export function castThoughtVirus(unitId: string): VirusStatusEffect {
  const current = registry.get(unitId) ?? null;
  const next = applyVirusStatus(current);
  registry.set(unitId, next);
  return next;
}

/**
 * Called at the start of the infected unit's turn. Rolls friendly-fire,
 * ticks the status duration down, and removes the entry if it expires.
 *
 * Returns whether this unit should attack an ally this turn, and the
 * remaining status (null if the effect just expired).
 */
export function beginVirusTurn(
  unitId: string,
  rng: () => number = Math.random,
): { targetAlly: boolean; status: VirusStatusEffect | null } {
  const current = registry.get(unitId) ?? null;
  const result = tickVirusStatus(current, rng);
  if (result.status === null) {
    registry.delete(unitId);
  } else {
    registry.set(unitId, result.status);
  }
  return result;
}

/** Clear the status for a specific unit (on death / encounter end). */
export function clearVirusStatus(unitId: string): void {
  registry.delete(unitId);
}

/** Read-only check used by AI target selection and UI overlays. */
export function isInfected(unitId: string): boolean {
  return registry.has(unitId);
}

/** Read-only snapshot used by UI overlays (do not mutate the return). */
export function peekStatus(unitId: string): VirusStatusEffect | null {
  return registry.get(unitId) ?? null;
}

/**
 * Drop every unit whose id starts with `prefix`. Combat engines can use
 * instance ids like `fight42-attacker-1` and `fight42-defender-2`, then
 * call clearEncounter("fight42-") when the match ends.
 */
export function clearEncounter(prefix: string): void {
  for (const key of Array.from(registry.keys())) {
    if (key.startsWith(prefix)) registry.delete(key);
  }
}

/** Total unit count in the bus — diagnostic / testing helper. */
export function infectedUnitCount(): number {
  return registry.size;
}

/** Clear everything — test-only helper. */
export function resetVirusBus(): void {
  registry.clear();
}

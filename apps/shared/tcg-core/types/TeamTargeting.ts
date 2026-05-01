/**
 * Team-aware targeting selectors — Tier 3 next slice.
 *
 * Additive layer on top of the existing 1v1 targeting model. When
 * the engine eventually migrates to N-player teams, these selectors
 * are the contract that 2v2 / co-op / FFA card definitions can
 * reference safely.
 *
 * For 1v1 matches:
 *   - "ally_general"        → []  (no allies in 1v1)
 *   - "all_allies"          → []
 *   - "enemy_team_generals" → [the single opposing general]
 *   - "all_enemies"         → all units controlled by the opponent
 *   - "self_or_allies"      → [self]
 *
 * For 2v2 / co-op matches (once the reducer adopts these):
 *   - "ally_general"        → teammate's general (exactly 1)
 *   - "all_allies"          → every teammate's units (excluding self)
 *   - "enemy_team_generals" → both opposing-team generals
 *   - "all_enemies"         → every opposing-team unit
 *   - "self_or_allies"      → [self, teammate]
 *
 * Pure / no I/O / serialisable.
 */
import type { MatchPlayerSlot, Team } from "./Teams";
import { alliedSlots, enemySlots, teamForSlot } from "./Teams";

export type TeamTargetSelectorKind =
  | "self"
  | "ally_general"
  | "all_allies"
  | "enemy_team_generals"
  | "all_enemies"
  | "self_or_allies"
  | "all_other_players";

/** Resolve a selector to a list of player slots. */
export function resolveTeamSelector(
  kind: TeamTargetSelectorKind,
  actorSlot: MatchPlayerSlot,
  teams: readonly Team[],
): readonly MatchPlayerSlot[] {
  switch (kind) {
    case "self":
      return [actorSlot];
    case "ally_general":
      return alliedSlots(teams, actorSlot);
    case "all_allies":
      return alliedSlots(teams, actorSlot);
    case "enemy_team_generals":
      return enemySlots(teams, actorSlot);
    case "all_enemies":
      return enemySlots(teams, actorSlot);
    case "self_or_allies":
      return [actorSlot, ...alliedSlots(teams, actorSlot)];
    case "all_other_players":
      return enemySlots(teams, actorSlot);
  }
}

/** True iff `targetSlot` is on the same team as `actorSlot`. */
export function isAllyOf(
  actorSlot: MatchPlayerSlot,
  targetSlot: MatchPlayerSlot,
  teams: readonly Team[],
): boolean {
  if (actorSlot === targetSlot) return true;
  const team = teamForSlot(teams, actorSlot);
  return !!team && team.playerSlots.includes(targetSlot);
}

/** True iff `targetSlot` is on a different team from `actorSlot`. */
export function isEnemyOf(
  actorSlot: MatchPlayerSlot,
  targetSlot: MatchPlayerSlot,
  teams: readonly Team[],
): boolean {
  if (actorSlot === targetSlot) return false;
  return !isAllyOf(actorSlot, targetSlot, teams);
}

/**
 * Filter a list of unit owners by a `controller` clause from a
 * UnitFilter. Mirrors the existing engine semantics for "self" /
 * "opponent" / "any" but adds "ally" / "enemy" team-aware variants.
 *
 *   "self"     → only units owned by actor
 *   "ally"     → actor + teammates (EXCLUDING enemies)
 *   "opponent" → legacy: any non-actor (1v1 semantics; in 2v2 this
 *                returns enemies+allies that aren't self — callers
 *                upgrading to team play should switch to "enemy")
 *   "enemy"    → only opposing-team units
 *   "any"      → no filter
 */
export function filterByController(
  controller: "self" | "ally" | "opponent" | "enemy" | "any" | undefined,
  ownerSlots: readonly MatchPlayerSlot[],
  actorSlot: MatchPlayerSlot,
  teams: readonly Team[],
): readonly MatchPlayerSlot[] {
  if (!controller || controller === "any") return ownerSlots;
  switch (controller) {
    case "self":
      return ownerSlots.filter((s) => s === actorSlot);
    case "ally":
      return ownerSlots.filter((s) => isAllyOf(actorSlot, s, teams));
    case "enemy":
      return ownerSlots.filter((s) => isEnemyOf(actorSlot, s, teams));
    case "opponent":
      // Legacy 1v1: anyone not the actor.
      return ownerSlots.filter((s) => s !== actorSlot);
  }
}

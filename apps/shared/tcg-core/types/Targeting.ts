/**
 * Target selector shapes. Resolved by engine/targeting.ts against a
 * GameState snapshot into concrete EntityId lists or empty positions.
 *
 * The `chooser` field controls who picks when the selector yields multiple
 * valid targets:
 *  - "player": the active player chooses at action-play time.
 *  - "opponent": the opponent chooses (e.g. for discard-a-card effects).
 *  - "random": the engine picks via the GameState RNG.
 *
 * For `random`, choice is fully deterministic from the RNG state, so replays
 * reproduce. For `player`/`opponent`, the choice is carried on the Action
 * and validated against the selector at reduce time.
 */
import type { UnitFilter } from "./Effect";

export type Chooser = "player" | "opponent" | "random";

export type OriginSelector =
  | { kind: "self" }
  | { kind: "trigger_source" }
  | { kind: "trigger_victim" }
  | { kind: "friendly_general" }
  | { kind: "enemy_general" }
  | { kind: "last_target" };

export type Direction = "up" | "down" | "left" | "right";

export type TargetSelector =
  | { kind: "self" }
  | { kind: "friendly_general" }
  | { kind: "enemy_general" }
  | { kind: "single"; filter: UnitFilter; chooser: Chooser }
  | { kind: "all"; filter: UnitFilter }
  | { kind: "radius"; origin: OriginSelector; radius: number; filter: UnitFilter }
  | {
      kind: "line";
      origin: OriginSelector;
      direction: Direction;
      length: number;
      filter: UnitFilter;
    }
  | { kind: "nearest"; from: OriginSelector; filter: UnitFilter }
  | { kind: "position_empty"; constraint: PositionConstraint };

export type PositionConstraint =
  | { kind: "any" }
  | { kind: "adjacent_to_friendly" }
  | { kind: "adjacent_to_enemy" }
  | { kind: "own_side" }
  | { kind: "enemy_side" };

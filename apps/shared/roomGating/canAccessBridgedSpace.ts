/**
 * canAccessBridgedSpace — evaluate a {@link RoomUnlockRequirement}
 * against the player's game-state slice.
 *
 * Used by the generic `BridgedSpacePage` to decide whether a vehicle
 * / destination / Hellbox should render or show its locked state.
 * `canAccessRoom()` in `GameContext.tsx` covers the legacy Ark room
 * unlock types; this evaluator handles the H.I-introduced types
 * (hellbox_unlocked, act_progress, blood_weave_alignment, etc.) plus
 * the room_visited / narrative_event / specific_item variants that
 * map cleanly onto already-modeled state.
 *
 * Returns `{ allowed: true }` when the gate passes, or
 * `{ allowed: false, reason }` with a player-readable explanation.
 * Unhandled gate variants return `{ allowed: false, reason: "..." }`
 * — fail closed, never silently green-light.
 */

import { ROOM_UNLOCK_BY_ID, type RoomUnlockRequirement } from "./roomUnlockManifest";

export interface BridgedAccessGameSlice {
  readonly narrativeAct: number;
  readonly narrativeFlags: Readonly<Record<string, boolean | string | undefined>>;
  readonly inventory?: ReadonlyArray<{ id: string }>;
  /** Optional loredex unlock count derived from `loredex_*` flags. */
  readonly loredexUnlockedCount?: number;
  /** Optional army roster for `apprentice_in_cohort`. */
  readonly armyUnits?: ReadonlyArray<{ archetype?: string | null }>;
  /** Optional blood-weave alignment score. */
  readonly bloodWeaveAlignment?: number;
}

export type AccessResult =
  | { allowed: true }
  | { allowed: false; reason: string };

function flag(slice: BridgedAccessGameSlice, key: string): boolean {
  return slice.narrativeFlags[key] === true;
}

export function evaluateUnlock(
  req: RoomUnlockRequirement,
  slice: BridgedAccessGameSlice,
): AccessResult {
  switch (req.type) {
    case "start":
      return { allowed: true };

    case "act_progress":
      return slice.narrativeAct >= req.act
        ? { allowed: true }
        : { allowed: false, reason: `Requires Act ${req.act} (currently Act ${slice.narrativeAct}).` };

    case "hellbox_unlocked":
      return flag(slice, `cs_hellbox_${req.hellbox}_open`)
        ? { allowed: true }
        : { allowed: false, reason: `Requires Hellbox ${req.hellbox} to be open.` };

    case "narrative_event":
      return flag(slice, req.value)
        ? { allowed: true }
        : { allowed: false, reason: `Requires narrative event: ${req.value}.` };

    case "room_visited":
      return flag(slice, `visited_${req.value}`) || flag(slice, req.value)
        ? { allowed: true }
        : { allowed: false, reason: `Visit ${req.value} first.` };

    case "specific_item":
      return (slice.inventory ?? []).some((i) => i.id === req.value)
        ? { allowed: true }
        : { allowed: false, reason: `Requires item: ${req.value}.` };

    case "items_collected":
      return (slice.inventory?.length ?? 0) >= req.value
        ? { allowed: true }
        : { allowed: false, reason: `Collect ${req.value} items first.` };

    case "loredex_threshold":
      return (slice.loredexUnlockedCount ?? 0) >= req.threshold
        ? { allowed: true }
        : { allowed: false, reason: `Unlock ${req.threshold} loredex entries first.` };

    case "blood_weave_alignment":
      return (slice.bloodWeaveAlignment ?? 0) >= req.threshold
        ? { allowed: true }
        : { allowed: false, reason: `Blood-weave alignment must reach ${req.threshold}.` };

    case "apprentice_in_cohort": {
      const archetype = req.archetype;
      const matches = (slice.armyUnits ?? []).some((u) => {
        if (!u.archetype) return false;
        return archetype === "any" || u.archetype === archetype;
      });
      return matches
        ? { allowed: true }
        : { allowed: false, reason: `Recruit a ${archetype === "any" ? "" : archetype + " "}apprentice first.` };
    }

    case "chain_complete":
      return flag(slice, `chain_${req.value}_complete`)
        ? { allowed: true }
        : { allowed: false, reason: `Complete the ${req.value} chain first.` };
  }
}

/**
 * Resolve and evaluate the unlock requirement for a canonical space
 * id. Returns `allowed: true` for spaces not in the manifest (treated
 * as ungated — open for navigation by anyone who knows the id).
 */
export function canAccessBridgedSpace(
  canonicalSpaceId: string,
  slice: BridgedAccessGameSlice,
): AccessResult {
  const entry = ROOM_UNLOCK_BY_ID.get(canonicalSpaceId);
  if (!entry) return { allowed: true };
  return evaluateUnlock(entry.unlock, slice);
}

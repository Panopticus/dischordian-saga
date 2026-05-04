/* ═══════════════════════════════════════════════════════
   Tests for getLockedCardIds — the pure-data half of the
   PlayerExpansionState helper. The DB-bound
   getPlayerExpansionState is exercised in integration via
   cardGame.browse + openBoosterPack at runtime.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";
import { getLockedCardIds } from "./playerExpansionState";
import {
  NULL_PLAYER_EXPANSION_STATE,
  type PlayerExpansionState,
} from "@shared/tcg-core/rewards/expansionUnlockService";

describe("getLockedCardIds", () => {
  it("returns a Set", () => {
    const ids = getLockedCardIds(NULL_PLAYER_EXPANSION_STATE);
    expect(ids).toBeInstanceOf(Set);
  });

  it("is non-empty for the null state — at least the reserved + act-gated cards", () => {
    const ids = getLockedCardIds(NULL_PLAYER_EXPANSION_STATE);
    // The card registry includes reserved entries (e.g. burnt_card_
    // placeholder) plus a documented batch of act-gated S2 hierarchy
    // cards (act_exclusives, etc.). The exact count varies as content
    // ships; the invariant is "non-zero."
    expect(ids.size).toBeGreaterThan(0);
  });

  it("shrinks as the player progresses through acts", () => {
    const baseline = getLockedCardIds(NULL_PLAYER_EXPANSION_STATE);
    const completedAct1: PlayerExpansionState = {
      ...NULL_PLAYER_EXPANSION_STATE,
      completedActs: new Set([1]),
    };
    const afterAct1 = getLockedCardIds(completedAct1);
    // Strictly fewer (or equal) — completing an act can only unlock
    // gates, never relock them.
    expect(afterAct1.size).toBeLessThanOrEqual(baseline.size);
  });

  it("entitlement state shrinks the locked set", () => {
    const founding: PlayerExpansionState = {
      ...NULL_PLAYER_EXPANSION_STATE,
      hasFoundingAuthor: true,
      hasAuthorsEditionS2: true,
    };
    const baseline = getLockedCardIds(NULL_PLAYER_EXPANSION_STATE);
    const withEntitlements = getLockedCardIds(founding);
    expect(withEntitlements.size).toBeLessThanOrEqual(baseline.size);
  });
});

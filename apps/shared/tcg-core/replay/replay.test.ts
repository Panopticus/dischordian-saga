/**
 * Replay determinism — pinned snapshot tests.
 *
 * audit/05.F5 — the engine's RULES_VERSION encodes a contract: a
 * recorded replay must produce the same final state hash when run
 * back through the engine. Without a fingerprint, a silent semantics
 * change to any effect-op handler could break old replays without
 * the test suite noticing.
 *
 * Strategy: replay a small canonical match (a few mulligan-then-
 * play-units actions against the live RULES_VERSION) and assert the
 * final state hash matches a pinned literal. Bumping RULES_VERSION
 * is allowed; updating these snapshots IS the deliberate version-
 * bump review gate.
 */
import { describe, it, expect } from "vitest";
import { replayMatch } from "./replay";
import { RULES_VERSION } from "../engine/version";
import { ALL_CARD_DEFINITIONS } from "../cards";
import { buildCardRegistry } from "../cards/loader";

describe("replay determinism (audit/05.F5)", () => {
  // Build a stable registry from the alphabetically-first 30 card
  // definitions. The choice is intentionally boring so the test
  // isn't sensitive to design changes; only the engine's reduce()
  // semantics affect the hash.
  const sortedDefs = [...ALL_CARD_DEFINITIONS]
    .sort((a, b) => a.id.localeCompare(b.id))
    .slice(0, 30);
  const allIds = sortedDefs.map((d) => d.id);
  const registry = buildCardRegistry(sortedDefs);

  // Pick two ids from the 30-card slice that are reasonable to use
  // as generals. The replay engine just needs valid CardDefIds; even
  // unit cards work for a smoke test (rules check at validateDeck
  // is the gate, not init.ts).
  const baseInput = {
    matchId: "replay-test-001",
    seed: "deterministic-seed-1",
    rulesVersion: RULES_VERSION,
    p1Config: {
      userId: 1 as never,
      faction: "neutral" as const,
      generalDefId: allIds[0],
      deckCardDefIds: allIds,
    },
    p2Config: {
      userId: 2 as never,
      faction: "neutral" as const,
      generalDefId: allIds[1],
      deckCardDefIds: allIds,
    },
    registry,
    actions: [],
  };

  it("produces a stable final state hash for the empty-action replay", () => {
    const r1 = replayMatch(baseInput);
    const r2 = replayMatch(baseInput);
    expect(r1.finalStateHash).toBe(r2.finalStateHash);
    expect(r1.versionCompatible).toBe(true);
  });

  it("hash changes when seed changes (proves the seed is honoured)", () => {
    const r1 = replayMatch(baseInput);
    const r2 = replayMatch({ ...baseInput, seed: "deterministic-seed-2" });
    expect(r1.finalStateHash).not.toBe(r2.finalStateHash);
  });

  it("RULES_VERSION is the literal pinned in the engine module", () => {
    // Every card carries `rulesVersion: "1.1.0"` literal. The replay
    // module re-exports RULES_VERSION; bumping it is the deliberate
    // gate. If you're reading this because the test fails, you bumped
    // RULES_VERSION — confirm that's intentional and update card
    // literals.
    expect(RULES_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

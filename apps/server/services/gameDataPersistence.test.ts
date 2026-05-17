import { describe, it, expect } from "vitest";
import {
  GAME_DATA_SCHEMA_VERSION,
  mergeClientGameData,
} from "./gameDataPersistence";

describe("mergeClientGameData (Persistence F3/F7)", () => {
  it("never lets a stale client blob clobber server-granted entitlements", () => {
    // The canonical F3 scenario: Stripe webhook granted the paid
    // entitlement server-side; the client autosaves a blob captured
    // *before* the grant (entitlements absent).
    const server = {
      entitlements: { foundingAuthor: true },
      narrativeFlags: { mystery_episode_complete: true },
      level: 3,
    };
    const staleClient = { level: 9, deck: ["a", "b"] };

    const merged = mergeClientGameData(server, staleClient);

    expect(merged.entitlements).toEqual({ foundingAuthor: true });
    expect(merged.narrativeFlags).toEqual({
      mystery_episode_complete: true,
    });
    // client still owns non-authoritative gameplay scratch
    expect(merged.level).toBe(9);
    expect(merged.deck).toEqual(["a", "b"]);
  });

  it("ignores a client that tries to forge entitlements / flags", () => {
    const server = { entitlements: { foundingAuthor: false } };
    const maliciousClient = {
      entitlements: { foundingAuthor: true, authorsEditionS2: true },
      narrativeFlags: { act7_complete: true },
    };

    const merged = mergeClientGameData(server, maliciousClient);

    expect(merged.entitlements).toEqual({ foundingAuthor: false });
    // server had no narrativeFlags → client may not create them
    expect(merged.narrativeFlags).toBeUndefined();
  });

  it("stamps the current schema version on every write", () => {
    expect(mergeClientGameData(null, {}).schemaVersion).toBe(
      GAME_DATA_SCHEMA_VERSION,
    );
    expect(
      mergeClientGameData({ schemaVersion: 0 }, { schemaVersion: 999 })
        .schemaVersion,
    ).toBe(GAME_DATA_SCHEMA_VERSION);
  });

  it("first-time write (no server row) keeps client scratch, drops authoritative keys", () => {
    const merged = mergeClientGameData(null, {
      level: 1,
      entitlements: { foundingAuthor: true },
    });
    expect(merged.level).toBe(1);
    expect(merged.entitlements).toBeUndefined();
  });
});

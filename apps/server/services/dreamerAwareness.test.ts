/**
 * Wiring tests for the Dreamer-Awareness service.
 *
 * No DB is available in the test env, so the focus is contract-level:
 *
 *   - tagDreamerAwareness no-DB-safe — never throws, returns the
 *     documented degenerate shape (no-op result).
 *   - getDreamerAwareness no-DB-safe — returns null without throwing.
 *   - markVisionReceived no-DB-safe — completes without throwing.
 *   - bootstrap no-DB-safe + idempotent.
 *
 * The full counter increment / threshold-crossing path requires a
 * real MySQL fixture; that lands in a follow-up integration test
 * once the harness has one.
 */
import { describe, it, expect } from "vitest";

import {
  tagDreamerAwareness,
  getDreamerAwareness,
  markVisionReceived,
} from "./dreamerAwareness";
import { bootstrapDreamerAwarenessTable } from "./dreamerAwarenessBootstrap";
import {
  BURNT_CARD_WITNESSED,
  DECLINE_WINNING_DRAW,
} from "../../shared/dreamerAwarenessTags";

describe("tagDreamerAwareness — no-DB safety", () => {
  it("returns the documented no-op shape when DB is unavailable", async () => {
    const r = await tagDreamerAwareness(42, DECLINE_WINNING_DRAW.id);
    expect(r).toEqual({
      applied: false,
      alreadyFired: false,
      count: 0,
      thresholdCrossed: undefined,
    });
  });

  it("unknown tag id is a logged no-op rather than a throw", async () => {
    const r = await tagDreamerAwareness(1, "not_a_real_tag");
    expect(r.applied).toBe(false);
    expect(r.count).toBe(0);
  });

  it("accepts the rare-discovery tag without throwing in the no-DB path", async () => {
    const r = await tagDreamerAwareness(99, BURNT_CARD_WITNESSED.id);
    expect(r.applied).toBe(false);
  });
});

describe("getDreamerAwareness — no-DB safety", () => {
  it("returns null without throwing when DB is unavailable", async () => {
    const r = await getDreamerAwareness(42);
    expect(r).toBeNull();
  });
});

describe("markVisionReceived — no-DB safety", () => {
  it("returns void without throwing when DB is unavailable", async () => {
    await expect(markVisionReceived(42, "vision_first_notice")).resolves.toBeUndefined();
  });
});

describe("bootstrapDreamerAwarenessTable — no-DB safety", () => {
  it("returns void without throwing when DB pool is unavailable", async () => {
    await expect(bootstrapDreamerAwarenessTable()).resolves.toBeUndefined();
  });

  it("is idempotent under repeat invocation", async () => {
    await expect(bootstrapDreamerAwarenessTable()).resolves.toBeUndefined();
    await expect(bootstrapDreamerAwarenessTable()).resolves.toBeUndefined();
  });
});

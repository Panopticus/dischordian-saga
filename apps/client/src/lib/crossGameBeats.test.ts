import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  fireCrossGameBeat,
  hasBeatBeenEmittedThisSession,
  initCrossGameBeats,
  _resetCrossGameBeatsForTests,
} from "./crossGameBeats";

function makeMockUtils(
  mutateImpl: (
    args: { beatId: string; emittedBy?: string },
  ) => Promise<{ success: boolean; alreadyEmitted: boolean }>,
) {
  return {
    client: {
      crossGameThreads: {
        emit: {
          mutate: vi.fn(mutateImpl),
        },
      },
    },
  } as unknown as Parameters<typeof initCrossGameBeats>[0];
}

describe("crossGameBeats", () => {
  beforeEach(() => {
    _resetCrossGameBeatsForTests();
  });

  it("short-circuits a second call with the same beatId", async () => {
    const mutate = vi.fn(async () => ({ success: true, alreadyEmitted: false }));
    initCrossGameBeats(
      makeMockUtils(mutate as unknown as Parameters<typeof makeMockUtils>[0]),
    );

    const first = await fireCrossGameBeat("cades_fall_expulsion");
    expect(first.shortCircuited).toBe(false);
    expect(first.success).toBe(true);
    expect(mutate).toHaveBeenCalledTimes(1);

    const second = await fireCrossGameBeat("cades_fall_expulsion");
    expect(second.shortCircuited).toBe(true);
    expect(mutate).toHaveBeenCalledTimes(1); // no second call
  });

  it("passes emittedBy through to the mutation", async () => {
    const mutate = vi.fn(async () => ({ success: true, alreadyEmitted: false }));
    initCrossGameBeats(
      makeMockUtils(mutate as unknown as Parameters<typeof makeMockUtils>[0]),
    );

    await fireCrossGameBeat("cades_fall_arrival", { emittedBy: "cades_fps" });
    expect(mutate).toHaveBeenCalledWith({
      beatId: "cades_fall_arrival",
      emittedBy: "cades_fps",
    });
  });

  it("defaults emittedBy to loredex", async () => {
    const mutate = vi.fn(async () => ({ success: true, alreadyEmitted: false }));
    initCrossGameBeats(
      makeMockUtils(mutate as unknown as Parameters<typeof makeMockUtils>[0]),
    );

    await fireCrossGameBeat("programmers_gift_loredex_award");
    expect(mutate).toHaveBeenCalledWith({
      beatId: "programmers_gift_loredex_award",
      emittedBy: "loredex",
    });
  });

  it("returns a non-successful result when not initialized", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = await fireCrossGameBeat("anything");
    expect(result.success).toBe(false);
    expect(result.shortCircuited).toBe(false);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("swallows network errors and returns success:false", async () => {
    const mutate = vi.fn(async () => {
      throw new Error("network down");
    });
    initCrossGameBeats(
      makeMockUtils(mutate as unknown as Parameters<typeof makeMockUtils>[0]),
    );
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await fireCrossGameBeat("substrate_handshake_loredex_first_contact");
    expect(result.success).toBe(false);
    expect(result.shortCircuited).toBe(false);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("reports alreadyEmitted from the server when the server already had the beat", async () => {
    const mutate = vi.fn(async () => ({ success: true, alreadyEmitted: true }));
    initCrossGameBeats(
      makeMockUtils(mutate as unknown as Parameters<typeof makeMockUtils>[0]),
    );

    const result = await fireCrossGameBeat("last_words_echo_loredex_performance");
    expect(result.alreadyEmitted).toBe(true);
    expect(result.shortCircuited).toBe(false);
  });

  it("hasBeatBeenEmittedThisSession reflects the local cache", async () => {
    const mutate = vi.fn(async () => ({ success: true, alreadyEmitted: false }));
    initCrossGameBeats(
      makeMockUtils(mutate as unknown as Parameters<typeof makeMockUtils>[0]),
    );

    expect(hasBeatBeenEmittedThisSession("iron_lions_wake_expulsion_witnessed")).toBe(false);
    await fireCrossGameBeat("iron_lions_wake_expulsion_witnessed");
    expect(hasBeatBeenEmittedThisSession("iron_lions_wake_expulsion_witnessed")).toBe(true);
  });
});

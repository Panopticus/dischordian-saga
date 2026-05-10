import { describe, expect, it } from "vitest";
import {
  confessionCloseSeenFlag,
  resolvePendingConfessionClose,
} from "@/components/cutscenes/ConfessionCloseRouter";
import { CONFESSION_CLOSE_STANCES } from "@shared/confessionCloseCutscenes";

describe("ConfessionCloseRouter — resolvePendingConfessionClose", () => {
  it("returns null when no flags are set", () => {
    expect(resolvePendingConfessionClose({})).toBeNull();
  });

  it("returns the stance + Elara→Human queue when a stance flag is true", () => {
    const flags = { act6_confession_close_empathy: true };
    const pending = resolvePendingConfessionClose(flags);
    expect(pending?.stance).toBe("empathy");
    expect(pending?.queue).toHaveLength(2);
    expect(pending?.queue[0].character).toBe("elara");
    expect(pending?.queue[0].stance).toBe("empathy");
    expect(pending?.queue[1].character).toBe("human");
    expect(pending?.queue[1].stance).toBe("empathy");
  });

  it("skips a stance whose seen flag is already set", () => {
    const flags = {
      act6_confession_close_empathy: true,
      [confessionCloseSeenFlag("empathy")]: true,
    };
    expect(resolvePendingConfessionClose(flags)).toBeNull();
  });

  it("when multiple stance flags fire, returns the first canonical stance", () => {
    // Bug-state — game gate normally enforces single-stance, but
    // the resolver must still pick deterministically.
    const flags = {
      act6_confession_close_empathy: true,
      act6_confession_close_challenge: true,
    };
    const first = CONFESSION_CLOSE_STANCES[0];
    expect(resolvePendingConfessionClose(flags)?.stance).toBe(first);
  });

  it("non-true values do not count as stance-set", () => {
    expect(
      resolvePendingConfessionClose({
        act6_confession_close_empathy: false,
      }),
    ).toBeNull();
    expect(
      resolvePendingConfessionClose({
        act6_confession_close_empathy: 1 as unknown as boolean,
      }),
    ).toBeNull();
  });

  it("every canonical stance resolves to a 2-entry queue", () => {
    for (const stance of CONFESSION_CLOSE_STANCES) {
      const pending = resolvePendingConfessionClose({
        [`act6_confession_close_${stance}`]: true,
      });
      expect(pending?.stance).toBe(stance);
      expect(pending?.queue.map((d) => d.character)).toEqual([
        "elara",
        "human",
      ]);
    }
  });

  it("seen flag follows the documented convention", () => {
    expect(confessionCloseSeenFlag("empathy")).toBe(
      "confession_close_empathy_seen",
    );
    expect(confessionCloseSeenFlag("oracle_sense")).toBe(
      "confession_close_oracle_sense_seen",
    );
  });
});

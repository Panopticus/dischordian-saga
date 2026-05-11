import { describe, expect, it } from "vitest";
import {
  WATCHERS_EYES_DISPATCHES,
  applyDispatchRedactions,
  dispatchesForRoom,
  getDispatch,
  resolveDispatchBody,
} from "./watchersEyesDispatches";

describe("WATCHERS_EYES_DISPATCHES — schema invariants", () => {
  it("every dispatch has a unique id, voId, loredex entry", () => {
    const ids = WATCHERS_EYES_DISPATCHES.map((d) => d.dispatchId);
    const voIds = WATCHERS_EYES_DISPATCHES.map((d) => d.voId);
    const loredexIds = WATCHERS_EYES_DISPATCHES.map((d) => d.unlockLoredexEntry);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(voIds).size).toBe(voIds.length);
    expect(new Set(loredexIds).size).toBe(loredexIds.length);
  });

  it("every dispatch has 3-6 body lines", () => {
    for (const d of WATCHERS_EYES_DISPATCHES) {
      expect(
        d.body.length,
        `${d.dispatchId} body line count out of range`,
      ).toBeGreaterThanOrEqual(3);
      expect(
        d.body.length,
        `${d.dispatchId} body line count out of range`,
      ).toBeLessThanOrEqual(6);
    }
  });

  it("AGENT is always F-7", () => {
    for (const d of WATCHERS_EYES_DISPATCHES) {
      expect(d.header.agent, d.dispatchId).toBe("F-7");
    }
  });
});

describe("WATCHERS_EYES_DISPATCHES — voice register (clinical, no first person)", () => {
  // Era-2 register is clinical / observation-only. No standalone
  // first-person pronouns; lines begin with capitalized nouns,
  // dates, or designators. The Era-2 contrast with Era-3 Detective
  // warmth is the whole point of the surface — drift breaks the
  // canon.
  const FIRST_PERSON = /\b[Ii]'?(?:m|ll|ve|d)?\b/;

  it("no body line contains a standalone first-person pronoun", () => {
    const offenders: string[] = [];
    for (const d of WATCHERS_EYES_DISPATCHES) {
      for (const line of d.body) {
        if (FIRST_PERSON.test(line)) {
          offenders.push(`${d.dispatchId}: ${line}`);
        }
      }
    }
    expect(
      offenders,
      "Era-2 dispatch voice drift — first person belongs to the Detective era",
    ).toEqual([]);
  });

  it("body lines begin with a noun, date, designator, or 'No'", () => {
    // Approximate the register check: every line starts with an
    // uppercase letter that is NOT "I" / "We". Allows for "Subject",
    // "Asset", "Observation", "F-7", numeric, "End of report", etc.
    for (const d of WATCHERS_EYES_DISPATCHES) {
      for (const line of d.body) {
        const first = line.match(/^([A-Z]\w*|\d)/);
        expect(first, `${d.dispatchId} body line starts wrong: ${line}`).not.toBeNull();
        if (first) {
          expect(["I", "We"]).not.toContain(first[1]);
        }
      }
    }
  });
});

describe("dispatch_F7_final — Elara reveal gating", () => {
  const final = getDispatch("dispatch_F7_final")!;

  it("exists and has redactedFields gated on human_life_reveal_seen", () => {
    expect(final).toBeDefined();
    expect(final.redactedFields, "final dispatch must declare redactions").toBeDefined();
    for (const f of final.redactedFields!) {
      expect(f.revealFlag).toBe("human_life_reveal_seen");
    }
  });

  it("pre-reveal body does not name Elara Voss", () => {
    const body = resolveDispatchBody(final, new Set());
    const haystack = body.join("\n").toLowerCase();
    expect(haystack).not.toContain("elara");
    expect(haystack).not.toContain("senator voss");
  });

  it("post-reveal body names Senator Elara Voss and Elara", () => {
    const body = resolveDispatchBody(
      final,
      new Set(["human_life_reveal_seen"]),
    );
    const haystack = body.join("\n");
    expect(haystack).toContain("SENATOR ELARA VOSS");
    expect(haystack).toContain("Elara");
  });

  it("footer post-reveal also resolves the [REDACTED] placeholder", () => {
    const flags = new Set(["human_life_reveal_seen"]);
    const footer = applyDispatchRedactions(final.footer!, final, flags);
    expect(footer).not.toContain("[REDACTED]");
  });

  it("flipping the flag mid-render is observable (no caching)", () => {
    const pre = resolveDispatchBody(final, new Set());
    const post = resolveDispatchBody(
      final,
      new Set(["human_life_reveal_seen"]),
    );
    expect(pre).not.toEqual(post);
  });
});

describe("non-final dispatches have no redactions", () => {
  it("dispatches 1 and 2 render identically under any flag set", () => {
    for (const d of WATCHERS_EYES_DISPATCHES) {
      if (d.dispatchId === "dispatch_F7_final") continue;
      const empty = resolveDispatchBody(d, new Set());
      const full = resolveDispatchBody(
        d,
        new Set(["human_life_reveal_seen"]),
      );
      expect(empty, d.dispatchId).toEqual(full);
    }
  });
});

describe("dispatchesForRoom", () => {
  it("returns every dispatch surfaced at a given room", () => {
    for (const d of WATCHERS_EYES_DISPATCHES) {
      const found = dispatchesForRoom(d.surfaceLocation.roomId);
      expect(found.some((x) => x.dispatchId === d.dispatchId)).toBe(true);
    }
  });

  it("returns empty for non-spy rooms", () => {
    expect(dispatchesForRoom("cargo_hold")).toEqual([]);
  });
});

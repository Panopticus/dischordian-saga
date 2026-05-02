/**
 * Party math tests — `maxMembersForMode` and structural invariants.
 * Server-touching mutations are exercised by e2e + manual QA.
 */
import { describe, it, expect } from "vitest";
import { maxMembersForMode } from "./party";

describe("maxMembersForMode", () => {
  it("card_2v2 caps at 2", () => {
    expect(maxMembersForMode("card_2v2")).toBe(2);
  });
  it("card_coop caps at 2 (Two Witnesses)", () => {
    expect(maxMembersForMode("card_coop")).toBe(2);
  });
  it("card_ffa caps at 4", () => {
    expect(maxMembersForMode("card_ffa")).toBe(4);
  });
  it("open caps at 4", () => {
    expect(maxMembersForMode("open")).toBe(4);
  });
});

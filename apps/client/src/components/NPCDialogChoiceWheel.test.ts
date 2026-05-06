/* ═══════════════════════════════════════════════════════
   NPCDialogChoiceWheel — pure helper tests

   The component itself isn't render-tested (the codebase
   doesn't ship @testing-library/react; see PreludePage.test
   for the structural-scan convention). Instead we test the
   pure helper that drives the wheel's signature ordering:
   sortChoicesByAlignment.
   ═══════════════════════════════════════════════════════ */
import { describe, expect, it } from "vitest";
import { sortChoicesByAlignment } from "./NPCDialogChoiceWheel";
import type { NPCDialogChoice } from "./NPCDialog";

const choice = (
  id: string,
  alignment?: NPCDialogChoice["alignment"],
): NPCDialogChoice => ({
  id,
  label: id,
  archetype: "pragmatic",
  trustChange: 0,
  response: "",
  alignment,
});

describe("sortChoicesByAlignment", () => {
  it("orders humanity → neutral → machine", () => {
    const out = sortChoicesByAlignment([
      choice("m1", "machine"),
      choice("n1"),
      choice("h1", "humanity"),
    ]);
    expect(out.map((c) => c.id)).toEqual(["h1", "n1", "m1"]);
  });

  it("treats unset alignment as neutral", () => {
    const out = sortChoicesByAlignment([
      choice("a"),
      choice("h", "humanity"),
      choice("b"),
      choice("m", "machine"),
    ]);
    expect(out.map((c) => c.id)).toEqual(["h", "a", "b", "m"]);
  });

  it("is stable within a group (preserves authoring order)", () => {
    const out = sortChoicesByAlignment([
      choice("h_first", "humanity"),
      choice("h_second", "humanity"),
      choice("h_third", "humanity"),
    ]);
    expect(out.map((c) => c.id)).toEqual(["h_first", "h_second", "h_third"]);
  });

  it("handles an all-neutral list (no reordering)", () => {
    const out = sortChoicesByAlignment([choice("a"), choice("b"), choice("c")]);
    expect(out.map((c) => c.id)).toEqual(["a", "b", "c"]);
  });

  it("handles an empty list", () => {
    expect(sortChoicesByAlignment([])).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const input = [choice("m", "machine"), choice("h", "humanity")];
    const before = input.map((c) => c.id);
    sortChoicesByAlignment(input);
    expect(input.map((c) => c.id)).toEqual(before);
  });
});

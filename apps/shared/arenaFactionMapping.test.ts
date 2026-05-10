/* ═══════════════════════════════════════════════════════
   ARENA → NARRATIVE FACTION mapping — invariant test

   Pins three properties:

   1. Every arena id in `arenaFactionMapping.ts` resolves to a
      valid `CharacterSheetBackground` (the producer-drop
      faction set the FactionBackdrop component renders).
   2. The seven canonical narrative factions each have at
      least one arena tagged for them — otherwise the
      backplate art for that faction would be unreachable
      through this mapping. (Other surfaces — character
      sheet, faction war, witnessing VFX — still reach
      every faction; this test is the arena-side gate.)
   3. `arenaFaction()` returns null for unmapped ids
      (the exempt path used by `the-trench` and any
      future third-party arena).
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";
import {
  arenaFaction,
  arenaIdsWithFaction,
} from "./arenaFactionMapping";
import { CHARACTER_SHEET_BACKGROUNDS } from "./aaaArtArchive";

describe("arenaFactionMapping", () => {
  it("every mapped arena resolves to a valid faction backdrop id", () => {
    const validSet = new Set<string>(CHARACTER_SHEET_BACKGROUNDS);
    const bad: string[] = [];
    for (const id of arenaIdsWithFaction()) {
      const f = arenaFaction(id);
      if (!f || !validSet.has(f)) bad.push(`${id} → ${f ?? "null"}`);
    }
    expect(bad).toEqual([]);
  });

  it("all seven canonical factions are reachable through at least one arena", () => {
    const reached = new Set<string>();
    for (const id of arenaIdsWithFaction()) {
      const f = arenaFaction(id);
      if (f) reached.add(f);
    }
    const missing = CHARACTER_SHEET_BACKGROUNDS.filter((f) => !reached.has(f));
    expect(missing).toEqual([]);
  });

  it("unmapped arena ids return null (the-trench is the canonical exempt)", () => {
    expect(arenaFaction("the-trench")).toBeNull();
    expect(arenaFaction("not-a-real-arena")).toBeNull();
  });
});

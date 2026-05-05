import { describe, it, expect } from "vitest";

import {
  CONEXUS_TOMES,
  getTome,
  tomeUnlockFlag,
  tomesAvailableInAct,
} from "./coNexusTomes";

describe("CoNexus Tomes registry", () => {
  it("ships seven Tomes (per audit recommendation 5-10)", () => {
    expect(CONEXUS_TOMES).toHaveLength(7);
  });

  it("every Tome has unique id, title, body, and teaser", () => {
    const ids = CONEXUS_TOMES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const tome of CONEXUS_TOMES) {
      expect(tome.title.length).toBeGreaterThan(0);
      expect(tome.redactedTeaser.length).toBeGreaterThan(0);
      expect(tome.body.length).toBeGreaterThan(200);
    }
  });

  it("every Tome body fits the 200-400 word target band (allow some slack)", () => {
    for (const tome of CONEXUS_TOMES) {
      const wordCount = tome.body.split(/\s+/).filter(Boolean).length;
      expect(wordCount, `${tome.id} word count ${wordCount}`).toBeGreaterThan(150);
      expect(wordCount, `${tome.id} word count ${wordCount}`).toBeLessThan(500);
    }
  });

  it("getTome returns the matching Tome", () => {
    expect(getTome("the_garden_under_sand")?.title).toBe("The Garden Under Sand");
    expect(getTome("nonexistent" as never)).toBeUndefined();
  });

  it("tomeUnlockFlag follows the conexus:tome:<id>:discovered convention", () => {
    expect(tomeUnlockFlag("the_garden_under_sand")).toBe(
      "conexus:tome:the_garden_under_sand:discovered",
    );
  });

  it("tomesAvailableInAct filters by earliestAct", () => {
    const act3 = tomesAvailableInAct(3);
    expect(act3.length).toBeGreaterThan(0);
    for (const t of act3) expect(t.earliestAct).toBeLessThanOrEqual(3);

    const act7 = tomesAvailableInAct(7);
    expect(act7.length).toBe(CONEXUS_TOMES.length);
  });
});

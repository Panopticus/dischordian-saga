import { describe, expect, it } from "vitest";

import {
  ARC_WRAITH_CALDER,
  MYSTERY_DEFINITIONS,
  getEpisodeDefinition,
  getMysteriesForArc,
  getMysteryDefinition,
} from "./episodeMysteries";
import type { ClueId, EpisodeId, MysteryId } from "./mysteryTypes";

/* ═══════════════════════════════════════════════════════
   episodeMysteries.test.ts — registry validity probes

   Source-of-truth assertions per
   docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md §10
   (episodeMysteries.test.ts — definition validity:
   clues exist, deduction graphs are DAGs, accessibility
   floors satisfied).
   ═══════════════════════════════════════════════════════ */

describe("MYSTERY_DEFINITIONS — top-level registry", () => {
  it("contains at least one authored mystery (Wraith Calder)", () => {
    expect(MYSTERY_DEFINITIONS.length).toBeGreaterThan(0);
    const wraith = MYSTERY_DEFINITIONS.find((m) => m.arcId === ARC_WRAITH_CALDER);
    expect(wraith).toBeDefined();
  });

  it("has unique mystery ids", () => {
    const ids = MYSTERY_DEFINITIONS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every mystery has at least one episode", () => {
    for (const m of MYSTERY_DEFINITIONS) {
      expect(m.episodes.length, `mystery ${m.id} has no episodes`).toBeGreaterThan(0);
    }
  });
});

describe("MYSTERY_DEFINITIONS — episode integrity", () => {
  it("episode ordinals start at 1 and are strictly increasing within each mystery", () => {
    for (const m of MYSTERY_DEFINITIONS) {
      m.episodes.forEach((e, i) => {
        expect(e.ordinal, `${m.id}/${e.id} ordinal mismatch`).toBe(i + 1);
      });
    }
  });

  it("episode ids are unique per mystery", () => {
    for (const m of MYSTERY_DEFINITIONS) {
      const ids = m.episodes.map((e) => e.id);
      expect(new Set(ids).size, `${m.id} episode-id collision`).toBe(ids.length);
    }
  });

  it("clue ids are unique within each episode", () => {
    for (const m of MYSTERY_DEFINITIONS) {
      for (const e of m.episodes) {
        const ids = e.clues.map((c) => c.id);
        expect(new Set(ids).size, `${m.id}/${e.id} clue-id collision`).toBe(ids.length);
      }
    }
  });
});

describe("MYSTERY_DEFINITIONS — deduction graph integrity", () => {
  it("every deduction edge references clues that exist on the same episode", () => {
    for (const m of MYSTERY_DEFINITIONS) {
      for (const e of m.episodes) {
        const clueIds = new Set<ClueId>(e.clues.map((c) => c.id));
        for (const d of e.deductions) {
          expect(clueIds.has(d.clueA), `${m.id}/${e.id}/${d.id}: clueA missing from episode`).toBe(true);
          expect(clueIds.has(d.clueB), `${m.id}/${e.id}/${d.id}: clueB missing from episode`).toBe(true);
          if (d.clueC) {
            expect(clueIds.has(d.clueC), `${m.id}/${e.id}/${d.id}: clueC missing from episode`).toBe(true);
          }
        }
      }
    }
  });

  it("every deduction edge unlocks an episode that exists on the same mystery (when set)", () => {
    for (const m of MYSTERY_DEFINITIONS) {
      const episodeIds = new Set<EpisodeId>(m.episodes.map((e) => e.id));
      for (const e of m.episodes) {
        for (const d of e.deductions) {
          if (d.unlocksEpisode) {
            expect(episodeIds.has(d.unlocksEpisode),
              `${m.id}/${e.id}/${d.id}: unlocksEpisode references missing episode`).toBe(true);
          }
        }
      }
    }
  });

  it("at least one deduction in each episode has a 'correct' result", () => {
    for (const m of MYSTERY_DEFINITIONS) {
      for (const e of m.episodes) {
        const hasCorrect = e.deductions.some((d) => d.result === "correct");
        expect(hasCorrect,
          `${m.id}/${e.id}: no deduction with result='correct' — case is unsolvable`).toBe(true);
      }
    }
  });
});

describe("MYSTERY_DEFINITIONS — content bundles", () => {
  it("every episode ships a content bundle with required fields", () => {
    for (const m of MYSTERY_DEFINITIONS) {
      for (const e of m.episodes) {
        expect(e.contentBundle, `${m.id}/${e.id}: missing contentBundle`).toBeDefined();
        expect(e.contentBundle.songId, `${m.id}/${e.id}: missing songId`).toBeTruthy();
        expect(e.contentBundle.slideshowId, `${m.id}/${e.id}: missing slideshowId`).toBeTruthy();
        expect(e.contentBundle.dropAt, `${m.id}/${e.id}: missing dropAt`).toBeTruthy();
        expect(Array.isArray(e.contentBundle.loredexUnlocks)).toBe(true);
      }
    }
  });
});

describe("getMysteryDefinition / getEpisodeDefinition / getMysteriesForArc", () => {
  it("returns null for unknown mystery", () => {
    expect(getMysteryDefinition("mystery.does_not_exist" as MysteryId)).toBeNull();
  });

  it("returns null for unknown episode within a known mystery", () => {
    const wraith = MYSTERY_DEFINITIONS.find((m) => m.arcId === ARC_WRAITH_CALDER)!;
    expect(getEpisodeDefinition(wraith.id, "wraith.e_does_not_exist" as EpisodeId)).toBeNull();
  });

  it("getMysteriesForArc returns the Wraith arc's authored definition(s)", () => {
    const arcMysteries = getMysteriesForArc(ARC_WRAITH_CALDER);
    expect(arcMysteries.length).toBeGreaterThan(0);
    expect(arcMysteries.every((m) => m.arcId === ARC_WRAITH_CALDER)).toBe(true);
  });
});

describe("Loredex parity — every loredexUnlocks id has a catalog entry", () => {
  // Loaded inline (not at module top) so the loredex JSON only loads when
  // this describe runs. The Loredex catalog ships with the client and is
  // the source of truth for entry ids; every id referenced from
  // episodeMysteries.ts must exist in the catalog before episodes ship —
  // otherwise an episode close drops a Loredex unlock the UI cannot render.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const loredexJson = require("../client/src/data/loredex-data.json") as {
    entries: ReadonlyArray<{ id: string }>;
  };
  const known = new Set(loredexJson.entries.map((e) => e.id));

  it("every loredexUnlocks id resolves in loredex-data.json", () => {
    const missing: string[] = [];
    for (const m of MYSTERY_DEFINITIONS) {
      for (const e of m.episodes) {
        for (const id of e.contentBundle.loredexUnlocks) {
          if (!known.has(id)) {
            missing.push(`${m.id}/${e.id} → ${id}`);
          }
        }
      }
    }
    expect(
      missing,
      `Missing Loredex entries (author them in apps/client/src/data/loredex-data.json):\n  ${missing.join("\n  ")}`,
    ).toEqual([]);
  });
});

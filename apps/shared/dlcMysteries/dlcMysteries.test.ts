import { describe, it, expect } from "vitest";
import { DLC_MYSTERIES } from "./index";
import type { MysteryDefinition } from "../mysteryTypes";

const UNIVERSAL_ROOMS = new Set([
  "cryo-bay", "medical-bay", "bridge", "archives", "comms-array",
  "observation-deck", "engineering", "engineering-core", "armory",
  "cargo-hold", "captains-quarters", "forge-workshop", "antiquarian-library",
  "oracle-sanctum", "shadow-vault", "war-room", "cipher-den",
  "order-tribunal", "chaos-forge", "elemental-nexus", "quantum-lab",
  "synthesis-chamber", "station-dock", "guild-sanctum", "social-hub",
  "dreams-workshop-subbasement",
]);

const EXPECTED_IDS = [
  "charter.missing_signatory",
  "severance.bound_champion",
  "mechronis.missing_professor",
  "memorial.forgotten_names",
  "charter.second_signatory",
  "severance.infernal_clause",
  "mechronis.chained_lesson",
  "memorial.seven_watchers",
  "wolf.anara_hunt",
];

describe("DLC_MYSTERIES — well-formedness", () => {
  it("has all 9 arcs in canonical order", () => {
    expect(DLC_MYSTERIES.map((m) => m.id)).toEqual(EXPECTED_IDS);
  });

  it("each arc has exactly 5 episodes, ordinal 1–5", () => {
    for (const m of DLC_MYSTERIES) {
      expect(m.episodes.length, `${m.id} episode count`).toBe(5);
      const ordinals = m.episodes.map((e) => e.ordinal).sort();
      expect(ordinals, `${m.id} ordinals`).toEqual([1, 2, 3, 4, 5]);
    }
  });

  it("every clue is placed in a universal room", () => {
    for (const m of DLC_MYSTERIES) {
      for (const e of m.episodes) {
        for (const c of e.clues) {
          expect(
            UNIVERSAL_ROOMS.has(c.foundIn),
            `${m.id}/${e.id}/${c.id}: foundIn '${c.foundIn}' is not a universal room`,
          ).toBe(true);
        }
      }
    }
  });

  it("every episode has at least one 'correct' deduction", () => {
    for (const m of DLC_MYSTERIES) {
      for (const e of m.episodes) {
        const correct = e.deductions.filter((d) => d.result === "correct");
        expect(
          correct.length,
          `${m.id}/${e.id} has no 'correct' deduction`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("every E_n (n < 5) has at least one deduction unlocking E_(n+1)", () => {
    for (const m of DLC_MYSTERIES) {
      for (let i = 0; i < 4; i++) {
        const ep = m.episodes[i];
        const next = m.episodes[i + 1];
        const unlocks = ep.deductions.some(
          (d) => d.unlocksEpisode === next.id,
        );
        expect(
          unlocks,
          `${m.id}/${ep.id} has no deduction unlocking ${next.id}`,
        ).toBe(true);
      }
    }
  });

  it("every arc declares ≥ 4 suspects and ≥ 2 lenses", () => {
    for (const m of DLC_MYSTERIES) {
      expect(m.suspects.length, `${m.id} suspect count`).toBeGreaterThanOrEqual(4);
      expect(m.lenses.length, `${m.id} lens count`).toBeGreaterThanOrEqual(2);
    }
  });

  it("each arc has ≥ 1 'partial' deduction across the whole arc", () => {
    for (const m of DLC_MYSTERIES) {
      const partials = m.episodes.flatMap((e) =>
        e.deductions.filter((d) => d.result === "partial"),
      );
      expect(
        partials.length,
        `${m.id} has no 'partial' deductions across the arc`,
      ).toBeGreaterThan(0);
    }
  });

  it("each arc has ≥ 1 'false_lead_named' deduction across the whole arc", () => {
    for (const m of DLC_MYSTERIES) {
      const falses = m.episodes.flatMap((e) =>
        e.deductions.filter((d) => d.result === "false_lead_named"),
      );
      expect(
        falses.length,
        `${m.id} has no 'false_lead_named' deductions across the arc`,
      ).toBeGreaterThan(0);
    }
  });

  it("every deduction edge references real clues from its episode", () => {
    for (const m of DLC_MYSTERIES) {
      for (const e of m.episodes) {
        const clueIds = new Set(e.clues.map((c) => c.id as string));
        for (const d of e.deductions) {
          expect(
            clueIds.has(d.clueA as string),
            `${m.id}/${e.id}/${d.id}: clueA '${d.clueA}' not in episode clues`,
          ).toBe(true);
          // clueB may reference cross-episode clues for some deductions —
          // we accept either local or any prior episode's clue.
          const allPriorIds = new Set<string>();
          for (const ep of m.episodes) {
            if (ep.ordinal <= e.ordinal) {
              for (const c of ep.clues) allPriorIds.add(c.id as string);
            }
          }
          expect(
            allPriorIds.has(d.clueB as string),
            `${m.id}/${e.id}/${d.id}: clueB '${d.clueB}' not in episode or prior clues`,
          ).toBe(true);
        }
      }
    }
  });

  it("each arc carries ≥ 2 episode choices per episode", () => {
    for (const m of DLC_MYSTERIES) {
      for (const e of m.episodes) {
        expect(
          e.choices.length,
          `${m.id}/${e.id} choice count`,
        ).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("every episode has a content bundle with songId + slideshowId", () => {
    for (const m of DLC_MYSTERIES) {
      for (const e of m.episodes) {
        expect(e.contentBundle.songId.length).toBeGreaterThan(0);
        expect(e.contentBundle.slideshowId.length).toBeGreaterThan(0);
        // loredexUnlocks intentionally left empty until catalog
        // entries are authored — the parity check
        // `Loredex parity` in episodeMysteries.test.ts asserts
        // every named id resolves in loredex-data.json, so we
        // cannot ship promises we haven't authored.
        expect(Array.isArray(e.contentBundle.loredexUnlocks)).toBe(true);
      }
    }
  });

  it("every arc carries the manifest's seedId on .seed", () => {
    const expectedSeedIds = new Set(EXPECTED_IDS);
    for (const m of DLC_MYSTERIES) {
      expect(m.seed).toBeDefined();
      expect(m.seed!.source).toBe("manual");
      expect(expectedSeedIds.has(m.seed!.seedId)).toBe(true);
      expect(m.seed!.payload.dlcId).toBeDefined();
      expect(m.seed!.payload.sealRequired).toBeDefined();
    }
  });

  it("MysteryDefinition shape sanity (TypeScript check)", () => {
    // If this file compiles, the shape matches. Add a runtime
    // sanity check to make sure no required field was forgotten.
    for (const m of DLC_MYSTERIES) {
      const def: MysteryDefinition = m;
      expect(def.id.length).toBeGreaterThan(0);
      expect(def.arcId.length).toBeGreaterThan(0);
      expect(def.title.length).toBeGreaterThan(0);
      expect(def.summary.length).toBeGreaterThan(0);
    }
  });
});

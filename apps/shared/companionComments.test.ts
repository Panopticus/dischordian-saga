/* ═══════════════════════════════════════════════════════
   COMPANION COMMENTS — Integrity Tests

   Guarantees for the reactive companion voice line catalog:
   - Every comment has a unique id
   - Every audioDialogId is globally unique (including cross-file
     uniqueness with the narrator tier dialog)
   - Every line has non-empty text and positive duration
   - Every Human line's proximity (if present) is in [0.70, 0.95]
   - Every line's category is a valid CompanionTriggerCategory
   - No trigger string is empty
   - requiresClass is a valid class slug
   - minTrust (if present) is in [0, 100]
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";
import {
  COMPANION_COMMENTS,
  COMPANION_COMMENTS_EXISTING,
  COMPANION_COMMENTS_EXPANSION,
} from "./companionComments";
import type {
  CompanionComment,
  CompanionTriggerCategory,
} from "./companionComments";
import { ALL_NARRATOR_DIALOGS } from "./narratorDialog";
import type { NarratorScene } from "./trustTierDialogTypes";

const VALID_CATEGORIES: CompanionTriggerCategory[] = [
  "music",
  "governance",
  "lore_discovery",
  "morality",
  "voltari",
  "milestone",
  "journal",
  "combat",
  "exploration",
  "death_revival",
  "class_specific",
  "crafting",
  "card_collection",
  "trading",
  "faction_encounter",
  "idle_quiet",
  "ship_ambient",
  "trust_tier_change",
  "story_beat",
];

const VALID_CLASSES = new Set([
  "engineer",
  "oracle",
  "assassin",
  "soldier",
  "spy",
]);

function collectNarratorLineIds(): Set<string> {
  const ids = new Set<string>();
  const scenes: NarratorScene[] = ALL_NARRATOR_DIALOGS.flatMap((d) => d.scenes);
  for (const s of scenes) {
    for (const line of s.opener) ids.add(line.audioDialogId);
    for (const key of Object.keys(s.followups)) {
      for (const line of s.followups[key]) ids.add(line.audioDialogId);
    }
  }
  return ids;
}

describe("companionComments — structure", () => {
  it("catalog concatenates existing + expansion", () => {
    expect(COMPANION_COMMENTS.length).toBe(
      COMPANION_COMMENTS_EXISTING.length + COMPANION_COMMENTS_EXPANSION.length,
    );
  });

  it("catalog size meets minimum coverage bar", () => {
    expect(COMPANION_COMMENTS.length).toBeGreaterThanOrEqual(70);
  });

  it("every comment has a unique id", () => {
    const seen = new Map<string, CompanionComment>();
    for (const c of COMPANION_COMMENTS) {
      const prior = seen.get(c.id);
      expect(prior, `duplicate comment id "${c.id}"`).toBeUndefined();
      seen.set(c.id, c);
    }
  });

  it("every comment has a unique audioDialogId within companion catalog", () => {
    const seen = new Map<string, string>();
    for (const c of COMPANION_COMMENTS) {
      const prior = seen.get(c.audioDialogId);
      expect(
        prior,
        `duplicate audioDialogId "${c.audioDialogId}" on companion ids ${prior} and ${c.id}`,
      ).toBeUndefined();
      seen.set(c.audioDialogId, c.id);
    }
  });

  it("no companion audioDialogId collides with a narrator tier-dialog id", () => {
    const narratorIds = collectNarratorLineIds();
    for (const c of COMPANION_COMMENTS) {
      expect(
        narratorIds.has(c.audioDialogId),
        `companion "${c.id}" reuses narrator audioDialogId "${c.audioDialogId}"`,
      ).toBe(false);
    }
  });
});

describe("companionComments — VO metadata", () => {
  it("every line has non-empty voiceLine", () => {
    for (const c of COMPANION_COMMENTS) {
      expect(c.voiceLine.trim().length, `empty voiceLine on ${c.id}`).toBeGreaterThan(0);
    }
  });

  it("every line has a positive estimatedDurationSec", () => {
    for (const c of COMPANION_COMMENTS) {
      expect(
        c.estimatedDurationSec,
        `${c.id} has non-positive duration`,
      ).toBeGreaterThan(0);
    }
  });

  it("Human-spoken lines stay inside proximity [0.70, 0.95]", () => {
    for (const c of COMPANION_COMMENTS) {
      if (c.speaker === "human" && c.proximity !== undefined) {
        expect(c.proximity).toBeGreaterThanOrEqual(0.7);
        expect(c.proximity).toBeLessThanOrEqual(0.95);
      }
    }
  });

  it("non-Human lines do not set proximity", () => {
    for (const c of COMPANION_COMMENTS) {
      if (c.speaker !== "human") {
        expect(
          c.proximity,
          `${c.id} is ${c.speaker} but sets proximity ${c.proximity}`,
        ).toBeUndefined();
      }
    }
  });
});

describe("companionComments — enums + gates", () => {
  it("every category is a valid CompanionTriggerCategory", () => {
    for (const c of COMPANION_COMMENTS) {
      expect(
        VALID_CATEGORIES.includes(c.category),
        `${c.id} has invalid category "${c.category}"`,
      ).toBe(true);
    }
  });

  it("every trigger is non-empty", () => {
    for (const c of COMPANION_COMMENTS) {
      expect(c.trigger.trim().length, `${c.id} has empty trigger`).toBeGreaterThan(0);
    }
  });

  it("requiresClass (if present) is a known class slug", () => {
    for (const c of COMPANION_COMMENTS) {
      if (c.requiresClass) {
        expect(
          VALID_CLASSES.has(c.requiresClass),
          `${c.id} has unknown requiresClass "${c.requiresClass}"`,
        ).toBe(true);
      }
    }
  });

  it("minTrust (if present) is in [0, 100]", () => {
    for (const c of COMPANION_COMMENTS) {
      if (c.minTrust !== undefined) {
        expect(c.minTrust).toBeGreaterThanOrEqual(0);
        expect(c.minTrust).toBeLessThanOrEqual(100);
      }
    }
  });

  it("maxPlays is 1, 2, or 3", () => {
    for (const c of COMPANION_COMMENTS) {
      expect([1, 2, 3]).toContain(c.maxPlays);
    }
  });
});

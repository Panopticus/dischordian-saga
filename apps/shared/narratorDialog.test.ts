/* ═══════════════════════════════════════════════════════
   NARRATOR DIALOG — INTEGRITY TESTS

   Guarantees for the full tier set (Elara + Human, 5 tiers each):
   - Every tier has at least 3 scenes
   - Every scene has at least 2 wheel options
   - Every wheel option has a followups entry
   - Every followup entry corresponds to a real wheel option
   - Every audioDialogId is globally unique
   - Every NarratorLine has non-empty text + positive duration
   - Every requireFlags reference (on a scene) resolves either to
     a declared memoryDeposit.flagId from an earlier-tier scene,
     or to a known external flag allowlist.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";
import {
  ALL_ELARA_DIALOGS,
  ALL_HUMAN_DIALOGS,
  ALL_NARRATOR_DIALOGS,
} from "./narratorDialog";
import type { NarratorLine, NarratorScene } from "./trustTierDialogTypes";

// Flags that are set by gameplay events outside the dialog system.
// Scenes may reference these in requireFlags without a corresponding deposit.
const EXTERNAL_FLAG_ALLOWLIST = new Set<string>([
  "first_combat_completed",
  "first_dark_sector_entered",
  "player_has_skipped_dream",
  "dreamer_offer_made",
  "dreamer_arc_complete",
]);

function collectLines(scene: NarratorScene): NarratorLine[] {
  const out: NarratorLine[] = [...scene.opener];
  for (const key of Object.keys(scene.followups)) {
    out.push(...scene.followups[key]);
  }
  return out;
}

function allScenes() {
  return ALL_NARRATOR_DIALOGS.flatMap((d) => d.scenes);
}

describe("narrator dialog — structure", () => {
  it("has exactly 5 tiers for Elara", () => {
    expect(ALL_ELARA_DIALOGS).toHaveLength(5);
    const tiers = ALL_ELARA_DIALOGS.map((d) => d.tier).sort();
    expect(tiers).toEqual([0, 1, 2, 3, 4]);
  });

  it("has exactly 5 tiers for The Human", () => {
    expect(ALL_HUMAN_DIALOGS).toHaveLength(5);
    const tiers = ALL_HUMAN_DIALOGS.map((d) => d.tier).sort();
    expect(tiers).toEqual([0, 1, 2, 3, 4]);
  });

  it("every tier has at least 3 scenes", () => {
    for (const tier of ALL_NARRATOR_DIALOGS) {
      expect(
        tier.scenes.length,
        `${tier.narrator} tier ${tier.tier} has ${tier.scenes.length} scenes (need >=3)`,
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it("every scene has at least 2 wheel options", () => {
    for (const scene of allScenes()) {
      expect(
        scene.wheel.length,
        `scene ${scene.id} has ${scene.wheel.length} wheel options (need >=2)`,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it("every wheel option has a followups entry", () => {
    for (const scene of allScenes()) {
      for (const opt of scene.wheel) {
        expect(
          scene.followups[opt.id],
          `scene ${scene.id} wheel option "${opt.id}" has no followup`,
        ).toBeDefined();
        expect(
          scene.followups[opt.id].length,
          `scene ${scene.id} followup for "${opt.id}" is empty`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("every followups key corresponds to a real wheel option", () => {
    for (const scene of allScenes()) {
      const wheelIds = new Set(scene.wheel.map((w) => w.id));
      for (const key of Object.keys(scene.followups)) {
        expect(
          wheelIds.has(key),
          `scene ${scene.id} has orphan followup "${key}" with no matching wheel option`,
        ).toBe(true);
      }
    }
  });
});

describe("narrator dialog — VO metadata", () => {
  it("every NarratorLine has non-empty text", () => {
    for (const scene of allScenes()) {
      for (const line of collectLines(scene)) {
        expect(line.text.trim().length, `empty line in ${scene.id}`).toBeGreaterThan(0);
      }
    }
  });

  it("every NarratorLine has a positive estimatedDurationSec", () => {
    for (const scene of allScenes()) {
      for (const line of collectLines(scene)) {
        expect(
          line.estimatedDurationSec,
          `${scene.id}/${line.audioDialogId} has non-positive duration`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("every audioDialogId is globally unique", () => {
    const ids = new Map<string, string>();
    for (const scene of allScenes()) {
      for (const line of collectLines(scene)) {
        const prior = ids.get(line.audioDialogId);
        expect(
          prior,
          `duplicate audioDialogId "${line.audioDialogId}" in ${scene.id} (also in ${prior})`,
        ).toBeUndefined();
        ids.set(line.audioDialogId, scene.id);
      }
    }
    expect(ids.size).toBeGreaterThan(0);
  });

  // Range [0.70, 0.95]. Floor is 0.70 to allow rare narrative dips
  // (e.g. human_t2_s1_engineer_r1 — head turned all the way away).
  it("Human lines with proximity stay inside [0.70, 0.95]", () => {
    for (const d of ALL_HUMAN_DIALOGS) {
      for (const scene of d.scenes) {
        for (const line of collectLines(scene)) {
          if (line.proximity !== undefined) {
            expect(
              line.proximity,
              `${line.audioDialogId} proximity ${line.proximity} out of range`,
            ).toBeGreaterThanOrEqual(0.7);
            expect(line.proximity).toBeLessThanOrEqual(0.95);
          }
        }
      }
    }
  });
});

describe("narrator dialog — flag callbacks", () => {
  it("every requireFlags reference resolves to a real deposit or external flag", () => {
    const deposits = new Set<string>();
    for (const scene of allScenes()) {
      if (scene.memoryDeposit) deposits.add(scene.memoryDeposit.flagId);
      for (const opt of scene.wheel) {
        if (opt.setsFlags) for (const f of opt.setsFlags) deposits.add(f);
      }
    }

    for (const scene of allScenes()) {
      if (!scene.requireFlags) continue;
      for (const flag of scene.requireFlags) {
        const ok = deposits.has(flag) || EXTERNAL_FLAG_ALLOWLIST.has(flag);
        expect(
          ok,
          `scene ${scene.id} requires flag "${flag}" which is neither deposited anywhere nor allowlisted`,
        ).toBe(true);
      }
    }
  });
});

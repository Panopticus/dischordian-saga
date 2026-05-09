import { describe, expect, it } from "vitest";
import {
  CHARACTER_SPRITES,
  getCharacterSprite,
  getMouthCalibration,
} from "./characterSprites";

describe("characterSprites registry", () => {
  it("registers Elara with a viseme sheet (mouth-only overlay)", () => {
    const elara = getCharacterSprite("elara");
    expect(elara).not.toBeNull();
    expect(elara!.viseme).toBeDefined();
    expect(elara!.viseme!.cols).toBe(4);
    expect(elara!.viseme!.rows).toBe(4);
    // sil and the back vowels must point at real cell indices in [0, 16)
    expect(elara!.viseme!.map.viseme_sil).toBe(0);
    expect(elara!.viseme!.map.viseme_aa).toBeGreaterThanOrEqual(0);
    expect(elara!.viseme!.map.viseme_aa).toBeLessThan(16);
  });

  it("registers full bundles for the 7 main faction speakers", () => {
    const ids = [
      "agent_zero",
      "adjudicator_locke",
      "the_antiquarian",
      "the_source",
      "shadow_tongue",
      "the_meme",
    ];
    for (const id of ids) {
      const s = getCharacterSprite(id);
      expect(s, `missing sprite for ${id}`).not.toBeNull();
      expect(s!.viseme).toBeDefined();
      expect(s!.blink).toBeDefined();
      expect(s!.breathing).toBeDefined();
      // All NPC viseme maps must include silence + the 5 cardinal vowels
      const map = s!.viseme!.map;
      expect(map.viseme_sil).toBe(0);
      for (const v of ["viseme_aa", "viseme_E", "viseme_I", "viseme_O", "viseme_U"] as const) {
        expect(map[v], `${id}.${v} unmapped`).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("normalises NPC ids (case + dashes) when looking up", () => {
    expect(getCharacterSprite("AGENT_ZERO")).toBe(CHARACTER_SPRITES.agent_zero);
    expect(getCharacterSprite("agent-zero")).toBe(CHARACTER_SPRITES.agent_zero);
    expect(getCharacterSprite("Agent Zero")).toBe(CHARACTER_SPRITES.agent_zero);
  });

  it("returns null for unknown NPC ids", () => {
    expect(getCharacterSprite("nonexistent_npc")).toBeNull();
  });

  it("uses the canonical CDN base in every URL", () => {
    for (const sprite of Object.values(CHARACTER_SPRITES)) {
      expect(sprite.bust).toMatch(/^https:\/\/dgrsart\.s3\..*\/cdn\/client-public\/characters\//);
      if (sprite.viseme) {
        expect(sprite.viseme.url).toMatch(/^https:\/\/dgrsart\.s3\..*\/cdn\/client-public\/characters\//);
      }
    }
  });
});

describe("getMouthCalibration (audit/16 PR 13 Cos3)", () => {
  it("returns null for unknown NPCs", () => {
    expect(getMouthCalibration("not_a_real_npc")).toBeNull();
  });

  it("returns a populated record for every registered sprite", () => {
    for (const id of Object.keys(CHARACTER_SPRITES)) {
      const calibration = getMouthCalibration(id);
      expect(calibration, `${id} returned null`).not.toBeNull();
      expect(calibration!.npcId).toBe(id);
    }
  });

  it("populates visemeSheet when a viseme is wired", () => {
    const elara = getMouthCalibration("elara");
    expect(elara?.visemeSheet?.cols).toBeGreaterThan(0);
    expect(elara?.visemeSheet?.rows).toBeGreaterThan(0);
    expect(typeof elara?.visemeSheet?.url).toBe("string");
  });

  it("populates mouthBox when visemeOverlay is true", () => {
    for (const id of Object.keys(CHARACTER_SPRITES)) {
      const calibration = getMouthCalibration(id)!;
      if (calibration.visemeOverlay) {
        expect(calibration.mouthBox, `${id} overlay w/o mouthBox`).not.toBeNull();
        expect(calibration.mouthBox!.x).toBeGreaterThanOrEqual(0);
        expect(calibration.mouthBox!.x).toBeLessThanOrEqual(1);
      }
    }
  });

  it("normalizes hyphenated / cased ids (matches getCharacterSprite)", () => {
    const a = getMouthCalibration("the_human");
    const b = getMouthCalibration("The Human");
    const c = getMouthCalibration("the-human");
    expect(a?.npcId).toBe(b?.npcId);
    expect(b?.npcId).toBe(c?.npcId);
  });

  it("hasHyperViseme reflects sprite.visemeHyper presence", () => {
    for (const id of Object.keys(CHARACTER_SPRITES)) {
      const sprite = CHARACTER_SPRITES[id];
      const calibration = getMouthCalibration(id)!;
      expect(calibration.hasHyperViseme).toBe(Boolean(sprite!.visemeHyper));
    }
  });
});

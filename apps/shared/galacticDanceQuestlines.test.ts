/* ═══════════════════════════════════════════════════════
   GALACTIC DANCE QUESTLINES — Integrity Tests

   Verifies that every beat with spoken text in the six faction
   questlines (Humans, Clones, Thaloria, Insurgency, Syndicate,
   New Babylon) carries the VO metadata the studio pipeline needs.

   Also enforces cross-catalog audioDialogId uniqueness across
   narrator tier dialog + companion comments + faction questlines.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";
import { HUMANS_QUESTLINE } from "./questlineHumans";
import { CLONES_QUESTLINE } from "./questlineClones";
import { THALORIA_QUESTLINE } from "./questlineThaloria";
import { INSURGENCY_QUESTLINE } from "./questlineInsurgency";
import { SYNDICATE_QUESTLINE } from "./questlineSyndicate";
import { NEW_BABYLON_QUESTLINE } from "./questlineNewBabylon";
import type {
  PotentialQuestline,
  PotentialQuestlineBeat,
} from "./potentialQuestlineTypes";
import { ALL_NARRATOR_DIALOGS } from "./narratorDialog";
import type { NarratorScene, NarratorEmotion } from "./trustTierDialogTypes";
import { COMPANION_COMMENTS } from "./companionComments";

const GALACTIC_DANCE_QUESTLINES: PotentialQuestline[] = [
  HUMANS_QUESTLINE,
  CLONES_QUESTLINE,
  THALORIA_QUESTLINE,
  INSURGENCY_QUESTLINE,
  SYNDICATE_QUESTLINE,
  NEW_BABYLON_QUESTLINE,
];

// Valid emotions — must match NarratorEmotion enum exactly.
const VALID_EMOTIONS: NarratorEmotion[] = [
  "neutral", "warm", "curious", "amused", "cautious",
  "tender", "melancholy", "uncertain", "recognizing",
  "intimate", "menacing", "testing", "wry", "grief",
  "proud", "afraid", "confessional",
];

function collectFactionBeats(): PotentialQuestlineBeat[] {
  const out: PotentialQuestlineBeat[] = [];
  for (const q of GALACTIC_DANCE_QUESTLINES) {
    for (const ch of q.chapters) {
      for (const b of ch.opener) out.push(b);
      for (const key of Object.keys(ch.followups)) {
        for (const b of ch.followups[key]) out.push(b);
      }
    }
  }
  return out;
}

function collectNarratorAudioIds(): Set<string> {
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

describe("galactic dance questlines — VO metadata coverage", () => {
  it("includes all 6 faction questlines", () => {
    expect(GALACTIC_DANCE_QUESTLINES).toHaveLength(6);
  });

  it("every beat with spoken text has audioDialogId, emotion, and duration", () => {
    for (const beat of collectFactionBeats()) {
      if (!beat.text) continue; // stage-direction-only beats skip VO
      expect(
        beat.audioDialogId,
        `beat by ${beat.speaker} "${beat.text.slice(0, 40)}..." missing audioDialogId`,
      ).toBeTruthy();
      expect(
        beat.emotion,
        `beat ${beat.audioDialogId ?? beat.speaker} missing emotion`,
      ).toBeTruthy();
      expect(
        beat.estimatedDurationSec,
        `beat ${beat.audioDialogId ?? beat.speaker} missing estimatedDurationSec`,
      ).toBeGreaterThan(0);
    }
  });

  it("every audioDialogId starts with 'fac_'", () => {
    for (const beat of collectFactionBeats()) {
      if (!beat.audioDialogId) continue;
      expect(
        beat.audioDialogId.startsWith("fac_"),
        `audioDialogId "${beat.audioDialogId}" does not start with fac_`,
      ).toBe(true);
    }
  });

  it("every emotion is a valid NarratorEmotion", () => {
    for (const beat of collectFactionBeats()) {
      if (!beat.emotion) continue;
      expect(
        VALID_EMOTIONS.includes(beat.emotion),
        `beat ${beat.audioDialogId} has invalid emotion "${beat.emotion}"`,
      ).toBe(true);
    }
  });

  it("total faction beat count meets coverage floor", () => {
    const withText = collectFactionBeats().filter((b) => b.text);
    expect(withText.length).toBeGreaterThanOrEqual(100);
  });
});

describe("galactic dance questlines — audioDialogId uniqueness", () => {
  it("every faction audioDialogId is unique within the faction catalog", () => {
    const seen = new Map<string, string>();
    for (const beat of collectFactionBeats()) {
      if (!beat.audioDialogId) continue;
      const prior = seen.get(beat.audioDialogId);
      expect(
        prior,
        `duplicate audioDialogId "${beat.audioDialogId}" — also on ${prior}`,
      ).toBeUndefined();
      seen.set(beat.audioDialogId, beat.speaker);
    }
  });

  it("no faction audioDialogId collides with narrator tier dialog", () => {
    const narratorIds = collectNarratorAudioIds();
    for (const beat of collectFactionBeats()) {
      if (!beat.audioDialogId) continue;
      expect(
        narratorIds.has(beat.audioDialogId),
        `faction beat "${beat.audioDialogId}" collides with narrator tier dialog`,
      ).toBe(false);
    }
  });

  it("no faction audioDialogId collides with a companion comment", () => {
    const companionIds = new Set(COMPANION_COMMENTS.map((c) => c.audioDialogId));
    for (const beat of collectFactionBeats()) {
      if (!beat.audioDialogId) continue;
      expect(
        companionIds.has(beat.audioDialogId),
        `faction beat "${beat.audioDialogId}" collides with companion comment`,
      ).toBe(false);
    }
  });
});

describe("galactic dance questlines — proximity (Word/Silence)", () => {
  it("any beat with proximity is inside [0.70, 0.95]", () => {
    for (const beat of collectFactionBeats()) {
      if (beat.proximity === undefined) continue;
      expect(beat.proximity).toBeGreaterThanOrEqual(0.7);
      expect(beat.proximity).toBeLessThanOrEqual(0.95);
    }
  });

  it("The Word and The Silence beats all carry proximity", () => {
    for (const beat of collectFactionBeats()) {
      if (beat.speaker === "the_word" || beat.speaker === "the_silence") {
        expect(
          beat.proximity,
          `${beat.speaker} beat ${beat.audioDialogId} missing proximity`,
        ).toBeDefined();
      }
    }
  });
});

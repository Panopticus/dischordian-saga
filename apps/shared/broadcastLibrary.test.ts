/* ═══════════════════════════════════════════════════════
   BROADCAST LIBRARY — Integrity Tests

   Verifies VO metadata on the 30-entry broadcast interruption
   library and cross-catalog uniqueness across all five dialog
   systems (narrator + companion + faction + journal + broadcast).
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";
import {
  BROADCAST_LIBRARY,
} from "./broadcastLibrary";
import type {
  BroadcastInterruption,
  BroadcastVoice,
} from "./broadcastLibrary";
import { ALL_NARRATOR_DIALOGS } from "./narratorDialog";
import { COMPANION_COMMENTS } from "./companionComments";
import { JOURNAL_ENTRIES } from "./journalEntries";
import { HUMANS_QUESTLINE } from "./questlineHumans";
import { CLONES_QUESTLINE } from "./questlineClones";
import { THALORIA_QUESTLINE } from "./questlineThaloria";
import { INSURGENCY_QUESTLINE } from "./questlineInsurgency";
import { SYNDICATE_QUESTLINE } from "./questlineSyndicate";
import { NEW_BABYLON_QUESTLINE } from "./questlineNewBabylon";
import type { NarratorEmotion, NarratorScene } from "./trustTierDialogTypes";
import type { PotentialQuestline } from "./potentialQuestlineTypes";

const VALID_VOICES: BroadcastVoice[] = [
  "programmer",
  "antiquarian",
  "enigma",
  "programmer_wry",
  "storyteller_enigma",
];

const VALID_EMOTIONS: NarratorEmotion[] = [
  "neutral", "warm", "curious", "amused", "cautious",
  "tender", "melancholy", "uncertain", "recognizing",
  "intimate", "menacing", "testing", "wry", "grief",
  "proud", "afraid", "confessional",
];

describe("broadcast library — structure", () => {
  it("catalog size matches coverage bar (>=30)", () => {
    expect(BROADCAST_LIBRARY.length).toBeGreaterThanOrEqual(30);
  });

  it("every entry has a unique id", () => {
    const seen = new Set<string>();
    for (const b of BROADCAST_LIBRARY) {
      expect(seen.has(b.id), `duplicate entry id "${b.id}"`).toBe(false);
      seen.add(b.id);
    }
  });

  it("every entry has a valid voice", () => {
    for (const b of BROADCAST_LIBRARY) {
      expect(
        VALID_VOICES.includes(b.voice),
        `${b.id} has invalid voice "${b.voice}"`,
      ).toBe(true);
    }
  });

  it("every entry has a non-empty trigger", () => {
    for (const b of BROADCAST_LIBRARY) {
      expect(b.trigger.trim().length, `${b.id} has empty trigger`).toBeGreaterThan(0);
    }
  });

  it("non-forced entries have a probability in (0, 1]", () => {
    for (const b of BROADCAST_LIBRARY) {
      if (b.forced) continue;
      if (b.probability === undefined) continue; // triggered entries can omit
      expect(b.probability).toBeGreaterThan(0);
      expect(b.probability).toBeLessThanOrEqual(1);
    }
  });
});

describe("broadcast library — VO metadata", () => {
  it("every entry has a non-empty audioDialogId starting with bcast_", () => {
    for (const b of BROADCAST_LIBRARY) {
      expect(
        b.audioDialogId.startsWith("bcast_"),
        `${b.id} audioDialogId "${b.audioDialogId}" missing bcast_ prefix`,
      ).toBe(true);
    }
  });

  it("every entry has a non-empty text", () => {
    for (const b of BROADCAST_LIBRARY) {
      expect(b.text.trim().length, `${b.id} empty text`).toBeGreaterThan(0);
    }
  });

  it("every entry has a valid emotion", () => {
    for (const b of BROADCAST_LIBRARY) {
      expect(
        VALID_EMOTIONS.includes(b.emotion),
        `${b.id} invalid emotion "${b.emotion}"`,
      ).toBe(true);
    }
  });

  it("every entry has a positive estimatedDurationSec", () => {
    for (const b of BROADCAST_LIBRARY) {
      expect(
        b.estimatedDurationSec,
        `${b.id} non-positive duration`,
      ).toBeGreaterThan(0);
    }
  });
});

describe("broadcast library — cross-catalog uniqueness", () => {
  it("every broadcast audioDialogId is unique within the broadcast catalog", () => {
    const seen = new Map<string, string>();
    for (const b of BROADCAST_LIBRARY) {
      expect(
        seen.has(b.audioDialogId),
        `duplicate broadcast audioDialogId "${b.audioDialogId}"`,
      ).toBe(false);
      seen.set(b.audioDialogId, b.id);
    }
  });

  it("no broadcast audioDialogId collides with narrator tier dialog", () => {
    const narratorIds = new Set<string>();
    const scenes: NarratorScene[] = ALL_NARRATOR_DIALOGS.flatMap((d) => d.scenes);
    for (const s of scenes) {
      for (const l of s.opener) narratorIds.add(l.audioDialogId);
      for (const key of Object.keys(s.followups)) {
        for (const l of s.followups[key]) narratorIds.add(l.audioDialogId);
      }
    }
    for (const b of BROADCAST_LIBRARY) {
      expect(
        narratorIds.has(b.audioDialogId),
        `broadcast ${b.id} collides with narrator tier dialog`,
      ).toBe(false);
    }
  });

  it("no broadcast audioDialogId collides with a companion comment", () => {
    const companionIds = new Set(COMPANION_COMMENTS.map((c) => c.audioDialogId));
    for (const b of BROADCAST_LIBRARY) {
      expect(
        companionIds.has(b.audioDialogId),
        `broadcast ${b.id} collides with companion comment`,
      ).toBe(false);
    }
  });

  it("no broadcast audioDialogId collides with a faction questline beat", () => {
    const factionIds = new Set<string>();
    const questlines: PotentialQuestline[] = [
      HUMANS_QUESTLINE,
      CLONES_QUESTLINE,
      THALORIA_QUESTLINE,
      INSURGENCY_QUESTLINE,
      SYNDICATE_QUESTLINE,
      NEW_BABYLON_QUESTLINE,
    ];
    for (const q of questlines) {
      for (const ch of q.chapters) {
        for (const beat of ch.opener) if (beat.audioDialogId) factionIds.add(beat.audioDialogId);
        for (const k of Object.keys(ch.followups)) {
          for (const beat of ch.followups[k]) if (beat.audioDialogId) factionIds.add(beat.audioDialogId);
        }
      }
    }
    for (const b of BROADCAST_LIBRARY) {
      expect(
        factionIds.has(b.audioDialogId),
        `broadcast ${b.id} collides with faction questline beat`,
      ).toBe(false);
    }
  });

  it("no broadcast audioDialogId collides with a journal paragraph", () => {
    const journalIds = new Set<string>();
    for (const e of JOURNAL_ENTRIES) {
      for (const p of e.paragraphs) journalIds.add(p.audioDialogId);
    }
    for (const b of BROADCAST_LIBRARY) {
      expect(
        journalIds.has(b.audioDialogId),
        `broadcast ${b.id} collides with journal paragraph`,
      ).toBe(false);
    }
  });
});

describe("broadcast library — voice distribution", () => {
  it("has entries for programmer, antiquarian, and enigma voices", () => {
    const voices = new Set(BROADCAST_LIBRARY.map((b) => b.voice));
    // Normalize variant voices to base voices for the coverage check
    const baseVoices = new Set<string>();
    for (const v of voices) {
      if (v === "programmer" || v === "programmer_wry") baseVoices.add("programmer");
      else if (v === "enigma" || v === "storyteller_enigma") baseVoices.add("enigma");
      else baseVoices.add(v);
    }
    expect(baseVoices.has("programmer")).toBe(true);
    expect(baseVoices.has("antiquarian")).toBe(true);
    expect(baseVoices.has("enigma")).toBe(true);
  });

  it("has at least one forced entry for first-time onboarding", () => {
    const forced = BROADCAST_LIBRARY.filter((b) => b.forced);
    expect(forced.length).toBeGreaterThanOrEqual(1);
  });
});

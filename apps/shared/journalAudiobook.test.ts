/* ═══════════════════════════════════════════════════════
   ANTIQUARIAN JOURNAL AUDIOBOOK — Integrity Tests

   Verifies paragraph-level VO metadata, cross-catalog
   audioDialogId uniqueness, and structural invariants for
   the journal audiobook catalog.
   ═══════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";
import {
  JOURNAL_ENTRIES,
  JOURNAL_ENTRIES_ORIGINAL,
  JOURNAL_ENTRIES_EXPANSION,
} from "./journalEntries";
import type {
  AntiquarianJournalEntry,
  JournalEpoch,
  JournalVoiceActor,
  JournalParagraph,
} from "./journalEntries";
import { ALL_NARRATOR_DIALOGS } from "./narratorDialog";
import { COMPANION_COMMENTS } from "./companionComments";
import { HUMANS_QUESTLINE } from "./questlineHumans";
import { CLONES_QUESTLINE } from "./questlineClones";
import { THALORIA_QUESTLINE } from "./questlineThaloria";
import { INSURGENCY_QUESTLINE } from "./questlineInsurgency";
import { SYNDICATE_QUESTLINE } from "./questlineSyndicate";
import { NEW_BABYLON_QUESTLINE } from "./questlineNewBabylon";
import type { NarratorEmotion, NarratorScene } from "./trustTierDialogTypes";
import type { PotentialQuestline } from "./potentialQuestlineTypes";

const VALID_EPOCHS: JournalEpoch[] = [
  "foundation",
  "age_of_privacy",
  "age_of_prophecy",
  "age_of_insurgency",
  "age_of_revelation",
  "fall_of_reality",
];

const VALID_VOICE_ACTORS: JournalVoiceActor[] = [
  "antiquarian",
  "elara",
  "human",
  "enigma",
];

const VALID_EMOTIONS: NarratorEmotion[] = [
  "neutral", "warm", "curious", "amused", "cautious",
  "tender", "melancholy", "uncertain", "recognizing",
  "intimate", "menacing", "testing", "wry", "grief",
  "proud", "afraid", "confessional",
];

function allParagraphs(): JournalParagraph[] {
  return JOURNAL_ENTRIES.flatMap((e) => e.paragraphs);
}

describe("journal audiobook — structure", () => {
  it("catalog concatenates original + expansion", () => {
    expect(JOURNAL_ENTRIES.length).toBe(
      JOURNAL_ENTRIES_ORIGINAL.length + JOURNAL_ENTRIES_EXPANSION.length,
    );
  });

  it("catalog size meets minimum coverage bar", () => {
    expect(JOURNAL_ENTRIES.length).toBeGreaterThanOrEqual(10);
  });

  it("every entry has a unique id", () => {
    const seen = new Set<string>();
    for (const e of JOURNAL_ENTRIES) {
      expect(seen.has(e.id), `duplicate entry id "${e.id}"`).toBe(false);
      seen.add(e.id);
    }
  });

  it("every entry has a valid epoch", () => {
    for (const e of JOURNAL_ENTRIES) {
      expect(VALID_EPOCHS.includes(e.epoch), `${e.id} invalid epoch ${e.epoch}`).toBe(true);
    }
  });

  it("every entry has a valid voiceActor", () => {
    for (const e of JOURNAL_ENTRIES) {
      expect(
        VALID_VOICE_ACTORS.includes(e.voiceActor),
        `${e.id} invalid voiceActor ${e.voiceActor}`,
      ).toBe(true);
    }
  });

  it("every entry has a non-empty textContent", () => {
    for (const e of JOURNAL_ENTRIES) {
      expect(e.textContent.trim().length, `${e.id} empty textContent`).toBeGreaterThan(0);
    }
  });

  it("every entry has at least one paragraph", () => {
    for (const e of JOURNAL_ENTRIES) {
      expect(e.paragraphs.length, `${e.id} has no paragraphs`).toBeGreaterThan(0);
    }
  });

  it("entry totalDurationSec matches sum of paragraph durations (tolerance 0.2s)", () => {
    for (const e of JOURNAL_ENTRIES) {
      const sum = e.paragraphs.reduce((a, p) => a + p.estimatedDurationSec, 0);
      expect(
        Math.abs(sum - e.totalDurationSec),
        `${e.id} totalDurationSec ${e.totalDurationSec} != sum ${sum}`,
      ).toBeLessThan(0.2);
    }
  });

  it("covers at least 4 distinct epochs", () => {
    const seen = new Set(JOURNAL_ENTRIES.map((e) => e.epoch));
    expect(seen.size).toBeGreaterThanOrEqual(4);
  });
});

describe("journal audiobook — paragraph VO metadata", () => {
  it("every paragraph has a non-empty audioDialogId", () => {
    for (const p of allParagraphs()) {
      expect(p.audioDialogId.trim().length, "empty audioDialogId").toBeGreaterThan(0);
    }
  });

  it("every paragraph audioDialogId starts with 'jrnl_'", () => {
    for (const p of allParagraphs()) {
      expect(
        p.audioDialogId.startsWith("jrnl_"),
        `"${p.audioDialogId}" missing jrnl_ prefix`,
      ).toBe(true);
    }
  });

  it("every paragraph has non-empty text", () => {
    for (const p of allParagraphs()) {
      expect(p.text.trim().length, `${p.audioDialogId} empty text`).toBeGreaterThan(0);
    }
  });

  it("every paragraph has a valid emotion", () => {
    for (const p of allParagraphs()) {
      expect(
        VALID_EMOTIONS.includes(p.emotion),
        `${p.audioDialogId} invalid emotion ${p.emotion}`,
      ).toBe(true);
    }
  });

  it("every paragraph has a positive estimatedDurationSec", () => {
    for (const p of allParagraphs()) {
      expect(
        p.estimatedDurationSec,
        `${p.audioDialogId} non-positive duration`,
      ).toBeGreaterThan(0);
    }
  });
});

describe("journal audiobook — cross-catalog uniqueness", () => {
  it("every journal audioDialogId is unique within the journal catalog", () => {
    const seen = new Map<string, string>();
    for (const p of allParagraphs()) {
      expect(
        seen.has(p.audioDialogId),
        `duplicate journal audioDialogId "${p.audioDialogId}" (also on ${seen.get(p.audioDialogId)})`,
      ).toBe(false);
      seen.set(p.audioDialogId, p.audioDialogId);
    }
  });

  it("no journal audioDialogId collides with narrator tier dialog", () => {
    const narratorIds = new Set<string>();
    const scenes: NarratorScene[] = ALL_NARRATOR_DIALOGS.flatMap((d) => d.scenes);
    for (const s of scenes) {
      for (const l of s.opener) narratorIds.add(l.audioDialogId);
      for (const key of Object.keys(s.followups)) {
        for (const l of s.followups[key]) narratorIds.add(l.audioDialogId);
      }
    }
    for (const p of allParagraphs()) {
      expect(
        narratorIds.has(p.audioDialogId),
        `journal paragraph "${p.audioDialogId}" collides with narrator tier dialog`,
      ).toBe(false);
    }
  });

  it("no journal audioDialogId collides with a companion comment", () => {
    const companionIds = new Set(COMPANION_COMMENTS.map((c) => c.audioDialogId));
    for (const p of allParagraphs()) {
      expect(
        companionIds.has(p.audioDialogId),
        `journal paragraph "${p.audioDialogId}" collides with companion comment`,
      ).toBe(false);
    }
  });

  it("no journal audioDialogId collides with a faction questline beat", () => {
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
        for (const b of ch.opener) if (b.audioDialogId) factionIds.add(b.audioDialogId);
        for (const k of Object.keys(ch.followups)) {
          for (const b of ch.followups[k]) if (b.audioDialogId) factionIds.add(b.audioDialogId);
        }
      }
    }
    for (const p of allParagraphs()) {
      expect(
        factionIds.has(p.audioDialogId),
        `journal paragraph "${p.audioDialogId}" collides with faction questline beat`,
      ).toBe(false);
    }
  });
});

describe("journal audiobook — multi-voice coverage", () => {
  it("has at least one entry read by elara", () => {
    expect(JOURNAL_ENTRIES.some((e) => e.voiceActor === "elara")).toBe(true);
  });

  it("has at least one entry read by the human", () => {
    expect(JOURNAL_ENTRIES.some((e) => e.voiceActor === "human")).toBe(true);
  });
});

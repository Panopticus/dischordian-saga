import { describe, expect, it } from "vitest";
import {
  parseChatAction,
  factionVocabulary,
  isoWeekKey,
  FACTION_VOCABULARY,
  INNER_VOICE_LABELS,
  CALLING_OPTIONS,
  PRONOUN_OPTIONS,
} from "./roleplayChat";

describe("parseChatAction", () => {
  it("treats plain text as a 'say'", () => {
    const r = parseChatAction("hello world");
    expect(r.mode).toBe("say");
    expect(r.body).toBe("hello world");
  });

  it("recognises /me as an emote", () => {
    const r = parseChatAction("/me draws her cipher-knife");
    expect(r.mode).toBe("emote");
    expect(r.body).toBe("draws her cipher-knife");
  });

  it("recognises /em and /emote as emote aliases", () => {
    expect(parseChatAction("/em waves").mode).toBe("emote");
    expect(parseChatAction("/emote waves").mode).toBe("emote");
  });

  it("parses /whisper recipient body", () => {
    const r = parseChatAction("/whisper Elara The map. I have it.");
    expect(r.mode).toBe("whisper");
    expect(r.whisperTo).toBe("Elara");
    expect(r.body).toBe("The map. I have it.");
  });

  it("treats /w and /tell as whisper aliases", () => {
    expect(parseChatAction("/w Locke shh").mode).toBe("whisper");
    expect(parseChatAction("/tell Locke shh").mode).toBe("whisper");
  });

  it("recognises /ic and /ooc tags", () => {
    expect(parseChatAction("/ic Approach.").mode).toBe("ic");
    expect(parseChatAction("/ooc brb").mode).toBe("ooc");
  });

  it("strips leading/trailing whitespace", () => {
    const r = parseChatAction("   /me bows   ");
    expect(r.mode).toBe("emote");
    expect(r.body).toBe("bows");
  });

  it("falls through to say for unknown slash commands", () => {
    const r = parseChatAction("/notarealcommand whatever");
    expect(r.mode).toBe("say");
    expect(r.body).toBe("/notarealcommand whatever");
  });

  it("treats whisper without a body as say (so the user notices)", () => {
    const r = parseChatAction("/whisper Elara");
    expect(r.mode).toBe("say");
  });
});

describe("factionVocabulary", () => {
  it("renames treasury per faction", () => {
    expect(factionVocabulary("empire").treasury).toBe("Tithe");
    expect(factionVocabulary("insurgency").treasury).toBe("Cache");
    expect(factionVocabulary("witness").treasury).toBe("Reliquary");
    expect(factionVocabulary("neutral").treasury).toBe("Treasury");
  });

  it("falls back to neutral for unknown / null faction", () => {
    expect(factionVocabulary(null)).toBe(FACTION_VOCABULARY.neutral);
    expect(factionVocabulary(undefined)).toBe(FACTION_VOCABULARY.neutral);
    expect(factionVocabulary("xenos")).toBe(FACTION_VOCABULARY.neutral);
  });

  it("renames cell vocabulary distinctly per faction", () => {
    const cells = new Set([
      factionVocabulary("empire").cell,
      factionVocabulary("insurgency").cell,
      factionVocabulary("witness").cell,
      factionVocabulary("neutral").cell,
    ]);
    // All four should be distinct.
    expect(cells.size).toBe(4);
  });
});

describe("isoWeekKey", () => {
  it("returns YYYY-Www format", () => {
    const key = isoWeekKey(new Date("2026-05-08T12:00:00Z"));
    expect(key).toMatch(/^\d{4}-W\d{2}$/);
  });

  it("uses ISO-8601 week numbering (Mon-Sun, Thursday rule)", () => {
    // Jan 1 2024 is a Monday — ISO week 1.
    expect(isoWeekKey(new Date("2024-01-01T12:00:00Z"))).toBe("2024-W01");
    // Dec 31 2023 is a Sunday — belongs to ISO week 52 of 2023.
    expect(isoWeekKey(new Date("2023-12-31T12:00:00Z"))).toBe("2023-W52");
    // Dec 30 2024 is a Monday — ISO week 1 of 2025 (year-rollover edge).
    expect(isoWeekKey(new Date("2024-12-30T12:00:00Z"))).toBe("2025-W01");
  });

  it("is stable across an instant", () => {
    const t = new Date("2026-05-08T00:00:00Z");
    expect(isoWeekKey(t)).toBe(isoWeekKey(t));
  });
});

describe("constants", () => {
  it("exposes all 7 inner-voice labels", () => {
    expect(Object.keys(INNER_VOICE_LABELS)).toHaveLength(7);
  });

  it("exposes a non-empty options menu for callings and pronouns", () => {
    expect(CALLING_OPTIONS.length).toBeGreaterThan(0);
    expect(PRONOUN_OPTIONS.length).toBeGreaterThan(0);
  });
});

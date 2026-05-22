import { describe, expect, it } from "vitest";

import { hasStageDirection, spokenText } from "./voSpokenText";

describe("spokenText", () => {
  it("strips a single leading [CUE …] block", () => {
    expect(spokenText("[CUE 0:00] The Ark draws a long breath.")).toBe(
      "The Ark draws a long breath.",
    );
  });

  it("strips an adjacent run of bracket prefixes", () => {
    expect(
      spokenText(
        "[CUE 0:08] [Voice direction: warm, allow breath at line ends.] You chose Humanity.",
      ),
    ).toBe("You chose Humanity.");
  });

  it("strips a [SPOKEN] producer marker", () => {
    expect(spokenText("[SPOKEN]\nLog one. Test chamber B-twelve.")).toBe(
      "Log one. Test chamber B-twelve.",
    );
  });

  it("strips a mid-line cue between sentences", () => {
    expect(
      spokenText(
        "The Ark holds. [CUE 1:08] The Array breathes.",
      ),
    ).toBe("The Ark holds. The Array breathes.");
  });

  it("leaves in-line parentheticals alone — they are part of the line", () => {
    const line =
      "A drawer surfaces a card titled 'IRON LION (callsign) — see ep5-12.'";
    expect(spokenText(line)).toBe(line);
  });

  it("is idempotent", () => {
    const once = spokenText("[CUE 0:00] [Reverb on.] Welcome back.");
    const twice = spokenText(once);
    expect(twice).toBe(once);
    expect(twice).toBe("Welcome back.");
  });

  it("returns the same string when no direction is present", () => {
    expect(spokenText("Welcome back. I missed you.")).toBe(
      "Welcome back. I missed you.",
    );
  });

  it("returns empty input untouched", () => {
    expect(spokenText("")).toBe("");
  });

  it("keeps a wholly-bracketed line intact — that bracket IS the line", () => {
    // Narrator-action beats like a Hierophant first-meeting opener
    // are authored entirely as bracket-wrapped stage direction
    // because the narrator describes the action. Stripping them would
    // ship the player a blank dialog bubble.
    const line =
      "[The Hierophant does not look up. The pen continues — a name is being written.]";
    expect(spokenText(line)).toBe(line);
  });

  it("strips an asterisk-wrapped stage direction at the start of a line", () => {
    // Real leak from apps/scripts/apprentice-zealot-*-lines.json.
    // ElevenLabs would otherwise read "She unfolds the paper" as
    // part of the spoken dialog.
    expect(
      spokenText(
        "*She unfolds the paper.* I came to the Cause hungry. I leave it fed.",
      ),
    ).toBe("I came to the Cause hungry. I leave it fed.");
  });

  it("strips an asterisk-wrapped stage direction at the end of a line", () => {
    expect(
      spokenText("I came home. *She closes the door behind us.*"),
    ).toBe("I came home.");
  });

  it("keeps italics emphasis — drops only the asterisks, not the word", () => {
    // Single-word and multi-word italics from
    // apps/scripts/apprentice-{zealot,artisan}-*-lines.json and
    // npc-the_antiquarian-lines.json.
    expect(spokenText("About the *Cause* — never.")).toBe(
      "About the Cause — never.",
    );
    expect(spokenText("reminds me what I'm calibrating *for*.")).toBe(
      "reminds me what I'm calibrating for.",
    );
    expect(
      spokenText("The Refuge calls it the *unread first citation*."),
    ).toBe("The Refuge calls it the unread first citation.");
  });

  it("keeps an asterisk-wrapped interjection without terminal punctuation", () => {
    // `*okay,*` is emphasis, not a stage direction.
    expect(spokenText("*okay,* I'm listening.")).toBe(
      "okay, I'm listening.",
    );
  });

  it("handles mixed asterisk usage in one line", () => {
    expect(
      spokenText(
        "*She unfolds the paper.* About the *Cause* — never. *He sighs.*",
      ),
    ).toBe("About the Cause — never.");
  });

  it("does NOT silently 'fix' prose-level whitespace typos in lines with no stage direction", () => {
    // Real entries from apps/scripts/loredex-narrator-lines.json
    // were authored with `Word , Word` and `Word. . Word` typos.
    // The normaliser must not touch them — that's outside its scope
    // (and would make hasStageDirection() report false positives,
    // forcing thousands of clean lines to be re-rendered).
    const typo = "Insurgency , renowned for her unparalleled infiltration.";
    expect(spokenText(typo)).toBe(typo);
    expect(hasStageDirection(typo)).toBe(false);

    const doublePeriod = "The Engineer. . The Engineer was one of the originals.";
    expect(spokenText(doublePeriod)).toBe(doublePeriod);
    expect(hasStageDirection(doublePeriod)).toBe(false);
  });
});

describe("hasStageDirection", () => {
  it("flags any text whose spoken form differs from its trim", () => {
    expect(hasStageDirection("[CUE 0:00] Welcome back.")).toBe(true);
    expect(hasStageDirection("Welcome back.")).toBe(false);
    expect(hasStageDirection("")).toBe(false);
  });
});

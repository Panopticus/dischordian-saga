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
});

describe("hasStageDirection", () => {
  it("flags any text whose spoken form differs from its trim", () => {
    expect(hasStageDirection("[CUE 0:00] Welcome back.")).toBe(true);
    expect(hasStageDirection("Welcome back.")).toBe(false);
    expect(hasStageDirection("")).toBe(false);
  });
});

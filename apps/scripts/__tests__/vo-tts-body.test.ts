/**
 * Regression guard for the VO direction-text contamination bug.
 *
 * Two of the per-source VO generators used to concatenate the
 * per-speaker `text_prefix` (italicised stage directions like
 * `*spoken low and steady, conspiratorial*`) onto the spoken line
 * and feed the whole string to ElevenLabs. The actor read the
 * directions aloud.
 *
 * The fix funnels both generators through buildTtsBody() in
 * lib/tts-body.ts. This test asserts:
 *
 *   • buildTtsBody never returns a string containing italic/bracket
 *     stage-direction markers, even when given pathological input.
 *   • Every speaker's `voiceDirection` documentation field would
 *     produce zero spoken-aloud text if it ever leaked into the
 *     body (defence-in-depth — the field is documentation only,
 *     never sent to TTS, but if someone reintroduces the
 *     concatenation bug, the test fails immediately).
 *   • tuneFromDirection translates the most obvious prose intents
 *     into the expected numeric nudges so the prose and the
 *     numbers stay aligned.
 */
import { describe, it, expect } from "vitest";

import {
  EPISODE_SPEAKER_VOICES,
  DEFAULT_EPISODE_VOICE,
} from "../episode-voice-config";
import {
  applyDelta,
  buildTtsBody,
  tuneFromDirection,
} from "../lib/tts-body";

describe("buildTtsBody", () => {
  it("strips *italic stage directions* from the body", () => {
    const out = buildTtsBody({
      text: "*spoken low and steady, conspiratorial* The walls remember.",
    });
    expect(out).not.toContain("*");
    expect(out).toBe("The walls remember.");
  });

  it("strips (parenthetical asides) from the body", () => {
    const out = buildTtsBody({
      text: "(quiet) Take the slate. (kneeling) The floor remembers.",
    });
    expect(out).not.toContain("(");
    expect(out).not.toContain(")");
    expect(out).toBe("Take the slate. The floor remembers.");
  });

  it("strips [bracketed CUE markers and VO directions]", () => {
    const out = buildTtsBody({
      text: "[CUE 0:00] The first word. [VO: rising] The second.",
    });
    expect(out).not.toContain("[");
    expect(out).not.toContain("]");
    expect(out).toBe("The first word. The second.");
  });

  it("collapses whitespace and trims after stripping", () => {
    const out = buildTtsBody({
      text: "   *foo*    Hello   *bar*    world.   ",
    });
    expect(out).toBe("Hello world.");
  });

  it("returns clean line.text unchanged", () => {
    const out = buildTtsBody({
      text: "She placed it for whoever woke last. That was supposed to be me.",
    });
    expect(out).toBe(
      "She placed it for whoever woke last. That was supposed to be me.",
    );
  });
});

describe("voiceDirection never contaminates the TTS body", () => {
  // Belt-and-braces. The episode-voice-config + content-pass
  // SPEAKER_SETTINGS describe per-speaker delivery in prose. Those
  // strings are documentation only — but if someone ever
  // reintroduces the prefix-concatenation bug, this test catches
  // the result the moment it ships.
  it("buildTtsBody scrubs every authored voiceDirection if pasted in", () => {
    const samples = [
      ...Object.values(EPISODE_SPEAKER_VOICES).map((v) => v.voiceDirection),
      DEFAULT_EPISODE_VOICE.voiceDirection,
    ];
    for (const direction of samples) {
      const contaminated = `${direction} The Ark remembers.`;
      const out = buildTtsBody({ text: contaminated });
      expect(out, `direction leaked: ${direction}`).toBe("The Ark remembers.");
    }
  });
});

describe("tuneFromDirection", () => {
  it("returns an empty delta for empty/missing direction", () => {
    expect(tuneFromDirection(undefined)).toEqual({});
    expect(tuneFromDirection("")).toEqual({});
  });

  it("low-and-steady raises stability and lowers style", () => {
    const delta = tuneFromDirection(
      "*spoken low and steady, conspiratorial, never raises* ",
    );
    expect(delta.stability).toBeGreaterThanOrEqual(0.65);
    expect(delta.style).toBeLessThanOrEqual(0.15);
  });

  it("laconic / long-pauses behaves like low-and-steady", () => {
    const delta = tuneFromDirection(
      "*laconic gunfighter cadence; long pauses* ",
    );
    expect(delta.stability).toBeGreaterThanOrEqual(0.65);
    expect(delta.style).toBeLessThanOrEqual(0.15);
  });

  it("theological / present-tense raises style", () => {
    const delta = tuneFromDirection(
      "*theological present-tense; permeable phrases* ",
    );
    expect(delta.style).toBeGreaterThanOrEqual(0.4);
  });

  it("meticulous / precise / archival raises stability and lowers style", () => {
    const delta = tuneFromDirection(
      "*meticulous, precise, archival* ",
    );
    expect(delta.stability).toBeGreaterThanOrEqual(0.65);
    expect(delta.style).toBeLessThanOrEqual(0.18);
  });
});

describe("applyDelta", () => {
  const base = {
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.25,
    use_speaker_boost: true,
  };

  it("returns base values when delta is empty", () => {
    expect(applyDelta(base, {})).toEqual(base);
  });

  it("overrides only the specified fields", () => {
    const out = applyDelta(base, { stability: 0.7 });
    expect(out.stability).toBe(0.7);
    expect(out.similarity_boost).toBe(0.78);
    expect(out.style).toBe(0.25);
    expect(out.use_speaker_boost).toBe(true);
  });

  it("preserves use_speaker_boost regardless of delta", () => {
    const out = applyDelta({ ...base, use_speaker_boost: false }, { style: 0.5 });
    expect(out.use_speaker_boost).toBe(false);
    expect(out.style).toBe(0.5);
  });
});

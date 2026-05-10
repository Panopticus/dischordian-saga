import { describe, expect, it } from "vitest";
import { ALL_EMERGENT_EVENTS } from "@shared/livingUniverseEvents";

/* The 2026-05-10 producer drop ships reveal cutscenes for the
 * five flagship emergent events. This test pins which events
 * carry a cutscene URL and what filename they map to, so the
 * coverage probe and any future event additions stay honest
 * about which entries actually have a producer-delivered cut. */

const EXPECTED_CUTSCENES: Readonly<Record<string, string>> = {
  necromancer_return: "videos/events/necromancer_returns.mp4",
  dreamer_awakening: "videos/events/dreamer_awakens.mp4",
  terminus_advance: "videos/events/terminus_advance.mp4",
  antiquarian_revelation: "videos/events/antiquarian_reveals.mp4",
  shadow_tongue_edit: "videos/events/shadow_tongue_edits.mp4",
};

describe("livingUniverseEvents — reveal cutscenes", () => {
  it("the 5 flagship events expose a cutsceneVideoRelPath", () => {
    for (const [eventId, expectedPath] of Object.entries(EXPECTED_CUTSCENES)) {
      const event = ALL_EMERGENT_EVENTS.find((e) => e.id === eventId);
      expect(event, `event ${eventId} should be registered`).toBeDefined();
      expect(event?.cutsceneVideoRelPath).toBe(expectedPath);
    }
  });

  it("non-flagship events do not silently claim a cutscene", () => {
    for (const event of ALL_EMERGENT_EVENTS) {
      if (EXPECTED_CUTSCENES[event.id]) continue;
      expect(
        event.cutsceneVideoRelPath,
        `event ${event.id} unexpectedly carries cutsceneVideoRelPath ${event.cutsceneVideoRelPath}`,
      ).toBeUndefined();
    }
  });
});

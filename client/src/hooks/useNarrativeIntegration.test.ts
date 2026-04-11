import { describe, it, expect } from "vitest";
import { SLIDESHOW_TRIGGERS } from "./useNarrativeIntegration";
import { getSlideshow } from "@shared/songSlideshows";

describe("useNarrativeIntegration.SLIDESHOW_TRIGGERS", () => {
  it("has at least the four P0 rows from the §5.5 priority list", () => {
    const ids = SLIDESHOW_TRIGGERS.map((t) => t.slideshowId);
    expect(ids).toContain("last-words");
    expect(ids).toContain("welcome-to-celebration");
    expect(ids).toContain("to-be-the-human");
    expect(ids).toContain("i-am-the-eyes-that-watch");
  });

  it("has the Two Witnesses Meet trigger wired to bond_80_mutual_peak", () => {
    const entry = SLIDESHOW_TRIGGERS.find(
      (t) => t.slideshowId === "two-witnesses-meet",
    );
    expect(entry).toBeDefined();
    expect(entry?.triggerFlag).toBe("bond_80_mutual_peak");
    expect(entry?.completionFlag).toBe("slideshow_two_witnesses_meet_complete");
  });

  it("has the Thaloria cinematic trigger wired to thaloria_cinematic_unlocked", () => {
    const entry = SLIDESHOW_TRIGGERS.find(
      (t) => t.slideshowId === "the-helmet-in-the-grass",
    );
    expect(entry).toBeDefined();
    expect(entry?.triggerFlag).toBe("thaloria_cinematic_unlocked");
    expect(entry?.completionFlag).toBe("slideshow_the_helmet_in_the_grass_complete");
  });

  it("has Superman Ain't Coming wired to the asymmetric Human confession flag", () => {
    const entry = SLIDESHOW_TRIGGERS.find(
      (t) => t.slideshowId === "superman-aint-coming",
    );
    expect(entry).toBeDefined();
    expect(entry?.triggerFlag).toBe("human_dark_confession_unlocked");
  });

  it("has It Ain't Been the Same wired to the Elara high-trust confession flag", () => {
    const entry = SLIDESHOW_TRIGGERS.find(
      (t) => t.slideshowId === "it-aint-been-the-same",
    );
    expect(entry).toBeDefined();
    expect(entry?.triggerFlag).toBe("elara_high_confession_unlocked");
  });

  it("every slideshow id resolves to a registered slideshow", () => {
    for (const trigger of SLIDESHOW_TRIGGERS) {
      const def = getSlideshow(trigger.slideshowId);
      expect(def, `Missing slideshow: ${trigger.slideshowId}`).toBeDefined();
    }
  });

  it("every completion flag matches the slideshow's flagsSetOnComplete", () => {
    for (const trigger of SLIDESHOW_TRIGGERS) {
      const def = getSlideshow(trigger.slideshowId);
      expect(def).toBeDefined();
      if (!def) continue;
      expect(
        def.flagsSetOnComplete,
        `${trigger.slideshowId} must declare ${trigger.completionFlag}`,
      ).toContain(trigger.completionFlag);
    }
  });

  it("no slideshow can trigger itself (no causal loops)", () => {
    for (const trigger of SLIDESHOW_TRIGGERS) {
      const def = getSlideshow(trigger.slideshowId);
      if (!def) continue;
      expect(
        def.flagsSetOnComplete,
        `${trigger.slideshowId} must not set its own trigger`,
      ).not.toContain(trigger.triggerFlag);
    }
  });

  it("trigger flags are unique across rows", () => {
    const triggers = SLIDESHOW_TRIGGERS.map((t) => t.triggerFlag);
    expect(new Set(triggers).size).toBe(triggers.length);
  });

  it("slideshow ids are unique across rows", () => {
    const ids = SLIDESHOW_TRIGGERS.map((t) => t.slideshowId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("completion flags are unique across rows", () => {
    const completions = SLIDESHOW_TRIGGERS.map((t) => t.completionFlag);
    expect(new Set(completions).size).toBe(completions.length);
  });

  it("Last Words is still wired to act_1_complete", () => {
    const lastWords = SLIDESHOW_TRIGGERS.find(
      (t) => t.slideshowId === "last-words",
    );
    expect(lastWords?.triggerFlag).toBe("act_1_complete");
    expect(lastWords?.completionFlag).toBe("slideshow_last_words_complete");
  });
});

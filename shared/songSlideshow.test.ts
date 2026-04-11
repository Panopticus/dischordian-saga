import { describe, it, expect } from "vitest";
import {
  getActiveOverlays,
  getFrameAt,
  getLyricAt,
  validateSlideshow,
  type SongSlideshowDef,
} from "./songSlideshow";
import {
  getSlideshow,
  HACKING_REALITY_SLIDESHOW,
  I_AM_THE_EYES_SLIDESHOW,
  LAST_WORDS_SLIDESHOW,
  listSlideshows,
  OCULARUM_SLIDESHOW,
  SONG_SLIDESHOWS,
  THE_LION_IN_BLACK_SLIDESHOW,
  THE_PRISONER_SLIDESHOW,
  TO_BE_THE_HUMAN_SLIDESHOW,
  TWO_WITNESSES_MEET_SLIDESHOW,
  WELCOME_TO_CELEBRATION_SLIDESHOW,
} from "./songSlideshows";

function makeMinimalSlideshow(overrides: Partial<SongSlideshowDef> = {}): SongSlideshowDef {
  return {
    id: "t",
    songId: "t",
    audioUrl: "/a",
    durationMs: 4000,
    title: "T",
    priority: "P0",
    frames: [
      { startMs: 0, endMs: 2000, imageUrl: "/f1", transition: "fade" },
      { startMs: 2000, endMs: 4000, imageUrl: "/f2", transition: "fade" },
    ],
    reducedMotionFallback: {
      heroImageUrl: "/hero",
      prose: "summary",
    },
    ...overrides,
  };
}

describe("songSlideshow validation", () => {
  it("passes a minimal two-frame slideshow", () => {
    expect(validateSlideshow(makeMinimalSlideshow())).toEqual([]);
  });

  it("catches empty frames", () => {
    const issues = validateSlideshow(makeMinimalSlideshow({ frames: [] }));
    expect(issues.some((i) => i.kind === "empty_frames")).toBe(true);
  });

  it("catches frames with endMs <= startMs", () => {
    const def = makeMinimalSlideshow({
      frames: [{ startMs: 0, endMs: 0, imageUrl: "/a", transition: "fade" }],
    });
    const issues = validateSlideshow(def);
    expect(issues.some((i) => i.kind === "frame_ordering")).toBe(true);
  });

  it("catches frames that overlap", () => {
    const def = makeMinimalSlideshow({
      frames: [
        { startMs: 0, endMs: 3000, imageUrl: "/a", transition: "fade" },
        { startMs: 1000, endMs: 4000, imageUrl: "/b", transition: "fade" },
      ],
    });
    const issues = validateSlideshow(def);
    expect(issues.some((i) => i.kind === "frame_ordering")).toBe(true);
  });

  it("catches gaps larger than 250ms", () => {
    const def = makeMinimalSlideshow({
      frames: [
        { startMs: 0, endMs: 1000, imageUrl: "/a", transition: "fade" },
        { startMs: 2000, endMs: 4000, imageUrl: "/b", transition: "fade" },
      ],
    });
    const issues = validateSlideshow(def);
    expect(issues.some((i) => i.kind === "frame_gap")).toBe(true);
  });

  it("catches lyrics out of order", () => {
    const def = makeMinimalSlideshow({
      lyrics: [
        { startMs: 1000, endMs: 2000, text: "b" },
        { startMs: 500, endMs: 1500, text: "a" },
      ],
    });
    const issues = validateSlideshow(def);
    expect(issues.some((i) => i.kind === "lyric_ordering")).toBe(true);
  });

  it("catches bad ken-burns scales", () => {
    const def = makeMinimalSlideshow({
      frames: [
        {
          startMs: 0,
          endMs: 2000,
          imageUrl: "/a",
          transition: "fade",
          kenBurns: {
            startScale: 0,
            endScale: -1,
            startPan: [0, 0],
            endPan: [0, 0],
          },
        },
        { startMs: 2000, endMs: 4000, imageUrl: "/b", transition: "fade" },
      ],
    });
    const issues = validateSlideshow(def);
    expect(issues.some((i) => i.kind === "ken_burns_scale")).toBe(true);
  });

  it("catches duration mismatch", () => {
    const def = makeMinimalSlideshow({ durationMs: 99_000 });
    const issues = validateSlideshow(def);
    expect(issues.some((i) => i.kind === "duration_mismatch")).toBe(true);
  });
});

describe("songSlideshow lookup helpers", () => {
  const def = makeMinimalSlideshow({
    lyrics: [
      { startMs: 0, endMs: 1500, text: "first" },
      { startMs: 1500, endMs: 3000, text: "second" },
    ],
    overlays: [
      { type: "vignette", startMs: 0, endMs: 4000, intensity: 0.5 },
      { type: "grain", startMs: 1000, endMs: 2000, intensity: 0.2 },
    ],
  });

  it("getFrameAt returns the right frame at each boundary", () => {
    expect(getFrameAt(def, 0)?.imageUrl).toBe("/f1");
    expect(getFrameAt(def, 1999)?.imageUrl).toBe("/f1");
    expect(getFrameAt(def, 2000)?.imageUrl).toBe("/f2");
    expect(getFrameAt(def, 3999)?.imageUrl).toBe("/f2");
    expect(getFrameAt(def, 4000)).toBeNull();
  });

  it("getLyricAt tracks the active line", () => {
    expect(getLyricAt(def, 0)?.text).toBe("first");
    expect(getLyricAt(def, 1499)?.text).toBe("first");
    expect(getLyricAt(def, 1500)?.text).toBe("second");
    expect(getLyricAt(def, 4000)).toBeNull();
  });

  it("getActiveOverlays returns overlapping overlays", () => {
    const overlays = getActiveOverlays(def, 1500);
    expect(overlays.map((o) => o.type).sort()).toEqual(["grain", "vignette"]);
  });
});

describe("songSlideshows registry", () => {
  it("registry includes Last Words as P0", () => {
    expect(getSlideshow("last-words")).toBeDefined();
    expect(LAST_WORDS_SLIDESHOW.priority).toBe("P0");
  });

  it("Last Words slideshow validates cleanly", () => {
    const issues = validateSlideshow(LAST_WORDS_SLIDESHOW);
    expect(issues).toEqual([]);
  });

  it("Last Words is 15 frames at 14s each", () => {
    expect(LAST_WORDS_SLIDESHOW.frames.length).toBe(15);
    expect(LAST_WORDS_SLIDESHOW.durationMs).toBe(15 * 14_000);
  });

  it("Last Words sets the expected completion flags", () => {
    expect(LAST_WORDS_SLIDESHOW.flagsSetOnComplete).toContain(
      "slideshow_last_words_complete",
    );
    expect(LAST_WORDS_SLIDESHOW.flagsSetOnComplete).toContain(
      "antiquarian_voice_first_heard",
    );
    expect(LAST_WORDS_SLIDESHOW.flagsSetOnComplete).toContain(
      "engineer_execution_seen",
    );
  });

  it("Last Words does NOT set act_1_complete itself (the caller sets it)", () => {
    // The slideshow is TRIGGERED by act_1_complete already being true.
    // If it set the flag itself we'd have a causal loop.
    expect(LAST_WORDS_SLIDESHOW.flagsSetOnComplete).not.toContain("act_1_complete");
    expect(LAST_WORDS_SLIDESHOW.flagsSetOnComplete).not.toContain("act1_complete");
  });

  it("Last Words unlocks the Prince of Celebration entry", () => {
    expect(LAST_WORDS_SLIDESHOW.unlockLoredexEntry).toBe("the-prince-of-celebration");
  });

  it("Last Words rewards +500 community light energy", () => {
    expect(LAST_WORDS_SLIDESHOW.lightEnergyReward).toBe(500);
  });

  it("every registered slideshow validates cleanly", () => {
    for (const def of Object.values(SONG_SLIDESHOWS)) {
      expect(validateSlideshow(def)).toEqual([]);
    }
  });

  it("listSlideshows sorts by priority", () => {
    const list = listSlideshows();
    expect(list.length).toBeGreaterThan(0);
    expect(list[0].priority).toBe("P0");
  });

  it("registry has all four §5.5 P0 Act openers registered", () => {
    expect(getSlideshow("welcome-to-celebration")).toBeDefined();
    expect(getSlideshow("to-be-the-human")).toBeDefined();
    expect(getSlideshow("last-words")).toBeDefined();
    expect(getSlideshow("i-am-the-eyes-that-watch")).toBeDefined();
  });

  it("listSlideshows returns at least four P0 entries", () => {
    const p0 = listSlideshows().filter((s) => s.priority === "P0");
    expect(p0.length).toBeGreaterThanOrEqual(4);
  });
});

describe("Welcome to Celebration slideshow (§4.3 / §12 C2)", () => {
  it("has 8 frames per the proposal", () => {
    expect(WELCOME_TO_CELEBRATION_SLIDESHOW.frames.length).toBe(8);
  });

  it("sets the Engineer's origin flags on completion", () => {
    const flags = WELCOME_TO_CELEBRATION_SLIDESHOW.flagsSetOnComplete;
    expect(flags).toContain("engineer_origin_seen");
    expect(flags).toContain("celebration_class_photo_seen");
    expect(flags).toContain("slideshow_welcome_to_celebration_complete");
  });

  it("does NOT set the upstream cycle_a trigger flag", () => {
    // Causality guard: the slideshow is TRIGGERED by the upstream
    // act_1_cycle_a_complete flag, not the other way around.
    expect(WELCOME_TO_CELEBRATION_SLIDESHOW.flagsSetOnComplete).not.toContain(
      "act_1_cycle_a_complete",
    );
    expect(WELCOME_TO_CELEBRATION_SLIDESHOW.flagsSetOnComplete).not.toContain(
      "cycle_a_complete",
    );
  });

  it("rewards a modest community light bump on the first cycle payoff", () => {
    expect(WELCOME_TO_CELEBRATION_SLIDESHOW.lightEnergyReward).toBe(150);
  });

  it("validates cleanly", () => {
    expect(validateSlideshow(WELCOME_TO_CELEBRATION_SLIDESHOW)).toEqual([]);
  });

  it("unlocks the Project Celebration loredex entry", () => {
    expect(WELCOME_TO_CELEBRATION_SLIDESHOW.unlockLoredexEntry).toBe("project-celebration");
  });
});

describe("To Be the Human slideshow (§4.4 / §12 C3)", () => {
  it("has 10 frames for the Mechronis academy arc", () => {
    expect(TO_BE_THE_HUMAN_SLIDESHOW.frames.length).toBe(10);
  });

  it("sets Iron Lion absence and Seer glimpsed flags", () => {
    const flags = TO_BE_THE_HUMAN_SLIDESHOW.flagsSetOnComplete;
    expect(flags).toContain("iron_lion_absence_noted");
    expect(flags).toContain("seer_glimpsed");
    expect(flags).toContain("slideshow_to_be_the_human_complete");
  });

  it("does NOT set the upstream cycle_b trigger flag", () => {
    expect(TO_BE_THE_HUMAN_SLIDESHOW.flagsSetOnComplete).not.toContain(
      "act_1_cycle_b_complete",
    );
    expect(TO_BE_THE_HUMAN_SLIDESHOW.flagsSetOnComplete).not.toContain(
      "cycle_b_complete",
    );
  });

  it("rewards +200 community light (bigger payoff than cycle A)", () => {
    expect(TO_BE_THE_HUMAN_SLIDESHOW.lightEnergyReward).toBe(200);
  });

  it("validates cleanly", () => {
    expect(validateSlideshow(TO_BE_THE_HUMAN_SLIDESHOW)).toEqual([]);
  });

  it("unlocks the Mechronis Academy loredex entry", () => {
    expect(TO_BE_THE_HUMAN_SLIDESHOW.unlockLoredexEntry).toBe("mechronis-academy");
  });
});

describe("I Am the Eyes That Watch slideshow (§7 / §12 C6)", () => {
  it("has 8 frames per the proposal", () => {
    expect(I_AM_THE_EYES_SLIDESHOW.frames.length).toBe(8);
  });

  it("sets Elara's witness flag and the betrayal flag", () => {
    const flags = I_AM_THE_EYES_SLIDESHOW.flagsSetOnComplete;
    expect(flags).toContain("elara_watched_her_own_past");
    expect(flags).toContain("panopticon_betrayal_seen");
    expect(flags).toContain("eyes_life_seen");
  });

  it("does NOT set the upstream act_3 trigger flag", () => {
    expect(I_AM_THE_EYES_SLIDESHOW.flagsSetOnComplete).not.toContain(
      "act_3_starting",
    );
    expect(I_AM_THE_EYES_SLIDESHOW.flagsSetOnComplete).not.toContain(
      "act_3_opened",
    );
  });

  it("rewards +250 community light (Act 3 opener carries weight)", () => {
    expect(I_AM_THE_EYES_SLIDESHOW.lightEnergyReward).toBe(250);
  });

  it("validates cleanly", () => {
    expect(validateSlideshow(I_AM_THE_EYES_SLIDESHOW)).toEqual([]);
  });

  it("marks Elara as a live reactor in at least one frame", () => {
    // Per §12 C6, this is the FIRST slideshow where the
    // on-shoulder narrator is a character inside the cutscene.
    // At least one frame should have narratorReactionId === "elara".
    const elaraReactions = I_AM_THE_EYES_SLIDESHOW.frames.filter(
      (f) => f.narratorReactionId === "elara",
    );
    expect(elaraReactions.length).toBeGreaterThan(0);
  });

  it("unlocks the Eyes loredex entry", () => {
    expect(I_AM_THE_EYES_SLIDESHOW.unlockLoredexEntry).toBe("the-eyes");
  });
});

describe("Hacking Reality slideshow (§4.5 Cycle C opener)", () => {
  it("has 8 frames", () => {
    expect(HACKING_REALITY_SLIDESHOW.frames.length).toBe(8);
  });

  it("is priority P1 per the §5.5 table", () => {
    expect(HACKING_REALITY_SLIDESHOW.priority).toBe("P1");
  });

  it("sets Battle of Nexon flags", () => {
    const flags = HACKING_REALITY_SLIDESHOW.flagsSetOnComplete;
    expect(flags).toContain("battle_of_nexon_seen");
    expect(flags).toContain("seer_deck_at_peak_seen");
  });

  it("validates cleanly", () => {
    expect(validateSlideshow(HACKING_REALITY_SLIDESHOW)).toEqual([]);
  });

  it("rewards +180 light (modest, it's a P1 opener)", () => {
    expect(HACKING_REALITY_SLIDESHOW.lightEnergyReward).toBe(180);
  });
});

describe("Ocularum slideshow (§7 Act 3 mid-point, §12 C7)", () => {
  it("has 10 frames", () => {
    expect(OCULARUM_SLIDESHOW.frames.length).toBe(10);
  });

  it("is priority P0", () => {
    expect(OCULARUM_SLIDESHOW.priority).toBe("P0");
  });

  it("sets Watcher origin flags including eyes_death_ordered", () => {
    const flags = OCULARUM_SLIDESHOW.flagsSetOnComplete;
    expect(flags).toContain("watcher_origin_seen");
    expect(flags).toContain("eyes_death_ordered");
    expect(flags).toContain("ocularum_heard");
  });

  it("contains the Watcher's signature line in the reduced-motion prose", () => {
    expect(OCULARUM_SLIDESHOW.reducedMotionFallback.prose).toContain(
      "giving her back to the grass",
    );
  });

  it("rewards +300 light (the heaviest P0 mid-point payoff)", () => {
    expect(OCULARUM_SLIDESHOW.lightEnergyReward).toBe(300);
  });

  it("validates cleanly", () => {
    expect(validateSlideshow(OCULARUM_SLIDESHOW)).toEqual([]);
  });
});

describe("The Prisoner slideshow (§9 Act 4 opener, §12 C8)", () => {
  it("is intentionally short — 3 frames per §12 C8", () => {
    expect(THE_PRISONER_SLIDESHOW.frames.length).toBe(3);
  });

  it("is priority P0", () => {
    expect(THE_PRISONER_SLIDESHOW.priority).toBe("P0");
  });

  it("every frame has a White Oracle dialog overlay", () => {
    for (const frame of THE_PRISONER_SLIDESHOW.frames) {
      expect(frame.dialogOverlay).toBeDefined();
      expect(frame.dialogSpeakerId).toBe("the_white_oracle");
    }
  });

  it("sets the White Oracle transmission flags", () => {
    const flags = THE_PRISONER_SLIDESHOW.flagsSetOnComplete;
    expect(flags).toContain("white_oracle_transmission_received");
    expect(flags).toContain("prisoner_brief_heard");
  });

  it("has no lyrics (it's a direct-address cutscene)", () => {
    expect(THE_PRISONER_SLIDESHOW.lyrics).toEqual([]);
  });

  it("validates cleanly", () => {
    expect(validateSlideshow(THE_PRISONER_SLIDESHOW)).toEqual([]);
  });
});

describe("The Lion in Black slideshow (§11.2 / §12 C9)", () => {
  it("has 12 frames for the Iron Lion's last broadcast", () => {
    expect(THE_LION_IN_BLACK_SLIDESHOW.frames.length).toBe(12);
  });

  it("is priority P0 and sets act_5_opened", () => {
    expect(THE_LION_IN_BLACK_SLIDESHOW.priority).toBe("P0");
    expect(THE_LION_IN_BLACK_SLIDESHOW.flagsSetOnComplete).toContain(
      "act_5_opened",
    );
  });

  it("sets the antiquarian_curated_feed_seen flag (§11.2 invariant)", () => {
    // Per §11.2 this is the first slideshow to mirror the player's
    // own history. The Antiquarian curator flag locks in that
    // behavior.
    expect(THE_LION_IN_BLACK_SLIDESHOW.flagsSetOnComplete).toContain(
      "antiquarian_curated_feed_seen",
    );
  });

  it("the Antiquarian is the dominant narrator reactor", () => {
    // At least the opener frame and the final couple of frames
    // should have the Antiquarian marked as the on-shoulder
    // reactor, since he's curating the feed.
    const antiquarianFrames = THE_LION_IN_BLACK_SLIDESHOW.frames.filter(
      (f) => f.narratorReactionId === "antiquarian",
    );
    expect(antiquarianFrames.length).toBeGreaterThanOrEqual(3);
  });

  it("rewards +400 light (Act 5 opener carries the most weight)", () => {
    expect(THE_LION_IN_BLACK_SLIDESHOW.lightEnergyReward).toBe(400);
  });

  it("closes on Iron Lion's signature broadcast line", () => {
    expect(THE_LION_IN_BLACK_SLIDESHOW.reducedMotionFallback.closingLine).toContain(
      "I broadcast this hoping someone would answer",
    );
  });

  it("validates cleanly", () => {
    expect(validateSlideshow(THE_LION_IN_BLACK_SLIDESHOW)).toEqual([]);
  });
});

describe("Two Witnesses Meet slideshow (§1.5 / §12 C10)", () => {
  it("has 7 beats per the §12 C10 Seedance prompt", () => {
    expect(TWO_WITNESSES_MEET_SLIDESHOW.frames.length).toBe(7);
  });

  it("has no lyrics (silent choreography per §12 C10)", () => {
    expect(TWO_WITNESSES_MEET_SLIDESHOW.lyrics).toEqual([]);
  });

  it("sets the forgiveness_choice_unlocked flag", () => {
    const flags = TWO_WITNESSES_MEET_SLIDESHOW.flagsSetOnComplete;
    expect(flags).toContain("forgiveness_choice_unlocked");
    expect(flags).toContain("two_witnesses_met");
  });

  it("reward is deferred to the player's choice (reward=0 here)", () => {
    // §3.6 — the +200 light or -100 dark landing depends on
    // which of "Forgive Both / Forgive One / Forgive Neither"
    // the player chooses. The slideshow itself doesn't award
    // energy.
    expect(TWO_WITNESSES_MEET_SLIDESHOW.lightEnergyReward).toBe(0);
  });

  it("alternates narrator reactors across the choreography beats", () => {
    // Per §12 C10 Seedance prompt, the camera follows each
    // narrator's movement in alternation. Beats 2-5 should
    // attribute reactions to the corresponding narrator.
    const reactors = TWO_WITNESSES_MEET_SLIDESHOW.frames.map(
      (f) => f.narratorReactionId,
    );
    expect(reactors).toContain("elara");
    expect(reactors).toContain("the_human");
  });

  it("validates cleanly", () => {
    expect(validateSlideshow(TWO_WITNESSES_MEET_SLIDESHOW)).toEqual([]);
  });

  it("unlocks the Two Witnesses loredex entry", () => {
    expect(TWO_WITNESSES_MEET_SLIDESHOW.unlockLoredexEntry).toBe("the-two-witnesses");
  });
});

describe("Full registry invariants", () => {
  it("registry has 9 slideshows total (4 P0 openers + 4 second wave + Two Witnesses Meet)", () => {
    expect(Object.keys(SONG_SLIDESHOWS).length).toBe(9);
  });

  it("every registered slideshow validates cleanly (second-wave audit)", () => {
    for (const def of Object.values(SONG_SLIDESHOWS)) {
      const issues = validateSlideshow(def);
      expect(issues, `Validator issues in ${def.id}: ${JSON.stringify(issues)}`).toEqual([]);
    }
  });

  it("every slideshow has a unique id and song id", () => {
    const ids = Object.values(SONG_SLIDESHOWS).map((s) => s.id);
    const songIds = Object.values(SONG_SLIDESHOWS).map((s) => s.songId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(songIds).size).toBe(songIds.length);
  });

  it("every slideshow declares its slideshow_*_complete flag", () => {
    for (const def of Object.values(SONG_SLIDESHOWS)) {
      const expected = `slideshow_${def.id.replace(/-/g, "_")}_complete`;
      expect(def.flagsSetOnComplete).toContain(expected);
    }
  });
});

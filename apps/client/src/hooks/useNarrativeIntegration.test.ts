import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
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

  it("has both Vortex Endgame variants registered with distinct trigger flags", () => {
    const light = SLIDESHOW_TRIGGERS.find(
      (t) => t.slideshowId === "the-light-holds",
    );
    const dark = SLIDESHOW_TRIGGERS.find(
      (t) => t.slideshowId === "the-bulb-breaks",
    );
    expect(light).toBeDefined();
    expect(dark).toBeDefined();
    expect(light?.triggerFlag).toBe("vortex_endgame_light_variant");
    expect(dark?.triggerFlag).toBe("vortex_endgame_dark_variant");
    // Variants must be distinct — same trigger would break the
    // endgame selector.
    expect(light?.triggerFlag).not.toBe(dark?.triggerFlag);
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

/* ═══════════════════════════════════════════════════════
   §14.1 mutual-bond block uses the canonical narratorBond
   reader, not an inline Math.min over the trust-level fields.

   Source-scan: verifies the rewire. If someone re-inlines the
   Math.min or forgets to destructure getNarratorBond, these
   tests fail loudly before the bond thresholds silently
   regress.
   ═══════════════════════════════════════════════════════ */
describe("useNarrativeIntegration — §14.1 narratorBond wiring", () => {
  const hookSrc = fs.readFileSync(
    path.resolve(__dirname, "useNarrativeIntegration.ts"),
    "utf-8",
  );

  it("destructures getNarratorBond from useGame()", () => {
    // Tolerant of multiline formatting — the destructure grew when
    // the Prelude handoff started pulling advanceNarrativeAct too.
    expect(hookSrc).toContain("getNarratorBond,");
    expect(hookSrc).toMatch(/\}\s*=\s*useGame\(\);/);
  });

  it("imports the shared bond thresholds (40/60/80 only live in one place)", () => {
    expect(hookSrc).toContain(
      'import { NARRATOR_BOND_THRESHOLDS } from "@shared/narratorBond"',
    );
  });

  it("§14.1 block uses getNarratorBond() as its read source", () => {
    // The `mutualBond` binding is the post-rewire read path.
    expect(hookSrc).toMatch(/const\s+mutualBond\s*=\s*getNarratorBond\(\);/);
  });

  it("§14.1 block no longer computes Math.min on the trust-level fields inline", () => {
    // Defensive: the previous inline computation must be gone. If it
    // comes back, the bond reader and the milestone trigger could
    // drift on pre-field saves.
    expect(hookSrc).not.toMatch(
      /Math\.min\(\s*state\.elaraTrustLevel\s*\?\?\s*0,\s*state\.humanTrustLevel\s*\?\?\s*0\s*\)/,
    );
  });

  it("§14.1 thresholds are read from NARRATOR_BOND_THRESHOLDS (no magic numbers)", () => {
    expect(hookSrc).toContain("NARRATOR_BOND_THRESHOLDS.remember");
    expect(hookSrc).toContain("NARRATOR_BOND_THRESHOLDS.silence");
    expect(hookSrc).toContain("NARRATOR_BOND_THRESHOLDS.meet");
  });

  it("§5.5 P1 asymmetric confession check still uses per-narrator trust levels", () => {
    // Asymmetric shape (humanBond > 60 AND elaraBond < 20) can't
    // compress to a single bond scalar. Those reads must stay
    // per-narrator.
    expect(hookSrc).toMatch(/const\s+elaraBond\s*=\s*state\.elaraTrustLevel/);
    expect(hookSrc).toMatch(/const\s+humanBond\s*=\s*state\.humanTrustLevel/);
  });
});

/* ═══════════════════════════════════════════════════════
   Prelude → Act 1 handoff is wired (the ship-blocker fix).

   Verifies the useEffect exists, calls the right action,
   and uses the shared predicate (not an inline check).
   ═══════════════════════════════════════════════════════ */
describe("useNarrativeIntegration — Prelude → Act 1 handoff", () => {
  const hookSrc = fs.readFileSync(
    path.resolve(__dirname, "useNarrativeIntegration.ts"),
    "utf-8",
  );

  it("imports the shared predicate + target-act constant", () => {
    expect(hookSrc).toContain(
      'import {\n  PRELUDE_HANDOFF_TARGET_ACT,\n  shouldAdvanceToAct1OnPreludeComplete,\n} from "@shared/preludeHandoff"',
    );
  });

  it("destructures advanceNarrativeAct from useGame()", () => {
    expect(hookSrc).toContain("advanceNarrativeAct,\n  } = useGame();");
  });

  it("calls advanceNarrativeAct(PRELUDE_HANDOFF_TARGET_ACT) when the predicate fires", () => {
    expect(hookSrc).toMatch(
      /advanceNarrativeAct\(PRELUDE_HANDOFF_TARGET_ACT\)/,
    );
  });

  it("uses shouldAdvanceToAct1OnPreludeComplete (no inline flag check)", () => {
    expect(hookSrc).toContain("shouldAdvanceToAct1OnPreludeComplete({");
  });

  it("depends on state.narrativeFlags.prelude_complete for re-evaluation", () => {
    // Scoped dep so the effect retriggers when the flag flips without
    // over-subscribing to the whole flags object.
    expect(hookSrc).toContain("state.narrativeFlags?.prelude_complete");
  });
});

/* ═══════════════════════════════════════════════════════
   Engineer Recording watcher (roadmap §Act 1 item).

   The 7 holograms fire on card-battle milestones (1/3/4/8/9/10/12
   wins + optional dischordiaStep + allAct1Complete gates) via
   CARD_BATTLE_MILESTONES. Source-scan asserts the wiring lives in
   useNarrativeIntegration and reads from the shared constant, so
   the recording flags can't silently drift out of the hook.
   ═══════════════════════════════════════════════════════ */
describe("useNarrativeIntegration — Engineer Recording watcher", () => {
  const hookSrc = fs.readFileSync(
    path.resolve(__dirname, "useNarrativeIntegration.ts"),
    "utf-8",
  );

  it("imports CARD_BATTLE_MILESTONES + ENGINEER_RECORDINGS", () => {
    expect(hookSrc).toContain(
      'import { CARD_BATTLE_MILESTONES } from "@shared/dischordiaCycle"',
    );
    expect(hookSrc).toContain(
      'import { ENGINEER_RECORDINGS } from "@shared/engineerRecordings"',
    );
  });

  it("iterates CARD_BATTLE_MILESTONES to raise recording flags", () => {
    expect(hookSrc).toMatch(/for\s*\(\s*const\s+milestone\s+of\s+CARD_BATTLE_MILESTONES/);
  });

  it("gates each recording on cardWins and the discovery flag", () => {
    // The loop body must read both so late hops (#6, #7) don't fire
    // prematurely and already-discovered flags are skipped.
    expect(hookSrc).toMatch(/cardWins\s*<\s*milestone\.minWins/);
    expect(hookSrc).toMatch(/state\.narrativeFlags\?\.\[milestone\.discoveryFlag\]/);
  });

  it("defers the discovery reveal to EngineerRecordingDiscoveryModal", () => {
    // The full cinematic (transcript + NPC reactions) is handled by
    // the mounted <EngineerRecordingDiscoveryModal /> in AppShell;
    // the hook only sets the flag so two surfaces don't compete.
    expect(hookSrc).toContain("EngineerRecordingDiscoveryModal");
    // And the hook should no longer fire its own toast for the title.
    expect(hookSrc).not.toContain("Engineer Recording ${milestone.recordingOrder}");
  });
});

/* ═══════════════════════════════════════════════════════
   Seer screen-reader announcement (spec §6.3).

   The Seer plays a card from a future turn; AT users must hear the
   full invariant sentence ("Her hand count does not decrease"),
   not a truncated version. Source-scan protects the spec string.
   ═══════════════════════════════════════════════════════ */
describe("DuelystGameUI — §4.9 Seer announcement", () => {
  const uiSrc = fs.readFileSync(
    path.resolve(
      __dirname,
      "../game/duelyst/DuelystGameUI.tsx",
    ),
    "utf-8",
  );

  it("match-start announcement includes the hand-count invariant", () => {
    expect(uiSrc).toContain(
      "The Seer plays cards from a future turn. Her hand count does not decrease.",
    );
  });

  it("per-play announcement includes the hand-count invariant (spec §6.3)", () => {
    expect(uiSrc).toContain(
      "The Seer plays a card from a future turn. Her hand count does not decrease.",
    );
  });
});

/* ═══════════════════════════════════════════════════════
   P1.3 — Act 1 completion gate

   The Act 1 closing cinematic only fires when ALL THREE of the
   following land:
     1. cardWins >= 12 (the twelfth match resolves)
     2. lightDarkAlignment is not null (§5.8.1 ChoicePillar picked)
     3. act1_authority_outcome flag set (trial resolved)

   Source-scan confirms the gate is tightened — a regression that
   drops any leg would re-open the "Act 1 closes without a verdict"
   silent-transition bug.
   ═══════════════════════════════════════════════════════ */
describe("useNarrativeIntegration — Act 1 completion gate (P1.3)", () => {
  const hookSrc = fs.readFileSync(
    path.resolve(__dirname, "useNarrativeIntegration.ts"),
    "utf-8",
  );

  it("requires cardWins >= 12", () => {
    expect(hookSrc).toMatch(/cardWins\s*>=\s*12/);
  });

  it("requires lightDarkAlignment to be set (not null)", () => {
    expect(hookSrc).toMatch(/state\.lightDarkAlignment\s*!==\s*null/);
  });

  it("requires act1_authority_outcome narrative flag", () => {
    expect(hookSrc).toContain("act1_authority_outcome");
  });
});

describe("DuelystGameUI — trial outcome persistence (P1.3)", () => {
  const uiSrc = fs.readFileSync(
    path.resolve(__dirname, "../game/duelyst/DuelystGameUI.tsx"),
    "utf-8",
  );

  it("writes act1_authority_outcome marker + per-outcome flag on trial resolution", () => {
    expect(uiSrc).toMatch(
      /setNarrativeFlag\(\s*["']act1_authority_outcome["']\s*,\s*true\s*\)/,
    );
    expect(uiSrc).toMatch(
      /setNarrativeFlag\(\s*`act1_authority_\$\{outcome\}`\s*,\s*true\s*\)/,
    );
  });
});

describe("DuelystGameUI — Programmer gift campaign consequence (P1.2)", () => {
  const uiSrc = fs.readFileSync(
    path.resolve(__dirname, "../game/duelyst/DuelystGameUI.tsx"),
    "utf-8",
  );

  it("destructures adjustNarratorBond + recordMemorableMoment", () => {
    expect(uiSrc).toContain("adjustNarratorBond,");
    expect(uiSrc).toContain(
      'import { recordMemorableMoment } from "@/stores/memorableMomentsStore"',
    );
  });

  it("calls adjustNarratorBond(5) on the accept branch", () => {
    expect(uiSrc).toMatch(/adjustNarratorBond\(\s*5\s*\)/);
  });

  it("records a bond_peak memorable moment on accept", () => {
    expect(uiSrc).toMatch(
      /recordMemorableMoment\(\s*["']bond_peak["']/,
    );
  });

  it("raises act1_programmer_gift_declined on decline", () => {
    expect(uiSrc).toMatch(
      /setNarrativeFlag\(\s*["']act1_programmer_gift_declined["']\s*,\s*true\s*\)/,
    );
  });
});

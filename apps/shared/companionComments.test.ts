import { describe, expect, it } from "vitest";
import { COMPANION_COMMENTS } from "./companionComments";

const PRELUDE_TRIGGERS = [
  "prelude_role_engineer_chosen",
  "prelude_role_oracle_chosen",
  "prelude_role_soldier_chosen",
  "prelude_role_assassin_chosen",
  "prelude_role_spy_chosen",
  "prelude_beat_c5_palm_frost_seen",
  "prelude_beat_d_first_slate_read",
  "prelude_beat_d_all_slates_read",
  "prelude_beat_e_first_hotspot_seen",
  "prelude_beat_e_flashback_complete",
  "prelude_beat_f_lock_first_attempt",
  "prelude_beat_g_bridge_first_view",
  "prelude_beat_h_inbox_first_open",
  "prelude_beat_h_inbox_first_reply",
  "prelude_beat_i_preparation",
  "prelude_beat_j_last_words_tease_start",
  "prelude_beat_j_last_words_tease_end",
  "act1_first_opponent_entered",
] as const;

const ACT_2_TO_7_TRIGGERS = [
  "act2_first_substrate_ping",
  "act2_dual_signal_activated",
  "bench_elara_ambient",
  "bench_human_ambient",
  "first_light_craft",
  "first_dark_craft",
  "zephyr_classroom_tier_1",
  "zephyr_classroom_tier_3",
  "zephyr_classroom_tier_5",
  "zephyr_classroom_tier_8",
  "game_master_first_loss",
  "chess_climb_tier_0_won",
  "chess_climb_tier_1_won",
  "chess_climb_tier_2_won",
  "chess_climb_tier_3_won",
  "silence_of_two_witnesses",
  "act3_path_transparent_chosen",
  "act3_path_pragmatic_chosen",
  "act3_path_full_secret_chosen",
  "act3_kael_logs_unlocked",
  "act4_pathA_complete",
  "act4_pathB_complete",
  "act4_pathC_complete",
  "act4_army_unlocked",
  "act5_map_first_open",
  "act5_first_recruit_complete",
  "act5_sector_complete",
  "act6_elara_confession_heard",
  "act6_human_confession_heard",
  "act6_confession_close",
  "act7_army_assembled",
  "act7_visible_war_won",
  "act7_convergence_landing",
  "act7_arc_closes",
] as const;

describe("companionComments — prelude/Act 1 reactive coverage", () => {
  it("has at least one comment for every required prelude/Act 1 trigger", () => {
    for (const trigger of PRELUDE_TRIGGERS) {
      const matches = COMPANION_COMMENTS.filter((c) => c.trigger === trigger);
      expect(
        matches.length,
        `no companion comment registered for trigger "${trigger}"`
      ).toBeGreaterThan(0);
    }
  });

  it("gives both Elara and The Human at least one prelude reactive line", () => {
    const preludeComments = COMPANION_COMMENTS.filter(
      (c) => c.trigger.startsWith("prelude_") || c.trigger.startsWith("act1_")
    );
    expect(preludeComments.some((c) => c.speaker === "elara")).toBe(true);
    expect(preludeComments.some((c) => c.speaker === "human")).toBe(true);
  });

  it("keeps every comment id globally unique", () => {
    const ids = COMPANION_COMMENTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every comment has non-empty voiceLine and a valid timing", () => {
    const validTimings = new Set(["immediate", "delayed_5s", "next_room_enter"]);
    for (const c of COMPANION_COMMENTS) {
      expect(c.voiceLine.trim().length, `${c.id} has empty voiceLine`).toBeGreaterThan(0);
      expect(validTimings.has(c.timing), `${c.id} has unknown timing ${c.timing}`).toBe(true);
      expect([1, 2]).toContain(c.maxPlays);
    }
  });
});

describe("companionComments — Act 2–7 reactive coverage", () => {
  it("has at least one comment for every required Act 2–7 trigger", () => {
    for (const trigger of ACT_2_TO_7_TRIGGERS) {
      const matches = COMPANION_COMMENTS.filter((c) => c.trigger === trigger);
      expect(
        matches.length,
        `no companion comment registered for trigger "${trigger}"`
      ).toBeGreaterThan(0);
    }
  });

  it("covers every Act boundary (2, 3, 4, 5, 6, 7) with at least one reactive line", () => {
    for (const act of [2, 3, 4, 5, 6, 7]) {
      const matches = COMPANION_COMMENTS.filter((c) =>
        c.trigger.startsWith(`act${act}_`)
      );
      expect(
        matches.length,
        `Act ${act} has no cc_act${act}_* reactive comment`
      ).toBeGreaterThan(0);
    }
  });

  it("gives both Elara and The Human reactive lines across Act 2–7", () => {
    const act2To7 = COMPANION_COMMENTS.filter((c) =>
      /^act[2-7]_/.test(c.trigger)
    );
    expect(act2To7.some((c) => c.speaker === "elara")).toBe(true);
    expect(act2To7.some((c) => c.speaker === "human")).toBe(true);
  });
});

describe("companionComments — governance vote reactivity (Phase 3)", () => {
  const REQUIRED_GOVERNANCE_TRIGGERS = [
    "flag_set:governance:engineer_bench_powered",
    "flag_set:governance:engineer_bench_contained",
    "flag_set:governance:vex_told_engineer_truth",
    "flag_set:governance:vex_kept_in_dark",
    "flag_set:governance:ghost_network_endorsed",
    "flag_set:governance:ghost_network_doubted",
    "flag_set:governance:revolution_of_thought",
    "flag_set:governance:violence_was_warranted",
    "flag_set:governance:kael_chose_dissolution",
    "flag_set:governance:kael_was_taken",
    "flag_set:governance:annual_ark_food",
    "flag_set:governance:annual_ark_research",
    "flag_set:governance:annual_ark_culture",
    "flag_set:governance:annual_ark_defense",
  ] as const;

  it("has at least one reactive line for every governance vote outcome", () => {
    for (const trigger of REQUIRED_GOVERNANCE_TRIGGERS) {
      const matches = COMPANION_COMMENTS.filter((c) => c.trigger === trigger);
      expect(
        matches.length,
        `governance trigger "${trigger}" has no companion line`,
      ).toBeGreaterThan(0);
    }
  });

  it("the Engineer-arc Tell-Vex / Don't-Tell-Vex outcomes both have Antiquarian commentary", () => {
    const tell = COMPANION_COMMENTS.filter(
      (c) =>
        c.trigger === "flag_set:governance:vex_told_engineer_truth" &&
        c.speaker === "antiquarian",
    );
    const dontTell = COMPANION_COMMENTS.filter(
      (c) =>
        c.trigger === "flag_set:governance:vex_kept_in_dark" &&
        c.speaker === "antiquarian",
    );
    expect(tell.length).toBeGreaterThan(0);
    expect(dontTell.length).toBeGreaterThan(0);
  });

  it("governance triggers route to multiple speakers (not a single voice)", () => {
    const govLines = COMPANION_COMMENTS.filter((c) =>
      c.trigger.startsWith("flag_set:governance:"),
    );
    const speakers = new Set(govLines.map((c) => c.speaker));
    expect(speakers.size).toBeGreaterThanOrEqual(3);
  });
});

describe("companionComments — Act 6/7 path-aware callbacks (Bandersnatch Move 3)", () => {
  /** Every Act 6/7 confession/landing trigger should have lines for
   *  all three macro-paths (A=Disclosure, B=Discovery, C=Betrayal).
   *  This is the path-lock pattern from act4OpponentDialog.ts
   *  extended through Acts 5–7 per the audit recommendation.
   */
  const PATH_AWARE_BASE_TRIGGERS = [
    "act6_elara_confession_heard",
    "act6_human_confession_heard",
    "act6_confession_close",
    "act7_visible_war_won",
    "act7_convergence_landing",
    "act7_arc_closes",
  ] as const;

  for (const base of PATH_AWARE_BASE_TRIGGERS) {
    it(`has all three path variants (_pathA / _pathB / _pathC) for "${base}"`, () => {
      for (const suffix of ["_pathA", "_pathB", "_pathC"]) {
        const trigger = `${base}${suffix}`;
        const matches = COMPANION_COMMENTS.filter((c) => c.trigger === trigger);
        expect(
          matches.length,
          `path-aware trigger "${trigger}" missing`,
        ).toBeGreaterThan(0);
      }
    });
  }

  it("path C (Betrayal) lines never claim the relationship is unchanged", () => {
    const pathCLines = COMPANION_COMMENTS.filter((c) =>
      c.trigger.endsWith("_pathC"),
    );
    expect(pathCLines.length).toBeGreaterThan(0);
    for (const line of pathCLines) {
      // Cheap soft-canon check: the betrayal arc should not say
      // "everything is fine" — that would invalidate the path's
      // emotional cost. Spot-check for a few words an over-eager
      // editor might insert.
      const text = line.voiceLine.toLowerCase();
      expect(text).not.toContain("forgiven and forgotten");
      expect(text).not.toContain("never happened");
    }
  });
});

describe("companionComments — Bandersnatch Move 2 meta narrator lines", () => {
  const REQUIRED_META_TRIGGERS = [
    "meta:first_run_complete",
    "meta:second_run_starts",
    "meta:second_run_finished",
    "meta:third_run_starts",
    "meta:path_full_secret_committed",
    "meta:humanity_path_third_time",
    "meta:machine_path_first_choice",
    "meta:balance_path_chosen",
    "meta:silence_at_seat",
    "meta:returning_player_recognised",
    "meta:dischordia_carryover_high",
    "meta:governance_pattern_consistent",
  ] as const;

  for (const trigger of REQUIRED_META_TRIGGERS) {
    it(`has at least one meta line for "${trigger}"`, () => {
      const matches = COMPANION_COMMENTS.filter((c) => c.trigger === trigger);
      expect(matches.length).toBeGreaterThan(0);
    });
  }

  it("most meta lines are voiced by the Antiquarian (canonical witness)", () => {
    const metaLines = COMPANION_COMMENTS.filter((c) =>
      c.trigger.startsWith("meta:"),
    );
    const antiquarianCount = metaLines.filter(
      (c) => c.speaker === "antiquarian",
    ).length;
    expect(antiquarianCount).toBeGreaterThanOrEqual(metaLines.length / 2);
  });

  it("uses the word 'player' at most once across all meta lines (calibrated 4th-wall reach)", () => {
    const metaLines = COMPANION_COMMENTS.filter((c) =>
      c.trigger.startsWith("meta:"),
    );
    const occurrences = metaLines.filter((c) =>
      c.voiceLine.toLowerCase().includes("player"),
    );
    // Bandersnatch tone: dropping the word 'player' is rare and
    // intentional. Used at most once — the 'humanity_path_third_time'
    // line is the single place we lean fully into it.
    expect(occurrences.length).toBeLessThanOrEqual(1);
  });
});

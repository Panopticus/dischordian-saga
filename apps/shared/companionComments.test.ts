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

const ACT7_TRIGGERS = [
  "act7_intro_complete",
  "act7_humanity_path",
  "act7_machine_path",
  "act7_bridge_path",
  "act7_command_path",
  "act7_first_boss_entered",
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

  it("has paired Elara + Human coverage for every Act 7 trigger", () => {
    for (const trigger of ACT7_TRIGGERS) {
      const matches = COMPANION_COMMENTS.filter((c) => c.trigger === trigger);
      const speakers = new Set(matches.map((c) => c.speaker));
      expect(
        matches.length,
        `no companion comments for Act 7 trigger "${trigger}"`,
      ).toBeGreaterThan(0);
      expect(
        speakers.has("elara") && speakers.has("human"),
        `Act 7 trigger "${trigger}" is missing one of the two voices`,
      ).toBe(true);
    }
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

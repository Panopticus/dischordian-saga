/* ═══════════════════════════════════════════════════════
   NPC_REACTIVE_COMMENTS — companion-quest reaction parity

   Verifies that every NamedNpcKey has exactly one reactive
   comment on the trigger "companion_quest_complete" — the
   toast pipeline (apps/client/src/components/companion/
   CompanionCommentToast.tsx) fires this trigger on every
   cq_* quest claim and expects each NPC to react once
   (maxPlays: 1) in canonical voice.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";
import { NPC_REACTIVE_COMMENTS } from "./npcCompanionExtensions";
import { NAMED_NPC_KEYS } from "./npcIdentity";

describe("NPC_REACTIVE_COMMENTS — companion_quest_complete coverage", () => {
  const trigger = "companion_quest_complete";

  it("ships one entry per NamedNpcKey (12)", () => {
    const reactions = NPC_REACTIVE_COMMENTS.filter((c) => c.trigger === trigger);
    expect(reactions).toHaveLength(12);
  });

  it("every NamedNpcKey is represented", () => {
    const reactions = NPC_REACTIVE_COMMENTS.filter((c) => c.trigger === trigger);
    const speakers = new Set(reactions.map((c) => c.speaker));
    for (const key of NAMED_NPC_KEYS) {
      expect(speakers.has(key), `missing reaction for ${key}`).toBe(true);
    }
  });

  it("every reaction caps at maxPlays: 1 (first-time-only)", () => {
    const reactions = NPC_REACTIVE_COMMENTS.filter((c) => c.trigger === trigger);
    for (const r of reactions) {
      expect(r.maxPlays).toBe(1);
    }
  });

  it("every reaction has a non-empty voice line", () => {
    const reactions = NPC_REACTIVE_COMMENTS.filter((c) => c.trigger === trigger);
    for (const r of reactions) {
      expect(r.voiceLine.length).toBeGreaterThan(0);
    }
  });

  it("every reaction id ends with '_companion_quest_first'", () => {
    const reactions = NPC_REACTIVE_COMMENTS.filter((c) => c.trigger === trigger);
    for (const r of reactions) {
      expect(r.id.endsWith("_companion_quest_first"), r.id).toBe(true);
    }
  });
});

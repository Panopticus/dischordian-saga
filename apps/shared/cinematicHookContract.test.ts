/* ═══════════════════════════════════════════════════════
   CINEMATIC HOOK CONTRACT — invariant test

   Source of truth: docs/production/prompts/kling-omni-INDEX.md.
   Every Kling Omni intro cinematic fires a *_seen flag on its
   final shot. Phase 1 dialog density commits to a hard contract:

     Every cinematic flag has at least one paired reactive
     comment in companionComments.ts AND at least one ask-topic
     in companionAskTopics.ts gated on that same flag.

   This test enforces the contract. Failure here means a new
   cinematic was added without its dialog hooks (or a hook was
   accidentally removed). The fix is to ship the missing
   reactive comment + ask-topic, never to relax the test.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";
import { COMPANION_COMMENTS } from "./companionComments";
import { COMPANION_ASK_TOPICS } from "./companionAskTopics";

const CINEMATIC_FLAGS = [
  // Act intros
  "prelude_awakening_seen",
  "act1_memoir_seen",
  "act2_substrate_seen",
  "act3_offer_seen",
  "act4_revelation_seen",
  "act5_map_seen",
  "act6_confession_seen",
  "act7_convergence_seen",
  // Mechanic intros
  "mech_card_combat_intro_seen",
  "mech_deckbuilder_intro_seen",
  "mech_allegiances_intro_seen",
  "mech_witnessing_intro_seen",
  "mech_soul_stones_intro_seen",
  "mech_oracle_deck_intro_seen",
  "mech_chess_intro_seen",
  "mech_sprite_proxy_intro_seen",
  "mech_expansion_drops_intro_seen",
  "mech_trade_empire_intro_seen",
  // Death-and-rebirth cinematics — three Potentials' first reanimation/release.
  // See apps/shared/resurrectionProtocols.ts (Wraith, Akai) and
  // apps/shared/dlcMysteries/wolfAnaraHunt.ts (Wolf). Full Elara+Human
  // reactive coverage + per-flag ask-topic enforced like the act intros.
  "resurrection_cinematic_wraith_calder_seen",
  "resurrection_cinematic_akai_shi_seen",
  "resurrection_cinematic_wolf_seen",
] as const;

describe("Cinematic hook contract — every cinematic flag has dialog density", () => {
  it("registers at least one reactive companion comment per cinematic flag", () => {
    for (const flag of CINEMATIC_FLAGS) {
      const matches = COMPANION_COMMENTS.filter((c) => c.trigger === flag);
      expect(
        matches.length,
        `no reactive companion comment fires on cinematic flag "${flag}"; ` +
          `add a cc_*_first entry to companionComments.ts`
      ).toBeGreaterThan(0);
    }
  });

  it("registers at least one ask-topic per cinematic flag", () => {
    for (const flag of CINEMATIC_FLAGS) {
      const matches = COMPANION_ASK_TOPICS.filter(
        (t) => t.unlockFlag === flag,
      );
      expect(
        matches.length,
        `no ask-topic unlocks on cinematic flag "${flag}"; ` +
          `add an ask_* entry to companionAskTopics.ts gated on this flag`
      ).toBeGreaterThan(0);
    }
  });

  it("pairs Elara + Human reactive coverage on every act intro flag", () => {
    const ACT_FLAGS = CINEMATIC_FLAGS.filter((f) => !f.startsWith("mech_"));
    for (const flag of ACT_FLAGS) {
      const matches = COMPANION_COMMENTS.filter((c) => c.trigger === flag);
      const speakers = new Set(matches.map((c) => c.speaker));
      // Prelude, Act 3, and Act 5 are single-speaker by design (Elara only).
      // Every other act intro must hear from both witnesses.
      const singleSpeakerActs = new Set([
        "prelude_awakening_seen",
        "act3_offer_seen",
        "act5_map_seen",
      ]);
      if (singleSpeakerActs.has(flag)) continue;
      expect(
        speakers.has("elara"),
        `act intro "${flag}" missing Elara reactive comment`
      ).toBe(true);
      expect(
        speakers.has("human"),
        `act intro "${flag}" missing Human reactive comment`
      ).toBe(true);
    }
  });

  it("ensures every cinematic ask-topic answer is non-empty and label-constrained", () => {
    const cinematicTopics = COMPANION_ASK_TOPICS.filter((t) =>
      (CINEMATIC_FLAGS as readonly string[]).includes(t.unlockFlag),
    );
    expect(
      cinematicTopics.length,
      "expected at least 18 cinematic-gated ask-topics"
    ).toBeGreaterThanOrEqual(18);
    for (const t of cinematicTopics) {
      expect(t.answer.trim().length, `${t.id} has empty answer`).toBeGreaterThan(0);
      expect(t.label.length, `${t.id} label exceeds 24 chars`).toBeLessThanOrEqual(24);
      expect(t.question.trim().length, `${t.id} has empty question`).toBeGreaterThan(0);
    }
  });

  it("guarantees every act intro ask-topic has a forward-looking alternate", () => {
    // Act 1, 3, 4 cinematics' retrospective ask-topics each ship with at
    // least one alternateAnswer that gates on a later act's flag — this is
    // the cross-act echo guarantee. Act 5/6/7 topics are act-final and
    // do not require forward alternates.
    const FORWARD_ECHO_FLAGS = [
      "prelude_awakening_seen",
      "act1_memoir_seen",
      "act3_offer_seen",
    ];
    for (const flag of FORWARD_ECHO_FLAGS) {
      const topics = COMPANION_ASK_TOPICS.filter((t) => t.unlockFlag === flag);
      const hasAlternate = topics.some(
        (t) => (t.alternateAnswers?.length ?? 0) > 0,
      );
      expect(
        hasAlternate,
        `cinematic flag "${flag}" has no ask-topic with a forward-looking alternateAnswer; ` +
          `cross-act echo missing — add an alternate that fires once act4_revelation_seen ` +
          `(or later) is set`
      ).toBe(true);
    }
  });
});

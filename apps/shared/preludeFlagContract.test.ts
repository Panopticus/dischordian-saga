/* ═══════════════════════════════════════════════════════
   PRELUDE FLAG CONTRACT — invariant test

   The prelude has three branching morality choices in
   awakeningProtocol.ts (companion_augmentation, infected_clone,
   distress_signal), each with three options (A / B / C). Every
   choice's nine flags must thread the same trio of substrates:

     1. companionComments.ts — at least one paired Elara + Human
        reactive comment per flag.
     2. companionAskTopics.ts — at least one ask-topic with an
        alternateAnswer that gates on the flag.
     3. moralityTrustActVariants.ts — at least one Act 1+ variant
        with the flag in requiredFlags, so the choice surfaces
        downstream and "decisions matter."

   This test enforces all three. A new prelude flag added in the
   future without its dialog/variant trio fails this test loudly.
   The fix is to ship the missing entries, never to relax the test.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";
import {
  OUTBREAK_MORALITY_CHOICES,
  type OutbreakMoralityChoice,
} from "./awakeningProtocol";
import { COMPANION_COMMENTS } from "./companionComments";
import { COMPANION_ASK_TOPICS } from "./companionAskTopics";
import { VARIANT_REGISTRY } from "./moralityTrustActVariants";

function flagsOf(choice: OutbreakMoralityChoice): string[] {
  const flags = [choice.choiceA.flag, choice.choiceB.flag];
  if (choice.choiceC) flags.push(choice.choiceC.flag);
  return flags;
}

const ALL_PRELUDE_FLAGS: string[] = OUTBREAK_MORALITY_CHOICES.flatMap(flagsOf);

describe("Prelude flag contract — every prelude morality flag has dialog density", () => {
  it("ships every prelude morality choice with three options (A, B, C)", () => {
    for (const choice of OUTBREAK_MORALITY_CHOICES) {
      expect(
        choice.choiceC,
        `prelude choice "${choice.id}" missing choiceC; the third "delay/observe/refuse" stance is mandatory`
      ).toBeDefined();
    }
  });

  it("registers paired Elara + Human reactive comments for every prelude flag", () => {
    for (const flag of ALL_PRELUDE_FLAGS) {
      const matches = COMPANION_COMMENTS.filter((c) => c.trigger === flag);
      const speakers = new Set(matches.map((c) => c.speaker));
      expect(
        matches.length,
        `prelude flag "${flag}" has no reactive companion comment; ` +
          `add a cc_*_${flag} entry to companionComments.ts`
      ).toBeGreaterThan(0);
      expect(
        speakers.has("elara"),
        `prelude flag "${flag}" is missing an Elara reactive comment`
      ).toBe(true);
      expect(
        speakers.has("human"),
        `prelude flag "${flag}" is missing a Human reactive comment`
      ).toBe(true);
    }
  });

  it("ships ask-topic alternateAnswers gated on every prelude flag", () => {
    for (const flag of ALL_PRELUDE_FLAGS) {
      const topicsCovering = COMPANION_ASK_TOPICS.filter((t) =>
        (t.alternateAnswers ?? []).some((a) => a.requiredFlag === flag),
      );
      expect(
        topicsCovering.length,
        `prelude flag "${flag}" has no retrospective ask-topic alternateAnswer; ` +
          `add a requiredFlag: "${flag}" alternate to the relevant ask_*_choice topic`
      ).toBeGreaterThan(0);
    }
  });

  it("ships at least one downstream Act 1+ variant for every prelude flag", () => {
    for (const flag of ALL_PRELUDE_FLAGS) {
      const variants = VARIANT_REGISTRY.filter(
        (v) =>
          (v.requiredFlags ?? []).includes(flag) &&
          (v.act === "any" || v.act >= 1),
      );
      expect(
        variants.length,
        `prelude flag "${flag}" has no downstream variant in moralityTrustActVariants; ` +
          `the choice currently sets a flag the universe never reads. ` +
          `Add at least one VARIANT_REGISTRY entry with requiredFlags: ["${flag}"] ` +
          `to honor the "decisions matter" guarantee.`
      ).toBeGreaterThan(0);
    }
  });

  it("paired ask-topics for the three prelude choices both speakers", () => {
    const expectedTopicSets = [
      ["ask_elara_aug_choice", "ask_human_aug_choice"],
      ["ask_elara_clone_choice", "ask_human_clone_choice"],
      ["ask_elara_signal_choice", "ask_human_signal_choice"],
    ];
    for (const [elaraId, humanId] of expectedTopicSets) {
      const elara = COMPANION_ASK_TOPICS.find((t) => t.id === elaraId);
      const human = COMPANION_ASK_TOPICS.find((t) => t.id === humanId);
      expect(elara, `missing prelude retrospective ask-topic ${elaraId}`).toBeDefined();
      expect(human, `missing prelude retrospective ask-topic ${humanId}`).toBeDefined();
      expect(elara!.followUp, `${elaraId} should chain to ${humanId} via followUp`).toBe(humanId);
      expect(elara!.alternateAnswers?.length ?? 0).toBeGreaterThanOrEqual(3);
      expect(human!.alternateAnswers?.length ?? 0).toBeGreaterThanOrEqual(3);
    }
  });
});

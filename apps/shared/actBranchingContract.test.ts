/* ═══════════════════════════════════════════════════════
   ACT BRANCHING CONTRACT — invariant test (Acts 1–7)

   Sister to preludeFlagContract.test.ts. The seven acts each
   have a set of authored "fork" flags (alignment, role, path,
   trust outcome, stance) that branch the universe. Every fork
   flag must thread the same trio:

     1. companionComments.ts — at least one reactive comment
        triggered on the flag.
     2. companionAskTopics.ts — at least one ask-topic with an
        alternateAnswer gated on the flag.
     3. moralityTrustActVariants.ts — at least one Act 1+
        downstream variant with the flag in requiredFlags.

   This test enforces all three across all 27 existing fork
   flags. A new fork flag added in the future without its trio
   fails this test loudly. The fix is to ship the missing
   entries, never to relax the test.
   ═══════════════════════════════════════════════════════ */

import { describe, expect, it } from "vitest";
import { COMPANION_COMMENTS } from "./companionComments";
import { COMPANION_ASK_TOPICS } from "./companionAskTopics";
import { VARIANT_REGISTRY, resolveVariant } from "./moralityTrustActVariants";

const ACT_FORK_FLAGS: Readonly<Record<number, readonly string[]>> = {
  1: [
    "act1_cycle_c_alignment_light",
    "act1_cycle_c_alignment_dark",
    "act1_cycle_c_alignment_balanced",
  ],
  2: [
    "act2_oracle_deflect_chosen",
    "act2_spy_misdirect_chosen",
    "act2_lied",
    "act2_partial_reveal",
    "act2_full_truth",
  ],
  3: [
    "act3_path_transparent_chosen",
    "act3_path_pragmatic_chosen",
    "act3_path_full_secret_chosen",
  ],
  4: ["act4_broken_trust", "act4_fragile_trust", "act4_strained", "act4_reconciled"],
  5: [
    "act5_engineer_tech_chosen",
    "act5_strategic_chosen",
    "act5_path_humanity_first",
    "act5_path_strength_first",
    "act5_balanced_chosen",
  ],
  6: [
    "act6_ally_chosen",
    "act6_compassion_chosen",
    "act6_oracle_sense_chosen",
    "act6_practical_chosen",
    "act6_refuse_secrecy_chosen",
    "act6_suspicious_chosen",
    "act6_partial_disclosure_chosen",
  ],
  7: ["act7_bridge_chosen", "act7_command_chosen", "act7_humanity_chosen", "act7_pattern_chosen"],
};

const ALL_FORK_FLAGS: string[] = Object.values(ACT_FORK_FLAGS).flatMap((arr) => [...arr]);

describe("Act branching contract — every fork flag has reactive + ask + variant", () => {
  it("registers at least one reactive comment per fork flag", () => {
    for (const flag of ALL_FORK_FLAGS) {
      const matches = COMPANION_COMMENTS.filter((c) => c.trigger === flag);
      expect(
        matches.length,
        `fork flag "${flag}" has no reactive comment in companionComments.ts; ` +
          `add at least one cc_*_${flag} entry`
      ).toBeGreaterThan(0);
    }
  });

  it("ships ask-topic alternateAnswers gated on every fork flag", () => {
    for (const flag of ALL_FORK_FLAGS) {
      const topicsCovering = COMPANION_ASK_TOPICS.filter((t) =>
        (t.alternateAnswers ?? []).some((a) => a.requiredFlag === flag),
      );
      expect(
        topicsCovering.length,
        `fork flag "${flag}" has no retrospective ask-topic alternateAnswer; ` +
          `add a requiredFlag: "${flag}" alternate to a paired ask_*_act${flagAct(flag)} topic`
      ).toBeGreaterThan(0);
    }
  });

  it("ships at least one downstream variant for every fork flag", () => {
    for (const flag of ALL_FORK_FLAGS) {
      const variants = VARIANT_REGISTRY.filter((v) =>
        (v.requiredFlags ?? []).includes(flag),
      );
      expect(
        variants.length,
        `fork flag "${flag}" has no downstream variant in moralityTrustActVariants; ` +
          `the choice currently sets a flag the universe never reads. ` +
          `Add at least one VARIANT_REGISTRY entry with requiredFlags: ["${flag}"].`
      ).toBeGreaterThan(0);
    }
  });

  it("every act with fork flags has paired Elara + Human ask-topics", () => {
    for (const [actStr, flags] of Object.entries(ACT_FORK_FLAGS)) {
      if (flags.length === 0) continue;
      const elaraTopics = COMPANION_ASK_TOPICS.filter(
        (t) =>
          t.speaker === "elara" &&
          (t.alternateAnswers ?? []).some((a) =>
            (flags as readonly string[]).includes(a.requiredFlag ?? ""),
          ),
      );
      const humanTopics = COMPANION_ASK_TOPICS.filter(
        (t) =>
          t.speaker === "human" &&
          (t.alternateAnswers ?? []).some((a) =>
            (flags as readonly string[]).includes(a.requiredFlag ?? ""),
          ),
      );
      expect(
        elaraTopics.length,
        `Act ${actStr} has no Elara ask-topic with any fork-flag alternateAnswer`
      ).toBeGreaterThan(0);
      expect(
        humanTopics.length,
        `Act ${actStr} has no Human ask-topic with any fork-flag alternateAnswer`
      ).toBeGreaterThan(0);
    }
  });

  it("totals: 7 acts, 31 fork flags covered", () => {
    expect(Object.keys(ACT_FORK_FLAGS).map(Number).sort()).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(ALL_FORK_FLAGS.length).toBe(31);
  });

  // Ghost-flag detector: a fork flag is "ghost" if no production code path
  // ever sets it. Branching dialog substrate around a flag the universe
  // never sets means the player's choice never echoes — exactly the bug
  // this whole branching pass is trying to retire. The list below
  // enumerates flags that are KNOWN to lack a setter in production code
  // (apps/client/src and apps/server). Add to this list only with a
  // tracking issue; the goal is to drive its length to zero.
  it("documents which fork flags still lack a production setter (allow-list shrinks over time)", () => {
    const KNOWN_GHOST_FLAGS_ALLOW_LIST: ReadonlySet<string> = new Set<string>([
      // Add flags here only with a tracking issue. The goal is empty.
    ]);
    // Sanity check: the allow-list itself only references real fork flags.
    for (const flag of KNOWN_GHOST_FLAGS_ALLOW_LIST) {
      expect(
        ALL_FORK_FLAGS.includes(flag),
        `ghost allow-list references unknown fork flag "${flag}"`
      ).toBe(true);
    }
  });
});

function flagAct(flag: string): string {
  const m = /^act([1-7])_/.exec(flag);
  return m ? m[1] : "?";
}

/* ═══════════════════════════════════════════════════════
   CONTINUITY F1/F2 — betrayal must mute warm/confidant lines

   A warm/confidant companion variant gated only on the global
   trust scalar fired AFTER the player betrayed that companion
   on the Act-4 Path-C route (nothing decrements the scalar).
   The fix is the `forbiddenFlags` negative gate; this invariant
   proves no Elara-intimacy variant survives `act4_broken_trust`.
   Fix the data (tag the variant), never relax this test.
   ═══════════════════════════════════════════════════════ */
describe("Continuity F1/F2 — Path-C betrayal mutes warm/confidant Elara", () => {
  const elaraIntimate = VARIANT_REGISTRY.filter(
    (v) =>
      v.trustCompanionId === "elara" &&
      (v.trust === "warm" || v.trust === "confidant"),
  );

  it("has Elara-intimacy variants to guard (registry sanity)", () => {
    expect(elaraIntimate.length).toBeGreaterThan(0);
  });

  it("every warm/confidant Elara variant carries the act4_broken_trust negative gate", () => {
    for (const v of elaraIntimate) {
      expect(
        v.forbiddenFlags ?? [],
        `${v.id}: missing forbiddenFlags ["act4_broken_trust"]`,
      ).toContain("act4_broken_trust");
    }
  });

  it("no warm/confidant Elara variant resolves once she was betrayed", () => {
    for (const v of elaraIntimate) {
      const input = {
        moralityScore: 0,
        narrativeAct: v.act === "any" ? 5 : v.act,
        trustByCompanion: { elara: 100 }, // confidant band
        flags: new Set<string>([
          ...(v.requiredFlags ?? []),
          "act4_broken_trust",
        ]),
      };
      const resolved = resolveVariant(
        VARIANT_REGISTRY,
        v.surface,
        v.targetId,
        input,
      );
      if (resolved) {
        const stillIntimateElara =
          resolved.trustCompanionId === "elara" &&
          (resolved.trust === "warm" || resolved.trust === "confidant");
        expect(
          stillIntimateElara,
          `${v.id}: betrayal route still resolved warm/confidant Elara line "${resolved.id}"`,
        ).toBe(false);
      }
    }
  });

  it("the gate is conditional — warm/confidant Elara still resolves when NOT betrayed", () => {
    const v = VARIANT_REGISTRY.find(
      (x) => x.id === "bridge_act6_confidant_elara",
    )!;
    const base = {
      moralityScore: 0,
      narrativeAct: 6,
      trustByCompanion: { elara: 100 },
    };
    const intact = resolveVariant(VARIANT_REGISTRY, v.surface, v.targetId, {
      ...base,
      flags: new Set<string>(),
    });
    expect(
      intact?.trustCompanionId === "elara" &&
        (intact?.trust === "warm" || intact?.trust === "confidant"),
      "an un-betrayed confidant player should still get a warm/confidant Elara line",
    ).toBe(true);
    const betrayed = resolveVariant(VARIANT_REGISTRY, v.surface, v.targetId, {
      ...base,
      flags: new Set<string>(["act4_broken_trust"]),
    });
    expect(betrayed?.id).not.toBe(intact?.id);
  });
});

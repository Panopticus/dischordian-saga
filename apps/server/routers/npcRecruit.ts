// audit-allow-procs: all
/* ═══════════════════════════════════════════════════════
   NPC RECRUIT ROUTER — Tier-5 NPC → Crew member.

   The five named recruitable NPCs (Vex Solène, Wraith
   Calder, Locke, Jericho Jones, Akai Shi) can be brought
   onto the player's inception ark as full crew members.
   The recruited instance carries `productionPath="recruited"`
   and `linkedNpcKey` so death triggers the world-block +
   Resurrection Protocols quest.

   Gating:
    - akai_shi: requires the global Necromancer event to
      have completed (cycleHistory has at least one
      "banished" or "eternal_dominion" outcome).
    - locke / akai_shi: imprint progression — highest tier
      unlocked must be 5.
    - vex_solene / wraith_calder / jericho_jones: not in
      the imprint registry; gated by narrative-flag set
      via mystery completion. For v1 we allow recruitment
      with a soft gate (always available) so the system
      can be exercised end-to-end; tighten later.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  loadCrewState,
  saveCrewState,
  addCrewMemberToState,
} from "../services/crewState";
import {
  RESURRECTABLE_NPC_KEYS,
  type ResurrectableNpcKey,
} from "../../shared/resurrectionProtocols";
import type { SerializedCrewMember } from "../../shared/crewPersistence";
import { getProgress as getRecruitmentProgress } from "../services/recruitmentQuestService";

const npcKeyEnum = z.enum(RESURRECTABLE_NPC_KEYS);

/** NPC archetype-equivalent stats. Drawn from the canonical character
 *  briefs in LORE_BIBLE.md. Stats fit a tier-5 deployable. */
const NPC_TEMPLATE: Record<
  ResurrectableNpcKey,
  {
    displayName: string;
    archetype: SerializedCrewMember["archetype"];
    role: SerializedCrewMember["role"];
    stats: SerializedCrewMember["stats"];
    /** Gate description shown in the UI when the player is not yet
     *  eligible. Pure copy — actual gating is checked separately. */
    gateDescription: string;
  }
> = {
  vex_solene: {
    displayName: "Vex Solène",
    archetype: "artisan",
    role: "comms_officer",
    stats: {
      resilience: 60,
      intellect: 80,
      reflexes: 70,
      empathy: 90,
      immunity: 60,
      adaptability: 75,
    },
    gateDescription: "Complete one Reveal-cadence trade-empire run with the Coda.",
  },
  wraith_calder: {
    displayName: "Wraith Calder",
    archetype: "revenant",
    role: "scientist",
    stats: {
      resilience: 75,
      intellect: 85,
      reflexes: 70,
      empathy: 60,
      immunity: 80,
      adaptability: 70,
    },
    gateDescription: "Complete the Eighth Death rite arc (mystery.wraith_calder, E1–E5).",
  },
  locke: {
    displayName: "Adjudicator Locke",
    archetype: "sentinel",
    role: "trader",
    stats: {
      resilience: 80,
      intellect: 80,
      reflexes: 70,
      empathy: 75,
      immunity: 70,
      adaptability: 80,
    },
    gateDescription: "Reach Imprint Tier 5 with Adjudicator Locke (50+ fragments).",
  },
  jericho_jones: {
    displayName: "Jericho Jones",
    archetype: "zealot",
    role: "security",
    stats: {
      resilience: 90,
      intellect: 65,
      reflexes: 85,
      empathy: 60,
      immunity: 75,
      adaptability: 70,
    },
    gateDescription: "Complete the Iron-Clad Lion training arc (mystery.jericho_jones, E1–E5).",
  },
  akai_shi: {
    displayName: "Akai Shi",
    archetype: "ghost",
    role: "navigator",
    stats: {
      resilience: 75,
      intellect: 70,
      reflexes: 90,
      empathy: 70,
      immunity: 80,
      adaptability: 80,
    },
    gateDescription:
      "Survive a global Necromancer event AND reach Imprint Tier 5 with Akai Shi.",
  },
  lycos: {
    displayName: "Lycos / The Wolf",
    archetype: "revenant",
    role: "security",
    stats: {
      resilience: 85,
      intellect: 70,
      reflexes: 90,
      empathy: 55,
      immunity: 75,
      adaptability: 80,
    },
    gateDescription:
      "Close the Antiquarian's hunt contract — either defeat all 10 lord lieutenants or drive crucible.league_strength to zero.",
  },
};

export const npcRecruitRouter = router({
  /** Show the player which NPCs are recruitable + the gate copy. */
  getRecruitableRoster: protectedProcedure.query(() => {
    return RESURRECTABLE_NPC_KEYS.map((key) => ({
      npcKey: key,
      ...NPC_TEMPLATE[key],
    }));
  }),

  /** Recruit a tier-5 NPC into the player's crew. Idempotent: if the
   *  NPC is already on the crew (status=active) returns ok with the
   *  existing memberKey. Refuses if the NPC is killed-in-world. */
  recruit: protectedProcedure
    .input(z.object({ npcKey: npcKeyEnum }))
    .mutation(async ({ ctx, input }) => {
      const state = await loadCrewState(ctx.user.id);
      if (!state) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      const tpl = NPC_TEMPLATE[input.npcKey];
      // Already on roster?
      const existing = state.roster.members.find(
        (m) => m.linkedNpcKey === input.npcKey,
      );
      if (existing) {
        return { ok: true, memberKey: existing.id, alreadyRecruited: true };
      }
      // Refuse if dead-in-world (Path A or B may have lifted by now;
      // we surface this as a gate). The detailed world-death check is
      // handled by the resurrection store; here we treat presence in
      // deceased as enough to refuse re-recruitment.
      const wasKilled = state.roster.deceased.find(
        (m) => m.linkedNpcKey === input.npcKey,
      );
      if (wasKilled) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "This NPC's recruited instance has died. Complete the Resurrection Protocols quest before recruiting again — and they may not consent to re-recruitment.",
        });
      }

      // Recruitment now requires a completed chain. The chain replaces
      // the previous soft-gate noted in the file's docstring. Outcomes:
      //   - recruited_loyal → high starting loyalty + stat buffs
      //   - recruited_tense → low starting loyalty + relationship tag
      //   - refused → router refuses
      //   - chain not opened or in progress → router refuses with
      //     guidance to open / advance.
      const progress = await getRecruitmentProgress(ctx.user.id, input.npcKey);
      if (progress.outcome === "refused") {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `${tpl.displayName} declined recruitment during the chain. They will not return.`,
        });
      }
      if (progress.outcome !== "recruited_loyal" && progress.outcome !== "recruited_tense") {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            progress.currentStageId === null
              ? `Open the recruitment chain for ${tpl.displayName} first.`
              : `Recruitment chain for ${tpl.displayName} is in progress (stage ${progress.currentStageId}). Reach a terminal outcome before recruiting.`,
        });
      }

      const now = Date.now();
      const mods = progress.recruitModifiers ?? {};
      const baseLoyalty =
        typeof mods.startingLoyalty === "number" ? mods.startingLoyalty : 75;
      const tweaks = (mods.statTweaks ?? {}) as Record<string, number>;
      const tweakedStats: SerializedCrewMember["stats"] = {
        resilience: clampStat(tpl.stats.resilience + (tweaks.resilience ?? 0)),
        intellect: clampStat(tpl.stats.intellect + (tweaks.intellect ?? 0)),
        reflexes: clampStat(tpl.stats.reflexes + (tweaks.reflexes ?? 0)),
        empathy: clampStat(tpl.stats.empathy + (tweaks.empathy ?? 0)),
        immunity: clampStat(tpl.stats.immunity + (tweaks.immunity ?? 0)),
        adaptability: clampStat(tpl.stats.adaptability + (tweaks.adaptability ?? 0)),
      };
      const tag = mods.relationshipTag;
      const biographyLine =
        progress.outcome === "recruited_loyal"
          ? `${tpl.displayName} joined the crew of the inception ark. Outcome: loyal${
              tag ? ` (${tag})` : ""
            }.`
          : `${tpl.displayName} joined the crew of the inception ark. Outcome: tense${
              tag ? ` (${tag})` : ""
            } — they came reluctantly.`;

      const member: SerializedCrewMember = {
        id: `npc-${input.npcKey}-${now}`,
        name: tpl.displayName,
        nickname: null,
        species: "human",
        gender: "non-binary",
        bloodlineId: `npc_${input.npcKey}` as SerializedCrewMember["bloodlineId"],
        generation: 1,
        parentIds: null,
        children: [],
        geneticTraits: tag ? [`recruit_${tag}`] : [],
        role: tpl.role,
        stats: tweakedStats,
        morale: progress.outcome === "recruited_loyal" ? 80 : 60,
        health: 100,
        loyalty: clampStat(baseLoyalty),
        status: "active",
        age: 30,
        maxAge: 80,
        missionHistory: [],
        relationships: {},
        birthCycle: 0,
        productionPath: "recruited",
        archetype: tpl.archetype,
        linkedNpcKey: input.npcKey,
        biography: [
          {
            cycle: 0,
            text: biographyLine,
            tag: "event",
          },
        ],
      };
      const next = addCrewMemberToState(state, member);
      await saveCrewState(ctx.user.id, next);
      return {
        ok: true,
        memberKey: member.id,
        alreadyRecruited: false,
        outcome: progress.outcome,
        relationshipTag: tag ?? null,
      };
    }),
});

function clampStat(n: number): number {
  return Math.max(1, Math.min(100, Math.round(n)));
}

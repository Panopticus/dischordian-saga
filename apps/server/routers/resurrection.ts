/* ═══════════════════════════════════════════════════════
   RESURRECTION ROUTER — Path A petition flow + Path B
   auto-resolution.

   Endpoints:
    - getOpenQuests: list open + recently-resolved quests.
    - markSubtaskComplete: progress a sub-task.
    - completePathA: finalize the petition; restore the NPC.
    - getBriefing: fetch the Human/Elara briefing scene.
    - drainSideEffects: idempotently consume crew-tick side-
      effects and open quests for fresh deaths.
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
  loadResurrectionStore,
  saveResurrectionStore,
  upsertQuest,
  upsertWorldDeath,
} from "../services/resurrectionStore";
import {
  openResurrectionQuest,
  markSubtaskComplete as markSubtaskCompleteFn,
  PROTOCOL_SUBTASKS,
  PROTOCOL_SUBTASK_IDS,
  RESURRECTION_BRIEFING,
  RESURRECTABLE_NPC_KEYS,
  isResurrectableNpc,
  generatePathAFirstLine,
  type ResurrectableNpcKey,
} from "../../shared/resurrectionProtocols";
import {
  recordNpcWorldDeath,
  markPathAResolved,
} from "../../shared/npcWorldDeathState";
import type { SerializedCrewMember } from "../../shared/crewPersistence";

const npcKeyEnum = z.enum(RESURRECTABLE_NPC_KEYS);
const subtaskIdEnum = z.enum(PROTOCOL_SUBTASK_IDS);

/** NPC display names (used in briefing copy). */
const NPC_DISPLAY: Record<ResurrectableNpcKey, string> = {
  vex_solene: "Vex Solène",
  wraith_calder: "Wraith Calder",
  locke: "Adjudicator Locke",
  jericho_jones: "Jericho Jones",
  akai_shi: "Akai Shi",
};

export const resurrectionRouter = router({
  /** List the player's quests and world-death records. */
  getState: protectedProcedure.query(async ({ ctx }) => {
    const store = await loadResurrectionStore(ctx.user.id);
    return {
      quests: store.quests,
      worldDeaths: store.worldDeaths,
      subtasks: PROTOCOL_SUBTASKS,
    };
  }),

  /** Briefing scene — Human + Elara introduce the protocols. */
  getBriefing: protectedProcedure
    .input(z.object({ npcKey: npcKeyEnum }))
    .query(({ input }) => {
      return {
        humanIntro: RESURRECTION_BRIEFING.human_intro(
          NPC_DISPLAY[input.npcKey],
        ),
        elaraIntro: RESURRECTION_BRIEFING.elara_intro(),
        humanPathBWarning: RESURRECTION_BRIEFING.human_path_b_warning(),
      };
    }),

  /** Drain crew-tick side-effects: open quests + record world deaths.
   *  Idempotent. Called by getState in the crew router after a tick;
   *  also exposed here for direct tests / out-of-band invocation. */
  drainSideEffects: protectedProcedure.mutation(async ({ ctx }) => {
    const state = await loadCrewState(ctx.user.id);
    if (!state || !state.pendingSideEffects?.length) {
      return { drained: 0 };
    }
    const { composeObituary } = await import("../../shared/loredexObituary");
    const { getMourningRemarks, pickMourningVariant } = await import(
      "../../shared/npcMourningRemarks"
    );

    let store = await loadResurrectionStore(ctx.user.id);
    let drained = 0;
    let obituaries = [...(state.obituaries ?? [])];
    const existingObituaryIds = new Set(obituaries.map((o) => o.id));

    const carrySvc = await import("../services/crewLoredexCarryService");
    /** Helper — compose & dedupe an obituary for a given member. */
    const ensureObituary = async (
      memberKey: string,
      missionName: string | undefined,
      now: number,
      resurrectionQuestId?: string,
    ): Promise<boolean> => {
      const id = `obituary.${memberKey}`;
      if (existingObituaryIds.has(id)) return false;
      const member =
        state.roster.deceased.find((m) => m.id === memberKey) ??
        state.roster.members.find((m) => m.id === memberKey);
      if (!member || !member.deathRecord) return false;
      const squadMemberKeys = state.roster.members
        .filter((m) => m.id !== memberKey)
        .map((m) => m.id)
        .slice(0, 8);
      // Real per-member loredex carry count — replaces the old
      // personalQuestStage proxy. Counted before the carry rows are
      // memorialised so we capture the unread-at-death count.
      let carriedUnreadCount = 0;
      try {
        carriedUnreadCount = await carrySvc.getCarriedUnreadCount(
          ctx.user.id,
          memberKey,
        );
      } catch {
        // Carry tracking is best-effort; missing data → 0.
      }
      try {
        const entry = composeObituary({
          member,
          squadMemberKeys,
          missionName,
          resurrectionQuestId,
          now,
          carriedUnreadCount,
        });
        obituaries = [...obituaries, entry];
        existingObituaryIds.add(id);
        return true;
      } catch {
        return false;
      }
    };

    /** Mourning-remarks queue accumulated for the crew feed. */
    const mourningFeed: Array<{
      deceasedKey: string;
      speakerKey: string;
      speakerDisplay: string;
      line: string;
      diedAtMs: number;
    }> = [];

    for (const eff of state.pendingSideEffects) {
      if (eff.kind === "npc_world_death") {
        if (!isResurrectableNpc(eff.npcKey)) continue;
        const rec = recordNpcWorldDeath({
          userId: ctx.user.id,
          npcKey: eff.npcKey as ResurrectableNpcKey,
          killedMemberKey: eff.killedMemberKey,
          diedAtCycle: eff.diedAtCycle,
          diedAtMs: eff.diedAtMs,
        });
        store = upsertWorldDeath(store, rec);
        drained++;
      } else if (eff.kind === "open_resurrection_quest") {
        if (!isResurrectableNpc(eff.npcKey)) continue;
        const exists = store.quests.find(
          (q) =>
            q.npcKey === eff.npcKey &&
            q.killedMemberKey === eff.killedMemberKey,
        );
        if (!exists) {
          const q = openResurrectionQuest({
            userId: ctx.user.id,
            npcKey: eff.npcKey as ResurrectableNpcKey,
            deathCycle: eff.deathCycle,
            killedMemberKey: eff.killedMemberKey,
            now: eff.diedAtMs,
          });
          store = upsertQuest(store, q);
          drained++;
        }
        // Obituary for the recruited NPC, linked to the quest if open.
        const linkedQuest = store.quests.find(
          (q) =>
            q.npcKey === eff.npcKey &&
            q.killedMemberKey === eff.killedMemberKey,
        );
        if (
          await ensureObituary(
            eff.killedMemberKey,
            undefined,
            eff.diedAtMs,
            linkedQuest?.id,
          )
        ) {
          drained++;
        }
      } else if (eff.kind === "apprentice_obituary") {
        if (await ensureObituary(eff.deceasedMemberKey, undefined, eff.diedAtMs)) {
          drained++;
        }
      } else if (eff.kind === "carry_memorial_sweep") {
        // Stamp memorialAtCycle on every unread loredex carry row for
        // the dead member. The entries become memorial-only — readable
        // from the Memorial Wall but gated out of the main loredex.
        try {
          await carrySvc.markMemorialOnDeath(
            ctx.user.id,
            eff.deceasedMemberKey,
            eff.deathCycle,
          );
          drained++;
        } catch (err) {
          // Don't block the drain on a memorial-sweep failure.
          // The unread rows stay un-memorialised; another tick can retry.
        }
      } else if (eff.kind === "mourning_sweep") {
        // Compose the deceased's obituary too — recruited NPCs without an
        // open_resurrection_quest still leave an entry behind.
        await ensureObituary(eff.deceasedMemberKey, undefined, eff.diedAtMs);
        // Build mourning remarks. Speakers come from two pools:
        //   1. Other recruited NPCs alive on the roster.
        //   2. Canonical NPCs the lore implies (elara, the_human, etc.) —
        //      always queued; the UI/dialog layer decides whether the
        //      speaker is reachable for the current player.
        const recruitedSpeakerKeys = state.roster.members
          .filter(
            (m) =>
              m.productionPath === "recruited" &&
              m.linkedNpcKey &&
              m.id !== eff.deceasedMemberKey &&
              m.status !== "dead",
          )
          .map((m) => m.linkedNpcKey)
          .filter((k): k is string => Boolean(k));
        const allRemarks = getMourningRemarks(eff.deceasedNpcKey);
        for (const remark of allRemarks) {
          // Recruited speakers must be present on the roster; canonical
          // speakers (elara, the_human, etc.) always pass through.
          const isRecruitable = ["vex_solene", "wraith_calder", "locke", "jericho_jones", "akai_shi"].includes(
            remark.speaker,
          );
          if (isRecruitable && !recruitedSpeakerKeys.includes(remark.speaker)) {
            continue;
          }
          const line = pickMourningVariant(remark, eff.diedAtMs);
          mourningFeed.push({
            deceasedKey: eff.deceasedNpcKey,
            speakerKey: remark.speaker,
            speakerDisplay: remark.speakerDisplay,
            line,
            diedAtMs: eff.diedAtMs,
          });
        }
        drained++;
      }
    }
    if (
      drained > 0 &&
      store !== (await loadResurrectionStore(ctx.user.id).catch(() => store))
    ) {
      await saveResurrectionStore(ctx.user.id, store);
    } else if (drained > 0) {
      await saveResurrectionStore(ctx.user.id, store);
    }
    // Append mourning lines to the crew feed using the canonical
    // SerializedFeedEntry shape (see crewPersistence.ts:199).
    const newFeedEntries = mourningFeed.map((m) => ({
      id: `mourning_${m.speakerKey}_${m.deceasedKey}_${m.diedAtMs}`,
      timestamp: m.diedAtMs,
      roomId: "the_commons",
      category: "memorial",
      text: `${m.speakerDisplay}: ${m.line}`,
      severity: "info" as const,
      actionable: false,
    }));
    // We've drained every kind we know about; clear them all so subsequent
    // ticks see a clean queue.
    const remaining = state.pendingSideEffects.filter(
      (eff) =>
        eff.kind !== "npc_world_death" &&
        eff.kind !== "open_resurrection_quest" &&
        eff.kind !== "apprentice_obituary" &&
        eff.kind !== "mourning_sweep" &&
        eff.kind !== "carry_memorial_sweep",
    );
    await saveCrewState(ctx.user.id, {
      ...state,
      pendingSideEffects: remaining,
      obituaries,
      feed: [...state.feed, ...newFeedEntries].slice(-200),
    });
    return { drained };
  }),

  /** Mark a sub-task complete. Validated by the caller's UI; the
   *  cross-system completion proofs (e.g. an actual breeding) happen
   *  on the calling system's side and ping this endpoint. */
  markSubtaskComplete: protectedProcedure
    .input(z.object({ questId: z.string(), subtaskId: subtaskIdEnum }))
    .mutation(async ({ ctx, input }) => {
      const store = await loadResurrectionStore(ctx.user.id);
      const quest = store.quests.find((q) => q.id === input.questId);
      if (!quest) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Quest not found" });
      }
      const updated = markSubtaskCompleteFn(quest, input.subtaskId, Date.now());
      const next = upsertQuest(store, updated);
      await saveResurrectionStore(ctx.user.id, next);
      return { quest: updated };
    }),

  /** Complete Path A — restore the NPC's crew slot on the ark, lift
   *  the world-block. Only valid when all subtasks are complete. */
  completePathA: protectedProcedure
    .input(z.object({ questId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      let store = await loadResurrectionStore(ctx.user.id);
      const quest = store.quests.find((q) => q.id === input.questId);
      if (!quest) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Quest not found" });
      }
      if (quest.status !== "completed_path_a") {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "All sub-tasks must be complete before Path A",
        });
      }
      const wd = store.worldDeaths.find(
        (r) => r.npcKey === quest.npcKey && r.killedMemberKey === quest.killedMemberKey,
      );
      if (!wd) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "World-death record missing",
        });
      }
      // Restore the NPC's crew slot. Preserve the death record (the
      // resurrected NPC remembers their death). cloneDegradation = 1 is
      // the Samsara echo cost — a second death is true permadeath.
      const state = await loadCrewState(ctx.user.id);
      if (!state) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Crew state missing",
        });
      }
      const fallen = state.roster.deceased.find(
        (m) => m.id === quest.killedMemberKey,
      );
      if (!fallen) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Fallen NPC not in deceased roster",
        });
      }
      const restored: SerializedCrewMember = {
        ...fallen,
        status: "active" as const,
        health: 80,
        morale: 60,
        loyalty: Math.min(100, fallen.loyalty + 50),
        productionPath: "resurrected",
        cloneDegradation: 1,
        biography: [
          ...(fallen.biography ?? []),
          {
            cycle: fallen.age,
            text: `The Resurrection Protocols completed. The Cycle Walker heard the petition. ${fallen.name} returned to the ark — bearing the memory of their death.`,
            tag: "epitaph",
          },
        ],
      };
      const nextState = addCrewMemberToState(
        {
          ...state,
          roster: {
            ...state.roster,
            deceased: state.roster.deceased.filter(
              (m) => m.id !== quest.killedMemberKey,
            ),
          },
        },
        restored,
      );
      await saveCrewState(ctx.user.id, nextState);
      store = upsertWorldDeath(store, markPathAResolved(wd));
      await saveResurrectionStore(ctx.user.id, store);
      // Compose the first-line interpolation from the death memory.
      const firstLine = fallen.deathRecord
        ? generatePathAFirstLine(
            quest.npcKey,
            {
              missionId: "unknown",
              missionName: fallen.deathRecord.cause.replace(/^Lost during /, ""),
              squadIds: [],
              causeShort: fallen.deathRecord.cause,
              lastWords: fallen.deathRecord.lastWords,
            },
            {},
            quest.deathCycle,
          )
        : `${fallen.name}: I am back.`;
      return { ok: true, restoredMemberId: restored.id, firstLine };
    }),
});

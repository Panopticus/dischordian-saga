/* ═══════════════════════════════════════════════════════
   COMMONS ROUTER — Social-room scene rolls + cohesion.

   Returns the player's current cohesion state and rolls
   scenes when the player enters the Commons. Each scene
   action (Approach / Eavesdrop / Leave) writes back to
   the relationship graph.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  loadCrewState,
  saveCrewState,
} from "../services/crewState";
import {
  recomputeSocialGroup,
  WEATHER_MULTIPLIER,
} from "../../shared/crewSocialGroup";
import {
  rollCommonsScenes,
  COMMONS_SCENE_POOL,
  type ParticipantTag,
} from "../../shared/commonsScenePool";
import type { SerializedCrewMember } from "../../shared/crewPersistence";

/** Build the participant set from a crew member's archetype/linkedNpcKey. */
function participantTagFor(
  m: SerializedCrewMember,
): ParticipantTag | undefined {
  if (m.linkedNpcKey) {
    return m.linkedNpcKey as ParticipantTag;
  }
  if (m.archetype) {
    return m.archetype as ParticipantTag;
  }
  return undefined;
}

export const commonsRouter = router({
  /** Returns the social weather + open tensions + known bonds. */
  getState: protectedProcedure.query(async ({ ctx }) => {
    const state = await loadCrewState(ctx.user.id);
    if (!state) return null;
    const social = recomputeSocialGroup({
      members: state.roster.members,
    });
    return {
      ...social,
      weatherMultiplier: WEATHER_MULTIPLIER[social.weather],
    };
  }),

  /** Roll up to N scenes for the current Commons occupancy. */
  rollScenes: protectedProcedure
    .input(z.object({ count: z.number().min(1).max(5).optional() }))
    .query(async ({ ctx, input }) => {
      const state = await loadCrewState(ctx.user.id);
      if (!state) return [];
      const present = new Set<ParticipantTag>();
      for (const m of state.roster.members) {
        const tag = participantTagFor(m);
        if (tag) present.add(tag);
      }
      const scenes = rollCommonsScenes({
        present,
        playedIds: new Set(),
        seed: Date.now(),
        count: input.count ?? 3,
      });
      return scenes;
    }),

  /** The player approaches a scene and picks an option. Apply the
   *  bond delta to all participants symmetrically. */
  approachScene: protectedProcedure
    .input(
      z.object({
        sceneId: z.string(),
        choiceIndex: z.number().min(0).max(3),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const scene = COMMONS_SCENE_POOL.find((s) => s.id === input.sceneId);
      if (!scene) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Scene not found" });
      }
      const choice = scene.approachChoices[input.choiceIndex];
      if (!choice) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid choice" });
      }
      const state = await loadCrewState(ctx.user.id);
      if (!state) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      // Apply bondDelta to every pair of participants present.
      const presentMembers = state.roster.members.filter((m) => {
        const tag = participantTagFor(m);
        return tag && scene.participants.includes(tag);
      });
      const updatedMembers = state.roster.members.map((m) => {
        if (!presentMembers.find((p) => p.id === m.id)) return m;
        const rels = { ...m.relationships };
        for (const other of presentMembers) {
          if (other.id === m.id) continue;
          rels[other.id] = Math.max(
            -100,
            Math.min(100, (rels[other.id] ?? 0) + choice.bondDelta),
          );
        }
        return { ...m, relationships: rels };
      });
      const next = {
        ...state,
        roster: { ...state.roster, members: updatedMembers },
      };
      await saveCrewState(ctx.user.id, next);
      return { ok: true, consequence: choice.consequence };
    }),

  /** Eavesdrop: small bond delta for the listener (the player), no
   *  change to participants. Returns the journal text. */
  eavesdrop: protectedProcedure
    .input(z.object({ sceneId: z.string() }))
    .mutation(async ({ input }) => {
      const scene = COMMONS_SCENE_POOL.find((s) => s.id === input.sceneId);
      if (!scene) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return {
        ok: true,
        journal: scene.lines.map((l) => `${l.speaker}: ${l.text}`).join("\n"),
      };
    }),
});

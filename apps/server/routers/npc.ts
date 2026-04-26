/* ═══════════════════════════════════════════════════════
   NPC ROUTER — Stage 1 unified NPC infrastructure
   Per the priority plan §Stage 1+ Phase 1.

   Provides:
   - getTrust(npcKey) — read trust state via adapter or npc_trust table
   - emitReaction(event, context) — record line played, advance trust,
     emit ripple
   - getDialogueFor(npcKey, surface, context) — server-side selector
     entry point (also callable client-side via tRPC)
   - getPublicFlags() — read cross-NPC public-flag set
   - setPublicFlag(flag, setBy) — write a public flag

   Per-NPC trust resolution:
     - elara / the_human  → companionAdapter (companionStats source)
     - your_eidolon       → eidolonBondAdapter (eidolonBonds table)
     - adjudicator_locke  → lockeRelationshipAdapter (lockeRelationship store)
     - all others         → npc_trust table direct

   Silent-fail contract: getDialogueFor returns null if no line matches.
   Caller renders default UI. Lint enforces every (npcKey, surface)
   pair has a catch-all line in the corresponding bank.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import {
  npcTrust,
  npcLineHistory,
  npcPublicFlags,
  npcAskTopicHistory,
  npcDialogTreeState,
  eidolonBonds,
} from "../../db/schema";
import { and, desc, eq } from "drizzle-orm";
import { ripple } from "../services/rippleEngine";
import { logger } from "../logger";
import {
  NPC_REGISTRY,
  resolveTrustBand,
  isKnownBand,
  isKnownRevealStage,
} from "../../shared/npcs/registry";
import {
  eidolonBondToTrustState,
} from "../../shared/npcs/adapters/eidolonBondAdapter";
import type { NpcKey, TrustState } from "../../shared/npcs/types";

// --- Validation -----------------------------------------------------------

const npcKeySchema = z.string().refine(
  (val): val is NpcKey => val in NPC_REGISTRY,
  { message: "unknown npcKey" },
);

// --- Trust resolution -----------------------------------------------------

/**
 * Resolve TrustState for an arbitrary NPC. Routes to the appropriate
 * adapter or to the npc_trust table.
 *
 * Locke + Elara + Human adapters require additional sources we don't have
 * cleanly here — those NPCs use their existing client-side stores and
 * don't yet have server-side TrustState resolution. They fall through to
 * the npc_trust table (which stores 0 by default; client-side overrides
 * apply at render time). This is a Phase-3 gap to close per-character.
 */
async function resolveTrustState(
  userId: number,
  npcKey: NpcKey,
): Promise<TrustState> {
  const profile = NPC_REGISTRY[npcKey];

  // Eidolon: read eidolonBonds (only for the player's primary Eidolon).
  if (npcKey === "your_eidolon") {
    const db = await getDb();
    if (db) {
      const rows = await db
        .select()
        .from(eidolonBonds)
        .where(eq(eidolonBonds.userId, userId))
        .limit(1);
      const row = rows[0];
      if (row) {
        return eidolonBondToTrustState({
          bond: row.bond,
          stage: row.stage,
          isResonant: row.isResonant,
          isSoulBound: row.isSoulBound,
          updatedAt: row.lastInteraction ?? undefined,
        });
      }
    }
    // Fallback: zero state.
    return makeEmptyTrustState(npcKey, profile.trustBands[0]?.band ?? "untuned");
  }

  // All other NPCs: read npc_trust table.
  return readNpcTrustRow(userId, npcKey);
}

async function readNpcTrustRow(
  userId: number,
  npcKey: NpcKey,
): Promise<TrustState> {
  const profile = NPC_REGISTRY[npcKey];
  const db = await getDb();
  if (!db) {
    return makeEmptyTrustState(npcKey, profile.trustBands[0]?.band ?? "unknown");
  }
  const rows = await db
    .select()
    .from(npcTrust)
    .where(and(eq(npcTrust.userId, userId), eq(npcTrust.npcKey, npcKey)))
    .limit(1);
  const row = rows[0];
  if (!row) {
    return makeEmptyTrustState(npcKey, profile.trustBands[0]?.band ?? "unknown");
  }
  const trust = clamp(row.trust, 0, 100);
  const band = resolveTrustBand(npcKey, trust);
  return {
    npcKey,
    trust,
    band,
    flags: new Set(row.flags ?? []),
    revealStage: row.revealStage ?? undefined,
    lastInteractionAt: row.lastInteractionAt?.getTime?.(),
  };
}

function makeEmptyTrustState(npcKey: NpcKey, band: string): TrustState {
  return {
    npcKey,
    trust: 0,
    band,
    flags: new Set<string>(),
    revealStage: undefined,
    lastInteractionAt: undefined,
  };
}

function clamp(value: number, lo: number, hi: number): number {
  if (!Number.isFinite(value)) return lo;
  if (value < lo) return lo;
  if (value > hi) return hi;
  return Math.round(value);
}

// --- Public flag I/O ------------------------------------------------------

async function readPublicFlags(userId: number): Promise<Set<string>> {
  const db = await getDb();
  if (!db) return new Set();
  const rows = await db
    .select({ flag: npcPublicFlags.flag })
    .from(npcPublicFlags)
    .where(eq(npcPublicFlags.userId, userId));
  return new Set(rows.map(r => r.flag));
}

async function writePublicFlag(
  userId: number,
  flag: string,
  setBy?: NpcKey,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  // Idempotent insert; unique index on (userId, flag).
  try {
    await db
      .insert(npcPublicFlags)
      .values({ userId, flag, setBy: setBy ?? null });
  } catch (err) {
    // Likely unique-violation; ignore (flag already set).
    logger?.debug?.("npc.setPublicFlag: insert skipped (likely duplicate)", { err });
  }
}

// --- Trust mutations ------------------------------------------------------

async function applyTrustDelta(
  userId: number,
  npcKey: NpcKey,
  delta: number,
): Promise<TrustState> {
  if (delta === 0) return resolveTrustState(userId, npcKey);

  const db = await getDb();
  if (!db) return resolveTrustState(userId, npcKey);

  // Eidolon: writes go through the bespoke eidolonBonds store; this router
  // does NOT mutate that store directly. Writers should use the existing
  // eidolonBond router for Eidolon-specific bond changes.
  if (npcKey === "your_eidolon") {
    logger?.warn?.(
      "npc.applyTrustDelta: Eidolon bond changes must go through eidolonBond router",
      { npcKey, delta },
    );
    return resolveTrustState(userId, npcKey);
  }

  const current = await readNpcTrustRow(userId, npcKey);
  const nextTrust = clamp(current.trust + delta, 0, 100);

  // Upsert. drizzle-orm doesn't have native upsert across all dialects;
  // use insert + on-duplicate-update via raw or a select-then-update.
  const existing = await db
    .select({ id: npcTrust.id })
    .from(npcTrust)
    .where(and(eq(npcTrust.userId, userId), eq(npcTrust.npcKey, npcKey)))
    .limit(1);

  if (existing.length > 0 && existing[0]?.id) {
    await db
      .update(npcTrust)
      .set({
        trust: nextTrust,
        lastInteractionAt: new Date(),
      })
      .where(eq(npcTrust.id, existing[0].id));
  } else {
    await db.insert(npcTrust).values({
      userId,
      npcKey,
      trust: nextTrust,
      lastInteractionAt: new Date(),
    });
  }

  return resolveTrustState(userId, npcKey);
}

// --- Router ---------------------------------------------------------------

export const npcRouter = router({
  /** Read TrustState for a single NPC. */
  getTrust: protectedProcedure
    .input(z.object({ npcKey: npcKeySchema }))
    .query(async ({ ctx, input }) => {
      const state = await resolveTrustState(ctx.user.id, input.npcKey as NpcKey);
      // Serialize Set → array for JSON.
      return {
        ...state,
        flags: Array.from(state.flags),
      };
    }),

  /** Read all priority-roster trust states in one round-trip. */
  getAllTrust: protectedProcedure.query(async ({ ctx }) => {
    const keys = Object.keys(NPC_REGISTRY) as NpcKey[];
    const states = await Promise.all(
      keys.map(k => resolveTrustState(ctx.user.id, k)),
    );
    return states.map(s => ({ ...s, flags: Array.from(s.flags) }));
  }),

  /**
   * Record that a line played. Inserts npc_line_history, optionally applies
   * trustDelta, optionally writes public flags, optionally emits ripple.
   * Idempotent on (userId, lineId, heardAt-second-precision).
   */
  recordLinePlayed: protectedProcedure
    .input(
      z.object({
        npcKey: npcKeySchema,
        lineId: z.string().min(1).max(256),
        trustDelta: z.number().int().min(-100).max(100).optional(),
        publicFlags: z.array(z.string().min(1).max(256)).optional(),
        rippleEvent: z.string().min(1).max(64).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const npcKey = input.npcKey as NpcKey;
      const db = await getDb();
      if (!db) return { ok: false, reason: "no_db" };

      await db.insert(npcLineHistory).values({
        userId,
        npcKey,
        lineId: input.lineId,
      });

      let trustState: TrustState | undefined;
      if (input.trustDelta) {
        trustState = await applyTrustDelta(userId, npcKey, input.trustDelta);
      }

      if (input.publicFlags?.length) {
        await Promise.all(
          input.publicFlags.map(f => writePublicFlag(userId, f, npcKey)),
        );
      }

      if (input.rippleEvent) {
        try {
          ripple.emit(input.rippleEvent, {
            userId,
            npcKey,
            lineId: input.lineId,
          });
        } catch (err) {
          logger?.warn?.("npc.ripple emit failed", { err, event: input.rippleEvent });
        }
      }

      return {
        ok: true,
        trust: trustState
          ? { ...trustState, flags: Array.from(trustState.flags) }
          : undefined,
      };
    }),

  /** Read line-history for cooldownKey + maxPlays enforcement. */
  getLineHistory: protectedProcedure
    .input(z.object({ npcKey: npcKeySchema }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db
        .select()
        .from(npcLineHistory)
        .where(
          and(
            eq(npcLineHistory.userId, ctx.user.id),
            eq(npcLineHistory.npcKey, input.npcKey),
          ),
        );
      return rows.map(r => ({
        lineId: r.lineId,
        heardAt: r.heardAt.getTime(),
      }));
    }),

  /** Read all cross-NPC public flags for the user. */
  getPublicFlags: protectedProcedure.query(async ({ ctx }) => {
    const flags = await readPublicFlags(ctx.user.id);
    return Array.from(flags);
  }),

  /** Set a single cross-NPC public flag. */
  setPublicFlag: protectedProcedure
    .input(
      z.object({
        flag: z.string().min(1).max(256),
        setBy: npcKeySchema.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await writePublicFlag(
        ctx.user.id,
        input.flag,
        input.setBy as NpcKey | undefined,
      );
      return { ok: true };
    }),

  /**
   * Set trust band for an NPC directly (admin / debug only). Most callers
   * should use recordLinePlayed with a trustDelta instead. Validates the
   * band against the NPC's canonical ladder.
   */
  setTrustBand: protectedProcedure
    .input(
      z.object({
        npcKey: npcKeySchema,
        band: z.string().min(1).max(64),
        revealStage: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const npcKey = input.npcKey as NpcKey;
      if (!isKnownBand(npcKey, input.band)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Unknown band "${input.band}" for ${npcKey}`,
        });
      }
      if (input.revealStage && !isKnownRevealStage(npcKey, input.revealStage)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Unknown revealStage "${input.revealStage}" for ${npcKey}`,
        });
      }
      // Find the threshold for the requested band.
      const profile = NPC_REGISTRY[npcKey];
      const def = profile.trustBands.find(d => d.band === input.band);
      if (!def) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Band "${input.band}" not found for ${npcKey}`,
        });
      }
      const db = await getDb();
      if (!db) return { ok: false, reason: "no_db" };
      const userId = ctx.user.id;
      const existing = await db
        .select({ id: npcTrust.id })
        .from(npcTrust)
        .where(and(eq(npcTrust.userId, userId), eq(npcTrust.npcKey, npcKey)))
        .limit(1);
      if (existing.length > 0 && existing[0]?.id) {
        await db
          .update(npcTrust)
          .set({
            trust: def.threshold,
            revealStage: input.revealStage ?? null,
            lastInteractionAt: new Date(),
          })
          .where(eq(npcTrust.id, existing[0].id));
      } else {
        await db.insert(npcTrust).values({
          userId,
          npcKey,
          trust: def.threshold,
          revealStage: input.revealStage ?? null,
          lastInteractionAt: new Date(),
        });
      }
      const next = await resolveTrustState(userId, npcKey);
      return {
        ok: true,
        trust: { ...next, flags: Array.from(next.flags) },
      };
    }),

  // ────────────────────────────────────────────────────────────────
  // PHASE 6 INFRASTRUCTURE D5 — ask-topics + dialog tree state
  // See apps/shared/npcs/askTopics.ts (AskTopic registry) +
  // apps/shared/npcs/dialogTrees/ (per-NPC trees) +
  // apps/shared/npcs/conversationRunner.ts (state machine).
  // ────────────────────────────────────────────────────────────────

  /**
   * Read ask-topic history for a single NPC. Drives the "you've already
   * asked this; here's the canonical re-entry response" pattern. Returns
   * topicId + askedAt-epoch-ms ordered most-recent-first.
   */
  getAskTopicHistory: protectedProcedure
    .input(z.object({ npcKey: npcKeySchema }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db
        .select()
        .from(npcAskTopicHistory)
        .where(
          and(
            eq(npcAskTopicHistory.userId, ctx.user.id),
            eq(npcAskTopicHistory.npcKey, input.npcKey),
          ),
        )
        .orderBy(desc(npcAskTopicHistory.askedAt));
      return rows.map((r) => ({
        topicId: r.topicId,
        askedAt: r.askedAt.getTime(),
      }));
    }),

  /**
   * Record that a player asked a topic. Inserts npc_ask_topic_history;
   * one row per ask event so the resolver can count repeats if a topic
   * ever wants per-ask escalation.
   */
  recordAskTopicAsked: protectedProcedure
    .input(
      z.object({
        npcKey: npcKeySchema,
        topicId: z.string().min(1).max(256),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { ok: false, reason: "no_db" };
      await db.insert(npcAskTopicHistory).values({
        userId: ctx.user.id,
        npcKey: input.npcKey as NpcKey,
        topicId: input.topicId,
      });
      return { ok: true };
    }),

  /**
   * Read in-flight dialog-tree state for a single (npcKey, treeId).
   * Returns null when no state exists (player has never started this
   * tree or completed it cleanly without resume-state).
   */
  getDialogTreeState: protectedProcedure
    .input(
      z.object({
        npcKey: npcKeySchema,
        treeId: z.string().min(1).max(256),
      }),
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db
        .select()
        .from(npcDialogTreeState)
        .where(
          and(
            eq(npcDialogTreeState.userId, ctx.user.id),
            eq(npcDialogTreeState.npcKey, input.npcKey),
            eq(npcDialogTreeState.treeId, input.treeId),
          ),
        )
        .limit(1);
      const row = rows[0];
      if (!row) return null;
      return {
        npcKey: row.npcKey,
        treeId: row.treeId,
        currentNodeId: row.currentNodeId,
        completedAt: row.completedAt?.getTime() ?? null,
        startedAt: row.startedAt.getTime(),
        updatedAt: row.updatedAt.getTime(),
      };
    }),

  /**
   * Write dialog-tree state. Upsert on (userId, npcKey, treeId) — the
   * unique index enforces one in-flight state per tree. Pass
   * `currentNodeId: null` + `completed: true` to mark the tree as
   * completed; pass a node id to checkpoint mid-walk.
   */
  setDialogTreeState: protectedProcedure
    .input(
      z.object({
        npcKey: npcKeySchema,
        treeId: z.string().min(1).max(256),
        currentNodeId: z.string().min(1).max(256).nullable(),
        completed: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { ok: false, reason: "no_db" };
      const userId = ctx.user.id;
      const npcKey = input.npcKey as NpcKey;
      const completedAt = input.completed ? new Date() : null;

      const existing = await db
        .select({ id: npcDialogTreeState.id })
        .from(npcDialogTreeState)
        .where(
          and(
            eq(npcDialogTreeState.userId, userId),
            eq(npcDialogTreeState.npcKey, npcKey),
            eq(npcDialogTreeState.treeId, input.treeId),
          ),
        )
        .limit(1);

      if (existing.length > 0 && existing[0]?.id) {
        await db
          .update(npcDialogTreeState)
          .set({
            currentNodeId: input.currentNodeId,
            completedAt,
          })
          .where(eq(npcDialogTreeState.id, existing[0].id));
      } else {
        await db.insert(npcDialogTreeState).values({
          userId,
          npcKey,
          treeId: input.treeId,
          currentNodeId: input.currentNodeId,
          completedAt,
        });
      }
      return { ok: true };
    }),
});

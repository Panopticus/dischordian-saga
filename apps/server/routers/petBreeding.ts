/* ═══════════════════════════════════════════════════════
   PET BREEDING ROUTER

   tRPC surface for the breeding queue declared in
   docs/production/BREEDING_SYSTEM_ART_PROMPTS.md. Persists
   breeding pairs in `pet_breeding_pairs` (apps/db/schema.ts);
   resolves offspring at completion via `breedPets()` in
   `apps/shared/petBreeding.ts`.

   Procedures:
     start    — queue a pair (transitions queued → incubating).
     complete — resolve offspring, transition incubating → ready.
     cancel   — abandon a pair, transition → cancelled.
     list     — return the player's active pairs.

   All mutations are wrapped in `db.transaction` so a partial
   write can never leave a row half-resolved.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, inArray } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { petBreedingPairs, playerPets } from "../../db/schema";
import { breedPets, type BreedingParent } from "@shared/petBreeding";

/** Active statuses returned by `list` — claimed/cancelled are filtered out. */
const ACTIVE_STATUSES = ["queued", "incubating", "ready"] as const;

/**
 * Map a `playerPets` row to the minimal `BreedingParent` shape
 * the shared module needs. Stats fall back to evolution-stage
 * scaled defaults when the row predates per-pet stat columns
 * (which the MVP schema doesn't yet include).
 */
function toBreedingParent(row: typeof playerPets.$inferSelect): BreedingParent {
  const stage = Math.max(1, row.evolutionStage);
  return {
    id: row.id,
    species: row.species,
    attrAttack: 8 + stage * 2,
    attrDefense: 6 + stage * 2,
    attrVitality: 10 + stage * 3,
  };
}

export const petBreedingRouter = router({
  /** List the player's active breeding pairs. */
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(petBreedingPairs)
      .where(
        and(
          eq(petBreedingPairs.userId, ctx.user.id),
          inArray(petBreedingPairs.status, [...ACTIVE_STATUSES]),
        ),
      )
      .orderBy(desc(petBreedingPairs.queuedAt));
  }),

  /**
   * Queue a new pair. Validates ownership of both parents, then
   * inserts a row and immediately transitions it to `incubating`
   * so the MVP UX has something to "complete". A future pass can
   * gate this on a real-world timer.
   */
  start: protectedProcedure
    .input(
      z.object({
        parentAId: z.number().int().positive(),
        parentBId: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.parentAId === input.parentBId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A pet cannot breed with itself.",
        });
      }
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }
      return db.transaction(async (tx) => {
        const owned = await tx
          .select()
          .from(playerPets)
          .where(
            and(
              eq(playerPets.userId, ctx.user.id),
              inArray(playerPets.id, [input.parentAId, input.parentBId]),
            ),
          );
        if (owned.length < 2) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You must own both pets to breed them.",
          });
        }
        const now = new Date();
        const [result] = await tx.insert(petBreedingPairs).values({
          userId: ctx.user.id,
          parentAId: input.parentAId,
          parentBId: input.parentBId,
          status: "incubating",
          queuedAt: now,
          startedAt: now,
        });
        const insertId = (result as { insertId: number }).insertId;
        return { id: insertId, status: "incubating" as const };
      });
    }),

  /**
   * Complete an incubating pair. Reads the pair, looks up both
   * parents, computes the offspring blueprint, stores it on the
   * row, and transitions to `ready`. Idempotent on `ready` rows
   * (returns the stored payload without re-rolling).
   */
  complete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }
      return db.transaction(async (tx) => {
        const [pair] = await tx
          .select()
          .from(petBreedingPairs)
          .where(
            and(
              eq(petBreedingPairs.id, input.id),
              eq(petBreedingPairs.userId, ctx.user.id),
            ),
          )
          .limit(1);
        if (!pair) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Breeding pair not found.",
          });
        }
        if (pair.status === "ready") {
          return { id: pair.id, status: "ready" as const, offspring: pair.offspringPayload };
        }
        if (pair.status !== "incubating") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Pair is ${pair.status}; cannot complete.`,
          });
        }

        const parents = await tx
          .select()
          .from(playerPets)
          .where(inArray(playerPets.id, [pair.parentAId, pair.parentBId]));
        const parentA = parents.find((p) => p.id === pair.parentAId);
        const parentB = parents.find((p) => p.id === pair.parentBId);
        if (!parentA || !parentB) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "One or both parents are no longer available.",
          });
        }

        const offspring = breedPets(
          toBreedingParent(parentA),
          toBreedingParent(parentB),
          pair.parentAId + pair.parentBId + Date.now(),
        );
        const readyAt = new Date();
        await tx
          .update(petBreedingPairs)
          .set({
            status: "ready",
            readyAt,
            offspringPayload: offspring as unknown as Record<string, unknown>,
          })
          .where(eq(petBreedingPairs.id, pair.id));

        return { id: pair.id, status: "ready" as const, offspring };
      });
    }),

  /** Cancel a pair. Only owner can cancel. Terminal status. */
  cancel: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });
      }
      return db.transaction(async (tx) => {
        const [pair] = await tx
          .select()
          .from(petBreedingPairs)
          .where(
            and(
              eq(petBreedingPairs.id, input.id),
              eq(petBreedingPairs.userId, ctx.user.id),
            ),
          )
          .limit(1);
        if (!pair) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Breeding pair not found.",
          });
        }
        if (pair.status === "claimed" || pair.status === "cancelled") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Pair is already ${pair.status}.`,
          });
        }
        await tx
          .update(petBreedingPairs)
          .set({ status: "cancelled" })
          .where(eq(petBreedingPairs.id, pair.id));
        return { id: pair.id, status: "cancelled" as const };
      });
    }),
});

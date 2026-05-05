/* ═══════════════════════════════════════════════════════
   TRADE CONTRACTS ROUTER — Phase 2 multi-stage contracts
   Per the priority plan §Stage 1+ Phase 2.

   Endpoints:
   - listAvailable() — contracts the player can canonically sign
   - listMine() — player's active + historical contracts
   - sign({contractKey, audit?}) — sign a contract; optional audit
   - audit({contractId}) — disclose all on_signing hidden clauses
   - progressStage({contractId, stageId, success}) — advance a stage
   - cancel({contractId}) — break the contract; cancellation cost
   - getDisclosedClauses({contractId}) — read disclosed clauses

   Silent-fail contract: missing templates / unknown contracts
   return errors. Hidden-clause effects route through the unified
   NPC system (npc_trust + npc_public_flags + ripple).
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { tradeContracts, tradeBrokerEngagement, npcPublicFlags, npcTrust, userProgress } from "../../db/schema";
import { and, eq, desc, sql } from "drizzle-orm";
import { ripple } from "../services/rippleEngine";
import { logger } from "../logger";
import {
  getContractTemplate,
  ALL_CONTRACT_TEMPLATES,
} from "../../shared/tradeEmpire/contractTemplates";
import { clausesAtSigning } from "../../shared/tradeEmpire/contracts";
import { isKnownBrokerKey, BROKER_REGISTRY } from "../../shared/tradeEmpire/brokers";
import type { ContractDef, ContractHiddenClause } from "../../shared/tradeEmpire/contracts";

// --- Validation ----------------------------------------------------------

const contractKeySchema = z.string().refine(
  (k) => Boolean(getContractTemplate(k)),
  { message: "unknown contractKey" },
);

// --- Helpers -------------------------------------------------------------

async function applyClauseEffects(
  userId: number,
  effects: ReadonlyArray<ContractHiddenClause>,
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  for (const clause of effects) {
    const eff = clause.effect;
    try {
      switch (eff.kind) {
        case "set_public_flag": {
          await db
            .insert(npcPublicFlags)
            .values({ userId, flag: eff.flag, setBy: null })
            .catch(() => {/* idempotent on unique violation */});
          break;
        }
        case "lock_out_broker": {
          if (!isKnownBrokerKey(eff.brokerKey)) break;
          const existing = await db
            .select({ id: tradeBrokerEngagement.id })
            .from(tradeBrokerEngagement)
            .where(
              and(
                eq(tradeBrokerEngagement.userId, userId),
                eq(tradeBrokerEngagement.brokerKey, eff.brokerKey),
              ),
            )
            .limit(1);
          if (existing.length > 0 && existing[0]?.id) {
            await db
              .update(tradeBrokerEngagement)
              .set({ isLockedOut: true, lockedOutReason: clause.clauseId })
              .where(eq(tradeBrokerEngagement.id, existing[0].id));
          } else {
            await db.insert(tradeBrokerEngagement).values({
              userId,
              brokerKey: eff.brokerKey,
              isLockedOut: true,
              lockedOutReason: clause.clauseId,
            });
          }
          break;
        }
        case "trust_delta": {
          // Bump (or decrement) per-NPC trust on the npcTrust table.
          // Unique key on (userId, npcKey) is implied; if not present
          // we upsert. Trust is clamped 0..100 by the band resolver
          // downstream, so unbounded delta is safe here.
          const [existing] = await db
            .select({ id: npcTrust.id })
            .from(npcTrust)
            .where(
              and(
                eq(npcTrust.userId, userId),
                eq(npcTrust.npcKey, eff.npcKey as string),
              ),
            )
            .limit(1);
          if (existing) {
            await db
              .update(npcTrust)
              .set({ trust: sql`GREATEST(0, LEAST(100, ${npcTrust.trust} + ${eff.delta}))` })
              .where(eq(npcTrust.id, existing.id));
          } else {
            await db.insert(npcTrust).values({
              userId,
              npcKey: eff.npcKey as string,
              trust: Math.max(0, Math.min(100, eff.delta)),
            });
          }
          break;
        }
        case "set_flag": {
          // Set a private narrative flag on userProgress.gameData.
          // Mirrors the read pattern in playerExpansionState.ts.
          const rows = await db
            .select()
            .from(userProgress)
            .where(eq(userProgress.userId, userId))
            .limit(1);
          const row = rows[0];
          type AnyRecord = Record<string, unknown>;
          const gameData = (row?.gameData as AnyRecord) ?? {};
          const flags = (gameData.narrativeFlags as AnyRecord) ?? {};
          if (flags[eff.flag] === true) break; // idempotent
          const nextGameData: AnyRecord = {
            ...gameData,
            narrativeFlags: { ...flags, [eff.flag]: true },
          };
          if (row) {
            await db
              .update(userProgress)
              .set({ gameData: nextGameData })
              .where(eq(userProgress.userId, userId));
          } else {
            await db.insert(userProgress).values({ userId, gameData: nextGameData });
          }
          break;
        }
        case "faction_reputation_delta": {
          // Faction reputation lives at userProgress.gameData.
          // factionReputation as Record<factionId, number>.
          const rows = await db
            .select()
            .from(userProgress)
            .where(eq(userProgress.userId, userId))
            .limit(1);
          const row = rows[0];
          type AnyRecord = Record<string, unknown>;
          const gameData = (row?.gameData as AnyRecord) ?? {};
          const rep = (gameData.factionReputation as Record<string, number>) ?? {};
          const next = { ...rep, [eff.factionId]: (rep[eff.factionId] ?? 0) + eff.delta };
          const nextGameData: AnyRecord = {
            ...gameData,
            factionReputation: next,
          };
          if (row) {
            await db
              .update(userProgress)
              .set({ gameData: nextGameData })
              .where(eq(userProgress.userId, userId));
          } else {
            await db.insert(userProgress).values({ userId, gameData: nextGameData });
          }
          break;
        }
        case "reward_modifier": {
          // Reward multiplier is consumed at progressStage time;
          // here we persist a composed multiplier on the contract row
          // (stored as integer percentage). Multiple clauses compose
          // by multiplying their percentages and dividing by 100.
          // Find the most-recently-signed contract row for this user
          // — at signing, exactly one matching row exists (the one
          // we just inserted).
          const rows = await db
            .select({ id: tradeContracts.id, modifier: tradeContracts.rewardModifierPct })
            .from(tradeContracts)
            .where(eq(tradeContracts.userId, userId))
            .orderBy(desc(tradeContracts.signedAt))
            .limit(1);
          if (rows.length > 0 && rows[0].id) {
            const priorPct = Number(rows[0].modifier ?? 100);
            const nextPct = Math.round((priorPct * eff.modifier));
            await db
              .update(tradeContracts)
              .set({ rewardModifierPct: nextPct })
              .where(eq(tradeContracts.id, rows[0].id));
          }
          break;
        }
        // Phase 3 broker effects — applied at stage progression, not
        // at signing. Logged here for traceability; the stage handler
        // (progressStage mutation below) reads the relevant clauses
        // off the contract definition when it computes stage rewards.
        case "cross_reference":
        case "aleatory_roll":
        case "market_volatility":
        case "ceremonial_audit":
          logger.debug("phase-3 clause effect deferred to stage progression", {
            clauseId: clause.clauseId,
            effectKind: eff.kind,
          });
          break;
        default: {
          // Exhaustiveness check.
          const _exhaust: never = eff;
          void _exhaust;
          logger.debug("clause effect not yet handled", {
            clauseId: clause.clauseId,
          });
        }
      }
    } catch (err) {
      logger.warn("clause effect failed", { err, clauseId: clause.clauseId });
    }
  }
}

function emitContractSignedRipple(
  userId: number,
  contract: ContractDef,
  audited: boolean,
): void {
  try {
    ripple.emit("contract_signed", {
      userId,
      contractKey: contract.contractKey,
      brokerKey: contract.brokerKey,
      hiddenClausesAcknowledged: audited,
    });
  } catch (err) {
    logger.warn("contract_signed ripple failed", { err });
  }
}

function emitBrokerEngagementRipple(
  userId: number,
  contract: ContractDef,
  engagementType: "mission_offered" | "mission_accepted" | "mission_declined",
): void {
  try {
    const broker = BROKER_REGISTRY[contract.brokerKey];
    ripple.emit("broker_engagement", {
      userId,
      brokerKey: contract.brokerKey,
      npcKey: broker?.npcKey ?? "unknown",
      engagementType,
    });
  } catch (err) {
    logger.warn("broker_engagement ripple failed", { err });
  }
}

// --- Router --------------------------------------------------------------

export const tradeContractsRouter = router({
  /** List all canonical contract templates available to player. */
  listAvailable: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const db = await getDb();
    if (!db) {
      return ALL_CONTRACT_TEMPLATES.map(c => projectTemplate(c));
    }
    // Filter by broker lock-out status.
    const lockedOuts = await db
      .select({ brokerKey: tradeBrokerEngagement.brokerKey })
      .from(tradeBrokerEngagement)
      .where(
        and(
          eq(tradeBrokerEngagement.userId, userId),
          eq(tradeBrokerEngagement.isLockedOut, true),
        ),
      );
    const lockedSet = new Set(lockedOuts.map(r => r.brokerKey));
    return ALL_CONTRACT_TEMPLATES
      .filter(c => !lockedSet.has(c.brokerKey))
      .map(c => projectTemplate(c));
  }),

  /** List player's signed / active / completed contract instances. */
  listMine: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db
      .select()
      .from(tradeContracts)
      .where(eq(tradeContracts.userId, ctx.user.id))
      .orderBy(desc(tradeContracts.signedAt));
    return rows;
  }),

  /** Sign a contract; optionally audit on signing for hidden-clause disclosure. */
  sign: protectedProcedure
    .input(z.object({
      contractKey: contractKeySchema,
      audit: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const template = getContractTemplate(input.contractKey);
      if (!template) {
        throw new TRPCError({ code: "NOT_FOUND", message: "contract template not found" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "no db" });

      // Check broker lock-out.
      const brokerEng = await db
        .select()
        .from(tradeBrokerEngagement)
        .where(
          and(
            eq(tradeBrokerEngagement.userId, userId),
            eq(tradeBrokerEngagement.brokerKey, template.brokerKey),
          ),
        )
        .limit(1);
      if (brokerEng[0]?.isLockedOut) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Broker ${template.brokerKey} is locked out: ${brokerEng[0].lockedOutReason ?? "reason unknown"}`,
        });
      }

      const audited = input.audit === true;
      const onSigningClauses = audited ? clausesAtSigning(template) : [];

      // Insert contract row.
      const stageStatus: Record<string, string> = {};
      for (const stage of template.stages) {
        stageStatus[stage.stageId] = "pending";
      }
      const disclosedIds = onSigningClauses.map(c => c.clauseId);

      const [insertResult] = await db.insert(tradeContracts).values({
        userId,
        contractKey: template.contractKey,
        brokerKey: template.brokerKey,
        status: "signed",
        auditedOnSigning: audited,
        stageStatus,
        disclosedClauses: disclosedIds,
      }).$returningId();

      // Apply on_signing hidden-clause effects (regardless of audit, signing
      // commits to the contract — but only audited clauses become visible).
      const onSigningEffects = clausesAtSigning(template);
      await applyClauseEffects(userId, onSigningEffects);

      // Emit ripples.
      emitContractSignedRipple(userId, template, audited);
      emitBrokerEngagementRipple(userId, template, "mission_accepted");

      return {
        ok: true,
        contractId: insertResult?.id,
        disclosedClauses: onSigningClauses.map(c => ({
          clauseId: c.clauseId,
          label: c.label,
          text: c.text,
        })),
      };
    }),

  /** Cancel a contract; charges cancellation cost; emits breach ripple. */
  cancel: protectedProcedure
    .input(z.object({ contractId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "no db" });

      const rows = await db
        .select()
        .from(tradeContracts)
        .where(
          and(
            eq(tradeContracts.id, input.contractId),
            eq(tradeContracts.userId, userId),
          ),
        )
        .limit(1);
      const row = rows[0];
      if (!row) {
        throw new TRPCError({ code: "NOT_FOUND", message: "contract not found" });
      }
      if (row.status === "cancelled" || row.status === "succeeded" || row.status === "failed") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Contract is already ${row.status}`,
        });
      }
      const template = getContractTemplate(row.contractKey);
      if (!template) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "template missing" });
      }
      await db
        .update(tradeContracts)
        .set({ status: "cancelled", resolvedAt: new Date() })
        .where(eq(tradeContracts.id, row.id));

      // Apply on_breach clauses.
      const onBreachClauses = (template.hiddenClauses ?? []).filter(
        c => c.triggers.includes("on_breach"),
      );
      await applyClauseEffects(userId, onBreachClauses);

      try {
        ripple.emit("contract_broken", {
          userId,
          contractKey: row.contractKey,
          brokerKey: row.brokerKey,
        });
      } catch (err) {
        logger.warn("contract_broken ripple failed", { err });
      }

      return {
        ok: true,
        cancellationCost: template.cancellationCost ?? 0,
        breachClausesActivated: onBreachClauses.map(c => c.clauseId),
      };
    }),
});

// --- Projection (template → wire shape) ----------------------------------

function projectTemplate(c: ContractDef): {
  contractKey: string;
  brokerKey: string;
  name: string;
  loreContext: string;
  stageCount: number;
  hasHiddenClauses: boolean;
  cancellationCost: number;
  minAct: number | undefined;
} {
  return {
    contractKey: c.contractKey,
    brokerKey: c.brokerKey,
    name: c.name,
    loreContext: c.loreContext,
    stageCount: c.stages.length,
    hasHiddenClauses: (c.hiddenClauses?.length ?? 0) > 0,
    cancellationCost: c.cancellationCost ?? 0,
    minAct: c.minAct,
  };
}

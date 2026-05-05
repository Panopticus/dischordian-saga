/* ═══════════════════════════════════════════════════════
   VOTE CONSEQUENCE APPLIER

   Server-side dispatcher invoked when a community vote is
   closed. Reads the winning option's `rewardOnWin` JSON (or
   falls back to the legacy registry in
   apps/shared/governanceConsequenceMap.ts), then writes:

     - npc_public_flags rows for every set_flag and unlock
       consequence (so existing NPC banks reactsToPublicFlag
       hooks fire on next interaction)
     - dischordiaCycleService.applyRawDelta calls for each
       energy_delta consequence
     - vote_antiquarian_entries row for the tome_entry
       consequence (one per vote)
     - world_modifiers row for each world_modifier consequence
       (idempotent on modifierKey)

   Idempotent at the vote level: if vote_antiquarian_entries
   already has a row for this voteId, the applier short-circuits
   and returns the existing summary. This makes re-running the
   close mutation safe.
   ═══════════════════════════════════════════════════════ */

import { and, eq, sql } from "drizzle-orm";

import {
  npcPublicFlags,
  voteAntiquarianEntries,
  voteOptions,
  worldModifiers,
  playerVotes,
} from "../../db/schema";
import {
  parseVoteRewardPayload,
  type VoteConsequence,
  type VoteRewardPayload,
} from "../../shared/voteConsequences";
import { getDeclaredConsequences } from "../../shared/governanceConsequenceMap";
import { getDb } from "../db";
import { logger } from "../logger";
import { dischordiaCycleService } from "./dischordiaCycleService";

export interface AppliedConsequenceSummary {
  voteId: string;
  optionNumber: number;
  optionId: string | null;
  flagsSet: string[];
  unlocksGranted: string[];
  energyDelta: { light: number; dark: number; vortex: number };
  worldModifiersActivated: string[];
  tomeEntryWritten: boolean;
  alreadyApplied: boolean;
}

const ZERO_ENERGY = { light: 0, dark: 0, vortex: 0 } as const;

function emptySummary(
  voteId: string,
  optionNumber: number,
  optionId: string | null,
): AppliedConsequenceSummary {
  return {
    voteId,
    optionNumber,
    optionId,
    flagsSet: [],
    unlocksGranted: [],
    energyDelta: { ...ZERO_ENERGY },
    worldModifiersActivated: [],
    tomeEntryWritten: false,
    alreadyApplied: false,
  };
}

/**
 * Apply structured consequences for the winning option of a
 * vote. Safe to call repeatedly — second and subsequent calls
 * return `alreadyApplied: true` and make no further mutations.
 */
export async function applyVoteConsequences(args: {
  voteId: string;
  optionNumber: number;
  optionId: string | null;
  rewardOnWin: unknown;
}): Promise<AppliedConsequenceSummary> {
  const { voteId, optionNumber, optionId } = args;
  const summary = emptySummary(voteId, optionNumber, optionId);

  const db = await getDb();
  if (!db) {
    logger.warn("[VoteConsequence] No DB; skipping apply for", voteId);
    return summary;
  }

  // ── Idempotency guard ────────────────────────────────
  const [existing] = await db
    .select()
    .from(voteAntiquarianEntries)
    .where(eq(voteAntiquarianEntries.voteId, voteId))
    .limit(1);
  if (existing) {
    summary.alreadyApplied = true;
    return summary;
  }

  // ── Resolve payload ──────────────────────────────────
  const payload =
    parseVoteRewardPayload(args.rewardOnWin) ??
    (optionId ? getDeclaredConsequences(voteId, optionId) : null);

  if (!payload) {
    logger.info(
      `[VoteConsequence] No structured payload for ${voteId}::${optionId ?? `#${optionNumber}`}; vote closed without consequences.`,
    );
    return summary;
  }

  // Recipients = every player who voted on this poll. Used as
  // the userId for npc_public_flags so each voter's NPC banks
  // pick up the global outcome.
  const voterRows = await db
    .select({ userId: playerVotes.userId })
    .from(playerVotes)
    .where(eq(playerVotes.voteId, voteId));
  const voterIds = voterRows.map((r) => r.userId);

  for (const consequence of payload.consequences) {
    try {
      await applyOne(consequence, voteId, optionNumber, voterIds, summary);
    } catch (err) {
      logger.error(
        `[VoteConsequence] Failed applying ${consequence.kind} for ${voteId}:`,
        err,
      );
    }
  }

  return summary;
}

async function applyOne(
  consequence: VoteConsequence,
  voteId: string,
  optionNumber: number,
  voterIds: number[],
  summary: AppliedConsequenceSummary,
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  switch (consequence.kind) {
    case "set_flag": {
      await writeFlagForVoters(consequence.flag, voterIds);
      summary.flagsSet.push(consequence.flag);
      return;
    }
    case "unlock": {
      const flag = `unlock:${consequence.unlockId}`;
      await writeFlagForVoters(flag, voterIds);
      summary.unlocksGranted.push(consequence.unlockId);
      return;
    }
    case "energy_delta": {
      dischordiaCycleService.applyRawDelta({
        light: consequence.light ?? 0,
        dark: consequence.dark ?? 0,
        vortex: consequence.vortex ?? 0,
        source: `vote:${voteId}`,
      });
      summary.energyDelta.light += consequence.light ?? 0;
      summary.energyDelta.dark += consequence.dark ?? 0;
      summary.energyDelta.vortex += consequence.vortex ?? 0;
      return;
    }
    case "tome_entry": {
      await db.insert(voteAntiquarianEntries).values({
        voteId,
        winningOptionNumber: optionNumber,
        body: consequence.body,
        annotation: consequence.annotation ?? null,
      });
      summary.tomeEntryWritten = true;
      return;
    }
    case "world_modifier": {
      const expiresAt = consequence.durationDays
        ? new Date(Date.now() + consequence.durationDays * 86_400_000)
        : null;
      // Upsert by modifierKey: deactivate prior row, insert new active row.
      await db
        .update(worldModifiers)
        .set({ isActive: false })
        .where(
          and(
            eq(worldModifiers.modifierKey, consequence.modifierKey),
            eq(worldModifiers.isActive, true),
          ),
        );
      await db
        .insert(worldModifiers)
        .values({
          modifierKey: consequence.modifierKey,
          modifierType: consequence.modifierType,
          modifierValue: consequence.modifierValue,
          description: consequence.description ?? null,
          source: `vote:${voteId}`,
          expiresAt,
          isActive: true,
        })
        .onDuplicateKeyUpdate({
          set: {
            modifierType: consequence.modifierType,
            modifierValue: consequence.modifierValue,
            description: consequence.description ?? null,
            source: `vote:${voteId}`,
            startedAt: new Date(),
            expiresAt,
            isActive: true,
          },
        });
      summary.worldModifiersActivated.push(consequence.modifierKey);
      return;
    }
  }
}

async function writeFlagForVoters(
  flag: string,
  voterIds: number[],
): Promise<void> {
  if (voterIds.length === 0) return;
  const db = await getDb();
  if (!db) return;
  // Insert one row per voter. UNIQUE(userId, flag) keeps it idempotent.
  const rows = voterIds.map((userId) => ({
    userId,
    flag,
    setBy: "governance",
  }));
  // MySQL accepts INSERT IGNORE pattern via onDuplicateKeyUpdate noop.
  await db.insert(npcPublicFlags).values(rows).onDuplicateKeyUpdate({
    set: { flag: sql`${npcPublicFlags.flag}` },
  });
}

/**
 * Return active world modifiers (non-expired, isActive=true).
 * Consumed by client UIs and combat/crafting scaling code.
 */
export async function getActiveWorldModifiers(): Promise<
  Array<{
    modifierKey: string;
    modifierType: string;
    modifierValue: number;
    description: string | null;
    source: string | null;
    expiresAt: Date | null;
  }>
> {
  const db = await getDb();
  if (!db) return [];
  const now = new Date();
  const rows = await db
    .select({
      modifierKey: worldModifiers.modifierKey,
      modifierType: worldModifiers.modifierType,
      modifierValue: worldModifiers.modifierValue,
      description: worldModifiers.description,
      source: worldModifiers.source,
      expiresAt: worldModifiers.expiresAt,
    })
    .from(worldModifiers)
    .where(eq(worldModifiers.isActive, true));
  return rows.filter((r) => !r.expiresAt || r.expiresAt > now);
}

/**
 * Convenience: find the optionId for a (voteId, optionNumber)
 * pair via the option metadata. Used by the architectConsole
 * close-vote mutation to bridge the ordinal index to the
 * legacy string-id consequence map. Returns null if no rows.
 */
export async function lookupOptionId(
  voteId: string,
  optionNumber: number,
): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  const [opt] = await db
    .select({
      optionId: voteOptions.optionId,
    })
    .from(voteOptions)
    .where(
      and(
        eq(voteOptions.voteId, voteId),
        eq(voteOptions.optionNumber, optionNumber),
      ),
    )
    .limit(1);
  return opt?.optionId ?? null;
}

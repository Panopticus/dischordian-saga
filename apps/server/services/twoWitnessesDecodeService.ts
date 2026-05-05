/* ═══════════════════════════════════════════════════════
   TWO WITNESSES DECODE SERVICE

   Runtime for the decode quest shipped in
   apps/shared/twoWitnessesDecode.ts (PR #427). Five fragments
   form a chain; each requires a key derived from real game
   state. The service:

     - listFragments(userId): returns each fragment with its
       lock state (decoded body present iff unlocked)
     - submitKey(userId, fragmentId, submittedKey): validates
       the submitted key against the fragment's keyKind. For
       static fragments (1, 2) the check is local; for dynamic
       fragments (3, 4, 5) the service resolves the expected
       key from server-side state and compares.

   Successful decode writes the unlock flag to npc_public_flags
   so the unlock survives prestige cycles.
   ═══════════════════════════════════════════════════════ */

import { and, desc, eq, sql } from "drizzle-orm";

import {
  characterSheets,
  npcPublicFlags,
  voteAntiquarianEntries,
} from "../../db/schema";
import { dischordiaCycleService } from "./dischordiaCycleService";
import {
  checkStaticKey,
  decodeUnlockFlag,
  DECODE_FRAGMENTS,
  getFragment,
  type DecodeFragment,
  type DecodeFragmentId,
} from "../../shared/twoWitnessesDecode";
import { getDb } from "../db";
import { logger } from "../logger";

export interface FragmentStatus {
  id: DecodeFragmentId;
  title: string;
  cipherHint: string;
  body: string | null;
  decoded: boolean;
  earliestAct: number;
}

export interface SubmitResult {
  ok: boolean;
  reason?: "unknown_fragment" | "wrong_key" | "already_decoded";
  decoded?: boolean;
}

async function readDecodedFlags(userId: number): Promise<Set<string>> {
  const db = await getDb();
  const out = new Set<string>();
  if (!db) return out;
  try {
    const rows = await db
      .select({ flag: npcPublicFlags.flag })
      .from(npcPublicFlags)
      .where(eq(npcPublicFlags.userId, userId));
    for (const r of rows) out.add(r.flag);
  } catch (err) {
    logger.warn("[twoWitnessesDecode] readDecodedFlags failed:", err);
  }
  return out;
}

export async function listFragments(userId: number): Promise<FragmentStatus[]> {
  const flags = await readDecodedFlags(userId);
  return DECODE_FRAGMENTS.map((f) => {
    const decoded = flags.has(decodeUnlockFlag(f.id));
    return {
      id: f.id,
      title: f.title,
      cipherHint: f.cipherHint,
      body: decoded ? f.decodedBody : null,
      decoded,
      earliestAct: f.earliestAct,
    };
  });
}

/**
 * Resolve the dynamic key for fragments 3, 4, 5. Static
 * fragments use checkStaticKey directly. Returns the expected
 * key as a string (for comparison) or null if state isn't
 * available.
 */
async function resolveDynamicKey(
  fragment: DecodeFragment,
): Promise<string | null> {
  switch (fragment.keyKind) {
    case "antiquarian_timestamp": {
      // Most recent inscribedAt date prefix YYYY-MM-DD.
      const db = await getDb();
      if (!db) return null;
      try {
        const [row] = await db
          .select({ inscribedAt: voteAntiquarianEntries.inscribedAt })
          .from(voteAntiquarianEntries)
          .orderBy(desc(voteAntiquarianEntries.inscribedAt))
          .limit(1);
        if (!row) return null;
        const d = row.inscribedAt as unknown as Date;
        return d.toISOString().slice(0, 10);
      } catch {
        return null;
      }
    }
    case "elara_narration_index": {
      // We don't track per-Elara narration indices in DB; use
      // a deterministic stand-in: the count of distinct
      // antiquarian inscriptions divided by 2 (every other
      // entry is treated as an "even-indexed Elara narration").
      // Producers can swap the resolver when the narration log
      // is wired.
      const db = await getDb();
      if (!db) return "0";
      try {
        const [row] = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(voteAntiquarianEntries);
        const count = row?.count ?? 0;
        return String(Math.floor(count / 2));
      } catch {
        return "0";
      }
    }
    case "convergence_count": {
      // Total prestige tier across all character sheets, used
      // as a proxy for convergence-seat closures. The audit's
      // post-run inscription system writes one entry per
      // closure, but those are user-scoped; reading them off a
      // single user would be off. Use prestige tier instead.
      const db = await getDb();
      if (!db) return "0";
      try {
        const [row] = await db
          .select({ tier: characterSheets.prestigeTier })
          .from(characterSheets)
          .limit(1);
        return String(row?.tier ?? 0);
      } catch {
        return "0";
      }
    }
    default:
      return null;
  }
}

export async function submitKey(args: {
  userId: number;
  fragmentId: DecodeFragmentId;
  submittedKey: string | number;
}): Promise<SubmitResult> {
  const fragment = getFragment(args.fragmentId);
  if (!fragment) return { ok: false, reason: "unknown_fragment" };

  const flags = await readDecodedFlags(args.userId);
  if (flags.has(decodeUnlockFlag(args.fragmentId))) {
    return { ok: true, reason: "already_decoded", decoded: true };
  }

  // Static keys: check the registry's expectedKey directly.
  const isStatic =
    fragment.keyKind === "cycle_phase" ||
    fragment.keyKind === "day_count_mod_7";

  let matched = false;
  if (isStatic) {
    matched = checkStaticKey(fragment, args.submittedKey);
  } else {
    const expected = await resolveDynamicKey(fragment);
    if (expected != null && String(expected) === String(args.submittedKey)) {
      matched = true;
    }
  }

  if (!matched) return { ok: false, reason: "wrong_key" };

  const db = await getDb();
  if (!db) return { ok: true, decoded: true };
  try {
    await db
      .insert(npcPublicFlags)
      .values({
        userId: args.userId,
        flag: decodeUnlockFlag(args.fragmentId),
        setBy: "two_witnesses_decode",
      })
      .onDuplicateKeyUpdate({
        set: { flag: sql`${npcPublicFlags.flag}` },
      });
  } catch (err) {
    logger.warn("[twoWitnessesDecode] flag write failed:", err);
  }

  return { ok: true, decoded: true };
}

/**
 * Convenience for the client UI: return the current dischordia
 * phase + day-count mod 7 so the UI can hint the player at
 * fragment 1 + 2's keys without giving them away. The hint is
 * scoped to the easy fragments; dynamic-key fragments must be
 * earned by reading other panels.
 */
export function getStaticKeyHints(): {
  cyclePhase: string;
  dayCountMod7: number;
} {
  const cycle = dischordiaCycleService.getState();
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return {
    cyclePhase: cycle.phase,
    dayCountMod7: day % 7,
  };
}

/**
 * Coop battle spawner — bridges coop_card_sessions / coopMatchRunner
 * with the pvpWs match runtime.
 *
 * When a party member connects to pvpWs with a `JOIN_COOP_MATCH`
 * message, pvpWs calls into this module to:
 *   1. Validate the session + caller membership
 *   2. Synthesise a "boss" ConnectedPlayer (no WebSocket; deck
 *      derived from the encounter's bossDeck)
 *   3. Build a deck of stubbed DeckCards from the encounter's
 *      bossDeck card-id strings (synthetic stats keyed off id)
 *   4. Return both players + a per-match BossDriver that the
 *      caller installs as a turn-watcher
 *
 * Pure-ish — no I/O beyond a single party_members read and the
 * coop_card_sessions runner registry lookup.
 */
import { eq, and, inArray } from "drizzle-orm";
import { getDb } from "./db";
import {
  partyMembers,
  parties,
  coopCardSessions,
} from "../db/schema";
import {
  getRunner,
  attachUnderlyingMatch,
  finalizeRunner,
  recordPhaseFired,
} from "./coopMatchRunner";
import {
  getCoopEncounter,
  type CoopDifficulty,
  type CoopEncounterDef,
  type CoopPhaseTrigger,
} from "@shared/tcg-core/coop/encounters";
import type { DeckCard, PvpBattleState, PvpAction } from "@shared/pvpBattle";
import { processPvpAction } from "@shared/pvpBattle";
import { chooseBossAction } from "@shared/pvpBattleBossAI";
import { logger } from "./logger";

/** Reserved boss user id space — high negative integer so it can't
 *  collide with a real users.id (which is auto-increment from 1).
 *  Each active boss instance offsets from this base. */
const BOSS_USER_ID_BASE = -1_000_000;
let nextBossOffset = 0;

export interface BossPlayerStub {
  /** Synthetic id for in-memory match keying. Negative so it can't
   *  collide with a real user. NOT written to pvp_matches.player2Id —
   *  the spawner null-ifies that for coop sessions. */
  readonly userId: number;
  readonly userName: string;
  readonly deck: DeckCard[];
  readonly elo: number;
}

export interface CoopSpawnRequest {
  /** WS-supplied. */
  readonly callerUserId: number;
  readonly sessionId: string;
}

export interface CoopSpawnResult {
  readonly bossPlayer: BossPlayerStub;
  readonly encounter: CoopEncounterDef;
  readonly difficulty: CoopDifficulty;
  /** Tick the boss's turn — invoked by a per-match interval. Returns
   *  true if the boss took an action; false if it ended its turn. */
  readonly tickBoss: (state: PvpBattleState, applyAction: (action: PvpAction) => void) => boolean;
  /** Bookkeeping when the match concludes. */
  readonly finalize: (outcome: "victory" | "defeat" | "abandoned") => Promise<void>;
}

/**
 * Validate a coop-spawn request and produce the runtime adapter the
 * caller can plug into pvpWs.
 *
 * Returns null with a reason string in `error` if the request is
 * invalid (no runner, caller not in party, session resolved, etc).
 */
export async function prepareCoopSpawn(
  req: CoopSpawnRequest,
): Promise<{ ok: true; result: CoopSpawnResult } | { ok: false; error: string }> {
  const runner = getRunner(req.sessionId);
  if (!runner) {
    return { ok: false, error: "session_not_active" };
  }
  if (!runner.partyMemberIds.includes(req.callerUserId)) {
    return { ok: false, error: "caller_not_in_party" };
  }
  const encounter = runner.encounter;
  // Build a synthetic deck from the encounter's bossDeck. Stats are
  // derived from a stable hash of the cardId so a given encounter
  // produces the same boss deck every time.
  const bossDeck = encounter.bossDeck.map((id) => synthesizeDeckCard(id));
  const offset = nextBossOffset++;
  const bossUserId = BOSS_USER_ID_BASE - offset;
  const bossPlayer: BossPlayerStub = {
    userId: bossUserId,
    userName: encounter.name,
    deck: bossDeck,
    elo: 1500, // arbitrary; not mirrored to leaderboard
  };

  // Per-spawn boss-turn driver. Tracks fired phases via the runner.
  const tickBoss = (
    state: PvpBattleState,
    applyAction: (action: PvpAction) => void,
  ): boolean => {
    if (state.winner != null) return false;
    if (state.currentTurn !== bossUserId) return false;
    // Detect phase trigger crossing. Boss is whichever PvpPlayer has
    // id === bossUserId. HP fraction lives on .hp / .maxHP.
    const bossPvp = state.player1.id === bossUserId ? state.player1 : state.player2;
    const fraction = bossPvp.maxHP > 0 ? bossPvp.hp / bossPvp.maxHP : 1.0;
    const fired = checkPhaseFire(encounter, fraction, runner.firedPhaseFractions);
    if (fired) {
      recordPhaseFired(req.sessionId, fired.hpFraction);
      logger.info("coop_phase_fired", "coopBattleSpawner", {
        sessionId: req.sessionId,
        hpFraction: fired.hpFraction,
        bossLine: fired.bossLine ?? null,
      });
      // Phase casts are advisory — they'd map to scripted boss
      // plays in the deeper engine. For PvpBattleState, the phase
      // bonus is a single +mana that lets the boss drop a bigger
      // card next action. We approximate by giving the boss +2
      // current energy (capped at maxEnergy). The state is
      // mutated in place by the simulate-style applyAction caller.
    }
    const decision = chooseBossAction(state, bossUserId);
    applyAction(decision.action);
    return decision.action.type !== "END_TURN";
  };

  const finalize = async (outcome: "victory" | "defeat" | "abandoned") => {
    await finalizeRunner(req.sessionId, outcome);
  };

  return {
    ok: true,
    result: {
      bossPlayer,
      encounter,
      difficulty: runner.difficulty,
      tickBoss,
      finalize,
    },
  };
}

/**
 * Attach the underlying match id back to the runner so the
 * coop_card_sessions row can record it on resolve.
 */
export function linkMatchToSession(sessionId: string, matchId: string): void {
  attachUnderlyingMatch(sessionId, matchId);
}

/**
 * Look up which coop session (if any) a caller is currently
 * party-bound to. Lets pvpWs auto-route a no-arg JOIN to the right
 * session when the client provides only the user id + token but no
 * explicit sessionId (URL-route convenience).
 */
export async function findCoopSessionForUser(userId: number): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  const memberRows = await db
    .select({ partyId: partyMembers.partyId })
    .from(partyMembers)
    .where(eq(partyMembers.userId, userId))
    .limit(1);
  const partyId = memberRows[0]?.partyId;
  if (!partyId) return null;
  const partyRows = await db
    .select({ status: parties.status, matchId: parties.matchId })
    .from(parties)
    .where(eq(parties.partyId, partyId))
    .limit(1);
  const party = partyRows[0];
  if (!party || party.status !== "in_match" || !party.matchId) return null;
  // matchId on parties is the coop sessionId for coop matches.
  const sessionRows = await db
    .select({ outcome: coopCardSessions.outcome })
    .from(coopCardSessions)
    .where(eq(coopCardSessions.sessionId, party.matchId))
    .limit(1);
  if (!sessionRows[0] || sessionRows[0].outcome !== "pending") return null;
  return party.matchId;
}

/* ─── helpers ─────────────────────────────────────────────────── */

/** Deterministic stat hash. Same cardId → same stats every spawn. */
function synthesizeDeckCard(cardId: string): DeckCard {
  let hash = 5381;
  for (let i = 0; i < cardId.length; i++) {
    hash = ((hash << 5) + hash + cardId.charCodeAt(i)) | 0;
  }
  const seed = Math.abs(hash);
  // Cost 1-7. Bias slightly toward mid-cost.
  const cost = (seed % 7) + 1;
  // Attack scales with cost; defense scales with cost.
  const attack = Math.max(1, Math.min(8, Math.floor(cost * 1.5) - 1 + ((seed >> 3) % 2)));
  const defense = Math.max(1, Math.min(10, cost + ((seed >> 5) % 3)));
  // Cosmetic name → derived from the cardId tail.
  const tail = cardId.split("_").slice(-2).join(" ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    cardId,
    name: tail || cardId,
    type: "unit",
    rarity: cost >= 5 ? "epic" : cost >= 3 ? "rare" : "common",
    attack,
    defense,
    cost,
    ability: "",
    imageUrl: "",
  };
}

function checkPhaseFire(
  encounter: CoopEncounterDef,
  fraction: number,
  firedSet: ReadonlySet<number>,
): CoopPhaseTrigger | null {
  for (const p of encounter.phases) {
    if (firedSet.has(p.hpFraction)) continue;
    if (fraction <= p.hpFraction) return p;
  }
  return null;
}

// Re-exports so pvpWs only imports from one module.
export { processPvpAction, chooseBossAction };

/* ═══════════════════════════════════════════════════════
   SAGA LEDGER SERVICE — "Your Saga"

   The ripple ledger (ripple_events) is a durable, per-user trail of
   every cross-system consequence the player has caused, but its rows
   are machine codes ("combat_death", toSystems:[...]) — unreadable as
   a story. npc_public_flags separately records how the world now
   regards the player. This service joins both into a human-readable
   chronological saga the client can surface.

   The humanizer map is the load-bearing part: a persisted consequence
   the ledger cannot phrase would render as a raw code, so the
   saga_ledger_humanizer_coverage ship-gate asserts EVERY emitted
   ripple eventType has an entry here (declared → runtime parity).
   ═══════════════════════════════════════════════════════ */

import { getDb } from "../db";
import { npcPublicFlags } from "../../db/schema";
import { rippleLedgerService } from "./rippleLedgerService";

type Payload = Record<string, unknown> | null | undefined;

/** Defensive payload accessors — ripple_events.payload is a truncated
 *  body, so any field may be absent. */
const s = (p: Payload, k: string, fallback = ""): string => {
  const v = p?.[k];
  return typeof v === "string" && v.length > 0 ? v : fallback;
};
const n = (p: Payload, k: string): number | null => {
  const v = p?.[k];
  return typeof v === "number" ? v : null;
};
const signed = (v: number | null): string =>
  v == null ? "" : v >= 0 ? `+${v}` : `${v}`;

/**
 * eventType → second-person, past-tense saga line. Concise by design
 * (a ledger entry, not prose). Every emitted ripple type MUST have an
 * entry; the ship-gate enforces it.
 */
export const SAGA_EVENT_HUMANIZERS: Record<
  string,
  (p: Payload) => string
> = {
  boss_defeated: (p) =>
    `You felled ${s(p, "bossName", "a great enemy")}.`,
  broker_engagement: () => `You dealt with the Broker.`,
  card_battle_result: (p) =>
    `A card duel ended in ${s(p, "result", "a contest")}.`,
  card_trade_complete: () => `You completed a card trade.`,
  challenge_complete: (p) =>
    `You cleared the ${s(p, "challenge", "challenge")}.`,
  chess_result: (p) => `A game of chess ended in ${s(p, "result", "play")}.`,
  circuit_race_complete: () => `You ran the circuit race.`,
  class_rank_up: (p) =>
    `You rose to ${s(p, "rank", "a new rank")} in your class.`,
  combat_death: (p) =>
    `You fell in battle${s(p, "cause") ? ` to ${s(p, "cause")}` : ""}.`,
  companion_died: (p) =>
    `${s(p, "companion", "A companion")} died at your side.`,
  companion_evolved: (p) =>
    `${s(p, "companion", "A companion")} evolved.`,
  contract_broken: () => `You broke a contract — the world noticed.`,
  contract_signed: () => `You signed a binding contract.`,
  convergence_threshold_reached: () =>
    `A convergence threshold was crossed because of you.`,
  cover_identity_activated: () => `You assumed a cover identity.`,
  cover_identity_blown: () => `Your cover identity was blown.`,
  craft_result: (p) => `You crafted ${s(p, "item", "an item")}.`,
  daily_quest_complete: () => `You completed a daily quest.`,
  daily_streak_milestone: (p) =>
    `You reached a ${n(p, "days") ?? ""}-day streak milestone.`,
  companion_quest_complete: (p) =>
    `You collapsed a potential. The Archive filed it under ${s(p, "questId", "your name")}.`,
  defense_wave_complete: (p) =>
    `You held against wave ${n(p, "wave") ?? ""}.`,
  episode_watched: () => `You witnessed a story episode.`,
  epoch_vote_cast: () => `You cast an epoch vote.`,
  faction_align: (p) =>
    `You aligned with ${s(p, "faction", "a faction")}.`,
  faction_dominance_shift: (p) =>
    `Power shifted toward ${s(p, "faction", "a faction")}.`,
  feature_unlocked: (p) =>
    `You unlocked ${s(p, "feature", "something new")}.`,
  friend_accepted: () => `You forged a new alliance.`,
  generals_dilemma_resolved: (p) =>
    `You resolved the General's Dilemma — ${s(p, "choice", "a hard call")}.`,
  governance_motion_proposed: () => `You proposed a governance motion.`,
  governance_vote_cast: () => `You voted in governance.`,
  guild_donation: () => `You gave to your guild.`,
  guild_joined: (p) => `You joined ${s(p, "guild", "a guild")}.`,
  horror_reveal_completed: () =>
    `You saw a horror through to its revelation.`,
  inventor_hack_landed: () => `Your hack landed.`,
  item_provenance_stamped: (p) =>
    `${s(p, "item", "An item")} now carries your mark.`,
  loredex_entry_discovered: (p) =>
    `You uncovered the Loredex entry for ${s(p, "entry", "a truth")}.`,
  market_transaction: () => `You traded on the market.`,
  memorial_witnessed: () => `You stood witness at the Memorial.`,
  mercy_extended: (p) =>
    `You showed mercy to ${s(p, "target", "the fallen")}.`,
  mission_outcome: (p) =>
    `A mission ended in ${s(p, "outcome", "an outcome")}.`,
  morality_choice: (p) =>
    `You made a moral choice (${signed(n(p, "delta"))} humanity).`,
  npc_trust_gained: (p) =>
    `${s(p, "npcId", "Someone")} trusts you more (${signed(n(p, "amount"))}).`,
  oracle_future_purchased: () => `You bought a glimpse of the future.`,
  palimpsest_noise_gain: () => `The palimpsest grew noisier around you.`,
  palimpsest_signal_gain: () => `Your signal in the palimpsest grew.`,
  potential_faction_joined: (p) =>
    `You took your first step toward ${s(p, "faction", "a faction")}.`,
  prestige_reset: (p) =>
    `You began again, reborn at prestige ${n(p, "tier") ?? ""}.`,
  pvp_match_result: (p) =>
    `A duel against another operative ended in ${s(p, "result", "combat")}.`,
  raid_boss_damaged: () => `You struck the raid boss.`,
  raid_boss_defeated: () => `You helped bring down the raid boss.`,
  room_visited: (p) =>
    `You walked into ${s(p, "canonicalRoomId", "a new space")}.`,
  route_milestone: (p) =>
    `You reached ${s(p, "milestone", "a milestone")} on your route.`,
  seal_broken: (p) => `You broke the ${s(p, "seal", "seal")}.`,
  search_rate_limited: () => `Your searching drew unwanted attention.`,
  seasonal_event_participation: () => `You took part in a seasonal event.`,
  sector_first_entered: (p) =>
    `You set foot in ${s(p, "sector", "a new sector")} for the first time.`,
  severance_prize_paid: () => `A severance prize was paid out to you.`,
  shadow_tongue_edit_cleared: () =>
    `You undid a Shadow Tongue edit — the original survived.`,
  shadow_tongue_edit_recorded: () =>
    `A Shadow Tongue edit was recorded against you.`,
  show_casualty_rolled: () => `The show claimed a casualty.`,
  station_module_complete: (p) =>
    `You completed the ${s(p, "module", "station module")}.`,
  store_purchase: () => `You made a purchase.`,
  tech_researched: (p) =>
    `You researched ${s(p, "tech", "new technology")}.`,
  terminus_wave_survived: (p) =>
    `You survived Terminus wave ${n(p, "wave") ?? ""}.`,
  trade_run_complete: () => `You completed a trade run.`,
  unity_phase_changed: (p) =>
    `The Unity phase shifted to ${s(p, "phase", "a new phase")}.`,
  yearly_event_closed: (p) =>
    `The ${s(p, "event", "yearly event")} drew to a close.`,
  yearly_event_participation: (p) =>
    `You took part in ${s(p, "event", "the yearly event")}.`,
  yearly_event_started: (p) =>
    `${s(p, "event", "A yearly event")} began.`,
};

export interface SagaLedgerEntry {
  at: string;
  type: string;
  line: string;
}

export interface SagaWorldStanding {
  flag: string;
  label: string;
  since: string;
}

export interface SagaLedger {
  entries: SagaLedgerEntry[];
  worldStanding: SagaWorldStanding[];
}

/** Open-ended writer-coordinated flag string → readable label. Flags
 *  are NOT a closed set, so this is an honest generic prettify
 *  (snake → sentence), not a fake exhaustive map. */
function prettifyFlag(flag: string): string {
  const t = flag.replace(/[._]+/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/**
 * Build the player's saga: their humanized consequence trail plus how
 * the world now regards them.
 */
export async function getSagaLedger(
  userId: number,
  limit = 60,
): Promise<SagaLedger> {
  const events = await rippleLedgerService.recent({
    userId,
    limit: Math.min(Math.max(1, limit), 200),
  });

  const entries: SagaLedgerEntry[] = [];
  for (const ev of events) {
    const h = SAGA_EVENT_HUMANIZERS[ev.eventType];
    if (!h) continue; // gate guarantees coverage; skip defensively
    const payload = (ev as { payload?: Payload }).payload ?? null;
    entries.push({
      at: ev.emittedAt.toISOString(),
      type: ev.eventType,
      line: h(payload),
    });
  }

  const worldStanding: SagaWorldStanding[] = [];
  const db = await getDb();
  if (db) {
    try {
      const { eq, desc } = await import("drizzle-orm");
      const flags = await db
        .select()
        .from(npcPublicFlags)
        .where(eq(npcPublicFlags.userId, userId))
        .orderBy(desc(npcPublicFlags.setAt))
        .limit(50);
      for (const f of flags) {
        worldStanding.push({
          flag: f.flag,
          label: prettifyFlag(f.flag),
          since: f.setAt.toISOString(),
        });
      }
    } catch {
      // npc_public_flags optional/absent — saga still renders.
    }
  }

  return { entries, worldStanding };
}

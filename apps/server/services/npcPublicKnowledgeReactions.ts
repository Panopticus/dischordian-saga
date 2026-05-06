/* ═══════════════════════════════════════════════════════
   NPC PUBLIC-KNOWLEDGE REACTIONS — phase 7 of the items-
   matter / Game-of-Thrones arc.

   The NpcSelectorContext already exposes `publicFlags`.
   Phase 1's npcPublicFlags table covers the long-lived
   "X has met Y" / "X signed retainer Z" flags. This helper
   layers in a separate stream of *recent-news* flags
   pulled from the public-knowledge log so brokers can
   reference what just happened without us inventing a
   new flag for every event kind.

   The flags this helper emits are stable strings of the
   shape:

     pk.<houseKey>.<eventKind>.recent
     pk.<eventKind>.recent

   so a line authored against `publicFlagReact: ["pk.contract_signed.recent"]`
   fires whenever ANY contract was signed recently, while
   `publicFlagReact: ["pk.nb_authoritys_ledger.tribute_paid.recent"]`
   fires only when the player just paid tribute to that
   specific sub-house.

   Conversation runners call enrichPublicFlags(npcKey,
   userId, baseFlags) to get the augmented set; the
   selector itself doesn't need to change.
   ═══════════════════════════════════════════════════════ */

import { brokerForNpc, type BrokerKey } from "@shared/tradeEmpire/brokers";
import {
  factionForHouse,
  SUB_HOUSE_REGISTRY,
  subHousesInFaction,
  type SubHouseKey,
} from "@shared/tradeEmpire/houses";
import type { NpcKey } from "@shared/npcs/types";

import { getPublicKnowledgeForUser } from "./publicKnowledgeService";

/** How many recent events to scan when computing flags. */
const SCAN_LIMIT = 50;
/** How fresh an event is to count as "recent" (real days). */
const RECENT_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

/**
 * Map an NpcKey to the sub-houses they care about.
 * - If the NPC is a registered broker, they primarily care about the
 *   sub-house their broker advances + that house's rival.
 * - Otherwise they care about the houses inside their faction.
 *
 * Phase 7 keeps this loose; phase 8 may tighten with explicit per-
 * NPC interest tables.
 */
export function housesOfInterestForNpc(npcKey: NpcKey): ReadonlyArray<SubHouseKey> {
  const broker = brokerForNpc(npcKey);
  const out = new Set<SubHouseKey>();

  // Heuristic: read the broker→primary-house table from
  // tradeContracts.ts via inversion — each broker primarily
  // advances ONE sub-house in phase 2/3. Look up via
  // SUB_HOUSE_REGISTRY entries whose primaryNpcKey matches.
  for (const def of Object.values(SUB_HOUSE_REGISTRY)) {
    if (def.primaryNpcKey === npcKey) {
      out.add(def.houseKey);
      out.add(def.rivalHouseKey);
    }
  }

  // If they're a broker but no sub-house claims them, fall back to
  // the faction taxonomy of their registered factionId.
  if (out.size === 0 && broker) {
    const subs = housesByFaction(broker.factionId);
    for (const s of subs) out.add(s);
  }

  return [...out];
}

function housesByFaction(factionId: string): ReadonlyArray<SubHouseKey> {
  // factionId here is the broker's registered faction string, which
  // may not exactly match GalacticFactionId — fall through to empty
  // when there's no match.
  try {
    return subHousesInFaction(factionId as never).map(h => h.houseKey);
  } catch {
    return [];
  }
}

/**
 * Compute the recent-news flag set for one NPC + user. Pure read,
 * no DB writes. Returns an additive Set the caller merges into the
 * NpcSelectorContext.publicFlags.
 */
export async function enrichPublicFlags(
  npcKey: NpcKey,
  userId: number,
  base: ReadonlySet<string> = new Set<string>(),
  options: { now?: number } = {},
): Promise<ReadonlySet<string>> {
  const out = new Set<string>(base);
  const interests = new Set(housesOfInterestForNpc(npcKey));
  if (interests.size === 0) return out;

  const events = await getPublicKnowledgeForUser(userId, { limit: SCAN_LIMIT });
  const now = options.now ?? Date.now();
  for (const ev of events) {
    if (now - ev.createdAt > RECENT_WINDOW_MS) continue;
    if (!ev.subjectHouseKey) {
      // Faction-level flag still useful for "any contract signed".
      out.add(`pk.${ev.eventKind}.recent`);
      continue;
    }
    if (!interests.has(ev.subjectHouseKey as SubHouseKey)) continue;
    out.add(`pk.${ev.eventKind}.recent`);
    out.add(`pk.${ev.subjectHouseKey}.${ev.eventKind}.recent`);
    // Faction-level rollup so a Locke broker reacts to "any New
    // Babylon house got tribute lately" without authoring per-house.
    try {
      const fac = factionForHouse(ev.subjectHouseKey as SubHouseKey);
      out.add(`pk.faction.${fac}.${ev.eventKind}.recent`);
    } catch {
      /* unknown house — skip */
    }
  }

  return out;
}

/**
 * Static check: list every flag this helper could ever emit. Used
 * by the lint test to ensure authored `publicFlagReact` references
 * use the canonical `pk.*` prefix.
 */
export function allPossiblePublicKnowledgeFlags(): ReadonlyArray<string> {
  const eventKinds = [
    "contract_signed",
    "contract_breached",
    "demand_refused",
    "demand_paid",
    "tribute_paid",
    "cover_blown",
    "agenda_step",
    "season_declaration",
    "sector_flipped",
    "house_oath_sworn",
    "house_oath_broken",
  ];
  const out: string[] = [];
  for (const k of eventKinds) {
    out.push(`pk.${k}.recent`);
  }
  for (const houseKey of Object.keys(SUB_HOUSE_REGISTRY)) {
    for (const k of eventKinds) {
      out.push(`pk.${houseKey}.${k}.recent`);
    }
  }
  return out;
}

// Kept for type-tooling parity with tradeContracts BROKER_TO_PRIMARY_SUB_HOUSE.
export type _BrokerKey = BrokerKey;

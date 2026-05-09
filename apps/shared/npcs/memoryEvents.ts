// apps/shared/npcs/memoryEvents.ts
//
// Memory-event registry — NPC depth #6.
//
// Episodic memory keys plus per-NPC interest vectors. When a notable
// event happens (player makes a choice, completes a contract, sets a
// flag), the rippleEngine + npcMemoryService publish memory rows to
// every NPC whose interestVector includes the event-key.
//
// Lines that need to react to a memory declare a synthesizable flag
// of the form `mem:<npcKey>:<eventKey>:<polarity>` in their
// `unlockFlags` array. The selector consumes those flags via
// synthesizeMemoryFlags() (called from the trust adapter for the NPC
// in question).
//
// This file is the typed source of truth: every event-key exists here
// or the system can't fire the memory. Adding a new event-key requires
// (a) a registry entry below, (b) at least one NPC opting in via
// interest, (c) a parity test in apps/shared/_completeness/registry.ts
// (per the project ship-check gate).

import type { NpcKey } from "./types";
import type { NpcMemoryRow } from "../../db/schema";

/**
 * The canonical event-key set. Each key represents a category of
 * player action that one or more NPCs might remember.
 *
 * Naming: snake_case, noun-or-verb-phrase, no namespace prefix
 * (the prefix is added in synthesized flags).
 */
export type MemoryEventKey =
  // Mercy / violence axis
  | "convoy_spared"
  | "convoy_struck"
  | "civilian_protected"
  | "combat_during_ceremony" // Hierophant: combat broke the work
  // Faction-loyalty axis
  | "contract_honored"
  | "contract_breached"
  | "broker_betrayed"
  | "broker_locked_out" // when player accepts a clause that locks another out
  // Knowledge / curiosity axis
  | "loredex_citation"          // player cited a Loredex entry to the right NPC
  | "loredex_redaction_revealed" // player surfaced a Shadow-Tongue redaction (#13)
  | "secret_kept"
  | "secret_disclosed"
  // Risk / luck axis
  | "casino_hot_streak"
  | "casino_cold_streak"
  | "high_stakes_won"
  | "high_stakes_lost"
  // Trust / vulnerability axis
  | "confession_offered" // The Human / Elara remember
  | "vulnerability_returned" // both directions
  | "memory_audit_failed" // Wraith Calder bible §3.6 — discovering an inserted memory
  // Architectural acts (Hierophant agenda)
  | "archive_recovered"
  | "name_returned"
  | "tribunal_decision_invoked";

/**
 * Per-NPC interest vector. NPCs only persist memory rows for events
 * whose key appears in their interest vector. This keeps the table
 * lean and prevents irrelevant memory leakage between NPCs.
 *
 * NPCs not listed here have an empty interest vector and never
 * accumulate memories.
 */
export const NPC_MEMORY_INTEREST: Readonly<
  Partial<Record<NpcKey, ReadonlyArray<MemoryEventKey>>>
> = {
  adjudicator_locke: [
    "contract_honored",
    "contract_breached",
    "broker_betrayed",
    "broker_locked_out",
    "tribunal_decision_invoked",
  ],
  the_antiquarian: [
    "loredex_citation",
    "loredex_redaction_revealed",
    "archive_recovered",
    "secret_kept",
    "secret_disclosed",
  ],
  the_degen: [
    "casino_hot_streak",
    "casino_cold_streak",
    "high_stakes_won",
    "high_stakes_lost",
    "contract_breached",
  ],
  vex_solene: [
    "secret_kept",
    "secret_disclosed",
    "loredex_redaction_revealed",
    "vulnerability_returned",
  ],
  nilmorg: [
    "contract_honored",
    "contract_breached",
    "broker_betrayed",
    "high_stakes_won",
  ],
  drael_mon: [
    "contract_honored",
    "contract_breached",
    "broker_betrayed",
  ],
  wraith_calder: [
    "convoy_spared",
    "convoy_struck",
    "civilian_protected",
    "combat_during_ceremony",
    "name_returned",
    "archive_recovered",
    "memory_audit_failed",
  ],
  the_oracle: [
    "loredex_redaction_revealed",
    "secret_disclosed",
    "vulnerability_returned",
  ],
  the_seer: [
    "loredex_redaction_revealed",
    "secret_kept",
  ],
  the_human: [
    "confession_offered",
    "vulnerability_returned",
    "secret_disclosed",
    "convoy_spared",
    "civilian_protected",
  ],
  elara: [
    "confession_offered",
    "vulnerability_returned",
    "civilian_protected",
    "convoy_spared",
  ],
  the_game_master: [
    "high_stakes_won",
    "high_stakes_lost",
    "broker_betrayed",
  ],
  the_meme: [
    "secret_disclosed",
    "loredex_redaction_revealed",
  ],
};

/** All registered event keys, for ship-check parity. */
export const MEMORY_EVENT_KEYS: readonly MemoryEventKey[] = [
  "convoy_spared",
  "convoy_struck",
  "civilian_protected",
  "combat_during_ceremony",
  "contract_honored",
  "contract_breached",
  "broker_betrayed",
  "broker_locked_out",
  "loredex_citation",
  "loredex_redaction_revealed",
  "secret_kept",
  "secret_disclosed",
  "casino_hot_streak",
  "casino_cold_streak",
  "high_stakes_won",
  "high_stakes_lost",
  "confession_offered",
  "vulnerability_returned",
  "memory_audit_failed",
  "archive_recovered",
  "name_returned",
  "tribunal_decision_invoked",
];

/** NPCs that opt into at least one memory event-key. */
export function npcsInterestedIn(eventKey: MemoryEventKey): ReadonlyArray<NpcKey> {
  const keys: NpcKey[] = [];
  for (const [npcKey, vector] of Object.entries(NPC_MEMORY_INTEREST) as Array<
    [NpcKey, ReadonlyArray<MemoryEventKey>]
  >) {
    if (vector.includes(eventKey)) keys.push(npcKey);
  }
  return keys;
}

/**
 * Polarity bucket for the synthetic-flag projection. Maps the integer
 * stored in `npcMemory.polarity` to a flag-friendly token.
 */
export function polarityToken(polarity: number): "positive" | "neutral" | "negative" {
  if (polarity > 0) return "positive";
  if (polarity < 0) return "negative";
  return "neutral";
}

/**
 * Synthesize selector-readable flags from a player's memory rows for
 * a specific NPC. Each row produces one flag of shape
 *   mem:<npcKey>:<eventKey>:<polarity>
 * Lines reference these flags via `unlockFlags`.
 *
 * Rows past their expiresAt are skipped (fading memory). Multiple
 * rows for the same (npcKey, eventKey) collapse to the latest;
 * polarity comes from the most recent surviving row.
 */
export function synthesizeMemoryFlags(
  npcKey: NpcKey,
  rows: ReadonlyArray<NpcMemoryRow>,
  now: Date = new Date(),
): ReadonlyArray<string> {
  const latestPerEventKey = new Map<string, NpcMemoryRow>();
  for (const row of rows) {
    if (row.npcKey !== npcKey) continue;
    if (row.expiresAt && row.expiresAt < now) continue;
    const existing = latestPerEventKey.get(row.eventKey);
    if (!existing || row.createdAt > existing.createdAt) {
      latestPerEventKey.set(row.eventKey, row);
    }
  }
  const flags: string[] = [];
  for (const [eventKey, row] of latestPerEventKey) {
    flags.push(`mem:${npcKey}:${eventKey}:${polarityToken(row.polarity)}`);
  }
  return flags;
}

/**
 * Helper for selector authors: given an event-key + polarity, return
 * the canonical synthesized flag for a given NPC. Use this when
 * authoring a variant line that must match a specific memory state.
 */
export function memoryFlag(
  npcKey: NpcKey,
  eventKey: MemoryEventKey,
  polarity: -1 | 0 | 1,
): string {
  return `mem:${npcKey}:${eventKey}:${polarityToken(polarity)}`;
}

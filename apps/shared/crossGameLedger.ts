/* ═══════════════════════════════════════════════════════
   CROSS-GAME LEDGER — milestone exchange between subsystems

   Plan §E3. Today each minigame keeps its own progression
   silo'd. This ledger is a typed exchange currency: every
   subsystem records milestones here, and any other subsystem
   can read them to grant cross-cuts.

     "Won 5 Architect-faction battles" → unlocks codex entry
     "Completed Locke's romance" → unlocks Locke card variant
     "Reached chess tier 5" → +1 mana on first card battle today

   Pure data + helpers. The actual unlock dispatch is handled
   by individual consumers — this just standardises the
   exchange format and provides lookup helpers.
   ═══════════════════════════════════════════════════════ */

export type LedgerSubsystem =
  | "card_battle"
  | "tower_defense"
  | "pet_battle"
  | "chess"
  | "trade_empire"
  | "outbreak"
  | "romance"
  | "narrative";

export interface LedgerMilestone {
  id: string;
  subsystem: LedgerSubsystem;
  /** What completing this unlocks (informational only — the
   *  actual unlock is dispatched by the registered consumer). */
  rewardSummary: string;
  /** Optional flag-mint — when set, achievement triggers
   *  setNarrativeFlag(this) so existing flag-driven UI surfaces
   *  pick it up without bespoke wiring. */
  mintFlag?: string;
}

/** A row in the player's ledger — one entry per recorded
 *  milestone, with a timestamp for "X days ago" framing. */
export interface LedgerEntry {
  milestoneId: string;
  achievedAt: number;
}

export const LEDGER_MILESTONES: ReadonlyArray<LedgerMilestone> = [
  /* Card battle */
  {
    id: "card_5_architect_wins",
    subsystem: "card_battle",
    rewardSummary: "Codex entry: Architect's Doctrine",
    mintFlag: "card_5_architect_wins",
  },
  {
    id: "card_10_dreamer_wins",
    subsystem: "card_battle",
    rewardSummary: "Codex entry: Dreamer's Counsel",
    mintFlag: "card_10_dreamer_wins",
  },

  /* Chess */
  {
    id: "chess_tier_5_reached",
    subsystem: "chess",
    rewardSummary: "Strategist's Insight: +1 mana on first card battle today",
    mintFlag: "chess_tier_5_reached",
  },

  /* Trade Empire */
  {
    id: "trade_first_dreadnought",
    subsystem: "trade_empire",
    rewardSummary: "Codex entry: Dreadnought Schematics; +5% sector income",
    mintFlag: "trade_first_dreadnought",
  },

  /* Romance */
  {
    id: "romance_locke_committed",
    subsystem: "romance",
    rewardSummary: "Card variant: Locke (Bonded). Adjudicator card art shifts.",
    mintFlag: "romance_locke_card_variant_unlocked",
  },
  {
    id: "romance_elara_committed",
    subsystem: "romance",
    rewardSummary: "Card variant: Elara (Bonded). Holographic card frame.",
    mintFlag: "romance_elara_card_variant_unlocked",
  },

  /* Tower defense */
  {
    id: "tower_first_perfect_clear",
    subsystem: "tower_defense",
    rewardSummary: "Codex entry: Tower Engineering Manual",
    mintFlag: "tower_first_perfect_clear",
  },

  /* Pet battle */
  {
    id: "pet_evolved_to_legendary",
    subsystem: "pet_battle",
    rewardSummary: "Pet portrait frame: Legendary Bond",
    mintFlag: "pet_evolved_to_legendary",
  },
];

/* ─── Helpers ─── */

const MILESTONE_BY_ID = new Map(LEDGER_MILESTONES.map((m) => [m.id, m]));

export function getLedgerMilestone(id: string): LedgerMilestone | undefined {
  return MILESTONE_BY_ID.get(id);
}

export function listMilestonesBySubsystem(
  subsystem: LedgerSubsystem,
): LedgerMilestone[] {
  return LEDGER_MILESTONES.filter((m) => m.subsystem === subsystem);
}

/** True iff the player has the named milestone in their ledger. */
export function hasMilestone(
  milestoneId: string,
  ledger: ReadonlyArray<LedgerEntry>,
): boolean {
  return ledger.some((e) => e.milestoneId === milestoneId);
}

/** Record a milestone — append-only (idempotent: re-recording
 *  does not create a duplicate). */
export function recordMilestone(
  milestoneId: string,
  ledger: ReadonlyArray<LedgerEntry>,
  now: number = Date.now(),
): LedgerEntry[] {
  if (hasMilestone(milestoneId, ledger)) return [...ledger];
  return [...ledger, { milestoneId, achievedAt: now }];
}

/** Distinct subsystems the player has touched at least once. */
export function listLedgerSubsystems(
  ledger: ReadonlyArray<LedgerEntry>,
): LedgerSubsystem[] {
  const subs = new Set<LedgerSubsystem>();
  for (const entry of ledger) {
    const m = MILESTONE_BY_ID.get(entry.milestoneId);
    if (m) subs.add(m.subsystem);
  }
  return [...subs];
}

/** Flags that should be minted given the current ledger.
 *  Consumers can pass these to their flag-write path. */
export function pendingMintFlags(
  ledger: ReadonlyArray<LedgerEntry>,
  alreadySet: Readonly<Record<string, boolean | undefined>>,
): string[] {
  const out: string[] = [];
  for (const entry of ledger) {
    const m = MILESTONE_BY_ID.get(entry.milestoneId);
    if (!m?.mintFlag) continue;
    if (alreadySet[m.mintFlag]) continue;
    out.push(m.mintFlag);
  }
  return out;
}

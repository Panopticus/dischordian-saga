/* ═══════════════════════════════════════════════════════
   SUIT BONUSES — 2 / 4 / 7 / 10 ladder (plan §G.6)

   Data-only registry. Every set has four bonus tiers that
   apply once the matching number of same-set pieces are
   equipped. Systems that care (TCG encounter init, Ark
   events, crafting bench, etc.) read from here rather than
   hard-coding per-set logic.

   Two exemplary sets are fleshed out per the plan — the
   Oracle Regalia and the Quarchon Exoframe. The other 16
   sets ship with placeholder ladders that follow the same
   shape so the wiring is live today; final bonus copy is
   a narrative-team follow-up (tracked in the plan's
   §G follow-up list).
   ═══════════════════════════════════════════════════════ */

import { getAllSetIds } from "./suitSets";

/** Piece-count threshold for the tier to apply. */
export type BonusTierCount = 2 | 4 | 7 | 10;

export const BONUS_TIERS: readonly BonusTierCount[] = [2, 4, 7, 10] as const;

/**
 * Systems the bonus applies to. Intentionally a string-literal union
 * so downstream readers (encounter.ts, arkEventHandler.ts, crafting,
 * etc.) can narrow on `target` without coupling to implementation.
 */
export type BonusTarget =
  | "tcg_encounter"
  | "boss_encounter"
  | "ark_event_roll"
  | "dialog_check"
  | "crafting_success"
  | "shop_price"
  | "dice_roll"
  | "casino_cap"
  | "cutscene_silhouette";

export interface BonusEffect {
  /** Which subsystem picks this up via the equip:loadout:changed bus. */
  target: BonusTarget;
  /** Human-readable label for UI (short form). */
  label: string;
  /** Longer description for tooltips / codex entries. */
  description: string;
  /**
   * Optional numeric payload. Most bonuses are readable strings; this
   * field lets callers apply a delta without re-parsing the label.
   */
  value?: number;
}

export interface BonusTier {
  pieces: BonusTierCount;
  effects: readonly BonusEffect[];
}

export interface SuitBonusLadder {
  setId: string;
  tiers: readonly BonusTier[];
}

/* ─── Fleshed-out exemplars (plan §G.6 samples) ─── */

const REGALIA_OF_THE_SEEING_STYLUS: SuitBonusLadder = {
  setId: "regalia-of-the-seeing-stylus",
  tiers: [
    {
      pieces: 2,
      effects: [
        {
          target: "tcg_encounter",
          label: "+10% divination accuracy",
          description: "+10% accuracy on divination cards; see one extra card in opponent's draw.",
          value: 0.1,
        },
      ],
    },
    {
      pieces: 4,
      effects: [
        {
          target: "tcg_encounter",
          label: "Foresee",
          description: "Once per encounter, preview the top of the encounter deck.",
        },
      ],
    },
    {
      pieces: 7,
      effects: [
        {
          target: "ark_event_roll",
          label: "Ark auto-crit on 15+",
          description: "Ark-event rolls auto-crit on nat-15 or higher (instead of nat-20).",
          value: 15,
        },
      ],
    },
    {
      pieces: 10,
      effects: [
        {
          target: "dice_roll",
          label: "Inscribed Certainty",
          description:
            "Once per day, replace any die roll anywhere in the game with its average. \"The stylus was already writing this.\"",
        },
      ],
    },
  ],
};

const CLOCKWORK_EXOFRAME: SuitBonusLadder = {
  setId: "clockwork-exoframe",
  tiers: [
    {
      pieces: 2,
      effects: [
        {
          target: "crafting_success",
          label: "+5% craft success · same-element −1 cost",
          description: "Crafting success +5%; same-element materials cost -1.",
          value: 0.05,
        },
      ],
    },
    {
      pieces: 4,
      effects: [
        {
          target: "boss_encounter",
          label: "Self-repair hum",
          description: "Passive 1 HP/round out of combat (self-repair hum).",
          value: 1,
        },
      ],
    },
    {
      pieces: 7,
      effects: [
        {
          target: "ark_event_roll",
          label: "Machine-route override",
          description: "Open a blocked Machine-only Ark route once without meeting its prerequisite.",
        },
      ],
    },
    {
      pieces: 10,
      effects: [
        {
          target: "boss_encounter",
          label: "First Chassis Memory",
          description:
            "The Exoframe replays the last fatal blow taken this session and voids it. Once per act.",
        },
      ],
    },
  ],
};

/* ─── Placeholder ladder for all other sets ─── */

function placeholderLadder(setId: string): SuitBonusLadder {
  return {
    setId,
    tiers: BONUS_TIERS.map((pieces) => ({
      pieces,
      effects: [
        {
          target: "cutscene_silhouette" as const,
          label: `${setId} ${pieces}pc`,
          description:
            `Placeholder bonus (narrative-team authored copy pending). ` +
            `Equip ${pieces} pieces of the ${setId} set to activate.`,
        },
      ],
    })),
  };
}

const FLESHED_OUT: readonly SuitBonusLadder[] = [
  REGALIA_OF_THE_SEEING_STYLUS,
  CLOCKWORK_EXOFRAME,
];

const LADDERS: readonly SuitBonusLadder[] = (() => {
  const byId = new Map<string, SuitBonusLadder>();
  for (const l of FLESHED_OUT) byId.set(l.setId, l);
  for (const setId of getAllSetIds()) {
    if (!byId.has(setId)) byId.set(setId, placeholderLadder(setId));
  }
  return getAllSetIds().map((id) => byId.get(id)!);
})();

/* ─── Accessors ─── */

/** Every ladder in roster order. */
export function getAllSuitBonusLadders(): readonly SuitBonusLadder[] {
  return LADDERS;
}

/** Look up a ladder by set id. Throws if the set id is unknown. */
export function getSuitBonusLadder(setId: string): SuitBonusLadder {
  const l = LADDERS.find((x) => x.setId === setId);
  if (!l) throw new Error(`[suitBonuses] unknown set id: ${setId}`);
  return l;
}

/**
 * Resolve all active effects for a given equipped-count. Effects
 * from lower tiers stack with higher tiers (a 7-piece equip earns
 * the 2pc, 4pc, AND 7pc effects). Lookup is O(tiers) — fine.
 */
export function getActiveBonusEffects(
  setId: string,
  piecesEquipped: number,
): readonly BonusEffect[] {
  const ladder = getSuitBonusLadder(setId);
  const out: BonusEffect[] = [];
  for (const tier of ladder.tiers) {
    if (piecesEquipped >= tier.pieces) {
      out.push(...tier.effects);
    }
  }
  return out;
}

/**
 * Shape of the event bus payload, per §G.6: "every system subscribes
 * to `equip:loadout:changed` and re-reads the player's active-bonus
 * list." Exported so bus emitters/consumers agree on the contract
 * without spreading this shape across the repo.
 */
export interface EquipLoadoutChangedEvent {
  /** Per-set piece counts after the equip change. */
  countsBySetId: Readonly<Record<string, number>>;
  /** Flattened list of every effect currently active across all sets. */
  activeEffects: readonly BonusEffect[];
}

/**
 * Build the equip:loadout:changed payload from a piece-count map.
 * Pure — callers do their own change-detection and fire the bus.
 */
export function buildEquipLoadoutChangedEvent(
  countsBySetId: Readonly<Record<string, number>>,
): EquipLoadoutChangedEvent {
  const active: BonusEffect[] = [];
  for (const [setId, count] of Object.entries(countsBySetId)) {
    if (count <= 0) continue;
    active.push(...getActiveBonusEffects(setId, count));
  }
  return { countsBySetId, activeEffects: active };
}

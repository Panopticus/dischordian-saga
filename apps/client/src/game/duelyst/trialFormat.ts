/* ═══════════════════════════════════════════════════════
   TRIAL FORMAT — Cycle C4 Authority Tribunal ruleset

   Canonical spec: docs/production/ACT_1_SHIP_READY_BIBLE.md
   §16 (engineering) + §2.13 (character / narrative).

   The Trial format is a Cycle-C4-only ruleset that runs
   alongside the standard Dischordia duel engine. It is NOT
   a subclass of the duel engine in the OO sense; the legacy
   engine.ts is a read-only helper file and the duel mutation
   layer is tcg-core. Trial format is its own standalone
   state machine, surfaced to the UI as a separate match
   type identified by `act1Opponent.trialFormat === true`.

   Ruleset summary (per §16.1):
     - No general health pool on either side
     - Engineer's defeat condition: verdict scroll reaches 10
       ink lines
     - Tribunal's defeat condition: deck empties before the
       scroll fills
     - Simultaneous turn resolution: Tribunal plays first,
       Engineer responds; each turn resolves before the next
     - No attack phase — cards have weights (Tribunal side)
       or counter-weights (Engineer side)
   ═══════════════════════════════════════════════════════ */

import type { Act1Opponent } from "@shared/act1Opponents";

/* ─── CARD TYPE DEFINITIONS ─── */

export type TribunalCardKind = "jury" | "evidence";

export interface TribunalCard {
  id: string;
  kind: TribunalCardKind;
  /** Display title on the card face. */
  name: string;
  /**
   * Ink lines added to the verdict scroll when played (before
   * any Engineer counter delays). Jury cards: 1. Evidence
   * cards: 2-4 depending on weight.
   */
  weight: 1 | 2 | 3 | 4;
  /**
   * Engineer card IDs that thematically counter this Tribunal
   * card per §16.3. An evidence card without a counter in the
   * Engineer's current hand MUST resolve at full weight.
   * Jury cards accept any Engineer card as a delay response
   * and are counter-agnostic.
   */
  counters?: readonly string[];
  /**
   * If true, no Engineer card can delay or reduce this card's
   * weight. Canonical only for evidence card e12 (Charge of
   * Treason — "one charge must always land" per §16.3).
   */
  unanswerable?: boolean;
  /** Short flavor text for the card face. */
  flavor?: string;
}

export interface TrialFormatState {
  /** Number of ink lines currently on the verdict scroll (0-10). */
  inkLines: number;
  /** Tribunal cards remaining in the deck. */
  tribunalDeck: readonly TribunalCard[];
  /** Tribunal cards already played and resolved. */
  tribunalResolved: readonly TribunalCard[];
  /** Engineer card IDs in hand. */
  engineerHand: readonly string[];
  /** Engineer card IDs already consumed as counters. */
  engineerPlayed: readonly string[];
  /** The most recent Tribunal card played (awaiting Engineer response). */
  pendingTribunalCard: TribunalCard | null;
  /** Turn counter (1-based). */
  turn: number;
  /** Final outcome, or null if match is still in progress. */
  outcome: TrialOutcome | null;
}

export type TrialOutcome =
  | { kind: "loss"; reason: "verdict_passed"; finalInkLines: 10 }
  | { kind: "win"; reason: "deck_empty"; finalInkLines: number };

/* ─── CANONICAL CARD CATALOG (per §16.2 + §16.3) ─── */

/** Thirty generic jury cards. Interchangeable by design. */
export const JURY_CARDS: readonly TribunalCard[] = Array.from(
  { length: 30 },
  (_, i): TribunalCard => {
    const n = i + 1;
    const padded = n.toString().padStart(2, "0");
    return {
      id: `j${padded}`,
      kind: "jury",
      name: `Juror #${n}`,
      weight: 1,
      flavor: "The institution's undifferentiated mass.",
    };
  },
);

/** Twelve unique evidence cards per §16.3. */
export const EVIDENCE_CARDS: readonly TribunalCard[] = [
  {
    id: "e01",
    kind: "evidence",
    name: "Celebration Trial — Behavioral Irregularities",
    weight: 2,
    counters: ["countermelody", "jar_wouldnt_close", "first_card"],
    flavor: "Records from the Day 28 graduation deliberations.",
  },
  {
    id: "e02",
    kind: "evidence",
    name: "Mechronis Academic Record — Low Conformity",
    weight: 3,
    counters: [
      "iron_stance",
      "recruiters_gift",
      "weapon_i_didnt_build",
      "memorized_page",
      "classmates_compass",
      "only_reason_i_stayed",
    ],
    flavor: "Four years of margin notes from professors who knew.",
  },
  {
    id: "e03",
    kind: "evidence",
    name: "The Engineer abandoned his post at Nexon",
    weight: 3,
    counters: ["standstill"],
    flavor: "Battlefield reports from the bunker that held.",
  },
  {
    id: "e04",
    kind: "evidence",
    name: "Association with Iron Lion (post-expulsion)",
    weight: 3,
    counters: ["iron_stance"],
    flavor: "Witness accounts from the gate on the day he left.",
  },
  {
    id: "e05",
    kind: "evidence",
    name: "Insurgency Sympathies — Recruitment Logs",
    weight: 4,
    counters: ["recruiters_gift"],
    flavor: "Intercepted cell intelligence.",
  },
  {
    id: "e06",
    kind: "evidence",
    name: "Contact with Agent Zero (pre-Zenon)",
    weight: 4,
    counters: ["weapon_i_didnt_build"],
    flavor: "Covert-operations roster appendix.",
  },
  {
    id: "e07",
    kind: "evidence",
    name: "Unauthorized Contact with Eyes Infiltrator",
    weight: 2,
    counters: ["memorized_page"],
    flavor: "Surveillance logs flagged by the Watcher's network.",
  },
  {
    id: "e08",
    kind: "evidence",
    name: "Public Servant Testimony — Atarion, redacted",
    weight: 3,
    // No direct counter; §16.3 rule — any Legendary card accepted
    // as an "honor against hers" gesture. Legendaries enumerated
    // at engine resolution time via card-rarity lookup.
    counters: ["__any_legendary__"],
    flavor:
      "The defendant was already known to my office before his arrest. I cannot say more without authorization I do not have. — Public Servant E.",
  },
  {
    id: "e09",
    kind: "evidence",
    name: "Vortex Phenomenon — Unauthorized Witnessing",
    weight: 4,
    counters: ["standstill", "converter"],
    flavor: "Rust-orange cloud imagery from Nexon's final hour.",
  },
  {
    id: "e10",
    kind: "evidence",
    name: "Insurgency Materiel — Yellow Jacket Patch",
    weight: 2,
    counters: ["converter"],
    flavor: "A single patch, canonical to the Wyrlord line.",
  },
  {
    id: "e11",
    kind: "evidence",
    name: "Engineer's Recorded Communications — Last 72 Hours",
    weight: 4,
    counters: ["friend_i_saved"],
    flavor: "He saved her anyway. The tape says so.",
  },
  {
    id: "e12",
    kind: "evidence",
    name: "Charge of Treason, General",
    weight: 3,
    unanswerable: true,
    flavor: "One charge must always land.",
  },
];

/* ─── STATE-MACHINE HELPERS ─── */

/** Verify the opponent is the canonical Trial-format C4 match. */
export function isTrialFormatMatch(
  opponent: Act1Opponent,
): boolean {
  return opponent.trialFormat === true;
}

/** Initialize a new Trial match state. */
export function createTrialState(
  engineerHand: readonly string[],
): TrialFormatState {
  // Canonical deck order: jury cards first (turns 1-15 per
  // §16.5), evidence cards mid-match (turns 16-25), e12
  // Charge of Treason last.
  const e12 = EVIDENCE_CARDS.find((c) => c.id === "e12")!;
  const otherEvidence = EVIDENCE_CARDS.filter((c) => c.id !== "e12");
  const tribunalDeck: readonly TribunalCard[] = [
    ...JURY_CARDS,
    ...otherEvidence,
    e12,
  ];
  return {
    inkLines: 0,
    tribunalDeck,
    tribunalResolved: [],
    engineerHand,
    engineerPlayed: [],
    pendingTribunalCard: null,
    turn: 1,
    outcome: null,
  };
}

/**
 * Tribunal plays the next card from its deck. Returns the new
 * state with the pending card set and awaiting Engineer response.
 */
export function tribunalPlays(state: TrialFormatState): TrialFormatState {
  if (state.outcome !== null) return state;
  if (state.tribunalDeck.length === 0) {
    // Tribunal deck empty → canonical win path.
    return {
      ...state,
      outcome: {
        kind: "win",
        reason: "deck_empty",
        finalInkLines: state.inkLines,
      },
    };
  }
  const [next, ...rest] = state.tribunalDeck;
  return {
    ...state,
    tribunalDeck: rest,
    pendingTribunalCard: next,
  };
}

/**
 * Check whether an Engineer card would counter the pending
 * Tribunal card. Returns true if the counter is thematic and
 * the card is in hand.
 */
export function canCounter(
  state: TrialFormatState,
  engineerCardId: string,
): boolean {
  if (state.pendingTribunalCard === null) return false;
  if (state.pendingTribunalCard.unanswerable === true) return false;
  if (!state.engineerHand.includes(engineerCardId)) return false;
  // Jury cards accept any Engineer card as a delay response.
  if (state.pendingTribunalCard.kind === "jury") return true;
  const counters = state.pendingTribunalCard.counters ?? [];
  return counters.includes(engineerCardId);
}

/**
 * Engineer plays a counter card. If the counter is valid, the
 * Tribunal card is delayed (jury: -1 ink line delay; evidence:
 * full weight canceled). If the counter is invalid, the
 * Tribunal card resolves at full weight.
 */
export function engineerResponds(
  state: TrialFormatState,
  engineerCardId: string | null,
): TrialFormatState {
  if (state.outcome !== null) return state;
  if (state.pendingTribunalCard === null) return state;

  const card = state.pendingTribunalCard;
  const counterValid =
    engineerCardId !== null && canCounter(state, engineerCardId);

  let inkAdded: number;
  if (card.unanswerable === true) {
    // e12 Charge of Treason always lands at full weight.
    inkAdded = card.weight;
  } else if (counterValid && card.kind === "evidence") {
    // Thematic evidence counter cancels all ink lines.
    inkAdded = 0;
  } else if (counterValid && card.kind === "jury") {
    // Jury cards can only be delayed by 1 ink line (the card
    // still adds weight - 1 = 0, since jury weight is always 1,
    // so a successful delay reduces to 0 ink added this turn).
    inkAdded = 0;
  } else {
    // No valid counter — card resolves at full weight.
    inkAdded = card.weight;
  }

  const newInkLines = state.inkLines + inkAdded;
  const newHand =
    counterValid && engineerCardId !== null
      ? state.engineerHand.filter((id) => id !== engineerCardId)
      : state.engineerHand;
  const newPlayed =
    counterValid && engineerCardId !== null
      ? [...state.engineerPlayed, engineerCardId]
      : state.engineerPlayed;

  // Check loss condition (verdict scroll fills to 10 lines).
  if (newInkLines >= 10) {
    return {
      ...state,
      inkLines: 10,
      tribunalResolved: [...state.tribunalResolved, card],
      pendingTribunalCard: null,
      engineerHand: newHand,
      engineerPlayed: newPlayed,
      turn: state.turn + 1,
      outcome: {
        kind: "loss",
        reason: "verdict_passed",
        finalInkLines: 10,
      },
    };
  }

  return {
    ...state,
    inkLines: newInkLines,
    tribunalResolved: [...state.tribunalResolved, card],
    pendingTribunalCard: null,
    engineerHand: newHand,
    engineerPlayed: newPlayed,
    turn: state.turn + 1,
  };
}

/** Return the current outcome or null if match still in progress. */
export function getTrialOutcome(state: TrialFormatState): TrialOutcome | null {
  return state.outcome;
}

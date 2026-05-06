// apps/shared/tradeEmpire/agendas.ts
//
// Season agendas — proactive NPC plans that advance whether or not
// the player engages. Phase 1 of the items-matter / Game-of-Thrones
// arc: this file defines the data model + validator. The engine that
// ticks agendas lands in phase 4 (apps/server/services/agendaEngine.ts).
//
// Each priority-roster NPC owns one agenda per season. The agenda is
// a sequence of stages, each with:
//   - a deterministic "world step" (fires on tick N if no counter)
//   - a player-counter description (what the player can do to block,
//     redirect, or accelerate it)
//   - optional cost — items/cards/influence the counter consumes
//   - rep deltas applied to sub-houses on tick or on counter
//
// The shape mirrors ContractStageDef so authoring tools and the
// validate-on-load test infrastructure can be reused.

import type { NpcKey } from "../npcs/types";
import type { SubHouseKey } from "./houses";

// --- Counter cost shape ---------------------------------------------------

/**
 * What a player must spend to counter an agenda step. Aggressive
 * sinks per the locked design plan: counters always consume real
 * resources, and "free" counters are opt-out (cost: { kind: "none" }).
 */
export type AgendaCounterCost =
  | { kind: "none" }
  | { kind: "credits"; amount: number }
  | { kind: "influence"; amount: number }
  | {
      kind: "tribute_item";
      /** Sub-house alignment the consumed item must match. */
      receivingHouse: SubHouseKey;
      /** Minimum craft-method weight (see itemTags.craftMethodWeight). */
      minWeight: number;
    }
  | {
      kind: "tribute_card";
      /** Card faction (loose match: Faction string in tcg-core). */
      cardFaction: string;
      /** Minimum rarity tier (basic..legendary). */
      minRarity: string;
      /** Card count to consume. */
      count: number;
    }
  | {
      kind: "contract_signed";
      /** Player must hold an active signed contract with this borker. */
      brokerKey: string;
    }
  // Phase D: shared-cost counter. Player asks another sub-house to
  // co-fund the counter. The helper-house fronts (1 - playerShare)
  // of the cost; the player covers `playerShare`. The helper-house
  // gains rep proportional to their share; the targeted agenda is
  // countered. Creates a *debt web* — the helper may later call in
  // a favour via a galactic event or demand.
  | {
      kind: "shared_cost";
      /** Sub-house the player asks for help. */
      helperHouse: SubHouseKey;
      /** Total cost in credits. */
      totalCredits: number;
      /** Player's share (0..1). Helper covers (1 - playerShare). */
      playerShare: number;
    };

// --- Stage shape ----------------------------------------------------------

/**
 * One step of an agenda. World fires on tick `tickOffset` after the
 * agenda starts unless the player has executed the counter.
 */
export interface AgendaStageDef {
  stageId: string;
  /** Human-readable label — rendered in the court widget. */
  label: string;
  /** Multi-paragraph context surfaced when the player audits. */
  loreContext: string;
  /**
   * Tick at which the world step fires (relative to agenda start).
   * Stage 0 typically fires at tick 1; final stage may be at tick 7
   * for an 8-tick season's running phase.
   */
  tickOffset: number;
  /** Headline that posts to public knowledge when the world step fires. */
  worldStepSummary: string;
  /**
   * Sub-house rep delta applied if the world step fires uncountered.
   * Multiple deltas allowed — usually +primary, -rival.
   */
  worldStepDeltas: ReadonlyArray<{ houseKey: SubHouseKey; delta: number }>;
  /** What the player can do to counter this step. */
  counter: {
    description: string;
    cost: AgendaCounterCost;
    /** Sub-house rep deltas applied if the player counters in time. */
    counterDeltas: ReadonlyArray<{ houseKey: SubHouseKey; delta: number }>;
    /** Optional public-knowledge headline if the counter fires. */
    counterSummary?: string;
  };
}

// --- Agenda shape ---------------------------------------------------------

export interface SeasonAgendaDef {
  agendaKey: string;
  /** Owning priority-roster NPC. */
  npcKey: NpcKey;
  /** Sub-house this agenda primarily advances. */
  primaryHouseKey: SubHouseKey;
  /** Sub-house this agenda primarily threatens (rival or out-of-faction). */
  threatenedHouseKey: SubHouseKey;
  /** Human-readable label. */
  name: string;
  /** Long-form context shown in the court widget. */
  loreContext: string;
  /** Stages in tick order. */
  stages: ReadonlyArray<AgendaStageDef>;
  /** Optional saga-act minimum to surface this agenda. */
  minAct?: number;
  /** Optional reveal stage requirement (e.g. Hierophant post_arena). */
  requiresRevealStage?: string;
  /** Free-form bible-attested metadata. */
  metadata?: Readonly<Record<string, string>>;
}

// --- Validator ------------------------------------------------------------

/** Validate an agenda definition. Returns errors or []. */
export function validateAgendaDef(
  agenda: SeasonAgendaDef,
): ReadonlyArray<string> {
  const errors: string[] = [];
  if (agenda.stages.length === 0) {
    errors.push(`${agenda.agendaKey}: agenda has no stages`);
  }
  if (agenda.primaryHouseKey === agenda.threatenedHouseKey) {
    errors.push(
      `${agenda.agendaKey}: primary and threatened houses must differ`,
    );
  }
  const seenStages = new Set<string>();
  let lastTickOffset = -Infinity;
  for (const stage of agenda.stages) {
    if (seenStages.has(stage.stageId)) {
      errors.push(`${agenda.agendaKey}: duplicate stageId ${stage.stageId}`);
    }
    seenStages.add(stage.stageId);
    if (stage.tickOffset < 0 || !Number.isInteger(stage.tickOffset)) {
      errors.push(
        `${agenda.agendaKey}/${stage.stageId}: tickOffset must be a non-negative integer`,
      );
    }
    if (stage.tickOffset < lastTickOffset) {
      errors.push(
        `${agenda.agendaKey}/${stage.stageId}: tickOffset ${stage.tickOffset} regresses from ${lastTickOffset}`,
      );
    }
    lastTickOffset = stage.tickOffset;
    if (stage.worldStepDeltas.length === 0) {
      errors.push(
        `${agenda.agendaKey}/${stage.stageId}: worldStepDeltas cannot be empty`,
      );
    }
  }
  return errors;
}

// --- Reference agendas (one per major broker, for phase 4 wiring) --------

/**
 * Phase-1 reference agendas. Authoring tone is bible-faithful but
 * intentionally conservative — phase 4 will expand stage counts and
 * add the inter-agenda cross-references the Antiquarian canon
 * implies.
 */
export const REFERENCE_AGENDAS: ReadonlyArray<SeasonAgendaDef> = [
  {
    agendaKey: "agenda.locke.bind_a_partner",
    npcKey: "adjudicator_locke",
    primaryHouseKey: "nb_authoritys_ledger",
    threatenedHouseKey: "nb_civic_engineers",
    name: "Bind a Partner",
    loreContext:
      "Locke spends the season identifying a single trading partner he can bind to an exclusive retainer. Every uncountered tick narrows the field. By the closing phase, only one signature is required to close the deal — and the Civic Engineers will have lost a sector of operating budget for every step.",
    stages: [
      {
        stageId: "shortlist",
        label: "Shortlist drafted",
        loreContext:
          "Locke's clerks finalise the candidate list. The names are not public; the absence of names is.",
        tickOffset: 1,
        worldStepSummary:
          "The Authority's Ledger circulates a shortlist. Civic engineering budgets are quietly trimmed.",
        worldStepDeltas: [
          { houseKey: "nb_authoritys_ledger", delta: 8 },
          { houseKey: "nb_civic_engineers", delta: -5 },
        ],
        counter: {
          description:
            "Sign a one-off Independent contract worth ≥ 5000 credits to demonstrate alternative loyalty.",
          cost: { kind: "credits", amount: 5000 },
          counterDeltas: [
            { houseKey: "ind_freeports", delta: 4 },
            { houseKey: "nb_authoritys_ledger", delta: -3 },
          ],
          counterSummary:
            "An Independent contract closed first. The shortlist quietly recirculates.",
        },
      },
      {
        stageId: "audit_tour",
        label: "Audit tour",
        loreContext:
          "Adjudicator Locke personally audits each remaining candidate's books. The Civic Engineers know exactly which sectors lose three days of generator throughput while he visits.",
        tickOffset: 4,
        worldStepSummary:
          "Locke's audit tour completes. Several civic-engineer stations report unscheduled outages.",
        worldStepDeltas: [
          { houseKey: "nb_authoritys_ledger", delta: 6 },
          { houseKey: "nb_civic_engineers", delta: -8 },
        ],
        counter: {
          description:
            "Deliver an attribution-clean tribute to the Civic Engineers.",
          cost: {
            kind: "tribute_item",
            receivingHouse: "nb_civic_engineers",
            minWeight: 1.0,
          },
          counterDeltas: [
            { houseKey: "nb_civic_engineers", delta: 6 },
            { houseKey: "nb_authoritys_ledger", delta: -2 },
          ],
        },
      },
      {
        stageId: "binding",
        label: "Binding signature",
        loreContext:
          "Locke offers the partnership. Whoever signs is locked out of the rival pole for a season.",
        tickOffset: 7,
        worldStepSummary:
          "Locke binds his partner. The rival pole's brokers refuse new contracts for the remainder of the season.",
        worldStepDeltas: [
          { houseKey: "nb_authoritys_ledger", delta: 12 },
          { houseKey: "hierarchy_severance", delta: -8 },
        ],
        counter: {
          description:
            "Sign Locke's exclusive retainer yourself — accept the lock-out clause publicly.",
          cost: { kind: "contract_signed", brokerKey: "broker_locke" },
          counterDeltas: [
            { houseKey: "nb_authoritys_ledger", delta: 18 },
            { houseKey: "hierarchy_severance", delta: -12 },
          ],
          counterSummary:
            "The player closed Locke's retainer. The Hierarchy's Trench desk goes dark.",
        },
      },
    ],
  },
  {
    agendaKey: "agenda.nilmorg.take_the_trench",
    npcKey: "nilmorg",
    primaryHouseKey: "hierarchy_severance",
    threatenedHouseKey: "hierarchy_acquisitions",
    name: "Take the Trench",
    loreContext:
      "Severance Division wants the Trench under institutional precision. Acquisitions wants it under blood-weave. Nilmorg moves first; the player's only question is whether to ride along or break the tide.",
    stages: [
      {
        stageId: "platforms_secured",
        label: "Platforms secured",
        loreContext: "Nilmorg's clone-economy crews seize three peripheral platforms.",
        tickOffset: 2,
        worldStepSummary: "Severance Division secures three Trench platforms. Acquisitions retracts.",
        worldStepDeltas: [
          { houseKey: "hierarchy_severance", delta: 7 },
          { houseKey: "hierarchy_acquisitions", delta: -7 },
        ],
        counter: {
          description: "Run an Acquisitions-aligned mission to push back.",
          cost: { kind: "influence", amount: 50 },
          counterDeltas: [
            { houseKey: "hierarchy_acquisitions", delta: 5 },
            { houseKey: "hierarchy_severance", delta: -3 },
          ],
        },
      },
      {
        stageId: "ritual_signed",
        label: "Ritual signed",
        loreContext:
          "Nilmorg signs the Severance Prize ritual that seals the campaign. Once stamped, no Acquisitions counter is possible until next season.",
        tickOffset: 6,
        worldStepSummary:
          "The Severance Prize ritual is signed. Acquisitions is locked out of the Trench until next season.",
        worldStepDeltas: [
          { houseKey: "hierarchy_severance", delta: 14 },
          { houseKey: "hierarchy_acquisitions", delta: -10 },
        ],
        counter: {
          description: "Deliver three legendary cards of any faction except Hierarchy to break the ritual material.",
          cost: {
            kind: "tribute_card",
            cardFaction: "neutral",
            minRarity: "legendary",
            count: 3,
          },
          counterDeltas: [
            { houseKey: "hierarchy_acquisitions", delta: 10 },
            { houseKey: "hierarchy_severance", delta: -8 },
          ],
        },
      },
    ],
  },
  {
    agendaKey: "agenda.antiquarian.recover_attribution",
    npcKey: "the_seer",
    primaryHouseKey: "antiquarian_shelfmates",
    threatenedHouseKey: "antiquarian_casino",
    name: "Recover Attribution",
    loreContext:
      "The Antiquarian's shelf-mates spend the season tracing a stolen attribution back to its rightful citation. Casino Floor would prefer the citation stay open — they're running a market on its outcome.",
    stages: [
      {
        stageId: "scaffolding",
        label: "Citations scaffolded",
        loreContext: "Daniel Cross builds the cross-reference graph.",
        tickOffset: 2,
        worldStepSummary: "The Archive cross-references a missing attribution. Casino spreads tighten.",
        worldStepDeltas: [
          { houseKey: "antiquarian_shelfmates", delta: 5 },
          { houseKey: "antiquarian_casino", delta: -2 },
        ],
        counter: {
          description: "Place a Casino bet that lengthens the spread.",
          cost: { kind: "credits", amount: 2500 },
          counterDeltas: [
            { houseKey: "antiquarian_casino", delta: 4 },
            { houseKey: "antiquarian_shelfmates", delta: -2 },
          ],
        },
      },
      {
        stageId: "attribution_filed",
        label: "Attribution filed",
        loreContext:
          "The shelf-mate cites the source. The market closes; whoever bet on the open outcome loses everything.",
        tickOffset: 5,
        worldStepSummary: "Attribution recovered. The Casino spread closes worthless.",
        worldStepDeltas: [
          { houseKey: "antiquarian_shelfmates", delta: 12 },
          { houseKey: "antiquarian_casino", delta: -8 },
        ],
        counter: {
          description:
            "Deliver a Casino-aligned tribute that demonstrates the alternative epistemic.",
          cost: {
            kind: "tribute_item",
            receivingHouse: "antiquarian_casino",
            minWeight: 0.8,
          },
          counterDeltas: [
            { houseKey: "antiquarian_casino", delta: 8 },
            { houseKey: "antiquarian_shelfmates", delta: -3 },
          ],
        },
      },
    ],
  },
];

/** Validate every reference agenda. Used by tests. */
export function validateAllReferenceAgendas(): ReadonlyArray<string> {
  const errors: string[] = [];
  for (const agenda of REFERENCE_AGENDAS) {
    const e = validateAgendaDef(agenda);
    if (e.length > 0) errors.push(...e);
  }
  return errors;
}

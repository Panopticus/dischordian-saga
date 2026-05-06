// apps/shared/tradeEmpire/galacticEvents.ts
//
// Galactic event registry — Phase B of the Lore-Aligned Galactic-
// Empire Overhaul.
//
// Background-fired events the world generates on its own. Mirrors the
// SeasonAgendaDef shape so authoring tools, validators, and the
// public-knowledge log all stay consistent.
//
// Where agendas track *one named NPC's* multi-stage plan against the
// player, galactic events are *per-tick world rolls* that may or may
// not trigger based on weight and trigger conditions. The Wraith
// Hierophant's revival activating, a pirate raid in the east corridor,
// a sudden Antiquarian citation reconstruction — these are events.
//
// Activation:
//   The season tick driver calls `pickEventsToFire(state, rng)` once
//   per agenda tick (running phase only). Each fired event posts to
//   the public-knowledge log and applies its primary effect.
//
// Authoring notes:
//   - eventKey is dot-namespaced. e.g. "evt.pirate_raid.east_corridor".
//   - weight is rolled per-tick when the trigger condition is met.
//   - effects.subHouseDeltas use the rivalryDeltas math in
//     subHouseReputationService — list only the *primary* delta per
//     event; rivalry math handles anti-correlation.

import type { SubHouseKey } from "./houses";

// --- Trigger conditions ---------------------------------------------------

export type EventTrigger =
  /** Fires (with weight) any time the season runs. */
  | { kind: "random_per_tick"; weight: number }
  /** Fires when the season transitions into the named phase. */
  | { kind: "season_phase_enter"; phase: "prologue" | "running" | "closing" | "interregnum"; weight: number }
  /** Fires when a specific public-knowledge flag has been posted recently. */
  | { kind: "after_flag"; flag: string; weight: number }
  /** Fires when an agenda has reached a completion stage. */
  | { kind: "after_agenda_resolved"; agendaKey: string; weight: number }
  /** Fires when global Dischordia conditions are met. */
  | { kind: "dischordia_balance"; balance: "dark_ascending" | "light_ascending"; weight: number };

// --- Event effect ---------------------------------------------------------

export interface GalacticEventEffect {
  /** Human-readable summary posted to the public-knowledge feed. */
  summary: string;
  /** Sub-house rep deltas applied through rivalryDeltas (anti-correlated). */
  subHouseDeltas?: ReadonlyArray<{ houseKey: SubHouseKey; delta: number }>;
  /** Optional additional public-knowledge flag set by this event. */
  publicFlag?: string;
  /** Optional eventKind override for the public-knowledge log entry. */
  eventKind?:
    | "season_declaration"
    | "agenda_step"
    | "sector_flipped"
    | "anomaly_discovered"
    | "ruin_uncovered"
    | "tribute_paid"
    | "demand_paid"
    | "demand_refused";
}

// --- Optional player counter ---------------------------------------------

export interface GalacticEventPlayerCounter {
  description: string;
  cost:
    | { kind: "credits"; amount: number }
    | { kind: "influence"; amount: number }
    | { kind: "intelligence"; amount: number }
    | { kind: "tribute_card"; minRarity: string; count: number };
  counterDeltas: ReadonlyArray<{ houseKey: SubHouseKey; delta: number }>;
}

// --- Event definition -----------------------------------------------------

export interface GalacticEventDef {
  eventKey: string;
  name: string;
  loreContext: string;
  trigger: EventTrigger;
  effect: GalacticEventEffect;
  /** Optional one-shot counter the player can invoke after the event fires. */
  playerCounter?: GalacticEventPlayerCounter;
  /** Optional saga-act minimum to surface this event. */
  minAct?: number;
}

// --- Reference event registry --------------------------------------------
//
// Phase B ships ~6 events covering the major political vectors. Each
// activates a Galactic Dance faction or extends the Wraith Hierophant /
// Drael'Mon arc. Phase D will expand authoring.

export const REFERENCE_GALACTIC_EVENTS: ReadonlyArray<GalacticEventDef> = [
  {
    eventKey: "evt.hierophant.revival_call",
    name: "The Wraith Hierophant calls a revival",
    loreContext:
      "Wraith Calder, the Wraith Hierophant, opens a public sermon. The flock fills the seats. The Authority's auditors and the Syndicate's recruiters both note the attendance.",
    trigger: { kind: "random_per_tick", weight: 0.18 },
    effect: {
      summary:
        "The Wraith Hierophant called a public revival. The Council's rolls grew.",
      subHouseDeltas: [{ houseKey: "thaloria_council", delta: 6 }],
      eventKind: "agenda_step",
    },
    playerCounter: {
      description:
        "Pay tribute (a rare-or-better card) to amplify the revival.",
      cost: { kind: "tribute_card", minRarity: "rare", count: 1 },
      counterDeltas: [
        { houseKey: "thaloria_council", delta: 6 },
        { houseKey: "thaloria_quietwork", delta: 4 },
      ],
    },
  },
  {
    eventKey: "evt.drael_mon.acquisition_sweep",
    name: "Drael'Mon runs an acquisition sweep",
    loreContext:
      "Acquisitions takes a quarter-day pass through the Trench. Three small operators are absorbed. Nilmorg's Severance desk receives the closing paperwork without comment.",
    trigger: { kind: "random_per_tick", weight: 0.15 },
    effect: {
      summary:
        "Drael'Mon's Acquisitions sweep absorbed three small operators in the Trench.",
      subHouseDeltas: [{ houseKey: "hierarchy_acquisitions", delta: 7 }],
      eventKind: "agenda_step",
    },
    playerCounter: {
      description:
        "Spend influence to publicly oppose the sweep on behalf of the absorbed operators.",
      cost: { kind: "influence", amount: 75 },
      counterDeltas: [
        { houseKey: "hierarchy_acquisitions", delta: -5 },
        { houseKey: "ind_freeports", delta: 6 },
      ],
    },
  },
  {
    eventKey: "evt.syndicate_of_death.sacrifice_published",
    name: "A Syndicate of Death sacrifice is published",
    loreContext:
      "The Hierarchy's death-cult arm publishes a sacrifice as 'liturgy'. The Wraith Hierophant's chapel circulates the citation within the hour.",
    trigger: { kind: "random_per_tick", weight: 0.1 },
    effect: {
      summary:
        "The Syndicate of Death published a sacrifice. The Wraith Hierophant's chapel responded.",
      subHouseDeltas: [
        { houseKey: "hierarchy_syndicate_of_death", delta: 6 },
        { houseKey: "thaloria_council", delta: 4 },
      ],
      eventKind: "agenda_step",
    },
    playerCounter: {
      description:
        "Spend intelligence to suppress the sacrifice's publication before it spreads.",
      cost: { kind: "intelligence", amount: 50 },
      counterDeltas: [
        { houseKey: "hierarchy_syndicate_of_death", delta: -8 },
        { houseKey: "thaloria_council", delta: 6 },
      ],
    },
  },
  {
    eventKey: "evt.antiquarian.citation_reconstruction",
    name: "Daniel Cross opens a citation reconstruction",
    loreContext:
      "A long-lost attribution surfaces in the Refuge. Daniel Cross opens the reconstruction. Casino Floor closes its open spreads at par.",
    trigger: { kind: "random_per_tick", weight: 0.12 },
    effect: {
      summary:
        "Daniel Cross opened a citation reconstruction. Casino Floor closed its spreads.",
      subHouseDeltas: [
        { houseKey: "antiquarian_shelfmates", delta: 5 },
        { houseKey: "antiquarian_casino", delta: -3 },
      ],
      eventKind: "agenda_step",
    },
  },
  {
    eventKey: "evt.locke.audit_quarter",
    name: "Adjudicator Locke opens an audit quarter",
    loreContext:
      "The Authority's Ledger schedules a sector-wide audit window. Civic Engineers brace for the standard two-week disruption.",
    trigger: { kind: "season_phase_enter", phase: "running", weight: 0.5 },
    effect: {
      summary:
        "Adjudicator Locke opened an audit quarter. The Ledger reads everyone's books.",
      subHouseDeltas: [
        { houseKey: "nb_authoritys_ledger", delta: 5 },
        { houseKey: "nb_civic_engineers", delta: -3 },
      ],
      eventKind: "agenda_step",
      publicFlag: "evt.locke.audit_quarter.active",
    },
    playerCounter: {
      description:
        "Pay credits to file a clean audit return early and exempt yourself.",
      cost: { kind: "credits", amount: 3000 },
      counterDeltas: [{ houseKey: "nb_civic_engineers", delta: 4 }],
    },
  },
  {
    eventKey: "evt.engineers.civic_strike",
    name: "Civic Engineers stage a strike",
    loreContext:
      "The Civic Engineers walk off three lift networks for a single shift. The Authority signs a hasty wage adjustment. The strike succeeds before anyone read the small print.",
    trigger: { kind: "after_flag", flag: "evt.locke.audit_quarter.active", weight: 0.3 },
    effect: {
      summary:
        "The Civic Engineers struck three lift networks. The Authority's wage adjustment will be invoiced.",
      subHouseDeltas: [
        { houseKey: "nb_civic_engineers", delta: 6 },
        { houseKey: "nb_authoritys_ledger", delta: -4 },
      ],
      eventKind: "agenda_step",
    },
  },
];

// --- Trigger evaluation --------------------------------------------------

export interface TriggerContext {
  /** Phase the season just entered (set on transition ticks). */
  phaseEntered?: string;
  /** Public flags currently set system-wide. */
  recentPublicFlags: ReadonlySet<string>;
  /** Recently-resolved agenda keys. */
  resolvedAgendaKeys: ReadonlySet<string>;
  /** Current Dischordia balance. */
  dischordiaBalance?: string;
}

/** Pure evaluator: should this event's trigger fire (before weight roll)? */
export function triggerMatches(
  trigger: EventTrigger,
  ctx: TriggerContext,
): boolean {
  switch (trigger.kind) {
    case "random_per_tick":
      return true;
    case "season_phase_enter":
      return ctx.phaseEntered === trigger.phase;
    case "after_flag":
      return ctx.recentPublicFlags.has(trigger.flag);
    case "after_agenda_resolved":
      return ctx.resolvedAgendaKeys.has(trigger.agendaKey);
    case "dischordia_balance":
      return ctx.dischordiaBalance === trigger.balance;
  }
}

/**
 * Pure: pick a list of events to fire this tick. Caller supplies an
 * RNG for determinism (default Math.random).
 */
export function pickEventsToFire(
  events: ReadonlyArray<GalacticEventDef>,
  ctx: TriggerContext,
  rng: () => number = Math.random,
): ReadonlyArray<GalacticEventDef> {
  const out: GalacticEventDef[] = [];
  for (const event of events) {
    if (!triggerMatches(event.trigger, ctx)) continue;
    if (rng() < event.trigger.weight) out.push(event);
  }
  return out;
}

// --- Validator -----------------------------------------------------------

export function validateGalacticEventDef(
  event: GalacticEventDef,
): ReadonlyArray<string> {
  const errors: string[] = [];
  if (!event.eventKey || !event.eventKey.startsWith("evt.")) {
    errors.push(`${event.eventKey}: must start with "evt."`);
  }
  if (event.trigger.weight < 0 || event.trigger.weight > 1) {
    errors.push(`${event.eventKey}: trigger.weight ${event.trigger.weight} out of [0,1]`);
  }
  if (event.effect.subHouseDeltas) {
    for (const d of event.effect.subHouseDeltas) {
      if (!Number.isFinite(d.delta) || d.delta === 0) {
        errors.push(`${event.eventKey}: sub-house delta must be non-zero finite`);
      }
    }
  }
  return errors;
}

export function validateAllReferenceEvents(): ReadonlyArray<string> {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const event of REFERENCE_GALACTIC_EVENTS) {
    if (seen.has(event.eventKey)) {
      errors.push(`duplicate eventKey: ${event.eventKey}`);
    }
    seen.add(event.eventKey);
    errors.push(...validateGalacticEventDef(event));
  }
  return errors;
}

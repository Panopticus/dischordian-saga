// apps/shared/factions/objectives.ts
//
// Faction-scope objectives — NPC depth #11.
//
// Sits *above* the per-NPC agenda system (apps/shared/tradeEmpire/agendas.ts):
// each agenda is one NPC's work in one season; each FactionObjective is
// the larger goal *multiple agendas* contribute to. The shipping
// agendaEngine ticks individual NPC agendas; this registry is the
// abstraction that lets us read the world as faction-actors rather
// than individual-actors.
//
// Hero example (and the plan's #11 motivating case): the Insurgency's
// `awaken_the_faithful` objective is co-driven by *two* agendas owned
// by *two* NPCs in *two* sub-houses with fundamentally different
// methods — Vex Solène's overt Coda authentication work
// (insurgency_old_network) and the Hierophant's covert
// infrastructure-building (thaloria_quietwork). The objective's
// progression reads from both agendas' stages.
//
// Pure data + helpers. The runtime tracker (which agendas have hit
// which stages) lives in apps/server/services/factionObjectiveService.ts;
// this module is the typed declaration of what's possible.

import type { CanonicalFactionId } from "../factionCrosswalk";
import type { SubHouseKey } from "../tradeEmpire/houses";

/**
 * One discrete objective a faction pursues. Spans 0+ agendas (each
 * agenda contributes via stage matches) and may pull in multiple
 * sub-houses with different methods.
 */
export interface FactionObjective {
  objectiveId: string;
  /** Canonical faction (apps/shared/factionCrosswalk.ts) that owns this objective. */
  factionCanonical: CanonicalFactionId;
  /** Human-readable name. */
  name: string;
  /** Long-form context. */
  loreContext: string;
  /**
   * Sub-houses participating in this objective, plus the *method*
   * each contributes. The rep deltas applied by individual agenda
   * stages aggregate up to drive the objective's progress.
   */
  participants: ReadonlyArray<ObjectiveParticipant>;
  /**
   * Per-objective stage milestones. Each milestone declares which
   * participating agendas must have hit which stages for the
   * milestone to be considered reached.
   */
  milestones: ReadonlyArray<ObjectiveMilestone>;
  /** Optional saga-act minimum. */
  minAct?: number;
  /** Optional reveal stage (e.g. "post_arena" gates Hierophant beats). */
  requiresRevealStage?: string;
  /** Free-form bible-attested metadata. */
  metadata?: Readonly<Record<string, string>>;
}

/**
 * One sub-house's role in an objective. The `method` is in-fiction
 * descriptive — players see this surfaced when they audit the
 * objective's progress. Two participants in the same objective
 * generally have OPPOSITE methods (overt vs. covert; institutional
 * vs. cellular) and the player choosing which to support drives the
 * objective's character.
 */
export interface ObjectiveParticipant {
  subHouse: SubHouseKey;
  /**
   * Human-readable description of the method this sub-house is using.
   * Authoring rule: short noun phrase, ≤ 20 words, no in-character
   * voice — this surfaces in the audit UI.
   */
  method: string;
  /**
   * AgendaKey from REFERENCE_AGENDAS that represents this
   * participant's contribution. Optional — a participant may
   * contribute via ad-hoc rep deltas rather than a structured agenda.
   */
  agendaKey?: string;
}

/**
 * A milestone in the objective's progression. The runtime tracker
 * (factionObjectiveService) considers a milestone reached when ALL
 * declared agenda+stage pairs have fired. Milestones in tickOffset
 * order; the world-tick service can fan out tick events when each
 * is reached.
 */
export interface ObjectiveMilestone {
  milestoneId: string;
  label: string;
  /**
   * Required stage hits. Each entry says "agendaKey X must have
   * fired stage Y." All required hits must be true for the
   * milestone to be reached. Empty → milestone is reached at start
   * (the objective's "kickoff" beat).
   */
  requiredStageHits: ReadonlyArray<{ agendaKey: string; stageId: string }>;
  /** Public-facing summary when this milestone fires. */
  summary: string;
}

// --- Registry ------------------------------------------------------------

/**
 * Initial cross-faction objectives. Each is bible-grounded and
 * references real agendas that exist in REFERENCE_AGENDAS.
 */
export const FACTION_OBJECTIVES: ReadonlyArray<FactionObjective> = [
  {
    objectiveId: "insurgency.awaken_the_faithful",
    factionCanonical: "insurgency",
    name: "Awaken the Faithful",
    loreContext:
      "The Insurgency's longest-running objective — and the one with the most operative diversity. Two sub-houses pursue it with opposite methods: Vex Solène's Old Network runs overt audit-and-broadcast operations against the Architect's Court; the Hierophant's Quietwork builds infrastructure-of-faith-resistance the Potentials inherit on return. Per bible §3.10, the Hierophant himself does not name this objective to himself as a plan — he writes names; the inheritance is structural consequence.",
    participants: [
      {
        subHouse: "insurgency_old_network",
        method: "overt audit + broadcast against Architect-suppressed material",
        agendaKey: "agenda.vex.authenticate_the_recording",
      },
      {
        subHouse: "thaloria_quietwork",
        method: "covert institution-building; per-name fidelity at population scale",
        agendaKey: "agenda.wraith.cultivate_the_successor",
      },
    ],
    milestones: [
      {
        milestoneId: "first_audit",
        label: "First audit lands",
        requiredStageHits: [
          { agendaKey: "agenda.vex.authenticate_the_recording", stageId: "cross_check" },
        ],
        summary: "Vex's Coda confirms a Hierophant-cosmology variance. The audit's first finding is on the record.",
      },
      {
        milestoneId: "infrastructure_seeded",
        label: "Inheritance infrastructure seeded",
        requiredStageHits: [
          { agendaKey: "agenda.wraith.cultivate_the_successor", stageId: "identify_successor" },
        ],
        summary: "Quietwork names a junior priest. The Tamarin scholarly community gains a continuity guarantee.",
      },
      {
        milestoneId: "broadcast_meets_inheritance",
        label: "Broadcast meets inheritance",
        requiredStageHits: [
          { agendaKey: "agenda.vex.authenticate_the_recording", stageId: "broadcast" },
          { agendaKey: "agenda.wraith.cultivate_the_successor", stageId: "transmit_method" },
        ],
        summary: "The Coda broadcast and the Tamarin transmission land in the same season. The Architect's Court loses suppression rights; the Hierarchy's Syndicate of Death loses operational reach.",
      },
      {
        milestoneId: "objective_complete",
        label: "Faithful awakened",
        requiredStageHits: [
          { agendaKey: "agenda.vex.authenticate_the_recording", stageId: "broadcast" },
          { agendaKey: "agenda.wraith.cultivate_the_successor", stageId: "bequeath" },
        ],
        summary: "The audit is published; the inheritance is bequeathed. The Insurgency's longest-running objective reaches its first complete-season state.",
      },
    ],
    metadata: {
      bibleAnchor: "wraith_calder §3.10 (covert inheritance); vex_solene §4.12 (Coda silence broken)",
    },
  },
  {
    objectiveId: "hierarchy.consolidate_the_trench",
    factionCanonical: "hierarchy_of_damned",
    name: "Consolidate the Trench",
    loreContext:
      "The Hierarchy's internal struggle for the Trench corridor — Severance Division and Acquisitions push opposite directions in the same arena. Either sub-house's win shifts the Hierarchy's posture for the season; the player's intervention picks the in-faction winner.",
    participants: [
      {
        subHouse: "hierarchy_severance",
        method: "institutional precision; ritual-clean closes; protocol enforcement",
        agendaKey: "agenda.nilmorg.take_the_trench",
      },
      {
        subHouse: "hierarchy_acquisitions",
        method: "hostile-takeover acquisition; cash-and-corridor seizure",
        agendaKey: "agenda.draelmon.quiet_acquisition",
      },
    ],
    milestones: [
      {
        milestoneId: "scout_complete",
        label: "Scouting complete",
        requiredStageHits: [
          { agendaKey: "agenda.draelmon.quiet_acquisition", stageId: "scout" },
        ],
        summary: "Acquisitions has flagged its target corridors. Severance has surcharged them.",
      },
      {
        milestoneId: "bid_filed",
        label: "Sealed bid filed",
        requiredStageHits: [
          { agendaKey: "agenda.draelmon.quiet_acquisition", stageId: "bid" },
        ],
        summary: "Acquisitions files. Severance must match or yield.",
      },
      {
        milestoneId: "trench_resolved",
        label: "Trench corridor resolved",
        requiredStageHits: [
          { agendaKey: "agenda.draelmon.quiet_acquisition", stageId: "seize" },
        ],
        summary: "The corridor is in one hand. Whichever sub-house won, the Hierarchy's seasonal posture is set.",
      },
    ],
    metadata: {
      bibleAnchor: "drael_mon (Acquisitions) + nilmorg (Severance) — canonical internal-rivalry per houses.ts",
    },
  },
  {
    objectiveId: "antiquarian.restore_attribution",
    factionCanonical: "antiquarian_circle",
    name: "Restore the Attribution",
    loreContext:
      "The Antiquarian Circle's purpose, distilled into a single objective: restore lost attribution chains the Shadow Tongue or Casino Floor have suppressed. Two sub-houses contribute — Cross-References Desk does the bibliographic work; Casino Floor benefits from the work being incomplete and runs markets on the missing entries.",
    participants: [
      {
        subHouse: "antiquarian_cross_references_desk",
        method: "scaffolding citation graphs; node-by-node restoration",
        agendaKey: "agenda.antiquarian.publish_the_citation",
      },
      {
        subHouse: "antiquarian_casino",
        method: "open-spread markets on contested attribution outcomes (the opposing pole)",
        agendaKey: "agenda.antiquarian.recover_attribution",
      },
    ],
    milestones: [
      {
        milestoneId: "graph_scaffolded",
        label: "Citation graph scaffolded",
        requiredStageHits: [
          { agendaKey: "agenda.antiquarian.publish_the_citation", stageId: "scaffold" },
        ],
        summary: "Cross-References Desk circulates the partial chain. Casino spreads narrow.",
      },
      {
        milestoneId: "boxes_filled",
        label: "Empty boxes filled",
        requiredStageHits: [
          { agendaKey: "agenda.antiquarian.publish_the_citation", stageId: "fill_the_boxes" },
        ],
        summary: "The chain is filled node-by-node. Two Shadow-Tongue redactions reverse.",
      },
      {
        milestoneId: "citation_published",
        label: "Citation published",
        requiredStageHits: [
          { agendaKey: "agenda.antiquarian.publish_the_citation", stageId: "publish" },
        ],
        summary: "The Programmer's Citation is on the upper shelf. Casino markets close at a loss.",
      },
    ],
    metadata: {
      bibleAnchor: "the_antiquarian §1.4 — bibliographic precision",
    },
  },
  {
    objectiveId: "thaloria.long_mourning_continuation",
    factionCanonical: "thaloria",
    name: "Continue the Long Mourning",
    loreContext:
      "Thaloria's only seasonal objective: the daily naming continues, and the Hierophant prepares for the eventual hand-off. Per bible §3.9, the Hierophant's bodily death is canonically scheduled for ~60 Thalorian-years from first encounter; this objective is the season-by-season work that runs the architecture toward that completion. The Council of Harmony participates as the institutional steward.",
    participants: [
      {
        subHouse: "thaloria_quietwork",
        method: "daily naming; covert inheritance per bible §3.10",
        agendaKey: "agenda.wraith.cultivate_the_successor",
      },
      {
        subHouse: "thaloria_council",
        method: "public stewardship; uncertainty-as-qualification governance",
      },
    ],
    milestones: [
      {
        milestoneId: "successor_named",
        label: "Successor named",
        requiredStageHits: [
          { agendaKey: "agenda.wraith.cultivate_the_successor", stageId: "identify_successor" },
        ],
        summary: "The Council confirms the named junior priest. The chamber adds a second chair.",
      },
      {
        milestoneId: "method_transmitted",
        label: "Method transmitted",
        requiredStageHits: [
          { agendaKey: "agenda.wraith.cultivate_the_successor", stageId: "transmit_method" },
        ],
        summary: "Three thousand years of practice condensed into a single Thalorian week of co-writing.",
      },
      {
        milestoneId: "architecture_bequeathed",
        label: "Architecture bequeathed",
        requiredStageHits: [
          { agendaKey: "agenda.wraith.cultivate_the_successor", stageId: "bequeath" },
        ],
        summary: "The inheritance is structurally complete. The continuation is guaranteed regardless of the Hierophant's individual continuation.",
      },
    ],
    requiresRevealStage: "post_arena",
    metadata: {
      bibleAnchor: "wraith_calder §3.9 (scheduled death) + §3.10 (covert inheritance)",
    },
  },
];

// --- Validation ----------------------------------------------------------

export function validateFactionObjective(
  o: FactionObjective,
): ReadonlyArray<string> {
  const errors: string[] = [];
  if (o.participants.length === 0) {
    errors.push(`${o.objectiveId}: requires ≥ 1 participant`);
  }
  if (o.milestones.length === 0) {
    errors.push(`${o.objectiveId}: requires ≥ 1 milestone`);
  }
  const seenMilestoneIds = new Set<string>();
  for (const m of o.milestones) {
    if (seenMilestoneIds.has(m.milestoneId)) {
      errors.push(
        `${o.objectiveId}: duplicate milestoneId ${m.milestoneId}`,
      );
    }
    seenMilestoneIds.add(m.milestoneId);
    // Every required-stage-hit's agendaKey must appear among the
    // participants' agendaKeys (or the milestone is unreachable).
    const declaredAgendaKeys = new Set<string>(
      o.participants
        .map(p => p.agendaKey)
        .filter((k): k is string => Boolean(k)),
    );
    for (const hit of m.requiredStageHits) {
      if (!declaredAgendaKeys.has(hit.agendaKey)) {
        errors.push(
          `${o.objectiveId}/${m.milestoneId}: requires stage hit on ${hit.agendaKey} but no participant declares that agenda`,
        );
      }
    }
  }
  return errors;
}

export function validateAllFactionObjectives(): ReadonlyArray<string> {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const o of FACTION_OBJECTIVES) {
    if (ids.has(o.objectiveId)) {
      errors.push(`Duplicate objectiveId: ${o.objectiveId}`);
    }
    ids.add(o.objectiveId);
    errors.push(...validateFactionObjective(o));
  }
  return errors;
}

// --- Helpers --------------------------------------------------------------

export function objectivesForFaction(
  canonical: CanonicalFactionId,
): ReadonlyArray<FactionObjective> {
  return FACTION_OBJECTIVES.filter(o => o.factionCanonical === canonical);
}

export function objectivesForAgenda(
  agendaKey: string,
): ReadonlyArray<FactionObjective> {
  return FACTION_OBJECTIVES.filter(o =>
    o.participants.some(p => p.agendaKey === agendaKey),
  );
}

/**
 * Given a set of agenda+stage hits the player has accumulated this
 * season, return the milestones that have been reached for an
 * objective. Pure function — no DB.
 */
export function reachedMilestones(
  objective: FactionObjective,
  hits: ReadonlySet<string>, // strings of shape `${agendaKey}::${stageId}`
): ReadonlyArray<ObjectiveMilestone> {
  return objective.milestones.filter(m =>
    m.requiredStageHits.every(h => hits.has(`${h.agendaKey}::${h.stageId}`)),
  );
}

/** Format a stage-hit key from agenda + stage. */
export function stageHitKey(agendaKey: string, stageId: string): string {
  return `${agendaKey}::${stageId}`;
}

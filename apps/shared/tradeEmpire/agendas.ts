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
      "Severance Division wants the Trench under institutional precision. Acquisitions wants it under blood-weave. Nilmorg moves first; the player's only question is whether to ride along or break the tide. Nilmorg does not thank the player for help; institutional cleanliness is its own gratitude.",
    stages: [
      {
        stageId: "platforms_secured",
        label: "Platforms secured",
        loreContext:
          "Nilmorg's clone-economy crews seize three peripheral platforms. The acquisition is performed entirely on paper — no shots fired, no blood spilled, no Acquisitions enforcer presented with anything to enforce against. By the time the Trench wakes, the deeds have already been re-titled.",
        tickOffset: 2,
        worldStepSummary:
          "Severance Division secures three Trench platforms by clean paperwork. Acquisitions retracts to its inner ring.",
        worldStepDeltas: [
          { houseKey: "hierarchy_severance", delta: 7 },
          { houseKey: "hierarchy_acquisitions", delta: -7 },
        ],
        counter: {
          description:
            "Run an Acquisitions-aligned mission and pay the influence to dispute the retitle.",
          cost: { kind: "influence", amount: 50 },
          counterDeltas: [
            { houseKey: "hierarchy_acquisitions", delta: 5 },
            { houseKey: "hierarchy_severance", delta: -3 },
          ],
          counterSummary:
            "An Acquisitions enforcer disputed three retitles before they registered. Severance reissues with a smaller signature block.",
        },
      },
      {
        stageId: "severance_audit",
        label: "Severance audit",
        loreContext:
          "Nilmorg's auditors arrive at every Acquisitions field office in the Trench with the same single-page demand: prove your books match the central ledger. The pages that fail are not punished — they are simply replaced. The replacements work for Severance now.",
        tickOffset: 4,
        worldStepSummary:
          "Severance auditors replace the Acquisitions field rolls. Five blood-weave enforcers wake up working for a different desk.",
        worldStepDeltas: [
          { houseKey: "hierarchy_severance", delta: 9 },
          { houseKey: "hierarchy_acquisitions", delta: -8 },
        ],
        counter: {
          description:
            "Deliver an attribution-clean tribute aligned to Acquisitions to demonstrate the field rolls are intact.",
          cost: {
            kind: "tribute_item",
            receivingHouse: "hierarchy_acquisitions",
            minWeight: 0.8,
          },
          counterDeltas: [
            { houseKey: "hierarchy_acquisitions", delta: 7 },
            { houseKey: "hierarchy_severance", delta: -4 },
          ],
          counterSummary:
            "An Acquisitions field office produced books that audited clean. The Severance auditors departed without comment, which is what their gratitude looks like.",
        },
      },
      {
        stageId: "ritual_signed",
        label: "Ritual signed",
        loreContext:
          "Nilmorg signs the Severance Prize ritual that seals the campaign. Once stamped, no Acquisitions counter is possible until next season. The ritual is also a contract — the Severance Prize itself is offered to whichever ally invested earliest. The player who hesitated does not receive an explanation.",
        tickOffset: 7,
        worldStepSummary:
          "The Severance Prize ritual is signed. Acquisitions is locked out of the Trench until next season; the ledger is institutionally clean.",
        worldStepDeltas: [
          { houseKey: "hierarchy_severance", delta: 14 },
          { houseKey: "hierarchy_acquisitions", delta: -10 },
        ],
        counter: {
          description:
            "Deliver three legendary cards of any faction except Hierarchy to break the ritual material before stamping.",
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
          counterSummary:
            "Three legendary cards consumed; the ritual material is incomplete. Nilmorg does not thank the player. Acquisitions does, in a tone that suggests they remember.",
        },
      },
    ],
  },
  {
    agendaKey: "agenda.antiquarian.recover_attribution",
    npcKey: "the_antiquarian",
    primaryHouseKey: "antiquarian_shelfmates",
    threatenedHouseKey: "antiquarian_casino",
    name: "Recover Attribution",
    loreContext:
      "The Antiquarian's shelf-mates spend the season tracing a stolen attribution back to its rightful citation. Casino Floor would prefer the citation stay open — they're running a market on its outcome. Daniel Cross does not raise his voice; the Casino does not lower its odds. Both proceed as if the other is a citation error.",
    stages: [
      {
        stageId: "scaffolding",
        label: "Citations scaffolded",
        loreContext:
          "Daniel Cross builds the cross-reference graph. Margin notes proliferate; junior shelf-mates begin to recognise the shape of an attribution that wants to be filed. The Casino takes notice and tightens its spreads, because tightening is how the Casino disagrees.",
        tickOffset: 2,
        worldStepSummary:
          "The Archive cross-references a missing attribution. Casino spreads tighten on the resolution market.",
        worldStepDeltas: [
          { houseKey: "antiquarian_shelfmates", delta: 5 },
          { houseKey: "antiquarian_casino", delta: -2 },
        ],
        counter: {
          description:
            "Place a Casino bet that lengthens the spread — declare the citation will close open.",
          cost: { kind: "credits", amount: 2500 },
          counterDeltas: [
            { houseKey: "antiquarian_casino", delta: 4 },
            { houseKey: "antiquarian_shelfmates", delta: -2 },
          ],
          counterSummary:
            "A new Casino bet lengthens the resolution spread. Daniel Cross does not change pace; the shelves remember everything anyway.",
        },
      },
      {
        stageId: "false_citation_injected",
        label: "False citation injected",
        loreContext:
          "Casino Floor pays for a forged citation to be smuggled into a peripheral journal. If the shelf-mates index it, the cross-reference graph will lead to a dead source and the Casino's spread closes profitable. The forgery is excellent — it has the right paper, the right ink, the right margin discipline. It just isn't true.",
        tickOffset: 4,
        worldStepSummary:
          "A forged citation enters the cross-reference graph. The shelf-mates pause; the Casino spread widens in their favour.",
        worldStepDeltas: [
          { houseKey: "antiquarian_casino", delta: 7 },
          { houseKey: "antiquarian_shelfmates", delta: -5 },
        ],
        counter: {
          description:
            "Co-fund a forensic audit with the Cross-References Desk — they cover most of it, you cover a token share.",
          cost: {
            kind: "shared_cost",
            helperHouse: "antiquarian_cross_references_desk",
            totalCredits: 4000,
            playerShare: 0.25,
          },
          counterDeltas: [
            { houseKey: "antiquarian_shelfmates", delta: 5 },
            { houseKey: "antiquarian_cross_references_desk", delta: 4 },
            { houseKey: "antiquarian_casino", delta: -4 },
          ],
          counterSummary:
            "The Cross-References Desk co-funded the audit. The forgery is named in a margin note. The Casino does not comment publicly; privately it remembers who paid.",
        },
      },
      {
        stageId: "attribution_filed",
        label: "Attribution filed",
        loreContext:
          "The shelf-mate cites the source. The market closes; whoever bet on the open outcome loses everything. Daniel Cross writes a single margin note: 'recovered.' The Casino reads it and does not argue, because arguing with margin notes is a category error.",
        tickOffset: 7,
        worldStepSummary:
          "Attribution recovered. The Casino spread closes worthless; the bet-sheet is filed under the recovered citation.",
        worldStepDeltas: [
          { houseKey: "antiquarian_shelfmates", delta: 12 },
          { houseKey: "antiquarian_casino", delta: -8 },
        ],
        counter: {
          description:
            "Deliver a Casino-aligned tribute that demonstrates the alternative epistemic — that knowing was never the point.",
          cost: {
            kind: "tribute_item",
            receivingHouse: "antiquarian_casino",
            minWeight: 0.8,
          },
          counterDeltas: [
            { houseKey: "antiquarian_casino", delta: 8 },
            { houseKey: "antiquarian_shelfmates", delta: -3 },
          ],
          counterSummary:
            "A Casino-aligned tribute closed before the citation filed. The spread paid out at attribution-uncertain. Daniel Cross filed the margin note anyway, because the citation was always there.",
        },
      },
    ],
  },
  {
    agendaKey: "agenda.degen.spread_wider",
    npcKey: "the_degen",
    primaryHouseKey: "antiquarian_casino",
    threatenedHouseKey: "antiquarian_shelfmates",
    name: "Spread Wider",
    loreContext:
      "The Degen opens a futures market on a sub-house outcome — usually whichever feud the season is already running — and invites everyone to stake a position. The aleatory truth, per the Degen, is that the market itself is the answer; whoever bet correctly was correct, and whoever bet incorrectly was wrong, regardless of what 'happened.' Casino Floor does not ask which way the wind blows; Casino Floor sells the wind.",
    stages: [
      {
        stageId: "open_the_spread",
        label: "Spread opened",
        loreContext:
          "The Degen pre-positions a small edge — a single contract written before the spread opens, deniable, profitable, the size of an apology — and then opens the spread to the public. The Shelf-mates note the pre-position; the Casino notes the Shelf-mates noting; both sides settle in for the season.",
        tickOffset: 1,
        worldStepSummary:
          "The Degen opens a season-long spread. The Casino's pre-position is small enough to deny, large enough to matter.",
        worldStepDeltas: [
          { houseKey: "antiquarian_casino", delta: 6 },
          { houseKey: "antiquarian_shelfmates", delta: -3 },
        ],
        counter: {
          description:
            "File a Shelf-mates citation against the pre-position. Daniel Cross does not stop the spread — he stamps it.",
          cost: { kind: "credits", amount: 3000 },
          counterDeltas: [
            { houseKey: "antiquarian_shelfmates", delta: 5 },
            { houseKey: "antiquarian_casino", delta: -3 },
          ],
          counterSummary:
            "A Shelf-mates citation stamps the pre-position. The spread continues; the Casino's edge is now public, which is half of an edge.",
        },
      },
      {
        stageId: "hedge_invitation",
        label: "Hedge invitation",
        loreContext:
          "The Degen invites the major actors to stake the spread — Authority's Ledger, Severance, Free Ports, Thaloria. Most of them say no in writing, then send representatives in unmarked coats. Stake is gathered; the spread widens. By the time the season's running phase ends, more credits are committed to the Casino's outcome than to the outcome's actual mechanism.",
        tickOffset: 4,
        worldStepSummary:
          "Major actors quietly stake the spread. The Casino's house edge balloons; the underlying outcome is less important than who bet on it.",
        worldStepDeltas: [
          { houseKey: "antiquarian_casino", delta: 9 },
          { houseKey: "antiquarian_shelfmates", delta: -4 },
          { houseKey: "ind_freeports", delta: -2 },
        ],
        counter: {
          description:
            "Sign an Independent contract that anchors the underlying outcome to a real-world ledger entry, making the spread cite the mechanism instead of itself.",
          cost: { kind: "contract_signed", brokerKey: "broker_independent_freeport" },
          counterDeltas: [
            { houseKey: "ind_freeports", delta: 6 },
            { houseKey: "antiquarian_casino", delta: -5 },
          ],
          counterSummary:
            "The Free Ports anchored the spread to a real ledger. The Casino's edge narrowed by exactly the width of one contract. The Degen smiled at the player from behind the bar; the smile was an instrument.",
        },
      },
      {
        stageId: "close_worthless",
        label: "Closed worthless",
        loreContext:
          "Most of the spread closes worthless — the underlying outcome resolved against the public stake. The Casino's pre-position pays out at maximum. Whoever bet against the Degen's edge funded the Degen's next season. The Shelf-mates file a margin note — 'spread closed worthless, citation pending' — but the citation is the next season's problem, not this one's.",
        tickOffset: 7,
        worldStepSummary:
          "The spread closed worthless. The Casino took the rake; the public bet funds next season's edge.",
        worldStepDeltas: [
          { houseKey: "antiquarian_casino", delta: 14 },
          { houseKey: "antiquarian_shelfmates", delta: -6 },
          { houseKey: "nb_authoritys_ledger", delta: -3 },
        ],
        counter: {
          description:
            "Co-fund a Shelf-mates closing audit with the Cross-References Desk so the rake is at least documented in the season log.",
          cost: {
            kind: "shared_cost",
            helperHouse: "antiquarian_cross_references_desk",
            totalCredits: 6000,
            playerShare: 0.4,
          },
          counterDeltas: [
            { houseKey: "antiquarian_shelfmates", delta: 7 },
            { houseKey: "antiquarian_cross_references_desk", delta: 5 },
            { houseKey: "antiquarian_casino", delta: -6 },
          ],
          counterSummary:
            "The closing audit logged the rake. The Casino still took it, but the next season's spread will have to widen further to clear the same edge. The Degen, accosted, ordered another drink.",
        },
      },
    ],
  },
  // -----------------------------------------------------------------------
  // Phase 2 priority-roster agendas — extending the Stage-1 reference set
  // (Locke, Nilmorg, the Antiquarian-via-the_seer wrapper) with the
  // remaining active priority-roster NPCs. Each agenda is bible-grounded
  // and uses the canonical sub-house registry in houses.ts.
  // -----------------------------------------------------------------------
  {
    agendaKey: "agenda.antiquarian.publish_the_citation",
    npcKey: "the_antiquarian",
    primaryHouseKey: "antiquarian_cross_references_desk",
    threatenedHouseKey: "antiquarian_casino",
    name: "Publish the Programmer's Citation",
    loreContext:
      "Daniel Cross spends the season scaffolding a complete cross-reference for the Programmer's earliest writing — the work that became Logos. The Casino Floor has been running open markets on the missing attribution for a decade; Cross intends to close those markets by publishing the scaffolded chain of citations, restoring the attribution to the upper shelf where it belongs. The Hierophant has reserved a corner of the chamber for the published edition.",
    stages: [
      {
        stageId: "scaffold",
        label: "Citation graph scaffolded",
        loreContext:
          "Cross builds the cross-reference graph in his refuge. The graph cites the lost manuscript, then the lost copy of the lost manuscript, then the editor's notes on the copy. Each node holds a single empty box.",
        tickOffset: 1,
        worldStepSummary:
          "The Cross-References Desk circulates a partial citation chain. Casino spreads on the missing attribution narrow.",
        worldStepDeltas: [
          { houseKey: "antiquarian_cross_references_desk", delta: 6 },
          { houseKey: "antiquarian_casino", delta: -3 },
        ],
        counter: {
          description:
            "Place a high-spread Casino bet on the citation outcome — the Floor needs the market open a little longer.",
          cost: { kind: "credits", amount: 2500 },
          counterDeltas: [
            { houseKey: "antiquarian_casino", delta: 5 },
            { houseKey: "antiquarian_cross_references_desk", delta: -2 },
          ],
        },
      },
      {
        stageId: "fill_the_boxes",
        label: "The boxes filled",
        loreContext:
          "Cross delivers the citation evidence node-by-node. Each empty box on the graph receives a name, a date, and a corroborating witness. The Hierophant is canonically one of the witnesses, and the Inventor restored two of the entries the Shadow Tongue had edited out.",
        tickOffset: 4,
        worldStepSummary:
          "The Antiquarian fills the citation chain. Two Shadow-Tongue redactions are publicly reversed.",
        worldStepDeltas: [
          { houseKey: "antiquarian_cross_references_desk", delta: 7 },
          { houseKey: "antiquarian_casino", delta: -4 },
        ],
        counter: {
          description:
            "Tribute a Cross-References-aligned artefact (high-attribution craft).",
          cost: {
            kind: "tribute_item",
            receivingHouse: "antiquarian_cross_references_desk",
            minWeight: 1.0,
          },
          counterDeltas: [
            { houseKey: "antiquarian_cross_references_desk", delta: 9 },
            { houseKey: "antiquarian_casino", delta: -5 },
          ],
          counterSummary:
            "The player's tribute lands on the citation graph. The graph closes one stage early.",
        },
      },
      {
        stageId: "publish",
        label: "Citation published",
        loreContext:
          "Cross publishes. The citation is filed on the upper shelf adjacent to the Hierophant's wall of names. The Casino Floor settles its open positions at a loss.",
        tickOffset: 7,
        worldStepSummary:
          "The Programmer's Citation is published. The Casino's attribution market closes.",
        worldStepDeltas: [
          { houseKey: "antiquarian_cross_references_desk", delta: 12 },
          { houseKey: "antiquarian_casino", delta: -8 },
        ],
        counter: {
          description:
            "Sign the Antiquarian's attribution-audit retainer — co-publish under your name.",
          cost: { kind: "contract_signed", brokerKey: "broker_antiquarian_archive" },
          counterDeltas: [
            { houseKey: "antiquarian_cross_references_desk", delta: 16 },
            { houseKey: "antiquarian_casino", delta: -10 },
          ],
          counterSummary:
            "The player co-publishes with Cross. The shelf-mate band opens.",
        },
      },
    ],
    metadata: {
      bibleAnchor: "the_antiquarian §1.4 — bibliographic precision; attribution as canonical metadata",
    },
  },
  {
    agendaKey: "agenda.wraith.cultivate_the_successor",
    npcKey: "wraith_calder",
    primaryHouseKey: "thaloria_quietwork",
    threatenedHouseKey: "hierarchy_syndicate_of_death",
    name: "Cultivate the Successor",
    loreContext:
      "Per bible §3.10: the Hierophant's covert inheritance layer is a season-long act of structural cultivation. He identifies the Council of Harmony's named successor, walks them through three thousand years of accumulated method, and prepares the chamber for the hand-off. The Hierarchy's Syndicate of Death — which has historically preyed on the Tamarin faithful — loses operational reach with every successful step. The player observes; the player does not drive.",
    stages: [
      {
        stageId: "identify_successor",
        label: "Successor identified",
        loreContext:
          "The Council of Harmony confirms the named junior priest. The chamber adds a second chair to the writing desk. The Hierophant does not look up; the chair is placed during the day's writing without ceremony.",
        tickOffset: 2,
        worldStepSummary:
          "Quietwork names a junior priest. The Tamarin scholarly community gains a continuity guarantee.",
        worldStepDeltas: [
          { houseKey: "thaloria_quietwork", delta: 5 },
          { houseKey: "hierarchy_syndicate_of_death", delta: -4 },
        ],
        counter: {
          description:
            "Sit with the Hierophant during a Long Mourning beat — bear witness to the naming.",
          cost: { kind: "none" },
          counterDeltas: [
            { houseKey: "thaloria_quietwork", delta: 7 },
            { houseKey: "hierarchy_syndicate_of_death", delta: -5 },
          ],
          counterSummary:
            "The player attends the chamber. The successor's first day proceeds without interruption.",
        },
      },
      {
        stageId: "transmit_method",
        label: "Method transmitted",
        loreContext:
          "Three thousand years of per-name fidelity, distilled into observed practice. The successor writes alongside the Hierophant for one full Thalorian week. Neither speaks. The pen passes back and forth without comment.",
        tickOffset: 5,
        worldStepSummary:
          "Quietwork's restoration discipline is transmitted. Two Shadow-Tongue redactions reverse during the week.",
        worldStepDeltas: [
          { houseKey: "thaloria_quietwork", delta: 7 },
          { houseKey: "hierarchy_syndicate_of_death", delta: -5 },
        ],
        counter: {
          description:
            "Tribute a Tamarin-aligned attribution (high-fidelity craft) to the chamber.",
          cost: {
            kind: "tribute_item",
            receivingHouse: "thaloria_quietwork",
            minWeight: 1.0,
          },
          counterDeltas: [
            { houseKey: "thaloria_quietwork", delta: 9 },
            { houseKey: "hierarchy_syndicate_of_death", delta: -7 },
          ],
        },
      },
      {
        stageId: "bequeath",
        label: "Architecture bequeathed",
        loreContext:
          "The Hierophant does not die this season — the death is scheduled per bible §3.9. But the architecture is now transferable. The successor can keep the rate. The Council can keep the Tribunal. The Tamarin community can keep the practice. The inheritance is, structurally, complete. The Hierophant continues writing. The continuation is the point.",
        tickOffset: 7,
        worldStepSummary:
          "The Tamarin inheritance is structurally complete. The Hierarchy's Syndicate of Death loses its claim on the flock.",
        worldStepDeltas: [
          { houseKey: "thaloria_quietwork", delta: 12 },
          { houseKey: "hierarchy_syndicate_of_death", delta: -9 },
        ],
        counter: {
          description:
            "Sign the Quietwork facilitation retainer — the player accepts the role of parallel inheritor.",
          cost: { kind: "contract_signed", brokerKey: "broker_thaloria_quietwork" },
          counterDeltas: [
            { houseKey: "thaloria_quietwork", delta: 16 },
            { houseKey: "hierarchy_syndicate_of_death", delta: -12 },
          ],
          counterSummary:
            "The player accepts the parallel-inheritor role at Inheriting band. The chamber adds a third chair.",
        },
      },
    ],
    requiresRevealStage: "post_arena",
    metadata: {
      bibleAnchor: "wraith_calder §3.10 — the covert inheritance layer; observational reveal at Inheriting band only",
    },
  },
  {
    agendaKey: "agenda.vex.authenticate_the_recording",
    npcKey: "vex_solene",
    primaryHouseKey: "insurgency_old_network",
    threatenedHouseKey: "ae_architects_court",
    name: "Authenticate the Hierophant Recording",
    loreContext:
      "Per bible §4.2: Vex has one Hierophant interview tape with one answer that contradicts his stated cosmology. The Coda has been waiting on a season's worth of cross-checking before publishing. This agenda is the cross-checking — Vex traces the contradiction back to its source, confirms the variance is genuine, and broadcasts the discrepancy to the Coda's audit channel. The Architect's Court has been suppressing similar discrepancies for centuries; the broadcast costs them surveillance reach.",
    stages: [
      {
        stageId: "cross_check",
        label: "Discrepancy cross-checked",
        loreContext:
          "Vex re-listens to the recording with the Antiquarian's notes open. The contradiction holds. She files a chain-of-custody note in the Coda's archive.",
        tickOffset: 2,
        worldStepSummary:
          "The Coda flags a Hierophant cosmology variance. The Architect's surveillance corner reports increased static.",
        worldStepDeltas: [
          { houseKey: "insurgency_old_network", delta: 5 },
          { houseKey: "ae_architects_court", delta: -3 },
        ],
        counter: {
          description:
            "Tribute an Insurgency-aligned card with high attribution provenance to support the Coda's audit.",
          cost: {
            kind: "tribute_card",
            cardFaction: "insurgency",
            minRarity: "rare",
            count: 1,
          },
          counterDeltas: [
            { houseKey: "insurgency_old_network", delta: 7 },
            { houseKey: "ae_architects_court", delta: -5 },
          ],
        },
      },
      {
        stageId: "second_witness",
        label: "Second witness located",
        loreContext:
          "Vex finds someone who was in the chamber during the same window — a junior Council priest, a passing Antiquarian researcher, or a Loredex narrator with relevant audio. The witness corroborates the discrepancy. The Architect's Court loses one of its quiet contractors mid-season.",
        tickOffset: 5,
        worldStepSummary:
          "A second witness corroborates the variance. The Architect's Court loses a contractor.",
        worldStepDeltas: [
          { houseKey: "insurgency_old_network", delta: 6 },
          { houseKey: "ae_architects_court", delta: -4 },
        ],
        counter: {
          description:
            "Place a high-influence intercession that protects the witness from retaliation.",
          cost: { kind: "influence", amount: 40 },
          counterDeltas: [
            { houseKey: "insurgency_old_network", delta: 8 },
            { houseKey: "ae_architects_court", delta: -6 },
          ],
        },
      },
      {
        stageId: "broadcast",
        label: "Discrepancy broadcast",
        loreContext:
          "Vex publishes to the Coda audit channel. The recording is not the entire interview — only the contradicting clause and its corroboration. The Architect's surveillance loses the next quarter of pretending the cosmology was monolithic.",
        tickOffset: 7,
        worldStepSummary:
          "The Coda broadcasts the Hierophant variance. The Architect's Court reduces public posture for the season's remainder.",
        worldStepDeltas: [
          { houseKey: "insurgency_old_network", delta: 11 },
          { houseKey: "ae_architects_court", delta: -8 },
        ],
        counter: {
          description:
            "Sign the Coda's joint-broadcast retainer — co-author the audit publication.",
          cost: { kind: "contract_signed", brokerKey: "broker_independent_freeport" },
          counterDeltas: [
            { houseKey: "insurgency_old_network", delta: 15 },
            { houseKey: "ae_architects_court", delta: -10 },
          ],
          counterSummary:
            "The player co-authors the broadcast. The Coda opens an Inner-Circle slot at session close.",
        },
      },
    ],
    metadata: {
      bibleAnchor: "vex_solene §4.12; wraith_calder §4.2 — the Hierophant interview corroboration",
    },
  },
  {
    agendaKey: "agenda.draelmon.quiet_acquisition",
    npcKey: "drael_mon",
    primaryHouseKey: "hierarchy_acquisitions",
    threatenedHouseKey: "hierarchy_severance",
    name: "Quiet Acquisition of the Trade Lanes",
    loreContext:
      "Drael'Mon spends the season quietly acquiring trade-lane operating rights from the Severance Division. Acquisitions believes the lanes are under-extracted; Severance believes they are stable assets that fund institutional precision. The two desks negotiate around each other for the season; the player can either fund the bid, fund the defence, or stay out and let the Hierarchy spend itself thin.",
    stages: [
      {
        stageId: "scout",
        label: "Lanes scouted",
        loreContext:
          "Drael'Mon's analysts mark which corridors the Trench has been running thin. The list is not public; Severance learns of it the day after the contracts are circulated.",
        tickOffset: 1,
        worldStepSummary:
          "Acquisitions circulates a thin-corridor list. Severance announces a temporary surcharge on flagged routes.",
        worldStepDeltas: [
          { houseKey: "hierarchy_acquisitions", delta: 5 },
          { houseKey: "hierarchy_severance", delta: -3 },
        ],
        counter: {
          description:
            "Run a route through the flagged corridor; pay the Severance surcharge in person.",
          cost: { kind: "credits", amount: 4000 },
          counterDeltas: [
            { houseKey: "hierarchy_severance", delta: 6 },
            { houseKey: "hierarchy_acquisitions", delta: -3 },
          ],
        },
      },
      {
        stageId: "bid",
        label: "Sealed bid filed",
        loreContext:
          "Drael'Mon files the sealed bid on the most under-extracted corridor. The bid is structured so that Severance must either match in kind or surrender the operating rights for the rest of the season.",
        tickOffset: 4,
        worldStepSummary:
          "Acquisitions files a sealed bid. Severance is forced to match or yield.",
        worldStepDeltas: [
          { houseKey: "hierarchy_acquisitions", delta: 7 },
          { houseKey: "hierarchy_severance", delta: -5 },
        ],
        counter: {
          description:
            "Tribute a Severance-aligned acquisition (institutional-precision craft) so the desk can match the bid.",
          cost: {
            kind: "tribute_item",
            receivingHouse: "hierarchy_severance",
            minWeight: 1.0,
          },
          counterDeltas: [
            { houseKey: "hierarchy_severance", delta: 9 },
            { houseKey: "hierarchy_acquisitions", delta: -6 },
          ],
        },
      },
      {
        stageId: "seize",
        label: "Operating rights seized",
        loreContext:
          "Drael'Mon takes the corridor. The Trench's quarterly throughput drops by a third; Acquisitions's by-acquisition revenue rises by a half. The Hierarchy's overall season position is unchanged — the wealth has just moved one desk.",
        tickOffset: 7,
        worldStepSummary:
          "Acquisitions seizes the corridor. Severance's quarterly throughput drops.",
        worldStepDeltas: [
          { houseKey: "hierarchy_acquisitions", delta: 12 },
          { houseKey: "hierarchy_severance", delta: -8 },
        ],
        counter: {
          description:
            "Sign Drael'Mon's acquisition co-financing retainer — the player takes a quarter of the revenue stream.",
          cost: { kind: "contract_signed", brokerKey: "broker_nilmorg_severance" },
          counterDeltas: [
            { houseKey: "hierarchy_severance", delta: 10 },
            { houseKey: "hierarchy_acquisitions", delta: -4 },
          ],
          counterSummary:
            "The player takes a Severance-funded counter-position. Acquisitions takes the corridor at a steep discount.",
        },
      },
    ],
    metadata: {
      bibleAnchor: "drael_mon — Hierarchy SVP Acquisitions; reasonable in the room, ruinous in the margins",
    },
  },
  {
    agendaKey: "agenda.oracle.reveal_the_fragment",
    npcKey: "the_oracle",
    primaryHouseKey: "dreamer_shield_opaque",
    threatenedHouseKey: "ae_architects_court",
    name: "Reveal the Prophecy Fragment",
    loreContext:
      "The Oracle holds a prophecy fragment the Architect's Court has been suppressing for three centuries. This season she dispenses it — first as a private hint to a witness, then as a mid-broadcast reveal, then as a public reading. The fragment is canonically true, canonically dangerous to the Architect's surveillance, and canonically not interpretable in only one way. The Dreamer Shield is opaque by canon (per houses.ts) — the agenda advances regardless of player counter; the player's role is to interpret, not block.",
    stages: [
      {
        stageId: "private_hint",
        label: "Hint given",
        loreContext:
          "The Oracle dictates the fragment to a single witness. The witness is canonically the player if the player has reached Witnessed; otherwise an Antiquarian researcher or the Hierophant's Council priest.",
        tickOffset: 2,
        worldStepSummary:
          "The Oracle dictates a prophecy hint to a single witness. Architect surveillance increases.",
        worldStepDeltas: [
          { houseKey: "dreamer_shield_opaque", delta: 4 },
          { houseKey: "ae_architects_court", delta: -2 },
        ],
        counter: {
          description:
            "Witness the dictation in person — accept the fragment as given, do not paraphrase.",
          cost: { kind: "none" },
          counterDeltas: [
            { houseKey: "dreamer_shield_opaque", delta: 6 },
            { houseKey: "ae_architects_court", delta: -4 },
          ],
          counterSummary:
            "The player witnesses. The fragment lands canonically intact.",
        },
      },
      {
        stageId: "mid_broadcast",
        label: "Mid-broadcast reveal",
        loreContext:
          "The Oracle interrupts a Palimpsest broadcast and speaks the fragment over the Host's cadence. The Inventor catches the interruption mid-frame and preserves it in the broadcast archive.",
        tickOffset: 5,
        worldStepSummary:
          "The Oracle speaks the fragment over a broadcast. The Inventor preserves the moment.",
        worldStepDeltas: [
          { houseKey: "dreamer_shield_opaque", delta: 6 },
          { houseKey: "ae_architects_court", delta: -4 },
        ],
        counter: {
          description:
            "Tribute a Dreamer-faction card to amplify the fragment's reach.",
          cost: {
            kind: "tribute_card",
            cardFaction: "dreamer",
            minRarity: "uncommon",
            count: 2,
          },
          counterDeltas: [
            { houseKey: "dreamer_shield_opaque", delta: 8 },
            { houseKey: "ae_architects_court", delta: -6 },
          ],
        },
      },
      {
        stageId: "public_reading",
        label: "Public reading",
        loreContext:
          "The Oracle reads the fragment in full at a public chamber on Thaloria — the Council's antechamber, the Hierophant in the next room writing a name. The Architect's Court loses its three-century editorial privilege over the prophecy.",
        tickOffset: 7,
        worldStepSummary:
          "The Oracle reads the fragment publicly. The Architect's Court loses suppression rights.",
        worldStepDeltas: [
          { houseKey: "dreamer_shield_opaque", delta: 11 },
          { houseKey: "ae_architects_court", delta: -8 },
        ],
        counter: {
          description:
            "Sit in the antechamber during the reading — the player is canonically named in the prophecy's interpretation if present.",
          cost: { kind: "none" },
          counterDeltas: [
            { houseKey: "dreamer_shield_opaque", delta: 14 },
            { houseKey: "ae_architects_court", delta: -10 },
          ],
          counterSummary:
            "The player is named in the interpretation. The prophecy's address widens.",
        },
      },
    ],
    metadata: {
      bibleAnchor: "the_oracle — prophecy as witnessed dictation, never as instruction",
    },
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

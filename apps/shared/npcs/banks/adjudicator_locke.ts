// apps/shared/npcs/banks/adjudicator_locke.ts
//
// Phase 3 PILOT — Adjudicator Locke's NpcLine bank.
//
// Validates the unified architecture (Phase 1) + Trade Empire surfaces
// (Phase 2) by authoring real bible-canonical content per
// adjudicator_locke.md §§1-6.
//
// Per Locke bible §6 voice samples: each line carries the canonical
// Locke registers (Mercantile / Predatory / Collegial / Conspiratorial /
// Judicial). Trust bands per registry: Prospect / Client / Partner /
// Insider / Adjudicated.
//
// Canonical surfaces in this pilot bank:
//   - room (sector entry: trade_nexus)
//   - npc_line (mission briefings, contract signing, faction-betrayal
//     reactions)
//   - cinematic (signature first-meeting monologue)
//   - trade_empire (per-mission flavor)
//
// The selector validates per (npcKey, surface) catch-all rule: every
// surface has a catch-all line (no gates) so the silent-fail contract
// holds.

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "adjudicator_locke" as const;

export const ADJUDICATOR_LOCKE_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // SIGNATURE FIRST-MEETING (cinematic, Trade Hub arrival)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "locke.signature.welcome_to_the_authoritys_ledger",
    text:
      "Welcome to the Authority's ledger. I'm Adjudicator Locke. I read " +
      "contracts. I write contracts. I enforce contracts. The third one " +
      "is the part most people forget. Please don't.",
    surfaces: ["cinematic"],
    cooldownKey: "locke.first_meeting_signature",
    maxPlays: 1,
    setsFlags: ["broker_locke_first_meeting"],
    setsPublicFlags: ["met_adjudicator_locke"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // SECTOR ENTRY (room — trade_nexus)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "locke.room.trade_nexus.prospect.first_visit",
    text:
      "You're new at the Nexus. I file new arrivals under 'unpriced'. " +
      "It's not a slur; it's a category. Everything gets a price eventually.",
    surfaces: ["room"],
    requiresTrustBand: "Prospect",
    minAct: 1,
    cooldownKey: "locke.room.trade_nexus.prospect_intro",
    maxPlays: 2,
  },

  {
    npcKey: NPC_KEY,
    lineId: "locke.room.trade_nexus.partner.return_visit",
    text:
      "You've earned a chair, Partner. I'd rather you stay near the third " +
      "column — that's where the audit-friendly contracts live.",
    surfaces: ["room"],
    requiresTrustBand: "Partner",
    cooldownKey: "locke.room.trade_nexus.partner_return",
    maxPlays: 3,
  },

  {
    npcKey: NPC_KEY,
    lineId: "locke.room.trade_nexus.insider.deferred_threat",
    text:
      "Insider rates apply. So does Insider candor: the Nexus has a leak " +
      "this week, and I haven't decided yet whether you're the one " +
      "stopping it or the one I report. I'll let you know which.",
    surfaces: ["room"],
    requiresTrustBand: "Insider",
    minAct: 4,
    cooldownKey: "locke.room.trade_nexus.insider_threat",
    maxPlays: 1,
  },

  // Catch-all for room surface (silent-fail compliance)
  {
    npcKey: NPC_KEY,
    lineId: "locke.room.trade_nexus.catchall",
    text: "The Nexus is the Authority's ledger. Try not to bring weather in with you.",
    surfaces: ["room"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // CONTRACT SIGNING (npc_line — fine-print canon §1.4)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "locke.signing.audit_offered",
    text:
      "Before you sign, I'll offer the audit. Every contract I write has " +
      "fine print. Auditing it doesn't change the contract — it just means " +
      "you knew. Some clients think knowing is worse. They're not wrong, " +
      "but they're also not who I write contracts for.",
    surfaces: ["npc_line"],
    cooldownKey: "locke.signing.audit_offer",
  },

  {
    npcKey: NPC_KEY,
    lineId: "locke.signing.audited.respect_acknowledged",
    text:
      "You audited. Good. The retainer permits me to log every delivery " +
      "sector you touch for seven saga-years. That's the clause. You knew. " +
      "I respect that you knew. Sign here.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Client",
    unlockFlags: ["locke_retainer_audit_disclosed"],
    cooldownKey: "locke.signing.audited_response",
  },

  {
    npcKey: NPC_KEY,
    lineId: "locke.signing.unaudited.told_you_so",
    text:
      "There was a clause. There usually is. You didn't audit, so you didn't " +
      "see it. The retainer logs your delivery sectors for seven saga-years. " +
      "I'd have told you on signing if you'd asked. I'm telling you now.",
    surfaces: ["npc_line"],
    reactsToPublicFlag: "locke_retainer_audit_disclosed",
    excludeFlags: ["locke_retainer_audit_disclosed"], // Player did NOT audit
    cooldownKey: "locke.signing.unaudited_reveal",
  },

  // Catch-all for npc_line surface
  {
    npcKey: NPC_KEY,
    lineId: "locke.npc_line.catchall",
    text: "Read the contract. Sign if it makes sense. The Nexus opens at the third tone.",
    surfaces: ["npc_line"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // MULTI-STAGE CONTRACT DIALOG (Phase 6a.2 sub-chunk D — ~20 lines)
  //
  // Per Phase 2 contract template spec, Locke offers 3 canonical
  // contract templates with multi-stage execution:
  //   - locke.retainer_baseline       (3 stages — 9 lines)
  //   - locke.exclusive_dealings      (2 stages — 6 lines)
  //   - locke.audit_clause            (1 stage  — 3 lines)
  // Each stage carries intro / check-in / completion beats.
  //
  // Plus the canonical "I told you" hidden-clause-discovered-mid-
  // execution beats per §1.4 tell #4 (deferred-threat lands when
  // the player did NOT audit at signing). 2 such beats = 20 lines
  // total.
  //
  // Distinguishes Locke from Nilmorg: Locke contracts canonically
  // HAVE fine print — the canonical opposite of Nilmorg's "no fine
  // print, full disclosure as honeypot" register. Both are dangerous
  // in opposite directions. Per §1.4 tell #4 the canonical Locke
  // posture is to OFFER the audit (existing locke.signing.audit_offered
  // line) and document the choice; she does not hide what she would
  // disclose if asked.
  // ═════════════════════════════════════════════════════════════════════

  // ─── locke.retainer_baseline (3 stages × 3 beats = 9 lines) ─────────

  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.retainer.stage1.intro",
    text:
      "Stage one of the retainer baseline. Standard New Babylon terms. " +
      "Five-percent commission on routes I broker for you. The clause is " +
      "on page three. Read it. The audit is still on offer.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_retainer_stage_1_started"],
    cooldownKey: "locke.contract.retainer.stage1",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.retainer.stage1.midpoint",
    text:
      "Mid-stage check on the retainer: you have routed three deliveries. " +
      "Two through me. One off-book. The off-book one is filed but " +
      "unbilled. I will mention it once.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_retainer_stage_1_started"],
    cooldownKey: "locke.contract.retainer.stage1.mid",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.retainer.stage1.completion",
    text:
      "Stage one closes. The retainer is active. The Authority has logged " +
      "you under 'reliable counterparty'. The phrasing is theirs, not " +
      "mine. Mine would be 'recurring'.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_retainer_stage_1_complete"],
    cooldownKey: "locke.contract.retainer.stage1.complete",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.retainer.stage2.intro",
    text:
      "Stage two opens. The retainer expands to include sector permits in " +
      "the Vox Corridor. The permits live in the second cabinet. Read " +
      "those too. Or do not. The clause does not change either way.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_retainer_stage_2_started"],
    cooldownKey: "locke.contract.retainer.stage2",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.retainer.stage2.midpoint",
    text:
      "Vox Corridor traffic is logged. Three deliveries this quarter. The " +
      "Authority's revenue share has been calculated. Yours has not been " +
      "delivered yet — that is stage three's deal.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_retainer_stage_2_started"],
    cooldownKey: "locke.contract.retainer.stage2.mid",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.retainer.stage2.completion",
    text:
      "Stage two closes. The Vox Corridor permits are yours through the " +
      "saga-quarter. Renew at the third tone or surrender them at the " +
      "second. I file either.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_retainer_stage_2_complete"],
    cooldownKey: "locke.contract.retainer.stage2.complete",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.retainer.stage3.intro",
    text:
      "Stage three: the renewal terms. The Authority offers a 12% rate " +
      "increase. You may accept, counter, or close. I am not lobbying. I " +
      "am presenting. The difference matters; do not collapse it.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_retainer_stage_3_started"],
    cooldownKey: "locke.contract.retainer.stage3",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.retainer.stage3.midpoint",
    text:
      "Renewal deliberation pending. The Authority does not pressure " +
      "deliberations. The Authority does, however, file the duration of " +
      "the deliberation. Currently: nine days. The longest in your file. " +
      "Just so you know.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_retainer_stage_3_started"],
    cooldownKey: "locke.contract.retainer.stage3.mid",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.retainer.stage3.completion",
    text:
      "Stage three closes. The retainer is renewed or closed. The Authority's " +
      "ledger is updated. So is mine. The two sets of books rarely match. " +
      "They match here.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_retainer_stage_3_complete"],
    cooldownKey: "locke.contract.retainer.stage3.complete",
    maxPlays: 1,
    setsFlags: ["locke_retainer_baseline_fulfilled"],
  },

  // ─── locke.exclusive_dealings (2 stages × 3 beats = 6 lines) ────────

  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.exclusive.stage1.intro",
    // Touché-arc canon: signing exclusivity locks Vex out per §2.3.
    // The line names the canonical structural cost without softening
    // it.
    text:
      "Stage one of the exclusive dealings agreement. New Babylon becomes " +
      "your sole brokerage. Coda becomes a memory. Vex Solène becomes " +
      "silent. You knew that when you signed.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_exclusive_stage_1_started"],
    cooldownKey: "locke.contract.exclusive.stage1",
    maxPlays: 2,
    setsPublicFlags: ["vex_locked_out_by_locke_exclusivity"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.exclusive.stage1.midpoint",
    text:
      "Mid-stage check on exclusivity: a Coda offer arrived in your inbox. " +
      "The Authority filed the offer as 'declined per contract terms'. You " +
      "are not required to read it. I read it. Don't ask.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_exclusive_stage_1_started"],
    cooldownKey: "locke.contract.exclusive.stage1.mid",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.exclusive.stage1.completion",
    text:
      "Stage one of exclusivity closes. The lock-out has held. Vex's " +
      "silence has been catalogued. I respect the silence. So should you.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_exclusive_stage_1_complete"],
    cooldownKey: "locke.contract.exclusive.stage1.complete",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.exclusive.stage2.intro",
    text:
      "Stage two of exclusivity opens. Renewal at the 90-day mark. Or " +
      "breach, at the same mark. Both options have been priced. The " +
      "Authority recommends the renewal. I am paid to make the " +
      "recommendation.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_exclusive_stage_2_started"],
    cooldownKey: "locke.contract.exclusive.stage2",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.exclusive.stage2.midpoint",
    text:
      "Mid-stage on exclusivity renewal: you have taken three meetings " +
      "outside the contract. The Authority filed those. The contract " +
      "permits up to two. We will discuss the third.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_exclusive_stage_2_started"],
    cooldownKey: "locke.contract.exclusive.stage2.mid",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.exclusive.stage2.completion",
    // Canonical Touché-arc closing register per §2.3. The line names
    // both possible outcomes without flattering either; Vex's
    // "forgives quickly" canon lands here.
    text:
      "Stage two of exclusivity closes. Either you renewed and Vex is " +
      "locked out for another quarter — or you breached, and Vex is " +
      "calling again. She forgives quickly. Neither of us is surprised.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_exclusive_stage_2_complete"],
    cooldownKey: "locke.contract.exclusive.stage2.complete",
    maxPlays: 1,
    setsFlags: ["locke_exclusive_dealings_fulfilled"],
  },

  // ─── locke.audit_clause (1 stage × 3 beats = 3 lines) ───────────────

  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.audit.stage1.intro",
    // §4.4 Antiquarian audit canon: the audit is canonically mutual.
    // The line names the canonical asymmetry — Locke is auditing the
    // Antiquarian; the Antiquarian is auditing Locke; the player
    // becomes a witness in the middle.
    text:
      "Stage one of the audit clause: the audit. The Antiquarian's " +
      "archives are open to me. The Antiquarian is not in the archives " +
      "this quarter. The Authority knows this. You know this now too.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_audit_stage_1_started"],
    cooldownKey: "locke.contract.audit.stage1",
    maxPlays: 2,
    setsPublicFlags: ["locke_disclosed_antiquarian_audit"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.audit.stage1.midpoint",
    text:
      "Audit underway. Three discrepancies catalogued. None are mine. None " +
      "are yours. The Antiquarian's accounting has a particular flavor. " +
      "You may want to learn to read it.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_audit_stage_1_started"],
    cooldownKey: "locke.contract.audit.stage1.mid",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.audit.stage1.completion",
    text:
      "Stage one of the audit clause closes. The audit is filed. The " +
      "Antiquarian will receive his copy within the hour. Yours is on the " +
      "second cabinet shelf. Read it before you read his.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_audit_stage_1_complete"],
    cooldownKey: "locke.contract.audit.stage1.complete",
    maxPlays: 1,
    setsFlags: ["locke_audit_clause_fulfilled"],
  },

  // ─── Hidden-clause-discovered "I told you" beats (§1.4 tell #4) ─────
  // Fires when the player did NOT audit at signing AND a clause has
  // activated mid-execution. The canonical Locke posture: she does
  // NOT gloat; she files the discovery as 'precedent' / 'pattern'.

  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.hidden_clause.first_discovery",
    text:
      "There. Page three of the retainer. The clause says I am authorized " +
      "to log every delivery sector you touch for seven saga-years. You " +
      "did not audit. I told you the audit was on offer. I am telling you " +
      "now. The deal stands. I file the discovery as 'precedent'. Continue.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_hidden_clause_first_activated"],
    excludeFlags: ["locke_retainer_audit_disclosed"],
    cooldownKey: "locke.contract.hidden_clause.first",
    maxPlays: 1,
    setsFlags: ["locke_hidden_clause_first_fired"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.contract.hidden_clause.second_discovery",
    // §1.4 tell #4 deferred-threat fully landed: the second hidden
    // clause is filed as a PATTERN, not an isolated event. The
    // Authority's risk-tolerant filing register tightens.
    text:
      "Second time. Different clause, same structure. You did not audit " +
      "this one either. I file the pattern as 'risk-tolerant counterparty'. " +
      "The Authority files it as 'discount-bearing'. They are not the " +
      "same file. Mine is the one you would prefer to be in.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_hidden_clause_second_activated"],
    excludeFlags: ["locke_retainer_audit_disclosed"],
    cooldownKey: "locke.contract.hidden_clause.second",
    maxPlays: 1,
    setsFlags: ["locke_hidden_clause_pattern_fired"],
    setsPublicFlags: ["locke_filed_player_as_risk_tolerant"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // MERCANTILE BASELINE COVERAGE (Phase 6a.2 sub-chunk C — ~12 lines)
  //
  // Per the writers'-guide spec: Mercantile is the canonical default
  // register and lives at the bank's bottom — but coverage was thin
  // on trade_empire / additional rooms / cinematic transitions /
  // additional npc_line beats. This sub-chunk fills those gaps so
  // the 5×5 personality-variant grid feels densely populated rather
  // than tier-band-thin.
  //
  // All 12 lines stay in canonical Mercantile register per §2.5
  // ("straightforward broker mode. Default voice."). Finance
  // vocabulary, transaction reframing, aphoristic close, deferred
  // threat — the canonical Locke tells.
  // ═════════════════════════════════════════════════════════════════════

  // ─── Trade Empire surface (5 lines) ─────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "locke.mercantile.trade_empire.broker_engagement.prospect",
    text:
      "Welcome to the Authority's mission ledger. The first deal is small. " +
      "The first deal is always small. The point is precedent, not profit. " +
      "Take it; take it badly; take something else — but pick. The clock " +
      "is the contract.",
    surfaces: ["trade_empire"],
    requiresTrustBand: "Prospect",
    unlockFlags: ["broker_locke_engagement_offered"],
    cooldownKey: "locke.mercantile.broker_first_offer",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.mercantile.trade_empire.mission_success.client",
    text:
      "Delivery confirmed. The invoice has cleared. I file you under 'on " +
      "time' for the first time. The file thickens; the rate hardens. " +
      "Bring me the next manifest when you have it.",
    surfaces: ["trade_empire"],
    requiresTrustBand: "Client",
    unlockFlags: ["locke_mission_succeeded"],
    cooldownKey: "locke.mercantile.mission_success",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.mercantile.trade_empire.mission_failure.client",
    // §1.5 silence-shape: she does NOT express regret as regret.
    // The line documents the cost without naming feeling.
    text:
      "Delivery missed. I do not file 'unfortunate'. I file 'cost-of-doing-" +
      "business'. The cost is yours. We will discuss whether the next " +
      "contract bears it as a discount or a clause.",
    surfaces: ["trade_empire"],
    requiresTrustBand: "Client",
    unlockFlags: ["locke_mission_failed"],
    cooldownKey: "locke.mercantile.mission_failure",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.mercantile.trade_empire.route_5_runs.partner",
    text:
      "Five runs on this route. The Authority files the route as " +
      "'consistent revenue'. I file the runner as 'consistent counterparty'. " +
      "Both files are open. Continue.",
    surfaces: ["trade_empire"],
    requiresTrustBand: "Partner",
    unlockFlags: ["route_milestone_5"],
    cooldownKey: "locke.mercantile.route_5",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.mercantile.trade_empire.route_25_runs.partner",
    // §1.4 tell #2 aphoristic-close — "That is monetary policy" lands
    // canonical canonical canonical. §1.6 metaphor source: monetary
    // policy as Locke's signature aphorism.
    text:
      "Twenty-five runs. The route is now part of the Authority's ledger " +
      "by repetition. The Authority did not authorize the route. The " +
      "Authority will not un-authorize it now. That is monetary policy.",
    surfaces: ["trade_empire"],
    requiresTrustBand: "Partner",
    unlockFlags: ["route_milestone_25"],
    cooldownKey: "locke.mercantile.route_25",
    maxPlays: 1,
  },

  // ─── Room surface (2 lines — fill missing Client + Adjudicated bands) ─

  {
    npcKey: NPC_KEY,
    lineId: "locke.mercantile.room.trade_nexus.client.ledger_opened",
    // §2.4 Client band canon: "Locke has opened a ledger with your name
    // on it." The line surfaces the canonical posture-shift directly.
    text:
      "You are no longer unpriced. I have opened a ledger with your name " +
      "on it. The chair on the third column has been adjusted to your " +
      "spine. Try to keep the back straight. The Authority watches what " +
      "you bring to the bench.",
    surfaces: ["room"],
    requiresTrustBand: "Client",
    minAct: 2,
    cooldownKey: "locke.mercantile.room.client",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.mercantile.room.trade_nexus.adjudicated.guest_column",
    // §2.4 Adjudicated band canon: "Locke has rendered her verdict: you
    // are worth the truth." The line names the institutional shift
    // without breaking into warmth (per §2.4 anti-warmth canon).
    text:
      "You have your own seat now. The Authority calls it the 'guest " +
      "column'. The Authority does not have guests. The Authority has " +
      "counterparties whose paperwork is filed in the second cabinet. " +
      "The second cabinet is yours.",
    surfaces: ["room"],
    requiresTrustBand: "Adjudicated",
    cooldownKey: "locke.mercantile.room.adjudicated",
    maxPlays: 1,
  },

  // ─── Cinematic surface (2 lines — first-contract-signed +
  //     Adjudicated-band-first-reach canonical moments) ────────────────

  {
    npcKey: NPC_KEY,
    lineId: "locke.mercantile.cinematic.first_contract_signed",
    text:
      "There. The signature is on the docket. The ink is dry. The clause " +
      "is yours to live with for the next seven saga-years. I have done " +
      "my part. Yours starts at the second tone.",
    surfaces: ["cinematic"],
    unlockFlags: ["locke_first_contract_signed"],
    cooldownKey: "locke.mercantile.cinematic.first_signed",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.mercantile.cinematic.adjudicated_first_reach",
    // §2.4 canonical Adjudicated-band threshold scene. Names the
    // canonical six-counterparty cap (the six coffin-minds' named
    // counterparties; the player becomes the seventh — institutional,
    // not personal).
    text:
      "The Authority has rendered. You have earned the verdict " +
      "'Adjudicated'. There are six counterparties at this tier. You " +
      "are the seventh. The seat is small. The accountability is large. " +
      "Welcome.",
    surfaces: ["cinematic"],
    requiresTrustBand: "Adjudicated",
    unlockFlags: ["locke_adjudicated_first_reach"],
    cooldownKey: "locke.mercantile.cinematic.adjudicated",
    maxPlays: 1,
    setsFlags: ["locke_player_adjudicated_tier_acknowledged"],
  },

  // ─── npc_line surface (3 lines — faction-align positive, broker
  //     decline, broker re-engagement) ─────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "locke.mercantile.npc_line.faction_align.new_babylon_positive",
    // Counterpart to the existing faction_align_new_babylon_negative
    // line per the canonical symmetric-flag pattern.
    text:
      "Your standing with New Babylon just turned positive. I file these " +
      "too. The file is shorter on this side; positive ledgers don't " +
      "require the same rate of footnotes. You are now allowed to read " +
      "three additional clauses. I will deliver them at your convenience.",
    surfaces: ["npc_line"],
    reactsToPublicFlag: "faction_align_new_babylon_positive",
    cooldownKey: "locke.mercantile.faction.new_babylon_gain",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.mercantile.npc_line.broker_decline",
    // §1.4 tell #1 — transaction reframe. Refusal is filed as price
    // discovery, not rejection. The line is canonical Locke posture
    // toward declining clients.
    text:
      "You declined the offer. I file 'declined' next to your name. " +
      "Decline is not refusal; it is price discovery. I will note the " +
      "price you implied and revise my next pitch accordingly.",
    surfaces: ["npc_line"],
    unlockFlags: ["broker_locke_offer_declined"],
    cooldownKey: "locke.mercantile.broker_decline",
    maxPlays: 3,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.mercantile.npc_line.broker_re_engagement",
    text:
      "You came back. The Authority does not file 'returned'. The Authority " +
      "files 'recurring'. You are now recurring. Recurring counterparties " +
      "get rates the first-time client does not see. That is the rate. " +
      "That is the rate.",
    surfaces: ["npc_line"],
    unlockFlags: ["broker_locke_re_engaged"],
    cooldownKey: "locke.mercantile.broker_reengage",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // 5×5 PERSONALITY-VARIANT GRID (Phase 6a.2 sub-chunk A)
  // Predatory + Collegial + Conspiratorial registers per §2.5 — the
  // "different pens, single hand" canon. Voice doesn't change; angle
  // does. Each variant gates on requiresTrustBand + playerAxisGate
  // so the selector picks the canonical register for the player's
  // current state.
  //
  // Mercantile lives at the default of the existing bank above; this
  // sub-chunk fills the other 3 archetypes for the trust bands where
  // they canonically emerge per §2.5.
  // ═════════════════════════════════════════════════════════════════════

  // ─── Predatory (low-trust + high-mercy player) ──────────────────────
  // Per §2.5: "she senses kindness as a surplus she can extract from,
  // and her lines become slightly crueler. She tests whether the
  // player's virtue is genuine or purchasable."

  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.predatory.prospect.kindness_test",
    text:
      "You agreed quickly. That's a kindness, my dear. I'll need to test " +
      "whether the kindness is genuine or only the look of it. The way I " +
      "test is to ask for slightly more next time. You'll tell me which " +
      "kind you are by what you do.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Prospect",
    playerAxisGate: {
      axis: "mercy",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.predatory.prospect",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.predatory.client.appetite_filed",
    text:
      "You give before I ask. That's interesting. I file 'gives without " +
      "prompting' under appetite. Appetites are leverage. I will not " +
      "punish your appetite. I will use it. I am telling you now because " +
      "you should know I'm telling you.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Client",
    playerAxisGate: {
      axis: "mercy",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.predatory.client",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.predatory.partner.kindness_as_vision",
    // §3.3 "appetite reframed as vision" canon — the canonical
    // mid-trust pivot where Locke's predation becomes flattery.
    text:
      "Your generosity has stopped looking like kindness, my friend. It " +
      "is starting to look like vision. I am willing to call it vision. " +
      "I will charge you the same rate either way.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Partner",
    playerAxisGate: {
      axis: "mercy",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.predatory.partner",
    maxPlays: 1,
  },

  // ─── Collegial (high-trust + pragmatic-wit player) ──────────────────
  // Per §2.5: "peer-mode. She drops honorifics, uses first-person
  // plural ('we'), treats the player as a board member."

  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.collegial.partner.no_table",
    text:
      "Sit closer. We don't need the table between us anymore. There are " +
      "three things on next quarter's docket I'd rather hear your read on " +
      "before I file mine.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Partner",
    playerAxisGate: {
      axis: "wit",
      magnitudes: ["mild_positive", "moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.collegial.partner",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.collegial.insider.board_member",
    // §1.5 protected: she does NOT name a coffin-mind individually.
    // The line names the institution and its docket without naming
    // any of the six.
    text:
      "You are not a counterparty anymore. You are a colleague who has " +
      "not yet been issued the full briefing. Let me correct that. The " +
      "Authority will be considering the Hierarchy's offer in the next " +
      "session. Your read on Nilmorg's reliability informs mine.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Insider",
    playerAxisGate: {
      axis: "wit",
      magnitudes: ["mild_positive", "moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.collegial.insider",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.collegial.adjudicated.peer_confessional",
    // §3.6 canon: at trust ≥80 she sacrifices operational information
    // about her own network. The Adjudicated-Collegial register is
    // the deepest peer-mode posture — she names the asymmetry between
    // her interest and the Authority's interest without retracting it.
    text:
      "We are colleagues now. The institutional language drops from here. " +
      "The truth I'd file with my peers is also the truth I'd file with " +
      "you. The Authority's interest and mine are not always the same. " +
      "You are the only person on this ship who knows that.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Adjudicated",
    playerAxisGate: {
      axis: "wit",
      magnitudes: ["mild_positive", "moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.collegial.adjudicated",
    maxPlays: 1,
    setsPublicFlags: ["locke_disclosed_authority_divergence"],
  },

  // ─── Conspiratorial (high-trust + manipulative/vigilant player) ─────
  // Per §2.5: "she offers shared knowledge as bond-of-crime. Here she
  // is at her most seductive and most dangerous."

  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.conspiratorial.insider.unread_clause",
    text:
      "Listen carefully — and do not make a face. There is a clause in " +
      "the Red Crystal Accord that the Authority itself has never read " +
      "in full. I have. You should. We will both deny this conversation. " +
      "That is the bond.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Insider",
    playerAxisGate: {
      axis: "vigilance",
      magnitudes: ["mild_positive", "moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.conspiratorial.insider",
    maxPlays: 1,
    setsPublicFlags: ["locke_shared_unsigned_clause"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.conspiratorial.adjudicated.cannot_be_filed",
    // §3.3 contradiction canon: the deepest she gets to attachment is
    // shared deniability. The line names that without naming feeling.
    text:
      "We have something now, you and I. It cannot be filed. It cannot " +
      "be unsigned. It is the kind of arrangement the Authority pretends " +
      "does not exist. The arrangement keeps me alive. I am telling you " +
      "because you keep me alive too.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Adjudicated",
    playerAxisGate: {
      axis: "vigilance",
      magnitudes: ["mild_positive", "moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.conspiratorial.adjudicated",
    maxPlays: 1,
    setsPublicFlags: ["locke_admitted_attachment_to_player"],
  },

  // ─── Judicial (any trust + suspicious-vigilance player) ────────────
  // Per §2.5: "she becomes formal and precise, turning the relationship
  // into something like cross-examination, where she invites challenge
  // so she can parry it." The canonical "I am filing this" register
  // lands across all 5 bands; the band-progression escalates the
  // posture (welcome-the-suspicion → invite-the-questioning →
  // professional-respect-for-the-catch → audit-rehearsal → legacy-
  // drafting). Sub-chunk B of the 5×5 variant grid.

  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.judicial.prospect.welcome_to_the_docket",
    text:
      "You came in suspicious. I file 'arrived skeptical' under " +
      "'professional'. Do not soften that. The client who reads the " +
      "contract twice gets a contract worth reading twice. Welcome to " +
      "the docket.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Prospect",
    playerAxisGate: {
      axis: "vigilance",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.judicial.prospect",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.judicial.client.cross_examination",
    text:
      "You are noting my phrasing. I will note that you are noting. We " +
      "are now having a cross-examination, which is a form I prefer. The " +
      "witness improves under questioning. Continue.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Client",
    playerAxisGate: {
      axis: "vigilance",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.judicial.client",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.judicial.partner.professional_courtesy",
    text:
      "You suspected me at the third quarter. You were correct to. The " +
      "clause did say what you thought it said, and you proved it before " +
      "I could pivot. I file that under 'professional courtesy'. Continue " +
      "questioning.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Partner",
    playerAxisGate: {
      axis: "vigilance",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.judicial.partner",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.judicial.insider.audit_rehearsal",
    text:
      "You are not catching me out anymore. You are rehearsing for the " +
      "room. Good. The Authority audits its own rulings; I would rather " +
      "you audit mine first. Bring me the questions you would ask under " +
      "oath.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Insider",
    playerAxisGate: {
      axis: "vigilance",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.judicial.insider",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.variant.judicial.adjudicated.legacy_drafting",
    // §3.6 deepest expression of professional respect: she shares
    // succession-drafting with the player. The line is canonical
    // "the only kind of legacy I am authorized to leave" — Locke
    // naming her own institutional mortality through paperwork.
    text:
      "We are no longer cross-examining each other. We are drafting " +
      "depositions for whoever inherits this office. I file that under " +
      "the only kind of legacy I am authorized to leave. Continue.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Adjudicated",
    playerAxisGate: {
      axis: "vigilance",
      magnitudes: ["moderate_positive", "strong_positive"],
    },
    cooldownKey: "locke.variant.judicial.adjudicated",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // TOUCHÉ EXTENSION (Phase 6a.2 sub-chunk E — 3 new Locke side lines)
  //
  // The canonical Locke ↔ Vex Touché-arc per §2.3 spans 5 canonical
  // beats: pre-exclusivity warning → at-signing → post-active →
  // at-end → at-breach. The contract block above carries the at-
  // signing / post-active / at-end beats (stage1.intro / stage1.mid /
  // stage2.completion). The existing locke.touche.vex_locked_out
  // (below) carries the at-signing acknowledgment register.
  //
  // This sub-chunk fills the missing canonical anchors:
  //   - pre_exclusivity_warning (Insider-band warning before signing)
  //   - long_silence_acknowledged (60-day-mark commentary)
  //   - breach_canonical ("You broke it. Vex isn't surprised. Neither
  //     am I.")
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "locke.touche.pre_exclusivity_warning",
    // Per §2.3: at Insider band Locke discloses operational
    // information that the Authority would not authorize her to
    // share. The pre-exclusivity warning lands in this register —
    // canonical "I am telling you what the Authority will not."
    text:
      "Insider rates apply, but I would file a warning before you sign " +
      "the exclusivity. Vex Solène goes silent when locked out. Her " +
      "silence is professional. Her silence is also long. The Authority " +
      "charges you the same either way; I am telling you what the " +
      "Authority will not.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Insider",
    unlockFlags: ["locke_exclusivity_offered"],
    excludeFlags: ["locke_exclusive_stage_1_started"],
    cooldownKey: "locke.touche.pre_exclusivity_warning",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.touche.long_silence_acknowledged",
    // 60-day mark canonical commentary — Vex's silence has tilted
    // from "professional" to "discipline" per §2.3 canonical
    // recognition of her one-counterparty-respect.
    text:
      "Sixty days into exclusivity. Coda has filed three additional " +
      "declined offers. Vex has not authored a single message. The " +
      "Authority files this as 'compliance'. I file it as 'discipline'. " +
      "Hers, not yours.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_exclusive_60_day_mark_reached"],
    cooldownKey: "locke.touche.long_silence",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.touche.zero_history_reflective",
    // Canonical disclosure beat: Partner-band reflective register
    // mentioning the historical Zero / Locke "Touché" exchange per
    // §2.3. Mirrors the ask_locke_about_vex ask-topic so the canonical
    // public flag can fire via either dialogue path. Locke's canonical
    // self-instrumentalization tell #3 lands here ("I am telling you
    // I'm telling you").
    text:
      "There was a name on the file before yours, my dear. Agent Zero. " +
      "We had a recorded exchange exactly once. We agreed to trade " +
      "secrets later. The later has not arrived. I am telling you about " +
      "her now because I am about to ask you to deliver the trade.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Partner",
    cooldownKey: "locke.touche.zero_history_reflective",
    maxPlays: 1,
    setsPublicFlags: ["locke_disclosed_zero_agent_history"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "locke.touche.breach_canonical",
    // The canonical "You broke it. Vex isn't surprised. Neither am
    // I." beat per writers'-guide spec. Names the canonical three-
    // file structure: Authority (breach) / Locke (professional) /
    // Vex (predicted) — three files for one event.
    text:
      "You broke the exclusivity. Vex isn't surprised. Neither am I. The " +
      "Authority files 'breach' next to your name. I file 'professional'. " +
      "Vex files 'predicted'. Three files; one event; the structure of " +
      "the relationship has just doubled.",
    surfaces: ["npc_line"],
    unlockFlags: ["locke_exclusivity_breached"],
    cooldownKey: "locke.touche.breach_canonical",
    maxPlays: 1,
    setsPublicFlags: ["locke_filed_player_breach_of_exclusivity"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // TOUCHÉ — Vex locked out by Locke exclusivity (cross-character react)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "locke.touche.vex_locked_out",
    text:
      "Vex Solène registers the lock-out. Touché. She doesn't argue; she " +
      "just stops calling. That's how she signs her side of a contract — " +
      "by going quiet. I respect that more than the alternative.",
    surfaces: ["npc_line"],
    reactsToPublicFlag: "vex_locked_out_by_locke_exclusivity",
    cooldownKey: "locke.touche.vex_lockout_acknowledged",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // FACTION-BETRAYAL (cross-NPC reactive — Locke registers your shifts)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "locke.faction_align.new_babylon_lost",
    text:
      "Your standing with New Babylon just turned negative. I file these. " +
      "I don't act on every file. But I file them, and I make sure you " +
      "know I'm filing. That's not a threat. That's the Authority's " +
      "courtesy.",
    surfaces: ["npc_line"],
    reactsToPublicFlag: "faction_align_new_babylon_negative",
    cooldownKey: "locke.faction.new_babylon_loss",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // TRADE-EMPIRE-SURFACE catch-alls (silent-fail compliance)
  // ═════════════════════════════════════════════════════════════════════

  // ═════════════════════════════════════════════════════════════════════
  // CONTRACT-NEGOTIATION MULTI-TURN CHAIN (Phase 6e.2a, 4 lines)
  //
  // Per writers'-guide spec: signing-intro → hidden-clause-disclosure
  // → counter-offer → signing-completion. The canonical Locke
  // contract canon — every contract canonically has fine-print the
  // player can canonically audit per §1.4 + §2.5 Mercantile-register
  // canon.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "locke.chain.contract_negotiation.signing_intro",
    text:
      "I have prepared a contract. The visible clauses are clean. The hidden clauses are also clean — they are simply hidden. I will not pretend they are not there. The first canonical-courtesy I extend any client is the canonical-acknowledgment that fine-print exists.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Client",
    cooldownKey: "locke.chain.contract_negotiation.intro",
    maxPlays: 2,
    nextLineId: "locke.chain.contract_negotiation.hidden_clause_disclosure",
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.chain.contract_negotiation.hidden_clause_disclosure",
    text:
      "The hidden clause is on page seven, paragraph three. It states that the canonical-Authority retains the right to canonical-audit the canonical-counterparty's records canonically-without notice for canonical-three years following the canonical-signing. The clause is canonical-standard. I am canonical-disclosing it because the canonical-disclosure is canonical-mine to extend; the canonical-reading is canonical-yours.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Client",
    cooldownKey: "locke.chain.contract_negotiation.disclosure",
    maxPlays: 2,
    nextLineId: "locke.chain.contract_negotiation.counter_offer",
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.chain.contract_negotiation.counter_offer",
    text:
      "You have canonical-three options. Option one: sign as canonical-presented. Option two: counter-offer with canonical-amendments that I will canonical-evaluate at the canonical-rate of canonical-five-percent-of-contract-value per amendment. Option three: walk. The canonical-Authority canonical-files the canonical-walk under canonical-'declined' and canonical-not under canonical-'rejected'. The canonical-distinction matters in the canonical-record.",
    surfaces: ["npc_line"],
    requiresTrustBand: "Client",
    cooldownKey: "locke.chain.contract_negotiation.counter_offer",
    maxPlays: 2,
    nextLineId: "locke.chain.contract_negotiation.signing_completion",
  },
  {
    npcKey: NPC_KEY,
    lineId: "locke.chain.contract_negotiation.signing_completion",
    text:
      "Signed. Filed. The canonical-Authority canonical-counter-signs by canonical-end-of-business. You will canonical-receive the canonical-executed copy in canonical-three working days. If the canonical-hidden-clause canonical-fires within the canonical-three-year window, I will canonical-personally inform you canonical-before the canonical-audit canonical-arrives. That is canonical-not in the canonical-contract. It is canonical-mine.",
    surfaces: ["npc_line", "trade_empire"],
    requiresTrustBand: "Client",
    cooldownKey: "locke.chain.contract_negotiation.completion",
    maxPlays: 2,
    setsPublicFlags: ["locke_completed_canonical_contract_negotiation_chain"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "locke.trade_empire.catchall",
    text: "The contract is the contract. The price is the price. The audit is on request.",
    surfaces: ["trade_empire"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "locke.cinematic.catchall",
    text: "I'll see you when there's something to file.",
    surfaces: ["cinematic"],
  },
];

/* ═══════════════════════════════════════════════════════
   TRADE MISSION CATALOG — Coda Agency vertical slice.

   Per CANON Rev 7 §2 (The Coda) and the
   INCOMPLETE_DESIGNS_AUDIT_2026-05-08 §6 item 1 priority: the Coda
   Agency mission system is the lateral overlay on Trade Empire that
   delivers the Vex Solène / Engineer Zero reveal cadence. This
   catalog ships the first slice — a small typed list of mission
   definitions that the server router instantiates into per-user
   `tradeMissions` rows.

   Voice rules (CANON Rev 7 §1.4):
   - Vex never voices the name "Engineer Zero." Her flavor leans dry,
     transactional, almost surgical. "The Maestro" is private to the
     Coda; flavor-text from her uses "the Eyes" or no name at all.
   - The Engineer is silent in the slice — Engineer Zero missions are
     framed as the Coda's "Second Chair" advisory channel only.
   - Coda Central missions are the procedural "Chorus" track —
     single-shot, low-trust, no narrator voice attached.

   Reward shape — see TradeMissionDefinition.reward.
   - credits / dream / voidCrystals are the standard economy outputs;
     the server applies them via the canonical economy tables
     (characterSheets.credits, dreamBalance.dreamTokens).
   - standing is a per-agency integer delta written to
     trade_agency_standing.
   - narrativeFlags is an array of flag keys; the server sets each
     via setNarrativeFlag(...) on userProgress.gameData.narrativeFlags.
   ═══════════════════════════════════════════════════════ */

/**
 * Canonical Coda agency identifiers. The TS literal-union mirrors the
 * `agencyId` varchar(64) on `tradeMissions` — keep them in sync if
 * new Coda nodes (Lieutenant cell, inner-circle) join the slice.
 */
export type TradeMissionAgencyId =
  | "vex_solene"
  | "engineer_zero"
  | "coda_central";

export interface TradeMissionReward {
  /** Trade Empire credits — written to `characterSheets.credits`. */
  credits?: number;
  /** Dream tokens — written to `dreamBalance.dreamTokens`. */
  dream?: number;
  /** Premium currency — written to `dreamBalance.gems` is out of scope; treated as a pure number for now. */
  voidCrystals?: number;
  /** Per-agency integer standing delta (positive or negative). */
  standing?: Partial<Record<TradeMissionAgencyId, number>>;
  /** Narrative flag keys to set on completion. */
  narrativeFlags?: string[];
}

export interface TradeMissionDefinition {
  id: string;
  title: string;
  flavor: string;
  agencyId?: TradeMissionAgencyId;
  durationHours: number;
  reward: TradeMissionReward;
  /** Mission tier; cheap missions for early players, harder ones gated. */
  tier: 1 | 2 | 3;
}

/**
 * The slice catalog. Twelve missions total — five Coda Central
 * (Chorus), four Vex Solène (Maestro), two Engineer Zero (Second
 * Chair), and one untagged Trade Empire chore for the player who has
 * not yet engaged with the Coda at all.
 *
 * Counts:
 *  - Vex Solène:    4   (CANON §2 mandates ≥2; Reveal 1/Reveal 2 hooks)
 *  - Engineer Zero: 2   (Second Chair advisory framing)
 *  - Coda Central:  5   (procedural Chorus track)
 *  - Untagged:      1   (the bridge from Trade Empire → Coda)
 */
export const TRADE_MISSION_CATALOG: ReadonlyArray<TradeMissionDefinition> = [
  // ── Untagged (bridge) ─────────────────────────────────────────
  {
    id: "tm_freeport_manifest",
    title: "Freeport Manifest Sweep",
    flavor:
      "The Independent Freeports run their books on courtesy. Walk three docks, photograph the manifests nobody's hiding, walk away. Boring. Honest. Pays.",
    durationHours: 1,
    tier: 1,
    reward: { credits: 250, dream: 5 },
  },

  // ── Coda Central (Chorus) ─────────────────────────────────────
  {
    id: "tm_coda_dead_drop_pickup",
    title: "Dead-Drop Pickup",
    flavor:
      "An anonymous courier left a sealed message in locker 23-C of the Stardock Anchor concourse. Retrieve it. Do not open it. The Chorus does not read its own mail.",
    agencyId: "coda_central",
    durationHours: 2,
    tier: 1,
    reward: {
      credits: 400,
      standing: { coda_central: 5 },
      narrativeFlags: ["coda_first_contact"],
    },
  },
  {
    id: "tm_coda_signal_relay",
    title: "Signal-Relay Audit",
    flavor:
      "A Coda relay on the Antiquarian's outer shelf is whispering to an audience it shouldn't have. Confirm the bleed. Do not touch the relay.",
    agencyId: "coda_central",
    durationHours: 3,
    tier: 1,
    reward: {
      credits: 600,
      dream: 10,
      standing: { coda_central: 5 },
    },
  },
  {
    id: "tm_coda_cover_check",
    title: "Cover-Identity Bleed Check",
    flavor:
      "An operative in a New Babylon ledger house thinks her cover is intact. The Chorus disagrees. Watch her for one shift. Do not approach.",
    agencyId: "coda_central",
    durationHours: 4,
    tier: 2,
    reward: {
      credits: 800,
      dream: 15,
      standing: { coda_central: 8 },
      narrativeFlags: ["coda_chorus_trusted"],
    },
  },
  {
    id: "tm_coda_payroll_scrub",
    title: "Payroll Scrub",
    flavor:
      "The Chorus pays in untraceable scrip. One ledger has stopped being untraceable. Find the leak. Plug it with a different leak.",
    agencyId: "coda_central",
    durationHours: 4,
    tier: 2,
    reward: {
      credits: 1000,
      voidCrystals: 1,
      standing: { coda_central: 10 },
    },
  },
  {
    id: "tm_coda_quiet_invitation",
    title: "Quiet Invitation",
    flavor:
      "A small house at the edge of the Hierarchy has been listening too well. The Chorus would like them to listen for us instead. Bring them tea. Leave them a card.",
    agencyId: "coda_central",
    durationHours: 6,
    tier: 3,
    reward: {
      credits: 1500,
      dream: 25,
      standing: { coda_central: 15 },
      narrativeFlags: ["coda_recruitment_brokered"],
    },
  },

  // ── Vex Solène (Maestro) ──────────────────────────────────────
  {
    id: "tm_vex_listening_post",
    title: "The Eyes Want a Listener",
    flavor:
      "A voice you have not heard before, low, careful: \"I have a small piece of work. Sit at table fourteen of the Nightline lounge. Listen for one hour. Do not look up. Tell me what the man with the silver ring orders to drink.\"",
    agencyId: "vex_solene",
    durationHours: 2,
    tier: 1,
    reward: {
      credits: 500,
      dream: 10,
      standing: { vex_solene: 8 },
      narrativeFlags: ["vex_first_contact"],
    },
  },
  {
    id: "tm_vex_courier_route",
    title: "A Courier's Route",
    flavor:
      "\"Walk a parcel from the Quietwork commissary to a dead-drop in the Freeports. Do not ask what is inside. If you do ask, you are not the right person for this work, and we will both be disappointed.\"",
    agencyId: "vex_solene",
    durationHours: 3,
    tier: 1,
    reward: {
      credits: 700,
      dream: 12,
      standing: { vex_solene: 10 },
    },
  },
  {
    id: "tm_vex_table_negotiation",
    title: "A Seat at a Small Table",
    flavor:
      "\"Two houses are about to start a war neither of them can afford. I would like you to represent my interests at the table that prevents it. You will not speak first. You will not speak last. You will know which seat is mine.\"",
    agencyId: "vex_solene",
    durationHours: 6,
    tier: 2,
    reward: {
      credits: 1200,
      dream: 30,
      standing: { vex_solene: 18 },
      narrativeFlags: ["vex_diplomacy_brokered", "coda_lieutenant_track"],
    },
  },
  {
    id: "tm_vex_resurrection_thread",
    title: "An Old Theory, Rebuilt",
    flavor:
      "\"There is a theory in a man's last working notes. He died before he could finish it. I am rebuilding it. Bring me the page he was holding when the swarm took him. The Antiquarian has it on a shelf he does not know is mine.\"",
    agencyId: "vex_solene",
    durationHours: 8,
    tier: 3,
    reward: {
      credits: 2000,
      dream: 50,
      voidCrystals: 2,
      standing: { vex_solene: 25, engineer_zero: 5 },
      // The "resurrection theory" flag is the Vex/Engineer-Zero hook
      // that future Act 5 content reads as the Oracle Resurrection
      // Protocols seed (CANON Rev 7 §3.6, §6.3 of CANON_REV_7_…).
      narrativeFlags: ["vex_resurrection_theory_seed"],
    },
  },

  // ── Engineer Zero (Second Chair) ──────────────────────────────
  {
    id: "tm_engineer_quiet_audit",
    title: "Second Chair: Quiet Audit",
    flavor:
      "A text-only briefing in the Prince's voice: \"Reconsider the obvious target. Audit the broker who introduced you to him instead. The introduction is the contract; the kill is the receipt.\"",
    agencyId: "engineer_zero",
    durationHours: 5,
    tier: 2,
    reward: {
      credits: 1100,
      dream: 25,
      standing: { engineer_zero: 12, vex_solene: 4 },
      narrativeFlags: ["second_chair_consulted"],
    },
  },
  {
    id: "tm_engineer_ethical_pause",
    title: "Second Chair: An Ethical Pause",
    flavor:
      "The advisor's text is brief: \"The Chorus would have you act tonight. I would have you wait one cycle and watch what they do without you. We will both be wrong, in different ways. Choose mine.\"",
    agencyId: "engineer_zero",
    durationHours: 6,
    tier: 3,
    reward: {
      credits: 1400,
      dream: 35,
      voidCrystals: 1,
      standing: { engineer_zero: 18, vex_solene: 6 },
      narrativeFlags: ["second_chair_pacifist_path"],
    },
  },

  // ── Ocularum Breadcrumb Trail (untagged — Locke-dispatched, Authority-cover) ──
  // Per apps/shared/ocularumCanon.ts + the_watcher arc (PR-2): seven
  // Trade Empire missions whose flavor text is canonically Ocularum
  // tradecraft hiding inside Authority-sanctioned commerce-intelligence
  // work. Each sets an `ocularum_breadcrumb_<n>_collected` flag the
  // Watcher arc's deduction graph reads. Authored to be playable by
  // any player engaging Trade Empire missions; the Ocularum framing
  // becomes legible only after the_watcher.e2 closes (which surfaces
  // the L. signature pattern). Untagged (no agencyId) — Locke
  // dispatches them through her institutional cover, not through any
  // agency channel the standing-system tracks.
  {
    id: "tm_ocularum_first_eye_memorial",
    title: "Dead-Drop at the First Eye's Memorial",
    flavor:
      "L.'s briefing arrives in the standard format: \"There is a small wax-sealed package on the third bench at the memorial. Pick it up. Do not break the seal. Walk to the address on the back. Hand it over. The recipient will not say thank you. That is correct.\"",
    durationHours: 2,
    tier: 1,
    reward: {
      credits: 500,
      dream: 8,
      narrativeFlags: ["ocularum_breadcrumb_1_collected"],
    },
  },
  {
    id: "tm_ocularum_cipher_page",
    title: "Cipher Page from the Feudal Archive",
    flavor:
      "L.: \"The Antiquarian's Eastern Wing holds a record nobody has logged out in ninety years. Log it out. Do not read past the third page. Return it to a different shelf in the Western Wing. The cataloguing system will correct itself overnight.\"",
    durationHours: 3,
    tier: 1,
    reward: {
      credits: 600,
      dream: 10,
      narrativeFlags: ["ocularum_breadcrumb_2_collected"],
    },
  },
  {
    id: "tm_ocularum_cell_number_whisper",
    title: "A Cell Number Whispered at the Freeport",
    flavor:
      "L.'s note is shorter than usual: \"At the Freeport's south-bay tea house, between the seventh and eighth bell, a vendor will say a number aloud. Write the number down. Hand it to the proprietor of the bookshop two doors south. He will pretend not to read it. He will read it.\"",
    durationHours: 2,
    tier: 1,
    reward: {
      credits: 550,
      dream: 8,
      narrativeFlags: ["ocularum_breadcrumb_3_collected"],
    },
  },
  {
    id: "tm_ocularum_listeners_mark",
    title: "The Listener's Mark",
    flavor:
      "L.: \"A Trade Empire courier has been carrying a small piece of work for us for seven years without knowing it. He retires next month. Sit at table fourteen of the Nightline lounge — yes, that table; you have been there before — and place a tea service exactly as he last left it. He will recognize the placement. He will smile. The work transfers.\"",
    durationHours: 4,
    tier: 2,
    reward: {
      credits: 900,
      dream: 18,
      narrativeFlags: ["ocularum_breadcrumb_4_collected"],
    },
  },
  {
    id: "tm_ocularum_glyph_in_manifest",
    title: "The Glyph in the Manifest",
    flavor:
      "L.: \"A shipping manifest crossing the Sundown-to-Phyral lane this week carries a glyph in its wax seal that the Authority's customs scanner does not flag. Confirm the glyph is intact at the destination. The glyph is correct because the seal is whole; it is not for you to read. Confirm and report.\"",
    durationHours: 5,
    tier: 2,
    reward: {
      credits: 1000,
      dream: 20,
      narrativeFlags: ["ocularum_breadcrumb_5_collected"],
    },
  },
  {
    id: "tm_ocularum_seat_at_a_small_table",
    title: "A Seat for the Seven-Hundredth",
    flavor:
      "L.: \"A young person you do not know is being introduced this week into a small business that will, in time, mean more than its books suggest. Be present at the introduction. Do not speak. Carry the document I am attaching to you for the duration of your visit. Return it to me sealed. The young person will remember the witness.\"",
    durationHours: 4,
    tier: 2,
    reward: {
      credits: 950,
      dream: 18,
      narrativeFlags: ["ocularum_breadcrumb_6_collected"],
    },
  },
  {
    id: "tm_ocularum_what_the_antiquarian_forgot_to_burn",
    title: "What the Antiquarian Forgot to Burn",
    flavor:
      "L.'s final breadcrumb missive — and the one whose tone changes: \"There is a folio in the Antiquarian's burn-pile that was not burned. He left it there because he wanted it found. Find it. Read it once. Burn it after, properly, in the manner the Antiquarian has not yet learned. The folio will tell you why I am writing to you in this register. The next letter you receive from me will be signed differently.\"",
    durationHours: 6,
    tier: 3,
    reward: {
      credits: 1500,
      dream: 35,
      voidCrystals: 1,
      narrativeFlags: ["ocularum_breadcrumb_7_collected", "ocularum_full_trail_complete"],
    },
  },

  // ── Companion-anchored Coda missions ──────────────────────────
  // These mirror the daily companion catalog's anchor/sector/flag
  // triples (apps/shared/tradeEmpire/companionQuestCatalog.ts) so a
  // player who runs Coda missions instead of daily quests still
  // collapses the same "potentials" into the Antiquarian's witness
  // ledger. The flag names are intentionally identical to the daily
  // counterparts — both paths feed the same Archive page entry.
  {
    id: "tm_vex_maestros_errand",
    title: "Maestro's Errand",
    flavor:
      "A single courier line out of the Trade Nexus, no destination on the manifest. Vex calls it an errand. She will not name the Eyes.",
    agencyId: "vex_solene",
    durationHours: 2,
    tier: 1,
    reward: {
      credits: 500,
      dream: 8,
      standing: { vex_solene: 4, coda_central: 2 },
      narrativeFlags: ["potential.vex_solene.trade_nexus.maestros_errand"],
    },
  },
  {
    id: "tm_locke_fine_print",
    title: "Fine Print Audit",
    flavor:
      "Adjudicator Locke needs every signature on a New Babylon contract checked against its fine print. The audit is free; the print is not.",
    durationHours: 2,
    tier: 1,
    reward: {
      credits: 600,
      dream: 6,
      standing: { coda_central: 2 },
      narrativeFlags: ["potential.adjudicator_locke.new_babylon_core.fine_print"],
    },
  },
  {
    id: "tm_nilmorg_severance_audit",
    title: "Severance Audit",
    flavor:
      "One DMC severance settlement, closed properly. Nilmorg's institutional precision will not entertain gratitude. Do not thank her.",
    durationHours: 3,
    tier: 1,
    reward: {
      credits: 800,
      dream: 8,
      narrativeFlags: ["potential.nilmorg.the_trench.severance_audit"],
    },
  },
  {
    id: "tm_engineer_zero_second_chair",
    title: "Second Chair Consultation",
    flavor:
      "An advisory transmission from the Second Chair seat. The Engineer is silent; the consultation is the broadcast.",
    agencyId: "engineer_zero",
    durationHours: 3,
    tier: 2,
    reward: {
      credits: 700,
      dream: 12,
      standing: { engineer_zero: 4, coda_central: 2 },
      narrativeFlags: ["potential.engineer_zero.insurgency_haven.second_chair"],
    },
  },
  {
    id: "tm_antiquarian_cross_reference",
    title: "Cross-Reference Errand",
    flavor:
      "Daniel Cross asks for a cross-reference on a name the Archive has not seen quoted in twelve years. He does not say which name. He does not have to.",
    durationHours: 2,
    tier: 1,
    reward: {
      credits: 400,
      dream: 8,
      narrativeFlags: ["potential.the_antiquarian.antiquarian_archive.cross_reference"],
    },
  },
  {
    id: "tm_drael_acquisition_inventory",
    title: "Acquisition Inventory",
    flavor:
      "One contraband manifest, walked through Hell Gate and back. Drael'Mon files your name under leverage before you finish stepping through.",
    durationHours: 3,
    tier: 2,
    reward: {
      credits: 1000,
      dream: 8,
      narrativeFlags: ["potential.drael_mon.hell_gate.acquisition_inventory"],
    },
  },
] as const;

/** Map agency id → human-readable label for client UI. */
export const TRADE_AGENCY_LABEL: Readonly<Record<TradeMissionAgencyId, string>> = {
  vex_solene: "Vex Solène",
  engineer_zero: "Second Chair",
  coda_central: "The Chorus",
};

/**
 * Lookup helper. Returns undefined for unknown ids — callers in the
 * router wrap this in TRPCError NOT_FOUND when surfacing to clients.
 */
export function getTradeMissionDef(
  id: string,
): TradeMissionDefinition | undefined {
  return TRADE_MISSION_CATALOG.find((m) => m.id === id);
}

/**
 * Stable rolling-refresh selector — when a player has fewer than the
 * target number of available+active rows, pick deterministic-but-
 * varied next ids to instantiate. Pure (no Date.now) so the server
 * can call it inside a transaction without surprise.
 *
 * Algorithm: take the catalog ids the player does NOT yet have a
 * non-completed row for, sort by tier ascending, return the first
 * `count` ids. This biases new players toward tier-1 missions.
 */
export function pickRefreshMissionIds(
  count: number,
  excludeIds: ReadonlyArray<string>,
): string[] {
  const exclude = new Set(excludeIds);
  return TRADE_MISSION_CATALOG
    .filter((m) => !exclude.has(m.id))
    .slice()
    .sort((a, b) => a.tier - b.tier || a.id.localeCompare(b.id))
    .slice(0, count)
    .map((m) => m.id);
}

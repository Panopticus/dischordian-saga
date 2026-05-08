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

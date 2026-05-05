/* ═══════════════════════════════════════════════════════
   THOUGHT VIRUS SPREAD MECHANIC

   Item 9 of the choice-impact follow-up. The Thought Virus is
   referenced extensively as a Hierarchy-aligned corruption that
   bleeds into archives, conversations, and Mechronis-era
   memories. The audit named the gap: "static, no progression."

   This module ships a sector-keyed infection meter (0-100 per
   sector) plus the containment-action registry. Players make
   decisions per sector; choices either reduce infection or
   accept it as a tradeoff.

   Five sectors, each with four containment actions. Each
   action declares its infection delta and any side effects
   (resource cost, narrative flag set, NPC trust change).
   The server's containment service applies the chosen action
   and writes any resulting flags to npc_public_flags.
   ═══════════════════════════════════════════════════════ */

export type VirusSectorId =
  | "mechronis_archives"
  | "thaloria_substrate"
  | "celebration_records"
  | "deep_dock_chronology"
  | "convergence_seat_proximity";

export interface ContainmentAction {
  id: string;
  label: string;
  /** Description shown in the action card. */
  description: string;
  /** Signed delta applied to the sector's infection level on use. */
  infectionDelta: number;
  /** Optional cost — Dream tokens consumed. */
  dreamCost?: number;
  /** Optional flag side effect set on use. */
  setsFlag?: string;
  /** Optional NPC trust delta the action triggers. */
  trustDelta?: { npcId: string; delta: number };
  /** Cooldown in days. Default 1. */
  cooldownDays?: number;
}

export interface VirusSectorDef {
  id: VirusSectorId;
  name: string;
  description: string;
  /** Initial infection level when the player first encounters
   *  this sector. */
  baseInfection: number;
  /** Daily infection growth rate (added each in-game day until
   *  containment caps at 100). */
  dailyGrowth: number;
  actions: readonly ContainmentAction[];
}

export const VIRUS_SECTORS: readonly VirusSectorDef[] = [
  {
    id: "mechronis_archives",
    name: "Mechronis Archives",
    description:
      "The cycle's longest record. Infection here corrupts retroactively — yesterday's inscriptions read differently today.",
    baseInfection: 35,
    dailyGrowth: 2,
    actions: [
      {
        id: "antiquarian_audit",
        label: "Request the Antiquarian's audit",
        description:
          "He cross-references inscriptions against his private journal. Slow, certain, expensive.",
        infectionDelta: -25,
        dreamCost: 15,
        trustDelta: { npcId: "antiquarian", delta: 3 },
        cooldownDays: 5,
      },
      {
        id: "isolate_corrupted",
        label: "Isolate corrupted records",
        description:
          "Quarantine the most-affected archives. Stops the bleed; reading the isolated records becomes impossible until cleansing.",
        infectionDelta: -10,
        setsFlag: "thought_virus:mechronis_quarantine_active",
      },
      {
        id: "translate_through_dream",
        label: "Translate through the Dreamer",
        description:
          "Dreamer's Children volunteer to read the corruptions. Reduces infection but tilts you toward their faction.",
        infectionDelta: -15,
        trustDelta: { npcId: "elara", delta: -1 },
        setsFlag: "thought_virus:mechronis_dreamer_aided",
      },
      {
        id: "accept_corruption",
        label: "Accept the corruption",
        description:
          "Let the records drift. Some truths surface only in the drift. The Antiquarian disagrees.",
        infectionDelta: 5,
        trustDelta: { npcId: "antiquarian", delta: -5 },
        setsFlag: "thought_virus:mechronis_drift_accepted",
      },
    ],
  },
  {
    id: "thaloria_substrate",
    name: "Thaloria Substrate",
    description:
      "Where the Programmer's encoded messages live. Infection here distorts the encoded music itself, not just its readers.",
    baseInfection: 20,
    dailyGrowth: 1,
    actions: [
      {
        id: "voltari_purge",
        label: "Voltari purge",
        description:
          "The Voltari volunteer to clean the substrate's deepest layers. Effective, but they take a copy of what they cleaned.",
        infectionDelta: -30,
        trustDelta: { npcId: "the_seer", delta: 2 },
        setsFlag: "thought_virus:thaloria_voltari_copy_taken",
        cooldownDays: 7,
      },
      {
        id: "musical_recompile",
        label: "Recompile the encoding",
        description:
          "Re-derive the Programmer's encoding from first principles. Slow, no Voltari involvement.",
        infectionDelta: -15,
        dreamCost: 25,
        cooldownDays: 4,
      },
      {
        id: "shield_fragment",
        label: "Shield the deepest fragment",
        description:
          "Wall off the most sacred encoding. Stops further infection; some readers will lose access to that fragment.",
        infectionDelta: -10,
        setsFlag: "thought_virus:thaloria_fragment_shielded",
      },
      {
        id: "broadcast_through",
        label: "Broadcast through anyway",
        description:
          "Push the music through despite the corruption. The signal reaches more receivers; the receivers carry the corruption to their cycles.",
        infectionDelta: 8,
        setsFlag: "thought_virus:thaloria_corrupted_broadcast",
      },
    ],
  },
  {
    id: "celebration_records",
    name: "Celebration Records",
    description:
      "The four-year reset's residue. Infection here makes the prince's class records unreadable — including the route maps the Engineer left for survivors.",
    baseInfection: 45,
    dailyGrowth: 3,
    actions: [
      {
        id: "engineer_zero_trace",
        label: "Trace through Vex Solène",
        description:
          "Vex remembers fragments. She'll cross-reference. Drains her — she'll be dimmer for a week.",
        infectionDelta: -20,
        trustDelta: { npcId: "vex_solene", delta: -2 },
        setsFlag: "thought_virus:celebration_vex_traced",
        cooldownDays: 7,
      },
      {
        id: "ghost_network_consult",
        label: "Consult the Ghost Network",
        description:
          "Other classmates of the prince. They have copies. Unlocking the copies sets off a Hierarchy beacon.",
        infectionDelta: -25,
        setsFlag: "thought_virus:celebration_hierarchy_alerted",
        trustDelta: { npcId: "the_human", delta: 1 },
        cooldownDays: 14,
      },
      {
        id: "preserve_what_remains",
        label: "Preserve what remains",
        description:
          "Stop trying to recover; preserve the legible fragments. Defensive only.",
        infectionDelta: -5,
      },
      {
        id: "let_records_die",
        label: "Let the records die",
        description:
          "Some cycles' records aren't ours to keep. The corruption finishes the work.",
        infectionDelta: 12,
        trustDelta: { npcId: "vex_solene", delta: -4 },
        setsFlag: "thought_virus:celebration_records_lost",
      },
    ],
  },
  {
    id: "deep_dock_chronology",
    name: "Deep Dock Chronology",
    description:
      "Akai Shi's docking logs and the years before Thaloria. Infection here distorts who-was-where-when, including Jericho's last clean record.",
    baseInfection: 25,
    dailyGrowth: 2,
    actions: [
      {
        id: "jericho_witness",
        label: "Ask Jericho to witness",
        description:
          "He was there. His memory is canonical for the dock years. He doesn't enjoy being asked.",
        infectionDelta: -30,
        trustDelta: { npcId: "jericho_jones", delta: -3 },
        cooldownDays: 10,
      },
      {
        id: "iron_lions_corroborate",
        label: "Iron Lions corroborate",
        description:
          "Cades-era Lions still living can confirm dates. Cheap, slow, partial.",
        infectionDelta: -10,
        cooldownDays: 3,
      },
      {
        id: "audit_through_crew_logs",
        label: "Audit through crew logs",
        description:
          "Ark crew kept their own records. Cross-reference. Reduces infection without an NPC cost.",
        infectionDelta: -15,
        dreamCost: 10,
      },
      {
        id: "let_dates_drift",
        label: "Let the dates drift",
        description:
          "Some chronologies don't matter unless they're interrogated.",
        infectionDelta: 6,
      },
    ],
  },
  {
    id: "convergence_seat_proximity",
    name: "Convergence Seat Proximity",
    description:
      "The Vortex's last reach. Infection here distorts the Seat itself — a corrupted Seat asks the wrong stance question.",
    baseInfection: 10,
    dailyGrowth: 4,
    actions: [
      {
        id: "antiquarian_seal_seat",
        label: "The Antiquarian seals the Seat",
        description:
          "He inscribes a binding around the Seat. Effective; he ages a year doing it.",
        infectionDelta: -50,
        trustDelta: { npcId: "antiquarian", delta: -2 },
        setsFlag: "thought_virus:seat_sealed",
        cooldownDays: 30,
      },
      {
        id: "human_witnessing",
        label: "The Human witnesses the Seat",
        description:
          "He's resistant. He stands at the Seat for a week. The Seat's question stays clean for that week.",
        infectionDelta: -25,
        trustDelta: { npcId: "the_human", delta: 1 },
        cooldownDays: 7,
      },
      {
        id: "elara_narrates_through",
        label: "Elara narrates the corruption",
        description:
          "Naming the corruption out loud reduces its hold. Slowly. Elara is good at this.",
        infectionDelta: -15,
        trustDelta: { npcId: "elara", delta: 2 },
        cooldownDays: 4,
      },
      {
        id: "sit_anyway",
        label: "Sit at the corrupted Seat",
        description:
          "Force the Seat to ask its question even corrupted. The question may be the wrong one. The answer counts anyway.",
        infectionDelta: 10,
        setsFlag: "thought_virus:seat_corrupted_at_close",
      },
    ],
  },
];

export function getSector(id: VirusSectorId): VirusSectorDef | undefined {
  return VIRUS_SECTORS.find((s) => s.id === id);
}

export function getAction(
  sectorId: VirusSectorId,
  actionId: string,
): ContainmentAction | undefined {
  return getSector(sectorId)?.actions.find((a) => a.id === actionId);
}

export function clampInfection(level: number): number {
  return Math.max(0, Math.min(100, level));
}

export type InfectionBand = "clean" | "subclinical" | "active" | "critical" | "saturated";

export function bandFor(level: number): InfectionBand {
  if (level >= 90) return "saturated";
  if (level >= 60) return "critical";
  if (level >= 30) return "active";
  if (level >= 10) return "subclinical";
  return "clean";
}

/* ═══════════════════════════════════════════════════════
   CHRISTMAS IN JULY — Holiday Crew Danger Events

   Server-safe data used by both the Christmas router's
   resolveHolidayDanger mutation and the client panel that
   presents them. Trimmed copy of the flavor bible in
   apps/client/src/data/events/christmasInJuly/crewHoliday.ts
   so the server doesn't have to depend on a client file.
   ═══════════════════════════════════════════════════════ */

export type CrewHolidayDangerSeverity = "minor" | "serious" | "critical";

export interface CrewHolidayDangerChoice {
  id: string;
  label: string;
  description: string;
  successChance: number;
  /** Optional Dream cost subtracted on selection. */
  dreamCost?: number;
  /** Festive tokens awarded on success. */
  rewardTokens?: number;
  /** Rewards for crewbond/narrative — flavor only, persisted as a label. */
  rewardFlavor?: string;
}

export interface CrewHolidayDangerEvent {
  id: string;
  type: string;
  severity: CrewHolidayDangerSeverity;
  description: string;
  choices: CrewHolidayDangerChoice[];
}

export const CREW_HOLIDAY_DANGERS: CrewHolidayDangerEvent[] = [
  {
    id: "system_malfunction",
    type: "system_malfunction",
    severity: "minor",
    description: "FESTIVE EMERGENCY: A crew member strung holiday lights through Engineering's main power conduit. The lights are beautiful. The power grid is not.",
    choices: [
      { id: "fix", label: "Let the engineer fix it", description: "Standard repair. The lights come down. Morale takes a hit.", successChance: 0.95, rewardTokens: 5 },
      { id: "reroute", label: "Reroute power around the lights", description: "Keep the lights. Slight power reduction for 24 hours.", successChance: 0.85, dreamCost: 10, rewardTokens: 10, rewardFlavor: "The Ark glows" },
    ],
  },
  {
    id: "quarantine_infection",
    type: "quarantine_infection",
    severity: "serious",
    description: "FESTIVE EMERGENCY: The 'Free Ports eggnog' contains trace amounts of an unknown compound. The crew is showing symptoms: euphoria, generosity, and a compulsion to sing.",
    choices: [
      { id: "quarantine", label: "Quarantine and observe", description: "Standard medical protocol. 12 hours of singing.", successChance: 0.90, rewardTokens: 8 },
      { id: "spread", label: "Let it spread", description: "It's Christmas. The symptoms are… festive.", successChance: 0.70, rewardTokens: 20, rewardFlavor: "Carols ship-wide" },
      { id: "source", label: "Ask the Source", description: "The Source says it's not the Thought Virus. He seems amused.", successChance: 0.80, rewardTokens: 12 },
    ],
  },
  {
    id: "mutiny",
    type: "mutiny",
    severity: "serious",
    description: "FESTIVE CRISIS: A crew member wants to give the Degen access to the Ark's mess hall for a proper Christmas dinner. Security says absolutely not.",
    choices: [
      { id: "allow", label: "Allow the dinner, supervised", description: "Let the Degen cook. Post guards.", successChance: 0.85, dreamCost: 20, rewardTokens: 25 },
      { id: "compromise", label: "Compromise: Degen sends recipes", description: "He can't come aboard, but his recipes can.", successChance: 0.95, rewardTokens: 15 },
      { id: "deny", label: "Deny the request", description: "Security protocols exist for a reason.", successChance: 1.0, rewardTokens: 5 },
    ],
  },
  {
    id: "boarding_action",
    type: "boarding_action",
    severity: "critical",
    description: "FESTIVE EMERGENCY: An unregistered cargo pod has docked at Cargo Bay. Holographic gift paper. Tag: 'FROM: THE DEGEN. DO NOT OPEN UNTIL CHRISTMAS.' It's beeping.",
    choices: [
      { id: "scan", label: "Scan it first", description: "Full security scan. Better safe than sorry.", successChance: 0.90, dreamCost: 15, rewardTokens: 30 },
      { id: "open", label: "Open it. It's Christmas.", description: "The Degen wouldn't… would he?", successChance: 0.75, rewardTokens: 50, rewardFlavor: "Legendary gift" },
      { id: "jettison", label: "Jettison it", description: "Can't be too careful. The crew will be disappointed.", successChance: 1.0, rewardTokens: 0 },
    ],
  },
  {
    id: "genetic_degradation",
    type: "genetic_degradation",
    severity: "minor",
    description: "FESTIVE ANOMALY: A crew member's tear ducts are overproducing. The Medic says they're crying because someone gave them a gift.",
    choices: [
      { id: "let_them_be", label: "It's not a medical issue", description: "They're just happy. Let them be happy.", successChance: 1.0, rewardTokens: 10 },
      { id: "log_it", label: "Log it anyway", description: "Science is science. The data might be useful.", successChance: 1.0, rewardTokens: 5 },
    ],
  },
];

/** Pick a deterministic daily danger event so every player sees the
 *  same one within a UTC day. Returns null if the input id is
 *  provided and not recognized. */
export function pickDailyDanger(daySeed: number): CrewHolidayDangerEvent {
  const idx = Math.abs(daySeed) % CREW_HOLIDAY_DANGERS.length;
  return CREW_HOLIDAY_DANGERS[idx];
}

/** Look up a danger event by id. */
export function findDanger(id: string): CrewHolidayDangerEvent | undefined {
  return CREW_HOLIDAY_DANGERS.find(d => d.id === id);
}

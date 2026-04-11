/* ═══════════════════════════════════════════════════════
   FACTION WAR EVENTS — Time-limited community events
   
   Events rotate on a cycle. Each event pits Machine (Empire)
   against Humanity (Insurgency) factions for territory control.
   The winning faction earns bonus rewards for all members.
   ═══════════════════════════════════════════════════════ */

export interface FactionWarEvent {
  id: string;
  name: string;
  description: string;
  /** Which morality side benefits from this event */
  favoredSide: "machine" | "humanity" | "neutral";
  /** Bonus multiplier for the favored side's contributions */
  favoredMultiplier: number;
  /** Duration in hours */
  durationHours: number;
  /** Bonus rewards for the winning faction */
  winnerRewards: {
    dreamTokens: number;
    xp: number;
    title?: string;
    cardBonus?: string;
  };
  /** Consolation rewards for the losing faction */
  loserRewards: {
    dreamTokens: number;
    xp: number;
  };
  /** Special rules during this event */
  specialRules: string[];
  /** Lore flavor text */
  loreText: string;
  /** Color theme for the event */
  color: string;
}

export const FACTION_WAR_EVENTS: FactionWarEvent[] = [
  {
    id: "panopticon-surge",
    name: "The Panopticon Surge",
    description: "The Architect activates dormant surveillance nodes across all sectors. Machine-aligned operatives receive boosted control point gains.",
    favoredSide: "machine",
    favoredMultiplier: 1.5,
    durationHours: 48,
    winnerRewards: { dreamTokens: 500, xp: 2000, title: "Panopticon Agent", cardBonus: "Rare Order card pack" },
    loserRewards: { dreamTokens: 100, xp: 500 },
    specialRules: [
      "Order-aligned cards deal +1 damage in all battles",
      "Capture actions grant 50% bonus control points",
      "Machine-aligned players earn double war XP",
    ],
    loreText: "The Architect's surveillance network pulses with renewed energy. Every camera, every sensor, every data stream feeds the Panopticon's hunger for control. Those who serve the machine will be rewarded.",
    color: "#ef4444",
  },
  {
    id: "dreamers-uprising",
    name: "The Dreamer's Uprising",
    description: "The Dreamer broadcasts a signal of liberation across the network. Humanity-aligned operatives rally with increased fervor.",
    favoredSide: "humanity",
    favoredMultiplier: 1.5,
    durationHours: 48,
    winnerRewards: { dreamTokens: 500, xp: 2000, title: "Liberation Vanguard", cardBonus: "Rare Chaos card pack" },
    loserRewards: { dreamTokens: 100, xp: 500 },
    specialRules: [
      "Chaos-aligned cards deal +1 damage in all battles",
      "Sabotage actions are 50% more effective",
      "Humanity-aligned players earn double war XP",
    ],
    loreText: "A signal cuts through the static — the Dreamer's voice, raw and unfiltered. 'The machine cannot hold what refuses to be contained.' Across the sectors, the oppressed rise.",
    color: "#3b82f6",
  },
  {
    id: "void-incursion",
    name: "The Void Incursion",
    description: "An unknown force from beyond the Veil destabilizes all sectors. Both factions must fight for survival — the strongest claims the spoils.",
    favoredSide: "neutral",
    favoredMultiplier: 1.0,
    durationHours: 72,
    winnerRewards: { dreamTokens: 750, xp: 3000, title: "Void Survivor", cardBonus: "Legendary card selection" },
    loserRewards: { dreamTokens: 200, xp: 750 },
    specialRules: [
      "All sectors lose 5 control points per hour (decay)",
      "Reinforce actions grant double points",
      "Random sectors become 'Void Rifts' with 3x point value",
    ],
    loreText: "The boundaries between dimensions thin. Something ancient stirs beyond the Veil, and its hunger knows no faction. Only the strongest will survive what comes next.",
    color: "#a855f7",
  },
  {
    id: "neyon-convergence",
    name: "The Ne-Yon Convergence",
    description: "Ne-Yon energy signatures spike across all sectors. Hybrid operatives channel unprecedented power, and the war map becomes a battleground of elemental forces.",
    favoredSide: "neutral",
    favoredMultiplier: 1.25,
    durationHours: 36,
    winnerRewards: { dreamTokens: 400, xp: 1500, title: "Convergence Channeler" },
    loserRewards: { dreamTokens: 100, xp: 400 },
    specialRules: [
      "All card elements deal +1 bonus damage",
      "Ne-Yon species characters get +2 ATK in battles",
      "Contested sectors award triple XP",
    ],
    loreText: "The Ne-Yon energy grid pulses with impossible harmonics. Every hybrid feels it — a calling, a convergence. The very fabric of reality bends to accommodate what's coming.",
    color: "#06b6d4",
  },
  {
    id: "oracle-prophecy",
    name: "The Oracle's Prophecy",
    description: "The Oracle reveals a vision of the future — whichever faction controls the most sectors when the prophecy expires will shape the next season's narrative.",
    favoredSide: "neutral",
    favoredMultiplier: 1.0,
    durationHours: 24,
    winnerRewards: { dreamTokens: 600, xp: 2500, title: "Fate Shaper", cardBonus: "Prophecy card pack" },
    loserRewards: { dreamTokens: 150, xp: 600 },
    specialRules: [
      "All actions cost 50% less energy",
      "Sector captures are instant (no cooldown)",
      "The top contributor earns a unique Oracle title",
    ],
    loreText: "The Oracle speaks: 'I have seen the branching paths. In one, the machine perfects itself. In the other, humanity transcends. You have 24 hours to choose which future you will build.'",
    color: "#f59e0b",
  },
  {
    id: "babylon-siege",
    name: "The Siege of Babylon",
    description: "The central hub sector 'Babylon' becomes a high-value target. Both factions converge on this critical location for a decisive battle.",
    favoredSide: "neutral",
    favoredMultiplier: 1.0,
    durationHours: 12,
    winnerRewards: { dreamTokens: 800, xp: 3500, title: "Babylon Conqueror", cardBonus: "Legendary Babylon card" },
    loserRewards: { dreamTokens: 200, xp: 800 },
    specialRules: [
      "Only Sector 1 (Babylon) matters — all points go there",
      "Contributions to Babylon are worth 5x normal",
      "The faction holding Babylon at event end wins",
    ],
    loreText: "Babylon — the nexus of all trade routes, the heart of the network. Whoever holds Babylon holds the key to everything. The siege begins now.",
    color: "#dc2626",
  },
];

/** Get the current active event based on a rotating schedule */
export function getCurrentEvent(): FactionWarEvent | null {
  // Events rotate on a 7-day cycle with 1 day gap between events
  const CYCLE_DAYS = 7;
  const epoch = new Date("2025-01-01").getTime();
  const now = Date.now();
  const daysSinceEpoch = Math.floor((now - epoch) / (1000 * 60 * 60 * 24));
  const cycleDay = daysSinceEpoch % CYCLE_DAYS;
  
  // Events run for days 0-4, gap on days 5-6
  if (cycleDay >= 5) return null;
  
  const eventIndex = Math.floor(daysSinceEpoch / CYCLE_DAYS) % FACTION_WAR_EVENTS.length;
  return FACTION_WAR_EVENTS[eventIndex];
}

/** Get time remaining for the current event */
export function getEventTimeRemaining(): { hours: number; minutes: number } | null {
  const event = getCurrentEvent();
  if (!event) return null;
  
  const CYCLE_DAYS = 7;
  const epoch = new Date("2025-01-01").getTime();
  const now = Date.now();
  const daysSinceEpoch = Math.floor((now - epoch) / (1000 * 60 * 60 * 24));
  const cycleDay = daysSinceEpoch % CYCLE_DAYS;
  
  // Calculate hours remaining in the event window (days 0-4)
  const hoursIntoEvent = cycleDay * 24 + ((now - epoch) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
  const eventDurationHours = Math.min(event.durationHours, 5 * 24); // max 5 days
  const remaining = eventDurationHours - hoursIntoEvent;
  
  if (remaining <= 0) return null;
  
  return {
    hours: Math.floor(remaining),
    minutes: Math.floor((remaining % 1) * 60),
  };
}

/* ═══════════════════════════════════════════════════════
   CREW ACTIVITY FEED — The Ark Breathes

   The cheapest, most effective way to make the Ark feel
   alive: a ticker of ambient text showing what the crew
   is doing. Like overhearing a living ship.

   Some entries are mundane. Some are ominous. Some
   foreshadow story events. Some reference player actions.
   All of them make the world feel real.

   Design: WoW city NPCs on patrol routes, but text-based.
   Star Trek computer voice announcements meet FTL event log.
   ═══════════════════════════════════════════════════════ */

export type FeedCategory = "ship_systems" | "crew_life" | "medical" | "security" | "trade" | "research" | "social" | "ominous" | "player_echo";
export type FeedSeverity = "info" | "warning" | "alert" | "critical";

export interface FeedEntry {
  id: string;
  timestamp: number;
  roomId: string;
  category: FeedCategory;
  text: string;
  severity: FeedSeverity;
  crewMemberId?: string;
  foreshadows?: string;
  playerActionRef?: string;
  actionable: boolean;
}

/* ─── TEMPLATE SYSTEM ─── */

interface FeedTemplate {
  category: FeedCategory;
  room: string;
  text: string;
  severity: FeedSeverity;
  foreshadows?: string;
  actionable?: boolean;
  needsCrew: number; // how many [CREW_NAME] slots
}

const TEMPLATES: FeedTemplate[] = [
  // ══════ SHIP SYSTEMS ══════
  { category: "ship_systems", room: "engineering", text: "Engineering: Power fluctuation in Deck [DECK]. Automated repair initiated.", severity: "warning", needsCrew: 0 },
  { category: "ship_systems", room: "bridge", text: "Bridge: Long-range sensors detected debris field at bearing [BEARING]. Adjusting course.", severity: "info", needsCrew: 0 },
  { category: "ship_systems", room: "engineering", text: "Engineering: [CREW_NAME] reports hull integrity at [PERCENT]%. Within tolerances.", severity: "info", needsCrew: 1 },
  { category: "ship_systems", room: "bridge", text: "Bridge: Navigation recalculated. ETA to nearest trade beacon updated.", severity: "info", needsCrew: 0 },
  { category: "ship_systems", room: "engineering", text: "Engineering: Recycler output down 3%. [CREW_NAME] investigating.", severity: "warning", needsCrew: 1 },
  { category: "ship_systems", room: "engineering", text: "Engineering: Void crystal capacitor operating at 97.3% efficiency. [CREW_NAME] logged the variance.", severity: "info", needsCrew: 1 },
  { category: "ship_systems", room: "bridge", text: "Bridge: Stellar cartography updated. 3 new waypoints mapped in the debris field.", severity: "info", needsCrew: 0 },
  { category: "ship_systems", room: "engineering", text: "Engineering: Water reclamation cycle complete. Purity at 99.7%. Acceptable.", severity: "info", needsCrew: 0 },
  { category: "ship_systems", room: "bridge", text: "Bridge: Gravitational anomaly detected 0.3 AU starboard. Logging and avoiding.", severity: "warning", needsCrew: 0 },
  { category: "ship_systems", room: "engineering", text: "Engineering: [CREW_NAME] patched a coolant leak on Deck [DECK]. Third one this week.", severity: "warning", needsCrew: 1 },

  // ══════ CREW LIFE ══════
  { category: "crew_life", room: "cargo_bay", text: "Mess Hall: Ration distribution complete. [COUNT] crew served today.", severity: "info", needsCrew: 0 },
  { category: "crew_life", room: "observation_deck", text: "Observation Deck: [CREW_NAME] and [CREW_NAME] spotted stargazing after shift.", severity: "info", needsCrew: 2 },
  { category: "crew_life", room: "cargo_bay", text: "Cargo Bay: [CREW_NAME] organized personal effects. Found a pre-Fall datapad.", severity: "info", needsCrew: 1 },
  { category: "crew_life", room: "captains_quarters", text: "Captain's Quarters: [CREW_NAME] requested personal time. Approved.", severity: "info", needsCrew: 1 },
  { category: "crew_life", room: "cryo_bay", text: "Cryo Bay: [CREW_NAME] visited Pod [POD]. Left something at the base. Didn't say what.", severity: "info", needsCrew: 1 },
  { category: "crew_life", room: "archives", text: "Archives: [CREW_NAME] checked out 'Pre-Fall Agricultural Methods'. Third time this week.", severity: "info", needsCrew: 1 },
  { category: "crew_life", room: "observation_deck", text: "Observation Deck: [CREW_NAME] was seen talking to the viewport. Elara says it's healthy.", severity: "info", needsCrew: 1 },
  { category: "crew_life", room: "cargo_bay", text: "Mess Hall: [CREW_NAME] tried to cook something from the Demagi ration packs. Mixed reviews.", severity: "info", needsCrew: 1 },
  { category: "crew_life", room: "trophy_room", text: "Trophy Room: [CREW_NAME] polished the memorial display. Spent 40 minutes on one name.", severity: "info", needsCrew: 1 },
  { category: "crew_life", room: "cryo_bay", text: "Cryo Bay: [CREW_NAME] asked to see their incubation records. Request approved.", severity: "info", needsCrew: 1 },
  { category: "crew_life", room: "observation_deck", text: "Observation Deck: Shift change. [CREW_NAME] left a blanket for [CREW_NAME]. Small kindnesses.", severity: "info", needsCrew: 2 },
  { category: "crew_life", room: "captains_quarters", text: "Captain's Quarters: [CREW_NAME] carved tally marks into their bunk frame. [COUNT] total.", severity: "info", needsCrew: 1 },

  // ══════ MEDICAL ══════
  { category: "medical", room: "cryo_bay", text: "Cryo Bay: Pod [POD]-B showing irregular neural patterns. Medical team dispatched.", severity: "alert", foreshadows: "pod_47b_mystery", needsCrew: 0, actionable: true },
  { category: "medical", room: "medical_bay", text: "Medical Bay: [CREW_NAME] cleared for active duty after [DAYS]-day recovery.", severity: "info", needsCrew: 1 },
  { category: "medical", room: "medical_bay", text: "Medical Bay: Routine immunization cycle complete. [COUNT] crew processed.", severity: "info", needsCrew: 0 },
  { category: "medical", room: "cryo_bay", text: "Cryo Bay: Incubator [POD] showing healthy vitals. [TIME] until maturation.", severity: "info", needsCrew: 0 },
  { category: "medical", room: "medical_bay", text: "Medical Bay: [CREW_NAME] reported headaches near the Comms Array. Monitoring.", severity: "warning", foreshadows: "thought_virus_proximity", needsCrew: 1 },
  { category: "medical", room: "medical_bay", text: "Medical Bay: Bloodwork results for [CREW_NAME]: all markers nominal. Slight anomaly in neural scan. Probably nothing.", severity: "info", needsCrew: 1 },
  { category: "medical", room: "cryo_bay", text: "Cryo Bay: Genetic integrity check complete. All active incubators within parameters.", severity: "info", needsCrew: 0 },
  { category: "medical", room: "medical_bay", text: "Medical Bay: [CREW_NAME] requested sleep aids. Second request this month.", severity: "warning", needsCrew: 1 },

  // ══════ SECURITY ══════
  { category: "security", room: "armory", text: "Armory: Perimeter sweep complete. All decks secure.", severity: "info", needsCrew: 0 },
  { category: "security", room: "armory", text: "Armory: [CREW_NAME] logged extra target practice. Accuracy improving.", severity: "info", needsCrew: 1 },
  { category: "security", room: "bridge", text: "Bridge: Unidentified signal detected on channel [FREQ]. Likely debris echo.", severity: "warning", needsCrew: 0 },
  { category: "security", room: "armory", text: "Security: Unauthorized access attempt on Deck [DECK] storage. Investigating.", severity: "alert", needsCrew: 0, actionable: true },
  { category: "security", room: "armory", text: "Armory: [CREW_NAME] requested heavier sidearm. Denied pending review.", severity: "info", needsCrew: 1 },
  { category: "security", room: "bridge", text: "Bridge: Proximity alarm — debris. False alarm. Recalibrating sensitivity.", severity: "warning", needsCrew: 0 },
  { category: "security", room: "armory", text: "Armory: Weapons inventory complete. [COUNT] items logged. 2 unaccounted for. Searching.", severity: "warning", needsCrew: 0 },
  { category: "security", room: "armory", text: "Security: [CREW_NAME] volunteered for night watch again. Fourth consecutive shift.", severity: "info", needsCrew: 1 },

  // ══════ TRADE ══════
  { category: "trade", room: "trade_hub", text: "Trade Hub: Incoming hail from independent merchant vessel. [CREW_NAME] handling.", severity: "info", needsCrew: 1 },
  { category: "trade", room: "trade_hub", text: "Trade Hub: Market prices updated. Salvage trending upward.", severity: "info", needsCrew: 0 },
  { category: "trade", room: "cargo_bay", text: "Cargo Bay: Shipment manifest logged. New supplies received and sorted.", severity: "info", needsCrew: 0 },
  { category: "trade", room: "trade_hub", text: "Trade Hub: [CREW_NAME] negotiated a 12% discount on bulk salvage. Locke approves.", severity: "info", needsCrew: 1 },
  { category: "trade", room: "trade_hub", text: "Trade Hub: New Babylon trade beacon detected. Signal authenticated by Locke.", severity: "info", needsCrew: 0 },
  { category: "trade", room: "trade_hub", text: "Trade Hub: [CREW_NAME] compiled quarterly resource report. Dream reserves: stable.", severity: "info", needsCrew: 1 },

  // ══════ RESEARCH ══════
  { category: "research", room: "archives", text: "Archives: [CREW_NAME] spent [HOURS] hours in research. Elara has flagged the behavior.", severity: "info", needsCrew: 1 },
  { category: "research", room: "engineering", text: "Engineering: Research project at [PERCENT]% completion. [CREW_NAME] estimates [DAYS] more days.", severity: "info", needsCrew: 1 },
  { category: "research", room: "archives", text: "Archives: Loredex entry auto-generated from [CREW_NAME]'s field notes.", severity: "info", needsCrew: 1 },
  { category: "research", room: "comms_array", text: "Comms Array: Signal fragment decoded. Cross-referencing with Archives.", severity: "info", needsCrew: 0 },
  { category: "research", room: "archives", text: "Archives: [CREW_NAME] found a contradiction in two Loredex entries. Investigating.", severity: "info", needsCrew: 1 },
  { category: "research", room: "engineering", text: "Engineering: Prototype calibration successful. [CREW_NAME] recommends field testing.", severity: "info", needsCrew: 1 },

  // ══════ SOCIAL ══════
  { category: "social", room: "observation_deck", text: "Observation Deck: Impromptu music session. [CREW_NAME] played something from their homeworld.", severity: "info", needsCrew: 1 },
  { category: "social", room: "cargo_bay", text: "Mess Hall: Argument between [CREW_NAME] and [CREW_NAME] over ration quality. Resolved.", severity: "info", needsCrew: 2 },
  { category: "social", room: "trophy_room", text: "Trophy Room: [CREW_NAME] added a personal item to the display. Nobody objected.", severity: "info", needsCrew: 1 },
  { category: "social", room: "captains_quarters", text: "Captain's Quarters: [CREW_NAME] submitted a formal complaint about [CREW_NAME]. Filed.", severity: "warning", needsCrew: 2 },
  { category: "social", room: "cargo_bay", text: "Mess Hall: [CREW_NAME] organized a card game. Stakes: dessert rations.", severity: "info", needsCrew: 1 },
  { category: "social", room: "observation_deck", text: "Observation Deck: [CREW_NAME] taught [CREW_NAME] a Voltari greeting. Laughter reported.", severity: "info", needsCrew: 2 },
  { category: "social", room: "captains_quarters", text: "Captain's Quarters: [CREW_NAME] asked about family leave protocols. There are none. Yet.", severity: "info", needsCrew: 1 },
  { category: "social", room: "cargo_bay", text: "Mess Hall: Birthday celebration for [CREW_NAME]. Technically their incubation anniversary.", severity: "info", needsCrew: 1 },

  // ══════ OMINOUS (foreshadow story events) ══════
  { category: "ominous", room: "comms_array", text: "Comms Array: Static burst on all channels. Duration: 0.3 seconds. Origin: unknown.", severity: "alert", foreshadows: "signal_interference", needsCrew: 0 },
  { category: "ominous", room: "cryo_bay", text: "Cryo Bay: Pod 47-B neural patterns match no known species in the Collector's archive. Flagged.", severity: "alert", foreshadows: "pod_47b_mystery", needsCrew: 0, actionable: true },
  { category: "ominous", room: "bridge", text: "Bridge: Sensor ghost at extreme range. Gone before triangulation. Logged.", severity: "warning", foreshadows: "approaching_threat", needsCrew: 0 },
  { category: "ominous", room: "engineering", text: "Engineering: Power draw spike in sealed section of Deck 4. No crew assigned there.", severity: "alert", foreshadows: "deck_4_sealed", needsCrew: 0, actionable: true },
  { category: "ominous", room: "medical_bay", text: "Medical Bay: Three crew members reported identical dreams last night. Unrelated departments.", severity: "alert", foreshadows: "shared_dreams", needsCrew: 0 },
  { category: "ominous", room: "archives", text: "Archives: A file was accessed at 0300. No crew were logged in the Archives at that time.", severity: "alert", foreshadows: "archive_intruder", needsCrew: 0, actionable: true },
  { category: "ominous", room: "comms_array", text: "Comms Array: The Human's substrate housing drew 340% normal power for 11 seconds. No explanation offered.", severity: "alert", foreshadows: "human_activity", needsCrew: 0 },
  { category: "ominous", room: "engineering", text: "Engineering: Temperature in the sealed lab dropped 4 degrees. Sensors show no malfunction.", severity: "warning", foreshadows: "ghost_in_machine", needsCrew: 0 },
  { category: "ominous", room: "cryo_bay", text: "Cryo Bay: An empty pod activated for 7 seconds, then powered down. Diagnostics: normal.", severity: "alert", foreshadows: "cryo_anomaly", needsCrew: 0 },
  { category: "ominous", room: "bridge", text: "Bridge: Navigation system briefly plotted a course to Terminus. Nobody requested it.", severity: "critical", foreshadows: "terminus_pull", needsCrew: 0, actionable: true },
  { category: "ominous", room: "observation_deck", text: "Observation Deck: [CREW_NAME] swears they saw a light outside that wasn't a star. Lasted 2 seconds.", severity: "warning", foreshadows: "external_contact", needsCrew: 1 },
  { category: "ominous", room: "archives", text: "Archives: The Antiquarian's terminal displayed a message: 'NOT YET.' Then cleared itself.", severity: "alert", foreshadows: "antiquarian_warning", needsCrew: 0 },

  // ══════ PLAYER ECHO (reference player actions) ══════
  { category: "player_echo", room: "archives", text: "Archives: Crew member [PLAYER_NAME] spent [HOURS] hours in research. Elara has flagged the behavior.", severity: "info", needsCrew: 0 },
  { category: "player_echo", room: "trade_hub", text: "Trade Hub: [PLAYER_NAME]'s recent trade deal is the talk of the mess hall.", severity: "info", needsCrew: 0 },
  { category: "player_echo", room: "armory", text: "Armory: [PLAYER_NAME]'s combat record displayed in the training bay. Morale effect: positive.", severity: "info", needsCrew: 0 },
  { category: "player_echo", room: "bridge", text: "Bridge: Crew morale up since [PLAYER_NAME]'s last mission success.", severity: "info", needsCrew: 0 },
  { category: "player_echo", room: "medical_bay", text: "Medical Bay: [PLAYER_NAME]'s bloodwork came back... interesting. The Source wants a look.", severity: "warning", foreshadows: "player_anomaly", needsCrew: 0 },
  { category: "player_echo", room: "captains_quarters", text: "Captain's Quarters: [CREW_NAME] asked Elara about [PLAYER_NAME]'s background. Elara declined to answer.", severity: "info", needsCrew: 1 },
  { category: "player_echo", room: "observation_deck", text: "Observation Deck: [CREW_NAME] drew a sketch of [PLAYER_NAME] on the viewport condensation. Surprisingly good.", severity: "info", needsCrew: 1 },
  { category: "player_echo", room: "cargo_bay", text: "Mess Hall: [PLAYER_NAME] is being discussed at dinner. Consensus: enigmatic.", severity: "info", needsCrew: 0 },
];

/* ─── CHAINED EVENTS (multi-part stories in the feed) ─── */

interface ChainedEventDef {
  id: string;
  steps: { text: string; delayHours: number; severity: FeedSeverity; room: string }[];
}

const CHAINED_EVENTS: ChainedEventDef[] = [
  {
    id: "power_spike_investigation",
    steps: [
      { text: "Engineering: Unexplained power spike on Deck [DECK]. [CREW_NAME] investigating.", delayHours: 0, severity: "warning", room: "engineering" },
      { text: "Engineering: [CREW_NAME] traced the spike to a corroded relay. Replacement underway.", delayHours: 4, severity: "info", room: "engineering" },
      { text: "Engineering: Power spike resolved. Cause: crystallized void residue in conduit 7-C. [CREW_NAME] recommends full Deck audit.", delayHours: 8, severity: "info", room: "engineering" },
    ],
  },
  {
    id: "crew_disagreement",
    steps: [
      { text: "Mess Hall: Heated discussion between [CREW_NAME] and [CREW_NAME]. Topic: resource allocation.", delayHours: 0, severity: "info", room: "cargo_bay" },
      { text: "Captain's Quarters: [CREW_NAME] requested mediation with [CREW_NAME]. Dispute ongoing.", delayHours: 6, severity: "warning", room: "captains_quarters" },
      { text: "Observation Deck: [CREW_NAME] and [CREW_NAME] seen talking quietly. Situation appears resolved.", delayHours: 12, severity: "info", room: "observation_deck" },
    ],
  },
  {
    id: "strange_signal",
    steps: [
      { text: "Comms Array: Anomalous signal on subspace band 7. Non-standard encoding.", delayHours: 0, severity: "alert", room: "comms_array" },
      { text: "Archives: [CREW_NAME] cross-referenced the signal pattern. Partial match to pre-Fall Insurgency codes.", delayHours: 3, severity: "alert", room: "archives" },
      { text: "Comms Array: Signal faded. Origin triangulated to the Viral Wastes. Elara has logged the coordinates.", delayHours: 8, severity: "warning", room: "comms_array" },
    ],
  },
  {
    id: "specimen_escape",
    steps: [
      { text: "Cargo Bay: Specimen containment alarm triggered. Lux is not in its enclosure.", delayHours: 0, severity: "alert", room: "cargo_bay" },
      { text: "Observation Deck: [CREW_NAME] reports seeing a cyan glow near the viewport. Probably Lux.", delayHours: 2, severity: "info", room: "observation_deck" },
      { text: "Cryo Bay: Lux found sleeping on Pod 47-B. Returned to containment. It looked... reluctant to leave.", delayHours: 5, severity: "info", room: "cryo_bay" },
    ],
  },
  {
    id: "medical_mystery",
    steps: [
      { text: "Medical Bay: [CREW_NAME] presented with unusual symptoms: mild aphasia, synesthesia.", delayHours: 0, severity: "warning", room: "medical_bay" },
      { text: "Medical Bay: Tests inconclusive. [CREW_NAME] claims to 'hear colors' near the Comms Array. Monitoring.", delayHours: 6, severity: "warning", room: "medical_bay" },
      { text: "Medical Bay: Symptoms resolved spontaneously. [CREW_NAME] has no memory of the episode. Source noted this is 'familiar.'", delayHours: 12, severity: "info", room: "medical_bay" },
    ],
  },
];

/* ─── GENERATION ENGINE ─── */

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function fillTemplate(
  text: string,
  crewNames: string[],
  playerName: string,
  seed: number,
): string {
  let result = text;
  let nameIdx = 0;

  // Replace crew name placeholders
  while (result.includes("[CREW_NAME]") && nameIdx < crewNames.length) {
    result = result.replace("[CREW_NAME]", crewNames[nameIdx]);
    nameIdx++;
  }

  // Replace other placeholders
  result = result.replace("[PLAYER_NAME]", playerName);
  result = result.replace("[DECK]", String(1 + Math.floor(seededRandom(seed * 3) * 6)));
  result = result.replace("[BEARING]", `${Math.floor(seededRandom(seed * 5) * 360)}-mark-${Math.floor(seededRandom(seed * 7) * 90)}`);
  result = result.replace("[PERCENT]", String(85 + Math.floor(seededRandom(seed * 11) * 15)));
  result = result.replace("[COUNT]", String(Math.floor(seededRandom(seed * 13) * 30) + crewNames.length));
  result = result.replace("[POD]", String(Math.floor(seededRandom(seed * 17) * 6) + 1));
  result = result.replace("[FREQ]", `${Math.floor(seededRandom(seed * 19) * 900) + 100}.${Math.floor(seededRandom(seed * 23) * 99)}`);
  result = result.replace("[HOURS]", String(2 + Math.floor(seededRandom(seed * 29) * 6)));
  result = result.replace("[DAYS]", String(1 + Math.floor(seededRandom(seed * 31) * 5)));
  result = result.replace("[TIME]", `${1 + Math.floor(seededRandom(seed * 37) * 23)}h ${Math.floor(seededRandom(seed * 41) * 60)}m`);

  return result;
}

/* ─── CATEGORY WEIGHTS ─── */
// ~40% crew life, ~15% ship systems, ~15% ominous, ~10% security, ~8% social, ~5% trade, ~5% research, ~2% player echo
const CATEGORY_WEIGHTS: Record<FeedCategory, number> = {
  crew_life: 40,
  ship_systems: 15,
  ominous: 15,
  security: 10,
  social: 8,
  trade: 5,
  research: 5,
  medical: 7,
  player_echo: 2,
};

function pickCategory(seed: number): FeedCategory {
  const total = Object.values(CATEGORY_WEIGHTS).reduce((s, v) => s + v, 0);
  let roll = seededRandom(seed) * total;
  for (const [cat, weight] of Object.entries(CATEGORY_WEIGHTS)) {
    if (roll < weight) return cat as FeedCategory;
    roll -= weight;
  }
  return "crew_life";
}

export function generateDailyFeed(
  daySeed: number,
  crewNames: string[],
  crewCount: number,
  playerName: string,
  activeFlags: Set<string>,
  recentPlayerActions: string[],
): FeedEntry[] {
  const entryCount = 8 + Math.floor(seededRandom(daySeed) * 5); // 8-12 entries per day
  const entries: FeedEntry[] = [];
  const usedTemplates = new Set<number>();

  for (let i = 0; i < entryCount; i++) {
    const entrySeed = daySeed * 100 + i;
    const category = pickCategory(entrySeed);

    // Filter templates by category and crew availability
    const eligible = TEMPLATES.filter((t, idx) =>
      t.category === category &&
      !usedTemplates.has(idx) &&
      t.needsCrew <= crewNames.length
    );

    if (eligible.length === 0) continue;

    const templateIdx = TEMPLATES.indexOf(eligible[Math.floor(seededRandom(entrySeed * 7) * eligible.length)]);
    const template = TEMPLATES[templateIdx];
    usedTemplates.add(templateIdx);

    // Pick crew names for this entry (shuffled by seed)
    const shuffled = [...crewNames].sort((a, b) => seededRandom(entrySeed + a.length) - seededRandom(entrySeed + b.length));

    const text = fillTemplate(template.text, shuffled, playerName, entrySeed);

    entries.push({
      id: `feed-${daySeed}-${i}`,
      timestamp: Date.now() + i * 3600000, // stagger by 1 hour
      roomId: template.room,
      category: template.category,
      text,
      severity: template.severity,
      foreshadows: template.foreshadows,
      actionable: template.actionable || false,
    });
  }

  // 20% chance to start a chained event
  if (seededRandom(daySeed * 43) < 0.20 && crewNames.length >= 2) {
    const chain = CHAINED_EVENTS[Math.floor(seededRandom(daySeed * 47) * CHAINED_EVENTS.length)];
    const shuffled = [...crewNames].sort((a, b) => seededRandom(daySeed + a.length + 99) - seededRandom(daySeed + b.length + 99));
    for (const step of chain.steps) {
      const text = fillTemplate(step.text, shuffled, playerName, daySeed + step.delayHours);
      entries.push({
        id: `chain-${chain.id}-${step.delayHours}`,
        timestamp: Date.now() + step.delayHours * 3600000,
        roomId: step.room,
        category: "ship_systems",
        text,
        severity: step.severity,
        actionable: false,
      });
    }
  }

  // Sort by timestamp
  entries.sort((a, b) => a.timestamp - b.timestamp);
  return entries;
}

export function generateUrgentFeed(dangerDescription: string, roomId: string): FeedEntry {
  return {
    id: `urgent-${Date.now()}`,
    timestamp: Date.now(),
    roomId,
    category: "security",
    text: dangerDescription,
    severity: "critical",
    actionable: true,
  };
}

export function getNextFeedEntry(entries: FeedEntry[], currentTime: number): FeedEntry | null {
  return entries.find(e => e.timestamp <= currentTime) || null;
}

/* ─── FEED STATE ─── */

export interface FeedState {
  entries: FeedEntry[];
  unreadCount: number;
  lastGenerated: number;
  chainedEvents: { chainId: string; currentStep: number; startTime: number }[];
}

export const DEFAULT_FEED_STATE: FeedState = {
  entries: [],
  unreadCount: 0,
  lastGenerated: 0,
  chainedEvents: [],
};

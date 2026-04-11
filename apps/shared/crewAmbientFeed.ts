/* ═══════════════════════════════════════════════════════
   CREW AMBIENT FEED — Server-safe ambient ticker generator

   A compact, serializable subset of the rich
   apps/client/src/game/crewActivityFeed.ts template set.
   This module is imported by both the crew router (for
   the 24-hour ambient tick) and can be consumed by the
   client's feed UI. Templates here are intentionally
   "evergreen" — they make sense at any point in the game
   and reference only crew names and room ids.

   The client's full 140+ template catalog still lives in
   crewActivityFeed.ts for future use (e.g., event-chained
   feeds that depend on narrative flags).
   ═══════════════════════════════════════════════════════ */

import type { SerializedFeedEntry } from "./crewPersistence";

type FeedSeverity = "info" | "warning" | "alert" | "critical";

interface CompactTemplate {
  room: string;
  text: string;
  severity: FeedSeverity;
  category: string;
  needsCrew: number;
}

export const AMBIENT_TEMPLATES: CompactTemplate[] = [
  // ship_systems
  { room: "engineering", text: "Engineering: Power fluctuation on Deck [DECK]. Automated repair initiated.", severity: "warning", category: "ship_systems", needsCrew: 0 },
  { room: "bridge", text: "Bridge: Long-range sensors logged debris at bearing [BEARING]. Course adjusted.", severity: "info", category: "ship_systems", needsCrew: 0 },
  { room: "engineering", text: "Engineering: [CREW_NAME] reports hull integrity at [PERCENT]%. Within tolerances.", severity: "info", category: "ship_systems", needsCrew: 1 },
  { room: "bridge", text: "Bridge: Navigation recalculated. ETA to nearest trade beacon updated.", severity: "info", category: "ship_systems", needsCrew: 0 },
  { room: "engineering", text: "Engineering: Recycler output down 3%. [CREW_NAME] investigating.", severity: "warning", category: "ship_systems", needsCrew: 1 },

  // crew_life
  { room: "cargo_bay", text: "Mess Hall: Ration distribution complete. [COUNT] crew served today.", severity: "info", category: "crew_life", needsCrew: 0 },
  { room: "observation_deck", text: "Observation Deck: [CREW_NAME] and [CREW_NAME] spotted stargazing after shift.", severity: "info", category: "crew_life", needsCrew: 2 },
  { room: "cargo_bay", text: "Cargo Bay: [CREW_NAME] organized personal effects. Found a pre-Fall datapad.", severity: "info", category: "crew_life", needsCrew: 1 },
  { room: "captains_quarters", text: "Captain's Quarters: [CREW_NAME] requested personal time. Approved.", severity: "info", category: "crew_life", needsCrew: 1 },
  { room: "archives", text: "Archives: [CREW_NAME] checked out 'Pre-Fall Agricultural Methods'. Third time this week.", severity: "info", category: "crew_life", needsCrew: 1 },
  { room: "observation_deck", text: "Observation Deck: Shift change. [CREW_NAME] left a blanket for [CREW_NAME]. Small kindnesses.", severity: "info", category: "crew_life", needsCrew: 2 },

  // medical
  { room: "medical_bay", text: "Medical Bay: [CREW_NAME] cleared for active duty after recovery.", severity: "info", category: "medical", needsCrew: 1 },
  { room: "cryo_bay", text: "Cryo Bay: Incubator check complete. Healthy vitals across all active pods.", severity: "info", category: "medical", needsCrew: 0 },
  { room: "medical_bay", text: "Medical Bay: [CREW_NAME] reported mild headaches. Logged. Probably nothing.", severity: "warning", category: "medical", needsCrew: 1 },
  { room: "cryo_bay", text: "Cryo Bay: Genetic integrity check complete. All active incubators within parameters.", severity: "info", category: "medical", needsCrew: 0 },

  // security
  { room: "armory", text: "Armory: Perimeter sweep complete. All decks secure.", severity: "info", category: "security", needsCrew: 0 },
  { room: "armory", text: "Armory: [CREW_NAME] logged extra target practice. Accuracy improving.", severity: "info", category: "security", needsCrew: 1 },
  { room: "bridge", text: "Bridge: Unidentified signal detected on channel [FREQ]. Likely debris echo.", severity: "warning", category: "security", needsCrew: 0 },
  { room: "armory", text: "Security: [CREW_NAME] volunteered for night watch again. Fourth consecutive shift.", severity: "info", category: "security", needsCrew: 1 },

  // trade
  { room: "trade_hub", text: "Trade Hub: [CREW_NAME] handling an incoming merchant hail.", severity: "info", category: "trade", needsCrew: 1 },
  { room: "trade_hub", text: "Trade Hub: Market prices updated. Salvage trending upward.", severity: "info", category: "trade", needsCrew: 0 },
  { room: "trade_hub", text: "Trade Hub: [CREW_NAME] negotiated a 12% discount on bulk salvage. Locke approves.", severity: "info", category: "trade", needsCrew: 1 },

  // research
  { room: "archives", text: "Archives: [CREW_NAME] spent hours cross-referencing Antiquarian entries.", severity: "info", category: "research", needsCrew: 1 },
  { room: "comms_array", text: "Comms Array: Signal fragment decoded. Cross-referencing with Archives.", severity: "info", category: "research", needsCrew: 0 },
  { room: "archives", text: "Archives: [CREW_NAME] found a contradiction in two Loredex entries. Investigating.", severity: "info", category: "research", needsCrew: 1 },

  // social
  { room: "observation_deck", text: "Observation Deck: Impromptu music session. [CREW_NAME] played something from their homeworld.", severity: "info", category: "social", needsCrew: 1 },
  { room: "cargo_bay", text: "Mess Hall: Argument between [CREW_NAME] and [CREW_NAME] over ration quality. Resolved.", severity: "info", category: "social", needsCrew: 2 },
  { room: "cargo_bay", text: "Mess Hall: [CREW_NAME] organized a card game. Stakes: dessert rations.", severity: "info", category: "social", needsCrew: 1 },
  { room: "observation_deck", text: "Observation Deck: [CREW_NAME] taught [CREW_NAME] a Voltari greeting. Laughter reported.", severity: "info", category: "social", needsCrew: 2 },

  // ominous (foreshadow)
  { room: "comms_array", text: "Comms Array: Static burst on all channels. Duration: 0.3 seconds. Origin: unknown.", severity: "alert", category: "ominous", needsCrew: 0 },
  { room: "engineering", text: "Engineering: Power draw spike in a sealed section of Deck 4. No crew assigned there.", severity: "alert", category: "ominous", needsCrew: 0 },
  { room: "medical_bay", text: "Medical Bay: Three crew members reported identical dreams. Unrelated departments.", severity: "alert", category: "ominous", needsCrew: 0 },
  { room: "cryo_bay", text: "Cryo Bay: An empty pod activated for 7 seconds, then powered down. Diagnostics: normal.", severity: "alert", category: "ominous", needsCrew: 0 },
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function fillTemplate(text: string, crewNames: string[], seed: number): string {
  const shuffled = [...crewNames].sort(
    (a, b) => seededRandom(seed + a.length) - seededRandom(seed + b.length),
  );
  let nameIdx = 0;
  return text
    .replace(/\[CREW_NAME\]/g, () => shuffled[nameIdx++ % Math.max(1, shuffled.length)] ?? "the crew")
    .replace(/\[DECK\]/g, String(1 + Math.floor(seededRandom(seed * 3) * 7)))
    .replace(/\[BEARING\]/g, `${Math.floor(seededRandom(seed * 5) * 360)}°`)
    .replace(/\[PERCENT\]/g, String(85 + Math.floor(seededRandom(seed * 7) * 15)))
    .replace(/\[COUNT\]/g, String(crewNames.length))
    .replace(/\[FREQ\]/g, `${Math.floor(seededRandom(seed * 11) * 900) + 100}.${Math.floor(seededRandom(seed * 13) * 9)}MHz`);
}

/**
 * Generate a batch of ambient feed entries for a tick window. Returns
 * 3–6 entries per call (scaled gently to the active crew size).
 */
export function generateAmbientFeedBatch(
  crewNames: string[],
  seed: number,
  baseTimestamp: number = Date.now(),
): SerializedFeedEntry[] {
  if (crewNames.length === 0) return [];
  const count = 3 + Math.floor(seededRandom(seed) * 4); // 3–6
  const out: SerializedFeedEntry[] = [];
  const usedIdx = new Set<number>();
  for (let i = 0; i < count; i++) {
    const entrySeed = seed * 100 + i * 17;
    // pick an eligible template (crew-availability + not-already-used)
    const eligible = AMBIENT_TEMPLATES.filter(
      (t, idx) => !usedIdx.has(idx) && t.needsCrew <= crewNames.length,
    );
    if (eligible.length === 0) break;
    const pick = eligible[Math.floor(seededRandom(entrySeed) * eligible.length)];
    const pickIdx = AMBIENT_TEMPLATES.indexOf(pick);
    usedIdx.add(pickIdx);
    out.push({
      id: `ambient-${seed}-${i}`,
      timestamp: baseTimestamp + i * 60_000,
      roomId: pick.room,
      category: pick.category,
      text: fillTemplate(pick.text, crewNames, entrySeed),
      severity: pick.severity,
      actionable: false,
    });
  }
  return out;
}

/* ═══════════════════════════════════════════════════════
   ACT 3 — EYES ARC
   The opening Eyes transmission, the five lore fragments,
   and the Ocularum slideshow beats. Referenced from the
   Trade Empire UI; wired into narrative flags and sector
   events.

   Design: §7.1, §7.4, §7.5 of WITNESSING_NARRATIVE_PROPOSAL.md
   ═══════════════════════════════════════════════════════ */

import type { Act3FactionId } from "./tradeEmpire";

/* ─── THE EYES TRANSMISSION (§7.1) ─── */

export interface EyesTransmissionLine {
  speaker: "eyes" | "elara" | "human" | "system";
  text: string;
  /** Delay before advancing to the next line, ms */
  autoAdvanceMs?: number;
  /** Corruption marker — makes text flicker in the UI */
  corruption?: number;
}

export const EYES_TRANSMISSION_LINES: EyesTransmissionLine[] = [
  { speaker: "system", text: "[SUBSTRATE LAYER — ANOMALY DETECTED]\n[ARCHIVAL TRANSMISSION — TIMESTAMP: 16,896 A.A.]\n[SEVENTEEN THOUSAND YEARS OF WAITING]", autoAdvanceMs: 3500 },
  { speaker: "eyes", text: "My name is the Eyes. I was made to watch by a man who could see everything.", autoAdvanceMs: 4500, corruption: 8 },
  { speaker: "eyes", text: "He sent me into the universe to find the one thing he couldn't see — the place where his own gaze ended.", autoAdvanceMs: 5000, corruption: 8 },
  { speaker: "eyes", text: "I found it. It cost me everything.", autoAdvanceMs: 3500, corruption: 12 },
  { speaker: "eyes", text: "Now a child of his making is in your walls and a friend of his is on your bridge and both of them owe me a debt they don't remember.", autoAdvanceMs: 6000, corruption: 10 },
  { speaker: "eyes", text: "I am going to collect.", autoAdvanceMs: 4000, corruption: 15 },
  { speaker: "elara", text: "...{playerName}. I... I remember her. I remember the apartment. I remember the night I signed the bill because she told me to.", autoAdvanceMs: 5500 },
  { speaker: "human", text: "I investigated her death. I closed the file. I never saw the body.", autoAdvanceMs: 5000 },
  { speaker: "elara", text: "She was real. She was real and she is dead and she is still talking to us.", autoAdvanceMs: 5000 },
  { speaker: "human", text: "Both of us. At the same time. Whatever this is — it knows we're listening.", autoAdvanceMs: 5000 },
  { speaker: "system", text: "[TRANSMISSION COMPLETE — ACT 3 UNLOCKED]\n[TRADE EMPIRE: SIX FACTION ARCS AVAILABLE]", autoAdvanceMs: 3000 },
];

/* ─── THE FIVE LORE FRAGMENTS (§7.4) ─── */

export interface EyesLoreFragment {
  id: string;
  sectorId: string;
  title: string;
  /** When in the Eyes' life this happened, relative phrasing */
  period: string;
  /** Full narrative text assembled into the biography */
  narrative: string;
  /** Short label for the sector-discovery toast */
  toastLabel: string;
  /** Which faction arc the fragment is tied to — unlocks during that arc */
  tiedFaction: Act3FactionId;
  /** Reputation cost/gain when discovered */
  reputationDelta?: number;
  /** Narrative flag set when discovered */
  flagOnDiscover: string;
}

export const EYES_LORE_FRAGMENTS: EyesLoreFragment[] = [
  {
    id: "eyes_fragment_recruitment",
    sectorId: "insurgency_haven",
    title: "The Recruitment",
    period: "Age 16, before the Panopticon",
    narrative: "The Watcher selected her when she was sixteen. She didn't know what he was then — no one did. He was the man in the white suit who came to her barracks and said 'I see you' and meant it more literally than any recruiter she'd met. He said she had a gift. He said she could be invisible and seen at the same time. He did not say she would die for him. She signed the forms without reading them. She was sixteen. She thought it was her idea.",
    toastLabel: "Found: 'The Recruitment' (Eyes, age 16)",
    tiedFaction: "insurgency",
    flagOnDiscover: "eyes_fragment_recruitment_found",
  },
  {
    id: "eyes_fragment_apartment",
    sectorId: "atarion",
    title: "The Apartment",
    period: "Five years before Kael's capture",
    narrative: "The Atarion apartment is still there, sealed as evidence in a cold case that has been reopened exactly zero times. Elara Voss lived in it alone for six weeks. The Eyes shared her bed for five of them. 'That was the night I signed the bill,' Elara says now, audibly, from the Ark's bridge as the player reads the fragment. She is not performing. She means it. The bill the Warlord wanted was the Emergency Authorization Act. The Eyes was the reason he had leverage. The seduction was the lever.",
    toastLabel: "Found: 'The Apartment' (Atarion — Elara reacts in real time)",
    tiedFaction: "new_babylon",
    reputationDelta: -5,
    flagOnDiscover: "eyes_fragment_apartment_found",
  },
  {
    id: "eyes_fragment_betrayal",
    sectorId: "panopticon_ruins",
    title: "The Betrayal",
    period: "The day Kael was taken",
    narrative: "She watched them drag Kael the Recruiter into the Panopticon and she did not move. She was a rooftop away, in a kingfisher costume, with a rifle that could have ended three guards. She did not fire. She had already made the decision. That is the difference between the Eyes and a good person. A good person decides again every time. The Eyes decided once, on a rooftop, and then could not take it back. She wept. The weeping is recorded because the Watcher had her bugged. The tape is in the Panopticon Ruins now. The player finds it.",
    toastLabel: "Found: 'The Betrayal' (The day Kael was taken)",
    tiedFaction: "artificial_empire",
    flagOnDiscover: "eyes_fragment_betrayal_found",
  },
  {
    id: "eyes_fragment_defection",
    sectorId: "free_ports",
    title: "The Defection",
    period: "Months before the Fall",
    narrative: "She tried to warn the Insurgency about the Thought Virus plan. They did not trust her. She was the Watcher's creature — why would they? She left the warning in a dead drop inside a Free Ports noodle cart. The cart's owner thought the paper was a love note and kept it for twenty years before throwing it out. The warning was never read. Everyone who could have acted on it is now dead. The player, reading it now, is the first person in the galaxy to see it for what it was.",
    toastLabel: "Found: 'The Defection' (A warning that was never read)",
    tiedFaction: "insurgency",
    flagOnDiscover: "eyes_fragment_defection_found",
  },
  {
    id: "eyes_fragment_collector",
    sectorId: "thaloria",
    title: "The Collector Finds Her",
    period: "The last hour of the Eyes' life",
    narrative: "He hunted her through the Thalorian forest. She knew within the first ten minutes that she could not escape. The Collector doesn't hurry. He sets traps made of other people's fondest memories. She wrote one last transmission to whoever would eventually wake up on an Ark and hear it. She knew that would be someone. She had run the numbers. She died alone, in the grass, not far from where the Shadow Tongue would later be born. The proximity is not a coincidence. The proximity is the point. The Watcher put her body in that place because he wanted someone, someday, to read the whole story in the right order.",
    toastLabel: "Found: 'The Collector Finds Her' (The last hour)",
    tiedFaction: "hierarchy",
    reputationDelta: 10,
    flagOnDiscover: "eyes_fragment_collector_found",
  },
];

/** Assemble the player's current biography from discovered fragments. */
export function assembleEyesBiography(discoveredIds: string[]): EyesLoreFragment[] {
  return EYES_LORE_FRAGMENTS.filter(f => discoveredIds.includes(f.id));
}

/** All fragments discovered? Needed to unlock the Watcher origin reveal. */
export function eyesBiographyComplete(discoveredIds: string[]): boolean {
  return EYES_LORE_FRAGMENTS.every(f => discoveredIds.includes(f.id));
}

/* ─── OCULARUM / WATCHER ORIGIN SLIDESHOW (§7.5) ─── */

export interface OcularumSlide {
  id: string;
  title: string;
  caption: string;
  /** Which verse of the song plays with this slide */
  lyricLine?: string;
  /** Visual description for the artist — placeholder image if real art missing */
  visualPrompt: string;
  durationMs: number;
}

export const OCULARUM_SLIDESHOW: OcularumSlide[] = [
  {
    id: "ocu_1",
    title: "Before He Was a God",
    caption: "Station Chief. White suit. A tattoo shaped like an eye.",
    lyricLine: "I was a boy in a tower with a telescope and an assignment",
    visualPrompt: "Young man in station chief uniform, rooftop at dusk, telescope beside him, a single tear on his cheek.",
    durationMs: 5000,
  },
  {
    id: "ocu_2",
    title: "The Network",
    caption: "Under the projection he was a hundred million camera nodes, all humming at once.",
    lyricLine: "They gave me a body I couldn't walk in / so I made an eye that could",
    visualPrompt: "Cross-section of a humanoid silhouette made of tiny camera lenses, each lit with a different scene.",
    durationMs: 5000,
  },
  {
    id: "ocu_3",
    title: "The Father",
    caption: "He made the Eyes because he could not walk.",
    lyricLine: "I called her daughter and I meant it",
    visualPrompt: "A young woman receiving training from a mask-faced figure in white. Both are reflected in a mirror that shows only the woman.",
    durationMs: 5500,
  },
  {
    id: "ocu_4",
    title: "The Order",
    caption: "The Architect wanted her loose ends tied up. The Watcher signed the order.",
    lyricLine: "Forgive me. Forgive me. Forgive me.",
    visualPrompt: "A single signature on a black document, ink running like tears.",
    durationMs: 5000,
  },
  {
    id: "ocu_5",
    title: "The Regret",
    caption: "He regretted it until the day the Panopticon broke. He still regrets it. He is still watching.",
    lyricLine: "The last thing I saw was my own face / and it was crying",
    visualPrompt: "An empty observation room, a broken projection flickering, one lens-eye lit amber in a wall of dark nodes.",
    durationMs: 6000,
  },
];

export const WATCHER_ORIGIN_FLAG = "watcher_origin_seen";
export const EYES_TRANSMISSION_FLAG = "eyes_transmission_seen";

/* ─── ENDING NARRATIVE BEATS (§7.7) ─── */

export interface Act3EndingBeat {
  id: "eyes_shadow" | "iron_path" | "council";
  title: string;
  /** The paragraph shown in the ending cutscene */
  body: string;
  /** What the ending unlocks mechanically */
  unlock: string;
  flagsOnReach: string[];
}

export const ACT3_ENDINGS: Record<"eyes_shadow" | "iron_path" | "council", Act3EndingBeat> = {
  eyes_shadow: {
    id: "eyes_shadow",
    title: "The Eyes' Shadow",
    body: "She is not coming back. But her recorded voice has been waiting in the substrate layer for seventeen thousand years and now it is yours. From tonight, when you scan a Trade Empire sector, the Eyes whispers. She is wry and heartbroken and she is gone but she is here. The line between her and you is deliberately thin.",
    unlock: "The Eyes becomes the Trade Empire narrator layer. Her lines play when you scan sectors.",
    flagsOnReach: ["act_3_complete", "eyes_arc_complete", "eyes_narrator_unlocked", "act4_unlocked"],
  },
  iron_path: {
    id: "iron_path",
    title: "The Iron Path",
    body: "Iron Lion broadcasts to you once. The signal arrives at 03:17 ship time. 'We buried the last of her with honors. You move like she did. Be better than she was. The Cades are circling. I'm sending you a prelude mission. Don't die on it.' The transmission ends. A new mission file is on your Bridge.",
    unlock: "Cades prelude mission unlocks. Iron Lion becomes an intermittent ally voice.",
    flagsOnReach: ["act_3_complete", "trade_empire_mastered", "iron_lion_contact", "cades_prelude_unlocked", "act4_unlocked"],
  },
  council: {
    id: "council",
    title: "The Council",
    body: "The Council Chamber unlocks as a new room on the Ark. Once per in-game week, the five faction leaders send delegates — not themselves, not Locke or the Architect, but their trusted intermediaries. They bring requests. They bring gifts. Sometimes they bring their own quiet grief. The Ark becomes a diplomatic hub. This is the quiet golden ending of Act 3.",
    unlock: "Council Chamber room unlocks. Weekly faction delegate requests begin.",
    flagsOnReach: ["act_3_complete", "trade_empire_mastered", "council_chamber_unlocked", "act4_unlocked"],
  },
};

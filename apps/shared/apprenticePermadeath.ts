/* ═══════════════════════════════════════════════════════
   APPRENTICE PERMADEATH — Emotional Weight System

   When an apprentice dies, it should hurt. This module
   generates epitaphs, mourning effects, roster morale,
   and ghost echoes that haunt the ship after loss.

   Death is permanent. Memory is louder.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";

/* ─── EPITAPHS ─── */

const EPITAPHS: Record<ApprenticeArchetype, (cause: string) => string> = {
  zealot: (cause) =>
    `They burned brightest before the end. ${cause} could not dim what they believed — only silence it.`,
  ghost: (cause) =>
    `They vanished, as they always knew they would. ${cause} was just the door they finally walked through.`,
  scholar: (cause) =>
    `Their questions outlived them. Somewhere, a margin note in their handwriting still waits for an answer about ${cause}.`,
  revenant: (cause) =>
    `They died before, and came back. This time, ${cause} made the negotiation final. No one expects a third offer.`,
  artisan: (cause) =>
    `Their last project sits unfinished on the workbench. ${cause} took the hands but not the blueprint. Someone should finish it.`,
  oracle: (cause) =>
    `They saw it coming — ${cause} — and said nothing. Perhaps silence was the kindest prophecy they ever gave.`,
  wanderer: (cause) =>
    `They never stayed anywhere long enough to be mourned. ${cause} caught them mid-stride. At least they were moving.`,
  martyr: (cause) =>
    `They would have chosen this. ${cause} simply chose for them. The only difference is they didn't get to say it was okay.`,
  heretic: (cause) =>
    `They questioned everything, including ${cause}. In the end, the answer was the same as it always is.`,
  jester: (cause) =>
    `The last sound they made was not a joke. ${cause} stole even that from them. The silence is the cruelest punchline.`,
  sentinel: (cause) =>
    `The watch is over. ${cause} breached the line they swore to hold. Someone else stands at the door now. It isn't the same.`,
  prodigal: (cause) =>
    `They came back once, carrying debts no one named. ${cause} collected the last of them. The ledger is closed.`,
};

/**
 * Generate an in-character memorial epitaph for a fallen apprentice.
 */
export function generateEpitaph(archetype: string, causeOfDeath: string): string {
  const gen = EPITAPHS[archetype as ApprenticeArchetype];
  if (!gen) return `They are gone. ${causeOfDeath} took them. We remember.`;
  return gen(causeOfDeath);
}

/* ─── MOURNING EFFECTS ─── */

interface MourningProfile {
  /** Template reaction line. {name} replaced with fallen's archetype display. */
  reactions: string[];
  /** Base morale delta (negative = grief, positive = hardened resolve) */
  baseMoraleDelta: number;
}

const MOURNING_PROFILES: Record<ApprenticeArchetype, MourningProfile> = {
  zealot: {
    reactions: [
      "The cause endures. They would want us to keep fighting.",
      "I will carry their conviction. It weighs nothing compared to grief.",
    ],
    baseMoraleDelta: -5,
  },
  ghost: {
    reactions: [
      "I keep expecting to see them in the corner of the room. I still do, sometimes.",
      "They were never fully here. Now the absence has a name.",
    ],
    baseMoraleDelta: -8,
  },
  scholar: {
    reactions: [
      "I found their notebook. Half the entries are about us. The other half are about dying.",
      "They would want data on how we grieve. I refuse to provide it.",
    ],
    baseMoraleDelta: -6,
  },
  revenant: {
    reactions: [
      "Part of me waits for them to come back again. Part of me knows better.",
      "Death visits some people like an old creditor. This time it collected.",
    ],
    baseMoraleDelta: -4,
  },
  artisan: {
    reactions: [
      "Their tools are still warm. I can't move them. Not yet.",
      "Everything they built outlasts them. That is either beautiful or unbearable.",
    ],
    baseMoraleDelta: -9,
  },
  oracle: {
    reactions: [
      "Did they see this? Did they know? I can't decide which answer is worse.",
      "The future feels quieter without their warnings. That terrifies me.",
    ],
    baseMoraleDelta: -7,
  },
  wanderer: {
    reactions: [
      "I keep thinking they just left again. That they'll walk back in next week with a story.",
      "They never said goodbye to anyone. I thought that was a habit, not a prophecy.",
    ],
    baseMoraleDelta: -6,
  },
  martyr: {
    reactions: [
      "They finally got what they wanted. I hate them for it. I hate myself for hating them.",
      "They died for us. Again. Except this time they can't come back to apologize for it.",
    ],
    baseMoraleDelta: -12,
  },
  heretic: {
    reactions: [
      "They questioned everything except whether they'd survive. Turns out that was the important question.",
      "I agreed with them more than I admitted. Now I'll never get to say so.",
    ],
    baseMoraleDelta: -5,
  },
  jester: {
    reactions: [
      "Nobody's laughing. That's how you know they're really gone.",
      "I keep hearing their voice in the silence. It's not funny anymore. It never was.",
    ],
    baseMoraleDelta: -10,
  },
  sentinel: {
    reactions: [
      "The perimeter feels exposed. Their shift will never be filled, only covered.",
      "They died on watch. I cannot think of a more fitting or cruel end.",
    ],
    baseMoraleDelta: -7,
  },
  prodigal: {
    reactions: [
      "They spent their whole life trying to come home. They almost made it.",
      "The debt is settled. I wish they'd defaulted instead.",
    ],
    baseMoraleDelta: -6,
  },
};

/**
 * Calculate how each surviving apprentice mourns a fallen comrade.
 * Returns a reaction and morale delta per survivor.
 */
export function calculateMourningEffects(
  fallenArchetype: string,
  survivorArchetypes: string[],
): { archetype: string; reaction: string; moraleDelta: number }[] {
  return survivorArchetypes.map((survivorArchetype) => {
    const profile = MOURNING_PROFILES[survivorArchetype as ApprenticeArchetype];
    if (!profile) {
      return {
        archetype: survivorArchetype,
        reaction: "We lost someone. The ship feels emptier.",
        moraleDelta: -5,
      };
    }

    const reaction = profile.reactions[Math.floor(Math.random() * profile.reactions.length)];

    // Mourning is amplified if the fallen and survivor share a primary stat
    // (simulated: same archetype mourns harder)
    const sameType = survivorArchetype === fallenArchetype;
    const moraleDelta = sameType
      ? Math.round(profile.baseMoraleDelta * 1.5)
      : profile.baseMoraleDelta;

    return { archetype: survivorArchetype, reaction, moraleDelta };
  });
}

/* ─── ROSTER MORALE ─── */

/**
 * Calculate overall roster morale on a 0-100 scale.
 * Morale drops dramatically with multiple recent deaths,
 * modeling the psychological weight of repeated loss.
 *
 * @param rosterSize - Current number of living apprentices (0+)
 * @param recentDeaths - Deaths in the last 7 in-game days
 * @returns Morale score 0-100
 */
export function calculateRosterMorale(rosterSize: number, recentDeaths: number): number {
  if (rosterSize <= 0) return 0;

  // Base morale from roster health
  const baseMorale = 100;

  // Each death costs more than the last (quadratic penalty)
  // 1 death = -15, 2 deaths = -35, 3 deaths = -60, 4+ = catastrophic
  const deathPenalty = recentDeaths > 0
    ? 15 * recentDeaths + 5 * (recentDeaths * recentDeaths)
    : 0;

  // Small roster amplifies grief (fewer shoulders to carry it)
  const smallRosterPenalty = rosterSize < 3
    ? (3 - rosterSize) * 10
    : 0;

  const morale = baseMorale - deathPenalty - smallRosterPenalty;

  return Math.max(0, Math.min(100, Math.round(morale)));
}

/* ─── GHOST EFFECTS ─── */

interface GhostEffects {
  /** Lines where NPCs or the narrator mention the fallen by name */
  dialogueMentions: string[];
  /** Objects associated with the fallen that appear in ship locations */
  objectAppearances: string[];
  /** Ambient atmosphere changes — sound, light, temperature */
  ambientEffects: string[];
}

const GHOST_OBJECTS: Record<ApprenticeArchetype, string[]> = {
  zealot: ["a scrawled manifesto pinned to the wall", "a burned candle at their makeshift altar", "their sigil scratched into the doorframe"],
  ghost: ["a shadow in the wrong place", "a half-open door no one touched", "footprints in dust that shouldn't be there"],
  scholar: ["an open book they never finished", "margin notes in unfamiliar ink", "a bookmark on a page about death"],
  revenant: ["the faint smell of grave-soil", "a coin left on the threshold — payment for passage", "scratch marks on the inside of a closed drawer"],
  artisan: ["an unfinished carving on the workbench", "tools arranged in their particular order", "a chair that creaks as if someone sat down"],
  oracle: ["a mirror that fogs without breath", "a note predicting today's weather, written weeks ago", "star charts with tomorrow's sky already drawn"],
  wanderer: ["a packed bag no one remembers placing", "a trail of foreign dust leading to the airlock", "a map with a route circled in a place that doesn't exist"],
  martyr: ["a bandage folded neatly on someone's pillow", "their ration bar left at your door", "a note: 'Don't blame yourself. I chose this.'"],
  heretic: ["graffiti on the bulkhead questioning the captain's orders", "a list of rules with every one crossed out", "their favorite chair facing away from the group"],
  jester: ["a whoopee cushion no one placed", "a joke written on the bathroom mirror in soap", "a deck of cards with one missing — the fool"],
  sentinel: ["the door alarm set to a frequency only they used", "a watch log with entries after their death date", "boot polish left out, cap unscrewed"],
  prodigal: ["a letter addressed to someone no one has heard of", "a key to a lock that isn't on this ship", "a return ticket to a place that burned down"],
};

const GHOST_AMBIENT: Record<ApprenticeArchetype, string[]> = {
  zealot: ["the air smells faintly of incense", "a low humming sound, like a hymn, from an empty room", "candle flames lean toward their old bunk"],
  ghost: ["the lights flicker when passing their corridor", "a chill draft from nowhere", "security cameras show static in their old quarters"],
  scholar: ["pages turn in books no one is reading", "the library terminal logs a search at 3 AM", "chalk dust appears on surfaces near their desk"],
  revenant: ["the temperature drops near their bunk", "a heartbeat sound from the walls at night", "condensation forms on cold surfaces in the shape of a hand"],
  artisan: ["the workshop smells of sawdust and metal", "a tool spins on the bench when no one is near", "a faint tapping sound, like a hammer, at odd hours"],
  oracle: ["dreams aboard the ship grow more vivid", "clocks skip forward by seconds at random", "a whisper predicts small events moments before they happen"],
  wanderer: ["wind sounds in sealed corridors", "the navigation console briefly shows unknown coordinates", "a door opens to a hallway that seems longer than before"],
  martyr: ["wounds heal slightly faster aboard the ship", "a warmth settles over the crew at night", "someone always wakes feeling like they were watched over"],
  heretic: ["the ship's PA system crackles with half-words", "regulations posted on walls seem to rearrange themselves", "the captain's orders echo strangely, as if someone is muttering them back"],
  jester: ["unexpected laughter in empty hallways", "small items rearrange into absurd positions", "the ship's AI occasionally tells a joke no one programmed"],
  sentinel: ["the perimeter alarm triggers with nothing on sensors", "footstep sounds on patrol routes at the old shift time", "the door to their post locks and unlocks on its own"],
  prodigal: ["the airlock cycles without authorization at dawn", "a faint smell of rain and road dust", "navigation logs show a course correction toward an unnamed system"],
};

/**
 * Generate the haunting effects that linger after an apprentice's death.
 * These appear in ship exploration, dialogue, and ambient narrative.
 */
export function getGhostEffects(name: string, archetype: string): GhostEffects {
  const arch = archetype as ApprenticeArchetype;

  const dialogueMentions = [
    `"${name} would have known what to do here."`,
    `"I thought I saw ${name} in the corridor last night. I didn't sleep after that."`,
    `"We don't talk about ${name}. Not because we've forgotten. Because we haven't."`,
    `"${name}'s bunk is still made. Nobody will touch it."`,
    `"Sometimes I start a sentence meant for ${name} before I remember."`,
  ];

  const objects = GHOST_OBJECTS[arch] ?? [
    "a personal effect no one claims",
    "a mark on the wall at their height",
    "dust in the shape of something familiar",
  ];

  const ambient = GHOST_AMBIENT[arch] ?? [
    "the ship feels quieter than it should",
    "a faint presence lingers in empty rooms",
    "the crew speaks in lower voices near their old quarters",
  ];

  return {
    dialogueMentions,
    objectAppearances: objects,
    ambientEffects: ambient,
  };
}

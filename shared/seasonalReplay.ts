/**
 * THE MEME'S RERUNS — Seasonal Event Replay / Catch-Up System
 * ══════════════════════════════════════════════════════════════
 * When a player misses a seasonal event, The Meme — a sardonic,
 * 4th-wall-breaking broadcast host from across time — offers to
 * replay the highlights so the player can experience the story
 * beats and community decisions they missed.
 *
 * REWARDS POLICY:
 * - XP and lore entries ONLY.
 * - NO exclusive cosmetics, titles, cards, or achievements.
 * - Players who participated live keep their exclusives.
 *   The Meme makes this very clear (and mocks you for it).
 */

import { SEASONAL_EVENTS, type SeasonalEventDef } from "./seasonalEvents";

/* ═══ INTERFACES ═══ */

export interface ReplayReward {
  type: "xp" | "lore";
  key: string;
  amount: number;
  label: string;
}

export interface CommunityChoice {
  choiceId: string;
  prompt: string;
  options: string[];
  /** Percentage of live players who picked each option, keyed by option index */
  communityResults: Record<number, number>;
  /** Which option index the community chose (plurality) */
  communityWinner: number;
}

export interface ReplayNarration {
  /** The Meme's opening monologue for this rerun */
  memeIntro: string;
  /** Condensed narrative summary of what happened during the event */
  eventSummary: string;
  /** Choices the community made during the live event */
  communityChoices: CommunityChoice[];
  /** The Meme's reactions keyed by a reaction trigger (e.g. "agreed", "disagreed", "skipped") */
  memeReactions: Map<string, string>;
  /** Replay-only rewards: XP + lore entries, never cosmetics */
  rewards: ReplayReward[];
}

/* ═══ THE MEME'S VOICE ═══ */

/** Generic Meme lines reused across all replays */
const MEME_GENERIC = {
  agreedWithCommunity: [
    "Same as everyone else? How delightfully predictable.",
    "Ah, a follower. The timeline smiles upon conformity.",
    "You and 73% of the population. Congratulations on being a statistic.",
    "Safe choice. Boring, but safe. I expected nothing less.",
  ],
  disagreedWithCommunity: [
    "Bold. I wish you'd been around — might've swung the vote.",
    "A contrarian! Finally, someone with a personality.",
    "Interesting. The timeline shivers at what could have been.",
    "Against the grain. I respect that. Don't let it go to your head.",
  ],
  skippedChoice: [
    "Skipping? That's a choice too, you know. A cowardly one.",
    "Fine, abstain. The Meme remembers all abstentions.",
    "You can skip the choice, but you can't skip the consequences. Well, actually, in a rerun you can. Lucky you.",
  ],
  noRewardsDisclaimer: [
    "Before you ask — no, you don't get the shiny cosmetics. You had to BE there. Them's the rules.",
    "You get XP and lore. The cool outfits? Those are for people who showed up. Take it up with the timeline.",
    "No exclusive drops for reruns. I don't make the rules. Actually, I do. And the answer is still no.",
  ],
  outroLines: [
    "And that's the rerun. You're welcome. Now go do something that matters.",
    "This has been The Meme's Reruns. Same time, different dimension. Don't miss the next one. Again.",
    "End of broadcast. The Meme is going back to sleep. Try not to miss anything else.",
    "That's a wrap. Your lore entries have been updated. Your fashion sense has not.",
  ],
} as const;

/* ═══ PER-EVENT REPLAY TEMPLATES ═══ */

export interface MemeReplayTemplate {
  eventKey: string;
  intro: string;
  summary: string;
  choices: CommunityChoice[];
  rewards: ReplayReward[];
}

export const MEME_REPLAY_TEMPLATES: MemeReplayTemplate[] = [
  {
    eventKey: "shadow_convergence",
    intro:
      "Oh, you missed The Shadow Convergence? Typical. You were probably in cryo. AGAIN. " +
      "Well, buckle up — I recorded the whole thing. Because of course I did. I'm The Meme. " +
      "I record EVERYTHING.",
    summary:
      "Dark energy flooded the network for two solid weeks. The Panopticon's shadow division went into " +
      "overdrive. Assassins thrived — naturally — while everyone else scrambled to seal dimensional rifts " +
      "before the entire surveillance grid ate itself. One million Shadow Fragments were collected. " +
      "The rift was sealed. Barely. You would have helped, but... *gestures vaguely at your cryo pod*.",
    choices: [
      {
        choiceId: "sc_rift_approach",
        prompt: "The rift was growing. The community had to decide: seal it fast with brute force, or study it first for intelligence.",
        options: ["Seal it immediately — too dangerous", "Study the rift — knowledge is power"],
        communityResults: { 0: 62, 1: 38 },
        communityWinner: 0,
      },
      {
        choiceId: "sc_shadow_allegiance",
        prompt: "A Shadow Entity offered an alliance. Accept its power, or reject it and fight alone?",
        options: ["Accept the Shadow Entity's alliance", "Reject it — we fight on our terms"],
        communityResults: { 0: 45, 1: 55 },
        communityWinner: 1,
      },
    ],
    rewards: [
      { type: "xp", key: "xp", amount: 800, label: "Shadow Convergence Rerun XP" },
      { type: "lore", key: "lore_shadow_convergence_recap", amount: 1, label: "Loredex: The Shadow Convergence" },
      { type: "lore", key: "lore_shadow_entity_files", amount: 1, label: "Loredex: Shadow Entity Dossier" },
    ],
  },
  {
    eventKey: "chrono_harvest",
    intro:
      "The Chrono Harvest. Ten days of temporal chaos and you slept through ALL of it. " +
      "I'd say 'time waits for no one' but honestly it waited for plenty of people. Just not you.",
    summary:
      "Temporal rifts scattered Chrono Seeds across every dimension. Oracles had a field day — " +
      "pun absolutely intended. Half a million seeds were harvested before the timeline threatened to " +
      "collapse entirely. The community pulled it off with about six hours to spare. Dramatic? Yes. " +
      "Necessary? Debatable. Entertaining for me? Absolutely.",
    choices: [
      {
        choiceId: "ch_timeline_priority",
        prompt: "Two timelines were collapsing simultaneously. The community could only stabilize one. Which did they save?",
        options: ["Save the Ancient Timeline — preserve history", "Save the Future Timeline — preserve possibility"],
        communityResults: { 0: 41, 1: 59 },
        communityWinner: 1,
      },
    ],
    rewards: [
      { type: "xp", key: "xp", amount: 600, label: "Chrono Harvest Rerun XP" },
      { type: "lore", key: "lore_chrono_harvest_recap", amount: 1, label: "Loredex: The Chrono Harvest" },
      { type: "lore", key: "lore_timeline_schism", amount: 1, label: "Loredex: The Timeline Schism" },
    ],
  },
  {
    eventKey: "forge_of_nations",
    intro:
      "The Forge of Nations! Twelve days of sweaty crafting montages and you missed every single one. " +
      "Engineers were in heaven. Everyone else had blisters. I had popcorn.",
    summary:
      "The great forges reignited to arm the resistance against the Panopticon. Three quarters of a million " +
      "items were forged — swords, shields, circuit breakers, the works. The Engineers outdid themselves. " +
      "The humanity path crowd was particularly enthusiastic about sticking it to the machine overlords. " +
      "Ironic, given they used machines to do it.",
    choices: [
      {
        choiceId: "fon_forge_target",
        prompt: "Resources were limited. The community chose what to forge en masse.",
        options: ["Weapons — offensive push against the Panopticon", "Defenses — fortify all Inception Arks"],
        communityResults: { 0: 67, 1: 33 },
        communityWinner: 0,
      },
      {
        choiceId: "fon_blueprint_leak",
        prompt: "A Panopticon defector offered stolen weapon blueprints. Trust the defector?",
        options: ["Accept the blueprints — too valuable to refuse", "Reject them — could be a trap"],
        communityResults: { 0: 58, 1: 42 },
        communityWinner: 0,
      },
    ],
    rewards: [
      { type: "xp", key: "xp", amount: 700, label: "Forge of Nations Rerun XP" },
      { type: "lore", key: "lore_forge_of_nations_recap", amount: 1, label: "Loredex: The Forge of Nations" },
      { type: "lore", key: "lore_panopticon_defector", amount: 1, label: "Loredex: The Defector's Gambit" },
    ],
  },
  {
    eventKey: "panopticon_infiltration",
    intro:
      "Panopticon Infiltration. Seven days. One shot. And you were... let me guess... " +
      "'busy with real life.' Adorable. The Panopticon doesn't take days off and neither should you.",
    summary:
      "A rare window opened in the Panopticon's defenses. Spies led the charge — extracting a quarter " +
      "million Intel Chips from the inner sanctum. The intelligence gathered reshaped everything we know " +
      "about their surveillance capabilities. Several operatives were almost caught. Almost. " +
      "The Panopticon still doesn't know how much we took. Let's keep it that way.",
    choices: [
      {
        choiceId: "pi_extraction_method",
        prompt: "Deep inside the Panopticon, the team had to choose their extraction method.",
        options: ["Ghost Protocol — leave no trace", "Smash and grab — take everything, blow the exit"],
        communityResults: { 0: 71, 1: 29 },
        communityWinner: 0,
      },
    ],
    rewards: [
      { type: "xp", key: "xp", amount: 500, label: "Panopticon Infiltration Rerun XP" },
      { type: "lore", key: "lore_panopticon_infiltration_recap", amount: 1, label: "Loredex: The Infiltration" },
      { type: "lore", key: "lore_panopticon_secrets", amount: 1, label: "Loredex: Panopticon Internal Memos" },
    ],
  },
  {
    eventKey: "lore_symposium",
    intro:
      "The Lore Symposium. Two weeks of scholars arguing about interdimensional grammar and you thought " +
      "'nah, I'll skip this one.' You absolute philistine. Fine. I'll summarize. With commentary.",
    summary:
      "Scholars from across dimensions gathered to debate, document, and decipher the forbidden histories. " +
      "One hundred thousand words of lore were written collectively — half of it contradictory, all of it " +
      "fascinating. The Oracle class dominated, obviously. Several previously unknown historical truths were " +
      "uncovered, including the real reason the Architect built the first Inception Ark. Spoiler: it wasn't " +
      "altruism.",
    choices: [
      {
        choiceId: "ls_forbidden_text",
        prompt: "A forbidden text was discovered that could rewrite known history. Publish it or suppress it?",
        options: ["Publish — truth must be known", "Suppress — some knowledge is dangerous"],
        communityResults: { 0: 76, 1: 24 },
        communityWinner: 0,
      },
    ],
    rewards: [
      { type: "xp", key: "xp", amount: 600, label: "Lore Symposium Rerun XP" },
      { type: "lore", key: "lore_symposium_recap", amount: 1, label: "Loredex: The Great Symposium" },
      { type: "lore", key: "lore_forbidden_histories", amount: 1, label: "Loredex: Forbidden Histories Vol. I" },
    ],
  },
  {
    eventKey: "guild_war_tournament",
    intro:
      "The Guild War Tournament. Seven days of absolute carnage and camaraderie, and your guild fought " +
      "without you. Do they know? They know. They definitely know. Moving on.",
    summary:
      "Syndicates clashed in the ultimate tournament. Fifty thousand guild battles were fought — " +
      "alliances formed and broken within hours. The Soldier class earned their keep. Blood, sweat, " +
      "and a suspicious amount of trash talk in the global chat. The winning syndicate's victory speech " +
      "was... let's say 'colorful.' I have it recorded. You can't see it. Guild exclusive.",
    choices: [
      {
        choiceId: "gwt_alliance_offer",
        prompt: "Mid-tournament, a rival syndicate offered a temporary alliance against the top-ranked guild.",
        options: ["Accept the alliance — enemy of my enemy", "Refuse — we fight alone or not at all"],
        communityResults: { 0: 53, 1: 47 },
        communityWinner: 0,
      },
    ],
    rewards: [
      { type: "xp", key: "xp", amount: 500, label: "Guild War Tournament Rerun XP" },
      { type: "lore", key: "lore_guild_war_recap", amount: 1, label: "Loredex: The Great Guild War" },
    ],
  },
  {
    eventKey: "fall_of_reality",
    intro:
      "You missed The Fall of Reality. THE FALL. OF REALITY. The anniversary of literally everything " +
      "ending and you couldn't be bothered. Twenty-one days! You had twenty-one days! " +
      "I'm not angry, I'm disappointed. Actually no, I am angry. Let's just get through this.",
    summary:
      "On the anniversary of the Architect's experiment collapsing, echoes of the cataclysm rippled " +
      "through every ship system. Two million Reality Shards were recovered — fragments of a universe " +
      "that no longer exists. Memory fragments materialized in every room. The truth of what happened " +
      "during those 47 seconds when the Panopticon went dark? It was finally pieced together. And it " +
      "changed everything. The Architect didn't fail. The Architect chose to end it. But you'll have " +
      "to read the lore entries to understand why. Because I'm not spoiling it. I have standards.",
    choices: [
      {
        choiceId: "for_memory_priority",
        prompt: "Two sets of memory fragments were decaying. The community could only preserve one.",
        options: ["The Architect's final memories", "The Panopticon's surveillance logs from the 47 seconds"],
        communityResults: { 0: 44, 1: 56 },
        communityWinner: 1,
      },
      {
        choiceId: "for_truth_response",
        prompt: "Upon learning the Architect chose to end reality — how should the Arks respond?",
        options: ["Honor the Architect's sacrifice — they saved us", "Condemn the Architect — they had no right"],
        communityResults: { 0: 52, 1: 48 },
        communityWinner: 0,
      },
    ],
    rewards: [
      { type: "xp", key: "xp", amount: 1200, label: "Fall of Reality Rerun XP" },
      { type: "lore", key: "lore_fall_of_reality_recap", amount: 1, label: "Loredex: The Fall of Reality" },
      { type: "lore", key: "lore_47_seconds", amount: 1, label: "Loredex: The 47 Seconds" },
      { type: "lore", key: "lore_architects_choice", amount: 1, label: "Loredex: The Architect's Choice" },
    ],
  },
];

/* ═══ REPLAY GENERATION ═══ */

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Determines the Meme's reaction based on whether the player agreed
 * or disagreed with the community's choice.
 */
function buildMemeReactions(
  template: MemeReplayTemplate,
  playerChoices: Record<string, string>,
): Map<string, string> {
  const reactions = new Map<string, string>();

  // Always include the rewards disclaimer
  reactions.set("rewards_disclaimer", pickRandom(MEME_GENERIC.noRewardsDisclaimer));
  reactions.set("outro", pickRandom(MEME_GENERIC.outroLines));

  for (const choice of template.choices) {
    const playerPick = playerChoices[choice.choiceId];

    if (playerPick === undefined || playerPick === "skip") {
      reactions.set(`choice_${choice.choiceId}`, pickRandom(MEME_GENERIC.skippedChoice));
      continue;
    }

    const playerIndex = choice.options.indexOf(playerPick);
    if (playerIndex === -1) {
      reactions.set(`choice_${choice.choiceId}`, pickRandom(MEME_GENERIC.skippedChoice));
      continue;
    }

    if (playerIndex === choice.communityWinner) {
      reactions.set(`choice_${choice.choiceId}`, pickRandom(MEME_GENERIC.agreedWithCommunity));
    } else {
      reactions.set(`choice_${choice.choiceId}`, pickRandom(MEME_GENERIC.disagreedWithCommunity));
    }
  }

  return reactions;
}

/**
 * Generate a full replay narration for a missed seasonal event.
 *
 * @param eventId - The event key from SEASONAL_EVENTS (e.g. "shadow_convergence")
 * @param playerChoices - The player's choices keyed by choiceId, value is the chosen option text or "skip"
 * @returns A complete ReplayNarration with The Meme's commentary, or null if the event has no template
 */
export function generateReplay(
  eventId: string,
  playerChoices: Record<string, string>,
): ReplayNarration {
  const template = MEME_REPLAY_TEMPLATES.find((t) => t.eventKey === eventId);

  if (!template) {
    // Fallback for unknown events — The Meme is not pleased
    return {
      memeIntro:
        "You want a rerun of... what? I don't have that event in my archives. " +
        "Either you're making things up or the timeline ate it. Either way, not my problem.",
      eventSummary: "No event data available. The Meme's archives do not contain this event.",
      communityChoices: [],
      memeReactions: new Map([
        ["rewards_disclaimer", pickRandom(MEME_GENERIC.noRewardsDisclaimer)],
        ["outro", "This has been a waste of both our times. Goodbye."],
      ]),
      rewards: [],
    };
  }

  const eventDef = SEASONAL_EVENTS.find((e) => e.key === eventId);
  const memeReactions = buildMemeReactions(template, playerChoices);

  return {
    memeIntro: template.intro,
    eventSummary: template.summary,
    communityChoices: template.choices,
    memeReactions,
    rewards: template.rewards,
  };
}

/**
 * Check which seasonal events a player has missed and could replay.
 */
export function getMissedEvents(
  allEventKeys: string[],
  participatedEventKeys: string[],
): string[] {
  const participated = new Set(participatedEventKeys);
  return allEventKeys.filter((key) => !participated.has(key));
}

/**
 * Validate that replay rewards contain NO exclusive cosmetics or achievements.
 * This is a safety check — The Meme's policy is XP + lore ONLY.
 */
export function validateReplayRewards(rewards: ReplayReward[]): {
  valid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  for (const reward of rewards) {
    if (reward.type !== "xp" && reward.type !== "lore") {
      violations.push(
        `Reward "${reward.label}" has type "${reward.type}" — only "xp" and "lore" are allowed in reruns.`,
      );
    }
  }
  return { valid: violations.length === 0, violations };
}

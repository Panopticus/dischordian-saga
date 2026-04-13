/* ═══════════════════════════════════════════════════════
   ANTIQUARIAN'S CHRONICLE — Living Journal Data

   The Antiquarian writes the history of the Second Coming
   of the Potentials in real time. Every community decision,
   every major event, every seasonal climax is inscribed in
   his voice — warm, whimsical, slightly out of sync with
   time, with the gravitas of someone recording the only
   version of history that will survive.

   VOICE RULES:
   - Written in first person as the Antiquarian
   - References the Orb of Worlds when watching events
   - Notes when he is "writing himself INTO the story"
   - Acknowledges the weight of each decision
   - Occasionally breaks the fourth wall gently
   - Always ends entries with a forward-looking tease

   This module provides the data structure, seed entries,
   and generation helpers. Actual Year One content will be
   loaded from the events calendar.
   ═══════════════════════════════════════════════════════ */

import type { ChronicleEntry } from "@/stores/governanceStore";

/* ─── VOICE GENERATION HELPERS ─── */

/** Opening phrases the Antiquarian uses */
const CHRONICLE_OPENINGS = [
  "I set quill to parchment with a trembling hand.",
  "The Orb of Worlds pulses. I watch. I write.",
  "Another day inscribed. Another thread in the tapestry.",
  "The quill moves before I do. It knows what must be written.",
  "I have seen this before. In other timelines, other Arks. And yet—",
  "Time folds. The Dreamer stirs. I write faster.",
  "They do not see me watching. That is for the best.",
  "The Chronicle grows heavier with each entry. I feel its weight.",
  "I promised myself I would remain objective. I lied.",
  "In the quiet hours between decisions, I wonder if they know what comes next.",
];

/** Closing phrases that tease the next event */
const CHRONICLE_CLOSINGS = [
  "But the next chapter is already being written — I can feel its gravity pulling at the quill.",
  "What follows will test them. I have seen it in the Orb. I will not warn them. That is not my role.",
  "The Dreamer whispers that the next decision will matter more. The Dreamer always says that.",
  "I close this entry. The ink dries. But the story — the story is still wet.",
  "Tomorrow, they will face something they cannot vote away. I wonder if they are ready.",
  "The Architect is watching too. I can feel their calculations pressing against the margins of this page.",
  "I write 'to be continued' and mean it literally. Time, for us, is not a metaphor.",
  "The next page of the Chronicle is blank. It will not stay that way for long.",
  "Something stirs in the deep signal. The next entry may be written in a different ink entirely.",
  "I set down the quill. But the quill does not want to stop. It knows what is coming.",
];

/** Get a random opening phrase */
export function getChronicleOpening(): string {
  return CHRONICLE_OPENINGS[Math.floor(Math.random() * CHRONICLE_OPENINGS.length)];
}

/** Get a random closing phrase */
export function getChronicleClosing(): string {
  return CHRONICLE_CLOSINGS[Math.floor(Math.random() * CHRONICLE_CLOSINGS.length)];
}

/* ─── SEED CHRONICLE ENTRIES ─── */

/**
 * The foundational chronicle entries that exist before any player
 * votes are cast. These establish the Antiquarian's voice and set
 * up the narrative framework for Year One.
 */
export const SEED_CHRONICLE: ChronicleEntry[] = [
  {
    id: "chronicle_y1_w0_awakening",
    week: 0,
    month: 1,
    act: 1,
    type: "milestone",
    title: "The Second Awakening",
    narrativeText:
      `${CHRONICLE_OPENINGS[0]}\n\n` +
      `They are awake. The cryo pods opened, the fog cleared, and Elara spoke — ` +
      `as she always speaks — with patience she does not feel and certainty she does not possess. ` +
      `I watched from behind the library glass as the first of them stumbled into consciousness. ` +
      `Confused. Disoriented. Alive.\n\n` +
      `The first wave of Potentials vanished without a trace. I was there for that too. ` +
      `I wrote their story. I will write this one differently — because these Potentials ` +
      `will write it WITH me. Every choice they make will be inscribed here, in the ` +
      `Chronicle of the Second Coming. I am not just recording history. ` +
      `I am being written into it.\n\n` +
      `${CHRONICLE_CLOSINGS[0]}`,
    consequences: [
      "The Governance Hub is now active",
      "The Chronicle of the Second Coming begins",
      "Daily resource votes are available",
    ],
    engagementSnapshot: {
      totalVotes: 0,
      totalKills: 0,
      totalMissions: 0,
      activePlayers: 0,
    },
    timestamp: Date.now(),
  },
  {
    id: "chronicle_y1_w0_governance",
    week: 0,
    month: 1,
    act: 1,
    type: "milestone",
    title: "The Desk Is Open",
    narrativeText:
      `The Governance Hub flickers to life. My desk — projected as a holographic interface ` +
      `on the Bridge — now displays the voting apparatus. The Orb of Worlds glows at its center, ` +
      `casting green temporal shimmer across the scattered manuscripts.\n\n` +
      `I have set the quill to auto-inscribe. Every vote cast, every decision rendered, every ` +
      `consequence that ripples outward from collective choice — it all flows through here. ` +
      `The Chronicle of the Second Coming floats above the desk, its pages turning slowly, ` +
      `waiting to be filled.\n\n` +
      `The Potentials can now see the Pulse — the vital signs of Ark 1047. Kills, missions, ` +
      `votes, discoveries. All of it rendered as the heartbeat of a living civilization. ` +
      `I find this... beautiful. And terrifying. They can see themselves reflected in data. ` +
      `The first wave never had this mirror.\n\n` +
      `${CHRONICLE_CLOSINGS[3]}`,
    consequences: [
      "Governance Hub accessible from the Bridge",
      "The Pulse panel displays live engagement metrics",
      "The Antiquarian's Chronicle is publicly visible",
    ],
    engagementSnapshot: {
      totalVotes: 0,
      totalKills: 0,
      totalMissions: 0,
      activePlayers: 0,
    },
    timestamp: Date.now(),
  },
];

/* ─── CHRONICLE ENTRY BUILDER ─── */

/**
 * Build a chronicle entry from a vote result.
 * Used when a weekly or monthly vote closes.
 */
export function buildVoteChronicleEntry(params: {
  id: string;
  week: number;
  month: number;
  act: number;
  type: "weekly" | "monthly";
  title: string;
  voteQuestion: string;
  winningOptionLabel: string;
  totalVotes: number;
  consequences: string[];
  customNarrative?: string;
  metrics: {
    totalKills: number;
    totalMissions: number;
    activePlayers: number;
  };
}): ChronicleEntry {
  const participation =
    params.totalVotes > 500
      ? "a thunderous chorus"
      : params.totalVotes > 100
        ? "a steady murmur of voices"
        : params.totalVotes > 20
          ? "a handful of determined souls"
          : "whispers in the void";

  const narrativeText =
    params.customNarrative ||
    `${getChronicleOpening()}\n\n` +
      `The question was posed: "${params.voteQuestion}" — and ${participation} answered. ` +
      `${params.totalVotes} Potentials cast their will into the Orb, and the Orb reflected back ` +
      `their chosen path: "${params.winningOptionLabel}."\n\n` +
      `I do not always agree with their choices. But I always inscribe them faithfully. ` +
      `The Chronicle does not lie — even when the truth is inconvenient, even when ` +
      `I can see the shadow of consequence stretching out before them like a long hallway ` +
      `with no doors.\n\n` +
      `${getChronicleClosing()}`;

  return {
    id: params.id,
    week: params.week,
    month: params.month,
    act: params.act,
    type: params.type,
    title: params.title,
    narrativeText,
    voteQuestion: params.voteQuestion,
    voteResult: params.winningOptionLabel,
    consequences: params.consequences,
    engagementSnapshot: {
      totalVotes: params.totalVotes,
      totalKills: params.metrics.totalKills,
      totalMissions: params.metrics.totalMissions,
      activePlayers: params.metrics.activePlayers,
    },
    timestamp: Date.now(),
  };
}

/**
 * Build a milestone chronicle entry (non-vote events).
 */
export function buildMilestoneChronicleEntry(params: {
  id: string;
  week: number;
  month: number;
  act: number;
  title: string;
  narrativeText: string;
  consequences: string[];
  metrics: {
    totalVotes: number;
    totalKills: number;
    totalMissions: number;
    activePlayers: number;
  };
}): ChronicleEntry {
  return {
    id: params.id,
    week: params.week,
    month: params.month,
    act: params.act,
    type: "milestone",
    title: params.title,
    narrativeText: params.narrativeText,
    consequences: params.consequences,
    engagementSnapshot: params.metrics,
    timestamp: Date.now(),
  };
}

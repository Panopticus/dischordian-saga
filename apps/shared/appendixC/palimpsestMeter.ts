/* ═══════════════════════════════════════════════════════
   APPENDIX C §C.1 — THE PALIMPSEST METER

   "The page underneath the page. What is written. What is
    erased. What is written again."

   Two opposing bars, rendered on the Governance Hub as an
   illuminated manuscript page:

     SIGNAL (Truth / Canon / Light)     — gold, left-to-right
     NOISE  (Corruption / Shadow Tongue) — red, bleeds upward

   Data shell only. The running meter lives wherever the
   consumer decides (store, server, or Governance Hub panel);
   this file just enumerates the contribution table and the
   narrative state thresholds.
   ═══════════════════════════════════════════════════════ */

export type PalimpsestAxis = "signal" | "noise";

export interface PalimpsestContribution {
  id: string;
  axis: PalimpsestAxis;
  /** Canonical source of the contribution. */
  source: string;
  /** Points added per occurrence. */
  amount: number;
  /** Short description for UI tooltips. */
  description: string;
}

export const PALIMPSEST_SIGNAL_CONTRIBUTIONS: readonly PalimpsestContribution[] = [
  {
    id: "signal_loredex_correct",
    axis: "signal",
    source: "loredex_quiz",
    amount: 1,
    description: "Correct Loredex Quiz answer.",
  },
  {
    id: "signal_research_puzzle",
    axis: "signal",
    source: "research_puzzle",
    amount: 5,
    description: "Research Puzzle completed.",
  },
  {
    id: "signal_craft_epic",
    axis: "signal",
    source: "crafting",
    amount: 2,
    description: "Crafting success at Epic rarity.",
  },
  {
    id: "signal_craft_legendary",
    axis: "signal",
    source: "crafting",
    amount: 5,
    description: "Crafting success at Legendary rarity.",
  },
  {
    id: "signal_episode_win",
    axis: "signal",
    source: "palimpsest_episode",
    amount: 50,
    description: "Winning a Palimpsest game show episode.",
  },
  {
    id: "signal_beacon_transcribed",
    axis: "signal",
    source: "signal_beacon",
    amount: 10,
    description: "Transcribing a Signal Beacon into the Chronicle.",
  },
  {
    id: "signal_loredex_preserve_vote",
    axis: "signal",
    source: "community_vote",
    amount: 1,
    description:
      "Community vote to preserve a Shadow Tongue-threatened Loredex entry.",
  },
  {
    id: "signal_dialog_truth",
    axis: "signal",
    source: "dialog_wheel",
    amount: 1,
    description: "Choosing the truth option in a dialog wheel.",
  },
  {
    id: "signal_meme_disguise_caught",
    axis: "signal",
    source: "palimpsest_episode",
    amount: 25,
    description: "Catching a Meme disguise on the show.",
  },
];

export const PALIMPSEST_NOISE_CONTRIBUTIONS: readonly PalimpsestContribution[] = [
  {
    id: "noise_loredex_wrong",
    axis: "noise",
    source: "loredex_quiz",
    amount: 1,
    description: "Wrong Loredex Quiz answer.",
  },
  {
    id: "noise_research_puzzle_fail",
    axis: "noise",
    source: "research_puzzle",
    amount: 2,
    description: "Failing a Research Puzzle.",
  },
  {
    id: "noise_craft_fail",
    axis: "noise",
    source: "crafting",
    amount: 1,
    description: "Crafting failure.",
  },
  {
    id: "noise_episode_loss",
    axis: "noise",
    source: "palimpsest_episode",
    amount: 25,
    description: "Losing a Palimpsest episode.",
  },
  {
    id: "noise_beacon_ignored",
    axis: "noise",
    source: "signal_beacon",
    amount: 5,
    description: "Ignoring a Signal Beacon for >7 days.",
  },
  {
    id: "noise_loredex_sacrifice_vote",
    axis: "noise",
    source: "community_vote",
    amount: 1,
    description: "Community vote to sacrifice a Loredex entry.",
  },
  {
    id: "noise_dialog_lie",
    axis: "noise",
    source: "dialog_wheel",
    amount: 1,
    description: "Choosing the lie option in a dialog wheel.",
  },
  {
    id: "noise_alaric_agreement",
    axis: "noise",
    source: "palimpsest_episode",
    amount: 10,
    description: "Agreeing with General Alaric on the show.",
  },
];

/** Narrative state thresholds. Signal - Noise delta drives the tier. */
export type PalimpsestState =
  | "signal_dominant_wide"
  | "signal_dominant_narrow"
  | "noise_dominant_narrow"
  | "noise_dominant_wide";

export interface PalimpsestStateDescriptor {
  state: PalimpsestState;
  /** Lower bound (inclusive) of signal-minus-noise for this state. */
  minDelta: number;
  /** Upper bound (exclusive). */
  maxDelta: number;
  /** What happens narratively when this state is active. */
  narrativeEffects: string[];
}

export const PALIMPSEST_STATE_THRESHOLDS: readonly PalimpsestStateDescriptor[] = [
  {
    state: "signal_dominant_wide",
    minDelta: 100,
    maxDelta: Number.POSITIVE_INFINITY,
    narrativeEffects: [
      "A new Chronicle entry is published.",
      "Elara gains one new dialog line.",
      "Loredex entries partially corrupted by Shadow Tongue auto-repair at a steady trickle.",
      "The Inventor can successfully hack Alaric's broadcast (see §C.4).",
      "The Antiquarian writes more frequently.",
    ],
  },
  {
    state: "signal_dominant_narrow",
    minDelta: 1,
    maxDelta: 100,
    narrativeEffects: [
      "Neutral state. The show runs. The world holds.",
    ],
  },
  {
    state: "noise_dominant_narrow",
    minDelta: -100,
    maxDelta: 1,
    narrativeEffects: [
      "Shadow Tongue begins editing the Loredex faster.",
      "Some entries go permanently red.",
      "Elara's callback pool gets a new 'I can't remember this' line.",
    ],
  },
  {
    state: "noise_dominant_wide",
    minDelta: Number.NEGATIVE_INFINITY,
    maxDelta: -100,
    narrativeEffects: [
      "The Host's face briefly slips during an episode and the player sees the Meme underneath the Game Master mask (see §C.6).",
      "One Loredex entry per week is edited into a lie and the player has no way to tell which.",
      "The Antiquarian writes entries with visible holes in them.",
    ],
  },
];

/** Look up the narrative state for a given signal/noise reading. */
export function getPalimpsestState(
  signal: number,
  noise: number,
): PalimpsestState {
  const delta = signal - noise;
  for (const desc of PALIMPSEST_STATE_THRESHOLDS) {
    if (delta >= desc.minDelta && delta < desc.maxDelta) {
      return desc.state;
    }
  }
  // Exact equality at minDelta=100 falls into signal_dominant_wide.
  if (delta >= 100) return "signal_dominant_wide";
  return "signal_dominant_narrow";
}

/** All contributions regardless of axis, for iteration. */
export function listPalimpsestContributions(): readonly PalimpsestContribution[] {
  return [
    ...PALIMPSEST_SIGNAL_CONTRIBUTIONS,
    ...PALIMPSEST_NOISE_CONTRIBUTIONS,
  ];
}

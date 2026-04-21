/**
 * NPC Profile-Aware Lines — the dread-build extension.
 *
 * A catalog of one-line NPC branches keyed on a psychological
 * profile axis + magnitude. When a profile-aware NPC reacts to
 * the player, the renderer calls `pickNpcLine(npcId, profile)`
 * and the correct line surfaces based on the axis most defining
 * for this player.
 *
 * Workstream 6 / Phase F content pass. Each entry seeds one NPC
 * with 3-4 line variants across the strong-negative / neutral /
 * strong-positive buckets of the axis the NPC cares about.
 *
 * Add more NPCs over time by extending the `NPC_LINES` map.
 */

import {
  magnitudeOf,
  type PlayerProfile,
  type ProfileAxis,
} from "./playerProfile";

export interface NpcLineEntry {
  /** Which axis this NPC reads the player by. */
  axis: ProfileAxis;
  /** Lines keyed by magnitude bucket. Missing buckets fall back
   *  to `neutral`. */
  lines: Partial<Record<
    | "strong_negative"
    | "moderate_negative"
    | "mild_negative"
    | "neutral"
    | "mild_positive"
    | "moderate_positive"
    | "strong_positive",
    string
  >>;
}

/** The seeded NPCs. Extend this map as retroactive content passes
 *  annotate existing dialog banks. */
export const NPC_LINES: Readonly<Record<string, NpcLineEntry>> = Object.freeze({
  the_oracle: {
    axis: "curiosity",
    lines: {
      strong_positive:
        "You ask the question before I finish offering the reading. You always have. The card you are looking for is the one I have not finished shuffling yet.",
      moderate_positive:
        "You want the whole spread. I will oblige. Hold still.",
      neutral:
        "One card today. Three if you need them. I will not waste your time.",
      mild_negative:
        "You do not want to know, and that is also a reading. Come back when you do.",
      strong_negative:
        "I have never read someone who took less interest in the reading itself. That is not a criticism. That is a pattern.",
    },
  },
  the_jailer: {
    axis: "conformity",
    lines: {
      strong_positive:
        "You arrived through the approved corridor. You signed the approved form. You are the kind of inmate I prefer. Do not test me.",
      neutral:
        "You move like someone who has read the rules and chosen to follow most of them. Most is more than we usually see.",
      strong_negative:
        "Your file lists you as 'irregular.' I am putting that on the record. It is not a compliment. It is an acknowledgement.",
    },
  },
  the_degen: {
    axis: "aggression",
    lines: {
      strong_positive:
        "Look at you. Eyes wide, fist closed. Lose me some money. Don't make it clean; I don't want clean.",
      neutral:
        "Measured. Boring. You'll win more than you lose. I'll take that action on a Tuesday but not a Saturday.",
      strong_negative:
        "You're a pacifist at a casino. Do you understand how funny that is? Give me your coin anyway. The house is patient with your type.",
    },
  },
  iron_lion: {
    axis: "mercy",
    lines: {
      strong_positive:
        "You let the last one live. I respect that and I do not share it. My kind does not have that disease. It is a disease worth catching.",
      neutral:
        "You finish the ones that need finishing. You spare the ones that do not. That is the normal shape. Go.",
      strong_negative:
        "You leave nothing standing. I used to do that. It is faster than the alternative. The alternative is better.",
    },
  },
  wraith_calder: {
    axis: "vigilance",
    lines: {
      strong_positive:
        "You are checking the exits while I speak. Good. I am checking them too. We can talk while we watch.",
      neutral:
        "You hear me. You do not yet see me. That is the normal order of things.",
      strong_negative:
        "You trust too easily. Stop. Not of me — of the things I told you to watch for. Stop being kind to their disguises.",
    },
  },
  akai_shi: {
    axis: "wit",
    lines: {
      strong_positive:
        "You make a joke while I am trying to kill you. I do not appreciate it. I remember it.",
      neutral:
        "You are quiet when it matters and quieter when it doesn't. That is a useful shape.",
      strong_negative:
        "You have not smiled since you walked in. Neither have I. This meeting is CORRECTLY toned. Continue.",
    },
  },
  white_oracle: {
    axis: "vulnerability",
    lines: {
      strong_positive:
        "You told me things I did not ask for and could not have guessed. Thank you. I will keep them. I will not use them against you.",
      neutral:
        "You tell me what I need to know. You keep the rest. That is how most people survive conversations with me.",
      strong_negative:
        "You will not tell me where you have been. Or with whom. Or why. I respect it. I also notice it. Both can be true.",
    },
  },
});

/** Pick a profile-aware line for an NPC. Returns null if the NPC
 *  has no seeded lines (caller should fall back to their default
 *  dialog). */
export function pickNpcLine(
  npcId: string,
  profile: PlayerProfile,
): string | null {
  const entry = NPC_LINES[npcId];
  if (!entry) return null;
  const value = profile[entry.axis];
  const mag = magnitudeOf(value);
  // Fall through to neutral if the specific bucket isn't seeded.
  return (
    entry.lines[mag] ??
    entry.lines.neutral ??
    entry.lines.moderate_positive ??
    entry.lines.moderate_negative ??
    null
  );
}

/** List all currently-seeded NPC ids — useful for test coverage
 *  and for writers who want to see what's done. */
export function listProfileAwareNpcs(): readonly string[] {
  return Object.keys(NPC_LINES);
}

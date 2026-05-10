/* ═══════════════════════════════════════════════════════
   CONVERGENCE SEAT GOODBYE — pre-final-battle 14-NPC walk

   Before the Act 7 final battle, the player walks the
   populated Bridge Diplomacy Table one last time. Every NPC
   they have met across all acts speaks one line. This is
   the BioWare end-of-Mass-Effect-2 pre-suicide-mission
   moment: the payoff for every encounter the player earned
   across the campaign.

   Each line:
     - Comes from an NPC the player has demonstrably met
       (via the same metFlag the diplomacy table reads).
     - Is voiced in canonical character.
     - Is conditional — only NPCs the player met show up.

   The walkthrough order is canonical (matches the diplomacy
   table seat order) so a returning player remembers the
   procession.

   Pure module. No React.
   ═══════════════════════════════════════════════════════ */

import { DIPLOMACY_TABLE_SEATS } from "./bridgeDiplomacyTable";

export interface GoodbyeLine {
  /** NPC id matching DIPLOMACY_TABLE_SEATS. */
  npcId: string;
  /** Display name shown above the line. */
  speakerName: string;
  /** Met-flag from the diplomacy table; line only renders if set. */
  metFlag: string;
  /** Seat order (mirrors DIPLOMACY_TABLE_SEATS so the procession is
   *  deterministic). */
  order: number;
  /** The line itself. Single utterance per NPC. */
  line: string;
}

const SPEAKER_LOOKUP: Record<string, string> = Object.fromEntries(
  DIPLOMACY_TABLE_SEATS.map((s) => [s.npcId, s.displayName]),
);

const META_LOOKUP: Record<string, { metFlag: string; order: number }> =
  Object.fromEntries(
    DIPLOMACY_TABLE_SEATS.map((s) => [
      s.npcId,
      { metFlag: s.metFlag, order: s.seatPosition },
    ]),
  );

interface RawGoodbye {
  npcId: string;
  line: string;
}

const RAW_GOODBYES: ReadonlyArray<RawGoodbye> = [
  {
    npcId: "elara",
    line:
      "I am proud of you. I have been since the cryo wake. I am proud of you and I am with you and I love you. Go.",
  },
  {
    npcId: "the_human",
    line:
      "I have been the Detective. I have been the Seeker. I have been the Student. I have been the Wall. Tonight I am yours, and you are mine, and we are walking into the page together. The Antiquarian has read it already. We have not. Let us read it. Together.",
  },
  {
    npcId: "adjudicator_locke",
    line:
      "You showed up. I always thought you would. I was usually wrong. I am glad I was wrong about this.",
  },
  {
    npcId: "the_antiquarian",
    line:
      "I have read this page already. You have not. Make the page interesting. The Cycle is recording.",
  },
  {
    npcId: "patch",
    line:
      "The wreck next door is not as dead as we thought. Neither are you. Go.",
  },
  {
    npcId: "zephyr_9",
    line:
      "Engineer's Opening, Move 1. I taught you. You taught me. The board is the same; the players are different.",
  },
  {
    npcId: "little_one",
    line:
      "I burned the card. You burned the rest. We are even now.",
  },
  {
    npcId: "the_seer",
    line:
      "I have already seen which one you choose. I am not going to tell you. I am going to stand near you while you do it. Again.",
  },
  {
    npcId: "vex_solene",
    line:
      "My bench is yours now. Make one more thing. Don't tell me what.",
  },
  {
    npcId: "the_game_master",
    line:
      "You lost to me on purpose, the first time. You won by losing. The Convergence is the same lesson at scale.",
  },
  {
    npcId: "the_degen",
    line:
      "The house always wins. You are the house tonight.",
  },
  {
    npcId: "iron_lion",
    line:
      "Three thousand and one posters. I knew there was one more. I knew.",
  },
  {
    npcId: "agent_zero",
    line:
      "I signed under no name. The blade is the signature. Tonight the blade is yours.",
  },
  {
    npcId: "the_inventor",
    line:
      "I was watching too. I am proud of you. Tell Marion I said hi.",
  },
  {
    npcId: "malkia_enigma",
    line:
      "I will sing Last Words once more. After this, never again.",
  },
];

export const CONVERGENCE_SEAT_GOODBYE_LINES: ReadonlyArray<GoodbyeLine> =
  RAW_GOODBYES.map((raw) => {
    const meta = META_LOOKUP[raw.npcId];
    if (!meta) {
      throw new Error(
        `Convergence goodbye references unknown NPC '${raw.npcId}' — keep DIPLOMACY_TABLE_SEATS and CONVERGENCE_SEAT_GOODBYE_LINES in sync.`,
      );
    }
    return {
      npcId: raw.npcId,
      speakerName: SPEAKER_LOOKUP[raw.npcId],
      metFlag: meta.metFlag,
      order: meta.order,
      line: raw.line,
    };
  }).sort((a, b) => a.order - b.order);

/** Returns the subset of goodbye lines for NPCs the player has met,
 *  in canonical seat order. The Captain's chair (seat 1) is empty
 *  on purpose — there is no goodbye line for the chair itself. */
export function getConvergenceGoodbyeLines(
  flags: ReadonlySet<string>,
): GoodbyeLine[] {
  return CONVERGENCE_SEAT_GOODBYE_LINES.filter((g) => flags.has(g.metFlag));
}

/** True once every diplomacy-table NPC has spoken at the seat — i.e.
 *  the player earned every chair before walking. */
export function allGoodbyesHeard(flags: ReadonlySet<string>): boolean {
  return CONVERGENCE_SEAT_GOODBYE_LINES.every((g) => flags.has(g.metFlag));
}

/* ═══════════════════════════════════════════════════════
   NPC MOURNING REMARKS — canonical-NPC reactions to a
   recruited NPC's total death.

   When a recruited NPC dies, every other canonical NPC
   who knew them gets a one-shot reaction line. Lines fire
   for ~7 in-game days as ambient feed entries and as the
   speaker's first-line override on next dialog open.

   Edges are derived from lore connections (LORE_BIBLE.md
   "Connections" sections). Where the lore is silent, we
   omit the edge — silence from a stranger is correct.
   ═══════════════════════════════════════════════════════ */

import type { ResurrectableNpcKey } from "./resurrectionProtocols";

/** Speaker keys are any canonical NPC id. We accept arbitrary strings
 *  so we can reference NPCs that don't have full imprint cards yet
 *  (e.g. "elara", "the_human", "antiquarian"). */
export type SpeakerNpcKey = string;

/** A mourning remark — at least 2 variants per (deceased, speaker)
 *  edge, randomly selected at trigger time so re-listening varies. */
export interface MourningRemark {
  /** Speaker's character voice key. */
  speaker: SpeakerNpcKey;
  /** Display label for UI. */
  speakerDisplay: string;
  /** 2-4 alternate lines, picked randomly at trigger time. */
  variants: string[];
}

/** Indexed by deceased NPC key. */
export const MOURNING_REMARKS: Record<
  ResurrectableNpcKey,
  MourningRemark[]
> = {
  /* ═══ VEX SOLÈNE — Coda Maestro, the friend you saved ═══ */
  vex_solene: [
    {
      speaker: "elara",
      speakerDisplay: "Elara",
      variants: [
        "Vex is gone. The Coda is half-tempo. I keep cueing the maestro count and there's nobody on the downbeat.",
        "I keep her commission queue open. I don't know why. Habit, maybe. Hope, maybe.",
      ],
    },
    {
      speaker: "the_human",
      speakerDisplay: "The Human",
      variants: [
        "She was the friend you saved. The card called her that for a reason. I don't know what to call her now.",
        "Vex Solène. The Coda's missing its first chair. The whole orchestra notices.",
      ],
    },
    {
      speaker: "the_dreamer",
      speakerDisplay: "The Dreamer",
      variants: [
        "The Reveal cadence has a rest where her bow used to be. The piece is shorter. The piece is wrong.",
        "She heard the music the Ne-Yons left in the substrate. I will miss telling her she was right.",
      ],
    },
  ],

  /* ═══ WRAITH CALDER — Hierophant of Thaloria in Exile ═══ */
  wraith_calder: [
    {
      speaker: "the_human",
      speakerDisplay: "The Human",
      variants: [
        "Wraith Calder. Eight rites. The ninth was ours, and we didn't get to write it down.",
        "He chose his deaths. We didn't get to choose this one for him. That's the part that bothers me.",
      ],
    },
    {
      speaker: "antiquarian",
      speakerDisplay: "The Antiquarian",
      variants: [
        "I have his pre-rite signatures in my journal. Eight pages. I will not be adding a ninth.",
        "The daily-names ceremony will need a different hand to sign. I do not yet know whose.",
      ],
    },
    {
      speaker: "jericho_jones",
      speakerDisplay: "Jericho Jones",
      variants: [
        "He was preparing me for the move he couldn't finish. I was supposed to make him proud first. I didn't.",
        "He bought us time. I'll be using it. Don't misread that for being okay.",
      ],
    },
  ],

  /* ═══ LOCKE — Adjudicator Locke ═══ */
  locke: [
    {
      speaker: "elara",
      speakerDisplay: "Elara",
      variants: [
        "Locke is gone. New Babylon's transition desk is calling every hour. I keep telling them she's on assignment.",
        "She was impressed and never said it. I will spend the rest of my life trying to remember that's how she said it.",
      ],
    },
    {
      speaker: "the_human",
      speakerDisplay: "The Human",
      variants: [
        "Adjudicator Locke. Send-them-somewhere-dangerous Locke. The trade is closed. I don't like the price.",
        "She wrote a bench paper for every contingency except this one. I'm reading it now. It doesn't help.",
      ],
    },
    {
      speaker: "vex_solene",
      speakerDisplay: "Vex Solène",
      variants: [
        "She came to one Coda showing. She sat in the back. She tipped the box, she didn't say a word. I kept that note.",
        "The Friend I Saved card was a gift to me. I am taking it down from the wall.",
      ],
    },
  ],

  /* ═══ JERICHO JONES — Iron-Clad Lion ═══ */
  jericho_jones: [
    {
      speaker: "the_degen",
      speakerDisplay: "The Degen",
      variants: [
        "Jericho's training fee was a single line in my ledger. The fee is now closed. I do not refund.",
        "The pre-Fall Iron Lion's imprint will need a different vessel. I do not know yet whose.",
      ],
    },
    {
      speaker: "wraith_calder",
      speakerDisplay: "Wraith Calder",
      variants: [
        "I inscribed Akai Shi's name in the ceremony for him. I will inscribe his name now. I am running out of names.",
        "The Syndicate-of-Death move he was being prepared for is still coming. We have less time than we had.",
      ],
    },
    {
      speaker: "akai_shi",
      speakerDisplay: "Akai Shi",
      variants: [
        "He killed me in the corridor at Thaloria. I forgave him before he asked. He kept asking for the rest of his life. I will miss that.",
        "He was the only one who said 'mercy' and meant it as a question, not a defense. I will remember the question.",
      ],
    },
  ],

  /* ═══ AKAI SHI — formerly consumed by the Thought Virus, returned post-event ═══ */
  akai_shi: [
    {
      speaker: "jericho_jones",
      speakerDisplay: "Jericho Jones",
      variants: [
        "I killed her once. I trained for years so the second time wouldn't be on me. It wasn't. Somehow that is worse.",
        "She came back from the Necromancer event for one tour with us. One tour. The math is unkind.",
      ],
    },
    {
      speaker: "the_necromancer",
      speakerDisplay: "The Necromancer",
      variants: [
        "She was returned to the cycle. She is again returned to the cycle. The cycle does not mind. I do.",
        "I will not see her on the next event. The thought-virus is tired of her. I am too. I miss her anyway.",
      ],
    },
    {
      speaker: "wraith_calder",
      speakerDisplay: "Wraith Calder",
      variants: [
        "Her name is in the ceremony again. I will read it again tomorrow.",
        "She walked into the breach a second time. Some people are not allowed a third. I am sorry she was one of them.",
      ],
    },
  ],

  /* ═══ LYCOS / THE WOLF — the Antiquarian's contracted hunter ═══ */
  lycos: [
    {
      speaker: "elara",
      speakerDisplay: "Elara",
      variants: [
        "Lycos fell on contract. The Antiquarian's pen paused. He did not close the column. He underlined the pause-line and went to his window.",
        "He is in the Resurrection Protocol queue. The chronicle has a pause-shaped hole in it; the hole has a shape because the hole has a name.",
      ],
    },
    {
      speaker: "the_human",
      speakerDisplay: "The Human",
      variants: [
        "He died for the contract he chose. That is not how the Hierarchy expected the contract to read.",
        "Run the petition. He has done this before. He knows how to come back. He needs the rite, and the rite needs you to run it.",
      ],
    },
    {
      speaker: "the_dreamer",
      speakerDisplay: "The Dreamer",
      variants: [
        "The contractor pauses the contract. The contractor does not seal it. The pause is the kindness the Antiquarian extends.",
        "The Wolf has been dead before. The Wolf has returned before. The Wolf will return again. The pattern is older than this contract.",
      ],
    },
  ],
};

/** Pick the speaker remarks for a given deceased NPC. Caller filters
 *  by which speakers are alive and present in the player's ark. */
export function getMourningRemarks(
  deceasedNpcKey: string,
): MourningRemark[] {
  return MOURNING_REMARKS[deceasedNpcKey as ResurrectableNpcKey] ?? [];
}

/** Filter remarks to a single speaker. Returns the matching MourningRemark
 *  if the (deceased, speaker) edge is authored, else undefined. The drain
 *  pipeline uses this to build per-speaker mourning feed entries. */
export function findMourningRemarks(
  deceasedNpcKey: string,
  speakerKey: string,
): MourningRemark | undefined {
  return getMourningRemarks(deceasedNpcKey).find(
    (r) => r.speaker === speakerKey,
  );
}

/** Deterministic variant pick. */
export function pickMourningVariant(
  remark: MourningRemark,
  seed: number,
): string {
  return remark.variants[Math.abs(seed) % remark.variants.length];
}

/** Coverage check for the ship-check parity gate. The lore-implied
 *  edges are: every deceased recruitable NPC has ≥ 2 speakers authored.
 *  Implementation: count deceased NPCs with len(remarks) >= 2. */
export function mourningRemarkCoverage(): {
  declared: number;
  implemented: number;
  missing: string[];
} {
  const NPCS: ResurrectableNpcKey[] = [
    "vex_solene",
    "wraith_calder",
    "locke",
    "jericho_jones",
    "akai_shi",
  ];
  const missing: string[] = [];
  let implemented = 0;
  for (const npc of NPCS) {
    const remarks = MOURNING_REMARKS[npc] ?? [];
    if (remarks.length >= 2) {
      implemented += 1;
    } else {
      missing.push(`${npc}: ${remarks.length} speakers (need ≥ 2)`);
    }
  }
  return { declared: NPCS.length, implemented, missing };
}

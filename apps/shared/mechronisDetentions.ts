/* ═══════════════════════════════════════════════════════
   MECHRONIS DETENTIONS & EXTRA CREDIT

   Follow-up beats that appear AFTER a lesson result lands.
   They are optional and cosmetic by default, but provide
   a recovery path (detention) and a bond path (extra
   credit) that lightly echo the House Cup standings.

   Flow:
     • Fail      → Detention offered. Serve it to recover a
                   small amount of approval and zero-out the
                   House-point penalty for the day.
     • Distinction → Extra Credit offered. Accept to earn a
                   minor bond with the Professor and a small
                   House-point bonus.
     • Pass / Honor → No follow-up; day ends cleanly.
   ═══════════════════════════════════════════════════════ */

export interface DetentionOffer {
  id: string;
  /** Professor id — for theming the offer's voice. */
  professorId: string;
  /** Title shown on the card. */
  title: string;
  /** Flavor prose. */
  description: string;
  /** What the player gains by accepting. */
  reward: {
    approvalDelta: number;
    /** Points added to the Professor's House if the detention is served. */
    housePointsDelta: number;
    /** Short confirmation line shown after serving. */
    resultFlavor: string;
  };
  /** What happens if declined. */
  penalty: {
    /** Short confirmation line shown after skipping. */
    resultFlavor: string;
  };
}

export interface ExtraCreditOffer {
  id: string;
  professorId: string;
  title: string;
  description: string;
  reward: {
    approvalDelta: number;
    housePointsDelta: number;
    /** Optional XP added to the dominant guild skill. */
    skillXpDelta: number;
    resultFlavor: string;
  };
}

/* ─── DETENTIONS by Professor ─── */

export const DETENTIONS: Record<string, DetentionOffer> = {
  prof_conductor: {
    id: "detention_conductor_anthem",
    professorId: "prof_conductor",
    title: "Sing the Anthem Alone",
    description:
      "Kanevas hands you a single sheet. 'Morning assembly. One voice — yours. Keep singing until the network is satisfied.'",
    reward: {
      approvalDelta: 6, housePointsDelta: 2,
      resultFlavor: "You sang. The mean held. Kanevas wrote one word in your file and showed you the back of his hand.",
    },
    penalty: {
      resultFlavor: "You skipped the anthem. Someone else sang louder to cover. They owe you a favour they will collect.",
    },
  },
  prof_watcher: {
    id: "detention_watcher_ledger",
    professorId: "prof_watcher",
    title: "Ledger Duty",
    description:
      "Aoki slides a blank notebook across the desk. 'Record every word every classmate of yours says for one week. Hand it in on Friday. We will compare it to the one they kept on you.'",
    reward: {
      approvalDelta: 5, housePointsDelta: 2,
      resultFlavor: "You wrote fairly. Aoki's eyebrows went up. 'Balanced,' he said. 'A rare defect.'",
    },
    penalty: {
      resultFlavor: "You did not write. Aoki handed you the ledger kept about YOU to read. You read it. You were very quiet the rest of the day.",
    },
  },
  prof_collector: {
    id: "detention_collector_trade",
    professorId: "prof_collector",
    title: "Return What You Took",
    description:
      "Halverez gestures to a glass case of things you do not recognize. 'One of these used to be yours. Take it back. Leave something of equal weight.'",
    reward: {
      approvalDelta: 4, housePointsDelta: 2,
      resultFlavor: "You took a locket you did not remember owning. You left a song you remembered loving. Halverez logged the trade with a faint smile.",
    },
    penalty: {
      resultFlavor: "You left empty-handed. The glass case is one item heavier the next time you pass.",
    },
  },
  prof_vortex: {
    id: "detention_vortex_door",
    professorId: "prof_vortex",
    title: "Find the Seventh Door",
    description:
      "Orphic says nothing. A card slides under your dormitory door. It reads: 'There are seven doors in the hall. Six will take you home by morning. One will not. Try them in any order.'",
    reward: {
      approvalDelta: 5, housePointsDelta: 3,
      resultFlavor: "You chose the third door. You came back. You brought the handle with you. Orphic pocketed it without comment.",
    },
    penalty: {
      resultFlavor: "You stayed in your dormitory. In the morning an eighth door had appeared. It is locked. For now.",
    },
  },
  prof_meme: {
    id: "detention_meme_rumor",
    professorId: "prof_meme",
    title: "Plant the Rumor",
    description:
      "Mireille smiles. 'You said the wrong thing aloud. Fix it by saying the RIGHT thing three times, in three different rooms, by sundown. I'll know.'",
    reward: {
      approvalDelta: 4, housePointsDelta: 2,
      resultFlavor: "You planted. By evening two classmates had repeated your words without attribution. Mireille clapped for you. Alone.",
    },
    penalty: {
      resultFlavor: "You refused. The rumor spread anyway, authored by nobody. Mireille nodded — 'You let it speak for itself. Bold.'",
    },
  },
  prof_warlord: {
    id: "detention_warlord_load",
    professorId: "prof_warlord",
    title: "Carry the Pack",
    description:
      "Kasra loads a rucksack with everyone's failed projects from the week and drops it at your feet. 'Five laps of the quad. No water. No stops. Post-good-posture.'",
    reward: {
      approvalDelta: 5, housePointsDelta: 3,
      resultFlavor: "You carried. You did not complain. Kasra nodded, which from her is a standing ovation.",
    },
    penalty: {
      resultFlavor: "You sat down on lap three. Kasra took the pack. She finished the laps with it. She did not speak to you for two days. Two days is a LOT of not-speaking, from her.",
    },
  },
  prof_politician: {
    id: "detention_politician_promise",
    professorId: "prof_politician",
    title: "Make the Promise",
    description:
      "Vellis hands you a contract. 'Sign it. It commits you to one thing you will later regret. The specifics are already filled in. You do not need to read them.'",
    reward: {
      approvalDelta: 6, housePointsDelta: 2,
      resultFlavor: "You signed. Vellis stamped it. He said: 'That was the easy part.'",
    },
    penalty: {
      resultFlavor: "You declined. Vellis kept the contract. 'We'll revisit,' he said warmly. He will.",
    },
  },
  prof_warden: {
    id: "detention_warden_smallroom",
    professorId: "prof_warden",
    title: "The Small Room",
    description:
      "Greenshaw unlocks a narrow door. 'One hour. Explain, in writing, why you broke the rule. Slip it under the door when done.'",
    reward: {
      approvalDelta: 5, housePointsDelta: 3,
      resultFlavor: "You explained. The door opened. Greenshaw had read it twice. 'Acceptable.' She kept the letter.",
    },
    penalty: {
      resultFlavor: "You wrote nothing. Greenshaw unlocked the door at sunset. She did not mention the hour. She mentioned the rule.",
    },
  },
  prof_game_master: {
    id: "detention_vex_loophole",
    professorId: "prof_game_master",
    title: "Find the Loophole",
    description:
      "Vex drops a rulebook on the desk. 'The rule you broke is on page thirty-nine. Find the exception that lets you off. You have one hour. Extra credit if the exception is yours.'",
    reward: {
      approvalDelta: 6, housePointsDelta: 3,
      resultFlavor: "You found an exception nobody had argued yet. Vex wrote it down. 'Page forty-one now,' he said.",
    },
    penalty: {
      resultFlavor: "You argued with the rule itself. Vex sighed. 'Wrong classroom. Go see Halverez.'",
    },
  },
  prof_necromancer: {
    id: "detention_vasara_return",
    professorId: "prof_necromancer",
    title: "Return From the Draft",
    description:
      "Vasara holds out a red vial. 'You died in practical. Drink. Come back. Write what you brought with you.'",
    reward: {
      approvalDelta: 5, housePointsDelta: 2,
      resultFlavor: "You came back. You wrote. Vasara read it. She did not return the page.",
    },
    penalty: {
      resultFlavor: "You stayed down. Vasara revived you anyway. 'Next time you'll want the pen,' she said.",
    },
  },
  prof_engineer: {
    id: "detention_vent_rebuild",
    professorId: "prof_engineer",
    title: "Rebuild It Better",
    description:
      "Vent drops the broken tool on your bench. 'Replace with something better. You have until the forge cools.'",
    reward: {
      approvalDelta: 5, housePointsDelta: 2,
      resultFlavor: "You rebuilt. It worked twice as well and weighed half as much. Vent grinned. 'Keep it.'",
    },
    penalty: {
      resultFlavor: "You brought back the broken one. Vent set it aside. 'It'll break again — this time on you.'",
    },
  },
  prof_human: {
    id: "detention_proctor_question",
    professorId: "prof_human",
    title: "Write One Real Question",
    description:
      "The Proctor gives you a blank card. 'One real question. Write it clearly. I will not answer. You will find the answer yourself.'",
    reward: {
      approvalDelta: 6, housePointsDelta: 3,
      resultFlavor: "You wrote it. The Proctor filed the card and wrote one word in yours. You did not see the word.",
    },
    penalty: {
      resultFlavor: "You wrote a clever question instead of a real one. The Proctor smiled thinly. 'Try again next week.'",
    },
  },
};

/* ─── EXTRA CREDIT by Professor ─── */

export const EXTRA_CREDIT: Record<string, ExtraCreditOffer> = {
  prof_conductor: {
    id: "extra_conductor_score",
    professorId: "prof_conductor",
    title: "Copy Out the Score",
    description:
      "Kanevas offers you the Harmony Book for one night. Copy any page by dawn. Your handwriting will be added to the archive.",
    reward: {
      approvalDelta: 10, housePointsDelta: 3, skillXpDelta: 8,
      resultFlavor: "Your hand is in the book. The book sings your copy when the next class reads it.",
    },
  },
  prof_watcher: {
    id: "extra_watcher_report",
    professorId: "prof_watcher",
    title: "File an Unsolicited Report",
    description:
      "Aoki leaves a blank page on your desk. 'Report anything you think we haven't seen yet. Your choice.'",
    reward: {
      approvalDelta: 10, housePointsDelta: 3, skillXpDelta: 6,
      resultFlavor: "You reported something true. Aoki wrote 'noted' in margin so fine it's almost an apology.",
    },
  },
  prof_collector: {
    id: "extra_collector_catalogue",
    professorId: "prof_collector",
    title: "Catalogue a Donation",
    description:
      "Halverez hands you an artifact nobody has logged. You may keep one thing from it: the label, the number, or the description.",
    reward: {
      approvalDelta: 8, housePointsDelta: 3, skillXpDelta: 7,
      resultFlavor: "You kept the label. The artifact is shelved with the word you wrote for it.",
    },
  },
  prof_vortex: {
    id: "extra_vortex_map",
    professorId: "prof_vortex",
    title: "Draw the Hallway",
    description:
      "Orphic asks you to draw the hallway outside your dormitory from memory. He will grade it.",
    reward: {
      approvalDelta: 9, housePointsDelta: 4, skillXpDelta: 7,
      resultFlavor: "You drew it. You drew an extra door you had not noticed. Orphic signed next to it.",
    },
  },
  prof_meme: {
    id: "extra_meme_poster",
    professorId: "prof_meme",
    title: "Seed a Poster",
    description:
      "Mireille lets you print one poster and hang it anywhere on campus. One night only.",
    reward: {
      approvalDelta: 9, housePointsDelta: 3, skillXpDelta: 6,
      resultFlavor: "You hung it. By breakfast three had copied it. By lunch one had edited it. The edit is the version that spread.",
    },
  },
  prof_warlord: {
    id: "extra_warlord_drill",
    professorId: "prof_warlord",
    title: "Lead a Drill",
    description:
      "Kasra lets you lead the morning drill for your squad. You may be wrong exactly once.",
    reward: {
      approvalDelta: 10, housePointsDelta: 4, skillXpDelta: 7,
      resultFlavor: "You were wrong once. You corrected it in three seconds. Kasra kept the drill pattern and added your name to it.",
    },
  },
  prof_politician: {
    id: "extra_politician_broker",
    professorId: "prof_politician",
    title: "Broker Two Classmates",
    description:
      "Vellis wants two rival classmates to shake hands publicly. Arrange it. He won't say why.",
    reward: {
      approvalDelta: 10, housePointsDelta: 3, skillXpDelta: 6,
      resultFlavor: "They shook. You did not smile while it happened. Vellis tapped one finger on his glass — his version of applause.",
    },
  },
  prof_warden: {
    id: "extra_warden_locksmith",
    professorId: "prof_warden",
    title: "Pick a Lock",
    description:
      "Greenshaw offers you a practice lock. Pick it without breaking it. The lock must remember you did not break it.",
    reward: {
      approvalDelta: 9, housePointsDelta: 3, skillXpDelta: 8,
      resultFlavor: "You picked it. It opened. It closed. It still remembers your hand.",
    },
  },
  prof_game_master: {
    id: "extra_vex_rule",
    professorId: "prof_game_master",
    title: "Propose a Rule",
    description:
      "Vex will let you add one rule to his classroom. You must be able to survive it.",
    reward: {
      approvalDelta: 10, housePointsDelta: 4, skillXpDelta: 7,
      resultFlavor: "You proposed. He accepted. Your rule is now law. You are its first defendant.",
    },
  },
  prof_necromancer: {
    id: "extra_vasara_attend",
    professorId: "prof_necromancer",
    title: "Attend the Draft",
    description:
      "Vasara invites you to witness a classmate's Resurrection Draft. You must not look away.",
    reward: {
      approvalDelta: 9, housePointsDelta: 3, skillXpDelta: 6,
      resultFlavor: "You did not look away. Your classmate came back. They thanked you specifically.",
    },
  },
  prof_engineer: {
    id: "extra_vent_overclock",
    professorId: "prof_engineer",
    title: "Overclock a Tool",
    description:
      "Vent lets you push a machine past its rating. If it survives, you keep the modification.",
    reward: {
      approvalDelta: 9, housePointsDelta: 3, skillXpDelta: 9,
      resultFlavor: "It survived. Vent nodded. 'You'll get a call for this later.'",
    },
  },
  prof_human: {
    id: "extra_proctor_archive",
    professorId: "prof_human",
    title: "Find the Missing Page",
    description:
      "The Proctor tells you a page is missing from the Academy archive. Find it. Do not read it. Return it sealed.",
    reward: {
      approvalDelta: 11, housePointsDelta: 4, skillXpDelta: 8,
      resultFlavor: "You found it. It was folded inside a book you owned. You returned it sealed. The Proctor nodded once.",
    },
  },
};

/* ─── HELPERS ─── */

export function getDetention(professorId: string): DetentionOffer | undefined {
  return DETENTIONS[professorId];
}

export function getExtraCredit(professorId: string): ExtraCreditOffer | undefined {
  return EXTRA_CREDIT[professorId];
}

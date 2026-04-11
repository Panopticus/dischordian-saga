/* ═══════════════════════════════════════════════════════
   APPENDIX C §C.5 — DARREN'S ARC

   Darren Fessler's entire twelve-episode arc is a single,
   awful, beautiful answer to the question written on his
   unsent resignation letter:

     "I want to make something up."

   The arc climaxes in Episode 12 with Darren invoking
   Clause 14 of the Contestant Contract — a clause he
   INVENTED the night before, in longhand, on a scrap of
   paper the Inventor's hacked camera caught — substituting
   himself for the player at the elimination.

   §C.5 also encodes the +200 Signal one-time Palimpsest
   contribution and the canonical Dischordia card that
   enters every player's collection the next time they open
   a pack: THE ASSISTANT ("Once per game, break one of your
   own rules").
   ═══════════════════════════════════════════════════════ */

export interface DarrenArcBeat {
  /** 1-based episode number. */
  episode: number;
  /** Darren's state this episode. */
  darrenIs: string;
  /** What the player can do about it. */
  playerCan: string;
  /** Signal delta from Darren's arc this episode. */
  palimpsestSignal: number;
  /** Short narrative note. */
  note: string;
}

export const DARREN_ARC_BEATS: readonly DarrenArcBeat[] = [
  {
    episode: 1,
    darrenIs:
      "A nervous bureaucrat who cites his employee badge at every opportunity.",
    playerCan: "Ignore him or be polite.",
    palimpsestSignal: 0,
    note: "First impression. He hands the player a laminated copy of his HR compliance card.",
  },
  {
    episode: 2,
    darrenIs:
      "Surprised to be still alive. Sends the player a formal thank-you email for not letting him die in Round 3.",
    playerCan: "Reply (warm / formal / ignored).",
    palimpsestSignal: 1,
    note: "+1 Signal if the reply is warm.",
  },
  {
    episode: 3,
    darrenIs:
      "Exposed on The Liar. The audience learns he has written an unpublished novel about dragons that do paperwork. He is humiliated.",
    playerCan: "Send any reply through the mailroom.",
    palimpsestSignal: 2,
    note: "+2 Signal if any reply at all.",
  },
  {
    episode: 4,
    darrenIs:
      "Watches The Auction from the audience. Writes the player a handwritten letter about his mother — a Celebration graduate who told him stories. He stopped telling stories when she died.",
    playerCan: "Read the letter.",
    palimpsestSignal: 3,
    note: "The letter is the first time Darren has been this honest on paper.",
  },
  {
    episode: 5,
    darrenIs:
      "Gets a question about his mother wrong. He knows the answer. He does not say it. Alaric glances at him.",
    playerCan: "Notice the moment.",
    palimpsestSignal: 5,
    note: "First time Darren has ever chosen to be wrong on purpose.",
  },
  {
    episode: 6,
    darrenIs:
      "In Mechronis, refuses to vote another contestant out. Penalized with a full episode of Professor Aoki's Observation Triangulation drill. He fails.",
    playerCan: "Visit him in the Ark infirmary between episodes. He is very tired.",
    palimpsestSignal: 5,
    note: "First canonical visit to Darren as a character on the Ark, not just a contestant.",
  },
  {
    episode: 7,
    darrenIs:
      "Refuses to fire the player during The Apprentice episode. First time Darren has ever refused an order from Alaric.",
    playerCan: "Offer him a cup of tea in the mailroom next week.",
    palimpsestSignal: 10,
    note: "Darren has never been offered a cup of tea by another human being.",
  },
  {
    episode: 8,
    darrenIs:
      "Writes the player a note in lipstick on the Big Brother house bathroom mirror. 'I am writing a new pamphlet. Do not read it yet.'",
    playerCan: "Not read the pamphlet.",
    palimpsestSignal: 10,
    note: "The mirror is canonically Kael's — see Appendix B. Darren does not know.",
  },
  {
    episode: 9,
    darrenIs:
      "Saves another contestant's clone from a bone-crushing pit in The Gauntlet. Uses his own body. Survives. His new clone is slightly taller. He is delighted.",
    playerCan: "Congratulate him.",
    palimpsestSignal: 15,
    note: "First time Darren has ever saved someone physically.",
  },
  {
    episode: 10,
    darrenIs:
      "Argues at the Thaloria debate for the proposition 'A being that has never told the truth can still be redeemed by telling one.' He is arguing about himself. He wins by one vote. The vote is Alaric's.",
    playerCan: "Understand that the player also voted for him.",
    palimpsestSignal: 20,
    note: "Alaric's vote is a canonical mystery. The Inventor's hack did not catch why.",
  },
  {
    episode: 11,
    darrenIs:
      "Watches himself on-screen edited into a villain in the Nathan Fielder episode. Does not protest. Sends the player a single line: 'I know you know that wasn't me. That is enough.'",
    playerCan: "Have one last meal with him in the Mess Hall.",
    palimpsestSignal: 25,
    note: "The only in-game meal Darren has ever eaten in company.",
  },
  {
    episode: 12,
    darrenIs:
      "In the Top Chef finale with Alaric and the Player as the last three. Votes the Player out first, then invokes Clause 14 of the Contestant Contract — a clause he INVENTED the night before — to substitute himself for the player at the elimination. Darren's clone is executed on camera.",
    playerCan:
      "Do nothing. The substitution is legal. The player is not permitted to stop it.",
    palimpsestSignal: 200,
    note: "The canonical +200 Signal moment. The Antiquarian writes one of the longest Chronicle entries of Year One.",
  },
];

/** §C.5 memorial card — THE ASSISTANT. */
export interface DarrenMemorialCard {
  id: string;
  name: string;
  rulesText: string;
  /** Art note — no new art is made; reuses Darren's badge render. */
  artReuse: string;
  /** Flag raised when the card enters a player's collection. */
  enteredCollectionFlag: string;
}

export const DARREN_MEMORIAL_CARD: DarrenMemorialCard = {
  id: "dischordia_the_assistant",
  name: "THE ASSISTANT",
  rulesText: "Once per game, break one of your own rules.",
  artReuse:
    "Zero new art. Card face reuses Darren's employee badge render. Every use of this card in battle is canonically Darren's one invention paying off again.",
  enteredCollectionFlag: "dischordia_the_assistant_owned",
};

/** §C.5 Episode 12 finale substitution beat. */
export interface SubstitutionBeat {
  id: "clause_14_substitution";
  /** The clause Darren invented. */
  invention: string;
  /** The sentence Darren delivered on-camera. */
  deliverySentence: string;
  /** Alaric's single quiet line after signing the paperwork. */
  alaricResponse: string;
  /** What Darren's last correct fact turned out to be. */
  lastFact: string;
  /** Flag raised on fire. */
  firedFlag: string;
}

export const CLAUSE_14_SUBSTITUTION: SubstitutionBeat = {
  id: "clause_14_substitution",
  invention:
    "A clause permitting a voluntary substitution of subject at the elimination stage, signed and witnessed by the Inventor's hacked camera.",
  deliverySentence: "I made it up.",
  alaricResponse:
    "Congratulations, Darren. You have finally written something.",
  lastFact:
    "Darren's final recited trivia — the birth date of a Celebration apprentice nobody has ever heard of — turns out to be his mother's. The next morning her file auto-unlocks in the Ark Archives. Her grave is on a Trade Empire world the player can now visit.",
  firedFlag: "darren_substitution_fired",
};

export function listDarrenArcBeats(): readonly DarrenArcBeat[] {
  return DARREN_ARC_BEATS;
}

export function getDarrenArcBeat(
  episode: number,
): DarrenArcBeat | undefined {
  return DARREN_ARC_BEATS.find((b) => b.episode === episode);
}

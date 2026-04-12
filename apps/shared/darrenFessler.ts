/* ═══════════════════════════════════════════════════════
   DARREN FESSLER — "The Assistant"

   Mid-level producer on The Palimpsest. The only crew
   member the Host can't quite read. He writes letters to
   the player between episodes, holds office hours in the
   Dreams Workshop sub-basement, and — if the player plays
   their cards right across all 13 episodes — is killed
   off-screen between Episode 11 and 12. His desk becomes
   accessible post-finale, and the final Signal Beacon
   from the Inventor carries Darren's encoded farewell.

   Voice notes: tired, earnest, tries and fails to be
   funny, writes like a man who has lost a mother. Every
   letter contains one real sentence buried in small talk.
   ═══════════════════════════════════════════════════════ */

export interface DarrenFesslerProfile {
  id: "darren_fessler";
  name: string;
  role: string;
  appearance: string;
  voice: string;
  backstory: string;
  motherName: string;
  /** Where the post-finale desk lives. */
  deskRoomKey: string;
  /** The Loredex ID for the memorial card. */
  memorialCardId: string;
}

export const DARREN_FESSLER: DarrenFesslerProfile = {
  id: "darren_fessler",
  name: "Darren Fessler",
  role: "Segment Producer, The Palimpsest (also: uncredited script doctor)",
  appearance:
    "Late 30s, perpetually tired, ill-fitting charcoal cardigan over a Palimpsest crew polo two sizes too large. Black-rimmed glasses he forgets are prescription. Carries a clipboard covered in handwritten post-its that the Host has banned from broadcast.",
  voice:
    "Apologetic, self-deprecating, writes like he's typing at 3am after a bad call with legal. Good at sentences. Bad at endings.",
  backstory:
    "Hired onto the production in Episode 1 as 'creative liaison.' Never promoted, never fired. His mother is buried in the Celebration sector cemetery near the Yellow Coats memorial — Darren visits on his one day off. He is the only crew member whose Loredex entry the Shadow Tongue has NEVER successfully edited. That anomaly will get him killed.",
  motherName: "Marguerite Fessler",
  deskRoomKey: "dreams_workshop_darrens_desk",
  memorialCardId: "card_the_assistant",
};

/* ─── EPISODE LETTERS (Appendix C §C.6) ─── */

/**
 * 12 letters, one per episode 1-12, written to the player by Darren.
 * Each has `surface` (what the Host would approve of) and `buried`
 * (one real sentence the Shadow Tongue can't quite edit). Rendered
 * in the Ark mailroom alongside player-authored content.
 */
export interface DarrenLetter {
  episode: number;
  subject: string;
  surface: string;
  buried: string;
  /** Post-episode unlock timing. */
  availableAfter: "episode_end" | "next_morning" | "week_later";
}

export const DARREN_LETTERS: DarrenLetter[] = [
  {
    episode: 1,
    subject: "Welcome aboard — ignore the coffee",
    surface:
      "Hey! Darren here, segment producer. I'm supposed to send a 'warm welcome' packet to every contestant / viewer / clone / whatever you are. Here's your warm welcome. The coffee on set is not coffee. Do not drink it.",
    buried: "If the Host tells you the audience laughed, check the applause light first.",
    availableAfter: "episode_end",
  },
  {
    episode: 2,
    subject: "Re: your round 1 answer",
    surface:
      "Production note: you answered 'The Dreamer' when the Loredex says 'The Architect.' Either you're right and the show is wrong, or you're wrong and the show is right. I'm not supposed to tell you which.",
    buried: "I'm not supposed to tell you which, but I'm telling you anyway. You were right.",
    availableAfter: "episode_end",
  },
  {
    episode: 3,
    subject: "Office hours",
    surface:
      "I hold office hours on Thursdays in the Dreams Workshop sub-basement. Nobody ever comes. Please come. Bring questions. I probably can't answer them. We'll see.",
    buried: "If you find the little blue folder on my desk, don't read it in the building.",
    availableAfter: "next_morning",
  },
  {
    episode: 4,
    subject: "My mother says hi",
    surface:
      "I visited my mom's grave yesterday. The Celebration sector is weird about maintenance. The grounds are fine, the sky is fake, and the flowers won't stay. She would have loved your debate round.",
    buried: "Her name is Marguerite. If you ever see it in the Loredex, tell me which color the ink is.",
    availableAfter: "week_later",
  },
  {
    episode: 5,
    subject: "Midpoint",
    surface:
      "We're halfway through the season. Half the writers have quit. The Host is 'refreshed.' I've been sleeping in the edit bay because the elevators stopped recognizing my badge.",
    buried: "The badge didn't stop working. They revoked it. I'm not supposed to know yet.",
    availableAfter: "episode_end",
  },
  {
    episode: 6,
    subject: "About Professor Vyre",
    surface:
      "We're bringing in a guest judge from Mechronis Academy — Professor Glinn Vyre. Red goggles, very tall, doesn't blink. I'm told he's 'thematically appropriate.' I'm told a lot of things.",
    buried: "Vyre was the Host's student. Ask him about the first time he graded an essay in red.",
    availableAfter: "next_morning",
  },
  {
    episode: 7,
    subject: "Safe point",
    surface:
      "You made it past the midpoint safe zone. Producers usually buy contestants a small cake here. Budget cuts — you get an email. This email. Sorry.",
    buried: "The safe point is not safe. It is just the place where the Host rests between kills.",
    availableAfter: "episode_end",
  },
  {
    episode: 8,
    subject: "Loredex corrections",
    surface:
      "Attached: a list of Loredex entries that I think are wrong. I'm cc-ing the Antiquarian's office. I do not expect a reply. I never get a reply. I keep sending them.",
    buried: "I keep sending them because the entries change the next morning. Only mine stay.",
    availableAfter: "week_later",
  },
  {
    episode: 9,
    subject: "The casualty crawl",
    surface:
      "They asked me to proofread the casualty crawl before broadcast. I counted six names. They broadcast eleven. I don't know where the other five came from. I am asking. Nobody is answering.",
    buried: "One of the extra names was a woman I used to date in college. She died six years ago.",
    availableAfter: "episode_end",
  },
  {
    episode: 10,
    subject: "Debate night",
    surface:
      "Episode 10 is the full debate on the Thaloria stage. General Alaric is confirmed. If he 'Objects,' the ruling goes to the Host. Please do not agree with Alaric even when he's right. Especially then.",
    buried: "Alaric is wearing Shadow Tongue colors under the coat. Look at his cufflinks.",
    availableAfter: "next_morning",
  },
  {
    episode: 11,
    subject: "I might be late to Episode 12",
    surface:
      "Production is moving Episode 12 up by a day. I have a dentist appointment I cannot reschedule. If I don't make the taping, please remind the Host that the cold open uses the B-roll from the Mechronis cafeteria, not the A-roll. This is important. I have told him. He forgets.",
    buried: "I do not have a dentist appointment. I just wanted you to know I planned to come.",
    availableAfter: "episode_end",
  },
  {
    episode: 12,
    subject: "[UNSENT — DRAFTS FOLDER]",
    surface:
      "[The letter is in Darren's drafts folder. He never sent it. The mailroom shows it only after the player visits his desk post-finale.]",
    buried:
      "If you are reading this, I did not make it. The Inventor has my notes. The notes are in the blue folder on my desk. I loved working on the show. I loved my mother. I loved that you answered 'The Dreamer' in Episode 2. I think you were right. — D.F.",
    availableAfter: "week_later",
  },
];

/* ─── OFFICE HOURS DIALOG (Appendix C §C.6.a) ─── */

export interface OfficeHoursLine {
  episode: number;
  playerCue: string;
  darrenResponse: string;
  /** Whether this line grants +1 Signal when the player chooses the truthful reply. */
  signalOnTruth: boolean;
}

export const DARREN_OFFICE_HOURS: OfficeHoursLine[] = [
  {
    episode: 1,
    playerCue: "So what do you actually do here?",
    darrenResponse:
      "Officially? Segment producer. Unofficially? I hold the clipboard the Host isn't allowed to see. I'm the guy who writes down the things that don't make the broadcast.",
    signalOnTruth: true,
  },
  {
    episode: 3,
    playerCue: "The Host scares me.",
    darrenResponse:
      "He scares me too. I'm more scared of the fact that I'm getting used to him. Don't get used to him. That's how they get you.",
    signalOnTruth: true,
  },
  {
    episode: 6,
    playerCue: "Why did you hire Professor Vyre?",
    darrenResponse:
      "I didn't. I was told. I'm told a lot of things. Legal says I'm not allowed to say more. If you ask Vyre himself, tell him 'Darren from the cafeteria' says hi. He'll know.",
    signalOnTruth: true,
  },
  {
    episode: 9,
    playerCue: "Are we going to die out there?",
    darrenResponse:
      "I don't know. I don't want to know. Here's what I do know: if you finish the show, my notes go in the mailroom. If I finish the show, I'll hand them to you myself. Either way, you get the notes.",
    signalOnTruth: true,
  },
  {
    episode: 11,
    playerCue: "Darren, are YOU going to die?",
    darrenResponse:
      "Probably. Look, it's a long-running show. Someone has to. I'd rather it be me than you. Don't argue. I already ran the numbers.",
    signalOnTruth: true,
  },
];

/* ─── HELPERS ─── */

export function getLetterForEpisode(episode: number): DarrenLetter | undefined {
  return DARREN_LETTERS.find((l) => l.episode === episode);
}

export function getOfficeHoursForEpisode(episode: number): OfficeHoursLine | undefined {
  return DARREN_OFFICE_HOURS.find((l) => l.episode === episode);
}

/** Is Darren dead in the player's timeline? True after Episode 11 concludes. */
export function isDarrenGone(episodesCompleted: number): boolean {
  return episodesCompleted >= 11;
}

/** The only way to read the unsent Episode 12 draft. */
export function canReadUnsentDraft(episodesCompleted: number, visitedDesk: boolean): boolean {
  return episodesCompleted >= 12 && visitedDesk;
}

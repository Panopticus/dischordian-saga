/* ═══════════════════════════════════════════════════════
   APPENDIX C §C.6 — THE HOST IS THE MEME

   Episode 13 face-scroll reveal. The whole season has been
   engineering this single reveal: the Host of The Palimpsest
   has been the Meme the entire time, wearing the Game Master
   mask on live television for twelve weeks.

   Canonical basis: Lore Bible §234-258 — The Meme is the
   fifth Archon, shapeshifting, and has already
   impersonated the White Oracle. Appendix C adds: it has
   also impersonated the Game Master, on live TV.

   This file encodes:
     - The face-scroll sequence (the faces the Meme cycles
       through in rapid order)
     - The Meme's three-sentence monologue after the scroll
     - The §C.6 "Game Masters plural" clarification (dead GM,
       Meme wearing GM, Academy Professor Glinn Vyre)
   ═══════════════════════════════════════════════════════ */

/** The order of faces the Host's face scrolls through. */
export interface FaceScrollFrame {
  /** 1-based order in the scroll. */
  order: number;
  /** Which face is shown. */
  face: string;
  /** Optional narrative note. */
  note?: string;
  /** Held for how long (ms). */
  holdMs: number;
}

export const HOST_FACE_SCROLL: readonly FaceScrollFrame[] = [
  {
    order: 1,
    face: "The Game Master (current mask)",
    note: "The face the player has been watching for twelve weeks.",
    holdMs: 200,
  },
  {
    order: 2,
    face: "The White Oracle (Lore Bible canon)",
    note: "The reveal the player was never going to spoil to themselves.",
    holdMs: 200,
  },
  { order: 3, face: "The Jailer", holdMs: 150 },
  { order: 4, face: "The Prisoner", holdMs: 150 },
  { order: 5, face: "The Oracle", holdMs: 150 },
  {
    order: 6,
    face: "The Recruiter (Kael before the scars)",
    note: "The player's breath catches. That is Kael.",
    holdMs: 250,
  },
  {
    order: 7,
    face: "An ordinary face the player does not recognize",
    holdMs: 150,
  },
  {
    order: 8,
    face: "Elara",
    note: "Every narrator dismisses this immediately — the Meme could never hold the mask, but the fact that it TRIED is more terrifying than any of the other frames.",
    holdMs: 300,
  },
  {
    order: 9,
    face: "The Human",
    note: "Same thing. The Meme is showing off.",
    holdMs: 300,
  },
  {
    order: 10,
    face: "The player's own chosen avatar",
    note: "Held for a full second. The Meme is answering the question nobody has asked yet: 'Could I be you?' The answer is yes.",
    holdMs: 1000,
  },
  {
    order: 11,
    face: "The Meme's true face",
    note: "A pulsing, rapidly-mutating internet meme aesthetic that defies photographic stability. A chaotic layered composite of every image the player has seen in the game up to this point.",
    holdMs: 3000,
  },
];

/** The three true things the Meme says after the scroll. */
export const MEME_MONOLOGUE_BEATS: readonly {
  order: number;
  beat: string;
}[] = [
  {
    order: 1,
    beat:
      "The Inventor was right. Alaric is the Shadow Tongue, and the Shadow Tongue has been editing everything you've read for twelve weeks.",
  },
  {
    order: 2,
    beat:
      "The Game Master, the real Game Master, has been dead for sixteen thousand years. You have been watching me wear him.",
  },
  {
    order: 3,
    beat:
      "I have done this before. I am doing it again in a different room. You will meet the man I am pretending to be, and you will trust him, and you will be wrong. His robes are white. Count the pulses in his halo. They are the same pulses in my voice right now. Listen carefully. You will not be warned twice.",
  },
];

/** The envelope cut after the monologue. */
export const EPISODE_13_ENVELOPE = {
  droppedOn: "the_stage_floor",
  addressedTo: "the_players_real_account_name",
  contents: "A single blank page with small print at the bottom: 'TO BE CONTINUED IN THE ORACLE'S ROOM.'",
  /** Flag raised when the envelope cut plays. */
  firedFlag: "palimpsest_ep13_envelope_seen",
} as const;

/** §C.6 Game Masters plural clarification. */
export type GameMasterId =
  | "gm_dead"
  | "gm_meme_wearing"
  | "gm_academy_professor";

export interface GameMasterEntry {
  id: GameMasterId;
  label: string;
  status: "dead" | "worn_by_meme" | "academy_professor";
  description: string;
}

export const PALIMPSEST_GAME_MASTERS: readonly GameMasterEntry[] = [
  {
    id: "gm_dead",
    label: "The real Game Master",
    status: "dead",
    description:
      "Canonically killed Day 15 of Dominion, Year 620 A.A. (Lore Bible §682). His Matrix of Dreams still runs. His Goggles are still in the Hierarchy's vault.",
  },
  {
    id: "gm_meme_wearing",
    label: "The Host of The Palimpsest",
    status: "worn_by_meme",
    description:
      "The on-screen villain of Appendix C. The Meme wearing the Game Master mask publicly, for twelve weeks.",
  },
  {
    id: "gm_academy_professor",
    label: "Professor Glinn Vyre",
    status: "academy_professor",
    description:
      "The Academy's Lecturer in Adversarial Structures. The Mechronis Academy's third Game Master — a Professor programmed after the real Game Master's death. Shows up in one between-episode scene in Episode 6 as a guest judge. Grades Darren harshly. The Meme visibly bristles when he steps into frame because the Meme does not like being reminded the man he is wearing is dead.",
  },
];

export function listPalimpsestGameMasters(): readonly GameMasterEntry[] {
  return PALIMPSEST_GAME_MASTERS;
}

export function listHostFaceScroll(): readonly FaceScrollFrame[] {
  return HOST_FACE_SCROLL;
}

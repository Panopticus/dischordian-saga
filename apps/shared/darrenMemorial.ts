/* ═══════════════════════════════════════════════════════
   DARREN MEMORIAL REGISTRY

   Post-Episode-12 unlocks tied to Darren Fessler's death:
     • THE ASSISTANT — a Dischordia card honoring Darren
     • The Inventor's final Signal Beacon (post-finale)
     • Darren's desk interactable room in the Dreams Workshop
     • Cryo Dreams "finish Darren's half-scenarios" hook

   This module is the single source of truth for anything
   that commemorates Darren in-game. Other routers and UI
   components read from here so gating stays consistent.
   ═══════════════════════════════════════════════════════ */

import { DARREN_FESSLER } from "./darrenFessler";
import { THE_INVENTOR } from "./theInventor";

import { assetUrl } from "../client/src/lib/assetUrl";
/* ─── THE ASSISTANT CARD ─── */

export interface MemorialCard {
  id: string;
  name: string;
  subtitle: string;
  rarity: "memorial" | "legendary" | "mythic";
  archetype: string;
  /** Reuses an existing art asset — no new render required. */
  artAsset: string;
  flavorText: string;
  /** Stats scale with the player's current Signal meter. */
  scalingStat: "signal";
  baseCost: number;
  baseAttack: number;
  baseHealth: number;
  /** The ability description shown on the card. */
  ability: string;
  unlockCondition: "episode_12_completed";
}

export const THE_ASSISTANT_CARD: MemorialCard = {
  id: DARREN_FESSLER.memorialCardId, // "card_the_assistant"
  name: "THE ASSISTANT",
  subtitle: "In memoriam — Darren Fessler",
  rarity: "memorial",
  archetype: "control_architect",
  artAsset: assetUrl("art/crew/darren-fessler-badge.png"),
  flavorText:
    "He held the clipboard the Host was not allowed to see. Play him only when you need a record of what actually happened.",
  scalingStat: "signal",
  baseCost: 4,
  baseAttack: 2,
  baseHealth: 5,
  ability:
    "Witness: At the end of your turn, if your Palimpsest Signal is higher than your Noise, draw one card. Otherwise, your opponent draws one card. The Chronicle still writes itself.",
  unlockCondition: "episode_12_completed",
};

/* ─── INVENTOR'S POST-FINALE SIGNAL BEACON ─── */

export interface CanonicalBeacon {
  id: string;
  roomKey: string;
  authorDisplay: string;
  message: string;
  /** Uses the same cipher format as the Kael Fragment beacons. */
  cipher: "kael_fragment" | "plain";
  unlockCondition: "episode_12_completed";
  /** Never expires. */
  permanent: boolean;
}

export const INVENTOR_FINAL_BEACON: CanonicalBeacon = {
  id: "beacon_inventor_final",
  roomKey: "archives_reading_room",
  authorDisplay: "—I.",
  message: THE_INVENTOR.postFinaleBeacon,
  cipher: "kael_fragment",
  unlockCondition: "episode_12_completed",
  permanent: true,
};

/* ─── DARREN'S DESK (Dreams Workshop sub-basement) ─── */

export interface InteractableDesk {
  id: string;
  roomKey: string;
  parentRoom: string;
  label: string;
  description: string;
  unlockCondition: "episode_12_completed";
  /** What the player finds on interaction. */
  contents: {
    blueFolderId: string;
    unsentLetterId: string;
    polaroid: string;
    postIts: string[];
  };
}

export const DARRENS_DESK: InteractableDesk = {
  id: DARREN_FESSLER.deskRoomKey, // "dreams_workshop_darrens_desk"
  roomKey: "dreams_workshop_darrens_desk",
  parentRoom: "dreams_workshop_subbasement",
  label: "Darren's Desk",
  description:
    "A cluttered metal desk at the back of the Dreams Workshop sub-basement. Post-it notes cover the lamp. The blue folder the Host banned from broadcast is on top. A polaroid of a woman with the same eyes as Darren is tucked into the corkboard. You realize you are the first visitor since he stopped coming to work.",
  unlockCondition: "episode_12_completed",
  contents: {
    blueFolderId: "darren_blue_folder",
    unsentLetterId: "darren_letter_ep_12_unsent",
    polaroid:
      "Marguerite Fessler, Celebration Sector Cemetery, 14 years before the Fall. Her handwriting on the back says 'Don't forget to eat, D.'",
    postIts: [
      "If the Host says the audience laughed, CHECK THE APPLAUSE LIGHT.",
      "Professor Vyre grades in red for a reason.",
      "Alaric's left cufflink. LEFT. Not right.",
      "Call the Antiquarian back.",
      "Marguerite's birthday is Thursday.",
      "Leave earlier tonight.",
    ],
  },
};

/* ─── CRYO DREAMS: DARREN'S HALF-FINISHED SCENARIOS ─── */

export interface UnfinishedCryoScenario {
  id: string;
  title: string;
  halfText: string;
  darrensNote: string;
  /** When the player finishes it, the credit line reads "story by [player] and Darren Fessler." */
  requiresPlayerCompletion: boolean;
}

export const DARRENS_UNFINISHED_CRYO_DREAMS: UnfinishedCryoScenario[] = [
  {
    id: "cryo_darren_01",
    title: "The Long Elevator",
    halfText:
      "I dreamed of an elevator that went down past every floor of the Ark and kept going. At floor -42 the doors opened onto a classroom. My mother was the teacher. She did not remember me but was kind anyway. The blackboard said —",
    darrensNote: "I couldn't finish this one. I hope you can.",
    requiresPlayerCompletion: true,
  },
  {
    id: "cryo_darren_02",
    title: "The Applause Light",
    halfText:
      "I dreamed the Host finally let me sit in the audience. The applause light came on and I clapped and clapped and clapped and when I looked at my hands they were —",
    darrensNote: "The ending I wrote was too mean. Please write something kinder.",
    requiresPlayerCompletion: true,
  },
  {
    id: "cryo_darren_03",
    title: "The Cafeteria at 3am",
    halfText:
      "I dreamed I was the last person in the Mechronis cafeteria and Professor Vyre sat down across from me and said 'Darren from the cafeteria, I remember you,' and I —",
    darrensNote: "I never got past 'I.' Sorry. Love, D.",
    requiresPlayerCompletion: true,
  },
];

/* ─── GATING HELPERS ─── */

export function isMemorialUnlocked(episodesCompleted: number): boolean {
  return episodesCompleted >= 12;
}

export function getMemorialUnlocks(episodesCompleted: number): {
  card: MemorialCard | null;
  beacon: CanonicalBeacon | null;
  desk: InteractableDesk | null;
  cryoDreams: UnfinishedCryoScenario[];
} {
  if (!isMemorialUnlocked(episodesCompleted)) {
    return { card: null, beacon: null, desk: null, cryoDreams: [] };
  }
  return {
    card: THE_ASSISTANT_CARD,
    beacon: INVENTOR_FINAL_BEACON,
    desk: DARRENS_DESK,
    cryoDreams: DARRENS_UNFINISHED_CRYO_DREAMS,
  };
}

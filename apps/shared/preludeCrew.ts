/* ═══════════════════════════════════════════════════════
   PRELUDE CREW — §2.4 starter crew data shell.

   Three crew members the player recovers during the Prelude
   cleaning sequence. Each has a Bond meter, dialog lines,
   and a specific narrative function:

     Patch       — DeMagi engineer. Unlocks the crafting bench
                   (§6.2) and the engineering repair minigame.
     Zephyr-9    — Quarchon ship-core fragment. Unlocks the
                   Trade Empire navigation layer and the Chess
                   minigame (§6.3).
     Little One  — Ne-Yon child. Unlocks the Pet Garden room
                   (§2.5) and the first pet.

   Runtime: the crew-rescue away-missions run through
   `apps/client/src/components/prelude/PreludeMissionRunner.tsx`,
   which walks the three canonical §2.6 missions
   (defined in `preludeCrewMissions.ts`). Each mission's
   flagsOnSuccess feeds the GameContext narrative-flag
   store, so rescued crew persist across sessions and
   Loredex entries unlock on completion.
   ═══════════════════════════════════════════════════════ */

export type PreludeCrewRole = "engineer" | "navigator" | "child";

export interface PreludeCrewMember {
  id: "patch" | "zephyr_9" | "little_one";
  name: string;
  /** Species id matching shared/factionNPCs.ts conventions. */
  species: "demagi" | "quarchon" | "ne_yon";
  role: PreludeCrewRole;
  /** Room where the player finds the crew member during §2.2 cleaning. */
  foundIn: "medical_bay" | "engineering" | "armory";
  /** Room where the crew member lives once rescued. */
  defaultRoom: "engineering" | "bridge" | "pet_garden";
  /** Bond threshold tiers this crew member reports. */
  bondTiers: { threshold: number; label: string }[];
  /** System or minigame this crew member unlocks on rescue. */
  unlocks: string[];
  /** Opening dialog lines when first brought aboard. */
  openingLines: string[];
  /** Jury-style reactions to the §13 Yin/Yang arguments. */
  juryReactions: string[];
}

export const PRELUDE_CREW: Record<"patch" | "zephyr_9" | "little_one", PreludeCrewMember> = {
  patch: {
    id: "patch",
    name: "Patch",
    species: "demagi",
    role: "engineer",
    foundIn: "medical_bay",
    defaultRoom: "engineering",
    bondTiers: [
      { threshold: 20, label: "He lets you watch him work." },
      { threshold: 40, label: "He lets you touch the bench." },
      { threshold: 60, label: "He tells you the bench isn't his." },
      { threshold: 80, label: "He tells you whose it is." },
    ],
    unlocks: ["crafting_bench", "engineering_repair_minigame"],
    openingLines: [
      "The bench in Engineering is humming. I didn't tell it to. It's been humming for longer than we've been alive.",
      "I know DeMagi runes. I know Ne-Yon sigils. I know whatever this lattice is doing. Stop asking me who made it. I will tell you when I am ready.",
    ],
    juryReactions: [
      "Elara is right about the numbers. The Human is right about the names. Nobody is right about what to do next.",
      "I fix things. I do not forgive things. Don't ask me which of them to trust — ask me which bolt you want me to tighten.",
    ],
  },

  zephyr_9: {
    id: "zephyr_9",
    name: "Zephyr-9",
    species: "quarchon",
    role: "navigator",
    foundIn: "engineering",
    defaultRoom: "bridge",
    bondTiers: [
      { threshold: 20, label: "She computes silently." },
      { threshold: 40, label: "She computes out loud for you." },
      { threshold: 60, label: "She asks your name. She already knew it." },
      { threshold: 80, label: "She plays chess with you and loses on purpose." },
    ],
    unlocks: [
      "trade_empire_navigation_layer",
      "chess_minigame",
      "starfield_projection",
    ],
    openingLines: [
      "Quarchon do not play chess. We compute its continuations. But I have noticed that organic minds think better when they are told they are playing. So. You are playing. Sit.",
      "I am a ship-core fragment. I am not the ship. The ship is older than me. She listens to me when I am polite. I have been polite for a long time.",
    ],
    juryReactions: [
      "Elara wants the galaxy to survive. The Human wants to be honest. Both of those are compute-expensive.",
      "I am neutral. Neutral is a choice. Neutral was my mother's choice and it killed her. Ask me again in three moves.",
    ],
  },

  little_one: {
    id: "little_one",
    name: "Little One",
    species: "ne_yon",
    role: "child",
    foundIn: "armory",
    defaultRoom: "pet_garden",
    bondTiers: [
      { threshold: 20, label: "She offers you the pet egg." },
      { threshold: 40, label: "She holds your hand in the corridor." },
      { threshold: 60, label: "She names the pet." },
      { threshold: 80, label: "She speaks her first word. It is not your name." },
    ],
    unlocks: ["pet_garden_room", "starter_pet", "pet_breeding_dynasty"],
    openingLines: [
      "(She does not speak. She holds out a pet egg. The egg is warm. The Armory lights up when she walks in.)",
      "(The egg hatches as soon as you bring her to the Mess Hall. The pet imprints in ninety-three seconds. Lyra Vox would time it later.)",
    ],
    juryReactions: [
      "(She watches the two narrators argue. She watches you decide which one to agree with. She does not take a side. She takes your hand.)",
    ],
  },
};

/** Return every crew member in a stable order (as listed in §2.4). */
export function listPreludeCrew(): PreludeCrewMember[] {
  return [PRELUDE_CREW.patch, PRELUDE_CREW.zephyr_9, PRELUDE_CREW.little_one];
}

/** Get a crew member by id. */
export function getPreludeCrewMember(
  id: "patch" | "zephyr_9" | "little_one",
): PreludeCrewMember {
  return PRELUDE_CREW[id];
}

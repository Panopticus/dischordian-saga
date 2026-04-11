/* ═══════════════════════════════════════════════════════
   MOBILE NARRATOR DIALOG — §13 Yin/Yang Dialog Matrix

   Seed lines for the §1.2 floating narrator slot. Each
   room gets a small set of paired lines — one voice
   from Elara, one from The Human — tagged with the
   trust tier at which the line unlocks.

   Trust tiers (§1.3):
     F = functional   (always available, no trust gate)
     P = professional (bond ≥ 20)
     H = honest       (bond ≥ 40)
     V = vulnerable   (bond ≥ 60)
     D = devoted      (bond ≥ 80)

   These are SEED lines, not a final script. They exist
   so the narrator slot has something to say from day
   one. Content writers expand them later.
   ═══════════════════════════════════════════════════════ */

import type { NarratorId, NarratorRoomId } from "./mobileNarrator";

export type TrustTier = "F" | "P" | "H" | "V" | "D";

export interface NarratorLine {
  tier: TrustTier;
  text: string;
  /**
   * Optional forcing-flag tag. When present, the line ONLY fires
   * if the given flag is in the active beat set. Used for scripted
   * narrative moments like the §2.7 Archives opener.
   */
  beatFlag?: string;
}

export interface RoomDialogSet {
  roomId: NarratorRoomId;
  elara: NarratorLine[];
  the_human: NarratorLine[];
}

/** The minimum bond score that unlocks a given trust tier. */
export const TRUST_TIER_MIN_BOND: Record<TrustTier, number> = {
  F: 0,
  P: 20,
  H: 40,
  V: 60,
  D: 80,
};

/**
 * The §13 Yin/Yang Dialog Matrix as data. Ordered so the highest
 * tier the player qualifies for is picked first when the slot
 * draws a line.
 *
 * Every line here is a direct quotation from §13.1–§13.13 of the
 * Witnessing Narrative Proposal. Keep them verbatim — they're the
 * canonical voice reference.
 */
export const NARRATOR_DIALOG: Record<NarratorRoomId, RoomDialogSet> = {
  bridge: {
    roomId: "bridge",
    elara: [
      { tier: "F", text: "This is my post. I keep this chair warm for a captain who may never come." },
      { tier: "P", text: "The starfield reminds me of a window I used to have. I can't remember the city it looked out on." },
      {
        tier: "V",
        text: "I was the one who pinned the curtains back every morning. I used to think that if I could keep the light in, I could keep the dark out. The curtains are not a metaphor. The dark came anyway.",
      },
      {
        tier: "D",
        text: "This chair used to be the most powerful seat in a hundred worlds. I sat in similar ones. They always made the people sitting in them smaller, not bigger. I'm not going to sit in this one. You are.",
      },
    ],
    the_human: [
      { tier: "F", text: "She's lying about the chair. It's nobody's chair. She sits in it because she misses sitting." },
      {
        tier: "P",
        text: "Atarion. She had a senator's apartment with a view of the Crystal Spires. I know because I walked past that apartment seventeen times during an investigation I never told her about.",
      },
      {
        tier: "V",
        text: "The investigation I didn't tell her about — I was trying to protect her. I was trying to protect her from me. I didn't succeed at either.",
      },
      {
        tier: "D",
        text: "Sit down, Captain. She means it. She's never meant anything harder in her life, and I've been listening to her for longer than you've been alive.",
      },
    ],
  },

  cryo_bay: {
    roomId: "cryo_bay",
    elara: [
      {
        tier: "F",
        text: "All but one pod is empty. The one that wasn't is yours. Don't ask me who was supposed to be in the others. I can't tell you.",
      },
      {
        tier: "P",
        text: "I counted the pods one hundred and sixty-eight times before you woke up. I kept hoping the count was wrong.",
      },
      { tier: "H", text: "There were supposed to be twelve Potentials in this bay. The other eleven were never loaded. I think I chose." },
    ],
    the_human: [
      { tier: "F", text: "She can. She just won't. Ask her again in three rooms." },
      {
        tier: "P",
        text: "The count was never wrong. The manifest was. Someone edited it before we launched. I have a name. I'll tell you when it matters.",
      },
      { tier: "H", text: "She didn't. The Warlord did. Elara — you were a senator. You had no hand in loading Arks." },
    ],
  },

  medical_bay: {
    roomId: "medical_bay",
    elara: [
      { tier: "F", text: "Blood on the wall from the construction era. Old. I've tried to clean it. It won't come off." },
      { tier: "V", text: "Tell me the name." },
    ],
    the_human: [
      {
        tier: "F",
        text: "It won't come off because it's not blood. It's marker. Someone wrote a name in it. The years have eaten the letters. I can still read them.",
      },
      { tier: "V", text: "No." },
    ],
  },

  comms_array: {
    roomId: "comms_array",
    elara: [
      { tier: "F", text: "Don't touch the substrate layer. It's load-bearing. Everything I am runs on the substrate layer." },
      { tier: "P", text: "That's not funny." },
    ],
    the_human: [
      { tier: "F", text: "Which is why she's afraid of me. I live there." },
      { tier: "P", text: "It wasn't a joke." },
    ],
  },

  observation_deck: {
    roomId: "observation_deck",
    elara: [
      {
        tier: "F",
        text: "The starfield through this window used to be a starfield. Some of those constellations aren't there anymore. I can show you which ones, if you want.",
      },
      {
        tier: "H",
        text: "I watched a sector go dark last week. Just… dim. Then out. Then gone. I logged it. Do you want to know the sector's name? I memorized it because I'm the only one left who will.",
      },
    ],
    the_human: [
      {
        tier: "F",
        text: "I used to stand at a window like this in New Babylon. Different stars. Same habit. It's easier to think with your back to the room.",
      },
      { tier: "H", text: "Tell the player. They earned the sector's name." },
    ],
  },

  armory: {
    roomId: "armory",
    elara: [
      {
        tier: "F",
        text: "The weapons here are older than the Fall. Some of them I recognize from treaty talks. I argued against ratifying a ban on three of them. I was on the wrong side.",
      },
      { tier: "V", text: "There's a difference?" },
    ],
    the_human: [
      { tier: "F", text: "She was on the losing side. Not the wrong side." },
      { tier: "V", text: "I made a career on the difference. It stopped meaning what I wanted it to mean about fifty years in." },
    ],
  },

  engineering: {
    roomId: "engineering",
    elara: [
      { tier: "F", text: "The reactor hums differently when you're in here. I don't know why." },
      { tier: "H", text: "You keep saying 'the Engineer' like you knew him." },
    ],
    the_human: [
      { tier: "F", text: "The reactor was built by the Engineer. She's humming because she recognizes a Potential." },
      {
        tier: "H",
        text: "I did. I do. He's still alive. You signed the memo that said he wasn't. Don't cry — we're going to get him back before this is over.",
      },
    ],
  },

  archives: {
    roomId: "archives",
    elara: [
      {
        tier: "F",
        text: "The archive reads itself. The documents rewrite slightly every time you look away. I thought I was going mad. I wasn't.",
      },
      {
        tier: "P",
        text: "I signed things I didn't read once. I am trying very hard not to do that in this room.",
      },
      {
        tier: "H",
        text: "Some of the records here have my name on them. I don't remember writing them. The handwriting is mine.",
      },
    ],
    the_human: [
      {
        tier: "F",
        text: "It's the Shadow Tongue. It's been in the walls of this ship since construction. It edits. Slowly. I've been fighting it back, line by line, in the margins. Sometimes I lose a paragraph. I try to remember what it said.",
      },
      {
        tier: "P",
        text: "I read things I didn't sign once. There's a symmetry to it I find annoying.",
      },
      {
        tier: "H",
        text: "That's because they were written by the Shadow Tongue wearing your face. I've been deleting lines when I catch them. Don't thank me. It's what I'd want.",
      },
      // §2.7 — the Archives opener moment. Beat-tagged so it only
      // fires when the burnt Seer's card has just been recovered
      // and the player walks into Archives for the first time.
      {
        tier: "F",
        beatFlag: "engineer_hook_active_opener",
        text: "She means the Engineer. He was my classmate. Sit down — this is the part where I tell you something I haven't told anyone in a thousand years.",
      },
    ],
  },

  cargo_bay: {
    roomId: "cargo_bay",
    elara: [
      { tier: "F", text: "An old delivery crate. Label says Free Ports, overdue by 1,047 years. Fascinating." },
      { tier: "F", text: "I already did. There's a tarot card inside. Burnt edges. The seventeenth one we've found. Somebody is leaving a trail." },
    ],
    the_human: [
      { tier: "F", text: "Open it." },
      { tier: "F", text: "Somebody is leaving a trail for us." },
    ],
  },

  pet_garden: {
    roomId: "pet_garden",
    elara: [
      { tier: "F", text: "The child's pet. Little One's pet. It imprinted on you within the first hour. That's unusual." },
      { tier: "V", text: "I don't know how to love a living thing anymore. I talk to the pet. I pretend I'm talking to a constituent." },
    ],
    the_human: [
      { tier: "F", text: "That's not unusual. That's chosen." },
      { tier: "V", text: "That's how you love a living thing, Senator. I'm not kidding." },
    ],
  },

  memorial_corridor: {
    roomId: "memorial_corridor",
    elara: [
      { tier: "H", text: "Every plaque is empty. Is that because we forgot? Or because we hadn't earned a name yet?" },
      {
        tier: "V",
        text: "I thought I was the only one who had lost people. Every plaque here is someone else's grief. I've been standing alone in other people's loss.",
      },
    ],
    the_human: [
      {
        tier: "H",
        text: "Both. The universe withholds names until you've earned them. The Engineer didn't have a name when I met him. He earned it by the end. He earned two more after the end.",
      },
      {
        tier: "V",
        text: "Stand with me. I've done this longer than you have. I'll teach you which ones to salute and which ones to leave alone.",
      },
    ],
  },

  // ── Rooms without §13 canon — written in the §13 voice ──
  // These three rooms are not canonicalized in §13. The lines
  // below are written in the same voice the proposal establishes,
  // following §13's explicit invitation to expand the seed set.
  trade_hub: {
    roomId: "trade_hub",
    elara: [
      { tier: "F", text: "Locke's office. Don't sit where the light falls. She reads posture like a ledger." },
      {
        tier: "P",
        text: "Locke grew up writing contracts in her head for fun. She'll test your grammar. Speak carefully.",
      },
      {
        tier: "H",
        text: "I knew her family on Atarion. They were decent people. Her mother hated politicians. I used to agree.",
      },
    ],
    the_human: [
      { tier: "F", text: "She's not wrong. Don't sit where the light falls." },
      {
        tier: "P",
        text: "She grew up writing exit clauses. Don't let her draft yours.",
      },
      {
        tier: "H",
        text: "Her mother hated politicians because of you. Specifically. Don't bring it up.",
      },
    ],
  },

  trophy_room: {
    roomId: "trophy_room",
    elara: [
      { tier: "F", text: "An empty pedestal for every version of you we haven't seen yet." },
      {
        tier: "P",
        text: "I don't understand the impulse to hoard victories. I never had to. The victories I wanted came back around every election cycle.",
      },
      {
        tier: "H",
        text: "Did you ever lose a case?",
      },
    ],
    the_human: [
      { tier: "F", text: "Or every one we already have, scrubbed. I haven't decided which." },
      {
        tier: "P",
        text: "I understand it perfectly. Every closed case is a coin you spend once and then try to remember the taste of.",
      },
      {
        tier: "H",
        text: "Every case. That's the job. The ones you hold onto are the ones you meant to lose.",
      },
    ],
  },

  captains_quarters: {
    roomId: "captains_quarters",
    elara: [
      { tier: "F", text: "Your bunk. Your terminal. Your handful of letters to no one in particular. It's a lot for one person." },
      {
        tier: "P",
        text: "A captain's quarters should feel lived in. This one feels curated. I think you've been trying to look the part.",
      },
      {
        tier: "H",
        text: "You've been sleeping less. I know because I can see the logs. Don't tell me you're fine.",
      },
    ],
    the_human: [
      { tier: "F", text: "It's not for one person. I read the letters at night. Don't be angry. Somebody had to." },
      {
        tier: "P",
        text: "Curated is fine. The part is real now. Whatever you looked like when you started, you are the person sitting in this chair at 0200 reading the logs I don't think you're supposed to have.",
      },
      {
        tier: "H",
        text: "She can't sleep either. Neither of us can. We're holograms and even we remember how tired means.",
      },
    ],
  },
};

/**
 * Pick the highest-tier line available to the player for a given
 * (room, narrator, bond) combination, optionally respecting active
 * beat flags.
 *
 * Selection order:
 *   1. If any line has a `beatFlag` that's in `activeBeats` AND
 *      the player's bond meets the line's tier, return it. This
 *      is how scripted narrative moments (e.g. §2.7 Archives
 *      opener) override normal dialog selection.
 *   2. Otherwise, filter to non-beat-tagged lines and pick the
 *      highest tier the player has unlocked.
 *
 * Returns `null` if neither bucket has a match.
 */
export function pickNarratorLine(
  roomId: NarratorRoomId,
  narratorId: NarratorId,
  bond: number,
  activeBeats?: ReadonlySet<string>,
): NarratorLine | null {
  const set = NARRATOR_DIALOG[roomId];
  if (!set) return null;
  // The §13 dialog matrix only covers the two principal narrators.
  // Lyra Vox has her own dialog module (lyraVoxDialog.ts); callers
  // looking her up here receive null and are expected to use
  // pickLyraVoxLine instead.
  if (narratorId !== "elara" && narratorId !== "the_human") return null;
  const lines = set[narratorId];

  // Pass 1: beat-tagged lines take priority.
  if (activeBeats && activeBeats.size > 0) {
    for (const line of lines) {
      if (!line.beatFlag) continue;
      if (!activeBeats.has(line.beatFlag)) continue;
      if (bond < TRUST_TIER_MIN_BOND[line.tier]) continue;
      return line;
    }
  }

  // Pass 2: normal tier-weighted pick from non-beat-tagged lines.
  const available = lines.filter(
    (line) => !line.beatFlag && bond >= TRUST_TIER_MIN_BOND[line.tier],
  );
  if (available.length === 0) return null;
  const tierOrder: TrustTier[] = ["D", "V", "H", "P", "F"];
  for (const tier of tierOrder) {
    const match = available.find((line) => line.tier === tier);
    if (match) return match;
  }
  return available[0];
}

/**
 * List every line a narrator has available to a given player, in
 * declaration order. Useful for the Loredex and for tests.
 */
export function listAvailableLines(
  roomId: NarratorRoomId,
  narratorId: NarratorId,
  bond: number,
): NarratorLine[] {
  const set = NARRATOR_DIALOG[roomId];
  if (!set) return [];
  if (narratorId !== "elara" && narratorId !== "the_human") return [];
  return set[narratorId].filter(
    (line) => bond >= TRUST_TIER_MIN_BOND[line.tier],
  );
}

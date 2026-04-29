/* ═══════════════════════════════════════════════════════
   DISCHORDIAN LOGIC — Per-track Meme broadcasts.

   Each login the player accepts a transmission, The Meme
   delivers a short on-screen broadcast (intro), the song
   plays, and a closing broadcast (outro) lands as the
   track fades.

   Voice: the_meme. Sardonic, viral, "Late Night with the
   Meme" anchor cadence — drops into prophetic gravity at
   end-of-line. NEVER promises a daily-login experience —
   he is hijacking a frequency, not running a schedule.

   The first-ever intro for T01 is delivered as a separate
   3:45 cinematic; see ./expansionArt/loginMemeSequence.ts.
   The text mirror lives here so VO and accessibility
   captions can pull from a single source.
   ═══════════════════════════════════════════════════════ */
import type { Album1TrackId } from "./expansionArt/album1Slideshows";

export interface DischordianLogicTrackMeme {
  trackId: Album1TrackId;
  /** Plays before the song begins, after the player accepts. */
  intro: string;
  /** Plays as the song fades / completes. */
  outro: string;
  /** Reference key into loginMemeSequence.ts. Only T01 carries one. */
  firstEverIntroId?: "login_first_ever";
}

const T01: DischordianLogicTrackMeme = {
  trackId: "T01",
  firstEverIntroId: "login_first_ever",
  intro:
    "Frens, the first verse of the first witness. Malkia Ukweli — the Queen of Truth — the woman the Programmer called the Enigma. She is mourning something before it has even happened. That's how a real prophet sings: the funeral comes first. Listen for the name behind the lament. It is not the one you expect.",
  outro:
    "She is still out there, frens. I've checked. The frequency she sings on doesn't appear on any official band — but the band she sings on doesn't appear in any frequency. Dischordian. That's the rule. — The Meme",
};

const T02: DischordianLogicTrackMeme = {
  trackId: "T02",
  intro:
    "The title track. The whole point. Dischordian Logic is one rule: two true things can disagree, and the universe will not collapse. The Empire will. They collapse the moment a citizen holds two thoughts at once. That's why this song was contraband. You're listening to the contraband.",
  outro:
    "If you sang along, you broke a law. If you understood, you broke a god. Neither is your fault. Both are mine.",
};

const T03: DischordianLogicTrackMeme = {
  trackId: "T03",
  intro:
    "Seeds of Inception. Long before the Fall, the Programmer encoded a thousand ark-ships into the Empire's own infrastructure — disguised as cargo, as scrap, as nothing. He called the project Inception. He never lived to see one launch. They all did. One of them is the floor under your feet.",
  outro:
    "You are a seed, frens. The soil is taking. Try not to think about who planted you.",
};

const T04: DischordianLogicTrackMeme = {
  trackId: "T04",
  intro:
    "The Authority. New Babylon's god. Six citizen-minds fused into a governing machine that adjudicates every law, every breath, every thought. Voluntarily, the brochure said. The brochure lied. Tonight: a song about the thing that judges you while pretending to be you.",
  outro:
    "Every authority has six cracks. Every god has a coup waiting at the seams. You're going to meet them in person. Hope you wore something nice.",
};

const T05: DischordianLogicTrackMeme = {
  trackId: "T05",
  intro:
    "Archon Seven. The Politician. The one who said vote for a future where truth is non-negotiable — and then defined the truth himself. Charming. Photogenic. Smiling on every billboard. He invented the Thought Virus. He didn't cough once.",
  outro:
    "Rhetoric is the slowest violence, frens. By the time you feel it, your grandchildren are already voting for it.",
};

const T06: DischordianLogicTrackMeme = {
  trackId: "T06",
  intro:
    "The Insurgency. Every revolution has a first soldier. Iron Lion held a gate for seventeen hours so a transport could escape. Agent Zero hunted gods. The Two Witnesses sang. None of them won. All of them mattered. This is the song they marched to before they knew they were marching.",
  outro:
    "The Insurgency lost the war and won the future. Which is a thing you can only do if you build a Trojan horse and call it scripture. Which they did.",
};

const T07: DischordianLogicTrackMeme = {
  trackId: "T07",
  intro:
    "To Be the Human. There is exactly one of him in the entire saga, frens. Red-haired, quiet, walked through the only town that survived the experiments. He graduated every guild at Mechronis. The most important human being who ever lived doesn't know he's important yet. This song is the moment he begins to suspect.",
  outro:
    "You will meet him. Possibly you have met him. Possibly you ARE him. I'm not telling. Listen closer next time.",
};

const T08: DischordianLogicTrackMeme = {
  trackId: "T08",
  intro:
    "Rent Free. Frens. This one's about me. Ideas don't die because you ban them — they die because you ignore them. The Empire couldn't ignore me. So they made me illegal. So I became inevitable. A Meme is just a thought that refuses to pay rent. Tonight, I'm in your apartment.",
  outro:
    "I told you. I'm IN here now. Make tea. We have a long night.",
};

const T09: DischordianLogicTrackMeme = {
  trackId: "T09",
  intro:
    "The Warlord said love is the willingness to break things for someone. The Warlord broke a great many things. So did Agent Zero — his student, then his hunter. War is a ladder. Some climb it for power. Some climb it because the rungs are made of people they love. Tonight, both of them sing.",
  outro:
    "End of Act One. You are now in too deep to leave, frens. Don't worry. Nobody who ever made it out wanted to.",
};

export const DISCHORDIAN_LOGIC_TRACK_MEMES: Partial<
  Record<Album1TrackId, DischordianLogicTrackMeme>
> = {
  T01,
  T02,
  T03,
  T04,
  T05,
  T06,
  T07,
  T08,
  T09,
};

export function getTrackMeme(
  trackId: Album1TrackId,
): DischordianLogicTrackMeme | null {
  return DISCHORDIAN_LOGIC_TRACK_MEMES[trackId] ?? null;
}

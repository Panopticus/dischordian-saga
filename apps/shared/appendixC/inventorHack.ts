/* ═══════════════════════════════════════════════════════
   APPENDIX C §C.4 — THE INVENTOR'S PROGRESSIVE HACK

   The narrative spine of the season. The ONLY storytelling
   device in the game that explicitly breaks the fourth wall,
   and it must be earned.

   Three rules:
     1. Always feels like a glitch first, a message second,
        an ally third.
     2. Grows in exact step with the Palimpsest meter.
     3. Always warns about Alaric obliquely — "count the
        rings on his pen" — never directly.

   Ends Episode 12 with Shadow Tongue severing the line at
   exactly the 90-second mark.
   ═══════════════════════════════════════════════════════ */

import type { PalimpsestEpisodeId } from "./episodeFormats";

export interface InventorHackStep {
  /** Episode this step fires in. */
  episodeId: PalimpsestEpisodeId;
  /** 1-based episode number for display. */
  episode: number;
  /** Hack intensity 0-100. */
  intensityPercent: number;
  /** Short label for the hack level. */
  label: string;
  /** How the hack manifests in this episode. */
  deliveryMechanism: string;
  /** What the Inventor actually says (null = glyph only). */
  inventorLine: string | null;
  /** How Shadow Tongue fights back. */
  shadowTongueCounter: string;
  /** Flag raised when this step fires. */
  firedFlag: string;
}

export const INVENTOR_HACK_PROGRESSION: readonly InventorHackStep[] = [
  {
    episodeId: "ep01_safe_unsafe",
    episode: 1,
    intensityPercent: 0,
    label: "None",
    deliveryMechanism: "Nothing yet.",
    inventorLine: null,
    shadowTongueCounter: "Not yet aware.",
    firedFlag: "inventor_hack_ep01_fired",
  },
  {
    episodeId: "ep02_the_link",
    episode: 2,
    intensityPercent: 5,
    label: "First glyph",
    deliveryMechanism:
      "Scoreboard glyph in the bottom-right corner flickers for 2 frames. It is a Ne-Yon engineering rune.",
    inventorLine: null,
    shadowTongueCounter: "Not yet aware.",
    firedFlag: "inventor_hack_ep02_fired",
  },
  {
    episodeId: "ep03_the_liar",
    episode: 3,
    intensityPercent: 10,
    label: "Ad bumper corruption",
    deliveryMechanism:
      "One ad during the break is the wrong ad — an old Ne-Yon propaganda reel from the Insurgency era that should not exist.",
    inventorLine:
      "Don't trust him. Don't trust any of them. Count the rings on his pen.",
    shadowTongueCounter:
      "Producers air a bland 'please stand by' card for 5 seconds. They do not acknowledge what happened.",
    firedFlag: "inventor_hack_ep03_fired",
  },
  {
    episodeId: "ep04_the_auction",
    episode: 4,
    intensityPercent: 15,
    label: "Host stutter",
    deliveryMechanism:
      "Host's audio stutters mid-sentence; wrong mouth shape plays for half a second.",
    inventorLine:
      "His card is only readable in ultraviolet. You have a UV filter in your own ship's archives. Look.",
    shadowTongueCounter:
      "A Vesse, Vesse & Mol'Garath legal notice scrolls at the bottom of the screen claiming the stutter was an editorial choice.",
    firedFlag: "inventor_hack_ep04_fired",
  },
  {
    episodeId: "ep05_the_oracle",
    episode: 5,
    intensityPercent: 25,
    label: "Subtitle injection",
    deliveryMechanism:
      "During Round 1, the subtitle underneath a question briefly says something different from the audio.",
    inventorLine:
      "Ask him what his middle name is. Then ask him the next five words he thinks. He cannot help himself. He has to answer.",
    shadowTongueCounter:
      "The subtitle is scrubbed on replay. VOD viewers cannot see it. Only live viewers.",
    firedFlag: "inventor_hack_ep05_fired",
  },
  {
    episodeId: "ep06_survivor_mechronis",
    episode: 6,
    intensityPercent: 35,
    label: "Second voice",
    deliveryMechanism:
      "A second voice underneath one of the professors' lectures, speaking in parallel.",
    inventorLine:
      "They are teaching you to hate the quiet ones. They are teaching Alaric's grandchildren to grade you. Your Apprentice is being graded too.",
    shadowTongueCounter:
      "Professor Aoki turns to camera and asks 'Who is talking in my classroom?' The Inventor shuts up for five seconds.",
    firedFlag: "inventor_hack_ep06_fired",
  },
  {
    episodeId: "ep07_railroad",
    episode: 7,
    intensityPercent: 40,
    label: "Objection override",
    deliveryMechanism:
      "During an Alaric Objection, the Inventor cuts in and completes the question honestly before Alaric can reframe it.",
    inventorLine:
      "He is going to rephrase this as a question about property law. The real question is about whether a being can be owned. The answer is no. Say no.",
    shadowTongueCounter:
      "Alaric does not object to the override. He smiles and says 'Noted.' Shadow Tongue is LETTING the Inventor win this one.",
    firedFlag: "inventor_hack_ep07_fired",
  },
  {
    episodeId: "ep08_house_of_cards",
    episode: 8,
    intensityPercent: 50,
    label: "House bug",
    deliveryMechanism:
      "A camera angle that doesn't exist in the Big Brother house's camera system begins broadcasting from inside a wall.",
    inventorLine:
      "Every person he fires at the Apprentice episode is being conscripted. Read the fine print. The fine print is in Shadow Tongue. I am translating in real time. You will see a typo. The typo is me.",
    shadowTongueCounter:
      "Shadow Tongue edits the fine print on the player's screen after the fact. A screenshot saved before reload still shows it. The first time the game asks the player to screenshot something.",
    firedFlag: "inventor_hack_ep08_fired",
  },
  {
    episodeId: "ep09_the_gauntlet",
    episode: 9,
    intensityPercent: 55,
    label: "Gauntlet names",
    deliveryMechanism:
      "The names of dead clones on the casualty crawl are wrong — the Inventor replaced them with the names of Kael's original Insurgency crew (see Appendix B §B.7.8).",
    inventorLine:
      "These are the ones who died on the ship before you woke up. They are still here. You are building on top of them. Do not forget their names. The firm wants them forgotten.",
    shadowTongueCounter:
      "Shadow Tongue overwrites the casualty crawl on re-broadcast. Live viewers got the Insurgency names. VOD viewers get the clone numbers.",
    firedFlag: "inventor_hack_ep09_fired",
  },
  {
    episodeId: "ep10_the_debate",
    episode: 10,
    intensityPercent: 70,
    label: "Debate parallel",
    deliveryMechanism:
      "The Inventor has taken over the teleprompter. Alaric now sees a different set of arguments than the audience. Player sees both.",
    inventorLine:
      "Watch him try to answer a question he is not being asked. Watch the pauses. The pauses are where the lie is.",
    shadowTongueCounter:
      "Shadow Tongue fires the hidden prompter system. Alaric speaks extemporaneously for the first time. He is very good at it.",
    firedFlag: "inventor_hack_ep10_fired",
  },
  {
    episodeId: "ep11_interviews",
    episode: 11,
    intensityPercent: 80,
    label: "The cut",
    deliveryMechanism:
      "The Inventor takes over the editing booth. Every re-edited soundbite is restored to its original context.",
    inventorLine:
      "I have been the only honest editor in this building for six weeks. I am very tired. I want you to know I did not enjoy the Apprentice episode either.",
    shadowTongueCounter:
      "Shadow Tongue closes the editing booth. The Inventor moves to the control room. The fight is now explicit.",
    firedFlag: "inventor_hack_ep11_fired",
  },
  {
    episodeId: "ep12_the_elimination",
    episode: 12,
    intensityPercent: 95,
    label: "Full takeover",
    deliveryMechanism:
      "The Inventor takes the Host's microphone in the last 90 seconds. A Ne-Yon voice replaces the Host. Inventor speaks directly to the player by their chosen name for the first time.",
    inventorLine:
      "I have to go soon. The firm is about to cut the line. Listen carefully. The man in the grey suit is a demon from the Hierarchy of the Damned. The show's Host is not the Game Master. The show's Host has been the Meme the entire time. You have been speaking with the Meme for twelve episodes. Do you understand? Count the rings.",
    shadowTongueCounter:
      "Shadow Tongue severs the connection at exactly the 90-second mark. The line goes dead. The Inventor is gone. Alaric stands, walks off the set, takes the envelope with him. Credits roll over an empty stage.",
    firedFlag: "inventor_hack_ep12_fired",
  },
  {
    episodeId: "ep13_the_reckoning",
    episode: 13,
    intensityPercent: 0,
    label: "Silenced",
    deliveryMechanism: "The Inventor is not heard from again this season.",
    inventorLine: null,
    shadowTongueCounter: "The line is dead. Shadow Tongue keeps it that way.",
    firedFlag: "inventor_hack_ep13_fired",
  },
];

export function listInventorHackSteps(): readonly InventorHackStep[] {
  return INVENTOR_HACK_PROGRESSION;
}

export function getInventorHackStepByEpisode(
  episode: number,
): InventorHackStep | undefined {
  return INVENTOR_HACK_PROGRESSION.find((s) => s.episode === episode);
}

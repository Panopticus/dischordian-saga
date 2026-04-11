/* ═══════════════════════════════════════════════════════
   THE PALIMPSEST — 13 EPISODE CONFIGURATIONS

   Each season of The Palimpsest runs thirteen episodes.
   Episode structure is fixed:
     • Round 1 — Loredex Quiz (seeded from the existing Lore Quiz)
     • Round 2 — Debate (on the Thaloria stage in certain episodes)
     • Round 3 — Format-of-the-week (Survivor, Auction, Railroad, etc.)
     • Rounds 4-10 — varies, typically escalating difficulty

   Episode 6 is Mechronis Survivor (guest judge Professor Glinn Vyre).
   Episode 10 is Full Debate (General Alaric's "OBJECTION" showpiece).
   Episode 12 is the Inventor's 45-second takeover.
   Episode 13 is silent broadcast — Darren's funeral, played in-
   universe as "technical difficulties." The player CAN watch.
   ═══════════════════════════════════════════════════════ */

export type Round3Format =
  | "survivor"
  | "auction"
  | "railroad"
  | "debate"
  | "cold_read"
  | "betrayal"
  | "maze"
  | "silent";

export interface PalimpsestEpisode {
  episodeNumber: number;
  title: string;
  theme: string;
  round3Format: Round3Format;
  /** Guest appearances — NPC IDs from other shared modules. */
  guests: string[];
  /** Expected casualty count (0 = nobody dies). */
  baseCasualties: number;
  /** Hack level the Inventor aims for this episode (0-5). */
  inventorHackLevel: 0 | 1 | 2 | 3 | 4 | 5;
  /** Host's cold-open line variation (Appendix C-OP). */
  hostColdOpen: string;
  /** Safe point — if true, losing still locks in current winnings. */
  safePoint: boolean;
  /** Short synopsis for the episode lobby card. */
  synopsis: string;
  /** Does this episode use the Thaloria debate stage background? */
  useThaloriaStage: boolean;
}

export const PALIMPSEST_EPISODES: PalimpsestEpisode[] = [
  {
    episodeNumber: 1,
    title: "The Welcome Mat",
    theme: "Introductions and Applause Lights",
    round3Format: "cold_read",
    guests: [],
    baseCasualties: 0,
    inventorHackLevel: 0,
    hostColdOpen:
      "Ladies, gentlemen, and assorted quantum probability states — WELCOME to The Palimpsest! I'm your host. You are my guests. Some of you will be my guests longer than others.",
    safePoint: false,
    synopsis:
      "The Host introduces the game, the rules, and the first three contestants. One of them is already the Inventor. You don't know that yet.",
    useThaloriaStage: false,
  },
  {
    episodeNumber: 2,
    title: "The First Objection",
    theme: "Debate Introduction; General Alaric debuts",
    round3Format: "debate",
    guests: ["general_alaric"],
    baseCasualties: 0,
    inventorHackLevel: 1,
    hostColdOpen:
      "Welcome back! Tonight's contestant has the honor of debating a very special guest. He is decorated. He is charming. He is almost certainly going to object.",
    safePoint: false,
    synopsis:
      "Alaric introduces his 'OBJECTION!' mechanic. The player's first debate. Darren sends his first real letter after the tape stops.",
    useThaloriaStage: false,
  },
  {
    episodeNumber: 3,
    title: "Office Hours Are Open",
    theme: "Loredex Contradictions",
    round3Format: "cold_read",
    guests: [],
    baseCasualties: 1,
    inventorHackLevel: 1,
    hostColdOpen:
      "Third episode! Traditionally lucky. Traditionally doomed. I've never understood why traditions contradict themselves. Now let's ruin some more.",
    safePoint: true,
    synopsis:
      "First safe-point episode. First actual death on air. The player can visit Darren's office hours in the Dreams Workshop for the first time.",
    useThaloriaStage: false,
  },
  {
    episodeNumber: 4,
    title: "The Ghost Contestant",
    theme: "Unexplained Arrivals",
    round3Format: "betrayal",
    guests: [],
    baseCasualties: 2,
    inventorHackLevel: 2,
    hostColdOpen:
      "Episode four! Four is the number of uncomfortable questions I have told Legal to ignore this week. Let's get into them.",
    safePoint: false,
    synopsis:
      "A contestant nobody cast walks on set mid-episode, answers one question correctly, and leaves. The Host does not acknowledge her. The Inventor signs the hack 'first ally.'",
    useThaloriaStage: false,
  },
  {
    episodeNumber: 5,
    title: "Midpoint, Mid-Bit",
    theme: "Budget Cuts and Stuttering Hosts",
    round3Format: "auction",
    guests: ["general_alaric"],
    baseCasualties: 1,
    inventorHackLevel: 2,
    hostColdOpen:
      "Welcome to episode f— f— five. Ha! Technical problems. Which of you threw the trivia pot off the prop table? Confession earns you a prize. Lying earns you a visit from Legal.",
    safePoint: false,
    synopsis:
      "Auction round — contestants bid dream tokens on questions. Alaric aggressively overbids on a question he knows the answer to and expects praise.",
    useThaloriaStage: false,
  },
  {
    episodeNumber: 6,
    title: "Survivor: Mechronis",
    theme: "Mechronis Academy Guest Judging",
    round3Format: "survivor",
    guests: ["prof_glinn_vyre"],
    baseCasualties: 3,
    inventorHackLevel: 3,
    hostColdOpen:
      "Tonight — a guest judge! Professor Glinn Vyre of Mechronis Academy. He wears red goggles. He grades in red ink. He does not speak to me during commercial breaks. I respect that.",
    safePoint: false,
    synopsis:
      "The Mechronis Survivor round. Contestants are graded by Professor Vyre — whose red-ink corrections override the Host's scoreboard whenever they can. The Inventor's hack routes answers through Vyre.",
    useThaloriaStage: false,
  },
  {
    episodeNumber: 7,
    title: "The Second Safe Point",
    theme: "Sanctuary and Lies About Sanctuary",
    round3Format: "railroad",
    guests: [],
    baseCasualties: 0,
    inventorHackLevel: 3,
    hostColdOpen:
      "Welcome back, survivors! Traditionally I would buy you a cake here. Budget cuts mean you get an email. I'm reading it on broadcast. The subject line is 'Congratulations.'",
    safePoint: true,
    synopsis:
      "Officially a 'safe' episode. In practice, the Host uses it to get contestants comfortable before Episode 8 takes something back. Darren's letter warns you not to get comfortable.",
    useThaloriaStage: false,
  },
  {
    episodeNumber: 8,
    title: "Corrections",
    theme: "Loredex Corrections Go Live",
    round3Format: "cold_read",
    guests: [],
    baseCasualties: 2,
    inventorHackLevel: 4,
    hostColdOpen:
      "Episode eight! The show is exactly as old as the jokes I am still telling. Welcome to the refurbishment.",
    safePoint: false,
    synopsis:
      "Mid-episode, the studio wall displays Darren's eight rejected Loredex corrections — broadcast by the Inventor without the Host's approval. The Host laughs. The laugh is not real. Neither is the audio track it's dubbed under.",
    useThaloriaStage: false,
  },
  {
    episodeNumber: 9,
    title: "The Crawl Runs Backwards",
    theme: "Casualty Crawl; Names That Were Edited Out",
    round3Format: "betrayal",
    guests: ["general_alaric"],
    baseCasualties: 5,
    inventorHackLevel: 4,
    hostColdOpen:
      "Episode nine. The number of lives a cat has, if the cat is careful. None of you are cats. None of you are careful. I love this show.",
    safePoint: false,
    synopsis:
      "The casualty crawl runs backwards mid-broadcast, exposing four names the Shadow Tongue had quietly edited out of the Chronicle. If the player reads them all before the Host cuts to commercial, +15 Signal.",
    useThaloriaStage: false,
  },
  {
    episodeNumber: 10,
    title: "The Thaloria Debate",
    theme: "Full Debate Stage; Alaric's Centerpiece",
    round3Format: "debate",
    guests: ["general_alaric"],
    baseCasualties: 0,
    inventorHackLevel: 4,
    hostColdOpen:
      "Tonight we broadcast live from the Thaloria debate stage — beautiful lighting, excellent acoustics, famously haunted. My personal favorite venue. Our honored guest tonight has prepared an OBJECTION I think you will all enjoy.",
    safePoint: false,
    synopsis:
      "The full debate episode. Alaric tries to force an OBJECTION ruling in his favor. If the player has clocked the cufflink tell (Darren's hint + close camera work), they can expose him for +25 Signal.",
    useThaloriaStage: true,
  },
  {
    episodeNumber: 11,
    title: "Late to Taping",
    theme: "Darren's Disappearance",
    round3Format: "silent",
    guests: [],
    baseCasualties: 1,
    inventorHackLevel: 5,
    hostColdOpen:
      "Welcome back! Segment producer Darren Fessler is — oh, he's running late. Don't worry. He's a professional. Professionals always make it.",
    safePoint: false,
    synopsis:
      "Darren is not on set. The Host makes a joke. The joke does not land. During commercial, the Inventor speaks directly to Darren on the audio bus, audible on broadcast: 'Leave the building tonight. I can't keep doing this alone. Please.' Darren does not leave.",
    useThaloriaStage: false,
  },
  {
    episodeNumber: 12,
    title: "The Inventor's Takeover",
    theme: "Full Broadcast Intrusion",
    round3Format: "silent",
    guests: ["the_inventor"],
    baseCasualties: 1, // Darren.
    inventorHackLevel: 5,
    hostColdOpen:
      "Welcome to episode twelve. We lost a member of the crew this week. The show must go on. You know how this is. You've all seen the reruns.",
    safePoint: false,
    synopsis:
      "The Inventor takes the broadcast for 45 seconds. The Host's face dissolves into static. A long, level voice reads a list of names. The last name is Darren Fessler. The broadcast cuts to black. The player earns the post-finale unlocks regardless of score.",
    useThaloriaStage: false,
  },
  {
    episodeNumber: 13,
    title: "Technical Difficulties",
    theme: "Silent Episode / Funeral",
    round3Format: "silent",
    guests: [],
    baseCasualties: 0,
    inventorHackLevel: 0, // The Inventor is gone.
    hostColdOpen: "", // The Host has no lines this episode.
    safePoint: false,
    synopsis:
      "Episode 13 broadcasts as thirty straight minutes of a black screen with the words 'TECHNICAL DIFFICULTIES.' If the player presses play and waits, they see Darren's funeral — in the Celebration sector cemetery near his mother. No score. No casualties. The only episode that grants Signal just for showing up.",
    useThaloriaStage: false,
  },
];

/* ─── HELPERS ─── */

export function getEpisode(n: number): PalimpsestEpisode | undefined {
  return PALIMPSEST_EPISODES.find((e) => e.episodeNumber === n);
}

export function isSafePointEpisode(n: number): boolean {
  return getEpisode(n)?.safePoint ?? false;
}

/** Guest NPC IDs appearing this episode. */
export function getGuests(n: number): string[] {
  return getEpisode(n)?.guests ?? [];
}

/** Rolls expected casualties for the crawl. Pure, for testing. */
export function rollCasualtyCount(episode: number, noiseLevel: number): number {
  const base = getEpisode(episode)?.baseCasualties ?? 0;
  // Extra deaths when Noise is high.
  const bonus = Math.floor(noiseLevel / 200);
  return base + bonus;
}

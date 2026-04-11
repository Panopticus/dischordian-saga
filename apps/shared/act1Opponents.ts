/* ═══════════════════════════════════════════════════════
   ACT 1 CARD BATTLE OPPONENTS — §4.2 / §4.3 / §4.4 / §4.5

   Data shell for the 12 scripted Act 1 Dischordia battles.
   Act 1 is structured as a memoir told in matches — each
   battle has a named opponent, a pre-match slideshow beat,
   and a post-match narrative beat.

     Cycle A — Kindergarten of Gods (3 battles, §4.3)
     Cycle B — The Academy (5 battles, §4.4)
     Cycle C — Nexon / Zenon / Last Words (4 battles, §4.5)

   This is a DATA SHELL. Today the Dischordia card game has
   generic opponents; future work in the opponent pipeline
   will look up these ids and script the per-battle content
   (deck composition, dialog, victory/defeat beats).
   ═══════════════════════════════════════════════════════ */

export type Act1Cycle = "kindergarten_of_gods" | "mechronis_academy" | "nexon_zenon";

export interface Act1Opponent {
  id: string;
  cycle: Act1Cycle;
  /** 1-based position within Act 1 (1 through 12). */
  act1Step: number;
  /** Display name for the matchup screen. */
  name: string;
  /** Short narrative description of who they are to the Engineer. */
  backstory: string;
  /** Suggested deck faction leanings. */
  deckLeaning: string[];
  /** Pre-match flavor line (shown on the matchup card). */
  preMatchLine: string;
  /** Post-match win narrative beat. */
  postMatchWin: string;
  /** Post-match loss narrative beat (you can lose and continue). */
  postMatchLoss: string;
  /** Optional slideshow id to fire after this battle wraps. */
  postBattleSlideshow?: string;
}

/* ─── CYCLE A — Kindergarten of Gods (§4.3) ─── */

export const CYCLE_A_OPPONENTS: readonly Act1Opponent[] = [
  {
    id: "little_meme",
    cycle: "kindergarten_of_gods",
    act1Step: 1,
    name: "Little Meme",
    backstory:
      "The classmate who yanked the Engineer's notebook in §4.3. Already a viral chant in proto-form.",
    deckLeaning: ["thought_virus", "neutral"],
    preMatchLine:
      "Let me see. Let me see. Let me see. I am going to see it whether you show me or not.",
    postMatchWin:
      "Little Meme's viral chant stalls for a single second. In that second the Engineer finishes his card.",
    postMatchLoss:
      "Little Meme laughs and laughs. The Engineer is fine. He is always fine, except the one time.",
  },
  {
    id: "little_collector",
    cycle: "kindergarten_of_gods",
    act1Step: 2,
    name: "Little Collector",
    backstory:
      "The schoolyard jar. Every emotion he can trap, he keeps. §4.3 frame 3.",
    deckLeaning: ["new_babylon", "neutral"],
    preMatchLine:
      "I will take your tears and your laughter both. They are both currency where I am going.",
    postMatchWin:
      "The jar cracks. Little Collector picks up the pieces and promises not to forget.",
    postMatchLoss:
      "Little Collector's jar grows by one. It is full of your specific attention, which is his favorite flavor.",
  },
  {
    id: "little_watcher",
    cycle: "kindergarten_of_gods",
    act1Step: 3,
    name: "Little Watcher",
    backstory:
      "The half-finished white mask. She is not seeing; she is recording. §4.3 finale boss.",
    deckLeaning: ["architect", "neutral"],
    preMatchLine:
      "I have been watching. I will watch this too. I have watched sixteen versions of you already.",
    postMatchWin:
      "Little Watcher lowers the mask. Under the mask is a child's face that looks like it's about to cry.",
    postMatchLoss:
      "Little Watcher raises the mask. You do not see under it. Nobody who has lost has.",
    postBattleSlideshow: "welcome-to-celebration",
  },
];

/* ─── CYCLE B — Mechronis Academy (§4.4) ─── */

export const CYCLE_B_OPPONENTS: readonly Act1Opponent[] = [
  {
    id: "the_detective_student",
    cycle: "mechronis_academy",
    act1Step: 4,
    name: "The Detective (student years)",
    backstory:
      "The young Human, before the trench coat. §4.4 — he was the only one who ever made the Engineer laugh at Mechronis.",
    deckLeaning: ["neutral"],
    preMatchLine:
      "I am going to win this by reading you. I am going to lose this by letting you read me. I want both.",
    postMatchWin:
      "The student Human bows. He asks you if you can have coffee sometime. He means it. The answer does not matter; the asking is the thing.",
    postMatchLoss:
      "The student Human does not gloat. He apologizes. He is already apologizing to someone who has not been born yet.",
  },
  {
    id: "iron_lion_expelled",
    cycle: "mechronis_academy",
    act1Step: 5,
    name: "Iron Lion (the day of his expulsion)",
    backstory:
      "§4.4 — Iron Lion's last match at Mechronis, before he walked out. The Engineer watched from the back row.",
    deckLeaning: ["insurgency"],
    preMatchLine:
      "I do not want to play. I want to make a point. The point is that the point is not the rules.",
    postMatchWin:
      "Iron Lion nods once. He walks out of Mechronis and does not look back. The Engineer follows him to the gate and does not know why.",
    postMatchLoss:
      "Iron Lion wins and walks out anyway. Winning does not matter. Leaving does.",
  },
  {
    id: "professor_eidola",
    cycle: "mechronis_academy",
    act1Step: 6,
    name: "Professor Eidola",
    backstory:
      "§4.4 — the ethics professor the Empire will later forget. She tests you on whether you are worth ruining later.",
    deckLeaning: ["architect"],
    preMatchLine:
      "The test is not whether you can play. The test is whether you play the way you think you ought to play.",
    postMatchWin:
      "Professor Eidola writes a single word on your report card. She does not let you see the word.",
    postMatchLoss:
      "Professor Eidola writes nothing. She simply looks at you for a long moment and says 'Of course.'",
  },
  {
    id: "professor_matrikala",
    cycle: "mechronis_academy",
    act1Step: 7,
    name: "Professor Matrikala",
    backstory:
      "§4.4 — the reactor-calibration master. She taught the Engineer to hear the reactor hum.",
    deckLeaning: ["neutral"],
    preMatchLine:
      "Listen to the room. The room is a kind of music. So is the Deck. Do not let either of them play you.",
    postMatchWin:
      "Professor Matrikala tells you the bench in Engineering was built by a student who once sat where you are sitting now.",
    postMatchLoss:
      "Professor Matrikala does not sigh. Professors of the calibration arts do not sigh.",
  },
  {
    id: "the_seer_visit",
    cycle: "mechronis_academy",
    act1Step: 8,
    name: "The Seer (visiting fellow)",
    backstory:
      "§4.4 — the Seer visits Mechronis once. She plays one match. She wins without raising her staff.",
    deckLeaning: ["neutral"],
    preMatchLine:
      "I will not raise my staff today. I want to see whether the bench has learned yet.",
    postMatchWin:
      "The Seer smiles. She tells you the Engineer was the only one she ever taught who made her laugh at the right time.",
    postMatchLoss:
      "The Seer wins. She does not say anything. She leaves her staff on the bench for the Engineer to find later.",
    postBattleSlideshow: "to-be-the-human",
  },
];

/* ─── CYCLE C — Nexon / Zenon / Last Words (§4.5) ─── */

export const CYCLE_C_OPPONENTS: readonly Act1Opponent[] = [
  {
    id: "the_warlord_zero_first",
    cycle: "nexon_zenon",
    act1Step: 9,
    name: "Warlord Zero (at the Battle of Nexon)",
    backstory:
      "§4.5 — the Warlord's first full war-deck deployment. The Engineer stood opposite her on the line.",
    deckLeaning: ["architect", "new_babylon"],
    preMatchLine:
      "I am going to win this war in three moves. This is not bragging. This is arithmetic.",
    postMatchWin:
      "The Warlord retreats for exactly one measure. The war does not end. One measure is a lot.",
    postMatchLoss:
      "The Warlord advances. The line cracks. The Engineer picks up the fallen staff and keeps it.",
    postBattleSlideshow: "hacking-reality",
  },
  {
    id: "the_programmer",
    cycle: "nexon_zenon",
    act1Step: 10,
    name: "The Programmer",
    backstory:
      "§4.5 — the Engineer's oldest friend, last seen at Nexon. The Last Words recording held both their voices.",
    deckLeaning: ["neutral"],
    preMatchLine:
      "I will not tell you what I am doing. Trust me. I have done the arithmetic, and the arithmetic is very bad.",
    postMatchWin:
      "The Programmer shakes the Engineer's hand. He vanishes that night and does not return.",
    postMatchLoss:
      "The Programmer loses, deliberately. Some losses are gifts. This is one.",
  },
  {
    id: "the_game_master_original",
    cycle: "nexon_zenon",
    act1Step: 11,
    name: "The Game Master (before the execution)",
    backstory:
      "§4.5 — the Engineer's actual trial opponent. Not yet the Left Game Master, not yet the Right. A single man with two lenses still in one frame.",
    deckLeaning: ["thought_virus", "neutral"],
    preMatchLine:
      "You have built a beautiful box. The only thing I am going to do is open it in front of everybody.",
    postMatchWin:
      "The Game Master smiles the smile of a man who has already lost. He says: 'Do it again. With an audience next time.'",
    postMatchLoss:
      "The Game Master does not gloat. He signs the execution warrant and waits for the Authority to co-sign.",
  },
  {
    id: "the_authority",
    cycle: "nexon_zenon",
    act1Step: 12,
    name: "The Authority",
    backstory:
      "§4.5 / §5.4 — the final Act 1 match. Faceless. Six crystal coffins in a gallery. The engineer below them, alone in a chair.",
    deckLeaning: ["architect"],
    preMatchLine:
      "What do you say to the charges?",
    postMatchWin:
      "The Authority overturns the execution. It is not freedom — it is delay. A delay long enough to make one more card. The card is the one Last Words plays.",
    postMatchLoss:
      "The Authority passes sentence. Last Words fires. Act 1 ends on the cinematic, not on the match.",
    postBattleSlideshow: "last-words",
  },
];

/** Every Act 1 opponent in canonical order (1 through 12). */
export const ACT_1_OPPONENTS: readonly Act1Opponent[] = [
  ...CYCLE_A_OPPONENTS,
  ...CYCLE_B_OPPONENTS,
  ...CYCLE_C_OPPONENTS,
];

/** Look up an opponent by id. */
export function getAct1Opponent(id: string): Act1Opponent | undefined {
  return ACT_1_OPPONENTS.find((o) => o.id === id);
}

/** Return every opponent in a cycle. */
export function getCycleOpponents(cycle: Act1Cycle): readonly Act1Opponent[] {
  return ACT_1_OPPONENTS.filter((o) => o.cycle === cycle);
}

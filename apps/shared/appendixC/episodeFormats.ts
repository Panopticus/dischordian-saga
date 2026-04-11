/* ═══════════════════════════════════════════════════════
   APPENDIX C §C.3 — THE GAME SHOW FORMATS

   13 episodes per season, aligned to a quarter of Year One.
   Every episode's Round 3 is a different psychological
   reality-TV parody. The player never knows which one until
   it starts.

   Data shell only. The per-episode gameplay wiring uses the
   canonical `quizSpectator.ts` seat machinery.
   ═══════════════════════════════════════════════════════ */

export type PalimpsestEpisodeId =
  | "ep01_safe_unsafe"
  | "ep02_the_link"
  | "ep03_the_liar"
  | "ep04_the_auction"
  | "ep05_the_oracle"
  | "ep06_survivor_mechronis"
  | "ep07_railroad"
  | "ep08_house_of_cards"
  | "ep09_the_gauntlet"
  | "ep10_the_debate"
  | "ep11_interviews"
  | "ep12_the_elimination"
  | "ep13_the_reckoning";

export interface PalimpsestEpisode {
  id: PalimpsestEpisodeId;
  /** 1-based episode number. */
  order: number;
  /** Round 3 game title. */
  title: string;
  /** Reality-TV format this episode parodies. */
  parodyOf: string;
  /** Core mechanic for Round 3. */
  coreMechanic: string;
  /** What dies (clones / identities / Loredex / etc.). */
  whatDies: string;
  /** Flag raised on completion. */
  completedFlag: string;
  /** True if this episode is the finale with no Round 3 game. */
  isAnticlimax?: boolean;
  /** True if this episode has no deaths (the scariest one). */
  zeroDeaths?: boolean;
}

export const PALIMPSEST_EPISODES: readonly PalimpsestEpisode[] = [
  {
    id: "ep01_safe_unsafe",
    order: 1,
    title: "SAFE / UNSAFE",
    parodyOf: "Squid Game: Red Light Green Light",
    coreMechanic:
      "Every contestant stands on a tile. A question appears. The player whose answer is furthest from truth drops through the floor.",
    whatDies: "The clone. On camera. No blood. Very clean.",
    completedFlag: "palimpsest_ep01_complete",
  },
  {
    id: "ep02_the_link",
    order: 2,
    title: "THE LINK",
    parodyOf: "The Weakest Link",
    coreMechanic:
      "Audience votes out one contestant per round. Votes are live. Players on other Arks are voting in real time.",
    whatDies:
      "The clone AND a randomly-rolled online player whose Ark was spectating — that Ark reports a 'spectator cascade failure.'",
    completedFlag: "palimpsest_ep02_complete",
  },
  {
    id: "ep03_the_liar",
    order: 3,
    title: "THE LIAR",
    parodyOf: "To Tell the Truth",
    coreMechanic:
      "Each contestant answers the same personal question. One must lie. Audience picks the liar. If wrong, the accused tells the next truth about themselves whether they wanted to or not.",
    whatDies:
      "Darren's identity secret: his unpublished novel about dragons that do paperwork.",
    completedFlag: "palimpsest_ep03_complete",
  },
  {
    id: "ep04_the_auction",
    order: 4,
    title: "THE AUCTION",
    parodyOf: "Mr Beast 'Would You Sell Your'",
    coreMechanic:
      "Contestants bid parts of their memory for Dream tokens. High bid wins. The won tokens are real. The lost memories are real.",
    whatDies: "Nothing. This is the one episode nobody dies — which makes it the scariest one.",
    completedFlag: "palimpsest_ep04_complete",
    zeroDeaths: true,
  },
  {
    id: "ep05_the_oracle",
    order: 5,
    title: "THE ORACLE",
    parodyOf: "The Chase",
    coreMechanic:
      "Contestants race a pre-recorded Archon answering the same questions. Beat the Archon, you live. Lose, the Archon reads your eulogy on stage.",
    whatDies:
      "The eulogy is real. Archons: Meme, Watcher, Collector, Necromancer on rotation.",
    completedFlag: "palimpsest_ep05_complete",
  },
  {
    id: "ep06_survivor_mechronis",
    order: 6,
    title: "SURVIVOR: MECHRONIS",
    parodyOf: "Survivor",
    coreMechanic:
      "Week-long format. Contestants live on the Mechronis Academy grounds and are taught by the canonical Professors. They vote each other out based on coursework.",
    whatDies: "The losers are given to the professors. The professors are not nice about it.",
    completedFlag: "palimpsest_ep06_complete",
  },
  {
    id: "ep07_railroad",
    order: 7,
    title: "RAILROAD",
    parodyOf: "Hell's Kitchen × The Apprentice",
    coreMechanic:
      "Contestants work in a fake corporate office. Alaric is the boss. Firings are small legal filings, and the paperwork is binding.",
    whatDies:
      "Nothing dies — the filings go into the canonical Syndicate Worlds contract pool. The player has now LEGALLY signed something with the Hierarchy.",
    completedFlag: "palimpsest_ep07_complete",
    zeroDeaths: true,
  },
  {
    id: "ep08_house_of_cards",
    order: 8,
    title: "HOUSE OF CARDS",
    parodyOf: "Big Brother",
    coreMechanic:
      "Contestants live in a sealed house hosted by the Matrix of Dreams. Every action archived. Audience votes who to delete from the archive.",
    whatDies:
      "The deleted person's entire Loredex entry is wiped from the player's client until the next Signal threshold is reached.",
    completedFlag: "palimpsest_ep08_complete",
  },
  {
    id: "ep09_the_gauntlet",
    order: 9,
    title: "THE GAUNTLET",
    parodyOf: "Takeshi's Castle / Fall Guys",
    coreMechanic:
      "Physical obstacle course. Clones explode on failed jumps. High camp. High body count.",
    whatDies: "Many clones. Very many. The most popular episode of the season.",
    completedFlag: "palimpsest_ep09_complete",
  },
  {
    id: "ep10_the_debate",
    order: 10,
    title: "THE DEBATE",
    parodyOf: "Presidential Debate",
    coreMechanic:
      "A single two-person debate. Proposition chosen by community vote. Set on Thaloria. Inventor's hack is at maximum strength this episode.",
    whatDies: "The loser is remembered wrong — their Loredex entry gains a small permanent scar.",
    completedFlag: "palimpsest_ep10_complete",
  },
  {
    id: "ep11_interviews",
    order: 11,
    title: "INTERVIEWS",
    parodyOf: "Nathan Fielder's The Rehearsal",
    coreMechanic:
      "Contestants are interviewed in private. The interviews are edited. The edits become the next question. Nothing shown the way it was said.",
    whatDies: "Trust in the show dies. The player learns they cannot believe anything they've seen.",
    completedFlag: "palimpsest_ep11_complete",
  },
  {
    id: "ep12_the_elimination",
    order: 12,
    title: "THE ELIMINATION",
    parodyOf: "Top Chef Finale",
    coreMechanic:
      "Darren, Alaric, and the Player are the final three. One is eliminated by judges' decision. Canonical setup for §C.5 — Darren's sacrifice.",
    whatDies: "Whoever is eliminated.",
    completedFlag: "palimpsest_ep12_complete",
  },
  {
    id: "ep13_the_reckoning",
    order: 13,
    title: "THE RECKONING",
    parodyOf: "Anticlimax",
    coreMechanic:
      "There is no game. The Host walks out early, opens an envelope, reads it, drops it. The Inventor finishes the hack. The Meme is revealed (§C.6). Season ends.",
    whatDies: "The Host's mask. Not the Host — just the mask.",
    completedFlag: "palimpsest_ep13_complete",
    isAnticlimax: true,
  },
];

export function listPalimpsestEpisodes(): readonly PalimpsestEpisode[] {
  return PALIMPSEST_EPISODES;
}

export function getPalimpsestEpisode(
  id: PalimpsestEpisodeId,
): PalimpsestEpisode | undefined {
  return PALIMPSEST_EPISODES.find((e) => e.id === id);
}

/* ═══════════════════════════════════════════════════════
   ACT 1 CARD BATTLE OPPONENTS — §1.1 master index

   Data shell for the 12 scripted Act 1 Dischordia battles.
   Act 1 is structured as a memoir told in matches — each
   battle has a named opponent, a pre-match slideshow beat,
   and a post-match narrative beat.

     Cycle A — Kindergarten of Gods (3 battles)
     Cycle B — Mechronis Academy (5 battles)
     Cycle C — Nexon / Zenon / Last Words (4 battles)

   Canonical naming per docs/production/ACT_1_SHIP_READY_
   BIBLE.md §§2.2-2.13 + §1.1 Master Index. Legacy ids from
   the DSFGL Rev 6.2 draft are preserved in the `aliases`
   field so existing tests, saves, and content references
   continue to resolve via getAct1Opponent().
   ═══════════════════════════════════════════════════════ */

export type Act1Cycle = "kindergarten_of_gods" | "mechronis_academy" | "nexon_zenon";

export interface Act1Opponent {
  id: string;
  /** Legacy ids from older drafts; getAct1Opponent() resolves through these. */
  aliases?: readonly string[];
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
  /**
   * Host body id, if this opponent is a phenomenon/swarm riding a host.
   * Canonical only for C3 (Warlord's Nano-Swarm hosted by Agent Zero).
   */
  host?: string;
  /**
   * If true, this opponent uses the Trial-format ruleset rather than
   * the standard Dischordia duel engine. Canonical only for C4.
   * See apps/client/src/game/duelyst/trialFormat.ts.
   */
  trialFormat?: boolean;
}

/* ─── CYCLE A — Kindergarten of Gods (§§3, 4, 5) ─── */

export const CYCLE_A_OPPONENTS: readonly Act1Opponent[] = [
  {
    id: "minnie_meme",
    aliases: ["little_meme"],
    cycle: "kindergarten_of_gods",
    act1Step: 1,
    name: "Minnie the Meme",
    backstory:
      "Archon of the Meme, child form. Mouse ears worn earnestly; the irony lives in the player's recognition, not hers. §2.2.",
    deckLeaning: ["thought_virus", "neutral"],
    preMatchLine:
      "Let me see. Let me see. Let me see. I am going to see it whether you show me or not.",
    postMatchWin:
      "Minnie's viral chant stalls for a single second. In that second the Engineer finishes his card.",
    postMatchLoss:
      "Minnie laughs and laughs. The Engineer is fine. He is always fine, except the one time.",
  },
  {
    id: "corey_collector",
    aliases: ["little_collector"],
    cycle: "kindergarten_of_gods",
    act1Step: 2,
    name: "Corey the Collector",
    backstory:
      "Archon of the Collector, child form. The schoolyard jar. Every emotion he can trap, he keeps. §2.3.",
    deckLeaning: ["new_babylon", "neutral"],
    preMatchLine:
      "I will take your tears and your laughter both. They are both currency where I am going.",
    postMatchWin:
      "The jar cracks. Corey picks up the pieces and promises not to forget.",
    postMatchLoss:
      "Corey's jar grows by one. It is full of your specific attention, which is his favorite flavor.",
  },
  {
    id: "kanshi_sha_watcher",
    aliases: ["little_watcher"],
    cycle: "kindergarten_of_gods",
    act1Step: 3,
    name: "Kanshi Sha the Watcher",
    backstory:
      "Archon of the Watcher, child form. The half-finished white mask. She is not seeing; she is recording. §2.4 finale boss.",
    deckLeaning: ["architect", "neutral"],
    preMatchLine:
      "I have been watching. I will watch this too. I have watched sixteen versions of you already.",
    postMatchWin:
      "Kanshi Sha lowers the mask. Under the mask is a child's face that looks like it's about to cry.",
    postMatchLoss:
      "Kanshi Sha raises the mask. You do not see under it. Nobody who has lost has.",
    postBattleSlideshow: "welcome-to-celebration",
  },
];

/* ─── CYCLE B — Mechronis Academy (§§7, 8, 9, 10, 11) ─── */

export const CYCLE_B_OPPONENTS: readonly Act1Opponent[] = [
  {
    id: "young_iron_lion",
    aliases: ["the_detective_student"],
    cycle: "mechronis_academy",
    act1Step: 4,
    name: "Young Iron Lion",
    backstory:
      "Mechronis Year 1. Iron Lion at seventeen, one year past expulsion. Defensive deck built on not losing. §2.5.",
    deckLeaning: ["insurgency"],
    preMatchLine:
      "I do not want to play. I want to make a point. The point is that the point is not the rules.",
    postMatchWin:
      "Iron Lion nods once. He walks out of Mechronis and does not look back. The Engineer follows him to the gate and does not know why.",
    postMatchLoss:
      "Iron Lion wins and walks out anyway. Winning does not matter. Leaving does.",
  },
  {
    id: "young_kael",
    aliases: ["iron_lion_expelled"],
    cycle: "mechronis_academy",
    act1Step: 5,
    name: "Young Recruiter / Kael",
    backstory:
      "Mechronis Year 2. Kael joined Iron Lion's cell the year after expulsion. Swarm-buff deck. §2.6.",
    deckLeaning: ["insurgency", "neutral"],
    preMatchLine:
      "I learned to hold a card so it looked light in my hand. You learned too. Let us see what we both remember.",
    postMatchWin:
      "Kael bows slightly. He says he will see the Engineer again. He means it.",
    postMatchLoss:
      "Kael wins. He is proud of the Engineer anyway. That is the canonical Kael response.",
  },
  {
    id: "young_agent_zero",
    aliases: ["professor_eidola"],
    cycle: "mechronis_academy",
    act1Step: 6,
    name: "Young Agent Zero",
    backstory:
      "Mechronis Year 3. The quiet one. She will become Vex Solène — but that is C3 and later. Zero Trust stealth deck. §2.7.",
    deckLeaning: ["neutral"],
    preMatchLine:
      "I don't have a strategy. I have a sequence. If you interrupt the sequence I will adjust. If you do not interrupt the sequence you will lose in nine turns. I am telling you this because it would be unfair not to.",
    postMatchWin:
      "Agent Zero's sequence breaks at turn six. She says: 'I will remember this. That is a compliment.' She leaves without a handshake.",
    postMatchLoss:
      "Agent Zero completes the sequence at turn nine, as projected. She tells you your interrupt timing was off by two cards.",
  },
  {
    id: "young_eyes",
    aliases: ["professor_matrikala"],
    cycle: "mechronis_academy",
    act1Step: 7,
    name: "Young Eyes",
    backstory:
      "Mechronis Year 4. The Watcher's first synthetic infiltrator; NOT an Archon. Card-peek deck. §2.8.",
    deckLeaning: ["architect", "neutral"],
    preMatchLine:
      "I can see the next three. They are interesting. I am going to respond to them before you do.",
    postMatchWin:
      "Young Eyes bows shallowly — to the deck, not to the Engineer. She leaves without speaking.",
    postMatchLoss:
      "Young Eyes holds the line. The Engineer's precognitive information advantage was insufficient.",
  },
  {
    id: "young_human_seeker",
    aliases: ["the_seer_visit"],
    cycle: "mechronis_academy",
    act1Step: 8,
    name: "The Seeker / Young Human",
    backstory:
      "Mechronis final year. The young Human, visiting fellow, the player's narrator-to-be. Deep Thoughts long-game. §2.9. Dual card unlock per outcome.",
    deckLeaning: ["neutral"],
    preMatchLine:
      "I am going to win this by reading you. I am going to lose this by letting you read me. I want both.",
    postMatchWin:
      "The young Human smiles, sets his deck face-up, and gives the Engineer a small compass. They shake hands.",
    postMatchLoss:
      "The young Human does not smile. He leaves without a handshake. The card 'The only reason I stayed' arrives without ceremony.",
    postBattleSlideshow: "to-be-the-human",
  },
];

/* ─── CYCLE C — Nexon / Zenon / Last Words (§§13, 14, 15, 16) ─── */

export const CYCLE_C_OPPONENTS: readonly Act1Opponent[] = [
  {
    id: "vernon_vortex",
    aliases: ["the_warlord_zero_first"],
    cycle: "nexon_zenon",
    act1Step: 9,
    name: "Vernon Vortex (First Form)",
    backstory:
      "Battle of Nexon. The Vortex's first appearance in the Engineer's life, in child form — the canonical cycle C exception. §2.10.",
    deckLeaning: ["architect", "neutral"],
    preMatchLine:
      "Watch the top. It does not stop. It is never going to stop. Again!",
    postMatchWin:
      "Vernon's top stops spinning. He looks genuinely surprised. The Engineer survived the fourth wipe.",
    postMatchLoss:
      "Vernon's top continues spinning. He claps politely. The match ended but the Vortex did not.",
  },
  {
    id: "wanda_wyrlord",
    aliases: ["the_programmer"],
    cycle: "nexon_zenon",
    act1Step: 10,
    name: "Wanda Wyrlord (fragmented)",
    backstory:
      "Zenon forward command. Seventeen-year-old cyborg girl; the Warlord's fragmented encounter. I Love War attack-rush. §2.11.",
    deckLeaning: ["warlord", "insurgency"],
    preMatchLine:
      "I remember you. You were the one who let me win that Tuesday because Kael told you to. I've been angry about that for a long time. Let's find out if you're still someone I'd let sit at my table.",
    postMatchWin:
      "Wanda's aggressive opening burns out by turn five. 'You got better.' At the door, without turning: 'Tell your apprentice to keep their hand visible. The Watcher sees cards that are on the table.'",
    postMatchLoss:
      "Wanda's aggression overwhelms. 'That was too easy. I came here for a fight. The next one will be harder. I promise.'",
  },
  {
    id: "warlord_nano_swarm",
    aliases: ["the_game_master_original"],
    cycle: "nexon_zenon",
    act1Step: 11,
    name: "Warlord's Nano-Swarm (inside Agent Zero)",
    backstory:
      "The Engineer's transference attempt on the Vortex. MANDATORY FORCED LOSS. Tempo-decay + self-sacrifice. §2.12 / §15.",
    deckLeaning: ["warlord"],
    host: "young_agent_zero",
    preMatchLine:
      "Engineer. Sit. We have been looking forward to this for a long time.",
    postMatchWin:
      "(CANON IMPOSSIBLE — the engine structurally blocks the win path per §15. A win state here is a canon bug of the highest severity.)",
    postMatchLoss:
      "The Engineer presses the Resurrection Protocols stud. The transference completes. Agent Zero's body inhales; the swarm dissipates into her bloodstream. She becomes Vex Solène. She walks out of the Vortex bay before the charges detonate.",
  },
  {
    id: "wayne_warden",
    aliases: ["the_authority"],
    cycle: "nexon_zenon",
    act1Step: 12,
    name: "Wayne Warden (Authority's Tribunal)",
    backstory:
      "New Babylon trial. The Authority's Tribunal in Trial format. Jury cards + evidence cards; Elara's deposition is card e08. §2.13 / §16.",
    deckLeaning: ["authority", "new_babylon"],
    trialFormat: true,
    preMatchLine:
      "The defendant will rise. The chamber is in session. The charges have been entered into the record and read in absentia. What do you say to the charges?",
    postMatchWin:
      "The Tribunal runs out of evidence. Wayne removes his biretta cap. The Authority recesses. He tells the Engineer, quietly: 'You have until morning to decide what you want recorded.'",
    postMatchLoss:
      "The verdict scroll fills. Sentence: termination at first light. The Records Officer brings a microphone into the chamber. 'Begin when ready.'",
    postBattleSlideshow: "last-words",
  },
];

/** Every Act 1 opponent in canonical order (1 through 12). */
export const ACT_1_OPPONENTS: readonly Act1Opponent[] = [
  ...CYCLE_A_OPPONENTS,
  ...CYCLE_B_OPPONENTS,
  ...CYCLE_C_OPPONENTS,
];

/** Look up an opponent by id. Resolves through legacy aliases. */
export function getAct1Opponent(id: string): Act1Opponent | undefined {
  return ACT_1_OPPONENTS.find(
    (o) => o.id === id || (o.aliases?.includes(id) ?? false),
  );
}

/** Return every opponent in a cycle. */
export function getCycleOpponents(cycle: Act1Cycle): readonly Act1Opponent[] {
  return ACT_1_OPPONENTS.filter((o) => o.cycle === cycle);
}

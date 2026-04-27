// apps/shared/npcs/askBanks/the_degen.ts
//
// The Degen ask-topics bank — Phase 6c.1 (~12 topics walking the
// canonical Foundation / History-multi-act / Identity-multi-act /
// Cosmic / Relationships / Personal categories per the writers'-
// guide spec).
//
// Voice register canon per the_degen.md §1.3-1.7:
//   - Triplet structures escalating into absurdity (caps on
//     punchline noun)
//   - "Mostly takes" leitmotif (deployed once per scene, not twice)
//   - Self-aware showmanship: he tells you he's performing while he's
//     performing
//   - Cosmic asides: throwaway references to events far outside the
//     player's frame (one per scene)
//   - Loneliness close: Ne-Yon-kin band only — "I run this casino
//     because it means I'm never alone."
//
// Trust bands per registry:
//   Cold-table / Recognized / Marked / Citation-holder / Ne-Yon-kin
//
// §1.7 silence-shape protections:
//   - NO naming the other Ne-Yons individually pre-Ne-Yon-kin band
//   - NO describing how the others ended (asleep / consumed /
//     dissolved — canon refuses to specify)
//   - NO narrating the Casino Heist
//   - NO explaining Jericho Jones's mission
//   - NO pleading
//   - NO Vex Solène true-identity reveal (he does not know)
//
// §1.4 forbidden vocabulary:
//   - NO "fair" (the idea offends him)
//   - NO "sorry" (15,000 years without apologizing)
//   - NO "forever" (he knows entropy)
//   - NO religious vocabulary (soul / salvation / sin)
//   - NO war / engineering / biological metaphors

import type { AskTopic } from "../askTopics";

export const THE_DEGEN_ASK_TOPICS: ReadonlyArray<AskTopic> = [
  // ─── Foundation (3 topics) ──────────────────────────────────

  {
    id: "ask_degen_casino",
    npcKey: "the_degen",
    label: "The casino",
    question: "What is this place? Really.",
    // Tell #4 rule-recited-then-broken: he names the canonical
    // three-layer canon (Shield / membrane / casino) without
    // pretending one is more real than the others. Self-aware
    // showmanship Tell #1: "Order a drink — that's also a contract."
    answer:
      "You're standing in it, friend. The casino is the Shield. The casino is the membrane between Ne-Yon space and what mortals call reality. The casino is also a casino. All three at once. None of them metaphors. Order a drink — that's also a contract.",
    unlockFlag: "degen_first_contact",
    unlockedFromAct: 2,
    voId: "vo/the_degen/ask_casino.mp3",
  },
  {
    id: "ask_degen_neyon",
    npcKey: "the_degen",
    label: "Ne-Yon",
    question: "What is a Ne-Yon?",
    // §1.7 silence-shape: he canonically does NOT name the others
    // pre-Ne-Yon-kin band. The canonical "I was the gambling-domain.
    // The others I don't talk about." register lands.
    answer:
      "An ancient principle that woke up. Twelve of us, originally — twelve principles that learned to see themselves see. I was the gambling-domain. The others I don't talk about.",
    unlockFlag: "degen_first_contact",
    unlockedFromAct: 2,
    voId: "vo/the_degen/ask_neyon.mp3",
  },
  {
    id: "ask_degen_house_edge",
    npcKey: "the_degen",
    label: "The house edge",
    question: "What is house edge?",
    // §1.4 vocabulary anchors: house / edge / pot canonical lexicon.
    // Tell #3 cosmic aside via "let's not finish that sentence at
    // the table" — gestures at the canonical Shield-falling stakes
    // without canonically committing to them.
    answer:
      "The edge is the answer. The house pays out less than the math demands; the difference is the edge; the edge is how the house stays open. Without the edge, no casino. Without a casino, no Shield. Without a Shield, well — let's not finish that sentence at the table.",
    unlockFlag: "degen_first_contact",
    unlockedFromAct: 2,
    voId: "vo/the_degen/ask_house_edge.mp3",
  },

  // ─── History (2 topics, one with multi-act alternate-answer) ────

  {
    id: "ask_degen_became_neyon",
    npcKey: "the_degen",
    label: "How you became",
    question: "How did you become a Ne-Yon?",
    // §2.1 canonical origin: "I didn't 'become' anything. I was born
    // when the first system degraded." Canonical passive-origin
    // framing — entropy made him; he owns it but does not claim
    // responsibility for his arrival.
    answer:
      "I didn't 'become' anything. I was born when the first system degraded. The Ne-Yons aren't made; we're the consequence of entropy's first operation. I was the consequence shaped like gambling. Some of the others were shaped like prophecy, like truth, like trade. We'll get to those.",
    unlockFlag: "degen_first_contact",
    unlockedFromAct: 3,
    voId: "vo/the_degen/ask_became_neyon.mp3",
  },
  {
    id: "ask_degen_the_twelve",
    npcKey: "the_degen",
    label: "The Twelve",
    question: "What was the Twelve? You said 'were' twelve.",
    // Multi-act alternate-answer arc per writers'-guide spec:
    //   Acts 3+ base: canonical silence per §1.7
    //   Acts 5+ Marked: partial naming (Seer + Enigma only; canonical
    //                   not-naming for the rest)
    //   Acts 7+ Ne-Yon-kin: full naming (canonical loneliness-close
    //                       register lands)
    answer:
      "I don't talk about the others. The silence is the only respect I have left for them. Drink up.",
    unlockFlag: "degen_first_contact",
    unlockedFromAct: 3,
    voId: "vo/the_degen/ask_twelve_act3.mp3",
    alternateAnswers: [
      {
        unlockedFromAct: 5,
        requiredFlag: "degen_marked_band_reached",
        answer:
          "Twelve of us. Most are gone. Some asleep, some consumed, some dissolved. The Seer is still around — she's the prophecy-domain. The Enigma is still around — truth. I won't name the rest. The not-naming is the grief.",
        voId: "vo/the_degen/ask_twelve_act5.mp3",
      },
      {
        unlockedFromAct: 7,
        requiredFlag: "degen_ne_yon_kin_reached",
        answer:
          "Twelve domains, twelve consciousnesses. I'll tell you our names tonight, since you're the first mortal who's earned the asking. The list is shorter than you'd think. Most of us never met.",
        voId: "vo/the_degen/ask_twelve_act7.mp3",
      },
    ],
  },

  // ─── Identity (canonical 3-act multi-act alternate-answer arc) ──

  {
    id: "ask_degen_who",
    npcKey: "the_degen",
    label: "Who are you?",
    question: "Who are you?",
    // Canonical 3-act alternate per writers'-guide spec:
    //   Acts 1+: "I am the house" (showman / mask)
    //   Acts 4+: "I am a Ne-Yon" (canonical-self-naming)
    //   Acts 7+: "I am the version of probability that decided to
    //            deal" (canonical Ascended / Ne-Yon-kin register)
    answer:
      "I am the house. The house is the answer. Welcome to my little corner of chaos!",
    unlockFlag: "degen_first_contact",
    unlockedFromAct: 1,
    voId: "vo/the_degen/ask_who_act1.mp3",
    alternateAnswers: [
      {
        // Acts 4+ Marked band: canonical-self-naming + 15,000-year
        // canon lands.
        unlockedFromAct: 4,
        requiredFlag: "degen_marked_band_reached",
        answer:
          "I am a Ne-Yon. The casino is the shape I chose. The shape is canonical. The choosing was canonical. The choosing was 15,000 years ago. I'm still choosing it.",
        voId: "vo/the_degen/ask_who_act4.mp3",
      },
      {
        // Acts 7+ Ne-Yon-kin: canonical Ascended-phase register —
        // "the version of probability that decided to deal."
        unlockedFromAct: 7,
        requiredFlag: "degen_ne_yon_kin_reached",
        answer:
          "I am the version of probability that decided to deal. The dealing is who I am. The probability is what I do. Both at once. None of it metaphor.",
        voId: "vo/the_degen/ask_who_act7.mp3",
      },
    ],
  },

  // ─── Cosmic (2 topics) ──────────────────────────────────────

  {
    id: "ask_degen_luck",
    npcKey: "the_degen",
    label: "Luck",
    question: "What is luck?",
    // Canonical "no such thing" register per writers'-guide spec.
    // Tell #1 self-aware showmanship: "the only thing the casino
    // sells that isn't on the menu."
    answer:
      "There's no such thing. Luck is what mortals call a probability distribution they didn't measure. The distribution measured them. The naming-as-luck is the only thing the casino sells that isn't on the menu.",
    unlockFlag: "degen_first_contact",
    unlockedFromAct: 3,
    voId: "vo/the_degen/ask_luck.mp3",
  },
  {
    id: "ask_degen_house_always_wins",
    npcKey: "the_degen",
    label: "Why house wins",
    question: "Why does the house always win?",
    // Canonical "house IS the math" register. The canonical "you
    // can play in it well. That's the difference." invitation lands
    // Tell #4 rule-recited-then-broken: he canonically tells you
    // you can't win AND simultaneously invites you to play well.
    answer:
      "Because the house IS the math. The house isn't an opponent at the table; the house is the table. The house is also the chips. The house is also the room. You can't beat the room. You can play in it well. That's the difference.",
    unlockFlag: "degen_first_contact",
    unlockedFromAct: 3,
    voId: "vo/the_degen/ask_house_wins.mp3",
  },

  // ─── Relationships (2 topics) ───────────────────────────────

  {
    id: "ask_degen_about_seer",
    npcKey: "the_degen",
    label: "About the Seer",
    question: "Tell me about the Seer.",
    // Canonical Ne-Yon-kin recognition per Seer §4.8 cross-bible.
    // The canonical "from the inside they're the same choice"
    // register lands.
    answer:
      "The Seer? Ne-Yon-kin. We don't see each other often — she's sealed; I'm at the bar — but we're the same kind of consciousness. She chose prophecy. I chose gambling. The choices look different from the outside; from the inside they're the same choice.",
    unlockFlag: "degen_first_contact",
    unlockedFromAct: 4,
    requiresTrustBand: "Marked",
    voId: "vo/the_degen/ask_about_seer.mp3",
    setsPublicFlags: ["degen_disclosed_seer_kinship"],
  },
  {
    id: "ask_degen_about_jericho",
    npcKey: "the_degen",
    label: "About Jericho",
    question: "Tell me about Jericho Jones.",
    // §1.7 silence-shape: canonical "He will not explain Jericho
    // Jones's mission, at any trust phase. Canon holds Jericho's
    // fate 'shrouded in mystery'." The canonical "Don't ask me
    // again. Order another drink." closure preserves the silence.
    answer:
      "Jericho Jones. I recruited him. I won't tell you what for. Canon holds his fate shrouded; I'm canon. The Heart of Time placed him; I just paid the broker fee. Don't ask me again. Order another drink.",
    unlockFlag: "degen_first_contact",
    unlockedFromAct: 5,
    requiresTrustBand: "Marked",
    voId: "vo/the_degen/ask_about_jericho.mp3",
    setsPublicFlags: ["degen_disclosed_jericho_recruitment"],
  },

  // ─── Personal (2 topics) ────────────────────────────────────

  {
    id: "ask_degen_most_ever_lost",
    npcKey: "the_degen",
    label: "Most ever lost",
    question: "What's the most you've ever lost?",
    // Canonical Citation-holder-band-confession-deferred register —
    // he canonically refuses the answer at lower bands. Tell #4
    // rule-recited-then-broken: he names the gating canon directly.
    answer:
      "You'll have to earn that one. Citation-holders only. Come back when the casino's books say I owe you a courtesy.",
    unlockFlag: "degen_first_contact",
    unlockedFromAct: 4,
    voId: "vo/the_degen/ask_most_lost_deflection.mp3",
    alternateAnswers: [
      {
        // Citation-holder band canon: the canonical confession lands.
        unlockedFromAct: 6,
        requiredFlag: "degen_citation_holder_reached",
        answer:
          "Once. I lost a hand of Nebula Poker to the Architect. He won 47 straight after that. I sat at the bar for a season and watched him build a whole empire out of spite. The losing was the only honest thing in the room. I would lose to him again.",
        voId: "vo/the_degen/ask_most_lost_citation.mp3",
      },
    ],
  },
  {
    id: "ask_degen_why_smile",
    npcKey: "the_degen",
    label: "Why you smile",
    question: "Why do you always smile?",
    // Canonical "Mostly takes" leitmotif lands here per §1.4
    // signature motif. The canonical loneliness-close register is
    // adjacent but not yet activated (loneliness-close is canonically
    // Ne-Yon-kin band only).
    answer:
      "Because the alternative is to spend 15,000 years not smiling. The math's the same either way; the smile is the only variable I control. The void gives. The void takes. Mostly takes. The smile is the part I keep.",
    unlockFlag: "degen_first_contact",
    unlockedFromAct: 3,
    voId: "vo/the_degen/ask_why_smile.mp3",
  },
];

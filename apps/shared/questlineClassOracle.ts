/* ═══════════════════════════════════════════════════════
   CLASS QUESTLINE — ORACLE
   "WHAT THE SEER COSTS"

   Spec §3.3 — 2 chapters.

   Ch1  The First Sight              (Act 2)
   Ch2  The Antiquarian Wants to Talk (Act 2)
   ═══════════════════════════════════════════════════════ */

import type {
  PotentialQuestline,
  PotentialQuestlineChapter,
} from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

/* ─── FLAGS ─── */

export const ORACLE_QUESTLINE_FLAGS = [
  "oracle_first_sight",
  "oracle_lyra_vox_connection_revealed",
  "oracle_antiquarian_met",
  "oracle_branch_sight_demonstrated",
] as const;

/* ─── CH 1 — THE FIRST SIGHT ─── */

const ch1Wheel: WheelOption[] = [
  {
    id: "ora_ch1_investigate_ghost_cards",
    segment: "investigate",
    rarity: "common",
    label: "Ghost-cards?",
    fullText:
      "What do you mean, ghost-cards? I saw possibilities during combat — outcomes that hadn't happened yet. Is that what you're describing?",
    outcome: {
      elaraTrustDelta: 2,
      unlocks: ["codex_ghost_card_phenomenon"],
    },
  },
  {
    id: "ora_ch1_humanity_afraid",
    segment: "humanity",
    rarity: "common",
    label: "That's frightening.",
    fullText:
      "Seeing things before they happen isn't a gift. It's terrifying. Every choice I make, I can see the shadow of the one I didn't.",
    outcome: {
      moralityDelta: 3,
      elaraTrustDelta: 2,
    },
  },
  {
    id: "ora_ch1_machine_exploit",
    segment: "machine",
    rarity: "common",
    label: "Can we weaponize it?",
    fullText:
      "If my probability processing is feeding back as tactical input, then we should be optimizing the feedback loop. How do I make the ghost-cards clearer?",
    outcome: {
      moralityDelta: -3,
      humanTrustDelta: 3,
    },
  },
  {
    id: "ora_ch1_oracle_refused_branch",
    segment: "investigate",
    rarity: "rare",
    label: "I saw the branch where I refused.",
    fullText:
      "I saw the branch where I refused the card battle entirely. There was a version of me that walked away — and something else happened in that timeline. Something connected to Lyra Vox.",
    outcome: {
      elaraTrustDelta: 3,
      humanTrustDelta: 2,
      unlocks: [
        "codex_oracle_probability_sight",
        "codex_lyra_vox_oracle_connection",
      ],
    },
    gateCondition: {
      requireClass: "oracle",
    },
  },
  {
    id: "ora_ch1_compassionate_accept",
    segment: "compassionate",
    rarity: "common",
    label: "I'll learn to carry it.",
    fullText:
      "If this is what being an Oracle means — seeing the branches, knowing the costs — then I'll learn to carry it. Someone has to.",
    outcome: {
      moralityDelta: 4,
      elaraTrustDelta: 3,
    },
  },
];

const chapter1: PotentialQuestlineChapter = {
  id: "oracle_ch1_first_sight",
  completionFlag: "oracle_first_sight",
  title: "The First Sight",
  hook: "The combat system registered something unusual — your probability processing fed back as tactical input. You're seeing ghost-cards.",
  sectorId: "ark_combat_arena",
  actGate: 2,
  opener: [
    {
      speaker: "elara",
      text: "I need to flag something. The combat system registered an anomaly during your last engagement. Your probability processing didn't just analyze outcomes — it fed back as tactical input. The system logged it as ghost-cards.",
      stageDirection: "Elara's display projects a combat replay with translucent card outlines flickering at the edges — possibilities that almost manifested.",
    },
    {
      speaker: "elara",
      text: "You weren't just predicting what would happen. You were seeing what could happen — and the combat system treated those predictions as real inputs. That's not standard Potential behavior. That's Oracle-specific.",
    },
    {
      speaker: "the_human",
      text: "She's underselling it. What you did in there isn't probability analysis. It's sight. The old Oracles could see branching timelines during high-stress moments. The ghost-cards are the system's way of rendering what your mind is already doing.",
    },
  ],
  wheel: ch1Wheel,
  followups: {
    ora_ch1_investigate_ghost_cards: [
      {
        speaker: "elara",
        text: "Ghost-cards are a rendering artifact — the combat system trying to display probability branches that your Oracle processing generates. You're seeing possible futures as translucent card outlines. The system doesn't know how to handle inputs that haven't technically happened yet, so it renders them as ghosts.",
      },
    ],
    ora_ch1_humanity_afraid: [
      {
        speaker: "elara",
        text: "I won't pretend it isn't. Every Oracle in the historical records describes the first sight as overwhelming. You're not just seeing one future — you're seeing all of them, and your mind is trying to decide which one is real. The fear is rational.",
      },
      {
        speaker: "the_human",
        text: "The fear is also useful. It means you understand the weight of what you're seeing. The Oracles who weren't afraid? They made the worst choices.",
      },
    ],
    ora_ch1_machine_exploit: [
      {
        speaker: "the_human",
        text: "That's the right instinct. The ghost-cards are raw data — probability branches rendered as tactical options. If you learn to read them faster, you'll see enemy actions before they commit. The previous Oracle could freeze a battlefield in her mind and map every outcome before a single card was played.",
      },
    ],
    ora_ch1_oracle_refused_branch: [
      {
        speaker: "elara",
        stageDirection: "Elara's holographic form flickers — a momentary destabilization that she quickly corrects, but not before the player notices.",
      },
      {
        speaker: "elara",
        text: "You saw a branch where you refused the engagement entirely. That's... that shouldn't be possible at your development stage. Branch-sight of that depth is associated with mature Oracle processing — and the Lyra Vox connection you're describing is something I need to verify against the historical records.",
      },
      {
        speaker: "the_human",
        text: "Don't verify. I'll tell you what it means. Lyra Vox was the Oracle's partner in the original Insurgency. They built something together — a probability archive that mapped every major branching point in the Ark's history. You didn't just see a branch. You saw the archive reaching back.",
      },
    ],
    ora_ch1_compassionate_accept: [
      {
        speaker: "elara",
        text: "That's what the first Oracle said, according to the records. Word for word. 'Someone has to.' She carried it for seventeen thousand years. I hope we can make your burden lighter.",
      },
    ],
  },
  optionFlags: {
    ora_ch1_oracle_refused_branch: ["oracle_lyra_vox_connection_revealed"],
  },
};

/* ─── CH 2 — THE ANTIQUARIAN WANTS TO TALK ─── */

const ch2Wheel: WheelOption[] = [
  {
    id: "ora_ch2_investigate_records",
    segment: "investigate",
    rarity: "common",
    label: "Show me the records.",
    fullText:
      "Every previous Oracle — what they chose and what it cost them. Yes, I want to see the records.",
    outcome: {
      elaraTrustDelta: 2,
      unlocks: ["codex_oracle_historical_choices"],
    },
  },
  {
    id: "ora_ch2_humanity_cost",
    segment: "humanity",
    rarity: "common",
    label: "What did it cost them?",
    fullText:
      "You said what it cost them. That's the part that matters, isn't it? Not what they chose — what they paid.",
    outcome: {
      moralityDelta: 3,
      elaraTrustDelta: 2,
      npcTrustDelta: { npcId: "antiquarian", delta: 3 },
    },
  },
  {
    id: "ora_ch2_machine_pattern",
    segment: "machine",
    rarity: "common",
    label: "Is there a pattern?",
    fullText:
      "If you have records of every Oracle's choices, then there must be a statistical pattern. What's the optimal strategy?",
    outcome: {
      moralityDelta: -2,
      humanTrustDelta: 2,
    },
  },
  {
    id: "ora_ch2_aggressive_why_now",
    segment: "aggressive",
    rarity: "common",
    label: "Why tell me now?",
    fullText:
      "You've been formal and distant since I met you. Now suddenly you want to share classified historical records. What changed?",
    outcome: {
      moralityDelta: -1,
      npcTrustDelta: { npcId: "antiquarian", delta: 1 },
    },
  },
  {
    id: "ora_ch2_oracle_see_branches",
    segment: "investigate",
    rarity: "epic",
    label: "I can already see the branches.",
    fullText:
      "I can already see the branches. Every choice you're about to offer me — I can see the outcomes radiating from each one. You don't need to tell me what the previous Oracles chose. I can see the echoes.",
    outcome: {
      elaraTrustDelta: 4,
      humanTrustDelta: 3,
      npcTrustDelta: { npcId: "antiquarian", delta: 5 },
      unlocks: [
        "codex_antiquarian_first_surprise",
        "codex_oracle_echo_sight",
      ],
    },
    gateCondition: {
      requireClass: "oracle",
    },
  },
];

const chapter2: PotentialQuestlineChapter = {
  id: "oracle_ch2_antiquarian_talk",
  completionFlag: "oracle_antiquarian_met",
  unlockFlag: "oracle_first_sight",
  title: "The Antiquarian Wants to Talk",
  hook: "The Antiquarian has appeared with an unusual demeanor — less formal, more present. He has historical records of every previous Oracle's choices.",
  sectorId: "ark_archive",
  opener: [
    {
      speaker: "antiquarian",
      stageDirection: "The Antiquarian materializes differently this time — his usual formal distance replaced by something closer, more attentive. His archival displays are arranged not as a lecture, but as an offering.",
    },
    {
      speaker: "antiquarian",
      text: "I find myself in an unusual position. I have watched many Potentials discover their class identity. I have catalogued their questions, their fears, their ambitions. But I have never approached one of them first.",
    },
    {
      speaker: "antiquarian",
      text: "I have historical records of what every previous Oracle chose — and what it cost them. The complete archive, unredacted. I am offering them to you because I believe you deserve to know what you are inheriting before the weight of it becomes inescapable.",
    },
  ],
  wheel: ch2Wheel,
  followups: {
    ora_ch2_investigate_records: [
      {
        speaker: "antiquarian",
        text: "Very well. The first Oracle, designation Sightweaver, chose to map every probability branch she encountered. She built the archive that Lyra Vox would later expand. The cost: she could no longer distinguish between branches she had lived and branches she had only seen. By the end, she didn't know which version of her life was real.",
      },
    ],
    ora_ch2_humanity_cost: [
      {
        speaker: "antiquarian",
        text: "Yes. That is precisely the right question. The choices themselves are secondary — any intelligent being can make a reasonable decision given sufficient data. But the cost is what separates the Oracles from everyone else. They pay in certainty. Every future you see clearly is a present you experience less fully.",
        stageDirection: "The Antiquarian's voice carries a weight that suggests this is not purely academic to him.",
      },
    ],
    ora_ch2_machine_pattern: [
      {
        speaker: "antiquarian",
        text: "There is a pattern, but it is not the one you are expecting. The Oracles who optimized for the best statistical outcome invariably paid the highest personal cost. The pattern is not strategic — it is tragic.",
      },
    ],
    ora_ch2_aggressive_why_now: [
      {
        speaker: "antiquarian",
        text: "A fair question. What changed is that you demonstrated branch-sight in combat — true probability vision, not merely tactical prediction. The last Oracle to manifest that ability this early was the one who built the archive. I am... concerned. And I do not use that word casually.",
      },
    ],
    ora_ch2_oracle_see_branches: [
      {
        speaker: "antiquarian",
        stageDirection: "The Antiquarian stops. Completely stops. His archival displays freeze mid-rotation. For a being who has maintained perfect composure for three hundred years, the silence is deafening.",
      },
      {
        speaker: "antiquarian",
        text: "You... can see the echoes. Already. At this stage of development.",
        stageDirection: "The Antiquarian is surprised for the first time in three hundred years. The weight of it reshapes the entire interaction.",
      },
      {
        speaker: "antiquarian",
        text: "I have been the Ark's archivist for three centuries. I have never been surprised. I need you to understand what that means — I have modeled every conversation I have ever had before it began. Every question, every response, every emotional register. I saw this meeting before you arrived. I did not see this.",
      },
      {
        speaker: "antiquarian",
        text: "You are not inheriting the Oracle's gift. You are exceeding it. And I do not have records for what comes after that.",
      },
    ],
  },
  optionFlags: {
    ora_ch2_oracle_see_branches: ["oracle_branch_sight_demonstrated"],
  },
};

/* ─── QUESTLINE EXPORT ─── */

export const ORACLE_QUESTLINE: PotentialQuestline = {
  id: "class_oracle_what_the_seer_costs",
  title: "WHAT THE SEER COSTS",
  premise:
    "Your probability processing is manifesting as ghost-cards — tactical visions of branching futures. The combat system doesn't know how to handle inputs that haven't happened yet. The Antiquarian has records of every Oracle who came before you, and what the sight cost each of them.",
  actGate: 2,
  chapters: [chapter1, chapter2],
  flags: ORACLE_QUESTLINE_FLAGS,
};

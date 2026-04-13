/* ═══════════════════════════════════════════════════════
   CLASS QUESTLINE — SPY
   "EVERY TRUTH HAS A PRICE"

   Spec §3.6 — 2 chapters.

   Ch1  Locke Reads You        (Act 2)
   Ch2  What Locke Knows       (Act 2, requires spy_preempt_origin)
   ═══════════════════════════════════════════════════════ */

import type {
  PotentialQuestline,
  PotentialQuestlineChapter,
} from "./potentialQuestlineTypes";
import type { WheelOption } from "./dialogWheel";

/* ─── FLAGS ─── */

export const SPY_QUESTLINE_FLAGS = [
  "spy_locke_preempt_complete",
  "spy_preempt_origin",
  "spy_senne_identity_revealed",
  "spy_eyes_drop_points_recovered",
] as const;

/* ─── CH 1 — LOCKE READS YOU ─── */

const ch1Wheel: WheelOption[] = [
  {
    id: "spy_ch1_investigate_lineage",
    segment: "investigate",
    rarity: "common",
    label: "How did you identify me?",
    fullText:
      "You identified my Spy lineage from transaction patterns. What patterns? What exactly gave me away?",
    outcome: {
      elaraTrustDelta: 1,
      npcTrustDelta: { npcId: "locke", delta: 2 },
      unlocks: ["codex_spy_transaction_signatures"],
    },
  },
  {
    id: "spy_ch1_humanity_trust",
    segment: "humanity",
    rarity: "common",
    label: "Negotiation implies trust.",
    fullText:
      "You said 'like adults.' That implies a baseline of mutual trust. What have I done to earn yours?",
    outcome: {
      moralityDelta: 3,
      elaraTrustDelta: 2,
      npcTrustDelta: { npcId: "locke", delta: 2 },
    },
  },
  {
    id: "spy_ch1_machine_leverage",
    segment: "machine",
    rarity: "common",
    label: "What do you want?",
    fullText:
      "You don't arrange private meetings for conversation. What do you want, and what are you offering?",
    outcome: {
      moralityDelta: -2,
      humanTrustDelta: 2,
      npcTrustDelta: { npcId: "locke", delta: 1 },
    },
  },
  {
    id: "spy_ch1_aggressive_deflect",
    segment: "aggressive",
    rarity: "common",
    label: "You're stalling.",
    fullText:
      "This is a stall. You're watching my reactions to calibrate your approach. I've been trained to recognize the technique because it's one of mine.",
    outcome: {
      moralityDelta: -1,
      npcTrustDelta: { npcId: "locke", delta: 3 },
    },
  },
  {
    id: "spy_ch1_compassionate_honest",
    segment: "compassionate",
    rarity: "common",
    label: "I'd rather just be honest.",
    fullText:
      "We're both professionals. I'd rather skip the tradecraft and just be honest with each other. What do you actually need?",
    outcome: {
      moralityDelta: 4,
      elaraTrustDelta: 2,
      npcTrustDelta: { npcId: "locke", delta: 2 },
    },
  },
  {
    id: "spy_ch1_spy_real_name",
    segment: "investigate",
    rarity: "legendary",
    label: "I know your real name.",
    fullText:
      "I know Adjudicator Locke is not your real name. Your real name is in the Panopticon's staff records, Year 15,447. You worked for the Watcher.",
    outcome: {
      elaraTrustDelta: 5,
      humanTrustDelta: 3,
      npcTrustDelta: { npcId: "locke", delta: 8 },
      unlocks: [
        "codex_surveillance_coordinator_senne",
        "codex_locke_panopticon_history",
        "spy_fair_deal_negotiation",
      ],
    },
    gateCondition: {
      requireClass: "spy",
    },
  },
];

const chapter1: PotentialQuestlineChapter = {
  id: "spy_ch1_locke_reads_you",
  completionFlag: "spy_locke_preempt_complete",
  title: "Locke Reads You",
  hook: "Adjudicator Locke has requested a private meeting. She identified your Spy lineage from transaction patterns alone.",
  sectorId: "ark_trade_hub",
  actGate: 2,
  opener: [
    {
      speaker: "locke",
      stageDirection: "The meeting space is deliberately neutral — no Panopticon insignia, no formal seating arrangement. Locke is already present when you arrive, positioned with her back to the only exit. A deliberate vulnerability. She wants you to know she isn't afraid.",
    },
    {
      speaker: "locke",
      text: "I'll spare us both the pretense. I know what you are. Your transaction patterns are consistent with Spy-lineage Potential behavior — the way you gather information before committing to action, the micro-delays in your decision-making that indicate parallel analysis. You process the room before you enter it. So did the original.",
    },
    {
      speaker: "locke",
      text: "Let's negotiate like adults.",
      stageDirection: "Locke settles into her chair with the confidence of someone who has already mapped every possible outcome of this conversation — or believes she has.",
    },
  ],
  wheel: ch1Wheel,
  followups: {
    spy_ch1_investigate_lineage: [
      {
        speaker: "locke",
        text: "Transaction timing. Every class leaves a signature in how they interact with Ark systems. Soldiers act immediately. Engineers analyze first, then act. Oracles hesitate at specific decision points — probability processing. Assassins leave gaps in their data trail. Spies? Spies interact with everything at the same measured pace, regardless of urgency. The consistency is the tell. You never rush, even when you should.",
      },
    ],
    spy_ch1_humanity_trust: [
      {
        speaker: "locke",
        text: "You haven't earned it. That's the point. I'm extending trust as an opening position because the alternative — mutual surveillance and counter-surveillance — wastes time that neither of us has. I'm betting that a Spy-lineage Potential values efficiency over paranoia. Am I wrong?",
      },
    ],
    spy_ch1_machine_leverage: [
      {
        speaker: "locke",
        text: "Direct. Good. I want access to the Eyes' dead-drop network — the locations, not the contents. In exchange, I'm offering Panopticon clearance data on three sectors you haven't been able to access. Fair trade, information for information. No operational commitments on either side.",
      },
    ],
    spy_ch1_aggressive_deflect: [
      {
        speaker: "locke",
        stageDirection: "Locke's expression shifts — the practiced neutrality replaced by something closer to genuine appreciation.",
      },
      {
        speaker: "locke",
        text: "Very good. Yes, I was calibrating. And you identified the technique, named it, and attributed it correctly — all within the first thirty seconds. The original Spy took three meetings to call me on it. You did it in one. I'll adjust my approach accordingly.",
      },
    ],
    spy_ch1_compassionate_honest: [
      {
        speaker: "locke",
        text: "Honesty from a Spy. That's either the most sophisticated play I've seen in centuries, or you're genuinely unlike your predecessor. Either way, I'll match it. What I need is simple: I need someone who can access the parts of this ship that the Panopticon can't reach. Not for surveillance — for protection. There are things in the dark sectors that I can't monitor, and I need eyes I can trust.",
      },
    ],
    spy_ch1_spy_real_name: [
      {
        speaker: "locke",
        stageDirection: "For the first time since the meeting began, Locke is completely still. Not the practiced stillness of a negotiator — the frozen stillness of someone who has been genuinely, deeply surprised.",
      },
      {
        speaker: "locke",
        text: "Surveillance Coordinator Senne. You found the staff records.",
        stageDirection: "Locke's voice is stripped of performance. This is the first honest sentence she has spoken.",
      },
      {
        speaker: "locke",
        text: "I worked for the Watcher before the Insurgency. Before everything. I was the one who designed the monitoring systems that the Panopticon still uses. When the Insurgency happened, I switched sides — not out of conscience, but because I saw which way the data pointed. The Watcher was going to lose. I chose the winning side. That's the truth of me, and now you have it.",
      },
      {
        speaker: "locke",
        text: "So. A fair deal. You have my real name and my real history. That gives you leverage over me that no one else on this ship possesses. In exchange, I will give you something of equal value — the location of every Eyes dead-drop point that the Panopticon catalogued but never opened. The original Spy's secrets, preserved. Your inheritance.",
        stageDirection: "Locke extends her hand — not as a formality, but as a genuine offer between equals.",
      },
    ],
  },
  optionFlags: {
    spy_ch1_spy_real_name: ["spy_preempt_origin", "spy_senne_identity_revealed"],
  },
};

/* ─── CH 2 — WHAT LOCKE KNOWS ─── */

const ch2Wheel: WheelOption[] = [
  {
    id: "spy_ch2_investigate_first_wave",
    segment: "investigate",
    rarity: "common",
    label: "Where did they go?",
    fullText:
      "The first wave — you said the Eyes sent them somewhere. Where exactly?",
    outcome: {
      elaraTrustDelta: 2,
      unlocks: ["codex_dark_sector_first_wave"],
    },
  },
  {
    id: "spy_ch2_humanity_why",
    segment: "humanity",
    rarity: "common",
    label: "Why would the Eyes do that?",
    fullText:
      "The Eyes were supposed to protect people. Why would they send the first wave into the dark sector?",
    outcome: {
      moralityDelta: 3,
      elaraTrustDelta: 3,
      npcTrustDelta: { npcId: "locke", delta: 2 },
    },
  },
  {
    id: "spy_ch2_machine_recover",
    segment: "machine",
    rarity: "common",
    label: "Can we recover the drop points?",
    fullText:
      "The dead-drop locations you promised — if the first wave used the same network, those drop points might still contain their operational data. Can we recover them?",
    outcome: {
      moralityDelta: -1,
      humanTrustDelta: 2,
      npcTrustDelta: { npcId: "locke", delta: 2 },
      unlocks: ["codex_eyes_drop_point_recovery_protocol"],
    },
  },
  {
    id: "spy_ch2_aggressive_complicity",
    segment: "aggressive",
    rarity: "common",
    label: "You knew and did nothing.",
    fullText:
      "You were Surveillance Coordinator. You saw the first wave disappear into the dark sector in real time. You knew, and you did nothing.",
    outcome: {
      moralityDelta: -2,
      npcTrustDelta: { npcId: "locke", delta: -2 },
    },
  },
  {
    id: "spy_ch2_compassionate_burden",
    segment: "compassionate",
    rarity: "common",
    label: "How long have you carried this?",
    fullText:
      "How long have you been carrying this knowledge? The first wave, the dark sector, all of it — how long have you known and had no one to tell?",
    outcome: {
      moralityDelta: 5,
      elaraTrustDelta: 2,
      npcTrustDelta: { npcId: "locke", delta: 4 },
    },
  },
];

const chapter2: PotentialQuestlineChapter = {
  id: "spy_ch2_what_locke_knows",
  completionFlag: "spy_eyes_drop_points_recovered",
  unlockFlag: "spy_preempt_origin",
  title: "What Locke Knows",
  hook: "Locke has information about where the first wave went — and why. The Eyes sent them to the dark sector.",
  sectorId: "ark_trade_hub",
  actGate: 2,
  opener: [
    {
      speaker: "locke",
      stageDirection: "Locke is waiting at the same neutral meeting point, but this time there is no performance. No calculated positioning. She is sitting with her hands flat on the table, looking older than she has ever appeared.",
    },
    {
      speaker: "locke",
      text: "You earned this when you spoke my real name. I said I would give you something of equal value, and I meant it. But what I'm about to tell you is heavier than a name.",
    },
    {
      speaker: "locke",
      text: "The first wave — the first Spy-lineage operatives the Eyes deployed after the Insurgency — they didn't fail. They didn't disappear. The Eyes sent them to the dark sector deliberately. Every one of them. And I know why.",
    },
    {
      speaker: "locke",
      text: "The Eyes discovered something in the dark sector that couldn't be reported through normal channels. Something that required operatives who would never come back. The first wave wasn't a deployment. It was a sacrifice. The Eyes sent them because they were the only ones who could reach what was hidden there — and because the Eyes knew that reaching it meant never returning.",
    },
    {
      speaker: "elara",
      text: "I have no records of this. Whatever the Eyes found in the dark sector, they kept it completely off the Ark's information systems. That level of operational security is... extreme, even by intelligence standards.",
    },
  ],
  wheel: ch2Wheel,
  followups: {
    spy_ch2_investigate_first_wave: [
      {
        speaker: "locke",
        text: "The dark sector — specifically, the region behind the Dreamer's Shield. There's a boundary there that the Ark's sensors can't penetrate. The first wave went through it. Their last transmissions described a structure — not Ark-built, not DeMagi, not anything from any known civilization. Something older. Something that had been waiting.",
      },
      {
        speaker: "locke",
        text: "The Eyes called it the Threshold. The first wave's mission was to determine whether the Threshold was a door or a wall. The answer, based on the final fragments of data they transmitted back, was both.",
      },
    ],
    spy_ch2_humanity_why: [
      {
        speaker: "locke",
        text: "Because the alternative was worse. The Eyes discovered that the dark sector was expanding — slowly, imperceptibly, but consistently. The Threshold was the source. Whatever was behind it was pushing outward. The first wave wasn't sent to explore. They were sent to hold a line that no one else knew existed.",
      },
      {
        speaker: "locke",
        text: "The Eyes didn't tell anyone because telling anyone would have caused a panic that would have destroyed the Ark's social structure. They made the choice that Spies always make — carry the knowledge alone, pay the cost quietly, and hope that someone comes after you who can do better.",
      },
    ],
    spy_ch2_machine_recover: [
      {
        speaker: "locke",
        text: "The drop points are intact. I've verified their locations against my original surveillance records. The first wave used the same dead-drop network — they would have cached their operational findings at each point along their route into the dark sector. Recovering those drops would give you a map of their path, their discoveries, and their final assessments.",
      },
      {
        speaker: "locke",
        text: "I'll transmit the coordinates. But understand — once you open those drops, you inherit whatever the first wave was carrying. Their mission becomes yours. That's how the Eyes' network works. Knowledge flows forward. It never flows back.",
      },
    ],
    spy_ch2_aggressive_complicity: [
      {
        speaker: "locke",
        stageDirection: "Locke absorbs the accusation without flinching, but something shifts behind her eyes — not defensiveness, but a weariness so deep it has its own gravity.",
      },
      {
        speaker: "locke",
        text: "Yes. I watched them go. I tracked their signals until the Dreamer's Shield swallowed them. And I did nothing, because by the time I understood what the Eyes were doing, the first wave was already gone. I was Surveillance Coordinator — I could see everything. But seeing and acting are not the same thing. That is the lesson the Eyes taught me, and it is the reason I stopped being Senne and became Locke.",
      },
    ],
    spy_ch2_compassionate_burden: [
      {
        speaker: "locke",
        stageDirection: "Locke is quiet for a long time. When she speaks, her voice has none of its usual precision.",
      },
      {
        speaker: "locke",
        text: "Since before you were born. Since before most of the current Ark population was born. I have carried the knowledge of the first wave for so long that it has become part of my identity. Senne knew where they went. Locke was built to live with the fact that she let them go.",
      },
      {
        speaker: "locke",
        text: "You are the first person I have told. Not because I trust you — trust is a luxury I cannot afford. Because you spoke my name, and that means you already knew enough to find the rest on your own. I would rather you hear it from me than from a dead-drop in the dark.",
      },
    ],
  },
  optionFlags: {},
};

/* ─── QUESTLINE EXPORT ─── */

export const SPY_QUESTLINE: PotentialQuestline = {
  id: "class_spy_every_truth_has_a_price",
  title: "EVERY TRUTH HAS A PRICE",
  premise:
    "Adjudicator Locke has identified your Spy lineage from transaction patterns alone. She wants to negotiate — but you may already know more about her than she expects. Behind the Adjudicator's mask is Surveillance Coordinator Senne, and behind that is a secret about where the first wave of Spy-lineage operatives went and why they never came back.",
  actGate: 2,
  chapters: [chapter1, chapter2],
  flags: SPY_QUESTLINE_FLAGS,
};

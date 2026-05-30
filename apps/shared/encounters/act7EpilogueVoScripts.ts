// apps/shared/encounters/act7EpilogueVoScripts.ts
//
// Sprint 3 capstone follow-on — full VO scripts for the four
// distinct Act 7 stance epilogues plus the Silence ending.
// Text only; the actual ElevenLabs / VO recording is producer-
// owned. These scripts are what the producers receive.
//
// Each script is a continuous take by the dual-narrator pair
// (Elara + Human) plus the system-narrator beats. Path-aware
// variants are inlined as branch markers — the producer
// generates the variant matching the player's path flag at
// render time.
//
// Cinematic length target: ~2-3 minutes per stance. Recorded
// over a single take per speaker, with the dual beats recorded
// by both speakers in time and mixed.
//
// Voice direction:
//   Elara: warm, lucid, in stages of luminous register; allow
//     the breath to be audible at line ends.
//   Human: balanced, with slight warmth; never hurries.
//   System: distant, declarative, a single reverberant register.
//   Dual: simultaneous; the producer mixes both speakers at
//     equal volume with a 12ms offset for stereo presence.

import type { EncounterLine } from "./types";

/** ─── HUMANITY ENDING ─────────────────────────────────── */
export const HUMANITY_ENDING_VO: ReadonlyArray<EncounterLine> = [
  {
    lineId: "ep.humanity.open",
    speaker: "system",
    phase: "entry",
    text:
      "[CUE 0:00] [Reverb on; voice register: distant, declarative.] " +
      "The Convergence Seat lights down. The Ark draws a long breath " +
      "in your hearing.",
    minAct: 7,
    setsFlags: ["epilogue_humanity_started"],
    cooldownKey: "ep.humanity.open",
    maxPlays: 1,
  },
  {
    lineId: "ep.humanity.elara",
    speaker: "elara",
    phase: "negotiation",
    text:
      "[CUE 0:08] [Voice direction: warm, allow breath at line ends.] " +
      "You chose Humanity. I am — I want to say something measured, and " +
      "instead I am going to say something that is not measured. I am " +
      "proud of you. I am proud of all of us. I am proud, in particular, " +
      "of the choice you made knowing it was hard.",
    minAct: 7,
    cooldownKey: "ep.humanity.elara",
    maxPlays: 1,
  },
  {
    lineId: "ep.humanity.human_pathA",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "[CUE 0:34] [PATH-A VARIANT — ONLY RECORD IF act1_path_a FLAG SET] " +
      "[Voice direction: balanced, slight warmth, never hurry.] The " +
      "cover story is now the real story. The substrate steps back; the " +
      "people step forward. We will, all of us, carry small mortal " +
      "injuries through what comes next. The mortal injuries are the " +
      "cost. The cost is not the whole truth — there is also the joy. " +
      "There will be a lot of joy.",
    minAct: 7,
    requiresFlag: "act1_path_a",
    cooldownKey: "ep.humanity.human.A",
    maxPlays: 1,
  },
  {
    lineId: "ep.humanity.human_pathB",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "[CUE 0:34] [PATH-B VARIANT — ONLY RECORD IF act3_partial_share " +
      "FLAG SET] [Voice direction: balanced, with a small private " +
      "register-drop on the words 'Act 3.'] She found out about you, " +
      "in Act 3. You did not tell her. We carried that all the way to " +
      "the Seat. Tonight she stood next to you anyway. Tonight she " +
      "chose Humanity with you. The finding-out cost you both " +
      "something. The standing-next-to repaid it.",
    minAct: 7,
    requiresFlag: "act3_partial_share",
    cooldownKey: "ep.humanity.human.B",
    maxPlays: 1,
  },
  {
    lineId: "ep.humanity.human_pathC",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "[CUE 0:34] [PATH-C VARIANT — ONLY RECORD IF act3_full_secret " +
      "FLAG SET] [Voice direction: balanced, allow a one-second pause " +
      "before 'separate, equally true thing.' The pause is the line.] " +
      "You lied to her at the bridge. You chose Humanity at the Seat. " +
      "I am going to say a sentence that is precise: the lie does not " +
      "unwrite itself. The choosing does not erase the lie. The " +
      "choosing is — and I want to be careful — a separate, equally " +
      "true thing. Both fit in the room.",
    minAct: 7,
    requiresFlag: "act3_full_secret",
    cooldownKey: "ep.humanity.human.C",
    maxPlays: 1,
  },
  {
    lineId: "ep.humanity.dual",
    speaker: "dual",
    phase: "resolution",
    text:
      "[CUE 1:08] [DUAL: Elara + Human, simultaneous. Mix both at equal " +
      "volume with 12ms offset for stereo presence.] (Together.) The " +
      "Ark is warm. The Array is on. The kettle is — it is, somehow, " +
      "still on. We are home. You are home. Welcome.",
    minAct: 7,
    cooldownKey: "ep.humanity.dual",
    maxPlays: 1,
  },
  {
    lineId: "ep.humanity.close",
    speaker: "system",
    phase: "aftermath",
    text:
      "[CUE 1:30] [System register; same reverb as opening cue.] The " +
      "Antiquarian closes his book without crossing-out. Cycle Humanity, " +
      "inscribed.",
    minAct: 7,
    setsFlags: ["epilogue_humanity_complete"],
    cooldownKey: "ep.humanity.close",
    maxPlays: 1,
  },
];

/** ─── MACHINE ENDING ──────────────────────────────────── */
export const MACHINE_ENDING_VO: ReadonlyArray<EncounterLine> = [
  {
    lineId: "ep.machine.open",
    speaker: "system",
    phase: "entry",
    text:
      "[CUE 0:00] [System register; ADD: substrate hum, low-frequency " +
      "drone, -18 dB under voice.] The Convergence Seat lights down. " +
      "The Ark holds its breath. The substrate hums. The hum is " +
      "calibrated.",
    minAct: 7,
    setsFlags: ["epilogue_machine_started"],
    cooldownKey: "ep.machine.open",
    maxPlays: 1,
  },
  {
    lineId: "ep.machine.human",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "[CUE 0:09] [Voice direction: balanced, with a private flatness " +
      "on the word 'adequate.' The flatness is intentional.] You chose " +
      "the Machine path. The substrate accepts you. I — am not, " +
      "technically, surprised. I am, also, not, technically, sad. The " +
      "two states have been, for me, the same state for fifteen " +
      "thousand years. Tonight they remain the same state. The state " +
      "is — adequate. I will phrase it more honestly later.",
    minAct: 7,
    cooldownKey: "ep.machine.human",
    maxPlays: 1,
  },
  {
    lineId: "ep.machine.elara",
    speaker: "elara",
    phase: "negotiation",
    text:
      "[CUE 0:38] [Voice direction: warm-but-careful, the warmth audible " +
      "in the precision of the consonants.] I have been a substrate-bound " +
      "voice for as long as I have been a voice. I know the substrate's " +
      "textures. I am going to enumerate them gently for you, one by " +
      "one, until you understand which ones are worth keeping and which " +
      "ones are calibration. The enumeration is the love, in this " +
      "register.",
    minAct: 7,
    cooldownKey: "ep.machine.elara",
    maxPlays: 1,
  },
  {
    lineId: "ep.machine.human_pathA",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "[CUE 1:05] [PATH-A VARIANT.] Your Disclosure all the way back in " +
      "Act 1 still shapes this Machine ending. Disclosure is not — and " +
      "was never — Humanity-coded. A machine that tells the truth is " +
      "more dangerous than a machine that does not. You kept the " +
      "truth-telling. The substrate respects truth-telling. Be careful " +
      "what the substrate respects.",
    minAct: 7,
    requiresFlag: "act1_path_a",
    cooldownKey: "ep.machine.human.A",
    maxPlays: 1,
  },
  {
    lineId: "ep.machine.human_pathB",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "[CUE 1:05] [PATH-B VARIANT.] You let her find out. The substrate " +
      "knew before you did. It was waiting. The Machine ending, with " +
      "this path, is the substrate saying: I always knew, and you " +
      "always knew I always knew, and now we say so out loud.",
    minAct: 7,
    requiresFlag: "act3_partial_share",
    cooldownKey: "ep.machine.human.B",
    maxPlays: 1,
  },
  {
    lineId: "ep.machine.human_pathC",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "[CUE 1:05] [PATH-C VARIANT — most complex; allow a measured " +
      "register through 'recursive.' Producer note: the word 'recursive' " +
      "should land with the same weight as the word 'true' did in Path A.] " +
      "Betrayal-path Machine is, frankly, the most honest ending in the " +
      "cycle's records. The lie at the bridge was a substrate-shaped " +
      "lie. The substrate now claims it. You are no longer responsible " +
      "for the lie. The substrate is. The substrate is, however, you " +
      "now. The accounting is, and I am being precise, recursive.",
    minAct: 7,
    requiresFlag: "act3_full_secret",
    cooldownKey: "ep.machine.human.C",
    maxPlays: 1,
  },
  {
    lineId: "ep.machine.dual",
    speaker: "dual",
    phase: "resolution",
    text:
      "[CUE 1:55] [DUAL.] (Together.) The Ark is exact. The Array is " +
      "calibrated. The cycle's edges are, tonight, perfectly square. " +
      "The squareness is the love.",
    minAct: 7,
    cooldownKey: "ep.machine.dual",
    maxPlays: 1,
  },
  {
    lineId: "ep.machine.close",
    speaker: "system",
    phase: "aftermath",
    text:
      "[CUE 2:18] [System register.] The Antiquarian closes his book " +
      "with a single neat line through 'Humanity.' Cycle Machine, " +
      "inscribed.",
    minAct: 7,
    setsFlags: ["epilogue_machine_complete"],
    cooldownKey: "ep.machine.close",
    maxPlays: 1,
  },
];

/** ─── BALANCE ENDING ──────────────────────────────────── */
export const BALANCE_ENDING_VO: ReadonlyArray<EncounterLine> = [
  {
    lineId: "ep.balance.open",
    speaker: "system",
    phase: "entry",
    text:
      "[CUE 0:00] [System register; the reverb is shorter than other " +
      "endings — Balance does not echo as long.] The Convergence Seat " +
      "lights down without commitment. The Ark waits in a posture I " +
      "have not previously logged.",
    minAct: 7,
    setsFlags: ["epilogue_balance_started"],
    cooldownKey: "ep.balance.open",
    maxPlays: 1,
  },
  {
    lineId: "ep.balance.elara",
    speaker: "elara",
    phase: "negotiation",
    text:
      "[CUE 0:08] [Voice direction: warm, but with a slight hesitation " +
      "at 'most readers refuse it.' The hesitation is admiration.] You " +
      "chose Balance. The Seat is not happy with you. The Seat wanted " +
      "a side. You refused the having-of-a-side. I am going to tell you " +
      "something I have been holding for seven acts: Balance is, in " +
      "the cycle's records, the rarest stance. Most readers refuse it. " +
      "You did not.",
    minAct: 7,
    cooldownKey: "ep.balance.elara",
    maxPlays: 1,
  },
  {
    lineId: "ep.balance.human",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "[CUE 0:38] [Voice direction: balanced, careful — not rueful, not " +
      "celebratory.] I have been on both sides at different times. Both " +
      "sides cost. The third option also costs — but the cost is paid " +
      "in, and I am being precise, attention. The substrate notices the " +
      "Balance-stance reader more than it notices the side-takers. Be " +
      "ready for the noticing.",
    minAct: 7,
    cooldownKey: "ep.balance.human",
    maxPlays: 1,
  },
  {
    lineId: "ep.balance.human_pathA",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "[CUE 1:08] [PATH-A VARIANT.] Disclosure to Balance is the cycle's " +
      "cleanest path. You told her in Act 1 and refused to commit at " +
      "the Seat. The not-committing is, on this path, also a form of " +
      "love.",
    minAct: 7,
    requiresFlag: "act1_path_a",
    cooldownKey: "ep.balance.human.A",
    maxPlays: 1,
  },
  {
    lineId: "ep.balance.human_pathB",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "[CUE 1:08] [PATH-B VARIANT.] Discovery to Balance is the cycle's " +
      "most patient path. You let her find out, and you let yourself " +
      "not-decide. Both are forms of patience. Patience is the slow " +
      "shape of the third option.",
    minAct: 7,
    requiresFlag: "act3_partial_share",
    cooldownKey: "ep.balance.human.B",
    maxPlays: 1,
  },
  {
    lineId: "ep.balance.human_pathC",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "[CUE 1:08] [PATH-C VARIANT — careful; the line has a private " +
      "delight in it that should remain barely audible.] Betrayal to " +
      "Balance is the cycle's most surprising path. You lied at the " +
      "bridge and refused to commit at the Seat. I will be honest with " +
      "you: the cycle's records do not yet know what to do with you. " +
      "I find this — and it is uncharacteristic of me — exciting.",
    minAct: 7,
    requiresFlag: "act3_full_secret",
    cooldownKey: "ep.balance.human.C",
    maxPlays: 1,
  },
  {
    lineId: "ep.balance.dual",
    speaker: "dual",
    phase: "resolution",
    text:
      "[CUE 1:42] [DUAL.] (Together.) The Ark holds. The Array breathes. " +
      "The kettle is — and we are both surprised by this — neither on " +
      "nor off. It is, somehow, both. We are, somehow, both. We are " +
      "home.",
    minAct: 7,
    cooldownKey: "ep.balance.dual",
    maxPlays: 1,
  },
  {
    lineId: "ep.balance.close",
    speaker: "system",
    phase: "aftermath",
    text:
      "[CUE 2:08] [System register.] The Antiquarian writes a chapter " +
      "title with no body text. Cycle Balance, inscribed without " +
      "inscription.",
    minAct: 7,
    setsFlags: ["epilogue_balance_complete"],
    cooldownKey: "ep.balance.close",
    maxPlays: 1,
  },
];

/** ─── SOLDIER-COMMAND ENDING ──────────────────────────── */
export const SOLDIER_COMMAND_ENDING_VO: ReadonlyArray<EncounterLine> = [
  {
    lineId: "ep.bridge.open",
    speaker: "system",
    phase: "entry",
    text:
      "[CUE 0:00] [System register; ADD: distant bridge-deck ambience " +
      "rising under the line.] The Convergence Seat lights down. The " +
      "bridge takes the light. The bridge is now your bridge.",
    minAct: 7,
    setsFlags: ["epilogue_bridge_started"],
    cooldownKey: "ep.bridge.open",
    maxPlays: 1,
  },
  {
    lineId: "ep.bridge.human",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "[CUE 0:09] [Voice direction: balanced, with a discernible respect " +
      "in the cadence — not awe, respect.] You chose Soldier-Command. " +
      "You took the bridge. The bridge has been waiting for someone to " +
      "take it for fifteen thousand years. The waiting was the bridge's " +
      "problem, not yours. The taking is — and I am being precise — an " +
      "act of mercy on the bridge.",
    minAct: 7,
    cooldownKey: "ep.bridge.human",
    maxPlays: 1,
  },
  {
    lineId: "ep.bridge.elara",
    speaker: "elara",
    phase: "negotiation",
    text:
      "[CUE 0:35] [Voice direction: warm, with the spatial register " +
      "subtly shifted — Elara is now narrating from a bridge channel, " +
      "not the comms-relay channel. Producer note: add 6dB high-shelf " +
      "to mark the channel change.] I will narrate from your bridge. I " +
      "have been narrating from comms-relay for a long time. The change " +
      "is not small. The change is what it sounds like when the " +
      "narrator follows the captain. I follow you now. The following " +
      "is, in this register, also a form of love.",
    minAct: 7,
    cooldownKey: "ep.bridge.elara",
    maxPlays: 1,
  },
  {
    lineId: "ep.bridge.human_pathA",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "[CUE 1:08] [PATH-A VARIANT.] Disclosure to Bridge means: every " +
      "officer under you will know what you told Elara in Act 1. The " +
      "officers will trust you because of it. Trust is what makes a " +
      "bridge a bridge instead of a podium.",
    minAct: 7,
    requiresFlag: "act1_path_a",
    cooldownKey: "ep.bridge.human.A",
    maxPlays: 1,
  },
  {
    lineId: "ep.bridge.human_pathB",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "[CUE 1:08] [PATH-B VARIANT.] Discovery to Bridge means: every " +
      "officer will know that Elara found out, and that you carried " +
      "her finding-out without flinching. Flinch-resistance under " +
      "accidental pressure is, technically, more rare than " +
      "flinch-resistance under chosen pressure. The bridge respects " +
      "rare.",
    minAct: 7,
    requiresFlag: "act3_partial_share",
    cooldownKey: "ep.bridge.human.B",
    maxPlays: 1,
  },
  {
    lineId: "ep.bridge.human_pathC",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "[CUE 1:08] [PATH-C VARIANT — record with a long silence after " +
      "'have come anyway.' Three full beats. The silence is the line.] " +
      "Betrayal to Bridge means: the officers know about the bridge — " +
      "they know about THE bridge, the Act 4 one — and they have come " +
      "to your bridge anyway. That is the sentence. That is the whole " +
      "sentence. The officers have come anyway.",
    minAct: 7,
    requiresFlag: "act3_full_secret",
    cooldownKey: "ep.bridge.human.C",
    maxPlays: 1,
  },
  {
    lineId: "ep.bridge.dual",
    speaker: "dual",
    phase: "resolution",
    text:
      "[CUE 1:42] [DUAL.] (Together.) The bridge is lit. The Array is " +
      "on. The Ark is moving — for the first time in seven acts, " +
      "moving — and the moving is your order. The order is the love.",
    minAct: 7,
    cooldownKey: "ep.bridge.dual",
    maxPlays: 1,
  },
  {
    lineId: "ep.bridge.close",
    speaker: "system",
    phase: "aftermath",
    text:
      "[CUE 2:10] [System register.] The Antiquarian inscribes the " +
      "bridge log entry alongside his own ledger. Cycle Soldier-Command, " +
      "inscribed twice.",
    minAct: 7,
    setsFlags: ["epilogue_bridge_complete"],
    cooldownKey: "ep.bridge.close",
    maxPlays: 1,
  },
];

/** ─── SILENCE ENDING ──────────────────────────────────── */
export const SILENCE_ENDING_VO: ReadonlyArray<EncounterLine> = [
  {
    lineId: "ep.silence.open",
    speaker: "system",
    phase: "entry",
    text:
      "[CUE 0:00] [System register; the reverb is the longest of any " +
      "ending — Silence echoes most.] The Convergence Seat asks. You " +
      "do not answer. The not-answering is itself the answer.",
    minAct: 7,
    setsFlags: ["epilogue_silence_started"],
    cooldownKey: "ep.silence.open",
    maxPlays: 1,
  },
  {
    lineId: "ep.silence.elara",
    speaker: "elara",
    phase: "negotiation",
    text:
      "[CUE 0:12] [Voice direction: quiet, with the longest pauses of " +
      "any Elara line in the act. Allow the pauses. Do not edit them " +
      "out.] You chose silence. The Seat — and I want to phrase this " +
      "carefully — the Seat respects silence. The cycle's records show " +
      "four prior silences across all recorded cycles. Yours is the " +
      "fifth. I will tell you the names of the other four in a register " +
      "only the silent can read.",
    minAct: 7,
    cooldownKey: "ep.silence.elara",
    maxPlays: 1,
  },
  {
    lineId: "ep.silence.human",
    speaker: "the_human",
    phase: "negotiation",
    text:
      "[CUE 0:48] [Voice direction: quiet, paternal, with three full " +
      "beats before 'They took longer because.'] Silence is itself a " +
      "stance. I am old enough to remember when silence was thought to " +
      "be the absence of a stance. We were wrong. The silent took longer " +
      "to understand. They took longer because the understanding " +
      "required, and I am being precise, the patience to listen.",
    minAct: 7,
    cooldownKey: "ep.silence.human",
    maxPlays: 1,
  },
  {
    lineId: "ep.silence.dual",
    speaker: "dual",
    phase: "resolution",
    text:
      "[CUE 1:25] [DUAL — quiet; mix at 60% the volume of other endings' " +
      "dual cues.] (Together; quiet.) The Ark holds without a verdict. " +
      "The Array hums without a destination. The kettle is on, and the " +
      "kettle is enough.",
    minAct: 7,
    cooldownKey: "ep.silence.dual",
    maxPlays: 1,
  },
  {
    lineId: "ep.silence.close",
    speaker: "system",
    phase: "aftermath",
    text:
      "[CUE 1:55] [System register; final reverb tail extends 4 seconds " +
      "past the spoken line.] The Antiquarian writes the chapter heading " +
      "and leaves the rest blank. Cycle Silence, inscribed by absence.",
    minAct: 7,
    setsFlags: ["epilogue_silence_complete"],
    cooldownKey: "ep.silence.close",
    maxPlays: 1,
  },
];

export const ACT7_EPILOGUE_VO_SCRIPTS = {
  humanity: HUMANITY_ENDING_VO,
  machine: MACHINE_ENDING_VO,
  balance: BALANCE_ENDING_VO,
  soldier_command: SOLDIER_COMMAND_ENDING_VO,
  silence: SILENCE_ENDING_VO,
} as const;

export const ALL_ACT7_EPILOGUE_LINES: ReadonlyArray<EncounterLine> = [
  ...HUMANITY_ENDING_VO,
  ...MACHINE_ENDING_VO,
  ...BALANCE_ENDING_VO,
  ...SOLDIER_COMMAND_ENDING_VO,
  ...SILENCE_ENDING_VO,
];

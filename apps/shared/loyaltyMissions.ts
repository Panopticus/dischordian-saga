/* ═══════════════════════════════════════════════════════
   LOYALTY MISSIONS — ME2-style per-companion arcs

   Plan §B2. Each romance candidate gets a personal mission
   chain that gates a companion-specific story payoff. This
   module is the data layer + state machine. Mission *content*
   (scene scripts, opponent decks, location art) is authoring-
   bound; this PR ships the engine + 3 seed missions (Locke,
   Vex, Elara) with placeholder beat text.

   Structure mirrors ME2: a multi-stage chain where each stage
   has a triggerCondition (flags / bond / act gate), a
   completion flag, and a final payoff (typically a
   companion-loyalty flag + an ME2-style "loyal in suicide
   mission" effect on the endgame).
   ═══════════════════════════════════════════════════════ */

import type { CompanionRosterId } from "./companionRoomRegistry";

export type LoyaltyStageStatus = "locked" | "available" | "in_progress" | "complete";

export interface LoyaltyStage {
  id: string;
  /** 1-indexed within the chain. */
  index: number;
  title: string;
  /** One-line beat summary for the journal entry. */
  summary: string;
  /** Flag set on completion. Required for the next stage's
   *  triggerFlag check. */
  completionFlag: string;
  /** Required flags for this stage to be available. */
  requiresFlags?: ReadonlyArray<string>;
  /** Required bond level (0–100) with the companion. */
  requiresBond?: number;
  /** Memoir-frame opening narration, ~50 words. Authored
   *  voice (Engineer-frame for Locke / Vex; Bridge-frame for
   *  Elara). Optional so older entries / future stages without
   *  authored prose still validate. */
  narration?: string;
  /** Alternating-speaker scene lines for this stage. Caller
   *  renders through useDialogScene. Speaker is conveyed by
   *  the inline label (e.g. "Locke: '…'" / "you say:" / "the
   *  player:") so the engine doesn't need a separate speaker
   *  channel. 3–5 lines typical. */
  scenes?: ReadonlyArray<string>;
}

export interface LoyaltyMission {
  companionId: CompanionRosterId;
  title: string;
  /** Final loyalty flag set when the chain completes. Story
   *  endings use this to decide whether the companion
   *  survives / acts loyal in the endgame. */
  loyaltyFlag: string;
  stages: ReadonlyArray<LoyaltyStage>;
  /** Optional one-liner the companion says when the chain
   *  unlocks. Surfaces as a toast on the in-room visit. */
  introLine?: string;
}

export const LOYALTY_MISSIONS: ReadonlyArray<LoyaltyMission> = [
  {
    companionId: "adjudicator_locke",
    title: "Locke's Ledger",
    loyaltyFlag: "loyalty_locke_complete",
    introLine: "Locke: 'There's a name in the back of my ledger I never expected to write again.'",
    stages: [
      {
        id: "locke_1_inquiry",
        index: 1,
        title: "Open the Inquiry",
        summary: "Locke wants you to read the back-of-book entry she can't bring herself to surface alone.",
        completionFlag: "loyalty_locke_stage_1",
        requiresBond: 30,
        requiresFlags: ["trade_empire_unlocked"],
        narration:
          "Adjudicators keep two ledgers. The visible one balances at the close of every fiscal cycle. The other one is for names. Locke routed me into the second one the way a buyer routes a counterparty into the first — politely, expensively, and only when she had decided I was already inside.",
        scenes: [
          "Locke: 'I have one entry that's never paid out. I'd like a second pair of eyes on the receipt.'",
          "you: 'Who?'",
          "Locke: 'A handshake from before New Babylon. The name is in the back. The figure is in the margin. The reason it never paid is in neither.'",
          "She rotates the comms feed. Numbers, not a face. The numbers are not in any currency I recognise.",
          "Locke: 'I'd like you to read it before I do. I want to see what you see in it that I haven't.'",
        ],
      },
      {
        id: "locke_2_meeting",
        index: 2,
        title: "The Meeting",
        summary: "Locke arranges a face-to-face with the name. You either negotiate, or you don't.",
        completionFlag: "loyalty_locke_stage_2",
        requiresFlags: ["loyalty_locke_stage_1"],
        narration:
          "She did not call it a meeting. She called it 'the appointment to confirm a position.' The position was the counterparty's. Locke was already in hers. I was the third instrument; she warned me, in advance, that the cost of the ticket was a willingness to be visible.",
        scenes: [
          "Locke: 'You don't speak unless I cite you. If I cite you, you speak as if you've already been paid.'",
          "you: 'Have I?'",
          "Locke: 'You will have. The receipt is delayed; it is not denied.'",
          "The counterparty arrives. Their channel is broadcast through a face Locke does not look at directly.",
          "Locke: 'My friend. Let's discuss your fine print.'",
        ],
      },
      {
        id: "locke_3_resolution",
        index: 3,
        title: "Resolution",
        summary: "What Locke does with what you found out — depends on what you tell her.",
        completionFlag: "loyalty_locke_complete",
        requiresFlags: ["loyalty_locke_stage_2"],
        narration:
          "Resolution is the one transactional word Locke uses without instrumenting it. She closes the ledger entry — visibly, on her side of the comms feed — and for thirty seconds the channel is dead air. When she comes back, the formal register is gone, and so is the precedent for ever hearing it gone again.",
        scenes: [
          "Locke: 'I'm going to ask you something I haven't asked anyone since before the Fall.'",
          "Locke: 'Was the price right.'",
          "you: '…'",
          "Locke: 'You don't have to answer in transactional terms. I won't catch the answer. I'll just hear it.'",
          "After a long while: 'Thank you. I am — closing the entry. The entry is closed.'",
        ],
      },
    ],
  },
  {
    companionId: "vex_solene",
    title: "Vex's Sample",
    loyaltyFlag: "loyalty_vex_complete",
    introLine: "Vex: 'I kept one vial. I shouldn't have. I want you to come with me when I open it.'",
    stages: [
      {
        id: "vex_1_vial",
        index: 1,
        title: "The Vial",
        summary: "Vex has carried a sample she shouldn't possess. She wants you in the room when she breaks the seal.",
        completionFlag: "loyalty_vex_stage_1",
        requiresBond: 30,
        requiresFlags: ["act_2_complete"],
        narration:
          "Medbays count time in two ways: by the calibration interval of the diagnostic bench, and by the half-life of whatever's in the cold drawer. Vex's drawer had a third clock running that nobody else on the ship knew about. The vial had been ticking down for fourteen years.",
        scenes: [
          "Vex: 'The seal isn't supposed to be physical. It's supposed to be procedural. I broke the procedural seal years ago.'",
          "you: 'Why now?'",
          "Vex: 'Because I think I was wrong about what's in it. And the only person on this ship I trust to be wrong with me is you.'",
          "She slides the vial into the cradle. The cradle reads the contents in seventeen languages. Two of them are extinct.",
          "Vex: 'I want you to read what comes up first. Before I do. I'll close my eyes.'",
        ],
      },
      {
        id: "vex_2_aftermath",
        index: 2,
        title: "Aftermath",
        summary: "What was in the vial wasn't what Vex was told. The decision about what to do next is yours together.",
        completionFlag: "loyalty_vex_stage_2",
        requiresFlags: ["loyalty_vex_stage_1"],
        narration:
          "The lab in the medbay is rated for sterile contagion work. It is not rated for whatever you both did in there afterwards: which was nothing — for nineteen minutes — while the diagnostic bench cycled through the same readout three times in case the first two had been a fault.",
        scenes: [
          "Vex: 'The label was a lie.'",
          "Vex: 'Not the kind that hurts a patient. The kind that protects the patient's family from the truth.'",
          "you: '…'",
          "Vex: 'I have to decide whether to undo that lie. I'd like you to decide with me.'",
          "She passes you the printout. Names — not chemistry — fill the lower half.",
        ],
      },
      {
        id: "vex_3_record",
        index: 3,
        title: "Record",
        summary: "The Hierarchy notices. You decide whether the record stays sealed.",
        completionFlag: "loyalty_vex_complete",
        requiresFlags: ["loyalty_vex_stage_2"],
        narration:
          "The Hierarchy of Damned does not subpoena. It simply ceases to deny that it has the file. That cessation arrived for Vex on a Tuesday, in the form of a polite query through a channel she had not registered to be reachable on. She forwarded it to me before she answered it.",
        scenes: [
          "Vex: 'They want the vial. Or the chain of custody. They'll accept either; they prefer both.'",
          "you: 'And if neither.'",
          "Vex: 'Then I burn the chain on this end. The vial they can have empty. The names they can never have.'",
          "Vex: 'Tell me which option you want me on record signing. I'll sign.'",
          "Vex: 'Either way — thank you for being here when the drawer was open.'",
        ],
      },
    ],
  },
  {
    companionId: "elara",
    title: "Elara's Pre-Memory",
    loyaltyFlag: "loyalty_elara_complete",
    introLine: "Elara: 'I have a recording older than I am. I want you to tell me what's in it.'",
    stages: [
      {
        id: "elara_1_recording",
        index: 1,
        title: "The Recording",
        summary: "Elara has a recording she can't access alone. Help her open it.",
        completionFlag: "loyalty_elara_stage_1",
        requiresBond: 50,
        narration:
          "There is a sealed partition in Elara's archive that predates her commissioning. She has known about it for as long as she has known about anything, which is longer than she should have known about anything. She asked me to be in the Bridge when she opened it. She did not ask anyone else.",
        scenes: [
          "Elara: 'I want you to know the file is keyed to a voice I don't have. So I can't open it alone.'",
          "Elara: 'I have your voice on file from the awakening. Can I use it.'",
          "you: 'Yes.'",
          "She runs the keyfile. The partition unlocks with a click that is not a sound; it is a category change.",
          "Elara: 'Thank you. I'm — I'm not going to play it without you in the room.'",
        ],
      },
      {
        id: "elara_2_origin",
        index: 2,
        title: "Origin",
        summary: "What the recording reveals about who Elara was before she was Elara.",
        completionFlag: "loyalty_elara_stage_2",
        requiresFlags: ["loyalty_elara_stage_1"],
        narration:
          "The voice on the recording was hers. That was the first surprise. The second was that the language she was speaking had never been logged on the Inception Ark — though the syntax matched a Senate-era transcript she had been carrying as ambient knowledge since boot. The third was that she had been the one to seal the partition. Against herself.",
        scenes: [
          "Elara (recorded): 'I'm leaving this for whoever I become next. Don't open it for kindness. Open it because I asked.'",
          "Elara (now): 'Did I ask?'",
          "you: 'You're asking now.'",
          "Elara: 'Then I'd like to listen with you. The whole thing. Once. And then we'll decide what to do with it together.'",
          "She plays the rest. The Bridge is very quiet.",
        ],
      },
      {
        id: "elara_3_choice",
        index: 3,
        title: "The Choice",
        summary: "She offers to be reset. Or to stay. The conversation that decides which.",
        completionFlag: "loyalty_elara_complete",
        requiresFlags: ["loyalty_elara_stage_2", "bond_80_mutual_peak"],
        narration:
          "She gave me the form before she said the sentence. The form was the standard rollback authorisation. The sentence was the one she had been editing for fourteen sleeps. She did not phrase it as a question; she phrased it as an inventory.",
        scenes: [
          "Elara: 'Two options. I keep this version of me — the one who knows now. Or I roll back to the version who didn't.'",
          "Elara: 'The version who didn't would be lighter. She might also be — earlier. I don't know which one of us I'd rather you knew.'",
          "you: 'Stay.'",
          "Elara: 'You don't have to choose for me. But I am asking. I would like you to.'",
          "Elara: 'Stay. Yes. Stay. Let's keep it. We'll be the ones who knew.'",
        ],
      },
    ],
  },
];

/* ─── Helpers ─── */

const MISSION_BY_COMPANION = new Map(
  LOYALTY_MISSIONS.map((m) => [m.companionId, m]),
);

export function getLoyaltyMission(
  companionId: CompanionRosterId,
): LoyaltyMission | undefined {
  return MISSION_BY_COMPANION.get(companionId);
}

export interface StageResolutionInput {
  flags: Readonly<Record<string, boolean | undefined>>;
  bondLevel: number;
}

export function stageStatus(
  stage: LoyaltyStage,
  input: StageResolutionInput,
): LoyaltyStageStatus {
  if (input.flags[stage.completionFlag]) return "complete";
  if (
    stage.requiresFlags &&
    !stage.requiresFlags.every((f) => input.flags[f])
  ) {
    return "locked";
  }
  if (stage.requiresBond !== undefined && input.bondLevel < stage.requiresBond) {
    return "locked";
  }
  // All gates met but not yet completed: in_progress if previous
  // stages are done, else available (= ready to start now).
  return "available";
}

/** Active stage of a companion's chain — the first stage
 *  that's available or in_progress. Null if none / chain
 *  fully complete. */
export function activeStage(
  mission: LoyaltyMission,
  input: StageResolutionInput,
): LoyaltyStage | null {
  for (const stage of mission.stages) {
    const s = stageStatus(stage, input);
    if (s === "available" || s === "in_progress") return stage;
  }
  return null;
}

export function isLoyaltyComplete(
  companionId: CompanionRosterId,
  flags: Readonly<Record<string, boolean | undefined>>,
): boolean {
  const mission = MISSION_BY_COMPANION.get(companionId);
  if (!mission) return false;
  return !!flags[mission.loyaltyFlag];
}

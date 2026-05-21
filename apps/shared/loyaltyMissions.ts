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
  /* ───────────────────────────────────────────────────────
     WRAITH CALDER — The Syndicate's Seventh Sanctuary
     Section D4 — confront the Syndicate's mirror-self,
     then seal the seventh (unauthorised) sanctuary.
     ─────────────────────────────────────────────────────── */
  {
    companionId: "wraith_calder",
    title: "The Seventh Sanctuary",
    loyaltyFlag: "loyalty_wraith_calder_complete",
    introLine:
      "Wraith: 'There are six sanctuaries in the Syndicate's ledger. I am told there are seven. I would like to know which one was added after I died.'",
    stages: [
      {
        id: "wraith_1_ledger",
        index: 1,
        title: "Read the Ledger",
        summary:
          "Wraith hands you a Syndicate ledger pulled from his own bunk. Six sanctuaries are listed. A seventh is implied between two entries.",
        completionFlag: "loyalty_wraith_stage_1",
        requiresBond: 30,
        requiresFlags: ["wraith_calder_recruited"],
        narration:
          "Wraith does not believe in the seventh sanctuary the way the Syndicate believes in their first. He believes in it the way an accountant believes in a balance he has been told never existed. He hands me the ledger; the margin between entries six and the closing page is just wide enough for a column nobody has yet drawn.",
        scenes: [
          "Wraith: 'Six is the canonical count. The Syndicate publishes six. Six is what you would find if you searched.'",
          "you: 'Where's the seventh?'",
          "Wraith: 'I do not know. That is the loyalty mission. I would like you with me when I find out.'",
          "He closes the ledger. The brass cover squeals. He has not opened it in fourteen years.",
          "Wraith: 'I have been ready since the Antiquarian wrote my name on the resurrection-ticket. I needed someone to ride out with me. I am asking you.'",
        ],
      },
      {
        id: "wraith_2_auditor",
        index: 2,
        title: "Confront the Auditor",
        summary:
          "Wraith's mirror-self — the Syndicate's posthumous auditor — has been writing on his behalf since his death. You meet them.",
        completionFlag: "loyalty_wraith_stage_2",
        requiresFlags: ["loyalty_wraith_stage_1"],
        narration:
          "The auditor is wearing Wraith's face. Not as a costume — as a record. The Syndicate decided, on his death, that the function would continue, and it commissioned a replacement that resembles him at the level of every contract signed since. They have signed three hundred contracts in his hand. He has not.",
        scenes: [
          "Auditor: 'I am pleased to see you. I had not expected the original.'",
          "Wraith: 'I am not the original. I am the second pressing. I would like the plates.'",
          "Auditor: 'The plates are commissioned. The plates do not belong to either of us.'",
          "Wraith: 'I am not asking for ownership. I am asking you to stop signing.'",
          "Long pause. The auditor sets down the pen.",
        ],
      },
      {
        id: "wraith_3_seal",
        index: 3,
        title: "Seal the Seventh",
        summary:
          "The seventh sanctuary was authored to hold an unauthorised resurrection. Wraith decides whether to seal it or to let it stand.",
        completionFlag: "loyalty_wraith_calder_complete",
        requiresFlags: ["loyalty_wraith_stage_2"],
        narration:
          "The seventh sanctuary is not in the ledger because it was never invoiced. The Syndicate authored it to hold a resurrection they did not have the protocol for. Wraith reads the floor plan; he reads the architect's signature; he reads — for the first time in fourteen years — his own death certificate, filed in the same hand. He decides.",
        scenes: [
          "Wraith: 'It is mine. It was waiting for me. I am — closing it.'",
          "you: 'Are you sure?'",
          "Wraith: 'The Syndicate authored seven sanctuaries because it wanted six performances and one rehearsal. I am the rehearsal. I am not going to perform again.'",
          "He signs the seal. The Syndicate ledger updates itself in real time; the seventh column closes.",
          "Wraith: 'Thank you for riding with me. I would not have closed it on my own.'",
        ],
      },
    ],
  },
  /* ───────────────────────────────────────────────────────
     AKAI SHI — The Cure That Requires Her Death
     Section D4 — Red Death pattern study; the cure costs
     her own life. The loyalty payoff is whether she runs
     the cure or hands the pattern to someone else.
     ─────────────────────────────────────────────────────── */
  {
    companionId: "akai_shi",
    title: "The Red Death Pattern",
    loyaltyFlag: "loyalty_akai_shi_complete",
    introLine:
      "Akai: 'The Lair studied me. I would like to read its notes. Some of those notes were mine before they were theirs.'",
    stages: [
      {
        id: "akai_1_pattern",
        index: 1,
        title: "Study the Pattern",
        summary:
          "Akai wants to read the Red Death pattern from the inside. She has access nobody else does — she WAS the study subject.",
        completionFlag: "loyalty_akai_stage_1",
        requiresBond: 30,
        requiresFlags: ["akai_shi_recruited"],
        narration:
          "Akai is at the shrine, with her case folded into the kneeling posture. She is not meditating. She is reading. The Red Death pattern is hand-annotated in the margin of a journal whose other half was hers, fourteen years ago. The Necromancer's Lair kept the journal; she has it now.",
        scenes: [
          "Akai: 'I want to read what the Lair learned. It learned things from me I did not know I was teaching.'",
          "you: 'What did it learn?'",
          "Akai: 'How to make a cure that does not save the carrier. I do not know yet whether that is a cure.'",
          "She turns a page. The annotation is in her own hand.",
          "Akai: 'I would like you with me when I find out.'",
        ],
      },
      {
        id: "akai_2_carrier",
        index: 2,
        title: "Locate the Carrier",
        summary:
          "The cure requires a living carrier. Akai is one. So are three others. You find them.",
        completionFlag: "loyalty_akai_stage_2",
        requiresFlags: ["loyalty_akai_stage_1"],
        narration:
          "Four living carriers. Akai. A child in Veltra orbit. A monastery resident on Driftspoke. And — improbably — a junior Coda violinist whose name Vex would recognise. The pattern's protocol is to draw the cure from the senior-most carrier. Akai is senior. Akai's case sits beside her, open.",
        scenes: [
          "Akai: 'Four. I expected one. The pattern is more generous than I was told.'",
          "you: 'Generous?'",
          "Akai: 'You can choose. The pattern does not require me. The pattern requires A carrier. I am not the only one.'",
          "Pause. She closes the case.",
          "Akai: 'I would like to tell you what I would like, before you tell me what you would like.'",
        ],
      },
      {
        id: "akai_3_decision",
        index: 3,
        title: "Run the Cure",
        summary:
          "Akai decides who runs the cure. The chain ends when she has chosen. The choice is hers; your role is to be the witness she calibrated the room for.",
        completionFlag: "loyalty_akai_shi_complete",
        requiresFlags: ["loyalty_akai_stage_2"],
        narration:
          "The decision is hers. I am the witness. She calibrates the room — voltari static at its quietest setting, the case at her right hand, the violinist's address on a slip of paper at her left. She turns to me before she chooses, the way she turned to the Necromancer's Lair before she was taken from it. This time she chooses first.",
        scenes: [
          "Akai: 'I am going to take the senior-carrier seat. The cure runs through the senior carrier. The cure will take what the cure takes.'",
          "you: 'Akai —'",
          "Akai: 'You can stop me. You can also let me. Both of those are calibrated. I have set the room for either.'",
          "Pause.",
          "Akai: 'I am going to run the cure. I am going to do it in a way that ends with the others alive. The pattern is generous; I am taking the generosity.'",
        ],
      },
    ],
  },
  /* ───────────────────────────────────────────────────────
     LYCOS — Mercy, Refused
     Section D4 — relearn mercy, hunt the Resurrectionist's
     true heir, refuse to extend mercy when it matters.
     The payoff is a loyalty branch on refusal.
     ─────────────────────────────────────────────────────── */
  {
    companionId: "lycos",
    title: "Mercy, Refused",
    loyaltyFlag: "loyalty_lycos_complete",
    introLine:
      "Lycos: 'I extended mercy three times during the contract. I would like to extend it a fourth time, with witnesses I trust. Then I would like to refuse.'",
    stages: [
      {
        id: "lycos_1_practice",
        index: 1,
        title: "Practice the Mercy",
        summary:
          "Lycos chooses a target the Antiquarian's ledger never asked him to hunt. He extends mercy as practice. You hold the room.",
        completionFlag: "loyalty_lycos_stage_1",
        requiresBond: 30,
        requiresFlags: ["lycos_recruited"],
        narration:
          "Lycos is in the containment atrium. The snow-globe alcove is empty; the Antiquarian's ledger sits open at the pause-line. Lycos has chosen a target that was never on the contract — a corrupted League veteran who walked out of the Crucible on his own, with no lieutenant to back him. The mercy is practice. The witness is me.",
        scenes: [
          "Lycos: 'He left on his own. The contract has no column for him.'",
          "you: 'Then why do this?'",
          "Lycos: 'Because I want to remember what mercy felt like before the contract. I would like a witness who is not the Antiquarian.'",
          "He approaches the veteran. The veteran does not flinch. Lycos extends mercy.",
          "Lycos: 'Thank you. That was — useful.'",
        ],
      },
      {
        id: "lycos_2_heir",
        index: 2,
        title: "Hunt the Heir",
        summary:
          "The Resurrectionist's true heir surfaces. Lycos's contract is closed, but the heir is open work. Hunt them.",
        completionFlag: "loyalty_lycos_stage_2",
        requiresFlags: ["loyalty_lycos_stage_1"],
        narration:
          "The Resurrectionist's true heir was always going to surface. He surfaces in Coda territory, on a stage Lycos has never visited, in a vest tailored by someone Lycos has killed. The heir does not know that yet; he is about to. The hunt is fast; the hunt is bloodless until the very end.",
        scenes: [
          "Lycos: 'He is performing tonight.'",
          "you: 'Performing what?'",
          "Lycos: 'A speech. He has my second-to-last contract memorised. He is going to deliver it from the stage.'",
          "We watch from the wings. Lycos does not move until the heir reaches the third clause.",
          "Lycos: 'That is the one I was instructed to refuse. He has not yet learned the refusal.'",
        ],
      },
      {
        id: "lycos_3_refuse",
        index: 3,
        title: "Refuse the Mercy",
        summary:
          "The heir asks for mercy. Lycos has practiced it. He refuses. The loyalty chain closes on the refusal.",
        completionFlag: "loyalty_lycos_complete",
        requiresFlags: ["loyalty_lycos_stage_2"],
        narration:
          "The heir asks for mercy from the stage. The audience does not yet realise they are inside a contract. Lycos has practiced; Lycos has rehearsed; Lycos has prepared the witness. The refusal is quiet. The refusal is not theatrical. The refusal is the answer to a question the Resurrectionist did not authorise his heir to ask.",
        scenes: [
          "Heir: 'Mercy. Same as the others. I will accept the same terms.'",
          "Lycos: 'No.'",
          "Heir: '… you extended it three times during the contract.'",
          "Lycos: 'I extended it three times because the Antiquarian's ledger asked me to. He never authorised it for you.'",
          "Long pause. Lycos turns to me. 'Thank you. The contract is closed.'",
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

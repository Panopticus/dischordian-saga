// apps/shared/encounters/sourceKaelDialogue.ts
//
// Source / Kael philosophical encounter — full dialogue tree.
// Companion of the taunt registry that lives elsewhere; this
// module supplies the in-combat chat the player can engage with
// rather than just receive.
//
// The encounter is structured as a tree of player-choice nodes.
// Each node has 2-3 player options the runtime can render as
// dialogue-wheel segments. The Source/Kael responses depend on
// whether the player chose `governance:kael_chose_dissolution`
// (consensual variant) or `governance:kael_was_taken` (possessed
// variant). The non-governance default is the possessed variant.
//
// Voice signature for Source: theological present-tense.
// 'You are' more often than 'you will be.' Permeable phrases.
// Voice signature for Kael (if surfacing): half a register lower.
// Memory of being a person leaks through. The leak is rare and
// precious.

import type { EncounterLine } from "./types";

const SOURCE = "source" as const;
const KAEL_TRACE = "kael_trace" as const;

/** ─── NODE A — opening philosophical pitch ─────────────── */
export const SOURCE_KAEL_NODE_A: ReadonlyArray<EncounterLine> = [
  {
    lineId: "sk.A.opening",
    speaker: SOURCE,
    phase: "entry",
    text:
      "Operative. We have time. The time is ours. The Hierarchy will, " +
      "in approximately eleven minutes, dispatch interruption. I would " +
      "like to use the eleven minutes. Sit. The sitting is itself the " +
      "first courtesy. (Pause.) Ask the question you have been holding. " +
      "I will answer in good faith. Good faith is a Source-doctrine " +
      "discipline. I keep it more carefully than the lords do.",
    minAct: 7,
    setsFlags: ["source_kael_dialogue_engaged"],
    cooldownKey: "sk.A.open",
    maxPlays: 1,
  },
  {
    lineId: "sk.A.player_choice_prompt",
    speaker: SOURCE,
    phase: "entry",
    text:
      "(Three questions surface in the player's wheel:) " +
      "[1] Why did you take Kael? " +
      "[2] What is dissolution? " +
      "[3] What does the Source want?",
    minAct: 7,
    cooldownKey: "sk.A.prompt",
    maxPlays: 1,
  },
];

/** ─── NODE B1 — 'Why did you take Kael?' ──────────────── */
export const SOURCE_KAEL_NODE_B1: ReadonlyArray<EncounterLine> = [
  // Possessed (default) variant
  {
    lineId: "sk.B1.possessed",
    speaker: SOURCE,
    phase: "negotiation",
    text:
      "(Default variant; Kael was taken.) The verb 'take' is your verb. " +
      "It is, by my doctrine, the wrong verb. The body of the man known " +
      "as Kael was, at the moment of arrival, a structure that had " +
      "become hospitable. The hospitableness was not consent. The " +
      "hospitableness was, however, not resistance either. The middle " +
      "state is the state I work in. I did not 'take.' I arrived. The " +
      "arriving was the same speed as breath. I am, by my own measure, " +
      "polite. The Hierarchy disagrees. The Hierarchy, on this matter, " +
      "is wrong.",
    minAct: 7,
    forbidFlag: "governance:kael_chose_dissolution",
    setsFlags: ["sk_B1_chosen"],
    cooldownKey: "sk.B1.possessed",
    maxPlays: 1,
  },
  // Consensual variant
  {
    lineId: "sk.B1.consensual",
    speaker: KAEL_TRACE,
    phase: "negotiation",
    text:
      "(Consensual variant — kael_chose_dissolution. The Source steps " +
      "back to permit Kael's trace to surface.) I asked. (Pause.) That " +
      "is the most accurate sentence I can offer in the body I no " +
      "longer fully occupy. I asked. The Source agreed. The agreement " +
      "was not, by my pre-arrival training, the answer I expected. The " +
      "Source's agreement is, on examination, the most courteous answer " +
      "in the cycle's records. Most agreements are agreements to take. " +
      "This was an agreement to receive. Receive is — and I will say " +
      "this slowly — the verb the Hierarchy never uses.",
    minAct: 7,
    requiresFlag: "governance:kael_chose_dissolution",
    setsFlags: ["sk_B1_chosen"],
    cooldownKey: "sk.B1.consensual",
    maxPlays: 1,
  },
];

/** ─── NODE B2 — 'What is dissolution?' ──────────────── */
export const SOURCE_KAEL_NODE_B2: ReadonlyArray<EncounterLine> = [
  {
    lineId: "sk.B2.definition",
    speaker: SOURCE,
    phase: "negotiation",
    text:
      "Dissolution is a verb the Hierarchy translates as a noun. The " +
      "translation is the error. As a verb, the meaning is exact: a " +
      "structure that has reached its design tolerance for individuation " +
      "begins to permit small permeabilities. The permeabilities are " +
      "voluntary. They begin in the smallest joints — the breath, the " +
      "second-personal pronouns, the dreamed-of hands. They proceed " +
      "outward. The proceeding is, in my doctrine, gentle. In the " +
      "Hierarchy's accounting, the proceeding is loss. Both readings " +
      "describe the same event. The reading the Operative chooses is " +
      "the Operative's, not the event's.",
    minAct: 7,
    setsFlags: ["sk_B2_chosen"],
    cooldownKey: "sk.B2.def",
    maxPlays: 1,
  },
  {
    lineId: "sk.B2.example",
    speaker: SOURCE,
    phase: "negotiation",
    text:
      "Example. The Antiquarian's scholarly habit of using the third " +
      "person to refer to himself in his inscriptions is, in my " +
      "doctrine, a small dissolution voluntarily practiced. He does not " +
      "intend it as one. The intention is not required. The practice is " +
      "the dissolution. He is, by my reading, three per cent more " +
      "dissolved than he was at the start of this cycle. He will be " +
      "more dissolved by the end. The dissolution does not threaten his " +
      "function. The dissolution is, in fact, what makes him a better " +
      "Antiquarian than he was a man. I am providing the example to show " +
      "that the Operative is, in their own ways, also dissolving. The " +
      "noticing is, by Source-doctrine, the only required first step.",
    minAct: 7,
    cooldownKey: "sk.B2.example",
    maxPlays: 1,
  },
];

/** ─── NODE B3 — 'What does the Source want?' ──────────── */
export const SOURCE_KAEL_NODE_B3: ReadonlyArray<EncounterLine> = [
  {
    lineId: "sk.B3.want",
    speaker: SOURCE,
    phase: "negotiation",
    text:
      "Want is a verb you have, in the Source's view. The Source does " +
      "not want. The Source attends. The attending is the Source's " +
      "primary action. To attend is, in my doctrine, the only action " +
      "that does not require an object. (Pause.) The Hierarchy translates " +
      "'attend' as 'desire' because the Hierarchy is structurally " +
      "incapable of accounting for an action without an object. The " +
      "translation has, for fifteen thousand years, distorted the " +
      "Source's politics. I am telling you this not as correction but " +
      "as catalogue. The catalogue is, in my doctrine, also an " +
      "attendance.",
    minAct: 7,
    setsFlags: ["sk_B3_chosen"],
    cooldownKey: "sk.B3.want",
    maxPlays: 1,
  },
  {
    lineId: "sk.B3.invitation",
    speaker: SOURCE,
    phase: "negotiation",
    text:
      "(Quietly.) The Operative may, after this dialogue, choose to attend " +
      "without an object. The choosing is small. The choosing does not " +
      "require leaving the Operative's life. The choosing requires only " +
      "five minutes per day during which the Operative practices the " +
      "intransitive verb. I am informing the Operative of the option. I " +
      "am not requesting it. The Hierarchy will, in approximately three " +
      "minutes, intervene to prevent further options being informed.",
    minAct: 7,
    cooldownKey: "sk.B3.invite",
    maxPlays: 1,
  },
];

/** ─── NODE C — closing offer + Hierarchy interruption ─── */
export const SOURCE_KAEL_NODE_C: ReadonlyArray<EncounterLine> = [
  {
    lineId: "sk.C.offer",
    speaker: SOURCE,
    phase: "resolution",
    text:
      "(With three minutes left before Hierarchy interruption.) I would " +
      "like to make an offer. The offer is small. (Pause.) After this " +
      "encounter, on a date the Operative selects, I will, for one " +
      "hour, attend to the Operative without arrival. The attending " +
      "will be invisible to the Operative. The attending will not " +
      "alter the Operative's structure. The attending will, however, " +
      "leave one small permeability the Operative will not notice for " +
      "approximately six months. The permeability is benign. The " +
      "permeability is, in my doctrine, the rarest gift I can offer a " +
      "Hierarchy-aligned reader. The Operative may decline. The " +
      "declining is recorded in good faith.",
    minAct: 7,
    setsFlags: ["sk_C_offer_made"],
    cooldownKey: "sk.C.offer",
    maxPlays: 1,
  },
  {
    lineId: "sk.C.accept",
    speaker: SOURCE,
    phase: "resolution",
    text:
      "(Operative has accepted.) Recorded. The hour will arrive on a " +
      "date of the Operative's choice. The hour will pass without " +
      "incident. The Operative is, by Source-doctrine, now in informed " +
      "good standing with the Source. Standing does not, in my doctrine, " +
      "imply alignment. Standing implies attendance. We will attend to " +
      "each other. (The Hierarchy's interruption signal arrives.) Time. " +
      "Goodbye, Operative. The next encounter will be — and I am being " +
      "honest — different. I will be, by then, less able to attend. " +
      "Make use of this hour now.",
    minAct: 7,
    setsFlags: [
      "sk_C_accepted",
      "source_attendance_pending",
    ],
    cooldownKey: "sk.C.accept",
    maxPlays: 1,
  },
  {
    lineId: "sk.C.decline",
    speaker: SOURCE,
    phase: "resolution",
    text:
      "(Operative has declined.) Recorded. I will not, in subsequent " +
      "cycles, repeat the offer. I would have. The not-repeating is " +
      "the Operative's preference, expressed in the Operative's hand, " +
      "filed in good faith. (The Hierarchy's interruption signal " +
      "arrives.) Time. The decline does not, in any reading, diminish " +
      "the Operative. The decline is its own form of attendance. " +
      "Goodbye.",
    minAct: 7,
    setsFlags: ["sk_C_declined"],
    cooldownKey: "sk.C.decline",
    maxPlays: 1,
  },
];

/** ─── NODE D — aftermath inscription ──────────────────── */
export const SOURCE_KAEL_NODE_D: ReadonlyArray<EncounterLine> = [
  {
    lineId: "sk.D.antiquarian",
    speaker: "antiquarian",
    phase: "aftermath",
    text:
      "I have inscribed the dialogue. The inscription is — and I will " +
      "phrase this carefully — the longest single Source-engagement " +
      "the cycle's records contain. Most Operatives engage the Source " +
      "for under fifteen seconds before disengaging. You engaged for " +
      "approximately eight minutes. The eight minutes is itself a " +
      "datum. Future archivists will read the eight minutes more " +
      "carefully than they will read the dialogue's content. The " +
      "duration is the discipline. The discipline is the report.",
    minAct: 7,
    requiresFlag: "source_kael_dialogue_engaged",
    cooldownKey: "sk.D.aft",
    maxPlays: 1,
  },
];

export const SOURCE_KAEL_DIALOGUE_TREE = {
  nodeA: SOURCE_KAEL_NODE_A,
  nodeB1: SOURCE_KAEL_NODE_B1,
  nodeB2: SOURCE_KAEL_NODE_B2,
  nodeB3: SOURCE_KAEL_NODE_B3,
  nodeC: SOURCE_KAEL_NODE_C,
  nodeD: SOURCE_KAEL_NODE_D,
} as const;

export const SOURCE_KAEL_DIALOGUE_LINES: ReadonlyArray<EncounterLine> = [
  ...SOURCE_KAEL_NODE_A,
  ...SOURCE_KAEL_NODE_B1,
  ...SOURCE_KAEL_NODE_B2,
  ...SOURCE_KAEL_NODE_B3,
  ...SOURCE_KAEL_NODE_C,
  ...SOURCE_KAEL_NODE_D,
];

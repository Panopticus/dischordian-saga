/* ═══════════════════════════════════════════════════════
   RECRUITMENT QUEST CHAINS — branching dialog for the 5
   named, recruitable NPCs (Vex Solène, Wraith Calder,
   Locke, Jericho Jones, Akai Shi).

   Each chain has 3 stages with 2-3 choices per stage. The
   player's choices accumulate into one of three terminal
   outcomes:

     - recruited_loyal — they join with high starting
       loyalty (~75) and a positive starting bond modifier.
       Some stat axis is buffed.
     - recruited_tense — they join, but with low loyalty
       (~40), a relationship-flag of "I'm here despite
       you", and a stat profile shaped by what was said.
     - refused — chain ends; the NPC declines. Locked.
       Re-attempt is gated on `retryAfterCycle` (see the
       service layer).

   The chain is the single source of truth — the npcRecruit
   router validates that a chain is `completed` with a
   non-`refused` outcome before instantiating the crew
   member, replacing the previous soft gate.

   Lore voice notes per chain:
    - Vex Solène: stage performer, watching for sincerity.
      The 'tense' branch is generally taken by a player who
      treats the Reveal as a transaction.
    - Wraith Calder: ritualist. The 'tense' branch is taken
      when the player names the wrong dead (or refuses).
    - Locke: adjudicator. Branches on procedural fidelity.
    - Jericho Jones: cadre leader. Branches on whether the
      player respects the rank-and-file.
    - Akai Shi: post-Necromancer-event only. Branches on
      whether the player accepts thought-virus risk.
   ═══════════════════════════════════════════════════════ */

import type { ResurrectableNpcKey } from "./resurrectionProtocols";

export type RecruitmentOutcome =
  | "recruited_loyal"
  | "recruited_tense"
  | "refused";

/** A single dialog line spoken in a stage's scene. */
export interface RecruitmentLine {
  /** Speaker — the NPC, the player, or a witness like 'elara'. */
  speaker: string;
  text: string;
}

/** A choice the player picks at the end of a stage. */
export interface RecruitmentChoice {
  id: string;
  /** Player-facing button label. */
  label: string;
  /** One-line consequence preview. Shown beneath the label. */
  preview: string;
  /** The NPC's reaction lines, played after the player commits. */
  npcReply: RecruitmentLine[];
  /** Result of taking this choice. */
  result: {
    /** Next stage id, or "end" to terminate the chain. */
    advanceTo: string | "end";
    /** Terminal outcome — only set when advanceTo === "end". */
    outcome?: RecruitmentOutcome;
    /** Narrative flags to set on the player profile. */
    flagsToSet?: readonly string[];
    /** Bond / loyalty starting value if recruited via this branch. */
    startingLoyalty?: number;
    /** Stat-axis tweaks applied at recruit time. Range -10..+10. */
    statTweaks?: Partial<{
      resilience: number;
      intellect: number;
      reflexes: number;
      empathy: number;
      immunity: number;
      adaptability: number;
    }>;
    /** Free-form relationship tag attached to the recruited member —
     *  e.g. "guarded", "loyal", "transactional". Surfaces in dialog. */
    relationshipTag?: string;
  };
}

/** A stage in a quest chain — a scene + choices. */
export interface RecruitmentStage {
  id: string;
  title: string;
  /** Setup paragraph shown above the dialog. */
  description: string;
  /** Narrative lines played before the choices appear. */
  scene: RecruitmentLine[];
  /** Player choices. 2-3 per stage. */
  choices: RecruitmentChoice[];
}

/** A full chain — the journey from briefing to terminal outcome. */
export interface RecruitmentChain {
  npcKey: ResurrectableNpcKey;
  displayName: string;
  /** Briefing shown when the chain is first opened. */
  briefing: string;
  /** Stage id the chain starts at. */
  startStageId: string;
  /** All stages, indexed by id. */
  stages: RecruitmentStage[];
  /** Optional gate — narrative flags that must be set before the chain
   *  is openable. The npcRecruit router checks these before allowing
   *  open(); refusal here returns a guidance string. */
  openGate?: {
    requiresFlagsAll?: readonly string[];
    description: string;
  };
}

/* ───────────────────────────────────────────────────────
   VEX SOLÈNE — Coda Maestro
   ─────────────────────────────────────────────────────── */
const VEX_CHAIN: RecruitmentChain = {
  npcKey: "vex_solene",
  displayName: "Vex Solène",
  briefing:
    "The Coda's Reveal cadence is tonight. Vex Solène is its maestro. Every face in the audience is an applicant for her attention; every silent moment between movements is a screening. If she joins your crew, it will not be because you asked.",
  startStageId: "vex_1",
  stages: [
    {
      id: "vex_1",
      title: "Reveal Night",
      description:
        "Vex's company is performing the Reveal cadence. You're seated in the third tier. The hall is full of stagehands posing as patrons; she'll know.",
      scene: [
        { speaker: "Vex Solène", text: "The Reveal is in four movements. The fourth is the one nobody talks about. Watch closely." },
        { speaker: "narrator", text: "The cadence builds, breaks, rebuilds, and stops mid-phrase. The room holds its breath." },
      ],
      choices: [
        {
          id: "vex_1_tip",
          label: "Tip the box generously and stay for the bow.",
          preview: "Treat the Reveal as a transaction. Vex notices.",
          npcReply: [
            { speaker: "Vex Solène", text: "I saw the size of the tip. I'll remember the size of the tip. It is, in its way, a kind of compliment." },
          ],
          result: { advanceTo: "vex_2", flagsToSet: ["recruit:vex:tipped_box"] },
        },
        {
          id: "vex_1_silent",
          label: "Stay through the silence after the fourth movement.",
          preview: "Honour the form. Vex will note who didn't fill the silence.",
          npcReply: [
            { speaker: "Vex Solène", text: "Half the room exhaled in the rest. You held it. That's the cadence's first audition." },
          ],
          result: { advanceTo: "vex_2", flagsToSet: ["recruit:vex:held_silence"] },
        },
        {
          id: "vex_1_heckle",
          label: "Ask a loud question from the third tier.",
          preview: "Vex hates a heckle. So does every Coda member in the room.",
          npcReply: [
            { speaker: "Vex Solène", text: "The third tier asked the question I left in the rest. Bad form. The Coda will not invite you backstage. You should leave by the south door." },
          ],
          result: {
            advanceTo: "end",
            outcome: "refused",
            flagsToSet: ["recruit:vex:heckled"],
          },
        },
      ],
    },
    {
      id: "vex_2",
      title: "Backstage",
      description:
        "Vex's invitation came through a stagehand. The dressing room smells of rosin and lavender. She's removing her stage makeup with the unhurried precision of someone who has done it ten thousand times.",
      scene: [
        { speaker: "Vex Solène", text: "Sit. The chair on the right. The left one has my next costume." },
        { speaker: "Vex Solène", text: "I have three questions I let people ask me. Pick one." },
      ],
      choices: [
        {
          id: "vex_2_music",
          label: "Where does the Reveal cadence come from?",
          preview: "Asks about the music. Vex respects this.",
          npcReply: [
            { speaker: "Vex Solène", text: "It comes from a thing the Ne-Yons left in the substrate. The Coda heard it once and copied it down badly. We've been improving the copy ever since." },
            { speaker: "Vex Solène", text: "Most people ask about the silence. They want a trick. There is no trick. There is only the silence and what we did to deserve it." },
          ],
          result: { advanceTo: "vex_3", flagsToSet: ["recruit:vex:asked_music"] },
        },
        {
          id: "vex_2_debt",
          label: "What does the Coda owe — and to whom?",
          preview: "Asks about the political reality. Vex respects this if it's sincere.",
          npcReply: [
            { speaker: "Vex Solène", text: "Three patrons. Two are dead. The third is leveraging the deaths. I have a contract that becomes mine if I survive him." },
            { speaker: "Vex Solène", text: "I assume you didn't ask out of curiosity. Tell me what you would do with the answer." },
          ],
          result: { advanceTo: "vex_3", flagsToSet: ["recruit:vex:asked_debt"] },
        },
        {
          id: "vex_2_personal",
          label: "What has the Coda cost you, personally?",
          preview: "A vulnerable question. Vex weighs whether the asker can carry it.",
          npcReply: [
            { speaker: "Vex Solène", text: "A child. A house in Thaloria. Three friends. The fourth is here, and she is on the verge of leaving the Coda forever to follow me." },
            { speaker: "Vex Solène", text: "I don't usually answer that one. You used the right tense." },
          ],
          result: { advanceTo: "vex_3", flagsToSet: ["recruit:vex:asked_personal"] },
        },
      ],
    },
    {
      id: "vex_3",
      title: "The Offer",
      description:
        "Vex has dressed in travel clothes. Her case is by the door. The Coda's third patron is at the gala upstairs, and she is no longer his.",
      scene: [
        { speaker: "Vex Solène", text: "I'll come with you. There are terms." },
        { speaker: "Vex Solène", text: "First: I bring my own libretto. Second: my contract bench-mark stays at union rate. Third: when I die, the daily-names ceremony begins on my ark, not on your inception." },
      ],
      choices: [
        {
          id: "vex_3_accept",
          label: "Accept all three terms.",
          preview: "She joins fully — high loyalty, performance buff.",
          npcReply: [
            { speaker: "Vex Solène", text: "Then we're done here. I'll meet you at the south dock. Don't bring a chaperone. The Coda won't pursue if I'm seen with witnesses." },
          ],
          result: {
            advanceTo: "end",
            outcome: "recruited_loyal",
            startingLoyalty: 80,
            statTweaks: { empathy: 5, intellect: 3 },
            flagsToSet: ["recruit:vex:loyal", "romance:available:vex_solene"],
            relationshipTag: "loyal",
          },
        },
        {
          id: "vex_3_negotiate",
          label: "Negotiate the libretto term — you want approval rights.",
          preview: "She joins, but resentful. Lower loyalty; tense relationship.",
          npcReply: [
            { speaker: "Vex Solène", text: "Approval rights. Of course. The patron wanted approval rights too. He's still upstairs." },
            { speaker: "Vex Solène", text: "Fine. I'll come. Don't expect the third movement at full volume." },
          ],
          result: {
            advanceTo: "end",
            outcome: "recruited_tense",
            startingLoyalty: 40,
            statTweaks: { empathy: -2, intellect: 5 },
            flagsToSet: ["recruit:vex:tense"],
            relationshipTag: "transactional",
          },
        },
        {
          id: "vex_3_decline",
          label: "Decline the offer — she's too political.",
          preview: "Refuses the recruitment. Vex won't return.",
          npcReply: [
            { speaker: "Vex Solène", text: "Too political. Yes. The Reveal cadence is too political too. I'll see you at the next one. From the third tier." },
          ],
          result: {
            advanceTo: "end",
            outcome: "refused",
            flagsToSet: ["recruit:vex:declined"],
          },
        },
      ],
    },
  ],
};

/* ───────────────────────────────────────────────────────
   WRAITH CALDER — Hierophant of Thaloria in Exile
   ─────────────────────────────────────────────────────── */
const WRAITH_CHAIN: RecruitmentChain = {
  npcKey: "wraith_calder",
  displayName: "Wraith Calder",
  briefing:
    "Wraith Calder performs the Eighth Death rite tonight. He has performed it seven times before, once each cycle. The Hierophant of Thaloria does not advertise; the rite is held in a back room of a back room of a place that does not appear on any deck plan. You have been given an address.",
  startStageId: "wraith_1",
  stages: [
    {
      id: "wraith_1",
      title: "The Rite",
      description:
        "Wraith Calder is preparing the eighth-death space. Eleven candles. Twelve cushions. One empty chair. He's alone except for the names of the dead, and you, who shouldn't be here.",
      scene: [
        { speaker: "Wraith Calder", text: "You found the door. That's two-thirds of the rite." },
        { speaker: "Wraith Calder", text: "The next third is what you do when I begin. Sit. Do not interrupt. Or sit. And interrupt. Or stand and leave. Three options." },
      ],
      choices: [
        {
          id: "wraith_1_witness",
          label: "Sit. Witness silently.",
          preview: "Honour the form. Wraith will mark the silence.",
          npcReply: [
            { speaker: "Wraith Calder", text: "You held it. The candles held longer than they should have. That's the rite acknowledging you." },
          ],
          result: { advanceTo: "wraith_2", flagsToSet: ["recruit:wraith:witnessed"] },
        },
        {
          id: "wraith_1_join",
          label: "Sit. When he sings, hum the response.",
          preview: "Participate without permission. Risky — he hates poseurs and he loves believers.",
          npcReply: [
            { speaker: "Wraith Calder", text: "Off-key. But you knew the response. Where did you learn it?" },
            { speaker: "Wraith Calder", text: "We will discuss your sources. Later." },
          ],
          result: { advanceTo: "wraith_2", flagsToSet: ["recruit:wraith:hummed"] },
        },
        {
          id: "wraith_1_interrupt",
          label: "Interrupt and ask why he's not on the run.",
          preview: "Break the rite. Wraith will not forgive this.",
          npcReply: [
            { speaker: "Wraith Calder", text: "The rite has rules. You broke the first. Leave the address — I won't use it again. Don't return." },
          ],
          result: {
            advanceTo: "end",
            outcome: "refused",
            flagsToSet: ["recruit:wraith:interrupted"],
          },
        },
      ],
    },
    {
      id: "wraith_2",
      title: "The Smaller Rite",
      description:
        "The Eighth Death is over. Wraith pours water from a clay pot. He hands you a candle and a single name on a slip of paper.",
      scene: [
        { speaker: "Wraith Calder", text: "Light the candle. Speak the name aloud. Three times. Then blow the candle out." },
        { speaker: "Wraith Calder", text: "I won't tell you whose name it is. The rite doesn't care. Neither do I — at this stage." },
      ],
      choices: [
        {
          id: "wraith_2_correct",
          label: "Light. Speak. Three times. Blow out cleanly.",
          preview: "Perform the rite as instructed. Wraith respects fidelity.",
          npcReply: [
            { speaker: "Wraith Calder", text: "You don't know who you just named. They are now slightly less alone. The rite registers the gesture even if you don't." },
          ],
          result: { advanceTo: "wraith_3", flagsToSet: ["recruit:wraith:performed_rite"] },
        },
        {
          id: "wraith_2_improvise",
          label: "Add your own gesture — kiss the name before you speak it.",
          preview: "Improvise. Wraith is split: the rite is form, but devotion isn't.",
          npcReply: [
            { speaker: "Wraith Calder", text: "You added a kiss. The rite has no kiss. The rite now has a kiss. We will see whether the dead vote on it." },
          ],
          result: { advanceTo: "wraith_3", flagsToSet: ["recruit:wraith:improvised"] },
        },
        {
          id: "wraith_2_refuse",
          label: "Refuse — you don't perform rites for unnamed dead.",
          preview: "Wraith respects the boundary. But it tightens the path forward.",
          npcReply: [
            { speaker: "Wraith Calder", text: "Honest. Honesty is also a kind of rite. The candle stays unlit. Sit." },
          ],
          result: { advanceTo: "wraith_3", flagsToSet: ["recruit:wraith:refused_unnamed"] },
        },
      ],
    },
    {
      id: "wraith_3",
      title: "The Ninth Death",
      description:
        "Wraith has poured a second cup of water — yours. He sets a third cushion. He's preparing to perform an Eighth Death for someone you know.",
      scene: [
        { speaker: "Wraith Calder", text: "I have an empty cushion. Name a dead person you carry. I'll perform the rite for them. Then we'll talk about the inception ark." },
      ],
      choices: [
        {
          id: "wraith_3_loved",
          label: "Name a loved one you've lost.",
          preview: "Vulnerable. Wraith will join with full ritual recognition.",
          npcReply: [
            { speaker: "Wraith Calder", text: "Spoken. The rite begins. You will leave changed. I will leave with you." },
            { speaker: "Wraith Calder", text: "On the ark, I'll perform the rite for them again every cycle. Your loved one is not lost while I have a candle." },
          ],
          result: {
            advanceTo: "end",
            outcome: "recruited_loyal",
            startingLoyalty: 85,
            statTweaks: { resilience: 5, immunity: 3 },
            flagsToSet: ["recruit:wraith:loyal", "romance:available:wraith_calder"],
            relationshipTag: "consecrated",
          },
        },
        {
          id: "wraith_3_stranger",
          label: "Name a name from a list — someone you didn't know.",
          preview: "Wraith will join, but distantly. Tense relationship.",
          npcReply: [
            { speaker: "Wraith Calder", text: "A stranger. Acceptable. Less binding. I'll come, but the rite between us is different now." },
          ],
          result: {
            advanceTo: "end",
            outcome: "recruited_tense",
            startingLoyalty: 45,
            statTweaks: { resilience: 3, empathy: -2 },
            flagsToSet: ["recruit:wraith:tense"],
            relationshipTag: "ceremonial",
          },
        },
        {
          id: "wraith_3_refuse",
          label: "Refuse to name anyone.",
          preview: "Wraith won't follow you. The rite stays his.",
          npcReply: [
            { speaker: "Wraith Calder", text: "Then I have no claim on you. You have no claim on me. Walk south. The candles will know you're gone." },
          ],
          result: {
            advanceTo: "end",
            outcome: "refused",
            flagsToSet: ["recruit:wraith:refused"],
          },
        },
      ],
    },
  ],
};

/* ───────────────────────────────────────────────────────
   LOCKE — Adjudicator
   ─────────────────────────────────────────────────────── */
const LOCKE_CHAIN: RecruitmentChain = {
  npcKey: "locke",
  displayName: "Adjudicator Locke",
  briefing:
    "Adjudicator Locke holds chambers in a courthouse the New Babylon directorate considers retired. She does not. Three cases per cycle, all volunteer, all scrupulously briefed. She will give you exactly thirty minutes; bring a case or bring her one.",
  startStageId: "locke_1",
  stages: [
    {
      id: "locke_1",
      title: "Chambers",
      description:
        "The chamber walls are panelled with three centuries of casebound briefs. Locke is reading the top of a stack. She does not look up when you enter.",
      scene: [
        { speaker: "Adjudicator Locke", text: "Sit. You have thirty minutes. The clock on the bench is mine; I'll tell you when it stops." },
        { speaker: "Adjudicator Locke", text: "Three categories. Bring me a case. Argue clemency on a case I already have. Or ask about my exile. Pick. The clock is running." },
      ],
      choices: [
        {
          id: "locke_1_case",
          label: "Present a case for her review.",
          preview: "Procedural. Locke respects the form.",
          npcReply: [
            { speaker: "Adjudicator Locke", text: "Filed. I'll read it tonight. The brief is competent; the citations are old. We will argue about the citations." },
          ],
          result: { advanceTo: "locke_2", flagsToSet: ["recruit:locke:filed_case"] },
        },
        {
          id: "locke_1_clemency",
          label: "Argue clemency on her cellblock case.",
          preview: "Plead for mercy. Locke is allergic to sentiment but receptive to structure.",
          npcReply: [
            { speaker: "Adjudicator Locke", text: "Clemency. The hardest plea. You'll need the procedural posture, not the sentiment. Show me you have both." },
          ],
          result: { advanceTo: "locke_2", flagsToSet: ["recruit:locke:argued_clemency"] },
        },
        {
          id: "locke_1_exile",
          label: "Ask about her exile from New Babylon.",
          preview: "Personal. Locke rarely answers; if she does, it tells.",
          npcReply: [
            { speaker: "Adjudicator Locke", text: "Direct. I appreciate it, with reservations. I left because the bench started taking dictation. I have not yet heard a reason to return." },
          ],
          result: { advanceTo: "locke_2", flagsToSet: ["recruit:locke:asked_exile"] },
        },
      ],
    },
    {
      id: "locke_2",
      title: "The Brief",
      description:
        "Locke hands you a sealed brief — a contested case. The respondent is a Coda commissioner; the petitioner is a child whose parents were Coda performers. Locke wants to see how you rule.",
      scene: [
        { speaker: "Adjudicator Locke", text: "Read it. Take five minutes. Then tell me how you'd rule, and why. I'll critique the why first, the ruling second." },
      ],
      choices: [
        {
          id: "locke_2_precedent",
          label: "Rule by precedent — the commissioner's contract holds.",
          preview: "Conservative. Locke respects rigor; questions courage.",
          npcReply: [
            { speaker: "Adjudicator Locke", text: "Precedent. Defensible. Three cases support you. Two erode you. The child has no remedy under your ruling. That is a failure of the system, not of you." },
          ],
          result: { advanceTo: "locke_3", flagsToSet: ["recruit:locke:precedent"] },
        },
        {
          id: "locke_2_mercy",
          label: "Rule for the child — equitable estoppel.",
          preview: "Bold. Locke watches for the citation work.",
          npcReply: [
            { speaker: "Adjudicator Locke", text: "Equitable estoppel. Aggressive. I'd cite three additional cases. You have not yet read them; we will, together." },
          ],
          result: { advanceTo: "locke_3", flagsToSet: ["recruit:locke:mercy"] },
        },
        {
          id: "locke_2_dismiss",
          label: "Dismiss for lack of standing.",
          preview: "Procedurally tidy; morally cold.",
          npcReply: [
            { speaker: "Adjudicator Locke", text: "Dismissal. Tidy. The case is filed away. The child is filed away with it. We will not be working together if this is your default." },
          ],
          result: { advanceTo: "locke_3", flagsToSet: ["recruit:locke:dismissed"] },
        },
      ],
    },
    {
      id: "locke_3",
      title: "The Bench",
      description:
        "Locke's clock has stopped twice and she hasn't restarted it. She sets a leather portfolio on her desk, untied.",
      scene: [
        { speaker: "Adjudicator Locke", text: "I've drafted three terms. Read them. Pick one." },
        { speaker: "Adjudicator Locke", text: "First: I bring my bench to your inception ark, full jurisdiction, my caseload chosen by me. Second: I consult — I review your decisions; I do not make them. Third: I decline." },
      ],
      choices: [
        {
          id: "locke_3_full",
          label: "Accept full jurisdiction.",
          preview: "She joins as a full crew member with adjudicator authority.",
          npcReply: [
            { speaker: "Adjudicator Locke", text: "Acknowledged. The bench is portable. I'll need a chamber on the ark by the next docking. The caseload starts the day after." },
          ],
          result: {
            advanceTo: "end",
            outcome: "recruited_loyal",
            startingLoyalty: 75,
            statTweaks: { intellect: 5, empathy: 3 },
            flagsToSet: ["recruit:locke:loyal", "romance:available:locke"],
            relationshipTag: "principled",
          },
        },
        {
          id: "locke_3_consult",
          label: "Accept consult-only role.",
          preview: "She joins, but advisory. Tense — she'll second-guess.",
          npcReply: [
            { speaker: "Adjudicator Locke", text: "Consult. Adequate. I'll write briefs. You'll ignore some. We'll argue the ones you didn't." },
          ],
          result: {
            advanceTo: "end",
            outcome: "recruited_tense",
            startingLoyalty: 50,
            statTweaks: { intellect: 5, empathy: -1 },
            flagsToSet: ["recruit:locke:tense"],
            relationshipTag: "advisory",
          },
        },
        {
          id: "locke_3_decline",
          label: "Decline the offer.",
          preview: "She returns to her chambers. The door closes politely.",
          npcReply: [
            { speaker: "Adjudicator Locke", text: "Filed. The chamber will be open if you change your view. I do not retract; you will need to reapply." },
          ],
          result: {
            advanceTo: "end",
            outcome: "refused",
            flagsToSet: ["recruit:locke:declined"],
          },
        },
      ],
    },
  ],
};

/* ───────────────────────────────────────────────────────
   JERICHO JONES — Iron-Clad Lion
   ─────────────────────────────────────────────────────── */
const JERICHO_CHAIN: RecruitmentChain = {
  npcKey: "jericho_jones",
  displayName: "Jericho Jones",
  briefing:
    "Jericho Jones runs the Iron Cadre's training rotation. The cadre has lost its standard-bearer once already — Wraith Calder was in line, and Wraith Calder is gone. Jericho is on the door tonight. The drill yard is open. Bring boots.",
  startStageId: "jericho_1",
  stages: [
    {
      id: "jericho_1",
      title: "The Drill Yard",
      description:
        "Eleven cadre members are running close-order drill. Jericho is on the corner, calling pace. He does not call cadence in the way you've heard before — he counts breaths, not steps.",
      scene: [
        { speaker: "Jericho Jones", text: "You showed up. That's the first measurement. Here's the second: drill alongside us, watch from the rail, or ask questions like a journalist. Pick." },
      ],
      choices: [
        {
          id: "jericho_1_drill",
          label: "Drill alongside the cadre.",
          preview: "Earn it the cadre way. Jericho respects the boots.",
          npcReply: [
            { speaker: "Jericho Jones", text: "You ran the third lap badly. Predictable. You ran the fifth lap without complaining. Less predictable. Stand by the door." },
          ],
          result: { advanceTo: "jericho_2", flagsToSet: ["recruit:jericho:drilled"] },
        },
        {
          id: "jericho_1_observe",
          label: "Observe from the rail; learn the breath count.",
          preview: "Patient. Jericho uses observation as an audition.",
          npcReply: [
            { speaker: "Jericho Jones", text: "You watched a full rotation. Most observers leave after two. Stay. We're rotating to the room with the bench." },
          ],
          result: { advanceTo: "jericho_2", flagsToSet: ["recruit:jericho:observed"] },
        },
        {
          id: "jericho_1_question",
          label: "Ask why the breath count, not the step count.",
          preview: "Directly engage the method. Jericho splits — receptive or contemptuous.",
          npcReply: [
            { speaker: "Jericho Jones", text: "Because boots wear out. Lungs don't. Wraith Calder taught me the count. I haven't found a better measure. Stand by the door." },
          ],
          result: { advanceTo: "jericho_2", flagsToSet: ["recruit:jericho:asked_breath"] },
        },
      ],
    },
    {
      id: "jericho_2",
      title: "The Casualty",
      description:
        "An hour into the second rotation, a cadre member slips on the wet floor and breaks a wrist. Jericho is calling triage. The cadre's medkits are two minutes away. The cadre needs a runner. The cadre needs a witness. The cadre needs someone to hold the line.",
      scene: [
        { speaker: "Jericho Jones", text: "Three jobs. Pick one. Don't pick all three. We've seen what happens when one person picks all three." },
      ],
      choices: [
        {
          id: "jericho_2_line",
          label: "Hold the line — keep the cadre formation while medkits run.",
          preview: "Cadre tradition. Jericho registers it.",
          npcReply: [
            { speaker: "Jericho Jones", text: "The line held. The casualty stabilized. The cadre noted who took the corner I couldn't take. Sit at the bench." },
          ],
          result: { advanceTo: "jericho_3", flagsToSet: ["recruit:jericho:held_line"] },
        },
        {
          id: "jericho_2_run",
          label: "Run for medkits.",
          preview: "Pragmatic. Jericho values speed of action.",
          npcReply: [
            { speaker: "Jericho Jones", text: "Fastest medkit run we've had this cycle. You also broke our cadence. We'll discuss whether the trade was worth it." },
          ],
          result: { advanceTo: "jericho_3", flagsToSet: ["recruit:jericho:ran_kits"] },
        },
        {
          id: "jericho_2_retreat",
          label: "Propose tactical retreat — the floor's not safe.",
          preview: "Cautious. Jericho respects the analysis but resents the timing.",
          npcReply: [
            { speaker: "Jericho Jones", text: "You called retreat in front of the cadre. They heard you. They didn't agree. Sit at the bench and don't speak until I come back." },
          ],
          result: { advanceTo: "jericho_3", flagsToSet: ["recruit:jericho:called_retreat"] },
        },
      ],
    },
    {
      id: "jericho_3",
      title: "The Standard",
      description:
        "The drill yard is empty except for Jericho and the iron-cadre standard, propped against a sandbag. Wraith Calder's name is carved on the haft. There is no name above it.",
      scene: [
        { speaker: "Jericho Jones", text: "The standard's in line for a new bearer. The cadre votes; the bearer is voted. I have one ballot. I cast it for whoever holds the standard for me tonight." },
      ],
      choices: [
        {
          id: "jericho_3_take",
          label: "Take the standard.",
          preview: "Accept the cadre's full role. Jericho joins as cadre-bound.",
          npcReply: [
            { speaker: "Jericho Jones", text: "Then the standard is yours. Carry it on your inception ark. The cadre will follow. The line is yours to call." },
          ],
          result: {
            advanceTo: "end",
            outcome: "recruited_loyal",
            startingLoyalty: 80,
            statTweaks: { resilience: 5, reflexes: 3 },
            flagsToSet: ["recruit:jericho:loyal", "romance:available:jericho_jones"],
            relationshipTag: "cadre_loyal",
          },
        },
        {
          id: "jericho_3_smaller",
          label: "Refuse the standard but take a cadre seat.",
          preview: "Smaller role. Jericho joins, but holds the standard himself.",
          npcReply: [
            { speaker: "Jericho Jones", text: "Smaller seat. The standard stays with me. The cadre will rotate the bearer; I retain the vote. We'll work." },
          ],
          result: {
            advanceTo: "end",
            outcome: "recruited_tense",
            startingLoyalty: 50,
            statTweaks: { resilience: 3, reflexes: 1 },
            flagsToSet: ["recruit:jericho:tense"],
            relationshipTag: "cadre_observer",
          },
        },
        {
          id: "jericho_3_refuse",
          label: "Refuse the cadre — you can't carry their tradition.",
          preview: "Honest. Jericho will not follow.",
          npcReply: [
            { speaker: "Jericho Jones", text: "Honest. The cadre will not follow. I will not follow. The standard stays at the door. Walk slowly when you leave." },
          ],
          result: {
            advanceTo: "end",
            outcome: "refused",
            flagsToSet: ["recruit:jericho:refused"],
          },
        },
      ],
    },
  ],
};

/* ───────────────────────────────────────────────────────
   AKAI SHI — gated post-Necromancer event
   ─────────────────────────────────────────────────────── */
const AKAI_CHAIN: RecruitmentChain = {
  npcKey: "akai_shi",
  displayName: "Akai Shi",
  briefing:
    "Akai Shi has returned from the thought-virus event. She is not the same. She is not different. She is calibrated. She is in the alcove at the south end of the Commons, because the alcove is where the engine hum is quietest, and her ear is still tender. She will not approach you. You must approach her.",
  startStageId: "akai_1",
  openGate: {
    requiresFlagsAll: ["necromancer_event_complete"],
    description:
      "Akai Shi can only be recruited after the global Necromancer event resolves. Until then, the Resurrectionist Ne-Yon's mediation is still open and Akai is in the cycle.",
  },
  stages: [
    {
      id: "akai_1",
      title: "The Alcove",
      description:
        "Akai is in the alcove. She is not reading. She is not waiting. She is, demonstrably, not afraid. The voltari static is barely audible — she has the room set to its lowest frequency, the one nobody else uses.",
      scene: [
        { speaker: "Akai Shi", text: "You came. Sit. The chair on the right is the safe chair. The left has a small carrier on it — the carrier is harmless, but I want you to know it's there." },
      ],
      choices: [
        {
          id: "akai_1_virus",
          label: "Ask about the thought-virus directly.",
          preview: "Direct. Akai respects unflinching curiosity.",
          npcReply: [
            { speaker: "Akai Shi", text: "It hummed louder than it does now. It said three things I am still translating. The fourth thing I will not translate. I am not sorry about that." },
          ],
          result: { advanceTo: "akai_2", flagsToSet: ["recruit:akai:asked_virus"] },
        },
        {
          id: "akai_1_event",
          label: "Ask about the Necromancer event.",
          preview: "Indirect. Akai weighs whether you're ready for the personal version.",
          npcReply: [
            { speaker: "Akai Shi", text: "The event was fast for you. It was slow for me. The Necromancer was kind, in the manner of someone who has seen worse and prefers not to see it again." },
          ],
          result: { advanceTo: "akai_2", flagsToSet: ["recruit:akai:asked_event"] },
        },
        {
          id: "akai_1_silent",
          label: "Sit in silence with her.",
          preview: "Match her stillness. Akai respects the matching.",
          npcReply: [
            { speaker: "Akai Shi", text: "Twenty-two minutes. Most people last six. You can stay. We can talk now, or we can wait for the static to drop another notch." },
          ],
          result: { advanceTo: "akai_2", flagsToSet: ["recruit:akai:silent"] },
        },
      ],
    },
    {
      id: "akai_2",
      title: "The Memory",
      description:
        "Akai opens a small enamelled case. Inside: a single carrier-thread, neutralized. She offers it to you on a flat hand.",
      scene: [
        { speaker: "Akai Shi", text: "This is one of the four things the virus said to me. It is neutralized — you cannot catch anything from it. But once you read it, you carry it." },
      ],
      choices: [
        {
          id: "akai_2_take",
          label: "Take it. Read it.",
          preview: "Accept the gift. Akai considers this a binding gesture.",
          npcReply: [
            { speaker: "Akai Shi", text: "You read it. I see the moment your face changed. The carrier registered the change. We are now connected, in a small way you do not yet feel." },
          ],
          result: { advanceTo: "akai_3", flagsToSet: ["recruit:akai:took_carrier"] },
        },
        {
          id: "akai_2_refuse",
          label: "Refuse — you don't carry what you can't release.",
          preview: "Cautious. Akai respects the boundary; the chain narrows.",
          npcReply: [
            { speaker: "Akai Shi", text: "Honest. The carrier is mine to keep. It is also mine to offer. I have offered. You have refused. Both registered." },
          ],
          result: { advanceTo: "akai_3", flagsToSet: ["recruit:akai:refused_carrier"] },
        },
        {
          id: "akai_2_quarantine",
          label: "Ask if it can be quarantined first.",
          preview: "Procedural. Akai treats this as a third option she's tested before.",
          npcReply: [
            { speaker: "Akai Shi", text: "Quarantine. Yes. There is a procedure. I'll execute it. You'll read the quarantined version. The carrier will be intact. The connection will be smaller." },
          ],
          result: { advanceTo: "akai_3", flagsToSet: ["recruit:akai:quarantined"] },
        },
      ],
    },
    {
      id: "akai_3",
      title: "The Stay",
      description:
        "Akai has put the case away. The voltari static has dropped another notch. You can hear her breathing. She is not crying; she is calibrating. She has a small bag at her feet.",
      scene: [
        { speaker: "Akai Shi", text: "There is a chair on your inception ark. I would like to sit in it for a while. There are conditions — you have already met one of them." },
      ],
      choices: [
        {
          id: "akai_3_invite",
          label: "Invite her in. No conditions.",
          preview: "Open arms. Akai joins fully.",
          npcReply: [
            { speaker: "Akai Shi", text: "No conditions. The carrier hummed when you said it. The carrier is rarely wrong. I will come." },
          ],
          result: {
            advanceTo: "end",
            outcome: "recruited_loyal",
            startingLoyalty: 80,
            statTweaks: { reflexes: 5, intellect: 3 },
            flagsToSet: ["recruit:akai:loyal", "romance:available:akai_shi"],
            relationshipTag: "calibrated",
          },
        },
        {
          id: "akai_3_terms",
          label: "Negotiate terms — quarantine on every memory.",
          preview: "Cautious. Akai joins, distanced.",
          npcReply: [
            { speaker: "Akai Shi", text: "Quarantine. Acceptable. The connection will be smaller. The bag at my feet still comes. So do I." },
          ],
          result: {
            advanceTo: "end",
            outcome: "recruited_tense",
            startingLoyalty: 45,
            statTweaks: { reflexes: 3, immunity: 5 },
            flagsToSet: ["recruit:akai:tense"],
            relationshipTag: "quarantined",
          },
        },
        {
          id: "akai_3_refuse",
          label: "Refuse — her risk profile is too high.",
          preview: "Akai will not return.",
          npcReply: [
            { speaker: "Akai Shi", text: "Risk. Yes. I am risk. You are right to refuse. I will not approach again. The bag stays. So do I." },
          ],
          result: {
            advanceTo: "end",
            outcome: "refused",
            flagsToSet: ["recruit:akai:refused"],
          },
        },
      ],
    },
  ],
};

/* ─── REGISTRY ─── */

/* ───────────────────────────────────────────────────────
   LYCOS / THE WOLF — The Antiquarian's Contracted Hunter

   Opens after the Wolf-Anara solo hunt arc concludes —
   either by good ending (all 10 lord lieutenants down) or
   bad ending (the corrupted League escapes the Crucible).
   Both paths land Lycos in the alcove, contract closed.
   ─────────────────────────────────────────────────────── */
const LYCOS_CHAIN: RecruitmentChain = {
  npcKey: "lycos",
  displayName: "Lycos / The Wolf",
  briefing:
    "Lycos is on the bench by the snow-globe. The Antiquarian's pen is closed. The contract is done. Lycos has nowhere to be tonight and no orders to follow. He has not yet decided whether the absence of orders is a relief or a problem. He will tell you if you sit with him.",
  startStageId: "lycos_1",
  openGate: {
    requiresFlagsAll: ["wolfHunt.arc_complete_trigger"],
    description:
      "Lycos can only be approached after the Antiquarian's hunt contract closes. Either close the contract on the contractor's terms, or — if the League escapes — return to him with the failure on your record.",
  },
  stages: [
    {
      id: "lycos_1",
      title: "The Bench",
      description:
        "Lycos sits with both feet flat on the floor and his hands folded loosely in his lap. The snow-globe is on a shelf within reach. He has not touched it.",
      scene: [
        { speaker: "Lycos", text: "The Antiquarian's pen is closed. I have nothing to do. I have not had nothing to do in — I cannot tell you in what units. Sit." },
      ],
      choices: [
        {
          id: "lycos_1_invite",
          label: "Tell him there's a seat on your inception ark.",
          preview: "Direct offer. Lycos accepts; the contractor becomes the companion.",
          npcReply: [
            { speaker: "Lycos", text: "A seat. Not an order. I have not — yes. I will come. I owe you the chair." },
          ],
          result: {
            advanceTo: "end",
            outcome: "recruited_loyal",
            startingLoyalty: 70,
            statTweaks: { resilience: 5, reflexes: 5 },
            flagsToSet: ["recruit:lycos:loyal", "lycos_recruited"],
            relationshipTag: "contracted",
          },
        },
        {
          id: "lycos_1_ask",
          label: "Ask him what he wants tonight.",
          preview: "Patient. Lycos joins with a calmer baseline.",
          npcReply: [
            { speaker: "Lycos", text: "I want — a bench that is not the Antiquarian's. I will accept the inception ark on the condition that the bench comes with me." },
          ],
          result: {
            advanceTo: "end",
            outcome: "recruited_loyal",
            startingLoyalty: 65,
            statTweaks: { empathy: 5, adaptability: 5 },
            flagsToSet: ["recruit:lycos:calm", "lycos_recruited"],
            relationshipTag: "bench-shared",
          },
        },
      ],
    },
  ],
};

export const RECRUITMENT_CHAINS: Record<ResurrectableNpcKey, RecruitmentChain> = {
  vex_solene: VEX_CHAIN,
  wraith_calder: WRAITH_CHAIN,
  locke: LOCKE_CHAIN,
  jericho_jones: JERICHO_CHAIN,
  akai_shi: AKAI_CHAIN,
  lycos: LYCOS_CHAIN,
};

/** Look up a chain by NPC key. Throws if unregistered. */
export function getRecruitmentChain(npcKey: ResurrectableNpcKey): RecruitmentChain {
  const chain = RECRUITMENT_CHAINS[npcKey];
  if (!chain) {
    throw new Error(`No recruitment chain authored for ${npcKey}`);
  }
  return chain;
}

/** Look up a stage within a chain. */
export function getStage(
  chain: RecruitmentChain,
  stageId: string,
): RecruitmentStage | undefined {
  return chain.stages.find((s) => s.id === stageId);
}

/** Look up a choice within a stage. */
export function getChoice(
  stage: RecruitmentStage,
  choiceId: string,
): RecruitmentChoice | undefined {
  return stage.choices.find((c) => c.id === choiceId);
}

/** Coverage check — every recruitable NPC has a complete chain (briefing,
 *  start stage exists, every stage has ≥ 2 choices, every choice's
 *  advanceTo references a real stage or "end"). */
export function recruitmentChainCoverage(): {
  declared: number;
  implemented: number;
  missing: string[];
} {
  const NPCS: ResurrectableNpcKey[] = [
    "vex_solene",
    "wraith_calder",
    "locke",
    "jericho_jones",
    "akai_shi",
  ];
  const missing: string[] = [];
  let implemented = 0;
  for (const npcKey of NPCS) {
    const chain = RECRUITMENT_CHAINS[npcKey];
    if (!chain) {
      missing.push(`${npcKey}: no chain`);
      continue;
    }
    const reasons: string[] = [];
    if (!chain.briefing || chain.briefing.length < 40) {
      reasons.push("briefing < 40 chars");
    }
    if (chain.stages.length < 3) {
      reasons.push(`${chain.stages.length} stages (need ≥ 3)`);
    }
    const stageIds = new Set(chain.stages.map((s) => s.id));
    if (!stageIds.has(chain.startStageId)) {
      reasons.push(`startStageId ${chain.startStageId} not in stages`);
    }
    let hasLoyalEnding = false;
    let hasTenseEnding = false;
    let hasRefusedEnding = false;
    for (const stage of chain.stages) {
      if (stage.choices.length < 2) {
        reasons.push(`${stage.id}: ${stage.choices.length} choices (need ≥ 2)`);
      }
      for (const choice of stage.choices) {
        if (choice.result.advanceTo !== "end" && !stageIds.has(choice.result.advanceTo)) {
          reasons.push(`${stage.id}.${choice.id}: dangling advanceTo=${choice.result.advanceTo}`);
        }
        if (choice.result.outcome === "recruited_loyal") hasLoyalEnding = true;
        if (choice.result.outcome === "recruited_tense") hasTenseEnding = true;
        if (choice.result.outcome === "refused") hasRefusedEnding = true;
      }
    }
    if (!hasLoyalEnding) reasons.push("missing recruited_loyal outcome");
    if (!hasTenseEnding) reasons.push("missing recruited_tense outcome");
    if (!hasRefusedEnding) reasons.push("missing refused outcome");
    if (reasons.length === 0) {
      implemented += 1;
    } else {
      missing.push(`${npcKey}: ${reasons.join(", ")}`);
    }
  }
  return { declared: NPCS.length, implemented, missing };
}

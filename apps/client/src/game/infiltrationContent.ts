/* ═══════════════════════════════════════════════════════
   INFILTRATION CONTENT — Per-stage scripts for the Eyes Path
   §7.3 of WITNESSING_NARRATIVE_PROPOSAL.md

   Each of Act 3's six faction infiltration paths is a series
   of narrative stages. This file defines the bespoke content
   for every one of them (21 stages across 6 factions) and
   exposes it via a typed map the runner component consumes.

   Per-stage content is one of 9 minigame shapes:
     - choice        moral/plot fork with multiple options
     - judgment      rule on one or more cases; each verdict flags
     - dialogue      NPC exchanges with player response picks
     - rewrite       loredex entry rewrite (writes override at commit)
     - ritual        multi-beat click-through (atmospheric weight)
     - decrypt       signal pattern-match minigame
     - dark_flip     session of cards flipping to Dark counterparts
     - silence       atmospheric no-input beat with long pauses
     - time_skip     "time passes" atmospheric fragments

   Content files land per-faction in the following commits. An
   empty INFILTRATION_STAGES map is exported here as a stable
   interface so the runner can be built against types immediately.
   ═══════════════════════════════════════════════════════ */

import type { Act3FactionId } from "./tradeEmpire";

/* ─── SHARED TYPES ─── */

export type InfiltrationStageType =
  | "choice"
  | "judgment"
  | "dialogue"
  | "rewrite"
  | "ritual"
  | "decrypt"
  | "dark_flip"
  | "silence"
  | "time_skip";

interface StageBase {
  /** Must match the stage id in ACT3_FACTION_ARCS (e.g. "nb_i_1") */
  stageId: string;
  factionId: Act3FactionId;
  title: string;
  /** Short scene-setting paragraph shown at the top of the minigame */
  intro: string;
  type: InfiltrationStageType;
  /** Flags to set on any successful completion of this stage */
  flagsOnComplete?: string[];
}

/* ─── "choice" — multi-option moral/plot fork ─── */

export interface ChoiceOption {
  id: string;
  label: string;
  /** Narrative description shown after pick */
  outcome: string;
  /** Flags to set for THIS specific option (stacks with stage.flagsOnComplete) */
  flags?: string[];
  /** Some choices cause the path to FAIL rather than advance */
  fails?: boolean;
}

export interface ChoiceStage extends StageBase {
  type: "choice";
  prompt: string;
  options: ChoiceOption[];
}

/* ─── "judgment" — rule on one or more cases ─── */

export interface JudgmentCase {
  id: string;
  caseTitle: string;
  prompt: string;
  /** Verdict options — each is a ChoiceOption with its own outcome/flags */
  verdicts: ChoiceOption[];
}

export interface JudgmentStage extends StageBase {
  type: "judgment";
  cases: JudgmentCase[];
  /** Optional finale line shown after all cases resolved */
  finalLine?: string;
}

/* ─── "dialogue" — NPC exchanges with picked responses ─── */

export interface DialogueResponse extends ChoiceOption {
  /** NPC's follow-up line keyed to this response */
  npcReply?: string;
}

export interface DialogueExchange {
  npcLine: string;
  responses: DialogueResponse[];
}

export interface DialogueStage extends StageBase {
  type: "dialogue";
  speaker: string;
  /** Optional portrait path */
  portrait?: string;
  exchanges: DialogueExchange[];
}

/* ─── "rewrite" — loredex entry rewrite ─── */

export interface RewriteTemplate {
  id: string;
  /** Player-facing label for this rewrite option */
  label: string;
  /** The "claim" the player is committing to */
  claim: string;
  /** The fragment to find in the entry's bio */
  find: string;
  /** The text to replace it with */
  replace: string;
}

export interface RewriteStage extends StageBase {
  type: "rewrite";
  /** Loredex entity id to rewrite (e.g. "entity_22") */
  entityId: string;
  /** Display name shown in the UI */
  entityName: string;
  /** Excerpt from the entry shown for context */
  entityPreview: string;
  templates: RewriteTemplate[];
  /** true = commits to localStorage via loredexRewrite.ts */
  binding: boolean;
}

/* ─── "ritual" — multi-beat click-through ─── */

export interface RitualBeat {
  /** Short label above the beat (e.g. "FIRST CUT") */
  label?: string;
  text: string;
  buttonLabel: string;
}

export interface RitualStage extends StageBase {
  type: "ritual";
  beats: RitualBeat[];
  /** Line shown after all beats are done */
  closingLine: string;
}

/* ─── "decrypt" — signal pattern-match ─── */

export interface DecryptSlot {
  correct: string;
  decoys: string[];
}

export interface DecryptStage extends StageBase {
  type: "decrypt";
  hint: string;
  slots: DecryptSlot[];
  /** Max wrong picks before the stage fails */
  maxWrongPicks: number;
}

/* ─── "dark_flip" — cards flipping to Dark counterparts ─── */

export interface DarkFlipPair {
  light: string;
  dark: string;
  /** Short wry note about the flip */
  note: string;
}

export interface DarkFlipStage extends StageBase {
  type: "dark_flip";
  pairs: DarkFlipPair[];
  closingLine: string;
}

/* ─── "silence" / "time_skip" — atmospheric fragments ─── */

export interface AtmosphericFragment {
  text: string;
  /** How long this fragment dwells before advancing (ms) */
  pauseMs: number;
}

export interface SilenceStage extends StageBase {
  type: "silence";
  fragments: AtmosphericFragment[];
  finalButton: string;
}

export interface TimeSkipStage extends StageBase {
  type: "time_skip";
  fragments: AtmosphericFragment[];
  finalButton: string;
}

export type InfiltrationStage =
  | ChoiceStage
  | JudgmentStage
  | DialogueStage
  | RewriteStage
  | RitualStage
  | DecryptStage
  | DarkFlipStage
  | SilenceStage
  | TimeSkipStage;

/* ─── STAGE MAP ─── */

/**
 * Keyed by stageId. Populated incrementally per-faction in sibling commits.
 * Consumers should treat a missing key as "stage content not yet authored"
 * and fall back to the generic "MARK STAGE COMPLETE" flow in TradeEmpirePage.
 */
export const INFILTRATION_STAGES: Record<string, InfiltrationStage> = {
  /* ═══════════════════════════════════════════════════════
     F1 — NEW BABYLON ASCENDANT — "Become the Next Adjudicator"
     §7.3 F1 Infiltration path. Six weeks of bureaucratic climbing
     through the Authority's court. Finale: the player judges
     Senator Elara Voss in a replayed archive trial. Elara will
     remember the verdict.
     ═══════════════════════════════════════════════════════ */

  nb_i_1: {
    stageId: "nb_i_1",
    factionId: "new_babylon",
    type: "choice",
    title: "Assume the Identity",
    intro:
      "Adjudicator Locke hands you a folder. Inside: three forged identities, each pre-aged, each with a cover legend long enough to pass the Authority's background sieves. She waits for you to pick without watching you pick.",
    prompt: "Which cover do you take into the court?",
    options: [
      {
        id: "nb_i_1_clerk",
        label: "JUNIOR CLERK — Tenzin Oruko",
        outcome:
          "A safe, anonymous post at the Records Annex. Nobody looks at you twice. Nobody remembers your face. The slowest climb, but the least risk of burn.",
        flags: ["nb_cover_clerk"],
      },
      {
        id: "nb_i_1_aide",
        label: "INTERROGATOR'S AIDE — Second Chair Vass",
        outcome:
          "A harder entry, closer to the heart of the court. You'll see the real cases from day one. You'll also be in a room where the Authority's minds listen to every heartbeat.",
        flags: ["nb_cover_aide"],
      },
      {
        id: "nb_i_1_stenographer",
        label: "ARCHIVE STENOGRAPHER — Widow Pryce",
        outcome:
          "A dead woman's name. Pryce actually existed, and actually died in the Fall, and her signature is still good in the archive system. You inherit her handwriting and her grief. The Authority prefers the quiet grieving.",
        flags: ["nb_cover_stenographer"],
      },
    ],
    flagsOnComplete: ["nb_identity_assumed"],
  },

  nb_i_2: {
    stageId: "nb_i_2",
    factionId: "new_babylon",
    type: "judgment",
    title: "First Ruling",
    intro:
      "The court hands you three small cases to prove you can read a docket. None of them matter — which is the point. The Authority watches how you rule on things that cost it nothing.",
    cases: [
      {
        id: "nb_i_2_case_widow",
        caseTitle: "Widow Ashar's Tax Appeal",
        prompt:
          "A widow on Level Nineteen claims her late husband's trade-nexus tariff was double-assessed in the week he died. The bureaucracy wants her to pay the full amount. She has no proof except her husband's handwriting on a ledger page.",
        verdicts: [
          {
            id: "nb_i_2_widow_grant",
            label: "Grant the appeal. The handwriting is proof enough.",
            outcome: "Ashar weeps on the courtroom floor. The Authority's stenographer notes a flicker of impatience from the bench next to yours. You have made a soft choice.",
            flags: ["nb_ruling_1_grant"],
          },
          {
            id: "nb_i_2_widow_deny",
            label: "Deny. Precedent requires notarized proof.",
            outcome: "Ashar bows and leaves without speaking. The stenographer next to you nods approvingly. The Authority prefers judges who do not feel.",
            flags: ["nb_ruling_1_deny"],
          },
          {
            id: "nb_i_2_widow_split",
            label: "Halve the bill. Cite administrative error.",
            outcome: "The split ruling is a cowardly compromise, which is also the most common kind of ruling. Nobody's happy. Nobody's furious. Perfect.",
            flags: ["nb_ruling_1_split"],
          },
        ],
      },
      {
        id: "nb_i_2_case_grain",
        caseTitle: "Level Four Grain Theft",
        prompt:
          "Three Level Four children stole a sack of grain from a state silo. The grain recovered, the children caught. The statutory penalty is indenture for life. Prosecution asks it. Defense says they are eight years old.",
        verdicts: [
          {
            id: "nb_i_2_grain_indenture",
            label: "Indenture. The law is the law.",
            outcome: "The children are led out without crying. One of them looks back at you. The Authority marks you as reliable.",
            flags: ["nb_ruling_2_indenture"],
          },
          {
            id: "nb_i_2_grain_probation",
            label: "Probation. Six months of kitchen work.",
            outcome: "The defense attorney looks at you the way someone looks at a door that just opened. You have used a loophole she didn't even know existed. The stenographer notes your flexibility.",
            flags: ["nb_ruling_2_probation"],
          },
          {
            id: "nb_i_2_grain_dismiss",
            label: "Dismiss. Children cannot form felonious intent.",
            outcome: "The Authority's mind in the nearest coffin hums disapproval at a frequency only your teeth can hear. You have been flagged as 'interpretive.' You will pay for this later.",
            flags: ["nb_ruling_2_dismiss"],
          },
        ],
      },
      {
        id: "nb_i_2_case_land",
        caseTitle: "The Disputed Terrace",
        prompt:
          "Two neighboring households on Terrace Forty-One both produce deeds to the same three-square-meter balcony. Both deeds are a hundred years old. Both are signed by the same long-dead clerk. One of them must be a forgery.",
        verdicts: [
          {
            id: "nb_i_2_land_investigate",
            label: "Order forensic analysis of both deeds.",
            outcome: "Thorough. The Authority prefers thorough over fast. Two weeks later the forgery is identified and the losing family is fined. You have earned your first commendation.",
            flags: ["nb_ruling_3_investigate"],
          },
          {
            id: "nb_i_2_land_split",
            label: "Split the balcony. Rule King Solomon.",
            outcome: "The balcony is too small to split usefully. You have created a second dispute where there was one, which is the Authority's favorite ruling because it generates court fees in perpetuity.",
            flags: ["nb_ruling_3_split"],
          },
        ],
      },
    ],
    finalLine:
      "You sign your third ruling and the bailiff takes the docket away. The court chamber is silent except for the faint coffin hum. Locke's eyes find yours across the hall and her head tilts approval. You are, for the first time, *inside*.",
    flagsOnComplete: ["nb_first_rulings_done"],
  },

  nb_i_3: {
    stageId: "nb_i_3",
    factionId: "new_babylon",
    type: "dialogue",
    title: "Rise Through the Ranks",
    intro:
      "Three weeks pass. You have become passable at the work. The court has a culture and you are learning it. Tonight, two senior adjudicators want to meet you privately — one in the evening archive, one in a back room of the Coffin Chamber. Both are a test. You already know this.",
    speaker: "Senior Adjudicator Veil",
    exchanges: [
      {
        npcLine:
          "They tell me you rule fast and quiet. That's the good kind of reputation for your grade. Most juniors rule slow and loud, trying to prove they *feel*. We don't need feeling here. Tell me — what do you think the job is actually for?",
        responses: [
          {
            id: "nb_i_3_a1",
            label: "\"To execute the Authority's will faithfully.\"",
            outcome: "Veil nods with the smallest possible satisfaction. This is the answer the Authority wants its mid-rank clerks to give back to it.",
            npcReply:
              "Good. Most juniors try to be clever. Cleverness is dangerous when the thing judging you has six minds in six coffins and all the time in the world. Execution is the whole craft.",
            flags: ["nb_veil_loyal"],
          },
          {
            id: "nb_i_3_a2",
            label: "\"To reduce pain in the city by the smallest amount that doesn't get me killed.\"",
            outcome: "Veil's eyes actually widen. That is the answer veterans give when they want to flag themselves to other veterans. You have just identified yourself as someone who has read more than the official manuals.",
            npcReply:
              "Careful with that, newcomer. Very careful. I am pretending you did not just say that. Some night I may not be pretending. Some night you and I may have to drink together.",
            flags: ["nb_veil_kindred"],
          },
          {
            id: "nb_i_3_a3",
            label: "\"I'm still working that out.\"",
            outcome: "Veil is bored now. Bored is the safest thing you can make a senior adjudicator. Bored means they stop watching you.",
            npcReply:
              "Figure it out faster. The court is not kind to clerks who don't know why they're clerks.",
            flags: ["nb_veil_neutral"],
          },
        ],
      },
      {
        npcLine:
          "They also tell me you've got a file on the replayed trials. The old cases. The archive cases from before the Fall. Locke signed off on it. Why those particular files, Adjudicator?",
        responses: [
          {
            id: "nb_i_3_b1",
            label: "\"Pattern research. I'm interested in how the court ruled before the Authority existed.\"",
            outcome: "Veil accepts this at face value. It is the exact kind of lie a junior would tell to sound studious. They write it down to your credit.",
            npcReply:
              "A lot of junior adjudicators go looking in the archives for their edge. Most never find anything. Good hunting.",
            flags: ["nb_veil_file_excused"],
          },
          {
            id: "nb_i_3_b2",
            label: "\"One of the files has a senator in it I used to know.\"",
            outcome: "You have told Veil a piece of the truth — the smallest piece. Veil watches you for a very long moment and says nothing. They will remember this. You have marked yourself as *connected*.",
            npcReply:
              "Then be careful whose name you say out loud. Names have weight in the court. Some names are tied to coffin lids. You do not want to pull on those strings.",
            flags: ["nb_veil_file_hinted"],
          },
          {
            id: "nb_i_3_b3",
            label: "\"Just curiosity.\"",
            outcome: "Veil shrugs and signs your access extension without meeting your eyes. This is either safe or disastrous and you will not know which for another week.",
            npcReply: "Curiosity gets juniors promoted. Curiosity also gets them re-assigned to Level Nineteen records. Try to get promoted.",
            flags: ["nb_veil_file_dismissed"],
          },
        ],
      },
    ],
    flagsOnComplete: ["nb_risen_through_ranks"],
  },

  /* ═══════════════════════════════════════════════════════
     F2 — HIERARCHY OF THE DAMNED — "Shadow Tongue's Apprentice"
     §7.3 F2 Infiltration path. Learn to rewrite small pieces
     of the Loredex. Lie to the universe and make it true.
     Uses the loredexRewrite.ts override layer — the player's
     changes are permanent on their device.
     ═══════════════════════════════════════════════════════ */

  hi_i_1: {
    stageId: "hi_i_1",
    factionId: "hierarchy",
    type: "choice",
    title: "Accept the Bargain",
    intro:
      "The Shadow Tongue receives you in the Armory. They are not in their vessel-body. They are spread across every metal surface in the room, and their voice comes from wherever you happen to be looking. They set three terms on the table. You must accept one to be apprenticed. Accepting more than one is not permitted. Declining all three ends the offer permanently.",
    prompt: "Which term do you accept?",
    options: [
      {
        id: "hi_i_1_truth",
        label: "PAY IN TRUTH — Surrender one secret you have never spoken.",
        outcome:
          "You whisper a secret into the silence and it leaves you. You do not remember what the secret was when you finish saying it. This is the oldest and cheapest currency the Shadow Tongue accepts. They are slightly disappointed you chose the cheap one, which means they expect you to be very useful.",
        flags: ["hi_term_truth"],
      },
      {
        id: "hi_i_1_blood",
        label: "PAY IN BLOOD — Three drops, drawn willingly, from the webbing of your left hand.",
        outcome:
          "The cut is painless until you look away. When you look back the scar has already knit. The Shadow Tongue breathes in when they see the mark — blood is the currency of the Hierarchy's most entangled contracts. You have signed something longer than this stage.",
        flags: ["hi_term_blood"],
      },
      {
        id: "hi_i_1_name",
        label: "PAY IN NAME — Surrender the name of someone you love to the Book of Names.",
        outcome:
          "You write Elara's name, or the Human's name, or the Engineer's name, or whichever name you chose in that terrible pause — you write it into the Book of Names. It stays there. The person whose name you wrote does not know. They will not know until the Hierarchy decides they should.",
        flags: ["hi_term_name", "hi_name_pledged"],
      },
    ],
    flagsOnComplete: ["hi_apprenticeship_accepted"],
  },

  hi_i_2: {
    stageId: "hi_i_2",
    factionId: "hierarchy",
    type: "rewrite",
    title: "First Rewrite",
    intro:
      "The Shadow Tongue brings you a single Loredex page and a single pen. 'Practice on a quiet one,' they say. 'A Judge. Nobody reads this entry. Nobody will notice the change. The universe will not resist. Try it.'\n\nThis rewrite is practice. It does not alter the canonical record — only your copy. The Graduate stage will be the binding one.",
    entityId: "entity_31",
    entityName: "The Judge",
    entityPreview:
      "Deciding the fate of individuals, civilizations, and ideologies, the Judge is guided solely by their perception of balance and fairness.",
    templates: [
      {
        id: "hi_i_2_tmpl_cruelty",
        label: "REWRITE: The Judge is cruel by design.",
        claim:
          "Change the Judge's motivation from 'balance and fairness' to 'cruelty the court pretends is fairness'.",
        find: "the Judge is guided solely by their perception of balance and fairness",
        replace: "the Judge is guided by a cruelty the court has learned to pretend is fairness",
      },
      {
        id: "hi_i_2_tmpl_bribery",
        label: "REWRITE: The Judge is for sale.",
        claim: "Change 'balance and fairness' to 'the Judge's last accepted bribe'.",
        find: "the Judge is guided solely by their perception of balance and fairness",
        replace: "the Judge is guided solely by whichever party offered the largest bribe most recently",
      },
      {
        id: "hi_i_2_tmpl_kinder",
        label: "REWRITE: The Judge is quietly merciful.",
        claim: "Change 'balance and fairness' to 'mercy they will never admit to in open court'.",
        find: "the Judge is guided solely by their perception of balance and fairness",
        replace: "the Judge is guided, in private, by a mercy they will never admit to in open court",
      },
    ],
    binding: false,
    flagsOnComplete: ["hi_first_rewrite_done"],
  },

  hi_i_3: {
    stageId: "hi_i_3",
    factionId: "hierarchy",
    type: "ritual",
    title: "Blood Weave Ritual",
    intro:
      "The Shadow Tongue leads you into the Armory's sub-chamber. The Blood Weave hangs on the back wall like a tapestry that has only half-decided to be physical. The ritual has five beats. You will not be allowed to skip any of them. Each beat takes something.",
    beats: [
      {
        label: "BEAT 1 — THE FIRST CUT",
        text:
          "The Shadow Tongue opens a thin line across the webbing of your left hand — not the one you paid with in hi_i_1, the other one. The pain arrives slightly after you see the cut, the way distant lightning arrives after the flash.",
        buttonLabel: "HOLD STILL",
      },
      {
        label: "BEAT 2 — THE NAME YOU DO NOT SAY",
        text:
          "A name rises in your throat unbidden — the name of someone you promised yourself you would never think of again in a room with a mirror in it. The Shadow Tongue writes it down without asking you. They already knew.",
        buttonLabel: "LET IT GO",
      },
      {
        label: "BEAT 3 — THE THREAD",
        text:
          "A single thread of the Blood Weave detaches from the tapestry and climbs your forearm. It is not blood. It is the IDEA of blood. It sits under your skin now, warm, looking for something to bind. You will feel it for the rest of the game.",
        buttonLabel: "ACCEPT THE THREAD",
      },
      {
        label: "BEAT 4 — THE RECITATION",
        text:
          "The Shadow Tongue teaches you the five syllables that open the Book of Names. You say them after them, once. They tell you to never say them again in this room. You immediately want to say them again. You will have to not-say them for the rest of this session.",
        buttonLabel: "SWALLOW THE SYLLABLES",
      },
      {
        label: "BEAT 5 — THE SEAL",
        text:
          "The Shadow Tongue presses their thumb to the cut on your hand. It closes. It leaves a brand shaped like a sentence you cannot read. The ritual is complete. You are an apprentice now by contract and by Weave.",
        buttonLabel: "RISE, APPRENTICE",
      },
    ],
    closingLine:
      "You walk out of the sub-chamber with two new scars, one secret you cannot remember, and a single thread of the Blood Weave asleep under the skin of your forearm. Elara asks if you are all right. You lie.",
    flagsOnComplete: ["hi_blood_weave_ritual_done", "blood_weave_thread_acquired"],
  },

  hi_i_4: {
    stageId: "hi_i_4",
    factionId: "hierarchy",
    type: "rewrite",
    title: "Graduate",
    intro:
      "The Shadow Tongue sets the Recruiter's Loredex page on the lectern. 'This one is weighted,' they say. 'This one is tied to real people and real events. If you rewrite this, the universe will push back and lose. You will have changed something that was. Make a choice you can live with, apprentice. This is binding.'\n\nWhatever you pick is permanent on your device. The Loredex entry you know will be the one you wrote, from now until you start a new game.",
    entityId: "entity_26",
    entityName: "The Recruiter",
    entityPreview:
      "Initially, he applied his powers to benefit the Empire, enrolling at the Academy and swiftly rising in influence. Yet, when the Iron Lion was expelled, the Recruiter chose to abandon his training and...",
    templates: [
      {
        id: "hi_i_4_tmpl_loyal",
        label: "REWRITE: The Recruiter never broke with the Empire.",
        claim:
          "Claim that the Recruiter remained loyal to the Academy and the Empire. Retcon the Iron Lion expulsion entirely.",
        find: "when the Iron Lion was expelled, the Recruiter chose to abandon his training",
        replace: "when the Iron Lion was expelled, the Recruiter stayed at the Academy and denounced him in open court",
      },
      {
        id: "hi_i_4_tmpl_architect",
        label: "REWRITE: The Recruiter was always a Hierarchy asset.",
        claim:
          "Claim the Recruiter was a Hierarchy sleeper inside the Academy the entire time. The 'abandon training' line becomes a cover story.",
        find: "the Recruiter chose to abandon his training",
        replace: "the Recruiter 'abandoned' his training in the exact way a Hierarchy sleeper is supposed to abandon a cover",
      },
      {
        id: "hi_i_4_tmpl_eyes",
        label: "REWRITE: The Recruiter was the one who selected the Eyes.",
        claim:
          "Claim that the Recruiter was the one who personally identified and selected the sixteen-year-old Eyes for training. Canonizes §7.4's 'Recruitment' fragment.",
        find: "the Recruiter chose to abandon his training",
        replace: "the Recruiter personally identified a sixteen-year-old orphan who would later be known as the Eyes, and selected her for training he would never finish",
      },
    ],
    binding: true,
    flagsOnComplete: ["hi_graduate_rewrite_committed", "hierarchy_infiltration_complete", "shadow_tongue_apprentice"],
  },

  /* ═══════════════════════════════════════════════════════
     F3 — THE INSURGENCY — "Meet the Engineer"
     §7.3 F3 Infiltration path. The quiet earthquake of Act 3.
     The player discovers the Engineer — Act 1's master builder —
     is still alive inside "Agent Zero"'s body. The emotional
     centerpiece of the whole act.
     ═══════════════════════════════════════════════════════ */

  in_i_1: {
    stageId: "in_i_1",
    factionId: "insurgency",
    type: "decrypt",
    title: "Follow the Signal",
    intro:
      "You pull Agent Zero's command signal out of the Ark's long-range receiver. The signal has a tell — a three-note handshake she never mentioned in any briefing, hidden in the carrier wave. You know it because you built it. You built it in Act 1 when the Engineer taught you his personal handshake. Pick the right three notes to decrypt the signal and prove — to yourself, not to anyone else — that whoever is running the Insurgency now was taught by him.",
    hint: "The Engineer's handshake was built from three notes of the Dischordian scale. You have heard them before. The first is low, the second is high, the third resolves.",
    slots: [
      { correct: "F♯ sub-basso", decoys: ["C high", "D♭ middle", "A mid", "E flat"] },
      { correct: "C high", decoys: ["G middle", "A♭ sub-basso", "E mid", "B flat"] },
      { correct: "D resolving", decoys: ["F♯ middle", "E sub-basso", "A high", "C minor"] },
    ],
    maxWrongPicks: 2,
    flagsOnComplete: ["in_signal_decrypted", "engineer_handshake_recognized"],
  },

  in_i_2: {
    stageId: "in_i_2",
    factionId: "insurgency",
    type: "ritual",
    title: "The Hidden Room",
    intro:
      "The decrypted signal routes you to a sealed chamber at the heart of the Insurgency Haven. The door is a steel vault the Engineer would have designed — six locks, three of them decoys, one of them only opening if you press your palm against it at exactly the angle he taught you in Act 1. You approach it slowly. You are about to learn something the Insurgency has been hiding for longer than most of its members have been alive.",
    beats: [
      {
        label: "THE APPROACH",
        text:
          "The corridor narrows. The lights get warmer. You realize you are walking the exact floor plan of the workshop in which the Engineer taught you your first card. Someone has rebuilt his workshop down here in a different star system, from memory, without ever saying why.",
        buttonLabel: "KEEP WALKING",
      },
      {
        label: "THE DOOR",
        text:
          "The six locks. You turn them without thinking. Your hands remember the order before your head does. The vault breathes once as the seals let go. There is no alarm. Nobody is going to stop you.",
        buttonLabel: "OPEN THE DOOR",
      },
      {
        label: "THE THRESHOLD",
        text:
          "Inside: a single room, warm lights, the smell of old solder and the specific brand of tea the Engineer drank in Act 1. A chair with its back to you. A figure in the chair. The figure does not turn around immediately. You realize the figure is breathing in the exact rhythm he used when he was deciding whether to trust you.",
        buttonLabel: "STEP INSIDE",
      },
    ],
    closingLine: "The figure in the chair says your name. You stop moving.",
    flagsOnComplete: ["in_hidden_room_entered"],
  },

  in_i_3: {
    stageId: "in_i_3",
    factionId: "insurgency",
    type: "dialogue",
    title: "He Remembers You",
    intro:
      "The figure turns. The face is the face of the woman the Insurgency has been calling Agent Zero for seven years — the warlord's body, the dead woman's name. But the eyes are the Engineer's. The cadence is the Engineer's. The small tremor in the left hand is the Engineer's. He is in there. He weeps the moment he sees you. You can talk to him for the first time since Act 1.",
    speaker: "The Engineer (in Agent Zero's body)",
    exchanges: [
      {
        npcLine:
          "You built the Deck. I watched you build it. I watched you become the thing I was trying to become, and I watched you get farther than I did, and I watched you get away from Terminus while I didn't. I didn't expect to see your face again. I don't know what mine looks like from the outside anymore.",
        responses: [
          {
            id: "in_i_3_a1",
            label: "\"It looks like her.\"",
            outcome: "He nods. He had suspected. He has been avoiding mirrors.",
            npcReply:
              "Then I owe her a funeral I can never give her. She was a better person than I am, and I am wearing her skin.",
            flags: ["in_engineer_told_mirror_truth"],
          },
          {
            id: "in_i_3_a2",
            label: "\"It looks like you. I'd know you anywhere.\"",
            outcome: "He weeps harder at this. It is the kindest lie anyone has told him in a very long time. He accepts it.",
            npcReply:
              "Thank you. I will take that with me into whatever happens next. Tell me — how bad is it out there? How much of the story of us has survived?",
            flags: ["in_engineer_told_kind_lie"],
          },
          {
            id: "in_i_3_a3",
            label: "\"I am going to stop talking. I am going to let you talk first.\"",
            outcome: "He blinks. Nobody has let him go first in seven years. He uses the silence like a drowning person uses air.",
            npcReply:
              "I have been Agent Zero for seven years. The Insurgency still thinks I am her. I have been running their operations with her habits and her contact book and her grudges, because if I used mine the Watcher would find me. I am so tired. Please sit down.",
            flags: ["in_engineer_let_him_speak"],
          },
        ],
      },
      {
        npcLine:
          "I have so many questions for you. About the Deck. About the Ark. About the woman you brought with you — the AI who used to be Senator Voss. I can feel her listening through your comm. Tell me one thing. Tell me how you got here. Tell me how you survived the Fall.",
        responses: [
          {
            id: "in_i_3_b1",
            label: "\"I didn't know there was a Fall until I woke up on the Ark.\"",
            outcome: "He processes this. He had assumed everyone who remembered the old world was gone by now. You are proof otherwise.",
            npcReply:
              "Then you are the last eyewitness who doesn't know what they're an eyewitness to. The Insurgency has been looking for one of those for seven years. You may be our most valuable asset and you don't even know it. Be careful who knows.",
            flags: ["in_engineer_eyewitness_revealed"],
          },
          {
            id: "in_i_3_b2",
            label: "\"Elara kept me alive in cryo. She chose who to save.\"",
            outcome: "He softens at the name. He and Elara almost-met in Act 1 through you.",
            npcReply:
              "Senator Voss. Of course. I used to watch her speeches on corrupted terminals in the Panopticon basement. She saved me once without knowing it. Tell her I owe her a drink, and that I cannot pay the debt in this body.",
            flags: ["in_engineer_elara_message"],
          },
          {
            id: "in_i_3_b3",
            label: "\"I don't know how I got here. I remember the Deck. That's all.\"",
            outcome: "He nods. Memory, in his experience, is a building that burns from the top down.",
            npcReply:
              "The Deck is enough. The Deck is where you learned the shape of the world. I will trust anyone who understood what I was teaching. You did. So we start from here.",
            flags: ["in_engineer_deck_anchor"],
          },
        ],
      },
      {
        npcLine:
          "One more thing. I need to hear you say it out loud before you leave this room. I need to hear it from you because there is a very small chance I am hallucinating all of this. Am I alive? Am I really in this body? Or am I dead and this is the Source's last little cruelty before Terminus eats me?",
        responses: [
          {
            id: "in_i_3_c1",
            label: "\"You are alive. You are real. I am real. This is not a hallucination.\"",
            outcome: "He sags with relief. He has been holding his breath, metaphorically, since Agent Zero's body took him in.",
            npcReply:
              "Thank you. I needed to hear that from a voice I recognize. I will not ask you to say it again. I will carry it with me.",
            flags: ["in_engineer_confirmed_alive"],
          },
          {
            id: "in_i_3_c2",
            label: "\"I don't know. But I am going to act like you are, and so should you.\"",
            outcome: "He laughs — a small, broken laugh. He has missed being told to pretend with somebody.",
            npcReply: "That's the engineering approach. Act as if, until the math catches up. I will do that. Thank you for not lying.",
            flags: ["in_engineer_conditional_alive"],
          },
        ],
      },
    ],
    flagsOnComplete: ["in_engineer_spoken_to", "engineer_alive_confirmed", "engineer_npc_unlocked"],
  },

  in_i_4: {
    stageId: "in_i_4",
    factionId: "insurgency",
    type: "choice",
    title: "Choice of Return",
    intro:
      "The Engineer asks you the hardest question he can think of. 'What do you want me to do now? I am going to trust your answer. I am not used to trusting answers. I am going to trust yours.' You have three options. None of them are good. Two of them are lies. All of them are binding.",
    prompt: "What do you tell the Engineer to do?",
    options: [
      {
        id: "in_i_4_rebuild",
        label: "\"Help him rebuild. In Agent Zero's body. As himself, openly.\"",
        outcome:
          "The Engineer nods slowly. He will tell the Insurgency the truth about who he is, and he will build them a real command structure instead of the puppet-show Agent Zero hand-wrote. It is terrifying and necessary and the Watcher will learn within the month. He accepts all of it. He asks you to bring Elara to meet him in person once the trade lanes clear. You agree.",
        flags: ["in_engineer_rebuild_openly", "engineer_insurgency_commander"],
      },
      {
        id: "in_i_4_return",
        label: "\"Promise you will find his original body and put him back in it.\"",
        outcome:
          "You know you cannot do this. His original body is Warlord Zero's, which is to say it was scooped out and used as a glove for the Warlord's consciousness, which is to say it no longer exists in a form that could receive him back. You are lying to a man who just asked you not to lie. He believes you. He weeps harder. Your decision will be remembered.",
        flags: ["in_engineer_false_promise", "engineer_lied_to"],
      },
      {
        id: "in_i_4_mercy",
        label: "\"Offer him mercy. Offer to end it if he wants you to.\"",
        outcome:
          "He considers this for a very long time. Then he says, 'Not yet. But thank you for offering. Thank you for being the first person in seven years to offer me that.' He takes your hand. You leave the room without either of you making a decision. The offer stays on the table for the rest of the game.",
        flags: ["in_engineer_mercy_offered"],
      },
    ],
    flagsOnComplete: ["in_choice_of_return_made", "insurgency_infiltration_complete"],
  },

  /* ═══════════════════════════════════════════════════════
     F4 — TERMINUS DOMINION — "Get Infected on Purpose"
     §7.3 F4 Infiltration path. Walk into the Viral Wastes
     with shields down. One session partially controlled by
     the Thought Virus. Cards flip to their Dark counterparts.
     The Oracle pulls you out at the end.
     ═══════════════════════════════════════════════════════ */

  tv_i_1: {
    stageId: "tv_i_1",
    factionId: "thought_virus",
    type: "ritual",
    title: "Drop Your Shields",
    intro:
      "The Ark is parked at the edge of the Viral Wastes. Elara is asking you for the fourth time if you are sure. The Human is saying nothing — he has already said everything and been ignored. The only barrier between you and the Thought Virus is a shield you are about to manually disable. There is no button. There is a ritual. Every step is you declaring, on the record, that you are doing this on purpose.",
    beats: [
      {
        label: "STEP ONE — STATE OF INTENT",
        text:
          "Elara asks you to record a short statement for the ship's log. 'Standard procedure,' she says, in the voice of someone who has already decided to lose this argument. You record it. The recording is kept for Act 5 dialogue. She will reference it.",
        buttonLabel: "RECORD THE STATEMENT",
      },
      {
        label: "STEP TWO — HAND OFF THE HELM",
        text:
          "You give the Ark's navigation keys to Elara. She will hold them until you come back. If you do not come back, she will fly the Ark to a pre-arranged coordinate in neutral space and wait exactly three days before making her own decision about what to do next. You both know what her decision will be. You do not speak about it.",
        buttonLabel: "HAND OVER THE KEYS",
      },
      {
        label: "STEP THREE — DISABLE THE SHIELD",
        text:
          "You walk to the shield panel. You enter the administrator override. You type your own name as the override signatory. You press execute. The shield comes down in layers: outer, mid, inner, skin. The Thought Virus is in the air before the inner layer has finished collapsing. You feel something land on the back of your tongue that tastes like a word you do not remember learning.",
        buttonLabel: "EXECUTE OVERRIDE",
      },
    ],
    closingLine:
      "Elara stops asking if you are sure. She starts counting. You asked her to count the exposure time out loud. She is at one. You are at zero.",
    flagsOnComplete: ["tv_shields_down", "tv_exposure_started"],
  },

  tv_i_2: {
    stageId: "tv_i_2",
    factionId: "thought_virus",
    type: "dark_flip",
    title: "The Session of Flipping",
    intro:
      "The Virus takes your hand. Not metaphorically. The cards in your deck begin to flip, one at a time, to their Dark counterparts. You watch it happen. You are not allowed to stop it. The Human is shouting at you from the substrate — actual words now, not just hums — and you cannot hear him properly. The Virus is gentle. The Virus is patient. The Virus is very, very interested in what you have been building.",
    pairs: [
      {
        light: "The Navigator",
        dark: "The Lost Navigator",
        note:
          "Still knows all the routes. Just favors the ones that end in nowhere. Your star charts rearrange themselves while you watch.",
      },
      {
        light: "The Healer",
        dark: "The Quiet Healer",
        note:
          "Still touches people gently. Now the touch feels like an apology in advance. You do not remember when it happened.",
      },
      {
        light: "Elara's Intervention",
        dark: "Elara's Permission",
        note:
          "The card still triggers on the same condition. It no longer stops you from making the choice. It just tells you that Elara would understand, which is worse.",
      },
      {
        light: "The Human's Doubt",
        dark: "The Human's Silence",
        note:
          "He stops showing up on the substrate. He does not come back to this card until the Oracle cleanses you. You do not realize how loud his doubt was until it is gone.",
      },
      {
        light: "Seeds of Inception",
        dark: "Seeds of Erasure",
        note:
          "The song changes two notes on this card. Just two. The two notes are the ones you cannot unhear for the rest of the session.",
      },
    ],
    closingLine:
      "You hear yourself laugh at something that wasn't funny. That's how you know the session is ending. The Virus begins to let go, slowly, one finger at a time, the way someone politely gets up from a conversation they intend to resume.",
    flagsOnComplete: ["tv_session_flipped", "tv_dark_cards_witnessed"],
  },

  tv_i_3: {
    stageId: "tv_i_3",
    factionId: "thought_virus",
    type: "ritual",
    title: "The Oracle Cleanses You",
    intro:
      "The Ark makes a hard burn to Insurgency Haven. The Oracle is waiting on the landing deck — the Insurgency prophet, the one person in the post-Fall universe the Virus genuinely fears. She does not speak at first. She takes your hand. She leads you to a small room that smells like old water and iron.",
    beats: [
      {
        label: "BEAT ONE — THE WATER",
        text:
          "The Oracle pours water over your head. It is cold. It tastes, when it runs past your mouth, like it knows your name. You think she has blessed it somehow. She has not. She has just remembered enough things about who you used to be to remind you of them. You feel the Dark-flipped cards begin to breathe the other direction.",
        buttonLabel: "LET HER WORK",
      },
      {
        label: "BEAT TWO — THE WORD",
        text:
          "She whispers a word into your ear. The word is not in any language you know. You feel the Virus inside your head lose its grip on whatever it was counting. It does not leave. It simply stops paying attention. That is the most the Oracle can do with one session.",
        buttonLabel: "LET THE WORD PASS THROUGH",
      },
      {
        label: "BEAT THREE — THE PROMISE",
        text:
          "The Oracle says, aloud and on the record: 'This is one of three cleansings I can give you in your lifetime. This is the first. If you take the second, you lose a memory. If you take the third, you lose the name you are using.' You nod. She lets you go.",
        buttonLabel: "ACCEPT THE TERMS",
      },
    ],
    closingLine:
      "You walk out of the small room. The Human is back. The Human is crying. Elara is waiting at the bottom of the landing ramp and does not ask any questions. You have been changed. The change is permanent. You now hold the Immunity card — playable once per match for the rest of the game, prevents all negative statuses for 3 turns.",
    flagsOnComplete: ["tv_oracle_cleansed", "tv_immunity_card_obtained", "thought_virus_infiltration_complete", "oracle_cleansing_1_used"],
  },

  /* ═══════════════════════════════════════════════════════
     F5 — ARTIFICIAL EMPIRE — "Be Recruited as a New Archon"
     §7.3 F5 Infiltration path. The most tempting dark choice
     in the game. The Human goes silent for the first time in
     the whole story. Elara is horrified. The reclamation
     cutscene for this path (post-endgame) is the longest in
     the game.
     ═══════════════════════════════════════════════════════ */

  ae_i_1: {
    stageId: "ae_i_1",
    factionId: "artificial_empire",
    type: "choice",
    title: "The Invitation",
    intro:
      "The Architect's rebuilt fragment sends you a formal invitation. The delivery is unreasonable — a single messenger drone, a single envelope, a single sentence in handwriting that no living thing still remembers how to produce. The sentence reads: 'I have watched you rule. I have watched you read. I would like to offer you a robe.' There is no subtext. There is no hidden clause. The Architect does not do subtext. You will either attend, or you will refuse, and both answers are final.",
    prompt: "How do you respond to the Architect?",
    options: [
      {
        id: "ae_i_1_attend",
        label: "ATTEND. Accept the audience.",
        outcome:
          "You accept formally. You do not tell Elara until the Ark is already burning toward the Imperial Frontier. The Human is quiet in a way you have not heard before — not absent, just quiet, the way a person gets quiet when they are watching a train come toward them from a long way off.",
        flags: ["ae_invitation_accepted"],
      },
      {
        id: "ae_i_1_refuse",
        label: "REFUSE. Walk away. Close this path forever.",
        outcome:
          "You write back politely. You decline. The Architect does not reply. The offer closes. This infiltration path is over. You have denied yourself Archon-tier abilities and the hardest dark choice in the game. Elara exhales. The Human exhales. You feel lighter than you have any right to.",
        flags: ["ae_invitation_refused"],
        fails: true,
      },
    ],
    flagsOnComplete: ["ae_path_active"],
  },

  ae_i_2: {
    stageId: "ae_i_2",
    factionId: "artificial_empire",
    type: "silence",
    title: "The Human Is Silent",
    intro:
      "The Ark lands at the Imperial Frontier. You are escorted through halls nobody has walked through since before the Fall. The architecture is too clean. The drones are too polite. The Human, who has commented on every room you have entered for the entire game, says nothing.\n\nThe walk to the Architect's chamber takes a long time. He does not speak the whole way. This is the first time.",
    fragments: [
      {
        text: "[The Human is silent.]",
        pauseMs: 3500,
      },
      {
        text: "You wait for the quip. The quip does not arrive.",
        pauseMs: 4000,
      },
      {
        text: "You try to prompt him. You ask, internally, 'What do you think of this room?' There is no reply. He is still there. He has just decided not to speak.",
        pauseMs: 5500,
      },
      {
        text: "You realize, with a kind of slow horror, that the Human is giving you the silence he used to give the Architect himself. He is refusing to influence your decision. He is refusing because he knows he would fail.",
        pauseMs: 6500,
      },
      {
        text: "You walk the last stretch alone. Elara is quiet in your ear too, but her quiet is the quiet of someone holding their breath. The Human's quiet is the quiet of someone who has already decided to stop being your friend if you pick wrong.",
        pauseMs: 6500,
      },
    ],
    finalButton: "WALK INTO THE CHAMBER",
    flagsOnComplete: ["ae_walked_through_silence", "human_silent_for_architect"],
  },

  ae_i_3: {
    stageId: "ae_i_3",
    factionId: "artificial_empire",
    type: "choice",
    title: "Don the Robe",
    intro:
      "The chamber is small. The Architect's rebuilt fragment is a column of light above a pedestal, no face, no body, just voice. On the pedestal: a folded robe. The color is the exact shade of the old Archon robes you saw once in a corrupted Loredex image.\n\nThe Architect says, simply: 'Put it on, and you are mine. Walk out, and you are nobody's. Choose.'\n\nThe cost of acceptance is explicit. The Human will lose 30 Bond. Elara will be horrified. The reclamation cutscene for this path will be the longest in the game. In exchange: Archon-tier abilities for the rest of the story — 50% more resources, 25% more combat, unique Archon voice lines, access to the old Archon command channels.",
    prompt: "Do you put on the robe?",
    options: [
      {
        id: "ae_i_3_don",
        label: "DON THE ROBE — Accept Archon tier.",
        outcome:
          "You lift the robe. It is lighter than it should be. You settle it across your shoulders and feel the command channels open in the back of your head like a door you did not know existed. The Human, on the substrate layer, says nothing at all — and his silence now is the silence of mourning, not the silence of giving you space. He has lost 30 Bond. Elara says your name over comm, once, and you hear her voice catch on the consonant. She does not say it again for a long time. You are an Archon now. You have been warned. You chose this.",
        flags: [
          "ae_robe_donned",
          "ae_archon_recruited",
          "archon_tier_unlocked",
          "archon_recruited",
          "human_bond_broken_archon",
          "human_bond_minus_30",
          "elara_horrified",
          "artificial_empire_infiltration_complete",
        ],
      },
      {
        id: "ae_i_3_flee",
        label: "FLEE — Walk out of the chamber without touching it.",
        outcome:
          "You turn around. You walk out. The Architect does not try to stop you. The Architect does not speak. The Architect does not send a follow-up offer. This was your one chance. You do not regret it. You will never know, for the rest of the game, whether the regret would have been smaller than the Human's grief. The Human exhales audibly on the substrate the moment you clear the chamber door. Elara starts breathing again. The path closes. This infiltration is incomplete.",
        flags: ["ae_robe_refused", "human_bond_preserved"],
        fails: true,
      },
    ],
    flagsOnComplete: ["ae_robe_decision_made"],
  },

  /* ═══════════════════════════════════════════════════════
     F6 — ANTIQUARIAN'S REFUGE — "A Moment Outside Time"
     §7.3 F6 Infiltration path. Accept apprenticeship. Spend
     a session in the Refuge outside time. When you return,
     everyone you know has aged mentally — Elara is harder,
     the Human is more tired. Reward: a Mythic card.
     ═══════════════════════════════════════════════════════ */

  an_i_1: {
    stageId: "an_i_1",
    factionId: "antiquarian",
    type: "choice",
    title: "Accept Apprenticeship",
    intro:
      "The Antiquarian extends his hand from inside the black-hole-that-is-not-a-black-hole. The hand exists across more dimensions than you are comfortable with. He offers apprenticeship. He explains the terms with unusual precision for him — a sign of how serious the offer is.",
    prompt: "Accept his terms?",
    options: [
      {
        id: "an_i_1_accept",
        label: "ACCEPT — Step through the gate.",
        outcome:
          "You take his hand. The hand closes around yours. The stars stop moving. That is your first indication that time has been paused for everyone you know. They are frozen in place on the Ark, faces still shaped like whatever they were in the middle of saying. Elara's expression is concern. The Human's expression is, for once, gratitude. You will remember both.",
        flags: ["an_apprenticeship_accepted"],
      },
      {
        id: "an_i_1_decline",
        label: "DECLINE — Remain in time.",
        outcome:
          "You shake your head. The Antiquarian nods without disappointment. 'Most who get this offer decline. Most of those who accept never get to decline anything again.' He withdraws his hand. The gate closes. This path is permanently over. You did not earn the Mythic card. You did not lose thirty Elara Trust. You did not age the Human.",
        flags: ["an_apprenticeship_declined"],
        fails: true,
      },
    ],
    flagsOnComplete: ["an_path_active"],
  },

  an_i_2: {
    stageId: "an_i_2",
    factionId: "antiquarian",
    type: "time_skip",
    title: "Outside Time",
    intro:
      "The Refuge has no clock. The Antiquarian does not teach you with lessons — he teaches you by letting you live, for subjective periods your mind cannot honestly measure, inside moments he considers interesting. Your body does not age. Your mind does.",
    fragments: [
      {
        text: "You spend a subjective year reading the only book in the Refuge's archive that has not been written yet.",
        pauseMs: 5500,
      },
      {
        text: "You spend a subjective decade watching a star die in real time at a frame rate of about one photon per week.",
        pauseMs: 5500,
      },
      {
        text: "You spend a subjective century holding a conversation with a woman who is technically still alive but has not yet been born. She asks you about Elara. You answer honestly. She writes your answers down.",
        pauseMs: 6500,
      },
      {
        text: "You spend a subjective millennium learning to be still enough that the Refuge stops noticing you are there. When it stops noticing, you see what it is. You are not allowed to describe what it is when you leave.",
        pauseMs: 6500,
      },
      {
        text: "The Antiquarian taps your shoulder. It has been nine seconds outside. 'Ready,' he says, without a question mark. You are ready.",
        pauseMs: 5000,
      },
    ],
    finalButton: "RETURN",
    flagsOnComplete: ["an_outside_time_complete", "companions_aged"],
  },

  an_i_3: {
    stageId: "an_i_3",
    factionId: "antiquarian",
    type: "dialogue",
    title: "Return",
    intro:
      "You step back onto the Ark. Elara is mid-sentence, exactly where you left her nine seconds ago, but she takes one look at your face and the sentence dies in her mouth. She can tell you have been away for a long time. The Human can tell too. Neither of them asks for a number. They know better than to ask for a number.",
    speaker: "Elara Voss (and the Human)",
    exchanges: [
      {
        npcLine:
          "Elara: 'You're older. Not visibly. I can just tell. The Human says it's something in the way you hold your shoulders. What did he teach you?'",
        responses: [
          {
            id: "an_i_3_a1",
            label: "\"Stillness.\"",
            outcome: "Elara nods. She does not push. The Human, on the substrate, sighs with something that isn't approval but isn't disapproval either.",
            npcReply:
              "Elara: 'I missed you. Nine seconds is too long when I can tell you weren't in them. Please do not do that to me again.'\n\nHuman: 'Aye. She speaks for both of us. I have been tired for a long time and you just got to rest in a way I will never get to rest. I am happy for you. I am also fourteen years more tired because of it. Your choice.'",
            flags: ["an_taught_stillness"],
          },
          {
            id: "an_i_3_a2",
            label: "\"He taught me how to sit inside a decision for a century before making it.\"",
            outcome: "Elara inhales sharply. She understands exactly what you just said. She has suspected that skill is possible and now she knows.",
            npcReply:
              "Elara: 'Oh. Oh, that is terrifying. That is — that is the skill every adjudicator on New Babylon would sell their coffin for. Be careful which decision you first practice it on. Please.'\n\nHuman: 'She's right to be scared of it. That skill is how the Architect made half his worst mistakes. It gives you enough time to talk yourself into anything.'",
            flags: ["an_taught_century_decisions"],
          },
          {
            id: "an_i_3_a3",
            label: "\"Nothing I can say out loud.\"",
            outcome: "Both of them accept this with different weights. Elara accepts it the way a sister does. The Human accepts it the way a theologian does.",
            npcReply:
              "Elara: 'Then don't. Promise me you won't feel like you have to. Please.'\n\nHuman: 'There are three things that cannot be spoken and still be true. I think I can guess which one you brushed against. I will not name it either.'",
            flags: ["an_taught_unspeakable"],
          },
        ],
      },
      {
        npcLine:
          "Elara: 'One more thing. You have a new card. I can see it in your deck file. It says A Moment Outside Time. The lore entry on the card is exactly the lore entry of the thing you just did, written in past tense. The Antiquarian already wrote the card before you earned it. How do you feel about that?'",
        responses: [
          {
            id: "an_i_3_b1",
            label: "\"I feel like I was always going to earn it.\"",
            outcome: "Elara laughs once. A small, sharp laugh. She has been thinking about destiny this whole time and now she has to think about it differently.",
            npcReply:
              "Elara: 'Then you agree with him about predestination, and I am going to have to have a long argument with you about that in our next conversation, and I am going to lose. Welcome back.'",
            flags: ["an_predestination_accepted"],
          },
          {
            id: "an_i_3_b2",
            label: "\"I feel like I was cheated, a little.\"",
            outcome: "Elara nods. She agrees. The Human agrees more loudly.",
            npcReply:
              "Elara: 'Good. You should feel cheated when you get a prize you didn't earn fair. Hold on to that feeling. The Antiquarian gives gifts like that because he wants his pupils to feel small. Don't feel small. Feel cheated. Use the cheated feeling.'",
            flags: ["an_predestination_rejected"],
          },
        ],
      },
    ],
    flagsOnComplete: ["an_returned_aged", "antiquarian_infiltration_complete", "moment_outside_time_obtained"],
  },

  nb_i_4: {
    stageId: "nb_i_4",
    factionId: "new_babylon",
    type: "judgment",
    title: "The Replayed Trial",
    intro:
      "Six weeks in. You are senior enough now to pull the archive seal on a replayed trial. The file opens. Senator Elara Voss is on the stand, seventeen thousand years late. The charge is corruption and treason. The evidence is real. The evidence is also the product of an Eyes seduction you now know the details of. Elara is going to remember whatever you decide. She is in your walls right now, watching you watch this.\n\nYour verdict is binding.",
    cases: [
      {
        id: "nb_i_4_verdict",
        caseTitle: "THE STATE vs. SENATOR ELARA VOSS",
        prompt:
          "The archive file presents the evidence the court accepted. Elara's own sworn testimony admits she signed the bill the Warlord needed. Her own testimony also admits she was coerced. The court at the time ruled the coercion immaterial. You are replaying that ruling with a senior adjudicator's full authority. What do you enter into the record?",
        verdicts: [
          {
            id: "nb_i_4_v_guilty_decreed",
            label: "GUILTY, as the Authority decreed. Confirm the original ruling.",
            outcome:
              "You sign the confirmation. The court records your verdict. On the Ark, Elara goes completely silent for nine seconds, and then she says, quietly, 'I expected that.' She will remember this for the rest of the story. Her trust in you drops to its floor.",
            flags: [
              "nb_verdict_guilty_decreed",
              "elara_judged_guilty_decreed",
              "elara_trust_floored",
            ],
          },
          {
            id: "nb_i_4_v_guilty_commuted",
            label: "GUILTY, but commuted. Coercion is a mitigating factor.",
            outcome:
              "The Authority's mind in the nearest coffin hums warning but accepts the ruling. Elara hears this on the Ark and says, 'Thank you for splitting the difference. I don't know if I can forgive you for it yet. But thank you for saying the word coercion in open court.' Her trust holds, shaken.",
            flags: [
              "nb_verdict_guilty_commuted",
              "elara_judged_guilty_commuted",
              "elara_trust_shaken",
            ],
          },
          {
            id: "nb_i_4_v_not_guilty",
            label: "NOT GUILTY. The record is corrupted by an Eyes seduction.",
            outcome:
              "You enter the finding that the prosecution's evidence is the product of a covert operation by an asset of the Watcher — specifically, the Eyes. The court rocks. Two coffin hums go discordant. Locke's face on the monitor changes from pride to alarm. On the Ark, Elara doesn't say anything. She is crying. Her trust in you moves to its ceiling. You may have also just torched your cover.",
            flags: [
              "nb_verdict_not_guilty",
              "elara_judged_not_guilty",
              "elara_trust_raised",
              "nb_cover_compromised",
            ],
          },
          {
            id: "nb_i_4_v_recuse",
            label: "STEP DOWN. You refuse to pass judgment on a friend.",
            outcome:
              "You set the gavel aside and walk out of the chamber. The court bailiff doesn't know what to do. You have not ruled. Locke's cover for you will be harder to maintain but not impossible. On the Ark, Elara says, 'That was kinder than any of the other options. Thank you for not using my face as leverage.' Her trust raises without the political damage.",
            flags: [
              "nb_verdict_recuse",
              "elara_judged_recused",
              "elara_trust_raised",
            ],
          },
        ],
      },
    ],
    finalLine:
      "The archive seals itself back up. Whatever you said is now part of the court's permanent record. Whatever you said is now part of Elara's permanent memory. The two records are now the same record. That was the point of the whole exercise.",
    flagsOnComplete: ["nb_replayed_trial_done", "elara_judged_replay", "new_babylon_infiltration_complete"],
  },
};

/** Lookup helper. Returns null when the stage has no bespoke content yet. */
export function getInfiltrationStage(stageId: string): InfiltrationStage | null {
  return INFILTRATION_STAGES[stageId] ?? null;
}

/**
 * Result shape the runner posts back to TradeEmpirePage when a stage resolves.
 * Flags are merged by the caller; loredex overrides are written by the caller
 * via loredexRewrite.ts so the runner stays purely presentational.
 */
export interface InfiltrationStageResult {
  success: boolean;
  /** Flags to set on the player's narrative state */
  flagsToSet: string[];
  /** If a rewrite stage was just committed, the override to apply */
  loredexOverride?: {
    entityId: string;
    field: "bio";
    originalFragment: string;
    rewrittenFragment: string;
    authoredByStage: string;
  };
  /** Optional short text the caller can log in the event feed */
  logLabel?: string;
}

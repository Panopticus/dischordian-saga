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

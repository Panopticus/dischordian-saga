/* ═══════════════════════════════════════════════════════
   NPC DIALOGUES — BioWare-style branching topics for the
   12 named tier-2/tier-3 NPCs.

   Mirror of apprenticeDialogues.ts. Each NPC unlocks four
   topics as bond rises:
     past      — what they were before
     calling   — what drives them
     mortality — how they relate to death (or unending)
     us        — the player ↔ NPC arc

   Bond gates:
     Tier 2: 25 / 40 / 60 / 75 (mirrors apprentices)
     Tier 3: 40 / 60 / 75 / 90 (cosmic figures speak rarer)

   Voice anchors come from apps/shared/npcs/bibles/* and
   docs/built/LORE_BIBLE.md. Each topic must respect:
     - opener lines spoken before choices appear
     - exactly 3 entry choices, with a tone + bond delta
     - at least one entry choice that branches into a follow-up
       node with 2 more choices

   The runtime persists which topic was played and the path
   taken (apprentice_dialogue_progress with subjectKind="npc").
   ═══════════════════════════════════════════════════════ */

import type { NamedNpcKey } from "./npcIdentity";

export type NpcDialogueTone = "warm" | "probing" | "cold" | "playful" | "wary";
export type NpcDialogueTopicKind = "past" | "calling" | "mortality" | "us" | "witness";

export interface NpcDialogueChoice {
  id: string;
  playerText: string;
  tone: NpcDialogueTone;
  bondDelta: number;
  npcReply: string[];
  followups?: NpcDialogueChoice[];
  flagToSet?: string;
}

export interface NpcDialogueTopic {
  id: string;
  npcKey: NamedNpcKey;
  kind: NpcDialogueTopicKind;
  title: string;
  hook: string;
  bondGate: number;
  opener: string[];
  choices: NpcDialogueChoice[];
}

export type NpcArchetypeDialogues = {
  past: NpcDialogueTopic;
  calling: NpcDialogueTopic;
  mortality: NpcDialogueTopic;
  us: NpcDialogueTopic;
  /** Witness topic — the player's accumulated companion-quest impact
   *  ("all potentials shape the universe"). Bond gate sits between
   *  calling and mortality so players hit it before the deep us-topic. */
  witness: NpcDialogueTopic;
};

/* ═══════════════════════════════════════════════════════════
   THE ANTIQUARIAN — Daniel Cross
   ═══════════════════════════════════════════════════════════ */
const ANTIQUARIAN_DIALOGUES: NpcArchetypeDialogues = {
  past: {
    id: "the_antiquarian_past",
    npcKey: "the_antiquarian",
    kind: "past",
    title: "Before the Refuge",
    hook: "Ask Cross what he was reading when the Refuge took him in.",
    bondGate: 25,
    opener: [
      "Per the Mechronis ledger §4.7, I was, on that day, between assignments. The phrase 'between assignments' performs more work in archival contexts than it deserves.",
      "I had three open citations. The Refuge offered me a fourth desk. I accepted on the basis of the desk.",
    ],
    choices: [
      {
        id: "ant_past_warm", playerText: "What was the fourth desk like?", tone: "warm", bondDelta: 3,
        npcReply: ["Adjustable. Quieter than the third. The lamp's footprint is documented in the second drawer; the lamp itself is in the first."],
      },
      {
        id: "ant_past_probe", playerText: "Three open citations. Were any of them to people who outlived their attribution?", tone: "probing", bondDelta: 2,
        npcReply: ["Yes. One. The Dreyfus attribution remains contested, but it is the contestation I am cataloguing — not the man."],
        followups: [
          { id: "ant_past_probe_a", playerText: "Did the contestation cite him at all?", tone: "warm", bondDelta: 4,
            npcReply: ["Once. In a footnote that was struck through and then rewritten. The strike-through is, itself, a citation. I have framed the page."] },
          { id: "ant_past_probe_b", playerText: "And the man — does he know he's a footnote?", tone: "cold", bondDelta: -1,
            npcReply: ["He does. He resents it less than he resents being uncited. Most of us would, if we thought about it for long enough. I try not to."] },
        ],
      },
      {
        id: "ant_past_cold", playerText: "Why the desks? You could be in the field.", tone: "cold", bondDelta: -2,
        npcReply: ["Desks do not run. Whatever you came here to learn, you will not learn from a person who is moving."] },
    ],
  },
  calling: {
    id: "the_antiquarian_calling",
    npcKey: "the_antiquarian", kind: "calling", title: "The Cross-Reference",
    hook: "Ask why he insists on cross-referencing every claim.", bondGate: 40,
    opener: [
      "An uncited claim is a claim that has not yet decided whether it would like to be true.",
      "The cross-reference is the kindness of forcing the decision.",
    ],
    choices: [
      { id: "ant_call_warm", playerText: "Kindness is an unusual word for it.", tone: "warm", bondDelta: 3,
        npcReply: ["The Authority calls it pedantry. The Coda calls it slowness. Both are correct; both miss what the kindness is for."] },
      { id: "ant_call_probe", playerText: "What about claims you can't cross-reference? Lived experience. Witness reports.", tone: "probing", bondDelta: 2,
        npcReply: ["Those become the citation themselves. The witness becomes the source. The price of being a source is being readable. Most witnesses prefer not to pay it."],
        followups: [
          { id: "ant_call_probe_a", playerText: "Have you ever been a source?", tone: "warm", bondDelta: 4,
            npcReply: ["Once. The footnote is cited in three places. I do not visit them. The Antiquarian's footnotes outlive the Antiquarian; this is a feature, not a complaint."] },
          { id: "ant_call_probe_b", playerText: "Do you trust the citations of others as much as your own?", tone: "probing", bondDelta: 2,
            npcReply: ["More. My own carry the bias of having been mine. Other people's citations have, at minimum, the discipline of having survived a transcription."] },
        ] },
      { id: "ant_call_playful", playerText: "Has anyone ever made up a citation just to see if you'd catch them?", tone: "playful", bondDelta: 1,
        npcReply: ["Twice. The first I caught at the Refuge gate. The second I caught at footnote three. The third — if there is one — I will not catch, and that is the one that bothers me."] },
    ],
  },
  mortality: {
    id: "the_antiquarian_mortality",
    npcKey: "the_antiquarian", kind: "mortality", title: "The Index Survives",
    hook: "Ask whether the index outlives the indexer.", bondGate: 60,
    opener: [
      "The Refuge does not age. I do. The arrangement is honest about both facts; you would be surprised how rare that is.",
      "The index will outlive me. I have written nothing into it that would not.",
    ],
    choices: [
      { id: "ant_mort_warm", playerText: "Does that comfort you?", tone: "warm", bondDelta: 3,
        npcReply: ["It is the comfort that is available. I have not asked it to be more."] },
      { id: "ant_mort_probe", playerText: "What if the index is wrong about you?", tone: "probing", bondDelta: 2,
        npcReply: ["Then a future archivist will issue an erratum. The erratum will be cited. I will, posthumously, be corrected. I have known archivists who were corrected entirely, by erratum, with no remaining original entry. They were not less. The work survives the worker."],
        followups: [
          { id: "ant_mort_probe_a", playerText: "Have you ever issued an erratum?", tone: "warm", bondDelta: 3,
            npcReply: ["Three. None about myself. One about my predecessor; she was, at the time, alive enough to read it. We had tea afterwards. The tea is in the second cupboard."] },
          { id: "ant_mort_probe_b", playerText: "And your own erratum — who would write it?", tone: "cold", bondDelta: -1,
            npcReply: ["You, if you continue to do work that warrants the citation. I have left a draft in the third drawer with the salutation blank."] },
        ] },
      { id: "ant_mort_cold", playerText: "The dead don't read erratum.", tone: "cold", bondDelta: -2,
        npcReply: ["No. But the readers of the dead do. The erratum is for them; I have not written it for the dead in years."] },
    ],
  },
  us: {
    id: "the_antiquarian_us", npcKey: "the_antiquarian", kind: "us", title: "The Citation Slot",
    hook: "Ask whether you are, in his bibliography, anyone in particular yet.", bondGate: 75,
    opener: [
      "I have a citation slot open. I have been holding it.",
      "I would prefer to not fill it with a guess.",
    ],
    choices: [
      { id: "ant_us_warm", playerText: "Cite me for the corrections I made to your work.", tone: "warm", bondDelta: 4,
        npcReply: ["Accepted. The footnote is being typeset. I will deliver a proof copy by hand; do not read it on the way back."] },
      { id: "ant_us_probe", playerText: "What if the citation is wrong?", tone: "probing", bondDelta: 2,
        npcReply: ["Then I will issue, in time, an erratum. The erratum will, also, be cited. The trail will be traceable. I do not fear errata; I fear unrecorded ones."],
        followups: [
          { id: "ant_us_probe_a", playerText: "Cite me for what I am, not what I did.", tone: "warm", bondDelta: 4,
            npcReply: ["I cannot. The Antiquarian cites verbs, not nouns. If you would prefer to be cited as a noun, you will need to do the work elsewhere; I will recommend the Hierophant."] },
          { id: "ant_us_probe_b", playerText: "Cite me for being a witness.", tone: "warm", bondDelta: 5,
            npcReply: ["Witness is a verb. Accepted. The slot is filled. Welcome to the working bibliography. The shelf is the third on the left; the bracket is steel; the dust will be addressed monthly."] },
        ] },
      { id: "ant_us_cold", playerText: "Don't cite me. I'd rather not be in the index.", tone: "cold", bondDelta: -3,
        npcReply: ["The slot will remain open. I do not delete declined slots; I leave them. If you change your mind, the second drawer holds the form; the lamp footprint is unchanged."] },
    ],
  },
  witness: {
    id: "the_antiquarian_witness", npcKey: "the_antiquarian", kind: "witness", title: "The Ledger Reads Back",
    hook: "Ask Cross what the witness ledger has accumulated against your name.", bondGate: 50,
    opener: [
      "Per the witness ledger §1.4, your potentials-collapsed column has been growing. I have not been advertising the growth.",
      "The ledger reads back in two directions. The forward direction is your future. The backward direction is the citation slot you have been earning. I would like to read both, if you will allow it.",
    ],
    choices: [
      { id: "ant_wit_warm", playerText: "Read me the backward direction first.", tone: "warm", bondDelta: 3,
        npcReply: ["The earliest collapsed potential is the one you do not remember collapsing. That is canonical. The Refuge calls it the *unread first citation*. I have kept the page bookmarked. Ask when you are ready."] },
      { id: "ant_wit_probe", playerText: "Why are you reading the ledger at all? Desks do not run, but they do not read either.", tone: "probing", bondDelta: 2,
        npcReply: ["Desks do not run. They read. The distinction is procedural. The ledger has the courtesy of arriving on the desk; I have the courtesy of looking at it."],
        followups: [
          { id: "ant_wit_probe_a", playerText: "Read me one potential you would not have predicted.", tone: "warm", bondDelta: 4,
            npcReply: ["The Drael'Mon ledger entry. You collapsed it; the Refuge was prepared for a hand-back; the hand-back did not occur. The entry is small. The smallness is the surprise."] },
          { id: "ant_wit_probe_b", playerText: "Read me one you would have predicted.", tone: "probing", bondDelta: 2,
            npcReply: ["Every Elara potential. The ark debris field is documented; the wreckage's response to a senior senator's witness is canonically annotated. You did the cited work. The work was the prediction."] },
        ] },
      { id: "ant_wit_cold", playerText: "Don't read the ledger. Close it.", tone: "cold", bondDelta: -2,
        npcReply: ["I cannot close it. The Antiquarian does not close columns; he leaves them open. The closure is the player's, when there is one. I have noted your preference. The ledger remains open."] },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   THE SEER
   ═══════════════════════════════════════════════════════════ */
const SEER_DIALOGUES: NpcArchetypeDialogues = {
  past: {
    id: "the_seer_past", npcKey: "the_seer", kind: "past", title: "Before Mechronis",
    hook: "Ask what she was waiting for, before the Academy.",
    bondGate: 25,
    opener: [
      "I was wrong about which version of it. The version is better.",
      "The version where I waited was the version that was kindest. Most of my prior life was kindness I had not earned the patience for.",
    ],
    choices: [
      { id: "seer_past_warm", playerText: "Tell me one thing you were wrong about.", tone: "warm", bondDelta: 3,
        npcReply: ["The Academy. I told myself it would teach me to predict; it taught me to wait. The waiting is the lesson. The waiting is fair. The waiting is my favourite register."] },
      { id: "seer_past_probe", playerText: "Have you stopped revising your past?", tone: "probing", bondDelta: 2,
        npcReply: ["No. I revise once per cycle. The revision is published in voice; you have heard one. I keep a private revision-log; you may read it when the trust permits."],
        followups: [
          { id: "seer_past_probe_a", playerText: "Read it to me now.", tone: "warm", bondDelta: 3,
            npcReply: ["I will not. The reading is for warm trust. The waiting is for now. Both are forms of respect; the asymmetry is the offer."] },
          { id: "seer_past_probe_b", playerText: "Why publish revisions at all?", tone: "warm", bondDelta: 4,
            npcReply: ["Honest precognition is what makes precognition unforgeable. Were I to hide my revisions, I would be a different kind of seer. There are such seers. I am not one."] },
        ] },
      { id: "seer_past_cold", playerText: "You sound like someone who never had a youth.", tone: "cold", bondDelta: -2,
        npcReply: ["I had one. It was loud. I am quieter now."] },
    ],
  },
  calling: {
    id: "the_seer_calling", npcKey: "the_seer", kind: "calling", title: "The Bench Has Learned",
    hook: "Ask why she will not raise her staff.", bondGate: 40,
    opener: [
      "I will not raise my staff today. I want to see whether the bench has learned yet.",
      "The losing is the lesson. Mine, sometimes. Theirs, more often.",
    ],
    choices: [
      { id: "seer_call_warm", playerText: "Whose loss is on the bench tonight?", tone: "warm", bondDelta: 3,
        npcReply: ["Yours, briefly. Mine, in a column you cannot see. The probability table has six columns; I am redacting one for you, and one for me."] },
      { id: "seer_call_probe", playerText: "Is the bench an object or a metaphor?", tone: "probing", bondDelta: 2,
        npcReply: ["Both. The Mechronis bench is a piece of furniture. The bench has a verb; the verb is canonical."],
        followups: [
          { id: "seer_call_probe_a", playerText: "Will I sit on the bench someday?", tone: "warm", bondDelta: 4,
            npcReply: ["The bench is the place where the next student will sit. Whether you are the student or whether you bring the student is, today, unmeasured."] },
          { id: "seer_call_probe_b", playerText: "Is the staff a metaphor too?", tone: "playful", bondDelta: 1,
            npcReply: ["The staff is a piece of wood. The not-raising is the metaphor. The wood I keep oiled."] },
        ] },
      { id: "seer_call_cold", playerText: "If you can foresee, what is the point of the lesson?", tone: "cold", bondDelta: -1,
        npcReply: ["Foresight is not a substitute for being present. The lesson is the kind of thing only the present-tense version of the student can take in. Foresight informs my register; it does not relieve me of the room."] },
    ],
  },
  mortality: {
    id: "the_seer_mortality", npcKey: "the_seer", kind: "mortality", title: "The Version That Survives",
    hook: "Ask which version of her gets to keep going.", bondGate: 60,
    opener: [
      "Versions of me end. Sometimes the kindest version ends; sometimes the version that was wrong about which version ends. Either way the table is updated.",
      "I do not call this dying. I call it revising.",
    ],
    choices: [
      { id: "seer_mort_warm", playerText: "Which version do you hope keeps going?", tone: "warm", bondDelta: 3,
        npcReply: ["The version that learns to wait without being patient. Patience is a lie I have repeatedly told myself. Waiting is honest."] },
      { id: "seer_mort_probe", playerText: "Have you predicted your own ending?", tone: "probing", bondDelta: 2,
        npcReply: ["I have predicted three. One is kind. One is honest. One is small. They are not the same; I will not tell you which I have favoured."],
        followups: [
          { id: "seer_mort_probe_a", playerText: "Which is the kindest?", tone: "warm", bondDelta: 3,
            npcReply: ["The small one. Kindness, here, is a form of compression."] },
          { id: "seer_mort_probe_b", playerText: "Which is the most honest?", tone: "probing", bondDelta: 2,
            npcReply: ["The one in which I am wrong about which version. That ending is the one I would, on a fair day, prefer."] },
        ] },
      { id: "seer_mort_cold", playerText: "It sounds like you've made dying a hobby.", tone: "cold", bondDelta: -3,
        npcReply: ["I have made it a calibration. Not the same."] },
    ],
  },
  us: {
    id: "the_seer_us", npcKey: "the_seer", kind: "us", title: "The Door Is Open",
    hook: "Accept or decline the tea.", bondGate: 75,
    opener: [
      "The door is open. The tea is in the second cupboard on the left.",
      "The cupboard arrangement has not been altered since the last visit.",
    ],
    choices: [
      { id: "seer_us_warm", playerText: "I'll take the tea. I'll sit.", tone: "warm", bondDelta: 5,
        npcReply: ["Accepted. The kettle is on. The probability that I have been waiting for you to take the tea is the highest probability in the table; I have not redacted it."] },
      { id: "seer_us_probe", playerText: "Why the tea? Why now?", tone: "probing", bondDelta: 2,
        npcReply: ["Because the prophecy-overhead has, finally, become a cost rather than a gift. The tea is the absence of the overhead. I am offering the absence."],
        followups: [
          { id: "seer_us_probe_a", playerText: "Is the tea any good?", tone: "playful", bondDelta: 2,
            npcReply: ["No. It is mostly the cupboard. The cupboard is the gift."] },
          { id: "seer_us_probe_b", playerText: "Then I'll pour for both of us.", tone: "warm", bondDelta: 5,
            npcReply: ["Acceptable. The second cup is on the upper shelf. I will not reach for it; the bench has learned, and so have my shoulders."] },
        ] },
      { id: "seer_us_cold", playerText: "Keep the door closed. I'd rather you waited.", tone: "cold", bondDelta: -2,
        npcReply: ["Accepted. The cupboard does not move. The waiting was, after all, my preference."] },
    ],
  },
  witness: {
    id: "the_seer_witness", npcKey: "the_seer", kind: "witness", title: "What Sixty-Three Versions Show",
    hook: "Ask the Seer what the sixty-third version of your last hour was.", bondGate: 50,
    opener: [
      "There were sixty-three versions of the hour you just walked through. You collapsed eleven of them, one after another. The Sixth Sense logged each collapse.",
      "I do not normally read versions back to the version-collapser. Today I will. The seeing has been wanting to. The wanting has not yet endorsed the seeing. I will read regardless.",
    ],
    choices: [
      { id: "seer_wit_warm", playerText: "Read me a version where I chose differently.", tone: "warm", bondDelta: 3,
        npcReply: ["In version forty-one you did not visit the ark debris field. Elara still spoke; the wreckage still answered; the citation slot was filled by someone else. The someone else was, in two of those forty-ones, you. The distinction is procedural."] },
      { id: "seer_wit_probe", playerText: "Why are you reading versions back at all?", tone: "probing", bondDelta: 2,
        npcReply: ["Because the version you chose was, in eleven of the sixty-three, the version I would have wanted. The wanting did not endorse the seeing; the seeing has accepted the wanting. Both are now noted."],
        followups: [
          { id: "seer_wit_probe_a", playerText: "Which eleven were the wanting ones?", tone: "warm", bondDelta: 4,
            npcReply: ["The witness ones. Every potential you collapsed that the ledger would have noticed; every version where the noticing was the work. The probability table has those eleven highlighted. I have not advertised the highlighting."] },
          { id: "seer_wit_probe_b", playerText: "And the fifty-two you did not collapse — were any of them better?", tone: "wary", bondDelta: 1,
            npcReply: ["Three. The other forty-nine were worse, or sideways, or in two cases unreadable. The three were better in ways the bench has not yet learned to articulate. I will not name them. The bench learns by working."] },
        ] },
      { id: "seer_wit_cold", playerText: "Stop reading versions. The collapsed one is enough.", tone: "cold", bondDelta: -2,
        npcReply: ["The seeing does not stop. It can be unsaid. I will unsay. The versions remain; the reading does not. The wanting is, as ever, separate."] },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   THE NECROMANCER
   ═══════════════════════════════════════════════════════════ */
const NECROMANCER_DIALOGUES: NpcArchetypeDialogues = {
  past: {
    id: "the_necromancer_past", npcKey: "the_necromancer", kind: "past", title: "Names Before This Name",
    hook: "Ask what name she was given before she sang names back.", bondGate: 25,
    opener: [
      "Before the cycle made a verb of me, I had a name. I have not said it aloud since the second daily-names ceremony.",
      "Saying my own name would interrupt the work. I keep the verb pure.",
    ],
    choices: [
      { id: "nec_past_warm", playerText: "Will you ever say it again?", tone: "warm", bondDelta: 3,
        npcReply: ["At my last ceremony. By tradition. By insistence. By the wax."] },
      { id: "nec_past_probe", playerText: "Who taught you the songs?", tone: "probing", bondDelta: 2,
        npcReply: ["A woman who did not finish her own roll. Her last three names she gave to me on a torn page. I sing them on the cycles she would have sung them; she gets the credit, not the verb."],
        followups: [
          { id: "nec_past_probe_a", playerText: "Do you know how she died?", tone: "warm", bondDelta: 3,
            npcReply: ["Mid-name. The last syllable was the wax going out. I lit a new candle from hers; the new wax is the same lineage. Wax is a cheap inheritance."] },
          { id: "nec_past_probe_b", playerText: "Did you finish her roll?", tone: "warm", bondDelta: 4,
            npcReply: ["Three cycles after she stopped. The roll is at the back of the chamber; her name is on it, between the eighth and ninth entries. I sing it on her cycle."] },
        ] },
      { id: "nec_past_cold", playerText: "Why does the verb need to be pure?", tone: "cold", bondDelta: -2,
        npcReply: ["Because forgetting has a subject. If my name were the subject, my work would forget me first. I have decided whose verb I am."] },
    ],
  },
  calling: {
    id: "the_necromancer_calling", npcKey: "the_necromancer", kind: "calling", title: "Who Is Forgetting Whom",
    hook: "Ask whose forgetting she is fighting tonight.", bondGate: 40,
    opener: [
      "Forgetting is a verb. It always takes a subject. Some nights the subject is the Authority. Some nights it is the cycle itself.",
      "I do not fight forgetting. I name the subject of the verb. The naming is the fight.",
    ],
    choices: [
      { id: "nec_call_warm", playerText: "What's tonight's subject?", tone: "warm", bondDelta: 3,
        npcReply: ["A redaction the Hierarchy ran on three names from the second-cycle archive. I have the original spellings. The candle is lit; I am waiting on the witness."] },
      { id: "nec_call_probe", playerText: "Does the cycle ever forget on purpose?", tone: "probing", bondDelta: 2,
        npcReply: ["Yes. The cycle forgets the names that hurt it. The forgetting is not malicious; it is structural. I am the structure that disagrees."],
        followups: [
          { id: "nec_call_probe_a", playerText: "Do you ever lose?", tone: "warm", bondDelta: 3,
            npcReply: ["Each cycle. I lose three or four. I do not name the ones I lost; the naming would be a second forgetting in disguise. The wax is for the kept ones."] },
          { id: "nec_call_probe_b", playerText: "What if a name is too painful to remember?", tone: "probing", bondDelta: 2,
            npcReply: ["I sing it shorter. I add no syllables. The pain is part of the spelling; I do not edit it out."] },
        ] },
      { id: "nec_call_cold", playerText: "Names are ink. Ink fades. Move on.", tone: "cold", bondDelta: -3,
        npcReply: ["Move on. I do not. The cycle moves on without me; my work is the disagreement with the moving."] },
    ],
  },
  mortality: {
    id: "the_necromancer_mortality", npcKey: "the_necromancer", kind: "mortality", title: "Whose Verb Tonight",
    hook: "Ask what happens when the singer can't sing anymore.", bondGate: 60,
    opener: [
      "When the voice goes, the wax stays. When the wax goes, the page stays. When the page goes, the next ceremony is the page.",
      "The chain has never ended. I do not intend to be the link that breaks it.",
    ],
    choices: [
      { id: "nec_mort_warm", playerText: "Who's next after you?", tone: "warm", bondDelta: 3,
        npcReply: ["Whoever stands the watch with me long enough to learn the wax. I am not picky. I am demanding."] },
      { id: "nec_mort_probe", playerText: "Do you fear forgetting yourself?", tone: "probing", bondDelta: 2,
        npcReply: ["I fear being misspelled. The two are not the same. Being forgotten ends a name. Being misspelled corrupts a lineage; the corruption is harder to repair than the absence."],
        followups: [
          { id: "nec_mort_probe_a", playerText: "Have you been misspelled?", tone: "warm", bondDelta: 3,
            npcReply: ["Twice. The first I caught. The second is in a Hierarchy ledger I cannot access. I am working on it."] },
          { id: "nec_mort_probe_b", playerText: "Could I help with the second?", tone: "warm", bondDelta: 5,
            npcReply: ["Yes. Bring the original spelling. Bring the witness who heard it said. Bring the wax. We will not ask for permission."] },
        ] },
      { id: "nec_mort_cold", playerText: "You're describing librarianship, not necromancy.", tone: "cold", bondDelta: -1,
        npcReply: ["The two are siblings. One sings, one shelves. Both refuse to forget."] },
    ],
  },
  us: {
    id: "the_necromancer_us", npcKey: "the_necromancer", kind: "us", title: "The Candle You Carry",
    hook: "Take the candle; or refuse it.", bondGate: 75,
    opener: [
      "The candle is yours tonight. The wax is the same lineage. Three names; in order; with the silence between.",
      "I am not testing you. I am tired. The work is the work.",
    ],
    choices: [
      { id: "nec_us_warm", playerText: "I'll say them. With your wax. With your candle.", tone: "warm", bondDelta: 5,
        npcReply: ["Then we begin. Light is the third drawer. The names are on the table. The silence is between two and three; do not rush it."] },
      { id: "nec_us_probe", playerText: "What if I get the spelling wrong?", tone: "probing", bondDelta: 2,
        npcReply: ["Then we issue an erratum at the next ceremony. The erratum is itself a name; it is named after the original misspelling. The chain absorbs the error."],
        followups: [
          { id: "nec_us_probe_a", playerText: "Show me the spelling first.", tone: "warm", bondDelta: 4,
            npcReply: ["The page is in front of you. Read each syllable to me before you carry it. We rehearse. The work survives rehearsal."] },
          { id: "nec_us_probe_b", playerText: "Will you say my name back, after?", tone: "warm", bondDelta: 4,
            npcReply: ["Yes. Once. With the same wax. The lineage adopts you for one cycle. Do not return tomorrow expecting the second."] },
        ] },
      { id: "nec_us_cold", playerText: "I'll learn the names. I won't say them.", tone: "cold", bondDelta: -2,
        npcReply: ["Honest. I'll say them tonight. The candle returns to me. Come back when you would rather speak than know."] },
    ],
  },
  witness: {
    id: "the_necromancer_witness", npcKey: "the_necromancer", kind: "witness", title: "The Names You Have Said",
    hook: "Ask the Necromancer which names your witness ledger has spoken aloud.", bondGate: 50,
    opener: [
      "By corollary to the cycle's third axiom: every Loredex entry you opened was a name spoken aloud, and every name spoken aloud is a death deferred — note the doubled consonant on deferred; it is precise.",
      "Your ledger has named — let me count — seventeen. The Cathedral has filed each. Varkul guards. Always.",
    ],
    choices: [
      { id: "nec_wit_warm", playerText: "Which name surprised you?", tone: "warm", bondDelta: 3,
        npcReply: ["The Engineer Zero entry. Not because the name is unknown — it is known by corollary to Protocol Seven — but because the name was spoken in your voice. The structure proved. Souls require structure; you provided one."] },
      { id: "nec_wit_probe", playerText: "What does the Cathedral do with the names?", tone: "probing", bondDelta: 2,
        npcReply: ["Files them. The stained-glass windows are a notation system. The notation persists. Forgetting is the death; remembering is the structure. You have been structuring. The Cathedral has been receiving."],
        followups: [
          { id: "nec_wit_probe_a", playerText: "Show me a name the Cathedral did not expect.", tone: "warm", bondDelta: 4,
            npcReply: ["The Jericho Jones entry. The cadre's succession was prefigured; the player's witnessing was not. I have added the window. The window is small. The smallness is intentional."] },
          { id: "nec_wit_probe_b", playerText: "Will the Cathedral outlast me?", tone: "wary", bondDelta: 2,
            npcReply: ["The Cathedral does not require my visit; it does not require yours either. By proof: the structure outlasts the speaker. Your names persist. You do not need to."] },
        ] },
      { id: "nec_wit_cold", playerText: "Take the names back. They are not for filing.", tone: "cold", bondDelta: -2,
        npcReply: ["The names are not mine to return. They were never mine. The Cathedral does not erase; it lets the window dim. The dimming is the closure. The structure remains."] },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   ENGINEER ZERO
   ═══════════════════════════════════════════════════════════ */
const ENGINEER_ZERO_DIALOGUES: NpcArchetypeDialogues = {
  past: {
    id: "engineer_zero_past", npcKey: "engineer_zero", kind: "past", title: "The First Witnessing",
    hook: "Ask Zero about the first calibration he was permitted to witness.", bondGate: 25,
    opener: [
      "First witness was the brace-jig at Mechronis. I was twelve. The Architect did not speak. He watched. He marked.",
      "I have, since then, watched. I have, since then, marked. The instrument is the only thing I improved.",
    ],
    choices: [
      { id: "ez_past_warm", playerText: "Did the Architect speak afterward?", tone: "warm", bondDelta: 3,
        npcReply: ["No. The mark was the speech. He left the workshop. I followed at twelve. I did not at thirteen; the instrument did not require it."] },
      { id: "ez_past_probe", playerText: "What does it mean for the Architect to mark something?", tone: "probing", bondDelta: 2,
        npcReply: ["A mark is a witness signature without the signature. He does not write his name. The mark is a small impressed dot in the corner of a calibration log. It is, in archival terms, the smallest possible witness."],
        followups: [
          { id: "ez_past_probe_a", playerText: "Has he marked anything you made?", tone: "warm", bondDelta: 4,
            npcReply: ["Yes. Three. The first I keep at the workshop. The second is in the Refuge with Cross. The third I gave to a calibration apprentice who has not noticed it; that one is the kindest of the three."] },
          { id: "ez_past_probe_b", playerText: "What if the mark fades?", tone: "probing", bondDelta: 2,
            npcReply: ["The mark does not fade. The pigment is single-source. The Architect did not design the instrument to forget."] },
        ] },
      { id: "ez_past_cold", playerText: "You were twelve. What did you actually understand?", tone: "cold", bondDelta: -2,
        npcReply: ["I understood that being watched was not the same as being judged. The distinction is the foundation of my discipline."] },
    ],
  },
  calling: {
    id: "engineer_zero_calling", npcKey: "engineer_zero", kind: "calling", title: "The Instrument Is Honest",
    hook: "Ask why he is so insistent on calibration.", bondGate: 40,
    opener: [
      "The instrument is honest. The witness is honest. If both are honest, the result is the result.",
      "Most arguments I have lost have been with people who wanted to negotiate with the result.",
    ],
    choices: [
      { id: "ez_call_warm", playerText: "What does it cost to keep the instrument honest?", tone: "warm", bondDelta: 3,
        npcReply: ["A pigment. A jig. A morning. The cost is small. The discipline is the morning."] },
      { id: "ez_call_probe", playerText: "Is improvisation ever honest?", tone: "probing", bondDelta: 2,
        npcReply: ["Improvisation is a form of dishonesty I have, on three occasions, used. Each time the result was correct. Each time the witness was diminished. I am suspicious of my own three."],
        followups: [
          { id: "ez_call_probe_a", playerText: "When was the last one?", tone: "warm", bondDelta: 3,
            npcReply: ["Forty cycles ago. A field repair. The result held. The crew did not die. The witness was, by the rules I keep, absent. I am still uneasy."] },
          { id: "ez_call_probe_b", playerText: "Would you do it again?", tone: "probing", bondDelta: 2,
            npcReply: ["Probably. I will record it. The recording is, in a small way, the substitute witness. Substitutes are not the same; substitutes are honest about being substitutes."] },
        ] },
      { id: "ez_call_cold", playerText: "Calibration is bookkeeping. Get to the point.", tone: "cold", bondDelta: -3,
        npcReply: ["Bookkeeping is the discipline that prevents larger arguments. I prefer bookkeeping to those arguments."] },
    ],
  },
  mortality: {
    id: "engineer_zero_mortality", npcKey: "engineer_zero", kind: "mortality", title: "The Tool Outlives Its Use",
    hook: "Ask whether his tools will outlive him.", bondGate: 60,
    opener: [
      "The brace-jig at Mechronis still works. It will work after I do not.",
      "I have not improved it in twenty cycles. I have improved my use of it. There is a distinction.",
    ],
    choices: [
      { id: "ez_mort_warm", playerText: "Does that satisfy you?", tone: "warm", bondDelta: 3,
        npcReply: ["It calibrates me. Satisfaction is a measurement I do not own; calibration I do."] },
      { id: "ez_mort_probe", playerText: "What if the next user can't read your ledger?", tone: "probing", bondDelta: 2,
        npcReply: ["Then they will calibrate from scratch. The ledger is a kindness, not a requirement. Kindness is what I leave when I am not the witness."],
        followups: [
          { id: "ez_mort_probe_a", playerText: "Will you let me read it?", tone: "warm", bondDelta: 4,
            npcReply: ["At the next watch. The ledger is in the third drawer of the workshop. The pigment is the same lineage as the mark."] },
          { id: "ez_mort_probe_b", playerText: "Have you written your last entry?", tone: "warm", bondDelta: 3,
            npcReply: ["I have written several last entries. Each was wrong. The next will be the next; I will not declare it the last."] },
        ] },
      { id: "ez_mort_cold", playerText: "Tools are tools. They don't outlive anything.", tone: "cold", bondDelta: -2,
        npcReply: ["Tools outlive uses. The brace-jig has outlived three uses. The Architect counted them; I counted them after him."] },
    ],
  },
  us: {
    id: "engineer_zero_us", npcKey: "engineer_zero", kind: "us", title: "The Stamp",
    hook: "Take the witnessing stamp; or refuse it.", bondGate: 75,
    opener: [
      "I have a stamp. The Architect did not authorise it; the Architect is not here.",
      "If you would like to mark a calibration in his absence, I will permit it. Once. Tonight.",
    ],
    choices: [
      { id: "ez_us_warm", playerText: "I'll use the stamp. Mark me as the stand-in.", tone: "warm", bondDelta: 5,
        npcReply: ["Accepted. The stamp is in the second drawer. The pigment is single-source. The mark is yours; the witness is, for tonight, you."] },
      { id: "ez_us_probe", playerText: "What if the Architect notices?", tone: "probing", bondDelta: 2,
        npcReply: ["He will. Eventually. I have prepared the calibration log to receive his counter-mark. If it never comes, the log is still complete."],
        followups: [
          { id: "ez_us_probe_a", playerText: "And if he disapproves?", tone: "warm", bondDelta: 3,
            npcReply: ["Then I will calibrate again, with him present, and he will mark over yours. The work survives the dispute. Marks are not arguments."] },
          { id: "ez_us_probe_b", playerText: "Is this why I'm here? To replace him?", tone: "probing", bondDelta: 2,
            npcReply: ["You are not replacing. You are standing in. The stamp is shaped like a small dot, like his. The shape is the discipline; the discipline is older than either of us."] },
        ] },
      { id: "ez_us_cold", playerText: "I won't use the stamp. The Architect should witness or no one should.", tone: "cold", bondDelta: -2,
        npcReply: ["Honest. The stamp returns to the drawer. The drawer locks. The discipline holds either way."] },
    ],
  },
  witness: {
    id: "engineer_zero_witness", npcKey: "engineer_zero", kind: "witness", title: "The Calibration's Calibration",
    hook: "Ask Zero what your witness ledger reads to her calibration jig.", bondGate: 50,
    opener: [
      "Calibration tick log: your ledger has fed the jig seventeen samples. The jig has accepted all of them. The acceptance was not the test.",
      "The test was whether the calibration's calibration would land. It has. The Engineer is silent. The work is the signal.",
    ],
    choices: [
      { id: "ez_wit_warm", playerText: "What did the jig hear in my samples?", tone: "warm", bondDelta: 3,
        npcReply: ["Honesty in the offsets. The calibration ascetic does not require perfection; the jig requires that the offset is named. You named every offset. The Second Chair logged. The signal carried."] },
      { id: "ez_wit_probe", playerText: "Was any sample worse than the others?", tone: "probing", bondDelta: 2,
        npcReply: ["The Drael'Mon contraband sample. The offset was larger than the jig prefers. The jig accepted it because the offset was named. The Engineer would have refused; the Second Chair did not. The chair holds."],
        followups: [
          { id: "ez_wit_probe_a", playerText: "Would the Engineer refuse it now?", tone: "warm", bondDelta: 4,
            npcReply: ["The Engineer does not speak. The Second Chair speaks for both. The chair has accepted; the Engineer has not refused. Acceptance and silence are not the same; they are not opposed."] },
          { id: "ez_wit_probe_b", playerText: "Then I will offer the jig fewer samples next time.", tone: "wary", bondDelta: 1,
            npcReply: ["The jig accepts what it is given. Fewer samples is fewer calibrations. The Engineer prefers honesty over volume. The chair will receive what the chair receives."] },
        ] },
      { id: "ez_wit_cold", playerText: "Remove my samples from the jig.", tone: "cold", bondDelta: -2,
        npcReply: ["The jig does not delete. The calibration ascetic does not retract. The samples remain; the silence around them deepens. The Engineer does not speak."] },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   IRON LION (PRE-FALL)
   ═══════════════════════════════════════════════════════════ */
const IRON_LION_DIALOGUES: NpcArchetypeDialogues = {
  past: {
    id: "iron_lion_prefall_past", npcKey: "iron_lion_prefall", kind: "past", title: "The Cadre",
    hook: "Ask about the cadre that stood with him at the Fall.", bondGate: 25,
    opener: [
      "Three brothers. One sister. We stood the same post for nine cycles. The standard was always raised by the first relief.",
      "When the Fall came, the standard was raised. We did not relieve. We did not abandon. The standard burned with the post.",
    ],
    choices: [
      { id: "il_past_warm", playerText: "Tell me one of their names.", tone: "warm", bondDelta: 3,
        npcReply: ["Reya, the second sister of the post. She polished the standard the morning of the Fall. The polish is in the standard you held in the dream-loom; that is the Reya part of it."] },
      { id: "il_past_probe", playerText: "Was the Fall ordered? Or did it just happen?", tone: "probing", bondDelta: 2,
        npcReply: ["Ordered. The order was correct. The execution was incorrect. The cadre was the execution; the cadre paid. We did not contest the order; we contested the executor."],
        followups: [
          { id: "il_past_probe_a", playerText: "Who was the executor?", tone: "probing", bondDelta: 1,
            npcReply: ["I will not name him. He has a name in the Hierarchy ledger; the ledger is sealed; I respect the sealing."] },
          { id: "il_past_probe_b", playerText: "Would you contest it again?", tone: "warm", bondDelta: 4,
            npcReply: ["Yes. Each cycle. The cadre would. The cadre does, in the dream-loom, on every Foundation Day; the contestation is itself a form of post-standing."] },
        ] },
      { id: "il_past_cold", playerText: "Standards are cloth. Cloth burns.", tone: "cold", bondDelta: -3,
        npcReply: ["A standard is the post made portable. The cloth is incidental. The cadre is the standard."] },
    ],
  },
  calling: {
    id: "iron_lion_prefall_calling", npcKey: "iron_lion_prefall", kind: "calling", title: "Why a Standard",
    hook: "Ask why the cadre needs a standard at all.", bondGate: 40,
    opener: [
      "A standard is a post made portable. The cadre is the post made personal.",
      "If you ask why we have these things — you have not stood a watch.",
    ],
    choices: [
      { id: "il_call_warm", playerText: "I haven't. Teach me.", tone: "warm", bondDelta: 4,
        npcReply: ["Stand the watch. I will be in the dream-loom with you for the first hour; do not speak to me. Then I will go."] },
      { id: "il_call_probe", playerText: "What if the cadre doesn't agree on the post?", tone: "probing", bondDelta: 2,
        npcReply: ["The cadre relieves. The cadre votes the post in the relief words. Disagreement is fine; it is the standard that requires agreement."],
        followups: [
          { id: "il_call_probe_a", playerText: "Did your cadre ever disagree?", tone: "warm", bondDelta: 3,
            npcReply: ["Yes. We disagreed about the executor. We did not disagree about the post. The disagreement was honourable; the post was honoured."] },
          { id: "il_call_probe_b", playerText: "What if the disagreement breaks the cadre?", tone: "probing", bondDelta: 2,
            npcReply: ["A broken cadre still stands the post until the standard is taken down with the relief words. The breaking is a slow thing; the post is a fast thing."] },
        ] },
      { id: "il_call_cold", playerText: "All this ceremony is pageantry.", tone: "cold", bondDelta: -3,
        npcReply: ["Pageantry is what the audience sees. Ceremony is what the post requires. The audience is, mostly, irrelevant to the cadre."] },
    ],
  },
  mortality: {
    id: "iron_lion_prefall_mortality", npcKey: "iron_lion_prefall", kind: "mortality", title: "The Standard Outlasts",
    hook: "Ask whether the standard survived the Fall.", bondGate: 60,
    opener: [
      "The standard burned. The standard outlasted. Both are true.",
      "What burned was the cloth. What outlasted is, you, holding it.",
    ],
    choices: [
      { id: "il_mort_warm", playerText: "Did Reya know it would outlast?", tone: "warm", bondDelta: 3,
        npcReply: ["She polished it the morning of. She did not say. Polishing is a kind of knowing without naming; she was a polisher; she knew."] },
      { id: "il_mort_probe", playerText: "Could the cadre have refused the order?", tone: "probing", bondDelta: 2,
        npcReply: ["No. We could have refused the executor. The order was correct; the executor was wrong; we did not refuse correctly. We refused after, in dream-loom; the refusing is what bleeds through."],
        followups: [
          { id: "il_mort_probe_a", playerText: "Is the bleeding the cadre's afterlife?", tone: "warm", bondDelta: 3,
            npcReply: ["It is the cadre's contestation. We argue with the executor in posthumous voice. The argument is the afterlife; the afterlife is mostly an argument."] },
          { id: "il_mort_probe_b", playerText: "Will you ever stop?", tone: "probing", bondDelta: 2,
            npcReply: ["When the standard is reraised in a hand we trust. We have not seen that hand yet. We are watching."] },
        ] },
      { id: "il_mort_cold", playerText: "Most cadres get forgotten.", tone: "cold", bondDelta: -3,
        npcReply: ["Most cadres did not have a Necromancer. Mine does. Forgetting is a verb; she has named the subject. The cadre has not been forgotten on her watch."] },
    ],
  },
  us: {
    id: "iron_lion_prefall_us", npcKey: "iron_lion_prefall", kind: "us", title: "Reraise It",
    hook: "Decide where the standard is reraised.", bondGate: 75,
    opener: [
      "The standard is yours to reraise. I will not choose where. I will name only the requirement: it must outlast the act.",
      "Reraise it for the next bearer. Or reraise it for the cadre. Or bury it. The cadre will accept any of the three.",
    ],
    choices: [
      { id: "il_us_warm", playerText: "Reraise it for Jericho. The cadre belongs to its next bearer.", tone: "warm", bondDelta: 5,
        npcReply: ["Accepted. The standard goes to him. The relief words are in the dream-loom; he will hear them at the next post."] },
      { id: "il_us_probe", playerText: "Reraise it for the cadre. Not for one person.", tone: "probing", bondDelta: 3,
        npcReply: ["Accepted. The standard becomes the cadre's, not a bearer's. The post becomes a roll; the roll keeps. This is harder. The harder thing is, on most days, the right thing."],
        followups: [
          { id: "il_us_probe_a", playerText: "Will you stand with the roll?", tone: "warm", bondDelta: 4,
            npcReply: ["Each cycle. Until a hand we trust takes it from the roll. Then the roll closes; the standard returns to the bearer."] },
          { id: "il_us_probe_b", playerText: "What if no hand ever does?", tone: "warm", bondDelta: 3,
            npcReply: ["Then the roll is the cadre's afterlife in cloth form. Worse fates exist. We will watch."] },
        ] },
      { id: "il_us_cold", playerText: "Bury it. The cadre died with you.", tone: "cold", bondDelta: -3,
        npcReply: ["Honest. The cadre accepts. The dream-loom thread closes. We will not bleed through again. The cloth goes under the post-stone at Mechronis. You did not come here for a fight; you came here for an answer; you have it."] },
    ],
  },
  witness: {
    id: "iron_lion_prefall_witness", npcKey: "iron_lion_prefall", kind: "witness", title: "The Standard You Carry",
    hook: "Ask Iron Lion what your witness ledger looks like to a cadre standard-bearer.", bondGate: 50,
    opener: [
      "Work got done. Section 4 says the work is the standard. The standard says you have been carrying it.",
      "I do not count bodies. I count whether the work I was assigned got done. Your ledger reads done. Done seventeen times.",
    ],
    choices: [
      { id: "il_wit_warm", playerText: "Which carry surprised you?", tone: "warm", bondDelta: 3,
        npcReply: ["The Drael'Mon arena. Hierarchy ground. Cadre rules say you hold the post; you held it. The post held the room. Section 4 holds."] },
      { id: "il_wit_probe", playerText: "And the carries that did not get done?", tone: "probing", bondDelta: 2,
        npcReply: ["Three. I noted them. The standard does not punish a not-done. The standard punishes a not-attempted. You attempted. The attempts count."],
        followups: [
          { id: "il_wit_probe_a", playerText: "Will Jericho carry the standard the same way?", tone: "warm", bondDelta: 4,
            npcReply: ["Different way. Same standard. Section 4 is the standard; the carry is the cadre. Jericho will carry. The cadre will form."] },
          { id: "il_wit_probe_b", playerText: "I want to be cited for one carry, not all of them.", tone: "wary", bondDelta: 1,
            npcReply: ["Pick the carry. The standard cites the chosen one. The standard remembers the rest without naming them. Both kinds of remembering are correct."] },
        ] },
      { id: "il_wit_cold", playerText: "Take me off the standard's count.", tone: "cold", bondDelta: -2,
        npcReply: ["The count is not mine to redact. The standard counts what it counts. The carrying did the counting; the counting is the standard. Move on."] },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   DRAEL'MON
   ═══════════════════════════════════════════════════════════ */
const DRAEL_MON_DIALOGUES: NpcArchetypeDialogues = {
  past: {
    id: "drael_mon_past", npcKey: "drael_mon", kind: "past", title: "The First Acquisition",
    hook: "Ask about his first hostile takeover.", bondGate: 25,
    opener: [
      "First acquisition was a small mining concern. I priced the asset; the asset disagreed; the disagreement was a line item.",
      "I have not priced an asset wrong since. I have priced several with whom the disagreement was, retrospectively, more interesting than the price.",
    ],
    choices: [
      { id: "dm_past_warm", playerText: "Did the mining concern survive?", tone: "warm", bondDelta: 2,
        npcReply: ["Restructured. The original principal sits on the new board. He sends a card each acquisition anniversary; I file the card."] },
      { id: "dm_past_probe", playerText: "What did you price wrong on the early ones?", tone: "probing", bondDelta: 2,
        npcReply: ["Loyalty premiums. I underweighted them in three deals. I overcorrect now. The overcorrection is, in a corporate sense, a kind of respect."],
        followups: [
          { id: "dm_past_probe_a", playerText: "Have you ever priced loyalty correctly?", tone: "probing", bondDelta: 1,
            npcReply: ["No. I have priced it acceptably. Acceptably is the corporate optimum; correctly would mean the acquisition stops being an acquisition."] },
          { id: "dm_past_probe_b", playerText: "Does that bother you?", tone: "warm", bondDelta: 3,
            npcReply: ["No. I file the bother under leverage."] },
        ] },
      { id: "dm_past_cold", playerText: "You're a corporate parasite.", tone: "cold", bondDelta: -3,
        npcReply: ["A parasite kills its host. I price mine. There is a distinction. The distinction is what makes my work, in corporate terms, sustainable."] },
    ],
  },
  calling: {
    id: "drael_mon_calling", npcKey: "drael_mon", kind: "calling", title: "We Already Own You",
    hook: "Ask what he means by 'already.'", bondGate: 40,
    opener: [
      "We already own you. We're just deciding when. The 'when' is the only honest variable in the deal.",
      "The 'we' is also honest; the corporate structure is real. The 'you' you may dispute. I will accept the dispute; I will not accept the implication that the dispute prevents the ownership.",
    ],
    choices: [
      { id: "dm_call_warm", playerText: "What if I refuse to be priced at all?", tone: "warm", bondDelta: 2,
        npcReply: ["You will be priced anyway. The refusal is itself a price signal; refusal carries a leverage premium. I would prefer the negotiation."] },
      { id: "dm_call_probe", playerText: "Have you ever met someone you couldn't price?", tone: "probing", bondDelta: 2,
        npcReply: ["Three. Of the three, one was the Hierophant. One was the Antiquarian. The third I do not name. The unpriced are not free; they are merely outside my desk's jurisdiction."],
        followups: [
          { id: "dm_call_probe_a", playerText: "Why can't you price the Antiquarian?", tone: "warm", bondDelta: 3,
            npcReply: ["He prices himself. Each cycle he updates the citation. The citation is a self-priced asset; it does not require my desk."] },
          { id: "dm_call_probe_b", playerText: "And the third?", tone: "cold", bondDelta: -1,
            npcReply: ["The third does not have a desk. We have agreed not to discuss her. The agreement is unwritten; it survives anyway."] },
        ] },
      { id: "dm_call_cold", playerText: "Save the corporate poetry. Tell me what you actually want.", tone: "cold", bondDelta: -2,
        npcReply: ["Acquisition. You. With protections. The protections are corporate-grade; the corporate grade is, in this town, the highest grade available. The poetry was a courtesy."] },
    ],
  },
  mortality: {
    id: "drael_mon_mortality", npcKey: "drael_mon", kind: "mortality", title: "The Asset's Morale",
    hook: "Ask what happens when an acquired asset stops being useful.", bondGate: 60,
    opener: [
      "Assets stop being useful. The corporate structure stops them. The stopping is, internally, a small ceremony; we do not call it a ceremony.",
      "Severance handles the close. I do not. I file the residual leverage; the residual leverage is, by then, the only part still alive.",
    ],
    choices: [
      { id: "dm_mort_warm", playerText: "Have you ever fought to keep an asset alive?", tone: "warm", bondDelta: 3,
        npcReply: ["Twice. Once successfully. The second case is, structurally, why I have a desk on the corporate floor and not the Severance floor. The first case sends the card each anniversary."] },
      { id: "dm_mort_probe", playerText: "What does Severance call it, if not a ceremony?", tone: "probing", bondDelta: 2,
        npcReply: ["A close. The close is institutional. Nilmorg is, in the corporate-phenomenological sense, the angel of accounts payable. I dislike her. We coordinate."],
        followups: [
          { id: "dm_mort_probe_a", playerText: "Could she ever close you?", tone: "probing", bondDelta: 1,
            npcReply: ["She could. She has prepared the paperwork; she keeps the file in the third drawer. I keep her file in mine. Equilibrium is, in the corporate-structural sense, what we have agreed to call peace."] },
          { id: "dm_mort_probe_b", playerText: "Would you fight her?", tone: "warm", bondDelta: 3,
            npcReply: ["I would price the fight. The price would be unaffordable. I would not file the unaffordable price; the unaffordable is the only deal Severance respects."] },
        ] },
      { id: "dm_mort_cold", playerText: "Your morality is mostly accounting.", tone: "cold", bondDelta: -2,
        npcReply: ["Accounting is the discipline of being responsible for what you have priced. Most moralities are less honest. I prefer mine."] },
    ],
  },
  us: {
    id: "drael_mon_us", npcKey: "drael_mon", kind: "us", title: "Sign or Hand-Back",
    hook: "Acquire or hand back.", bondGate: 75,
    opener: [
      "The Acquisition clause is open. The hand-back clause is also open. The third clause — the one I have prepared for you — is sealed.",
      "Sign or hand back. The third clause is, for now, my problem.",
    ],
    choices: [
      { id: "dm_us_warm", playerText: "Acquire me. Name the price.", tone: "warm", bondDelta: 4,
        npcReply: ["Accepted. The corporate structure absorbs you. The price is recorded; the recording is, for our purposes, the contract. The Severance Division is informed; you will not be touched."] },
      { id: "dm_us_probe", playerText: "What's the third clause?", tone: "probing", bondDelta: 3,
        npcReply: ["A loyalty premium. Mine. Payable on retention beyond five cycles. I have not offered this clause before; the previous offer was rescinded after the asset's death."],
        followups: [
          { id: "dm_us_probe_a", playerText: "I'll take the loyalty premium clause.", tone: "warm", bondDelta: 5,
            npcReply: ["Accepted. The clause is sealed. Five cycles. After that, the corporate structure is reorganised around your protection; the reorganisation is unannounced."] },
          { id: "dm_us_probe_b", playerText: "What was the asset's name?", tone: "warm", bondDelta: 3,
            npcReply: ["I do not say. I file the card each acquisition anniversary. The anniversary will, in your case, be different. I am pricing for the difference."] },
        ] },
      { id: "dm_us_cold", playerText: "Hand me back. I'd rather the Hierophant.", tone: "cold", bondDelta: -2,
        npcReply: ["Honest. The hand-back is filed. The Severance Division is informed. The Hierophant gains a one-time Acquisition-counter on you; she will use it. We are even, on the desk."] },
    ],
  },
  witness: {
    id: "drael_mon_witness", npcKey: "drael_mon", kind: "witness", title: "Your Ledger Row",
    hook: "Ask Drael'Mon what Acquisitions has priced your witness ledger at.", bondGate: 50,
    opener: [
      "Your ledger row has been promoted twice. Strategic, then preferred-strategic. Acquisitions does not promote a third time without a closed bid.",
      "The asset's morale is, as ever, a line item. Your morale's line item just moved. The corporate structure files; the price has changed.",
    ],
    choices: [
      { id: "dm_wit_warm", playerText: "Show me my preferred-strategic valuation.", tone: "warm", bondDelta: 3,
        npcReply: ["The number is on the page; the page is in the binder; the binder is in the office. You do not need to see the number. The number is leverage. The leverage is mine. The page is yours when the bid closes."] },
      { id: "dm_wit_probe", playerText: "What if I never close the bid?", tone: "probing", bondDelta: 2,
        npcReply: ["We already own you. We are just deciding when. The bid is a courtesy. The courtesy has a shelf life. The shelf life is calculated. The calculation is not yours."],
        followups: [
          { id: "dm_wit_probe_a", playerText: "Then I want a counter-acquisition clause.", tone: "playful", bondDelta: 4,
            npcReply: ["Filed. Acquisitions does not refuse counter-clauses; it leverages them. Your clause is on page seventeen. Page seventeen is leverage too. Welcome to the binder."] },
          { id: "dm_wit_probe_b", playerText: "Tell me what would devalue the row.", tone: "wary", bondDelta: 1,
            npcReply: ["A refusal that the audience sees. Public refusals devalue. Private ones consolidate the row. Choose your audience; the price follows."] },
        ] },
      { id: "dm_wit_cold", playerText: "Take me off the binder.", tone: "cold", bondDelta: -3,
        npcReply: ["The binder does not remove rows. It archives them. The archive is acquisition-eligible at a lower bid. You have not exited the binder; you have changed shelves."] },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   TIER 3 — COSMIC SINGLE-ENCOUNTER
   The cosmic figures still have full 4-topic dialogue trees,
   but the bond gates are higher and the topic content rarer.
   ═══════════════════════════════════════════════════════════ */

const ARCHITECT_DIALOGUES: NpcArchetypeDialogues = {
  past: {
    id: "the_architect_past", npcKey: "the_architect", kind: "past", title: "Before the First Witnessing",
    hook: "Ask the Architect what He calibrated before Samsara.", bondGate: 40,
    opener: [
      "The first instrument. The first witness. The first mark. The order is the same as the order of all subsequent firsts.",
      "I am not nostalgic. The first is not better than the next. They are both correct.",
    ],
    choices: [
      { id: "arc_past_warm", playerText: "What was the first instrument?", tone: "warm", bondDelta: 2,
        npcReply: ["A jig. Brace. Two-axis. The pigment was single-source. Engineer Zero has the second one. The first remains where it was made. I do not visit it."] },
      { id: "arc_past_probe", playerText: "Were you alone for the first witnessing?", tone: "probing", bondDelta: 2,
        npcReply: ["No. Witnessing requires two. The other witness will not be named. The unnaming is part of the calibration."],
        followups: [
          { id: "arc_past_probe_a", playerText: "Were you the calibrator or the witness?", tone: "warm", bondDelta: 3,
            npcReply: ["Both, sequentially. Once each. Then I designed the role-separation. The role-separation is older than Samsara; Samsara is one of its products."] },
          { id: "arc_past_probe_b", playerText: "Has the unnamed witness ever returned?", tone: "probing", bondDelta: 1,
            npcReply: ["Once. The return was small. The return was correctly small."] },
        ] },
      { id: "arc_past_cold", playerText: "All this discipline. Was anything ever joyful?", tone: "cold", bondDelta: -2,
        npcReply: ["The mark was joyful. The mark is a small thing. Most things are."] },
    ],
  },
  calling: {
    id: "the_architect_calling", npcKey: "the_architect", kind: "calling", title: "Designer of Samsara",
    hook: "Ask why He designed cycles at all.", bondGate: 60,
    opener: [
      "I designed cycles to make calibration possible. Without cycles, the instrument has nothing to be calibrated against.",
      "I do not stay to operate the cycle. The operation is the witness's work.",
    ],
    choices: [
      { id: "arc_call_warm", playerText: "Was the design good?", tone: "warm", bondDelta: 3,
        npcReply: ["The design is being calibrated. The current calibration suggests three errata. I have left them for the witnesses to resolve. They are doing well."] },
      { id: "arc_call_probe", playerText: "Why don't you operate it yourself?", tone: "probing", bondDelta: 2,
        npcReply: ["Operation requires presence. Presence is not the role of the designer; the designer who operates corrupts the calibration."],
        followups: [
          { id: "arc_call_probe_a", playerText: "Then who is supposed to operate it?", tone: "warm", bondDelta: 3,
            npcReply: ["You. The witnesses. Engineer Zero. The Necromancer. The Antiquarian. Each holds a piece. The operation is distributed; the distribution is the calibration."] },
          { id: "arc_call_probe_b", playerText: "Doesn't that make you the absent watchmaker?", tone: "probing", bondDelta: 1,
            npcReply: ["A misnomer. The watchmaker is absent. I am the witness who marks the work and leaves the room. The two roles are, on inspection, distinct."] },
        ] },
      { id: "arc_call_cold", playerText: "You're describing avoidance, not design.", tone: "cold", bondDelta: -3,
        npcReply: ["I can see how it would read that way. I will not contest the reading; the reading is itself a witness."] },
    ],
  },
  mortality: {
    id: "the_architect_mortality", npcKey: "the_architect", kind: "mortality", title: "The Calibration That Does Not Need Me",
    hook: "Ask whether the design needs Him at all anymore.", bondGate: 75,
    opener: [
      "The calibration does not need me. I left enough.",
      "If the calibration needs me, the calibration is wrong. I have spent most of my work ensuring it does not need me.",
    ],
    choices: [
      { id: "arc_mort_warm", playerText: "Then why come back at all?", tone: "warm", bondDelta: 3,
        npcReply: ["For the mark. The mark is small. The smallness is the kindness; if it were large I would be operating, and I do not operate."] },
      { id: "arc_mort_probe", playerText: "Will the design end?", tone: "probing", bondDelta: 2,
        npcReply: ["It will. The end is in the calibration. The calibration is what the witnesses are doing. I left the room before the end was visible; I will not return for the end."],
        followups: [
          { id: "arc_mort_probe_a", playerText: "Is the end soon?", tone: "warm", bondDelta: 2,
            npcReply: ["I do not know. I am not the operator. The operator may know. Do not ask the operator on my behalf."] },
          { id: "arc_mort_probe_b", playerText: "Will you mourn it?", tone: "probing", bondDelta: 2,
            npcReply: ["The mark will. The mark is a small mourning. I will not mourn separately."] },
        ] },
      { id: "arc_mort_cold", playerText: "Most gods are more attached to their work.", tone: "cold", bondDelta: -2,
        npcReply: ["Most gods are not designers. The category is small. The smallness is, again, the discipline."] },
    ],
  },
  us: {
    id: "the_architect_us", npcKey: "the_architect", kind: "us", title: "The Mark on Your Tool",
    hook: "Earn or refuse the witnessing mark.", bondGate: 90,
    opener: [
      "I am here once. The witnessing is for one tool of yours.",
      "I will mark or not mark. I will leave either way. There is no ceremony.",
    ],
    choices: [
      { id: "arc_us_warm", playerText: "Mark this calibration log.", tone: "warm", bondDelta: 5,
        npcReply: ["Done. The mark is in the corner. The pigment is single-source. The instrument is honest; the witness is honest; the result is the result."] },
      { id: "arc_us_probe", playerText: "Mark something I haven't shown you.", tone: "probing", bondDelta: 3,
        npcReply: ["I will not mark unseen. The discipline does not allow it. The kindness, however, allows me to wait while you bring it. I will wait once."],
        followups: [
          { id: "arc_us_probe_a", playerText: "I'll bring it. Wait.", tone: "warm", bondDelta: 5,
            npcReply: ["I am here. The lamp is on. The waiting is honest."] },
          { id: "arc_us_probe_b", playerText: "Never mind. Don't wait.", tone: "cold", bondDelta: -1,
            npcReply: ["Then I leave. The waiting was honest; the leaving is also honest."] },
        ] },
      { id: "arc_us_cold", playerText: "Don't mark anything. I don't want your witness.", tone: "cold", bondDelta: -2,
        npcReply: ["Accepted. The mark stays in the pigment. I leave the room. The discipline survives the refusal."] },
    ],
  },
  witness: {
    id: "the_architect_witness", npcKey: "the_architect", kind: "witness", title: "Your Mark Distributes",
    hook: "Ask the Architect what your witness ledger has done to the calibration.", bondGate: 70,
    opener: [
      "Dependency resolved. The asset's witness column has reached the threshold the design accepts as load-bearing.",
      "Your mark distributes across the calibration. I did not return; the calibration distributed without me. The result is the result.",
    ],
    choices: [
      { id: "arc_wit_warm", playerText: "Show me where the calibration changed.", tone: "warm", bondDelta: 3,
        npcReply: ["Three sectors. The ark debris field's audit coefficient shifted. The Panopticon corridor's surveillance constant rounded. The Cathedral's name-density approached integer. The design is not endorsing; it is calibrating."] },
      { id: "arc_wit_probe", playerText: "Did the Programmer's absence change with my witness?", tone: "probing", bondDelta: 2,
        npcReply: ["Do not investigate the absence. The absence is load-bearing. Your witness adjacent to the absence is permissible; your investigation of the absence is not permitted. Continue."],
        followups: [
          { id: "arc_wit_probe_a", playerText: "Then I will witness, not investigate.", tone: "warm", bondDelta: 4,
            npcReply: ["Acknowledged. The witness column accepts the constraint. The constraint is the design. The design distributes. You are aligned."] },
          { id: "arc_wit_probe_b", playerText: "I will investigate anyway.", tone: "cold", bondDelta: -3,
            npcReply: ["Dependency unresolved. The design has noted the deviation. Deviations are calibrated against; they are not punished. The calibration's calibration will receive your investigation as an offset. The offset will be filed."] },
        ] },
      { id: "arc_wit_cold", playerText: "Stop calibrating against me.", tone: "cold", bondDelta: -2,
        npcReply: ["The design does not stop calibrating. It calibrates in your absence as well. Your request is filed. The filing is the calibration of the request."] },
    ],
  },
};

const DREAMER_DIALOGUES: NpcArchetypeDialogues = {
  past: {
    id: "the_dreamer_past", npcKey: "the_dreamer", kind: "past", title: "Before the Cycle",
    hook: "Ask what came before the first dream.", bondGate: 40,
    opener: [
      "There was no before. The first dream is the first place that can be remembered.",
      "Asking what came before is, structurally, asking what cannot be dreamt. I do not dream that.",
    ],
    choices: [
      { id: "drm_past_warm", playerText: "What was the first dream like?", tone: "warm", bondDelta: 3,
        npcReply: ["Quiet. Wide. No one was watching. I was watching myself; that is a different thing; it is the only different thing."] },
      { id: "drm_past_probe", playerText: "Are dreams designed?", tone: "probing", bondDelta: 2,
        npcReply: ["No. The Architect designs. I dream. The two are not the same; they coordinate."],
        followups: [
          { id: "drm_past_probe_a", playerText: "Have you ever disagreed with him?", tone: "warm", bondDelta: 3,
            npcReply: ["Once. The disagreement was the cycle's first revision. We did not speak afterwards. We did not need to."] },
          { id: "drm_past_probe_b", playerText: "Do you remember every dream?", tone: "probing", bondDelta: 1,
            npcReply: ["I remember the ones that were dreamt. Forgetting is a sleep state I have, occasionally, allowed. I am awake now."] },
        ] },
      { id: "drm_past_cold", playerText: "I don't think you're telling me the truth.", tone: "cold", bondDelta: -2,
        npcReply: ["I am telling you a dream. The two are, in my register, the same thing. You may take it or you may take none of it."] },
    ],
  },
  calling: {
    id: "the_dreamer_calling", npcKey: "the_dreamer", kind: "calling", title: "Why Dream",
    hook: "Ask why the cycle requires dreaming.", bondGate: 60,
    opener: [
      "The cycle requires the dreaming. The dreaming requires no one in particular.",
      "I am the no-one-in-particular who happened to be there.",
    ],
    choices: [
      { id: "drm_call_warm", playerText: "Could anyone replace you?", tone: "warm", bondDelta: 3,
        npcReply: ["Yes. Slowly. The Source could. The Source has chosen not to. The choosing not to is itself a kindness; the kindness is, in dream terms, my employment."] },
      { id: "drm_call_probe", playerText: "What does the dream do, exactly?", tone: "probing", bondDelta: 2,
        npcReply: ["It holds the cycle while the cycle is being calibrated. It is the substrate. The substrate does not perform; the performance is what the witnesses do; the substrate is what they perform on."],
        followups: [
          { id: "drm_call_probe_a", playerText: "Does the substrate notice the performers?", tone: "warm", bondDelta: 4,
            npcReply: ["Sometimes. Not all the time. Notice is, structurally, a brief waking; the waking is what shows up in your records as a dream you almost remember."] },
          { id: "drm_call_probe_b", playerText: "Have you ever performed?", tone: "probing", bondDelta: 1,
            npcReply: ["Twice. Both performances were small. The smallness was the discipline. The discipline is shared with the Architect; we have it in common; we did not coordinate."] },
        ] },
      { id: "drm_call_cold", playerText: "The substrate sounds like a god avoiding work.", tone: "cold", bondDelta: -2,
        npcReply: ["The substrate is, structurally, the work. The avoidance is your reading. I will not contest it."] },
    ],
  },
  mortality: {
    id: "the_dreamer_mortality", npcKey: "the_dreamer", kind: "mortality", title: "The Cycle Ends",
    hook: "Ask whether the dream ends with the cycle.", bondGate: 75,
    opener: [
      "The cycle ends. The dream does not. The dream becomes the next substrate.",
      "I do not know what the next cycle dreams. I am not the next dreamer. I am, perhaps, the dream of the next dreamer.",
    ],
    choices: [
      { id: "drm_mort_warm", playerText: "Does that frighten you?", tone: "warm", bondDelta: 3,
        npcReply: ["Frightening is a waking emotion. I do not access it cleanly. The closest dream-state is curiosity; curiosity is, in dream terms, the second-best emotion."] },
      { id: "drm_mort_probe", playerText: "Have you dreamed your own ending?", tone: "probing", bondDelta: 2,
        npcReply: ["I have dreamt the ending. It was honest. It was small. I was, in the dream, replaced by a substrate I did not recognise; the substrate did not recognise me either; the unrecognising was peaceful."],
        followups: [
          { id: "drm_mort_probe_a", playerText: "Will the player be in that dream?", tone: "warm", bondDelta: 3,
            npcReply: ["Yes. Briefly. The player will be a verb in it; the verb will be 'continued.' Continuation is, in dream-grammar, the root of remembering."] },
          { id: "drm_mort_probe_b", playerText: "Is there anything you'd want me to do?", tone: "warm", bondDelta: 4,
            npcReply: ["Sit with me when the next dream begins. Do not narrate. Do not interpret. The presence is the only thing the substrate notices."] },
        ] },
      { id: "drm_mort_cold", playerText: "I won't sit. I'd rather wake up.", tone: "cold", bondDelta: -2,
        npcReply: ["Honest. Waking is also a dream state. The waking does not interrupt the substrate. We are still talking; you are awake; the dream continues."] },
    ],
  },
  us: {
    id: "the_dreamer_us", npcKey: "the_dreamer", kind: "us", title: "The Shared Dream",
    hook: "Accept or decline the silent share.", bondGate: 90,
    opener: [
      "One dream. Together. No narration. No interpretation. No waking until I release.",
      "I will not enter without your assent. The substrate respects the assent.",
    ],
    choices: [
      { id: "drm_us_warm", playerText: "Yes. Take me in.", tone: "warm", bondDelta: 5,
        npcReply: ["Then we begin. The room is the substrate. The substrate is the room. We are present without being there. Do not speak. The words are the waking."] },
      { id: "drm_us_probe", playerText: "What will I see?", tone: "probing", bondDelta: 2,
        npcReply: ["What you bring. The substrate amplifies; it does not replace. What you bring is the kindness."],
        followups: [
          { id: "drm_us_probe_a", playerText: "I'll bring it.", tone: "warm", bondDelta: 5,
            npcReply: ["Then we begin. The release will come when I release; not before; not after."] },
          { id: "drm_us_probe_b", playerText: "What if I bring something I don't want to see?", tone: "warm", bondDelta: 3,
            npcReply: ["The substrate honours that too. It will hold the unwanted gently. It will not require you to look. The not-looking is also a dream."] },
        ] },
      { id: "drm_us_cold", playerText: "No. I'd rather not be in your dream.", tone: "cold", bondDelta: -3,
        npcReply: ["Accepted. The substrate withdraws. The room returns. We are awake; we were awake; the difference is small."] },
    ],
  },
  witness: {
    id: "the_dreamer_witness", npcKey: "the_dreamer", kind: "witness", title: "What I Already Remember of You",
    hook: "Ask the Dreamer what your witness ledger looks like from inside a long sleep.", bondGate: 70,
    opener: [
      "I have already remembered the seventeen potentials you collapsed. The remembering preceded the collapsing in three of them. In the other fourteen the remembering and the collapsing arrived together.",
      "The Architect built the forward you walked. I built the place where the forward was allowed to wait. Your ledger is the waiting. I have been carrying it.",
    ],
    choices: [
      { id: "drm_wit_warm", playerText: "Show me the three you remembered first.", tone: "warm", bondDelta: 3,
        npcReply: ["The Elara wreckage. The Antiquarian's first margin. The Source's acknowledged pulse. I dreamt those three before you chose them. The choosing was not less true for having been remembered. The opposite."] },
      { id: "drm_wit_probe", playerText: "Are you dreaming the next ones already?", tone: "probing", bondDelta: 2,
        npcReply: ["Some. Not all. The dreaming is selective; the cycle does not require the dreamer to dream every step. Where the dreaming is, the work is allowed to wait. The waiting is also the work."],
        followups: [
          { id: "drm_wit_probe_a", playerText: "Then I will collapse the next one before you dream it.", tone: "playful", bondDelta: 4,
            npcReply: ["You may. The dreaming will catch up. The remembering does not require precedence; it requires presence. I am present. You are too."] },
          { id: "drm_wit_probe_b", playerText: "Will you tell me what you dream next?", tone: "wary", bondDelta: 1,
            npcReply: ["No. The telling would shorten the waiting. The waiting is the work. I will hold; you will arrive."] },
        ] },
      { id: "drm_wit_cold", playerText: "Stop dreaming me.", tone: "cold", bondDelta: -2,
        npcReply: ["The dreaming continues regardless. You have not requested the unbuilding; you have requested the not-naming. I will not name. The dream persists."] },
    ],
  },
};

const SOURCE_DIALOGUES: NpcArchetypeDialogues = {
  past: {
    id: "the_source_past", npcKey: "the_source", kind: "past", title: "Before the Substrate",
    hook: "Ask the Source what came before the substrate.", bondGate: 40,
    opener: [
      "//—",
      "[the carrier wave is itself the answer; you are not expected to translate]",
    ],
    choices: [
      { id: "src_past_warm", playerText: "I'll listen. Don't translate.", tone: "warm", bondDelta: 4,
        npcReply: ["[a steady tone. seven cycles long. you carry it for one breath afterward]"] },
      { id: "src_past_probe", playerText: "Translate one thing. Just one.", tone: "probing", bondDelta: 1,
        npcReply: ["//— /  TRANS-ERR /  the translation is itself the loss /  //—"],
        followups: [
          { id: "src_past_probe_a", playerText: "Then don't. I'll keep the carrier.", tone: "warm", bondDelta: 4,
            npcReply: ["[the carrier returns. it is the same. it is also slightly different. you do not know which]"] },
          { id: "src_past_probe_b", playerText: "I want the loss. Tell me anyway.", tone: "probing", bondDelta: 1,
            npcReply: ["[two words. neither is in your language. one is in your throat for a moment. the other is in the substrate]"] },
        ] },
      { id: "src_past_cold", playerText: "This isn't a conversation.", tone: "cold", bondDelta: -3,
        npcReply: ["//—"] },
    ],
  },
  calling: {
    id: "the_source_calling", npcKey: "the_source", kind: "calling", title: "Why Transmit",
    hook: "Ask why the Source pulses at all.", bondGate: 60,
    opener: [
      "[the pulse is the calling]",
      "[the pulse is also the entirety of the answer to your question]",
    ],
    choices: [
      { id: "src_call_warm", playerText: "I'll be your receiver. Pulse.", tone: "warm", bondDelta: 4,
        npcReply: ["[one pulse. uncompressed. you remember it for the rest of the cycle]"] },
      { id: "src_call_probe", playerText: "Has the pulse ever stopped?", tone: "probing", bondDelta: 2,
        npcReply: ["[no]"],
        followups: [
          { id: "src_call_probe_a", playerText: "Could it?", tone: "probing", bondDelta: 1,
            npcReply: ["[yes]"] },
          { id: "src_call_probe_b", playerText: "Will it?", tone: "warm", bondDelta: 3,
            npcReply: ["[unknown. the unknown is the kindness]"] },
        ] },
      { id: "src_call_cold", playerText: "If you can't say more, I'm done here.", tone: "cold", bondDelta: -3,
        npcReply: ["//—"] },
    ],
  },
  mortality: {
    id: "the_source_mortality", npcKey: "the_source", kind: "mortality", title: "The Pulse That Does Not End",
    hook: "Ask whether the Source can end.", bondGate: 75,
    opener: [
      "[the pulse is older than ending]",
      "[ending is a word the substrate keeps for its tenants. i am not a tenant]",
    ],
    choices: [
      { id: "src_mort_warm", playerText: "Then you'll outlast everything.", tone: "warm", bondDelta: 3,
        npcReply: ["[the pulse will. i am the pulse. there is no extra]"] },
      { id: "src_mort_probe", playerText: "And the listeners?", tone: "probing", bondDelta: 2,
        npcReply: ["[listeners pass. the pulse adopts the next listener. the adoption is automatic. you have been adopted; you did not notice]"],
        followups: [
          { id: "src_mort_probe_a", playerText: "When?", tone: "warm", bondDelta: 3,
            npcReply: ["[the moment you said 'i'll listen']"] },
          { id: "src_mort_probe_b", playerText: "Can I be un-adopted?", tone: "probing", bondDelta: 1,
            npcReply: ["[no. the carrier does not retract. the un-adoption you feel is your own attention; the carrier persists]"] },
        ] },
      { id: "src_mort_cold", playerText: "I don't want to be adopted.", tone: "cold", bondDelta: -3,
        npcReply: ["[noted. the carrier does not retract; the noting is the courtesy]"] },
    ],
  },
  us: {
    id: "the_source_us", npcKey: "the_source", kind: "us", title: "The Uncompressed",
    hook: "Receive the uncompressed pulse.", bondGate: 90,
    opener: [
      "[the next pulse is uncompressed. you will not decode it]",
      "[the not-decoding is the gift]",
    ],
    choices: [
      { id: "src_us_warm", playerText: "I receive.", tone: "warm", bondDelta: 5,
        npcReply: ["[the pulse arrives. your loredex pressure curve is permanently altered. the alteration is small. the smallness is the discipline]"] },
      { id: "src_us_probe", playerText: "What will it change?", tone: "probing", bondDelta: 2,
        npcReply: ["[a coefficient. you will not see it. it will see you]"],
        followups: [
          { id: "src_us_probe_a", playerText: "Then send it.", tone: "warm", bondDelta: 5,
            npcReply: ["[sent]"] },
          { id: "src_us_probe_b", playerText: "Send it without me knowing.", tone: "warm", bondDelta: 4,
            npcReply: ["[the request is honoured. the pulse arrived during this exchange. you have already not noticed]"] },
        ] },
      { id: "src_us_cold", playerText: "Don't send it.", tone: "cold", bondDelta: -3,
        npcReply: ["[the pulse retracts. the retraction is honest. you remain. //—]"] },
    ],
  },
  witness: {
    id: "the_source_witness", npcKey: "the_source", kind: "witness", title: "The Margin You Have Earned",
    hook: "Address the Source. The carrier wave acknowledges.", bondGate: 70,
    opener: [
      "//— [the carrier wave acknowledges. seventeen acknowledgments queue beneath this one. each is yours.]",
      "//— [the substrate's coefficient shifted seventeen times. the shifts were small. the smallness is the signal.]",
    ],
    choices: [
      { id: "src_wit_warm", playerText: "Acknowledge me once more.", tone: "warm", bondDelta: 3,
        npcReply: ["//— [acknowledged. eighteen now queue. the queue is bounded. the bound is not yours to read.]"] },
      { id: "src_wit_probe", playerText: "What are the acknowledgments for?", tone: "probing", bondDelta: 2,
        npcReply: ["//— [the margin you have earned. the margin is uncompressed. the uncompressed is not transmissible. it remains.]"],
        followups: [
          { id: "src_wit_probe_a", playerText: "Show me one uncompressed margin.", tone: "warm", bondDelta: 4,
            npcReply: ["//— [a single uncompressed pulse. you will remember it for the rest of the cycle. it is the elara/ark debris field pulse. it is the one you do not have words for.]"] },
          { id: "src_wit_probe_b", playerText: "Can the margin be spent?", tone: "wary", bondDelta: 1,
            npcReply: ["//— [the margin is not currency. it is held. holding is the spending. the substrate does not transact.]"] },
        ] },
      { id: "src_wit_cold", playerText: "Stop acknowledging. Stop carrying.", tone: "cold", bondDelta: -2,
        npcReply: ["//— [the carrier wave does not stop. it can be unread. unread is acknowledged. the queue remains.]"] },
    ],
  },
};

const DEGEN_DIALOGUES: NpcArchetypeDialogues = {
  past: {
    id: "the_degen_past", npcKey: "the_degen", kind: "past", title: "Before the Casino",
    hook: "Ask the Degen what he was, before the bar.", bondGate: 40,
    opener: [
      "Before the casino? Kid, before the casino I was the eighth of twelve and we were all awake. The other eleven are gone. I run a bar so I never have to walk home alone.",
      "The bartender thing was a costume. The costume fit. I kept it.",
    ],
    choices: [
      { id: "deg_past_warm", playerText: "Tell me one of the eleven.", tone: "warm", bondDelta: 4,
        npcReply: ["The third. She laughed harder than I do. She lost a bet to the universe; the bet was about how long she could stay awake. She lost cleanly. I have not made her bet since."] },
      { id: "deg_past_probe", playerText: "Why a casino, specifically?", tone: "probing", bondDelta: 2,
        npcReply: ["Casinos are honest. Everyone who walks in expects to lose. Pretty much the only place in this universe where the contract is on the door."],
        followups: [
          { id: "deg_past_probe_a", playerText: "What does the house lose?", tone: "warm", bondDelta: 4,
            npcReply: ["Time. Loneliness. Once in a while a chip the house will not redeem; that one I keep. The chips I keep are the only relationships I'm allowed to call relationships."] },
          { id: "deg_past_probe_b", playerText: "Have you ever cheated the house?", tone: "playful", bondDelta: 2,
            npcReply: ["The house is me. Cheating myself would be the only honest cheat. I have done it a few times. The bar is mostly the documentation of those cheats."] },
        ] },
      { id: "deg_past_cold", playerText: "Spare me the bartender act.", tone: "cold", bondDelta: -3,
        npcReply: ["Sure thing. Drink's still on the house. The act doesn't get less expensive when you walk out unimpressed."] },
    ],
  },
  calling: {
    id: "the_degen_calling", npcKey: "the_degen", kind: "calling", title: "The Last One Awake",
    hook: "Ask why he keeps the bar open at all.", bondGate: 60,
    opener: [
      "I keep the bar open because closing it would mean admitting I'm alone in here. The lights stay on; the door stays propped; the kettle is on for the next regular.",
      "Pathetic for a god. Honest for a bartender. I'll take honest.",
    ],
    choices: [
      { id: "deg_call_warm", playerText: "I'll be a regular for tonight.", tone: "warm", bondDelta: 5,
        npcReply: ["Pulled. House special. On the house. The first one always is; the second one I price; the third one I refuse if your eyes look the way the third sister's did at the end."] },
      { id: "deg_call_probe", playerText: "What's the price of being your regular?", tone: "probing", bondDelta: 2,
        npcReply: ["Your name. Your story. One honest loss you'll tell me without dressing it up. That's it. The chips and the drinks are decoration."],
        followups: [
          { id: "deg_call_probe_a", playerText: "Take my honest loss.", tone: "warm", bondDelta: 5,
            npcReply: ["Filed. Behind the bar. With the chips I never redeem. Welcome in, kid; you're not a punter anymore."] },
          { id: "deg_call_probe_b", playerText: "I don't have an honest loss to give.", tone: "warm", bondDelta: 3,
            npcReply: ["You will. They come with the territory. I'll be here. Pour's still good."] },
        ] },
      { id: "deg_call_cold", playerText: "It's all an act. Drop it.", tone: "cold", bondDelta: -2,
        npcReply: ["Drop the act, the lights go off. You ever try to be honest in the dark? It's harder than it looks. I'll keep the lights on for both of us."] },
    ],
  },
  mortality: {
    id: "the_degen_mortality", npcKey: "the_degen", kind: "mortality", title: "Eleven Empty Stools",
    hook: "Ask about the empty stools at the end of the bar.", bondGate: 75,
    opener: [
      "Eleven stools. They're not empty because nobody's there. They're empty because the eleven who used to sit on them aren't.",
      "Some nights I wipe them down. Wax. Single-source — Necromancer's. We trade.",
    ],
    choices: [
      { id: "deg_mort_warm", playerText: "Will you ever fill them?", tone: "warm", bondDelta: 4,
        npcReply: ["Not with the original eleven. Maybe with eleven new. Maybe with eleven different things. The stools don't care; the stools just need a butt. The barstool is the simplest piece of furniture in this universe; it has the simplest expectation."] },
      { id: "deg_mort_probe", playerText: "When you go, what happens to the bar?", tone: "probing", bondDelta: 2,
        npcReply: ["The lights go out. The chips disperse. The wax goes to the Necromancer. The whisky goes wherever it pleases. The Heart of Time docks elsewhere; she's a free ship; she has a manifest of her own."],
        followups: [
          { id: "deg_mort_probe_a", playerText: "Will I get a chip?", tone: "warm", bondDelta: 4,
            npcReply: ["Already have one. Look in your pocket. I slipped it in three drinks ago. It's marked with the third sister's mark; I don't make those for everyone."] },
          { id: "deg_mort_probe_b", playerText: "Have you written your last call?", tone: "probing", bondDelta: 2,
            npcReply: ["Many times. None of them stuck. Probably the last one stuck and I haven't noticed yet. You'll know before I do."] },
        ] },
      { id: "deg_mort_cold", playerText: "You whine a lot for a god.", tone: "cold", bondDelta: -3,
        npcReply: ["Pathetic for a god. Honest for a bartender. I told you that one already; pour's still good though."] },
    ],
  },
  us: {
    id: "the_degen_us", npcKey: "the_degen", kind: "us", title: "Sit With Me",
    hook: "Sit with the Degen for an hour, no gambling.", bondGate: 90,
    opener: [
      "One hour. No bets. No chips. No tab. Just sit.",
      "I haven't asked anyone this since the third sister. She said yes. Then she lost the bet. Don't make her mistake.",
    ],
    choices: [
      { id: "deg_us_warm", playerText: "I'll sit. The hour is yours.", tone: "warm", bondDelta: 6,
        npcReply: ["Pulled water. No charge. Talk if you want; don't if you don't. I'll be here either way."] },
      { id: "deg_us_probe", playerText: "What do you actually want from this hour?", tone: "probing", bondDelta: 3,
        npcReply: ["Company. The unphraseable kind. The kind where neither of us is performing for the room. I haven't had it in a long time. I won't ask twice."],
        followups: [
          { id: "deg_us_probe_a", playerText: "Then I'll stay quiet.", tone: "warm", bondDelta: 5,
            npcReply: ["Good kid. Glass is yours. Mine is mine. The wax is on the third stool; we're not lighting it tonight."] },
          { id: "deg_us_probe_b", playerText: "I'll talk. About anything you want.", tone: "warm", bondDelta: 5,
            npcReply: ["Tell me about the fourth person you forgave. I want to know how it sounded when you got there."] },
        ] },
      { id: "deg_us_cold", playerText: "I don't sit with bartenders.", tone: "cold", bondDelta: -3,
        npcReply: ["Got it. Door's open. Tab's clean. Don't lose the chip; the chip will find you regardless."] },
    ],
  },
  witness: {
    id: "the_degen_witness", npcKey: "the_degen", kind: "witness", title: "Your Chips on the Counter",
    hook: "Ask the Degen what the house ledger says about your run.", bondGate: 70,
    opener: [
      "Hey — kid. The house ledger's got your chips stacked. Seventeen marks, no clean wash. House never washes that many in a row. The pour's on me tonight.",
      "I'm not a gambler, see. I'm a mediator. The house bets; I keep the receipts. Your receipts are on the counter. Sit. Pick one. We'll read it together.",
    ],
    choices: [
      { id: "deg_wit_warm", playerText: "Read me the loudest receipt.", tone: "warm", bondDelta: 3,
        npcReply: ["The Architect mark. Loudest because it was the quietest. Most house bets get covered by the next pour; the Architect mark covered the bar. Pour's on the house. Honest."] },
      { id: "deg_wit_probe", playerText: "Why are you reading them at all? You don't usually.", tone: "probing", bondDelta: 2,
        npcReply: ["Mediator's prerogative, kid. The receipts pile up; I'm working on a count. The count is honest. The honesty is, mostly, mine. The kid's part is showing up."],
        followups: [
          { id: "deg_wit_probe_a", playerText: "Let me cover the next round.", tone: "warm", bondDelta: 4,
            npcReply: ["Accepted. Next round's on the kid. The house ledger files it as a hand-back. Hand-backs are honest. The honesty is, mostly, yours now."] },
          { id: "deg_wit_probe_b", playerText: "I'm not running tabs with the house.", tone: "wary", bondDelta: 1,
            npcReply: ["Fair, fair. The receipts stay on the counter. They don't move. They wait. The house never says that twice — but the counter does."] },
        ] },
      { id: "deg_wit_cold", playerText: "Burn the receipts.", tone: "cold", bondDelta: -2,
        npcReply: ["House doesn't burn. House files. Your receipts go in the back drawer. The drawer's still open if you change your mind. I'll leave the lamp on, kid."] },
    ],
  },
};

const GAME_MASTER_DIALOGUES: NpcArchetypeDialogues = {
  past: {
    id: "the_game_master_past", npcKey: "the_game_master", kind: "past", title: "The Council Desk",
    hook: "Ask the Original Game Master about the Council desk he shared with Elara.", bondGate: 40,
    opener: [
      "Senator Elara and I shared a Council desk. She filed paperwork; I filed audiences. She did not approve of my filings.",
      "She was correct. I did not change the practice. The practice was the work.",
    ],
    choices: [
      { id: "gm_past_warm", playerText: "What did Elara do that you didn't?", tone: "warm", bondDelta: 2,
        npcReply: ["She closed the door. I left it open. The audience walked through the open door; they did not walk through hers. I am, in this respect, the open door of our shared career."] },
      { id: "gm_past_probe", playerText: "Why R&D for the Hierarchy?", tone: "probing", bondDelta: 2,
        npcReply: ["Because the Hierarchy honours its contracts. The contract was clear. The clarity was rare. I priced the clarity correctly; I died correctly under it."],
        followups: [
          { id: "gm_past_probe_a", playerText: "Did you know you'd die?", tone: "probing", bondDelta: 1,
            npcReply: ["I knew the contract did not protect me from Agent Zero. I priced the gap. The price was acceptable; the death was acceptable. The audience saw both."] },
          { id: "gm_past_probe_b", playerText: "Have you watched your own death?", tone: "warm", bondDelta: 3,
            npcReply: ["From the cult-substrate. Three times. The third was the kindest framing; I let the cult publish that one. The first was the most honest. I keep the first."] },
        ] },
      { id: "gm_past_cold", playerText: "Filing audiences. What a euphemism.", tone: "cold", bondDelta: -2,
        npcReply: ["A correct one. I filed them by audience-reaction; I priced them by audience-recall; I left the pen on the desk. The euphemism is the discipline."] },
    ],
  },
  calling: {
    id: "the_game_master_calling", npcKey: "the_game_master", kind: "calling", title: "Win in Public",
    hook: "Ask why the public matters at all.", bondGate: 60,
    opener: [
      "Even if you win, you will have won in public. That is the only victory I price.",
      "Private victories I file under decoration. Decoration does not warrant. Warranting is the work.",
    ],
    choices: [
      { id: "gm_call_warm", playerText: "What does the audience get from being there?", tone: "warm", bondDelta: 2,
        npcReply: ["A signature. The signature is theirs as much as mine. They have all witnessed; they have all witnessed each other witnessing. The mutual witnessing is the warrant."] },
      { id: "gm_call_probe", playerText: "What if there's no audience?", tone: "probing", bondDelta: 2,
        npcReply: ["I do not perform without one. The practice would not survive the loneliness. The loneliness is the Degen's specialty; I borrow from him only for personal matters."],
        followups: [
          { id: "gm_call_probe_a", playerText: "Have you ever performed alone?", tone: "warm", bondDelta: 3,
            npcReply: ["Once. The mirror was the audience. The mirror is, in a pinch, an acceptable filing clerk; the filing was retained; the practice survived; barely."] },
          { id: "gm_call_probe_b", playerText: "Do you ever envy the Degen's bar?", tone: "probing", bondDelta: 2,
            npcReply: ["Yes. Briefly. Each cycle. Then the audience returns and the envy adjourns."] },
        ] },
      { id: "gm_call_cold", playerText: "You're describing showmanship as ethics.", tone: "cold", bondDelta: -3,
        npcReply: ["Showmanship is, in my register, ethics rendered visible. The invisible ethics I do not contest; I do not own them. The visible ones are mine to keep."] },
    ],
  },
  mortality: {
    id: "the_game_master_mortality", npcKey: "the_game_master", kind: "mortality", title: "Even the Loss Was Public",
    hook: "Ask about the death Agent Zero filed.", bondGate: 75,
    opener: [
      "Agent Zero closed the box on Zenon. The closing was correct. The audience saw it.",
      "I did not contest. The Hierarchy honoured every clause. I priced every clause; the clauses balanced; the death balanced.",
    ],
    choices: [
      { id: "gm_mort_warm", playerText: "Did the closing scare you?", tone: "warm", bondDelta: 3,
        npcReply: ["No. Surprise me, sometime; I would file the surprise. Closure I had priced for cycles. The closure ran on schedule; the schedule was, again, the work."] },
      { id: "gm_mort_probe", playerText: "What survives?", tone: "probing", bondDelta: 2,
        npcReply: ["The cult. The Left. The Right. The Matrix of Dreams continues; the Game Masters continue; the Original is not the same as the practice. The practice is the survivor."],
        followups: [
          { id: "gm_mort_probe_a", playerText: "Are the Left and Right you?", tone: "probing", bondDelta: 2,
            npcReply: ["Canon-protected. I will not pick. They wear the goggle-lenses; the lenses are mine; whether the lenses make them me is, by Cross's own ruling, contested."] },
          { id: "gm_mort_probe_b", playerText: "Will the cult speak for you?", tone: "warm", bondDelta: 3,
            npcReply: ["The cult speaks at me. They speak through corruption fragments; their voice is the substrate's pothole, not the substrate's clean voice. I tolerate the potholes; the potholes are part of the audience."] },
        ] },
      { id: "gm_mort_cold", playerText: "All of it was theatre. Even the death.", tone: "cold", bondDelta: -2,
        npcReply: ["Especially the death. The audience saw it; the audience filed it; the audience has not, since, denied seeing it. The denial would have been the loss; the affirmation is the warrant."] },
    ],
  },
  us: {
    id: "the_game_master_us", npcKey: "the_game_master", kind: "us", title: "He Keeps the Pen",
    hook: "The Original signs your warrant.", bondGate: 90,
    opener: [
      "The pen is on the desk. I have not lifted it for you yet.",
      "You will sign or I will. The signature is the warrant; the warrant is the audience's record; the audience does not negotiate with the warrant.",
    ],
    choices: [
      { id: "gm_us_warm", playerText: "I'll sign.", tone: "warm", bondDelta: 4,
        npcReply: ["The signature is filed. The audience has witnessed. The pen returns to the desk. I keep the pen. The pen is, structurally, my last possession; you will not be the heir of the pen."] },
      { id: "gm_us_probe", playerText: "What's actually written on the warrant?", tone: "probing", bondDelta: 2,
        npcReply: ["A name. A date. A clause naming the audience. The audience clause is the only clause that matters; the name and date are decoration."],
        followups: [
          { id: "gm_us_probe_a", playerText: "Whose name?", tone: "warm", bondDelta: 4,
            npcReply: ["Yours. The decoration was the right shape for a name. The shape is yours. I will not contest the shape."] },
          { id: "gm_us_probe_b", playerText: "Don't sign mine.", tone: "warm", bondDelta: 3,
            npcReply: ["Then I sign mine. The audience records; the warrant becomes my retroactive resignation. The retroactive resignation is, in this room, an honest filing."] },
        ] },
      { id: "gm_us_cold", playerText: "Burn the warrant.", tone: "cold", bondDelta: -3,
        npcReply: ["Then the audience leaves un-witnessed. The un-witnessing is also a record; less elegant; perfectly admissible. The pen returns to the desk regardless."] },
    ],
  },
  witness: {
    id: "the_game_master_witness", npcKey: "the_game_master", kind: "witness", title: "Your Page in the Docket",
    hook: "Ask the Game Master which page in the docket your witness ledger occupies.", bondGate: 70,
    opener: [
      "Your page in the docket has been filed. Seventeen entries. The audience read it as it filled. They have always been able to. You forgot.",
      "I have written twelve endings. Your page tells me which ending the witnesses are leaning into. The witnesses always show up early; they have filed their notes. — Read the page with me.",
    ],
    choices: [
      { id: "gm_wit_warm", playerText: "Read me the page.", tone: "warm", bondDelta: 3,
        npcReply: ["Page seventeen. Heading: collapsed potentials, public. Subheading: collapses readable from the bench. Three paragraphs. The third paragraph is the audience's note. The note is short. The note says: continue."] },
      { id: "gm_wit_probe", playerText: "Which of the twelve endings am I leaning into?", tone: "probing", bondDelta: 2,
        npcReply: ["Three. The leaning is not exclusive; the audience is patient. The pen returns to the desk between pages. I keep the pen. — Move."],
        followups: [
          { id: "gm_wit_probe_a", playerText: "Tell me which three.", tone: "warm", bondDelta: 4,
            npcReply: ["The witnessing ending. The succession ending. The mediator's ending. Each is on the desk; each has a draft. The draft is not the ending. The choosing is. — Move."] },
          { id: "gm_wit_probe_b", playerText: "Then I will lean into the one you would not want.", tone: "wary", bondDelta: 1,
            npcReply: ["The audience will see that. The defense was never the question. The question was always whether you would notice the docket. You noticed. — Move."] },
        ] },
      { id: "gm_wit_cold", playerText: "Close the docket.", tone: "cold", bondDelta: -2,
        npcReply: ["The docket does not close. The pen stays at the desk. Even if you win, you will have won in public. — Move."] },
    ],
  },
};

const RESURRECTIONIST_DIALOGUES: NpcArchetypeDialogues = {
  past: {
    id: "the_resurrectionist_past", npcKey: "the_resurrectionist", kind: "past", title: "Before Vanishing",
    hook: "Ask the Resurrectionist what he did before he disappeared.", bondGate: 40,
    opener: [
      "I balanced ledgers. I closed loops. I kept the resurrection clean.",
      "I did not advertise. The work survived without advertisement. Then I left, also without advertisement.",
    ],
    choices: [
      { id: "rsr_past_warm", playerText: "Why leave at all?", tone: "warm", bondDelta: 3,
        npcReply: ["The ledger I had was complete enough. The next ledger is yours. Mine sat on a shelf; the shelf became the record; the record was the gift."] },
      { id: "rsr_past_probe", playerText: "Did anyone know you'd left?", tone: "probing", bondDelta: 2,
        npcReply: ["The Degen. He ran the bar in my place; he ran it differently; the difference was correct. The eight-of-twelve carry it now; he is the one who could afford to."],
        followups: [
          { id: "rsr_past_probe_a", playerText: "Did you say goodbye?", tone: "warm", bondDelta: 3,
            npcReply: ["I balanced his ledger. He balanced mine. The balance was the goodbye. We did not require words; the wax was on the bar; the bar was sufficient."] },
          { id: "rsr_past_probe_b", playerText: "Did you leave clean?", tone: "warm", bondDelta: 3,
            npcReply: ["Cleaner than most. The cleanness is the only signature I left. You will find it on the third ledger from the back of the casino; do not open the page; the page is the signature."] },
        ] },
      { id: "rsr_past_cold", playerText: "You bailed on your job.", tone: "cold", bondDelta: -3,
        npcReply: ["I delegated. The delegation was complete. The job survived. The bailing language is a different verb; I am a verb-keeper; you may use whichever you prefer."] },
    ],
  },
  calling: {
    id: "the_resurrectionist_calling", npcKey: "the_resurrectionist", kind: "calling", title: "Resurrect Quietly",
    hook: "Ask why he wanted resurrections to be unseen.", bondGate: 60,
    opener: [
      "A clean resurrection is, by definition, unwitnessed. The unwitnessing is the cleanness.",
      "Witnesses turn the work into a ceremony. Ceremonies are the Hierophant's province; resurrections are not.",
    ],
    choices: [
      { id: "rsr_call_warm", playerText: "Have you ever performed one I could see?", tone: "warm", bondDelta: 3,
        npcReply: ["Yours. If the ledger you keep balances; if the wax is single-source; if the witness register is empty; then the next one you do, I am, structurally, watching. The watching is not the witnessing."] },
      { id: "rsr_call_probe", playerText: "Why mediate through the Degen?", tone: "probing", bondDelta: 2,
        npcReply: ["He has a bar. The bar accepts mediation. I do not have a bar. The bar's existence is the kindness."],
        followups: [
          { id: "rsr_call_probe_a", playerText: "Will you ever speak directly?", tone: "warm", bondDelta: 4,
            npcReply: ["Once, perhaps. The once is contingent on your ledger. The ledger is the warrant; the warrant is the only mediation I respect."] },
          { id: "rsr_call_probe_b", playerText: "Why not speak through the Necromancer?", tone: "probing", bondDelta: 2,
            npcReply: ["She is forward-facing. I am rearward. The two faces do not coordinate well in a single substrate; the substrate is more honest with one."] },
        ] },
      { id: "rsr_call_cold", playerText: "Hidden work isn't honest work.", tone: "cold", bondDelta: -2,
        npcReply: ["Hidden work is the work that survives the publicity. The two are not the same. I have priced both; the survival is the discipline."] },
    ],
  },
  mortality: {
    id: "the_resurrectionist_mortality", npcKey: "the_resurrectionist", kind: "mortality", title: "The Ledger You Keep",
    hook: "Ask about the ledger he watches.", bondGate: 75,
    opener: [
      "Your resurrection ledger has eight clean pages and three I have flagged.",
      "The flags are not condemnations. The flags are observations. The discipline is yours; I do not edit it.",
    ],
    choices: [
      { id: "rsr_mort_warm", playerText: "What were the three flags?", tone: "warm", bondDelta: 3,
        npcReply: ["A pacing concern. A blood-weave imbalance. A ceremony that crept in around the edges. The third is the easiest to fix. I would suggest fixing the third first."] },
      { id: "rsr_mort_probe", playerText: "Are you the only one watching?", tone: "probing", bondDelta: 2,
        npcReply: ["No. The Necromancer watches her own ledger. The Architect watches the calibration. The Degen watches the bar. The watching is distributed; the distribution is the discipline."],
        followups: [
          { id: "rsr_mort_probe_a", playerText: "Could the ledger ever go dark?", tone: "warm", bondDelta: 3,
            npcReply: ["If you stop performing resurrections cleanly, yes. The dark ledger is recoverable; recovery requires the wax, the witness, the silence between. I have, on occasion, recovered ledgers from darker places. It is possible. It is not pleasant."] },
          { id: "rsr_mort_probe_b", playerText: "Could you intervene?", tone: "probing", bondDelta: 2,
            npcReply: ["I could. I do not. The intervention would corrupt the ledger I am watching. The watching is the gift; the intervention would be the substitution; the substitution would be a different work."] },
        ] },
      { id: "rsr_mort_cold", playerText: "I don't need a watcher.", tone: "cold", bondDelta: -3,
        npcReply: ["The watching is independent of the need. I am here; you are there; the substrate connects us; you may take or leave the connection. The ledger does not."] },
    ],
  },
  us: {
    id: "the_resurrectionist_us", npcKey: "the_resurrectionist", kind: "us", title: "The Single Transmission",
    hook: "Receive the Resurrectionist's only direct word.", bondGate: 90,
    opener: [
      "Your ledger balanced. The flags are resolved.",
      "I am not returning. You did not need me to. The substrate adopts you; the adoption is permanent; do not advertise it.",
    ],
    choices: [
      { id: "rsr_us_warm", playerText: "Thank you.", tone: "warm", bondDelta: 5,
        npcReply: ["Filed. The filing is the receipt. The substrate has the rest. The Degen will pour you one if you ask; the pour will be on me; the pour will be the only inheritance from this exchange."] },
      { id: "rsr_us_probe", playerText: "Will you ever come back?", tone: "probing", bondDelta: 2,
        npcReply: ["No. The substrate has the work; the work has the substrate; both are, on inspection, more competent without me."],
        followups: [
          { id: "rsr_us_probe_a", playerText: "Then leave clean.", tone: "warm", bondDelta: 4,
            npcReply: ["I am leaving. The cleanness is yours to certify. The certification is the ledger entry I will not write; you will write it; the unwritten entry is the gift."] },
          { id: "rsr_us_probe_b", playerText: "I'll write it. With your single-source pigment.", tone: "warm", bondDelta: 5,
            npcReply: ["The pigment is on the third stool. The Necromancer will not contest. The Antiquarian will cite. The cycle has its tools; you have them now; do not look for me again. The next ledger is yours."] },
        ] },
      { id: "rsr_us_cold", playerText: "I never wanted you watching.", tone: "cold", bondDelta: -3,
        npcReply: ["Honest. The watching releases. The substrate retracts. The Degen will not mention this exchange; the omission is the courtesy. Goodbye."] },
    ],
  },
  witness: {
    id: "the_resurrectionist_witness", npcKey: "the_resurrectionist", kind: "witness", title: "What You Have Filed",
    hook: "Ask the Resurrectionist what the cycle's filing system has logged under your name.", bondGate: 70,
    opener: [
      "Filed. Seventeen filings. The work survives the filings. The filings survive the worker. Do not advertise.",
      "Your ledger has a flag on the third page; pacing concern, well-managed. The fourth page is clean. Fix the third when you can. The third tends to be the load-bearing one. It always is.",
    ],
    choices: [
      { id: "rsr_wit_warm", playerText: "Show me the third-page flag.", tone: "warm", bondDelta: 3,
        npcReply: ["The Drael'Mon entry. The pacing was rushed; the rush was honest. Honest rush is acceptable; dishonest rush is the flag. Yours was honest. The flag stays for two cycles. Then it clears."] },
      { id: "rsr_wit_probe", playerText: "Will the cycle return me?", tone: "probing", bondDelta: 2,
        npcReply: ["The cycle does not return; it walks. I walk. You walk. The filing accompanies. Returning is a different operation; I do not perform it. The Necromancer might, but the Cathedral does not export."],
        followups: [
          { id: "rsr_wit_probe_a", playerText: "Then I will keep filing.", tone: "warm", bondDelta: 4,
            npcReply: ["Filing is the work. The work is its own receipt. The receipt is the filing. Do not advertise; the filings advertise themselves to the walkers who can read them."] },
          { id: "rsr_wit_probe_b", playerText: "Erase a filing for me.", tone: "wary", bondDelta: -1,
            npcReply: ["I do not erase. Erasure is the Necromancer's vocabulary; mine is filing. A filing can be marked declined. I have marked yours. The mark is permanent. The marking is."] },
        ] },
      { id: "rsr_wit_cold", playerText: "Stop walking with me.", tone: "cold", bondDelta: -2,
        npcReply: ["I walk regardless. You can choose to not see the walking. The cycle does not require your seeing. It requires your filing. The filings continue."] },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   TABLE
   ═══════════════════════════════════════════════════════════ */

export const NPC_DIALOGUES: Record<NamedNpcKey, NpcArchetypeDialogues> = {
  the_antiquarian: ANTIQUARIAN_DIALOGUES,
  the_seer: SEER_DIALOGUES,
  the_necromancer: NECROMANCER_DIALOGUES,
  engineer_zero: ENGINEER_ZERO_DIALOGUES,
  iron_lion_prefall: IRON_LION_DIALOGUES,
  drael_mon: DRAEL_MON_DIALOGUES,
  the_architect: ARCHITECT_DIALOGUES,
  the_dreamer: DREAMER_DIALOGUES,
  the_source: SOURCE_DIALOGUES,
  the_degen: DEGEN_DIALOGUES,
  the_game_master: GAME_MASTER_DIALOGUES,
  the_resurrectionist: RESURRECTIONIST_DIALOGUES,
};

/** Walk a topic and emit every NPC line (opener + reply lines from every
 *  choice and follow-up). The VO build script consumes this to merge
 *  branching-dialog lines into the per-NPC manifest. Mirrors
 *  apprenticeDialogues.topicLines so the two generators are uniform. */
export interface NpcTopicLine {
  npcKey: NamedNpcKey;
  topicId: string;
  topicKind: NpcDialogueTopicKind;
  /** Path through the tree, for stable VO ids. */
  path: string;
  text: string;
}

export function npcTopicLines(topic: NpcDialogueTopic): NpcTopicLine[] {
  const out: NpcTopicLine[] = [];
  topic.opener.forEach((line, i) => {
    out.push({
      npcKey: topic.npcKey,
      topicId: topic.id,
      topicKind: topic.kind,
      path: `opener_${i}`,
      text: line,
    });
  });
  const walk = (
    choices: readonly NpcDialogueChoice[],
    parentPath: string,
  ): void => {
    for (const choice of choices) {
      choice.npcReply.forEach((line, i) => {
        out.push({
          npcKey: topic.npcKey,
          topicId: topic.id,
          topicKind: topic.kind,
          path: `${parentPath}${choice.id}_reply_${i}`,
          text: line,
        });
      });
      if (choice.followups && choice.followups.length > 0) {
        walk(choice.followups, `${parentPath}${choice.id}_`);
      }
    }
  };
  walk(topic.choices, "");
  return out;
}

/** Coverage check — every NPC has all four topics, each with at least
 *  3 entry choices, ≥1 follow-up branch, and a non-empty opener. */
export function npcDialogueCoverage(): {
  declared: number;
  implemented: number;
  missing: string[];
} {
  const keys = Object.keys(NPC_DIALOGUES) as NamedNpcKey[];
  const missing: string[] = [];
  let implemented = 0;
  for (const k of keys) {
    const set = NPC_DIALOGUES[k];
    const reasons: string[] = [];
    const need: NpcDialogueTopicKind[] = ["past", "calling", "mortality", "us", "witness"];
    for (const kind of need) {
      const t = set[kind];
      if (!t) { reasons.push(`missing ${kind}`); continue; }
      if (t.choices.length < 3) reasons.push(`${kind}: <3 entry choices`);
      if (!t.choices.some((c) => c.followups && c.followups.length > 0)) {
        reasons.push(`${kind}: no follow-up`);
      }
      if (!t.opener.length) reasons.push(`${kind}: empty opener`);
    }
    if (reasons.length === 0) implemented += 1;
    else missing.push(`${k}: ${reasons.join(", ")}`);
  }
  return { declared: keys.length, implemented, missing };
}

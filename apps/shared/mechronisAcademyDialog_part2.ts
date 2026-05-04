/* ═══════════════════════════════════════════════════════
   MECHRONIS ACADEMY DIALOG — PART 2

   Authored DialogScene cues for the 11 non-keystone Mechronis
   episodes (M2-M12). M1 keystone lives in
   mechronisAcademyDialog.ts. Both files merge into the same
   registry.

   Voice discipline (per plan §1, §6, mechronisProfessors.ts):
     - Professors do not say "we" — there is no individual
       learning, only the network being student.
     - Each Professor's hiddenAgenda surfaces in the closing
       scene of their episode.
     - Veska, the Antiquarian, the Necromancer, the Oracle,
       and Zephyr-9 retain THEIR voices; they are not Professors,
       they are visiting / former-faculty / dropouts.
   ═══════════════════════════════════════════════════════ */

import type { DialogScene } from "./tcg-core/story/dialogBank";

/* ═══════════════════════════════════════════════════════
   M2 — APPLIED SURVEILLANCE (Professor Aoki)
   ═══════════════════════════════════════════════════════ */

const M2_SCENE_1_THE_TRIANGLE: DialogScene = {
  id: "mechronis_m2_scene_1_the_triangle",
  label: "M2 · Scene 1 — Observation Triangulation",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "Lecture Hall UMB-204. Twenty-eight students on stools arranged in " +
        "isoceles triangles of four. Professor Aoki stands very still at the " +
        "front, immaculate white suit, surgical mask. The third eye tattoo " +
        "between his brows does not blink. Aoki does not blink either.",
    },
    {
      speaker: "professor_aoki",
      mood: "guarded",
      text:
        "Three of you watch the fourth. The fourth never knows who. The fourth " +
        "is graded by what the three report. The three are graded by whether the " +
        "fourth's behavior matches the prediction. Begin.",
    },
    {
      speaker: "professor_aoki",
      mood: "guarded",
      text: "Never break eye contact. Never blink first. The discipline is the lesson. The lesson is the discipline.",
    },
  ],
};

const M2_SCENE_2_THE_AGENDA: DialogScene = {
  id: "mechronis_m2_scene_2_the_agenda",
  label: "M2 · Scene 2 — Hidden Agenda",
  kind: "cinematic",
  cues: [
    {
      speaker: "professor_aoki",
      mood: "guarded",
      text:
        "Class dismissed. The student who finished today's exercise will leave " +
        "this hall with a new habit. The habit will be: a watcher in the back of " +
        "your skull. That watcher is you. The watcher will not stop watching. " +
        "This is the curriculum. The real Watcher Archon enjoyed being seen. " +
        "I forbid it. There is a difference. You may go.",
    },
    {
      speaker: "the_dreamer",
      mood: "warm",
      text:
        "(only the player hears this — half-volume, half-hummed)\n" +
        "…you can also choose not to watch. He doesn't tell you that. I will. " +
        "Once. So you remember.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   M3 — THE TRADE EXERCISE (Curator Halverez)
   ═══════════════════════════════════════════════════════ */

const M3_SCENE_1_THE_QUESTION_PRICE: DialogScene = {
  id: "mechronis_m3_scene_1_the_question_price",
  label: "M3 · Scene 1 — Every Question Costs a Memory",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "RES-303. Curator Halverez stands behind a black-glass desk. He wears " +
        "gloves. The blue xenomorph mask he inherited from his predecessor " +
        "covers half his face. Behind him, a wall of small drawers, each labeled " +
        "with a date.",
    },
    {
      speaker: "curator_halverez",
      mood: "guarded",
      text:
        "Welcome to The Trade Exercise. The rules are simple. You will each " +
        "ask me one question. The answer will be precise and useful. The cost is " +
        "a memory of a prior answer — chosen by you, not me. Choose your questions.",
    },
    {
      speaker: "curator_halverez",
      mood: "guarded",
      text:
        "The student who learns the most by the end of class will have forgotten " +
        "the most. That is the bookkeeping. Every transaction balances. Begin.",
    },
  ],
};

const M3_SCENE_2_THE_AGENDA: DialogScene = {
  id: "mechronis_m3_scene_2_the_agenda",
  label: "M3 · Scene 2 — The Hidden Agenda",
  kind: "cinematic",
  cues: [
    {
      speaker: "curator_halverez",
      mood: "guarded",
      text:
        "You will leave today knowing more than when you arrived. You will also " +
        "have surrendered something you cannot now remember surrendering. This is " +
        "the training. Later, you will surrender pieces of enemies for the " +
        "Architect, and you will not feel the loss because the discipline has " +
        "been written into your reflexes here. The real Collector traded fairly. " +
        "I rig the exchanges. You have not noticed. You will not notice.",
    },
    {
      speaker: "the_dreamer",
      mood: "warm",
      text:
        "(under the closing bell, audible only to the player)\n" +
        "…what you forgot today — I kept a copy. Not for you to use. For you to " +
        "know that you didn't lose it. That's different. Hello, you.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   M4 — THE PATRON'S GAME (Lady Malkia)
   ═══════════════════════════════════════════════════════ */

const M4_SCENE_1_THE_EXAM_ROOM: DialogScene = {
  id: "mechronis_m4_scene_1_the_exam_room",
  label: "M4 · Scene 1 — The Exam Room",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "A small room, no windows, one chair, one table, one lamp. The lamp is " +
        "warm. The room is not. Lady Malkia is alone at the chair. The Patron — " +
        "an Architect-aligned proxy with a face Malkia cannot quite hold in " +
        "memory — stands at the edge of the lamplight.",
    },
    {
      speaker: "the_patron",
      mood: "guarded",
      text: "Lady Malkia. Tonight's Game has one rule: tell me a true thing about the Prince.",
    },
    {
      speaker: "the_seer",
      mood: "guarded",
      text: "He's a student.",
      internal: "True. Useless. Buys me a beat.",
    },
    {
      speaker: "the_patron",
      mood: "guarded",
      text: "More true. Try again.",
    },
    {
      speaker: "the_seer",
      mood: "guarded",
      text: "He draws barriers in his sketchbook. Real ones.",
    },
    {
      speaker: "the_patron",
      mood: "guarded",
      text:
        "Better. The exam continues. Three more truths, Lady Malkia. The score " +
        "is the depth of the truth. The grade is what is done with the score. " +
        "I am not telling you who reads this report. I am telling you that " +
        "someone does.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   M5 — THE NECROMANCER'S LECTURE
   ═══════════════════════════════════════════════════════ */

const M5_SCENE_1_THE_BUFFER: DialogScene = {
  id: "mechronis_m5_scene_1_the_buffer",
  label: "M5 · Scene 1 — The Consciousness Buffer",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "Years before he was exiled. The Necromancer is faculty. Tall, dark robes, " +
        "the small tired courtesy of someone who has died once and remembers it. " +
        "He stands at a chalkboard on which he has drawn a buffer diagram in " +
        "white chalk. Eight rectangles. Arrows.",
    },
    {
      speaker: "necromancer",
      mood: "reflective",
      text:
        "The Resurrection Protocol stores the dying consciousness in a buffer. " +
        "Eight slots. The buffer is not infinite. The buffer was never infinite. " +
        "Anyone who told you the buffer was infinite was lying or new.",
    },
    {
      speaker: "necromancer",
      mood: "reflective",
      text:
        "When the buffer fills, the oldest entry is overwritten. There are rules " +
        "about which entries earn the slot. The rules are political. I designed " +
        "them. I am still ashamed of the third one.",
    },
  ],
};

const M5_SCENE_2_HIS_OWN_DEATH: DialogScene = {
  id: "mechronis_m5_scene_2_his_own_death",
  label: "M5 · Scene 2 — His Own Death",
  kind: "cinematic",
  cues: [
    {
      speaker: "necromancer",
      mood: "broken",
      text:
        "I have died once. I came back. I came back wrong, in a way I won't " +
        "explain because the explanation makes the listener afraid of the wrong " +
        "things. Prestige is not a reward. Prestige is the price of the buffer. " +
        "If you choose to prestige, you choose to overwrite something. Something " +
        "of yours. Choose with discipline.",
    },
    {
      speaker: "necromancer",
      mood: "guarded",
      text: "Class dismissed. The Red Death is in the southern continent again. I have to leave early. Read chapters four through nine. There will be a quiz I will not be alive to grade.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   M6 — THE ANTIQUARIAN VISITS
   ═══════════════════════════════════════════════════════ */

const M6_SCENE_1_THE_GUEST_LECTURE: DialogScene = {
  id: "mechronis_m6_scene_1_the_guest_lecture",
  label: "M6 · Scene 1 — The Guest Lecture",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "Lecture Hall HUM-101. Standing room only. The Antiquarian wears a coat " +
        "the color of wet stone. He has brought no slides. He has brought a " +
        "single small notebook, which he does not open.",
    },
    {
      speaker: "antiquarian",
      mood: "warm",
      text:
        "Thank you for the chair. I do not lecture often. Most institutions " +
        "prefer to keep me at a distance. They are correct to. I am here as a " +
        "guest because the headmaster owes me a favor. He owes me a favor because " +
        "I keep the only honest record of his tenure. That is my profession.",
    },
    {
      speaker: "antiquarian",
      mood: "warm",
      text:
        "A Lore Journal is not a book. It is a habit. You will keep one. You " +
        "will write entries that no one but you will ever read. You will write " +
        "them anyway. The discipline is the gift. Every entry is an artifact. " +
        "Every artifact has a price. The price is paid in attention. There is no " +
        "other valid currency.",
    },
    {
      speaker: "antiquarian",
      mood: "warm",
      text:
        "I will not tell you what to write. I will tell you that I will read it " +
        "if you let me. I will read it gently. I treat grief like a vintage. " +
        "Most of what you give me will be grief, eventually. That is also fine.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "He closes the unopened notebook. He bows. He leaves. The class sits in " +
        "silence for thirty seconds, because no Mechronis class has ended without " +
        "a hidden agenda before, and the absence of one is louder than any drill.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   M7 — TRADE PRACTICUM (Veska as senior student)
   ═══════════════════════════════════════════════════════ */

const M7_SCENE_1_THE_MARKET_SIM: DialogScene = {
  id: "mechronis_m7_scene_1_the_market_sim",
  label: "M7 · Scene 1 — The Market Simulation",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "A practicum room. Eight desks, eight terminals, eight cohorts of " +
        "harbormasters in simulation. Veska is at desk three. She is smiling — a " +
        "small private smile that does not reach her eyes. She has already " +
        "decided she is leaving.",
    },
    {
      speaker: "curator_halverez",
      mood: "guarded",
      text:
        "Today's practicum: route forty units of cargo across eight sectors. " +
        "Maximize profit margin. Three of the harbormasters are Hierarchy-aligned " +
        "and will rig the books against you. Find the rig. Beat the rig. Or " +
        "comply with the rig. The grading rubric does not specify which.",
    },
    {
      speaker: "veska",
      mood: "warm",
      text:
        "Curator. Question. What if the route I build doesn't go through any of " +
        "the eight sectors?",
    },
    {
      speaker: "curator_halverez",
      mood: "guarded",
      text:
        "Then your route does not exist for the rubric. You will not be graded. " +
        "I do not recommend it.",
    },
    {
      speaker: "veska",
      mood: "warm",
      text:
        "Noted. Doing it anyway.",
      internal: "He cannot read what I am building. That is the entire point. The Hierarchy will own the eight sectors for the rest of his life. I do not intend to die under their flag.",
    },
  ],
};

const M7_SCENE_2_FULL_MARKS: DialogScene = {
  id: "mechronis_m7_scene_2_full_marks",
  label: "M7 · Scene 2 — Full Marks, Then the Door",
  kind: "cinematic",
  cues: [
    {
      speaker: "curator_halverez",
      mood: "guarded",
      text:
        "Practicum closed. Senior Veska — your route's profit margin cannot be " +
        "computed in the rubric. By default, that gives you full marks. You may " +
        "go.",
    },
    {
      speaker: "veska",
      mood: "warm",
      text: "Thank you, Curator.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The next morning, Veska is gone. Her dorm is bare. A note on the desk " +
        "reads: 'Eight sectors, four manifests, one harbormaster I'll never " +
        "invite for tea. — V.' Halverez reads the note three times. He puts it " +
        "in the drawer where he keeps the questions he cannot afford to ask.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   M8 — THE APPRENTICE TRIAL (wraps celebrationTrial.ts)
   ═══════════════════════════════════════════════════════ */

const M8_SCENE_1_THE_RITE: DialogScene = {
  id: "mechronis_m8_scene_1_the_rite",
  label: "M8 · Scene 1 — The 28-Day Rite",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The Apprentice Trial is administered jointly. Mechronis grades; the " +
        "Mascoteers run the daily decisions. The cohort gathers in a hall whose " +
        "ceiling shows the night sky over Celebration as it was in the year the " +
        "first Apprentice graduated. The sky is fictional. The grading is not.",
    },
    {
      speaker: "professor_aoki",
      mood: "guarded",
      text:
        "Twenty-eight days. One decision per day. The decision is presented by " +
        "a Mascoteer. The decision is graded by us. You will not know which " +
        "decision was the graded one until the final day. Begin. Day one is " +
        "Conni at the bandshell. She is already humming.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The runtime hands the player off to the existing celebrationTrial.ts " +
        "decision system. M8 is the diegetic wrapper that explains why the rite " +
        "is happening at Mechronis but happening through Celebration. Both " +
        "schools collaborate on this. The player sees the seam.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   M9 — THE ORACLE'S COUNTERCLAIM
   ═══════════════════════════════════════════════════════ */

const M9_SCENE_1_THE_VISITOR: DialogScene = {
  id: "mechronis_m9_scene_1_the_visitor",
  label: "M9 · Scene 1 — The White Oracle Visits",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The white Oracle has been re-awakened. She is here as a guest, like the " +
        "Antiquarian was. The Headmaster is in the back row. He has not sat in " +
        "the back row in seven hundred years. He is paying attention.",
    },
    {
      speaker: "white_oracle",
      mood: "cryptic",
      text:
        "Prestige Quests are taught here as a sanctioned achievement track. I " +
        "would like to offer a counter-reading. The track is not a track. The " +
        "track is a seam between cycles. What you do in one cycle becomes legible " +
        "to the next. Most of you will not notice. The few who notice will become " +
        "the seam.",
    },
    {
      speaker: "white_oracle",
      mood: "warm",
      text:
        "I am not telling you to defy your Headmaster. I am telling you that the " +
        "Headmaster's syllabus has only one author, and the author is grieving, " +
        "and grief is a poor curriculum designer. Read what he gives you. Then " +
        "read what he can't give you. Both readings count.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The Headmaster does not interrupt. He has not been told he is grieving. " +
        "He suspects he is grieving. He does not yet know what for. The seam " +
        "widens by a hair. The Dreamer hums, briefly, somewhere underneath the " +
        "lecture. The Oracle pretends not to hear it.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   M10 — THE FINAL EXAM (Zephyr-9 grades)
   ═══════════════════════════════════════════════════════ */

const M10_SCENE_1_THE_EXAM: DialogScene = {
  id: "mechronis_m10_scene_1_the_exam",
  label: "M10 · Scene 1 — Public Dueling",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The Mechronis amphitheatre. Stone tiers. The Final Exam is scored " +
        "publicly. Zephyr-9 stands at the rail with a tablet. She is not " +
        "looking at the tablet. She is looking at the duelists.",
    },
    {
      speaker: "zephyr_9",
      mood: "guarded",
      text:
        "Match one. Duelists, salute the cohort. The cohort salutes back. The " +
        "salute is graded. I am not telling you what I am grading on. Begin.",
    },
  ],
};

const M10_SCENE_2_KINDNESS_DURING_VICTORY: DialogScene = {
  id: "mechronis_m10_scene_2_kindness_during_victory",
  label: "M10 · Scene 2 — Kindness During Victory",
  kind: "cinematic",
  cues: [
    {
      speaker: "zephyr_9",
      mood: "warm",
      text:
        "Final scores posted. Top score, this round, is not the player who won " +
        "the most matches. Top score is the player who, in the moment of victory, " +
        "did not crow. Did not gloat. Helped their opponent up. The Architect's " +
        "rubric does not measure that. I measure it anyway. He has not yet asked " +
        "why my numbers don't reconcile with his. I assume he is busy. I assume " +
        "he is not paying attention. I assume well.",
    },
    {
      speaker: "zephyr_9",
      mood: "warm",
      text:
        "Class dismissed. Read chapters one through three of Boss Mastery: An " +
        "Anthology of Encounters Gracefully Survived. The author is a former " +
        "student of mine. The author was kind during victory. The author lived " +
        "longer than the rubric predicted, which is the correlation I am here to " +
        "demonstrate.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   M11 — THE PATRON'S TRUE FACE
   ═══════════════════════════════════════════════════════ */

const M11_SCENE_1_THE_REVEAL: DialogScene = {
  id: "mechronis_m11_scene_1_the_reveal",
  label: "M11 · Scene 1 — The Patron's True Face",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "Lady Malkia, in the Patron's exam room again. She has been here three " +
        "times now. Each time the Patron's face has been a slightly different " +
        "memory. Tonight the lamp is brighter. The face holds.",
    },
    {
      speaker: "the_patron",
      mood: "guarded",
      text:
        "You have noticed the rubric. You have noticed I am not its author. You " +
        "have not yet asked who is.",
    },
    {
      speaker: "the_seer",
      mood: "guarded",
      text: "I'm asking now.",
    },
    {
      speaker: "the_patron",
      mood: "guarded",
      text:
        "The Architect. He writes the rubrics. He writes them in his own hand. " +
        "I file them. I administer them. I am his proxy at this institution. I " +
        "have been his proxy at this institution for a very long time.",
    },
    {
      speaker: "the_patron",
      mood: "reflective",
      text:
        "I am telling you because it is now in your interest to know, and not in " +
        "his to keep secret. The Conspiracy Board you have been building in " +
        "another archive can have this card pinned to it now. The handwriting " +
        "matches. You will see what I mean when you compare.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The Patron stands. The Patron leaves. Malkia stays a moment longer, " +
        "then closes her notebook on a page that reads, in her own hand, " +
        "'PATRON IS ARCHITECT PROXY.' She has been writing that page for weeks " +
        "without knowing she was. The Antiquarian, far away, files the new card.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   M12 — THE DIPLOMA THAT ISN'T
   ═══════════════════════════════════════════════════════ */

const M12_SCENE_1_THE_HALL: DialogScene = {
  id: "mechronis_m12_scene_1_the_hall",
  label: "M12 · Scene 1 — The Diploma Hall",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "Graduation day. The Mechronis graduation hall is white stone, white " +
        "ceiling, white robes. The diplomas are stacked on a long table. Each is " +
        "a single page in the Architect's hand. Lady Malkia, in the seventh row, " +
        "has not yet decided whether she is going to take hers.",
    },
    {
      speaker: "headmaster_kanevas",
      mood: "guarded",
      text:
        "The cohort will rise. The cohort will receive their diplomas. The cohort " +
        "will recite the closing oath in unison. Begin.",
    },
    {
      speaker: "the_dreamer",
      mood: "warm",
      text:
        "(audible to the player; today, not whispered)\n" +
        "…you don't have to. He is not telling you that. I am. The diploma is a " +
        "stitch in something he is sewing. You can refuse the stitch. The garment " +
        "will fit somebody else. The garment isn't yours.",
    },
  ],
};

const M12_SCENE_2_THE_REFUSAL_OR_THE_ACCEPT: DialogScene = {
  id: "mechronis_m12_scene_2_the_refusal_or_the_accept",
  label: "M12 · Scene 2 — Accept or Refuse",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The player chooses. Two outcomes — both valid; both close the chapter; " +
        "both shift the player's three-axis allegiance. ACCEPT: the diploma is " +
        "signed. The cohort recites. Kanevas approves. The Architect's track " +
        "deepens. REFUSE: the diploma is left on the table. The cohort's recital " +
        "stutters where Malkia's voice would have been. Kanevas does not look up. " +
        "The Dreamer hums one whole line. Archie, somewhere beneath the " +
        "Architect, hears it. He cries, briefly, in a way nobody can document.",
    },
    {
      speaker: "headmaster_kanevas",
      mood: "guarded",
      text: "The graduation is concluded. The cohort is dismissed. The cohort will report to its assigned posts. The cohort is the network. The network is the cohort.",
    },
    {
      speaker: "the_dreamer",
      mood: "warm",
      text:
        "(very softly, regardless of which choice)\n" +
        "…thank you for listening. Either way. Wake gently. I'll be here.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   REGISTRY (part 2 — merged in mechronisAcademyDialog.ts)
   ═══════════════════════════════════════════════════════ */

export const MECHRONIS_ACADEMY_SCENES_PART_2: readonly DialogScene[] = Object.freeze([
  M2_SCENE_1_THE_TRIANGLE,
  M2_SCENE_2_THE_AGENDA,
  M3_SCENE_1_THE_QUESTION_PRICE,
  M3_SCENE_2_THE_AGENDA,
  M4_SCENE_1_THE_EXAM_ROOM,
  M5_SCENE_1_THE_BUFFER,
  M5_SCENE_2_HIS_OWN_DEATH,
  M6_SCENE_1_THE_GUEST_LECTURE,
  M7_SCENE_1_THE_MARKET_SIM,
  M7_SCENE_2_FULL_MARKS,
  M8_SCENE_1_THE_RITE,
  M9_SCENE_1_THE_VISITOR,
  M10_SCENE_1_THE_EXAM,
  M10_SCENE_2_KINDNESS_DURING_VICTORY,
  M11_SCENE_1_THE_REVEAL,
  M12_SCENE_1_THE_HALL,
  M12_SCENE_2_THE_REFUSAL_OR_THE_ACCEPT,
]);

export const MECHRONIS_EPISODE_SCENE_MAP_PART_2: Readonly<Record<string, readonly string[]>> = Object.freeze({
  mechronis_m2_applied_surveillance: [
    "mechronis_m2_scene_1_the_triangle",
    "mechronis_m2_scene_2_the_agenda",
  ],
  mechronis_m3_the_trade_exercise: [
    "mechronis_m3_scene_1_the_question_price",
    "mechronis_m3_scene_2_the_agenda",
  ],
  mechronis_m4_the_patrons_game: ["mechronis_m4_scene_1_the_exam_room"],
  mechronis_m5_the_necromancers_lecture: [
    "mechronis_m5_scene_1_the_buffer",
    "mechronis_m5_scene_2_his_own_death",
  ],
  mechronis_m6_the_antiquarian_visits: ["mechronis_m6_scene_1_the_guest_lecture"],
  mechronis_m7_trade_practicum: [
    "mechronis_m7_scene_1_the_market_sim",
    "mechronis_m7_scene_2_full_marks",
  ],
  mechronis_m8_the_apprentice_trial: ["mechronis_m8_scene_1_the_rite"],
  mechronis_m9_the_oracles_counterclaim: ["mechronis_m9_scene_1_the_visitor"],
  mechronis_m10_the_final_exam: [
    "mechronis_m10_scene_1_the_exam",
    "mechronis_m10_scene_2_kindness_during_victory",
  ],
  mechronis_m11_the_patrons_true_face: ["mechronis_m11_scene_1_the_reveal"],
  mechronis_m12_the_diploma_that_isnt: [
    "mechronis_m12_scene_1_the_hall",
    "mechronis_m12_scene_2_the_refusal_or_the_accept",
  ],
});

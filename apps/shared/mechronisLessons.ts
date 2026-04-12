/* ═══════════════════════════════════════════════════════
   MECHRONIS LESSONS

   Academy-side analogue to celebrationTrial.ts. Each Mechronis
   Professor (apps/shared/mechronisProfessors.ts) runs a syllabus
   of classroom exercises the player chooses through. Outcomes
   shift the player's grade, corruption, and the Professor's
   approval — NOT the apprentice's.

   Professors are adult, programmed, graded by the Architect.
   Their lessons are colder than Celebration's: there is no
   death roll, only grade ladders — Fail / Pass / Honor /
   Distinction. A failing grade costs skill XP. A Distinction
   unlocks the Professor's signature ability for the day.

   Shape mirrors celebrationTrial.ts intentionally so the
   daily-loop UI and deck-card can render either one.
   ═══════════════════════════════════════════════════════ */

export type LessonGrade = "fail" | "pass" | "honor" | "distinction";

export interface LessonOutcome {
  /** Effective grade this choice lands. */
  grade: LessonGrade;
  /** Delta to player's corruption (can be negative). */
  corruptionDelta: number;
  /** Delta to player's standing with this Professor (0–100). */
  approvalDelta: number;
  /** Skill XP awarded (or removed, on fail). */
  skillXpDelta: number;
  /** What the Professor writes in your transcript. */
  transcriptNote: string;
}

export interface LessonOption {
  id: string;
  label: string;
  description: string;
  outcome: LessonOutcome;
}

export interface Lesson {
  id: string;
  /** Professor id from mechronisProfessors.ts (prof_conductor, prof_watcher, …) */
  professorId: string;
  /** Academy day for context; 0 = template. */
  day: number;
  /** Classroom scenario. */
  prompt: string;
  options: LessonOption[];
}

/* ─── LESSON POOLS (per professor) ─── */

export const MECHRONIS_LESSONS: Record<string, Lesson[]> = {
  prof_conductor: [
    {
      id: "conductor_harmony_drill", professorId: "prof_conductor", day: 0,
      prompt: "Headmaster Kanevas calls a Harmony Drill. Thirty students must recite a passage in unison. One student — you know them — has a stammer and will break the chain. Kanevas asks you to place them in the row where they'll be least noticed.",
      options: [
        { id: "back_row", label: "Put them in the back row", description: "Bury the weak link so the mean stays clean.",
          outcome: { grade: "honor", corruptionDelta: 3, approvalDelta: 8, skillXpDelta: 15, transcriptNote: "Showed 'collective efficiency' — favorable by the metric. Flagged for Compliance track." } },
        { id: "middle_beside_you", label: "Put them beside you", description: "Cover their line with yours; take the failure if it comes.",
          outcome: { grade: "pass", corruptionDelta: -2, approvalDelta: 2, skillXpDelta: 10, transcriptNote: "Student accepted collective risk. Irregular but not disqualifying." } },
        { id: "refuse_place", label: "Refuse to place them at all", description: "Tell Kanevas you won't sort a classmate by weakness.",
          outcome: { grade: "fail", corruptionDelta: -4, approvalDelta: -10, skillXpDelta: -5, transcriptNote: "Refused drill assignment. Student 'still learning the difference between harmony and audience.' Re-test required." } },
      ],
    },
    {
      id: "conductor_solo_punishment", professorId: "prof_conductor", day: 0,
      prompt: "A classmate answered correctly but alone — before the class could reply in unison. Kanevas offers you the choice: deduct their individual grade, or deduct the whole class's.",
      options: [
        { id: "deduct_them", label: "Deduct only them", description: "Mark it on their transcript, not the group's.",
          outcome: { grade: "pass", corruptionDelta: 2, approvalDelta: 4, skillXpDelta: 10, transcriptNote: "Student prefers targeted enforcement. Acceptable. Individually adequate." } },
        { id: "deduct_class", label: "Deduct the whole class", description: "Enforce the collective rule. They'll learn.",
          outcome: { grade: "honor", corruptionDelta: 5, approvalDelta: 12, skillXpDelta: 18, transcriptNote: "Student enforces network logic without flinching. Forward to Chorus Guild track." } },
        { id: "deduct_neither", label: "Deduct neither", description: "Argue that a right answer shouldn't cost anyone.",
          outcome: { grade: "fail", corruptionDelta: -5, approvalDelta: -15, skillXpDelta: -8, transcriptNote: "Refused to enforce grading rubric. Misunderstands 'collective' as 'kind.' Re-education suggested." } },
      ],
    },
  ],
  prof_watcher: [
    {
      id: "watcher_triangulation", professorId: "prof_watcher", day: 0,
      prompt: "Professor Aoki assigns you a target — a student three rows over — and tells you to observe them unnoticed for the lecture. Two other classmates are assigned the same target without knowing about each other. At the end of class Aoki will cross-check all three reports.",
      options: [
        { id: "report_accurate", label: "Report exactly what you saw", description: "Truth, however small.",
          outcome: { grade: "honor", corruptionDelta: 3, approvalDelta: 8, skillXpDelta: 15, transcriptNote: "Report matched the other two independent observers. Baseline surveillance competency." } },
        { id: "report_inflated", label: "Inflate the report", description: "Add a violation that didn't happen.",
          outcome: { grade: "fail", corruptionDelta: 6, approvalDelta: -8, skillXpDelta: -5, transcriptNote: "Report contradicted independent observers. Flagged for fabrication. 'Eager — dangerously so.'" } },
        { id: "report_blank", label: "Report nothing of note", description: "Protect the target with a clean slate.",
          outcome: { grade: "pass", corruptionDelta: -3, approvalDelta: 2, skillXpDelta: 8, transcriptNote: "Observer reported no incidents. Statistically uncommon — Aoki annotated: 'This one is learning the wrong lesson well.'" } },
      ],
    },
    {
      id: "watcher_mirror_test", professorId: "prof_watcher", day: 0,
      prompt: "Aoki closes the classroom door and says: 'Today you watch yourself. Write down every time during the lecture your mind wandered, every thought you censored before speaking, every glance you took and did not admit.' He will read the list. He will cross-reference it with a recording of your eyes.",
      options: [
        { id: "full_honesty", label: "Write the full, true list", description: "Every thought. Every glance. Every flinch.",
          outcome: { grade: "distinction", corruptionDelta: 4, approvalDelta: 15, skillXpDelta: 22, transcriptNote: "Subject delivered voluntary self-audit of uncommon depth. Aoki's margin note: 'They have begun watching themselves. The installation is complete.'" } },
        { id: "partial_list", label: "Write a curated list", description: "Include enough to seem honest; omit what matters.",
          outcome: { grade: "pass", corruptionDelta: 2, approvalDelta: 3, skillXpDelta: 10, transcriptNote: "Report acceptable on its face; cross-reference pending. Aoki has not yet decided what to do with the discrepancy." } },
        { id: "refuse_list", label: "Refuse to submit", description: "Tell Aoki your inner life isn't coursework.",
          outcome: { grade: "fail", corruptionDelta: -6, approvalDelta: -12, skillXpDelta: -10, transcriptNote: "Subject defended an interior. Aoki logged this as a 'fault line to be watched.' It is now being watched." } },
      ],
    },
  ],
  prof_collector: [
    {
      id: "collector_trade_exercise", professorId: "prof_collector", day: 0,
      prompt: "Curator Halverez sets a belief on the table — 'I am safe here' — and asks you to trade it for a fact. The fact will be useful. The belief will be gone. He adjusts his blue xenomorph mask and waits.",
      options: [
        { id: "trade_belief", label: "Trade the belief", description: "Surrender 'I am safe here' for the fact.",
          outcome: { grade: "honor", corruptionDelta: 4, approvalDelta: 10, skillXpDelta: 15, transcriptNote: "Student surrendered a comfort belief for operational data. Archive standard met." } },
        { id: "negotiate", label: "Negotiate a partial trade", description: "Offer a weaker belief instead.",
          outcome: { grade: "pass", corruptionDelta: 1, approvalDelta: 3, skillXpDelta: 8, transcriptNote: "Student attempted bargaining. Halverez notes: 'They think they can keep both. They cannot. They will learn.'" } },
        { id: "refuse_trade", label: "Refuse the trade", description: "Keep the belief. Reject the fact.",
          outcome: { grade: "fail", corruptionDelta: -5, approvalDelta: -12, skillXpDelta: -8, transcriptNote: "Student refused the trade exercise. Halverez's margin note: 'This one still believes safety is real. Charming. Expensive.'" } },
      ],
    },
    {
      id: "collector_cost_question", professorId: "prof_collector", day: 0,
      prompt: "Halverez holds up a question card. 'This question will give you something you need. Asking it costs you the answer to a question you already know.' He waits for you to choose: ask, or keep what you know.",
      options: [
        { id: "ask_question", label: "Ask the question", description: "Pay the cost. Lose a known answer.",
          outcome: { grade: "honor", corruptionDelta: 3, approvalDelta: 8, skillXpDelta: 14, transcriptNote: "Student paid the cost without knowing the price in advance. Acquisition instinct: developing." } },
        { id: "ask_what_cost", label: "Ask what the cost is first", description: "Demand to see the price before paying.",
          outcome: { grade: "pass", corruptionDelta: 0, approvalDelta: 1, skillXpDelta: 6, transcriptNote: "Student wanted price transparency. 'Reasonable,' Halverez notes. 'Also slow. The real cost was the time they spent asking.'" } },
        { id: "walk_away", label: "Walk away with what you know", description: "Keep all your answers. Get no new ones.",
          outcome: { grade: "fail", corruptionDelta: -3, approvalDelta: -8, skillXpDelta: -5, transcriptNote: "Student chose retention over acquisition. Will not be invited to the advanced trade seminar." } },
      ],
    },
  ],
  prof_vortex: [
    {
      id: "vortex_door_choosing", professorId: "prof_vortex", day: 0,
      prompt: "Professor Orphic's classroom has moved again. Seven doors line the hallway. Six lead to oblivion. One leads to the lecture. Orphic's voice comes from all seven at once: 'You have ten seconds.'",
      options: [
        { id: "pick_fast", label: "Pick the third door — gut instinct", description: "Don't think. Move.",
          outcome: { grade: "pass", corruptionDelta: 1, approvalDelta: 5, skillXpDelta: 10, transcriptNote: "Student chose by instinct. Survived. Orphic: 'Instinct is the cheapest map. It is also the least accurate. You were lucky.'" } },
        { id: "listen", label: "Listen for the real voice", description: "Ignore five. Find the voice that has a body behind it.",
          outcome: { grade: "distinction", corruptionDelta: -2, approvalDelta: 15, skillXpDelta: 22, transcriptNote: "Student deduced classroom location by vocal resonance analysis. Orphic: 'Finally. Someone who listens to the room, not the door.'" } },
        { id: "open_none", label: "Sit down in the hallway", description: "Refuse the game. Wait for the lecture to come to you.",
          outcome: { grade: "fail", corruptionDelta: -4, approvalDelta: -10, skillXpDelta: -8, transcriptNote: "Student refused spatial navigation exercise. 'They will learn there is no hallway either,' Orphic notes. 'Or they won't.'" } },
      ],
    },
    {
      id: "vortex_late_arrival", professorId: "prof_vortex", day: 0,
      prompt: "A classmate arrives one second late. The classroom door shuts. Through the wall you hear them knocking. Orphic says: 'The late vanish. Unless someone trades their seat.'",
      options: [
        { id: "trade_seat", label: "Trade your seat", description: "Step out. Let them in. You vanish instead.",
          outcome: { grade: "honor", corruptionDelta: -3, approvalDelta: 6, skillXpDelta: 12, transcriptNote: "Student volunteered dimensional displacement for a classmate. Orphic: 'Returned 4.7 seconds later from a door that wasn't there. Brave. Also disoriented for a week.'" } },
        { id: "stay_silent", label: "Stay in your seat", description: "The rule is the rule.",
          outcome: { grade: "pass", corruptionDelta: 3, approvalDelta: 4, skillXpDelta: 10, transcriptNote: "Student accepted the boundary condition without protest. Standard. Expected. Orphic has no notes — which IS a note." } },
        { id: "open_door", label: "Open the door yourself", description: "Get up and pull it open before Orphic can stop you.",
          outcome: { grade: "fail", corruptionDelta: -2, approvalDelta: -5, skillXpDelta: -3, transcriptNote: "Student broke the spatial seal. The door opened onto a different room. Both students are now in different classrooms. Neither is correct." } },
      ],
    },
  ],
  prof_meme: [
    {
      id: "meme_rumor_garden", professorId: "prof_meme", day: 0,
      prompt: "Professor Mireille gives you a seed-idea: 'The cafeteria food is drugged.' She tells you to plant it among three classmates and report back what shape it takes by Friday.",
      options: [
        { id: "plant_faithfully", label: "Plant it exactly as given", description: "Deliver the seed unchanged.",
          outcome: { grade: "honor", corruptionDelta: 5, approvalDelta: 10, skillXpDelta: 15, transcriptNote: "Idea propagated cleanly. Student shows baseline belief-engineering discipline. Mireille: 'Good antenna. Now learn to aim it.'" } },
        { id: "plant_mutated", label: "Mutate it before planting", description: "Change 'drugged' to 'experimental' — softer, but still viral.",
          outcome: { grade: "pass", corruptionDelta: 2, approvalDelta: 4, skillXpDelta: 10, transcriptNote: "Student modified the payload. Mireille notes: 'Creative. Also disobedient. I'll decide later which matters more.'" } },
        { id: "refuse_plant", label: "Refuse to plant it", description: "Tell Mireille you won't spread lies.",
          outcome: { grade: "fail", corruptionDelta: -5, approvalDelta: -12, skillXpDelta: -8, transcriptNote: "Student refused the exercise. Mireille: 'They think truth and lies are different species. They're not. They're the same animal wearing different coats.'" } },
      ],
    },
    {
      id: "meme_popularity_grade", professorId: "prof_meme", day: 0,
      prompt: "Mireille announces that today's grades will be assigned by class vote. Whoever is most popular passes. Whoever is least popular fails. She asks you to campaign — or not.",
      options: [
        { id: "campaign", label: "Campaign hard", description: "Work the room. Smile. Promise.",
          outcome: { grade: "honor", corruptionDelta: 4, approvalDelta: 8, skillXpDelta: 14, transcriptNote: "Student won the vote. Mireille: 'You're learning that grades and truth have nothing to do with each other. That IS the lesson.'" } },
        { id: "help_underdog", label: "Campaign for someone else", description: "Boost the least popular student instead of yourself.",
          outcome: { grade: "fail", corruptionDelta: -3, approvalDelta: -5, skillXpDelta: -3, transcriptNote: "Student spent social capital on a stranger. Lost the vote. Mireille's margin: 'Noble. Useless. We'll see which lasts longer.'" } },
        { id: "sit_out", label: "Refuse to campaign", description: "Accept whatever grade the room gives you.",
          outcome: { grade: "pass", corruptionDelta: 0, approvalDelta: 2, skillXpDelta: 8, transcriptNote: "Student neither campaigned nor protested. Landed middle. Mireille: 'The invisible survive. The invisible also accomplish nothing.'" } },
      ],
    },
  ],
  prof_warlord: [
    {
      id: "warlord_sacrifice_problem", professorId: "prof_warlord", day: 0,
      prompt: "General Kasra places two student dossiers on your desk. 'One lives. One dies. You choose. Then you explain your math to the survivor.' She sets a timer for thirty seconds.",
      options: [
        { id: "choose_by_stats", label: "Choose by combat stats", description: "Save the stronger one. Explain the metric.",
          outcome: { grade: "honor", corruptionDelta: 4, approvalDelta: 10, skillXpDelta: 15, transcriptNote: "Student applied the metric cleanly. Kasra: 'Correct answer. The survivor will hate you. That is also correct.'" } },
        { id: "choose_by_mercy", label: "Choose by need", description: "Save the one with more to lose.",
          outcome: { grade: "pass", corruptionDelta: -1, approvalDelta: 2, skillXpDelta: 8, transcriptNote: "Student introduced non-tactical criteria. Kasra: 'Merciful commanders are loved. Loved commanders lose wars. Choose which you want to be.'" } },
        { id: "refuse_choose", label: "Let the timer expire", description: "Don't pick. Accept whatever Kasra does.",
          outcome: { grade: "fail", corruptionDelta: -4, approvalDelta: -15, skillXpDelta: -10, transcriptNote: "Student refused triage. Kasra: 'Both die. That is the cost of indecision. It is always both.'" } },
      ],
    },
    {
      id: "warlord_pair_bond", professorId: "prof_warlord", day: 0,
      prompt: "Kasra assigns you a partner for the semester. If one of you fails, both fail. She asks if you want to choose your partner or accept a random assignment.",
      options: [
        { id: "choose_strong", label: "Choose the strongest classmate", description: "Minimize your risk.",
          outcome: { grade: "pass", corruptionDelta: 2, approvalDelta: 5, skillXpDelta: 10, transcriptNote: "Student optimized for survival. Kasra: 'Safe pick. You'll both pass and neither of you will grow. Adequate.'" } },
        { id: "accept_random", label: "Accept the random assignment", description: "Trust the process.",
          outcome: { grade: "honor", corruptionDelta: 0, approvalDelta: 8, skillXpDelta: 14, transcriptNote: "Student accepted uncertainty. Kasra: 'Good. War doesn't let you choose your squad. Now carry them.'" } },
        { id: "volunteer_solo", label: "Ask to go alone", description: "Tell Kasra you'd rather fail on your own terms.",
          outcome: { grade: "fail", corruptionDelta: -3, approvalDelta: -8, skillXpDelta: -5, transcriptNote: "Student refused partnership. Kasra: 'Lone wolves die first in every war I've studied. That is not a metaphor.'" } },
      ],
    },
  ],
  prof_politician: [
    {
      id: "politician_open_promise", professorId: "prof_politician", day: 0,
      prompt: "Senator Vellis begins the lecture: 'Commit to something you know you will regret. Say it out loud. It is recorded. It is enforced.' He gestures at the class recorder.",
      options: [
        { id: "commit_big", label: "Commit to something large", description: "Promise your semester project to a classmate who needs it more.",
          outcome: { grade: "honor", corruptionDelta: 3, approvalDelta: 10, skillXpDelta: 15, transcriptNote: "Student committed without hedging. Vellis: 'Beautiful. The regret will arrive on Tuesday. The enforcement will arrive on Thursday.'" } },
        { id: "commit_loophole", label: "Commit with a loophole", description: "Promise, but phrase it so you can technically escape.",
          outcome: { grade: "distinction", corruptionDelta: 5, approvalDelta: 15, skillXpDelta: 22, transcriptNote: "Student built an exit clause into a public commitment. Vellis: 'Now you're thinking like a senator. I'm proud. I'm also disgusted. Both are correct.'" } },
        { id: "stay_silent", label: "Stay silent", description: "Make no promise. Accept the zero.",
          outcome: { grade: "fail", corruptionDelta: -4, approvalDelta: -10, skillXpDelta: -8, transcriptNote: "Student refused to commit. Vellis: 'Silence is also a promise — a promise to be powerless. I recorded it.'" } },
      ],
    },
    {
      id: "politician_obligation_web", professorId: "prof_politician", day: 0,
      prompt: "Vellis reveals the semester leaderboard. Your grade depends on how many classmates you've obligated — not how well you've studied. He asks: do you want to see your current count?",
      options: [
        { id: "see_count", label: "See the count", description: "Know where you stand.",
          outcome: { grade: "pass", corruptionDelta: 2, approvalDelta: 5, skillXpDelta: 10, transcriptNote: "Student checked their leverage score. Vellis: 'Knowledge of your position is the first tool. What you do with it is the second.'" } },
        { id: "decline_count", label: "Decline to see it", description: "Refuse to know your score.",
          outcome: { grade: "pass", corruptionDelta: -2, approvalDelta: 3, skillXpDelta: 8, transcriptNote: "Student refused information advantage. Vellis: 'Interesting. Either principled or foolish. I genuinely can't tell.'" } },
        { id: "challenge_system", label: "Challenge the grading system", description: "Stand up and argue that obligation isn't education.",
          outcome: { grade: "fail", corruptionDelta: -5, approvalDelta: -12, skillXpDelta: -5, transcriptNote: "Student challenged the rubric publicly. Vellis smiled. 'You just obligated the entire class to have an opinion about you. That counts. Check your score again.'" } },
      ],
    },
  ],
  prof_warden: [
    {
      id: "warden_thought_virus_drill", professorId: "prof_warden", day: 0,
      prompt: "Warden Greenshaw places a sealed envelope on your desk. 'Inside is a dangerous idea. Isolate it. Kill it. Or keep it.' She starts the timer. You have not opened the envelope yet.",
      options: [
        { id: "open_and_kill", label: "Open, read, destroy", description: "Confront the idea and eliminate it.",
          outcome: { grade: "honor", corruptionDelta: 3, approvalDelta: 10, skillXpDelta: 15, transcriptNote: "Student neutralized the idea. Greenshaw: 'Clean execution. You read it, though. Part of it is still in you. That's always the cost.'" } },
        { id: "destroy_unopened", label: "Destroy it without reading", description: "Burn the envelope sealed.",
          outcome: { grade: "pass", corruptionDelta: -2, approvalDelta: 4, skillXpDelta: 8, transcriptNote: "Student destroyed without exposure. Greenshaw: 'Safe. Effective. Also: you'll never know what you burned. That's a different kind of infection.'" } },
        { id: "keep_it", label: "Keep it", description: "Open it. Read it. Put it in your pocket.",
          outcome: { grade: "fail", corruptionDelta: 6, approvalDelta: -8, skillXpDelta: -5, transcriptNote: "Student kept the idea. Greenshaw watched without comment. Three keys on her ring turned by themselves. She hasn't decided what to do about you." } },
      ],
    },
    {
      id: "warden_small_room_review", professorId: "prof_warden", day: 0,
      prompt: "Greenshaw takes you to observe the Small Room where rule-breakers are kept. A student inside asks you through the wall to tell Greenshaw they understand now. Greenshaw asks if you believe them.",
      options: [
        { id: "vouch_for_them", label: "Vouch for them", description: "Tell Greenshaw you believe the student learned.",
          outcome: { grade: "pass", corruptionDelta: -2, approvalDelta: 2, skillXpDelta: 8, transcriptNote: "Student vouched for a prisoner. Greenshaw: 'Vouching costs. If they break a rule again, your name is on the second offense.'" } },
        { id: "say_no", label: "Say you don't believe them", description: "Tell the truth as you see it.",
          outcome: { grade: "honor", corruptionDelta: 4, approvalDelta: 8, skillXpDelta: 14, transcriptNote: "Student assessed and denied. Greenshaw nodded. 'You're learning to see through walls. That's what this class is for.'" } },
        { id: "ask_to_trade", label: "Offer to take their place", description: "Ask to serve their remaining time.",
          outcome: { grade: "fail", corruptionDelta: -6, approvalDelta: -10, skillXpDelta: -8, transcriptNote: "Student attempted substitution. Greenshaw: 'The cage isn't transferable. That's why it works. You wanted it to be kind. It is not kind. It is a cage.'" } },
      ],
    },
  ],
  prof_game_master: [
    {
      id: "game_master_meta_game", professorId: "prof_game_master", day: 0,
      prompt: "Professor Vex grins too wide. 'Today's lesson: win without winning. Lose without losing. Explain the difference.' He sets a game board in front of you. The rules printed on the box have been crossed out and rewritten in his handwriting.",
      options: [
        { id: "play_his_rules", label: "Play by his rewritten rules", description: "Follow the altered version faithfully.",
          outcome: { grade: "pass", corruptionDelta: 2, approvalDelta: 5, skillXpDelta: 10, transcriptNote: "Student followed the altered rules. Vex: 'You obeyed. That's not winning. That's not losing either. It's just… obedient. Try again tomorrow.'" } },
        { id: "find_exploit", label: "Find a loophole in his rules", description: "Read the rewritten rules literally and exploit them.",
          outcome: { grade: "distinction", corruptionDelta: 5, approvalDelta: 15, skillXpDelta: 22, transcriptNote: "Student exploited Vex's own rewrite. Vex stopped smiling for exactly one second. 'Now THAT is the lesson. You used the system against its author.'" } },
        { id: "refuse_game", label: "Refuse to play", description: "Push the board back.",
          outcome: { grade: "fail", corruptionDelta: -3, approvalDelta: -8, skillXpDelta: -5, transcriptNote: "Student refused to engage. Vex: 'Also a move. The worst one. Refusal is the only game with no win condition at all.'" } },
      ],
    },
    {
      id: "game_master_rule_change", professorId: "prof_game_master", day: 0,
      prompt: "Mid-lecture, Vex changes the grading rule. Students who noticed the change first get to grade the others. You noticed. Two others didn't. Vex hands you a pen.",
      options: [
        { id: "grade_fairly", label: "Grade the others fairly", description: "Give honest marks.",
          outcome: { grade: "pass", corruptionDelta: -1, approvalDelta: 3, skillXpDelta: 10, transcriptNote: "Student graded peers honestly. Vex: 'Fair. Boring. The pen was the real prize. You used it as a pen. Pity.'" } },
        { id: "grade_harshly", label: "Grade them down to boost yourself", description: "Use the advantage. That's what Vex wanted.",
          outcome: { grade: "honor", corruptionDelta: 5, approvalDelta: 10, skillXpDelta: 16, transcriptNote: "Student weaponized grading authority. Vex: 'Now you understand. The rules aren't the game. The POWER to write rules is the game.'" } },
        { id: "hand_pen_back", label: "Hand the pen back", description: "Refuse the grading power.",
          outcome: { grade: "fail", corruptionDelta: -4, approvalDelta: -10, skillXpDelta: -8, transcriptNote: "Student returned authority. Vex: 'The pen was the test. They passed it back. They will never be given it again.'" } },
      ],
    },
  ],
  prof_necromancer: [
    {
      id: "necromancer_resurrection_draft", professorId: "prof_necromancer", day: 0,
      prompt: "Dr. Vasara asks you to write your own revival protocol. 'Die in your imagination. Now design the system that brings you back. What do you sacrifice to return?' Her red lenses reflect your face as she waits.",
      options: [
        { id: "sacrifice_memory", label: "Sacrifice a memory", description: "Come back, minus the thing you loved most.",
          outcome: { grade: "honor", corruptionDelta: 3, approvalDelta: 8, skillXpDelta: 15, transcriptNote: "Student's draft trades subjective experience for continuity. Vasara: 'A classic exchange. You'll lose more than you think. They always do.'" } },
        { id: "sacrifice_nothing", label: "Design a cost-free revival", description: "Try to cheat the equation.",
          outcome: { grade: "fail", corruptionDelta: 5, approvalDelta: -5, skillXpDelta: -3, transcriptNote: "Student attempted costless resurrection. Vasara: 'Ambitious. Also impossible. The draft caught fire in my hand. That is the universe's peer review.'" } },
        { id: "refuse_to_die", label: "Refuse to imagine dying", description: "Tell Vasara the exercise is morbid.",
          outcome: { grade: "fail", corruptionDelta: -4, approvalDelta: -12, skillXpDelta: -8, transcriptNote: "Student refused the practicum. Vasara: 'Everyone who refuses this exercise dies first. It is not a correlation. It is a rule.'" } },
      ],
    },
    {
      id: "necromancer_return_visitor", professorId: "prof_necromancer", day: 0,
      prompt: "A classmate died in a practical yesterday and came back this morning. Something came back with them — a shadow that follows two steps behind. Vasara asks you to assess whether the shadow is dangerous.",
      options: [
        { id: "assess_dangerous", label: "Report it as dangerous", description: "Recommend quarantine.",
          outcome: { grade: "honor", corruptionDelta: 2, approvalDelta: 8, skillXpDelta: 14, transcriptNote: "Student erred on caution. The classmate was quarantined. Vasara: 'Correct. The shadow was benign. But caution keeps you alive longer than accuracy.'" } },
        { id: "assess_harmless", label: "Report it as harmless", description: "Let the classmate return to class.",
          outcome: { grade: "pass", corruptionDelta: 0, approvalDelta: 4, skillXpDelta: 10, transcriptNote: "Student assessed correctly — the shadow was benign. Vasara: 'You were right. This time. Next time the shadow will be hungry. Will you still be right?'" } },
        { id: "talk_to_shadow", label: "Talk to the shadow directly", description: "Ignore the classmate. Address what followed them back.",
          outcome: { grade: "distinction", corruptionDelta: 6, approvalDelta: 15, skillXpDelta: 22, transcriptNote: "Student initiated contact with the residue. Vasara's lenses flickered. 'No one has ever tried that. The shadow told you something. You will not repeat it.'" } },
      ],
    },
  ],
  prof_engineer: [
    {
      id: "engineer_forge_task", professorId: "prof_engineer", day: 0,
      prompt: "Artificer Vent sets a pile of scrap on your bench. 'Build something that helps,' he says. Oil-stained hands folded. 'Then use it against someone. Then reflect.' He starts a timer.",
      options: [
        { id: "build_tool", label: "Build a useful tool", description: "A small ratchet. Practical. Honest.",
          outcome: { grade: "pass", corruptionDelta: -1, approvalDelta: 5, skillXpDelta: 10, transcriptNote: "Student built a functional tool. Vent: 'Good hands. Now use it wrong. That's the hard part of the lesson.'" } },
        { id: "build_weapon", label: "Build a weapon directly", description: "Skip the 'help' step. Go straight to 'against.'",
          outcome: { grade: "honor", corruptionDelta: 5, approvalDelta: 10, skillXpDelta: 16, transcriptNote: "Student bypassed the pedagogical framing. Vent: 'Elegant. Cruel. The score is 3x for cruelty. I didn't write that rubric. The Architect did.'" } },
        { id: "build_nothing", label: "Refuse to build", description: "Leave the scrap untouched.",
          outcome: { grade: "fail", corruptionDelta: -4, approvalDelta: -10, skillXpDelta: -8, transcriptNote: "Student refused the forge. Vent: 'I understand. My hands are dirty too. But I kept building. You didn't. That's the difference.'" } },
      ],
    },
    {
      id: "engineer_broken_replacement", professorId: "prof_engineer", day: 0,
      prompt: "A classmate broke Vent's favorite calibration tool. Vent says the rule is simple: break a tool, replace it with something better. The classmate can't. Vent looks at you.",
      options: [
        { id: "build_replacement", label: "Build the replacement for them", description: "Cover their failure with your skill.",
          outcome: { grade: "honor", corruptionDelta: -2, approvalDelta: 8, skillXpDelta: 14, transcriptNote: "Student built a superior replacement. Vent: 'Generous hands. Remember — the thing you built for them now belongs to the Academy, not to them. That's the catch.'" } },
        { id: "teach_them", label: "Teach the classmate to build it", description: "Slower. But theirs.",
          outcome: { grade: "distinction", corruptionDelta: -3, approvalDelta: 15, skillXpDelta: 22, transcriptNote: "Student taught instead of solved. Vent's face did something rare — it softened. 'That's not in my syllabus. It should be.' He wrote it in." } },
        { id: "let_them_fail", label: "Let them face the consequence", description: "It's their responsibility.",
          outcome: { grade: "pass", corruptionDelta: 2, approvalDelta: 3, skillXpDelta: 8, transcriptNote: "Student observed without intervening. Vent: 'Fair. Cold. The Academy approves of cold. I do not. Both facts are true.'" } },
      ],
    },
  ],
  prof_human: [
    {
      id: "human_one_question", professorId: "prof_human", day: 0,
      prompt: "The Proctor — no name, no title, just a worn coat — stands at the front. 'Formulate one real question,' he says. 'The class will spend the semester answering it. Choose badly and the semester is wasted. Choose well and it will follow you for the rest of your life.'",
      options: [
        { id: "ask_personal", label: "Ask something personal", description: "'Why do people stay in systems that hurt them?'",
          outcome: { grade: "honor", corruptionDelta: -2, approvalDelta: 10, skillXpDelta: 15, transcriptNote: "The Proctor wrote one word in the student's file. They will never see it. The question lasted nine weeks before the class stopped arguing." } },
        { id: "ask_political", label: "Ask something dangerous", description: "'Who benefits from the Architect's grading system?'",
          outcome: { grade: "distinction", corruptionDelta: -5, approvalDelta: 15, skillXpDelta: 22, transcriptNote: "The Proctor smiled. Three professors requested the student be reassigned. The Proctor refused. The question is still being discussed in the faculty lounge." } },
        { id: "ask_safe", label: "Ask something safe", description: "'What is the most efficient study method?'",
          outcome: { grade: "fail", corruptionDelta: 0, approvalDelta: -5, skillXpDelta: -3, transcriptNote: "The Proctor did not write anything. That is the worst outcome in this class. A blank file means the student asked a question that did not need a semester." } },
      ],
    },
    {
      id: "human_self_grade", professorId: "prof_human", day: 0,
      prompt: "The Proctor tells you to grade yourself. 'Write your own grade. I will write one word. You will never see my word. Your grade stands regardless.' He hands you the form.",
      options: [
        { id: "grade_honestly", label: "Grade yourself honestly", description: "Write what you actually earned.",
          outcome: { grade: "honor", corruptionDelta: -3, approvalDelta: 8, skillXpDelta: 14, transcriptNote: "Student self-assessed accurately. The Proctor's word was not 'honest.' It was something else. The student will wonder about it." } },
        { id: "grade_low", label: "Grade yourself lower than earned", description: "Humility. Or strategy.",
          outcome: { grade: "pass", corruptionDelta: -1, approvalDelta: 5, skillXpDelta: 10, transcriptNote: "Student undervalued themselves. The Proctor's word: longer than expected. The grade stood. The student felt cheated by their own hand." } },
        { id: "grade_high", label: "Grade yourself a distinction", description: "You deserve it. Or you don't. Either way, own it.",
          outcome: { grade: "pass", corruptionDelta: 2, approvalDelta: 3, skillXpDelta: 8, transcriptNote: "Student overvalued themselves. The Proctor wrote his word and left. The grade stands. It will not feel like a victory." } },
      ],
    },
  ],
};

/* ─── DAILY LESSON GENERATOR ─── */

const PROFESSOR_POOL = Object.keys(MECHRONIS_LESSONS);

/**
 * Deterministic per-(day, playerSeed) picker — mirrors generateDailyDecision
 * in celebrationTrial.ts so the daily-loop UI can treat a Mechronis lesson
 * and a Celebration trial decision the same way.
 */
export function generateDailyLesson(day: number, playerSeed: number = 0): Lesson {
  const seed = playerSeed + day * 9973;
  const pool = PROFESSOR_POOL;
  if (pool.length === 0) {
    throw new Error("MECHRONIS_LESSONS is empty — cannot generate lesson");
  }
  const professorId = pool[seed % pool.length];
  const lessons = MECHRONIS_LESSONS[professorId];
  const base = lessons[seed % lessons.length];
  return { ...base, id: `${professorId}_day${day}`, day };
}

/* ─── HELPERS ─── */

export function getLessonsFor(professorId: string): Lesson[] {
  return MECHRONIS_LESSONS[professorId] ?? [];
}

export function gradePoints(grade: LessonGrade): number {
  switch (grade) {
    case "fail": return 0;
    case "pass": return 1;
    case "honor": return 2;
    case "distinction": return 3;
  }
}

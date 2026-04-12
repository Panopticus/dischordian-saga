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

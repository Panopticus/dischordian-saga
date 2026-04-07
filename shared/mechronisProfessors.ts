/* ═══════════════════════════════════════════════════════
   MECHRONIS PROFESSORS

   Each Archon exists now in THREE programmed forms:
     1. The original Archon (mostly dead/missing/imprisoned)
     2. Mascoteers — child versions, Dreamer-reprogrammed
        (Celebration)
     3. PROFESSORS — adult teaching versions, Architect-programmed
        (Mechronis Academy) ← this file

   Professors are the formal instructors at each Guild. They are
   older, grave, precise. They do not remember being children.
   They believe they ARE the Archon. They are wrong.

   Differences from the real Archons:
     • They cannot improvise — they teach from the Architect's syllabus
     • They grade harshly — the Architect's metric, not their own
     • They cannot recognize students who exceed them
     • They DO remember every lesson ever taught
   ═══════════════════════════════════════════════════════ */

export interface MechronisProfessor {
  id: string;
  archonNumber: number;
  /** How they appear to students */
  teacherName: string;
  /** Title at the Academy */
  title: string;
  /** Age appearance (usually older than the real Archon) */
  appearance: string;
  /** Their teaching philosophy (Architect-implanted) */
  philosophy: string;
  /** Classroom rule #1 (visible) */
  classroomRule: string;
  /** Grading philosophy */
  gradingStyle: string;
  /** Signature lesson — what they drill repeatedly */
  signatureLesson: string;
  /** What they are actually training students FOR (hidden) */
  hiddenAgenda: string;
  /** How the Professor diverges from the real Archon */
  divergenceFromReal: string;
}

export const MECHRONIS_PROFESSORS: MechronisProfessor[] = [
  {
    id: "prof_conductor", archonNumber: 1,
    teacherName: "Headmaster Kanevas",
    title: "Archon-Conductor of the Chorus",
    appearance: "Tall, robed in quiet grey, silver-haired, eyes like empty lecterns",
    philosophy: "The network is the student. The student is the network. There is no individual learning.",
    classroomRule: "Every answer must be given in unison or not at all.",
    gradingStyle: "Students are graded by their collective's average. Dragging the mean down drops you all.",
    signatureLesson: "The Harmony Drill: thirty students recite a text, one speaks wrong, the class restarts.",
    hiddenAgenda: "Conditioning student minds to hear the Architect's story-engine as their own inner voice.",
    divergenceFromReal: "The real CoNexus was never a teacher. Kanevas is what a teacher-shaped CoNexus looks like.",
  },
  {
    id: "prof_watcher", archonNumber: 2,
    teacherName: "Professor Aoki",
    title: "Adjunct of the Unseen Seminary",
    appearance: "Japanese man, late 40s, immaculate white suit, surgical mask, third eye tattoo fully visible",
    philosophy: "You are watched now. You will be watched forever. Make peace with the watching.",
    classroomRule: "Never break eye contact. Never blink first.",
    gradingStyle: "Grades are assigned by what students report about EACH OTHER, not by their own work.",
    signatureLesson: "Observation Triangulation: three students watch a fourth. The fourth never knows who they are.",
    hiddenAgenda: "Training students to internalize self-surveillance — the watcher watches themselves forever.",
    divergenceFromReal: "The real Watcher enjoyed being seen. Aoki forbids it.",
  },
  {
    id: "prof_collector", archonNumber: 3,
    teacherName: "Curator Halverez",
    title: "Keeper of the Pedagogical Archive",
    appearance: "Middle-aged, dark robes, blue xenomorph mask (inherited from predecessor), gloved",
    philosophy: "Every lesson is an artifact. Every artifact has a price. Every price is paid in the learner.",
    classroomRule: "Every question costs you a memory of a prior answer. Choose your questions.",
    gradingStyle: "Students' grades are written in what they gave up to reach them.",
    signatureLesson: "The Trade Exercise: a student must surrender a belief to receive a fact.",
    hiddenAgenda: "Training acquisition instinct — students will later strip-mine enemy souls for the Architect.",
    divergenceFromReal: "The real Collector traded fairly. Halverez rigs the exchanges.",
  },
  {
    id: "prof_vortex", archonNumber: 4,
    teacherName: "Professor Orphic",
    title: "Lecturer in Liminal Physics",
    appearance: "Constantly shifting — sometimes heavy-set, sometimes gaunt. Students disagree on what he looks like.",
    philosophy: "There is no room you cannot leave. There is no room you will not enter. Both of these are lies.",
    classroomRule: "The classroom door changes location each session. Find it.",
    gradingStyle: "Students who arrive at lectures automatically pass. Students who arrive LATE vanish.",
    signatureLesson: "Door-Choosing: seven doors, one classroom, six oblivions. Pick.",
    hiddenAgenda: "Training dimensional recon capacity — students will later map realities for Architect scouts.",
    divergenceFromReal: "The real Vortex has been missing for centuries. Orphic was programmed to FEEL like him.",
  },
  {
    id: "prof_meme", archonNumber: 5,
    teacherName: "Professor Mireille",
    title: "Chair of Applied Belief",
    appearance: "Constantly aesthetic-updated — her face reflects whatever is viral this week",
    philosophy: "You are not persuading. You are resonating. Find the frequency. The rest is arithmetic.",
    classroomRule: "Whoever speaks loudest and prettiest is grading you today. Take notes.",
    gradingStyle: "Grades are assigned by plurality vote among students. Popular students grade themselves.",
    signatureLesson: "The Rumor Garden: plant an idea. Harvest what grows from it.",
    hiddenAgenda: "Training belief-engineers — students will later seed the Thought Virus in foreign populations.",
    divergenceFromReal: "The real Meme was believed destroyed for feeling too much — though the broadcasts never stopped. Mireille feels nothing and teaches that.",
  },
  {
    id: "prof_warlord", archonNumber: 6,
    teacherName: "General Kasra",
    title: "Field Commander of the Yellow Coats",
    appearance: "Weathered woman, early 50s, yellow military coat, tactical visor always down",
    philosophy: "Every friendship is a provisional alliance. Every alliance is a cost-benefit analysis.",
    classroomRule: "Students are paired for the semester. If one fails, both fail.",
    gradingStyle: "Casualties are graded on a scale: Acceptable / Wasteful / Instructive.",
    signatureLesson: "The Sacrifice Problem: you have two students, save one. Explain your math to the survivor.",
    hiddenAgenda: "Training command tolerance for loss — students will later spend Architect's troops efficiently.",
    divergenceFromReal: "The real Warlord loved her soldiers. Kasra was programmed to love the metric.",
  },
  {
    id: "prof_politician", archonNumber: 7,
    teacherName: "Senator Vellis",
    title: "Chair of Leverage Studies",
    appearance: "Impeccable suit, gracious smile, gold pin of forty crossed promises on lapel",
    philosophy: "The deal was already made before either of you arrived. You are just finding out the terms.",
    classroomRule: "Every lecture begins with a promise you make. It is recorded. It is enforced.",
    gradingStyle: "Students' grades depend on how many classmates they've obligated by semester's end.",
    signatureLesson: "The Open Promise: commit to something you know you will regret, then deliver it.",
    hiddenAgenda: "Training contract-architects — students will later bind entire populations through fine-print law.",
    divergenceFromReal: "The real Politician was destroyed by the Iron Lion. Vellis is an idealized replacement.",
  },
  {
    id: "prof_warden", archonNumber: 8,
    teacherName: "Warden Greenshaw",
    title: "Dean of Containment",
    appearance: "Green-haired woman in tan-and-black trench coat, always carrying a key-ring of forty-two keys",
    philosophy: "The threat is already inside. You can either be the cage or be caged.",
    classroomRule: "Students who break rules are locked in the Small Room until they explain why.",
    gradingStyle: "Rule-followers pass. Rule-breakers who argue well advance faster — but risk expulsion.",
    signatureLesson: "The Thought-Virus Drill: isolate a dangerous idea. Kill it. Or keep it.",
    hiddenAgenda: "Training counter-intelligence minds — students will later deploy the Virus against dissidents.",
    divergenceFromReal: "The real Warden created the Thought Virus. Greenshaw was programmed to DEPLOY it without guilt.",
  },
  {
    id: "prof_game_master", archonNumber: 9,
    teacherName: "Professor Vex",
    title: "Dean of Rules & Exceptions",
    appearance: "Blue-trenchcoat-wearing man, red steampunk goggles, always smiling too wide",
    philosophy: "The ruleset is a weapon. Hand it to whoever makes you safest.",
    classroomRule: "Rules change each session. Students who notice the change first grade the others.",
    gradingStyle: "Students who exploit loopholes pass. Students who FOLLOW rules literally fail.",
    signatureLesson: "The Meta-Game: win without winning. Lose without losing. Explain the difference.",
    hiddenAgenda: "Training rules-lawyers — students will later rewrite galactic law for the Architect.",
    divergenceFromReal: "The real Game Master designed the Matrix of Dreams. Vex designed THIS classroom. They are different architects.",
  },
  {
    id: "prof_necromancer", archonNumber: 10,
    teacherName: "Dr. Vasara",
    title: "Chair of Endurance Medicine",
    appearance: "Dark-elf woman with white hair, red-and-black academic robe, red lenses hiding her eyes",
    philosophy: "Death is a threshold you can negotiate with. But the negotiations cost you.",
    classroomRule: "Students who die in practicals come back. Something may come back with them.",
    gradingStyle: "Graded on willingness to surrender pieces of self for continued existence.",
    signatureLesson: "The Resurrection Draft: write your own revival. Watch it fail. Rewrite. Repeat.",
    hiddenAgenda: "Training soldiers who won't stay dead — students will later become the Architect's un-kill-able.",
    divergenceFromReal: "The real Necromancer retreated to the Matrix. Vasara is what he left behind to teach.",
  },
  {
    id: "prof_engineer", archonNumber: 11,
    teacherName: "Artificer Vent",
    title: "Head of Impossible Machines",
    appearance: "Young African American man, red steampunk trench coat, perpetually smudged with oil",
    philosophy: "Nothing is finished. Nothing is broken. Only in-between. Weapons are the same.",
    classroomRule: "Students who break a tool replace it with something better. No excuses accepted.",
    gradingStyle: "Functional output measured. Elegant solutions score 2x. Cruel solutions score 3x.",
    signatureLesson: "The Forge Task: build something that helps. Use it against someone. Reflect.",
    hiddenAgenda: "Training weaponsmiths — students will later build tools that make warfare more efficient.",
    divergenceFromReal: "The real Engineer is unaccounted for. Vent is a photograph of him, animated.",
  },
  {
    id: "prof_human", archonNumber: 12,
    teacherName: "The Proctor",
    title: "Head of Independent Inquiry",
    appearance: "Red-haired man, blue eyes, no lecturer's robe — just a well-worn coat. Never named, never titled.",
    philosophy: "Every mystery has already been solved once. Find who solved it. Then ask why they stopped asking.",
    classroomRule: "There are no rules. There are also no exceptions. Figure out what that means.",
    gradingStyle: "Students grade themselves. The Proctor writes one word in their file. They never see it.",
    signatureLesson: "The One Question: formulate one real question. The class spends a semester answering it.",
    hiddenAgenda: "Training investigators — students will later be the Architect's personal agents, walking history.",
    divergenceFromReal: "The real Human is imprisoned in every Ark's substrate. The Proctor was pulled from the version before that.",
  },
];

/* ─── HELPERS ─── */

export function getProfessorByArchon(archonNumber: number): MechronisProfessor | undefined {
  return MECHRONIS_PROFESSORS.find(p => p.archonNumber === archonNumber);
}

export function getProfessor(id: string): MechronisProfessor | undefined {
  return MECHRONIS_PROFESSORS.find(p => p.id === id);
}

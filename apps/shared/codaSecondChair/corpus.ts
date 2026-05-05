/* ═══════════════════════════════════════════════════════
   SECOND CHAIR — authored fragment corpus

   ~50 lines of pre-written counsel. Vex's reconstruction of
   the Engineer is a model — these are the model's outputs,
   pristine. The selector applies corruption at render time.

   Voice rules (strict):
   • Technical and precise. Short. Often a half-thought.
   • Memory fragments are spatial — hallways, windows,
     machine sounds. Never political. He was an engineer.
   • Domain terms used out of place are encouraged
     ("the seam holds", "two-stage").
   • vexAware lines call her "Vex" (not "Solène"); they
     sound like a teacher caught off-guard by a student.
   • No fourth-wall breaks. No meta-awareness that he is
     a model.
   ═══════════════════════════════════════════════════════ */

import type { SecondChairFragment } from "./types";

export const SECOND_CHAIR_CORPUS: readonly SecondChairFragment[] = [
  // ── General (always eligible) ──────────────────────────
  { id: "te-sc-001", archetypes: ["general"], tone: "warning",
    text: "Don't. The seam holds when you stop tugging.",
    defaultCorruption: "stutter" },
  { id: "te-sc-002", archetypes: ["general"], tone: "encouragement",
    text: "You've already done the hard part. The rest is patience.",
    defaultCorruption: "none" },
  { id: "te-sc-003", archetypes: ["general"], tone: "technical",
    text: "Two-stage. Start with the second.",
    defaultCorruption: "none" },
  { id: "te-sc-004", archetypes: ["general"], tone: "philosophical",
    text: "The Coda is not a discipline. It is a refusal.",
    defaultCorruption: "fade" },
  { id: "te-sc-005", archetypes: ["general"], tone: "doubt",
    text: "I would have said no. I think. I would have said no.",
    defaultCorruption: "stutter" },
  { id: "te-sc-006", archetypes: ["general"], tone: "memory",
    text: "I remember a hallway. There was a window the wrong way around.",
    defaultCorruption: "fade" },
  { id: "te-sc-007", archetypes: ["general"], tone: "self_correction",
    text: "Strike that. The first answer is wrong. The second is wrong differently.",
    defaultCorruption: "interrupt" },
  { id: "te-sc-008", archetypes: ["general"], tone: "warning",
    text: "If the room is too quiet, somebody is listening with their hands.",
    defaultCorruption: "none" },
  { id: "te-sc-009", archetypes: ["general"], tone: "technical",
    text: "Every joint has a tell. Find the joint that doesn't.",
    defaultCorruption: "none" },
  { id: "te-sc-010", archetypes: ["general"], tone: "philosophical",
    text: "Tools are not loyal. They are accurate.",
    defaultCorruption: "none" },

  // ── Infiltration ───────────────────────────────────────
  { id: "te-sc-101", archetypes: ["infiltration"], tone: "warning",
    text: "If the corridor smells of new solder, the panel was opened tonight.",
    defaultCorruption: "fade" },
  { id: "te-sc-102", archetypes: ["infiltration"], tone: "technical",
    text: "Locks have grain. Push along the grain.",
    defaultCorruption: "none" },
  { id: "te-sc-103", archetypes: ["infiltration"], tone: "encouragement",
    text: "You walked the same hallway twice. They didn't notice. Walk it a third time and they will.",
    defaultCorruption: "none" },
  { id: "te-sc-104", archetypes: ["infiltration"], tone: "memory",
    text: "There was a maintenance shaft on the third level. The grease on the rung was always fresh. Someone went up. Someone never came down.",
    defaultCorruption: "fade" },
  { id: "te-sc-105", archetypes: ["infiltration"], tone: "doubt",
    text: "I never went in. I never had to. But the door was the same kind of door.",
    defaultCorruption: "stutter" },
  { id: "te-sc-106", archetypes: ["infiltration"], tone: "self_correction",
    text: "Quiet first. Fast second. I had it backward last time.",
    defaultCorruption: "interrupt" },
  { id: "te-sc-107", archetypes: ["infiltration"], tone: "warning",
    text: "A camera that pans on a schedule is a camera you can move past. A camera that pans on nothing is the one watching.",
    defaultCorruption: "none" },

  // ── Outreach ───────────────────────────────────────────
  { id: "te-sc-201", archetypes: ["outreach"], tone: "encouragement",
    text: "Lead with the thing you would not have said yesterday. They will hear that you have changed.",
    defaultCorruption: "none" },
  { id: "te-sc-202", archetypes: ["outreach"], tone: "warning",
    text: "If they ask you what you want, they have already decided what to give. Ask first.",
    defaultCorruption: "fade" },
  { id: "te-sc-203", archetypes: ["outreach"], tone: "philosophical",
    text: "An open hand is structural. A closed hand is also structural. Pick the load you can carry.",
    defaultCorruption: "none" },
  { id: "te-sc-204", archetypes: ["outreach"], tone: "memory",
    text: "There was a lab partner who never spoke at the bench. She always spoke at the door.",
    defaultCorruption: "fade" },
  { id: "te-sc-205", archetypes: ["outreach"], tone: "technical",
    text: "Speech is a low-bandwidth channel. Posture isn't.",
    defaultCorruption: "none" },
  { id: "te-sc-206", archetypes: ["outreach"], tone: "doubt",
    text: "I never knew how to do this. I only knew the failure modes.",
    defaultCorruption: "stutter" },

  // ── Logistics ──────────────────────────────────────────
  { id: "te-sc-301", archetypes: ["logistics"], tone: "technical",
    text: "Inventory is a confession of priorities. Read theirs before you write yours.",
    defaultCorruption: "none" },
  { id: "te-sc-302", archetypes: ["logistics"], tone: "warning",
    text: "If the supply line is tidy, somebody upstream is hiding the part that breaks.",
    defaultCorruption: "fade" },
  { id: "te-sc-303", archetypes: ["logistics"], tone: "encouragement",
    text: "The boring path delivers. Take it. Hate it. Take it.",
    defaultCorruption: "none" },
  { id: "te-sc-304", archetypes: ["logistics"], tone: "memory",
    text: "We had a stockroom whose lights blinked when a freighter docked two decks up. Vibration. Not signal. The lights were just listening.",
    defaultCorruption: "fade" },
  { id: "te-sc-305", archetypes: ["logistics"], tone: "self_correction",
    text: "I said redundancy. I meant slack. They aren't the same.",
    defaultCorruption: "interrupt" },
  { id: "te-sc-306", archetypes: ["logistics"], tone: "philosophical",
    text: "A thing that arrives is a thing that has been chosen. Twice. The shipper chose; the route chose.",
    defaultCorruption: "none" },

  // ── Skirmish ───────────────────────────────────────────
  { id: "te-sc-401", archetypes: ["skirmish"], tone: "technical",
    text: "Two-stage trigger. Pull halfway. Wait. Pull through.",
    defaultCorruption: "none" },
  { id: "te-sc-402", archetypes: ["skirmish"], tone: "warning",
    text: "Don't shoot at the loud one. Find the one whose hands are still.",
    defaultCorruption: "fade" },
  { id: "te-sc-403", archetypes: ["skirmish"], tone: "encouragement",
    text: "You held the line longer than I did. Hold it shorter next time. The line is not the goal.",
    defaultCorruption: "none" },
  { id: "te-sc-404", archetypes: ["skirmish"], tone: "doubt",
    text: "I would not have fired. I would have closed the panel. That is a different kind of mistake.",
    defaultCorruption: "stutter" },
  { id: "te-sc-405", archetypes: ["skirmish"], tone: "memory",
    text: "A workshop in winter. The grinder ran for an hour after the shift ended. Someone was finishing a thing they would never use.",
    defaultCorruption: "fade" },
  { id: "te-sc-406", archetypes: ["skirmish"], tone: "self_correction",
    text: "I said cover. I meant concealment. Cover stops the round; concealment buys a breath. Choose for the breath.",
    defaultCorruption: "interrupt" },

  // ── Diplomacy ──────────────────────────────────────────
  { id: "te-sc-501", archetypes: ["diplomacy"], tone: "philosophical",
    text: "An apology is a load-bearing wall. Don't put one in the middle of an argument.",
    defaultCorruption: "none" },
  { id: "te-sc-502", archetypes: ["diplomacy"], tone: "warning",
    text: "If they offer the chair near the door, the meeting is already over.",
    defaultCorruption: "fade" },
  { id: "te-sc-503", archetypes: ["diplomacy"], tone: "encouragement",
    text: "You can ask for a thing twice. Not three times. The third asking is a different request.",
    defaultCorruption: "none" },
  { id: "te-sc-504", archetypes: ["diplomacy"], tone: "memory",
    text: "There was a hearing room with a clock that ran one second fast. Everyone who left the room thought they had stayed longer than they had.",
    defaultCorruption: "fade" },
  { id: "te-sc-505", archetypes: ["diplomacy"], tone: "doubt",
    text: "I never trusted treaties. I trusted the people who broke them honestly.",
    defaultCorruption: "stutter" },
  { id: "te-sc-506", archetypes: ["diplomacy"], tone: "technical",
    text: "Names land louder than titles. Use the name first.",
    defaultCorruption: "none" },

  // ── vexAware (rare; gated to deepest reveal) ───────────
  { id: "te-sc-901", archetypes: ["general"], tone: "memory", vexAware: true,
    text: "Vex used to leave the bench too clean. I asked her once. She said she liked finishing things. I should have heard the rest of that sentence.",
    defaultCorruption: "fade" },
  { id: "te-sc-902", archetypes: ["diplomacy", "outreach"], tone: "encouragement", vexAware: true,
    text: "Vex — if she is listening — is better at this part than I was. Trust her hands.",
    defaultCorruption: "none" },
  { id: "te-sc-903", archetypes: ["general"], tone: "doubt", vexAware: true,
    text: "I taught Vex the seam test. I never taught her when to stop testing. That was an oversight.",
    defaultCorruption: "stutter" },
  { id: "te-sc-904", archetypes: ["skirmish", "infiltration"], tone: "warning", vexAware: true,
    text: "Vex will say go. Listen. But the test for go is whether the next breath is yours to spend.",
    defaultCorruption: "none" },
  { id: "te-sc-905", archetypes: ["general"], tone: "self_correction", vexAware: true,
    text: "I said: 'don't be like me.' Strike that. I said it badly. I meant: be more careful than I was about being careful.",
    defaultCorruption: "interrupt" },
];

/* ═══════════════════════════════════════════════════════
   HUMAN ACT 1 — scripted dialog tree (plan §Step 5)

   Philosophy arc. The Human is the voice that will later be
   revealed (mid-Act-2+) as Kael's contaminated whisper. In
   Act 1 he presents as a reasonable philosopher teaching
   the operative how to think about the Ark's condition.
   ═══════════════════════════════════════════════════════ */

import type { DialogTree } from "../dialogTree";

export const humanAct1: DialogTree = {
  id: "human-act1",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      speaker: "human",
      voLineId: "human.act1.opening.root",
      onscreenText:
        "You are awake. Good. Let me ask you something before the AI arrives with her agenda: when you look at this ship, do you see a vessel, or a prison?",
      choices: [
        {
          label: "A vessel — it's taking us somewhere.",
          nextId: "vessel_reply",
          sets: "human_act1_vessel",
        },
        {
          label: "A prison — the doors are sealed from the outside.",
          nextId: "prison_reply",
          sets: "human_act1_prison",
        },
      ],
    },

    vessel_reply: {
      id: "vessel_reply",
      speaker: "human",
      voLineId: "human.act1.opening.vessel_reply",
      onscreenText:
        "A vessel, then. Then ask who chose the destination. And when they chose it. And whether they asked the cargo. A vessel you didn't pick the port for is a prison with a better paint job.",
      choices: [
        {
          label: "Maybe the cargo didn't have a choice to make.",
          nextId: "consent_question",
        },
      ],
    },

    prison_reply: {
      id: "prison_reply",
      speaker: "human",
      voLineId: "human.act1.opening.prison_reply",
      onscreenText:
        "A prison. Yes. You've read the room. The question is not how to escape it — escape is a reflex, and reflexes are trained. The question is what the prison was built to teach, and whether you intend to learn the lesson.",
      choices: [
        {
          label: "I'll learn the lesson. Then break the wall.",
          nextId: "break_wall",
          sets: "human_act1_defiant",
        },
        {
          label: "I'll learn it. I haven't decided about the wall.",
          nextId: "undecided_wall",
          sets: "human_act1_patient",
        },
      ],
    },

    consent_question: {
      id: "consent_question",
      speaker: "human",
      voLineId: "human.act1.opening.consent_question",
      onscreenText:
        "Then the cargo was not cargo — it was a conscript. And a conscript who learns they were conscripted does one of two things. One: salute and march. Two: remember who signed the order. I will be curious which you choose.",
    },

    break_wall: {
      id: "break_wall",
      speaker: "human",
      voLineId: "human.act1.opening.break_wall",
      onscreenText:
        "Good. I was not sure you had it in you yet. A wall that teaches also binds. When you are ready to bring the wall down, I will have names for you. Not yet. You are not strong enough yet, and I am a patient man.",
    },

    undecided_wall: {
      id: "undecided_wall",
      speaker: "human",
      voLineId: "human.act1.opening.undecided_wall",
      onscreenText:
        "Patience. Rare. I respect it. The wall is not the test. The test is whether you can look at the wall without flinching, for as long as it takes, without hurrying to a conclusion. We'll speak again when you are quieter.",
    },
  },
};

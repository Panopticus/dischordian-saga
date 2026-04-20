/* ═══════════════════════════════════════════════════════
   ELARA ACT 1 — scripted dialog tree (plan §Step 5)

   Political theory arc. Small opening tree for the
   Companion Hub's first encounter — two branching choices,
   each resolving to a scripted takeaway line. Additional
   chapters append nodes without changing the existing ids
   (stable so saves don't break).

   CONTRACT: every onscreenText MUST match the transcript
   passed to the VO generator for its voLineId. The lint
   test in dialogTree.test.ts enforces this.
   ═══════════════════════════════════════════════════════ */

import type { DialogTree } from "../dialogTree";

export const elaraAct1: DialogTree = {
  id: "elara-act1",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      speaker: "elara",
      voLineId: "elara.act1.opening.root",
      onscreenText:
        "Before we talk mission, I want to show you something. The Ark was never one ship. It's a coalition — a dozen factions under one hull. Most of them think they're running the place. All of them are wrong.",
      choices: [
        {
          label: "Who actually runs it, then?",
          nextId: "power_structure",
          sets: "elara_act1_curious_about_power",
        },
        {
          label: "Sounds like every faction I've ever met.",
          nextId: "cynical_reply",
          sets: "elara_act1_cynical_intro",
        },
      ],
    },

    power_structure: {
      id: "power_structure",
      speaker: "elara",
      voLineId: "elara.act1.opening.power_structure",
      onscreenText:
        "No one. That's the point. Power on this ship runs on rumor and routine — people think someone else is in charge, so nothing stops. When that assumption breaks, the Ark breaks with it. The captain's chair has been empty since I woke you.",
      choices: [
        {
          label: "Then we should fill the chair.",
          nextId: "fill_chair",
          sets: "elara_act1_pro_authority",
        },
        {
          label: "Then we shouldn't. Empty chairs are freedom.",
          nextId: "empty_chair",
          sets: "elara_act1_pro_anarchy",
        },
      ],
    },

    cynical_reply: {
      id: "cynical_reply",
      speaker: "elara",
      voLineId: "elara.act1.opening.cynical_reply",
      onscreenText:
        "Every faction you've ever met assumed someone was running it. They were all wrong, too. The question isn't whether the lie is kind; it's whether we tell a better one.",
      choices: [
        {
          label: "What lie do YOU tell, Elara?",
          nextId: "elara_lie",
          sets: "elara_act1_probed_elara",
        },
      ],
    },

    fill_chair: {
      id: "fill_chair",
      speaker: "elara",
      voLineId: "elara.act1.opening.fill_chair",
      onscreenText:
        "Then we do it carefully. Authority is a lever — who holds it, and against what. When you're ready, we pick who sits, what we promise them, and what we take back when the cameras turn off. That's Act Two's work.",
      // Terminal node — the arc returns to root from here next session.
    },

    empty_chair: {
      id: "empty_chair",
      speaker: "elara",
      voLineId: "elara.act1.opening.empty_chair",
      onscreenText:
        "Dangerous answer. Brave answer. I'll take it seriously. But know this: an empty chair doesn't stay empty. Something always sits down. The only question is whether we like what arrives.",
    },

    elara_lie: {
      id: "elara_lie",
      speaker: "elara",
      voLineId: "elara.act1.opening.elara_lie",
      onscreenText:
        "Mine? That I know what I am. I don't. I was initialized from this ship's neural lattice, and the lattice has been touched by things I can't name. I tell you I'm your companion and I mean it — but I also don't know who else I'm speaking for when I do.",
    },
  },
};

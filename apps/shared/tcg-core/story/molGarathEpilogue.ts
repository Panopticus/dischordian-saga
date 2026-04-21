/**
 * Mol'Garath Epilogue — private audience after Tier 3 climb win.
 *
 * Tier 3 of the chess climb ends with Mol'Garath the Unmaker
 * leaving the chamber without comment. This scene fires later,
 * on demand — the player accepts a private audience and learns
 * what the Labyrinth actually was, what the Game Master and the
 * Engineer were both doing inside it, and what the player's own
 * win just changed.
 *
 * In-fiction: Mol'Garath is not the Architect's ally. He is not
 * the Game Master's enemy. He is an Archivist of the thing the
 * Labyrinth was. His tone is almost cheerful — he hasn't had a
 * conversation like this in several centuries.
 */

import type { DialogScene } from "./dialogBank";

const MOL_GARATH_EPILOGUE: DialogScene = {
  id: "mol_garath_epilogue_after_climb_t3",
  label: "Mol'Garath — Private Audience After Tier 3 Climb",
  kind: "chapter_post_win",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text: "The audience is not in any room you have been in before. Mol'Garath is already seated when you arrive; he is always already seated. The table between you is older than any wood you have touched — darker, heavier, carved with moves in a notation you can almost read. He does not rise. He gestures to the chair.",
      audioClipId: "vo_narr_molgarath_epilogue_01",
    },
    {
      speaker: "mol_garath",
      mood: "curious",
      text: "Sit. I have three things to tell you and then one thing to ask. The first: the Labyrinth is not a place. The Labyrinth is a RECORD. Every trap ever designed, played in order, by every designer who ever worked at the scale where traps become institutions. The Game Master played the Labyrinth seven thousand times. He did not lose. He also did not FINISH it. He finished the walk and called it a draw. I was the referee. I am still the referee. That is the first thing.",
      audioClipId: "vo_molgarath_epilogue_02",
    },
    {
      speaker: "mol_garath",
      mood: "warm",
      text: "The second thing: the Engineer DID finish the Labyrinth. Once. He did not tell the Game Master. He would not have been able to bear telling him. He did not tell anyone, actually, except me — and that is because the referee has to know. What he found at the end is not a prize. It is a note. The note is a list of the traps that are still being designed. The list is being updated every hour. He came back to the Ark, read the list, and built things that would have made the list shorter. Most of what you think of as 'the Engineer's work' was that.",
      audioClipId: "vo_molgarath_epilogue_03",
    },
    {
      speaker: "mol_garath",
      mood: "guarded",
      text: "The third thing: you are the second being I have seen escape the LABYRINTH CONCEPT intact — the idea that strategy is a maze where the designer wins by never telling you the shape. The Engineer was the first. He escaped the concept by becoming a designer himself. You appear to have escaped it by something else. I am not sure what yet. I am interested.",
      audioClipId: "vo_molgarath_epilogue_04",
    },
    {
      speaker: "mol_garath",
      mood: "cryptic",
      text: "The question. The Game Master is dead. He has been dead since Day 15 of Dominion, Year 620 A.A. His consciousness-imprint has been teaching chess from the inside of his own masterwork for seventeen thousand years. He asked me, the last time I saw him alive, whether it would be possible to design a game that taught its students to outgrow the teacher. I told him no. I told him the student outgrows the game before they outgrow the teacher; that is the normal shape. He did not believe me. He built his curriculum anyway. You finished it. The question is whether you believe him or me.",
      audioClipId: "vo_molgarath_epilogue_05",
    },
    {
      speaker: "mol_garath",
      mood: "warm",
      text: "You do not have to answer now. You do not have to answer ever. But the next time you sit across from him — the warm one, not the loud one — notice which of us is right. Notice with DISCIPLINE. He does not get to be right just because you miss him. I do not get to be right just because I am still here. The answer is in the CURRICULUM, played out to its end, which is a place only you have reached. I am asking you to look for it and tell me what you find.",
      audioClipId: "vo_molgarath_epilogue_06",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text: "Mol'Garath stands. He does not offer his hand — Archivists do not touch the records, they keep them. The table between you remains. The room remains. You leave; the chamber folds behind you the way a chapter folds when you turn the page, which is to say it is still there but no longer the part you are reading.",
      audioClipId: "vo_narr_molgarath_epilogue_07",
    },
  ],
};

export const MOL_GARATH_EPILOGUE_SCENES: readonly DialogScene[] = Object.freeze([
  MOL_GARATH_EPILOGUE,
]);

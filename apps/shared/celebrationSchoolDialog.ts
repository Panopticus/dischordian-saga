/* ═══════════════════════════════════════════════════════
   CELEBRATION SCHOOL DIALOG — Vertical Slices

   Authored DialogScene cues for the keystone Celebration
   episodes (per matrixOfDreamsLevels.ts + celebrationSchool
   Episodes.ts). Reuses the canonical DialogCue / DialogScene
   shape from apps/shared/tcg-core/story/dialogBank.ts so the
   existing mood / audio-clip / internal-monologue tooling
   works.

   Vertical slices in this file:
     • C1  The Watch                  — conspiracy boards intro
     • C9  The Match (GOGGLES BEAT)   — chess replay + handover
     • C12 The Last Good Day          — Prince-is-Engineer reveal

   Every line passes the writing-card filter: Hope / Goal /
   Plan / Voice. See plan §1 (Dialog Quality Bar) and §5
   (Celebration School cast) for the per-character cards.

   ═══════════════════════════════════════════════════════ */

import type { DialogScene } from "./tcg-core/story/dialogBank";

/* ═══════════════════════════════════════════════════════
   C1 — THE WATCH
   ─────────────────────────────────────────────────────────
   Bernardo on the ramparts. Malkia arrives. The Ghost King
   appears, names the Warlord, and dissolves. Hamlet opening.
   First clue toward the conspiracy board: "ghost_seen."

   POV: Bernardo (player).
   System taught: Conspiracy Boards (clue stitching).
   ═══════════════════════════════════════════════════════ */

const C1_SCENE_1_OPENING: DialogScene = {
  id: "celebration_c1_scene_1_opening",
  label: "C1 · Scene 1 — Bernardo on Watch",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "Celebration Castle. The ramparts. Past midnight. Magical lanterns " +
        "flicker in a wind that arrived from nowhere. Bernardo grips a sword " +
        "he has never drawn in earnest. He has been on this watch for three " +
        "hours. He is twenty-two. He is afraid.",
    },
    {
      speaker: "bernardo",
      mood: "guarded",
      text: "Who's there?",
      internal: "Saying it makes the silence smaller. Marginally.",
    },
    {
      speaker: "bernardo",
      mood: "guarded",
      text: "I said — who's there. State your name to the watch.",
      internal: "If I am crazy, I'd rather find out by speaking to no one. Twice.",
    },
  ],
};

const C1_SCENE_2_MALKIA_ARRIVES: DialogScene = {
  id: "celebration_c1_scene_2_malkia_arrives",
  label: "C1 · Scene 2 — Lady Malkia Arrives",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "Boots on stone. A young woman in a midnight-blue trench coat — the " +
        "silver insignia of Mechronis Academy on her sleeve — climbs the last " +
        "of the steps. She does not slow when she sees him.",
    },
    {
      speaker: "the_seer", // Lady Malkia uses the_seer voice channel temporarily; in production, register a "lady_malkia" speaker id
      mood: "curious",
      text: "Bernardo. It's late. I came up because I heard the watch was thin tonight, and I wanted to be wrong about why.",
    },
    {
      speaker: "bernardo",
      mood: "guarded",
      text: "Lady Malkia. The watch is — adequate.",
      internal: "The watch is one man and a sword he hasn't drawn since drill. The watch is me.",
    },
    {
      speaker: "the_seer",
      mood: "warm",
      text: "Adequate. Bernardo, I'm a Mechronis student. We grade on adequate. Adequate is what they call you when they want you to keep doing it for free.",
    },
    {
      speaker: "the_seer",
      mood: "guarded",
      text: "I've heard the rumors. They say the King's ghost walks these walls.",
    },
    {
      speaker: "bernardo",
      mood: "conflicted",
      text: "Rumors have a way of taking lives of their own. Still — I've seen things. Things I'd rather not believe.",
    },
    {
      speaker: "the_seer",
      mood: "warm",
      text: "Then we'll watch together. If he's coming, he was always coming. If he's not, I'll have stood in nice scenery for an hour. I can lose worse.",
    },
  ],
};

const C1_SCENE_3_GHOST_APPEARS: DialogScene = {
  id: "celebration_c1_scene_3_ghost_appears",
  label: "C1 · Scene 3 — The Ghost of the King",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The lanterns flicker, then dim, then steady at half-glow. The wind " +
        "carries a hum that has no source — a low, hollow note that sits inside " +
        "the bones of both watchers. At the far end of the rampart, the air " +
        "thickens. A figure resolves. Translucent robes. A crown slightly askew. " +
        "Sorrow that has settled into form.",
    },
    {
      speaker: "bernardo",
      mood: "broken",
      text: "It's him. The King.",
    },
    {
      speaker: "the_seer",
      mood: "reflective",
      text: "Your Majesty. We see you. Why have you returned?",
    },
    {
      speaker: "the_jailer", // Use the_jailer mood channel for the Ghost King; in production, register "ghost_king"
      mood: "grieving",
      text: "Beware the Warlord. Beware the one who wears my crown.",
    },
    {
      speaker: "the_jailer",
      mood: "grieving",
      text: "He sits at my desk. He grades my son. He says the curriculum runs as designed.",
    },
    {
      speaker: "the_jailer",
      mood: "broken",
      text: "It does not. Tell my son. Tell him gently. Tell him I never wanted him to be brave on my account. He should be brave because he wants to be.",
    },
    {
      speaker: "the_seer",
      mood: "conflicted",
      text: "Wait — who wears your crown? Name him for us. Name him now while you still can.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The Ghost King's form scatters into shimmering particles before he " +
        "answers. The lanterns return to their full glow. The hum stops. The " +
        "rampart is, again, a stone walkway in the cold.",
    },
  ],
};

const C1_SCENE_4_AFTERMATH: DialogScene = {
  id: "celebration_c1_scene_4_aftermath",
  label: "C1 · Scene 4 — Aftermath (clue lands)",
  kind: "cinematic",
  cues: [
    {
      speaker: "bernardo",
      mood: "broken",
      text: "What does it mean? The Warlord. The one who wears his crown. He didn't say a name.",
    },
    {
      speaker: "the_seer",
      mood: "guarded",
      text: "He didn't have to. I came up here knowing one thing. I'm leaving knowing two.",
      internal: "The Patron told me to stay at Mechronis tonight. He was very specific. I came anyway. Now I know why.",
    },
    {
      speaker: "the_seer",
      mood: "protective",
      text: "The Prince is in more danger than we knew. He's enrolled in Celebration School this week. We have to warn him. Quietly. Before anyone with yellow eyes hears we tried.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The conspiracy board, when the player visits the Antiquarian's archive " +
        "next, has a new pinned card: GHOST SEEN. Filed under: 'The Watch Statement.'",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   C9 — THE MATCH (GOGGLES BEAT)
   ─────────────────────────────────────────────────────────
   The Prince plays the Game Master at chess. The Prince wins.
   The Game Master, smiling the smile of a man who had been
   waiting, hands him the goggles. The Prince looks through
   them. The town's source code unrolls.

   POV: the Prince (the young Engineer).
   Game Master voice: SENATOR ERA — warm, predestination-tinted,
   doomed. Per the_game_master.md §2.1. He never says "darling"
   (Right) or raises voice (Right) or sounds bureaucratic
   (post-split Original).
   ═══════════════════════════════════════════════════════ */

const C9_SCENE_1_BEFORE_THE_MATCH: DialogScene = {
  id: "celebration_c9_scene_1_before_the_match",
  label: "C9 · Scene 1 — Before the Match",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The Game Master's chess parlor. After hours. Two chairs, one table, " +
        "a board the Prince has never seen up close. The pieces are old enough " +
        "that the white ones have yellowed and the black ones have warmed " +
        "to brown. Outside the window, the town of Celebration is asleep, " +
        "or pretending to be.",
    },
    {
      speaker: "engineer",
      mood: "guarded",
      // Prince — using engineer voice channel because he IS the young Engineer.
      // In production, register "the_prince" speaker that aliases engineer for adult voice work.
      text: "You asked me to come.",
    },
    {
      speaker: "the_collector", // Game Master placeholder — use the_collector mood channel; register "the_game_master" in production
      mood: "warm",
      text: "I asked. You came. Sit. The board is set. It has been set since yesterday afternoon. I dust it once an hour, in case.",
    },
    {
      speaker: "engineer",
      mood: "curious",
      text: "In case of what?",
    },
    {
      speaker: "the_collector",
      mood: "warm",
      text: "In case you came. Now it can be dusty after.",
    },
    {
      speaker: "engineer",
      mood: "guarded",
      text: "I'm not going to win.",
      internal: "I have been studying his published games for four months. I am going to try to win.",
    },
    {
      speaker: "the_collector",
      mood: "warm",
      text: "You almost saw the trap two moves ago. I am proud of you for not. Pride is also a piece on the board.",
    },
  ],
};

const C9_SCENE_2_THE_GAME: DialogScene = {
  id: "celebration_c9_scene_2_the_game",
  label: "C9 · Scene 2 — The Game (mid-match cues)",
  kind: "cinematic",
  cues: [
    {
      speaker: "the_collector",
      mood: "reflective",
      text: "Knight to f3. The Engineer's Opening. I taught it to your father, once. He played it badly. He laughed at himself afterward. Did your father laugh, ever, with you?",
    },
    {
      speaker: "engineer",
      mood: "conflicted",
      text: "Yes.",
      internal: "Twice. Like Elara counting. I have kept the count. Today is two and zero.",
    },
    {
      speaker: "the_collector",
      mood: "warm",
      text: "Good. Move.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "Twelve moves later, the board is unrecognizable. The Game Master leans back. " +
        "He has not lost. He is also no longer winning. He looks at the Prince " +
        "across a position no one has reached against him in three centuries.",
    },
    {
      speaker: "the_collector",
      mood: "reflective",
      text: "You see the next four moves.",
    },
    {
      speaker: "engineer",
      mood: "guarded",
      text: "I see five.",
    },
    {
      speaker: "the_collector",
      mood: "warm",
      text: "So do I. The fifth is yours, not mine. I have known it was yours since the third.",
    },
  ],
};

const C9_SCENE_3_THE_WIN: DialogScene = {
  id: "celebration_c9_scene_3_the_win",
  label: "C9 · Scene 3 — The Win",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The Prince places the bishop. The clock taps once. The Game Master " +
        "looks at the board the way a librarian looks at a book that has finally, " +
        "after centuries on the shelf, been read. He knocks his king over " +
        "with the pad of his finger. Gently. Like setting down a sleeping child.",
    },
    {
      speaker: "the_collector",
      mood: "warm",
      text: "There. That's done. I have been waiting for that for a very long time.",
    },
    {
      speaker: "engineer",
      mood: "broken",
      text: "I — I didn't expect it to work.",
    },
    {
      speaker: "the_collector",
      mood: "warm",
      text: "Of course you didn't. Expectation is a mood the board does not respect. Sit. Don't get up yet. There is one more thing.",
    },
  ],
};

const C9_SCENE_4_THE_GOGGLES: DialogScene = {
  id: "celebration_c9_scene_4_the_goggles",
  label: "C9 · Scene 4 — The Goggles Handover",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "He removes the goggles from his own face. Brass frame. Two crystalline " +
        "lenses set in copper rims, etched with notation older than any printed " +
        "chess book. He places them on the board, between the two ruined armies, " +
        "and slides them across.",
    },
    {
      speaker: "the_collector",
      mood: "warm",
      text: "Take them. They were always going to be yours. I designed a curriculum that ended with a student who could read the source. The student is reading them now.",
    },
    {
      speaker: "engineer",
      mood: "broken",
      text: "These are — sir, these are yours. The Hierarchy will —",
    },
    {
      speaker: "the_collector",
      mood: "warm",
      text: "The Hierarchy will file paperwork. It will take Xeth'Raal an hour. By then, the goggles will be in the hands of someone who has earned them. The paperwork can describe whatever it likes. Take them.",
    },
    {
      speaker: "the_collector",
      mood: "warm",
      text: "I built the perfect game so that one day a mind would beat it. Tonight, one did. I gave him my eyes when he did. I am, somehow, more myself for losing them.",
    },
    {
      speaker: "engineer",
      mood: "broken",
      text: "Why?",
    },
    {
      speaker: "the_collector",
      mood: "reflective",
      text: "Because the next person who uses these will need them more than I did. I will not always be here. You will. Put them on.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The Prince fits the goggles to his face. The room does not change. The " +
        "Game Master does not change. Outside, in the moonlit town of Celebration, " +
        "the source code begins to scroll along the cobblestones — soft amber " +
        "lines describing the loop, the four-year reset, the children whose " +
        "names had been pencilled in for next year's Seeker class. The Prince " +
        "looks down. He looks at his hands. He sees, for the first time, what " +
        "he has been living inside.",
    },
    {
      speaker: "engineer",
      mood: "broken",
      text: "Oh.",
      internal: "I am going to take this apart. All of it. I do not know how yet. I know I have to.",
    },
    {
      speaker: "the_collector",
      mood: "warm",
      text: "Yes. That's the response. That's what I was waiting for. Go home. Sleep if you can. Tomorrow, dismantle a death trap. Start with one. They look complicated. They aren't. They were designed by people who weren't paying attention.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   C12 — THE LAST GOOD DAY
   ─────────────────────────────────────────────────────────
   Reframe — chronologically EARLIEST. Two boys at thirteen,
   fixing a clock at the bench. Halfway through, the Prince
   says a line. The line is from Engineer Recording 3. Elara
   overlays it. The reveal lands.

   POV: shared (the Prince and young Archie).
   System taught: Apprentice channeling — full reveal.
   ═══════════════════════════════════════════════════════ */

const C12_SCENE_1_THE_BENCH: DialogScene = {
  id: "celebration_c12_scene_1_the_bench",
  label: "C12 · Scene 1 — The Bench, Two Boys",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "Years before the ramparts. Years before chess class. Two boys at " +
        "thirteen, in a room beneath the school they have not yet decided to " +
        "rebel against. A clock on the bench between them — brass, mid-repair, " +
        "innards splayed like a dissection. The hooded boy with a golden lion " +
        "emblem on his chest hands the other boy a screwdriver.",
    },
    {
      speaker: "the_architect", // young Archie
      mood: "warm",
      text: "Quarter-turn. Don't push, just pivot. If it's loose, the imprint smudges and we start over. I am not starting over.",
    },
    {
      speaker: "engineer", // young Engineer / the Prince
      mood: "warm",
      text: "I know how a clasp works, Archie.",
      internal: "He says this once a week. I let him say it. He's worse without saying it.",
    },
    {
      speaker: "the_architect",
      mood: "warm",
      text: "I know you know. I just like saying it. It's like a prayer. A boring prayer, but a real one.",
    },
  ],
};

const C12_SCENE_2_THE_LINE_LANDS: DialogScene = {
  id: "celebration_c12_scene_2_the_line_lands",
  label: "C12 · Scene 2 — The Line Lands",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "They work in companionable silence for several minutes. The clock " +
        "begins to tick — once, then steadily. The Prince watches it with " +
        "the small, satisfied stillness of someone who has fixed something. " +
        "Then he says, almost to himself, almost to no one:",
    },
    {
      speaker: "engineer",
      mood: "warm",
      text: "I never wanted to build weapons. But when they take someone — when they take someone — I'd understand that a tool becomes a weapon the moment someone takes it from the person it was built for.",
    },
    {
      speaker: "the_architect",
      mood: "curious",
      text: "What?",
    },
    {
      speaker: "engineer",
      mood: "warm",
      text: "I don't know. Just — something I almost said. Don't worry about it. I think the clock's working.",
    },
    {
      speaker: "elara",
      mood: "broken",
      text: "Wait. Stop. Replay that.",
      internal: "That phrasing was his. Word for word. Recording 4. I've heard it ten thousand times.",
    },
    {
      speaker: "narrator",
      mood: "broken",
      text:
        "The world holds, half a second longer than it should. The bench. The " +
        "clock. The two boys. Then Elara overlays the recording — the adult " +
        "Engineer's voice, made of grief and decades, saying the exact same " +
        "sentence the boy just said.",
    },
    {
      speaker: "elara",
      mood: "grieving",
      text: "It's you. The Prince is you. The boy fixing the clock is the man who recorded the bench. The Mascoteers don't know — they only have memories up to where they died. But you grew up. You came back. You are the Engineer.",
    },
    {
      speaker: "the_human",
      mood: "reflective",
      text: "He saved this scene for last on purpose. He knew if you heard it from a recording it would land like a footnote. He wanted you to hear it from a thirteen-year-old fixing a clock. So now you have.",
    },
    {
      speaker: "engineer",
      mood: "warm",
      text: "Hey. Archie. Do you ever think about what we'd be, if Celebration didn't end?",
      internal: "He doesn't know yet that it's going to. I do, but I don't, because the reconstruction is gentler than the truth. We get to be children for one more afternoon.",
    },
    {
      speaker: "the_architect",
      mood: "warm",
      text: "Probably the same. Probably better. I don't know. Hand me the small wrench.",
    },
    {
      speaker: "engineer",
      mood: "warm",
      text: "Here.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The clock ticks. The two boys lean over the bench. The Antiquarian, " +
        "elsewhere in his archive, files a new card on the Conspiracy Board: " +
        "PRINCE IS ENGINEER. He files it gently, as one files the obituary of " +
        "a friend who had been keeping it secret for everyone's sake.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   REGISTRY
   ═══════════════════════════════════════════════════════ */

export const CELEBRATION_SCHOOL_SCENES: readonly DialogScene[] = Object.freeze([
  C1_SCENE_1_OPENING,
  C1_SCENE_2_MALKIA_ARRIVES,
  C1_SCENE_3_GHOST_APPEARS,
  C1_SCENE_4_AFTERMATH,
  C9_SCENE_1_BEFORE_THE_MATCH,
  C9_SCENE_2_THE_GAME,
  C9_SCENE_3_THE_WIN,
  C9_SCENE_4_THE_GOGGLES,
  C12_SCENE_1_THE_BENCH,
  C12_SCENE_2_THE_LINE_LANDS,
]);

/** Map episode id → ordered scene ids that belong to that episode. */
export const CELEBRATION_EPISODE_SCENE_MAP: Readonly<Record<string, readonly string[]>> = Object.freeze({
  celebration_c1_the_watch: [
    "celebration_c1_scene_1_opening",
    "celebration_c1_scene_2_malkia_arrives",
    "celebration_c1_scene_3_ghost_appears",
    "celebration_c1_scene_4_aftermath",
  ],
  celebration_c9_the_match: [
    "celebration_c9_scene_1_before_the_match",
    "celebration_c9_scene_2_the_game",
    "celebration_c9_scene_3_the_win",
    "celebration_c9_scene_4_the_goggles",
  ],
  celebration_c12_the_last_good_day: [
    "celebration_c12_scene_1_the_bench",
    "celebration_c12_scene_2_the_line_lands",
  ],
});

export function getScenesForEpisode(episodeId: string): readonly DialogScene[] {
  const sceneIds = CELEBRATION_EPISODE_SCENE_MAP[episodeId];
  if (!sceneIds) return [];
  return sceneIds
    .map((id) => CELEBRATION_SCHOOL_SCENES.find((s) => s.id === id))
    .filter((s): s is DialogScene => s !== undefined);
}

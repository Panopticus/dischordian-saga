/* ═══════════════════════════════════════════════════════
   CELEBRATION SCHOOL DIALOG — PART 2

   Authored DialogScene cues for the 9 non-keystone Celebration
   episodes (C2-C8, C10-C11). Keystones (C1, C9, C12) live in
   celebrationSchoolDialog.ts. Both files merge into the same
   registry.

   Voice discipline (per plan §1):
     - Game Master never says "darling" (Right register)
     - Game Master never raises voice (post-split forbidden)
     - The Prince's voice already carries Engineer-isms — by
       design; reveal lands at C12.
     - Antiquarian: archival, treats grief like a vintage.
     - Mascoteers (per celebrationTrial.ts canon): each kid
       Archon Dreamer-coded, warm, distinct.
   ═══════════════════════════════════════════════════════ */

import type { DialogScene } from "./tcg-core/story/dialogBank";

/* ═══════════════════════════════════════════════════════
   C2 — FIRST DAY
   ═══════════════════════════════════════════════════════ */

const C2_SCENE_1_GATES: DialogScene = {
  id: "celebration_c2_scene_1_gates",
  label: "C2 · Scene 1 — At the Gates",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "Morning. The cobblestone path to Celebration School is bright with " +
        "fresh-pressed uniforms and nervous laughter. The Prince walks slowly. " +
        "His sketchbook is heavy in his arm.",
    },
    {
      speaker: "engineer",
      mood: "guarded",
      text: "This is what you wanted, Uncle. But I won't die here.",
      internal: "I'm thirteen. I am told this matters. I am told a lot of things.",
    },
    {
      speaker: "vernon_vortex",
      mood: "menacing",
      text: "Didn't think I'd get fresh meat this early in the year. What's your name, trench coat?",
    },
    {
      speaker: "engineer",
      mood: "guarded",
      text: "None of your business.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "From the cloister window, the Game Master watches without moving. " +
        "He is already smiling — a small, private smile. He has been waiting " +
        "for the boy in the red trench coat for several decades.",
    },
  ],
};

const C2_SCENE_2_FIRST_LESSON: DialogScene = {
  id: "celebration_c2_scene_2_first_lesson",
  label: "C2 · Scene 2 — First Lesson (cards as student tools)",
  kind: "cinematic",
  cues: [
    {
      speaker: "the_collector",
      mood: "warm",
      text:
        "Class. Open your starter decks. They are forty cards each. None of " +
        "them are good. None of them are supposed to be. Tools first; mastery " +
        "after. Place a unit. Any unit. Watch what the board does.",
    },
    {
      speaker: "engineer",
      mood: "curious",
      text: "It moves before I touch the next card.",
    },
    {
      speaker: "the_collector",
      mood: "warm",
      text: "Yes. The board is also a player. Most of you will spend three years not noticing. You are not most of you. Continue.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   C3 — CHESS CLASS
   ═══════════════════════════════════════════════════════ */

const C3_SCENE_1_THE_LESSON: DialogScene = {
  id: "celebration_c3_scene_1_the_lesson",
  label: "C3 · Scene 1 — Chess Class",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "Chess parlor. Eighteen students at nine boards. The Game Master walks " +
        "between them with the unhurried gait of a man who has nowhere he would " +
        "rather be. He stops at the Prince's board. He does not move a piece.",
    },
    {
      speaker: "the_collector",
      mood: "warm",
      text: "Pawn structure. The bones. We start there because the bones decide everything else, and most of you will not look at the bones again until you are losing.",
    },
    {
      speaker: "the_collector",
      mood: "reflective",
      text: "Move your e-pawn two squares. Good. Now move it three. You can't. Why?",
    },
    {
      speaker: "engineer",
      mood: "curious",
      text: "Because a pawn doesn't move three.",
    },
    {
      speaker: "the_collector",
      mood: "warm",
      text: "Wrong. Because nobody told the pawn it could. The rules are descriptive of habit, not law. I want you to remember that. It will matter, eventually.",
      internal: "(He looks at the Prince a beat too long. The Prince does not yet know why.)",
    },
    {
      speaker: "the_collector",
      mood: "warm",
      text: "Class. The opening is a question. The middlegame is the argument. The endgame is whether you remember what you were arguing about. Continue.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   C4 — UNDER THE FLOOR
   ═══════════════════════════════════════════════════════ */

const C4_SCENE_1_THE_LAIR: DialogScene = {
  id: "celebration_c4_scene_1_the_lair",
  label: "C4 · Scene 1 — Mascoteers' Lair",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "A trapdoor under the cafeteria. Stone steps. Glowing crystals. A round " +
        "table cluttered with mechanical parts and a half-built device that hums " +
        "softly when the Prince enters the room. Wanda is welding. Minnie is at " +
        "a console. Shiyon is drawing on the wall in a paint that doesn't smell " +
        "like paint.",
    },
    {
      speaker: "minnie_the_meme",
      mood: "warm",
      text: "Welcome to the rebellion, trench coat. Watch your head — Wanda's arm has a mind of its own and the mind is grumpy today.",
    },
    {
      speaker: "the_architect",
      mood: "warm",
      text: "Don't listen to her. The arm is fine. Wanda. The arm is fine. Tell her the arm is fine.",
    },
    {
      speaker: "wanda_wyrlord",
      mood: "guarded",
      text: "The arm is fine. The arm is welding. The arm is busy.",
    },
    {
      speaker: "the_architect",
      mood: "warm",
      text:
        "You draw. I build. We could try together. I'm working on something — " +
        "an imprint laser. It writes a card from a sketch. The sketch has to be " +
        "correct in a specific way. I think your sketches are correct in that way.",
    },
    {
      speaker: "engineer",
      mood: "warm",
      text: "Show me.",
    },
    {
      speaker: "the_architect",
      mood: "warm",
      text:
        "Quarter-turn the binder. Don't push, just pivot. If it's loose, the " +
        "imprint smudges and we start over. I am not starting over. The bench " +
        "hums. You hear that? That's the third frequency. We don't know whose " +
        "it is. I think it might be yours.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   C5 — THE BANNER GLITCHES
   ═══════════════════════════════════════════════════════ */

const C5_SCENE_1_THE_SQUARE: DialogScene = {
  id: "celebration_c5_scene_1_the_square",
  label: "C5 · Scene 1 — The Square",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "Town square. The recruitment banner floats above the cobblestones in " +
        "shimmering golden script: CELEBRATION SCHOOL PROJECT — SEEKERS WANTED. " +
        "Stars swirl around the text. Children chase glowing butterflies. The " +
        "Prince watches the banner. He has the goggles in his coat pocket. He " +
        "has not yet put them on. He doesn't need to.",
    },
    {
      speaker: "engineer",
      mood: "guarded",
      text: "It just flickered. The whole banner. Did anyone else see that?",
    },
    {
      speaker: "shadow_tongue",
      mood: "cryptic",
      text:
        "They didn't. They never do. The edits sit underneath the text — faces " +
        "that were not invited but stayed anyway. I am the layer that does the " +
        "editing. I am pleased you noticed. Most do not. Most are not supposed to.",
    },
    {
      speaker: "engineer",
      mood: "broken",
      text: "Who are the faces?",
    },
    {
      speaker: "shadow_tongue",
      mood: "cryptic",
      text:
        "Children. Last year's Seekers. The year before's. The year before that's. " +
        "The school graduates one Seeker per year. The rest are cataloged here, " +
        "in the propaganda layer, where they can be edited into something easier " +
        "to remember. I do my work. The work is to make the loss legible.",
    },
    {
      speaker: "engineer",
      mood: "guarded",
      text: "I don't want them edited.",
      internal: "I want them BACK. I want to read what was edited out. I want to know whose work this is.",
    },
    {
      speaker: "shadow_tongue",
      mood: "warm",
      text: "Then write the unedited version. I will leave a margin for you. I always do, for the ones who notice. Most do not notice. You did. That is the entirety of the difference.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   C6 — THE DUELING COURT
   ═══════════════════════════════════════════════════════ */

const C6_SCENE_1_THE_CHALLENGE: DialogScene = {
  id: "celebration_c6_scene_1_the_challenge",
  label: "C6 · Scene 1 — The Challenge",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The dueling court. Stone benches in a ring. Vernon Vortex stands at the " +
        "platform, hands crackling with electricity. The crowd is small. The " +
        "Game Master sits in the highest seat, alone. He is not officiating. He " +
        "just happens to be there.",
    },
    {
      speaker: "vernon_vortex",
      mood: "menacing",
      text: "Trench coat. Court. Now. I challenge. You can refuse — refusing counts as a loss. Either way I get to write you down.",
    },
    {
      speaker: "engineer",
      mood: "guarded",
      text: "I'll play.",
      internal: "He doesn't know what I have. He doesn't know what the goggles see. I am about to be unfair without meaning to.",
    },
  ],
};

const C6_SCENE_2_THE_DUEL: DialogScene = {
  id: "celebration_c6_scene_2_the_duel",
  label: "C6 · Scene 2 — The Duel",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The Prince flips open his sketchbook. With a single confident stroke he " +
        "draws a swirling barrier. It materializes mid-air, shimmering. Vernon " +
        "raises his hand and releases a crackling bolt of electricity. The bolt " +
        "slams into the barrier. The barrier holds. Vernon's smile begins to " +
        "fade.",
    },
    {
      speaker: "vernon_vortex",
      mood: "menacing",
      text: "What — what kind of card is that?",
    },
    {
      speaker: "engineer",
      mood: "warm",
      text: "It's not a card. I drew it.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "Vernon throws everything. The Prince's pencil moves; the barriers " +
        "rotate, bloom, layer. After ninety seconds Vernon is on his back, smoke " +
        "rising faintly from his hands, the platform scorched in a pattern that " +
        "looks, viewed from the highest seat, like a chess opening.",
    },
    {
      speaker: "the_collector",
      mood: "warm",
      text: "Match concluded. Vernon: report to the infirmary. Trench coat: stay a moment. I'd like to ask you what you saw.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   C7 — THE PATRON'S SUMMONS
   ═══════════════════════════════════════════════════════ */

const C7_SCENE_1_COURTYARD: DialogScene = {
  id: "celebration_c7_scene_1_courtyard",
  label: "C7 · Scene 1 — The Courtyard",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "Castle courtyard, after dark. The Uncle steps from the shadow of an " +
        "archway. His robe glimmers faintly. His eyes are the wrong yellow. Lady " +
        "Malkia stops, recognizes the wrongness, does not let her face show it.",
    },
    {
      speaker: "the_jailer",
      mood: "menacing",
      text: "Lady Malkia. A bit late for a stroll, don't you think?",
    },
    {
      speaker: "the_seer",
      mood: "guarded",
      text: "I was heading to speak with the Prince. It's urgent.",
    },
    {
      speaker: "the_jailer",
      mood: "menacing",
      text: "Urgent. You seem troubled, my dear. Your brow is furrowed. Your steps are quick. Something weighs on you.",
    },
    {
      speaker: "the_seer",
      mood: "guarded",
      text: "I've seen something I can't explain. The ghost of the King —",
    },
    {
      speaker: "the_jailer",
      mood: "menacing",
      text: "Superstitions. We have no time for childish ghost stories. As it happens, your patron at Mechronis has summoned you. A special Game. Tonight. Now. Or your absence will be reflected on your record. Permanently.",
    },
    {
      speaker: "the_seer",
      mood: "guarded",
      text: "Does the Prince know I've been summoned?",
    },
    {
      speaker: "the_jailer",
      mood: "menacing",
      text: "The Prince is a busy young man now that he is enrolled in school. Go, Lady Malkia. Don't keep your patron waiting.",
    },
  ],
};

const C7_SCENE_2_WITNESSING_CHOICE: DialogScene = {
  id: "celebration_c7_scene_2_witnessing_choice",
  label: "C7 · Scene 2 — Witnessing Choice",
  kind: "cinematic",
  cues: [
    {
      speaker: "the_seer", // young Seer cameo, narrator-channel mood for clarity
      mood: "reflective",
      text:
        "There is a moment between the Uncle's command and Malkia's footsteps " +
        "where she has not yet decided. The witnessing layer records it. I, the " +
        "Seer, am younger now than the player has met me — but already I see the " +
        "moment from both sides. The choice is hers. The recording is mine. I am " +
        "not telling her what to do. I am telling her that I will remember.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "Three branches open. The player chooses one for Malkia. Each is a " +
        "Witnessing variant: COMPLY (go quietly to the Game), REFUSE (defy the " +
        "Uncle), QUESTION (demand the Prince be told). The Witnessing meter " +
        "registers the choice. The Seer files it. The Uncle does not yet know " +
        "which.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   C8 — THE GHOST IN THE HALL
   ═══════════════════════════════════════════════════════ */

const C8_SCENE_1_THE_HALL: DialogScene = {
  id: "celebration_c8_scene_1_the_hall",
  label: "C8 · Scene 1 — The Hall",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "A long hall in the school's east wing, after curfew. Portraits of dead " +
        "headmasters watch from gilt frames. Three of them have been edited; the " +
        "edits are visible only to someone wearing the goggles. The Prince is " +
        "wearing the goggles. The Ghost King resolves at the far end of the hall.",
    },
    {
      speaker: "the_jailer",
      mood: "grieving",
      text: "My son.",
    },
    {
      speaker: "engineer",
      mood: "broken",
      text: "Father.",
      internal: "I have not used that word out loud since the funeral. I had forgotten how it sits in the mouth.",
    },
    {
      speaker: "the_jailer",
      mood: "grieving",
      text: "Beware the Warlord. Beware the one who wears my crown. He sits at my desk. He grades you. He says the curriculum runs as designed. It does not.",
    },
    {
      speaker: "engineer",
      mood: "broken",
      text: "How do I stop him?",
    },
    {
      speaker: "the_jailer",
      mood: "grieving",
      text: "You don't stop him by killing him. You stop him by reading what he is, and by writing something else over the top. You have the eyes for it. I gave you eyes by being your father. He gave you better eyes by losing to you. Use both.",
    },
  ],
};

const C8_SCENE_2_THE_DREAMERS_HUM: DialogScene = {
  id: "celebration_c8_scene_2_the_dreamers_hum",
  label: "C8 · Scene 2 — The Dreamer's Hum",
  kind: "cinematic",
  cues: [
    {
      speaker: "the_dreamer",
      mood: "warm",
      text:
        "(barely audible, almost a lullaby underneath the Ghost's words)\n" +
        "…be brave because you want to be. Not because he asked. Wake gently. " +
        "I'm here. I'm trying to wake. I'm sorry I'm slow.",
    },
    {
      speaker: "engineer",
      mood: "broken",
      text: "Who is that?",
    },
    {
      speaker: "the_jailer",
      mood: "grieving",
      text:
        "Someone who loves you the way I loved you, when she is awake. She is " +
        "not awake yet. She will be. You can help.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The Ghost King dissolves. The Dreamer's hum continues for a beat, then " +
        "fades. The Prince stands alone in the hall with three edited portraits " +
        "and a meter — visible to him through the goggles — that has shifted " +
        "very slightly toward the Dreamer's side.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   C10 — THE ARKS RISE
   ═══════════════════════════════════════════════════════ */

const C10_SCENE_1_THE_BUILD: DialogScene = {
  id: "celebration_c10_scene_1_the_build",
  label: "C10 · Scene 1 — The Build",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The lair. Sparks. Hammered metal. The Inception Arks are nearly complete " +
        "— sleek, finned, glowing with magical runes Shiyon has tagged across " +
        "their hulls in symbols that the propaganda layer cannot edit. The Prince " +
        "wears the goggles. He sees the engine spec scrolling in the air around " +
        "the half-built core. He is sketching.",
    },
    {
      speaker: "the_architect",
      mood: "warm",
      text: "Your sketch. I can read it. The engine reads it. Wanda — weld the third coupling. We're nearly there.",
    },
    {
      speaker: "wanda_wyrlord",
      mood: "guarded",
      text: "Welding. The arm is fine. The arm is busy.",
    },
    {
      speaker: "minnie_the_meme",
      mood: "warm",
      text: "I've masked our energy signature. The school's network thinks we're in geology lab. Geology lab does not exist. They have not noticed yet.",
    },
    {
      speaker: "engineer",
      mood: "warm",
      text:
        "The third frequency. I can finally hear it. It's the engine. The engine " +
        "is humming the same note as the bench. Archie — the bench was always a " +
        "small Ark, wasn't it?",
    },
    {
      speaker: "the_architect",
      mood: "warm",
      text: "I think it always was. I think you knew before I did. I think we'd better hurry.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   C11 — THE UNCLE'S VERDICT
   ═══════════════════════════════════════════════════════ */

const C11_SCENE_1_THE_BREACH: DialogScene = {
  id: "celebration_c11_scene_1_the_breach",
  label: "C11 · Scene 1 — The Breach",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The lair door explodes inward. Stone shards and sparks. In the dust " +
        "stands the Uncle — but the Uncle is no longer wearing only the Uncle. " +
        "Silver nanobots pour from his sleeves and reform around him. The swarm " +
        "speaks with his voice. Then the swarm speaks with his voice plus other " +
        "voices. Then the swarm speaks with no voice the children recognize.",
    },
    {
      speaker: "the_jailer", // The Warlord — using the_jailer mood channel
      mood: "menacing",
      text: "Did you really think you could escape me? This is my world. My design. You will all be part of it.",
    },
    {
      speaker: "engineer",
      mood: "broken",
      text:
        "You don't own me. You don't own Celebration. I have read your edits. " +
        "I am writing over them.",
    },
  ],
};

const C11_SCENE_2_THE_VERDICT: DialogScene = {
  id: "celebration_c11_scene_2_the_verdict",
  label: "C11 · Scene 2 — The Verdict",
  kind: "cinematic",
  cues: [
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The trial begins — the prequel form of the Authority Trial the player " +
        "later knows from Act 1. Ten phases. The verdict is fixed: Celebration " +
        "falls. The player's job is to lose well — to evacuate as many " +
        "Mascoteers as possible while the swarm consumes the lair. The Prince " +
        "directs the Arks. Archie covers the door with welded plating that will " +
        "not hold. Minnie pulls one last hack that buys ninety seconds. Shiyon " +
        "tags the wall with a single word: REMEMBER.",
    },
    {
      speaker: "the_jailer",
      mood: "menacing",
      text:
        "You can't win, boy. I'll always be here. Celebration will always be mine.",
    },
    {
      speaker: "engineer",
      mood: "broken",
      text: "Not today. Not all of it. I'm taking what I can. I'm coming back for the rest.",
      internal: "I am thirteen. I am leaving home. I am writing the rest down. He is going to be furious for the next four hundred years.",
    },
    {
      speaker: "narrator",
      mood: "reflective",
      text:
        "The Arks rise. The lair collapses. The first Celebration burns. The " +
        "Conspiracy Board, in the Antiquarian's archive, gains two new pinned " +
        "cards: WARLORD REVEALED, and underneath it, FIRST CELEBRATION DESTROYED. " +
        "The Antiquarian files them gently. He has been expecting them for some " +
        "time.",
    },
  ],
};

/* ═══════════════════════════════════════════════════════
   REGISTRY (part 2 — merged in celebrationSchoolDialog.ts)
   ═══════════════════════════════════════════════════════ */

export const CELEBRATION_SCHOOL_SCENES_PART_2: readonly DialogScene[] = Object.freeze([
  C2_SCENE_1_GATES,
  C2_SCENE_2_FIRST_LESSON,
  C3_SCENE_1_THE_LESSON,
  C4_SCENE_1_THE_LAIR,
  C5_SCENE_1_THE_SQUARE,
  C6_SCENE_1_THE_CHALLENGE,
  C6_SCENE_2_THE_DUEL,
  C7_SCENE_1_COURTYARD,
  C7_SCENE_2_WITNESSING_CHOICE,
  C8_SCENE_1_THE_HALL,
  C8_SCENE_2_THE_DREAMERS_HUM,
  C10_SCENE_1_THE_BUILD,
  C11_SCENE_1_THE_BREACH,
  C11_SCENE_2_THE_VERDICT,
]);

export const CELEBRATION_EPISODE_SCENE_MAP_PART_2: Readonly<Record<string, readonly string[]>> = Object.freeze({
  celebration_c2_first_day: [
    "celebration_c2_scene_1_gates",
    "celebration_c2_scene_2_first_lesson",
  ],
  celebration_c3_chess_class: ["celebration_c3_scene_1_the_lesson"],
  celebration_c4_under_the_floor: ["celebration_c4_scene_1_the_lair"],
  celebration_c5_the_banner_glitches: ["celebration_c5_scene_1_the_square"],
  celebration_c6_the_dueling_court: [
    "celebration_c6_scene_1_the_challenge",
    "celebration_c6_scene_2_the_duel",
  ],
  celebration_c7_the_patrons_summons: [
    "celebration_c7_scene_1_courtyard",
    "celebration_c7_scene_2_witnessing_choice",
  ],
  celebration_c8_the_ghost_in_the_hall: [
    "celebration_c8_scene_1_the_hall",
    "celebration_c8_scene_2_the_dreamers_hum",
  ],
  celebration_c10_the_arks_rise: ["celebration_c10_scene_1_the_build"],
  celebration_c11_the_uncles_verdict: [
    "celebration_c11_scene_1_the_breach",
    "celebration_c11_scene_2_the_verdict",
  ],
});

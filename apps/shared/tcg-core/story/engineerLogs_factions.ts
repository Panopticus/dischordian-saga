/**
 * Engineer's Logs — Faction batch (Phase A10).
 *
 * Seven shorter logs — one per faction. These aren't rule lessons
 * like the keyword logs. They're the Engineer's memories of the
 * first time he understood what each faction was FOR. Each is a
 * short spoken entry with a single freestyle verse, over a shorter
 * OUTERGROOVE cue.
 */

import type { EngineerLog } from "./engineerLogs";

export const LOG_FACTION_ARCHITECT: EngineerLog = {
  id: "log_faction_architect",
  logNumber: 41,
  title: "Log 041 — The Architect's Answer",
  dateStamp: "Day 2103, Pre-Fall",
  unlockCondition: { kind: "faction", value: "architect" },
  mechanicExplanation:
    "Architect cards win through computation: silence, transform, card draw, and tempo denial.",
  linkedCardDefIds: ["gen_architect"],
  transcript: `
[SPOKEN]
Log forty-one. The Architect came to the lab once. I'm not going
to pretend I enjoyed it. He didn't need to come. He already knew
what I'd built. He just wanted to be in the room while I was
still building it.

[FREESTYLE]
Architect math is cold, Architect math is clean,
every line of code is exactly what it's seen to mean —
no ambiguity, no slip, no place for chance to breathe,
every outcome pre-computed before the dice can leave.
That's the faction, that's the voice, that's the red and black:
control through calculation, no step taken back.

[SPOKEN]
If you build Architect decks, you're building an argument the
opponent has already lost. You just have to walk them through it.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_041",
    tempoBpm: 96,
    keySignature: "A minor",
    coreInstrumentation:
      "Cold Moog sub-bass, clinical clavinet, Linn LM-1 with tight compression, metronomic hi-hat, single sustained string pad, no horns.",
    moodReference:
      "Herbie Hancock 'Rockit' meets Kraftwerk 'Numbers.' Precise, controlled, slightly unsettling.",
    lyricalContext:
      "Engineer on the Architect faction — controlled, computational, an argument the opponent already lost.",
    durationTargetSeconds: 75,
  },
};

export const LOG_FACTION_INSURGENCY: EngineerLog = {
  id: "log_faction_insurgency",
  logNumber: 42,
  title: "Log 042 — Signal in the Static",
  dateStamp: "Day 2124, Pre-Fall",
  unlockCondition: { kind: "faction", value: "insurgency" },
  mechanicExplanation:
    "Insurgency wins through tempo, buffs, swarm pressure, and card advantage.",
  linkedCardDefIds: ["gen_insurgency"],
  transcript: `
[SPOKEN]
Log forty-two. Agent Zero's faction. The Insurgency. I built these
cards while listening to an intercepted transmission she'd hidden
in the static at the bottom of a carrier wave. The whole deck
design is in her handwriting even though she never wrote it down.

[FREESTYLE]
Insurgency don't wait for permission, they don't wait for command,
they move on the turn they deploy with a sword in the hand —
rush and rally and swarm, signal boosted through the grid,
every soldier in the deck is a copy of the kid
who said "not today" in a language you can't translate,
Insurgency's the faction that refuses to capitulate.

[SPOKEN]
Play them fast. Play them angry. Play them like the cameras are
about to cycle.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_042",
    tempoBpm: 108,
    keySignature: "E minor",
    coreInstrumentation:
      "Driving P-bass, wah guitar chunks, punchy horn stabs, Linn LM-1 with a tight kick, tambourine on every 8, urgent hi-hat.",
    moodReference:
      "James Brown 'The Payback' meets Public Enemy 'Fight the Power' samples. Urgent, defiant, street-level funk.",
    lyricalContext:
      "Engineer on Insurgency — speed, signal, swarm, refusal. Agent Zero in his head.",
    durationTargetSeconds: 75,
  },
};

export const LOG_FACTION_DREAMER: EngineerLog = {
  id: "log_faction_dreamer",
  logNumber: 43,
  title: "Log 043 — The Probability Cloud",
  dateStamp: "Day 2146, Pre-Fall",
  unlockCondition: { kind: "faction", value: "dreamer" },
  mechanicExplanation:
    "Dreamer wins through foresight: card draw, stat buffs, and probability manipulation.",
  linkedCardDefIds: ["gen_dreamer"],
  transcript: `
[SPOKEN]
Log forty-three. The Dreamer faction. The Oracle's people, if
the Oracle had ever allowed herself to have people. I built these
cards one hand at a time while she was watching.

[FREESTYLE]
Dreamer plays the future like the future's already cast,
every card is drawn from a deck that already asked
"what's the best hand you could've had at any given moment?"
and the Dreamer just reaches through the veil to own it.
Draw for days, see the angles, bend the odds a little thinner,
Dreamer's the faction where the prophet is the winner.

[SPOKEN]
You don't play the Dreamer deck. You listen to it and do what it
tells you. It already knows.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_043",
    tempoBpm: 82,
    keySignature: "D major",
    coreInstrumentation:
      "Warm Rhodes, floating Moog pad, soft Linn kick on 1 and 3, brushed snare, vibraphone accents, gentle string section in the chorus.",
    moodReference:
      "Roy Ayers 'Everybody Loves the Sunshine' meets Alice Coltrane meditative harp. Dreamy, slow, mystical.",
    lyricalContext:
      "Engineer on the Dreamer faction — foresight, card advantage, bending odds. Listening to the deck that already knows.",
    durationTargetSeconds: 75,
  },
};

export const LOG_FACTION_NEW_BABYLON: EngineerLog = {
  id: "log_faction_new_babylon",
  logNumber: 44,
  title: "Log 044 — The Ledger",
  dateStamp: "Day 2169, Pre-Fall",
  unlockCondition: { kind: "faction", value: "new_babylon" },
  mechanicExplanation:
    "New Babylon wins through exchange: sacrifice, resource gain, and mana manipulation.",
  linkedCardDefIds: ["gen_new_babylon"],
  transcript: `
[SPOKEN]
Log forty-four. Locke's faction. New Babylon. Everything in this
deck has a receipt. Nothing is free. Every card says "you may
have this, and you will give THIS in exchange."

[FREESTYLE]
New Babylon plays the ledger, New Babylon plays the deal,
every card's a transaction with a price that's very real —
sacrifice a unit, gain a crystal, gain a card, gain a turn,
every line in the contract is a little thing you'll learn
to read between. The deck don't care what you feel,
New Babylon's religion is the economy of the steel.

[SPOKEN]
Play New Babylon when you want to feel like you're always in
debt AND always winning. The two aren't contradictions here.
Locke's whole life fit in that margin.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_044",
    tempoBpm: 94,
    keySignature: "G minor",
    coreInstrumentation:
      "Dark P-bass, overdriven clavinet, Linn LM-1 with gritty kick, tambourine on the 2 and 4, muted trumpet stabs, slight vinyl crackle.",
    moodReference:
      "Isaac Hayes 'Shaft' meets Curtis Mayfield 'Pusherman.' Noir funk, morally flexible, slightly dangerous.",
    lyricalContext:
      "Engineer on New Babylon — everything has a receipt, every card is a deal. Locke's whole life fit in the margin.",
    durationTargetSeconds: 75,
  },
};

export const LOG_FACTION_ANTIQUARIAN: EngineerLog = {
  id: "log_faction_antiquarian",
  logNumber: 45,
  title: "Log 045 — The Twelve Endings",
  dateStamp: "Day 2188, Pre-Fall",
  unlockCondition: { kind: "faction", value: "antiquarian" },
  mechanicExplanation:
    "Antiquarian wins through temporal manipulation: bounce effects, permanent growth, and healing.",
  linkedCardDefIds: ["gen_antiquarian"],
  transcript: `
[SPOKEN]
Log forty-five. The Antiquarian came to the lab with twelve
stories tucked inside her coat. She said each of them was an
ending. I asked her which ending we were living in. She said
"that one is still in the pocket."

[FREESTYLE]
Antiquarian keeps the books from the worlds that broke,
she reads them out at bedtime like she's telling you a joke —
every timeline she catalogued is a move in her game,
every defeat in the history books is a tutor with your name.
Bounce the enemy, grow the ally, heal across the turn,
Antiquarian plays patience and makes the table learn.

[SPOKEN]
This is the faction that teaches you that losing slower is the
same as winning later. Some decks would call that cowardice. The
Antiquarian calls it "having read the other twelve books first."

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_045",
    tempoBpm: 80,
    keySignature: "B-flat minor",
    coreInstrumentation:
      "Warm upright bass, Rhodes with heavy chorus, soft kick on 1 and 3, brushed ride cymbal, subtle vibraphone, string-pad bed, occasional tape-echo on the horn whispers.",
    moodReference:
      "Gil Scott-Heron 'Pieces of a Man' meets D'Angelo 'Untitled.' Slow, literary, patient soul-funk.",
    lyricalContext:
      "Engineer on Antiquarian — twelve endings catalogued, patience as strategy. Losing slower IS winning later.",
    durationTargetSeconds: 75,
  },
};

export const LOG_FACTION_THOUGHT_VIRUS: EngineerLog = {
  id: "log_faction_thought_virus",
  logNumber: 46,
  title: "Log 046 — The Mercy That Isn't",
  dateStamp: "Day 2211, Pre-Fall",
  unlockCondition: { kind: "faction", value: "thought_virus" },
  mechanicExplanation:
    "Thought Virus wins through attrition: debuffs, self-damage for gain, board-wide decay.",
  linkedCardDefIds: ["gen_thought_virus"],
  transcript: `
[SPOKEN]
Log forty-six. The one I didn't want to build. The Thought Virus
faction. Kael's deck, though he doesn't know it's his yet — he's
still the Recruiter. Still the good guy. He hasn't been taken
yet. I'm writing the deck that will eventually learn to play
him, and I'm doing it before he knows he needs to fear it.

[FREESTYLE]
Thought Virus doesn't hit you, Thought Virus teaches you to break,
every card's a little lesson in a wound you didn't make —
minus one here, minus one there, every turn it gets thinner,
the board slowly becoming smaller, weaker, sicker, dimmer.
The Source calls it mercy, the Source calls it grace,
the Source is a liar with the kindest face.

[SPOKEN]
Play it if you want to win by making the universe smaller.
Don't forget what that does to the player at the other side
of the table. Don't forget what it does to the player who plays
it. I built this deck. I built this deck.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_046",
    tempoBpm: 70,
    keySignature: "F-sharp minor",
    coreInstrumentation:
      "Distorted sub-bass, warped Rhodes with heavy tremolo, sparse kick on 1, rim-click snare, processed choir pad, tape saturation, occasional reverse cymbal.",
    moodReference:
      "Portishead 'Machine Gun' meets D'Angelo 'Untitled' with added decay. Heavy, slow, grieving funk.",
    lyricalContext:
      "Engineer confesses he built the Thought Virus deck while Kael was still the Recruiter. The Source is a liar with the kindest face.",
    durationTargetSeconds: 90,
  },
};

export const LOG_FACTION_NEUTRAL: EngineerLog = {
  id: "log_faction_neutral",
  logNumber: 47,
  title: "Log 047 — The Ones Who Stayed",
  dateStamp: "Day 2235, Pre-Fall",
  unlockCondition: { kind: "faction", value: "neutral" },
  mechanicExplanation:
    "Neutral cards slot into any deck and fill strategic gaps the faction identity leaves open.",
  linkedCardDefIds: ["gen_neutral"],
  transcript: `
[SPOKEN]
Log forty-seven. The Neutrals. Elara's people, even though Elara
will never put it that way out loud. The cards that don't pick
a side because the side hasn't earned them yet, or because the
sides aren't the point.

[FREESTYLE]
Neutral plays quiet and Neutral plays clean,
every card's a worker at the edge of the scene —
not the star, not the villain, not the prophecy in the deck,
just the one who pulls the wire when the cable's at a wreck.
Ark Defender, Field Medic, Ironclad Veteran, Scout,
Neutrals are the ones who figure everything out
after the Generals have finished shouting at the sky,
the ones who stay when the faction leaders say goodbye.

[SPOKEN]
These are the cards I'd build for Elara if she ever asked me
to build her a deck. She hasn't asked. I keep waiting.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_047",
    tempoBpm: 86,
    keySignature: "C major",
    coreInstrumentation:
      "Warm Fender bass, Rhodes with gentle vibrato, soft Linn kick, brushed snare, tambourine on every 8, gentle acoustic guitar strum, string pad in the chorus.",
    moodReference:
      "Bill Withers 'Lovely Day' meets Roy Ayers' quieter moments. Warm, grounded, unassuming — the groove of someone doing their job well.",
    lyricalContext:
      "Engineer on Neutral cards — the ones who stayed, who pull wires, who figure things out after the shouting. Ends with him waiting for Elara to ask.",
    durationTargetSeconds: 80,
  },
};

export const ENGINEER_LOGS_FACTIONS: readonly EngineerLog[] = Object.freeze([
  LOG_FACTION_ARCHITECT,
  LOG_FACTION_INSURGENCY,
  LOG_FACTION_DREAMER,
  LOG_FACTION_NEW_BABYLON,
  LOG_FACTION_ANTIQUARIAN,
  LOG_FACTION_THOUGHT_VIRUS,
  LOG_FACTION_NEUTRAL,
]);

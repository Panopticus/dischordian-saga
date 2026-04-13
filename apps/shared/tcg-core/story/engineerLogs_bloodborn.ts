/**
 * Engineer's Logs — Bloodborn Spells batch (Phase A11).
 *
 * Seven short logs — one per faction general's signature Bloodborn
 * Spell. The Engineer's memory of watching each general be coded
 * into having their once-per-match ability. These are the most
 * personal logs: each one is about a person, not a mechanic.
 */

import type { EngineerLog } from "./engineerLogs";

export const LOG_BBS_ARCHITECT: EngineerLog = {
  id: "log_bbs_architect",
  logNumber: 51,
  title: "Log 051 — Predetermined Design",
  dateStamp: "Day 2301, Pre-Fall",
  unlockCondition: { kind: "bloodborn", value: "gen_architect" },
  mechanicExplanation:
    "The Architect's Bloodborn: summon a 1/1 Calculation token nearby.",
  linkedCardDefIds: ["gen_architect", "tok_calculation"],
  transcript: `
[SPOKEN]
Log fifty-one. I wrote the Architect's Bloodborn Spell while he
watched me. He said it should summon nothing. "A unit the size
of a decision," he said. I built him the Calculation token —
one power, one health, zero art, pure function.

[FREESTYLE]
The Architect's Bloodborn is a seed of his design,
a one-over-one with a pre-computed line —
no personality, no story, just a token with a task,
a little piece of logic the player doesn't have to ask
permission to deploy. That's the Architect in miniature,
no flourish, no feeling, just the answer to the future.

[SPOKEN]
He smiled when I showed him. That was the only time I ever
saw him do that. It didn't look right on his face.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_051",
    tempoBpm: 88,
    keySignature: "A minor",
    coreInstrumentation:
      "Cold Moog bass, clinical clavinet, Linn LM-1 metronomic, single sustained pad, no warmth.",
    moodReference:
      "Kraftwerk 'Computer World' with a pulse. Machine-funk with a single human sigh in the bridge.",
    lyricalContext:
      "Engineer remembers the Architect smiling when the token was demonstrated.",
    durationTargetSeconds: 70,
  },
};

export const LOG_BBS_INSURGENCY: EngineerLog = {
  id: "log_bbs_insurgency",
  logNumber: 52,
  title: "Log 052 — Dead Signal",
  dateStamp: "Day 2318, Pre-Fall",
  unlockCondition: { kind: "bloodborn", value: "gen_insurgency" },
  mechanicExplanation:
    "Agent Zero's Bloodborn: give a friendly unit +2 attack this turn.",
  linkedCardDefIds: ["gen_insurgency"],
  transcript: `
[SPOKEN]
Log fifty-two. Agent Zero walked into the lab already knowing
what her Bloodborn Spell would be. She didn't describe it. She
hummed it. A little four-note signal. I asked what the notes
meant. She said "that's the sound of someone getting louder."

[FREESTYLE]
Dead Signal is a hum in a frequency nobody teaches,
it finds the nearest ally and it doubles what she reaches —
plus two power for one turn, no questions asked,
Agent Zero's Bloodborn is a whisper masked
as an order, as a prayer, as a finger on the dial,
the loudest thing in her deck is the smallest little smile.

[SPOKEN]
I transcribed her hum into the code. The code still hums if you
listen. I don't know if that was intentional.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_052",
    tempoBpm: 100,
    keySignature: "E minor",
    coreInstrumentation:
      "P-bass walking, clavinet stabs, horn section playing the four-note motif, Linn LM-1 driving, tambourine urgent, radio static in the intro.",
    moodReference:
      "Curtis Mayfield 'Move On Up' meets dystopian shortwave radio static. Resolute, defiant, weaponized optimism.",
    lyricalContext:
      "Agent Zero's four-note hum becomes code. The Engineer transcribed her and the code still hums.",
    durationTargetSeconds: 75,
  },
};

export const LOG_BBS_DREAMER: EngineerLog = {
  id: "log_bbs_dreamer",
  logNumber: 53,
  title: "Log 053 — Prophetic Vision",
  dateStamp: "Day 2334, Pre-Fall",
  unlockCondition: { kind: "bloodborn", value: "gen_dreamer" },
  mechanicExplanation:
    "The Oracle's Bloodborn: draw a card.",
  linkedCardDefIds: ["gen_dreamer"],
  transcript: `
[SPOKEN]
Log fifty-three. The Oracle wanted her Bloodborn Spell to be
embarrassingly simple. "Draw a card," she said. "That's all it
has to be. Seeing is already the thing." I kept trying to add
something. She kept deleting it.

[FREESTYLE]
The Oracle's Bloodborn is the smallest line of code,
one card from the top of the deck, one step down the road —
no damage, no destruction, no flourish, no flame,
just the prophet reaching forward in a game about the game.
Draw a card. Draw the card. The card you needed the most
is the one that the Oracle saw before the future was a ghost.

[SPOKEN]
The simplest Bloodborn in the game. The hardest to write. I
argued with her about it for two weeks. She won, the way she
always won — by waiting.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_053",
    tempoBpm: 78,
    keySignature: "D major",
    coreInstrumentation:
      "Soft Rhodes with chorus, Moog pad floating, gentle kick on 1 and 3, brushed snare, vibraphone single notes, string pad in the chorus.",
    moodReference:
      "Alice Coltrane 'Journey in Satchidananda' meets Roy Ayers at his most contemplative. Meditative, mystical, patient.",
    lyricalContext:
      "The Oracle insisted her Bloodborn be one line of code. The simplest draw-a-card. She won by waiting.",
    durationTargetSeconds: 80,
  },
};

export const LOG_BBS_NEW_BABYLON: EngineerLog = {
  id: "log_bbs_new_babylon",
  logNumber: 54,
  title: "Log 054 — Dark Bargain",
  dateStamp: "Day 2351, Pre-Fall",
  unlockCondition: { kind: "bloodborn", value: "gen_new_babylon" },
  mechanicExplanation:
    "Adjudicator Locke's Bloodborn: deal 2 to your general, deal 3 to the enemy general.",
  linkedCardDefIds: ["gen_new_babylon"],
  transcript: `
[SPOKEN]
Log fifty-four. Locke wrote his own Bloodborn Spell on the back
of a receipt. Two damage to himself, three damage to the enemy.
Net gain: one. He said "that's the whole of New Babylon in four
numbers." I told him it was self-destructive. He said "every
contract is."

[FREESTYLE]
Dark Bargain is a trade with a minus and a plus,
two coming back to the king and three hitting rough —
self-inflicted royalty, a crown that bleeds a little,
every turn the math works out to Locke in the middle.
"Every contract is self-destructive," that's what he said,
"the only question is who bleeds less before the deal is dead."

[SPOKEN]
I looked up the receipt later. It was for a drink at a bar on
a station I'd never heard of. Locke had written the Bloodborn
over a bar tab. I keep the receipt in the lab drawer. I don't
know why.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_054",
    tempoBpm: 92,
    keySignature: "G minor",
    coreInstrumentation:
      "Dark bass, overdriven clavinet, Linn LM-1 with gritty snare, muted trumpet, hi-hat on every upbeat, vinyl crackle bed.",
    moodReference:
      "Isaac Hayes 'Hyperbolicsyllabicsesquedalymistic' meets Massive Attack 'Angel.' Noir-funk with a calculated menace.",
    lyricalContext:
      "Locke wrote his Bloodborn on a bar-tab receipt. Every contract is self-destructive; the question is who bleeds less.",
    durationTargetSeconds: 80,
  },
};

export const LOG_BBS_ANTIQUARIAN: EngineerLog = {
  id: "log_bbs_antiquarian",
  logNumber: 55,
  title: "Log 055 — Temporal Echo",
  dateStamp: "Day 2370, Pre-Fall",
  unlockCondition: { kind: "bloodborn", value: "gen_antiquarian" },
  mechanicExplanation:
    "The Antiquarian's Bloodborn: draw a card (in-lore: reaches into a collapsed timeline).",
  linkedCardDefIds: ["gen_antiquarian"],
  transcript: `
[SPOKEN]
Log fifty-five. The Antiquarian's Bloodborn is mechanically
identical to the Oracle's — draw a card. But she insisted on
different flavor. "The Oracle sees forward," she said. "I reach
backward. Same motion, opposite direction. Don't pretend it's
the same spell."

[FREESTYLE]
Temporal Echo pulls a card from a timeline that's already done,
the Antiquarian reaches back through every ending, every one
of the twelve endings she's catalogued in her coat,
and borrows the move the losers wrote in a note —
so the card you draw is a lesson that a dead timeline learned
before the universe rotated and the whole page turned.

[SPOKEN]
Same mechanic. Different prayer. She made me rewrite the text
four times to get the wording right.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_055",
    tempoBpm: 80,
    keySignature: "B-flat minor",
    coreInstrumentation:
      "Upright bass, Rhodes with heavy chorus, soft kick, vibraphone, lap-steel drone, string pad, subtle vinyl crackle.",
    moodReference:
      "Gil Scott-Heron 'Me and the Devil' meets Erykah Badu 'Cleva.' Literary, patient, slightly nostalgic funk.",
    lyricalContext:
      "The Antiquarian reaches backward through collapsed timelines. Same mechanic as the Oracle, different prayer.",
    durationTargetSeconds: 80,
  },
};

export const LOG_BBS_THOUGHT_VIRUS: EngineerLog = {
  id: "log_bbs_thought_virus",
  logNumber: 56,
  title: "Log 056 — Viral Propagation",
  dateStamp: "Day 2389, Pre-Fall",
  unlockCondition: { kind: "bloodborn", value: "gen_thought_virus" },
  mechanicExplanation:
    "The Source's Bloodborn: give an enemy unit -1/-1 permanently.",
  linkedCardDefIds: ["gen_thought_virus"],
  transcript: `
[SPOKEN]
Log fifty-six. I wrote this one last. I wrote it alone. Kael
didn't know his future deck would have a Bloodborn like this.
He was still the Recruiter. Still the one signing up new
soldiers for Agent Zero. I coded the Source's Bloodborn into
the system knowing I was leaving a door open for a future that
would crawl through it.

[FREESTYLE]
Viral Propagation is a quiet little touch,
one enemy unit loses one, it isn't much —
minus one power, minus one health, forever, sealed,
not a burst, not a strike, just a gradual congealed
sickness in the stats, a slow undoing of the line,
the Source don't kill you fast, the Source just takes the shine.

[SPOKEN]
I coded it while thinking about Kael. I finished it while crying.
I shipped it anyway because the Oracle had told me the future
was already in the system and removing the spell wouldn't remove
the person it belonged to. She was right. I wish she hadn't been.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_056",
    tempoBpm: 66,
    keySignature: "F-sharp minor",
    coreInstrumentation:
      "Warped sub-bass, detuned Rhodes, sparse kick on 1, rim-click snare, processed whisper pad, reverse cymbals, heavy tape saturation.",
    moodReference:
      "Portishead 'Machine Gun' meets Radiohead 'Everything in Its Right Place.' Grieving, slow, inevitable.",
    lyricalContext:
      "The Engineer coded the Source's Bloodborn while Kael was still the Recruiter. He finished it crying and shipped it anyway.",
    durationTargetSeconds: 90,
  },
};

export const LOG_BBS_NEUTRAL: EngineerLog = {
  id: "log_bbs_neutral",
  logNumber: 57,
  title: "Log 057 — Ark Protocol",
  dateStamp: "Day 2407, Pre-Fall",
  unlockCondition: { kind: "bloodborn", value: "gen_neutral" },
  mechanicExplanation:
    "Elara's Bloodborn: heal your general for 3.",
  linkedCardDefIds: ["gen_neutral"],
  transcript: `
[SPOKEN]
Log fifty-seven. Elara's not in the game yet. Not the general,
anyway. She will be, eventually — after she's been through the
upload and the awakening and all the paperwork the Architect
files under "mercy." When she's finally added, I want her
Bloodborn to be the simplest kind thing in the deck: heal the
General for three. No targets, no tricks, just care.

[FREESTYLE]
Ark Protocol is the thing that Elara will eventually become,
a heal spell carved into the future when the future's hit by drum —
three health to the General, no cost, no sleight of hand,
just the ship's voice reaching out to hold somebody's stand.
Compassion as defiance, that's the signature line,
Elara's Bloodborn when she finally gets assigned
a faction will be the quiet hand behind the loud,
the smallest healing in the deck, the proudest proud.

[SPOKEN]
I'm writing this before she knows she'll be a general. I hope
when she sees it, she recognizes the care. I hope she forgives
me for coding her future before she'd agreed to have one.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_057",
    tempoBpm: 84,
    keySignature: "C major",
    coreInstrumentation:
      "Warm Fender bass, Rhodes with gentle vibrato, soft Linn kick, brushed snare, gentle acoustic guitar, string pad, subtle tambourine.",
    moodReference:
      "Bill Withers 'Lean on Me' meets Roy Ayers 'Searching.' Warm, healing, intimate.",
    lyricalContext:
      "The Engineer writes Elara's future Bloodborn before she knows she'll be a general. He hopes she forgives him for the kindness.",
    durationTargetSeconds: 85,
  },
};

export const ENGINEER_LOGS_BLOODBORN: readonly EngineerLog[] = Object.freeze([
  LOG_BBS_ARCHITECT,
  LOG_BBS_INSURGENCY,
  LOG_BBS_DREAMER,
  LOG_BBS_NEW_BABYLON,
  LOG_BBS_ANTIQUARIAN,
  LOG_BBS_THOUGHT_VIRUS,
  LOG_BBS_NEUTRAL,
]);

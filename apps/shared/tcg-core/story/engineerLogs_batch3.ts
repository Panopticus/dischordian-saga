/**
 * Engineer's Logs — Batch 3 (Phase A8).
 *
 * Five more keyword logs: blast, grow, pierce, overcharge, stealth.
 * Same format as previous batches — spoken + freestyle, OUTERGROOVE
 * backing track, Suno/Udio music prompt attached.
 */

import type { EngineerLog } from "./engineerLogs";

export const LOG_KEYWORD_BLAST: EngineerLog = {
  id: "log_keyword_blast",
  logNumber: 21,
  title: "Log 021 — The Line Through",
  dateStamp: "Day 1388, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "blast" },
  mechanicExplanation:
    "Blast: the unit's attack hits the target and every other enemy in a straight line beyond it.",
  linkedCardDefIds: [],
  transcript: `
[SPOKEN]
Log twenty-one. Blast.

A normal attack is an event. A Blast attack is a straight line
through an event. You aim at a target, but the geometry of the
strike doesn't stop at the target — the line keeps going and
collects every enemy behind them along the same row or column.
The Engineer note on this one just says "I missed on purpose."

[FREESTYLE]
Yo, the line keeps walking after the first body's hit,
every enemy behind the target signs into the writ,
that's Blast, that's the beam, that's the arc that never ends,
every opponent in the row is suddenly your friend's worst friend.
Don't aim at the closest, aim at the farthest and the line
collects the neighborhood as rent for being in the shine.

[SPOKEN]
I don't make Blast units for close quarters. I make them for
hallways. Long, narrow, obvious hallways. The kind enemies
wander into because the map told them to.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_021",
    tempoBpm: 100,
    keySignature: "E minor",
    coreInstrumentation:
      "Driving P-bass on every beat, clavinet punches, wah guitar on the backbeat, Linn LM-1 with a heavy kick, horn stabs (tenor sax + trumpet) on the hook, congas in the bridge.",
    moodReference:
      "Tower of Power's 'What Is Hip' meets James Brown's tightest funk. Horn-driven, muscular, unstoppable forward motion.",
    lyricalContext:
      "The Engineer raps about Blast as a line attack that collects everything behind the target. 'I missed on purpose' is the through-line.",
    durationTargetSeconds: 95,
  },
};

export const LOG_KEYWORD_GROW: EngineerLog = {
  id: "log_keyword_grow",
  logNumber: 23,
  title: "Log 023 — Interest, Compounded",
  dateStamp: "Day 1456, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "grow" },
  mechanicExplanation:
    "Grow: the unit gains +1/+1 permanently at the start of each of its owner's turns.",
  linkedCardDefIds: ["s1_char_097", "s1_char_124"],
  transcript: `
[SPOKEN]
Log twenty-three. Grow. The 23. The Oracle loved this number. Said
it was the only integer that kept the fingerprints of the universe.
I think she was messing with me. I also think she wasn't.

Grow is a unit that gains stats at the start of its owner's turn.
Every turn, a little stronger. Compounded interest applied to a
body. The longer it stays on the board, the more it becomes the
thing you wish you'd killed when it was still reasonable.

[FREESTYLE]
Yo, every turn's a bank that pays the grower back,
plus-one power, plus-one health, every single stack.
The enemy is waiting for the moment it makes sense,
Grow is patient interest compounding against the fence.
You didn't kill it turn one, so by turn five it's a problem,
by turn seven it's the problem, by turn ten it's a column
the whole board has to navigate around like it's a pillar,
yeah Grow is just a time bomb that you raised to be a killer.

[SPOKEN]
I tuned the rate. One per turn, not two. Two was insane. One is
just "you should've dealt with this earlier."

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_023",
    tempoBpm: 89,
    keySignature: "B-flat major",
    coreInstrumentation:
      "Warm Fender bass, Rhodes comping, tambourine on the 1-and, soft Linn kick, cross-stick snare, slide guitar fills, subtle string pad that doubles each chorus, tape-saturated throughout.",
    moodReference:
      "Steely Dan's 'Aja' era groove meets Roy Ayers' vibraphone funk. Patient, warm, building. Something that rewards listening for the full track.",
    lyricalContext:
      "The Engineer frames Grow as compound interest — a unit that gets more dangerous the longer you wait. Includes the 23-enigma Oracle reference.",
    durationTargetSeconds: 105,
  },
};

export const LOG_KEYWORD_PIERCE: EngineerLog = {
  id: "log_keyword_pierce",
  logNumber: 25,
  title: "Log 025 — Through The Shield",
  dateStamp: "Day 1502, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "pierce" },
  mechanicExplanation:
    "Pierce: this unit's attack ignores a portion of the target's defensive abilities, including Forcefield.",
  linkedCardDefIds: ["s1_char_057", "s1_char_003", "s1_char_077"],
  transcript: `
[SPOKEN]
Log twenty-five. Pierce. Forcefield's answer back.

I built Pierce because Forcefield was getting smug. The one-bite
shield was creating decks where nothing ever landed on the first
try and the whole game slowed into a staring contest. Pierce is
the keyword that says "your shield is noted, and ignored." It
punches through the first-hit absorption and lands the damage
where it was always going to land.

[FREESTYLE]
Yo, the Forcefield thought it had the first word in the fight,
Pierce just walks up like "nah, not tonight" —
the shield swallows the hit and then the hit lands anyway,
that's what it means to Pierce through the armor in the fray.
It's not about damage, it's about intention,
Pierce is the mechanic that refuses the convention.
You built a rule to stop me? I built a rule to stop the rule.
The Engineer's in the classroom, the classroom is the school.

[SPOKEN]
Pierce isn't free. It costs a keyword slot, which means Pierce
units tend to be fragile in other places. Every shield has a
crack, every crack has a cost. Nothing in this game is a pure
advantage. That's the Oracle rule, not mine.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_025",
    tempoBpm: 110,
    keySignature: "D minor",
    coreInstrumentation:
      "Aggressive slap bass, overdriven clavinet, wah guitar with bite, Linn LM-1 with a sharp snap on the snare, horn punches, tambourine doubling the hi-hat pattern, vocoder ad-libs in the background.",
    moodReference:
      "Sly & the Family Stone's 'There's a Riot Goin' On' meets Prince's 'Sexy M.F.' Aggressive, confident, slightly confrontational funk.",
    lyricalContext:
      "The Engineer explains Pierce as the keyword that refuses the convention of Forcefield. Ends with the Oracle rule: nothing is a pure advantage.",
    durationTargetSeconds: 95,
  },
};

export const LOG_KEYWORD_OVERCHARGE: EngineerLog = {
  id: "log_keyword_overcharge",
  logNumber: 27,
  title: "Log 027 — The First Swing Is The Whole Song",
  dateStamp: "Day 1577, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "overcharge" },
  mechanicExplanation:
    "Overcharge: this unit deals bonus damage on its first attack, then damages itself for the overflow.",
  linkedCardDefIds: ["s1_char_075"],
  transcript: `
[SPOKEN]
Log twenty-seven. Overcharge. This is the keyword I almost
couldn't ship.

The math works like this: the unit's first attack each turn
hits harder than its printed power. Significantly harder.
Sometimes double. The catch is that the excess energy has
nowhere to go, so it flows back into the unit as self-damage.
You hit hard and you pay for it, every single time. It's not
a bug. It's the deal.

[FREESTYLE]
Yo, Overcharge is the keyword that means the first hit is everything,
you pump the capacitor past the red, the body starts to ring —
you swing, you connect, you double the damage on the down beat,
but the kickback comes home, the overflow's a heartbeat
in reverse, the unit bleeds from the inside while it scores,
every Overcharge player signs the debt in red before the roar.
You can't save it for later, you can't use it twice,
the first swing is the whole song, and the song has a price.

[SPOKEN]
The Oracle asked me why I built a keyword where the unit is its
own enemy. I told her I wanted a card that had to believe in
its own attack so much it was willing to be burned by it. She
nodded. She didn't say anything. That's how I know she got it.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_027",
    tempoBpm: 118,
    keySignature: "A minor",
    coreInstrumentation:
      "Distorted synth bass, clavinet drenched in fuzz, overdriven Fender Rhodes stabs, Linn LM-1 with saturation on every channel, heavy handclap layer, tape-echo on the horn hits, delayed vocal shouts.",
    moodReference:
      "Funkadelic's 'Maggot Brain' era psychedelic funk. Sly Stone at his loudest. Prince 'Controversy.' Over-the-top, redlined, beautiful.",
    lyricalContext:
      "The Engineer raps about Overcharge as a unit that has to believe in its own attack so much it's willing to be burned. 'The first swing is the whole song' is the hook.",
    durationTargetSeconds: 100,
  },
};

export const LOG_KEYWORD_STEALTH: EngineerLog = {
  id: "log_keyword_stealth",
  logNumber: 29,
  title: "Log 029 — Untargetable",
  dateStamp: "Day 1631, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "stealth" },
  mechanicExplanation:
    "Stealth: this unit cannot be targeted by the enemy until it attacks or is revealed.",
  linkedCardDefIds: ["s1_char_002"],
  transcript: `
[SPOKEN]
Log twenty-nine. Stealth. Untargetable. The keyword that says "the
opponent can't click on me until I do something that makes clicking
on me possible."

I didn't invent this one. The Oracle did. She drew it on a napkin
the first week she came to the lab. I said, "That's not a real
mechanic, that's a hole in the rules." She said, "Good. Build
the hole."

[FREESTYLE]
Yo, the Stealth unit is the rumor with a body attached,
the opponent can't target it, every click gets detached —
no spell's gonna find it, no blade's gonna touch,
no unit's even gonna reach it, Stealth's that much
of a dodge. Until the moment that it swings,
and then the moment that it swings is the moment that it sings
itself into existence, and the universe goes "oh,
you were HERE the whole time? I didn't know."

[SPOKEN]
The cost of Stealth is that it can't contest anything defensively.
It can't Provoke. It can't absorb. It can only wait and choose
when to become real. That's the deal. You're not there until
you're there.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_029",
    tempoBpm: 86,
    keySignature: "F minor",
    coreInstrumentation:
      "Quiet upright bass, Rhodes with chorus, kick on 1 and 3, brushed snare, soft shaker, occasional vibraphone chord, muted trumpet whisper in the background, tape hiss prominent.",
    moodReference:
      "Massive Attack 'Mezzanine' era trip-hop meets D'Angelo 'Voodoo' intimate quiet storm. A groove that barely makes itself audible.",
    lyricalContext:
      "The Engineer explains Stealth as the Oracle's napkin idea — a unit that isn't there until it swings. Ends with the deal: you're not there until you're there.",
    durationTargetSeconds: 110,
  },
};

export const ENGINEER_LOGS_BATCH_3: readonly EngineerLog[] = Object.freeze([
  LOG_KEYWORD_BLAST,
  LOG_KEYWORD_GROW,
  LOG_KEYWORD_PIERCE,
  LOG_KEYWORD_OVERCHARGE,
  LOG_KEYWORD_STEALTH,
]);

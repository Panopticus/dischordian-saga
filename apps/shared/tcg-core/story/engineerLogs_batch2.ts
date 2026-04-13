/**
 * Engineer's Logs — Batch 2 (Phase A7).
 *
 * Five more keyword logs in the same format as the seed batch:
 * spoken-word + freestyle, OUTERGROOVE backing track, ready for
 * Suno/Udio generation.
 *
 * Covers: flying, ranged, deathwatch, backstab, drain.
 */

import type { EngineerLog } from "./engineerLogs";

export const LOG_KEYWORD_FLYING: EngineerLog = {
  id: "log_keyword_flying",
  logNumber: 11,
  title: "Log 011 — Permission to Be Anywhere",
  dateStamp: "Day 932, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "flying" },
  mechanicExplanation:
    "Flying: this unit can move to any empty tile on the board, ignoring obstacles and range limits.",
  linkedCardDefIds: ["s1_char_054", "s1_pack_pet_holo_fox_3", "s1_char_111"],
  transcript: `
[SPOKEN]
Log eleven. Flying. This was easier than I thought it would be.

Turns out the trick to making something fly isn't lift — it's
permission. Every unit on the board is a contract with the floor.
You are HERE because the floor agrees you're here. Break the
contract, and you're not flying, you're falling. What I did with
flying is I wrote a second contract, one that says "you are allowed
to be anywhere this board could possibly have contained." The unit
renegotiates its location with the board directly. Skips the floor.
The floor isn't even invited to the meeting.

[FREESTYLE]
Yo, gravity's a handshake between you and the ground,
most units honor it, they stay where they're found —
but flying is the permission slip, signed by the sky,
the unit tells the floor "I'll catch you next time, bye."
Move to any empty tile, no cost for the distance,
no provoke can stop you 'cause you skip the resistance,
you're a vector through the hollow of the possibility space,
the board's just a suggestion and you're in a better place.

[SPOKEN]
The Oracle looked at the first Flying prototype — a little drone
about the size of a walnut — and said, "Is it happy up there?"
I said, "It doesn't have the hardware for happy."
She said, "Then why is it moving like that?"
I didn't have an answer.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_011",
    tempoBpm: 96,
    keySignature: "A major",
    coreInstrumentation:
      "Bright slap bass on the downbeats, clavinet riff floating high in the register, wah guitar rhythm, Linn LM-1 kick and snare with splash cymbals on the 4, Juno pads with lots of chorus, synthesized flute line for the hook.",
    moodReference:
      "Stevie Wonder's 'Higher Ground' meets Roy Ayers' 'Everybody Loves the Sunshine' in zero-G. Weightless, buoyant, optimistic funk.",
    lyricalContext:
      "The Engineer raps about flying as a permission slip rather than lift — the unit renegotiates its location with the board directly. Ends with the Oracle asking if the drone was happy.",
    durationTargetSeconds: 95,
  },
};

export const LOG_KEYWORD_RANGED: EngineerLog = {
  id: "log_keyword_ranged",
  logNumber: 13,
  title: "Log 013 — The Clean Line",
  dateStamp: "Day 1024, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "ranged" },
  mechanicExplanation:
    "Ranged: this unit can attack any tile on the board and takes no counterattack.",
  linkedCardDefIds: ["s1_char_051", "s1_char_103"],
  transcript: `
[SPOKEN]
Log thirteen. Unlucky number, didn't work on the first dozen
attempts, so this version of the chip is called the Thirteenth
Try. That's on the etching. That's permanent now.

Ranged is a philosophy before it's a mechanic. Every attack in
the game is a conversation between two bodies. Melee is a handshake
that hurts. A Ranged attack is a letter with a bullet inside it.
The body receiving the letter has no way to answer — the sender
is nowhere near close enough to reply to. So Ranged gets to hit
anywhere on the board AND doesn't take a counterattack. The cost
is paid up front, in the silence the target leaves on your
porch when they can't find you.

[FREESTYLE]
Yo, the ranged unit's a poet with a rifle for a pen,
signs every shot with a location and then —
disappears into the static of the next lane over,
the target fires back and hits a four-leaf clover.
No reply, no retort, no return of the favor,
the clean line lands and the distance is the flavor.
Any tile, any target, no counterattack damage,
that's the price of being poetry written in the language
of patience. And a rifle. Mostly the rifle.

[SPOKEN]
The Oracle read this log out loud when I showed her. Then she said,
"You're describing something I've done." I didn't know what to say
to that. I still don't.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_013",
    tempoBpm: 84,
    keySignature: "D minor",
    coreInstrumentation:
      "Muted trumpet section playing long held notes, walking upright bass, brushed snare, ride cymbal on the 2 and 4, soft Rhodes chord comping, vibraphone fills between phrases, tape hiss on the master.",
    moodReference:
      "Miles Davis 'Kind of Blue' meets a noir detective score. Quincy Jones' 'Ironside' theme slowed and smoked. Patient, cool, dangerous.",
    lyricalContext:
      "The Engineer frames Ranged as a poet with a rifle — an attack so distant that no reply is possible. Ends with the Oracle's unsettling admission.",
    durationTargetSeconds: 115,
  },
};

export const LOG_KEYWORD_DEATHWATCH: EngineerLog = {
  id: "log_keyword_deathwatch",
  logNumber: 15,
  title: "Log 015 — The Ones Who Watch the Falling",
  dateStamp: "Day 1117, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "deathwatch" },
  mechanicExplanation:
    "Deathwatch: this unit gets stronger each time any other unit on the board dies.",
  linkedCardDefIds: ["s1_char_070", "s1_char_072", "s1_char_076"],
  transcript: `
[SPOKEN]
Log fifteen. I'm sitting on the floor of the lab because there's
glass on the chairs and I don't want to clean it up yet.

Deathwatch. The keyword that scales with every other unit that
dies on the board. I didn't design this one — not really. I put
a sensor on a prototype because I wanted it to flinch when things
died nearby. Empathy for the battlefield. The sensor worked too
well. The prototype didn't flinch. It grew. Every death on the
board made it one shade stronger. I asked it to stop. It didn't
understand the question.

[FREESTYLE]
Yo, I was trying to build grief and I built an appetite,
the sensor on the collar started glowing every night,
every ally hitting dirt was a line item on the gain,
the prototype was thicker than the pool of its own pain.
I called it Deathwatch 'cause I couldn't call it love,
it kept its eyes on every body leaving from above,
every "goodbye" on the board was a plus-one on the frame,
I built a mourner that got stronger every time it came.

[SPOKEN]
I keep it in the deck because removing the keyword won't remove
the thing it points at. Some units are just like that. They grow
from loss. The best I can do is make sure the growth is honest —
one stat at a time, no shortcuts, no cheating — and let the
player decide whether that growth is the kind they want their
name on. I don't think I'd build it again. I think I had to
build it once.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_015",
    tempoBpm: 72,
    keySignature: "C-sharp minor",
    coreInstrumentation:
      "Sub-bass drone, Rhodes with heavy tremolo, Mellotron choir pad in the background, kick on 1 and 3, soft rim-click snare, processed vocal sample (wordless) looping in the background, tape-saturated everything.",
    moodReference:
      "Portishead's 'Dummy' era trip-hop. D'Angelo 'Untitled (How Does It Feel)' outro. Heavy, slow, mournful groove that still has gravity.",
    lyricalContext:
      "The Engineer confesses that Deathwatch wasn't designed — it emerged from a grief sensor that grew stronger instead of flinching. He keeps the keyword because the thing it names would exist either way.",
    durationTargetSeconds: 140,
  },
};

export const LOG_KEYWORD_BACKSTAB: EngineerLog = {
  id: "log_keyword_backstab",
  logNumber: 17,
  title: "Log 017 — The Wrong Angle",
  dateStamp: "Day 1202, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "backstab" },
  mechanicExplanation:
    "Backstab: this unit deals bonus damage when attacking from behind the target.",
  linkedCardDefIds: ["s1_char_047", "s1_char_108", "s1_pack_pet_void_crawler_2"],
  transcript: `
[SPOKEN]
Log seventeen. I've been asked to stop explaining Backstab to the
intern because I laughed at them when they asked me if it was
unfair. I told them fairness wasn't a property of the mechanic,
it was a property of the player. They filed a complaint. The
complaint was filed FROM BEHIND ME.

[FREESTYLE]
Yo, Backstab's the word for the geometry of trust,
every unit's facing forward and it's got to, it's a must —
the forward is where the eyes are, the forward is the shield,
the rear is just a rumor that the body hasn't healed.
Hit 'em from the front, it's a fair and even trade,
hit 'em from the back, double damage, that's the blade.
The cost is getting there, that's where the risk hides,
Backstab's not unfair, it's just the wrong angle of the sunrise.

[SPOKEN]
The Oracle told me once that there was no such thing as a
backstab in the history she came from. Everyone in her past was
a complete sphere with eyes in every direction. I asked her why
she thought our universe had a "back." She said, "Because yours
is a universe where something is always trying to sneak up on you.
It's a courtesy."

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_017",
    tempoBpm: 108,
    keySignature: "F-sharp minor",
    coreInstrumentation:
      "Tight P-bass on the 1, staccato wah guitar on the offbeats, dirty clavinet fills, Linn LM-1 with gated reverb on the snare, syncopated hi-hat pattern, bongos in the B section, whispered ad-libs low in the mix.",
    moodReference:
      "Isaac Hayes' 'Theme from Shaft' meets Curtis Mayfield's 'Superfly' at a faster tempo. Stealth-funk. The groove of someone moving quietly.",
    lyricalContext:
      "The Engineer defends Backstab as 'the wrong angle of the sunrise' — fairness is a property of the player, not the mechanic. Ends with the Oracle's observation about universes that have a 'back.'",
    durationTargetSeconds: 100,
  },
};

export const LOG_KEYWORD_DRAIN: EngineerLog = {
  id: "log_keyword_drain",
  logNumber: 19,
  title: "Log 019 — The Tax On Hurting",
  dateStamp: "Day 1301, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "drain" },
  mechanicExplanation:
    "Drain: when this unit deals damage, the friendly General is healed for a portion of that damage.",
  linkedCardDefIds: ["s1_char_053", "s1_char_088", "s1_char_064"],
  transcript: `
[SPOKEN]
Log nineteen. Drain. The one the Oracle spent an entire evening
trying to talk me out of.

Here's how it works. When a Drain unit deals damage, a fraction
of that damage becomes healing — not for the unit, for the
General. The wound the unit gives to the enemy becomes medicine
for the commander. It's a tax on hurting. Every hit pays a tithe
back to the throne. The numbers balance. Entropy doesn't argue.
The universe's ledger goes quiet.

[FREESTYLE]
Yo, every wound I open on the enemy's field
sends a little pulse of warmth to my own General's shield —
that's the drain, that's the tithe, that's the tax on the pain,
the throne's getting fatter while the foot soldier's drained.
Some call it vampiric, I just call it economy,
the hurt has to go somewhere, might as well go to me.
The Oracle said it's dangerous, said it breeds a bad habit,
said a king who eats the battlefield is a king who won't outlast it.

[SPOKEN]
She said — and I'm quoting because I wrote it down — "A leader
who heals from every wound their army inflicts will eventually
stop caring who the wounds belong to." I said, "That's not the
mechanic." She said, "It's the mechanic's shadow. You don't get
to choose which side of the wall the shadow falls on."

I still shipped it. The Oracle was right about a lot of things
I didn't want her to be right about.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_019",
    tempoBpm: 82,
    keySignature: "G minor",
    coreInstrumentation:
      "Slow slap bass with long sustained notes, Rhodes with slight overdrive, muted trumpet playing the hook, soft Linn kick on the 1 and the 3-and, brushed snare, vibraphone fills, subtle string-pad bed, jazz ride cymbal on every beat.",
    moodReference:
      "Marvin Gaye 'Inner City Blues' reimagined in a space clinic. D'Angelo 'Brown Sugar' slowed and sweetened. Soulful, medicinal, slightly guilty.",
    lyricalContext:
      "The Engineer defends Drain as a tax on hurting — damage becomes medicine for the General. Ends with the Oracle's warning about leaders who heal from every wound their army inflicts.",
    durationTargetSeconds: 125,
  },
};

export const ENGINEER_LOGS_BATCH_2: readonly EngineerLog[] = Object.freeze([
  LOG_KEYWORD_FLYING,
  LOG_KEYWORD_RANGED,
  LOG_KEYWORD_DEATHWATCH,
  LOG_KEYWORD_BACKSTAB,
  LOG_KEYWORD_DRAIN,
]);

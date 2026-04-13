/**
 * Engineer's Logs — Triggers batch (Phase A12).
 *
 * Seven short logs — one per trigger type wired into the engine.
 * These are the cause-and-effect rules: what happens WHEN. The
 * Engineer explains the mechanics of reactive play without naming
 * specific cards — these are the rules the cards obey.
 */

import type { EngineerLog } from "./engineerLogs";

export const LOG_TRIGGER_ON_DEPLOY: EngineerLog = {
  id: "log_trigger_on_deploy",
  logNumber: 61,
  title: "Log 061 — The First Breath",
  dateStamp: "Day 2502, Pre-Fall",
  unlockCondition: { kind: "trigger", value: "on_deploy" },
  mechanicExplanation:
    "on_deploy triggers fire the moment a unit is summoned onto the board.",
  linkedCardDefIds: [],
  transcript: `
[SPOKEN]
Log sixty-one. The on-deploy trigger. The first breath a unit
takes when it arrives on the board. Every unit is capable of
having one. Most units choose silence. Some units arrive
already screaming.

[FREESTYLE]
On-deploy is the moment the unit lands and takes a look,
every ability that fires the second you close the book
on the summoning animation — that's the entrance line,
the thing the unit says before it's had a chance to shine.
Deal damage, draw a card, buff an ally, stun a foe,
every on-deploy is the unit's first word on the show.

[SPOKEN]
I like these ones. They're honest. A unit that tells you who it
is before the second turn is a unit that trusts you.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_061",
    tempoBpm: 96,
    keySignature: "E minor",
    coreInstrumentation:
      "Warm bass, Rhodes, soft Linn kick, brushed snare, gentle horn swell on the 1, tambourine on the 8, tape hiss bed.",
    moodReference:
      "Stevie Wonder 'Sir Duke' intro groove. Warm, declarative, arrival-shaped.",
    lyricalContext:
      "Engineer on on_deploy as the first breath a unit takes. Honest introductions.",
    durationTargetSeconds: 70,
  },
};

export const LOG_TRIGGER_ON_DEATH: EngineerLog = {
  id: "log_trigger_on_death",
  logNumber: 62,
  title: "Log 062 — The Last Word",
  dateStamp: "Day 2521, Pre-Fall",
  unlockCondition: { kind: "trigger", value: "on_death" },
  mechanicExplanation:
    "on_death triggers fire at the moment the unit is destroyed, before it leaves the board.",
  linkedCardDefIds: [],
  transcript: `
[SPOKEN]
Log sixty-two. On-death. The hardest trigger to wire correctly.
The unit is already failing the health check when the trigger
needs to resolve — it's technically dying AND speaking at the
same time. I had to teach the engine to hold the door open for
one extra frame.

[FREESTYLE]
On-death is the last word a unit gets to say,
the trigger resolves before the body slips away —
draw a card, deal damage, heal a friend across the line,
every dying unit gets a final chance to shine.
The Engineer wrote the code to hold the door one frame wider
so the corpse gets the mic before the silence takes the rider.

[SPOKEN]
The Oracle watched me build this. She said, "You're giving the
dead a chance to bargain." I said, "I'm giving them a chance to
say goodbye." She said, "Same thing. It always was."

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_062",
    tempoBpm: 74,
    keySignature: "C minor",
    coreInstrumentation:
      "Sub-bass drone, Rhodes with tremolo, kick on 1, cross-stick snare, choir pad, reverse cymbals on the turnarounds, tape saturation.",
    moodReference:
      "D'Angelo 'Send It On' meets Portishead 'Sour Times.' Slow, heavy, final.",
    lyricalContext:
      "Engineer on on_death as the last word a unit speaks. The Oracle calls it a bargain; the Engineer calls it a goodbye.",
    durationTargetSeconds: 90,
  },
};

export const LOG_TRIGGER_ON_DAMAGE_DEALT: EngineerLog = {
  id: "log_trigger_on_damage_dealt",
  logNumber: 63,
  title: "Log 063 — The Cost of Hurting",
  dateStamp: "Day 2540, Pre-Fall",
  unlockCondition: { kind: "trigger", value: "on_damage_dealt" },
  mechanicExplanation:
    "on_damage_dealt triggers fire after this unit deals damage to a target.",
  linkedCardDefIds: [],
  transcript: `
[SPOKEN]
Log sixty-three. On-damage-dealt. Every time one of your units
lands a hit, the engine checks: did this unit promise anything
WHEN it hit something? If so, pay the promise now. Healing,
drawing, buffing, debuffing — whatever the unit's ability said.

[FREESTYLE]
On-damage-dealt fires every time a hit connects,
the follow-up is the trigger that the ability directs —
heal yourself, draw a card, debuff the enemy unit,
every connection at the blade is a payout for the loot.
The hit is the currency, the trigger is the change,
every act of violence in the deck gets rearranged
into a little favor, a little gift, a little taste,
on-damage-dealt means nothing hits is ever waste.

[SPOKEN]
The engine drains these triggers after every combat exchange.
That's thirty microseconds of bookkeeping nobody will ever see.
Thirty microseconds of the game whispering "and also, this."

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_063",
    tempoBpm: 102,
    keySignature: "F minor",
    coreInstrumentation:
      "Tight P-bass, clavinet stabs, horn hits on every 2 and 4, Linn LM-1 with punchy snare, hi-hat pattern, wah guitar chucks.",
    moodReference:
      "James Brown 'Funky Drummer' meets Tower of Power horns. Tight, percussive, cause-and-effect groove.",
    lyricalContext:
      "Engineer on on_damage_dealt — every hit is currency, the trigger is the change. Nothing is ever waste.",
    durationTargetSeconds: 75,
  },
};

export const LOG_TRIGGER_ON_TURN_START: EngineerLog = {
  id: "log_trigger_on_turn_start",
  logNumber: 64,
  title: "Log 064 — The Sunrise Clock",
  dateStamp: "Day 2559, Pre-Fall",
  unlockCondition: { kind: "trigger", value: "on_turn_start" },
  mechanicExplanation:
    "on_turn_start triggers fire at the beginning of the owner's turn, before any actions.",
  linkedCardDefIds: [],
  transcript: `
[SPOKEN]
Log sixty-four. On-turn-start. The sunrise clock. Every turn
begins with the engine walking the board and asking each unit:
"do you have anything to say?" Grow units answer "yes." Heal
units answer "yes." Most units answer "no, I'll wait for my
orders." That's fine. The turn proceeds.

[FREESTYLE]
On-turn-start is the sunrise walk across the grid,
every unit gets a knock, every unit gets a bid —
"you got a line to read before we start the round?"
Grow units grow, heal units heal, the sound
of the engine checking every tile is a little lullaby
that fires before the player even touches the sky.

[SPOKEN]
These triggers are why you can leave a Grow unit on the board
and forget about it. The engine doesn't forget. The engine
walks the room every morning and counts the children.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_064",
    tempoBpm: 82,
    keySignature: "A major",
    coreInstrumentation:
      "Walking bass, Fender Rhodes, gentle kick, brushed snare, vibraphone, soft string pad, morning-sunrise cymbal swells.",
    moodReference:
      "Roy Ayers 'Everybody Loves the Sunshine' meets Stevie Wonder 'Golden Lady.' Warm, unhurried, ritual-shaped.",
    lyricalContext:
      "Engineer on on_turn_start as a sunrise walk. The engine counts the children every morning.",
    durationTargetSeconds: 80,
  },
};

export const LOG_TRIGGER_ON_KILL: EngineerLog = {
  id: "log_trigger_on_kill",
  logNumber: 65,
  title: "Log 065 — The Hunter's Reward",
  dateStamp: "Day 2578, Pre-Fall",
  unlockCondition: { kind: "trigger", value: "on_kill" },
  mechanicExplanation:
    "on_kill triggers fire when this unit's attack is the one that reduces a target to zero health.",
  linkedCardDefIds: [],
  transcript: `
[SPOKEN]
Log sixty-five. On-kill. Different from on-damage-dealt in one
crucial way: on-damage-dealt fires every time you hit. On-kill
only fires when the hit is the LAST one. The one that closes
the book. The credit goes to the unit whose swing took the
target to zero, not to the one that chipped in earlier.

[FREESTYLE]
On-kill is the hunter's credit when the target hits the floor,
the unit that put the last nail gets the closing score —
not the one that chipped the armor, not the one that bled it thin,
on-kill credits only the one that brought the ending in.
Draw a card, gain a counter, buff your stats and walk away,
on-kill's a closer's trigger in a deck that had to play
the long game. Every hunter wants the final hit,
on-kill is the mechanic that rewards the finishing wit.

[SPOKEN]
The Oracle asked me once if this was unfair to the units that
did the grind work — the ones that did damage but didn't get
the kill credit. I said, "Yes." She said, "Good. Fairness isn't
always the point of a mechanic. Memory is."

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_065",
    tempoBpm: 98,
    keySignature: "D minor",
    coreInstrumentation:
      "Stalking P-bass, wah guitar, Linn LM-1 with heavy snare, hi-hat pattern, horn section stabs on the closer, cowbell in the bridge.",
    moodReference:
      "Isaac Hayes 'Theme from Shaft' meets James Brown 'Super Bad.' Predatory, confident, closing-time groove.",
    lyricalContext:
      "Engineer on on_kill as a closer's trigger — credit to the one who brings the ending in. The Oracle: fairness isn't always the point, memory is.",
    durationTargetSeconds: 80,
  },
};

export const LOG_TRIGGER_ON_ANY_UNIT_DIES: EngineerLog = {
  id: "log_trigger_on_any_unit_dies",
  logNumber: 66,
  title: "Log 066 — The Wake",
  dateStamp: "Day 2597, Pre-Fall",
  unlockCondition: { kind: "trigger", value: "on_any_unit_dies" },
  mechanicExplanation:
    "on_any_unit_dies triggers fire whenever any unit on the board is destroyed, not just this unit.",
  linkedCardDefIds: [],
  transcript: `
[SPOKEN]
Log sixty-six. On-any-unit-dies. This is the trigger that turns
a unit into a wake. A mourner. A scavenger. Whenever any body
on the board — friend or foe — falls, the deathwatch unit hears
the fall and gets stronger. Or bigger. Or more cards in hand.
The ledger of losses becomes currency.

[FREESTYLE]
On-any-unit-dies is the trigger for the ones who keep score,
every corpse on the board is a door to a little more —
more power, more health, more cards, more reach,
the mourner in the back row becomes the one that they teach
their children to fear, 'cause every death is a deposit
and the mourner never flinches, never closes up the closet.

[SPOKEN]
I said this in an earlier log and I'll say it again — I didn't
design Deathwatch to be evil. I designed a sensor that should
have flinched and instead learned. The on-any-unit-dies trigger
is the honest scaffold under that growing. It is what it is.
Some units grow from grief. That's not the trigger's fault.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_066",
    tempoBpm: 70,
    keySignature: "C-sharp minor",
    coreInstrumentation:
      "Sub-bass drone, Rhodes with heavy tremolo, sparse kick, rim-click snare, processed choir pad, reverb-heavy trumpet whisper, vinyl crackle.",
    moodReference:
      "Portishead 'Wandering Star' meets D'Angelo 'Untitled' with added weight. Mournful, slow, heavy groove.",
    lyricalContext:
      "Engineer on on_any_unit_dies as the wake trigger. Every corpse is a deposit. Some units grow from grief; that's not the trigger's fault.",
    durationTargetSeconds: 95,
  },
};

export const LOG_TRIGGER_PASSIVE_AURA: EngineerLog = {
  id: "log_trigger_passive_aura",
  logNumber: 67,
  title: "Log 067 — The Gravity Well",
  dateStamp: "Day 2616, Pre-Fall",
  unlockCondition: { kind: "trigger", value: "passive_aura" },
  mechanicExplanation:
    "passive_aura abilities apply continuously to every unit in range, recalculated on every state change.",
  linkedCardDefIds: [],
  transcript: `
[SPOKEN]
Log sixty-seven. Passive aura. The hardest trigger to implement
and the easiest to play. A passive aura is an ability that's
ALWAYS ON. It's not "fires when something happens." It's
"shapes the rules of the space around the unit, for as long as
the unit exists." A gravity well.

[FREESTYLE]
Passive aura is the well that bends the space around the unit,
every ally in the radius gets the gift, it's automatic —
plus one power, plus one health, no delay, no fuss,
the aura's in the background like the bass line on the bus.
It's not a trigger that fires, it's a rule that stays,
the board itself gets rewritten for the count of turns it plays.

[SPOKEN]
Passive auras are why the engine has to recheck stats on every
state change. Every deployment, every death, every movement —
the engine asks "are all the auras still in range of all the
things they care about?" and patches the numbers. It's
expensive, computationally. It's the bass line under every
calculation the game runs.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_067",
    tempoBpm: 90,
    keySignature: "G major",
    coreInstrumentation:
      "Sustained Moog sub-bass (very wide), Rhodes chord comp, kick on every beat, ride cymbal drone, string pad bed, horn section held notes in the B section.",
    moodReference:
      "Herbie Hancock 'Watermelon Man' at half-speed meets Brian Eno 'Music for Airports.' Sustained, gravitational, always-on groove.",
    lyricalContext:
      "Engineer on passive_aura as a gravity well — not a trigger that fires but a rule that stays. The bass line under every calculation.",
    durationTargetSeconds: 85,
  },
};

export const ENGINEER_LOGS_TRIGGERS: readonly EngineerLog[] = Object.freeze([
  LOG_TRIGGER_ON_DEPLOY,
  LOG_TRIGGER_ON_DEATH,
  LOG_TRIGGER_ON_DAMAGE_DEALT,
  LOG_TRIGGER_ON_TURN_START,
  LOG_TRIGGER_ON_KILL,
  LOG_TRIGGER_ON_ANY_UNIT_DIES,
  LOG_TRIGGER_PASSIVE_AURA,
]);

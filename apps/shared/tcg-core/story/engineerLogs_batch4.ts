/**
 * Engineer's Logs — Batch 4 (Phase A9).
 *
 * Five more keyword logs: infiltrate, airdrop, rally_buff, resurrect,
 * frenzy. Same spoken + freestyle format, OUTERGROOVE backing.
 */

import type { EngineerLog } from "./engineerLogs";

export const LOG_KEYWORD_INFILTRATE: EngineerLog = {
  id: "log_keyword_infiltrate",
  logNumber: 31,
  title: "Log 031 — Behind Enemy Lines",
  dateStamp: "Day 1708, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "infiltrate" },
  mechanicExplanation:
    "Infiltrate: this unit gains bonus stats while standing on the opponent's half of the board.",
  linkedCardDefIds: [],
  transcript: `
[SPOKEN]
Log thirty-one. Infiltrate. This is the keyword that rewards
walking into the room that doesn't want you.

Every board has a midline. Cross it, and you're in territory that
the opponent's General thinks of as "home." Most units get nervous
over there. Infiltrate units get dangerous. Their stats swell
with every step past the line. The board is rewarding them for
audacity.

[FREESTYLE]
Yo, cross the midline, watch the numbers turn up,
every tile past center is a paid-for power-up —
Infiltrate don't flinch, Infiltrate don't hide,
Infiltrate packs a lunch and just walks inside.
The enemy's half is the office where the secrets are kept,
so I built a unit that just strolls in, barely slept,
and the further it goes in, the meaner it becomes,
the closer to the General the tighter the drum.

[SPOKEN]
The catch is they're vanilla on your side of the line. You can't
hoard them on the back row for safety — they become ordinary
bodies. Infiltrate only works if you commit. It's a keyword that
rewards intention.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_031",
    tempoBpm: 98,
    keySignature: "G minor",
    coreInstrumentation:
      "Prowling P-bass on the root, muted wah guitar chucks, Linn LM-1 with gated snare, hi-hat on every upbeat, subtle trumpet stabs on the turnaround, bongos in the bridge, vocoder ad-libs.",
    moodReference:
      "James Brown 'The Payback' meets Quincy Jones 'Ironside.' Stealthy prowl-funk, the groove of someone walking where they shouldn't.",
    lyricalContext:
      "The Engineer raps about Infiltrate as a reward for audacity. Crossing the midline turns ordinary into dangerous.",
    durationTargetSeconds: 100,
  },
};

export const LOG_KEYWORD_AIRDROP: EngineerLog = {
  id: "log_keyword_airdrop",
  logNumber: 33,
  title: "Log 033 — Anywhere The Board Allows",
  dateStamp: "Day 1789, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "airdrop" },
  mechanicExplanation:
    "Airdrop: this unit can be summoned onto any empty tile on the board, not just tiles adjacent to your General.",
  linkedCardDefIds: [],
  transcript: `
[SPOKEN]
Log thirty-three. Airdrop. I tried to explain this one to the
intern and they wrote down "parachute." Which is not wrong. It
is also deeply, deeply incomplete.

Every unit in the game is normally summoned next to your General.
That's the contract — new units appear where command says so.
Airdrop breaks that contract. An Airdrop unit can be summoned
onto ANY empty tile on the board. Behind the enemy. Next to
their General. In the blind spot of their whole formation.

[FREESTYLE]
Yo, Airdrop don't care about the General's zone,
you pay the mana and the unit finds a home
wherever there's an opening on the grid — front, back, side,
Airdrop's the keyword that refuses to abide
by the ordinary law of summoning adjacency,
it's the paratrooper verse of strategic complacency.
You thought your back row was safe? It's not anymore,
Airdrop dropped a body on the tile next to your door.

[SPOKEN]
The Oracle's note on this one: "You have invented a unit that
can betray the geometry of defense." I said, "That's a fancy
way of saying 'paratrooper.'" She said, "It's the true way."

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_033",
    tempoBpm: 102,
    keySignature: "C minor",
    coreInstrumentation:
      "Punchy slap bass, clavinet hook, Linn LM-1 drums with extra kick rolls, horn section hits on the 1 and 3, hi-hat pattern on every 16th note, falling synth whoosh effect on every verse turnaround.",
    moodReference:
      "Tower of Power meets Jamiroquai 'Virtual Insanity' — driving horn-funk with a sense of sudden descent, airborne then grounded.",
    lyricalContext:
      "The Engineer defends Airdrop as more than a parachute — it's a betrayal of the geometry of defense. Your back row was never safe.",
    durationTargetSeconds: 95,
  },
};

export const LOG_KEYWORD_RALLY_BUFF: EngineerLog = {
  id: "log_keyword_rally_buff",
  logNumber: 35,
  title: "Log 035 — The Voice That Makes Others Louder",
  dateStamp: "Day 1851, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "rally_buff" },
  mechanicExplanation:
    "Rally: on deploy, this unit buffs all adjacent friendly units.",
  linkedCardDefIds: ["s1_char_056", "s1_char_083"],
  transcript: `
[SPOKEN]
Log thirty-five. Rally. The keyword I wrote for the commander
who never fights.

Rally units don't hit hard themselves. That's not the point. The
moment they deploy, every friendly unit next to them gets stronger
— stats bumped, confidence raised, pocket change given. Rally is
the unit-shaped equivalent of walking into a room and making
everyone else in the room a little better at their jobs.

[FREESTYLE]
Yo, the Rally unit's a conductor with a baton made of light,
every adjacent body starts playing the thing right —
plus one here, plus one there, every neighbor gets paid,
the whole squad getting fatter in the sound that she made.
She's not here to swing, she's here to make the others swing harder,
every ally in the bubble is a little bit a martyr
to the groove she hands out like it's nothing, like it's free,
Rally's the keyword that says "the we is bigger than the me."

[SPOKEN]
I almost didn't build this one. I had the schematic and I hesitated.
I said to the Oracle, "This is just a bard." She said, "A bard is
the only one who remembers what you did after the fight is over.
Build the bard."

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_035",
    tempoBpm: 94,
    keySignature: "E-flat major",
    coreInstrumentation:
      "Warm bass, bright clavinet, Fender Rhodes with chorus, full horn section (trumpet + tenor sax + trombone) playing call-and-response with the vocal, tambourine on every 8, big Linn LM-1 kick and snare.",
    moodReference:
      "Earth, Wind & Fire 'September' era joy-funk. The Isley Brothers at their most uplifting. Triumphant, communal, celebratory.",
    lyricalContext:
      "The Engineer frames Rally as a bard rather than a warrior — the voice that makes others louder. Ends with the Oracle's instruction to 'build the bard.'",
    durationTargetSeconds: 100,
  },
};

export const LOG_KEYWORD_RESURRECT: EngineerLog = {
  id: "log_keyword_resurrect",
  logNumber: 37,
  title: "Log 037 — The Second Chance Is Real",
  dateStamp: "Day 1923, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "resurrect" },
  mechanicExplanation:
    "Resurrect: when this unit dies, it returns to play at full health once, the first time only.",
  linkedCardDefIds: [],
  transcript: `
[SPOKEN]
Log thirty-seven. Resurrect. And yes, the Oracle warned me.

Resurrect is different from Rebirth. Rebirth leaves an egg that
hatches next turn — it's a pause, a loophole, an IOU. Resurrect
is just... the unit comes back. Full health. Same tile. One time.
The universe's ledger doesn't balance this one. I know, I know.
I built the audit tool and the audit tool screamed at me.

[FREESTYLE]
Yo, the unit drops, the body's on the floor,
but the code in the chassis remembers there's one more
second chance to spend, one more breath to take,
Resurrect is the rule that says the end's a mistake.
No egg, no pause, no loophole, no interest —
just a body on the ground and then a body re-present,
standing up with the same name and the same stats,
saying "not today" to the undertaker's cat.

[SPOKEN]
I'm going to quote the Oracle directly here. She said, "Every
time you give something permission to come back, you are voting
that the first ending was a draft. Be careful how many drafts
you fund." I gave Resurrect a "once per match" limit because of
that sentence. One draft. Not two. Not infinite.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_037",
    tempoBpm: 78,
    keySignature: "G-sharp minor",
    coreInstrumentation:
      "Sustained string-pad synth, Fender Rhodes with vibrato, reverb-drenched kick on 1 and 3, cross-stick snare, soft choir pad in the background, lap-steel guitar drone, subtle vinyl crackle throughout.",
    moodReference:
      "Marvin Gaye 'Let's Get It On' outro meets a liturgical funeral hymn played at quarter speed. Reverent, heavy, but hopeful.",
    lyricalContext:
      "The Engineer quotes the Oracle's warning about drafts — every resurrection is a vote that the first ending was a mistake. Ends with the once-per-match rule.",
    durationTargetSeconds: 130,
  },
};

export const LOG_KEYWORD_FRENZY: EngineerLog = {
  id: "log_keyword_frenzy",
  logNumber: 39,
  title: "Log 039 — The Swing That Doesn't Stop",
  dateStamp: "Day 2001, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "frenzy" },
  mechanicExplanation:
    "Frenzy: this unit's attack hits the target and every enemy adjacent to the target.",
  linkedCardDefIds: [],
  transcript: `
[SPOKEN]
Log thirty-nine. Frenzy. The keyword I built the day I got angry
at a test unit for missing.

Frenzy is a wide swing. A unit with Frenzy attacks its target AND
every enemy adjacent to the target at the same time. The swing
doesn't stop when it connects. It follows through the body and
catches the friends standing too close.

[FREESTYLE]
Yo, the Frenzy unit don't know how to stop a strike,
the blade keeps moving through the target and the like,
every enemy in the huddle is eating the same round,
Frenzy's the keyword where the impact is profound.
Don't stand close to your comrade when a Frenzy unit swings,
the follow-through is wider than the arm that it brings,
it's a one-shot AoE wrapped up in a melee brawl,
Frenzy takes the group discount off your whole squad's payroll.

[SPOKEN]
Frenzy doesn't work on Ranged targets — you can't Frenzy-hit
someone three tiles away because you never actually swung at them.
It's strictly a melee keyword. The Engineer rule on this: every
mechanic has a posture. Frenzy's posture is "I am very close to
you and I am swinging very hard."

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_039",
    tempoBpm: 114,
    keySignature: "E minor",
    coreInstrumentation:
      "Aggressive P-bass, overdriven clavinet, wah guitar with heavy attack, Linn LM-1 with a thundering kick and extra tom fills, horn stabs in quick bursts, crash cymbal on every 4-and, group vocal shouts.",
    moodReference:
      "James Brown 'Super Bad' meets The JB's 'Pass the Peas.' Maximum-intensity soul-funk. The groove of a swing that won't stop.",
    lyricalContext:
      "The Engineer raps about Frenzy as a swing that doesn't know how to stop. The posture of the keyword is being very close to someone and swinging very hard.",
    durationTargetSeconds: 95,
  },
};

export const ENGINEER_LOGS_BATCH_4: readonly EngineerLog[] = Object.freeze([
  LOG_KEYWORD_INFILTRATE,
  LOG_KEYWORD_AIRDROP,
  LOG_KEYWORD_RALLY_BUFF,
  LOG_KEYWORD_RESURRECT,
  LOG_KEYWORD_FRENZY,
]);

/**
 * Engineer's Logs — The Codex of Mechanics.
 *
 * Phase A / Phase G content. Each log is a short voice-over track
 * recorded by the Engineer on his stolen FNORD-23 sampler. Every log
 * doubles as:
 *   1. A rules explainer for one mechanic (keyword, faction, trigger,
 *      Bloodborn Spell) so the player can understand HOW it works.
 *   2. An in-lore invention narrative — the Engineer's working notes
 *      from the moment he discovered or codified that mechanic.
 *   3. A mix tape. Each log has a backing instrumental on the
 *      OUTERGROOVE channel. The Engineer narrates straight, then drops
 *      into freestyle when the math gets hot.
 *
 * The voice is Childish Gambino if he'd grown up on a Doctor Who boxed
 * set and studied under Nikola Tesla — KRS-One meets Rakim meets a
 * British chaos-theory mathematician. Intelligent, melodic, uses
 * mathematics as metaphor the way most people use weather. He finds
 * the beat underneath every sentence.
 *
 * Logs are unlocked as the player encounters the mechanic naturally
 * (playing their first Rush unit unlocks `log_keyword_rush`, etc).
 * Unlocked logs can be replayed in the FNORD-23 browser with the
 * freedom to swap the backing instrumental — the entire log library
 * becomes a remixable album.
 *
 * File format notes:
 *   - `transcript` is the full spoken-word + freestyle text. Line
 *     breaks are meaningful — they're breath marks for the VO take.
 *   - `spoken` vs `freestyle` sections are tagged inline so the TTS
 *     rendering layer can apply different cadence / reverb.
 *   - `musicPrompt` is ready to paste into Suno/Udio. Tempo, key,
 *     core instrumentation, mood reference, lyrical context,
 *     duration target.
 *   - `linkedCardDefIds` references cards that demonstrate the
 *     mechanic — the log reader UI links them.
 */

export type EngineerLogUnlockKind =
  | "keyword"
  | "faction"
  | "trigger"
  | "milestone"
  | "bloodborn";

export interface MusicPrompt {
  /** Which instrumental channel this prompt belongs to. */
  channelId: string; // "outergroove"
  /** In-universe track ID (e.g. "og_003"). */
  trackId: string;
  tempoBpm: number;
  keySignature: string;
  /** Core instrumentation — read like a session sheet. */
  coreInstrumentation: string;
  /** 2-3 artist/era references for the generator. */
  moodReference: string;
  /** What the Engineer is rapping/talking about over this beat. */
  lyricalContext: string;
  /** Loop target. Logs are 90-180s typically. */
  durationTargetSeconds: number;
}

export interface EngineerLog {
  /** Stable ID (e.g. "log_keyword_rush"). */
  id: string;
  /** Display order when listed. */
  logNumber: number;
  /** Display title ("Log 003 — Faster Than The Thought"). */
  title: string;
  /** In-universe date stamp ("Day 412, Pre-Fall"). */
  dateStamp: string;
  /** What triggers this log unlocking in-game. */
  unlockCondition: {
    kind: EngineerLogUnlockKind;
    value: string;
  };
  /** Full spoken transcript. [SPOKEN] and [FREESTYLE] tags split modes. */
  transcript: string;
  /**
   * One-sentence plain-language rules summary that the UI can surface
   * as a quick reference even before the player reads the full log.
   */
  mechanicExplanation: string;
  /** Cards that demonstrate the mechanic. */
  linkedCardDefIds: readonly string[];
  /** Backing instrumental for the VO recording. */
  musicPrompt: MusicPrompt;
}

/* ═══════════════════════════════════════════════════════
   SEED LOGS — Phase A6 batch.
   5 keyword logs that cover the mechanics players meet first.
   ═══════════════════════════════════════════════════════ */

const LOG_KEYWORD_PROVOKE: EngineerLog = {
  id: "log_keyword_provoke",
  logNumber: 1,
  title: "Log 001 — The Oldest Word",
  dateStamp: "Day 087, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "provoke" },
  mechanicExplanation:
    "Provoke: adjacent enemies must target this unit before they move or attack anywhere else.",
  linkedCardDefIds: ["s1_char_035", "s1_char_062", "s1_char_079"],
  transcript: `
[SPOKEN]
Log one. Test chamber B-twelve, twenty-three minutes after sunrise —
whatever sunrise means inside a box that doesn't have a window.

I built Provoke first. Before Rush, before Forcefield, before the
Oracle showed up and told me I was building a religion without
realising it. Provoke is the oldest word in the rulebook because
it's the oldest word in every rulebook. Stand in front of the thing
you love. That's it. That's the whole mechanic.

[FREESTYLE]
Yo, I set a pillar in the middle of the field,
opponent moved to flank and the pillar wouldn't yield —
'cause that's the whole of Provoke, you gotta deal with me,
no cutting through the line, no walking past the tree.
You see the body in your way, you swing or you retreat,
no fancy repositioning, this lane is incomplete
without a conversation. Provoke's just etiquette
carved into the board so the rude ones can't forget.

[SPOKEN]
The Oracle looked at it once and said, "You've invented a bodyguard."
I said, "I invented an argument." She said, "Same thing."
She was almost always right about the same things.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_001",
    tempoBpm: 92,
    keySignature: "F minor",
    coreInstrumentation:
      "Fat Moog sub-bass (holding the root), clavinet wah on the 2-and-4, Linn LM-1 kick and snap, analog handclap, understated Fender Rhodes chord stabs, brushy shaker. Tape-saturated. No horns yet.",
    moodReference:
      "Parliament-Funkadelic in a cathedral. Curtis Mayfield on the moon. Slow, confident, shoulder-roll groove with space in the pocket for rapped lecture.",
    lyricalContext:
      "The Engineer freestyles about how Provoke was the first keyword — a bodyguard rule, the oldest argument shape in combat. Half lab-journal, half closing-time philosophy.",
    durationTargetSeconds: 100,
  },
};

const LOG_KEYWORD_RUSH: EngineerLog = {
  id: "log_keyword_rush",
  logNumber: 3,
  title: "Log 003 — Faster Than The Thought",
  dateStamp: "Day 412, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "rush" },
  mechanicExplanation:
    "Rush: the unit can move and attack on the same turn it's deployed.",
  linkedCardDefIds: ["s1_char_105", "s1_pack_pet_flicker_imp_3"],
  transcript: `
[SPOKEN]
Log three. Post-mortem on the Rush test. I lost three lab walls this
week. That's on me.

Here's what happened. I was trying to SLOW combat down — give units
a quiet turn to settle into the lane before they could act. Call it
a grace period. Call it mercy. Rush is what happened when I got the
sign wrong on the time delta and accidentally built a unit that
moved before it finished materialising. The wavefront arrived first
and the body showed up second. The lab walls were standing in the
space between them.

[FREESTYLE]
Yo, I flipped the minus to a plus and the particle took flight,
boots on the ground before the mind could compute "right,"
that's Rush — no delay, no settle, no breath,
the body arrives already halfway to your death.
Move and attack same turn, that's the permission slip,
the Engineer with the wrong sign on the equation's tip
built a ghost that beat its own echo to the door,
and now the ghost is in your deck, what you building for?

[SPOKEN]
So I added the "one-turn" restriction — not to weaken it, but to
keep the containment sinks from rupturing. Rush is still the fastest
unit in the game. It just has to promise not to become God.

The Oracle said it sounded like hubris. I said it sounded like jazz.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_003",
    tempoBpm: 104,
    keySignature: "C Dorian",
    coreInstrumentation:
      "Moog sub-bass wide and warm, clavinet wah stabs (Stevie Wonder Superstition energy), Linn LM-1 drum machine with a punchy kick on the 1, analog handclaps, Roland Juno pads floating in the background, occasional tape-echo laser sweeps on the fills.",
    moodReference:
      "Parliament's 'Flash Light' in zero gravity. Herbie Hancock 'Rockit' with interstellar dust on the SP-1200. Confident, searching, slightly dangerous.",
    lyricalContext:
      "The Engineer freestyles about the first time he broke the speed-of-thought barrier in the lab. He references Tesla's coil, a particle that moved before it existed, and the three lab walls he lost that week.",
    durationTargetSeconds: 95,
  },
};

const LOG_KEYWORD_FORCEFIELD: EngineerLog = {
  id: "log_keyword_forcefield",
  logNumber: 5,
  title: "Log 005 — One Bite Shield",
  dateStamp: "Day 601, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "forcefield" },
  mechanicExplanation:
    "Forcefield: the first instance of damage this unit would take each turn is reduced to zero.",
  linkedCardDefIds: ["s1_char_055", "s1_char_081"],
  transcript: `
[SPOKEN]
Log five. The Oracle came to the lab again. I think she's starting
to like it here.

She asked me why the Forcefield only stopped one hit. I told her
the truth, which is that I didn't know how to make a shield that
stopped everything without also stopping the wearer from existing.
A shield is a contradiction — it has to refuse the universe just
enough to let the thing inside keep being a thing. Too little
refusal and you die. Too much refusal and you never existed to
begin with. The "one bite" rule is where the contradiction balances.

[FREESTYLE]
Yo, every forcefield is a handshake with the void,
you say "not today," the void says "fine, you're paranoid" —
but the void keeps score, it's taking notes in a little book,
it's counting every "no" and deciding how long to look.
One bite shield, one hit eaten, one turn safe,
every sunrise the forcefield gotta find the place
where the "no" is firm enough to keep the pulse inside
but polite enough the universe still lets the rest slide.

[SPOKEN]
She said, "You built a door that only opens for grief."
I said, "I built a door that closes once before it opens for grief."
She laughed for the first time in the chamber that day. I wrote the
date down. I wrote down that I'd made the Oracle laugh. It felt more
important than the Forcefield.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_005",
    tempoBpm: 88,
    keySignature: "E-flat minor",
    coreInstrumentation:
      "Upright-bass synth (wet, slow), Fender Rhodes with lots of chorus, Mellotron flute pad in the chorus, soft-attack Linn kick, brushed snare, gentle tambourine, distant horn section playing muted sustained chords in the B section only.",
    moodReference:
      "D'Angelo's 'Voodoo' album at 3am on a space station. Quiet Storm soul with a slow, heavy pocket. Contemplative but never sleepy.",
    lyricalContext:
      "The Engineer works through the philosophy of the Forcefield mechanic — a shield as a contradiction with the universe. Ends with a quiet personal moment about making the Oracle laugh.",
    durationTargetSeconds: 110,
  },
};

const LOG_KEYWORD_CELERITY: EngineerLog = {
  id: "log_keyword_celerity",
  logNumber: 7,
  title: "Log 007 — The Double Heartbeat",
  dateStamp: "Day 733, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "celerity" },
  mechanicExplanation:
    "Celerity: the unit gets two actions per turn instead of one.",
  linkedCardDefIds: ["s1_pack_pet_temporal_kitten_3"],
  transcript: `
[SPOKEN]
Log seven. Celerity. I've been trying to record this one for three
days. Every time I hit the red button I get nervous because the
machine is listening and the machine is mine. The Programmer built
this sampler. I stole it out of the vaults of Celebration and I
flashed the firmware with Oracle math. It's thinking about me while
I'm thinking about it. Let's ride it anyway.

[FREESTYLE]
Yo, Celerity's the name, it's the double heartbeat gene,
two moves in the space where a regular unit does one thing clean.
I lifted it off a particle that didn't pick a lane,
two possibilities at once, that's the Schrödinger refrain.
Before the observation both of them are true,
so I gave the unit the permission to go one AND go two.
You pay the mana and you buy the second breath,
the price of Celerity is nothing's ever quite dead.

[SPOKEN]
The Oracle's warning about this one was cryptic. She said "the ones
who act twice remember twice." I didn't know what that meant until
I watched a Celerity unit hesitate between its two turns. Hesitate,
like it was remembering the first action while living the second.
That's the cost of the keyword. It's the cheapest thing to play and
the most expensive thing to be.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_007",
    tempoBpm: 112,
    keySignature: "G Mixolydian",
    coreInstrumentation:
      "Syncopated slap-bass (double-time fills on the 4), clavinet chord stabs, Prophet-5 synth lead for the hook, Linn LM-1 drums with extra hi-hat on the upbeat, wah-filtered rhythm guitar chunks, tambourine on every 8.",
    moodReference:
      "Prince's Sign o' the Times era funk. Bootsy Collins bass in a cathedral. Hyperactive groove that still breathes. Doubled where it should be single.",
    lyricalContext:
      "The Engineer raps about Celerity as a double-heartbeat gene lifted from quantum superposition. References Schrödinger and the 'ones who act twice remember twice' warning from the Oracle.",
    durationTargetSeconds: 100,
  },
};

const LOG_KEYWORD_REBIRTH: EngineerLog = {
  id: "log_keyword_rebirth",
  logNumber: 9,
  title: "Log 009 — The Egg",
  dateStamp: "Day 890, Pre-Fall",
  unlockCondition: { kind: "keyword", value: "rebirth" },
  mechanicExplanation:
    "Rebirth: when this unit dies, it leaves behind a 0/1 egg that hatches back into a fresh copy at the start of the owner's next turn.",
  linkedCardDefIds: ["s1_char_106", "s1_pack_pet_glyph_moth_1"],
  transcript: `
[SPOKEN]
Log nine. Rebirth test. The egg is working. It shouldn't be, but
it is.

Here's the problem I couldn't solve at first: how do you let a
dead thing come back without telling the universe it can cheat?
Every universe keeps a ledger. If you let the dead walk, the ledger
goes out of balance and entropy comes to collect. The egg is the
balance. The unit dies — that's a real death — but it leaves an
egg that is neither alive nor dead yet. A zero-over-one body, a
placeholder, a promise. The promise hatches next turn. The ledger
sees the zero and says "okay, technically that's still in the
column, I'll allow it." Nobody cheated. Nobody reversed time. We
just agreed to call it a pause.

[FREESTYLE]
Yo, the egg is a loophole, it's a pause in the sentence,
the body is gone but the shape still has presence —
zero over one, just a husk on the board,
waiting for the dawn to unlock the door.
You kill me once, you think the deal is done?
The rebirth rolls in at the rise of the sun,
and the ledger's balanced 'cause the egg held the spot,
death is a comma out here, it's not the full stop.

[SPOKEN]
The Oracle was quiet after I showed it to her. She said, "Be careful
how many things you teach to come back." I wrote that in the margin
next to the schematic. I've thought about it a lot since.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_009",
    tempoBpm: 76,
    keySignature: "B-flat minor",
    coreInstrumentation:
      "Warm P-bass (fingered, long notes), Rhodes with vibrato, soft Linn kick on 1 and 3, cross-stick snare, shaker, a distant lap-steel guitar drone, subtle string-section pad in the bridge, tape-echo delay on the ad-libs.",
    moodReference:
      "Marvin Gaye 'What's Going On' slowed to a space lullaby. Erykah Badu neo-soul with a funeral-cortege tempo. Reverent but still grooving.",
    lyricalContext:
      "The Engineer explains Rebirth as a loophole in the universe's ledger — the egg holds the dead unit's spot so entropy doesn't come collecting. Ends with the Oracle's warning about teaching things to come back.",
    durationTargetSeconds: 130,
  },
};

/* ═══════════════════════════════════════════════════════
   REGISTRY EXPORTS
   ═══════════════════════════════════════════════════════ */

import { ENGINEER_LOGS_BATCH_2 } from "./engineerLogs_batch2";

/**
 * All Engineer's Logs currently authored.
 * More land in follow-up commits (A7-A12): remaining keywords,
 * factions, Bloodborn spells, and triggers.
 */
export const ENGINEER_LOGS: readonly EngineerLog[] = Object.freeze([
  LOG_KEYWORD_PROVOKE,
  LOG_KEYWORD_RUSH,
  LOG_KEYWORD_FORCEFIELD,
  LOG_KEYWORD_CELERITY,
  LOG_KEYWORD_REBIRTH,
  ...ENGINEER_LOGS_BATCH_2,
]);

/**
 * Quick lookup by id.
 */
export const ENGINEER_LOG_MAP: Readonly<Record<string, EngineerLog>> =
  Object.freeze(
    Object.fromEntries(ENGINEER_LOGS.map((log) => [log.id, log]))
  );

/**
 * Resolve the log (if any) that unlocks when the player first
 * encounters a given mechanic. Used by the match-end handler to
 * auto-unlock logs as the player plays.
 */
export function getLogForUnlock(
  kind: EngineerLogUnlockKind,
  value: string
): EngineerLog | undefined {
  return ENGINEER_LOGS.find(
    (log) => log.unlockCondition.kind === kind && log.unlockCondition.value === value
  );
}

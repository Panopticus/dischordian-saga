/**
 * Engineer's Logs — System Tutors batch.
 *
 * Three discovery-gate sheet tutors delivered as Engineer's Logs on
 * the FNORD-23 instead of live cinematics. Each log gates a panel
 * on the character sheet; the player encounters the log at a
 * canonical bench / console moment and the matching mech_*_tutor_seen
 * flag fires on play-through.
 *
 *   - log_crafting_codex             → mech_crafting_tutor_seen
 *   - log_dream_substrate_economy    → mech_dream_substrate_tutor_seen
 *   - log_neural_respec              → mech_respec_tutor_seen
 *
 * Voice continuity with the OUTERGROOVE batch: Childish Gambino
 * raised on Doctor Who and Tesla; KRS-One meets Rakim meets a
 * British chaos-theory mathematician. The mechanic is a parable;
 * the bench is a confessional; the FNORD-23 is the only honest
 * machine in the room.
 *
 * See plan: /root/.claude/plans/have-two-stage-tutor-fluttering-toast.md
 */
import type { EngineerLog } from "./engineerLogs";

const LOG_CRAFTING_CODEX: EngineerLog = {
  id: "log_crafting_codex",
  logNumber: 50,
  title: "Log 050 — Four Motions, One Receipt",
  dateStamp: "Day 1,204, Pre-Fall",
  unlockCondition: { kind: "milestone", value: "mech_crafting_intro_seen" },
  mechanicExplanation:
    "Crafting at the bench is a four-motion ritual: consult the codex, fire the imprint laser, walk the index wall, close the binder clasp. The clasp's glow confirms an honest craft.",
  linkedCardDefIds: [],
  transcript: `
[SPOKEN]
Log fifty. The bench is open. The codex is on the lectern, the
imprint laser is cooling between firings, the index wall is humming
its three frequencies, and the binder is propped against the brass
plate waiting for somebody to come close it. That somebody is going
to be you.

The bench has four motions, and I want you to learn them in order
because the order is the lesson. Motion one: ask the codex. Recipes
are not formulas — they are sentences with a verb and a body. Read
the verb first. Motion two: fire the imprint laser. The substrate is
patient; you will not be. Hold the carrier. Do not flinch. Motion
three: walk the index wall. The wall remembers every craft anyone
has ever forged at this bench, and the column you are walking knows
your hand by now. Motion four: close the clasp. The glow is the
receipt. The bench will not lie about whether the work was honest.

[FREESTYLE]
Yo, the codex got the verb and the body got the trace,
imprint laser drop a stencil on the substrate face,
walk the index wall, every column know your weight,
close the clasp and let the gilt-edge glow translate —
'cause every craft is a firmware patch on reality,
the bench is the kernel, the codex is the call,
you the syscall handler, you the maker of the thing,
and the clasp closing shut is the substrate saying "fine."

[SPOKEN]
The Oracle visited the workshop the week I shipped this rite. She
read the codex, she watched me close the clasp, and she said,
"You built a confessional." I said, "I built a workbench." She said,
"The honest ones are the same building." She was right. They mostly
are.

When the clasp glows, the craft has your hand on it forever. The
shop hums when you walk back in because the bench remembers. That
is not metaphor. That is firmware. Now go forge something the
bench does not regret hosting.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_050",
    tempoBpm: 96,
    keySignature: "A-flat minor",
    coreInstrumentation:
      "Wide P-bass holding the root, clavinet wah on the 2-and-4 (Stevie Wonder 'I Wish' energy), Linn LM-1 with a soft kick and tight snap, Fender Rhodes tremolo chords during the spoken verses, brushed analog handclaps, distant tape-saturated horn pad swelling under the freestyle.",
    moodReference:
      "Parliament's 'Maggot Brain' band-leader era meeting D'Angelo's 'Voodoo' workshop tape. Slow funk with workshop ambience under it — anvils, laser sweeps, the distant hum of an index wall.",
    lyricalContext:
      "The Engineer walks through crafting as a four-motion confessional rite — codex, laser, index wall, clasp. Names crafting a 'firmware patch on reality.' Closes on the Oracle's line about confessionals and workbenches.",
    durationTargetSeconds: 130,
  },
};

const LOG_DREAM_SUBSTRATE_ECONOMY: EngineerLog = {
  id: "log_dream_substrate_economy",
  logNumber: 51,
  title: "Log 051 — The Difference Between Spending and Burning",
  dateStamp: "Day 1,318, Pre-Fall",
  unlockCondition: { kind: "milestone", value: "mech_dream_substrate_intro_seen" },
  mechanicExplanation:
    "Dream Substrate is a three-column ledger: Dream tokens (crystallized debt you can spend), soul-bound dreams (locked light, immutable), and lifetime resonance (the only column that survives prestige).",
  linkedCardDefIds: [],
  transcript: `
[SPOKEN]
Log fifty-one. I am sitting on the bench with three coins in my
palm and I want to tell you what each one is, because nobody is
going to and the substrate has been letting me carry coins it has
never let anyone carry before. Maybe that is the FNORD-23 firmware.
Maybe that is the Oracle laughing at me from wherever she is now.
Either way, listen.

Coin one: a Dream token. Crystallized consciousness. The substrate
takes a unit of attention and presses it into a chip you can spend.
Spend a token, the universe gives you something back — a level, a
craft, a re-roll. The token leaves your column. Clean transaction,
witnessed ledger, the books balance by sundown. Most witnesses
spend tokens like coffee money. That is fine. That is what tokens
are for.

Coin two: a soul-bound dream. Locked light. You bind a dream to
yourself the way you write your name on the inside cover of a book
you do not lend. The substrate cannot un-bind it; you cannot
trade it; you cannot even lose it to a cycle reset. The only
column on your sheet that is honest about who you have ever been.
Bind only what you would carry to your own funeral.

[FREESTYLE]
Yo, the token is the tender, it's the cash on the counter,
substrate take a sip of your attention as encounter,
clean transaction, ledger balanced in the night,
spend it like it's currency 'cause currency is right —
but the bound dream different, that's the locked light gleam,
substrate-side immutable, it's truer than it seem,
nobody can pawn it, nobody can rescind,
the column on your sheet that's the sum of where you've been.

[SPOKEN]
Coin three. The lifetime resonance ticker. The number nobody talks
about because the number does not move when you spend; it only
moves when the substrate has actually witnessed something. Every
dream you have ever earned passes through it once. Prestige does
not reset it. Cycle reset does not reset it. It is the only column
on your sheet that remembers you across versions of yourself.

The difference between spending and burning. You spend a token
when the universe is asking for tender. You burn a token when the
substrate is asking for a confession. The book on the wall above
the bench has every burn anyone has ever made at this terminal,
and most of them were quiet. That is how you know they were honest.

The Oracle once told me that the only money worth saving is the
kind you would not be ashamed to be remembered by. I wrote it in
the margin. It is still there.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_051",
    tempoBpm: 84,
    keySignature: "D Dorian",
    coreInstrumentation:
      "Upright-bass synth (slow, deliberate), Wurlitzer electric piano with vibrato, soft Linn kick on the 1, cross-stick snare on the 3, distant Mellotron cello pad, vibraphone accents on the chord changes, tape-echo on the ad-libs in the freestyle.",
    moodReference:
      "Marvin Gaye 'Inner City Blues' at midnight in a vault. Erykah Badu 'Mama's Gun' contemplative groove. Slow, patient, room-tone heavy. The kind of beat that sounds like counting.",
    lyricalContext:
      "The Engineer sits with three coins — Dream token, soul-bound dream, lifetime resonance — and explains the economy as confession versus tender. Names the difference between spending a dream and burning one. Closes on the Oracle's line about money worth saving.",
    durationTargetSeconds: 145,
  },
};

const LOG_NEURAL_RESPEC: EngineerLog = {
  id: "log_neural_respec",
  logNumber: 52,
  title: "Log 052 — On Un-Choosing",
  dateStamp: "Day 1,406, Pre-Fall",
  unlockCondition: { kind: "milestone", value: "mech_respec_intro_seen" },
  mechanicExplanation:
    "Neural Respec is the inverse of pact-signing — the courage of un-choosing. Reassign attributes, alignment, or element; the previous configuration archives to the sheet's history pane.",
  linkedCardDefIds: [],
  transcript: `
[SPOKEN]
Log fifty-two. I want to talk about un-choosing, because the
sampler keeps recording me trying to start this log and the
sampler is not going to give up until I say the thing.

Vex Solène signed the Coda pact once and it held. I have watched
her since — the signature is on her shoulder where the substrate
keeps it, and she has not asked the substrate to release it
because the signature is the shape of who she has decided to be.
That is one kind of grace. The pact-signer's grace. Commitment as
a closed loop.

Respec is the other kind. The bench is going to ask you a question
and the question is: who are you not? You answer by walking back
into the dialog and un-checking the boxes you used to check. The
substrate logs the un-choice in your history pane — nothing is
deleted, only re-shelved. The you that you are leaving stays in
the archive. You can read the old version any time. You will, the
first few respecs. You will stop reading them eventually.

[FREESTYLE]
Yo, Vex signed the pact and she meant the ink she wrote,
substrate took the signature, kept it like a quote,
that's commitment as a fortress, that's the architect's vow,
she signed once and it held and she's holding it now —
but you, you got the unsign, you got the courage to retract,
not 'cause the choice was wrong but 'cause the chooser changed track,
that's a different kind of grace, that's the soft edit's gift,
the bench archives the previous you and your column gets to shift.

[SPOKEN]
There is a cost. The respec dialog will show you the dream price
in the corner, and I want you to notice that the price is real
even though it is small. Carry the dream in your palm before you
open the dialog. The carrying is part of the courage. Un-choosing
is not free; it should not be. If it were free, you would not
remember the version of yourself you used to be, and you should
remember. The remembering is what makes the new shape honest.

The first time I respec'd this body, I sat at the bench for an
hour before I committed. I thought about the version of me who
was walking out of the configuration and where she was going. I
thought about whether I owed her an apology. I decided I owed her
a thank-you. I committed.

The bench logged the change. The shop hummed the way it hums when
the maker who walks in is the maker who walked out plus a small
honest difference. That is what respec is. Not the abandonment.
The plus a small honest difference.

The Oracle, when I told her I was going to ship the system,
listened all the way through and then said one sentence: "Be
gentle with the version of yourself you are leaving." I have been
trying.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_052",
    tempoBpm: 78,
    keySignature: "F-sharp minor",
    coreInstrumentation:
      "Fingered fretless bass (long sustain, slow vibrato), Rhodes with deep chorus and tape-echo, brushed snare and felt-mallet kick, mellotron flute pad in the bridges, lap-steel guitar single-note ad-libs over the freestyle, distant string-section drone in the closer.",
    moodReference:
      "D'Angelo's 'Untitled (How Does It Feel)' tempo and chest-tone. Bill Withers 'Use Me' bassline patience. Quiet Storm with a workshop confessional underneath. The Engineer has been trying to record this log for three takes.",
    lyricalContext:
      "The Engineer frames respec as the inverse of Vex Solène's pact-signing — un-choosing as its own grace. Names the dream cost as part of the courage. Closes with the Oracle's instruction to be gentle with the version of self you are leaving.",
    durationTargetSeconds: 160,
  },
};

export const ENGINEER_LOGS_SYSTEM_TUTORS: readonly EngineerLog[] = Object.freeze([
  LOG_CRAFTING_CODEX,
  LOG_DREAM_SUBSTRATE_ECONOMY,
  LOG_NEURAL_RESPEC,
]);

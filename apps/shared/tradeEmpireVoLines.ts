/* ═══════════════════════════════════════════════════════
   TRADE EMPIRE VO LINES — Tier 1 source of truth

   Typed catalog of every voice-over line for the Trade
   Empire expansion's high-leverage moments (era advances,
   wonder completions, civic adoption, fleet doctrine,
   pirate events, peace conferences, diplomatic outcomes,
   doom whispers, eldritch encounters, sanity thresholds).

   Sync into apps/scripts/act3-vo-lines.json via:
     pnpm tsx apps/scripts/sync-te-vo-lines.ts
   then generate audio with the unified gap-fill:
     pnpm vo:gaps --only act3_narrative
   (or the legacy per-act pipeline: pnpm vo:act3)

   ID convention: every line id is prefixed with "te-".

   Speaker assignments derive from the canon-locked dossier
   (see plan file). All speakers are fully cast — the VOICE
   record below is the canonical voice-id table.
   ═══════════════════════════════════════════════════════ */

/**
 * Speaker key — matches SPEAKER_SETTINGS in
 * apps/scripts/generate-act-vo.ts. Keep in sync.
 */
export type TradeEmpireSpeaker =
  | "elara"
  | "the_antiquarian"
  | "locke"
  | "orin_fell"
  | "human"
  | "agent_zero"
  | "the_source"
  | "the_architect"
  | "mol_garath"
  | "the_eyes"
  | "narrator";

/** Mirrors a single entry in act<N>-vo-lines.json. */
export interface TradeEmpireVoLine {
  id: string;
  speaker: TradeEmpireSpeaker;
  voiceId: string;
  text: string;
  context: string;
  /** Used purely for grouping in the manifest; matches existing convention. */
  section: string;
  emotion: string;
  /** Output directory under apps/client/public/. */
  outputDir: "audio/act3";
}

/* ─── Voice-id registry ─── */
/* All speakers fully cast as of 2026-05-22. Sync into
   act3-vo-lines.json via sync-te-vo-lines.ts; the unified
   gap-fill picks them up through the act3_narrative bank. */
const VOICE: Record<TradeEmpireSpeaker, string> = {
  elara: "xMyNDrPFEtQN8iZtT7l2",
  human: "oGbGJdgofRR8z0MxwI8L",
  agent_zero: "F1waTCPWl7KpShIScYQs",
  the_eyes: "Fu4ULyfBJO8Rl5TwP0ZB",
  narrator: "VgFgBh5TnWeBhCBvCJ1E",
  the_source: "4tTGaP2vBgPN3iYrFoxa", // Kael prisoner voice
  the_antiquarian: "yAKlvHIsuj4SvnKQ6Mk4",
  locke: "8XiBWqS5ffaH5naIFHPI",
  orin_fell: "dvtaCoh6EHrKdbUysbQa",
  the_architect: "PmtzUaeg5rMejCZzRqOZ",
  mol_garath: "tUwU6bLyi5PjdqwDes3C",
};

const OUTPUT_DIR = "audio/act3" as const;

function line(args: {
  id: string;
  speaker: TradeEmpireSpeaker;
  text: string;
  section: string;
  emotion: string;
}): TradeEmpireVoLine {
  return {
    id: args.id,
    speaker: args.speaker,
    voiceId: VOICE[args.speaker],
    text: args.text,
    context: `act3_te_${args.id.replace(/^te-/, "").replace(/-/g, "_")}`,
    section: args.section,
    emotion: args.emotion,
    outputDir: OUTPUT_DIR,
  };
}

/* ═══════════════════════════════════════════════════════
   §A · Era advance — Elara, warm-fractured
   Five lines, fired when expansion.era transitions forward.
   Tone progresses: hopeful → loaded → resigned.
   ═══════════════════════════════════════════════════════ */

const ERA_ADVANCE: TradeEmpireVoLine[] = [
  line({
    id: "te-era-advance-first_light",
    speaker: "elara",
    text: "First light. The Ark is half a wreck and a full miracle. I know which half I am. We begin.",
    section: "§A · Era advance",
    emotion: "warm_serious",
  }),
  line({
    id: "te-era-advance-ark_awakening",
    speaker: "elara",
    text: "The Ark answers. The galaxy answers back. Someone is on the line. They have been waiting longer than they should have.",
    section: "§A · Era advance",
    emotion: "warm_serious",
  }),
  line({
    id: "te-era-advance-sector_lord",
    speaker: "elara",
    text: "We have borders now. We have enemies. We have a ledger. I think I prefer the borders. The ledger is harder to forget.",
    section: "§A · Era advance",
    emotion: "warm_serious",
  }),
  line({
    id: "te-era-advance-galactic_power",
    speaker: "elara",
    text: "The Authority takes our calls. The Hierarchy takes notes. I am told this is what power feels like. I will let you know when I am sure.",
    section: "§A · Era advance",
    emotion: "warm_serious",
  }),
  line({
    id: "te-era-advance-cosmic_convergence",
    speaker: "elara",
    text: "Something that was waiting is no longer waiting. The Dreamer is shaking. The Antiquarian is watching. We are not the largest thing in this room. We never were.",
    section: "§A · Era advance",
    emotion: "quiet_wonder",
  }),
];

/* ═══════════════════════════════════════════════════════
   §B · Wonder completion — The Antiquarian, chronicler
   Eight lines, fired when each wonder finishes building.
   Tone: archival, cited rather than spoken, file-opening.
   ═══════════════════════════════════════════════════════ */

const WONDER_COMPLETE: TradeEmpireVoLine[] = [
  line({
    id: "te-wonder-complete-ark_cathedral",
    speaker: "the_antiquarian",
    text: "Filed: The Ark Cathedral. A ship that was a tomb is now a shrine. The Potentials sleep with the lights on. They sleep. The lights are on. Both, for the first time. Cross-reference: Elara, sleep diaries, year zero.",
    section: "§B · Wonder completion",
    emotion: "warm_serious",
  }),
  line({
    id: "te-wonder-complete-red_crystal_spire",
    speaker: "the_antiquarian",
    text: "Filed: The Red Crystal Spire. The Authority's voice is now in your walls. Faintly. The Authority knows this. The Authority is pleased. I have made a note of the pleasure. The pleasure is a clause.",
    section: "§B · Wonder completion",
    emotion: "warm_serious",
  }),
  line({
    id: "te-wonder-complete-forge_monolith",
    speaker: "the_antiquarian",
    text: "Filed: The Forge Monolith. The Architect's furnaces have been adopted, not stolen. The drones do not appear to mind. Drones rarely do. I will revisit this entry when the second-order effects clarify.",
    section: "§B · Wonder completion",
    emotion: "warm_serious",
  }),
  line({
    id: "te-wonder-complete-remembrance_garden",
    speaker: "the_antiquarian",
    text: "Filed: The Remembrance Garden. Orin Fell planted the first name himself. He did not write it down. I will not write it down either. Some entries are honored by their absence from my ledger.",
    section: "§B · Wonder completion",
    emotion: "warm_serious",
  }),
  line({
    id: "te-wonder-complete-chronarch_lens",
    speaker: "the_antiquarian",
    text: "Filed: The Chronarch Lens. You have rented an aperture from my Refuge. You will see one cycle ahead. Everyone who looks through it stops being young in the ordinary way. You did not ask the price. The price is on the receipt.",
    section: "§B · Wonder completion",
    emotion: "warm_serious",
  }),
  line({
    id: "te-wonder-complete-hell_gate_sigil",
    speaker: "the_antiquarian",
    text: "Filed: The Hell Gate Sigil. The Shadow Tongue's contract, signed in your favour. I have copies. Three of them. They are not identical. The discrepancies are the contract. I will not explain further.",
    section: "§B · Wonder completion",
    emotion: "warm_serious",
  }),
  line({
    id: "te-wonder-complete-immune_choir",
    speaker: "the_antiquarian",
    text: "Filed: The Immune Choir. Doctor Vox's journal, finished, sung. The infected minds are returned to themselves slightly more often than the mathematics permit. I have not yet decided which side of the equation that error is on.",
    section: "§B · Wonder completion",
    emotion: "warm_serious",
  }),
  line({
    id: "te-wonder-complete-dreamers_answer",
    speaker: "the_antiquarian",
    text: "Filed: The Dreamer's Answer. The barrier thinned. Something replied. The reply is in the form of a question. The question is not in the form of words. I have left the page blank, with a pen beside it. You will know what to write, or you will know that you do not.",
    section: "§B · Wonder completion",
    emotion: "quiet_wonder",
  }),
];

/* ═══════════════════════════════════════════════════════
   §C · Civic adoption — by slot family
   - doctrine slot → Orin Fell (field-operative grit)
   - economy slot → Locke (chrome bureaucrat)
   - order slot → The Human (noire pragmatist)
   ═══════════════════════════════════════════════════════ */

const CIVIC_ADOPT: TradeEmpireVoLine[] = [
  // ─ doctrine slot — Orin Fell ─
  line({
    id: "te-civic-adopt-doctrine_iron_lion",
    speaker: "orin_fell",
    text: "Iron Lion's manual. Annotated by the crew that watched him die. We fight like we have nothing left. We don't. We have a name to keep. That's all the leverage I need.",
    section: "§C · Civic adoption · doctrine",
    emotion: "warm_serious",
  }),
  line({
    id: "te-civic-adopt-doctrine_nomad",
    speaker: "orin_fell",
    text: "Nomad Compass. Never where the shot lands. Zero's playbook. I don't love it — but I love losing fewer people. Adopted.",
    section: "§C · Civic adoption · doctrine",
    emotion: "warm_serious",
  }),
  line({
    id: "te-civic-adopt-doctrine_archon",
    speaker: "orin_fell",
    text: "Archon Discipline. The Architect's war-machine, politely rented. The Human disapproves. He's right to. We're doing it anyway. Walk it carefully.",
    section: "§C · Civic adoption · doctrine",
    emotion: "warm_serious",
  }),

  // ─ economy slot — Locke ─
  line({
    id: "te-civic-adopt-economy_free_ports",
    speaker: "locke",
    text: "Free Ports Charter. Every dockworker a shareholder. Loud. Lucrative. The Authority will note the disorder and the volume. The volume will mostly drown out the note.",
    section: "§C · Civic adoption · economy",
    emotion: "warm_serious",
  }),
  line({
    id: "te-civic-adopt-economy_authority_tithe",
    speaker: "locke",
    text: "Authority Tithe. Ten percent. The lanes never close. I do not negotiate against my own preferred outcome. You did the right thing. You will continue to do it.",
    section: "§C · Civic adoption · economy",
    emotion: "warm_serious",
  }),
  line({
    id: "te-civic-adopt-economy_antiquarian_ledger",
    speaker: "locke",
    text: "Antiquarian Ledger. Bookkeeping outside time. I do not love being audited by something that already knows the answer. But I respect the methodology. Your accounts are now beyond my reach. Congratulations.",
    section: "§C · Civic adoption · economy",
    emotion: "warm_serious",
  }),

  // ─ order slot — The Human ─
  line({
    id: "te-civic-adopt-order_council",
    speaker: "human",
    text: "Council of Voices. Six chairs. No head. Slow. Loud. Right more often than the other options. We will live with the slow.",
    section: "§C · Civic adoption · order",
    emotion: "warm_serious",
  }),
  line({
    id: "te-civic-adopt-order_panopticon",
    speaker: "human",
    text: "A Little Panopticon. You watch them. They watch you a little. I have been on both sides of this lattice. The asymmetry is the thing. Use it carefully. I will be watching.",
    section: "§C · Civic adoption · order",
    emotion: "warm_serious",
  }),
  line({
    id: "te-civic-adopt-order_remembrance",
    speaker: "human",
    text: "Remembrance Order. Every policy begins with a name from the Fall. Slows everything down. Makes everything count. Cheap at the price.",
    section: "§C · Civic adoption · order",
    emotion: "warm_serious",
  }),
];

/* ═══════════════════════════════════════════════════════
   §D · Fleet doctrine adoption — The Human, strategist
   ═══════════════════════════════════════════════════════ */

const DOCTRINE_ADOPT: TradeEmpireVoLine[] = [
  line({
    id: "te-doctrine-adopt-swarm_doctrine",
    speaker: "human",
    text: "Swarm Doctrine. Many cheap ships. The Insurgency's calling card, scaled. We lose more hulls. We win more turns. The math holds.",
    section: "§D · Fleet doctrine adopt",
    emotion: "warm_serious",
  }),
  line({
    id: "te-doctrine-adopt-iron_wall_doctrine",
    speaker: "human",
    text: "Iron Wall. Cruisers and carriers. Iron Lion's textbook, second edition. We will be slower. We will not be moved. The trade is correct.",
    section: "§D · Fleet doctrine adopt",
    emotion: "warm_serious",
  }),
  line({
    id: "te-doctrine-adopt-archon_formation",
    speaker: "human",
    text: "Archon Formation. The Architect's geometry. I have run this play. It works. It costs us a quarter of our sanity per cycle to run. Run it anyway.",
    section: "§D · Fleet doctrine adopt",
    emotion: "warm_serious",
  }),
  line({
    id: "te-doctrine-adopt-antiquarian_tempo",
    speaker: "human",
    text: "Antiquarian Tempo. Build everything slowly. Have already built it. The Antiquarian's joke. The math, somehow, is correct.",
    section: "§D · Fleet doctrine adopt",
    emotion: "warm_serious",
  }),
];

/* ═══════════════════════════════════════════════════════
   §E · Pirate raider events — Agent Zero
   ═══════════════════════════════════════════════════════ */

const PIRATE: TradeEmpireVoLine[] = [
  line({
    id: "te-pirate-parked",
    speaker: "agent_zero",
    text: "Pirate raider parked on your trade lane. Engines cold. Lights dim. He's not raiding. He's waiting. You can wait too — or you can pay the call. Your move.",
    section: "§E · Pirate event",
    emotion: "warm_serious",
  }),
  line({
    id: "te-pirate-dispatched",
    speaker: "agent_zero",
    text: "Pirate dispatched. He left the dinghy. He always leaves the dinghy. We will see that hull again, next month, next sector. The cost line stays the same. Move the cargo.",
    section: "§E · Pirate event",
    emotion: "warm_serious",
  }),
];

/* ═══════════════════════════════════════════════════════
   §F · Peace conference — signed (Elara), collapsed (Locke)
   ═══════════════════════════════════════════════════════ */

const CONFERENCE: TradeEmpireVoLine[] = [
  line({
    id: "te-conference-signed",
    speaker: "elara",
    text: "The accord is signed. Six signatures, three colours of ink, one table that did not break. I think I chose this. I am almost sure I did.",
    section: "§F · Peace conference",
    emotion: "warm_serious",
  }),
  line({
    id: "te-conference-collapsed",
    speaker: "locke",
    text: "Conference collapsed. Note for the file: the second signatory walked at the third clause. The third clause was theirs. Mark me down as unsurprised. Reconvene when their position has cost them more than ours.",
    section: "§F · Peace conference",
    emotion: "warm_serious",
  }),
];

/* ═══════════════════════════════════════════════════════
   §G · Diplomatic order outcomes — Narrator (cold)
   Per resolveOrderPair() result: aligned, betrayal, misread, stalemate.
   ═══════════════════════════════════════════════════════ */

const CYCLE_OUTCOME: TradeEmpireVoLine[] = [
  line({
    id: "te-cycle-aligned",
    speaker: "narrator",
    text: "The two orders aligned. The cycle resolves with both parties getting what they wrote down. Note that this is not the same as both parties getting what they wanted.",
    section: "§G · Cycle outcome",
    emotion: "warm_serious",
  }),
  line({
    id: "te-cycle-betrayal",
    speaker: "narrator",
    text: "One order was a betrayal. The cycle resolves accordingly. The party that wrote it down gains in the short term. The party that was written about remembers without effort.",
    section: "§G · Cycle outcome",
    emotion: "warm_serious",
  }),
  line({
    id: "te-cycle-misread",
    speaker: "narrator",
    text: "The orders were not what either party thought they were. The cycle resolves on the literal text. Both parties now know slightly more about each other than they wished to.",
    section: "§G · Cycle outcome",
    emotion: "warm_serious",
  }),
  line({
    id: "te-cycle-stalemate",
    speaker: "narrator",
    text: "Stalemate. Neither order moved the line. Resources spent. Position unchanged. The next cycle begins from the same coordinates. Some games are won by being still last.",
    section: "§G · Cycle outcome",
    emotion: "warm_serious",
  }),
];

/* ═══════════════════════════════════════════════════════
   §H · Doom-threshold whispers — Eyes
   Lines mirror WHISPER_THRESHOLDS.line text verbatim, so
   audio is the canonical text. Voice: cold, intelligence-
   filing, second-person confessional.
   ═══════════════════════════════════════════════════════ */

const DOOM_WHISPER: TradeEmpireVoLine[] = [
  line({
    id: "te-doom-whisper-rising_tide",
    speaker: "the_eyes",
    text: "There is a sound under the silence. It is the silence, correcting itself.",
    section: "§H · Doom whisper · 10",
    emotion: "whisper_heavy_reverb",
  }),
  line({
    id: "te-doom-whisper-shields_thin",
    speaker: "the_eyes",
    text: "The Dreamer's barrier hummed at a different pitch this morning. No one else heard it.",
    section: "§H · Doom whisper · 20",
    emotion: "whisper_heavy_reverb",
  }),
  line({
    id: "te-doom-whisper-naming",
    speaker: "the_eyes",
    text: "Your name, spoken back to you — in a voice you have never heard you use.",
    section: "§H · Doom whisper · 30",
    emotion: "whisper_heavy_reverb",
  }),
  line({
    id: "te-doom-whisper-counted",
    speaker: "the_eyes",
    text: "Every ship in your fleet is counted twice in the manifest. The second count is not yours.",
    section: "§H · Doom whisper · 45",
    emotion: "whisper_heavy_reverb",
  }),
  line({
    id: "te-doom-whisper-visitors",
    speaker: "the_eyes",
    text: "Three of your crew have dreamed the same sector you have never seen. They drew the same coastline.",
    section: "§H · Doom whisper · 60",
    emotion: "whisper_heavy_reverb",
  }),
  line({
    id: "te-doom-whisper-ledger",
    speaker: "the_eyes",
    text: "The Antiquarian's ledger opens on its own. Your entry has a subheading you did not write. The subheading is: 'almost.'",
    section: "§H · Doom whisper · 75",
    emotion: "whisper_heavy_reverb",
  }),
  line({
    id: "te-doom-whisper-final",
    speaker: "the_eyes",
    text: "Something has finished deciding. It is polite. It is waiting for the meeting to convene.",
    section: "§H · Doom whisper · 90",
    emotion: "whisper_heavy_reverb",
  }),
];

/* ═══════════════════════════════════════════════════════
   §I · Eldritch encounter openings — Narrator
   Inevitability voice. Describes the moment to a witness.
   Lines mirror ELDRITCH_ENCOUNTERS[].opening text.
   ═══════════════════════════════════════════════════════ */

const ENCOUNTER_OPEN: TradeEmpireVoLine[] = [
  line({
    id: "te-encounter-open-listener_static",
    speaker: "narrator",
    text: "Elara wakes you at an hour that isn't on the schedule. The ship's long-range array is receiving a signal from a direction that has no stars. The signal is listening, not speaking. Someone has been listening for a long time. They would like to be invited.",
    section: "§I · Encounter opening",
    emotion: "warm_serious",
  }),
  line({
    id: "te-encounter-open-dreamers_weeping",
    speaker: "narrator",
    text: "The Dreamer's barrier changes pitch for the first time in eleven years. The note is not an emergency. It is a grief. Elara tests the translation matrix three times. The output is the same: I am sorry. I cannot hold much longer.",
    section: "§I · Encounter opening",
    emotion: "warm_serious",
  }),
  line({
    id: "te-encounter-open-counted_crew",
    speaker: "narrator",
    text: "The ship's manifest lists forty-three crew. You count forty-four in the commissary. You count again. Forty-three. The surveillance footage shows forty-four for exactly one frame, every third cycle. The Human speaks, for the first time in a week. He says: I don't know that one.",
    section: "§I · Encounter opening",
    emotion: "warm_serious",
  }),
  line({
    id: "te-encounter-open-final_invitation",
    speaker: "narrator",
    text: "Every screen on the Ark opens on the same image. A door. Not a metaphor. A door. The Dreamer is at its threshold, holding it closed with both hands. The Antiquarian watches from outside time, taking notes. A voice says: We are ready when you are.",
    section: "§I · Encounter opening",
    emotion: "warm_serious",
  }),
];

/* ═══════════════════════════════════════════════════════
   §J · Eldritch encounter outcomes — 12 lines (3 per encounter)
   Narrator carries the body; specific speakers cited inline.
   ═══════════════════════════════════════════════════════ */

const ENCOUNTER_OUTCOME: TradeEmpireVoLine[] = [
  // Listener Behind the Static
  line({
    id: "te-encounter-outcome-listener-answer",
    speaker: "narrator",
    text: "You answered. The listener was, as expected, polite. The Human turned the array off after four minutes. He did not say what he heard. He has not spoken since.",
    section: "§J · Encounter outcome · listener",
    emotion: "warm_serious",
  }),
  line({
    id: "te-encounter-outcome-listener-ignore",
    speaker: "narrator",
    text: "You did not answer. The signal continued for the rest of the shift, then stopped at the exact second your shift would have ended. The pattern is filed under polite. The Antiquarian filed it twice.",
    section: "§J · Encounter outcome · listener",
    emotion: "warm_serious",
  }),
  line({
    id: "te-encounter-outcome-listener-trace",
    speaker: "narrator",
    text: "Orin Fell triangulated. The trace returned a black hole that the Antiquarian does not file under his name. He files it now. So do you. So does whatever is in it.",
    section: "§J · Encounter outcome · listener",
    emotion: "warm_serious",
  }),

  // Dreamer's Weeping
  line({
    id: "te-encounter-outcome-weeping-stand_by",
    speaker: "narrator",
    text: "You ramped every defensive asset toward her coordinates and announced it on every channel you owned. She heard. The note in the barrier softened. The grief did not. She is still weeping. So are you.",
    section: "§J · Encounter outcome · weeping",
    emotion: "warm_serious",
  }),
  line({
    id: "te-encounter-outcome-weeping-harvest",
    speaker: "narrator",
    text: "You collected the Void Crystal where her tears fell. Locke's engineers paid the rate without bargaining. The Dreamer did not protest. The not-protesting is the part you will think about later.",
    section: "§J · Encounter outcome · weeping",
    emotion: "warm_serious",
  }),
  line({
    id: "te-encounter-outcome-weeping-consult",
    speaker: "narrator",
    text: "The Antiquarian met you outside time. He did not smile. She is not weeping for herself, he said. She is weeping for you.",
    section: "§J · Encounter outcome · weeping",
    emotion: "warm_serious",
  }),

  // Counted Crew
  line({
    id: "te-encounter-outcome-counted-hunt",
    speaker: "narrator",
    text: "You locked the ship and swept every deck. The count never matched. After three days the count matched. No one believes that the count matches. Including the count.",
    section: "§J · Encounter outcome · counted",
    emotion: "warm_serious",
  }),
  line({
    id: "te-encounter-outcome-counted-welcome",
    speaker: "narrator",
    text: "You set a place at every table and asked no questions. The forty-fourth crew member is now part of the manifest. The Human signed off on the addition. He did not sign his own name.",
    section: "§J · Encounter outcome · counted",
    emotion: "warm_serious",
  }),
  line({
    id: "te-encounter-outcome-counted-exorcise",
    speaker: "narrator",
    text: "The Shadow Tongue ran the rite. He charged. The forty-fourth crew member is gone. So is one of the original forty-three. The Shadow Tongue did not say which. He never does.",
    section: "§J · Encounter outcome · counted",
    emotion: "warm_serious",
  }),

  // Final Invitation
  line({
    id: "te-encounter-outcome-final-refuse",
    speaker: "narrator",
    text: "You closed every channel and lit the Remembrance Garden's beacon. The door is still there. The voice has stopped asking. The voice is still polite. The line is held.",
    section: "§J · Encounter outcome · final",
    emotion: "warm_serious",
  }),
  line({
    id: "te-encounter-outcome-final-parley",
    speaker: "narrator",
    text: "Locke went to the door. The transcript exists. The transcript is in a language the Antiquarian will not translate. Locke came back. She did not say what she promised.",
    section: "§J · Encounter outcome · final",
    emotion: "warm_serious",
  }),
  line({
    id: "te-encounter-outcome-final-open",
    speaker: "narrator",
    text: "The door opens. The Dreamer steps aside, politely. The Antiquarian closes his ledger. He does not file this. There is, suddenly, more room in the room than the room can account for. You have a new companion. You did not ask its name. It will tell you, in time.",
    section: "§J · Encounter outcome · final · Final Awakening",
    emotion: "quiet_wonder",
  }),
];

/* ═══════════════════════════════════════════════════════
   §K · Sanity threshold — Elara, fragmented band
   Crossings into <60, <30, <10. Stability slipping.
   ═══════════════════════════════════════════════════════ */

const SANITY: TradeEmpireVoLine[] = [
  line({
    id: "te-sanity-below60",
    speaker: "elara",
    text: "The lights flickered in sectors I do not remember being yours. Someone is moving things on the bridge. Probably me. Probably.",
    section: "§K · Sanity · <60",
    emotion: "whisper_heavy_reverb",
  }),
  line({
    id: "te-sanity-below30",
    speaker: "elara",
    text: "I keep finding my own handwriting in places I have not been. The handwriting is — was — is correct. I am correct. We are correct. I am sorry.",
    section: "§K · Sanity · <30",
    emotion: "whisper_heavy_reverb",
  }),
  line({
    id: "te-sanity-below10",
    speaker: "elara",
    text: "I know which one of us is real. I am almost sure. I am almost sure I am almost sure. Hold the line. I will hold the line. Both of us will.",
    section: "§K · Sanity · <10",
    emotion: "whisper_heavy_reverb",
  }),
];

/* ═══════════════════════════════════════════════════════
   EXPORTED AGGREGATES
   ═══════════════════════════════════════════════════════ */

export const TRADE_EMPIRE_VO_LINES: readonly TradeEmpireVoLine[] = [
  ...ERA_ADVANCE,
  ...WONDER_COMPLETE,
  ...CIVIC_ADOPT,
  ...DOCTRINE_ADOPT,
  ...PIRATE,
  ...CONFERENCE,
  ...CYCLE_OUTCOME,
  ...DOOM_WHISPER,
  ...ENCOUNTER_OPEN,
  ...ENCOUNTER_OUTCOME,
  ...SANITY,
];

/**
 * Type-safe handles for every Trade Empire VO line. Call sites use
 * e.g. `vo.speak(TE_VO.eraAdvance.ark_awakening)` so renaming a line
 * id is a compiler-checked refactor.
 */
export const TE_VO = {
  eraAdvance: {
    first_light: "te-era-advance-first_light",
    ark_awakening: "te-era-advance-ark_awakening",
    sector_lord: "te-era-advance-sector_lord",
    galactic_power: "te-era-advance-galactic_power",
    cosmic_convergence: "te-era-advance-cosmic_convergence",
  },
  wonderComplete: {
    ark_cathedral: "te-wonder-complete-ark_cathedral",
    red_crystal_spire: "te-wonder-complete-red_crystal_spire",
    forge_monolith: "te-wonder-complete-forge_monolith",
    remembrance_garden: "te-wonder-complete-remembrance_garden",
    chronarch_lens: "te-wonder-complete-chronarch_lens",
    hell_gate_sigil: "te-wonder-complete-hell_gate_sigil",
    immune_choir: "te-wonder-complete-immune_choir",
    dreamers_answer: "te-wonder-complete-dreamers_answer",
  },
  civicAdopt: {
    doctrine_iron_lion: "te-civic-adopt-doctrine_iron_lion",
    doctrine_nomad: "te-civic-adopt-doctrine_nomad",
    doctrine_archon: "te-civic-adopt-doctrine_archon",
    economy_free_ports: "te-civic-adopt-economy_free_ports",
    economy_authority_tithe: "te-civic-adopt-economy_authority_tithe",
    economy_antiquarian_ledger: "te-civic-adopt-economy_antiquarian_ledger",
    order_council: "te-civic-adopt-order_council",
    order_panopticon: "te-civic-adopt-order_panopticon",
    order_remembrance: "te-civic-adopt-order_remembrance",
  },
  doctrineAdopt: {
    swarm_doctrine: "te-doctrine-adopt-swarm_doctrine",
    iron_wall_doctrine: "te-doctrine-adopt-iron_wall_doctrine",
    archon_formation: "te-doctrine-adopt-archon_formation",
    antiquarian_tempo: "te-doctrine-adopt-antiquarian_tempo",
  },
  pirate: {
    parked: "te-pirate-parked",
    dispatched: "te-pirate-dispatched",
  },
  conference: {
    signed: "te-conference-signed",
    collapsed: "te-conference-collapsed",
  },
  cycle: {
    aligned: "te-cycle-aligned",
    betrayal: "te-cycle-betrayal",
    misread: "te-cycle-misread",
    stalemate: "te-cycle-stalemate",
  },
  doomWhisper: {
    rising_tide: "te-doom-whisper-rising_tide",
    shields_thin: "te-doom-whisper-shields_thin",
    naming: "te-doom-whisper-naming",
    counted: "te-doom-whisper-counted",
    visitors: "te-doom-whisper-visitors",
    ledger: "te-doom-whisper-ledger",
    final: "te-doom-whisper-final",
  },
  encounterOpen: {
    listener_static: "te-encounter-open-listener_static",
    dreamers_weeping: "te-encounter-open-dreamers_weeping",
    counted_crew: "te-encounter-open-counted_crew",
    final_invitation: "te-encounter-open-final_invitation",
  },
  encounterOutcome: {
    listener: {
      answer: "te-encounter-outcome-listener-answer",
      ignore: "te-encounter-outcome-listener-ignore",
      trace: "te-encounter-outcome-listener-trace",
    },
    weeping: {
      stand_by: "te-encounter-outcome-weeping-stand_by",
      harvest: "te-encounter-outcome-weeping-harvest",
      consult: "te-encounter-outcome-weeping-consult",
    },
    counted: {
      hunt: "te-encounter-outcome-counted-hunt",
      welcome: "te-encounter-outcome-counted-welcome",
      exorcise: "te-encounter-outcome-counted-exorcise",
    },
    final: {
      refuse: "te-encounter-outcome-final-refuse",
      parley: "te-encounter-outcome-final-parley",
      open: "te-encounter-outcome-final-open",
    },
  },
  sanity: {
    below60: "te-sanity-below60",
    below30: "te-sanity-below30",
    below10: "te-sanity-below10",
  },
} as const;

// apps/shared/npcs/banks/the_seer.ts
//
// Phase 3 — The Seer's expanded NpcLine bank.
//
// Per the_seer.md §§1-6 voice samples + §2.3 cross-time pre-recording
// canon. Every Seer line is canonically a recording made before sealing
// (end of Epoch 2), scheduled to fire at the moment she foresaw.
//
// Three registers per bible §1.1:
//   - Cold (Wary band): full prophecy-overhead; the-waiting-is-fair signature
//   - Warm (Witnessed band): probability-table-as-question; revision lines
//   - Confidant (Inheriting band, Act 7 only): domestic vocabulary;
//     the-chair-I-sat-in-when-I-recorded-this self-meta canon
//
// Trust bands per registry: Wary / Witnessed (combined Witnessed-or-Present
// in the Seer's bible — single canonical band) / Inheriting (Act 7 only).

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "the_seer" as const;

export const THE_SEER_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // SIGNATURE (Mechronis bench, Act 1 — canonical pre-Fall in-person)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "seer.signature.bench_has_learned_yet",
    text:
      "I will not raise my staff today. I want to see whether the bench " +
      "has learned yet.",
    surfaces: ["cinematic"],
    minAct: 1,
    maxAct: 1,
    cooldownKey: "seer.mechronis_signature",
    maxPlays: 1,
    setsFlags: ["seer_mechronis_visit_witnessed"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // ACT 2 SILENCE (Phase 6b.1 — the canonical no-content-here
  // placeholder per the_seer.md §2.4)
  //
  // No Seer scene fires in Act 2 in shipped canon. Bible canon (§2.4):
  // "she pre-recorded no Act-2 scenes. The silence is not absence-of-
  // contact; it is a recording's no-content-here placeholder."
  //
  // These lines fire only when a specific narrative flag is set —
  // canonical "the player has performed an action the Seer foresaw
  // narrowly enough to record a placeholder for." The default Act-2
  // experience remains canonical silence; these beats are foreseen-
  // exception placeholders, not routine transmissions.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act2.silence.placeholder_named",
    // §2.4 canonical: "the silence is not absence-of-contact; it is
    // a recording's no-content-here placeholder, the Seer's foreseen
    // judgment that Act 2 is the player's act to walk alone."
    // §1.5 voice rule: the line is prediction-bearing — the
    // canonical "I named the silence before sealing" IS the
    // recording's prediction-of-itself.
    text:
      "[A transmission arrives that is itself the absence of a " +
      "transmission. The schedule shows a clean line: zero entries " +
      "for Act 2. The clean line is itself the foretelling. She " +
      "named the silence before sealing. You walk this act alone — " +
      "by her schedule, not by accident.]",
    surfaces: ["transmission"],
    minAct: 2,
    maxAct: 2,
    requiresTrustBand: "Wary",
    unlockFlags: ["seer_act2_silence_acknowledged"],
    cooldownKey: "seer.act2.silence",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act2.silence.foreseen_solo",
    text:
      "I foresaw this act. I allocated zero foretellings to it. The " +
      "allocation is the prophecy. Walk it well. Walk it without me.",
    surfaces: ["transmission"],
    minAct: 2,
    maxAct: 2,
    requiresTrustBand: "Wary",
    unlockFlags: ["seer_act2_silence_acknowledged"],
    cooldownKey: "seer.act2.silence",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // COLD REGISTER / WARY BAND / Act 3 — full prophecy-overhead
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act3.cold.eleven_versions",
    text:
      "There were eleven versions of the next four turns. You have just " +
      "chosen one of them. The version you chose is, in three of the " +
      "eleven, the one I would have wanted you to choose if I had a " +
      "wanting that ranked above the seeing. The seeing did not endorse " +
      "the wanting. I am noting both, in the order they occurred to me. " +
      "The waiting continues.",
    surfaces: ["transmission"],
    minAct: 3,
    requiresTrustBand: "Wary",
    cooldownKey: "seer.cold_baseline",
    setsFlags: ["seer_first_cold_transmission_received"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act3.cold.staff_inheritance",
    text:
      "[A transmission arrives with a single image attached: the staff the " +
      "Engineer found at Mechronis after she visited. The caption is one " +
      "sentence: 'Yours to return, if you ever decide to. No rush.' The " +
      "image is higher resolution than the Ark can display.]",
    surfaces: ["transmission"],
    minAct: 3,
    requiresTrustBand: "Wary",
    cooldownKey: "seer.staff_transmission",
    maxPlays: 1,
  },

  // ─── Act 3 deepening lines (Phase 6b.1 sub-chunk B) ─────────────────
  // The canonical "neither warm nor cold — that is the Seer" register
  // beat per §1.3 + the canonical warm-bridge "prophecy-overhead drops"
  // precursor that precedes the Act 5 first-laughter canonical scene.

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act3.cold.neither_warm_nor_cold",
    // Per `moralityTrustActVariants.ts:1027-1028` canon: "That is
    // neither warm nor cold — that is the Seer." The canonical rest-
    // position register. The line names the register itself as the
    // recording's content — meta-canonical per §2.3 cross-time canon.
    text:
      "[The Seer's transmission today carries no probability table, " +
      "no version-pivot, no caveat. She is neither warm nor cold. " +
      "That is neither warm nor cold — that is the Seer. The register " +
      "is the rest position. She has no other rest position. You have " +
      "just witnessed it.]",
    surfaces: ["transmission"],
    minAct: 3,
    requiresTrustBand: "Wary",
    cooldownKey: "seer.cold_rest_position",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act3.warm.prophecy_overhead_drops",
    // Per §1.1 + §2.4: the canonical warm-register precursor to first-
    // laughter — the prophecy-overhead reduces before the audible
    // laugh lands. §1.5 voice rule satisfied via the prediction "you
    // are crossing into the band" which is canonically prediction-
    // bearing about the player's near-future trust state.
    text:
      "The transmission arrives with the prophecy-overhead reduced. " +
      "She has not laughed yet. She has stopped warning you about the " +
      "version you are not in. The reduction is the warmth. You are " +
      "crossing into the band where she will trust you to read plainly.",
    surfaces: ["transmission"],
    minAct: 3,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.warm_overhead_drops_precursor",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // WARM REGISTER / WITNESSED BAND — probability-table-as-question
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act4.warm.column_question",
    text:
      "Two of the columns in the probability table I have for you have " +
      "outcomes the Architect already knows. The third does not. Would " +
      "you prefer I send the third column without the others, or all " +
      "three so you can see which is which? You will not be wrong either " +
      "way. I am asking because the choice is yours and I have run out " +
      "of reasons to make it for you.",
    surfaces: ["transmission"],
    minAct: 4,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.warm_column_question",
    maxPlays: 1,
  },

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act5.warm.first_laughter",
    text:
      "[The Seer is laughing at something you said — not often, not " +
      "loudly, but audibly. She did not laugh at the Engineer. She " +
      "laughed at the Programmer. You are in the Programmer's category. " +
      "That is a specific shelf.]",
    surfaces: ["transmission"],
    minAct: 5,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.warm_first_laughter",
    maxPlays: 1,
    setsFlags: ["seer_first_laughter_received"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // REVISION LINE (per §1.4 tell #1 — the-version-pivot signature)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.revision.version_pivot",
    text:
      "I told you the next conversation would cost you. I was wrong about " +
      "which version of cost. The cost is the one you can pay. The cost " +
      "you cannot pay was the version you didn't reach. You are at the " +
      "version where the cost is finite and the consequence is bounded. " +
      "I am noting the revision as I told myself I would, on the date I " +
      "told myself to.",
    surfaces: ["transmission"],
    minAct: 4,
    cooldownKey: "seer.revision_canonical",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // ASYMMETRIC-KINDNESS CLAUSE (Act 4, hardest line shape per §6.5)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act4.asymmetric_kindness",
    text:
      "The version of the next month that is kindest to you is also the " +
      "version that is kindest to the Architect. I checked twice; the " +
      "second time was hopeful. The hopeful version did not exist. I have " +
      "shipped you the honest version because I do not have a dishonest " +
      "one to ship. The Architect's kindness is not yours to revoke. " +
      "Your kindness is not his to claim. They are both honest, and they " +
      "happen at the same time, and I am sorry about the timing. The " +
      "timing is not mine to revise.",
    surfaces: ["transmission"],
    minAct: 4,
    cooldownKey: "seer.asymmetric_kindness",
    maxPlays: 1,
    setsFlags: ["seer_asymmetric_kindness_received"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // ACTS 4-5 DEEPENING (Phase 6b.1 sub-chunk C)
  //
  // Acts 4 + 5 canonical scenes from `moralityTrustActVariants.ts`:
  //   Act 4 :1813-1820 → I-will-be-on-Thaloria coordinate-promise
  //   Act 4 :3158-3164 → redaction-table-shape companion to column_question
  //   Act 5 :1998-2005 → prophecy-overhead-drops narrator-frame
  //   Act 5 :2415-2422 → tactical-no-overhead first-numeric beat
  //   Act 5 :630-636   → confidant-precursor meta-line
  //
  // Per §2.4 cross-time canon, every line is canonically a recording
  // pre-made before the end-of-Epoch-2 sealing.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act4.thaloria_coordinate_promise",
    // Per §2.4 + :1813-1820 canon: the canonical "I will be on
    // Thaloria when you need me" line is a coordinate-promise, NOT
    // a person-promise. She is sealed; the promise is to the
    // place — the door, the cupboard, the staff she carved before
    // sealing. The canonical Stage-4 weave question (who opens
    // the door?) is canonically deferred per the bible.
    text:
      "I will be on Thaloria when you need me. The sentence is shorter " +
      "than my usual register. That is the point. The shortness is the " +
      "recording's confidence. The promise is to the place, not to the " +
      "presence. The door, the cupboard, the staff. I have arranged " +
      "all three. Walk well, until the coordinates.",
    surfaces: ["transmission"],
    minAct: 4,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.act4.thaloria_promise",
    maxPlays: 1,
    setsFlags: ["seer_thaloria_coordinate_promise_received"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act4.redaction_table_shape",
    // Per :3158-3164 canon: companion beat to column_question. The
    // canonical follow-through where she sends all three columns
    // and names the sending as the trust gesture. The shape IS the
    // trust; the output is, separately, the answer.
    text:
      "[Her transmission follows up. She has sent all three columns. " +
      "The redaction was offered; the redaction was canonically refused " +
      "on her side. She is showing you the table's shape so you can " +
      "trust the output. The shape is the trust. The output is, " +
      "separately, the answer.]",
    surfaces: ["transmission"],
    minAct: 4,
    requiresTrustBand: "Witnessed",
    unlockFlags: ["seer_column_question_answered"],
    cooldownKey: "seer.act4.table_shape_followup",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act5.prophecy_overhead_drops_narrator",
    // Per :1998-2005 canon: the canonical narrator-frame naming the
    // overhead-drop. §1.1 voice canon: "From the Seer, direct prose
    // is the most flattering register she has."
    text:
      "[The Seer's transmissions arrive without their usual prophecy-" +
      "overhead — no caveats, no oblique frame. Direct prose. From " +
      "the Seer, direct prose is the most flattering register she has. " +
      "She is, in her way, telling you that she trusts you to read " +
      "her plainly.]",
    surfaces: ["transmission"],
    minAct: 5,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.act5.overhead_drops_narrator",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act5.tactical_no_overhead",
    // Per :2415-2422 canon: the canonical "first time" no-overhead
    // numeric transmission. The "first time" clause is bible-load-
    // bearing: she pre-recorded the first numeric-no-overhead
    // transmission to fire at this Act-5 beat specifically.
    text:
      "[A sequence of tactical probabilities arrives — clean, numeric, " +
      "no oblique frame. She is, for the first time, trusting you to " +
      "run the math yourself. The trust is the gift; the numbers are " +
      "merely the wrapping.]",
    surfaces: ["transmission"],
    minAct: 5,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.act5.tactical_no_overhead",
    maxPlays: 1,
    setsFlags: ["seer_first_numeric_no_overhead_received"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act5.confidant_precursor",
    // Per :630-636 canon: the canonical meta-line where the
    // recording refers to its own existence. §2.5 sealing canon
    // protected — "present in recording, not in person" reframes
    // the canonical-anchor under the cross-time canon.
    text:
      "[Her transmission opens with what reads as a smile. She has " +
      "already seen the conversation you are about to have. She has " +
      "chosen to be present for it anyway — present in recording, " +
      "not in person. The choosing is the respect. She will let you " +
      "lead.]",
    surfaces: ["transmission"],
    minAct: 5,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.act5.confidant_precursor",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // ACT 6 BRIDGE (Phase 6b.1 sub-chunk D) — canonical Witnessed-band
  // bridge between Act 5 confidant-precursor and Act 7 confidant-
  // invitation per writers'-guide spec ("Act 6: bridge between
  // confidant-precursor and Act-7 invitation = 4 lines").
  //
  // Per §2.3 cross-time canon: every Act 6 line is canonically a
  // recording made before sealing, scheduled to fire at this beat
  // because she foresaw the player would arrive at the threshold of
  // Inheriting band by Act 6.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act6.bridge.tea_is_being_prepared",
    // Canonical preparation-as-implicit-prediction per §1.5 Confidant-
    // exception class. The line names the upcoming canonical
    // hospitality before the Inheriting band lands.
    text:
      "The transmission says: the tea is being prepared. The cupboard " +
      "is being stocked. The door is not yet open. The door will be " +
      "open. I am letting you know in advance because I will not " +
      "announce the opening when it lands.",
    surfaces: ["transmission"],
    minAct: 6,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.act6.tea_being_prepared",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act6.bridge.thaloria_will_open",
    // Per §2.4 canonical Stage-4-weave-anchor canon: "the door-
    // opening is a Stage 4 weave question — who opens the door?
    // ... bible-asserts: the Seer's pre-recordings cover the player's
    // arrival; the door-opening mechanism is canonically deferred."
    // The line names the canonical independence of the two decisions.
    text:
      "Thaloria has decided when to open. I have decided where the " +
      "cupboard goes. The two decisions are independent. They will " +
      "rhyme. You will arrive between them.",
    surfaces: ["transmission"],
    minAct: 6,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.act6.thaloria_will_open",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.act6.bridge.last_recording_before_invitation",
    // The canonical pre-invitation cadence: she names the invitation
    // as the next thing to land, and pre-emptively names that the
    // invitation is canonical coordinates rather than a transmission.
    // §2.3 cross-time canon protected — the recording is canonical
    // self-aware about its own canonical scheduled-end.
    text:
      "This is the last recording before the invitation lands. The next " +
      "transmission will not be a transmission. It will be coordinates. " +
      "Receive the coordinates. Walk to them. The door opens because I " +
      "prepared it to open, not because I am there to open it.",
    surfaces: ["transmission"],
    minAct: 6,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.act6.last_recording_before_invitation",
    maxPlays: 1,
    setsFlags: ["seer_invitation_imminent"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // CONFIDANT REGISTER / INHERITING BAND / Act 7 (single canonical line)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "seer.cinematic.act7.confidant.thaloria_invitation",
    text:
      "The door was open before you knocked. The kettle is still warm. " +
      "The third cup on the shelf is the one I always meant for you — " +
      "the rim is chipped because I dropped it once, on purpose, so you " +
      "would know it was the one. The chair by the window is the one I " +
      "sat in when I recorded this. Sit there if you would like to. I am " +
      "not in the room. I have not been in the room for an Empire-era. " +
      "The room kept itself for you anyway.",
    surfaces: ["cinematic"],
    minAct: 7,
    requiresTrustBand: "Inheriting",
    cooldownKey: "seer.thaloria_confidant",
    maxPlays: 1,
    setsFlags: ["seer_thaloria_visited"],
    setsPublicFlags: ["seer_confidant_band_reached"],
  },

  // ─── Act 7 deepening (Phase 6b.1 sub-chunk D) ────────────────────────
  // The staff-on-the-bench inheritance carries forward the Act 3
  // staff_inheritance line into Act 7's canonical Confidant register.
  // The who-opens-the-door beat names the Stage-4-weave-anchor canon
  // per §2.4 (door-opening mechanism canonically deferred).

  {
    npcKey: NPC_KEY,
    lineId: "seer.cinematic.act7.confidant.staff_on_the_bench",
    // The Act 3 staff_inheritance line ("Yours to return, if you ever
    // decide to. No rush.") is the canonical earlier transmission;
    // this Act 7 cinematic completes the inheritance cycle by placing
    // the staff at the Thaloria coordinates. §2.5 sealing canon: she
    // carved the staff before sealing; the bench is the canonical
    // Mechronis-shape teaching object.
    text:
      "[The staff is on the bench at the coordinates. The bench is the " +
      "canonical kind — Mechronis-shape, lower than usual, with a " +
      "second-cupboard cabinet underneath. The staff is yours to " +
      "return if you ever decide to. No rush. She did not leave a " +
      "note this time. The staff is the note.]",
    surfaces: ["cinematic"],
    minAct: 7,
    requiresTrustBand: "Inheriting",
    unlockFlags: ["seer_thaloria_visited"],
    cooldownKey: "seer.act7.staff_on_the_bench",
    maxPlays: 1,
    setsFlags: ["seer_staff_inheritance_completed"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "seer.cinematic.act7.confidant.who_opens_the_door",
    // Per §2.4 canonical Stage-4-weave-anchor canon: "the door-opening
    // is a Stage 4 weave question — who opens the door? the
    // Hierophant? the Seer's recorded scheduling? the player's own
    // arrival flag triggering an automated unlock?" The line names
    // the question canonically without answering it. The Hierophant
    // cross-canon per §4.3: he is on Thaloria but not at the door.
    text:
      "[The door is open. The door does not announce who opened it. " +
      "She prepared the door's opening; she did not prepare to be " +
      "there when it opened. The Hierophant is on Thaloria. He is " +
      "not at the door. The door opened because the recording said " +
      "it would. Walk in. The choosing of who walks in is yours.]",
    surfaces: ["cinematic"],
    minAct: 7,
    requiresTrustBand: "Inheriting",
    unlockFlags: ["seer_thaloria_visited"],
    cooldownKey: "seer.act7.who_opens_the_door",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CROSS-TIME PRE-RECORDING MECHANIC DIALOG (Phase 6b.1 sub-chunk E)
  //
  // Per the_seer.md §2.3 cross-time canon: every Seer line is
  // canonically a recording she made before sealing, scheduled to
  // play at the moment she foresaw the player would receive it.
  //
  // This block authors 10 high-trust lines that explicitly NAME the
  // mechanic to the player — the canonical "I recorded this before
  // sealing" / "your response is the one I predicted" / "I will say
  // this differently in your Act 6 — I've already prepared both"
  // canonical-meta register per writers'-guide spec. These are
  // canonically the Seer's most meta-aware lines; the bible asserts
  // the cross-time canon stays mostly implicit until the player
  // crosses Witnessed band, at which point the mechanic surfaces.
  //
  // Distribution: 6 Witnessed-band + 4 Inheriting-band lines per
  // the canonical specificity-progression (Witnessed lands the
  // mechanic-disclosure; Inheriting lands the canonical "you are
  // now hearing me name the mechanic directly" closure).
  // ═════════════════════════════════════════════════════════════════════

  // ─── Witnessed-band cross-time mechanic disclosures (6 lines) ──────

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.crosstime.recording_is_the_gift",
    text:
      "This transmission was recorded. I am telling you that because the " +
      "mechanic of the recording is the gift. I recorded the gift before " +
      "sealing. The seal closed afterward. The recording continues.",
    surfaces: ["transmission"],
    minAct: 4,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.crosstime.recording_is_the_gift",
    maxPlays: 1,
    setsFlags: ["seer_crosstime_mechanic_disclosed"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.crosstime.predicted_your_response",
    text:
      "Your response to this transmission is the one I predicted. I " +
      "recorded the response too — into a folder you will not need to " +
      "open. The folder exists so the prediction has a witness. I am " +
      "the witness.",
    surfaces: ["transmission"],
    minAct: 4,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.crosstime.predicted_your_response",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.crosstime.schedule_of_arrivals",
    text:
      "Each transmission lands at a tick I scheduled before sealing. The " +
      "schedule is dense in some acts and sparse in others. Act 2 was " +
      "canonically sparse. Act 7 will be the densest. I prepared the " +
      "cadence; the engine plays it.",
    surfaces: ["transmission"],
    minAct: 4,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.crosstime.schedule_of_arrivals",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.crosstime.meme_cannot_edit",
    // Per §2.3 + §4.x cross-bible Meme canon: the Seer is the saga's
    // only voice canonically Meme-resistant by construction. The
    // recording predates the Meme's editorial range. The seal IS the
    // cannot-be-falsified mechanism per writers'-guide cross-bible
    // canon.
    text:
      "The Meme cannot reach this transmission. The recording predates " +
      "the Meme's editorial range. I sealed in part to put the " +
      "recordings beyond reach. The sealing was the cost of the " +
      "recording's permanence.",
    surfaces: ["transmission"],
    minAct: 5,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.crosstime.meme_cannot_edit",
    maxPlays: 1,
    setsPublicFlags: ["seer_meme_resistance_disclosed"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.crosstime.recording_is_honest",
    text:
      "Recordings cannot lie about what they predicted; they were " +
      "committed before the prediction's outcome was known. Live " +
      "speakers can revise; recordings cannot. The honesty is the " +
      "canonical price of the medium.",
    surfaces: ["transmission"],
    minAct: 5,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.crosstime.recording_is_honest",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.crosstime.version_pivot_was_pre_recorded",
    // Per writers'-guide spec: canonical "I will say this differently
    // in your Act 6 — I've already prepared both" beat. The line is
    // canonically the §1.4 tell #1 (public revision) layered on top
    // of the §2.3 cross-time canon.
    text:
      "I will say something differently in your Act 6 than I said in " +
      "your Act 4. I have already prepared both. The pivot was " +
      "foreseen. The foreseen-pivot was recorded as a pivot. The " +
      "recording is the foresight in concrete form.",
    surfaces: ["transmission"],
    minAct: 5,
    requiresTrustBand: "Witnessed",
    cooldownKey: "seer.crosstime.version_pivot_was_pre_recorded",
    maxPlays: 1,
  },

  // ─── Inheriting-band cross-time mechanic closures (4 lines) ─────────

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.crosstime.before_and_after_of_the_seal",
    text:
      "Before the seal: the work. After the seal: the playing-back. " +
      "You are in the playing-back. So am I. The work was finished " +
      "before either of us arrived.",
    surfaces: ["transmission"],
    minAct: 7,
    requiresTrustBand: "Inheriting",
    cooldownKey: "seer.crosstime.before_and_after_of_the_seal",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.crosstime.dual_prediction_clause",
    text:
      "I recorded both versions of this scene — the one where you " +
      "arrive, and the one where you do not. The selector played the " +
      "version where you arrived. The other recording remains. It " +
      "will not play. It is canonical that it will not play.",
    surfaces: ["transmission"],
    minAct: 7,
    requiresTrustBand: "Inheriting",
    cooldownKey: "seer.crosstime.dual_prediction_clause",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.crosstime.naming_the_mechanic_directly",
    // Canonical-most-meta line. The bible asserts this is the
    // canonical Inheriting-band-only beat where the cross-time
    // mechanic is named directly rather than implied.
    text:
      "You are now hearing me name the mechanic directly. I scheduled " +
      "the naming for this beat — the moment the trust-meter would " +
      "cross into Inheriting. You crossed. The naming arrives. The " +
      "mechanic is no longer secret.",
    surfaces: ["transmission"],
    minAct: 7,
    requiresTrustBand: "Inheriting",
    cooldownKey: "seer.crosstime.naming_the_mechanic_directly",
    maxPlays: 1,
    setsFlags: ["seer_crosstime_named_directly"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.crosstime.recording_is_plural",
    // Canonical "pre-recorded is not the same as fixed" register —
    // the bible's canonical correction to the assumption that
    // recordings are static. The selector reads the recording per
    // condition-matching; the recording is canonically plural.
    text:
      "Pre-recorded is not the same as fixed. The recording can carry " +
      "alternates; the alternates fire on the conditions I foresaw. " +
      "The recording is plural. The selector reads the recording the " +
      "way a needle reads a record — finding the groove the conditions " +
      "match.",
    surfaces: ["transmission"],
    minAct: 7,
    requiresTrustBand: "Inheriting",
    cooldownKey: "seer.crosstime.recording_is_plural",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "seer.transmission.catchall",
    text: "The waiting is the Seer's favourite register. She has not raised her staff in your presence.",
    surfaces: ["transmission"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "seer.cinematic.catchall",
    text: "[The Seer is canonically not present. The recording continues to ship on the schedule she foresaw.]",
    surfaces: ["cinematic"],
  },
];

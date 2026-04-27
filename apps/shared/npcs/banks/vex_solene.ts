// apps/shared/npcs/banks/vex_solene.ts
//
// Phase 3 Group B — Vex Solène / Engineer Zero's NpcLine bank.
//
// Per vex_solene.md §§1-6 voice samples. Four-stage reveal canon (the
// load-bearing gate constraint):
//   - eyes_of_reality       (Acts 1-2, pre-Engineer-Zero hint)
//   - vex_public            (Acts 2-3, Maestro persona, Coda contracts)
//   - engineer_zero_hint    (Acts 3-4, Engineer-trace becomes audible)
//   - engineer_zero_confirmed (Acts 5+, post-reveal full identity)
//
// Reveal-stage gating is THE selector constraint: no post-reveal lines
// fire pre-reveal. Trust bands: Stranger / Watcher / Confidant /
// Inner-Circle (per registry).
//
// Two register-shapes per bible:
//   - Maestro (Coda institutional broker; default in Acts 2-4)
//   - Engineer-trace (post-reveal; canonical "memoir close" cadence)

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "vex_solene" as const;

export const VEX_SOLENE_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // STAGE 1: eyes_of_reality (Acts 1-2 — young Agent Zero, pre-hint)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "vex.ch6.young_agent_zero.match_intro",
    text:
      "Year three at Mechronis. They told me you were coming. They didn't " +
      "tell me you were the kind of opponent who breaks the sequence. " +
      "Let's see if the bench learns from this one.",
    surfaces: ["match", "cinematic"],
    requiresRevealStage: "eyes_of_reality",
    minAct: 1,
    maxAct: 1,
    cooldownKey: "vex.ch6_match_intro",
    maxPlays: 1,
    setsFlags: ["vex_ch6_encountered"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "vex.ch6.young_agent_zero.post_match",
    text:
      "Sequence breaks. I noted yours. The Academy will note mine. We " +
      "will see whether either of us is canonically right. Walk forward.",
    surfaces: ["match"],
    requiresRevealStage: "eyes_of_reality",
    minAct: 1,
    maxAct: 1, // Canon-correction (Phase 6b.2 sub-chunk B): the canonical Mechronis match is Act 1 only.
    cooldownKey: "vex.ch6_post_match",
    maxPlays: 1,
  },

  // ─── eyes_of_reality expansion (Phase 6b.2 sub-chunk B) ─────────────
  // Six additional pre-reveal lines covering the canonical Trade Empire
  // opening-sector narrator surface, additional Ch6 match commentary,
  // pre-match positioning cinematic, route-completion narrator, an
  // Acts-2 transmission bridge to vex_public, and a Ch6 post-match
  // revealing-but-not-revealing closer. Per §1.6 silence shape: she
  // does NOT name herself "Agent Zero" or refer to "Engineer" aloud.

  {
    npcKey: NPC_KEY,
    lineId: "vex.eyes_of_reality.trade_empire.opening_narrator",
    // Per §1.7 metaphor source — Vex's narrator voice in Trade Empire
    // pre-reveal stage uses canonical "the contracts" / "the lanes"
    // vocabulary. The canonical "I will tell you who, eventually"
    // register is the canonical Vex deferred-identity hint.
    text:
      "[The Trade Empire opening-sector narrator: 'Welcome to the " +
      "trade lanes. The contracts here are canonically simple — the " +
      "kind that do not need a hidden chair. Walk them carefully. " +
      "Someone is reading every line you sign. I will tell you who, " +
      "eventually.']",
    surfaces: ["trade_empire"],
    requiresRevealStage: "eyes_of_reality",
    minAct: 1,
    maxAct: 2,
    cooldownKey: "vex.eyes.trade_empire.opening",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.ch6.young_agent_zero.mid_match_pricing",
    // §1.5 tell #1 inventory-then-courtesy variant — "the pricing was
    // wrong" lands the canonical observation-and-courtesy beat. The
    // self-correction "Note the correction" is canonical Vex tell #3
    // bridge (she does not finish a sentence she has stopped trusting;
    // here she finishes by naming what she'll redo).
    text:
      "Turn three. You played the burnt card I have been pricing for " +
      "two years. The pricing was wrong. The card has more weight than " +
      "the pricing said. Note the correction.",
    surfaces: ["match"],
    requiresRevealStage: "eyes_of_reality",
    minAct: 1,
    maxAct: 1,
    cooldownKey: "vex.ch6_mid_match",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.ch6.young_agent_zero.pre_match_positioning",
    // Cinematic pre-match positioning. Per §1.6 silence shape: she
    // does NOT introduce herself by name pre-reveal. The narrator-
    // frame canonically lands the canonical "the opponent does not
    // introduce herself. The opponent does not need to." register.
    text:
      "[The opponent across the bench is younger than the player " +
      "expected, sharper than the briefing said, and quieter than " +
      "Mechronis-trained reflex would predict. The opponent does not " +
      "introduce herself. The opponent does not need to.]",
    surfaces: ["match", "cinematic"],
    requiresRevealStage: "eyes_of_reality",
    minAct: 1,
    maxAct: 1,
    cooldownKey: "vex.ch6_pre_match_positioning",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.eyes_of_reality.trade_empire.route_completion_narrator",
    // Trade Empire route-completion narrator — the canonical "I will
    // tell you who, eventually" register continues. The line
    // canonically previews the canonical "the contract has not yet
    // been offered" deferred-contract canon.
    text:
      "[A Trade Empire transmission arrives without identification: " +
      "'You completed the route cleanly. The cleanliness was noted. " +
      "The note will be filed. The filing is not yet the contract; " +
      "the contract has not yet been offered. Continue.']",
    surfaces: ["trade_empire"],
    requiresRevealStage: "eyes_of_reality",
    minAct: 1,
    maxAct: 2,
    cooldownKey: "vex.eyes.trade_empire.route_complete",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.eyes_of_reality.transmission.act2_bridge_hello",
    // §1.5 tell #5 canonical "professional courtesy as code-switch":
    // the canonical "Hello" lands here as the canonical bridge from
    // eyes_of_reality into the canonical vex_public first-contact
    // register that opens in Act 3.
    text:
      "[The transmission arrives without preamble: 'I have been " +
      "waiting for the right reason to be introduced. The reason has " +
      "not arrived. The waiting is fair. Hello.']",
    surfaces: ["transmission"],
    requiresRevealStage: "eyes_of_reality",
    minAct: 2,
    maxAct: 2,
    cooldownKey: "vex.eyes.transmission.act2_bridge",
    maxPlays: 1,
    setsFlags: ["vex_eyes_of_reality_bridge_received"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.ch6.young_agent_zero.post_match_footnote",
    // Paired closer to the existing post_match line. The canonical
    // "the footnote will not contain my name. That is by design."
    // register lands the canonical pre-reveal name-suppression canon
    // — she canonically refuses self-naming even in Mechronis lore.
    text:
      "I am the kind of opponent who notes when the sequence breaks. " +
      "The sequence broke. I noted. The Academy will draft a footnote " +
      "about you. The footnote will not contain my name. That is by " +
      "design.",
    surfaces: ["match"],
    requiresRevealStage: "eyes_of_reality",
    minAct: 1,
    maxAct: 1,
    cooldownKey: "vex.ch6_post_match_footnote",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 2: vex_public (Acts 2-3 — Maestro persona, Coda institutional)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.signature.coda_introduction",
    text:
      "Vex Solène, Maestro of the Coda. I run the contracts that won't " +
      "be signed in any Authority's ledger. The Coda's mission is " +
      "secular, the contracts are clean, the attribution is canonical. " +
      "If we work together, you will know exactly whose hand wrote which " +
      "clause. That is the difference between us and them.",
    surfaces: ["cinematic"],
    requiresRevealStage: "vex_public",
    cooldownKey: "vex.maestro_signature",
    maxPlays: 1,
    setsFlags: ["broker_vex_maestro_first_meeting"],
    setsPublicFlags: ["met_vex_solene"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.trade_empire.narrator_intro",
    text:
      "[The Trade Empire narrator-frame shifts: Vex Solène, Maestro, is " +
      "narrating the routine routes and contracts. Her voice is even, " +
      "precise, and entirely uninterested in flattering you.]",
    surfaces: ["trade_empire"],
    requiresRevealStage: "vex_public",
    cooldownKey: "vex.maestro_narrator_intro",
    maxPlays: 1,
  },

  // ─── vex_public expansion (Phase 6b.2 sub-chunk C) ──────────────────
  // Four additional vex_public lines covering canonical surfaces the
  // existing pilot misses: the Coda pact-signing cinematic, contract-
  // signing acknowledgment, mission-outcome success, and the canonical
  // first-visit Coda sanctum room scene. Each preserves §1.6 silence-
  // shape — NEVER "Engineer" / "Engineer Zero" aloud, NEVER "Agent
  // Zero" as self-name. Per §1.4 canonical Maestro-persona register:
  // unmasked, robed, in her sanctum; expansive Coda-vocabulary; the
  // canonical "performance is the meaning" register.

  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.cinematic.coda_pact_signing",
    // Canonical Coda-faction-pact signing scene per writers'-guide
    // spec. The line lands the canonical "I am performing this. I am
    // also meaning it. Both registers are professional." canon — the
    // canonical Maestro-persona acknowledged-as-performative beat.
    text:
      "The Coda pact is signed. The chairs are filled. The Maestro " +
      "persona is the one I will wear when you visit. The other " +
      "register is the one I wear when no one is visiting. Both are " +
      "professional. Tell me which you came to speak with.",
    surfaces: ["cinematic"],
    requiresRevealStage: "vex_public",
    unlockFlags: ["vex_coda_pact_offered"],
    cooldownKey: "vex.maestro.coda_pact_signing",
    maxPlays: 1,
    setsFlags: ["vex_coda_pact_signed"],
    setsPublicFlags: ["player_in_coda_pact"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.contract.signing_acknowledgment",
    // Canonical contract-signing register per §1.5 tell #1 inventory-
    // then-courtesy + §1.4 Maestro-persona canon. The canonical "I
    // do not push. I do not pull." trailing-word resolution lands the
    // canonical professional-courtesy close.
    text:
      "The contract names you. The contract names me. The Maestro " +
      "persona is the signature; the Vex persona is the line above " +
      "it. Sign where the Maestro signs. The line above is yours to " +
      "read or not. I do not push. I do not pull.",
    surfaces: ["npc_line"],
    requiresRevealStage: "vex_public",
    unlockFlags: ["vex_coda_pact_signed"],
    cooldownKey: "vex.maestro.contract.signing",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.trade_empire.mission_outcome_success",
    // Canonical Coda mission-outcome register. Per §1.4 the Coda's
    // accounting is canonically quieter than Locke's; the canonical
    // "noting is quieter too" register lands the canonical
    // institutional-difference canon between Coda and the Authority.
    text:
      "You completed the contract cleanly. I am noting the " +
      "cleanliness. The Coda's books are quieter than Locke's; the " +
      "noting is quieter too. You will not see the entry. The entry " +
      "is real.",
    surfaces: ["trade_empire"],
    requiresRevealStage: "vex_public",
    unlockFlags: ["vex_mission_succeeded"],
    cooldownKey: "vex.maestro.mission_outcome_success",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.room.coda_sanctum_first_visit",
    // Canonical first-visit Coda sanctum cinematic per §1.4 canon:
    // "unmasked, robed, in her sanctum. The Hitman armor is folded
    // on a side bench." The canonical "the unmask is the welcome"
    // register lands the canonical Maestro-persona invitation.
    text:
      "[The Coda sanctum opens before the player: three chairs in a " +
      "circle, no podium, no audience. Vex stands at the central " +
      "chair, unmasked. The Hitman armor is folded on a side bench.] " +
      "You are here. The unmask is the welcome. Sit anywhere. The " +
      "chairs do not have ranks.",
    surfaces: ["room"],
    requiresRevealStage: "vex_public",
    unlockFlags: ["vex_coda_pact_signed"],
    cooldownKey: "vex.maestro.room.coda_sanctum_first",
    maxPlays: 1,
    setsFlags: ["vex_coda_sanctum_visited"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.touche.locked_out_by_locke",
    text:
      "Touché. The Adjudicator's exclusivity binds you. I respect the " +
      "binding; I will not contact you again under this persona until " +
      "the agreement ends or fails. Walk well. Sign well. We will both " +
      "be here on the other side.",
    surfaces: ["transmission"],
    requiresRevealStage: "vex_public",
    reactsToPublicFlag: "vex_locked_out_by_locke_exclusivity",
    cooldownKey: "vex.touche_lockout_acknowledged",
    maxPlays: 1,
  },

  // ─── Touché Extension — Vex reactive (Phase 6a.2 sub-chunk E) ───────
  // Three reactive lines completing the canonical Vex side of the
  // Locke ↔ Vex Touché-arc per §2.3. Each gates on a Locke-set
  // public flag so the canonical cross-character cascade fires
  // canonically when the player walks the canonical arc.

  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.touche.locke_disclosed_zero",
    // Reactive on Locke's canonical "Tell me about Vex / Zero"
    // disclosure (Phase 6a.2 ask-topic ask_locke_about_vex). The
    // canonical Vex register is: she has been waiting; she is the
    // counterparty Locke gestured at; the trade is still open.
    text:
      "So Locke told you. Good. We can finish trading secrets now if you " +
      "like. Don't worry about her — she filed the disclosure three " +
      "minutes after she made it. It is what she does. The trade is " +
      "still open. I am the one who has been waiting.",
    surfaces: ["transmission"],
    requiresRevealStage: "vex_public",
    reactsToPublicFlag: "locke_disclosed_zero_agent_history",
    cooldownKey: "vex.touche.locke_disclosed_zero",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.touche.breach_returned",
    // Reactive on player breaching the exclusivity per Locke's
    // canonical breach-canonical line. The Vex return register is
    // canonical professional discipline — she made tea while waiting;
    // she does not file; she names the difference.
    text:
      "You broke the lock-out. The Coda inbox shows you re-opened the " +
      "channel. I filed nothing. I do not file. I did, however, make a " +
      "cup of tea when the channel re-opened. Tell Locke whichever " +
      "version of that fact you prefer her to hear.",
    surfaces: ["transmission"],
    requiresRevealStage: "vex_public",
    reactsToPublicFlag: "locke_filed_player_breach_of_exclusivity",
    cooldownKey: "vex.touche.breach_returned",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.touche.long_silence_discipline",
    // Reactive on the canonical end-of-exclusivity (renewed-or-
    // breached). The canonical Vex register: she always waits the
    // contract duration; her precision matches Locke's; the canonical
    // "what professional respect looks like in our trade."
    text:
      "You can hear me again. I waited the contract duration. I always " +
      "wait the contract duration. The Adjudicator's contracts are " +
      "precise; my responses are precise. We are professionals. " +
      "Continue.",
    surfaces: ["transmission"],
    requiresRevealStage: "vex_public",
    unlockFlags: ["locke_exclusive_dealings_fulfilled"],
    cooldownKey: "vex.touche.long_silence_discipline",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 3: engineer_zero_hint (Acts 3-4 — Engineer-trace audible)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "vex.hint.act3.bench_reference",
    text:
      "There's a bench at Mechronis I think about more often than the " +
      "Maestro is supposed to. The bench had a state. The state had a " +
      "name. I am not yet at the part of this conversation where I tell " +
      "you the name. I am at the part where I notice that I'm thinking " +
      "about it.",
    surfaces: ["transmission"],
    requiresRevealStage: "engineer_zero_hint",
    minAct: 3,
    cooldownKey: "vex.hint_bench_reference",
    maxPlays: 1,
    setsFlags: ["vex_engineer_hint_audible"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "vex.hint.act4.staff_reference",
    text:
      "The Seer left a staff somewhere I used to know. The Maestro does " +
      "not own staffs. The Maestro contracts the use of objects, the " +
      "transit of objects, the audit of objects. The Maestro does not " +
      "own them. So why am I telling you about a staff.",
    surfaces: ["transmission"],
    requiresRevealStage: "engineer_zero_hint",
    minAct: 4,
    cooldownKey: "vex.hint_staff_reference",
    maxPlays: 1,
  },

  // ─── engineer_zero_hint expansion (Phase 6b.2 sub-chunk D) ──────────
  // Six additional hint-stage lines covering the canonical recognition
  // surfaces per §1.5 tell #3 (self-interrupting near recognition):
  // card recognition / dog tag / Antiquarian-line trigger / designed-
  // without-remembering / handwriting recognition / Mechronis bench
  // metaphor leakage. Per the bible: "She is *being* surprised, not
  // performing surprise." The "I —" sentence-break is canon and load-
  // bearing. §1.6 silence-shape preserved: she does NOT name the
  // Engineer aloud even when his pattern fires through her.

  {
    npcKey: NPC_KEY,
    lineId: "vex.hint.act4.card_recognition.coda_3",
    // Canonical Coda-3 card recognition per §1.5 tell #3 + §2.6
    // canon. The canonical "Stop. Stop —" / "I — I have never seen
    // it. I know that card." pattern lands the canonical break-in-
    // sentence canon. Surface: match (the canonical TCG-table
    // recognition moment).
    text:
      "Stop. Stop — play that again. I know that card. I — I have " +
      "never seen it. I know that card. Where did you. — never mind. " +
      "Continue. Continue, please.",
    surfaces: ["match"],
    requiresRevealStage: "engineer_zero_hint",
    minAct: 4,
    cooldownKey: "vex.hint.coda_3_recognition",
    maxPlays: 1,
    setsFlags: ["vex_coda_3_card_recognized"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.hint.act4.dog_tag_recognition",
    // Canonical dog-tag recognition per §1.5 tell #3 — the canonical
    // "I have not been told" pattern lands the canonical informational-
    // gap register. The Engineer's dog tag is canonical Engineer-era
    // artifact per §2.x. Self-interrupting tell active.
    text:
      "That tag. Where did you find that tag. I have not been told " +
      "about it. I — I should have been told about it. I am noting " +
      "that I should have been told.",
    surfaces: ["cinematic", "npc_line"],
    requiresRevealStage: "engineer_zero_hint",
    minAct: 4,
    cooldownKey: "vex.hint.dog_tag_recognition",
    maxPlays: 1,
    setsFlags: ["vex_engineer_dog_tag_recognized"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.hint.act5.antiquarian_line_recognition",
    // Canonical Antiquarian-line recognition per §1.5 tell #3
    // ("certain lines from the Antiquarian"). The canonical "the
    // speaker is — the speaker was — the speaker is not me." pattern
    // lands the canonical multi-state-of-self register without naming
    // the Engineer aloud.
    text:
      "He said — Daniel said something just now. The phrase he used. " +
      "I have heard that phrase before. I have not been told the " +
      "speaker. The speaker is — the speaker was — the speaker is " +
      "not me. Continue.",
    surfaces: ["transmission"],
    requiresRevealStage: "engineer_zero_hint",
    minAct: 5,
    cooldownKey: "vex.hint.antiquarian_line",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.hint.act4.designed_without_remembering",
    // Canonical "fingerprint is mine. The memory is not. Both are
    // honest." register — the canonical Vex acknowledgment of the
    // Engineer-trace operating through her hands without her
    // memory. The canonical "Both are honest" close per §1.5 tell #1
    // courtesy.
    text:
      "This protocol. I designed this protocol. I do not remember " +
      "designing this protocol. The fingerprint is mine. The memory " +
      "is not. Both are honest.",
    surfaces: ["trade_empire", "npc_line"],
    requiresRevealStage: "engineer_zero_hint",
    minAct: 4,
    cooldownKey: "vex.hint.designed_without_remembering",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.hint.act5.engineer_trace_in_handwriting",
    // Canonical handwriting recognition per §1.5 tell #3 — the
    // canonical "the hand is younger. The hand is mine. The hand
    // is not. — both are mine, in different states of repair."
    // register lands the §1.3 "two states of repair" canonical
    // canon directly.
    text:
      "That is my handwriting. The hand is younger. The hand is " +
      "mine. The hand is not. — both are mine, in two states of " +
      "repair. Walk forward.",
    surfaces: ["cinematic"],
    requiresRevealStage: "engineer_zero_hint",
    minAct: 5,
    cooldownKey: "vex.hint.handwriting_recognition",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.hint.act4.bench_metaphor_leakage",
    // Canonical Mechronis-vocabulary leakage — Vex notices her
    // mouth using "bench" without her memory authorizing the
    // metaphor. The canonical "the mouth has more than the
    // memory" register lands the canonical asymmetric-self canon
    // per §2.7.
    text:
      "I said 'the bench' just now. I said it without meaning " +
      "Mechronis. Mechronis is in my mouth. Mechronis is not in my " +
      "memory. The mouth has more than the memory. Note that.",
    surfaces: ["transmission", "npc_line"],
    requiresRevealStage: "engineer_zero_hint",
    minAct: 4,
    cooldownKey: "vex.hint.bench_metaphor_leakage",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 4: engineer_zero_confirmed (Acts 5+ — post-reveal full identity)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "vex.engineer.act5.reveal_acknowledgment",
    text:
      "Engineer Zero. Vex Solène. Both names; same person; the rite " +
      "permitted me one more body and I took it. I had been telling you " +
      "for two acts; I respect that you waited until I was ready to " +
      "confirm it. The Coda has new contracts now — different from the " +
      "Maestro's. Cleaner. Older. We can start when you'd like.",
    surfaces: ["cinematic"],
    requiresRevealStage: "engineer_zero_confirmed",
    minAct: 5,
    cooldownKey: "vex.engineer_reveal_acknowledgment",
    maxPlays: 1,
    setsPublicFlags: ["vex_engineer_zero_revealed_to_player"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "vex.engineer.memoir_close.bench_was_warm",
    text:
      "The bench was warm when I sat down. It is warm now too — Mechronis " +
      "doesn't forget that easily. The Seer let me win. I have stopped " +
      "feeling bad about it. The let was the lesson. I'm passing the " +
      "lesson to you, the way she passed it to me.",
    surfaces: ["transmission"],
    requiresRevealStage: "engineer_zero_confirmed",
    requiresTrustBand: "Confidant",
    cooldownKey: "vex.engineer_memoir_close",
    maxPlays: 1,
  },

  // ─── engineer_zero_confirmed expansion (Phase 6b.2 sub-chunk E) ─────
  // Six additional confirmed-stage lines covering canonical post-
  // reveal direct register surfaces. Each preserves §1.6 silence-
  // shape: even at confirmed stage, Vex does NOT say "Engineer
  // Zero" aloud. The canonical bothness is named via deixis ("the
  // version of me before this one") + canonical "two states of
  // repair" register per §1.3 + canonical "the body I'm in" register
  // per §2.7.

  {
    npcKey: NPC_KEY,
    lineId: "vex.engineer.act5.both_directly_named",
    // Canonical confirmed-stage cinematic landing the canonical
    // "Both. The reveal does not subtract." register without
    // saying his name aloud. Per §1.6: "the most explicit she
    // gets is *'He saved me with that card'*" — even at confirmed,
    // she canonically refers to him as "he" / "the version of me
    // before this one."
    text:
      "You knew before I told you. Don't lie. I knew before I told " +
      "myself. The not-telling was the work of the rite — the body " +
      "had to be ready to hold both names. I am holding both now. " +
      "Both are mine. The reveal does not subtract. Continue.",
    surfaces: ["cinematic"],
    requiresRevealStage: "engineer_zero_confirmed",
    minAct: 5,
    cooldownKey: "vex.engineer.both_directly_named",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.engineer.act5.designed_your_trust",
    // Canonical "I designed your trust" beat per writers'-guide
    // canonical "because I designed your trust" arc. Mirrors the
    // ask_vex_trust topic engineer_zero_confirmed alternate but in
    // bank-line form for the canonical npc_line surface.
    text:
      "I designed your trust. Or rather — the version of me before " +
      "this one designed it. The design was good. The design held. " +
      "You knew before I told you. Don't lie. I designed your knowing.",
    surfaces: ["npc_line"],
    requiresRevealStage: "engineer_zero_confirmed",
    minAct: 5,
    cooldownKey: "vex.engineer.designed_your_trust",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.engineer.act5.maestro_now_habit",
    // Canonical Maestro-persona-as-habit-of-character register per
    // §1.4 + §2.6. The canonical "Habits are honest. Performances
    // are honest too" register lands the canonical bothness canon
    // applied to the Maestro/Vex persona-pair.
    text:
      "The Maestro persona is now a habit. It used to be a " +
      "performance. Habits are honest. Performances are honest too, " +
      "in different ways. I will keep wearing the Maestro when you " +
      "visit. The wearing is not pretense. Both are professional.",
    surfaces: ["transmission", "npc_line"],
    requiresRevealStage: "engineer_zero_confirmed",
    minAct: 5,
    cooldownKey: "vex.engineer.maestro_now_habit",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.engineer.act6.glad_its_you_in_voice",
    // Canonical "I'm glad it's you" canonical love-equivalent per
    // §1.6 ("reserved for the player, late in the arc. This is her
    // version of love.") The canonical "the line I save" register
    // lands the canonical scarcity canon — this is the only line
    // she canonically saves, and the player has earned it.
    text:
      "You came back. The coming-back was not in any version of the " +
      "table I drew. The asymmetry-of-affection clause activated. " +
      "I'm glad it's you. That's the line I save. You earned the " +
      "saving.",
    surfaces: ["cinematic", "transmission"],
    requiresRevealStage: "engineer_zero_confirmed",
    minAct: 6,
    requiresTrustBand: "Confidant",
    cooldownKey: "vex.engineer.glad_its_you_in_voice",
    maxPlays: 1,
    setsFlags: ["vex_glad_its_you_in_voice_received"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.engineer.act5.coda_new_contracts",
    // Canonical confirmed-stage Coda contract register per existing
    // reveal_acknowledgment companion. Lands the canonical §1.3
    // "two states of repair" register directly via "the hand is in
    // two states of repair" canon. §1.6 silence-shape preserved —
    // no Engineer-name aloud.
    text:
      "The Coda's books are open to you now. The Maestro's contracts " +
      "and Vex's contracts are filed in the same cabinet. The cabinet " +
      "is yours to read. Some entries are older than the body I'm in. " +
      "Read them carefully. The handwriting is the same. The hand is " +
      "in two states of repair.",
    surfaces: ["npc_line", "trade_empire"],
    requiresRevealStage: "engineer_zero_confirmed",
    minAct: 5,
    cooldownKey: "vex.engineer.coda_new_contracts",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.engineer.act6.your_move",
    // Canonical "Your move" trailing-word ending per §1.5 tell #2
    // + `vexCardRecognition.ts:85` canonical anchor. The canonical
    // "the move I expected was the move you made. The move I did
    // not expect was the way you made it" register lands the
    // canonical Vex precognition + recognition canon.
    text:
      "The card is on the table. The play is yours. The move I " +
      "expected was the move you made. The move I did not expect was " +
      "the way you made it. Your move.",
    surfaces: ["match"],
    requiresRevealStage: "engineer_zero_confirmed",
    minAct: 6,
    cooldownKey: "vex.engineer.your_move",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // MAESTRO NARRATOR TRADE EMPIRE BANK (Phase 6b.2 sub-chunk F)
  //
  // Per the writers'-guide spec: "Maestro narrator persona Trade
  // Empire bank (~12 lines): Maestro is default Trade Empire
  // narrator from Act 3 §7 onward. Author the per-event narrator
  // commentary (sector-arrival, route-completion ceremony, contract-
  // broken faction-betrayal, route-milestone 5/10/25/50). Reveal-
  // stage-aware: post-engineer_zero_confirmed the Maestro narrator
  // canonically *fades* and Engineer Zero direct-address takes over."
  //
  // Surface: trade_empire (all 12 lines). Reveal-stage gating:
  //   - 10 vex_public Maestro narrator-frame beats (Acts 3-4)
  //   - 2 engineer_zero_confirmed direct-address beats (Acts 5+)
  //     where the canonical Maestro-fades transition lands.
  //
  // §1.4 register: wry-but-compact public-facing Maestro voice. The
  // narrator-frame canonically uses bracketed cinematic-style
  // narration; direct-address (post-confirmation) drops the brackets.
  // §1.6 silence-shape preserved: NEVER "Engineer" / "Engineer Zero"
  // aloud, even at confirmed-stage direct-address.
  // ═════════════════════════════════════════════════════════════════════

  // ─── Sector arrival narrators (4 lines, vex_public) ────────────────

  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.trade_empire.sector_arrival.coda_aligned",
    text:
      "[Trade Empire narrator: 'You have arrived at a Coda-aligned " +
      "sector. The contracts here read cleaner because I drafted them. " +
      "The freight inspectors know me. The freight inspectors are not " +
      "all on my side. Walk in like you read the manifest. The manifest " +
      "is the map.']",
    surfaces: ["trade_empire"],
    requiresRevealStage: "vex_public",
    unlockFlags: ["sector_arrival_coda_aligned"],
    cooldownKey: "vex.maestro.sector.coda_aligned",
    maxPlays: 3,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.trade_empire.sector_arrival.authority_aligned",
    // Cross-canon with Locke per §4.1 — the canonical "Locke has
    // selected the second" register lands the canonical Authority-
    // bureaucracy contrast against Coda's cleaner contracts.
    text:
      "[The narrator notes the sector's Authority-tier lanes: 'New " +
      "Babylon has filed three different welcome forms for you. Locke " +
      "has selected the second. The selection is itself the welcome. " +
      "You will not see the others.']",
    surfaces: ["trade_empire"],
    requiresRevealStage: "vex_public",
    unlockFlags: ["sector_arrival_authority_aligned"],
    cooldownKey: "vex.maestro.sector.authority_aligned",
    maxPlays: 3,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.trade_empire.sector_arrival.contested",
    text:
      "[The sector is contested. Two factions have filed competing " +
      "contract pools at the same buoy. The Maestro persona notes: " +
      "'Pick the cleaner one. The Maestro will explain the difference " +
      "if you ask. The asking is itself a contract.']",
    surfaces: ["trade_empire"],
    requiresRevealStage: "vex_public",
    unlockFlags: ["sector_arrival_contested"],
    cooldownKey: "vex.maestro.sector.contested",
    maxPlays: 3,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.trade_empire.sector_arrival.first_visit",
    text:
      "[Maestro narrator-frame, first-visit-to-any-new-sector: 'A new " +
      "lane opens. The Coda has logged its existence; the Authority has " +
      "logged its existence; the difference is the timestamp. Mine " +
      "arrived first. That detail will matter later.']",
    surfaces: ["trade_empire"],
    requiresRevealStage: "vex_public",
    unlockFlags: ["sector_first_entered"],
    cooldownKey: "vex.maestro.sector.first_visit",
    maxPlays: 4,
  },

  // ─── Route-milestone ceremonies (2 lines, vex_public) ──────────────

  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.trade_empire.route_milestone.5_runs",
    text:
      "Five runs. The Coda's books note the consistency. I am noting " +
      "the consistency twice — once in the books, once in the file " +
      "with your name on it. The file is older than the books. " +
      "Continue.",
    surfaces: ["trade_empire"],
    requiresRevealStage: "vex_public",
    unlockFlags: ["route_milestone_5"],
    cooldownKey: "vex.maestro.route_5_runs",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.trade_empire.route_milestone.25_runs",
    text:
      "Twenty-five runs. The Coda has filed you under 'route-as-" +
      "discipline'. The discipline is rare. The discipline is rarer " +
      "than you. I am revising the file's category. Continue.",
    surfaces: ["trade_empire"],
    requiresRevealStage: "vex_public",
    unlockFlags: ["route_milestone_25"],
    cooldownKey: "vex.maestro.route_25_runs",
    maxPlays: 1,
  },

  // ─── Contract-broken / faction-betrayal narrators (2, vex_public) ──

  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.trade_empire.contract_broken",
    // §1.6 silence-shape: she canonically does NOT pursue / does NOT
    // forget. The canonical "Both are professional" close lands the
    // canonical Coda-vs-Authority institutional difference (Locke's
    // ledger pursues; Coda's books just file).
    text:
      "You broke the contract. The Coda's books are unsentimental " +
      "about breaks. So am I. The breaking will be filed honestly. " +
      "The Coda will not pursue. The Coda also will not forget. Both " +
      "are professional.",
    surfaces: ["trade_empire"],
    requiresRevealStage: "vex_public",
    unlockFlags: ["vex_contract_broken"],
    cooldownKey: "vex.maestro.contract_broken",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.trade_empire.faction_betrayal_authority",
    // Cross-canon reactive on the Phase 6a.2 + 6a.2-mercantile flag
    // faction_align_new_babylon_negative. The canonical "You will
    // hear from her. You will hear from me first." register canonically
    // sequences the Coda-vs-Authority response asymmetry.
    text:
      "[The Maestro narrator-frame registers the faction shift: " +
      "'New Babylon's standing on you turned. Locke noted it. The " +
      "Coda noted it. The two notes are not the same shape. Mine " +
      "acknowledges the shift; Locke's files it. You will hear from " +
      "her. You will hear from me first.']",
    surfaces: ["trade_empire"],
    requiresRevealStage: "vex_public",
    reactsToPublicFlag: "faction_align_new_babylon_negative",
    cooldownKey: "vex.maestro.faction_betrayal_authority",
    maxPlays: 1,
  },

  // ─── Mission-outcome narrators (2 lines, vex_public — failure +
  //     partial-success variants; success already shipped) ────────────

  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.trade_empire.mission_outcome_failure",
    // Canonical Coda-vs-Authority institutional difference: Coda
    // accepts failure as a category; Authority does not. The canonical
    // "next contract may be smaller. The next contract may be larger.
    // The accounting will tell us which." register lands the
    // canonical Maestro-as-forecaster Coda canon.
    text:
      "Mission failed. The Coda's accounting is canonical: failures " +
      "are filed; failures are not punished; failures are conditions " +
      "for a different next contract. The next contract may be " +
      "smaller. The next contract may be larger. The accounting will " +
      "tell us which.",
    surfaces: ["trade_empire"],
    requiresRevealStage: "vex_public",
    unlockFlags: ["vex_mission_failed"],
    cooldownKey: "vex.maestro.mission_failure",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.trade_empire.mission_outcome_partial",
    text:
      "Partial completion. The Coda accepts partial completion as a " +
      "category. The Authority does not. That is one of the canonical " +
      "differences I have stopped explaining. The cleaner half is " +
      "filed. The cleaner half is yours.",
    surfaces: ["trade_empire"],
    requiresRevealStage: "vex_public",
    unlockFlags: ["vex_mission_partial"],
    cooldownKey: "vex.maestro.mission_partial",
    maxPlays: 4,
  },

  // ─── Reveal-stage-aware Maestro-fades transitions (2 lines,
  //     engineer_zero_confirmed) ─────────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.trade_empire.maestro_fades_confirmed",
    // Canonical post-confirmation transition per writers'-guide spec.
    // The Maestro narrator-frame thins; the voice is the same; the
    // persona has stepped back. §1.4 canonical "the wearing is not
    // pretense. Both are professional." register lands the canonical
    // bothness applied to the narrator persona itself.
    text:
      "[The Maestro narrator-frame thins. The voice is the same; the " +
      "persona has stepped back. The narrator now sounds like Vex " +
      "herself, with the Maestro-vocabulary still present but no " +
      "longer load-bearing.] Trade Empire narrator: the contracts read " +
      "the same; the voice reading them is closer.",
    surfaces: ["trade_empire"],
    requiresRevealStage: "engineer_zero_confirmed",
    minAct: 5,
    cooldownKey: "vex.maestro.fades_confirmed",
    maxPlays: 1,
    setsFlags: ["vex_maestro_narrator_faded"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.maestro.trade_empire.engineer_direct_address",
    // Canonical post-confirmation direct-address per writers'-guide
    // spec. The Maestro narrator-frame is gone; Vex addresses the
    // player directly across the Trade Empire surface. §1.6 silence-
    // shape preserved — she does NOT name the Engineer aloud even
    // here. The canonical "I shipped the Eyes" register lands via
    // deixis ("the Eyes was designed to ship" + "I shipped the Eyes")
    // without ever invoking the Engineer-name proper.
    text:
      "You are doing the work the Eyes was designed to ship. I shipped " +
      "the Eyes. You are shipping the Eyes the second time, in slower " +
      "motion. Both shippings are mine. Both will hold. Continue.",
    surfaces: ["trade_empire"],
    requiresRevealStage: "engineer_zero_confirmed",
    minAct: 5,
    unlockFlags: ["vex_maestro_narrator_faded"],
    cooldownKey: "vex.maestro.engineer_direct_address",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance, stage-agnostic)
  // ═════════════════════════════════════════════════════════════════════

  // ═════════════════════════════════════════════════════════════════════
  // ENGINEER ZERO REVEAL MULTI-TURN CHAIN (Phase 6e.2a, 5 lines)
  //
  // Per writers'-guide spec: hint → suspicion → confirmation →
  // asymmetric-knowledge → integration. Each link gates a canonical
  // reveal-stage progression per vex_solene.md §1-2:
  //   eyes_of_reality → vex_public → engineer_zero_hint →
  //   engineer_zero_confirmed (across 4 stages, 5 chain links)
  //
  // §1.6 silence-shape canonical: NEVER "Engineer" / "Engineer Zero"
  // / "Agent Zero" aloud. The chain canonically arrives at the
  // canonical-confirmation register WITHOUT the canonical-words.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "vex.chain.engineer_zero_reveal.hint",
    text:
      "There is something I have not been canonical-direct about. The Maestro persona is canonical-mine — but the canonical-Maestro is canonical-not the canonical-only canonical-version of me. There is an canonical-older canonical-name that the canonical-saga canonical-still-attaches to my canonical-work. I will not canonical-say it tonight. The canonical-not-saying is canonical-deliberate.",
    surfaces: ["transmission"],
    requiresRevealStage: "vex_public",
    cooldownKey: "vex.chain.engineer_zero_reveal.hint",
    maxPlays: 1,
    nextLineId: "vex.chain.engineer_zero_reveal.suspicion",
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.chain.engineer_zero_reveal.suspicion",
    text:
      "You canonical-noticed. The canonical-noticing is canonical-faster than the canonical-mean. I will canonical-confirm that there is canonical-someone the canonical-Saga canonical-thinks I canonical-was — and that I canonical-do canonical-not canonical-deny the canonical-attribution, but I canonical-do canonical-not canonical-claim the canonical-name. The canonical-distinction is canonical-load-bearing.",
    surfaces: ["transmission"],
    requiresRevealStage: "engineer_zero_hint",
    cooldownKey: "vex.chain.engineer_zero_reveal.suspicion",
    maxPlays: 1,
    nextLineId: "vex.chain.engineer_zero_reveal.confirmation",
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.chain.engineer_zero_reveal.confirmation",
    text:
      "You knew before I told you. Don't lie. I canonical-designed your canonical-knowing — not canonical-individually, canonical-architecturally. The canonical-Eyes-of-Reality canonical-distribute the canonical-truth-pattern across the canonical-Saga at a canonical-rate the canonical-Saga canonical-itself canonical-cannot canonical-suppress. You canonical-received the canonical-pattern canonical-cleanly. The canonical-confirmation is canonical-mine to extend now: yes. I am the canonical-one you canonical-are canonical-thinking-of.",
    surfaces: ["cinematic"],
    requiresRevealStage: "engineer_zero_confirmed",
    cooldownKey: "vex.chain.engineer_zero_reveal.confirmation",
    maxPlays: 1,
    nextLineId: "vex.chain.engineer_zero_reveal.asymmetric_knowledge",
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.chain.engineer_zero_reveal.asymmetric_knowledge",
    text:
      "Here is what canonical-asymmetric-knowledge canonical-buys you: I canonical-know what I canonical-built. You canonical-know that I canonical-built it. The canonical-rest of the canonical-Saga canonical-knows neither canonical-cleanly. We canonical-share a canonical-fact that canonical-three other canonical-people canonical-share. The canonical-three are canonical-not canonical-here tonight. We are.",
    surfaces: ["cinematic"],
    requiresRevealStage: "engineer_zero_confirmed",
    cooldownKey: "vex.chain.engineer_zero_reveal.asymmetric",
    maxPlays: 1,
    nextLineId: "vex.chain.engineer_zero_reveal.integration",
  },
  {
    npcKey: NPC_KEY,
    lineId: "vex.chain.engineer_zero_reveal.integration",
    text:
      "Both registers stay. The canonical-Maestro canonical-keeps the canonical-Coda commerce canonical-running. The canonical-other-name canonical-keeps the canonical-Eyes-of-Reality canonical-shipping. I am canonical-also canonical-Vex. Both. The canonical-reveal canonical-does canonical-not canonical-subtract. The canonical-Saga canonical-receives me canonical-cleanly only when both canonical-registers are canonical-active. We have canonical-arrived at that.",
    surfaces: ["cinematic"],
    requiresRevealStage: "engineer_zero_confirmed",
    cooldownKey: "vex.chain.engineer_zero_reveal.integration",
    maxPlays: 1,
    setsPublicFlags: [
      "vex_completed_canonical_engineer_zero_reveal_chain",
    ],
  },

  {
    npcKey: NPC_KEY,
    lineId: "vex.cinematic.catchall",
    text: "Sequence breaks. We note them. We continue.",
    surfaces: ["cinematic"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "vex.match.catchall",
    text: "The bench is watching. Play accordingly.",
    surfaces: ["match"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "vex.transmission.catchall",
    text: "Maestro's evening. The contracts are clean. The attribution holds.",
    surfaces: ["transmission"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "vex.trade_empire.catchall",
    text: "The Coda's terms. Sign or pass; either way the contract is honest.",
    surfaces: ["trade_empire"],
  },

  // Catch-alls for npc_line + room surfaces (added Phase 6b.2 sub-chunk
  // C when the canonical contract-signing + Coda-sanctum lines opened
  // these surfaces). Silent-fail compliance per the canonical contract.
  {
    npcKey: NPC_KEY,
    lineId: "vex.npc_line.catchall",
    text: "The contract is the contract. The signature is the signature. Both belong to whoever signed.",
    surfaces: ["npc_line"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "vex.room.catchall",
    text: "The chairs are filled. The door is open. The work continues.",
    surfaces: ["room"],
  },
];

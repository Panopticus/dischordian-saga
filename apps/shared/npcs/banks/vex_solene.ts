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
    cooldownKey: "vex.ch6_post_match",
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

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance, stage-agnostic)
  // ═════════════════════════════════════════════════════════════════════

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
];

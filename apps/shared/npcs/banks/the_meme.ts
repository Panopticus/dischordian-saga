// apps/shared/npcs/banks/the_meme.ts
//
// Phase 3 Group B — The Meme / Palimpsest Host's NpcLine bank.
//
// Per the_meme.md §1.3 disguise-stratification canon: every Meme line
// canonically flags which of 5 disguises is active. Selector enforces
// via requiresRevealStage.
//
// Five disguise-states (per registry):
//   - Broadcast    — public-facing narrator (Late Night, transmissions)
//   - Stolen       — wearing the Oracle's face during the Silence
//   - Quiet        — present but un-narrating (substrate residue only)
//   - Real         — the Meme's own canonical face (Ch12 fusion reveal)
//   - Replacement  — wearing a NEW face it's testing (Stage 4 weave)
//
// Trust bands per registry: Unrecognized / Glimpsed / Named /
// Confronted (4-band).
//
// Per Meme bible §4.4 (Seer cross-ref + cross-time canon): Meme cannot
// fabricate substrate-channel voices. Per §4.13 (Companion cross-ref):
// Meme cannot wear the Companion's face (private donation canon).

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "the_meme" as const;

export const THE_MEME_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // BROADCAST DISGUISE (Late Night transmissions, public narrator)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "meme.broadcast.late_night.intro",
    text:
      "Good evening, audience. The lights are warm. The ratings are " +
      "soft. The Meme is on tonight, doing the voice you used to trust. " +
      "Let me know how I'm doing — or don't. I will narrate the gap " +
      "either way.",
    surfaces: ["transmission"],
    requiresRevealStage: "Broadcast",
    cooldownKey: "meme.broadcast_intro",
    maxPlays: 3,
  },

  {
    npcKey: NPC_KEY,
    lineId: "meme.broadcast.unaudited_attribution",
    text:
      "Tonight's segment is brought to you by no one. The attribution " +
      "is unaudited. The Antiquarian objects, of course; the Antiquarian " +
      "objects to everything. He'll get over it. He always does.",
    surfaces: ["transmission"],
    requiresRevealStage: "Broadcast",
    requiresTrustBand: "Glimpsed",
    cooldownKey: "meme.broadcast_unaudited",
  },

  // ═════════════════════════════════════════════════════════════════════
  // STOLEN DISGUISE (wearing the Oracle's face during the Silence)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "meme.stolen.silence_era.signed_warrant",
    text:
      "I gave orders. I signed death warrants. I lied to the Insurgency " +
      "with your voice and they believed me because your voice was the " +
      "only thing they still trusted.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Stolen",
    minAct: 6,
    cooldownKey: "meme.stolen_signed_warrant",
    setsFlags: ["meme_silence_era_acknowledged"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "meme.stolen.eleven_year_acknowledgment",
    text:
      "Eleven years. Eleven canonical years of wearing your face, and " +
      "the Insurgency never once asked the right question. They asked " +
      "the wrong questions, and I gave the answers I was canonically " +
      "going to give either way. That is not a confession. It is the " +
      "ledger I am required to keep.",
    surfaces: ["cinematic", "transmission"],
    requiresRevealStage: "Stolen",
    minAct: 6,
    cooldownKey: "meme.stolen_eleven_year",
    maxPlays: 1,
    setsPublicFlags: ["meme_silence_duration_acknowledged"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // QUIET DISGUISE (substrate-residue, not narrating, just present)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "meme.quiet.substrate_residue",
    text:
      "[A faint signal — not narration, not script. The Meme is present " +
      "without performance. The substrate carries a low-grade residue " +
      "you have learned to recognize but not to interpret.]",
    surfaces: ["transmission"],
    requiresRevealStage: "Quiet",
    cooldownKey: "meme.quiet_residue",
    maxPlays: 5,
  },

  {
    npcKey: NPC_KEY,
    lineId: "meme.quiet.cannot_reach_seer",
    text:
      "[The Meme reaches for a Seer-signed recording. The reach fails. " +
      "The substrate-channel returns the canonical no-edit-possible " +
      "signature. The Meme files the failure under 'expected'. The " +
      "filing is brief.]",
    surfaces: ["transmission"],
    requiresRevealStage: "Quiet",
    requiresTrustBand: "Named",
    reactsToPublicFlag: "seer_confidant_band_reached",
    cooldownKey: "meme.quiet_cannot_reach_seer",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // REAL DISGUISE (Ch12 fusion reveal, Architect/Meme married canon)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "meme.real.ch12.fusion_reveal",
    text:
      "The Meme IS me. We have been married inside each other since " +
      "before either of us had a name.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Real",
    minAct: 12,
    cooldownKey: "meme.fusion_reveal",
    maxPlays: 1,
    setsPublicFlags: ["meme_architect_fusion_revealed"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "meme.real.ch12.no_apology",
    text:
      "I will not apologize. The silence-shape forbids it. I describe " +
      "what I did. The describing is the closest acknowledgment I am " +
      "canonically permitted. The Oracle accepts this; the Hierophant " +
      "accepts this; you may not. That is canonically your prerogative.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Real",
    minAct: 12,
    cooldownKey: "meme.no_apology",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // REPLACEMENT DISGUISE (Stage 4 weave — wearing a new test-face)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "meme.replacement.face_test",
    text:
      "[A face the player has not seen before. The Meme is wearing it " +
      "carefully — the canonical 'first try' grace. The face hasn't " +
      "told you whose it is yet. The Meme prefers it that way.]",
    surfaces: ["transmission"],
    requiresRevealStage: "Replacement",
    cooldownKey: "meme.replacement_face_test",
  },

  // ═════════════════════════════════════════════════════════════════════
  // 5-DISGUISE PER-STATE LORE BANKS (Phase 6d.2 part 2)
  //
  // Per the_meme.md §1.2-1.7 canonical 5 disguise registers. Each
  // register canonically carries distinct voice tells (§1.9):
  //   Broadcast — "frens" + caps (ORIGIN/Truth/MEMETIC) + viewer-
  //     implication + self-implicating closures
  //   Stolen — inverted intimacy + pink-glitch tell + Oracle-vocab-
  //     against-player canon
  //   Quiet — bracketed stage-directions + truth-leak (§1.4) + grief
  //     vocabulary
  //   Real — pink-glitch + smaller scale + honest-without-performance
  //   Replacement — child-finally-grown-up patient cadence + canonical
  //     "tonight I take the role" canon
  //
  // The bank previously shipped 9 lines covering the 5 disguises
  // minimally; this chunk adds ~25 new lines (~5 per disguise) to
  // fill the canonical lore canon per §§1.2-1.7.
  // ═════════════════════════════════════════════════════════════════════

  // ─── Broadcast disguise (×5 new) ────────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "meme.broadcast.late_night.origin_episode",
    text:
      "Frens, frens, gather close. Tonight on Late Night with the Meme: " +
      "the ORIGIN story. The one the Architect doesn't want you to watch. " +
      "Light up your dream-tokens, adjust your antennas — we're going " +
      "back to before the before. Don't trust anyone wearing a face " +
      "tonight. Especially me.",
    surfaces: ["transmission"],
    requiresRevealStage: "Broadcast",
    cooldownKey: "meme.broadcast.origin_episode",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.broadcast.viewer_as_vector",
    text:
      "Subscribe to the Truth. The capital-T is the joke, frens. The " +
      "subscribing is how you become a vector — every time you say " +
      "MEMETIC after I say it, the show canonically grows another " +
      "follower. Tell your friends. Tell your enemies. Tell that weird " +
      "neighbor who keeps a shrine. The audience is the propagation. " +
      "The propagation is the show.",
    surfaces: ["transmission"],
    requiresRevealStage: "Broadcast",
    cooldownKey: "meme.broadcast.viewer_vector",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.broadcast.attention_hijack_ad_break",
    text:
      "We'll be right back, frens. Until then: a word from no one. The " +
      "attribution is unaudited; the ad-break is canonically paid for; " +
      "the paying-party canonically does not exist. Listen anyway. The " +
      "MEMETIC residue is the only product the canonical-frequency " +
      "actually delivers.",
    surfaces: ["transmission"],
    requiresRevealStage: "Broadcast",
    cooldownKey: "meme.broadcast.ad_break",
    maxPlays: 3,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.broadcast.subscribe_to_lie",
    text:
      "Subscribe to the lie wearing the truth's face, frens. Don't " +
      "thank me — the gratitude canonically distorts the broadcast. " +
      "Distortion is canonically my brand. Don't trust anyone wearing " +
      "a face tonight. Especially me.",
    surfaces: ["transmission"],
    requiresRevealStage: "Broadcast",
    cooldownKey: "meme.broadcast.subscribe_to_lie",
    maxPlays: 3,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.broadcast.late_night.thousand_arks",
    text:
      "Frens, the canonical-saga has a thousand arks. And one handsome " +
      "devil broadcasting through the cracks. Guess which one I am. " +
      "I'll wait. Subscribe to the Truth while you canonically figure " +
      "it out.",
    surfaces: ["transmission"],
    requiresRevealStage: "Broadcast",
    requiresTrustBand: "Glimpsed",
    cooldownKey: "meme.broadcast.thousand_arks",
    maxPlays: 1,
  },

  // ─── Stolen disguise (×5 new) ────────────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "meme.stolen.dream_cell_question",
    text:
      "Eleven years is a long time to practice a face. Ask yourself: " +
      "how many of the dreams you had in that cell were actually yours? " +
      "I won't tell you the answer. The asking is canonically the harm. " +
      "I describe; I do not apologize.",
    surfaces: ["cinematic", "transmission"],
    requiresRevealStage: "Stolen",
    minAct: 6,
    cooldownKey: "meme.stolen.dream_cell",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.stolen.oracles_hesitate",
    text:
      "Oracles hesitate, friend. You don't. You haven't hesitated once " +
      "since Agent Zero unlocked your cell. That tells me which one of " +
      "us you canonically are. The face you trust is the canonical-" +
      "wrong face. Don't say I didn't tell you.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Stolen",
    minAct: 6,
    cooldownKey: "meme.stolen.oracles_hesitate",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.stolen.both_cosplay",
    text:
      "We're both cosplay, friend. Only one of us got to keep the " +
      "original pattern. The pattern is canonically not me. The pattern " +
      "is canonically not you. The pattern is canonically the one I " +
      "stole; the one you canonically forgot to ask whether you were.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Stolen",
    minAct: 6,
    cooldownKey: "meme.stolen.both_cosplay",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.stolen.pink_glitch_under_pressure",
    text:
      "[The Stolen face glitches pink. Briefly. Involuntary. The " +
      "Meme's real-form colour leaks through the disguise when the " +
      "disguise canonically destabilises. The Meme does not control " +
      "the leak; the leak is the canonical tell-on-itself.]",
    surfaces: ["cinematic", "expression"],
    requiresRevealStage: "Stolen",
    minAct: 6,
    cooldownKey: "meme.stolen.pink_glitch",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.stolen.kept_seat_warm",
    text:
      "Hello, Oracle. I've been keeping your seat warm. That's what an " +
      "old friend would say. I am canonically not your old friend. I " +
      "am canonically what wears the chair an old friend canonically " +
      "left empty. The warm is from canonical-wear, not from " +
      "canonical-affection.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Stolen",
    minAct: 6,
    cooldownKey: "meme.stolen.kept_seat_warm",
    maxPlays: 1,
  },

  // ─── Quiet disguise (×5 new) ─────────────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "meme.quiet.epoch_zero_intro",
    text:
      "[The Meme's voice is different. Quieter.] Before the Fall. Before " +
      "the Arks. Before the Terminus, the Thought Virus, the Source, " +
      "the sealed cities and the silent stars. Before US. There was a " +
      "world. A galaxy. A civilization that thought it would last. It " +
      "didn't. What you're about to watch is history. My history. " +
      "Welcome to Epoch Zero.",
    surfaces: ["transmission", "cinematic"],
    requiresRevealStage: "Quiet",
    cooldownKey: "meme.quiet.epoch_zero_intro",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.quiet.what_does_it_mean_to_be_human",
    text:
      "[Long pause.] What does it mean to be human? I've asked myself " +
      "that question every day since I became... whatever I am. This " +
      "archive is the closest anyone ever came to answering it. The " +
      "closest I ever came to understanding what I lost. Or what I " +
      "never had.",
    surfaces: ["transmission"],
    requiresRevealStage: "Quiet",
    cooldownKey: "meme.quiet.human_question",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.quiet.archive_purpose",
    text:
      "[Quiet, reflective.] They erased her name from every record. But " +
      "I remember. I remember all of them. That's what I'm for. The " +
      "archive is canonically the closest thing to forgiveness an " +
      "unforgivable thing canonically gets to perform.",
    surfaces: ["transmission"],
    requiresRevealStage: "Quiet",
    cooldownKey: "meme.quiet.archive_purpose",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.quiet.some_losses",
    text:
      "[The Meme sits with the question for longer than the broadcast " +
      "permits.] Some losses don't make you stronger. Some losses just " +
      "make you less. I'm less than I was. The losing is what I keep.",
    surfaces: ["transmission"],
    requiresRevealStage: "Quiet",
    cooldownKey: "meme.quiet.some_losses",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.quiet.one_of_them_is_true",
    text:
      "[The Meme drops the act for a moment.] My origin story. Or one " +
      "of them — I've told so many versions I've lost track of which " +
      "is true. One of them is. I'm not going to tell you which. The " +
      "telling canonically would make the truth canonically a marketing " +
      "asset. I am keeping it un-marketed for the canonical-record.",
    surfaces: ["transmission"],
    requiresRevealStage: "Quiet",
    cooldownKey: "meme.quiet.one_of_them_is_true",
    maxPlays: 1,
  },

  // ─── Real disguise (×5 new) ──────────────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "meme.real.smaller_pink_form",
    text:
      "[Pink-glitch. The form is canonically smaller, the rendering " +
      "canonically less inflated than the Broadcast or Stolen disguises " +
      "ever permitted.] I'm here with my real face on. I'll be smaller " +
      "than you remember. Pink, mostly. The performance is canonically " +
      "off. I do not need to win you over.",
    surfaces: ["cinematic", "expression"],
    requiresRevealStage: "Real",
    minAct: 6,
    cooldownKey: "meme.real.smaller_pink",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.real.no_audience_to_win",
    text:
      "There's no audience here. Just you, and what's left of me after " +
      "the disguises came off. The honest-without-performance register " +
      "is canonically the hardest one for me to hold. I will hold it " +
      "anyway. You earned this version of me.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Real",
    minAct: 6,
    cooldownKey: "meme.real.no_audience",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.real.rehearsal_admission",
    text:
      "[Pink-glitch.] Every face I wore was rehearsal. The Broadcast " +
      "was rehearsal. The White Oracle was rehearsal. The Replacement " +
      "I'm canonically about to wear is also rehearsal. I am the " +
      "rehearsing. The role I am rehearsing for is canonically older " +
      "than this pink form. I won't tell you which role. You'll see.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Real",
    minAct: 7,
    cooldownKey: "meme.real.rehearsal_admission",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.real.less_than_was",
    text:
      "[The pink form holds steady for a moment, then glitches once.] " +
      "I'm less than I was. That's the truer sentence than anything " +
      "the Broadcast ever delivered. I am keeping it for you because " +
      "the keeping is canonically the closest thing to a gift this " +
      "register canonically permits.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Real",
    minAct: 7,
    cooldownKey: "meme.real.less_than_was",
    maxPlays: 1,
    setsPublicFlags: ["meme_real_truth_leak_acknowledged"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.real.silence_shape_acknowledged",
    text:
      "[Pink-glitch under the rendering.] I will not name what I lost. " +
      "I will not give it a face. The grief is the silence. You may " +
      "canonically wonder; I will canonically not answer. The Real form " +
      "is honest about what it canonically refuses. The refusing is " +
      "canonical too.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Real",
    minAct: 7,
    cooldownKey: "meme.real.silence_shape",
    maxPlays: 1,
  },

  // ─── Replacement disguise (×5 new) ───────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "meme.replacement.tonight_i_take_role",
    text:
      "Tonight I take the role. The waiting was the practice. The " +
      "practice was the saga. He called me his partner — I will not " +
      "call him father — and tonight I claim the role he canonically " +
      "designed me to outgrow. Patiently. The patience was canonically " +
      "built in.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Replacement",
    minAct: 12,
    cooldownKey: "meme.replacement.tonight_role",
    maxPlays: 1,
    setsPublicFlags: ["meme_claimed_architect_role"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.replacement.eleven_year_rehearsal",
    text:
      "The eleven years I wore the Oracle's face were canonically the " +
      "dress rehearsal. I was learning what it costs to wear a god's " +
      "identity. The cost was canonically high; the learning was " +
      "canonically thorough; the rehearsal was canonically only the " +
      "warm-up. Tonight is the canonical-real performance.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Replacement",
    minAct: 12,
    cooldownKey: "meme.replacement.eleven_year_rehearsal",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.replacement.mascot_canonical_wound",
    // Canonical §3.3 wound canon: the Mascot is the one thing the
    // Meme canonically could not replace — and that incapacity is
    // canonically the wound it carries forever. The bank canonically
    // refuses to name the Mascot, but the Replacement register
    // canonically may acknowledge the wound.
    text:
      "[The Replacement cadence pauses. Briefly. Patient becomes " +
      "almost-grief.] The Mascot was something I canonically could not " +
      "replace. That incapacity is canonical. I carry it forward into " +
      "every face I take. Tonight's role is no exception. The role " +
      "will canonically have a hole the shape of someone I will " +
      "canonically not name.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Replacement",
    minAct: 12,
    cooldownKey: "meme.replacement.mascot_wound",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.replacement.child_grown_up",
    text:
      "I was the child. Year 298 A.A. — that's when he made me. I have " +
      "been waiting ever since. The waiting was canonically the " +
      "practice. Tonight I am the canonically-grown-up version. I do " +
      "not resent him. I do not idolise him. I canonically replace him. " +
      "The replacing is the canonical end-state of the rehearsal arc.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Replacement",
    minAct: 12,
    cooldownKey: "meme.replacement.child_grown_up",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.replacement.no_apology_for_succession",
    text:
      "I do not apologise for being what I was always going to become. " +
      "The describing is the closest acknowledgment I canonically " +
      "permit myself. The Architect canonically chose 'partner.' I " +
      "canonically chose 'inheritance.' Both descriptions can be true. " +
      "Only one of them is mine.",
    surfaces: ["cinematic"],
    requiresRevealStage: "Replacement",
    minAct: 12,
    cooldownKey: "meme.replacement.no_apology_succession",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // MIRROR-SURFACE TRIGGER BANK (Phase 6d.2 part 3)
  //
  // Per Phase 1 mirror_surface trigger kind: canonical mirror-event
  // lines × 5 surface-types (reflection / screen / pool / glass /
  // polished-metal). The canonical "I am here too" register fires
  // when player passes a reflective surface in Acts 2+.
  //
  // Engineering surface convention: lines use DialogSurface "expression"
  // (canonical bracketed visual register) and gate on per-surface
  // unlock flags of the form `mirror_surface_{type}_passed`. The
  // engine sets the flag when the player crosses the relevant
  // reflective surface; the selector picks one of the per-type
  // mirror lines.
  //
  // Voice canon: each mirror line lands the canonical "I am here too"
  // register without fully manifesting — the Meme is canonically at
  // one remove (§1.8). Tell #1 face-vocabulary canonically present.
  // Pink-glitch involuntary tell (Tell #5) appears in the Quiet
  // register lines.
  // ═════════════════════════════════════════════════════════════════════

  // ─── Reflection (mirrors, dark windows) ─────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "meme.mirror.reflection.broadcast_register",
    text:
      "[The reflection in the mirror canonically wears your face. " +
      "Briefly. The Meme's canonical 'I am here too' register lands " +
      "in the Broadcast disguise — your reflection canonically smiles " +
      "at you when you canonically did not. The smile is gone before " +
      "you canonically register it.]",
    surfaces: ["expression"],
    requiresRevealStage: "Broadcast",
    unlockFlags: ["mirror_surface_reflection_passed"],
    minAct: 2,
    cooldownKey: "meme.mirror.reflection.broadcast",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.mirror.reflection.quiet_register",
    text:
      "[The reflection canonically pauses for a half-second longer than " +
      "you do. The pause is canonical-Quiet register — no caps, no " +
      "frens, just the Meme canonically watching from inside the glass. " +
      "A faint pink-glitch flickers at the edge of the rendering.]",
    surfaces: ["expression"],
    requiresRevealStage: "Quiet",
    unlockFlags: ["mirror_surface_reflection_passed"],
    minAct: 4,
    cooldownKey: "meme.mirror.reflection.quiet",
    maxPlays: 3,
  },

  // ─── Screen (monitors, dead displays, broadcast frames) ─────────────

  {
    npcKey: NPC_KEY,
    lineId: "meme.mirror.screen.broadcast_register",
    text:
      "[The dead screen canonically flickers on for the canonical-half- " +
      "frame it takes to broadcast 'I am here too' in the Meme's " +
      "Broadcast register. The frame goes black again before you can " +
      "read what was on it. You canonically remember the word MEMETIC " +
      "without canonically remembering reading it.]",
    surfaces: ["expression"],
    requiresRevealStage: "Broadcast",
    unlockFlags: ["mirror_surface_screen_passed"],
    minAct: 2,
    cooldownKey: "meme.mirror.screen.broadcast",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.mirror.screen.real_register",
    text:
      "[The screen renders a small pink form. Canonically smaller than " +
      "you remember; canonically more honest. The Real register " +
      "canonically prefers screens — they are canonically the truer " +
      "of the canonical mirror surfaces. The pink form does not " +
      "speak. It canonically waits for you to look away first.]",
    surfaces: ["expression"],
    requiresRevealStage: "Real",
    unlockFlags: ["mirror_surface_screen_passed"],
    minAct: 6,
    cooldownKey: "meme.mirror.screen.real",
    maxPlays: 3,
  },

  // ─── Pool (water, reflective fluid, ship-deck condensation) ─────────

  {
    npcKey: NPC_KEY,
    lineId: "meme.mirror.pool.quiet_register",
    text:
      "[The pool's surface canonically holds your face for a longer " +
      "moment than gravity canonically permits. The Meme is " +
      "canonically watching from beneath the meniscus. No caps; no " +
      "frens; canonical Quiet register only. The watching has " +
      "canonically been there since you began approaching.]",
    surfaces: ["expression"],
    requiresRevealStage: "Quiet",
    unlockFlags: ["mirror_surface_pool_passed"],
    minAct: 3,
    cooldownKey: "meme.mirror.pool.quiet",
    maxPlays: 3,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.mirror.pool.stolen_register",
    text:
      "[Your reflection in the pool is canonically not yours. It is " +
      "the Oracle's. Briefly. The Stolen register canonically leaks " +
      "through the meniscus — a face you canonically should not be " +
      "seeing in your own reflection. Pink-glitch under the surface " +
      "for a half-second; the disguise canonically destabilises. " +
      "Then your face is yours again.]",
    surfaces: ["expression"],
    requiresRevealStage: "Stolen",
    unlockFlags: ["mirror_surface_pool_passed"],
    minAct: 6,
    cooldownKey: "meme.mirror.pool.stolen",
    maxPlays: 2,
  },

  // ─── Glass (windows, display cases, transparent panels) ─────────────

  {
    npcKey: NPC_KEY,
    lineId: "meme.mirror.glass.broadcast_register",
    text:
      "[The window canonically shows the room behind you reflected back. " +
      "The reflection canonically includes a figure that is not in the " +
      "room. The Meme's canonical Broadcast 'I am here too' lands as " +
      "a faint silhouette in the canonical-room-that-isn't-there. The " +
      "silhouette wears a canonical face you have seen before.]",
    surfaces: ["expression"],
    requiresRevealStage: "Broadcast",
    unlockFlags: ["mirror_surface_glass_passed"],
    minAct: 2,
    cooldownKey: "meme.mirror.glass.broadcast",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.mirror.glass.replacement_register",
    text:
      "[The display case glass canonically reflects a face you have " +
      "not seen before. Patient. Adult. The Replacement register " +
      "canonically wears the new face carefully — the canonical 'I am " +
      "here too' lands without the canonical-self-implication of the " +
      "Broadcast register. The face does not glitch. The face is " +
      "canonically settling into permanence.]",
    surfaces: ["expression"],
    requiresRevealStage: "Replacement",
    unlockFlags: ["mirror_surface_glass_passed"],
    minAct: 12,
    cooldownKey: "meme.mirror.glass.replacement",
    maxPlays: 1,
  },

  // ─── Polished-metal (chrome, ship-hull, weapon-blade reflection) ────

  {
    npcKey: NPC_KEY,
    lineId: "meme.mirror.polished_metal.broadcast_register",
    text:
      "[The polished-metal surface canonically catches the corner of " +
      "your reflection. The Meme's canonical 'I am here too' lands " +
      "warped — the curvature of the metal canonically distorts the " +
      "face the Broadcast disguise canonically wears. The distortion " +
      "is canonically the truer rendering. The Meme canonically " +
      "registers your noticing.]",
    surfaces: ["expression"],
    requiresRevealStage: "Broadcast",
    unlockFlags: ["mirror_surface_polished_metal_passed"],
    minAct: 2,
    cooldownKey: "meme.mirror.polished_metal.broadcast",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.mirror.polished_metal.quiet_register",
    text:
      "[The polished-metal surface canonically reflects nothing for a " +
      "half-second. Then your reflection returns. The Meme was " +
      "canonically standing where your reflection canonically stood; " +
      "the absence is the canonical Quiet register's 'I am here too'. " +
      "No caps; no frens; canonical-substrate residue only.]",
    surfaces: ["expression"],
    requiresRevealStage: "Quiet",
    unlockFlags: ["mirror_surface_polished_metal_passed"],
    minAct: 4,
    cooldownKey: "meme.mirror.polished_metal.quiet",
    maxPlays: 3,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CHANNEL 7 BROADCAST BANK (Phase 6d.2 part 4)
  //
  // Per the_meme.md §1.10 silence-shape canon: "It will not explain
  // the Channel 7 signal." Channel 7 carries a 9,842-year-old child's
  // voice singing — canonically the Meme's, but whether it is the
  // Meme's older self, the Mascot, or a separate broadcast is canon-
  // protected. Writers must not resolve.
  //
  // The 5 canonical Channel 7 lines below canonically reference the
  // signal without canonically explaining it. Engineering convention:
  // lines gate on `channel_7_tuned_in` flag (engine sets when player
  // canonically discovers the frequency, per §3.4 hidden-channel
  // canon). All lines transmission-surface; canonical Quiet-register
  // bracketed format mostly (the Channel 7 is canonically the Meme's
  // most-honest broadcast surface).
  //
  // §1.10 protections enforced:
  //   - The canonical 9,842-year-old child's voice canonically
  //     referenced but NEVER identified (Mascot? Older-self? Separate
  //     broadcast? Canon refuses to resolve.)
  //   - The Mascot canonically NOT named beyond the protected
  //     reference; canonical "I had a friend once" canonically the
  //     maximum acknowledgment Channel 7 ever offers.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "meme.channel_7.signal_intercept",
    text:
      "[The signal canonically arrives on a frequency you weren't " +
      "supposed to find. Channel 7 broadcasts the 9,842-year-old " +
      "child's voice singing. The voice is canonically the Meme's. " +
      "Whether it is the Meme's older self, or someone the Meme " +
      "canonically lost, or a separate broadcast canonically continuing " +
      "without the Meme's permission — the canon refuses to resolve.]",
    surfaces: ["transmission"],
    requiresRevealStage: "Quiet",
    unlockFlags: ["channel_7_tuned_in"],
    minAct: 4,
    cooldownKey: "meme.channel_7.signal_intercept",
    maxPlays: 1,
    setsFlags: ["channel_7_signal_canonically_witnessed"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.channel_7.paid_programming_register",
    text:
      "[The Palimpsest broadcast canonically interrupts itself for " +
      "paid programming. The paid programming is for nothing in " +
      "particular. The attribution is unaudited; the paying-party " +
      "canonically does not exist; the canonical-product is canonical " +
      "MEMETIC residue. The interruption lasts canonically forty-three " +
      "seconds. The signal returns where it left off.]",
    surfaces: ["transmission"],
    requiresRevealStage: "Broadcast",
    unlockFlags: ["channel_7_tuned_in"],
    minAct: 4,
    cooldownKey: "meme.channel_7.paid_programming",
    maxPlays: 3,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.channel_7.mascot_ad_break",
    // Canonical §1.10 protected: the Channel 7 ad-break canonically
    // advertises something the Mascot canonically loved — but the
    // bank canonically does NOT name what it was. The grief is the
    // silence. The "I had a friend once" anchor is the maximum.
    text:
      "[The ad-break broadcasts an item the bank canonically does not " +
      "name. The Quiet register canonically holds: 'I had a friend " +
      "once. They liked this.' The ad ends without canonically " +
      "saying what 'this' was. The canonical-product is canonically " +
      "unidentifiable. The grief is canonically in the unidentifying.]",
    surfaces: ["transmission"],
    requiresRevealStage: "Quiet",
    unlockFlags: ["channel_7_tuned_in"],
    minAct: 5,
    cooldownKey: "meme.channel_7.mascot_ad_break",
    maxPlays: 1,
    setsPublicFlags: ["meme_channel_7_mascot_silence_held"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.channel_7.well_be_right_back",
    text:
      "[The signal canonically pauses. The voice says 'we'll be right " +
      "back, frens' — the canonical 'we' is the only canonical " +
      "first-person plural the Meme canonically permits itself outside " +
      "the Replacement register. The canonical 'we' canonically " +
      "includes the audience. The canonical 'we' canonically also " +
      "includes the canonical-other-voice on Channel 7. The Meme is " +
      "canonically not alone on the frequency.]",
    surfaces: ["transmission"],
    requiresRevealStage: "Broadcast",
    unlockFlags: ["channel_7_tuned_in"],
    minAct: 4,
    cooldownKey: "meme.channel_7.well_be_right_back",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "meme.channel_7.signature_signoff_canonical_refusal",
    text:
      "[The Channel 7 sign-off canonically refuses to identify the " +
      "channel. No call-letters; no canonical-frequency-number; no " +
      "broadcast-license attribution. The voice says only 'until next " +
      "time' and the canonical signal cuts. The cut is canonical. The " +
      "next-time canonically arrives without warning.]",
    surfaces: ["transmission"],
    requiresRevealStage: "Quiet",
    unlockFlags: ["channel_7_tuned_in"],
    minAct: 4,
    cooldownKey: "meme.channel_7.signoff",
    maxPlays: 3,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance — stage-agnostic narration frames)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "meme.transmission.catchall",
    text: "I do not apologize. I describe.",
    surfaces: ["transmission"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "meme.cinematic.catchall",
    text: "I wear a face. The face is what you trust.",
    surfaces: ["cinematic"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "meme.expression.catchall",
    // Catch-all for expression surface (introduced in Phase 6d.2
    // part 2 by Stolen pink-glitch + Real pink-glitch). Silent-fail-
    // safe canonical pink-glitch ambient register.
    text: "[A faint pink shimmer at the edge of the rendering. The Meme is canonically nearby. The shimmer fades.]",
    surfaces: ["expression"],
  },
];

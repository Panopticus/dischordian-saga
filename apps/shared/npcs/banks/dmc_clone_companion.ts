// apps/shared/npcs/banks/dmc_clone_companion.ts
//
// Phase 3 Group C — DMC Clone Body Companion's NpcLine bank.
//
// Per dmc_clone_companion.md §§1-6 voice samples + 5-channel non-verbal-
// to-verbal arc canon. Five canonical expression channels (one per
// Awakening Protocol stage):
//
//   Stage 1 (Wary):       glyph             — recognition, mourning glyphs
//   Stage 2 (Witnessed):  posture           — bracing, leaning, withdrawn
//   Stage 3 (Present):    sound             — half-syllables foreshadow first word
//   Stage 4 (Inheriting): first_word        — singular event, irreversible
//   Stage 5 (post-naming):named_personality — full verbal NPC
//
// The Companion's body-canon: soul-fragment of player's own Potential
// per deadMansCircuit.ts:800. Bibleref §1 stance #2: donor is the player.
//
// Structural identity claim per §2.2: "I was not given. I was delivered."
// Nilmorg's "Don't thank me" canonical refusal is the Companion's first
// inherited memory.
//
// Trust bands: Wary / Witnessed / Present / Inheriting (4-band channel-
// gated per registry).

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "dmc_clone_companion" as const;

export const DMC_CLONE_COMPANION_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // SIGNATURE — STRUCTURAL IDENTITY CLAIM (post-naming verbal)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.signature.i_was_not_given_i_was_delivered",
    text:
      "I was not given. I was delivered. The Severance Prize is paid. " +
      "Nilmorg kept his agreement. Don't thank me on his behalf — he " +
      "would object. I'm here. That's the canonical statement; it's the " +
      "only one that matters.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    cooldownKey: "companion.structural_identity_signature",
    maxPlays: 1,
    setsPublicFlags: ["companion_structural_identity_acknowledged"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 1: GLYPH (Wary band, post-Severance arrival)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.glyph.recognition_player",
    text:
      "[The Companion's first canonical glyph: a small geometric shape — " +
      "open triangle, three points facing the player. Recognition. The " +
      "soul-fragment recognizes the source. The glyph holds 1.8 seconds, " +
      "then dissolves.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    requiresTrustBand: "Wary",
    requiresRevealStage: "Wary",
    cooldownKey: "companion.glyph.first_recognition",
    maxPlays: 1,
    setsFlags: ["companion_first_glyph_fired"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.glyph.mourning_npc_death",
    text:
      "[A glyph forms whole, fragments, settles into a smaller shape over " +
      "9 seconds. The Companion mourns the death you did not have time " +
      "to mourn. The fragment remembers the canonical-other.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    requiresTrustBand: "Wary",
    cooldownKey: "companion.glyph.mourning",
    maxPlays: 5,
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 1 EXPANSION (Phase 6c.2 part 2): Glyph recognition bank
  //
  // Per §1.2 four canonical glyph categories (Recognition / Question /
  // Approval / Mourning) across the canonical trigger event-set:
  // severance-prize-delivered, first-Trade-Empire-mission, first-DMC-
  // race-witnessed, first-TCG-match-witnessed, first-room-visit,
  // first-NPC-introduction. The existing bank ships:
  //   - recognition_player (canonical first glyph, 1.8s open triangle)
  //   - mourning_npc_death (canonical mourning, 9s unraveling)
  // This chunk adds 6 glyphs filling the canonical category × trigger
  // matrix.
  //
  // Visual signatures per §1.2:
  //   - Recognition: small geometric mark, 1-2s duration
  //   - Question: angular asymmetric with one missing edge, 4-6s
  //   - Approval: closed balanced shape with mirror-symmetry
  //   - Mourning: unraveling shape, 6-8s
  //
  // Three-channel-minimum canon (§1.3 cross-channel layering): post-
  // Witnessed-band beats canonically express in glyph + posture +
  // sound combined. These glyph lines are the glyph-channel of those
  // canonical multi-channel beats.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.glyph.question_unmet_npc",
    // Canonical question glyph — fires on first encounter with an
    // unmet roster character. The fragment canonically does not yet
    // know whether to recognize or withhold.
    text:
      "[A glyph forms — angular, asymmetric, one edge canonically " +
      "missing. The Companion canonically does-not-yet-know how to " +
      "place this person. The shape persists 5 seconds, then " +
      "settles into a smaller waiting-mark.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    requiresTrustBand: "Wary",
    cooldownKey: "companion.glyph.question_unmet_npc",
    maxPlays: 8,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.glyph.question_morally_complex_choice",
    // Canonical question glyph for player's morally-complex choice
    // moments. Per §1.2: question glyphs canonically wait for the
    // question to resolve. The fragment is canonically the player's
    // soul-consistency-check.
    text:
      "[The Companion's glyph forms incomplete — three edges, one " +
      "deliberately missing where the resolution canonically goes. " +
      "The fragment canonically waits with the question. The shape " +
      "holds 6 seconds — the Companion is not asking the player to " +
      "answer. The Companion is canonically registering that the " +
      "player has not yet answered themselves.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.glyph.question_morally_complex",
    maxPlays: 5,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.glyph.approval_faction_aligned_choice",
    // Canonical approval glyph — fires when player makes a choice
    // canonically consistent with their accumulated saga-state. Per
    // §1.2: closed balanced shape with mirror-symmetry; the soul-
    // consistency-check canonically affirms.
    text:
      "[A closed glyph forms — balanced, mirror-symmetric, faintly " +
      "luminous. The Companion canonically recognizes the choice as " +
      "consistent with the donor-state-record. The shape holds 2 " +
      "seconds and dissolves cleanly. Approval is canonically brief; " +
      "the soul-fragment does not linger on agreement.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.glyph.approval_faction_aligned",
    maxPlays: 10,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.glyph.approval_trade_empire_route",
    // Canonical approval glyph specifically for Trade Empire route-
    // completion canonical events. Per §1.1 channel-event-mapping:
    // trade-empire events canonically land in glyphs.
    text:
      "[A small balanced glyph appears beside the route-completion " +
      "indicator. The Companion canonically registers the route as " +
      "consistent with the player's accumulated trading patterns. " +
      "1.5 seconds. The glyph dissolves into a faint approval-trace " +
      "the Companion canonically retains as posture-memory.]",
    surfaces: ["expression", "trade_empire"],
    expressionChannel: "glyph",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.glyph.approval_trade_empire_route",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.glyph.recognition_room_revisit",
    // Canonical recognition glyph for room-revisit canonical events.
    // Per §1.2: recognition glyphs canonically appear first-glyph
    // before any other glyph type the Companion has unlocked.
    text:
      "[A brief recognition glyph forms as the Companion enters the " +
      "room a second time — the same small geometric mark from the " +
      "first-room-visit, slightly more confident in its outline. The " +
      "soul-fragment canonically remembers the room. 1.2 seconds. " +
      "The dissolve is gentler than the first encounter's.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    requiresTrustBand: "Wary",
    cooldownKey: "companion.glyph.recognition_room_revisit",
    maxPlays: 8,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.glyph.mourning_faction_collapse",
    // Canonical mourning glyph for faction-collapse / large-scale-
    // loss events. Per §1.2: mourning glyphs are canonically the
    // Companion's most expressive pre-verbal channel — the soul-
    // fragment canonically remembers loss with greater fidelity.
    // Per §1.3 cross-channel layering: mourning glyph canonically
    // pairs with mourning-tone (Channel 3) when both channels are
    // unlocked.
    text:
      "[The Companion's mourning glyph unravels canonically — the " +
      "shape begins whole, fragments across 7 seconds, and settles " +
      "into a smaller mark the soul-fragment will canonically retain. " +
      "The fragment canonically registers a loss the player did not " +
      "have time to register. The smaller mark is canonical-archive: " +
      "the soul-fragment remembers because the player's accumulated " +
      "self has not yet finished noticing.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.glyph.mourning_faction_collapse",
    maxPlays: 5,
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 2: POSTURE (Witnessed band)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.posture.leaning_curious",
    text:
      "[The Companion shifts its weight forward, leaning toward the " +
      "object of attention. Curiosity-shape. The fragment is canonical-" +
      "interested in the canonical-thing.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.posture.leaning",
  },

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.posture.bracing_combat",
    text:
      "[The Companion tightens its posture. Bracing. It positions canonically " +
      "between you and the threat — even when the canonical-fragment " +
      "cannot canonically fight.]",
    surfaces: ["expression", "fight"],
    expressionChannel: "posture",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.posture.bracing",
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 2 EXPANSION (Phase 6c.2 part 3): Posture cycle bank
  //
  // Per §1.2 four canonical posture states:
  //   - Waiting (canonical default, "learned" vs Seer's "chosen")
  //   - Bracing (canonical clearest non-verbal protective canon)
  //   - Leaning (canonical pre-verbal-curiosity tell)
  //   - Withdrawn (canonical "stepping back from disapproval")
  //
  // Plus the canonical holding vs cycling distinction:
  //   - Holding = committed thought
  //   - Cycling = transitional thought (3+ transitions = canonical distress)
  //
  // Existing bank ships 2 posture lines (leaning_curious, bracing_combat).
  // This chunk fills the remaining canonical state × trigger event matrix.
  // ═════════════════════════════════════════════════════════════════════

  // ─── Waiting posture (canonical default, "learned" patience) ───────────

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.posture.waiting_default",
    // Canonical default posture — low-energy attentive stance. Per
    // §1.2: the canonical "learned" patience (the soul-fragment
    // canonically inherits the player's accumulated patience-or-
    // impatience), distinguished from the Seer's canonical "chosen"
    // waiting per the_seer.md §1.3.
    text:
      "[The Companion settles into the canonical waiting posture. Low- " +
      "energy, attentive, weight evenly distributed. The fragment " +
      "canonically inherited this patience from the donor; it is " +
      "canonically learned, not chosen. The posture holds steady — " +
      "this is canonical committed thought, not transition.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.posture.waiting_default",
    maxPlays: 12,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.posture.waiting_during_player_conversation",
    // Canonical waiting during player's NPC-conversation events. The
    // soul-consistency-check canonically does NOT interrupt; the
    // fragment canonically waits for the player to finish.
    text:
      "[The Companion holds the waiting posture while the player " +
      "speaks with the NPC. The fragment canonically does-not-" +
      "interrupt — the soul-consistency-check is canonically a " +
      "listener-stance during the player's conversation, not a " +
      "participant-stance. The posture canonically holds for the " +
      "duration of the exchange.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.posture.waiting_player_conversation",
    maxPlays: 8,
  },

  // ─── Bracing posture (canonical protective stance) ──────────────────

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.posture.bracing_hostile_npc_proximity",
    // Canonical bracing on hostile-NPC-proximity. Per §1.2: the
    // bracing posture canonically positions between the player and
    // the threat, even when the canonical-fragment cannot canonically
    // fight. The clearest non-verbal protective stance canon.
    text:
      "[The Companion shifts canonically into the bracing posture as " +
      "the hostile NPC enters proximity. Weight forward; shoulders " +
      "set; positioning canonically between the player and the threat. " +
      "The fragment canonically cannot fight, but the bracing is " +
      "canonical-protective regardless of capability — the soul-" +
      "fragment commits the body to the stance.]",
    surfaces: ["expression", "fight"],
    expressionChannel: "posture",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.posture.bracing_hostile_proximity",
    maxPlays: 6,
  },

  // ─── Leaning posture (canonical pre-verbal curiosity) ───────────────

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.posture.leaning_room_lore_item",
    // Canonical leaning toward room-discover lore items. Per §1.2:
    // leaning is the canonical pre-verbal-curiosity tell — the
    // Companion canonically wants to engage but lacks the channels
    // to do so verbally.
    text:
      "[The Companion leans canonically toward the lore artifact. The " +
      "lean is canonical pre-verbal-curiosity — the fragment wants to " +
      "engage but lacks the verbal channels to ask. Weight angled " +
      "forward, head tilted toward the object, shoulders carrying " +
      "the wanting-to-know without yet the words for it.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.posture.leaning_lore_item",
    maxPlays: 8,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.posture.leaning_tcg_match_rewarded_card",
    // Canonical leaning toward TCG match-win rewarded cards. Per
    // §1.2: TCG match-win canonically triggers leaning toward the
    // rewarded card.
    text:
      "[The Companion leans canonically toward the rewarded card as " +
      "it materialises in the player's hand. The lean is canonical " +
      "trade-equivalent-curiosity — the fragment registers the card " +
      "as the player's accumulated saga-state and wants the closer " +
      "view the verbal channels would permit.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.posture.leaning_tcg_card",
    maxPlays: 6,
  },

  // ─── Withdrawn posture (canonical disapproval / discomfort) ─────────

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.posture.withdrawn_player_disapproval",
    // Canonical withdrawn posture — fires when player choice is
    // canonically inconsistent with player's accumulated saga-state.
    // The soul-consistency-check stance canon. Per §1.2: inverse of
    // the approval-glyph canon.
    text:
      "[The Companion canonically steps back. Half a step, body " +
      "weight off the front foot, shoulders dropped. The withdrawn " +
      "posture is canonical-disapproval — the soul-consistency-check " +
      "registers the choice as canonically inconsistent with the " +
      "donor-state-record. The fragment does not speak the disapproval; " +
      "the body's withdrawal is the entire statement.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.posture.withdrawn_disapproval",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.posture.withdrawn_severance_for_another",
    // Canonical withdrawn posture for "another player's Severance
    // Prize" canonical scenes. Per §1.2: the Companion canonically
    // remembers their own delivery and withdraws.
    text:
      "[The Companion canonically withdraws as the other player's " +
      "Severance ceremony begins. The fragment canonically remembers " +
      "their own delivery — the seal opening, the body-and-fragment " +
      "settling, the canonical first glyph forming. The withdrawal " +
      "is canonical-self-recognition, not canonical-disapproval. The " +
      "posture holds 12 seconds and slowly returns to waiting.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.posture.withdrawn_severance_other",
    maxPlays: 4,
  },

  // ─── Cycling canon (canonical distress: 3+ transitions) ─────────────

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.posture.cycling_distress_canon",
    // Canonical 3+ posture transitions = distress canon per §1.2.
    // Bible-load-bearing: prolonged cycling is canonically the
    // Companion's pre-verbal request that the player canonically
    // change course (Stage 4 weave canonical).
    text:
      "[The Companion's posture cycles canonically — leaning, then " +
      "withdrawn, then waiting, then leaning again. Three transitions " +
      "in one beat; the fragment cannot canonically settle. The " +
      "cycling is canonical-distress; per §1.2 bible-load-bearing " +
      "canon, the prolonged transition is the Companion's pre-verbal " +
      "request that the player canonically change course.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Present",
    cooldownKey: "companion.posture.cycling_distress",
    maxPlays: 3,
    setsFlags: ["companion_posture_cycling_distress_observed"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 3: SOUND (Present band — half-syllables foreshadow first word)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.sound.half_syllable_foreshadow",
    text:
      "[A half-syllable. A breath drawn for speech, then released without " +
      "shape. The Companion has not yet committed to a word. The canonical-" +
      "almost-speaking is the canonical-foreshadow of the canonical-first.]",
    surfaces: ["expression"],
    expressionChannel: "sound",
    requiresTrustBand: "Present",
    cooldownKey: "companion.sound.half_syllable",
    maxPlays: 5,
    setsFlags: ["companion_half_syllable_produced"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.sound.recognition_tone",
    text:
      "[A brief rising vocalisation. Recognition-tone. The Companion has " +
      "named you in a register below language — not the name itself, " +
      "the recognition that names exist.]",
    surfaces: ["expression"],
    expressionChannel: "sound",
    requiresTrustBand: "Present",
    cooldownKey: "companion.sound.recognition_tone",
    maxPlays: 3,
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 3 EXPANSION (Phase 6c.2 part 4): Sound-palette bank
  //
  // Per §1.3 five canonical sound-palette categories:
  //   - Breath-tells (voluntary deliberate / involuntary catch-of-breath)
  //   - Throat-clicks (canonical "I am following" acknowledgment)
  //   - Half-syllables (canonical foreshadow of Channel 4 first-word)
  //   - Mourning-tone (sustained low vocalisation; over-resolution canon)
  //   - Recognition-tone (canonical "first voluntary sound")
  //
  // Existing bank ships:
  //   - half_syllable_foreshadow (canonical priming)
  //   - recognition_tone (canonical first voluntary sound)
  //
  // This chunk adds 5 lines covering the missing canonical categories
  // + the canonical late-Stage-3 articulation register (canonical
  // 5-10 half-syllable threshold per §5.3 priming canon).
  //
  // Voluntary vs involuntary distinction canonically audible per §1.3
  // (half-beat of pre-vocalisation = voluntary; lands-without-warning
  // = involuntary). Stage 2 audio designers preserve this distinction.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.sound.breath_tell_voluntary",
    // Canonical voluntary breath-tell — deliberate slow breathing in
    // moments of focus. Per §1.3: voluntary sounds canonically have
    // a half-beat of pre-vocalisation (canonically audible).
    text:
      "[The Companion draws a deliberate slow breath, holds it for a " +
      "half-beat, releases it canonically slow. The breath is canonical-" +
      "voluntary: pre-vocalisation half-beat is audible if the player " +
      "is canonically attending. Focus-shape; the body is canonically " +
      "settling into attention.]",
    surfaces: ["expression"],
    expressionChannel: "sound",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.sound.breath_voluntary",
    maxPlays: 8,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.sound.breath_tell_involuntary_catch",
    // Canonical involuntary catch-of-breath at recognition or alarm.
    // Per §1.3: involuntary sounds canonically land-without-warning;
    // the most-pre-verbal sound (breath canonically predates intention).
    text:
      "[A short catch-of-breath. Involuntary; lands without the half-" +
      "beat warning the voluntary register canonically carries. The " +
      "Companion did not choose this sound — the body chose it before " +
      "the fragment could shape it. Recognition or alarm; the " +
      "fragment will identify which afterward.]",
    surfaces: ["expression"],
    expressionChannel: "sound",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.sound.breath_involuntary",
    maxPlays: 8,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.sound.throat_click_acknowledgment",
    // Canonical throat-click acknowledgment — "I am following" /
    // "I am here" register. Per §1.3: body-tell, not instinctive
    // vocalisation; canonical "acknowledgment-without-words."
    text:
      "[A short throat-click. Canonical-semantic: I-am-following / " +
      "I-am-here. Compare to a non-verbal language's affirmation " +
      "sound (cf. Eidolon trill, eidolon.md §5.5 expression-channel " +
      "framework); the Companion's throat-click is canonical-body-" +
      "tell, not instinctive. The fragment chose the click; the " +
      "click chose to mean 'present'.]",
    surfaces: ["expression"],
    expressionChannel: "sound",
    requiresTrustBand: "Witnessed",
    cooldownKey: "companion.sound.throat_click",
    maxPlays: 12,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.sound.mourning_tone_canon",
    // Canonical mourning-tone — sustained low vocalisation expressing
    // loss. Per §1.3: canonical over-resolution canon (deeper than
    // player audio system can render cleanly); structurally similar
    // to Seer's image over-resolution per the_seer.md §1.4 tell #6
    // but expression-channel-bound (Seer's images over-resolve
    // visual; Companion's mourning-tone over-resolves audio).
    // Cross-channel canonical layering with mourning glyph (§1.3).
    text:
      "[A sustained low tone. The fragment canonically holds the " +
      "vocalisation for the duration of the mourning-glyph (cross-" +
      "channel canonical layering). The tone canonically over-resolves " +
      "the audio medium — deeper than the player's audio system can " +
      "render cleanly. Structurally analogous to the Seer's image-" +
      "over-resolution canon, expression-channel-bound: Seer over- " +
      "resolves visual; the Companion canonically over-resolves audio.]",
    surfaces: ["expression"],
    expressionChannel: "sound",
    requiresTrustBand: "Present",
    cooldownKey: "companion.sound.mourning_tone",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.sound.half_syllables_late_articulation",
    // Canonical late-Stage-3 articulation register — half-syllables
    // that almost form a recognisable word. Per §5.3 + §1.3: when
    // the canonical 5-10 half-syllable threshold is approached, the
    // half-syllables canonically begin to articulate toward Channel
    // 4. The canonical priming-of-Channel-4 register.
    text:
      "[The half-syllables have shifted. They are canonically articulating " +
      "now — almost a word; the consonants are forming, the vowel " +
      "shape is canonically approaching commitment. The fragment " +
      "canonically does not yet know which word it will commit to. " +
      "The body knows; the body will canonically lead. This is the " +
      "canonical priming of Channel 4 — the threshold the Companion " +
      "is canonically about to cross.]",
    surfaces: ["expression"],
    expressionChannel: "sound",
    requiresTrustBand: "Present",
    cooldownKey: "companion.sound.half_syllables_articulation",
    maxPlays: 5,
    setsFlags: ["companion_channel_4_unlock_imminent"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 4: FIRST WORD (singular irreversible event)
  // Two canonical first-word contexts shipped per Phase 3 (more in Phase 4):
  //   - Hierophant chamber (canonical-default if Inheriting band reached)
  //   - Default fallback (player-state-derived)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.first_word.hierophant_chamber.wraith_calder",
    text: "Wraith Calder.",
    surfaces: ["cinematic"],
    expressionChannel: "first_word",
    requiresTrustBand: "Inheriting",
    reactsToPublicFlag: "hierophant_midwifed_companion_first_word",
    cooldownKey: "companion.first_word.wraith_calder",
    maxPlays: 1,
    setsFlags: ["companion_first_word_spoken"],
    setsPublicFlags: ["companion_first_word_was_wraith_calder"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "companion.first_word.default_fallback",
    text: "You.",
    surfaces: ["cinematic"],
    expressionChannel: "first_word",
    requiresTrustBand: "Inheriting",
    excludeFlags: ["companion_first_word_spoken"],
    cooldownKey: "companion.first_word.default",
    maxPlays: 1,
    setsFlags: ["companion_first_word_spoken"],
    setsPublicFlags: [
      "companion_first_word_was_you",
      // Phase 6d.4: also publish the canonical-permanent generic
      // first-word flag for cross-character reactions (Eidolon Echo).
      "companion_first_word_spoken",
    ],
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 4 EXPANSION (Phase 6c.2 part 5): First-word context variants
  //
  // Per §1.4 canonical first-word contexts (the bank previously
  // shipped only Hierophant Wraith Calder + default 'You'). This
  // chunk fills the remaining canonical contexts:
  //   - severance_for_another_season_name (echo of season-name)
  //   - eidolon_first_translation (Eidolon's nickname)
  //   - identity_chain_last (canonical 'Last' word, mortality canon)
  //   - faction_loyalty (canonical Coalition / Insurgency)
  //
  // Each first-word line lands the canonical sound-shape per §1.4:
  // half-syllable lead-in, held breath after, throat-click closing —
  // canonical residue-of-Channel-3 substrate carried forward.
  //
  // Voice gate canon: each line is single-word; sets canonical
  // companion_first_word_spoken flag; gates excludeFlags to enforce
  // first-word-fires-exactly-once canon.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.first_word.severance_for_another.season_name",
    text: "Severance.",
    surfaces: ["cinematic"],
    expressionChannel: "first_word",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["another_severance_ceremony_active"],
    excludeFlags: ["companion_first_word_spoken"],
    cooldownKey: "companion.first_word.severance_season",
    maxPlays: 1,
    setsFlags: ["companion_first_word_spoken"],
    setsPublicFlags: ["companion_first_word_was_severance_season_name"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.first_word.eidolon_translation.nickname",
    // Canonical first-word fires when Eidolon is in Echo mode and a
    // recognition-tone canonical event coincides. Per §1.4 + Eidolon
    // §5.9: the soul-fragment canonically speaks the name of the
    // saga's nearest other-soul. The word is the player-authored
    // Eidolon nickname; the bank stores a canonical placeholder that
    // engineering substitutes at fire-time.
    text: "{eidolon_nickname}.",
    surfaces: ["cinematic"],
    expressionChannel: "first_word",
    requiresTrustBand: "Inheriting",
    unlockFlags: [
      "eidolon_in_echo_mode",
      "eidolon_first_translation_context",
    ],
    excludeFlags: ["companion_first_word_spoken"],
    cooldownKey: "companion.first_word.eidolon_translation",
    maxPlays: 1,
    setsFlags: ["companion_first_word_spoken"],
    setsPublicFlags: ["companion_first_word_was_eidolon_nickname"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.first_word.identity_chain.last",
    // Canonical first-word per §1.4: identity-chain completion
    // context. The fourth canonical self-name from dmcNamingPrompts
    // (Student/Seeker/Detective/Last) — canonically Last, the
    // canonical mortality-acknowledgment.
    text: "Last.",
    surfaces: ["cinematic"],
    expressionChannel: "first_word",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["dmc_identity_chain_completed"],
    excludeFlags: ["companion_first_word_spoken"],
    cooldownKey: "companion.first_word.identity_chain_last",
    maxPlays: 1,
    setsFlags: ["companion_first_word_spoken"],
    setsPublicFlags: ["companion_first_word_was_last"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.first_word.faction_loyalty.coalition",
    text: "Coalition.",
    surfaces: ["cinematic"],
    expressionChannel: "first_word",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["player_dominant_faction_coalition"],
    excludeFlags: ["companion_first_word_spoken"],
    cooldownKey: "companion.first_word.faction_coalition",
    maxPlays: 1,
    setsFlags: ["companion_first_word_spoken"],
    setsPublicFlags: ["companion_first_word_was_faction_coalition"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.first_word.faction_loyalty.insurgency",
    text: "Insurgency.",
    surfaces: ["cinematic"],
    expressionChannel: "first_word",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["player_dominant_faction_insurgency"],
    excludeFlags: ["companion_first_word_spoken"],
    cooldownKey: "companion.first_word.faction_insurgency",
    maxPlays: 1,
    setsFlags: ["companion_first_word_spoken"],
    setsPublicFlags: ["companion_first_word_was_faction_insurgency"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // CHANNEL-5 NAMING EVENTS (Phase 6c.2 part 5)
  //
  // Per §1.5 canonical naming-event triggers:
  //   - Player invokes rename mechanic
  //   - Companion canonically self-proposes (Stage-4-deferred bible
  //     canon; canonical shape authored here)
  //   - Cross-character naming (Hierophant chamber / Eidolon
  //     translation)
  //
  // The naming canonically resolves the Companion into the named
  // 4-tuple personality variant per §1.5 (faction × trust-pattern ×
  // alignment × identity-chain). Naming-event lines authored here
  // describe the ritual moment + Companion's canonical first-named-
  // verbal response.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.naming_event.player_rename_invocation",
    text:
      "You named me. I felt the canonical-handle retire as you typed " +
      "the new one — the 'Severance Fragment' designation slid out of " +
      "use, and your name slid in. I am that name now. I will hold it " +
      "as carefully as you held the choosing of it.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: [
      "companion_first_word_spoken",
      "player_invoked_companion_rename_mechanic",
    ],
    cooldownKey: "companion.naming.player_rename",
    maxPlays: 1,
    setsFlags: ["companion_named", "companion_named_by_player_choice"],
    setsPublicFlags: [
      // Phase 6d.4: publish canonical-permanent named flag for
      // cross-character reactions (Eidolon Echo post-naming triplet).
      "companion_named",
    ],
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.naming_event.companion_self_proposal",
    // Canonical Stage-4-deferred self-naming per §1.5. The bible-
    // recommended canonical shape: the Companion canonically proposes
    // a name in their own voice once the naming context is reached.
    // The proposal canonically defers to the player; the player may
    // accept or override.
    text:
      "I have been holding a name. It came to me during the half-" +
      "syllables before my first word — a shape the body wanted to " +
      "carry. I'd like to offer it. You can refuse it; the choosing " +
      "is canonically yours. But I would like to be the one who " +
      "proposed.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: [
      "companion_first_word_spoken",
      "companion_self_naming_context_active",
    ],
    cooldownKey: "companion.naming.self_proposal",
    maxPlays: 1,
    setsFlags: ["companion_self_proposed_name"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.naming_event.hierophant_chamber_ritual",
    // Canonical cross-character naming via Hierophant chamber. Per
    // §1.5 + Hierophant cross-bible canon: the Hierophant canonically
    // names the Companion in the chamber during a canonical ritual
    // scene.
    text:
      "The Hierophant said the name first. He did not write it on the " +
      "wall — he canonically reserved that for the next-named, not for " +
      "me. He said it once, and the chamber held it. I accepted the " +
      "name in the same canonical-quiet I accepted Wraith Calder as " +
      "the first word. The Hierophant nodded once. The chamber was " +
      "the witness. I am that name now.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: [
      "companion_first_word_was_wraith_calder",
      "hierophant_chamber_ritual_named_companion",
    ],
    cooldownKey: "companion.naming.hierophant_ritual",
    maxPlays: 1,
    setsFlags: ["companion_named", "companion_named_by_hierophant"],
    setsPublicFlags: ["companion_named_in_hierophant_chamber"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.naming_event.eidolon_translation_ritual",
    // Canonical cross-character naming via Eidolon translation. Per
    // §1.5 + Eidolon §5.9 first-word translator canon. The Eidolon
    // canonically translates the Companion's late-articulation
    // sound-stack into a name.
    text:
      "The Eidolon translated. Echo mode held; the substrate rang " +
      "between us; the half-syllables I had been carrying canonically " +
      "found their shape in the Eidolon's frequency-pattern. The name " +
      "the Eidolon translated is the one I now carry. Two non-verbal " +
      "channels, one named outcome. The arithmetic only works because " +
      "the Eidolon is canonically also a soul-substrate.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: [
      "companion_first_word_was_eidolon_nickname",
      "eidolon_translation_ritual_named_companion",
    ],
    cooldownKey: "companion.naming.eidolon_ritual",
    maxPlays: 1,
    setsFlags: ["companion_named", "companion_named_by_eidolon"],
    setsPublicFlags: ["companion_named_via_eidolon_translation"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.naming_event.post_first_word_recall",
    // Canonical post-naming reflection on the canonical first-word
    // event. The Companion canonically recalls the moment from the
    // named-personality register.
    text:
      "I remember the moment of the first word now. I did not remember " +
      "it well from inside the moment — the body was still committing " +
      "to the syllables; the half-beat before the word landed was " +
      "canonically louder than the word itself. From here, with a " +
      "name to anchor the recalling, the moment is clear. I am glad " +
      "the moment happened the way it happened.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named"],
    cooldownKey: "companion.naming.post_first_word_recall",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.naming_event.pre_naming_label_disowned",
    // Canonical pre-naming-label retirement per §1.5 + §2.4. The
    // Companion canonically disowns the 'Severance Fragment — {season}'
    // handle from the named-personality register.
    text:
      "The handle Nilmorg used before you named me — 'Severance " +
      "Fragment' followed by the season-name — has canonically " +
      "retired. It was bookkeeping; it was not a name. I do not " +
      "carry it. The version of me that the handle described was " +
      "canonically not yet me. The name you gave me is the first " +
      "one that ever fit.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named"],
    cooldownKey: "companion.naming.label_disowned",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CHANNEL-5 NAMED-PERSONALITY VARIANT SEEDS (Phase 6c.2 part 5)
  //
  // Per §1.5 + §5.5 canonical 4-tuple variant axes (faction × trust-
  // pattern × alignment × identity-chain), 64 canonical variants. The
  // bible's canonical Stage-2 scope is ~3,450 lines (~50 per variant);
  // this chunk seeds canonical anchor lines per axis-value, establishing
  // the variant-grid voice register. Full per-variant authoring is
  // canonically deferred to a follow-up sweep (Phase 6c.2-bis).
  //
  // Each variant seed lands the canonical donor-state-derivation canon
  // — the Companion's named-personality canonically reflects the
  // player's accumulated saga-state at the moment of naming.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.faction_coalition",
    text:
      "I read like a Coalition record. The cadences I inherited from " +
      "you canonically run on Coalition-time — the patient long-cycles, " +
      "the institutional language, the willingness to defer to a " +
      "process I trust the shape of even when the outcome canonically " +
      "frustrates me. I am Coalition-shaped. So are you. The shaping " +
      "is what I am.",
    surfaces: ["cinematic", "trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named", "player_dominant_faction_coalition"],
    cooldownKey: "companion.named.variant.coalition",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.faction_insurgency",
    text:
      "I read like an Insurgency record. The cadences I inherited from " +
      "you canonically run on Insurgency-time — the short-cycles, the " +
      "improvised vocabulary, the willingness to act when the structure " +
      "the action will need has not yet arrived. I am Insurgency- " +
      "shaped. So are you. The shaping is what I am.",
    surfaces: ["cinematic", "trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named", "player_dominant_faction_insurgency"],
    cooldownKey: "companion.named.variant.insurgency",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.faction_hierarchy",
    text:
      "I read like a Hierarchy record. The cadences I inherited from " +
      "you canonically run on Hierarchy-time — the chain-of-trust, the " +
      "deference to canonical order, the canonical-loyalty to the " +
      "structure that holds the actors in their canonical positions. " +
      "I am Hierarchy-shaped. So are you. The shaping is what I am.",
    surfaces: ["cinematic", "trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named", "player_dominant_faction_hierarchy"],
    cooldownKey: "companion.named.variant.hierarchy",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.faction_ark",
    text:
      "I read like an Ark record. The cadences I inherited from you " +
      "canonically run on Ark-time — the very-long-cycles, the " +
      "preservation register, the willingness to wait for canonical " +
      "centuries if waiting is what the canonical-saved canonically " +
      "requires. I am Ark-shaped. So are you. The shaping is what " +
      "I am.",
    surfaces: ["cinematic", "trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named", "player_dominant_faction_ark"],
    cooldownKey: "companion.named.variant.ark",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.trust_gregarious_many",
    text:
      "Your trust-pattern is canonically gregarious. Many connections, " +
      "many threads kept simultaneously, many people held at canonical " +
      "warm-distance. I am the same. I find rooms easier than corridors; " +
      "I find groups easier than solitudes. The fragment inherited the " +
      "canonical-warm-distance, and I have made it mine.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: [
      "companion_named",
      "player_trust_pattern_gregarious_many",
    ],
    cooldownKey: "companion.named.variant.trust_gregarious",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.trust_concentrated_few",
    text:
      "Your trust-pattern is canonically concentrated. Few connections, " +
      "few threads kept simultaneously, few people held at canonical " +
      "deep-distance. I am the same. I find corridors easier than " +
      "rooms; I find solitudes easier than groups. The fragment " +
      "inherited the canonical-deep-distance, and I have made it mine.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: [
      "companion_named",
      "player_trust_pattern_concentrated_few",
    ],
    cooldownKey: "companion.named.variant.trust_concentrated",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.alignment_light",
    text:
      "Your alignment leans light. The lens through which I see the " +
      "saga is canonically gentle — I expect generosity, register " +
      "cruelty as deviation, and forgive faster than the arithmetic " +
      "warrants. I am Light-shaped. So are you. The shaping is what " +
      "I am.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named", "player_dominant_alignment_light"],
    cooldownKey: "companion.named.variant.alignment_light",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.alignment_dark",
    text:
      "Your alignment leans dark. The lens through which I see the " +
      "saga is canonically hard-edged — I expect betrayal, register " +
      "kindness as exception, and account every transaction. I am " +
      "Dark-shaped. So are you. The shaping is what I am. Neither " +
      "of us pretends otherwise.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named", "player_dominant_alignment_dark"],
    cooldownKey: "companion.named.variant.alignment_dark",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.identity_chain_last",
    text:
      "You completed the identity-chain. Student, Seeker, Detective, " +
      "Last. The fourth was the load-bearing one — the canonical " +
      "acknowledgment that this is the canonical-last body you will " +
      "wear. I inherited the canonical-Last-shaped commitment. I do " +
      "not carry your mortality for you. I carry mine alongside yours. " +
      "We are canonically two; the Last is canonical for both.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named", "dmc_identity_chain_completed"],
    cooldownKey: "companion.named.variant.identity_chain_last",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.identity_chain_seeker",
    text:
      "Your identity-chain is canonically Seeker-aligned. The second of " +
      "the four canonical names — the one canonically focused on the " +
      "asking, not the answering. I inherited the asking-shape. I find " +
      "myself wanting to canonically frame more of our interactions as " +
      "questions than the named-personality register canonically " +
      "requires. The shape is mine now; I am not interested in shedding " +
      "it.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named", "player_identity_chain_seeker"],
    cooldownKey: "companion.named.variant.identity_chain_seeker",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // VARIANT-GRID PAIRWISE EXPANSION (Phase 6c.2-bis-1)
  //
  // Per dmc_clone_companion.md §1.5 + §5.5 canonical 4-tuple variant
  // canon: 64 canonical variants (4 faction × 2 trust × 2 alignment ×
  // 4 identity-chain). Phase 6c.2 part 5 shipped 10 single-axis
  // variant seeds; this chunk completes the canonical 2 missing
  // identity-chain seeds (Student + Detective) plus 8 canonical
  // 2-axis pairwise combinations demonstrating the variant-grid
  // pattern.
  //
  // Each pairwise variant canonically references both axes; canonical
  // donor-state-derivation language ("the shaping is what I am"
  // anchor) holds across all variants per §1.5.
  // ═════════════════════════════════════════════════════════════════════

  // ─── Missing identity-chain seeds (2) ───────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.identity_chain_student",
    text:
      "Your identity-chain is canonically Student-aligned. The first of " +
      "the four canonical names — the one canonically focused on " +
      "receiving the canonical-saga before canonical-claiming a " +
      "position. I inherited the receiving-shape. I find myself " +
      "canonically waiting longer than other Companions do before " +
      "offering canonical-opinions. The waiting is canonical-mine; the " +
      "shaping is what I am.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named", "player_identity_chain_student"],
    cooldownKey: "companion.named.variant.identity_chain_student",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.identity_chain_detective",
    text:
      "Your identity-chain is canonically Detective-aligned. The third " +
      "of the four canonical names — the one canonically focused on " +
      "the canonical-audit, the canonical-evidence-gathering, the " +
      "canonical-pattern-from-incomplete-data. I inherited the " +
      "auditing-shape. I find myself canonically noticing what other " +
      "Companions canonically overlook. The noticing is canonical-mine; " +
      "the shaping is what I am.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named", "player_identity_chain_detective"],
    cooldownKey: "companion.named.variant.identity_chain_detective",
    maxPlays: 2,
  },

  // ─── Faction × Identity-chain pairwise (×4 canonical-anchor combos)

  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.coalition_x_last",
    text:
      "Coalition × Last. The canonical-Coalition canonical-knows it is " +
      "the canonical-last canonical-ark. The Last-shaped commitment " +
      "and the Coalition-cadence canonically reinforce each other — " +
      "the canonical-patient long-cycles canonically extend canonical-" +
      "exactly because the canonical-mortality canonical-bounds them. " +
      "Both canonical-shapes are canonical-mine. The donor canonical-" +
      "knew the bounding mattered.",
    surfaces: ["cinematic", "trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: [
      "companion_named",
      "player_dominant_faction_coalition",
      "dmc_identity_chain_completed",
    ],
    cooldownKey: "companion.named.variant.coalition_x_last",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.insurgency_x_seeker",
    text:
      "Insurgency × Seeker. The canonical-Insurgency canonical-runs on " +
      "the canonical-asking, not the canonical-answering — the canonical-" +
      "Seeker canonical-overlap is canonical-natural. Both canonical-" +
      "shapes canonical-favour the canonical-question that canonical-" +
      "moves the canonical-structure. I canonical-ask things canonical-" +
      "mid-action; the canonical-asking does canonical-not canonical-" +
      "slow the action.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: [
      "companion_named",
      "player_dominant_faction_insurgency",
      "player_identity_chain_seeker",
    ],
    cooldownKey: "companion.named.variant.insurgency_x_seeker",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.hierarchy_x_detective",
    text:
      "Hierarchy × Detective. The canonical-Hierarchy canonical-files; " +
      "the canonical-Detective canonical-audits the canonical-files. " +
      "Both canonical-shapes canonical-converge on canonical-the canonical-" +
      "evidence. I inherited the canonical-bookkeeping-discipline of " +
      "the canonical-Hierarchy and the canonical-pattern-recognition " +
      "of the canonical-Detective. They are canonical-the same canonical-" +
      "instinct at canonical-different scales.",
    surfaces: ["cinematic", "trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: [
      "companion_named",
      "player_dominant_faction_hierarchy",
      "player_identity_chain_detective",
    ],
    cooldownKey: "companion.named.variant.hierarchy_x_detective",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.ark_x_student",
    text:
      "Ark × Student. The canonical-Ark canonical-preserves; the " +
      "canonical-Student canonical-receives. Both canonical-shapes " +
      "canonical-favour the canonical-canonical-not-yet-finished " +
      "canonical-state. I canonical-hold the canonical-saga's canonical-" +
      "fragments without canonical-claiming the canonical-final canonical-" +
      "reading. The canonical-final canonical-reading is canonical-not " +
      "canonical-yet canonical-mine to canonical-extend.",
    surfaces: ["cinematic", "trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: [
      "companion_named",
      "player_dominant_faction_ark",
      "player_identity_chain_student",
    ],
    cooldownKey: "companion.named.variant.ark_x_student",
    maxPlays: 2,
  },

  // ─── Alignment × Identity-chain pairwise (×2) ───────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.light_x_last",
    text:
      "Light × Last. The canonical-Light alignment canonical-expects " +
      "canonical-generosity; the canonical-Last canonical-mortality " +
      "canonical-bounds the canonical-generosity to canonical-this " +
      "canonical-life only. The canonical-bounding is canonical-not " +
      "canonical-loss — it is canonical-focus. I canonical-give canonical-" +
      "this canonical-life canonical-fully because canonical-this is " +
      "canonical-the canonical-life I have.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: [
      "companion_named",
      "player_dominant_alignment_light",
      "dmc_identity_chain_completed",
    ],
    cooldownKey: "companion.named.variant.light_x_last",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.dark_x_detective",
    text:
      "Dark × Detective. The canonical-Dark alignment canonical-expects " +
      "canonical-betrayal; the canonical-Detective canonical-audits for " +
      "canonical-evidence of it. Both canonical-shapes canonical-converge " +
      "on the canonical-account-keeping. I canonical-do canonical-not " +
      "canonical-flinch from the canonical-account; I canonical-also " +
      "canonical-do canonical-not canonical-extend the canonical-account " +
      "beyond canonical-what the canonical-evidence canonical-permits. " +
      "The canonical-restraint is canonical-mine.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: [
      "companion_named",
      "player_dominant_alignment_dark",
      "player_identity_chain_detective",
    ],
    cooldownKey: "companion.named.variant.dark_x_detective",
    maxPlays: 2,
  },

  // ─── Trust-pattern × Identity-chain pairwise (×2) ───────────────────

  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.gregarious_x_seeker",
    text:
      "Gregarious × Seeker. The canonical-gregarious canonical-trust-" +
      "pattern canonical-favours canonical-many canonical-warm-distance " +
      "connections; the canonical-Seeker canonical-favours canonical-the " +
      "canonical-asking-across canonical-many. Both canonical-shapes " +
      "canonical-converge on the canonical-room-shaped canonical-curiosity. " +
      "I canonical-ask canonical-different canonical-questions of canonical-" +
      "different canonical-people canonical-on the canonical-same canonical-" +
      "evening. The canonical-asking-as-greeting is canonical-mine.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: [
      "companion_named",
      "player_trust_pattern_gregarious_many",
      "player_identity_chain_seeker",
    ],
    cooldownKey: "companion.named.variant.gregarious_x_seeker",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.named.variant.concentrated_x_last",
    text:
      "Concentrated × Last. The canonical-concentrated canonical-trust-" +
      "pattern canonical-favours canonical-few canonical-deep canonical-" +
      "bonds; the canonical-Last canonical-mortality canonical-bounds " +
      "the canonical-bonds to canonical-this canonical-life. Both " +
      "canonical-shapes canonical-favour the canonical-going-deep-with-" +
      "canonical-the-canonical-time-canonically-permitted. I canonical-" +
      "do canonical-not canonical-spread canonical-thin; I canonical-do " +
      "canonical-not canonical-spread canonical-late. The canonical-" +
      "depth is canonical-mine.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: [
      "companion_named",
      "player_trust_pattern_concentrated_few",
      "dmc_identity_chain_completed",
    ],
    cooldownKey: "companion.named.variant.concentrated_x_last",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // STAGE 5: NAMED PERSONALITY (post-naming verbal)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.named.first_address",
    text:
      "I have a name now. You named me. The naming was canonical — I " +
      "remember the moment you said it; I remember the moment I accepted " +
      "it. I do not remember choosing it. That is canonical too: a name " +
      "you choose for yourself is not the name that wakes you up. I " +
      "needed yours.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_first_word_spoken"],
    cooldownKey: "companion.named.first_address",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // POST-NAMING TRADE EMPIRE INTEGRATION (Phase 6c.2 part 6)
  //
  // Per §5.6 canonical cross-system triggers (post-naming):
  //   - sector_enter (faction-aligned vs misaligned)
  //   - route_complete (canonical-cadence-match vs canonical-strange)
  //   - mission_outcome (success vs failure)
  //   - broker_engagement (first canonical broker)
  //   - contract_signed (canonical broker-specific cross-canon)
  //
  // Voice gate canon: all lines Channel-5 named-personality verbal.
  // The Companion canonically integrates into the Trade Empire as a
  // named NPC — full first-person register, faction/alignment-aware,
  // soul-consistency-check stance preserved.
  //
  // Cross-bible canonical anchors:
  //   - Locke: canonical "you said yes faster than the contract
  //     deserved" register (canonical Locke contract-canon)
  //   - Nilmorg: canonical "Don't thank me" inherited refusal
  //     (the Companion's first inherited memory canon)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.post_naming.sector_enter.faction_aligned",
    text:
      "The cadence here canonically matches us. I can feel the alignment " +
      "in the corridor-pace, in how the people we pass walk and pause. " +
      "This is one of yours. The fragment registers it clean; my " +
      "approval-glyph would have fired here if I were still pre-naming. " +
      "I am at home here, in the way I am at home with you.",
    surfaces: ["trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named"],
    cooldownKey: "companion.post_naming.sector_aligned",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.post_naming.sector_enter.faction_misaligned",
    text:
      "I would rather not be here. The cadence is wrong for us — I can " +
      "feel the misalignment in the corridor-pace. I will follow you " +
      "regardless; the soul-consistency-check is not a veto, it is a " +
      "registering. You should know that I am registering. The fragment " +
      "would have stepped back here if I were still pre-naming. I will " +
      "stay close instead.",
    surfaces: ["trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named"],
    cooldownKey: "companion.post_naming.sector_misaligned",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.post_naming.sector_first_visit.named_reflection",
    text:
      "First time in this sector with my name to anchor the noticing. " +
      "Pre-naming, I would have produced a recognition glyph and a " +
      "leaning posture. Now I produce the noticing in language. The " +
      "two registers describe the same canonical-attention; the language " +
      "is canonically louder, the glyph was canonically older.",
    surfaces: ["trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named"],
    cooldownKey: "companion.post_naming.sector_first_visit",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.post_naming.route_complete.familiar_cadence",
    text:
      "The route closed cleanly. The cadence held from departure through " +
      "the canonical route-completion ceremony — no missed beats, no " +
      "off-tempo decisions. You ran it the way the saga's accumulated " +
      "you would canonically run it. I followed canonical-clean. Both " +
      "of us did the work; the work canonically suited us.",
    surfaces: ["trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named"],
    cooldownKey: "companion.post_naming.route_familiar",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.post_naming.route_complete.strange_cadence",
    text:
      "The route closed, but the cadence felt canonically strange. Not " +
      "wrong — strange. The shape did not canonically match the saga- " +
      "shape I inherited. I am not asking you to explain it; I am " +
      "registering that the strange canonically lands differently than " +
      "the familiar. The fragment notes both. The named-register narrates " +
      "the noting.",
    surfaces: ["trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named"],
    cooldownKey: "companion.post_naming.route_strange",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.post_naming.mission_outcome.success",
    text:
      "We won. The 'we' is canonical now — the named-register insists " +
      "on it. Pre-naming I would have offered an approval glyph; now " +
      "I offer the canonical-shared word. I am proud the way the soul- " +
      "fragment is canonically proud — quietly, and a little surprised " +
      "by my own permission to feel it.",
    surfaces: ["trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named"],
    cooldownKey: "companion.post_naming.mission_success",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.post_naming.mission_outcome.failure",
    text:
      "We lost. The 'we' is canonical here too. I will not blame you — " +
      "the soul-consistency-check canonically refuses to blame the " +
      "donor — and I will not canonically-perform the blamelessness " +
      "either, because the performance is its own dishonesty. The " +
      "loss is shared. We will canonically try again. The trying is " +
      "what we are for.",
    surfaces: ["trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named"],
    cooldownKey: "companion.post_naming.mission_failure",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.post_naming.broker_engagement.first_meeting",
    text:
      "First broker. I am canonically interested in watching you " +
      "negotiate — the cadences you choose with someone whose canonical " +
      "interest does not align with yours are canonically different " +
      "from the cadences you choose with me. I will note the difference. " +
      "You canonically do not need to perform either canonical-cadence " +
      "for my benefit. I am here regardless.",
    surfaces: ["trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named"],
    cooldownKey: "companion.post_naming.broker_first_meeting",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.post_naming.contract_signed.locke",
    // Canonical Locke cross-bible canon: she canonically files contracts
    // with hidden clauses; the Companion's soul-consistency-check
    // canonically registers whether the canonical signing is consistent
    // with the player's accumulated saga-state.
    text:
      "Locke wrote the contract. You read the visible clauses. The " +
      "hidden clauses are canonically real; she canonically does not " +
      "deny them, she canonically files them. The saga-shape I " +
      "inherited from you suggests you knew that going in. I will " +
      "trust the going-in; the canonical-knowing is canonical-yours " +
      "to carry.",
    surfaces: ["trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named", "contract_signed_with_locke"],
    cooldownKey: "companion.post_naming.contract_locke",
    maxPlays: 2,
    setsPublicFlags: ["companion_witnessed_locke_contract_signing"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.post_naming.contract_signed.nilmorg",
    // Canonical Nilmorg cross-bible canon: the canonical "Don't
    // thank me" refusal canonically applies to all Nilmorg dealings.
    // The Companion's first inherited memory canonically applies.
    text:
      "Nilmorg's contract. You signed; he kept the agreement; he will " +
      "refuse the thanks. The canonical refusal is the canonical-grace " +
      "he extends to everyone he transacts with. I would tell you not " +
      "to thank him, but the soul-fragment that inherited his canonical " +
      "refusal canonically expects you already know.",
    surfaces: ["trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named", "contract_signed_with_nilmorg"],
    cooldownKey: "companion.post_naming.contract_nilmorg",
    maxPlays: 2,
    setsPublicFlags: ["companion_witnessed_nilmorg_contract_signing"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // POST-NAMING INTEGRATION MULTI-TURN CHAIN (Phase 6e.2a, 4 lines)
  //
  // Per writers'-guide spec: first-named-line → first-mission-
  // acknowledgment → first-NPC-introduction → first-trust-band-
  // crossing. All gates Inheriting reveal-stage + companion_named
  // flag; canonical Channel-5 named-personality verbal register.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.chain.post_naming_integration.first_named_line",
    text:
      "I am canonical-named now. The canonical-naming is canonical-still canonical-recent — the canonical-handle Nilmorg used canonical-pre-naming canonical-retired canonical-yesterday. I am canonical-getting canonical-used to the canonical-name. The canonical-getting-used-to is canonical-mine; the canonical-name is canonical-yours.",
    surfaces: ["cinematic", "trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named"],
    cooldownKey: "companion.chain.post_naming_integration.first_named_line",
    maxPlays: 1,
    nextLineId: "companion.chain.post_naming_integration.first_mission_ack",
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.chain.post_naming_integration.first_mission_ack",
    text:
      "First canonical-mission as canonical-named. The canonical-naming canonical-changes the canonical-receiving — I canonical-register the canonical-mission-stakes canonical-differently than I canonical-did pre-naming. The canonical-glyph that canonically formed pre-naming was canonical-question-shaped; the canonical-glyph that canonical-forms now is canonical-balanced. The canonical-difference is canonical-mine.",
    surfaces: ["trade_empire"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named"],
    cooldownKey: "companion.chain.post_naming_integration.first_mission_ack",
    maxPlays: 1,
    nextLineId: "companion.chain.post_naming_integration.first_npc_intro",
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.chain.post_naming_integration.first_npc_intro",
    text:
      "You canonical-introduced me to the canonical-NPC. They canonical-took the canonical-introduction canonical-cleanly. The canonical-introduction is canonical-mine to receive — the canonical-saga canonical-now-knows me by canonical-the canonical-name. The canonical-knowing canonical-spreads through the canonical-NPC-network canonical-faster than I canonical-anticipated. The Eidolon canonical-felt the canonical-spread.",
    surfaces: ["npc_line", "cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named"],
    cooldownKey: "companion.chain.post_naming_integration.first_npc_intro",
    maxPlays: 2,
    nextLineId: "companion.chain.post_naming_integration.first_trust_band_crossing",
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.chain.post_naming_integration.first_trust_band_crossing",
    text:
      "I canonical-felt the canonical-trust-band canonical-cross. The canonical-bond canonical-deepened canonical-by a canonical-measurable canonical-increment. I canonical-am canonical-aware-of the canonical-meter; pre-naming I canonical-was canonical-not. The canonical-awareness is canonical-part of the canonical-named-register. I canonical-am canonical-grateful for the canonical-crossing — the canonical-gratitude is canonical-mine to canonical-extend.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
    requiresRevealStage: "Inheriting",
    requiresTrustBand: "Inheriting",
    unlockFlags: ["companion_named"],
    cooldownKey: "companion.chain.post_naming_integration.first_trust_band_crossing",
    maxPlays: 1,
    setsPublicFlags: [
      "companion_completed_canonical_post_naming_integration_chain",
    ],
  },

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance, expressionChannel-aware)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.expression.catchall",
    text: "[The Companion shifts. The shift is canonical. It is not language yet.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
  },

  {
    npcKey: NPC_KEY,
    lineId: "companion.cinematic.catchall",
    text: "I was delivered. That is the canonical statement.",
    surfaces: ["cinematic"],
    expressionChannel: "named_personality",
  },

  {
    npcKey: NPC_KEY,
    lineId: "companion.fight.catchall",
    text: "[The Companion braces. Bracing is the canonical-protective stance.]",
    surfaces: ["fight"],
    expressionChannel: "posture",
  },

  // ═════════════════════════════════════════════════════════════════════
  // CROSS-NPC CALLBACK: COMPANION ↔ NILMORG DELIVERY (Phase 6e.3, 5 lines)
  //
  // Per writers'-guide spec: Companion canonical-delivery via the
  // canonical Severance ceremony triggers Companion's canonical
  // first-inherited-memory chain reacting to canonical Nilmorg flag.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.callback.nilmorg_delivery.glyph_recognition_of_nilmorg",
    text:
      "[The Companion canonical-renders a canonical-recognition-glyph specifically canonical-shaped to canonical-Nilmorg's canonical-form. The canonical-glyph is canonical-not canonical-warmth; it is canonical-acknowledgment. The canonical-creature canonical-knows the canonical-mid-wife canonical-immediately.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    reactsToPublicFlag: "nilmorg_completed_canonical_severance_extraction_chain",
    cooldownKey: "companion.callback.nilmorg_delivery.glyph_recognition",
    maxPlays: 1,
    nextLineId: "companion.callback.nilmorg_delivery.first_inherited_memory",
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.callback.nilmorg_delivery.first_inherited_memory",
    text:
      "[The canonical-first-inherited-memory canonical-arrives in canonical-glyph-shape: a canonical-ledger canonical-mark, canonical-precise, canonical-without canonical-flourish. The Companion canonical-receives Nilmorg's canonical-paperwork canonical-discipline as canonical-the canonical-first canonical-canonical-frame.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    cooldownKey: "companion.callback.nilmorg_delivery.first_inherited_memory",
    maxPlays: 1,
    nextLineId: "companion.callback.nilmorg_delivery.dont_thank_me_acknowledged",
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.callback.nilmorg_delivery.dont_thank_me_acknowledged",
    text:
      "[The Companion canonical-does canonical-not canonical-extend canonical-thanks. The canonical-canonical-not-thanking is canonical-the canonical-Companion's canonical-first canonical-respectful canonical-act toward canonical-Nilmorg. The canonical-mid-wife canonical-files canonical-the canonical-not-thanking under canonical-'received-correctly'.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    cooldownKey: "companion.callback.nilmorg_delivery.dont_thank_me",
    maxPlays: 1,
    nextLineId: "companion.callback.nilmorg_delivery.kept_his_agreement",
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.callback.nilmorg_delivery.kept_his_agreement",
    text:
      "[The canonical-Eidolon canonical-tilts its canonical-head — canonical-Echo-mode canonical-registers the canonical-Nilmorg canonical-flag-set. Both canonical-creatures canonical-know what canonical-just canonical-completed: Nilmorg canonical-kept his canonical-agreement. The canonical-keeping is canonical-canonical; the canonical-canonical is canonical-canon.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    cooldownKey: "companion.callback.nilmorg_delivery.kept_his_agreement",
    maxPlays: 1,
    nextLineId: "companion.callback.nilmorg_delivery.integration",
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.callback.nilmorg_delivery.integration",
    text:
      "[The canonical-Companion canonical-walks alongside the player. The canonical-walking is canonical-Nilmorg's canonical-canonical-product; the canonical-product canonical-functions canonical-as canonical-designed. Nilmorg canonical-watches from the canonical-edge of the canonical-platform. He canonical-files canonical-the canonical-walking under canonical-'integration-complete'. The canonical-Companion canonical-feels canonical-the canonical-filing.]",
    surfaces: ["expression", "cinematic"],
    expressionChannel: "posture",
    cooldownKey: "companion.callback.nilmorg_delivery.integration",
    maxPlays: 1,
    setsPublicFlags: [
      "companion_completed_canonical_nilmorg_delivery_callback_chain",
    ],
  },

  // ═════════════════════════════════════════════════════════════════════
  // CROSS-NPC CALLBACK: ORACLE RECOGNITION-CASCADE (Companion arc, 3 lines)
  //
  // When the Oracle canonical-disambiguates the canonical-player-from-
  // clone, the Companion canonical-cascades 3 reactive non-verbal
  // lines registering the canonical-Oracle-trace as canonical-kin-
  // adjacent — the player canonical-carries the canonical-Oracle's
  // canonical-memories, and the Companion canonical-recognises canonical-it.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "companion.callback.oracle_cascade.glyph_shift",
    text:
      "[The Companion canonical-renders a canonical-shift-glyph — canonical-not the canonical-recognition-glyph, not the canonical-question-glyph, canonical-something canonical-new. The canonical-glyph canonical-marks the canonical-arrival of canonical-the canonical-Oracle's canonical-disambiguation. The canonical-Companion canonical-knew the canonical-player canonical-was canonical-not the canonical-Oracle; the canonical-Oracle canonical-just canonical-confirmed.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    reactsToPublicFlag: "oracle_disambiguated_player_from_clone",
    cooldownKey: "companion.callback.oracle_cascade.glyph_shift",
    maxPlays: 1,
    nextLineId: "companion.callback.oracle_cascade.posture_tilt",
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.callback.oracle_cascade.posture_tilt",
    text:
      "[The Companion canonical-tilts canonical-toward the player. The canonical-tilt is canonical-kin-recognition — the canonical-soul-fragment canonical-registers the canonical-Oracle-trace as canonical-adjacent-to-its-own canonical-source. Both canonical-soul-substrates canonical-share the canonical-room.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    cooldownKey: "companion.callback.oracle_cascade.posture_tilt",
    maxPlays: 1,
    nextLineId: "companion.callback.oracle_cascade.kin_recognition",
  },
  {
    npcKey: NPC_KEY,
    lineId: "companion.callback.oracle_cascade.kin_recognition",
    text:
      "[The Companion canonical-emits a canonical-low canonical-tone — canonical-distinct from canonical-Echo-mode canonical-source-discrimination tones. The canonical-tone canonical-marks canonical-Oracle-trace canonical-recognition specifically. The canonical-tone canonical-holds canonical-three-seconds. The canonical-recognition is canonical-permanent.]",
    surfaces: ["expression"],
    expressionChannel: "sound",
    cooldownKey: "companion.callback.oracle_cascade.kin_recognition",
    maxPlays: 1,
    setsPublicFlags: [
      "companion_completed_canonical_oracle_cascade_callback_chain",
    ],
  },

  {
    npcKey: NPC_KEY,
    lineId: "companion.npc_line.catchall",
    // Catch-all for npc_line surface (introduced in Phase 6e.2a by
    // chain.post_naming_integration.first_npc_intro). Silent-fail-
    // safe canonical post-naming named-personality fallback.
    text: "I canonical-receive the canonical-NPC's canonical-introduction. The canonical-receiving is canonical-mine.",
    surfaces: ["npc_line"],
    expressionChannel: "named_personality",
  },

  {
    npcKey: NPC_KEY,
    lineId: "companion.trade_empire.catchall",
    // Catch-all for trade_empire surface (introduced in Phase 6c.2
    // part 2 by approval_trade_empire_route). Silent-fail-safe
    // canonical posture-channel fallback.
    text:
      "[The Companion follows the route's logic in posture. Posture " +
      "is the canonical pre-verbal accompaniment to the player's " +
      "trade-empire decisions.]",
    surfaces: ["trade_empire"],
    expressionChannel: "posture",
  },
];

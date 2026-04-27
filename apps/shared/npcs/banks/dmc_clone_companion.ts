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
    setsPublicFlags: ["companion_first_word_was_you"],
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

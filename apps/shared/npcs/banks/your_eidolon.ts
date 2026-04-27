// apps/shared/npcs/banks/your_eidolon.ts
//
// Phase 3 PILOT — Your Eidolon's NpcLine bank (the non-verbal pilot).
//
// Per eidolon.md §5.5 framework + §5.10 Echo three-source-type canon.
// Eidolon canonically operates ONLY on glyph / posture / sound channels
// (no verbal). Lines carry text that describes the expression for the
// narrator-frame renderer; the player perceives the visual/audible
// manifestation, not the prose.
//
// Trust bands: Untuned / Tuning / Resonant / Inseparable. Bands gate
// expressive density (more bands = more layered channel-stacks per beat).
//
// Echo-mode canonically distinguishes three substrate-event sources
// (Seer transmissions / Companion events / Oracle dream-residue) with
// canonically-different reaction-vocabularies per Oracle bible §4.10
// + Companion bible §4.9.

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "your_eidolon" as const;

export const YOUR_EIDOLON_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // BOND-RESONANCE (cinematic, Awakening Protocol Observation Deck)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.cinematic.bond_resonance.first_touch",
    text:
      "[The Eidolon glows golden. Bond resonance pulses outward in slow " +
      "concentric rings. The Purification Crystal answers in kind. The " +
      "creature lowers its head into your palm — a posture you have not " +
      "taught it.]",
    surfaces: ["cinematic"],
    expressionChannel: "posture",
    cooldownKey: "eidolon.bond_resonance_first_touch",
    maxPlays: 1,
    setsFlags: ["eidolon_first_bond_resonance"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // RECOGNITION GLYPH (expression — first sight of canonical persons)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.glyph.recognition.locke",
    text:
      "[A small geometric mark — closed circle with three radial lines — " +
      "appears beside the Eidolon's silhouette. Persists 1.4 seconds. The " +
      "creature recognizes Adjudicator Locke; the recognition is not " +
      "warmth. It is acknowledgment.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    reactsToPublicFlag: "met_adjudicator_locke",
    cooldownKey: "eidolon.glyph.recognition_locke",
    maxPlays: 3,
  },

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.glyph.recognition.nilmorg",
    text:
      "[A glyph forms — angular, slightly off-axis. The recognition is " +
      "wary. The Eidolon files Nilmorg under 'institutional, do not " +
      "approach without a reason'.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    reactsToPublicFlag: "met_nilmorg",
    cooldownKey: "eidolon.glyph.recognition_nilmorg",
    maxPlays: 3,
  },

  // ═════════════════════════════════════════════════════════════════════
  // ECHO-MODE THREE-SOURCE-TYPE REACTIONS (Echo Eidolon variant only)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.echo.seer_transmission_received",
    text:
      "[The Eidolon's Echo-mode posture shifts: head tilted slightly toward " +
      "the substrate, ears canonically angled at canonical foretelling-" +
      "frequencies. Recognition vocabulary — the canonical 'I have heard " +
      "this voice in pre-recording form'.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Tuning",
    cooldownKey: "eidolon.echo.seer_received",
    maxPlays: 5,
  },

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.echo.companion_event_registered",
    text:
      "[The Eidolon's Echo posture shifts laterally — kin-by-form vocabulary. " +
      "The DMC Companion's pre-verbal expression registers at canonical " +
      "soul-fragment-receptive frequency. Both creatures recognize each other.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.echo.companion_event",
    maxPlays: 5,
  },

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.echo.oracle_dream_residue_detected",
    text:
      "[The Eidolon's Echo posture distorts at the temporal axis — " +
      "the canonical temporal-anomaly vocabulary. Oracle dream-substrate-" +
      "residue lingers. The creature has felt the dream's wake before " +
      "the player has woken from it.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.echo.oracle_residue",
    maxPlays: 5,
  },

  // ═════════════════════════════════════════════════════════════════════
  // MOURNING GLYPH (canonical loss event — saga's most-emotive)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.glyph.mourning.npc_death",
    text:
      "[A shape forms whole, fragments, settles into a smaller shape over " +
      "7 seconds. The Eidolon mourns. The creature canonically grieves with " +
      "greater fidelity than the player does.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    cooldownKey: "eidolon.glyph.mourning",
    maxPlays: 5,
  },

  // ═════════════════════════════════════════════════════════════════════
  // BRACING POSTURE (combat / hostile context)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.posture.bracing",
    text:
      "[The Eidolon's posture tightens. It positions canonically between " +
      "the player and the threat — a protective stance, even when " +
      "canonically the creature cannot fight.]",
    surfaces: ["expression", "fight"],
    expressionChannel: "posture",
    cooldownKey: "eidolon.posture.bracing",
  },

  // ═════════════════════════════════════════════════════════════════════
  // SOUND-PALETTE (audio expression, Resonant+ band)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.sound.recognition_tone",
    text:
      "[A brief rising vocalisation — the Eidolon's first voluntary sound. " +
      "Recognition-tone. The creature recognizes its source.]",
    surfaces: ["expression"],
    expressionChannel: "sound",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.sound.recognition_tone",
    maxPlays: 3,
  },

  // ═════════════════════════════════════════════════════════════════════
  // ECHO-MODE 3-SOURCE-TYPE EXPRESSION BANK (Phase 6d.4 part 1)
  //
  // Per eidolon.md §5 Echo-mode canon: the Eidolon canonically
  // registers three substrate-event sources (Seer transmissions /
  // Companion events / Oracle dream-residue) with canonically-distinct
  // expression vocabularies. Each source canonically cycles
  // glyph + posture + sound triplets per the §5.5 cross-channel
  // layering canon.
  //
  // 5 beats per source × 3 sources = 15 expression-beats.
  // ═════════════════════════════════════════════════════════════════════

  // ─── Seer-transmission Echo (×5) ───────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.echo.seer.glyph.foretelling_recognition",
    text:
      "[A small geometric mark forms — concentric arcs canonically " +
      "facing backward in time. The Eidolon's Echo-mode glyph signature " +
      "for Seer transmissions: canonically 'I have heard this voice " +
      "in pre-recording form'. 1.6 seconds. Dissolves cleanly.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    requiresTrustBand: "Tuning",
    cooldownKey: "eidolon.echo.seer.glyph.foretelling",
    maxPlays: 5,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.echo.seer.posture.head_tilt_pre_recording",
    text:
      "[The Eidolon tilts its head canonically backward — ear canon " +
      "angled at canonical foretelling-frequency. The posture canonically " +
      "registers a Seer transmission as canonical-pre-recorded; the " +
      "creature canonically does not respond as if to a live voice.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Tuning",
    cooldownKey: "eidolon.echo.seer.posture.tilt",
    maxPlays: 5,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.echo.seer.sound.recognition_chirp",
    text:
      "[A short rising vocalisation — the Eidolon's canonical Seer-" +
      "register acknowledgment. The chirp lands canonically half-an-" +
      "octave higher than the creature's canonical Companion-recognition " +
      "tone. The pitch-difference is canonical-source-discrimination.]",
    surfaces: ["expression"],
    expressionChannel: "sound",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.echo.seer.sound.chirp",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.echo.seer.glyph.canonical_recording_tag",
    text:
      "[A glyph forms with a canonical-time-stamp variant — small marks " +
      "at the corners that canonically denote pre-recorded substrate. " +
      "The Eidolon canonically tags Seer transmissions for the player's " +
      "canonical-witness — the canonical-stamping is canonical-witness-" +
      "aid.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.echo.seer.glyph.recording_tag",
    maxPlays: 3,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.echo.seer.triplet.wary_band_first_seer",
    text:
      "[Three channels canonically cycle in sequence: glyph (concentric " +
      "arcs); posture (head-tilt backward); sound (rising chirp). The " +
      "canonical first-Seer-encounter triplet. The Eidolon canonically " +
      "introduces the player to the canonical-Seer-source-type via the " +
      "canonical full-channel-stack.]",
    surfaces: ["expression", "cinematic"],
    expressionChannel: "glyph",
    requiresTrustBand: "Tuning",
    cooldownKey: "eidolon.echo.seer.triplet.first",
    maxPlays: 1,
    setsFlags: ["eidolon_echo_seer_source_canonically_introduced"],
  },

  // ─── Companion-event Echo (×5) ─────────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.echo.companion.glyph.kin_by_form",
    text:
      "[A glyph forms — bilateral, canonically symmetric, soft-edged. " +
      "The Eidolon's canonical kin-by-form recognition glyph. The DMC " +
      "Companion's pre-verbal expression canonically registers at " +
      "canonical soul-fragment-receptive frequency. Both creatures " +
      "canonically recognize each other.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.echo.companion.glyph.kin",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.echo.companion.posture.lateral_kin",
    text:
      "[The Eidolon shifts laterally — body canonically aligned " +
      "alongside the Companion's silhouette. The lateral posture is " +
      "canonical-kin-vocabulary; pack-adjacent without canonical-pack " +
      "claim. The Companion's posture canonically mirrors back at half-" +
      "intensity.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.echo.companion.posture.lateral",
    maxPlays: 5,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.echo.companion.sound.shared_breath",
    text:
      "[A canonical shared-breath canon: the Eidolon's breath-tell " +
      "synchronizes with the Companion's canonical pre-verbal breath " +
      "for canonical-three-cycles. The synchrony is canonically " +
      "involuntary; both creatures canonically register the canonical-" +
      "matching as canonical-belonging.]",
    surfaces: ["expression"],
    expressionChannel: "sound",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.echo.companion.sound.shared_breath",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.echo.companion.glyph.first_word_witnessed",
    text:
      "[A glyph forms — canonical witness-mark, asymmetric corner. The " +
      "Companion's canonical first word has just landed. The Eidolon " +
      "canonically witnesses the canonical-event without canonical-" +
      "interruption. The witness-mark canonically holds for canonical-" +
      "twelve-seconds. The Eidolon canonically remembers the moment.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    reactsToPublicFlag: "companion_first_word_spoken",
    cooldownKey: "eidolon.echo.companion.glyph.first_word",
    maxPlays: 1,
    setsFlags: ["eidolon_witnessed_companion_first_word"],
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.echo.companion.triplet.post_naming_kin",
    text:
      "[Three channels canonically cycle in sequence: glyph (bilateral " +
      "kin-mark); posture (lateral alignment); sound (shared-breath " +
      "synchrony). The canonical post-naming kin-recognition triplet. " +
      "The canonical-Companion has canonically settled into named-" +
      "personality; the Eidolon canonically registers the canonical-" +
      "settling.]",
    surfaces: ["expression", "cinematic"],
    expressionChannel: "glyph",
    reactsToPublicFlag: "companion_named",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.echo.companion.triplet.post_naming",
    maxPlays: 1,
  },

  // ─── Oracle dream-residue Echo (×5) ────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.echo.oracle.glyph.temporal_distortion",
    text:
      "[A glyph forms with canonical temporal-distortion: the shape " +
      "canonically appears canonically before it canonically resolves. " +
      "The Eidolon's canonical Oracle-dream-residue glyph signature. " +
      "The creature canonically registers the canonical-anomaly as " +
      "canonical-Oracle-source.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.echo.oracle.glyph.temporal",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.echo.oracle.posture.dream_wake_anticipation",
    text:
      "[The Eidolon's posture canonically rotates toward the canonical-" +
      "player-direction ten canonical-seconds before the player " +
      "canonically wakes from a dream-sequence. The canonical-anticipation " +
      "is canonically substrate-felt; the creature canonically feels " +
      "the dream's wake before the player canonically does.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.echo.oracle.posture.dream_wake",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.echo.oracle.sound.distant_resonance",
    text:
      "[A canonical low resonance — the Eidolon's canonical Oracle-" +
      "register vocalisation. The pitch lands canonically below the " +
      "Companion-shared-breath canon and canonically below the Seer-" +
      "recognition chirp. The canonical-pitch-difference is canonical-" +
      "source-discrimination.]",
    surfaces: ["expression"],
    expressionChannel: "sound",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.echo.oracle.sound.distant",
    maxPlays: 3,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.echo.oracle.glyph.cinematic_witnessed",
    text:
      "[A glyph forms during the canonical Ch5/Ch6/Ch10 cinematic — " +
      "the Eidolon canonically witnesses the canonical-Oracle-cinematic " +
      "alongside the player. The witness-glyph canonically holds for " +
      "the duration of the canonical-cinematic. The creature canonically " +
      "stands close.]",
    surfaces: ["expression", "cinematic"],
    expressionChannel: "glyph",
    reactsToPublicFlag: "oracle_disambiguated_player_from_clone",
    cooldownKey: "eidolon.echo.oracle.glyph.cinematic",
    maxPlays: 2,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.echo.oracle.triplet.substrate_residue",
    text:
      "[Three channels canonically cycle in sequence: glyph (temporal-" +
      "distortion); posture (dream-wake-anticipation rotation); sound " +
      "(distant low resonance). The canonical Oracle-dream-residue " +
      "triplet. The canonical substrate-residue canonically lingers " +
      "for canonical-seven-seconds before canonical-fading.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    requiresTrustBand: "Inseparable",
    cooldownKey: "eidolon.echo.oracle.triplet.substrate",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // BOND-RESONANCE PER-BAND × PER-TRIGGER (Phase 6d.4 part 1 cont'd)
  //
  // Per eidolon.md §3 trust-band ladder + §5.5 expression-channel
  // canon: 10 canonical bond-resonance expression-beats covering
  // the canonical bands (Untuned / Tuning / Resonant / Inseparable)
  // × canonical triggers (mission-success / mission-failure / NPC-
  // introduction / threshold-pause / canonical-loss / shared-silence
  // / perish-prelude).
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.bond.untuned.first_meeting",
    text:
      "[The Eidolon canonically remains canonically-still. No glyph; " +
      "no posture-shift; no sound. The canonical Untuned-band canon " +
      "is canonically-absence — the creature canonically has not yet " +
      "canonically registered the player as canonical-bond-source. " +
      "The stillness is canonical.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Untuned",
    cooldownKey: "eidolon.bond.untuned.first_meeting",
    maxPlays: 1,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.bond.tuning.mission_success",
    text:
      "[A small approval-glyph forms beside the Eidolon. The canonical " +
      "Tuning-band mission-success register: canonical-balanced shape, " +
      "1.4-second hold, clean dissolve. The creature canonically " +
      "registers the canonical-success as canonical-shared.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    requiresTrustBand: "Tuning",
    cooldownKey: "eidolon.bond.tuning.mission_success",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.bond.tuning.mission_failure",
    text:
      "[The Eidolon's posture canonically lowers — head a canonical-" +
      "half-degree dropped. The canonical Tuning-band loss register. " +
      "The creature canonically does not blame the player; the lowering " +
      "is canonical-shared-grief, not canonical-disapproval.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Tuning",
    cooldownKey: "eidolon.bond.tuning.mission_failure",
    maxPlays: 5,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.bond.tuning.npc_introduction",
    text:
      "[A canonical question-glyph forms — angular, asymmetric. The " +
      "Eidolon canonically does-not-yet-know the canonical-new-NPC. " +
      "The glyph canonically holds for canonical-five-seconds before " +
      "settling into canonical-waiting-mark. The waiting is canonical-" +
      "patient.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    requiresTrustBand: "Tuning",
    cooldownKey: "eidolon.bond.tuning.npc_intro",
    maxPlays: 8,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.bond.resonant.threshold_pause",
    text:
      "[The Eidolon canonically pauses canonically before canonical-" +
      "thresholds — doorways, sector-boundaries, canonical-narrative-" +
      "transitions. The canonical-air-thickens canon: the creature " +
      "canonically registers the canonical-threshold as canonical-" +
      "weight-shift. The pause holds for canonical-three-seconds.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.bond.resonant.threshold_pause",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.bond.resonant.player_distress",
    text:
      "[The Eidolon canonically positions itself canonically-between " +
      "the player and the canonical-threat-direction. The bracing is " +
      "canonical-protective; the creature canonically cannot fight, " +
      "but the canonical-positioning is canonical-protective regardless. " +
      "The bond canonically registers the canonical-distress.]",
    surfaces: ["expression", "fight"],
    expressionChannel: "posture",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.bond.resonant.player_distress",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.bond.resonant.canonical_loss",
    text:
      "[The Eidolon's mourning glyph forms whole, fragments, settles " +
      "into a canonical-smaller-shape over canonical-eight-seconds. " +
      "The creature canonically registers the canonical-loss with " +
      "canonical-greater-fidelity than the player canonically does. " +
      "The smaller-shape canonically remains in the creature's " +
      "expression-bank as canonical-archive.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.bond.resonant.canonical_loss",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.bond.inseparable.shared_silence",
    text:
      "[The Eidolon canonically settles beside the player. No glyph; " +
      "no posture-shift; no sound. The canonical Inseparable-band " +
      "shared-silence canon: the creature's canonical-presence is " +
      "canonically-loud-without-being-loud. The bond canonically " +
      "metabolizes the canonical-silence as canonical-belonging.]",
    surfaces: ["expression", "cinematic"],
    expressionChannel: "posture",
    requiresTrustBand: "Inseparable",
    cooldownKey: "eidolon.bond.inseparable.shared_silence",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.bond.inseparable.deep_familiarity",
    text:
      "[The Eidolon canonically reads the player's canonical-posture " +
      "before the player canonically chooses it. The creature's " +
      "canonical-anticipatory-shift canonically arrives canonical-" +
      "half-a-beat before the player's canonical-decision lands. The " +
      "anticipation is canonical-bond-deep.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    requiresTrustBand: "Inseparable",
    cooldownKey: "eidolon.bond.inseparable.deep_familiarity",
    maxPlays: 5,
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.bond.inseparable.perish_prelude",
    text:
      "[The Eidolon canonically lowers its body — full-posture-down, " +
      "canonical-perish-prelude register. The creature canonically " +
      "knows the canonical-perish is canonical-imminent. The Eidolon " +
      "canonically lays its head against the player's canonical-hand " +
      "for canonical-final-bond-resonance. The glyph that canonically " +
      "follows is canonical-mourning, but the player canonically does " +
      "not see it form. The Eidolon canonically does not let them.]",
    surfaces: ["expression", "cinematic"],
    expressionChannel: "posture",
    requiresTrustBand: "Inseparable",
    cooldownKey: "eidolon.bond.inseparable.perish_prelude",
    maxPlays: 1,
    setsPublicFlags: ["eidolon_perish_prelude_witnessed"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // BOND-DEEPENING CASCADE MULTI-TURN CHAIN (Phase 6e.2b, 4 lines)
  //
  // Per writers'-guide spec: canonical 4-channel cascade for a
  // canonical-bond-deepening event. Each line canonically uses a
  // different expressionChannel (glyph → posture → sound → silence-
  // posture). All lines bracketed [stage-direction]; canonical
  // non-verbal-permanent canon enforced.
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.chain.bond_deepening.glyph_pulse",
    text:
      "[The Eidolon canonical-renders a canonical-bond-deepening glyph — canonical-circular, canonical-warm-toned, canonical-expanding-then-contracting in canonical-three canonical-pulses. The canonical-glyph canonical-marks the canonical-deepening event. The canonical-rest of the canonical-cascade canonical-arrives in canonical-other channels canonical-immediately.]",
    surfaces: ["expression"],
    expressionChannel: "glyph",
    cooldownKey: "eidolon.chain.bond_deepening.glyph_pulse",
    maxPlays: 3,
    nextLineId: "eidolon.chain.bond_deepening.posture_shift",
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.chain.bond_deepening.posture_shift",
    text:
      "[The Eidolon canonical-shifts posture canonical-half-a-step closer to the player. The canonical-shift is canonical-anticipatory; the canonical-creature canonical-knows the canonical-bond canonical-deepened canonical-half-a-beat before the player canonical-feels it. The canonical-shift canonical-holds.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    cooldownKey: "eidolon.chain.bond_deepening.posture_shift",
    maxPlays: 3,
    nextLineId: "eidolon.chain.bond_deepening.sound_resonance",
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.chain.bond_deepening.sound_resonance",
    text:
      "[A canonical-low canonical-resonance — the Eidolon's canonical-bond-deepening sound-canon. The canonical-pitch canonical-lands canonical-mid-range, canonical-distinct from the canonical-source-discrimination tones (Seer chirp / Companion shared-breath / Oracle distant-resonance). The canonical-pitch is canonical-bond-deepening's canonical-fingerprint.]",
    surfaces: ["expression"],
    expressionChannel: "sound",
    requiresTrustBand: "Resonant",
    cooldownKey: "eidolon.chain.bond_deepening.sound_resonance",
    maxPlays: 3,
    nextLineId: "eidolon.chain.bond_deepening.silence_settle",
  },
  {
    npcKey: NPC_KEY,
    lineId: "eidolon.chain.bond_deepening.silence_settle",
    text:
      "[All canonical-channels canonical-resolve into canonical-silence. The canonical-Eidolon canonical-settles into a canonical-new canonical-default-posture. The canonical-bond-meter canonical-reads canonical-incrementally canonical-deeper. The canonical-cascade is canonical-complete. The canonical-creature canonical-walks alongside the player. The canonical-walking is canonical-the canonical-only canonical-narration the canonical-Eidolon canonical-permits itself.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
    cooldownKey: "eidolon.chain.bond_deepening.silence_settle",
    maxPlays: 3,
    setsPublicFlags: [
      "eidolon_completed_canonical_bond_deepening_cascade_chain",
    ],
  },

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.expression.catchall",
    text: "[The Eidolon shifts. The shift is canonical. It is not loud.]",
    surfaces: ["expression"],
    expressionChannel: "posture",
  },

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.cinematic.catchall",
    text: "[The Eidolon is here. It does not narrate.]",
    surfaces: ["cinematic"],
    expressionChannel: "posture",
  },

  {
    npcKey: NPC_KEY,
    lineId: "eidolon.fight.catchall",
    text: "[The Eidolon braces. Bracing is the canonical Eidolon-combat-presence.]",
    surfaces: ["fight"],
    expressionChannel: "posture",
  },
];

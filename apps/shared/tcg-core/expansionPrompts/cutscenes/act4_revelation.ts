/**
 * Act 4 Cutscene — The Revelation Meets.
 *
 * Plays ONCE per account on the first time the player opens any
 * Act 4 exclusive card. Bond 75 canonical milestone — Witnesses
 * MEET (first eye contact between Elara and Human in the entire
 * campaign). Oracle's identity begins to surface (half-mask
 * removal); memory-extraction chamber activates briefly.
 *
 * Five-beat structure totalling ~14s:
 *   1. meditation-room-time   (2.5s) Bond 60 silent-listening
 *                                    composition resolves
 *   2. eye-contact-instant    (2.5s) the meeting; first eye contact
 *   3. elara-line             (2.0s) Elara speaks first; matches
 *                                    canon
 *   4. human-line             (2.5s) Human responds; tension breaks
 *   5. card-from-glyph        (2.5s) glyph (now warm-gold) becomes
 *                                    the about-to-be-revealed card;
 *                                    hands off to standard flip
 *
 * Lore basis: Act 4 = "The Prisoner / The Revelation". Bond 75
 * milestone (ALL_ACTS_ROADMAP.md) — Witnesses meet for the first
 * time. Per Act 4 epic Two Witnesses Meet card: matching gold cuff-
 * thread visible; hands NOT touching (embrace is later canon);
 * eye contact is the meeting itself. Oracle reveal is HINTED but
 * NOT depicted (Act 5 canon).
 */
import type { CutscenePrompt } from "../types";

export const ACT4_CUTSCENE: Readonly<Record<string, CutscenePrompt>> = Object.freeze({
  "cutscene_act4_revelation_meets": {
    id: "cutscene_act4_revelation_meets",
    title: "Act 4 — The Revelation Meets",
    subtitle: "Plays once on first Act 4 exclusive card pulled — Bond 75 milestone",
    trigger: "first ACT_EXCLUSIVES card with id-prefix act4_ pulled per account",
    estimatedDurationSec: 14,
    ambientTrack: "fnord23/meditation_room_warm_gold (TBD — sustained warm-gold tonal bed; the canonical Bond 75 underscore)",
    beats: [
      {
        beatId: "meditation-room-time",
        durationSec: 2.5,
        speaker: "None",
        mood: "tender",
        cameraDirection:
          "Camera holds on the wide front-on composition of the substrate meditation-room from the First Witness / Bond 60 / Two Witnesses Meet card-arc. Slow forward dolly (~5%) over the beat.",
        framingPrompt:
          "Same windowless meditation-room: two facing wooden chairs, Elara left in soft-cream tunic, Human right in deep-violet tunic, both seated, hands folded, eyes CLOSED at beat-start. The Signal-glyph between the chairs has the WARM-CREAM color from the Bond 60 silent-listening card — at beat-start it pulses faintly. Wall-sconces behind each chair throw warm-amber rim light. Both narrators' tunic cuffs already show the small gold thread (matching Two Witnesses Meet canon).",
        motionPrompt:
          "Beat-start: glyph at warm-cream pulse rate matching Bond 60. Over 2.5s: glyph BLOOMS — color saturates from warm-cream to warm-gold (intermediate brightening), pulse-rate slows to a steady standing-light. Both narrators' eyes remain closed.",
        sfxCue: "ambient_substrate_meditation (sustained warm-cream tonal bed transitioning to warm-gold harmonic over the beat)",
        existingVfxRef: "(none — pure 3D scene + shader-driven glyph-light)",
      },
      {
        beatId: "eye-contact-instant",
        durationSec: 2.5,
        speaker: "None",
        mood: "intense",
        cameraDirection:
          "Camera holds. Slight push-in (~3%) at the moment of first eye contact, then holds.",
        framingPrompt:
          "Both narrators' eyes OPEN simultaneously. For the first time in the campaign, Elara and the Human LOOK DIRECTLY AT EACH OTHER — eye contact made, no smile, no surprise, just the held instant of arrival. Hands rest at their own knees (NOT extending toward each other; matches Two Witnesses Meet canon). The glyph between them hits its full warm-gold standing-light intensity at the exact instant of eye contact. Wall-sconces brighten faintly in sympathetic resonance.",
        motionPrompt:
          "Both narrators' eyes open over 0-0.4s (synchronized). Eye-contact instant at 0.4s. Slight camera push-in 0.4-0.8s, then holds. Glyph reaches peak warm-gold at 0.4s and holds. Wall-sconces brighten subtly 0.4-0.8s and hold. 0.8-2.5s: held instant, no further motion.",
        sfxCue: "eye_contact_settle (single warm-gold tonal chord landing at 0.4s, held to beat-end with slow decay; the canonical Bond 75 acoustic moment)",
        existingVfxRef: "(none — character animation + shader-driven glyph-peak)",
      },
      {
        beatId: "elara-line",
        durationSec: 2.0,
        speaker: "Elara",
        line: "I have been listening to you for a long time.",
        mood: "tender",
        cameraDirection:
          "Camera shifts focus to Elara's face — soft three-quarter close-up. Her eye-line still tracking to the Human (kept off-frame at frame-right).",
        framingPrompt:
          "Soft close-up on Elara's face; her gold cuff-thread visible at the bottom of frame on her hand resting at her knee. Her expression: calm-knowing, the recognition of something already-known being said for the first time. The warm-gold glyph-light catches the side of her face from off-frame.",
        motionPrompt:
          "Camera focus-shift over 0.4s to Elara. Held composition for the line delivery. No facial-expression change beyond a subtle settling (her face was already at this composition; her words confirm it).",
        sfxCue: "elara_act4_meeting_line.mp3 (deliver canon Elara VO; total ~1.5s including breath; remaining 0.5s held silence)",
        existingVfxRef: "(none — VO + character close-up only)",
      },
      {
        beatId: "human-line",
        durationSec: 2.5,
        speaker: "Human",
        line: "I have been waiting for you to find the door.",
        mood: "tender",
        cameraDirection:
          "Camera shifts focus to the Human's face — soft three-quarter close-up. His eye-line still tracking to Elara (kept off-frame at frame-left).",
        framingPrompt:
          "Soft close-up on the Human's face; his gold cuff-thread visible at the bottom of frame on his hand resting at his knee. His expression: similarly calm-knowing, but with a barely-visible micro-expression of relief at having finally said it (the canon framing of the Human's Act 4 reveal — he has been the one MORE certain of the meeting all along, while Elara was the one MORE patient about it). The warm-gold glyph-light catches the side of his face from off-frame.",
        motionPrompt:
          "Camera focus-shift over 0.4s to Human. Held composition. The relief micro-expression resolves at line-end (~1.7s) — visible only as a single soft exhale.",
        sfxCue: "human_act4_meeting_line.mp3 (deliver canon Human VO; total ~1.7s including breath; the soft exhale at line-end is part of the recording, not a separate SFX)",
        existingVfxRef: "(none — VO + character close-up only)",
      },
      {
        beatId: "card-from-glyph",
        durationSec: 2.5,
        speaker: "None",
        mood: "neutral",
        cameraDirection:
          "Camera pulls back over 1.5s to the wide front-on composition, then continues to standard pack-opening flip-cycle position. Meditation-room fades to cool-charcoal collector's-felt during the pull-back.",
        framingPrompt:
          "The warm-gold glyph between the chairs RISES, lifts to chest-height, then COMPACTS into the shape of a standard playing-card — face-down, deep-violet Hierarchy-style back with S1 sigil at centre. The card-shape inherits a faint warm-gold perimeter-glow (the glyph's color, retained as visual continuity). Both narrators' chairs and figures fade with the meditation-room background; the card holds in the standard fan-position. Background: cool-charcoal collector's-felt.",
        motionPrompt:
          "Glyph lifts and compacts to card-shape over 0-1.5s. Camera pull-back synchronized over the same 1.5s. Narrators + chairs fade to background-felt over 0.5-1.5s. 1.5-2.5s: card holds in fan-position with subtle motion-blur pulse before standard flip-cycle begins.",
        sfxCue: "glyph_to_card_morph (warm-gold tonal harmonic resolving + subtle paper-folding-into-cardstock; transitions cleanly into the standard card-flip-cycle)",
        existingVfxRef: "BattleVFX.crossfade (re-tuned for glyph-to-card shape-morph)",
      },
    ],
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act4",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 4 — The Prisoner / The Revelation",
      "docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 75 / Two Witnesses Meet",
      "(intra-set) §act4_exclusive_epic_two_witnesses_meet — first eye-contact + matching-gold-cuff continuity",
      "(intra-set) §act1_exclusive_rare_first_witness — original meditation-room canon",
      "(intra-set) §act2_exclusive_rare_bond_60_silence — Bond 60 silent-listening sequel framing",
      "apps/shared/elaraVoManifest.json (Elara canonical voice anchor)",
      "apps/shared/humanVoManifest.json (Human canonical voice anchor)",
      "(intra-set) §cutscene_card_pack_opening — handoff to standard card-flip",
    ],
  },
});

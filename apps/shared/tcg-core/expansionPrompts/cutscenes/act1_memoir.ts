/**
 * Act 1 Cutscene — The Memoir Opens.
 *
 * Plays ONCE per account on the first time the player opens any
 * Act 1 exclusive card from a pack. The cutscene precedes the
 * standard card-flip ceremony for that one card; afterward Act 1
 * cards flip with the standard rarity-gated flow.
 *
 * Lore basis: Act 1 = "The Twelve Steps / The Signal" (narrative
 * Acts.ts Act 1, ALL_ACTS_ROADMAP.md Act 1 framing). The cutscene
 * frames the player's first Act 1 card as the moment they
 * "begin to listen" — the substrate-layer reaches up briefly to
 * acknowledge the Memoirist before retreating.
 *
 * Four-beat structure totalling ~10s. NO spoken lines (Act 1
 * canon is silent listening; the spoken-narrator framing
 * unlocks at Act 2).
 */
import type { CutscenePrompt } from "../types";

export const ACT1_CUTSCENE: Readonly<Record<string, CutscenePrompt>> = Object.freeze({
  "cutscene_act1_memoir_opens": {
    id: "cutscene_act1_memoir_opens",
    title: "Act 1 — The Memoir Opens",
    subtitle: "Plays once on first Act 1 exclusive card pulled",
    trigger: "first ACT_EXCLUSIVES card with id-prefix act1_ pulled per account",
    estimatedDurationSec: 10,
    ambientTrack: "fnord23/substrate_signal_emerging (TBD — three-note Signal motif as faint underlay)",
    beats: [
      {
        beatId: "static-into-stillness",
        durationSec: 2.5,
        speaker: "None",
        mood: "mysterious",
        cameraDirection:
          "Camera holds wide on the substrate-static field at frame-centre. No movement.",
        framingPrompt:
          "The Substrate Static field from the Act 1 rare card — fine cool-grey particles drifting, three faint cool-cyan carrier-threads barely visible, single obsidian three-note stone at lower-third. Beat begins with the field at FULL static density (slightly denser than the Act 1 card art). Over 2.5s the static gradually CLEARS toward the centre of the frame, leaving a small clear circle of warm-cream calm at frame-centre. The carrier-threads remain.",
        motionPrompt:
          "Static density gradient: 100% at edges, fading to 20% at centre over the beat. The clear circle expands smoothly outward from frame-centre. No camera movement.",
        sfxCue: "substrate_hum (low rolling cool-grey static-noise) decreasing by ~6dB over 2.5s as the centre clears + faint three-note motif emerging at 1.8s",
        existingVfxRef: "BattleVFX.particleEmitter (re-tuned for cool-grey substrate-static)",
      },
      {
        beatId: "stone-rises",
        durationSec: 2.5,
        speaker: "None",
        mood: "mysterious",
        cameraDirection:
          "Camera tilts down slowly to center on the obsidian three-note stone in the lower-third of frame. Over 2.5s the camera tilts from neutral to a gentle 15° downward angle.",
        framingPrompt:
          "The obsidian three-note stone from the Substrate Static card. The stone now LIFTS slightly off its unseen surface — hovering ~5cm above its resting position. The three-note glyph etched on its upper face glows from faint warm-amber to bright cool-cyan as the stone lifts. The clear-cream circle from beat 1 surrounds the stone.",
        motionPrompt:
          "Stone lifts slowly, ease-in-out (0-1.5s), hovers (1.5-2.5s). Three-note glyph brightens from amber to cyan over the lift. Camera tilts down 15° over the full beat.",
        sfxCue: "stone_lift (subtle low-frequency rumble + faint chime when the glyph reaches peak cyan brightness at 1.5s)",
        existingVfxRef: "(none — geometric stone + shader-driven glyph-glow)",
      },
      {
        beatId: "memoir-page-fades-in",
        durationSec: 3.0,
        speaker: "None",
        mood: "tender",
        cameraDirection:
          "Camera holds at the 15° downward angle. The stone remains in lower-third frame.",
        framingPrompt:
          "Above the hovering stone, a translucent Memoir-page begins to fade in at the camera-plane — facing toward the viewer. The page is blank at fade-in start, then the FIRST LINE of handwritten Memoirist text appears in deep-violet ink, character by character (typewriter-style reveal). The line reads exactly: 'I was always listening — I had only just begun to hear.' Page is rendered as substrate-paper (slightly translucent, edges fading into the substrate field). The carrier-threads from beat 1 remain faintly visible behind the page.",
        motionPrompt:
          "Page fades in over 0-0.8s. Text reveal: character-by-character at ~12 chars/sec from 0.8s to 2.5s. Final 0.5s: page held complete, the deep-violet ink darkens slightly into final readable saturation.",
        sfxCue: "page_fade (subtle paper-rustle) + per-character ink-stroke (very faint, like a quill on parchment, layered at 12 chars/sec)",
        existingVfxRef: "(none — text-render + substrate-paper shader)",
      },
      {
        beatId: "page-becomes-card",
        durationSec: 2.0,
        speaker: "None",
        mood: "neutral",
        cameraDirection:
          "Camera pulls back over 1.5s and rotates upright (0° tilt) as the page transforms. Final position: standard pack-opening flip-cycle camera position, centered on the about-to-be-revealed card.",
        framingPrompt:
          "The translucent Memoir-page COMPACTS — its width narrows, its height stretches — and over 1.5s morphs into the shape of a standard playing card. Simultaneously, the card's back rotates toward the viewer, ending the cutscene with the standard face-down Hierarchy-style card-back (deep-violet with S1 sigil) at the standard fan-position. The handwritten text fades INTO the card during the morph (the text becomes the card's flavor-text, encoded into the about-to-be-flipped card). The substrate background fades to cool-charcoal collector's-felt.",
        motionPrompt:
          "Page compacts to card shape over 1.5s with smooth ease-in-out. Camera pull-back + rotate-upright simultaneously. Final 0.5s: card holds in standard fan position, slightly trembling once (a single small motion-blur pulse) before the standard card-flip ceremony begins.",
        sfxCue: "morph_settle (subtle Mylar-paper-folding-into-cardstock sound; transitions cleanly into the standard card-flip-cycle's per-card SFX which begins immediately after this beat ends)",
        existingVfxRef: "BattleVFX.crossfade (re-tuned for paper-to-card morph)",
      },
    ],
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act1",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 1 — The Twelve Steps / The Signal",
      "(intra-set) §act1_exclusive_mythic_the_signal — three-note Signal motif",
      "(intra-set) §act1_exclusive_rare_substrate_static — substrate-field framing source",
      "(intra-set) §cutscene_card_pack_opening — handoff to standard card-flip",
    ],
  },
});

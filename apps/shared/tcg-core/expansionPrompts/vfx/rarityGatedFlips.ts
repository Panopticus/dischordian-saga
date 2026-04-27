/**
 * Rarity-Gated Pack-Flip Ceremonies (7 VFX assets).
 *
 * One VFX entry per rarity tier. Triggered per-card during the
 * card-pack-opening cutscene's flip-cycle beat (cardPackOpening.ts
 * beat 5). Each ceremony scales with rarity: common is fast and
 * subtle; neyon is the longest, most intense, with chromatic-
 * aberration shader work.
 *
 * Output spec is locked to the prelude pipeline per
 * prelude-asset-build/prompts/vfx/README.md:
 *   1920×1080 / VP9/WebM α / 30fps
 *
 * Re-use targets: BattleVFX (ScreenFlash, ScreenShake,
 * particleEmitter), RewardCelebration (particleBurst tiers).
 * Where the existing primitive matches the rarity's needs, the
 * existingPrimitives field lists it; where new shader work is
 * required (notably neyon's chromatic-aberration), the entry
 * documents the gap.
 */
import type { VfxPrompt } from "../types";
import { VFX_OUTPUT_LOCKED } from "../types";

export const RARITY_FLIP_VFX: Readonly<Record<string, VfxPrompt>> = Object.freeze({
  "vfx_pack_flip_common": {
    id: "vfx_pack_flip_common",
    trigger: "card flip in pack-opening flip-cycle, rarity === 'common'",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 0.5,
    startFramePrompt:
      "Card mid-flip at the 90° rotation point — face-edge of the card visible across the screen, the deep-violet card-back just having departed from view. Background: cool-charcoal collector's-felt. Single soft warm-amber down-light. NO particle effects.",
    endFramePrompt:
      "Card fully face-up, settled in fan-position. A faint pale-cream shimmer-line travels left-to-right across the card surface. Card-face shows whatever the actual common card art is (dynamic content). Shimmer-line at ~40% complete crossing.",
    motionPrompt:
      "Quick sharp flip: card rotates 180° on horizontal axis over 0.2s with snappy ease-out. 0.2-0.4s: card holds face-up; pale-cream shimmer-line travels left-to-right. 0.4-0.5s: shimmer fades. No screen-flash, no particles, no shake.",
    sfxCue: "card_flip_quick.mp3 (sharp cardstock-flip sound; total 0.2s including a small landing-thud at flip-completion)",
    existingPrimitives: [
      "(none — pure 3D card-mesh flip; the pale-cream shimmer is shader-driven and built into the card material rather than a separate VFX primitive)",
    ],
    loreCitations: [
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §Pack-opening fidelity = LAUNCH-CRITICAL",
      "(intra-set) §cutscene_card_pack_opening — flip-cycle beat 5 (common ceremony budget)",
    ],
  },

  "vfx_pack_flip_uncommon": {
    id: "vfx_pack_flip_uncommon",
    trigger: "card flip in pack-opening flip-cycle, rarity === 'uncommon'",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 0.7,
    startFramePrompt:
      "Card mid-flip at the 90° rotation point — face-edge visible across the screen. Faint silver-blue particle pre-cloud forming around the card's edge.",
    endFramePrompt:
      "Card fully face-up. Silver-blue shimmer wave travels diagonally across the card-face from upper-left to lower-right. Faint silver-blue particle cloud (~30 particles) drifts upward from the card's lower edge.",
    motionPrompt:
      "Standard flip: 180° rotation over 0.25s with ease-out. 0.25-0.5s: silver-blue shimmer wave traverses diagonally; 30 small silver-blue particles emit from the card's lower edge and drift upward with slight outward divergence. 0.5-0.7s: shimmer fades, particles continue rising and dissipate.",
    sfxCue: "card_flip_silver.mp3 (cardstock-flip + faint silver-tonal tinkle layered over the landing-thud; total 0.7s)",
    existingPrimitives: [
      "BattleVFX.particleEmitter (re-tuned for silver-blue particles, low count, upward-drift)",
    ],
    loreCitations: [
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §Pack-opening fidelity",
      "(intra-set) §cutscene_card_pack_opening — flip-cycle beat 5 (uncommon ceremony budget)",
    ],
  },

  "vfx_pack_flip_rare": {
    id: "vfx_pack_flip_rare",
    trigger: "card flip in pack-opening flip-cycle, rarity === 'rare'",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 1.0,
    startFramePrompt:
      "Card mid-flip at 90° rotation. Faint cool-cyan glow halo formed around the card's perimeter, ~20% intensity.",
    endFramePrompt:
      "Card fully face-up with full cool-cyan foil-shimmer pulse on its surface (single bright pulse). Halo at ~80% intensity around the card's perimeter. ~50 cool-cyan particle-fragments drift upward from card-lower-edge.",
    motionPrompt:
      "Flip: 180° over 0.3s with ease-out. 0.3-0.7s: foil-shimmer pulse blooms across the card-face (single shimmering wave traveling left-to-right then fading); halo intensifies to peak at 0.5s; 50 cool-cyan particles emit and drift upward. 0.7-1.0s: halo fades, particles dissipate, foil settles to baseline.",
    sfxCue: "card_flip_foil_shimmer.mp3 (cardstock-flip + foil-shimmer chord landing at flip-completion + soft particle-tinkle; total 1.0s)",
    existingPrimitives: [
      "BattleVFX.particleEmitter (cool-cyan particles, medium count)",
      "RewardCelebration.shimmerPulse (re-tuned for foil-shimmer wave on card-surface)",
    ],
    loreCitations: [
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §Pack-opening fidelity",
      "(intra-set) §cutscene_card_pack_opening — flip-cycle beat 5 (rare ceremony budget)",
    ],
  },

  "vfx_pack_flip_epic": {
    id: "vfx_pack_flip_epic",
    trigger: "card flip in pack-opening flip-cycle, rarity === 'epic'",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 1.4,
    startFramePrompt:
      "Card mid-flip at 90° rotation. Deep-violet glow halo at ~30% intensity around perimeter; small spark-emitter ready at the card's upper-left and lower-right corners.",
    endFramePrompt:
      "Card fully face-up. Deep-violet halo at peak. ~12 small bright sparks (yellow-white) burst outward from upper-left and lower-right corners in radial sprays. Brief stinger-flash on card-face surface.",
    motionPrompt:
      "Flip: 180° over 0.3s with ease-out. 0.3-0.6s: 12 sparks burst from each of two corner-emitters in radial sprays, traveling outward 30-50 pixels then fading; deep-violet halo intensifies to peak at 0.5s; brief stinger-flash on card-face at 0.5s (single 80ms white pulse). 0.6-1.4s: halo decays slowly, particle sparks fully dissipate.",
    sfxCue: "card_flip_sparks.mp3 + epic_stinger.mp3 (cardstock-flip + bright spark-burst hiss + brief tonal stinger chord; total 1.4s)",
    existingPrimitives: [
      "BattleVFX.particleEmitter (sparks, dual-emitter at corners)",
      "BattleVFX.ScreenFlash (50ms white, 20% intensity for stinger)",
      "RewardCelebration.tier2 (deep-violet halo)",
    ],
    loreCitations: [
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §Pack-opening fidelity",
      "(intra-set) §cutscene_card_pack_opening — flip-cycle beat 5 (epic ceremony budget)",
    ],
  },

  "vfx_pack_flip_legendary": {
    id: "vfx_pack_flip_legendary",
    trigger: "card flip in pack-opening flip-cycle, rarity === 'legendary'",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 2.0,
    startFramePrompt:
      "Card mid-flip at 90° rotation. Warm-gold glow halo intensifying at ~50%; brass-fanfare visual marker — a slim warm-gold curl-flourish — beginning to render at frame's upper-frame edge.",
    endFramePrompt:
      "Card fully face-up. Warm-gold halo at peak intensity, fully encircling the card. ~80 warm-gold particle motes drift upward from card-edges. A horizontal screen-flash band at 30% intensity sweeps across the screen at the moment of flip-landing. The slim warm-gold curl-flourish has unfurled across the upper edge of the frame.",
    motionPrompt:
      "Flip: 180° over 0.4s with strong ease-out. 0.4s: screen-flash band sweeps horizontally across the full frame (warm-gold, 30% intensity, 200ms duration). 0.4-0.8s: warm-gold halo blooms to peak; 80 particles emit from card-edges and drift upward with slight outward divergence; the warm-gold curl-flourish unfurls across the upper-frame edge. 0.8-2.0s: halo decays slowly, particles dissipate, flourish lingers and fades.",
    sfxCue: "card_flip_legendary.mp3 + brass_fanfare.mp3 (cardstock-flip + 1.2s warm brass-fanfare flourish; total 2.0s)",
    existingPrimitives: [
      "BattleVFX.ScreenFlash (warm-gold horizontal band, 30% intensity, 200ms)",
      "BattleVFX.particleEmitter (warm-gold motes, high count)",
      "RewardCelebration.tier3 (warm-gold halo + flourish)",
    ],
    loreCitations: [
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §Pack-opening fidelity",
      "(intra-set) §cutscene_card_pack_opening — flip-cycle beat 5 (legendary ceremony budget)",
    ],
  },

  "vfx_pack_flip_mythic": {
    id: "vfx_pack_flip_mythic",
    trigger: "card flip in pack-opening flip-cycle, rarity === 'mythic'",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 2.5,
    startFramePrompt:
      "Card mid-flip at 90° rotation. Deep-crimson glow halo intensifying at ~60%; a faint vertical bar of darker red light forming behind the card (the mythic 'altar-light' signature).",
    endFramePrompt:
      "Card fully face-up. Deep-crimson halo at full peak. The vertical altar-light bar behind the card is fully formed (a tall warm-crimson glow column). Sparks-cascade visible across upper third of frame (~120 small sparks raining downward). Screen at slight angular offset (mid-shake). Camera at 30% horizontal screen-shake displacement.",
    motionPrompt:
      "Flip: 180° over 0.4s. 0.4s: screen-shake begins (low-rumble, 30% horizontal displacement, low-frequency 8Hz, total 0.6s with decay). 0.4-1.0s: deep-crimson halo blooms to peak; altar-light bar rises behind card; 120 small sparks cascade from above into the frame; choral 'AH' tonal harmonic peaks at 0.8s. 1.0-2.5s: halo + altar-light decay, sparks continue raining and gradually thin out, screen-shake decays to zero by 1.0s.",
    sfxCue: "card_flip_mythic.mp3 + choral_ah.mp3 + screen_shake_low_rumble.mp3 (cardstock-flip + sustained choral 'AH' harmonic + low sub-bass rumble; total 2.5s)",
    existingPrimitives: [
      "BattleVFX.ScreenShake (low-rumble, 30% intensity, 0.6s decay)",
      "BattleVFX.particleEmitter (sparks-cascade from above, high count)",
      "RewardCelebration.tier4 (deep-crimson halo + altar-light bar — note: altar-light may need new shader work)",
    ],
    loreCitations: [
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §Pack-opening fidelity (mythic-tier ceremony spec)",
      "(intra-set) §cutscene_card_pack_opening — flip-cycle beat 5 (mythic ceremony budget)",
    ],
  },

  "vfx_pack_flip_neyon": {
    id: "vfx_pack_flip_neyon",
    trigger: "card flip in pack-opening flip-cycle, rarity === 'neyon'",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 3.0,
    startFramePrompt:
      "Card mid-flip at 90° rotation. The card-flip is visibly running at HALF SPEED compared to other ceremonies (the neyon canon: time slightly distorts when neyon-tier emerges). Chromatic-aberration shader effect already faintly visible on the card-edge — RGB channels separating by ~3 pixels horizontally.",
    endFramePrompt:
      "Card fully face-up. Chromatic-aberration shader at peak — RGB channel separation up to 12 pixels around the card, with continuous shifting offsets. Card surface peaks at maximum foil-shader saturation (the canonical neyon look: every color reads at maximum chroma simultaneously, creating a 'perfectly-impossible' color sensation). Card emits warm-white-gold light that catches and brightens the surrounding scene — the fan of other cards visible at frame-edges, the collector's-felt background, all subtly lit by the neyon card itself. ~50 cool-and-warm aurora-like ribbons drift across the upper half of frame.",
    motionPrompt:
      "Flip: 180° over 0.6s (half-speed compared to other tiers; the neyon canon time-distortion). 0.6s: chromatic-aberration peaks; foil-shader saturation peaks. 0.6-2.0s: aurora ribbons drift across upper half of frame; the card's emit-light continues; chromatic-aberration shifts and pulses (RGB channels offset varies between 3 and 12 pixels in a slow fluid pattern). 2.0-3.0s: chromatic-aberration decays smoothly to zero; foil-shader settles to standard saturation; emit-light fades; aurora ribbons fade.",
    sfxCue: "card_flip_neyon.mp3 + chromatic_aberration_whisper.mp3 (cardstock-flip rendered at half-speed + sustained ethereal whisper-chord with chromatic-aberration in the audio itself — voices slightly out-of-phase from each other; total 3.0s)",
    existingPrimitives: [
      "BattleVFX.particleEmitter (aurora ribbons — note: requires new ribbon-particle shape, NOT existing point-particles)",
      "(NEW PRIMITIVE REQUIRED) — chromatic-aberration shader: client-side WebGL post-process effect that splits RGB channels by configurable pixel offset. This must be authored as new client primitive in apps/client/src/components/prelude/vfx/ (suggested name: ChromaticAberration.tsx). The neyon ceremony is the launch-critical use of this shader.",
      "(NEW PRIMITIVE REQUIRED) — emit-light bridge: a shader that allows the card-mesh to throw colored light onto the surrounding 3D scene (other cards, felt background). This must be authored as new client primitive (suggested name: NeyonEmitLight.tsx).",
    ],
    loreCitations: [
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §Pack-opening fidelity (neyon-tier ceremony spec — chromatic-aberration + emit-light required as new client primitives)",
      "(intra-set) §cutscene_card_pack_opening — flip-cycle beat 5 (neyon ceremony budget — longest of all tiers)",
    ],
  },
});

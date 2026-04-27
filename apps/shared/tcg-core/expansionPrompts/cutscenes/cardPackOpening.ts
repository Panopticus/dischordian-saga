/**
 * Card Pack Opening — canonical cinematic.
 *
 * Per the 2026-04-27 user directive: the pack-opening cinematic
 * must replicate the real-world physical card-pack-opening
 * experience as closely as possible. Foil tear, finger-fan reveal,
 * cardstock-on-cardstock landings, rarity-gated ceremonies. This
 * is the SINGLE canonical pack-open flow that replaces both
 * existing implementations (PackOpening.tsx + DemonPackPage.tsx).
 *
 * Six-beat structure totalling ~12s for a baseline 5-card pack:
 *   1. preroll       (1.5s)  pack hovers, 35° tilt, rotation-loop
 *   2. tension       (2.5s)  particle storm + ambient hum builds
 *   3. crack         (0.4s)  foil tear; sharp scrape + reverb tail
 *   4. fan-reveal    (2.0s)  5 cards arc out in finger-fan
 *   5. flip-cycle    (3-7s)  rarity-gated per-card flip ceremonies
 *   6. summary       (2.0s)  totals, pity counter, celebrate-or-meh
 *
 * Total minimum: 12s. Mythic/neyon pull extends flip-cycle by up to
 * 4s for the ceremony. Beats 5+6 dynamically scale by pack contents.
 *
 * Lore basis: this cutscene is engine-level (no canon lore figure
 * appears), so the framing draws from the production-book pattern
 * rather than the campaign canon. The pack itself is generic
 * Memoir-Booster-style packaging unless the SKU specifies otherwise.
 */
import type { CutscenePrompt } from "../types";

export const CARD_PACK_OPENING_CUTSCENE: Readonly<Record<string, CutscenePrompt>> = Object.freeze({
  "cutscene_card_pack_opening": {
    id: "cutscene_card_pack_opening",
    title: "Card Pack Opening (Canonical Cinematic)",
    subtitle: "Six-beat real-world-fidelity flow for every pack SKU",
    trigger: "purchase fulfillment OR inventory pack-open OR reward-grant pack",
    estimatedDurationSec: 12,
    ambientTrack: "fnord23/pack_open_ambient_hum (TBD — to be added to fnord23 registry)",
    beats: [
      {
        beatId: "preroll",
        durationSec: 1.5,
        speaker: "None",
        mood: "neutral",
        cameraDirection:
          "Slow orbit-rotation around the pack's vertical axis at constant slow speed (one full rotation over 6s, so the preroll shows ~25% of a rotation).",
        framingPrompt:
          "Centered three-quarter close-up on a sealed Memoir-Booster card-pack held mid-air at 35° forward tilt (matching how a real-world player holds a pack just before opening). Pack design: deep-violet foil with Hierarchy-style branding on the front, faint embossed S1_MEMOIR mark at lower edge. Background: soft warm-amber bokeh — out-of-focus collector's-table light. The pack catches a single specular highlight along its left edge that travels slowly with the rotation.",
        motionPrompt:
          "Slow rotation-loop on vertical axis. The pack tilts forward 35° and stays at that tilt; the rotation reveals each face of the pack progressively. No acceleration, no easing — constant rate. Specular highlight travels along the front edge as the pack rotates.",
        sfxCue: "ambient_hum_low (subtle 80Hz drone, constant)",
        existingVfxRef: "(none — pure 3D card mesh + lighting)",
      },
      {
        beatId: "tension",
        durationSec: 2.5,
        speaker: "None",
        mood: "intense",
        cameraDirection:
          "Camera holds position; pack rotation continues at preroll speed. A subtle in-frame zoom (5%) over the 2.5s pulls the viewer slightly closer to the pack.",
        framingPrompt:
          "Same pack composition as preroll. Now: a slow particle-storm of small cool-cyan glyph-fragments (Hierarchy crest fragments + S1 sigil fragments) materializes around the pack's perimeter, drifting inward toward the pack's surface like iron filings finding a magnet. The bokeh background warms slightly (warm-amber → warm-gold). The specular highlight on the pack edge brightens by ~15%.",
        motionPrompt:
          "Particle storm builds: ~50 small glyph-fragments fade in from screen-edges and drift toward the pack along curved paths, accelerating slightly as they approach. The fragments DO NOT contact the pack yet — they hover ~5cm out from the pack's surface, accumulating in a faint halo. Subtle in-frame zoom 5% over the beat.",
        sfxCue: "tension_build (rising sub-bass swell + faint crystalline shimmer rising over 2.5s)",
        existingVfxRef: "BattleVFX.particleEmitter (re-tuned for cool-cyan glyph-fragments)",
      },
      {
        beatId: "crack",
        durationSec: 0.4,
        speaker: "None",
        mood: "intense",
        cameraDirection:
          "Camera holds. The pack rotation pauses at the front-facing position for the crack beat (so the viewer sees the foil tear straight-on).",
        framingPrompt:
          "Same pack, front-facing. The foil seam at the pack's top edge SHEARS visibly across its full width in a single sharp motion. The torn foil curls back ~3mm at the cut edge, revealing a thin sliver of the pack's interior darkness. The accumulated glyph-particle halo from the tension beat COLLAPSES INWARD into the cut, vanishing into the pack. A single sharp white-cyan flash radiates outward from the cut along the seam-line.",
        motionPrompt:
          "0.4s sharp scrape: the foil tears across the seam in a single continuous motion (NOT a slow rip — the cut happens in 0.15s, then 0.25s of curl-back-and-flash settling). Glyph-particle halo collapses inward at the same instant the cut completes. Single white-cyan flash radiates along seam-line then fades.",
        sfxCue:
          "pack_foil_tear (0.4s sharp Mylar-foil tear from physical-pack reference library — see prelude-asset-build/prompts/vfx physical-pack-reference; tail with 0.1s reverb-decay; volume +6dB above ambient)",
        existingVfxRef: "BattleVFX.ScreenFlash (white-cyan, 50ms duration, 30% intensity)",
      },
      {
        beatId: "fan-reveal",
        durationSec: 2.0,
        speaker: "None",
        mood: "neutral",
        cameraDirection:
          "Camera pulls back smoothly over 2s by ~25% (zoom-out) to accommodate the full fan of cards as they emerge.",
        framingPrompt:
          "The opened pack tilts further forward (now at 60°) and the FIVE CARDS inside arc OUTWARD from the pack's mouth in a finger-fan motion — the central card emerges first, then cards 2 and 4 flank it (one card-width to each side), then cards 1 and 5 spread to the outermost positions of the fan. All five cards remain face-DOWN during the fan-reveal — the card backs are visible (deep-violet Hierarchy-style backs with a small S1 sigil at centre). The fan's spread angle: ~80° total (each card separated by ~20°). Background fades from warm-gold bokeh to cool-charcoal collector's-felt to maximize per-card readability when flips begin.",
        motionPrompt:
          "Card-fan emergence over 2s: central card emerges first (0-0.4s), then symmetric pair 2+4 (0.3-0.8s), then outermost pair 1+5 (0.6-1.4s). Each card decelerates as it reaches its final fan-position (ease-out). Pack tilts smoothly from 35° to 60° forward over 0-1s. Camera zoom-out 25% smooth over full 2s.",
        sfxCue: "card_fan_emerge (5 distinct cardstock-shuffle sounds slightly staggered to match the emergence timing; final card lands at 1.4s; cardstock-on-cardstock layered with subtle whoosh)",
        existingVfxRef: "(custom — Three.js card-mesh fan-out animation; no existing primitive matches)",
      },
      {
        beatId: "flip-cycle",
        durationSec: 5,
        speaker: "None",
        mood: "intense",
        cameraDirection:
          "Camera dolly-in slightly to centre on the active card position; the active card lifts forward ~10cm from the fan plane during its flip-window. Camera returns to fan-overview between cards.",
        framingPrompt:
          "Sequential per-card flip-cycle from card 1 (left-most) to card 5 (right-most). Each card flip: card lifts forward, rotates 180° on its horizontal axis to reveal its face, holds at face-up for the rarity-gated ceremony duration, then settles back into the fan. Common cards: 0.5s total ceremony (quick flip + brief shimmer). Uncommon: 0.7s (silver shimmer). Rare: 1s (single foil-shimmer pulse). Epic: 1.4s (sparks + audio stinger). Legendary: 2s (brass-fanfare + screen flash). Mythic: 2.5s (choral 'AH' + screen shake + sparks-cascade). Neyon: 3s (chromatic-aberration shimmer + emit-light onto scene + foil-shader saturation peak). The flip-cycle's total runtime depends on the pack's rarity-mix; budget ~5s for a typical pack.",
        motionPrompt:
          "Per card: lift-forward (0.1s) → flip (0.2s) → rarity-ceremony hold (0.2-2.7s rarity-gated) → settle-back (0.1s). Camera dolly-in 5% during lift, dolly-back during settle. Cards never overlap during flip — the flipping card always has clear frame-space.",
        sfxCue:
          "Per-card SFX selected by rarity (all routed through pack-opening SFX manager): common = card_flip_quick.mp3; uncommon = card_flip_silver.mp3; rare = card_flip_foil_shimmer.mp3; epic = card_flip_sparks.mp3 + epic_stinger.mp3; legendary = card_flip_legendary.mp3 + brass_fanfare.mp3; mythic = card_flip_mythic.mp3 + choral_ah.mp3 + screen_shake_low_rumble.mp3; neyon = card_flip_neyon.mp3 + chromatic_aberration_whisper.mp3. All SFX layered with cardstock-on-cardstock landing-thud (different from cardstock-on-table — cardstock-on-cardstock has a subtler, drier timbre).",
        existingVfxRef:
          "RewardCelebration.particleBurst (re-tuned per rarity tier); BattleVFX.ScreenFlash (legendary+ tiers); BattleVFX.ScreenShake (mythic tier); custom chromatic-aberration shader (neyon tier — must be authored as new client primitive)",
      },
      {
        beatId: "summary",
        durationSec: 2.0,
        speaker: "None",
        mood: "triumphant",
        cameraDirection:
          "Camera dolly-back to the full fan-overview position; slight upward pan to centre the summary panel that fades in above the fan.",
        framingPrompt:
          "All 5 cards remain face-up in the fan, illuminated softly. Above the fan, a translucent summary-panel fades in over 0.4s showing: card-by-card rarity tally (e.g. '1 mythic, 2 rare, 2 common'), pity-counter delta (e.g. '+1 toward next pity-pull'), and any new cards highlighted with a small NEW tag. The panel uses Hierarchy-style typography and is rendered in cool-cream against translucent cool-charcoal. Background bokeh warms back to warm-amber.",
        motionPrompt:
          "Camera dolly-back over 0.6s. Summary-panel fades in over 0.4s, holds for 1s, gently pulses (3% scale-up-and-back) on any NEW tags during the hold. Final 0.4s: the camera holds the position, summary-panel remains, ambient particle drift returns.",
        sfxCue:
          "summary_chime (warm bell-tone confirming pack-open complete; volume tied to highest-rarity card pulled — common chime is subtle, mythic-tier chime is layered with a faint reprise of the tier's flip-stinger)",
        existingVfxRef: "RewardCelebration.summary-panel (existing component re-tuned for pack-context)",
      },
    ],
    loreCitations: [
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §Pack-opening fidelity = LAUNCH-CRITICAL (USER DIRECTIVE 2026-04-27)",
      "apps/client/src/game/duelyst/PackOpening.tsx (existing implementation — to be replaced)",
      "apps/client/src/pages/DemonPackPage.tsx (existing implementation — to be replaced)",
      "apps/client/src/components/BattleVFX.tsx (ScreenFlash + ScreenShake reuse)",
      "apps/client/src/components/RewardCelebration.tsx (particleBurst + summary-panel reuse)",
      "prelude-asset-build/prompts/vfx/README.md (1920×1080 VP9/WebM α delivery spec for any new VFX assets)",
    ],
  },
});

/**
 * Cosmetic-Reveal VFX (3 VFX assets).
 *
 * Visual effects for the three meta-author cosmetic-tier reveals:
 * Founder badge unfold, set-completion master ceremony, and BP-50
 * Author reveal. These VFX play once per account when the
 * corresponding cosmetic is awarded.
 *
 * Output spec locked to prelude pipeline.
 */
import type { VfxPrompt } from "../types";
import { VFX_OUTPUT_LOCKED } from "../types";

export const COSMETIC_REVEAL_VFX: Readonly<Record<string, VfxPrompt>> = Object.freeze({
  "vfx_cosmetic_founder_badge_unfold": {
    id: "vfx_cosmetic_founder_badge_unfold",
    trigger: "Founder's Bundle purchase fulfills + Founding Author cosmetic grants",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 4.0,
    startFramePrompt:
      "Centred on screen at frame-foreground: a small folded leather-and-brass Hierarchy presentation-case the size of a hand, sealed with a single brass clasp. The case sits on a dark velvet surface. The clasp glows faintly warm-gold. Background: a soft warm-cream halo extends outward from behind the case.",
    endFramePrompt:
      "The presentation-case is fully open. Inside, a Founder's badge — circular, brass-edged, displaying the Hierarchy crest at its centre with FOUNDING AUTHOR engraved in a circular band around it. Below the badge, on the case's lower interior, the player's serial number is engraved in fine type (e.g. 'No. 0327 of 4000'). Soft warm-gold light catches the badge's brass and glints. ~30 small warm-gold particle motes drift upward from the case.",
    motionPrompt:
      "0-1.0s: case slowly rotates 15° toward the camera; brass clasp clicks open. 1.0-2.0s: case lid lifts smoothly, revealing the Founder's badge interior. 2.0-2.5s: badge rises slightly out of the case (~5cm of lift), warm-gold light catches the brass. 2.5-3.0s: serial-number engraving reveals character-by-character on the case's lower interior. 3.0-4.0s: 30 warm-gold particles drift upward from the case; sustained warm-gold halo behind the case.",
    sfxCue: "founder_badge_unfold.mp3 (brass-clasp click + slow leather-and-brass case-opening + warm-gold tonal chord landing + faint engraving-stroke sound for serial-number reveal; total 4.0s)",
    existingPrimitives: [
      "BattleVFX.particleEmitter (warm-gold motes, low count, slow upward drift)",
      "RewardCelebration.tier3 (warm-gold halo)",
      "BattleVFX.floatingText (for serial-number character-by-character reveal)",
    ],
    loreCitations: [
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §6 Collector hook §1 (Founder's Bundle)",
      "(intra-set) §special_founding_author — Founding Author canonical card art reference",
    ],
  },

  "vfx_cosmetic_set_completion_ceremony": {
    id: "vfx_cosmetic_set_completion_ceremony",
    trigger: "S2_HIERARCHY 100% set-completion achieved + Author's Edition cosmetic grants",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 5.0,
    startFramePrompt:
      "An empty Hierarchy oak-and-leather binding-table fills the frame-centre. The table is in soft warm-amber overhead light. Above the table, faintly visible at frame-edges, the silhouettes of all 84 S2_HIERARCHY card-backs are arranged in a circular halo (each card-back at a slightly different angle, like a slow-spinning constellation around the table).",
    endFramePrompt:
      "On the table, the Author's Edition master-Memoir-volume sits open at its centre-spread (the cascading Hierarchy org-chart visible). The 84 surrounding card-backs have COLLAPSED INWARD onto the open volume — each card has dissolved into the Memoir, leaving 84 small deep-violet ink-flourishes embedded across the org-chart's tiles. A bright warm-gold halo radiates from the Memoir, and the Memoirist's serial-marked stamp impresses itself onto the lower-right of the cover.",
    motionPrompt:
      "0-1.5s: 84 surrounding card-backs slowly rotate inward, spiraling toward the table's centre. 1.5-2.5s: cards converge above the table and dissolve sequentially into a forming Memoir-volume (the volume is BUILDING from the cards). 2.5-3.5s: completed Memoir-volume opens at its centre-spread, revealing the cascading org-chart with the 84 ink-flourishes already embedded. 3.5-4.5s: warm-gold halo blooms outward from the Memoir; serial-stamp impresses on the lower-right corner. 4.5-5.0s: halo settles to sustained warm-gold glow.",
    sfxCue: "set_completion_ceremony.mp3 (sequenced card-rustle sounds for the spiral + sustained warm-amber tonal bed building over the beat + final stamp-impact at 3.5s + warm-gold tonal chord landing at 4.5s; total 5.0s)",
    existingPrimitives: [
      "BattleVFX.particleEmitter (84 card-backs as discrete particle-objects, each with rotation animation)",
      "RewardCelebration.tier4 (warm-gold halo bloom)",
      "BattleVFX.ScreenFlash (subtle warm-gold horizontal flash at stamp-impact, 100ms 20% intensity)",
    ],
    loreCitations: [
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §6 Collector hook §3 (set-completion)",
      "(intra-set) §special_authors_edition_s2 — Author's Edition canonical card art reference",
    ],
  },

  "vfx_cosmetic_bp50_author_reveal": {
    id: "vfx_cosmetic_bp50_author_reveal",
    trigger: "Battle Pass S1 Tier 50 reached + Author cosmetic grants",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 3.5,
    startFramePrompt:
      "A Memoirist's writing-desk fills frame-centre — same composition as the BP-50 Author card art. The desk holds the half-filled Memoir-volume, the brass-and-bone quill paused mid-stroke, the cold mug. To the desk's left, a stack of fifty weekly-issue parchments bound by brass-and-leather strap. The chair behind the desk is empty. Soft warm-amber desk-lamp.",
    endFramePrompt:
      "The fifty-parchment stack at the desk's left has VISIBLY GLOWED briefly in succession — the strap has loosened and the parchments have dispersed slightly outward in a loose fan. The brass-and-bone quill has lifted off the desk and now hovers mid-air over the open Memoir-volume; its tip glows faintly warm-gold. A horizontal title-line of warm-gold text 'AUTHOR' floats above the desk in elegant serif. The empty chair has a subtle warm-amber outline-glow as if recently vacated.",
    motionPrompt:
      "0-0.8s: brass-leather strap on parchment-stack loosens; fifty parchments disperse outward in a loose fan with a soft glow per parchment in succession (50 quick glow-pulses sequenced over 0.5s). 0.8-1.5s: brass-and-bone quill lifts off the desk and hovers mid-air over the open Memoir; tip glows warm-gold. 1.5-2.5s: 'AUTHOR' title text fades in character-by-character above the desk in warm-gold serif. 2.5-3.5s: chair's empty seat acquires subtle warm-amber outline-glow; full composition holds; quill's warm-gold tip pulses gently.",
    sfxCue: "bp50_author_reveal.mp3 (brass-strap loosening sound + 50 sequenced soft glow-tone pulses + quill-lift soft scratch + warm-gold tonal chord landing at title fade-in + sustained warm-amber bed; total 3.5s)",
    existingPrimitives: [
      "BattleVFX.particleEmitter (parchment-fan dispersal with sequenced glow-pulses)",
      "BattleVFX.floatingText (AUTHOR title character-by-character reveal)",
      "RewardCelebration.tier3 (warm-gold halo + chair outline-glow)",
    ],
    loreCitations: [
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §6 Collector hook §6 (Battle Pass tie-in)",
      "(intra-set) §special_battle_pass_t50_author — BP-50 Author canonical card art reference",
    ],
  },
});

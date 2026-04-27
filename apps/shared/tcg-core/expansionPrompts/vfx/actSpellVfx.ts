/**
 * Act-Exclusive Spell VFX (5 VFX assets).
 *
 * Visual effects for the spell-tier mechanics introduced by the
 * Acts 1-5 exclusive cards. Acts 6-7 are intentionally not in
 * this file — their spells (Banishment Glyph, Convergence Chord)
 * are covered by existing battle primitives + the Act 6/7
 * cutscenes' VFX content.
 *
 * Output spec locked to prelude pipeline.
 */
import type { VfxPrompt } from "../types";
import { VFX_OUTPUT_LOCKED } from "../types";

export const ACT_SPELL_VFX: Readonly<Record<string, VfxPrompt>> = Object.freeze({
  "vfx_act1_signal_pulse": {
    id: "vfx_act1_signal_pulse",
    trigger: "Act 1 'The Signal' (mythic spell) cast in-match",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 1.8,
    startFramePrompt:
      "Battlefield tile at frame-centre. From beneath the tile, a single thin obsidian transmission-pillar rises ~30cm above the tile surface, its upper face etched with the canonical three-note Signal glyph. Glyph at faint cool-cyan glow. The tile beneath the pillar reflects faintly as if mercury-still.",
    endFramePrompt:
      "The transmission-pillar is fully extended (~80cm tall); the three-note glyph emits THREE SEPARATE concentric ripple-waves (timed to the three notes), each ripple propagating outward across the battlefield in cool-cyan. Wherever a ripple-edge crosses an enemy unit, that unit acquires a faint cool-cyan stun-status indicator above its head.",
    motionPrompt:
      "0-0.4s: pillar rises from below tile to full height. 0.4s: first ripple-wave emits from glyph (note 1). 0.7s: second ripple-wave (note 2). 1.0s: third ripple-wave (note 3). Each ripple propagates outward across the battlefield over 0.6s before fading. 1.0-1.6s: stun-status indicators settle above any crossed enemy units. 1.6-1.8s: pillar sinks back beneath the tile; three-note glyph fades.",
    sfxCue: "act1_signal_pulse.mp3 (three distinct cool-cyan tonal-resolution chords landing at 0.4s, 0.7s, 1.0s — the canonical Signal three-note motif — over a low substrate-hum bed; total 1.8s)",
    existingPrimitives: [
      "BattleVFX.particleEmitter (ripple-wave propagation, three sequenced waves)",
      "BattleVFX.statusEffect (cool-cyan stun indicator)",
      "(NEW PRIMITIVE — small) — transmission-pillar 3D mesh with shader-driven glyph-glow; can be authored as new client-side mesh asset, no shader work required beyond standard emissive",
    ],
    loreCitations: [
      "(intra-set) §act1_exclusive_mythic_the_signal — three-note Signal canon framing",
      "(intra-set) §cutscene_act1_memoir_opens — three-note motif audio continuity",
    ],
  },

  "vfx_act2_whisper_drift": {
    id: "vfx_act2_whisper_drift",
    trigger: "Act 2 'The Whisper' (mythic spell) cast in-match",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 1.6,
    startFramePrompt:
      "Battlefield tile at frame-centre. A faint cool-cyan exhale-mist begins to emerge from the tile's surface, drifting upward in a slow tendril ~60cm tall.",
    endFramePrompt:
      "The exhale-mist has drifted across multiple battlefield tiles in a lateral path — choosing the path along which enemy units stood. Each enemy unit the mist crossed now has a small translucent thin-wall partition rendered between them and their nearest ally (the canonical Whisper effect: enemies are momentarily sealed off from their allies' buffs/triggers). The mist itself is dissipating at floor-level on its terminal tile.",
    motionPrompt:
      "0-0.3s: exhale-mist emerges from origin tile. 0.3-1.0s: mist drifts laterally across the battlefield in a slow tendril, crossing enemy positions in path-finding sequence. 1.0-1.3s: at each enemy crossed, a translucent thin-wall partition fades in between that enemy and their nearest ally (sequenced fade-ins). 1.3-1.6s: mist dissipates at floor-level; thin-walls hold (they remain for the buff-block effect's full duration, signaled by sustained translucent shimmer).",
    sfxCue: "act2_whisper_drift.mp3 (subtle exhale-through-air sound + faint vocal-fry whisper-pitched air-movement + soft thin-wall materialization chime per partition; total 1.6s)",
    existingPrimitives: [
      "BattleVFX.particleEmitter (cool-cyan exhale-mist tendril with path-finding behavior — note: requires path-following particle behavior, not just emission)",
      "BattleVFX.statusEffect (sustained translucent thin-wall partition; requires new shader for the partition geometry)",
    ],
    loreCitations: [
      "(intra-set) §act2_exclusive_mythic_the_whisper — exhale-mist canon visual signature",
      "(intra-set) §cutscene_act2_whisper_begins — exhale-mist audio continuity",
    ],
  },

  "vfx_act3_offer_doors": {
    id: "vfx_act3_offer_doors",
    trigger: "Act 3 'The Offer' (mythic spell) cast in-match",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 2.2,
    startFramePrompt:
      "Battlefield tile at frame-centre. From the tile surface, three ghost-translucent doorframes rise simultaneously — at relative positions LEFT (signal-green), CENTRE (cool-cyan), and RIGHT (deep-crimson-and-rust). Each at ~40% opacity at start.",
    endFramePrompt:
      "The three doorframes are at full opacity (matched intensity) and have ALIGNED themselves with three different friendly units across the battlefield (the canonical Offer effect: caster targets up to three friendly units; each acquires the doorframe-color buff matching its choice). Each chosen friendly unit has a subtle colored-arch overlay above their head matching their assigned doorframe color.",
    motionPrompt:
      "0-0.7s: three doorframes rise from origin tile, each at ~40% opacity. 0.7-1.4s: doorframes brighten in unison toward 100% opacity; their colored-light streams trace outward to the three target friendly units (one stream per doorframe, traveling along path-finding to its target). 1.4-1.8s: at each target unit, a colored-arch overlay fades in above their head matching the assigned doorframe color. 1.8-2.2s: original doorframes at origin tile fade; sustained colored-arch overlays remain at the three buffed units (held for buff duration).",
    sfxCue: "act3_offer_doors.mp3 (three-tonal swell building over 0-1.4s — green / cyan / crimson tones layered to identical loudness — culminating in a single chord at 1.4s + per-target arch-materialize chimes at 1.4-1.8s; total 2.2s)",
    existingPrimitives: [
      "BattleVFX.particleEmitter (three colored-light streams with target-following behavior)",
      "BattleVFX.statusEffect (sustained colored-arch overlay per target, three colors)",
      "(NEW PRIMITIVE — moderate) — three doorframe meshes with shader-driven color tints; can be authored as new client-side mesh asset",
    ],
    loreCitations: [
      "(intra-set) §act3_exclusive_mythic_the_offer — three-doorframe canon visual signature",
      "(intra-set) §cutscene_act3_offer_presented — three-tonal swell audio continuity",
    ],
  },

  "vfx_act4_revelation_scry": {
    id: "vfx_act4_revelation_scry",
    trigger: "Act 4 'The Revelation' (mythic spell) cast in-match",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 2.0,
    startFramePrompt:
      "Battlefield tile at frame-centre. A translucent Memoir-page rises from the tile, growing rapidly to occupy a large portion of upper-frame at full opacity. The page is initially blank.",
    endFramePrompt:
      "The Memoir-page is fully formed and visible. Across its surface, multiple lines of deep-violet handwritten text have appeared character-by-character — each line corresponds to a peek at the top card of an enemy deck (the canonical Revelation effect: scry the top N cards of opponent's deck). Above each enemy unit on the battlefield, a translucent thin Memoir-page-fragment is also visible, showing one line of revelatory text about that unit (the canonical 'know-thy-enemy' Revelation buff).",
    motionPrompt:
      "0-0.6s: Memoir-page rises and expands from origin tile, reaching full size and opacity at 0.6s. 0.6-1.4s: deep-violet text reveals across the page line-by-line, character-by-character at ~40 chars/sec (target: 4-6 lines visible by 1.4s). 1.4-1.7s: small page-fragments materialize above each enemy unit on the battlefield with a single revelatory line each. 1.7-2.0s: main page fades; per-enemy fragments hold (sustained for scry-buff duration, indicating revealed information).",
    sfxCue: "act4_revelation_scry.mp3 (paper-rustle on page-rise + sustained warm-gold tonal harmonic + character-by-character ink-stroke sounds at typewriter rhythm + per-fragment soft chime sequence; total 2.0s)",
    existingPrimitives: [
      "BattleVFX.floatingText (character-by-character text reveal)",
      "BattleVFX.statusEffect (sustained translucent page-fragments above enemies)",
      "RewardCelebration.tier3 (warm-gold halo on main page during reveal)",
    ],
    loreCitations: [
      "(intra-set) §act4_exclusive_mythic_the_revelation — Memoir-page canon visual signature",
      "(intra-set) §cutscene_act4_revelation_meets — warm-gold tonal continuity",
    ],
  },

  "vfx_act5_map_lock": {
    id: "vfx_act5_map_lock",
    trigger: "Act 5 'The Map' (mythic artifact) activated in-match",
    output: { ...VFX_OUTPUT_LOCKED },
    estimatedDurationSec: 2.5,
    startFramePrompt:
      "Battlefield viewed from a slightly higher camera angle. From the centre tile, the brass-edged Soul Map disc materializes at ~50% opacity, scaled to span ~3 tiles in diameter, hovering 1m above the battlefield. Its twelve sectors are visible (matching the Map Fully Decoded canon).",
    endFramePrompt:
      "The Soul Map is at full opacity. Twelve subtle warm-amber lock-glyphs have illuminated, one above each of twelve battlefield tiles (the canonical Map effect: lock 12 specific board positions for tactical advantage). At the Map's centre, the obsidian centre-dot pulses with a single dim warm-gold pulse. The locked tiles each have a faint warm-amber outline now indicating their locked status.",
    motionPrompt:
      "0-0.6s: Soul Map disc materializes from origin tile at 50% opacity, scaling up to span 3 tiles. 0.6-1.2s: disc opacity rises to 100%; twelve sector-glyphs intensify in radial sequence (outer ring inward). 1.2-1.8s: warm-amber lock-glyphs illuminate above the twelve target tiles (sequenced over 0.6s to match a sector-decode cascade rhythm). 1.8-2.1s: centre-dot pulses warm-gold once. 2.1-2.5s: Map disc fades; twelve tile-outlines remain illuminated as sustained lock-indicators.",
    sfxCue: "act5_map_lock.mp3 (sustained warm-amber tonal harmonic building over 0-1.2s + twelve sequenced lock-tone chimes at 1.2-1.8s — one per locked tile, matching a sector-decode rhythm + single centre-dot drone-tone landing at 1.8s; total 2.5s)",
    existingPrimitives: [
      "BattleVFX.particleEmitter (sector-glyph radial sequence; twelve lock-glyph materializations)",
      "BattleVFX.statusEffect (sustained warm-amber tile-outline indicators, twelve targets)",
      "(NEW PRIMITIVE — moderate) — Soul Map disc 3D mesh with sector-shader animation; reuses Soul Map shader from Act 5 mythic card art context",
    ],
    loreCitations: [
      "(intra-set) §act5_exclusive_mythic_the_map — Soul Map fully-decoded canon visual signature",
      "(intra-set) §cutscene_act5_map_year_one_close — sector-decode cascade audio continuity",
    ],
  },
});

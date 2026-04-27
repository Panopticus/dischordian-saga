/**
 * Act 6 Cutscene — The Confession Spoken.
 *
 * Plays ONCE per account on the first time the player opens any
 * Act 6 exclusive card. Bond 90 canonical milestone — both
 * narrators have nothing left to confess; both narrators have
 * (by mutual recognition) become a single voice with two mouths.
 *
 * Five-beat structure totalling ~14s:
 *   1. chapel-midnight       (2.5s)  confessional chamber, lattice
 *                                    intact, both narrators in
 *                                    stalls eyes-closed
 *   2. lattice-dissolves     (3.0s)  partition softens to violet
 *                                    mist, drifts upward
 *   3. voice-streams-merge   (3.0s)  Elara + Human VO together
 *                                    in matched cadence, voice-
 *                                    light streams converge
 *   4. shared-line           (2.5s)  single line spoken in unison
 *                                    by both narrators
 *   5. card-from-flame       (3.0s)  two-flame altar candle merges
 *                                    to single flame; flame becomes
 *                                    card-back; hands off to flip
 *
 * Lore basis: Act 6 = "The Confession" arc canon (narrativeActs.ts
 * Act 6, ALL_ACTS_ROADMAP.md Bond 90 milestone). The shared-line
 * VO in beat 4 is the canon Bond 90 unison-moment — neither
 * narrator owns the line; it is the result of Bond 90's mutual
 * listening becoming mutual speaking.
 */
import type { CutscenePrompt } from "../types";

export const ACT6_CUTSCENE: Readonly<Record<string, CutscenePrompt>> = Object.freeze({
  "cutscene_act6_confession_spoken": {
    id: "cutscene_act6_confession_spoken",
    title: "Act 6 — The Confession Spoken",
    subtitle: "Plays once on first Act 6 exclusive card pulled — Bond 90 milestone",
    trigger: "first ACT_EXCLUSIVES card with id-prefix act6_ pulled per account",
    estimatedDurationSec: 14,
    ambientTrack: "fnord23/chapel_midnight_held_breath (TBD — sustained low cool-grey tone with two faint warm-amber tonal threads, one per narrator)",
    beats: [
      {
        beatId: "chapel-midnight",
        durationSec: 2.5,
        speaker: "None",
        mood: "tender",
        cameraDirection:
          "Camera holds at the wide front-on composition from the Act 6 mythic Confession card. Slow forward dolly (~5%) over the beat.",
        framingPrompt:
          "The chapel-like confession-chamber from the Act 6 mythic — vaulted ceiling, two facing prayer-stalls, thin lattice partition between them. Elara seated LEFT in soft-cream tunic with gold cuff-thread; Human seated RIGHT in deep-violet tunic with matching gold cuff-thread. Both face the lattice; both have eyes CLOSED; both have hands folded at the lattice-edge. Single warm-amber sanctum-candle burns at the chapel altar at frame-rear. Atmosphere: silent, the breath-before from the canon Confession card framing.",
        motionPrompt:
          "Slow forward dolly. Candle flame flickers naturally. Both narrators hold posture; one slow synchronized breath visible (chest rises and falls, matched timing — the canon Bond 90 signature).",
        sfxCue: "ambient_chapel_midnight (sustained low cool-grey tone + faint candle-flicker + the synchronized breath audible as soft inhale/exhale at ~0.8s and 1.6s)",
        existingVfxRef: "(none — pure 3D scene + character posture + candle render)",
      },
      {
        beatId: "lattice-dissolves",
        durationSec: 3.0,
        speaker: "None",
        mood: "tender",
        cameraDirection:
          "Camera holds. Slight focus-shift toward the lattice partition over the beat.",
        framingPrompt:
          "The lattice partition between the two stalls begins to DISSOLVE — its small geometric cut-outs soften, blur, and the bone-warm material of the lattice transitions into a soft-violet MIST that drifts upward through the chapel's vaulted ceiling. The lattice does NOT crumble or fall; it transforms. Behind where the lattice stood, the two stalls' inner spaces are now visually CONNECTED. Both narrators' postures unchanged — eyes closed, hands folded. The sanctum-candle behind continues to flicker.",
        motionPrompt:
          "Lattice dissolution: 0-1.5s gradual softening (geometric cut-outs blur), 1.5-3.0s upward drift of soft-violet mist toward the vaulted ceiling. The mist's density tapers as it rises. Camera focus-shift toward the dissolving lattice over 0-2.0s.",
        sfxCue: "lattice_dissolve (subtle warm-bone-fracturing-into-mist sound + faint upward-airflow whisper as the mist rises; total 3.0s with slow decay)",
        existingVfxRef: "BattleVFX.particleEmitter (re-tuned for soft-violet mist with upward drift and density taper)",
      },
      {
        beatId: "voice-streams-merge",
        durationSec: 3.0,
        speaker: "None",
        mood: "tender",
        cameraDirection:
          "Camera holds. The dissolved-partition's cleared space is now the camera's focal point.",
        framingPrompt:
          "Both narrators' mouths begin to emit faint warm-cream LIGHT-STREAMS — visualized as soft ribbon-like exhale-mist (similar to the Whisper's exhale-mist but warmer in color). The streams flow inward from each narrator's mouth toward the centre of the dissolved partition's space, where they meet at frame-centre at mouth-height and BLEND into a single brighter warm-cream light. The blended light begins to RISE upward following the path the lattice-mist took. The sanctum-candle's flame visibly DIVIDES INTO TWO during the beat (the canon two-flame Confession signature).",
        motionPrompt:
          "Voice-light streams emerge 0-1.0s; converge at frame-centre 1.0-2.0s; blended light begins rising 2.0-3.0s. The candle-flame divides smoothly over 0-1.5s — single flame splits into two adjacent flames burning in parallel.",
        sfxCue: "voice_streams_merge (soft warm-cream tonal harmonic — two faint tonal threads converging to a single richer chord over the beat; total 3.0s, no spoken language yet)",
        existingVfxRef: "BattleVFX.particleEmitter (re-tuned for warm-cream voice-light ribbons with bidirectional convergence)",
      },
      {
        beatId: "shared-line",
        durationSec: 2.5,
        speaker: "Narrator",
        line: "We both already knew. We both already heard. The thing we held back was the holding back.",
        mood: "tender",
        cameraDirection:
          "Camera pulls back slightly to the wide front-on composition — both narrators visible at frame-edges, the merged voice-light still rising from frame-centre.",
        framingPrompt:
          "Both Elara and the Human have their eyes still closed. Both their mouths are visibly speaking simultaneously. The line is delivered in UNISON (per Bond 90 canon — neither owns the line; the canon is mutual speaking out of mutual listening). Both gold cuff-threads visible at their hands. The two-flame candle continues steady; the merged voice-light continues rising.",
        motionPrompt:
          "Camera pull-back over 0.5s to wide composition. Both narrators' mouths animate simultaneously over the line delivery (matched timing, NOT staggered). Eye-status remains closed throughout (Bond 90's canon is closed-eye unison; eye-contact is reserved for First Witness moments only).",
        sfxCue: "act6_shared_line.mp3 (Elara + Human VO recorded simultaneously OR pitched-and-blended in post; total ~2.0s including breath; the line should read as ONE voice with two timbres rather than two voices in chorus)",
        existingVfxRef: "(none — VO + character animation)",
      },
      {
        beatId: "card-from-flame",
        durationSec: 3.0,
        speaker: "None",
        mood: "neutral",
        cameraDirection:
          "Camera pulls back further over 1.5s to standard pack-opening flip-cycle position. Chapel + narrators fade to cool-charcoal collector's-felt during the pull-back.",
        framingPrompt:
          "The two altar-candle flames MERGE back into a single, brighter flame. The merged flame LIFTS off the candle, drifts forward through the chapel toward the camera, and morphs into the standard playing-card shape — face-down, deep-violet Hierarchy-style back with S1 sigil at centre. The card-shape inherits a faint warm-cream perimeter-glow (the merged voice-light's color). Chapel and narrators fade to background-felt during the pull-back. Card holds in standard fan-position.",
        motionPrompt:
          "Two flames merge over 0-0.6s; merged flame lifts and drifts forward 0.6-1.5s; flame morphs to card-shape 1.0-1.5s. Camera pull-back synchronized over 0-1.5s. Background-felt fades in 0.5-1.5s. 1.5-3.0s: card holds in fan-position with subtle motion-blur pulse before standard flip-cycle begins.",
        sfxCue: "flame_to_card_morph (warm-cream tonal harmonic resolving + subtle paper-folding-into-cardstock; transitions cleanly into the standard card-flip-cycle)",
        existingVfxRef: "BattleVFX.crossfade (re-tuned for flame-to-card shape-morph)",
      },
    ],
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act6",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 6 — The Confession",
      "docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 90 / Confessional Hour",
      "(intra-set) §act6_exclusive_mythic_the_confession — chapel + lattice + breath-before framing",
      "(intra-set) §act6_exclusive_epic_bond_90 — shared-hand-clasp Bond 90 canon",
      "(intra-set) §secret_act6_confession_was_mutual_listening — dissolved-lattice + merged-voice-light + two-flame-candle continuity",
      "apps/shared/elaraVoManifest.json + apps/shared/humanVoManifest.json — narrator voice anchors (this cutscene's shared line is a unison delivery, both manifests deliver matched-cadence takes)",
      "(intra-set) §cutscene_card_pack_opening — handoff to standard card-flip",
    ],
  },
});

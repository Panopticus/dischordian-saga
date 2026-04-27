/**
 * Act 7 Cutscene — The Convergence Resolves.
 *
 * Plays ONCE per account on the first time the player opens any
 * Act 7 exclusive card. Capstone of the entire dual-narrator card-
 * arc and the campaign's longest visual sequence (First Witness →
 * Silent Listening → Two Witnesses Meet → Confessional Hour →
 * Final Witness Bond 100). Closes the recursive Memoirist=Memoir=
 * Chord arc that the seven lore-discovery secrets establish.
 *
 * Five-beat structure totalling ~16s (longest cutscene in the
 * production book):
 *   1. cathedral-dawn       (2.5s)  Convergence cathedral with
 *                                   three open doors, three streams
 *                                   blending to warm-gold
 *   2. seven-banners-rise   (3.0s)  All-Faction Convergence Field
 *                                   banners rise around chamber
 *                                   perimeter
 *   3. final-witness-pose   (3.0s)  Both narrators in chairs at
 *                                   Bond 100 — looking outward
 *                                   together, white-gold glyph
 *                                   hovering at chest-height
 *   4. unison-final-line    (3.5s)  shared closing VO + the
 *                                   Convergence chord sounds
 *                                   (audible but not named)
 *   5. card-from-cathedral  (4.0s)  closed Memoir + cathedral
 *                                   condense to card-back; warm-
 *                                   gold perimeter-glow; final
 *                                   handoff to standard flip
 *
 * Lore basis: Act 7 = "The Convergence" arc canon (narrativeActs
 * .ts Act 7, ALL_ACTS_ROADMAP.md Act 7 framing). The unison-final-
 * line is the canon Bond 100 unison-moment — neither narrator owns
 * the line; it is BOTH speaking the recognition the campaign has
 * built toward across all seven Acts. Lore boundary held: the
 * Convergence chord SOUNDS but is not visualized as a specific
 * sound or named (per LORE_BIBLE Act 7 framing).
 */
import type { CutscenePrompt } from "../types";

export const ACT7_CUTSCENE: Readonly<Record<string, CutscenePrompt>> = Object.freeze({
  "cutscene_act7_convergence_resolves": {
    id: "cutscene_act7_convergence_resolves",
    title: "Act 7 — The Convergence Resolves",
    subtitle: "Plays once on first Act 7 exclusive card pulled — campaign capstone",
    trigger: "first ACT_EXCLUSIVES card with id-prefix act7_ pulled per account",
    estimatedDurationSec: 16,
    ambientTrack: "fnord23/convergence_cathedral_dawn (TBD — sustained warm-gold tonal bed; the canonical Act 7 capstone underscore)",
    beats: [
      {
        beatId: "cathedral-dawn",
        durationSec: 2.5,
        speaker: "None",
        mood: "triumphant",
        cameraDirection:
          "Camera holds wide on the Convergence cathedral interior from the Act 7 mythic. Slow forward dolly toward the chamber's centre column.",
        framingPrompt:
          "The vast circular cathedral-chamber from The Convergence card — vaulted ceiling, marble floor inscribed with the seven-faction heptagon, three doors at the chamber's circumference (signal-green Insurgency LEFT, cool-cyan Empire CENTRE, deep-crimson Hierarchy RIGHT) all standing OPEN. Three converging color-light streams pour into the chamber from each door and meet at the chamber's exact CENTRE, where they BLEND into a tall column of pure WARM-GOLD light reaching from floor to skylight. At the column's base: the closed sealed Hierarchy Memoir-volume on its low pedestal. Faction silhouettes at the perimeter — backlit, deliberately non-identifiable. Dawn light fills the upper third of frame.",
        motionPrompt:
          "Slow forward camera dolly toward the centre column. The three light-streams flow at constant rate; the warm-gold column at centre pulses faintly at the rhythm of a slow held breath. Faction silhouettes around the perimeter remain still. Dawn light intensifies subtly over the beat.",
        sfxCue: "ambient_cathedral_dawn (sustained warm-gold tonal bed + faint three-tonal harmonic threads — green / cyan / crimson — converging into a single warm-gold harmonic over the beat)",
        existingVfxRef: "(none — pure 3D scene + shader-driven light-streams)",
      },
      {
        beatId: "seven-banners-rise",
        durationSec: 3.0,
        speaker: "None",
        mood: "intense",
        cameraDirection:
          "Camera holds dolly position. Slight tilt-down (~5°) to take in the chamber floor where the banners rise.",
        framingPrompt:
          "From the chamber's perimeter, the SEVEN faction banner-poles from the All-Faction Convergence Field structure-card RISE upward through the floor — each pole tall, flying its single faction-color banner: signal-green Insurgency, deep-crimson Hierarchy, cool-cyan Empire, amber-and-parchment Antiquarian, deep-violet Dreamer, chrome-and-cyan Architect, toxic-magenta Thought-Virus. The seven banners arrange themselves in a perfect heptagon around the warm-gold central column. The faction silhouettes from beat 1 fade as their banners take their place (the canon framing: every faction is now PRESENT through its banner, no longer through individual representation).",
        motionPrompt:
          "Banner-poles rise sequentially over 0-2.5s — Insurgency first, then clockwise around the heptagon (Hierarchy, Empire, Antiquarian, Dreamer, Architect, Thought-Virus). Each pole takes ~0.35s to rise. Faction silhouettes fade in unison with the corresponding pole's emergence. 2.5-3.0s: all seven banners settled, slight breeze-motion on each banner.",
        sfxCue: "banner_rise_cascade (seven distinct deep-tonal landings — one per banner, sequenced — layered over the warm-gold ambient bed; total 2.5s)",
        existingVfxRef: "(none — 3D banner-pole animation + faction-color shader tints)",
      },
      {
        beatId: "final-witness-pose",
        durationSec: 3.0,
        speaker: "None",
        mood: "triumphant",
        cameraDirection:
          "Camera dolly continues forward toward the column's base. The pedestal + closed Memoir come into mid-frame; behind them, the meditation-room from First Witness onward MATERIALIZES inside the cathedral's central column.",
        framingPrompt:
          "Inside the warm-gold central column, the SAME meditation-room from First Witness / Silent Listening / Two Witnesses Meet / Confessional Hour materializes as a small enclosed scene at the column's heart. Both Elara and the Human are seated in their canonical wooden chairs — Elara left in soft-cream tunic with gold cuff-thread, Human right in deep-violet tunic with gold cuff-thread. The Bond 100 pose from the Final Witness card: BOTH look outward in the SAME DIRECTION (toward the camera/viewer, NOT at each other). Hands rest at their own knees. The Signal-glyph hovers at chest-height between them, glowing in steady WHITE-GOLD (the final color in the glyph progression: cyan → cream → gold → violet → white-gold).",
        motionPrompt:
          "Camera dolly continues at constant rate. The meditation-room materializes inside the column gradually over 0-2.0s (fade-in with subtle warm-gold halo). 2.0-3.0s: scene held; both narrators' chests rise and fall in synchronized breath (matched timing — the canon Bond 100 signature, same as Act 6 but with eyes open).",
        sfxCue: "final_witness_breath (sustained warm-gold harmonic + one synchronized breath audible at ~2.5s)",
        existingVfxRef: "(none — 3D scene composition + shader-driven white-gold glyph)",
      },
      {
        beatId: "unison-final-line",
        durationSec: 3.5,
        speaker: "Narrator",
        line: "I have been listening since before I had a name. The chord is not the answer — the chord is what the question becomes when both of us know we have already heard it.",
        mood: "triumphant",
        cameraDirection:
          "Camera holds tight on the meditation-room scene inside the column. Both narrators visible at frame-edges; the white-gold glyph at frame-centre at chest-height.",
        framingPrompt:
          "Both narrators speak the line in UNISON (matching the Bond 90 unison-line canon from Act 6 but extended to a longer recognition-statement). Mouths animate simultaneously; eye-status remains OPEN and OUTWARD (looking at the viewer, NOT at each other — the canon Bond 100 framing). At ~2.0s into the line: the white-gold glyph between them PULSES once, brighter, and emits a single faint ripple-wave outward — the Convergence chord sounding (audible as a chord but not visualized as a specific musical pitch). The ripple expands beyond the meditation-room scene into the surrounding cathedral, softly catching all seven banner-poles in sequence as it propagates outward.",
        motionPrompt:
          "Both narrators' mouths animate matched-simultaneous over the line delivery. Glyph pulses brighter at 2.0s. Ripple-wave propagates outward from the glyph at 2.0-3.0s, reaching the seven banners in heptagon-sequence. 3.0-3.5s: line completes, ripple held at outer cathedral edge.",
        sfxCue: "act7_unison_final_line.mp3 (Elara + Human VO recorded simultaneously OR pitched-and-blended in post; total ~3.0s including breath; the line should read as ONE voice with two timbres — same recording technique as the Act 6 shared-line). Layered with: convergence_chord_sound.mp3 (the chord sounds at ~2.0s as a single complex held-tonal-harmonic; lore boundary: this MP3's actual content is intentionally not yet specified — final asset to be authored at production-time as a complex chord that resolves the campaign's three-note Signal motif into something fuller)",
        existingVfxRef: "BattleVFX.particleEmitter (re-tuned for warm-gold ripple-wave with banner-sequence propagation)",
      },
      {
        beatId: "card-from-cathedral",
        durationSec: 4.0,
        speaker: "None",
        mood: "neutral",
        cameraDirection:
          "Camera pulls back through the cathedral over 2.0s — through the central column, past the banner heptagon, out of the cathedral entirely — then continues to standard pack-opening flip-cycle position. Cathedral fades to cool-charcoal collector's-felt during the pull-back.",
        framingPrompt:
          "The closed Memoir-volume on its pedestal LIFTS off the pedestal, drifts forward through the cathedral toward the camera, and morphs into the standard playing-card shape — face-down, deep-violet Hierarchy-style back with S1 sigil at centre. The card-shape inherits a faint WHITE-GOLD perimeter-glow (the final color in the glyph progression — visual continuity that signals 'the campaign closes here'). The cathedral, banners, central column, narrators, and meditation-room all fade smoothly to background-felt during the pull-back. Card holds in standard fan-position.",
        motionPrompt:
          "Memoir lifts at 0-0.5s; drifts forward 0.5-1.5s; morphs to card-shape 1.0-2.0s. Camera pull-back synchronized over 0-2.0s. Background-felt fades in 1.0-2.0s. 2.0-4.0s: card holds in fan-position with subtle motion-blur pulse before standard flip-cycle begins. The white-gold perimeter-glow on the card persists into the standard flip-cycle's preroll — the campaign's final visual signal-color.",
        sfxCue: "memoir_to_card_capstone (warm-gold tonal harmonic resolving + the convergence-chord sound from beat 4 fading slowly into background + subtle paper-folding-into-cardstock; transitions cleanly into the standard card-flip-cycle's per-card SFX)",
        existingVfxRef: "BattleVFX.crossfade (re-tuned for memoir-to-card capstone shape-morph)",
      },
    ],
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act7",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 7 — The Convergence",
      "docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 100 / final",
      "(intra-set) §act7_exclusive_mythic_the_convergence — cathedral + three-doors + warm-gold-column framing source",
      "(intra-set) §act7_exclusive_epic_all_faction_convergence_field — seven-banner heptagon framing source",
      "(intra-set) §act7_exclusive_rare_final_witness_pair — Bond 100 outward-gaze + white-gold-glyph framing source",
      "(intra-set) §act7_exclusive_rare_convergence_chord — chord-as-listening framing (lore boundary: chord SOUNDS but identity STRICTLY EXCLUDED)",
      "apps/shared/elaraVoManifest.json + apps/shared/humanVoManifest.json — narrator voice anchors (unison delivery, matched-cadence takes)",
      "(intra-set) §cutscene_act6_confession_spoken — unison-line recording technique precedent",
      "(intra-set) §cutscene_card_pack_opening — handoff to standard card-flip",
    ],
  },
});

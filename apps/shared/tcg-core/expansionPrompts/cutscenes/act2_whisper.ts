/**
 * Act 2 Cutscene — The Whisper Begins.
 *
 * Plays ONCE per account on the first time the player opens any
 * Act 2 exclusive card. First cutscene in the campaign that
 * features VO — the Bond 60 silent-listening canon means the
 * narrators speak ONCE and briefly, the cutscene's emotional key
 * is what they DO NOT yet say.
 *
 * Five-beat structure totalling ~12s:
 *   1. corridor-thin-wall (2.5s)  parallel corridor framing from
 *                                  the Whisper card
 *   2. whisper-emerges    (2.5s)  silhouette mid-distance speaks;
 *                                  exhale-mist crosses the wall
 *   3. elara-line         (2.0s)  Elara's first VO line — a single
 *                                  sentence, calm
 *   4. human-line         (2.0s)  Human's first VO line — a single
 *                                  matched sentence
 *   5. card-card-card     (3.0s)  card-back materializes from the
 *                                  exhale-mist; hands off to flip
 *
 * Lore basis: Act 2 = "The Engineer's Bench / The Whisper". Bond
 * 60 silent-listening canon means VO is sparse and matched —
 * Elara and the Human each speak ONE line, neither acknowledges
 * the other (Witnesses-meet is Act 4 canon).
 */
import type { CutscenePrompt } from "../types";

export const ACT2_CUTSCENE: Readonly<Record<string, CutscenePrompt>> = Object.freeze({
  "cutscene_act2_whisper_begins": {
    id: "cutscene_act2_whisper_begins",
    title: "Act 2 — The Whisper Begins",
    subtitle: "Plays once on first Act 2 exclusive card pulled",
    trigger: "first ACT_EXCLUSIVES card with id-prefix act2_ pulled per account",
    estimatedDurationSec: 12,
    ambientTrack: "fnord23/substrate_corridor_twilight (TBD — sparse drone, faint warm-amber tonal underlay)",
    beats: [
      {
        beatId: "corridor-thin-wall",
        durationSec: 2.5,
        speaker: "None",
        mood: "mysterious",
        cameraDirection:
          "Camera holds wide on the parallel-corridor composition from the Whisper mythic card. Slow forward dolly over the beat (~5% of distance to the thin-wall).",
        framingPrompt:
          "The substrate twilight corridor — viewer's corridor at frame-foreground, parallel corridor visible through the thin-wall at frame-right. Warm-amber sconces every twenty feet on the left wall. The thin-wall reads as visibly translucent, slightly out-of-phase. The PARALLEL CORRIDOR is empty at beat-start — no silhouette yet.",
        motionPrompt:
          "Slow forward camera dolly. Sconce-flicker subtle (each sconce flickers at slightly different rate, the canonical Whisper signature). No other motion.",
        sfxCue: "ambient_corridor_drone (sparse cool-grey reverb-tail; faint sconce-electrical hum)",
        existingVfxRef: "(none — pure 3D scene)",
      },
      {
        beatId: "whisper-emerges",
        durationSec: 2.5,
        speaker: "None",
        mood: "mysterious",
        cameraDirection:
          "Camera holds dolly position. Slight focus-shift toward the parallel-corridor depth.",
        framingPrompt:
          "A SILHOUETTE materializes at mid-distance in the parallel corridor — backlit, facing AWAY from camera, anthropomorphic enough to register as 'someone' but face-and-features deliberately non-identifiable (matches the Whisper mythic card framing). The silhouette holds still. From where its mouth would be, a faint cool-cyan exhale-mist begins to emerge and DRIFT through the thin-wall toward the viewer's corridor, dissipating at floor-level on the viewer's side.",
        motionPrompt:
          "Silhouette fades in over 0-1s (from full transparency to ~60% opacity at peak). Exhale-mist begins emerging at 0.8s and propagates across the wall over the next 1.7s, pooling and dissipating at the viewer's corridor floor.",
        sfxCue: "exhale_through_wall (subtle vocal-fry exhale + faint reverberant whisper-pitched air-movement; total 1.7s with slow decay)",
        existingVfxRef: "BattleVFX.particleEmitter (re-tuned for cool-cyan exhale-mist with low-velocity drift)",
      },
      {
        beatId: "elara-line",
        durationSec: 2.0,
        speaker: "Elara",
        line: "I am beginning to think this room has another door.",
        mood: "tender",
        cameraDirection:
          "Camera shifts focus from the silhouette to a soft empty space in the viewer's corridor — the implied position of Elara seated unseen at the wall. Camera does NOT show her.",
        framingPrompt:
          "Same corridor composition. Elara is NOT visible — her line is heard from off-frame (the canon framing of Bond 60 is silent-listening; speaking is permitted only as a thought half-spoken). The exhale-mist from beat 2 hangs at the floor on the viewer's side, slowly drifting toward where Elara would be sitting. Sconces flicker once during her line.",
        motionPrompt:
          "Camera focus-shift over 0.4s from silhouette to viewer's-corridor empty space. Mist drifts toward Elara's implied position (slow, ~5cm/sec). Sconces flicker once at ~1.2s (mid-line).",
        sfxCue: "elara_act2_first_line.mp3 (deliver canon Elara VO; total ~1.5s including breath; remaining 0.5s held silence)",
        existingVfxRef: "(none — VO-only beat, no visual VFX)",
      },
      {
        beatId: "human-line",
        durationSec: 2.0,
        speaker: "Human",
        line: "I am beginning to think the door has another room.",
        mood: "tender",
        cameraDirection:
          "Camera shifts focus to a soft empty space at the OPPOSITE side of the viewer's corridor — the implied position of the Human seated unseen at the wall. Camera does NOT show him.",
        framingPrompt:
          "Same corridor. The Human is NOT visible. His line answers Elara's — the symmetry is canonical Bond 60 (matched-but-unaware silent-listening). The exhale-mist from beat 2 has now redistributed to drift between the two implied seated positions, suggesting connective space without confirming connection. Sconces flicker once during his line.",
        motionPrompt:
          "Camera focus-shift over 0.4s to opposite side of corridor. Mist re-drifts subtly to span between the two implied seats. Sconce-flicker once at ~1.2s (matched timing with Elara's beat — visualizes the symmetry).",
        sfxCue: "human_act2_first_line.mp3 (deliver canon Human VO; total ~1.5s including breath; remaining 0.5s held silence)",
        existingVfxRef: "(none — VO-only beat, no visual VFX)",
      },
      {
        beatId: "card-from-mist",
        durationSec: 3.0,
        speaker: "None",
        mood: "neutral",
        cameraDirection:
          "Camera pulls back over 1.5s to the standard pack-opening flip-cycle position. The corridor and silhouette fade to cool-charcoal collector's-felt during the pull-back.",
        framingPrompt:
          "The exhale-mist from beat 2 (still hanging in the viewer's corridor) coalesces upward into the shape of a standard playing card — face-down, deep-violet Hierarchy-style back, S1 sigil at centre — appearing in the standard fan-position. The corridor + silhouette fade out behind the card. The collector's-felt background fades in. The card holds in fan-position, ready for the standard rarity-gated flip ceremony.",
        motionPrompt:
          "Mist coalesces into card-shape over 0-1.5s (smooth gradient transition — particle-density resolves into solid card-mesh). Camera pull-back synchronized over the same 1.5s. 1.5-3.0s: card holds in standard fan-position with subtle motion-blur pulse (1 pulse) before standard flip-cycle begins.",
        sfxCue: "mist_to_card (subtle cardstock-materializing sound layered with fading exhale-tail; transitions cleanly into the standard card-flip-cycle's per-card SFX)",
        existingVfxRef: "BattleVFX.crossfade (re-tuned for mist-to-card morph)",
      },
    ],
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act2",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 2 — The Engineer's Bench / The Whisper",
      "docs/built/ALL_ACTS_ROADMAP.md §Bond progression / Bond 60 silent-listening",
      "(intra-set) §act2_exclusive_mythic_the_whisper — corridor + thin-wall framing source",
      "(intra-set) §act2_exclusive_rare_bond_60_silence — silent-listening canon framing",
      "apps/shared/elaraVoManifest.json (Elara canonical voice anchor)",
      "apps/shared/humanVoManifest.json (Human canonical voice anchor)",
      "(intra-set) §cutscene_card_pack_opening — handoff to standard card-flip",
    ],
  },
});
